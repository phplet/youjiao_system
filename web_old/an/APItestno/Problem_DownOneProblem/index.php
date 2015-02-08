<?php
///////////////////////////////////////////////////////
// 获取试卷试题接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			if($_REQUEST['username']=="jf0q2ur0ujsafj03[qrmo0vmas[k2-44rtuj" && $_REQUEST['password']=="asdjf02q3ujr9-fkdspafk-q2rfi-weaikr0-234it420jw0f"){
				$hh = true;
			}
			else{
				$hh = false;
				return;
			}
			
			if($hh){
				$this -> selectandwrite('*','exam_question',$_REQUEST['id']);
				$this -> selectandwrite('filename,qiz_tpye,image_file','exam_image',$_REQUEST['id'],'qid');
				for($i=0;$i<count($this -> arr["image_file"]);$i++){
					$this -> arr["image_file"][$i] = base64_encode($this -> arr["image_file"][$i]);
				}
				$this -> arr["content"] = base64_encode($this -> arr["content"][0]);
				$this -> arr["answer"] = base64_encode($this -> arr["answer"][0]);
				$this -> arr["sc"] = 200;
				
				
				
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}

	}
	
	$rs = new rss("GET",array("username","password","func"));
	//$rs = new rss("GET",array("id"));
	
?>