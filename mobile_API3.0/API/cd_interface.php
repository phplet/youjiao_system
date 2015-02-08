<?php
/**
 * 光盘接口
 * @author TonyJiang
 */
//rest接口
require_once(dirname(__FILE__)."/../rest.php");
class crest extends REST{
	public function doGET(){	
	}
	
	public function doPOST(){
		$action = $this->r('action');
		switch($action){
			case 'add_exercise_info':
				
				$xmlData = file_get_contents('php://input');
				
				$this->post_add_exercice_info($xmlData);
				
				break;
				
			case 'add_user_log': 
					
				$xmlData =  file_get_contents('php://input');
				
				$this->post_add_user_log($xmlData);
				
				break;
			case 'check_psw': 
				$strPSW=$this -> r('PSW');	
				$strMachineNo=$this -> r('MachineNo');

			
				$this -> db -> sql = "select *  from usr_card_sign  where diskno='".$strPSW."'";
			    $this -> db -> Queryone();
			    $cardsign = $this -> db -> rs;
				$flag=-1;
				if($cardsign){
					$flag=0;
					$this->b['aa'] = $cardsign;
					if($cardsign["num"]>0) {$flag=1;}
					if($cardsign["machineno"]==$strMachineNo) {$flag=2;}
				}
				$this->b['sql'] = $cardsign;
				$this->b['flag'] = $flag;
				if($flag==-1){$this->b['sc'] = 401;break;}	
				if($flag==1){$this->b['sc'] = 402;break;}
				$strPSW=md5(strtoupper($strPSW));
				$strMachineNo=md5(strtoupper($strMachineNo));
				
				$ah="";
				for ($i=0 ;$i<strlen($strMachineNo);$i++){
					if ($i % 2 == 1) $ah=$ah . substr($strMachineNo,$i,1);	
				}
				
				$ai="";
				for ($i=0 ;$i<strlen($strPSW);$i++){
					if ($i % 2 == 0 ) $ai=$ai . substr($strPSW,$i,1);	
				}
				
				$arr["machineno"]=$this -> r('MachineNo');
				$arr["num"]=1;
				$this->db->update ( 'usr_card_sign', $arr, "diskno='" . $this -> r('PSW') . "'" );
				
				//$this->b['psw'] =$ai;
				//$this->b['MachineNo'] =$ah;
				//$this->b['aj'] =strtoupper($ah.$ai);
				
				$aj = md5(strtoupper($ah.$ai));
				$sm_01 = substr($aj, 0, 30);
				
				$this->b['sm'] =$sm_01;
				$this->b['sc'] = 200;
						
				break;
		}
	}
	
	private function post_add_exercice_info($xml){
		
		$dom = new DOMDocument();
		$dom->loadXML($xml);
		
		$insertInfo = array();
		
		foreach($dom->documentElement->childNodes as $k=>$node){
			$tmp = array();
			foreach($node->attributes as $attr){
				$tmp[$attr->name] = $attr->value;
			}
			$insertInfo[] = $tmp;
		}
	
//		$insertInfo = array(
//			'UID'=>$info['user_id'],
//			'SubjectID'=>$info['subject_id'],
//			'ExerciseUID'=>$info['exercise_id'],
//			'FirstLearnDate'=>$info['first_date'],
//			'LastLearnDate'=>$info['last_date'],
//			'RightTimes'=>$info['right_time'],
//			'LearnTimes'=>$info['learn_time'],
//			'Mark'=>$info['mark'],
//			'MarkDate'=>$info['mark_date'],	
//			'Degree'=>$info['degree'],
//			'TypeID'=>$info['type_id'],
//			'GID'=>$info['gid']
//		);
		
		$result = $this->db->Inserts('ExerciseInfo' , $insertInfo);
		$this->b['flag'] = $result;
		$this->b['sc'] = 200;
		
	}
	
	private function post_add_user_log($xml){
		
	$dom = new DOMDocument();
		$dom->loadXML($xml);
		
		$insertInfo = array();
		
		foreach($dom->documentElement->childNodes as $k=>$node){
			$tmp = array();
			foreach($node->attributes as $attr){
				$tmp[$attr->name] = $attr->value;
			}
			$insertInfo[] = $tmp;
		}
		
//		$insertInfo = array(
//			'UID'=>$info['user_id'],
//			'Date'=>$info['date'],
//			'SubjectID'=>$info['subject_id'],
//			'SectionID'=>$info['section_id'],
//			'SectionName'=>$info['section_name'],
//			'SectionProgressID'=>$info['section_progress_id'],
//			'RightCount'=>$info['right_count']
//		);
		
		$result = $this->db->Inserts('UserLogs' , $insertInfo);
		$this->b['flag'] = $result;
		$this->b['sc'] = 200;
	}
}
?>