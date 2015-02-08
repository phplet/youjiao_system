<?php
///////////////////////////////////////////////////////
// 定时统计接口
// by xiaokun v1.0
///////////////////////////////////////////////////////
	//rest接口
require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			$action = $this->r('action');
			switch ($action){
				case 'stat_month_data':
				$this->stat_month_data();
				break;
				
				case '':
					
				break;
			}
		}
		//POST逻辑
		public function doPOST(){
			$this -> b["sc"] = 405;
		}
		//PUT逻辑
		public function doPUT(){
			$this -> active();
		}
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		public function stat_month_data(){
			$studentHandler = new student_handler();
			$centerZoneHandler = new center_zone_handler();
			$statHandler = new stat_handler();
			
			
			//更新学生：stat_student_month 
			$sqlDelete = 'delete from stat_student_month;';//如果存在数据删除
			$this->db->sql = $sqlDelete;
			$this->db->ExecuteSql();
			$rsDelete = $this->db->rs;
			$studentHandler->stat_student_month();
			//更新stat_zone_day                  stu_total_count(在校学生数)  stu_big_count（大班学生数）stu_small_count(小班学生数)
			
			
			$rsCenterZone = $centerZoneHandler->get_center_zone_student_num();
			if(count($rsCenterZone)>0){
					$statField = 'stu_total_num';
					$centerNum = $rsCenterZone['center_num'];
					$zoneNum = $rsCenterZone['zone_num'];
					foreach ($centerNum as $key =>$value){
						$centerInfo['center_id'] = $value['id'];
						$num = $value['num'];
						$statHandler->stat_zone_center($centerInfo, $statField,true,$num);//定时统计center zone 下面的人数
						$studentHandler->stat_student_count($centerInfo);//定时统计center zone stu_big_count 人次数
					}
					foreach ($zoneNum as $key =>$value){
						$zoneInfo['zone_id'] = $value['id'];
						$num = $value['num'];
						$statHandler->stat_zone_center($zoneInfo, $statField,true,$num);//定时统计center zone 下面的人数
						$studentHandler->stat_student_count($zoneInfo);//定时统计center zone stu_big_count 人次数
					}
			}
			$centerZoneHandler->stat_center_zone_month('zone');
			$centerZoneHandler->stat_center_zone_month('center');
		}

		public function add_expired_class_student_history(){
			
		}
	}
	


?>