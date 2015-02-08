<?php
///////////////////////////////////////////////////////
// 获取版本
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				$this -> arr["sc"] = 200;
				$this -> arr["vision"] = "1.0.0";
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}

	}
	
	$rs = new rss("GET",array("username","token","func","time"));
	
	
?>