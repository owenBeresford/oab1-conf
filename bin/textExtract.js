// requires jquery in master doc
// $('body').append('<script src="http://owenberesford.me.uk/asset/textExtract.js"></script>')

// hide code  :-)
(function() {

const RECURSE_DEPTH=4;

display(JSON.stringify(filter2(filter1(filter3(extractText()).concat(extractJS()))), null, "\t") );


function extractText() {
	var offset=0;
	var buf=[];
	jQuery('body').each(function(indx, ele) {return extractRecurseMap(indx, ele, 0); } );

	function extractRecurseMap(indx, ele, DEPTH ) {
		if(DEPTH> RECURSE_DEPTH) {
			return;
		}

		// slow, but don't care
		var t1=jQuery(ele).clone().children().remove().end().text();
		if(jQuery.trim(t1)!="" ) {
			buf[offset]=t1;
			offset=offset+1;
		}
		$(ele).find('*').each(function(indx, ele) { return extractRecurseMap(indx, ele, DEPTH+1); });
	}
	return buf;
}

function extractJS() {
	var buf=[];
	jQuery('script').each(extractTextLiterals);

	function extractTextLiterals(indx, ele) {
		var t=$(ele).text();
		var str=t.match(/'([^']+)'/g);
		buf.concat(str);
		str2=t.match(/"([^"]+)"/g);
		buf.concat(str2);
	}
	return buf;
}

function filter1(data) {
	data=data.sort();
	var keys=[];
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

function filter3(data) {
	var out=[];
	for (var i = 0; i < data.length; i++) {
		if(data[i].match(/<.+>/) == null) {
			out[out.length]=data[i];
		}
	}
	return out;
}

function display(data) {
	var out = window.open("", "JSON array", "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=yes, resizable=yes, width=780, height=200, top="+(screen.height-400)+", left="+(screen.width-840));
	out.document.body.innerHTML = "<textarea style=\"width:90%; height:90%; margin:auto;\">"+data+"</textarea>";
	return 0;
}
})();

