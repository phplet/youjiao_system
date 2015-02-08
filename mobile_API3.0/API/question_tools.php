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
					$this->get_grade_list();
					$this->get_question_type_list();
					
					break;
					
				case 'treedata':
					
					$subject_id = $this->r('subject');
					$grade_id = $this->r('grade');
					$type = $this->r('type');
					
					if($type=='zhenti'){
						$this->get_treedata_zhenti($subject_id , $grade_id);
					}else if($type == 'tongbu'){
						$this->get_treedata_tongbu($subject_id , $grade_id);
					}
					break;
					
				case 'knowledgedata':
					
					$subject_id = $this->r('subject');
					$section_id = $this->r('section');
					$step = $this->r('step');
					$offset = (intval($this->r('pageno')) - 1)*$step;
					
					$this->get_knowledge_list($section_id , $subject_id , $offset , $step);
					
					break;
					
				case 'questiondata':
					
					$subject_id = $this->r('subject');
					$node_id = $this->r('node');
					$type = $this->r('type');
					$step = $this->r('step');
					$offset = (intval($this->r('pageno')) - 1)*$step;
					
					if($type == 'zhenti'){
						$this->get_exam_question_list($node_id , $offset , $step);
					}else if($type == 'tongbu'){
						$subject_id = $this->r('subject');
						$this->get_chapter_question_list($subject_id , $node_id , $offset , $step);
						
					}else if($type == 'qita'){
						$run_type = $this->r('run_type');
						
						if($run_type == 'id'){
							
							$run_content = $this->r('run_content');
							
							$this->get_list_by_id($subject_id , $run_content , $offset , $step);
							
						}else if($run_type =='sql'){
							
							$run_content = $_REQUEST['run_content'];
							
							$this->get_list_by_sql($subject_id , $run_content );
							
						}
					}
					
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
//				case 'modify':
//					
//					$knowledge_id = $this->r('knowledge');
//					$question_ids = $this->r('question');
//					
//					$this->post_modify_relation($knowledge_id , $question_ids);
//					
//					break;
					
				case 'disable':
					
					$question_ids = $this->r('question');
					$subject_id = $this->r('subject');
					$this->post_delete_question($subject_id , $question_ids);
					break;
					
				case 'relation':
					
					$knowledge_ids = $this->r('knowledge');
					$chapter_id = $this->r('chapter');
					$type = $this->r('type');
					
					$this->post_create_knowledge_relation($knowledge_ids , $chapter_id , $type);
					break;
					
				case 'disable_relation':
					
					$knowledge_id = $this->r('knowledge');
					
					$this->post_delete_knowledge_relation($knowledge_id);
					
					break;
					
				case 'modify_question':
					
					$updateInfo = $this->r('info');
					
					$this->post_modify_question($updateInfo);
					
					break;
					
					
				case 'quick_modify':
				
						$updateInfo = $this->r('info');
						
						$this->post_quick_modify_question($updateInfo);
						
					break;
			}
			
		}
		
		private function get_publisher_list(){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$sql = 'SELECT id,Name,notes FROM edu_publisher';
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['publisher'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
		private function get_book_list(){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$sql = 'SELECT edu_book.* , section_id FROM edu_book JOIN edu_grade ON edu_book.grade_id=edu_grade.id ORDER BY edu_book.grade_id ASC';
			
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
		
		private function get_unit_list($subject , $grade , $publisher){
			
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
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
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
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
	
		private function get_knowledge_list($section_id , $subject_id , $offset , $step){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$dataSQL = <<<SQL
				SELECT	
					k1.id , k1.name , k2.name as pname2 , k2.id as pid2 , k3.name as pname1 , k3.id as pid1
				FROM 
					edu_knowledge k1
				LEFT JOIN edu_knowledge k2 ON k1.parent_id=k2.id AND k2.subject_id=k1.subject_id 
				LEFT JOIN edu_knowledge k3 ON k2.parent_id=k3.id AND k3.subject_id=k2.subject_id 
				WHERE k1.section_id=$section_id AND k1.subject_id=$subject_id AND k1.level=3
					AND k1.id NOT IN ( SELECT knowledge_id FROM edu_chapter2knowledge)
				LIMIT $offset , $step;
SQL;
//			echo $dataSQL;
			$this->db->sql = $dataSQL;
			$this->db->Query();
			$this->b['data'] = $this->db->rs;
			
			$countSQL = <<<SQL
				SELECT COUNT(*) AS count FROM edu_knowledge 
				WHERE section_id=$section_id AND subject_id=$subject_id AND level=3
					AND id NOT IN ( SELECT knowledge_id FROM edu_chapter2knowledge )
SQL;
			
			$this->db->sql = $countSQL;
			$this->db->Queryone();
			$this->b['count'] = $this->db->rs['count'];
			
			$this->b['sc'] = 200;
			
		}
		
		private function get_treedata_zhenti($subject_id , $grade_id){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$queryYearSQL = <<<SQL
			
				SELECT 
					DISTINCT year , year as text
				FROM 
					exam_examination 				
				WHERE subject_id=$subject_id AND grade_id=$grade_id 
				ORDER BY year ASC;
SQL;
	
			$this->db->sql = $queryYearSQL;
			$this->db->Query();
			$yearData = $this->db->rs;
			
			$queryExamSQL = <<<SQL
				SELECT 
					id , name , name as text , year 
				FROM 
					exam_examination 				
				WHERE subject_id=$subject_id AND grade_id=$grade_id 
				ORDER BY id ASC;
						
SQL;
			
			$this->db->sql = $queryExamSQL;
			$this->db->Query();
			$examData = $this->db->rs;
			
			$this->b['year'] = $yearData;
			$this->b['exam'] = $examData;
			
			$this->b['sc'] = 200;
			
			
		}
		
		private function get_treedata_tongbu($subject_id , $grade_id){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			//教材
			$queryBookSQL = <<<SQL
			
				SELECT * , book_name as text FROM edu_book WHERE subject_id=$subject_id AND grade_id=$grade_id ORDER BY book_name ASC;
SQL;
			
			$this->db->sql = $queryBookSQL;
			$this->db->Query();
			$bookData = $this->db->rs;
			
			$publisherID = array();
			$bookID = array();
			
			foreach($bookData as $v){
				if( ! in_array($v['publisher_id'] , $publisherID) ){
					$publisherID[] = $v['publisher_id'];
				}
				
				if( ! in_array($v['id'] , $bookID) ){
					$bookID[] = $v['id'];
				}
				
			}
			
			//出版社
			$publisherIDStr = implode(',' , $publisherID);
			
			$queryPublisherSQL = <<<SQL
				SELECT * , name as text FROM edu_publisher WHERE id IN ($publisherIDStr) ORDER BY id ASC;
			
SQL;

			$this->db->sql = $queryPublisherSQL;
			$this->db->Query();
			$publisherData = $this->db->rs;
			
			
			//单元
			$bookIDStr = implode(',' , $bookID);
			
			$queryUnitSQL = <<<SQL
				
				SELECT * , unit as text FROM edu_unit WHERE book_id IN ($bookIDStr) ORDER BY unit_index ASC;
SQL;
			
			$this->db->sql = $queryUnitSQL;
			$this->db->Query();
			$unitData = $this->db->rs;
			
			//章节
			
			$queryChapterSQL = <<<SQL

				SELECT id , book_id , unit_id , pub_id , chapter_name , chapter_name as text ,pub_id FROM edu_chapter WHERE book_id IN ($bookIDStr) ORDER BY  unit_id, chapter_index ASC ;
SQL;
			$this->db->sql = $queryChapterSQL;
			$this->db->Query();
			$chapterData = $this->db->rs;
			
			$this->b['publisher'] = $publisherData;
			$this->b['book'] = $bookData;
			$this->b['unit'] = $unitData;
			$this->b['chapter'] = $chapterData;
			
			$this->b['sc'] = 200;
			
		}
		
		private function get_exam_question_list($exam_id , $offset , $step){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$this->db->sql = "select id , content , subject_id from exam_examination  where id='" . $exam_id . "' ";
			$this->db->Queryone ();
			$exam = $this->db->rs;
			
			$c = json_decode ( $exam ["content"], true );
			foreach ( $c ["list"] as $key => $value ) {
				$ti_all .= "'" . $value . "',";
			}
			$ti_all = substr ( $ti_all, 0, - 1 );
			
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
			
			$tblExamQuestion = array(
				$subject[$exam['subject_id']].'_exam_question',
				'id' , 'content' , 'objective_answer' , 'answer' , 'yid'
			);
			
			$tblExamQuestionIndex = array(
				$subject[$exam['subject_id']].'_exam_question_index',
				'knowledge' , 'zh_knowledge' , 'difficulty' , 'score' , 'objective_flag' , 'option_count' , 'group_count' , 'question_type' ,
				'cp_id' , 'chapter_id' , 'update_date' , 'zh_Tid' , 'exam_name' , 'subject_id' , 'ti_order' , 'grade_id' , 'source' , 'state' , 'mod_date'
			);
			
			$tblGrade = array(
				'edu_grade',
				'name as grade_name'
			);
			
			$tblCondition = array(
				$tblExamQuestion[0].'.id='.$tblExamQuestionIndex[0].'.id AND '.$tblExamQuestion[0].'.yid='.$tblExamQuestionIndex[0].'.yid',
				$tblExamQuestionIndex[0].'.grade_id=edu_grade.id'
			);
			
	//		$where = $tblExamQuestionIndex[0].'.subject_id='.$subject_id.' AND edu_grade.class_section_id='.$section_id.
	//			' AND '.$tblExamQuestionIndex[0].'.id in ('.$ti_all.')';
			
					
			$where = $tblExamQuestionIndex[0].'.id in ('.$ti_all.') AND '.$tblExamQuestionIndex[0].'.disable_flag=0';;
			
			$tblCondition['where'] = $where;
			$tblCondition['limit'] = $offset.','.$step;
			
			$this->b['data'] = $this->db->withQueryMakerLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
	//		echo $this->db->sql;
			$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
			$this->b['sc'] = 200;
		}
		
		private function get_chapter_question_list($subject_id , $chapter_id , $offset , $step){
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
			
			$this->db->sql = "select id ,content ,subject_id,source from edu_chapter  where id='" . $chapter_id . "' ";
			$this->db->Queryone ();
			$chapter = $this->db->rs;
			
			$scontent=$chapter["content"];
			$ssource=$chapter["source"];
			$ti_all=implode('","', explode(',' , $scontent));
							
			$tblExamQuestion = array(
				$subject[$subject_id].'_exam_question',
				'id' , 'content' , 'objective_answer' , 'answer' , 'yid'
			);
			
			$tblExamQuestionIndex = array(
				$subject[$subject_id].'_exam_question_index',
				'knowledge' , 'zh_knowledge' , 'difficulty' , 'score' , 'objective_flag' , 'option_count' , 'group_count' , 'question_type' ,
				'cp_id' , 'chapter_id' , 'update_date' , 'zh_Tid' , 'exam_name' , 'subject_id' , 'ti_order' , 'grade_id' , 'source' , 'state' , 'mod_date'
			);
			
			
			$tblCondition = array(
				$tblExamQuestion[0].'.id='.$tblExamQuestionIndex[0].'.id AND '.$tblExamQuestion[0].'.yid='.$tblExamQuestionIndex[0].'.yid',
			);
				
			$where = $tblExamQuestionIndex[0].'.zh_Tid  in ("'.$ti_all.'") AND '.$tblExamQuestionIndex[0].'.source="'.$ssource.'"  AND '.$tblExamQuestionIndex[0].".disable_flag=0";
			
			$tblCondition['where'] = $where;
			$tblCondition['limit'] = $offset.','.$step;
			
			$this->b['data'] = $this->db->withQueryMakerLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
//			echo $this->db->sql;
			$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
			$this->b['sc'] = 200;
			
		}
		
	private function get_list_by_id($subject_id , $ids , $offset , $step){
		$this->switchDB('192.168.1.41','hx_curriculumn_0911');
		
		$id_all = implode('","',explode(',' , $ids));
		
		
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
		
		$tblExamQuestion = array(
			$subject[$subject_id].'_exam_question',
			'id' , 'content' , 'objective_answer' , 'answer' , 'yid'
		);
		
		$tblExamQuestionIndex = array(
			$subject[$subject_id].'_exam_question_index',
			'knowledge' , 'zh_knowledge' , 'difficulty' , 'score' , 'objective_flag' , 'option_count' , 'group_count' , 'question_type' ,
			'cp_id' , 'chapter_id' , 'update_date' , 'zh_Tid' , 'exam_name' , 'subject_id' , 'ti_order' , 'grade_id' , 'source' , 'state' , 'mod_date'
		);
		
		$tblGrade = array(
			'edu_grade',
			'name as grade_name'
		);
		
		$tblCondition = array(
			$tblExamQuestion[0].'.id='.$tblExamQuestionIndex[0].'.id AND '.$tblExamQuestion[0].'.yid='.$tblExamQuestionIndex[0].'.yid',
			$tblExamQuestionIndex[0].'.grade_id=edu_grade.id'
		);
		
//		$where = $tblExamQuestionIndex[0].'.subject_id='.$subject_id.' AND edu_grade.class_section_id='.$section_id.
//			' AND '.$tblExamQuestionIndex[0].'.id in ('.$ti_all.')';
		
				
		$where = $tblExamQuestionIndex[0].'.id in ("'.$id_all.'") AND '.$tblExamQuestionIndex[0].'.disable_flag=0';;
		
		$tblCondition['where'] = $where;
		$tblCondition['limit'] = $offset.','.$step;
		
		$this->b['data'] = $this->db->withQueryMakerLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
//		echo $this->db->sql;
		$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
		$this->b['sc'] = 200;
		
		
	}
	
	private function get_list_by_sql($subject_id , $sql){
		
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
		
		$this->db->sql = $sql;
		$this->db->Query();
		
		$idStr = '';
		
		foreach($this->db->rs as $v){
			$idStr .= '"'.$v['id'].'",';
		}
		
		$idStr = substr($idStr , 0 ,strlen($idStr) - 1);
		
		$tblExamQuestion = array(
			$subject[$subject_id].'_exam_question',
			'id' , 'content' , 'objective_answer' , 'answer' , 'yid'
		);
		
		$tblExamQuestionIndex = array(
			$subject[$subject_id].'_exam_question_index',
			'knowledge' , 'zh_knowledge' , 'difficulty' , 'score' , 'objective_flag' , 'option_count' , 'group_count' , 'question_type' ,
			'cp_id' , 'chapter_id' , 'update_date' , 'zh_Tid' , 'exam_name' , 'subject_id' , 'ti_order' , 'grade_id' , 'source' , 'state' , 'mod_date'
		);
		
		$tblGrade = array(
			'edu_grade',
			'name as grade_name'
		);
		
		$tblCondition = array(
			$tblExamQuestion[0].'.id='.$tblExamQuestionIndex[0].'.id AND '.$tblExamQuestion[0].'.yid='.$tblExamQuestionIndex[0].'.yid',
			$tblExamQuestionIndex[0].'.grade_id=edu_grade.id'
		);
		
//		$where = $tblExamQuestionIndex[0].'.subject_id='.$subject_id.' AND edu_grade.class_section_id='.$section_id.
//			' AND '.$tblExamQuestionIndex[0].'.id in ('.$ti_all.')';
		
				
		$where = $tblExamQuestionIndex[0].'.id in ('.$idStr.') AND '.$tblExamQuestionIndex[0].'.disable_flag=0';;
		
		$tblCondition['where'] = $where;
//		$tblCondition['limit'] = $offset.','.$step;
		
		$this->b['data'] = $this->db->withQueryMakerLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
//		echo $this->db->sql;
		$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
		$this->b['sc'] = 200;
		
	}
		
		
//		private function post_modify_relation($knowledge_id , $question_ids){
//			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
//			
//			$questionArray = explode('_' , $question_ids);
//			$insertArray = array();
//			
//			$question_ids = implode(',',$questionArray);
//			
//			$sql = <<<SQL
//				UPDATE exam_question_to_knowledge SET knowledge_id=$knowledge_id WHERE id in ($question_ids);
//SQL;
//			
////			foreach($questionArray as $v){
////				$insertArray[] = array('knowledge_id'=>$knowledge_id , 'question_id'=>$v);
////			}
//			
////			$flag = $this->db->Inserts('exam_question_to_knowledge' , $insertArray);
//			$this->db->sql = $sql;
//			
//			$flag = $this->db->ExecuteSql();
//			
//			$this->b['flag'] = $flag;
//			$this->b['sc'] = 200;
//			
//		}
		
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
				UPDATE	$tableName SET disable_flag=1 WHERE id IN ($question_ids);
SQL;
//echo $sql;
			$this->db->sql = $sql ;
			$this->b['flag'] = $this->db->ExecuteSql();
			$this->b['sc'] = 200;
			
		}
		
		
		private function post_create_knowledge_relation($knowledge_ids , $chapter_id , $type){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$insertArray = array();
			
			$knowledgeArray = explode('_' , $knowledge_ids);
			
			$typeArray = array('chapter'=>0,'unit'=>1);
			
			foreach($knowledgeArray as $v){
				$insertArray[] = array('chapter_id'=>$chapter_id , 'knowledge_id'=>$v , 'type'=>$typeArray[$type]);
			}
//			print_r($insertArray);	
			
			$this->b['flag'] = $this->db->Inserts('edu_chapter2knowledge' , $insertArray);
			$this->b['sc'] = 200;
			
		}
		
		private function post_delete_knowledge_relation($knowledge_id){
			$this->switchDB('192.168.1.41','hx_curriculumn_0911');
			
			$deleteWhere = 'knowledge_id='.$knowledge_id;
			
			$this->b['flag'] = $this->db->delete('edu_chapter2knowledge' , $deleteWhere);
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
			
			$question = str_replace('\'' , '\'\'',$question);
			$answer = str_replace('\'' , '\'\'' , $answer);
			
			$sql = <<<SQL
				UPDATE 
					$tableName1,$tableName2 
				SET 
					content='$question' , answer='$answer' , question_type='$question_type' , difficulty=$difficulty , score=$score , 
					zh_knowledge='$knowledge' , objective_flag=$objective , group_count=$group_count , option_count=$option_count , objective_answer='$objective_answer' , modify_flag=1
				WHERE $tableName1.id=$tableName2.id AND $tableName1.id='$id' AND $tableName2.source='$source' AND $tableName1.source='$source';
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
					(id,yid,question_type,difficulty,score,zh_knowledge,objective_flag,modify_flag) VALUES 
					
SQL;
	
	//			echo $sql;
	//			exit;
				foreach($info['data'] as $ele){
	//			print_r($ele);
					$sql .= '("'.$ele['id'].'","'.$ele['yid'].'","'.$ele['question_type'].'",'.$ele['difficulty'].','.$ele['score'].',"'.$ele['zh_knowledge'].'","'.$ele['objective_flag'].'", 1),';
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
		
	}