<?php
// xiaokun 能力维度接口
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			$action = $this->r('action');
				if ($this->vr ['pass']) {
					switch ($action){
						case 'list':
						$pageNo = intval($this->r('pageno')) - 1;
						$countPerPage = $this->r('countperpage');
						$this->get_ability_list($pageNo*$countPerPage,$countPerPage);
						break;
						case 'change_status':
						$this->change_ability_status();
					}
				}
		}
	
		//POST逻辑
		public function doPOST(){
			$action = $this->r('action');
			if ($this->vr ['pass']) {
				switch ($action){
					case 'add':
					$this->add_ability();
					break;
					case 'modify':
					$this->modify_ability();
				}
			}
		}
	
		//PUT逻辑
		public function doPUT(){
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		public function add_ability(){
			$ability = array();
			$ability['ability_name'] = $this->r('ability_name');
			$ability['instruction'] = $this->r('instruction');
			$ability['subject_id'] =$this->r('subject_id');
			$ability['a_level'] = $this->r('a_level');
			$ability['b_level'] = $this->r('b_level');
			$ability['c_level'] = $this->r('c_level');
			$ability['creator'] = $this->r('user_id');
			$ability['center_id'] = $this->r('center_id');
			$ability['zone_id'] = $this->r('zone_id');
			$this->db->Insert('tblability', $ability);
			if($this->db->rs){
				$this->b['sc'] = '201';
				$this->b['flag']  = true;
			}else{
				$this->b['flag'] = 'insert into tblability failed';
			}
			
		}

		public function get_ability_list($offset,$step){
			$sql = 'select * from tblability';

			
			if($this->r('center_id')&&$this->r('zone_id')){
				$centerId = $this->r('center_id');
				$zoneId = $this->r('zone_id');
				$sql.=<<<SQL
							where center_id='$centerId' AND zone_id='$zoneId'	
SQL;
			}
			
			if($this->r('user_id')){
				$sql.=' and  creator ='.$this->r('user_id');
			}
			if($this->r('subject_id')){
				$sql.=' and subject_id like "%'.$this->r('subject_id').'%" ';
			}
			
			if($offset||$step){
				$limit = ' limit '.$offset.','.$step;
			}else{
				$limit = '';
			}
			$this->db->sql = $sql.$limit;
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
//			$this->b['sql'] = $this->db->sql;
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['count'] = count($this->db->rs);
		}
		
		public function modify_ability(){
			$ability = array();
			if($this->r('ability_name')){
				$ability['ability_name'] = $this->r('ability_name');
			}
			if($this->r('instruction')){
				$ability['instruction'] = $this->r('instruction');
			}
			if($this->r('subject_id')){
				$ability['subject_id'] =$this->r('subject_id');
			}
			if($this->r('a_level')){
				$ability['a_level'] = $this->r('a_level');
				
			}
			if($this->r('b_level')){
				$ability['b_level'] = $this->r('b_level');
				
			}
			if($this->r('c_level')){
				$ability['c_level'] = $this->r('c_level');
			}
			
			$this->db->Update('tblability', $ability,'id='.$this->r('id'));
			if($this->db->rs){
				$this->b['flag']  =true;
			}else{
				$this->b['flag'] = false;
			}
		}
	
		public function change_ability_status(){
			$ability = array();
			$ability['status'] = $this->r('status');
			$this->db->Update('tblability', $ability,'id='.$this->r('id'));
			if($this->db->rs){
				$this->b['flag']  =true;
			}else{
				$this->b['flag'] = false;
			}
		}
	}
	


?>