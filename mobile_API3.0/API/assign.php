<?php
///////////////////////////////////////////////////////
// 派送试卷接口
// by 李晓坤 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			switch ($action){
				case 'list':
				$pageNo = intval($this->r('pageno')) - 1;
				$countPerPage = $this->r('countperpage');
				$condition = $this->r('condition');
				$this->get_assign_list($pageNo*$countPerPage,$countPerPage,$condition);
				break;
				case 'marking_list':
				$pageNo = intval($this->r('pageno')) - 1;
				$countPerPage = $this->r('countperpage');
				$this->get_evaluation_marking_list($pageNo*$countPerPage,$countPerPage);
				break;
				case 'students_marking_paper':
					$this->get_students_making_paper();
					break;
				case 'get_students_paper_info':
					$this->get_students_paper_info();
					break;
				
			}
		}
		
			//PUT逻辑
		public function doPUT(){
			$this -> b["sc"] = 405;
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
				//POST逻辑
		public function doPOST(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			switch ($action){
				case 'add_marking_pi':
				$this->insert_marking_pi();
				break;
			}
		}
		
		// 获取派送列表
		private function get_assign_list($offset,$step,$condition){
			$sql = 'select  distinct(teach_exam_list.grade) from teach_assign_list left join teach_exam_list on teach_assign_list.exam_id=teach_exam_list.id';
			$this->db->sql = $sql;
			$this->db->Query();
			$rsGrade = $this->db->rs;
			$this->b['grade_list'] = $rsGrade;
			
			$tables = array('tblAssignList','tblExamList');
			$tblAssignList= array(
				'teach_assign_list',
				'id','exam_id','assign_to','assign_mode','assign_student_count','creator','creator_name','create_date','assign_type','end_date','center_id','zone_id'
			);
			$tblExamList = array(
				'teach_exam_list',
				'grade','build_type','name','score','exam_type',
				'subject_id'
			);
			
			$conditon = array(
				'teach_assign_list.exam_id=teach_exam_list.id'
			);
			
			$conditonNum = array(
				'teach_assign_list.exam_id=teach_exam_list.id'
			);
			//制作where条件
				$where  = '';
				if($condition){
					$tmpArray = explode('$',$condition);//array('param1^value1','param2^value2');
					$resultArray = array();
					foreach($tmpArray as $cdn1){
						if(strpos($cdn1,'^') !== false){//如果是等于检索
							$cdnArray = explode('^' , $cdn1);//array('param1','value1');
							
							//查询条件所属表
							foreach($tables as $tableName){
								if(in_array($cdnArray[0] , $$tableName)){
									$tmp_tbl = $$tableName;
									$resultArray[] = $tmp_tbl[0].'.'.$cdnArray[0].'="'.$cdnArray[1].'"';
									break;
								}
							}
							
						}else if(strpos($cdn1,'@') !== false){
							$cdnArray = explode('@' , $cdn1);//array('param1','value1');
							//查询条件所属表
							foreach($tables as $tableName){
								if(in_array($cdnArray[0] , $$tableName)){
									$tmp_tbl = $$tableName;
									$resultArray[] = $tmp_tbl[0].'.'.$cdnArray[0].' like "%'.$cdnArray[1].'%"';
									break;
								}
							}
							
						}
					}
					
					if($this->r('date')=='time'){
						$interval = $this->r('interval');
						$time = date('Y-m-d H-i-s',strtotime('- '.$interval.'months'));
						if($interval){
//							$resultArray[]  =' unix_timestamp(teach_assign_list.create_date)>unix_timestamp(current_timestamp()-'.$interval.'*3600*24) and  unix_timestamp(teach_assign_list.create_date)<current_timestamp()';
							$resultArray[]  = 'unix_timestamp(teach_assign_list.create_date)>unix_timestamp("'.$time.'") and  unix_timestamp(teach_assign_list.create_date)<current_timestamp()';
						}else{
							$resultArray[]  = ' unix_timestamp(teach_assign_list.create_date)<current_timestamp()';
						}
					}
					if($this->r('user_id')){
						$resultArray[] = ' teach_assign_list.creator='.$this->r('user_id');
					}
					
					$where = implode(' AND ',$resultArray);
				}
				if($where != ''){
					$conditon['where'] = $where;
					$conditonNum['where'] = $where;
				}
//				echo $where;
				if(!$offset && !$step){
					
				}else{
					$conditon['limit'] = $offset.','.$step;
				}
				$conditon['order'] = ' create_date desc';
				$rs  = $this->db->withQueryMakerLeft($tblAssignList,$tblExamList,$conditon);
//				print_r($rs);
//				exit;
				// torrow do
				if($this->r('class_id')){
					foreach ($rs as $key=>$value){
							$assignTo = json_decode($value['assign_to'],true);
							foreach ($assignTo as $k=>$v){
								if($v['class_id']==$this->r('class_id')){
									$rs['stat_class_exam'][] = $value;
								}
							}
					}
					
					$rs = $rs['stat_class_exam'];
				}
//				echo $this->db->sql;
//				print_r($rs);
//				exit;
//				echo $this->db->sql;
				$rsNum  = $this->db->withQueryMakerOfNumLeft($tblAssignList,$tblExamList,$conditonNum);
				if(count($rs)>0){
					foreach ($rs as $key=>$value){
						
						$rs[$key]['stat_analyse']['assign_student_count'] = $value['assign_student_count']; //派送人数
//						$sql = 'select count(*) as num from study_exercise where type=3 and assign_id='.$value['id']; //已提交总数
//						$this->db->sql = $sql;
						if($value['exam_type']=='0'){ //作业 满分100
							$score = 100;
						}else{
							$score = $value['score'];
						}
						
						$scorePercent100 = $score*1;
						$scorePercent85 = $score*0.85;
						$scorePercent70 = $score*0.7;
						$scorePercent60 = $score*0.60; //计算百分比：按照学生作业批改计算 （type=3 已批改）
						$sql = 'select count(*) as num from study_exercise where type=3 and assign_id='.$value['id'].' and my_score='.$scorePercent100;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent100Num = $result['num'];
						$rs[$key]['stat_analyse']['score_percent_100'] = $scorePercent100Num;
						
						$sql = 'select count(*) as num from study_exercise where type=3 and assign_id='.$value['id'].' and my_score<'.$scorePercent100.' and my_score>='.$scorePercent85;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent85OverNum = $result['num'];
						$rs[$key]['stat_analyse']['score_percent_85_over'] = $scorePercent85OverNum;
						
						$sql = 'select count(*) as num from study_exercise where  type=3 and assign_id='.$value['id'].' and my_score<'.$scorePercent85.' and my_score>='.$scorePercent70;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent70OverNum = $result['num'];
						$rs[$key]['stat_analyse']['score_percent_70_over'] = $scorePercent70OverNum;
						
						
						
						$sql = 'select count(*) as num from study_exercise where type=3 and assign_id='.$value['id'].' and my_score<'.$scorePercent70.' and my_score>='.$scorePercent60;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent60OverNum = $result['num'];
						$rs[$key]['stat_analyse']['score_percent_60_over'] = $scorePercent60OverNum;
						
						$sql = 'select count(*) as num from study_exercise where type=3 and assign_id='.$value['id'].' and my_score<'.$scorePercent60;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent60BelowNum = $result['num'];
						
						$rs[$key]['stat_analyse']['score_percent_60_below'] = $scorePercent60BelowNum;
						
						$sql = 'select count(*) as num from study_exercise where (type=3 or type=2) and assign_id='.$value['id'];
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$submitNum = $result['num'];
						
//						$rs[$key]['stat_analyse']['unsubmit_num']  = $value['assign_student_count']-$scorePercent100Num-$scorePercent85OverNum-$scorePercent70OverNum-$scorePercent60OverNum-$scorePercent60BelowNum;
						$rs[$key]['stat_analyse']['unsubmit_num']  = $value['assign_student_count']-$submitNum;
					}
				}
				
//				echo '<pre>';
//				print_r($rs);
				$assignClassInfo = array();
//				$j = 0;
//				foreach ($rs as $key=>$value){
//					$assignTo = json_decode($value['assign_to'],true);
//					foreach ($assignTo as $k=>$v){
//						$assignClassInfo[$j]['assign_id'] = $value['id'];
//						$assignClassInfo[$j]['exam_id'] = $value['exam_id'];
//						$assignClassInfo[$j]['assign_type'] = $value['assign_type'];
//						$assignClassInfo[$j]['assign_mode'] = $value['assign_mode'];
//						$assignClassInfo[$j]['create_date'] = $value['create_date'];
//						$assignClassInfo[$j]['name'] =$value['name'];
//						$assignClassInfo[$j]['grade']  = $value['grade'];
//						$assignClassInfo[$j]['build_type'] =$value['build_type'];
//						$assignClassInfo[$j]['class_id'] = $v['class_id'];
//						$assignClassInfo[$j]['class_name'] =$v['class_name'];
//						$assignClassInfo[$j]['stu_ids']  = $v['stu_ids'];
//						$j++;
//					}
//				}
//				$this->b['count'] = count($assignClassInfo);
				

				
//				echo '<pre>';
//				print_r($rs);
//				exit;
				$this->b['count'] = $rsNum;
				$this->b['list'] = $rs;
//				$this->b['list'] = array_slice($assignClassInfo, $offset,$step);
//				print_r($this->b['list']);
				$this->b['sc'] = 200;
				return true;	
				
		}
	
		//获取测评批阅列表
		private function get_evaluation_marking_list($offset,$step){
			$user_idTemp = $this->vr['id'];
			if($this->r('user_id')){
				$user_idTemp = $this->r('user_id');
			}
			$sql = 'select teach_assign_list.*,
						teach_exam_list.name,
						teach_exam_list.exam_type,
						teach_exam_list.center_id,
						teach_exam_list.zone_id,
						teach_exam_list.subject_id,
						teach_exam_list.grade,
						teach_exam_list.build_type,
						teach_exam_list.conditions,
						teach_exam_list.content,
						teach_exam_list.score,
						teach_exam_list.difficulty,
						teach_exam_list.ref_id,
						teach_exam_list.favorited,
						teach_exam_list.can_share,
						teach_exam_list.assign_student_count,
						teach_exam_list.fav_count,
						teach_exam_list.url
						from teach_assign_list
						left join teach_exam_list on teach_exam_list.id=teach_assign_list.exam_id
						where teach_assign_list.creator='.$user_idTemp.' and teach_assign_list.center_id='.$this->r('center_id').' and teach_assign_list.zone_id='.$this->r('zone_id').' order by create_date desc';
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['sql'] = $sql;
			$rs = $this->db->rs;
			
			
			if(count($rs)>0){
//					foreach ($rs as $key=>$value){
//						$assignId = $value['id'];
//						$sql = 'select sum(a.test_error_count) as test_error_count,sum(a.work_error_count) as work_error_count,
//									sum(a.work_error_count) as work_error_count,
//									sum(a.work_total_count) as work_total_count,
//									sum(a.test_total_count) as test_total_count,
//									sum(a.work_submit_count)as work_submit_count,
//									sum(a.test_submit_count) as test_submit_count,
//									sum(a.test_pi_count) as test_pi_count,
//									sum(a.work_pi_count) as work_pi_count,
//									a.teacher_id,a.class_id from study_exercise 
//									left join stat_student_day a on study_exercise.creator=a.teacher_id and study_exercise.user_id=a.student_id
//									where study_exercise.assign_id='.$assignId.' 
//									group by a.teacher_id,a.class_id;';
//						$sql = <<<SQL
//						select COUNT(*) as num from study_exercise where assign_id=$assignId and class_id= and type=2
//SQL;
//						$this->db->sql = $sql;
//						$this->db->Queryone();
//						$rs[$key]['stat_info'] = $this->db->rs;
//					}

				}
			
			$classRs = array();
			$classInfo = array();
			if(count($rs)>0){
				foreach ($rs as $key=>$value){
					$assignTo = json_decode($value['assign_to'],true);
					foreach ($assignTo as $k=>$v){
							//去除过往班级
							$classStatus  = $this->check_class_status($v['class_id']);
							if($classStatus){
								unset($assignTo[$k]);
							}
					}
					
					foreach ($assignTo as $k=>$v){
							$classRs[$v['class_id']]['assign_info'][] = $value;
							$classInfo[$v['class_id']]['class_id']=$v['class_id'];
							$classInfo[$v['class_id']]['class_name']=$v['class_name'];
					}
				}
			}
			
			

			
			$this->b['class_info']  = $classInfo;
			if($this->r('class_id')){
				$classId = $this->r('class_id');
				$result = $classRs[$this->r('class_id')];
				foreach ($result['assign_info'] as $key=>$value){
					$assignId = $value['id'];
					$sql = <<<SQL
					select COUNT(*) as num from study_exercise where assign_id=$assignId and class_id=$classId and (type=2 or type=3)
SQL;
					$this->db->sql = $sql;
					$this->db->Queryone();
					$rs =$this->db->rs;
					$result['assign_info'][$key]['submit_num']  =$rs['num'];
					
					$sql = <<<SQL
					select COUNT(*) as num from study_exercise where assign_id=$assignId and class_id=$classId and type=3
SQL;
					$this->db->sql = $sql;
					$this->db->Queryone();
					$rs =$this->db->rs;
					$result['assign_info'][$key]['pi_num']  =$rs['num'];
					
					$sql = <<<SQL
					select COUNT(*) as num from study_exercise where assign_id=$assignId and class_id=$classId and (type=1 or type=4)
SQL;
					$this->db->sql = $sql;
					$this->db->Queryone();
					$rs =$this->db->rs;
					$result['assign_info'][$key]['unsubmit_num']  =$rs['num'];
				}
				$this->b['list'] = array_slice($result['assign_info'], $offset,$step,true);
				$this->b['count'] = count($result['assign_info']);
			}
			$this->b['sc'] = 200;			
		}
	
		//检查班级是否过期
		public function check_class_status($classId){
//			$sql = 'select count(*) as num from tblclass where id='.$classId .' and end_date>=now() or end_date="0000-00-00"';//未过期 大班、 小班
			$sql = 'select count(*) as num from tblclass where id='.$classId .' ';//未过期 大班、 小班
			$this->db->sql = $sql;
			$this->db->Queryone();
			$rs = $this->db->rs;
			if($rs['num']>0){
				return false;
			}else{
				return true;
			}
		}
		private function get_students_making_paper(){
			$user_idTemp = $this->vr['id'];
			if($this->r('user_id')){
				$user_idTemp = $this->r('user_id');
			}
			
			$sql = 'select 
						tbluser.realname,
						study_exercise.user_id,
						study_exercise.my_score,
						study_exercise.pi,
						study_exercise.id as student_exercise_id,
						study_exercise.exercise_id,
						study_exercise.log_time,
						study_exercise.content as student_exercise_content,
						study_exercise.class_id,
						teach_exam_list.conditions,
						teach_exam_list.content,
						teach_exam_list.exam_type,
						study_exercise.subject_id,
						tblstudent.grade
						from study_exercise 
						left join teach_assign_list on teach_assign_list.id=study_exercise.assign_id
						left join teach_exam_list on teach_exam_list.id=study_exercise.exercise_id
						left join tbluser on tbluser.id=study_exercise.user_id
						left join tblstudent on tbluser.id=tblstudent.user_id
						where study_exercise.creator='.$user_idTemp.' and study_exercise.type ='.$this->r('type').' and study_exercise.assign_id='.$this->r('assign_id').' and study_exercise.exercise_id='.$this->r('exam_id');
			
			if($this->r('class_id')){
				$sql .=' and study_exercise.class_id='.$this->r('class_id');
			}
			$this->db->sql = $sql;
//			echo $sql;
//			exit;
			$this->db->Query();
			$result = $this->db->rs;
//			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			if(count($result)>0){
				foreach ($result as $key=>$value){
					$examSourceIds = $value['content'];
					$subjectId = $value['subject_id'];
					$tblEaxm = $this->get_examination_tbl($subjectId);
					$tblEaxmIndex = $tblEaxm.'_index';
					$rs =$this->get_paper($tblEaxm, $tblEaxmIndex, $examSourceIds);
					$result[$key]['examSourceInfo'] = $rs;
				}
			}
			
			$this->b['list'] = $result;
			$this->b['sc'] = 200;
		}
		
		private function insert_marking_pi(){
			require_once (dirname(__FILE__)."/../include/stat.php" );
	 		$stat = new statManager();
			$studentPi =array();
			$id = $this->r('student_exercise_id');
			$studentPi['content'] = $this->r('content');
			$studentPi['pi'] = $this->r('pi');
			$studentPi['type'] = 3;
			$studentPi['my_score'] = $this->r('my_score');
			$this->db->update('study_exercise',$studentPi,'id='.$id);
			$rs = $this->db->rs;
			/**
			 * 插入批阅
			 */
			$day = date('Y-m-d');
			$month= intval(date('m'));
			$year = intval(date('Y'));
			if(intval($this->r('exam_type'))=='1'){//测试
					$data = array('teacher_id'=>$this->vr['id'],'test_pi_count'=>'1','year'=>$year,'month'=>$month,'center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id'));
					$stuData = array('student_id'=>$this->r('student_user_id'),'teacher_id'=>$this->r('teacher_user_id'),'class_id'=>$this->r('class_id'),'day'=>$day,'test_pi_count'=>'1');
			}elseif(intval($this->r('exam_type'))=='0'){//作业
					$data = array('teacher_id'=>$this->vr['id'],'work_pi_count'=>'1','year'=>$year,'month'=>$month,'center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id'));
					$stuData = array('student_id'=>$this->r('student_user_id'),'teacher_id'=>$this->r('teacher_user_id'),'class_id'=>$this->r('class_id'),'day'=>$day,'work_pi_count'=>'1');
			}
//			print_r($stuData);
			$stat->update('teacher', 'total', $data);
			$stat->update('student', 'total', $stuData);
			$this->collect_error();
			if($rs){
				$this->b['sc'] = 200;
			}else{
				$this->b['reason'] = 'update study_exercise failed';
			}
	
	}
		
		/**
		 * 
		 * 对于错题的处理
		 */
		
		public function collect_error(){
		require_once (dirname(__FILE__)."/../include/stat.php" );
	 	$stat = new statManager();
	 	$exerciseHandler = new exercise_handler();
	 	$statHandler = new stat_handler();
	 	$studentUserId = $this->r('student_user_id');
	 
		if($this -> vr['pass']){
				if($this->r('error_content')){
					$content = json_decode($this->r('error_content'),true);//提交错题数据[{dbtype:1,ti_id:3},{dbtype:1,ti_id:2}]
					$num = count($content);
					if($num>0){
						foreach ($content as $key=>$value){
							
							$tiId = $value['ti_id'];
							$dbtype = $value['dbtype'];
							$subjectId = $value['subject_id'];
							$sectionId = $value['section_id'];
							
							$userId = $studentUserId;
							$this -> db -> sql = "select id,flag from study_collection where user_id=".$userId." and question_id='".$value['ti_id']."' and dbtype='".$value['dbtype']."'";
							$this -> db -> Queryone();
							$has1 = $this ->db -> rs["id"];
							
							/**
							 * 
							 * 学科数据统计
							 */
							$data = array();
							$data['subject_id'] = $subjectId;
							$data['section_id'] = $sectionId;
							$data['content'][] =$tiId ;
							$data['dbtype'] = $dbtype;
							$exerciseHandler->stat_post_subject($userId, $data, $flag==1);
							
							
							$data['user_id']= $userId;
							$data['count']= 1;
							$data['flag']= 1;
							$data['dbtype']= $dbtype;
							$data['ti_id']= $tiId;
							$data['subject_id']= $subjectId;
							$statHandler->stat_exercise_ti($data);
							$statHandler->stat_exercise_ti_total($data);
							$tiInfo =$exerciseHandler->get_ti_info($tiId, $subjectId, $dbtype);
							$knowledgeId = $tiInfo['knowledge_id'];
							$zhuantiInfo = $exerciseHandler->get_zhuanti_info_by_knowledge_id($knowledgeId, $subjectId, $dbtype);
							$data['knowledge_id'] = $tiInfo['knowledge_id'];
							$data['question_wrong_count'] =1;
							$data['zhuanti_id'] = $zhuantiInfo['id'];
							$data['difficulty'] = $tiInfo['difficulty'];
							$data['question_type'] = $tiInfo['question_type'];
							$data['user_id'] = $userId;
							$data['section_id'] = $sectionId;
							$data['question_id'] = $tiId;
							$statHandler->stat_knowledge($data);
							$statHandler->stat_knowledge_user($data);
							$statHandler->stat_zhuanti($data);
							$statHandler->stat_zhuanti_user($data);
								
							$statHandler->stat_question($data);
							$statHandler->stat_question_user($data);
							
							if($has1){
							//历史表中有记录 则更新历史表 更新同步记录表
								if($this -> r('force')==2){
									$hisid = $this ->db -> rs["id"];
									$this -> db -> sql = 'update study_collection set flag='.$this -> r('bookcode').',add_time=current_timestamp() where id='.$hisid;
									$this -> db -> ExecuteSql();
									$this -> b["sc"] = 200;
								}
								else{
									//非强制更新
									if($this -> db -> rs["flag"] == $this ->r('bookcode')){
										$this -> b["sc"] = 202;
									}
									else{
										$this -> b["sc"] = 403;
									}
									$this -> b["flag"] = $this -> db -> rs["flag"];
									
								}
							
							}
							else{
							//历史表中没有记录 则插入历史表 再更新同步记录表
									$this -> db -> sql = "insert into study_collection (flag,user_id,add_time,question_id,subject_id,dbtype,is_examination,study_exam_id) values(".$this -> r('bookcode').",'".$this -> vr['id']."',current_timestamp(),'".$value['ti_id']."','".$this -> r('subject_id')."','".$value['dbtype']."','".$this->r('exam_type')."','".$this->r('exam_id')."')";
									$this -> db -> ExecuteSql();
									$this -> b["sql2"] =  $this ->db -> sql;
									//$this -> b["sc"] =403;
									//return;
								$hisid = mysql_insert_id();
								$this -> b["sc"] = 201;
							}
							//////////////////////////////////////////////////同步表中是否有记录
							
			/**
							if($this -> b["sc"] == 200 or $this -> b["sc"] == 201){
							
								$has2 = $this -> ifhasrecord2($hisid);
							
								if($has2){
								//有同步记录则更新
							
									$syncid = $this ->db -> rs["id"];
									$this -> upinfo2($syncid);
									//$this -> b["sql"] =  $this ->db -> sql;
								}//无同步记录则插入
								else{
									$this -> insert2($hisid);
									//$this -> b["sql2"] =  $this ->db -> sql;
								}
							    
							}
							
				*/			
							
						}
					}
				}
				
				
//					$sql = 'select * from study_exercise where id= '.$this->r('assign_id');
//					$this->db->sql = $sql;
//					$this->db->Queryone();
//					$stuExercise = $this->db->rs;
					/**
					 * 插入学生应交作业数
					*/
					$teacher_id = $this->r('teacher_user_id');
					$day = date('Y-m-d');
					if(intval($this->r('exam_type'))=='1'){//测试
						$data = array('student_id'=>$this->r("student_user_id"),'test_error_count'=>$num,'day'=>$day,'class_id'=>$this->r('class_id'),'teacher_id'=>$teacher_id);
					}elseif(intval($this->r('exam_type'))=='0'){//作业
						$data = array('student_id'=>$this->r("student_user_id"),'work_error_count'=>$num,'day'=>$day,'class_id'=>$this->r('class_id'),'teacher_id'=>$teacher_id);
					}
					$stat->update('student', 'total', $data);
				
				
			}
	}
	
			
		//获取试卷
		public function get_paper($tblEaxm,$tblEaxmIndex,$paperIdArr){
			$paperIds = json_decode($paperIdArr,true);
			$result1 = array();
			$result2 =array();
			foreach ($paperIds as $key=>$value){
				if($value['dbtype']==1&&$value['ids']){
					$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
					$sql =<<<SQL
			select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,a.dbtype
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
			join (select 1 as dbtype) a on 1=1
SQL;
					if(count($value['ids'])>0){
						$str = '"'.implode('","', $value['ids']).'"';
						$where = ' WHERE '.$tblEaxmIndex.'.gid in('.$str.')';
					}
					
					$this->db->sql = $sql.$where;
//					echo $this->sql;
					$this->db->Query();
					$result1 = $this->db->rs;
				}
				 if($value['dbtype']==2&&$value['ids']){
					$dbJson = $this->query_curriculumndb();
					if($dbJson){
						$db = json_decode($dbJson,true);
//						print_r($db);
						$this->switchDB($db['ip'], $db['name']);
						$sql =<<<SQL
						select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,a.dbtype
						from $tblEaxmIndex
						LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
						join (select 2 as dbtype) a on 1=1
SQL;

						if(count($value['ids'])>0){
							$str = '"'.implode('","', $value['ids']).'"';
							$where = ' WHERE '.$tblEaxmIndex.'.gid in('.$str.')';
						}
//						echo $sql.$where;
						$this->db->sql = $sql.$where;
						 $this->db->Query();
						 $result2 = $this->db->rs;
					}
					
				}
			}
			if(isset($result1)&&isset($result2)){
				$result = array_merge($result1,$result2);
			}else if(isset($result1)&&!isset($result2)){
				$result = $result1;
			}else if(!isset($result1)&&isset($result2)){
				$result = $result2;
			}
			return $result;
		}
		
		
		/**
		 * 获取派发试卷 学生答题 分数信息
		 */
		public function get_students_paper_info(){
			$sql  ='SELECT study_exercise.user_id,study_exercise.class_id,study_exercise.type,study_exercise.my_score,teach_exam_list.score as total_score FROM  study_exercise 
						LEFT JOIN teach_exam_list ON study_exercise.exercise_id=teach_exam_list.id
						WHERE assign_id='.$this->r('assign_id');
			$this->db->sql = $sql;
			$this->db->Query();
			$rs = $this->db->rs;
			if(count($rs)>0){
				foreach ($rs as $key=>$value){
					if(intval($value['type'])==3){ //如果已批阅
						$scorePercent =round(($value['my_score']/$value['total_score'])*100,2); //得分率
						$rs[$key]['score_percent'] = $scorePercent;
					}else{
						$rs[$key]['score_percent'] = 'un_pi';
					}
				}
			}
			
			$this->b['list'] = $rs;
			$this->b['sc'] =200;
		}
	}
?>