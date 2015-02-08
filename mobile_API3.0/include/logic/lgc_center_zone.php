<?php
/**
 * 
 * @author XK
 *
 */
class center_zone_handler {
	public function __construct(){
		$this->db = db_handler::getInstance();
	}
	public function get_center_max_info($centerId){
			$studentHandler = new student_handler();
			$teacherHandler = new teacher_handler();
			$centerZoneHandler = new center_zone_handler();
			$this->db->sql = <<<SQL
										select zone_max_count,teacher_max_count,student_max_count,type from tblcenter where id=$centerId 
SQL;
			$this->db->Queryone();
			$result['center_max_info'] =$this->db->rs; 
			
			$zoneCount = $studentHandler->get_zone_count($centerId);
			
			$result['center_zone_count'] = $zoneCount;
			
			$teacherCount = $teacherHandler->get_teacher_count($centerId);
			$result['center_teacher_count'] = $teacherCount;
			
			$studentCount = $studentHandler->get_student_count($centerId);
			$result['center_student_count'] = $studentCount;
			
			$zoneInfo =$centerZoneHandler->get_zone_info($centerId);

			if(count($zoneInfo)>0){
				foreach ($zoneInfo as $key=>$value){
					$zoneId = $value['id'];
					$zoneStudentCount = $centerZoneHandler->get_zone_student_num($zoneId);
					$zoneTeacherCount = $centerZoneHandler->get_center_zone_teacher_num($zoneId);
					$zoneInfo[$key]['student_current_count'] = $zoneStudentCount;
					$zoneInfo[$key]['teacher_current_count'] = $zoneTeacherCount;
				}
			}
			$result['zone_info'] = $zoneInfo;
			return $result;
		}
		
	public function get_zone_max_info($zoneId){
		$this->db->sql = <<<SQL
										select teacher_max_count,student_max_count from tblcenterzone where id=$zoneId 
SQL;
		$this->db->Queryone();
		return $this->db->rs;
	}
		
	public function beyond_allow_batch_users_count($userInfo,$centerId,$zoneId,$userType){
		
		$userCount = count($userInfo);
		$centerMaxInfo = $this->get_center_max_info($centerId);
		$type = $centerMaxInfo['center_max_info']['type'];
		
		if($type==1){
			
			if($centerMaxInfo['center_max_info']['student_max_count']){//设置max_count 则计算
				$studentCount = $userCount+$centerMaxInfo['center_student_count']-$centerMaxInfo['center_max_info']['student_max_count'];
			}
			
			if($centerMaxInfo['center_max_info']['teacher_max_count']){
				$teacherCount = $userCount+$centerMaxInfo['center_teacher_count']-$centerMaxInfo['center_max_info']['teacher_max_count'];
			}
			
		}else if($type==2){
			$zoneMaxInfo = $this->get_zone_max_info($zoneId);
			$zoneTeacherCount = $this->get_center_zone_teacher_num($zoneId);
			$zoneStudentCount = $this->get_zone_student_num($zoneId);
			
			if($zoneMaxInfo['teacher_max_count']){
				$teacherCount = $userCount+$zoneTeacherCount-$zoneMaxInfo['teacher_max_count'];
			}
			
			if($zoneMaxInfo['student_max_count']){
				$studentCount = $userCount+$zoneStudentCount-$zoneMaxInfo['student_max_count'];
			}
			
		}
		$result['database'] = $centerMaxInfo;
		$result['upload_count'] = $userCount;
		if(($userType=='1')&&($studentCount>0)){
			$result['beyond_count'] = $studentCount;
			return $result;
		}
		else if(($userType=='2')&&($teacherCount>0)){
			$result['beyond_count'] = $teacherCount;
			return $result;
		}else{
			return false;
		}
		
	}
	
	
	/**
	 * 
	 * @param  $table 
	 */
	public function get_student_num($table){
		$this->db->sql = <<<SQL
									 select id  from $table;
SQL;
		$this->db->Query();
		$rs = $this->db->rs;
		$field = $table=='tblcenterzone'?'zone_id':'center_id';
		if(count($rs)>0){
			foreach ($rs as $key=>$value){
				$id = $value['id'];
				$this->db->sql = <<<SQL
				 select count(distinct student_id) as num from tblclass2student
				 left join tblstudent on tblstudent.id=tblclass2student.student_id
				 left join tblclass on tblclass.id=tblclass2student.class_id
				 where tblclass.$field=$id;
SQL;
				$this->db->Queryone();
				$num = $this->db->rs['num'];
				$rs[$key]['num'] = $num;
			}
		}
		return $rs;
	}
	
	
	public function get_center_zone_student_num(){
		$centerTable = 'tblcenter';
		$zoneTable = 'tblcenterzone';
		$centerRs = $this->get_student_num($centerTable);
		$zoneRs = $this->get_student_num($zoneTable);
		$rs['center_num'] = $centerRs;
		$rs['zone_num'] = $zoneRs;
		return $rs;
	}
	
	
		public function get_center_zone_teacher_num($zoneId){
			$this->db->sql = <<<SQL
										select count(*) as num  from tblcenterzoneadmin
										left join tblteacher on tblteacher.user_id=tblcenterzoneadmin.user_id
										 where tblcenterzoneadmin.zone_id=$zoneId and (tblteacher.level=4 or  tblteacher.level=5) ;
SQL;
			$this->db->Queryone();
//			echo '<pre>';
//			print_r($this->db);
//			exit;
			return $this->db->rs['num'];
		}
	
	public function get_zone_student_num($zoneId){
		$this->db->sql = <<<SQL
				 select count(distinct student_id) as num from tblclass2student
				 left join tblstudent on tblstudent.id=tblclass2student.student_id
				 left join tblclass on tblclass.id=tblclass2student.class_id
				 where tblclass.zone_id=$zoneId;
SQL;
//echo $this->db->sql;
//exit;
				$this->db->Queryone();
				$num = $this->db->rs['num'];
				return $num;
	}
	
	/**
	 * 
	 */
	public function stat_center_zone_month($where){
			$field = $where=='zone'? 'zone_id':'center_id';
			$table1 = $where=='zone'?'stat_zone_month':'stat_center_month';
			$table2 = $where=='zone'?'stat_zone_day':'stat_center_day';
			$this->db->sql = <<<SQL
				delete from $table1;
SQL;
			$this->db->ExecuteSql();
			$this->db->sql = <<<SQL
			insert into $table1(
								$field,year,month,
								stu_total_count,
								stu_new_big_count,
								stu_new_small_count,
								stu_big_count,
								stu_small_count,
								class_new_count,
								class_total_count,
								class_lost_count,
								stu_lost_count,
								stu_lost_big_count,
								stu_lost_small_count,
								class_big_count,
								class_small_count,
								stu_total_num,
								stu_lost_num,
								stu_new_num
								)                
								select $field,year(day),month(day),
								sum(stu_new_big_count)+sum(stu_new_small_count)-(sum(stu_lost_big_count)+sum(stu_lost_small_count)) as stu_total_count ,
								sum(stu_new_big_count) as stu_new_big_count,
								sum(stu_new_small_count) as stu_new_small_count,
								sum(stu_new_big_count)-sum(stu_lost_big_count) as stu_big_count,
								sum(stu_new_small_count)-sum(stu_lost_small_count) as stu_small_count,
								sum(class_new_count) as class_new_count,
								sum(class_new_count)-sum(class_lost_count) as class_total_count,
								sum(class_lost_count) as class_lost_count,
								sum(stu_lost_count) as stu_lost_count,
								sum(stu_lost_big_count) as stu_lost_big_count,
								sum(stu_lost_small_count) as stu_lost_small_count,
								sum(class_big_count) as class_big_count,
								sum(class_small_count) as class_small_count,
								max(stu_total_num) as stu_total_num,
								sum(stu_lost_num) as  stu_lost_num,
								sum(stu_new_num) as stu_new_num
								from $table2 group by year(day),month(day),$field;
SQL;
		$this->db->ExecuteSql();
		return $this->db->rs;
	}
	
	public function get_zone_info($centerId){
		$this->db->sql = <<<SQL
								select * from tblcenterzone where center_id='$centerId';
SQL;
		$this->db->Query();
		return $this->db->rs;
	}
	
	
	public function get_zone_detail($zoneId){
		$this->db->sql = <<<SQL
								select * from tblcenterzone where id='$zoneId';
SQL;
		$this->db->Queryone();
		return $this->db->rs;
	}
}	