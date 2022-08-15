mkdir -p $1"_build"
cd $1"_build"
cmake -D CMAKE_BUILD_TYPE:STRING=$1 ../
make -j$(nproc)
