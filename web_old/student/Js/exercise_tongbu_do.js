var UserInfo = [];
var questions_list = [];
var hrefParams = {}; 
var section_idTMT = 3;
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
	KindEditor.ready(function(K) {
		window.editor = K.create('.main_text');
		
	
		UserInfo = $.evalJSON($.cookie("UserInfo"));
		if(UserInfo!=null&&UserInfo!=undefined){
			
			var nick =  UserInfo.nick;
			if (UserInfo.realname != null&&UserInfo.realname!="") {
					$('#headusername').text(UserInfo.realname);
			}else if(nick!=null&&nick!=""){
					$('#headusername').text(nick);
			}
			
			var exerciseHandler = window.exerciseHandler;
			
			var currentQuestion = null;
			
			 
			 var test_info = getUrlParam('test_info');
			 
			  
			 if(judgeNull(test_info)!=""){
				 
				 hrefParams = $.parseJSON(Base64.decode(test_info));
				 var pager = new Pager();
				  
				 //{"book_id":"1","subject_id":1,"grade_id":"10","parent_id":"1","parent_name":"第一单元","chapter_id":"1","chapter_name":"1毛泽东词二首"}
				//学段id
				section_idTMT = grade_ch_section(hrefParams.grade_id);
				
				var section_name = '高中';
				if(section_idTMT==2){
					section_name = '初中';
				}else if(section_idTMT==3){
					section_name = '高中';
				}else{
					section_name = '小学';	
				}
				
				$('.test_subject').html(section_name+subject_sum(hrefParams.subject_id)); 
				$('.chapter_name').text(hrefParams.chapter_name);
				
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
					 
					if(currentQuestion.user_answer){
						 
						if(currentQuestion.user_flag){
							$('.main_answer').find('.answer_correct').show();
							$('.main_answer').find('.answer_wrong').hide();
						}else{
							$('.main_answer').find('.answer_correct').hide();
							$('.main_answer').find('.answer_wrong').show();
						}
						
						$('.main_option').hide();
						$('.ke-container').hide();
						$('.question_submit').hide();
						
						$('.offical_answer').html(currentQuestion.answer);
						$('.my_answer').attr('dbtype',currentQuestion.dbtype);
						$('.my_answer').html(currentQuestion.user_answer);
						$('.my_answer').attr('temp_ti_id',currentQuestion.gid);
						$('#add_to_haoti').show();
						$('.main_answer').show();
						$('.question_next').show();
						 
					}else{//如果没有做过，则让学生进行答题
						
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
							
						}else{
							
							$('.main_option').hide();
							$('.ke-container').show();
							
							$('.subjective_check:checked').attr('checked',false);
							
							window.editor.html('');
							
						}
						$('.question_submit').show();
						$('#add_to_haoti').hide();
						$('.question_next').hide();
						
					}
				};
				
				exerciseHandler.endlessExercise.onSubmitAnswer = function(questionType , isRight){
					$('.total_right').text(exerciseHandler.endlessExercise.rightNum);
					$('.total_wrong').text(exerciseHandler.endlessExercise.wrongNum);
					
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
				
				//开始题目列表
				exerciseHandler.endlessExercise.tongbu_begin('sync_question',true,{'chapter_id':hrefParams['chapter_id'],
					'subject_id':hrefParams['subject_id'],'study_exercise_id':hrefParams['study_exercise_id'],
					'countperpage' : hrefParams['q_count'],'pageno':1}, function(flag,data){
					if(flag){
						var questionCount = exerciseHandler.endlessExercise.questionList.length;
						 
						$('.question_pager').append(pager.showHTML(questionCount,0, 1 , questionCount));
						pager.addStyle(null , 'Js/pager/default.css');
						
						pager.bindEvent();
						
						$('.page_item_T a').attr("flags",0);
						
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
							
					//		console.log('change',offset,step);
						});
						var ding_num = 0;
						
						$.each(exerciseHandler.endlessExercise.questionList,function(qt_i,qt_n){
							   if(qt_n.user_answer!=undefined){
									questions_list.push(qt_n);
									ding_num = qt_i;
							   }
						}); 
						$('.total_right').text(exerciseHandler.endlessExercise.rightNum);
						$('.total_wrong').text(exerciseHandler.endlessExercise.wrongNum);
						$('.pager_page[offset='+ding_num+']').trigger("click"); 
						
					}else{
						
					}
					 
				});
				
				
				//提交题目
				$('.question_submit').click(function(){
					 
					if(currentQuestion.type_name == '选择题' || currentQuestion.type_name == '判断题'){
						if($('.option_btn:checked').length == 0){
							layer.alert('请选择答案！', 8,'温馨提示');
							return;
						}
						var answer = $('.option_btn:checked').val();
						$('.main_option').hide();
			//			$('.subjective_check').hide();
						exerciseHandler.endlessExercise.submitObjectiveAnswer(answer);
						$('.offical_answer').html(currentQuestion.answer);
						$('.my_answer').html(answer);
						$('.my_answer').attr('dbtype',currentQuestion.dbtype);
						$('.my_answer').attr('temp_ti_id',currentQuestion.gid);
						$('.main_answer').show();
						$(this).hide();
						$('.question_next').show();
						$('#add_to_haoti').show();
						questions_list.push(currentQuestion);
						if(currentQuestion.objective_answer!=answer){
							sel_goods(1,currentQuestion.gid,hrefParams['subject_id'],2,currentQuestion.dbtype,currentQuestion.section_id);
						}
					}else{
						var answer = window.editor.text();
						if($.trim(answer) == ''){
							layer.alert('请填写答案！', 8,'温馨提示');
							return;
						}
						$('.ke-container').hide();
						$('.main_answer').find('.answer_correct , .answer_wrong').hide();
						$('.offical_answer').html(currentQuestion.answer);
						$('.my_answer').html(answer);
						$('.my_answer').attr('dbtype',currentQuestion.dbtype);
						$('.my_answer').attr('temp_ti_id',currentQuestion.gid);
						$('.main_answer').show();
						$(this).hide();
						$('#add_to_haoti').show();
						$('.question_next').show();
						var sss = $.layer({
							shade : [0.2,'#696969',true],  
							area : ['auto','auto'],
							title:'主观题判定',
							dialog : {
								msg:'请判定您填写的答案正确与否？<br />如果跳过点击右上角按钮！',
								btns : 2, 
								type : 2,
								btn : ['正确','错误'],
								yes : function(){
									$('.main_answer').find('.answer_correct').show();
									exerciseHandler.endlessExercise.submitSubjectiveAnswer(1 , window.editor.html());
									layer.close(sss);
									questions_list.push(currentQuestion);
								},
								no : function(){
									$('.main_answer').find('.answer_wrong').show(); 
									exerciseHandler.endlessExercise.submitSubjectiveAnswer(0 , window.editor.html());
									layer.close(sss);
									questions_list.push(currentQuestion);
									sel_goods(1,currentQuestion.gid,hrefParams['subject_id'],2,currentQuestion.dbtype,currentQuestion.section_id);
								}
							}
						});
					}
					
					if($('.page_item_T a[flags="0"]').length==1){
						$('.question_next').attr('value','提交');
					}
				 
				});
				
				//下一题
				$('.question_next').click(function(){
					  
					if($('.question_next').attr('value')=='提交'){
						/*  content:  {"answer":"C","id":"erj10005231","obj":1,"score":3}*/
							var checkpass = true;
							var content = [];
							var score = 0;
							var scores = 0; 
							for(var i in questions_list){
								content.push({
									answer : questions_list[i].user_answer,
									id : questions_list[i].gid,
									obj : questions_list[i].objective_flag,
									score : questions_list[i].score,
									dbtype : questions_list[i].dbtype,
									flag:questions_list[i].user_flag
								});
								scores += parseInt(questions_list[i].score);
								if(questions_list[i].user_flag!=false){
									score += parseInt(questions_list[i].score);
								}
								
							}
							
							var examResult = {};
							examResult.content = content;
							examResult.dbtype = questions_list[0].dbtype?questions_list[0].dbtype:1;
							examResult.my_score = (score/scores)*100;
							examResult.type = 2;        //2已提交   试卷状态   1.正在做 
							examResult.exam_type = 5;  //  1.作业/测试 2. 专题  3. 真题 4.名校  5 同步
							examResult.exercise_id = hrefParams['chapter_id'];
							examResult.section_id = grade_ch_section(UserInfo.grade_id);
							
							examResult.subject_id = hrefParams['subject_id'];  // 
							if(hrefParams['study_exercise_id']!=0&&hrefParams['study_exercise_id']!=undefined){
								examResult.study_exercise_id = hrefParams['study_exercise_id'];
							}
							
							examResult.log_time = newcreate_date; 
							exerciseHandler.examExercise.uploadExamResult(JSON.stringify(examResult) , function(flag , data){
								
								if(flag==true&&data.flag==true){
									layer.alert('提交成功！', 9,'温馨提示',function(){
										window.location.href="./exercise_tongbu.html";	
									});
									 
									$('.question_next').attr('value','已提交');
								}else{
									layer.alert('保存失败，请稍后再试！', 8,'温馨提示');	 
								}
							});
					}
					if($('.question_next').attr('value')=='已提交'){
						layer.alert('你已经提交,不可以多次提交！', 8,'温馨提示');
						 
						return;
					}
					
					if($('.page_item_T a[flags="0"]').length==1){
							 
							$('.question_next').attr('value','提交');
						}else{
							 $('.pager_next').click();
							 if($('.page_item_T a[flags="0"]').eq(0).attr('offset')!=0){
								 $('.pager_page[offset='+$('.page_item_T a[flags="0"]').eq(0).attr('offset')+']').trigger("click"); 	 
							 }
						}
				 
			//		exerciseHandler.endlessExercise.next();
				});
				
				
				//临时保存
				$('#temp_Save').click(function(){
					 
					if(questions_list!=""){
					 
						var checkpass = true;
						var tempsResult = {};
						 
						var content = [];
						//var score = 0;
						for(var i in questions_list){
							var anser_temps = '';
							anser_temps	= questions_list[i].user_answer;
							if(anser_temps!=""&&anser_temps!=null){
								content.push({
									answer : anser_temps,     //学生答案
									id : questions_list[i].gid,  //试题id
									obj : questions_list[i].objective_flag,  //题目类型 0 (主观)，1(客观)
									score : questions_list[i].score,
									dbtype : questions_list[i].dbtype, 
									flag:questions_list[i].user_flag   //0(错),1(对)是主观题的判定  true(对) false(错)客观题的判定
								});
							}
						}
						//{"book_id":"1","subject_id":1,"grade_id":"10","parent_id":"1","parent_name":"第一单元","chapter_id":"1","chapter_name":"1毛泽东词二首"}
						tempsResult.content = content;
						//tempsResult.my_score = score;
						tempsResult.dbtype = questions_list[0].dbtype?questions_list[0].dbtype:1;
						tempsResult.type = 4;        //2已提交   试卷状态  4.正在做  3已批阅 1 新作业
						tempsResult.exam_type = 5;  //  1.作业/测试 2. 专题  3. 真题 4.名校 5.同步
						tempsResult.position = $('.tn-selected').text();  //最后定位到第几题
						tempsResult.section_id = grade_ch_section(UserInfo.grade_id);   //学段
						tempsResult.grade_id = UserInfo.grade_id;      //年级
						tempsResult.subject_id = hrefParams['subject_id'];  //学科
						tempsResult.book_id = hrefParams['book_id'];        //书的id  几年级的书
						tempsResult.chapter_id = hrefParams['chapter_id'];  //章节的最后一层的id
						tempsResult.log_time = newcreate_date; 
						if(hrefParams['study_exercise_id']!=0&&hrefParams['study_exercise_id']!=undefined){
								tempsResult.study_exercise_id = hrefParams['study_exercise_id'];
							}
						exerciseHandler.examExercise.uploadExamResult_act('saveHistory',JSON.stringify(tempsResult) , function(flag , data){
					
							if(flag){
								layer.alert('临时保存成功！',9,'温馨提示',function(){
									window.location.href = 'exercise_tongbu.html';
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
					exerciseHandler.endlessExercise.tongbu_begin('sync_question' , false,{'chapter_id':hrefParams['chapter_id'],
					'subject_id':hrefParams['subject_id'],
					'countperpage' : hrefParams['q_count'],'pageno':1}, function(flag,data){
						if(flag){
							$('.total_right').text(exerciseHandler.endlessExercise.rightNum);
							$('.total_wrong').text(exerciseHandler.endlessExercise.wrongNum);
							var questionCount = exerciseHandler.endlessExercise.questionList.length;
							$('.question_pager').html(pager.showHTML(questionCount,0, 1 , questionCount));
							pager.bindEvent();
						}
					 
					});
						
				});
				//添加好题本
				$('#add_to_haoti').click(function(){
					sel_goods(2,$('.my_answer').attr('temp_ti_id'),hrefParams['subject_id'],2,$('.my_answer').attr('dbtype'),section_idTMT);
				});
				
				$('.subjective_check_btn').click(function(){
					if($('.subjective_check:checked').length == 0){
						layer.alert('请进行选择！', 8,'温馨提示');
						return;
					}
					var flag = parseInt($('.subjective_check:checked').val());
					exerciseHandler.endlessExercise.submitSubjectiveAnswer(flag , window.editor.html());
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
			 }
			 
		}else{
			window.location.href = "../index.html";
		}
	});
});






