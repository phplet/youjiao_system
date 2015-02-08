<?php
/**
 * 题单 业务逻辑处理
 * @author sky
 *
 */
class cloud_question_handler {
	
	public function __construct(){
		$this->db = db_handler::getInstance();
	}
	
	/**
	 * 创建题单
	 */
	public function post_add_cloud_bill($userId,$data){
		global $DBCFG;
		$this->db->switchDB ( $DBCFG['default_local']['dbhost'] , $DBCFG['default_local']['dbname'] , $DBCFG['default_local']['dbuser'] , $DBCFG['default_local']['dbpasswd']);
		$dataTmp = array();
		$dataTmp['user_id'] = $userId;
		$dataTmp['q_b_name'] = $data['q_b_name'];
		$dataTmp['description'] = $data['description'];
		$dataTmp['knowledge_id'] = $data['knowledge_id'];
		$dataTmp['knowledge_text'] = $data['knowledge_text'];
		$dataTmp['subject_id'] = $data['subject_id'];
		$dataTmp['section_id'] = $data['section_id'];
		$dataTmp['cover_image'] = $data['cover_image'];
		$dataTmp['create_date'] = 'now()';
		$dataTmp['update_date'] = 'now()';
		$table = 'cloud_question_bill';
		$this->db->Insert($table, $dataTmp);
		if($this->db->rs===false){
			return false;
		}else{
			return $this->db->Last_id();
		}
	}
	
	/**
	 * 移除题单
	 */
	public function post_remove_cloud_bill($qbId){
		$this->db->sql = <<<SQL
					delete cloud_question_bill,cloud_question_bill_content  from cloud_question_bill_content
					left join cloud_question_bill on cloud_question_bill.id=cloud_question_bill_content.q_b_id
					where cloud_question_bill_content.q_b_id=$qbId;
					
SQL;
		$this->db->ExecuteSql();
		if($this->db->rs===false){
			return false;
		}else{
			return true;
		}
	}
	/**
	 * 
	 * 获取题单
	 */
	public function get_cloud_bill_list($userId,$sectionId,$knowledges,$offset,$step){
		$knowledgeArray = explode(',', $knowledges);
		$table = 'cloud_question_bill';
		$sql = <<<SQL
									select id,q_b_name,description,create_date,update_date,knowledge_id,
									knowledge_text,cover_image,verify
									from $table
									where user_id=$userId 
SQL;
		if($sectionId){
			$sql.=<<<SQL
									and section_id=$sectionId 
SQL;
		}
		if($knowledges){
				$where = utils_handler::analytic_knowledge_id_to_query($table, $knowledges);
		}
		if($step||$offset){
			$limit = <<<SQL
						 limit $offset,$step
SQL;
		}else{
			$limit = '';
		}
		$this->db->sql = $sql.$where.$limit;
		$this->db->Query();
		return $this->db->rs;
	}
	
	/**
	 * 添加试题到指定的题单
	 */
	public function post_add_question_2_bill_list($qbId,$questionIds,$subjectId){
		global $DBCFG;
		$this->db->switchDB ( $DBCFG['default_local']['dbhost'] , $DBCFG['default_local']['dbname'] , $DBCFG['default_local']['dbuser'] , $DBCFG['default_local']['dbpasswd']);
		$dataTmp = array();
		$questionIdArray = explode(',', $questionIds);
		foreach ($questionIdArray as $key=>$value){
			$dataTmp[$key]['q_b_id'] = $qbId;
			$dataTmp[$key]['question_id'] = $value;
			$dataTmp[$key]['subject_id'] = $subjectId;
			$dataTmp[$key]['create_date'] = 'current_timestamp()';
		}
		$this->db->Inserts('cloud_question_bill_content', $dataTmp);
		if($this->db->rs===false){
			return false;
		}else{
			//同时更新题单时间
			$this->db->sql = <<<SQL
										update cloud_question_bill set update_date=current_timestamp() where id=$qbId;
SQL;
			$this->db->ExecuteSql();
			if($this->db->rs===false){
				return false;
			}
			else{
				return true;
			}
		}
	}
	
	/**
	 *移除试题从题单 
	 */
	public function post_remove_question_2_bill_list($qbId,$questionId){
		$this->db->sql = <<<SQL
								delete from cloud_question_bill_content where q_b_id=$qbId and question_id=$questionId
SQL;
		$this->db->ExecuteSql();
		if($this->db->rs===false){
			return false;
		}else{
			return true;
		}
	}
	
	public function get_query_zhenti_list($subject_id, $section_id, $type, $year, $province_id, $limit){
		//查询试卷
		global $DBCFG;
		$eduInfo = utils_handler::get_edu_info ( $subject_id );
		$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		$tblExamination = $eduInfo ['exam_examination'];
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
		$result = $this->db->rs;
		return $result;
	}
	
	
	public function get_query_zhenti_question($examId,$subjectId){
		global $DBCFG;
		$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		$eduInfo = utils_handler::get_edu_info ( $subjectId );
		$tblExamination2question = $eduInfo ['exam_examination2question'];
		$tblQuestionIndex = $eduInfo['exam_question_index'];
		$this->db->sql = <<<SQL
		SELECT $tblExamination2question.question_id,$tblExamination2question.subject_id,$tblQuestionIndex.knowledge_id FROM  $tblExamination2question

		LEFT JOIN $tblQuestionIndex on $tblQuestionIndex.gid=$tblExamination2question.question_id
		
		WHERE $tblExamination2question.exam_id=$examId and $tblExamination2question.subject_id=$subjectId;
SQL;

		$this->db->Query();
		$examInfo = $this->db->rs;
		return $examInfo;
	}
	
	
	public function get_query_knowledge_list($subjectId,$sectionId){
		global $DBCFG;
		$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		$eduInfo = utils_handler::get_edu_info ( $subjectId );
		$tblKnowledge= $eduInfo ['edu_knowledge'];
		$this->db->sql = <<<SQL
								select id,name from $tblKnowledge where section_id=$sectionId;
SQL;
		$this->db->Query();
		return $this->db->Query();
	}
	
	public function get_query_question_list($subjectId,$questionType,$knowledges,$offset,$step,$searchContent=NULL){
		global $DBCFG;
		$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		$eduInfo = utils_handler::get_edu_info ( $subjectId );
		$tblExam= $eduInfo ['exam_question'];
		$tblExamIndex= $eduInfo ['exam_question_index'];
		$sql = <<<SQL
								select  $tblExam.gid,$tblExam.content,$tblExam.objective_answer,$tblExam.answer   from $tblExamIndex
								left join $tblExam on $tblExam.gid=$tblExamIndex.gid
								
SQL;
		
		$where .= <<<SQL
							where  $tblExamIndex.question_type=$questionType 
SQL;
		if($knowledges){
			$where .=utils_handler::analytic_knowledge_id_to_query($tblExamIndex, $knowledges);
		}
		
		if($offset||$step){
			$limit = <<<SQL
							limit $offset,$step
SQL;
		}else{
			$limit = '';
		}
		
		$this->db->sql = $sql.$where.$limit;
		$this->db->Query();
		return $this->db->rs;
		
	}
	
	public function get_query_zhuanti_list($subjectId,$sectionId,$offset,$step){
		global $DBCFG;
		$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
		$eduInfo = utils_handler::get_edu_info ( $subjectId );
		$tblZhuanti = $eduInfo['edu_zhuanti'];
		$tblKnowledge= $eduInfo ['edu_knowledge'];
		$this->db->sql = <<<SQL
		
		SELECT id,name,subject_id,section_id,knowledge_id FROM $tblZhuanti where section_id=$sectionId and knowledge_id!='' 

SQL;

		if($offset||$step){
			$this->db->sql .= <<<SQL
										limit $offset,$step
SQL;
		}
		$this->db->Query();
		$resultZhuanti = $this->db->rs;
		if(count($resultZhuanti)>0){
			foreach ($resultZhuanti as $key=>$value){
				$knowledgeArray = explode(',', $value['knowledge_id']);
				if(count($knowledgeArray)>0){
					foreach ($knowledgeArray as $k=>$v){
						$this->db->sql = <<<SQL
							select id,name from $tblKnowledge where section_id=$sectionId and id=$v;
SQL;
						$this->db->Queryone();

						$resultKnowledge = $this->db->rs;
						$resultZhuanti[$key]['knowledge_info'][$k] = $resultKnowledge;
					}
				}
				
				$resultZhuanti[$key]['knowledge_info'] = urlencode(json_encode($resultZhuanti[$key]['knowledge_info']));
			}
			
		}
		
		return $resultZhuanti;
	}
	
	public function get_query_zhuanti_with_user_notes($userId,$subjectId,$sectionId,$offset,$step){
		$resultZhuanti = $this->get_query_zhuanti_list($subjectId, $sectionId, $offset, $step);
		if(count($resultZhuanti)>0){
			foreach ($resultZhuanti as $key=>$value){
				$examId = $value['id'];
				$resultNotes = $this->get_query_user_notes_by_exam_id($examId, $subjectId,$userId);
				$resultZhuanti[$key]['notes_count'] = $resultNotes['count'];
			}
		}
		return $resultZhuanti;
	}
	
	public function get_query_user_notes_by_exam_id($examId,$subjectId,$userId){
		global $DBCFG;
		$this->db->switchDB ( $DBCFG ['default_local'] ['dbhost'], $DBCFG ['default_local'] ['dbname'], $DBCFG ['default_local'] ['dbuser'], $DBCFG ['default_local'] ['dbpasswd'] );
		$this->db->sql=<<<SQL
				select  content,pic_content,ti_id,create_date,status,dbtype,grade from tblstudent_notes where exam_id=$examId and subject_id=$subjectId and user_id=$userId and tblstudent_notes.status=1;
SQL;
		$this->db->Query();
		$result = array();
		$result['list'] = $this->db->rs;
		$result['count'] =count($this->db->rs);
		return $result;
	}
	
}