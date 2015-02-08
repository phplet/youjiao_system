<?php
///////////////////////////////////////////////////////
// 用户接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			$userHandler = new user_handler();
			if($this -> urlarr[3]=="getPassword"){
				//找回密码
				$this -> getPassword();				
			}else if($this -> urlarr[3]=="student"){
				//
				if($this->r('stu_uid')){//如果存在更新学生密码为123456
					$this -> restStuPwd($this->r('stu_uid'));
				}else{
					$this -> getSutdentInfo();
				}
			}
			else if($this -> urlarr[3]=="teacher"){
				$this -> getTeacherInfo();
			}
			else if($this -> urlarr[3]=="name2id"){
				$this -> getId();
			}
			else{
				$userId = $this->vr['id'];
				$userType = $this->vr['usr_type'];
				$level = $this->vr['level'];
				$rsUser = $userHandler->check_user_status($userId, $userType, $level);//检查用户是否被禁用
				$rsCenterZone = $userHandler->check_user_center_zone_status($userId, $userType, $level);//检查校区是否全被停运
				if($rsUser&&$rsCenterZone){
					$this->b['user_status'] = '1';
					$this -> login();
				}else {
					$this->b['user_status'] = '0';//用户被禁用或校区停运
				}
			}
		}
		//获取学生信息
		public function getSutdentInfo(){	
			$get = explode(";",$this -> v($this -> urlarr[4]));
			for($i=0;$i<count($get);$i++){
				$str .= $get[$i].",";
			}
			$str = substr($str,0,-1);
			$c = explode(";",$this -> r("condition"));
			for($i=0;$i<count($c);$i++){
				$cc = explode(":",$c[$i]);
				if(is_string($cc[1])){
					$condition .= $cc[0]."='".$cc[1]."' and ";
				}
				else{
					$condition .= $cc[0]."=".$cc[1]." and ";
				}
				
			}
			$condition = substr($condition,0,-5);
			if($condition!=null){
				$this -> db -> sql = "select ".$str." from tblstudent JOIN tbluser ON tbluser.id=tblstudent.uid where ".$condition;
				$this -> db -> Queryone();
				$this -> b['student'] = $this -> db -> rs;
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
		
		//获取教师信息
		public function getTeacherInfo(){
			$get = explode(";",$this -> v($this -> urlarr[4]));
			for($i=0;$i<count($get);$i++){
				$str .= $get[$i].",";
			}
//			echo $str;
			$str = substr($str,0,-1);
			$c = explode(";",$this -> r("condition"));
			for($i=0;$i<count($c);$i++){
				$cc = explode(":",$c[$i]);
				if(is_string($cc[1])){
					$condition .= $cc[0]."='".$cc[1]."' and ";
				}
				else{
					$condition .= $cc[0]."=".$cc[1]." and ";
				}
			}
			$condition = substr($condition,0,-5);
			if($condition!=null){
				$this -> db -> sql = "select ".$str." from usr_teacher JOIN tbluser ON tbluser.id=usr_teacher.uid where ".$condition;
				$this -> db -> Queryone();
				$this -> b['teacher'] = $this -> db -> rs;
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
		
		//找回密码
		public function getPassword(){
			if($this -> verifyemail()>0){
				$this -> pushmail2mailstack("mailstack1",'<div>华夏安业题库重置密码(重要)</div><div>您可复制以下地址到浏览器用来重置华夏安业题库账号密码。</div><div>https://edu.hxpad.com/resetpassword.php?username='.$this -> vr['username'].'&code='.$this->setcode().'</div><div>如果您未重置密码，请勿操作。</div>',$this -> vr['username'],'华夏安业题库重置密码(重要)');
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b["sc"] = 401;
			}
		}
		//登陆
		public function login(){
			//第三方登陆插入用户信息
                $logintype=(int)$this -> vr['logintype'];
				$partner_id="";
				if(isset($_REQUEST["partner_id"]))   //如果从文曲星或别的合作伙伴来  则需要判断用户是否是文曲星的用户
				{
				   $partner_id= $this -> r('partner_id');
				   $this -> db -> sql = "select id from tbluser  where id=".$this -> vr['id']." and  partner_id=".$partner_id;
				   $this -> db -> Queryone();
				   if(!isset($this -> db -> rs['id']))
				   {
					  $this -> b["flag"] = false;  
					  return;
				   }
				}
				
				//$this -> b['sc']=401;
				if(($logintype==3) && $this -> b["sc"]==401){ //微博注册    //qq注册
					$this -> autoinsertuser();
					$this -> b['sc']=201;
				}
				if((int)$this -> vr['logintype']==4 && $this -> b["sc"]==401){  //pc登录
					$this -> autoinsertuser();
					$this -> b['sc']=201;
				}
				
				if(isset($this -> urlarr[3])){
					if($this -> vr['pass']){
						$this -> b['sc']=404;
					}
				}
				else{
					if($this -> vr['pass']){
						$this -> upinfo();
						if ($this -> vr['usr_type']==1)
						{
						$this -> b['sc']=201;
						}
					}else{
						$this -> b['login_status']='0';//账号密码错误
					}
				}
				
				
		}
	
	 	//POST逻辑
		public function doPOST(){

			
			if(!isset($this -> urlarr[3])){
				return;
			}
			switch($this -> urlarr[3]){
				case "teacher":
					$this -> vr['usr_type'] = 2;
					break;
				case "student":
					$this -> vr['usr_type'] = 1;
					break;
				case "parent":
					$this -> vr['usr_type'] = 3;
					break;
				case "activeuser":
					$this -> activeUser();
					break;
				case "activeemail":
					$this -> activeEmail();
					break;
				default:
					$this -> b['sc']=404;
					return;
					break;
			}
			if($this -> verifyemail()==0){
				$this -> b['sc']=201;
				$this -> autoinsertuser();
				$this -> pushmail2mailstack("mailstack1",'<div>欢迎注册</div><div>您可复制以下地址到浏览器用来激活账号，从而使用完整功能。</div><div>https://edu.hxpad.com/jihuo.php?username='.$this -> vr['username'].'&code='.$this -> code.'</div><div>如果您未使用此邮箱注册账号，请勿激活。</div>',$this -> vr['username'],'账号激活(重要)');
			}
			else{
				$this -> b['sc']=403;
			}
			
		}
	
		//PUT逻辑
		public function doPUT(){
			//重置密码
//			echo 'xxxx';
			if($this -> urlarr[3]=="resetPassword"){
				$this -> resetPassword();
			}
			else if($this->urlarr[3]=="modifyPassword"){
				if($this -> vr['pass']){
					$sql = 'select passwd from tbluser where id='.$this->r('user_id');
					$this->db->sql = $sql;
					$this->db->Queryone();
					$rs = $this->db->rs;
					$oldPasswd = $rs['passwd'];
					if($this->r('old_passwd')==$oldPasswd){
						$arr['passwd']  =$this->r('new_passwd');
						$this->db->Update('tbluser', $arr,'id='.$this->r('user_id'));
						if($this->db->rs){
							$this->b['flag'] = true;
						}else{
							$this->b['flag'] = false;
						}
					}else{
						$this->b['flag'] = 'oldPasswd_error';
					}
				}
			}
			else if($this -> urlarr[3]=="updateinfo"){
				//更新用户信息
				if($this -> vr['pass']){
					$arr4['realname']=$this -> r('realname');
					$arr4['gender']=(int)$this -> r('gender');
					$arr4['nickname']=$this -> r('nickname');
					
					$this -> db -> Update('tbluser',$arr4,"id=".$this -> vr['id']);
					if($this -> vr['usr_type']==2){
						$arr5['subject_grade']='{"subject":['.$this -> r('subject_id').'],"grade":['.$this -> r('grade_id').']}';
						$arr5['mobile']=(int)$this -> r('mobile');
						$this -> db -> Update('tblteacher',$arr5,"uid=".$this -> vr['id']);
						
					}
					else if($this -> vr['usr_type']==1){
						$arr6['grade'] = $this -> r('grade_id');
						$this -> db -> Update('tblstudent',$arr6,"uid=".$this -> vr['id']);
					}
				}
				
			}else  if($this -> urlarr[3]=="updatestudentinfo"){
				$studentInfo['realname'] = $this->r('realname');
				$studentInfo['gender'] = $this->r('sex');

				$this -> db -> Update('tbluser',$studentInfo,"id=".$this -> r('stu_uid'));
			}
			else  if($this -> urlarr[3]=="updatereginfo"){  //修改文曲星第一次登录时的用户名等
				$updatereginfo['realname'] = $this->r('realname');
				$updatereginfo['gender'] = $this->r('sex');
				$updatereginfo['username'] = $this->r('email');
				$updatereginfo['nickname'] = $this->r('nick');
                 
				$this -> db -> Update('tbluser',$updatereginfo,"id=".$this -> r('uid'));
				$this ->b["sql1"]=$this -> db -> sql;
				$this -> db -> sql = "select id,username,nickname,token,yanzheng from tbluser where id=".$this -> r('uid');
				$this -> db -> Queryone();
				$this -> b["username"] =$this -> db -> rs['username'];
				$this -> b["nick"] = $this -> db -> rs['nickname'];
				$this -> b["yanzheng"] = $this -> db -> rs['yanzheng'];
				$this -> b["token"] =$this -> db -> rs["token"];
				$this ->b["sql2"]=$this -> db -> sql;
			}
			else if($this -> urlarr[3]=="teacher" and $this -> urlarr[4]=="changelevel"){
				//	更改教师权限
				$arr['level'] = (int)$this -> r('level');
				if($arr['level']>2 and $this -> vr['level']==2){  //主任添加老师
					$arr['school_id'] = $this -> vr['school_id'];
					$this -> db -> Update('usr_teacher',$arr,"uid=".$this -> r('teacher_id'));
					
					  //主任修改统计数据teacher+1
					  $this-> db ->UpdateEvalution("usr_teacher","teacher","add"," uid='".$this -> vr['id']."'");		
	
					  //更新校区统计数据 teacher+1
					  $this-> db ->UpdateEvalution("edu_school","teacher","add"," id='".$this -> vr['school_id']."'");	

					if($this -> db -> Last_rs()){
					    $this -> b['sc']=200;
					}
					else{
						$this -> b['sc']=400;
					}
					return;
					//$arr1['relationship'] = ($this -> r('level')==3 ? 3 : 2);
					//$this -> db -> Update('usr_class',$arr1,"uid=".$this -> r('teacher_id'));
				}
				else if(($arr['level']==2 or $arr['level']==4) and ($this -> vr['level']==1 || $this -> vr['level']==9 )){   //校长添加/删除  主任教师
					//添加\删除  校区的教学主任    $arr['level']==4--删除    $arr['level']==2--添加
					if ($arr['level']==2) 
					   {$arr['school_id'] = (int)$this -> r('school_id');}
					else
					   {$arr['school_id'] = 0;}
					
					$this -> db -> Update('usr_teacher',$arr,"uid=".$this -> r('teacher_id'));
					if($this -> db -> Last_rs()){
					  if ($arr['level']==2 || $arr['level']==9){
						 //校长修改统计数据  master+1
						 $this-> db ->UpdateEvalution("usr_teacher","master","add"," uid='".$this -> vr['id']."'");	
						  
						 //中心更新校区统计数据 master+1
						 $this-> db ->UpdateEvalution("edu_school","master","add"," id='".$this -> vr['school_id']."'");		
						   
						//更新校区统计数据 master+1
						$this-> db ->UpdateEvalution("edu_school","master","add"," id='".$this -> r['school_id']."'");
					  }
					  else
					  {
						 //校长修改统计数据  master-1
						 $this-> db ->UpdateEvalution("usr_teacher","master","sub"," uid='".$this -> vr['id']."'");			
	
						 //中心更新校区统计数据 master-1
						 $this-> db ->UpdateEvalution("edu_school","master","sub"," id='".$this -> vr['school_id']."'");
						   
						 //更新校区统计数据 master-1
						 $this-> db ->UpdateEvalution("edu_school","master","sub"," id='".$this -> r['school_id']."'");
					  }
					  $this -> b['sc']=200;
					}
					else{
						$this -> b['sc']=400;
					}
				}
				else{
					$this -> b['sc']=403;
				}
			}
			else if($this -> urlarr[3]=="pic"){
				if($this -> vr['pass']){
					//更改头像
					$arr1['pic'] = $this -> r('pic');
					$this -> db -> Update('tbluser',$arr1,"id=".$this -> vr['id']);
					$this -> b['sc']=200;
				}
			}
			else if($this -> vr['pass']){
				//改密码
				$arr['passwd'] = $this -> r('password');
//				$this -> db -> Update('tbluser',$arr,"id=".$this -> vr['id']." and passwd='".$this -> vr['passwd']."'");
				$this -> db -> Update('tbluser',$arr,"id=".$this -> vr['id']."");
				$this->b['sql'] = $this->db->sql;
				if($this -> db -> Last_rs()){
					$this -> b['sc']=200;
				}
				else{
					$this -> b['sc']=400;
				}
				
			}
			
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
			//echo  $this->r['student_id'];
		}
			//更新登陆信息
		public function upinfo() {
			$token = $this->randStr ( 64 );
			$ip = $this->get_real_ip ();
			$arr ['token'] = $token;
			$arr ['last_login_time'] = 'current_timestamp()';
			$arr ['last_loginlocation'] = $ip;
			$this->db->Update ( 'tbluser', $arr, "username='" . $this->vr ["username"] . "'" );
			$this->b ["token"] = $token;
			$this->b ["usr_type"] = $this->vr ['usr_type'];
			$this->b ["yanzheng"] = $this->vr ['yanzheng'];
			if (isset ( $this->vr ['level'] )) {
				$this->b ["level"] = $this->vr ['level'];
			}
			if (isset ( $this->vr ['school_id'] )) {
				$this->b ["school_id"] = $this->vr ['school_id'];
			}
			$this->b ['username'] = $this->vr ["username"];
			$this->b ['realname'] = $this->vr ["realname"];
			$this->b ['nick'] = $this->vr ["nick"];
			$this->b ['sch_type'] = $this->vr ["sch_type"];
			$this->b ['id'] = $this->vr ['id'];
			$this->b ['vip'] = 0;
			$this->b ['days'] = 0;
			$this->db->sql = "select  * from  usr_ticool_vip  where uid=" . $this->vr ['id'];
			if ( isset ($_REQUEST ["grade_id"])){
				$this->db->sql = "select  *,DATEDIFF(current_timestamp(),update_time) as diffday from  usr_ticool_vip  where uid=" . $this->vr ['id'] ." and  grade_id=" . $_REQUEST ["grade_id"] ;
				$this->b['sql'] = $this->db->sql;
			}
			$this->db->Queryone ();
			
			if ($this->db->rs != null) {
				$this->b ['vip'] = 0;
				$nday1=( int )$this->db->rs ["days"];
				$nday2=( int ) $this->db->rs ["diffday"];
				$nday=$nday1-$nday2;
				$this->b ['days'] = $nday;
				
				
				if ($nday>0){ 
					$this->b ['vip'] = 1 ;
					$arr1["update_time"]='current_timestamp()';
				    $arr1["days"]=$nday;
				    $this->db->Update ( 'usr_ticool_vip', $arr1, " uid=" . $this->vr ['id']. " and grade_id=". $_REQUEST ["grade_id"]);
				}	
				
			}
			
			if ($this->b ["usr_type"] == 1) {
				$sql = 'SELECT distinct tblstudent.user_id as student_id,
							tblclass2student.class_id, 
							tblclass.creator as teacher_id,
							tblteacher.subject_id,
							tblclass.class_name 
							from tblstudent
							left join tblclass2student on tblclass2student.student_id=tblstudent.id
							left join tblclass on tblclass2student.class_id=tblclass.id
							left join tblclass2teacher on tblclass.id=tblclass2teacher.class_id
							left join tblteacher on tblteacher.id=tblclass2teacher.teacher_id
							where  tblstudent.user_id='.$this->vr ['id'];
				$this->db->sql = $sql;
				$this->db->Query ();
				$this->b ['student_class'] = $this->db->rs;
				$this -> db -> sql = "select grade as grade_id , class_section_id as section_id from tblstudent left join edu_grade on tblstudent.grade=edu_grade.id where user_id=".$this -> vr['id'];
				$this -> db -> Queryone();
				$this->b['grade_id'] = $this -> db -> rs['grade_id'];
				$this->b['section_id'] = $this -> db -> rs['section_id'];
				
			}else if($this->b['usr_type'] == 2){ //老师登录 暂时没有取到zone_id 
				$user_id = $this->vr['id'];
				if($this->vr['level']==1){//校长
//					$sql = 'select tblcenter.id as center_id,tblcenter.center_name  from tblcenteradmin
//								left join tblcenter on tblcenter.id=tblcenteradmin.center_id
//								where tblcenteradmin.user_id='.$this->vr['id'];
				$this->db->sql = <<<SQL
											SELECT tblcenteradmin.center_id,tblcenterzoneadmin.zone_id,tblcenter.center_type FROM tbluser
					LEFT JOIN tblcenteradmin on tbluser.id=tblcenteradmin.user_id
					LEFT JOIN tblcenterzoneadmin on tbluser.id=tblcenterzoneadmin.user_id
                    LEFT JOIN tblcenter ON tblcenter.id=tblcenteradmin.center_id
					WHERE tbluser.id=$user_id;
SQL;
					$this->db->Queryone();
					$this->b['center_id'] = $this->db->rs['center_id'];
					$this->b['center_name'] = $this->db->rs['center_name'];
					$this->b['center_type'] = $this->db->rs['center_type'];
				}else if($this->vr['level']==2||$this->vr['level']==4){//教务
					$sql = 'select tblcenter.id as center_id,tblcenter.center_name,tblcenter.center_type  from tblcenterzoneadmin
								left join tblcenterzone on tblcenterzone.id=tblcenterzoneadmin.zone_id
								left join tblcenter on tblcenter.id=tblcenterzone.center_id
								where tblcenterzoneadmin.user_id='.$this->vr['id'];
					$this->db->sql = $sql;
					$this->db->Queryone();
					$this->b['center_id'] = $this->db->rs['center_id'];
					$this->b['center_name'] = $this->db->rs['center_name'];
					$this->b['subject_id']=$this -> vr['subject_id'];
					$this->b['center_type'] = $this->db->rs['center_type'];
				}
//				$this->db->sql = <<<SQL
//					SELECT center_id,zone_id FROM tbluser 
//					LEFT JOIN tblcenteradmin on tbluser.id=tblcenteradmin.user_id
//					LEFT JOIN tblcenterzoneadmin on tbluser.id=tblcenterzoneadmin.user_id
//					WHERE tbluser.id=$user_id;
//SQL;
//echo $this->db->sql;
//				$this->db->Queryone();
//				$this->b['center_id'] = $this->db->rs['center_id'];
//				$this->b['zone_id'] = $this->db->rs['zone_id']; zone_id 不唯一 不返回
//				$this->b['subject_id']=$this -> vr['subject_id'];
				
			}
		}	
		//插入新用户
		public function autoinsertuser(){
			$dbstring = $this -> randStr(16) ;
			$token = $this -> randStr(64) ;
			$ip = $this -> get_real_ip();			

			
			$code = $this -> randStr(64) ;
			$this -> code = $code;
			$password = $this -> v($this -> vr['password']);
			if(strlen($password)<=0){
				$password = $this -> randStr(64);
			}
			$this -> b['logintype'] = $this -> vr['logintype'];
			switch($this -> vr['logintype']){
				case 1:
				case 2:
					$arr['token'] = $token;
					$arr['last_login_time'] = 'current_timestamp()';
					$arr['reg_time'] = 'current_timestamp()';
					$arr['last_loginlocation'] = $ip;
					$arr['dbstring'] = $dbstring;
					$arr['username'] = $this -> vr['username'];
					$arr['gender'] = $this -> r('gender');
					$arr['passwd'] = $password;
					$arr['nickname'] = $this -> r('nick');
					$arr['code'] = $code;
					$arr['usr_type'] = (int)$this -> vr['usr_type'];
					$arr['yanzheng'] = 0;
					$arr['realname'] = $this -> r('realname');
					$this -> db -> Insert('tbluser',$arr);
					$userId = $this->db->Last_id();
					$data['user_id'] = $userId;
					$this->db->Insert('tblstudent', $data);
					$this -> b['sql'] = $this -> db -> sql;
					break;
				case 3:
				case 4://微博登陆
					$arr['token'] = $token;
					$arr['last_login_time'] = 'current_timestamp()';
					$arr['reg_time'] = 'current_timestamp()';
					$arr['last_loginlocation'] = $ip;
					$arr['dbstring'] = $dbstring;
					$arr['username'] = $this -> vr['username'];
					$arr['passwd'] = $password;
					$arr['nickname'] = $this -> vr['nick'];
					$arr['code'] = $code;
					$arr['usr_type'] = (int)$this -> vr['usr_type'];
					$arr['yanzheng'] = 1;
					$arr['sinaweibotoken'] = $this -> vr['accesstoken'];
					$arr['sinaweibouid'] = $this -> vr['uid'];
					$arr['sinaweibonick'] = $this -> vr['nick'];
					$this -> b['param'] = $arr;
					$username = $this -> vr['username'];
					$this->db->sql = <<<SQL
								select count(*) as num from tbluser where username=$username;
SQL;
					$this->db->Queryone();
					$rs = $this->db->rs['num'];
					if(!$rs){
						$this -> db -> Insert('tbluser',$arr);
						$userId = $this->db->Last_id();
						$data['user_id'] = $userId;
						$this->db->Insert('tblstudent', $data);
					}else{
						
					}
					
					break;
				default:
					break;
			}
			
			$this -> inserttype($this -> db -> Last_id());
			
			$this->b['id'] = $this -> db -> Last_id();
			$this -> b["username"] = $this -> vr['username'];
			$this -> b["nick"] = $arr['nickname'];
			$this -> b["yanzheng"] = $arr['yanzheng'];
			$this -> b["token"] = $token;
			$this -> b['vip'] = 0;
		
		}
		//插入身份信息
		public function inserttype($userid){
			switch($this -> vr['usr_type']){
				case 1:
					//插入学生
					$arr['uid'] = $userid;
					$this -> db -> Insert('tblstudent',$arr);
					break;
				case 2:
					//插入教师
					$arr['uid'] = $userid;
					$arr['level'] = 4;
					$arr['subject_grade'] = '{"subject":['.$this -> r('subject_id').'],"grade":['.$this -> r('grade_id').']}';
					$this -> db -> Insert('tblteacher',$arr);
					if(isset($_REQUEST['yq']) && $_REQUEST['yq']!=null){
						$arr1['y'] = (int)$this -> r('yq');
						$arr1['sy'] = $userid;
						$arr1['qd'] = (int)$this -> r('qd');
						$arr1['makedate'] = "current_timestamp()";
						$this -> db -> Insert('usr_yq',$arr1);
					}
					else if(isset($_REQUEST['qd']) && $_REQUEST['qd']!=null){
						$arr1['qd'] = (int)$this -> r('qd');
						$arr1['makedate'] = "current_timestamp()";
						$this -> db -> Insert('usr_yq',$arr1);
					}
					
					break;
				case 3:
					return;
					break;
				default:
					return;
					break;
			}
		}
		//查找是否有同名email
		public function verifyemail(){
			return $this -> db -> Queryif('tbluser',"username='".$this -> vr['username']."'");	
		}
		public function pushmail2mailstack($path,$data,$aim,$subject){
			//	获取毫秒的时间戳
			$time = explode ( " ", microtime () );
			$time = $time [1] . ($time [0] * 1000);
			$time2 = explode ( ".", $time );
			$time = $time2 [0];
			
			$filename = $time;
			$filepath = dirname(__FILE__)."/../../htdocs/ticool.hxnetwork.com/".$path."/".$filename;
			file_put_contents ($filepath, trim($aim)."\r\n".trim($subject)."\r\n".$data);

		}
		//设置新密码
		public function getinfo(){
			$id = (int)$this -> vr['id'];
			$password = $this -> randStr(8,"NUMBER");
			$sha256pass = hash("sha256",$password);
			$arr['passwd'] = $sha256pass;
			$this -> db -> Update('tbluser',$arr,"username=".$_REQUEST['username']);
			return $password;
		}
		
	
		public function verifycode(){
			return $this -> db -> Queryif('tbluser',"username='".$_REQUEST['username']."' and code='".$_REQUEST['code']."'");		
		}
		public function resetPassword(){
			if($this -> verifycode()>0){	
				$this -> pushmail2mailstack("mailstack1",'<div>华夏安业题库密码(重要)</div><div>您的密码已重置为 '.$this->getinfo().'</div><div>请及时登录修改</div>',$_REQUEST['username'],'华夏安业题库密码(重要)');
				$this -> b["sc"] = 200;
				
			} 
			else{
				$this -> b["sc"] = 401;
			}
		}
		//设置新code
		public function setcode(){
			$code = $this -> randStr(64,"ALL");
			$arr['code'] = $code;
			$this -> db -> Update('tbluser',$arr,"username='".$this -> vr['username']."'");
			return $code;
		}
		//激活帐户
		private function activeUser(){
			$id = $this -> ifhasrecord();
			if($id){
				$arr['yanzheng'] = 1;
				$this -> db -> Update('tbluser',$arr,"id=".$id);
				$this -> b['sc'] = 200;
			}
		}
		
		//激活邮箱
		private function activeEmail(){
			$id = $this -> ifhasrecord();
			if($id){
				$arr['bindemailyanzheng'] = 1;
				$this -> db -> Update('tbluser',$arr,"id=".$id);
				$this -> b['sc'] = 200;
			}
		}
		
		//是否有其记录
		private function ifhasrecord(){
			return $this -> db -> Queryif('tbluser',"username='".$this -> r('username')."' and code='".$this -> r('code')."'");	
		}
		//根据名字获取id和真实姓名
		private function getId(){
			if (isset($_REQUEST['utype']))
				$this -> db -> sql = "select id,realname,nickname from tbluser where username='".$this -> r('uname')."'"." and usr_type=".$this -> r('utype');
			else
				$this -> db -> sql = "select id,realname,nickname from tbluser where username='".$this -> r('uname')."'";
			$this -> db -> Queryone();
			$this -> b['sc'] = 200;
			$this -> b['user_id'] = $this -> db -> rs['id'];
			$this -> b['realname'] = $this -> db ->rs['realname'];
			$this -> b['nickname'] = $this -> db ->rs['nickname'];
		}
		
		//重置学生密码
		public function restStuPwd($n){
			$studentInfo['id'] = $n;
			$this ->db ->sql="update tbluser set passwd='8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92' where id={$n}";
			$this->b['sql'] = $this->db->sql;
			$this -> db -> Queryone();
		}
	}
	


?>