import os
import json

dangerous_syscall_set = {
    "clone",
    "execveat",
    "execve",
    "fork",
    "ptrace",
    "chmod",
    "mprotect",
    "setgid",
    "setreuid",
    "setuid",
    "accept4",
    "accept",
    "bind",
    "connect",
    "listen",
    "recvfrom",
    "socket",
    # "read",
    # "write",
    # "unlink"
    }

with open("{your_dataset_path}/test/node_callgraph_evaluation/result/result.glibc.origin.json") as f_r:
    glibc = json.load(f_r)


with open("{your_dataset_path}/test/node_callgraph_evaluation/result/result.origin.json") as f_r:

    musl = json.load(f_r)

with open("{your_dataset_path}/test/node_callgraph_evaluation/result/result.final.json") as f_r:
    changable = json.load(f_r)

with open("{your_dataset_path}/test/builtin_js.json", "r") as f_r:
    builtin_js_dict = json.load(f_r)

main_set = {
    "mprotect",
    "futex",
    "rt_sigaction",
    "munmap",
    "read",
    "fstat",
    "getpid",
    "open",
    "ioctl",
    "rt_sigprocmask",
    "stat",
    "fcntl",
    "writev",
    "epoll_pwait",
    "pread64",
    "dup3",
    "close",
    "write",
    "getcwd",
    "getdents64",
    "rt_sigreturn",
    "brk",
    "shutdown",
    "statx",
    "readlink",
    "madvise",
    "exit_group",
    "epoll_ctl",
    "mmap",
}

child_set = {
    "read",
    "futex",
    "openat",
    "socket",
    "statx",
    "open",
    "exit",
    "close",
    "write",
    "rt_sigprocmask",
    "fcntl",
    "getcwd",
    "madvise",
    "munmap",
    "mmap",
}

result = {
    "async": 0,
    "glibc": {
        "main_thread": set(),
        # {
        #     # "futex",
        #     # "openat",
        #     # "statx",
        #     # "read",
        #     # "close",
        #     # "ioctl",
        #     # "fcntl",
        #     # "fstat",
        #     # "readlink",
        #     # "stat",
        #     # "dup3",
        #     # "rt_sigprocmask",
        #     # "rt_sigaction",
        #     # "write",
        #     # "epoll_ctl",
        #     # "epoll_wait",
        #     # "munmap",
        #     # "mprotect",
        #     # "madvise",
        #     # "exit_group",
        #     # "pread64",
        #     # "uname",
        #     # "mmap",
        #     # "brk",
        #     # "getpid",
        #     # "rt_sigreturn",
        #     # "epoll_pwait",
        #     # "shutdown",
        #     # "getdents64"
        # },
        "child_thread": set(),
        # {
            # "munmap",
            # "open",
            # "read",
            # "futex",
            # "openat",
            # "write",
            # "statx",
            # "close",
            # "madvise",
            # "exit",
            # "mmap",
            # "socket",
            # "fcntl",
            # "rt_sigprocmask",
        # },
        "dangeer": {
            "main_thread": set(),
            "child_thread": set(),
            "total": set()
        },
        "normal": {
            "main_thread": set(),
            "child_thread": set(),
            "total": set()
        }
    },
    "musl": {
        "main_thread": set(),
        # {
        #     "mprotect",
        #     "futex",
        #     "rt_sigaction",
        #     "munmap",
        #     "read",
        #     "fstat",
        #     "getpid",
        #     "open",
        #     "ioctl",
        #     "rt_sigprocmask",
        #     "stat",
        #     "fcntl",
        #     "writev",
        #     "epoll_pwait",
        #     "pread64",
        #     "dup3",
        #     "close",
        #     "write",
        #     "getcwd",
        #     "getdents64",
        #     "rt_sigreturn",
        #     "brk",
        #     "shutdown",
        #     "statx",
        #     "readlink",
        #     "madvise",
        #     "exit_group",
        #     "epoll_ctl",
        #     "mmap",
        # },
        "child_thread": set(),
        # {
        #    "read",
        #     "futex",
        #     "openat",
        #     "socket",
        #     "statx",
        #     "open",
        #     "exit",
        #     "close",
        #     "write",
        #     "rt_sigprocmask",
        #     "fcntl",
        #     "getcwd",
        #     "madvise",
        #     "munmap",
        #     "mmap",
        # },
        "dangeer": {
            "main_thread": set(),
            "child_thread": set(),
            "total": set()
        },
        "normal": {
            "main_thread": set(),
            "child_thread": set(),
            "total": set()
        },
    },
    "changable": {
        "main_thread": set(),
        # {
        #     "mprotect",
        #     "futex",
        #     "rt_sigaction",
        #     "munmap",
        #     "read",
        #     "fstat",
        #     "getpid",
        #     "open",
        #     "ioctl",
        #     "rt_sigprocmask",
        #     "stat",
        #     "fcntl",
        #     "writev",
        #     "epoll_pwait",
        #     "pread64",
        #     "dup3",
        #     "close",
        #     "write",
        #     "getcwd",
        #     "getdents64",
        #     "rt_sigreturn",
        #     "brk",
        #     "shutdown",
        #     "statx",
        #     "readlink",
        #     "madvise",
        #     "exit_group",
        #     "epoll_ctl",
        #     "mmap",


        #     # "openat",
        #     # "exit",
        #     # "socket"
        # },
        "child_thread": set(),
        # {
        #    "read",
        #     "futex",
        #     "openat",
        #     "socket",
        #     "statx",
        #     "open",
        #     "exit",
        #     "close",
        #     "write",
        #     "rt_sigprocmask",
        #     "fcntl",
        #     "getcwd",
        #     "madvise",
        #     "munmap",
        #     "mmap",
        # },
        "dangeer": {
            "main_thread": set(),
            "child_thread": set(),
            "total": set()
        },
        "normal": {
            "main_thread": set(),
            "child_thread": set(),
            "total": set()
        },
    }
}

async_list = [
    "access@fs",
    "close@fs",
    "stat@fs",
    "lstat@fs",
    "fstat@fs",
    "readlink@fs",
    "ftruncate@fs",
    "fdatesync@fs",
    "fsync@fs",
    "unlink@fs",
    "rmdir@fs",
    "mkdir@fs",
    "realpath@fs",
    "readdir@fs",
    "open@fs",
    "openfilehandle@fs",
    "writebuffer@fs",
    "writeBuffers@fs",
    "read@fs",
    "readbuffers@fs",
    "chmod@fs",
    "fchmod@fs",
    "chown@fs",
    "fchown@fs",
    "lchown@fs",
    "utimes@fs",
    "futimes@fs",
    "lutimes@fs",
    "mkdtemp@fs",
    "getaddrinfo@cares_wrap",
    ""
    ]

glibc_s = set()
musl_s = set()
changable_s = set()

total = dict()

# method_module_list = [
#     "spawn@child_process",
#     # "networkInterfaces@os",
#     # "Socket@net",
#     # "connect@net",
#     # "runInContext@vm"
#     # "writeFile@fs"
# ]
# method_module_list = ['chmodSync@fs', 'execSync@child_process', '@child_process', '@fs', 'writeSync@fs']
def statistic(r, total_async_flag):
    total = dict()
    for sys in r["main_thread"]:
        if sys in dangerous_syscall_set:
            r["dangeer"]["main_thread"].add(sys)
        else:
            r["normal"]["main_thread"].add(sys)
    for sys in r["child_thread"]:
        if sys in dangerous_syscall_set:
            r["dangeer"]["child_thread"].add(sys)
        else:
            r["normal"]["child_thread"].add(sys)
    if total_async_flag:
        total["danger"] = len(r["dangeer"]["main_thread"] | r["dangeer"]["child_thread"])
        total["normal"] = len(r["normal"]["main_thread"] | r["normal"]["child_thread"])
    else:
        total["danger"] = len(r["dangeer"]["main_thread"])
        total["normal"] = len(r["normal"]["main_thread"])
    
    if total_async_flag:
        total["main_thread"] = dict()
        total["main_thread"]["danger"] = len(r["dangeer"]["main_thread"])
        total["main_thread"]["normal"] = len(r["normal"]["main_thread"])
        total["child_thread"] = dict()
        total["child_thread"]["danger"] = len(r["dangeer"]["child_thread"])
        total["child_thread"]["normal"] = len(r["normal"]["child_thread"])
    else:
        total["main_thread"] = dict()
        total["main_thread"]["danger"] = len(r["dangeer"]["main_thread"])
        total["main_thread"]["normal"] = len(r["normal"]["main_thread"])
        total["child_thread"] = dict()
        total["child_thread"]["danger"] = 0
        total["child_thread"]["normal"] = 0
    return(total)

async_method_module_binding_dict = {
    "cares_wrap":{
        "getaddrinfo",
        "getnameinfo"
    },
    "zlib":{
        "write"
    },
    "fs":{
        "access",
        "close",
        "stat",
        "lstat",
        "fstat",
        "readlink",
        "ftruncate",
        "fdatesync",
        "fsync",
        "unlink",
        "rmdir",
        "mkdir",
        "realpath",
        "readdir",
        "open",
        "openfilehandle",
        "writebuffer",
        "writeBuffers",
        "read",
        "readbuffers",
        "chmod",
        "fchmod",
        "chown",
        "fchown",
        "lchown",
        "utimes",
        "futimes",
        "lutimes",
        "mkdtemp",
    }
}

async_method_module_list = [
    # dns
    "lookup@dns",
    "lookupService@dns",
    "resolve@dns",
    "resolve4@dns",
    "resolve6@dns",
    "resolveAny@dns",
    "resolveCname@dns",
    "resolveCaa@dns",
    "resolveMx@dns",
    "resolveNaptr@dns",
    "resolveNs@dns",
    "resolvePtr@dns",
    "resolveSoa@dns",
    "resolveSrv@dns",
    "resolveTxt@dns",
    "reverse@dns",
    # fs
    "access@fs",
    "appendFile@fs",
    "chmod@fs",
    "chown@fs",
    "close@fs",
    "copyFile@fs",
    "cp@fs",
    "createReadStream@fs",
    "createWriteStream@fs",
    "exists@fs",
    "fchmod@fs",
    "fchown@fs",
    "fdatasync@fs",
    "fstat@fs",
    "fsync@fs",
    "ftruncate@fs",
    "futimes@fs",
    "lchmod@fs",
    "lchown@fs",
    "lutimes@fs",
    "link@fs",
    "lstat@fs",
    "mkdir@fs",
    "mkdtemp@fs",
    "open@fs",
    "opendir@fs",
    "read@fs",
    "read@fs",
    "readdir@fs",
    "readFile@fs",
    "readlink@fs",
    "readv@fs",
    "realpath@fs",
    "realpath@fs",
    "rename@fs",
    "rmdir@fs",
    "rm@fs",
    "stat@fs",
    "symlink@fs",
    "truncate@fs",
    "unlink@fs",
    "unwatchFile@fs",
    "utimes@fs",
    "watch@fs",
    "watchFile@fs",
    "write@fs",
    "write@fs",
    "writeFile@fs",
    "writev@fs",
    # crypto
    "generateKey@crypto",
    "generateKeyPair@crypto",
    "hkdf@crypto",
    "pbkdf2@crypto",
    "randomBytes@crypto",
    "randomFill@crypto",
    "verify@crypto",
    "verify@crypto",
    "scrypt@crypto",
    # zlib
    "flush@zlib",
    "params@zlib",
    "brotliCompress@zlib",
    "brotliDecompress@zlib",
    "deflate@zlib",
    "deflateRaw@zlib",
    "gunzip@zlib",
    "gzip@zlib",
    "inflate@zlib",
    "inflateRaw@zlib",
    "unzip@zlib",

]

# print(len(glibc_s), len(musl_s), len(changable_s))

def test(method_module_list):
    total_async_flag = 0
    total = dict()
    for method_module in method_module_list:
        async_flag = 0
        if method_module in async_method_module_list:
            async_flag = 1
            total_async_flag = 1
        if method_module in builtin_js_dict:
            for binding_method_module in builtin_js_dict[method_module]:
                binding_method = binding_method_module.split("@")[0]
                binding_module = binding_method_module.split("@")[1]
                # glibc
                async_binding_flag = 0
                if binding_module in async_method_module_binding_dict:
                    if binding_method in async_method_module_binding_dict[binding_module]:
                        if async_flag == 1:
                            result["async"] = 1
                            async_binding_flag = 1

                if binding_module in glibc:
                    if binding_method in glibc[binding_module]:
                        if async_flag and async_binding_flag:
                            for i in child_set:
                                result["glibc"]["child_thread"].add(i)
                            for sys in glibc[binding_module][binding_method]:
                                result["glibc"]["child_thread"].add(sys)
                        else:
                            for sys in glibc[binding_module][binding_method]:
                                result["glibc"]["main_thread"].add(sys)
                # musl
                if binding_module in musl:
                    if binding_method in musl[binding_module]:
                        for sys in musl[binding_module][binding_method]:
                            # result["musl"]["total"].add(sys)
                            if async_flag and async_binding_flag:
                                for i in child_set:
                                    result["musl"]["child_thread"].add(i)
                                for sys in musl[binding_module][binding_method]:
                                    result["musl"]["child_thread"].add(sys)
                            else:
                                for sys in musl[binding_module][binding_method]:
                                    result["musl"]["main_thread"].add(sys)
                # changable
                if binding_module in changable:
                    if binding_method in changable[binding_module]:
                        for sys in changable[binding_module][binding_method]:
                            # result["changable"]["total"].add(sys)
                            if async_flag and async_binding_flag:
                                for i in child_set:
                                    result["changable"]["child_thread"].add(i)
                                for sys in changable[binding_module][binding_method]:
                                    result["changable"]["child_thread"].add(sys)
                            else:
                                for sys in changable[binding_module][binding_method]:
                                    result["changable"]["main_thread"].add(sys)
        total_async_flag = 1

    total["glibc"] = statistic(result["glibc"], total_async_flag)
    total["musl"] = statistic(result["musl"], total_async_flag)
    total["changable"] = statistic(result["changable"], total_async_flag)
    if result["async"] == 1:
        total["async"] = 1
    else:
        total["async"] = 0

        
    
    return total

with open("/home/nodejs/calm-down-and-carry-up2/result_0117", "r") as f_r:
    lines = f_r.readlines()
    for line in lines:

        result = {
            "async": 0,
            "glibc": {
                "main_thread": {
                    "futex",
                    "openat",
                    "statx",
                    "read",
                    "close",
                    "ioctl",
                    "fcntl",
                    "fstat",
                    "readlink",
                    "stat",
                    "dup3",
                    "rt_sigprocmask",
                    "rt_sigaction",
                    "write",
                    "epoll_ctl",
                    "epoll_wait",
                    "munmap",
                    "mprotect",
                    "madvise",
                    "exit_group",
                    "pread64",
                    "uname",
                    "mmap",
                    "brk",
                    "getpid",
                    "rt_sigreturn",
                    "epoll_pwait",
                    "shutdown",
                    "getdents64"
                },
                "child_thread": set(),
                # {
                    # "munmap",
                    # "open",
                    # "read",
                    # "futex",
                    # "openat",
                    # "write",
                    # "statx",
                    # "close",
                    # "madvise",
                    # "exit",
                    # "mmap",
                    # "socket",
                    # "fcntl",
                    # "rt_sigprocmask",
                # },
                "dangeer": {
                    "main_thread": set(),
                    "child_thread": set(),
                    "total": set()
                },
                "normal": {
                    "main_thread": set(),
                    "child_thread": set(),
                    "total": set()
                }
            },
            "musl": {
                "main_thread": {
                    "futex",
                    "openat",
                    "statx",
                    "read",
                    "close",
                    "ioctl",
                    "fcntl",
                    "fstat",
                    "readlink",
                    "stat",
                    "dup3",
                    "rt_sigprocmask",
                    "rt_sigaction",
                    "write",
                    "epoll_ctl",
                    "epoll_wait",
                    "munmap",
                    "mprotect",
                    "madvise",
                    "exit_group",
                    "pread64",
                    "uname",
                    "mmap",
                    "brk",
                    "getpid",
                    "rt_sigreturn",
                    "epoll_pwait",
                    "shutdown",
                    "getdents64"
                },
                "child_thread": set(),
                # {
                # "read",
                #     "futex",
                #     "openat",
                #     "socket",
                #     "statx",
                #     "open",
                #     "exit",
                #     "close",
                #     "write",
                #     "rt_sigprocmask",
                #     "fcntl",
                #     "getcwd",
                #     "madvise",
                #     "munmap",
                #     "mmap",
                # },
                "dangeer": {
                    "main_thread": set(),
                    "child_thread": set(),
                    "total": set()
                },
                "normal": {
                    "main_thread": set(),
                    "child_thread": set(),
                    "total": set()
                },
            },
            "changable": {
                "main_thread": {
                    "futex",
                    "openat",
                    "statx",
                    "read",
                    "close",
                    "ioctl",
                    "fcntl",
                    "fstat",
                    "readlink",
                    "stat",
                    "dup3",
                    "rt_sigprocmask",
                    "rt_sigaction",
                    "write",
                    "epoll_ctl",
                    "epoll_wait",
                    "munmap",
                    "mprotect",
                    "madvise",
                    "exit_group",
                    "pread64",
                    "uname",
                    "mmap",
                    "brk",
                    "getpid",
                    "rt_sigreturn",
                    "epoll_pwait",
                    "shutdown",
                    "getdents64"
                },
                "child_thread": set(),
                # {
                #     "read",
                #     "futex",
                #     "openat",
                #     "socket",
                #     "statx",
                #     "open",
                #     "exit",
                #     "close",
                #     "write",
                #     "rt_sigprocmask",
                #     "fcntl",
                #     "getcwd",
                #     "madvise",
                #     "munmap",
                #     "mmap",
                # },
                "dangeer": {
                    "main_thread": set(),
                    "child_thread": set(),
                    "total": set()
                },
                "normal": {
                    "main_thread": set(),
                    "child_thread": set(),
                    "total": set()
                },
            }
        }


        if len(line.strip().split("\t")) < 2:
            continue
            print(line)
        p = line.strip().split("\t")[0]
        method_module_list = eval(line.strip().split("\t")[2])
        syscall_list = list()
        try:
            syscall_list = eval(line.strip().split("\t")[3])
        except Exception as e:
            # print(e)
            pass
        
        if syscall_list:
            for syscall in syscall_list:
                result["glibc"]["main_thread"].add(syscall)
                result["musl"]["main_thread"].add(syscall)
                result["changable"]["main_thread"].add(syscall)
                if syscall in dangerous_syscall_set:
                    result["glibc"]["dangeer"]["main_thread"].add(syscall)
                    result["glibc"]["dangeer"]["total"].add(syscall)
                    result["musl"]["dangeer"]["main_thread"].add(syscall)
                    result["musl"]["dangeer"]["total"].add(syscall)
                    result["changable"]["dangeer"]["main_thread"].add(syscall)
                    result["changable"]["dangeer"]["total"].add(syscall)
                else:
                    result["glibc"]["normal"]["main_thread"].add(syscall)
                    result["glibc"]["normal"]["total"].add(syscall)
                    result["musl"]["normal"]["main_thread"].add(syscall)
                    result["musl"]["normal"]["total"].add(syscall)
                    result["changable"]["normal"]["main_thread"].add(syscall)
                    result["changable"]["normal"]["total"].add(syscall)

        _result = test(method_module_list)
        # if _result["async"]:
        #     for i in child_set:
        #         _result[]
        # _line = f"""
        #             {p} & {_result['glibc']["danger"]} & {_result['glibc']["normal"]} & {_result['musl']["danger"]} & {_result['musl']["normal"]} & {_result['changable']["danger"]} & {_result['changable']["normal"]} & {_result['glibc']["main_thread"]["danger"] + _result['glibc']["main_thread"]["normal"]} & {_result['glibc']["child_thread"]["danger"] + _result['glibc']["child_thread"]["normal"]} & {_result['musl']["main_thread"]["danger"] + _result['musl']["main_thread"]["normal"]} & {_result['musl']["child_thread"]["danger"] + _result['musl']["child_thread"]["normal"]}  & {_result['changable']["main_thread"]["danger"] + _result['changable']["main_thread"]["normal"]} & {_result['changable']["child_thread"]["danger"] + _result['changable']["child_thread"]["normal"]} & {result["async"]}
        # """
#         _line = f"""{p} & \
# {_result['glibc']["danger"]} & \
# {_result['glibc']["normal"]} & \
# {_result['musl']["danger"]} & \
# {_result['musl']["normal"]} & \
# {_result['changable']["danger"]} & \
# {_result['changable']["normal"]} & \
# {_result['glibc']["main_thread"]["danger"] + _result['glibc']["main_thread"]["normal"]} & \
# {_result['glibc']["child_thread"]["danger"] + _result['glibc']["child_thread"]["normal"]} & \
# {_result['musl']["main_thread"]["danger"] + _result['musl']["main_thread"]["normal"]} & \
# {_result['musl']["child_thread"]["danger"] + _result['musl']["child_thread"]["normal"]}  & \
# {_result['changable']["main_thread"]["danger"] + _result['changable']["main_thread"]["normal"]} & \
# {_result['changable']["child_thread"]["danger"] + _result['changable']["child_thread"]["normal"]} & \
# {result["async"]}
#         """
        _line = f"""{p} & \
{_result['musl']["danger"]} & \
{_result['musl']["normal"]} & \
{_result['changable']["danger"]} & \
{_result['changable']["normal"]} & \
{_result['musl']["main_thread"]["danger"] + _result['musl']["main_thread"]["normal"]} & \
{_result['musl']["child_thread"]["danger"] + _result['musl']["child_thread"]["normal"]}  & \
{_result['changable']["main_thread"]["danger"] + _result['changable']["main_thread"]["normal"]} & \
{_result['changable']["child_thread"]["danger"] + _result['changable']["child_thread"]["normal"]}
        """
        print(_line.strip())

        result = {
            "async": 0,
            "glibc": {
                "main_thread": {
                    "futex",
                    "openat",
                    "statx",
                    "read",
                    "close",
                    "ioctl",
                    "fcntl",
                    "fstat",
                    "readlink",
                    "stat",
                    "dup3",
                    "rt_sigprocmask",
                    "rt_sigaction",
                    "write",
                    "epoll_ctl",
                    "epoll_wait",
                    "munmap",
                    "mprotect",
                    "madvise",
                    "exit_group",
                    "pread64",
                    "uname",
                    "mmap",
                    "brk",
                    "getpid",
                    "rt_sigreturn",
                    "epoll_pwait",
                    "shutdown",
                    "getdents64"
                },
                "child_thread": set(),
                # {
                    # "munmap",
                    # "open",
                    # "read",
                    # "futex",
                    # "openat",
                    # "write",
                    # "statx",
                    # "close",
                    # "madvise",
                    # "exit",
                    # "mmap",
                    # "socket",
                    # "fcntl",
                    # "rt_sigprocmask",
                # },
                "dangeer": {
                    "main_thread": set(),
                    "child_thread": set(),
                    "total": set()
                },
                "normal": {
                    "main_thread": set(),
                    "child_thread": set(),
                    "total": set()
                }
            },
            "musl": {
                "main_thread": {
                    "futex",
                    "openat",
                    "statx",
                    "read",
                    "close",
                    "ioctl",
                    "fcntl",
                    "fstat",
                    "readlink",
                    "stat",
                    "dup3",
                    "rt_sigprocmask",
                    "rt_sigaction",
                    "write",
                    "epoll_ctl",
                    "epoll_wait",
                    "munmap",
                    "mprotect",
                    "madvise",
                    "exit_group",
                    "pread64",
                    "uname",
                    "mmap",
                    "brk",
                    "getpid",
                    "rt_sigreturn",
                    "epoll_pwait",
                    "shutdown",
                    "getdents64"
                },
                "child_thread": set(),
                # {
                # "read",
                #     "futex",
                #     "openat",
                #     "socket",
                #     "statx",
                #     "open",
                #     "exit",
                #     "close",
                #     "write",
                #     "rt_sigprocmask",
                #     "fcntl",
                #     "getcwd",
                #     "madvise",
                #     "munmap",
                #     "mmap",
                # },
                "dangeer": {
                    "main_thread": set(),
                    "child_thread": set(),
                    "total": set()
                },
                "normal": {
                    "main_thread": set(),
                    "child_thread": set(),
                    "total": set()
                },
            },
            "changable": {
                "main_thread": {
                    "futex",
                    "openat",
                    "statx",
                    "read",
                    "close",
                    "ioctl",
                    "fcntl",
                    "fstat",
                    "readlink",
                    "stat",
                    "dup3",
                    "rt_sigprocmask",
                    "rt_sigaction",
                    "write",
                    "epoll_ctl",
                    "epoll_wait",
                    "munmap",
                    "mprotect",
                    "madvise",
                    "exit_group",
                    "pread64",
                    "uname",
                    "mmap",
                    "brk",
                    "getpid",
                    "rt_sigreturn",
                    "epoll_pwait",
                    "shutdown",
                    "getdents64"
                },
                "child_thread": set(),
                # {
                #     "read",
                #     "futex",
                #     "openat",
                #     "socket",
                #     "statx",
                #     "open",
                #     "exit",
                #     "close",
                #     "write",
                #     "rt_sigprocmask",
                #     "fcntl",
                #     "getcwd",
                #     "madvise",
                #     "munmap",
                #     "mmap",
                # },
                "dangeer": {
                    "main_thread": set(),
                    "child_thread": set(),
                    "total": set()
                },
                "normal": {
                    "main_thread": set(),
                    "child_thread": set(),
                    "total": set()
                },
            }
        }
        
    
