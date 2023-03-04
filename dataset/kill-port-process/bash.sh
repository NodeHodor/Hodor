#!/bin/bash
lsof -i tcp:6789 | grep LISTEN | awk '{print $2}' | xargs kill -9
pkill -f
