<?php
// xiaokun 数据统计接口
//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			$action = $this->r('action');
				if ($this->vr ['pass']) {
					switch ($action){
						case 'teacher_stat_list':
						$pageNo = intval($this->r('pageno')) - 1;
						$countPerPage = $this->r('countperpage');
						$condition = $this->r('condition');
						$this->get_teacher_stat_list($pageNo*$countPerPage,$countPerPage,$condition);
						break;
						case 'student_tests_works_stat':
						$pageNo = intval($this->r('pageno')) - 1;
						$countPerPage = $this->r('countperpage');
						$this->get_student_tests_works_stat($pageNo*$countPerPage,$countPerPage);
						break;
						case 'student_number_stat':
						$pageNo = intval($this->r('pageno')) - 1;
						$countPerPage = $this->r('countperpage');
						$this->get_student_number_stat($pageNo*$countPerPage,$countPerPage);
						break;
						case 'top':
						$this->get_top();
						break;
						case 'student_stat':
						$this->get_student_stat();	
						break;
					}
				}
		}
	
		//POST逻辑
		public function doPOST(){
			$action = $this->r('action');
			if ($this->vr ['pass']) {
				switch ($action){
					case 'add':
					$this->add_ability();
					break;
					case 'modify':
					$this->modify_ability();
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
		 * 教师批改统计
		 * @param  $offset
		 * @param  $step
		 * @param  $condition
		 */
		private function get_teacher_stat_list($offset , $step , $condition){
			$teacherHandler =  new teacher_handler();
			$tables = array('tblUser' , 'tblTeacher' , 'tblSubject','tblClass2Student','tblClass2Teacher','tblStudent','tblStatTeacher');
			$tblStatTeacher =array(
				'stat_teacher',
				'teacher_id as teacher_user_id',
				'class_count',
				'month',
				'year',
				'build_count',
				'big_class_count',
				'small_class_count',
				'work_assign_count',
				'work_pi_count',
				'work_submit_count',
				'stu_big_count',
				'stu_small_count',
				'test_assign_count',
				'test_pi_count',
				'test_submit_count',
				 'center_id' , 'zone_id' 
			);
			
			$tblUser = array(
				'tbluser',
				'id as user_id' , 'username' , 'realname' , 'gender' , 'tel' , 'email' , 'note' , 'reg_time' , 'usr_type'
			);
			
//			$tblTeacher = array(
//				'tblteacher',
//				'id' , 'subject_id' , 'level' , 'center_id' , 'zone_id' , 'level'
//			);
			$tblTeacher = array(
				'tblteacher',
				'id' , 'subject_id' , 'level' , 'level',
			);
			
			$tblSubject = array(
				'edu_subject',
				'Name as subject_name'
			);
			
			
			
			$tblClass2Student = array(
				'tblclass2student',
				'student_id'
			);
			$tblClass2Teacher = array(
				'tblclass2teacher',
				'teacher_id','class_id'
			);
			$tblStudent = array(
					'tblstudent'
			);
			
			
			$queryCondition = array(
				'stat_teacher.teacher_id=tbluser.id',
				'tbluser.id=tblteacher.user_id',
				'tblteacher.subject_id=edu_subject.id'
			);
			
			$queryCondition1 = array(
				'tblclass2student.class_id=tblclass2teacher.class_id',
				'tblclass2student.student_id=tblstudent.id',
				'tblstudent.user_id=tbluser.id'
			);
			
		//制作where条件
			$where ='';
			if($condition){
				$tmpArray = explode('$',$condition);//array('param1^value1','param2^value2');
				$resultArray = array();
				$this->b['v'] = $tmpArray;
				foreach($tmpArray as $cdn1){
					if(strpos($cdn1,'^') !== false){//如果是等于检索
						$cdnArray = explode('^' , $cdn1);//array('param1','value1');
						//查询条件所属表
						foreach($tables as $tableName){
							if(in_array($cdnArray[0] , $$tableName)){
								$tmp_tbl = $$tableName;
								$resultArray[] = $tmp_tbl[0].'.'.$cdnArray[0].'="'.$cdnArray[1].'"';
								break;
							}
						}
						
						
					}else if(strpos($cdn1,'@') !== false){
						$cdnArray = explode('@' , $cdn1);//array('param1','value1');
						//查询条件所属表
						foreach($tables as $tableName){
							if(in_array($cdnArray[0] , $$tableName)){
								$tmp_tbl = $$tableName;
								$resultArray[] = $tmp_tbl[0].'.'.$cdnArray[0].' like "%'.$cdnArray[1].'%"';
								break;
							}
						}
					}
				}
				$where = implode(' AND ',$resultArray);
			}
			if($where != ''){
//				$where = ' WHERE '.$where;
//				$queryCondition['where'] = $where.' AND tblteacher.center_id='.$this->r('center_id').' AND tblteacher.zone_id='.$this->r('zone_id');
				$queryCondition['where'] = $where; //校长统计
//				$where .= ' AND ';
			}
			if($this->r('user_id')){
				$queryCondition['where'] = $where.' AND stat_teacher.teacher_id='.$this->r('user_id').'';
				// 20131126 修改
//				$queryCondition['where'] = $where.' AND tblteacher.center_id='.$this->r('center_id').' AND tblteacher.zone_id='.$this->r('zone_id').' AND stat_teacher.teacher_id='.$this->r('user_id').'';  
			}
//			$where .= 'tbluser.level=4';
			
			if(!$offset && !$step){
//				$limit = '';
			}else{
				$queryCondition['limit'] = $offset.','.$step;
//				$limit = 'LIMIT '.$offset.','.$step;
			}
			
			$queryCondition['order'] = 'stat_teacher.month desc';
			
			$rs = $this->db->withQueryMakerLeft($tblStatTeacher,$tblUser , $tblTeacher , $tblSubject , $queryCondition);
			//
			$teacherList  = $teacherHandler->get_teacher_list(NULL,NULL,$condition);
			
			
			if(count($rs)>0){
				foreach ($rs as $key=>$value){
					$count['count'] = 0;//初始化 0
					$rs[$key]['big_class_current'] = $count;
					$rs[$key]['big_class_pass'] = $count;
					$rs[$key]['small_class_current'] = $count;
					$rs[$key]['small_class_pass'] = $count;
					foreach ($teacherList['list'] as $k=>$v){
						if($value['teacher_user_id']==$v['user_id']){
							$rs[$key]['big_class_current'] = $v['big_class_current'];
							$rs[$key]['big_class_pass'] = $v['big_class_pass'];
							$rs[$key]['small_class_current'] = $v['small_class_current'];
							$rs[$key]['small_class_pass'] = $v['small_class_pass'];
						}
					}
				}
				
			}
			$this->b['list']  = $rs;
			$this->b['count'] = $this->db->withQueryMakerOfNumLeft($tblStatTeacher,$tblUser , $tblTeacher , $tblSubject , $queryCondition);
			return;
		}
	
		/**
		 * 学生测试统计
		 * center_id $zone_id
		 */
		private function get_student_tests_works_stat($offset,$step){
			
			$centerId = $this->r('center_id');
			$zoneId = $this->r('zone_id');
			$table1 = 'relation_student_teacher_view';
			$table2 = 'relation_student_teacher_view_pass';
			if(intval($this->r('fresh'))=='0'){
				$table = $table2;
			}else{
				$table = $table1;
			}
			
			$sql = <<<SQL
					select $table.*,stat_student_view.* from $table 
						left join stat_student_view 
						on $table.student_user_id=stat_student_view.student_id 
						and stat_student_view.teacher_id=$table.teacher_user_id 
						and $table.class_id=stat_student_view.class_id where $table.zone_id='$zoneId' 
						and $table.center_id='$centerId' 
SQL;

			$numSql =  <<<SQL
					select count(*) as num from $table 
						left join stat_student_view 
						on $table.student_user_id=stat_student_view.student_id 
						and stat_student_view.teacher_id=$table.teacher_user_id 
						and $table.class_id=stat_student_view.class_id 
						where $table.zone_id='$zoneId' 
						and $table.center_id='$centerId' 
			
SQL;
			
			
			$classType = $this->r('class_type');
			if($classType){
				$andWhere.=<<<SQL
							and $table.class_type=$classType
SQL;
			}
			$classId = $this->r('class_id');
			if($classId){
				$andWhere.=<<<SQL
							and $table.class_id=$classId  
SQL;
			}
			
			$subjectId = $this->r('subject_id');
			if($subjectId){
				$andWhere.=<<<SQL
									and $table.subject_id=$subjectId 
SQL;
			}
			
			$studentRealname = $this->r('student_realname');
			if($studentRealname){
				$andWhere.=<<<SQL
							and $table.student_realname like "%$studentRealname%"
SQL;
			}
			
			$begTime = $this->r('begin_time');
			if($begTime){
				$andWhere.=<<<SQL
							and unix_timestamp($table.create_date)>=(unix_timestamp("$begTime"))
SQL;
			}
			
			$endTime = $this->r('end_time');
			if($endTime){
				$andWhere.=<<<SQL
							and unix_timestamp($table.create_date)<=(unix_timestamp("$endTime")+86400))
SQL;
			}
			
			$studentUserId = $this->r('student_user_id');
			if($studentUserId){
				$andWhere.= <<<SQL
							and stat_student_view.student_id=$studentUserId
SQL;
			}
			
//			if($this->r('teacher_user_id')){
//				$sql.=' and  relation_student_teacher_view.teacher_user_id='.$this->r('teacher_user_id');
//				$numSql.=' and  relation_student_teacher_view.teacher_user_id='.$this->r('teacher_user_id');
//			}

			$limit = <<<SQL
							LIMIT $offset,$step;
SQL;
			$this->db->sql = $sql.$andWhere.$limit;
			
			if($classId){
				$this->db->Query();
//				print_r($this->db);
//				exit;
				$this->b['list'] = $this->db->rs;
				$this->db->sql= $numSql.$andWhere;
				$this->db->Queryone();
				$rs = $this->db->rs;
//				$this->b['sql'] = $this->db->sql;
				$this->b['count'] = $rs['num'];
				return;
			}else{
				$this->b['list'] = '';
				$this->b['count'] = 0;
			}
			
			
		}
		
		
		
		/**
		 * 学生数量统计
		 */
		public function get_student_number_stat($offset,$step){
			$order = '';
			if($this->r('time')=='day'){
				if($this->r('zone_id')){
					$sql = 'select * from stat_zone_day  where zone_id='.$this->r('zone_id');
				}else{
					$sql = 'select *  from stat_center_day ';
				}
				$order = 'order by  stat_zone_day.day desc';
				
			}else if($this->r('time')=='month'){
				if($this->r('zone_id')){
					$sql = 'select * from stat_zone_month where zone_id='.$this->r('zone_id');
				}else{
					$sql = 'select * from stat_center_month ';
				}
				
				$order = 'order by  year desc ,month desc';
			}else if($this->r('time')=='period'){
					$sqlCenter = 'SELECT tblcenterzone.id as zone_id,tblcenterzone.center_id,tblcenterzone.zone_name
							FROM tblcenterzone LEFT JOIN tblcenterzoneadmin ON tblcenterzone.id=tblcenterzoneadmin.zone_id 
							LEFT JOIN tbluser ON tblcenterzoneadmin.user_id=tbluser.id LEFT JOIN area_province ON tblcenterzone.province_id=area_province.id 
							LEFT JOIN area_city ON tblcenterzone.city_id=area_city.id 
							LEFT JOIN tblteacher ON tblteacher.user_id=tbluser.id 
							WHERE  (tblteacher.level is null OR tblteacher.level=2)';
					if($this->r('center_id')){
						$sqlCenter.= ' AND tblcenterzone.center_id='.$this->r('center_id');
					}
					if($this->r('zone_id')){
						$sqlCenter.= ' AND tblcenterzone.id='.$this->r('zone_id');
					}
					$this->db->sql = $sqlCenter;
					$this->db->Query();
					$rs = $this->db->rs;
					foreach ($rs as $key=>$value){
						$sql = 'select  sum(stu_total_count) AS stu_total_count,
									sum(stu_big_count) as stu_big_count,
									sum(stu_small_count) as stu_small_count,
									sum(stu_new_big_count) as stu_new_big_count,
									sum(stu_new_small_count) as stu_new_small_count,
									sum(stu_lost_count) as stu_lost_count,
									sum(stu_lost_big_count) as stu_lost_big_count,
									sum(stu_lost_small_count) as stu_lost_small_count from stat_zone_day ';
						$where = ' where zone_id='.$value['zone_id'];
						if($this->r('begin_time')){
							$sql=$sql.$where.' and  unix_timestamp(day)>=unix_timestamp("'.$this->r('begin_time').'")';
						}
						else if($this->r('end_time')){
							$sql=$sql.$where.' and  unix_timestamp(day)<=unix_timestamp("'.$this->r('end_time').'")';
						}else if($this->r('begin_time')&&$this->r('end_time')){
							$sql=$sql.$where.'  and unix_timestamp(day)>=unix_timestamp("'.$this->r('begin_time').'") and unix_timestamp(day)<=unix_timestamp("'.$this->r('end_time').'")';
						}
//						echo $sql;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$rsStat = $this->db->rs;
						$rs[$key]['stat'] = $rsStat;
					}
					$this->b['count'] = count($rs);
					$this->b['list'] = array_slice($rs, $offset,$step);
					return;
			}
			
			$limit= ' limit '.$offset.','.$step;
			$this->db->sql = $sql.' '.$order.' ' .$limit;
//			echo $this->db->sql;
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
//			echo '<pre>';
//			print_r($this->db);
//			exit;
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['count'] = count($this->db->rs);
		}
		
		//派送统计排行榜
		public function get_top(){
			$sqlAssign = 'select stat_teacher.teacher_id,tbluser.realname,tblcenterzone.zone_name,(stat_teacher.work_assign_count+stat_teacher.test_assign_count) as assign_count from stat_teacher 
										left join tbluser on tbluser.id=stat_teacher.teacher_id 
										left join tblteacher on tbluser.id=tblteacher.user_id
                                       left join tblcenterzoneadmin on tblcenterzoneadmin.user_id=tbluser.id
                                       	left join tblcenterzone on tblcenterzone.id=tblcenterzoneadmin.zone_id';
			if($this->r('center_id')){
				$sqlAssign.=' where stat_teacher.center_id='.$this->r('center_id').' and tblteacher.level=4';
			}
			if($this->r('zone_id')){
				$sqlAssign.=' and stat_teacher.zone_id='.$this->r('zone_id').' and tblcenterzoneadmin.zone_id='.$this->r('zone_id');;
			}
			
			
			$sqlAssign.= ' group by stat_teacher.teacher_id,stat_teacher.center_id,stat_teacher.zone_id
								ORDER by (stat_teacher.work_assign_count+stat_teacher.test_assign_count)  desc limit 0,10  ;';
			$this->db->sql = $sqlAssign;
			$this->b['assign_top_list_sql'] = $this->db->sql;
			$this->db->Query();
			$rsTopAssign = $this->db->rs;
			$this->b['assign_top_list'] = $rsTopAssign;//教师派送排行榜
			
			$sqlstu = 'select tbluser.realname,tblcenterzone.zone_name,tblcenterzone.id,sum(stat_zone_month.stu_new_big_count+stat_zone_month.stu_new_small_count) as stu_new_count 
							from stat_zone_month 
							left join tblcenterzone on tblcenterzone.id=stat_zone_month.zone_id 
							left join tblcenterzoneadmin on stat_zone_month.zone_id=tblcenterzoneadmin.zone_id 
							left join tbluser on tbluser.id=tblcenterzoneadmin.user_id 
							left join tblteacher on tbluser.id=tblteacher.user_id';
			if($this->r('center_id')){
				$sqlstu.=' where tblcenterzone.center_id='.$this->r('center_id').' and tblteacher.level=2';
			}
			$sqlstu.=' group by tblcenterzone.id order by (stat_zone_month.stu_new_big_count+stat_zone_month.stu_new_small_count) desc limit 0,10;';
			$this->db->sql = $sqlstu;
			$this->db->Query();
			$this->b['stu_top_list'] = $this->db->rs;//校区招生排行榜
//			$this->b['stu_top_list_sql'] = $this->db->sql;//校区招生排行榜
			$this->b['sc']  =200;
			
			
			$sqlBuild = 'select stat_teacher.teacher_id,tbluser.realname,tblcenterzone.zone_name,build_count from stat_teacher 
										left join tbluser on tbluser.id=stat_teacher.teacher_id 
										left join tblteacher on tbluser.id=tblteacher.user_id
                                       left join tblcenterzoneadmin on tblcenterzoneadmin.user_id=tbluser.id
                                       	left join tblcenterzone on tblcenterzone.id=tblcenterzoneadmin.zone_id';
			if($this->r('center_id')){
				$sqlBuild.=' where stat_teacher.center_id='.$this->r('center_id').' and tblteacher.level=4';
			}
			if($this->r('zone_id')){
				$sqlBuild.=' and stat_teacher.zone_id='.$this->r('zone_id').' and tblcenterzoneadmin.zone_id='.$this->r('zone_id');
			}
			
			$sqlBuild.= ' group by stat_teacher.teacher_id,stat_teacher.center_id,stat_teacher.zone_id
								ORDER by build_count  desc limit 0,10 ;';
			$this->db->sql = $sqlBuild;
			$this->db->Query();
			$rsBuild = $this->db->rs;
			
//			echo '<pre>';
//			print_r($this->db);
//			exit;
			
			$this->b['build_top_list'] = $rsBuild;//教师组卷排行榜   
			
			$sqlZone = 'select tbluser.realname,tblcenterzone.zone_name,tblcenterzone.create_date from tblcenterzone 
                            left join tblcenterzoneadmin on tblcenterzone.id=tblcenterzoneadmin.zone_id
                            left join tbluser on tbluser.id=tblcenterzoneadmin.user_id
                            left join tblteacher on tbluser.id=tblteacher.user_id where tblcenterzone.center_id='.$this->r('center_id').' and tblteacher.level=2  order by create_date desc limit 0,10';
			$this->db->sql = $sqlZone;
			$this->db->Query();
			$rsZone = $this->db->rs;
			$this->b['new_zone_list'] = $rsZone;//新建校区
			
			//查询到新创建的老师，跨校区加入的老师 没有显示
			$sqlTeacher = 'select tbluser.realname,tblcenterzone.zone_name,tblteacher.creator_date from tblteacher 
									left join tbluser on tbluser.id=tblteacher.user_id
									left join tblcenterzone on tblteacher.center_id=tblcenterzone.center_id and tblteacher.zone_id=tblcenterzone.id
									where tblteacher.level=4 and tblteacher.center_id='.$this->r('center_id').' order by creator_date desc limit 0,10;';
			$this->db->sql = $sqlTeacher;
			$this->db->Query();
			$rsTeacher = $this->db->rs;
			$this->b['new_teacher_list'] =$rsTeacher;//新加入教师
			
			
			$sqlStudent = 'select tbluser.realname,tblcenterzone.zone_name,tblstudent.creator_date from tblstudent 
									left join tbluser on tbluser.id=tblstudent.user_id
									left join tblcenterzone on tblstudent.center_id=tblcenterzone.center_id and tblstudent.zone_id=tblcenterzone.id
									where tblstudent.center_id='.$this->r('center_id').' order by creator_date desc limit 0,10;';
			$this->db->sql = $sqlStudent;
			$this->db->Query();
			$rsStudent = $this->db->rs;
			$this->b['new_stu_list'] =$rsStudent;// 新加入学生
			
		}
		
		//获取某个学生具体来往
		public function get_student_stat(){
			$sql = 'select sum(work_total_count) as work_total_count,sum(work_submit_count) as work_submit_count,sum(test_total_count) as test_total_count,sum(test_submit_count) as test_submit_count from stat_student_day where student_id='.$this->r('student_user_id').' and teacher_id='.$this->r('teacher_user_id').' and class_id='.$this->r('class_id');
			$this->db->sql = $sql;
			$this->b['sql'] = $this->db->sql;
			$this->db->Queryone();
			$this->b['student_stat'] = $this->db->rs;
		}
		
	}
	


?>