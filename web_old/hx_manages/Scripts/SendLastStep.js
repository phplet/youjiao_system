var UserInfo = null;
var centerAll = null;
var rowsdata = "";
var datas = {};
$().ready(function (){
 	UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
	centerAll = $.evalJSON($.cookie("centerAll")); //取得登录人信息
	var UserLevel = parseInt(UserInfo.level);  //登录人的权限
	datas = $.parseJSON(Base64.decode(getUrlParam("data_T")));
	rowsdata = $.parseJSON(Base64.decode(getUrlParam("rowdata")));
	
	if(datas.type_select==0){
		$('#class_t').html('派送班级：'); 
	}else{
		$('#class_t').html('派送学生：');	
	}
	$('#class_name').html(datas.class_name);
	$('#center_name_2').html(centerAll.center_name+'&nbsp;：'+$('#A_zones',window.parent.document).find("option:selected").text());
	$('#test_name').html(rowsdata.name);
	$('#time_now').html("当前时间："+getNowDate());//当前时间
	
   	
	$('#send_Ok').unbind('click');
	$('#send_Ok').bind('click',function(){
		getValues();
	});
	
	$('#send_up').unbind('click');
	$('#send_up').bind('click',function(){
		setreturn();
	});
 
});  /////////////////////////////////////////////////////////////////////////////////////.ready的结束标签




//下一步
function getValues(){
 
	 var Send_types = $('#SendWay input[type=radio]:checked').val();
	 var Send_time = $('#endtime').datebox('getValue');
	 if(Send_time!=""&&(date_Diff_day(getNowDate(),Send_time))==1&&Send_types!=""){
		 
		 send_ok(datas.type_select,Send_types,datas.class_stus,Send_time,rowsdata);	
		 
	 }else{$.messager.alert('温馨提示','选派终端没选择或者结束时间比当前时间小,请核实后再提交!','info');}
	 
}



//assign_mode 0按班,1按人
function send_ok(assign_mode,Send_types,class_stus,Send_time,datass){

	var datacc1 = {'action':'dispatch','assign_mode':assign_mode,'assign_type':Send_types,'end_date':Send_time,'ti_id':datass.id,'assign_to':class_stus,'content':datass.content,'exam_type':datass.exer_type,'center_id':centerAll.center_id,'grade_id':datass.grade_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
	 
	 
	$.ajax({
        url: Webversion + '/examination_paper', //url访问地址
        type: "POST",
        data: datacc1,
        dataType: "json",
        success: function (result){
			$.messager.confirm('温馨提示','派送成功！确认-->派送列表,取消-->试卷列表！',function(b){
				if(b){
					window.location = "SendList.html";
				}else{
					window.location = "../TestCenter/GroupRollCenter.html";
				}
			});
			 

        }
    });

}



//返回上一步
function setreturn(){
	document.location.href = "SendStuList.html?data="+Base64.encode(JSON.stringify(datas));
}
