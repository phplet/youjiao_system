// JavaScript Document
var UserInfo=null;
var centerAll=null;
var temp_test ={};
var question_listsTemp = [];
var ability_listsTemp = [];
var ping_listsTemp = [];
var person_listsTemp = {};
var test_info_temp = {};
var tr_id = "";
$().ready(function() {
    UserInfo = $.evalJSON($.cookie("UserInfo"));
	centerAll = $.evalJSON($.cookie("centerAll"));
	
	temp = getUrlParam('temp_test');
	tr_id = getUrlParam('tr_id');
	$('#ping_demo_win').hide();
	if(temp!=""&&temp!=undefined&&temp!=null){   
		temp_test = $.parseJSON(Base64.decode(temp));
		//test_name  stuReal_name  stusubject_name  stucreate_date
		//{'testname':nn.name,'center_id':n.center_id,'zone_id':n.zone_id,'exam_type':6,'subject_id':nn.subject_id,'realname':n.realname,'user_id':n.user_id,'create_date':n.create_date};
		$('#test_name').html(temp_test.testname);
		$('#stuReal_name').html(temp_test.realname);
		$('#stusubject_name').html(subject_sum(temp_test.subject_id));
		$('#stucreate_date').html(temp_test.create_date);
		question_Lists(temp_test.study_exercise_id); 
		ablity_Lists(temp_test.center_id,temp_test.zone_id,temp_test.subject_id); //能力维度列表
		ping_types (temp_test.center_id,temp_test.zone_id); //评语类型列表
		person_info(temp_test.center_id,temp_test.zone_id);
		$('#edit_report_s').hide();
		$('#save_report_s').show();
	}else if(tr_id!=""&&tr_id!=undefined&&tr_id!=null){
		edit_report(tr_id);
		$('#edit_report_s').show();
		$('#save_report_s').hide();
	}
	
});

//study_exercise_id   user_id  

//试题的列表
function question_Lists(study_exercise_id){
	var url_type ='/exercise_query';
	var Qjson = {'action':'exercise_detail','study_exercise_id':study_exercise_id};
	var flag_res = Ajax_option(url_type,Qjson,"GET");
	if(flag_res.exam.exam_info!=null){
		$('#diffcuty_id').html(flag_res.exam.exam_info.difficulty);
	}
	if(flag_res.exercise!=null){
		
		$('#scores').html(flag_res.exercise.my_score);
		$('#tests_times').html(flag_res.exercise.duration==null?'0':flag_res.exercise.duration+'秒');
		
	}
	//var content = [{"answer":"B","id":"drj10000628","obj":"1","dbtype":"1","score":0,"attachment":"","pi":""},{"answer":"D","id":"drj10000629","obj":"1","dbtype":"1","score":0,"attachment":"","pi":""},{"answer":"asdasdsadsadsadasdasdas","id":"drj10000634","obj":"0","dbtype":"1","score":0,"attachment":"","pi":"","obj_Judge":"1"},{"answer":"asdasdasdasdasdasdasdas","id":"drj10000636","obj":"0","dbtype":"1","score":0,"attachment":"","pi":"","obj_Judge":"2"}];
	question_listsTemp = [];
	var exercise_content = $.parseJSON(Base64.decode(flag_res.exam.exercise_content));
	var right_nums = 0;
	var wrong_nums = 0;
	var htmls_que = '<tr align="center"><td>题号</td><td>题目</td><td>考查知识点</td><td>难易度</td><td>主客观题</td><td>正确答案</td><td>学生答案</td><td>对错</td><td>全网正确率</td></tr>';
	$.each(exercise_content,function(i,n){
		var question_oneJson = {};
		$.each(flag_res.exam.exam_list,function(ii,nn){
			if(n.id==nn.gid){
				$('#question_text_contentcut').html(nn.content);
				var nn_content_cut =  $('#question_text_contentcut').text();
				
				if(nn_content_cut.length>20){ 
					nn_content_cut = $.trim($('#question_text_contentcut').text()).substring(0,20);	
				}else{
					nn_content_cut = $.trim($('#question_text_contentcut').text());
				}
				htmls_que += '<tr><td align="center">'+(i+1)+'</td><td>'+nn_content_cut+'</td><td>'+nn.zh_knowledge+'</td><td align="center">'+difficuty_sum(nn.difficulty)+'</td>'
				question_oneJson['id'] = n.id;
				question_oneJson['num'] = (i+1);
				question_oneJson['content'] = nn.content;
				question_oneJson['zh_knowledge'] = nn.zh_knowledge;
				question_oneJson['knowledge_id'] = nn.knowledge_id;
				question_oneJson['section_id'] = nn.section_id;
				question_oneJson['difficulty'] = difficuty_sum(nn.difficulty);
				if(n.obj==1){
					htmls_que += '<td align="center">客观</td><td>'+nn.objective_answer+'</td><td>'+n.answer+'</td>';
					question_oneJson['obj_name'] = '客观';
					question_oneJson['que_answer'] = nn.objective_answer;
					question_oneJson['stu_answer'] = n.answer;
					if(n.answer==nn.objective_answer){
						htmls_que += '<td align="center">对</td>';
						question_oneJson['answer_flag'] = '对';
						right_nums++;
						
					}else{
						htmls_que += '<td align="center">错</td>';
						question_oneJson['answer_flag'] = '错';
						wrong_nums++;
					}
				}else{
					htmls_que += '<td align="center">主观</td><td >'+nn.answer.substring(0,20)+'</td><td>'+n.answer.substring(0,20)+'</td>';
					question_oneJson['obj_name'] = '主观';
					question_oneJson['que_answer'] = nn.answer;
					question_oneJson['stu_answer'] = n.answer;
					if(n.obj_Judge==1){
						htmls_que += '<td align="center">对</td>';
						question_oneJson['answer_flag'] = '对';
						right_nums++;	
					}else if(n.obj_Judge==2){
						htmls_que += '<td align="center">半对</td>';
						question_oneJson['answer_flag'] = '半对';
						right_nums = right_nums+0.5;
						wrong_nums = wrong_nums+0.5;
					}else {
						htmls_que += '<td align="center">错</td>';
						question_oneJson['answer_flag'] = '错';
						wrong_nums++;
					}
				}
				var accuracy_num = '--';
				if(nn.online_level!=null){
					accuracy_num = parseFloat(nn.online_level).toFixed(2)+'%';
				}
				htmls_que += '<td align="center"><span  id="edit_Q_'+n.id+'">'+accuracy_num+'</span>&nbsp;&nbsp;<a href="javascript:void(0);" onclick="change_right(\''+n.id+'\')">改</a></td></tr>';
				question_oneJson['accuracy_num'] = accuracy_num;
			}
		});
		question_listsTemp.push(question_oneJson);
	});
	 
	$('#que_list').html(htmls_que);
	$('#right_sum').html(right_nums);
	$('#wrong_sum').html(wrong_nums);	
	
	       
}

//学习能力维度查询
function ablity_Lists(center_id,zone_id,subject_id){
	var url_type ='/ability';
	var Qjson = {'action':'list','center_id':center_id,'zone_id':zone_id,'subject_id':subject_id};
	var flag_res = Ajax_option(url_type,Qjson,"GET");
	
	if(flag_res.list!=null){
		ability_listsTemp = flag_res.list;
		var ability_htmls = '<tr><td>能力维度</td><td>能力维度简述</td><td>选择相应等级</td><td>等级说明</td></tr>';
		$.each(flag_res.list,function(i,n){
			ability_htmls += '<tr><td>'+n.ability_name+'</td><td>'+n.instruction+'</td><td><input type="radio" name="ablity_'+n.id+'" value="A"/> A<input type="radio" name="ablity_'+n.id+'"  value="B"/> B<input type="radio" name="ablity_'+n.id+'" value="C" /> C</td><td>A：'+n.a_level+'&nbsp;B：'+n.b_level+'&nbsp;C：'+n.c_level+'</td></tr>';	
		});
	}
	$('#ablity_list').html(ability_htmls);
}

//评测标语类型
function ping_types (center_id,zone_id){
	var url_types ='/test_comment';
	var Qjsons = {'action':'get_test_comment','center_id':center_id,'zone_id':zone_id};
	var flag_resT = Ajax_option(url_types,Qjsons,"GET");	
	ping_listsTemp = [];
	var slogan_htmls = '';
	if(flag_resT.list!=null){
		$.each(flag_resT.list,function(i,n){
			ping_listsTemp.push({'id':n.id,'typename':n.name});
			slogan_htmls += '<div style="padding:10px; border:#CCC solid 1px; margin-top:20px;"><div style="color:#008000; font-size:12px;">'+n.name+'</div><div style="padding-bottom:10px;padding-left:25px;"><span style="float:left;"><span style="color:#333; font-size:12px;">是否忽略</span>&nbsp;<input name="slogan_'+n.id+'" type="radio" value="1" checked="checked" onclick="re_show(\'slogan_content_'+n.id+'\');"/>&nbsp;不忽略&nbsp;<input name="slogan_'+n.id+'" type="radio" value="0" onclick="re_hidding(\'slogan_content_'+n.id+'\');"/>&nbsp;忽略&nbsp;</span><span id="slogan_'+n.id+'" style="float:right"><a class="easyui-linkbutton l-btn" onclick="choose_demo('+n.id+');"><span class="l-btn-left"><span class="l-btn-text">选择模板</span></span></a></span><span class="cleared"></span></div><table cellpadding="0" cellspacing="0" border="0" width="98%;"><tr><td><textarea id="slogan_content_'+n.id+'" style="width:100%; height:120px;"></textarea></td></tr></table></div>';	
		});
	}
	$('#slogan_list').html(slogan_htmls); 
	
}
  


//查询demo
function choose_demo(valueTemp){
	 
	var url_type ='/test_comment';
	var Qjson = {'action':'get_test_comment_detail','tcid':valueTemp};
	var flag_res = Ajax_option(url_type,Qjson,"GET");
	if(flag_res.list!=null){
		
		var fhtmlsT = ''; 
		$.each(flag_res.list,function(i,n){
			
			fhtmlsT += '<li><div class="demo_list_f">'+n.detail_content+'</div><div class="demo_list_r"><input type="checkbox" name="check_demo" /></div><div class="cleared"></div></li>';
			
		});
		
		 
		
	}else{
		fhtmlsT += '<li>此类型没有评语模板！</li>';	
	}
	
	$('#ping_demo_win').show();
	$('#ping_demo_lists').html(fhtmlsT);
	$('#ping_demo_win').dialog({
		width:600,
		height:320,
		modal:true,
		buttons:[{
			text:'确认',
			iconCls:'icon-ok',
			handler:function(){
				if($('#ping_demo_lists input:checked').length>0){
					var demo_htmls = $('#slogan_content_'+valueTemp).val();
					$('#ping_demo_lists input:checked').each(function(li_i, li_n) {
						 demo_htmls += $(this).parent().prev().html();
					});
					$('#slogan_content_'+valueTemp).val(demo_htmls);
					$('#ping_demo_win').dialog('close');
				}else{
					
					$('#ping_demo_win').dialog('close');
					$.messager.alert('温馨提示','你没有选择模板,可以自己手写内容!','info');
				}
				
			}
		  },{
			text:'取消',
			iconCls:'icon-no',
			handler:function(){
				$('#ping_demo_win').dialog('close');
			}
		  }
		]
	});
}

//更改正确率
function change_right(accuracy_id){
	$.messager.prompt('更改正确率','请输入新的正确率：(只为数字,不加“%”和“.”)',function(b){
			if(b){
				 
				var accuracy_nums = $('.messager-input').val();
				if(/^[0-9]*$/i.test(accuracy_nums)&&parseInt(accuracy_nums)<=100){
					if(accuracy_nums!=null&&accuracy_nums!=""){
						$('#edit_Q_'+accuracy_id).html(accuracy_nums+'%');		
					}
				}else{
					$.messager.alert('温馨提示','请输入数字，并且不能大于100','info');
				}
		    }
	});
	//$('.messager-icon').hide();

}

//忽略内容
function re_hidding(cssId){
	if(cssId!='ablity_list'){
		$('#slogan_'+cssId.split('_')[2]).hide();	
	}
	$('#'+cssId).hide();	
}

//忽略内容
function re_show(cssId){
	if(cssId!='ablity_list'){
		$('#slogan_'+cssId.split('_')[2]).show();	
	}
	$('#'+cssId).show();
}

//联系人信息
function person_info(center_id,zone_id){
	var url_type ='/test_comment';
	var Qjson = {'action':'get_school_info','center_id':center_id,'zone_id':zone_id};
	var flag_res = Ajax_option(url_type,Qjson,"GET");
	person_listsTemp = {};
	if(flag_res.list!=null){
		person_listsTemp['url'] = flag_res.list.url;
		person_listsTemp['contacts'] = flag_res.list.contacts;
		person_listsTemp['tel'] = flag_res.list.tel;
		person_listsTemp['address'] = flag_res.list.address;
		$('#zone_Persion').val(flag_res.list.contacts);
		$('#zone_tel').val(flag_res.list.tel);
		$('#zone_address').val(flag_res.list.address);
	}
	 
}


//修改报告
function edit_report(tr_idsT){
	var url_type ='/exercise_query';
	var Qjson = {'action':'test_report_detail','trid':tr_idsT};
	var flag_res = Ajax_option(url_type,Qjson,"GET");
	if(flag_res.list!=false){
		 
		var testjson_Temp = $.parseJSON(Base64.decode(($.parseJSON(flag_res.list)).test_data));
		$('#test_name').html(testjson_Temp.test_info.test_name);
		$('#stuReal_name').html(testjson_Temp.test_info.stuReal_name);
		$('#stusubject_name').html(testjson_Temp.test_info.stusubject_name);
		$('#stucreate_date').html(testjson_Temp.test_info.stucreate_date);
		$('#diffcuty_id').html(testjson_Temp.test_info.diffcuty_id);
		$('#scores').html(testjson_Temp.test_info.scores);
		$('#tests_times').html(testjson_Temp.test_info.tests_times);
		$('#right_sum').html(testjson_Temp.test_info.right_sum);
		$('#wrong_sum').html(testjson_Temp.test_info.wrong_sum);
		$('#zone_Persion').val(testjson_Temp.person_list.contacts);
		$('#zone_tel').val(testjson_Temp.person_list.tel);
		$('#zone_address').val(testjson_Temp.person_list.address);
		test_info_temp = testjson_Temp.test_info;
		question_listsTemp = testjson_Temp.question_list;
		ability_listsTemp = testjson_Temp.ablity_list;
		ping_listsTemp = testjson_Temp.ping_list;
		person_listsTemp = testjson_Temp.person_list;
		
		//试卷列表 
		
		
		var htmls_que = '<tr align="center"><td>题号</td><td>题目</td><td>考查知识点</td><td>难易度</td><td>主客观题</td><td>正确答案</td><td>学生答案</td><td>对错</td><td>全网正确率</td></tr>';
		
		$.each(question_listsTemp,function(is,ns){
			$('#question_text_contentcut').html(ns.content);	 
			var nn_content_cuts = $('#question_text_contentcut').text();
			if(nn_content_cuts.length>20){
				nn_content_cuts =  $.trim($('#question_text_contentcut').text()).substring(0,20);
			}else{
				nn_content_cuts = $.trim($('#question_text_contentcut').text());
			}
			htmls_que += '<tr><td align="center">'+ns.num+'</td><td>'+nn_content_cuts+'</td><td>'+ns.zh_knowledge+'</td><td align="center">'+ns.difficulty+'</td><td align="center">'+ns.obj_name+'</td><td>'+ns.que_answer+'</td><td>'+ns.stu_answer+'</td><td align="center">'+ns.answer_flag+'</td><td align="center"><span  id="edit_Q_'+ns.id+'">'+ns.accuracy_num+'</span>&nbsp;&nbsp;<a href="javascript:void(0);" onclick="change_right(\''+ns.id+'\')">改</a></td></tr>';
			 
		});
		$('#que_list').html(htmls_que);
		
		
		//能力维度
		var ability_htmls = '<tr><td>能力维度</td><td>能力维度简述</td><td>选择相应等级</td><td>等级说明</td></tr>';
		$.each(ability_listsTemp,function(i,n){
			if(n.answer=="A"){
				ability_htmls += '<tr><td>'+n.ability_name+'</td><td>'+n.instruction+'</td><td><input type="radio" name="ablity_'+n.id+'" value="A" checked="checked"/> A<input type="radio" name="ablity_'+n.id+'"  value="B"/> B<input type="radio" name="ablity_'+n.id+'" value="C" /> C</td><td>A：'+n.a_level+'&nbsp;B：'+n.b_level+'&nbsp;C：'+n.c_level+'</td></tr>';	
			}else if(n.answer=="B"){
				ability_htmls += '<tr><td>'+n.ability_name+'</td><td>'+n.instruction+'</td><td><input type="radio" name="ablity_'+n.id+'" value="A"/> A<input type="radio" name="ablity_'+n.id+'"  value="B" checked="checked"/> B<input type="radio" name="ablity_'+n.id+'" value="C" /> C</td><td>A：'+n.a_level+'&nbsp;B：'+n.b_level+'&nbsp;C：'+n.c_level+'</td></tr>';	
			}else if(n.answer=="C"){
				ability_htmls += '<tr><td>'+n.ability_name+'</td><td>'+n.instruction+'</td><td><input type="radio" name="ablity_'+n.id+'" value="A"/> A<input type="radio" name="ablity_'+n.id+'"  value="B"/> B<input type="radio" name="ablity_'+n.id+'" value="C" checked="checked" /> C</td><td>A：'+n.a_level+'&nbsp;B：'+n.b_level+'&nbsp;C：'+n.c_level+'</td></tr>';	
			}else{
				ability_htmls += '<tr><td>'+n.ability_name+'</td><td>'+n.instruction+'</td><td><input type="radio" name="ablity_'+n.id+'" value="A"/> A<input type="radio" name="ablity_'+n.id+'"  value="B"/> B<input type="radio" name="ablity_'+n.id+'" value="C" /> C</td><td>A：'+n.a_level+'&nbsp;B：'+n.b_level+'&nbsp;C：'+n.c_level+'</td></tr>';	
			}
		});
		
		$('#ablity_list').html(ability_htmls);
		
		if(testjson_Temp.ablity_flag!=1){
			$('input:radio[name=ablity_yn][value=0]').attr("checked",true);
			$('#ablity_list').hide();
		}
		
		
		//评语
		var slogan_htmls = '';
		if(ping_listsTemp!=null){
			
			$.each(ping_listsTemp,function(ii,nn){
				if(nn.flag==1){
					slogan_htmls += '<div style="padding:10px; border:#CCC solid 1px; margin-top:20px;"><div style="color:#008000; font-size:12px;">'+nn.typename+'</div><div style="padding-bottom:10px;padding-left:25px;"><span style="float:left;"><span style="color:#333; font-size:12px;">是否忽略</span>&nbsp;<input name="slogan_'+nn.id+'" type="radio" value="1" checked="checked" onclick="re_show(\'slogan_content_'+nn.id+'\');"/>&nbsp;不忽略&nbsp;<input name="slogan_'+nn.id+'" type="radio" value="0" onclick="re_hidding(\'slogan_content_'+nn.id+'\');"/>&nbsp;忽略&nbsp;</span><span id="slogan_'+nn.id+'" style="float:right"><a class="easyui-linkbutton l-btn" onclick="choose_demo('+nn.id+');"><span class="l-btn-left"><span class="l-btn-text">选择模板</span></span></a></span><span class="cleared"></span></div><table cellpadding="0" cellspacing="0" border="0" width="98%;"><tr><td><textarea id="slogan_content_'+nn.id+'" style="width:100%; height:120px;">'+nn.content+'</textarea></td></tr></table></div>';		
				}else{
					slogan_htmls += '<div style="padding:10px; border:#CCC solid 1px; margin-top:20px;"><div style="color:#008000; font-size:12px;">'+nn.typename+'</div><div style="padding-bottom:10px;padding-left:25px;"><span style="float:left;"><span style="color:#333; font-size:12px;">是否忽略</span>&nbsp;<input name="slogan_'+nn.id+'" type="radio" value="1"  onclick="re_show(\'slogan_content_'+nn.id+'\');"/>&nbsp;不忽略&nbsp;<input name="slogan_'+nn.id+'" type="radio" checked="checked" value="0" onclick="re_hidding(\'slogan_content_'+nn.id+'\');"/>&nbsp;忽略&nbsp;</span><span id="slogan_'+nn.id+'" style="float:right;display:none;"><a class="easyui-linkbutton l-btn" onclick="choose_demo('+nn.id+');"><span class="l-btn-left"><span class="l-btn-text">选择模板</span></span></a></span><span class="cleared"></span></div><table cellpadding="0" cellspacing="0" border="0" width="98%;"><tr><td><textarea id="slogan_content_'+nn.id+'" style="width:100%; height:120px; display:none;">'+nn.content+'</textarea></td></tr></table></div>';		
				}
				
			});
		}
		$('#slogan_list').html(slogan_htmls); 
		
		
		
		 
	}
	
	 

}

//保存报告 save_id = 1 是修改  等于0 是保存
function save_report(save_id){
	
	var test_infos = {};
	if(save_id==1){
		test_infos = {'test_name':$('#test_name').html(),'stuReal_name':$('#stuReal_name').html(),
					 'stusubject_name':$('#stusubject_name').html(),'stucreate_date':$('#stucreate_date').html(),
					 'diffcuty_id':$('#diffcuty_id').html(),'scores':$('#scores').html(),'tests_times':$('#tests_times').html(),
					 'right_sum':$('#right_sum').html(),'wrong_sum':$('#wrong_sum').html(),
					 'user_id':test_info_temp.user_id, 'study_exercise_id':test_info_temp.study_exercise_id,
					 'center_id':test_info_temp.center_id,'zone_id':test_info_temp.zone_id,'subject_id':test_info_temp.subject_id
					 }
	}else{
		test_infos = {'test_name':$('#test_name').html(),'stuReal_name':$('#stuReal_name').html(),
					 'stusubject_name':$('#stusubject_name').html(),'stucreate_date':$('#stucreate_date').html(),
					 'diffcuty_id':$('#diffcuty_id').html(),'scores':$('#scores').html(),'tests_times':$('#tests_times').html(),
					 'right_sum':$('#right_sum').html(),'wrong_sum':$('#wrong_sum').html(),
					 'user_id':temp_test.user_id, 'study_exercise_id':temp_test.study_exercise_id,
					 'center_id':temp_test.center_id,'zone_id':temp_test.zone_id,'subject_id':temp_test.subject_id
					  
					 }	
	}
	 
	$.each(question_listsTemp,function(i,n){
		n.accuracy_num = $('#edit_Q_'+n.id).html();
	});
	 
	var ablity_flag = $('input:radio[name=ablity_yn]:checked').val();
	if(ability_listsTemp!=""){
		$.each(ability_listsTemp,function(ii,nn){
			nn['answer'] = $('input:radio[name=ablity_'+nn.id+']:checked').val();
		});
	}
	
	$.each(ping_listsTemp,function(iii,nnn){
		nnn['flag'] = $('input:radio[name=slogan_'+nnn.id+']:checked').val();
		nnn['content'] = $('#slogan_content_'+nnn.id).val();
	});
	
	if(person_listsTemp==""){
		person_listsTemp.url = "";
	}
	
	person_listsTemp.contacts = $('#zone_Persion').val();
	person_listsTemp.tel = $('#zone_tel').val();
	person_listsTemp.address = $('#zone_address').val();
	
	var json_Qtemp = {'test_info':test_infos,'question_list':question_listsTemp,'ablity_flag':ablity_flag,'ablity_list':ability_listsTemp,'ping_list':ping_listsTemp,'person_list':person_listsTemp};
	
	 
	var url_type ='/exercise_post';
	var Qjson = {'action':'saveTestReport','data':{'user_id':temp_test.user_id,'creator_id':UserInfo.id,'study_exercise_id':temp_test.study_exercise_id,'test_data':Base64.encode(JSON.stringify(json_Qtemp))}};
	if(save_id==1){
	 	Qjson = {'action':'modifyTestReport','data':{'trid':tr_id,'creator_id':UserInfo.id,'test_data':Base64.encode(JSON.stringify(json_Qtemp))}};	
	}
	 
	var flag_res = Ajax_option(url_type,Qjson,"POST");
	if(flag_res.flag){
		if(save_id==1){
			document.location.href = './TestEnd.html?tr_id='+tr_id;
		}else{
			document.location.href = './TestEnd.html?tr_id='+flag_res.trid;		
		}
		
	}
	
	
}

 

