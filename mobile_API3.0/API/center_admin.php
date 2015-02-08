<?php
///////////////////////////////////////////////////////
// 中心（总校）接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		
		public function doGET(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			if($action == 'list'){//获取列表
				$condition = $this->r('condition');
				$pageNo = intval($this->r('pageno')) - 1;
				$countPerPage = $this->r('countperpage');
				if(!$countPerPage){//如果没有分页参数，获取所有列表
					$this->get_center_admin_list(null , null , $condition);
				}else{//如果有分页参数，获取当前数据列表
					$this->get_center_admin_list($pageNo*$countPerPage , $countPerPage , $condition);
				}
			}else if($action == 'free_list'){//查询没有分配学校的校长
				$this->get_free_center_admin_list();
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
			
			switch($action){
				case 'add':
					
					$centerAdminInfo = array();
					$centerAdminInfo['center_id'] = intval($this->r('center_id'));
					$centerAdminInfo['username'] = $this->r('user_name');
					$centerAdminInfo['realname'] = $this->r('real_name');
					$centerAdminInfo['gender'] = $this->r('user_sex');
					$centerAdminInfo['passwd'] = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
					$centerAdminInfo['tel'] = $this->r('user_tel');
					$centerAdminInfo['email'] = $this->r('user_email');
					$centerAdminInfo['subject_id'] = $this->r('subjects');
					$centerAdminInfo['note'] = $this->r('message');
	//				$centerAdminInfo['user_id'] = $this->r('user_id');
					$this->post_add_center_admin($centerAdminInfo);
					
					break;
				
				case 'edit':
					
					$centerAdminInfo = array();
					$centerAdminInfo['user_id'] = $this->r('user_id');
					$centerAdminInfo['center_id'] = $this->r('center_id');
					$centerAdminInfo['username'] = $this->r('user_name');
					$centerAdminInfo['realname'] = $this->r('real_name');
					$centerAdminInfo['gender'] = $this->r('user_sex');
					$centerAdminInfo['passwd'] = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
					$centerAdminInfo['tel'] = $this->r('user_tel');
					$centerAdminInfo['email'] = $this->r('user_email');
					$centerAdminInfo['subject_id'] = $this->r('subjects');
					$centerAdminInfo['note'] = $this->r('message');
	//				$centerAdminInfo['user_id'] = $this->r('user_id');
					$this->post_modify_center_admin($centerAdminInfo);
					
					break;
					
				case 'delete':
					
					$center_id = $this->r('center_id');
					$user_id = $this->r('user_id');
					$this->post_delete_center_admin($center_id , $user_id);
					
					break;
					
				case 'active_switch':
					
					$admin_id = $this->r('id');
					$this->post_active_switch($admin_id);
					
					break;
				
				case 'verify':
					
					$key = $this->r('key');
					$value = $this->r('value');
					$this->post_verify($key , $value);
					
					break;
					
				case 'reset_passwd':
					$user_id = $this->r('user_id');
					$this->post_reset_passwd($user_id);
					break;
				
				default:
					$this->b['sc'] = 405;
					break;
			}
			
		}
		
		
		/*************************** FUNCTION  ********************************/
		
		//查询中心管理员列表
		private function get_center_admin_list($offset , $step , $condition){

			$tables = array('tblUser' , 'tblCenter' , 'tblCenterAdmin' , 'tblTeacher' , 'tblSubject' );
			
			$tblUser = array(
				'tbluser',
				'id' , 'username' , 'realname' , 'gender' , 'tel' , 'email' , 'note' , 'reg_time' 
			);
			
			$tblCenterAdmin = array(
				'tblcenteradmin' ,
				'center_id' , 'user_id', 'status' , 'role'
			);
			
			$tblCenter = array(
				'tblcenter',
				'center_name'
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
				'tbluser.id=tblcenteradmin.user_id',
				'tblcenteradmin.center_id=tblcenter.id',
				'tbluser.id=tblteacher.user_id',
				'edu_subject.id=tblteacher.subject_id'
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
			$where .= ' tblteacher.level=1';
			
			
//			echo $where;
			
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
			
			
			$this->b['list']  = $this->db->withQueryMakerLeft($tblUser,$tblCenterAdmin,$tblCenter,$tblTeacher,$tblSubject,$tblCondition);
			$this->b['sql'] = $this->db->sql;
			$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblUser,$tblCenterAdmin,$tblCenter,$tblTeacher,$tblSubject,$tblCondition);
			
			$this->b['sc'] = 200;
			return true;
			
		}
		
		//查询没有分配学校的校长
		private function get_free_center_admin_list(){
			$sql = <<<SQL
			
			SELECT 
				tbluser.id , username , realname
			FROM 
				tbluser 
			LEFT JOIN tblteacher ON tbluser.id=tblteacher.user_id
			WHERE tbluser.id NOT IN (SELECT user_id FROM tblcenteradmin) AND tblteacher.level=1
SQL;

			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
			$this->b['sc'] = 200;
			
			
		}
		
		//添加新中心（总校）管理员		status : checked
		private function post_add_center_admin($centerAdminInfo){
			
			//先创建用户
			$tableName = 'tbluser';
			
			$newUserInfo = array(
				'username'=>$centerAdminInfo['username'],
				'realname'=>$centerAdminInfo['realname'],
				'gender'=>$centerAdminInfo['gender'],
				'passwd'=>$centerAdminInfo['passwd'],
				'last_login_time'=>'now()',
				'last_loginlocation'=>$this->get_real_ip(),
				'usr_type'=>'2',
				'reg_time'=>'now()',
				'email'=>$centerAdminInfo['email'],
				'tel'=>$centerAdminInfo['tel'],
				'note'=>$centerAdminInfo['note'],
				'yanzheng'=>0
			);
			
			$newUserResult = $this->db->Insert($tableName , $newUserInfo);
			
			if($newUserResult){
				$user_id = $this->db->Last_id();
				$center_id = intval($centerAdminInfo['center_id']);
				$zone_id = 0;
				$subject_id = intval($centerAdminInfo['subject_id']);
				$level = 1;//1是校长
				$creator = $this->vr['id'];
				$creator_name = $this->vr['username'];
				$sql = <<<SQL
					INSERT INTO tblteacher 
						(center_id , zone_id , subject_id , level , user_id , creator , creator_name , create_date ) 
					VALUES
						($center_id , $zone_id , $subject_id , $level , $user_id , $creator , "$creator_name" , now());
SQL;
				$this->db->sql = $sql;
				$newTeacherResult = $this->db->ExecuteSql();
				if($newTeacherResult){//创建老师成功
					if($centerAdminInfo['center_id']){//如果指定了负责学校，则插入关系表
						$insertInfo = array(
							'center_id'=>intval($centerAdminInfo['center_id']),
							'user_id'=>$user_id,
							'role'=>1
						);
						$result = $this->db->Insert('tblcenteradmin' , $insertInfo);
						if($result){
							$this->b['flag'] = true;
							$this->b['sc'] = 200;
						}else{
							$this->b['flag'] = false;
							$this->b['sc'] = 400;
						}
					}else{
							$this->b['flag'] = true;
							$this->b['sc'] = 200;
					}
				}else{
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
		
		
		private function post_modify_center_admin($centerAdminInfo){
			$userid = $centerAdminInfo['user_id'];
			$username = $centerAdminInfo['username'];
			$realname = $centerAdminInfo['realname'];
			$gender = $centerAdminInfo['gender'];
			$tel = $centerAdminInfo['tel'];
			$email = $centerAdminInfo['email'];
			$subject_id = intval($centerAdminInfo['subject_id']);
			$center_id = intval($centerAdminInfo['center_id']);
			$note = $centerAdminInfo['note'];
			$sql = <<<SQL

			UPDATE 
				tbluser , tblteacher , tblcenteradmin 
			SET 
				username='$username' , realname='$realname' , gender=$gender, tel=$tel , email='$email' , 
				subject_id=$subject_id , note='$note'
			WHERE 
				tbluser.id=tblteacher.user_id AND tblcenteradmin.user_id=tbluser.id AND tbluser.id=$userid;
SQL;
			$this->db->sql = $sql;
			$updateResult = $this->db->ExecuteSql();
			$this->b['sql'] = $this->db->sql;
			if($updateResult){
				if($center_id == 0){//如果删除管理学校
					$deleteWhere = 'user_id='.$centerAdminInfo['user_id'];
					$updateResult2 = $this->db->delete('tblcenteradmin' , $deleteWhere);
					
				}else{
					$updateSQL = <<<SQL
						INSERT INTO tblcenteradmin (center_id,user_id , role) VALUES ($center_id,$userid,1) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id),center_id=VALUES(center_id);			
SQL;
					$this->db->sql = $updateSQL;
//					echo $updateSQL;
					$updateResult2 = $this->db->ExecuteSql();
					
//					echo $this->db->sql;
				}
				
				if($updateResult2){
					$this->b['flag'] = true;
					$this->b['sc'] = 200;
				}else{
					$this->b['flag'] = false;
					$this->b['reason'] = 'update admin school failed';
					$this->b['sc'] = 400;
				}
				
			}else{
				$this->b['flag'] = false;
				$this->b['reason'] = 'update admin failed';
				$this->b['sc'] = 400;
			}
			return true;
			
		}
		
		//根据ID删除中心管理员信息		status:checked
		private function post_delete_center_admin($center_id , $user_id){
			$tableName = 'tblcenteradmin';
			$where = $tableName.'.center_id='.$center_id.' AND '.$tableName.'.user_id='.$user_id;
			$this->b['flag'] = $this->db->delete($tableName,$where);
			$this->b['sc'] = 200;
			return true;
		}
		
		//激活、禁用管理员
		private function post_active_switch($id){
			$sql = 'UPDATE tblcenteradmin SET status=(status+1)%2 WHERE user_id='.$id;
			
			$this->db->sql = $sql;
			$this->b['flag'] = $this->db->ExecuteSql();
			$this->b['sc'] = 200;
			return true;
		}
		
		private function post_verify($key , $value){
			$sql = 'SELECT COUNT(*) as count FROM tblcenteradmin WHERE '.$key.'="'.$value.'";';
			$this->db->sql = $sql;
			$this->db->Queryone();
			$this->b['flag'] = $this->db->rs['count'] > 0 ? true : false;
			$this->b['sc'] = 200;
			return true;
		}
		
		private function post_reset_passwd($user_id){
			$update = array(
				'passwd'=>'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92'
			);
			$this->b['flag'] = $this->db->Update('tbluser' , $update,'id='.$user_id);
//			$this->b['sql'] = $this->db->sql;
			$this->b['sc'] = 200;
		}
		
		
	}
	?>