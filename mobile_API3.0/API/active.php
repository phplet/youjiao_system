<?php
///////////////////////////////////////////////////////
// 激活接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			$this -> b["sc"] = 405;
		}
	
		//POST逻辑
		public function doPOST(){
			$this -> b["sc"] = 405;
		}
	
		//PUT逻辑
		public function doPUT(){
			$this -> active();
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		//激活账户
		private function active(){
			$this -> db -> sql = "select id,username,yanzheng from usr_user where username='".$this -> r('uname')."'";
			$this -> db -> Queryone();
			if($this -> db -> rs['id']==null){				
				$this -> b["sc"] = 401;
			}
			else if($this -> db -> rs['yanzheng']==1){
				$this -> b["sc"] = 203;
			}
			else{
				$arr['yanzheng'] = 1;
				$this -> db -> Update('usr_user',$arr,"id=".$this -> db -> rs['id']);
				$this -> b["sc"] = 200;
			}
			
			
		}



		
	}
	


?>