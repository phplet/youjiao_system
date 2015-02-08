<?php
///////////////////////////////////////////////////////
// 公共试卷接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
//rest接口
require_once (dirname ( __FILE__ ) . "/../rest.php");

class crest extends REST {
	//GET逻辑
	public function doGET() {
		if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
		}
		if ($this->urlarr [3] == "id") {
			$this->getId();
		}
		elseif ($this->urlarr [3] == "unitid") {
			$this->getUnitId();	//获取同步的单元下的题目列表
		} else {
			$this->b ["sc"] = 405;
		}
	
	}
	//获取试卷信息
	private function getId() {
		if ($this->vr ['pass']) {
			if($this->r('dbtype')=='1'){
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}else if($this->r('dbtype')=='2'){
				$dbJson = $this->query_curriculumndb();
				if(count($dbJson)>0){
					$db = json_decode($dbJson,true);	
					$this->switchDB($db['ip'],$db['name']);
				}
			}
			$eduInfo = $this->get_edu_info($this->r('subject_id'));
			$examExamination2question = $eduInfo['exam_examination2question'];
			$examExamination = $eduInfo['exam_examination'];
			$this->db->sql = "select * from ".$examExamination2question." where exam_id=" . $this->r ( 'id' ) . " and subject_id=" . $this->r ('subject_id');
			//$this->db->Query ();
			//$this->b ['pub_exam'] = $this->db->rs;
			//$this->b['sql'] = $this->db->sql;
			$this->db->Query ();
			$bb= $this->db->rs;
			$content="";
			$this->b ["sql"]=$this->db->sql;
			foreach ($bb as $key => $value) {
				$content=$content.",".$value["question_id"];
		    }
			if ($content!=="") $content=substr($content,1);
			$this->b ['pub_exam'] ['content'] =$content;
			$this->b ['pub_exam'] ['dbtype']=$this->r('dbtype');
			
			
			//$this->b ['pub_exam'] ['content'] = json_decode ( $this->b ['pub_exam'] ['content'] );
			$this->b ["sc"] = 200;
		} else {
			$this->b ["sc"] = 403;
		}
	}
	
		
	//获取单元信息
		private function getUnitId() {
		if ($this->vr ['pass']) {
			if($this->r('dbtype')=='1'){
				$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			}else if($this->r('dbtype')=='2'){
				$dbJson = $this->query_curriculumndb();
				if(count($dbJson)>0){
					$db = json_decode($dbJson,true);	
					$this->switchDB($db['ip'],$db['name']);
				}
			}
			$subjectId = $this->r('subject_id');
			$eduInfo = $this->get_edu_info($subjectId);
			$eduChapter = $eduInfo['edu_chapter'];
			$educhapter2question = $eduInfo['edu_chapter2question'];
			$this->db->sql = "select question_id from ".$educhapter2question." where chapter_id=" . $this->r ( 'id' ) ;
			$this->db->Query ();
			$bb= $this->db->rs;
			$content="";
			foreach ($bb as $key => $value) {
				$content=$content.",".$value["question_id"];
		    }
			if ($content!=="") $content=substr($content,1);
			$this->b ['pub_exam'] ['content'] =$content;
			$this->b ['pub_exam'] ['dbtype']=$this->r('dbtype');
			
			$this->b ["sc"] = 200;
		} else {
			$this->b ["sc"] = 403;
		}
	}

}

?>