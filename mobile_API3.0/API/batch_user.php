<?php
///////////////////////////////////////////////////////
// 批量加入老师、学生接口
// by xiaokun v1.0
///////////////////////////////////////////////////////
//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
//	require_once (dirname(__FILE__)."/../include/Excel/reader.php" );
	require_once (dirname(__FILE__)."/../include/stat.php" );
	class crest extends REST{
		
		//GET逻辑
		public function doGET(){
			$this -> b["sc"] = 405;
		}
	
		//POST逻辑
		public function doPOST(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$centerZoneHandler = new center_zone_handler();
			 $centerId = $this->r('center_id');
			 $zoneId = $this->r('zone_id');
			$action = $this->r('action');
			 header("Content-Type:text/html; charset=UTF-8");
			switch ($action){
				case 'uploa_file_TT':
				$this->upload_file();
				break;
				case 'batch_teachers'://重复用户 修改以后提交
				$userInfo = json_decode(base64_decode($this->r('user_info'),true),true);
				$userType = '2';
				$rsBeyond = $centerZoneHandler->beyond_allow_batch_users_count($userInfo, $centerId,$zoneId, $userType);
				if($rsBeyond){
					$this->b['beyond_list']  = $rsBeyond;
					$this->b['sc'] = 200;
					return;
				}
				$this->batch_add_teachers($userInfo,$centerId);
				break;
				case 'batch_students'://重复用户 修改以后提交
				
				$userInfo = json_decode(base64_decode($this->r('user_info'),true),true);
				$userType = '1';
//				$rsBeyond = $centerZoneHandler->beyond_allow_batch_users_count($userInfo, $centerId,$zoneId, $userType);
				if($rsBeyond){
					$this->b['beyond_list']  = $rsBeyond;
					$this->b['sc'] = 200;
					return;
				}
				$this->batch_add_students($userInfo,$centerId);
				break;	
			}
		
		}
	
		//PUT逻辑
		public function doPUT(){
			$this -> active();
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		public function upload_file(){
			require_once(dirname(__FILE__)."/../include/config.php");
			$centerZoneHandler = new center_zone_handler();
			$picname = $_FILES['mypic']['name'];
			$picsize = $_FILES['mypic']['size'];
			if ($picname != "") {
				if ($picsize > 20480000) {
					echo 'EXCEL文件不能大于20M';
					exit;
			}
			$type = strstr($picname, '.');
			if ($type != ".XLS" && $type != ".xls" && $type != ".XLT" && $type != ".xlt") {
				echo 'EXCEL文件格式不对！';
				exit;
			}
			$rand = rand(100, 999);
			$pics = date("YmdHis") . $rand . $type;
			//上传路径
			$pic_path = $this->webroot.'/hx_manages/2013hx_teacher_upload/files/'. $pics;
			move_uploaded_file($_FILES['mypic']['tmp_name'], $pic_path);
			}
			$size = round($picsize/1024,2);
			$arr = array(
				'name'=>$picname,
				'pic'=>$pics,
				'size'=>$size
			);
			$data = new Spreadsheet_Excel_Reader();
			$data->setOutputEncoding('UTF-8');
			$data->read($pic_path);
			error_reporting(E_ALL ^ E_NOTICE);
			$tmp = $data->sheets[0]['cells'];
			$offset =1;
			$userInfo = array_slice($tmp, $offset,count($tmp));
			$UserTmp = array();
			$centerId = $this->r('center_id');
			$zoneId = $this->r('zone_id');
			if($this->r("usr_type")=='1'){ //批量学生==1
					foreach ($userInfo as $key=>$value){
						$UserTmp[$key]['username'] = $value[1];
						$UserTmp[$key]['realname'] = $value[2];
						$UserTmp[$key]['gender'] = $value[3];
						$UserTmp[$key]['email'] = $value[4];
						$UserTmp[$key]['grade'] = $value[5];
						$UserTmp[$key]['school_name'] = $value[6];
						$UserTmp[$key]['tel'] = $value[7];
						$UserTmp[$key]['usr_type'] = '1';//学生
				}
				
				
			}else if($this->r("usr_type")=='2'){//批量老师 ==2
					foreach ($userInfo as $key=>$value){
						$UserTmp[$key]['username'] = $value[1];
						$UserTmp[$key]['realname'] = $value[2];
						$UserTmp[$key]['gender'] = $value[3];
						$UserTmp[$key]['tel'] = $value[4];
						$UserTmp[$key]['email'] = $value[5];
						$UserTmp[$key]['subject_id'] = $value[6];
						$UserTmp[$key]['note'] = $value[7];
						$UserTmp[$key]['usr_type'] = '2';//老师
				}
				
				
			}

			//检查是否上限
			$userType = $this->r("usr_type");
			
			if($userType){
				$rsBeyond = $centerZoneHandler->beyond_allow_batch_users_count($UserTmp, $centerId,$zoneId, $userType);
			}
			if($rsBeyond){
					$this->b['beyond_list']  = $rsBeyond;
					$this->b['sc'] = 200;
					return;
				}
		
			$userInfo = array();
			$userInfo['registered'] =array();
			$userInfo['unregistered'] = array();
			$userInfo['failed'] = array();
//			print_r($UserTmp);

			
		
			foreach($UserTmp as $key=>$value){
				if(isset($value['username'])){
					$sql = 'select count(*) as num from tbluser where username="'.$value['username'].'";';
	//				echo $sql;
					$this->db->sql = $sql;
					$this->db->Queryone();
					$rs = $this->db->rs;
					if($rs['num']){
						$userInfo['registered'][] = $value; //已注册
					}else{
						$userInfo['unregistered'][] = $value;//未注册
						
						$user = array();
						$user[] = $value;
//						print_r($user);
						if($this->r('usr_type')=='1'){//创建学生
							$failedStu = $this->batch_add_students($user,$centerId);
							if(!$failedStu){
								$userInfo['failed'][] = $value;
							}
						}else if($this->r('usr_type')=='2'){//创建老师
							$failedTeacher = $this->batch_add_teachers($user,$centerId);
							$userInfo['failed'][] = $value;
						}		
					}
				}else{
					$userInfo['registered'][] = $value; //username 为空
				}
			}
			$this->b['list'] = $userInfo;
			//print_r($userInfo);
		}
		
		/**
		 * 批量加入老师
		 */
		public function batch_add_teachers($userInfo,$centerId){
			$stat = new statManager();
			$teahcerHandler = new teacher_handler();
			if(isset($userInfo)){
				foreach ($userInfo as $key=>$value){
					$newUserInfo = array(
						'username'=>$value['username'],
						'realname'=>$value['realname'],
						'gender'=>$value['gender'],
						'passwd'=>'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',//默认123456
						'last_login_time'=>'now()',
						'last_loginlocation'=>$this->get_real_ip(),
						'usr_type'=>$value['usr_type'],
						'reg_time'=>'now()',
						'email'=>$value['email'],
						'tel'=>$value['tel'],
						'note'=>$value['note'],
						'yanzheng'=>0
					);
					$newUserResult= $this->db->Insert('tbluser' , $newUserInfo);

					if($newUserResult){
						$user_id = $this->db->Last_id();
						/**
				 		* 插入教师统计
				 		*/
						$month = intval(date('m'));
						$year = intval(date('Y'));
						$data = array('teacher_id'=>$user_id,'year'=>$year,'month'=>$month,'class_count'=>'0','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id'));
						$stat->update('teacher', 'total', $data);
						
						$newTeacherInfo = array(
							'center_id'=>$this->r('center_id'),
							'zone_id'=>$this->r('zone_id'),
							'subject_id'=>$value['subject_id'],
							'level'=>'4',
							'user_id'=>$user_id,
							'creator'=>$this->vr['id'],
							'creator_name'=>$this->vr['username'],
							'create_date'=>'now()'
						);
//						$newTeacherResult = $this->db->Insert('tblteacher' , $newTeacherInfo);
						$newTeacherResult = $teahcerHandler->add_table_base_info('tblteacher', $newTeacherInfo);
						if($newTeacherResult){
							$insertInfo = array(
							'zone_id'=>$this->r('zone_id'),
							'role'=>'1',
							'user_id'=>$user_id,
							);
//							$result = $this->db->Insert('tblcenterzoneadmin' , $insertInfo);
							$result = $teahcerHandler->add_table_base_info('tblcenterzoneadmin', $insertInfo);
							if($result){
								$this->b['flag'] = true;
								$this->b['sc'] = 201;
							}else{
								$this->b['flag'] = false;
								$this->b['reason'] = 'insert tblcenterzoneadmin failed';
								$this->b['sc'] = 400;
							}
						}else{
							$this->b['flag'] = false;
							$this->b['reason'] = 'insert tblteacher failed';
							$this->b['sc'] = 400;
						}
					}else{
						$this->b['flag'] = false;
						$this->b['reason'] = 'insert user failed';
						$this->b['sc'] = 400;
					}
				}
				
			}

			
		}
		
		/**
		 * 批量加入学生
		 */
		public function batch_add_students($userInfo,$centerId){
			$stat = new statManager();
			$studentHandler = new student_handler();
			if(isset($userInfo)){
				foreach ($userInfo as $key=>$value){
					//先添加学生信息
					$insertUser = array(
						'username'=>$value['username'],
						'realname'=>$value['realname'],
						'gender'=>$value['gender'],
						'passwd'=>'8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92',//默认123456
						'usr_type'=>1,//学生是1
						'reg_time'=>'now()',
						'tel'=>$value['tel'],
						'email'=>$value['email'],
						'note'=>$value['note'],
					);
					$insertUserResult = $this->db->Insert('tbluser' , $insertUser);
					$userId = $this->db->Last_id();
					
					if($insertUserResult){
						$insertStudent = array(
							'user_id'=>$userId,
							'center_id'=>$this->r('center_id'),
							'zone_id'=>$this->r('zone_id'),
							'creator'=>$this->vr['id'],
							'creator_name'=>$this->vr['username'],
							'create_date'=>'now()',
							'grade'=>$value['grade'],
							'school_name'=>$value['school_name']
							);
							
//						$insertStudentResult = $this->db->Insert('tblstudent' , $insertStudent);
						$insertStudentResult = $studentHandler->add_table_base_info('tblstudent', $insertStudent);
						$student_id = $insertStudentResult;
						
						//更改新生状态
						$this->change_student_status($student_id);
						$class_id = 0;
						$insertClassStudent = array(
							'class_id'=>$class_id,
							'student_id'=>$student_id,
							'creator'=>$this->vr['id'],
							'creator_name'=>$this->vr['username'],
							'status'=>1,
							'create_date'=>'now()',
						);
//						$insertClassStudentResult = $this->db->Insert('tblclass2student' , $insertClassStudent); //不再往tblclass2teacher 表里面插入了
//						$insertClassStudentResult = $studentHandler->add_table_base_info('tblclass2student', $insertClassStudent);
						$stat->update( 'student', 'action' , array( 'student_id'=>$student_id,'action_obj'=>$class_id,'action_date'=>date("Y-m-d H:i:s"),'action'=> 'create_no_class_stu' )); 
						if($insertStudentResult){
							$this->b['flag']  = true;
							$this->b['sc'] = 201;
						}else{
							$this->b['flag'] = false;
							$this->b['reason'] = 'insert student failed';
							$this->b['sc'] = 401;
						}
					}else{
						$this->b['flag'] = false;
						$this->b['reason'] = 'insert user failed';
						$this->b['sc'] = 401;
					}
				}
			}
		}
		
		//学生加入班级，修改tblstudent   new_student_status 状态  0:表示学生已经加入班级 1:无班级新学生
		private function change_student_status($student_id){
			$sql = <<<SQL
			update tblstudent inner join tblstudent_history on tblstudent.id=tblstudent_history.old_id 
			set tblstudent.new_student_status=1,tblstudent_history.new_student_status=1 where tblstudent.id="$student_id";
SQL;
			$sql1 = <<<SQL
			update tblstudent
			set tblstudent.new_student_status=1 where tblstudent.id="$student_id";
SQL;
			$sql2 = <<<SQL
			update tblstudent_history
			set tblstudent_history.new_student_status=1 where tblstudent_history.old_id="$student_id";
SQL;
			$this->db->sql = $sql1;
			$this->db->ExecuteSql();
			
			$this->db->sql = $sql2;
			$this->db->ExecuteSql();
		}
	}
	


?>