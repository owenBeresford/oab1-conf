

/**
 * _c
 * A thing that the interpreter should do, object const, roughly
 
 * @param obj ~ must be an object
 * @param name
 * @param value
 * @access public
 * @return void
 */
function _c(obj, name, value) {
	return Object.defineProperty(obj, name, {
		value: value,
		writable: false,
		enumerable: true,
		configurable: false
	});
}

/**
 * cc
 * A thing the interpreter should do, object const, roughly
 
 * @param name
 * @param value
 * @access public
 * @return void
 */
function cc(name, value) {
	if(!this) { throw "You are evil and bad."; }

	return Object.defineProperty(this , name, {
		value: value,
		writable: false,
		enumerable: true,
		configurable: false
	});
}
