<?php
///////////////////////////////////////////////
//同步 php类
//v1.0 by孙峻峰
///////////////////////////////////////////////


//数据库操作
require_once(dirname(__FILE__)."/../include/db.php");

class sync{

	private $db;

	public function __construct(){   
		//包含设置文件
		include(dirname(__FILE__)."/../include/config.php");
		//实例化数据库操作类
		$this->db = new DB($host,$dbname,$dbuser,$dbpass);
    }
	
	public function ifhas($sourceid){
		
		$this -> db -> Queryif("common_sync","sourceid='$sourceid'");
		return $this -> db -> rs;
		
	}
	
	public function delete($time,$sourceid){
		
		if(!$this -> comparetime($time,$sourceid)){
			return 400;
		}
		
		$rs = $this -> ifhas($sourceid);
		
		if($rs['nu'] != 0){
			$id = $rs['id'];
			$arr['delet_flag'] = true;
			$arr['sync_time'] = $time;
			$this -> db -> Update("common_sync","id='$id'",$arr);
			return 200;
		}
		else{
			return 400;
		}	
		
	}
	public function add($table,$pid,$time,$sourceid){
	
		$rs = $this -> ifhas($sourceid);
		
		
		if($rs['nu'] == 0){		
			$this-> db -> sql = "insert into common_sync table_name,pid,sync_time,delet_flag,sourceid values('$table','$pid','$time',false,'$sourceid')";
			return 200;
		}
		else{
			return 400;			
		}
	}
	public function update($time,$sourceid){
	
		if(!$this -> comparetime($time,$sourceid)){
			return 400;
		}
		
		$rs = $this -> ifhas($sourceid);
		
		
		if($rs['nu'] != 0){
			$id = $rs['id'];	
			$arr['delet_flag'] = false;
			$arr['sync_time'] = $time;			
			$this -> db -> Update("common_sync","id='$id'",$arr);
			return 200;
		}
		else{
			return 400;			
		}
	}
	
	public function comparetime($time,$sourceid){
	
		$rs = $this -> ifhas($sourceid);
		
		if($rs['nu'] != 0){
			
			$id = $rs['id'];
			$this -> db -> sql ="select time from sync_time where id='$id'";
			$this -> Queryone();
			$aimtime = $this -> rs['time'];
			if($aimtime > $time){
				return true;
			}
			else{
				return false;
			}
			
		}
		else{
			return true;			
		}
	}


}

?>