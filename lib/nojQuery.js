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

// function with jquery from a corporate repo. NOT PRESENTED HERE
// version without, mine, and OSS 
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


