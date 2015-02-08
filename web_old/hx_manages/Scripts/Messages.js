var UserInfo={};
var centerAll={};
var page = ""; 
$().ready(function() {
	  KindEditor.ready(function(K) {
	     window.editor = K.create('#answerArea');
					
	  });
      UserInfo = $.evalJSON($.cookie("UserInfo"));
	  centerAll = $.evalJSON($.cookie("centerAll"));
	  
	  var columnsjson = [[ 
		    { field: 'news_title', title: '通知标题', width: 200, align: 'center', sortable: true },
			
			{ field: 'mobile', title: '状态', width: 70, align: 'center', sortable: true, 
				formatter: function (value, row, index) {
                    var html = '';
                    html = value == 0 ? '显示中' : '<font color="#a9a9a9">已过期</font>';
                    return html;
                }
			},
			{ field: 'send_School', title: '接收校区', width: 120, align: 'center', sortable: true },
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
			},
			{ field: 'creat_time', title: '发布时间', width: 80, align: 'center'},
			{ field: 'end_time', title: '截止时间', width: 80, align: 'center' },
			{ field: 'id', title: '操作', width: 90, align: 'center', 
				formatter: function (value, row, index) {
					 
					var s ="<a href=\"#\" style='color:blue;' onclick=\"selectNews('" + value + "'," + index + ")\">查看</a>&nbsp;";
					if(row.mobile!=1){
                    	s += "<a href=\"#\" style='color:blue;' onclick=\"editNews('" + value + "'," + index + ")\">修改</a>";
					}else{
						s += "<font color='#a9a9a9'>修改</font>";
					} 
					s+="&nbsp;<a href=\"#\" style='color:blue;' onclick=\"deleteNews('" + value + "'," + index + ")\">删除</a>";
                    return s;
                }
			}
			
        ]];

		var url = '../data/informations.json';
		var datacc = {'action':'list','condition':""};
		var functionres = 'Longding(result);';
		
		//加载列表  并且返回pager
    	pager = datagridLoad('#informations_list',true,'#informations_bar',columnsjson,url,"GET","json",datacc,functionres) ;
	  
	   
    

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


//加载列表俺分页的形式显示
function Longding(result){

     var datalistTemp = [];
			if(result!=null){
			  
            	$.each(result.schools,function(i,n){
						var itemtemp = {};
                       
                        itemtemp.news_title = n.news_title;
						itemtemp.creat_time = n.creat_time;
						itemtemp.end_time = n.end_time;
						itemtemp.mobile = n.mobile;
						itemtemp.send_School = n.send_School;
						itemtemp.send_Stu = n.send_Stu;
						itemtemp.send_patriarch = n.send_patriarch;
						itemtemp.id = n.id;
						
						datalistTemp.push(itemtemp);
				
				});
			}
			return  datalistTemp;

}




// 查看校区内容
function selectNews(value, index) {

    $.messager.progress({text:'正在获取校区信息'});
    // 获取校区相关数据
    var rowData = ($('#schoolmanager').datagrid('getData').rows)[index];

    $("#See_wdialog").dialog({
        iconCls: 'icon-save',
        title: '查看个人信息',
        width: 520,
        height: 250,
        closed: true,
        cache: false,
        modal: true,
        onOpen: function () {
            $.messager.progress('close');
            $('#wdialog').val(rowData.name);
        },
        buttons: [
            /*{text: '关闭',
            iconCls: 'icon-ok',
            handler: function () {

                $.messager.progress({ text: '系统正在处理' });

                var paramesTempVis = { 'school_name': $('#AleInputSchoolName').val(), 'school_id': rowData.school_id };

               $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: Webversion + "/school?_method=PUT" ,
                    data: paramesTempVis,
                    success: function (result) {
                        $.messager.progress('close');
                        $('#SeltSchoolName').dialog('close');
                        $.remind('校区名称修改成功！');
                        var pager = $('#Educational_Set').datagrid("getPager");
                        pager.pagination("select");
                    }, error: function (result) {
                        $.messager.progress('close');
                        $.error('系统出现异常，校区名称修改失败！');
                    }
                });

            }
        },*/
        {
            text: '关闭',
            iconCls: 'icon-ok',
            handler: function () {
                $('#See_wdialog').dialog('close');
            }
        }]
    });

    $('#See_wdialog').dialog('open');

}


// 修改校区名称
function editNews(value, index) {
     
    var rowData = ($('#informations_list').datagrid('getData').rows)[index];
    $.cookie("InformValue",value,{path:"/"});
	$.cookie("InformrowIndex",index ,{path:"/"});
	$.cookie("InformrowData",rowData ,{path:"/"});
	 
	//window.location.href="DoHomework.html";
	window.location.href="News_edit.html";
     

}