<?php
///////////////////////////////////////////////////////
// 题库用户做题记录接口
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
			$this -> addHistory();
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		//加入记录
		private function addHistory(){
			//echo 1111;return false;
			if($this -> vr['pass']){
				$arr['uid'] = (int)$this -> vr['id'];
				$arr['tid'] = (int)$this -> r('tid');
				$arr['time_start'] = $this -> r('time_start');
				$arr['time_end'] = $this -> r('time_end');
				$arr['answer'] = (string)$this -> r('answer');
				//echo $arr['answer'];return false;
				$arr['correct'] = (int)$this -> r('correct');
				$this -> db -> Insert("ticool_user_history",$arr);
				$this -> b["sc"] = 201;
			}
			else{
				$this -> b["sc"] = 401;
			}
			
		}


		
	}
	


?>