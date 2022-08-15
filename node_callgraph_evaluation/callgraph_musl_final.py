from utils.constant import syscall_map, libc_funcs
from musl import syscall_worklist
import json
import os
from os.path import realpath, dirname

current_dir = dirname(realpath(__file__))
callgraph_path = os.path.join(current_dir,  "data", "libnode_uv.callgraph.uv_libc_functionClone")
nodeapi_path = os.path.join(current_dir,  "data", "node_api.json")

with open(callgraph_path, "r") as f:
    callgraph_data = json.load(f)
    callgraph = callgraph_data["call_graph"]

with open(nodeapi_path, "r") as f:
    node_api_map = json.load(f)

filtered_function = set()
filtered_function.add("syscall")
filtered_function.add("abort")
filtered_function.add("__pthread_exit")
filtered_function.add("pthread_cancel")
filtered_function.add("uvwasi__free")
filtered_function.add("uv__fs_done")
filtered_function.add("uv_close")
filtered_function.add("_ZN4node8WatchdogD2Ev")
filtered_function.add("_ZN4node7tracing5AgentD2Ev")
filtered_function.add("_ZNSt10unique_ptrIN4node7tracing5AgentESt14default_deleteIS2_EE5resetEPS2_")

filtered_function.add("_ZN4node6AssertERKNS_13AssertionInfoE")
filtered_function.add("_ZN4node11EnvironmentD2Ev")
filtered_function.add("_ZN4node6Buffer12_GLOBAL__N_112CallbackInfo20CallAndResetCallbackEv")
filtered_function.add("_ZN4node7tracing5AgentD2Ev")
filtered_function.add("_ZN4node10FatalErrorEPKcS1_")
filtered_function.add("_ZN4node14SigintWatchdogC2EPN2v87IsolateEPb")
filtered_function.add("_ZN4node10BaseObject8DeleteMeEPv")
filtered_function.add("_ZN4node10BaseObject11OnGCCollectEv")
filtered_function.add("_ZN4node11Environment18RunAtExitCallbacksEv")
filtered_function.add("_ZN4node22PerIsolatePlatformData19DecreaseHandleCountEv")

filtered_function.add("_ZNKSt14default_deleteIN2v84TaskEEclEPS1_")
filtered_function.add("_ZNKSt14default_deleteIN2v814MicrotaskQueueEEclEPS1_")
filtered_function.add("_ZNKSt14default_deleteIN2v813EmbedderGraph4NodeEEclEPS2_")
filtered_function.add("_ZNKSt14default_deleteIN2v821MeasureMemoryDelegateEEclEPS1_")
filtered_function.add("_ZNKSt14default_deleteIN4node21InspectorParentHandleEEclEPS1_")
filtered_function.add("_ZNKSt14default_deleteIN2v824ConvertableToTraceFormatEEclEPS1_")
filtered_function.add("_ZNKSt14default_deleteIN4node7tracing16AsyncTraceWriterEEclEPS2_")
filtered_function.add("_ZNKSt14default_deleteIN2v88platform7tracing11TraceWriterEEclEPS3_")
filtered_function.add("_ZNKSt14default_deleteIN4node28NativeSymbolDebuggingContextEEclEPS1_")

filtered_function.add("BrotliFree")
filtered_function.add("BrotliEnsureRingBuffer")
filtered_function.add("BrotliDecoderStateCleanup")
filtered_function.add("BrotliEncoderDestroyInstance")
filtered_function.add("BrotliDecoderDestroyInstance")
filtered_function.add("BrotliDecoderStateCleanupAfterMetablock")

filtered_function.add("nghttp2_mem_free")
filtered_function.add("nghttp2_mem_free2")

filtered_function.add("_ZN2v86String26ExternalStringResourceBase7DisposeEv")
filtered_function.add("_ZNK4node4heap7JSGraph12CreateObjectEv")
filtered_function.add("_ZN4node20SigintWatchdogHelper26InformWatchdogsAboutSignalEv")
filtered_function.add("_ZNSt16_Sp_counted_baseILN9__gnu_cxx12_Lock_policyE2EE10_M_destroyEv")



def callgraph_worklist(function, is_debug=False):
    def debug(msg):
        if is_debug: print(f"[*] {msg}")

    if function not in callgraph:
        return []

    visited_set = set()
    worklist = list(callgraph[function])
    syscall_result = set()
    libc_result = set()

    debug(f"start analysis: {function}")
    debug(f"{function}'s calles: {worklist}")

    visited_set.add(function)
    while len(worklist) != 0:
        current_item = worklist.pop(0)
        if current_item in visited_set:
            debug(f"{current_item} has visited")
            continue
        else:
            visited_set.add(current_item)

        debug(f"now analysis: {current_item}")

        if current_item in filtered_function:
            debug(f"{current_item} has been filterd")
            continue
        elif current_item.startswith("syscall_"):
            syscall_num = int(current_item[8:])
            syscall_name = syscall_map[syscall_num]
            syscall_result.add(syscall_name)
            debug(f"add to syscalls: {current_item}({syscall_name}({syscall_num}))")
        elif current_item in libc_funcs:
            libc_result.add(current_item)
            debug(f"add to libc_func: {current_item}")
        elif current_item not in callgraph.keys():
            debug(f"{current_item} has no callee")
            continue
        else:
            tmp = list(callgraph[current_item])
            worklist = worklist + tmp
            debug(f"add to worklist: {tmp}")
    for item in libc_result:
        syscall_tmp = syscall_worklist(item, filtered_function, is_debug)
        syscall_result |= syscall_tmp

    return sorted(syscall_result)
    #return sorted(libc_result), sorted(syscall_result)

#print(callgraph_worklist("_ZN4node10contextify16ContextifyScript16RunInThisContextERKN2v820FunctionCallbackInfoINS2_5ValueEEE", True))
#print(callgraph_worklist("_ZN4node6Buffer12_GLOBAL__N_16Swap64ERKN2v820FunctionCallbackInfoINS2_5ValueEEE", True))
#print(callgraph_worklist("_ZN4node12_GLOBAL__N_117CompressionStreamINS0_20BrotliEncoderContextEE5WriteILb0EEEvRKN2v820FunctionCallbackInfoINS5_5ValueEEE", True))

#print(callgraph_worklist("_ZN4node10contextifyL13MeasureMemoryERKN2v820FunctionCallbackInfoINS1_5ValueEEE", True))
#exit()

result = {}
for module in sorted(node_api_map.keys()):
    module_map = node_api_map[module]
    for method in sorted(module_map.keys()):
        cxx_method = module_map[method]
        if module not in result:
            result[module] = {}
        result[module][method] = callgraph_worklist(cxx_method)
        print(len(result[module][method]))
with open("result/result.final.json", "w") as f:
    json.dump(result, f)
