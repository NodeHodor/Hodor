#ifndef SVF_GLOBALCONTEXT_H
#define SVF_GLOBALCONTEXT_H

#include "MemoryModel/PointerAnalysis.h"
#include "Util/json.h"
#include "Util/SVFUtil.h"
#include "Util/Options.h"
#include <cxxabi.h>

using json_t = nlohmann::json;


struct GlobalContext {
    typedef std::map<const llvm::Instruction*, std::set<const llvm::Function*>> CallsiteFunctionsMap;
    typedef std::map<std::string, std::set<std::string>> CallerToCalleesMap;

    GlobalContext() = default;

    static CallsiteFunctionsMap falseCallsiteFunctionsMap;
    static CallsiteFunctionsMap trueCallsiteFunctionsMap;
    static CallerToCalleesMap callerToCalleesMap;
    static CallerToCalleesMap potentialCallerToCalleesMap;
    static std::set<std::string> definitionFuncNames;
    static std::set<std::string> declarationFuncNames;
    static std::set<const SVF::CallICFGNode*> noTargetCallsite;
    static std::set<const SVF::CallICFGNode*> potentialTargetCallsite;
    // static std::map<const llvm::Function*, std::set<const SVF::CallICFGNode*>> functionToNoTargetCallsiteMap;

    static std::set<std::string> potentialPointFunctionNames;


    static void dumpJson() {
        json_t jsonResult;

        // ============================================================== call graph
        json_t callGraph(GlobalContext::callerToCalleesMap);
        jsonResult["call_graph"] = callGraph;

        json_t potentialCallGraph(GlobalContext::potentialCallerToCalleesMap);
        jsonResult["potential_call_graph"] = potentialCallGraph;

        // ============================================================== filtered indirect call
        std::map<std::string, std::set<std::string>> filteredIndirectCallMap;
        for (const auto& item : GlobalContext::falseCallsiteFunctionsMap) {
            auto callSite = item.first;
            auto funcs = item.second;
            for (auto func : funcs) {
                filteredIndirectCallMap[SVF::SVFUtil::value2String(callSite)].insert(func->getName().str());
            }
        }
        json_t filteredIndirectJson(filteredIndirectCallMap);
        jsonResult["filtered"] = filteredIndirectJson;

        // ============================================================== true indirect call
        std::map<std::string, std::set<std::string>> trueIndirectCallMap;
        for (const auto & item : GlobalContext::trueCallsiteFunctionsMap) {
            auto callSite = item.first;
            auto funcs = item.second;
            for (auto func : funcs) {
                trueIndirectCallMap[SVF::SVFUtil::value2String(callSite)].insert(func->getName().str());
            }
        }
        json_t trueIndirectJson(trueIndirectCallMap);
        jsonResult["indirect"] = trueIndirectJson;

        // ==============================================================  declaration and definition
        json_t declarationJson(GlobalContext::declarationFuncNames);
        jsonResult["declaration"] = declarationJson;
        json_t definitionJson(GlobalContext::definitionFuncNames);
        jsonResult["definition"] = definitionJson;

        // ==============================================================  noTarget callsite and potential callsite
        std::set<std::string> noTargetCallsiteSet;
        for (auto item : GlobalContext::noTargetCallsite) {
            noTargetCallsiteSet.insert(SVF::SVFUtil::value2String(item->getCallSite()));
        }
        json_t noTargetJson(noTargetCallsiteSet);
        jsonResult["noTargetCallsite"] = noTargetJson;

        std::set<std::string> potentialTargetCallsiteSet;
        for (auto item : GlobalContext::potentialTargetCallsite) {
            potentialTargetCallsiteSet.insert(SVF::SVFUtil::value2String(item->getCallSite()));
        }
        json_t potentialTargetJson(potentialTargetCallsiteSet);
        jsonResult["potentialTargetCallsite"] = potentialTargetJson;

        // ============================================================== potential pointed functions
        json_t potentialFuncsJson(potentialPointFunctionNames);
        jsonResult["potential"] = potentialFuncsJson;


        // ============================================================== final dump
        if (SVF::Options::resultFile.empty()) {
            llvm::outs() << jsonResult.dump(4) << "\n";
        } else {
            std::error_code err;
            llvm::ToolOutputFile F(SVF::Options::resultFile.c_str(), err, llvm::sys::fs::F_None);
            if (err) {
                llvm::outs() << jsonResult.dump(4) << "\n";
            } else {
                F.os() << jsonResult.dump(4) << "\n";
                F.os().close();
                F.keep();
            }
        }

        // llvm::outs() << jsonResult.dump(4);
    }
};
