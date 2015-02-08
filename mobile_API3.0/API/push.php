<?php
///////////////////////////////////////////////////////
// 推送接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			switch($this -> urlarr[3]){
				case "time":
					$this -> getTime();
				break;
				case "news":
					$this -> pushInfo();
				break;
				default:
				break;
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
		
		//获取时间间隔
		public function getTime(){
			$this -> b['time'] = 300;
			$this -> b['sc'] = 200;
		}
		//推送消息
		public function pushInfo(){
			$p = explode(",",$this -> r('program'));
			$where = "";
			if(isset($_REQUEST['user_id'])){
				$where .= " and user_id=".$this -> r("user_id");
			}
			else{
				$where .= " and isnull(user_id)";
			}
			$kk = explode(",",$this -> r('program'));
			$pp = "";
			foreach($kk as $v){
				$pp .= "'".$v."',";
			}
			$pp = substr($pp,0,-1);
			
			$kkk = explode(",",$this -> r('version'));
			$ppp = "";
			foreach($kk as $vv){
				$ppp .= "'".$vv."',";
			}
			$ppp = substr($ppp,0,-1);
			
			$this -> db -> sql = "select * from push_list where (program in (".$pp.") or program='all') and (version in (".$ppp.") or isnull(version)) and isnull(sendtime)".$where;
			$this -> db -> Query();
			$this -> b['push'] = $this -> db -> rs;
			
			$id = "";
			if($this -> db -> rs==null){
				$this -> b['sc'] = 400;
				return;
			}
			foreach($this -> db -> rs as $v){
				$id .= $v['id'].","; 
			}
			if($id!=""){
				$id = substr($id,0,-1);
				$arr['sendtime'] = 'current_timestamp()';
				$this -> db -> Update("push_list",$arr,"id in (".$id.")");
			}
			$this -> b['sc'] = 200;
			
		}

		
	}
	


?>