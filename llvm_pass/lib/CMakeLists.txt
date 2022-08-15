file(GLOB LIB_SRCS
        "node/*.cpp"
        "utils/*.cpp"
)

add_library(analysis SHARED ${LIB_SRCS} node/NewNodePass.cpp ../include/node/NewNodePass.h)