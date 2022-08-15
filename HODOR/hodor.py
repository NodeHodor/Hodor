
import argparse
import sys
import os
import time
from subprocess import call

from build_cg import build_ast
from build_cg import build_cg
from generate_whitelist import generate_whitelist

def shell(cmd, out = None, err = None):
    return call(cmd, shell = True, stdout = out, stderr = err)


parser = argparse.ArgumentParser()
parser.description = "please enter the file type and file path"
parser.add_argument("-f", 
                    "--fileType", 
                    help="file type, including file or package",
                    dest="fileType", 
                    type=str, 
                    default="package")
parser.add_argument("-p", 
                    "--path", 
                    help="file path",
                    dest="path",  
                    default=True)
parser.add_argument("-i", 
                    "--init-name", 
                    help="init file name",
                    dest="init",  
                    default="")

args = parser.parse_args()
build_ast.build_package_ast(args.path)
if args.init:
    bc = build_cg.build_cg(args.path, init_path=args.init)
else:
    bc = build_cg.build_cg(args.path)
bc.build_nodes()
bc.add_inter_edge()
bc.build_cg()
built_in_list = bc.get_built_in()
result = generate_whitelist.test(built_in_list)
generate_whitelist.record(result)
