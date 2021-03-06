<?php
class teacher_handler extends user_handler{
	
	public function get_teacher_info($teacherId){
		$this->db->sql = <<<SQL
									select tbluser.* from tblteacher left join tbluser on tbluser.id=tblteacher.user_id where tblteacher.id=$teacherId;
SQL;
		$this->db->Queryone();
		return $this->db->rs;
	}
	
	public function get_teacher_info_by_user_id($teacherUserId){
			$this->db->sql = <<<SQL
									select tbluser.*,tblteacher.id as teacher_id 
									from tblteacher 
									left join tbluser on tbluser.id=tblteacher.user_id where tbluser.id=$teacherUserId;
SQL;
		$this->db->Queryone();
		return $this->db->rs;
	}
	/**
	 * 
	 * @param  $realname
	 * @param  $center_id
	 * @param  $zone_id
	 */
	public  function get_teacher_info_by_realname($realname , $center_id , $zone_id){
			$tblUser = array(
				'tbluser',
				'id' , 'username' , 'realname' , 'gender' , 'tel' , 'email' , 'note' , 'reg_time' , 'usr_type'
			);
			
			$tblTeacher = array(
				'tblteacher',
				'subject_id' , 'level' , 'center_id' , 'zone_id' , 'level'
			);
			
			$tblSubject = array(
				'edu_subject',
				'Name as subject_name'
			);
			
			$tblCenterZone =array(
				'tblcenterzone',
				'zone_name'
			);
			
			$queryCondition = array(
				'tbluser.id=tblteacher.user_id',
				'tblteacher.subject_id=edu_subject.id',
				'tblteacher.zone_id=tblcenterzone.id',
				'where'=>'tbluser.realname="'.$realname.'" AND tblteacher.center_id='.$center_id.' AND tblteacher.zone_id!='.$zone_id.' group by tbluser.id'
			);
		
			$result= $this->db->withQueryMakerLeft($tblUser,$tblTeacher,$tblSubject,$tblCenterZone , $queryCondition);
			return $result;
		}
	/**
	 * 返回值tblteacher ID
	 * @param  $userId 老师user_id
	 */
	public function get_teacher_id($userId){
		$this->db->sql =<<<SQL
									select id from tblteacher where user_id=$userId;
SQL;
		$this->db->Queryone();
		$rs = $this->db->rs;
		if($rs){
			return $rs['id'];
		}else{
			return false;
		}
	}
	
		public function get_teacher_list($offset , $step , $condition){
			
			$tables = array('tblUser' , 'tblTeacher' , 'tblSubject','tblClass2Student','tblClass2Teacher','tblStudent','tblCenterZoneAdmin');
			
			$tblUser = array(
				'tbluser',
				'id as user_id' , 'username' , 'realname' , 'gender' , 'tel' , 'email' , 'note' , 'reg_time' , 'usr_type'
			);
			
			$tblTeacher = array(
				'tblteacher',
				'id' , 'subject_id' , 'level' , 'level'
			);
			
			$tblCenterZoneAdmin = array(
				'tblcenterzoneadmin',
				'id as centerzoneadmin_id','status','zone_id'	
			);
			$tblSubject = array(
				'edu_subject',
				'Name as subject_name'
			);
			$tblClass2Student = array(
				'tblclass2student',
				'student_id'
			);
			$tblClass2Teacher = array(
				'tblclass2teacher',
				'teacher_id','class_id'
			);
			$tblStudent = array(
					'tblstudent'
			);
			$queryCondition = array(
				'tbluser.id=tblteacher.user_id',
				'tblteacher.subject_id=edu_subject.id',
				'tbluser.id=tblcenterzoneadmin.user_id',
			);
			
			
			
			$queryCondition1 = array(
				'tblclass2student.class_id=tblclass2teacher.class_id',
				'tblclass2student.student_id=tblstudent.id',
				'tblstudent.user_id=tbluser.id'
			);
			
		$tablesInfo = array($tblUser,$tblTeacher,$tblCenterZoneAdmin,$tblSubject,$tblClass2Student,$tblClass2Teacher,$tblStudent);	
		$where = utils_handler::analytic_condition($tablesInfo,$condition);
		
		
		$conditionArray = utils_handler::analytic_condition2array($condition);
		
		
		if(count($conditionArray)>0){
			foreach ($conditionArray as $key=>$value){
				if(strstr($value, 'center_id')){
					$centerIdInfo = explode('=', $value);
					$centerId = $centerIdInfo['1'];
				}else if(strstr($value, 'zone_id')){
					$zoneIdInfo = explode('=', $value);
					$zoneId = $zoneIdInfo['1'];
				}
			}
		}
		
		$queryCondition['order'] = 'reg_time desc';
			if(!$offset && !$step){
				
			}else{
				$queryCondition['limit'] = $offset.','.$step;
			}
			
			if($where != ''){
				$queryCondition['where'] = $where.' group by tbluser.id';
				$queryCondition['order'] = 'reg_time desc';
			}
			
			$queryConditionNum = $queryCondition;
			unset($queryConditionNum['limit']);
			$rs = $this->db->withQueryMakerLeft($tblUser , $tblTeacher , $tblSubject ,$tblCenterZoneAdmin, $queryCondition);
//			echo '<pre>';
//			print_r($this->db);
//			exit;
			$rsTmp = $this->db->withQueryMakerLeft($tblUser , $tblTeacher , $tblSubject ,$tblCenterZoneAdmin, $queryConditionNum);
			$count = count($rsTmp);
			$teacherId = array();//选择老师的id
			foreach ($rs as $key=>$value){
				$teacherId[] = $value['id'];
				$rs[$key]['big_class_current'] = $this->get_teacher_taught_student($value['id'],$classId='', $status=1, $classType=1,true,$centerId,$zoneId);
				$rs[$key]['big_class_pass'] = $this->get_teacher_taught_student($value['id'],$classId='', $status=0, $classType=1,false,$centerId,$zoneId);
				$rs[$key]['small_class_current'] = $this->get_teacher_taught_student($value['id'],$classId='', $status=1, $classType=2,true,$centerId,$zoneId);
				$rs[$key]['small_class_pass'] = $this->get_teacher_taught_student($value['id'],$classId='', $status=0, $classType=2,false,$centerId,$zoneId);
			}
			$data['list'] = $rs;
			$data['count'] = $count;
			return $data;
		}
		
		
		
		public function add_teacher($creatorId,$teacherInfo){
			$userInfo = $this->get_user_info($creatorId);
			$statHandler = new stat_handler();
			$newUserInfo = array(
				'username'=>$teacherInfo['username'],
				'realname'=>$teacherInfo['realname'],
				'gender'=>$teacherInfo['gender'],
				'passwd'=>$teacherInfo['passwd'],
				'last_login_time'=>'now()',
				'last_loginlocation'=>utils_handler::get_real_ip(),
				'usr_type'=>$teacherInfo['usr_type'],
				'reg_time'=>'now()',
				'email'=>$teacherInfo['email'],
				'tel'=>$teacherInfo['tel'],
				'note'=>$teacherInfo['note'],
				'yanzheng'=>0
			);
			$resultUser = $this->add_table_base_info($table='tbluser', $newUserInfo);
			if($resultUser){
				$user_id = $resultUser;
				$newTeacherInfo = array(
					'center_id'=>$teacherInfo['center_id'],
					'zone_id'=>$teacherInfo['zone_id'],
					'subject_id'=>$teacherInfo['subject_id'],
					'level'=>$teacherInfo['level'],
					'user_id'=>$user_id,
					'creator'=>$creatorId,
					'creator_name'=>$userInfo['username'],
					'create_date'=>'now()'
				);
				
				//添加统计信息
				$teacherInfo['user_id'] = $user_id;
				$statHandler->stat_teacher($teacherInfo, $statField);//$statField 为空则为默认
				
				$resultTeacher = $this->add_table_base_info($table='tblteacher', $newTeacherInfo);
				if($resultTeacher){
					$insertInfo = array(
						'zone_id'=>$teacherInfo['zone_id'],
						'role'=>'1',
						'user_id'=>$user_id,
					);
					
					$result = $this->add_table_base_info($table='tblcenterzoneadmin', $insertInfo);
					$rs = array();
					if($result){
						$rs['reason'] = 'success';
						$rs['flag'] = true;
						$rs['sc'] = 200;
						return $rs;
					}else{
						$rs['reason'] = 'insert tblcenterzoneadmin failed';
						$rs['flag'] = false;
						$rs['sc'] = 400;
						return $rs;
					}
				}else{
						$rs['reason'] = 'insert teacher failed';
						$rs['flag'] = false;
						$rs['sc'] = 400;
						return $rs;
				}
			}else{
						$rs['reason'] = 'insert user failed';
						$rs['flag'] = false;
						$rs['sc'] = 400;
						return $rs;
			}
			
			
		}
		
		/**
		 * 
		 * @param  $teacherId  tblteacher 表 ID
		 */
		public function get_teacher_in_class($teacherId,$classId='',$classType=''){
			$sql =<<<SQL
										SELECT count(*) as num,tblclass2teacher.class_id,tblteacher.user_id as teacher_user_id  from tblclass2teacher 
										LEFT JOIN tblclass ON tblclass.id=tblclass2teacher.class_id
				           				LEFT JOIN tblteacher ON tblteacher.id=tblclass2teacher.teacher_id
										WHERE tblclass2teacher.teacher_id=$teacherId 
SQL;
			if($classId){
				$sql.= ' AND tblclass2teacher.class_id='.$classId;
			}
			
			if($classType){
				$sql.= ' AND tblclass.class_type=='.$classType;
			}
			$this->db->sql=$sql;;
			$this->db->Queryone();
			$rs = $this->db->rs;
			if($rs['num']){
				return $rs;
			}else{
				return false;
			}
		}
		
		public function get_teacher_in_class_by_user_id($userId,$classType,$centerId,$zoneId){
			$studentHandler = new student_handler();
			$date = date('Y-m-d',(time()));
			$sql = 'SELECT tblclass.*,tblclass2teacher.teacher_id,tblteacher.user_id FROM tblclass 
			left join tblclass2teacher on tblclass2teacher.class_id=tblclass.id
			left join tblteacher on tblteacher.id=tblclass2teacher.teacher_id
			WHERE tblclass.center_id='.$centerId.
			' AND tblclass.zone_id='.$zoneId.
			' AND tblclass.class_type='.$classType.
			' AND tblteacher.user_id='.$userId;
//			' AND tblclass.end_date>="'.$date.'"'; 现在不筛选 过期的班级
			
			$this->db->sql = $sql;
			$this->db->Query();
			$classRs = $this->db->rs;
			
			$class =array();
			foreach ($classRs as $key=>$value){
				$class[] = $value['id'];
			}
			
//			if(count($class)>0){
//				$classIdStr = '"'.implode('","', $class).'"';
//			}
			
			$teacher = $this->get_teacher_of_class($class);
			$student = $studentHandler->get_student_of_class($class);
			$result['list'] = $classRs;
			$result['teacher'] = $teacher;
			$result['student'] = $student;
			return  $result;
		}

		/**
		 * 
		 * 根据classId 返回对应老师的userId
		 * @param  $classId
		 */
		public function get_teacher_user_id_by_classid($classId){
			$this->db->sql = <<<SQL
										select tblteacher.user_id as teacher_user_id
										from tblteacher 
										left join tblclass2teacher on tblteacher.id=tblclass2teacher.teacher_id
										where tblclass2teacher.class_id=$classId;
SQL;
			$this->db->Query();
			return $this->db->rs;
		}
		
		/**
		 * 老师教过的学生 当前/过往 数量
		 * @param  $teacherId
		 * @param  $classId
		 * @param  $status
		 */
		public function get_teacher_taught_student($teacherId,$classId='',$status,$classType,$current=true,$centerId=NULL,$zoneId=NULL){
			
		
		$sqlPass = <<<SQL
			select tblclass2student_history.student_id,tblclass2student_history.class_id from tblclass2student_history 
			left join tblclass_history on  tblclass2student_history.class_id=tblclass_history.old_id
			left join tblclass2teacher_history on tblclass2teacher_history.class_id = tblclass_history.old_id 
			
			
SQL;
		$wherePassSql = <<<SQL
									where tblclass2student_history.operate_status=$status and tblclass2teacher_history.teacher_id=$teacherId and tblclass_history.class_type=$classType 
SQL;
		if($centerId||$zoneId){
			$wherePassSql .= <<<SQL
									 and tblclass_history.center_id=$centerId and tblclass_history.zone_id=$zoneId	  
SQL;
		}
		$groupPassSql = <<<SQL
									group by tblclass2student_history.student_id,tblclass2student_history.class_id;
SQL;
		$sqlCurrent = <<<SQL
					select count(distinct student_id) as num from tblclass2student 
					left join tblclass on  tblclass2student.class_id=tblclass.id 
					left join tblclass2teacher on tblclass2teacher.class_id = tblclass.id 
SQL;

		
		$whereCurrentSql = <<<SQL
									where tblclass2student.status=$status and tblclass2teacher.teacher_id=$teacherId and tblclass.class_type=$classType
SQL;

		if($centerId||$zoneId){
			$whereCurrentSql .= <<<SQL
									 and tblclass.center_id=$centerId and tblclass.zone_id=$zoneId  
SQL;
		}
		
		$groupCurrentSql = <<<SQL
										group by tblclass2student.student_id,tblclass2student.class_id;
SQL;
			$sql = $current==true?$sqlCurrent.$whereCurrentSql:$sqlPass.$wherePassSql.$groupPassSql;
			$this->db->sql = $sql;
			$this->db->Query();
			$rs = $this->db->rs;
			if($current){
				$num = $rs['0']['num'];
			}else{
				$num = count($rs);
			}
			$result['count'] =$num;
			return $result;
		}

		/**
		 * 
		 * 获取在班级下面的老师
		 * @param  $classIds
		 * @param  $fresh
		 */
		public function get_teacher_of_class($classIds,$fresh=true){
			$flag = is_array($classIds);
			$table = $fresh?'tblclass2teacher':'tblclass2teacher_history';
			$id =$fresh?'id':'old_id as id';
			$operateStatus = $fresh?(''):(' and '.$table.'.operate_status=0');
			$teacherWhere =$flag?($table.'.class_id in ('. implode(',' , $classIds) .')'):($table.'.class_id in ('.$classIds.')');
			$teacherWhere.=' and '.$table.'.status=1';
			
			$tblClass2teacher = array(
				$table,
				$id , 'class_id' , 'teacher_id' , 'status' 
			);
			
			$tblTeacher = array(
				'tblteacher',
				'user_id' , 'subject_id'
			);
			$tblUser = array(
				'tbluser',
				'username' , 'realname'
			);
			
			$conditionTeacher = array(
				$table.'.teacher_id=tblteacher.id',
				'tblteacher.user_id=tbluser.id',
				'where'=>$teacherWhere.$operateStatus
			);
			$result = $this->db->withQueryMakerLeft($tblClass2teacher , $tblTeacher , $tblUser , $conditionTeacher);
//			if(!$fresh){
//				echo $this->db->sql;
//				exit;
//			}
			return $result;
		}
		
		
		/**
		 * 
		 * 老师聘用状态切换
		 * @param  $teacherUserId
		 * @param  $centerId
		 * @param  $zoneId
		 */
		public function switch_teacher_employment_status($teacherUserId,$centerId,$zoneId){
			$studentHandler = new student_handler();
			$classHandler = new class_handler();
			
			$whereArray = array();
			$whereArray['user_id'] = $teacherUserId;
			$whereArray['zone_id'] = $zoneId;
			$tableAdmin = 'tblcenterzoneadmin';
			$tableTeacher = 'tblteacher';
			$operateStatus = '0';
			$students = $studentHandler->get_student_by_teacher_user_id($teacherUserId, $centerId, $zoneId);
			

			
			
			if(count($students)>0){
				return false;
			}else{
				
				//管理员关系移入历史表 tblcenterzoneadmin_history
				$this->add_table_history_info($tableAdmin, $whereArray, $operateStatus);
				//管理员关系清空 tblcenterzoneadmin
				$this->remove_table_info($tableAdmin, $whereArray);
				
				
				$teacherInfo = $this->get_teacher_info_by_user_id($teacherUserId);
			
			
				$teacherId = $teacherInfo['teacher_id'];
			
			
				$classInfo = $this->get_teacher_class_id($teacherId,'',$zoneId);//查询该老师在这个校区下面所带的班级
			
				if(count($classInfo)>0){
					foreach ($classInfo as $key=>$value){
							$classId = $value['class_id'];
							$data['id']=$classId;
							//同时将建立的班级也移入历史表(空的一对一班级) 
							if($classId){
								$teacherUserIdArray = $this->get_teacher_user_id_by_classid($classId);
								
								if(count($teacherUserIdArray)<=1){//同时查询该老师所带班级是否存在其他老师，如果存在则不移入历史
									$this->add_table_history_info('tblclass', $data, $operateStatus);
									$this->remove_table_info('tblclass', $data);
								}
								
							}
							
					}
				}
				
				
				$this->add_table_history_info($tableTeacher, $whereArray, $operateStatus);
				$this->remove_table_info($tableTeacher, $whereArray);
				return true;
			}
		}
		
		/**
		 * 
		 * @param  $centerId  //中心下面的实际老师数
		 */
		public function get_teacher_count($centerId){
			$this->db->sql = <<<SQL
										select count(*) as num  from tblteacher where center_id='$centerId' and zone_id!=0;
SQL;
			$this->db->Queryone();
			return $this->db->rs['num'];
		}
		
		/**
		 * 
		 * @param  $teacherUserId
		 * @param  $centerId
		 * @param  $zoneId
		 */
		public function check_teacher_in_small_class($teacherUserId,$centerId,$zoneId){
			$this->db->sql = <<<SQL
				SELECT count(*) as num,tblclass2teacher.class_id  from tblclass2teacher 
								LEFT JOIN tblclass ON tblclass.id=tblclass2teacher.class_id 
								LEFT JOIN tblteacher ON tblteacher.id=tblclass2teacher.teacher_id 
								WHERE tblclass.class_type=2 and tblteacher.user_id=$teacherUserId and tblclass.center_id=$centerId and tblclass.zone_id=$zoneId;	
SQL;
			$this->db->Queryone();
			$num = $this->db->rs['num'];
			$flag = $num?true:false;
			return $flag;
		}
		
		/**
		 * 
		 * @param  $teacherUserId
		 * @param  $centerId
		 * @param  $zoneId
		 */
		public function get_teacher_list_not_in_small_class($condition){
				$conditionArray = utils_handler::analytic_condition2array($condition);
				foreach ($conditionArray as $key=>$value){
					if(strpos ( $value, 'center_id' ) !== false){
						$tmp = explode ( '=', $value );
						$centerId = $tmp[1];
					}
					if(strpos ( $value, 'zone_id' ) !== false){
						$tmp = explode ( '=', $value );
						$zoneId = $tmp[1];
					}
				}
				$teacherList = $this->get_teacher_list($offset=null, $step=null, $condition);
				if(count($teacherList['list'])>0){
					foreach ($teacherList['list'] as $key=>$value){
						$result = $this->check_teacher_in_small_class($value['user_id'], $centerId, $zoneId);
						if($result){
							unset($teacherList['list'][$key]);
						}
					}
				}
				return $teacherList['list'];
		}
		
		
		/**
		 * $teacherId = array();//选择老师的id
		 * @param  $teacherId
		 */
		public function get_teacher_class($teacherId){
			$classId = array(); // array(); 以teacher_id 为key 以class_id 为value
			//查询老师带过的班级
			foreach ($teacherId as $value){
				$sql = 'select class_id from tblclass2teacher where teacher_id='.$value.';';
				$this->db->sql = $sql;
				$this->db->Query();
				$classId[$value] = $this->db->rs;
			}
			
			foreach ($teacherId as $value){
				$sql = 'select distinct class_id from tblclass2teacher_history where teacher_id='.$value.';';
				$this->db->sql = $sql;
				$this->db->Query();
				$classId[$value] = $this->db->rs;
			}
			
			return $classId;
		}
		
		/**
		 * 获取老师对应班级的学生数
		 * @param  $classId
		 * @param  $classType
		 * @param  $status
		 */
		public function get_teacher_stu_num($classId,$classType,$status,$centerId=NULL,$zoneId=NULL){
			$sqlNow = <<<SQL
				select count(*) as num from tblclass2student 
				left join tblclass on tblclass.id=tblclass2student.class_id 
SQL;
			$sqlNow.=<<<SQL
					where tblclass.class_type=$classType and tblclass2student.class_id=$classId and tblclass2student.status=$status
SQL;
			if($centerId||$zoneId){
				$sqlNow.=<<<SQL
					and tblclass.center_id=$centerId and tblclass.zone_id=$zoneId;
SQL;
			}
			
			
			$sqlPass = <<<SQL
							select count(distinct student_id) as num from tblclass2student_history 
							left  join tblclass_history on tblclass_history.old_id=tblclass2student_history.class_id 
			
SQL;

			$sqlPass.=<<<SQL
							where tblclass_history.class_type=$classType and tblclass2student_history.class_id=$classId and tblclass2student_history.operate_status=$status 
SQL;
			if($centerId||$zoneId){
							$sqlPass.=<<<SQL
							and tblclass_history.center_id=$centerId and tblclass_history.zone_id=$zoneId;
SQL;
			}
			
			$this->db->sql = $status=='1'?$sqlNow:$sqlPass;
//			if($classType==2&&$status=='0'){
//				echo $this->db->sql;
//			}
			$this->db->Queryone();
			return $this->db->rs['num'];
		}
		
		
		/**
		 * 
		 * Enter description here ...
		 */
		public function add_center_zone_ability($centerId,$zoneId,$creator){
			global $abilityPath;
			$data = new Spreadsheet_Excel_Reader();
			$data->setOutputEncoding('UTF-8');
			$data->read($abilityPath);
			$ability = $data->sheets[0]['cells'];
			$offset = 1;
			$ability = array_slice($ability, $offset,count($ability));
			$abilityTmp = array();
			foreach ($ability as $key=>$value){
						if($value['1']){
							$next = $key+1;
							$last = $key+2;
							$tmp['ability_name'] = $value['1'];
							$tmp['instruction'] = $value['2'];
							$tmp['a_level'] = $value['4'];
							$tmp['b_level'] = $ability[$next]['4'];
							$tmp['c_level'] = $ability[$last]['4'];
							$tmp['subject_id'] = '1,2,3,4,5,6,7,8,9';
							$tmp['status'] = '1';
							$tmp['creator'] = $creator;
							$tmp['center_id'] = $centerId;
							$tmp['zone_id'] = $zoneId;
							$abilityTmp[$tmp['ability_name']] = $tmp;
						}
			}
			
			foreach ($abilityTmp as $key=>$value){
				$this->db->insert('tblability',$value);
			}
		}
		
		
		/**
		 * 
		 * @param  $teacherId 教师ID
		 * @param  $classType 班级类型
		 * @param  $zoneId 校区ID
		 */
		public function get_teacher_class_id($teacherId,$classType,$zoneId){
			$sql = <<<SQL
								SELECT tblclass.zone_id,tblclass2teacher.class_id,tblteacher.user_id as teacher_user_id  from tblclass2teacher 
								LEFT JOIN tblclass ON tblclass.id=tblclass2teacher.class_id
		           				 LEFT JOIN tblteacher ON tblteacher.id=tblclass2teacher.teacher_id
								WHERE tblclass2teacher.teacher_id=$teacherId 
                                and tblclass.zone_id=$zoneId 
SQL;
			if($classType){
				$sql.=<<<SQL
								 and tblclass.class_type=$classType 
SQL;
			}
			$this->db->sql = $sql;
			$this->db->Query();
			return $this->db->rs;
		}
		
		/**
		 * 查询解聘教师列表
		 */
		public function get_teacher_dismissed_list($subjectId,$realName,$zoneId,$level,$offset,$step){
			$sql = <<<SQL
				SELECT tbluser.id as user_id,tbluser.username,tbluser.realname,tbluser.gender,
				tbluser.tel,tbluser.email,tbluser.note,tbluser.reg_time,tbluser.usr_type,
				tblteacher_history.id,
				tblteacher_history.subject_id,
				tblteacher_history.level,
				tblteacher_history.level,
				edu_subject.Name as subject_name,
				tblcenterzoneadmin_history.id as centerzoneadmin_id,
				tblcenterzoneadmin_history.status,tblcenterzoneadmin_history.zone_id 
				FROM 
				tbluser 
				LEFT JOIN tblteacher_history ON tbluser.id=tblteacher_history.user_id 
				LEFT JOIN edu_subject ON tblteacher_history.subject_id=edu_subject.id 
				LEFT JOIN tblcenterzoneadmin_history ON tbluser.id=tblcenterzoneadmin_history.user_id 
				WHERE tblcenterzoneadmin_history.zone_id="$zoneId" AND tblteacher_history.level="$level"  and tblcenterzoneadmin_history.operate_status=0 
			
			
SQL;
			
			$groupBy = <<<SQL
				group by tbluser.id 
SQL;

			$where = '';
			if($subjectId){
				$where.=<<<SQL
				 and tblteacher_history.subject_id=$subjectId 
SQL;
			}
			
			if($realName){
				$where .=<<<SQL
				 and tbluser.realname like "%$realName%"  
SQL;
			}
			$this->db->sql = $sql.$where.$groupBy;
			$this->db->Query();
			$result = array();
			$result['count'] = count($this->db->rs);
			
			$order=<<<SQL
				ORDER BY reg_time desc LIMIT $offset,$step
SQL;
			$this->db->sql = $sql.$where.$groupBy.$order;
			$this->db->Query();
			
			$result['list'] = $this->db->rs;
			return $result;
		}

}