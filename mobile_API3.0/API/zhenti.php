<?php
///////////////////////////////////////////////////////
// 专题接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑

		public function doGET(){
			if($this -> vr['pass']){
				if($this -> urlarr[3]=="year"){
					$this -> getYear();
				}

				if($this -> urlarr[3]=="provinces"){
					$this -> getProvinces();
				}
				
				if($this -> urlarr[3]=="list"){
					 $this -> page = explode(",",$this -> urlarr[4]);

					if($this -> page==null or !is_numeric($this -> page[0]) or !is_numeric($this -> page[1])){
						$this -> b["sc"] = 403;
						return;
					}

					$this -> getZhentiExamList();
				}
			}
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
		
		//获取真题的年份列表
		public function getYear()
		{
			$limit=$this -> urlarr[4];   //取多少条记录
			$gradeid=$this -> r('gradeid'); //年级
			$subjectid=$this -> r('subjectid');//科目
			$swhere=" where year like '%年%' and  grade_id='".$gradeid."' and subject_id='" .$subjectid ."' ";
			$sql="  select  distinct  year  from exam_examination ";
			$this -> db -> sql = $sql.$swhere ."  order by year DESC   limit ".$limit;
			//$this -> db -> sql = "select  distinct  year  from exam_examination  where   order by year DESC  limit ".$limit;
			$this -> db -> Query();
			$this -> b['zhenti'] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		
				//获取真题的年份列表
		public function getProvinces()
		{
			$limit=$this -> urlarr[4];   //取多少条记录
			$gradeid=$this -> r('gradeid'); //年级
			$subjectid=$this -> r('subjectid');//科目
			$year=$this -> r('year');
			
			$swhere=" where t1.province_id=t2.id and  grade_id='".$gradeid."' and subject_id='" .$subjectid ."' and  year='"   . $year. "' ";
			$sql=" select  distinct province_id, t2.`name`  from exam_examination t1, area_province t2  ";
			$this -> db -> sql = $sql.$swhere ."  order by province_id  limit ".$limit;
			$this -> db -> Query();
			$this -> b['zhenti'] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		
		
		private function getZhentiExamList(){
			$sProvinceIDs="";	
			$year=$this -> r('year');
			$subject_id=$_REQUEST['subject_id'];
			$grade_id=$_REQUEST['grade_id'];
			$Provinces_ID=$_REQUEST['provinces_id'];
			$arr1 = explode(",",$Provinces_ID);
			for($i=0;$i<count($arr1);$i++){
				$sProvinceIDs .= "'".$arr1[$i]."',";
			}
			$sProvinceIDs = substr($sProvinceIDs,0,-1);
			
			
			$sql="select t1.province_id, t2.Name  as province_name,t1.name as zhenti_name,t1.id as zhentiexam_id from exam_examination t1,area_province t2  
				where t1.province_id=t2.id  and  t1.province_id  in (".$sProvinceIDs.") and t1.grade_id=".$grade_id."  and t1.subject_id=".$subject_id." and  year='"   . $year. "'  order by t1.province_id 
				limit ".$this -> page[0].",".$this -> page[1];
			$this -> db -> sql = $sql;
			$arr=$this -> db ->rs;
			
			$arrzhenti=array();
			$provincename="";
			foreach($arr as $v){
				$provincename=$v["province_name"];
				$arrzhenti[$provincename]["zhenti_name"]=$v["zhenti_name"];
			}

			$this -> db -> Query();
			$this -> b['zhenti'] =$this -> db ->rs;
			$this -> b["sc"] = 200;
		}
		

		
	}
	


?>