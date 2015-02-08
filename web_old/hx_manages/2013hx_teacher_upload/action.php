<?php
$action = $_GET['act'];
// echo dirname(__FILE__)."/../../../../API2.0/include/Excel/reader.php" ;
 require_once (dirname(__FILE__)."/../../../../API2.0/include/Excel/reader.php" );
if($action=='delimg'){
	$filename = $_POST['imagename'];
	if(!empty($filename)){
		unlink('files/'.$filename);
		echo '1';
	}else{
		echo '删除失败.';
	}
}else{
	$picname = $_FILES['mypic']['name'];
	$picsize = $_FILES['mypic']['size'];
	if ($picname != "") {
		if ($picsize > 20480000) {
			echo 'EXCEL文件不能大于20M';
			exit;
		}
		$type = strstr($picname, '.');
		if ($type != ".XLS" && $type != ".xls" && $type != ".XLT" && $type != ".xlt") {
			echo 'EXCEL文件格式不对！';
			exit;
		}
		$rand = rand(100, 999);
		$pics = date("YmdHis") . $rand . $type;
		//上传路径
		$pic_path = "files/". $pics;
		move_uploaded_file($_FILES['mypic']['tmp_name'], $pic_path);
	}
	$size = round($picsize/1024,2);
	$arr = array(
		'name'=>$picname,
		'pic'=>$pics,
		'size'=>$size
	);
	 
//	echo json_encode($arr);

// ExcelFile($filename, $encoding);
$data = new Spreadsheet_Excel_Reader();
// Set output Encoding.
$data->setOutputEncoding('UTF-8');
$data->read($pic_path);
error_reporting(E_ALL ^ E_NOTICE);
$userInfo = $data->sheets[0]['cells'];
$offset =1;
$studentInfo = array_slice($userInfo, $offset,count($userInfo));

$studentTmp = array();
foreach ($studentInfo as $key=>$value){
	$studentTmp[$key]['username'] = $value[1];
	$studentTmp[$key]['realname'] = $value[2];
	$studentTmp[$key]['gender'] = $value[3];
	$studentTmp[$key]['email'] = $value[4];
	$studentTmp[$key]['grade'] = $value[5];
	$studentTmp[$key]['school_name'] = $value[6];
	$studentTmp[$key]['tel'] = $value[7];
}

foreach($studentTmp as $key=>$value){
	$sql = 'select count(*) as num from tbluser where username='.$value['user_name'];	
}

echo '<pre>';
print_r($studentInfo);
	
}
?>