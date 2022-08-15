#include "utils/utils.h"

class NewNodePass {
public:
    typedef std::pair<std::string, llvm::Function*> MethodNameToCxxFunctionPair;

    typedef struct {
        // step1
        llvm::Function* initFunc;
        llvm::StringRef initFuncName;
        std::string demangledInitFuncName;
        llvm::StringRef moduleFileName;

        // step2
        std::set<MethodNameToCxxFunctionPair> methodNameToCxxFunctionSet;
    } moduleInfo;
    typedef std::map<llvm::StringRef, moduleInfo> ModuleNameToModuleInfoMap;
public:
    NewNodePass() = default;
    ~NewNodePass() = default;

    void runPass(Module* _module);

    // step1: Traversal all (struct.node::node_module _module) to collection binding module names and init functions.
    void collectionBindingModuleNameAndInitFunctions();

    // step2: analysis each init_func, collect all binding modules' method names and corresponding c++ functions.
    void collectionMethodNameToCxxFunctionMap();
    void analysisInitFunction(llvm::Function*, std::set<MethodNameToCxxFunctionPair > &);

    // clonePass
    void clonePass();

private:
    llvm::Module* module = nullptr;
    ModuleNameToModuleInfoMap moduleNameToModuleInfoMap;
    std::set<llvm::StringRef> initFunctionNameSet;

    ValueToValueMapTy vmap;
    std::vector<CallBase*> replaceCallBaseVector;

    void collectionCallableFunctionArgumentFunctions(Function &func, std::set<std::pair<Value *, uint64_t>> &funcArgSet,
                                                     std::map<std::string, std::set<uint64_t>> &functionNameToArgOffsetsMap);

    void createAndReplaceFunction(Function *originFunction, Function *calledFunction, CallBase *callBase,
                                  ValueToValueMapTy &vmap_, bool isBitcast, llvm::BitCastOperator* bitCastOperator);

    void mainProcess(Function *originFunction, CallBase *callBase, unsigned int argOffset, bool isBitcast,
                     BitCastOperator *bitCastOperator);

    void recursiveProcess(llvm::Function *originFunction, unsigned int argOffset);
};
