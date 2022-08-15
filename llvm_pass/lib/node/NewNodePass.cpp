#include "../../include/node/NewNodePass.h"

/*
struct node_module {
  0: int nm_version;
  1: unsigned int nm_flags;
  2: void* nm_dso_handle;
  3: const char* nm_filename;
  4: node::addon_register_func nm_register_func;
  5: node::addon_context_register_func nm_context_register_func;
  6: const char* nm_modname;
  7: void* nm_priv;
  8: struct node_module* nm_link;
};
 * */

void NewNodePass::runPass(Module *_module) {
    this->module = _module;
    // collectionBindingModuleNameAndInitFunctions();
    // collectionMethodNameToCxxFunctionMap();
    clonePass();
}

// step1: Traversal all (struct.node::node_module _module) to collection binding module names and init functions.
void NewNodePass::collectionBindingModuleNameAndInitFunctions() {
    for (auto & globalItem : module->globals()) {
        if (!globalItem.hasName() || !globalItem.hasInitializer()) continue;
        if (!globalItem.getName().startswith("_ZL7_module")) continue; // find all "_module"

        Type* globalItemType = globalItem.getValueType();
        auto* globalStructType = dyn_cast<StructType>(globalItemType);
        if (globalStructType == nullptr || !globalStructType->hasName())
            continue;
        // ensure type of "_module" is "struct node::node_module"
        if (!globalStructType->getName().equals("struct.node::node_module"))
            continue;

        auto constantStruct = dyn_cast<ConstantStruct>(globalItem.getInitializer());
        auto fileString = Utils::argToString(constantStruct->getOperand(3));
        auto initFunctionValue = constantStruct->getOperand(5); // nm_context_register_func
        auto moduleName = Utils::argToString(constantStruct->getOperand(6)); // nm_modname
        if (auto initFunction = dyn_cast<Function>(initFunctionValue)) {
            DBG(moduleName << "\t" << fileString << "\t" << Utils::demangle(initFunction->getName().str()) << "\n");
            this->moduleNameToModuleInfoMap[moduleName].initFunc = initFunction;
            this->moduleNameToModuleInfoMap[moduleName].initFuncName = initFunction->getName();
            this->moduleNameToModuleInfoMap[moduleName].demangledInitFuncName = Utils::demangle(initFunction->getName().str());
            this->moduleNameToModuleInfoMap[moduleName].moduleFileName = fileString;
            this->initFunctionNameSet.insert(initFunction->getName());
        }
    }
}

void NewNodePass::collectionMethodNameToCxxFunctionMap() {
    for (auto item : this->moduleNameToModuleInfoMap) {
        auto moduleName = item.first;
        auto & moduleInfo = item.second;
        llvm::outs() << moduleName << "\n";
        analysisInitFunction(moduleInfo.initFunc, moduleInfo.methodNameToCxxFunctionSet);
        llvm::outs() << "\n";
    }
}

void NewNodePass::analysisInitFunction(llvm::Function * function, std::set<MethodNameToCxxFunctionPair> & methodNameToCxxFunctionSet) {
    for (auto & BB: *function) {
        for (auto & inst : BB) {
            auto * cb = dyn_cast<llvm::CallBase>(&inst);
            if (cb == nullptr) continue; // not a callInst

            if (cb->getCalledFunction() == nullptr) continue;
            auto calledName = cb->getCalledFunction()->getName();

            if (calledName.contains("SetConstructorFunctionEN")) {
                auto apiNameArg = cb->getArgOperand(2);
                auto apiName = Utils::argToString(apiNameArg);
                if (apiName.empty()) continue;
                // auto apiImplArg = cb->getArgOperand(3);
                // auto apiImplName = dyn_cast<Function>(apiImplArg)->getName();

                llvm::outs() << "SetConstructorFunction\t" << apiName << "\n"; // << "\t" << apiImplName << "\n";
            }
        }
    }
}

void NewNodePass::clonePass() {
    std::map<std::string, std::set<uint64_t>> functionNameToArgOffsetsMap;
    for (auto &func : this->module->functions()) {
        if (func.isDeclaration())
            continue;
        std::set<std::pair<Value*, uint64_t>> funcArgSet;
        for (uint64_t offset = 0; offset < func.arg_size(); offset++) {
            auto * arg = func.getArg(offset);
            if (arg->getType()->isPointerTy() && arg->getType()->getPointerElementType()->isFunctionTy()) {
                funcArgSet.insert(std::make_pair(arg, offset));
            }
        }
        if (funcArgSet.empty())
            continue;
        collectionCallableFunctionArgumentFunctions(func, funcArgSet, functionNameToArgOffsetsMap);
    }
    // json_t result(functionNameToArgOffsetsMap);
    // llvm::outs() << result.dump(4);

    std::map<std::string, std::set<uint64_t>> functionNameToArgOffsetsMap_;
    for (auto & item : functionNameToArgOffsetsMap) {
        auto originFunctionName = item.first;
        auto argOffsets = item.second;
        assert(argOffsets.size() == 1);

        auto * originFunction = this->module->getFunction(StringRef(originFunctionName));
        unsigned int argOffset = *argOffsets.begin();

        recursiveProcess(originFunction, argOffset);
        llvm::outs() << "\n";
    }

    std::error_code EC;
    raw_fd_ostream OS("new_modified.bc", EC, llvm::sys::fs::OF_None);
    llvm::WriteBitcodeToFile(*this->module, OS);
}

void NewNodePass::recursiveProcess(llvm::Function *originFunction, unsigned int argOffset) {
    std::set<CallBase*> callBaseSet;
    std::set<BitCastOperator*> bitcastOperatorSet;
    for (auto *originFunctionUser : originFunction->users()) {
        if (auto * callBase = llvm::dyn_cast<CallBase>(originFunctionUser)) {
            callBaseSet.insert(callBase);
        } else if (auto * bitcastOperator = llvm::dyn_cast<BitCastOperator>(originFunctionUser)) {
            bitcastOperatorSet.insert(bitcastOperator);
        } else {
            llvm::outs() << "[wtf] " << *originFunctionUser << "\n";
        }
    }

    for (auto * callBase: callBaseSet) {
        mainProcess(originFunction, callBase, argOffset, false, nullptr);
    }
    if (!this->replaceCallBaseVector.empty())
        this->replaceCallBaseVector.pop_back();

    for (auto * bitcastOperator : bitcastOperatorSet) {
        std::set<CallBase*> callBaseSet_;
        for (auto *bitcastOperatorUser : bitcastOperator->users()) {
            if (auto * callBase = llvm::dyn_cast<CallBase>(bitcastOperatorUser)) {
                callBaseSet_.insert(callBase);
            }
        }
        for (auto * callBase_ : callBaseSet_) {
            mainProcess(originFunction, callBase_, argOffset, true, bitcastOperator);
        }
    }
}

void NewNodePass::mainProcess(llvm::Function* originFunction,
                              llvm::CallBase* callBase,
                              unsigned int argOffset,
                              bool isBitcast,
                              llvm::BitCastOperator* bitCastOperator) {
    auto *functionTyArg = callBase->getArgOperand(argOffset);
    if (auto *calledFunction = dyn_cast<Function>(functionTyArg->stripPointerCasts())) {
        llvm::outs() << "[debug] [replaceCallBaseVector_size] " << this->replaceCallBaseVector.size() << "\n";
        this->vmap.clear();
        createAndReplaceFunction(originFunction, calledFunction, callBase, this->vmap, isBitcast, bitCastOperator);
        if (!this->replaceCallBaseVector.empty() && !isBitcast) {
            for (int i = this->replaceCallBaseVector.size() - 1; i >=0; i--) {
                if (this->vmap.count(this->replaceCallBaseVector[i]) == 0)
                    continue;
                Value * new_value = this->vmap[this->replaceCallBaseVector[i]];
                auto new_callbase = llvm::dyn_cast<CallBase>(new_value);
                this->vmap.clear();
                if (new_callbase->getCalledOperand()->stripPointerCasts() == nullptr) llvm::outs() << "fuck\n";
                if (auto * bitcastOperator = llvm::dyn_cast<BitCastOperator>(new_callbase->getCalledOperand())) {
                    auto * origin_func = llvm::dyn_cast<Function>(new_callbase->getCalledOperand()->stripPointerCasts());
                    createAndReplaceFunction(origin_func, calledFunction, new_callbase, this->vmap, true,
                                             bitcastOperator);
                } else {
                    createAndReplaceFunction(new_callbase->getCalledFunction(), calledFunction, new_callbase, this->vmap, false,
                                             nullptr);
                }
            }
        }
    } else {
        llvm::outs() << "[debug] [need analysis]" << originFunction->getName() << "\t" << *functionTyArg << "\t"
                     << Utils::getSourceLoc(callBase) << "\n";
        std::deque<Value *> worklist;
        std::set<Value *> visited;
        worklist.push_back(functionTyArg);

        while (!worklist.empty()) {
            auto *currentItem = worklist.front();
            worklist.pop_front();
            if (visited.end() != visited.find(currentItem)) { continue; }

            visited.insert(currentItem);
            if (auto *loadInst = llvm::dyn_cast<llvm::LoadInst>(currentItem)) {
                // llvm::outs() << "[LoadInst]: " << *loadInst << "\n";
                auto *src_inst = loadInst->getOperand(0);
                for (auto *inst_user: src_inst->users()) {
                    if (auto *store_inst = dyn_cast<StoreInst>(inst_user)) {
                        if (store_inst->getOperand(1) != src_inst) continue;
                        worklist.push_back(store_inst->getOperand(0));
                    }
                }
            } else if (auto *argument = dyn_cast<Argument>(currentItem)) {
                llvm::outs() << "[debug] [argument] " << *currentItem << "\t" << argument->getArgNo() << "\n";

                this->replaceCallBaseVector.push_back(callBase);
                recursiveProcess(argument->getParent(), argument->getArgNo());
                return;
            } else if (isa<CallInst>(currentItem)) {
                continue;
            } else {
                llvm::outs() << "[others] " << *currentItem << "\n";
            }
        }
    }
}

void NewNodePass::createAndReplaceFunction(llvm::Function* originFunction,
                                           llvm::Function* calledFunction,
                                           llvm::CallBase* callBase,
                                           ValueToValueMapTy& vmap_,
                                           bool isBitcast,
                                           llvm::BitCastOperator* bitCastOperator) {
    std::string new_func_name = originFunction->getName().str() + "." + calledFunction->getName().str();
    auto *replaced_func = this->module->getFunction(llvm::StringRef(new_func_name));
    llvm::outs() << "[debug] [replaced]" << originFunction->getName() << " -> " << new_func_name << "\t"
                 << Utils::getSourceLoc(callBase) << "\n";
    if (replaced_func == nullptr) {
        auto *new_func = llvm::CloneFunction(originFunction, vmap_);
        new_func->setName(new_func_name);
        if (isBitcast) {
            auto * bitCastInst = llvm::CastInst::Create(Instruction::BitCast, new_func, bitCastOperator->getDestTy(), "", callBase);
            callBase->setCalledOperand(bitCastInst);
        } else {
            callBase->setCalledFunction(new_func);
        }
    } else {
        if (isBitcast) {
            auto *bitCastInst = llvm::CastInst::Create(Instruction::BitCast, replaced_func,
                                                       bitCastOperator->getDestTy(), "", callBase);
            callBase->setCalledOperand(bitCastInst);
        } else {
            callBase->setCalledFunction(replaced_func);
        }
    }
}

void NewNodePass::collectionCallableFunctionArgumentFunctions(
        llvm::Function& func,
        std::set<std::pair<Value*, uint64_t>> &funcArgSet,
        std::map<std::string, std::set<uint64_t>> &functionNameToArgOffsetsMap
        ) {
    for (auto item : funcArgSet) {
        auto * arg = item.first;
        auto offset = item.second;

        std::deque<Value*> worklist;
        std::set<Value*> visited;
        worklist.push_back(arg);

        while (!worklist.empty()) {
            auto * currentItem = worklist.front();
            worklist.pop_front();
            if (visited.end() != visited.find(currentItem)) { continue; }

            visited.insert(currentItem);
            for (auto * user : currentItem->users()) {
                if (auto * storeInst = llvm::dyn_cast<llvm::StoreInst>(user)) {
                    //llvm::outs() << "[StoreInst] " << *storeInst << "\n";
                    auto *srcValue = storeInst->getOperand(0);
                    auto *dstValue = storeInst->getOperand(1);
                    // if (isa<GlobalVariable>(dstValue)) continue;
                    if (srcValue == currentItem) { worklist.push_back(dstValue); }
                } else if (auto * loadInst = llvm::dyn_cast<llvm::LoadInst>(user)) {
                    //llvm::outs() << "[LoadInst]: " << *loadInst << "\n";
                    worklist.push_back(loadInst);
                } else if (auto * callInst = llvm::dyn_cast<CallInst>(user)) {
                    //llvm::outs() << "[CallInst]: " << *callInst << "\n";
                    if (callInst->getCalledOperand() == currentItem &&
                        callInst->getFunction()->getName().equals(func.getName())) {
                        functionNameToArgOffsetsMap[func.getName().str()].insert(offset);
                    }
                } else if (auto * castInst = llvm::dyn_cast<CastInst>(user)) {
                    // llvm::outs() << "[CastInst] " << *castInst << "\n";
                    worklist.push_back(castInst);
                } else if (auto phiNode = llvm::dyn_cast<PHINode>(user)) {
                    // llvm::outs() << "[PHINode] " << *phiNode << "\n";
                    worklist.push_back(phiNode);
                } else if (isa<CmpInst>(user) || isa<ReturnInst>(user)) {
                    continue;
                } else {
                    llvm::outs() << func.getName() << "\n";
                    // llvm::outs() << demangle(func.getName().str()) << "\n";
                    llvm::outs() << "[Others] " << *user << "\n";
                }
            }
        }
    }

}
