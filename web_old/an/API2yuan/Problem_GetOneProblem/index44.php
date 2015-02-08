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
				
				
				$this -> arr["sc"] = 200;
				
				switch($_REQUEST['ti_typeid']){
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
					break;
				
				}
				
				
				
				switch($_REQUEST['cateryid']){
						
						//专题练习
						case 1:
							//拆分排除id
							$thearr = explode(",",$_REQUEST['allid']);
							if(count($thearr)==0){
								$pai = "exam_question.id!=0";
							}
							else{
								for($i=0;$i<count($thearr);$i++){
									$pai .="exam_question.id!=".$thearr[$i]." and ";
								}
								$pai = substr($pai,0,-4);
							}
							//拆分知识点
							$myarr=explode(";",$_REQUEST['topicid']);
							$topicid = " (zh_knowledge='".$myarr[0]."' ";
							for($i=1;$i<count($myarr);$i++){
								$topicid .= "or zh_knowledge='".$myarr[$i]."' ";
							}
							$topicid .= ")";
							
							$this -> selectandwrite('exam_question.*','exam_question',null,null,$topicid.' and '.$f.' and '.$pai.' order by rand() limit 1');
							break;
						//历年真题
						case 2:
							$thearr = explode(",",$_REQUEST['allid']);
							if(count($thearr)==0){
								$pai = "id!=0";
							}
							else{
								for($i=0;$i<count($thearr);$i++){
									$pai .="exam_question.id!=".$thearr[$i]." and ";
								}
								$pai = substr($pai,0,-4);
							}
							$this -> selectandwrite('exam_question.*','(exam_question JOIN exam_examination ON exam_question.exam_name=exam_examination.name)',null,null,'exam_question.exam_name="'.$_REQUEST['topicid'].'" and '.$f.' and '.$pai.' order by rand() limit 1');
							//$this -> selectandwrite('*','exam_question',null,null,'id=835740'); 
							break;
						//名校试卷
						case 3:
							$thearr = explode(",",$_REQUEST['allid']);
							if(count($thearr)==0){
								$pai = "exam_question.id!=0";
							}
							else{
								for($i=0;$i<count($thearr);$i++){
									$pai .="exam_question.id!=".$thearr[$i]." and ";
								}
								$pai = substr($pai,0,-4);
							}
							$this -> selectandwrite('exam_question.*','(exam_question JOIN exam_examination ON exam_question.exam_name=exam_examination.name)',null,null,'exam_question.exam_name="'.$_REQUEST['topicid'].'" and '.$f.' and '.$pai.' order by rand() limit 1');
							break;
						//题本
						case 4:
						case 5:
							$this -> arr["id"][0] = $_REQUEST['topicid'];
							//$this -> selectandwrite('*','exam_question',null,null,'id='.$_REQUEST['topicid']);
							break;

						default:
							$this -> arr["sc"] = 400;
							break;
				}
				
				$id = $this -> arr["id"][0];
				if(empty($id)){
					$this -> arr["sc"] = 401;
				}
				else{
					$this -> selectandwrite('filename,qiz_tpye,image_file','exam_image',null,null,"qid=".$id);
					for($i=0;$i<count($this -> arr["image_file"]);$i++){
						$this -> arr["image_file"][$i] = base64_encode($this -> arr["image_file"][$i]);
					}
					$this -> arr["content"] = base64_encode($this -> arr["content"][0]);
					$this -> arr["answer"] = base64_encode($this -> arr["answer"][0]); 
				}
				
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}

	}
	
	$rs = new rss("GET",array("username","token","func","time"));
	//$rs = new rss("GET",array("id"));
	
?>