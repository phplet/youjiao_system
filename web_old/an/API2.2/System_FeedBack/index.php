<?php
///////////////////////////////////////////////////////
// 用户反馈接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				$id = $rs[1];			
				$this -> insertfeedback($id);
				$this -> arr["sc"] = 200;
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}

		//插入新用户
		public function insertfeedback($id){
			
			$this -> db -> sql = "insert into system_feedback (userid,feedtime,content) values('$id',current_timestamp(),'".$_REQUEST['content']."')";
			$this -> db -> ExecuteSql();
		}
	}
	
	
	$rs = new rss("POST",array("username","token","func","time","content"));
	
