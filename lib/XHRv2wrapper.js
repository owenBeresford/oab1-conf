/**
/

/**
 * XHRv2wrapper   
 * This is a class to adapt a XMLHTTPrequest v1 into something more useful.
 * This can wrap any XMLHTTPrequest v1 implementation . . . DI
 * This class holds relevance/value outside of browsers, who implement v2 already.
 *
 * For wider use should probably change ES6 "class" syntax to older object literal. 
 * 
 * @package Iceline.config 
 * @author oab1 / Owen Beresford / owen@iceline.ltd.uk  
 * @license AGPL {@link http://www.gnu.org/licenses/agpl-3.0.html}
 */
class XHRv2wrapper {

	constructor(xhr) {
		this.xhr=xhr;
		this.headers={};
		this.body="";
	}

	send(param, good, bad) {
		const self=this;
		this.xhr.timeout=param.timeout || 2000;
		this.xhr.addEventListener("timeout", function() { bad("timeout", {}); });
		this.xhr.addEventListener("error", function() { bad("Unknown error", {}); } );

		try {
// @link https://davidwalsh.name/xmlhttprequest
			this.xhr.addEventListener("readystatechange", function() {
				if(self.xhr.readyState===self.xhr.HEADERS_RECEIVED) {
					self.headers=self.parseHeaders(self.xhr.getAllResponseHeaders())
				}
				if(self.xhr.readyState===self.xhr.DONE) {
					if(self.validateData(self.xhr.responseText, self.headers, param)) {
						good(self.body, self.headers);
					} else {
						bad( self.body, self.headers);
					}
				} // else ignore
			} );

			this.xhr.open(param.method || "GET", param.url, true);
			if(param.headers ) {
				Object.keys(param.headers).forEach(function(a ) {	
					self.xhr.setRequestHeader(a, param.headers[a]);	
				});
			}
			this.xhr.send(param.body || null);
		} catch (e) {
			bad(e.message, {});
		}

	}

// @link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
	parseHeaders(headers) {
		var arr = headers.trim().split(/[\r\n]+/);

		var headerMap = {};
		arr.forEach(function (line) {
				var parts = line.split(': ');
				var header = parts.shift();
				var value = parts.join(': ');
				headerMap[header] = value;
				});
		return headerMap;
	}

	validateData(body, headers, param ) {
		if( headers['content-type'].match(/application\/json/) ) {
		// add other header options 
			this.body=JSON.parse(body); // exception are caught next function outside
		}
		// if param.exec && type is js, eval body
		if( headers['content-type'].match(/application\/xml/) ) {
		// add other header options 
			if (window.DOMParser) {
				parser = new DOMParser();
				xmlDoc = parser.parseFromString(txt, "text/xml");

			} else { 
				// leSigh MSIE
				xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
				xmlDoc.async = false;
				xmlDoc.loadXML(txt);
			}
			this.body=xmlDoc;
		}

		if( headers['content-type'].match(/text\/html/i) ) {
			this.body=body.trim();
		}
		return true;
	}

}


