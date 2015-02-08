<?php
///////////////////////////////////////////////////////
// 省查询接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		
		public function doGET(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			$action = $this->r('action');
			switch($action){
				case 'init':
					
					$this->get_subject_list();
					$this->get_question_type_list();
					
					break;
					
			}
		}
		
		
		public function doPOST(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			$action = $this->r('action');
			
			switch($action){
				case 'modify':
					
					$knowledge_id = $this->r('knowledge');
					$question_ids = $this->r('question');
					$subject_id = $this->r('subject');
					
					$this->post_modify_relation($knowledge_id , $subject_id , $question_ids);
					
					break;
					
				case 'disable':
					
					$question_ids = $this->r('question');
					$subject_id = $this->r('subject_id');
					$this->post_delete_question($question_ids , $subject_id);
			}
			
		}
		
		private function get_publisher_list(){
			$this->db->switchDB('hx_curriculumn');
			
			$sql = 'SELECT id,Name,notes FROM edu_publisher';
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['publisher'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
		private function get_grade_list(){
			$this->db->switchDB('hx_curriculumn');
			
			$sql = 'SELECT * FROM edu_grade';
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['grade'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
		private function get_province_list(){
			$this->db->switchDB('hx_curriculumn');
			
			$sql = 'SELECT * FROM area_province';
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['province'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
		private function get_year_list(){
			$this->db->switchDB('hx_curriculumn');
			
			$this->db->sql = 'SELECT DISTINCT year FROM exam_examination WHERE year like "%年" AND exam_type=1 ORDER BY year DESC';
			$this->db->Query();
			$this->b['year'] = $this->db->rs;
			foreach($this->b['year'] as $k => $v){
				$this->b['year'][$k]['id'] = $k;
			}
			$this->b['sc'] = 200;
			
		}
		
		private function get_subject_list(){
			$this->db->switchDB('hx_curriculumn');
			
			$this->db->sql = 'SELECT * FROM edu_subject';
			$this->db->Query();
			$this->b['subject'] = $this->db->rs;
			$this->b['sc'] = 200;
			
		}
		
		private function get_question_type_list(){
			$this->db->switchDB('hx_curriculumn');
			
			$this->db->sql = 'SELECT * FROM edu_question_type';
			$this->db->Query();
			$this->b['question_type'] = $this->db->rs;
			$this->b['sc'] = 200;
			
		}
		
		private function get_exam_data_list($year , $section , $subject , $province){
			
			$this->db->switchDB('hx_curriculumn');
			
			$tblExam = array(
				'exam_examination',
				'id' , 'name' 
			);
			
			$tblGrade = array(
				'edu_grade'
			);
			
			$tblCondition = array(
				'exam_examination.grade_id=edu_grade.id'
			);
			
			$where = 'exam_examination.exam_type=1 AND year="'.$year.'" AND edu_grade.class_section_id='.$section.' AND subject_id='.$subject.' AND province_id='.$province;
			$tblCondition['where'] = $where;
			
			$this->b = $this->db->withQueryMakerLeft($tblExam , $tblGrade , $tblCondition);
//			echo $this->db->sql;
			$this->b['sc'] = 200;
			
		}
		
		private function get_unit_list($subject , $grade , $publisher){
			
			$this->db->switchDB('hx_curriculumn');
			
			$sql = <<<SQL

				SELECT 
					DISTINCT edu_chapter.unit 
				FROM 
					edu_chapter 
				LEFT JOIN edu_books ON edu_chapter.bid=edu_books.id 
				WHERE edu_books.grade_id=$grade AND edu_books.publisher_id=$publisher AND edu_books.subject_id=$subject 
				ORDER BY unit ASC
SQL;
			
			$this->db->sql = $sql;
			$this->db->Query();
			
			$this->b = $this->db->rs;
			
			foreach($this->b as $k => $v){
				$this->b[$k]['id'] = $k;
			}
			
			$this->b['sc'] = 200;
			
		}

		private function get_chapter_list($subject , $grade , $publisher , $unit){
			$this->db->switchDB('hx_curriculumn');
			
			$sql = <<<SQL

				SELECT 
					edu_chapter.id ,  edu_chapter.chaper as chapter 
				FROM 
					edu_chapter 
				LEFT JOIN edu_books ON edu_chapter.bid=edu_books.id 
				WHERE edu_books.grade_id=$grade AND edu_books.publisher_id=$publisher AND edu_books.subject_id=$subject AND edu_chapter.unit="$unit" 
				ORDER BY chapter ASC
SQL;

			$this->db->sql = $sql;
			$this->db->Query();
			
			$this->b = $this->db->rs;
			
			$this->b['sc'] = 200;
			
		}
	
		private function post_modify_relation($knowledge_id , $subject_id , $question_ids){
			$this->db->switchDB('hx_curriculumn');
			
			$subject = array(
				1=>'yw',//语文
				2=>'sx',
				3=>'yy',
				4=>'wl',
				5=>'hx',
				6=>'sw',
				7=>'dl',
				8=>'ls',
				9=>'zz'
			);
			
			$tableName = $subject[$subject_id].'_exam_question_to_knowledge';
			
			$questionArray = explode('_' , $question_ids);
			$insertArray = array();
			
			$question_ids = implode(',',$questionArray);
			
			$sql = <<<SQL
				UPDATE $tableName SET knowledge_id=$knowledge_id WHERE id in ($question_ids);
SQL;
			
//			foreach($questionArray as $v){
//				$insertArray[] = array('knowledge_id'=>$knowledge_id , 'question_id'=>$v);
//			}
			
//			$flag = $this->db->Inserts('exam_question_to_knowledge' , $insertArray);
			$this->db->sql = $sql;
			
			$flag = $this->db->ExecuteSql();
			
			$this->b['flag'] = $flag;
			$this->b['sc'] = 200;
			
		}
		
		private function post_delete_question($question_ids , $subject_id){
			$this->db->switchDB('hx_curriculumn');
			
			$subject = array(
				1=>'yw',//语文
				2=>'sx',
				3=>'yy',
				4=>'wl',
				5=>'hx',
				6=>'sw',
				7=>'dl',
				8=>'ls',
				9=>'zz'
			);
			
			$deleteWhere = 'question_id in ("'.implode('","', explode('_',$question_ids)).'")';
			
			$flag = $this->db->delete($subject[$subject_id].'_exam_question_to_knowledge' , $deleteWhere);
			
			$tableName = $subject[$subject_id].'_exam_question_index';
			if($flag){
				$this->db->sql = 'UPDATE '.$tableName.' SET match_flag=0 WHERE gid IN ("'.implode('","', explode('_',$question_ids)).'")';
				$flag2 = $this->db->ExecuteSql();
				$this->b['flag'] = $flag && $flag2;
			}else{
				$this->b['flag'] = false;
			}
			
			$this->b['sc'] = 200;
			
			
			
		}
		
	}