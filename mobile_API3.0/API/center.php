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
			$centerZoneHandler = new center_zone_handler(); 
			if($action == 'list'){
				$condition = $this->r('condition');
				$pageNo = intval($this->r('pageno'))-1;
				$countPerPage = $this->r('countperpage');
				if(!$countPerPage){
					$this->get_center_list(null , null , $condition);
				}else{
					$this->get_center_list($pageNo*$countPerPage , $countPerPage , $condition);
				}
			}else if($action == 'info'){
				$id = $this->r('id');
				$this->get_center_info($id);
			}else if($action == 'free_list'){
				$this->get_free_center_list();
			}else if($action=='center_count_info'){
				$centerId = $this->r('center_id');
				$rs = $centerZoneHandler->get_center_max_info($centerId);
				$this->b['center_count_info'] = $rs;
			}else if($action=='zone_info'){
				$centerId = $this->r('center_id');
				$rs = $centerZoneHandler->get_zone_info($centerId);
				$this->b['zone_info'] = $rs;
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
			
			$centerInfo = array();
			$centerInfo['center_name'] = $this->r('center_name');
			$centerInfo['province_id'] = $this->r('province_id');
			$centerInfo['city_id'] = $this->r('city_id');
			$centerInfo['address'] = $this->r('address');
			$centerInfo['contact_info'] = $this->r('contact_info');
			$centerInfo['instruction'] = $this->r('instruction');
			$centerInfo['admin_id'] = intval($this->r('admin_id'));
			if($action == 'add'){
				$this->post_add_center($centerInfo);
			}else if($action == 'edit'){
				$centerInfo['id'] = $this->r('id');
				$this->post_modify_center($centerInfo);
			}else if($action == 'delete'){
				$center_id = $this->r('id');
				$this->post_delete_center($center_id);
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
		
		
		
		private function get_center_info($centerid){

			$tableName = 'tblcenter';
			$where = $tableName.'.id='.$centerid;
			$sql = <<<SQL
				
				SELECT 
					$tableName.id as centerid , center_name , $tableName.province_id , area_province.name as province_name ,
					$tableName.city_id , area_city.name as city_name , address , contact_info , instruction , status , creator , 
					tbluser.realname as creator_name , create_date,$tableName.db_ip,$tableName.db_name,$tableName.center_name
				FROM 
					$tableName
				LEFT JOIN area_province ON $tableName.province_id=area_province.id
				LEFT JOIN area_city ON $tableName.city_id=area_city.id
				LEFT JOIN tbluser ON $tableName.creator=tbluser.id
				WHERE $where  ;
SQL;
//			echo $sql;
			$this->db->sql = $sql;
			$this->db->Queryone();
			$this->b = $this->db->rs;
			$this->b['sc'] = 200;
			return true;
		}
		
		
		//获取中心列表
		private function get_center_list($offset , $step , $condition){
			$tables = array('tblCenter' , 'tblAreaProvince' , 'tbleAreaCity');
			
			$tblCenter = array(
				'tblcenter' , 
				'id','center_name','province_id','city_id','address',
				'contact_info','instruction','status','creator','creator_name','create_date' , 'inactive_date','db_ip','db_name','center_type','type'
				,'zone_max_count','teacher_max_count','student_max_count'
			);
			
			$tblAreaProvince =array(
				'area_province',
				'name as province_name'
			);
			
			$tblAreaCity = array(
				'area_city',
				'name as city_name'
			);
			
			$tblCenterAdmin = array(
				'tblcenteradmin',
				'user_id as admin_id'
			);
			
			$tblUser = array(
				'tbluser',
				'username as admin_name','realname'
			);
			
			$tblCondition = array(
				'tblcenter.province_id=area_province.id',
				'tblcenter.city_id=area_city.id',
				'tblcenter.id=tblcenteradmin.center_id',
				'tblcenteradmin.user_id=tbluser.id'
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
			
			if(!$offset && !$step){
//				$limit = '';
			}else{
				$tblCondition['limit'] = $offset.','.$step;
//				$limit = 'LIMIT '.$offset.','.$step;
			}
			
			
			$this->b['list']  = $this->db->withQueryMakerLeft($tblCenter , $tblAreaProvince , $tblAreaCity , $tblCenterAdmin , $tblUser , $tblCondition);
			$this->b['sql'] = $this->db->sql;
			$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblCenter , $tblAreaProvince , $tblAreaCity , $tblCenterAdmin , $tblUser , $tblCondition);
			
			$this->b['sc'] = 200;
			return true;
			
//			$sql = <<<SQL
//				
//				SELECT 
//					$tableName.id , center_name , $tableName.province_id , area_province.name as province_name ,
//					$tableName.city_id , area_city.name as city_name , address , contact_info , instruction , status , creator , 
//					creator_name , create_date
//				FROM 
//					$tableName
//				LEFT JOIN area_province ON $tableName.province_id=area_province.id
//				LEFT JOIN area_city ON $tableName.city_id=area_city.id
//				$where  
//				$limit;
//SQL;

//				echo $sql;
				
//			$this->db->sql = $sql;							
//			$this->db->Query();
//			$this->b['list'] = $this->db->rs;
//			
//			$countSQL = 'SELECT COUNT(*) as count FROM '.$tableName;
//			
//			$this->db->sql = $countSQL;
//			$this->db->Queryone();
//			$this->b['count'] = $this->db->rs['count'];
			
			
			
		}
		
		//查询没有分配学校的校长
		private function get_free_center_list(){
			$sql = <<<SQL
			
			SELECT 
				tblcenter.id , tblcenter.center_name 
			FROM 
				tblcenter 
			WHERE 
				tblcenter.id NOT IN (SELECT center_id FROM tblcenteradmin) AND status=1
SQL;

			$this->db->sql = $sql;
//			echo $sql;
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
			$this->b['sc'] = 200;
			
		}
		
		
		//添加新中心（总校）	status : checked
		private function post_add_center($centerInfo){
			$type = intval($this->r('type'));//1 直营 2 代理
			$tableName = 'tblcenter';
			$insertInfo = array(
				'center_name'=>$centerInfo['center_name'],
				'province_id'=>$centerInfo['province_id'],
				'city_id'=>$centerInfo['city_id'],
				'address'=>$centerInfo['address'],
				'contact_info'=>$centerInfo['contact_info'],
				'instruction'=>$centerInfo['instruction'],
				'status'=>1,//默认启动，1
				'creator'=>$this->vr['id'],
				'type'=>$this->r('type'),
				'creator_name'=>$this->vr['username'],
				'create_date'=>'now()',
				'db_ip'=>$this->r('db_ip'),
				'db_name'=>$this->r('db_name'),
				'center_type'=>intval($this->r('center_type')),
				'zone_max_count'=>intval($this->r('zone_max_count')),
				'teacher_max_count'=>intval($this->r('teacher_max_count')),
				'student_max_count'=>intval($this->r('student_max_count'))
			);
			$insertCenterResult = $this->db->Insert($tableName , $insertInfo);
			$center_id = $this->db->Last_id();
			
			
			
		if($type==2){
			
			$zoneList = json_decode(base64_decode($this->r('zone_list')),true);
				foreach ($zoneList as $key=>$value){
					$zoneList[$key]['center_id']=$center_id;
					$zoneList[$key]['province_id']=$centerInfo['province_id']; 
					$zoneList[$key]['city_id']=$centerInfo['city_id'];
					$zoneList[$key]['creator']=$this->vr['id'];
					$zoneList[$key]['creator_name']=$this->vr['username'];
					$zoneList[$key]['create_date']='current_timestamp()';
				}
					$this->db->Inserts('tblcenterzone' , $zoneList);
						
			}

			if($insertCenterResult){//如果插入成功
				if($centerInfo['admin_id']){//如果指定了管理员，则添加记录
					$insertInfo2 = array(
						'center_id'=>$center_id,
						'user_id'=>$centerInfo['admin_id']
					);
//					$updateUserID = $centerInfo['admin_id'];
//					$updateSQL = <<<SQL
//						UPDATE tblcenteradmin , tblteacher SET tblcenteradmin.center_id=$center_id , tblteacher.center_id=$center_id
//						WHERE tblcenteradmin.user_id=tblteacher.user_id AND tblcenteradmin.user_id=$updateUserID;		
//SQL;
//					$this->db->sql = $updateSQL;
//					$adminInsertResult = $this->db->ExecuteSql();
					$adminInsertResult = $this->db->Insert('tblcenteradmin' , $insertInfo2);
					

					
					if($adminInsertResult){
						$this->b['sc'] = 200;
						$this->b['flag'] = true;
					}else{
						$this->b['sc'] = 400;
						$this->b['flag'] = false;
						$this->b['reason'] = 'insert admin failed';
					}
					
				}else{
					$this->b['flag'] = true;
					$this->b['sc'] = 200;
				}
				
			}else{
				$this->b['sc'] = 400;
				$this->b['reason'] = 'insert center failed';
				$this->b['flag'] = false;
			}
			
			$this->b['sc'] = 200;
			return true;
		}
		
		//更新中心信息		status:checked
		private function post_modify_center($centerInfo){
			$tableName = 'tblcenter';
			$where = $tableName.'.id='.$centerInfo['id'];
			$modifyInfo = array(
				'center_name'=>$centerInfo['center_name'],
				'province_id'=>$centerInfo['province_id'],
				'city_id'=>$centerInfo['city_id'],
				'address'=>$centerInfo['address'],
				'contact_info'=>$centerInfo['contact_info'],
				'instruction'=>$centerInfo['instruction'],
				'db_ip'=>$this->r('db_ip'),
				'db_name'=>$this->r('db_name'),
				'type'=>$this->r('type'),
				'center_type'=>intval($this->r('center_type')),
				'zone_max_count'=>intval($this->r('zone_max_count')),
				'teacher_max_count'=>intval($this->r('teacher_max_count')),
				'student_max_count'=>intval($this->r('student_max_count'))
			);
			
			$updateCenterResult = $this->db->Update($tableName , $modifyInfo , $where);
			
			$type=$this->r('type');
			if($type==2){
			
			$zoneList = json_decode(base64_decode($this->r('zone_list')),true);
				foreach ($zoneList as $key=>$value){
					$zoneId = $value['zone_id'];
					$zoneList[$key]['center_id']=$centerInfo['id'];
					$zoneList[$key]['province_id']=$centerInfo['province_id']; 
					$zoneList[$key]['city_id']=$centerInfo['city_id'];
					$zoneList[$key]['creator']=$this->vr['id'];
					$zoneList[$key]['creator_name']=$this->vr['username'];
					$zoneList[$key]['create_date']='current_timestamp()';
					if(isset($zoneId)){
						unset($zoneList[$key]['zone_id']);
						$zoneList1 =array();
						$zoneList1 = $zoneList[$key];
						$this->db->Update('tblcenterzone', $zoneList1,'id='.$zoneId);
					}else{
						$zoneList2 =array();
						$zoneList2 =$zoneList[$key];
						$this->db->Insert('tblcenterzone' , $zoneList2);
						
					}
				}
					
						
			}
			
			
			
			if($updateCenterResult){
				if($centerInfo['admin_id'] == 0){//删除管理员
					$center_id = $centerInfo['id'];
					$deleteWhere = 'center_id='.$center_id;
					$updateAdminResult = $this->db->delete('tblcenteradmin' , $deleteWhere);
					
				}else{//更新管理员

					$center_id = $centerInfo['id'];
					$admin_id = $centerInfo['admin_id'];
					$updateSQL = <<<SQL
						INSERT INTO tblcenteradmin (center_id,user_id , role) VALUES ($center_id,$admin_id,1) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id);			
SQL;

					$this->db->sql = $updateSQL;
					$this->b['sql'] = $updateSQL;
					$updateAdminResult = $this->db->ExecuteSql();
				}
				
				if($updateAdminResult){
					$this->b['flag'] = true;
				}else{
					$this->b['flag'] = false;
					$this->b['sc'] = 400;
					$this->b['reason'] = 'update admin failed';
				}
			
			}else{
				$this->b['flag'] = false;
				$this->b['sc'] = 400;
				$this->b['reason'] = 'update center failed';
			}
			return true;
		}
		
		//根据ID删除中心信息		status:checked
		private function post_delete_center($centerid){
			$tableName = 'tblcenter';
			$where = $tableName.'.id='.$centerid;
			$this->b['flag'] = $this->db->delete($tableName,$where);
			$this->b['sc'] = 200;
			return true;
		}
		
		//停运，启用中心，停运时更新停运时间
		private function post_active_switch($id){
			$sql = 'UPDATE tblcenter SET status=(status+1)%2 , inactive_date=IF(status=1,null,now()) WHERE id='.$id;
			
			$this->db->sql = $sql;
			$this->b['flag'] = $this->db->ExecuteSql();
			$this->b['sc'] = 200;
			return true;
		}
		
		//验证
		private function post_verify($key , $value){
			$sql = 'SELECT COUNT(*) as count FROM tblcenter WHERE '.$key.'="'.$value.'";';
			$this->db->sql = $sql;
			$this->db->Queryone();
			$this->b['flag'] = $this->db->rs['count'] > 0 ? true : false;
			$this->b['sc'] = 200;
			return true;
		}
		
		
	}
	
?>