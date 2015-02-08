<?php
///////////////////////////////////////////////////////
// 开发使用的测试接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	require_once (dirname(dirname(__FILE__))."/include/stat.php");
	class crest extends REST{
		
		public function doGET(){
			
			$a = '<root><item UID="11"></item></root>';
			
			$dom = new DOMDocument();
			$dom->loadXML($a);
			
			foreach($dom->documentElement->childNodes as $k=>$node){
				foreach($node->attributes as $attr){
					echo $attr->name , $attr->value;
				}
			}
			
			exit;
			
			
			
			echo '1dsadsadsa';
			try{
				
				$memcache = new Memcache();
	
				$memcache->connect('localhost' , 11211);
				print_r($memcache);
				
				$memcache->set('test' ,'123');
				
				echo $memcache->get('test');
				
			}catch(Exception $e){
				print_r($e);
			}
			
			exit;
		
			
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$this->db->sql = 'select * from exam_question_to_knowledge';
			$this->db->Query();
			print_r($this->db->rs);
			exit;
			/*
				TEST_CODE:	post_verify 
				
			*/
			
			$key = $this->r('key');
			$value = $this->r('value');
			
			$this->post_verify($key , $value);
			
			/*
				TEST_CODE:	post_delete_center_admin 
				
				$centerAdminInfo = array();
				$centerAdminInfo['center_id'] = $this->r('center_id');
				$centerAdminInfo['user_id'] = $this->r('user_id');
				$this->post_delete_center_admin($centerAdminInfo['center_id'],$centerAdminInfo['user_id']);
			*/
			
			
			
			/*
				TEST_CODE:	post_add_center_admin 
			
				$centerAdminInfo = array();
				$centerAdminInfo['center_id'] = $this->r('center_id');
				$centerAdminInfo['user_id'] = $this->r('user_id');
				$this->post_add_center_admin($centerAdminInfo);
			*/	
			
			
			/*
				TEST_CODE:	post_delete_center 
				
				$centerInfo = array();
				$centerid = $this->r('id');
				$this->post_delete_center($centerid);
			*/
			
			
			/*
				TEST_CODE:	post_modify_center 
				
				$centerInfo = array();
				$centerInfo['id'] = $this->r('id');
				$centerInfo['center_name'] = $this->r('center_name');
				$centerInfo['province_id'] = $this->r('province_id');
				$centerInfo['city_id'] = $this->r('city_id');
				$centerInfo['address'] = $this->r('address');
				$centerInfo['contact_info'] = $this->r('contact_info');
				$centerInfo['instruction'] = $this->r('instruction');
				$this->post_modify_center($centerInfo);
			*/
			
			
			/*
				TEST_CODE:	post_add_center 
				
				$centerInfo = array();
				$centerInfo['center_name'] = $this->r('center_name');
				$centerInfo['province_id'] = $this->r('province_id');
				$centerInfo['city_id'] = $this->r('city_id');
				$centerInfo['address'] = $this->r('address');
				$centerInfo['contact_info'] = $this->r('contact_info');
				$centerInfo['instruction'] = $this->r('instruction');
				$this->post_add_center($centerInfo);
			*/
		}
		
		public function doPOST(){
			
		}
		
			//验证
	private function post_verify($key , $value){
			$sql = 'SELECT COUNT(*) as count FROM tblcenter WHERE '.$key.'="'.$value.'";';
			$this->db->sql = $sql;
			$this->db->Queryone();
			$this->b['flag'] = $this->db->rs['count'] > 0 ? true : false;
			$this->b['sc'] = 200;
			return true;
		}
		
	}
	?>