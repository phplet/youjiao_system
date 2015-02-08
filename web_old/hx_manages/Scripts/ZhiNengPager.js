var data_test = {};//从上一个页面取得的组成试卷数据
var paper_ids = "";//从上一个页面中取得的试题id  1,2,3,4
var paper_idTemp = [];
var data_content = "";
var back_testid = 0;
var data_conditions = [];
var stup_2_data = [];
var stup_3_data = [];
var temp_test = "";
var T_stup_2_data = "";
var T_stup_2_data = "";
var  centerAll ={};
var UserInfo = {};
var test_content = "";
var n_pagenums = 2;
$().ready(function () {
	UserInfo = $.evalJSON($.cookie("UserInfo"));
    centerAll = $.evalJSON($.cookie("centerAll"));
	back_testid = getUrlParam("test_id");
	temp_test = getUrlParam("data_test");
	T_stup_2_data = window.top.string_data.stup_2_data;
 	 
	if(temp_test=='zhineng'){
		 
		$('#test_back').show();
		$('#test_back').prev().hide();
		data_test = $.parseJSON(Base64.decode(window.top.string_data.data_test));
		stup_2_data = $.parseJSON(Base64.decode(window.top.string_data.stup_2_data));
		T_stup_3_data = window.top.string_data.stup_3_data;
		stup_3_data = $.parseJSON(Base64.decode(T_stup_3_data));
		test_content = Base64.decode(window.top.string_data.data_content);
		
		getDatasoruce(data_test,stup_2_data,'resets'); //ajax 请求取得数据
		 
		
	}else{
		$('#test_back').hide();
		$('#test_back').prev().show();
		data_test = $.parseJSON(Base64.decode(temp_test));
		stup_2_data = $.parseJSON(Base64.decode(window.top.string_data.stup_2_data));
		getDatasoruce(data_test,stup_2_data,'newssets'); //ajax 请求取得数据 
	}
	 
	$('#test_name').html(data_test.testname);
	$('#test_type').html((data_test.testtype==1?'测试':'作业'));
	$('#subject_id').html(subject_sum(parseInt(UserInfo.subject_id)));
	$('#grade_id').html(edu_grade(parseInt(data_test.grade_id)));
	if(data_test.testtype==1){
		$('#sorce_name').show();
		$('#test_sorce').show();
	}else{
		$('#sorce_name').hide();
		$('#test_sorce').hide();
	}
	$('#divError').hide();
	$('#addTest').hide();
	
    
    
    resetCanUse();//更新类型上移下移
	 
	bindAnswerShowHide();//显示答案
});
 
//更新题目的序列号
function resetnumbers(){
	$('#test').children().each(function(index, element) {
        var c_id = $(element).children().attr("id");
		$('#'+c_id+' .type_numTid').html(number_ch((index+1)));
		$('#'+c_id+' ul').children().each(function(i_1, e_1) {
			$(e_1).find('#ques_number_id').html(i_1+1) ;
        });
    });
}


///绑定数据
function getDatasoruce(st_1,st_2,resettype) {//绑定数据
    if(resettype=='newssets'){ 
		var url_temp = '/examination_paper';
		var paperjson = {'action':'difficulty','question_types':st_2.question_type,'difficulty_id':st_2.difficulty_id,'subject_id':st_1.subject_id};
		 
		if(st_1.tab_Sid==1){
			paperjson['chapter_id'] = st_1.chapter;
			paperjson['grade_id'] = st_1.grade_id ;
		}else if(st_1.tab_Sid==2){
			paperjson['special_id'] = st_1.special;
			paperjson['section_id'] = st_1.section_id ;
		}else if(st_1.tab_Sid==3){
			paperjson['section_id'] = st_1.section_id ;
			paperjson['yeares'] = st_1.yeares ;
			paperjson['province_id'] = st_1.province_id;
		}
		
		if(data_test.tiku_type!=1){
			paperjson['curriculumndb']=data_test.curriculumndb;
		}
		var temp  = Ajax_Question(url_temp,paperjson);
		 
		bindDatasource(temp);
	}else if(resettype=='resets'){
		var url_tempTT = '/examination_paper';
 
		var paperjsonTT = {'action':'paper','paper_id':test_content,'subject_id':st_1.subject_id,'center_id':centerAll.center_id};
		var tempTT  = Ajax_Question(url_tempTT,paperjsonTT);
		resetDatasource(tempTT) ;
	
	}
}

//[{"typename":"填空题","sorceP":10,"sum":"2","sorces":"20","ids":[{"id":"nrj10027828","dbtype":"1"},{"id":"ykn10037637","dbtype":"1"}]},{"typename":"解答题","sorceP":40,"sum":"2","sorces":"80","ids":[{"id":"nrj10027545","dbtype":"1"},{"id":"nrj10027584","dbtype":"1"}]}]
function resetDatasource(result) {
	 
	var htmls="";
     var difs = 0;
	 var dnum = 0;
	 var score_temps = 0;
	 
	 $.each(stup_3_data,function(i_1,n_1){
		 
		 htmls += '<div><div id="objs_type_'+n_1.typename+'"><div  style="padding-left:10px; padding-top:10px;"><div style="float:left;"><span class="type_numTid">'+number_ch(parseInt((i_1+1)))+'</span>.<label><strong>'+n_1.typename+'</strong></label> <a id="" class="easyui-linkbutton l-btn upd" value=' + n_1.typename + ' onclick="reciprocating(this,\'upd\',0);"><span class="l-btn-left"><span class="l-btn-text" >上移</span></span></a> <a id="" class="easyui-linkbutton l-btn downd" value=' + n_1.typename + '  onclick="reciprocating(this,\'downd\',0);"><span class="l-btn-left"><span class="l-btn-text">下移</span></span></a></div><div style="float:right;padding-right:30px;"><label>(共<span id="suns_'+n_1.typename+'">'+n_1.sum+'</span>道题</label>';
		 if(data_test.testtype==1){
			 score_temps += parseInt(n_1.sorces);
		 	 htmls += '<label style="padding-left:10px;">共</label><lable  style=" width:35px; margin-left:5px;" ><span id="score_'+n_1.typename+'">'+n_1.sorces+'</span></lable><label style="padding-left:5px;">分</label>'
		 }
		 htmls += ')</div><div class="cleared"></div></div><ul>';
		var ti_num = 0;
		 $.each(n_1.ids, function (i_2,n_2) {
			$.each(result.list, function (index, value) {
			 	if(n_2.id==value.gid&&n_2.dbtype==value.dbtype){
					var dd = "";
					ti_num ++;
				difs += parseInt(value.difficulty);
				dnum = index;
				switch (parseInt(value.difficulty))
				{
					case 1:
						dd = "简单 ★☆☆☆☆";
						break;
					case 2:
						dd = "较易 ★★☆☆☆";
						break;
					case 3:
						dd = "中等 ★★★☆☆";
						break;
					case 4:
						dd = "较难 ★★★★☆";
						break;
					case 5:
						dd = "困难 ★★★★★";
						break;
					default:
						break;
				}
				htmls += '<li>'
						 + '<div class="subject" id="ques_'+value.gid+'" Qtype_id ="'+value.question_type+'" dbtype="'+data_test.tiku_type+'"  Qtype="'+n_1.typename+'" Tflg="'+value.objective_flag+'" diff="'+value.difficulty+'">'
						 + '<table id="tbSubject" style="background-color: #FFFF99; width:100%">'
						 + '<tbody><tr><th><span id="ques_number_id">'+ti_num
						 + '</span>. 题目ID'
						 + '</th><td>'
						 + value.gid
						 + '</td>'
						 + '<th>'
						 + '   题型'
						 + '</th><td>'
						 + value.type_name
						 + '</td><th>    难度'
						 + '</th>'
						 + '<td>'
						 + '   ' + dd
						 + '</td>'
						 
						 + '<td > <a id="" class="easyui-linkbutton l-btn upc" value=' + value.gid + ' onclick="reciprocating(this,\'upc\',\''+value.type_name+'\');"><span class="l-btn-left"><span class="l-btn-text" >上移</span></span></a>   <a class="easyui-linkbutton l-btn  downc" value=' + value.gid + ' onclick="reciprocating(this,\'downc\',\''+value.type_name+'\');"><span class="l-btn-left"><span class="l-btn-text">下移</span></span></a>   <a id="" class="easyui-linkbutton l-btn" value=' + value.gid + ' onclick="ContinueAdd(\''+value.type_name+'\',\''+value.zh_knowledge+'\',\''+value.gid+'\',\''+value.difficulty+'\')"><span class="l-btn-left"><span class="l-btn-text">换题</span></span></a>   <a id="" class="easyui-linkbutton l-btn showAnswer" value=' + value.gid + ' ><span class="l-btn-left"><span class="l-btn-text">答案</span></span></a>   <a id="" class="easyui-linkbutton l-btn" onclick="Error(\'' + value.gid + '\');"><span class="l-btn-left"><span class="l-btn-text">纠错</span></span></a></td>'
					  
						 + '</tr></tbody></table>'
						 + '</div>'
						 + '<div class="Panswer">'
						 + ' <div style="background-color: #DDDDDD; line-height:25px; padding:10px;">'
						 + value.content//添加试题内容
						 + '</div>'
						 + '</div>'
						 + '<div class="answer"  style="display:none; line-height:25px; padding:10px;" id="divAnswer' + value.gid + '">' + value.answer + '</div>'//给答案div设置id 格式是     divAnswer+ 对应id
						 + '</li>';
				}
			});	
		 });	
		htmls += "</ul></div></div>";
	 });
	   $("#test").append(htmls);  
	   
	   difficultyCount(); 
	 
    if(data_test.testtype==1){
   		$('#test_sorce').text(score_temps);
	}
}


//{"difficulty_id":"0","demp_stup_2":[{"name":"单词拼写","new_name":"单词拼写","num":"12","nums":"608","score":"36"},{"name":"写作","new_name":"写作","num":"1","nums":"618","score":"50"}],"question_type":[{"name":"单词拼写","num":"12"},{"name":"写作","num":"1"}]}

function bindDatasource(result) {
	 
	var htmls="";
     var difs = 0;
	 var dnum = 0;
	 var score_temps = 0;
	 
	 $.each(stup_2_data.demp_stup_2,function(i_1,n_1){
		 
		 htmls += '<div><div id="objs_type_'+n_1.type_name+'"><div  style="padding-left:10px; padding-top:10px;"><div style="float:left;"><span class="type_numTid">'+number_ch(parseInt((i_1+1)))+'</span>.<label><strong>'+n_1.type_name+'</strong></label> <a id="" class="easyui-linkbutton l-btn upd" value=' + n_1.type_name + ' onclick="reciprocating(this,\'upd\',0);"><span class="l-btn-left"><span class="l-btn-text" >上移</span></span></a> <a id="" class="easyui-linkbutton l-btn downd" value=' + n_1.type_name + '  onclick="reciprocating(this,\'downd\',0);"><span class="l-btn-left"><span class="l-btn-text">下移</span></span></a></div><div style="float:right;padding-right:30px;"><label>(共<span id="suns_'+n_1.type_name+'">'+n_1.num+'</span>道题</label>';
		 if(data_test.testtype==1){
			 score_temps += parseInt(n_1.score);
		 	 htmls += '<label style="padding-left:10px;">共</label><lable  style=" width:35px; margin-left:5px;" ><span id="score_'+n_1.type_name+'">'+n_1.score+'</span></lable><label style="padding-left:5px;">分)</label>'
		 }
		 htmls += '</div><div class="cleared"></div></div><ul>';
		var ti_num = 0;
		 
			$.each(result.list, function (index, value) {
			 	if(n_1.type_name==value.type_name){
					var dd = "";
					ti_num ++;
				difs += parseInt(value.difficulty);
				dnum = index;
				switch (parseInt(value.difficulty))
				{
					case 1:
						dd = "简单 ★☆☆☆☆";
						break;
					case 2:
						dd = "较易 ★★☆☆☆";
						break;
					case 3:
						dd = "中等 ★★★☆☆";
						break;
					case 4:
						dd = "较难 ★★★★☆";
						break;
					case 5:
						dd = "困难 ★★★★★";
						break;
					default:
						break;
				}
				htmls += '<li>'
						 + '<div class="subject" id="ques_'+value.gid+'" Qtype_id ="'+value.question_type+'" dbtype="'+data_test.tiku_type+'"  Qtype="'+n_1.type_name+'" Tflg="'+value.objective_flag+'" diff="'+value.difficulty+'">'
						 + '<table id="tbSubject" style="background-color: #FFFF99; width:100%">'
						 + '<tbody><tr><th><span id="ques_number_id">'+ti_num
						 + '</span>. 题目ID'
						 + '</th><td>'
						 + value.gid
						 + '</td>'
						 + '<th>'
						 + '   题型'
						 + '</th><td>'
						 + value.type_name
						 + '</td><th>    难度'
						 + '</th>'
						 + '<td>'
						 + '   ' + dd
						 + '</td>'
						
						 + '<td > <a id="" class="easyui-linkbutton l-btn upc" value=' + value.gid + ' onclick="reciprocating(this,\'upc\',\''+value.type_name+'\');"><span class="l-btn-left"><span class="l-btn-text" >上移</span></span></a>   <a class="easyui-linkbutton l-btn  downc" value=' + value.gid + ' onclick="reciprocating(this,\'downc\',\''+value.type_name+'\');"><span class="l-btn-left"><span class="l-btn-text">下移</span></span></a>   <a id="" class="easyui-linkbutton l-btn" value=' + value.gid + ' onclick="ContinueAdd(\''+value.type_name+'\',\''+value.zh_knowledge+'\',\''+value.gid+'\',\''+value.difficulty+'\')"><span class="l-btn-left"><span class="l-btn-text">换题</span></span></a>   <a id="" class="easyui-linkbutton l-btn showAnswer" value=' + value.gid + ' ><span class="l-btn-left"><span class="l-btn-text">答案</span></span></a>   <a id="" class="easyui-linkbutton l-btn" onclick="Error(\'' + value.gid + '\');"><span class="l-btn-left"><span class="l-btn-text">纠错</span></span></a></td>'
					  
						 + '</tr></tbody></table>'
						 + '</div>'
						 + '<div class="Panswer">'
						 + ' <div style="background-color: #DDDDDD; line-height:25px; padding:10px;">'
						 + value.content//添加试题内容
						 + '</div>'
						 + '</div>'
						 + '<div class="answer"  style="display:none; line-height:25px; padding:10px;" id="divAnswer' + value.gid + '">' + value.answer + '</div>'//给答案div设置id 格式是     divAnswer+ 对应id
						 + '</li>';
				}
			});	
		 
		htmls += "</ul></div></div>";
	 });
	 if(result.list!=null&&result.list!=""){
	   	$("#test").html(htmls);
		difficultyCount(); 
		if(data_test.testtype==1){
   			$('#test_sorce').text(score_temps);
		}
	 }else{
		$("#test").html(""); 
		if(data_test.testtype==1){
   			$('#test_sorce').text("");
		}
		
	 }
	   
	 
    
}




//题型上移下移
function reciprocating(e,str,ustype){
	
	 if(str=='upd'){
		 var s = $(e).parent().parent().parent().parent().index();
		 var sl = $('#test').children().length;
		 var  s_1 = $('#test').children().eq(s).html();
		 var  s_2 = $('#test').children().eq((s-1)).html();
		  
		 if(data_test.testtype==1){  //1=测试 2=作业 
			var s_score_1_id = $('#test').children().eq(s).children().attr("id"); 
		 	var s_score_2_id = $('#test').children().eq(s-1).children().attr("id");
		 	var s_score_1 = $('#test input[name="score_'+(s_score_1_id.split("objs_type_"))[1]+'"]').val();
		 	var s_score_2 = $('#test input[name=score_'+(s_score_2_id.split("objs_type_"))[1]+']').val();
 
		 }
		  
		 $('#test').children().eq(s).html(s_2);
	 	 $('#test').children().eq(s-1).html(s_1);
		 
		 if(data_test.testtype==1){  //1=测试 2=作业 
			 
   		 	$('#test input[name=score_'+(s_score_1_id.split("objs_type_"))[1]+']').val(s_score_1);
			$('#test input[name=score_'+(s_score_2_id.split("objs_type_"))[1]+']').val(s_score_2);
		 }
		 
	     
		 if(s==1){
			$('#test').children().eq(s).find('.upd').show();	
			$('#test').children().eq(s-1).find('.upd').hide(); 
		 }
		 if(s==(sl-1)){
			$('#test').children().eq(s).find('.downd').hide();	
			$('#test').children().eq(s-1).find('.downd').show(); 
		 }
		 	
	 }else if(str=='downd'){
		 var s = $(e).parent().parent().parent().parent().index();
		 var sl = $('#test').children().length;
		 var  s_1 = $('#test').children().eq(s).html();
		 var  s_2 = $('#test').children().eq((s+1)).html();
		 if(data_test.testtype==1){  //1=测试 0=作业 
			 var s_score_1_id = $('#test').children().eq(s).children().attr("id"); 
			 var s_score_2_id = $('#test').children().eq(s+1).children().attr("id");
			 var s_score_1 = $('#test input[name="score_'+(s_score_1_id.split("objs_type_"))[1]+'"]').val();
			 var s_score_2 = $('#test input[name=score_'+(s_score_2_id.split("objs_type_"))[1]+']').val();
		 }
		 $('#test').children().eq(s).html(s_2);
	 	 $('#test').children().eq(s+1).html(s_1);
		 if(data_test.testtype==1){  //1=测试 0=作业 
			 $('#test input[name=score_'+(s_score_1_id.split("objs_type_"))[1]+']').val(s_score_1);
			 $('#test input[name=score_'+(s_score_2_id.split("objs_type_"))[1]+']').val(s_score_2);
		 }
		 if(s==0){
			$('#test').children().eq(s).find('.upd').hide();	
			$('#test').children().eq(s+1).find('.upd').show(); 
		 }
		 if(s==(sl-2)){
			$('#test').children().eq(s).find('.downd').show();
			$('#test').children().eq(s+1).find('.downd').hide();
		 }
	 }else if(str=='upc'){
		 var s = $(e).parent().parent().parent().parent().parent().parent().index();
		 var sl = $('#objs_type_'+ustype+' ul').children().length;
		 var  s_1 = $('#objs_type_'+ustype+' ul').children().eq(s).html();
		 var  s_2 = $('#objs_type_'+ustype+' ul').children().eq((s-1)).html();
		 $('#objs_type_'+ustype+' ul').children().eq(s).html(s_2);
	 	 $('#objs_type_'+ustype+' ul').children().eq(s-1).html(s_1);
	     if(s==1){
			$('#objs_type_'+ustype+' ul').children().eq(s).find('.upc').show();	
			$('#objs_type_'+ustype+' ul').children().eq(s-1).find('.upc').hide(); 
		 }
		 if(s==(sl-1)){
			$('#objs_type_'+ustype+' ul').children().eq(s).find('.downc').hide();	
			$('#objs_type_'+ustype+' ul').children().eq(s-1).find('.downc').show(); 
		 }
		 
	 }else if(str=='downc'){
		 var s = $(e).parent().parent().parent().parent().parent().parent().index();
		 var sl = $('#objs_type_'+ustype+' ul').children().length;
		 var  s_1 = $('#objs_type_'+ustype+' ul').children().eq(s).html();
		 var  s_2 = $('#objs_type_'+ustype+' ul').children().eq((s+1)).html();
		 $('#objs_type_'+ustype+' ul').children().eq(s).html(s_2);
	 	 $('#objs_type_'+ustype+' ul').children().eq(s+1).html(s_1);
		 if(s==0){
			$('#objs_type_'+ustype+' ul').children().eq(s).find('.upc').hide();	
			$('#objs_type_'+ustype+' ul').children().eq(s+1).find('.upc').show(); 
			 
		 }
		 if(s==(sl-2)){
			 
			$('#objs_type_'+ustype+' ul').children().eq(s).find('.downc').show();
			$('#objs_type_'+ustype+' ul').children().eq(s+1).find('.downc').hide();
		 }
	 }
	 $('.answer').hide();
	 bindAnswerShowHide();
	 resetnumbers();
	 
 }
 
 //题型初始化
 function resetCanUse(){
	$('#test').children().eq(0).find('.upd').hide();
	$('#test').children().eq($('#test').children().length-1).find('.downd').hide();
	 
	$.each(stup_2_data.demp_stup_2,function(i,n){
		
		$('#objs_type_'+n.type_name+' ul').children().eq(0).find('.upc').hide();
		$('#objs_type_'+n.type_name+' ul').children().eq($('#objs_type_'+n.name+' ul').children().length-1).find('.downc').hide(); 
	});
 }
 
//增加题目
function ContinueAdd(type,knoledge,temp_ti_id,difficulty) {
	var openfuc = "addopeniinfo('"+type+"','"+knoledge+"',"+difficulty+",'"+temp_ti_id+"');";
	var handfuc = "addhand('"+type+"','"+knoledge+"','"+temp_ti_id+"');";
	if(knoledge==1){
		 
		alertCreate("#addTest","追加题目窗口","700","400",openfuc,handfuc,"追加","取消");
		$('#addTest').dialog({
			buttons: [{
					text: '全选',
					iconCls: '',
					handler:function(n){
						
						$('#newQues_list input[type=checkbox]').attr("checked",true);
						
					}
				},{
					text: '反选',
					iconCls: '',
					handler:function(n){
						
						$('#newQues_list input[type=checkbox]').attr("checked",false);
						
					}
				},{
					text: '追加',
					iconCls: 'icon-ok',
					handler:function(){
						eval(handfuc);	
						$('#addTest').dialog('close');
						bindAnswerShowHide();
						difficultyCount();
						
					}
				}, {
					text: '取消',
					iconCls: 'icon-cancel',
					handler: function () {
						$('#addTest').dialog('close');
					}
				}]
			 
		});
	}else if(knoledge==""){
		
		alertCreate("#addTest","换题窗口","700","400",openfuc,handfuc,"追加","取消");
		$('#addTest').dialog({
			buttons: [{
					text: '换题',
					iconCls: 'icon-ok',
					handler:function(){
						eval(handfuc);	
						$('#addTest').dialog('close');
						bindAnswerShowHide();
						difficultyCount();
					}
				}, {
					text: '取消',
					iconCls: 'icon-cancel',
					handler: function () {
						$('#addTest').dialog('close');
					}
				}]
			 
		});
	
	}else{
		alertCreate("#addTest","换题窗口","700","400",openfuc,handfuc,"追加","取消");
		n_pagenums = 2;
		$('#addTest').dialog({
			buttons: [{
					text: '换一批',
					iconCls: 'icon-text',
					handler:function(){
						 
						 getDataAdd(n_pagenums,type,knoledge,difficulty,temp_ti_id);
						 n_pagenums++;
						 
					}
				}, {
					text: '换题',
					iconCls: 'icon-ok',
					handler:function(){
						eval(handfuc);	
						$('#addTest').dialog('close');
						bindAnswerShowHide();
						difficultyCount();
						
					}
				}, {
					text: '取消',
					iconCls: 'icon-cancel',
					handler: function () {
						$('#addTest').dialog('close');
					}
				}]
			 
		});
	}
	
	 $('#addTest').dialog('open');
	 $('#seach_Ques').unbind("click");
	 $('#seach_Ques').bind("click",function(){
		 getDataAdd(1,type,knoledge,difficulty,temp_ti_id);
	 });
     
}
//增加题目预加载
function addopeniinfo(typename,kno,difficulty,temp_ti_id){
	resetnumbers();//更新列表的序列号
	$('#addTest').show();
	$('#addTest div').show();
	$('#newQues_list').html("");
	$('#divPage').html("");
	$('#newQues_list .answer').hide();
	if(kno==1||kno==""){
		$('.addTest_types').show();
		linkage_Londing(data_test,typename);
 	
	}else{
		
		$('.addTest_types').hide();
		getDataAdd(1,typename,kno,difficulty,temp_ti_id);
	}
 	/*
	var url_temp = '/examination_paper';
	var paperjson = {'action':'paper','paper_id':JSON.stringify(paper_ids),'subject_id':data_test.subject_id,'center_id':centerAll.center_id};
	var temp  = Ajax_Question(url_temp,paperjson);*/
	 
}
function showjiexi(e,tid){
	if($(e).text()=='查看解析'){
		
		$('#divAnswer'+tid).show();
		$(e).text('收起解析');
	}else{
		$('#divAnswer'+tid).hide();
		$(e).text('查看解析');
	}
}
//四级联动
function linkage_Londing(data_tests,typename){
	 
	var type_idsT = [{'id':'请选择','Name':'请选择'},{'id':1,'Name':'华夏题库'},{'id':2,'Name':'自建库'}];
	var temp_idsT = [{'id':'请选择','Name':'请选择'},{'id':1,'Name':'同步题库'},{'id':2,'Name':'专题题库'},{'id':3,'Name':'历年真题'}];
	var subject_idT = data_tests.subject_id;  //学科
	var section_id = data_tests.section_id;  //学段
	var grade_idT = data_tests.grade_id;     //年级
	var tiku_typeT = data_tests.tiku_type;  //题库名称
    var tab_idT = data_tests.tab_Sid;       //题库类型
	$('#tiku_type').combobox({
		data:type_idsT,
		valueField:'id',
		textField:'Name',
		onLoadSuccess:function(){
			$('#tiku_type').combobox('setValue',tiku_typeT);
		},
		onChange:function(newValue,oldValue){
			if(newValue!='请选择'){
				$('#tiku_bank').combobox({
					data:temp_idsT,
					valueField:'id',
					textField:'Name',
					onLoadSuccess:function(){
						$('#tiku_bank').combobox('setValue',tab_idT);
					},
					onChange:function(newValue1,oldValue1){
						if(newValue1!='请选择'){
							if(newValue1==1){         	                      //同步
								var booktype_idT = data_tests.booktype;       //题库版本
								var publisher_idT = data_tests.publisher;     //题库教材
								$('#bo_li').show();
								$('#pub_li').show();
								$('#chapters_li').show();
								$('#pr_li').hide();
								
								$('#specials_li').hide();
								$('#yeares_li').hide();
								$('#booktype').combobox('clear');
								$('#publisher').combobox('clear');
								$('#publisher').combobox('disable');
								subQuestion(subject_idT,grade_idT,newValue1,tab_idT,booktype_idT,publisher_idT,typename);
									 
								
							}else if(newValue1==2){                             //专题
								$('#specials_li').show();
								$('#bo_li').hide();
								$('#pub_li').hide();
								$('#pr_li').hide(); 
								
								$('#chapters_li').hide();
								
								$('#yeares_li').hide();                           
								zhuantiQuestion(subject_idT,section_id,typename);
								 
							}else if(newValue1==3){                             //历年真题
								var province_idT = data_tests.province_id;       //省份
								$('#bo_li').hide();
								$('#pub_li').hide();
								$('#chapters_li').hide();
								$('#specials_li').hide();
								$('#yeares_li').show();
								$('#pr_li').show();
								examQuestion(subject_idT,section_id,newValue1,tab_idT,province_idT,typename);
							}
						}
					}
				});
			}
		}
	});
	
}


//追加题目调用题目数据
function getDataAdd(pageNumber,typename,knoledge,difficulty,temp_ti_id){
  	
	var pageSize = 10;
	var dbids_temp = getquelist_ids_dbtype(typename);
	var  question_type_id = $('#ques_'+temp_ti_id).attr('qtype_id');
	
	var para ={'pageno':pageNumber,'countperpage':pageSize,'subject_id':data_test.subject_id,'question_type':question_type_id}; 
	if(knoledge==1||knoledge==""){
		var rc_id = $('#tiku_type').combobox('getValue');
		/*if(knoledge!=1){
			para['zh_knowledge'] = knoledge;
		}*/
		if(rc_id!=1){
			para['curriculumndb']=data_test.curriculumndb;
			para['ids'] = dbids_temp.db_ids_2;
		}else{
			para['ids'] = dbids_temp.db_ids_1;
		}
		if ($('#tiku_bank').combobox('getValue') == 1) { //同步
			para['action'] = 'sync';
			para['chapter_id'] = selectMore("chapter");
			para['grade_id'] = data_test.grade_id;
		}else if($('#tiku_bank').combobox('getValue') == 2) { //专题
			para['action'] = 'zhuanti'; 
			para['special_id'] = selectMore("special");
			para['section_id'] = data_test.section_id;
		}else if($('#tiku_bank').combobox('getValue') == 3){  //真题
			para['action'] = 'zhenti'; 
			para['province_id'] = $('#province').combobox('getValue');
			para['section_id'] = data_test.section_id;
			para['yeares'] = selectMore("yeares");
			
		}
	}else{
		para['action'] = 'change_question';
		para['difficulty'] = difficulty;
		para['zh_knowledge'] = knoledge;
		if(data_test.tiku_type!=1){
			para['curriculumndb']=data_test.curriculumndb;
			para['ids'] = dbids_temp.db_ids_2;
		}else{
			para['ids'] = dbids_temp.db_ids_1;
		}
	}
    $.ajax({
        url: Webversion + '/examination_paper' , //url访问地址
        type: "GET",
        data: para,
        dataType: "json",
		async: false,
        success: function (res)
        {
			 
			//alert(JSON.stringify(data));
			if(res.list!=null&&res.list!=""){
				var pages_num = 10;  //显示多少页
				var pagesNumT = (parseInt(res.count)%10)==0?(Math.floor(parseInt(res.count)/10)):(Math.floor(parseInt(res.count)/10)+1);
				 
				if(knoledge==1||knoledge==""){
					setAddQuesValues(res.list,data_test.tiku_type,pageNumber,pageSize,knoledge); //列表业务处理
					getPageNums(res.count,pageNumber,pageSize,pages_num,typename,knoledge,temp_ti_id);//分页操作
				}else{
					setAddQuesValues(res.list,data_test.tiku_type,pageNumber,pageSize,knoledge); //列表业务处理
					$('#divPage').html("");
					if((parseInt(n_pagenums))==pagesNumT){
					 	n_pagenums = 0;
					}
				}
			}else{
				$('#newQues_list').html('<ul><li>没有数据！</li></ul>');
				$('#divPage').html("");
			}
			 
        },
		error:function ()
        {
            
        }
    });

}

//新增题目列表赋值
function setAddQuesValues(ques_List,dbtype,pageNumber,pageSize,knoledge){
	var new_addhtmls = '<ul>';
	var newsums = (parseInt(pageNumber)-1)*parseInt(pageSize);
	if(knoledge!=1&&knoledge!=""){
		newsums = 0;
	}
	if(ques_List!=null&&ques_List!=undefined&&ques_List!=""){
		$.each(ques_List,function(i,n){
			if(knoledge!=1){
				new_addhtmls += '<li><div class="Panswer"> <div style="background-color: #DDDDDD; line-height:25px; padding:10px;"><input  type="radio" name="ques_add" content="'+Base64.encode(JSON.stringify(n))+'"  dbtype="'+dbtype+'"/>&nbsp;'+(newsums+i+1)+'.('+n.type_name+')'+n.content+'</div><div style="background-color: #DDDDDD; padding-left:10px; line-height:25px;"><a onclick="showjiexi(this,\''+n.id+'\')">查看解析</a></div></div><div id="divAnswer'+n.id+'" style="display:none; " class="answer">'+n.answer+'</div></li>';
			}else{
				new_addhtmls += '<li><div class="Panswer"> <div style="background-color: #DDDDDD; line-height:25px; padding:10px;"><input  type="checkbox" name="ques_add" content="'+Base64.encode(JSON.stringify(n))+'"  dbtype="'+dbtype+'"/>&nbsp;'+(newsums+i+1)+'.('+n.type_name+')'+n.content+'</div><div style="background-color: #DDDDDD; padding-left:10px; line-height:25px;"><a onclick="showjiexi(this,\''+n.id+'\')">查看解析</a></div></div><div id="divAnswer'+n.id+'" style="display:none; " class="answer">'+n.answer+'</div></li>';	
			}
		});
	}else{
		new_addhtmls += '<li>没有数据！</li>';
	}
	new_addhtmls += '</ul>';
	
	$('#newQues_list').html(new_addhtmls);
	
	 
}
 
 //列表分页
function getPageNums(count,pageNumber,pageSize,pages_num,typename,knoledge,temp_ti_id){
	var totalNum = parseInt(count);   //总条数
	var pagesNum = (totalNum%pageSize)==0?(Math.floor(totalNum/pageSize)):(Math.floor(totalNum/pageSize)+1);  //余数等0 总页数不加1 ，反之 加 1
	var m = (pageNumber%pages_num)==0?(pageNumber/pages_num):(Math.floor(pageNumber/pages_num)+1);//取当前箭头点击次数+1
	var n = pageNumber<=pages_num?1:((m-1)*pages_num+1);  //获得当前分页第一个页码数  比如  1，6，11
	var pagehtml = '<ul class="pagesnum">';
			    
	if(n<=1){  //判断  页码是1到5的情况下  上一步箭头事件取消  否则加上一步onclick事件
		pagehtml += '<li> <a >?</a> </li>';
    }else{
	   pagehtml += '<li> <a onclick="getDataAdd('+(n-pages_num)+',\''+typename+'\',\''+knoledge+'\','+temp_ti_id+')"> << </a> </li>';
    }
   
   	for(i=n;i<n+pages_num;i++){//页面追加页码
	   if(i<=pagesNum){
		   if(i==pageNumber){
			  pagehtml+='<li class="on"> <a onclick="getDataAdd('+i+',\''+typename+'\',\''+knoledge+'\','+temp_ti_id+');">'+i+'</a> </li>';
		   }else{
			  pagehtml+='<li> <a onclick="getDataAdd('+i+',\''+typename+'\',\''+knoledge+'\','+temp_ti_id+');">'+i+'</a> </li>'; 
		   }
	   }else{
		   
	   }
   	}
  	
  	if((n+pages_num)>pagesNum){//判断  页码是最后一页的页码 比如：(...总页数-4 ,总页数-3 ,总页数-2 ,总页数-1 ,总页数) 下一步箭头事件取消  否则下一步加上onclick事件
	   pagehtml+='<li> <a>?</a> </li>';
   	}else{
	   pagehtml+='<li> <a  onclick="getDataAdd('+(n+pages_num)+',\''+typename+'\',\''+knoledge+'\','+temp_ti_id+')"> >> </a> </li>';
	   }
  	pagehtml+='</ul>';
	$('#divPage').html(pagehtml);
	 
}

//增加题目点击追加以后操作
function addhand(typename,kno,ti_id){
	
	var numsstemp  = $('#objs_type_'+typename+' ul').children().length;
	 
	var addhandhtmls = "";
	var ddifs = 0;
	var iiii = 0;
	var radio_checkbox = "";
	if(kno!=1){
		radio_checkbox = '#newQues_list input[type=radio]:checked';	
	}else{
		radio_checkbox = '#newQues_list input[type=checkbox]:checked';	
	}
	if($(radio_checkbox).length>0){
		$(radio_checkbox).each(function(index, element) {
			var hand_content = $(element).attr("content");
			var dbtype = $(element).attr("dbtype");
			if(hand_content!=null&&hand_content!=""){
				var content_bsen = $.parseJSON(Base64.decode(hand_content));
					var dd = "";
					numsstemp ++;
					ddifs += parseInt(content_bsen.difficulty);
					iiii++;
					switch (parseInt(content_bsen.difficulty))
					{
						case 1:
							dd = "简单 ★☆☆☆☆";
							break;
						case 2:
							dd = "较易 ★★☆☆☆";
							break;
						case 3:
							dd = "中等 ★★★☆☆";
							break;
						case 4:
							dd = "较难 ★★★★☆";
							break;
						case 5:
							dd = "困难 ★★★★★";
							break;
						default:
							break;
					}
					addhandhtmls += '<li><div class="subject" id="ques_'+content_bsen.gid+'" dbtype="'+dbtype+'"  Qtype_id ="'+content_bsen.question_type+'"  Qtype="'+typename+'" Tflg="'+content_bsen.objective_flag+'" diff="'+content_bsen.difficulty+'">'+ '<table id="tbSubject" style="background-color: #FFFF99; width:100%"><tbody><tr><th><span id="ques_number_id">'+numsstemp+ '</span>. 题目ID</th><td>'+ content_bsen.gid+ '</td><th>   题型</th><td>'+ content_bsen.type_name+ '</td><th>    难度</th><td>'+ dd+ '</td><td > <a id="" class="easyui-linkbutton l-btn upc" value=' + content_bsen.gid + ' onclick="reciprocating(this,\'upc\',\''+content_bsen.type_name+'\');"><span class="l-btn-left"><span class="l-btn-text" >上移</span></span></a>   <a class="easyui-linkbutton l-btn  downc" value=' + content_bsen.gid + ' onclick="reciprocating(this,\'downc\',\''+content_bsen.type_name+'\');"><span class="l-btn-left"><span class="l-btn-text">下移</span></span></a>   <a id="" class="easyui-linkbutton l-btn" value=' + content_bsen.gid + ' onclick="ContinueAdd(\''+typename+'\',\''+content_bsen.zh_knowledge+'\',\''+content_bsen.gid+'\',\''+content_bsen.difficulty+'\')" ><span class="l-btn-left"><span class="l-btn-text">换题</span></span></a>   <a id="" class="easyui-linkbutton l-btn showAnswer" value=' + content_bsen.gid + ' ><span class="l-btn-left"><span class="l-btn-text">答案</span></span></a>   <a id="" class="easyui-linkbutton l-btn" onclick="Error(\'' + content_bsen.gid + '\');"><span class="l-btn-left"><span class="l-btn-text">纠错</span></span></a></td></tr></tbody></table></div><div class="Panswer"> <div style="background-color: #DDDDDD; line-height:25px; padding:10px;">'+ content_bsen.content+ '</div></div><div class="answer"  style="display:none; line-height:25px; padding:10px;" id="divAnswer' + content_bsen.gid + '">' + content_bsen.answer + '</div></li>';
				 
			}
			
		});
		 
		//$('#difs').text((((parseFloat($('#difs').text()))*($('#test ul').children().length)+ddifs)/($('#test ul').children().length+iiii)).toFixed(2));
		
		//$('#suns_'+typename).text(parseInt($('#suns_'+typename).text())+iiii);
		//srocesCount();
		if(kno==1){
			$('#objs_type_'+typename+' ul').append(addhandhtmls);
		}else{
			var ind = $('#ques_'+ti_id).parent().index();
			
			$('#objs_type_'+typename+' ul').children().eq(ind).replaceWith(addhandhtmls);
		}
		$.messager.alert('温馨提示','操作成功！','info');
	}else{
		$.messager.alert('温馨提示','你没有选择题目！','info');
	} 
	resetCanUse();
	resetnumbers();
	
}




//加载子题库联动同步题库
function subQuestion(subject_id,grade_id,newValues,tab_idT,booktype_idT,publisher_idT,typename){
	var urls = "/sync"; 
	var Qjsons = {'action':'publisher','subject_id':subject_id,'grade_id':grade_id};
	var rc_id = $('#tiku_type').combobox('getValue');
	if(rc_id!=1){
		Qjsons['curriculumndb']=data_test.curriculumndb;
	}
	var booktype = Ajax_Question(urls,Qjsons);
	var b_list = [{'id':'请选择','Name':'请选择'}];
	if(booktype.publisher!=null){
		$.each(booktype.publisher,function(i,n){
			var b_temp = {'id':n.id,'Name':n.notes};
			b_list.push(b_temp);
		});
	 }
	$('#booktype').combobox({
		data:b_list,
		valueField:'id',
		textField:'Name',
		onLoadSuccess:function(){
			if(newValues==tab_idT){
				$('#booktype').combobox('setValue',booktype_idT);
			}
		},
		onChange:function(newValue,oldValue){
			$('#publisher').combobox('clear');
			$('#publisher').combobox('disable');
			$('#chapter').combotree('clear');
			$('#chapter').combotree('disable');
			if(newValue!='请选择'){
				 var boo_temps = [{'id':'请选择','Name':'请选择'}];
				  
				 $.each(booktype.publisher,function(ii,nn){
					 
					 if((parseInt(nn.id))==(parseInt(newValue))){
						if(nn.books!=null){
							 
							$.each(nn.books,function(iii,nnn){
								var boo = {};
								boo = {'id':nnn.id,'Name':nnn.book_name};
								boo_temps.push(boo);
							});
							
							
						}
					 }
				 });
				 
				 $('#publisher').combobox({
					  data:boo_temps,
					  valueField:'id',
					  textField:'Name',
					  onLoadSuccess:function(){
						  if(newValue==booktype_idT){
							$('#publisher').combobox('setValue',publisher_idT);
						  }
					  },
					  onChange:function(newValue1,oldValue1){
						 
						  if(newValue!='请选择'){
							   var publisher_temps = [];
							   var publish_json = {'action':'chapter','book_id':newValue1,'subject_id':subject_id};
							   var rc_id = $('#tiku_type').combobox('getValue');
								if(rc_id!=1){
									publish_json['curriculumndb']=data_test.curriculumndb;
								}
							   var publisher_list = Ajax_Question(urls,publish_json);
							   var  pub_temps = []; 
					 
							   if(publisher_list.list!=null){
								  $.each(publisher_list.list,function(p_i,p_n){
									   var pub_temp = {};
									   var child_temps = [];
									   if(p_n.chapter!=null){
										   $.each(p_n.chapter,function(ch_i,ch_n){
											  	var child_temp = {};
												child_temp = {'id':ch_n.id,'text':ch_n.chapter};
												child_temps.push(child_temp);
										   });
										    pub_temp = {'id':p_n.id,'text':p_n.unit,'state':"open",'children':child_temps};
									   }else{
											pub_temp = {'id':p_n.id,'text':p_n.unit};   
									   }
									   pub_temps.push(pub_temp);
									   
								  }); 
							   }
							  
							   $('#chapter').combotree({
									data:pub_temps,
									onLoadSuccess:function(){
										if(data_test.chapter!=null&&data_test.chapter!=undefined){
										  	setSelectMore('chapter',data_test.chapter);
										}
									}
							   });
							   
						  } 
					  }
				 });
			}
		}
	});
}


//专题题库
function zhuantiQuestion(subject_id,grade_id,typename){
	var urls = "/sync"; 
	var SQjsons = {'action':'zhuanti','subject_id':subject_id,'section_id':grade_id};
	var rc_id = $('#tiku_type').combobox('getValue');
	if(rc_id!=1){
		SQjsons['curriculumndb']=data_test.curriculumndb;
	}
	var special_list = Ajax_Question(urls,SQjsons);
	var  special_temps = []; 
	if(special_list.list!=null){
		$.each(special_list.list,function(spe_i,spe_n){
			var special_temp = {};
			special_temp = {'id':spe_n.id,'text':spe_n.name}
			special_temps.push(special_temp);
		});
	}
	$('#special').combotree({
		data:special_temps,
		onLoadSuccess:function(){
			if(data_test.special!=null&&data_test.special!=undefined){
				setSelectMore('special',data_test.special);
			}
		}	 
	 });
		
}
 
 

//历年真题
function examQuestion(subject_id,section_id,newValues,tab_idT,province_idT,typename){
	var urls = "/province";
	var SQjsons = {'action':'list','subject_id':subject_id,'section_id':section_id};
	var rc_id = $('#tiku_type').combobox('getValue');
	if(rc_id!=1){
		SQjsons['curriculumndb']=data_test.curriculumndb;
	}
	var provice_list = Ajax_Question(urls,SQjsons);
	var provice_temps = [{'id':'请选择','text':'请选择',"checked":true}];
	if(provice_list!=null){
		$.each(provice_list,function(pr_i,pr_n){
			var provice_temp ={};
			if(pr_n.year!=""&&pr_n.year!=null){
				provice_temp = {'id':pr_n.id,'text':pr_n.name};
				provice_temps.push(provice_temp);	
			}
			 
		});
	}
	 
	$('#province').combotree({
		data:provice_temps,
		onShowPanel:function(){ 
			var  PrsT = $(this).combotree("getValues");
			if(PrsT=='请选择'){
				$(this).combotree("setValue","");
			}
		},
		onLoadSuccess:function(){
			if(newValues==tab_idT){
				$('#province').combotree('setValues',province_idT);
			}
		},
		onChange:function(newValue,oldValue){
			var year_prname = [];
					var pr_namesid = newValue;
					if(newValue!='请选择'&&newValue!=''){
						if(provice_list!=null){
							if(oldValue!=""&&oldValue!='请选择'){
								pr_namesid = $.merge(newValue,oldValue);
								pr_namesid = unique(pr_namesid);
							}
							$.each(pr_namesid,function(i,n){
								$.each(provice_list,function(pr_i,pr_n){
									if(n==pr_n.id){
										year_prname = $.merge(pr_n.year,year_prname);
									}
								
								});
							});
						}
						
					}else{
						pr_namesid = [];
					}
					var year_temps = [{'id':'请选择','text':'请选择',"checked":true}];
							 
					var year_temps_Tyea = [];
					 
					if(year_prname!=""){
						$.each(year_prname,function(ii,nn){
							year_temps_Tyea.push(nn.year);
						});
						year_temps_Tyea = unique(year_temps_Tyea);
						year_temps_Tyea = year_temps_Tyea.sort(function(a,b){return a<b?1:-1});
						$.each(year_temps_Tyea,function(y_i,y_n){
							var year_temp = {};
							year_temp = {'id':y_n.substring(0,((y_n).length-1)),'text':y_n};
							year_temps.push(year_temp);
						});
						
						
					}
					$('#yeares').combotree({
						data:year_temps,
						onShowPanel:function(){ 
							var  ssT = $(this).combotree("getValues");
							if(ssT=='请选择'){
								$(this).combotree("setValue","");
							}
						},
						onLoadSuccess:function(){
							var pr_num = 0;
							if(newValue.length==province_idT.length){
								$.each(newValue,function(pi,pn){
									if(province_idT[pi]!=pn){
										pr_num++;
									}
								});
							}else{
								pr_num++;
							}
							
							if(pr_num==0){
								$('#yeares').combotree('setValues',data_test.yeares);
							}else{
								$('#yeares').combotree('setValues',['请选择']);
							}
						}
					});
					
		}
	});
}

//获取combotree的值
function setSelectMore(css_Id,seids){
	  
	 $.each(seids,function(s_i,s_n){
		var  s_n_temp = $('#'+css_Id).combotree('tree').tree('find',parseInt(s_n)); 
		$('#'+css_Id).combotree('tree').tree('check',s_n_temp.target); 
	});
 
}
//设置combotree的值
function selectMore(css_Id){
	 
	 var p_Checks = $('#'+css_Id).combotree('tree').tree('getChecked');
	 
	 var chapter_1= [];
	 if(p_Checks!=""){
		 $.each(p_Checks,function(PC_i,PC_n){
			if(PC_n.id!='请选择'){
				var p_or = $('#'+css_Id).combotree('tree').tree('isLeaf',PC_n.target);
				if(p_or){
					chapter_1.push(PC_n.id);
				}
			}
		 });
	 }	
	return chapter_1;
}


//删除题目
function deleteQue(id){
	$.messager.confirm('温馨提示','确认要删除此题吗？',function(flag){
		 if(flag){
			var qtypeT = $('#ques_'+id).attr("qtype");
			var QTnums = $('#suns_'+qtypeT).html();
			if(parseInt(QTnums)==1){
				
				$('#objs_type_'+qtypeT).parent().remove();
				
			}else{
				$('#ques_'+id).parent().remove();
				$('#suns_'+qtypeT).html(parseInt(QTnums)-1);
			}
			resetCanUse();
			difficultyCount();
		 }
	 });
	 
}

function getquelist_ids_dbtype(typename){
	  		var db_ids_temp = {};
			var db_ids_1 = "";
			var db_ids_2 = "";
			 
			$('#objs_type_'+typename).children('ul').children().each(function(i2, e2) { 
				var s1 = $(e2).children('div:first').attr("id");
				var s3 = $(e2).children('div:first').attr("dbtype");
				 
				if(s3==1){
					db_ids_1 += '"'+s1.split("ques_")[1]+'",';	
				}else if(s3==2){
					db_ids_2 += '"'+s1.split("ques_")[1]+'",';
				}
			});
			if(db_ids_1!=null&&db_ids_1!=""){
				db_ids_1 = db_ids_1.substring(0,db_ids_1.length-1);
			}
			if(db_ids_2!=null&&db_ids_2!=""){
				db_ids_2 = db_ids_2.substring(0,db_ids_2.length-1);
			}
			
			db_ids_temp = {'db_ids_1':db_ids_1,'db_ids_2':db_ids_2};
			return db_ids_temp;
		 
}

function Release() {//下一步
    var ids = "";
    $.each($('.hiddenID'), function (index, value) {
        ids += "," + $(this).val(); //循环遍历取出ID
    });
    //ajax 去后台插入数据到数据。
//    $.ajax({
//        url: '/restAPI/class/list', //url访问地址
//        type: "GET",
//        data: {
//            IDS: ids//
//        },
//        dataType: "json",
//        success: function (result) {//
//        }
//    });
    document.location.href = "OperationArea.html";
  
}

//计算难易度
function  difficultyCount(){
	var diff_temps = 0;
	var d_i = 0;
	$('#test').children().children().each(function(index, element) {
        $(element).children('ul').children().each(function(ind_1, e_11) {
			d_i++;
            diff_temps += parseInt($(e_11).children('div:first').attr("diff"));
			 
        });
    });
	$('#difs').text((diff_temps/d_i).toFixed(2));
		
}


        
function bindAnswerShowHide()//答案显示
{
    $(".showAnswer").toggle(    

		 function ()
		 {
			 var valueid = $(this).attr('value');    //取得答案设置的时候的id值
			 $('#divAnswer' + valueid).show();  
		 },
		function ()
		{
			var valueid = $(this).attr('value');
			$('#divAnswer' + valueid).hide();
		}
		);
}	
		
	

function ASave(){
	difficultyCount();
	var paper_idss = [{'dbtype':'1','ids':[]},{'dbtype':'2','ids':[]}];
	var queorder = [];
	var objective_score = 0;
	var subjective_score = 0;
	if($('#test').children().length==0){
		$.messager.alert('温馨提示','试题不能为空！','info');
		return false;
		
	}
	$('#test').children().children().each(function(i1,e1) {
		if($(this).attr("id")!=""){
			var temptype = $(this).attr("id").split('objs_type_');
			 
			var  sun = $('#suns_'+temptype[1]).text();
			var sc = 0;
			var temp_ttt = {};
			if(data_test.testtype==1){
				sc = $('#score_'+temptype[1]).text();
			}else{
				sc = 0;
			}
			 
			temp_ttt = {'typename':temptype[1],'sorceP':parseInt(sc)/parseInt(sun),'sum':sun,'sorces':sc,'ids':[]};
			var s_t = $(e1).children('ul').children('li:first').children('div:first').attr("Tflg");
			 
			$(e1).children('ul').children().each(function(i2, e2) { 
				var s1 = $(e2).children('div:first').attr("id");
				var s2 = $(e2).children('div:first').attr("qtype");
				var s3 = $(e2).children('div:first').attr("dbtype");
				var s4 = $(e2).children('div:first').attr("Tflg");
				temp_ttt.ids.push({'id':s1.split('ques_')[1],'dbtype':s3});
				
				if(s3==1){
					paper_idss[0].ids.push(s1.split('ques_')[1]);
				}else{
					paper_idss[1].ids.push(s1.split('ques_')[1]); 
				}
				 
			});
			if(s_t==1){
				objective_score += parseInt(sc);
			}else{
				subjective_score += parseInt(sc);
			}
			queorder.push(temp_ttt);
		}
    });
	
	var url_type = "/examination_paper";
	var TestQjson = {'action':'maual','exam_name':data_test.testname,'exam_type':data_test.testtype,'build_type':0,'subject_id':data_test.subject_id,'grade_id':data_test.grade_id,'condition':{'data_test':data_test,'queTwo':T_stup_2_data,'queThree':Base64.encode(JSON.stringify(queorder)),'objective_score':objective_score,'subjective_score':subjective_score,'score':(parseInt(objective_score)+parseInt(subjective_score))},'content':paper_idss,'difficulty':$('#difs').text(),'score':(parseInt(objective_score)+parseInt(subjective_score)),'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
	
	//test_Send{} 跳转到下一个页面使用
	var Test_Send = {'name':data_test.testname,'exer_type':data_test.testtype,'grade_id':data_test.grade_id,'subject_id':data_test.subject_id,'field':data_test.tab_Sid,'tmod':0,'creat_date':getNowDate(),'condition':{'data_test':data_test,'queTwo':T_stup_2_data,'queThree':Base64.encode(JSON.stringify(queorder)),'objective_score':objective_score,'subjective_score':subjective_score,'score':(parseInt(objective_score)+parseInt(subjective_score))},'content':paper_idss,'score':(parseInt(objective_score)+parseInt(subjective_score))};
	 
	 
	if(back_testid!=""&&back_testid!=undefined&&back_testid!=0){
		TestQjson['ti_id'] = back_testid;
		$.messager.confirm('试卷名称修改','<span>试卷名称:<input type="text" id="newName" value="'+data_test.testname+'" /></span>',function(b){
			
			if(b){
				var newsNames = $('#newName').val();
				if(newsNames!=data_test.testname){
					TestQjson.exam_name = newsNames;
					Test_Send.name = newsNames;
				}
				$.ajax({
					url: Webversion + url_type,
					type: "POST",
					dataType: "json",
					data:TestQjson,
					success: function (result) {
						 Test_Send['id'] = result.ti_id;
						 document.location.href = "TestEnd.html?rowdata=" + Base64.encode(JSON.stringify(Test_Send));
					},
					error: function (result) {
						
						$.error('加载数据失败！');
					}
				});	
				
				
			}else{
				$.ajax({
					url: Webversion + url_type,
					type: "POST",
					dataType: "json",
					data:TestQjson,
					success: function (result) {
						 Test_Send['id'] = result.ti_id;
						 document.location.href = "TestEnd.html?rowdata=" + Base64.encode(JSON.stringify(Test_Send));
					},
					error: function (result) {
						
						$.error('加载数据失败！');
					}
				});	
			}
		 
		});
	}else{
		$.ajax({
			url: Webversion + url_type,
			type: "POST",
			dataType: "json",
			data:TestQjson,
			success: function (result) {
				 Test_Send['id'] = result.ti_id;
				 document.location.href = "TestEnd.html?rowdata=" + Base64.encode(JSON.stringify(Test_Send));
			},
			error: function (result) {
				
				$.error('加载数据失败！');
			}
		});	
	}
	//alert(JSON.stringify(TestQjson));
	//alert(JSON.stringify(Test_Send));
	
	
	//document.location.href = "GroupRollCenter.html";
}

function Error(errorID){//报错的点击形式
    $("#divError").dialog('open');
	$('#divError').show();
    errorSubjectID = errorID;
}

function ErrorOK(){
     
	 $.ajax({
		 url: Webversion + '/examination_paper' , //url访问地址
		 type: "POST",
		 data: {'action':'feedback','ti_id':errorSubjectID,'content':$('#ErrorReason').val()},
		 dataType: "json",
		 success: function (result) {
			   
			  $.messager.alert('温馨提示','题目报错,提交成功！','info');
			  $("#divError").dialog('close');
	  		  $('#divError').hide();
			  
		 }
	 });
	  $("#divError").dialog('close');
	  $('#divError').hide();
}

function ErrorCancel(){
    $("#divError").dialog('close');
	$('#divError').hide();
}


function FormationTest(event)
{//生成移动端
   
MobileWord(1);
}

function MobileWord (sType){//移动版和word版共同调用的
  //1--往手机分发作业
 //2--生成word
		 var ids = "";

    $.each($('.hiddenID'), function (index, value)
    {
        ids += "," + $(this).val(); //循环遍历取出ID

    });

    ids = ids.substring(1, ids.length);
    $.cookie('classIDS');     //班级对象IDS  格式 1,2,3
    $.cookie('studentIDS');    //学生对象IDS 格式 1,2,3
    $.cookie('PaperName'); //试卷名称
    $.cookie("subjectId"); //学科
    $.cookie('subjectType');    //出题范围
    $.cookie('PaperType');  //作业类型
   
    var option;
    if ($.cookie('SendObject') == "class")
    {
        option = {
            "ti_id": ids,
            "class_id": $.cookie('classIDS'),
            "exam_name": $.cookie('PaperName'),
            "subject_id": $.cookie("subjectId"),
            "field": $.cookie('subjectType'),
            "exer_type": $.cookie('PaperType'),
			"assign_type":sType
        };
    }
    else
    {
        option = {
            "ti_id": ids,
            "student_id": $.cookie('studentIDS'),
            "exam_name": $.cookie('PaperName'),
            "subject_id": $.cookie("subjectId"),
            "field": $.cookie('subjectType'),
            "exer_type": $.cookie('PaperType'),
			"assign_type":sType
        };
    }
   
   
    //	//alert($.cookie('classIDS')+','+$.cookie('studentIDS')+','+$.cookie('PaperName')+','+$.cookie("subjectId")+','+$.cookie('subjectType')+','+$.cookie('PaperType')+','+$.cookie('SendObject'));
    //ajax 去后台插入数据到数据。
    $.ajax({
        url: Webversion + '/exam/maual', //url访问地址
        type: "POST",
        data: option,
        dataType: "json",
       /*  statusCode: {
            201: function ()
            {

                $.messager.alert('温馨提示', '组卷创建成功！', 'info',
                            function ()
                            {
                                document.location.href = "GroupRollCenter.html";
                            });
            }
        }, */
        success: function (result)
        {
			
							     if(sType==2){
											if (result && result.url && $.trim(result.url).length > 0) {
												$.messager.alert('温馨提示', '系统生成的WORD文档成功！', 'info',
												 function ()
												{   
														//alert("3"+result.url);
													   document.location.href = result.url ;  //"http://test.hxpad.com/word/1358416076YTSktg.doc"
																//alert("4");
														$.messager.alert('温馨提示', '下载word成功！', 'info',
														 function ()
														 {
															  document.location.href = "GroupRollCenter.html";
														 });					
												 }); 
                                            }
                                             else {
                                                 $.messager.alert('温馨提示', '系统生成的WORD文档为空！');
                                            }
								 }
								 else{
									//alert("1");
								     $.messager.alert('温馨提示', '组卷创建成功！', 'info',
									 function ()
									 {
										  document.location.href = "GroupRollCenter.html";
									 });
								 }
								 
								
        }
    });

}




  
//上一步 
function stepup(){
	$.messager.confirm('温馨提示','返回上一步,不保存此页面的内容！<br />确认返回上一步吗？',function(f){
		 if(f){
			document.location.href = "TestPaper.html?data_test=" + temp_test;
		 }
	 });
	 
}
  
  