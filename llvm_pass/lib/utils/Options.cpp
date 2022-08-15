#include "utils/Options.h"

const cl::list<std::string> Options::InputFilenames(
        cl::Positional,
        cl::OneOrMore,
        cl::desc("<input bitcode files>")
);

const cl::opt<bool> Options::OutputVerbose(
        "out-verbose",
        llvm::cl::init(false),
        llvm::cl::desc("verbose output")
);

const cl::opt<bool> Options::IsRunModulePass(
        "modulepass",
        llvm::cl::init(false),
        llvm::cl::desc("run module pass")
);

const cl::opt<bool> Options::IsRunMethodPass(
        "methodpass",
        llvm::cl::init(false),
        llvm::cl::desc("run method pass")
);

const cl::opt<bool> Options::IsRunV8Pass(
        "v8pass",
        llvm::cl::init(false),
        llvm::cl::desc("run v8 pass")
);

const cl::opt<bool> Options::IsRunLibCPass(
        "libcpass",
        llvm::cl::init(false),
        llvm::cl::desc("run libc pass")
);

const cl::opt<bool> Options::IsRunTestPass(
        "clonePass",
        llvm::cl::init(false),
        llvm::cl::desc("run clonePass pass")
);

const cl::opt<std::string> Options::LibcFunction(
        "libc",
        llvm::cl::init(""),
        llvm::cl::desc("path of libc_syscall")
);