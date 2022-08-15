#include "Util/GlobalContext.h"

GlobalContext::CallsiteFunctionsMap GlobalContext::trueCallsiteFunctionsMap;
GlobalContext::CallsiteFunctionsMap GlobalContext::falseCallsiteFunctionsMap;
GlobalContext::CallerToCalleesMap GlobalContext::callerToCalleesMap;
GlobalContext::CallerToCalleesMap GlobalContext::potentialCallerToCalleesMap;
std::set<std::string> GlobalContext::definitionFuncNames;
std::set<std::string> GlobalContext::declarationFuncNames;
std::set<const SVF::CallICFGNode*> GlobalContext::noTargetCallsite;
std::set<const SVF::CallICFGNode*> GlobalContext::potentialTargetCallsite;
std::set<std::string> GlobalContext::potentialPointFunctionNames;
