<?php
///////////////////////////////////////////////////////
// 密码修改接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				$id = $rs[1];
				//验证权限
				//类型 1 学生  2 教师  3 家长
				//教师级别 1校长，2年级主任，3班主任，4任课教师，5兼职教师
				/*if(!$this -> Pass($rs[1],array(2),array(1,2,3))){
					$this -> arr["sc"] = 911;
					return;
				}*/
				$this -> upinfo($id);
				$this -> arr["sc"] = 200;
			}
			else{
				$this -> arr["sc"] = 401;
			}

		}
		//设置新密码
		public function upinfo($id){
			//$sha256pass = hash("sha256",$_REQUEST['password']);
			$this -> db -> sql = "update usr_user set passwd='".$_REQUEST['new_password']."' where id=".$id;
			$this -> db -> ExecuteSql();
		}
		

	}
	
	$rs = new rss("POST",array("username","new_password","func","time","password"));
	
	
