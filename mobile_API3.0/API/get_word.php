<?php
///////////////////////////////////////////////////////
// 获取word文档接口
// by TonyJiang
///////////////////////////////////////////////////////
//rest接口
require_once (dirname ( __FILE__ ) . "/../rest.php");
require_once (dirname ( __FILE__ ) . '/../include/w.php');

class crest extends REST {
	//GET逻辑
	public function doGET() {
		if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
		}
		$action = $this->r('action');
		
		switch($action){
			case 'zhenti':
				$zhenti_id = $this->r('zhenti_id');
				$this->get_zhenti_word($zhenti_id);
				
				break;
		}
	}
	
	public function doPOST(){
		
	}
	
	private function get_zhenti_word($zhenti_id){
		$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
		$eduInfo = $this->get_edu_info($this->r('subject_id'));
		$tblExamination = $eduInfo['exam_examination'];
		$this->db->sql = 'SELECT * FROM '.$tblExamination.' WHERE id='.$zhenti_id;
		
		$this->db->Queryone();
		
		$examInfo = $this->db->rs;
		
		$questionID = json_decode($this->db->rs['content'],true);
		
		$questionID = implode('","' , $questionID['list']);
		
		$subject = array(
			1=>'yw',//语文
			2=>'sx',
			3=>'yy',
			4=>'wl',
			5=>'hx',
			6=>'sw',
			7=>'dl',
			8=>'ls',
			9=>'zz'
		);
		
		$tableName1 = $subject[$examInfo['subject_id']].'_exam_question';
		$tableName2 = $subject[$examInfo['subject_id']].'_exam_question_index';
		
		$sql = <<<SQL
			SELECT * FROM $tableName2 
			LEFT JOIN $tableName1 ON $tableName2.gid=$tableName1.gid 
			WHERE $tableName2.gid in ("$questionID") 
			ORDER BY $tableName2.gid ASC 
SQL;
		$this->db->sql = $sql;
//		echo $sql;
//		exit;
		$this->db->Query();
		$result = $this->db->rs;
		
		$aa = "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><title>WORD生成时间".date('Y-m-d')."</title></head><body><h1>".$examInfo['name']."</h1><hr>";
		$filearr = array();
		foreach($result as $k1=>$v){
			$match = null;
			$v ['content'] = str_replace ( "MypicPath\\", "", $v ['content'] );
			preg_match_all ( "/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $v ['content'], $match );
			$v ['answer'] = str_replace ( "MypicPath\\", "", $v ['answer'] );
			preg_match_all ( "/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $v ['answer'], $matchAnswer );
			foreach ( $match[1]  as $k => $w ) {
					$time = time();
					$name = "http://" . rand ().'_'.$time.'.jpg';
					$v ['content'] = str_replace ( $match [0] [$k], '<img src="' . $name . '">', $v ['content'] );
					$imgStr = substr($match [1] [$k] ,22); //截取data:image/gif;base64,后面的字符串
					$filearr [$name] = base64_decode ($imgStr);
				}
			foreach ( $matchAnswer[1]  as $k => $w ) {
					$time = time();
					$name = "http://" . rand ().'_'.$time.'.jpg';
					$v ['answer'] = str_replace ( $match [0] [$k], '<img src="' . $name . '">', $v ['answer'] );
					$imgStr = substr($matchAnswer[1] [$k] ,22);
					$filearr [$name] = base64_decode ($imgStr);
				}						
					$k1++;
					$aa .= "<p style='font-weight:bold'>-----第".$k1."题 ----</p><div style='font-weight:bold'>".$v['content']."</div><br><br><br><hr>";
					if($this->r('with_answer')){ //选择带有解析
						if(trim($v['objective_answer'])!=''){
							$aa .= "<p style='font-weight:bold'>----- 答案----</p><div style='font-weight:bold'>".trim($v['objective_answer'])."</div><br><br><br><hr>";
						}
						if($v['answer']!=''){
										$aa .= "<p style='font-weight:bold'>----- 解析----</p><div style='font-weight:bold'>".trim($v['answer'])."</div><br><br><br><hr>";
								}
						}
				}
		$aa .='</html>';
		
		$word = new MhtFileMaker();
		$word->AddContents('tmp.html',$word->GetMimeType('tmp.html'),$aa);
		foreach($filearr as $kkk => $vvv){
				$word->AddContents($kkk,$word->GetMimeType($kkk),$vvv); 
			}
		$wordContent = $word->GetFile();
		header('Content-Type: application/vnd.ms-word');  
		header('Content-Disposition:filename=exam.doc');
		echo $wordContent;
		exit;
	}
	
	
}
?>