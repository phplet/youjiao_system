<?php
///////////////////////////////////////////////////////
// 更改题目接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	require_once(dirname(__FILE__)."/../../core/sync.php");
	
	class rss extends rs{
		public $uid;
		//验证通过处理
		public function onsucess(){
			
			if($_REQUEST['username']=="jf0q2ur0ujsafj03[qrmo0vmas[k2-44rtuj" && $_REQUEST['password']=="asdjf02q3ujr9-fkdspafk-q2rfi-weaikr0-234it420jw0f"){
				$hh = true;
			}
			else{
				$hh = false;
				return;
			}
			if($hh){
				$this -> db -> sql = "update exam_question set content='".$_REQUEST["content"]."',answer='".$_REQUEST["answer"]."' where id=".$_REQUEST["id"];
				$this -> db -> ExecuteSql();
				$this -> arr["sc"] = 200;
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}
		
	}
	
	
	$rs = new rss("POST",array("username","password","func","id","content","answer"));
	
?>