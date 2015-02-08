<?php
///////////////////////////////////////////////////////
// 题库用户做题批量记录接口
// by 孙峻峰 v1.0 changed by xiaokun
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
			if(isset($_REQUEST['uid']) && (isset($_REQUEST['ti_id']))){
				//$uid = $this->r('uid');
				//$ti_id = $this->r('ti_id');
				$this -> db -> sql = "select attachment  from ticool_user_history  where uid='".$this -> r('uid')."' and tid='".$this->r('ti_id')."'";
				//echo $this-> db ->sql;
				$this -> db -> Queryone();
				$attachment =$this -> db -> rs['attachment'];
				//if($attachment==Null){
				//	echo 'Null';
				//}
				echo $attachment;
			}
			

		}
	
		//POST逻辑
		public function doPOST(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			if(isset($_REQUEST['exercise_id']) && isset($_REQUEST['uid'])){
				
				$this -> db -> sql = "select session_id  from study_exercise  where exercise_id=".$this -> r('exercise_id')." and user_id=".$this -> r('uid');
	
				$this -> db -> Queryone();
				$session_id =$this -> db -> rs['session_id'];
				if($session_id==Null){
					$this->b['str'] = '0';
//					echo 0;
					return false;
				}
				$path = $_SERVER['DOCUMENT_ROOT'].'/student/hx_20@13_paid_pic/hmwkLinshibaocun/';
				$file = $path.$session_id;
				$this->b['str'] = file_get_contents($file); 
				//return false;
			}else{
				$this -> lishibaocun();
			}
		}
	
		//PUT逻辑
		public function doPUT(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			$this -> addHistory();
			$this->collect_error();
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		//临时保存答案
		private function lishibaocun(){
			if(isset($_REQUEST['uploadData']) && isset($_REQUEST['uid'])){
				$data = $this->r("uploadData");
				$uid = $this->r("uid");
				$session_id = '';//存储文件名字 

				$path = $_SERVER['DOCUMENT_ROOT'].'/student/hx_20@13_paid_pic/hmwkLinshibaocun/';
				//if(file_exists($path)){
				//	echo '文件存在';
				//}
				$fileName = $data[0]['studentAccount'].'-'.$data[0]['exercise_id'].'.txt';
				$file = $path.$fileName;
				if(touch($file)){
					//echo "创建成功";
					$fp = fopen($file,'w+');
					$str = $data[0]['anserSheetHtml'];
					fputs($fp,$str);
					fclose($fp);
/**
 * 缺少对于旧文件的删除
 */
					$array1['session_id'] = $fileName;
					$result=$this -> db -> Update('study_exercise',$array1,"exercise_id=".$data[0]['exercise_id']." and user_id=".$uid);
					echo $result;
					
				}

			}
		}
		//加入记录
		private function addHistory(){
			require_once (dirname(__FILE__)."/../include/stat.php" );
	 		$stat = new statManager();
			if($this -> vr['pass']){
				$submit_type= 1;
				if(isset($_REQUEST['comefrom']) )
				{
					$comefrom= $this->r("comefrom");//pc端
					
					if(isset($_REQUEST['submit_type']))
					{
					    $submit_type=$this->r("submit_type");//1是最后提交  0暂存
					}
			
					$exercise_type= $this->r("exercise_type");//练习类型
					
					$score= $this->r("score");//用户分数
					$uid= $this->r("uid");//用户uid
					$assign_id= $this->r("assign_id");//
					$subjectId = $this->r('subject_id');
					$sectionId = $this->r('section_id');
					$examType = $this->r('exam_type');
					$examId = $this->r('exam_id');
					
					$objJSON=null;
//					$objJSON=json_decode(base64_decode($_REQUEST['upload_exercise_answers']),true);	
					$objJSON = json_decode($_REQUEST['upload_exercise_answers'],true);	
//					$this->b['upload_exercise_answers'] =$_REQUEST['upload_exercise_answers']; 
//					$this->b['upload_exercise_answers_for_me'] = $objJSON;
					$arrAns=null;
//					print_r($objJSON);
//					exit;
					foreach($objJSON as $k=>$arr){
						$arrAns[$k]["answer"]=$arr["answer"];
						$arrAns[$k]["id"]=$arr["tid"];
						$arrAns[$k]["obj"]=$arr["objective_flag"];
						$arrAns[$k]["dbtype"] =$arr["dbtype"]; 
						$arrAns[$k]["score"]=$arr["score"];
						
						$objJSON[$k]['subject_id'] = $subjectId;	
						
						//----------------------------
						$arrAns[$k]["attachment"]=rtrim($arr["attachment"],',');
						
//						$arrAns[$k]["attachment"]  = trim($arr["attachment"]);
						$arrTiHistory=null;
						$arrTiHistory["tid"]=$arr["tid"];
						$arrTiHistory["uid"]=$uid;
						$arrTiHistory["assign_id"]=$assign_id;
						$arrTiHistory["subject_id"]=$subjectId;
						$arrTiHistory["time_start"]=$arr["time_start"];
						$arrTiHistory["time_end"]=$arr["time_end"];
						$arrTiHistory["answer"]=$arr["answer"];
						$arrTiHistory["dbtype"] =$arr["dbtype"]; 
						$arrTiHistory["correct"]=$arr["correct"];
						$arrTiHistory["question_type"]=$arr["question_type"];
						$arrTiHistory["score"]=$arr["score"];
						$arrTiHistory["objective_flag"]=$arr["objective_flag"];
						$arrTiHistory["comefrom"]=$comefrom;
						$arrTiHistory["attachment"]=rtrim($arr["attachment"],',');
//						$arrAns[$k]["attachment"]  = trim($arr["attachment"]);
						
						if ($submit_type==1)
						{
							$this -> db -> Insert("ticool_user_history",$arrTiHistory,true);
							$this->b['sql1'] = $this->db->sql;
						}
					}
			
					if ($submit_type==1) { $arr1['type'] = 2;}
					$this->b['content'] = $arrAns;
					$arr1['content'] = base64_encode(json_encode($arrAns));
					$arr1['log_time'] = 'current_timestamp()';
					$arr1['my_score'] = $score;
					$result=$this -> db -> Update('study_exercise',$arr1,"id=".$this -> r('assign_id'));
					$this->b['sql2'] = $this->db->sql;
			 		/**
					 * 插入老师统计--学生提交数
					 */
					$teacher_id = $this->r('creator_id');
					$month = intval(date('m'));
					$year = intval(date('Y'));
					if(intval($this->r('exam_type'))=='0'){
						$data = array('teacher_id'=>$teacher_id,'work_submit_count'=>'1','year'=>$year,'month'=>$month,'center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id'));
					}elseif(intval($this->r('exam_type'))=='1'){
						$data = array('teacher_id'=>$teacher_id,'test_submit_count'=>'1','year'=>$year,'month'=>$month,'center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id'));
					}
//					print_r($data);
					$stat->update('teacher', 'total', $data);
					
					
					$sql = 'select * from study_exercise where id= '.$this->r('assign_id');
					$this->db->sql = $sql;
					$this->db->Queryone();
					$stuExercise = $this->db->rs;
					/**
					 * 插入学生应交作业数
					*/
					$day = date('Y-m-d');
					if(intval($this->r('exam_type'))=='1'){//测试
						$data = array('student_id'=>$this->r("uid"),'test_submit_count'=>'1','day'=>$day,'class_id'=>$stuExercise['class_id'],'teacher_id'=>$teacher_id);
					}elseif(intval($this->r('exam_type'))=='0'){//作业
						$data = array('student_id'=>$this->r("uid"),'work_submit_count'=>'1','day'=>$day,'class_id'=>$stuExercise['class_id'],'teacher_id'=>$teacher_id);
					}
					
//					$this->b['data'] = $data;
					
					$stat->update('student', 'total', $data);
					
					$exerciseHandler = new exercise_handler();
				
					//@todo  数据统计
					$userId = $this->r('uid');
					$data = array();
					$data['user_id'] = $userId;
					
					$data['exam_id'] = $this->r('exam_id');
					
					$data['ti_count'] = count($objJSON);
					
					$data['exam_count'] = 1;//提交次数
					
					
					//解析数据 做数据统计
					foreach ($objJSON as $key=>$value){
						$tiId = $value['tid'];
						$timeStart  = $value['time_start'];
						$timeEnd = $value['time_end'];
						$answer = $value['answer'];
						$score = $value['score'];
						$objectiveFlag = $value['objective_flag'];
						$questionType = $value['question_type'];
						$attachment = $value['attachment'];
						$correct = $value['correct'];
						$dbtype = $value['dbtype'];
						
						$data['dbtype'] = $dbtype;
						$data['my_score'] = $score;
						$data['subject_id'] =$subjectId;
						$data['section_id'] =$sectionId;
						$data['type'] = 2;
						$data['exam_type'] = $examType;
						$data['exercise_id'] = $examId;
						
						$data['exam_content'][$key] = $tiId;			
						$data['content'][$key]['id'] = $tiId;			
						$data['content'][$key]['answer'] = $answer;			
						$data['content'][$key]['obj'] = $objectiveFlag;			
						$data['content'][$key]['dbtype'] = $dbtype;			
						$data['content'][$key]['flag'] = $correct?true:false;			
					}
					
					$exerciseHandler->post_add_exercise_count($data);
					
					$exerciseHandler->stat_post_knowledge_id($userId, $data);//添加知识点的统计
					
					$exerciseHandler->stat_post_zhuanti($userId, $data);//添加专题统计
					
					$exerciseHandler->stat_post_subject($userId, $data);
					
					$exerciseHandler->stat_post_question_id($userId, $data);//添加试题的统计
					
					
					
					
				}
				else {
					$objJSON=json_decode($_REQUEST['upload_exercise_answers'],true);	
					//$objJSON=json_decode($this->rcontent('upload_exercise_answers'),true);	
					foreach($objJSON as $arr){
						if ( strpos($arr["uid"],"@")>0 )
						{
						$this -> db ->sql="select id from tbluser where username='".$arr["uid"]."'";
						$this -> db -> Queryone();
						$arr["uid"]=$this -> db -> rs['id'];
						}
						$this -> db -> Insert("ticool_user_history",$arr,true);
						$this->b['sql3'] = $this->db->sql;
					}
				}
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b["sc"] = 401;
			}
			
		}
		
		/**
		 * 
		 * 对于错题的处理
		 */
		
		public function collect_error(){
		require_once (dirname(__FILE__)."/../include/stat.php" );
	 	$stat = new statManager();
		if($this -> vr['pass']){
				if($this->r('content')){
					$content = json_decode($this->r('content'),true);//提交错题数据[{dbtype:1,ti_id:3},{dbtype:1,ti_id:2}]
					$num = count($content);
					if($num>0){
						foreach ($content as $key=>$value){
							$this -> db -> sql = "select id,flag from study_collection where user_id=".$this -> vr['id']." and question_id='".$value['ti_id']."' and dbtype='".$value['dbtype']."'";
							$this -> db -> Queryone();
							$has1 = $this ->db -> rs["id"];
							if($has1){
							//历史表中有记录 则更新历史表 更新同步记录表
								if($this -> r('force')==2){
									$hisid = $this ->db -> rs["id"];
									$this -> db -> sql = 'update study_collection set flag='.$this -> r('bookcode').',add_time=current_timestamp() where id='.$hisid;
									$this -> db -> ExecuteSql();
									$this->b['sql4'] = $this->db->sql;
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
									$this -> db -> sql = "insert into study_collection (flag,user_id,add_time,question_id,subject_id,dbtype,is_examination,study_exam_id) values(".$this -> r('bookcode').",'".$this -> vr['id']."',current_timestamp(),'".$value['ti_id']."','".$this -> r('subject_id')."','".$value['dbtype']."','".$this->r('exam_type')."','".$this->r('exam_id')."')";
									$this -> db -> ExecuteSql();
									$this -> b["sql5"] =  $this ->db -> sql;
									//$this -> b["sc"] =403;
									//return;
								$hisid = mysql_insert_id();
								$this -> b["sc"] = 201;
							}
							//////////////////////////////////////////////////同步表中是否有记录
							
			/**
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
							
				*/			
							
						}
					}
				}
				
				
//					$sql = 'select * from study_exercise where assign_id= '.$this->r('assign_id');
//					$this->db->sql = $sql;
//					$this->db->Queryone();
//					$stuExercise = $this->db->rs;
					/**
					 * 插入学生应交作业数
					*/
					$teacher_id = $this->r('creator_id');
					$day = date('Y-m-d');
					if(intval($this->r('exam_type'))=='1'){//测试
						$data = array('student_id'=>$this->r("uid"),'test_error_count'=>$num,'day'=>$day,'class_id'=>$this->r('class_id'),'teacher_id'=>$teacher_id);
						
					}elseif(intval($this->r('exam_type'))=='0'){//作业
						$data = array('student_id'=>$this->r("uid"),'work_error_count'=>$num,'day'=>$day,'class_id'=>$this->r('class_id'),'teacher_id'=>$teacher_id);
					}
					$stat->update('student', 'total', $data);
//				
//				$exerciseHandler = new exercise_handler();
//				$userId  = $this->vr['id'];
//				$data = array();
//				$data[''] = 
//				$exerciseHandler->post_add_ticool_user_history($userId, $data);
				
//				$day = date('Y-m-d');
//				if($this->r('exam_type')=='0'){
//						$data = array('student_id'=>$this->vr['id'],'work_error_count'=>$num,'day'=>$day);
//				}elseif($this->r('exam_type')=='1'){
//						$data = array('student_id'=>$this->vr['id'],'test_error_count'=>$num,'day'=>$day);
//				}
//				$stat->update('student', 'total', $data);
			}
	}
				
			

		
	}
	


?>