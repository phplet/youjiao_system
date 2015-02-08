<?php
///////////////////////////////////////////////////////
// 做题记录接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				if($this -> urlarr[3]=="count"){
					//获取好题本错题本数量
					$this -> countHistory();					
				}
				else if($this -> urlarr[3]=="list"){
					$this -> getList();
				}	
			}
		}
	
		//POST逻辑
		public function doPOST(){
			//$this -> b["sc"] = 405;
			if($this -> vr['pass']){
				if($this -> urlarr[3]=="updateInsight"){
					$this -> update_insight();
				}
				//history/offline_collect_ti
				if($this->urlarr[3]=="offline_collect_ti"){
					$userId = $this->vr['id'];
					$content =  json_decode($this->r('content'),true);
					$gradeId = $content['grade'];
					if(count($content['content'])>0){
						foreach ($content['content'] as $key=>$value){
							$tiId = $value['ti_id'];
							$subjectId = $value['subjectid'];
							$bookCode = $value['bookcode'];
							$dbtype = $value['dbtype'];
							$this->db->sql = <<<SQL
																select count(*) as num from study_collection where user_id='$userId' and subject_id ='$subjectId' and question_id='$tiId' and flag='$bookCode' and dbtype='$dbtype';
SQL;
							$this->db->Queryone();
							$rs = $this->db->rs;
							if($rs['num']){
								$this->db->sql = <<<SQL
																update study_collection set add_time=current_timestamp() where subject_id ='$subjectId' and user_id='$userId' and question_id='$tiId' and flag='$bookCode' and dbtype='$dbtype';
SQL;
							}else{
								$this->db->sql = <<<SQL
																insert into study_collection (add_time,user_id,question_id,grade_id,flag,dbtype,subject_id) values (current_timestamp(),'$userId','$tiId','$gradeId','$bookCode','$dbtype','$subjectId') ;
SQL;
							}
							$this->b['sql'][$key] = $this->db->sql;
							$this->db->ExecuteSql();
							
						}
					}
					$this->b['flag'] = true;
					$this->b['sc'] = 200;
				}if($this->urlarr[3]=="remove_collection"){
					$this->deleteCollection();
				}
			}
		}
	
		//PUT逻辑
		public function doPUT(){
			if($this -> vr['pass']){
				$statHandler = new stat_handler();
				$this -> ifhasrecord1();
				$has1 = $this ->db -> rs["id"];
				
				/**
					增加统计信息
				 */
				$data['user_id']= $this->vr['id'];
				$data['count']= 1;
				$data['flag']= $this->r('bookcode');
				$data['dbtype']= $this->r('dbtype');
				$data['ti_id']= $this->r('ti_id');
				
				$statHandler->stat_exercise_ti($data);
				
				if($has1){
				//历史表中有记录 则更新历史表 更新同步记录表
					
					if($this -> r('force')==2){
						$hisid = $this ->db -> rs["id"];
						$this -> upinfo1($hisid);
						$this -> b["sc"] = 200;
					}
					else{
						//非强制更新
						if($this -> db -> rs["flag"] == $this ->r('bookcode')){
							$this -> b["sc"] = 202;
						}
						else{
							$this -> b["sc"] = 403;
						}
						$this -> b["flag"] = $this -> db -> rs["flag"];
						
					}
				
				}
				else{
				//历史表中没有记录 则插入历史表 再更新同步记录表
					$this -> insert1();
						$this -> b["sql2"] =  $this ->db -> sql;
						//$this -> b["sc"] =403;
						//return;
					$hisid = mysql_insert_id();
					$this -> b["sc"] = 201;
				}
				//////////////////////////////////////////////////同步表中是否有记录
				

				if($this -> b["sc"] == 200 or $this -> b["sc"] == 201){
				
					$has2 = $this -> ifhasrecord2($hisid);
				
					if($has2){
					//有同步记录则更新
				
						$syncid = $this ->db -> rs["id"];
						$this -> upinfo2($syncid);
						//$this -> b["sql"] =  $this ->db -> sql;
					}//无同步记录则插入
					else{
						$this -> insert2($hisid);
						//$this -> b["sql2"] =  $this ->db -> sql;
					}
				    
				}
			}
		}
		
		//DELETE逻辑
		public function doDELETE(){
			if($this -> vr['pass']){
				$get = explode(";",$this -> r('ti_id'));
				$str = "(";
				for($i=0;$i<count($get);$i++){
				$str .= "'".$get[$i]."',";
				}
				$str = substr($str,0,-1).")";
				$this -> deletehis($str);
				$this->b['sql1'] = $this->db->sql;
				$this -> upinfo($str);
				$this->b['sql2'] = $this->db->sql;
			}
			
		}
		
		//删除历史表数据
		public function deletehis($str){			
			$this -> db -> sql = "delete from study_collection where user_id=".$this -> vr['id']." and question_id IN ".$str;
			$this -> db -> ExecuteSql();
	
		}
		
			//删除用户好题、错题数据
		public function deleteCollection(){	
			$gradeId = $this->r('grade_id');		
			$subjectId = $this->r('subject_id');		
			$this -> db -> sql = "delete from study_collection where user_id=".$this -> vr['id']." and grade_id = ".$gradeId.' and subject_id='.$subjectId;
			$this->b['sql'] = $this->db->sql;
			$this -> db -> ExecuteSql();
			$this->b['sc'] = 200;
	
		}
		//更新同步表数据
		public function upinfo($str){
			$arr['sync_time'] = 'current_timestamp()';
			$arr['delete_flag'] = 1;
			$this -> db -> Update('common_sync',$arr,"user_id=".$this -> vr['id']." and pid IN ".$str);
	
		}
		
		//是否有历史表记录
		private function ifhasrecord1(){
			$this -> db -> sql = "select id,flag from study_collection where user_id=".$this -> vr['id']." and question_id='".$this -> r('ti_id')."'"." and flag='".$this -> r('bookcode')."'";
			$this -> db -> Queryone();
		}
		//是否有同步表记录
		private function ifhasrecord2($id){
			return $this -> db -> Queryif('common_sync',"uid=".$this -> vr['id']." and table_name='study_collection' and pid=".$id);	
		}
		//插入历史表数据
		public function insert1(){
			$this -> db -> sql = "insert into study_collection (flag,user_id,add_time,question_id,subject_id,dbtype,grade_id) values(".$this -> r('bookcode').",'".$this -> vr['id']."',current_timestamp(),'".$this -> r('ti_id')."','".$this -> r('subjectid')."','".$this ->r('dbtype')."','".$this->r('grade')."')";
			
			$this -> db -> ExecuteSql();
	
		}
		//插入同步表数据
		public function insert2($hisid){
			$this -> db -> sql = "insert into common_sync (pid,table_name,sync_time,delete_flag,source_id,uid) values(".$hisid.",'study_collection',current_timestamp(),0,'".strtotime("now").$this->randStr(118)."',".$this -> vr['id'].")";
			$this -> db -> ExecuteSql();
	
		}
		//更新历史表数据
		public function upinfo1($hisid){
			$this -> db -> sql = 'update study_collection set flag='.$this -> r('bookcode').',add_time=current_timestamp() where id='.$hisid;
			$this -> db -> ExecuteSql();
	
		}
		//更新同步表数据
		public function upinfo2($syncid){
		
			$this -> db -> sql = 'update common_sync set sync_time='.strtotime("now").',delete_flag=0 where id='.$syncid;
			$this -> db -> ExecuteSql();
	
		}
		
		//获取题本数量
		public function countHistory(){
		//2好题 1错题
			$this -> b['goodbooknumber'] = 0;
			$this -> b['errorbooknumber'] = 0;
			$this -> db -> sql = "select count(id) as num,flag from study_collection where user_id=".$this -> vr['id']." group by flag";
			$this -> db -> Query();
			if($this -> db -> rs!=null){
				foreach($this -> db -> rs as $v){
					if($v['flag']==2){
						$this -> b['goodbooknumber'] = $v['num'];
					}
					else if($v['flag']==1){
						$this -> b['errorbooknumber'] = $v['num'];
					}
				}
				
			}
			
			$this -> b["sc"] = 200;
		}
		
		//获取记录列表
		public function getList(){
			$exerciseHandler = new exercise_handler();
			//分页处理
			//类型处理
			if(isset($_REQUEST['history_type'])){
				$type = " and flag=".$this -> r('history_type');
			}
			else{
				$type = "";
			}
			if(isset($_REQUEST['subject_id'])){
				$ss = " and subject_id='".$this -> r('subject_id')."'";
			}
			else{
				$ss = "";
			}
			
		  if(isset($_REQUEST['ti_id'])){
				$tid = " and question_id='".$this -> r('ti_id') ."'";
			}
			else{
				$tid = "";
			}
			
			$userId = $this -> vr["id"];
			
			$this -> page = explode(",",$this -> urlarr[4]);
//			$this -> db -> sql = "select t1.flag,t1.subject_id,t1.my_insight,t1.add_time,t1.question_id,t2.content,t2.image 
//			 from study_collection  t1  join exam_question  t2 on t1.question_id=t2.id where user_id=".$this -> vr['id']." $type $ss  $tid ".
//			 " order by t1.add_time desc"; 
//	 		echo $this -> db -> sql;

			// $sql = 'select flag,subject_id,my_insight,add_time,question_id,dbtype from study_collection where user_id='.$this -> vr["id"].$type.$ss.$tid . " order by add_time desc"; 
			 //limit ".$this -> page[0].",".$this -> page[1];
			 $sql = 'select flag,subject_id,grade_id,my_insight,add_time,question_id,dbtype from study_collection where user_id='.$this -> vr["id"].$type.$ss.$tid . " order by add_time desc  limit ".$this -> page[0].",".$this -> page[1]; 
			$this->db->sql = $sql;
			$this -> db -> Query();
			$collectionRs = $this->db->rs;
			
			
			$exerciseTiRs = $exerciseHandler->get_ti_user_count($userId);
			$codition = array();
			foreach ($collectionRs as $key=>$value){
				$codition[$key]['subject_id'] = $value['subject_id'];
				$codition[$key]['dbtype'] = $value['dbtype'];
			
	$codition[$key]['question_id'] = $value['question_id'];
$collectionRs[$key]['ti_count'] = 1;
			}
			
			
			foreach ($collectionRs as $key=>$value){
				foreach ($exerciseTiRs as $k=>$v){
					if($value['question_id']==$v['ti_id']&&$value['dbtype']==$v['dbtype']){
						$collectionRs[$key]['ti_count'] = $v['count'];
						$collectionRs[$key]['ti_flag'] = $v['flag'];
					}else{
						$collectionRs[$key]['ti_count'] = 1;
					}
				}
			}
			
			$questionRs = array();
			foreach ($codition as $key=>$value){
				$tblEaxm = $this->get_examination_tbl($value['subject_id']);
				$tblEaxmIndex = $tblEaxm.'_index';
				if($value['dbtype']==1&&$value['question_id']){
					$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
				}else if($value['dbtype']==2&&$value['question_id']){
						$dbJson = $this->query_curriculumndb();
						if($dbJson){
						$db = json_decode($dbJson,true);
//						print_r($db);
						$this->switchDB($db['ip'],$db['name']);
					}
				}
				$this -> db -> sql =<<<SQL
				select $tblEaxm.content,$tblEaxm.image from $tblEaxmIndex LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid where $tblEaxmIndex.gid in('{$value['question_id']}'); 
SQL;
				
//				$this->b['sql'.$key] = $this->db->sql;
//				$this->b['rs'.$key] =$this->db;
				$this->db->Queryone();
				$rs = $this->db->rs;
				foreach ($collectionRs as $k=>$v){
					if($value['question_id']==$v['question_id']){
						$collectionRs[$key]['content'] =$rs['content']; 
						$collectionRs[$key]['image'] =$rs['image']; 
					}
				}
				

			}
			
//			print_r($collectionRs);
//			$result = array_merge($collectionRs,$questionRs);
			$recordCount=count($collectionRs);
			
			if(isset($_REQUEST['begin_page'])){
				$begin_page=$this -> r('begin_page')-1;
			}
			else{
				$begin_page=0;
			}
			
			
			if(isset($_REQUEST['total_item'])){
				$total_item=$this -> r('total_item');
			}
			else
			{
				$total_item=30;
			}
			
			$begin_item=$begin_page * $total_item;
			$result  = array_slice($collectionRs,$begin_item,$total_item);
			//$end_item=($begin_page+1) * $total_item; 
//			$this -> db -> sql .=" limit ".$begin_item.",".$total_item;
			
//			echo $this->db->sql;
//			$this -> db -> Query();
//			$this -> b['sql'] = $this -> db -> sql;
			if($result==null){
				//$this -> b['sql'] = $this -> db -> sql;
				$this->b['total_pages']=0;
				$this -> b['history'] = null;
				$this -> b["sc"] = 200;
				return;
			}
			
			
			//$this -> b['sql'] = $this -> db -> sql;
			$this->b['total_pages']=ceil($recordCount/$total_item);
			$this -> b['history'] = $result;
			$this -> b["sc"] = 200;
			
		}
		

		//更新心得
		public function update_insight(){

			if(isset($_REQUEST['question_id']) && isset($_REQUEST['my_insight'])){
				$question_id = $this->r("question_id");//题id
				$my_insight= $this->r("my_insight");//我的心得
				$user_id = $this->r("userId");
				//echo $user_id;
				//echo $question_id.'-----------------+++++++++++++'.$my_insight;
				//return false;
				$this -> db -> sql = "update study_collection set my_insight='{$my_insight}' where question_id='{$question_id}' and user_id={$user_id}";
				//echo $this->db->sql;
				$this -> db -> ExecuteSql();
				echo 1;
				$this -> b["sc"] = 200;
				return false;
			}
			//echo  $question_id.'-------------------'.$my_insight;
			echo 0;
			return false;
		}
		
		
	}
	


?>
