#include "utils/utils.h"

class NodePass {
public:
    typedef std::pair<llvm::StringRef, llvm::Function*> APINameFuncPair;
    typedef std::set<APINameFuncPair> APISet;
public:
    NodePass() = default;
    ~NodePass() = default;

    void runMethodPass(Module* module);
    void runModulePass(Module* module);
    void printAPIResult();

    void analysisIndirectCall();
    void analysisIndirectCall_apiSet(APISet & apiSet);
    void analysisIndirectCall_internal(APINameFuncPair & api);

private:
    APISet methodPair;
    APISet protoMethodPair;
    APISet methodNSEPair;
    APISet protoMethodNSEPair;
    APISet instanceMethodPair;
    APISet fastMethodPair;
};
