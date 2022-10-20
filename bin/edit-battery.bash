#!/bin/bash
# testing: I have manual tested this on my desktop.  I do not know a practical means to create a unit test for this script.
# To improve your confidence, add " -x" to the hashbang, and set DEBUG_CURRENT_STATE and run as a non privileged account.
# The paths may become out of date, I have coded defensively.
#
if [ -n "$DEBUG_CURRENT_STATE" ]; then
	echo "** DEBUG FLAG SET **"
fi

if [ "$1" = '-h' -o "$1" = "--help" ]; then	
	echo "
A root requiring script to make ubuntu laptop more quiet and battery effiecient
Obviously use at own risk

$0 --add-performance  ~ removes hobbles
$0 --speed
$0 --add-endurance    ~ add hobbles
$0 --life
"
	exit 0
fi

if [ -z "$DEBUG_CURRENT_STATE" -a "$EUID" -ne 0 ]; then 
	echo "Run this script as root/ via sudo"
	exit 1
fi

direction="noop"
if [ "$1" = "--add-performance" -o "$1" = "--speed" ]; then
	direction="performance"
fi
if [ "$1" = "--add-endurance" -o "$1" = "--life" ]; then
	direction="endurance"
fi

# Need to make these values dynamic; 
# I can generate the start value for fast to slow operations, by catting the initial value
# I cant generate the initial state after it is in power save mode
SPEED_FAST=3700000
SPEED_SLOW=1700000 

is_fast() {
	if [ -n "$DEBUG_CURRENT_STATE" ]; then
		return $DEBUG_CURRENT_STATE
	fi

	if [ "`cat /sys/devices/system/cpu/cpu2/online`" = "1" ]; then
		return 1
	else 
		return 0
	fi
}

spin_up()  {
	if [ ! -d "/sys/devices/system/cpu/"  ] ; then
		echo "File-system not as expected, is this recent Ubuntu?"
		exit 2
	fi
	count=`ls -1 /sys/devices/system/cpu/cpu[1-9]*/online | wc -l`
    if [ $count -le 2 ]; then
		echo "File-system not as expected, or not enough vCPUs"
		exit 3
	fi 
	if [ -z "`ls /sys/devices/system/cpu/cpu*/cpufreq/scaling_max_freq`" ] ;then
		echo "File-system not as expected, or not enough vCPUs"
		exit 4
	fi

	if (($count>= 9)); then echo 1 > /sys/devices/system/cpu/cpu9/online ; fi
	if (($count>= 8)); then echo 1 > /sys/devices/system/cpu/cpu8/online ; fi
	if (($count>= 7)); then echo 1 > /sys/devices/system/cpu/cpu7/online ; fi
	if (($count>= 6)); then echo 1 > /sys/devices/system/cpu/cpu6/online ; fi
	if (($count>= 5)); then echo 1 > /sys/devices/system/cpu/cpu5/online ; fi
	if (($count>= 4)); then echo 1 > /sys/devices/system/cpu/cpu4/online ; fi
	if (($count>= 3)); then echo 1 > /sys/devices/system/cpu/cpu3/online ; fi
	if (($count>= 2)); then echo 1 > /sys/devices/system/cpu/cpu2/online ; 
    else echo "Unknown CPU thingies"; fi
     
    echo $SPEED_FAST > /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq
    echo $SPEED_FAST > /sys/devices/system/cpu/cpu1/cpufreq/scaling_max_freq

	if [ -d /sys/module/snd_ac97_codec ]; then
		echo 1 > /sys/module/snd_ac97_codec/parameters/power_save
	fi
	if [ -d /sys/module/snd_hda_intel/ ]; then
		echo 1 > /sys/module/snd_hda_intel/parameters/power_save
	fi
	service bluetooth start
	if [ -n "`rfkill | grep bluetooth | grep '    blocked'`" ]; then
		rfkill unblock bluetooth
	fi
	echo -e "Script author is not using bluetooth devices or nfc devices;\nYou wil need to edit this step if you are."
	return 0
}

spin_down() {
	if [ !  -d "/sys/devices/system/cpu/" ] ; then
		echo "File-system not as expected, is this recent Ubuntu?"
		exit 2
	fi
	count=`ls -1 /sys/devices/system/cpu/cpu[1-9]*/online | wc -l`
    if [ $count -le 2 ]; then
		echo "File-system not as expected, or not enough vCPUs"
		exit 3
	fi 
	if [ -z "`ls /sys/devices/system/cpu/cpu*/cpufreq/scaling_max_freq`" ] ;then
		echo "File-system not as expected, or not enough vCPUs"
		exit 4
	fi

	if (($count>= 9)); then echo 0 > /sys/devices/system/cpu/cpu9/online ; fi
	if (($count>= 8)); then echo 0 > /sys/devices/system/cpu/cpu8/online ; fi
	if (($count>= 7)); then echo 0 > /sys/devices/system/cpu/cpu7/online ; fi
	if (($count>= 6)); then echo 0 > /sys/devices/system/cpu/cpu6/online ; fi
	if (($count>= 5)); then echo 0 > /sys/devices/system/cpu/cpu5/online ; fi
	if (($count>= 4)); then echo 0 > /sys/devices/system/cpu/cpu4/online ; fi
	if (($count>= 3)); then echo 0 > /sys/devices/system/cpu/cpu3/online ; fi
	if (($count>= 2)); then echo 0 > /sys/devices/system/cpu/cpu2/online ; 
    else echo "Unknown CPU thingies"; fi
     
    echo $SPEED_SLOW > /sys/devices/system/cpu/cpu0/cpufreq/scaling_max_freq
    echo $SPEED_SLOW > /sys/devices/system/cpu/cpu1/cpufreq/scaling_max_freq

	echo "You have the following devices that support power_save; this script supports snd_ac97_codec, snd_hda_intel" 
	find /sys/module/ -name power_save | grep snd

	if [ -d /sys/module/snd_ac97_codec ]; then
		echo 10 > /sys/module/snd_ac97_codec/parameters/power_save
	fi
	if [ -d /sys/module/snd_hda_intel/ ]; then
		echo 10 > /sys/module/snd_hda_intel/parameters/power_save
	fi
	if [ -n "`service bluetooth status | grep active`" ];then
		service bluetooth stop
		if [ -n "`hciconfig | grep hci0`" ];then
			hciconfig hci0 down
		fi
	fi
	# nfc? i can't find the equiv of hciconfig 

	return 0
}

cur=$(is_fast ; echo $? )
if [ $cur -eq 0 -a "$direction" = "performance" ]; then
	spin_up;
elif [ $cur -eq 1 -a "$direction" = "endurance" ]; then
	spin_down;
else
	echo -e "I'm confused, what did you want to do?\nCurrent state (boolean): $cur requested: $direction "
fi

