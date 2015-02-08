<?php
class exam_paper_handler{
	public function __construct(){
		$this->db = db_handler::getInstance();
	}
	
	public function get_share_exam_center_zone($subjectId,$centerId,$zoneId,$examType){
		//首先获取centerId 下面所有zoneID 
		$centerZoneHandler = new center_zone_handler();
		$zonesInfo = $centerZoneHandler->get_zone_info($centerId);
		if(count($zonesInfo)>0){
		$rsTmp = array();
			foreach ($zonesInfo as $key=>$value){
				 if($value['id']==$zoneId){
				 	unset($zonesInfo[$key]);
				 }
			}
			
			foreach ($zonesInfo as $key=>$value){
				$zoneIdTmp = $value['id'];
				$sql = <<<SQL
											select teach_exam_list.*,tbluser.realname as teacher_realname from teach_exam_list 
											
											left join tbluser on tbluser.id=teach_exam_list.teacher_id

											where zone_id='$zoneIdTmp' and can_share=1 and subject_id='$subjectId'
											
											
SQL;
				if($examType){
					$sql.=<<<SQL
											AND exam_type=$examType;
SQL;
				}
				
				$this->db->sql = $sql;
				$this->db->Query();
				$rs = $this->db->rs;
				foreach ($rs  as $k=>$v){
					array_push($rsTmp, $v);
				}
			}
			//然后处理当前zoneId 所有的试卷
			$sql = <<<SQL
										select teach_exam_list.*,tbluser.realname as teacher_realname from teach_exam_list 
										
										left join tbluser on tbluser.id=teach_exam_list.teacher_id 
										
										where zone_id='$zoneId' and subject_id='$subjectId' 
SQL;

			if($examType){
					$sql.=<<<SQL
										AND exam_type=$examType;
SQL;
				}
				
			$this->db->sql = $sql;
			$this->db->Query();
			$rs = $this->db->rs;
			foreach ($rs  as $k=>$v){
				array_push($rsTmp, $v);
			}
			
			$result['list'] = $rsTmp;
			$result['count'] = count($rsTmp);
			return $result;
		}
	}

	
	/**
	 * $teacherUserId = $this->vr['id'];
	 * $teacherRealName = $this->vr['realname'];
	 * $subjectId = $this->vr['subject_id'];
	 * 
	 * 	$favExamAssign = $this->r('fav_exam_assign')
	 * 	$examIdStr = $this->r('ti_id');
	 * $favId =$this->r('fav_id');
	 * $centerId = $this->r('center_id');
	 * $zoneId = $this->r('zone_id');
	 * $assignType = $this->r('assign_type');
	 * $assignMode = $this->r('assign_mode');
	 * $gradeId = $this->r('grade_id');
	 * $assignTo = $this->r('assign_to') ;
	 * $endDate = $this->r('end_date');
	 * 
	 * 
	 */
		//派送试卷
	public function dispatch_paper($teacherUserId,$teacherRealName,$favExamAssign,$examIdStr,$examType,$favId,$centerId,$zoneId,$assignType,$assignMode,$assignTo,$endDate){
			$examIdArray = json_decode($examIdStr,TRUE);
			//多份试卷遍历处理
				foreach ($examIdArray as $examKey=>$examValue){
					$examIdTmp = $examValue['ti_id'];
					
					$gradeId = $examValue['grade_id'];
					
					$subjectId = $examValue['subject_id'];
					
						$assign = array();
						//在派送之前做处理，如果收藏试卷列表派送试卷，检查试卷ID是否存在，如果不存在，创建新的试卷
						if($favExamAssign==1){
							$sql ='select * from teach_exam_list where id='.$examIdTmp;
							$this->db->sql = $sql;
							$this->db->Query();
							$rs = $this->db->rs;
							if(count($rs)>0){
								$examId = $examIdTmp;
							}else{
								$sql = 'select * from teach_fav_exam where ref_id='.$examIdTmp.' and teacher_id='.$teacherUserId;
								$this->db->sql =$sql;
								$this->db->Queryone();
								$rs = $this->db->rs;
								$exam = array();
								$exam['teacher_id'] = $rs['teacher_id'];
								$exam['name'] = $rs['name'];
								$exam['exam_type'] = $rs['exam_type'];
								$exam['center_id'] = $rs['center_id'];
								$exam['zone_id'] = $rs['zone_id'];
								$exam['subject_id'] =  $rs['subject_id'];
								$exam['grade'] =  $rs['grade'];
								$exam['build_type'] =  $rs['build_type'];
								$exam['conditions'] =  $rs['conditions'];
								$exam['content'] =  $rs['content'];
								$exam['score'] =  $rs['score'];
								$exam['difficulty'] =  $rs['difficulty'];
								$exam['ref_id'] =  $rs['ref_id'];
								$exam['favorited'] =  1;
								$exam['fav_count'] =  1;
								$exam['create_date'] =  'current_timestamp()';
								$this->db->Insert('teach_exam_list', $exam);
								$examId = $this->db->Last_id();
								if($examId){
									$sql = 'update teach_fav_exam set ref_id='.$examId.'  where id='.$favId;
									$this->db->sql = $sql;
									$this->db->ExecuteSql();
								}
							}
						}else{
							$examId = $examIdTmp;
						}
						$assign['exam_id'] = $examId;
						$assign['center_id'] = $centerId;
						$assign['zone_id'] = $zoneId;
						$assign['assign_type'] = $assignType; //1:online 2 word
						$assign['assign_mode'] = $assignMode; //班级，个人
						$assginStuInfo = array();
						//在获取数据以后先将 中文urlencode ，然后json_encode  保存到数据库
						foreach ($assignTo as $key=>$value){
							$assginStuInfo[$key]['class_id'] = $value['class_id'];
							$assginStuInfo[$key]['class_name'] = urlencode($value['class_name']);
							$assginStuInfo[$key]['stu_num'] = $value['stu_num'];
								foreach ($value['stu_ids'] as $k=>$v){
									$assginStuInfo[$key]['stu_ids'][$k]['stu_id'] = $v['stu_id'];
									$assginStuInfo[$key]['stu_ids'][$k]['stu_name'] = urlencode($v['stu_name']);
								}					
						}
						
						$assign['assign_to'] = json_encode($assginStuInfo);
						$stuNum = 0;
						foreach ($assignTo as $key=>$value){
							$stuNum +=$value['stu_num'];
						}
						$assign['assign_student_count'] = $stuNum;
						$assign['creator'] = $teacherUserId;
						$assign['creator_name'] = $teacherRealName;
						$assign['create_date'] = 'current_timestamp()';
						$assign['end_date'] = $endDate;
						$result = $this->db->Insert('teach_assign_list', $assign);
						if($result){
							$assignId = $this->db->Last_id();
							$studentExamList = array();
							$pushList = array(); //插入push_list 数组
		                    $j = 0;
							foreach ($assignTo as $key=>$value){
								foreach ($value['stu_ids'] as $k=>$v){
									$studentExamList[$j]['user_id'] =$v['stu_id'];
									$studentExamList[$j]['exercise_id'] =$examId;
									$studentExamList[$j]['class_id'] =$value['class_id'];
									$studentExamList[$j]['assign_id'] = $assignId;
									$studentExamList[$j]['create_date'] = 'current_timestamp()';
									$studentExamList[$j]['creator'] =$teacherUserId;
									$studentExamList[$j]['assign_type'] =$assignType;
									$studentExamList[$j]['ClassOrPersonal'] =$assignMode;
									$studentExamList[$j]['type'] =1; //  1:新作业，2：做过：3已批阅
									$studentExamList[$j]['subject_id'] = $subjectId;
									$studentExamList[$j]['grade_id'] = $gradeId;
									$studentExamList[$j]['ClassOrPersonal'] =$assignMode;
									$studentExamList[$j]['exam_type'] =$examType;
									
									$pushList[$j]['program' ] = 'all' ;
		                    		$pushList[$j]['n_bubble' ] = '有新作业' ;
		                    		$pushList[$j]['title' ] = '有新作业' ;
		                    		$pushList[$j]['content' ] = '收到新的作业，去看看！' ;
									$pushList[$j]['creat_time' ] = 'current_timestamp()';
		                     		$pushList[$j]['n_style' ] = 3;
									$pushList[$j]['oprate_one' ] = $teacherUserId;
									$pushList[$j]['type' ] = 1;
									$pushList[$j]['user_id'] = $v['stu_id'];
									$j++;
								}
							}
							$resultStuExamList = $this->db->Inserts('study_exercise', $studentExamList);
		
							if($resultStuExamList){
		                        $resultPushList = $this->db->Inserts('push_list', $pushList);
		                        if($resultPushList){
									$sql = 'UPDATE  teach_exam_list SET status=1,assign_student_count=assign_student_count+'.$stuNum.' WHERE id='.$assign['exam_id'];
									$this->db->sql = $sql;
									$this->db->ExecuteSql();
									if($this->db->rs){
										$result['sc'] = 200;
									}else{
										$result['reason'] = 'update teach_exam_list failed';
										$result['sc']  = 400;
									}
		                        }else{
		                        	$result['reason'] = 'insert push_list failed';
									$result['sc']  = 400;
		                        }
								
							}else{
									$result['reason'] = 'insert study_exercise failed';
									$result['sc']  = 400;
							}
						}else{
							$result['reason'] = 'insert teach_assign_list failed';
							$result['sc']  = 400;
						}
				
				}
				
				return  $result;
			}

}