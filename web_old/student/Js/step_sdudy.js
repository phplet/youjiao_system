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
		layer.use('extend/layer.ext.js');
		 
		var selectZhuantiID = 0;
		var selectSubjectID = 0;
		var selectZhuantiName = "";
		var study_exercise_idT = "";
		 
		var pageType = 'zhuanti';
		 
		//学段id		 
		 
		section_idT = grade_ch_section(UserInfo.grade_id);
	 
	    if(section_idT==2||section_idT==3){
			//初始化成功后，建立专题列表
			exerciseHandler.query('nav' , {type:pageType,'section_id':section_idT} , function(flag , data){
				var label = {'zhenti':'真题','zhuanti':'步调学习'};
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
					'section_id':section_idT,
					'exam_type':'7,9'
				};
				exerciseHandler.query(pageType ,  queryData , function(flag , data){
					if(flag){
						$('.content_element_z:not("#content_element_template")').remove();
						for(var i in data[pageType]){
							var template = $('#content_element_template').clone();
							template.attr('id' , null).attr(pageType+'_id' , data[pageType][i].id).appendTo('.content_center_01');
							template.find('#zhuanti_num').html((parseInt(i)+1));
							template.find('.title_label_z').text(cutString(data[pageType][i].name,13).cutstring);
							template.find('.title_label_z').attr("title",data[pageType][i].name);
							 
							/*if(data[pageType][i].zhuanti_do_num!=0&&data[pageType][i].zhuanti_do_num!=null){
								template.find('.main_done').show();
								
								//template.find('.last_nums').text(data[pageType][i].zhuanti_do_num);
								//template.find('.now_nums').text('2');
							}else{
								template.find('.main_done').attr('style',"");
								//template.find('.main_done').css('visibility','hidden');
							}*/
							 
							if(data[pageType][i].do_exam_info[9]!=0){
								if(data[pageType][i].do_exam_info[9].exam_count!=0){
									template.find('.study_jxxx').show();
									template.find('#main_done').html(step_QB(data[pageType][i].test_level));
									template.find('.zhuanti_enter').attr('sum_count',data[pageType][i].do_exam_info[9].exam_count);	
								}else{
									template.find('.study_jxxx').hide();
									template.find('#main_done').html('--');
									template.find('.zhuanti_enter').attr('sum_count',0);	
								}
								
								template.find('.study_kslx').text('再评测');
								 
							}else{
								template.find('.study_jxxx').hide();
								template.find('.study_kslx').text('评测');
								template.find('#main_done').html("--");
								template.find('.zhuanti_enter').attr('sum_count',0);
							}
							 
							if(data[pageType][i].exercise_history[9]!=0){  //测评
								 
								if(data[pageType][i].exercise_history[9][0].study_exercise_id!=0){
									template.find('.study_jzlx').show();	
									template.find('.study_jzlx').attr('study_exercise_id',data[pageType][i].exercise_history[9][0].study_exercise_id);
								}else{
									template.find('.study_jzlx').hide();
								}
							}else{
								template.find('.study_jzlx').hide();
								
							}
							
							if(data[pageType][i].exercise_history[7]!=0){  //学习
								template.find('.study_xxpg').show();
								template.find('.study_jxxx').attr('study_exercise_id',data[pageType][i].exercise_history[7][0].study_exercise_id);
								if(data[pageType][i].do_exam_info[7].exam_count!=0){
									template.find('.img_xxdj').html('<img  src="images/big_0'+data[pageType][i].study_level+'.png" />');	
									template.find('.study_jxxx').attr('test_level',data[pageType][i].study_level);
								}else{
									template.find('.img_xxdj').html('<img  src="images/big_0.png" />');	
									template.find('.study_jxxx').attr('test_level',data[pageType][i].test_level);
								}
								
							}else{
								template.find('.study_jxxx').attr('study_exercise_id',0);
								template.find('.study_jxxx').attr('test_level',data[pageType][i].test_level);
								template.find('.study_xxpg').hide();
								
								
							}
							var difficulty_user_count = data[pageType][i].difficulty_user_count;
							var dff_counthtmls = '';
							if(difficulty_user_count!=null&&difficulty_user_count!=""){
								    
									$.each(difficulty_user_count,function(i_c,n_c){
										dff_counthtmls += '<span><img src="images/dj_0'+n_c.level+'.png"><br>'+n_c.num+'人</span>';
									});
								 
								 	template.find('.study_xxpg').attr("json_person",Base64.encode(JSON.stringify(difficulty_user_count)));
								
							}else{
								dff_counthtmls = '<span><img src="images/dj_05.png"><br>0人</span><span><img src="images/dj_04.png"><br>0人</span><span><img src="images/dj_03.png"><br>0人</span><span><img src="images/dj_02.png"><br>0人</span><span><img src="images/dj_01.png"><br>0人</span>';	
							}
							template.find('.budiao_map').html(dff_counthtmls);	
							template.find('.zhuanti_enter').attr('exercise_id',data[pageType][i].id);
							
							template.find('.zhuanti_enter').attr('section_id',data[pageType][i].section_id);
							template.find('.study_kslx').attr('current_level',data[pageType][i].test_level);
							template.find('.study_jzlx').attr('current_level',data[pageType][i].test_level);
							template.find('.study_kslx').attr('study_exercise_id',0);
							 
							
							
							var study_ex_id = 0;
							if(data[pageType][i].exercise_history[0]){
							 if(data[pageType][i].exercise_history[0]!=undefined&&data[pageType][i].exercise_history[0]!=0&&data[pageType][i].exercise_history[0]!=""){
								 study_ex_id = data[pageType][i].exercise_history[0].study_exercise_id;
								 if(study_ex_id!=""&&study_ex_id!=undefined){
									
								 }else{
									study_ex_id = 0;
								}
							 }
							}
							 
							 
							template.show();
						}
					}else{
						layer.alert('加载专题失败！', 8,'温馨提示');
						 
					}
					
				});
			});
			
			$('#my_BJ').click(function(){
				var subject_idTBJ = $('.active_nav').attr('subject_id');
				var test_info_note = {};
				test_info_note['subject_id'] = parseInt(subject_idTBJ);
				test_info_note['section_id'] = section_idT;
				window.location.href = './stu_note.html?test_info='+Base64.encode(JSON.stringify(test_info_note)); 
				 
			});
			
			//监听点击进入专题按钮
			$(document).delegate('.zhuanti_enter','click',function(){
				selectZhuantiID = $(this).attr('exercise_id');
				
				selectZhuantiName = $(this).parents('.content_element_z').find('.title_label_z').attr('title');
				study_exercise_idT = $(this).attr('study_exercise_id');
				var  Qtype = $(this).attr('Qtype');
				 
				var test_info = {};
				test_info['zhuanti_id'] = selectZhuantiID;
				test_info['sum_count'] = $(this).attr("sum_count");
				test_info['subject_id'] = parseInt(selectSubjectID);
				test_info['section_id'] = section_idT;
				test_info['zhuanti_name'] = selectZhuantiName;
				test_info['study_exercise_id'] = study_exercise_idT;
				test_info['q_type'] = 1;  //1是客观题 2是主观题
				//q_difficulty和等级的关系 A = 5 B = 4 C = 3 D = 2 E = 1
				
				test_info['q_count'] = 10;
				test_info['type_name'] = $('.active_nav .tongbu_span').text();
				test_info['Qbuttype'] = Qtype;
				if(Qtype=='ping'){
					 
					test_info['q_count'] = 20;
					test_info['q_difficulty'] = $(this).attr("current_level");
					test_info['test_level'] = parseInt($(this).parents('div.budiao_list').find('.img_xxdj img').attr("src").split('.png')[0].substring(11));
					
					window.location.href = './step_sdudy_do.html?test_info='+Base64.encode(JSON.stringify(test_info)); 
				}else if(Qtype=='on_ping'){
					test_info['q_count'] = 20;
					test_info['q_difficulty'] = $(this).attr("current_level");
					test_info['test_level'] = parseInt($(this).parents('div.budiao_list').find('.img_xxdj img').attr("src").split('.png')[0].substring(11));
					window.location.href = './step_sdudy_do.html?test_info='+Base64.encode(JSON.stringify(test_info)); 
				}else if(Qtype=='on_study'){
					test_info['q_count'] = 10;
					test_info['test_level'] = 0;
					test_info['q_difficulty'] = $(this).attr("test_level");
					//test_info['q_difficulty'] = 5;
					window.location.href = './step_sdudy_do.html?test_info='+Base64.encode(JSON.stringify(test_info)); 
				}else if(Qtype=='pinggu'){
					
					 layer.tab({
						 
						shade : [0.5 , '#696969' , true],
						offset : ['220px' , '50%'],
						border : [10 , 0.3 , '#000', true],
						area: ['600px', '400px'], //宽度，高度
						data:[
							{title: '学习步伐统计', content:'<div class="pinggu_pad" id="pinggu_study" style="width:560px; height:300px;"></div>'}, 
							{title: '等级人数统计', content:'<div class="pinggu_pad" id="pinggu_person" style="width:560px; height:320px;"></div>'}
						]
						
					});
					
					 
					var ti_urlT = '/exercise_query?r='+$.getRom();
					var ti_jsonT = {'action':'get_student_study_level','user_id':UserInfo.id,'exam_id':selectZhuantiID,'subject_id':parseInt(selectSubjectID),'section_id':section_idT,'pageno':1 ,'countperpage':10};
					var tires_flagT = Ajax_option(ti_urlT,ti_jsonT,"GET",false);
					if(tires_flagT.list!=null&&tires_flagT.list!=""){
						var x_json = [];
						var datajson = [];
						$.each(tires_flagT.list,function (dj_i,dj_c){
							 x_json.push(dj_c.create_date.substring(0,10));
							 datajson.push({"y":parseInt(dj_c.level),"name":dj_c.create_date.substring(0,10),'x_name':step_QFD(dj_c.level)});
						});
						
						stu_dj_chart(x_json,datajson);
					}
					var person_nums = [];
					
					var person_nums_list = $.parseJSON(Base64.decode($(this).attr('json_person')));
					$.each(person_nums_list,function(js_i,js_n){
						person_nums.push(parseInt(js_n.num));
					}); 
					
					web_dj_chart(selectZhuantiName, person_nums);
					
					//window.location.href = './step_note.html?test_info='+Base64.encode(JSON.stringify(test_info)); 
				}
				
				
				
				
				
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


function stu_dj_chart(x_json ,datajson){
	//$('#pinggu_study')
	$('#pinggu_study').highcharts({
		title: {
			text: false 
		}, 
		xAxis: {
			categories: x_json
		},
		yAxis: {
			min:0,
			max:5, 
			title: {
				text: '学习等级'
			},
			tickInterval:1, 
			labels:{ 
				formatter:function(){
					if(this.value ==1) {
					
						return "E";
					
					}else if(this.value ==2) {
					
						return "D";
					
					}else if(this.value ==3) {
					
						return "C";
					
					}else if(this.value ==4) {
					
						return "B";
					
					}else if(this.value ==5) {
					
						return "A";
					
					}else{
						return 0;	
					}
				}
			},
			plotLines: [{
				value: 0,
				width: 1,
				color: '#808080'
			}]
		},
		tooltip: {
			 
			pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.x_name}等级</b><br/>', 
			shared: true
		},
		legend: {
			layout: 'vertical',
			align: 'center',
			verticalAlign: 'bottom',
			borderWidth: 0
		},credits: {
			enabled: false
		},
		exporting:{ 
                     enabled:false //用来设置是否显示‘打印’,'导出'等功能按钮，不设置时默认为显示 
                },
		series: [{
			name: '学习等级',
			data: datajson
		}]
	});
}

function web_dj_chart(title_name, person_nums){
	 
	//$('#pinggu_person')	
	$('#pinggu_person').highcharts({
		chart: {
			type: 'column',
			spacingBottom: 30
		},
		
		title: {
			text: '全网等级人数统计'
		},
		 
		xAxis: {
			categories: ['A等级','B等级','C等级','D等级','E等级']
			 
		},
		yAxis: {
			title: {
				text: '人数'
			},
			allowDecimals:false,
			labels: {
				formatter: function() {
					return this.value+'人';
				}
			}
		},
		
		tooltip: {
			pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}人</b><br/>',
			shared: true
		},
		plotOptions: {
			area: {
				fillOpacity: 0.7
				
			}
		},
		credits: {
			enabled: false
		},
		exporting:{ 
                     enabled:false //用来设置是否显示‘打印’,'导出'等功能按钮，不设置时默认为显示 
        },
		series: [{
			name: title_name, 
			data: person_nums
		}]
	});
}

 