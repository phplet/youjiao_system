<?php
///////////////////////////////////////////////////////
// 测试统计接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				switch($this -> urlarr[3]){
					case "school":
						$this -> getbyschool();
					break;
					case "teacher":
						$this -> getbyteacher();
					break;
					case "master":
						$this -> getbymaster();
					break;
					default:
					break;
				}
				
			}
		}
		private function getbyschool(){
			$this -> db -> sql = "select count(*) as total from study_exercise where exercise_id IN (select id from exam_exercise where school_id in (select id from edu_school where id=".$this -> r('school_id')." or uplevel_id=".$this -> r('school_id').")";
			if(strlen($this -> r("minTime"))!=0 && strlen($this -> r("minTime"))!=0){
				$this -> db -> sql .= " and creat_date BETWEEN '".$this -> r("minTime")."' AND '".$this -> r("minTime")."')";
			}
			else{
				$this -> db -> sql .= ")";
			}
			$this -> db -> Queryone();
			
			$this -> b["evaluation"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		private function getbyteacher(){			
			$this -> db -> sql = "select count(*) as total from study_exercise where exercise_id IN (select id from exam_exercise where creator_id=".$this -> r('teacher_id');
			if(strlen($this -> r("minTime"))!=0 && strlen($this -> r("minTime"))!=0){
				$this -> db -> sql .= " and creat_date BETWEEN '".$this -> r("minTime")."' AND '".$this -> r("minTime")."')";
			}
			else{
				$this -> db -> sql .= ")";
			}
			$this -> db -> Queryone();
			
			$this -> b["evaluation"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		private function getbymaster(){			
			$this -> db -> sql = "select count(*) as total from study_exercise where exercise_id IN (select id from exam_exercise where class_id IN (select class_Id from usr_class where uid=".$this -> r('teacher_id')." and relationship=3)";
			if(strlen($this -> r("minTime"))!=0 && strlen($this -> r("minTime"))!=0){
				$this -> db -> sql .= " and creat_date BETWEEN '".$this -> r("minTime")."' AND '".$this -> r("minTime")."')";
			}
			else{
				$this -> db -> sql .= ")";
			}
			$this -> db -> Queryone();
			
			$this -> b["evaluation"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
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