#!/bin/bash
# ps "aux"
# kill 1292678
iostat
pidstat -p 28908 
ps auxw | grep 28908 | grep -v grep
