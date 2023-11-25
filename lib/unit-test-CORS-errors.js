
/**
 * This file is infrastructure for CORs error tests.
 * This needs to be run in the browser.
 * This file needs to be hosted on the server/URL that you are testing, and needs to be run inside the unit test framework
 * Replace log lines with relevant calls. 
 *
 * @link https://stackoverflow.com/a/40683747/2375161
 * @access public
 * @return void
 */
function setup() {
	if(! window.fetch) {
		throw new Error("Unit test cannot be run in this environment.");
	}
}

// this should be a list of assets that your tool/ app uses, both on your host and remote dependancies
const URLS_TO_TEST=[];

function execTest(urls) {
	for(let i=0; i<urls.length; i++) {
		window.fetch( urls[i], {'mode':'no-cors'})
			.then( (dat) => { 
				if(dat.status===0) { 
					console.log( "ASSERT cors error ["+i+"] "+urls[i] );
				} else if( dat.status===200) {
					console.log( "ASSERT Correct ["+i+"] "+urls[i] );
				} else {
					console.log( "ASSERT unkown status "+dat.status+" ["+i+"] "+urls[i] );
				}
			 })
			.catch( (er) => {  
				console.log( "Resource not available ["+i+"] "+urls[i] );
			 });
	}
}


