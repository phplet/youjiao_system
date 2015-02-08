<?php

	include(dirname(__FILE__)."/../php_tool/mb.class.php");
	
	$arr = array();
	//$arr['id'] = 1;
	
	$mb = new MB();
	$mb -> API("ticool/count/user_all",$arr,'GET');

	include(dirname(__FILE__)."/../view/history.php");

?>