<?php
///////////////////////////////////////////////////////
// 验证邮箱唯一接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){

				if($this->verifyemail()){
					$this -> arr["sc"] = 400;
				}
				else{
					$this -> arr["sc"] = 200;
				}
			
			
		}
		//查找是否有同名email
		public function verifyemail(){
			return $this -> db -> Queryif('usr_user','username='.$_REQUEST['email']);		
		}
	}
	
	
	$rs = new rss("GET",array("email"));
	
?>