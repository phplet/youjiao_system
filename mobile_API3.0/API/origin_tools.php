<?php
///////////////////////////////////////////////////////
// 省查询接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	
	class crest extends REST{
		
		public function doGET(){
			$action = $this->r('action');
			switch($action){
				case 'init':
//					$this->get_publisher_list();
					$this->get_grade_list();
					$this->get_province_list();
					$this->get_subject_list();
					$this->get_year_list();
					$this->get_all_book_list();
					$this->get_question_type_list();
					
					break;
					
				case 'examdata':

					$year = $this->r('year');
					$province = $this->r('province');
					$subject = $this->r('subject');
					$section = $this->r('section');
					$this->get_exam_data_list($year , $section , $subject , $province);
					break;

				case 'unitdata':
					
					$subject = $this->r('subject');
					$grade = $this->r('grade');
					$publisher = $this->r('publisher');
					$book = $this->r('book');
					
					$this->get_unit_list($subject , $grade , $publisher , $book);
					
					break;
					
				case 'chapterdata':
					
					$subject = $this->r('subject');
					$grade = $this->r('grade');
					$publisher = $this->r('publisher');
					$unit = $this->r('unit');
					$book = $this->r('book');
					
					$this->get_chapter_list($subject , $grade , $publisher , $book , $unit );
					
					break;
					
				case 'bookdata':
					
					$subject = $this->r('subject');
					$grade = $this->r('grade');
					$publisher = $this->r('publisher');
					
					$this->get_book_list($subject , $grade , $publisher);
					
					break;
					
				case 'book_data':
					
					$subject = $this->r('subject');
					$section = $this->r('section');
					
					$this->get_book_list2($subject , $section);
					
					break;
					
				case 'publisherdata':
					
					$subject_id = intval($this->r('subject'));
					$grade_id = intval($this->r('grade'));
					
					$this->get_publisher_list($subject_id , $grade_id);
					
					break;
					
			}
		}
		
		
		public function doPOST(){
			$action = $this->r('action');
			
			switch($action){
				case 'create':
					
					$knowledge_id = $this->r('knowledge');
					$question_ids = $this->r('question');
					$subject_id = $this->r('subject');
					
					$this->post_create_relation($knowledge_id , $question_ids , $subject_id);
					
					break;
					
				case 'modify':
					
					$updateInfo = $this->r('info');
					
					$this->post_modify_question($updateInfo);
					
					break;
					
				case 'quick_modify':
					
					$updateInfo = $this->r('info');
					
					$this->post_quick_modify_question($updateInfo);
					
					break;
					
				case 'disable':
					$question_ids = $this->r('question');
					$subject_id = $this->r('subject');
					
					$this->post_delete_question($subject_id , $question_ids);
					
					
					break;
			}
			
		}
		
		private function get_publisher_list($subject_id , $grade_id ){
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
			
			$tableBook = $subject[$subject_id].'_edu_book';
			
//			$sql = 'SELECT id,Name,notes FROM edu_publisher';
			$sql = <<<SQL

				SELECT edu_publisher.id , name 
				FROM edu_publisher
				LEFT JOIN $tableBook ON edu_publisher.id=$tableBook.publisher_id 
				WHERE $tableBook.subject_id=$subject_id AND $tableBook.grade_id=$grade_id
				GROUP BY edu_publisher.id
			
SQL;
// 			echo $sql;
// 			exit;
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['publisher'] = $this->db->rs;
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
// 			print_r($this->b['year']);
			
			foreach($this->b['year'] as $k => $v){
				$this->b['year'][$k]['id'] = $k;
			}
			$this->b['sc'] = 200;
			
		}
		
		private function get_question_type_list(){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$this->db->sql = 'SELECT * FROM edu_question_type';
			$this->db->Query();
			$this->b['question_type'] = $this->db->rs;
			$this->b['sc'] = 200;
			
		}
		
		private function get_subject_list(){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$this->db->sql = 'SELECT * FROM edu_subject';
			$this->db->Query();
			$this->b['subject'] = $this->db->rs;
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
			
			$where = 'exam_examination.exam_type=1 AND year="'.$year.'" AND edu_grade.section_id='.$section.' AND subject_id='.$subject.' AND province_id='.$province;
			$tblCondition['where'] = $where;
			
			$this->b = $this->db->withQueryMakerLeft($tblExam , $tblGrade , $tblCondition);
// 			echo $this->db->sql;
			$this->b['sc'] = 200;
			
		}
		
		private function get_unit_list($subject_id , $grade , $publisher , $book){
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
			
			$tableUnit = $subject[$subject_id] . '_edu_unit';
			$tableChapter = $subject[$subject_id] . '_edu_chapter';
			
			$sql = <<<SQL

			SELECT DISTINCT $tableUnit.id , unit as unit_name FROM $tableChapter 
            LEFT JOIN $tableUnit ON $tableChapter.unit_id=$tableUnit.id 
            WHERE $tableChapter.book_id=$book ORDER BY unit_index ASC
SQL;
// 			echo $sql;
			$this->db->sql = $sql;
			$this->db->Query();
			
			$this->b = $this->db->rs;
			
//			foreach($this->b as $k => $v){
//				$this->b[$k]['id'] = $k;
//			}
			
			$this->b['sc'] = 200;
			
		}

		private function get_chapter_list($subject_id , $grade , $publisher , $book , $unit){
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
			
			$tableChapter = $subject[$subject_id] . '_edu_chapter';
			
			$sql = <<<SQL
			
			SELECT id , chapter_name AS chapter FROM $tableChapter WHERE $tableChapter.book_id=$book AND unit_id=$unit ORDER BY chapter_index ASC;
SQL;
//			echo $sql;
//			exit;
			$this->db->sql = $sql;
			$this->db->Query();
			
			$this->b = $this->db->rs;
			
			$this->b['sc'] = 200;
			
		}
		
		
		private function get_all_book_list(){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
//			$sql = 'SELECT edu_book.* , section_id FROM edu_book JOIN edu_grade ON edu_book.grade_id=edu_grade.id ORDER BY edu_book.grade_id ASC';
			$sql = 'SELECT edu_book.* , edu_publisher.name as publisher_name FROM edu_book  LEFT JOIN edu_publisher ON edu_book.publisher_id=edu_publisher.id ORDER BY edu_book.grade_id ASC';
			
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['book'] = $this->db->rs;
			$this->b['sc'] = 200;
			
		}
		
	
		private function get_book_list($subject_id , $grade_id , $publisher_id){
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
			
			$tblBook = array(
				$subject[$subject_id].'_edu_book',
				'book_name' , 'id' , 'publisher_id' , 'subject_id' , 'grade_id' 
			);
			
			$tblPublisher = array(
				'edu_publisher',
				'name as publisher_name'
			);
			
			$tblCondition = array(
				$tblBook[0].'.publisher_id=edu_publisher.id',
				'where'=>$tblBook[0].'.publisher_id='.$publisher_id.' AND '.$tblBook[0].'.grade_id='.$grade_id.' AND '.$tblBook[0].'.subject_id='.$subject_id
			);
			
			$this->b = $this->db->withQueryMakerLeft($tblBook , $tblPublisher , $tblCondition);
//			echo $this->db->sql;
			$this->b['sc'] = 200;
			
		}
		
		
		private function get_book_list2($subject_id , $section_id){
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
			
			$this->db->sql = 'SELECT t1.id , concat(t2.name , "------" ,t1.book_name) as book_name FROM '.$subject[$subject_id].'_edu_book t1 LEFT JOIN edu_publisher t2 ON t1.publisher_id=t2.id  WHERE section_id='.$section_id;
			
			$this->db->Query();
			
			$this->b['book'] = $this->db->rs;
			$this->b['sc'] = 200;
			
		}
		
		
		private function post_create_relation($knowledge_id , $question_ids , $subject_id){
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
			
			$questionArray = explode('_' , $question_ids);
			$insertArray = array();
			
			foreach($questionArray as $v){
				$insertArray[] = array('knowledge_id'=>$knowledge_id , 'question_id'=>$v);
			}
			
			$flag = $this->db->Inserts($subject[$subject_id].'_exam_question_to_knowledge' , $insertArray);
//			echo $this->db->sql;
//			return;
			if($flag){
				$tableName = $subject[$subject_id].'_exam_question_index';
				$questionIDStr = implode('","' , $questionArray);
				$sql = <<<SQL
					UPDATE $tableName SET match_flag=1 WHERE gid IN ("$questionIDStr");
				
SQL;

				$this->db->sql = $sql;
//				echo $sql;
				$flag2 = $this->db->ExecuteSql();
				
				if($flag2){
					$this->b['flag'] = true;
				}else{
					$this->b['flag'] = false;
					$this->b['reason'] = 'update match_flag failed';
				}
				
				
			}else{
				$this->b['flag'] = false;
				$this->b['reason'] = 'create relation failed';
			}
			
			$this->b['flag'] = $flag;
			$this->b['sc'] = 200;
			
		}
		
		private function post_modify_question($info){
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
			
			$tableName1 = $subject[$info['subject_id']].'_exam_question';
			$tableName2 = $subject[$info['subject_id']].'_exam_question_index';
			
			extract($info , EXTR_OVERWRITE );
			
			$sql = <<<SQL
				UPDATE 
					$tableName1,$tableName2 
				SET 
					content='$question' , answer='$answer' , question_type='$question_type' , difficulty=$difficulty , score=$score , 
					zh_knowledge='$knowledge' , objective_flag=$objective , group_count=$group_count , option_count=$option_count , objective_answer='$objective_answer' , modify_flag=1
				WHERE $tableName1.gid=$tableName2.gid AND $tableName1.gid='$gid' AND $tableName2.source='$source';
SQL;
//			echo $sql;
			$this->db->sql = $sql;
			$this->b['flag'] = $this->db->ExecuteSql();
			$this->b['sc'] = 200;
		
		}
		
		private function post_quick_modify_question($info){
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
			
			$tableName1 = $subject[$info['subject_id']].'_exam_question';
			$tableName2 = $subject[$info['subject_id']].'_exam_question_index';
			
//			print_r($info);
			
//			extract($info , EXTR_OVERWRITE );

			$sql = <<<SQL

				INSERT INTO $tableName2 
				(gid,question_type,difficulty,score,zh_knowledge,objective_flag,modify_flag) VALUES 
				
SQL;

//			echo $sql;
//			exit;
			foreach($info['data'] as $ele){
//			print_r($ele);
				$sql .= '("'.$ele['gid'].'","'.$ele['question_type'].'",'.$ele['difficulty'].','.$ele['score'].',"'.$ele['zh_knowledge'].'","'.$ele['objective_flag'].'", 1),';
//				echo $sql;
			}
//			exit;
			$sql = substr($sql , 0 , strlen($sql)-1);
//echo $sql;
//exit;
			
			$sql .= ' ON DUPLICATE KEY UPDATE question_type=VALUES(question_type) , difficulty=VALUES(difficulty) ,  score=VALUES(score) ,  zh_knowledge=VALUES(zh_knowledge) ,  objective_flag=VALUES(objective_flag)';
//			echo $sql;
//			exit;
//			echo $sql;
//			exit;
			$this->db->sql = $sql;
//			echo $this->db->sql;
//			exit;
			$this->b['flag'] = $this->db->ExecuteSql();
			$this->b['sc'] = 200;
		
		}
		
		private function post_delete_question($subject_id , $question_ids){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$question_ids = '"'.implode('","' , explode('_' , $question_ids)).'"';
			
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
			
			$tableName = $subject[$subject_id].'_exam_question_index';
			
			$sql = <<<SQL
				UPDATE	$tableName SET disable_flag=1 WHERE gid IN ($question_ids);
SQL;
//echo $sql;
			$this->db->sql = $sql ;
			$this->b['flag'] = $this->db->ExecuteSql();
			$this->b['sc'] = 200;
			
		}
		
	}