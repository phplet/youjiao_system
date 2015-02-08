<?php
///////////////////////////////////////////////////////
// 获取题目集合列表
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			//$rs = $this -> verifytoken();
			
			//if($rs[0]){
				//$id = $rs[1];
				$this -> arr["sc"] = 200;
				
				$limit = 10;				
				if($_REQUEST['pageindex']==0){
					$pageindex = 1;
					$limit = 9999;
				}
				if($_REQUEST['numofpage']==""){
					$numofpage = 50;
				}
				else{
					$numofpage - $_REQUEST['numofpage'];
				}
				$startrecord = ($_REQUEST['pageindex']-1)*$numofpage;

				$this -> selectandwrites('*','system_feedback',null,null,' id!=0 order by id desc limit '.$startrecord.','.$limit);
				$this -> selectandwrites('count(*) as total','system_feedback',null,null,' id!=0');
			//}
			//else{
				//$this -> arr["sc"] = 400;
			//}
		}

	}
	
	//$rs = new rss("GET",array("username","token","func","time","pageindex"));
	$rs = new rss("GET",array("pageindex"));
	
	
?>