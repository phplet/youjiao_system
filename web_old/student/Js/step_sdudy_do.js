var UserInfo = [];
var questions_list = [];
var hrefParams = {};  
var temp_que_overs = [];

var editor = [];
/*function getHrefParams(){
	var param = {};
	var _p=window.location.href.split('?')[1].split('&');
	for(var i in _p){
		var tmp = _p[i].split('=');
		param[tmp[0]] = tmp[1];
	}
	return param;
}*/

$(document).ready(function(){
	
	var newcreate_date = getNowDateSec();
	 
		UserInfo = $.evalJSON($.cookie("UserInfo"));
		if(UserInfo!=null&&UserInfo!=undefined){
			
			var nick =  UserInfo.nick;
				 
			if (UserInfo.realname != null&&UserInfo.realname!="") {
					$('#headusername').text(UserInfo.realname);
			}else if(nick!=null&&nick!=""){
					$('#headusername').text(nick);
			}
			var exerciseHandler = window.exerciseHandler;
			
			//var pageType = window.location.href.split('?')[0].split('/').pop().split('.')[0].split('_')[1];
			
			var currentQuestion = null;
			var test_info = getUrlParam('test_info');
			$('.question_content').show();
			$('#question_pager_RS').show();
			$('#question_overs').hide();
			$('#page_overs').hide(); 
			if(judgeNull(test_info)!=""){
				hrefParams = $.parseJSON(Base64.decode(test_info));
				 
				 if(hrefParams['Qbuttype'] == 'on_study'){
					$('.dj_obj_subject').show();
					$('#clhj_header').show();
					$('.dj_num_sub').html(step_D(hrefParams['q_difficulty']));
					$('#clhj_header').html('测练环节');
				 }else{
					$('.dj_obj_subject').hide();
					$('#clhj_header').hide();
					$('.dj_num_sub').html("");
				 
				 }
				 
				 var pager = new Pager();
			     
				 $('.test_subject').html(hrefParams.type_name);
				 $('.chapter_name').text(hrefParams.zhuanti_name);
			
				/*exerciseHandler.query('zhuanti_info' , {'zhuanti_id':hrefParams['zhuanti_id']} , function(flag , data){
					if(flag){
						$('.question_subject').text(data.zhuanti_info.subject_name);
						$('.question_zhuanti').text(data.zhuanti_info.name);
						 
					}else{
						layer.alert('加载专题信息失败！', 8,'温馨提示');
						 
					}
				});*/
				
				//监听换题
				exerciseHandler.endlessExercise.onChangeQuestion = function(question){
					$('.main_content_content').html(question.content);
					currentQuestion = question;
					
					//如果已经做过了，则显示上次的结果，不让重新答题
					$('.main_answer').hide();
						
					if(question.type_name =='选择题' || question.type_name == '判断题'){
						$('.main_option').show();
						$('.ke-container').hide();
						if(question.option_count>4){
							$('.option_e').show();
						}else{
							$('.option_e').hide();
						}
						 
						
						$('.option_btn:checked').attr('checked',false);
						if(currentQuestion.user_answer){
							$('.main_option input[name="option"][value="'+currentQuestion.user_answer+'"]').attr('checked',true);	
						}
						
					}else{
						$('.main_option').hide();
						$('.ke-container').show();
						
						$('.subjective_check:checked').attr('checked',false);
						
						 
						
					}
					$('.question_submit').show();
					$('#add_to_haoti').hide();
					$('.page_item_T').next().hide();
					$('.question_next').hide();
					 
				};
				
				exerciseHandler.endlessExercise.onSubmitAnswer = function(questionType , isRight){
					//$('.total_right').text(exerciseHandler.endlessExercise.rightNum);
					//$('.total_wrong').text(exerciseHandler.endlessExercise.wrongNum);
					
					if(questionType == 'objective'){
						if(isRight){
							$('.answer_correct').show();
							$('.answer_wrong').hide();
						}else{
							$('.answer_correct').hide();
							$('.answer_wrong').show();
						}
						
					}else{
						
					}
				}
				
				//开始
				exerciseHandler.endlessExercise.tongbu_begin('zhuanti_question',true,{
					'zhuanti_id':hrefParams['zhuanti_id'],
					'study_exercise_id':hrefParams['study_exercise_id'],
					'subject_id':hrefParams['subject_id'],
					'type' : hrefParams['q_type'],
					'difficulty' : hrefParams['q_difficulty'],
					'count' : hrefParams['q_count']
				}, function(flag,data){
					if(flag){
						
						var questionCount = exerciseHandler.endlessExercise.questionList.length;
						if(hrefParams['Qbuttype'] == 'on_study'&&hrefParams['study_exercise_id']!=0&&hrefParams['study_exercise_id']!=""){
							hrefParams['q_difficulty']= parseInt(exerciseHandler.endlessExercise.questionList[0].difficulty);
							$('.dj_num_sub').html(step_D(hrefParams['q_difficulty']));
						}
						$('.question_pager').append(pager.showHTML(questionCount, 0, 1 , questionCount));
						pager.addStyle(null , 'Js/pager/default.css');
						pager.bindEvent();
						
						if(hrefParams['study_exercise_id']!=0){
							if(exerciseHandler.endlessExercise.q_typeP!=null&&exerciseHandler.endlessExercise.q_typeP!=""){
								if(unique(exerciseHandler.endlessExercise.q_typeP).length>1){
									hrefParams['q_type'] = 0;
								}else{
									if(exerciseHandler.endlessExercise.questionList[0].type_name=='选择题'){
										hrefParams['q_type'] = 1;
									}else{
										hrefParams['q_type'] = 2;	
									}
									
								}
							}
							if(exerciseHandler.endlessExercise.q_difficultyP!=null&&exerciseHandler.endlessExercise.q_difficultyP!=""){
								if(unique(exerciseHandler.endlessExercise.q_difficultyP).length>1){
									hrefParams['q_difficulty'] = 0;
								}else{
									hrefParams['q_difficulty'] = exerciseHandler.endlessExercise.questionList[0].difficulty;
								}
							}
								
						}
						 
						//exerciseHandler.endlessExercise.q_typeP;
						//exerciseHandler.endlessExercise.q_difficultyP;
						$('.page_item_T a').attr("flags",0);
						hrefParams['q_count'] = questionCount;
						hrefParams['q_difficulty'] = exerciseHandler.endlessExercise.questionList[0].difficulty;
						hrefParams['q_type'] = 1;
						 
						pager.change(function(offset , step){
							
							exerciseHandler.endlessExercise.jump(offset);
							
							$('.pager_page').each(function(){
								var tmp = exerciseHandler.endlessExercise.questionList[parseInt($(this).attr('offset'))];
								if(tmp.user_answer){
									if(tmp.user_flag){
										$(this).addClass('finish_right');
										
									}else{
										$(this).addClass('finish_wrong');
										 
									}
									$(this).attr("flags",1);
								}else{
									$(this).attr("flags",0);	
								}
								
							});
							 
						});
						
						var ding_num = 0;
						var num_temp_Qs = 0;
						var ding_numf = 0;
						$.each(exerciseHandler.endlessExercise.questionList,function(qt_i,qt_n){
							   if(qt_n.user_answer!=undefined&&qt_n.user_answer!=""){
									questions_list.push(qt_n);
									ding_num = qt_i;
									
							   }else{
								   if(num_temp_Qs==0){
									    ding_numf = qt_i; 
								   }
								   num_temp_Qs++;
							   }
							   //num_temp_Qs = qt_i;
						}); 
						
						if(num_temp_Qs!=0){
							ding_num = ding_numf;	
						}
						 
						//$('.total_right').text(exerciseHandler.endlessExercise.rightNum);
						//$('.total_wrong').text(exerciseHandler.endlessExercise.wrongNum);
						$('.pager_page[offset='+ding_num+']').trigger("click");
						if(exerciseHandler.endlessExercise.questionList.length==(ding_num+1)){
							//$('.question_next').attr("value",'提交');	
						}
						
						exerciseHandler.examExercise.onTimer = function(show_time){
							$('.test_time').text(show_time);
						};	
						var sumtime = exerciseHandler.endlessExercise.startTime_some;
						if(isNaN(parseInt(sumtime))){
							exerciseHandler.examExercise.begin();
						}else{
							exerciseHandler.examExercise.begin(parseInt(sumtime));
						}
							
						$('.page_item_T').next().hide();	
						
					}else{
						
					}
				});
				
				
				//提交题目
				$('.question_submit').click(function(){
					 
					if(currentQuestion.type_name == '选择题' || currentQuestion.type_name == '判断题'){
						
						var answer = $('.option_btn:checked').val();
						 
			 			if(answer){
							exerciseHandler.endlessExercise.submitObjectiveAnswer(answer);
							var qis = 0;
							$.each(questions_list,function(i,n){
								if(currentQuestion.gid==n.gid){
									questions_list[i] = currentQuestion;
									qis++;
								}	
							});
							if(qis==0){
								questions_list.push(currentQuestion);
							}
							
						}
						 
					}
					if($('.page_item_T a[flags="0"]').length==1||$('.page_item_T a[flags="0"]').length==0){
						layer.confirm('你的试题已经做完,是否交卷?',function(){
							$('#save_test').trigger('click');
						},'温馨提示');
						
					}else{
						 $('.pager_next').click();
						 $('.pager_page[offset='+$('.page_item_T a[flags="0"]').eq(0).attr('offset')+']').trigger("click"); 
						  
					} 
					//$('.pager_current').attr('flags','1');
					
				});
				
				
				//暂停
				$('#temp_pause').click(function(){
					if($(this).text()=='暂停'){
						exerciseHandler.examExercise.end();
						$(this).text('继续');
						var iq = layer.alert('想歇会再做了！',9,'温馨提示',function(){
							exerciseHandler.examExercise.pause();
							$('#temp_pause').text('暂停');	
							layer.close(iq);
						});
						$('.xubox_yes').text('继续');
						$('.xubox_close').hide();
					}
				});
				
				
				//提交试卷
				$('#save_test').click(function(){
					 	
						if($('#save_test').text()=='交卷'&&questions_list!=""){
							/*  content:  {"answer":"C","id":"erj10005231","obj":1,"score":3}*/
								exerciseHandler.examExercise.end();
								 
								var active_nums = 0;  //客观题  1
								var active_right = 0;  //客观题答对  1 
								var question_idsT = [];
								var content_temps = [];
								
								$.each(exerciseHandler.endlessExercise.questionList, function(q_i,q_n){
									active_nums++;
									var content_one = {
											answer : "",
											id : q_n.gid,
											obj : q_n.objective_flag,
											score : 0,
											dbtype : q_n.dbtype,
											flag:false
									};
									 
									if((questions_list.length>0)){
										 
										$.each(questions_list,function(c_i,c_n){
											if(c_n.gid==q_n.gid){
												content_one = {
													answer : c_n.user_answer,
													id : c_n.gid,
													obj : c_n.objective_flag,
													score : c_n.score,
													dbtype : c_n.dbtype,
													flag:c_n.user_flag
												};
												if(c_n.user_flag==true){
													active_right++;
												}
												
											}
											
										});
										 
									}
									content_temps.push(content_one);
									question_idsT.push(q_n.gid);
								});
								
								var examResult = {}; 
								examResult.dbtype = questions_list[0].dbtype?questions_list[0].dbtype:1;
								examResult.content = content_temps;
								examResult.my_score = parseFloat((active_right/active_nums)*100).toFixed(2);
								examResult.correct_rate = parseFloat((active_right/active_nums)).toFixed(2);
								examResult.section_id = hrefParams['section_id'];
								examResult.type = 2;        //2已提交   试卷状态   1.正在做
								
								if(hrefParams['Qbuttype'] == 'on_study'){
									examResult.exam_type = 7;
								}else{
									examResult.exam_type = 9;  //  1.作业/测试 2. 专题  3. 真题 4.名校 5 同步 7 学生等级  9 测评等级 	
								}
								
								examResult.exercise_id = hrefParams['zhuanti_id'];
								examResult.log_time = newcreate_date;
								examResult.subject_id = hrefParams['subject_id'];  // 
								examResult.exam_content = question_idsT;  //ids  题目
								examResult.duration = exerciseHandler.examExercise.use_time;
								examResult.difficulty = hrefParams['q_difficulty'];
								if(hrefParams['Qbuttype'] == 'on_study'){
									if(hrefParams['test_level']==0){
										examResult.level = hrefParams['q_difficulty'];
									}else{
										examResult.level = hrefParams['test_level'];	
										
									}
								}else{
									examResult.level = step_Q(ping_D(parseFloat((active_right/active_nums)*100).toFixed(2)));
								}
								if(hrefParams['study_exercise_id']!=0&&hrefParams['study_exercise_id']!=undefined){
									examResult.study_exercise_id = hrefParams['study_exercise_id'];
								}
								 
								if(exerciseHandler.endlessExercise.questionList.length!=questions_list.length){
									var si = layer.confirm('你的试题没有做完,是否交卷?',function(){
										exerciseHandler.examExercise.uploadExamResult(JSON.stringify(examResult) , function(flag , data){
									
											if(flag==true&&data.flag==true){
												
												$('#save_test').text('已提交');
												//layer.alert('提交成功！', 9,'温馨提示');
												$('.content_center').hide();
												$('.link_sub').hide();
												$('.content_overTemp').show();
												$('#time_name').html(newcreate_date); 
												$('.difficty_name').html(difficty_nums(hrefParams['q_difficulty']));
												$('.que_sums').html(parseInt(active_nums));
												$('.right_active').html(parseInt(active_right));
												 
												if(hrefParams['Qbuttype'] == 'on_study'){
													$('#dj_dtk').hide();
													$('#dj_list').hide();
													$('#jiexi_list').show();
													//data.info.reason   up升级  down 降级  in  no保持    data.level   1,2,3,4,5
													$('#clhj_header_s').css("margin-top","0px;");
													if(data.info.reason=='up'&&data.info.level==5){
														$('#clhj_header_s').css("margin-top","-50px;");
														$('#clhj_header_s').html('<img src="images/up_5.png" />');
														$('.dj_num_sub').html('<img src="images/dj_0'+data.info.level+'.png" />');
													}else if(data.info.reason=='down'){
														$('#clhj_header_s').html('<img src="images/down.png" /><span class="down_dj"><img src="images/dj_0'+data.info.level+'.png" /></span>');
														$('.dj_num_sub').html('<img src="images/dj_0'+data.info.level+'.png" />');
													}else if(data.info.reason=='up'&&data.info.level!=5){
														$('#clhj_header_s').html('<img src="images/up.png" /><span class="up_dj"><img src="images/dj_0'+data.info.level+'.png" /></span>');
														$('.dj_num_sub').html('<img src="images/dj_0'+data.info.level+'.png" />');
													}else{
														$('#clhj_header_s').html('<img src="images/no.png" /><span class="no_dj"><img src="images/dj_0'+data.info.level+'.png" /></span>');
														$('.dj_num_sub').html('<img src="images/dj_0'+data.info.level+'.png" />');
													}
												    
												}else{
													
													$('#jiexi_list').hide();
													$('#dj_dtk').show();
													$('#dj_list').show();
													
													$('.ping_dj').html(ping_D(examResult.my_score));
												 
													$('.study_dj').html('<img src="images/dj_0'+step_Q(ping_D(examResult.my_score))+'.png" />');
													
													if(hrefParams['sum_count']==0){
														var qit = 5-parseInt(step_Q(ping_D(examResult.my_score)));
														$('#dj_list span').eq(qit).attr("class","dj_active"); 
													}else{
														$('#dj_list').hide();	
													}
												}
												
											 
											}else{
												layer.alert('保存失败，请稍后再试！', 8,'温馨提示');
												 
											}
											
										}); 
									},'温馨提示',function(){
										layer.close(si);
										exerciseHandler.examExercise.pause();
									});
								}else{
									exerciseHandler.examExercise.uploadExamResult(JSON.stringify(examResult) , function(flag , data){
									
									if(flag==true&&data.flag==true){
										 
										$('#save_test').text('已提交');
										//layer.alert('提交成功！', 9,'温馨提示');
										$('.content_center').hide();
										$('.link_sub').hide();
										$('.content_overTemp').show();
										$('#time_name').html(newcreate_date); 
										$('.difficty_name').html(difficty_nums(hrefParams['q_difficulty']));
										$('.que_sums').html(parseInt(active_nums));
										$('.right_active').html(parseInt(active_right));
										if(hrefParams['Qbuttype'] == 'on_study'){
											  $('#dj_dtk').hide();
											  $('#dj_list').hide();
											  $('#jiexi_list').show();
											  $('#clhj_header_s').css("margin-top","0px;");
											  if(data.info.reason=='up'&&data.info.level==5){
												  $('#clhj_header_s').css("margin-top","-50px;");
												  $('#clhj_header_s').html('<img src="images/up_5.png" />');
												  $('.dj_num_sub').html('<img src="images/dj_0'+data.info.level+'.png" />');
											  }else if(data.info.reason=='down'){
												  $('#clhj_header_s').html('<img src="images/down.png" /><span class="down_dj"><img src="images/dj_0'+data.info.level+'.png" /></span>');
											  	  $('.dj_num_sub').html('<img src="images/dj_0'+data.info.level+'.png" />');
											  }else if(data.info.reason=='up'&&data.info.level!=5){
												  
												  $('#clhj_header_s').html('<img src="images/up.png" /><span class="up_dj"><img src="images/dj_0'+data.info.level+'.png" /></span>');
											 	  $('.dj_num_sub').html('<img src="images/dj_0'+data.info.level+'.png" />');
											  }else{
												  $('#clhj_header_s').html('<img src="images/no.png" /><span class="no_dj"><img src="images/dj_0'+data.info.level+'.png" /></span>');
											  	  $('.dj_num_sub').html('<img src="images/dj_0'+data.info.level+'.png" />');
											  }
										   
										  }else{
											  
											  $('#jiexi_list').hide();
											  $('#dj_dtk').show();
											  $('#dj_list').show();
											  
											  $('.ping_dj').html(ping_D(examResult.my_score));
										   
											  $('.study_dj').html('<img src="images/dj_0'+step_Q(ping_D(examResult.my_score))+'.png" />');
											  if(hrefParams['sum_count']==0){
												  var qit = 5-parseInt(step_Q(ping_D(examResult.my_score)));
											  	  $('#dj_list span').eq(qit).attr("class","dj_active");  
											  }else{
												  $('#dj_list').hide();	
											  }
											  
										  } 
									 
									}else{
										layer.alert('保存失败，请稍后再试！', 8,'温馨提示');
										 
									}
									
								});	
								}
								
								
								
								
						}else if($('#save_test').text()=='已提交'){
							layer.alert('你已经提交,不可以多次提交！', 8,'温馨提示');
							return;
						}else{
							layer.alert('你没有做题！', 8,'温馨提示');
							return;	
						}
						 
				});
				
				//临时保存
				$('#temp_Save').click(function(){
					 
					if(questions_list!=""){
					 	exerciseHandler.examExercise.end();
						var checkpass = true;
						var tempsResults = {};
						 
						 
						var question_idsT = [];
						var content_temps = [];
						
						$.each(exerciseHandler.endlessExercise.questionList, function(q_i,q_n){
							 
							var content_one = {
									answer : "",
									id : q_n.gid,
									obj : q_n.objective_flag,
									score : 0,
									dbtype : q_n.dbtype,
									flag:false
							};
							 
							if((questions_list.length>0)){
								 
								$.each(questions_list,function(c_i,c_n){
									if(c_n.gid==q_n.gid){
										content_one = {
											answer : c_n.user_answer,
											id : c_n.gid,
											obj : c_n.objective_flag,
											score : c_n.score,
											dbtype : c_n.dbtype,
											flag:c_n.user_flag
										};
										 
									}
									
								});
								 
							}
							content_temps.push(content_one);
							question_idsT.push(q_n.gid);
						});
						//{"book_id":"1","subject_id":1,"grade_id":"10","parent_id":"1","parent_name":"第一单元","chapter_id":"1","chapter_name":"1毛泽东词二首"}
						tempsResults.content = content_temps;
						//tempsResult.my_score = score;
						tempsResults.dbtype = questions_list[0].dbtype?questions_list[0].dbtype:1;
						tempsResults.type = 4;        //2已提交   试卷状态  4.正在做  3已批阅 1 新作业
						if(hrefParams['Qbuttype'] == 'on_study'){
							tempsResults.exam_type = 7;
						}else{
							tempsResults.exam_type = 9;  //  1.作业/测试 2. 专题  3. 真题 4.名校 5 同步 7 学生等级  9 测评等级 	
						}
						 
						tempsResults.position = $('.tn-selected').text();  //最后定位到第几题
						tempsResults.section_id = hrefParams['section_id'];   //学段
						tempsResults.grade_id = UserInfo.grade_id;      //年级
						tempsResults.subject_id = hrefParams['subject_id'];  //学科
						tempsResults.exercise_id = hrefParams['zhuanti_id'];  //id
						tempsResults.difficulty = hrefParams['q_difficulty'];
						tempsResults.level = hrefParams['q_difficulty'];
						tempsResults.exam_content = question_idsT;  //ids  题目
				        tempsResults.duration = exerciseHandler.examExercise.use_time; 
						tempsResults.log_time = newcreate_date;
						//tempsResults.log_time = newcreate_date;
						if(hrefParams['study_exercise_id']!=0&&hrefParams['study_exercise_id']!=undefined){
							tempsResults.study_exercise_id = hrefParams['study_exercise_id'];
						}
						exerciseHandler.examExercise.uploadExamResult_act('saveHistory',JSON.stringify(tempsResults) , function(flag , data){
							
							if(flag){
								layer.alert('临时保存成功！',9,'温馨提示',function(){
									window.location.href = 'step_sdudy.html';
								});
								$('.xubox_close').hide();
								 
							}else{
								layer.alert('保存失败，请稍后再试！', 8,'温馨提示'); 
							}
							
						});	
						
					}else{
						layer.alert('没有做题，不能临时保存!',9,'温馨提示');
					}
				});
				
				
				$('#temp_remove').click(function(){
					exerciseHandler.endlessExercise.tongbu_begin('zhuanti_question',false,{'zhuanti_id':hrefParams['zhuanti_id'],
					'subject_id':hrefParams['subject_id'],'type' : hrefParams['q_type'],'difficulty' : hrefParams['q_difficulty'],
					'count' : hrefParams['q_count']}, function(flag,data){
						if(flag){
							//$('.total_right').text(exerciseHandler.endlessExercise.rightNum);
							//$('.total_wrong').text(exerciseHandler.endlessExercise.wrongNum);
							var questionCount = exerciseHandler.endlessExercise.questionList.length;
							$('.question_pager').html(pager.showHTML(questionCount,0, 1 , questionCount));
							pager.bindEvent();
							$('.page_item_T a').attr("flags",0);
							questions_list = [];
							//exerciseHandler.examExercise.begin();
							//exerciseHandler.examExercise.onTimer = function(show_time){
								//$('.test_time').text(show_time);
							//};	
							//$('.question_next').attr('value','下一题');
							 
							exerciseHandler.examExercise.start_time=new Date().getTime();
							 
							$('.page_item_T').next().hide();	
						}
					 
					});
						
				});
				
				$('#add_to_haoti').click(function(){
					
					sel_goods(2,$('.my_answer').attr('temp_ti_id'),hrefParams['subject_id'],2,$('.my_answer').attr('dbtype'),hrefParams['section_id']);
				});
				
				$('.subjective_check_btn').click(function(){
					if($('.subjective_check:checked').length == 0){
						layer.alert('请进行选择！', 8,'温馨提示');
						 
						return;
					}
					var flag = parseInt($('.subjective_check:checked').val());
					exerciseHandler.endlessExercise.submitSubjectiveAnswer(flag , "");
					if(flag){
						$('.main_answer').find('.answer_correct').show();
					}else{
						$('.main_answer').find('.answer_wrong').show();
					}
					$('.float_div , .cover_div').hide();
				});
				
				$('.exit').click(function(){
					exerciseHandler.endlessExercise.end({subject_id : hrefParams['subject_id']},function(flag , data){
						if(flag){
							window.location.href = 'exercise_zhuanti.html';
						}else{
							layer.alert('退出失败，请稍后再试！', 8,'温馨提示');
							 
						}
					});
				});
				$('.home').click(function(){
					 window.location = 'Index.html';
				});
				
				
				
				$('#jiexi_list_a').click(function(){
					
					$('.content_center').show();
					$('.contu_study').show();
					//console.log(JSON.stringify(exerciseHandler.endlessExercise.questionList));
					//question_content  question_pager_RS  question_overs  page_overs
					temp_que_overs = exerciseHandler.endlessExercise.questionList;
					$('#clhj_header').html("测试结果");
					$('.question_content').hide();
					$('.content_overTemp').hide();
					$('#question_pager_RS').hide();
					$('#question_overs').show();
					$('#page_overs').show();
					var page_overs_list = '';
					$.each(temp_que_overs,function(ic,n_c){
						
						if(ic==0){
							if(n_c.user_flag){
								page_overs_list += '<a class="p_on" flags="1" onClick="change_tis('+ic+')">'+(ic+1)+'</a>&nbsp;'
							}else{
								page_overs_list += '<a class="p_on" flags="2" onClick="change_tis('+ic+')">'+(ic+1)+'</a>&nbsp;'
							}
							 
							var que_over_lists = '<div>'+n_c.content+'</div><div class="que_my_answers"><span class="que_my_answers_L">正确答案：'+n_c.objective_answer+' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你的答案：'+n_c.user_answer+'</span><span class="que_my_answers_R"><a href="javascript:void(0)" onclick="sel_goods(2,\''+n_c.gid+'\','+parseInt(n_c.subject_id)+',2,'+n_c.dbtype+','+n_c.section_id+')">收藏好题</a>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="jiexi_s(this)">收起解析</a></span><span class="cleard"></span></div><div class="que_my_answers_jx">解析：<br />'+n_c.answer+'</div>';
							$('#question_overs').html(que_over_lists);
						}else{
							if(n_c.user_flag){
								page_overs_list += '<a class="p_1" flags="1"  onClick="change_tis('+ic+')">'+(ic+1)+'</a>&nbsp;'
							}else{
								page_overs_list += '<a class="p_2" flags="2"  onClick="change_tis('+ic+')">'+(ic+1)+'</a>'	
							}
						}
						
					});
					 
					$('#page_overs_list').html(page_overs_list);
					
					
				});
				
				$('#contu_study').click(function(){
					var studytext = $(this).text();	
					if(studytext=='继续学习'){ //主观题 练习  只能看
						var diff_Str = $('.dj_num_sub img').attr('src').split('_')[1].substring(1,2);
						study_list_obj(parseInt(diff_Str));
						$(this).text('继续练习');
						$(this).attr('class','icon_125_35 web_icon_bottom_1');
					}else if(studytext=='继续练习'){//客观题 练习 能做
 						var diff_Str = $('.dj_num_sub img').attr('src').split('_')[1].substring(1,2);  
						diff_zhuanti(parseInt(diff_Str));
						$(this).text('继续学习');
						$(this).attr('class','icon_125_35 web_icon_bottom_3');
					}
				});
				
				$('#zhuguan_id').click(function(){
						$('.content_center').show();
						$('.contu_study').show();
						$('.question_content').hide();
						$('.content_overTemp').hide();
						$('#question_pager_RS').hide();
						var diff_Str = $('.dj_num_sub img').attr('src').split('_')[1].substring(1,2);
						
						study_list_obj(parseInt(diff_Str));
						
						$('#contu_study').text('继续练习');
						$('#contu_study').attr('class','icon_125_35 web_icon_bottom_1');
						
						
				});
				 
				
				
			}
		}else{
			window.location.href = "../index.html";
		} 	
	 
});


function study_list_obj(dff){
	var zhuanti_temp_idT = hrefParams['zhuanti_id'];
	var ti_url = '/exercise_query?r='+$.getRom();
	var ti_json = {'action':'zhuanti_question','count':10,'difficulty':dff,'study_exercise_id':0,'subject_id':hrefParams['subject_id'],'type':2,'zhuanti_id':hrefParams['zhuanti_id']};
	var tires_flag = Ajax_option(ti_url,ti_json,"GET",false);
	//console.log(JSON.stringify(tires_flag));
	$('#clhj_header').html("学习环节");
	$('.test_time').hide();
	$('.question_content').hide();
	$('.content_overTemp').hide();
	$('#question_pager_RS').hide();
	$('#question_overs').show();
	$('#page_overs').show();
	var page_overs_list = '';
	temp_que_overs = tires_flag.question;
	if(temp_que_overs!=""&&temp_que_overs!=null){
		$.each(temp_que_overs,function(ic,n_c){
			
			if(ic==0){
				page_overs_list += '<a class="p_on" flags="1" onClick="change_tisP('+ic+')">'+(ic+1)+'</a>&nbsp;';
				var que_over_lists = '<div>'+n_c.content+'</div><div class="que_my_answers"><span class="que_my_answers_L">参考答案：如下解析</span><span class="que_my_answers_R"><a href="javascript:void(0)" onclick="sel_goods(2,\''+n_c.gid+'\','+parseInt(n_c.subject_id)+',2,'+n_c.dbtype+','+n_c.section_id+')">收藏好题</a>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="jiexi_s(this)">收起解析</a>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="biji_alert('+n_c.subject_id+',\''+n_c.gid+'\','+zhuanti_temp_idT+')">'+subject_sum(n_c.subject_id)+'笔记</a></span><span class="cleard"></span></div><div class="que_my_answers_jx">解析：<br />'+n_c.answer+'</div>';
				$('#question_overs').html(que_over_lists);
			}else{
				page_overs_list += '<a class="p_1" flags="1"  onClick="change_tisP('+ic+')">'+(ic+1)+'</a>&nbsp;';
			}
			
		});
		$('#page_overs_list').html(page_overs_list);
	}else{
		$('#question_overs').html('<img src="images/budiao_no.png" />');
		$('#page_overs').hide();
	}
	
	
}

function diff_zhuanti(dffq){
	$('.contu_study').hide();
	$('.test_time').show();
	hrefParams['Qbuttype'] = 'on_study';
	hrefParams['q_count'] = 10;
	hrefParams['q_difficulty'] = dffq;
	hrefParams['study_exercise_id'] = 0;
	hrefParams['q_type'] = 1;
	window.location.href = './step_sdudy_do.html?test_info='+Base64.encode(JSON.stringify(hrefParams)); 
	
}
 
function change_tisP(num_P){
	var zhuanti_temp_idTs = hrefParams['zhuanti_id'];
	$('.p_on').attr('class','p_'+$('.p_on').attr("flags"));
	$('#page_overs_list').children().eq(parseInt(num_P)).attr("class","p_on");
	var que_ove_one = temp_que_overs[num_P];
	var que_over_lists = '<div>'+que_ove_one.content+'</div><div class="que_my_answers"><span class="que_my_answers_L">参考答案：如下解析</span><span class="que_my_answers_R"><a href="javascript:void(0)" onclick="sel_goods(2,\''+que_ove_one.gid+'\','+parseInt(que_ove_one.subject_id)+',2,'+que_ove_one.dbtype+','+que_ove_one.section_id+')">收藏好题</a>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="jiexi_s(this)">收起解析</a>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="biji_alert('+que_ove_one.subject_id+',\''+que_ove_one.gid+'\','+zhuanti_temp_idTs+')">'+subject_sum(que_ove_one.subject_id)+'笔记</a></span><span class="cleard"></span></div><div class="que_my_answers_jx">解析：<br />'+que_ove_one.answer+'</div>';
	$('#question_overs').html(que_over_lists);
}
function change_tis(num_P){
	$('.p_on').attr('class','p_'+$('.p_on').attr("flags"));
	$('#page_overs_list').children().eq(parseInt(num_P)).attr("class","p_on");
	var que_ove_one = temp_que_overs[num_P];
	var que_over_lists = '<div>'+que_ove_one.content+'</div><div class="que_my_answers"><span class="que_my_answers_L">正确答案：'+que_ove_one.objective_answer+' &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;你的答案：'+que_ove_one.user_answer+'</span><span class="que_my_answers_R"><a href="javascript:void(0)" onclick="sel_goods(2,\''+que_ove_one.gid+'\','+parseInt(que_ove_one.subject_id)+',2,'+que_ove_one.dbtype+','+que_ove_one.section_id+')">收藏好题</a>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="jiexi_s(this)">收起解析</a></span><span class="cleard"></span></div><div class="que_my_answers_jx">解析：<br />'+que_ove_one.answer+'</div>';
	$('#question_overs').html(que_over_lists);
}



function jiexi_s(ef){
	if($(ef).text()=='收起解析'){
		$(ef).parents('.que_my_answers').next('div .que_my_answers_jx').hide();
		$(ef).text('展开解析');
	}else{
		$(ef).parents('.que_my_answers').next('div .que_my_answers_jx').show();
		$(ef).text('收起解析');	
	}
	
}



function biji_alert(sub_idT,ti_idT,zhuanti_idT){
	
	var ibiji = $.layer({
		type: 1,
		title: subject_sum(sub_idT)+'添加笔记   '+getNowDate(),
		closeBtn: false,
		border : [7, 0.3, '#696969', true],
		offset: ['0px',''],
		zIndex : 30,
		move: ['.xubox_title', true],
		area: ['580px','350px'],
		 
		page: {
			html: '<div><textarea id="biji_area" name="content" style="width:578px;"></textarea></div><div class="biji_buttom"><a class="icon_125_35 web_icon_bottom_1" id="bijion" >保存</a><a class="icon_125_35 web_icon_bottom_4" id="bijiout">取消</a></div><div class="cleard"></div>'
		},
		success: function(){
			layer.shift('bottom',500);
			editor = KindEditor.create('#biji_area',{ themeType : 'simple',minWidth:'578px',height:'220px',resizeType:'0'});
		}
	});
	
	$('#bijiout').on('click', function(){
		layer.close(ibiji);
	});
	$('#bijion').on('click', function(){
		 
		var edit_html = editor.html();
		var section_idTEMP = hrefParams['section_id'] == 3 ? 19 : 18 ;
		var ti_urlT = '/notes_exercise?r='+$.getRom();
		var ti_jsonT = {'action':'add_notes','user_id':UserInfo.id,'exam_id':zhuanti_idT,'exam_type':7,'ti_id':ti_idT,'grade_id':section_idTEMP,'subject_id':sub_idT,'zhuanti_id':zhuanti_idT,'content':edit_html,'pic_content':""};
		var tires_flagT = Ajax_option(ti_urlT,ti_jsonT,"POST",false);
		if(tires_flagT.flag){
			layer.close(ibiji);	
			layer.alert("笔记添加成功!",9,"温馨提示");
			editor.remove('#biji_area');
		}else{
			layer.close(ibiji);	
			layer.alert("笔记更新失败!",9,"温馨提示");	
			editor.remove('#biji_area');
		}
		 
	});
	 
}

