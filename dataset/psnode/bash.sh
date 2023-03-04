#!/bin/bash
ps -Ao pid,command; tasklist /FO csv /NH; taskkill /F /PID $(touch psnode)
