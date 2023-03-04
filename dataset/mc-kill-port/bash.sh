#!/bin/bash
lsof -i tcp:123 | grep LISTEN | awk '{print $2}'
