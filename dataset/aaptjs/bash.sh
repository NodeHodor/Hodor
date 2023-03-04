#!/bin/bash
{your_dataset_path}/aaptjs/node_modules/aaptjs/bin/linux/aapt l {your_dataset_path}/aaptjs/tests/com.afwsamples.testdpc_7.0.1.apk
{your_dataset_path}/aaptjs/node_modules/aaptjs/bin/linux/aapt a {your_dataset_path}/aaptjs/tests/com.afwsamples.testdpc_7.0.1.apk {your_dataset_path}/aaptjs/tests/tmp
{your_dataset_path}/aaptjs/node_modules/aaptjs/bin/linux/aapt r {your_dataset_path}/aaptjs/tests/com.afwsamples.testdpc_7.0.1.apk {your_dataset_path}/aaptjs/tests/tmp
{your_dataset_path}/aaptjs/node_modules/aaptjs/bin/linux/aapt p --help
{your_dataset_path}/aaptjs/node_modules/aaptjs/bin/linux/aapt d permissions {your_dataset_path}/aaptjs/tests/com.afwsamples.testdpc_7.0.1.apk
{your_dataset_path}/aaptjs/node_modules/aaptjs/bin/linux/aapt c -S {your_dataset_path}/aaptjs/tests/com.afwsamples.testdpc_7.0.1.apk -C ./
{your_dataset_path}/aaptjs/node_modules/aaptjs/bin/linux/aapt s -i {your_dataset_path}/aaptjs/tests/tmp.png -o ./
