<?php
///////////////////////////////////////////////////////
// 题库反馈接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			$start = ($this -> r('page') - 1)*$this -> r('rp');
			$this -> db -> sql ="SELECT system_feedback.id as id,system_feedback.userid as userid,usr_user.username,usr_user.code, system_feedback.content, system_feedback.feedtime FROM system_feedback JOIN usr_user ON system_feedback.userid = usr_user.id order by system_feedback.id desc limit ".$start.",".$this -> r('rp');
			$this -> db -> Query();
			$this -> b['rows'] = $this -> db -> rs;
			$this -> db -> sql ="select count(*) as total from system_feedback";
			$this -> db -> Queryone();
			$this -> b['total'] = $this -> db -> rs['total'];
			$this -> b['page'] = $this -> r('page');
			$this -> b["sc"] = 200;
		}
	
		//POST逻辑
		public function doPOST(){
			$this -> b["sc"] = 405;
		}
	
		//PUT逻辑
		public function doPUT(){
			if($this -> vr['pass']){
				$this -> insertFeedback();
			}
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		//插入新的反馈
		private function insertFeedback(){
			$arr['userid'] = $this -> vr['id'];
			$arr['feedtime'] = 'current_timestamp()';
			$arr['content'] = $this -> r('content');
			$this -> db -> Insert('system_feedback',$arr);
			$this -> b["sc"] = 200;
		}

		
	}
	


?>