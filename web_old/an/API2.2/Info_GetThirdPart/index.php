<?php
///////////////////////////////////////////////////////
// 获取绑定资料
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				$id = $rs[1];
				$this -> arr["sc"] = 200;
				$this -> selectandwrites('sinaweibouid,sinaweibotoken,sinaweibonick,bindemail','usr_user',null,null," id=".$id);
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}

	}
	
	$rs = new rss("GET",array("username","token","func","time"));
	
	
?>