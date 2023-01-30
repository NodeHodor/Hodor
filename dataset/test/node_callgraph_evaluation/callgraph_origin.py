from utils.filtered_func import filtered_function
from utils.constant import syscall_map, libc_funcs
from musl import syscall_worklist
import json
import os
from os.path import realpath, dirname

current_dir = dirname(realpath(__file__))
callgraph_path = os.path.join(current_dir,  "data", "libnode_uv.callgraph.origin")
nodeapi_path = os.path.join(current_dir,  "data", "node_api.json")

with open(callgraph_path, "r") as f:
    callgraph_data = json.load(f)
    callgraph = callgraph_data["call_graph"]

with open(nodeapi_path, "r") as f:
    node_api_map = json.load(f)

filtered_function = set()


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

result = {}
for module in sorted(node_api_map.keys()):
    module_map = node_api_map[module]
    for method in sorted(module_map.keys()):
        cxx_method = module_map[method]
        if module not in result:
            result[module] = {}
        result[module][method] = callgraph_worklist(cxx_method)
        print(len(result[module][method]))
with open("result/result.origin.json", "w") as f:
    json.dump(result, f)
