<?php
date_default_timezone_set('PRC');
global $host,$dbname,$dbuser,$dbpass,$webpath,$webroot,$svr , $CFG ,$_curriculumndbhost,$_curriculumndbname,$DBCFG  ;
$DBCFG = array();
$DBCFG['192.168.11.16'] = array();
$DBCFG['192.168.11.16']['ticoolv2_project'] = array(
	'dbhost'=>'192.168.11.16',
	'dbname'=>'ticoolv2_project',
	'dbuser'=>'hhu',
	'dbpasswd'=>'hx3edc1qaz'
);
$DBCFG['192.168.11.16']['hx_curriculumn_v3'] = array(
	'dbhost'=>'192.168.11.16',
	'dbname'=>'hx_curriculumn_v3',
	'dbuser'=>'hhu',
	'dbpasswd'=>'hx3edc1qaz'
);

$DBCFG['192.168.11.16']['juren_curriculumn1112'] = array(
	'dbhost'=>'192.168.11.16',
	'dbname'=>'juren_curriculumn1112',
	'dbuser'=>'hhu',
	'dbpasswd'=>'hx3edc1qaz'
);

$DBCFG['default'] = $DBCFG['192.168.11.16']['hx_curriculumn_v3'];
$DBCFG['default_local'] = $DBCFG['192.168.11.16']['ticoolv2_project'];
$DBCFG['default_stat'] =  $DBCFG['192.168.11.16']['ticoolv2_project'];
$host = "192.168.11.16";
$dbname = "ticoolv2_project";
$dbuser = "hhu";
$dbpass = "hx3edc1qaz";
$webpath="http://dev.hxpad.com/word/";
$_curriculumndbhost="192.168.11.16";
$_curriculumndbname="hx_curriculumn_v3";




$webpath="http://dev.hxpad.com/word/";

$webroot = '/data/nginx/htdocs/dev.hxpad.com';

$CFG = array();

$CFG['phproot'] = '/data/nginx/mobile_API3.0';
$CFG['htmlroot'] = '/data/nginx/htdocs/dev.hxpad.com';




global $mobilePicPath , $avatarPath,$notesPicPath,$exerciseInitSettingPath,$exerciseHistoryPath,$examType,$subjectType,$numType,$wordpath,$doPdfPath,$pdfpath,$bookSettingPath,$abilityPath,$exerciseReportPath;

$mobilePicPath = '/data/nginx/htdocs/dev.hxpad.com/pic/mobile_pic/';
$avatarPath = '/data/nginx/htdocs/dev.hxpad.com/pic/avatar/';
$notesPicPath = '/data/nginx/htdocs/dev.hxpad.com/pic/notes_pic/';
$exerciseInitSettingPath = '/data/nginx/htdocs/dev.hxpad.com/exercise_setting/';
$bookSettingPath = '/data/nginx/htdocs/dev.hxpad.com/book_setting/';
$exerciseHistoryPath = '/data/nginx/htdocs/dev.hxpad.com/exercise_history/';

$exerciseReportPath = '/data/nginx/htdocs/dev.hxpad.com/exercise_report/';

$abilityPath = '/data/nginx/htdocs/dev.hxpad.com/ability/ability.xls';

$wordpath="http://dev.hxpad.com/word/";
$pdfpath="http://dev.hxpad.com/pdf/";
$doPdfPath = '192.168.1.142/PublicAsp.aspx?object=HXHelpDll.clsDealPDF&function=BuildPDF';
//1:作业/测试，2:专题，3：真题,:4名校,  5同步
$examType = array(
	'1','2','3','4','5','6','7','8','9'
);


$subjectType = array(
	'1','2','3','4','5','6','7','8','9'
);


$numType = array(
	'1'=>'一',
	'2'=>'二',
	'3'=>'三',
	'4'=>'四',
	'5'=>'五',
	'6'=>'六',
	'7'=>'七',
	'8'=>'八',
	'9'=>'九'
);
?>
