<?php
class exercise_handler {
	public function __construct() {
		$this->db = db_handler::getInstance ();
	}
	
	public function post_add_exercise_result($userId, $data) {
		global $exerciseInitSettingPath;
		$filename = $exerciseInitSettingPath . $userId . '.json';
		if(file_exists($filename)){
			$initSetting = json_decode(file_get_contents($filename),true);
			
			if(is_array($initSetting['content'][$initSetting['newest']][$data ['subject_id']])){
				
				$studyExerciseId = intval($initSetting['content'][$initSetting['newest']][$data ['subject_id']]['study_exercise_id']);
				
			}
		}
		$dataTmp ['user_id'] = $userId;
		$dataTmp ['log_time'] = 'current_timestamp()';
		$dataTmp ['exercise_id'] = $data ['exercise_id'];
		$dataTmp ['duration'] = $data ['duration'];
		$dataTmp ['my_score'] = $data ['my_score'];
		$dataTmp ['type'] = $data ['type'];
		$dataTmp ['exam_type'] = $data ['exam_type'];
		$dataTmp ['subject_id'] = $data ['subject_id'];
		$dataTmp ['create_date'] = 'current_timestamp()';
		$dataTmp ['content'] = base64_encode ( json_encode ( $data ['content'] ) );
		
		/**
		 * 
		 * 
		 */
		if(!isset($studyExerciseId)||$studyExerciseId=='0'){ //如果初始化文件中不存在作业ID，插入新记录 
			$this->db->Insert('study_exercise', $dataTmp );
			$studyExerciseId = $this->db->Last_id();
			
//				echo 'insert :'.$studyExerciseId;
		}else{//反之更新
			$this->db->Update('study_exerciswe', $dataTmp,'id='.$studyExerciseId);
			$studyExerciseId = $studyExerciseId;
//			echo 'update :'.$studyExerciseId;
		}
		
	
//		exit;
		return $studyExerciseId;
	}
	
	/**
	 * 更新initSetting 
	 * @param  $studyExerciseId
	 */
	public function update_init_setting($studyExerciseId,$subjectId,$userId){
		global $exerciseInitSettingPath;
//		$studyExerciseId = '726';
		
		$filename = $exerciseInitSettingPath . $userId . '.json';
		$jsonInitSetting = $this->get_init_setting($userId);
		if($jsonInitSetting){
			$initSetting = json_decode($jsonInitSetting,true);
			foreach ($initSetting['content'] as $key=>$value){
				if($value[$subjectId]['study_exercise_id']==$studyExerciseId){
					$initSetting['content'][$key][$subjectId] = array();
					$initSetting['newest'] = 0;
				}
			}
			return file_put_contents($filename, json_encode($initSetting));
		}
	}
	public function post_add_exercise_count($data){
		$statHandler  = new stat_handler();
		return $statHandler->stat_exercise($data);
	}
	
	public function post_add_teach_self($userId, $data) {
		global $DBCFG;
		$this->db->switchDB($DBCFG['default_local']['dbhost'], $DBCFG['default_local']['dbname'] ,$DBCFG['default_local']['dbuser'] , $DBCFG['default_local']['dbpasswd']);
		$dataTmp ['user_id'] = $userId;
		$dataTmp ['exam_id'] = $data ['exam_id'];
		$dataTmp ['name'] = $data ['name'];
		$dataTmp ['exam_type'] = $data ['exam_type'];
		$dataTmp ['subject_id'] = $data ['subject_id'];
		$dataTmp ['grade'] = $data ['grade_id'];
		$dataTmp ['content'] = $data ['exam_content'];
		$dataTmp ['score'] = $data ['score'];
		$dataTmp ['difficulty'] = $data ['difficulty'];
		$dataTmp ['create_date'] = 'now()';
		$table = 'teach_self_list';
		 $this->db->Insert ( $table, $dataTmp );
		 return $this->db->Last_id();
	}
	
	/*
             * 初始化设置添加日志记录
             */
	public function post_add_init_setting($userId, $data) {
		global $exerciseInitSettingPath;
		$initSetting = array ();
		$initSetting ['exam_type'] = $data ['exam_type']; //1:作业/测试，2:专题，3：真题,:4名校,  5同步
		$initSetting ['study_exercise_id'] = $data ['study_exercise_id'];
		$initSetting ['type'] = $data ['type']; //1:新作业，2：已提交：3已批阅,4:正在做
		$initSetting ['subject_id'] = $data ['subject_id'];
		$initSetting ['grade_id'] = $data ['grade_id'];
		$initSetting ['section_id'] = $data ['section_id'];
		$initSetting ['exam_name'] = $data ['exam_name'];
		$initSetting ['history_content'] = $data ['history_content'];
		$initSetting ['position'] = $data ['position'];
		$initSetting ['exam_content'] = $data ['exam_content'];
		$initSetting ['create_date'] = date ( 'Y-m-d H:i:s', time () );
		$initSetting['self_exercise_id'] = $data['self_exercise_id'];//自主学习ID
		if ($initSetting ['exam_type'] == '3') {
			$initSetting ['exam_id'] = $data ['exercise_id'];
			$initSetting ['province_id'] = $data ['province_id'];
			$initSetting ['year'] = $data ['year'];
		} else if ($initSetting ['exam_type'] == '2') {
			$initSetting ['exam_id'] = $data ['exercise_id'];
			$initSetting ['type'] = $data ['type'];
			$initSetting ['difficulty'] = $data ['difficulty'];
			$initSetting ['count'] = $data ['count'];
		} else if ($initSetting ['exam_type'] == '4') {
			$initSetting ['exam_id'] = $data ['exercise_id'];
			$initSetting ['province_id'] = $data ['province_id'];
			$initSetting ['year'] = $data ['year'];
		} else if ($initSetting ['exam_type'] == '5') {
			$initSetting ['publisher_id'] = $data ['publisher_id'];
			$initSetting ['book_id'] = $data ['book_id'];
			$initSetting ['unit_id'] = $data ['unit_id'];
			$initSetting ['chapter_id'] = $data ['chapter_id'];
		
		} else if ($initSetting ['exam_type'] == '1') {
			
			
		}else if($initSetting ['exam_type'] == '6'){
			$initSetting ['exam_id'] = $data ['exercise_id'];
			$initSetting ['type'] = $data ['type'];
			$initSetting ['difficulty'] = $data ['difficulty'];
			$initSetting ['count'] = $data ['count'];
		}
		else if($initSetting ['exam_type'] == '7'){
			$initSetting ['exam_id'] = $data ['exercise_id'];
			$initSetting ['type'] = $data ['type'];
			$initSetting ['difficulty'] = $data ['difficulty'];
			$initSetting ['count'] = $data ['count'];
		}else if($initSetting ['exam_type'] == '9'){
			
			$initSetting ['exam_id'] = $data ['exercise_id'];
			$initSetting ['type'] = $data ['type'];
			$initSetting ['difficulty'] = $data ['difficulty'];
			$initSetting ['count'] = $data ['count'];
		}
		
		
		$jsonInitSetting = $this->get_init_setting($userId);
		
		if($jsonInitSetting){
			$arrExercise = json_decode($jsonInitSetting,true);
		}else{
			$arrExercise = utils_handler::create_exercise_array();
		}
		
		
		if(count($arrExercise)>0){
			foreach ($arrExercise['content'] as $key=>$value){
				if($key==$initSetting ['exam_type']){
					$arrExercise['content'][$key][$initSetting ['subject_id']] = $initSetting;
				}
			}
		}
		$arrExercise['newest'] = $initSetting ['exam_type'];
		$filename = $exerciseInitSettingPath . $userId . '.json';
		
		return file_put_contents ( $filename, json_encode ( $arrExercise ) );
	}
	
	/**
	 * 获取用户初始化条件
	 */
	public function get_init_setting($userId) {
		global $exerciseInitSettingPath;
		$filename = $exerciseInitSettingPath . $userId . '.json';
		return file_get_contents ( $filename );
	}
	
	
	/**
	 * 
	 * @param  $id
	 */
	public function get_exercise_info($id){
		$this->db->sql = <<<SQL
									select * from study_exercise where id=$id;
SQL;
		$this->db->Queryone();
		return $this->db->rs;
	}
	
	public function get_history($userId,$examId,$examType) {
		global $exerciseHistoryPath;
		$fpath = $exerciseHistoryPath . $userId . '/' . $examType;
		$path = utils_handler::cmk ( $fpath );
		$filename = $path . '/' . $examId . '.json';
		if(file_exists($filename)){
			$tmp = file_get_contents ( $filename );
		}else{
			$tmp = 0;
		}
		return $tmp;
	}
	
	public function post_add_history($userId, $data, $dbtype) {
		global $exerciseHistoryPath;
		$fpath = $exerciseHistoryPath . $userId . '/' . $data ['exam_type'];
		$path = utils_handler::cmk ( $fpath );
		$arrData = json_decode ( $data ['content'], true );
		$position = $data ['position']?$data ['position']:'0';
		$studyExerciseId = $data['study_exercise_id']?$data['study_exercise_id']:'0';
		$filename = $path . '/' . $data ['exercise_id'] . '.json';
		if ($path) {
			$tmp = file_get_contents ( $filename );
			if ($tmp) {
				$arrTmp = json_decode ( $tmp, true );
				foreach ( $arrTmp as $key => $value ) {
					foreach ( $arrData as $k => $v ) {
						foreach ( $v ['ids'] as $k1 => $v1 ) {
							if ($value ['dbtype'] == $dbtype) {
								$arrTmp[$key]['position'] = $position;//更新最后一次的位置index
								$arrTmp[$key]['study_exercise_id'] = $studyExerciseId;//更新作业ID
								//查询$v1 是否在 $arrTmp [$key] ['ids'] 如果不在
								//@todo 过滤操作如果存在，则不进入
								if(!(utils_handler::array_value_exists($v1, $arrTmp [$key] ['ids']))){
									array_push ( $arrTmp [$key] ['ids'], $v1 );
								}
							}
						}
						
					}
				}
			} else {
				
				foreach ($arrData as $key=>$value){
					if($value ['dbtype'] == $dbtype){
						$arrData[$key]['position'] = $position;//保存最后一次的位置index
						$arrData[$key]['study_exercise_id'] = $studyExerciseId;//保存作业ID
					}
				}
				
				$arrTmp = $arrData;
		
			}
			return file_put_contents ( $filename, json_encode ( $arrTmp ) );
		
		} else {
			return false;
		}
	}
	
	public function post_remove_history($userId, $data, $dbtype){
		global $exerciseHistoryPath;
		$fpath = $exerciseHistoryPath . $userId . '/' . $data ['exam_type'];
		$filename = $fpath . '/' . $data ['exercise_id'] . '.json';
		if(file_exists($filename)){
			@unlink($filename);
			return true;
		}else{
			return false;
		}
	}
	
	public function post_update_history($userId, $data, $dbtype){
		global $exerciseHistoryPath;
		$fpath = $exerciseHistoryPath . $userId . '/' . $data ['exam_type'];
		$filename = $fpath . '/' . $data ['exercise_id'] . '.json';
		if(file_exists($filename)){
			$historyStr = file_get_contents($filename);
			$history = json_decode($historyStr,true);
			if(count($history)>0){
				foreach ($history as $key=>$value){
					if(isset($value['study_exercise_id'])){
						$history[$key]['study_exercise_id'] = 0;
					}
				}
				file_put_contents($filename, json_encode($history));
			}
			return true;
		}else{
			return false;
		}
	}
	
	/**
	 * 解析exerciseHistory 文件返回数组
	 * @param  $userId
	 * @param  $data
	 */
	public function analytic_exercise2whereArr($userId,$data){
		global $exerciseHistoryPath;
		$fpath = $exerciseHistoryPath . $userId . '/' . $data ['exam_type'];
		$filename = $fpath . '/' . $data ['exercise_id'] . '.json';
		$arrExerciseHistory = json_decode(file_get_contents($filename),true);
		$where  = '';
		if(count($arrExerciseHistory)>0){
			foreach ($arrExerciseHistory as $key=>$value){
				if(isset($value['dbtype'])&&isset($value['ids'])){
					$where ='"'.implode('","', $value['ids']).'"';
					$arrExerciseHistory[$key]['ids'] = $where;
				}
			}
		}
		return $arrExerciseHistory;
	}
	public function get_query_zhuanti_question($subject_id, $zhuanti_id, $question_type, $question_difficulty, $question_count, $dbtype) {
		global $DBCFG;
		$eduInfo = utils_handler::get_edu_info ( $subject_id );
		$zhuantiTable = $eduInfo ['edu_zhuanti'];
		$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		$this->db->sql = 'SELECT name, knowledge_list FROM ' . $zhuantiTable . ' WHERE id=' . $zhuanti_id;
		$this->db->Queryone ();
		$knowledgeList = $this->db->rs ['knowledge_list'];
		$zhuantiName = $this->db->rs ['name'];
		$zhuantiId = $zhuanti_id;
		$knowledgeList = implode ( '","', explode ( ';', $knowledgeList ) );
		$tableName1 = $eduInfo ['exam_question'];
		$tableName2 = $eduInfo ['exam_question_index'];
		$sql = <<<SQL
                                                SELECT * ,a.dbtype FROM $tableName2
                                                LEFT JOIN $tableName1 ON $tableName2.gid=$tableName1 .gid
                                                 join (select 1 as dbtype) a on 1=1
                                                WHERE $tableName2.zh_knowledge in ("$knowledgeList")
                                                
SQL;
		if ($question_type) {
			$sql .= ' AND ' . $tableName2 . '.objective_flag=' . ($question_type % 2);
		}
		
		if ($question_difficulty) {
			$sql .= ' AND ' . $tableName2 . '.difficulty=' . $question_difficulty;
		}
		
		$sql .= ' ORDER BY rand() LIMIT 0,' . $question_count;
		mysql_query ( 'set names utf8' ); //
		$this->db->sql = $sql;
		$this->db->Query ();
		$rs = $this->db->rs;
//		echo '<pre>';
//		print_r($this->db);
//		exit;
		$contentTmp ['ids'] = array ();
		$contentTmp ['dbtype'] = $dbtype;
		foreach ( $rs as $key => $value ) {
			array_push ( $contentTmp ['ids'], $value ['gid'] );
		}
		$contentTmp ['dbtype'] = $dbtype;
		if ($dbtype == '1') {
			$contentTmpOther ['dbtype'] = '2';
		} else if ($dbtype == '2') {
			$contentTmpOther ['dbtype'] = '1';
		}
		$content ['0'] = $contentTmp;
		$content ['1'] = $contentTmpOther;
		$result ['list'] = $rs;
		$result ['exercise_info'] ['id'] = $zhuantiId;
		$result ['exercise_info'] ['name'] = $zhuantiName;
		$result ['exercise_info'] ['content'] = json_encode ( $content );
		return $result;
	}
	
	
	
	public function get_query_zhuanti_name($zhuanti_id,$subject_id){
		global $DBCFG;
		$eduInfo = utils_handler::get_edu_info ( $subject_id );
		$zhuantiTable = $eduInfo ['edu_zhuanti'];
		$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		$this->db->sql = 'SELECT name FROM ' . $zhuantiTable . ' WHERE id=' . $zhuanti_id;
		$this->db->Queryone ();
		return $this->db->rs['name'];
	}
	/**
	 * 同步
	 */
	public function get_query_sync_question($subject_id, $chapter_id, $dbtype){
			global $DBCFG;
			$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
			$eduInfo = utils_handler::get_edu_info ( $subject_id );
			$tblEaxmIndex = $eduInfo['exam_question_index'];
			$tblEaxm = $eduInfo['exam_question'];
			$chatperSql = 'select content from '.$eduInfo[ 'edu_chapter'];
 			$chapterArr = $chapter_id;
             $chatperSql = 'select id,chapter_name from '.$eduInfo[ 'edu_chapter'];
             
      		 if($chapter_id){
                      $where = ' WHERE id ='.$chapter_id. '';
                }
               if($where!= ''){
                     $chatperSql = $chatperSql.$where;
                }
                
                
             	$this-> db-> sql = $chatperSql;
              	 mysql_query( 'set names utf8');
                 $this-> db->Query();
                 $chapterRs = $this->db ->rs ;
                 $chapterName = $chapterRs[0]['chapter_name'];
                 
                 $tblIdArr = array ();
                 $tblQuestionIdArr = array ();
                  foreach ($chapterRs as $key=>$value){
                     $content = $value['id' ];
                     $contentArr = explode(',' , $content);
                     foreach ($contentArr as $v){
                          $tblIdArr[] = $v;
                         }
                   }
			
			$sql =<<<SQL
			select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,$tblEaxm.image,edu_question_type.type_name
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
			LEFT JOIN edu_question_type on edu_question_type.id=$tblEaxmIndex.question_type
SQL;
            if(count($tblIdArr)>0){
               $chatperIdSql = 'select question_id from '.$eduInfo[ 'edu_chapter2question']. ' where chapter_id in(' .$chapter_id.')' ;
               $this-> db-> sql = $chatperIdSql;
               $this-> db->Query();
               $rs = $this->db ->rs ;
                foreach ($rs as $key=>$value){
                   $tblQuestionIdArr[] = $value['question_id' ];
                 }
                 $questionStr = '"' .implode('","' , $tblQuestionIdArr).'"' ;
                 $where= ' where  '.$tblEaxmIndex. '.gid in('.$questionStr. ')';
              }           
			
			if(!$offset && !$step){
					$limit = '';
				}else{
					$limit = ' LIMIT '.$offset.','.$step;
				}
				
			$examinationSql = $sql.$where.$limit;
//			echo $examinationSql;
//			exit;
			$this->db->sql = $examinationSql;	
			$this->db->Query();
			$rs = $this->db->rs;
			
			$contentTmp ['ids'] = array ();
			$contentTmp ['dbtype'] = $dbtype;
			foreach ( $rs as $key => $value ) {
				array_push ( $contentTmp ['ids'], $value ['gid'] );
			}
			$contentTmp ['dbtype'] = $dbtype;
			if ($dbtype == '1') {
				$contentTmpOther ['dbtype'] = '2';
			} else if ($dbtype == '2') {
				$contentTmpOther ['dbtype'] = '1';
			}
			$exerciseContent ['0'] = $contentTmp;
			$exerciseContent ['1'] = $contentTmpOther;
			$result ['list'] = $rs;
			
//		echo '<pre>';
//		
//		print_r($exerciseContent);
//		echo json_encode ( $exerciseContent );
//		exit;
			$result ['exercise_info'] ['id'] = $chapter_id;
			$result ['exercise_info'] ['name'] = $chapterName;
			$result ['exercise_info'] ['content'] = json_encode ( $exerciseContent );
			return $result;
			
//			
//			$examinationNumSql =<<<SQL
//			select count(*) as num 
//			from $tblEaxmIndex LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
//SQL;
//			$this->db->sql = $examinationNumSql.$where;	
//			$this->db->Query();
//			$num = $this->db->rs;
//			$this->b['count'] =$num[0]['num'] ;
//			$this->b['sc'] = 200;
	}
	
	
	public function get_query_zhenti($userId, $subject_id, $section_id, $type, $year, $province_id, $limit) {
		//查询最新的试卷
		global $DBCFG;
		$eduInfo = utils_handler::get_edu_info ( $subject_id );
		$zhuantiTable = $eduInfo ['edu_zhuanti'];
		$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		//                                print_r($this->db);
		$tblExamination = $eduInfo ['exam_examination'];
		
		$user_id = intval ( $userId );
		
		if ($type == 1) {
			$typeCondition = 1;
		} else {
			$typeCondition = '2,3';
		}
		
		$where = $tblExamination . '.subject_id=' . $subject_id . ' AND ' . $tblExamination . '.section_id=' . $section_id;
		
		if ($year) {
			$where .= ' AND ' . $tblExamination . '.year like "%' . $year . '%" ';
		}
		
		if ($province_id) {
			$where .= ' AND ' . $tblExamination . '.province_id=' . $province_id;
		}
		
		$sql = <<<SQL
                                                SELECT $tblExamination.id,subject_id, $tblExamination.name FROM $tblExamination
                                                LEFT JOIN edu_grade ON $tblExamination.grade_id=edu_grade.id
                                                WHERE $where  AND $tblExamination.exam_type IN ($typeCondition)
                                                ORDER BY $tblExamination.year desc
                                                LIMIT $limit;
SQL;
		$this->db->sql = $sql;
		$this->db->Query ();
		$result ['new_zhenti'] = $this->db->rs;
		
		//
		$this->db->switchDB ( $DBCFG ['default_local'] ['dbhost'], $DBCFG ['default_local'] ['dbname'], $DBCFG ['default_local'] ['dbuser'], $DBCFG ['default_local'] ['dbpasswd'] );
		$sql = 'SELECT * , COUNT(*) as count FROM study_exercise WHERE assign_id IS null ORDER BY count DESC LIMIT ' . $limit;
		$this->db->sql = $sql;
		$this->db->Query ();
		$hots = $this->db->rs;
		$ids1 = '';
		foreach ( $hots as $v ) {
			$ids1 .= $v ['exercise_id'] . ',';
		}
		$ids1 = substr ( $ids1, 0, strlen ( $ids1 ) - 1 );
		//                                $this->b['ids1'] = $ids1;
		

		$this->db->switchDB ( $DBCFG ['default_local'] ['dbhost'], $DBCFG ['default_local'] ['dbname'], $DBCFG ['default_local'] ['dbuser'], $DBCFG ['default_local'] ['dbpasswd'] );
		$sql2 = 'SELECT * FROM study_exercise WHERE user_id=' . $user_id;
		$this->db->sql = $sql2;
		$this->db->Query ();
		$history = $this->db->rs;
		
		$ids2 = '';
		foreach ( $history as $v ) {
			$ids2 .= $v ['exercise_id'] . ',';
		}
		
		$ids2 = substr ( $ids2, 0, strlen ( $ids2 ) - 1 );
		//                                $this->b['ids2'] = $ids2;
		//查询我做过的试卷
		$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		
		$sql = <<<SQL
                                    SELECT $tblExamination.* FROM $tblExamination
                                    LEFT JOIN edu_grade ON $tblExamination.grade_id=edu_grade.id 
                                    WHERE $tblExamination.id in ( $ids2) AND $tblExamination.subject_id=$subject_id AND $tblExamination.section_id=$section_id AND $tblExamination .exam_type IN ($typeCondition);
SQL;
		
		$this->db->sql = $sql;
		
		$this->db->Query ();
		
		$result ['history_score'] = $history;
		$result ['history_exercise'] = $this->db->rs;
		
		$sql = <<<SQL
                                    SELECT $tblExamination.* FROM $tblExamination
                                    LEFT JOIN edu_grade ON $tblExamination.grade_id=edu_grade.id 
                                    WHERE $tblExamination.id in ( $ids1) AND $where AND exam_type IN ($typeCondition);
                                    
SQL;
		$this->db->sql = $sql;
		$this->db->Query ();
		
		$result ['hot_exercise'] = $this->db->rs;
		return $result;
	
	}
	
	public function get_query_zhenti_question($userId, $exam_id, $subject_id, $dbtype) {
		global $DBCFG;
		$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		$eduInfo = utils_handler::get_edu_info ( $subject_id );
		$tblExamination = $eduInfo ['exam_examination'];
		$this->db->sql = 'SELECT * FROM ' . $tblExamination . ' WHERE id=' . $exam_id;
		
		$this->db->Queryone ();
		
		$examInfo = $this->db->rs;
		
		$questionID = json_decode ( $this->db->rs ['content'], true );
		
		$questionID = implode ( '","', $questionID ['list'] );
		
		$tableName1 = $eduInfo ['exam_question'];
		$tableName2 = $eduInfo ['exam_question_index'];
		
		$sql = <<<SQL
                                                SELECT * ,a.dbtype FROM $tableName2
                                                LEFT JOIN $tableName1 ON $tableName2.gid=$tableName1 .gid
                                                join (select 1 as dbtype) a on 1=1
                                                WHERE $tableName2.gid in (" $questionID")
                                                ORDER BY $tableName2.gid ASC
SQL;
		$this->db->sql = $sql;
		$this->db->Query ();
		$result ['exam_info'] = $examInfo;
		$result ['question_data'] = $this->db->rs;
		
		$this->db->switchDB ( $DBCFG ['default_local'] ['dbhost'], $DBCFG ['default_local'] ['dbname'], $DBCFG ['default_local'] ['dbuser'], $DBCFG ['default_local'] ['dbpasswd'] );
		
		$sql = 'SELECT * FROM study_exercise WHERE exercise_id=' . $exam_id . ' AND user_id=' . $userId;
		$this->db->sql = $sql;
		$this->db->Query ();
		$result ['history'] = $this->db->rs;
		$result ['exercise_info'] ['id'] = $result ['exam_info'] ['id'];
		$result ['exercise_info'] ['name'] = $result ['exam_info'] ['name'];
		$contentTmp = array ();
		$tmp = json_decode ( $result ['exam_info'] ['content'], true );
		$contentTmp ['ids'] = array_values($tmp ['list']); //转换成数组
		$contentTmp ['dbtype'] = $dbtype;
		if ($dbtype == '1') {
			$contentTmpOther ['dbtype'] = '2';
		} else if ($dbtype == '2') {
			$contentTmpOther ['dbtype'] = '1';
		}
		$content ['0'] = $contentTmp;
		$content ['1'] = $contentTmpOther;
		$result ['exercise_info'] ['content'] = json_encode ( $content );
		return $result;
	}
	
		

	public function get_query_exercise_question($examId){
		global $DBCFG;
		$this->db->switchDB ( $DBCFG ['default_local'] ['dbhost'], $DBCFG ['default_local'] ['dbname'], $DBCFG ['default_local'] ['dbuser'], $DBCFG ['default_local'] ['dbpasswd'] );
		$this->db->sql = <<<SQL
							select * from teach_exam_list where id=$examId;
SQL;
		$this->db->Queryone();
		$rs = $this->db->rs;
		$result['exercise_info']['id'] = $rs['id'];
		$result['exercise_info']['name'] = $rs['name'];
		$result['exercise_info']['content'] = $rs['content'];
		return $result;
	}
	/**
	 * 
	 * @param  $userId
	 * @param  $examType
	 */
	public function get_user_stat_exercise($userId,$examType){
		$this->db->sql = <<<SQL
									select * from stat_exercise where user_id=$userId and exam_type='$examType';
SQL;
		$this->db->Query();
		return $this->db->rs;
	}
	
	
	public function get_examination_ti_total_count($examId,$subjectId){
		global $DBCFG;
		$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		$eduInfo = utils_handler::get_edu_info ( $subjectId );
		$tblExamination = $eduInfo ['exam_examination'];
		$this->db->sql = 'SELECT * FROM ' . $tblExamination . ' WHERE id=' . $examId;
		$this->db->Queryone ();
		$rs =$this->db->rs;
		$content = json_decode($rs['content'],true);
		$tiTotalCount = count($content['list']);
		return $tiTotalCount;
	}

	
	
		public function get_self_exam_info($id){
			$this->db->sql = <<<SQL
									select * from teach_self_list where id=$id;
SQL;
			$this->db->Queryone();
			return $this->db->rs;
		}
		
		public function post_add_book_setting($userId,$data){
			global $bookSettingPath;
			$filename = $bookSettingPath.$userId.'.json';
			 if(file_put_contents($filename, $data)){
			 	return true;
			 }else{
			 	return false;
			 }
		}
		
		public function get_book_setting($userId){
			global $bookSettingPath;
			$filename = $bookSettingPath.$userId.'.json';
			return file_get_contents($filename);
		}
		
		public function get_study_exercise_content($id){
			$this->db->sql = <<<SQL
										select duration,content from study_exercise where id=$id;
SQL;
			$this->db->Queryone();
			return $this->db->rs;
		}
		
		public function get_ti_user_count($userId){
			$this->db->sql  = <<<SQL
										select ti_id,dbtype,count,flag from stat_exercise_ti where user_id=$userId;
SQL;
			$this->db->Query();
			
			return $this->db->rs;
		}
		/**
		 * 解析data['content']
		 * Enter description here ...
		 */
	public  function analytic_data_content($data){
		 $dataTmp = utils_handler::analytic_data($data);
		 foreach ($dataTmp as $key=>$value){
		 	 foreach ($data['content'] as $k=>$v){
		 	 		if($value['dbtype']==$v['dbtype']){
		 	 			$dataTmp[$key]['postion'] = '0';
		 	 			$dataTmp[$key]['study_exercise_id'] = $data['study_exercise_id']?$data['study_exercise_id']:'0';
		 	 		}
		 	 }
		 }
		 return $dataTmp;
	}
	
	public function get_student_submit_count($studentExerciseId){
		$this->db->sql = <<<SQL
		select assign_id from study_exercise where id=$studentExerciseId;
SQL;
		$this->db->Queryone();
		$assignId = $this->db->rs['assign_id'];
		$this->db->sql = <<<SQL
			select count(*) as num from  study_exercise where assign_id=$assignId and type in (2,3);
SQL;
		$this->db->Queryone();
		$num = $this->db->rs['num'];
		return $num;
	}
	
	/**
	 * 
	 * @param  $studentExerciseId
	 * @param  $fromId
	 */
	public function get_exercise_exam_paper_content($studentExerciseId,$fromId){
		$this->db->sql =<<<SQL
									select * from study_exercise where id=$studentExerciseId;
SQL;
		$this->db->Queryone();
		$rsExercise =$this->db->rs;
		$examId = $rsExercise['exercise_id'];
		$exerciseContent = $rsExercise['content'];
		$subjectId = $rsExercise['subject_id'];
		if($rsExercise['exam_type']!='1'&&$rsExercise['exam_type']!='6'){
			 $examTable = 'teach_self_list';
			//专题 同步 名校 真题
		}else{
			$examTable = 'teach_exam_list';
			//普通试卷
		}
		
		$this->db->sql = <<<SQL
									select * from $examTable where id=$examId;
SQL;
		$this->db->Queryone();
		$rsExam =$this->db->rs;
		$sql = $this->db;
		$examContent = $rsExam['content'];
		
		$eduInfo = utils_handler::get_edu_info($subjectId);
		$tblEaxm = $eduInfo['exam_question'];
		$tblEaxmIndex = $eduInfo['exam_question_index'];
		$examList = $this->get_paper($tblEaxm, $tblEaxmIndex, $examContent);

		if($fromId){
			$ids = $rsExam['content'];
			$result['exam_info'] =json_decode($ids,true); 
		}else{
			$result['exam_list'] =$examList; 
			$result['exam_info'] =$rsExam; 
		}
//		$result['db'] =$sql; 
		$result['exercise_content'] =$exerciseContent; 
		return $result;
		
	}
	
	
	public function get_paper($tblEaxm,$tblEaxmIndex,$paperIdArr,$centerId=null){
			global $DBCFG;
			$paperIds = json_decode($paperIdArr,true);
			$result1 = array();
			$result2 =array();
			foreach ($paperIds as $key=>$value){
				if($value['dbtype']==1&&$value['ids']){
					$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
					$sql =<<<SQL
			select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,$tblEaxm.image,a.dbtype,edu_question_type.type_name
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
			LEFT JOIN edu_question_type on edu_question_type.id=$tblEaxmIndex.question_type
			join (select 1 as dbtype) a on 1=1
SQL;
				if(count($value['ids'])>0){
						$str = '"'.implode('","', $value['ids']).'"';
						$where = ' WHERE '.$tblEaxmIndex.'.gid in('.$str.') ORDER BY FIELD('.$tblEaxmIndex.'.gid,'.$str.')';
					}
					$this->db->sql = $sql.$where;
					$this->db->Query();
					$result1 = $this->db->rs;
				}
				 if($value['dbtype']==2&&$value['ids']){
					$dbJson = $this->query_curriculumndb($centerId);
					if($dbJson){
						$db = json_decode($dbJson,true);
						$this->switchDB($db['ip'],$db['name']);
						$sql =<<<SQL
						select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,$tblEaxm.image,a.dbtype,edu_question_type.type_name
						from $tblEaxmIndex
						LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
						LEFT JOIN edu_question_type on edu_question_type.id=$tblEaxmIndex.question_type
						join (select 2 as dbtype) a on 1=1
SQL;

						if(count($value['ids'])>0){
							$str = '"'.implode('","', $value['ids']).'"';
							$where = ' WHERE '.$tblEaxmIndex.'.gid in('.$str.') ORDER BY FIELD('.$tblEaxmIndex.'.gid,'.$str.')';
						}
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
			return $result;
		}
		
	public function query_curriculumndb($centerId){
			global $DBCFG;
				$this->db->switchDB ( $DBCFG ['default_local'] ['dbhost'], $DBCFG ['default_local'] ['dbname'], $DBCFG ['default_local'] ['dbuser'], $DBCFG ['default_local'] ['dbpasswd'] );
				$sql = 'select * from tblcenter where id='.$centerId;
				$this->db->sql = $sql;
				$this->db->Queryone();
				$rs = $this->db->rs;
				$result =array();
				
				$result['ip'] =$rs['db_ip'];
				$result['name'] = $rs['db_name']; 
				if($rs){
						$this->b['rs'] =json_encode($result);
						$this->b['sc']  = 200;
						return json_encode($result);
				}else{
						$this->b['rs'] = false;
						$this->b['sc']  = 200;
				}
				
			}
			
		public function get_exam_stat($userId,$examId,$examType){
			global $DBCFG;
			$this->db->switchDB ( $DBCFG ['default_local'] ['dbhost'], $DBCFG ['default_local'] ['dbname'], $DBCFG ['default_local'] ['dbuser'], $DBCFG ['default_local'] ['dbpasswd'] );
			$this->db->sql = <<<SQL
										select * from stat_exercise where exam_id=$examId and exam_type=$examType and user_id=$userId;
SQL;
			$this->db->Queryone();
			return $this->db->rs;
		}
		
		/**
		 * 检查是否存在好题、错题
		 */
		public function is_exist_collection($userId,$tiId,$flag,$dbtype){
			global $DBCFG;
			$this->db->switchDB ( $DBCFG ['default_local'] ['dbhost'], $DBCFG ['default_local'] ['dbname'], $DBCFG ['default_local'] ['dbuser'], $DBCFG ['default_local'] ['dbpasswd'] );
			$this -> db -> sql = <<<SQL
			select id,flag from study_collection where user_id="$userId" and question_id="$tiId" and flag="$flag" and dbtype="$dbtype";
SQL;
			$this -> db -> Queryone();
			return $this->db->rs; 
		}
		
		/**
		 * 更新好题、错题
		 * @param  $tiId
		 * @param  $flag
		 */
		public function update_collection($id){
			global $DBCFG;
			$this->db->switchDB ( $DBCFG ['default_local'] ['dbhost'], $DBCFG ['default_local'] ['dbname'], $DBCFG ['default_local'] ['dbuser'], $DBCFG ['default_local'] ['dbpasswd'] );
			$this -> db -> sql = <<<SQL
			update study_collection set add_time=current_timestamp() where id=$id;
SQL;
			$this -> db -> ExecuteSql();
			if($rs!==FALSE){
				return true;
			}else{
				return FALSE;
			}
		}
		
		public function insert_collection($userId,$flag,$tiId,$subjectId,$dbtype,$gradeId){
			global $DBCFG;
			$this->db->switchDB ( $DBCFG ['default_local'] ['dbhost'], $DBCFG ['default_local'] ['dbname'], $DBCFG ['default_local'] ['dbuser'], $DBCFG ['default_local'] ['dbpasswd'] );
			$this->db->sql = <<<SQL
						insert into study_collection (flag,user_id,add_time,question_id,subject_id,dbtype,grade_id) values("$flag","$userId",current_timestamp(),"$tiId","$subjectId","$dbtype","$gradeId");
SQL;
			$this -> db -> ExecuteSql();
			$rs =  $this->db->rs;
			if($rs!==FALSE){
				return $this->db->Last_id();
			}else{
				return FALSE;
			}
		}
		
		public function get_exercise_entrance_tests_list_bak($examType,$centerId,$zoneId,$offset,$step,$realname=NULL){
			$sql =<<<SQL
			select a.id as user_id,a.realname,a.username,a.gender,tblstudent.center_id,tblstudent.zone_id,tblstudent.grade,

			teach_assign_list.create_date,study_exercise.id,b.realname as teacher_realname 
			
			from tblstudent 
			
			left join study_exercise on study_exercise.user_id=tblstudent.user_id
			
			left join tbluser a on a.id=tblstudent.user_id 
        
         	left join tbluser b on b.id=study_exercise.creator 
         	
         	left join teach_assign_list on teach_assign_list.id=study_exercise.assign_id
			
			
			where study_exercise.exam_type=$examType  
SQL;

			if($realname){
				$sql .=<<<SQL
				 	and a.realname like '%$realname%'
SQL;
			}
			
			$groupBy = <<<SQL
			 	group by user_id,teach_assign_list.create_date  order by study_exercise.create_date desc
SQL;
			$this->db->sql = $sql.$groupBy;
			$this->db->Query();
			$rs1 = $this->db->rs;
			if(count($rs1)){
				$sql = <<<SQL
							select study_exercise.id as study_exercise_id,
							
							study_exercise.assign_id,
							
							study_exercise.user_id,teach_assign_list.create_date,
							
							study_exercise.type,
							
							teach_exam_list.id as exam_id,
							
							teach_exam_list.name,teach_exam_list.subject_id,teach_exam_list.grade,
							
							
							
							tbltest_report.id as trid,
							
							tbltest_report.create_date as tr_create_date,
							
							a.realname as tr_realname,
							
							b.realname as student_realname
							
							from study_exercise
							
							left join teach_exam_list on study_exercise.exercise_id=teach_exam_list.id
							
							left join tbltest_report on tbltest_report.study_exercise_id=study_exercise.id
							
							left join teach_assign_list on teach_assign_list.id=study_exercise.assign_id
							
							left join tbluser a on a.id=study_exercise.user_id 
							
							left join tbluser b on b.id=tbltest_report.creator
							
							where study_exercise.exam_type=$examType
SQL;

				/**
				 * 	@已经搞定
				 * 缺少一个表 入学报告表   left join 一下就好了
				 */

				$this->db->sql = $sql;
				$this->db->Query();
				$rs2 = $this->db->rs;
				
				foreach ($rs1 as $key=>$value){
					foreach ($rs2 as $k=>$v){
						if(($value['user_id']==$v['user_id'])&&($value['create_date']==$v['create_date'])){
							$rs1[$key]['exam_info'][] =$v;
						}
					}
				}
				
			
			}
			
			$result['count'] =  count($rs1);
			$result['list'] =  array_splice($rs1, $offset,$step);
			return $result;
		}
		
		
		
		public function get_exercise_entrance_tests_list($examType,$centerId,$zoneId,$offset,$step,$realname=NULL){
			$sql = <<<SQL
							select study_exercise.id as study_exercise_id,
							
							study_exercise.assign_id,
							
							study_exercise.user_id,teach_assign_list.create_date,
							
							study_exercise.type,
							
							teach_exam_list.id as exam_id,
							
							teach_exam_list.name,teach_exam_list.subject_id,teach_exam_list.grade,
							
							
							
							tbltest_report.id as trid,
							
							tbltest_report.create_date as tr_create_date,
							
							a.realname as student_realname,
							
							a.username as student_username,
							
							b.realname as teacher_realname
							
							from study_exercise
							
							left join teach_exam_list on study_exercise.exercise_id=teach_exam_list.id
							
							left join tbltest_report on tbltest_report.study_exercise_id=study_exercise.id
							
							left join teach_assign_list on teach_assign_list.id=study_exercise.assign_id
							
							left join tbluser b on b.id=tbltest_report.creator
							
							left join tbluser a on a.id=study_exercise.user_id
							
							where study_exercise.exam_type=$examType
SQL;

			
			if($realname){
				$sql .=<<<SQL
				 	and a.realname like '%$realname%'
SQL;
			}
			if($centerId&&$zoneId){
				$sql .=<<<SQL
						and teach_assign_list.center_id='$centerId' and teach_assign_list.zone_id='$zoneId'
SQL;
			}
			
			$orderBy = <<<SQL
						order by teach_assign_list.create_date desc
SQL;
			$this->db->sql=$sql.$orderBy;
			$this->db->Query();
			$rs = $this->db->rs;
			$result['count'] =  count($rs);
			$result['list'] =  array_splice($rs, $offset,$step);
			return $result;
		}
		
	public function get_ti_info($tiId,$subjectId,$dbtype){
		global $DBCFG;
		if($dbtype==1){
			$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		}else{
			
		}
		$eduInfo = utils_handler::get_edu_info($subjectId);
		$table1 = $eduInfo['exam_question_index'];
		$table2= $eduInfo['exam_question'];
		$this->db->sql = <<<SQL
									select $table1.*,$table2.objective_answer from $table1

									left join $table2 on $table1.gid=$table2.gid 
									
									where $table1.gid='$tiId';
SQL;
		$this->db->Queryone();
		return $this->db->rs;
	}
	
	
	public function get_zhuanti_info_by_knowledge_id($knowledgeId,$subjectId,$dbtype,$sectionId){
		global $DBCFG;
		if($dbtype==1){
			$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		}else{
			
		}
		$eduInfo = utils_handler::get_edu_info($subjectId);
		$table = $eduInfo['edu_zhuanti'];
		$where = utils_handler::analytic_knowledge_id_to_query($table, $knowledgeId);
		$where = substr($where, 4,strlen($where)-1);
		$this->db->sql = <<<SQL
									select * from $table where $where 
SQL;

		if($sectionId){
			$this->db->sql .=<<<SQL
				and section_id=$sectionId;
SQL;
		}
		$this->db->Queryone();
		return $this->db->rs;
	}
	
	
	public function get_knowledge_info_by_knowledge_id($knowledgeId,$subjectId,$dbtype,$sectionId){
		global $DBCFG;
		if($dbtype==1){
			$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		}else{
			
		}
		$eduInfo = utils_handler::get_edu_info($subjectId);
		$table = $eduInfo['edu_knowledge'];
		$this->db->sql = <<<SQL
									select * from $table where id=$knowledgeId; 
SQL;

		if($sectionId){
			$this->db->sql .=<<<SQL
				and section_id=$sectionId;
SQL;
		}
		$this->db->Queryone();
		return $this->db->rs;
	}
	public function stat_post_question_id($userId,$data){
		$content = $data['content'];
		$subjectId = $data['subject_id'];
		$sectionId = $data['section_id'];
		$statHandler = new stat_handler();
		if(count($content)>0){
			foreach ($content as $key=>$value){
				$data =array();
				if($value['flag']==false){
					$data['question_wrong_count'] = 1;
				}
				$tiId = $value['id'];
				$dbtype = $value['dbtype'];
				$data['question_id'] = $tiId;
				$data['user_id'] = $userId;
				$data['question_do_count'] = 1;
				$data['subject_id'] = $subjectId;
				$data['section_id'] = $sectionId;
				$data['dbtype'] = $dbtype;
				$statHandler->stat_question($data);
				$statHandler->stat_question_user($data);
			}
		}
		return true;
	}
	
	
	public function stat_post_knowledge_id($userId,$data){
		$content = $data['content'];
		$subjectId = $data['subject_id'];
		$sectionId = $data['section_id'];
		$statHandler = new stat_handler();
		if(count($content)>0){
			foreach ($content as $key=>$value){
				$data =array();
				if($value['flag']==false){
					$data['question_wrong_count'] = 1;
				}
				$tiId = $value['id'];
				$dbtype = $value['dbtype'];
				$tiInfo = $this->get_ti_info($tiId, $subjectId, $dbtype);
				$knowledgeIdArray = explode(',', $tiInfo['knowledge_id']);
				if(count($knowledgeIdArray)>0){
					foreach ($knowledgeIdArray as $k=>$v){
						$data['knowledge_id'] = $v;
						$data['difficulty'] = $tiInfo['difficulty'];
						$data['question_type'] = $tiInfo['question_type'];
						$data['user_id'] = $userId;
						$data['question_do_count'] = 1;
						$data['subject_id'] = $subjectId;
						$data['section_id'] = $sectionId;
						$data['dbtype'] = $dbtype;
						$statHandler->stat_knowledge($data);
						$statHandler->stat_knowledge_user($data);
					}
				}
			}
		}
		return true;
	}
	
	
	public function stat_post_zhuanti($userId,$data){
		$content = $data['content'];
		$subjectId = $data['subject_id'];
		$sectionId = $data['section_id'];
		$statHandler = new stat_handler();
		if(count($content)>0){
			foreach ($content as $key=>$value){
				$data =array();
				if($value['flag']==false){
					$data['question_wrong_count'] = 1;
				}
				
				$tiId = $value['id'];
				$dbtype = $value['dbtype'];
				$tiInfo = $this->get_ti_info($tiId, $subjectId, $dbtype);
				$knowledgeId = $tiInfo['knowledge_id'];
				$zhuantiInfo = $this->get_zhuanti_info_by_knowledge_id($knowledgeId, $subjectId, $dbtype,$sectionId);	
				
				$data['zhuanti_id'] = $zhuantiInfo['id'];
				$data['difficulty'] = $tiInfo['difficulty'];
				$data['question_type'] = $tiInfo['question_type'];
				$data['user_id'] = $userId;
				$data['question_do_count'] = 1;
				$data['subject_id'] = $subjectId;
				$data['section_id'] = $sectionId;
				$data['dbtype'] = $dbtype;
				$statHandler->stat_zhuanti($data);
				$statHandler->stat_zhuanti_user($data);
			}
		}
		return true;
	}
	
	
	public function stat_post_subject($userId,$data){
		$content = $data['content'];
		$subjectId = $data['subject_id'];
		$sectionId = $data['section_id'];
		$count = count($content);
		$wrongNum = 0;
		if(count($content)>0){
			foreach ($content as $key => $value) {
				if($value['flag']==false){
					$wrongNum++;
				}
			}
		}
		$statHandler = new stat_handler();
		/**
		 * @todo 关于学科的统计 
		 * Enter description here ...
		 * @var unknown_type
		 */
		$data =array();
		$data['user_id'] = $userId;
		$data['question_wrong_count'] = $wrongNum;
		$data['question_do_count'] = $count;
		$data['subject_id'] = $subjectId;
		$data['section_id'] = $sectionId;
		//section_id data['section_id']
		$statHandler->stat_student_subject_day($data);
		return true;
	}
	
	
	/**
	 * 获取知识点的统计信息
	 * @param  $subjectId
	 * @param  $sectionId
	 * @param  $userId
	 */
	public function get_stat_knowledge($subjectId,$sectionId,$userId=NULL,$knowledgeId=NULL){
		global $DBCFG;
				
		$eduInfo = utils_handler::get_edu_info($subjectId);
		$knowledgeTable = $eduInfo['edu_knowledge'];
		$tableIndex = $eduInfo['exam_question_index'];
		if($userId){
			$table = 'stat_knowledge_user';
		}else{
			$table = 'stat_knowledge';
		}
		$this->db->sql = <<<SQL
						select * from $table where  subject_id=$subjectId and section_id=$sectionId 
SQL;
		
		if($userId){
			$this->db->sql.=<<<SQL
						and user_id=$userId 
SQL;
		}
		if($knowledgeId){
			
			$this->db->sql.=<<<SQL
						and knowledge_id in ($knowledgeId) ;
SQL;
		}
		$this->db->Query();
		$rs = $this->db->rs;
		
		
		
		if($knowledgeId){
			
			$knowledgeArray = explode(',', $knowledgeId);
			
			if(count($knowledgeArray)>0){
				foreach ($knowledgeArray as $key=>$value){
					$tmpKnowledgeId = $value;
					
					$this->db->sql = <<<SQL
						select sum(question_do_count) as max_question_do_count    from $table where knowledge_id=$tmpKnowledgeId and subject_id=$subjectId and section_id=$sectionId group by user_id order by max_question_do_count desc
SQL;
				$this->db->Queryone();
				$maxRs = $this->db->rs;
				$result[$value]['max_question_do_count'] = $maxRs['max_question_do_count']?$maxRs['max_question_do_count']:'0';
		
				
				$this->db->sql = <<<SQL
						select avg(question_do_count) as avg_question_do_count   from $table where knowledge_id=$tmpKnowledgeId and subject_id=$subjectId and section_id=$sectionId;
SQL;
				$this->db->Queryone();
				$avgRs = $this->db->rs;
				$result[$value]['avg_question_do_count'] = $avgRs['avg_question_do_count']?$avgRs['avg_question_do_count']:'0';
		
				
				
				
				$this->db->sql = <<<SQL
						select sum(question_do_count) as sum_question_do_count,sum(question_wrong_count) as sum_question_wrong_count,dbtype  from $table where user_id=$userId and  knowledge_id=$tmpKnowledgeId and subject_id=$subjectId and section_id=$sectionId;
SQL;
				$this->db->Queryone();
				$sumRs = $this->db->rs;
				$result[$value]['my_question_do_count'] = $sumRs['sum_question_do_count']?$sumRs['sum_question_do_count']:'0';
//				echo '<pre>';
//				print_r($this->db);
//				exit;
				$result[$value]['my_level'] = ($sumRs['sum_question_do_count']-$sumRs['sum_question_wrong_count'])/$sumRs['sum_question_do_count']?($sumRs['sum_question_do_count']-$sumRs['sum_question_wrong_count'])/$sumRs['sum_question_do_count']*100:0;
				
				
				
		
				$this->db->sql = <<<SQL
						select max((question_do_count-question_wrong_count)/question_do_count) as online_max_level   from $table where  knowledge_id=$tmpKnowledgeId and subject_id=$subjectId and section_id=$sectionId;
SQL;
				$this->db->Queryone();
				$maxRs = $this->db->rs;
				$result[$value]['online_max_level'] = $maxRs['online_max_level']*100;
				
				
				
				$this->db->sql = <<<SQL
						select avg((question_do_count-question_wrong_count)/question_do_count) as online_avg_level   from $table where  knowledge_id=$tmpKnowledgeId and subject_id=$subjectId and section_id=$sectionId;
SQL;
				$this->db->Queryone();
				$avgRs = $this->db->rs;
				
//				print_r($this->db);
//				exit;
				$result[$value]['online_avg_level'] = $avgRs['online_avg_level']*100;

				$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
				
				$this->db->sql = <<<SQL
											select count(*) as num from $tableIndex where knowledge_id in ($tmpKnowledgeId) ;
SQL;
				$this->db->Queryone();
				
				$num = $this->db->rs;
				$result[$value]['online_total_count'] = $num['num'];
				
					
				}
			}
		
		
		}
		
		if(count($rs)>0){
			foreach ($rs as $key=>$value){
					$knowledgeId = $value['knowledge_id'];
					$dbtype=$value['dbtype'];
					$questionType = $value['question_type'];
					if($dbtype==1){
						$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
						
						$this->db->sql =<<<SQL
													select name from $knowledgeTable where id='$knowledgeId';
SQL;
						$this->db->Queryone();
						$knowledgeRs = $this->db->rs;
						$rs[$key]['knowledge_name'] = $knowledgeRs['name'];
						
						$this->db->sql =<<<SQL
													select type_name from edu_question_type where id='$questionType';
SQL;
						$this->db->Queryone();
						$typeRs = $this->db->rs;
						$rs[$key]['type_name'] = $typeRs['type_name'];
						
						
					}else{
					
					}
			}
		}
		
		$result['list'] = $rs;
		return $result;
	}
	/**
	 * 获取专题的统计信息
	 * @param  $subjectId
	 * @param  $sectionId
	 * @param  $userId
	 */
	public function get_stat_zhuanti($subjectId,$sectionId,$userId=NULL,$zhuantiId=NULL){
		global $DBCFG;
		$result = array();
		if($userId){
			$table = 'stat_zhuanti_user';
		}else{
			$table = 'stat_zhuanti';
		}
		
		$this->db->sql = <<<SQL
						select zhuanti_id,sum(question_do_count) as question_do_count ,sum(question_wrong_count) as question_wrong_count,dbtype from  $table where  subject_id=$subjectId and section_id=$sectionId and  zhuanti_id!=''
SQL;
		
		if($userId){
			$this->db->sql.=<<<SQL
						and user_id=$userId
SQL;
		}
		
		if($zhuantiId){
			$this->db->sql.=<<<SQL
						and zhuanti_id=$zhuantiId
SQL;
		}
		
		$this->db->sql .=<<<SQL
						group by zhuanti_id ;
SQL;
		$this->db->Query();
		$rs = $this->db->rs;
		
//		echo '<pre>';
//		print_r($this->db);
//		exit;
		if($zhuantiId){
		$this->db->sql = <<<SQL
						select  sum(question_do_count) as max_question_do_count   from $table where zhuanti_id=$zhuantiId and subject_id=$subjectId and section_id=$sectionId group by user_id order by max_question_do_count desc;
SQL;
		$this->db->Queryone();
		$maxRs = $this->db->rs;
		$result['max_question_do_count'] = $maxRs['max_question_do_count']?$maxRs['max_question_do_count']:'0';
		
		
		$this->db->sql = <<<SQL
						select sum(question_do_count) as sum_question_do_count,sum(question_wrong_count) as sum_question_wrong_count,dbtype  from $table where user_id=$userId and zhuanti_id=$zhuantiId and subject_id=$subjectId and section_id=$sectionId;
SQL;
		$this->db->Queryone();
		$sumRs = $this->db->rs;
		$result['my_question_do_count'] = $sumRs['sum_question_do_count']?$sumRs['sum_question_do_count'] :'0';
		$result['my_level'] = ($sumRs['sum_question_do_count']-$sumRs['sum_question_wrong_count'])/$sumRs['sum_question_do_count']*100?($sumRs['sum_question_do_count']-$sumRs['sum_question_wrong_count'])/$sumRs['sum_question_do_count']*100:"0";
		
		$result['avg_question_do_count'] = 100;
		
		
		$this->db->sql = <<<SQL
						select max((question_do_count-question_wrong_count)/question_do_count) as online_max_level   from $table where zhuanti_id=$zhuantiId and subject_id=$subjectId and section_id=$sectionId;
SQL;
		$this->db->Queryone();
		$maxRs = $this->db->rs;
		$result['online_max_level'] = $maxRs['online_max_level']*100?$maxRs['online_max_level']*100:'0';
		
		
		
		$this->db->sql = <<<SQL
						select avg((question_do_count-question_wrong_count)/question_do_count) as online_avg_level   from $table where zhuanti_id=$zhuantiId and subject_id=$subjectId and section_id=$sectionId;
SQL;
		$this->db->Queryone();
		$avgRs = $this->db->rs;
		$result['online_avg_level'] = $avgRs['online_avg_level']*100?$avgRs['online_avg_level']*100:'0';
		
		
		}
		
		$eduInfo = utils_handler::get_edu_info($subjectId);
		$zhuantiTable = $eduInfo['edu_zhuanti'];
		if(count($rs)>0){
			foreach ($rs as $key=>$value){
					$zhuantiId = $value['zhuanti_id'];
					$questionType = $value['question_type'];
					$dbtype=$value['dbtype'];
					if($dbtype==1){
						$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
						
						$this->db->sql =<<<SQL
													select name,knowledge_id,knowledge_list from $zhuantiTable where id='$zhuantiId';
SQL;
						$this->db->Queryone();
						$knowledgeRs = $this->db->rs;
						$knowledges = $knowledgeRs['knowledge_id'];
						$knowledgeArray = explode(',', $knowledges);
						if(count($knowledgeArray)>0){
							foreach ($knowledgeArray as $k=>$v){
								$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
								$knowledgeTable = $eduInfo['edu_knowledge'];
								$knowledgeId = $v;
								$this->db->sql =<<<SQL
													select name  from $knowledgeTable where id='$knowledgeId';
SQL;
								$this->db->Queryone();
								$knowledgeName = $this->db->rs['name'];
								$rs[$key]['knowledge_list'][$k]['konwledge_id'] =$knowledgeId;
								$rs[$key]['knowledge_list'][$k]['knowlege_name'] =$knowledgeName;
								
								$this->db->switchDB ( $DBCFG['default_local']['dbhost'] , $DBCFG['default_local']['dbname'] , $DBCFG['default_local']['dbuser'] , $DBCFG['default_local']['dbpasswd']);
								
								$this->db->sql = <<<SQL
															select sum(question_do_count) 
															as question_do_count ,sum(question_wrong_count) as question_wrong_count,dbtype from stat_knowledge_user 
															where subject_id=$subjectId and section_id=$sectionId and knowledge_id=$knowledgeId
SQL;
								if($userId){
									$this->db->sql .=<<<SQL
															and user_id=$userId ;
SQL;
								}
							$this->db->Queryone();
							$qestionCount = $this->db->rs;
							$rs[$key]['knowledge_list'][$k]['question_wrong_count'] =$qestionCount['question_wrong_count']?$qestionCount['question_wrong_count']:'0';
							$rs[$key]['knowledge_list'][$k]['question_do_count'] =$qestionCount['question_do_count']?$qestionCount['question_do_count']:'0';	
							}
						}
						$rs[$key]['zhuanti_name'] = $knowledgeRs['name'];
						
					}else{
					
					}
			}
		}
		$result['list'] = $rs;
		return $result;
	}
	
	/**
	 * 获取学科统计信息
	 */
	public function get_stat_subject($subjectId,$sectionId,$userId,$day){
			$table = 'stat_student_subject_day';
			$this->db->sql = <<<SQL
						select * from $table where  subject_id=$subjectId and section_id=$sectionId 
SQL;
		
		if($userId){
			$this->db->sql.=<<<SQL
						and user_id=$userId 
SQL;
		}
		if($day){
			$this->db->sql.=<<<SQL
						and unix_timestamp(day)>unix_timestamp(current_timestamp())-86400*$day 
SQL;
		}
		$this->db->sql.=<<<SQL
						 order by day asc 
SQL;
		$this->db->Query();
		$rs = $this->db->rs;
		return $rs;
	}
	
	public function get_exercise_detail($studyExerciseId){
		global $DBCFG;
		$exerciseInfo = $this->get_exercise_info($studyExerciseId);
		$examInfo =$this->get_exercise_exam_paper_content($studyExerciseId, $fromId);
		$this->db->switchDB ( $DBCFG['default_local']['dbhost'] , $DBCFG['default_local']['dbname'] , $DBCFG['default_local']['dbuser'] , $DBCFG['default_local']['dbpasswd']);
		if(count($examInfo['exam_list'])){
			foreach ($examInfo['exam_list'] as $key=>$value){
					$knowledgeId = $value['knowledge_id'];
					
					$this->db->sql = <<<SQL
												select sum(question_do_count) as question_do_count ,sum(question_wrong_count) as  question_wrong_count from stat_knowledge where knowledge_id=$knowledgeId;
SQL;
					$this->db->Queryone();
					$statKnowlege = $this->db->rs;
					$onlineLevel = ($statKnowlege['question_do_count']-$statKnowlege['question_wrong_count'])/$statKnowlege['question_do_count'];
					$examInfo['exam_list'][$key]['online_level'] = $onlineLevel>0?$onlineLevel*100:'0';
			}
		}
		$result['exercise'] = $exerciseInfo;
		$result['exam']  = $examInfo;
		return $result;
	}
	
	public function post_add_test_report($data){
		global $exerciseReportPath;
		$dataTmp['study_exercise_id'] = $data['study_exercise_id'];
		$dataTmp['user_id'] = $data['user_id'];
		$dataTmp['creator'] = $data['creator_id'];
		$dataTmp['create_date'] = 'now()';
		$table = 'tbltest_report';
		$this->db->Insert($table, $dataTmp);
		$rs = $this->db->rs;
		if($rs===FALSE){
			return FALSE;
		}else{
			$reprotId =  $this->db->Last_id();
			$filename = $exerciseReportPath.$reprotId.'.json';
			file_put_contents($filename, json_encode($data));
			return $reprotId;
		}
	}
	
	public function get_test_report_detail($trId){
		global $exerciseReportPath;
		$filename = $exerciseReportPath.$trId.'.json';
		return file_get_contents($filename);
	}
	
	public function post_modify_test_report($data){
		global $exerciseReportPath;
		$dataTmp['create_date'] = 'current_timestamp()';
		$dataTmp['user_id'] =$data['user_id'];
		$dataTmp['creator'] =$data['creator_id'];
		$table = 'tbltest_report';
		$trid = $data['trid'];
		$this->db->Update($table, $dataTmp,'id='.$data['trid']);
		
		$rs = $this->db->rs;
		if($rs===FALSE){
			return FALSE;
		}else{
			$filename = $exerciseReportPath.$trid.'.json';
			if(file_exists($filename)){
				unlink($filename);
			}
			file_put_contents($filename, json_encode($data));
			return true;
		}
	}

	public function get_rand_ti($knwledgeId,$subjectId,$dbtype,$sectionId,$questionCount=null){
				global $DBCFG;
				$eduInfo = utils_handler::get_edu_info($subjectId);
				$tableName1 = $eduInfo['exam_question'];
				$tableName2 = $eduInfo['exam_question_index'];
				if($dbtype==1){
					$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
				}else{
					//dbtype=2 切换数据库
				}
				$sql = <<<SQL
				SELECT * ,a.dbtype,edu_question_type.type_name FROM $tableName2 
				LEFT JOIN $tableName1 ON $tableName2.gid=$tableName1.gid 
				LEFT JOIN edu_question_type ON edu_question_type.id=$tableName2.question_type
				 join (select 1 as dbtype) a on $dbtype=$dbtype
				WHERE $tableName2.knowledge_id in ("$knwledgeId") 
				
SQL;
			$this->db->sql = $sql;
			$this->db->Query();
			$rs = $this->db->rs;
			if($questionCount){
				$tmp = utils_handler::rand_result($rs, $questionCount);
			}else{
				$tmp = $rs;
			}
			$result = utils_handler::set_ti_result($tmp);
			return $result;
	}

	
	public function get_rand_zhenti_ti($knowledge,$subjectId,$dbtype,$sectionId,$questionCount=null){
				global $DBCFG;
				$eduInfo = utils_handler::get_edu_info($subjectId);
				$tableName1 = $eduInfo['exam_question'];
				$tableName2 = $eduInfo['exam_question_index'];
				$tableName3 = $eduInfo['exam_examination'];
				$tableName4 = $eduInfo['exam_examination2question'];
				if($dbtype==1){
					$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
				}else{
					//dbtype=2 切换数据库
				}
				
				$sql = <<<SQL
								select question_id  from $tableName4 
								left join $tableName2 on $tableName4.question_id=$tableName2.gid
								WHERE  section_id=$sectionId  
SQL;
				if($knowledge){
					$where = '';
					$knwledgeIdArray = explode(',', $knowledge);
					$whereArray = array();
					foreach ($knwledgeIdArray as $key=>$value){
						$tmp = '"%,'.$value.',%"';
						$where = <<<SQL
										concat (',',$tableName2.knowledge_id,',') like $tmp
SQL;
						$whereArray[] = $where;
					}
					
					$where = ' and '.implode(' or ', $whereArray);
				}
				
				$this->db->sql = $sql.$where;
				
				$this->db->Query();
				
				$zhentiRs = $this->db->rs;
				
				$tmpZhenti= utils_handler::rand_result($zhentiRs, $questionCount);
				
				$questionIdTmp = array();
				if(count($tmpZhenti)){
					foreach ($tmpZhenti as $key=>$value){
							$questionIdTmp[] = $value['question_id'];
					}
					
				}
				
				$questionIds = '"'.implode('","', $questionIdTmp).'"';
				
				$sql = <<<SQL
				
				
									select  * from  $tableName1  tt1  INNER JOIN  $tableName2 tt2  on  tt1.gid=tt2.gid  
									
									and tt2.gid in ($questionIds) 
									
									INNER JOIN (

									select t2.question_id,t2.exam_id ,t1.name  from  $tableName3 t1  

									INNER JOIN  $tableName4 t2 on t1.id=t2.exam_id  

									and  t2.question_id in ($questionIds) )  tt3  on  tt1.gid=tt3.question_id

				
SQL;

				/**
				 * 				
				上面是优化的接口
				
				SELECT * ,a.dbtype,edu_question_type.type_name,$tableName3.name as zhenti_name  FROM $tableName2 
				
				LEFT JOIN $tableName1 ON $tableName2.gid=$tableName1.gid
				 
				LEFT JOIN edu_question_type ON edu_question_type.id=$tableName2.question_type
				
				LEFT JOIN $tableName4 ON $tableName4.question_id=$tableName1.gid
				
				LEFT JOIN $tableName3 ON $tableName3.id=$tableName4.exam_id 
				
				 join (select 1 as dbtype) a on $dbtype=$dbtype
				 
				 
				WHERE  $tableName4.question_id in ($questionIds);
				 */
				
//				echo $sql;
//				exit;
			$this->db->sql = $sql;
			$this->db->Query();
			$rs = $this->db->rs;
			
			/**
			 * 以下是为移动端做的数据处理 添加type值
			 */
			
			$result = utils_handler::set_ti_result($rs);
			return $result;
	}
	
	public function get_stat_level($userId,$examId,$subjectId,$sectionId){
		$this->db->sql = <<<SQL
									select * from tblstudent_level_study where user_id=$userId and subject_id=$subjectId and section_id=$sectionId  and exam_id=$examId
									order by create_date desc;
SQL;
		$this->db->Query();
		$rs1 = $this->db->rs;
		$result['my_level'] = $rs1;
		
		
		$this->db->sql = <<<SQL
									select level,count(*) as num from tblstudent_level_study 
									where subject_id=$subjectId and section_id=$sectionId  and exam_id=$examId
									group by level ;
SQL;
		$this->db->Query();
		$rs2 = $this->db->rs;
		$result['online_level_stat'] = $rs2;

		return $result;
	}
	
	public function post_add_ticool_user_history($userId,$data){
		global $DBCFG;
		$content = $data['content'];
		$subjectId = $data['subject_id'];
		if(count($content)>0){
			foreach ($content as $key=>$value){
				$tiId = $value['id'];
				$dbtype = $value['dbtype'];
				$tiInfo = $this->get_ti_info($tiId, $subjectId, $dbtype);
				$userHistory[$key]['tid'] = $value['id'];
				$userHistory[$key]['uid'] = $userId;
				$userHistory[$key]['assign_id'] = 0;
				$userHistory[$key]['time_start'] = date('Y-m-d H:i:s',time());//开始时间
				$userHistory[$key]['time_end'] = date('Y-m-d H:i:s',time());//结束时间
				$userHistory[$key]['answer'] = $value['answer']?$value['answer']:'无';
				$userHistory[$key]['correct'] = $value['flag']?'1':'0';
				$userHistory[$key]['question_type'] = $tiInfo['question_type'];
				$userHistory[$key]['score'] = $value['score'];
				$userHistory[$key]['objective_flag'] = $value['obj'];
				$userHistory[$key]['comefrom'] = '';
				$userHistory[$key]['attachment'] = '';
				$userHistory[$key]['type'] = '';
				$userHistory[$key]['subject_id'] = $subjectId;
				$userHistory[$key]['dbtype'] = $value['dbtype'];
			}
		
			$this->db->switchDB ( $DBCFG['default_local']['dbhost'] , $DBCFG['default_local']['dbname'] , $DBCFG['default_local']['dbuser'] , $DBCFG['default_local']['dbpasswd']);
			$this->db->Inserts($table='ticool_user_history', $userHistory);
			if($this->db->rs===false){
				return false;
			}else{
				return true;
			}
		}else{
			return false;
		}
	}

	
	public function get_stat_zhuanti_users($examId,$subjectId,$sectionId){
		global $DBCFG;
		$this->db->switchDB ( $DBCFG['default_local']['dbhost'] , $DBCFG['default_local']['dbname'] , $DBCFG['default_local']['dbuser'] , $DBCFG['default_local']['dbpasswd']);
		$this->db->sql = <<<SQL
		select difficulty,count(*) as num 
		from stat_zhuanti_user 
		where zhuanti_id='$examId' 
		and difficulty!=0 and section_id=$sectionId 
		and subject_id=$subjectId 
		group by zhuanti_id,difficulty 
		order by difficulty desc;
SQL;
		$this->db->Query();
		
		$difficulty =array(5,4,3,2,1);
		$result = $this->db->rs;
		$tmp = array();
		if(count($result)>0){
			foreach ($difficulty as $k=>$v){
				$qnum = 0;
				foreach ($result as $key=>$value){
					if($value['difficulty']==$v){
						$tmp[$k]=$value;
					}else{
						$qnum++; 
					}
				}
				if($qnum==count($result)){//辉哥 @do 
					$tmp[$k]['difficulty']=$v;
					$tmp[$k]['num']=0;
				}
			}
		}
		
		return $tmp;
	}
	
	
	public function get_stat_zhuanti_user_levels($examId,$subjectId,$sectionId){
		global $DBCFG;
		$this->db->switchDB ( $DBCFG['default_local']['dbhost'] , $DBCFG['default_local']['dbname'] , $DBCFG['default_local']['dbuser'] , $DBCFG['default_local']['dbpasswd']);
		$this->db->sql = <<<SQL
									select level,count(*) as num from tblstudent_level_study 
									where subject_id=$subjectId and section_id=$sectionId  and exam_id=$examId
									group by level ;
SQL;
		$this->db->Query();
		$result = $this->db->rs;
		$difficulty =array(5,4,3,2,1);
		$result = $this->db->rs;
		$tmp = array();
		if(count($result)>0){
			foreach ($difficulty as $k=>$v){
				$qnum = 0;
				foreach ($result as $key=>$value){
					if($value['level']==$v){
						$tmp[$k]=$value;
					}else{
						$qnum++; 
					}
				}
				if($qnum==count($result)){//辉哥 @do 
					$tmp[$k]['level']=$v;
					$tmp[$k]['num']=0;
				}
			}
		}
		
		return $tmp;
		
	}
	
	public function get_student_study_level($userId,$examId,$subjectId,$sectionId,$offset,$step){
		$this->db->sql=<<<SQL
				select level,create_date,exam_type from tblstudent_level_study where user_id=$userId and exam_id=$examId and subject_id=$subjectId and section_id=$sectionId

				order by create_date asc 
SQL;

		if($offset||$step){
			$this->db->sql.=<<<SQL
				limit $offset,$step;
SQL;
		}
			$this->db->Query();
			return $this->db->rs;
	}
	
	public function get_stat_exercise_period($userId,$classId,$subjectId,$startTime,$endTime){
		$sql = <<<SQL
					select my_score,content,create_date,type from study_exercise 
					where user_id=$userId 
					and class_id=$classId 
					and subject_id=$subjectId and type=3
SQL;

		$where = '';
		if($startTime){
			$where .= <<<SQL
					and unix_timestamp(create_date)>=unix_timestamp('$startTime')
SQL;
		}
		
		if($endTime){
			$where .= <<<SQL
				and unix_timestamp(create_date)<=unix_timestamp('$endTime')
SQL;
		}
		
		$order = <<<SQL
		  		order by create_date asc
SQL;
			$this->db->sql = $sql.$where;
			$this->db->Query();
			$result = $this->db->rs;
			$zhuantiArray = array();
			$questonKnowledgeCount = array();
			if(count($result)>0){
				foreach ($result as $key=>$value){
						$content = $value['content'];
						$content = json_decode(base64_decode($content),true);
						/**
						 * obj=0 主观题  1 客观题
						 */
						if(count($content)>0){
							foreach ($content as $k=>$v){
								$tiId = $v['id'];
								$dbtype = $v['dbtype'];
								$obj = $v['obj'];
								$objJudge = $v['obj_Judge'];
								$answer = trim($v['answer']);
								
//								echo '<pre>';
//								print_r($content);
								$tiInfo =$this->get_ti_info($tiId, $subjectId, $dbtype);
								$objectiveAnswer = trim($tiInfo['objective_answer']);
								$knowledgeId = $tiInfo['knowledge_id'];
								
								$zhuantiInfo = $this->get_zhuanti_info_by_knowledge_id($knowledgeId, $subjectId, $dbtype);
								$zhuantiId = $zhuantiInfo['id'];
								$zhuantiInfo['dbtype'] = $dbtype;
								$knowledgeList = explode(',', $zhuantiInfo['knowledge_id']);
								
								if($obj=='0'){
									if($objJudge=='1'){
										$questonKnowledgeCount[$zhuantiId][$knowledgeId]['do_count']++;
										//对
									}else{
										//错
										$questonKnowledgeCount[$zhuantiId][$knowledgeId]['do_count']++;
										$questonKnowledgeCount[$zhuantiId][$knowledgeId]['wrong_count']++;
									}
								}
								else{
									if($answer==$objectiveAnswer){
										$questonKnowledgeCount[$zhuantiId][$knowledgeId]['do_count']++;
										//对
									}else{
										//错
										$questonKnowledgeCount[$zhuantiId][$knowledgeId]['do_count']++;
										$questonKnowledgeCount[$zhuantiId][$knowledgeId]['wrong_count']++;
									}
								}
								

								foreach ($knowledgeList as $k1=>$v1){
									
									
									$knowledge = array();
									$kId = $v1;
									$knowledge['konwledge_id'] = $kId;
									$knowlegeInfo = $this->get_knowledge_info_by_knowledge_id($kId, $subjectId, $dbtype);
									$knowledge['konwledge_name'] = $knowlegeInfo['name'];
									$knowledge['question_do_count']= 0;
									$knowledge['question_wrong_count']=0;
									$knowledgeList[$k1] = $knowledge;
								}
								$zhuantiInfo['knowledge_list'] = $knowledgeList;
								$zhuantiInfo['question_do_count'] = 0;
								$zhuantiInfo['question_wrong_count'] = 0;
								$knowledgeCount =array();

								array_push($zhuantiArray,  $zhuantiInfo);
								
							}
						}
				}
				
			}
			
			$zhuantiArray = utils_handler::assoc_unique($zhuantiArray, $key='id');
			ksort($questonKnowledgeCount);
//			print_r($zhuantiArray);
//			print_r($questonKnowledgeCount);
//			exit;
			/**
			 * 将数据放到knowledgeList 里面
			 */
			foreach ($zhuantiArray as $key=>$value){
				$zhuantiId = $value['id'];
				$knowledgeList = $value['knowledge_list'];
				foreach ($questonKnowledgeCount as $k=>$v){
					if($zhuantiId==$k){//专题ID 相等
							$questionDoCount = 0;
							$questionWrongCount = 0;
							foreach ($knowledgeList as $k1=>$v1){
									$knowledgeId = $v1['konwledge_id'];
									$zhuantiArray[$key]['knowledge_list'][$k1]['question_do_count']=$v[$knowledgeId]['do_count']?$v[$knowledgeId]['do_count']:0;
									$zhuantiArray[$key]['knowledge_list'][$k1]['question_wrong_count']=$v[$knowledgeId]['wrong_count']?$v[$knowledgeId]['wrong_count']:0;
									foreach ($v as $k2=>$v2){
										if($knowledgeId==$k2){
											$questionDoCount +=$v2['do_count'];
											$questionWrongCount +=$v2['wrong_count'];
											
										}else{
										}
									}
							}
						
						
					}
				}
				
				$zhuantiArray[$key]['zhuanti_id'] = $zhuantiArray[$key]['id'];
				$zhuantiArray[$key]['zhuanti_name'] = $zhuantiArray[$key]['name'];
				unset($zhuantiArray[$key]['id']);
				unset($zhuantiArray[$key]['name']);
				unset($zhuantiArray[$key]['subject_id']);
				unset($zhuantiArray[$key]['section_id']);
				unset($zhuantiArray[$key]['grade_id']);
				unset($zhuantiArray[$key]['level']);
				unset($zhuantiArray[$key]['sort_id']);
				unset($zhuantiArray[$key]['knowledge_id']);
				unset($zhuantiArray[$key]['version_id']);
				unset($zhuantiArray[$key]['parent_id']);
				unset($zhuantiArray[$key]['ti_total_count']);
				$zhuantiArray[$key]['question_do_count'] = $questionDoCount;
				$zhuantiArray[$key]['question_wrong_count'] = $questionWrongCount;
			}
			return $zhuantiArray;
	}
}
