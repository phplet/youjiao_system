<?php
///////////////////////////////////////////////////////
// 获取版本
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				$this -> arr["sc"] = 200;
				switch($_REQUEST['grade_id']){
					case 18:
					$this -> arr["vision"] = file_get_contents(dirname(__FILE__)."/../../downloadconfig/ticool-zk.dc");
					break;
					case 19:
					$this -> arr["vision"] = file_get_contents(dirname(__FILE__)."/../../downloadconfig/ticool-gk.dc");
					break;
					default:
					break;
				}
				//$this -> arr["vision"] = file_get_contents(dirname(__FILE__)."/../downloadconfig/".$_REQUEST['file']);
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}

	}
	
	$rs = new rss("GET",array("username","token","func","time"));
	
	
?>