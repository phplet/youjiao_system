<?php
///////////////////////////////////////////////////////
// 试卷接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");

	
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			if($this -> urlarr['3']=="word"){
				$this -> getExamword();
			}
			else{
				$this -> getExam();
			}
			
		}
		
		private function getExamword(){
			if($this -> vr['pass'] && $this -> vr['usr_type']==2){
			//if($this -> vr['pass'] && $this -> vr['usr_type']==2 && $this -> vr['level']==3){
				$this -> db -> sql = "select url from exam_exercise where id=".$this -> r('exercise_id');
				$this -> db -> Queryone();
				$this -> b['url'] = $this -> db -> rs['url'];
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
		private function getExam(){
		//获取试卷
			if($this -> vr['pass']){
				$this -> db -> sql = "select activities,content,creat_date,class_id,creator_id from exam_exercise where id=".$this -> r('exercise_id');
				$this -> db -> Queryone();
				$rs = $this -> db -> rs;
				$this -> b["param"] = $rs['activities'];
				$this -> b['creat_date'] = $rs['creat_date'];
				

				
				$this -> db -> sql = "select usr_user.id,realname,subject_grade from usr_user join usr_teacher on usr_user.id=usr_teacher.uid where usr_user.id=".$rs['creator_id'];
				$this -> db -> Queryone();
				$this -> b["teacher"] = $this -> db -> rs;
				
				$this -> db -> sql = "select usr_user.id,realname,grade_id from usr_user join usr_student on usr_user.id=usr_student.uid where usr_user.id=".$this -> r('student_id');
				$this -> db -> Queryone();
				$this -> b["student"] = $this -> db -> rs;
				
				$ttti = "";
				
				$ss = explode(",",$rs['content']);
				foreach($ss as $mmmm)
				{
					$ttti .= "'".$mmmm."',";
				}
				$ttti = substr($ttti,0,-1);
				//$my_sql="select id,objective_flag,score,option_count,objective_answer,group_count,question_type,content,image,answer from exam_question where id IN (".$ttti.") order by objective_flag desc";
				$my_sql="select id,objective_flag,score,option_count,objective_answer,group_count,question_type,content,image,answer from exam_question where id IN (".$ttti.") ORDER BY FIELD(id,".$ttti.")";
				$this -> db -> sql = $my_sql;
				

				
				$this -> db -> Query();
				if($this -> db -> rs==null){
					return;
				}
				foreach($this -> db -> rs as $k=>$v){
					$v['image'] = preg_replace("'([\r\n])[\s]+'", "", $v['image']);
					$v['image'] = preg_replace("' \",'", "\",", $v['image']);
					$iii = json_decode($v['image'],true);
					$match = null;
					preg_match_all("/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $this -> db -> rs[$k]['content'], $match);
					foreach($match[0] as $p=>$w){						
						$qq = $iii['question'];
						for($j=0;$j<count($qq);$j++){
							if(strstr($match[1][$p],$qq[$j]['file'])!=false){
								$scontenttemp=str_replace($match[0][$p],'<img src="data:image/gif;base64,'.$qq[$j]['pic'].'">',$this -> db -> rs[$k]['content']);
								$this -> db -> rs[$k]['content'] = $scontenttemp;
								break;
							}
						}							
					}
					//$this -> db -> rs[$k]['content']=base64_encode($this -> db -> rs[$k]['content']);
				 	$match1 = null;
					preg_match_all("/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $this -> db -> rs[$k]['answer'], $match1);
					foreach($match1[0] as $p1=>$w1){
						$qq = $iii['answer'];
						for($j=0;$j<count($qq);$j++){
							if(strstr($match1[1][$p1],$qq[$j]['file'])!=false){
								$sanswertemp= str_replace($match1[0][$p1],'<img src="data:image/gif;base64,'.$qq[$j]['pic'].'">',$this -> db -> rs[$k]['answer']);
								$this -> db -> rs[$k]['answer'] = $sanswertemp;
								break;
							}
						}							
					}
					//$this -> db -> rs[$k]['answer']=base64_encode($this -> db -> rs[$k]['answer']);
					unset($this -> db -> rs[$k]['image']);
				}
				//$this -> b["question"] = $this -> db -> rs;
				$this -> b["question"] = base64_encode(json_encode($this -> db -> rs));
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b["sc"] = 403;
			}
			
		}
	
		//POST逻辑
		public function doPOST(){
		
			switch($this -> urlarr['3']){
				case 'maual':
					$this -> makeMaual();
				break;
				//case 'hh':
				    //$this -> makeAuto();
				//	$this -> makeHH();
				//break;
				default:
					//$this -> makeAuto();
					$this -> makeHH();
				break;
			}
			
			
		}
		
		
		private function makeHH(){
			//自动生成试卷
  		 if($this -> vr['pass'] && $this -> vr['usr_type']==2){
			//if($this -> vr['pass'] && $this -> vr['usr_type']==2 && $this -> vr['level']==3){
				$exercise_id=$this -> r('exercise_id');
				$this -> db -> sql = "select activities,class_id,subject_id,student_id,ClassOrPersonal  from exam_exercise where id=".$exercise_id." and exam_stat=1";
				$this -> db -> Queryone();
				$examRs = $this->db->rs;
				$sid = $this -> db -> rs['subject_id'];
				$student_id = $this -> db -> rs['student_id'];
				$class_id = $this -> db -> rs['class_id'];
				$activities =  $this -> db -> rs['activities'];
				if($activities==null){
					$this -> b["sc"] = 404;
					return;
				}
				
				
				$assign_type=(string)$this -> r('assign_type');
				
				$rs = json_decode($activities,true);
				$vision = $rs['v'];
				$rs = $rs['condition'];
				
				//$this -> b["url"] =urldecode(base64_decode($rs['knowledge']));				
				//$this -> b["sc"] = 201;
				
				$kkk = explode(';',urldecode(base64_decode($rs['knowledge'])));
				$rs['knowledge'] = "(";
				foreach($kkk as $v){
					if($v!="" && $v!=null){
						$rs['knowledge'] .= "zh_knowledge like '%".$v."%' or ";
					}
					
				}
				$rs['knowledge'] = substr($rs['knowledge'],0,-4).") and subject_id=".$sid;
				
				
				
				//设置题目难度成分构成			
				switch($rs['difficulty']){
					//基础
					case 1:
						$lv = array(0.5,0.3,0.2,0,0);
						break;
					//中等
					case 2:
						$lv = array(0.2,0.3,0.3,0.1,0.1);
						break;
					//拔高
					case 3:
						$lv = array(0,0.1,0.3,0.4,0.2);
						break;
					default:
						break;
				}
				//计算各种难度题目数量
				$obj = $this -> caculateNum($rs['objective_total'],$lv);
				$sub = $this -> caculateNum($rs['subjective_total'],$lv);
				
				
				$ti = "";
				if($vision==1){
				
				if((int)$rs['ti_type']==1){
					//按章节生成 
					$where=$rs['chapter_id'];
					$ti .= $this -> getProblem1(1,$obj[0],$where,1);   //getProblem1($flag,$limit,$condition,$diffculty){
					$ti .= $this -> getProblem1(1,$obj[1],$where,2);
					$ti .= $this -> getProblem1(1,$obj[2],$where,3);
					$ti .= $this -> getProblem1(1,$obj[3],$where,4);
					$ti .= $this -> getProblem1(1,$obj[4],$where,5); //hhhhh
					
					$ti .= $this -> getProblem1(2,$sub[0],$where,1);
					$ti .= $this -> getProblem1(2,$sub[1],$where,2);
					$ti .= $this -> getProblem1(2,$sub[2],$where,3);
					$ti .= $this -> getProblem1(2,$sub[3],$where,4);
					$ti .= $this -> getProblem1(2,$sub[4],$where,5); //hhhhh

				}
				if((int)$rs['ti_type']==2){
					//按知识点生成
					$where=$rs['knowledge'];
					$ti .= $this -> getProblem2(1,$obj[0],$where,1);
					$ti .= $this -> getProblem2(1,$obj[1],$where,2);
					$ti .= $this -> getProblem2(1,$obj[2],$where,3);
					$ti .= $this -> getProblem2(1,$obj[3],$where,4);
					$ti .= $this -> getProblem2(1,$obj[4],$where,5); //hhhhh
					
					$ti .= $this -> getProblem2(2,$sub[0],$where,1);
					$ti .= $this -> getProblem2(2,$sub[1],$where,2);
					$ti .= $this -> getProblem2(2,$sub[2],$where,3);
					$ti .= $this -> getProblem2(2,$sub[3],$where,4);
					$ti .= $this -> getProblem2(2,$sub[4],$where,5); //hhhhh
					
				}
				
				$ti_all = "";
				if((int)$rs['ti_type']==3){
					//按真题生成
					$year=substr($rs['year'],0,4);
					$grade_id=$rs['grade_id'];
					$provinces_ids=$rs['provinces_ids'];
					
				    $this -> db -> sql = "select id,content from exam_examination  where year like '".$year."%' and grade_id='".$grade_id."' and province_id in (".$provinces_ids.")  and subject_id='".$sid."' order by rand() ";			
				    $this -> db -> Query();
					$exam=$this -> db -> rs;
					
					foreach($exam as $examitem){
						$c=json_decode($examitem["content"],true);					
						foreach($c["list"] as  $key=>$value)
						{
							$ti_all .="'".$value."',";
						}
					}
					$ti_all = substr($ti_all,0,-1);
					$swhere=" id in (".$ti_all.")  and  subject_id='".$sid."' ";
					$ti .= $this -> getProblemZhentTi(1,$obj[0],$swhere,1);
					$ti .= $this -> getProblemZhentTi(1,$obj[1],$swhere,2);
					$ti .= $this -> getProblemZhentTi(1,$obj[2],$swhere,3);
					$ti .= $this -> getProblemZhentTi(1,$obj[3],$swhere,4);
					$ti .= $this -> getProblemZhentTi(1,$obj[4],$swhere,5);
					
					$ti .= $this -> getProblemZhentTi(2,$sub[0],$swhere,1);
					$ti .= $this -> getProblemZhentTi(2,$sub[1],$swhere,2);
					$ti .= $this -> getProblemZhentTi(2,$sub[2],$swhere,3);
					$ti .= $this -> getProblemZhentTi(2,$sub[3],$swhere,4);
					$ti .= $this -> getProblemZhentTi(2,$sub[4],$swhere,5);			
					
				}
				
				$ti = substr($ti,0,-1);		

				

				
				//补足题目数
				$res=explode(",",$ti);
				$nn = count($res);
				if($nn==1 && $res[0]==""){
					$nn=0;
				}
				$tn = $rs['objective_total']+$rs['subjective_total'];
			
				
				if($nn<$tn){
					if($rs['ti_type']==1){
						if($nn!=0){
							$ti .= ",".$this -> getProblem3($rs['ti_type'],($tn-$nn),$where,$ti);   //getProblem3($flag,$limit,$condition,$notin)
						}
						else{
							$ti .= $this -> getProblem3($rs['ti_type'],($tn-$nn),$where,$ti);
						}
						
					}
					
					if($rs['ti_type']==2){
						if($nn!=0){
							$ti .=",". $this -> getProblem3($rs['ti_type'],($tn-$nn),$where,$ti);
						}
						else{
							$ti .= $this -> getProblem3($rs['ti_type'],($tn-$nn),$where,$ti);
						}
						
					}
							
				
					if($rs['ti_type']==3){
						$swhere=" id in (".$ti_all.") and id not in (".$ti.")  and  subject_id='".$sid."' ";
						if($nn!=0){
							$ti .=",". $this ->getProblemZhentTi2(($tn-$nn),$swhere);
						}
						else{
							$ti .= $this -> getProblemZhentTi2(($tn-$nn),$swhere);
						}
						
					}					
				}
				
				if(substr($ti,-1)==",") $ti = substr($ti,0,-1);
				
				
				//存储题目
				$arr['content'] = str_replace("'","",$ti);
				$arr['exam_stat'] = 4;
				
				$this -> db -> Update('exam_exercise',$arr,"id=".$exercise_id);
				//$arr['sql']=$this -> db -> sql;
				//获取班级成员
				$this -> db -> sql = "select uid from usr_class where class_Id in (".$class_id.") and relationship=1";
				$this -> db -> Query();
				$uid = $this -> db -> rs;
				
				if(!($class_id==null)){ //hhu   按班派
				
						$arr1['exercise_id'] =$exercise_id;// $this -> r('exercise_id');
						$arr1['ClassOrPersonal'] = $examRs['ClassOrPersonal'];
						$aaa = array();
						$aaa['oprate_one'] = $this -> vr['id'];
						$aaa['type'] = 1;
						$aaa['creat_time'] = 'current_timestamp()';
						$aaa['program'] = 'all';				
						$aaa['n_bubble'] = '有新作业';
						$aaa['title'] = '有新作业';
						$aaa['content'] = '收到新的作业，去看看！';
						$aaa['n_style'] = 3;
					
						foreach($uid as $v){
							$arr1['user_id'] = $v['uid'];
							$arr1['type'] = 1;
							$this -> db -> Insert('study_exercise',$arr1);
							if ($assign_type=="1" || $assign_type=="3")
							{
								$aaa['user_id'] = $v['uid'];		
								$this -> db -> Insert('push_list',$aaa);
							}
						}
				} //hhu
				
				if(!($student_id ==null)){ //hhu 
				        $arrStu= explode(",",$student_id);
				
						$arr1['exercise_id'] = $exercise_id;
						$arr1['ClassOrPersonal'] = $examRs['ClassOrPersonal'];
						$aaa = array();
						$aaa['oprate_one'] = $this -> vr['id'];
						$aaa['type'] = 1;
						$aaa['creat_time'] = 'current_timestamp()';
						$aaa['program'] = 'all';				
						$aaa['n_bubble'] = '有新作业';
						$aaa['title'] = '有新作业';
						$aaa['content'] = '收到新的作业，去看看！';
						$aaa['n_style'] = 3;
						foreach($arrStu as $v){
							$arr1['user_id'] = $v;
							$arr1['type'] = 1;
							$this -> db -> Insert('study_exercise',$arr1);
							if ($assign_type=="1" || $assign_type=="3")
							{
								$aaa['user_id'] = $v;		
								$this -> db -> Insert('push_list',$aaa);
							}
						}
				} //hhu				
				
				//创建word
				if ($assign_type=="2")
				{
				$this -> b["url"] = $this -> creatword($ti,"");				
				$this -> b["sc"] = 201;
				}
				$this -> b["assign_type"]=$assign_type;
				
			}
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
		
		
		private function makeMaual(){
		//手动生成试卷
			if($this -> vr['pass'] && $this -> vr['usr_type']==2){
									

				$arr['content'] = (string)$this -> r('ti_id');
				$arr['name'] = $this -> r('exam_name');
				$arr['field'] = (int)$this -> r('field');
				$arr['exer_type'] = (int)$this -> r('exer_type');			
				$arr['school_id'] = (int)$this -> vr['school_id'];
				$arr['subject_id'] = (int)$this -> r('subject_id');				
				$arr['creat_date'] = 'current_timestamp()';
				$arr['creator_id'] = (int)$this -> vr['id'];
				$arr['exam_stat'] = 4;
				$arr['tmod'] = 1;
				if(isset($_REQUEST['assign_type'])){
				$assign_type=(string)$this -> r('assign_type');
				}
				else{
					$assign_type="0";
				}
				$arr['assign_type'] =$assign_type;
				
				
				
				$aaa = array();
				$aaa['oprate_one'] = $this -> vr['id'];
				$aaa['creat_time'] = 'current_timestamp()';
				$aaa['program'] = 'all';				
				$aaa['n_bubble'] = '有新作业';
				$aaa['title'] = '有新作业';
				$aaa['content'] = '收到新的作业，去看看！';
				$aaa['n_style'] = 3;
				
				
				if(isset($_REQUEST['class_id'])){
					$arr['class_id'] = (string)$this -> r('class_id');
					$this -> db -> Insert('exam_exercise',$arr);
					$this -> db -> sql;
					$arr1['exercise_id'] = $this -> db -> Last_id();
					
					$exercise_id=$arr1['exercise_id'];
					
					$this -> db -> sql = "select uid from usr_class where class_Id in (".$this -> r('class_id').") and relationship=1";
					$this -> db -> Query();
					$uid = $this -> db -> rs;
					
					$arr1['type'] = 1;   //1-未提交  2--未批改    3--已批改
					foreach($uid as $v){
						$arr1['user_id'] = (int)$v['uid'];
						$arr1['type'] = 1;
						$this -> db -> Insert('study_exercise',$arr1);
						
						if ($assign_type=="1")   //1--手机  2---word
						{
							$aaa['type'] = 1;
							$aaa['user_id'] = (int)$v['uid'];		
							$this -> db -> Insert('push_list',$aaa);
					    }
					}
				}
				

				if(isset($_REQUEST['student_id'])){
					$arr['student_id'] = (string)$this -> r('student_id');
					$this -> db -> Insert('exam_exercise',$arr);
					$arr1['exercise_id'] = $this -> db -> Last_id();
					$exercise_id=$arr1['exercise_id'];

					$student = explode(",",$this -> r('student_id'));
					foreach($student as $v){
						$arr1['user_id'] = (int)$v;
						$arr1['type'] = 1;
						$this -> db -> Insert('study_exercise',$arr1);
						
						if ($assign_type=="1")
						{
							$aaa['user_id'] = (int)$v;	
							$aaa['type'] = 1;	
							//print_r($aaa);
							$this -> db -> Insert('push_list',$aaa);
						}
					}
				}
				
				
				$arrIDs="'".str_replace(",","','",$arr['content'])."'";  //getid
				
				/*
				$this -> b["url"]=$arrIDs;
				$this -> b["exid"]=$exercise_id;
				$this -> b["aa"]=explode(",",$arr['content']);
				return;
				*/
				
				if ($assign_type=="2")
				{
					$this -> b["url"] = $this -> creatword($arrIDs,$exercise_id);
				}
				
				$this -> b["sc"] = 201;
				
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
		
		
		
		private function getProblemZhentTi($flag,$limit,$condition,$diffculty){			
			if($limit>0){
				if($flag==1){
					$this -> db -> sql = "select id from exam_question_index where  ".$condition." and objective_flag=1 and difficulty=$diffculty order by rand() limit ".$limit;
				}
				else{
					$this -> db -> sql = "select id from exam_question_index where ".$condition." and objective_flag!=1 and difficulty=$diffculty order by rand() limit ".$limit;
				}	
				
	
				$this -> db -> Query();
				return $this -> getid($this -> db -> rs);
			}
			else{
				return "";
			}	
		}	
		
		private function getProblemZhentTi2($limit,$swhere){
			if($limit>0){
				$this -> db -> sql = "select id from exam_question_index where ".$swhere." order by rand() limit ".$limit;
				$this -> db -> Query();
				return $this -> getid($this -> db -> rs);
			}
			else{
				return "";
			}	
		}	
		
		
		
		private function getProblem1($flag,$limit,$condition,$diffculty){
			if($limit>0){
				if($flag==1){
					$this -> db -> sql = "select id from exam_question_index where  chapter_id in (".$condition.") and objective_flag=1 and difficulty=$diffculty order by rand() limit ".$limit;
				}
				else{
					$this -> db -> sql = "select id from exam_question_index where chapter_id in (".$condition.") and objective_flag!=1 and difficulty=$diffculty order by rand() limit ".$limit;
				}				
				$this -> db -> Query();
				return $this -> getid($this -> db -> rs);
			}
			else{
				return "";
			}
			
		}
		
		private function getProblem2($flag,$limit,$condition,$diffculty){
			if($limit>0){
				if($flag==1){
					$this -> db -> sql = "select id from exam_question_index where  (".$condition.") and objective_flag=1 and difficulty=$diffculty order by rand() limit ".$limit;
				}
				else{
					$this -> db -> sql = "select id from exam_question_index where (".$condition.") and objective_flag!=1 and difficulty=$diffculty order by rand() limit ".$limit;
				}
				$this -> db -> Query();
				return $this -> getid($this -> db -> rs);
			}
			else{
				return "";
			}
		}
		private function getProblem3($flag,$limit,$condition,$notin){
			if($limit>0){
				if($flag!=1){
					if($notin!=""){
						$this -> db -> sql = "select id from exam_question_index where (".$condition.") and id not in (".$notin.") order by rand() limit ".$limit;
					}
					else{
						$this -> db -> sql = "select id from exam_question_index where (".$condition.") order by rand() limit ".$limit;
					}
					
				}
				else{
					if($notin!=""){
						$this -> db -> sql = "select id from exam_question_index where chapter_id in (".$condition.") and id not in (".$notin.") order by rand() limit ".$limit;
					}
					else{
						$this -> db -> sql = "select id from exam_question_index where chapter_id in (".$condition.") order by rand() limit ".$limit;
					}
					
				}
				$this -> db -> Query();
				return $this -> getid($this -> db -> rs);
			}
			else{
				return "";
			}
		}
	
		//PUT逻辑
		public function doPUT(){
			$this -> b["sc"] = 405;
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		//获取id
		public function getid($ti){
			$rs = "";
			if(count($ti)>0){
				foreach($ti as $v){
					//$rs .= "'".$v['id']."',";
					$rs .= "'".$v['id']."',";
				}
			}
			return $rs;
		}
		//计算各种难度题目数量
		public function caculateNum($tn,$arr){
			$p1 = $tn*$arr[0];
			$p2 = $tn*$arr[1];
			$p3 = $tn*$arr[2];
			$p4 = $tn*$arr[3];
			$p5 = $tn*$arr[4];
			
			$n1 = floor($p1);
			$n2 = floor($p2);
			$n3 = floor($p3);
			$n4 = floor($p4);
			$n5 = floor($p5);
			
			$l1 = $p1-$n1;
			$l2 = $p2-$n2;
			$l3 = $p3-$n3;
			$l4 = $p4-$n4;
			$l5 = $p5-$n5;
			
			$ta = $l1+$l2+$l3+$l4+$l5;
			
			$a = $tn - $ta;
			
			$arr = $this -> themax($l1,$l2,$l3,$l4,$l5);
				 
			//$this ->b[count]=$ta;
			for($i=0;$i<$a;$i++){
				$$arr[$i] += 1; 
			}
			$n1=$n1+$ta;
			//return  $arr;
			return array($n1,$n2,$n3,$n4,$n5);
			
		}
		public function themax($l1,$l2,$l3,$l4,$l5){
			$arr = array("n1"=>$l1,"n2"=>$l2,"n3"=>$l3,"n4"=>$l4,"n5"=>$l5);
			asort($arr);
			return $arr;
		}
		
		
		public function creatword($id,$exerciseid){
			require_once(dirname(__FILE__)."/../include/w.php");
			require_once(dirname(__FILE__)."/../include/config.php");
			$filearr = array();
			

			
			//生成word
			if ($exerciseid=="")
			{
				$this -> db -> sql = "select * from exam_exercise where id=".$this -> r('exercise_id');
				$exerciseid=$this -> r('exercise_id');
			}
			else
			{
				$this -> db -> sql = "select * from exam_exercise where id=".$exerciseid;
			}
			
			
			$this -> db -> Queryone();
			
			$rs = $this -> db -> rs;
			$condition = json_decode($rs['activities'],true);
			$condition = $condition['condition'];
			//$this -> db -> sql = "select content,image from exam_question where id in (".$id.") order by objective_flag desc";
			$this -> db -> sql = "select content,image from exam_question where id in (".$id.") ORDER BY FIELD(id,".$id.")";
			//$this -> b["sql"]=$this -> db -> sql;
			$this -> db -> Query();
			
			$aa = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>评测卷生成时间".date('Y-m-d')."</title></head><body><h1>".$rs['name']."</h1><p>客观题每题".$condition['objective_score']."分，主观题每题".$condition['subjective_score']."分。</p><hr>";
			$i=1;
			
			
			
			foreach($this -> db -> rs as $v){
				$match = null;
				$v['image'] = preg_replace("' \",'", "\",", $v['image']);
				$v['content'] = str_replace("MypicPath\\","",$v['content']);
				
				preg_match_all("/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $v['content'], $match);
				
				foreach($match[0] as $k=>$w){
					$v['image'] = preg_replace("'([\r\n])[\s]+'", "", $v['image']);
					
					$iii = json_decode($v['image'],true);
					$qq = $iii['question'];
					for($j=0;$j<count($qq);$j++){
						if(strstr($match[1][$k],$qq[$j]['file'])!=false){
							$name ="http://". rand().$qq[$j]['file'];
							$v['content']=str_replace($match[0][$k],'<img src="'.$name.'">',$v['content']);
							$filearr[$name] = base64_decode($qq[$j]['pic']);
							break;
						}
					}
					
				}
				
				if((int)$v['objective_flag']==1){
					$ss = $condition['objective_score'];
				}
				else{
					$ss = $condition['subjective_score'];
				}
				$aa .= "<p style='font-weight:bold'>-----第".$i++."题 本题".$ss."分----</p><div style='font-weight:bold'>".$v['content']."</div><br><br><br><hr>";
			}
			$aa .= "</body></html>";
			
			
			$mht = new MhtFileMaker(); 
			$mht->AddContents("tmp.html",$mht->GetMimeType("tmp.html"),$aa); 
			
			
			foreach($filearr as $kkk => $vvv){
			
				$mht->AddContents($kkk,$mht->GetMimeType($kkk),$vvv); 
		
			}
							
			$fileContent = $mht->GetFile();
			
			$filename = time().$this -> randStr();
			$file = dirname(__FILE__)."/../../htdocs/ticool.hxnetwork.com/word/".$filename.".doc";
			$fp = fopen($file, 'w'); 
			fwrite($fp, $fileContent); 
			fclose($fp); 
			$arr['url'] =$this->mywebpath.$filename.".doc";
			
			$this -> db -> Update('exam_exercise',$arr,"id=".$exerciseid);
			//$this -> db -> Update('exam_exercise',$arr,"id=".$this -> r('exercise_id'));
			return $arr['url'];
		}
		

		
		//已被makeHH取代,可以考虑删除
		private function makeAuto(){
			//自动生成试卷
			if($this -> vr['pass'] && $this -> vr['usr_type']==2){
			//if($this -> vr['pass'] && $this -> vr['usr_type']==2 && $this -> vr['level']==3){
				$this -> db -> sql = "select activities,class_id,subject_id from exam_exercise where id=".$this -> r('exercise_id')." and exam_stat=1";
				$this -> db -> Queryone();
				$sid = $this -> db -> rs['subject_id'];
				$exercise_id=$this -> db -> rs['id'];
				$class_id = $this -> db -> rs['class_id'];
				$activities =  $this -> db -> rs['activities'];
				if($activities==null){
					$this -> b["sc"] = 404;
					return;
				}
				$rs = json_decode($activities,true);
				$vision = $rs['v'];
				$rs = $rs['condition'];
				$kkk = explode(';',urldecode(base64_decode($rs['knowledge'])));
				$rs['knowledge'] = "(";
				foreach($kkk as $v){
					if($v!="" && $v!=null){
						$rs['knowledge'] .= "zh_knowledge like '%".$v."%' or ";
					}
					
				}
				$rs['knowledge'] = substr($rs['knowledge'],0,-4).") and subject_id=".$sid;
				//设置题目难度成分构成			
				switch($rs['difficulty']){
					//基础
					case 1:
						$lv = array(0.5,0.3,0.2,0,0);
						break;
					//中等
					case 2:
						$lv = array(0.2,0.3,0.3,0.1,0.1);
						break;
					//拔高
					case 3:
						$lv = array(0,0.1,0.3,0.4,0.2);
						break;
					default:
						break;
				}
				//计算各种难度题目数量
				$obj = $this -> caculateNum($rs['objective_total'],$lv);
				$sub = $this -> caculateNum($rs['subjective_total'],$lv);
				

				
				$ti = "";
				if($vision==1){
				
				if((int)$rs['ti_type']==1){
					//按章节生成 
					$ti .= $this -> getProblem1(1,$obj[0],$rs['chapter_id'],1);
					$ti .= $this -> getProblem1(1,$obj[1],$rs['chapter_id'],2);
					$ti .= $this -> getProblem1(1,$obj[2],$rs['chapter_id'],3);
					$ti .= $this -> getProblem1(1,$obj[3],$rs['chapter_id'],4);
					
					$ti .= $this -> getProblem1(2,$sub[0],$rs['chapter_id'],1);
					$ti .= $this -> getProblem1(2,$sub[1],$rs['chapter_id'],2);
					$ti .= $this -> getProblem1(2,$sub[2],$rs['chapter_id'],3);
					$ti .= $this -> getProblem1(2,$sub[3],$rs['chapter_id'],4);

				}
				else{
					//按知识点生成
					$ti .= $this -> getProblem2(1,$obj[0],$rs['knowledge'],1);
					$ti .= $this -> getProblem2(1,$obj[1],$rs['knowledge'],2);
					$ti .= $this -> getProblem2(1,$obj[2],$rs['knowledge'],3);
					$ti .= $this -> getProblem2(1,$obj[3],$rs['knowledge'],4);
					
					$ti .= $this -> getProblem2(2,$sub[0],$rs['knowledge'],1);
					$ti .= $this -> getProblem2(2,$sub[1],$rs['knowledge'],2);
					$ti .= $this -> getProblem2(2,$sub[2],$rs['knowledge'],3);
					$ti .= $this -> getProblem2(2,$sub[3],$rs['knowledge'],4);
					
				}

				$ti = substr($ti,0,-1);
				
				//补足题目数
				$res=explode(",",$ti);
				$nn = count($res);
				if($nn==1 && $res[0]==""){
					$nn=0;
				}
				$tn = $rs['objective_total']+$rs['subjective_total'];
				if($nn<$tn){
					if($rs['ti_type']==1){
						if($nn!=0){
							$ti .= ",";
							$ti .= $this -> getProblem3($rs['ti_type'],($tn-$nn),$rs['chapter_id'],$ti);
						}
						else{
							$ti .= $this -> getProblem3($rs['ti_type'],($tn-$nn),$rs['chapter_id'],$ti);
						}
						
					}
					else{
						if($nn!=0){
							$ti .= ",";
							$ti .= $this -> getProblem3($rs['ti_type'],($tn-$nn),$rs['knowledge'],$ti);
						}
						else{
							$ti .= $this -> getProblem3($rs['ti_type'],($tn-$nn),$rs['knowledge'],$ti);
						}
						
					}
					
				}
				$ti = substr($ti,0,-1);

				
				//存储题目
				$arr['content'] = $ti;
				$arr['exam_stat'] = 4;
				$this -> db -> Update('exam_exercise',$arr,"id=".$exercise_id);
				//获取班级成员
				$this -> db -> sql = "select uid from usr_class where class_Id in (".$class_id.") and relationship=1";
				$this -> db -> Query();
				$uid = $this -> db -> rs;
				//分发卷子
				/*
						$arr1['exercise_id'] = $this -> r('exercise_id');
						$aaa = array();
						$aaa['oprate_one'] = $this -> vr['id'];
						$aaa['type'] = 1;
						$aaa['creat_time'] = 'current_timestamp()';
						$aaa['program'] = 'all';				
						$aaa['n_bubble'] = '有新作业';
						$aaa['title'] = '有新作业';
						$aaa['content'] = '收到新的作业，去看看！';
						$aaa['n_style'] = 3;
						
						foreach($uid as $v){
							$arr1['user_id'] = $v['uid'];
							$this -> db -> Insert('study_exercise',$arr1);
							$aaa['user_id'] = $v['uid'];		
							$this -> db -> Insert('push_list',$aaa);					
						}
						*/
				
				if(!($class_id==null)){ //hhu 
				
						$arr1['exercise_id'] =$exercise_id;// $this -> r('exercise_id');
						$aaa = array();
						$aaa['oprate_one'] = $this -> vr['id'];
						$aaa['type'] = 1;
						$aaa['creat_time'] = 'current_timestamp()';
						$aaa['program'] = 'all';				
						$aaa['n_bubble'] = '有新作业';
						$aaa['title'] = '有新作业';
						$aaa['content'] = '收到新的作业，去看看！';
						$aaa['n_style'] = 3;
						
						foreach($uid as $v){
							$arr1['user_id'] = $v['uid'];
							$arr1['type'] = 1;
							$this -> db -> Insert('study_exercise',$arr1);
							$aaa['user_id'] = $v['uid'];		
							$this -> db -> Insert('push_list',$aaa);					
						}
				} //hhu
				
				if(!($sid ==null)){ //hhu 
				        $arrStu= explode(",",$sid);
				
						$arr1['exercise_id'] = $this -> r('exercise_id');
						$aaa = array();
						$aaa['oprate_one'] = $this -> vr['id'];
						$aaa['type'] = 1;
						$aaa['creat_time'] = 'current_timestamp()';
						$aaa['program'] = 'all';				
						$aaa['n_bubble'] = '有新作业';
						$aaa['title'] = '有新作业';
						$aaa['content'] = '收到新的作业，去看看！';
						$aaa['n_style'] = 3;
						
						foreach($arrStu as $v){
							$arr1['user_id'] = $v['uid'];
							$arr1['type'] = 1;
							$this -> db -> Insert('study_exercise',$arr1);
							$aaa['user_id'] = $v['uid'];		
							$this -> db -> Insert('push_list',$aaa);					
						}
				} //hhu				
				
				//创建word
				$this -> b["url"] = $this -> creatword($ti,"");
				$this -> b["sc"] = 201;
				
			}
			}
			else{
				$this -> b["sc"] = 403;
			}
		}
	
	}
	


?>