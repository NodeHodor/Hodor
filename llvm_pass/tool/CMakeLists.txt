add_executable(node_analysis node_analysis.cpp)
target_link_libraries(node_analysis
        LLVMAsmParser
        LLVMSupport
        LLVMCore
        LLVMAnalysis
        LLVMIRReader
        LLVMTransformUtils
        LLVMipo
        LLVMInstCombine
        LLVMTarget
        analysis
        )
set_target_properties(node_analysis PROPERTIES RUNTIME_OUTPUT_DIRECTORY ${CMAKE_BINARY_DIR}/bin)