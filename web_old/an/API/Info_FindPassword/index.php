<?php
///////////////////////////////////////////////////////
// 找回密码接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	require_once(dirname(__FILE__)."/../../include/Fmail.class.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			
			if($this -> verifyemail()){
				require(dirname(__FILE__)."/../../include/config.php");
				$fmail = new Fmail($svr, false);
				if($fmail->send($mail)) $this -> arr["sc"] = 200;
				else $this -> arr["sc"] = 400;
				$fmail->close();
			}
			else{
				$this -> arr["sc"] = 400;
			}

		}
		//设置新密码
		public function getinfo(){
			$id = $this -> db -> rs['id'];
			$password = $this -> randStr(6,"CHAR");
			$sha256pass = hash("sha256",$password);
			$arr = array('passwd'=>$sha256pass);
			$this -> db -> Update('usr_user',"id='$id'",$arr);
			return $password;
		}
		
		//查找是否有email
		public function verifyemail(){
			return $this -> db -> Queryif('usr_user','username='.$_REQUEST['email']);		
		}

	}
	
	$rs = new rss("GET",array("email","func"));
	
	
