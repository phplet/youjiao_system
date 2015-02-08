<?php
///////////////////////////////////////////////////////
// 获取题目集合列表
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
				
				$limit = 10;				
				if($_REQUEST['pageindex']==0){
					$pageindex = 1;
					$limit = 9999;
				}
				if($_REQUEST['subjectid']==0){
					$subject = " subject_id!=0";
				}
				else{
					$subject = " subject_id=".$_REQUEST['subjectid'];
				}
				//处理地区输入
				if($_REQUEST['area']===0){
					$area = "";
				}
				else{
					$area = ' and name like BINARY "%'.$_REQUEST['area'].'%" ';
				}
				//处理年级输入
							$grade = $_REQUEST['grade_id'];
							if($grade==0){
								$grade = " grade_id!=0";
							}
							else{
								$grade = " grade_id=".$_REQUEST['grade_id'];
							}
				
				$startrecord = ($_REQUEST['pageindex']-1)*10;
				switch($_REQUEST['cateryid']){
						
						//专题练习
						case 1:
							$this -> selectandwrite('*','edu_zhuanti',null,null,$grade.' and '.$subject.' limit '.$startrecord.','.$limit);
							break;
						//历年真题
						case 2:
							if($_REQUEST['years'] == 0){
								$this -> selectandwrite('*','exam_examination',null,null,'exam_type=1 '.$area.' and '.$subject.' and '.$grade.' order by name desc limit '.$startrecord.','.$limit);
							}
							else{
								$this -> selectandwrite('*','exam_examination',null,null,'exam_type=1 '.$area.' and name like "%'.$_REQUEST['years'].'%" and '.$subject.' and '.$grade.' order by name desc limit '.$startrecord.','.$limit);
							}
							
							break;
						//名校试卷
						case 3:
							if($_REQUEST['years'] == 0){
								$this -> selectandwrite('*','exam_examination',null,null,'exam_type!=1 '.$area.' and '.$subject.' and '.$grade.' order by name desc limit '.$startrecord.','.$limit);
							}
							else{
								$this -> selectandwrite('*','exam_examination',null,null,'exam_type!=1 '.$area.' and name like "%'.$_REQUEST['years'].'%" and '.$subject.' and '.$grade.' order by name desc limit '.$startrecord.','.$limit);
							}							
							break;
						//错题本
						case 4:
							$this -> selectandwrite('exam_question.*,study_collection.add_time','(exam_question JOIN study_collection ON study_collection.question_id=exam_question.id)',null,null,'user_id='.$id.' and flag=1 and '.$subject.' limit '.$startrecord.','.$limit);
							for($i=0;$i<count($this -> arr["content"]);$i++){
								$this -> arr["content"][$i] = base64_encode($this -> arr["content"][$i]);
								$this -> arr["answer"][$i] = base64_encode($this -> arr["answer"][$i]);
							}
							break;
						//好题本
						case 5:
							$this -> selectandwrite('exam_question.*,study_collection.add_time','(exam_question JOIN study_collection ON study_collection.question_id=exam_question.id)',null,null,'user_id='.$id.' and flag=2 and '.$subject.' limit '.$startrecord.','.$limit);
							for($i=0;$i<count($this -> arr["content"]);$i++){
								$this -> arr["content"][$i] = base64_encode($this -> arr["content"][$i]);
								$this -> arr["answer"][$i] = base64_encode($this -> arr["answer"][$i]);
							}
							 
							break;
						default:
							$this -> arr["sc"] = 400;
							break;
				}
				$this -> arr["counts"] = count($this -> arr["id"]);
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}

	}
	
	$rs = new rss("GET",array("username","token","func","time"));
	
	
?>