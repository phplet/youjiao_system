<?php
///////////////////////////////////////////////////////
//公告接口
// by xiaokun v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			$id = $this ->r('user_id');
			$pageNo = intval($this->r('pageno'))-1;
			$countPerPage = $this->r('countperpage');
			$this->get_notice_list($id,$pageNo*$countPerPage,$countPerPage);
			
		}
		
		public function doPOST(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			$action = $this->r('action');
			if($action == 'add'){
				$title = $this->r('title');
				$content = $this->r('content');
				$expire_date = $this->r('expire_date');
				$to = $this->r('to');
				if(!$expire_date){
					$expire_date = '';
				}
				$this->post_add_notice($title,$content,$to,$expire_date);
			}else if($action == 'edit'){
				$title = $this->r('title');
				$content = $this->r('content');
				$to = $this->r('to');
				$expire_date = $this->r('expire_date');
				$noticeid = $this->r('noticeid');
				if(!$expire_date){
					$expire_date = '';
				}
				$this->post_modify_notice($noticeid , $title,$content,$to,$expire_date);
			}else if($action == 'del'){
				$newsid = $this->r('newsid');
				$this->post_delete_news($newsid);
			}
		}
		
		
		//获取公告列表
		private function get_notice_list($id , $offset , $step){
//			echo $this->vr['usr_type'];
//			$array  = array(0=>'tom',1=>'jim');
//			echo in_array('tom', $array);
//			exit;
				$sql = <<<SQL
					SELECT 
					noticeid, tblcenterzoneadmin.zone_id as zone_zone_id , tblteacher.zone_id as teacher_zone_id ,tblcenterzone.zone_name , title , content ,to_target, expire_date , create_by , create_time , tbluser.realname as create_by_name 
					FROM tblnotice 
					LEFT JOIN tbluser ON tblnotice.create_by=tbluser.id
					LEFT JOIN tblteacher ON tbluser.id=tblteacher.user_id
					LEFT JOIN tblcenterzone ON tblnotice.zone_id=tblcenterzone.id
					LEFT JOIN tblcenterzoneadmin ON tblcenterzoneadmin.user_id=tbluser.id
SQL;
//			}
// level ：1== 校长  2== 教务  4==教师
			if(intval($this->vr['usr_type'])==2&&intval($this->vr['level'])==1){//校长   校长发的公告
				$where = 'tblnotice.create_by='.$id;
				if(intval($this->r('is_expire'))=='1'){
						$where.=' and unix_timestamp(tblnotice.expire_date)<unix_timestamp(current_timestamp()) order by create_time desc';
				}else if(intval($this->r('is_expire'))=='0'){
						$where.=' and unix_timestamp(tblnotice.expire_date)>=unix_timestamp(current_timestamp()) order by create_time desc';
				}
				
				$sql .= ' WHERE '.$where;
				$this -> db -> sql = $sql;
				$this -> db -> Query();
				$rs= $this -> db -> rs;
				$rs = utils_handler::array_sort($rs,'create_time','desc');
				$rs = array_slice($rs, $offset,$step);	
				$num = count($rs);
			}
			else if(intval($this->vr['usr_type'])==2&&intval($this->vr['level']==2)){//教务   校长+教务公告
				$rs = $this->get_zone_notice($id); 
				$rs = utils_handler::array_sort($rs,'create_time','desc');
				$num = count($rs);
				$rs = array_slice($rs, $offset,$step);	
			}else if(intval($this->vr['usr_type'])==2&&intval($this->vr['level']==4)){//普通老师 校长+教务+老师 公告
				$sqlTeacher = $sql.' where tblnotice.create_by='.$id.' group by noticeid'; //教师公告
				$this->db->sql = $sqlTeacher;
				$this->db->Query();
				$rsTeacher = $this->db->rs;
				$sqlCenter  =$sql.' where tblnotice.center_id='.$this->r('center_id').' and tblnotice.zone_id=0  group by noticeid'; //校长
				$this->db->sql = $sqlCenter;
				$this->db->Query();
				$rsCenter = $this->db->rs;
				//从校长结果集中选出老师所属zone 下面的公告
				$rsCenterTmp = array();
				if(count($rsCenter)){
					foreach ($rsCenter as $key=>$value){
						$target = json_decode($value['to_target'],true);
						if(in_array($this->r('zone_id'), $target['zoneids'])){
							$rsCenterTmp[$key] = $value;
						}
					}
				}
				
				$sqlZone = $sql.' where tblnotice.center_id='.$this->r('center_id').' and tblnotice.zone_id='.$this->r('zone_id').' and tblteacher.level=2 group by noticeid'; //教务主任 
				$this->db->sql = $sqlZone;
				$this->db->Query();
				$rsZone =$this->db->rs;
				
				//查询该老师的班级ID
				$sqlClassId = 'select tblclass2teacher.class_id FROM tblclass2teacher 
							left join tblteacher on tblteacher.id=tblclass2teacher.teacher_id
							left join tbluser on tbluser.id=tblteacher.user_id 
							where tblteacher.user_id='.$id;
				$this->db->sql=$sqlClassId;
				$this->db->Query();
				$rsClassids = $this->db->rs;
				//从教务结果集中选出老师所属class 下面的公告
				$rsZoneTmp = array();
				if(count($rsZone)){
					foreach ($rsZone as $key=>$value){
						$target = json_decode($value['to_target'],true);
						foreach ($rsClassids as $k=>$v){
							if(in_array($v['class_id'], $target['classids'])){
								$rsZoneTmp[$key] = $value;
							}
						}
					}
				}
				
				
			$nowTime = time();
			$rs = array();
			if(isset($rsTeacher)){
				$rs = array_merge($rsTeacher);
			}
			if(isset($rsZoneTmp)){
				$rs = array_merge($rs,$rsZoneTmp);
			}
			if(isset($rsCenterTmp)){
				$rs = array_merge($rs,$rsCenterTmp);
			}
				
//			$rs  =	array_merge($rsTeacher,$rsCenterTmp,$rsZoneTmp);
			//过期、未过期
				if(intval($this->r('is_expire'))=='1'){
					foreach ($rs as $key=>$value){
						if(strtotime($value['expire_date'])>$nowTime){
							unset($rs[$key]);
						}
					}
				}else if(intval($this->r('is_expire'))=='0'){
						foreach ($rs as $key=>$value){
							if(strtotime($value['expire_date'])<$nowTime){
								unset($rs[$key]);
						}
							
					}
				}	
				
				$rs = utils_handler::array_sort($rs,'create_time','desc');
				$num = count($rs);
				$rs = array_slice($rs, $offset,$step);	
				
			}else if($this->vr['usr_type']==1){ //如果是学生  //班级学生所有公告
				$studentHandler = new student_handler();
				
				$centerZoneInfo = $studentHandler->get_student_center_zone_info($this->r('user_id'));
//				print_r($centerZoneInfo);
//				exit;
				if(count($centerZoneInfo)>0){
					$rs = array();
					foreach ($centerZoneInfo as $czKey=>$czValue){
						
							$sqlStudent = 'SELECT tblclass2student.class_id from tblclass2student
													left join tblstudent on tblclass2student.student_id=tblstudent.id
													left join tbluser on tbluser.id=tblstudent.user_id 
													where tblstudent.user_id='.$this->r('user_id');
							$this->db->sql = $sqlStudent;
							$this->db->Query();
							$rsClassids = $this->db->rs;
			//				print_r($rsClassids);
							// 校长 数据
							$sqlCenter  =$sql.' where tblnotice.center_id='.$czValue['center_id'].' and tblnotice.zone_id=0'; //校长
							$this->db->sql = $sqlCenter;
							$this->db->Query();
							$rsCenter = $this->db->rs;
			//				print_r($rsCenter);
							//从校长结果集中选出老师所属zone 下面的公告
							$rsCenterTmp = array();
							if(count($rsCenter)){
								foreach ($rsCenter as $key=>$value){
									$target = json_decode($value['to_target'],true);
									if(in_array($czValue['zone_id'], $target['zoneids'])){
										$rsCenterTmp[$key] = $value;
									}
								}
							}
							
							//教务、教师数据
							$sqlZone = $sql.' where tblnotice.center_id='.$czValue['center_id'].' and tblnotice.zone_id='.$czValue['zone_id'].'   group by noticeid'; //教务主任 
							$this->db->sql = $sqlZone;
			//				echo $this->db->sql;
							$this->db->Query();
							$rsZone =$this->db->rs;
							
							$rsZoneTmp = array();
							if(count($rsZone)){
								foreach ($rsZone as $key=>$value){
									$target = json_decode($value['to_target'],true);
									foreach ($rsClassids as $k=>$v){
										if(in_array($v['class_id'], $target['classids'])){
											$rsZoneTmp[$key] = $value;
										}
									}
								}
							}
							
						$nowTime = time();
			//			print_r($rsTeacher);
						$rsTmp  =	array_merge($rsCenterTmp,$rsZoneTmp);
					}
					$rs = array_merge($rs,$rsTmp);
				}
			//过期、未过期
				if(intval($this->r('is_expire'))=='1'){
					foreach ($rs as $key=>$value){
						if(strtotime($value['expire_date'])>$nowTime){
							unset($rs[$key]);
						}
					}
				}else if(intval($this->r('is_expire'))=='0'){
						foreach ($rs as $key=>$value){
							if(strtotime($value['expire_date'])<$nowTime){
								unset($rs[$key]);
						}
							
					}
				}	
				
				$rs =utils_handler::array_sort($rs,'create_time','desc');
				$num = count($rs);
				$rs = array_slice($rs, $offset,$step);	
				
				
			}
			
			
//			$classHandler = new class_handler();
//			$centerZoneHandler = new center_zone_handler();
//			if(count($rs)>0){
//				foreach ($rs as $key=>$value){
//					$toTarget = $value['to_target'];
//					$targetInfo = json_decode($toTarget,true);
//					if(isset($targetInfo['zoneids'])){
//						$toTargetInfo = array();
//						foreach ($targetInfo['zoneids'] as $v){
//							$zoneDetail = $centerZoneHandler->get_zone_detail($v);
//							$toTargetInfo[] = $zoneDetail['zone_name'];
//						}
//						
//					}
//					
//					if(isset($targetInfo['classids'])){
//						foreach ($targetInfo['classids'] as $v){
//							$classDetail = $classHandler->get_class_info($v);
//							$toTargetInfo[] = $classDetail['class_name'];
//						}
//						
//						
//					}
//					
//					$rs[$key]['target_info'] = $toTargetInfo;
//				}
//			}
			$this->b['list']  =$rs;
			$this->b['count'] = $num;
			$this -> b["sc"] = 200;
			return true;
		}
		
		private function post_add_notice($title , $content , $to , $expire_date){
			$id = $this->vr['id'];
			$zone_id = intval($this->r('zone_id'));
			$centerId = intval($this->r('center_id'));
//			$create_time = date('Y-m-d H:i:s');
			$sql = <<<SQL
				INSERT INTO 
				tblnotice 
				(title,content,to_target,expire_date,create_by,zone_id,create_time,center_id) 
				VALUES
				("$title","$content",'$to',"$expire_date",$id,$zone_id,now(),$centerId);
				
SQL;
			$this->db->sql = $sql;
//			echo $sql;
			$this->b['flag'] = $this->db->ExecuteSql();
//			$this->b['sql'] = $sql;
			$this->b['sc'] = 200;
			return true;
		}
		
		//修改新闻信息
		private function post_modify_notice($noticeid , $title , $content ,$to, $expire_date){
			
			$content = urlencode($content);
			
			$sql = <<<SQL
				UPDATE 
				tblnotice 
				SET 
				title="$title" , content="$content" ,to_target='$to' , expire_date="$expire_date"
				WHERE noticeid=$noticeid;
SQL;

			$this->db->sql = $sql;
//			echo $sql;
			$this->b['flag'] = $this->db->ExecuteSql();
//			$this->b['sql'] = $sql;
			$this->b['sc'] = 200;
			return true;
		}
		
		//根据ID号 删除新闻
		private function post_delete_notice($newsid){
			//先查出有多少图片，将图片删除
			
			global $webroot;
			
			$querySQL = <<<QuerySQL
				SELECT content FROM tblnotice WHERE newsid=$newsid;
QuerySQL;

			$this->db->sql = $querySQL;
			$this->db->Queryone();
			$content = urldecode($this->db->rs['content']);
			$content = base64_decode($content);
			
			//匹配到所有图片
			preg_match_all("/<img.*?src=[\\\'| \\\"](.*?)[\\\'|\\\"].*?[\/]?>/",$content,$matches);
			//删除第一项
//			echo 'webroot:'.$webroot;
			array_shift($matches);
//			print_r($matches);
			foreach($matches as $match){
				@unlink($webroot.$match[0]);
			}
			
			$sql = <<<DELETESQL
			DELETE FROM tblnotice WHERE newsid=$newsid;
DELETESQL;

			$this->db->sql = $sql;
			$this->b['flag'] = $this->db->ExecuteSql();
//			$this->b['sql'] = $sql;
			$this->b['sc'] = 200;
			return true;
			
			
			
		}
		
			public function get_zone_notice($id){
				$centerId = $this->r('center_id');
				$zoneId = $this->r('zone_id');
				$sql = <<<SQL
					SELECT 
					noticeid, tblcenterzoneadmin.zone_id as zone_zone_id , tblteacher.zone_id as teacher_zone_id ,tblcenterzone.zone_name , title , content ,to_target, expire_date , create_by , create_time , tbluser.realname as create_by_name 
					FROM tblnotice 
					LEFT JOIN tbluser ON tblnotice.create_by=tbluser.id
					LEFT JOIN tblteacher ON tbluser.id=tblteacher.user_id
					LEFT JOIN tblcenterzone ON tblteacher.zone_id=tblcenterzone.id
					LEFT JOIN tblcenterzoneadmin ON tblcenterzoneadmin.user_id=tbluser.id
SQL;
				//先查询到校长公告 
				$sqlCenter  =$sql.' where tblnotice.center_id='.$centerId.' and tblnotice.zone_id=0 group by noticeid order by create_time desc';
//				$sqlCenter.=' group by noticeid';
				$this->db->sql = $sqlCenter;
//				echo $sqlCenter;
				$this->db->Query();
				$rsCenter = $this->db->rs;
//				print_r($rsCenter);
				
				$sqlZone  = $sql.' where tblnotice.create_by='.$id.' and tblnotice.zone_id='.$zoneId;
//				echo $sqlZone;
				$this->db->sql = $sqlZone;
				$sqlZone.=' group by noticeid';
				$this->db->sql=$sqlZone;
				$this->db->Query();
				$rsZone = $this->db->rs;
//				print_r($rsZone);
				$rsZoneTmp = array();
				if(count($rsZone)>0){ //存在教务自己公告
					foreach ($rsZone as $key=>$value){
						if(count($rsCenter)){
							foreach ($rsCenter as $k=>$v){
									$target = json_decode($v['to_target'],true);
									if(in_array($value['zone_zone_id'], $target['zoneids'])){
										$rsZoneTmp[$k] = $v;
									}
							}
						}
					}
				}else{ //无教务自己公告
						if(count($rsCenter)>0){
							foreach ($rsCenter as $k=>$v){
									$target = json_decode($v['to_target'],true);
									if(in_array($this->r('zone_id'), $target['zoneids'])){
										$rsZoneTmp[$k] = $v;
									}
							}
					}				
				}
				
			$nowTime = time();
			if(count($rsZone)>0){
				$rs  =	array_merge($rsZone,$rsZoneTmp);
			}else{
				$rs = $rsZoneTmp;
			}
			//过期、未过期
				if(intval($this->r('is_expire'))=='1'){
					foreach ($rs as $key=>$value){
						if(strtotime($value['expire_date'])>$nowTime){
							unset($rs[$key]);
						}
					}
				}else if(intval($this->r('is_expire'))=='0'){
						foreach ($rs as $key=>$value){
							if(strtotime($value['expire_date'])<$nowTime){
								unset($rs[$key]);
						}
							
					}
				}	
				
//				return $rs;
				return utils_handler::array_sort($rs,'create_time','desc');
			}
			
			

			
		
	}
	
?>