<?php
// xiaokun 压力测试接口
//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			$action = $this->r('action');
					switch ($action){
						case 'stress':
						$this->get_stress_tests();
						break;
					}
		}
	
		//POST逻辑
		public function doPOST(){
		}
	
		//PUT逻辑
		public function doPUT(){
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		public function get_stress_tests(){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
//			$sql = 'select id from sx_exam_question order by rand() limit 0,1';
			$sql = 'select sx_exam_question.id,sx_exam_question.content,sx_exam_question.objective_answer,sx_exam_question.image,
			sx_exam_question_index.*
			from sx_exam_question 
			left join sx_exam_question_index on sx_exam_question.yid=sx_exam_question_index.yid
			 order by rand() limit 0,1; ';
		
			$this->db->sql =$sql;
			$this->db->Query();
			$rs = $this->db->rs;
			$this->b['list']  = $rs;
			$this->b['sql'] =$sql;
			$this->b['sc']  = 200;
		
		}
		

		
	}
	


?>