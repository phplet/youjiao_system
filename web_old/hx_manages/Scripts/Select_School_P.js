 
$().ready(function() {
      UserInfo = $.evalJSON($.cookie("UserInfo"));
      
     $('document').KeyInput($("#SchoolText"), '请输入姓名');
	  
    $('#Select_School_p').datagrid({   
        fit: true,
        remoteSort: false,
        toolbar: '#SerToolBar',
        pagination: true,
        rownumbers: true,
		singleSelect: true,
		title:"&nbsp;校区管理&nbsp;>>&nbsp;查看校区人员",
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...', 
        /*onClickRow: function (rowIndex, rowData) {
            $('#Educational_Set').datagrid("unselectRow", rowIndex);
        },*/
		
        columns: [[
		    { field: 'userName', title: '用户名', width: 120, align: 'center', sortable: true },
			{ field: 'realname', title: '姓名', width: 70, align: 'center'},
			{ field: 'subject', title: '学科', width: 70, align: 'center' },
			{ field: 'userEmail', title: '邮箱', width: 135, align: 'center' },
			{ field: 'creat_date', title: '注册时间', width: 70, align: 'center', sortable: true },
			{ field: 'bigSum', title: public_Bigclass_name+'数<br />(当前/过往)', width: 70, align: 'center', sortable: true },
			{ field: 'oneSum', title: '1对1学生数<br />(当前/过往)', width: 80, align: 'center', sortable: true },
			{ field: 'type', title: '角色', width: 80, align: 'center', sortable: true },
            {
                field: 'mobile', title: '状态', width: 80, align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    if (value != null) {
                        html = value == 1 ? '已启用/<a href="#">停运</a>' : '已停运/<a href="#">启用</a>';
                    }
                    return html;
                }
            },
            {
                field: 'school_id', title: '操作', align: 'center',
                formatter: function (value, row, index) {
                    var s = "<a href=\"../Corrects/Teacher_Corrects.html\" style='color:blue;'>教师批改统计</a>";
                       
                    return s;
                }
            }
        ]]
    });
	
	
	
    var pager = $('#Select_School_p').datagrid("getPager");
    pager.pagination({
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            var ltemp = (pageNumber - 1) * pageSize;
            LoadSchool(ltemp, pageSize);
            $(this).pagination('loaded');
        }
    });

    pager.pagination("select", 1);
    

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
function LoadSchool(s,l) {

    /*var url = Webversion + "/school/list/" + s + "," + l + "/uplevel_id/" + UserInfo.school_id ;
    var params = {};
    if ($("#SchoolText").attr("innt") != "1") {
        url = Webversion + "/school/list/" + s + "," + l + "/name" ;
        params.key = $.trim($("#SchoolText").val());
    }*/

   // params['r'] = $.getRom();

    // 加载数据列表
    $.ajax({
        url: '../data/Select_School_P.json',
        type: "GET",
        dataType: "json",
        //data: params,
        success: function (result) {
			 
            var datalistTemp = [];
			if(result!=null){
				 
            	$.each(result.schools,function(i,n){
						var itemtemp = {};
                        
                        itemtemp.userName = n.userName;
						itemtemp.realname = n.realname;
						itemtemp.subject = n.subject;
						itemtemp.userEmail = n.userEmail;
                        itemtemp.creat_date = n.creat_date;
						itemtemp.bigSum = n.bigSum;
						itemtemp.oneSum = n.oneSum;
						itemtemp.type = n.type;
						itemtemp.mobile = n.mobile;
						itemtemp.school_id = n.school_id;
                         
                         
                        datalistTemp.push(itemtemp);
				
				});
			}
           /* if (result != null && result.school != null) {

                // 设置分页总记录数
                var pager = $('#schoolmanager').datagrid("getPager");
                pager.pagination({
                    total: result.school.total
                });

                if (result.school.info != null) {
                    $.each(result.school.info, function (i, n) {
                        var itemtemp = {};
                        itemtemp.school_id = n.school_id;
                        itemtemp.name = n.name;
                        itemtemp.creat_date = n.creat_date;
                        itemtemp.teacher = [];
                        
                        if (result.teacher != null) {
                            $.each(result.teacher, function (k, j) {
                                if (n.school_id == j.school_id) {
                                    var teactemp = {};
                                    teactemp.teacher_id = j.teacher_id;
                                    teactemp.realname = j.realname;
                                    teactemp.mobile = j.mobile;
                                    itemtemp.teacher.push(teactemp);
                                }
                            })
                        }

                        datalistTemp.push(itemtemp);

                    });
                }

            }*/

            //alert($.toJSON(datalistTemp));

            $('#Select_School_p').datagrid("loadData", datalistTemp);
        },
        error: function (result) {

        }
    });

}