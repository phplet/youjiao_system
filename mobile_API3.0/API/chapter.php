<?php
///////////////////////////////////////////////////////
// 章节接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				$this -> getList();
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
		
		//列表
		public function getList(){
			if($this -> urlarr[3]!="book_id"){
				$this -> b['sc'] = 404;
				return;
			}
			$this -> db -> sql = "select distinct unit from edu_chapter where bid=".$this -> v($this -> urlarr[4]);
			$this -> db -> Query();
			$rs = $this -> db -> rs;
			if($rs != null){
				foreach ($rs as $v) {
					$chapter_list .= '<unit name="'.$v['unit'].'">';
					$chap = null;
					$this -> db -> sql = "select id,chaper from edu_chapter where bid=".$this -> urlarr[4]." and unit='".$v['unit']."' order by chaper_order asc";
					$this -> db -> Query();
					$chap = $this -> db -> rs;
					foreach ($chap as $vv) {
						$chapter_list .= '<chapter name="'.$vv['chaper'].'" id="'.$vv['id'].'"></chapter>';
					}
					$chapter_list .= '</unit>';
					$this -> b['chapter_list'] = base64_encode($chapter_list);
				}
				$this -> b["sc"] = 200;
			}
			else{
				$this -> b['sc'] = 404;
			}
			
		}

		
	}
	


?>