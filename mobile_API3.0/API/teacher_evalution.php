<?php
///////////////////////////////////////////////////////
// 教师数量接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");

	
	
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				$this -> getCount();
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
		
		
		public function getCount(){
			$evalution["school"]=0;
			$evalution["master"]=0;
			$evalution["class"]=0;
			$evalution["teacher"]=0;
			$evalution["student"]=0;
			$evalution["exam"]=0;
					
			if($this->vr['usr_type']==2 and $this -> vr['level']==2){//教学主任
				$this -> db -> sql = "select evalution  from usr_teacher where uid='".$this->vr['id']."'";
				$this -> db -> Queryone();
				$this -> b['evalution'] = $this -> db -> rs["evalution"];
			}
			if($this->vr['usr_type']==2 and $this -> vr['level']==1){ //校长
				$this -> db -> sql = "select evalution  from usr_teacher where uid='".$this->vr['id']."'";
				$this -> db -> Queryone();
				$this -> b['evalution'] = $this -> db -> rs["evalution"];
			}
			if($this->vr['usr_type']==2 and $this -> vr['level']==4){
				$this -> db -> sql = "select evalution  from usr_teacher where uid='".$this->vr['id']."'";
				$this -> db -> Queryone();
				$this -> b['evalution'] = $this -> db -> rs["evalution"];
			}
			
			
			if($this->vr['usr_type']==2 and $this -> vr['level']==1){ //校长
			    $this -> db -> sql = "select *  from edu_school where uplevel_id='".$this->vr['school_id']."'";
				$this -> db -> Query();
				$myrs=$this -> db -> rs;
			    $evalution["school"]=count($myrs);
				$schoolids="";
				foreach($myrs as $v){
					$schoolids.=$v["id"].",";
				}
				$schoolids = substr($schoolids,0,-1);
				$schoolids="(".$schoolids.")";
				
				
				$this -> db -> sql = "select count(*) as count1 from usr_teacher where level=2 and school_id in " .$schoolids;
				$this -> db -> Queryone();
				$evalution["master"] = $this -> db -> rs["count1"];
				
				$this -> db -> sql = "select count(*) as count1 from usr_teacher where level=4 and school_id in " .$schoolids;
				$this -> db -> Queryone();
				$evalution["teacher"] = $this -> db -> rs["count1"];
				
				$this -> db -> sql = "select * from edu_class where school_id in " .$schoolids;
				$this -> db -> Query();
				$myrs=$this -> db -> rs;
				$evalution["class"] =count($myrs); 
				
				$classids="";
				foreach($myrs as $v){
					$classids.=$v["id"].",";
				}
				$classids = substr($classids,0,-1);
				$classids="(".$classids.")";
				
				$this -> db -> sql = "select count(distinct uid)  as count1 from usr_class where  relationship=1 and  class_Id  in " .$classids;
				$this -> db -> Queryone();
				$evalution["student"] = $this -> db -> rs["count1"];					
			}
			
			
			if($this->vr['usr_type']==2 and $this -> vr['level']==2){//教学主任
			    
				$this -> db -> sql = "select *  from edu_school where id='".$this->vr['school_id']."'";
				$this -> db -> Query();
				$myrs=$this -> db -> rs;
			    $evalution["school"]=count($myrs);
				$schoolids="";
				foreach($myrs as $v){
					$schoolids.=$v["id"].",";
				}
				$schoolids = substr($schoolids,0,-1);
				$schoolids="(".$schoolids.")";
				
				$this -> db -> sql = "select count(*) as count1 from usr_teacher where level=2 and school_id in " .$schoolids;
				$this -> db -> Queryone();
				$evalution["master"] = $this -> db -> rs["count1"];
				
				$this -> db -> sql = "select count(*) as count1 from usr_teacher where level=4 and school_id in " .$schoolids;
				$this -> db -> Queryone();
				$evalution["teacher"] = $this -> db -> rs["count1"];
				
				$this -> db -> sql = "select * from edu_class where school_id in " .$schoolids;
				$this -> db -> Query();
				$myrs=$this -> db -> rs;
				$evalution["class"] =count($myrs); 
				
				$classids="";
				foreach($myrs as $v){
					$classids.=$v["id"].",";
				}
				$classids = substr($classids,0,-1);
				$classids="(".$classids.")";
				
				$this -> db -> sql = "select count(distinct uid)  as count1 from usr_class where  relationship=1 and  class_Id  in " .$classids;
				$this -> db -> Queryone();
				$evalution["student"] = $this -> db -> rs["count1"];	
			}
			
			if($this->vr['usr_type']==2 and $this -> vr['level']==4){
				$this -> db -> sql = "select * from  usr_class  where  relationship=2 and uid='".$this->vr['id']."'";
				$this -> db -> Query();
				$myrs=$this -> db -> rs;
				$evalution["class"] =count($myrs); 
				$classids="";
				foreach($myrs as $v){
					$classids.=$v["class_Id"].",";
				}
				$classids = substr($classids,0,-1);
				$classids="(".$classids.")";
					
				$this -> db -> sql = "select count(distinct uid)  as count1 from usr_class where  relationship=1 and  class_Id  in " .$classids;
				$this -> db -> Queryone();
				$evalution["student"] = $this -> db -> rs["count1"];
				
				$this -> db -> sql = "select count(*)  as count1 from exam_exercise where creator_id='".$this->vr['id']."'";
				$this -> db -> Queryone();
				$evalution["exam"] = $this -> db -> rs["count1"];
			}		
			
			$this -> b['evalution']=$evalution;
			$this -> b["sc"] = 200;
			return;
		}

		
	}
	


?>