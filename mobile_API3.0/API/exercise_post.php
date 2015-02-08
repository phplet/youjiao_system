<?php
/**
 * @author by XK 
 */
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		public function doGET(){
			
		}
		public function doPOST(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			$exerciseHandler = new exercise_handler();
			$statHandler = new stat_handler();
			switch($action){
				case 'add2haoti':
					
					$subject_id = $this->r('subject');
					$question_id = $this->r('question');
					$answer = $this->r('answer');
					$this->post_add2haoti($subject_id , $question_id , $answer);
					
					break;
				
				case 'saveRecord':
					
					$data = $this->r('data');
					$this->post_add_record($data);
					
					break;
					
				case 'saveExamResult':
//					ini_set('display_errors', 'On');
//					error_reporting(E_ALL);
					$data = json_decode($this->r('data'),true);
					$userId = $this->vr['id'];
					$dbtype = $data['dbtype'];
//					$dbtype = 1;
					$examType = $data['exam_type'];
					$subjectId = $data['subject_id'];
					$exerciseId = $data['exercise_id'];
					$examType = $data['exam_type'];
					switch ($examType){
						case '1'://作业测试 备用接口
							$rs = $exerciseHandler->get_query_exercise_question($exerciseId);
							break;
						case '2'://专题
							$rs['exercise_info']['id'] = $data['exercise_id'];
							//sorry
							$contentTmp ['ids'] = array_values($data['exam_content']); //转换成数组
							$contentTmp ['dbtype'] = $dbtype;
							if ($dbtype == '1') {
								$contentTmpOther ['dbtype'] = '2';
							} else if ($dbtype == '2') {
								$contentTmpOther ['dbtype'] = '1';
							}
							$content ['0'] = $contentTmp;
							$content ['1'] = $contentTmpOther;
							$rs ['exercise_info'] ['content'] = json_encode ( $content );
							$zhuanTiName = $exerciseHandler->get_query_zhuanti_name($exerciseId, $subjectId);
							$rs['exercise_info']['name'] = $zhuanTiName;
							break;
						case '3'://真题
							$rs = $exerciseHandler->get_query_zhenti_question($userId, $exerciseId, $subjectId, $dbtype);//查询真题试题内容
							break;
						case '4'://名校
							$rs = $exerciseHandler->get_query_zhenti_question($userId, $exerciseId, $subjectId, $dbtype);//查询名校试题内容
							break;
						case '5'://同步
							$exerciseId = $data['chapter_id'];
							$rs = $exerciseHandler->get_query_sync_question($subjectId, $exerciseId, $dbtype);//查询同步试题内容
							break;
							
						case '6'://入学测试
							$rs = $exerciseHandler->get_query_exercise_question($exerciseId);
							break;
							
						case '7'://步调学习  学习等级
							$rs['exercise_info']['id'] = $data['exercise_id'];
							//sorry
							$contentTmp ['ids'] = array_values($data['exam_content']); //转换成数组
							$contentTmp ['dbtype'] = $dbtype;
							if ($dbtype == '1') {
								$contentTmpOther ['dbtype'] = '2';
							} else if ($dbtype == '2') {
								$contentTmpOther ['dbtype'] = '1';
							}
							$content ['0'] = $contentTmp;
							$content ['1'] = $contentTmpOther;
							$rs ['exercise_info'] ['content'] = json_encode ( $content );
							$zhuanTiName = $exerciseHandler->get_query_zhuanti_name($exerciseId, $subjectId);
							$rs['exercise_info']['name'] = $zhuanTiName;
							break;

							
						case '8':// 诊断分析提交 和专题一样
							$rs['exercise_info']['id'] = $data['exercise_id'];
							//sorry
							$contentTmp ['ids'] = array_values($data['exam_content']); //转换成数组
							$contentTmp ['dbtype'] = $dbtype;
							if ($dbtype == '1') {
								$contentTmpOther ['dbtype'] = '2';
							} else if ($dbtype == '2') {
								$contentTmpOther ['dbtype'] = '1';
							}
							$content ['0'] = $contentTmp;
							$content ['1'] = $contentTmpOther;
							$rs ['exercise_info'] ['content'] = json_encode ( $content );
							$zhuanTiName = $exerciseHandler->get_query_zhuanti_name($exerciseId, $subjectId);
							$rs['exercise_info']['name'] = $zhuanTiName;
							break;
							
							
						case '9'://步调学习  和专题一样  测评等级
							$rs['exercise_info']['id'] = $data['exercise_id'];
							//sorry
							$contentTmp ['ids'] = array_values($data['exam_content']); //转换成数组
							$contentTmp ['dbtype'] = $dbtype;
							if ($dbtype == '1') {
								$contentTmpOther ['dbtype'] = '2';
							} else if ($dbtype == '2') {
								$contentTmpOther ['dbtype'] = '1';
							}
							$content ['0'] = $contentTmp;
							$content ['1'] = $contentTmpOther;
							$rs ['exercise_info'] ['content'] = json_encode ( $content );
							$zhuanTiName = $exerciseHandler->get_query_zhuanti_name($exerciseId, $subjectId);
							$rs['exercise_info']['name'] = $zhuanTiName;
							break;			
							
					}
					$exerciseInfo = $rs['exercise_info'];
					$data['exam_id'] =$exerciseInfo['id']; 
					$data['name'] =$exerciseInfo['name']; 
					$data['exam_content'] =$exerciseInfo['content']; 
//					echo '<pre>';
//					print_r($data['exam_content']);
//					exit();
//					echo '<pre>';
//					print_r($data['exam_content']);
//					exit;

					if($examType!='1'&&$examType!='6'){
						$examId =$exerciseHandler->post_add_teach_self($userId,$data);//保存试卷
						$data['exam_id'] = $examId;
					}else{
						$data['exam_id'] = $data['exercise_id'];
					}
					$userId = $this->vr['id'];
					$dbtype = $data['dbtype'];
					$studyExerciseId = $data['study_exercise_id'];//如果是继续做题 需要
					$data['study_exercise_id'] = $this->post_add_exam_result($data,$studyExerciseId);
					
					$exerciseHandler->post_add_ticool_user_history($userId, $data);//往日志表里面插入记录
					
					$exerciseHandler->update_init_setting($studyExerciseId,$data['subject_id'],$userId);//更新initSetting
					
					//步调学习 学习等级
					if($examType=='7'){
						$studentHandler = new student_handler();
						$rs = $studentHandler->post_change_student_level($userId, $data);
						$this->b['info'] = $rs;
					}
					
					if($examType=='9'){//步调学习 测评等级
						$studentHandler = new student_handler();
						$studentHandler->update_student_level_test_base($userId, $data);
					}
					
					//@todo  数据统计
					$data['user_id'] = $this->vr['id'];
					$data['exam_id'] = $data['exercise_id'];
					$data['ti_count'] = count($data['content']);
					$data['exam_count'] = 1;//提交次数
					
					
//					echo '<pre>';
					
					$exerciseHandler->post_add_exercise_count($data);
					
					$exerciseHandler->stat_post_knowledge_id($userId, $data);//添加知识点的统计
					
					$exerciseHandler->stat_post_zhuanti($userId, $data);//添加专题统计
					
					$exerciseHandler->stat_post_subject($userId, $data);//添加学科统计
					
					$exerciseHandler->stat_post_question_id($userId, $data);//添加试题的统计
					
					
//					exit;
					//解析data['content'] 到指定数据格式
					$dataHistory = $exerciseHandler->analytic_data_content($data);
					$data['content'] = json_encode($dataHistory);
					$exerciseHandler->post_add_history($userId, $data, $dbtype);
					
					
					/**
					 * 清空study_exercise_id
					 */
					$exerciseHandler->post_update_history($userId, $data, $dbtype);
					
					
					if($data['remove']){
						$rsRemove = $exerciseHandler->post_remove_history($userId, $data, $dbtype);// 临时保存就清空
					}
					
					
				
					//@todo 保存历史到 指定的XML  或者到JSON文件
					if($rsRemove){
						$this->b['flag'] = true;
					}
					break;
				case 'saveHistory':
					$data = json_decode($this->r('data'),true);//做过哪些保存哪些
					$userId = $this->vr['id'];
					$dbtype = $data['dbtype'];
					$dbtype = 1;
					$examType = $data['exam_type'];
					$subjectId = $data['subject_id'];
					$exerciseId = $data['exercise_id'];
					
					//@todo  数据统计
					$data['user_id'] = $this->vr['id'];
					$data['exam_id'] = $data['exercise_id'];
					$data['ti_count'] = count($data['content']);
					
					$exerciseHandler->post_add_exercise_count($data);
					//如果存在remove 则删除
					if($data['remove']){
						$exerciseHandler->post_remove_history($userId, $data, $dbtype);
					}
					switch ($examType){
						case '1':
							$rs = $exerciseHandler->get_query_exercise_question($exerciseId);
							break;
						case '2'://专题
							$rs['exercise_info']['id'] = $data['exercise_id'];
							//sorry
							$contentTmp ['ids'] = array_values($data['exam_content']); //转换成数组
							$contentTmp ['dbtype'] = $dbtype;
							if ($dbtype == '1') {
								$contentTmpOther ['dbtype'] = '2';
							} else if ($dbtype == '2') {
								$contentTmpOther ['dbtype'] = '1';
							}
							$content ['0'] = $contentTmp;
							$content ['1'] = $contentTmpOther;
							$rs ['exercise_info'] ['content'] = json_encode ( $content );
							$zhuanTiName = $exerciseHandler->get_query_zhuanti_name($exerciseId, $subjectId);
							$rs['exercise_info']['name'] = $zhuanTiName;
							break;
						case '3'://真题
							$rs = $exerciseHandler->get_query_zhenti_question($userId, $exerciseId, $subjectId, $dbtype);//查询真题试题内容
							break;
						case '4'://名校
							$rs = $exerciseHandler->get_query_zhenti_question($userId, $exerciseId, $subjectId, $dbtype);//查询名校试题内容
							break;
						case '5'://同步
							$exerciseId = $data['chapter_id'];
							$rs = $exerciseHandler->get_query_sync_question($subjectId, $exerciseId, $dbtype);//查询同步试题内容
							break;
							
						case '7'://步调学习  和专题一样  学习等级
							$rs['exercise_info']['id'] = $data['exercise_id'];
							//sorry
							$contentTmp ['ids'] = array_values($data['exam_content']); //转换成数组
							$contentTmp ['dbtype'] = $dbtype;
							if ($dbtype == '1') {
								$contentTmpOther ['dbtype'] = '2';
							} else if ($dbtype == '2') {
								$contentTmpOther ['dbtype'] = '1';
							}
							$content ['0'] = $contentTmp;
							$content ['1'] = $contentTmpOther;
							$rs ['exercise_info'] ['content'] = json_encode ( $content );
							$zhuanTiName = $exerciseHandler->get_query_zhuanti_name($exerciseId, $subjectId);
							$rs['exercise_info']['name'] = $zhuanTiName;
							break;

						case '9'://步调学习  和专题一样  学习等级
							$rs['exercise_info']['id'] = $data['exercise_id'];
							//sorry
							$contentTmp ['ids'] = array_values($data['exam_content']); //转换成数组
							$contentTmp ['dbtype'] = $dbtype;
							if ($dbtype == '1') {
								$contentTmpOther ['dbtype'] = '2';
							} else if ($dbtype == '2') {
								$contentTmpOther ['dbtype'] = '1';
							}
							$content ['0'] = $contentTmp;
							$content ['1'] = $contentTmpOther;
							$rs ['exercise_info'] ['content'] = json_encode ( $content );
							$zhuanTiName = $exerciseHandler->get_query_zhuanti_name($exerciseId, $subjectId);
							$rs['exercise_info']['name'] = $zhuanTiName;
							break;				
							
					}
					
					$exerciseInfo = $rs['exercise_info'];
					$data['exam_id'] =$exerciseInfo['id']; 
					$data['name'] =$exerciseInfo['name']; 
					$data['exam_content'] =$exerciseInfo['content']; 
//					echo '<pre>';
//					print_r($data['exam_content']);
//					exit();
//					echo '<pre>';
//					print_r($data['exam_content']);
//					exit;
					$examId =$exerciseHandler->post_add_teach_self($userId,$data);//保存试卷
					
					$data['self_exercise_id'] = $examId;
					$data['exercise_id'] = $examId; //自主学习试卷ID
					$studyExericseId =$exerciseHandler->post_add_exercise_result($userId,$data);//添加作业
					
					$data['study_exercise_id'] = $studyExericseId; //将作业的ID 添加initSetting 文件中
					
					
					$selfExamInfo = $exerciseHandler->get_self_exam_info($examId);
					
					
					$data['exam_name'] = $selfExamInfo['name'];
					$data['exam_content'] = json_decode($selfExamInfo['content'],true);
					$data['history_content'] = $data['content'];
					$data['exercise_id'] = $exerciseId; //试卷ID
					
					$exerciseHandler->post_add_init_setting($userId, $data);//添加初始化设置
					
					$dataTmp = utils_handler::analytic_data(json_decode($this->r('data'),true));
					$data['content'] =json_encode($dataTmp);//提交的content;
					$data['exercise_id'] = $exerciseId;
					$exerciseHandler->post_add_history($userId, $data, $dbtype);//添加到历史记录
					$this->b['flag'] = true;
					break;
				case 'saveBookSetting':
					$data = $this->r('data');
					$userId = $this->vr['id'];
					$rs = $exerciseHandler->post_add_book_setting($userId, $data);
					$this->b['flag'] = $rs;
					break;
				case 'saveCollection'://添加好题、错题本
					$exerciseHandler = new exercise_handler();
					$subjectId = $this->r('subjectid');
					$gradeId = $this->r('grade_id');
					$sectionId = $this->r('section_id');
					$flag = $this->r('bookcode');
					$dbtype = $this->r('dbtype');
					$userId = $this->vr['id'];
					$tiIds = $this->r('ti_id');
					$tiIdArray = explode(',', $tiIds);
					$resultFlag = true;

					//错题subject统计
					if($flag==1){
						$data['subject_id'] = $subjectId;
						$data['section_id'] = $sectionId;
						$data['content'] = $tiIdArray;
						$data['dbtype'] = $dbtype;
						/**
						 * 错题本不做统计
						 */
//						$exerciseHandler->stat_post_subject($userId, $data, $flag);
					}
					if($tiIdArray){
						foreach ($tiIdArray as $key=>$value){
							$tiId = $value;
							$data = array();
							$data['user_id']= $userId;
							$data['count']= 1;
							$data['flag']= $flag;
							$data['dbtype']= $dbtype;
							$data['ti_id']= $tiId;
							$data['subject_id']= $subjectId;
							$statHandler->stat_exercise_ti($data);
							$statHandler->stat_exercise_ti_total($data);
							$tiInfo =$exerciseHandler->get_ti_info($tiId, $subjectId, $dbtype);
							$knowledgeId = $tiInfo['knowledge_id'];
							$zhuantiInfo = $exerciseHandler->get_zhuanti_info_by_knowledge_id($knowledgeId, $subjectId, $dbtype,$sectionId);
							if($flag==1){//错题知识点
								$data['knowledge_id'] = $tiInfo['knowledge_id'];
								$data['question_wrong_count'] =1;
								$data['zhuanti_id'] = $zhuantiInfo['id'];
								$data['difficulty'] = $tiInfo['difficulty'];
								$data['question_type'] = $tiInfo['question_type'];
								$data['user_id'] = $userId;
								$data['section_id'] = $sectionId;
								$data['question_id'] = $tiId;
								
								/**
								 * 错题本不做统计
								 */
//								$statHandler->stat_knowledge($data);
//								$statHandler->stat_knowledge_user($data);
//								$statHandler->stat_zhuanti($data);
//								$statHandler->stat_zhuanti_user($data);
//								$statHandler->stat_question($data);
//								$statHandler->stat_question_user($data);
							}
		
							$rs = $exerciseHandler->is_exist_collection($userId, $tiId, $flag,$dbtype);
							if($rs['id']){
								$rs1  = $exerciseHandler->update_collection($rs['id']);
								if($rs1){
									$resultFlag = $resultFlag&&true;
								}else{
									$resultFlag = $resultFlag&&false;
								}
							}else{
								$rs2 = $exerciseHandler->insert_collection($userId, $flag, $tiId, $subjectId, $dbtype, $gradeId);
								if($rs2){
									$resultFlag = $resultFlag&&true;
								}else{
									$resultFlag = $$resultFlag&&false;
								}
							}
						}
					}
					$this->b['flag'] = true;
					break;
					
				case 'saveTestReport':
					$data = $this->r('data');
					$result = $exerciseHandler->post_add_test_report($data);
					if($result!=false){
						$this->b['flag'] = true;
						$this->b['trid'] = $result;
					}else{
						$this->b['flag'] = false;
					}
					break;
				case 'modifyTestReport':
					$data = $this->r('data');
					$result = $exerciseHandler->post_modify_test_report($data);
					$this->b['flag'] = $result;
					break;
			}
			
			
		}
		
		private function get_init(){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$section_id = 2;
			
			$sql = <<<SQL
				SELECT subject_id,edu_grade.name as grade_name , edu_subject.name as subject_name FROM exam_examination 
				JOIN edu_grade ON exam_examination.grade_id=edu_grade.id
                JOIN edu_subject ON exam_examination.subject_id=edu_subject.id 
				WHERE edu_grade.section_id=$section_id
				GROUP BY exam_examination.subject_id
SQL;
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['subject'] = $this->db->rs;
			
		}

		private function post_add2haoti($subject_id , $question_id , $answer){
			$insertInfo = array(
				'flag'=>1,
				'user_id'=>$this->vr['id'],
				'grade_id'=>$this->vr['grade_id'],
				'add_time'=>'current_timestamp()',
				'question_id'=>$question_id,
				'my_answer'=>$answer,
				'is_examination'=>2,
				'subject_id'=>$subject_id,
				'dbtype'=>$this->r('dbtype')
			);
			
			$this->b['flag'] = $this->db->Insert('study_collection' , $insertInfo);
//			$this->b['sql'] = $this->db->sql;
//			echo $this->db->sql;
			$this->b['sc'] = 200;
			
		}
		
		public function post_add_record($list){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			
			foreach($list as $k =>$v){
				$list[$k]['tid'] = $v['id'];
				$list[$k]['uid'] = $this->vr['id'];
				$list[$k]['time_start']  = date('Y-m-d H:i:s' , intval($v['time_start'])/1000);
				$list[$k]['time_end']  = date('Y-m-d H:i:s' , intval($v['time_end'])/1000);
			}
			
			$this->b['flag'] = $this->db->Inserts('ticool_user_history' , $list);
			$this->b['sc'] = 200;
			
		}
		
		public  function post_add_exam_result($data,$id=null){
			$dataTmp['user_id'] = $this->vr['id'];
			$dataTmp['exercise_id'] = $data['exam_id'];
			$dataTmp['create_date'] = 'current_timestamp()'; 
			$dataTmp['duration'] = $data['duration'];
			$dataTmp['my_score'] = $data['my_score'];
			$dataTmp['type'] = $data['type'];
			$dataTmp['log_time'] = $data['log_time']?$data['log_time']:'current_timestamp()';
			$dataTmp['pi'] = $data['pi'];
			$dataTmp['subject_id'] = $data['subject_id'];
			$dataTmp['grade_id'] = $data['grade_id'];
			$dataTmp['exam_type'] = $data['exam_type'];
			$dataTmp['content'] = base64_encode(json_encode($data['content']));
			if($id){
				$this->b['flag'] = $this->db->Update('study_exercise', $dataTmp,'id='.$id);
				return $id;
			}else{
				$this->b['flag'] = $this->db->Insert('study_exercise',$dataTmp);
				return $this->db->Last_id();
			}
			$this->b['sc'] = 200;
			
		}
		
		
		

	}
?>