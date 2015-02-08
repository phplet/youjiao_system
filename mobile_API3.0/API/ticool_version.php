<?php
///////////////////////////////////////////////////////
// 题库反馈接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			$this -> getVersion();
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
		
		//获取版本信息
		private function getVersion(){
			if(isset($_REQUEST["partner_id"]))
			{
				switch($_REQUEST['grade_id']){
					case 18:
					$this -> b["version"] = file_get_contents($this->webroot."/an/downloadconfig/ticool-zk-".$_REQUEST["partner_id"].".dc");
					break;
					case 19:
					$this -> b["version"] = file_get_contents($this->webroot."/an/downloadconfig/ticool-gk-".$_REQUEST["partner_id"].".dc");
					break;
					default:
					break;
				}				
			}
			else
			{
				switch($_REQUEST['grade_id']){
					case 18:
					$this -> b["version"] =file_get_contents($this->webroot."/an/downloadconfig/ticool-zk.dc");
					break;
					case 19:
					$this -> b["version"] =file_get_contents($this->webroot."/an/downloadconfig/ticool-gk.dc");
					break;
					default:
					break;
				}
			}
			$this -> b["sc"] = 200;
		}
	}
?>