<?php
/**
 * 操作处理类
 * @author sky
 *
 */
class action_handler {
	
	public function __construct(){
		$this->db = db_handler::getInstance();
	}
	
	/**
	 * 添加用户的操作信息
	 * @param  $userId
	 * @param  $data
	 */
	public function post_add_user_action($userId,$data){
		$dataTmp = array();
		$dataTmp['user_id'] = $userId;
		$dataTmp['element_id'] = $data['element_id'];
		$dataTmp['subject_id'] = $data['subject_id'];
		$dataTmp['action_id'] = $data['action_id'];
		$dataTmp['type_id'] = $data['type_id'];
		$dataTmp['content'] = $data['content'];
		$dataTmp['create_date'] = 'now()';
		$table = 'cloud_user_action';
		$this->db->Insert($table, $dataTmp);
		if($this->db->rs===false){
			return false;
		}else{
			return true;
		}
	}
	
	public function get_query_action(){
		$this->db->sql = <<<SQL
				select id,action_name from cloud_action
SQL;
		$this->db->Query();
		return $this->db->rs;
	}
	
	public function get_query_action(){
		$this->db->sql = <<<SQL
				select id,action_name from cloud_action
SQL;
		$this->db->Query();
		return $this->db->rs;
	}
}