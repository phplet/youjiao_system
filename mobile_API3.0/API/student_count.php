<?php
///////////////////////////////////////////////////////
// 学生数量接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				switch($this -> urlarr[5]){
					case "byTeacher":
						$this -> countByTeacher();
						break;
					case "byMaster":
						$this -> countByMaster();
						break;
					default:
						$this -> countByTheUser();
						break;
				}
			}
		}
		private function countByTeacher(){
			$this -> db -> sql ="select count(*) as total from usr_class  where relationship=1 and  class_Id  in (select class_Id from  usr_class   where uid='".$this -> urlarr[6]."' and relationship=2) ";
			$this -> db -> Queryone();
			$this -> b["count"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		private function countByMaster(){
			//$this -> db -> sql = "select count(*) as total from usr_student where class_id IN (select class_Id from usr_class where uid=".$this -> r('id')." and relationship=3)";
			$this -> db -> sql ="select count(*) as total from usr_class  where relationship=1 and  class_Id  in (select class_Id from  usr_class   where uid='".$this -> urlarr[6]."' and relationship=3) ";
			$this -> db -> Queryone();
			$this -> b["count"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		private function countByTheUser(){
			if($this -> vr['usr_type']==2 and $this -> vr['level']<3){
				$this -> db -> sql = "select count(*) as total from usr_student where class_id IN (select id from edu_class where school_id=".$this -> vr['school_id'].")";
				$this -> db -> Queryone();
				$this -> b['sql'] =$this -> db -> sql;
				$this -> b["count"] = $this -> db -> rs;
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b["sc"] = 403;
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
		
		
		
	}
	


?>