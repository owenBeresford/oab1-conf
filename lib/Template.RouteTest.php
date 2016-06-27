<?php
// add namespace if needed

/**
 * RoutesTest 
// test to verify the state space for this URL
// this is much easier than in other frameworks
 * 
 * @uses PHPUnit_Framework_TestCase
 * @package 
 * @version $id$
 * @author oab1 / Owen Beresford / owen@iceline.ltd.uk  
 * @license AGPL {@link http://www.gnu.org/licenses/agpl-3.0.html}
 */
class RoutesTest extends PHPUnit_Framework_TestCase
{
	protected $goodURL;
	protected $badURL;

	/**
	 * setUp
	 * 
	 * @access protected
	 * @return <self>
	 */
	protected function setUp() {
		$ignored=[];
		$isEnabled=exec('cd .', $ignored, $status);
		if($isEnabled===false){
//			$this->markTestSkipped("No exec(), can't run this entire test. ");	
			die("No exec(), can't run this entire test '$status'. ");
		} 
		$rr=exec('php -v', $ignored, $status);
		if($isEnabled===false) {
//			$this->markTestSkipped("No php on the path, can't run this entire test. ");	
			die("No php on the path, can't run this entire test. ");
   		}
	
		$this->goodURL= []; // ADD URLS HERE
		$this->badURL= []; // ADD URLS HERE
	}  

	protected function tearDown() {
	}

	/**
	 * quickRouteTest
	 * 
	 * @param string $urn 
	 * @access private
	 * @return int, the exit code
	 */
	private function quickRouteTest($urn) {
		$t="php ../../../bin/console router:match '$urn' ";
		$ret=@exec($t, $ignored, $status);
		return intval($status);
	}

	/**
	 * testRoute1 ~ the goodURLs
	 * 
	 * @access public
	 * @return <self>
	 */
	public function testRoute1() {
		foreach($this->goodURL as $v) {
			$this->assertTrue($this->quickRouteTest($v)==0, $v);
		}
	}

	/**
	 * testRoute2 ~ the bad URLs
	 * 
	 * @access public
	 * @return <self>
	 */
	public function testRoute2() {
		foreach($$this->badURL as $v) {
			$this->assertTrue($this->quickRouteTest($v)==1, $v);
		}
	}

}

