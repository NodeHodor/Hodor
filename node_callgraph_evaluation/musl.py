from utils.constant import syscall_map, libc_funcs
import json
import os
from os.path import realpath, dirname

current_dir = dirname(realpath(__file__))
callgraph_path = os.path.join(current_dir, "data", "musl.callgraph")


with open(callgraph_path, "r") as f:
    callgraph_data = json.load(f)
    callgraph = callgraph_data["call_graph"]
    potential_callgraph = callgraph_data["potential_call_graph"]

for item in potential_callgraph.keys():
    if item in callgraph:
        callgraph[item] = callgraph[item] + potential_callgraph[item]
    else:
        callgraph[item] = potential_callgraph[item]


def syscall_worklist(function, filtered_function = None, is_debug=False):
    def debug(msg):
        if is_debug: print(f"[*] {msg}")

    if function not in callgraph:
        return set()

    visited_set = set()
    worklist = list(callgraph[function])
    syscalls = set()

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

        if (filtered_function != None and current_item in filtered_function):
            debug(f"{current_item} has been filtered")
            continue
        elif current_item.startswith("syscall_"):
            syscall_num = int(current_item[8:])
            syscall_name = syscall_map[syscall_num]
            syscalls.add(syscall_name)
            debug(f"add to syscalls: {current_item}({syscall_name}({syscall_num}))")
        elif current_item not in callgraph.keys():
            debug(f"{current_item} has no callee")
            continue
        else:
            tmp = list(callgraph[current_item])
            worklist = worklist + tmp
            debug(f"add to worklist: {tmp}")

    return syscalls

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 2:
        result = syscall_worklist(sys.argv[1], set(), bool(sys.argv[2]))
    else:
        result = syscall_worklist(sys.argv[1], set(), False)
    print(result)
