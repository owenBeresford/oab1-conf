<?php
// source copied from https://philipnewcomer.net/2015/12/better-human-friendly-time-ago-php-function/
// and then rewritten

/**
 * Calculates a human-friendly string describing how long ago a timestamp occurred.
 *
 * @link http://stackoverflow.com/a/2916189/3923505
 * @link https://philipnewcomer.net/2015/12/better-human-friendly-time-ago-php-function/
 *
 * @param int $timestamp The timestamp to check.
 * @param int $now       The current time reference point.
 *
 * @return string The time ago in a human-friendly format.
 *
 * @throws \Exception if the timestamp is in the future.
 */
function age(int $timestamp, int $now = 0 ) {
	// fortunately English always uses 's' for plurals.  In say portugeuse this would be harder to write
	// I think a second copy of this that is more "as spoken", less numerical would be useful.

    $intervals = array(
        60 * 60 * 24 * 365.251 =>[ 'year', 'a'],
        60 * 60 * 24 * 30  => ['month', 'a'],
        60 * 60 * 24 * 7   => ['week', 'a'],
        60 * 60 * 24       => ['day', 'a'],
        60 * 60            => ['hour', 'an'],
        60                 => ['minute', 'a'],
        1                  => ['second', 'a'],
    );
	$words=[
		2=> 'two', 3=>'three', 4=>'four', 5=>'six', 6=>'six', 7=>'seven', 8=>'eight', 
		9=>'nine', 10=>'ten', 11=>'eleven', 12=>'twelve',
			];

	if ( 0 === $now ) {
		$now = time();
	}
	if ( $timestamp > $now ) {
		throw new \Exception( 'Timestamp postdates the current time reference point' );
	}

	$diff = $now - $timestamp, $interval=null;
	foreach ( $intervals as $interval => $label ) {
		if ( $diff < $interval ) {
			break;
		}
	}

	$diff = round( $diff / $interval );
	if ( $diff <= 1 ) {
		$time_ago = sprintf( '%s %s ago', $label[1], $label[0]);
	} elseif( isset($words[$diff])) {
		$time_ago = sprintf( '%s %ss ago', $words[$diff], $label[0]);		
	} else {
		$time_ago = sprintf( '%d %ss ago', $diff, $label[0]);
	}
	return $time_ago;
}

