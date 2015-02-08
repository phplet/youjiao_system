<?php
///////////////////////////////////////////////////////
// 获取用户数量接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			if($_REQUEST['username']=="af24hy4qw5v2v824aj"){
				$this -> arr["sc"] = 200;
				$this -> selectandwrites1('count(*) as total','usr_user',null,null,' id!=0');
				$this -> selectandwrites1('count(*) as ytotal','usr_user',null,null,' yanzheng=1');
			}
			

		}

	}
	
	//$rs = new rss("GET",array("username","token","func","time"));
	$rs = new rss("GET",array("username"));
	
	
?>