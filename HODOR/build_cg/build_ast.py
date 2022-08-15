from email.mime import base
from struct import pack
import sys
import os
import time
import json
from subprocess import call

ast_dict = dict()
base_dir = ""
package_path = ""
build_ast = os.path.join(os.path.dirname(__file__), './build_ast/build_ast.js')

def shell(cmd, out = None, err = None):
    return call(cmd, shell = True, stdout = out, stderr = err)

def bfs(dir_path, ast_path):
    if not os.path.exists(f"{base_dir}/{ast_path}"):
        cmd = f"mkdir {base_dir}/{ast_path}"
        shell(cmd)
    for file in os.listdir(f"{package_path}/{dir_path}"):
        if not os.path.isdir(f"{package_path}/{dir_path}/{file}"):
            if file.endswith(".js"):
                file_path = f"{package_path}/{dir_path}/{file}"
                ast_file_path = f"{base_dir}/{ast_path}/{file}"
                if not os.path.exists(f"{ast_file_path}on"):
                    shell(f"node {build_ast} {file_path} {ast_file_path}on")
        else:
            _dir_path = dir_path
            _ast_path = ast_path
            dir_path = f"{dir_path}/{file}"
            ast_path = f"{ast_path}/{file}"
            bfs(dir_path, ast_path)
            dir_path = _dir_path
            ast_path = _ast_path


def build_package_ast(pack_path):
    global package_path
    global base_dir
    package_path = pack_path
    base_dir = f"./tmp"
    cmd = f"mkdir {base_dir}"
    shell(cmd)

    for file in os.listdir(package_path):
        if not os.path.isdir(f"{package_path}/{file}"):
            if file.endswith(".js"):
                file_path = f"{package_path}/{file}"
                if not os.path.exists(f"{base_dir}/{file}on"):
                    shell(f"node {build_ast} {file_path} {base_dir}/{file}on")
        else:
            bfs(f"{file}", f"{file}")
