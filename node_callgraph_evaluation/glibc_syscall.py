import sys
import os
from os.path import realpath, dirname

current_dir = dirname(realpath(__file__))
callgraph_path = os.path.join(current_dir, "data", "glibc.callgraph.modify")
x64_syscall_path = os.path.join(current_dir, "data", "x64_syscall.txt")

with open(callgraph_path, "r") as f:
    data = f.readlines()

function_set = set()
call_graph = dict()

callers = set()
callees = set()

for item in data:
    item = item.strip().split(":")
    assert len(item) == 2
    item = list(map(lambda x: x.strip().replace(" ", ""), item))
    if item[1].endswith(".c") or \
            item[1].endswith(".h") or \
            item[1].startswith("*") or \
            item[0] == "":
        continue

    function_set.add(item[0])
    function_set.add(item[1])
    callers.add(item[0])
    callees.add(item[1])
    if item[0] not in call_graph:
        call_graph[item[0]] = set()
    call_graph[item[0]].add(item[1])

# syscall num-name and name-num map
with open(x64_syscall_path, "r") as f:
    data = f.readlines()
syscall_num_name_map = dict()
syscall_name_num_map = dict()
for item in data:
    item = item.strip().split()
    assert len(item) == 2
    syscall_num_name_map[item[1]] = item[0]
    syscall_name_num_map[item[0]] = item[1]
def syscall_name(syscall):
    return syscall_num_name_map[syscall[8:-1]]
#def syscall_num(name):
#    return syscall_name_num_map[name]


# filter_syscalls = {
#     'syscall(201)', 'syscall(15)', 'syscall(23)', 'syscall(58)',
#     'syscall(133)', 'syscall(132)', 'syscall(261)', 'syscall(96)',
#     'syscall(22)', 'syscall(235)', 'syscall(156)'
# }
filter_syscalls = {}
#for item in filter_syscalls:
#    print(syscall_name(item), end=" ")
#print()

# resolve one function's syscall set
def syscall_worklist(function, is_debug=False):
    def debug(msg):
        if is_debug: print(f"[*] {msg}")

    if function not in call_graph:
        return set()

    visited_set = set()
    worklist = list(call_graph[function])
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

        if current_item in filter_syscalls:
            debug(f"{current_item} has filtered")
            pass
        elif current_item.startswith("syscall("):
            tmp = syscall_name(current_item)
            syscalls.add(tmp)
            debug(f"add to syscalls: {current_item}({tmp})")
        elif current_item not in callers:
            debug(f"{current_item} has no callee")
            continue
        else:
            tmp = list(call_graph[current_item])
            worklist = tmp + worklist
            debug(f"add to worklist: {tmp}")

    return syscalls

# test and debug
if __name__ == "__main__":
    if len(sys.argv) > 2:
        result = syscall_worklist(sys.argv[1], int(sys.argv[2]))
    else:
        result = syscall_worklist(sys.argv[1], 0)
    print(result)
