[TOC]

# Hodor
Hodor for node.js


## Callgraph analysis

### Run

```
optional arguments:
  -h, --help            show this help message and exit
  -f FILETYPE, --fileType FILETYPE
                        file type, including file or package
  -p PATH, --path PATH  file path
  -i INIT, --init-name INIT
                        init file name
```

```sh
python3 hodor.py -f package -p {Application packages} -i {init}
```

## Hodor Compilation

### Prerequisites

#### nodejs
download node source code `git clone https://github.com/nodejs/node.git`

#### musl libc
1. download musl gcc `curl -LO https://musl.cc/x86_64-linux-musl-native.tgz`
2. extract musl gcc `tar zxvf x86_64-linux-musl-native.tgz`
3. link musl gcc's `libc.so` to system path `sudo ln -s $YOUR_PATH/x86_64-linux-musl-native/lib/libc.so /lib/ld-musl-x86_64.so.1`

#### libseccomp
download libseccomp source code `https://github.com/seccomp/libseccomp.git`

### compilation

#### pre compilation

1. put seccomp.h and seccomp-syscalls.h to node/deps/uv/include
2. enter libseccomp dir
    - `CC=$YOUR_PATH/x86_64-linux-musl-native/bin/gcc CXX=$YOUR_PATH/x86_64-linux-musl-native/bin/g++ ./autogen.sh`
    - `CC=$YOUR_PATH/x86_64-linux-musl-native/bin/gcc CXX=$YOUR_PATH/x86_64-linux-musl-native/bin/g++ ./configure`
    - `make -j64`
3. enter libseccomp/src/.lib，copy libseccomp.a to musl's lib dir.
4. modify node's configure.py，add '-lseccomp' to `libraries`

#### compilation
1. run configure in node dir，`CC=$YOUR_PATH/x86_64-linux-musl-native/bin/gcc CXX=$YOUR_PATH/x86_64-linux-musl-native/bin/g++ ./configure --without-inspector --without-intl`
2. `make -j64`

### running

need LD_PRELOAD to specify dynamic libraries's loading path, two methods:
1. in terminal: `export LD_LIBRARY_PATH=$YOUR_PATH/x86_64-linux-musl-native/lib`
2. add to .zshrc: `export LD_LIBRARY_PATH=$YOUR_PATH/x86_64-linux-musl-native/lib`

run node's out/node

### compile node-seccomp

`CC=$YOUR_PATH/x86_64-linux-musl-native/bin/gcc CXX=$YOUR_PATH/x86_64-linux-musl-native/bin/g++ npm install --nodedir=$YOUR_PATH/node_musl_sec/node ./seccomp_demo` NOTICE: nodedir is a directory，which contains node.js's source code.


## Evaluation

Complete evaluation results are shown in the following items:
1. [Table 5 HODOR granularity of packages at system call level and thread level (RQ1).pdf](https://github.com/NodeHodor/Hodor/blob/main/evaluation/Table%205%20HODOR%20granularity%20of%20packages%20at%20system%20call%20level%20and%20thread%20level%20(RQ1).pdf)
2. [Table 6 Exploit execution for packages with arbitrary command execution attacks.pdf](https://github.com/NodeHodor/Hodor/blob/main/evaluation/Table%206%20Exploit%20execution%20for%20packages%20with%20arbitrary%20command%20execution%20attacks.pdf)
3. [Table 7 Exploit execution for packages with arbitrary code execution attacks.pdf](https://github.com/NodeHodor/Hodor/blob/main/evaluation/Table%207%20Exploit%20execution%20for%20packages%20with%20arbitrary%20code%20execution%20attacks.pdf)
4. [Table 8 Vulnerability payloads.pdf](https://github.com/NodeHodor/Hodor/blob/main/evaluation/Table%208%20Vulnerability%20payloads.pdf)
5. [Table 9 Engine-required system calls.pdf](https://github.com/NodeHodor/Hodor/blob/main/evaluation/Table%209%20Engine-required%20system%20calls.pdf)
6. [Figure 9 The relationships between line coverage and syscall numbe.pdf](https://github.com/NodeHodor/Hodor/blob/main/evaluation/Figure%209%20The%20relationships%20between%20line%20coverage%20and%20syscall%20numbe.pdf)