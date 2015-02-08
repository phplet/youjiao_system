

var temp_test ={};
var  result = "";
var stu_infos = [];
var sorces_objsTemp = 0;
var temp_user_id = "";
var UserInfo = {};
var centerAll = {};
$().ready(function () {
   stu_infos = [];
   UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
   centerAll = $.evalJSON($.cookie("centerAll")); //取得登录人信息
  
   
   var temp = getUrlParam('temp_test');
   
   temp_user_id = getUrlParam('user_id');
   
   if(temp!=""&&temp!=undefined&&temp!=null){
	    
		temp_test = $.parseJSON(Base64.decode(temp));
		if(temp_test.type_url!=1){
			window.parent.tree_select('测评批阅');
		}else{
			$('.newstitle').html('&nbsp;>>&nbsp;入学测评&nbsp;>>&nbsp;入学试卷批阅');	
		}
		test_Checks(temp_test);//试卷批改 assign_id:派送id
 		 
   }
   
   $('.ping_sub').hide();
   $('#ping_type_1').click(function(){
		  $('.ping_sub').hide(); 
		  $(this).attr("class","active");
		  $('#ping_type_2').attr("class","");
   });
   $('#ping_type_2').click(function(){
		  $('.ping_sub').show(); 
		  $(this).attr("class","active");
		  $('#ping_type_1').attr("class","");
   });
 

});//.ready的结束标签


//试卷批改 assign_id:派送id  type  =2  已提交  3 是已批改
function test_Checks(tt){
	var url_type = "/assign";
	var Qjsons = {'action':'students_marking_paper','class_id':tt.class_id,'assign_id':tt.assign_id,'exam_id':tt.exam_id,'type':2};
	if(temp_test.type_url==1){
		Qjsons = {'action':'students_marking_paper','assign_id':tt.assign_id,'exam_id':tt.exam_id,'type':2};	
	}
	result = Ajax_Question(url_type,Qjsons);
	var resttemps = {'list':[]};
	if(temp_user_id!=null&&temp_user_id!=""){
		$.each(result.list,function(i,n){
			if(temp_user_id==n.user_id){
				resttemps['list'].push(n);
			}
			
		});
		result = resttemps;
	}
	 
	if(result.list!=null&&result.list!=""){
		stu_names();//遍历出来学生
		stu_values(0);//给学生赋值 并且初始化
		
	}else{
		$.messager.alert('温馨提示','没有批改的试卷,退出批改试卷吗？','warning',function(){
			if(temp_test.type_url!=1){
				window.location = 'GradingPaper.html';	
			}else{
				window.location = '../admission/GroupRollCenter.html';		
			}
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
	if(temp_user_id!=null&&temp_user_id!=""){
		 
		$.each(stu_infos,function(i,n){
			 
			if(temp_user_id==n.user_id){
				 
				stuexeid = n.id ;
				//stunum = i;
				stuhtmls += '<a href="javascript:void(0)" onclick="stu_values('+n.list_num+');" class="active" s_id = "'+n.user_id+'">'+n.realname+'</a>&nbsp;'; 
				
				testinfohtmls = '<span style="color:#00F; font-weight:bolder;">	学生详细信息&nbsp;</span>班级名称：<span id="classname" class="hx_color_ccc" >'+temp_test.classname+'</span>&nbsp;年级：<span id="gradename" class="hx_color_ccc">'+edu_grade_stu(parseInt(n.grade_id))+'</span>&nbsp;试卷名称：<span id="test_name" class="hx_color_ccc">'+temp_test.testname+'</span>&nbsp;学科：<span id="subjectname" class="hx_color_ccc">'+subject_sum(parseInt(n.subject_id))+'</span>&nbsp;提交时间：<span id="creat_time" class="hx_color_ccc">'+n.log_time+'</span>&nbsp;题目数量：<span id="creat_time" class="hx_color_ccc">'+n.examSource_num+'</span>&nbsp;';
				
			}else{
				//stuhtmls += '<a href="javascript:void(0)" onclick="stu_values('+n.list_num+');" s_id = "'+n.user_id+'">'+n.realname+'</a>&nbsp;';	
			}
		});
	}else{
		$.each(stu_infos,function(i,n){
			if(stunum==n.list_num){
				stuexeid = n.id ;
				stuhtmls += '<a href="javascript:void(0)" onclick="stu_values('+n.list_num+');" class="active" s_id = "'+n.user_id+'">'+n.realname+'</a>&nbsp;'; 
				
				testinfohtmls = '<span style="color:#00F; font-weight:bolder;">	学生详细信息&nbsp;</span>班级名称：<span id="classname" class="hx_color_ccc" >'+temp_test.classname+'</span>&nbsp;年级：<span id="gradename" class="hx_color_ccc">'+edu_grade_stu(parseInt(n.grade_id))+'</span>&nbsp;试卷名称：<span id="test_name" class="hx_color_ccc">'+temp_test.testname+'</span>&nbsp;学科：<span id="subjectname" class="hx_color_ccc">'+subject_sum(parseInt(n.subject_id))+'</span>&nbsp;提交时间：<span id="creat_time" class="hx_color_ccc">'+n.log_time+'</span>&nbsp;题目数量：<span id="creat_time" class="hx_color_ccc">'+n.examSource_num+'</span>&nbsp;';
				
			}else{
				stuhtmls += '<a href="javascript:void(0)" onclick="stu_values('+n.list_num+');" s_id = "'+n.user_id+'">'+n.realname+'</a>&nbsp;';	
			}
		});
	}
	 
	$('#classstus').html(stuhtmls);
	$('#stuinfo').html(testinfohtmls);
	//输出相应的试卷列表
	var listone = result.list[stunum];
	var student_exercise_content = $.parseJSON(Base64.decode(listone.student_exercise_content));
	var conditions = $.parseJSON(Base64.decode($.parseJSON(listone.conditions).queThree));
	var examSourceInfo = listone.examSourceInfo;
	var testhtmls = "";
	var sorces_obj = 0;
	var section_idT =  examSourceInfo[0].section_id;
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
						}
					});
				}
				if(obj_type==1){
					if(stu_answer==answer){
						Que_flag = '<img src="../images/dui.png" width="20" height="20" />';
						if(temp_test.exam_type==1){
							sorces_obj += parseInt(n_1.sorceP);
						}
					}else{
						
						Que_flag = '<img src="../images/cha.png" width="20" height="20" />';
					}
					testhtmls += '<div class="hxQue_titleAn"><div class="hxQue_title"><strong>'+(i_2+1)+'</strong>、'+test_content+'</div><div class="hxQue_An">正确答案：'+answer+'</br>试题解析：</br>'+obj_answer+'</div><div class="hxStu_An">学生答案：'+stu_answer+'</div><div class="hxQue_check">系统判定：'+Que_flag+'</div><div class="ping_sub"><div style="float:left; line-height:70px; width:70px;">每题评语：</div><div style="float:left; width:85%;"><textarea id="ping_content" style="width:99%;" cols="60" rows="3" name="'+n_2.id+'" dbtype="'+n_2.dbtype+'"></textarea></div><div style="clear:both"></div></div></div>';
					
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
						testhtmls += '<input type="text" name="teacher_active_ti" class="teacher_active_'+n_2.id+'" style="WIDTH: 60px;" value="0" scs="'+n_1.sorceP+'" dbtype="'+n_2.dbtype+'"  onkeyup="this.value=this.value.replace(/\\D/g,\'\')"  onafterpaste="this.value=this.value.replace(/\\D/g,\'\')" onblur="if(this.value>'+n_1.sorceP+'){alert(\'不能大于'+n_1.sorceP+'！\');this.value='+n_1.sorceP+';this.focus();sumScores();}else{sumScores();}" />&nbsp;分 [ 注：不能大于'+n_1.sorceP+' ]';
					}else{
						testhtmls += '<input type="radio" name="'+n_2.id+'" dbtype="'+n_2.dbtype+'" value="1" />对&nbsp;<input type="radio"  value="2" name="'+n_2.id+'" dbtype="'+n_2.dbtype+'" />半对&nbsp;<input type="radio" value="3" name="'+n_2.id+'" dbtype="'+n_2.dbtype+'" />错&nbsp;';
					}
					testhtmls += '</div><div class="ping_sub"><div style="float:left; line-height:70px; width:70px;">每题评语：</div><div style="float:left; width:85%;"><textarea id="ping_content" style="width:99%;" cols="60" rows="3" name="'+n_2.id+'" dbtype="'+n_2.dbtype+'"></textarea></div><div style="clear:both"></div></div></div>';
				}
			});
			testhtmls += '</li>';
		});
		  
		$('#test_Ques').html(testhtmls);
		sorces_objsTemp = sorces_obj;
		$('.ping_sub').hide();
		sumScores();//计算分数
	}
	$('#savevalue').unbind('click');
	$('#savevalue').bind('click',function(){
		
		saveTestPi(student_exercise_content,stuexeid,section_idT);
	});
	
	
}

//计算总分
function sumScores(){
	if(temp_test.exam_type==1){
		//sorces_objsTemp	;
		var temp_sc_active = 0;
		 
	 	$('input[name="teacher_active_ti"]').each(function(index, element) {
			$(element).attr("scs");
			$(element).attr("class");
            temp_sc_active += parseInt($(element).val());
        });
		var sts = parseInt(sorces_objsTemp)+parseInt(temp_sc_active);
		$('#amount').val(sts);
	}
	 
}




//保存批改
function saveTestPi(stuanswer_data,stu_exid,section_idST){
	var test_Pi = {};
	var flags = "";
	var flags_active = true;
	var test_wrong = [];
	if(temp_test.exam_type==1){
		//sumScores();
		$('input[name="teacher_active_ti"]').each(function(index, element) {
            if(parseInt($(element).val())==0||$(element).val()==""){
				flags_active = false;
				return false;
			}
    	});
	}
	$.each(stuanswer_data,function(i,n){  //obj =1 客观  0是主观
		 
		if(n.obj==1){
			stuanswer_data[i]['pi'] = $('textarea[name="'+n.id+'"]').val();	
			flags = true;
			 
		}else{
			var radioCheck = "";
			 
			if (temp_test.exam_type==1){ 
				radioCheck = $('.teacher_active_'+n.id).val();
				var scsT = $('.teacher_active_'+n.id).attr("scs");
				var dbtypeT_1 = $('.teacher_active_'+n.id).attr("dbtype");
				if(parseInt(radioCheck)!=parseInt(scsT)){
					test_wrong.push({'dbtype':dbtypeT_1,'ti_id':n.id,'subject_id':temp_test.subject_id,'section_id':section_idST});
				}
			}else{
				 
				radioCheck = $('input[name="'+n.id+'"]:checked').val();
				 
				var dbtypeT = $('input[name="'+n.id+'"]:checked').attr("dbtype");
				
				if(radioCheck!=1){
					test_wrong.push({'dbtype':dbtypeT,'ti_id':n.id,'subject_id':temp_test.subject_id,'section_id':section_idST});
				}
			}
		     
			if(radioCheck!='undefined'&&radioCheck!=""&&radioCheck!=null){
				stuanswer_data[i]['pi'] = $('textarea[name="'+n.id+'"]').val();
				stuanswer_data[i]['obj_Judge'] = radioCheck;	//作业存的是 1,2,3 对 ，半对， 错   测试存的是老师给的分数值可以为零 不可以为空
 				flags = true;
			}else{
				 flags = false;
				 return false;
			}
		}
 
	});	
	var myscore = $('#amount').val();
	var allPi = $('#ping_zong').val();
	 
	if(flags_active==false){
		
		$.messager.confirm('温馨提示','有主观题为零分！确认给主观题为零分吗？',function(bs){
			if(bs){
				if(flags==true&&$.trim(allPi)!=""&&$.trim(myscore)!=""){
					var url_types = "/assign";
					var Qjsonss = {'action':'add_marking_pi','student_exercise_id':stu_exid,'exam_type':temp_test.exam_type,'my_score':myscore,'pi':allPi,'content':Base64.encode(JSON.stringify(stuanswer_data)),'error_content':JSON.stringify(test_wrong),'bookcode':1,'subject_id':temp_test.subject_id,'exam_type':temp_test.exam_type,'exam_id':temp_test.exam_id,'class_id':temp_test.class_id,'student_user_id':$('#classstus a[class="active"]').attr("s_id"),'teacher_user_id':UserInfo.id,'assign_id':temp_test.assign_id,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
					 
					var re_test = Ajax_option(url_types,Qjsonss,"POST");
					if(temp_test.type_url!=1){
						$.messager.confirm('温馨提示','此测评成功!继续批阅吗？',function(b){
							if(b){
								window.location.reload();
							}else{
								window.location = 'GradingPaper.html';	
							}
						});
					}else{
						$.messager.alert('温馨提示','批改完成!','info');
						window.location = '../admission/GroupRollCenter.html';		
					}
				}else{
					$.messager.alert('温馨提示','请判定主观题/填写分数/总评,细平可以为空!','info');	
				}
			}else{
				return;	
				
			}
		});
	}else{
		if(flags==true&&$.trim(allPi)!=""&&$.trim(myscore)!=""){
			var url_types = "/assign";
			var Qjsonss = {'action':'add_marking_pi','student_exercise_id':stu_exid,'exam_type':temp_test.exam_type,'my_score':myscore,'pi':allPi,'content':Base64.encode(JSON.stringify(stuanswer_data)),'error_content':JSON.stringify(test_wrong),'bookcode':2,'subject_id':temp_test.subject_id,'exam_type':temp_test.exam_type,'exam_id':temp_test.exam_id,'class_id':temp_test.class_id,'student_user_id':$('#classstus a[class="active"]').attr("s_id"),'teacher_user_id':UserInfo.id,'assign_id':temp_test.assign_id,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()}; 
			var re_test = Ajax_option(url_types,Qjsonss,"POST");
			if(temp_test.type_url!=1){
				$.messager.confirm('温馨提示','此测评成功!继续批阅吗？',function(b){
					if(b){
						window.location.reload();
					}else{
						window.location = 'GradingPaper.html';	
					}
				});
		 	}else{
				$.messager.alert('温馨提示','批改完成!','info');	
				window.location = '../admission/GroupRollCenter.html';		
			}
		}else{
			$.messager.alert('温馨提示','请判定主观题/填写分数/总评,细平可以为空!','info');	
		}	
		
	}
	
	 
}







