#include "utils/utils.h"

namespace Utils {
    std::string getSourceLocOfFunction(const Function *F) {
        std::string str;
        raw_string_ostream rawStr(str);
        if (llvm::DISubprogram *SP =  F->getSubprogram())
        {
            if (SP->describes(F))
                rawStr << "in line: " << SP->getLine() << " file: " << SP->getFilename();
        }
        return rawStr.str();
    }

    std::string getSourceLoc(const Value* val)
    {
        if(val==nullptr)  return "{ empty val }";

        std::string str;
        raw_string_ostream rawstr(str);
        rawstr << "{ ";

        if (const auto *inst = llvm::dyn_cast<Instruction>(val))
        {
            if (llvm::isa<AllocaInst>(inst))
            {
                for (llvm::DbgInfoIntrinsic *DII : llvm::FindDbgAddrUses(const_cast<Instruction*>(inst)))
                {
                    if (auto *DDI = llvm::dyn_cast<llvm::DbgDeclareInst>(DII))
                    {
                        auto *DIVar = llvm::cast<llvm::DIVariable>(DDI->getVariable());
                        rawstr << "line: " << DIVar->getLine() << " file: " << DIVar->getFilename();
                        break;
                    }
                }
            }
            else if (MDNode *N = inst->getMetadata("dbg"))   // Here I is an LLVM instruction
            {
                unsigned Line;
                StringRef File;
                auto* Loc = llvm::cast<llvm::DILocation>(N);                   // DILocation is in DebugInfo.h
                auto inlineLoc = Loc->getInlinedAt();
                if(inlineLoc) {
                    Line = inlineLoc->getLine();
                    File = inlineLoc->getFilename();
                } else {
                    Line = Loc->getLine();
                    File = Loc->getFilename();
                }
                rawstr << "line: " << Line <<  "  file: " << File;
            }
        }
        else if (const auto* argument = llvm::dyn_cast<Argument>(val))
        {
            if (argument->getArgNo()%10 == 1)
                rawstr << argument->getArgNo() << "st";
            else if (argument->getArgNo()%10 == 2)
                rawstr << argument->getArgNo() << "nd";
            else if (argument->getArgNo()%10 == 3)
                rawstr << argument->getArgNo() << "rd";
            else
                rawstr << argument->getArgNo() << "th";
            rawstr << " arg " << argument->getParent()->getName() << " "
                   << getSourceLocOfFunction(argument->getParent());
        }
        else if (const auto* gvar = llvm::dyn_cast<GlobalVariable>(val))
        {
            rawstr << "Glob ";
            NamedMDNode* CU_Nodes = gvar->getParent()->getNamedMetadata("llvm.dbg.cu");
            if(CU_Nodes)
            {
                for (unsigned i = 0, e = CU_Nodes->getNumOperands(); i != e; ++i)
                {
                    llvm::DICompileUnit *CUNode = llvm::cast<llvm::DICompileUnit>(CU_Nodes->getOperand(i));
                    for (llvm::DIGlobalVariableExpression *GV : CUNode->getGlobalVariables())
                    {
                        llvm::DIGlobalVariable * DGV = GV->getVariable();

                        if(DGV->getName() == gvar->getName())
                        {
                            rawstr << "line: " << DGV->getLine() << " file: " << DGV->getFilename();
                        }

                    }
                }
            }
        }
        else if (const auto* func = llvm::dyn_cast<Function>(val)) {
            rawstr << getSourceLocOfFunction(func);
        }
        else if (const auto* bb = llvm::dyn_cast<BasicBlock>(val)) {
            rawstr << "basic block: " << bb->getName() << " " << getSourceLoc(bb->getFirstNonPHI());
        }
        else { }
        rawstr << " }";

        return rawstr.str();
    }

    std::string demangle(const std::string& mangledName) {
        int status;
        char *demangledName = abi::__cxa_demangle(mangledName.c_str(), nullptr, nullptr, &status);

        if (demangledName != nullptr) {
            std::string realName = demangledName;
            std::free(demangledName);
            return realName;
        } else {
            return "";
        }
    }
}

