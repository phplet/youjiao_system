<?php
///////////////////////////////////////////////////////
// 知识点接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
//			$section = $this->r('section');
			$subject = $this->r('subject');
			$this -> getList($subject);
		}
	
		//POST逻辑
		public function doPOST(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$act = $this->r('action');
			switch($act){
				case 'add':
					$modify = $this->r('modify');
					$news = $this->r('news');
					$removes = $this->r('remove');
					
					$modify && $this->post_modify_knowledge($modify);
					$news && $this->post_add_knowledge($news);
					$removes && $this->post_delete_knowledge($removes);
					break;
			}
			$this->b['sc'] = 200;
		}
	
		//PUT逻辑
		public function doPUT(){
			$this -> b["sc"] = 405;
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		//列表
		public function getList($subject_id){
//			$this -> db -> sql = "select * from edu_knowledge where parent_id=".$this -> r('parent_id')." and level=".$this -> r('level')." and subject_id=".$this -> r('subject_id')." and grade_id=".$this -> r('grade_id');

			$this -> db -> sql = "select id , name as text , parent_id , subject_id , grade_id , sort_id , level from edu_knowledge WHERE subject_id=".$subject_id." ORDER BY sort_id ASC";
			$this -> db -> Query();
			$this -> b = $this -> db -> rs;
			$this -> b["sc"] = 200;			
		}
		
		private function post_modify_knowledge($modifyList){
			$sql = 'INSERT INTO edu_knowledge (id,level,parent_id,sort_id) VALUES ';
			foreach($modifyList as $modify){
				$sql .= '('.$modify['id'] .','.strlen($modify['sort_id']).','.$modify['parent_id'] .',"'.$modify['sort_id'].'"),';
			}
			$sql = substr($sql , 0 , strlen($sql) - 1);
			$sql .= ' ON DUPLICATE KEY UPDATE level=VALUES(level) , parent_id=VALUES(parent_id) , sort_id=VALUES(sort_id)';
			
			$this->db->sql = $sql;
			$modifyResult = $this->db->ExecuteSql();
			if($modifyResult){
				$this->b['flag'] = true;
 			}else{
				$this->b['flag'] = false;
 			}
			$this->b['sc'] = 200;
		}
		
		private function post_add_knowledge($addList){
			foreach($addList as $k =>$v){
				$addList[$k]['level'] = strlen($v['sort_id']);
			}
			$insertResult = $this->db->Inserts('edu_knowledge' , $addList );
			if($insertResult){
				$this->b['flag'] = true;
 			}else{
				$this->b['flag'] = false;
 			}
			$this->b['sc'] = 200;
		}
		
		private function post_delete_knowledge($removeList){
			$deleteWhere = 'id in ('.implode(',',$removeList).')';
			$deleteResult = $this->db->delete('edu_knowledge' , $deleteWhere);
			if($deleteResult){
				$this->b['flag'] = true;
 			}else{
				$this->b['flag'] = false;
 			}
			$this->b['sc'] = 200;
		}

		
	}
	


?>