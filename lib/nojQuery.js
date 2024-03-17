/*
 This file is for solitary functions, that can be copied into projects,
the functions are too random to be an object.

I have manually tested each one of these, but its the type of code that unit tests poorly.

*/

// ripped from https://stackoverflow.com/questions/12241251/is-it-possible-to-get-the-width-of-the-window-in-em-units-using-javascript#
// jQUERY: $(window).width() / parseFloat($("body").css("font-size"));
function elementWidthAsEm(doc, id) {
	let bb  = null;
	if(typeof id=='string') { bb= doc.getElementById(id); }
	else { bb=doc.getElementsByTagName('body')[0]; }

	let stl = window.getComputedStyle(bb,null);
	return parseInt(stl.width) / parseInt(stl['fontSize'])
}

// jQUERY: $(document).ready(function() {...});
// ripped from https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery
function ready(callback) {
    if (document.readyState!='loading') { callback();}
    else if (document.addEventListener) { document.addEventListener('DOMContentLoaded', callback); }
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') { callback(); }
    });
}

// There is a function with jquery in a corporate repo. NOT PRESENTED HERE
// This version without, is mine, and OSS 
function translateFooter () {
	let footer = (document.getElementsByTagName("footer"));
	if(footer.length===0) { return false; }
	footer=footer[0];	
	let pos=footer.getBoundingClientRect();
        let height = document.documentElement.clientHeight;
        height = height - pos.top;
        height = height - footer.clientHeight;
        if (height > 0) {
        	footer.setAttribute('style', 'margin-top: '+ height + 'px');
			return true;
        }
	return false;
}

// https://stackoverflow.com/questions/105034/how-to-create-guid-uuid
// maybe add check about new Blob() on page load
// works on 06-2020 in common browsers
function uuid() {
  const url = URL.createObjectURL(new Blob());
  const id = url.toString().split('/').pop();
  URL.revokeObjectURL(url);
  return id;
}

/**
I thought I should save this idea
As JS modules are loaded with defer flag, I have a more complex time to see if they are 
available.   
Just delay until the attribute is present.

Design issue:: the hard-coded call to jQuery...
*/
function deferredLoad(cb, args, delay) {
	if(!delay) { delay=1000;}

	const APPLY=() => { 
		if( jQuery('pre.code')[cb]) {
			jQuery('pre.code')[cb](args);
		} else {
			setTimeout(APPLY, delay );
		} 	
	};
	setTimeout(APPLY, delay);
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent
function encodeRFC5987ValueChars(str) {
  return (
    encodeURIComponent(str)
      // The following creates the sequences %27 %28 %29 %2A (Note that
      // the valid encoding of "*" is %2A, which necessitates calling
      // toUpperCase() to properly encode). Although RFC3986 reserves "!",
      // RFC5987 does not, so we do not need to escape it.
      .replace(
        /['()*]/g,
        (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`,
      )
      // The following are not required for percent-encoding per RFC5987,
      // so we can allow for a little better readability over the wire: |`^
      .replace(/%(7C|60|5E)/g, (str, hex) =>
        String.fromCharCode(parseInt(hex, 16)),
      )
  );
}
