#!/bin/bash
# ps "aux"
# kill 1292678
lsof -t -i:35058
kill 35058
