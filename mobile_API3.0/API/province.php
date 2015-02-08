<?php
///////////////////////////////////////////////////////
// 省查询接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		
		public function doGET(){
			$action = $this->r('action');
			if($action == 'list'){
				$this->get_province_list();
			}
		}
		
		private function get_province_list(){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			$subjectId = $this->r('subject_id');
			$sectionId = $this->r('section_id');
			$eduInfo = $this->get_edu_info($subjectId);
			$examExamination = $eduInfo['exam_examination'];
			$sql = 'SELECT id, Name as name FROM area_province';
			$this->db->sql = $sql;
			$this->db->Query();
			$rs = $this->db->rs;
			foreach ($rs as $key=>$value){
				$provinceId = $value['id'];
				$str = '年';
				$this->db->sql =<<<SQL
				select  distinct year FROM $examExamination WHERE year  like  "%$str" AND exam_type=1 AND province_id=$provinceId AND subject_id=$subjectId AND section_id=$sectionId ORDER BY year DESC;
SQL;
				mysql_query('set names utf8');
				$this->db->Query();
				$rs[$key]['year'] = $this->db->rs;
			}
			$this->b = $rs;
			$this->b['sc'] = 200;
		}
		
	}
?>