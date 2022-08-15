#!/usr/bin/env bash
########
# Build SVF
########
if [[ $1 == 'debug' ]]
then
    rm -rf ./'Debug-build'
    mkdir ./'Debug-build'
    cd ./'Debug-build'
    cmake -D CMAKE_BUILD_TYPE:STRING=Debug ../
else
    rm -rf ./'Release-build'
    mkdir ./'Release-build'
    cd ./'Release-build'
    cmake ../
    fi
make -j $(nproc)