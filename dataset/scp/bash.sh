#!/bin/bash
scp -r -P 22 tmp user@remote:~
scp -r -P 22 user@remote:tmp ./
