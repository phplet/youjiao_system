<?php
///////////////////////////////////////////////////////
// 获取试卷试题接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				$id = $rs[1];
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
	
	$rs = new rss("GET",array("username","token","func","time","id"));
	//$rs = new rss("GET",array("id"));
	
?>