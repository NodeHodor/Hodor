#include "llvm/ADT/DenseMap.h"
#include "llvm/ADT/SmallPtrSet.h"
#include "llvm/ADT/StringExtras.h"
#include "llvm/Analysis/AliasAnalysis.h"
#include "llvm/Bitcode/BitcodeReader.h"
#include "llvm/Bitcode/BitcodeWriter.h"

#include "llvm/Demangle/Demangle.h"
#include "llvm/IR/InstIterator.h"

#include "llvm/IR/AbstractCallSite.h"
#include "llvm/IR/DebugInfo.h"
#include "llvm/IR/Function.h"
#include "llvm/IR/Instructions.h"
#include "llvm/IR/IntrinsicInst.h"
#include "llvm/IR/IRBuilder.h"
#include "llvm/IR/LLVMContext.h"
#include "llvm/IR/Module.h"
#include "llvm/IR/PassManager.h"
#include "llvm/IR/Use.h"
#include "llvm/IR/Verifier.h"
#include "llvm/IRReader/IRReader.h"
#include <llvm/Transforms/Utils/Local.h>	// for FindDbgAddrUses
#include <llvm/Transforms/Utils/Cloning.h>


#include "llvm/Support/CommandLine.h"
#include "llvm/Support/Debug.h"
#include "llvm/Support/FileSystem.h"
#include "llvm/Support/ManagedStatic.h"
#include "llvm/Support/Path.h"
#include "llvm/Support/PrettyStackTrace.h"
#include "llvm/Support/raw_ostream.h"
#include "llvm/Support/Signals.h"
#include "llvm/Support/SystemUtils.h"
#include "llvm/Support/SourceMgr.h"
#include "llvm/Support/ToolOutputFile.h"
using namespace llvm;

#include <set>
#include <map>
#include <string>
#include <vector>
#include <utility>
#include <cxxabi.h>
#include <fstream>
#include <cxxabi.h>


#include "utils/json.hpp"
using json_t = nlohmann::json;

#define KNRM  "\x1B[1;0m"
#define KRED  "\x1B[1;31m"
#define KGRN  "\x1B[1;32m"
#define KYEL  "\x1B[1;33m"
#define KBLU  "\x1B[1;34m"
#define KPUR  "\x1B[1;35m"
#define KCYA  "\x1B[1;36m"

#define DBG(X) DEBUG_WITH_TYPE("pyro", llvm::outs() << __FUNCTION__ << ": " << X << "\n")

namespace Utils {

    inline DIType* getBaseDIType(DIType* typeDI)
    {
        while (isa<DIDerivedType>(typeDI)) {
            typeDI = cast<DIDerivedType>(typeDI)->getBaseType();
        }
        return typeDI;
    }

    inline StringRef argToString(Value* value) {
        if (auto constValue = dyn_cast<Constant>(value)) {
            if (auto _constValue = dyn_cast<Constant>(constValue->getOperand(0))) {
                if (auto constArrayValue = dyn_cast<ConstantDataArray>(_constValue->getOperand(0))) {
                    return constArrayValue->getAsCString();
                }
            }
        }
        return "";
    }

    std::string demangle(const std::string& mangledName);

    std::string  getSourceLoc(const Value *val);
    std::string  getSourceLocOfFunction(const Function *F);


}
