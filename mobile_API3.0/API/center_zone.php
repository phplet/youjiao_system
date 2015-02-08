<?php
///////////////////////////////////////////////////////
// 分校区接口
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
				case 'list':
					
					$condition = $this->r('condition');
					$pageNo = intval($this->r('pageno'))-1;
					$countPerPage = $this->r('countperpage');
					
					if(!$countPerPage){
						$this->get_center_zone_list(null , null , $condition);
					}else{
						$this->get_center_zone_list($pageNo*$countPerPage , $countPerPage , $condition);
					}
					
					break;
				case 'free_list':
					$this->get_free_center_zone_list();
					
					break;
					
				default:
					$this->b['sc'] = 200;
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
			
			$zoneInfo = array();
			$zoneInfo['zone_name'] = $this->r('zone_name');
			$zoneInfo['province_id'] = intval($this->r('province_id'));
			$zoneInfo['city_id'] = intval($this->r('city_id'));
			$zoneInfo['address'] = $this->r('address');
			$zoneInfo['contact_info'] = $this->r('contact_info');
			$zoneInfo['instruction'] = $this->r('instruction');
			$zoneInfo['center_id'] = intval($this->r('center_id'));
			$zoneInfo['admin_id'] = intval($this->r('admin_id'));
			$zoneInfo['student_max_count'] = intval($this->r('stu_max'));
			
			if($action == 'add'){
				$this->post_add_center_zone($zoneInfo);
				
			}else if($action == 'edit'){
				$zoneInfo['zone_id'] = $this->r('zone_id');
				$this->post_modify_center_zone($zoneInfo);
				
			}else if($action == 'delete'){
				$zone_id = $this->r('id');
				$this->post_delete_center_zone($zone_id);
				
			}else if($action == 'active_switch'){
				$center_id = $this->r('id');
				$this->post_active_switch($center_id);
				
			}else if($action == 'verify'){
				$key = $this->r('key');
				$value = $this->r('value');
				$this->post_verify($key , $value);
				
			}
			
		}
		
		
		
		/*************************** FUNCTION  ********************************/
		
		private function get_center_zone_list($offset , $step , $condition){
			$tables = array('tblCenterZone' , 'tblCenterZoneAdmin' , 'tblUser' , 'tblAreaProvince' , 'tblAreaCity','tblTeacher');
		
			$tblCenterZone = array(
				'tblcenterzone' , 
				'id','center_id','zone_name','province_id','city_id','address',
				'contact_info','instruction','status','creator','creator_name','create_date' , 'inactive_date','student_max_count'
			);
			
			$tblCenterZoneAdmin = array(
				'tblcenterzoneadmin',
				'user_id'
			);
			
			$tblUser = array(
				'tbluser',
				'realname',
			);
			
			$tblAreaProvince =array(
				'area_province',
				'name as province_name'
			);
			
			$tblAreaCity = array(
				'area_city',
				'name as city_name'
			);
			
			
			$tblTeacher = array(
					'tblteacher',
					'level'
			);
			$tblCondition = array(
				'tblcenterzone.id=tblcenterzoneadmin.zone_id',
				'tblcenterzoneadmin.user_id=tbluser.id',
				'tblcenterzone.province_id=area_province.id',
				'tblcenterzone.city_id=area_city.id',
				'tblteacher.user_id=tbluser.id'
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
								 //echo $cdnArray[0] ;
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
			$where .= ' (tblteacher.level is null OR tblteacher.level=2) AND tblcenterzone.center_id='.$this->vr['center_id'];
			
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
			$result = $this->db->withQueryMakerLeft($tblCenterZone,$tblCenterZoneAdmin,$tblUser,$tblAreaProvince,$tblAreaCity,$tblTeacher,$tblCondition);
//			echo $this->db->sql;
//			exit;
			//增添校区教师人数
			if(count($result)>0){
				foreach ($result as $key=>$value){
					$zoneId = $value['id'];
					$this->db->sql = <<<SQL
												select count(*) as num from tblteacher where zone_id=$zoneId;
SQL;
					$this->db->Queryone();
					$num  = $this->db->rs['num'];
					$result[$key]['teacher_count'] = $num;
				}
			}
			
			
			
			$this->b['list']  = $result;
			$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblCenterZone,$tblCenterZoneAdmin,$tblUser,$tblAreaProvince,$tblAreaCity,$tblTeacher,$tblCondition);
			
			$this->b['sc'] = 200;
			return true;
		}
		
		//查询没有分配学校的校长
		private function get_free_center_zone_list(){
			$center_id = $this->vr['center_id'];
			$sql = <<<SQL
			
			SELECT 
				tblcenterzone.id , tblcenterzone.zone_name ,tblcenterzone.student_max_count 
			FROM 
				tblcenterzone 
			WHERE 
				tblcenterzone.id NOT IN (SELECT zone_id FROM tblcenterzoneadmin) AND center_id=$center_id AND status=1;
SQL;

			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
			$this->b['sql'] = $this->db->sql;
			$this->b['sc'] = 200;
			
		}	
		
		
		//添加新校区			status : checked
		private function post_add_center_zone($zoneInfo){
			$tableName = 'tblcenterzone';
			$insertInfo = array(
				'center_id'=>$zoneInfo['center_id'],
				'zone_name'=>$zoneInfo['zone_name'],
				'province_id'=>$zoneInfo['province_id'],
				'city_id'=>$zoneInfo['city_id'],
				'address'=>$zoneInfo['address'],
				'contact_info'=>$zoneInfo['contact_info'],
				'instruction'=>$zoneInfo['instruction'],
				'status'=>1,
				'creator'=>$this->vr['id'],
				'creator_name'=>$this->vr['username'],
				'create_date'=>'now()',
				'student_max_count'=>$zoneInfo['student_max_count']
			);
			$insertCenterZoneResult = $this->db->Insert($tableName , $insertInfo);
			$zone_id = $this->db->Last_id();
			
			
			/**
			 * 添加能力维度
			 */
			$creator = $this->vr['id'];
			$centerId = $zoneInfo['center_id'];
			$teacherHandler = new teacher_handler();
			$teacherHandler->add_center_zone_ability($centerId, $zone_id, $creator);
			if($insertCenterZoneResult){
				if($zoneInfo['admin_id']){//如果设置了管理员
//					$updateUserID = $zoneInfo['admin_id'];
//					$updateSQL = <<<SQL
//						UPDATE tblcenterzoneadmin , tblteacher SET tblcenterzoneadmin.zone_id=$zone_id , tblteacher.center_id=$zone_id
//						WHERE tblcenterzoneadmin.user_id=tblteacher.user_id AND tblcenterzoneadmin.user_id=$updateUserID;		
//SQL;
					$insertInfo2 = array(
						'zone_id'=>$zone_id,
						'user_id'=>$zoneInfo['admin_id']
					);
//					$this->db->sql = $updateSQL;
//					$adminInsertResult = $this->db->ExecuteSql();
					$adminInsertResult = $this->db->Insert('tblcenterzoneadmin' , $insertInfo2);
					
					if($adminInsertResult){
						$this->b['sc'] = 200;
						$this->b['flag'] = true;
					}else{
						$this->b['sc'] = 400;
						$this->b['flag'] = false;
						$this->b['reason'] = 'insert admin failed';
					}
					
				}else{
					$this->b['flag'] =true;
					$this->b['sc'] = 200;
				}
			}else{
				$this->b['flag'] =false;
				$this->b['reason'] = 'insert center zone failed';
				$this->b['sc'] = 400;
			}
			return true;
		}
		
		//更新校区信息		status:checked
		private function post_modify_center_zone($zoneInfo){
			$type = $this->r('type');
			$tableName = 'tblcenterzone';
			$where = $tableName.'.id='.$zoneInfo['zone_id'];
			

			$modifyInfo = array(
				'zone_name'=>$zoneInfo['zone_name'],
				'province_id'=>$zoneInfo['province_id'],
				'city_id'=>$zoneInfo['city_id'],
				'address'=>$zoneInfo['address'],
				'contact_info'=>$zoneInfo['contact_info'],
				'instruction'=>$zoneInfo['instruction'],
				'student_max_count'=>$zoneInfo['student_max_count']
			);
			
			if($type==2){
				unset($modifyInfo['student_max_count']);
			}
			$updateZoneResult = $this->db->Update($tableName , $modifyInfo , $where);
			if($updateZoneResult){
				if($zoneInfo['admin_id'] == 0){//删除管理员
					$zone_id = $zoneInfo['zone_id'];
					$deleteWhere = 'zone_id='.$zone_id;
					$updateResult2 = $this->db->delete('tblcenterzoneadmin' , $deleteWhere);
				}else{
					$zone_id = $zoneInfo['zone_id'];
					$admin_id = $zoneInfo['admin_id'];
					$updateSQL = <<<SQL
						INSERT INTO tblcenterzoneadmin (zone_id , user_id , role) VALUES ($zone_id,$admin_id,1) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);		
SQL;

					$this->db->sql = $updateSQL;
					
					$this->b['sql'] = $updateSQL;
					$updateResult2 = $this->db->ExecuteSql();
				}
				
				if($updateResult2){
					$this->b['flag'] = true;
				}else{
					$this->b['flag'] = false;
					$this->b['sc'] = 400;
					$this->b['reason'] = 'update admin failed';
				}
				
				
			}else{
				$this->b['flag'] = false;
				$this->b['sql'] = $this->db->sql;
				$this->b['reason'] = 'update center zone failed';
				$this->b['sc'] = 400;
			}
			return true;
		}
		
		//根据ID删除中心信息		status:checked
		private function post_delete_center_zone($zoneid){
			$tableName = 'tblcenterzone';
			$where = $tableName.'.id='.$zoneid;
			$this->b['flag'] = $this->db->delete($tableName,$where);
			$this->b['sc'] = 200;
			return true;
		}
		
		//停运，启用中心，停运时更新停运时间
		private function post_active_switch($id){
			$sql = 'UPDATE tblcenterzone SET status=(status+1)%2 , inactive_date=IF(status=1,null,now()) WHERE id='.$id;
			
			$this->db->sql = $sql;
			$this->b['flag'] = $this->db->ExecuteSql();
			$this->b['sc'] = 200;
			return true;
		}
		
		//验证
		private function post_verify($key , $value){
			$sql = 'SELECT COUNT(*) as count FROM tblcenterzone WHERE '.$key.'="'.$value.'";';
			$this->db->sql = $sql;
			$this->db->Queryone();
			$this->b['flag'] = $this->db->rs['count'] > 0 ? true : false;
			$this->b['sc'] = 200;
			return true;
		}
		
		
	}
	
?>