<?php
class test_comment_handler {
	public function __construct() {
		$this->db = db_handler::getInstance ();
	}
	
	public function add_test_comment($data){
		$dataTmp['name'] = $data['name'];
		$dataTmp['center_id'] = $data['center_id'];
		$dataTmp['zone_id'] = $data['zone_id'];
		$dataTmp['creator'] = $data['creator'];
		$dataTmp['create_date'] = 'now()';
		$table = 'tbltest_comment';
		$this->db->Insert($table, $dataTmp);
		$rs = $this->db->rs;
		if($rs===FALSE){
			return FALSE;
		}else{
			return $this->db->Last_id();
		}
	}
	
	public function modify_test_comment($id,$name){
			$this->db->sql = <<<SQL
				 				update tbltest_comment set name='$name',create_date='now()' where id=$id;
SQL;
		$this->db->ExecuteSql();
		$rs = $this->db->rs;
		if($rs===FALSE){
			return FALSE;
		}else{
			return true;
		}
	}
	
	public function add_test_comment_detail($data){
		$dataTmp['detail_content'] = $data['detail_content'];
		$dataTmp['tcid'] = $data['tcid'];
		$dataTmp['create_date'] = 'now()';
		$table = 'tbltest_comment_detail';
		$this->db->Insert($table, $dataTmp);
		$rs = $this->db->rs;
		if($rs===FALSE){
			return FALSE;
		}else{
			return true;
		}
	}
	
	/**
	 * 
	 * @param  $flag
	 * @param  $id
	 */
	public function remove_test_comment_or_detail($flag,$id){
		$table = $flag==1?"tbltest_comment":"tbltest_comment_detail";
		$this->db->sql = <<<SQL
									delete from $table where id=$id;
SQL;
		$this->db->Query();
		$rs = $this->db->rs;
		if($rs===FALSE){
			return FALSE;
		}else{
			return true;
		}
	}
	
	public function remove_test_comment($tcid){
		$this->db->sql = <<<SQL
								delete tbltest_comment,tbltest_comment_detail from tbltest_comment_detail
								left join tbltest_comment on tbltest_comment.id=tbltest_comment_detail.tcid
								where tbltest_comment_detail.tcid=$tcid;
SQL;
		$this->db->ExecuteSql();
		$rs1 = $this->db->rs;
		$this->db->sql = <<<SQL
								delete  from tbltest_comment
								where tbltest_comment.id=$tcid;
SQL;
		$this->db->ExecuteSql();
		$rs2 = $this->db->rs;
		if($rs1&&$rs2===FALSE){
			return FALSE;
		}else{
			return true;
		}
	}
	public function get_test_comment($centerId,$zoneId){
		$this->db->sql = <<<SQL
								select tbltest_comment.id,tbltest_comment.name,tbltest_comment.center_id,tbltest_comment.zone_id,tbltest_comment.creator
								from tbltest_comment
								where center_id=$centerId and zone_id=$zoneId;
SQL;
		$this->db->Query();
		return $this->db->rs;
	}
	
	public function get_test_comment_detail_by_id($tcid){
		$this->db->sql = <<<SQL
								select * from tbltest_comment_detail where tcid=$tcid;
SQL;
		$this->db->Query();
		return $this->db->rs;
	}
	
	public function modify_test_comment_detail($id,$detail){
		$this->db->sql = <<<SQL
				 				update tbltest_comment_detail set detail_content='$detail',create_date='now()' where id=$id;
SQL;
		$this->db->ExecuteSql();
		$rs = $this->db->rs;
		if($rs===FALSE){
			return FALSE;
		}else{
			return true;
		}
	}
	
	public function add_schoool_info($data){
		$dataTmp['address'] = $data['address'];
		$dataTmp['url'] = $data['url'];
		$dataTmp['tel'] = $data['tel'];
		$dataTmp['contacts'] = $data['contacts'];
		$dataTmp['creator'] = $data['creator'];
		$dataTmp['center_id'] = $data['center_id'];
		$dataTmp['zone_id'] = $data['zone_id'];
		$dataTmp['create_date'] = 'now()';
		$table = 'tblschool';
		$this->db->Insert($table, $dataTmp);
		$rs = $this->db->rs;
		if($rs===FALSE){
			return FALSE;
		}else{
			return $this->db->Last_id();
		}
	}
	
	public function modify_school_info($id,$data){
		$table = 'tblschool';
		$dataTmp['address'] = $data['address'];
		$dataTmp['url'] = $data['url'];
		$dataTmp['tel'] = $data['tel'];
		$dataTmp['contacts'] = $data['contacts'];
		$dataTmp['creator'] = $data['creator'];
		$dataTmp['create_date'] = 'now()';
		$this->db->Update($table, $dataTmp,'id='.$id);
		$rs = $this->db->rs;
		if($rs===FALSE){
			return FALSE;
		}else{
			return true;
		}
	}
	
	public function get_school_info($centerId,$zoneId){
		$this->db->sql = <<<SQL
									select * from tblschool where center_id=$centerId and zone_id=$zoneId;
SQL;
		$this->db->Queryone();
		return $this->db->rs;
	}
}	