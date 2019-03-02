
// Bill MSFT for this liability (no extend keyword).
// ALOT OF MONEY.
// https://stackoverflow.com/questions/464359/custom-exceptions-in-javascript
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
if (Object.setPrototypeOf){
    Object.setPrototypeOf(EmBasedSizeError, Error);
} else {
    EmBasedSizeError.__proto__ = Error;
}

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
if (Object.setPrototypeOf){
    Object.setPrototypeOf( PercentBasedSizeError, Error);
} else {
    PercentBasedSizeError.__proto__ = Error;
}

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
if (Object.setPrototypeOf){
    Object.setPrototypeOf( ExBasedSizeError, Error);
} else {
    ExBasedSizeError.__proto__ = Error;
}




/**
 * PresentationAsserts
 * Class to support making declarational statements about UI artifacts 
 
 * @NOJQUERY
 * @access public
 * @return void
 */
const PresentationAsserts= {
	create:function(col) {
		this.colour=col;
	},	

	fontSize:function(sel) {
		try {
			return this.n.normaliseFontSize(this.a.getAttr(sel, 'font-size'));
		} catch(e) {
			if(e instanceof EmBasedSizeError ) {
				return this.n.normaliseFontSizeEm(this.a.getAttr(sel, 'font-size'), this.a.getEle(sel), this );

			} else if(e instanceof PercentBasedSizeError ) {
				return this.n.normaliseFontSizePercent(this.a.getAttr(sel, 'font-size'), this.a.getEle(sel), this );

			} // IOIO add ex based option
		}
	},

	fontName:function(sel) {
		return this.a.getAttr(sel, 'font');
	},

	itemColour:function(sel) {
		return this.n.normaliseColour(this.a.getAttr(sel, 'color'), this.colour);
	},

	itemBGColour:function(sel) {
		let t=this.n.normaliseColour(this.a.getAttr(sel, 'background-image'), this.colour);
		if(t && t!=='none') {
			return "IMAGE";
		}
		return this.n.normaliseColour(this.a.getAttr(sel, 'background-color'), this.colour);
	},

	itemColourConstrast:function(sel) {
		let t1= this.itemColour(sel);
		let t2= this.itemBGColour(sel);
		if(t2==="IMAGE") { return "IMAGE"; }

		return parseInt(t2.substring(1))-parseInt(t1.substring(1));
	},

	itemTitlePresent:function(sel) {
		let t1=this.a.getAttr(sel, 'title');
		if(!t1) { return false; }		
		return t1.length > 5;
	},

	itemAltTextPresent:function(sel) {
		let t1=this.a.getAttr(sel, 'alt');
		if(!t1) { return false; }		
		return t1.length > 5;
	},

	itemScreenLocation:function(sel) {
		let t1=this.a.getEle(sel); 
		if(!t1) { return false; }
		let t2=false;
		if( t2.getBoundingClientRect) {
			t2=t1.getBoundingClientRect() ;
			t2={
				left: parseInt(t2.left), 
				right:parseInt(t2.right),
				top: parseInt(t2.top),
				bottom:parseInt(t2.bottom)
				 };
			
		} else if( t2.getClientRects) {
			t2=t1.getClientRects() ;
			t2=t2[0];
			t2={
				left: parseInt(t2.left), 
				right:parseInt(t2.right),
				top: parseInt(t2.top),
				bottom:parseInt(t2.bottom)
				 };
		}
		return t2;
	},

// I don't know if this should recurse or not
	itemHasText:function(sel, re) {
		let t1=this.a.getEle(sel); 
		if(!t1) { return false; }
		t1=t1.innerText;		
		return t1.match(re);
	},

	itemTextDirection:function(sel) {
		return this.a.getAttr(sel,'ltr') ||
				this.a.getAttr(sel, 'direction');		
	},

// cant sniff http headers inside JS
	itemTextLanguage:function(sel) {
		let cur=this.a.getEle(sel), enc=false; 
		enc=this.a.getAttr(cur, 'lang');
		while(!enc && cur) {
			cur=cur.parentNode;
			if(cur !== cur.parentNode) {
				enc=this.a.getAttr(cur, 'lang');
			}
		}
// IOIO add html headers, for wordpress type people
		return cur;
	},

// cant find how to reliably build this.
// can try to do a grab first 10byte and RE match
// suspect can't access first 10bytes outside from DOM
// eg https://stackoverflow.com/questions/14773641/use-javascript-regex-to-match-byte-order-mark-bom
// https://jsfiddle.net/o9qo8e0t/ OPTION
// https://github.com/feross/buffer/blob/master/index.js
	itemTextEncoding:function(sel) {
		throw new Error("No code found");
	},	


	itemOnScreen:function(sel, partial) {
		let pos=this.itemScreenLocation(sel);
		let screen=this.a.getViewportSize();
		if(pos.left>=0 &&
			pos.right< screen.width && 
			pos.top >=0 &&
			pos.bottom < screen.height) {
			return true;
		}
		if(!!partial && 
			pos.right > 0 &&
			pos.left< screen.width &&
			pos.top > screen.height &&
			pos.bottom <0) {
			return true;
		}
		return false;
	},

	detectOverlaps:function(sel1, sel2) {
		let pos1=this.itemScreenLocation(sel1);
		let pos2=this.itemScreenLocation(sel2);
		let overlap=0;

		if(pos1.left>=pos2.left &&
			pos1.right < pos2.left) {
			overlap=1;
		}
		if(pos1.right <= pos2.right &&
			pos1.left > pos2.right ) {
			overlap=1;
		}
		if(pos1.top>=pos2.top &&
			pos1.bottom < pos2.top) {
			overlap&=2;
		}
		if(pos1.bottom <= pos2.bottom &&
			pos1.top > pos2.bottom ) {
			overlap&=2;
		}
		if(overlap & 1 && overlap &2) {
			return true;
		}		
		return false;
	},
		
	itemMovement:function(sel, samples) {
		throw new Error("No code found");
	},

	a:{
// https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
	getViewportSize:function() {
		let w = Math.max(document.documentElement.clientWidth, window.screen.width, window.innerWidth,  0);
		let h = Math.max(document.documentElement.clientHeight, window.screen.height, window.innerHeight, 0);
		return {width:w,height:h };
	},

	getEle:function(sel) {
		try {
			return document.querySelector(sel);
		} catch(e) {
			return false;
		}
	},	

	getAttr:function(sel, name ) {
		let t=this.getEle(sel);
		if(!t) { return false; }
		return this._getAttr(t, name);
	},

	_getAttr:function(el, name ) {
		let t2=el.getAttribute(name);
		if(!t2 && window.getComputedStyle) {
			let t3=window.getComputedStyle(el, null);
			t2=t3.getPropertyValue(name);
		}
		if(!t2 && el.currentStyle) {
			t2=el.currentStyle[name];
		}
		return t2;
	},


	},

	n:{	
// references for magic constants
// https://www.w3.org/Style/Examples/007/units.en.html
// https://www.unitconverters.net/typography/millimeter-to-pixel-x.htm
// http://endmemo.com/sconvert/millimeterpixel.php
// https://css-tricks.com/forums/topic/converting-font-size-measurements-from-pt-to-px/
// 
// https://stackoverflow.com/questions/12470954/javascript-convert-ex-to-px
		RATIO_MM_2_PX:3.779528,
		RATIO_IN_2_PX:3.779528 * 254,
		RATIO_PC_2_PX:(3.779528 * 254)/72,
		RATIO_PT_2_PX:1.33,
		

	pointInsideBox:function(p1, p2, p3) {
		throw new Error("No code found");
	},	

	normaliseFontSize:function(sample ) {
		let n=this.getDefaultFontSize();
		if(sample.match(/%/)) {
			throw new PercentBasedSizeError();
		}
		
		let m=sample.match(/([0-9]+)[\t ]*pt/i );
		if(m.length) {
			return m[1]*this.RATIO_PT_2_PX;
		}
	
// I don't think I can merge these 2 items		
		m=sample.match(/([0-9]+)[\t ]*rem/i );
		if(m.length) {
			return m[1]*n;
		}

		m=sample.match(/([0-9]+)[\t ]*em/i );
		if(m.length) {
			throw new EmBasedSizeError();
		}

		m=sample.match(/([0-9]+)[\t ]*px/i );
		if(m.length) {
			return m[1];
		}

		m=sample.match(/([0-9]+)[\t ]*mm/i );
		if(m.length) {
			return m[1] *this.RATIO_MM_2_PX;
		}

		m=sample.match(/([0-9]+)[\t ]*cm/i );
		if(m.length) {
			return m[1] *this.RATIO_MM_2_PX*10;
		}

		m=sample.match(/([0-9]+)[\t ]*in/i );
		if(m.length) {
			return m[1] *this.RATIO_IN_2_PX;
		}

		m=sample.match(/([0-9]+)[\t ]*pc/i );
		if(m.length) {
			return m[1] *this.RATIO_PC_2_PX;
		}

// EX units
		throw new Error("Just now, this type is unsupported "+sample);
	},

	normaliseColour:function(sample, colour) {
		return colour(sample);
	},

	normaliseSize:function(sample) {

	},
	
	normaliseFontSizeEm:function(sample, el, obj) {
		if(el.parentNode ===document) {
			return this.getDefaultFontSize();
		}
// IOIO what happens if the outer objects are measured in different units?
// the third param is for the outer object, so i can call 
		let m=sample.match(/([0-9]+)[\t ]*em/i );

		return this.normaliseFontSizeEm(obj.a._getAttr( el.parentNode, 'font-size'), el.parentNode, obj) * m[1];
	},

	normaliseFontSizePercentage:function(sample, el, obj) {
		if(el.parentNode ===document) {
			return this.getDefaultFontSize();
		}
// IOIO what happens if the outer objects are measured in different units?
		let m=sample.match(/([0-9]+)[\t ]*%/ );

		return this.normaliseFontSizePercentage(obj.a._getAttr( el.parentNode, 'font-size'), el.parentNode, obj) * m[1];
	},

	getDefaultFontSize:function() {
		return parseFloat(window.getComputedStyle(document.body, null).getPropertyValue('font-size').match(/\d+/)[1]);	
	}

	},
	
}
