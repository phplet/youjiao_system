<?php
///////////////////////////////////////////////////////
// 教师数量接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");

	
	
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				$this -> getCount();
			}
		}
	
		//POST逻辑
		public function doPOST(){
			$this -> b["sc"] = 405;
		}
	
		//PUT逻辑
		public function doPUT(){
			$this -> b["sc"] = 405;
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		//获取教师总数
		/*
		public function getCountold(){
			if($this->vr['usr_type']==2 and $this -> vr['level']==2){//教学主任
				$this -> db -> sql = "select count(*) as total from usr_teacher where school_id=".$this->vr['school_id']." and level=4";
				$this -> db -> Queryone();
				$this -> b['teacher'] = $this -> db -> rs;
				$this -> db -> sql = "select count(*) as total from usr_teacher where school_id=".$this->vr['school_id']." and level=3";
				$this -> db -> Queryone();
				$this -> b['master'] = $this -> db -> rs;
			}
			else if($this->vr['usr_type']==2 and $this -> vr['level']==1){ //校长
				$this -> db -> sql = "select count(*) as total from usr_teacher where school_id in (select id from edu_school where uplevel_id=".$this->vr['school_id'].") and level=4";
				$this -> db -> Queryone();
				$this -> b['teacher'] = $this -> db -> rs;
				$this -> db -> sql = "select count(*) as total from usr_teacher where school_id in (select id from edu_school where uplevel_id=".$this->vr['school_id'].") and level=3";
				$this -> db -> Queryone();
				$this -> b['master'] = $this -> db -> rs;
			}
			else if($this->vr['usr_type']==2 and $this -> vr['level']==3){//班主任
				$this -> db -> sql = "select count(*) as total from usr_teacher where id IN (select uid from usr_class where class_Id in (select class_Id from usr_class where uid=".$this->vr['id'].") and relationship=2)";
				$this -> db -> Queryone();
				$this -> b['teacher'] = $this -> db -> rs;
			}
			else{
				$this -> b["sc"] = 403;
				return;
			}
			
			$this -> b["sc"] = 200;
		}
		*/
		
		public function getCount(){
			if($this->vr['usr_type']==2 and $this -> vr['level']==2){//教学主任
				$this -> db -> sql = "select count(*) as total from usr_teacher where school_id=".$this->vr['school_id']." and level=4";
				$this -> db -> Queryone();
				$this -> b['teacher'] = $this -> db -> rs;
				$this -> db -> sql = "select count(*) as total from usr_teacher where school_id=".$this->vr['school_id']." and level=3";
				$this -> db -> Queryone();
				$this -> b['master'] = $this -> db -> rs;
			}
			else if($this->vr['usr_type']==2 and $this -> vr['level']==1){ //校长
				$this -> db -> sql = "select count(*) as total from usr_teacher where school_id in (select id from edu_school where uplevel_id=".$this->vr['school_id'].") and level=3";
				$this -> db -> Queryone();
				$this -> b['teacher'] = $this -> db -> rs;
				$this -> db -> sql = "select count(*) as total from usr_teacher where school_id in (select id from edu_school where uplevel_id=".$this->vr['school_id'].") and level=2";
				$this -> db -> Queryone();
				$this -> b['master'] = $this -> db -> rs;
			}
			else if($this->vr['usr_type']==2 and $this -> vr['level']==3){//班主任
				$this -> db -> sql = "select count(*) as total from usr_teacher where id IN (select uid from usr_class where class_Id in (select class_Id from usr_class where uid=".$this->vr['id'].") and relationship=2)";
				$this -> db -> Queryone();
				$this -> b['teacher'] = $this -> db -> rs;
			}
			else{
				$this -> b["sc"] = 403;
				return;
			}
			
			$this -> b["sc"] = 200;
		}

		
	}
	


?>