<?php

class MB{
	
	//调用远程接口
	function API($API,$post_data,$method,$decode=true,$auth=""){
		$post_data['_method'] = $method;
		if($auth!=""){
			$header = base64_encode($auth);		
		}
		
		include(dirname(__FILE__)."/../config.php");
		$URL = $APIpath.$API;
		$this -> post($URL,$post_data,header);
		if($decode && $this -> rs != null){
			$this -> rs = json_decode($this -> rs,true);
		}		
	}


	//提交函数
	function post($URL,$post_data,$header=""){
		/* $this -> code = null;
		$this -> rs = null;
		$referrer="";
		// parsing the given URL
		$URL_Info=parse_url($URL);
		// Building referrer
		if($referrer=="") // if not given use this script as referrer
		$referrer=$_SERVER["SCRIPT_URI"];

		// making string from $data
		foreach($post_data as $key=>$value)
		$values[]="$key=".urlencode($value);
		 
		$data_string=implode("&",$values);
		// Find out which port is needed - if not given use standard (=80)
		if(!isset($URL_Info["port"]))
		$URL_Info["port"]=80;
		// building POST-request:
		$request.="POST ".$URL_Info["path"]." HTTP/1.1\n";
		$request.="Host: ".$URL_Info["host"]."\n";
		$request.="Referer: $referrer\n";
		$request.="Content-type: application/x-www-form-urlencoded\n";
		$request.="Content-length: ".strlen($data_string)."\n";
		$request.=$header;		
		$request.="Connection: close\n";
		$request.="\n";
		$request.=$data_string."\n";
		$fp = fsockopen($URL_Info["host"],$URL_Info["port"]);
		fputs($fp, $request);
		while(!feof($fp)) {
			$result .= fgets($fp, 128);
		}
		fclose($fp);
		echo $request;
		echo $result;
		$arr = explode(" ",$result);
		list($request, $foo)  = explode("\r\n\r\n", $result);
		list($foo, $content) = explode($request, $result);
		echo $this -> code = $arr[1];
		$this -> rs = substr($content, 4); */
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $URL);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $post_data);
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); 
		curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, false);
		if($header!=""){
			curl_setopt($ch, CURLOPT_HTTPHEADER, array(
				'Authorization:Digest '.$header)
			);		
		}
		$this -> rs = curl_exec($ch);
		$this -> code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
	}



}


?>