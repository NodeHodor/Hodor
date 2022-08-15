#include "utils/utils.h"
#include "utils/Options.h"
#include "node/NodePass.h"
#include "node/NewNodePass.h"

using namespace std;
using namespace llvm;

int main(int argc, char** argv)
{
    sys::PrintStackTraceOnErrorSignal(argv[0]);
    llvm_shutdown_obj Y;

    cl::ParseCommandLineOptions(argc, argv, "struct info analysis\n");
    SMDiagnostic Err;

    if (Options::OutputVerbose) {
        llvm::outs() << "===========================================================\n";
        llvm::outs() << "Total " << Options::InputFilenames.size() << " file(s)\n";
        llvm::outs() << "===========================================================\n";
    }

    NodePass protoMethodPass;
    NewNodePass testPass;
    V8Pass v8Pass;
    LibCPass libCPass;

    for (uint32_t i = 0; i < Options::InputFilenames.size(); ++i) {
        auto *LLVMCtx = new LLVMContext();
        unique_ptr<Module> llvmModule = parseIRFile(Options::InputFilenames[i], Err, *LLVMCtx);
        Module* module = llvmModule.release();

        if (Options::OutputVerbose) {
            llvm::outs() << "===========================================================\n";
            llvm::outs() << "Now analysis " << module->getSourceFileName() << "...\n";
            llvm::outs() << "===========================================================\n";
        }

        if (Options::IsRunMethodPass)
            protoMethodPass.runMethodPass(module);
        if (Options::IsRunModulePass)
            protoMethodPass.runModulePass(module);
        if (Options::IsRunTestPass)
            testPass.runPass(module);

    }
}
