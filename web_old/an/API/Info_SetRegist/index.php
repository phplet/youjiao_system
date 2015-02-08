<?php
///////////////////////////////////////////////////////
// 注册信息接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$h = $this->verifyemail();
			
			if($h['nu']!=0){
				$this -> arr["sc"] = 400;
			}
			else{
				$this->insertnew();
				$this -> arr["sc"] = 200;
			}
		}
		//查找是否有同名email
		public function verifyemail(){
			if(!preg_match("/^[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)*@[a-zA-Z0-9_-]+(\.{1}[a-zA-Z0-9_-]+)*\.{1}[a-zA-Z]{2,4}$/i",$_REQUEST['email'])){
				return false;
			}
			return $this -> db -> Queryif('usr_user','username='.$_REQUEST['email']);		
		}
		//插入新用户
		public function insertnew(){
			$dbstring = $this -> randStr(16) ;
			$token = $this -> randStr(128) ;
			$ip = $this -> get_real_ip();			
			$this -> db -> sql = "insert into usr_user (token,last_login_time,reg_time,last_loginlocation,dbstring,username,passwd,nickname) values('$token',current_timestamp(),current_timestamp(),'$ip','$dbstring','".$_REQUEST['email']."','".$_REQUEST['password']."','".$_REQUEST['nick']."')";
			$this -> db -> ExecuteSql();
			$this->verifyemail();
			$userid = $this -> db -> rs ["id"];
			$this -> db -> sql = "insert into usr_student (userid) values('$userid')";
			$this -> db -> ExecuteSql();
			$this -> arr["dbstring"][0] = $dbstring;
			$this -> arr["username"][0] = $_REQUEST['email'];
			$this -> arr["token"][0] = $token;
			
		}
	}
	
	
	$rs = new rss("POST",array("email","password","func"));
	
?>