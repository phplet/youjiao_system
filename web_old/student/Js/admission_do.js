var UserInfo = [];
var hrefParams = {};
var exam_info = {};
var stu_exercise_idT = $.cookie("study_exercise_id"); 
var paperidT = $.cookie("paperid"); 
var sub_IdT = $.cookie("sub_Id"); 
var test_nameT = $.cookie("test_name"); 
var exercise_idTs = $.cookie("exercise_id"); 
var teacher_idTs = $.cookie("teacher_id"); 
var center_idTs = $.cookie("center_id"); 
var zone_idTs = $.cookie("zone_id"); 
var question_ls = [];

$(document).ready(function(){
	stu_exercise_idT = $.cookie("study_exercise_id"); 
	paperidT = $.cookie("paperid");
	sub_IdT = $.cookie("sub_Id"); 
	test_nameT = $.cookie("test_name");
	exercise_idTs = $.cookie("exercise_id"); 
	teacher_idTs = $.cookie("teacher_id"); 
	center_idTs = $.cookie("center_id"); 
	zone_idTs = $.cookie("zone_id"); 
	hrefParams = {'teacher_Uid':teacher_idTs,'center_id':center_idTs,'zone_id':zone_idTs,'paperid':paperidT,'subject_id':sub_IdT,'study_exercise_id':stu_exercise_idT,'test_name':test_nameT,'exercise_id':exercise_idTs};
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
			window.location = './admission_standed.html';	
		});
		$('#back_home').unbind('click');
		$('#back_home').click(function(){
			window.location = './Index.html';	
		});
		
		var exerciseHandler = window.exerciseHandler;
		 
		var currentQuestion = null;
		 
		var editors = [];
		$('.question_zhuanti').text(hrefParams.test_name);
		ti_lists();  //加载数据
		$('.content_center').css('top' , $('.question_head').height()+12);	
		 
		
		$('.begin_exam').click(function(){
			
			$('.question_count , .main_analyze').hide();
			$('.exam_submit , .exam_timer').show();
			$('.main_option , .main_text').show();
			$('#right_sct').show();//随着页面滚动显示
			$('.content_center').css('width','870px');
			scrollright(); //随着页面滚动
			
			var question_list = question_ls;
			 
			 
			$('.question_content_main:visible').each(function(i,v){
				if(question_list[i].type_name == '选择题'){
					if(question_ls[i].option_count<=4){
						$(this).find('.option_e').hide();
					}
					$(this).find('.option_btn').attr('name','option'+i);
					 
				}else{
					$(this).find('.subjective_check').attr('name' , 'subjective_check'+i);
					editors[i] = KindEditor.create('#'+$(this).find('.main_text').attr('id'),{minWidth : '100px',minHeight:'150px'});
					
				}
				 
			});
			 
			exerciseHandler.examExercise.onTimer = function(show_time){
				$('.exam_timer_show').text(show_time);
			};
			
			exerciseHandler.examExercise.begin();
		});
		 
		
		$('.down_time').click(function(){
			if($('.zhanting').text()=='暂停'){
				exerciseHandler.examExercise.end();
				$('.zhanting').text('继续');
				//layer.alert('想歇会再做了！',9,'温馨提示');
			}else{
				exerciseHandler.examExercise.pause();
				$('.zhanting').text('暂停');
			}
		});
		
		$('.exam_submit_btn').click(function(){
			
			
			$('.submit_btn').show();
			 
		});
		
		
		$('.submit_btn').click(function(){
			/*  content:  {"answer":"C","id":"erj10005231","obj":1,"score":3}*/
			
			var question_list = question_ls;
			$('.ke-container , .main_option').hide();
			 
			exerciseHandler.examExercise.end();
			
			var answers = [];
			
			for(var i in question_list){
				if(question_list[i].type_name == '选择题'){
					var my_answer = $('.question_content_main:visible').eq(i).find('input:checked').val();
					if(my_answer == question_list[i].objective_answer){
						question_list[i].user_answer = {right : 1 , answer : my_answer};
					}else{
						question_list[i].user_answer = {right : 0 , answer : my_answer};
						
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
			
			 
			$('.bot_1').hide();
			$('.bot_2').hide(); 
			 
			var duration = exerciseHandler.examExercise.use_time;
			var content = [];
			var score = 0;
			var wrong_ids = [];
			 
			for(var i in question_list){
				
				content.push({
					id : question_list[i].gid,
					answer : question_list[i].user_answer.answer,
					correct : question_list[i].user_answer.right,
					score : 0,
					objective_flag : question_list[i].objective_flag,
					obj:question_list[i].objective_flag,
					question_type : question_list[i].type_name,
					attachment : "",
					dbtype : question_list[i].dbtype
				});
				if(question_list[i].type_name=='选择题'){
					if(question_list[i].user_answer.right==0){
						 wrong_ids.push(question_list[i].gid);
					}
				}
				 
			}
			 
			var load_ii = 0;
			var test_jsonT = {"exercise_id":hrefParams['exercise_id'],"study_exercise_id":hrefParams['study_exercise_id'],"duration":duration,"content":content,
			"dbtype":"1","my_score":"0","type":2,"exam_type":6,"subject_id":hrefParams['subject_id'],"grade_id":question_list[0].grade_id,"section_id":question_list[0].section_id}; 
			sel_goods(1,wrong_ids.join(','),hrefParams['subject_id'],2,1,question_list[0].section_id);
			$.ajax({
				//url: Webversion + "/ticool/user_history/bat?_method=PUT&r="+$.getRom(),
				url:Webversion + "/exercise_post&r="+$.getRom(),
				type: "POST",
				dataType: "json",
				data: {'action':'saveExamResult','data':JSON.stringify(test_jsonT)},
				beforeSend: function (request) {
					load_ii = layer.load('加载中...');  
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
				complete: function (XMLHttpRequest, textStatus){
					layer.close(load_ii);
				},
				success: function (result){//alert(result);	
					window.location.href="admission_standed.html";
				},
				error: function (result)
				{
					if(result.status=='401'){
						layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
							clearcookie();
					});
					}else{
						layer.alert('加载数据失败！', 8,'温馨提示');	
					}
				  
				  
				 return;
				}
			});
			
			
		});
		
		
		/*
		$('.back_btn').click(function(){
			window.location.href = 'exercise_zhenti.html';
		});
		*/
		$('.check_answer').click(function(){
			var question_list = question_ls;
			
			$('.question_content_main:visible').each(function(i,v){
				$(this).find('.main_analyze').html(question_list[i].answer).show();
			});
		});
		
		 
		
	
	
	}else{
		window.location.href = "../index.html";
	} 	  
	
	
	
});

function ti_lists(){
	 var url_type = '/examination_paper?r='+$.getRom();
	 var Qjson = {'action':'paper','paper_id':Base64.decode(hrefParams.paperid),'subject_id':hrefParams.subject_id,'newtest':1,'study_exercise_id':hrefParams.study_exercise_id};
	 var result  = Ajax_option(url_type,Qjson,"GET",false);
	 if(result.list!=null){
		question_ls = result.list;
	 	for(var i in result.list){
					
			var clone = $('#question_content_main_template').clone();
			clone.attr('id' , null);
			clone.find('.main_content').html('<p style="border-bottom:#d0bfbf dotted 1px; margin-bottom:10px;">'+(parseInt(i)+1)+'.</p>'+result.list[i].content);
			clone.appendTo('.question_content').show();
			
			if(result.list[i].type_name == '选择题'){
				clone.find('.main_text').remove();

				clone.find('input').attr('name' , 'option'+i);
			}else{
				clone.find('.main_option').remove();
				clone.find('.main_text').attr('id','editor_'+i);
				
			}
			
		}
	 }
}

 



