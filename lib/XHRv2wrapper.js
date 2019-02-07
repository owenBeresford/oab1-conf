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
        this.xhr = xhr;
        this.headers = {};
        this.body = "";
    }

    send(param, good, bad) {
        let self = this;
        this.body = '';
        this.headers = {};
        let hasStopped = 0;
        try {
// @link https://davidwalsh.name/xmlhttprequest
// extended from
            this.xhr.addEventListener("readystatechange", function () {
                if (self.xhr.readyState === self.xhr.HEADERS_RECEIVED) {
                    self.headers = self.parseHeaders(self.xhr.getAllResponseHeaders())
                }
                if (self.xhr.readyState === self.xhr.DONE) {
                    // This library doesn't support HTTP Redirects; its used for integration
                    // Any redirects should be fixed on a higher level of abstraction, i.e. the dev
                    if (parseInt(self.xhr.status / 100) !== 2) {
                        console.log("resp error state", self.xhr.status);
                        return;
                    }
                    try {
                        if (self.validateData(self.xhr.responseText, self.headers, param)) {
                            if (hasStopped > 0) { // Observably, the raw XHR are a singleton, with a single event queueue
                                console.log("multiple DONE event");
                                bad({body: "multiple DONE event"}, {});
                                return;
                            }
                            hasStopped++;
                            good({body: self.body}, self.headers);
                        } else {
                            bad({body: self.body}, self.headers);
                        }
                    } catch (e) {
                        // I haven't had partial datasets yet, but when we start doing long timescale graphs, we may
                        if (e.message !== "partial") {
                            throw e;
                        }
                    }
                } // else ignore
            });

            this.xhr.open(param.method || "GET", param.url, true);
            this.xhr.timeout = param.timeout || 2000;
            this.xhr.addEventListener("timeout", function () {
                bad({body: "timeout"}, {});
            });
            this.xhr.addEventListener("error", function () {
                bad({body: "Unknown error"}, {});
            });


            if (param.headers) {
                Object.keys(param.headers).forEach(function (a) {
                    if (!self.xhr.getRequestHeader(a)) {
                        self.xhr.setRequestHeader(a, param.headers[a]);
                    }
                });
            }

            if ((param.method && param.method !== "GET" && param.method !== "DELETE")) {
                if (param.body) {
                    this.xhr.send(param.body || null);
                }
            }
        } catch (e) {
            bad({body: e.message}, {});
        }

    }

// @link https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/getAllResponseHeaders
    parseHeaders(headers) {
        let arr = headers.trim().split(/[\r\n]+/);

        let headerMap = {};
        arr.forEach(function (line) {
            let parts = line.split(': ');
            let header = parts.shift();
            headerMap[header.toLowerCase()] = parts.join(': ');
        });
        return headerMap;
    }

    validateData(body, headers, param) {
        if (headers['content-type'] && headers['content-type'].match(/application\/json/)) {
            // add other header options
            if (headers['content-length'] && body.length < headers['content-length']) {
                if (typeof this.body === 'string') {
                    this.body += body; // this option shouldnt occur
                } else {
                    this.body = body;
                }
                throw Error("partial");
            }

            if (typeof this.body === 'string') {
                this.body = JSON.parse(this.body + body); // exception are caught next function outside
            } else {
                this.body = JSON.parse(body); // exception are caught next function outside
            }
        }
        // if param.exec && type is JS, eval body
        if (headers['content-type'] && headers['content-type'].match(/application\/xml/)) {
            // add other header options
            let xmlDoc;
            if (window.DOMParser) {
                let parser = new DOMParser();
                xmlDoc = parser.parseFromString(txt, "text/xml");

            } else {
                // leSigh MSIE, maybe I should add a sleep here ?
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = false;
                xmlDoc.loadXML(txt);
            }
            this.body = xmlDoc;
        }

        if (headers['content-type'] && headers['content-type'].match(/text\/html/i)) {
            this.body = body.trim();
        }
        return true;
    }

}


