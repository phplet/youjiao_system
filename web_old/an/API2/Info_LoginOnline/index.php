<?php
///////////////////////////////////////////////////////
// 登录接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
 	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				$id = $rs[1];
				$this -> doinsertlogininfo();
				$this -> selectandwrite('username,token,dbstring,yanzheng','usr_user',$id);
				$this -> arr["sc"] = 200;
			}
			else{
				$this -> arr["sc"] = 401;
			}
		}
		//更新数据库登录信息
		public function doinsertlogininfo(){
			$token = $this -> randStr(64) ;
			$ip = $this -> get_real_ip();
			$this -> db -> sql = "update usr_user set token='$token',last_login_time=current_timestamp(),last_loginlocation='$ip' where username='".$_REQUEST["username"]."'";
			$this -> db -> ExecuteSql();
		}
	} 
	

	if(strlen($_REQUEST["password"])==0){
		$rs = new rss("POST",array("username","token","func","time"));
	}
	else{
		$rs = new rss("POST",array("username","password","func","time"));
	} 
	
?>