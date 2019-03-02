
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
		return this.n.normaliseFontSize(this.a.getAttr(sel, 'font-size'));
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
			cur=cur.parentElement;
			enc=this.a.getAttr(cur, 'lang');
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
	pointInsideBox:function(p1, p2, p3) {
		throw new Error("No code found");
	},	

	normaliseFontSize:function(sample ) {
		let n=this.getDefaultFontSize();
		if(sample.match(/%/)) {
			throw new Error(" Add recursion to font-size extraction");
		}
		
		let m=sample.match(/([0-9]+)[ ]*pt/i );
		if(m.length) {
			return m[1]*1.33;
		}
			
		m=sample.match(/([0-9]+)[ ][r]*em/i );
		if(m.length) {
			return m[1]*n;
		}

		m=sample.match(/([0-9]+)[ ]px/i );
		if(m.length) {
			return m[1];
		}

		let OldPeopleNamedTerms={
			'x-small':n*0.625,
			'small':n*83.3,
			'medium':n,
			'large':n*1.125,
			'x-large':n*1.5,
			'xx-large':n*2
									};
		let found=false; 
		sample=sample.toLowerCase();
		OldPeopleNamedTerms.forEach(function(a, i) { if( sample === i ) { found=a; } });
		if(found) { return found; }

		throw new Error("Unsupported font size type, just now, "+sample);
	},

	normaliseColour:function(sample, colour) {
// this should be what is needed to map the type
		return colour(sample);
	},

	normaliseSize:function(sample) {
		throw new Error("No code found");
	},

	getDefaultFontSize:function() {
		return Number(window.getComputedStyle(document.body).getPropertyValue('font-size').match(/\d+/)[0]);
	},

	},
	
}
