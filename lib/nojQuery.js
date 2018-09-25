
// jQUERY: $(window).width() / parseFloat($("body").css("font-size"));
function elementWidthAsEm(doc, id) {
	let bb  = null;
	if(typeof id=='string') { bb= doc.getElementById(id); }
	else { bb=doc.getElementsByTagName('body')[0]; }

	let stl = window.getComputedStyle(bb,null);
	return parseInt(stl.width) / parseInt(stl['fontSize'])
}



