<?php
///////////////////////////////////////////////////////
// 试卷条件接口
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
			$this -> b["sc"] = 405;
		}
	
		//POST逻辑
		public function doPOST(){
			//生成组卷信息
			if($this -> vr['pass'] && $this -> vr['usr_type'] && $this -> vr['level']==4){
				//解析组合条件
				//$cid = explode(",",$_REQUEST['class_id']);
				//ti_type题库类型 1同步 2专题
				$m['ti_type'] = $this -> r('ti_type');
				//book_id教材版本
				$m['book_id'] = $this -> r('book_id');
				//chapter_id章节id 以半角逗号分隔
				$m['chapter_id'] = $this -> r('chapter_id');
				//difficulty难度 1基础 2中等 3拔高
				$m['difficulty'] = $this -> r('difficulty');
				//objective_total客观题数量
				$m['objective_total'] = $this -> r('objective_total');
				//subjective_total主观题数量
				$m['subjective_total'] = $this -> r('subjective_total');
				//objective_score客观题分值
				$m['objective_score'] = $this -> r('objective_score');
				//subjective_score主观题分值
				$m['subjective_score'] = $this -> r('subjective_score');
				//knowledge知识点 以半角逗号分隔
				$kkk = str_replace(",", ";", $this -> r('knowledge'));
				$m['knowledge'] = base64_encode($kkk);
				//mapping是否映射到百分 1映射 2不映射
				$m['mapping'] = $this -> r('mapping');
				
				//真题
				$m['year'] = $this -> r('year');
				$m['grade_id'] = $this -> r('grade_id');
				$m['provinces_ids'] = $this -> r('provinces_ids');
				
				
				$obj['condition'] = $m;
				//结构版本
				$obj['v'] = 1;
				$activities = json_encode($obj);
				
				$arr['name'] = $this -> r('name');
				$arr['school_id'] = (int)$this -> vr['school_id'];
				$arr['subject_id'] = (int)$this -> r('subject_id');
				
				$arr['creat_date'] = 'current_timestamp()';
				$arr['creator_id'] = (int)$this -> vr['id'];
				$arr['activities'] = $activities;
				$arr['exam_stat'] = $this -> r('exam_stat');
				if(isset($_REQUEST['class_id'])){
					$arr['class_id'] = (string)$this -> r('class_id');
					$arr['ClassOrPersonal'] = 1;
				}
				if(isset($_REQUEST['student_id'])){
					$arr['student_id'] = (string)$this -> r('student_id');
					$arr['ClassOrPersonal'] = 0;
				}
				
				$arr['tmod'] = 0;
				$arr['field'] = $this -> r('ti_type');
				$arr['exer_type'] = $this -> r('exer_type');
				
				if(isset($_REQUEST['assign_type'])){
					$arr['assign_type'] = $this -> r('assign_type');
				}
				
				$this -> db -> Insert('exam_exercise',$arr);
				$this -> b["exercise_id"] = $this -> db -> Last_id();
				
				$this -> b["sc"] = 201;
			}
			else{
				$this -> b["sc"] = 403;
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

		
	}
	


?>