<?php
///////////////////////////////////////////////////////
// 试题接口
// by TonyJiang
///////////////////////////////////////////////////////
//rest接口
require_once (dirname ( __FILE__ ) . "/../rest.php");

class crest extends REST {
	//GET逻辑
	public function doGET() {
		//$this -> getDetail();
		if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
		}
		$action = $this->r('action');
		
		switch($action){
			case 'list':
				
				$step = intval($this->r('step'));
				$offset = intval($this->r('pageno')-1)*$step;
				
				$query_type = $this->r('type');
				$subject_id = $this->r('subject');
				$section_id = $this->r('section');
				$book1 = $this->r('book1');
				
				if($query_type == 'zhuanti'){
					
					$knowledge = $this->r('knowledge');
					
					$this->get_list_with_zhuanti($subject_id , $section_id , $book1 , $knowledge , $offset , $step);
					
				}else if($query_type == 'zhenti'){
					
					$year = $this->r('year');
					$province = $this->r('province');
					$exam = $this->r('exam');
					
					$this->get_list_with_zhenti($subject_id , $section_id , $year , $province , $exam , $offset , $step);
					
				}else if($query_type == 'tongbu'){
					
					$grade = $this->r('grade');
					$publisher = $this->r('publisher');
					$unit = $this->r('unit');
					$chapter = $this->r('chapter');
					$book2 = $this->r('book2');
					
					$this->get_list_with_tongbu($subject_id , $grade , $publisher , $book1 , $book2 , $unit , $chapter , $offset , $step);
					
				}else if($query_type == 'chapter'){
					$knowledge_id = $this->r('chapter');
					$section_id = $this->r('section');
					
					$this->get_list_with_chapter($subject_id , $knowledge_id , $section_id , $offset , $step);
					
				}else if($query_type == 'qita'){
					$run_type = $this->r('run_type');
					
					if($run_type == 'id'){
						
						$run_content = $this->r('run_content');
						
						$this->get_list_by_id($subject_id , $run_content , $offset , $step);
						
					}else if($run_type =='sql'){
						
						$run_content = $_REQUEST['run_content'];
						
						$this->get_list_by_sql($subject_id , $run_content );
						
					}
				}else if($query_type == 'knowledge'){
					
					$knowledge_id = $this->r('knowledge4');
					$knowledgeText = $this->r('knowledgeText4');
					if(!$knowledge_id){
						$knowledge_id = $this->r('knowledge3');
						$knowledgeText = $this->r('knowledgeText3');
						if(!$knowledge_id){
							$knowledge_id = $this->r('knowledge2');
							$knowledgeText = $this->r('knowledgeText2');
							if(!$knowledge_id){
								$knowledge_id = $this->r('knowledge1');
								$knowledgeText = $this->r('knowledgeText1');
							}
						}
					}
					
// 					$this->get_list_with_knowledge($subject_id , $knowledge_id , $offset , $step);
					$this->get_list_with_zhuanti($subject_id , $section_id , $book1 , $knowledgeText , $offset , $step);
					
				}
				
				
				break;
		}
		
	}
	
	//POST逻辑
	public function doPOST() {
		$this->b ["sc"] = 405;
	}
	
	//PUT逻辑
	public function doPUT() {
		switch ($this->urlarr [3]) {
			case "feedback" :
				$this->feedback ();
				break;
			default :
				$this->b ["sc"] = 405;
				break;
		}
	}
	
	//DELETE逻辑
	public function doDELETE() {
		$this->b ["sc"] = 405;
	}
	
	
	private function get_list_with_zhuanti($subject_id , $section_id , $book_id , $knowledge , $offset , $step){
		
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
		
		$tblExamQuestion = array(
			$subject[$subject_id].'_exam_question',
			'content' , 'objective_answer' , 'answer' , 'yid'
		);
		
		$tblExamQuestionIndex = array(
			$subject[$subject_id].'_exam_question_index',
			'gid' , 'knowledge' , 'zh_knowledge' , 'difficulty' , 'score' , 'objective_flag' , 'option_count' , 'group_count' , 'question_type' ,
			'cp_id' , 'chapter_id' , 'update_date' , 'zh_Tid' , 'exam_name' , 'subject_id' , 'ti_order' , 'grade_id' , 'source' , 'state' , 'mod_date'
		);
		
		$tblGrade = array(
			'edu_grade',
			'name as grade_name'
		);
		
		$tblCondition = array(
			$tblExamQuestion[0].'.gid='.$tblExamQuestionIndex[0].'.gid',
			$tblExamQuestionIndex[0].'.grade_id=edu_grade.id'
		);
		
		$where = $tblExamQuestionIndex[0].'.subject_id='.$subject_id.' AND edu_grade.section_id='.$section_id.
		' AND '.$tblExamQuestionIndex[0].'.gid NOT IN (SELECT question_id FROM '.$subject[$subject_id].'_edu_chapter2question JOIN '.$subject[$subject_id].'_edu_chapter ON '.$subject[$subject_id].'_edu_chapter2question.chapter_id='.$subject[$subject_id].'_edu_chapter.id and '.$subject[$subject_id].'_edu_chapter.book_id='.$book_id.') '.
		' AND '.$tblExamQuestionIndex[0].'.disable_flag=0';
		
		if($knowledge){
			$where .= ' AND zh_knowledge like "%'.$knowledge.'%"';
		}
		
		
		$tblCondition['where'] = $where;
		$tblCondition['limit'] = $offset.','.$step;
		
		$this->b['data'] = $this->db->withQueryMakerLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
// 		echo $this->db->sql;
// 		exit;
		$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
		$this->b['sc'] = 200;
		
	}
	
	private function get_list_with_zhenti($subject_id , $section_id , $year , $province , $exam , $offset , $step){
		
		$this->switchDB('192.168.1.41','hx_curriculumn_0911');
		
		$this->db->sql = "select id,content from exam_examination  where id='" . $exam . "' ";
		$this->db->Query ();
		$exam = $this->db->rs;
		
		foreach ( $exam as $examitem ) {
			$c = json_decode ( $examitem ["content"], true );
			foreach ( $c ["list"] as $key => $value ) {
				$ti_all .= "'" . $value . "',";
			}
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
			$subject[$subject_id].'_exam_question',
			'content' , 'objective_answer' , 'answer' , 'yid'
		);
		
		$tblExamQuestionIndex = array(
			$subject[$subject_id].'_exam_question_index',
			'gid' , 'knowledge' , 'zh_knowledge' , 'difficulty' , 'score' , 'objective_flag' , 'option_count' , 'group_count' , 'question_type' ,
			'cp_id' , 'chapter_id' , 'update_date' , 'zh_Tid' , 'exam_name' , 'subject_id' , 'ti_order' , 'grade_id' , 'source' , 'state' , 'mod_date'
		);
		
		$tblGrade = array(
			'edu_grade',
			'name as grade_name'
		);
		
		$tblCondition = array(
			$tblExamQuestion[0].'.gid='.$tblExamQuestionIndex[0].'.gid',
			$tblExamQuestionIndex[0].'.grade_id=edu_grade.id'
		);
		
//		$where = $tblExamQuestionIndex[0].'.subject_id='.$subject_id.' AND edu_grade.class_section_id='.$section_id.
//			' AND '.$tblExamQuestionIndex[0].'.id in ('.$ti_all.')';
		
				
		$where = $tblExamQuestionIndex[0].'.gid in ('.$ti_all.') AND '.$tblExamQuestionIndex[0].'.disable_flag=0';;
		
		$tblCondition['where'] = $where;
		$tblCondition['limit'] = $offset.','.$step;
		
		$this->b['data'] = $this->db->withQueryMakerLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
// 		echo $this->db->sql;
// 		exit;
		$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
		$this->b['sc'] = 200;
		
		
	}

	private function get_list_with_tongbu($subject_id , $grade , $publisher , $book1 , $book2 , $unit , $chapter , $offset , $step){
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
		
		$tableChapter = $subject[$subject_id] .'_edu_chapter';
		
		$sql = <<<SQL
		
		SELECT content , source FROM $tableChapter WHERE id=$chapter;
SQL;

		
		$this->db->sql = $sql;
		$this->db->Queryone();
		$chapter_info = $this->db->rs;
		
		
		
		$tblExamQuestion = array(
			$subject[$subject_id].'_exam_question',
			'content' , 'objective_answer' , 'answer' , 'yid'
		);
		
		$tblExamQuestionIndex = array(
			$subject[$subject_id].'_exam_question_index',
			'gid' , 'knowledge' , 'zh_knowledge' , 'difficulty' , 'score' , 'objective_flag' , 'option_count' , 'group_count' , 'question_type' ,
			'cp_id' , 'chapter_id' , 'update_date' , 'zh_Tid' , 'exam_name' , 'subject_id' , 'ti_order' , 'grade_id' , 'source' , 'state' , 'mod_date'
		);
		
		$tblGrade = array(
			'edu_grade',
			'name as grade_name'
		);

		$tblChapter = array(
			$tableChapter
		);
		
		
		$tblCondition = array(
			$tblExamQuestion[0].'.gid='.$tblExamQuestionIndex[0].'.gid',
			$tblExamQuestionIndex[0].'.grade_id=edu_grade.id',
			$tblExamQuestionIndex[0].'.chapter_id='.$tableChapter.'.id'
		);
		
//		$where = $tblExamQuestionIndex[0].'.subject_id='.$subject_id.' AND edu_grade.class_section_id='.$section_id.
//			' AND '.$tblExamQuestionIndex[0].'.id in ('.$ti_all.')';
		
				
		$where = $tblExamQuestionIndex[0].'.zh_Tid IN ('.$chapter_info['content'].')'.
		' AND '.$tblExamQuestionIndex[0].'.source="'.$chapter_info['source'].'"'.
		' AND '.$tblExamQuestionIndex[0].'.gid NOT IN (SELECT question_id FROM '.$subject[$subject_id].'_edu_chapter2question JOIN '.$subject[$subject_id].'_edu_chapter ON '.$subject[$subject_id].'_edu_chapter2question.chapter_id='.$subject[$subject_id].'_edu_chapter.id and '.$subject[$subject_id].'_edu_chapter.book_id='.$book1.') '.
		
//		' AND '.$tblExamQuestionIndex[0].'.gid NOT IN (SELECT question_id as id FROM '.$subject[$subject_id].'_edu_chapter2question) '.
		' AND '.$tblExamQuestionIndex[0].'.disable_flag=0';
		
		$tblCondition['where'] = $where;
		$tblCondition['limit'] = $offset.','.$step;
		
		$this->b['data'] = $this-> db -> withQueryMakerLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade ,  $tblChapter , $tblCondition);
// 		echo $this->db->sql;
// 		exit;
		$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblChapter , $tblCondition);
		$this->b['sc'] = 200;
		
		
	}
	
	private function get_list_with_chapter($subject_id , $knowledge_id , $section_id , $offset , $step){
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
		
		$tblChapter2Question = array(
			$subject[$subject_id].'_edu_chapter2question',
			'id as relation_id' , 'question_id as id'  
		);
		
		$tblExamQuestion = array(
			$subject[$subject_id].'_exam_question',
			'content' , 'objective_answer' , 'answer' , 'yid'
		);
		
		$tblExamQuestionIndex = array(
			$subject[$subject_id].'_exam_question_index',
			'gid' , 'knowledge' , 'zh_knowledge' , 'difficulty' , 'score' , 'objective_flag' , 'option_count' , 'group_count' , 'question_type' ,
			'cp_id' , 'chapter_id' , 'update_date' , 'zh_Tid' , 'exam_name' , 'subject_id' , 'ti_order' , 'grade_id' , 'source' , 'state' , 'mod_date'
		);
		
		$tblGrade = array(
			'edu_grade',
			'name as grade_name'
		);
		

		
		$tblCondition = array(
			$tblChapter2Question[0].'.question_id='.$tblExamQuestion[0].'.gid',
			$tblExamQuestion[0].'.gid='.$tblExamQuestionIndex[0].'.gid',
			$tblExamQuestionIndex[0].'.grade_id=edu_grade.id'
		);
		
//		$tblCondition['where'] = 'edu_grade.class_section_id='.$section_id;
		$tblCondition['where'] = $tblExamQuestionIndex[0].'.disable_flag=0';
		
		if($knowledge_id){
			$tblCondition['where'] .= ' AND  '.$tblChapter2Question[0].'.chapter_id='.$knowledge_id;
		}
		
		$tblCondition['limit'] = $offset.','.$step;
		
		$this->b['data'] = $this->db->withQueryMaker($tblChapter2Question , $tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
//		echo $this->db->sql;
//		exit;
		$this->b['count'] = $this->db->withQueryMakerOfNum($tblChapter2Question , $tblExamQuestion , $tblExamQuestionIndex , $tblGrade ,$tblCondition);
		$this->b['sc'] = 200;
		
		
	}
	
	private function get_list_with_knowledge($subject_id , $knowledge_id , $offset , $step){
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
		
		$tblExamQuestion = array(
			$subject[$subject_id].'_exam_question',
			'content' , 'objective_answer' , 'answer' , 'yid'
		);
		
		$tblExamQuestionIndex = array(
			$subject[$subject_id].'_exam_question_index',
			'gid' , 'knowledge' , 'zh_knowledge' , 'difficulty' , 'score' , 'objective_flag' , 'option_count' , 'group_count' , 'question_type' ,
			'cp_id' , 'chapter_id' , 'update_date' , 'zh_Tid' , 'exam_name' , 'subject_id' , 'ti_order' , 'grade_id' , 'source' , 'state' , 'mod_date'
		);
		
		$tblGrade = array(
			'edu_grade',
			'name as grade_name'
		);

		$tblRelation = array(
			$subject[$subject_id].'_exam_question_to_knowledge'
		);
		
		
		$tblCondition = array(
			$tblExamQuestion[0].'.gid='.$tblExamQuestionIndex[0].'.gid',
			$tblExamQuestionIndex[0].'.grade_id=edu_grade.id',
			$tblExamQuestionIndex[0].'.gid='.$tblRelation[0].'.question_id AND '.$tblRelation[0].'.knowledge_id='.$knowledge_id
		);
		
		$tblCondition['where'] = $tblExamQuestionIndex[0].'.gid NOT IN (SELECT question_id FROM ' .$subject[$subject_id].'_edu_chapter2question )  ';
		
		$tblCondition['limit'] = $offset.','.$step;
		
		$this->b['data'] = $this-> db -> withQueryMaker($tblExamQuestion , $tblExamQuestionIndex , $tblGrade ,  $tblRelation , $tblCondition);
// 		echo $this->db->sql;
//print_r($this->b['data']);
// 		exit;
		$this->b['count'] = $this->db->withQueryMakerOfNum($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblRelation , $tblCondition);
//		echo $this->db->sql;
//		exit;
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
			'content' , 'objective_answer' , 'answer' , 'yid'
		);
		
		$tblExamQuestionIndex = array(
			$subject[$subject_id].'_exam_question_index',
			'gid' , 'knowledge' , 'zh_knowledge' , 'difficulty' , 'score' , 'objective_flag' , 'option_count' , 'group_count' , 'question_type' ,
			'cp_id' , 'chapter_id' , 'update_date' , 'zh_Tid' , 'exam_name' , 'subject_id' , 'ti_order' , 'grade_id' , 'source' , 'state' , 'mod_date'
		);
		
		$tblGrade = array(
			'edu_grade',
			'name as grade_name'
		);
		
		$tblCondition = array(
			$tblExamQuestion[0].'.gid='.$tblExamQuestionIndex[0].'.gid',
			$tblExamQuestionIndex[0].'.grade_id=edu_grade.id'
		);
		
//		$where = $tblExamQuestionIndex[0].'.subject_id='.$subject_id.' AND edu_grade.class_section_id='.$section_id.
//			' AND '.$tblExamQuestionIndex[0].'.id in ('.$ti_all.')';
		
				
		$where = $tblExamQuestionIndex[0].'.gid in ("'.$id_all.'") AND '.$tblExamQuestionIndex[0].'.disable_flag=0 AND '.$tblExamQuestionIndex[0].'.match_flag=0';
		
		$tblCondition['where'] = $where;
		$tblCondition['limit'] = $offset.','.$step;
		
		$this->b['data'] = $this->db->withQueryMakerLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
// 		echo $this->db->sql;
// 		exit;
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
		$this->b['sql']= $this->db->sql;
		$this->db->Query();
		$idStr = '';
		
		foreach($this->db->rs as $v){
			$idStr .= '"'.$v['gid'].'",';
		}

		$idStr = substr($idStr , 0 ,strlen($idStr) - 1);
		$this->b['ids']= $idStr;
				
		$tblExamQuestion = array(
			$subject[$subject_id].'_exam_question',
			'content' , 'objective_answer' , 'answer' , 'yid'
		);
		
		$tblExamQuestionIndex = array(
			$subject[$subject_id].'_exam_question_index',
			'gid' , 'knowledge' , 'zh_knowledge' , 'difficulty' , 'score' , 'objective_flag' , 'option_count' , 'group_count' , 'question_type' ,
			'cp_id' , 'chapter_id' , 'update_date' , 'zh_Tid' , 'exam_name' , 'subject_id' , 'ti_order' , 'grade_id' , 'source' , 'state' , 'mod_date'
		);
		
		$tblGrade = array(
			'edu_grade',
			'name as grade_name'
		);
		
		$tblCondition = array(
			$tblExamQuestion[0].'.gid='.$tblExamQuestionIndex[0].'.gid',  
			 $tblExamQuestionIndex[0].'.grade_id=edu_grade.id'
		);
		
//		$where = $tblExamQuestionIndex[0].'.subject_id='.$subject_id.' AND edu_grade.class_section_id='.$section_id.
//			' AND '.$tblExamQuestionIndex[0].'.id in ('.$ti_all.')';
		
				
		$where = $tblExamQuestionIndex[0].'.gid in ('.$idStr.') AND '.$tblExamQuestionIndex[0].'.disable_flag=0 AND '.$tblExamQuestionIndex[0].'.match_flag=0 ';
		
		$tblCondition['where'] = $where;
//		$tblCondition['limit'] = $offset.','.$step;
		
		$this->b['data'] = $this->db->withQueryMakerLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
     	$this->b['sql']= $this->db->sql;
//		exit;
		$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblExamQuestion , $tblExamQuestionIndex , $tblGrade , $tblCondition);
		$this->b['sc'] = 200;
		
	}
	
}

?>