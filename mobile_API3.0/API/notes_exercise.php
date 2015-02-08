<?php
///////////////////////////////////////////////////////
// 随手记接口
// by xiaokun v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			global $notesPicPath;
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			$action = $this->r('action');
			$this->b['path'] = $notesPicPath;
			switch ($action){
				case 'get_user_ti_notes':
					$this->get_user_ti_notes();
					break;
				case 'get_ti_notes':
					$this->get_ti_notes();
					break;
				case 'get_user_notes':
					$this->get_user_notes();
					break;
				case 'get_user_zhuanti_notes':
					$cloudQuestionHandler = new cloud_question_handler();
					$subjectId = $this->r('subject_id');
					$sectionId = $this->r('section_id');
					$userId = $this->r('user_id');
					$result = $cloudQuestionHandler->get_query_zhuanti_with_user_notes($userId,$subjectId, $sectionId, $offset, $step);
					$this->b['list'] = $result;
					break;
				case 'del_note':
					$this->delete_note();
					break;
				case 'del_zhuanti_notes':
					$this->delete_zhuanti_notes();	
					break;	

			}
		}
	
		//POST逻辑
		public function doPOST(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			$action = $this->r('action');
			switch ($action){
				case 'add_notes':
					$this->add_notes();
					break;
				case 'modify_notes':
					$this->modify_notes();
					break;	
				case 'pic_upload' :
				global $notesPicPath;
				$fileName = $this->r ( 'filename' );
//				$target_path = $notesPicPath; //接收文件目录
				$target_path = $notesPicPath . $fileName;
				$this->b ["action"] = $target_path;
				if (move_uploaded_file ( $_FILES ['uploadedfile'] ['tmp_name'], $target_path )) {
					$this->b ['flag'] = true;
				} else {
					$this->b ['flag'] = false;
				}
				break;
			
			}
		}
	
		//PUT逻辑
		public function doPUT(){
		}
	
		//DELETE逻辑
		public function doDELETE(){
			
		}

		public function add_notes(){
			$notes = array();
			if($this->r('exam_id')){
				$notes['exam_id'] = $this->r('exam_id');
			}
			
			if($this->r('user_id')){
				$notes['user_id'] = $this->r('user_id');
			}
			if($this->r('ti_id')){
				$notes['ti_id'] = $this->r('ti_id');
			}
			if($this->r('grade_id')){
				$notes['grade'] = $this->r('grade_id');
			}
			
			if($this->r('content')){
				$notes['content'] = $this->rcontent('content');
			}
			
			if($this->r('visible')){
				$notes['visible'] = $this->r('visible');
			}
			
			if($this->r('pic_content')){
				$notes['pic_content'] = $this->r('pic_content');
			}
			
			if($this->r('subject_id')){
				$notes['subject_id'] = $this->r('subject_id');
			}
			
			if($this->r('dbtype')){
				$notes['dbtype'] = $this->r('dbtype');
			}
			
			
			if($this->r('exam_type')){
				$notes['exam_type'] = $this->r('exam_type');
			}
			$notes['create_date'] = 'current_timestamp()';
			$notes['status'] = '1';
			$this->db->Insert('tblstudent_notes', $notes);
			$rs = $this->db->rs;
			$this->b['flag'] = true;
			$this->b['sc'] = 200;
		}

		
		public function get_user_ti_notes(){
			$userId = $this->r('user_id');
			$tiId = $this->r('ti_id');
			$dbtype = $this->r('dbtype');
			$noteId = $this->r('note_id');
			$subjectId = $this->r('subject_id');
			$this->db->sql = <<<SQL
			select tblstudent_notes.* ,tbluser.username,tbluser.nickname,common_image.file_name  from  tblstudent_notes
			left join tbluser on tbluser.id=tblstudent_notes.user_id
			left join common_image on common_image.user_id=tbluser.id
			where tblstudent_notes.user_id=$userId and tblstudent_notes.ti_id='$tiId' and tblstudent_notes.status=1 and tblstudent_notes.id=$noteId order by create_date desc;
SQL;
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
			$this->b['sql'] = $this->db->sql;
			if($dbtype=='1'){
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}else if($dbtype=='2'){
				$dbJson = $this->query_curriculumndb();
				if($dbJson){
					$db = json_decode($dbJson,true);
					$this->switchDB($dbInfo['ip'], $dbInfo['name']);
				}
			}
			$eduInfo = $this->get_edu_info($subjectId);
			$tblExamQuestion = $eduInfo['exam_question'];
			$tblExamQuestionIndex = $eduInfo['exam_question_index'];
			$this->db->sql = <<<SQL
										select $tblExamQuestionIndex.*,$tblExamQuestion.content,$tblExamQuestion.objective_answer,$tblExamQuestion.answer,$tblExamQuestion.image
										from $tblExamQuestionIndex
										LEFT JOIN $tblExamQuestion ON $tblExamQuestionIndex.gid=$tblExamQuestion.gid WHERE $tblExamQuestionIndex.gid='$tiId';
SQL;
			$this->db->Query();
			$this->b['content'] = $this->db->rs;
//			$this->b['sql_ti'] = $this->db->sql;
			$this->b['sc'] =200;
		}
		
		
		public function get_user_notes(){
			$userId = $this->r('user_id');
			$subjectId = $this->r('subject_id');
			$grade_id = $this->r('grade_id');
			$examId = $this->r('exam_id');
			if($grade_id==18){
				$sectionId = 2;
			}else if($grade_id==19){
				$sectionId = 3;
			}
			$sql = <<<SQL
							select tblstudent_notes.* ,tbluser.username,tbluser.nickname,common_image.file_name  from  tblstudent_notes
							left join tbluser on tbluser.id=tblstudent_notes.user_id
							left join common_image on common_image.user_id=tbluser.id
							where tblstudent_notes.user_id=$userId  and tblstudent_notes.status=1 and tblstudent_notes.subject_id=$subjectId  and tblstudent_notes.grade=$grade_id  
SQL;
			if($examId){
				$sql .=<<<SQL
							and tblstudent_notes.exam_id=$examId 
SQL;
			}
			
			$sql .=<<<SQL
							order by create_date desc
SQL;
			$pageno = $this->r('pageno')?intval($this->r('pageno')-1):null;
			$countperpage = intval($this->r('countperpage'))?$this->r('countperpage'):null;
			$this->db->sql = $sql;
			$this->db->Query();
			$result = $this->db->rs;
			$rs = $this->db->rs;
			$offset = $pageno*$countperpage;
			$step = $countperpage;
			if($offset||$step){
				$sql.=<<<SQL
							limit $offset,$step
SQL;
			}
			$this->db->sql = $sql;
			$this->db->Query();
			$this->b['list'] = $this->db->rs;
			$this->b['count'] = count($result);
			
			$exerciseHandler = new exercise_handler();
			
			$resultLevel = $exerciseHandler->get_stat_level($userId, $examId, $subjectId, $sectionId);
			
			$myLevel = $resultLevel['my_level'][0];//最新一条
			
			
			$this->b['my_level'] = $myLevel;
			
			
			$this->b['sc'] =200;
		}
		public function get_ti_notes(){
			$tiId = $this->r('ti_id');
			$pagebegin = $_REQUEST['pagebegin'];
			$pageend = $this->r('pageend');
			$this->db->sql = <<<SQL
			select tblstudent_notes.* ,tbluser.username,tbluser.nickname,common_image.file_name  from  tblstudent_notes
			left join tbluser on tbluser.id=tblstudent_notes.user_id
			left join common_image on common_image.user_id=tbluser.id
			
			where  tblstudent_notes.ti_id='$tiId' and tblstudent_notes.visible=1 order by tblstudent_notes.create_date desc limit $pagebegin , $pageend;
SQL;
			
			$this->db->Query();
			$this->b['sql1'] = $this->db->sql;
			$this->b['list'] = $this->db->rs;
			$this->db->sql = <<<SQL
			select count(*) as num  from tblstudent_notes where  ti_id='$tiId' and visible=1;
SQL;
			$this->db->Queryone();
			$rs = $this->db->rs;
//			$this->b['sql2'] = $this->db->sql;
			$this->b['num'] = $rs['num'];
			$this->b['sc'] =200;
		}
		
		public function delete_note(){
			$noteId = $this->r('note_id');
			$this->db->sql = <<<SQL
			update  tblstudent_notes set status=0 where id='$noteId';
SQL;
			$this->db->ExecuteSql();
			$rs = $this->db->rs;
			if($rs){
				$this->b['flag'] = true;
				$this->b['sc'] =200;
			}else{
				$this->b['flag'] = false;
				$this->b['sc'] =403;
			}
		}
		
		public function delete_zhuanti_notes(){
			$examId = $this->r('exam_id');
			$gradeId = $this->r('grade_id');
			$subjectId = $this->r('subject_id');
			$userId = $this->r('user_id');
			$this->db->sql = <<<SQL
			update  tblstudent_notes set status=0 where exam_id='$examId' and grade=$gradeId and subject_id=$subjectId and user_id=$userId;
SQL;
			$this->db->ExecuteSql();
			$rs = $this->db->rs;
			if($rs){
				$this->b['flag'] = true;
				$this->b['sc'] =200;
			}else{
				$this->b['flag'] = false;
				$this->b['sc'] =403;
			}
		}
		
		
		public function modify_notes(){
			$noteId = $this->r('note_id');
			$content = $this->r('content');
			$this->db->sql = <<<SQL
			update  tblstudent_notes set content='$content' , create_date=now() where id='$noteId';
SQL;
			$this->db->ExecuteSql();
			$rs = $this->db->rs;
			if($rs){
				$this->b['flag'] = true;
				$this->b['sc'] =200;
			}else{
				$this->b['flag'] = false;
				$this->b['sc'] =403;
			}
		}
		
	}
	


?>
