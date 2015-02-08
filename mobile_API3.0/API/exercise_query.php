<?php
///////////////////////////////////////////////////////
// 专题突破接口
// by tonyjiang v1.0 modify by XK
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		public function doGET(){
//			if(!$this->vr['pass']){
//				return $this->b['sc'] = 401;
//			}
			$action = $this->r('action');
			$exerciseHandler = new exercise_handler();
			$studentHandler = new student_handler();
			switch($action){
				case 'init_setting':
					$userId = $this->vr['id'];
					$this->b['init_setting'] = $exerciseHandler->get_init_setting($userId);
				break;
				case  'recover_history':
					$studyExerciseId = $this->r('study_exercise_id');
					$this->b['list'] = $exerciseHandler->get_exercise_info($studyExerciseId);
					//@todo 还原临时保存
					break;
				case 'init':
					$type = $this->r('type');
					if($type == 'zhuanti'){
						$this->get_zhuanti_init();
					}else if($type == 'zhenti'){
						$this->get_zhenti_init();
					}else if($type='mingxiao'){
						$this->get_zhenti_init();
					}
					break;
				
				case 'zhuanti':
					$subject_id = $this->r('subject');
					$section_id = $this->r('section_id');
					$this->get_query_zhuanti($subject_id , $section_id);
					$notesInfo = $studentHandler->get_student_notes_list($userId, $section_id, $subject_id, $examType=='7');
					$this->b['subject_top'] = '';//
					$this->b['notes'] = $notesInfo;
					$this->b['sc'] = 200;
					break;
					
				case 'zhuanti_info':
					$zhuanti_id = $this->r('zhuanti_id');
					$this->get_query_zhuanti_info($zhuanti_id);
					$this->b['sc'] = 200;
					break;
					
				case 'zhuanti_question':
					$zhuanti_id = $this->r('zhuanti_id');
					$subject_id = $this->r('subject_id');
					$question_type = $this->r('type');
					$question_difficulty = $this->r('difficulty');
					$question_count = $this->r('count');
					$this->get_query_zhuanti_question($subject_id , $zhuanti_id , $question_type , $question_difficulty , $question_count);
					$this->b['sc'] = 200;
					break;
					
				case 'zhenti':
					$subject_id = $this->r('subject');
					$type = $this->r('type');
					$year = $this->r('year');
					$province = intval($this->r('provice'));
					$section_id = $this->r('section_id');
					$examType=3;
					$this->get_query_zhenti($subject_id , $section_id , $type , $year , $province,$examType);
					$this->b['sc'] = 200;
					break;
					
				case 'zhenti_question':
					
					$exam_id = $this->r('exam_id');
					$this->get_query_zhenti_question($exam_id);
					
					break;
				case 'mingxiao_question':
					
					$exam_id = $this->r('exam_id');
					$this->get_query_zhenti_question($exam_id);
					
					break;
				case 'mingxiao':
					$subject_id = $this->r('subject');
					$type = $this->r('type');
					$year = $this->r('year');
					$province = intval($this->r('provice'));
					$section_id = $this->r('section_id');
					$examType=4;
					$this->get_query_zhenti($subject_id , $section_id , $type , $year , $province,$examType);
					$this->b['sc'] = 200;
					break;
				case 'publisher':
					$subjectId = $this->r('subject_id');
					$gradeId = $this->r('grade_id');
					$sectionId = $this->r('section_id');
					$publisherId = $this->r('publisher_id');
					$this->get_publisher_list($subjectId,$gradeId,$sectionId,$publisherId);
					break;
				case 'chapter':
					$bookId = $this->r('book_id');
					$subjectId = $this->r('subject_id');
					$this->get_chapter_list($bookId,$subjectId);
					break;
				case 'sync_question':
					$subjectId = $this->r('subject_id');
					$chatperId = $this->r('chapter_id');
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = $this->r('countperpage');
					$this->get_sync_examination_list($subjectId, $pageNo*$countPerPage,$countPerPage, $chatperId);
					break;
				case 'search_data':
					$this->search_data();
					$this->b['sc'] = 200;
					break;
				case 'book_setting':
					$userId = $this->vr['id'];
					$rs = $exerciseHandler->get_book_setting($userId);
					
					$this->b['book_setting'] = $rs;
					break;
				case 'exercise_content':
					$studyExerciseId = $this->r('study_exercise_id');
					$rs = $exerciseHandler->get_study_exercise_content($studyExerciseId);
					$this->b['exercise_content'] = $rs['content'];
					$this->b['exercise_duration'] = $rs['duration'];
					//$this->b["db"]=$this->db;
					break;
				case 'exercise_and_exam_content':
					$studyExerciseId = $this->r('study_exercise_id');
					$fromId = intval($this->r('from_id'));//1 移动 0 pc
					$rs = $exerciseHandler->get_exercise_exam_paper_content($studyExerciseId,$fromId);
					$this->b['list'] = $rs;
					break;
					
				case 'exercise_score':
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = intval($this->r('countperpage'));
					$userId = $this->vr['id'];
					$examType = $this->r('exam_type');
					$exerciseId = $this->r('exercise_id');
					$rs = $studentHandler->get_student_exericse_list($userId, $exerciseId, $examType, $pageNo*$countPerPage, $countPerPage);
					$this->b['list'] = $rs;
					break;
					
					
				case 'exercise_entrance_tests':
					$examType = $this->r('exam_type');
					$centerId = $this->r('center_id');
					$zoneId = $this->r('zone_id');
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = intval($this->r('countperpage'));
					$realname = $this->r('stu_realname');
					$rs = $exerciseHandler->get_exercise_entrance_tests_list($examType, $centerId, $zoneId, $pageNo*$countPerPage, $countPerPage,$realname);
					$this->b['list'] = $rs['list'];
					$this->b['count'] = $rs['count'];
					break;
				case 'exercise_stat_knowledge':
					$subjectId = $this->r('subject_id');
					$sectionId = $this->r('section_id');
					$userId = $this->r('user_id');
					$knowledgeId = $this->r('knowledge_id');
					$rs = $exerciseHandler->get_stat_knowledge($subjectId, $sectionId,$userId,$knowledgeId);
					$this->b= $rs;
					break;
				case 'exercise_stat_zhuanti':
					$subjectId = $this->r('subject_id');
					$sectionId = $this->r('section_id');
					$userId = $this->r('user_id');
					$zhuantiId = $this->r('zhuanti_id');
					$type = $this->r('choose_type');
					$rs = $exerciseHandler->get_stat_zhuanti($subjectId, $sectionId,$userId,$zhuantiId);
//					echo '<pre>';
//					print_r($rs);
//					exit;
					$this->b= $rs;
					break;
				case 'exercise_stat_subject':
					$userId = $this->r('user_id');
					$subjectId = $this->r('subject_id');
					$sectionId = $this->r('section_id');
					$day = $this->r('day_num');
					$rs = $exerciseHandler->get_stat_subject($subjectId, $sectionId, $userId,$day);
					$this->b['list'] = $rs;
					break;
				case 'exercise_detail':
					$studyExerciseId = $this->r('study_exercise_id');
					$rs = $exerciseHandler->get_exercise_detail($studyExerciseId);
					$this->b= $rs;
					break;
				case 'test_report_detail':
					$trId = $this->r('trid');
					$this->b['list'] = $exerciseHandler->get_test_report_detail($trId);
					break;
				case 'exercise_rand_ti':
					$subjectId = $this->r('subject_id');
					$sectionId = $this->r('section_id');
					$knowledgeId = $this->r('knowledge_id');
					$dbtype = $this->r('dbtype');
					$questionCount = $this->r('question_count');
					$this->b['list'] = $exerciseHandler->get_rand_ti($knowledgeId, $subjectId, $dbtype, $sectionId,$questionCount=5);
					break;
				case 'exercise_rand_zhenti':
//					ini_set('display_errors', 'On');
//					error_reporting(E_ALL);
					$subjectId = $this->r('subject_id');
					$sectionId = $this->r('section_id');
					$knowledgeId = $this->r('knowledge_id');
					$dbtype = $this->r('dbtype');
					$questionCount = $this->r('question_count');
					$this->b['list'] = $exerciseHandler->get_rand_zhenti_ti($knowledgeId, $subjectId, $dbtype, $sectionId,$questionCount=5);
					break;
					
				case 'exercise_stat_level':
					$userId = $this->r('user_id');
					$subjectId = $this->r('subject_id');
					$sectionId = $this->r('section_id');
					$examId = $this->r('exam_id');
					$this->b['list'] = $exerciseHandler->get_stat_level($userId, $examId, $subjectId, $sectionId);
					break;
				case 'get_student_study_level':
					$userId = $this->r('user_id');
					$subjectId = $this->r('subject_id');
					$sectionId = $this->r('section_id');
					$examId = $this->r('exam_id');	
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = intval($this->r('countperpage'));
					$this->b['list'] = $exerciseHandler->get_student_study_level($userId, $examId, $subjectId, $sectionId, $pageNo*$countPerPage, $countPerPage);
					break;
					
				case 'exercise_stat_period':
					$userId = $this->r('user_id');
					$subjectId = $this->r('subject_id');
					$classId = $this->r('class_id');
					$beginTime = $this->r('begin_time');
					$endTime = $this->r('end_time');
					$this->b['list'] = $exerciseHandler->get_stat_exercise_period($userId, $classId, $subjectId, $beginTime, $endTime);
					break;
			}
			
		}
		
		public function doPOST(){
			
			
		}
		
		private function get_zhuanti_init(){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$section_id = $this->r('section_id');
			
			$sql = <<<SQL
				SELECT subject_id,edu_grade.name as grade_name , edu_subject.name as subject_name FROM edu_zhuanti 
				JOIN edu_grade ON edu_zhuanti.grade_id=edu_grade.id
                JOIN edu_subject ON edu_zhuanti.subject_id=edu_subject.id 
				WHERE edu_grade.section_id=$section_id
				GROUP BY edu_zhuanti.subject_id
SQL;

			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['subject'] = $this->db->rs;
			$this->b['sc'] = 200;
			
		}
		
		private function get_zhenti_init(){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$section_id = $this->r('section_id');
			
			$sql = <<<SQL
	(SELECT subject_id,edu_grade.name as grade_name , edu_subject.name as subject_name FROM yw_exam_examination 
				JOIN edu_grade ON yw_exam_examination.grade_id=edu_grade.id
                JOIN edu_subject ON yw_exam_examination.subject_id=edu_subject.id 
				WHERE edu_grade.section_id=$section_id) union
 	(SELECT subject_id,edu_grade.name as grade_name , edu_subject.name as subject_name FROM yy_exam_examination 
				JOIN edu_grade ON yy_exam_examination.grade_id=edu_grade.id
                JOIN edu_subject ON yy_exam_examination.subject_id=edu_subject.id 
				WHERE edu_grade.section_id=$section_id) union
   	(SELECT subject_id,edu_grade.name as grade_name , edu_subject.name as subject_name FROM sx_exam_examination 
				JOIN edu_grade ON sx_exam_examination.grade_id=edu_grade.id
                JOIN edu_subject ON sx_exam_examination.subject_id=edu_subject.id 
				WHERE edu_grade.section_id=$section_id) union
    (SELECT subject_id,edu_grade.name as grade_name , edu_subject.name as subject_name FROM wl_exam_examination 
				JOIN edu_grade ON wl_exam_examination.grade_id=edu_grade.id
                JOIN edu_subject ON wl_exam_examination.subject_id=edu_subject.id 
				WHERE edu_grade.section_id=$section_id) union
    (SELECT subject_id,edu_grade.name as grade_name , edu_subject.name as subject_name FROM hx_exam_examination 
				JOIN edu_grade ON hx_exam_examination.grade_id=edu_grade.id
                JOIN edu_subject ON hx_exam_examination.subject_id=edu_subject.id 
				WHERE edu_grade.section_id=$section_id) union
   	(SELECT subject_id,edu_grade.name as grade_name , edu_subject.name as subject_name FROM sw_exam_examination 
				JOIN edu_grade ON sw_exam_examination.grade_id=edu_grade.id
                JOIN edu_subject ON sw_exam_examination.subject_id=edu_subject.id 
				WHERE edu_grade.section_id=$section_id) union
            
     (SELECT subject_id,edu_grade.name as grade_name , edu_subject.name as subject_name FROM dl_exam_examination 
				JOIN edu_grade ON dl_exam_examination.grade_id=edu_grade.id
                JOIN edu_subject ON dl_exam_examination.subject_id=edu_subject.id 
				WHERE edu_grade.section_id=$section_id) union 
     (SELECT subject_id,edu_grade.name as grade_name , edu_subject.name as subject_name FROM ls_exam_examination 
				JOIN edu_grade ON ls_exam_examination.grade_id=edu_grade.id
                JOIN edu_subject ON ls_exam_examination.subject_id=edu_subject.id 
				WHERE edu_grade.section_id=$section_id) union
     (SELECT subject_id,edu_grade.name as grade_name , edu_subject.name as subject_name FROM zz_exam_examination 
				JOIN edu_grade ON zz_exam_examination.grade_id=edu_grade.id
                JOIN edu_subject ON zz_exam_examination.subject_id=edu_subject.id 
				WHERE edu_grade.section_id=$section_id) ;
SQL;

			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['subject'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
		private function get_query_zhuanti($subject_id , $section_id){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$studentHandler = new student_handler();
			$exerciseHandler = new exercise_handler();
			$this->b['dbtype'] = 1;
			$eduInfo = utils_handler::get_edu_info ( $subject_id );
			$zhuantiTab = $eduInfo['edu_zhuanti'];
			$tableName1 = $eduInfo ['exam_question'];
			$tableName2 = $eduInfo ['exam_question_index'];
			 $sql = <<<SQL
				SELECT $zhuantiTab.* FROM $zhuantiTab
				LEFT JOIN edu_grade ON $zhuantiTab.grade_id=edu_grade.id
				WHERE subject_id=$subject_id AND edu_grade.section_id=$section_id
SQL;

			$this->db->sql = $sql;
			$this->db->Query();
			$rs = $this->db->rs;
			$examType = $this->r('exam_type')?$this->r('exam_type'):'2';
			$examTypeArray = explode(',', $examType);
			$num = count($examTypeArray);
			$userId = $this->vr['id'];
			if(count($rs)>0){
				foreach ($rs as $key=>$value){
					$zhuantiId = $value['id'];
					$knowledgeList = $value['knowledge_list'];
					$knowledgeList = implode( '","',explode( ';',$knowledgeList));
					
					$studyleveInfo = $studentHandler->get_student_study_level($userId, $section_id, $subject_id, $zhuantiId);
					
					$rs[$key]['study_level'] = $studyleveInfo['level']?$studyleveInfo['level']:'1';
					
					$testLeveInfo = $studentHandler->get_student_test_level($userId, $section_id, $subject_id, $zhuantiId);
					
					$rs[$key]['test_level'] = $testLeveInfo['level']?$testLeveInfo['level']:'1';
					
					
					$resultCountInfo = $exerciseHandler->get_stat_zhuanti_user_levels($zhuantiId, $subject_id, $section_id);
					
					$rs[$key]['difficulty_user_count'] = $resultCountInfo;
					
					if($num>1){//步调学习的2个历史记录
						foreach ($examTypeArray as $v){
							$exerciseHistory =$exerciseHandler->get_history($userId, $value['id'], $v);
							$rs[$key]['exercise_history'][$v] = $exerciseHistory?json_decode($exerciseHistory,true):'0';
							$examCountRs = $exerciseHandler->get_exam_stat($userId, $value['id'], $v);
							$rs[$key]['do_exam_info'][$v] = $examCountRs?$examCountRs:'0';
						}		
					}else{
						$exerciseHistory =$exerciseHandler->get_history($userId, $value['id'], $examType);
						$rs[$key]['exercise_history'] = $exerciseHistory?json_decode($exerciseHistory,true):'0';
						$examCountRs = $exerciseHandler->get_exam_stat($userId, $value['id'], $examType);
						$rs[$key]['do_exam_info'] = $examCountRs?$examCountRs:'0';
					}
					
					
				}
			}
			$this->b['zhuanti'] = $rs;
			
		}
		
		private function get_query_zhuanti_info($zhuanti_id){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$this->b['dbtype'] = 1;
			
			$sql = <<<SQL
				SELECT edu_zhuanti.* , edu_subject.Name as subject_name FROM edu_zhuanti 
				LEFT JOIN edu_subject ON edu_zhuanti.subject_id=edu_subject.id 
				WHERE edu_zhuanti.id=$zhuanti_id	
SQL;

			$this->db->sql = $sql;
			$this->db->Queryone();
			$this->b['zhuanti_info'] = $this->db->rs;
			
		}
		
		private function get_query_zhuanti_question($subject_id , $zhuanti_id , $question_type , $question_difficulty , $question_count){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$this->b['dbtype']=1;
			$eduInfo = utils_handler::get_edu_info($subject_id);
			$zhuantiTab = $eduInfo['edu_zhuanti'];
			$this->db->sql = 'SELECT knowledge_id FROM '.$zhuantiTab.' WHERE id='.$zhuanti_id;
			$this->db->Queryone();
			
			$knowledgeList = $this->db->rs['knowledge_id'];

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
			
			$tableName1 = $subject[$subject_id].'_exam_question';
			$tableName2 = $subject[$subject_id].'_exam_question_index';
			$where = utils_handler::analytic_knowledge_id_to_query($tableName2, $knowledgeList);
			$where  ='('.substr($where,4,strlen($where)-4).')';
			$sql = <<<SQL
				SELECT * ,a.dbtype,edu_question_type.type_name FROM $tableName2 
				LEFT JOIN $tableName1 ON $tableName2.gid=$tableName1.gid 
				LEFT JOIN edu_question_type ON edu_question_type.id=$tableName2.question_type
				 join (select 1 as dbtype) a on 1=1
				 where 
				$where 				
SQL;

			if($question_type){
				$sql .= ' AND '.$tableName2.'.objective_flag='.($question_type%2);
			}
			
			if($question_difficulty){
				$sql .= ' AND '.$tableName2.'.difficulty='.$question_difficulty;
			}
			
			
//			$sql .= ' ORDER BY rand() LIMIT 0,'.$question_count; 
			mysql_query('set names utf8');//
			$this->db->sql = $sql;
			$this->db->Query();
			$rs = $this->db->rs;
//			echo '<pre>';
//			print_r($rs);
//			exit;
			if($question_count){
				$tmp = utils_handler::rand_result($rs, $question_count);
			}else{
				$tmp = $rs;
			}
			
			
//			echo '<pre>';
//			foreach ($tmp as $v){
//				echo $v['gid'].'</br>';
//			}
//			exit;
			$this->b['question'] = $tmp;
			
		}
		
		private function get_query_zhenti($subject_id , $section_id , $type , $year , $province_id,$examType){
			//查询最新的试卷
			
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$this->b['dbtype'] =1;
// 			print_r($this->db);
			$eduInfo = $this->get_edu_info($subject_id);
			$tblExamination = $eduInfo['exam_examination'];
			$limit = $this->r('limit');
			
			$user_id = intval($this->r('user_id'));
			
			if($type == 1){
				$typeCondition = 1;
			}else{
				$typeCondition = '2,3';
			}
			
			$where = $tblExamination.'.subject_id='.$subject_id.' AND '.$tblExamination.'.section_id='.$section_id;
			
			if($year){
				$where .= ' AND '.$tblExamination.'.year like "%'.$year.'%" ';
			}
			
			if($province_id){
				$where .= ' AND '.$tblExamination.'.province_id='.$province_id ;
			}
			

			$sql = <<<SQL
				SELECT $tblExamination.id,subject_id, $tblExamination.name FROM $tblExamination 
				LEFT JOIN edu_grade ON $tblExamination.grade_id=edu_grade.id 
				WHERE $where  AND $tblExamination.exam_type IN ($typeCondition) 
				ORDER BY $tblExamination.year desc 
				LIMIT $limit;
SQL;
			$this->db->sql = $sql;
			$this->db->Query();
//			$this->b['sql'] = $this->db->sql;
			$zhenTiRs = $this->db->rs;
			$userId = $this->vr['id'];
//			$examType = '3';//真题
//			ini_set('display_errors', 'On');
//			error_reporting(E_ALL);
			$exerciseHandler = new exercise_handler();
			if(count($zhenTiRs)>0){
				foreach ($zhenTiRs as $key=>$value){
					$zhenTiRs[$key]['ti_total_count'] = $exerciseHandler->get_examination_ti_total_count($value['id'], $subject_id);
					$exerciseHistory =$exerciseHandler->get_history($userId, $value['id'], $examType);
					$zhenTiRs[$key]['exercise_history'] = $exerciseHistory?json_decode($exerciseHistory,true):'0';
					$examCountRs = $exerciseHandler->get_exam_stat($userId, $value['id'], $examType);
					$zhenTiRs[$key]['do_exam_info'] = $examCountRs?$examCountRs:'0';
				}
			}
			$this->b['new_zhenti'] =$zhenTiRs;
			
			//
			$this->switchDB($this->DBCFG['default_local']['dbhost'],$this->DBCFG['default_local']['dbname']);
			$sql = 'SELECT * , COUNT(*) as count FROM study_exercise WHERE assign_id IS null ORDER BY count DESC LIMIT '.$limit;
			$this->db->sql = $sql;
			$this->db->Query();
			$hots = $this->db->rs;
			$ids1 = '';
			foreach($hots as $v){
				$ids1 .= $v['exercise_id'].',';
			}
			$ids1 = substr($ids1 , 0 , strlen($ids1)-1);
//			$this->b['ids1'] = $ids1;
			
			$this->switchDB($this->DBCFG['default_local']['dbhost'],$this->DBCFG['default_local']['dbname']);
			$sql2 = 'SELECT * FROM study_exercise WHERE user_id='.$user_id;
			$this->db->sql = $sql2;
			$this->db->Query();
			$history = $this->db->rs;
			
			$ids2 = '';
			foreach($history as $v){
				$ids2 .= $v['exercise_id'].',';
			}
			
			$ids2 = substr($ids2 , 0 , strlen($ids2)-1);
//			$this->b['ids2'] = $ids2;
			//查询我做过的试卷
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
						
			$sql =<<<SQL
			SELECT $tblExamination.* FROM $tblExamination 
			LEFT JOIN edu_grade ON $tblExamination.grade_id=edu_grade.id  
			WHERE $tblExamination.id in ($ids2) AND $tblExamination.subject_id=$subject_id AND $tblExamination.section_id=$section_id AND $tblExamination.exam_type IN ($typeCondition);
SQL;

			$this->db->sql = $sql;
			
			$this->db->Query();
			
			$this->b['history_score'] = $history;
			$this->b['history_exercise'] = $this->db->rs;
			
			$sql =<<<SQL
			SELECT $tblExamination.* FROM $tblExamination 
			LEFT JOIN edu_grade ON $tblExamination.grade_id=edu_grade.id  
			WHERE $tblExamination.id in ($ids1) AND $where AND exam_type IN ($typeCondition);
			
SQL;
			$this->db->sql = $sql;
			$this->db->Query();
			
			$this->b['hot_exercise'] = $this->db->rs;
			
		}
		
		
		
		
		private function get_query_zhenti_question($exam_id){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$this->b['dbtype'] =1;
			$eduInfo = $this->get_edu_info($this->r('subject_id'));
			$tblExamination = $eduInfo['exam_examination'];
			$this->db->sql = 'SELECT * FROM '.$tblExamination.' WHERE id='.$exam_id;
			
			$this->db->Queryone();
			
			$examInfo = $this->db->rs;
			
			$questionID = json_decode($this->db->rs['content'],true);
			
			$questionID = implode('","' , $questionID['list']);
			
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
			
			$tableName1 = $subject[$examInfo['subject_id']].'_exam_question';
			$tableName2 = $subject[$examInfo['subject_id']].'_exam_question_index';
			
			$sql = <<<SQL
				SELECT * ,a.dbtype,edu_question_type.type_name  FROM $tableName2
				LEFT JOIN $tableName1 ON $tableName2.gid=$tableName1.gid
				LEFT JOIN  edu_question_type ON edu_question_type.id=$tableName2.question_type 
				join (select 1 as dbtype) a on 1=1 
				WHERE $tableName2.gid in ("$questionID") 
				ORDER BY $tableName2.gid ASC 
SQL;
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['exam_info'] = $examInfo;
			$this->b['question_data'] = $this->db->rs;
			
			
			$this->switchDB($this->DBCFG['default_local']['dbhost'],$this->DBCFG['default_local']['dbname']);
			
			
			$sql = 'SELECT * FROM study_exercise WHERE exercise_id='.$exam_id.' AND user_id='.intval($this->vr['id']);
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['history'] = $this->db->rs;
			
			$this->b['sc'] = 200;
			
		}
		
		private function search_data(){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$searchContent = urldecode($this->r('search_content'));
			if($_REQUEST['limit']){
				$limit = $this->r('limit');
			}else{
				$limit = 50;
			}
			$examType = $_REQUEST['exam_type']?$_REQUEST['exam_type']:1;
			if(strstr($searchContent, '，')){
				$searchContent = str_replace('，', ',', $searchContent);
			}
			$searchTmp = explode(',', $searchContent);
			$sectionId = intval($this->r('section_id'));
			if(count($searchTmp)>0){
				$where = ' where exam_type='.$examType.' and ';
				foreach ($searchTmp as $key=>$value){
					$where.=' search_content like "%'.$value.'%" and ';
				}
			}
			$where = substr($where, 0,strlen($where)-4).' and section_id='.$sectionId;
//			echo $where;
			$this->db->sql = <<<SQL
									select id,exam_name,subject_id,subject_name,province_name,exam_type,year,content from exam_examination_view $where order by subject_id limit $limit;
SQL;
			$this->db->Query();
			
			
			$examinationInfo = $this->db->rs;
			$userId = $this->vr['id']?$this->vr['id']:$this->r('user_id');
//			$userId = '139856';
			$examTypeTmp = $examType==1?'3':'4';//转换examType值 3:真题 4 名校
			$exerciseHandler = new exercise_handler();
			if(count($examinationInfo)>0){
				foreach ($examinationInfo as $key=>$value){
					$examinationInfo[$key]['ti_total_count'] = $exerciseHandler->get_examination_ti_total_count($value['id'], $value['subject_id']);
					$exerciseHistory =$exerciseHandler->get_history($userId, $value['id'], $examTypeTmp);
					$examinationInfo[$key]['exercise_history'] = $exerciseHistory?json_decode($exerciseHistory,true):'0';
					$examCountRs = $exerciseHandler->get_exam_stat($userId, $value['id'], $examTypeTmp);
					$examinationInfo[$key]['do_exam_info'] = $examCountRs?$examCountRs:'0';
				}
			}
			
//			echo '<pre>';
//			print_r($examinationInfo);
//			exit;
//			$this->b['sql'] = $this->db->sql;
//			$this->b['user_id'] = $userId;
			$this->b['dbtype'] = 1;
			$this->b['list'] = $examinationInfo;
		}
		
		
			//获取同步试题
		public function get_sync_examination_list($subjectId,$offset,$step,$chatperId){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$eduInfo = utils_handler::get_edu_info($subjectId);
			$tblEaxmIndex = $eduInfo['exam_question_index'];
			$tblEaxm = $eduInfo['exam_question'];
             $chatperSql = 'select id,content from '.$eduInfo[ 'edu_chapter'];
             $where = ' WHERE id ='.$chatperId. '';
               if($where!= ''){
                     $chatperSql = $chatperSql.$where;
                }
             	$this-> db-> sql = $chatperSql;
                 $this-> db->Query();
                 $chapterRs = $this->db ->rs ;
                 $tblIdArr = array ();
                 $tblQuestionIdArr = array ();
                  foreach ($chapterRs as $key=>$value){
                     $content = $value['id' ];
                     $contentArr = explode(',' , $content);
                     foreach ($contentArr as $v){
                          $tblIdArr[] = $v;
                         }
                   }
			
			$sql =<<<SQL
			select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,$tblEaxm.image,a.dbtype,edu_question_type.type_name
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
			LEFT JOIN edu_question_type on edu_question_type.id=$tblEaxmIndex.question_type
			join (select 1 as dbtype) a on 1=1
SQL;
            if(count($tblIdArr)>0){
               $chatperIdSql = 'select question_id from '.$eduInfo[ 'edu_chapter2question']. ' where chapter_id in(' .$chatperId.')' ;
               $this-> db-> sql = $chatperIdSql;
               $this-> db->Query();
               $rs = $this->db ->rs ;
                foreach ($rs as $key=>$value){
                   $tblQuestionIdArr[] = $value['question_id' ];
                 }
                 $questionStr = '"' .implode('","' , $tblQuestionIdArr).'"' ;
                 $where= ' where  '.$tblEaxmIndex. '.gid in('.$questionStr. ')';
              }           
			
			
			if(!$offset && !$step){
					$limit = '';
				}else{
					$limit = ' LIMIT '.$offset.','.$step;
				}
				
			$examinationSql = $sql.$where.$limit;
//			echo $examinationSql;
//			exit;
			$this->db->sql = $examinationSql;	
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
			$examinationNumSql =<<<SQL
			select count(*) as num 
			from $tblEaxmIndex LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
SQL;
			$this->db->sql = $examinationNumSql.$where;	
			$this->db->Queryone();
			$num = $this->db->rs;
			$this->b['count'] =$num['num'] ;
			$this->b['sc'] = 200;
		}
		private function get_publisher_list($subjectId,$gradeId,$sectionId=NULL,$publiserId=NULL){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$eduInfo = utils_handler::get_edu_info($subjectId);
			if($gradeId){
				$booksSql = 'select DISTINCT(publisher_id) from '.$eduInfo['edu_book'].' where subject_id='.$subjectId.' and grade_id ='.$gradeId;
			}
			
			if($sectionId){
				$booksSql = 'select DISTINCT(publisher_id) from '.$eduInfo['edu_book'].' where subject_id='.$subjectId.' and section_id ='.$sectionId;
			}
			
			if($publiserId){
				$booksSql.=' and publisher_id='.$publiserId;
			}
			$this->db->sql = $booksSql;
			$this->db->Query();
			$rs = $this->db->rs;
			$publisherArr = array();
			if(count($rs)>0){
				foreach ($rs as $value){
					$publisherArr[] = $value['publisher_id'];
				}
			}
			$publisherStr = implode(',',$publisherArr);
			$publisherSql = 'select id,name as Name,abbr,pub_code,pub_index,name as notes from edu_publisher where id in('.$publisherStr.');';
			$this->db->sql = $publisherSql;
			$this->db->Query();
			$publisherRs = $this->db->rs;
			if(count($publisherRs)>0){
				foreach ($publisherRs as $key=>$value){
					if($sectionId){//学段查询
						$sql = 'select * from '.$eduInfo['edu_book'].' where subject_id='.$subjectId.' and section_id='.$sectionId.' and publisher_id='.$value['id'].';';
					}
					
					if($gradeId){//年级查询
						$sql = 'select * from '.$eduInfo['edu_book'].' where subject_id='.$subjectId.' and grade_id='.$gradeId.' and publisher_id='.$value['id'].';';
					}
					$this->db->sql=$sql;
					$this->db->Query();
					$publisherRs[$key]['books'] = $this->db->rs;
				}
			}
			$this->b['publisher'] = $publisherRs;
			$this->b['sc'] = 200;
		}
		
		
		private function get_chapter_list($bookId,$subjectId){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$eduInfo = utils_handler::get_edu_info($subjectId);
			$userId = $this->vr['id'];
			$examType = 5;
			$exerciseHandler = new exercise_handler();
			$eduInfo = $this->get_edu_info($subjectId);
			$sqlUnit = 'select * from '.$eduInfo['edu_unit'].' where book_id='.$bookId.' order by unit_index asc';
			$this->db->sql = $sqlUnit;
			$this->db->Query();
			$rsUnit = $this->db->rs;
			foreach ($rsUnit as $key=>$value){
				$sqlChapter ='select id,chapter_name as chapter,unit_id from '.$eduInfo['edu_chapter'].' where unit_id='.$value['id'].';';
				$this->db->sql =$sqlChapter;
				$this->db->Query();
				$rs = $this->db->rs;
				foreach ($rs as $k=>$v){
					$chapterId = $v['id'];
					$eduChapterQuestionTab = $eduInfo['edu_chapter2question'];
					$this->db->sql = <<<SQL
					select count(*) as num from $eduChapterQuestionTab where chapter_id=$chapterId;
SQL;
					$this->db->Queryone();
					$rs[$k]['ti_total_count'] = $this->db->rs['num'];
					$exerciseHistory =$exerciseHandler->get_history($userId, $chapterId, $examType);
					$rs[$k]['exercise_history'] = $exerciseHistory?json_decode($exerciseHistory,true):'0';
					$examCountRs = $exerciseHandler->get_exam_stat($userId, $chapterId, $examType);
					$rs[$k]['do_exam_info'] = $examCountRs?$examCountRs:'0';
				}
				$rsUnit[$key]['chapter'] = $rs;
			}
			$this->b['list'] = $rsUnit;
			$this->b['sc'] = 200;
			
		}
	}
?>