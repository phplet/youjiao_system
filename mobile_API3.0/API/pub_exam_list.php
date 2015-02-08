<?php
///////////////////////////////////////////////////////
// 公共试卷列表接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			if($this -> urlarr[3]=="list"){
				$this -> getExam();
			}
			elseif ($this -> urlarr[3]=="province_list")
			{
				$this -> getProvince_list();
			}
			else{
				$this -> b["sc"] = 405; 
			}
			
		}
		 private function getExam(){
		 	$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			if($this -> vr['pass']){
				 //处理地区输入
				if( (is_numeric($_REQUEST['area']) and (int)$this -> r('area')==0) or !isset($_REQUEST['area']) ){
					$area = "";
				}
				else{
//					$area = ' and name like BINARY "%'.$this -> r('area').'%" ';
					$area = ' and province_id='.$this -> r('area').'';
				}
				//处理年份输入
				if( (int)$this -> r('years')==0 or !isset($_REQUEST['years']) ){
					$year  = '';
				}
				else{
					$year  = ' and year like BINARY  "%'.$this -> r('years').'%"';
				}
				
				if (isset($_REQUEST['searchtext']))
				{
					$searchtext=$this->r('searchtext');
					$searchtext=" and name like '%" .$searchtext . "%'" ;
				}
				else
				{
					$searchtext="";	
				}
				
				
//				//处理年级输入
//				$grade = (int)$this-> r('grade_id');
//				if($grade==0){
//					$grade = " grade_id!=0";
//				}
//				else{
//					$grade = " grade_id=".$grade;
//				} 
				
				//处理年级输入
				$sectionId = (int)$this-> r('section_id');
				if($sectionId==0){
					$sectionId = " section_id!=0";
				}
				else{
					$sectionId = " section_id=".$sectionId;
				} 
				
				//处理试卷类型
				$exam_type = (int)$this -> r('exam_type');
				if($exam_type==1)
				{
					$type = " and exam_type=1";
				}
				else if($exam_type==999){
					$type = " and exam_type!=1";
				}
				//学科处理
				if((int)$this -> r('subject_id')==0){
					$subject = "";				
				}
				else{
					$subject = " and subject_id=".$this -> r('subject_id');
				}
				$eduInfo = $this->get_edu_info($this->r('subject_id'));
				$examExamination2question = $eduInfo['exam_examination2question'];
				$examExamination = $eduInfo['exam_examination'];
				//处理分页
				$this -> page = explode(",",$this -> urlarr[4]);
				
				mysql_query( 'set names utf8');
				$this -> db -> sql = "select id,name,subject_id,year from $examExamination where $sectionId $area $year $type $subject $searchtext order by year desc limit ".$this -> page[0].",".$this -> page[1];
				$this -> db -> Query();
				$this->b['sql'] = $this->db->sql;
				$this -> b['param'] = $_REQUEST['area'];
				$this -> b['exam_list'] = $this -> db -> rs;
				$this -> b["sc"] = 200; 
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
		
		
		 private function getProvince_list(){
			if($this -> vr['pass']){

				//处理年份输入
				if( (int)$this -> r('years')==0 or !isset($_REQUEST['years']) ){
					$year  = '';
				}
				else{
					$year  = ' and year like "%'.$this -> r('years').'%"';
				}
				
				
				//处理年级输入
				$grade = (int)$this-> r('grade_id');
				if($grade==0){
					$grade = " grade_id!=0";
				}
				else{
					$grade = " grade_id=".$grade;
				} 
				//处理试卷类型
				$exam_type = (int)$this -> r('exam_type');
				if($exam_type==1)
				{
					$type = " and exam_type=1";
				}
				else if($exam_type==999){
					$type = " and exam_type!=1";
				}
				//学科处理
				if((int)$this -> r('subject_id')==0){
					$subject = "";				
				}
				else{
					$subject = " and subject_id=".$this -> r('subject_id');
				}
				
				
				$this -> db -> sql = "select distinct t1.subject_id,t1.year,t1.province_id,t2.Name as province_name from exam_examination t1  JOIN area_province t2  on  t1.province_id=t2.id  where $grade $year $type $subject   order by  year desc  ";
				$this -> db -> Query();
				//$this -> b['param'] = $_REQUEST['area'];
				$this -> b['sql'] = $this -> db -> sql;
				$this -> b['province_list'] = $this -> db -> rs;
				$this -> b["sc"] = 200; 
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
		
	}
	


?>