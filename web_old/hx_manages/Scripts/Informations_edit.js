 var UserInfo = "";
 var pager = "";
  var centerAll = "";
  var temp_data = "";
$().ready(function() {
	 
	   
	  temp_data = $.parseJSON(getUrlParam("data"));
      UserInfo = $.evalJSON($.cookie("UserInfo"));
	  KindEditor.ready(function(K) {
		 	window.editor = K.create('#answerArea');
			$("#inform_title").val(Base64.decode(temp_data.news_title));
			$("#inform_date").datebox("setValue",temp_data.end_time);
			editor.html(Base64.decode(temp_data.content));
	  });
	  if(UserInfo.level==2||UserInfo.level==4){
	  	centerAll = $.evalJSON($.cookie("centerAll"));
		UserInfo['center_id'] = centerAll.center_id;
	  }
	   //显示添加新闻板块
	  $('#informations_demo').datagrid({
		title:"&nbsp;通知(公告)&nbsp;>>&nbsp;添加通知(公告)",
		collapsible:true,
	    toolbar: '#informations',
		onOpen:function(){
			var temp_ids = $.parseJSON(temp_data.ids);
			if(UserInfo.level==1){
				var zones_url = '/center_zone';
				var zones_json = {'action':'list','condition':''};
				var zones = Ajax_Question(zones_url,zones_json);
				var zoneshtmls = '<td style="width: 100px;text-align:right;border:1px solid #ffffff;height:25px;">通知接收校区:</td><td style="width: 150px;text-align:left;border:1px solid #ffffff;height:25px;">';
				if(zones.list!=null&&zones.list!=""){
					$.each(zones.list,function(i_0,n_0){
						var  j = 0;
						$.each(temp_ids.zoneids,function(ii,nn){
							 
							if(nn==n_0.id){
								zoneshtmls += '<input type="checkbox" name="checkbox1" classname="'+n_0.zone_name+'" value="'+n_0.id+'" checked="checked">'+n_0.zone_name+'&nbsp;';
								j++;
							}
						});	
						if(j==0){
							zoneshtmls += '<input type="checkbox" name="checkbox1" classname="'+n_0.zone_name+'" value="'+n_0.id+'">'+n_0.zone_name+'&nbsp;';	
						}
					
					});
				}
				zoneshtmls += '</td>';
				$('#zone_class').html(zoneshtmls); 
			}else if(UserInfo.level==2){
				var class_url = '/class';
				 
				var class_json = {'action':'current_stu_class','condition':'center_id^'+UserInfo.center_id+'$zone_id^'+$('#A_zones',window.parent.document).find("option:selected").val()};
				var classes = Ajax_Question(class_url,class_json);
				var classeshtmls = '<td style="width: 100px;text-align:right;border:1px solid #ffffff;height:25px;">通知接收班级:</td><td style="width: 150px;text-align:left;border:1px solid #ffffff;height:25px;">';
				if(classes.list!=null&&classes.list!=""){
					$.each(classes.list,function(i_1,n_1){
						var jj = 0;
						$.each(temp_ids.classids,function(iii,nnn){
							if(nnn==n_1.class_id){
								classeshtmls += '<input type="checkbox" name="checkbox1" classname="'+n_1.class_name+'" value="'+n_1.class_id+'" checked="checked">'+n_1.class_name+'&nbsp;';
								jj++;
								 
							}
						});
						if(jj==0){
							classeshtmls += '<input type="checkbox" name="checkbox1" classname="'+n_1.class_name+'" value="'+n_1.class_id+'">'+n_1.class_name+'&nbsp;';
						}
					});
				}
				classeshtmls += '</td>';
				$('#zone_class').html(classeshtmls);
			}else if(UserInfo.level==4){
				
				var class_url = '/class';
				 
				var class_json = {'action':'current_stu_class','condition':'center_id^'+UserInfo.center_id+'$zone_id^'+$('#A_zones',window.parent.document).find("option:selected").val()+'$user_id^'+UserInfo.id,'fresh':1};
				var classes = Ajax_Question(class_url,class_json);
				var classeshtmls = '<td style="width: 100px;text-align:right;border:1px solid #ffffff;height:25px;">通知接收班级:</td><td style="width: 150px;text-align:left;border:1px solid #ffffff;height:25px;">';
				if(classes.list!=null&&classes.list!=""){
					$.each(classes.list,function(i_1,n_1){
						classeshtmls += '<input type="checkbox" name="checkbox1" classname="'+n_1.class_name+'" value="'+n_1.class_id+'">'+n_1.class_name+'&nbsp;';
					});
				}
				classeshtmls += '</td>';
				$('#zone_class').html(classeshtmls);
			}
		}
		 
	  });
	
	//返回上一页  
	$('#resetbtn').click(function(){
		 window.location="Informations.html";
	});  
    
});


 
//插入通知列表
function publish_message(){
	var title = $("#inform_title").val();
	var editorhtml = editor.html();
	var endtime = $("#inform_date").datebox("getValue");
	var classes = [];
	var classnames = [];
	$('input[type=checkbox]:checked').each(function(index, element) {
        classes.push($(this).val());
		classnames.push($(this).attr("classname"));
    });
	if(title==null||title==""){
		$.messager.alert('温馨提示','标题不能为空！','info');
		return;
	}
	if(editorhtml==null||editorhtml==""){
		$.messager.alert('温馨提示','内容不能为空！','info');
		return;
	}
	if(classes==null||classes==""){
		$.messager.alert('温馨提示','多选不能为空！','info');
		return;
	}
	if(endtime==null||endtime==""){
		$.messager.alert('温馨提示','截止时间不能为空！','info');
		return;
	}
	
	var data = {};
	
    data.action = 'edit';
	data.noticeid = temp_data.id;
	data.center_id = UserInfo.center_id;
    data.title = Base64.encode(title);
    data.content = Base64.encode(editorhtml);
    data.expire_date = endtime;
	if(UserInfo.level==1){
		data.zone_id = 0;
		data.to = JSON.stringify({'zoneids':classes,'names':classnames});
	}else if(UserInfo.level==2||UserInfo.level==4){
		data.zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
		data.to = JSON.stringify({'classids':classes,'names':classnames});
	}
	var url_type = '/notice';
	 
	var res = Ajax_option(url_type,data,"POST");
	if(res.flag){
		$.messager.alert('温馨提示','修改成功','info');
		window.location = 'Informations.html';
 	}else{
		$.messager.alert('温馨提示','修改失败','info');
	}
	
}

 