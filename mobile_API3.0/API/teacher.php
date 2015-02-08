<?php
///////////////////////////////////////////////////////
// 老师接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	require_once (dirname(__FILE__)."/../include/stat.php" );
	class crest extends REST{
		
		public function doGET(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			$action = $this->r('action');
			$teacherHandler = new teacher_handler();
			switch($action){
				case 'list':
					$condition = $this->r('condition');
					$pageNo = $this->r('pageno')?intval($this->r('pageno')-1):null;
					$countPerPage = intval($this->r('countperpage'))?$this->r('countperpage'):null;
					$result = $teacherHandler->get_teacher_list($pageNo*$countPerPage, $countPerPage, $condition);
					$this->b['count'] = $result['count'];
					$this->b['list'] = $result['list'];
					break;
				case 'other_teacher':
					$realname = $this->r('realname');
					$center_id = $this->r('center_id');
					$zone_id = $this->r('zone_id');
					
					$result = $teacherHandler->get_teacher_info_by_realname($realname, $center_id, $zone_id);
					$this->b['list'] = $result;
					break;
				case 'get_notes':
					$this->get_notes();
					break;
				case "current_teacher_class":
					$userId = $this->vr['id'];
					$classType = $this->r('class_type');
					$centerId = $this->r('center_id');
					$zoneId = $this->r('zone_id');
					$result = $teacherHandler->get_teacher_in_class_by_user_id($userId, $classType, $centerId, $zoneId);
					$this->b['list'] = $result['list'];
					$this->b['teacher'] = $result['teacher'];
					$this->b['student'] = $result['student'];
//					$this->current_teacher_class();
					break;
				case 'del_notes':
					$this->delete_notes();
				break;
				
				case 'get_small_class_teachers':
					$this->get_small_class_teachers();
					break;
					
				case 'teacher_not_in_small_class':
					$condition = $this->r('condition');
					$result = $teacherHandler->get_teacher_list_not_in_small_class($condition);
					$this->b['techers'] = $result;
					break;
				case 'teacher_dismissed_list':
					$realName=$this->r('realname');
					$subjectId=$this->r('subject_id');
					$zoneId = $this->r('zone_id');
					$level = $this->r('level');
					$pageNo = $this->r('pageno')?intval($this->r('pageno')-1):null;
					$countPerPage = intval($this->r('countperpage'))?$this->r('countperpage'):null;;
					$result = $teacherHandler->get_teacher_dismissed_list($subjectId,$realName,$zoneId, $level, $pageNo*$countPerPage, $countPerPage);
					$this->b['count'] = $result['count'];
					$this->b['list'] = $result['list'];
			}
			
		}
		
		
		public function doPOST(){
			$teacherHandler = new teacher_handler();
		//如果没有登陆，则返回401
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			
			$action = $this->r('action');
			switch($action){
				case 'add':
					$teacherInfo = array();
					$teacherInfo['center_id'] = intval($this->r('center_id'));
					$teacherInfo['zone_id'] = intval($this->r('zone_id'));
					$teacherInfo['username'] = $this->r('user_name');
					$teacherInfo['realname'] = $this->r('real_name');
					$teacherInfo['level'] = intval($this->r('level'));
 					$teacherInfo['usr_type'] = intval($this->r('usr_type'));
					$teacherInfo['gender'] = $this->r('user_sex');
					$teacherInfo['passwd'] = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
					$teacherInfo['tel'] = $this->r('user_tel');
					$teacherInfo['email'] = $this->r('user_email');
					$teacherInfo['subject_id'] = intval($this->r('subjects'));
					$teacherInfo['note'] = $this->r('message');
					$creatorId = $this->vr['id'];
					$result = $teacherHandler->add_teacher($creatorId, $teacherInfo);
					
					$this->b['sc'] = $result['sc'];
					$this->b['flag'] = $result['flag'];
					$this->b['reason'] = $result['reason'];
					break;

				case 'edit':
					
					$teacherInfo = array();
					$teacherInfo['user_id'] = intval($this->r('user_id'));
					$teacherInfo['center_id'] = intval($this->r('center_id'));
					$teacherInfo['zone_id'] = intval($this->r('zone_id'));
					$teacherInfo['usr_type'] = intval($this->r('user_type'));
					$teacherInfo['level'] = intval($this->r('level'));
					$teacherInfo['username'] = $this->r('user_name');
					$teacherInfo['realname'] = $this->r('real_name');
					$teacherInfo['gender'] = $this->r('user_sex');
					$teacherInfo['passwd'] = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
					$teacherInfo['tel'] = $this->r('user_tel');
					$teacherInfo['email'] = $this->r('user_email');
					$teacherInfo['subject_id'] = intval($this->r('subjects'));
					$teacherInfo['note'] = $this->r('message');
					$this->post_modify_teacher($teacherInfo);
					break;
				case 'join':
					$account = $this->r('account');
					$user_id = $this->r('user_id');
					$center_id = $this->r('center_id');
					$zone_id = $this->r('zone_id');
					$this->post_join_teacher($account , $user_id , $center_id , $zone_id);
					break;
				case 'create_notes':
					$this->create_notes();
					break;
				case 'employ_teacher_switch':
					$teacherUserId = $this->r('teacher_user_id');
					$centerId = $this->r('center_id');
					$zoneId = $this->r('zone_id');
					$rs = $teacherHandler->switch_teacher_employment_status($teacherUserId, $centerId, $zoneId);
					$this->b['flag'] = $rs;
					break;
			}
		}
		
		
		//DELETE逻辑
	public function doDELETE(){
		$action = $this->r('action');
		echo $this->r('action');
		switch($action){

		}
	}
		
		private function post_add_teacher($teacherInfo){
			require_once (dirname(__FILE__)."/../include/stat.php" );
	 		$stat = new statManager();
			$newUserInfo = array(
				'username'=>$teacherInfo['username'],
				'realname'=>$teacherInfo['realname'],
				'gender'=>$teacherInfo['gender'],
				'passwd'=>$teacherInfo['passwd'],
				'last_login_time'=>'now()',
				'last_loginlocation'=>$this->get_real_ip(),
				'usr_type'=>$teacherInfo['usr_type'],
				'reg_time'=>'now()',
				'email'=>$teacherInfo['email'],
				'tel'=>$teacherInfo['tel'],
				'note'=>$teacherInfo['note'],
				'yanzheng'=>0
			);
			
			$newUserResult= $this->db->Insert('tbluser' , $newUserInfo);

			if($newUserResult){
				$user_id = $this->db->Last_id();
				$newTeacherInfo = array(
					'center_id'=>$teacherInfo['center_id'],
					'zone_id'=>$teacherInfo['zone_id'],
					'subject_id'=>$teacherInfo['subject_id'],
					'level'=>$teacherInfo['level'],
					'user_id'=>$user_id,
					'creator'=>$this->vr['id'],
					'creator_name'=>$this->vr['username'],
					'creator_date'=>'now()'
				);
				
				/**
				 * 插入教师统计
				 */
				$month = intval(date('m'));
				$year = intval(date('Y'));
				$data = array('teacher_id'=>$user_id,'year'=>$year,'month'=>$month,'class_count'=>'0','center_id'=>$teacherInfo['center_id'],'zone_id'=>$teacherInfo['zone_id']);
//				$this->b['data'] = $data;
				$stat->update('teacher', 'total', $data);
//				print_r($rs);
				
				$newTeacherResult = $this->db->Insert('tblteacher' , $newTeacherInfo);
				

				if($newTeacherResult){
					$insertInfo = array(
						'zone_id'=>$teacherInfo['zone_id'],
						'role'=>'1',
						'user_id'=>$user_id,
					);
					$result = $this->db->Insert('tblcenterzoneadmin' , $insertInfo);
//					echo $this->db->sql;
//					exit;
					if($result){
						$this->b['flag'] = true;
						$this->b['sc'] = 200;
					}else{
						$this->b['flag'] = false;
						$this->b['reason'] = 'insert tblcenterzoneadmin failed';
						$this->b['sc'] = 400;
					}
				}else{
					$this->b['flag'] = false;
					$this->b['reason'] = 'insert teacher failed';
					$this->b['sc'] = 400;
				}
				
			}else{
				$this->b['flag'] = false;
				$this->b['reason'] = 'insert user failed';
				$this->b['sc'] = 400;
			}
			
			
		}
		
		private function post_modify_teacher($teacherInfo){
			$flag = true;
			$userInfo = array(
				'username'=>$teacherInfo['username'],
				'realname'=>$teacherInfo['realname'],
				'gender'=>$teacherInfo['gender'],
				'usr_type'=>$teacherInfo['usr_type'],
				'email'=>$teacherInfo['email'],
				'tel'=>$teacherInfo['tel'],
				'note'=>$teacherInfo['note']
			);
			$updateUserWhere = 'id='.$teacherInfo['user_id'];
			$updateUserResult = $this->db->Update('tbluser' , $userInfo , $updateUserWhere);
//			echo $this->db->sql;
			if($updateUserResult){
				$newTeacherInfo = array(
					'subject_id'=>$teacherInfo['subject_id']
				);
				$updateTeacherWhere = 'user_id='.$teacherInfo['user_id'];
				$updateTeacherResult = $this->db->Update('tblteacher' , $newTeacherInfo , $updateTeacherWhere);
//				$stat->update('teacher', 'total', array('teacher_id'=>$teacherInfo['user_id'],'class_count'=>'1'));
				if($updateTeacherResult){
					$flag = true;
				}else{
					$flag = false;
					$reason = 'update teacher failed';					
				}
			}else{
				$flag = false;
				$reason = 'update user failed';
			}
			$this->b['flag'] = $flag;
			$this->b['reason'] = $reason;
			$this->b['sc'] = $flag?200:400;
		}
		
		private function post_join_teacher($account , $user_id , $center_id , $zone_id){
			require_once (dirname(__FILE__)."/../include/stat.php" );
	 		$stat = new statManager();
			$sql = 'select count(*) as count from tblcenterzoneadmin  left join tbluser on tbluser.id=tblcenterzoneadmin.user_id where tbluser.username="'.$account. '"and tblcenterzoneadmin.zone_id='.$zone_id;
			$this->db->sql = $sql;
			$this->db->Queryone();
			if($this->db->rs['count'] > 0){
				$this->b['find'] = true;
				return;
			}
			
			$sql = <<<SQL
				update tblteacher 
				set zone_id=$zone_id,center_id=$center_id where user_id=$user_id;
				
SQL;
			//同时插入tblcenterzoneadmin
			
			$this->db->sql = $sql;
			 
			$this->b['flag'] = $this->db->ExecuteSql();
				
			
			$month = intval(date('m'));
			$year = intval(date('Y'));
			$data = array('teacher_id'=>$user_id,'year'=>$year,'month'=>$month,'class_count'=>'0','center_id'=>$center_id,'zone_id'=>$zone_id);
			$stat->update('teacher', 'total', $data);
			
			
			$arr['zone_id'] = $zone_id;
			$arr['role'] = 1;
			$arr['user_id']=$user_id;
			
			$this->db->Insert('tblcenterzoneadmin', $arr);
			
			$sql = <<<SQL
				update tblcenterzoneadmin_history 
				set operate_status=1  where user_id=$user_id;
				
SQL;
			$this->db->sql = $sql;
			 
			 $this->db->ExecuteSql();
			$this->b['sql'] = $this->db->sql;
			$this->b['sc'] = 200;
		}
		
		private function create_notes(){
			 	$notes = array();
				$notes['teacher_id'] = $this->vr['id'];
				$notes['content'] = $this->r('content');
				$notes['create_date'] = $this->r('create_date');
				$rs = $this->db->Insert('teach_notes', $notes);
				if($rs){
					$this->b['sc'] = 201;
				}else{
					$this->b['reason'] = 'insert into teach_notes failed';
				}
		}
		
		private function delete_notes(){
			$rs = $this->db->delete('teach_notes', 'Id='.$this->r('notes_id'));
			if($rs){
				$this->b['sc'] = 200;
			}else{
				$this->b['reason'] = 'delete teach_notes failed';
			}
		}
		
		private function get_notes(){
			$start = $this->r('start');
			$end = $this->r('end');
			$sql = 'select * from teach_notes where teacher_id='.$this->vr['id'].' and unix_timestamp(create_date)>=unix_timestamp("'.$start.'") and  unix_timestamp(create_date)<=unix_timestamp("'.$end.'")';
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
	
		private function current_teacher_class(){
			$date = date('Y-m-d',(time()));
			$sql = 'SELECT tblclass.*,tblclass2teacher.teacher_id,tblteacher.user_id FROM tblclass 
			left join tblclass2teacher on tblclass2teacher.class_id=tblclass.id
			left join tblteacher on tblteacher.id=tblclass2teacher.teacher_id
			WHERE tblclass.center_id='.$this->r('center_id').
			' AND tblclass.zone_id='.$this->r('zone_id').
			' AND tblclass.class_type='.$this->r('class_type').
			' AND tblteacher.user_id='.$this->vr['id'].
			' AND tblclass.end_date>="'.$date.'"';
			
			$this->db->sql = $sql;
			$this->db->Query();
			$classRs = $this->db->rs;
			$class =array();
			foreach ($classRs as $key=>$value){
				$class[] = $value['id'];
			}
			
			if(count($class)>0){
				$classIdStr = '"'.implode('","', $class).'"';
			}
			$teacherSql = 'select tbluser.realname,tbluser.id,tblclass2teacher.class_id from tbluser
									left join tblteacher on tbluser.id=tblteacher.user_id
									left join tblclass2teacher on tblclass2teacher.teacher_id=tblteacher.id
									where tblclass2teacher.class_id in('.$classIdStr.');';
			$studentSql = 'select tbluser.realname,tbluser.id,tblclass2student.class_id from tbluser
								left join tblstudent on tbluser.id=tblstudent.user_id
								left join tblclass2student on tblclass2student.student_id=tblstudent.id
								where tblclass2student.class_id in('.$classIdStr.');';
//			echo $teacherSql;
			$this->db->sql = $teacherSql;
			$this->db->Query();
			$teacherRs = $this->db->rs;
			
			$this->db->sql = $studentSql;
			$this->db->Query();
			$studentRs = $this->db->rs;
			$this->b['teacher'] = $teacherRs;
			$this->b['student'] = $studentRs;
			$this->b['list'] = $classRs;
			$this->b['sc'] = 200;
			
		}
		
		
		public function get_small_class_teachers(){
			$stuUserId = $this->r('student_user_id');
			$centerId = $this->r('center_id');
			$zondeId = $this->r('zone_id');
//			$sqlTeacher = <<<SQL
//			select tbluser.id as teacher_user_id,tbluser.realname as teacher_realname,tblteacher.subject_id from tblteacher
//			left join tbluser on tbluser.id=tblteacher.user_id
//			LEFT JOIN tblcenterzoneadmin ON tbluser.id=tblcenterzoneadmin.user_id 
//			where tblteacher.level=4  and tblcenterzoneadmin.zone_id=$zondeId
//SQL;

			
			
			/**
				$sqlTeacher 选择出已经存在小班的老师
				
				zone_id  约束 tblcenterzoneadmin  和 tblclass 
			 */
			$sqlTeacher = <<<SQL
				select tbluser.id as teacher_user_id,tblteacher.id as teacher_id,tbluser.realname as teacher_realname,tblteacher.subject_id from tblteacher
				left join tbluser on tbluser.id=tblteacher.user_id
				LEFT JOIN tblcenterzoneadmin ON tbluser.id=tblcenterzoneadmin.user_id
	          
	            left join  tblclass2teacher on tblclass2teacher.teacher_id=tblteacher.id
	            left join tblclass on tblclass.id=tblclass2teacher.class_id  
				where tblteacher.level=4  and tblcenterzoneadmin.zone_id=$zondeId and tblclass.class_type=2 and tblclass.zone_id=$zondeId
SQL;
			$sqlSmallTeacher = <<<SQL
			SELECT tblclass2student.class_id,tblteacher.subject_id,a.realname as teacher_realname,tblclass2teacher.teacher_id,tblteacher.user_id as teacher_user_id,tblstudent.user_id as stu_user_id from tblclass2student 
				left join tblclass on tblclass.id=tblclass2student.class_id
				left join tblclass2teacher on tblclass2teacher.class_id=tblclass.id
				left join tblteacher on tblteacher.id=tblclass2teacher.teacher_id
				left join tbluser a on a.id=tblteacher.user_id
				left join tblstudent on tblstudent.id=tblclass2student.student_id 
				left join tbluser b on b.id=tblstudent.user_id 
				
				LEFT JOIN tblcenterzoneadmin ON a.id=tblcenterzoneadmin.user_id 
				where tblclass.class_type=2 and tblstudent.user_id=$stuUserId and tblcenterzoneadmin.zone_id=$zondeId
SQL;
			$this->db->sql=$sqlTeacher;
			$this->db->Query();
			$rsTeacher = $this->db->rs;
			
			$this->b['small_class_teacher_list'] = $rsTeacher;
			
			$this->db->sql = $sqlSmallTeacher;
			$this->db->Query();
			$rsSmallTeacher = $this->db->rs;
			foreach ($rsTeacher as $key=>$value){//数据过滤
				foreach ($rsSmallTeacher as $k=>$v){
					if($v['teacher_user_id']==$value['teacher_user_id']){
						unset($rsTeacher[$key]);
					}
				}
			}
			
			$this->b['in_small_class_teacher_list'] = $rsSmallTeacher;
			$this->b['out_small_class_teacher_list'] = $rsTeacher;
		}
	}
	?>