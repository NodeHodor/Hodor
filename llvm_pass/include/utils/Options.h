#include "utils.h"

class Options
{
public:
    Options(void) = delete;

    static const cl::list<std::string> InputFilenames;

    static const cl::opt<bool> OutputVerbose;

    static const cl::opt<bool> IsRunMethodPass;

    static const cl::opt<bool> IsRunModulePass;

    static const cl::opt<bool> IsRunV8Pass;

    static const cl::opt<bool> IsRunLibCPass;

    static const cl::opt<bool> IsRunTestPass;

    static const llvm::cl::opt<std::string> LibcFunction;
};
