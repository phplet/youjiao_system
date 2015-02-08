<?php
class class_handler {
	public function __construct(){
		$this->db = db_handler::getInstance();
	}
	
	
	/**
	 * 返回班级人数
	 * @param  $classId
	 * @param  $status
	 */
	public function get_class_stu_num($classId,$status){
		$this->db->sql = <<<SQL
		select count(*) as num from tblclass2student 
		left join tblclass on tblclass.id=tblclass2student.class_id 
		where tblclass2student.class_id="$classId" and tblclass2student.status=$status;
SQL;
		$this->db->Queryone();
		return $this->db->rs;
	}
	
	
	public function get_class_list($offset , $step , $condition , $fresh,$userType,$level,$searchContent=null){
			$studentHandler = new student_handler();
			$teacherHandler = new teacher_handler();
			$tables = array('tblClass','tblTeacher','tblUser');
			$tblClass = array(
				'tblclass',
				'id',
				'center_id' , 'zone_id' , 'class_name' , 'class_instruction' , 'status' , 'inactive_date' , 'creator' , 
				'creator_name' , 'create_date' , 'class_type' , 'begin_date' , 'end_date' , 'num_max' , 'class_section'
			);
			
			$tblClassHistory = array(
				'tblclass_history',
				'old_id',
				'center_id' , 'zone_id' , 'class_name' , 'class_instruction' , 'status' , 'inactive_date' , 'creator' , 
				'creator_name' , 'create_date' , 'class_type' , 'begin_date' , 'end_date' , 'num_max' , 'class_section'
			);
			$tblClassHistory = array(
				'tblclass_history',
				'old_id ',
				'center_id' , 'zone_id' , 'class_name' , 'class_instruction' , 'status' , 'inactive_date' , 'creator' , 
				'creator_name' , 'create_date' , 'class_type' , 'begin_date' , 'end_date' , 'num_max' , 'class_section'
			);
			$tblTeacher = array(
				'tblteacher',
				'user_id'
			);
			
			$tblUser  = array(
				'tbluser',
				'realname'
			);
			
			if($fresh){
				$tblclass = 'tblclass';
				$tblclass2teacher = 'tblclass2teacher';
				$tblclass2student = 'tblclass2student';
				$tablesInfo = array($tblClass,$tblTeacher,$tblUser); 
				$group = ' group by tblclass.id';
				$querySQL = <<<SQL
									SELECT $tblclass.id,$tblclass.center_id,$tblclass.zone_id,
													$tblclass.class_name,$tblclass.class_instruction,
													$tblclass.status,$tblclass.creator,$tblclass.creator_name,
													$tblclass.create_date,
													$tblclass.class_type,$tblclass.begin_date,$tblclass.end_date,num_max,$tblclass.class_section,$tblclass.out_date
									 FROM $tblclass
									 left join tblclass2teacher on tblclass.id=tblclass2teacher.class_id
									left join tblteacher on tblteacher.id=tblclass2teacher.teacher_id
									left join tbluser on tbluser.id=tblteacher.user_id
SQL;
				$operateStatus = '';
	
			}else{
				$tblclass = 'tblclass_history';
				$tblclass2teacher = 'tblclass2teacher_history';
				$tblclass2student = 'tblclass2student_history';
				$tablesInfo = array($tblClassHistory,$tblTeacher,$tblUser); 
				$group = ' group by tblclass_history.old_id';
				$querySQL = <<<SQL
									SELECT $tblclass.old_id as id,$tblclass.center_id,$tblclass.zone_id,$tblclass.class_name,$tblclass.class_instruction,$tblclass.status,
									$tblclass.creator,$tblclass.creator_name,$tblclass.create_date,
									$tblclass.class_type,$tblclass.begin_date,$tblclass.end_date,$tblclass.num_max,$tblclass.class_section,$tblclass.out_date 
									FROM $tblclass 
									left join tblclass2teacher_history on tblclass_history.old_id=tblclass2teacher_history.class_id
									left join tblteacher on tblteacher.id=tblclass2teacher_history.teacher_id
									left join tbluser on tbluser.id=tblteacher.user_id
SQL;
				$operateStatus = ' and tblclass_history.operate_status=0 and tblclass_history.class_type=1 '; //仅选择大班的过往
			}
			
			
			$queryCountSQL = 'SELECT COUNT(*) as count FROM '.$tblclass;
			
			if($userType=='2'&&$level=='4'){//如果是普通老师
				$querySQL = <<<SQL
				SELECT $tblclass.* FROM $tblclass
										left JOIN $tblclass2teacher on tblclass.id=$tblclass2teacher.class_id
										left join tblteacher on tblteacher.id=$tblclass2teacher.teacher_id
										left join tbluser on tbluser.id=tblteacher.user_id
SQL;
				$queryCountSQL = <<<SQL
				SELECT count(*) as count FROM $tblclass
										left JOIN $tblclass2teacher on tblclass.id=$tblclass2teacher.class_id
										left join tblteacher on tblteacher.id=$tblclass2teacher.teacher_id
										left join tbluser on tbluser.id=tblteacher.user_id
SQL;
			}

			
			$where = utils_handler::analytic_condition($tablesInfo, $condition);
			
			if($where != ''){
				$querySQL .= ' WHERE '.$where.$operateStatus.$group;
				$queryCountSQL .=' WHERE '.$where.' ';
			}
			
			if(!$offset && !$step){
				
			}else{
				$querySQL .= ' LIMIT '.$offset .',' .$step;
			}
			$this->db->sql = $querySQL;
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
//			echo '<pre>';
//			print_r($this->db);
//			exit;
			
			$classData = $this->db->rs;
			
			$this->db->sql = $queryCountSQL;
			
			$this->db->Queryone();
			
			$this->b['count'] = $this->db->rs['count'];
			
			$classCount =$this->db->rs['count'];
			
			$classidArray = array();
			foreach($this->b['list'] as $list){
				$classidArray[] = $list['id'];
			}
			if($fresh){
				$result['teacher']  = $teacherHandler->get_teacher_of_class($classidArray);
				$result['student']  = $studentHandler->get_student_of_class($classidArray);
			}else{
				$result['teacher']  = $teacherHandler->get_teacher_of_class($classidArray,$fresh=false);
				$result['student']  = $studentHandler->get_student_of_class($classidArray,$fresh=false);
			}
//			exit;
			$result['list'] = $classData;
			$result['count'] = $classCount;
			return $result;
		}
		
		//添加新班级  注意 在添加新班级的时候应该有数据统计
		public function add_class($creatorId,$classInfo){
			$userHandler = new user_handler();
			$userInfo = $userHandler->get_user_info($creatorId);
			$tableName = 'tblclass';
			$insertInfo = array(
				'center_id'=>$classInfo['center_id'],
				'zone_id'=>$classInfo['zone_id'],
				'class_name'=>$classInfo['class_name'],
				'class_instruction'=>$classInfo['class_instruction'],
				'status'=>1,
				'creator'=>$creatorId,
				'creator_name'=>$userInfo['username'],
				'create_date'=>'now()',
				'class_type'=>1,
				'class_section'=>$classInfo['class_section'],
				'begin_date'=>$classInfo['begin_date'],
				'end_date'=>$classInfo['end_date'],
				'num_max'=>$classInfo['num_max']
			);
			
			$insertClassResult = $userHandler->add_table_base_info($tableName, $insertInfo);
			
			if($insertClassResult){//如果班级插入成功 
				$class_id = $insertClassResult;
				if($classInfo['teacher_list']){
					$teacher_ids = explode('_' , $classInfo['teacher_list']);
					
					$teacherClassInfo = array();
					
					foreach($teacher_ids as $teacher_id){
						$teacherClassInfo[] = array(
							'class_id'=>$class_id,
							'teacher_id'=>$teacher_id,
							'creator'=>$creatorId,
							'creator_name'=>$userInfo['username'],
							'create_date'=>'current_timestamp()'
						);
					}
					
					$teacherClassInfoResult = $userHandler->add_table_base_info($tableName='tblclass2teacher', $teacherClassInfo);
					if($teacherClassInfoResult){
						$rs['reason'] = 'success';
						$rs['flag'] = true;
						$rs['sc'] = 200;
						return $rs;
					}else{
						$rs['reason'] = 'insert teacher class relation failed';
						$rs['flag'] = false;
						$rs['sc'] = 400;
						return $rs;
					}
					
				}else{
						$rs['reason'] = 'success';
						$rs['flag'] = true;
						$rs['sc'] = 200;
						return $rs;
				}
			}else{
						$rs['reason'] = 'insert class failed';
						$rs['flag'] = false;
						$rs['sc'] = 400;
						return $rs;
			}
			return true;
		}
		
		
				
		
		/**
		 * 结束班级
		 * @param  $teacherUserIds =array();
		 */
		public function add_class_teacher_student_history($teacherUserIds,$classId){
				$studentUserIds = array();
				$whereClassArray['id'] = $classId;
				$teacherHandler = new teacher_handler();
				$studentHandler = new student_handler();
				$userHandler = new user_handler();
				$operateStatus = 0;
				$tableTeacher = 'tblclass2teacher';
				$tableStudent = 'tblclass2student';
				$tableClass = 'tblclass';
				foreach ($teacherUserIds as $key=>$value){
					$teacherId = $teacherHandler->get_teacher_id($value);
					$whereTeacherArray['teacher_id'] = $teacherId;
					$whereTeacherArray['class_id'] =$classId;
					//该班级下面的老师入历史表
					$userHandler->add_table_history_info($tableTeacher, $whereTeacherArray, $operateStatus);
					$studentInfo = $studentHandler->get_student_by_teacher_id_and_class_id($teacherId, $classId);
					
					if(count($studentInfo)>0){
							foreach ($studentInfo as $k=>$v){
								$studentUserIds[] = $v['student_id'];
							}
					}
					
				}
				
				foreach ($studentUserIds as $key=>$value){
						$whereStudentArray['student_id'] = $value;
						$whereStudentArray['class_id'] =$classId;
						//该班级下面的学生入历史表
						$userHandler->add_table_history_info($tableStudent, $whereStudentArray, $operateStatus);
				}
				
					//清除tblclass 记录
						$userHandler->add_table_history_info($tableClass, $whereClassArray, $operateStatus);
				return true;
		}
		
		public function remove_class_teacher_student($teacherUserIds,$classId){
				$studentUserIds = array();
				$whereClassArray['id'] = $classId;
				$teacherHandler = new teacher_handler();
				$studentHandler = new student_handler();
				$userHandler = new user_handler();
				$tableTeacher = 'tblclass2teacher';
				$tableStudent = 'tblclass2student';
				$tableClass = 'tblclass';
				$flagTeacher = true;
				$flagStudent = true;
				foreach ($teacherUserIds as $key=>$value){
					$teacherId = $teacherHandler->get_teacher_id($value);
					$studentInfo = $studentHandler->get_student_by_teacher_id_and_class_id($teacherId, $classId);
					if(count($studentInfo)>0){
							foreach ($studentInfo as $k=>$v){
								$studentUserIds[] = $v['student_id'];
							}
					}
					
				}
				
				foreach ($teacherUserIds as $key=>$value){
					$teacherId = $teacherHandler->get_teacher_id($value);
					$whereTeacherArray['teacher_id'] = $teacherId;
					$whereTeacherArray['class_id'] =$classId;
					//清除tblclass2teacher 记录
					$rs = $userHandler->remove_table_info($tableTeacher, $whereTeacherArray);
					$flagTeacher&=$rs;
				}
					
				
				foreach ($studentUserIds as $key=>$value){
						$whereStudentArray['student_id'] = $value;
						$whereStudentArray['class_id'] =$classId;
						//清除tblclass2student 记录
						$rs = $userHandler->remove_table_info($tableStudent, $whereStudentArray);
						$flagStudent&=$rs;
				}
					//清除tblclass 记录
					if($flagStudent&&$flagTeacher){
						$userHandler->remove_table_info($tableClass, $whereClassArray);
						return true;
					}else{
						return false;
					}
		}
		
		
		
		
		public function post_modify_class($classInfo){
			$userHandler = new user_handler();
			$tableName = 'tblclass';
			$operateStatus = '2';//修改为2
			$whereArray['id'] = $classInfo['id'];
			$rsHistory = $userHandler->add_table_history_info($tableName, $whereArray, $operateStatus);
			
			$where = $tableName.'.id='.$classInfo['id'];
			$modifyInfo = array(
				'class_name'=>$classInfo['class_name'],
				'class_section'=>$classInfo['class_section'],
				'begin_date'=>$classInfo['begin_date'],
				'end_date'=>$classInfo['end_date'],
				'num_max'=>$classInfo['num_max']
			);
			if($rsHistory){
				$rs['flag']= $this->db->Update($tableName , $modifyInfo , $where);
				$rs['sc'] = 200;
			}else{
				$rs['flag']= false;
				$rs['sc'] = 200;
			}
			return $rs;
		}
		
		
		/**
		 * 
		 * @param  $creatorId
		 * @param  $teacherUserIds
		 */
		public function add_small_class($creatorId,$teacherUserIds,$centerId,$zoneId){
				$teacherHandler = new teacher_handler();
				$time = 'now()';
				$creatorBaseInfo = $teacherHandler->get_user_info($creatorId);
				$flag = true;
				foreach ($teacherUserIds as $key=>$value){
					$rs = $teacherHandler->check_teacher_in_small_class($teacherUserId, $centerId, $zoneId);
					if(!$rs){
						$teacherBaseInfo = $teacherHandler->get_user_info($value);
						$teacherId = $teacherHandler->get_teacher_id($value);
						$classInfo['class_name'] = $teacherBaseInfo['realname'];
						$classInfo['center_id'] = $centerId;
						$classInfo['zone_id'] = $zoneId;
						$classInfo['creator'] = $creatorId;
						$classInfo['creator_name'] = $creatorBaseInfo['username'];
						$classInfo['create_date'] =$time;
						$classInfo['class_type'] = 2;
						$classId = $teacherHandler->add_table_base_info($table='tblclass', $classInfo);
						$class2teacherInfo['class_id'] = $classId;
						$class2teacherInfo['teacher_id'] = $teacherId;
						$class2teacherInfo['creator'] = $creatorId;
						$class2teacherInfo['creator_name'] = $creatorBaseInfo['username'];
						$class2teacherInfo['create_date'] =$time;
						$class2teacherId = $teacherHandler->add_table_base_info($table='tblclass2teacher', $class2teacherInfo);
						$flag&=($classId&&$class2teacherId)?true:false;
					}
				}
				return  $flag;
		}
		
		/**
		 * 获取班级基本信息
		 * @param  $classId
		 */
		public function get_class_info($classId){
			$this->db->sql = <<<SQL
			select * from tblclass where id=$classId;
SQL;
			$this->db->Queryone();
			return $this->db->rs;
		}
		
		public function get_class_id_by_teacher_user_id($teacherUserId){
				$this->db->sql = <<<SQL
				
									select tblclass2teacher.class_id from tblclass2teacher
										
									left 	join tblteacher on tblclass2teacher.teacher_id= tblteacher.id 
                                       
                                    left  join tbluser on tbluser.id=tblteacher.user_id
                                    
									where tbluser.id=$teacherUserId ;
SQL;
				$this->db->Query();
				return $this->db->rs;
		}
		
		/**
		 * 接班数据统计
		 */
		public function stat_end_class($class_id){
			$studentHandler = new student_handler();
			$classHandler = new class_handler();
			$classInfo = $classHandler->get_class_info($class_id);
			$centerId = $classInfo['center_id'];
			$zoneId = $classInfo['zone_id'];
			$classType = $classInfo['class_type'];
			$statHandler = new stat_handler();
			$studentInfo = $studentHandler->get_student_of_class($class_id);
			$studentNum = count($studentInfo);
			$zoneCenterInfo['center_id'] = $centerId;
			$zoneCenterInfo['zone_id'] = $zoneId;
			$statField = $classType=='1'?'stu_lost_big_count':'stu_lost_small_count';
			
			$statHandler->stat_zone_center($zoneCenterInfo, $statField,true,$studentNum);
			$statHandler->stat_zone_center($zoneCenterInfo, 'class_lost_count');

			
			//stu_lost_num 不作统计
			if($studentNum>0){
				foreach ($studentInfo as $key=>$value){
					$studentId =$value['student_id'];
					$num = $studentHandler->check_student_in_other_class($studentId, $class_id);
					//查询在其他班级中么，如果不在则算stu_lost_num
					if(!$num){
						$statHandler->stat_zone_center($zoneCenterInfo, 'stu_lost_num');
						
					}
				}
			}
			/**
			 * action:end_class
			class_id:1208
			teacher_user_ids[]:180878
			 */
			/**
			 * 可统计的数据：  
			 * stu_lost_big_count 大班过往学生人次数 
			 * stu_lost_small_count 小班过往学生人次数
			 * class_lost_count 取消班级数 统计+1  每天取消的统计 不作大班小班区别
			 * stu_lost_num 减少人数
			 * 
			 * 
			 */
		}
		
}