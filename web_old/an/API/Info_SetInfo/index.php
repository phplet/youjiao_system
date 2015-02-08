<?php
///////////////////////////////////////////////////////
// 设置个人信息接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
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
			
			$this -> db -> sql = "update usr_student set province_id='".$_REQUEST['province_id']."',city_id='".$_REQUEST['city_id']."',district_id='".$_REQUEST['district_id']."',school_id='".$_REQUEST['school_id']."',grade_id='".$_REQUEST['grade_id']."' where uid=$id";			
			$this -> db -> ExecuteSql();
	
			$this -> db -> sql = "update usr_user set realname='".$_REQUEST['realname']."',gender='".$_REQUEST['gender']."' where id=$id";			
			$this -> db -> ExecuteSql();
			
		}
		
	}
	
	
	$rs = new rss("PUT",array("username","token","func","time"));
	
?>