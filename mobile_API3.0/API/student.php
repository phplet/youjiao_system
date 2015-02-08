<?php
///////////////////////////////////////////////////////
// 学生接口
// by xiaokun v1.0
///////////////////////////////////////////////////////
//rest接口
require_once(dirname(__FILE__)."/../rest.php");
require_once (dirname(__FILE__)."/../include/stat.php" );
class crest extends REST{
	public function doGET(){
		$studentHandler = new student_handler();
		$userHandler = new user_handler();
		if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
		}
		$action = $this->r('action');
		switch($action){
			case 'list':
				$condition = $this->r('condition');
				$pageNo = intval($this->r('pageno')) - 1;
				$countPerPage = $this->r('countperpage');
				$fresh = $this->r('fresh');
				$student = new student_handler();
				$result = $student->get_student_list($pageNo, $countPerPage, $condition, $fresh);
				$this->b['count'] = $result['count'];
				$this->b['list'] = $result['list'];
				break;
			case 'get_stu_center_zone':
				$this->get_stu_center_zone();
				break;
			case 'over':// 学生结课  同class .php action=exit 一样处理
				$classStuId = $this->r('class_stu_id');
				$studentHandler->stat_lost_student_num($classStuId);
				$whereArray['id'] = $classStuId;
				$userHandler->add_table_history_info('tblclass2student', $whereArray, $operateStatus='0');
				$student =array();
				$rs = $userHandler->remove_table_info('tblclass2student', $whereArray);
				$this->b['flag'] = $rs;
				break;
			case 'getStudentInfo':
				$this->get_student_info();
				break;
			case 'get_student_knowledge_stat':
				$this->get_student_knowledge_stat();
				break;	
			case 'get_student_exercise':
				$userId = $this->r('user_id');
				$type = $this->r('type');//type=new 为新作业
				$pageNo = $this->r('pageno')?intval($this->r('pageno')-1):null;
				$countPerPage = intval($this->r('countperpage'))?$this->r('countperpage'):null;
				$examType = $this->r('exam_type');
				$rs = $studentHandler->get_student_exericise($userId, $type, $pageNo, $countPerPage,$examType);
				$this->b['list'] = $rs['list'];
				$this->b['count'] = $rs['count'];
				break;
			case 'getStudentDetailInfo':
				$realName =$this->r('realname');
				$userName =$this->r('username');
				$rs = $studentHandler->ge_student_info_by_name($userName,$realName);
				$this->b['user_info'] = $rs;
				break;
		}
	}
	
	public function doPOST(){
		
//		if(!$this->vr['pass']){
//			$this->b['flag'] = false;
//			$this->b['sc'] = 401;
//			return;
//		}
		$statHandler = new stat_handler();
		$studentHandler = new student_handler();
		$action = $this->r('action');
		
		switch($action){
			case 'add':
				
				$studentInfo = array();
				
				$studentInfo['center_id'] = $this->r('center_id');
				$studentInfo['zone_id'] = $this->r('zone_id');
				$studentInfo['username'] = $this->r('username');
				$studentInfo['realname'] = $this->r('realname');
				$studentInfo['nickname'] = $this->r('nickname');
//				$studentInfo['teachername'] = $this->r('teachername');
				$studentInfo['gender'] = $this->r('gender');
				$studentInfo['tel'] = $this->r('tel');
				$studentInfo['email'] = $this->r('email');
				$studentInfo['note'] = $this->r('note');
				$studentInfo['school_name'] = $this->r('schoolName');
				$studentInfo['grade'] = $this->r('grade');
				$studentInfo['class_type'] = $this->r('class_type');
				$studentInfo['teacher_list'] = $this->r('teacher_list');
				$studentInfo['class_id'] = $this->r('bigclassname');
				$studentInfo['new_student_status'] = 0;//已经选择班级的学生状态
				$this->post_new_student($studentInfo);
				
				
				$classType = $this->r('class_type');
				//统计人数  stu_new_num +1
				if($this->r('class_type')){
					$zoneCenterInfo['center_id'] = $this->r('center_id');
					$zoneCenterInfo['zone_id'] = $this->r('zone_id');
					$statHandler->stat_zone_center($zoneCenterInfo, 'stu_new_num');
				}
				break;
				
			case 'edit':
				
				$studentInfo = array();
				
				$studentInfo['user_id'] = $this->r('user_id');
				
				if($this->r('nickname')){
					$studentInfo['nickname'] = $this->r('nickname');
				}
				$studentInfo['realname'] = $this->r('realname');
				$studentInfo['gender'] = $this->r('gender');
				$studentInfo['email'] = $this->r('email');
				$studentInfo['grade'] = $this->r('grade');
				$studentInfo['school_name'] = $this->r('schoolName');
				$studentInfo['tel'] = $this->r('tel');
				
				$studentInfo['note'] = $this->r('note');
				$this->post_edit_student($studentInfo);
				break;
			case 'add_small_class':
				$this->add_small_class();
				break;
			case 'batch_add_small_class':
				$stuInfo = $this->r('stus_info');
//				$zoneCenterInfo['center_id'] = $this->r('center_id');
//				$zoneCenterInfo['zone_id'] = $this->r('zone_id');
//				$num = count($stuInfo);
//				$statHandler->stat_zone_center($zoneCenterInfo, $statField='stu_new_num',true,$num);
				$this->batch_add_small_class();
				break;
			case 'change_small_class':
				$classStuId = $this->r('class_stu_id');
				$studentHandler->stat_lost_student_num($classStuId);
//				$studentHandler->stat_add_student_num($classStuId);
				$this->update_small_class();
				break;
		}
		
	}
		public function get_student_info(){
			$userId = $this->r('user_id');
			$this->db->sql = <<<SQL
										select tbluser.username,tbluser.realname,tbluser.nickname,tbluser.gender,tbluser.email,tbluser.tel,
										tblstudent.grade,tblstudent.school_name
										from tbluser 
										left join tblstudent on tbluser.id=tblstudent.user_id
										where tbluser.id=$userId;
SQL;
			$this->db->Queryone();
			$this->b['user_info'] = $this->db->rs;
		}
		
	private function post_new_student($studentInfo){
		 require_once (dirname(__FILE__)."/../include/stat.php" );
		 $userHandler = new user_handler();
 		$stat = new statManager();
 		$month = intval(date('m'));
		$year= intval(date('Y'));
		//先添加学生信息
		$insertUser = array(
			'username'=>$studentInfo['username'],
			'realname'=>$studentInfo['realname'],
			'nickname'=>$studentInfo['nickname'],
			'gender'=>$studentInfo['gender'],
			'passwd'=>'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',//默认123456
			'usr_type'=>1,//学生是1
			'reg_time'=>'now()',
			'tel'=>$studentInfo['tel'],
			'email'=>$studentInfo['email'],
			'note'=>$studentInfo['note'],
		);
		
		$insertUserResult = $this->db->Insert('tbluser' , $insertUser);
					
		$userId = $this->db->Last_id();

			
		if($insertUserResult){//如果用户表插入成功，则继续插入学生表
			$insertStudent = array(
				'user_id'=>$this->db->Last_id(),
				'center_id'=>$studentInfo['center_id'],
				'zone_id'=>$studentInfo['zone_id'],
				'creator'=>$this->vr['id'],
				'creator_name'=>$this->vr['username'],
				'create_date'=>'now()',
				'grade'=>$studentInfo['grade'],
				'school_name'=>$studentInfo['school_name'],
				'new_student_status'=>$studentInfo['new_student_status']
			);
			
		
			$insertStudentResult =$userHandler->add_table_base_info($table='tblstudent', $insertStudent);
			if($insertStudentResult){
				$student_id = $insertStudentResult;
				$classType = $studentInfo['class_type'];
				$classTypeArr = explode("_", $classType);
				$num = count($classTypeArr);
				if($num==1){
				//如果选择大班，则添加大班信息
					if($classTypeArr[0] == 1){
						$class_id = $studentInfo['class_id'];
//						echo 'class_id:'.$class_id;
						$insertClassStudent = array(
							'class_id'=>$class_id,
							'student_id'=>$student_id,
							'creator'=>$this->vr['id'],
							'creator_name'=>$this->vr['username'],
							'status'=>1,
							'create_date'=>'now()',
						);
						//插入学生记录
						$insertClassStudentResult =$userHandler->add_table_base_info($table='tblclass2student', $insertClassStudent);
						$stat->update( 'student', 'action' , array( 'student_id'=>$student_id,'action_obj'=>$class_id,'action_date'=>date("Y-m-d H:i:s"),'action'=> 'create_big_class_stu' )); 
						
						/**
						 * 查询class_id 对应的teacher_user_id
						 */
						$sql = 'select tblteacher.user_id as teacher_user_id from tblclass2teacher 
									left join tblteacher on tblclass2teacher.teacher_id=tblteacher.id
									where tblclass2teacher.class_id='.$class_id;
						$this->db->sql = $sql;
						$this->db->Query();
						$teacherUserIds = $this->db->rs;
						
						foreach ($teacherUserIds as $key=>$value){
							//插入学生记录
							$day = date('Y-m-d');
							$dayData = array('student_id' =>$userId,'teacher_id'=>$value['teacher_user_id'],'class_id'=>$class_id,'day' =>$day,'work_total_count'=>0);
							$stat->update( 'student', 'total', $dayData);
						}
						
						//插入大班学生统计  
						$day = date('Y-m-d');
						$zoneDayData = array('day'=>$day,'zone_id'=>$this->r('zone_id'),'stu_new_big_count'=>1);	
						$stat->update('zone','total',$zoneDayData); 
						
						$centerDayData =array('day'=>$day,'center_id'=>$this->r('center_id'),'stu_new_big_count'=>1);	
						$stat->update('center','total',$centerDayData); 
						/**
						 * 大班人数统计  +1
						 * @var unknown_type
						 */
						$sql = 'select tbluser.id,tblclass2teacher.teacher_id from 
									tblclass2teacher 
									left join tblteacher on tblteacher.id=tblclass2teacher.teacher_id
									left join tbluser on tbluser.id=tblteacher.user_id
									where tblclass2teacher.class_id='.$studentInfo['class_id'];
						$this->db->sql = $sql;
						$this->db->Query();
						$rsTeacher = $this->db->rs;

						if(count($rsTeacher)>0){
							foreach ($rsTeacher as $key=>$value){
		 						$data = array ('teacher_id' =>$value['id'],'year'=>$year,'month' =>$month,'stu_big_count' =>'1','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id') );
		  						$stat->update( 'teacher', 'total', $data);
							}
						}
					
  										
						if($insertClassStudentResult){
							$this->b['flag'] = true;
							$this->b['user_id'] = $userId;
							$this->b['student_id'] = $student_id;
							$this->b['sc'] = 200;
						}else{
							$this->b['flag'] = false;
							$this->b['reason'] = 'insert class2student failed';
							$this->b['sc'] = 401;
						}
						
					//如果选择小班，则根据所选老师，创建小班，然后添加信息
					}else if($classTypeArr[0] == 2){
						/**
						 * 一个老师只能创建一个1V1 班级  首先要判断
						 */
						$teacherList =$studentInfo['teacher_list'];
						$teacherClassInfo = array();
						$classInfo = array();
						$student =array();
						foreach($teacherList as $key=>$value){
							/**
							 * 查询判断 是否存在某一个老师建立1V1班级
							 */
							$teacherClassInfo= array(
								'center_id'=>$studentInfo['center_id'],
								'zone_id'=>$studentInfo['zone_id'],
								'class_name'=>$value['name'],
								'class_instruction'=>$studentInfo['username'].'的1对1教学',
								'creator'=>$this->vr['id'],
								'creator_name'=>$this->vr['username'],
								'class_type'=>2,
								'create_date'=>'now()'
							);
							
							$zoneId = $studentInfo['zone_id'];
							$teacherId = $value['id'];
							$teacherHandler = new teacher_handler();
							$queryTeacher = $teacherHandler->get_teacher_class_id($teacherId, 2, $zoneId);
							if(count($queryTeacher)>0){
									$class_id = $queryTeacher[0]['class_id'];
							}else{
									$insertClassResult =$userHandler->add_table_base_info($table='tblclass', $teacherClassInfo);
								//插入统计 小班统计： stat_center stat_zone
								$day = date('Y-m-d');
								$zoneDayData = array('day'=>$day,'zone_id'=>$this->r('zone_id'),'class_small_count'=>1);	
								$stat->update('zone','total',$zoneDayData); 
								
								$centerDayData =array('day'=>$day,'center_id'=>$this->r('center_id'),'class_small_count'=>1);	
								$stat->update('center','total',$centerDayData); 
								
								
								if($insertClassResult){
									$class_id = $insertClassResult;
								}else{
									$this->b['flag'] = false;
									$this->b['reason'] = 'insert tblclass  relation failed';
									$this->b['sc'] = 400;
									return;
								}
							}
								/**
								 * 如果某一个老师已经创建1V1 班级，则不创建
								 */
								$classInfo = array(
										'class_id' =>$class_id,
										'teacher_id'=>$value['id'],
										'creator'=>$this->vr['id'],
										'creator_name'=>$this->vr['username'],
										'create_date'=>'now()'
								);
								
								
								$student = array(
										'class_id' =>$class_id,
										'student_id'=>$student_id,
										'creator'=>$this->vr['id'],
										'creator_name'=>$this->vr['username'],
										'status'=>1,
										'create_date'=>'now()'
								);
								$sql = 'SELECT count(*) as num,tblteacher.user_id as teacher_user_id from tblclass2teacher 
											LEFT JOIN tblclass ON tblclass.id=tblclass2teacher.class_id 
											LEFT JOIN tblteacher ON tblteacher.id=tblclass2teacher.teacher_id 
											where tblclass.class_type=2 and tblclass2teacher.class_id='.$class_id.' and tblclass2teacher.teacher_id='.$value['id'];
								$this->db->sql = $sql;
								$this->db->Query();
								$rs = $this->db->rs;
								if($rs[0]['num']){//查询到该老师已经建立1V1 班级
										$teacherUserId = $rs[0]['teacher_user_id'];
										$rsClass2Stu =$userHandler->add_table_base_info($table='tblclass2student', $student);
										$stat->update( 'student', 'action' , array( 'student_id'=>$student_id,'action_obj'=>$class_id,'action_date'=>date("Y-m-d H:i:s"),'action'=> 'create_small_class_stu' )); 
										
										//插入小班学生统计  
										$day = date('Y-m-d');
										$zoneDayData = array('day'=>$day,'zone_id'=>$this->r('zone_id'),'stu_new_small_count'=>1);	
										$stat->update('zone','total',$zoneDayData); 
										
										$centerDayData =array('day'=>$day,'center_id'=>$this->r('center_id'),'stu_new_small_count'=>1);	
										$stat->update('center','total',$centerDayData); 
	
											/**
											 * 小班人数+1
											 * @var unknown_type
											 */
											$sql = 'select user_id from tblteacher where id='.$value['id'];
											$this->db->sql = $sql;
											$this->db->Queryone();
											$rsTeacher = $this->db->rs;
											$month = intval(date('m'));
//	 										$data = array ('teacher_id' =>$rsTeacher['user_id' ],'class_count' =>'1' ,'month' =>$month,'small_class_count' =>'1','stu_small_count'=>'1' );
	 										$data = array ('teacher_id' =>$rsTeacher['user_id' ] ,'year'=>$year,'month' =>$month,'stu_small_count'=>'1','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id') );
	  										$stat->update( 'teacher', 'total', $data);
										if($rsClass2Stu){
												$this->b['flag'] = true;
												$this->b['sc'] = 200;
										}else{
											$this->b['flag'] = false;
											$this->b['reason'] = 'insert tblclass2teacher  relation failed';
											$this->b['sc'] = 400;
										}
									
								}else{
									$result =$userHandler->add_table_base_info($table='tblclass2teacher', $classInfo);
									if($result){
										$rsClass2Stu =$userHandler->add_table_base_info($table='tblclass2student', $student);
										$stat->update( 'student', 'action' , array( 'student_id'=>$student_id,'action_obj'=>$class_id,'action_date'=>date("Y-m-d H:i:s"),'action'=> 'create_small_class_stu' )); 
											/**
											 * 小班数+1 小班人数+1
											 * @var unknown_type
											 */
											$sql = 'select user_id from tblteacher where id='.$value['id'];
											$this->db->sql = $sql;
											$this->db->Queryone();
											$rsTeacher = $this->db->rs;
	 										$data = array ('teacher_id' =>$rsTeacher['user_id' ] ,'year'=>$year,'month' =>$month,'small_class_count' =>'1','stu_small_count'=>'1','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id') );
	  										$stat->update( 'teacher', 'total', $data);
										
	  										
		  									//插入小班学生统计  
											$day = date('Y-m-d');
											$zoneDayData = array('day'=>$day,'zone_id'=>$this->r('zone_id'),'stu_new_small_count'=>1);	
											$stat->update('zone','total',$zoneDayData); 
											
											$centerDayData =array('day'=>$day,'center_id'=>$this->r('center_id'),'stu_new_small_count'=>1);	
											$stat->update('center','total',$centerDayData); 
										
										if($rsClass2Stu){
												$this->b['flag'] = true;
												$this->b['sc'] = 200;
										}else{
											$this->b['flag'] = false;
											$this->b['reason'] = 'insert tblclass2teacher  relation failed';
											$this->b['sc'] = 400;
										}
									}else{
										$this->b['flag'] = false;
										$this->b['reason'] = 'insert tblclass2teacher  relation failed';
										$this->b['sc'] = 400;
									}
								}
								
							//查询小班老师 的teacher_user_id  插入统计信息	
							$sql = 'SELECT tblteacher.user_id as teacher_user_id from tblclass2teacher 
										LEFT JOIN tblclass ON tblclass.id=tblclass2teacher.class_id 
										LEFT JOIN tblteacher ON tblteacher.id=tblclass2teacher.teacher_id 
										where tblclass.class_type=2 and tblclass2teacher.class_id='.$class_id.' and tblclass2teacher.teacher_id='.$value['id'];
							$this->db->sql = $sql;
							$this->db->Queryone();
							$teacherUserIdSmall = $this->db->rs;	
							//插入学生记录
							$day = date('Y-m-d');
							$dayData = array('student_id' =>$userId,'teacher_id'=>$teacherUserIdSmall['teacher_user_id'],'class_id'=>$class_id,'day' =>$day,'work_total_count'=>0);
							$stat->update( 'student', 'total', $dayData);
							
								
						}
					}else if($classTypeArr[0] == 0){
						$stat->update( 'student', 'action' , array( 'student_id'=>$student_id,'action_obj'=>$class_id,'action_date'=>date("Y-m-d H:i:s"),'action'=> 'create_no_class_stu' )); 
						if($insertStudentResult){
								$this->b['user_id'] = $userId;
								$this->b['student_id'] = $student_id;
								//为加入班级的学生状态
								$this->change_student_status($student_id,1);
								$this->b['flag'] = true;
								$this->b['sc'] = 200;
						}else{
							$this->b['flag'] = false;
							$this->b['reason'] = 'insert class2student failed';
							$this->b['sc'] = 401;
						}
					}
					
				}else if($num==2) {
						$class_id = $studentInfo['class_id'];
						$insertClassStudent = array(
							'class_id'=>$class_id,
							'student_id'=>$student_id,
							'creator'=>$this->vr['id'],
							'creator_name'=>$this->vr['username'],
							'status'=>1,
							'create_date'=>'now()',
						);
						/**
						 * 
						 * 大班人数统计  +1
						 * @var unknown_type
						 */
						$sql = 'select tbluser.id,tblclass2teacher.teacher_id from 
									tblclass2teacher 
									left join tblteacher on tblteacher.id=tblclass2teacher.teacher_id
									left join tbluser on tbluser.id=tblteacher.user_id
									where tblclass2teacher.class_id='.$studentInfo['class_id'];
						$this->db->sql = $sql;
						$this->db->Query();
						$rsTeacher = $this->db->rs;
						if(count($rsTeacher)>0){
							foreach ($rsTeacher as $key=>$value){
		 						$data = array ('teacher_id' =>$value['id'],'year'=>$year,'month' =>$month,'stu_big_count' =>'1','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id') );
		  						$stat->update( 'teacher', 'total', $data);
							}
						}
						
						
						/**
						 * 查询class_id 对应的teacher_user_id
						 */
						$sql = 'select tblteacher.user_id as teacher_user_id from tblclass2teacher 
									left join tblteacher on tblclass2teacher.teacher_id=tblteacher.id
									where tblclass2teacher.class_id='.$studentInfo['class_id'];
						$this->db->sql = $sql;
						$this->db->Query();
						$teacherUserIds = $this->db->rs;
						
						foreach ($teacherUserIds as $key=>$value){
							//插入学生记录
							$day = date('Y-m-d');
							$dayData = array('student_id' =>$userId,'teacher_id'=>$value['teacher_user_id'],'class_id'=>$class_id,'day' =>$day,'work_total_count'=>0);
							$stat->update( 'student', 'total', $dayData);
						}
						
						$insertClassStudentResult = $userHandler->add_table_base_info($table='tblclass2student', $insertClassStudent);
						$stat->update( 'student', 'action' , array( 'student_id'=>$student_id,'action_obj'=>$class_id,'action_date'=>date("Y-m-d H:i:s"),'action'=> 'create_big_class_stu' )); 
						    //插入大班学生统计 
                          $day = date('Y-m-d' );
                          $zoneDayData = array ('day' =>$day,'zone_id' =>$this->r('zone_id'), 'stu_new_big_count' =>1);          
                          $stat->update( 'zone', 'total',$zoneDayData);
                                                                        
                          $centerDayData =array ('day' =>$day,'center_id' =>$this->r('center_id'), 'stu_new_big_count' =>1);  
                          $stat->update( 'center', 'total',$centerDayData); 
						
						
						if($insertClassStudentResult){
							$teacherList =$studentInfo['teacher_list'];
							$teacherClassInfo = array();
							$classInfo = array();
							$student =array();
							foreach($teacherList as $key=>$value){
								/**
								 * 查询判断 是否存在某一个老师建立1V1班级
								 */
								$teacherClassInfo= array(
									'center_id'=>$studentInfo['center_id'],
									'zone_id'=>$studentInfo['zone_id'],
									'class_name'=>$value['name'],
									'class_instruction'=>$studentInfo['username'].'的1对1教学',
									'creator'=>$this->vr['id'],
									'creator_name'=>$this->vr['username'],
									'class_type'=>2,
									'create_date'=>'now()'
								);
								
								$zoneId = $studentInfo['zone_id'];
								$teacherId = $value['id'];
								$teacherHandler = new teacher_handler();
								$queryTeacher = $teacherHandler->get_teacher_class_id($teacherId, 2, $zoneId);
								if(count($queryTeacher)>0){
										$class_id = $queryTeacher[0]['class_id'];
								}else{
									$insertClassResult = $userHandler->add_table_base_info($table='tblclass', $teacherClassInfo);
									
								//插入统计 小班统计： stat_center stat_zone
								$day = date('Y-m-d');
//								$zoneDayData = array('day'=>$day,'zone_id'=>$studentInfo['zone_id'],'class_small_count'=>1,'class_total_count'=>1);	
								$zoneDayData = array('day'=>$day,'zone_id'=>$this->r('zone_id'),'class_small_count'=>1);	
								$stat->update('zone','total',$zoneDayData); 
								
								$centerDayData =array('day'=>$day,'center_id'=>$this->r('center_id'),'class_small_count'=>1);	
//								$centerDayData =array('day'=>$day,'center_id'=>$studentInfo['center_id'],'class_small_count'=>1,'class_total_count'=>1);	
								$stat->update('center','total',$centerDayData); 
									
									
								if($insertClassResult){
										$class_id = $insertClassResult;
									}else{
										$this->b['flag'] = false;
										$this->b['reason'] = 'insert tblclass  relation failed';
										$this->b['sc'] = 400;
										return;
									}
								}
									/**
									 * 如果某一个老师已经创建1V1 班级，则不创建
									 */
									$classInfo = array(
											'class_id' =>$class_id,
											'teacher_id'=>$value['id'],
											'creator'=>$this->vr['id'],
											'creator_name'=>$this->vr['username'],
											'create_date'=>'now()'
									);
									
									
									$student = array(
											'class_id' =>$class_id,
											'student_id'=>$student_id,
											'creator'=>$this->vr['id'],
											'creator_name'=>$this->vr['username'],
											'status'=>1,
											'create_date'=>'now()'
									);
									$sql = 'SELECT count(*) as num from tblclass2teacher LEFT JOIN tblclass ON tblclass.id=tblclass2teacher.class_id where tblclass.class_type=2 and tblclass2teacher.class_id='.$class_id.' and tblclass2teacher.teacher_id='.$value['id'];
									$this->db->sql = $sql;
									$this->db->Query();
									$rs = $this->db->rs;
									if($rs[0]['num']){
											$rsClass2Stu = $userHandler->add_table_base_info($table='tblclass2student', $student);
											$stat->update( 'student', 'action' , array( 'student_id'=>$student_id,'action_obj'=>$class_id,'action_date'=>date("Y-m-d H:i:s"),'action'=> 'create_small_class_stu' )); 

											 //插入小班学生统计 
                                             $day = date('Y-m-d' );
                                             $zoneDayData = array ('day' =>$day,'zone_id' =>$this->r('zone_id'), 'stu_new_small_count' =>1);       
                                             $stat->update( 'zone', 'total',$zoneDayData);
                                                                                                                       
                                              $centerDayData =array ('day' =>$day,'center_id' =>$this->r('center_id'), 'stu_new_small_count' =>1);           
                                              $stat->update( 'center', 'total',$centerDayData); 
                                              
											/**
											 * 小班人数+1
											 * @var unknown_type
											 */
											$sql = 'select user_id from tblteacher where id='.$value['id'];
											$this->db->sql = $sql;
											$this->db->Queryone();
											$rsTeacher = $this->db->rs;
											$month = intval(date('m'));
//	 										$data = array ('teacher_id' =>$rsTeacher['user_id' ],'class_count' =>'1' ,'month' =>$month,'small_class_count' =>'1','stu_small_count'=>'1' );
	 										$data = array ('teacher_id' =>$rsTeacher['user_id' ] ,'year'=>$year,'month' =>$month,'center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id'),'stu_small_count'=>'1' );
	  										$stat->update( 'teacher', 'total', $data);
											
											
											
											if($rsClass2Stu){
													$this->b['flag'] = true;
													$this->b['sc'] = 200;
											}else{
												$this->b['flag'] = false;
												$this->b['reason'] = 'insert tblclass2teacher  relation failed';
												$this->b['sc'] = 400;
											}
										
									}else{
										$result = $userHandler->add_table_base_info($table='tblclass2teacher', $classInfo);
										if($result){
											$rsClass2Stu = $userHandler->add_table_base_info($table='tblclass2student', $student);
											$stat->update( 'student', 'action' , array( 'student_id'=>$student_id,'action_obj'=>$class_id,'action_date'=>date("Y-m-d H:i:s"),'action'=> 'create_small_class_stu_stu' )); 
											
											 //插入小班学生统计 
                                             $day = date('Y-m-d' );
                                             $zoneDayData = array ('day' =>$day,'zone_id' =>$this->r('zone_id'), 'stu_new_small_count' =>1);       
                                             $stat->update( 'zone', 'total',$zoneDayData);
                                                                                                                       
                                              $centerDayData =array ('day' =>$day,'center_id' =>$this->r('center_id'),  'stu_new_small_count' =>1);           
                                              $stat->update( 'center', 'total',$centerDayData); 
											/**
											 * 小班数+1 小班人数+1
											 * @var unknown_type
											 */
											$sql = 'select user_id from tblteacher where id='.$value['id'];
											$this->db->sql = $sql;
											$this->db->Queryone();
											$rsTeacher = $this->db->rs;
											$month = intval(date('m'));
	 										$data = array ('teacher_id' =>$rsTeacher['user_id' ],'class_count' =>'1' ,'year'=>$year,'month' =>$month,'small_class_count' =>'1','stu_small_count'=>'1','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id') );
//	 										$data = array ('teacher_id' =>$rsTeacher['user_id' ] ,'month' =>$month,'stu_small_count'=>'1' );
	  										$stat->update( 'teacher', 'total', $data);
											
											
											if($rsClass2Stu){
													$this->b['flag'] = true;
													$this->b['sc'] = 200;
											}else{
												$this->b['flag'] = false;
												$this->b['reason'] = 'insert tblclass2teacher  relation failed';
												$this->b['sc'] = 400;
											}
										}else{
											$this->b['flag'] = false;
											$this->b['reason'] = 'insert tblclass2teacher  relation failed';
											$this->b['sc'] = 400;
										}
									}
									
									
								//查询小班老师 的teacher_user_id  插入统计信息	
								$sql = 'SELECT tblteacher.user_id as teacher_user_id from tblclass2teacher 
											LEFT JOIN tblclass ON tblclass.id=tblclass2teacher.class_id 
											LEFT JOIN tblteacher ON tblteacher.id=tblclass2teacher.teacher_id 
											where tblclass.class_type=2 and tblclass2teacher.class_id='.$class_id.' and tblclass2teacher.teacher_id='.$value['id'];
								$this->db->sql = $sql;
								$this->db->Queryone();
								$teacherUserIdSmall = $this->db->rs;	
								//插入学生记录
								$day = date('Y-m-d');
								$dayData = array('student_id' =>$userId,'teacher_id'=>$teacherUserIdSmall['teacher_user_id'],'class_id'=>$class_id,'day' =>$day,'work_total_count'=>0);
								$stat->update( 'student', 'total', $dayData);
							
							}
						}else{
							$this->b['flag'] = false;
							$this->b['reason'] = 'insert class2student failed';
							$this->b['sc'] = 401;
						}
				}

			}else{
				$this->b['flag'] = false;
				$this->b['reason'] = 'insert student failed';
				$this->b['sc'] = 401;
			}
			
		}else{
			$this->b['flag'] = false;
			$this->b['reason'] = 'insert user failed';
			$this->b['sc'] = 401;
		}
	}
	
	//学生加入班级，修改tblstudent   new_student_status 状态  0:表示学生已经加入班级 1:无班级新学生
	private function change_student_status($student_id,$status){
		$sql = <<<SQL
		update tblstudent set new_student_status=$status where id="$student_id";
SQL;
		$this->db->sql = $sql;
		$this->db->ExecuteSql();
	}
	
	private function post_edit_student($studentInfo){
		$condition_user = 'id='.$studentInfo['user_id'];
		$condition_student = 'user_id='.$studentInfo['user_id'];
		$user['realname'] = $studentInfo['realname'];
		$user['email'] = $studentInfo['email'];
		$user['gender'] = $studentInfo['gender'];
		$user['tel'] = $studentInfo['tel'];
		if(isset($studentInfo['nickname'])){
			$user['nickname'] = $studentInfo['nickname'];
		}
		$this->db->Update('tbluser', $user,$condition_user);
		$rs1 = $this->db->rs;
//		echo $this->db->sql;
		$student['school_name'] = $studentInfo['school_name'];
		$student['grade'] = $studentInfo['grade'];
		$this->db->Update('tblstudent', $student,$condition_student);
		$rs2 = $this->db->rs;
		if($rs1&&$rs2){
			$this->b['flag'] = true;
			$this->b['sc'] = 200;
		}else{
			if($rs1==false&&$rs2){
				$this->b['flag'] = false;
				$this->b['reason'] = 'update user failed';
				$this->b['sc'] = 401;
			}else if($rs2==false&&rs1){
				$student['user_id'] = $studentInfo['user_id'];
				$this->db->insert('tblstudent', $student);
				$rs3 = $this->db->rs;
				if($rs3==''){
					$this->b['flag'] = true;
					$this->b['sc'] = 200;
				}else{
					$this->b['flag'] = false;
					$this->b['reason'] = 'update student failed';
					$this->b['sc'] = 401;
				}
			}else{
				$this->b['flag'] = false;
				$this->b['reason'] = 'update user and student failed';
				$this->b['sc'] = 401;
			}
		}
	}
	
	private function update_class_stu($student){
		require_once (dirname(__FILE__)."/../include/stat.php" );
 		$stat = new statManager();
 		$day = date('Y-m-d');
 		$month = intval(date('m'));
		$year = intval(date('Y'));
		
		
		//退出班级操作 stat_zone stat_center 需要统计
 		$sqlTeacherUserId ='select tblteacher.user_id as teacher_user_id from tblclass2student
											left join tblclass on tblclass2student.class_id=tblclass.id
											left join tblclass2teacher on tblclass2teacher.class_id=tblclass.id
											left join tblteacher on tblclass2teacher.teacher_id=tblteacher.id
											where tblclass2student.id='.$student['id']; 
 		
 		
 		$this->db->sql = $sqlTeacherUserId;
 		$this->db->Query();
 		$rsTeacherUserId = $this->db->rs;
 		if(count($rsTeacherUserId)>0){
 			foreach ($rsTeacherUserId as $key=>$value){
 				if(isset($value['teacher_user_id'])){ //如果存在教师userID
	 				$data = array('teacher_id'=>$value['teacher_user_id'],'year'=>$year,'month'=>$month,'stu_small_count'=>'-1','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id'));
					$stat->update('teacher', 'total', $data);
 				}
 			}
 		}
 		
 		
 // 统计stat_center stat_zone 不做统计
//		$zoneDayData = array('day'=>$day,'zone_id'=>$this->r('zone_id'),'stu_new_small_count'=>'-1');	
//		$centerDayData =array('day'=>$day,'center_id'=>$this->r('center_id'),'stu_new_small_count'=>'-1');	
//		$stat->update('zone','total',$zoneDayData); 
//		$stat->update('center','total',$centerDayData);
		
		//学生结课处理， 只针对1V1
		$table = 'tblclass2student';
//		$arr = array(
//			'class_id'=>'0'
//		);
		$condition = 'id='.$student['id'];
//		$this->db->Update($table, $arr,$condition);
		$this->db->delete($table, $condition);
		$rs = $this->db->rs;
		$flag = true;
		if($rs){
			/**
			 * 如果执行退出班级操作：即class_id=0 ,
			 * 该学生如果不在其他班中，则属于过往学生
			 * 检查该学生是否在大班中，是否在小班中
			 */
				$sql = 'select student_id from tblclass2student where id='.$student['id'];
				$this->db->sql = $sql;
				$this->db->Queryone();
				$rs = $this->db->rs;
				$studentId = $rs['student_id'];
				if($this->r('class_type')=='1'){
					$bigSql = 'select count(*) as num from tblclass2student 
							left join tblclass on tblclass.id = tblclass2student.class_id
							where tblclass.class_type=1 and tblclass.end_date>now() and tblclass2student.student_id='.$studentId;
					$this->db->sql = $bigSql;
					$this->db->Queryone();
					$bigRs = $this->db->rs;
					if($bigRs['num']>0){
						$flag = $flag&&false;
					}else{
						$flag = $flag&&true;
					}
					
					
					if($flag){//如果没有在大班、小班当中 更新  数据统计
						$sql = 'select *  from tblstudent where id='.$studentId;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$studentInfo = $this->db->rs;
						
						$zoneDayData = array('day'=>$day,'zone_id'=>$studentInfo['zone_id'],'stu_lost_big_count'=>1);	
						$centerDayData = array('day'=>$day,'center_id'=>$studentInfo['center_id'],'stu_big_new_count'=>1);	
						
						$stat->update('zone','total',$zoneDayData); 
						$stat->update('center','total',$centerDayData); 
					}
				}
				
				
				if($this->r('class_type')=='2'){
					$smallSql = 'select count(*)  as num from tblclass2student 
							left join tblclass on tblclass.id = tblclass2student.class_id
							where tblclass.class_type=2 and tblclass2student.student_id='.$studentId;
					
					$this->db->sql = $smallSql;
					$this->db->Queryone();
					$smallRs = $this->db->rs;
					if($smallRs['num']>0){
						$flag = $flag&&false;
					}else{
						$flag = $flag&&true;
					}
					$day =date('Y-m-d');
					$month = intval(date('m'));
					if($flag){//如果没有在大班、小班当中 更新  数据统计
						$sql = 'select *  from tblstudent where id='.$studentId;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$studentInfo = $this->db->rs;
						
						$zoneDayData = array('day'=>$day,'zone_id'=>$studentInfo['zone_id'],'stu_lost_small_count'=>1);	
//						print_r($zoneDayData);
						$centerDayData = array('day'=>$day,'center_id'=>$studentInfo['center_id'],'stu_lost_small_count'=>1);	
						
						$stat->update('zone','total',$zoneDayData); 
						$stat->update('center','total',$centerDayData); 
					}
				}
				$this->b['flag'] = true;
				$this->b['sc'] = 200;
		}else{
			$this->b['flag'] = false;
			$this->b['reason'] = 'update tblclass2student failed';
			$this->b['sc'] = 401;
		}
		
	}
	
	private function add_class_student_history($classStuId){
			$sql = <<<SQL
						insert into tblclass2student_history (old_id,class_id,student_id,status,inactive_date,creator,creator_name,in_date,out_date) 
						(select tblclass2student.id,tblclass2student.class_id,tblclass2student.student_id,tblclass2student.status,tblclass2student.inactive_date,tblclass2student.creator,tblclass2student.creator_name,tblclass2student.create_date,now() from tblclass2student 
						where tblclass2student.id=$classStuId);
SQL;
			$this->db->sql = $sql;
			$this->db->ExecuteSql();
	}
	public function get_stu_center_zone(){
		$sql = 'select tblclass.center_id,tblcenter.center_name,tblclass.zone_id,tblcenterzone.zone_name,tblclass.id as class_id,tblclass.class_name,tblclass.class_type,tblclass.begin_date,tblclass.end_date  from tblclass2student 
					left join tblstudent on tblclass2student.student_id=tblstudent.id
					left join tblclass on tblclass2student.class_id=tblclass.id
					left join tblcenter on tblcenter.id=tblclass.center_id
					left join tblcenterzone on tblcenterzone.id=tblclass.zone_id
					where tblstudent.user_id='.$this->r('user_id').' and tblclass.center_id!="";';
		$this->db->sql = $sql;
		$this->db->Query();
		$this->b['list'] = $this->db->rs;
	}
	
	
	public function add_small_class(){
 		$stat = new statManager();
 		$studentHandler = new student_handler();
 		$statHandler = new stat_handler();
 		$userHandler = new user_handler();
 		$day = date('Y-m-d');
 		$month = intval(date('m'));
		$year = intval(date('Y'));
		/**
		 * 一个老师只能创建一个1V1 班级  首先要判断
		 */
		$teacherList =$this->r('teacher_list');
		$centerId = $this->r('center_id');
		$zoneId = $this->r('zone_id');
		$zoneCenterInfo['center_id'] = $centerId;
		$zoneCenterInfo['zone_id'] = $zoneId;
		$teacherClassInfo = array();
		$classInfo = array();
		$student =array();
//		print_r($teacherList);
		foreach($teacherList as $key=>$value){
			$sqlTeacher = 'select * from tblteacher where user_id='.$value['id'].' and tblteacher.zone_id='.$zoneId.' and tblteacher.center_id='.$centerId;
			$this->db->sql = $sqlTeacher;
			$this->db->Queryone();
			$teacherInfo = $this->db->rs;
			/**
			 * 查询判断 是否存在某一个老师建立1V1班级
			 */
			$teacherClassInfo= array(
				'center_id'=>$centerId,
				'zone_id'=>$zoneId,
				'class_name'=>$value['name'],
				'class_instruction'=>$this->r('student_username').'的1对1教学',
				'creator'=>$this->vr['id'],
				'creator_name'=>$this->vr['username'],
				'class_type'=>2,
				'create_date'=>'now()'
			);
			
			
			$teacherId = $teacherInfo['id'];
			$teacherHandler = new teacher_handler();
			$queryTeacher = $teacherHandler->get_teacher_class_id($teacherId, 2, $zoneId);
			
			if(count($queryTeacher)>0){
					$class_id = $queryTeacher[0]['class_id'];
			}else{
					
					$class_id = $userHandler->add_table_base_info('tblclass', $teacherClassInfo);
					//插入统计 小班统计： stat_center stat_zone
					$statHandler->stat_zone_center($zoneCenterInfo, 'class_small_count');
					if($class_id){
							$class_id = $class_id;
					}else{
							$this->b['flag'] = false;
							$this->b['reason'] = 'insert tblclass  relation failed';
							$this->b['sc'] = 400;
							return;
						}
					}
						/**
						 * 如果某一个老师已经创建1V1 班级，则不创建
						 */
							$classInfo = array(
									'class_id' =>$class_id,
									'teacher_id'=>$teacherInfo['id'],
									'creator'=>$this->vr['id'],
									'creator_name'=>$this->vr['username'],
									'create_date'=>'now()'
							);
							
								$student = array(
										'class_id' =>$class_id,
										'student_id'=>$this->r('student_id'), //学生表id
										'creator'=>$this->vr['id'],
										'creator_name'=>$this->vr['username'],
										'status'=>1,
										'create_date'=>'now()'
								);
								$sql = 'SELECT count(*) as num,tblteacher.user_id as teacher_user_id from tblclass2teacher 
											LEFT JOIN tblclass ON tblclass.id=tblclass2teacher.class_id 
											LEFT JOIN tblteacher ON tblteacher.id=tblclass2teacher.teacher_id 
											where tblclass.class_type=2 and tblclass2teacher.class_id='.$class_id.' and tblclass2teacher.teacher_id='.$teacherInfo['id'];
								$this->db->sql = $sql;
								$this->db->Query();
								$rs = $this->db->rs;
								/**
								 * 统计人数
								 */
									$studentId = $this->r('student_id');
									$zoneCenterInfo['center_id'] = $centerId;
									$zoneCenterInfo['zone_id'] = $zoneId;
									$num = $studentHandler->check_student_in_other_class($studentId, $class_id);
									if(!$num){
//										print_r($zoneCenterInfo);
										$statHandler->stat_zone_center($zoneCenterInfo, 'stu_new_num');
//										exit;
									}
								
								
								
								
								if($rs[0]['num']){//查询到该老师已经建立1V1 班级
										$teacherUserId = $rs[0]['teacher_user_id'];
										$rsClass2Stu = $userHandler->add_table_base_info('tblclass2student', $student);
										$stat->update( 'student', 'action' , array( 'student_id'=>$this->r('student_user_id'),'action_obj'=>$class_id,'action_date'=>date("Y-m-d H:i:s"),'action'=> 'create_small_class_stu' )); 
										
										
										//插入小班学生统计  
										$statHandler->stat_zone_center($zoneCenterInfo, 'stu_new_small_count');
											$sql = 'select user_id from tblteacher where id='.$teacherInfo['id'];
											$this->db->sql = $sql;
											$this->db->Queryone();
											$rsTeacher = $this->db->rs;
											$rsTeacher['center_id'] = $centerId;
											$rsTeacher['zone_id'] = $zoneId;
											
											//插入老师 小班学生
	  										$statHandler->stat_teacher($rsTeacher, 'stu_small_count');
										if($rsClass2Stu){
												$this->b['flag'] = true;
												$this->b['sc'] = 200;
										}else{
											$this->b['flag'] = false;
											$this->b['reason'] = 'insert tblclass2teacher  relation failed';
											$this->b['sc'] = 400;
										}
									
								}else{
									
									$result = $userHandler->add_table_base_info('tblclass2teacher', $classInfo);
									
									if($result){
										$rsClass2Stu = $userHandler->add_table_base_info('tblclass2student', $student);
										$stat->update( 'student', 'action' , array( 'student_id'=>$student_id,'action_obj'=>$class_id,'action_date'=>date("Y-m-d H:i:s"),'action'=> 'create_small_class_stu' )); 
											/**
											 * 小班数+1 小班人数+1
											 * @var unknown_type
											 */
											$sql = 'select user_id from tblteacher where id='.$teacherInfo['id'];
											$this->db->sql = $sql;
											$this->db->Queryone();
											$rsTeacher = $this->db->rs;
											$rsTeacher['center_id']  = $centerId;
											$rsTeacher['zone_id'] = $zoneId;
											$statHandler->stat_teacher($rsTeacher, 'stu_small_count');
	  										
		  									//插入小班学生统计  
											$statHandler->stat_zone_center($zoneCenterInfo, 'stu_new_small_count');
										
										if($rsClass2Stu){
												$this->b['flag'] = true;
												$this->b['sc'] = 200;
										}else{
											$this->b['flag'] = false;
											$this->b['reason'] = 'insert tblclass2teacher  relation failed';
											$this->b['sc'] = 400;
										}
									}else{
										$this->b['flag'] = false;
										$this->b['reason'] = 'insert tblclass2teacher  relation failed';
										$this->b['sc'] = 400;
									}
								}
								
							//查询小班老师 的teacher_user_id  插入统计信息	
							$sql = 'SELECT tblteacher.user_id as teacher_user_id from tblclass2teacher 
										LEFT JOIN tblclass ON tblclass.id=tblclass2teacher.class_id 
										LEFT JOIN tblteacher ON tblteacher.id=tblclass2teacher.teacher_id 
										where tblclass.class_type=2 and tblclass2teacher.class_id='.$class_id.' and tblclass2teacher.teacher_id='.$teacherInfo['id'];
							$this->db->sql = $sql;
							$this->db->Queryone();
							$teacherUserIdSmall = $this->db->rs;	
							//插入学生记录
							$studentInfo['user_id'] = $this->r('student_user_id');
							$studentInfo['teacher_user_id'] = $teacherUserIdSmall['teacher_user_id'];
							$studentInfo['class_id'] = $class_id; 
							$statHandler->stat_student($studentInfo);
							return $class_id;
						}
						
					
	}
	
	
	public function batch_add_small_class(){
		require_once (dirname(__FILE__)."/../include/stat.php" );
		$userHandler = new user_handler();
		$studentHandler = new student_handler();
		$statHandler = new stat_handler();
 		$stat = new statManager();
 		$day = date('Y-m-d');
 		$month = intval(date('m'));
		$year = intval(date('Y'));
		$studentsInfo =  $this->r('stus_info');
		if(count($studentsInfo)>0){
			foreach ($studentsInfo as $stu_k=>$stu_v){
				/**
				 * 一个老师只能创建一个1V1 班级  首先要判断
				 */
				$teacherList =$stu_v['teacher_list'];
				$teacherClassInfo = array();
				$classInfo = array();
				$student =array();
		//		print_r($teacherList);
				foreach($teacherList as $key=>$value){
					$userId = $value['id'];
					$zoneId = $stu_v['zone_id'];
					$centerId = $stu_v['center_id'];
					$sqlTeacher = <<<SQL
					  						 select tblteacher.* from tblteacher 
					 						 LEFT JOIN tblcenterzoneadmin ON tblteacher.user_id=tblcenterzoneadmin.user_id 
					   						where tblteacher.user_id=$userId and tblcenterzoneadmin.zone_id=$zoneId;
SQL;
//					$sqlTeacher = 'select * from tblteacher where user_id='.$value['id'].' and tblteacher.zone_id='.$stu_v['zone_id'].' and tblteacher.center_id='.$stu_v['center_id'];
					$this->db->sql = $sqlTeacher;
					$this->db->Queryone();
					$teacherInfo = $this->db->rs;
					/**
					 * 查询判断 是否存在某一个老师建立1V1班级
					 */
					$teacherClassInfo= array(
						'center_id'=>$stu_v['center_id'],
						'zone_id'=>$stu_v['zone_id'],
						'class_name'=>$value['name'],
						'class_instruction'=>$stu_v['student_username'].'的1对1教学',
						'creator'=>$this->vr['id'],
						'creator_name'=>$this->vr['username'],
						'class_type'=>2,
						'create_date'=>'now()'
					);
					$zoneId = $stu_v['zone_id'];
					$teacherId = $teacherInfo['id'];
					$teacherHandler = new teacher_handler();
					$queryTeacher = $teacherHandler->get_teacher_class_id($teacherId, 2, $zoneId);
					if(count($queryTeacher)>0){
							$class_id = $queryTeacher[0]['class_id'];
					}else{
							//插入统计 小班统计： stat_center stat_zone
								$day = date('Y-m-d');
								$zoneDayData = array('day'=>$day,'zone_id'=>$stu_v['zone_id'],'class_small_count'=>1);	
								$stat->update('zone','total',$zoneDayData); 
								$centerDayData =array('day'=>$day,'center_id'=>$stu_v['center_id'],'class_small_count'=>1);	
								$stat->update('center','total',$centerDayData); 
								
								$class_id = $userHandler->add_table_base_info('tblclass', $teacherClassInfo);
								if($class_id){
									$class_id = $class_id;
								}else{
									$this->b['flag'] = false;
									$this->b['reason'] = 'insert tblclass  relation failed';
									$this->b['sc'] = 400;
									return;
								}
							}
								/**
								 * 如果某一个老师已经创建1V1 班级，则不创建
								 */
									$classInfo = array(
											'class_id' =>$class_id,
											'teacher_id'=>$teacherInfo['id'],
											'creator'=>$this->vr['id'],
											'creator_name'=>$this->vr['username'],
											'create_date'=>'now()'
									);
									
										$student = array(
												'class_id' =>$class_id,
												'student_id'=>$stu_v['student_id'], //学生表id
												'creator'=>$this->vr['id'],
												'creator_name'=>$this->vr['username'],
												'status'=>1,
												'create_date'=>'now()'
										);
										$sql = 'SELECT count(*) as num,tblteacher.user_id as teacher_user_id from tblclass2teacher 
													LEFT JOIN tblclass ON tblclass.id=tblclass2teacher.class_id 
													LEFT JOIN tblteacher ON tblteacher.id=tblclass2teacher.teacher_id 
													where tblclass.class_type=2 and tblclass2teacher.class_id='.$class_id.' and tblclass2teacher.teacher_id='.$teacherInfo['id'];
										$this->db->sql = $sql;
										$this->db->Query();
										$rs = $this->db->rs;
//									echo '<pre>';
//									print_r($this->db);
//									exit;
										
										/**
										 * 统计人数
										 */
									$studentId = $stu_v['student_id'];
									$zoneCenterInfo['center_id'] = $stu_v['center_id'];
									$zoneCenterInfo['zone_id'] = $stu_v['zone_id'];
									$num = $studentHandler->check_student_in_other_class($studentId, $class_id);
									if(!$num){
											$statHandler->stat_zone_center($zoneCenterInfo, 'stu_new_num');
									}
										
										
					
										
										if($rs[0]['num']){//查询到该老师已经建立1V1 班级
												$teacherUserId = $rs[0]['teacher_user_id'];
												$rsClass2Stu = $userHandler->add_table_base_info('tblclass2student', $student);
												//更改学生状态 已加入班级
												$this->change_student_status($student['student_id'], 0);
												
												$stat->update( 'student', 'action' , array( 'student_id'=>$stu_v['student_user_id'],'action_obj'=>$class_id,'action_date'=>date("Y-m-d H:i:s"),'action'=> 'create_small_class_stu' )); 
												
												//插入小班学生统计  
												$day = date('Y-m-d');
												$zoneDayData = array('day'=>$day,'zone_id'=>$stu_v['zone_id'],'stu_new_small_count'=>1);	
												$stat->update('zone','total',$zoneDayData); 
												
												$centerDayData =array('day'=>$day,'center_id'=>$stu_v['center_id'],'stu_new_small_count'=>1);	
												$stat->update('center','total',$centerDayData); 
			
													/**
													 * 小班人数+1
													 * @var unknown_type
													 */
													$sql = 'select user_id from tblteacher where id='.$teacherInfo['id'];
													$this->db->sql = $sql;
													$this->db->Queryone();
													$rsTeacher = $this->db->rs;
													$month = intval(date('m'));
		//	 										$data = array ('teacher_id' =>$rsTeacher['user_id' ],'class_count' =>'1' ,'month' =>$month,'small_class_count' =>'1','stu_small_count'=>'1' );
			 										$data = array ('teacher_id' =>$rsTeacher['user_id' ] ,'year'=>$year,'month' =>$month,'stu_small_count'=>'1','center_id'=>$stu_v['center_id'],'zone_id'=>$stu_v['zone_id'] );
			  										$stat->update( 'teacher', 'total', $data);
												if($rsClass2Stu){
														$this->b['flag'] = true;
														$this->b['sc'] = 200;
												}else{
													$this->b['flag'] = false;
													$this->b['reason'] = 'insert tblclass2teacher  relation failed';
													$this->b['sc'] = 400;
												}
											
										}else{
											$result = $userHandler->add_table_base_info('tblclass2teacher', $classInfo);
											$this->b['class_info'] = $classInfo;
											if($result){
												$rsClass2Stu = $userHandler->add_table_base_info('tblclass2student', $student);
												//更改学生状态 已加入班级
												$this->change_student_status($student['student_id'], 0);
												$stat->update( 'student', 'action' , array( 'student_id'=>$student_id,'action_obj'=>$class_id,'action_date'=>date("Y-m-d H:i:s"),'action'=> 'create_small_class_stu' )); 
													/**
													 * 小班数+1 小班人数+1
													 * @var unknown_type
													 */
													$sql = 'select user_id from tblteacher where id='.$teacherInfo['id'];
													$this->db->sql = $sql;
													$this->db->Queryone();
													$rsTeacher = $this->db->rs;
			 										$data = array ('teacher_id' =>$rsTeacher['user_id' ] ,'year'=>$year,'month' =>$month,'small_class_count' =>'1','stu_small_count'=>'1','center_id'=>$stu_v['center_id'],'zone_id'=>$stu_v['zone_id'] );
			  										$stat->update( 'teacher', 'total', $data);
												
			  										
				  									//插入小班学生统计  
													$day = date('Y-m-d');
													$zoneDayData = array('day'=>$day,'zone_id'=>$stu_v['zone_id'],'stu_new_small_count'=>1);	
													$stat->update('zone','total',$zoneDayData); 
													
													$centerDayData =array('day'=>$day,'center_id'=>$stu_v['center_id'],'stu_new_small_count'=>1);	
													$stat->update('center','total',$centerDayData); 
												
												if($rsClass2Stu){
														$this->b['flag'] = true;
														$this->b['sc'] = 200;
												}else{
													$this->b['flag'] = false;
													$this->b['reason'] = 'insert tblclass2teacher  relation failed';
													$this->b['sc'] = 400;
												}
											}else{
												$this->b['flag'] = false;
												$this->b['reason'] = 'insert tblclass2teacher  relation failed';
												$this->b['sc'] = 400;
											}
										}
										
									//查询小班老师 的teacher_user_id  插入统计信息	
									$sql = 'SELECT tblteacher.user_id as teacher_user_id from tblclass2teacher 
												LEFT JOIN tblclass ON tblclass.id=tblclass2teacher.class_id 
												LEFT JOIN tblteacher ON tblteacher.id=tblclass2teacher.teacher_id 
												where tblclass.class_type=2 and tblclass2teacher.class_id='.$class_id.' and tblclass2teacher.teacher_id='.$teacherInfo['id'];
									$this->db->sql = $sql;
									$this->db->Queryone();
									$teacherUserIdSmall = $this->db->rs;	
									//插入学生记录
									$day = date('Y-m-d');
									$dayData = array('student_id' =>$stu_v['student_user_id'],'teacher_id'=>$teacherUserIdSmall['teacher_user_id'],'class_id'=>$class_id,'day' =>$day,'work_total_count'=>0);
									$stat->update( 'student', 'total', $dayData);
//									return $class_id;
								}
				
			}
		}
	}
	
	/**
	 * 小班更换班级
	 * 
	 * 				$student = array();
					$classStuId = $this->r('class_stu_id');
					$outClassId = $this->r('out_class_id');
					$inClassId = $this->r('in_class_id');
					$student = array();
					$student['id'] = $classStuId;	$student['class_id'] =$inClassId;
	 * 
	 */
	private function update_small_class(){
			require_once (dirname(__FILE__)."/../include/stat.php" );
	 		$stat = new statManager();
	 		$userHandler = new user_handler();
			$student['id'] = $this->r('class_stu_id');
			$student['class_id'] = $inClassId;
	 		$day = date('Y-m-d');
	 		$month = intval(date('m'));
			$year = intval(date('Y'));
	 		$classStuId = $student['id'];
			$table = 'tblclass2student';
			$whereArray['id'] = $classStuId;
			$userHandler->add_table_history_info($table, $whereArray, $operateStatus='0');
			$userHandler->remove_table_info($table, $whereArray);
			$inClassId = $this->add_small_class();//要保证先退出然后做添加操作  modify by 2014 3 18 原因是 在小班更换的时候 stu_new_count 没有加
			$rs = $this->db->rs;
		}
		
		//获取测试、作业知识点的统计
		public function get_student_knowledge_stat(){
				$knowledge = array();
				$userId= $this->r('user_id');
				$startTime = $this->r('start_time');
				$endTime = $this->r('end_time');
				$this->db->sql = <<<SQL
											select content,subject_id from	study_exercise where user_id=$userId and exam_type=1 and type=3 and log_time>=$startTime and log_time<=$endTime;
SQL;
				$this->db->Query();
				$rs = $this->db->rs;
				foreach ($rs as $key=>$value){
					$content = json_decode(base64_decode($value['content']),true);
					$subjectId = $value['subject_id'];
					$eduInfo = $this->get_edu_info($subjectId);
					$tblExamQuestionIndex = $eduInfo['exam_question_index'];
					foreach ($content as $k=>$v){
						$gid = $v['id'];
						if($v['dbtype']=='1'){
							$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
						}elseif($v['dbtype']=='2'){
							$dbJson = $this->query_curriculumndb();
							if($dbJson){
								$db = json_decode($dbJson,true);
								$this->switchDB($db['ip'],$db['name']);
							}
						}
						
						$this->db->sql = <<<SQL
													select zh_knowledge from $tblExamQuestionIndex where gid='$gid';
SQL;
						$this->db->Queryone();
						$rs = $this->db->rs;
						$knowledge[$k]['zh_knowledge'] = $rs['zh_knowledge']; //去除重复  知识点 题数
					}
				}
		}
}
?>