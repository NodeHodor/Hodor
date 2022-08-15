# musl libc + nodejs compilation process

## Prerequisites

### nodejs
download node source code `git clone https://github.com/nodejs/node.git`

### musl libc
1. download musl gcc `curl -LO https://musl.cc/x86_64-linux-musl-native.tgz`
2. extract musl gcc `tar zxvf x86_64-linux-musl-native.tgz`
3. link musl gcc's `libc.so` to system path `sudo ln -s $YOUR_PATH/x86_64-linux-musl-native/lib/libc.so /lib/ld-musl-x86_64.so.1`

### libseccomp
download libseccomp source code `https://github.com/seccomp/libseccomp.git`

## compilation

### pre compilation

1. put seccomp.h and seccomp-syscalls.h to node/deps/uv/include
2. enter libseccomp dir
    - `CC=$YOUR_PATH/x86_64-linux-musl-native/bin/gcc CXX=$YOUR_PATH/x86_64-linux-musl-native/bin/g++ ./autogen.sh`
    - `CC=$YOUR_PATH/x86_64-linux-musl-native/bin/gcc CXX=$YOUR_PATH/x86_64-linux-musl-native/bin/g++ ./configure`
    - `make -j64`
3. enter libseccomp/src/.lib，copy libseccomp.a to musl's lib dir.
4. modify node's configure.py，add '-lseccomp' to `libraries`

### compilation
1. run configure in node dir，`CC=$YOUR_PATH/x86_64-linux-musl-native/bin/gcc CXX=$YOUR_PATH/x86_64-linux-musl-native/bin/g++ ./configure --without-inspector --without-intl`
2. `make -j64`

## running

need LD_PRELOAD to specify dynamic libraries's loading path, two methods:
1. in terminal: `export LD_LIBRARY_PATH=$YOUR_PATH/x86_64-linux-musl-native/lib`
2. add to .zshrc: `export LD_LIBRARY_PATH=$YOUR_PATH/x86_64-linux-musl-native/lib`

run node's out/node

## compile node-seccomp

`CC=$YOUR_PATH/x86_64-linux-musl-native/bin/gcc CXX=$YOUR_PATH/x86_64-linux-musl-native/bin/g++ npm install --nodedir=$YOUR_PATH/node_musl_sec/node ./seccomp_demo` NOTICE: nodedir is a directory，which contains node.js's source code.
