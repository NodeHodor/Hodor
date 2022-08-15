#include "MemoryModel/PointerAnalysisImpl.h"
#include "Util/Options.h"
#include "Util/SVFModule.h"
#include "WPA/Andersen.h"
#include "SVF-FE/SVFIRBuilder.h"
#include "SVF-FE/LLVMModule.h"
#include "Util/GlobalContext.h"
#include "Util/WorkList.h"

namespace SVF
{

    class NodePass {

    public:


        NodePass() = default;
        ~NodePass() { delete pointAnalyzer; }

        void runOnModule(SVFModule * module);
        void fillGlobalContext();

        void setSyscallFunctions();
        void parseSyscallFunctions(llvm::Function* func, llvm::CallBase* callBase);
        void parseSyscallFunctionsInternal(llvm::CallBase *callBase);
        void parseLibcSyscall();
        void fillSyscallToGlobalContext();
        void parseGlobalAlias();
        void parseSyscallCornerCase(const SVFFunction *svfFunc);
        void collectionPotentialPointedFunction();

        void parseLibuv();
        void parseLibuvFsFunctions();
        void parseLibuvFsWorkFunction(llvm::Function *fsWorkFunc, std::map<int64_t, llvm::Function *> &fsFuncTypeMap);
        static bool parseLibuvFsOneFunction(llvm::Function *func, int64_t *fsTypeNum);
        static bool getIntFromValue(llvm::Value *value, int64_t *numResult);
        void replaceLibuvFsFunctions();

    private:
        SVFModule * module = nullptr;
        SVFIR * pag = nullptr;
        // AndersenWaveDiff * pointAnalyzer = nullptr;
        PointerAnalysis * pointAnalyzer = nullptr;

        std::set<std::string> syscallFunctionSet;
        std::map<std::string, std::set<uint64_t>> functionSyscallMap;
        std::map<std::string, std::set<std::string>> libuvFsCallerCalleeMap;

        std::set<const llvm::Function*> potentialFunctionSet;
        std::set<const SVF::CallICFGNode*> tmpNoTargetCallsite;

    };

} // End namespace SVF
