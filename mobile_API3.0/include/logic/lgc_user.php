<?php
/**
 * @author xiaokun
 */
class user_handler {
	public function __construct(){
		$this->db = db_handler::getInstance();
	}
	
	/**
	 * 获取用户信息
	 * @param  $user_id
	 */
	public function get_user_info($userId){
		$this->db->sql = <<<SQL
									select * from tbluser where id=$userId
SQL;
		$this->db->Queryone();
		
		return $this->db->rs;
	}
	
	
		/**
		 * 
		 * @param  $table
		 * @param  $info
		 */
		public function add_table_base_info($table,$info){
				$flag = utils_handler::is_two_dimensional_array($info);
				if($flag){
					$rs = true;
					foreach ($info as $key=>$value){
							$this->db->Insert($table, $value);
							$tableHistory = $table.'_history';
							$id =  $this->db->Last_id();
							$value['old_id'] = $id;
							$value['operate_status'] = '1';
							$value['create_date'] = 'now()';
							$this->db->Insert($tableHistory, $value);
							$rs&=true;
					}
					return $rs;
				}else{
					$this->db->Insert($table, $info);
					$tableHistory = $table.'_history';
					$lastId =  $this->db->Last_id();
					$info['old_id'] = $lastId;
					$info['operate_status'] = '1';
					$info['create_date'] = 'now()';
					$this->db->Insert($tableHistory, $info);
					return $lastId;
				}
		}
		
		/**
		 * 检查校区是否停运
		 * @param  $userId 用户ID
		 * @param  $userType 用户类型
		 * @param  $level 用户级别
		 */
		public function check_user_center_zone_status($userId,$userType,$level){
			//教务、普通老师  $userType=2  $level=2 ||$level=4; 
			
			$flag = false;
			if(($userType==2)&&($level==2 ||$level==4)){
					$this->db->sql = <<<SQL
											select tblcenter.status as center_status,tblcenterzone.status as zone_status from tblteacher 
											left join tblcenterzoneadmin on tblteacher.user_id=tblcenterzoneadmin.user_id
					                        left join tblcenterzone on tblcenterzone.id=tblcenterzoneadmin.zone_id
                                            left join tblcenter on tblcenter.id=tblcenterzone.center_id
					                        where tblteacher.user_id='$userId';
SQL;
				$this->db->Query();
				$rs = $this->db->rs;
				if(count($rs)>0){
					foreach ($rs as $key=>$value){
						$flag|=$value['zone_status'];
					}
					if($flag){//如果校区没有停运，检查中心
						$flag = false;
						foreach ($rs as $key=>$value){
							$flag|=$value['center_status'];
						}
					}
				}
				return $flag;
			}
			//校长$userType=2  $level=1 
			if(($userType==2)&&($level==1)){
					$this->db->sql = <<<SQL
										    select tblteacher.user_id,tblcenter.status as center_status from tblteacher 
											left join tblcenteradmin on tblteacher.user_id=tblcenteradmin.user_id
					                        left join tblcenter on tblcenter.id=tblcenteradmin.center_id
					                        where tblteacher.user_id='$userId';
SQL;

				$this->db->Query();
				$rs = $this->db->rs;
				if(count($rs)>0){
					foreach ($rs as $key=>$value){
						$flag|=$value['center_status'];
					}
				}
				return $flag;
			}else{
				return true;
			}
		}
		
		
		
		/**
		 * 检查是否允许登录（用户被禁用）
		 * 
		 * @param  $userId 用户ID
		 * @param  $userType 用户类型
		 * @param  $level 用户级别
		 */
		public function check_user_status($userId,$userType,$level){
			if($userType=='2'){
				if($level=='1'){//校长
					$sql = 'select * from tblcenteradmin where user_id='.$userId;
					$this->db->sql = $sql;
					$this->db->Queryone();
					$rs = $this->db->rs;
					if(count($rs)>0){
						if($rs['status']){
							return true;
						}else{
							return false;
						}
					}else{
						return false;
					}
				}else if($level=='2'){//教务
					$sql = 'select * from tblcenterzoneadmin where user_id='.$userId;
					$this->db->sql = $sql;
					$this->db->Queryone();
					$rs = $this->db->rs;
					if(count($rs)>0){
						if($rs['status']){
							return true;
						}else{
							return false;
						}
					}else{
						return false;
					}
					
				}else if($level=='4'){//老师
					$sql = 'select * from tblcenterzoneadmin where user_id='.$userId;
					$this->db->sql = $sql;
					$this->db->Queryone();
					$rs = $this->db->rs;
					if(count($rs)>0){
						if($rs['status']){
							return true;
						}else{
							return false;
						}
					}else{
						return false;
					}
				}else if($level=='5'){//咨询师 入学测试用
					return true;
				}
				
				else if($level=='9'){//admin
					return true;
				}
	           else if($level=='8'){//资源管理
					return true;
				}
				
			}else {//学生登录
				return true;
			}
			
		}
		
		/**
		 * 
		 * Enter description here ...
		 * @param	$table
		 * @param  $whereArray
		 * @param  $operateStatus
		 */
		public function add_table_history_info($table,$whereArray,$operateStatus){
			$where = utils_handler::analytic_where($whereArray);
			$this->db->sql = <<<SQL
			select * from $table $where;
SQL;
			$this->db->Query();
			$rs = $this->db->rs;
			foreach ($rs as $key=>$value){
				$value['old_id'] = $value['id'];
				$value['create_date'] = 'now()';
				$value['operate_status'] =$operateStatus;
				unset($value['id']);//去除主键ID
				$tableHistory = $table.'_history';
				$this->db->Insert($tableHistory, $value);
			}
			
		}
		
		public function remove_table_info($table,$whereArray){
			$where = utils_handler::analytic_where($whereArray);
			
			if($table=='tblteacher'||$table=='tblstudent'){//如果是老师、学生的情况则变成游离
				$this->db->sql = <<<SQL
										update $table set zone_id=0 $where;
SQL;
//				echo $this->db->sql;
			}else{
				$this->db->sql = <<<SQL
										delete from $table $where;
SQL;
			}
			$this->db->ExecuteSql();
			if($this->db->rs!==false){
				return true;
			}else{
				return false;
			}
		}
		
		public function get_zone_count($centerId){
						$this->db->sql = <<<SQL
										select count(*) as num  from tblcenterzone where center_id='$centerId';
SQL;
			$this->db->Queryone();
			return $this->db->rs['num'];
		}
		
		
		public function get_question_type($subjectId){
						$this->db->sql = <<<SQL
							select * from edu_question_type  where subject_id=$subjectId;
SQL;
						$this->db->Query();
						return $this->db->rs;
		}
		
		
}