<?php
session_start();
require_once(dirname(__FILE__)."/../rest.php");
class crest extends REST{
	public function doGET(){
		$action = $this->r('action');
		if($action=='get_code'){
			//$this->b['aa']="hhhhh";
			$rs = utils_handler::getCodeChar(6,80,30);
			$this->b['sc'] = 200;
			return ;
		}
	}
	
	public function doPOST(){
		$action = $this->r('action');
		 if($action=='check_code'){
			$code = $this->r('code');
			if($code==$_SESSION["helloweba_char"]){
		       echo '1';
		    }else{
		       echo '0';
		    }
		    $this->b['sc'] = 200;
		    return;
		}
	}
	
}

?>
