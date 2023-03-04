#!/bin/bash
# ps "aux"
# kill 1292678
gsutil -m cp -r -a public-read {your_dataset_path}/google-cloudstorage-commands

gsutil -m cp -r -a public-read {your_dataset_path}/google-cloudstorage-commands

gsutil cors set google-storage-cors.json  {your_dataset_path}/google-cloudstorage-commands
