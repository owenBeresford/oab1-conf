#!/bin/bash 
# gppfy 1liner to extract c-style multi-line comments from source code, currently setup for TS files
# why? :: spelling and grammar in external tools.

/usr/bin/awk '/\/\*\*/,/\*\//' src/*ts 
