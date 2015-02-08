var UserInfo = {};
var centerAll = {};
var pager="";
var class_names = "";

$().ready(function () {
	 
    UserInfo = $.evalJSON($.cookie("UserInfo"));
    centerAll = $.evalJSON($.cookie("centerAll"));
	//判断是不是一对一学生
	var tabs_name = $('#feature', window.parent.document).tree('getSelected');
	var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val();
	var selcenter_id = centerAll.center_id;
	
	var Qjson = {};
	if(($(tabs_name.target).text())=='一对一学生管理'){
		$('#stu_title').html('&nbsp;&nbsp;班级与学生管理&nbsp;>>&nbsp;一对一学生管理&nbsp;>>&nbsp;学生管理');
		Qjson = {'action':'list','condition':'center_id^'+selcenter_id+'$zone_id^'+select_zoneid+'$class_type^2$user_id^'+UserInfo.id};
		class_names = Base64.encode(UserInfo.realname);
		
	}else{
		var cid = getUrlParam("cid");
		class_names = getUrlParam("classname");
		$('#stu_title').html('&nbsp;&nbsp;班级与学生管理&nbsp;>>&nbsp;'+public_Bigclass_name+'管理&nbsp;>>&nbsp;当前班级&nbsp;>>&nbsp;学生管理');
		Qjson = {'action':'list','fresh':1,'condition':'center_id^'+selcenter_id+'$zone_id^'+select_zoneid+'$class_type^1$class_id^'+cid};
	}
	showstus(Qjson);  //加载学生列表
	

});

//加载学生列表
function showstus(Qjson){
	var url_type = '/student';
	var stu_res = Ajax_option(url_type,Qjson,"GET");
	var htmls = "";
	if(stu_res.list!=null&&stu_res.list!=""){
	$.each(stu_res.list,function(i,n){
		var n_create_date = n.create_date;
		if(n_create_date!=""&&n_create_date!=null){
			n_create_date = n.create_date.substring(0,10);	
		}
		htmls += '<li class="text_float class_width"><div class="calss_info"><table border="0" cellpadding="0" cellspacing="0" style="line-height:22px;" width="220"><tr><td width="70" >'+(n.gender==1?'<img src="../images/man.jpg" width="70" height="70" />':'<img src="../images/women.jpg" width="70" height="70" />')+'</td><td width="60" align="right" style="word-wrap:break-word;">用户名：<br />姓名：<br />昵称：</td><td width="90"><div style="width:90px; line-height:20px;" title="'+n.username+'">'+autoAddEllipsis(n.username,13)+'</div><div>'+n.realname+'<br />待定</div></td></tr><tr><td>'+(n.gender==1?'男':'女')+'&nbsp;--岁</td><td >入班时间：</td><td>'+n_create_date+'</td></tr></table></div><div class="class_link"><div><span>当前年级：'+edu_grade_stu(parseInt(n.grade))+'</span><br /><span>在读学校：'+n.school_name+'</span><br /><span>学生最近登录时间：'+n.last_login_time+'</span></div><div><a href="javascript:void(0);" onclick="reSetPass('+n.student_user_id+',\'/center_admin\');" >重置密码</a>&nbsp;<a href="javascript:void(0);" onclick="student_One(\''+Base64.encode(JSON.stringify(n))+'\',\''+class_names+'\');">查看详细</a>&nbsp;</div></div></li><li class="text_float class_margin">&nbsp;</li>';
		//<tr><td colspan="3" align="center"><span><img src="../images/news.gif" width="25" height="12"/>&nbsp;<a href="#">有新交作业！</a></span>&nbsp;&nbsp;<span><img src="../images/message.gif" width="25" height="12"/>&nbsp;<a href="#">有新消息！</a></span></td></tr><a href="javascript:void(0);" onclick="send_message();">发消息</a>&nbsp; <br /><span>最近发送报告时间：2013-05-12</span>
	});
	
	}else{
		htmls = '没有学生！';
	}
	$('#stus_show').html(htmls);
	
}

//发送消息
function send_message(uid,name){
	 
	 $('#send_messages').css('display','block');
	 var sendOpen = "sendOpen("+uid+",'"+name+"');";
	 var sendHand = "sendHand("+uid+");";
	 alertCreate("#send_messages",'给学生发送消息窗口',450,280,sendOpen,sendHand,'发送','取消');
	 $('#send_messages').dialog('open');
}
//发送消息页面加载操作
function sendOpen(uid,name){
	$('#send_uid').val(uid);
	$('#send_Name').val(name);
	$('#send_content').val(""); //清空文本域
	var send_YN = $('input[name=send_P]').attr('checked',false);
}
//发送消息页面发送操作
function sendHand(uid){
	var uid = $('#send_uid').val();
	var send_name = $('#send_Name').val();
	var send_content = $('#send_content').val();
	var send_YN = $('input[name=send_P]:checked').val();
	 
	//do something
	
	
}



//跳转

function student_One(sdata,name){
	 
	  window.location="Student_One.html?data="+sdata+"&classname="+name;
	  
}
