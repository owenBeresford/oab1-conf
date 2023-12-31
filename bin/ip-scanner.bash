#!/bin/bash 
#
# Script to list all the pingable local IPs, in a LAN segment.
# The defaults to using 192.168.1.* LAN range, but the first CLI arg will be 
#   used as a network if looks like a network segment.
# As this is a fast diagnostic tool it assumes traditional networking, and 
#   tests through a class C octet.
#   Excess pings from a LAN IP aren't normally going to break anything.
# It would be fairly easy to trick if you have a lot of firewall rules setup.
#
# I guess I should create this for power-shell.
#
# Licence: MIT
#
# TO TEST
# * This script doesn't have side-effects, unless you run Linux in 
#    uber-paranoid mode (Redhat SElinux on maximum warnings and process 
#    termination). 
# * For a proper unit test, I need to write this in a different language
# * add '-x' to the hash-bang to observe activity in detail.
#
oct4=1
network="192.168.1."
isIP=`echo "$1" | grep '^[0-9]\+\.[0-9]\+\.[0-9]\+$'`
if [ -n "$isIP" ]; then 
	network="$1"
fi

quiet=0
if [ "$1" = "-q" -o "$2" = "-q" ]; then
	quiet=1
fi 
if [ ! $quiet -a "$isIP" != "192.168.1." ]; then
	echo "I, the admin, promise to only run this on a LAN\n Otherwise I understand my ISP may alter my connection."
fi

while [ $oct4 -lt 255 ]; do
# I can't set -m on the CLI for some reason
	out=`ping -c4 $network$oct4 -i0.5 -t5 -W3 -q | grep '100% packet loss'`
	if [ -z "$out" ]; then
		echo "IP address $network$oct4 is pingable"
	fi
	((oct4++))
done


