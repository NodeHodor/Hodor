#!/bin/bash
vboxmanage list vms

vboxmanage controlvm Ubuntu poweroff

# sleep 10

vboxmanage -nologo startvm Ubuntu --type headless

# sleep 10

vboxmanage controlvm Ubuntu pause

# sleep 10

vboxmanage controlvm Ubuntu resume

# sleep 10

vboxmanage controlvm Ubuntu poweroff

vboxmanage -nologo startvm Ubuntu --type headless
