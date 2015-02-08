<?php
///////////////////////////////////////////////////////
// 成绩接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				if($this -> urlarr[3]=="student"){
					$this -> db -> sql = 'select my_score,log_time from study_exercise where user_id='.$this -> r('student_id')." and !isnull(my_score) and exercise_id in (select id from exam_exercise where subject_id=".$this -> r('subject_id').")";
					$this -> db -> Query();
					//$this -> b["sql"]=$this -> db -> sql;
					$this -> b["mark"] = $this -> db -> rs;
					$this -> b["sc"] = 200;
				}
				else{
					$this -> b["sc"] = 404;
				}
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
		//录入成绩
			if($this -> vr['pass'] && $this -> vr['usr_type']==2 && $this -> vr['level']==3){
				$arr['log_time'] = $_REQUEST['do_time'];
				//$arr['duration'] = $this -> r('duration');
				$arr['my_score'] = round($_REQUEST['score']);
				$arr['type'] = "2";
				$this -> db -> Update('study_exercise',$arr,"id=".$this -> r('test_id'));
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b["sc"] = 403;
			}
			
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		
	}
	


?>