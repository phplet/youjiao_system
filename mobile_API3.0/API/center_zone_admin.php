<?php
///////////////////////////////////////////////////////
// 中心（总校）接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		
		public function doGET(){
			$action = $this->r('action');
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			switch($action){
				case 'list'://查询管理员列表
					
					$condition = $this->r('condition');
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = $this->r('countperpage');
					if(!$countPerPage){//如果没有分页参数，获取所有列表
						$this->get_center_zone_admin_list(null , null , $condition);
					}else{//如果有分页参数，获取当前数据列表
						$this->get_center_zone_admin_list($pageNo*$countPerPage , $countPerPage , $condition);
					}
					
					break;
					
				case 'free_list'://查询空闲管理员
					
					$this->get_free_center_zone_admin_list();
					break;

				case 'some_list'://查询某一管理员的列表
					
					$user_id = intval($this->r('user_id'));
					$this->get_some_list($user_id);
					
					break;
			
				default:
					break;
			}
		}
		
		public function doPOST(){
			
			//如果没有登陆，则返回401
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			
			$action = $this->r('action');
			
			if($action == 'add'){
				$centerZoneAdminInfo = array();
				$centerZoneAdminInfo['center_id'] = $this->r('center_id');
				$centerZoneAdminInfo['zone_id'] = $this->r('zone_id');
				$centerZoneAdminInfo['username'] = $this->r('user_name');
				$centerZoneAdminInfo['realname'] = $this->r('real_name');
				$centerZoneAdminInfo['gender'] = $this->r('user_sex');
				$centerZoneAdminInfo['passwd'] = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
				$centerZoneAdminInfo['tel'] = $this->r('user_tel');
				$centerZoneAdminInfo['email'] = $this->r('user_email');
				$centerZoneAdminInfo['subject_id'] = $this->r('subjects');
				$centerZoneAdminInfo['note'] = $this->r('message');
//				$centerAdminInfo['user_id'] = $this->r('user_id');
				$this->post_add_center_zone_admin($centerZoneAdminInfo);
				
			}else if($action == 'edit'){
				
				$centerZoneAdminInfo = array();
				$centerZoneAdminInfo['user_id'] = $this->r('user_id');
				$centerZoneAdminInfo['center_id'] = $this->r('center_id');
				if($this->r('zone_id')){
					$centerZoneAdminInfo['zone_id'] = $this->r('zone_id');
				}else{
					$centerZoneAdminInfo['zone_id']  = '0';
				}
				$centerZoneAdminInfo['username'] = $this->r('user_name');
				$centerZoneAdminInfo['realname'] = $this->r('real_name');
				$centerZoneAdminInfo['gender'] = $this->r('user_sex');
				$centerZoneAdminInfo['passwd'] = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
				$centerZoneAdminInfo['tel'] = $this->r('user_tel');
				$centerZoneAdminInfo['email'] = $this->r('user_email');
				$centerZoneAdminInfo['subject_id'] = $this->r('subjects');
				$centerZoneAdminInfo['note'] = $this->r('message');
//				$centerAdminInfo['user_id'] = $this->r('user_id');
				$this->post_modify_center_zone_admin($centerZoneAdminInfo);
			
			}else if($action == 'delete'){
				$zone_id = $this->r('zone_id');
				$user_id = $this->r('user_id');
				$this->post_delete_center_zone_admin($zone_id , $user_id);
				
			}else if ($action == 'active_switch'){
				$admin_id = $this->r('id');
				$this->post_active_switch($admin_id);
			}else if($action == 'active_teacher_switch'){
				$centerZoneAdminId = $this->r('id');
				$this->post_active_teacher_switch($centerZoneAdminId);
			}
					 
		}
		
		
		/*************************** FUNCTION  ********************************/
		
		//查询分校区管理员列表
		private function get_center_zone_admin_list($offset , $step , $condition){
			$tables = array('tblUser' , 'tblTeacher' , 'tblSubject','tblCenterZoneAdmin');
			
			$tblUser = array(
				'tbluser',
				'id' , 'username' , 'realname' , 'gender' , 'tel' , 'email' , 'note' , 'reg_time' 
			);
			
			$tblCenterZoneAdmin = array(
				'tblcenterzoneadmin' ,
				'zone_id' , 'user_id' , 'status' , 'role'
			);
			
			$tblCenterZone = array(
				'tblcenterzone',
				'zone_name'
			);
			
			$tblTeacher = array(
				'tblteacher',
				'subject_id' , 'level'
			);
			
			$tblSubject = array(
				'edu_subject',
				'Name as subject_name'
			);
			
			$tblCondition = array(
//				'tblcenterzoneadmin.zone_id=tblcenterzone.id',
				'tbluser.id=tblteacher.user_id',
				'edu_subject.id=tblteacher.subject_id',
				'tbluser.id=tblcenterzoneadmin.user_id'
			);
			
			$tblCondition2 = array(
				'tblcenterzoneadmin.zone_id=tblcenterzone.id'
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
				$where .= ' AND ';
			}
//			$where .= ' tblteacher.level=2 AND tblteacher.center_id='.$this->vr['center_id'];
			$where .= ' tblteacher.level=2 AND tblteacher.center_id='.$this->vr['center_id'].' group by tbluser.id';
			
//			echo $where;
			$tblCondition['order'] = 'tbluser.reg_time desc';
			if($where != ''){
				$tblCondition['where'] = $where;
//				$where = ' WHERE '.$where;
			}
			
			if(!$offset && !$step){
//				$limit = '';
			}else{
				$tblCondition['limit'] = $offset.','.$step;
//				$limit = 'LIMIT '.$offset.','.$step;
			}
			
			//用户人员列表
			$this->b['list']  = $this->db->withQueryMakerLeft($tblUser,$tblTeacher,$tblSubject,$tblCenterZoneAdmin,$tblCondition);
			
			$this->b['sql'] =$this->db->sql;
//			echo $this->db->sql;
			$idList = array();
			foreach($this->b['list'] as $list){
				$idList[] = $list['id'];
			}
			$queryWhere = implode(',',$idList);
			
			$tblCondition2['where'] = 'tblcenterzone.center_id='.$this->vr['center_id'].' AND tblcenterzoneadmin.user_id in ('.$queryWhere.')';
			 
			$this->b['relation'] = $this->db->withQueryMakerLeft($tblCenterZone,$tblCenterZoneAdmin ,$tblCondition2);
			
			
			
			$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblUser,$tblTeacher,$tblSubject,$tblCenterZoneAdmin,$tblCondition);
			
			$this->b['sc'] = 200;
			return true;
			
		}
		
		//查询空闲分校区管理员列表
		private function get_free_center_zone_admin_list(){
			$center_id = $this->vr['center_id'];
			$sql = <<<SQL
			
			SELECT 
				tbluser.id , realname
			FROM 
				tbluser 
			LEFT JOIN tblteacher ON tbluser.id=tblteacher.user_id
			WHERE tbluser.id NOT IN (SELECT user_id FROM tblcenterzoneadmin) AND tblteacher.level=2 AND tblteacher.center_id=$center_id;
SQL;

			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
		//查询某一个管理员所管理的列表
		private function get_some_list($user_id){
			$sql = <<<SQL
				SELECT 	
					zone_id , zone_name , center_id , center_name
				FROM 
					tblcenterzoneadmin 
				LEFT JOIN tblcenterzone ON tblcenterzone.id=tblcenterzoneadmin.zone_id 
				LEFT JOIN tblcenter ON tblcenterzone.center_id=tblcenter.id
				WHERE tblcenterzoneadmin.user_id=$user_id and tblcenterzoneadmin.status=1 and tblcenterzone.status=1;
SQL;
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b = $this->db->rs;
			
		}
		
		//激活、禁用管理员
		private function post_active_switch($id){
			 
			$sql = 'UPDATE tblcenterzoneadmin SET status=(status+1)%2 WHERE user_id='.$id;
			 
			$this->db->sql = $sql;
			$this->b['flag'] = $this->db->ExecuteSql();
			$this->b['sc'] = 200;
			return true;
		}
		
			//解聘、聘用老师
		private function post_active_teacher_switch($id){
//			$this->db->sql = <<<SQL
//			select user_id from tblcenterzoneadmin where id=$id;
//SQL;
//			$this->db->Queryone();
//			$rs = $this->db->rs;
//			$userId = $rs['user_id'];
			//查询该用户是否存在未过期的班级  如果存在未过期的班级有学生，则无法解聘
			$sql = 'UPDATE tblcenterzoneadmin SET status=(status+1)%2 WHERE id='.$id;
			$this->db->sql = $sql;
			$this->b['sql'] = $this->db->sql;
			$this->b['flag'] = $this->db->ExecuteSql();
			$this->b['sc'] = 200;
			return true;
		}
		
		
		//添加新中心（总校）管理员		status : checked
		private function post_add_center_zone_admin($centerZoneAdminInfo){
			$userHandler = new user_handler();
				//先创建用户
			$tableName = 'tbluser';
			
			$newUserInfo = array(
				'username'=>$centerZoneAdminInfo['username'],
				'realname'=>$centerZoneAdminInfo['realname'],
				'gender'=>$centerZoneAdminInfo['gender'],
				'passwd'=>$centerZoneAdminInfo['passwd'],
				'last_login_time'=>'now()',
				'last_loginlocation'=>$this->get_real_ip(),
				'usr_type'=>'2',
				'reg_time'=>'now()',
				'email'=>$centerZoneAdminInfo['email'],
				'tel'=>$centerZoneAdminInfo['tel'],
				'note'=>$centerZoneAdminInfo['note'],
				'yanzheng'=>0
			);
			
			$newUserResult = $this->db->Insert($tableName , $newUserInfo);
			
			if($newUserResult){
				$user_id = $this->db->Last_id();
				$center_id = $this->vr['center_id'];
				$zone_id = $centerZoneAdminInfo['zone_id'];
				$subject_id = $centerZoneAdminInfo['subject_id'];
				$level = 2;//2是分校长
				$creator = $this->vr['id'];
				$creator_name = $this->vr['username'];
//				$sql = <<<SQL
//					INSERT INTO tblteacher 
//						(center_id , subject_id , level , user_id , creator , creator_name , create_date ) 
//					VALUES
//						($center_id , $subject_id , $level , $user_id , $creator , "$creator_name" , now());
//SQL;
				$teacherInfo['user_id'] = $user_id;
				$teacherInfo['center_id'] = $center_id;
				$teacherInfo['zone_id'] = 0;
				$teacherInfo['subject_id'] = $subject_id;
				$teacherInfo['level'] = $level;
				$teacherInfo['creator'] = $creator;
				$teacherInfo['creator_name'] = $creator_name;
				
//				$this->db->sql = $sql;
//				$newTeacherResult = $this->db->ExecuteSql();
				$newTeacherResult = $userHandler->add_table_base_info($table='tblteacher', $teacherInfo);
				if($newTeacherResult){//创建老师成功
					$zone_ids = explode('_' , $zone_id);
					if(count($zone_ids)>0 && intval($zone_ids[0]) != 0){//如果指定了负责学校，则插入关系表
						$insertInfo = array();
						foreach($zone_ids as $tmp_id){
							if($tmp_id == 0){
								continue;
							}
							$insertInfo[] = array(
								'zone_id'=>$tmp_id,
								'user_id'=>$user_id,
								'role'=>1
							);
						}
//						$result = $this->db->Inserts('tblcenterzoneadmin' , $insertInfo);
						$result = $userHandler->add_table_base_info($table='tblcenterzoneadmin', $insertInfo);
//						echo $this->db->sql;
						if($result){
							$this->b['flag'] = true;
							$this->b['sc'] = 200;
						}else{
							$this->b['flag'] = false;
							$this->b['reason'] = 'insert zone admin relation failed';
							$this->b['sc'] = 400;
						}
					}else{
							$this->b['flag'] = true;
							$this->b['sc'] = 200;
					}
				}else{
//					$where = 'id='.$user_id;
//					$this->db->delete($tableName ,  $where);
					$this->b['flag'] = false;
					$this->b['reason'] = 'create teacher failed';
					$this->b['sc'] = 400;
				}
			}else{
				//创建用户失败
				$this->b['flag'] = false;
				$this->b['reason'] = 'create user failed';
				$this->b['sc'] = 400;
			}
			return true;
		}
		
		//修改管理员信息
		private function post_modify_center_zone_admin($centerZoneAdminInfo){
			$userHandler = new user_handler();
			$userid = intval($centerZoneAdminInfo['user_id']);
			$center_id = intval($centerZoneAdminInfo['center_id']);
			$username = $centerZoneAdminInfo['username'];
			$realname = $centerZoneAdminInfo['realname'];
			$gender = $centerZoneAdminInfo['gender'];
			$tel = $centerZoneAdminInfo['tel'];
			$email = $centerZoneAdminInfo['email'];
			$subject_id = intval($centerZoneAdminInfo['subject_id']);
			if(isset($centerZoneAdminInfo['zone_id'])){
				$zone_id = $centerZoneAdminInfo['zone_id'];
			}else{
				$zone_id = '0';
			}
			$note = $centerZoneAdminInfo['note'];
			$sql = <<<SQL

			UPDATE 
				tbluser , tblteacher 
			SET 
				username='$username' , realname='$realname' , gender=$gender, tel=$tel , email='$email' , 
				subject_id=$subject_id , note='$note'
			WHERE 
				tbluser.id=tblteacher.user_id AND tbluser.id=$userid;
SQL;
			$this->db->sql = $sql;
//			echo $sql;
			$updateResult = $this->db->ExecuteSql();
				if($updateResult){
					$zone_ids = explode('_',$zone_id);
					//进入历史表
					$whereArray['user_id'] = $userid;
					$rs = $userHandler->add_table_history_info($table='tblcenterzoneadmin', $whereArray, $operateStatus='0'); //0  remove 1  create 2  modify
					
					
					//先删除当前用户所有的管理
					$deleteWhere = 'user_id='.$userid;
					$updateResult2 = $this->db->delete('tblcenterzoneadmin' , $deleteWhere);
					
					if(!$updateResult2){
						$this->b['flag'] = false;
						$this->b['reason'] = 'delete centerzoneadmin failed';
						$this->b['sc'] = 400;
						return;
					}
					if(count($zone_ids) > 0 && intval($zone_ids[0]) != 0){//添加新的管理类
						foreach($zone_ids as $tmp_id){
							if($tmp_id == 0){
								continue;
							}
							$tblcenterZoneInfo['zone_id'] = $tmp_id;
							$tblcenterZoneInfo['user_id'] = $userid;
							$tblcenterZoneInfo['role'] = 1;
							$updateResult3 = $userHandler->add_table_base_info($table='tblcenterzoneadmin', $tblcenterZoneInfo);
						}
						if($updateResult3){
							$this->b['flag'] = true;
							$this->b['sc'] = 200;
						}else{
							$this->b['flag'] = false;
							$this->b['reason'] = 'update admin zone failed';
							$this->b['sc'] = 400;
						}
					}else {
							$this->b['flag'] = true;
							$this->b['sc'] = 200;
					}
				}else{
					$this->b['flag'] = false;
					$this->b['reason'] = 'update admin failed';
					$this->b['sc'] = 400;
				}

			return true;
		}
		
		//根据ID删除中心管理员信息		status:checked
		private function post_delete_center_zone_admin($zone_id , $user_id){
			$tableName = 'tblcenterzoneadmin';
			$where = $tableName.'.zone_id='.$zone_id.' AND '.$tableName.'.user_id='.$user_id;
			$this->b['flag'] = $this->db->delete($tableName,$where);
			$this->b['sc'] = 200;
			return true;
		}
		
		
	}
?>