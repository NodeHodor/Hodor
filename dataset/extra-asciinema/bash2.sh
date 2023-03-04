#!/bin/bash
# ps "aux"
# kill 1292678
asciinema rec "saved.cast" --overwrite -c "cat "example.js" | node -i" -e "true"
asciinema upload saved.cast
