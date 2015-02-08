<?php

	include(dirname(__FILE__)."/../php_tool/mb.class.php");
	
	$arr = array();
	$arr['date'] = $_REQUEST['date'];
	
	$mb = new MB();
	$mb -> API("ticool/count/user_month",$arr,'GET');

	echo $_REQUEST['date']."注册人数".$mb->rs['total']."人，激活人数".$mb->rs['ytotal']."人"; 

?>