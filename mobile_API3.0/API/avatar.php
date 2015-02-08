<?php
///////////////////////////////////////////////////////
// 头像接口
// by  xiaokun v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		
		//GET逻辑
		public function doGET(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			$this->b['action'] = $action;
			switch ($action){
				case 'download':
					$this->get_avatar();
					break;
			}
		}
	
		//POST逻辑
		public function doPOST(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			switch ($action){
				case 'upload':
					$this->upload_avatar();
					break;
			}
		}
	
		//PUT逻辑
		public function doPUT(){
//			$this -> active();
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		/**
		 * 上传头像
		 */

		 
		public function upload_avatar(){

				global $avatarPath;
				$picname = $_FILES['uploadedfile']['name'];
				$type = strstr($picname, '.');
//				$fileName = $this->r ( 'filename' );
				$rand = rand(100, 999);
				$fileName = date("YmdHis") . $rand . $type;
				$target_path = $avatarPath; //接收文件目录
				$target_path = $target_path . $fileName;
				
					
				if(move_uploaded_file($_FILES['uploadedfile']['tmp_name'], $target_path)) { 
				   $this->b['flag'] = true;
				}  else{ 
					$this->b['flag'] = false;
					return;
				}
			
			$userId = $this->r('user_id');

			$imageName = $userId.'.jpg';

			$sql = "insert into common_image (user_id,file_name,image) values(".$userId.",'".$fileName."','".$imageName."')  on duplicate key update  file_name='".$fileName."',image='".$imageName."'";
			$this->db->sql = $sql;
			$this->b['sql'] = $sql;
			$this->db->ExecuteSql();
			//$rs = $this->db->rs;
			//if($rs){
				$sql = "update tbluser set pic='".$fileName."' where id='".$userId."';";
				$this->db->sql = $sql;
				$this->db->ExecuteSql();
				$this->b['flag']  = true;
				$this->b['sc'] = 200;	
			//}else{
			//	$this->b['flag']  = false;
			//	$this->b['sc'] = 403;	
			//}
			
		}
		
		/*
		 * 获取头像
		 */
		public function get_avatar(){
			global $avatarPath;
			$sql = 'select * from common_image where user_id='.$this->r('user_id');
			$this->db->sql = $sql;
			$this->b['sql'] =$this->db->sql;
			$this->db->Queryone();
			$rs = $this->db->rs;
			$this->b['list'] = $rs['file_name'];
			$this->b['path'] =  $avatarPath;

			$rs = $this->db->rs;
			$this->b['sc'] = 200;	
//			if($rs){
//				$this->b['sc'] = 200;	
//			}else{
//				$this->b['sc'] = 200;
//			}
		}
	}
?>