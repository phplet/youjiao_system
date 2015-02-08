<?php
///////////////////////////////////////////////////////
// 查询接口
// by XIAOKUN v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	
	class crest extends REST{
		public function doGET(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$exerciseHandler = new exercise_handler();
			$examHandler = new exam_paper_handler();
			$action = $this->r('action');
			$subjectId = $this->r('subject_id');
			$tblEaxm = $this->get_examination_tbl($subjectId);
			$tblEaxmIndex = $tblEaxm.'_index';
			if(isset($_REQUEST['objective_flag'])){
				$objectiveFlag = intval($this->r('objective_flag'));
			}
			$difficulty = $this->r('difficulty');
			switch($action){
				case 'sync': //同步
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = $this->r('countperpage');
					$chapterArr = $this->r('chapter_id');
					$this->get_sync_examination_list($tblEaxm, $tblEaxmIndex, $pageNo*$countPerPage,$countPerPage,$chapterArr,$objectiveFlag,$difficulty);
					break;
				case 'zhenti': //真题exam_examination
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = $this->r('countperpage');
					$privinceId =$this->r('province_id');
					$gradeId = $this->r('section_id');
					$yearArr = $this->r('yeares');
					$this->get_zhenti_examination_list($tblEaxm, $tblEaxmIndex, $pageNo*$countPerPage,$countPerPage,$privinceId,$yearArr,$subjectId,$gradeId,$objectiveFlag,$difficulty);
					break;
				case 'zhuanti'://专题  edu_zhuanti
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = $this->r('countperpage');
					$zhuantiArr = $this->r('special_id');
					$this->get_zhuanti_examination_list($tblEaxm, $tblEaxmIndex, $pageNo*$countPerPage,$countPerPage,$zhuantiArr,$objectiveFlag,$difficulty);
					break;
				case 'paper'://查看试卷
					$paperIdArr =$this->r('paper_id');
					$studyExerciseId = $this->r('study_exercise_id');
					 
					$submitNum = $exerciseHandler->get_student_submit_count($studyExerciseId);
					
					$this->b['submit_num'] = $submitNum?$submitNum:'0';
					//$this->b["aa"]=$_REQUEST["paper_id"];
					//$this->b["bb"]=$_REQUEST["subject_id"];
					$this->get_paper($tblEaxm,$tblEaxmIndex,$paperIdArr);
					
					break;
				case 'list': //获取试卷列表
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = $this->r('countperpage');
					$this->get_exam_list($pageNo*$countPerPage,$countPerPage);
					break;
				case 'time': //根据下拉时间点获取试卷类表
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = $this->r('countperpage');
					$this->get_exam_list($pageNo*$countPerPage,$countPerPage);
					break;
				case 'search'://搜索
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = $this->r('countperpage');
					$this->get_exam_list($pageNo*$countPerPage,$countPerPage);
					break;
				case 'difficulty': //自动组卷 随即获取试题，随即难易度
					$gradeId = $this->r('grade_id');
					$this->get_examination($tblEaxm, $tblEaxmIndex,$subjectId,$gradeId);
					break;
				case 'change_question'://更换试题
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = $this->r('countperpage');
					$this->change_question($tblEaxm, $tblEaxmIndex,$pageNo*$countPerPage,$countPerPage);
					break;
				case 'query_curriculumndb':
					$this->query_curriculumndb();
					break;
				case 'get_edu_grade':
					$this->get_edu_grade();
					breaK;
				case 'get_exam_examination_info':
					$this->get_exam_examination_info();
					break;
				case 'get_exam_examination_paper':
					$this->get_exam_examination_paper($tblEaxm, $tblEaxmIndex);
					break;
				case 'remove_examination_paper'://删除组卷
					$this->remove_examination_paper();
					break;
				case 'get_share_exam':
					$subjectId = $this->r('subject_id');
					$centerId = $this->r('center_id');
					$zoneId = $this->r('zone_id');
					$examType = $this->r('exam_type');
					$rs = $examHandler->get_share_exam_center_zone($subjectId, $centerId, $zoneId,$examType);
					$this->b['count']=$rs['count'];
					$this->b['list']=$rs['list'];
					break;
					
				
			}
		}
		
		
		public function doPOST(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			$action = $this->r('action');
			$examHandler = new exam_paper_handler();
			switch($action){
				case 'create':
					break;
				case 'feedback':
					$this->feedback();
					break;
				case 'maual':
					$this->makeMaual();
					break;
				case 'create_word':
					$exerciseid =$this->r('ti_id');
					$this->creatword($this->r('content'), $exerciseid);
//					$this->creatPDF($this->r('content'), $exerciseid);
					break;
				case 'dispatch':
					$this->dispatch_paper();
					break;
				case 'dispatch_entrance_tests':
					 $teacherUserId = $this->vr['id'];
					 $teacherRealName = $this->vr['realname'];
					 $favExamAssign = $this->r('fav_exam_assign');
					 $examIdStr = $this->r('exam_info');
					 $examType = $this->r('exam_type');
					 $favId =$this->r('fav_id');
					 $centerId = $this->r('center_id');
					 $zoneId = $this->r('zone_id');
					 $assignType = $this->r('assign_type');
					 $assignMode = $this->r('assign_mode');
					 $assignTo = $this->r('assign_to') ;
					 $endDate = $this->r('end_date');
					 $result = $examHandler->dispatch_paper($teacherUserId, $teacherRealName, $favExamAssign, $examIdStr,$examType,$favId, $centerId, $zoneId, $assignType, $assignMode,$assignTo, $endDate);
					$this->b['sc'] = $result['sc'];         
					$this->b['reason'] = $result['reason'];
					 break;
			}
		}
		
		
		//获取同步试题
		public function get_sync_examination_list($tblEaxm,$tblEaxmIndex,$offset,$step,$chatperArr,$objectiveFlag,$difficulty){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			$eduInfo = $this->get_edu_info($this->r('subject_id'));
			$chatperSql = 'select content from '.$eduInfo[ 'edu_chapter'];
 			$chapterArr = $this->r('chapter_id' );
             $chatperSql = 'select id from '.$eduInfo[ 'edu_chapter'];
      		 if(count($chapterArr)>0){
                     $chatperStr = implode(',' , $chapterArr);
                      $where = ' WHERE id in('.$chatperStr. ')';
                }
               if($where!= ''){
                     $chatperSql = $chatperSql.$where;
                }
             	$this-> db-> sql = $chatperSql;
              	 mysql_query( 'set names utf8');
                 $this-> db->Query();
                 $chapterRs = $this->db ->rs ;
                 
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
               $chatperIdSql = 'select question_id from '.$eduInfo[ 'edu_chapter2question']. ' where chapter_id in(' .$chatperStr.')' ;
               $this-> db-> sql = $chatperIdSql;
               $this-> db->Query();
               $rs = $this->db ->rs ;
                foreach ($rs as $key=>$value){
                   $tblQuestionIdArr[] = $value['question_id' ];
                 }
                 $questionStr = '"' .implode('","' , $tblQuestionIdArr).'"' ;
                 $where= ' where  '.$tblEaxmIndex. '.gid in('.$questionStr. ')';
              }           
			
			
			if(isset($objectiveFlag)){
				$where.=' AND '.$tblEaxmIndex.'.objective_flag='.$objectiveFlag;
			}
			
			if(isset($difficulty)){
				$where.=' AND '.$tblEaxmIndex.'.difficulty='.$difficulty;
			}
			/**
			 * 在选择类型的时候使用
			 */
			if($this->r('question_type')){
				$where.=' AND '.$tblEaxmIndex.'.question_type="'.$this->r('question_type').'"';
			}
			/**
			 * 知识点的选择
			 */
			if($this->r('zh_knowledge')){
				$where.=' AND '.$tblEaxmIndex.'.zh_knowledge="'.$this->r('zh_knowledge').'"';
			}
			/**
			 * 去除已经选择的数据
			 */
			if($this->r('ids')){
				$where.=' AND '.$tblEaxm.'.gid not in ('.$this->r('ids').')';
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
			$this->b['list'] = $this->db->rs;
			
			
			$examinationNumSql =<<<SQL
			select count(*) as num 
			from $tblEaxmIndex LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
SQL;
			$this->db->sql = $examinationNumSql.$where;	
			$this->db->Query();
			$num = $this->db->rs;
			$this->b['count'] =$num[0]['num'] ;
			$this->b['sc'] = 200;
		}
	//获取专题
		public function get_zhuanti_examination_list($tblEaxm, $tblEaxmIndex, $offset,$step,$zhuantiArr,$objectiveFlag,$difficulty){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
//			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);

//				$s = '77';
				$sectionId = $this->r('section_id');
				$zhuantiArr = $this->r('special_id');

				$subjectId= $this->r('subject_id');
				$eduInfo = $this->get_edu_info($subjectId);
                $eduZhuanti = $eduInfo['edu_zhuanti'];

				//$zhuantiSql = 'select knowledge_list from edu_zhuanti';
				$zhuantiSql = 'select knowledge_list from '.$eduZhuanti;
				if(count($zhuantiArr)>0){
					$zhuantiStr = implode(',', $zhuantiArr);
					$where = ' WHERE id in('.$zhuantiStr.') and section_id='.$sectionId;
				}
			if($where!=''){
				$zhuantiSql = $zhuantiSql.$where;
			}
			$this->db->sql = $zhuantiSql;
			$this->db->Query();
			
			$this->b["sql"]=$zhuantiSql;
			
			$zhuantiRs = $this->db->rs;
			$tblIdArr = array();
//			print_r($zhuantiRs);
//			exit;
			foreach ($zhuantiRs as $key=>$value){
//				$content = json_decode($value['content'],true);
				$list = $value['knowledge_list'];
				$tblIdArr[] = explode(';', $list);
//				$tblIdArr[] = $list;
//				$listArr = explode(';', $list);
//				foreach ($listArr as $k=>$v){
//					$tblIdArr[] = $v;
//				}
			}
			
			foreach ($tblIdArr as $key=>$value){
				foreach ($value as $v){
					$tblIdTmpArr[] = $v;
				}
			}
			$sql =<<<SQL
			select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,$tblEaxm.image,edu_question_type.type_name
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
			LEFT JOIN edu_question_type on edu_question_type.id=$tblEaxmIndex.question_type
SQL;
			if(count($tblIdTmpArr)>0){
				$str = '"'.implode('","', $tblIdTmpArr).'"';
				$where = ' WHERE '.$tblEaxmIndex.'.zh_knowledge in('.$str.')';
			}
			
//			echo $objectiveFlag;
			if(isset($objectiveFlag)){
				$where.=' AND '.$tblEaxmIndex.'.objective_flag='.$objectiveFlag;
			}
			
			if(isset($difficulty)){
				$where.=' AND '.$tblEaxmIndex.'.difficulty='.$difficulty;
			}
			/**
			 * 在选择类型的时候使用
			 */
			if($this->r('question_type')){
				$where.=' AND '.$tblEaxmIndex.'.question_type="'.$this->r('question_type').'"';
			}
			/**
			 * 知识点的选择
			 */
			if($this->r('zh_knowledge')){
				$where.=' AND '.$tblEaxmIndex.'.zh_knowledge="'.$this->r('zh_knowledge').'"';
			}
			/**
			 * 去除已经选择的数据
			 */
			if($this->r('ids')){
				$where.=' AND '.$tblEaxm.'.gid not in ('.$this->r('ids').')';
			}
//			echo $where;
			if(!$offset && !$step){
					$limit = '';
				}else{
					$limit = ' LIMIT '.$offset.','.$step;
				}
				
			$examinationSql = $sql.$where.$limit;
			$this->db->sql = $examinationSql;	
//		echo $examinationSql;
//		exit;

			mysql_query('set names utf8');
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
			
			$examinationNumSql =<<<SQL
			select count(*) as num 
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
SQL;
			$this->db->sql = $examinationNumSql.$where;	
//			echo $examinationSql;
//			exit;

			mysql_query('set names utf8');
			$this->db->Query();
			$num = $this->db->rs;
			$this->b['count'] =$num[0]['num'] ;
			
			$this->b['sc'] = 200;
		}
		//获取真题
		public function get_zhenti_examination_list($tblEaxm, $tblEaxmIndex, $offset,$step,$privinceId,$yearArr,$subjectId,$gradeId,$objectiveFlag,$difficulty){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
//			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
//			echo '<pre>';
//			print_r($this->db);
//			exit;
				$eduInfo = $this->get_edu_info($subjectId);
                $examExamination2question = $eduInfo['exam_examination2question' ];
                $examExamination = $eduInfo[ 'exam_examination' ];
			
				$sectionId = $this->r('section_id');
				$zhentiSql = <<<SQL
				 select id from $examExamination 
SQL;

				if(count($yearArr)>0){
					$yearStr = '"'.implode('年","', $yearArr).'年"';
					$zhentiSql .= ' WHERE year in('.$yearStr.') AND subject_id='.$subjectId.' AND section_id='.$sectionId;
				}
				
				if(count($privinceId)>0){
					$privinceId = '"'.implode('","', $privinceId).'"';
					$zhentiSql .=' AND province_id in('.$privinceId.')';
				}
				if($where!=''){
					$zhentiSql = $zhentiSql;
				}
			$this->db->sql = $zhentiSql;
//			echo $zhentiSql;
//			exit;
			mysql_query('set names utf8');
			$this->db->Query();
			$zhentiRs = $this->db->rs;
			$tblIdArr = array();
			foreach ($zhentiRs as $key=>$value){
					$examId = $value['id'];
					$examination2questionSql = 'select question_id from '.$examExamination2question.' where exam_id='.$examId.';';
//					echo $examination2questionSql;
					$this->db->sql = $examination2questionSql;
					$this->db->Query();
					$examIdRs = $this->db->rs;
//					$content = json_decode($value['content'],true);
//					$list = $content['list'];
	//				$list = $value['knowledge_list'];
					foreach ($examIdRs as $k=>$v){
						$tblIdArr[] = $v['question_id'];
					}
				}
			
			
			$sql =<<<SQL
			select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,$tblEaxm.image,edu_question_type.type_name 
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
			LEFT JOIN edu_question_type ON edu_question_type.id=$tblEaxmIndex.question_type
SQL;
			if(count($tblIdArr)>0){
				$str = '"'.implode('","', $tblIdArr).'"';
				$where.= ' WHERE '.$tblEaxmIndex.'.gid in('.$str.')';
			}
			
			
			if(isset($objectiveFlag)){
				$where.=' AND '.$tblEaxmIndex.'.objective_flag='.$objectiveFlag;
			}
			
			if(isset($difficulty)){
				$where.=' AND '.$tblEaxmIndex.'.difficulty='.$difficulty;
			}
			
			/**
			 * 在选择类型的时候使用
			 */
			if($this->r('question_type')){
				$where.=' AND '.$tblEaxmIndex.'.question_type="'.$this->r('question_type').'"';
			}
			/**
			 * 知识点的选择
			 */
			if($this->r('zh_knowledge')){
				$where.=' AND '.$tblEaxmIndex.'.zh_knowledge="'.$this->r('zh_knowledge').'"';
			}
			/**
			 * 去除已经选择的数据
			 */
			if($this->r('ids')){
				$where.=' AND '.$tblEaxm.'.gid not in ('.$this->r('ids').')';
			}
//			echo $where;

			if(!$offset && !$step){
					$limit = '';
				}else{
					$limit = ' LIMIT '.$offset.','.$step;
				}
				
			$examinationSql = $sql.$where.$limit;
			$this->db->sql = $examinationSql;	
//			echo $examinationSql;
//			exit;
			mysql_query('set names utf8');
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
			
			$examinationNumSql =<<<SQL
			select count(*) as num 
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
SQL;
			$this->db->sql = $examinationNumSql.$where;	
//			echo $this->db->sql ;
			mysql_query('set names utf8');
			$this->db->Query();
			$num = $this->db->rs;
			$this->b['count'] =$num[0]['num'];
			
			$this->b['sc'] = 200;
		}
		
		//更换试题
		public function change_question($tblEaxm, $tblEaxmIndex, $offset,$step){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			
			//$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$sql =<<<SQL
			select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,$tblEaxm.image,edu_question_type.type_name 
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
			LEFT JOIN edu_question_type ON edu_question_type.id=$tblEaxmIndex.question_type
SQL;
			
			/**
			 * 在选择类型的时候使用
			 */
			if($this->r('question_type')){
				$where.=' where '.$tblEaxmIndex.'.question_type="'.$this->r('question_type').'"';
			}
//			echo $objectiveFlag;
			if(isset($objectiveFlag)){
				$where.=' AND '.$tblEaxmIndex.'.objective_flag='.$objectiveFlag;
			}
			
			if(isset($difficulty)){
				$where.=' AND '.$tblEaxmIndex.'.difficulty='.$difficulty;
			}
			
			if($this->r('ids')){
				$where.=' AND '.$tblEaxmIndex.'.gid not in ('.$this->r('ids').')';
			}

			/**
			 * 知识点的选择
			 */
			if($this->r('zh_knowledge')){
				$where.=' AND '.$tblEaxmIndex.'.zh_knowledge="'.$this->r('zh_knowledge').'"';
			}
//			echo $where;
			if(!$offset && !$step){
					$limit = '';
				}else{
					$limit = ' LIMIT '.$offset.','.$step;
				}
				
			$examinationSql = $sql.$where.$limit;
			mysql_query('set names utf8');
			$this->db->sql = $examinationSql;	
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
			//$this->b["sql1"]=$sql;
			
			$examinationNumSql =<<<SQL
			select count(*) as num 
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
SQL;
			mysql_query('set names utf8');
			$this->db->sql = $examinationNumSql.$where;	
			$this->db->Query();
			$num = $this->db->rs;
			//$this->b["sql2"]=$sql;
			$this->b['count'] =$num[0]['num'] ;
			$this->b['sc'] = 200;
		}
		//获取试卷
		public function get_paper($tblEaxm,$tblEaxmIndex,$paperIdArr){
				require_once(dirname(__FILE__)."/../include/w.php");
				require_once(dirname(__FILE__)."/../include/config.php");
			if($this->r('newtest')){
				$studentExercise = array();
				$studentExercise['type'] = 4; //学生查看试卷以后将试卷的状态值更新为4（正在做）
				$studentExercise['log_time'] = 'current_timestamp()'; //学生查看试卷以后将试卷的状态值更新为4（正在做）
				$this->db->Update('study_exercise', $studentExercise,'id='.$this->r('study_exercise_id'));
			}
			$paperIds = json_decode($paperIdArr,true);
			$result1 = array();
			$result2 =array();
			foreach ($paperIds as $key=>$value){
				if($value['dbtype']==1&&$value['ids']){
					$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
					$sql =<<<SQL
			select $tblEaxmIndex.*,$tblEaxm.content,$tblEaxm.objective_answer,
			$tblEaxm.answer,$tblEaxm.image,a.dbtype,
			edu_question_type.type_name
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
							$where = ' WHERE '.$tblEaxmIndex.'.gid in('.$str.')';
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
			
			if($this->r('create_exam_examination_word')){
				$i = 1;
				$fullMark = $rs['score']?$rs['score']:'100';
//				$aa = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>评测卷生成时间".date('Y-m-d')."</title></head><body><h1>".urldecode($this->r('exam_name'))."</h1><hr>";
				$aa = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>评测卷生成时间".date('Y-m-d')."</title><style type='text/css'>;</style></head><body style='margin-left:85px;margin-right:85px;'><h1 style='text-align: center;'>".urldecode($this->r('exam_name'))."</h1><p style='text-align: center;'>满分：".$fullMark."</p><p style='text-align: center;'>学校 __________  班级 __________  学生 __________</p>";
				
				
				foreach($result as $v){
					$score =  intval($v['score']);
					$typeName = $v['type_name'];
					$aa .= "<p style='font-size:16px;font-weight:bold;'>".$typeName."";
					$match = null;
					$v ['content'] = str_replace ( "MypicPath\\", "", $v ['content'] );
					preg_match_all ( "/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $v ['content'], $match );
					 $contentPicTmp = array ();
	                 $answerPicTmp = array ();
	                 foreach ($match[1] as $k=>$w){
	                    $picArr[ 'file']  = rand ();
	                    $img = explode(',' , $w);
	                    $picArr[ 'pic'] = $img[ '1'];
	                    array_push($contentPicTmp,  $picArr);
	                  }
	                  $v ['answer' ] = str_replace ( "MypicPath\\" , "" , $v ['answer' ] );
	                  preg_match_all ( "/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i" , $v ['answer' ], $match1 );
	                  foreach ($match1[1] as $k=>$w){
	                      $picArr[ 'file']  = rand ();
	                      $img = explode(',' , $w);
	                      $picArr[ 'pic'] = $img[ '1'];
	                      array_push($answerPicTmp,  $picArr);
	                  }
					foreach ( $match [0] as $k => $w ) {
						$qq = $contentPicTmp;
						for($j = 0; $j < count ( $qq ); $j ++) {
							if ((strstr ( $match [1] [$k], 'data:image/gif;base64,'.$qq [$j] ['pic'] ) != false)||(strstr ( $match [1] [$k], 'data:image/jpg;base64,'.$qq [$j] ['pic'] ) != false)) {// 猥琐方法 暂时使用
								$name = "http://" . rand () . $qq [$j] ['file'];
								$v ['content'] = str_replace ( $match [0] [$k], '<img src="' . $name . '">', $v ['content'] );
								$filearr [$name] = base64_decode ( $qq [$j] ['pic'] );
								break;
							}
						}
					}
										
					$v ['answer'] = str_replace ( "MypicPath\\", "", $v ['answer'] );
					preg_match_all ( "/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $v ['answer'], $match1 );
					foreach ( $match1 [0] as $k => $w ) {
					$qq = $answerPicTmp;
					for($j = 0; $j < count ( $qq ); $j ++) {
						if ((strstr ( $match1 [1] [$k], 'data:image/gif;base64,'.$qq [$j] ['pic'] ) != false)||(strstr ( $match1 [1] [$k], 'data:image/jpg;base64,'.$qq [$j] ['pic'] ) != false)) {// 猥琐方法 暂时使用
									$name = "http://" . rand () . $qq [$j] ['file'];
									$v ['answer'] = str_replace ( $match1 [0] [$k], '<img src="' . $name . '">', $v ['answer'] );
									$filearr [$name] = base64_decode ( $qq [$j] ['pic'] );
									break;
									}
								}
							}
						$aa .= "<div class='content'>".$i++.'、'.$v['content']."</div><br>";
						if($this->r('with_answer')){ //选择带有解析
							if(trim($v['objective_answer'])!=''){
										$aa .= "<p style='font-weight:bold;background-color: #cecece;'>参考答案：".trim($v['objective_answer'])."</p>";
							}
							if($v['answer']!=''){
										$aa .= "<p style='font-weight:bold;background-color: #cecece;'>解析：".strip_tags($v['answer'])."</p>";
									}
							}
					}
				$aa .= "</body></html>";
				$mht = new MhtFileMaker(); 
				$mht->AddContents("tmp.html",$mht->GetMimeType("tmp.html"),$aa); 
	 			if(is_array($filearr)) {
					foreach($filearr as $kkk => $vvv){
						$mht->AddContents($kkk,$mht->GetMimeType($kkk),$vvv); 
					}
				}
				$fileContent = $mht->GetFile();
				$subjectName = $this->get_subject_name($this->vr['subject_id']);
				$filename = $subjectName.'_'.time();
				$file = $this->webroot.'/word/'.$filename.".doc";
				$fp = fopen($file, 'w'); 
				fwrite($fp, $fileContent); 
				fclose($fp); 
				$this->b['url'] = $this->mywebpath.$filename.".doc";
			}
			 
			$this->b['list'] = $result;
			$this->b['sc'] = 200;
		}
		
		
			//加入题目反馈
		private function feedback(){
			$arr['userid'] = $this -> vr['id'];
			$arr['feedtime'] = 'current_timestamp()';
			$arr['content'] = $this -> r('content');
			$arr['ti_id'] = $this -> r('ti_id');
			$arr['db_name'] = $this->r('db_name');
			$rs = $this -> db -> Insert('ti_feedback',$arr);
			if($rs){
				$this -> b["sc"] = 201;
			}else{
				$this -> b["reason"] = 'insert into ti_feedback failed';
			}
		}
	
	//组卷
		private function makeMaual(){
			require_once(dirname(__FILE__)."/../include/stat.php");
			$stat =new statManager();
			$month =intval(date('m'));
			$year = intval(date('Y'));
			if($this -> vr['pass'] && $this -> vr['usr_type']==2){
				$arr['teacher_id'] = (int)$this -> vr['id'];
				$arr['name'] = $this ->r('exam_name');
				$arr['exam_type'] = (int)$this -> r('exam_type');			
				$arr['center_id'] = (int)$this ->r('center_id');
				$arr['zone_id'] = (int)$this ->r('zone_id');
				$arr['subject_id'] = (int)$this -> r('subject_id');
				$arr['grade'] = (int)$this -> r('grade_id');		
				$arr['build_type'] = intval($this->r('build_type'));//手动
				$arr['can_share'] = intval($this->r('share_value'));
				$condition = $this->r('condition');			
				$arr['conditions'] = json_encode($condition);
				$arr['content'] = json_encode($this -> r('content'));
				$arr['score'] = $this->r('score');
				$arr['favorited'] = '0';
				$arr['difficulty'] = $this->r('difficulty');
				//'can_share'
				$arr['create_date'] = 'current_timestamp()';
//				print_r($arr);

				if($this->r('ti_id')){
					$sql = 'select assign_student_count from teach_exam_list where id='.$this->r('ti_id').';';
					$this->db->sql = $sql;
					$this->db->Query();
					$rs = $this->db->rs;
					if($rs[0]['assign_student_count']){ //更新不用数据统计
						$this->db->Insert('teach_exam_list', $arr);
						
						$exerciseid = $this->db->Last_id();
						
						$stat->update('teacher', 'total', array('teacher_id'=>$this -> vr['id'],'year'=>$year,'month'=>$month,'build_count'=>'1','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id')));
//						$stat->update('teacher', 'total', array('teacher_id'=>$this -> vr['id'],'year'=>$year,'month'=>$month,'build_count'=>'1','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id')));
					}else{
						$this->db->Update('teach_exam_list', $arr,'id='.$this->r('ti_id'));
						$exerciseid = $this->r('ti_id');
//						$stat->update('teacher', 'total', array('teacher_id'=>$this -> vr['id'],'year'=>$year,'month'=>$month,'build_count'=>'1','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id')));
					}
				}else{
					$this->db->Insert('teach_exam_list', $arr);
					$exerciseid = $this->db->Last_id();
					$stat->update('teacher', 'total', array('teacher_id'=>$this -> vr['id'],'year'=>$year,'month'=>$month,'build_count'=>'1','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id')));
//					$stat->update('teacher', 'total', array('teacher_id'=>$this -> vr['id'],'year'=>$year,'month'=>$month,'build_count'=>'1','center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id')));
				}
			
				$this->b['ti_id'] = $exerciseid;
				$this->b['content'] = $arr['content'];
//				$this->b['url'] = url;
				$this->b['sc'] = 201;
			}
		}
	
		private function get_exam_list($offset,$step){
			if($this -> vr['pass'] && $this -> vr['usr_type']==2){
				$teacherId = (int)$this -> vr['id'];
				$schoolId = (int)$this -> vr['center_id'];
				$zoneId = (int)$this -> vr['zone_id'];
				$schoolId = (int)$this -> r('center_id');
				$zoneId = (int)$this -> r('zone_id');
//				$sql = 'select * from teach_exam_list where teacher_id='.$teacherId.' and center_id='.$schoolId.' and zone_id='.$zoneId.'';
//				$numSql = 'select count(*) as num from teach_exam_list where teacher_id='.$teacherId.' and center_id='.$schoolId.' and zone_id='.$zoneId.'';
				$sql = 'select * from teach_exam_list where teacher_id='.$teacherId.' and center_id='.$schoolId.'';
				$numSql = 'select count(*) as num from teach_exam_list where teacher_id='.$teacherId.' and center_id='.$schoolId.'';
				$limit = ' LIMIT '.$offset.','.$step;
				if($this->r('time')){
					$interval = $this->r('time');
					if($interval){
						$time = date('Y-m-d H-i-s',strtotime('- '.$interval.'months'));
						$sql =$sql.' and unix_timestamp(create_date)>unix_timestamp("'.$time.'") and  unix_timestamp(create_date)<unix_timestamp(current_timestamp())';
						$numSql = $numSql.' and unix_timestamp(create_date)>unix_timestamp("'.$time.'") and  unix_timestamp(create_date)<unix_timestamp(current_timestamp())';
					}else{
						$sql=$sql.' and unix_timestamp(create_date)<unix_timestamp(current_timestamp())';
						$numSql=$numSql.' and unix_timestamp(create_date)<unix_timestamp(current_timestamp())';
					}
				}
				if($this->r('search')){
					$name = $this->r('search');
					$sql =$sql.' and name like "%'.$name.'%"';
					$numSql =$numSql.' and name like "%'.$name.'%"';
				}
				
				if($this->r('grade_id')){
					$sql =$sql.' and grade='.$this->r('grade_id').'';
					$numSql =$numSql.' and grade='.$this->r('grade_id').'';
				}
				$sql =$sql.'  order by create_date desc';
				$sql = $sql.$limit;
				$this->db->sql =$sql ;
				$this->db->Query();
				
				$rs = $this->db->rs;
				
				if(count($rs)>0){
					foreach ($rs as $key=>$value){
						$rs[$key]['stat_analyse']['assign_student_count'] = $value['assign_student_count']; //派送人数
//						$sql = 'select count(*) as num from study_exercise where type=3 and assign_id='.$value['id']; //已提交总数
//						$this->db->sql = $sql;

						if($value['exam_type']=='0'){ //作业 满分100
							$score = 100;
						}else{
							$score = $value['score'];
						}
						
						$scorePercent100 = $score*1;
						$scorePercent85 = $score*0.85;
						$scorePercent70 = $score*0.7;
						$scorePercent60 = $score*0.60; //计算百分比：按照学生作业批改计算 （type=3 已批改）
//						$sql = 'select count(*) as num from study_exercise where assign_id='.$value['id'].' and my_score='.$scorePercent100;
						$sql = 'select count(*) as num from study_exercise where type=3 and exercise_id='.$value['id'].' and my_score='.$scorePercent100;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent100Num = $result['num'];
						$rs[$key]['stat_analyse']['score_percent_100'] = $scorePercent100Num;
						
//						$sql = 'select count(*) as num from study_exercise where assign_id='.$value['id'].' and my_score<'.$scorePercent100.' and my_score>'.$scorePercent85;
						$sql = 'select count(*) as num from study_exercise where type=3 and exercise_id='.$value['id'].' and my_score<'.$scorePercent100.' and my_score>='.$scorePercent85;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent85OverNum = $result['num'];
						$rs[$key]['stat_analyse']['score_percent_85_over'] = $scorePercent85OverNum;
						
//						$sql = 'select count(*) as num from study_exercise where assign_id='.$value['id'].' and my_score<'.$scorePercent85.' and my_score>='.$scorePercent70;
						$sql = 'select count(*) as num from study_exercise where  type=3 and exercise_id='.$value['id'].' and my_score<'.$scorePercent85.' and my_score>='.$scorePercent70;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent70OverNum = $result['num'];
						$rs[$key]['stat_analyse']['score_percent_70_over'] = $scorePercent70OverNum;
						
						
						
//						$sql = 'select count(*) as num from study_exercise where assign_id='.$value['id'].' and my_score<'.$scorePercent70.' and my_score>='.$scorePercent60;
						$sql = 'select count(*) as num from study_exercise where type=3 and exercise_id='.$value['id'].' and my_score<'.$scorePercent70.' and my_score>='.$scorePercent60;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent60OverNum = $result['num'];
						$rs[$key]['stat_analyse']['score_percent_60_over'] = $scorePercent60OverNum;
						
//						$sql = 'select count(*) as num from study_exercise where assign_id='.$value['id'].' and my_score<'.$scorePercent60;
						$sql = 'select count(*) as num from study_exercise where type=3 and exercise_id='.$value['id'].' and my_score<'.$scorePercent60;
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$scorePercent60BelowNum = $result['num'];
						
						$rs[$key]['stat_analyse']['score_percent_60_below'] = $scorePercent60BelowNum;

						$sql = 'select count(*) as num from study_exercise where (type=3 or type=2) and exercise_id='.$value['id'];
						$this->db->sql = $sql;
						$this->db->Queryone();
						$result = $this->db->rs;
						$submitNum = $result['num'];
						$rs[$key]['stat_analyse']['unsubmit_num']  = $value['assign_student_count']-$submitNum;
//						$rs[$key]['stat_analyse']['unsubmit_num']  = $value['assign_student_count']-$scorePercent100Num-$scorePercent85OverNum-$scorePercent70OverNum-$scorePercent60OverNum-$scorePercent60BelowNum;
					}
				}
				
				
				
				
				
				$this->b['list'] =$rs;
				
				$sqlGradeId = 'select DISTINCT(grade) from teach_exam_list where teacher_id='.$teacherId.' and center_id='.$schoolId;
				$this->db->sql = $sqlGradeId;
				$this->db->Query();
				$grade = $this->db->rs;
				$this->b['grade_list'] = $grade;
				
				$this->db->sql = $numSql;
				$this->db->Query();
				$num = $this->db->rs;
				$this->b['count'] = $num[0]['num'];
				$this->b['sc'] = 200;
			}
		}
		
		
		public function creatword($content,$exerciseid){
				require_once(dirname(__FILE__)."/../include/w.php");
				require_once(dirname(__FILE__)."/../include/config.php");
				$filearr = array();
				$subjectId = $this->vr['subject_id'];
				$tbl = $this->get_examination_tbl($subjectId);
				

				//生成word
				if ($exerciseid=="")
				{
					$this -> db -> sql = "select * from teach_exam_list where id=".$this -> r('exercise_id');
					$exerciseid=$this -> r('exercise_id');
				}
				else
				{
					$this -> db -> sql = "select * from teach_exam_list where id=".$exerciseid;
				}
			
			
			$this -> db -> Queryone();
			$rs = $this -> db -> rs;
/**
 * 数据库选择存贮word
 * 
 */
//			echo $content
			$paperIds = json_decode($content,true);
			$this->b["ids"]=$paperIds;
//			$paperIds = $content;
//			print_r($paperIds);
				foreach ($paperIds as $key=>$value){
						if($value['dbtype']==1&&$value['ids']){
							$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
//							$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
							if(count($value['ids'])>0){
								$str = '"'.implode('","', $value['ids']).'"';
							}
							$this -> db -> sql = "select gid as id,content,image,answer,objective_answer from ".$tbl." where gid in (".$str.") ORDER BY FIELD(gid,".$str.")";
							$this -> db -> Query();
							$result1 = $this->db->rs;
//							$this -> b["sql1"]=$this -> db -> sql ;
						}else if($value['dbtype']==2&&$value['ids']){
							$dbJson = $this->query_curriculumndb();
							if($dbJson){
								$db = json_decode($dbJson,true);
  							    $this->switchDB($db['ip'], $db['name']);
								if(count($value['ids'])>0){
									$str = '"'.implode('","', $value['ids']).'"';
								}
								$this -> db -> sql = "select gid as id,content,image,answer,objective_answer from ".$tbl." where gid in (".$str.") ORDER BY FIELD(gid,".$str.")";
								$this->db->Query();
								$result2 = $this->db->rs;
							}
					}
				}
				
			$condition = json_decode($rs['conditions'],true);
			$queThree = json_decode(base64_decode($condition['queThree']),true);
			
			if(isset($result1)&&isset($result2)){
				$result = array_merge($result1,$result2);
			}else if(isset($result1)&&!isset($result2)){
				$result = $result1;
			}else if(!isset($result1)&& isset($result2)){
				$result = $result2;
			}
			
			$fullMark = $rs['score']?$rs['score']:'100';
			$aa = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>评测卷生成时间".date('Y-m-d')."</title><style type='text/css'>;</style></head><body style=''><h1 style='text-align: center;'>".$rs['name']."</h1><p style='text-align: center;'>满分：".$fullMark."</p><p style='text-align: center;'>学校 __________  班级 __________  学生 __________</p>";
			$i=1;
			$numType = 1;
			/**
			 * 遍历每一道题的分数 $queThree 存放着组卷时候的试题信息
			 */
				$typeName ='';
				foreach ($queThree as $k1=>$v1){
					$score =  intval($v1['sorceP']);
					$totalScore =  intval($v1['sorces']);
					$tiNum = count($v1['ids']);
					$scoreContent = $score?"每题".$score." 分)</p>":')</p>';
					foreach($v1['ids'] as $k2=>$v2){
						if($typeName!=$v1['typename']){
							$typeName = $v1['typename'];
							$aa .= "<p style='font-size:16px;font-weight:bold;'>".utils_handler::num2str_upper($numType)."、".$typeName."( 本大题共".$tiNum."小题 ".$scoreContent;
							$numType++;
						}
						foreach($result as $v){
									$match = null;
									$v ['content'] = str_replace ( "MypicPath\\", "", $v ['content'] );
									preg_match_all ( "/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $v ['content'], $match );
									$contentPicTmp = array();
									$answerPicTmp = array();
									foreach ($match[1] as $k=>$w){
										$picArr['file']  = rand ();
										$img = explode(',', $w);
										$picArr['pic'] = $img['1'];
										array_push($contentPicTmp, $picArr);
									}
									foreach ( $match [0] as $k => $w ) {
										$qq = $contentPicTmp;
										for($j = 0; $j < count ( $qq ); $j ++) {
											if ((strstr ( $match [1] [$k], 'data:image/gif;base64,'.$qq [$j] ['pic'] ) != false)||(strstr ( $match [1] [$k], 'data:image/jpg;base64,'.$qq [$j] ['pic'] ) != false)) {// 猥琐方法 暂时使用
												/**
													正确方法：将$match [1] [$k]里面的字符串：选取data:img/gif;base64后面的部分为$file 执行$filearr [$name] = base64_decode ( $file );
												 */
												$name = "http://" . rand () . $qq [$j] ['file'];
												$v ['content'] = str_replace ( $match [0] [$k], '<img src="' . $name . '">', $v ['content'] );
												$filearr [$name] = base64_decode ( $qq [$j] ['pic'] );
												break;
											}
										}
									}
									
									$v ['answer'] = str_replace ( "MypicPath\\", "", $v ['answer'] );
									preg_match_all ( "/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $v ['answer'], $match1 );
									foreach ($match1[1] as $k=>$w){
										$picArr['file']  = rand ();
										$img = explode(',', $w);
										$picArr['pic'] = $img['1'];
										array_push($answerPicTmp, $picArr);
									}
									
									foreach ( $match1 [0] as $k => $w ) {
										$qq = $answerPicTmp;
										for($j = 0; $j < count ( $qq ); $j ++) {
											if ((strstr ( $match1[1] [$k], 'data:image/gif;base64,'.$qq [$j] ['pic'] ) != false)||(strstr ( $match1 [1] [$k], 'data:image/jpg;base64,'.$qq [$j] ['pic'] ) != false)) {// 猥琐方法 暂时使用
												$name = "http://" . rand () . $qq [$j] ['file'];
												$v ['answer'] = str_replace ( $match1 [0] [$k], '<img src="' . $name . '">', $v ['answer'] );
												$filearr [$name] = base64_decode ( $qq [$j] ['pic'] );
												break;
											}
										}
									}
									
							if($v2['id']==$v['id']){
								$aa .= "<div class='content'>".$i++.'、'.$v['content']."</div><br>";
								if($this->r('with_answer')){ //选择带有解析
									if(trim($v['objective_answer'])!=''){
										$aa .= "<p style='font-weight:bold;background-color: #cecece;'>参考答案：".trim($v['objective_answer'])."</p>";
									}
									if(trim($v['answer'])!=''){
										$aa .= "<p style='font-weight:bold;background-color: #cecece;'>解析：".strip_tags($v['answer'])."</p>";
									}
								}
							}
						}
					}
					$i=1;
				}
//				$aa .= "<p style='font-weight:bold'>-----第".$i++."题 本题".$score."分----</p><div style='font-weight:bold'>".$v['content']."</div><br><br><br><hr>";
				
			$aa .= "</body></html>";
			
			$mht = new MhtFileMaker(); 
			$mht->AddContents("tmp.html",$mht->GetMimeType("tmp.html"),$aa); 
			
			
			foreach($filearr as $kkk => $vvv){
				$mht->AddContents($kkk,$mht->GetMimeType($kkk),$vvv); 
			}
							
			$fileContent = $mht->GetFile();
			
			$subjectName = $this->get_subject_name($this->vr['subject_id']);
			$filename = $subjectName.'_'.time();
			$file = $this->webroot.'/word/'.$filename.".doc";
			file_put_contents($filehtml, $aa);
			$fp = fopen($file, 'w'); 
			fwrite($fp, $fileContent); 
			fclose($fp); 
			$arr['url'] =$this->mywebpath.$filename.".doc";
			$wordFileName = $filename.'.doc';
			$pdfRs = $this->creatpdf($wordFileName);
			global $pdfpath;
			$this->b['pdf'] = $pdfpath.$pdfRs;
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$this -> db -> Update('teach_exam_list',$arr,"id=".$exerciseid);
			//$this -> db -> Update('exam_exercise',$arr,"id=".$this -> r('exercise_id'));
			$this->b['url'] = $arr['url'];
			$this->b['sc'] = 200;
//			return $arr['url'];
		}

		
		public function creatpdf($docName){
				global $doPdfPath;
				$url = $doPdfPath;//接收XML地址
				$header = "Content-type: text/json";//定义content-type为xml
				$data = array(
					'wordpath'=>$docName
				);
				
				$curl = curl_init();
				curl_setopt($curl, CURLOPT_URL, $url);
				curl_setopt($ch, CURLOPT_HTTPHEADER, $header);//设置HTTP头
				curl_setopt($curl, CURLOPT_RETURNTRANSFER, 1);
				curl_setopt($curl, CURLOPT_POST, 1 );
				curl_setopt($curl, CURLOPT_POSTFIELDS, $data);
				$result = curl_exec($curl);
				$error = curl_error($curl);
				return $result;
		}
		
		//自动组卷 随机试题   
		public function get_examination($tblEaxm, $tblEaxmIndex,$subjectId,$gradeId){
				if($this->r('curriculumndb')){
					$dbInfo = $this->r('curriculumndb');
					$this->switchDB($dbInfo['ip'], $dbInfo['name']);
				}else{
					$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
				}
				if($this->r('difficulty_id')){
					$difficultyId =  'and difficulty='.$this->r('difficulty_id');
				}
				
				
				$eduInfo = $this->get_edu_info($subjectId);
				$examExamination2question = $eduInfo['exam_examination2question' ];
                $examExamination = $eduInfo[ 'exam_examination' ];
				
				if($this->r('chapter_id')){
					$chapterArr = $this->r('chapter_id');
					$chatperSql = 'select id from '.$eduInfo['edu_chapter'];
					if(count($chapterArr)>0){
						$chatperStr = implode(',', $chapterArr);
						$where = ' WHERE id in('.$chatperStr.')';
					}
					if($where!=''){
						$chatperSql = $chatperSql.$where;
					}
					$this->db->sql = $chatperSql;
					
					mysql_query('set names utf8');
					$this->db->Query();
					$chapterRs = $this->db->rs;
					$tblIdArr = array();
					$tblQuestionIdArr = array();
					foreach ($chapterRs as $key=>$value){
//						$content = json_decode($value['content'],true);
						$content = $value['id'];
						$contentArr = explode(',', $content);
						foreach ($contentArr as $v){
							$tblIdArr[] = $v;
						}
					}
					
					if(count($tblIdArr)>0){
						$chatperIdSql = 'select question_id from '.$eduInfo['edu_chapter2question'].' where chapter_id in('.$chatperStr.')';
						$this->db->sql = $chatperIdSql;
						$this->db->Query();
						$rs = $this->db->rs;
//						echo $this->db->sql;
//						exit;
						foreach ($rs as $key=>$value){
							$tblQuestionIdArr[] = $value['question_id'];
						}
						$questionStr = '"'.implode('","', $tblQuestionIdArr).'"';
						$where= ' and '.$tblEaxmIndex.'.gid in('.$questionStr.')';
					}	
					
					
				$questiontypes = $this->r('question_types');
				$questionArr = array();
				$questionTmp = array();
				if(count($questiontypes)>0){
					foreach ($questiontypes as $key=>$value){
						//应该去除grade_id 已经从edu_chapter2question里面取出数据了
//						$sql = <<<SQL
//							select gid as id from $tblEaxmIndex where question_type="{$value['name']}" $difficultyId   and disable_flag=0  $where order by rand() limit 0,{$value['num']};
//SQL;
						$sql = <<<SQL
							select gid as id from $tblEaxmIndex where question_type="{$value['name']}" $difficultyId   and disable_flag=0  $where ;
SQL;
						$this->db->sql=$sql;
						
//						echo $this->db->sql;
//						exit;
						mysql_query('set names utf8');
						$this->db->Query();
						$result = $this->db->rs;
						$rsTmp= utils_handler::rand_result($result, $value['num']);
						$questionArr[] = $rsTmp;
					}
					foreach ($questionArr as $key=>$value){
						foreach ($value as $k=>$v){
							$questionTmp[] = $v['id'];
						}
					}
					$question =array();
					if($this->r('curriculumndb')){
						$question[0]['dbtype'] ='2';
						$question[0]['ids'] =$questionTmp;
					}else{
						$question[0]['dbtype'] ='1';
						$question[0]['ids'] =$questionTmp;
					}
					$this->get_paper($tblEaxm, $tblEaxmIndex, json_encode($question));
					return;
					}	
					
				}
				
			if($this->r('yeares')&&$this->r('province_id')){
				$privinceId =$this->r('province_id');
				$sectionId = $this->r('section_id');
				$yearArr = $this->r('yeares');
				$zhentiSql = 'select id from '.$examExamination.'';
				if(count($yearArr)>0||count($privinceId)>0){
					$yearStr = '"'.implode('年","', $yearArr).'年"';
					$privinceStr = '"'.implode('","', $privinceId).'"';
					$where = ' WHERE year in('.$yearStr.') AND subject_id='.$subjectId.' AND section_id='.$sectionId.' AND province_id  in('.$privinceStr.')';
				}
				if($where!=''){
					$zhentiSql = $zhentiSql.$where;
				}
				$this->db->sql = $zhentiSql;
//				echo $this->db->sql;
//				exit;
				mysql_query('set names utf8');
				$this->db->Query();
				$zhentiRs = $this->db->rs;
				$tblIdArr = array();
				foreach ($zhentiRs as $key=>$value){
					$examId = $value['id'];
					$examination2questionSql = 'select question_id from '.$examExamination2question.' where exam_id='.$examId;
					$this->db->sql = $examination2questionSql;
//					echo $this->db->sql;
					$this->db->Query();
					$examIdRs = $this->db->rs;
//					$content = json_decode($value['content'],true);
//					$list = $content['list'];
	//				$list = $value['knowledge_list'];
					foreach ($examIdRs as $k=>$v){
						$tblIdArr[] = $v['question_id'];
					}
					
				}
//				exit;
				if(count($tblIdArr)>0){
					$questionStr = '"'.implode('","', $tblIdArr).'"';
					$where= ' and '.$tblEaxmIndex.'.gid in('.$questionStr.')';
				}	
//				echo $where;
//				exit;
//					$gradeId = $this->get_zhuanti_zhenti_grade_id($gradeId);
			}
			
			if($this->r('special_id')){
				$examZhuanti = $eduInfo['edu_zhuanti' ];
				$zhuantiArr = $this->r('special_id');
				$sectionId = $this->r('section_id');
				$zhuantiSql = 'select knowledge_list from '.$examZhuanti;
				if(count($zhuantiArr)>0){
					$zhuantiStr = implode(',', $zhuantiArr);
					$where = ' WHERE id in('.$zhuantiStr.') and section_id='.$sectionId;
				}
				
				if($where!=''){
					$zhuantiSql = $zhuantiSql.$where;
				}
				
//				echo $zhuantiSql;
//				exit;
				$this->db->sql = $zhuantiSql;
				mysql_query('set names utf8');
				$this->db->Query();
				$zhuantiRs = $this->db->rs;
				$tblIdArr = array();
				foreach ($zhuantiRs as $key=>$value){
	//				$content = json_decode($value['content'],true);
					$list = $value['knowledge_list'];
					$listArr = explode(';', $list);
					foreach ($listArr as $k=>$v){
						$tblIdArr[] = $v;
					}
				}
				if(count($tblIdArr)>0){
					$str = '"'.implode('","', $tblIdArr).'"';
					$where = ' and '.$tblEaxmIndex.'.zh_knowledge in('.$str.')';
				}
//				$gradeId = $this->get_zhuanti_zhenti_grade_id($gradeId);
			}
			
				$questiontypes = $this->r('question_types');
				$questionArr = array();
				$questionTmp = array();
				if(count($questiontypes)>0){
					foreach ($questiontypes as $key=>$value){
//						$sql = <<<SQL
//							select gid as id from $tblEaxmIndex where question_type="{$value['name']}" $difficultyId and section_id=$sectionId  and disable_flag=0  $where order by rand() limit 0,{$value['num']};
//SQL;
						$sql = <<<SQL
							select gid as id from $tblEaxmIndex where question_type="{$value['name']}" $difficultyId and section_id=$sectionId  and disable_flag=0  
							$where ;
SQL;
						$this->db->sql=$sql;
						mysql_query('set names utf8');
						$this->db->Query();
						$result = $this->db->rs;
//						echo '<pre>';
//						print_r($this->db);
//						echo '-------';
//						exit;
						$rsTmp= utils_handler::rand_result($result, $value['num']);
						$questionArr[] = $rsTmp;
					}
					foreach ($questionArr as $key=>$value){
						foreach ($value as $k=>$v){
							$questionTmp[] = $v['id'];
						}
					}
					$question =array();
					if($this->r('curriculumndb')){
						$question[0]['dbtype'] ='2';
						$question[0]['ids'] =$questionTmp;
					}else{
						$question[0]['dbtype'] ='1';
						$question[0]['ids'] =$questionTmp;
					}
					$this->get_paper($tblEaxm, $tblEaxmIndex, json_encode($question));
				}else{
					if($this->r('choose')=='sync'){//同步
						$chapterArr = $this->r('chapter_id');
						$chatperSql = 'select id from '.$eduInfo['edu_chapter'];
						$tblIdArr = array();
						$tblQuestionIdArr = array();
						foreach ($chapterRs as $key=>$value){
	//						$content = json_decode($value['content'],true);
							$content = $value['id'];
							$contentArr = explode(',', $content);
							foreach ($contentArr as $v){
								$tblIdArr[] = $v;
							}
						}
					

			
			$sql =<<<SQL
			select count(*) as num,$tblEaxmIndex.question_type,edu_question_type.type_name,$tblEaxmIndex.difficulty 
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
			LEFT JOIN edu_question_type ON edu_question_type.id=$tblEaxmIndex.question_type
SQL;
			if(count($tblIdArr)>0){
				$chatperIdSql = 'select question_id from '.$eduInfo['edu_chapter2question'].' where chapter_id in('.$chatperStr.')';
//				echo $chatperIdSql;
//				exit;
				$this->db->sql = $chatperIdSql;
				$this->db->Query();
				$rs = $this->db->rs;
				foreach ($rs as $key=>$value){
					$tblQuestionIdArr[] = $value['question_id'];
				}
				$questionStr = '"'.implode('","', $tblQuestionIdArr).'"';
				$sql.= ' WHERE '.$tblEaxmIndex.'.gid in('.$questionStr.')';
			}	
			$sql.=' group by '.$tblEaxmIndex.'.question_type,'.$tblEaxmIndex.'.difficulty' ;
		}else if($this->r('choose')=='zhenti'){//真题
				$privinceId =$this->r('province_id');
				$sectionId = $this->r('section_id');
				$yearArr = $this->r('yeares');
				$zhentiSql = 'select id from '.$examExamination.'';
				if(count($yearArr)>0){
					$yearStr = '"'.implode('年","', $yearArr).'年"';
					$where = ' WHERE year in('.$yearStr.') AND subject_id='.$subjectId.' AND province_id='.$privinceId.' AND section_id='.$sectionId;
				}
				if($where!=''){
					$zhentiSql = $zhentiSql.$where;
				}
				$this->db->sql = $zhentiSql;
				$this->db->Query();
				$zhentiRs = $this->db->rs;
				foreach ($zhentiRs as $key=>$value){
					$examId = $value['id'];
					$examination2questionSql = 'select question_id from '.$examExamination2question.' where exam_id='.$examId;
					$this->db->sql = $examination2questionSql;
					$this->db->Query();
					$examIdRs = $this->db->rs;
//					$content = json_decode($value['content'],true);
//					$list = $content['list'];
	//				$list = $value['knowledge_list'];
					foreach ($examIdRs as $k=>$v){
						$tblIdArr[] = $v['question_id'];
					}
				}
			$sql=<<<SQL
			select count(*) as num,$tblEaxmIndex.question_type,edu_question_type.type_name,$tblEaxmIndex.difficulty 
			from $tblEaxmIndex
			LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
			LEFT JOIN edu_question_type ON edu_question_type.id=$tblEaxmIndex.question_type
SQL;
				
			if(count($tblIdArr)>0){
				$str = '"'.implode('","', $tblIdArr).'"';
				$sql.= ' WHERE '.$tblEaxmIndex.'.gid in('.$str.')';
			}	
			$sql.=' group by '.$tblEaxmIndex.'.question_type,'.$tblEaxmIndex.'.difficulty' ;
			}else if($this->r('choose')=='zhuanti'){//专题
				$sectionId = $this->r('section_id');
				$zhuantiArr = $this->r('special_id');
				$eduInfo = $this->get_edu_info($subjectId);
				$zhuantiSql = 'select knowledge_list from '.$eduInfo['edu_zhuanti'];
				if(count($zhuantiArr)>0){
					$zhuantiStr ='"'.implode('","', $zhuantiArr).'"';
					$where = ' WHERE id in('.$zhuantiStr.') and section_id='.$sectionId;
				}
				
				if($where!=''){
					$zhuantiSql = $zhuantiSql.$where;
				}
				
				
				$this->db->sql = $zhuantiSql;
				
				mysql_query('set names utf8');
				$this->db->Query();
				$zhuantiRs = $this->db->rs;
				$tblIdArr = array();
				foreach ($zhuantiRs as $key=>$value){
	//				$content = json_decode($value['content'],true);
					$list = $value['knowledge_list'];
					$listArr = explode(';', $list);
					foreach ($listArr as $k=>$v){
						$tblIdArr[] = $v;
					}
				}
			
			$sql =<<<SQL
				select count(*) as num,$tblEaxmIndex.question_type,edu_question_type.type_name,$tblEaxmIndex.difficulty 
				from $tblEaxmIndex
				 LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid  
				LEFT JOIN edu_question_type ON edu_question_type.id=$tblEaxmIndex.question_type
SQL;
				if(count($tblIdArr)>0){
					$str = '"'.implode('","', $tblIdArr).'"';
					$sql.= ' WHERE '.$tblEaxmIndex.'.zh_knowledge in('.$str.') and '.$tblEaxmIndex.'.section_id='.$sectionId;
				}
				$sql.=' group by '.$tblEaxmIndex.'.question_type,'.$tblEaxmIndex.'.difficulty' ;
			}
			$this->db->sql = $sql;
//			echo $sql;
//			exit;
			mysql_query('set names utf8');
			$this->db->Query();
			$this->b['list'] =$this->db->rs;
		}
			$this->b['sc'] = 200;
			
		}
	
			//派送试卷
		public function dispatch_paper(){
			require_once(dirname(__FILE__)."/../include/stat.php");
			$stat =new statManager();
			$month = intval(date('m'));
			$year  = intval(date('Y'));
				$assign = array();
				$examId = null;
				//在派送之前做处理，如果收藏试卷列表派送试卷，检查试卷ID是否存在，如果不存在，创建新的试卷
				if($this->r('fav_exam_assign')==1){
					$sql ='select * from teach_exam_list where id='.$this->r('ti_id');
					$this->db->sql = $sql;
					$this->db->Query();
					$rs = $this->db->rs;
					if(count($rs)>0){
						$examId = $this->r('ti_id');
					}else{
						$sql = 'select * from teach_fav_exam where ref_id='.$this->r('ti_id').' and teacher_id='.$this->vr['id'];
						$this->db->sql =$sql;
						$this->db->Queryone();
						$rs = $this->db->rs;
						$exam = array();
						$exam['teacher_id'] = $rs['teacher_id'];
						$exam['name'] = $rs['name'];
						$exam['exam_type'] = $rs['exam_type'];
						$exam['center_id'] = $rs['center_id'];
						$exam['zone_id'] = $rs['zone_id'];
						$exam['subject_id'] =  $rs['subject_id'];
						$exam['grade'] =  $rs['grade'];
						$exam['build_type'] =  $rs['build_type'];
						$exam['conditions'] =  $rs['conditions'];
						$exam['content'] =  $rs['content'];
						$exam['score'] =  $rs['score'];
						$exam['difficulty'] =  $rs['difficulty'];
						$exam['ref_id'] =  $rs['ref_id'];
						$exam['favorited'] =  1;
						$exam['fav_count'] =  1;
						$exam['create_date'] =  'current_timestamp()';
//						print_r($exam);
						$this->db->Insert('teach_exam_list', $exam);
						$examId = $this->db->Last_id();
						if($examId){
							$sql = 'update teach_fav_exam set ref_id='.$examId.'  where id='.$this->r('fav_id');
							$this->db->sql = $sql;
							$this->db->ExecuteSql();
						}
					}
				}else{
					$examId = $this->r('ti_id');
				}
				$assign['exam_id'] = $examId;
				$assign['center_id'] = $this->r('center_id');
				$assign['zone_id'] = $this->r('zone_id');
				$assign['assign_type'] = $this->r('assign_type'); //1:online 2 word
				$assign['assign_mode'] = $this->r('assign_mode'); //班级，个人
				$assginStuInfo = array();
				//在获取数据以后先将 中文urlencode ，然后json_encode  保存到数据库
				foreach ($this->r('assign_to') as $key=>$value){
					$assginStuInfo[$key]['class_id'] = $value['class_id'];
					$assginStuInfo[$key]['class_name'] = urlencode($value['class_name']);
					$assginStuInfo[$key]['stu_num'] = $value['stu_num'];
						foreach ($value['stu_ids'] as $k=>$v){
							$assginStuInfo[$key]['stu_ids'][$k]['stu_id'] = $v['stu_id'];
							$assginStuInfo[$key]['stu_ids'][$k]['stu_name'] = urlencode($v['stu_name']);
						}					
				}
				
				$assign['assign_to'] = json_encode($assginStuInfo);
				if($this->r('assign_type') =='2'){// 保存为word
						$id = $this->r('content');
						$exerciseid =$this->r('ti_id');
						$idArr =explode(',', $id);
						$idStr = '"'.implode('","', $idArr).'"';
						$this->creatword($idStr, $exerciseid);
				}
				$stuNum = 0;
				foreach ($this->r('assign_to') as $key=>$value){
					$stuNum +=$value['stu_num'];
				}
//				print_r($this->r('assign_to'));
				$assign['assign_student_count'] = $stuNum;
				$assign['creator'] = $this->vr['id'];
				$assign['creator_name'] = $this->vr['realname'];
				$assign['create_date'] = 'current_timestamp()';
				$assign['end_date'] = $this->r('end_date');
				$result = $this->db->Insert('teach_assign_list', $assign);
				
				if($result){
					$assignId = $this->db->Last_id();
					$studentExamList = array();
					$pushList = array(); //插入push_list 数组
                    $j = 0;
					foreach ($this->r('assign_to') as $key=>$value){
						foreach ($value['stu_ids'] as $k=>$v){
							$studentExamList[$j]['user_id'] =$v['stu_id'];
							$studentExamList[$j]['exercise_id'] =$examId;
							$studentExamList[$j]['class_id'] =$value['class_id'];
							$studentExamList[$j]['assign_id'] = $assignId;
							$studentExamList[$j]['create_date'] = 'current_timestamp()';
//							$studentExamList[$j]['exam_stat'] = 0;//试卷当前状态 0刚收到，1正在做，2已提交，3已批改，4.已统计
							$studentExamList[$j]['creator'] =$this->vr['id'];
							$studentExamList[$j]['assign_type'] =$this->r('assign_type');
							$studentExamList[$j]['ClassOrPersonal'] =$this->r('assign_mode');
							$studentExamList[$j]['type'] =1; //  1:新作业，2：做过：3已批阅
							$studentExamList[$j]['subject_id'] = $this->vr['subject_id'];
							$studentExamList[$j]['grade_id'] = $this->r('grade_id');
							
							$pushList[$j]['program' ] = 'all' ;
                    		$pushList[$j]['n_bubble' ] = '有新作业' ;
                    		$pushList[$j]['title' ] = '有新作业' ;
                    		$pushList[$j]['content' ] = '收到新的作业，去看看！' ;
							$pushList[$j]['creat_time' ] = 'current_timestamp()';
                     		$pushList[$j]['n_style' ] = 3;
							$pushList[$j]['oprate_one' ] = $this->vr ['id' ];
							$pushList[$j]['type' ] = 1;
							$pushList[$j]['user_id'] = $v['stu_id'];
							$j++;
						  /**
						   * 插入学生应交作业数
						   */
							$day = date('Y-m-d');
							if(intval($this->r('exam_type'))=='1'){//测试
								$data = array('student_id'=>$v['stu_id'],'test_total_count'=>'1','day'=>$day,'class_id'=>$value['class_id'],'teacher_id'=>$this->vr['id']);
							}elseif(intval($this->r('exam_type'))=='0'){//作业
								$data = array('student_id'=>$v['stu_id'],'work_total_count'=>'1','day'=>$day,'class_id'=>$value['class_id'],'teacher_id'=>$this->vr['id']);
							}
							$stat->update('student', 'total', $data);
							
						}
	//					 $studentExamList[$key]['class_id'] =$value['class_id'];
					}
//					print_r($studentExamList);
//					exit;
					$resultStuExamList = $this->db->Inserts('study_exercise', $studentExamList);
					
					$assign_count = 0;//派送作业数
					foreach ($this->r('assign_to') as $key=>$value){
						$assign_count+=$value['stu_num'];
					}
					
					/**
					 * 插入派送作业数
					 */
					if(intval($this->r('exam_type'))=='1'){//测试
						$data = array('teacher_id'=>$this->vr['id'],'test_assign_count'=>$assign_count,'year'=>$year,'month'=>$month,'center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id'));
					}elseif(intval($this->r('exam_type'))=='0'){//作业
						$data = array('teacher_id'=>$this->vr['id'],'work_assign_count'=>$assign_count,'year'=>$year,'month'=>$month,'center_id'=>$this->r('center_id'),'zone_id'=>$this->r('zone_id'));
					}
					$stat->update('teacher', 'total', $data);

					if($resultStuExamList){
                        $resultPushList = $this->db->Inserts('push_list', $pushList);
                        if($resultPushList){
							$sql = 'UPDATE  teach_exam_list SET status=1,assign_student_count=assign_student_count+'.$stuNum.' WHERE id='.$assign['exam_id'];
							$this->db->sql = $sql;
							$this->db->ExecuteSql();
							if($this->db->rs){
								$this->b['sc'] = 200;
							}else{
								$this->b['reason'] = 'update teach_exam_list failed';
								$this->b['sc']  = 400;
							}
                        }else{
                        	$this->b['reason'] = 'insert push_list failed';
							$this->b['sc']  = 400;
                        }
						
					}else{
							$this->b['reason'] = 'insert study_exercise failed';
							$this->b['sc']  = 400;
					}
				}else{
					$this->b['reason'] = 'insert teach_assign_list failed';
					$this->b['sc']  = 400;
				}
			}
	
			
	
public function MakePropertyValue($name, $value, $osm) {
	$oStruct = $osm->Bridge_GetStruct ( "com.sun.star.beans.PropertyValue" );
	$oStruct->Name = $name;
	$oStruct->Value = $value;
	return $oStruct;
}
public function word2pdf($doc_url, $output_url) {
	$osm = new COM ( "com.sun.star.ServiceManager" ) or die ( "Please be sure that OpenOffice.org 
　　is installed.\n" );
	$args = array ($this->MakePropertyValue ( "Hidden", true, $osm ) );
	$oDesktop = $osm->createInstance ( "com.sun.star 
　　.frame.Desktop" );
	$oWriterDoc = $oDesktop->loadComponentFromURL ( $doc_url, "_blank", 0, $args );
	$export_args = array ($this->MakePropertyValue ( "FilterName", "writer_pdf_Export", $osm ) );
	$oWriterDoc->storeToURL ( $output_url, $export_args );
	$oWriterDoc->close ( true );
}	
	public function creatPDF_old($content,$exerciseid){
//	set_time_limit ( 0 );
//
//	$output_dir = "/data/nginx/htdocs/ticool.hxnetwork.com/word";
//	$doc_file = "/data/nginx/htdocs/ticool.hxnetwork.com/word/1374676964hcKVpi.doc";
//	$pdf_file = "2.pdf";
//	$output_file = $output_dir . $pdf_file;
//	$doc_file = "file:///" . $doc_file;
//	$output_file = "file:///" . $output_file;
//	$this->word2pdf ( $doc_file, $output_file ); 
//		
//		
//		exit;
		require_once(dirname(__FILE__)."/../include/tcpdf/examples/tcpdf_include.php");
		require_once(dirname(__FILE__)."/../include/tcpdf/tcpdf.php");
		require_once(dirname(__FILE__)."/../include/config.php");
		//		require_once('tcpdf_include.php');
		// create new PDF document
		$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);
		// set document information
		$pdf->SetCreator(PDF_CREATOR);
		$pdf->SetAuthor('Nicola Asuni');
		$pdf->SetTitle('TCPDF Example 006');
		$pdf->SetSubject('TCPDF Tutorial');
		$pdf->SetKeywords('TCPDF, PDF, example, test, guide');
		
		// set default header data
		$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 006', PDF_HEADER_STRING);
		
		// set header and footer fonts
		$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
		$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));
		
		// set default monospaced font
		$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
		
		// set margins
		$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
		$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
		$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
		
		// set auto page breaks
		$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);
		
		// set image scale factor
		$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
		
		// set some language-dependent strings (optional)
		if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
			require_once(dirname(__FILE__).'/lang/eng.php');
			$pdf->setLanguageArray($l);
		}
		
		// ---------------------------------------------------------
		
		// set font
		//$pdf->SetFont('dejavusans', '', 10);
		
		
		// add a page
		$pdf->AddPage();
				$filearr = array();
				$subjectId = $this->vr['subject_id'];
				$tbl = $this->get_examination_tbl($subjectId);
				//生成word
				if ($exerciseid=="")
				{
					$this -> db -> sql = "select * from teach_exam_list where id=".$this -> r('exercise_id');
					$exerciseid=$this -> r('exercise_id');
				}
				else
				{
					$this -> db -> sql = "select * from teach_exam_list where id=".$exerciseid;
				}
			$this -> db -> Queryone();
			$rs = $this -> db -> rs;
//			echo $content
			$paperIds = json_decode($content,true);
				foreach ($paperIds as $key=>$value){
						if($value['dbtype']==1&&$value['ids']){
							$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
							if(count($value['ids'])>0){
								$str = '"'.implode('","', $value['ids']).'"';
							}
							
							$this -> db -> sql = "select gid as id,content,image,answer,objective_answer from ".$tbl." where gid in (".$str.") ORDER BY FIELD(gid,".$str.")";
							$this -> db -> Query();
							$result1 = $this->db->rs;
						}else if($value['dbtype']==2&&$value['ids']){
							$dbJson = $this->query_curriculumndb();
							if($dbJson){
								$db = json_decode($dbJson,true);
								$this->switchDB($db['ip'], $db['name']);
								if(count($value['ids'])>0){
									$str = '"'.implode('","', $value['ids']).'"';
								}
									$this -> db -> sql = "select gid as id,content,image,answer,objective_answer from ".$tbl." where gid in (".$str.") ORDER BY FIELD(gid,".$str.")";
								$this->db->Query();
								$result2 = $this->db->rs;
							}
					}
				}
				
			$condition = json_decode($rs['conditions'],true);
			$queThree = json_decode(base64_decode($condition['queThree']),true);
			if(isset($result1)&&isset($result2)){
				$result = array_merge($result1,$result2);
			}else if(isset($result1)&&!isset($result2)){
				$result = $result1;
			}else if(!isset($result1)&&!isset($result2)){
				$result = $result2;
			}
			$aa = "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'><html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>评测卷生成时间".date('Y-m-d')."</title></head><body><h1>".$rs['name']."</h1><hr>";
			$i=1;
				/**
				 * 遍历每一道题的分数 $queThree 存放着组卷时候的试题信息
				 */
				$typeName ='';
				foreach ($queThree as $k1=>$v1){
//					$typeName = $v1['typename'];
					$score =  intval($v1['sorceP']);
					$totalScore =  intval($v1['sorces']);
					foreach($v1['ids'] as $k2=>$v2){
						if($typeName!=$v1['typename']){
							$typeName = $v1['typename'];
							$aa .= "<p style='font-weight:bold'>试题类型：".$typeName." 每题".$score."分----总计：".$totalScore." 分</p>";
						}
						foreach($result as $v){
									$match = null;
									$v ['content'] = str_replace ( "MypicPath\\", "", $v ['content'] );
									preg_match_all ( "/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $v ['content'], $match );
									foreach ( $match [0] as $k => $w ) {
										$v ['image'] = preg_replace ( "'([\r\n])[\s]+'", "", $v ['image'] );
										$iii = json_decode ( $v ['image'], true );
										$qq = $iii ['question'];
						//				print_r($qq);
//										for($j = 0; $j < count ( $qq ); $j ++) {
//						//					echo $match [1] [$k];
//						//					echo 'data:img/gif;base64,'.$qq [$j] ['file'];
//											if (strstr ( $match [1] [$k], 'data:img/gif;base64,'.$qq [$j] ['pic'] ) != false) {// 猥琐方法 暂时使用
//												/**
//													正确方法：将$match [1] [$k]里面的字符串：选取data:img/gif;base64后面的部分为$file 执行$filearr [$name] = base64_decode ( $file );
//												 */
//												$name = "http://" . rand () . $qq [$j] ['file'];
//												$v ['content'] = str_replace ( $match [0] [$k], '<img src="' . $name . '">', $v ['content'] );
//												$filearr [$name] = base64_decode ( $qq [$j] ['pic'] );
//												break;
//											}
//										}
									}
									
									
							if($v2['id']==$v['id']){
								$aa .= "<p style='font-weight:bold'>-----第".$i++."题 ----</p><div style='font-weight:bold'>".$v['content']."</div><br><br><br><hr>";
							}
						}
					}
					$i=1;
				}
//				$aa .= "<p style='font-weight:bold'>-----第".$i++."题 本题".$score."分----</p><div style='font-weight:bold'>".$v['content']."</div><br><br><br><hr>";
				
			$aa .= "</body></html>";
//			echo $aa;
//			exit;

			file_put_contents('ttt.html', $aa);
			
			$htmlStr =  preg_split('/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i', $aa);
			preg_match_all ( "/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $aa, $match );
			$htmlAll = array();
			for ($i=0;$i<count($htmlStr)-1;$i++){
					array_push($htmlAll, $htmlStr[$i]);
					array_push($htmlAll,$match['1'][$i]);
			}
				array_push($htmlAll,$htmlStr[count($htmlStr)-1]);
				foreach ($htmlAll as $key=>$value){
					if(strstr($value,'data:image/gif;base64,')!=false){
						echo 'in';
						$rs = explode('data:image/gif;base64,', $value);
						$imgdata = base64_decode($rs['1']);
// $imgdata = $rs[1];
						$pdf->Image('@'.$imgdata);
			//			$pdf->writeHTML('<p></p>', true, false, true, false, '');
					}else{
						echo 'not in';
						$pdf->SetFont('stsongstdlight', '', 10);
						$pdf->writeHTML(''.$value.'', true, false, true, false, '');
					}
				}
//			$pdf->writeHTML($aa, true, false, true, false, '');
			$pdfName = time();
			$pdfPath = dirname(__FILE__)."/../../htdocs/ticool.hxnetwork.com/pdf/";
			$fileStr = $pdf->Output($pdfPath.$pdfName.'.pfd', 'S');
			$file = $pdfPath.$pdfName.".pdf";
			$fp = fopen($file, 'w'); 
			fwrite($fp, $fileStr); 
			fclose($fp); 
		}
		
	
		private function get_zhuanti_zhenti_section_id($gradeId){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$sql  = 'select section_id from edu_grade  where id='.$gradeId;
			$this->db->sql = $sql;
			$this->db->Queryone();
			$rs = $this->db->rs;
			return $rs['section_id'];
		}
		
		private function get_zhuanti_zhenti_grade_id($gradeId){
			if($gradeId=='18'){
				return '77';
			}else if($gradeId=='19'){
				return '88';
			}
		}
		
		private function get_edu_grade(){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$sql = 'select * from edu_grade  where display_flag!=0 limit 0,11';
			$this->db->sql = $sql;
			$this->db->Query();
			$rs = $this->db->rs;
			$this->b['list'] = $rs;
		}
		
		
		private function get_exam_examination_info(){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			$sectionId = $this->r('section_id');
			$subjectId = $this->r('subject_id');
			$eduInfo = $this->get_edu_info($subjectId);
			$examExamination = $eduInfo['exam_examination'];
			$year = '"'.implode('年","', $this->r('year')).'年"';
			$privinceId = '"'.implode('","', $this->r('province')).'"';
			$sql = <<<SQL
			select id,name from $examExamination  WHERE year in($year) AND subject_id=$subjectId AND section_id=$sectionId AND province_id in($privinceId);
SQL;
			$this->db->sql = $sql;
			 mysql_query( 'set names utf8');
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
//			$this->b['sql'] = $this->db->sql;
			$this->b['sc'] = 200;
		}
		
		private function get_exam_examination_paper($tblEaxm,$tblEaxmIndex){
			if($this->r('curriculumndb')){
				$dbInfo = $this->r('curriculumndb');
				$this->switchDB($dbInfo['ip'], $dbInfo['name']);
			}else{
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}
			$eduInfo = $this->get_edu_info($this->r('subject_id'));
			$examExamination2question = $eduInfo['exam_examination2question'];
			$examId = $this->r('exam_id');
			$sql = <<<SQL
			select question_id from $examExamination2question WHERE exam_id=$examId;
SQL;
			$this->db->sql = $sql;
			$this->db->Query();
			$rs = $this->db->rs;
			$question =array ();
			$questionTmp = array();
			if(count($rs)>0){
				foreach ($rs as $key=>$value){
					$questionTmp[] = $value['question_id'];
				}
			}
           	 if($this->r( 'curriculumndb')){
                $question[0][ 'dbtype'] = '2';
                $question[0][ 'ids'] =$questionTmp;
             } else{
                $question[0][ 'dbtype'] = '1';
                $question[0][ 'ids'] =$questionTmp;
             }
            $this->get_paper($tblEaxm, $tblEaxmIndex, json_encode($question));
            
            return $question;
			
		}
		
		private function remove_examination_paper(){
			$examId = $this->r('exam_id');
			$this->db->sql =<<<SQL
			select count(*) as num from teach_assign_list where exam_id=$examId;
SQL;
			$this->db->Queryone();
			$rs = $this->db->rs;
			if($rs['num']>0){
				$this->b['flag'] = '2';//存在派送试卷
			}else{
				$this->b->sql = <<<SQL
				delete from teach_exam_list where id=$examId;
SQL;
				$this->db->ExecuteSql();
				$rs = $this->db->rs;
				if($rs){
					$this->b['sc'] = 200;
					$this->b['flag'] = true;
				}else{
					$this->b['sc'] = 403;
					$this->b['flag'] = false;
				}
			}
		}
		
	}
?>