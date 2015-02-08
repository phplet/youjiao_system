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
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			switch($action){
				case 'init':
					
					$this->get_subject_list();
					$this->get_book_list();
					$this->get_question_type_list();
					
					break;
					
				case 'treedata':
					
					$subject_id = $this->r('subject');
					$section_id = $this->r('section');
					$book_id = $this->r('book');
					
					$this->get_treedata($subject_id , $section_id , $book_id);
					break;
					
				case 'knowledgedata':
					
					$subject_id = $this->r('subject');
					$section_id = $this->r('section');
					$step = $this->r('step');
					$offset = (intval($this->r('pageno')) - 1)*$step;
					
					$this->get_knowledge_list($section_id , $subject_id , $offset , $step);
					
					break;
					
			}
		}
		
		
		public function doPOST(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			switch($action){
				case 'modify':
					
					$knowledge_id = $this->r('knowledge');
					$question_ids = $this->r('question');
					
					$this->post_modify_relation($knowledge_id , $question_ids);
					
					break;
					
				case 'disable':
					
					$question_ids = $this->r('question');
					$this->post_delete_question($question_ids);
					break;
					
				case 'relation':
					
					$knowledge_ids = $this->r('knowledge');
					$chapter_id = $this->r('chapter');
					$type = $this->r('type');
					$subject_id = $this->r('subject');
					
					$this->post_create_knowledge_relation($knowledge_ids , $chapter_id , $type , $subject_id);
					break;
					
				case 'disable_relation':
					
					$knowledge_id = $this->r('knowledge');
					$subject_id = $this->r('subject');
					
					$this->post_delete_knowledge_relation($knowledge_id , $subject_id);	
					
					break;
			}
			
		}
		
		private function get_publisher_list(){
			$this->db->switchDB('db_qingda');
			
			$sql = 'SELECT id,Name,notes FROM edu_publisher';
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['publisher'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
		private function get_book_list(){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
//			$sql = 'SELECT edu_book.* , section_id FROM edu_book JOIN edu_grade ON edu_book.grade_id=edu_grade.id ORDER BY edu_book.grade_id ASC';
			$sql = 'SELECT edu_book.* , edu_publisher.name as publisher_name FROM edu_book  LEFT JOIN edu_publisher ON edu_book.publisher_id=edu_publisher.id ORDER BY edu_book.grade_id ASC';
			
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['book'] = $this->db->rs;
			$this->b['sc'] = 200;
			
		}
		
		private function get_grade_list(){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$sql = 'SELECT * FROM edu_grade';
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['grade'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
		private function get_province_list(){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$sql = 'SELECT * FROM area_province';
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['province'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
		private function get_year_list(){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$this->db->sql = 'SELECT DISTINCT year FROM exam_examination WHERE year like "%年" AND exam_type=1 ORDER BY year DESC';
			$this->db->Query();
			$this->b['year'] = $this->db->rs;
			foreach($this->b['year'] as $k => $v){
				$this->b['year'][$k]['id'] = $k;
			}
			$this->b['sc'] = 200;
			
		}
		
		private function get_subject_list(){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$this->db->sql = 'SELECT * FROM edu_subject';
			$this->db->Query();
			$this->b['subject'] = $this->db->rs;
//			print_r($this->b['subject']);
			$this->b['sc'] = 200;
			
		}
		
		private function get_question_type_list(){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$this->db->sql = 'SELECT * FROM edu_question_type';
			$this->db->Query();
			$this->b['question_type'] = $this->db->rs;
			$this->b['sc'] = 200;
			
		}
		
		private function get_exam_data_list($year , $section , $subject , $province){
			
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
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
		
		private function get_unit_list($subject_id , $grade , $publisher){
			
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
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
			
			$tableName1 = $subject[$subject_id].'_edu_chapter';
			$tableName2 = $subject[$subject_id].'_edu_books';
			
			$sql = <<<SQL

				SELECT 
					DISTINCT $tableName1.unit 
				FROM 
					$tableName1 
				LEFT JOIN $tableName2 ON $tableName1.bid=$tableName2.id 
				WHERE $tableName1.grade_id=$grade AND $tableName2.publisher_id=$publisher AND $tableName2.subject_id=$subject_id 
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

		private function get_chapter_list($subject_id , $grade , $publisher , $unit){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
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
			
			$tableName1 = $subject[$subject_id].'_edu_chapter';
			$tableName2 = $subject[$subject_id].'_edu_books';
			
			$sql = <<<SQL

				SELECT 
					$tableName1.id ,  $tableName1.chaper as chapter 
				FROM 
					$tableName1 
				LEFT JOIN $tableName2 ON $tableName1.bid=$tableName2.id 
				WHERE $tableName2.grade_id=$grade AND $tableName2.publisher_id=$publisher AND $tableName2.subject_id=$subject_id AND $tableName1.unit="$unit" 
				ORDER BY chapter ASC
SQL;

			$this->db->sql = $sql;
			$this->db->Query();
			
			$this->b = $this->db->rs;
			
			$this->b['sc'] = 200;
			
		}
	
		private function get_knowledge_list($section_id , $subject_id , $offset , $step){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
						
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
			
			
			$tableName = $subject[$subject_id].'_edu_knowledge';
			$tableName2 = $subject[$subject_id].'_edu_chapter2knowledge';
			
			$dataSQL = <<<SQL
				SELECT 	
					k1.id , k1.name , k2.name as pname2 , k2.id as pid2 , k3.name as pname1 , k3.id as pid1 , k4.name as pname3
				FROM 
					$tableName  k1
				LEFT JOIN $tableName k2 ON k1.parent_id=k2.id AND k2.subject_id=k1.subject_id 
				LEFT JOIN $tableName k3 ON k2.parent_id=k3.id AND k3.subject_id=k2.subject_id 
				LEFT JOIN $tableName k4 ON k3.parent_id=k4.id AND k4.subject_id=k3.subject_id
				WHERE k1.section_id=$section_id AND k1.subject_id=$subject_id AND k1.level=4
					AND k1.id NOT IN ( SELECT knowledge_id FROM $tableName2) 
				LIMIT $offset , $step;
SQL;
//			echo $dataSQL;
//			exit;
			$this->db->sql = $dataSQL;
			$this->db->Query();
			$this->b['data'] = $this->db->rs;
			
			$countSQL = <<<SQL
				SELECT COUNT(*) AS count FROM $tableName 
				WHERE section_id=$section_id AND subject_id=$subject_id AND level=4
					AND id NOT IN ( SELECT knowledge_id FROM edu_chapter2knowledge )
SQL;
			
			$this->db->sql = $countSQL;
			$this->db->Queryone();
			$this->b['count'] = $this->db->rs['count'];
			
			$this->b['sc'] = 200;
			
		}
		
		private function get_treedata($subject_id , $section_id , $book_id){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
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
			
			$tableChapter = $subject[$subject_id].'_edu_chapter';
			
			$tableName1 = $subject[$subject_id].'_edu_knowledge';
			$tableName2 = $subject[$subject_id].'_edu_unit';
			$tableName3 = $subject[$subject_id].'_edu_book';
			$tableName4 = $subject[$subject_id].'_edu_chapter2knowledge';
			
			$queryUnitSQL = <<<SQL
			
				SELECT 
					$tableName2.unit as unit_name , $tableName2.unit as text , $tableName2.id as unit_id , $tableName2.id as id
				FROM 
					$tableName2 
				LEFT JOIN $tableName3 ON $tableName2.book_id=$tableName3.id 
				LEFT JOIN edu_grade ON $tableName3.grade_id=edu_grade.id
				WHERE $tableName3.subject_id=$subject_id AND edu_grade.section_id=$section_id 
SQL;
	
			if($book_id){
				$queryUnitSQL .= ' AND '.$tableName3.'.id='.$book_id;
			}
			$queryUnitSQL .= ' ORDER BY unit_index ASC';

			$this->db->sql = $queryUnitSQL;
			$this->db->Query();
			$unitsData = $this->db->rs;
			
			$queryChapterSQL = <<<SQL
				SELECT $tableChapter.id as chapter_id , $tableChapter.id as id , chapter_name , chapter_name as text , chapter_index , unit_id FROM 
				       $tableChapter        
				LEFT JOIN $tableName3 ON $tableChapter.book_id=$tableName3.id 
				LEFT JOIN edu_grade ON $tableName3.grade_id=edu_grade.id 
				WHERE $tableName3.subject_id=$subject_id AND edu_grade.section_id=$section_id
				
SQL;
			if($book_id){
				$queryChapterSQL .= ' AND '.$tableName3.'.id='.$book_id;
			}
			$queryChapterSQL .= ' ORDER BY chapter_index ASC ';
//			echo $queryChapterSQL;
//			return;
			$this->db->sql = $queryChapterSQL;
			$this->db->Query();
			$chapterData = $this->db->rs;
			
			$queryKnowledgeSQL = <<<SQL

				SELECT 
				       t1.id , t1.id as knowledge_id , t1.name as text , t1.name as knowledge_name , 
				       $tableName4.chapter_id , $tableName4.type 
				FROM 
				     $tableName1 t1      
				LEFT JOIN $tableName4 ON t1.id=$tableName4.knowledge_id 
				LEFT JOIN $tableChapter ON $tableName4.chapter_id=$tableChapter.id 
				WHERE t1.subject_id=$subject_id AND t1.section_id=$section_id AND $tableChapter.book_id=$book_id

SQL;
    //echo  $queryKnowledgeSQL;
	//return;
			$this->db->sql = $queryKnowledgeSQL;
			$this->db->Query();
			$knowledgeData = $this->db->rs;
			
			$this->b['unit'] = $unitsData;
			$this->b['chapter'] = $chapterData;
			$this->b['knowledge'] = $knowledgeData;
			
			$this->b['sc'] = 200;
			
			
		}
		
		
		private function post_modify_relation($knowledge_id , $question_ids){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$questionArray = explode('_' , $question_ids);
			$insertArray = array();
			
			$question_ids = implode(',',$questionArray);
			
			$sql = <<<SQL
				UPDATE exam_question_to_knowledge SET knowledge_id=$knowledge_id WHERE id in ($question_ids);
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
		
		private function post_delete_question($question_ids){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$deleteWhere = 'question_id in ("'.implode('","', explode('_',$question_ids)).'")';
			$this->b['flag'] = $this->db->delete('exam_question_to_knowledge' , $deleteWhere);
			$this->b['sc'] = 200;
			
			
			
		}
		
		private function post_create_knowledge_relation($knowledge_ids , $chapter_id , $type , $subject_id){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
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
			
			$tableName1 = $subject[$subject_id].'_edu_chapter2knowledge';
			$tableName2 = $subject[$subject_id].'_edu_knowledge';
			
			//chapter
			$insertArray = array();
			$knowledgeArray = explode('_' , $knowledge_ids);
			
			$typeArray = array('chapter'=>0,'unit'=>1);
			
			foreach($knowledgeArray as $v){
				$insertArray[] = array('chapter_id'=>$chapter_id , 'knowledge_id'=>$v , 'type'=>$typeArray[$type]);	
			}
	
			$this->b['arr']=$insertArray;
			
			$this->b['flag'] = $this->db->Inserts($tableName1 , $insertArray);

			$this->b['sc'] = 200;
			
		}
		
		private function post_delete_knowledge_relation($knowledge_id , $subject_id){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
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
			
			$tableName = $subject[$subject_id].'_edu_chapter2knowledge';
			
			$deleteWhere = 'knowledge_id='.$knowledge_id;
			
			$this->b['flag'] = $this->db->delete($tableName , $deleteWhere);
			$this->b['sc'] = 200;
			
		}
		
	}