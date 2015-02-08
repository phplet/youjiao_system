<?php
///////////////////////////////////////////////////////
// 教师列表接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				$this -> page = explode(",",$this -> urlarr[5]);

				if($this -> page==null or !is_numeric($this -> page[0]) or !is_numeric($this -> page[1])){
					$this -> b["sc"] = 403;
					return;
				}
				switch($this -> urlarr[6]){
					case "withMaster":
						$this -> getListWithMaster();
						break;
					case "withEvaluation":
						$this -> getListWithEvaluation();
						break;
					default:
						$this -> getList();
						break;
				}
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
		
		//获取教师列表与成绩
		public function getListWithEvaluation(){
			$class="";
			if(isset($_REQUEST['student_id'])){
				$this -> db -> sql = "select class_Id from usr_class where uid=".$this -> r('student_id')." and relationship=1";
				$this -> db -> Query();
				
				foreach($this -> db -> rs as $v){
					$class .= $v['class_Id'].",";
				}
				$class = substr($class,0,-1);
				$this -> db -> sql = "select id as class_id,is_open from edu_class where id in (".$class.")";
				$this -> db -> Query();
				$this -> b['class'] = $this -> db -> rs;
				
			}
			else if($this -> vr['level']==2){
				$this -> db -> sql = "select id as class_id,is_open from edu_class where school_id=".$this -> vr['school_id'];
				$this -> db -> Query();
				$this -> b['class'] = $this -> db -> rs;
				foreach($this -> db -> rs as $v){
					$class .= $v['class_id'].",";
				}
				$class = substr($class,0,-1);
			}
			else if($this -> vr['level']==3){
				$this -> db -> sql = "select class_Id from usr_class where uid=".$this -> vr['id'];
				$this -> db -> Query();
				foreach($this -> db -> rs as $v){
					$class .= $v['class_Id'].",";
				}
				$class = substr($class,0,-1);
				$this -> db -> sql = "select id as class_id,is_open from edu_class where id in (".$class.")";
				$this -> db -> Query();
				$this -> b['class'] = $this -> db -> rs;
			}			
			
			$this -> db -> sql = "select usr_user.id as uid,usr_user.realname,subject_grade,usr_class.class_Id as class_id from (usr_user JOIN usr_class ON usr_user.id=usr_class.uid) JOIN usr_teacher ON usr_teacher.uid=usr_user.id where usr_class.class_Id IN (".$class.") and usr_class.relationship=2 group by usr_class.class_Id";
			$this -> db -> Query();
			$this -> b['teacher'] = $this -> db -> rs;
			if(isset($_REQUEST['student_id'])){
				$this -> db -> sql = "select count(study_exercise.id) as total,exam_exercise.class_id as class_id from study_exercise join exam_exercise on study_exercise.exercise_id=exam_exercise.id where exam_exercise.class_id IN (".$class.") and user_id=".$this -> r('student_id')." group by exam_exercise.class_id";
			}
			else{
				$this -> db -> sql = "select count(*) as total,usr_class.class_Id as class_id from study_exercise JOIN usr_class ON study_exercise.user_id=usr_class.uid where usr_class.relationship=1 and usr_class.class_Id IN (".$class.") group by usr_class.class_Id";
			}
			$this -> b['sql']=$this -> db -> sql;
			$this -> db -> Query();
			$this -> b['evaluation'] = $this -> db -> rs;
			
			
			/* $this -> db -> sql = "select 'usr_user.id,usr_user.realname,usr_teacher.subject_grade,count(*) as total from ( (usr_user JOIN usr_teacher ON usr_user.id=usr_teacher.uid and level=4) JOIN usr_class ON usr_class.uid=usr_teacher.uid ) JOIN exam_exercise ON exam_exercise.creator_id=usr_user.id where usr_class.class_Id IN (select usr_class.class_Id from usr_class where usr_class.uid=".$this -> r('student_id').") group by usr_class.class_Id";
			$this -> db -> Query();
			$this -> b['teacher'] = $this -> db -> rs; */
			$this -> b["sc"] = 200;
		}
		//获取教师列表
		public function getList(){
			$get = explode(";",$this -> v($this -> urlarr[6]));
			for($i=0;$i<count($get);$i++){
				$str .= $get[$i].",";
			}

			$str = substr($str,0,-1);
			if(strlen($_REQUEST['condition'])!=0){
				$c = explode(";",$this -> r("condition"));
				for($i=0;$i<count($c);$i++){
					$cc = explode(":",$c[$i]);
					if(is_string($cc[1])){
						$condition .= $cc[0]."='".$cc[1]."' and ";
					}
					else{
						$condition .= $cc[0]."=".$cc[1]." and ";
					}
				}
				$condition = substr($condition,0,-5);
				$this -> db -> sql = "select ".$str." from usr_teacher JOIN usr_user ON usr_user.id=usr_teacher.uid where ".$condition." limit ".$this -> page[0].",".$this -> page[1];
			}
			else{
				$this -> db -> sql = "select ".$str." from usr_teacher JOIN usr_user ON usr_user.id=usr_teacher.uid limit ".$this -> page[0].",".$this -> page[1];
			}
			
			$this -> db -> Query();
			$this -> b['teacher'] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		//获取教师班主任列表
		public function getListWithMaster(){
			$class="";
			if($this -> vr['level']==2){
				if($_REQUEST['type']==3){
					$this -> echomaster2();
				}
				else if($_REQUEST['type']==4){
					$this -> echoteacher2();
				}
				else{
					$this -> echomaster2();
					$this -> echoteacher2();
				}
			}
			else if($this -> vr['level']==3){
				$this -> db -> sql = "select class_Id from usr_class where uid=".$this -> vr['id'];
				$this -> db -> Query();
				foreach($this -> db -> rs as $v){
					$class .= $v['class_Id'].",";
				}
				$this -> echoteacher($class);
			}
			else{
				$this -> b["sc"] = 403;
			}

			
			
			
			
		}
		private function echoteacher($class){
			$this -> db -> sql = "select usr_user.id,realname,usr_teacher.subject_grade from usr_user join usr_teacher on usr_teacher.uid = usr_user.id where id IN (select uid from usr_class where class_Id IN (".$class.") and relationship=2)";
			if(isset($_REQUEST['subject_id']) and $_REQUEST['subject_id']!=null){
					$this -> db -> sql .= " and subject_grade like '%subject%".$this -> r('subject_id')."%],%'";
			}
			if(isset($_REQUEST['realname']) and $_REQUEST['realname']!=null){
				$this -> db -> sql .= " and realname like '%".$this -> r('realname')."%'";
			}
			
			$this -> db -> Query();
			$this -> b['teacher'] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		
		private function echomaster($class){
			$this -> db -> sql = "select id,realname from usr_user where id IN (select uid from usr_class where class_Id IN (".$class.") and relationship=3)";
			$this -> db -> Query();
			$this -> b['master'] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		
		private function echoteacher2(){
			$this -> db -> sql = "select usr_user.id,realname,usr_teacher.subject_grade from usr_user join usr_teacher on usr_teacher.uid = usr_user.id where school_id=".$this -> vr['school_id']." and level=4";
			if(isset($_REQUEST['subject_id']) and $_REQUEST['subject_id']!=null){
					$this -> db -> sql .= " and subject_grade like '%subject%".$this -> r('subject_id')."%],%'";
			}
			if(isset($_REQUEST['realname']) and $_REQUEST['realname']!=null){
				$this -> db -> sql .= " and realname like '%".$this -> r('realname')."%'";
			}
			$this -> db -> Query();
			
			$page=$this -> urlarr[5];
			$pageSize=20;
			$recordFrom=1;
			$pageTotal=count($this -> db -> rs);
			
			if (!($page==null))
			{
				$arr=explode(",",$page);
				$pageSize=$arr[1];
				$recordFrom=$arr[0];
				$this -> db -> sql=$this -> db -> sql. " limit ". $recordFrom. ", ". $pageSize;
			}	

			$this -> db -> Query();
			$this -> b["pages"]=$pageTotal;
			$this -> b['teacher'] = $this -> db -> rs;	
			
			$this -> b["sc"] = 200;
		}
		 
		private function echomaster2(){
			$this -> db -> sql = "select usr_user.id,realname from usr_user join usr_teacher on usr_teacher.uid = usr_user.id where school_id=".$this -> vr['school_id']." and level=3";
			if(isset($_REQUEST['subject_id']) and $_REQUEST['subject_id']!=null){
					$this -> db -> sql .= " and subject_grade like '%subject%".$this -> r('subject_id')."%],%'";
			}
			if(isset($_REQUEST['realname']) and $_REQUEST['realname']!=null){
				$this -> db -> sql .= " and realname like '%".$this -> r('realname')."%'";
			}
			$this -> db -> Query();
			$this -> b['master'] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		
	}
?>