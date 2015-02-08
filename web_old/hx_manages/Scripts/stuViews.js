  
var data_test = {};

var UserInfo = null;
var centerAll = null;
$().ready(function (){
  	UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
	centerAll = $.evalJSON($.cookie("centerAll")); //取得登录人信息
	
	window.parent.tree_select('测评批阅');
 	data_test = $.evalJSON(Base64.decode(getUrlParam("temp_test")));
	 
 	setTestValues(data_test);
    $('.ci-icon').click(function(){ 
		if($(this).parent('div').next().css('display')=='block'){
			$(this).attr('class','ci-icon circlesmall-minus');
			$(this).parent('div').next().hide();
		}else{
			$(this).attr('class','ci-icon circlesmall-plus'); 
			$(this).parent('div').next().show();
		}
	});


});                        //reday的结束标签

 


/*{"name":"测试","exer_type":"1","grade_id":"11","subject_id":"3","field":"1","tmod":"1","creat_date":"2013-06-28","id":"10","status":"0","content":"fjj10003875,fjj10003876,fjj10003877,fjj10003878","conditions":"{\"data_test\":{\"testname\":\"u6d4bu8bd5\",\"testtype\":\"1\",\"subject_id\":\"3\",\"section_id\":\"18\",\"grade_id\":\"11\",\"tiku_type\":\"1\",\"tab_Sid\":\"1\",\"booktype\":\"5\",\"publisher\":\"90\",\"chapter\":[\"2630\",\"2631\"]},\"paper_num\":[{\"1\":\"1\"},{\"2\":\"2\"}]}"}*/
 
function setTestValues(data){
	var url_temp = '/test/list/list_detail';
	var paperjson = {'study_exercise_id':data.study_exercise_id,'center_id':data.center_id};
	var temp  = Ajax_Question(url_temp,paperjson);
	var conditions = $.parseJSON(data.conditions);
	var htmls = "";
	 
	if(temp.list!=null&&temp.list!=""){
		var question = temp.list;//试卷试题
		var StuExerciseAnsInfo = $.evalJSON(Base64.decode(temp.study_exercise.content)); //学生做的答案   
		var orderQues = $.evalJSON((Base64.decode($.evalJSON((temp.exam_exercise.activities)).queThree))); //题目排序
		
		$.each(orderQues,function(i_1,n_1){
				
				if(data.exam_type==1){
					htmls += '<li><div class="hxQue_type"><span class="ci-icon circlesmall-plus" style="float:right;">&nbsp;</span><span style="float:left;">'+number_ch(parseInt(i_1)+1)+'、'+decodeURIComponent(n_1.typename)+'．（每题'+n_1.sorceP+'分，'+n_1.sum+'题，共'+parseInt(n_1.sorceP)*parseInt(n_1.sum)+'分）</span><div style="clear:both;"></div></div><div>';	
				}else{
					htmls += '<li><div class="hxQue_type"><span class="ci-icon circlesmall-plus" style="float:right;">&nbsp;</span><span style="float:left;">'+number_ch(parseInt(i_1)+1)+'、'+decodeURIComponent(n_1.typename)+'．（共'+parseInt(n_1.sum)+'题）</span><div style="clear:both;"></div></div><div>';
				}
				
				if(n_1.ids!=""&&n_1.ids!=null){
					$.each(n_1.ids,function(i_2,n_2){
						var Exanswer = ""; 
						var XExanswer = ""; 
						var stuAnser = "";
						var ExContent = "";
						var stuAttachment = "";
						var obj_flag = "";
						var sorce = n_1.sorceP;
						var pings = "";
						if(n_2!=""&&n_2!=null){
							$.each(question,function(i_3,n_3){
								if(n_2.id==n_3.gid&&n_2.dbtype==n_3.dbtype){
									ExContent = n_3.content;
									obj_flag = n_3.objective_flag;
									Exanswer = n_3.answer;	
									if(n_3.objective_flag==0){
										
									}else{ 
										XExanswer = n_3.objective_answer;
										if(XExanswer.length>0){
											var filerchar = ['组', '不'];
											// 对答案进行过滤,组、
											var lastchartemp = XExanswer.substr(XExanswer.length - 1, 1);
											$.each(filerchar, function (it, nn)
											{
												if (nn == lastchartemp)
												{
													XExanswer = XExanswer.substr(0, XExanswer.length - 1);
													return false;
												}
											});
										}
									}
								}
							});
							$.each(StuExerciseAnsInfo,function(i_4,n_4){
								 
								if(n_2.id==n_4.id&&n_2.dbtype==n_4.dbtype){
									stuAnser = n_4.answer;
									 
									stuAttachment = n_4.attachment;
									pings = n_4.pi;
								}
							});
							htmls += '<div class="hxQue_titleAn"><div class="hxQue_title">'+(i_2 + 1)+'.'+ExContent+'</div><div class="hxQue_stu">';
							if(obj_flag==1){ 
								if(stuAnser==XExanswer){	
						  		htmls += '<div ><span class="text_008"><img  src="../images/ok.png"/></span><span class="text_006">你的答案：' + stuAnser+' </span><br /><span class="text_008"><img  src="../images/ok.png"/></span><span class="text_007">正确答案：<span >' + XExanswer + '</span></span></div>';
								}else{
									htmls += '<div><span class="text_008"><img  src="../images/wrong.png"/></span><span class="text_006">你的答案：' + stuAnser+' </span><br /><span class="text_008"><img  src="../images/ok.png"/></span><span class="text_007">正确答案：<span >' + XExanswer + '</span></span></div>';
								}
							}else{
								htmls += '<div><span class="text_008"></span><span class="text_006">你的答案：' + stuAnser+' </span></div>';
							}
							 
						    
							//附件判定
							if(stuAttachment!=""&&stuAttachment!=undefined){
								//alert(attement_temp);
							htmls += '<div><span class="text_008" ><img  src="../images/txt.png" width="16" height="16"/></span><span class="text_006">你的附件：';
								var attement_temp_P = stuAttachment.split(',');//上传图片从答题卡回调
								 
								for(m=0;m<attement_temp_P.length;m++){
									 
									htmls += '('+(m+1)+')、<a href="../../student/hx_20@13_paid_pic/hx_@images/'+attement_temp_P[m]+'" target="_blank">'+attement_temp_P[m]+'</a>&nbsp;&nbsp;';
								}
								htmls += '</span></div>';	
							
							}else{htmls += '';}
							if(pings!=""&&pings!=null){
								htmls += '<div>每题评语：'+pings+'</div></div>';	
							}
						    htmls += '<div class="hxQue_An">答案解析：<br />'+Exanswer+'</div></div></div>';
						 
						}
						
						
					});
				}
				htmls += '</div></li>';
				
			});
		 
		$('#zpings').html(temp.study_exercise.pi);
		var activitiesJSON = $.parseJSON(temp.exam_exercise.activities);
		var activities = activitiesJSON.data_test;
		
		var test_htmls = '<li class="hx_Schooltop_nbsp">&nbsp;</li><li class="text_float text_lineH30">&nbsp;班级名字：<span class="hx_text001">'+data.classname+'</span></li><li class="text_float text_lineH30">&nbsp;年级：<span class="hx_text001">'+edu_grade(parseInt(activities.grade_id))+'</span></li><li class="text_float text_lineH30">试卷名称：<span class="hx_text001">'+data.testname+'</span></li><li class="text_float text_lineH30">&nbsp;当前学科：<span class="hx_text001">'+subject_sum(parseInt(data.subject_id))+'</span></li><li class="text_float text_lineH30">&nbsp;提交时间：<span class="hx_text001">'+temp.study_exercise.log_time+'</span></li>';
		if(data.exam_type==1){
			test_htmls += '<li class="text_float text_lineH30">&nbsp;得分(总分)：<span class="hx_text001">'+data.score+'('+activitiesJSON.score+') 分</span></li>';
		}
		$('#test_header').html(test_htmls);
		$('#test_list').html(htmls);
	}
	
	
}
 


function lastStep(){
	 
	 document.location.href = "TestName.html?data_test="+ Base64.encode(JSON.stringify(data_test));
}
