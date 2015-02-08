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
					
				case 'publisherdata':
					
					$subject_id = intval($this->r('subject'));
					$grade_id = intval($this->r('grade'));
					
					$this->get_publisher_list($subject_id , $grade_id);
					
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
					$level = $this->r('level');
					$parent_id = $this->r('parent');
					
					$this->get_knowledgedata($subject_id , $section_id , $level , $parent_id);
					
					break;
					
			}
		}
		
		
		public function doPOST(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			
			switch($action){
				case 'create':
					
					$chapter_id = $this->r('chapter');
					$question_ids = $this->r('question');
					$subject_id = $this->r('subject');
					
					$this->post_create_relation($chapter_id , $question_ids , $subject_id);
					
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
					
				case 'disable_relation':

					$subject_id = $this->r('subject');
					$chapter_id = $this->r('chapter');
					$question_ids = $this->r('question');
					
					$this->post_delete_relation($chapter_id , $question_ids , $subject_id);
					
					
					break;
					
				case 'modify_tree':
					
					$subject_id = $this->r('subject');
					$section_id = $this->r('section');
					$book_id = $this->r('book');
					$book_code = $this->r('book_code');
					$pub_id = $this->r('pub');
					$grade_id = $this->r('grade');
					$modifys = $this->r('modify');
					$news = $this->r('news');
					$removes = $this->r('remove');
					$hides = $this->r('hide');
					
					$this->post_modify_trees($subject_id , $modifys );
					$this->post_add_trees($subject_id , $section_id , $book_id , $book_code , $pub_id ,  $grade_id , $news);
 					$this->post_delete_trees($subject_id , $removes);
 					$this->post_hide_trees($subject_id , $hides);
 					
 					$this->b['flag'] = $this->b['modify_unit'] && $this->b['modify_chapter'] 
 													&& $this->b['add_unit'] && $this->b['add_chapter'] 
 													&& $this->b['delete_unit'] && $this->b['delete_chapter'] 
 													&& $this->b['hide_unit'] && $this->b['hide_chapter'];
 					
					break;
					
			}
			
		}
		
		private function get_publisher_list($subject_id , $grade_id ){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
//			$sql = 'SELECT id,Name,notes FROM edu_publisher';
			$sql = <<<SQL

				SELECT edu_publisher.id , name 
				FROM edu_publisher
				LEFT JOIN edu_book ON edu_publisher.id=edu_book.publisher_id 
				WHERE edu_book.subject_id=$subject_id AND edu_book.grade_id=$grade_id
				GROUP BY edu_publisher.id
			
SQL;
//			echo $sql;
//			exit;
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
			
			$where = 'exam_examination.exam_type=1 AND year="'.$year.'" AND edu_grade.class_section_id='.$section.' AND subject_id='.$subject.' AND province_id='.$province;
			$tblCondition['where'] = $where;
			
			$this->b = $this->db->withQueryMakerLeft($tblExam , $tblGrade , $tblCondition);
//			echo $this->db->sql;
			$this->b['sc'] = 200;
			
		}
		
		private function get_unit_list($subject , $grade , $publisher , $book){
			
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$sqlOld = <<<SQL

				SELECT 
					DISTINCT edu_chapter.unit 
				FROM 
					edu_chapter 
				LEFT JOIN edu_book ON edu_chapter.bid=edu_book.id 
				WHERE edu_book.grade_id=$grade AND edu_book.publisher_id=$publisher AND edu_book.subject_id=$subject 
				ORDER BY unit ASC
SQL;
			
			$sql = <<<SQL

			SELECT DISTINCT edu_unit.id , unit as unit_name FROM edu_chapter 
            LEFT JOIN edu_unit ON edu_chapter.unit_id=edu_unit.id 
            WHERE edu_chapter.book_id=$book ORDER BY unit ASC
SQL;
//			echo $sql;
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
			
			$chapterTableName = $subject[$subject_id].'_edu_chapter';
			
			$sqlOld = <<<SQL

				SELECT 
					$chapterTableName.id ,  $chapterTableName.chaper as chapter 
				FROM 
					$chapterTableName 
				LEFT JOIN edu_book ON $chapterTableName.bid=edu_book.id 
				WHERE edu_book.grade_id=$grade AND edu_book.publisher_id=$publisher AND edu_book.subject_id=$subject AND $chapterTableName.unit="$unit" 
				ORDER BY chapter ASC
SQL;

			$sql = <<<SQL
			
			SELECT id , chapter_name AS chapter FROM $chapterTableName WHERE $chapterTableName.book_id=$book AND unit_id=$unit;
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
			$tableName5 = $subject[$subject_id].'_edu_chapter2question';
			
			$queryUnitSQL = <<<SQL
			
				SELECT 
					$tableName2.unit as unit_name , $tableName2.grade_id , $tableName2.pub_id , $tableName2.book_code ,  $tableName2.unit as text , $tableName2.id as unit_id , $tableName2.id as id  , $tableName2.unit_index  
				FROM 
					$tableName2 
				LEFT JOIN $tableName3 ON $tableName2.book_id=$tableName3.id 
				LEFT JOIN edu_grade ON $tableName3.grade_id=edu_grade.id
				WHERE $tableName3.subject_id=$subject_id AND edu_grade.section_id=$section_id AND $tableName2.visible=0
SQL;
	
			if($book_id){
				$queryUnitSQL .= ' AND '.$tableName3.'.id='.$book_id;
			}
			$queryUnitSQL .= ' ORDER BY unit_index ASC';

			$this->db->sql = $queryUnitSQL;
			
// 			echo $queryUnitSQL;
			
			$this->db->Query();
			$unitsData = $this->db->rs;
			
			
			$queryChapterSQL = <<<SQL
				SELECT $tableChapter.id as chapter_id , $tableChapter.id as id , chapter_name , CONCAT(chapter_name , '(' , IF(a.count IS NULL , 0 , a.count) , ')') as text , chapter_index , unit_id FROM 
				       $tableChapter        
				LEFT JOIN $tableName3 ON $tableChapter.book_id=$tableName3.id 
				LEFT JOIN edu_grade ON $tableName3.grade_id=edu_grade.id 
				LEFT JOIN (SELECT COUNT(*) AS count , chapter_id FROM $tableName5 GROUP BY chapter_id) a ON $tableChapter.id=a.chapter_id 
				WHERE $tableName3.subject_id=$subject_id AND edu_grade.section_id=$section_id AND $tableChapter.visible=0
				
SQL;
//echo $queryChapterSQL;
			if($book_id){
				$queryChapterSQL .= ' AND '.$tableName3.'.id='.$book_id;
			}
			$queryChapterSQL .= ' ORDER BY chapter_index ASC ';
//			echo $queryChapterSQL;
//			return;
			$this->db->sql = $queryChapterSQL;
			$this->db->Query();
			$chapterData = $this->db->rs;
			
			$this->b['unit'] = $unitsData;
			$this->b['chapter'] = $chapterData;
			
			$this->b['sc'] = 200;
			
			
		}
		
		
	private function get_knowledgedata($subject_id , $section_id , $level , $parent_id){
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
		
		$knowledgeTableName = $subject[$subject_id].'_edu_knowledge';
		$gradeTableName = 'edu_grade';
		
		
		$sql = <<<SQL
		
			SELECT $knowledgeTableName.id , $knowledgeTableName.name FROM $knowledgeTableName 
			JOIN $gradeTableName ON $knowledgeTableName.grade_id=$gradeTableName.id AND $gradeTableName.section_id=$section_id 
			WHERE $knowledgeTableName.level=$level
		
SQL;

		if($parent_id){
			$sql .= 'AND '.$knowledgeTableName.'.parent_id='.$parent_id;
		}
		
// 		echo $sql;
// 		exit;
		
		$this->db->sql = $sql;
		$this->db->Query();
		
		$this->b['knowledge'] = $this->db->rs;
		$this->b['sc'] = 200;
		
	}
		
		private function post_create_relation($chapter_id , $question_ids , $subject_id){
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
				$insertArray[] = array('chapter_id'=>$chapter_id , 'question_id'=>$v);
			}
			
			$flag = $this->db->Inserts($subject[$subject_id].'_edu_chapter2question' , $insertArray);
//			echo $this->db->sql;
//			return;
				
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
		
		private function post_delete_relation($chapter_id , $question_ids , $subject_id){
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
			
			$question_ids = implode('","',explode('_',$question_ids));
			
			$tableName = $subject[$subject_id].'_edu_chapter2question';
			
			$deleteWhere = 'chapter_id='.$chapter_id.' AND question_id IN ("'.$question_ids.'")';
			
			$this->b['flag'] = $this->db->delete($tableName , $deleteWhere);
//			echo $this->db->sql;
//			exit;
			$this->b['sc'] = 200;
			
		}
		
		private function post_modify_trees($subject_id , $modifys){
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
			
			$unitTableName = $subject[$subject_id].'_edu_unit';
			$chapterTableName = $subject[$subject_id].'_edu_chapter';
			
			$updateUnitSQL = 'INSERT INTO '.$unitTableName.' (id , unit , unit_index) VALUES ';
			$updateChapterSQL = 'INSERT INTO '.$chapterTableName .' (id , chapter_name , chapter_index) VALUES ';

			$unitFlag = false;
			$chapterFlag = false;
			foreach($modifys as $v){
				if($v['attributes']['type'] == 'unit'){
					$unitFlag = true;
					$updateUnitSQL .= '('. $v['id'] .',"'. $v['unit_name'] .'",'. $v['unit_index'] .'),';
				}else{
					$chapterFlag = true;
					$updateChapterSQL .= '('. $v['id'] .',"'. $v['chapter_name'] .'",'. $v['chapter_index'] .'),';
				}
			}
			
			if($unitFlag){
				$updateUnitSQL = substr($updateUnitSQL ,  0 , strlen($updateUnitSQL) - 1 );
				$updateUnitSQL .= ' ON DUPLICATE KEY UPDATE unit=VALUES(unit) , unit_index=VALUES(unit_index) ;';
//				echo $updateUnitSQL;
//				exit;
				$this->db->sql = $updateUnitSQL;
				$this->b['modify_unit'] = $this->db->ExecuteSql();
			}else{
				$this->b['modify_unit'] = true;
			}
			
			if($chapterFlag){
				
				$updateChapterSQL = substr($updateChapterSQL ,  0 , strlen($updateChapterSQL) - 1 );
				$updateChapterSQL .= ' ON DUPLICATE KEY UPDATE chapter_name=VALUES(chapter_name) , chapter_index=VALUES(chapter_index) ;';
				
				$this->db->sql = $updateChapterSQL;
				$this->b['modify_chapter'] = $this->db->ExecuteSql();
			}else{
				$this->b['modify_chapter'] = true;
			}
			
			$this->b['sc'] = 200;
			
		}
		
		private function post_add_trees($subject_id , $section_id , $book_id , $book_code , $pub_id  , $grade_id  , $news ){
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
			
			$unitTableName = $subject[$subject_id].'_edu_unit';
			$chapterTableName = $subject[$subject_id].'_edu_chapter';
			
			$addUnitSQL = 'INSERT INTO '.$unitTableName.' ( unit , unit_index , pub_id , book_id , book_code ,subject_id , grade_id , section_id) VALUES ';
			$addChapterSQL = 'INSERT INTO '.$chapterTableName .' (chapter_name , chapter_index , pub_id , book_id , book_code ,  unit_id , subject_id , grade_id , section_id ) VALUES ';

			$unitFlag = false;
			$chapterFlag = false;
			foreach($news as $v){
				if($v['attributes']['type'] == 'unit'){
					$unitFlag = true;
					$addUnitSQL .= '("'. $v['text'] .'",'. $v['unit_index'] .' , "'. $pub_id .'" , '.$book_id.' , "'.$book_code.'" , '.$subject_id.' , "'.$grade_id .'", "'.$section_id.'"),';
				}else{
					$chapterFlag = true;
					$addChapterSQL .= '("'. $v['text'] .'",'. $v['chapter_index'] .' , "'. $pub_id .'" , '.$book_id.' , '.$book_code.' , '.$v['attributes']['unit_id'].' , '.$subject_id.' , "'.$grade_id .'", "'.$section_id.'"),';
				}
			}
			
			if($unitFlag){
				$addUnitSQL = substr($addUnitSQL ,  0 , strlen($addUnitSQL) - 1 );
//				echo $addUnitSQL;
//				exit;
				$this->db->sql = $addUnitSQL;
				$this->b['add_unit'] = $this->db->ExecuteSql();
			}else{
				$this->b['add_unit'] = true;
			}
			
			if($chapterFlag){
				
				$addChapterSQL = substr($addChapterSQL ,  0 , strlen($addChapterSQL) - 1 );
				
				$this->db->sql = $addChapterSQL;
//				echo $addChapterSQL;
//				exit;
				$this->b['add_chapter'] = $this->db->ExecuteSql();
			}else{
				$this->b['add_chapter'] = true;
			}
			
			$this->b['sc'] = 200;
			
		}
		
		private function post_delete_trees($subject_id , $deletes){
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
			
			$unitTableName = $subject[$subject_id].'_edu_unit';
			$chapterTableName = $subject[$subject_id].'_edu_chapter';
			
			$unitArray = $deletes['unit'];
			$chapterArray = $deletes['chapter'];
			
//			foreach($deletes as $v){
//				if($v['type'] == 'unit'){
//					$unitArray[] = $v['id'];
//				}else if($v['type'] == 'chapter'){
//					$chapterArray[] = $v['id'];
//				}
//			}
			
			if(count($unitArray) > 0 ){
				$deleteUnitSQL = 'DELETE FROM '.$unitTableName.' WHERE id IN ('.implode(',' , $unitArray).')';
				$this->db->sql = $deleteUnitSQL;
				$this->b['delete_unit'] = $this->db->ExecuteSql();
			}else{
				$this->b['delete_unit'] = true;
			}
			
			if(count($chapterArray) > 0 ){
				$deleteChapterSQL = 'DELETE FROM '.$chapterTableName.' WHERE id IN ('.implode(',' , $chapterArray).')';
				$this->db->sql = $deleteChapterSQL;
				$this->b['delete_chapter'] = $this->db->ExecuteSql();
			}else{
				$this->b['delete_chapter'] = true;
			}
			
			
			
			
		}
		
		
		
		private function post_hide_trees($subject_id , $hides){
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
			
			$unitTableName = $subject[$subject_id].'_edu_unit';
			$chapterTableName = $subject[$subject_id].'_edu_chapter';
			
			if(count($hides['unit']) > 0){
				
				$sql = 'UPDATE '.$unitTableName.' SET  visible=1 WHERE id IN ('.implode(',',$hides['unit']).')';
				
				$this->db->sql = $sql;
				$this->b['hide_unit'] = $this->db->ExecuteSql();
				
			}else{
				$this->b['hide_unit'] = true;
			}
			
		if(count($hides['chapter']) > 0){
				
				$sql = 'UPDATE '.$chapterTableName.' SET  visible=1 WHERE id IN ('.implode(',',$hides['chapter']).')';
				
				$this->db->sql = $sql;
				$this->b['hide_chapter'] = $this->db->ExecuteSql();
				
			}else{
				$this->b['hide_chapter'] = true;
			}
			
			
		}
		
	
}