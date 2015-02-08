<?php
///////////////////////////////////////////////////////
// 加密接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			switch($this -> urlarr[3]){
				case "code":
					$this -> GetEncrypt();
				break;
				case "mkey":
					$this -> GetMkey();
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
		
		private function GetEncrypt(){
			switch($this -> urlarr[4]){
				case "user":
					$this -> getcodeByUser();
				break;
				default:
				break;
			}
		}
		private function getcodeByUser(){
			if($this -> vr['pass']){
				$this -> db -> sql = "select dbstring as code from usr_user where id=".$this -> vr['id'];
				$this -> db -> Queryone();
				$this -> b['code'] = $this -> db -> rs['code'];
				$this -> b['sc'] = 200;
			}
			else{
				$this -> b['sc'] = 401;
			}
		}
		
		private function GetMkey(){
			if($this -> vr['pass'] && isset($_REQUEST['mcode']) && isset($_REQUEST['pro_id'])){
				if(strlen($_REQUEST['mcode'])<2){
					$this -> b['sc'] = 403;
					return;
				}
				
			
				//处理验证数量
				$this -> db -> sql = "select total from usr_auth where uid=".$this -> vr['id']." and program_id=".$this -> r("pro_id");
				$this -> db -> Queryone();
				$total = $this -> db -> rs['total'];
				
				if($total<1){
					$this -> b['sc'] = 407;
					return;
				}
				
				$this -> db -> sql = "select count(id) as rtotal from usr_reg_equipment where uid=".$this -> vr['id']." and program_id=".$this -> r("pro_id");
				$this -> db -> Queryone();
				$rtotal = $this -> db -> rs['rtotal'];
				
				if($rtotal >= $total){
					$this -> b['sc'] = 408;
					return;				
				}
				
				
				
				$arr = array();
				$arr['active_date'] = 'current_timestamp()';
				
				
				$this -> db -> sql = "select id,a_time from usr_reg_equipment where uid=".$this -> vr['id']." and program_id=".$this -> r("pro_id")." and eq_id=".$_REQUEST['mcode'];
				$this -> db -> Queryone();
				$id = $this -> db -> rs['id'];
				if($id!=null){
					$arr['a_time'] =  $this -> db -> rs['a_time']+1;					
					$this -> db -> Update('usr_reg_equipment',$arr,"id=".$id);
					$this -> b['n'] = $total - $rtotal;
				}
				else{
					$arr['a_time'] = 1;
					$arr['uid'] = $this -> vr['id'];
					$arr['program_id'] =  $this -> r("pro_id");
					$arr['eq_id'] = $_REQUEST['mcode'];
					$this -> db -> Insert('usr_reg_equipment',$arr);	
					$this -> b['n'] = $total - $rtotal - 1;
				} 
				//处理数量验证完毕

				
		 		$this -> db -> sql = "select dbstring as code from usr_user where id=".$this -> vr['id'];
				$this -> db -> Queryone();
				$code = $this -> db -> rs['code'];
				$mm = substr(md5($this -> vr['username'].$_REQUEST['mcode']),8,16);

				require_once(dirname(__FILE__)."/../include/m.php");
				$aes = new CryptAES();
				$aes->set_key($mm);
				$aes->require_pkcs5();
				$this -> b['mkey'] = $aes->encrypt($code);				
				$this -> b['sc'] = 200;
				
				
			}
			else{
				$this -> b['sc'] = 401;
			}
		}

		
	}
	


?>