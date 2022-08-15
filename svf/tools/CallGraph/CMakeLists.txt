set(THREADS_PREFER_PTHREAD_FLAG ON)
find_package(Threads REQUIRED)

if(DEFINED IN_SOURCE_BUILD)
    set(LLVM_LINK_COMPONENTS BitWriter Core IPO IrReader InstCombine Instrumentation Target Linker Analysis ScalarOpts Support Svf Cudd)
    add_llvm_tool( svf_callgraph svf_callgraph.cpp )
else()
    add_executable( svf_callgraph svf_callgraph.cpp )

    target_link_libraries( svf_callgraph Svf Cudd ${llvm_libs} Threads::Threads )

    set_target_properties( svf_callgraph PROPERTIES
            RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin )
endif()