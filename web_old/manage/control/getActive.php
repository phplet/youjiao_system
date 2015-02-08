<?php
	include(dirname(__FILE__)."/../php_tool/mb.class.php");
	
	$arr = array();
	$arr['uname'] = $_REQUEST['uname'];
	
	$mb = new MB();
	$mb -> API("active",$arr,'PUT');
	
	
	switch($mb -> code){
		case 401:
			echo "账户 ".$arr['uname']." 不存在";
		break;
		case 203:
			echo "账户 ".$arr['uname']." 已经激活";
		break;
		case 200:
			echo "账户 ".$arr['uname']." 激活成功";
		break;
		default:
		break;
	}
	

?>