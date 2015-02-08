<?php
///////////////////////////////////////////////////////
// 自定义试卷接口
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
			if($this -> vr['pass']){
				$arr['name'] = (string)$this -> r('name');
				$arr['type'] = (int)$this -> r('type');
				$arr['content'] = (string)$_REQUEST['content'];
				$arr['upload_time'] = 'current_timestamp()';
				$arr['user_id'] = (int)$this -> vr['id'];				
				$this -> db -> Insert('upload_exam',$arr);
				$this -> b["sc"] = 201;
			}
			else{
				$this -> b["sc"] = 401;
			}
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}


		
	}
	


?>