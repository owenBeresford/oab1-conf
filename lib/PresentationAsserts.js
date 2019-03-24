/**
 * EmBasedSizeError
 * Defining an Exception, in weird high-compat JS. This one is to report Em based sizes
 * These are defined here (in this file) as they have no reuse or behaviour and are just types

 * @link  https://stackoverflow.com/questions/464359/custom-exceptions-in-javascript
 * @param message
 * @param fileName
 * @param lineNumber
 * @access public
 * @return instance of Exception
 */
function EmBasedSizeError(message, fileName, lineNumber) {
    const instance = new Error(message, fileName, lineNumber);
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
}

EmBasedSizeError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
    }
});
if (Object.setPrototypeOf) {
    Object.setPrototypeOf(EmBasedSizeError, Error);
} else {
    EmBasedSizeError.__proto__ = Error;
}

/**
 * PercentBasedSizeError
 * Defining an Exception, in weird high-compat JS.  This one is to report percent based sizes
 * These are defined here (in this file) as they have no reuse or behaviour and are just types

 * @link  https://stackoverflow.com/questions/464359/custom-exceptions-in-javascript
 * @param message
 * @param fileName
 * @param lineNumber
 * @access public
 * @return instance of Exception
 */
function PercentBasedSizeError(message, fileName, lineNumber) {
    const instance = new Error(message, fileName, lineNumber);
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
}

PercentBasedSizeError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
    }
});
if (Object.setPrototypeOf) {
    Object.setPrototypeOf(PercentBasedSizeError, Error);
} else {
    PercentBasedSizeError.__proto__ = Error;
}

/**
 * ExBasedSizeError
 * Defining an Exception, in weird high-compat JS.  This one is to report Ex based sizes

 * @param message
 * @param fileName
 * @param lineNumber
 * @access public
 * @return instance of Exception
 */
function ExBasedSizeError(message, fileName, lineNumber) {
    const instance = new Error(message, fileName, lineNumber);
    Object.setPrototypeOf(instance, Object.getPrototypeOf(this));
    return instance;
}

ExBasedSizeError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: Error,
        enumerable: false,
        writable: true,
        configurable: true
    }
});
if (Object.setPrototypeOf) {
    Object.setPrototypeOf(ExBasedSizeError, Error);
} else {
    ExBasedSizeError.__proto__ = Error;
}


/**
 * PresentationAsserts
 * Class to support making declarational statements about UI artifacts


 * @NOJQUERY
 * @access public
 * @package iceline/config
 * @version $id$
 * @author O Beresford @channelOwen
 * @licence AGPL https://www.gnu.org/licenses/agpl-3.0.html
 */
const PresentationAsserts = {

    /**
     * create
     * Fake contor, as compat-JS doesnt have these

     * @param col
     * @access public
     * @return 'this'
     */
    create: function (col) {
        this.colour = col;
        return this;
    },

    /**
     * fontSize
     * Report current font size of HTML described by selector

     * @param sel ~ a querySelector string, mostly the same as CSS selectors
     * @access public
     * @return the given size in PX, or false if undefined
     */
    fontSize: function (sel) {
        try {
            return this.n.normaliseFontSize(this.a.getAttr(sel, 'font-size'));
        } catch (e) {
            if (e instanceof EmBasedSizeError) {
                return this.n.normaliseFontSizeEm(this.a.getAttr(sel, 'font-size'), this.a.getEle(sel), this);

            } else if (e instanceof PercentBasedSizeError) {
                return this.n.normaliseFontSizePercent(this.a.getAttr(sel, 'font-size'), this.a.getEle(sel), this);

            } // IOIO add ex based option
            else {
                console.log("ERROR getting fontsize: " + e.message, e.stack);
            }
        }
    },

    /**
     * fontName
     * Report the current font for the specified HTML element

     * @param sel ~ a querySelector string, mostly the same as CSS selectors
     * @access public
     * @return the  given string, or false if undefined
     */
    fontName: function (sel) {
        let t = this.a.getAttr(sel, 'font-family');
        if (t) {
            return t;
        }
        t = this.a.getAttr(sel, 'font');
        if (!t) {
            return false;
        }
        return this.n.normaliseAllFontsNames(t);
    },

    /**
     * itemColour
     * Report the foreground colour for specified HTML element. Colour is normalised to a 8Hex value

     * @param sel ~ a querySelector string, mostly the same as CSS selectors
     * @access public
     * @return the  given string, or false if undefined
     */
    itemColour: function (sel) {
        return this.n.normaliseColour(this.a.getAttr(sel, 'color'), this.colour);
    },

    /**
     * itemBGColour
     * Report the background colour of the specified HTML element. Colour is normalised to a 8Hex value
     * Traps BG images as non-reportable, as can't see pixels in JS

     * @param sel ~ a querySelector string, mostly the same as CSS selectors
     * @access public
     * @return the given string, or false if undefined
     */
    itemBGColour: function (sel) {
        let t = this.a.getAttr(sel, 'background-image');
        if (t && t !== 'none') {
            return "IMAGE";
        }
        return this.n.normaliseColour(this.a.getAttr(sel, 'background-color'), this.colour);
    },

    /**
     * itemColourContrast
     * Compute different between foreground colour and background colour for a given item.
     * This colour model ignores gamma channel, mostly as my source data is RGB

     * @param sel ~ a querySelector string, mostly the same as CSS selectors
     * @access public
     * @return signed int OR "IMAGE" (where relevent)
     */
    itemColourContrast: function (sel) {
        let t1 = this.itemColour(sel);
        let t2 = this.itemBGColour(sel);
        if (t2 === "IMAGE") {
            return "IMAGE";
        }

        return this.n.colourDifference(t1, t2);
    },

    /**
     * itemTitlePresent
     * Report presence of title attribute (and if has content)

     * @param sel ~ a querySelector string, mostly the same as CSS selectors
     * @access public
     * @return boolean
     */
    itemTitlePresent: function (sel) {
        let t1 = this.a.getAttr(sel, 'title');
        if (!t1) {
            return false;
        }
        return t1.length > 5;
    },

    /**
     * itemAltTextPresent
     * Report presence of alt attribute (and if has content)

     * @param sel ~ a querySelector string, mostly the same as CSS selectors
     * @access public
     * @return boolean
     */
    itemAltTextPresent: function (sel) {
        let t1 = this.a.getAttr(sel, 'alt');
        if (!t1) {
            return false;
        }
        return t1.length > 5;
    },

    /**
     * itemScreenLocation
     * Report the on screen location of a HTML element

     * @param sel ~ a querySelector string, mostly the same as CSS selectors
     * @access public
     * @return a struct, as follows
     {
         left: 0,
         right: 0,
         top: 0,
         bottom: 0,
      };
     */
    itemScreenLocation: function (sel) {
        let t1 = this.a.getEle(sel);
        if (!t1) {
            return false;
        }
        let t2 = false;
        if (t1.getBoundingClientRect) {
            t2 = t1.getBoundingClientRect();
            t2 = {
                left: parseInt(t2.left),
                right: parseInt(t2.right),
                top: parseInt(t2.top),
                bottom: parseInt(t2.bottom)
            };

        } else if (t1.getClientRects) {
            t2 = t1.getClientRects();
            t2 = t2[0];
            t2 = {
                left: parseInt(t2.left),
                right: parseInt(t2.right),
                top: parseInt(t2.top),
                bottom: parseInt(t2.bottom)
            };
        }
        return t2;
    },

    /**
     * itemHasText
     * Report if an element matches the RegExp.

     * @param sel ~ a querySelector string, mostly the same as CSS selectors
     * @param re ~ RegExp object
     * @access public
     * @return boolean
     */
    itemHasText: function (sel, re) {
        let t1 = this.a.getEle(sel);
        if (!t1) {
            return false;
        }

        t1 = t1.innerText;
        return t1.match(re) !== null;
    },

    /**
     * allLabelsAreWellFormed
     * For each label element: Report whether there is a for element pointing to a real DOM element, and whether there is text in the label
     * TODO: think if a selector to limit selection would be useful.

     * @access public
     * @return boolean
     */
	allLabelsAreWellFormed:function() {
		let lbl=document.getElementsByTagName('label'),
			good=0,
			self=this;
		let	f1=function(a) {
			let t=self.a.getAttr(a, 'for');
			if(t && document.getElementById(t)
				 && a.innerText.length>4) {
				good++;
			} else {
// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/label
				for(let i in a.children) {
					if(a.children[ i].tagName.toLowerCase()==='input') {
						good++;
						break;
					} 
				}
			}

			
		};
		Array.prototype.forEach.apply(lbl, [f1]);
		return lbl.length === good;
	},


	semanticTagsPresent:function(){
		//hmm, what to require?
	},	
 
    /**
     * itemTextDirection
     * Report direction of text according to meta data, on particular HTML element.

     * @param sel ~ a querySelector string, mostly the same as CSS selectors
     * @access public
     * @return String where set, otherwise false
     */
    itemTextDirection: function (sel) {
        return this.a.getAttr(sel, 'dir') ||
            this.a.getAttr(sel, 'direction');
    },

    /**
     * itemTextLanguage
     * Report human language, starting at specified HTML element
     * NB: most documents have one language.

     * @param sel ~ a querySelector string, mostly the same as CSS selectors
     * @access public
     * @return String where set, otherwise false
     */
    itemTextLanguage: function (sel) {
        let cur = this.a.getEle(sel), enc = false;
        enc = this.a.getAttr(cur, 'lang');
        while (!enc && cur && cur.tagName !== 'HTML') {
            cur = cur.parentNode;
            enc = this.a.getAttr(cur, 'lang');
        }

        if (!enc) {
            // Can't use a.getAttr API here (structure not name=value), meybe add new function
            // this is for old HTML
            document.querySelectorAll('meta').forEach(
                function (a) {
                    if (a.getAttribute('http-equiv').toLowerCase() === 'content-language') {
                        enc = a.getAttribute('content');
                    }
                });
        }
// Cant sniff http headers inside JS.  
// Can do an AJAX head request against current URL. Would encourage proper use of HTML

// google use html attr lang
// ebay use html attr lang
// fb use html attr lang
// twitter use html attr lang
// quartz use html attr lang
// wordpress website doesnt use anything
        return enc;
    },

// cant find how to reliably build this.
// can try to do a grab first 10byte and RE match
// suspect can't access first 10bytes outside of DOM
// eg https://stackoverflow.com/questions/14773641/use-javascript-regex-to-match-byte-order-mark-bom
// https://jsfiddle.net/o9qo8e0t/ OPTION
// https://github.com/feross/buffer/blob/master/index.js
    itemTextEncoding: function (sel) {
        throw new Error("No code found");
    },

    /**
     * itemOnScreen
     * Report if a HTML element is currently on-screen

     * @param sel ~ a querySelector string, mostly the same as CSS selectors
     * @param partial ~ boolean, allow partially on screen?
     * @access public
     * @return boolean
     */
    itemOnScreen: function (sel, partial) {
        let pos = this.itemScreenLocation(sel);
        let screen = this.a.getViewportSize();
        if (pos.left >= 0 &&
            pos.right < screen.width &&
            pos.top >= 0 &&
            pos.bottom < screen.height) {
            return true;
        }
        if (!!partial &&
            pos.right > 0 &&
            pos.left < screen.width &&
            pos.top < screen.height &&
            pos.bottom > 0) {
            return true;
        }
        return false;
    },

    /**
     * detectOverlaps
     * Report if sel1 overlaps sel2

     * @param sel1 ~ a querySelector string, mostly the same as CSS selectors
     * @param sel2 ~ a querySelector string, mostly the same as CSS selectors
     * @access public
     * @return true
     */
    detectOverlaps: function (sel1, sel2) {
        let pos1 = this.itemScreenLocation(sel1);
        let pos2 = this.itemScreenLocation(sel2);
        let overlap = 0;

        if (pos1.left >= pos2.left &&
            pos1.right < pos2.right) {
            overlap = 1;
        }
        if (pos1.right <= pos2.right &&
            pos1.left < pos2.right) {
            overlap = 1;
        }

        if (pos2.left >= pos1.left &&
            pos2.right < pos1.right) {
            overlap = 1;
        }
        if (pos2.right <= pos1.right &&
            pos2.left < pos1.right) {
            overlap = 1;
        }

        if (pos1.top >= pos2.top &&
            pos1.bottom > pos2.top) {
            overlap |= 2;
        }
        if (pos1.bottom <= pos2.bottom &&
            pos1.top < pos2.bottom) {
            overlap |= 2;
        }
        if (pos2.top >= pos1.top &&
            pos2.bottom > pos1.top) {
            overlap |= 2;
        }
        if (pos2.bottom <= pos1.bottom &&
            pos2.top < pos1.bottom) {
            overlap |= 2;
        }

        if ((overlap & 1)>0 && (overlap & 2) >0) {
            return true;
        }
        return false;
    },

    itemMovement: function (sel, samples) {
        throw new Error("No code found");
    },

/* This inner class holds all the DOM manipulation
   Needs running on each browser, less value in unit testing
*/
    a: {

        /**
         * getViewportSize
         * Compute the current screen size, across alot of browser non-compat

         * @link https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
         * @access public
         * @return {width:0, height:0}
         */
        getViewportSize: function () {
            let w = Math.max(document.documentElement.clientWidth, window.screen.width, window.innerWidth, 0);
            let h = Math.max(document.documentElement.clientHeight, window.screen.height, window.innerHeight, 0);
            return {width: w, height: h};
        },

        /**
         * getEle
         * Return a HTML element from selector

         * @param sel ~ a querySelector string, mostly the same as CSS selectors
         * @access public
         * @return HTML element OR false
         */
        getEle: function (sel) {
            try {
                return document.querySelector(sel);
            } catch (e) {
                return false;
            }
        },

        /**
         * getAttr
         * Extract an element attribute

         * @param sel ~ a querySelector string, mostly the same as CSS selectors
         * @param name ~ string, the name of the attribute to look for
         * @access public
         * @return string OR false
         */
        getAttr: function (sel, name) {
            if (sel instanceof HTMLElement) {
                return this._getAttr(sel, name);

            } else if (sel instanceof NodeList) {
                let result = null;
                Array.prototype.forEach.apply(sel, function (a) {
                    result = this._getAttr(a, name);
                });
                return result;

            } else {
                let t = this.getEle(sel);
                if (!t) {
                    return false;
                }
                return this._getAttr(t, name);
            }
        },

        /**
         * _getAttr
         * Internal function to actually extract the attribute

         * @param el ~ HTML element
         * @param name ~ string the name of the desired attribute
         * @access public
         * @return string, maybe null if not found
         */
        _getAttr: function (el, name) {
            let t2 = el.getAttribute(name);
            if (!t2 && window.getComputedStyle) {
                let t3 = window.getComputedStyle(el, null);
                t2 = t3.getPropertyValue(name);
            }
            if (!t2 && el.currentStyle) {
                t2 = el.currentStyle[name];
            }
            return t2;
        },


    },

/*
  Inner class holds manipulation functions.
Should be unit tested, as most high cyclomatic values 
*/
    n: {
// references for magic constants
// https://www.w3.org/Style/Examples/007/units.en.html
// https://www.unitconverters.net/typography/millimeter-to-pixel-x.htm
// http://endmemo.com/sconvert/millimeterpixel.php
// https://css-tricks.com/forums/topic/converting-font-size-measurements-from-pt-to-px/
// 
// https://stackoverflow.com/questions/12470954/javascript-convert-ex-to-px
        RATIO_MM_2_PX: 3.779528,
        RATIO_IN_2_PX: 3.779528 * 254,
        RATIO_PC_2_PX: (3.779528 * 254) / 72,
        RATIO_PT_2_PX: 1.33,

        // the following maths is outside of my knowledge, and is copied from
        //      https://stackoverflow.com/a/17619494/2375161
        // Clinear = 0.2126 R + 0.7152 G + 0.0722 B
        MAGIC_RED_WEIGHT :0.2126,
        MAGIC_GREEN_WEIGHT :0.7152,
        MAGIC_BLUE_WEIGHT :0.0722,

        pointInsideBox: function (p1, p2, p3) {
            throw new Error("No code found");
        },

        /**
         * colourDifference
         * Convert 2 x 8hex strings into a single 'difference number'
 
         * @param t1 ~ string, as a 8Hex RGB
         * @param t2 ~ string, as a 8Hex RGB
         * @access public
         * @return int
         */
        colourDifference: function (t1, t2) {
            // we care about the difference, not which is more intense
            // keeping each channel separate, as a strong red is contrasting to a strong yellow
            t2 = t2.substring(1).match(/([a-f0-9]{2})/g);
            t1 = t1.substring(1).match(/([a-f0-9]{2})/g);
            let t3 = [
                Math.abs(parseInt(t2[0], 16) - parseInt(t1[0], 16)),
                Math.abs(parseInt(t2[1], 16) - parseInt(t1[1], 16)),
                Math.abs(parseInt(t2[2], 16) - parseInt(t1[2], 16)),
            ];
            t3 = t3[0] * this.MAGIC_RED_WEIGHT + t3[1] * this.MAGIC_GREEN_WEIGHT + t3[2] *
                this.MAGIC_BLUE_WEIGHT;
            return t3;
        },

        /**
         * normaliseAllFontsNames
         * If reading the 'font' version, parse & remove other items like size
         * NB: from JS, I cant find out which font is actually in use

         * @param str ~ ...
         * @access public
         * @return string, which should just contain the font names
         */
        normaliseAllFontsNames: function (str) {
            let out = "";

            str = str.split(" ");
            for (i in t) {
                switch (i.toLowerCase()) {
                    case 'italic':
                    case 'bold':
                    case 'oblique':
                    case 'initial':
                    case 'inherit':
                    case 'normal':
					case 'caption':
					case 'small-caps':
                        break;
                    default: // numbers and font names
                        if (i.match(/^[0-9]/)) {
                            break;
                        }
                        // else its probably a font name
                        out += " "+i;
                }
            }
            return out;
        },

        /**
         * normaliseFontSize
         * Convert a font size into pixels, so it can be compared more reliably
         * Results are dependant on settings in-page, and shouldn't be cached

         * @throws PercentBasedSizeError, EmBasedSizeError
         * @param sample ~ string, will be count and dimension
         * @access public
         * @return int, of pixels
         */
        normaliseFontSize: function (sample) {
            let n = this.getDefaultFontSize();
            if (sample.match(/%/)) {
                throw new PercentBasedSizeError();
            }

            let m = sample.match(/([0-9]+)[\t ]*pt/i);
            if (m && m.length) {
                return m[1] * this.RATIO_PT_2_PX;
            }

            m = sample.match(/([0-9]+)[\t ]*em/i);
            if (m && m.length) {
                throw new EmBasedSizeError();
            }

// I don't think I can merge these 2 items		
            m = sample.match(/([0-9]+)[\t ]*rem/i);
            if (m && m.length) {
                return m[1] * n;
            }

            m = sample.match(/([0-9]+)[\t ]*px/i);
            if (m && m.length) {
                return m[1];
            }

            m = sample.match(/([0-9]+)[\t ]*mm/i);
            if (m && m.length) {
                return m[1] * this.RATIO_MM_2_PX;
            }

            m = sample.match(/([0-9]+)[\t ]*cm/i);
            if (m && m.length) {
                return m[1] * this.RATIO_MM_2_PX * 10;
            }

            m = sample.match(/([0-9]+)[\t ]*in/i);
            if (m && m.length) {
                return m[1] * this.RATIO_IN_2_PX;
            }

            m = sample.match(/([0-9]+)[\t ]*pc/i);
            if (m && m.length) {
                return m[1] * this.RATIO_PC_2_PX;
            }

// Old people, as-in those who are STILL using frontpage, or dreamweaver2
// the named size thing just feels HTML2, and not sure if should be using SGML
            let OldPeopleNamedTerms = {
                'x-small': n * 0.625,
                'small': n * 83.3,
                'medium': n,
                'large': n * 1.125,
                'x-large': n * 1.5,
                'xx-large': n * 2
            };
            let found = false;
            sample = sample.toLowerCase();
            OldPeopleNamedTerms.forEach(function (a, i) {
                if (sample === i) {
                    found = a;
                }
            });
            if (found) {
                return found;
            }

// EX units
// https://stackoverflow.com/questions/12470954/javascript-convert-ex-to-px?

            throw new Error("Unsupported font size type, just now, " + sample);
        },

        /**
         * normaliseColour
         * Convert a colour to a 8Hex colour

         * @param sample~ string
         * @param colour ~ the colour object
         * @access public
         * @return string
         */
        normaliseColour: function (sample, colour) {
            return colour(sample).toHex8String();
        },

        /**
         * normaliseFontSizeEm
         * Em specific branch for font-sizes

         * @param sample ~ string of font size description
         * @param el ~ the HTML element
         * @param ~ obj the outer PresentationAsserts object
         * @access public
         * @return int, the size, in PX
         */
        normaliseFontSizeEm: function (sample, el, obj) {
            // by the time this happens, we know its an EM based element
            let m = sample.match(/([0-9]+)[\t ]*em/i);

            // parent may not be
            return obj.normaliseFontSize(obj.a._getAttr(el.parentNode, 'font-size')) * m[1];
        },

        /**
         * normaliseFontSizePercentage
         * Em specific branch for font-sizes

         * @param sample ~ string of font size description
         * @param el ~ the HTML element
         * @param ~ obj the outer PresentationAsserts object
         * @access public
         * @return int, the size, in PX
         */
        normaliseFontSizePercentage: function (sample, el, obj) {
            // by the time this happens, we know its a % based element
            let m = sample.match(/([0-9]+)[\t ]*%/);

            // parent may not be
            return obj.normaliseFontSize(obj.a._getAttr(el.parentNode, 'font-size')) * m[1];
        },

        /**
         * getDefaultFontSize
         * Report the original font size of the whole document

         * @access public
         * @return int
         */
        getDefaultFontSize: function () {
            return parseFloat(window.getComputedStyle(document.body, null).getPropertyValue('font-size').match(/\d+/)[1]);
        },

    },

}

// not adding module export stuff, this is for browsers
