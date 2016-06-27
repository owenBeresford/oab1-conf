<?php
// add namespace

/**
 * AbstractAPITest ~ to allow creating JSON REST API e2e tests easier
 * 
 * @uses PHPUnit_Framework_TestCase
 * @abstract
 * @package 
 * @version $id$
 * @author oab1 / Owen Beresford / owen@iceline.ltd.uk  
 * @license AGPL {@link http://www.gnu.org/licenses/agpl-3.0.html}
 */
abstract class AbstractAPITest extends PHPUnit_Framework_TestCase
{
    protected $c;
    protected $baseURL;
	protected $verbose;


/** these two are left for impl classes
   protected function setUp()
   protected function tearDown()
*/

    /**
     * xfer ~ do a HTTP transaction to a JSON API 
     * 
     * @param int $method ~ use CURL defines (eg CURLOPT_HTTPGET) 
     * @param string $urn ~ in addition to baseURL that you setup in setup()
     * @param array||string $args 
     * @access protected
     * @return array of status, data, headers
     */
    protected function xfer($method, $urn, $args) {
        $this->c = curl_init();
        curl_setopt($this->c, $method, TRUE);
        curl_setopt($this->c, CURLOPT_RETURNTRANSFER, TRUE);
        $headers = array(
            'Accept: application/json',
            'Content-Type: application/x-www-form-urlencoded',
        );
        curl_setopt($this->c, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($this->c, CURLOPT_HEADER, 1);
        curl_setopt($this->c, CURLOPT_SSL_VERIFYPEER, 1);
        curl_setopt($this->c, CURLOPT_NOSIGNAL, 1);
		if($this->verbose) {
			curl_setopt($this->c, CURLOPT_VERBOSE, 1);
		}
        curl_setopt($this->c, CURLOPT_TIMEOUT_MS, 3000);
        curl_setopt($this->c, CURLOPT_COOKIEJAR, '/tmp/cookie.txt');
        curl_setopt($this->c, CURLOPT_COOKIEFILE, '/tmp/cookie.txt');
        if ($method == CURLOPT_POST) {
            curl_setopt($this->c, CURLOPT_URL, $this->baseURL . $urn);
            curl_setopt($this->c, CURLOPT_POSTFIELDS, http_build_query($args));
        } else {
			if($args!=[]) {
            	curl_setopt($this->c, CURLOPT_URL, $this->baseURL . $urn . '?' . http_build_query($args));
			} else {
            	curl_setopt($this->c, CURLOPT_URL, $this->baseURL . $urn );
			}
        }

        $resp = curl_exec($this->c);
        $info = curl_getinfo($this->c);

        $header = trim(substr($resp, 0, $info['header_size']));
        $body = substr($resp, $info['header_size']);
        if (strlen($body) == 0) {
            return array('status' => $info['http_code'], 'header' => $header, 'data' => '');
        }

		curl_close($this->c);
        $tt = json_decode($body, 1);
        if (!is_null($tt)) {
            return array('status' => $info['http_code'], 'header' => $header, 'data' => $tt);
        } else {
            echo($body);
            return array('status' => 555, 'header' => $header, 'data' => null);
        }
    }
    
    /**
     * postFile
     * 
     * @param string $urn 
     * @param array||object $args 
     * @param string $attach 
     * @access protected
	 * @link http://php.net/manual/en/class.curlfile.php
     * @return <self>
     */
    protected function postFile($urn, $args, $attach) {
        $out = [];
        $out['data'] = json_encode($args);
        $out['file'] = new CURLfile($attach, 'application/pdf', 'file');

        curl_setopt($this->c, CURLOPT_POST, TRUE);
        curl_setopt($this->c, CURLOPT_RETURNTRANSFER, 1);
        $headers = array(
            'Accept: application/json',
            'Content-Type: application/x-www-form-urlencoded',
        );
        curl_setopt($this->c, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($this->c, CURLOPT_URL, $this->baseURL . $urn);
        curl_setopt($this->c, CURLOPT_HEADER, 1);
		if($this->verbose) {
			curl_setopt($this->c, CURLOPT_VERBOSE, 1);
		}
        curl_setopt($this->c, CURLOPT_SSL_VERIFYPEER, 1);
        curl_setopt($this->c, CURLOPT_NOSIGNAL, 1);
        curl_setopt($this->c, CURLOPT_TIMEOUT_MS, 3000);
        curl_setopt($this->c, CURLOPT_POSTFIELDS, $out);

        $resp = curl_exec($this->c);
        $info = curl_getinfo($this->c);

        $header = trim(substr($resp, 0, $info['header_size']));
        $body = substr($resp, $info['header_size']);

        $tt = json_decode($body, 1);
        if (!is_null($tt)) {
            return array('status' => $info['http_code'], 'header' => $header, 'data' => $tt);
        } else {
            echo($body);
            return array('status' => 555, 'header' => $header, 'data' => null);
        }
    }

}    
