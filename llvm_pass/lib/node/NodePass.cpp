#include "node/NodePass.h"

StringRef argToString(Value* value) {
    auto tmp0 = dyn_cast<Constant>(value);
    if (tmp0 == nullptr) return "";
    auto tmp1 = dyn_cast<Constant>(tmp0->getOperand(0));
    auto tmp2 = dyn_cast<ConstantDataArray>(tmp1->getOperand(0));
    return tmp2->getAsCString();
}
void NodePass::runMethodPass(Module *module) {

    for (auto & function : *module) {
        if (function.isDeclaration()) continue; // not a function definition
        // if (!function.getName().contains("10Initialize")) continue; // not an Initialize function
        // if (!function.getName().contains("10Initialize") || !function.getName().contains("7Context")) continue; // not an Initialize function
        // llvm::outs() << "initialize_func: " << function.getName() << "\n";

        for (auto & BB: function) {
            for (auto & inst : BB) {
                auto * cb = dyn_cast<llvm::CallBase>(&inst);
                if (cb == nullptr) continue; // not a callInst

                if (cb->getCalledFunction() == nullptr) continue;
                auto calledName = cb->getCalledFunction()->getName();

                if (calledName.contains("_ZN4node11Environment22SetConstructorFunctionEN2v85LocalINS1_6ObjectEEEPKcNS2_INS1_16FunctionTemplateEEENS0_26SetConstructorFunctionFlagE")) {
                    auto apiNameArg = cb->getArgOperand(2);
                    auto apiName = argToString(apiNameArg);
                    if (apiName.empty()) continue;
                    // auto apiImplArg = cb->getArgOperand(3);
                    // auto apiImplName = dyn_cast<Function>(apiImplArg)->getName();

                    llvm::outs() << "SetConstructorFunction\t" << apiName << "\n"; // << "\t" << apiImplName << "\n";
                } else if (calledName.contains("Method") && calledName.contains("Set")) {
                    if (cb->getNumArgOperands() < 4) continue; // not a method-setting function

                    auto apiNameArg = cb->getArgOperand(2);
                    auto apiImplArg = cb->getArgOperand(3);
                    auto apiName = argToString(apiNameArg);
                    auto apiFunction = dyn_cast<Function>(apiImplArg);
                    auto apiImplName = apiFunction->getName();

                    if (calledName.contains("SetMethod")) {
                        methodPair.insert(std::make_pair(apiName, apiFunction));
                        // llvm::outs() << "SetMethod\t" << apiName << "\t" << apiImplName << "\n";
                    } else if (calledName.contains("SetProtoMethod")) {
                        protoMethodPair.insert(std::make_pair(apiName, apiFunction));
                        // llvm::outs() << "SetProtoMethod\t" << apiName << "\t" << apiImplName << "\n";
                    } else if (calledName.contains("SetInstanceMethod")) {
                        instanceMethodPair.insert(std::make_pair(apiName, apiFunction));
                        // llvm::outs() << "SetInstanceMethod\t" << apiName << "\t" << apiImplName << "\n";
                    } else if (calledName.contains("SetMethodNoSideEffect")) {
                        methodNSEPair.insert(std::make_pair(apiName, apiFunction));
                        // llvm::outs() << "SetMethodNoSideEffect\t" << apiName << "\t" << apiImplName << "\n";
                    } else if (calledName.contains("SetProtoMethodNoSideEffect")) {
                        protoMethodNSEPair.insert(std::make_pair(apiName, apiFunction));
                        // llvm::outs() << "SetProtoMethodNoSideEffect\t" << apiName << "\t" << apiImplName << "\n";
                    } else if (calledName.contains("SetFastMethod")) {
                        // auto apiFastImplArg = cb->getArgOperand(3);
                        // auto apiFastImplName = dyn_cast<Function>(apiFastImplArg)->getName();
                        fastMethodPair.insert(std::make_pair(apiName, apiFunction));
                        // llvm::outs() << "SetFastMethod\t" << apiName << "\t" << apiImplName << "\t" << apiFastImplName
                        //              << "\n";
                    }
                }
            }
        }
    }

    printAPIResult();
    analysisIndirectCall();
}

void NodePass::printAPIResult() {
    for (auto api : methodPair)         { llvm::outs() << "SetMethod\t" << api.first << "\t" << api.second->getName() << "\n";}
    for (auto api : protoMethodPair)    { llvm::outs() << "SetProtoMethod\t" << api.first << "\t" << api.second->getName() << "\n";}
    for (auto api : instanceMethodPair) { llvm::outs() << "SetInstanceMethod\t" << api.first << "\t" << api.second->getName() << "\n";}
    for (auto api : methodNSEPair)      { llvm::outs() << "SetMethodNoSideEffect\t" << api.first << "\t" << api.second->getName() << "\n";}
    for (auto api : protoMethodNSEPair) { llvm::outs() << "SetProtoMethodNoSideEffect\t" << api.first << "\t" << api.second->getName() << "\n";}
}

void NodePass::analysisIndirectCall_internal(APINameFuncPair &api) {
    auto apiName = api.first;
    auto function = api.second;

    llvm::outs() << "\n" << function->getName() << "\n";
    // llvm::outs() << "\nNow analysis: " << function->getName() << "\n";

    for (auto & BB : *function) {
        for (auto & inst : BB) {
            auto * cb = dyn_cast<llvm::CallBase>(&inst);
            if (cb == nullptr) continue; // not a callInst

            if (cb->getCalledFunction() == nullptr) continue;
            auto calledName = cb->getCalledFunction()->getName();
            // llvm::outs() << calledName << "\n";

            if (calledName.contains("SyncCall")) {
                if (cb->getNumArgOperands() < 5) continue;
                auto indirectCallName = argToString(cb->getArgOperand(3));
                auto indirectCallFunction = dyn_cast<Function>(cb->getArgOperand(4));

                llvm::outs() << "SyncCall\t" << indirectCallName << "\t" << indirectCallFunction->getName() << "\n";

            } else if (calledName.contains("AsyncCall")) {
                if (cb->getNumArgOperands() < 7) continue;
                auto indirectCallName = argToString(cb->getArgOperand(3));
                auto indirectCallFunction = dyn_cast<Function>(cb->getArgOperand(6));
                auto indirectCallAfterFunction = dyn_cast<Function>(cb->getArgOperand(5));

                if (indirectCallFunction == nullptr || indirectCallAfterFunction == nullptr) // todo: phi node(node_file.cc mkdir)
                    llvm::outs() << "AsyncCall\t" << indirectCallName << "\n";
                else
                    llvm::outs() << "AsyncCall\t" << indirectCallName << "\t" << indirectCallFunction->getName() << "\t" << indirectCallAfterFunction->getName() << "\n";
            } else if (calledName.contains("AsyncDestCall")) {
                if (cb->getNumArgOperands() < 9) continue;
                auto indirectCallName = argToString(cb->getArgOperand(3));
                auto indirectCallFunction = dyn_cast<Function>(cb->getArgOperand(8));
                auto indirectCallAfterFunction = dyn_cast<Function>(cb->getArgOperand(7));

                // if (indirectCallFunction == nullptr || indirectCallAfterFunction == nullptr) continue; // todo: phi node(node_file.cc mkdir)

                llvm::outs() << "AsyncDestCall\t" << indirectCallName << "\t" << indirectCallFunction->getName() << "\t" << indirectCallAfterFunction->getName() << "\n";
            } else if (calledName.contains("Dispatch")) {
                auto indirectCallFunction = dyn_cast<Function>(cb->getArgOperand(1));
                llvm::outs() << "Dispatch\t" <<  indirectCallFunction->getName() << "\n";
            }

        }

    }
}

void NodePass::analysisIndirectCall_apiSet(NodePass::APISet & apiSet) {
    for (auto api : apiSet) {
        analysisIndirectCall_internal(api);
    }
}

void NodePass::analysisIndirectCall() {
    analysisIndirectCall_apiSet(methodPair);
    analysisIndirectCall_apiSet(protoMethodPair);
    analysisIndirectCall_apiSet(instanceMethodPair);
    analysisIndirectCall_apiSet(methodNSEPair);
    analysisIndirectCall_apiSet(protoMethodNSEPair);
}

void NodePass::runModulePass(Module *module) {

    for (auto & globalItem : module->globals()) {
        if (!globalItem.hasName() || !globalItem.hasInitializer()) continue;
        if (!globalItem.getName().startswith("_ZL7_module")) continue;

        Type* globalItemType = globalItem.getValueType();
        auto* globalStructType = dyn_cast<StructType>(globalItemType);
        if (globalStructType == nullptr || !globalStructType->hasName())
            continue;
        if (!globalStructType->getName().equals("struct.node::node_module"))
            continue;

        auto constantStruct = dyn_cast<ConstantStruct>(globalItem.getInitializer());
        auto fileString = argToString(constantStruct->getOperand(3));
        auto initFunctionValue = constantStruct->getOperand(5);
        auto moduleName = argToString(constantStruct->getOperand(6));
        if (auto initFunction = dyn_cast<Function>(initFunctionValue)) {
            llvm::outs() << moduleName << "\t" << fileString << "\t" << initFunction->getName() << "\n";
        }

    }

}
