import os
import json


with open(os.path.join(os.path.dirname(__file__), "mapping-1.json")) as f_r:
    changable = json.load(f_r)

with open(os.path.join(os.path.dirname(__file__), "mapping-2.json"), "r") as f_r:
    builtin_js_dict = json.load(f_r)

result = {
    "main_thread": {
        "rt_sigreturn",
        "statx",
        "futex",
        "open",
        "fcntl",
        "mmap",
        "read",
        "write",
        "close",
        "madvise",
        "mprotect",
        "munmap",
        "epoll_ctl",
        "epoll_pwait",
        "fstat",
        "rt_sigprocmask",
        "ioctl",
        "rt_sigaction",
        "exit_group",
        "shutdown",
        "pread64",
        "getpid",
        "readlink",
        "stat",
        "dup3",
        "getdents64",
        "brk",
        "writev",
    },
    "thread_pool": {
        "munmap",
        "open",
        "read",
        "futex",
        "openat",
        "write",
        "statx",
        "close",
        "madvise",
        "exit",
        "mmap",
        "socket",
        "fcntl",
        "rt_sigprocmask",
    },
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
                    if binding_method in async_method_module_binding_dict:
                        async_binding_flag = 1

                # changable
                if binding_module in changable:
                    if binding_method in changable[binding_module]:
                        for sys in changable[binding_module][binding_method]:
                            # result["changable"]["total"].add(sys)
                            if async_flag and async_binding_flag:
                                for sys in changable[changable][binding_method]:
                                    result["thread_pool"].add(sys)
                            else:
                                for sys in changable[binding_module][binding_method]:
                                    result["main_thread"].add(sys)
    if total_async_flag:
        result["thread_pool"] = set()
    return result

def record(whitelist_dict):
    with open(os.path.join(os.path.dirname(__file__), "whitelist"), "w") as f_w:
        for sys in whitelist_dict["main_thread"]:
            line = f"{sys}\n"
            f_w.write(line)


    with open(os.path.join(os.path.dirname(__file__), "threadpool_whitelist"), "w") as f_w:
        for sys in whitelist_dict["thread_pool"]:
            line = f"{sys}\n"
            f_w.write(line)
