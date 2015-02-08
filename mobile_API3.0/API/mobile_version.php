<?php
/**
 * @copyright by XK
 * mobile_version 版本控制
 */
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		
		public function doGET(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
					switch ($action){
						case 'add_mobile_info':
							$this->add_mobile_info();
						break;
						case 'get_mobile_info':
							$this->get_mobile_info();
						break;
					}
		}
		public function doPOST(){
			
		}
		
		public function add_mobile_info(){
			$type =$this->r('type'); //主键 18初中，19高中
			
			$downloadUrl = $this->r('download_url');
			$version = $this->r('version');
			$forceUpdateVersion = $this->r('force_update_version');
			$content = $this->r('content');
			$downloadLimitCount = $this->r('download_limit_count');
			$downloadPath = $this->r('download_path');

			$this->db->sql = <<<SQL
			 								insert into mobile_version (type,download_url,version,force_update_version,content,download_limit_count,download_path) 
			 								values ('$type','$downloadUrl','$version','$forceUpdateVersion','$content','$downloadLimitCount','$downloadPath')  
			 								on duplicate key update  download_url='$downloadUrl',version='$version',force_update_version='$forceUpdateVersion',content='$content',
			 								download_limit_count='$downloadLimitCount',download_path='$downloadPath';
SQL;
			
			$this->db->ExecuteSql();
			$this->b['sql'] = $this->db->sql;
			$this->b['rs'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
		public function get_mobile_info(){
			$type = intval($this->r('type'));
			$this->db->sql = <<<SQL
										select download_url,version,force_update_version,content,download_limit_count,download_path,type  
										from mobile_version  where type=$type;
SQL;
			$this->db->Queryone();
			$rs = $this->db->rs;
			$this->b = $rs;
			$this->b['sc'] = 200;
		}
	}