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
			if($this -> urlarr[3]=="getPassword"){
				//找回密码
				$this -> getPassword();				
			}
			else if($this -> urlarr[3]=="student"){
				$this -> getSutdentInfo();
			}
			else if($this -> urlarr[3]=="teacher"){
				$this -> getTeacherInfo();
			}
			else if($this -> urlarr[3]=="name2id"){
				$this -> getId();
			}
			else{
				//处理登陆
				$this -> login();
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
				$this -> db -> sql = "select ".$str." from usr_student JOIN usr_user ON usr_user.id=usr_student.uid where ".$condition;
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
				$this -> db -> sql = "select ".$str." from usr_teacher JOIN usr_user ON usr_user.id=usr_teacher.uid where ".$condition;
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
				//$this -> b['sc']=401;
				if(($logintype==3) && $this -> b["sc"]==401){ //微博注册    //qq注册
					$this -> autoinsertuser();
					$this -> b['sc']=201;
				}
				
				if((int)$this -> vr['logintype']==4 && $this -> b["sc"]==401){
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
						print($this -> b['sc']);
                        //$this -> b['sc']=401;
						if ($this -> vr['usr_type']==1)
						{
							//$this -> b['sc']=201;
						}
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
			if($this -> urlarr[3]=="resetPassword"){
				$this -> resetPassword();
			}
			else if($this -> urlarr[3]=="updateinfo"){
				//更新用户信息
				if($this -> vr['pass']){
					$arr4['realname']=$this -> r('realname');
					$arr4['gender']=(int)$this -> r('gender');
					$arr4['nickname']=$this -> r('nickname');
					
					$this -> db -> Update('usr_user',$arr4,"id=".$this -> vr['id']);
					if($this -> vr['usr_type']==2){
						$arr5['subject_grade']='{"subject":['.$this -> r('subject_id').'],"grade":['.$this -> r('grade_id').']}';
						$arr5['mobile']=(int)$this -> r('mobile');
						$this -> db -> Update('usr_teacher',$arr5,"uid=".$this -> vr['id']);
						
					}
					else if($this -> vr['usr_type']==1){
						$arr6['grade_id'] = $this -> r('grade_id');
						$this -> db -> Update('usr_student',$arr6,"uid=".$this -> vr['id']);
					}
				}
				
			}else  if($this -> urlarr[3]=="updatestudentinfo"){
				$studentInfo['realname'] = $this->r('realname');
				$studentInfo['gender'] = $this->r('sex');

				$this -> db -> Update('usr_user',$studentInfo,"id=".$this -> r('stu_uid'));
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
					$this -> db -> Update('usr_user',$arr1,"id=".$this -> vr['id']);
					$this -> b['sc']=200;
				}
			}
			else if($this -> vr['pass']){
				//改密码
				$arr['passwd'] = $this -> r('password');
				$this -> db -> Update('usr_user',$arr,"id=".$this -> vr['id']." and passwd='".$this -> vr['passwd']."'");
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
		}
		//更新登陆信息
		public function upinfo(){
			$token = $this -> randStr(64) ;
			$ip = $this -> get_real_ip();
			$arr['token'] = $token;
			$arr['last_login_time'] = 'current_timestamp()';
			$arr['last_loginlocation'] = $ip;
			$this -> db -> Update('usr_user',$arr,"username='".$this -> vr["username"]."'");
			$this -> b["token"] = $token;
			$this -> b["usr_type"] = $this -> vr['usr_type'];
			$this -> b["yanzheng"] = $this -> vr['yanzheng'];
			if(isset($this -> vr['level'])){
				$this -> b["level"] = $this -> vr['level'];
			}
			if(isset($this -> vr['school_id'])){
				$this -> b["school_id"] = $this -> vr['school_id'];
			}
			$this -> b['username'] = $this -> vr["username"];
			$this -> b['realname'] = $this -> vr["realname"];
			$this -> b['nick'] = $this -> vr["nick"];
			$this -> b['sch_type'] = $this -> vr["sch_type"];
			$this -> b['id'] = $this -> vr['id'];
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
					$this -> db -> Insert('usr_user',$arr);
					
					break;
				case 3:
				case 4:
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
					
					$this -> db -> Insert('usr_user',$arr);
					//$this -> b['sql'] = $this -> db -> sql;
					break;
				default:
					break;
			}
			
			$this -> inserttype($this -> db -> Last_id());
			
			$this -> b["username"] = $this -> vr['username'];
			$this -> b["nick"] = $arr['nickname'];
			$this -> b["yanzheng"] = $arr['yanzheng'];
			$this -> b["token"] = $token;
		
		}
		//插入身份信息
		public function inserttype($userid){
			switch($this -> vr['usr_type']){
				case 1:
					//插入学生
					$arr['uid'] = $userid;
					$this -> db -> Insert('usr_student',$arr);
					break;
				case 2:
					//插入教师
					$arr['uid'] = $userid;
					$arr['level'] = 4;
					$arr['subject_grade'] = '{"subject":['.$this -> r('subject_id').'],"grade":['.$this -> r('grade_id').']}';
					$this -> db -> Insert('usr_teacher',$arr);
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
			return $this -> db -> Queryif('usr_user',"username='".$this -> vr['username']."'");	
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
			$this -> db -> Update('usr_user',$arr,"username=".$_REQUEST['username']);
			return $password;
		}
		
	
		public function verifycode(){
			return $this -> db -> Queryif('usr_user',"username='".$_REQUEST['username']."' and code='".$_REQUEST['code']."'");		
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
			$this -> db -> Update('usr_user',$arr,"username='".$this -> vr['username']."'");
			return $code;
		}
		//激活帐户
		private function activeUser(){
			$id = $this -> ifhasrecord();
			if($id){
				$arr['yanzheng'] = 1;
				$this -> db -> Update('usr_user',$arr,"id=".$id);
				$this -> b['sc'] = 200;
			}
		}
		
		//激活邮箱
		private function activeEmail(){
			$id = $this -> ifhasrecord();
			if($id){
				$arr['bindemailyanzheng'] = 1;
				$this -> db -> Update('usr_user',$arr,"id=".$id);
				$this -> b['sc'] = 200;
			}
		}
		
		//是否有其记录
		private function ifhasrecord(){
			return $this -> db -> Queryif('usr_user',"username='".$this -> r('username')."' and code='".$this -> r('code')."'");	
		}
		//根据名字获取id和真实姓名
		private function getId(){
			if (isset($_REQUEST['utype']))
				$this -> db -> sql = "select id,realname,nickname from usr_user where username='".$this -> r('uname')."'"." and usr_type=".$this -> r('utype');
			else
				$this -> db -> sql = "select id,realname,nickname from usr_user where username='".$this -> r('uname')."'";
			$this -> db -> Queryone();
			$this -> b['sc'] = 200;
			$this -> b['user_id'] = $this -> db -> rs['id'];
			$this -> b['realname'] = $this -> db ->rs['realname'];
			$this -> b['nickname'] = $this -> db ->rs['nickname'];
		}
	}
	


?>