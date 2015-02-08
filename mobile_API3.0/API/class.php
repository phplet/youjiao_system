<?php
///////////////////////////////////////////////////////
// 中心（总校）接口
// by tonyjiang v1.0   @modify_by xk
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		
		public function doGET(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			$classHandler = new class_handler();
			$studentHandler = new student_handler();
			switch($action){
				case 'list':
					$fresh = $this->r('fresh');
					$condition = $this->r('condition');
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = $this->r('countperpage');
					$userType = $this->vr['usr_type'];
					$level = $this->vr['level'];
					$teacherName = $this->r();
					if(!$countPerPage){//如果没有分页参数，获取所有列表
						$result = $classHandler->get_class_list(null, null, $condition, $fresh, $userType, $level);
					}else{//如果有分页参数，获取当前数据列表
						$result = $classHandler->get_class_list($pageNo*$countPerPage, $countPerPage, $condition, $fresh, $userType, $level);
					}
						$this->b['list'] = $result['list'];
						$this->b['teacher'] = $result['teacher'];
						$this->b['student'] = $result['student'];
						$this->b['count'] = $result['count'];
						break;
					case 'name_list':
						$condition = $this->r('condition');
						$this->get_all_class_list($condition);
					break;
					
					
					case 'other_stu';
						$pageNo = intval($this->r('pageno')) - 1;
						$countPerPage = $this->r('countperpage');
						$condition = $this->r('condition');
						$centerId = $this->r('center_id');
						$zoneId = $this->r('zone_id');
						$flag = $this->r('flag')=='true'?true:false;//区分 未报班管理  和 班级管理 加入学生  显示列表
						if(!$countPerPage){//如果没有分页参数，获取所有列表
							$result = $studentHandler->get_no_class_student_list(null, null, $centerId, $zoneId, $condition,$flag);
						}else{//如果有分页参数，获取当前数据列表
							$result = $studentHandler->get_no_class_student_list($pageNo*$countPerPage,$countPerPage, $centerId, $zoneId, $condition,$flag);
						}
						
						$this->b['list'] = $result['list'];
						$this->b['count'] = $result['count'];
						break;
					case 'query_stu_class':
						$condition = $this->r('condition');
						$this->query_stu_class($condition);
						break;
					case 'other_Zonestu':
						$condition  = $this->r('condition');
						$centerId = $this->r('center_id');
						$zoneId = $this->r('zone_id');
						$result = $studentHandler->get_no_class_student_list(null, null, $centerId, $zoneId, $condition);
						$this->b['list'] = $result['list'];
						$this->b['count'] = $result['count'];
						break;
					case 'current_stu_class':
						$condition  = $this->r('condition');
						$this->get_current_stu_class($condition);
					break;
					case 'timing_do':
//						$this->create_expire_stu_stat();
						break;
						
			}
		}
		
		public function doPOST(){
			$userHandler = new user_handler();
			$classHandler = new class_handler();
			$teacherHandler = new teacher_handler();
			$statHandler = new stat_handler();
			$studentHandler = new student_handler();
			//如果没有登陆，则返回401
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			
			$action = $this->r('action');
			
			if($action == 'add'){
				$classInfo = array();
				$classInfo['center_id'] = $this->r('center_id');
				$classInfo['zone_id'] = $this->r('zone_id');
				$classInfo['class_name'] = $this->r('class_name');
				$classInfo['class_instruction'] = $this->r('class_instruction');
				$classInfo['begin_date'] = $this->r('begin_date');
				$classInfo['end_date'] = $this->r('end_date');
				$classInfo['num_max'] = $this->r('num_max');
				$classInfo['class_section'] = $this->r('class_section');
				$classInfo['teacher_list'] = $this->r('teacher_list');
				$creatorId = $this->vr['id'];
				$teacher_ids = explode('_' , $classInfo['teacher_list']);
				$rs = $classHandler->add_class($creatorId, $classInfo);
				$this->b['sc'] = $rs['sc'];
				$this->b['flag'] = $rs['flag'];
				$this->b['reason'] = $rs['reason'];
				foreach($teacher_ids as $teacher_id){
						$teacherBaseInfo = $teacherHandler->get_teacher_info($teacher_id);
						$teacherInfo[] = array(
							'user_id'=>$teacherBaseInfo['id'],
							'center_id'=>$classInfo['center_id'],
							'zone_id'=>$classInfo['zone_id']
						);
					}
					
				//老师统计
				$statHandler->stat_teacher($teacherInfo, $statField='big_class_count');
				//中心统计
				$statHandler->stat_zone_center($classInfo, $statField='class_new_big_count');

			}else if($action == 'edit'){
				
				$classInfo = array();
				
				$classInfo['id'] = $this->r('id');
				$classInfo['class_name'] = $this->r('class_name');
				$classInfo['class_section'] = $this->r('class_section');
				$classInfo['begin_date'] = $this->r('begin_date');
				$classInfo['end_date'] = $this->r('end_date');
				$classInfo['num_max'] = $this->r('num_max');
				$classInfo['teacher_list'] = $this->r('teacher_list');
				

				
				$classEndDate = strtotime($this->r('end_date'));
				$nowDate = strtotime(date('Y-m-d'));
				$this->post_modify_class($classInfo);
				$this->post_modify_class_teacher($classInfo['id'] , $classInfo['teacher_list']);
				if(($_REQUEST['fresh']=='0')&&($classEndDate-$nowDate)){
					$this->recover_expire_class();
				}

			}else if($action == 'delete'){
				$class_id = $this->r('id');
				$this->post_delete_class($class_id);
			}else if($action=='join'){
					$student = array();
					$zoneCenterInfo['center_id'] = $this->r('center_id');
					$zoneCenterInfo['zone_id'] = $this->r('zone_id');
					if(count($this->r('stus_info'))>0){ //未报班学生批量加入大班
						$student = $this->r('stus_info');
						$num = count($student);
						$statHandler->stat_zone_center($zoneCenterInfo, $statField='stu_new_num',true,$num);
						$this->join_class_student($student);
						return ;
					}
					$classStuId = $this->r('class_stu_id');
					$studentId = $this->r('student_id');
					$centerId = $this->r('center_id');
					$noneType = $this->r('nonetype');
					$zoneId = $this->r('zone_id');
					$classId = $this->r('class_id');
					$student[0]['center_id'] = $centerId;
					$student[0]['zone_id'] = $zoneId;
					$student[0]['student_id'] = $studentId;
					$student[0]['class_id'] = $classId;
					$student[0]['nonetype'] = $noneType;
					$student[0]['class_stu_id'] = $classStuId;
					$this->join_class_student($student);
			}else if($action=="change"){//更换班级
					$student = array();
					$classStuId = $this->r('class_stu_id');
					$outClassId = $this->r('out_class_id');
					$inClassId = $this->r('in_class_id');
					$student = array();
					$student['id'] = $classStuId;
					$student['class_id'] =$inClassId;
					$student['in_class_id'] = $inClassId;
					$student['out_class_id'] = $outClassId;
					$student['class_stu_id'] = $classStuId;
					
					
					$studentHandler->stat_lost_student_num($classStuId);
					
					$studentHandler->stat_add_student_num($classStuId);
					
					$rs = $this->change_class_student($student);
					
					$zoneCenterInfo['center_id'] = $this->r('center_id');
					$zoneCenterInfo['zone_id'] = $this->r('zone_id');
					
					
					/***
					 * @todo 更新班级 做数据统计
					 */
					
					$this->b['flag'] = $rs;
			}else if($action=="exit"){//退出班级
				$classStuId = $this->r('class_stu_id');
				$studentHandler->stat_lost_student_num($classStuId);
				$whereArray['id'] = $classStuId;
				$userHandler->add_table_history_info('tblclass2student', $whereArray, $operateStatus='0');
				$student =array();
				$rs = $userHandler->remove_table_info('tblclass2student', $whereArray);
				$this->b['flag'] = $rs;
			}else if($action=="end_class"){//
				$classId = $this->r('class_id');
				$teacherUserIds = $this->r('teacher_user_ids');
				$classInfo = $classHandler->get_class_info($classId);
				$classType = $classInfo['class_type'];
				$centerId = $classInfo['center_id'];
				$zoneId = $classInfo['zone_id'];
				//增加统计信息
				/**先进行统计
				 * @todo 统计流失学生人次数 人数 班级流失数
				 */
				$classHandler->stat_end_class($classId);		
				
//				$status = 1;
//				
//				$num = $teacherHandler->get_teacher_stu_num($classId, $classType, $status);
				
				
				
				$rsAdd = $classHandler->add_class_teacher_student_history($teacherUserIds, $classId);
				$rsRemove = $classHandler->remove_class_teacher_student($teacherUserIds, $classId);
				
				
				$this->b['flag'] = $rsAdd&&$rsRemove;
			}else if($action=='add_small_class'){
				$creatorId = $this->vr['id'];
				$teacherUserIds = $this->r('teacher_user_ids');
				$centerId = $this->r('center_id');
				$zoneId = $this->r('zone_id');
				
				$result = $classHandler->add_small_class($creatorId, $teacherUserIds, $centerId, $zoneId);
				$this->b['flag'] = $result;
			}
			
			
			
			
		}
		
		private function get_all_class_list($condition){
			$tables = array('tblClass');
			$tblClass = array(
				'tblclass',
				'center_id' , 'zone_id' , 'class_name' , 'class_instruction' , 'status' , 'inactive_date' , 'creator' , 
				'creator_name' , 'create_date' , 'class_type' , 'begin_date' , 'end_date' , 'num_max' , 'class_section'
			);
			$querySQL = 'SELECT * FROM tblclass';
			$queryCountSQL = 'SELECT COUNT(*) as count FROM tblclass';
		//制作where条件
			$where ='';
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
				$where = implode(' AND ',$resultArray);
			}
			if($where != ''){
				$querySQL .= ' WHERE '.$where;
				$queryCountSQL .= ' WHERE '.$where;
			}
			$this->db->sql = $querySQL;
			$this->db->Query();
			
			$this->b['list'] = $this->db->rs;
			
			$this->db->sql = $queryCountSQL;
			$this->db->Queryone();
			$this->b['count'] = $this->db->rs['count'];
			$this->b['sc'] = 200;
			return;
		}
		
		private function get_other_student_list($offset , $step , $condition){
			$tables = array('tblStudent' , 'tblClass2student' , 'tblUser','tblClass','tblCenterZone');
			$tblStudent = array(
				'tblstudent',
				'id as student_id' , 'center_id' , 'user_id' ,'school_name','grade','zone_id','new_student_status'
			);
			
			$tblClass2student = array(
				'tblclass2student',	
				'id as class_stu_id',
				'class_id'
			);
			
			$tblUser = array(
				'tbluser',
				'username' , 'realname' , 'gender' , 'last_login_time','email','tel','reg_time as create_date'
			);
			
			$tblClass = array(
				'tblclass',
				'class_type',
			);
			
			$tblCenterZone = array(
				'tblcenterzone',
				'zone_name'
			);
			$tblCondition = array(
				'tblstudent.id=tblclass2student.student_id',
				'tblstudent.user_id=tbluser.id',
				'tblclass.id=tblclass2student.class_id',
				'tblclass.zone_id=tblcenterzone.id'
			);
			
			//制作where条件
				$where ='';
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
							
						}else if(strpos($cdn1,'@') !== false){//模糊查询
							$cdnArray = explode('@' , $cdn1);//array('param1','value1');
							//查询条件所属表
							foreach($tables as $tableName){
								if(in_array($cdnArray[0] , $$tableName)){
									$tmp_tbl = $$tableName;
									$resultArray[] = $tmp_tbl[0].'.'.$cdnArray[0].' like "%'.$cdnArray[1].'%"';
									break;
								}
							}
							
						}else if(strpos($cdn1,'|') !== false){//不等于条件
							$cdnArray = explode('|' , $cdn1);//array('param1','value1');
													//查询条件所属表
							foreach($tables as $tableName){
								if(in_array($cdnArray[0] , $$tableName)){
									$tmp_tbl = $$tableName;
									$resultArray[] = $tmp_tbl[0].'.'.$cdnArray[0].'!="'.$cdnArray[1].'"';
									break;
								}
							}
						}
					}
					$where = implode(' AND ',$resultArray);
				}
				
				if($where != ''){
					$tblCondition['where'] = $where.' group by tblstudent.user_id order by tblstudent.create_date desc';
	//				$where = ' WHERE '.$where;
				}
				
//				if(!$offset && !$step){
//	//				$limit = '';
//				}else{
//					$tblCondition['limit'] = $offset.','.$step;
//	//				$limit = 'LIMIT '.$offset.','.$step;
//				}
				
				
				$rs = $this->db->withQueryMakerLeft($tblStudent , $tblClass2student , $tblUser ,$tblClass,$tblCenterZone,$tblCondition);
				$this->b['no_class_sql'] = $this->db->sql;
//				echo '<pre>';
//				print_r($rs);
				/**
				 * 数据筛选：排除还存在其他班级的学生
				 */
				
				if($this->r('noclass_stu')=='1'){
					$date = date('Y-m-d',(time()));
					foreach ($rs as $key=>$value){
							$sql = 'SELECT count(*) as num  FROM tblclass2student 
										LEFT JOIN tblclass ON tblclass2student.class_id=tblclass.id
										WHERE tblclass2student.student_id="'.$value['student_id'].'"';
							$sql1=$sql.' AND tblclass.end_date>="'.$date.'" AND tblclass.class_type=1'; //查询是否存在当前大班
							$sql11=$sql.' AND tblclass.end_date<"'.$date.'" AND tblclass.class_type=1'; //查询是否存在过往大班
							$sql2 = $sql. ' AND tblclass.class_type=2';//查询是否存在小班
							$this->db->sql = $sql1;
							$this->db->Queryone();
							$rsBig = $this->db->rs;
							//	去除当前大班学生
							if($rsBig['num']!='0'){
								unset($rs[$key]);
							}
							
							$this->db->sql = $sql11;
							$this->db->Queryone();
							$rsBigPass = $this->db->rs;
							//	去除过往大班学生
							if($rsBigPass['num']!='0'){
								unset($rs[$key]);
							}
							
							$this->db->sql = $sql2;
							$this->db->Queryone();
							$rsSmall= $this->db->rs;
							//	去除小班学生
							if($rsSmall['num']!='0'){
								unset($rs[$key]);
							}
					}
					//添加过往大班的学生
					$zoneId = $this->r('zone_id');
					$centerId = $this->r('center_id');
					$sqlExpireStu = <<<SQL
												SELECT tblclass2student.student_id,tblclass2student.id as class_stu_id,tblstudent.center_id,tbluser.id as user_id,tblstudent.school_name,tblstudent.grade,tblstudent.zone_id,tblclass2student.class_id,tblclass2student.status,tbluser.username,tbluser.realname,tbluser.last_login_time,tbluser.reg_time as create_date,tbluser.email,tbluser.tel
											FROM tblclass2student 
											LEFT JOIN tblstudent ON tblclass2student.student_id=tblstudent.id 
											LEFT JOIN tbluser ON tblstudent.user_id=tbluser.id 
											left join tblclass on tblclass2student.class_id=tblclass.id 
											WHERE tblclass.center_id="$centerId" AND tblclass.zone_id="$zoneId" 
											AND tblclass.class_type="1" AND tblclass.end_date<"$date" GROUP by tblclass2student.student_id;					
SQL;
					$this->db->sql = $sqlExpireStu;
					$this->db->Query();
					$rsStu = $this->db->rs;
					if(count($rsStu)>0){
						$rs = array_merge($rsStu,$rs);
					}
					
				}
				$this->b['list']  = array_slice($rs,$offset,$step);
				$this->b['count'] = count($rs);
				$this->b['sc'] = 200;
				return true;
		}
		
		private function post_modify_class($classInfo){
			$tableName = 'tblclass';
			$where = $tableName.'.id='.$classInfo['id'];
			$modifyInfo = array(
				'class_name'=>$classInfo['class_name'],
				'class_section'=>$classInfo['class_section'],
				'begin_date'=>$classInfo['begin_date'],
				'end_date'=>$classInfo['end_date'],
				'num_max'=>$classInfo['num_max']
			);
			$this->b['flag'] = $this->db->Update($tableName , $modifyInfo , $where);
			$this->b['sc'] = 200;
			return true;
		}
		
		private function post_delete_class($classid){
			$tableName = 'tblclass';
			$where = $tableName.'.id='.$classid;
			$this->b['flag'] = $this->db->delete($tableName,$where);
			$this->b['sc'] = 200;
			return true;
		}
		
		private function post_modify_class_teacher($class_id , $teacher_list){
			require_once (dirname(__FILE__)."/../include/stat.php" );
		 	$stat = new statManager();
		 	
			$teacher_ids = explode('_' , $teacher_list);
			$teacherClassInfo = array();
			$month = intval(date('m'));
			$year = intval(date('Y'));
			foreach($teacher_ids as $teacher_id){
					$teacherClassInfo[] = array(
						'class_id'=>$class_id,
						'teacher_id'=>$teacher_id,
						'creator'=>$this->vr['id'],
						'creator_name'=>$this->vr['username'],
						'create_date'=>'now()'
					);
				
					$sql = 'select count(*) as num from tblclass2teacher where teacher_id='.$teacher_id.' and class_id='.$class_id;
					$this->db->sql = $sql;
					$this->db->Queryone();
					$result = $this->db->rs;
					if($result['num']<=0){
						$sql = 'select user_id from tblteacher where id='.$teacher_id;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$rs = $this->db->rs;
						$data = array('teacher_id'=>$rs['user_id'],'year'=>$year,'month'=>$month,'big_class_count'=>'1','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id'));
						$stat->update('teacher', 'total', $data);
					}
					
			}
		 	
				$flag = true;
				$reason = '';
				
				$deleteWhere = 'class_id='.$class_id;
				//插入tblclass2teacher历史表 同时将status=0 然后删除
				
				$this->db->sql  = <<<SQL
											insert into tblclass2teacher_history (old_id,class_id,teacher_id,status,inactive_date,creator,creator_name,in_date,out_date) 
											(select tblclass2teacher.id,tblclass2teacher.class_id,tblclass2teacher.teacher_id,0,tblclass2teacher.inactive_date,tblclass2teacher.creator,tblclass2teacher.creator_name,tblclass2teacher.create_date,now() from tblclass2teacher 
											left join tblclass on tblclass2teacher.class_id=tblclass.id
											where tblclass2teacher.class_id=$class_id);
SQL;
				
				
				$this->db->ExecuteSql();
				
				$rsTblclass2teacherHistory = $this->db->rs;
				
				if($rsTblclass2teacherHistory){
					$deleteResult = $this->db->delete('tblclass2teacher' , $deleteWhere);
				}
				
				
			if($deleteResult){
				$deleteResult = explode('_' , $teacher_list);
					
				$teacherClassInfo = array();
				
				foreach($teacher_ids as $teacher_id){
					$teacherClassInfo[] = array(
						'class_id'=>$class_id,
						'teacher_id'=>$teacher_id,
						'creator'=>$this->vr['id'],
						'creator_name'=>$this->vr['username'],
						'create_date'=>'current_timestamp()'
					);
					
				}
				
				$teacherClassInfoResult = $this->db->Inserts('tblclass2teacher' , $teacherClassInfo);
				
			}else{
				$flag = false;
				$reason = 'delete old data failed';
			}
			
			$this->b['flag'] = $flag;
			$this->b['reason'] = $reason;
			$this->b['sc'] = $flag?200:400;
			
		}
		
		private function join_class_student($studentInfo){
		require_once (dirname(__FILE__)."/../include/stat.php" );
 		$stat = new statManager();
 		$userHandler = new user_handler();
 		$month = intval(date('m'));
		$year = intval(date('Y'));
		$classType = $this->r('class_type');
		foreach ($studentInfo as $key=>$student){
			if(isset($student['class_stu_id'])){
				$date = date('Y-m-d',(time()));
				$sql = 'SELECT COUNT(*) as count FROM tblclass2student 
							LEFT JOIN tblclass ON tblclass2student.class_id=tblclass.id
							WHERE tblclass2student.class_id="'.$student['class_id'].'" AND tblclass2student.student_id="'.$student['student_id'].'"';
//				if($this->r('class_type')==1){//大班存在过期时间
//					$sql.=' AND tblclass.end_date>="'.$date.'"';
//				}else if($this->r('class_type')==2){//小班不存在过期时间
//					$sql = $sql;
//				}
				$this->db->sql = $sql;
				$this->db->Query();
				$rs = $this->db->rs;
				if($rs[0]['count']>0){
					$this->b['find'] = true;
				}else{
					$tableName = 'tblclass2student';
					$insertInfo = array(
						'class_id'=>$student['class_id'],
						'student_id'=>$student['student_id'],
						'status'=>1,
						'creator'=>$this->vr['id'],
						'creator_name'=>$this->vr['username'],
						'create_date'=>'now()',
					);
//					print_r($insertInfo);
//					$insertClassResult = $this->db->Insert($tableName , $insertInfo);
					$insertClassResult = $userHandler->add_table_base_info($tableName, $insertInfo);
//					exit;
					//更改学生状态 已加入班级
					$this->change_student_status($student['student_id'], 0);
					
					$sql = 'select tbluser.id,tblclass.class_type from tbluser 
							left join tblteacher on tblteacher.user_id=tbluser.id
							left join tblclass2teacher on tblteacher.id=tblclass2teacher.teacher_id
                            left join tblclass on tblclass2teacher.class_id=tblclass.id
							where tblclass2teacher.class_id='.$student['class_id'];
					$this->db->sql =$sql;
					$this->db->Query();
					$userRs = $this->db->rs;
					/**
					 * join_class_stu
					 */
					$stat->update( 'student', 'action' , array( 'student_id'=>$student['student_id'],'action_obj'=>$student['class_id'],'action_date'=>date("Y-m-d H:i:s"),'action'=> 'join_class_stu' )); 
					/**
					 * 插入大班、小班数据
					 */
//					print_r($userRs);
					if(count($userRs)>0){
						foreach ($userRs as $key=>$value){
							if($value['class_type']==1){
								$stat->update('teacher', 'total', array('teacher_id'=>$value['id'],'stu_big_count'=>'1','year'=>$year,'month'=>$month,'center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id')));
							}else if($value['class_type']==2){
								$stat->update('teacher', 'total', array('teacher_id'=>$value['id'],'stu_small_count'=>'1','year'=>$year,'month'=>$month,'center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id')));
							}
							/**
							 * 插入stat_student_day 空记录
							 */
							$day = date('Y-m-d');
							$sqlStudent = 'select * from tblstudent where id='.$student['student_id'];
							$this->db->sql = $sqlStudent;
							$this->db->Queryone();
							$rsStu = $this->db->rs;
							
							$dayData = array('student_id' =>$rsStu['user_id'],'teacher_id'=>$value['id'],'class_id'=>$student['class_id'],'day' =>$day,'work_total_count'=>0);
							$stat->update( 'student', 'total', $dayData);
							
						}
					}
					
					/**
					 * center zone 统计
					 */
						//插入大班学生统计  
						$day = date('Y-m-d');
						if($classType==1){
							$zoneDayData = array('day'=>$day,'zone_id'=>$this->r('zone_id'),'stu_new_big_count'=>1);	
							$centerDayData =array('day'=>$day,'center_id'=>$this->r('center_id'),'stu_new_big_count'=>1);	
							
						}else if($classType==2){
							$zoneDayData = array('day'=>$day,'zone_id'=>$this->r('zone_id'),'stu_new_small_count'=>1);	
							$centerDayData =array('day'=>$day,'center_id'=>$this->r('center_id'),'stu_new_small_count'=>1);	
						}
						
						$stat->update('zone','total',$zoneDayData); 
						
						$stat->update('center','total',$centerDayData);
					if($insertClassResult){
						$this->b['flag'] = true;
						$this->b['sc'] = 200;
					}else{
						$this->b['flag'] = false;
						$this->b['reason'] = 'insert tblclass2stuent failed';
						$this->b['sc'] = 400;
					}
				}
			}else{
					$tableName = 'tblclass2student';
					$insertInfo = array(
						'class_id'=>$student['class_id'],
						'student_id'=>$student['student_id'],
						'status'=>1,
						'creator'=>$this->vr['id'],
						'creator_name'=>$this->vr['username'],
						'create_date'=>'now()',
					);
					//更改学生状态 已加入班级
					$this->change_student_status($student['student_id'], 0);
	//更新时间出问题
//					$where ="id=".$student['class_stu_id'];
					$sql = 'update tblclass2student set class_id='.$student['class_id'].',student_id='.$student['student_id'].',status=1,creator='.$this->vr['id'].',creator_name="'.$this->vr['username'].'",create_date=now() where id='.$student['class_stu_id'];
					$this->db->sql = $sql;
//					echo $sql;
					$this->db->ExecuteSql();
					$insertClassResult = $this->db->rs;
					
//					$insertClassResult = $this->db->Update($tableName , $insertInfo,$where);
					$sql = 'select tbluser.id,tblclass.class_type from tbluser 
							left join tblteacher on tblteacher.user_id=tbluser.id
							left join tblclass2teacher on tblteacher.id=tblclass2teacher.teacher_id
                            left join tblclass on tblclass2teacher.class_id=tblclass.id
							where tblclass2teacher.class_id='.$student['class_id'];
					$this->db->sql =$sql;
					$this->db->Query();
					$userRs = $this->db->rs;
					$stat->update( 'student', 'action' , array( 'student_id'=>$student['student_id'],'action_obj'=>$student['class_id'],'action_date'=>date("Y-m-d H:i:s"),'action'=> 'join_class_stu' )); 
					
					/**
					 * 教师端统计
					 */
					if(count($userRs)>0){
						foreach ($userRs as $key=>$value){
							if($value['class_type']==1){
								$stat->update('teacher', 'total', array('teacher_id'=>$value['id'],'stu_big_count'=>'1','year'=>$year,'month'=>$month,'center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id')));
							}else if($value['class_type']==2){
								$stat->update('teacher', 'total', array('teacher_id'=>$value['id'],'stu_small_count'=>'1','year'=>$year,'month'=>$month,'center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id')));
							}
							
							/**
							 * 插入stat_student_day 空记录
							 */
							$day = date('Y-m-d');
							$sqlStudent = 'select * from tblstudent where id='.$student['student_id'];
							$this->db->sql = $sqlStudent;
							$this->db->Queryone();
							$rsStu = $this->db->rs;
							
							$dayData = array('student_id' =>$rsStu['user_id'],'teacher_id'=>$value['id'],'class_id'=>$student['class_id'],'day' =>$day,'work_total_count'=>0);
							$stat->update( 'student', 'total', $dayData);
						}
					}
					
					/**
					 * center zone 统计
					 */
					
						//插入大班学生统计  
						$day = date('Y-m-d');
						
						if($classType==1){
							$zoneDayData = array('day'=>$day,'zone_id'=>$this->r('zone_id'),'stu_new_big_count'=>1);	
							$centerDayData =array('day'=>$day,'center_id'=>$this->r('center_id'),'stu_new_big_count'=>1);	
							
						}else if($classType==2){
							$zoneDayData = array('day'=>$day,'zone_id'=>$this->r('zone_id'),'stu_new_small_count'=>1);	
							$centerDayData =array('day'=>$day,'center_id'=>$this->r('center_id'),'stu_new_small_count'=>1);	
						}
						$stat->update('zone','total',$zoneDayData); 
						$stat->update('center','total',$centerDayData);
					
					if($insertClassResult){
						$this->b['flag'] = true;
						$this->b['sc'] = 200;
					}else{
						$this->b['flag'] = false;
						$this->b['reason'] = 'update tblclass2stuent failed';
						$this->b['sc'] = 400;
					}
				}
			}
		}
		private function query_stu_class($condition){
			$tables = array('tblClass','tblClass2Student');
			$tblClass = array(
				'tblclass',
				'center_id' , 'zone_id' , 'class_name' , 'class_instruction' , 'status' , 'inactive_date' , 'creator' , 
				'creator_name' , 'create_date' , 'class_type' , 'begin_date' , 'end_date' , 'num_max' , 'class_section'
			);
			
			$tblClass2Student = array(
				'tblclass2student',
				'id as class_stu_id',
				'class_id',
				'student_id'
			);
			
			$tblCondition = array(
			'tblclass2student.class_id=tblclass.id',
		);
					//制作where条件
				$where ='';
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
					$where = implode(' AND ',$resultArray);
				}
			if($where != ''){
				$tblCondition['where'] = $where;
//				$where = ' WHERE '.$where;
			}
			
			$this->b['list']  = $this->db->withQueryMakerLeft($tblClass2Student , $tblClass, $tblCondition);
			$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblClass2Student , $tblClass, $tblCondition);
			$this->b['sc'] = 200;
			return true;
		}

		private function change_class_student($student){
			$userHandler = new user_handler();
			$studentHandler = new student_handler();
			$whereArray['id'] = $student['class_stu_id'];
			$table = 'tblclass2student';
			
			$userHandler->add_table_history_info($table, $whereArray, '0');
			$studentInfo['student_id'] = $student['student_id'];
			
			$rsStudent = $studentHandler->get_student_id_class_id($student['class_stu_id']);
			$rsDelete= $userHandler->remove_table_info($table,$whereArray);
			$studentInfo['student_id'] = $rsStudent['student_id'];
			$studentInfo['class_id'] = $student['in_class_id'];
			if($rsDelete){
				$rsAdd = $userHandler->add_table_base_info($table, $studentInfo);
				if($rsAdd){
					return true;
				}
			}else{
				return false;
			}
			
		}
		
		
		private function add_class_student_history($classStuId){
			$sql = <<<SQL
						insert into tblclass2student_history (old_id,class_id,student_id,status,inactive_date,creator,creator_name,create_date,out_date) 
						(select tblclass2student.id,tblclass2student.class_id,tblclass2student.student_id,tblclass2student.status,tblclass2student.inactive_date,tblclass2student.creator,tblclass2student.creator_name,tblclass2student.create_date,now() from tblclass2student 
						where tblclass2student.id=$classStuId);
SQL;
			$this->db->sql = $sql;
			$this->db->ExecuteSql();
		}
		//通过user_id 获取当前中心，当前校区下面所有学生
		private function get_current_stu_class($condition){
			$tables = array('tblStudent','tblUser','tblTeacher','tblTeacher','tblClass2Student','tblClass2Teacher','tblClass');
			$tblStudent = array(
				'tblstudent'
			);
			
			$tblUser = array(
				'tbluser',
				'username','realname','id as u_id'
			);
			
			$tblTeacher = array(
				'tblteacher',
				'user_id'
			);

			$tblClass2Student = array(
				'tblclass2student',
				'id as class_stu_id',
				'class_id',
				'student_id'
			);
			
			$tblClass2Teacher = array(
				'tblclass2teacher',
				'class_id'
			);
			
			$tblClass = array(
				'tblclass',
				'center_id' , 'zone_id' , 'class_name' , 'class_instruction' , 'status' , 'inactive_date' , 'creator' , 
				'creator_name' , 'create_date' , 'class_type' , 'begin_date' , 'end_date' , 'num_max' , 'class_section'
			);
			
			$tblCondition = array(
			'tbluser.id=tblstudent.user_id',
			'tblstudent.id=tblclass2student.student_id',
			'tblclass2student.class_id=tblclass2teacher.class_id',
			'tblclass2student.class_id=tblclass.id',
			'tblteacher.id=tblclass2teacher.teacher_id',
		);
		
		$tblClassConditon = array(
			'tblclass.id=tblclass2teacher.class_id',
			'tblclass2teacher.teacher_id=tblteacher.id',
		);
					//制作where条件
				$where ='';
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
					
//					if($this->r('fresh')){
//						$resultArray[] = 'tblclass.end_date>now()';
//					}else{
//						$resultArray[] = 'tblclass.end_date<now()';
//					}
					$where = implode(' AND ',$resultArray);
				}
			if($where != ''){
				$tblCondition['where'] = $where;
				$tblClassConditon['where'] = $where.' group by tblclass.id';//排除一个班级里面存在多个老师
//				$where = ' WHERE '.$where;
			}
			
			$stuRs = $this->db->withQueryMakerLeft($tblStudent,$tblUser,$tblClass2Student,$tblClass2Teacher,$tblClass,$tblTeacher,$tblCondition);
			
//			print_r($stuRs);
			$teacherRs= $this->db->withQueryMakerLeft($tblClass,$tblClass2Teacher,$tblTeacher,$tblClassConditon);
//			print_r($teacherRs);
//			print_r($teacherRs);
			$rs = array();
			foreach ($stuRs as $key=>$value){  //将班里有学生的显示出来，班级无学生的信息不显示
				foreach ($teacherRs as $k=>$v){
					if($value['class_id']==$v['class_id']){
						$rs[$k]['class_id'] = $v['class_id'];
						$rs[$k]['class_type'] = $v['class_type'];
						$rs[$k]['num_max'] = $v['num_max'];
						$rs[$k]['class_name'] = $v['class_name'];
						$rs[$k]['begin_date'] = $v['begin_date'];
						$rs[$k]['end_date'] = $v['end_date'];
						$rs[$k]['student'][] = $stuRs[$key];
					}
				}
			}
//			print_r($rs);
			$this->b['list'] = $rs;
//			$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblStudent,$tblUser,$tblClass2Student,$tblClass2Teacher,$tblTeacher,$tblClass,$tblCondition);
			$this->b['sc'] = 200;
			return true;
		}
		
		
		/**
		 * 学生过期定义：该学生在所有班级里面均过期，则属于
		 * 1,过往学生
		 * 2.学生退出班级 统计
		 * 每天统计：
		 * 创建过期班级统计
		 * 查询班级表是否有过期班级，如果有，则添加到stat_zone,stat_center,stat_teacher
		 */
		public function create_expire_stu_stat(){
			require_once (dirname(__FILE__)."/../include/stat.php" );
	 		$stat = new statManager();
	 		$expireStuNum = array();
//			$center_id =$this->vr['center_id'];  无法获取
//			$zone_id =$this->vr['zone_id'];
			//获取center_id ,zone_id
			$centerZoneSql = 'select id as zone_id,center_id from tblcenterzone';
			$this->db->sql = $centerZoneSql;
			$this->db->Query();
			$centerZoneRs = $this->db->rs;
			if(count($centerZoneRs)>0){
				foreach ($centerZoneRs as $key1=>$value1){
					$date = date('Y-m-d');
					$zondId =  $value1['zone_id'];
					$centerId = $value1['center_id'];
					//大班的过期学生 做数据迁移
					$sqlBigClassStu = 'insert into tblclass2student_history (old_id,class_id,student_id,status,inactive_date,creator,creator_name,create_date,out_date) 
									(select tblclass2student.id,tblclass2student.class_id,tblclass2student.student_id,tblclass2student.status,tblclass2student.inactive_date,tblclass2student.creator,tblclass2student.creator_name,tblclass2student.create_date,now() from tblclass2student 
									left join tblclass on tblclass2student.class_id=tblclass.id
									where 
									tblclass.end_date="'.$date.'"  
									and tblclass.class_type=1 and tblclass.zone_id='.$value1['zone_id'].'  
									and tblclass.center_id='.$value1['center_id'].' )';
					$this->db->sql = $sqlBigClassStu;
					$this->db->ExecuteSql();
					$rsHistory = $this->db->rs;
					//同步更新tblclass2student 将状态更改为过往
					$sqlBigClassStuStatus = <<<SQL
									update tblclass2student inner join  tblclass on tblclass2student.class_id=tblclass.id set tblclass2student.status=0,tblclass2student.out_date=now(),tblclass2student.class_id=0 
									where 
									tblclass.end_date="$date" 
									and tblclass.class_type=1 and tblclass.zone_id=$zondId 
									and tblclass.center_id=$centerId;    
SQL;
						$this->db->sql = $sqlBigClassStuStatus;
						$this->db->ExecuteSql();
					
					//同步数据迁移  大班过期班级进入历史表
					$sqlBigClass = <<<SQL
											insert into tblclass_history (old_id,center_id,zone_id,class_name,class_instruction,status,inactive_date,creator,creator_name,create_date,class_type,begin_date,end_date,num_max,class_section,out_date)
											(select id,center_id,zone_id,class_name,class_instruction,status,inactive_date,creator,creator_name,create_date,class_type,begin_date,end_date,num_max,class_section,now() from tblclass where end_date="$date" and class_type=1  and tblclass.zone_id=$zondId  and tblclass.center_id=$centerId);
SQL;
					
						$this->db->sql = $sqlBigClass;
						$this->db->ExecuteSql();
					
					//原表（tblclasss），执行更新 将过期的大班 status=0,out_date=now()
					$sqlClass = <<<SQL
											update tblclass set status=0,out_date=now() where end_date="$date" and class_type=1 and tblclass.zone_id=$zondId and tblclass.center_id=$centerId;
SQL;
						$this->db->sql = $sqlClass;
						$this->db->ExecuteSql();
					
					
					//大班的过期老师 做数据迁移
					$sqlBigClassTeacher = <<<SQL
															insert into tblclass2teacher_history (old_id,class_id,teacher_id,status,inactive_date,creator,creator_name,create_date,out_date) 
															(select tblclass2teacher.id,tblclass2teacher.class_id,tblclass2teacher.teacher_id,tblclass2teacher.status,tblclass2teacher.inactive_date,tblclass2teacher.creator,tblclass2teacher.creator_name,tblclass2teacher.create_date,now() from tblclass2teacher 
															left join tblclass on tblclass2teacher.class_id=tblclass.id
															where 
															tblclass.end_date="$date"  
															and tblclass.class_type=1 and tblclass.zone_id='$zondId'  
															and tblclass.center_id='$centerId');
SQL;

						$this->db->sql = $sqlBigClassTeacher;
						$this->db->ExecuteSql();
					
					//原表（tblclasss2techer），执行更新 将过期的大班 status=0,out_date=now()
					$sqlBigClassTeacherStatus = <<<SQL
																		update tblclass2teacher inner join  tblclass on tblclass2teacher.class_id=tblclass.id set tblclass2teacher.status=0,tblclass2teacher.out_date=now() 
																		where 
																		tblclass.end_date="$date" 
																		and tblclass.class_type=1 and tblclass.zone_id=$zondId 
																		and tblclass.center_id=$centerId;    
SQL;
						$this->db->sql = $sqlBigClassTeacherStatus;
						$this->db->ExecuteSql();
//					$date  = '2013-08-09';
					//大班的过期学生 group by tblclass2student.student_id 已经去除一个学生在多个班级里面，多个班级过期的情况
					$sql1 = 'select tblclass2student.student_id from tblclass2student 
								left join tblclass on tblclass2student.class_id=tblclass.id
								where tblclass.end_date="'.$date.'" and tblclass.class_type=1 and tblclass.zone_id='.$value1['zone_id'].' and tblclass.center_id='.$value1['center_id'].' group by tblclass2student.student_id';
					
					//小班的学生
					$sql2 = 'select tblclass2student.student_id from tblclass2student 
					left join tblclass on tblclass2student.class_id=tblclass.id
					where tblclass.class_type=2 and tblclass.zone_id='.$value1['zone_id'].' and tblclass.center_id='.$value1['center_id'];
					//大班的未过期学生 查询下rs1 里面是否还存在学生在未过期的大班里面的学生数
					
					$sql3 = 'select tblclass2student.student_id from tblclass2student 
								left join tblclass on tblclass2student.class_id=tblclass.id
								where tblclass.end_date>now() and tblclass.class_type=1 and tblclass.zone_id='.$value1['zone_id'].' and tblclass.center_id='.$value1['center_id'].' group by tblclass2student.student_id';
					//统计
					
					$this->db->sql = $sql1;
					$this->db->Query();
					$rs1 = $this->db->rs;
					
					
					$this->db->sql = $sql2;
					$this->db->Query();
					$rs2 = $this->db->rs;
					
					$this->db->sql = $sql3;
					$this->db->Query();
					$rs3= $this->db->rs;
					
					
					
					if(count($rs1)){
						foreach ($rs1 as $key=>$value){
							
							foreach ($rs2 as $k=>$v){
								if($value['student_id']==$v['student_id']){
									unset($rs1[$key]);
								}
							}
							
							foreach ($rs3 as $k=>$v){
								if($value['student_id']==$v['student_id']){
									unset($rs1[$key]);
								}
							}
						}
					}
//					print_r($rs1);
//					print_r($rs2);
//					print_r($rs3);
					$expireStuNum[$value1['center_id']][$value1['zone_id']] = count($rs1);
				
				}
//				echo 'xxx';
//				print_r($expireStuNum);
				$day = date('Y-m-d');
				$month = intval(date('m'));
				
				
//				$day = '2013-08-09';
				
				//数据处理
				foreach ($expireStuNum as $key=>$value){
					$centerNum = 0;
					foreach ($value as $k=>$v){
						$centerNum+=$v;
						$zoneDayData = array('day'=>$day,'zone_id'=>$k,'stu_lost_count'=>$v);	
//						$zoneMonthData =array('month'=>$month,'zone_id'=>$k,'stu_lost_count'=>$v);	
						$stat->update('zone','total',$zoneDayData); 
//						$stat->update('zone_month','total',$zoneMonthData); 
					}
					$centerDayData =array('day'=>$day,'center_id'=>$key,'stu_lost_count'=>$centerNum);	
//					$centerMonthData = array('month'=>$month,'center_id'=>$key,'stu_lost_count'=>$centerNum);	
//					print_r($centerDayData);
					$stat->update('center','total',$centerDayData); 
//					$stat->update('center_month','total',$centerMonthData); 
				}
				//数据处理
				
				
				
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
		
		//恢复过期班级信息,统计数据
		private function recover_expire_class(){
			$classOldId = $this->r('id');
			$nowDate = 'current_timestamp()';
			$teacherList= $this->r('teacher_list');
			
			$className = $this->r('class_name');
			$classSection = $this->r('class_section');
			$beginDate = $this->r('begin_date');
			$endDate=$this->r('end_date');
			$numNax = $this->r('num_max');
			$status = 1;
			
			//tblclass 班级恢复并修改
			$this->db->sql = <<<SQL
										update tblclass 
										set 
										class_name='$className', class_section='$classSection',status=$status,begin_date='$beginDate',
										end_date='$endDate',num_max=$numNax,create_date=$nowDate,out_date=''
										where id=$classOldId;
SQL;
			$this->db->ExecuteSql(); 
			$this->b['sql'] =$this->db->sql;
			$rs = $this->db->rs;
			
			//tblclass_history 班级状态修改
			$this->db->sql = <<<SQL
										update tblclass_history 
										set 
										status=0 
										where id=$classOldId;
SQL;
			$this->db->ExecuteSql(); 
			$rs = $this->db->rs;
			
			
			//tblclass2teacher 老师恢复并修改
			
			$this->db->sql = <<<SQL
										update tblclass2teacher
										set 
										status=$status,create_date=current_timestamp(),out_date=''
										where class_id=$classOldId;
SQL;
			$this->db->ExecuteSql();
			
		//tblclass2teacher_history 老师状态修改
			
		$this->db->sql = <<<SQL
										update tblclass2teacher_history 
										set 
										status=0 
										where class_id=$classOldId;
SQL;
			$this->db->ExecuteSql();
			
			
			//tblclass2student 恢复并修改
			$this->db->sql = <<<SQL
										update tblclass2student inner join  tblclass2student_history on tblclass2student_history.old_id=tblclass2student.id 
										set 
										tblclass2student.class_id=tblclass2student_history.class_id,
										tblclass2student.status=$status,
										tblclass2student.out_date='',
										tblclass2student.create_date=current_timestamp()
										where tblclass2student_history.class_id=$classOldId;
SQL;
			$this->db->ExecuteSql();
			$rs = $this->db->rs;
			
			
			
			//tblclass2student_history 学生状态修改
			$this->db->sql = <<<SQL
										update tblclass2student_history
										set 
										status=0 
										where class_id=$classOldId;
SQL;
			$this->db->ExecuteSql();
			$rs = $this->db->rs;
			
			
		}
	}
	
?>