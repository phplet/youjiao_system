<?php
///////////////////////////////////////////////////////
// 学生列表接口
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
					case "withEvaluation":
						$this -> getListWithEvaluation();
						break;
					case "withClassTeacherMasterEvaluation":
						$this -> getListWithClassTeacherMasterEvaluation();
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
		
		//获取学生列表与成绩
		public function getListWithEvaluation(){
			$class="";
			if($this -> vr['level']>2){
				$this -> db -> sql = "select class_Id from usr_class where uid=".$this -> r('teacher_id');
				$this -> db -> Query();
				foreach($this -> db -> rs as $v){
					$class .= $v['class_Id'].",";
				}
			}
			else if($this -> vr['level']==2){
				$this -> db -> sql = "select id from edu_class where school_id=".$this -> vr['school_id'];
				$this -> db -> Query();
				foreach($this -> db -> rs as $v){
					$class .= $v['id'].",";
				}
			}
			
			//$class .= "0";
			$class = substr($class,0,-1);
			$this -> db -> sql = "select usr_user.id,realname,gender,grade_id,reg_time from usr_user join usr_student on usr_user.id=usr_student.uid where usr_user.id IN (select uid from usr_class where class_Id IN (".$class.") and relationship=1) ";
			if(isset($_REQUEST['grade_id']) and $_REQUEST['grade_id']!=null){
				$this -> db -> sql .= " and grade_id=".$this -> r('grade_id');
			}
			if(isset($_REQUEST['realname']) and $_REQUEST['realname']!=null){
				$this -> db -> sql .= " and realname like '%".$this -> r('realname')."%'";
			}
			$this -> db -> sql .=" order by usr_user.id desc";
			
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
			
			//$this -> b["sql"] = $this -> db -> sql;	
				
			$this -> db -> Query();
			$this -> b["student"] = $this -> db -> rs;
			$this -> b["pages"]=$pageTotal;
			$this -> b['all'] = count($this -> db -> rs);
			
			$uid="";
			foreach($this -> db -> rs as $v){
				$uid .= $v['id'].",";
			}
			$uid = substr($uid,0,-1);
			//$uid .= "0";
			
			if($this -> vr['level']==4)
			{
				$this -> db -> sql ="select count(aa.id) as total,avg(aa.my_score) as av,aa.user_id  
				 from  ( select distinct t1.id , t1.my_score ,t1.user_id  from  study_exercise t1 ,usr_class t2,exam_exercise  t3  where t1.exercise_id =t3.id
				 and  t1.user_id IN (".$uid.") and t1.user_id=t2.uid and t2.relationship=1 and t2.class_Id  in (".$class.") and (!isnull( t1.my_score )) and t3.subject_id=" .$this -> vr['subject_id']. " and t3.creator_id=". $this -> vr['id']."  )  aa  group by aa.user_id";
			}
			else
			{
				$this -> db -> sql ="select count(aa.id) as total,avg(aa.my_score) as av,aa.user_id  
				 from  ( select distinct t1.id , t1.my_score ,t1.user_id  from  study_exercise t1 ,usr_class t2,exam_exercise  t3  where t1.exercise_id =t3.id
				 and  t1.user_id IN (".$uid.") and t1.user_id=t2.uid and t2.relationship=1 and t2.class_Id  in (".$class.") and (!isnull( t1.my_score )) )  aa  group by aa.user_id";
			}
			
			//$this -> db -> sql = "select count(id) as total,avg(my_score) as av,user_id from study_exercise where exercise_id IN (select id from exam_exercise ) and user_id IN (".$uid.")  and  group by user_id";
			
			$this -> b["sql"]=$this -> db -> sql; 
			$this -> db -> Query();
			$this -> b["evaluation"] = $this -> db -> rs;

			//$this -> db -> sql = "select usr_user.id,usr_user.realname,study_exercise.log_time from (usr_user JOIN study_exercise ON study_exercise.user_id=usr_user.id order by study_exercise.id DESC) where usr_user.id IN (select usr_class.uid from usr_class where usr_class.class_Id IN (select class_Id from usr_class where uid=".$this -> r('teacher_id').")) group by usr_user.id limit ".$this -> page[0].",".$this -> page[1];	
			
			//$this -> db -> sql = "select usr_user.id,usr_user.realname,count(study_exercise.id) as total,study_exercise.log_time,avg(study_exercise.my_score) as av from ((usr_user JOIN usr_class ON usr_user.id=usr_class.uid) JOIN study_exercise ON study_exercise.user_id=usr_user.id order by study_exercise.id DESC) where usr_class.class_Id IN (select usr_class.class_Id from (usr_teacher JOIN usr_class ON usr_teacher.uid=usr_class.uid)) where usr_teacher.uid=".$this -> r('teacher_id')." group by usr_class.class_Id limit ".$this -> page[0].",".$this -> page[1];			
		
			//$this -> db -> sql = "select usr_user.id,usr_user.realname,count(study_exercise.id) as total,study_exercise.log_time,avg(study_exercise.my_score) as av from ((usr_user JOIN usr_class ON usr_user.id=usr_class.uid) JOIN (SELECT study_exercise.* FROM study_exercise ORDER BY study_exercise.id DESC) study_exercise ON study_exercise.user_id=usr_user.id) where usr_class.class_Id IN (select usr_class.class_Id from (usr_teacher JOIN usr_class ON usr_teacher.uid=usr_class.uid) where usr_teacher.uid=".$this -> r('teacher_id')." group by usr_class.class_Id limit ".$this -> page[0].",".$this -> page[1];
			//$this -> db -> Query();
			//$this -> b['student'] = $this -> db -> rs;
			$this -> b["sc"] = 200;
			
		}
		//获取学生列表
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
				$this -> db -> sql = "select ".$str." from usr_student JOIN usr_user ON usr_user.id=usr_student.uid where ".$condition." limit ".$this -> page[0].",".$this -> page[1];
			}
			else{
				$this -> db -> sql = "select ".$str." from usr_student JOIN usr_user ON usr_user.id=usr_student.uid limit ".$this -> page[0].",".$this -> page[1];
			}
			
			$this -> db -> Query();
			$this -> b['student'] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		//获取学生班级教师班主任测试列表
		public function getListWithClassTeacherMasterEvaluation(){
			$this -> db -> sql = "select t11.id as student_id,t11.realname as student_name,t12.grade_id,t32.subject_grade,t31.realname as teacher_name,t31.realname as master_name from ((((usr_user as t11 JOIN usr_student as t12 ON t11.id=t12.uid and t11.usr_type=1) JOIN usr_class as t13 ON t13.uid=t12.uid and t13.relationship=1) JOIN   (((usr_user as t21 JOIN usr_teacher as t22 ON t21.id=t22.uid and t22.level=4) JOIN usr_class as t23 ON t23.uid=t22.uid and t23.relationship=2) JOIN exam_exercise as t24 ON t24.creator_id=t22.uid) ON t13.class_Id=t23.class_Id ) JOIN  ((usr_user as t31 JOIN usr_teacher as t32 ON t31.id=t32.uid and t32.level=3) JOIN usr_class as t33 ON t33.uid=t32.uid) ON t13.class_Id=t33.class_Id ) where t23.class_Id IN (select t41.class_Id from (usr_class as t41 JOIN edu_class as t42 ON t41.class_Id=t42.id and t42.school_id=".$this -> r('school_id')." and t41.relationship=2))";
			$this -> db -> Query();
			$this -> b['student'] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		
	}
	


?>