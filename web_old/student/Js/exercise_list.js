var iTSM = '';
var UserInfo = [];
var section_idT = '';
 
$(document).ready(function(){
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	if(UserInfo!=null&&UserInfo!=undefined){ 
		var nick =  UserInfo.nick;
				 
		if (UserInfo.realname != null&&UserInfo.realname!="") {
				$('#headusername').text(UserInfo.realname);
		}else if(nick!=null&&nick!=""){
				$('#headusername').text(nick);
		}
		
		var exerciseHandler = window.exerciseHandler;
		
		var selectZhuantiID = 0;
		var selectSubjectID = 0;
		var selectZhuantiName = "";
		var study_exercise_idT = "";
		 
		var pageType = window.location.href.split('?')[0].split('/').pop().split('.')[0].split('_')[1];
		 
		//学段id		 
		 
		section_idT = grade_ch_section(UserInfo.grade_id);
	 
	    if(section_idT==2||section_idT==3){
			//初始化成功后，建立专题列表
			exerciseHandler.query('nav' , {type:pageType,'section_id':section_idT} , function(flag , data){
				var label = {'zhenti':'真题','zhuanti':'专题'};
				if(flag){
					for(var i in data.subject){
		//							console.log(data.subject[i]);
						$('#nav_element_template').clone().html('<span class="disp_s"><span class="tongbu_span icon_33_33 web_icon_'+data.subject[i].subject_id+'_33"></span><span class="tongbu_span">&nbsp;'+data.subject[i].grade_name+''+data.subject[i].subject_name+label[pageType]+'</span><span class="cleard"></span></span>')
							.appendTo('.content_left').attr({'id':null,'subject_id':data.subject[i].subject_id}).show();
							$(".content_left div").eq((i+1)).addClass();
					}
					
					$(".content_left div").eq(1).click();
					
				}else{
					layer.alert('初始化失败！', 8,'温馨提示');
					 
				}
			});
			
			 
			
			//监听点击左侧导航
			$(document).delegate('.nav_element','click',function(){
				
				selectSubjectID = $(this).attr('subject_id');
				$(this).parent().children().each(function(ii, es) {
					$(es).attr('class','nav_element');
				});
				$(this).addClass('active_nav');
				var queryData = {
					subject : parseInt($(this).attr('subject_id')),
					'section_id':section_idT
				};
				exerciseHandler.query(pageType ,  queryData , function(flag , data){
					if(flag){
						$('.content_element_z:not("#content_element_template")').remove();
						for(var i in data[pageType]){
							var template = $('#content_element_template').clone();
							template.attr('id' , null).attr(pageType+'_id' , data[pageType][i].id).appendTo('.content_center');
							 
							template.find('.title_pic').addClass("subject_icon_0"+queryData.subject);
							template.find('.title_label').text(cutString(data[pageType][i].name,13).cutstring);
							template.find('.title_label').attr("title",data[pageType][i].name);
							
							if(data[pageType][i].zhuanti_do_num!=0&&data[pageType][i].zhuanti_do_num!=null){
								template.find('.main_done').show();
								template.find('.last_nums').text(data[pageType][i].zhuanti_do_num);
								template.find('.now_nums').text('2');
							}else{
								template.find('.main_done').attr('style',"");
								//template.find('.main_done').css('visibility','hidden');
							}
							
							
							template.find('.zhuanti_enter').attr('exercise_id',data[pageType][i].id);
							template.find('.zhuanti_enter').attr('section_id',data[pageType][i].section_id);
							var study_ex_id = 0;
							 if(data[pageType][i].exercise_history[0]!=undefined&&data[pageType][i].exercise_history[0]!=0&&data[pageType][i].exercise_history[0]!=""){
								 study_ex_id = data[pageType][i].exercise_history[0].study_exercise_id;
								 if(study_ex_id!=""&&study_ex_id!=undefined){
									
								 }else{
									study_ex_id = 0;
								}
							 }
							 if(study_ex_id==0){
								 template.find('.zhuanti_enter').attr('study_exercise_id',study_ex_id);
								 template.find('.study_jzlx').parent().hide();
							 }else{
								template.find('.study_jzlx').parent().show();
								template.find('.zhuanti_enter').attr('study_exercise_id',0);
								template.find('.study_jzlx').attr('study_exercise_id',study_ex_id); 
							}
							
							template.show();
						}
					}else{
						layer.alert('加载专题失败！', 8,'温馨提示');
						 
					}
					
				});
			});
			
			
			
			//监听点击进入专题按钮
			$(document).delegate('.zhuanti_enter','click',function(){
				selectZhuantiID = $(this).attr('exercise_id');
				selectZhuantiName = $(this).parents('.content_element_z').find('.title_label').attr('title');
				study_exercise_idT = $(this).attr('study_exercise_id');
				if(study_exercise_idT==0){
					$('.exercise_setting').show();
					iTSM = $.layer({
						type : 1,
						title : ['专题设置',true],
						offset:['' , ''],
						border : [7 , 0.3 , '#696969', true],
						area : ['420px','180px'],
						page : {dom : '.exercise_setting'}
					});
				}else{
					if(pageType == 'zhuanti'){
						var test_info = {};
						test_info['zhuanti_id'] = selectZhuantiID;
						test_info['subject_id'] = parseInt(selectSubjectID);
						test_info['section_id'] = section_idT;
						test_info['zhuanti_name'] = selectZhuantiName;
						test_info['study_exercise_id'] = study_exercise_idT;
						test_info['q_type'] = 0;
						test_info['q_difficulty'] = 0;
						test_info['q_count'] = 0;
						test_info['type_name'] = $('.active_nav .tongbu_span').text();
						window.location.href = './exercise_zhuanti_do.html?test_info='+Base64.encode(JSON.stringify(test_info));
						//window.location.href = 'exercise_'+pageType+'_do.html?'+pageType+'_id='+selectZhuantiID+'&subject_id='+selectSubjectID+'&study_exercise_id'+study_exercise_idT;
					}	
				} 
				
				
			});
			
			$('.cancel_exercise').click(function(){
				layer.close(iTSM);
				$('.exercise_setting').hide();
				
			});
			
			$('.begin_exercise').click(function(){
				layer.close(iTSM);
				var test_info = {};
				var question_type = $('.exercise_question_type').val();
				var question_difficulty = $('.exercise_difficulty').val();
				var question_count = $('.exercise_count').val();
				
				//var href = 'exercise_'+pageType+'_do.html?'+pageType+'_id='+selectZhuantiID+'&subject_id='+selectSubjectID+
				//					'&q_type='+question_type+'&q_difficulty='+question_difficulty+'&q_count='+question_count;
				
				test_info['zhuanti_id'] = selectZhuantiID;
				test_info['subject_id'] = parseInt(selectSubjectID);
				test_info['q_type'] = question_type;
				test_info['q_difficulty'] = question_difficulty;
				test_info['section_id'] = section_idT;
				test_info['q_count'] = question_count;
				test_info['type_name'] = $('.active_nav .tongbu_span').text();
				test_info['zhuanti_name'] = selectZhuantiName;
				test_info['study_exercise_id'] = study_exercise_idT;
				 
				window.location.href = './exercise_zhuanti_do.html?test_info='+Base64.encode(JSON.stringify(test_info));
			});
		}else{
		  layer.alert('初中,高中才有专题!',9,'温馨提示',function(){
			  window.location.href = 'Index.html';	
		  });	
	  	}
	 }else{
		window.location.href = "../index.html";
	} 
});

 