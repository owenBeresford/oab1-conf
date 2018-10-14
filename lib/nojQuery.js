
// jQUERY: $(window).width() / parseFloat($("body").css("font-size"));
function elementWidthAsEm(doc, id) {
	let bb  = null;
	if(typeof id=='string') { bb= doc.getElementById(id); }
	else { bb=doc.getElementsByTagName('body')[0]; }

	let stl = window.getComputedStyle(bb,null);
	return parseInt(stl.width) / parseInt(stl['fontSize'])
}

// $(document).ready(function() {...});
// ripped from https://stackoverflow.com/questions/799981/document-ready-equivalent-without-jquery
function ready(callback) {
    if (document.readyState!='loading') callback();
    else if (document.addEventListener) document.addEventListener('DOMContentLoaded', callback);
    else document.attachEvent('onreadystatechange', function(){
        if (document.readyState=='complete') callback();
    });
}

