import os
import json
from os.path import realpath, dirname
import sys

first_name = sys.argv[1]
second_name = sys.argv[2]

is_verbose = False

current_dir = dirname(realpath(__file__))
#first_path = os.path.join(current_dir,  "result", first_name)
#second_path = os.path.join(current_dir,  "result", second_name)
first_path = first_name
second_path = second_name

with open(first_path, "r") as f:
    first_json = json.load(f)

with open(second_path, "r") as f:
    second_json = json.load(f)

result = {}
for module in sorted(first_json.keys()):
    first_module_map = first_json[module]
    second_module_map = second_json[module]
    for method in sorted(first_module_map.keys()):
        first_syscall_set = set(first_module_map[method])
        second_syscall_set = set(second_module_map[method])
        if (len(first_syscall_set) > len(second_syscall_set)):
            #print(f"{module}.{method} {len(first_syscall_set)} -> {len(second_syscall_set)}")
            output = f"<< {module}.{method} {len(first_syscall_set)} -> {len(second_syscall_set)}"
            if is_verbose: output += f" {first_syscall_set - second_syscall_set}"
        elif (len(first_syscall_set) < len(second_syscall_set)):
            output = f">> {module}.{method} {len(first_syscall_set)} -> {len(second_syscall_set)}"
            if is_verbose: output += f" {second_syscall_set - first_syscall_set}"
        else:
            output = ""
            if is_verbose: output += f"{module}.{method}"
        if (output):
            print(output)
