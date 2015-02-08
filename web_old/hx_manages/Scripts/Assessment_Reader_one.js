

var temp_test ={};
var  result = "";
var stu_infos = [];
var sorces_objsTemp = 0;
 
var UserInfo = {};
var centerAll = {};
var zong_pi = "";
var sEa = "";
$().ready(function () {
   stu_infos = [];
   UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
   centerAll = $.evalJSON($.cookie("centerAll")); //取得登录人信息
   
   
   
   var temp = getUrlParam('temp_test');
   sEa = getUrlParam('SEa');
   
    
   
   if(temp!=""&&temp!=undefined&&temp!=null){
	    
		temp_test = $.parseJSON(Base64.decode(temp));
		if(temp_test.type_url!=1){
		   if(sEa==1){
			 window.parent.tree_select('查看批阅');
		   }else{
			 window.parent.tree_select('测评批阅');  
		   }
		}else{
			$('.newstitle').html('&nbsp;>>&nbsp;入学测评&nbsp;>>&nbsp;查看批阅');	
		}
		test_Checks(temp_test);//试卷批改 assign_id:派送id
 		 
   }

});//.ready的结束标签


//试卷批改 assign_id:派送id  type  =2  已提交  3 是已批改
function test_Checks(tt){
	var url_type = "/assign";
	var Qjsons = {'action':'students_marking_paper','class_id':tt.class_id,'assign_id':tt.assign_id,'exam_id':tt.exam_id,'type':3};
	if(temp_test.type_url==1){
		Qjsons = {'action':'students_marking_paper','assign_id':tt.assign_id,'exam_id':tt.exam_id,'type':3};
	}
	if(sEa==1){
	 
	  var user_idMs = getUrlParam('user_id');
	  Qjsons['user_id'] = user_idMs;
   }
	result = Ajax_Question(url_type,Qjsons);
	var resttemps = {'list':[]};
	  
	if(result.list!=null&&result.list!=""){
		stu_names();//遍历出来学生
		stu_values(0);//给学生赋值 并且初始化
		
	}else{
		$.messager.alert('温馨提示','没有批改过的试卷,退出查看批阅吗？','warning',function(){
			window.location = 'GradingPaper.html';	
		});	
	}
}

//遍历出来学生
function stu_names(){
	if(result.list!=""&&result.list!=null){
		
			$.each(result.list,function(i,n){
				var stu_info = {'list_num':'list序列号','realname':'学生名字','user_id':'学生id','log_time':'做题时间','subject_id':'科目id','grade_id':'学生年级id','examSource_num':'试题总数'};
				stu_info['list_num'] = i;
				stu_info['id'] = n.student_exercise_id;
				stu_info['realname'] = n.realname;
				stu_info['user_id'] = n.user_id;
				stu_info['log_time'] = n.log_time;
				stu_info['subject_id'] = n.subject_id;
				stu_info['pi'] = n.pi;
				stu_info['my_score'] = n.my_score;
				stu_info['grade_id'] = n.grade;
				stu_info['examSource_num'] = n.examSourceInfo.length;
				stu_infos.push(stu_info);
			});
		 
	}
	 
}

//给学生赋值 并且初始化
function stu_values(stunum){
	var stuhtmls = '';
	var testinfohtmls = '';
	var stuexeid = "";
	 //temp_user_id是从学生详细页面传递过来的值
	$.each(stu_infos,function(i,n){
		if(stunum==n.list_num){
			stuexeid = n.id ;
			stuhtmls += '<a href="javascript:void(0)" onclick="stu_values('+n.list_num+');" class="active" s_id = "'+n.user_id+'">'+n.realname+'</a>&nbsp;'; 
			
			testinfohtmls = '<span style="color:#00F; font-weight:bolder;">	学生详细信息&nbsp;</span>班级名称：<span id="classname" class="hx_color_ccc" >'+temp_test.classname+'</span>&nbsp;年级：<span id="gradename" class="hx_color_ccc">'+edu_grade_stu(parseInt(n.grade_id))+'</span>&nbsp;试卷名称：<span id="test_name" class="hx_color_ccc">'+temp_test.testname+'</span>&nbsp;学科：<span id="subjectname" class="hx_color_ccc">'+subject_sum(parseInt(n.subject_id))+'</span>&nbsp;批改时间：<span id="creat_time" class="hx_color_ccc">'+n.log_time+'</span>&nbsp;题目数量：<span id="creat_time" class="hx_color_ccc">'+n.examSource_num+'</span>&nbsp;得分：<span id="creat_time" class="hx_color_ccc">'+n.my_score+'分</span>&nbsp;';
			zong_pi = n.pi;
		}else{
			stuhtmls += '<a href="javascript:void(0)" onclick="stu_values('+n.list_num+');" s_id = "'+n.user_id+'">'+n.realname+'</a>&nbsp;';	
		}
	});
	 
	$('#classstus').html(stuhtmls);
	$('#stuinfo').html(testinfohtmls);
	//输出相应的试卷列表
	var listone = result.list[stunum];
	var student_exercise_content = $.parseJSON(Base64.decode(listone.student_exercise_content));
	var conditions = $.parseJSON(Base64.decode($.parseJSON(listone.conditions).queThree));
	var examSourceInfo = listone.examSourceInfo;
	var testhtmls = "";
	var sorces_obj = 0;
	 
	if(conditions!=""&&conditions!=null){
		$.each(conditions,function(i_1,n_1){
			 
			testhtmls += '<li><div class="hxQue_type">'+number_ch(parseInt(i_1)+1)+'、'+n_1.typename;
			if(temp_test.exam_type==1){
				testhtmls += '&nbsp;(每题：'+n_1.sorceP+'分&nbsp;共：'+n_1.sum+'题)';	
			}else{
				testhtmls += '&nbsp;(共：'+n_1.sum+'题)';	
			}
			testhtmls += '</div>';
			$.each(n_1.ids,function(i_2,n_2){
				var test_content = "";
				var obj_type = "";
				var answer = "";
				var obj_answer = "";
				var stu_answer = "";
				var objimages = "";
				var Que_flag = "";
				var stuAttachment = "";
				var detailed_pi = "";
				var obj_Judge = 0;
				$.each(examSourceInfo,function(i_3,n_3){
					if(n_2.id==n_3.gid&&n_2.dbtype==n_3.dbtype){
						  test_content = n_3.content;
						  obj_type = n_3.objective_flag;
						  obj_answer = n_3.answer;
						  if(n_3.objective_flag==0){
							  
						  }else{
							  answer = n_3.objective_answer;
							  if(answer.length>0){
								  var filerchar = ['组', '不'];
								  // 对答案进行过滤,组、
								  var lastchartemp = answer.substr(answer.length - 1, 1);
								  $.each(filerchar, function (it, nn)
								  {
									  if (nn == lastchartemp)
									  {
										  answer = answer.substr(0, answer.length - 1);
										  return false;
									  }
								  });
							  }
						  }
					 }
				});
				if(student_exercise_content!=""&&student_exercise_content!=null){
					$.each(student_exercise_content,function(i_4,n_4){
						if(n_2.id==n_4.id&&n_2.dbtype==n_4.dbtype){
							stu_answer = n_4.answer;
							stuAttachment = n_4.attachment;
							detailed_pi = n_4.pi;
							if(n_4.obj_Judge!=null&&n_4.obj_Judge!=""){
								obj_Judge = n_4.obj_Judge;
							}else{
								obj_Judge = 0;
							}
							
						}
					});
				}
				if(obj_type==1){
					if(stu_answer==answer){
						Que_flag = '<img src="../images/dui.png" width="20" height="20" />';
						if(temp_test.exam_type==1){
							if(n_1.sorceP!=null&&n_1.sorceP!=""){
								sorces_obj += parseInt(n_1.sorceP);
							}
						}
					}else{
						
						Que_flag = '<img src="../images/cha.png" width="20" height="20" />';
					}
					testhtmls += '<div class="hxQue_titleAn"><div class="hxQue_title"><strong>'+(i_2+1)+'</strong>、'+test_content+'</div><div class="hxQue_An">正确答案：'+answer+'</br>试题解析：</br>'+obj_answer+'</div><div class="hxStu_An">学生答案：'+stu_answer+'</div><div class="hxQue_check">系统判定：'+Que_flag+'</div><div class="ping_sub"><div style="float:left; width:70px;">每题评语：</div><div style="float:left; width:85%;">'+detailed_pi+'</div><div style="clear:both"></div></div></div>';
					
				}else{
					
					testhtmls += '<div class="hxQue_titleAn"><div class="hxQue_title"><strong>'+(i_2+1)+'</strong>、'+test_content+'</div><div class="hxQue_An">试题解析：</br>'+obj_answer+'</div><div class="hxStu_An">学生答案：'+stu_answer+'</div>';
					if(stuAttachment!=""&&stuAttachment!=undefined){
						  //alert(attement_temp);
					  	  testhtmls += '<div class="hxStu_An">学生附件：';
						  var attement_temp_P = stuAttachment.split(',');//上传图片从答题卡回调
						   
						  for(m=0;m<attement_temp_P.length;m++){
							   
							  testhtmls += '('+(m+1)+')、<a href="../../student/hx_20@13_paid_pic/hx_@images/'+attement_temp_P[m]+'" target="_blank">'+attement_temp_P[m]+'</a>&nbsp;&nbsp;';
						  }
						  testhtmls += '</div>';
					  
					  }else{testhtmls += '';}
					
					testhtmls += '<div class="hxQue_check">教师判定：';
					 
					if(temp_test.exam_type==1){
						if(n_1.sorceP!=null&&n_1.sorceP!=""){
							if(parseInt(obj_Judge) == parseInt(n_1.sorceP)){
								testhtmls += '<img src="../images/dui.png" width="20" height="20" />';
							}else if(parseInt(obj_Judge) < parseInt(n_1.sorceP)){
								testhtmls += '<img src="../images/bandui.png" width="20" height="20" />';
							}else if(obj_Judge==0||obj_Judge==null){
								testhtmls += '<img src="../images/cha.png" width="20" height="20" />';	
							}
						}
						
					}else{
						if(obj_Judge==1){
							testhtmls += '<img src="../images/dui.png" width="20" height="20" />';
						}else if(obj_Judge==2){
							testhtmls += '<img src="../images/bandui.png" width="20" height="20" />';
						}else if(obj_Judge==3){
							testhtmls += '<img src="../images/cha.png" width="20" height="20" />';	
						}
						
					}
					testhtmls += '</div><div class="ping_sub">';
					if(detailed_pi!=""&&detailed_pi!=null){
						testhtmls += '<div style="float:left; width:70px;">每题评语：</div><div style="float:left; width:85%;">'+detailed_pi+'</div><div style="clear:both"></div>';
					}
					
					testhtmls += '</div></div>';
				}
			});
			testhtmls += '</li>';
		});
		  
		$('#test_Ques').html(testhtmls);
 		$('#zong_pi').html(zong_pi);
	}
	 
}

