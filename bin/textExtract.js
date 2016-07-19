// requires jquery in master doc
// $('body').append('<script src="http://owenberesford.me.uk/asset/textExtract.js"></script>')

// hide code  :-)
(function() {

const RECURSE_DEPTH=15;

display(JSON.stringify(filter2(filter1(extract())), null, "\t") );


function extract() {
	var offset=1;
	var buf=[];
	jQuery('body').each(extractRecurseMap);

	function extractRecurseMap(indx, ele ) {
		if(buf.length> RECURSE_DEPTH) {
			return;
		}

		// slow, but don't care
		var t1=jQuery(ele).clone().children().remove().end().text();
		if(jQuery.trim(t1)!="" ) {
			buf[offset]=t1;
			offset=offset+1;
		}
		$(ele).find('*').each(extractRecurseMap);
	}
	return buf;
}


function filter1(data) {
	data=data.sort();
	keys=[];
	for (var i = 0; i < data.length; i++) {
		if (keys.indexOf( data[i])==-1 ) {
			keys.push( data[i] );
		}
	}
	return keys;
}

function filter2(data) {
	for (var i = 0; i < data.length; i++) {
		data[i]=jQuery.trim( data[i] );
	}
	return data;
}

function display(data) {
	var out = window.open("", "JSON array", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=780, height=200, top="+(screen.height-400)+", left="+(screen.width-840));
	out.document.body.innerHTML = "<textarea style=\"width:90%; height:90%; margin:auto;\">"+data+"</textarea>";
	return 0;
}
})();
