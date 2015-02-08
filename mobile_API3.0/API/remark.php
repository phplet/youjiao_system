<?php
///////////////////////////////////////////////////////
//教师添加备注
///////////////////////////////////////////////////////
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				$action = $this->r('action');
					switch ($action){
						 case 'list_remark' :
						$pageNo = intval($this->r('pageno')) - 1;
						$countPerPage = $this->r('countperpage');
						$this->get_remarks_list($pageNo*$countPerPage,$countPerPage);
						break;
						 case 'remove_remark':
						 	$this->delete_remark();
						 break;
					}
				
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
	
		//POST逻辑
		public function doPOST(){
			if($this -> vr['pass']){
				$action = $this->r('action');
					switch ($action){
						case 'add_remark' :
						$this->add_remark();
						break;
						case 'modify_remark':
						$this->update_remark();
						break;
					}
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
	
		//PUT逻辑
		public function doPUT(){
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		public function get_remarks_list($offset,$step){
			$sql = 'select teach_remarks.*,tbluser.realname,tbluser.username from teach_remarks
						left join tbluser on tbluser.id=teach_remarks.teacher_id
						where teach_remarks.center_id='.$this->r('center_id').' and teach_remarks.zone_id='.$this->r('zone_id');
			if($this->r('class_id')){
				$sql.=' and teach_remarks.class_id='.$this->r('class_id');
			}
			if($offset&&$step){
				$sqlQuery =$sql. ' limit '.$offset.','.$step;
			}else{
				$sqlQuery = $sql;
			}
			$this->db->sql = $sqlQuery;
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['count'] = count($this->db->rs);
		}
		
		public function add_remark(){
			$table = 'teach_remarks';
			$data = array(
				'teacher_id'=>$this->r('teacher_user_id'),
				'class_id'=>$this->r('class_id'),
				'content'=>$this->r('content'),
				'create_date'=>'now()',
				'center_id'=>$this->r('center_id'),
				'zone_id'=>$this->r('zone_id')
			);
			$this->db->Insert($table, $data);
			if($this->db->rs){
				$this->b['flag'] = true;
			}else{
				$this->b['flag'] = false;
			}
		}
		
		public function update_remark(){
			$sql = 'update teach_remarks set content="'.$this->r('content').'",create_date=now() where id='.$this->r('remark_id');
			$this->db->sql = $sql;
			$this->db->ExecuteSql();
//			echo $sql;
			if($this->db->rs){
				$this->b['flag'] = true;
			}else{
				$this->b['flag'] = false;
			}
		}
		
		public function delete_remark(){
			$sql = 'delete from teach_remarks where id='.$this->r('remark_id');
			$this->db->sql = $sql;
			$this->db->ExecuteSql();
			if($this->db->rs){
				$this->b['flag'] = true;
			}else{
				$this->b['flag'] = false;
			}
		}
	}
	


?>