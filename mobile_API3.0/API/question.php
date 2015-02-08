<?php
///////////////////////////////////////////////////////
// 试题接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");

	class crest extends REST{
		//GET逻辑
		public function doGET(){
		//$this -> getDetail();
//  	 		if($this -> vr['pass']){
				switch($this -> urlarr[3]){
					case "detail":
						$this -> getDetail();
					break;
					case "id":
						$this -> getId();
					break;
					case "list":
						$this -> getList();
					break;
					//case "hhlist":
					//	$this -> gethhList();
					break;
					case "list_byid":
						$this -> getListbyid();
					break;
					default:
						$this -> b["sc"] = 405;
					break;
				}
//			}
//			else{
//				$this -> b["sc"] = 403;
//			}
		}
	
		//POST逻辑
		public function doPOST(){
			$this -> b["sc"] = 405;
		}
	
		//PUT逻辑
		public function doPUT(){
			switch($this -> urlarr[3]){		
				case "feedback":
					$this -> feedback();
				break;
				default:
					$this -> b["sc"] = 405;
				break;
			}
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		//获取id组
		private function getId(){
			//客观主观选择
			switch((int)$this -> r('ti_type')){
					case 0:
						$f = "objective_flag!=9";
					break;
					case 1:
						$f = "objective_flag=1";
					break;
					case 2:
						$f = "objective_flag=0";
					break;
					default:
						$f = "objective_flag!=9";
					break;
				
				}
			//学科处理
			if((int)$this ->r('subject_id')==0){
				$subject = " and subject_id!=0";
			}
			else{
				$subject = " and subject_id=".$this ->r('subjectid');
			}
			
			$this -> db -> sql = 'select id from exam_question where $f $subject order by rand() limit '.$this -> r('total');
			$this -> db -> Query();
			$this -> b["id"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		//加入题目反馈
		private function feedback(){
			$arr['userid'] = $this -> vr['id'];
			$arr['feedtime'] = 'current_timestamp()';
			$arr['content'] = $this -> r('content');
			$arr['ti_id'] = $this -> r('ti_id');
			$this -> db -> Insert('ti_feedback',$arr);
			$this -> b["sc"] = 201;
		}
		
		
		//获取具体题目
		private function getDetail(){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$subjectId = $this->r('subject_id');
//			$id = $this->r('id');
//			$questionInfo = json_decode($this->r('id'),true);
			$tblEaxm = $this->get_examination_tbl($subjectId);
			$tblEaxmIndex = $tblEaxm.'_index';
			$dbType = $this->r('dbtype');
			$tiId = $this->r('id'); 
			if($dbType==1&&$tiId){	
					$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
					$sql =<<<SQL
					select 
					$tblEaxmIndex.gid,$tblEaxmIndex.zh_knowledge,$tblEaxmIndex.difficulty,$tblEaxmIndex.score,$tblEaxmIndex.objective_flag,
					$tblEaxmIndex.option_count,$tblEaxmIndex.group_count,$tblEaxmIndex.question_type as question_type_id,$tblEaxmIndex.exam_name,$tblEaxmIndex.subject_id,$tblEaxmIndex.grade_id,
					$tblEaxmIndex.section_id,
					$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,a.dbtype,
					edu_question_type.type_name as question_type
					from $tblEaxmIndex
					LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
					LEFT JOIN edu_question_type ON edu_question_type.id=$tblEaxmIndex.question_type
					join (select 1 as dbtype) a on 1=1
SQL;
					$where = ' WHERE '.$tblEaxmIndex.'.gid ="'.$tiId.'"';
					$this->db->sql = $sql.$where;
					
//					echo $this->db->sql;
//					exit;
					$this->db->Query();
					$this->b['sql'] = $this->db->sql;
					$result1 = $this->db->rs;
				}
				 if($dbType==2&&$tiId){
					$dbJson = $this->query_curriculumndb();
					if($dbJson){
						$db = json_decode($dbJson,true);
//						print_r($db);
						$this->switchDB($db['ip'],$db['name']);
//						$this->switchDB($db['ip'], $db['name']);
						$sql =<<<SQL
					select 
						$tblEaxmIndex.gid,$tblEaxmIndex.zh_knowledge,$tblEaxmIndex.difficulty,$tblEaxmIndex.score,$tblEaxmIndex.objective_flag,
						$tblEaxmIndex.option_count,$tblEaxmIndex.group_count,$tblEaxmIndex.question_type as question_type_id,$tblEaxmIndex.exam_name,$tblEaxmIndex.subject_id,$tblEaxmIndex.grade_id,
						$tblEaxmIndex.section_id,
						$tblEaxm.content,$tblEaxm.objective_answer,$tblEaxm.answer,a.dbtype,
						edu_question_type.type_name as question_type
						from $tblEaxmIndex
						LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid
						LEFT JOIN edu_question_type ON edu_question_type.id=$tblEaxmIndex.question_type
						join (select 2 as dbtype) a on 1=1
SQL;

						$where = ' WHERE '.$tblEaxmIndex.'.gid ="'.$tiId.'"';
//						echo $sql.$where;
						$this->db->sql = $sql.$where;
						 $this->db->Query();
						 $result2 = $this->db->rs;
					}
					
				}
			
			if(isset($result1)&&isset($result2)){
				$result = array_merge($result1,$result2);
			}else if(isset($result1)&&!isset($result2)){
				$result = $result1;
			}else if(!isset($result1)&&isset($result2)){
				$result = $result2;
			}
//			$this -> db -> sql =<<<SQL
//				select $tblEaxm.gid as id,$tblEaxm.content,$tblEaxm.image,$tblEaxm.answer,$tblEaxm.objective_answer,$tblEaxmIndex.*
//				from $tblEaxmIndex
//				LEFT JOIN $tblEaxm ON $tblEaxmIndex.gid=$tblEaxm.gid where $tblEaxmIndex.gid='$id';
//SQL;
//			echo $this->db->sql;
//			$this->b['sql'] = $this->db->sql;
//			$this -> db -> Queryone();
			$a["question"] =$result[0];
//			print_r($this->db->rs);
			$v=$a["question"];
			
			if($v['objective_flag']==1 and (strtoupper($this -> cut_str($v['objective_answer'],1,0))=="F"||strtoupper($this -> cut_str($v['objective_answer'],1,0))=="T")){
					$a["question"]["type"] = 99;
			}
			
			else {
				if($v['objective_flag']==1 and $this -> cut_str($v['objective_answer'],1,-1)!="组"){
					if(strlen($v['objective_answer'])>1){
						
						$a["question"]["type"] = 22;
					}
					else{
						$a["question"]["type"] = 21;
					}
				}
				else
				{
					   $a["question"]["type"] = 99;
				}
				
				
			}
			$this -> b["question"]=base64_encode(json_encode($a["question"]));
			$this->b['sql'] = $this->db->sql;
			if(isset($_REQUEST['study_exercise_id'])){
				
				$this->switchDB($this->DBCFG['default_local']['dbhost'],$this->DBCFG['default_local']['dbname']);
				
				/*if($dbType=='1'){
					$this->switchDB($this->DBCFG['default_local']['dbhost'],$this->DBCFG['default_local']['dbname']);
				}else if($dbType=='2'){
					$dbJson = $this->query_curriculumndb();
					if($dbJson){
						$db = json_decode($dbJson,true);
						$this->switchDB($db['ip'],$db['name']);
					}
				}*/
				
				$this->db-> sql = "select id,user_id,exercise_id,content,pi,my_score,type,log_time from study_exercise where id=".$this->r('study_exercise_id');
				$this-> db-> Queryone();
				 
				$rs = $this -> db -> rs;
				
				$answerContent = $rs['content'];
				$answer = json_decode(base64_decode($answerContent),true);
				foreach ($answer as $key=>$value){
					if($value['id']==$tiId){
						$tiAnswer = $value['answer'];
						$tiAttachment = $value['attachment'];
						$tiPi = $value['pi'];
						break;
					}
				}
//				$this->b['answerContent'] = $answer;
//				$this->b['ti_id'] = $tiId;
				$this->b['ti_answer'] = $tiAnswer;
				$this->b['ti_attachment'] = $tiAttachment;
				$this->b['ti_pi'] = $tiPi;
			}
			$this->b['sc'] = 200;
			
		}
	
		
		private function makejp($v){
			     if($v['image']!=null){
						$iii = json_decode($v['image'],true);
						$match = null;
						preg_match_all("/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $v['content'], $match);
						$qq = $iii['question'];
						foreach($match[0] as $pp=>$w){													
							for($j=0;$j<count($qq);$j++){
								if(strstr($match[1][$pp],$qq[$j]['file'])!=false){
									$v['content'] = str_replace($match[0][$pp],'<img src="data:image/gif;base64,'.$qq[$j]['pic'].'">',$v['content']);
									break;
								}
							}							
						}
						$match1 = null;
						preg_match_all("/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $v['answer'], $match1);
						$qq = $iii['answer'];
						foreach($match1[0] as $p1=>$w1){							
							for($j=0;$j<count($qq);$j++){
								if(strstr($match1[1][$p1],$qq[$j]['file'])!=false){
									$v['answer'] = str_replace($match1[0][$p1],'<img src="data:image/gif;base64,'.$qq[$j]['pic'].'">',$v['answer']);
									break;
								}
							}							
						}
				    }
					
					//拆分选项
					$tigan="";	
					$xuanxiang=null;
					$newarr = array();
					
					
					//非组选客观题
					if($v['objective_flag']==1 and $this -> cut_str($v['objective_answer'],1,-1)!="组"){
						$arr['state'] = 1;
						
						//非组选客观题格式
						$newarr['subject'] = array();
						$newarr['subject'][0]['select'] = array();
						
						$jj = 0;
						if(strlen($v['objective_answer'])>1){
							$newarr["type"] = 22;
							$newarr['subject'][0]['type'] = 12;
						}
						else{
							$newarr["type"] = 21;
							$newarr['subject'][0]['type'] = 11;
						}
						$newarr["topic"] = '';
						$newarr['subject'][0]['topic'] ="";// base64_encode($tigan);
						
						if($this -> cut_str($v['objective_answer'],1,-1)=="不"){
							$newarr['subject'][0]['answer'] = $this -> cut_str($v['objective_answer'],-1,0);
						}
						else{
							$newarr['subject'][0]['answer'] = $v['objective_answer'];
						}
						
					}
					else{
						//组选题 及主观题
						$newarr["topic"] = '';
						$newarr["type"] = 99;
						$newarr['subject'] = array();
						$newarr['subject'][0]['type'] = 99;
						$newarr['subject'][0]['topic'] = base64_encode($v['content']);	
						if($v['objective_flag']==1){
							$newarr['subject'][0]['answer'] = $this -> cut_str($v['objective_answer'],-1,0);
						}
					}
					
					$newarr['translate'] = '';
					$newarr['analys'] = base64_encode($v['answer']);
					
					return $newarr;
		}
		
		private function makejp_($v){	
					//拆分选项
					$tigan="";	
					$xuanxiang=null;
					$newarr = array();
					//非组选客观题
					
					if($v['objective_flag']==1 and $this -> cut_str($v['objective_answer'],1,-1)!="组"){
						$arr['state'] = 1;
						
						//非组选客观题格式
						$newarr['subject'] = array();
						$newarr['subject'][0]['select'] = array();
						
						$jj = 0;

						if(strlen($v['objective_answer'])>1){
							$newarr["type"] = 22;
							$newarr['subject'][0]['type'] = 12;
						}
						else{
							$newarr["type"] = 21;
							$newarr['subject'][0]['type'] = 11;
						}
						$newarr["topic"] = '';
						$newarr['subject'][0]['topic'] ='';// base64_encode($tigan);
						
						if($this -> cut_str($v['objective_answer'],1,-1)=="不"){
							$newarr['subject'][0]['answer'] = $this -> cut_str($v['objective_answer'],-1,0);
						}
						else{
							$newarr['subject'][0]['answer'] = $v['objective_answer'];
						}		
					}
					else{
						//组选题 及主观题
						$newarr["topic"] = '';
						$newarr["type"] = 99;
						$newarr['subject'] = array();
						$newarr['subject'][0]['type'] = 99;
						$newarr['subject'][0]['topic'] = base64_encode($v['content']);	
						if($v['objective_flag']==1){
							$newarr['subject'][0]['answer'] = $this -> cut_str($v['objective_answer'],-1,0);
						}
					}
					
					$newarr['translate'] = '';
					$newarr['analys'] = base64_encode($v['answer']);
					//print_r($newarr);
					
					return $newarr;
		}
		private function cut_str($string, $sublen, $start = 0, $code = 'UTF-8') 
		{ 
			if($code == 'UTF-8') 
			{ 
				$pa ="/[\x01-\x7f]|[\xc2-\xdf][\x80-\xbf]|\xe0[\xa0-\xbf][\x80-\xbf]|[\xe1-\xef][\x80-\xbf][\x80-\xbf]|\xf0[\x90-\xbf][\x80-\xbf][\x80-\xbf]|[\xf1-\xf7][\x80-\xbf][\x80-\xbf][\x80-\xbf]/"; 
				preg_match_all($pa, $string, $t_string); 
				if(count($t_string[0]) - $start > $sublen) return join('', array_slice($t_string[0], $start, $sublen)); 
				return join('', array_slice($t_string[0], $start, $sublen)); 
			} 
			else 
			{ 
				$start = $start*2; 
				$sublen = $sublen*2; 
				$strlen = strlen($string); 
				$tmpstr = ''; for($i=0; $i<$strlen; $i++) 
				{ 
					if($i>=$start && $i<($start+$sublen)) 
					{ 
						if(ord(substr($string, $i, 1))>129) 
						{ 
							$tmpstr.= substr($string, $i, 2); 
						} 
						else 
						{ 
							$tmpstr.= substr($string, $i, 1); 
						} 
					} 
					if(ord(substr($string, $i, 1))>129) $i++; 
				} 
				if(strlen($tmpstr)<$strlen ) $tmpstr.= ""; 
				return $tmpstr; 
			} 
		}
		
		//获取题目列表
		private function getList(){
			$where = "";
			if(isset($_REQUEST['ti_type'])){
				if($_REQUEST['ti_type']==1){  //主观
					$where .="objective_flag=1";
				}
				if($_REQUEST['ti_type']==0){ //客观
					$where .="objective_flag=0";
				}
				if($_REQUEST['ti_type']==2){  //主客观都选
					$where .=" 1=1 ";
				}
				
			}
			if(isset($_REQUEST['subject_id'])){
				if($where!=""){
					$where .= " and ";
				}
				$where .="subject_id=".$this -> r('subject_id');
			}
			if((int)$_REQUEST['difficulty']!=0){
				if($where!=""){
					$where .= " and ";
				}
				$where .="difficulty=".$this -> r('difficulty');
			}
			
			//-------------------
			if($_REQUEST['s_type']==1){
				if($where!=""){
					$where .= " and ";
				}
				$where .="chapter_id=".$this -> r('chapter_id');
			}
			
			
			if($_REQUEST['s_type']==2){
				if($where!=""){
					$where .= " and ";
				}
				$kk = explode(";",$this -> r('knowledge')); //hhhhhhh
				$kkn = "";
				foreach($kk as $vvv){
					$kkn .= "'".$vvv."',";
				}
				$kkn = substr($kkn,0,-1);
				$where .="zh_knowledge in (".$kkn.")";
			}
			
			
			if($_REQUEST['s_type']==3){
				$zhentiexam_id=$_REQUEST['zhentiexam_id'];
				
				$this -> db -> sql = "select id,content from exam_examination  where id='".$zhentiexam_id."' ";			
				$this -> db -> Query();
				$exam=$this -> db -> rs;
				
				foreach($exam as $examitem){
					$c=json_decode($examitem["content"],true);					
					foreach($c["list"] as  $key=>$value)
					{
						$ti_all .="'".$value."',";
					}
				}
				$ti_all = substr($ti_all,0,-1);
				
				
				
				if($where!=""){
					$where .= " and ";
				}
				$where .=" id in (".$ti_all .") ";
			}
			
			
			if($where!=""){
				$where = " where ".$where;
			}
			
			
			$this -> db -> sql = "select * from exam_question $where ";
			$this -> db -> Query();	
			
			$page=$this -> r('total');
			$pageSize=20;
			$recordFrom=1;
			
			$pageTotal=count($this -> db -> rs);
					
			if (!($page==null))
			{
				$pageSize=$this -> r('total');
				$recordFrom=$this -> r('start')-1;
				$recordFrom=$recordFrom * $pageSize;
				$this -> db -> sql=$this -> db -> sql. " limit ". $recordFrom. ", ". $pageSize;
			}
			
			$this -> db -> Query();		
			$this -> b["pages"]=$pageTotal;
				
			//$this -> db -> sql = "select * from exam_question $where limit ".$this -> r('start').",20";
			//$this -> db -> Query();

			
             //***********************   hh  2013/1/8 *****************
		     foreach($this -> db -> rs as $k=>$v){
					$v['image'] = preg_replace("'([\r\n])[\s]+'", "", $v['image']);
					$v['image'] = preg_replace("' \",'", "\",", $v['image']);
					$iii = json_decode($v['image'],true);
					$match = null;
					$this -> db -> rs[$k]['content']= preg_replace("'MypicPath'", "", $this -> db -> rs[$k]['content']);
					preg_match_all("/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $this -> db -> rs[$k]['content'], $match);
					foreach($match[0] as $p=>$w){						
						$qq = $iii['question'];
						for($j=0;$j<count($qq);$j++){
							$temp=$qq[$j]['file'];

							if(strstr($match[1][$p],$temp)!=false){
								$this -> db -> rs[$k]['content'] = str_replace($match[0][$p],'<img src="data:image/gif;base64,'.$qq[$j]['pic'].'">',$this -> db -> rs[$k]['content']);
								break;
							}
						}							
					}
					
				 	$match1 = null;
					$this -> db -> rs[$k]['answer']= preg_replace("'MypicPath'", "", $this -> db -> rs[$k]['answer']);
					preg_match_all("/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $this -> db -> rs[$k]['answer'], $match1);
					foreach($match1[0] as $p1=>$w1){
						$qq = $iii['answer'];
						for($j=0;$j<count($qq);$j++){
							if(strstr($match1[1][$p1],$qq[$j]['file'])!=false){
								$this -> db -> rs[$k]['answer'] = str_replace($match1[0][$p1],'<img src="data:image/gif;base64,'.$qq[$j]['pic'].'">',$this -> db -> rs[$k]['answer']);
								break;
							}
						}							
					}
					unset($this -> db -> rs[$k]['image']);
			}
			//*******************************			
			
			$this -> b["question"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		
		//获取题目列表
		/*
		private function gethhList(){
			$where = "";
			if(isset($_REQUEST['ti_type'])){
				if($_REQUEST['ti_type']==1){
					$where .="objective_flag=1";
				}
				else{
					$where .="objective_flag=0";
				}
				
			}
			if(isset($_REQUEST['subject_id'])){
				if($where!=""){
					$where .= " and ";
				}
				$where .="subject_id=".$this -> r('subject_id');
			}
			if((int)$_REQUEST['difficulty']!=0){
				if($where!=""){
					$where .= " and ";
				}
				$where .="difficulty=".$this -> r('difficulty');
			}
			if($_REQUEST['s_type']==1){
				if($where!=""){
					$where .= " and ";
				}
				$where .="chapter_id=".$this -> r('chapter_id');
			}
			else{
				if($where!=""){
					$where .= " and ";
				}
				$kk = explode(";",$this -> r('knowledge'));  //hhhhh
				$kkn = "";
				foreach($kk as $vvv){
					$kkn .= "'".$vvv."',";
				}
				$kkn = substr($kkn,0,-1);
				$where .="zh_knowledge in (".$kkn.")";
			}
			if($where!=""){
				$where = "where ".$where;
			}
			$this -> db -> sql = "select * from exam_question $where limit ".$this -> r('start').",".$this -> r('total');
			$this -> db -> Query();
			
			//$this -> b["question"] = $this -> db -> sql;
			//$this -> b["sc"] = 200;
			//return;
			
			//***********************
		     foreach($this -> db -> rs as $k=>$v){
					$v['image'] = preg_replace("'([\r\n])[\s]+'", "", $v['image']);
					$iii = json_decode($v['image'],true);
					$match = null;
					preg_match_all("/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $this -> db -> rs[$k]['content'], $match);
					foreach($match[0] as $p=>$w){						
						$qq = $iii['question'];
						for($j=0;$j<count($qq);$j++){
							if(strstr($match[1][$p],$qq[$j]['file'])!=false){
								$this -> db -> rs[$k]['content'] = str_replace($match[0][$p],'<img src="data:image/gif;base64,'.$qq[$j]['pic'].'">',$this -> db -> rs[$k]['content']);
								break;
							}
						}							
					}
					
				 	$match1 = null;
					preg_match_all("/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $this -> db -> rs[$k]['answer'], $match1);
					foreach($match1[0] as $p1=>$w1){
						$qq = $iii['answer'];
						for($j=0;$j<count($qq);$j++){
							if(strstr($match1[1][$p1],$qq[$j]['file'])!=false){
								$this -> db -> rs[$k]['answer'] = str_replace($match1[0][$p1],'<img src="data:image/gif;base64,'.$qq[$j]['pic'].'">',$this -> db -> rs[$k]['answer']);
								break;
							}
						}							
					}
					unset($this -> db -> rs[$k]['image']);
			}
			//*******************************
			
			
			$this -> b["question"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		*/
		
		//根据id获取试题
		private function getListbyid(){
 			$ti = explode(",",$this -> r('ti_id'));
			$tt = "";
			foreach($ti as $v){
				$tt .= "'".$v."',";
			}
			$tt = substr($tt,0,-1);
			$this -> db -> sql = "select * from exam_question where id in (".$tt.")";
			$this -> db -> Query();
			
			//***********************
		     foreach($this -> db -> rs as $k=>$v){
					$v['image'] = preg_replace("'([\r\n])[\s]+'", "", $v['image']);
					$v['image'] = preg_replace("' \",'", "\",", $v['image']);
					$iii = json_decode($v['image'],true);
					$match = null;
					$this -> db -> rs[$k]['content']= preg_replace("'MypicPath'", "", $this -> db -> rs[$k]['content']);
					preg_match_all("/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $this -> db -> rs[$k]['content'], $match);
					foreach($match[0] as $p=>$w){						
						$qq = $iii['question'];
						for($j=0;$j<count($qq);$j++){
							if(strstr($match[1][$p],$qq[$j]['file'])!=false){
								$this -> db -> rs[$k]['content'] = str_replace($match[0][$p],'<img src="data:image/gif;base64,'.$qq[$j]['pic'].'">',$this -> db -> rs[$k]['content']);
								break;
							}
						}							
					}
					
				 	$match1 = null;
					$this -> db -> rs[$k]['answer']= preg_replace("'MypicPath'", "", $this -> db -> rs[$k]['answer']);
					preg_match_all("/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/i", $this -> db -> rs[$k]['answer'], $match1);
					foreach($match1[0] as $p1=>$w1){
						$qq = $iii['answer'];
						for($j=0;$j<count($qq);$j++){
							if(strstr($match1[1][$p1],$qq[$j]['file'])!=false){
								$this -> db -> rs[$k]['answer'] = str_replace($match1[0][$p1],'<img src="data:image/gif;base64,'.$qq[$j]['pic'].'">',$this -> db -> rs[$k]['answer']);
								break;
							}
						}							
					}
					unset($this -> db -> rs[$k]['image']);
			}
			//*******************************
			
			$this -> b["question"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}
		
	function js_unescape($str)
	{
		$ret = '';
		$len = strlen($str);
		for ($i = 0; $i < $len; $i++)
		{
			if ($str[$i] == '%' && $str[$i+1] == 'u')
			{
				$val = hexdec(substr($str, $i+2, 4));
				if ($val < 0x7f) $ret .= chr($val);
				else if($val < 0x800) $ret .= chr(0xc0|($val>>6)).chr(0x80|($val&0x3f));
				else $ret .= chr(0xe0|($val>>12)).chr(0x80|(($val>>6)&0x3f)).chr(0x80|($val&0x3f));
				$i += 5;
			}
			else if ($str[$i] == '%')
			{
				$ret .= urldecode(substr($str, $i, 3));
				$i += 2;
			}
			else $ret .= $str[$i];
		}
		return $ret;
	}


	function phpescape($str)
	{
		$sublen=strlen($str);
		$retrunString="";
		for ($i=0;$i<$sublen;$i++)
		{ 
			if(ord($str[$i])>=127)
			{
				$tmpString=bin2hex(iconv("utf-8","ucs-2",substr($str,$i,2)));
				//$tmpString=substr($tmpString,2,2).substr($tmpString,0,2);linux下打开这项
				$retrunString.="%u".$tmpString;
				$i++;
			} else {
				$retrunString.="%".dechex(ord($str[$i]));
			}
		} 
		return $retrunString;
	}
	
}
	


?>