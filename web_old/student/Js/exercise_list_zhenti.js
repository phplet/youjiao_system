var province_years_id = [];
var pageType = '';
var selectSubjectID = '';
var hrefParams = '';
var UserInfo =[];
var section_idT = '';
var limit = 0;
var data_examtemp = {};
function getHrefParams(){
	var param = {};
	var _p=window.location.href.split('?')[1];
	
	if(!_p){
		_p = [];
	}else{
		_p = _p.split('&');
	}
	for(var i in _p){
		var tmp = _p[i].split('=');
		param[tmp[0]] = tmp[1];
	}
	return param;
}


$(document).ready(function(){
	
	var exerciseHandler = window.exerciseHandler;
	var selectZhuantiID = 0;
	selectSubjectID = 0;
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	if(UserInfo!=null&&UserInfo!=undefined){
		data_examtemp = getUrlParam('data_exam');
		
		
		var nick =  UserInfo.nick;
			 
		if (UserInfo.realname != null&&UserInfo.realname!="") {
				$('#headusername').text(UserInfo.realname);
		}else if(nick!=null&&nick!=""){
				$('#headusername').text(nick);
		}
		
		limit =12;  //显示的条数
	 
		section_idT = grade_ch_section(UserInfo.grade_id);
		if(section_idT==2||section_idT==3){
		
			pageType = window.location.href.split('?')[0].split('/').pop().split('.')[0].split('_')[1];
			
			//初始化成功后，建立专题列表
			 
			 
			exerciseHandler.query('nav', {type:pageType,'section_id':section_idT,'limit':limit,'user_id':$.cookie("UsersId")} , function(flag , data){
				var label = {'zhenti':'真题','zhuanti':'专题'};
				if(flag){
					for(var i in data.subject){
		//							console.log(data.subject[i]);	 
							$('#nav_element_template').clone().html('<span class="disp_s"><span class="tongbu_span icon_33_33 web_icon_'+data.subject[i].subject_id+'_33"></span><span class="tongbu_span">&nbsp;'+data.subject[i].grade_name+''+data.subject[i].subject_name+label[pageType]+'</span><span class="cleard"></span></span>')
						.appendTo('.content_left').attr({'id':null,'subject_id':data.subject[i].subject_id}).show();
						$(".content_left div").eq((i+1)).addClass();
					}
					
					//临时保存内容的处理
					if(data_examtemp!=null&&data_examtemp!=""){
						var sstemp = $.parseJSON(Base64.decode(data_examtemp));
						$(".content_left div").eq(parseInt(sstemp.subject_id)).trigger("click");
					}else{
						$(".content_left div").eq(1).trigger("click");
					}
					
				}else{
					layer.alert('初始化失败！', 8,'温馨提示');
					 
				}
			});
			 
			
			//监听点击左侧导航
			$(document).delegate('.nav_element','click',function(){
				
				selectSubjectID = $(this).attr('subject_id');
				if(data_examtemp!=null&&data_examtemp!=""){
					var sstemp = $.parseJSON(Base64.decode(data_examtemp));
					if(sstemp.subject_id!=selectSubjectID){
						data_examtemp=null;
					}	
				}
				$(this).parent().children().each(function(ii, es) {
					$(es).attr('class','nav_element');
				});
				
				$(this).addClass('active_nav');
				hrefParams = getHrefParams();
				 
				hrefParams['type'] = hrefParams['type'] ? hrefParams['type'] : 1;
				//省份赋值
				setProValue(selectSubjectID,section_idT);
			 
			});
			
			//监听点击进入专题按钮
			$(document).delegate('.zhuanti_enter','click',function(){
				$('.exercise_setting').show();
				
				if(pageType == 'zhenti'){
					window.location.href = 'exercise_'+pageType+'_do.html?'+pageType+'_id='+$(this).attr('exercise_id')+'&subject_id='+selectSubjectID+'&study_exercise_id='+$(this).attr('study_exercise_id')+'&section_id='+section_idT;
				}else{
					
				}
				
				selectZhuantiID = $(this).attr('exercise_id');
				
			});
			
			$('.cancel_exercise').click(function(){
				$('.exercise_setting').hide();
			});
			
			$('.begin_exercise').click(function(){
				
				var question_type = $('.exercise_question_type').val();
				var question_difficulty = $('.exercise_difficulty').val();
				var question_count = $('.exercise_count').val();
				
				var href = 'exercise_'+pageType+'_do.html?'+pageType+'_id='+selectZhuantiID+'&subject_id='+selectSubjectID+
									'&q_type='+question_type+'&q_difficulty='+question_difficulty+'&q_count='+question_count;
				window.location.href = href;
				
			});
		}else{
			layer.alert('初中,高中才有历年真题!',9,'温馨提示',function(){
				window.location.href = 'Index.html';	
			});	
		}
	}else{
		window.location.href = "../index.html";
	}  
});


function active_year(val){
	var pp = '';
	if(val.substring(0,3)=='pro'){
		 pp = 'actived_P';
		 var val_TT = val.substring(4,val.length);
		 $('#'+val).parent().parent().children().each(function(index, element) {
			$(element).attr("class","");
		});
		$('#'+val).parent().attr("class",pp);
		 setYearValue(val_TT);
	}else{
		pp = 'actived_Y';
		$('#'+val).parent().parent().children().each(function(index, element) {
			$(element).attr("class","");
		});
		$('#'+val).parent().attr("class",pp);
		setListValues ();
	}
	
}

function setYearValue(pr_value){
	 
	var year_htmls = '<li>年份：</li><li class="actived_Y"><a href="javascript:void(0);" onClick="active_year(\'year_00\')" id="year_00">不限</a></li>';
	if(data_examtemp!=null&&data_examtemp!=""){
		 
		year_htmls = '<li>年份：</li><li><a href="javascript:void(0);" onClick="active_year(\'year_00\')" id="year_00">不限</a></li>';
	}
	if(pr_value!='00'){
		$.each(province_years_id,function(i,e){
			if(pr_value==e.id){
				if(data_examtemp!=null&&data_examtemp!=""){
					var sstemp = $.parseJSON(Base64.decode(data_examtemp));
					$.each(e.year,function(ii,ee){
						var yearST = ee.year;
						if(parseInt(yearST.substring(0,yearST.length-1))==parseInt(sstemp.year)){
							year_htmls += '<li  class="actived_Y"><a href="javascript:void(0);" onClick="active_year(\'year_'+yearST.substring(0,yearST.length-1)+'\')" id="year_'+yearST.substring(0,yearST.length-1)+'">'+yearST+'</a></li>';
						}else{
							year_htmls += '<li><a href="javascript:void(0);" onClick="active_year(\'year_'+yearST.substring(0,yearST.length-1)+'\')" id="year_'+yearST.substring(0,yearST.length-1)+'">'+yearST+'</a></li>';
						}
						
					});
				}else{
					$.each(e.year,function(ii,ee){
						var yearST = ee.year;
						year_htmls += '<li><a href="javascript:void(0);" onClick="active_year(\'year_'+yearST.substring(0,yearST.length-1)+'\')" id="year_'+yearST.substring(0,yearST.length-1)+'">'+yearST+'</a></li>';
					});
				}
			}
		});
	 
	}else{
		var yearst= [];
		 
		$.each(province_years_id,function(i,e){
			$.each(e.year,function(ii,ee){
				yearst.push(ee.year);
			});
		});
		 
		var yearsttt = unique(yearst);
		yearsttt = yearsttt.sort(function(a,b){return a<b?1:-1});
		 
		$.each(yearsttt,function(iii,eee){
			year_htmls += '<li><a href="javascript:void(0);" onClick="active_year(\'year_'+eee.substring(0,eee.length-1)+'\')" id="year_'+eee.substring(0,eee.length-1)+'">'+eee+'</a></li>';
		});
	}
	$('#yearli_list').html(year_htmls);
	setListValues ();
}

function setProValue(selectSubjectID,sectionID){
	exerciseHandler.public_ajax('province',{'action':'list','subject_id':selectSubjectID,'section_id':sectionID},'GET',function(flag , data){
			var stss = '00';
			var pro_htmls = '<li>省份：</li><li class="actived_P"><a onClick="active_year(\'pro_00\')" id="pro_00" href="javascript:void(0);">不限</a></li>';
			if(data_examtemp!=null&&data_examtemp!=""){
				var sstemp1 = $.parseJSON(Base64.decode(data_examtemp));
				stss = sstemp1.province_id; 
				pro_htmls = '<li>省份：</li><li><a onClick="active_year(\'pro_00\')" id="pro_00" href="javascript:void(0);">不限</a></li>';
			}else{
				stss = '00';
				pro_htmls = '<li>省份：</li><li class="actived_P"><a onClick="active_year(\'pro_00\')" id="pro_00" href="javascript:void(0);">不限</a></li>';	
			}
			
			
			if(flag){
				
				province_years_id = [];
				$.each(data,function(ii,nn){
					
					if(nn.year!=null&&nn.year!=""){
						province_years_id.push(nn);
					}
				});
				
			 
			}
			
			 
			if(data_examtemp!=null&&data_examtemp!=""){
				var sstemp = $.parseJSON(Base64.decode(data_examtemp));
				
				$.each(province_years_id,function(iii,nnn){
					if(nnn.id==sstemp.province_id){
						pro_htmls += '<li class="actived_P"><a   onClick="active_year(\'pro_'+nnn.id+'\')" id="pro_'+nnn.id+'" href="javascript:void(0);">'+nnn.name+'</a></li>';
					}else{
						pro_htmls += '<li><a onClick="active_year(\'pro_'+nnn.id+'\')" id="pro_'+nnn.id+'" href="javascript:void(0);">'+nnn.name+'</a></li>';
					}
				}); 
			}else{
				$.each(province_years_id,function(iii,nnn){
					pro_htmls += '<li><a onClick="active_year(\'pro_'+nnn.id+'\')" id="pro_'+nnn.id+'" href="javascript:void(0);">'+nnn.name+'</a></li>';
				}); 	
			}
			$('#proviceli_list').html(pro_htmls);
			setYearValue(stss);
		});	
}

function setListValues (){
	
	var provice_SP = $('.actived_P a').attr('id');
	
	var year_SY = $('.actived_Y a').attr('id');
	
	var queryData = {
		subject : selectSubjectID,
		type : hrefParams.type,
		section_id:section_idT,
		'limit':limit,
		'user_id':$.cookie("UsersId")
	};
	if(provice_SP!='pro_00'){
		queryData['provice']=provice_SP.substring(4,provice_SP.length);
	}else{
		queryData['provice']=0;	
	}
	if(year_SY!='year_00'){
		queryData['year']=year_SY.substring(5,year_SY.length);
	}else{
		queryData['year']="";
	}
	
	exerciseHandler.query(pageType ,  queryData , function(flag , data){
//			console.log(data);
		if(flag){
			 
			for(var i in data.history_score){
				for(var j in data.new_zhenti){
					if(data.history_score[i].exercise_id == data.new_zhenti[j].id){
						data.new_zhenti[j].last_score = data.history_score[i].my_score;
						break;
					}
				}
			}
			
			$('.content_element_zt:not("#content_element_template")').remove();
			
			//新的
			for(var i in data.new_zhenti){
				var template = $('#content_element_template').clone();
				template.attr('id' , null).attr(pageType+'_id' , data.new_zhenti[i].id).appendTo('.content_new .content_list');

				template.find('.title_label').text((data.new_zhenti[i].name.length>26)?(data.new_zhenti[i].name.substring(0,26)+' ...'):data.new_zhenti[i].name);
				 template.find('.zhuanti_enter').attr('exercise_id',data.new_zhenti[i].id);
				 var study_ex_id = 0;
				 if(data.new_zhenti[i].do_exam_info==0){
					 if(data.new_zhenti[i].exercise_history!=0){
						 study_ex_id = data.new_zhenti[i].exercise_history[0].study_exercise_id;
						 if(study_ex_id!=0){
							//我来试试 接着上次做 再来试试 重新试试 
							// flag_lets flag_catch flag_again flag_anew
							template.find('.flag_lets').hide();
							template.find('.flag_again').hide();
							template.find('.flag_catch').show();
							template.find('.flag_anew').show(); 
							template.find('.flag_catch').children('.zhuanti_enter').attr('study_exercise_id',study_ex_id);
							template.find('.flag_anew').children('.zhuanti_enter').attr('study_exercise_id',0);
							//接着上次做
							//重新试试
						 }else{
							//我来试试
							study_ex_id = 0;
							template.find('.flag_lets').show();
							template.find('.flag_again').hide();
							template.find('.flag_catch').hide();
							template.find('.flag_anew').hide();
							template.find('.flag_lets').children('.zhuanti_enter').attr('study_exercise_id',0);
						 }
					 }else{
						 study_ex_id = 0;
						 template.find('.flag_lets').show();
						 template.find('.flag_again').hide();
						 template.find('.flag_catch').hide();
						 template.find('.flag_anew').hide();
						 template.find('.flag_lets').children('.zhuanti_enter').attr('study_exercise_id',0);
					 }
				 }else{
					if(data.new_zhenti[i].exercise_history!=0){
						 study_ex_id = data.new_zhenti[i].exercise_history[0].study_exercise_id;
						 if(study_ex_id!=0){
							 
							template.find('.flag_lets').hide();
							template.find('.flag_again').hide();
							template.find('.flag_catch').show();
							template.find('.flag_anew').show(); 
							template.find('.flag_catch').children('.zhuanti_enter').attr('study_exercise_id',study_ex_id);
							template.find('.flag_anew').children('.zhuanti_enter').attr('study_exercise_id',0);
						 }else{
							//再来试试
							study_ex_id = 0;
						    template.find('.flag_lets').hide();
						    template.find('.flag_again').show();
						    template.find('.flag_catch').hide();
						    template.find('.flag_anew').hide();
						    template.find('.flag_again').children('.zhuanti_enter').attr('study_exercise_id',0);
						 }
					 }else{
						 //再来试试
						 study_ex_id = 0;
						 template.find('.flag_lets').hide();
						 template.find('.flag_again').show();
						 template.find('.flag_catch').hide();
						 template.find('.flag_anew').hide();
						 template.find('.flag_again').children('.zhuanti_enter').attr('study_exercise_id',0);
					 }	 
				 }
				 
				
				if(data.new_zhenti[i].last_score){
					template.find('.last_score').text(data.new_zhenti[i].last_score);
					template.find('.main_done').show();
				}
				
				template.show();
			}
			
			 
			if(data.hot_exercise!=null&&data.hot_exercise!=""){
				//做过最多的
				for(var i in data.hot_exercise){
					
					var template = $('#content_element_template').clone();
					template.attr('id' , null).attr(pageType+'_id' , data.hot_exercise[i].id).appendTo('.content_hot .content_list');
	
					template.find('.title_label').text((data.hot_exercise[i].name.length>26)?(data.hot_exercise[i].name.substring(0,26)+' ...'):data.hot_exercise[i].name);
					template.find('.zhuanti_enter').attr('exercise_id',data.hot_exercise[i].id);
					
					if(data.hot_exercise[i].last_score){
						template.find('.last_score').text(data.hot_exercise[i].last_score);
						template.find('.main_done').show();
					}
					
					template.show();
					
				}
				var leftCount = data.hot_exercise.length<=5 ? data.hot_exercise.length : 5;
				for(var i = 0 ; i < leftCount ; i++){
					
					var template = $('#content_element_template').clone();
					template.attr('id' , null).attr(pageType+'_id' , data.new_zhenti[i].id).appendTo('.content_hot .content_list');
					template.find('.title_label').text((data.new_zhenti[i].name.length>26)?(data.new_zhenti[i].name.substring(0,26)+' ...'):data.new_zhenti[i].name);
					template.find('.zhuanti_enter').attr('exercise_id',data.new_zhenti[i].id);
					if(data.new_zhenti[i].last_score){
						template.find('.last_score').text(data.new_zhenti[i].last_score);
						template.find('.main_done').show();
					}
					
					template.show();
				}
			
			 
			}
			//我做过的
			for(var i in data.history_exercise){
				var template = $('#content_element_template').clone();
				template.attr('id' , null).attr(pageType+'_id' , data.history_exercise[i].id).appendTo('.content_done .content_list');

				template.find('.title_label').text(data.history_exercise[i].name);
				template.find('.zhuanti_enter').attr('exercise_id',data.history_exercise[i].id);
				
				if(data.history_exercise[i].last_score){
					template.find('.last_score').text(data.history_exercise[i].last_score);
					template.find('.main_done').show();
				}
				
				template.show();
			}
			 
			 
			
		}else{
			layer.alert('加载专题失败！', 8,'温馨提示');
			 
		}
		
	});	
}; 

//遍历重复的数组
function unique(arr) {  
	var temp = {}, len = arr.length;

	for(var i=0; i < len; i++)  {  
		if(typeof temp[arr[i]] == "undefined") {
			temp[arr[i]] = 1;
		}  
	}  
	arr.length = 0;
	len = 0;
	for(var i in temp) {  
		arr[len++] = i;
	}  
	return arr;  
}