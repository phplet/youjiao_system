<?php
///////////////////////////////////////////////////////
// 老师接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		
		public function doGET(){
			$account = $this->r('account');
			$this->post_verify_account($account);
		}
		
		public function doPOST(){
			$action = $this->r('action');
			
			switch($action){
				case 'verify_account':
					$account = $this->r('account');
					$this->post_verify_account($account);
					break;
			}
		}
		
		private function post_verify_account($account){
			$sql = 'SELECT COUNT(*) as count FROM tbluser WHERE username="'.$account.'"';
			$this->db->sql = $sql;
			$this->db->Queryone();
			
			if($this->db->rs['count'] > 0){
				$this->b['flag'] = false;
			}else{
				$this->b['flag'] = true;
			}
			$this->b['sc'] = 200;
			
		}
		
	}
?>