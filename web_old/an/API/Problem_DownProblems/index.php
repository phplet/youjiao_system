<?php
///////////////////////////////////////////////////////
// 获取试卷试题列表接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				$id = $rs[1];
				$this -> arr["sc"] = 200;
				switch($_REQUEST['way']){
					//同步测试
						case 0:
							//$this -> selectandwrite('id,name','exam_examination',null,null,'grade_id='.$_REQUEST['grade'].' and subject_id='.$_REQUEST['grade'].' and ');
							//$this -> selectandwrite('id,name','exam_examination',null,null,'id!=0');
							$myarr=explode(",",$_REQUEST['cid']);
							$topicid = " (chapter_id='".$myarr[0]."' ";
							for($i=1;$i<count($myarr);$i++){
								$topicid .= "or chapter_id='".$myarr[$i]."' ";
							}
							$topicid .= ") order by id";
							$this -> selectandwrite('id','exam_question',null,null,$topicid);
							$this -> selectandwrite('subject_id','edu_books',null,null,"id = '".$_REQUEST['fid']."'");
							break;
						//专题练习
						case 1:
							//拆分知识点
							$myarr=explode(";",$_REQUEST['knowledge_list']);
							$topicid = " (zh_knowledge='".$myarr[0]."' ";
							for($i=1;$i<count($myarr);$i++){
								$topicid .= "or zh_knowledge='".$myarr[$i]."' ";
							}
							$topicid .= ") order by id";
							$this -> selectandwrite('id','exam_question',null,null,' '.$topicid.'');
							$this -> selectandwrite('subject_id','edu_zhuanti',null,null,"id = '".$_REQUEST['id']."' ");
							break;
						//历年真题
						case 2:
						//名校试卷
						case 3:						
							$this -> selectandwrite('id','exam_question',null,null,"exam_name = '".$_REQUEST['examname']."' order by id");
							$this -> selectandwrite('subject_id','exam_examination',null,null,"name = '".$_REQUEST['examname']."'");
							break;
						default:
							$this -> arr["sc"] = 400;
							break;
				}
				
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}

	}
	
	$rs = new rss("GET",array("username","token","func","time","way"));
	
	
?>