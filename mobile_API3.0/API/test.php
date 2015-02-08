<?php
///////////////////////////////////////////////////////
// 测试接口
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
					switch($this -> urlarr[4]){
						case "wait":
						if($this -> vr['pass']){
							$this -> getWait();
						}
						else{
							$this -> b["sc"] = 403;
						}
						break;
						case "ok":
						if($this -> vr['pass']){
							$this -> getOk();
						}
						break;
						case "all" :
						if($this -> vr['pass']){
							$this -> getALL();
						}
						break;
						case "list_detail":
							$this -> getListDetail();
						break;
						case "by_examid":
							$this -> getlistbyid();
						break;
						case "getword_url":
							$this -> getword_url();
						break;
						
						case "uploadeFile":
							$this -> uploadeFileone();
						break;
						default:
						break;
					}
				}
				else{
					$this -> getDetail();
				}


		}
		
		private function getlistbyid(){
			//$this -> db -> sql = "select study_exercise.*,usr_user.realname from study_exercise join usr_user on user_id=id where exercise_id=".$this -> r('exam_id');
			$page=$this -> urlarr[5];
			$pageSize=20;
			$recordFrom=1;
			
			$this -> db -> sql = "select pi,study_exercise.id,exam_exercise.content,exam_exercise.name,exam_exercise.creat_date,study_exercise.exercise_id,exam_exercise.subject_id,study_exercise.my_score,study_exercise.log_time,exam_exercise.class_id  as class_id,realname,nickname ,usr_user.id as student_id,study_exercise.log_time,exam_exercise.assign_type,study_exercise.type from (exam_exercise JOIN study_exercise ON exam_exercise.id=study_exercise.exercise_id) join usr_user on usr_user.id=study_exercise.user_id where study_exercise.exercise_id=".$this -> r('exam_id') ;
			
			if (isset($_REQUEST["student_name"]))
			{
				$this -> db -> sql.=" and  usr_user.realname like '%".$this->r("student_name")."%' ";
			}
			
			$this -> db -> sql.= " order by  study_exercise.exercise_id  desc ";
			$this -> db -> Query();
			$pageTotal=count($this -> db -> rs);
			
			if (!($page==null))
			{
				$arr=explode(",",$page);
				$pageSize=$arr[1];
				$recordFrom=$arr[0];
				$this -> db -> sql.= " limit ". $recordFrom. ", ". $pageSize;
			}
			
			$this -> db -> Query();
//			$this->b['sql'] = $this->db->sql;
			$this -> b["pages"]=$pageTotal;
			$this -> b["test"] = $this -> db -> rs;
		
		}
		
		private function getlistbyidhh(){
			//$this -> db -> sql = "select study_exercise.*,usr_user.realname from study_exercise join usr_user on user_id=id where exercise_id=".$this -> r('exam_id');
			$this -> db -> sql = "select pi,study_exercise.id,exam_exercise.content,exam_exercise.name,exam_exercise.creat_date,study_exercise.exercise_id,exam_exercise.subject_id,study_exercise.my_score,study_exercise.log_time,exam_exercise.class_id as class_id,realname,nickname ,usr_user.id as student_id,study_exercise.log_time from (exam_exercise JOIN study_exercise ON exam_exercise.id=study_exercise.exercise_id) join usr_user on usr_user.id=study_exercise.user_id where study_exercise.exercise_id=".$this -> r('exam_id');
			$this -> db -> Query();
			$this -> b["test"] =$this -> db -> rs;
		
		}
		
		
		private function getword_url(){
			$this -> db -> sql = "select url  from exam_exercise  where id=".$this -> r('exam_id');
			$this -> db -> Queryone();
			$this -> b["url"]=$this -> db -> rs['url'];
		}
			
		
		private function getDetail(){
			$this -> db -> sql = "select id,user_id,log_time,content from study_exercise where id=".$this -> r('test_id');
			$this -> db -> Queryone();
			$this -> b["test"] = $this -> db -> rs;
			$this -> db -> sql = "select usr_user.id,usr_user.usr_type,realname from usr_class join usr_user on usr_class.uid=usr_user.id where class_Id=".$this -> r('class_id')." and usr_class.relationship in (1,2)";
			$this -> db -> Query();
			$this -> b["user"] = $this -> db -> rs;
			$this -> db -> sql = "select activities,subject_id,content from exam_exercise where id=".$this -> r('exercise_id');
			$this -> db -> Queryone();
			$this -> b["exercise"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		
		private function getWait(){
		//获取待批该测试
			$this -> db -> sql = "select study_exercise.id as test_id,exam_exercise.content,exam_exercise.name,study_exercise.exercise_id,exam_exercise.subject_id,exam_exercise.class_id as class_id,realname,usr_user.id as student_id,study_exercise.type from (exam_exercise JOIN study_exercise ON exam_exercise.id=study_exercise.exercise_id) join usr_user on usr_user.id=study_exercise.user_id where exam_exercise.class_id IN (select class_Id from usr_class where uid=".$this -> vr['id'].") and isnull(study_exercise.my_score)";
			$this -> db -> Query();
			$this -> b["test"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		private function getOk(){
		//获取已批该测试
		    if (isset($_REQUEST["sid"]))
			{	
			    $ssubject_id=$_REQUEST["subject_id"];		
				$this -> db -> sql ="select t2.id,t1.content,t1.name,t2.exercise_id,t1.subject_id,t2.my_score,t2.log_time,t1.class_id as class_id,realname,usr_user.id as student_id,t2.type,t1.assign_type from (exam_exercise as t1 JOIN study_exercise as t2 ON t1.id=t2.exercise_id) join usr_user on usr_user.id=t2.user_id and  usr_user.id='".$_REQUEST["sid"]."'	where  ( t1.class_id IN (select class_Id from usr_class where uid=".$this -> vr['id']." ) or  t1.class_id is null ) and (!isnull(t2.my_score) and t1.subject_id=".$ssubject_id ." ) and  t1.creator_id=".$this -> vr['id'] ;
			
			}
			else
			{
			$this -> db -> sql = "select study_exercise.id,exam_exercise.content,exam_exercise.name,study_exercise.exercise_id,exam_exercise.subject_id,study_exercise.my_score,study_exercise.log_time,exam_exercise.class_id as class_id,realname,usr_user.id as student_id,study_exercise.type from (exam_exercise JOIN study_exercise ON exam_exercise.id=study_exercise.exercise_id) join usr_user on usr_user.id=study_exercise.user_id where exam_exercise.class_id IN (select class_Id from usr_class where uid=".$this -> vr['id'].") and !isnull(study_exercise.my_score)";
			}
			$this -> db -> Query();
			$this -> b["sql"]=$this -> db -> sql;
			$this -> b["test"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		private function getALL(){
		//获取所有测试
			if($this -> vr['usr_type']==2 and $this -> vr['level']==2){ //如果是老师
				$this -> db -> sql = "select pi,t2.id,t1.content,t1.conditions,t1.name,t1.creat_date,t2.exercise_id,t1.subject_id,t2.my_score,t2.log_time,t1.class_id as class_id,realname,
				tbluser.id as student_id,t2.log_time ,t2.type as type 
				from (teach_exam_list  t1 JOIN study_exercise t2 ON t1.id=t2.exercise_id) 
				join tbluser on tbluser.id=t2.user_id where t1.class_id IN (select id from tblclass where zone_id=".$this -> vr['zone_id'].") order by t2.id desc";
				}
				
				$numSQl  = $this->db->sql; 
			if($this -> vr['usr_type']==2&&$this->r('user_id')){
				//注释掉以前的方法
//				$this -> db -> sql = "select pi,t2.id,t1.content,t1.name,t1.creat_date,t2.exercise_id,t1.subject_id,t2.my_score,t2.log_time,t1.class_id as class_id,realname,
//				tbluser.id as student_id,t2.type as type 
//				from (exam_exercise t1 JOIN study_exercise t2 ON t1.id=t2.exercise_id) join tbluser on tbluser.id=t2.user_id 
//				where (t1.class_id IN (select class_Id from usr_class where uid=".$this -> vr['id'].")) or t1.creator_id=".$this -> vr['id'];
				$sql = 'select 
								study_exercise.pi,
								study_exercise.id as study_exercise_id,
								teach_exam_list.content,
								teach_exam_list.conditions,
								teach_exam_list.exam_type,
								teach_exam_list.name,
								teach_exam_list.create_date as creat_date,
								study_exercise.exercise_id,
								teach_exam_list.subject_id,
								study_exercise.my_score,
								study_exercise.log_time,
								study_exercise.class_id as class_id,
								tbluser.realname,
								tbluser.id as student_id,
								study_exercise.type as type,
								study_exercise.assign_type,
								teach_assign_list.id as assign_id,
								teach_exam_list.teacher_id as creator_id,
								teach_assign_list.creator_name as teacher_name,
								teach_assign_list.end_date,
								teach_assign_list.create_date as assign_date
								from
								study_exercise 
								left JOIN teach_exam_list ON study_exercise.exercise_id=teach_exam_list.id
								left join tbluser on tbluser.id=study_exercise.user_id  
								left join teach_assign_list ON teach_assign_list.id=study_exercise.assign_id
								where study_exercise.user_id='.$this->r('user_id').' and study_exercise.assign_type=1';
								if($this->r('creator')){
									$sql.=' and study_exercise.creator='.$this->r('creator');
								}
								
								if($this->r('class_id')){
									$sql.=' and study_exercise.class_id='.$this->r('class_id');
								}
								$pageNo = intval($this->r('pageno'))-1;
								$countPerPage = $this->r('countperpage');
								$limit = ' limit '.$pageNo*$countPerPage.','.$countPerPage;
//								echo $limit;
								if($countPerPage){//如果有分页
									$this->db->sql = $sql.' order by teach_assign_list.create_date desc' .$limit;
									
								}else{
									$this->db->sql = $sql;			
								}
								$numSQl  = $sql; 
//				echo $this->db->sql ;
			}
			else if($this -> vr['usr_type']==1){//如果是学生 
				if (isset($_REQUEST["assign_type"])){
					$sql = 'select 
								study_exercise.pi,
								study_exercise.id as study_exercise_id,
								teach_exam_list.content,
								teach_exam_list.conditions,
								teach_exam_list.name,
								teach_exam_list.exam_type,
								study_exercise.create_date as creat_date,
								study_exercise.exercise_id,
								teach_exam_list.subject_id,
								study_exercise.my_score,
								study_exercise.log_time,
								study_exercise.class_id as class_id,
								tbluser.realname,
								tbluser.id as student_id,
								study_exercise.type as type,
								study_exercise.assign_type,
								teach_exam_list.teacher_id as creator_id,
								teach_assign_list.creator_name as teacher_name,
								teach_assign_list.end_date
								from
								study_exercise 
								left JOIN teach_exam_list ON study_exercise.exercise_id=teach_exam_list.id
								left join tbluser on tbluser.id=study_exercise.user_id  
								left join teach_assign_list ON teach_assign_list.id=study_exercise.assign_id
								where study_exercise.user_id='.$this->r('user_id').' and study_exercise.assign_type=1 and study_exercise.class_id='.$this->r('class_id').' order by study_exercise.create_date desc;';
								$this->db->sql = $sql;	
								
								$numSQl  = $this->db->sql; 
								$this->b['sql']  =$this->db->sql ;
//								if($this->r('creator')){
//									$sql.=' and study_exercise.creator='.$this->r('creator');
//								}
//								$pageNo = intval($this->r('pageno'))-1;
//								$countPerPage = $this->r('countperpage');
//								$limit = 'limit '.$pageNo*$countPerPage.','.$countPerPage;
//								if($pageNo&&$countPerPage){//如果有分页
//									$this->db->sql = $sql.$limit;
//								
//								}else{
//									$this->db->sql = $sql;			
//								}
				}else{
					//下面不知所云
//				移动
					$this->db->sql  = 'select 
									study_exercise.pi,
									study_exercise.id,
									teach_exam_list.content,
									teach_exam_list.name,
									study_exercise.create_date as creat_date,
									study_exercise.exercise_id,
									teach_exam_list.subject_id,
									study_exercise.my_score,
									study_exercise.log_time,
									study_exercise.class_id as class_id,
									tbluser.realname,
									tbluser.id as student_id,
									study_exercise.type as type,
									study_exercise.exam_type,
									study_exercise.assign_type,
									teach_exam_list.teacher_id as creator_id,
									
									teach_exam_list.center_id,
									
									teach_exam_list.zone_id,
									
									teach_assign_list.creator_name as teacher_realname,
									
									teach_assign_list.end_date,
									
									study_exercise.ClassOrPersonal
									from
									study_exercise 
									left JOIN teach_exam_list ON study_exercise.exercise_id=teach_exam_list.id
									left join tbluser on tbluser.id=study_exercise.user_id  
									left join teach_assign_list ON teach_assign_list.id=study_exercise.assign_id
									where study_exercise.user_id='.$this->vr['id'].' and study_exercise.assign_type=1 ';
				
									if (isset($_REQUEST["list_type"])){
										$type = $_REQUEST["list_type"];
										if($type ==1){
											$this->db->sql.=' and study_exercise.type in('.$type.',4)';
										}else{
											$this->db->sql.=' and study_exercise.type='.$type;
										}
										
									}
									if($_REQUEST["grade"]){
										
										$gradeId = $_REQUEST["grade"];
										if($gradeId==18){
											$this->db->sql.=' and study_exercise.grade_id in(7,8,9)';	
										}if($gradeId==17){
											$this->db->sql.=' and study_exercise.grade_id in(1,2,3,4,5,6)';	
										}else if($gradeId==19){
											$this->db->sql.=' and study_exercise.grade_id in(10,11)';
										}
										
									}
									$numSQl  = $this->db->sql; 
				}
			}
		//	echo $numSQl;
			$this -> db -> Query();
			$rs = $this->db->rs;
			$this -> b["test"] = $rs;
			$this->b['sql'] = $this->db->sql;
			$this->db->sql = $numSQl;
			$this->db->Query();
			$numRs = $this->db->rs;
			$this->b['count'] = count($numRs);			
			$this -> b["sc"] = 200;
		}
		
		private function getListDetail(){
			if($this -> vr['pass']){
				$id = $this -> r('study_exercise_id');	
				
				$this -> db -> sql = "select id,user_id,exercise_id,content,pi,my_score,type,log_time from study_exercise where id=".$id;
				$this -> db  -> Queryone();
				$this -> b['study_exercise'] = $this -> db -> rs;
//				print_r(base64_decode($this -> b['study_exercise']['content']));
//				exit;

			//	$this -> db -> sql = "select name,activities,content,creat_date,class_id,creator_id,subject_id from teach_exam_list where id=".$this -> b['study_exercise']['exercise_id'];
				$this->db->sql =  "select name,conditions as activities,content,create_date as creat_date,teacher_id,tbluser.realname,subject_id from teach_exam_list left join tbluser on tbluser.id=teach_exam_list.teacher_id where teach_exam_list.id=".$this -> b['study_exercise']['exercise_id'];
				$this -> db -> Queryone();
				$rs = $this -> db -> rs;
				$content = json_decode($rs['content'],true);
				$this->get_paper($tblEaxm, $tblEaxmIndex, $content);
				$this -> b['exam_exercise'] = $rs;
//				print_r($content);
//				exit;

//				$this -> db -> sql = "select tbluser.id,realname,grade_id from tbluser join usr_student on tbluser.id=usr_student.uid where tbluser.id=".$this -> b['study_exercise']['user_id'];
				
				$this->db->sql = 'select tbluser.id,realname,tblstudent.grade from tbluser join tblstudent on tbluser.id=tblstudent.user_id where tbluser.id='.$this -> b['study_exercise']['user_id'];
				$this -> db -> Queryone();
				$this -> b["student"] = $this -> db -> rs;
				
				$subjectId = $this->b['exam_exercise']['subject_id'];
				$tblEaxm = $this->get_examination_tbl($subjectId);
				$tblEaxmIndex = $tblEaxm.'_index';
				$this->get_paper($tblEaxm, $tblEaxmIndex, json_encode($content));				
				
//				$kk = explode(",",$rs['content']);
//				$kkn = "";
//				foreach($kk as $vvv){
//					$kkn .= "'".$vvv."',";
//				}
//				$kkn = substr($kkn,0,-1);
//				
//				$subjectId = $this->b['exam_exercise']['subject_id'];
//				$this->get_examination_tbl($subjectId);
//				$tblEaxm = $this->get_examination_tbl($subjectId);
//				$tblEaxmIndex = $tblEaxm.'_index';
//				
//				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
//				$this -> db -> sql =<<<SQL
//				select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,$tblEaxm.image
//				from $tblEaxmIndex
//				LEFT JOIN $tblEaxm ON $tblEaxmIndex.yid=$tblEaxm.yid where $tblEaxmIndex.id in($kkn) ORDER BY FIELD($tblEaxmIndex.id,$kkn); 
//SQL;
				//$this -> db -> sql = "select id,content,objective_flag,option_count,objective_answer,group_count,question_type,image,answer from exam_question where id IN (".$kkn.") "; //order by objective_flag desc";
//				$this -> db -> sql = "select id,content,objective_flag,option_count,objective_answer,group_count,question_type,image,answer from exam_question where id IN (".$kkn.") ORDER BY FIELD(id,".$kkn.")";
//				echo $this->db->sql;
//				$this -> db -> Query();
				
//				if($this -> db -> rs==null){
//					return;
//				}
//				$this -> b["question"] = base64_encode(json_encode($this -> db -> rs));
//				$this -> b["list"] = $this -> db -> rs;
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
		
	
		//POST逻辑
		public function doPOST(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			if($this -> urlarr[3]=="list"){
					switch($this -> urlarr[4]){
						case "uploadeFile":
						//if($this -> vr['pass']){
							$this -> uploadeFileone();
						//}
						break;
					}
			}
		}
	
		//PUT逻辑
		public function doPUT(){
			if($this -> vr['pass']){
			
				switch($this -> urlarr[3]){
					case "pi":
						$arr['pi'] = $this -> r('pi');
						if(isset($_REQUEST['type'])){
						     $arr['type'] = $this -> r('type');
						}
						else{
							$arr['type']=3	;
						}
						if(isset($_REQUEST['content'])){
							$arr['content']=$this -> r('content');
						}
						
						if(isset($_REQUEST['my_score'])){
							$arr['my_score']=$this -> r('my_score');
						}
						
						$this -> db -> Update('study_exercise',$arr,"id=".$this -> r('test_id'));
					    break; 
					default:
						if(isset($_REQUEST['type'])){
						     $arr['type'] = $this -> r('type');
						}
						else{
							 $arr['type'] = 2;
						}
						$arr['content'] = $this -> r('content');
						$arr['log_time'] = 'current_timestamp()';
						$arr['my_score'] = $this -> r('my_score');
						$result=$this -> db -> Update('study_exercise',$arr,"id=".$this -> r('test_id'));
						//echo $this -> db -> sql;
					break;
				}
				//$this->b[content]=$this -> r('content');
				//$this->b[result]=$result;
			    //$this -> b["sql"]=$this -> db -> sql;
				$this -> b["sc"] = 200;
			}else{
				if($this -> urlarr[3]=="list"){
					switch($this -> urlarr[4]){
						case "uploadeFile":
						//if($this -> vr['pass']){
							$this -> uploadeFileone();
						//}
						break;
					}
				}

			}
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		

		public function uploadeFileone(){
			var_dump($_FILES);
		}	
		
			
			
		//获取试卷
		public function get_paper($tblEaxm,$tblEaxmIndex,$paperIdArr){
			$paperIds = json_decode($paperIdArr,true);
			$result1 = array();
			$result2 =array();
			foreach ($paperIds as $key=>$value){
				if($value['dbtype']==1&&$value['ids']){
					$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
					$sql =<<<SQL
			select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,a.dbtype,edu_question_type.type_name
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
			LEFT JOIN edu_question_type on edu_question_type.id=$tblEaxmIndex.question_type
			join (select 1 as dbtype) a on 1=1
SQL;
					if(count($value['ids'])>0){
						$str = '"'.implode('","', $value['ids']).'"';
						$where = ' WHERE '.$tblEaxmIndex.'.gid in('.$str.')';
					}
					
					$this->db->sql = $sql.$where;
//					echo $this->db->sql;
//					exit;
					$this->db->Query();
					$result1 = $this->db->rs;
				}
				 if($value['dbtype']==2&&$value['ids']){
					$dbJson = $this->query_curriculumndb();
					if($dbJson){
						$db = json_decode($dbJson,true);
//						print_r($db);
						$this->switchDB($db['ip'], $db['name']);
						$sql =<<<SQL
						select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,a.dbtype,edu_question_type.type_name
						from $tblEaxmIndex
						LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
						LEFT JOIN edu_question_type on edu_question_type.id=$tblEaxmIndex.question_type
						join (select 2 as dbtype) a on 1=1
SQL;

						if(count($value['ids'])>0){
							$str = '"'.implode('","', $value['ids']).'"';
							$where = ' WHERE '.$tblEaxmIndex.'.gid in('.$str.')';
						}
//						echo $sql.$where;
						$this->db->sql = $sql.$where;
						 $this->db->Query();
						 $result2 = $this->db->rs;
					}
					
				}
			}
			if(isset($result1)&&isset($result2)){
				$result = array_merge($result1,$result2);
			}else if(isset($result1)&&!isset($result2)){
				$result = $result1;
			}else if(!isset($result1)&&isset($result2)){
				$result = $result2;
			}
//			print_r($result);
			$this->b['list'] = $result;
			$this->b['sc'] = 200;
		}
	}
	


?>