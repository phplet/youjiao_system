<?php
///////////////////////////////////////////////////////
// 学科列表接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			$this -> getList();
		}
	
		//POST逻辑
		public function doPOST(){
			$this -> b["sc"] = 405;
		}
	
		//PUT逻辑
		public function doPUT(){
			$this -> b["sc"] = 405;
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		//列表
		public function getList(){
			if(isset($_REQUEST['id'])){
				$this -> db -> sql = "select * from edu_subject where id=".$this -> r('id');
			}
			else if(isset($_REQUEST['Name'])){
				$this -> db -> sql = "select * from edu_subject where Name='".$this -> r('Name')."'";
			}
			else{
				$this -> db -> sql = "select * from edu_subject";
			}
			
			$this -> db -> Query();
			$this -> b["subject"] = $this -> db -> rs;
			$this -> b["sc"] = 200;			
		}

		
	}
	


?>