<?php
class history_handler{
	/**
	 * 创建历史记录
	 */
	public function __construct(){
		global $DBCFG;
		//实例化数据库操作类
		$this -> db = new DB($DBCFG['default_local']['dbhost'] , $DBCFG['default_local']['dbname'] , $DBCFG['default_local']['dbuser'] , $DBCFG['default_local']['dbpasswd']);
	}
	
		public function add_class_student_history($classStuId){
			$sql = <<<SQL
						insert into tblclass2student_history (old_id,class_id,student_id,status,inactive_date,creator,creator_name,in_date,out_date) 
						(select tblclass2student.id,tblclass2student.class_id,tblclass2student.student_id,tblclass2student.status,tblclass2student.inactive_date,tblclass2student.creator,tblclass2student.creator_name,tblclass2student.creator_date,now() from tblclass2student 
						where tblclass2student.id=$classStuId);
SQL;
			$this->db->sql = $sql;
			$this->db->ExecuteSql();
		}
		
		/**
		 * 
		 */
		public function add_tblcenterzoneadmin_history(){
		}
}