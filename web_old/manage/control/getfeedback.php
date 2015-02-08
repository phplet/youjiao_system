<?php

	include(dirname(__FILE__)."/../php_tool/mb.class.php");
	
	$arr = array();
	$arr['page'] = isset($_POST['page']) ? $_POST['page'] : 1;
	$arr['rp'] = isset($_POST['rp']) ? $_POST['rp'] : 10;
	$arr['sortname'] = isset($_POST['sortname']) ? $_POST['sortname'] : 'id';
	$arr['sortorder'] = isset($_POST['sortorder']) ? $_POST['sortorder'] : 'desc';
	$arr['query'] = isset($_POST['query']) ? $_POST['query'] : 0;
	$arr['qtype'] = isset($_POST['qtype']) ? $_POST['qtype'] : 0;
	
	$mb = new MB();
	$mb -> API("ticool/feedback",$arr,'GET');
	
	foreach($mb -> rs['rows'] as $k=>$v){
		if( strstr($v['username'],"@sinaweibo.hx") ){
			$sinauid = str_replace("@sinaweibo.hx","",$mb -> rs['rows'][$k]['username']);
			$mb -> rs['rows'][$k]['username'] = "<a href='http://weibo.com/u/".$sinauid."' target='_blank'>".$mb -> rs['rows'][$k]['username']."</a>";
		}
		else{
			$tt = array();
			$tt['username'] = $mb -> rs['rows'][$k]['username'];
			$tt['code'] = $mb -> rs['rows'][$k]['code'];
			$hh = base64_encode(json_encode($tt));
			$mb -> rs['rows'][$k]['username'] = "<a href='mailto:".$mb -> rs['rows'][$k]['username']."?body=https://edu.hxpad.com/ujihuo.php?u=".$hh."'>".$mb -> rs['rows'][$k]['username']."</a>";
		}
	}
	echo json_encode($mb -> rs);

?>