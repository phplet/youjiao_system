<?php
///////////////////////////////////////////////////////
// 城市查询接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		
		public function doGET(){
			$action = $this->r('action');
			if($action == 'list'){
				$provinceid = intval($this->r('provinceid'));
				if($provinceid == 0){
					$this->b['flag'] = false;
					$this->b['sc'] = 400;
				}
				
				$this->get_city_list($provinceid);
			}
		}
		
		private function get_city_list($provinceid){
			$sql = 'SELECT id,name FROM area_city WHERE province_id='.$provinceid;
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
	}
	
?>