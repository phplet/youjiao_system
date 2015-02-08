<?php
/**
 * 入学测评
 */
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			$action = $this->r('action');
			$testComentHandler = new test_comment_handler();
				if ($this->vr ['pass']) {
					switch ($action){
						case 'get_test_comment':
							$centerId = $this->r('center_id');
							$zoneId = $this->r('zone_id');
							$result = $testComentHandler->get_test_comment($centerId, $zoneId);
							$this->b['list'] = $result;
						break;
						case 'get_test_comment_detail':
							$tcid = $this->r('tcid');
							$result = $testComentHandler->get_test_comment_detail_by_id($tcid);
							$this->b['list'] = $result;
						break;
						case 'get_school_info':
							$centerId = $this->r('center_id');
							$zoneId = $this->r('zone_id');
							$result = $testComentHandler->get_school_info($centerId, $zoneId);
							$this->b['list'] = $result;
					}
				}
		}
		
		public function doPOST(){
			$testComentHandler = new test_comment_handler();
			$action = $this->r('action');
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			
			switch ($action){
				case 'add_test_comment':
					$data['name'] = $this->r('name');
					$data['center_id'] = $this->r('center_id');
					$data['zone_id'] = $this->r('zone_id');
					$data['creator'] = $this->vr['id'];
					$result = $testComentHandler->add_test_comment($data);
					if($result){
						$this->b['flag'] = true;
						$this->b['id'] = $result;
					}else{
						$this->b['flag'] = false;
					}					
				break;
				case 'modify_test_comment':
					$name = $this->r('name');
					$id = $this->r('id');
					$result = $testComentHandler->modify_test_comment($id,$name);
					$this->b['flag'] = $result;
					break;
				case 'add_test_comment_detail':
					$data['detail_content'] = $this->r('detail_content');
					$data['tcid'] = intval($this->r('tcid'));
					$result = $testComentHandler->add_test_comment_detail($data);
					$this->b['flag'] = $result;
				break;
				
				case 'modify_test_comment_detail':
					$detail = $this->r('detail_content');
					$id = $this->r('id');
					$result = $testComentHandler->modify_test_comment_detail($id, $detail);
					$this->b['flag'] = $result;
				break;
				
				case 'remove_test_comment':
					$tcid = $this->r('tcid');
					$result = $testComentHandler->remove_test_comment($tcid);
					$this->b['flag'] = $result;
					break;
				case 'remove_test_comment_detail':
					$id = $this->r('id');
					$flag = 0;
					$result = $testComentHandler->remove_test_comment_or_detail($flag, $id);
					$this->b['flag'] = $result;
					break;
					
				case 'add_school_info':
					$data['address'] = $this->r('address');
					$data['url'] = $this->r('url');
					$data['tel'] = $this->r('tel');
					$data['contacts'] = $this->r('contacts');
					$data['creator'] = $this->vr['id'];
					$data['center_id'] = $this->r('center_id');
					$data['zone_id'] = $this->r('zone_id');
					$result = $testComentHandler->add_schoool_info($data);
					if($result){
						$this->b['flag'] = true;
						$this->b['id'] = $result;
					}else{
						$this->b['flag'] = false;
					}
					break;
					
				case 'modify_school_info':
					$id= $this->r('id');
					$data['address'] = $this->r('address');
					$data['url'] = $this->r('url');
					$data['tel'] = $this->r('tel');
					$data['contacts'] = $this->r('contacts');
					$result = $testComentHandler->modify_school_info($id,$data);
					$this->b['flag'] = $result;
					break;
			}
		}
	}