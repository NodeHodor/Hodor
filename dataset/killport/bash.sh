#!/bin/bash
ps "aux"
lsof -i :12345
kill -9 1309946
