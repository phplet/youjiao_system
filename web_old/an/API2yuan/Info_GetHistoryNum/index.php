<?php
///////////////////////////////////////////////////////
// 获取好题本错题本
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				$id = $rs[1];
				$this -> selectandwrite('count(id) as goodbooknumber','study_collection',null,null," user_id=".$id." and flag=2");
				$this -> selectandwrite('count(id) as errorbooknumber','study_collection',null,null," user_id=".$id." and flag=1");
				$this -> arr["username"] = $_REQUEST['username'];
				$this -> arr["sc"] = 200;
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}

	}
	
	$rs = new rss("GET",array("username","token","func","time"));
	
	
?>