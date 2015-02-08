<?php
///////////////////////////////////////////////////////
// 学校接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				if($this -> urlarr[3]=="school_id"){
					$this -> db -> sql = 'select edu_school.id as school_id,edu_school.name,edu_school.creat_date,usr_user.id as teacher_id,usr_user.realname,usr_teacher.mobile from (edu_school JOIN (usr_teacher JOIN usr_user ON usr_teacher.uid = usr_user.id) ON usr_teacher.school_id = edu_school.id and usr_teacher.level=2) where edu_school.id='.$this -> v($this -> urlarr[4]);
					$this -> db -> Queryone();
					$this -> b['school'] = $this -> db -> rs;
					$this -> b["sc"] = 200;
				}
				else if($this -> urlarr[3]=="list" and $this -> urlarr[5]=="uplevel_id"){
					$this -> db -> sql = "select id as school_id,name,creat_date from edu_school where uplevel_id=".$this -> v($this -> urlarr[6]);
					$this -> db -> Query();
					$this -> b['school']['info'] = $this -> db -> rs;
					$this -> b['school']['total'] = count($this -> db -> rs);
					
					if ($this -> db -> rs==null)
					{ $this -> b["sc"] = 200;return;}
					
					$id = "";
					foreach($this -> db -> rs as $v){
						$id .= $v['school_id'].",";
					}
					$id = substr($id,0,-1);
					
					if ($this -> v($this -> urlarr[6])==0)
					{
						$this -> db -> sql = "select usr_teacher.school_id,usr_user.id as teacher_id,usr_user.realname,usr_teacher.mobile from (usr_teacher JOIN usr_user ON usr_teacher.uid = usr_user.id) where usr_teacher.school_id in (".$id.") and usr_teacher.level=1";						
					}
					else
					{
						$this -> db -> sql = "select usr_teacher.school_id,usr_user.id as teacher_id,usr_user.realname,usr_teacher.mobile from (usr_teacher JOIN usr_user ON usr_teacher.uid = usr_user.id) where usr_teacher.school_id in (".$id.") and usr_teacher.level=2";
					}
					$this -> db -> Query();
					
					$this -> b['teacher'] =$this -> db -> rs;
					$this -> b["sc"] = 200;
					
					/* $this -> db -> sql = 'select edu_school.id as shool_id,edu_school.name,edu_school.creat_date,usr_user.id as teacher_id,usr_user.realname,usr_teacher.mobile from (edu_school JOIN (usr_teacher JOIN usr_user ON usr_teacher.uid = usr_user.id) ON usr_teacher.school_id = edu_school.uplevel_id and usr_teacher.level=2) where edu_school.uplevel_id='.$this -> v($this -> urlarr[5]);
					//$this -> db -> sql = 'select id,name,creat_date from edu_school where uplevel_id='.$this -> v($this -> urlarr[5]);
					$this -> db -> Query();
					$this -> b['school']['info'] = $this -> db -> rs;
					$this -> b['school']['total'] = count($this -> db -> rs);
					$this -> b["sc"] = 200; */
				}
				else if($this -> urlarr[3]=="list" and $this -> urlarr[5]=="name"){
					if($this -> vr['usr_type']==2 and $this -> vr['level']==1){
					$this -> db -> sql = 'select edu_school.id as school_id,edu_school.name,edu_school.creat_date,usr_user.id as teacher_id,usr_user.realname,usr_teacher.mobile from (edu_school JOIN (usr_teacher JOIN usr_user ON usr_teacher.uid = usr_user.id) ON usr_teacher.school_id = edu_school.id ) where usr_teacher.level=2 and edu_school.uplevel_id='.$this -> vr['school_id']." and (edu_school.name like '%".$this -> r('key')."%' or usr_user.realname like '%".$this -> r('key')."%')";
					$this -> db -> Query();
					$this -> b['school']['info'] = $this -> db -> rs;
					$tarr = null;
					foreach($this -> db -> rs as $v){
						$arr1 = null;
						$arr1['realname'] = $v['realname'];
						$arr1['mobile'] = $v['mobile'];						
						$arr1['teacher_id'] = $v['teacher_id'];						
						$arr1['school_id'] = $v['school_id'];						
						$tarr[]= $arr1;
					}
					$this -> b['teacher'] = $tarr;
					$this -> b['school']['total'] = count($this -> db -> rs);
					}
				}
				else if($this -> urlarr[3]=="count"){
					if($this -> vr['usr_type']==2 and $this -> vr['level']==1){
						$this -> db -> sql = 'select count(*) as total from edu_school where uplevel_id='.$this -> vr['school_id'];
						$this -> db -> Queryone();
						$this -> b['school'] = $this -> db -> rs;
						$this -> b["sc"] = 200;
					}
					else{
						$this -> b["sc"] = 403;
					}
					
				}
				else{
					$this -> b["sc"] = 404;
				}
				
				
			}
		}
	
		//POST逻辑
		public function doPOST(){
			if($this -> vr['pass'] && ($this -> vr['level']==1|| $this -> vr['level']==9 )){
				//需校长权限
				$this -> insertschool();
				
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
	
		//PUT逻辑
		public function doPUT(){

			if($this -> vr['pass'] && ( $this -> vr['level']==1 || $this -> vr['level']==9)){
				//需校长权限   系统管理员
				if(isset($_REQUEST['username'])){
					$this -> db -> sql = "select id from usr_user where username='".$this -> r('username')."' and usr_type=2";
					$this -> db -> Queryone();
					$id = $this -> db -> rs['id'];
					
					
					$arr['level'] = 2;
					$arr['school_id'] = (int)$this -> r('school_id');
					$this -> db -> Update('usr_teacher',$arr,"uid=".$id);
					$arr2['level'] = 4;
					$this -> db -> Update('usr_teacher',$arr2,"uid=".$this -> r('teacher_id'));
				}
				
				if(isset($_REQUEST['school_name'])){  //更改学校名,名字必须唯一
					
					$this -> db -> sql = 'select count(id) as ids from edu_school where name="'.$this -> r('school_name').'"';
					$this -> db -> Queryone();
					if($this -> db -> rs["ids"]>0){
						$this -> b["sc"] = 410;
						return;
					}
					
					$arr3['name'] = $this -> r('school_name');
					$this -> db -> Update('edu_school',$arr3,"id=".$this -> r('school_id'));
				}
				
				$this -> b["sc"] = 200;
			}
			
		}
	
		//DELETE逻辑
		public function doDELETE(){
			if($this -> vr['pass'] && $this -> vr['level']==1){
				//需校长权限
				$this -> deleteSchool();

			}
			
		}
		private function deleteSchool(){
			//如果学校下学校级不能删除
          
			$this -> db -> sql = 'select count(id) as ids from edu_school where uplevel_id='.$this -> r('id');

			$this -> db -> Queryone();
			if($this -> db -> rs["ids"]>0){
				$this -> b["sc"] = 410;
				return;
			}
			
			//如果学校下有班级不能删除
			$this -> db -> sql = "select count(id) as ids from edu_class where school_id='".$this -> r('id')."'";
			$this -> db -> Queryone();
			if($this -> db -> rs["ids"]>0){
			    $this -> b["sc"] = 410;
				return;
			}
			
			
			$this -> db -> sql = 'delete from edu_school where id='.$this -> r("id")." and uplevel_id=".$this -> vr['school_id'];
			$this -> db -> ExecuteSql();
			
			//删除校区的同时,把学校的主任教师/xiaozhang还原为普通教师
			//$this -> db -> sql = "select uid from usr_teacher where school_id IN (select id from edu_school where uplevel_id=".$this -> vr['school_id'].")";
			$this -> db -> sql = "select uid from usr_teacher where school_id=".$this -> r("id")." and (level=2 or level=1)";
			$this -> db -> Query();
			$uid="";
			foreach($this -> db -> rs as $v){
				$uid .= $v['uid'].",";
			}
			$uid = substr($uid,0,-1);
			$arr['level'] = 4;
			$arr['school_id'] = 0;
			$this -> db -> Update('usr_teacher',$arr,"uid IN (".$uid.")");
			
		   //校长修改统计数据   校区数-1,master-1
		   	$this-> db ->UpdateEvalution("usr_teacher","school","sub"," uid='".$this -> vr['id']."'");		
			$this-> db ->UpdateEvalution("usr_teacher","master","sub"," uid='".$this -> vr['id']."'");			
		   
		   
		   //中心更新校区统计数据   school-1,master-1
		    $this-> db ->UpdateEvalution("edu_school","school","sub"," id='".$this -> vr['school_id']."'");		
			$this-> db ->UpdateEvalution("edu_school","master","sub"," id='".$this -> vr['school_id']."'");	
			
			
		    $this -> b["sc"] = 200;
		}
		
		public function insertschool(){
			$this -> db -> sql = 'select id from usr_user where username="'.$this -> r("user").'" and usr_type=2';
			$this -> db -> Queryone();

			if(strlen($this -> db -> rs["id"])==0){
				$this -> b["sc"] = 409;
				return;
			}
			$uid=$this -> db -> rs["id"];
		   

			
		    $this -> db -> sql = 'select count(id) as ids from edu_school where name="'.$this -> r('name').'"';
			$this -> db -> Queryone();
			if($this -> db -> rs["ids"]>0){
				$this -> b["sc"] = 410;
				return;
			}

		   $this -> db -> sql = "select count(id) as ids  from usr_teacher where uid='".$uid."' and school_id<>0";
		   $this -> db -> Queryone();
			if($this -> db -> rs["ids"]>0){
				$this -> b["sc"] = 415;
				return;
			}
		   
		   //校长增加统计数据   校区数加一,master+1
		    $this-> db ->UpdateEvalution("usr_teacher","school","add"," uid='".$this -> vr['id']."'");		
			$this-> db ->UpdateEvalution("usr_teacher","master","add"," uid='".$this -> vr['id']."'");	
			
			
			$arr['name'] = $this -> r('name');
			$arr['creator'] = (int)$this -> vr['id'];
			$arr['creat_date'] = 'current_timestamp()';
			if(!isset($_REQUEST['sch_type'])){
				$arr['sch_type'] = 2;
			}
			else{
				$arr['sch_type'] = $this -> r('sch_type');
			}
			
			$evalution=null;
			if(!isset($_REQUEST['sch_level'])){
				$arr['sch_level'] = 2;
			}
			else{
				$arr['sch_level'] = $this -> r('sch_level');
			}
			
			$arr['uplevel_id'] = (int)$this -> vr['school_id'];
			$evalution["master"]=1;
			$arr['evalution']=json_encode($evalution);
			$this -> db -> Insert('edu_school',$arr);
			$this -> b["newid"] = $this -> db -> Last_id();
					
			
		   //中心增加校区统计数据   school+1,master+1
		   	$this-> db ->UpdateEvalution("edu_school","school","add"," id='".$arr['uplevel_id']."'");		
			$this-> db ->UpdateEvalution("edu_school","master","add"," id='".$arr['uplevel_id']."'");			
			
			$evalution=null;
			$evalution["calss"]=0;
			$evalution["teacher"]=0;
			$evalution["student"]=0;
			$arr2['level'] = 2;
			$arr2['school_id'] = (int)$this -> b["newid"];
            $arr2['evalution']=json_encode($evalution);
			$this -> db -> Update('usr_teacher',$arr2,"uid=".$uid);
			$this -> b["sc"] = 201;
		}
	}
?>