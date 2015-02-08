<?php
/**
 * 题单API
 */
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		public function doGET(){
//			if(! $this->vr ['pass']) {
//				return $this->b ['sc'] = 401;
//			}
			$action = $this->r('action');
			$cloudQuestionHandler = new cloud_question_handler();
			switch ($action){
				case 'query_question_list':
					$subjectId = $this->r('subject_id');
					$questionType = $this->r('question_type');
					$knowledges = $this->r('konwledge_ids');//以逗号分开
					$pageNo = intval($this->r('pageno')) - 1;
					$countPerPage = $this->r('countperpage');
					$searchContent = $this->r('search_content');
					$result = $cloudQuestionHandler->get_query_question_list($subjectId, $questionType, $knowledges, $pageNo*$countPerPage, $countPerPage,$searchContent);
					$this->b['list'] = $result;
					$this->b['sc'] = 200;
					break;
				case 'query_question_bill':
					
					break;
			}
			
		}
		
		
		public function doPOST(){
			if(! $this->vr ['pass']) {
				return $this->b ['sc'] = 401;
			}
			$action = $this->r('action');
			$cloudQuestionHandler = new cloud_question_handler();
			switch ($action){
				case 'add_question_bill':
					break;
				case 'add_question_2_bill':
					break;
			}
		}
	}