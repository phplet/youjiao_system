<?php
///////////////////////////////////////////////////////
// 查询接口
// by XIAOKUN v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		
		public function doGET(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			$action = $this->r('action');
			switch($action){
				case 'publisher':
					$subjectId = $this->r('subject_id');
					$gradeId = $this->r('grade_id');
					$sectionId = $this->r('section_id');
					$publisherId = $this->r('publisher_id');
					$this->get_publisher_list($subjectId,$gradeId,$sectionId,$publisherId);
					break;
				case 'chapter':
					$bookId = $this->r('book_id');
					$this->get_chapter_list($bookId);
					break;
				case 'zhenti': //真题
					$provinceId = $this->r('province_id');
					$subjectId = $this->r('subject_id');
					$sectionId = $this->r('section_id');
					$this->get_year_list($provinceId, $subjectId, $sectionId);
					break;
				case 'unitdata'://单元
					
					$subject = $this->r('subject');
					$grade = $this->r('grade');
					$publisher = $this->r('publisher');
					
					$this->get_unit_list($subject , $grade , $publisher);
					
					break;
					
				case 'zhuanti'://章节
					$sectionId = $this->r('section_id');
					$subjectId = $this->r('subject_id');
					//$this->b['subid'] = $this->r('subject_id');
					$this->get_zhuanti_list($sectionId, $subjectId);
					break;
			}
		}
		
		
		public function doPOST(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			$action = $this->r('action');
			
			switch($action){
				case 'create':
					
					$knowledge_id = $this->r('knowledge');
					$question_ids = $this->r('question');
					
					$this->post_create_relation($knowledge_id , $question_ids);
					
					break;
			}
			
		}
		
		private function get_publisher_list($subjectId,$gradeId,$sectionId=NULL,$publiserId=NULL){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			$eduInfo = $this->get_edu_info($subjectId);
			
//			$booksSql = 'select DISTINCT(publisher_id) from edu_books where subject_id='.$subjectId.' and grade_id='.$gradeId;
			if($gradeId){
				$booksSql = 'select DISTINCT(publisher_id) from '.$eduInfo['edu_book'].' where subject_id='.$subjectId.' and grade_id ='.$gradeId;
			}
			
			if($sectionId){
				$booksSql = 'select DISTINCT(publisher_id) from '.$eduInfo['edu_book'].' where subject_id='.$subjectId.' and section_id ='.$sectionId;
			}
			
			if($publiserId){
				$booksSql.=' and publisher_id='.$publiserId;
			}
			$this->db->sql = $booksSql;
			$this->db->Query();
			$rs = $this->db->rs;
			$publisherArr = array();
			if(count($rs)>0){
				foreach ($rs as $value){
					$publisherArr[] = $value['publisher_id'];
				}
			}
			$publisherStr = implode(',',$publisherArr);
			$publisherSql = 'select id,name as Name,abbr,pub_code,pub_index,name as notes from edu_publisher where id in('.$publisherStr.');';
//			echo $publisherSql;
//			exit;
			$this->db->sql = $publisherSql;
			$this->db->Query();
			$publisherRs = $this->db->rs;
			if(count($publisherRs)>0){
				foreach ($publisherRs as $key=>$value){
//					$sql = 'select * from edu_books where subject_id='.$subjectId.' and grade_id='.$gradeId.' and publisher_id='.$value['id'];
					if($sectionId){//学段查询
						$sql = 'select * from '.$eduInfo['edu_book'].' where subject_id='.$subjectId.' and section_id='.$sectionId.' and publisher_id='.$value['id'].';';
					}
					
					if($gradeId){//年级查询
						$sql = 'select * from '.$eduInfo['edu_book'].' where subject_id='.$subjectId.' and grade_id='.$gradeId.' and publisher_id='.$value['id'].';';
					}
					$this->db->sql=$sql;
					$this->db->Query();
					$publisherRs[$key]['books'] = $this->db->rs;
				}
			}
			$this->b['publisher'] = $publisherRs;
			$this->b['sc'] = 200;
		}
		
		
		private function get_grade_list(){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			
			$sql = 'SELECT * FROM edu_grade';
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['grade'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
		private function get_province_list(){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$sql = 'SELECT * FROM area_province';
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['province'] = $this->db->rs;
			$this->b['sc'] = 200;
		}
		
		private function get_year_list($provinceId,$subjectId,$sectionId){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			
//			$eudInfo = $this->get_edu_info($subjectId);
//			$sql ="select  distinct year FROM exam_examination WHERE year like '%年' AND exam_type=1 AND province_id=".$provinceId." AND subject_id=".$subjectId." AND grade_id=".$gradeId." ORDER BY year DESC";
//			$this->db->sql ='select * from edu_grade'; 

			$str = '年';
			$this->db->sql =<<<SQL
			select  distinct year FROM exam_examination WHERE year  like  "%$str" AND exam_type=1 AND province_id=$provinceId AND subject_id=$subjectId AND section_id=$sectionId ORDER BY year DESC;
SQL;
			mysql_query('set names utf8');
			$this->db->Query();
			$rs = $this->db->rs;
			$this->b['year'] = $rs;
//			foreach($this->b['year'] as $k => $v){
//				$this->b['year'][$k]['id'] = $k;
//			}
			$this->b['sc'] = 200;
			
		}
		
		private function get_subject_list(){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			
			$this->db->sql = 'SELECT * FROM edu_subject';
			$this->db->Query();
			$this->b['subject'] = $this->db->rs;
			$this->b['sc'] = 200;
			
		}
		
		private function get_exam_data_list($year , $section , $subject , $province){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			
			$tblExam = array(
				'exam_examination',
				'id' , 'name' 
			);
			
			$tblGrade = array(
				'edu_grade'
			);
			
			$tblCondition = array(
				'exam_examination.grade_id=edu_grade.id'
			);
			
			$where = 'exam_examination.exam_type=1 AND year="'.$year.'" AND edu_grade.class_section_id='.$section.' AND subject_id='.$subject.' AND province_id='.$province;
			$tblCondition['where'] = $where;
			
			$this->b = $this->db->withQueryMakerLeft($tblExam , $tblGrade , $tblCondition);
//			echo $this->db->sql;
			$this->b['sc'] = 200;
			
		}
		
		private function get_unit_list($subject , $grade , $publisher){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			
			$sql = <<<SQL

				SELECT 
					DISTINCT edu_chapter.unit 
				FROM 
					edu_chapter 
				LEFT JOIN edu_books ON edu_chapter.bid=edu_books.id 
				WHERE edu_books.grade_id=$grade AND edu_books.publisher_id=$publisher AND edu_books.subject_id=$subject 
				ORDER BY unit ASC
SQL;
			
			$this->db->sql = $sql;
			$this->db->Query();
			
			$this->b = $this->db->rs;
			
			foreach($this->b as $k => $v){
				$this->b[$k]['id'] = $k;
			}
			
			$this->b['sc'] = 200;
			
		}

		private function get_chapter_list($bookId){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			$subjectId = $this->r('subject_id');
			$eduInfo = $this->get_edu_info($subjectId);
//			$sqlUnit = 'select * from edu_unit where bid='.$bookId.' order by unit_index asc';
			$sqlUnit = 'select * from '.$eduInfo['edu_unit'].' where book_id='.$bookId.' order by unit_index asc';
			$this->db->sql = $sqlUnit;
			$this->db->Query();
			$rsUnit = $this->db->rs;
			foreach ($rsUnit as $key=>$value){
//				$sqlChapter ='select id,chaper as chapter,chaper_order as chapter_order,unit_id from edu_chapter where unit_id='.$value['id'].';';
				$sqlChapter ='select id,chapter_name as chapter,unit_id from '.$eduInfo['edu_chapter'].' where unit_id='.$value['id'].';';
				$this->db->sql =$sqlChapter;
				$this->db->Query();
				$rs = $this->db->rs;
				$rsUnit[$key]['chapter'] = $rs;
			}
//			print_r($rsUnit);
//			$this->db->rs;
			$this->b['list'] = $rsUnit;
			$this->b['sc'] = 200;
			
		}
	
		private function post_create_relation($knowledge_id , $question_ids){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			
			$questionArray = explode('_' , $question_ids);
			$insertArray = array();
			
			foreach($questionArray as $v){
				$insertArray[] = array('knowledge_id'=>$knowledge_id , 'question_id'=>$v);
			}
			
			$flag = $this->db->Inserts('exam_question_to_knowledge' , $insertArray);
			
			$this->b['flag'] = $flag;
			$this->b['sc'] = 200;
			
		}
		
		
	
		
		private function get_zhuanti_list($sectionId , $subject_id){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			$eduInfo = $this->get_edu_info($subject_id);
			$eduZhuanti = $eduInfo['edu_zhuanti'];
			$tblZhuanti = array(
				$eduZhuanti,
				'id' , 'name' , 'subject_id' , 'grade_id' , 'knowledge_list','level','parent_id','sort_id','section_id','knowledge_id','version_id'
			);
			
			$tblGrade = array(
				'edu_grade' 
			);
			
			$condition = array(
				$eduZhuanti.'.grade_id=edu_grade.id',
			);
			
			$where = '';
			if($sectionId){
				$where = $eduZhuanti.'.section_id='.$sectionId;
			}
			
			if($subject_id){
				if($where != ''){
					$where .= ' AND ';
				}
				$where .= $eduZhuanti.'.subject_id='.$subject_id;
			}
			
			if($where != ''){
				$condition['where'] = $where;
			}
			
			$this->db->sql =<<<SQL
				select level from $eduZhuanti order by level desc limit 1;
SQL;
			
			$this->db->Queryone();
			
			$levleRs = $this->db->rs;
			$this->b['max_level'] = $levleRs['level'];

			$this->b['list'] = $this->db->withQueryMaker($tblZhuanti , $tblGrade , $condition);
			$this->b['sql'] =  $this->db->sql; 
			$this->b['sc'] = 200;
		}
		
		
		
	}
	?>