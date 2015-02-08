<?php
///////////////////////////////////////////////////////
// 题库硬件信息接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			$this -> b["sc"] = 405;
		}
	
		//POST逻辑
		public function doPOST(){
			$this -> b["sc"] = 405;
		}
	
		//PUT逻辑
		public function doPUT(){
			$this -> insertNew();
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;		
		}
		
		//插入新记录
		public function insertNew(){
			
			$this -> db -> sql = "insert into system_statistics (username,DeviceId,DeviceSoftwareVersion,Line1Number,NetworkCountryIso,NetworkOperator,NetworkOperatorName,NetworkType,honeType,SimCountryIso,SimOperator,SimOperatorName,SimSerialNumber,SimState,SubscriberId,VoiceMailNumber,celllocaltion,BOARD,BRAND,CPU_ABI,DEVICE,DISPLAY,FINGERPRINT,HOST,B_ID,MANUFACTURER,MODEL,PRODUCT,TAGS,B_TIME,B_TYPE,USER,SDK,CODENAME,INCREMENTAL,B_RELEASE,program,vision,b_gettime) values('".$_REQUEST['username']."','".$_REQUEST['DeviceId']."','".$_REQUEST['DeviceSoftwareVersion']."','".$_REQUEST['Line1Number']."','".$_REQUEST['NetworkCountryIso']."','".$_REQUEST['NetworkOperator']."','".$_REQUEST['NetworkOperatorName']."','".$_REQUEST['NetworkType']."','".$_REQUEST['honeType']."','".$_REQUEST['SimCountryIso']."','".$_REQUEST['SimOperator']."','".$_REQUEST['SimOperatorName']."','".$_REQUEST['SimSerialNumber']."','".$_REQUEST['SimState']."','".$_REQUEST['SubscriberId']."','".$_REQUEST['VoiceMailNumber']."','".$_REQUEST['celllocaltion']."','".$_REQUEST['BOARD']."','".$_REQUEST['BRAND']."','".$_REQUEST['CPU_ABI']."','".$_REQUEST['DEVICE']."','".$_REQUEST['DISPLAY']."','".$_REQUEST['FINGERPRINT']."','".$_REQUEST['HOST']."','".$_REQUEST['B_ID']."','".$_REQUEST['MANUFACTURER']."','".$_REQUEST['MODEL']."','".$_REQUEST['PRODUCT']."','".$_REQUEST['TAGS']."','".$_REQUEST['B_TIME']."','".$_REQUEST['B_TYPE']."','".$_REQUEST['USER']."','".$_REQUEST['SDK']."','".$_REQUEST['CODENAME']."','".$_REQUEST['INCREMENTAL']."','".$_REQUEST['B_RELEASE']."','".$_REQUEST['program']."','".$_REQUEST['vision']."',current_timestamp())";

			$this -> db -> ExecuteSql();
		}
		
	}
	


?>