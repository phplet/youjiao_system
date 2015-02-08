  
var data_test = {};

var UserInfo = null;
var centerAll = null;
$().ready(function (){
  	UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
	centerAll = $.evalJSON($.cookie("centerAll")); //取得登录人信息
 	var stringdata_s = getUrlParam("rowdata");
	 
	if(stringdata_s=='stringdata'){
		data_test = $.evalJSON(Base64.decode(window.top.string_data.rowdata));
		setheadervalues(data_test);
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
		
		$('#back_step').click(function(){
			window.location = '../TestCenter/GroupRollCenter.html';	
			
		});
	}

});                        //reday的结束标签

//给头部赋值
function setheadervalues(headerdata){
	var conditions_data_test = $.parseJSON(headerdata.conditions).data_test;
	var conditions_QueThree = $.parseJSON(Base64.decode($.parseJSON(headerdata.conditions).queThree));
	 
	
	var htmlst = '<li class="hx_Schooltop_nbsp">&nbsp;</li><li class="text_float text_lineH30">试卷名称：<span class="hx_text001">'+headerdata.name+'</span></li><li class="text_float text_lineH30">&nbsp;试卷类型：<span class="hx_text001">'+(headerdata.tmod==0?"智能组卷":"手动组卷")+'</span></li><li class="text_float text_lineH30">&nbsp;当前学科：<span class="hx_text001">'+subject_sum(parseInt(headerdata.subject_id))+'</span></li><li class="text_float text_lineH30">&nbsp;适用年级：<span class="hx_text001">'+edu_grade(parseInt(headerdata.grade_id))+'</span></li><li class="text_float text_lineH30">&nbsp;试卷难易度：<span class="hx_text001">'+headerdata.difficulty+'</span></li>';
	if(conditions_data_test.testtype=="1"){
		var sorces_temp = 0;
		$.each(conditions_QueThree,function(i,n){
			sorces_temp += parseInt(n.sorces);
		});
		htmlst += '<li class="text_float text_lineH30">&nbsp;总分：<span class="hx_text001">'+sorces_temp+'</span></li>';
	}
	htmlst += '<li class="hx_Schooltop_nbsp">&nbsp;</li><li class="text_lineH30" style="float:right; padding-right:10px;"><a id="back_step" class="easyui-linkbutton l-btn" data-options="iconCls:\'icon-back\'" href="javascript:void(0)"><span class="l-btn-left"><span class="l-btn-text icon-back" style="padding-left: 20px;">返 回</span></span></a></li>';
	$('#test_header').html(htmlst);	
	
}


/*{"name":"测试","exer_type":"1","grade_id":"11","subject_id":"3","field":"1","tmod":"1","creat_date":"2013-06-28","id":"10","status":"0","content":"fjj10003875,fjj10003876,fjj10003877,fjj10003878","conditions":"{\"data_test\":{\"testname\":\"u6d4bu8bd5\",\"testtype\":\"1\",\"subject_id\":\"3\",\"section_id\":\"18\",\"grade_id\":\"11\",\"tiku_type\":\"1\",\"tab_Sid\":\"1\",\"booktype\":\"5\",\"publisher\":\"90\",\"chapter\":[\"2630\",\"2631\"]},\"paper_num\":[{\"1\":\"1\"},{\"2\":\"2\"}]}"}*/
 
function setTestValues(data){
	 
	var url_temp = '/examination_paper';
	var paperjson = {'action':'paper','paper_id':data.content,'subject_id':data.subject_id};
	var temp  = Ajax_Question(url_temp,paperjson);
	var conditions = $.parseJSON(data.conditions);
	var htmls = "";
	if(temp.list!=null&&temp.list!=""){
		 
		$.each($.parseJSON(Base64.decode(conditions.queThree)),function(i,n){
			 
			if(n.ids.length>0){
				 
				if(conditions.data_test.testtype=="1"){
					
					htmls += '<li><div class="hxQue_type"><span class="ci-icon circlesmall-plus" style="float:right;">&nbsp;</span><span style="float:left;">'+number_ch((i+1))+'、'+decodeURIComponent(n.typename)+'．（共'+n.sum+'题，每题'+n.sorceP+'分，共'+parseInt(n.sorceP)*parseInt(n.sum)+'分）</span><div style="clear:both;"></div></div><div>';
				}else{
					htmls += '<li><div class="hxQue_type"><span class="ci-icon circlesmall-plus" style="float:right;">&nbsp;</span><span style="float:left;">'+number_ch((i+1))+'、'+decodeURIComponent(n.typename)+'．（共'+n.sum+'题）</span><div style="clear:both;"></div></div><div>';
				}
				var ti_sums = 0;
				$.each(n.ids,function(i_1,n_1){
					ti_sums++;
					$.each(temp.list,function(i_2,n_2){
						
						if(n_1.id==n_2.gid){
							htmls += '<div class="hxQue_titleAn"><div class="hxQue_title">'+ti_sums+'.'+n_2.content+'</div><div class="hxQue_An">参考答案：'+n_2.answer+'</div></div>';
							
							
						}	
					});
				 
				});
				htmls += '</div></li>';
			}
			 
		});
		$('#test_list').html(htmls);
	}
	
	
}
 


function lastStep(){
	 
	 document.location.href = "TestName.html?data_test="+ Base64.encode(JSON.stringify(data_test));
}
