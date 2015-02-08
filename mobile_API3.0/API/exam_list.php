<?php
///////////////////////////////////////////////////////
// 试卷列表接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			if($this -> urlarr[3]=="list"){
					switch($this -> urlarr[4]){
						case "wait":
							$this -> getExamwait();
						break;
						case "ok":
							$this -> getExamok();
						break;
						default:
							$this -> getExam();
						break;
					}
			}
			else{
				$this -> b["sc"] = 405; 
			}
			
		}
		private function getExamwait(){
			if($this -> vr['pass'] && $this -> vr['usr_type']==2){
				$this -> db -> sql = "select exam_exercise.id,exam_exercise.name,exam_exercise.subject_id,exam_exercise.class_id,edu_class.Name as class_name from exam_exercise join edu_class on exam_exercise.class_id=edu_class.id where exam_exercise.class_id in (select class_Id from usr_class where uid=".$this -> vr['id'].") and exam_exercise.exam_stat=1";
				$this -> db -> Query();
				$this -> b['exam'] = $this -> db -> rs;
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
		
		private function getExamok(){
			if($this -> vr['pass'] && $this -> vr['usr_type']==2){
				$this -> db -> sql = "select exam_exercise.id,exam_exercise.name,exam_exercise.subject_id,exam_exercise.class_id,edu_class.Name as class_name from exam_exercise join edu_class on exam_exercise.class_id=edu_class.id where exam_exercise.class_id in (select class_Id from usr_class where uid=".$this -> vr['id'].") and exam_exercise.exam_stat>2";
				$this -> db -> Query();
				$this -> b['exam'] = $this -> db -> rs;
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
		
		private function getExam(){
			if($this -> vr['pass'] && $this -> vr['usr_type']==2){
				if($this -> vr['level']==4){  //按教师取
				   if(isset($_REQUEST["papername"]))
				   { 
					  $this -> db -> sql = "select exam_exercise.id,exam_exercise.name,exam_exercise.subject_id,exam_exercise.tmod,exam_exercise.field,exam_exercise.exer_type,exam_exercise.exam_stat,creat_date,exam_exercise.assign_type from exam_exercise where exam_exercise.subject_id=".$this -> vr['subject_id']." and (exam_exercise.name like '%".$_REQUEST["papername"]."%' ) and  ( (exam_exercise.class_id in (select class_Id from usr_class where  uid=".$this -> vr['id'].")) or exam_exercise.creator_id=".$this -> vr['id'].") "; 
				   }
				   else
				   {
					$this -> db -> sql = "select exam_exercise.id,exam_exercise.name,exam_exercise.subject_id,exam_exercise.tmod,exam_exercise.field,exam_exercise.exer_type,exam_exercise.exam_stat,creat_date,exam_exercise.assign_type from exam_exercise where  exam_exercise.subject_id=".$this -> vr['subject_id']." and  (exam_exercise.class_id in (select class_Id from usr_class where uid=".$this -> vr['id'].")) or exam_exercise.creator_id=".$this -> vr['id'];
				   }
				}
				else if($this -> vr['level']==3 or $this -> vr['level']==2){  //按学校的班级取
					$this -> db -> sql = "select exam_exercise.id,exam_exercise.name,exam_exercise.subject_id,exam_exercise.tmod,exam_exercise.field,exam_exercise.exer_type,exam_exercise.exam_stat,creat_date,exam_exercise.assign_type from exam_exercise where exam_exercise.class_id in (select id from edu_class where school_id=".$this -> vr['school_id'].") ";
				}
				
				$sOrder=" order by exam_exercise.id desc ";
				
				$this -> db -> Query();
				$page=$this -> urlarr[4];
				$pageSize=20;
				$recordFrom=1;
				
				$pageTotal=count($this -> db -> rs);
						
				if (!($page==null))
				{
					$arr=explode(",",$page);
					$pageSize=$arr[1];
					$recordFrom=$arr[0];
					$this -> db -> sql=$this -> db -> sql. " " .$sOrder;
					$this -> db -> sql=$this -> db -> sql. " limit ". $recordFrom. ", ". $pageSize;
				}
			    
				//$this -> b['sql']=$this -> db -> sql;	
				$this -> db -> Query();		
				$this -> b["pages"]=$pageTotal;
				$this -> b['exam'] = $this -> db -> rs;
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
		
		
		
	}
	


?>