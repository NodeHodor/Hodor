#include "WPA/NodePass.h"
#include "llvm/IR/InlineAsm.h"
#include "Util/SVFUtil.h"

void SVF::NodePass::runOnModule(SVF::SVFModule *svfModule) {
    // init
    SVFIRBuilder builder;
    this->module = svfModule;

    llvm::errs() << "[*] start build SVFIR...";
    this->pag = builder.build((this->module));
    llvm::errs() << "end\n";

    llvm::errs() << "[*] start pointer analysis...";
    if (SVF::Options::PASelected.isSet(SVF::PointerAnalysis::FSSPARSE_WPA))
        this->pointAnalyzer = new SVF::FlowSensitive(this->pag);
    else if (SVF::Options::PASelected.isSet(SVF::PointerAnalysis::VFS_WPA))
        this->pointAnalyzer = new SVF::VersionedFlowSensitive(this->pag);
    else
        this->pointAnalyzer = new SVF::AndersenWaveDiff(this->pag);


    this->pointAnalyzer->analyze();
    llvm::errs() << "end\n";

    llvm::errs() << "[*] start special passes...";
    // todo: Options::syscallPass
    if (SVF::Options::syscallPass) {
        parseLibcSyscall();
    }
    collectionPotentialPointedFunction();

    if (SVF::Options::libuvPass) {
        parseLibuv();
    }
    llvm::errs() << "end\n";

    llvm::errs() << "[*] start fill GlobalContext...";
    this->fillGlobalContext();
    llvm::errs() << "end\n";

    llvm::errs() << "[*] start dump json...";
    GlobalContext::dumpJson();
    llvm::errs() << "end\n";
}

void SVF::NodePass::collectionPotentialPointedFunction() {
    for (auto * svfFunc : *module) {
        auto * func = svfFunc->getLLVMFun();
        if (func->isDeclaration()) continue;
        // if (!func->getName().equals("__stdio_read")) continue;

        // llvm::outs() << "\n==========================" << func->getName() << "\n";
         SVF::FIFOWorkList<llvm::Value*> worklist;
         std::unordered_set<llvm::Value*> visited;
         worklist.push(func);

         bool findStoreInst = false;
         while (!worklist.empty()) {
             auto * currentItem = worklist.pop();
             if (visited.find(currentItem) != visited.end())
                 continue;
             else
                 visited.insert((currentItem));

             // llvm::outs() << "[currentItem]: " << *currentItem << "\n";
             for (auto * user : currentItem->users()) {
                 if (auto callBase = llvm::dyn_cast<llvm::CallBase>(user)) {
                     for (auto & arg : callBase->args()) {
                         if (arg == func) {
                             findStoreInst = true;
                             break;
                         }
                     }
                 } else if (auto aliasInst = llvm::dyn_cast<llvm::GlobalAlias>(user)) {
                     // llvm::outs() << "\n[GlobalAlias] " << *aliasInst;
                     worklist.push(aliasInst);
                 } else if (auto bitcastInst = llvm::dyn_cast<llvm::BitCastInst>(user)) {
                     // llvm::outs() << "\n[BitCastInst] " << *bitcastInst;
                     worklist.push(bitcastInst);
                 } else if (auto bitcastOperator = llvm::dyn_cast<llvm::BitCastOperator>(user)) {
                     // llvm::outs() << "\n[BitCastOperator] " << *bitcastOperator;
                     worklist.push(bitcastOperator);
                 } else if (auto storeInst = llvm::dyn_cast<llvm::StoreInst>(user)) {
                     // llvm::outs() << "\n[StoreInst] find!!!" << *storeInst;
                     findStoreInst = true;
                     break;
                 } else if (auto constant = llvm::dyn_cast<llvm::Constant>(user)) {
                     /// todo: how we handle constant
                     // llvm::outs() << "\n[constant] find!!!" << *constant;
                     findStoreInst = true;
                     break;
                 } else {
                     llvm::outs() << "\n[WTF???]" << func->getName() << "\t" << *user;
                 }
             }
             if (findStoreInst && SVF::SVFUtil::isComplexFunctionType(func->getFunctionType())) {
             // if (findStoreInst) {
                 // if (!SVF::SVFUtil::isComplexFunctionType(func->getFunctionType())) {
                 //     llvm::outs() << *func->getFunctionType() << " " << func->getName() << "\n";
                 //     continue;
                 // }
                 std::string funcSignature;
                 llvm::raw_string_ostream ro(funcSignature);

                 this->potentialFunctionSet.insert(func);

                 ro << *func->getFunctionType() << " " << func->getName();
                 GlobalContext::potentialPointFunctionNames.insert(ro.str());
                 break;
             }
         }
        // if (func->hasAddressTaken() && SVF::SVFUtil::isComplexFunctionType(func->getFunctionType())) {
        //     std::string funcSignature;
        //     llvm::raw_string_ostream ro(funcSignature);

        //     this->potentialFunctionSet.insert(func);

        //     ro << *func->getFunctionType() << " " << func->getName();
        //     GlobalContext::potentialPointFunctionNames.insert(ro.str());
        //     break;
        // }
    }

}

void SVF::NodePass::fillGlobalContext() {
    const auto & funcToCallGraphNodeMap = this->pointAnalyzer->getPTACallGraph()->getFunToCallGraphNodeMap();
    for (auto item : funcToCallGraphNodeMap) {
        auto svfFunc = item.first;
        auto callerName = svfFunc->getLLVMFun()->getName();
        if (callerName.startswith("llvm."))
            continue;
        auto callerNode = item.second;
        for (auto edge : callerNode->getOutEdges()) {
            auto dstCallGraphNode =  edge->getDstNode();
            auto calleeName = dstCallGraphNode->getFunction()->getLLVMFun()->getName();
            if (calleeName.startswith("llvm."))
                continue;
            GlobalContext::callerToCalleesMap[callerName.str()].insert(calleeName.str());
        }

        if (svfFunc->isDeclaration()) {
            GlobalContext::declarationFuncNames.insert(callerName.str());
        } else {
            GlobalContext::definitionFuncNames.insert(callerName.str());
        }

        // s32_t status;
        // char *realname = abi::__cxa_demangle(callerName.str().c_str(), 0, 0, &status);
        // llvm::errs() << callerName << "\t" << realname << "\n";
        // free(realname);
    }

    const auto & indirectCallSites = this->pointAnalyzer->getPAG()->getIndirectCallsites();
    for (auto callsiteItem : indirectCallSites) {
        auto cs = callsiteItem.first;
        if (!this->pointAnalyzer->hasIndCSCallees(cs)) {
            //llvm::outs() << SVF::SVFUtil::value2String(cs->getCallSite()) << "\n";
            auto callInst = llvm::dyn_cast<llvm::CallInst>(cs->getCallSite());
            if (callInst == nullptr || callInst->isInlineAsm()) continue;

            //GlobalContext::noTargetCallsite.insert(cs);
            this->tmpNoTargetCallsite.insert(cs);

            // if (SVF::Options::syscallPass)
            //     this->tmpNoTargetCallsite.insert(cs);
            // else
            //     GlobalContext::noTargetCallsite.insert(cs);
        }
    }

    // todo: Options::syscallPass
    if (SVF::Options::syscallPass) {
        fillSyscallToGlobalContext();
    }
    for (auto * cs : this->tmpNoTargetCallsite) {
        // llvm::outs() << "\n" << cs->getCaller()->getName() << "\t" << SVF::SVFUtil::value2String(cs->getCallSite()) << "\n";
        auto * csFunctionType = SVFUtil::getLLVMCallSite(cs->getCallSite()).getFunctionType();
        if (csFunctionType->isVarArg() || !SVFUtil::isComplexFunctionType(csFunctionType)) {
            GlobalContext::noTargetCallsite.insert(cs);
            continue;
        }
        /// if (csFunctionType->isVarArg()) {
        ///     llvm::outs() << "[varArg] ignore\n";
        ///     continue;
        /// }
        /// if (!SVFUtil::isComplexFunctionType(csFunctionType)) {
        ///     llvm::outs() << "[simpleFunction] ignore\n";
        ///     continue;
        /// }
        bool isFound = false;
        for (auto * potentialFunc : this->potentialFunctionSet) {
            if (SVFUtil::compareFunctionType(csFunctionType, potentialFunc->getFunctionType())) {
                GlobalContext::potentialCallerToCalleesMap[cs->getCaller()->getName()].insert(potentialFunc->getName().str());
                isFound = true;
            }
        }
        if (!isFound)
            GlobalContext::noTargetCallsite.insert(cs);
        else
            GlobalContext::potentialTargetCallsite.insert(cs);
    }

    if (SVF::Options::libuvPass)
        replaceLibuvFsFunctions();

    //finally, add alias to callerToCalleesMap (just copy)
    parseGlobalAlias();
}

void SVF::NodePass::setSyscallFunctions() {
    std::string syscallFunctions[] = {
            "syscall",
            "sccp",
            "__syscall_cp_c",
            "__syscall_cp",
            "__setxid"
    };
    for (const auto& item : syscallFunctions) {
        syscallFunctionSet.insert(item);
    }
}

void SVF::NodePass::parseSyscallFunctions(llvm::Function *func, llvm::CallBase *callBase) {
    if (syscallFunctionSet.find(func->getName().str()) != syscallFunctionSet.end()) {
        parseSyscallFunctionsInternal(callBase);
    }
}

void SVF::NodePass::parseSyscallFunctionsInternal(llvm::CallBase *callBase) {
    auto parentFunc = callBase->getParent()->getParent();
    auto firstArg = callBase->getOperand(0);
    auto constantFirstArg = llvm::dyn_cast<llvm::ConstantInt>(firstArg);
    if (constantFirstArg == nullptr) {
        if (syscallFunctionSet.find(parentFunc->getName().str()) != syscallFunctionSet.end() ||
            parentFunc->getName().equals("do_setxid"))
            return;

        llvm::errs() << "[warning: not constant] " << parentFunc->getName() << " " << *callBase << "\n";
        return;
    }

    auto sysNum = constantFirstArg->getZExtValue();
    functionSyscallMap[parentFunc->getName().str()].insert(sysNum);
    // llvm::outs() << "[syscall] " << parentFunc->getName() << " " << sysNum << "\n";
}

void SVF::NodePass::parseLibcSyscall() {

    setSyscallFunctions();

    for (auto &func: *module) {

        if (func->isDeclaration()) {
            parseSyscallCornerCase(func);
            continue;
        }

        // if (SVF::SVFUtil::isDeadFunction(func->getLLVMFun())) {
        //     llvm::outs() << "[deadfunc] " << func->getName() << "\n";
        // }
        for (auto &bb: *func->getLLVMFun()) {
            for (auto &inst: bb) {
                auto *callInst = llvm::dyn_cast<llvm::CallInst>(&inst);
                if (callInst == nullptr) continue;

                auto *calledOperand = callInst->getCalledOperand();
                auto *callBase = llvm::dyn_cast<llvm::CallBase>(callInst);

                if (auto *inlineAsm = llvm::dyn_cast<llvm::InlineAsm>(calledOperand)) {
                    auto asmString = llvm::StringRef(inlineAsm->getAsmString());
                    if (!asmString.contains("syscall")) continue;

                    if (!asmString.equals("syscall"))
                        llvm::errs() << "[warning: not only syscall] " << asmString << "\n";

                    parseSyscallFunctionsInternal(callBase);
                }
                else if (auto callee = llvm::dyn_cast<llvm::Function>(callInst->getCalledOperand())) {
                    if (callee->getName().startswith("llvm.")) continue;
                    parseSyscallFunctions(callee, callBase);
                }
                else if (auto alias = llvm::dyn_cast<llvm::GlobalAlias>(callInst->getCalledOperand())) {
                    // llvm::errs() << "[GlobalAlias] " << func.getName() << " " << *alias << "\n";
                    auto _callee = llvm::dyn_cast<Function>(alias->getAliasee());
                    if (_callee == nullptr) {
                        // llvm::errs() << "[warning: alias not function] " << func->getLLVMFun()->getName() << " " << *alias << "\n";
                        continue;
                    }
                    parseSyscallFunctions(_callee, callBase);
                }
                    // indirect call
                else { /* llvm::errs() << "[WTF] " << func.getName() << " " << *callInst << "\n";*/ }
            }
        }
    }
}

void SVF::NodePass::parseSyscallCornerCase(const SVFFunction *svfFunc)
{
    auto funcName = svfFunc->getLLVMFun()->getName();
    if (funcName.equals("__clone"))
        functionSyscallMap["__clone"] = std::set<uint64_t>({56,60});
    else if (funcName.equals("__restore_rt"))
        functionSyscallMap["__restore_rt"] = std::set<uint64_t>({15});
    else if (funcName.equals("__set_thread_area"))
        functionSyscallMap["__set_thread_area"] = std::set<uint64_t>({158});
    else if (funcName.equals("__unmapself"))
        functionSyscallMap["__unmapself"] = std::set<uint64_t>({11, 60});
}

void SVF::NodePass::fillSyscallToGlobalContext() {
    for (const auto& item : functionSyscallMap) {
        auto callerName = item.first;
        auto sysNums = item.second;
        for (auto sysNum : sysNums) {
            auto syscallName = "syscall_" + std::to_string(sysNum);
            GlobalContext::callerToCalleesMap[callerName].insert(syscallName);
        }
    }
}

void SVF::NodePass::parseGlobalAlias() {
    for (auto alias : this->module->aliases()) {
        if (auto func = llvm::dyn_cast<llvm::Function>(alias->getAliasee())) {
            auto aliasName = alias->getName();
            auto funcName = func->getName();
            if (GlobalContext::callerToCalleesMap.find(funcName.str()) != GlobalContext::callerToCalleesMap.end()) {
                // llvm::errs() << funcName << " " << aliasName << "\n";
                GlobalContext::callerToCalleesMap[aliasName.str()] = GlobalContext::callerToCalleesMap[funcName.str()];
            }
        }
    }
}

void SVF::NodePass::parseLibuv() {
    parseLibuvFsFunctions();
}

void SVF::NodePass::parseLibuvFsFunctions() {
    std::set<llvm::Function*> candidateFunctions;
    std::map<int64_t, llvm::Function*> fsFunctionFsTypeMap;

    llvm::Function * fsWorkFunc = nullptr;

    for (auto &func: *module) {
        if (func->isDeclaration()) continue;

        for (auto &bb: *func->getLLVMFun()) {
            for (auto &inst: bb) {
                auto *callInst = llvm::dyn_cast<llvm::CallInst>(&inst);
                if (callInst == nullptr) continue;

                auto *calledOperand = callInst->getCalledOperand();
                if (auto callee = llvm::dyn_cast<llvm::Function>(calledOperand)) {
                    if (callee->hasName() && callee->getName().equals("uv__fs_work")) {
                        if (fsWorkFunc == nullptr) fsWorkFunc = callee;
                        candidateFunctions.insert(func->getLLVMFun());
                        // llvm::outs() << "found: " << func->getName() << "\n";
                        goto next_func;
                    }
                }
            }
        }
next_func:
        ;
    }

    for (auto func : candidateFunctions) {
        int64_t fsTypeNum = 0;
        if (parseLibuvFsOneFunction(func, &fsTypeNum)) {
            llvm::outs() << "[result] " << func->getName() << "\t " << fsTypeNum << "\n";
            fsFunctionFsTypeMap[fsTypeNum] = func;
        } else {
            llvm::outs() << "[error] " << func->getName() << " not found\n";
        }
    }

    if (fsWorkFunc == nullptr) return;
    parseLibuvFsWorkFunction(fsWorkFunc, fsFunctionFsTypeMap);
}

bool SVF::NodePass::parseLibuvFsOneFunction(llvm::Function *func, int64_t *fsTypeNum) {
    if (func->arg_size() < 2)
        return false;

    auto reqArgument = func->getArg(1);
    assert(reqArgument->getName().equals("req"));
    //assert(reqArgument->getType()->getStructName().equals("struct.uv_fs_s"));
    //llvm::outs() << *reqArgument->getType() << "\n";
    SVF::FIFOWorkList<llvm::Value*> worklist;
    std::unordered_set<llvm::Value*> visited;
    worklist.push(reqArgument);
    while (!worklist.empty()) {
        auto * currentItem = worklist.pop();
        if (visited.find(currentItem) != visited.end())
            continue;
        else
            visited.insert((currentItem));

        // llvm::outs() << "[currentItem]: " << *currentItem << "\n";
        for (auto * user : currentItem->users()) {

            if (auto * storeInst = llvm::dyn_cast<llvm::StoreInst>(user)) {
                // llvm::outs() << "[StoreInst]: " << *storeInst << "\n";
                auto * srcValue = storeInst->getOperand(0);
                auto * dstValue = storeInst->getOperand(1);
                // llvm::outs() << currentItem << "\t" << *currentItem << "\n";
                // llvm::outs() << srcValue    << "\t" << *srcValue    << "\n";
                // llvm::outs() << dstValue    << "\t" << *dstValue    << "\n";
                if (srcValue == currentItem) {
                    worklist.push(dstValue);
                }
            } else if (auto * loadInst = llvm::dyn_cast<llvm::LoadInst>(user)) {
                // llvm::outs() << "[LoadInst]: " << *loadInst << "\n";
                worklist.push(loadInst);
            } else if (auto * gepInst = llvm::dyn_cast<llvm::GetElementPtrInst>(user)) {
                // llvm::outs() << "[GepInst]: " << *gepInst << "\n";
                auto structIdxValue = gepInst->getOperand(1);
                auto fieldIdxValue = gepInst->getOperand(2);
                int64_t structIdx, fieldIdx;
                if (!getIntFromValue(structIdxValue, &structIdx))
                    continue;
                if (!getIntFromValue(fieldIdxValue, &fieldIdx))
                    continue;
                if (structIdx != 0 || fieldIdx != 3) // trick: we need found uv_fs_s's fourth field, fs_type
                    continue;
                for (auto * gepUser : gepInst->users()) {
                    if (auto * finalStoreInst = llvm::dyn_cast<llvm::StoreInst>(gepUser)) {
                        auto * fsTypeValue = finalStoreInst->getOperand(0);
                        if (!getIntFromValue(fsTypeValue, fsTypeNum)) continue;
                        return true;
                    }
                }
            }
            else {
                //llvm::outs() << "[unknown user]: " << *user << "\n";
            }
        }
    }
    return false;
}

bool SVF::NodePass::getIntFromValue(llvm::Value * value, int64_t *numResult) {
    auto constantIntValue = llvm::dyn_cast<llvm::ConstantInt>(value);
    if (constantIntValue == nullptr)
        return false;
    *numResult = constantIntValue->getSExtValue();
    return true;
}

void SVF::NodePass::parseLibuvFsWorkFunction(llvm::Function *fsWorkFunc,
                                             std::map<int64_t, llvm::Function *> &fsFuncTypeMap) {
    for (auto &bb : *fsWorkFunc) {
        for (auto &inst : bb) {
            if (auto * switchInst = llvm::dyn_cast<llvm::SwitchInst>(&inst)) {
                for (auto & case_ : switchInst->cases()) {
                    auto caseFsType = case_.getCaseValue()->getSExtValue();
                    auto caseSuccessor = case_.getCaseSuccessor();
                    auto sourceFsFuncName = fsFuncTypeMap[caseFsType]->getName().str();
                    for (auto & inst_ : *caseSuccessor) {
                        auto *callInst = llvm::dyn_cast<llvm::CallInst>(&inst_);
                        if (callInst == nullptr) continue;

                        auto *calledOperand = callInst->getCalledOperand();
                        if (auto callee = llvm::dyn_cast<llvm::Function>(calledOperand)) {
                            if (callee->hasName()) {
                                this->libuvFsCallerCalleeMap[sourceFsFuncName].insert(callee->getName().str());
                            }
                        }
                    }
                }
            }
        }
    }
}

void SVF::NodePass::replaceLibuvFsFunctions() {
    for (auto item : this->libuvFsCallerCalleeMap) {
        auto sourceFunctionName = item.first;
        auto dstFunctionNames = item.second;

        auto & currentCallees = GlobalContext::callerToCalleesMap[sourceFunctionName];
        auto iter = currentCallees.find("uv__fs_work");
        if (iter == currentCallees.end())
            continue;
        currentCallees.erase(iter);
        for (const auto& dstName : dstFunctionNames) {
            currentCallees.insert(dstName);
        }
    }

}
