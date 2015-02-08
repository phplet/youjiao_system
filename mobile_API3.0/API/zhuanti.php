<?php
///////////////////////////////////////////////////////
// 专题接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				if($this -> urlarr[3]=="id"){
					$this -> getId();
					return;
				}
			}
			
			$section_id = intval($this->r('section'));
			$subject_id = intval($this->r('subject'));
			$this->get_zhuanti_list($section_id , $subject_id);
		}
	
		//POST逻辑
		public function doPOST(){
			$this -> b["sc"] = 405;
		}
	
		//PUT逻辑
		public function doPUT(){
			$this -> b["sc"] = 405;
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		
		/*************************** FUNCTION  ********************************/
	
		
		private function get_zhuanti_list($section_id , $subject_id){
			$tblZhuanti = array(
				'edu_zhuanti',
				'id' , 'name' , 'subject_id' , 'grade_id' , 'knowledge_list'
			);
			
			$tblGrade = array(
				'edu_grade' 
			);
			
			$condition = array(
				'edu_zhuanti.grade_id=edu_grade.id'
			);
			
			$where = '';
			if($section_id){
				$where = 'edu_grade.class_section_id='.$section_id;
			}
			
			if($subject_id){
				if($where != ''){
					$where .= ' AND ';
				}
				$where .= 'edu_zhuanti.subject_id='.$subject_id;
			}
			
			if($where != ''){
				$condition['where'] = $where;
			}
			
			
			$this->b = $this->db->withQueryMaker($tblZhuanti , $tblGrade , $condition);
//			echo $this->db->sql;
			$this->b['sc'] = 200;
		}
		
		
			//随机获取专题题目id
		public function getId(){
			if($this->r('dbtype')=='1'){
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}else if($this->r('dbtype')=='2'){
				$dbJson = $this->query_curriculumndb();
				if(count($dbJson)>0){
					$db = json_decode($dbJson,true);	
					$this->switchDB($db['ip'],$db['name']);
				}
			}
			//知识点处理
			if(isset($_REQUEST['searchtext'])){
				$searchtext=$this -> r('searchtext');
				$knowledge .= "zh_knowledge like '%".$searchtext."%'  ";
			}
			
			if(!($this -> r('knowledge')==""))
			{
				$zhuanti_id=$this -> r('knowledge');
				$tbl_list=$this ->get_edu_info($this -> r('subject_id'));
				$tbl = $tbl_list["edu_zhuanti"];
				
				$this -> db -> sql = "select  knowledge_list from ".$tbl." where  id='".$zhuanti_id."'";
				$this -> db -> Queryone();
			    $knowledge_list = $this -> db -> rs['knowledge_list'];
			$knowledge.= " or ";	
			//$kkk = explode(';',$this -> r('knowledge'));
			$kkk = explode(';',$knowledge_list);
			
			$knowledge = "(";
			foreach($kkk as $v){
				if($v!="" && $v!=null){
					//$v="";
					$knowledge .= "zh_knowledge like '%".$v."%' or ";
				}				
			}
			$knowledge = substr($knowledge,0,-4).") and subject_id=".$this -> r('subject_id');
			}
			//题目类型处理
			if(isset($_REQUEST['ti_type'])){
				if((int)$this -> r('ti_type')==1){
					$type = " and objective_flag=1";
				}
				else if((int)$this -> r('ti_type')==2){
					$type = " and objective_flag=0";
				}
				else{
					$type = "";
				}
				
			}
			else{
				$type = "";
			}
			
			//加一个参数difficulty 类型为 string 分为 5 等级 （分别以1,2,3,4,5从简单到困难标记，0为不限）
			//$difficulty=(int)$this -> r('difficulty');
			if(isset($_REQUEST['difficulty'])){
				$difficulty=(int)$this -> r('difficulty');
			}
			else{
				$difficulty=0;
			}
			
			if($difficulty!==0){
				$sdifficulty=" and difficulty=".((int)$this -> r('difficulty'));
			}
			else{
				$sdifficulty="";
			}
			
			//$knowledge=" 1=1 ";
			 $tbl = $this->get_examination_tbl($this->r('subject_id'));
			 $tbl_index = $tbl.'_index';
			 $this -> db -> sql = 'select gid as id from '.$tbl_index.' where '.$knowledge.$type.$sdifficulty.' order by rand() limit '.$this -> r('total');
			//$this -> db -> sql = 'select id from exam_question_index where '.$type.$sdifficulty.' order by rand() limit '.$this -> r('total');
			//$this -> db -> sql = 'select id from exam_question_index  order by rand() limit 10';
			
			
			/*
			if ($this -> r('subject_id')==2) {
				$this -> db -> sql = 'select id from exam_question_index where '.$knowledge.$type.$sdifficulty.'  limit '.$this -> r('total');
			}
			else{
				$this -> db -> sql = 'select id from exam_question_index where '.$knowledge.$type.$sdifficulty.' order by rand() limit '.$this -> r('total');
			}
			*/
			
			//$this -> db -> sql = 'select id from exam_question where '.$knowledge.$type.$sdifficulty.' order by rand() limit '.$this -> r('total');
			//$this -> b["sql"] = $this -> db -> sql;
			//return;
//			 mysql_query( 'set names utf8');
			$this -> db -> Query();
			$this -> b["sql"] = $this -> db -> sql;
			$this -> b["id"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		
		
	}
	
?>