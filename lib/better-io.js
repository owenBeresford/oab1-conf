// The basic unit in this is a set of functions put into a object. These should 
// be viewed as structs, not classes, as it is poor OO.
// The point of doing this is to associate a response to a request, but not nest 
// them.
// Outline reference 
let api1= {
	reqt:function(env) {
		// ...
	},
	resp:function(response) {
		// ...
	},
	error:function(response) {
		// ....
	}
};
// Please note the error handler is always present.
// As a sequence, running the reqt function should start a AJAJ call, chaining 
// the resp and error Promises/callbacks to the relevant places in the networking 
// library.

// I create a AJAJ call stack using the following API:
// Function names chosen to match Array class API on purpose.
// This would be really fiddly to write a unit test for, by itself.
const AJAJStack={
	create:function() {
		this.stack=[];
		return this;
	},
	// for normal stacking, this is easier to read
	push:function(api) {
		this.stack.push(api);
	},
	// for in-flight edits, this is more useful
	unshift:function(api) {
		this.stack.unshift(api);
	},
	shift:function() {
		return this.stack.shift();
	},
	reduce:function(env, tick, delay) {	
		let _self=this;
            // optionally skip the quick fire on the first step, if this is a retry
		if(delay===false) {
			let cur=this.stack.shift();
			cur.reqt(env);
		}
		for(let i=0; i<this.stack.length; i++) {
			window.setTimeout(function() { 
				let cur=_self.stack.shift(); 
				cur.reqt(env);
                    // the +1 is necessary due to the loop counter frequently being 0
			}, tick*(i+1);
		}
	},

	serial:function(env) {
		let self=this;		

		let next:function() {
			let t=self.stack.shift();
			if(t) {
				t(env, next);
			}
		}	
		next();	
	}
};

// I assert I have a networking library, e.g. Axios, Vue-resource, Angular.$http,
// jQuery.ajax etc. The variable is called ajaj in the following, as I haven't 
// used XML in years.
// I reference env several times. The above classes are to be used in a third 
// service class. The service class has any necessary consts (see URLS), a 
// reference to ajaj object, and a reference to the stack object. If you need 
// to do things like "try X() up to five times, before failing", the counter for 
// previousFailures is stored in the Service.  Env is a reference to the Service. 
// I use DI, it makes testing much faster.
// Example:
const SearchAPIService ={
	create:function(stack, ajaj, tick) {
		this.stack=stack;
		this.ajaj=ajaj;
		this.tick=tick;
		return this;
	},
	search:function(next, param) {
		let myReferenceId=null;
		let previousFailures=0;

		let api1= {
			reqt:function(env) {
				// ...
				// use param
				// triggers resp and error
			},
			resp:function(response) {
				// ...
				// writes to myReferenceId
			},
			error:function(response) {
				// ....
				// deletes next step....
			}
		};
		let api2= {
			reqt:function(env) {
				// ...
				// uses myReferenceId
				// triggers resp and error
			},
			resp:function(response) {
				// ...
				// if get results.count === 0, re-queues self with stack.unshift
				// unless previousFailures >5, in which case delete stack items
				// if have results, call next(results)
			},
			error:function(response) {
				// ....
			}
		};

		this.stack.push(api1);
		this.stack.push(api2);
		this.stack.reduce(this, this.tick);
	} 

}
// all the variables are constrained to the search function, making it fairly 
// stateless


