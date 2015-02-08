<?php
///////////////////////////////////////////////////////
// 更改密码接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	require_once(dirname(__FILE__)."/../../include/Fmail.class.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			
			$rs = $this -> verifytoken();
			if($rs[0]){
				$this -> upuserinfo();
				$this -> arr["sc"] = 200;
			}
			else{
				$this -> arr["sc"] = 400;
			}

		}
		//更新数据
		public function upuserinfo(){
			$id = $this -> db -> rs ["id"];
			$this -> db -> sql = "update usr_user set passwd='".$_REQUEST['np']."' where id=$id";			
			$this -> db -> ExecuteSql();
	
		}
		

	}
	
	$rs = new rss("PUT",array("username","func","np","password"));
	
	
?>