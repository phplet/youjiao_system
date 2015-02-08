<?php
///////////////////////////////////////////////////////
// 收藏试卷接口
// by 晓坤
///////////////////////////////////////////////////////
//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			$action = $this->r('action');
				if($this -> vr['pass']){
					switch ($action){
						case 'cancel_fav':
						$this->cancel_favorite_exam();
						break;
						case 'fav_list':
						$this->get_favorite_exam_list();
				}
			}

		}
		//POST逻辑
		public function doPOST(){
			$action = $this->r('action');
				if($this -> vr['pass']){
					switch ($action){
						case 'add_fav':
						$this->add_favorite_exam();
						break;
				}
			}
		}
	
		//PUT逻辑
		public function doPUT(){
			
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		/**
		 * 
		 * 添加教师收藏试卷
		 */
		private function add_favorite_exam(){
			$fav = array();
			$sql = 'select * from teach_fav_exam where ref_id='.$this->r('exam_id').' and teacher_id='.$this->r('user_id');
			$this->db->sql=$sql;
			$this->db->Query();
			$result = $this->db->rs;
			if(count($result)>0){
				if($result[0]['inactive']!=1){
					$sql = 'update teach_fav_exam set inactive=1 where ref_id='.$this->r('exam_id').' and teacher_id='.$this->r('user_id');
					$this->db->sql=$sql;
					$this->db->ExecuteSql();
					if($this->db->rs){
						$this->b['sc'] = 200;
						$this->b['flag1'] = true;//已收藏
						}else{
							$this->b['reason'] = 'update teach_fav_exam failed';
					}
				}else{
					$this->b['flag2'] = true;//已收藏
					return;
				}
			}else{
				$fav['teacher_id'] = $this->r('user_id');
				$fav['ref_id'] = $this->r('exam_id');
				$sql = 'select * from teach_exam_list where id='.$this->r('exam_id');
				$this->db->sql=$sql;
				$this->db->Queryone();
				$rs = $this->db->rs;
				$fav['name'] = $rs['name'];
				$fav['exam_type'] = $rs['exam_type'];
				$fav['subject_id'] = $rs['subject_id'];
				$fav['grade'] = $rs['grade'];
				$fav['build_type'] = $rs['build_type'];
				$fav['conditions'] = $rs['conditions'];
				$fav['content'] = $rs['content'];
				$fav['score'] = $rs['score'];
				$fav['difficulty'] = $rs['difficulty'];
				$fav['center_id']  =$rs['center_id'];
				$fav['zone_id'] = $rs['zone_id'];
				$fav['inactive'] = '1';
				$fav['fav_date'] = 'current_timestamp()';
				$rs = $this->db->Insert('teach_fav_exam', $fav);
				if($rs){
					$sql = 'update teach_exam_list set favorited=1 ,fav_count=fav_count+1 where id='.$this->r('exam_id');
					$this->db->sql = $sql;
					$this->db->ExecuteSql();
					if($this->db->rs){
						$this->b['flag1'] =true; //收藏成功
						$this->b['sc'] = 201;
					}else{
						$this->b['reason'] = 'update teach_exam_list failed';
					}
				}else{
					$this->b['reason'] = 'insert teach_fav_exam failed';
				}
			}
		}
		
		
		public function cancel_favorite_exam(){
			$sql = 'update teach_fav_exam set inactive=0 ,inactive_time=current_timestamp()  where ref_id='.$this->r('exam_id').' and teacher_id='.$this->r('user_id');
			$this->db->sql = $sql;
			$this->db->ExecuteSql();
			if($this->db->rs){
				$this->b['flag'] = true;//以取消收藏
				$this->b['sc'] = 200;
			}else{
				$this->b['reason'] = 'update teach_exam_list failed';
			}
			
		}
		
		public function get_favorite_exam_list(){
			if($this -> vr['pass'] && $this -> vr['usr_type']==2){
				$pageNo = intval($this->r('pageno')) - 1;
				$countPerPage = $this->r('countperpage');
				$teacherId = (int)$this -> r('user_id');
				$sql = 'select teach_fav_exam.*,teach_exam_list.assign_student_count from teach_fav_exam left join teach_exam_list on teach_fav_exam.ref_id=teach_exam_list.id where teach_fav_exam.inactive=1 and teach_fav_exam.teacher_id='.$teacherId;
				$limit = ' LIMIT '.$pageNo*$countPerPage.','.$countPerPage;
				if($this->r('action')=='time'){
					$interval = $this->r('interval');
					if($interval){
						$time = date('Y-m-d H-i-s',strtotime('- '.$interval.'months'));
						$sql =$sql.' and unix_timestamp(create_date)>unix_timestamp("'.$time.'") and  unix_timestamp(create_date)<current_timestamp()';
					}else{
						$sql=$sql.' and unix_timestamp(create_date)<current_timestamp()';
					}
				}
				if($this->r('action')=='search'){
					$name = $this->r('name');
					$sql =$sql.' and name like "%'.$name.'%"';
				}
//				echo $sql.$limit;
				$this->db->sql = $sql.$limit;
				$this->db->Query();
				$rs = $this->db->rs;
				if(count($rs)>0){
					foreach ($rs as $key=>$value){
						$rs[$key]['stat_analyse']['assign_student_count'] = $value['assign_student_count']; //派送人数
//						$sql = 'select count(*) as num from study_exercise where type=3 and assign_id='.$value['id']; //已提交总数
//						$this->db->sql = $sql;
						$score = $value['score'];
						$scorePercent100 = $score*1;
						$scorePercent85 = $score*0.85;
						$scorePercent70 = $score*0.7;
						$scorePercent60 = $score*0.60; //计算百分比：按照学生作业批改计算 （type=3 已批改）
//						$sql = 'select count(*) as num from study_exercise where assign_id='.$value['id'].' and my_score='.$scorePercent100;
						$sql = 'select count(*) as num from study_exercise where type=3 and exercise_id='.$value['ref_id'].' and my_score='.$scorePercent100;
//						echo $sql;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent100Num = $result['num'];
						$rs[$key]['stat_analyse']['score_percent_100'] = $scorePercent100Num;
						
//						$sql = 'select count(*) as num from study_exercise where assign_id='.$value['id'].' and my_score<'.$scorePercent100.' and my_score>'.$scorePercent85;
						$sql = 'select count(*) as num from study_exercise where type=3 and exercise_id='.$value['ref_id'].' and my_score<'.$scorePercent100.' and my_score>'.$scorePercent85;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent85OverNum = $result['num'];
						$rs[$key]['stat_analyse']['score_percent_85_over'] = $scorePercent85OverNum;
						
//						$sql = 'select count(*) as num from study_exercise where assign_id='.$value['id'].' and my_score<'.$scorePercent85.' and my_score>='.$scorePercent70;
						$sql = 'select count(*) as num from study_exercise where  type=3 and exercise_id='.$value['ref_id'].' and my_score<'.$scorePercent85.' and my_score>='.$scorePercent70;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent70OverNum = $result['num'];
						$rs[$key]['stat_analyse']['score_percent_70_over'] = $scorePercent70OverNum;
						
						
						
//						$sql = 'select count(*) as num from study_exercise where assign_id='.$value['id'].' and my_score<'.$scorePercent70.' and my_score>='.$scorePercent60;
						$sql = 'select count(*) as num from study_exercise where type=3 and exercise_id='.$value['ref_id'].' and my_score<'.$scorePercent70.' and my_score>='.$scorePercent60;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent60OverNum = $result['num'];
						$rs[$key]['stat_analyse']['score_percent_60_over'] = $scorePercent60OverNum;
						
//						$sql = 'select count(*) as num from study_exercise where assign_id='.$value['id'].' and my_score<'.$scorePercent60;
						$sql = 'select count(*) as num from study_exercise where type=3 and exercise_id='.$value['ref_id'].' and my_score<'.$scorePercent60;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent60BelowNum = $result['num'];
						
						$rs[$key]['stat_analyse']['score_percent_60_below'] = $scorePercent60BelowNum;
						
						$rs[$key]['stat_analyse']['unsubmit_num']  = $value['assign_student_count']-$scorePercent100Num-$scorePercent85OverNum-$scorePercent70OverNum-$scorePercent60OverNum-$scorePercent60BelowNum;
					}
				}
				
				$this->b['list'] =$rs;
				$numSql = 'select count(*) as num from teach_fav_exam where inactive=1 and teacher_id='.$teacherId;
//				echo $numSql;
				$this->db->sql = $numSql;
				$this->db->Query();
				$num = $this->db->rs;
				$this->b['count'] = $num[0]['num'];
				$this->b['sc'] = 200;
			}
		}
	}
	


?>