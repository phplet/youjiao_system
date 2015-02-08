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
			//echo $h['nu'];
			if($h!=0){
				$this -> arr["sc"] = 400;
			}
			else{
				$this->insertnew();
				
				
				$this -> pushmail2mailstack("mailstack1",'<div>欢迎注册华夏安业题库账号</div><div>您可复制以下地址到浏览器用来激活华夏安业题库账号，从而使用完整功能。</div><div>https://edu.hxpad.com/jihuo.php?username='.$_REQUEST['email'].'&code='.$this -> code.'</div><div>如果您未使用此邮箱注册账号，请勿激活。</div>',$_REQUEST['email'],'华夏安业题库账号激活(重要)');

				$this -> arr["sc"] = 200;
			}
		}
		public function pushmail2mailstack($path,$data,$aim,$subject){
			//	获取毫秒的时间戳
			$time = explode ( " ", microtime () );
			$time = $time [1] . ($time [0] * 1000);
			$time2 = explode ( ".", $time );
			$time = $time2 [0];
			
			$filename = $time;
			$filepath = dirname(__FILE__)."/../../../".$path."/".$filename;
			file_put_contents ($filepath, trim($aim)."\r\n".trim($subject)."\r\n".$data);

		}
		//查找是否有同名email
		public function verifyemail(){
			/* if(!preg_match("/^[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)*@[a-zA-Z0-9_-]+(\.{1}[a-zA-Z0-9_-]+)*\.{1}[a-zA-Z]{2,4}$/i",$_REQUEST['email'])){
				return true;
			} */
			return $this -> db -> Queryif('usr_user',"username='".$_REQUEST['email']."'");	
		}
		//插入新用户
		public function insertnew(){
			$dbstring = $this -> randStr(16) ;
			$token = $this -> randStr(64) ;
			$ip = $this -> get_real_ip();			
			if($_REQUEST['nick']==""){
				$nick = null;
			}
			else{
				$nick = $_REQUEST['nick'];
			}
			
			$code = $this -> randStr(64) ;
			$this->code = $code;
			
			
			$this -> db -> sql = "insert into usr_user (token,last_login_time,reg_time,last_loginlocation,dbstring,username,passwd,nickname,code,usr_type ) values('$token',current_timestamp(),current_timestamp(),'$ip','$dbstring','".$_REQUEST['email']."','".$_REQUEST['pw']."','".$nick."','".$code."',1)";
			//$this -> db -> sql = "";
			$this -> db -> ExecuteSql();
			$userid = $this -> db -> Last_id();
			$this -> db -> sql = "insert into usr_student (uid) values('$userid')";
			$this -> db -> ExecuteSql();
			//$this -> arr["dbstring"] = $dbstring;
			$this -> arr["username"] = $_REQUEST['email'];
			$this -> arr["token"] = $token;
		}
	}
	
	
	$rs = new rss("POST",array("email","pw","func"));
	
