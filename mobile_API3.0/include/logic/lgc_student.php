<?php
class student_handler extends user_handler{
/**
 * @param  $studentId 学生表ID tblstudentID
 */
	public function get_student_info($studentId){
		$this->db->sql = <<<SQL
									select tbluser.* ,tblstudent.*  from tblstudent left join tbluser on tbluser.id=tblstudent.user_id where tblstudent.id=$studentId;
SQL;
		$this->db->Queryone();
		return $this->db->rs;
	}
	
	/**
	 * 
	 */
	public function ge_student_info_by_name($userName,$realName){
		$sql = <<<SQL
					select tbluser.id as user_id,
							tblstudent.id as student_id,
							tbluser.realname,
							tbluser.username,
							tbluser.tel,
							tblstudent.grade,
							tblstudent.center_id,
							tblstudent.zone_id 
							 from tblstudent
					left join tbluser on tbluser.id=tblstudent.user_id
SQL;
		if($userName){
			$where  =<<<SQL
							where tbluser.username='$userName';
SQL;
		}
		if($realName){
			$where  =<<<SQL
							where tbluser.realname='$realName';
SQL;
		}
		$this->db->sql = $sql.$where;
		$this->db->Queryone();
		return $this->db->rs;
	}
	/**
	 * @param  $offset  分页参数
	 * @param  $step 	分页参数
	 * @param  $condition 条件
	 */
	public function get_student_list($offset , $step , $condition,$fresh){ //该方法仅用于显示 一对一学生管理 >> 学生管理 小班详细情况
		$tblStudent = array( //不能用学生center_id zone_id 约束
			'tblstudent',
			'id as student_id'  ,'school_name','grade','user_id as student_user_id'
		);
		
		$tblClass2student = array(
			'tblclass2student',	
			'id as class_stu_id','class_id' , 'create_date','status'
		);
		
		$tblUser = array(
			'tbluser',
			'username' , 'realname' , 'gender' , 'last_login_time','email','tel'
		);
		
		$tblClass = array(
			'tblclass',
			'class_name',
			'class_type',
			'center_id',
			'zone_id'
		);
		
		$tblTeacher =array(
			'tblteacher',
			'user_id','subject_id'
		);
		
		$tblClass2teacher =array(
				'tblclass2teacher'
		);
		$tblCondition = array(
			'tblstudent.id=tblclass2student.student_id',
			'tblstudent.user_id=tbluser.id',
			'tblclass.id=tblclass2student.class_id',
			'tblclass2student.class_id=tblclass2teacher.class_id',
			'tblclass2teacher.teacher_id=tblteacher.id'
		);
		$tblConditionTmp = array(
			'tblstudent.id=tblclass2student.student_id',
			'tblstudent.user_id=tbluser.id',
			'tblclass.id=tblclass2student.class_id',
			'tblclass2student.class_id=tblclass2teacher.class_id',
			'tblclass2teacher.teacher_id=tblteacher.id'
		);
		
		$tblConditionNum = array(
			'tblstudent.id=tblclass2student.student_id',
			'tblstudent.user_id=tbluser.id',
			'tblclass.id=tblclass2student.class_id',
			'tblclass2student.class_id=tblclass2teacher.class_id',
			'tblclass2teacher.teacher_id=tblteacher.id'
		);
		
		$tablesInfo = array($tblStudent,$tblClass2student,$tblUser,$tblClass,$tblTeacher,$tblTeacher);
		$where = utils_handler::analytic_condition($tablesInfo,$condition);
		$date = date('Y-m-d',(time()));
		if($fresh){//当前
			//$where .= ' and tblclass.end_date>="'.$date.'"'; //现在不用时间约束
		}else{
			//$where .= ' and tblclass.end_date<"'.$date.'"'; //现在不用时间约束
		}
			if($where != ''){
				$tblCondition['where'] = $where;
				$tblConditionTmp['where'] = $where.'  GROUP BY tblclass.id,tblstudent.id';
				$tblConditionNum['where'] = $where.'  GROUP BY tblclass.id ';
			}
			$tblCondition['order'] = 'tblclass2student.create_date desc';
			$result  = $this->db->withQueryMakerLeft($tblStudent , $tblClass2student , $tblUser ,$tblClass,$tblClass2teacher,$tblTeacher, $tblCondition);
			
//			print_r($this->db);
//			exit;
			$resultTmp  = $this->db->withQueryMakerLeft($tblStudent , $tblClass2student , $tblUser ,$tblClass,$tblClass2teacher,$tblTeacher, $tblConditionTmp);
			$studentInfo = array();
			$classInfo =array();
			//班级、科目信息
			if(count($result)>0){
				foreach ($result as $key=>$value) {
					$classInfo[$value['student_user_id']][$value['class_id']][$value['user_id']][$value['subject_id']]['subject_id']= $value['subject_id'];
					$classInfo[$value['student_user_id']][$value['class_id']][$value['user_id']][$value['subject_id']]['class_name']= $value['class_name'];
					$classInfo[$value['student_user_id']][$value['class_id']][$value['user_id']][$value['subject_id']]['class_id'] = $value['class_id'];
					$classInfo[$value['student_user_id']][$value['class_id']][$value['user_id']][$value['subject_id']]['user_id']= $value['user_id'];
				}
				
				foreach ($resultTmp as $key=>$value){
					foreach ($classInfo as $k=>$v){
						foreach ($v as $k1=>$v1){
							if($k==$value['student_user_id']&&$k1==$value['class_id']){
								$studentInfo[$key]['student_id'] = $value['student_id'];
								$studentInfo[$key]['center_id'] = $value['center_id'];
								$studentInfo[$key]['zone_id'] = $value['zone_id'];
								$studentInfo[$key]['school_name'] = $value['school_name'];
								$studentInfo[$key]['grade'] = $value['grade'];
								$studentInfo[$key]['student_user_id'] = $value['student_user_id'];
								$studentInfo[$key]['class_stu_id'] = $value['class_stu_id'];
								$studentInfo[$key]['class_id'] = $value['class_id'];
								$studentInfo[$key]['class_name'] = $value['class_name'];
								$studentInfo[$key]['create_date'] = $value['create_date'];
								$studentInfo[$key]['status'] = $value['status'];
								$studentInfo[$key]['username'] = $value['username'];
								$studentInfo[$key]['realname'] = $value['realname'];
								
								$studentInfo[$key]['email'] = $value['email'];
								$studentInfo[$key]['tel'] = $value['tel'];
								$studentInfo[$key]['gender'] = $value['gender'];
								$studentInfo[$key]['last_login_time'] = $value['last_login_time'];
								$studentInfo[$key]['class_type'] = $value['class_type'];
								$studentInfo[$key]['student_realname'] = $value['realname'];
								$studentInfo[$key]['class_info'] = $v1;
							}
						}
						
					}
				}
				
			//加入老师统计信息
				foreach ($studentInfo as $key=>$value){
						foreach ($value['class_info'] as $k=>$v){
							$sql = 'select student_id,teacher_id,class_id,
							sum(test_error_count) as test_error_count,
							sum(work_error_count) as work_error_count,
							sum(work_total_count) as work_total_count,
							sum(test_total_count) as test_total_count,
							sum(work_submit_count) as work_submit_count,
							sum(test_submit_count) as test_submit_count
							from stat_student_day 
							where student_id='.$value['student_user_id'].' 
							and teacher_id='.$k.' and class_id='.$value['class_id'].' group by student_id;';
							$this->db->sql = $sql;
//							echo $sql;
//							exit;
							$this->db->Query();
							$rs = $this->db->rs;
							$studentInfo[$key]['stat_info'][$k][$value['class_id']] = $rs;
						}
						
				}
				
			}
			
			$data['count'] = count($studentInfo);
			$data['list']  = $step?array_slice($studentInfo, $offset,$step):$studentInfo;
			return $data;
			
		
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
		$student['school_name'] = $studentInfo['school_name'];
		$student['grade'] = $studentInfo['grade'];
		$this->db->Update('tblstudent', $student,$condition_student);
		$rs2 = $this->db->rs;
		if($rs1&&$rs2){
			$rs['flag'] = true;
			$rs['reson'] = 'success';
			$rs['sc'] = 200;
			return $rs;
		}else{
			if($rs1==false&&$rs2){
				$rs['flag'] = false;
				$rs['reson'] = 'update user failed';
				$rs['sc'] = 400;
				return $rs;
			}else if($rs2==false&&rs1){
				$rs['flag'] = false;
				$rs['reson'] = 'update student failed';
				$rs['sc'] = 400;
				return $rs;
			}else{
				$rs['flag'] = false;
				$rs['reson'] = 'update user and student failed';
				$rs['sc'] = 400;
				return $rs;
			}
		}
	}

	/**
	 * 
	 * @param  $teacherList 老师信息数组
	 * @param  $centerId
	 * @param  $zoneId
	 * @param  $studentId
	 * @param  $creatorId
	 */
	public function add_small_class($teacherList,$centerId,$zoneId,$studentId,$creatorId){
		$teacherHandler = new teacher_handler();
		$creatorInfo = $this->get_user_info($creatorId);
		$studentInfo = $this->get_student_info($studentId);
		$teacherClassInfo = array();
		$classInfo = array();
		$student =array();
		foreach($teacherList as $key=>$value){
			$teacherId = $teacherHandler->get_teacher_id($value['id']);
			$teacherClassInfo= array(
				'center_id'=>$centerId,
				'zone_id'=>$zoneId,
				'class_name'=>$value['name'],
				'class_instruction'=>$studentInfo['username'].'的1对1教学',
				'creator'=>$creatorId,
				'creator_name'=>$creatorInfo['username'],
				'class_type'=>2,
				'create_date'=>'now()'
			);
			
			$teacherSmallInfo = $teacherHandler->get_teacher_in_class($teacherId,'',$classType=2);
			
			if($teacherSmallInfo['num']){
					$class_id = $teacherSmallInfo['class_id'];
			}else{
					$insertClassResult = $this->db->Insert('tblclass', $teacherClassInfo);
					$class_id = $this->db->Last_id();
					if($insertClassResult){
							$class_id = $class_id;
						}else{
							return false;
						}
			}

				$classInfo = array(
						'class_id' =>$class_id,
						'teacher_id'=>$teacherId,
						'creator'=>$creatorId,
						'creator_name'=>$creatorInfo['username'],
						'create_date'=>'now()'
				);
							
					$student = array(
							'class_id' =>$class_id,
							'student_id'=>$studentId, //学生表id
							'creator'=>$creatorId,
							'creator_name'=>$creatorInfo['username'],
							'status'=>1,
							'create_date'=>'now()'
					);
					
					$teacherSmallClassInfo = $teacherHandler->get_teacher_in_class($teacherId,$class_id,2);
								if($teacherSmallClassInfo['num']){//查询到该老师已经建立1V1 班级
										$teacherUserId = $teacherSmallClassInfo['teacher_user_id'];
										$rsClass2Stu = $this->db->Insert('tblclass2student', $student);
										if($rsClass2Stu){
												$rs['reason'] = 'success';
												$rs['flag'] = true;
												$rs['sc'] = 200;
										}else{
											$this->b['flag'] = false;
											$this->b['reason'] = 'insert tblclass2teacher  relation failed';
											$this->b['sc'] = 400;
										}
									
								}else{
									$result = $this->db->Insert('tblclass2teacher', $classInfo);
									if($result){
										$rsClass2Stu = $this->db->Insert('tblclass2student', $student);
										if($rsClass2Stu){
												$rs['flag'] = true;
												$rs['sc'] = 200;
												$rs['reason'] = 'success';
										}else{
												$rs['flag'] = false;
												$rs['sc'] = 400;
												$rs['reason'] = 'insert tblclass2teacher  relation failed';
										}
									}else{
												$rs['flag'] = false;
												$rs['sc'] = 400;
												$rs['reason'] = 'insert tblclass2teacher  relation failed';
									}
								}
						
						}
					
	}
	
	

	
	public function add_student($creatorId,$studentInfo){

		//先添加学生信息
		$userInfo  = $this->get_user_info($creatorId);
		$insertUser = array(
			'username'=>$studentInfo['username'],
			'realname'=>$studentInfo['realname'],
			'gender'=>$studentInfo['gender'],
			'passwd'=>'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',//默认123456
			'usr_type'=>1,//学生是1
			'reg_time'=>'now()',
			'tel'=>$studentInfo['tel'],
			'email'=>$studentInfo['email'],
			'note'=>$studentInfo['note'],
		);
		
		$rsUser = $this->add_table_base_info($table='tbluser', $insertUser);
			
		if($rsUser){//如果用户表插入成功，则继续插入学生表
			$insertStudent = array(
				'user_id'=>$rsUser,
				'center_id'=>$studentInfo['center_id'],
				'zone_id'=>$studentInfo['zone_id'],
				'creator'=>$creatorId,
				'creator_name'=>$userInfo['username'],
				'create_date'=>'now()',
				'grade'=>$studentInfo['grade'],
				'school_name'=>$studentInfo['school_name'],
				'new_student_status'=>'1' //新学生
			);
			
			$rsStudent = $this->add_table_base_info($table='tblstudent', $insertStudent);
			
			return $rsStudent;
		}
	
	}
	/**
	 * 
	 * 更新学生班级信息
	 * @param  $classStuId
	 * @param  $classId
	 */
	public function update_class($classStuId,$classId){
	 		$classStuId = $student['id'];
			$table = 'tblclass2student';
			$arr = array(
				'class_id'=>$student['class_id']
			);
			$condition = 'id='.$student['id'];
			$this->db->Update($table, $arr,$condition);
			$rs = $this->db->rs;
			return  $rs;
		
	}
	
	
	/**
	 * 
	 * 根据classStuId 获取对应老师的userId
	 * @param  $classStuId
	 */
	public function get_teacher_user_id_by_class_stu_id($classStuId){
		$this->db->sql = <<<SQL
								select tblteacher.user_id as teacher_user_id from tblclass2student
								left join tblclass on tblclass2student.class_id=tblclass.id
								left join tblclass2teacher on tblclass2teacher.class_id=tblclass.id
								left join tblteacher on tblclass2teacher.teacher_id=tblteacher.id
								where tblclass2student.id=$classStuId;
SQL;
		$this->db->Query();
		return $this->db->rs;
	}
	
	/**
	 * 
	 * 根据classStuId 获取学生的ID tblstudent ID
	 * @param unknown_type $classStuId
	 */
	public function get_student_id_by_class_stu_id($classStuId){
		$this->db->sql = <<<SQL
								select student_id from tblclass2student where id=$classStuId;
SQL;
		$this->db->Queryone();
		return $this->db->rs;
	}
	
	
	/**
	 * 更加学生ID 获取该学生所在班级的数目
	 * @param  $studentId
	 * @param  $classType 1大班 2小班
	 * @param $status 班级状态  1：当前 0 过往 默认为当前
	 */
	public function get_stu_in_class_num($studentId,$classType,$status=1,$centerId=NULL,$zoneId=NULL){
		$sql= <<<SQL
									select count(*) as num from tblclass2student 
									left join tblclass on tblclass.id = tblclass2student.class_id
									where tblclass.class_type=$classType  and tblclass2student.student_id=$studentId and tblclass.status=$status 
									
SQL;
		if($centerId||$zoneId){
			$sql.=<<<SQL
									and tblclass.center_id=$centerId and zone_id=$zoneId
SQL;
		}
		$this->db->sql = $sql;
		$this->db->Queryone();
		$rs = $this->db->rs;
		return $rs['num'];
	}
	
	
	public function get_no_class_student_list($offset , $step , $centerId , $zoneId, $condition,$noClassStu=true){
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
			$tablesInfo = array($tblStudent,$tblClass2student,$tblUser,$tblClass,$tblCenterZone);
			$where  = utils_handler::analytic_condition($tablesInfo, $condition);			
			if($where != ''){
				$tblCondition['where'] = $where.' group by tblstudent.user_id order by tblstudent.create_date desc';
			}
				
			$rs = $this->db->withQueryMakerLeft($tblStudent , $tblClass2student , $tblUser ,$tblClass,$tblCenterZone,$tblCondition);
//			echo '<pre>';
//			print_r($rs);
//			exit;
			if($noClassStu){
				//数据筛选：排除还存在其他班级的学生
				
//				echo '<pre>';
//				print_r($rs);
				$rs = $this->remove_stu_in_class($rs,$centerId,$zoneId);
//				echo '-------';
//				print_r($rs);
//				exit;
				//添加过往大班的学生
				$rsStuBigPass = $this->get_students_in_center_zone($centerId, $zoneId, $classType=1, $status=0);
				//添加过往小班的学生
				$rsStuSmallPass = $this->get_students_in_center_zone($centerId, $zoneId, $classType=2, $status=0);
				if(count($rsStuSmallPass)>0){
					$rs = array_merge($rsStuBigPass,$rs);
				}
				
				if(count($rsStuSmallPass)>0){
					$rs = array_merge($rsStuSmallPass,$rs);
				}
				
			}
				
			$result['list'] = array_slice($rs,$offset,$step);
			$result['count'] =  count($rs);
			return $result;
		}
	
		
		/**
		 * 对于学生结果集去除在（当前、过往） 大班、（当前、过往）小班里面的学生
		 * @param  $rs 结果集
		 */
		public function remove_stu_in_class($rsStudent,$centerId=NULL,$zoneId=NULL){
				if(count($rsStudent)>0){
					foreach ($rsStudent as $key=>$value){
						
							$currentStuBigNum = $this->get_stu_in_class_num($value['student_id'], $classType=1,1,$centerId,$zoneId);
							if($currentStuBigNum){
								unset($rsStudent[$key]);
							}
							$currentStuSmallNum = $this->get_stu_in_class_num($value['student_id'], $classType=2,1,$centerId,$zoneId);
							
							if($currentStuSmallNum){
								unset($rsStudent[$key]);
							}
							
							$passStuBigNum = $this->get_stu_in_class_num($value['student_id'], $classType=1,$status=0,$centerId,$zoneId);
							
							if($passStuBigNum!='0'){
								unset($rsStudent[$key]);
							}
							$passStuSmallNum = $this->get_stu_in_class_num($value['student_id'], $classType=2,$status=0,$centerId,$zoneId);
							if($passStuSmallNum!='0'){
								unset($rsStudent[$key]);
							}
							
					}
					
				
					return $rsStudent;
				}
		}
		
		
		/**
		 * 
		 * 
		 * @param  $centerId
		 * @param  $zoneId
		 * @param  $classType 班级类型
		 * @param  $status       班级状态
		 */
		public function get_students_in_center_zone($centerId,$zoneId,$classType,$status){
				$this->db->sql = <<<SQL
											SELECT tblclass2student.student_id,tblclass2student.id as class_stu_id,tblstudent.center_id,tbluser.id as user_id,tblstudent.school_name,tblstudent.grade,tblstudent.zone_id,tblclass2student.class_id,tblclass2student.status,tbluser.username,tbluser.realname,tbluser.last_login_time,tbluser.reg_time as create_date,tbluser.email,tbluser.tel
											FROM tblclass2student 
											LEFT JOIN tblstudent ON tblclass2student.student_id=tblstudent.id 
											LEFT JOIN tbluser ON tblstudent.user_id=tbluser.id 
											left join tblclass on tblclass2student.class_id=tblclass.id 
											WHERE tblclass.center_id="$centerId" AND tblclass.zone_id="$zoneId" 
											AND tblclass.class_type="$classType" AND tblclass.status="$status" GROUP by tblclass2student.student_id;
SQL;
				$this->db->Query();
				return $this->db->rs;											
		}
	
		/**
		 * 获取在班级下面的学生
		 * $classIds 可以是二维数组或者是INT 值 默认为当前
		 */
		public function get_student_of_class($classIds,$fresh=true){
			$flag = is_array($classIds);
			$table = $fresh?'tblclass2student':'tblclass2student_history';
			$id =$fresh?'id':'old_id as id';
			$group = $fresh?' ':' group by student_id,class_id';
			$studentWhere =$flag?($table.'.class_id in ('. implode(',' , $classIds) .')'):($table.'.class_id in ('.$classIds.')');
			$studentWhere.=' and '.$table.'.status=1';
			$studentWhere.=$fresh?'':' and '.$table.'.operate_status=0';
			$studentWhere.=$group;
			$tblClass2student = array(
				$table,
				$id,'class_id','student_id','status'
			);
			
			$tblStudent = array(
				'tblstudent',
				'user_id'
			);
			$tblUser = array(
				'tbluser',
				'username' , 'realname'
			);
			$conditionStu =array(
				$table.'.student_id=tblstudent.id',
				'tblstudent.user_id=tbluser.id',
				'where'=>$studentWhere
			);
			$result = $this->db->withQueryMakerLeft($tblClass2student,$tblStudent,$tblUser,$conditionStu);
			return $result;
		}
		
		/**
		 * 通过老师的UserId 查询该老师下面的所有学生   group by tbluser.id 排除在不同班级下面的同一个学生
		 * @param  $teacherUserId
		 * @param  $centerId
		 * @param  $zoneId
		 */
		public function get_student_by_teacher_user_id($teacherUserId,$centerId,$zoneId){
			$this->db->sql = <<<SQL
										select tbluser.id as user_id,tblstudent.id as student_id,tbluser.username,tbluser.realname,
										
										tblclass.id as class_id,tblclass.center_id,tblclass.zone_id
										
										from tblclass2student 
										left join tblclass on tblclass.id=tblclass2student.class_id
										left join tblclass2teacher on tblclass.id=tblclass2teacher.class_id
										left join tblteacher on tblteacher.id=tblclass2teacher.teacher_id
										left join tblstudent on tblstudent.id=tblclass2student.student_id
										left join tbluser on tbluser.id=tblstudent.user_id
										where tblteacher.user_id='$teacherUserId' and tblclass.center_id='$centerId' and tblclass.zone_id='$zoneId' group by tbluser.id
SQL;

		$this->db->Query();
		$result = $this->db->rs;
		return $result;
		}
		
		/**
		 * 获取学生信息 根据$teacherId $classId
		 * @param  $teacherId
		 * @param  $classId
		 */
		public function get_student_by_teacher_id_and_class_id($teacherId,$classId){
						$this->db->sql = <<<SQL
										select tbluser.id as user_id,tblstudent.id as student_id,tbluser.username,tbluser.realname
										from tblclass2student 
										left join tblclass on tblclass.id=tblclass2student.class_id
										left join tblclass2teacher on tblclass.id=tblclass2teacher.class_id
										left join tblteacher on tblteacher.id=tblclass2teacher.teacher_id
										left join tblstudent on tblstudent.id=tblclass2student.student_id
										left join tbluser on tbluser.id=tblstudent.user_id
										where tblteacher.id='$teacherId' and tblclass.id='$classId';
SQL;
		$this->db->Query();
		$result = $this->db->rs;
		return $result;
		}
		
		
		
		/**
		 * 
		 * @param  $centerId  //中心下面有班学生数
		 */
		public function get_student_count($centerId){
			$this->db->sql = <<<SQL
										select count(distinct student_id) as num  from tblclass2student 
										 left join tblclass on tblclass.id=tblclass2student.class_id
										 where tblclass.center_id=$centerId;
SQL;
			$this->db->Queryone();
			return $this->db->rs['num'];
		}
		
		
		/**
		 * 
		 */
		public function get_student_roster($offset,$step,$condition){
			$tblStudent = array('tblstudent','center_id','zone_id');
			$tblUser = array('tbluser','*');
			$tables = array($tblStudent,$tblUser);
			$queryCondition = array(
				'tbluser.id=tblstudent.user_id'
			);
			utils_handler::analytic_condition($tables, $condition);
		
		}
		
		public function stat_lost_student_num($classStuId){
				$studentHandler = new student_handler();
				$statHandler = new stat_handler();
				/**
				 * 如果执行退出班级操作：
				 * 该学生如果不在其他班中，则属于过往学生
				 * 检查该学生是否在大班中，是否在小班中
				 */
				$flag = true;
				$sql = 'select class_id,student_id from tblclass2student where id='.$classStuId;
				$this->db->sql = $sql;
				$this->db->Queryone();
				$rs = $this->db->rs;
				$studentId = $rs['student_id'];
				$classId = $rs['class_id'];
				
				
				$this->db->sql = <<<SQL
						select * from tblclass where id=$classId;
SQL;
				$this->db->Queryone();
				$classInfo = $this->db->rs;
				$centerId = $classInfo['center_id'];
				$zoneId = $classInfo['zone_id'];
				
				$classType = $classInfo['class_type'];
				
				//统计退出人次数
				$zoneCenterInfo['center_id'] = $centerId;
				$zoneCenterInfo['zone_id'] = $zoneId;
				$statField = $classType==1?'stu_lost_big_count':'stu_lost_small_count';
				$statHandler->stat_zone_center($zoneCenterInfo, $statField);
				
				//查询在不在其他班 如果不在则统计
				
				$num = $studentHandler->check_student_in_other_class($studentId, $classId);
				if($num>0){
					$flag = $flag&&false;
				}else{
					$flag = $flag&&true;
				}
					if($flag){//如果没有在大班、小班当中 统计退出人数
						$zoneCenterInfo['center_id'] = $centerId;
						$zoneCenterInfo['zone_id'] = $zoneId;
						$statField = 'stu_lost_num';
						$statHandler->stat_zone_center($zoneCenterInfo, $statField);
					}
					return $flag;
		}
		
		
		public function stat_add_student_num($classStuId){
				$studentHandler = new student_handler();
				$statHandler = new stat_handler();
				/**
				 * 如果执行退出班级操作：
				 * 该学生如果不在其他班中，则属于过往学生
				 * 检查该学生是否在大班中，是否在小班中
				 */
				$flag = true;
				$sql = 'select class_id,student_id from tblclass2student where id='.$classStuId;
				$this->db->sql = $sql;
				$this->db->Queryone();
				$rs = $this->db->rs;
				$studentId = $rs['student_id'];
				$classId = $rs['class_id'];
				
				
				$this->db->sql = <<<SQL
						select * from tblclass where id=$classId;
SQL;
				$this->db->Queryone();
				$classInfo = $this->db->rs;
				$centerId = $classInfo['center_id'];
				$zoneId = $classInfo['zone_id'];
				
				$classType = $classInfo['class_type'];
				
				//统计退出人次数
				$zoneCenterInfo['center_id'] = $centerId;
				$zoneCenterInfo['zone_id'] = $zoneId;
				$statField = $classType==1?'stu_new_big_count':'stu_new_small_count';
				$statHandler->stat_zone_center($zoneCenterInfo, $statField);
//				print_r($zoneCenterInfo);
				//查询在不在其他班 如果不在则统计
				
				$num = $studentHandler->check_student_in_other_class($studentId, $classId);
//				echo $num;
				if($num>0){
					$flag = $flag&&false;
				}else{
					$flag = $flag&&true;
				}
					if($flag){//如果没有在大班、小班当中 统计退出人数
						$zoneCenterInfo['center_id'] = $centerId;
						$zoneCenterInfo['zone_id'] = $zoneId;
						$statField = 'stu_new_num';
						$statHandler->stat_zone_center($zoneCenterInfo, $statField);
					}
					return $flag;
		}
		
		public function stat_student_month(){
			$this->db->sql = <<<SQL
			insert into stat_student_month(student_id,teacher_id,class_id,year,month,test_error_count,work_error_count,work_total_count,test_total_count,work_submit_count,test_submit_count,work_pi_count,test_pi_count) select student_id,teacher_id,class_id,year,month,test_error_count,work_error_count,work_total_count,test_total_count,work_submit_count,test_submit_count,work_pi_count,test_pi_count from stat_student_view
						ON DUPLICATE KEY UPDATE 
						test_error_count=(select test_error_count from stat_student_view),
						work_error_count=(select work_error_count from stat_student_view),
						work_total_count=(select work_total_count from stat_student_view),
						test_total_count=(select test_total_count from stat_student_view),
						work_submit_count=(select work_submit_count from stat_student_view),
						test_submit_count=(select test_submit_count from stat_student_view),
						work_pi_count=(select work_pi_count from stat_student_view),
						test_pi_count=(select test_pi_count from stat_student_view);
SQL;
			$this->db->ExecuteSql();
			return $this->db->rs;
		}
		
		public function stat_student_count($whereInfo){
				if(isset($whereInfo['center_id'])){
					$table = 'stat_center_day';
					$field = 'center_id';
				}else if(isset($whereInfo['zone_id'])){
					$table = 'stat_zone_day';
					$field = 'zone_id';
				}
				$sqlCount = 'select 
							IFNULL((sum(stu_new_big_count)-sum(stu_lost_big_count)),0) as stu_big_count,
							IFNULL((sum(stu_new_small_count)-sum(stu_lost_small_count)),0) as stu_small_count
							from '.$table.' where day<"'.date('Y-m-d').'" and '.$field.'='.$whereInfo[$field];
				
				$this->db->sql = $sqlCount;
				$this->db->Queryone();
				$dataRs = $this->db->rs;
				$sqlUpdate = 'update '.$table.' set stu_total_count=stu_total_count+('.$dataRs['stu_big_count'].'+'.$dataRs['stu_small_count'].'),'.
										'stu_big_count='.$dataRs['stu_big_count'].',stu_small_count='.$dataRs['stu_small_count'].
										' where day="'.date("Y-m-d",(time()-24*3600)).'" and '.$field.'='.$whereInfo[$field];
				$this->db->sql = $sqlUpdate;
				$this->db->ExecuteSql();
		}
		
		/**
		 * 查询是否存在学生在其他班级里面
		 */
		public function check_student_in_other_class($studentId,$classId){
			$this->db->sql = <<<SQL
										select count(*) as num from tblclass2student left join tblclass on tblclass.id=tblclass2student.class_id 
										where tblclass2student.student_id=$studentId and tblclass2student.class_id!=$classId;
SQL;
			$this->db->Queryone();
			$rs = $this->db->rs;
			$num = $rs['num']?$rs['num']:0;
			return $num;	
		}
		
		public function get_student_id_class_id($classStuId){
			$this->db->sql = <<<SQL
				select * from tblclass2student where id=$classStuId;
SQL;
			$this->db->Queryone();
			return $this->db->rs;
		}
		
		
		public function get_student_center_zone_info($userId){
			$this->db->sql = <<<SQL
									select tblclass.center_id,tblclass.zone_id from tblclass 
									left join tblclass2student on tblclass.id=tblclass2student.class_id
									left join tblstudent on tblstudent.id=tblclass2student.student_id
									where tblstudent.user_id=$userId group by tblclass.center_id,tblclass.zone_id;
SQL;
			$this->db->Query();
			return $this->db->rs;
		}
		
		public function get_student_exericise($userId,$type,$offset,$step,$examType=null){
			$sql = <<<SQL
					select 
								study_exercise.pi,
								study_exercise.id as study_exercise_id,
								
								tbltest_report.id as trid,
								
								teach_exam_list.content,
								teach_exam_list.conditions,
								teach_exam_list.name,
								teach_exam_list.exam_type,
								study_exercise.create_date as creat_date,
								study_exercise.exercise_id,
								teach_exam_list.subject_id,
								study_exercise.my_score,
								study_exercise.log_time,
								study_exercise.class_id as class_id,
                                tblclass.class_name,
                                tblclass_history.class_name as pass_class_name,
                                a.center_name,
                                b.zone_name,
                                c.id as center_id,
                                d.id as zone_id,
                                c.center_name as teacher_center_name,
                                d.zone_name as teacher_zone_name,
								tbluser.realname,
								tbluser.id as student_id,
								study_exercise.type as type,
								study_exercise.assign_type,
								teach_exam_list.teacher_id as creator_id,
								teach_assign_list.creator_name as teacher_name,
								teach_assign_list.end_date as assign_end_date,
								teach_assign_list.create_date as assign_create_date
								from
								study_exercise 
								left JOIN teach_exam_list ON study_exercise.exercise_id=teach_exam_list.id
                                 
								left JOIN tbluser on tbluser.id=study_exercise.user_id
								left JOIN teach_assign_list ON teach_assign_list.id=study_exercise.assign_id
                                left JOIN tblclass on study_exercise.class_id = tblclass.id
                                left JOIN tblclass_history on study_exercise.class_id = tblclass_history.old_id
                                left JOIN tblcenter a on a.id=tblclass.center_id or a.id=tblclass_history.center_id
                                                         
                                left JOIN tblcenterzone b on b.id=tblclass.zone_id or b.id=tblclass_history.zone_id	
                                left join tblcenter c on c.id=teach_assign_list.center_id
                                left join  tblcenterzone d on d.id=teach_assign_list.zone_id
                                
                                
                                LEFT JOIN tbltest_report on tbltest_report.study_exercise_id=study_exercise.id
SQL;
				$where = <<<SQL
								where study_exercise.user_id=$userId and study_exercise.assign_type=1  
SQL;
				if($examType){
					$where.=<<<SQL
										  and study_exercise.exam_type=$examType
SQL;
				}else{
					$where.=<<<SQL
										  and study_exercise.exam_type!=6
SQL;
				}
				$whereNew = <<<SQL
								and study_exercise.type in (1,4) 
SQL;
				$wherePi = <<<SQL
								and study_exercise.type in (2,3) 
SQL;
				$groupBy = <<<SQL
								group by study_exercise.id
SQL;
				$order = <<<SQL
				order by study_exercise.create_date desc;
SQL;
				if($type=='new'){
					$condtion = $whereNew;
				}elseif($type=='pi'){
					$condtion = $wherePi;
				}else{
					$condtion = '';
				}
				
				$this->db->sql = $sql.$where.$condtion.$groupBy.$order;
				//echo $this->db->sql;
				//exit;
				$this->db->Query();
				$rs = $this->db->rs;
				if($offset||$step){
					$rs = array_slice($rs, $offset,$step);
				}else{
					$rs = $rs;
				}
				$num = count($rs);
				
				$result['list'] = $rs;
				$result['count'] = $num;
				return $result;
		}
		
		
		public function get_student_teacher_relation_view($status,$offset,$step){
				$nowSql = <<<SQL
								 SELECT a.id as student_user_id,
							        a.realname as student_realname ,
							        a.username as student_username ,
							        b.id as teacher_user_id,
							        b.realname as teacher_realname,
							        tblstudent.id as student_id,
							        tblclass.id as class_id,
							        tblclass.class_name,
							        tblclass.center_id,
							        tblclass.zone_id,
							        tblclass.status,
							        tblclass.class_type,
							        tblclass.begin_date,
							        tblclass.end_date,
							        tblclass.num_max,
							        tblclass2student.create_date,
						        	tblteacher.subject_id
						     from tblstudent 
						     left join tblclass2student on tblstudent.id=tblclass2student.student_id
						     left join tblclass on tblclass2student.class_id=tblclass.id
						     left join tblclass2teacher on tblclass2student.class_id=tblclass2teacher.class_id
						     left join tblteacher on tblclass2teacher.teacher_id=tblteacher.id
						     left join tbluser a on a.id=tblstudent.user_id
						     left join tbluser b on b.id=tblteacher.user_id 
SQL;
			$passSql = <<<SQL
							 SELECT a.id as student_user_id,
							        a.realname as student_realname ,
							        a.username as student_username ,
							        b.id as teacher_user_id,
							        b.realname as teacher_realname,
							        tblstudent_history.old_id as student_id,
							        tblclass_history.old_id as class_id,
							        tblclass_history.class_name,
							        tblclass_history.center_id,
							        tblclass_history.zone_id,
							        tblclass_history.status,
							        tblclass_history.class_type,
							        tblclass_history.begin_date,
							        tblclass_history.end_date,
							        tblclass_history.num_max,
							        tblclass2student_history.create_date,
						        	tblteacher_history.subject_id
						     from tblstudent_history 
						     left join tblclass2student_history on tblstudent_history.id=tblclass2student_history.student_id
						     left join tblclass_history on tblclass2student_history.class_id=tblclass_history.old_id
						     left join tblclass2teacher on tblclass2student_history.class_id=tblclass2teacher.class_id
						     left join tblteacher_history on tblclass2teacher.teacher_id=tblteacher_history.old_id
						     left join tbluser a on a.id=tblstudent_history.user_id
						     left join tbluser b on b.id=tblteacher_history.user_id 
SQL;
			$where = <<<SQL
			
SQL;
			$limit = <<<SQL
							LIMIT $offset,$step
SQL;
			$this->db->Query();
			return $this->db->rs;
		}
		
		
		public function get_student_exericse_list($userId,$exerciseId,$examType,$offset,$step){
			$sql = <<<SQL
										select study_exercise.my_score,study_exercise.create_date from study_exercise 
										
										left join teach_self_list on teach_self_list.id=study_exercise.exercise_id
										
										where study_exercise.user_id=$userId and study_exercise.type=2 and teach_self_list.exam_id=$exerciseId and teach_self_list.exam_type=$examType
										
										order by study_exercise.create_date desc 
SQL;
			if($offset||$step){
				$limit = <<<SQL
									LIMIT $offset,$step;
SQL;
			}else{
				$limit = ';';
			}
			
			$this->db->sql = $sql.$limit;
			
			$this->db->Query();
			return $this->db->rs;
		}
		
		/**
		 * 修改用户等级
		 */
		public function post_change_student_level($userId,$data){
//								ini_set('display_errors', 'On');
//					error_reporting(E_ALL);
			$subjectId = $data['subject_id'];
			$sectionId = $data['section_id'];
			$examId = $data['exercise_id'];//专题ID
			$level   = $data['level'];
			$dataTmp['user_id'] = $userId;
			$dataTmp['study_exercise_id'] = $data['study_exercise_id'];
			$dataTmp['correct_rate'] = $data['correct_rate'];
//			$dataTmp['correct_rate'] = '0.9';
			$dataTmp['subject_id'] = $data['subject_id'];
			$dataTmp['level'] = $data['level'];
			$dataTmp['exam_type'] = $data['exam_type'];
			$dataTmp['section_id'] = $data['section_id'];
			$dataTmp['create_date'] = 'now()';
			$this->db->insert('study_exercise_correct_rate',$dataTmp);
			if($this->db->rs===false){
				
			}else{
				$this->db->sql = <<<SQL
											select * from tblstudent_level_study where user_id=$userId and exam_id=$examId and section_id=$sectionId and subject_id=$subjectId ;
SQL;
				$this->db->Query();
				$rsLevel = $this->db->rs;
				if(count($rsLevel)>0){ //如果存在
						$this->db->sql = <<<SQL
									select study_exercise_correct_rate.* from study_exercise_correct_rate
									left join study_exercise on  study_exercise.id=study_exercise_correct_rate.study_exercise_id
									left join teach_self_list on teach_self_list.id=study_exercise.exercise_id
									where study_exercise_correct_rate.user_id=$userId and study_exercise_correct_rate.subject_id=$subjectId 
									and study_exercise_correct_rate.section_id=$sectionId and teach_self_list.exam_id=$examId 
									order by study_exercise_correct_rate.create_date desc limit 0,3
SQL;
						$this->db->Query();
						
						
//					echo '<pre>';
//					print_r($this->db);
//					exit;
						$rateRs = $this->db->rs;
						
						if(count($rateRs)==3){//存在三次 遍历判断
							$addflag = true;//进阶标识
							$removeFlag = true;//降阶标识
							$level1=$rateRs[0]['level'];
							$level2=$rateRs[1]['level'];
							$level3=$rateRs[2]['level'];
							$levelArray[] = $level1;
							$levelArray[] = $level2;
							$levelArray[] = $level3;
							$levelFlag = count(array_flip(array_flip($levelArray)))==1?true:false;
//							echo $level1.PHP_EOL;
//							echo $level2.PHP_EOL;
//							echo $level3.PHP_EOL;

							 foreach ($rateRs as $key=>$value){
									 $rate = $value['correct_rate'];
									 $level = $value['level'];
									 if($rate>=0.8&&$levelFlag){
									 	$addflag&=true;
									 	$removeFlag&=false;
									 }else if($rate<0.8&&$levelFlag){
									 	$addflag&=false;
									 	$removeFlag&=true;
									 }else {
									 	$addflag&=false;
									 	$removeFlag&=false;
									 }
							 }
							 //获取用户当前的level
							 
							$userLevelInfo = $this->get_student_study_level($userId, $sectionId, $subjectId, $examId);
							
							$userLevel = $userLevelInfo['level'];
							
							 	
							$level = utils_handler::user_level();
							 
							
							 if($addflag){
							 	if($userLevel<$level['max']){
							 		$data['level'] = $userLevel+1;
							 		//进阶
							 		$rs = $this->change_student_level_base($userId, $data);
							 		$level = $data['level'] ;
							 		$reason =  'up';
							 	}
							 	
							 	
							 	if($userLevel==$level['max']){ //升级到头
							 		$level = $data['level'] ;
							 		$reason =  'no';
							 	}
							 	
							 }
							 
							 if($removeFlag){
							 	
							 	if($userLevel>$level['min']){
							 		
							 		//降阶
							 		$data['level'] = $userLevel-1;
							 		$rs = $this->change_student_level_base($userId, $data);
							 		$level =$data['level'] ;
							 		$reason =  'down';
							 	}
							 	
							 if($userLevel==$level['min']){ //降级到底
							 		$level = $data['level'] ;
							 		$reason =  'no';
							 	}
							 	
							 }
							 
							 else if(!$removeFlag&&!$addflag) {
							 							
									$level = $data['level'] ;
							 		$reason =  'no';
							 
							 }
							 
							
						}else{
							
									$level = $data['level'] ;
							 		$reason =  'no';
						}
					
					
				}else{//不存在先插入一条
					$rs  = $this->change_student_level_base($userId, $data);
					$level = $data['level'] ;
					$reason =  'in';
				}
				
				$result['level'] = $level;
				$result['reason'] = $reason;
				return $result;
			}
			
		}

		public function  change_student_level_base($userId,$data){
				$dataUserLevle['user_id']  = $userId;
				$dataUserLevle['level'] = $data['level'];//试题难度 为学生的level
				$dataUserLevle['exam_id'] = $data['exercise_id'];//专题ID
				$dataUserLevle['subject_id'] = $data['subject_id'];//学科
				$dataUserLevle['section_id'] = $data['section_id'];//学段
				$dataUserLevle['exam_type'] = $data['exam_type'];//类型
				$dataUserLevle['create_date'] = 'now()';
				$this->db->insert('tblstudent_level_study',$dataUserLevle);
//				echo'<pre>';
//				print_r($this->db);
//				exit;
				if($this->db->rs!==false){
					return true;
				}else{
					return false;
				}
		}

		
		
		
		public function  update_student_level_test_base($userId,$data){//不断插入 保留日志
				$dataUserLevle['user_id']  = $userId;
				$dataUserLevle['level'] = $data['level'];//试题难度 为学生的level
				$dataUserLevle['exam_id'] = $data['exercise_id'];//专题ID
				$dataUserLevle['subject_id'] = $data['subject_id'];//学科
				$dataUserLevle['section_id'] = $data['section_id'];//学段
				$dataUserLevle['exam_type'] = $data['exam_type'];//类型
				$dataUserLevle['create_date'] = 'now()';
				
				$examId = $data['exercise_id'];
				$subjectId = $data['subject_id'];
				$sectionId = $data['section_id'];
				$examType = $data['exam_type'];
				$this->db->insert('tblstudent_level_test',$dataUserLevle);
				if($this->db->rs!==false){
					return true;
				}else{
					return false;
				}
		}
		
		
		/**
		 * 查询最新的学生 学习level
		 * @param  $userId
		 */
		public function get_student_study_level($userId,$sectionId,$subjectId,$examId){
			$rs = $this->get_student_level_base($userId, $sectionId, $subjectId, $examId,'tblstudent_level_study');
			return $rs['0'];
		}	
		
		/**
		 * 查询最新的学生 测评level
		 * @param  $userId
		 */
		
		public function get_student_test_level($userId,$sectionId,$subjectId,$examId){
			$rs = $this->get_student_level_base($userId, $sectionId, $subjectId, $examId,'tblstudent_level_test');
			return $rs['0'];
		}
		
		public function get_student_level_base($userId,$sectionId,$subjectId,$examId,$table){
			$this->db->sql = <<<SQL
										select level from $table 
										where user_id=$userId and exam_id=$examId and section_id=$sectionId and subject_id=$subjectId 
										order by create_date desc 
SQL;
			$this->db->Query();
			return $this->db->rs;
		}	
		
		
		public function get_student_notes_list($userId,$sectionId,$subjectId,$examType){
			
			if($sectionId=='2'){
				$gradeId = '18';
			}else if($sectionId=='3'){
				$gradeId = '19';
			}
			
			$eduInfo = utils_handler::get_edu_info ( $subjectId );
			$this->db->sql = <<<SQL
									select exam_id,dbtype from tblstudent_notes where user_id=$userId and grade=$gradeId and subject_id=$subjectId and exam_type=$examType
									group by exam_id order by create_date ;
SQL;
			$this->db->Query();
			
			$notesInfo = $this->db->rs;
			if(count($notesInfo)>0){
				foreach ($notesInfo as $key=>$value){
						$examId = $value['exam_id'];
						if($dbtype==1){
							$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
									
						}else{
							
						}
						if($examType=='2'||$examType=='7'){
							$zhuantiTable = $eduInfo ['edu_zhuanti'];
							$this->db->sql = 'SELECT name FROM ' . $zhuantiTable . ' WHERE id=' . $examId;
							$this->db->Queryone();
							$examName = $this->db->rs['name'];
							$notesInfo[$key]['name'] = $examName;
						}
				}
			}
			
			return $notesInfo;
		}
}