<?php
///////////////////////////////////////////////////////
// 获取商品列表接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				$id = $rs[1];
				//所需商品为试题时
				if($_REQUEST['type'] == "problem"){
					$this -> arr["sc"] = 200;
					switch($_REQUEST['way']){
						
						//同步测试
						case 0:
							$this -> selectandwrite('*','edu_books',null,null,'id!=0 limit 10');
							break;
						//专题练习
						case 1:
							//处理年级输入
							$grade = $_REQUEST['grade'];
							if($grade==0){
								$grade = "grade_id!=0";
							}
							else{
								$grade = "grade_id=".$grade;
							}
							//处理学科输入
							$subject = $_REQUEST['subject'];
							if($subject==0){
								$subject = "and subject_id!=0";
							}
							else if($subject==99){
								$subject = "and (subject_id=4 or subject_id=5 or subject_id=6)";
							}else if($subject==999){
								$subject = "and (subject_id=7 or subject_id=8 or subject_id=9)";
							}
							else{
								$subject = "and subject_id=".$subject;
							}
							$this -> selectandwrite('*','edu_zhuanti',null,null,' '.$grade.' '.$subject.' limit 10');
							break;
						//历年真题
						case 2:
							//处理年级输入
							$grade = $_REQUEST['grade'];
							if($grade==0){
								$grade = "and grade_id!=0";
							}
							else{
								$grade = "and grade_id=".$grade;
							}
							//处理学科输入
							$subject = $_REQUEST['subject'];
							if($subject==0){
								$subject = "and subject_id!=0";
							}
							else if($subject==99){
								$subject = "and (subject_id=4 or subject_id=5 or subject_id=6)";
							}else if($subject==999){
								$subject = "and (subject_id=7 or subject_id=8 or subject_id=9)";
							}
							else{
								$subject = "and subject_id=".$subject;
							}
							//处理年份输入
							$year = $_REQUEST['year'];
							if($year==0){
								$year = "";
							}
							else{
								$year = "and name like '%".$year."%'";
							}
							//处理地区输入
							$province = $_REQUEST['province'];
							if($province=="所有"){
								$province = "";
							}
							else{
								$province = "and name like BINARY '%".$province."%'";
							}
							$this -> selectandwrite('*','exam_examination',null,null,'(exam_type=1 or exam_type=20) '.$grade.' '.$subject.' '.$year.' '.$province.'  limit 10');
							break;
						//名校试卷
						case 3:
						//处理年级输入
							$grade = $_REQUEST['grade'];
							if($grade==0){
								$grade = "and grade_id!=0";
							}
							else{
								$grade = "and grade_id=".$grade;
							}
							//处理学科输入
							$subject = $_REQUEST['subject'];
							if($subject==0){
								$subject = "and subject_id!=0";
							}
							else if($subject==99){
								$subject = "and (subject_id=4 or subject_id=5 or subject_id=6)";
							}else if($subject==999){
								$subject = "and (subject_id=7 or subject_id=8 or subject_id=9)";
							}
							else{
								$subject = "and subject_id=".$subject;
							}
							//处理年份输入
							$year = $_REQUEST['year'];
							if($year==0){
								$year = "";
							}
							else{
								$year = "and name like '%".$year."%'";
							}
							//处理地区输入
							$province = $_REQUEST['province'];
							if($province=="所有"){
								$province = "";
							}
							else{
								$province = "and name like BINARY '%".$province."%'";
							}
							$this -> selectandwrite('*','exam_examination',null,null,'(exam_type!=1 and exam_type!=20) '.$grade.' '.$subject.' '.$year.' '.$province.'  limit 10');
							break;
						//书籍目录
						case 4:
							$this -> selectandwrite('*','edu_chapter',null,null,'bid='.$_REQUEST['id']);
							break;
						default:
							$this -> arr["sc"] = 400;
							break;
						
					}
					$this -> arr["way"] = $_REQUEST['way'];
				}
				else{
					$this -> arr["sc"] = 200;
				}
				
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}

	}
	
	$rs = new rss("GET",array("username","token","func","time"));
	
	
?>