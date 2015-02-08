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
				//学科处理
				if($_REQUEST['subjectid']==0){
					$subject = " and exam_question.subject_id!=0";
				}
				else{
					$subject = " and exam_question.subject_id=".$_REQUEST['subjectid'];
				}
				
				
				
				/* switch($_REQUEST['cateryid']){
						
						//专题练习
						case 1:
							//拆分排除id
							$thearr = explode(",",$_REQUEST['allid']);
							if(count($thearr)==0){
								$pai = 'exam_question.id!=0';
							}
							else{
								for($i=0;$i<count($thearr);$i++){
									$pai .='exam_question.id!='.$thearr[$i].' and ';
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
							
							$this -> selectandwrite('exam_question.*','exam_question',null,null,$topicid.' and '.$f.' '.$subject.' and '.$pai.' order by rand() limit 1');
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
							$this -> selectandwrite('exam_question.*','exam_question',null,null,'exam_question.exam_name="'.$_REQUEST['topicid'].'" and '.$f.' '.$subject.' and '.$pai.' order by rand() limit 1');
							//$this -> selectandwrite('*','exam_question',null,null,'id=1001_10000943'); 
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
							$this -> selectandwrite('exam_question.*','exam_question',null,null,'exam_question.exam_name="'.$_REQUEST['topicid'].'" and '.$f.' '.$subject.' and '.$pai.' order by rand() limit 1');
							//$this -> selectandwrite('*','exam_question',null,null,'id=1001_10000943'); 
							break;
						//题本
						case 4:
						case 5:
							//$this -> arr["id"][0] = $_REQUEST['topicid'];
							$this -> selectandwrite('id,image','exam_question',null,null,'id='.$_REQUEST['topicid']);
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
					//$this -> selectandwrite('filename,qiz_tpye,image_file','exam_image',null,null,"qid=".$id);
					//for($i=0;$i<count($this -> arr["image_file"]);$i++){
						//$this -> arr["image_file"][$i] = base64_encode($this -> arr["image_file"][$i]);
					//}
					
					if($this -> arr["image"][0]!=null){
						$k = preg_replace('/\s/i',"",$this -> arr["image"][0]);
						$k = json_decode($k);
						$k = get_object_vars($k); 

						$this -> arr["image"] = "";
						for($i=0;$i<count($k["question"]);$i++){
							$k["question"][$i] = get_object_vars($k["question"][$i]);
							$this -> arr["image_file"][] = $k["question"][$i]["pic"];
							$this -> arr["filename"][] = $k["question"][$i]["file"];
							$this -> arr["qiz_tpye"][] = 1;
						}
						for($i=0;$i<count($k["answer"]);$i++){
							$k["answer"][$i] = get_object_vars($k["answer"][$i]);
							$this -> arr["image_file"][] = $k["answer"][$i]["pic"];
							$this -> arr["filename"][] = $k["answer"][$i]["file"];
							$this -> arr["qiz_tpye"][] = 2;
						}
					}
					else{
						//$this -> arr["image_file"] = "null";
						//$this -> arr["filename"] = "null";
						//$this -> arr["qiz_tpye"] = "null";
					}
					
					$this -> arr["content"] = base64_encode($this -> arr["content"][0]);
					$this -> arr["answer"] = base64_encode($this -> arr["answer"][0]); 
				} */
				
				
				
				$this -> arr["sc"] = 200;
				$this -> arr["id"][] = 0;
				$this -> arr["objective_answer"][] = "请升级";
				$this -> arr["group_count"][] = 0;
				$this -> arr["exam_name"][] = "请升级";
				$this -> arr["objective_flag"][] = 0;
				$this -> arr["answer"] = "";
				$this -> arr["content"] = base64_encode("请升级到最新题库");
				
				
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}

	}
	
	$rs = new rss("GET",array("username","token","func","time"));
	//$rs = new rss("GET",array("id"));
	
?>