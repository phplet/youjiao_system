 var UserInfo = "";
 var pager = "";
  var centerAll = "";
$().ready(function() {
	 
	  KindEditor.ready(function(K) {
	     window.editor = K.create('#answerArea');
					
	  });
      UserInfo = $.evalJSON($.cookie("UserInfo"));
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
			 
			if(UserInfo.level==1){
				var zones_url = '/center_zone';
				var zones_json = {'action':'list','condition':''};
				var zones = Ajax_Question(zones_url,zones_json);
				var zoneshtmls = '<td style="width: 100px;text-align:right;border:1px solid #ffffff;height:25px;">通知接收校区:</td><td style="width: 150px;text-align:left;border:1px solid #ffffff;height:25px;">';
				if(zones.list!=null&&zones.list!=""){
					$.each(zones.list,function(i_0,n_0){
						zoneshtmls += '<input type="checkbox" name="checkbox1" value="'+n_0.id+'" classname="'+n_0.zone_name+'">'+n_0.zone_name+'&nbsp;';
					});
				}
				zoneshtmls += '</td>';
				$('#zone_class').html(zoneshtmls); 
			}else if(UserInfo.level==2){
				var class_url = '/class';
				 
				var class_json = {'action':'current_stu_class','condition':'center_id^'+UserInfo.center_id+'$zone_id^'+$('#A_zones',window.parent.document).find("option:selected").val()};
				var classes = Ajax_Question(class_url,class_json);
				var classeshtmls = '<td style="width: 100px;text-align:right;border:1px solid #ffffff;height:25px;">通知接收班级:</td><td style="text-align:left;border:1px solid #ffffff; line-height:30px;">';
				var bclasseshtmls ="";
				var sclasseshtmls ="";
				if(classes.list!=null&&classes.list!=""){
					 
					$.each(classes.list,function(i_1,n_1){
						if(n_1.class_type==1){
							if(date_Diff_day(getNowDate(),n_1.end_date.substring(0,10))==1){
								bclasseshtmls += '<input type="checkbox" name="checkbox1" classname="'+n_1.class_name+'" value="'+n_1.class_id+'">'+n_1.class_name+'&nbsp;';
							}
						}else{
							sclasseshtmls += '<input type="checkbox" name="checkbox1" classname="'+n_1.class_name+'" value="'+n_1.class_id+'">'+n_1.class_name+'&nbsp;';
						}
					});
				}
				if(bclasseshtmls!=""){
					classeshtmls += '当前'+public_Bigclass_name+'：'+bclasseshtmls;
				}
				if(sclasseshtmls!=""){
					classeshtmls += '<br />当前1对1班：'+sclasseshtmls;
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
	  
	   var tempcolumns = [[ 
		    { field: 'news_title', title: '通知标题', width: 300, align: 'center', sortable: true },
			
			{ field: 'mobile', title: '状态', width: 70, align: 'center', sortable: true, 
				formatter: function (value, row, index) {
                    var html = '';
                    html = value == 0 ? '显示中' : '<font color="#a9a9a9">已过期</font>';
                    return html;
                }
			},
			/*{ field: 'send_School', title: '接收校区', width: 120, align: 'center', sortable: true },
			{ field: 'send_Stu', title: '过往学员', width: 60, align: 'center' , 
				formatter: function (value, row, index) {
                    var html = '';
                    html = value == 0 ? '是' : '<font color="#a9a9a9">否</font>';
                    return html;
                }
			},
			{ field: 'send_patriarch', title: '发送短信', width: 60, align: 'center', sortable: true, 
				formatter: function (value, row, index) {
					//alert(JSON.stringify(rowdate));
                    var html = '';
                    html = value == 0 ? '是' : '<font color="#a9a9a9">否</font>';
                    return html;
                }
			},*/
			{ field: 'send_name', title: '接收范围', width: 120, align: 'center'},
			{ field: 'creat_time', title: '发布时间', width: 120, align: 'center'},
			
			{ field: 'content', title: 'content', width: 80,hidden:true},
			{ field: 'ids', title: 'ids', width: 80,hidden:true},
			{ field: 'end_time', title: '截止时间', width: 120, align: 'center' },
			{ field: 'create_by', title: 'create_by', width: 120,hidden:true},
			{ field: 'id', title: '操作', width: 120, align: 'center', 
				formatter: function (value, row, index) {
					 
					var s ="<a href=\"#\" style='color:blue;' onclick=\"selectNews('" + value + "'," + index + ")\">查看</a>&nbsp;";
					if((row.create_by==UserInfo.id)){
                    	s += "<a href=\"#\" style='color:blue;' onclick=\"editNews('" + value + "'," + index + ")\">修改</a>";
					}else{
						s += "<font color='#a9a9a9'>修改</font>";
					} 
                    return s;
                }
			}
			
        ]];
	
	
	var url = 'Webversion + "/notice?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc = {'center_id':UserInfo.center_id,'user_id':UserInfo.id};
	if(UserInfo.level==2||UserInfo.level==4){
		var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val();
		datacc['zone_id'] = select_zoneid;
	} 
	
	var functionres = 'Longding(result);';
		
	//新闻列表加载  并且返回pager
    pager = datagridLoad('#informations_list',false,'#informations_bar',tempcolumns,url,"GET","json",datacc,functionres) ;
	 
	$('#info_status').combobox({
		data:[{'id':'请选择','name':'请选择'},{'id':'0','name':'显示中'},{'id':'1','name':'过期'}],
			valueField:'id',
			textField:'name',
		onLoadSuccess:function(){
			 
			$('#info_status').combobox('setValue','0');
		},
		onChange:function(newvalue,oldvalue){
			if(newvalue!='请选择'){
				var dataccc = {'center_id':UserInfo.center_id,'user_id':UserInfo.id,'is_expire':newvalue};
				if(UserInfo.level==2){
					 
					dataccc['zone_id'] = select_zoneid;
				} 
				 pager = datagridLoad('#informations_list',false,'#informations_bar',tempcolumns,url,"GET","json",dataccc,functionres) ;
			}
		}	
	});
	
	

    // 绑定搜索事件
    $("#BtnSearch").click(function () {

        if ($("#SchoolText").attr("innt") == "1") {
            $.messager.alert('温馨提示', '请输入姓名再搜索！', 'info');
            return;
        }

        $.messager.progress({ text: '正在搜索校区信息' });

        $('#BtnSearch').datagrid("getPager").pagination("select", 1);

        $.messager.progress('close');

    });
     
    
});


//加载列表分页的形式显示
function Longding(result) {
 
    
            var datalistTemp = [];
			if(result.list!=null){
			  
            	$.each(result.list,function(i,n){
						var itemtemp = {};
                       
                        itemtemp.news_title = Base64.decode(n.title);
						itemtemp.creat_time = n.create_time.substring(0,10);
						itemtemp.end_time = n.expire_date.substring(0,10);
						itemtemp.content = n.content;
						itemtemp.ids = n.to_target;
						var mobile = "";
						itemtemp.create_by = n.create_by;
						itemtemp.mobile = date_Diff_day(n.expire_date.substring(0,10),getNowDate());
						//itemtemp.send_School = n.send_School;
						//itemtemp.send_Stu = n.send_Stu;
						//itemtemp.send_patriarch = n.send_patriarch;
						if($.parseJSON( n.to_target).names){
							itemtemp.send_name = ($.parseJSON( n.to_target).names).join('<br />');
						}
						
						itemtemp.id = n.noticeid;
						
						datalistTemp.push(itemtemp);
				
				});
			}
			//alert(JSON.stringify(datalistTemp));
     		return datalistTemp;

}

//插入通知列表
function publish_message(){
	var title = $("#inform_title").val();
	var editorhtml = editor.html();
	var endtime = $("#inform_date").datebox("getValue");
	var classes = [];
	var classes_names = [];
	$('input[type=checkbox]:checked').each(function(index, element) {
        classes.push($(this).val());
		classes_names.push($(this).attr("classname"));
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
		if(UserInfo.level==1){
			$.messager.alert('温馨提示','没有选择校区！','info');
			return;
		}
		else if(UserInfo.level==2||UserInfo.level==4){
			$.messager.alert('温馨提示','没有选择班级！','info');
			return;
		}
	}
	if(endtime==null||endtime==""){
		$.messager.alert('温馨提示','截止时间不能为空！','info');
		return;
	}
	
	var data = {};
    data.action = 'add';
	data.center_id = UserInfo.center_id;
    data.title = Base64.encode(title);
    data.content = Base64.encode(editorhtml);
    data.expire_date = endtime;
	if(UserInfo.level==1){
		data.zone_id = 0;
		data.to = JSON.stringify({'zoneids':classes,'names':classes_names});
	}else if(UserInfo.level==2||UserInfo.level==4){
		data.zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
		data.to = JSON.stringify({'classids':classes,'names':classes_names});
	}
	var url_type = '/notice';
	 
	var res = Ajax_option(url_type,data,"POST");
	if(res.flag){
		$.messager.alert('温馨提示','添加成功','info');
		$("#inform_title").val("");
		editor.html("");
		$('#inform_date').datebox('setValue',getNowDate());
		$('#zone_class input[type="checkbox"]:checked').each(function(index, element) {
            $(element).attr("checked",false);
        });
	}else{
		$.messager.alert('温馨提示','添加失败','info');
	}
	pager.pagination("select",1);
}

// 查看新闻
function selectNews(value, index){
 	var rowData = ($('#informations_list').datagrid('getData').rows)[index];
	rowData['news_title'] = Base64.encode(rowData.news_title);
	window.location="News_sel.html?data="+JSON.stringify(rowData);
}


// 修改新闻
function editNews(value, index) {
    var rowData = ($('#informations_list').datagrid('getData').rows)[index];
	rowData['news_title'] = Base64.encode(rowData.news_title);
	window.location="Informations_edit.html?data="+JSON.stringify(rowData);
}

//删除新闻

function deleteNews(value, index){
	 
	$.ajax({
        url: Webversion+'/notice',
        type: "POST",
        dataType: "json",
        data: {action:"del",newsid:parseInt(value)},
        success: function (result) {
			$('#informations_list').datagrid('deleteRow',index);
        },
        error: function (result) {

        }
    });

}