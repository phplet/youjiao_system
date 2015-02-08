<?php
/**
 * @author xiaokun
 */
//ini_set("display_errors","On");
//error_reporting(E_ALL);
require_once(dirname(__FILE__)."/../stat.php");
class stat_handler extends statManager  {
	
	/**
	 * 添加统计stat_teacher
	 * @param  $teacherInfo 用户信息数组
	 * @param  $statField  更新字段
	 * @param  $status   true(add) false(remove) 
	 */
	public function stat_teacher($teacherInfo,$statField,$status=true){
		$num = $statField?($status?1:-1):0;
		$statField = $statField?$statField:'class_count';// $statField 不传，则为init统计
		$month = intval(date('m'));
		$year = intval(date('Y'));
		$rs =  utils_handler::is_two_dimensional_array($teacherInfo);
		if($rs){
			foreach ($teacherInfo as $key=>$value){
				$data = array('teacher_id'=>$value['user_id'],'year'=>$year,'month'=>$month,$statField=>$num,'center_id'=>$value['center_id'],'zone_id'=>$value['zone_id']);
				$this->update('teacher', 'total', $data);
			}
		}else{
				$data = array('teacher_id'=>$teacherInfo['user_id'],'year'=>$year,'month'=>$month,$statField=>$num,'center_id'=>$teacherInfo['center_id'],'zone_id'=>$teacherInfo['zone_id']);
				$this->update('teacher', 'total', $data);
		}
	}
	
	/**
	 * 
	 * @param  $studentInfo  用户信息数组
	 * @param  $statField		更新字段
	 * @param  $status			true(add) false(remove) 
	 */
	public function stat_student($studentInfo,$statField,$status=true){
		$num = $statField?($status?1:-1):0;
		$statField = $statField?$statField:'work_total_count';// $statField 不传，则为init统计
		$day = date('Y-m-d');
		$rs =  utils_handler::is_two_dimensional_array($studentInfo);
		if($rs){
			foreach ($studentInfo as $key=>$value){
				$data = array('student_id'=>$value['user_id'],'teacher_id'=>$value['teacher_user_id'],'class_id'=>$value['class_id'],'day'=>$day,$statField=>$num);
				$this->update('student', 'total', $data);
			}
		}else{
				$data = array('student_id'=>$studentInfo['user_id'],'teacher_id'=>$studentInfo['teacher_user_id'],'class_id'=>$studentInfo['class_id'],'day'=>$day,$statField=>$num);
				$this->update('student', 'total', $data);
		}
	}
	/**
	 * 
	 * @param  $zoneCenterInfo
	 * @param  $statField
	 * @param  $status
	 */
	public function stat_zone_center($zoneCenterInfo,$statField,$status=true,$num=NULL){
		$day = date('Y-m-d');
			if(!isset($num)){
				$num = $statField?($status?1:-1):0;
			}
			foreach ($zoneCenterInfo as $key=>$value){
				if(strstr($key,'zone_id')){
					$zoneDayData = array('day'=>$day,'zone_id'=>$value,$statField=>$num);	
					$this->update('zone','total',$zoneDayData); 
				}else if(strstr($key,'center_id')){
					$centerDayData =array('day'=>$day,'center_id'=>$value,$statField=>$num);	
					$this->update('center','total',$centerDayData); 
				}
			}
			
	}
	
	public function stat_exercise($data){
		$dataTmp['exam_id'] = $data['exam_id'];
		$dataTmp['user_id'] = $data['user_id'];
		$dataTmp['exam_type'] = $data['exam_type'];
		$dataTmp['ti_count'] = $data['ti_count'];
		$dataTmp['exam_count'] = $data['exam_count'];
		return $this->update('exercise', 'total', $dataTmp);
	}
	
	public function stat_exercise_ti($data){
		$dataTmp['ti_id'] = $data['ti_id'];
		$dataTmp['dbtype'] = $data['dbtype'];
		$dataTmp['user_id'] = $data['user_id'];
		$dataTmp['flag'] = $data['flag'];
		$dataTmp['count'] = $data['count'];
		$dataTmp['subject_id'] = $data['subject_id'];
		return $this->update('exercise_ti', 'total', $dataTmp);
	}
	
	
	public function stat_exercise_ti_total($data){
		$dataTmp['ti_id'] = $data['ti_id'];
		$dataTmp['dbtype'] = $data['dbtype'];
		$dataTmp['flag'] = $data['flag'];
		$dataTmp['count'] = $data['count'];
		$dataTmp['subject_id'] = $data['subject_id'];
		return $this->update('exercise_ti_total', 'total', $dataTmp);
	}
	
	
	public function stat_question($data){
		$dataTmp['question_id'] = $data['question_id'];
		$dataTmp['question_do_count'] = $data['question_do_count'];
		$dataTmp['question_wrong_count'] = $data['question_wrong_count'];
		$dataTmp['accord_count'] = $data['accord_count'];
		$dataTmp['subject_id'] = $data['subject_id'];
		$dataTmp['dbtype'] = $data['dbtype'];
		$dataTmp['section_id'] = $data['section_id'];
		return $this->update('question', 'total', $dataTmp);
	}
	
	
	public function stat_question_user($data){
		$dataTmp['question_id'] = $data['question_id'];
		$dataTmp['user_id'] = $data['user_id'];
		$dataTmp['question_do_count'] = $data['question_do_count'];
		$dataTmp['question_wrong_count'] = $data['question_wrong_count'];
		$dataTmp['subject_id'] = $data['subject_id'];
		$dataTmp['dbtype'] = $data['dbtype'];
		$dataTmp['section_id'] = $data['section_id'];
		return $this->update('question_user', 'total', $dataTmp);
	}
	public function stat_knowledge($data){
		$dataTmp['knowledge_id'] = $data['knowledge_id'];
		$dataTmp['difficulty'] = $data['difficulty'];
		$dataTmp['question_type'] = $data['question_type'];
		$dataTmp['question_do_count'] = $data['question_do_count'];
		$dataTmp['question_wrong_count'] = $data['question_wrong_count'];
		$dataTmp['accord_count'] = $data['accord_count'];
		$dataTmp['subject_id'] = $data['subject_id'];
		$dataTmp['dbtype'] = $data['dbtype'];
		$dataTmp['section_id'] = $data['section_id'];
		return $this->update('knowledge', 'total', $dataTmp);
	}
	
	
	public function stat_knowledge_user($data){
		$dataTmp['user_id'] = $data['user_id'];
		$dataTmp['knowledge_id'] = $data['knowledge_id'];
		$dataTmp['difficulty'] = $data['difficulty'];
		$dataTmp['question_type'] = $data['question_type'];
		$dataTmp['question_do_count'] = $data['question_do_count'];
		$dataTmp['question_wrong_count'] = $data['question_wrong_count'];
		$dataTmp['subject_id'] = $data['subject_id'];
		$dataTmp['dbtype'] = $data['dbtype'];
		$dataTmp['section_id'] = $data['section_id'];
		return $this->update('knowledge_user', 'total', $dataTmp);
	}
	
	
	public function stat_zhuanti($data){
		$dataTmp['zhuanti_id'] = $data['zhuanti_id'];
		$dataTmp['difficulty'] = $data['difficulty'];
		$dataTmp['question_type'] = $data['question_type'];
		$dataTmp['subject_id'] = $data['subject_id'];
		$dataTmp['dbtype'] = $data['dbtype'];
		$dataTmp['question_do_count'] = $data['question_do_count'];
		$dataTmp['question_wrong_count'] = $data['question_wrong_count'];
		$dataTmp['accord_count'] = $data['accord_count'];
		$dataTmp['section_id'] = $data['section_id'];
		return $this->update('zhuanti', 'total', $dataTmp);
	}
	
	public function stat_zhuanti_user($data){
		$dataTmp['user_id'] = $data['user_id'];
		$dataTmp['zhuanti_id'] = $data['zhuanti_id'];
		$dataTmp['difficulty'] = $data['difficulty'];
		$dataTmp['question_type'] = $data['question_type'];
		$dataTmp['subject_id'] = $data['subject_id'];
		$dataTmp['dbtype'] = $data['dbtype'];
		$dataTmp['question_do_count'] = $data['question_do_count'];
		$dataTmp['question_wrong_count'] = $data['question_wrong_count'];
		$dataTmp['section_id'] = $data['section_id'];
		return $this->update('zhuanti_user', 'total', $dataTmp);
	}
	
	public function stat_student_subject_day($data){
		$dataTmp['day'] = date('Y-m-d');
		$dataTmp['user_id'] = $data['user_id'];
		$dataTmp['subject_id'] = $data['subject_id'];
		$dataTmp['section_id'] = $data['section_id'];
		$dataTmp['dbtype'] = $data['dbtype'];
		$dataTmp['question_do_count'] = $data['question_do_count'];
		$dataTmp['question_wrong_count'] = $data['question_wrong_count'];
		$dataTmp['section_id'] = $data['section_id'];
		return $this->update('student_subject_day', 'total', $dataTmp);
	}
	
	public function stat_cloud_entity($data){
		$dataTmp['element_id'] = $data['element_id'];
		$dataTmp['action_id'] = $data['action_id'];
		$dataTmp['type_id'] = $data['type_id'];
		$dataTmp['count'] = $data['count'];
		print_r($dataTmp);
		return $this->update('cloud_entity', 'total', $dataTmp);
	}
	
}