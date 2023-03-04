#!/bin/bash
ps ax -ww -o pid,ppid,uid,gid
netstat -tunp
netstat -anv
