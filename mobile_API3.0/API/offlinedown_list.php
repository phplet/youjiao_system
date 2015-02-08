<?php
///////////////////////////////////////////////////////
// 专题列表接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				$this -> getList();
			}
		}
		//POST逻辑
		public function doPOST(){
			$this -> b["sc"] = 405;
		}
		//PUT逻辑
		public function doPUT(){
			$this -> b["sc"] = 405;
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
//		//获取离线包列表
//		public function getList(){
//			$pageSize=20;
//			$recordFrom=1;
//			$recordFrom=$_REQUEST["recordfrom"];
//			$pageSize=$_REQUEST["pagesize"];
//			$type=$_REQUEST["type"];
//			$grade=$_REQUEST["grade"];
//			$subject_id=$_REQUEST["subject_id"];
//			if ( !(isset($_REQUEST["recordfrom"]) && isset($_REQUEST["pagesize"]) && isset($_REQUEST["type"])))
//			{
//				$this -> b["sc"] = 403;
//				return;
//			}
//			
//			$this -> db -> sql = "select id from package_info where type=" . $type . " and  grade=".$grade. " and  subject_id=".$subject_id;
//			$this -> db -> Query();
//            $pageTotal=count($this -> db -> rs);
//			
//			$this -> db -> sql =  "select * from package_info where type=" . $type . " and  grade=".$grade. " and  subject_id=".$subject_id . " order by id limit ".$recordFrom.",".$pageSize;	
//			$this -> db -> Query();
//			$this -> b['totalrecord']=$pageTotal;
//			$this -> b['packagelist'] = $this -> db -> rs;
//			$this -> b["sc"] = 200;
//		}

		
		//获取离线包列表
	public function getList() {
		$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
//		if($this->r('dbtype')=='1'){
//			}else if($this->r('dbtype')=='2'){
//				$dbJson = $this->query_curriculumndb();
//				if(count($dbJson)>0){
//					$db = json_decode($dbJson,true);	
//					$this->switchDB($db['ip'],$db['name']);
//				}
//			}
		$pageSize = 20;
		$recordFrom = 1;
		$recordFrom = $_REQUEST ["recordfrom"];
		$pageSize = $_REQUEST ["pagesize"];
		
		$this->b['aa']=1;
		//处理地区输入
		if ((is_numeric ( $_REQUEST['area'] ) and ( int ) $this->r ( 'area' ) == 0) or ! isset ( $_REQUEST ['area'] )) {
			$area = "";
		} else {
			$area = " and title like  '%" . $this->r ( 'area' ) . "%' ";
		}
		//处理年份输入
		if (( int ) $this->r ( 'years' ) == 0 or ! isset ( $_REQUEST ['years'] )) {
			$year = '';
		} else {
			$year = " and year like '%" . $this->r ( 'years' ) . "%' ";
		}
		
		//Grade
		if (! isset ( $_REQUEST ['grade'] )) {
			$grade = '';
		} else {
			$grade = ' and grade=' . $this->r ( 'grade' );
		}
		
		//Type
		if (! isset ( $_REQUEST ['type'] )) {
			$type = '';
		} else {
			$type = ' and type=' . $this->r ( 'type' );
		}
		
		if (isset ( $_REQUEST ['key'] )) {
			$searchtext = $this->r ( 'key' );
			$searchtext = " and title like '%" . $searchtext . "%'";
		} else {
			$searchtext = "";
		}
		
		//学科处理
		if (( int ) $this->r ( 'subject_id' ) == 0) {
			$subject = "";
		} else {
			$subject = " and subject_id=" . $this->r ( 'subject_id' );
		}
		
		if (! (isset ( $_REQUEST ["recordfrom"] ) && isset ( $_REQUEST ["pagesize"] ) && isset ( $_REQUEST ["type"] ))) {
			$this->b ["sc"] = 403;
			return;
		}
		
		$this->b ['aa']=2;
		
		mysql_query('set names utf8');
		$this->db->sql = "select id from package_info where 1=1 " . $type . $grade . $subject . $area . $year . $searchtext;
		
		$this->db->Query ();
		$pageTotal = count ( $this->db->rs );
		
		$this->db->sql = "select * from package_info where 1=1 " . $type . $grade . $subject . $area . $year . $searchtext . " order by id desc limit " . $recordFrom . "," . $pageSize;
		$this->db->Query ();
		$this->b ['sql']=$this->db->sql;
		$this->b ['db'] = $this->db;
		$this->b ['totalrecord'] = $pageTotal;
		$this->b ['packagelist'] = $this->db->rs;
		$this->b ["sc"] = 200;
		}
		
	}
	


?>