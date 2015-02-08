var UserInfo = [];
var hrefParams = {};
var exam_info = {};
function getHrefParams(){
	
	var param = {};
	var _p=window.location.href.split('?')[1].split('&');
	for(var i in _p){
		var tmp = _p[i].split('=');
		param[tmp[0]] = tmp[1];
	}
	return param;
}

$(document).ready(function(){
	var newcreate_date = getNowDateSec();
	hrefParams = {};
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	if(UserInfo!=null&&UserInfo!=undefined){ 
		var nick =  UserInfo.nick;
			 
	if (UserInfo.realname != null&&UserInfo.realname!="") {
			$('#headusername').text(UserInfo.realname);
	}else if(nick!=null&&nick!=""){
			$('#headusername').text(nick);
	}
	$('#back_html').unbind('click');
	$('#back_html').click(function(){
		window.location = './exercise_mingxiao.html';	
	});
	$('#back_home').unbind('click');
	$('#back_home').click(function(){
		window.location = './Index.html';	
	});
	var exerciseHandler = window.exerciseHandler;
	
	var pageType = window.location.href.split('?')[0].split('/').pop().split('.')[0].split('_')[1];
	
	var currentQuestion = null;
	
	hrefParams = getHrefParams();
	  
	var editors = [];
	
	exerciseHandler.examExercise.loadExamData_M(hrefParams['mingxiao_id'] ,hrefParams['subject_id'] , function(flag , data){
		if(flag){
			$('.question_zhuanti').text(data.exam_info.name);
			
			exam_info = data.exam_info;
			
			for(var i in data.question_data){
				var clone = $('#question_content_main_template').clone();
				clone.attr('id' , null);
				clone.find('.main_content').html('<p style="border-bottom:#d0bfbf dotted 1px; margin-bottom:10px;">'+(parseInt(i)+1)+'.</p>'+data.question_data[i].content);
				clone.appendTo('.question_content').show();
				
				if(data.question_data[i].type_name == '选择题'){
					clone.find('.main_text').remove();
//					var answer_clone = $('#answer_objective_template').clone().attr('id' , null);
					clone.find('input').attr('name' , 'option'+i);
					
				}else{
					clone.find('.main_option').remove();
					clone.find('.main_text').attr('id','editor_'+i);
					
				}
			
			}
			
			for(var i in data.history){
				var clone = $('#history_element_template').clone();
				clone.attr('id' , null);
				clone.text(data.history[i].log_time.split(' ')[0]+'完成 得分'+data.history[i].my_score);
				clone.appendTo('.exam_history').show();
			}
			$('.content_center').css('top' , $('.question_head').height()+12);	
			
		}else{
			layer.alert('加载真题信息失败！', 8,'温馨提示');
			 
		}
	});
	
	
	$('.tmp_save').click(function(){

		/*  content:  {"answer":"C","id":"erj10005231","obj":1,"score":3}*/
		
		var question_list = exerciseHandler.examExercise.question_list; 
		var checkpass = true;
		var examResult = {};
		examResult.exercise_id = hrefParams['mingxiao_id'];
		examResult.duration = exerciseHandler.examExercise.use_time;
		var content = [];
		var score = 0;
		
		for(var i in question_list){
			var anser_temps = ''; 
			
			if(question_list[i].type_name == '选择题'){
				anser_temps = $('.question_content input[name="option'+i+'"]:checked').val();
				if(judgeNull(anser_temps)==""){
					anser_temps ="";
				}
			}else{
				anser_temps	= editors[i].html();
			}
			if(anser_temps!=""&&anser_temps!=null){
				content.push({
					answer : anser_temps,
					id : question_list[i].gid,
					obj : question_list[i].objective_flag,
					score : question_list[i].score,
					dbtype : question_list[i].dbtype,
					flag:question_list[i].user_flag
				});
			}
			 
		}
		
		examResult.content = content;
		examResult.my_score = score;
		examResult.dbtype = question_list[0].dbtype?question_list[0].dbtype:1;
		examResult.type = 4;        //2已提交   试卷状态  4.正在做  3已批阅 1 新作业
		examResult.exam_type = 4;  //  1.作业/测试 2. 专题  3. 真题 4.名校
		examResult.position = (content.length-1);
		examResult.subject_id = hrefParams['subject_id'];  // saveZhentiHistory
		examResult.grade_id = UserInfo.grade_id;
		examResult.section_id = grade_ch_section(UserInfo.grade_id);
		examResult.year = exam_info.year.substring(0,exam_info.year.length-1);
		examResult.province_id = exam_info.province_id;
		examResult.log_time = newcreate_date; 
		if(hrefParams['study_exercise_id']!=0&&hrefParams['study_exercise_id']!=undefined){
			examResult.study_exercise_id = hrefParams['study_exercise_id'];
		}
		exerciseHandler.examExercise.uploadExamResult_act('saveHistory',JSON.stringify(examResult) , function(flag , data){
			
			if(flag){
				//$('.score_panel').find('.score_span').text(examResult.my_score);
				//$('.score_panel , .cover_div').show();
				layer.alert('临时保存成功！',9,'温馨提示',function(){
					
					window.location = './exercise_mingxiao.html';		
					
				});
				$('.xubox_close').hide();
				
			}else{
				layer.alert('保存失败，请稍后再试！', 8,'温馨提示');
				 
			}
			
		});
		 
	});
	
	
	$('.begin_exam').click(function(){
		
		$('.question_count , .main_analyze').hide();
		$('.exam_submit , .exam_timer').show();
		$('.main_option , .main_text').show();
		$('#right_sct').show();//随着页面滚动显示
		$('.content_center').css('width','870px');
		scrollright(); //随着页面滚动
		
		var question_list = exerciseHandler.examExercise.question_list;
		var ssave_Tempvalues ={};
		var save_Tempvalues ={};
		if(hrefParams['study_exercise_id']!=0&&hrefParams['study_exercise_id']!=undefined){
			ssave_Tempvalues = inntTempValues(hrefParams['study_exercise_id']); 
			save_Tempvalues = ssave_Tempvalues.exercise_content;
			
		}
		$('.question_content_main:visible').each(function(i,v){
			if(question_list[i].type_name == '选择题'){
				if(exerciseHandler.examExercise.question_list[i].option_count<=4){
					$(this).find('.option_e').hide();
				}
				$(this).find('.option_btn').attr('name','option'+i);
			}else{
				$(this).find('.subjective_check').attr('name' , 'subjective_check'+i);
				editors[i] = KindEditor.create('#'+$(this).find('.main_text').attr('id'),{minWidth : '100px',minHeight:'150px'});
			}
			
			if(hrefParams['study_exercise_id']!=0&&hrefParams['study_exercise_id']!=undefined){
				$.each(save_Tempvalues,function(t_i,t_n){
					if(question_list[i].gid==t_n.id){
						if(question_list[i].type_name == '选择题'){
							 
							$('.question_content input[type=radio][name=option'+i+'][value='+t_n.answer+']').attr("checked","checked");
							
						}else{
							editors[i].html(t_n.answer); 
							//$('#editor_'+i).html(t_n.answer);
						}
					}	
				});
			}
			
		});
		
		exerciseHandler.examExercise.onTimer = function(show_time){
			$('.exam_timer_show').text(show_time);
		};
		if(hrefParams['study_exercise_id']!=0&&hrefParams['study_exercise_id']!=undefined){
			if(ssave_Tempvalues.duration!=null&&ssave_Tempvalues.duration!=undefined){ 
				exerciseHandler.examExercise.begin(ssave_Tempvalues.duration);
			}else{
				exerciseHandler.examExercise.begin();	
			}
		}else{
			exerciseHandler.examExercise.begin();
		}
		 

		
	});
	
	$('.down_time').click(function(){
		if($('.zhanting').text()=='暂停'){
			exerciseHandler.examExercise.end();
			$('.zhanting').text('继续');
			var i = layer.alert('想歇会再做了！',9,'温馨提示',function(){
				exerciseHandler.examExercise.pause();
				$('.zhanting').text('暂停');	
				layer.close(i);
			});
			$('.xubox_close').hide();
		}
	});
	
	 
	$('.exam_submit_btn').click(function(){
		
		$('.ke-container , .main_option').hide();
		
		var question_list = exerciseHandler.examExercise.question_list;
		
		exerciseHandler.examExercise.end();
		
		var answers = [];
		
		for(var i in question_list){
			if(question_list[i].type_name == '选择题'){
				var my_answer = $('.question_content_main:visible').eq(i).find('input:checked').val();
				if(my_answer == question_list[i].objective_answer){
					question_list[i].user_answer = {right : true , answer : my_answer};
				}else{
					question_list[i].user_answer = {right : false , answer : my_answer};
					 
				}
			}else{
				question_list[i].user_answer = {answer : editors[i].html()};
			}
			answers.push(question_list[i].user_answer);
		}
		
		$('.question_content_main:visible').each(function(i,v){
			if(question_list[i].type_name == '选择题'){
				$(this).find('.subjective_check').hide();
				if(answers[i].right){
					$(this).find('.answer_wrong').hide();
				}else{
					$(this).find('.answer_correct').hide();
				}
				
				$(this).find('.offical_answer').html(question_list[i].answer);
				$(this).find('.my_answer').html(answers[i].answer);
				
			}else{
				$(this).find('.offical_answer').html(question_list[i].answer);
				$(this).find('.my_answer').html(answers[i].answer);
			}
			$(this).find('.main_answer').show();
		});
		
		$(this).hide();
		$('.bot_1').hide();
		$('.bot_2').hide();
		$('.submit_btn').show();
		
	});
	
	
	$('.submit_btn').click(function(){
		/*  content:  {"answer":"C","id":"erj10005231","obj":1,"score":3}*/
		
		var question_list = exerciseHandler.examExercise.question_list;
		
		var checkpass = true;
		
		$('.question_content_main:visible').each(function(i,v){
			var right_value = parseInt($(this).find('.main_answer').find('.subjective_check:checked').val());
			if(question_list[i].type_name != '选择题'){
				if(right_value == 0||right_value==1){
					question_list[i].user_answer.right = right_value;
					 
				}else{
					layer.alert('有主观题没有进行评定哦！', 8,'温馨提示');
					checkpass = false;
					return false;	
				}
			}
		});
		
		if(!checkpass){
			return false;
		}
		
		var examResult = {};
		examResult.exercise_id = hrefParams['mingxiao_id'];
		examResult.duration = exerciseHandler.examExercise.use_time;
		
		var content = [];
		var score = 0;
		var wrong_ids = '';
		var wrong_lv = 0;
		var ringt_lv = 0;
		for(var i in question_list){
			content.push({
				answer : question_list[i].user_answer.answer,
				id : question_list[i].id,
				obj : question_list[i].objective_flag,
				score : question_list[i].score,
				dbtype : question_list[i].dbtype,
				flag:question_list[i].user_answer.right
			});
			 
			if(question_list[i].user_answer.right){
				score += parseInt(question_list[i].score);
				ringt_lv ++;
			}else{
				wrong_ids += question_list[i].gid+',';
				wrong_lv ++;
			}
			
		}
		if(wrong_ids!=""){
			sel_goods(1,wrong_ids.substring(0,wrong_ids.length-1),hrefParams['subject_id'],2,question_list[0].dbtype,grade_ch_section(UserInfo.grade_id));
		}
		examResult.content = content;
		examResult.dbtype = question_list[0].dbtype?question_list[0].dbtype:1;
		examResult.my_score = (ringt_lv/(ringt_lv+wrong_lv)).toFixed(2);
		examResult.type = 2;        //2已提交   试卷状态   1.正在做 
		examResult.exam_type = 4;  //  1.作业/测试 2. 专题  3. 真题 4.名校
		examResult.subject_id = hrefParams['subject_id'];  // 
		examResult.grade_id = UserInfo.grade_id;
		examResult.section_id = grade_ch_section(UserInfo.grade_id);
		examResult.year = exam_info.year.substring(0,exam_info.year.length-1);
		examResult.province_id = exam_info.province_id;
		if(hrefParams['study_exercise_id']!=0&&hrefParams['study_exercise_id']!=undefined){
			examResult.study_exercise_id = hrefParams['study_exercise_id'];
		}
		examResult.log_time = newcreate_date; 
		exerciseHandler.examExercise.uploadExamResult(JSON.stringify(examResult) , function(flag , data){
			
			if(flag){
				layer.alert('试卷提交成功！', 9,'温馨提示');
				var ssstime = ((examResult.duration)/60).toFixed(2);
				$('.content').hide();
				$('.exam_over_sroces').show();
				$('.exam_over_Scontent').html('<li>'+examResult.my_score+'%</li><li>--</li><li>--</li><li>'+ssstime+' 分钟</li><li> -- 分钟</li>');
				
				var url_type = '/exercise_query?pageno=1&countprepage=5&r='+$.getRom();
				var json_score = {'action':'exercise_score','id':UserInfo.id,'exam_type':examResult.exam_type,'exercise_id':examResult.exercise_id};
				var reTemp = Ajax_option(url_type,json_score,"GET",false);
				var rehtmls = '';
				if(reTemp.list!=null&&reTemp.list!=""){
					$.each(reTemp.list,function(re_i,re_n){
						if(re_i!=0){
							var create_date = re_n.create_date;
							if(re_n.create_date!=null&&re_n.create_date!=""){
								create_date = re_n.create_date.substring(0,10);
							}
							rehtmls += '<span>'+create_date+'年完成 得分率 '+re_n.my_score+'%</span>';
						}
					});
					
				}else{
					rehtmls = '<span>没有你做过的记录!</span>';
				}
				
				$('.his_exam_sroces').html(rehtmls);
				
			}else{
				layer.alert('保存失败，请稍后再试！', 8,'温馨提示');
			}
			
		});
		
	});
	
	
	 
	
	$('.check_answer').click(function(){
		var question_list = exerciseHandler.examExercise.question_list;
		
		$('.question_content_main:visible').each(function(i,v){
			$(this).find('.main_analyze').html(question_list[i].answer).show();
		});
	});
	
	$('.download_word').click(function(){
		window.open('/restAPI3.0/get_word?action=mingxiao&mingxiao_id='+hrefParams['mingxiao_id']+'&subject_id='+hrefParams['subject_id']);
	});
	}else{
		window.location.href = "../index.html";
	}
	
});

function inntTempValues(study_exercise_idT){
	var init_data =  Ajax_option('/exercise_query?r='+$.getRom(),{'action':'exercise_content','study_exercise_id':study_exercise_idT},"GET",false);
	var temst = "";
	if((init_data.exercise_content!=null)){
		var temstst = $.parseJSON(Base64.decode(init_data.exercise_content));
		var exercise_duration = init_data.exercise_duration;
		temst = {'exercise_content':temstst,'duration':exercise_duration};
	}
	return temst;
}

