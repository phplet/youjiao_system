<?php
//////////////////////////////////////
//提交表单v1.0
//by 孙峻峰
//////////////////////////////////////

class getfar{
	public var $sURL;
	public var $rs;

	public function __construct($sURL){   
				
		$this -> sURL = $sURL;
		$this -> getpage();
    }
	public function getpage(){
		list($protocol, $sURL) = explode('://', $sURL); // separa o resto
		list($host, $foo)      = explode('/',   $sURL); // pega o host
		list($foo, $request)   = explode($host, $sURL); // pega o request
		list($host, $port)     = explode(':',   $host); // pega a porta
	
		if ( strlen($request) == 0 ) $request = "/";
		if ( strlen($port) == 0 )    $port = "80";
	
		$httpHeader  = "GET $request HTTP/1.0\r\n";
		$httpHeader .= "Host: $host\r\n";
		$httpHeader .= "Connection: Close\r\n";
		$httpHeader .= "User-Agent: cHTTP/0.1b (incompatible; M$ sucks; Open Source Rulez)\r\n";
		$httpHeader .= "\r\n\r\n";
		$fp = fsockopen($host, $port,$errno,$errstr,15);
		$result = "";
		if ( $fp ) {
			fwrite($fp, $httpHeader); 
			while(! feof($fp)) { //读取get的结果
				$result .= fread($fp, 1024);
			}
			fclose($fp);
		}
		list($header, $foo)  = explode("\r\n\r\n", $result);
		list($foo, $content) = explode($header, $result);
		$this -> rs = substr($content, 4);   
	
	}

}

?>