<?php
///////////////////////////////////////////////////////
// 专题接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				if($this -> urlarr[3]=="id"){
					$this -> getId();
				}
			}
		}
	
		//POST逻辑
		public function doPOST(){
			$this -> b["sc"] = 405;
		}
	
		//PUT逻辑
		public function doPUT(){
			$this -> b["sc"] = 405;
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		//随机获取专题题目id
		public function getId(){
			//知识点处理
			if(isset($_REQUEST['searchtext'])){
				$searchtext=$this -> r('searchtext');
				$knowledge .= "zh_knowledge like '%".$searchtext."%' or ";
			}
			
			if(!($this -> r('knowledge')==""))
			{
			$kkk = explode(';',$this -> r('knowledge'));
			$knowledge = "(";
			foreach($kkk as $v){
				if($v!="" && $v!=null){
					//$v="";
					$knowledge .= "zh_knowledge like '%".$v."%' or ";
				}				
			}
			$knowledge = substr($knowledge,0,-4).") and subject_id=".$this -> r('subject_id');
			}
			
			//题目类型处理
			if(isset($_REQUEST['ti_type'])){
				if((int)$this -> r('ti_type')==1){
					$type = " and objective_flag=1";
				}
				else if((int)$this -> r('ti_type')==2){
					$type = " and objective_flag=0";
				}
				else{
					$type = "";
				}
				
			}
			else{
				$type = "";
			}
			
			//加一个参数difficulty 类型为 string 分为 5 等级 （分别以1,2,3,4,5从简单到困难标记，0为不限）
			//$difficulty=(int)$this -> r('difficulty');
			if(isset($_REQUEST['difficulty'])){
				$difficulty=(int)$this -> r('difficulty');
			}
			else{
				$difficulty=0;
			}
			
			if($difficulty!==0){
				$sdifficulty=" and difficulty=".((int)$this -> r('difficulty'));
			}
			else{
				$sdifficulty="";
			}
			
			$this -> db -> sql = 'select id from exam_question_index where '.$knowledge.$type.$sdifficulty.' order by rand() limit '.$this -> r('total');
			/*
			if ($this -> r('subject_id')==2) {
				$this -> db -> sql = 'select id from exam_question_index where '.$knowledge.$type.$sdifficulty.'  limit '.$this -> r('total');
			}
			else{
				$this -> db -> sql = 'select id from exam_question_index where '.$knowledge.$type.$sdifficulty.' order by rand() limit '.$this -> r('total');
			}
			*/
			
			//$this -> db -> sql = 'select id from exam_question where '.$knowledge.$type.$sdifficulty.' order by rand() limit '.$this -> r('total');
			//$this -> b["sql"] = $this -> db -> sql;
			//return;
			$this -> db -> Query();
			//$this -> b["sql"] = $this -> db -> sql;
			$this -> b["id"] = $this -> db -> rs;
			$this -> b["sc"] = 200;
		}

		
	}
	
?>