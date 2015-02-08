<?php
///////////////////////////////////////////////////////
// 专题突破接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		public function doGET(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			switch($action){
				case 'init':
					
					$this->get_init();
					$this->b['sc'] = 200;
					
					break;
			}
			
		}
		
		public function doPOST(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			switch($action){
				case 'add2haoti':
					
					$subject_id = $this->r('subject');
					$question_id = $this->r('question');
					$answer = $this->r('answer');
					
					$this->post_add2haoti($subject_id , $question_id , $answer);
					
					break;
			}
			
		}
		
		private function get_init(){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			
//			$user_id = $this->vr['id'];
//			$user_id = 169;
//			$section_id = $this->vr['section_id'];
			$section_id = 2;
			
			$sql = <<<SQL
				SELECT subject_id,edu_grade.name as grade_name , edu_subject.name as subject_name FROM exam_examination 
				JOIN edu_grade ON exam_examination.grade_id=edu_grade.id
                JOIN edu_subject ON exam_examination.subject_id=edu_subject.id 
				WHERE edu_grade.section_id=$section_id
				GROUP BY exam_examination.subject_id
SQL;

//echo $sql;
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['subject'] = $this->db->rs;
			
		}

		private function post_add2haoti($subject_id , $question_id , $answer){
			$this->db->switchDB($this->userdbhost,$this->userdbname);
			$insertInfo = array(
				'flag'=>1,
				'user_id'=>$this->vr['id'],
				'grade_id'=>$this->vr['grade_id'],
				'add_time'=>'current_timestamp()',
				'question_id'=>$question_id,
				'my_answer'=>$answer,
				'is_examination'=>2,
				'subject_id'=>$subject_id
			);
			
			$this->b['flag'] = $this->db->Insert('study_collection' , $insertInfo);
//			echo $this->db->sql;
			$this->b['sc'] = 200;
			
		}
		
		
	}
?>