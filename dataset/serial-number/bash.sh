#!/bin/bash
dmidecode -t system | grep Serial
sudo dmidecode -t system | grep UUID
