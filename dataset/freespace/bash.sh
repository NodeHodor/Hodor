#!/bin/bash
df -P tmp | awk 'NR==2 {print $4}'
