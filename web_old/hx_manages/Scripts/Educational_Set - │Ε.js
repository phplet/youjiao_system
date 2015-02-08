/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/Scripts/jquery.json.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/Common.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.Plug.js"/>

var UserInfo = {};

$(document).ready(function () {

    UserInfo = $.evalJSON($.cookie("UserInfo"));
      
    $('document').KeyInput($("#SchoolText"), '请输入姓名');
     
    $('#Educational_Set').datagrid({
        fit: true,
        remoteSort: false,
        toolbar: '#SerToolBar',
        pagination: true,
        rownumbers: true,
		singleSelect: true,
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...', 
        /*onClickRow: function (rowIndex, rowData) {
            $('#Educational_Set').datagrid("unselectRow", rowIndex);
        },*/
		
        columns: [[
		    { field: 'username', title: '用户名', width: 120, align: 'center', sortable: true },
			{
                field: 'realname', title: '姓名', width: 80, align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    if (row.teacher != null) {
                        $.each(row.teacher, function (i, t) {
                            if (i > 0) { html += '<br/>';}
                            html += (t.realname == null) ? '-' : t.realname;
                        });
                    }
                    return html;
                }
            },
			{ field: 'Class', title: '学科', width: 60, align: 'center', sortable: true },
			{ field: 'email', title: '邮箱', width: 120, align: 'center', sortable: true },
            { field: 'creat_date', title: '注册时间', width: 80, align: 'center', sortable: true },
			{ field: 'name', title: '负责校区', width: 150, align: 'center', sortable: true },
			 
            {
                field: 'mobile', title: '状态', width: 80, align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    if (row.teacher != null) {
                        $.each(row.teacher, function (i, t) {
                            if (i > 0) { html += '<br/>'; }
                            html += t.mobile == null ? '已启用/<a onclick="updateUserType(\''+t.realname+'\');">禁用</a>' : t.mobile;
                        });
                    }
                    return html;
                }
            },
            {
                field: 'school_id', title: '操作', align: 'center',
                formatter: function (value, row, index) {
                    var s = "<table><tr><td style=\"border:none;text-align:left;\"><a href=\"#\" style='color:blue;' onclick=\"SelectSchoolName('" + value + "'," + index + ")\">查看</a>&nbsp;<a href=\"#\" style='color:blue;' onclick=\"EditSchoolName('" + value + "'," + index + ")\">修改</a></td></tr></table>";
                    return s;
                }
            }
        ]]
    });
	
    var pager = $('#Educational_Set').datagrid("getPager");
	
    pager.pagination({
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            var ltemp = (pageNumber - 1) * pageSize;
            LoadSchool(ltemp, pageSize);
            $(this).pagination('loaded');
        },
        buttons: [{
            iconCls: 'icon-add',
            handler: function () {
			  
               createSchool();
               
			   $('#wdialog').dialog("open");
				
            }
        }]
    });

    pager.pagination("select", 1);

    

    

    // 绑定搜索事件
    $("#BtnSearch").click(function () {

        if ($("#SchoolText").attr("innt") == "1") {
            $.messager.alert('温馨提示', '请输入校区或教学主任名称再搜索！', 'info');
            return;
        }

        $.messager.progress({ text: '正在搜索校区信息' });

        $('#Educational_Set').datagrid("getPager").pagination("select", 1);

        $.messager.progress('close');

    });

    // 绑定创建新校区事件
    $("#BtnAdd").click(function () {
        
        createSchool();
        $('#wdialog').dialog('open');

    });

});

function LoadSchool(s,l) {

    var url = Webversion + "/school/list/" + s + "," + l + "/uplevel_id/" + UserInfo.school_id ;
    var params = {};
    if ($("#SchoolText").attr("innt") != "1") {
        url = Webversion + "/school/list/" + s + "," + l + "/name" ;
        params.key = $.trim($("#SchoolText").val());
    }

    params['r'] = $.getRom();

    // 加载数据列表
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        data: params,
        success: function (result) {

            var datalistTemp = [];

            if (result != null && result.school != null) {

                // 设置分页总记录数
                var pager = $('#Educational_Set').datagrid("getPager");
                pager.pagination({    //重置总条数属性值
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

            }

            //alert($.toJSON(datalistTemp));

            $('#Educational_Set').datagrid("loadData", datalistTemp);
        },
        error: function (result) {

        }
    });

}



function createSchool() {
        // 创建新校区
		  
        $("#wdialog").dialog({
            iconCls: 'icon-add',
            title: '新增人员资料',
            width: 520,
            height: 550,
            closed: true,
            cache: false,
            modal: true,
            onOpen: function () {
                validate_form("#SchoolForm","#userName","#userName_Ms","#userRealName","#userRealName_Ms","#userEmail","#userEmail_Ms","#userTel","#userTel_Ms","#userSchool","#userSchool_Ms","#userSubjects","#userSubjects_Ms","#hiddenteacherid",0); 
            },
            buttons: [{
                text: '确认',
                iconCls: 'icon-ok',
                handler: function () {
                    //if (!$("#SchoolForm").form('validate')) return;

                    if ($.trim($('#SchoolName').val()).length == 0) {
                        $.remind('请输入校区名称！', function () { $('#SchoolName').focus(); });
                        return;
                    }

                    if ($("#hiddenteacherid").attr('flag') == 'e') {
                        $.remind('请输入正确的校区负责人账号！', function () { $('#Principal').focus(); });
                        return;
                    }

                    $.messager.progress({ text: "正在创建新校区" });
                    $.ajax({
                        url: Webversion + "/school",
                        type: "POST",
                        data: { name: $("#SchoolName").val(), user: $("#Principal").val() },
                        dataType: "json",
                        success: function (result) {
                            $.messager.progress("close");
                            $('#wdialog').dialog('close');
                            // 重新刷新数据列表
                            pager.pagination("select");
                        },
                        error: function (result) {
                            $.messager.progress("close");
                            $.messager.alert('错误', '新增人员创建失败!<br/><span style="color:red;">可能原因：被指定的校区负责人不是教师身份或系统中已存在此校区。</span>', 'error');
                        }
                    });

                }
            }, {
                text: '取消',
                iconCls: 'icon-cancel',
                handler: function () {
                    $('#wdialog').dialog('close');
                }
            }]
        });
}

// 修改校区名称
function EditSchoolName(value, index) {
	
    $.messager.progress({text:'正在获取个人信息'});
    // 获取校区相关数据
    var rowData = ($('#Educational_Set').datagrid('getData').rows)[index];
	
    $("#wdialog").dialog({
        iconCls: 'icon-save',
        title: '修改个人信息',
        width: 520,
        height: 550,
        closed: true,
        cache: false,
        modal: true,
        onOpen: function () {
            $.messager.progress('close');
			validate_form("#SchoolForm","#userName","#userName_Ms","#userRealName","#userRealName_Ms","#userEmail","#userEmail_Ms","#userTel","#userTel_Ms","#userSchool","#userSchool_Ms","#userSubjects","#userSubjects_Ms","#hiddenteacherid",1);
			//alert(JSON.stringify(rowData));
            $('#userName').val('123456');
			$('#userRealName').val('刘辉');
			$(":radio[name=userSex][value=2]").attr("checked","true");
			$('#userTel').val('12345678910');
			$('#userEmail').val('123@163.com');
			$('#userSubjects').combobox('setValue',1);  //1是启用  2  是禁用
			$('#userSchool').combotree('setValues',[1,2]);   // 1----n   多选框   可以是数组
			//$('#AleInputSchoolName').val(rowData.name);
        },
        buttons: [{
            text: '修改',
            iconCls: 'icon-edit',
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
                        $('#AleSchoolName').dialog('close');
                        $.remind('校区名称修改成功！');
                        var pager = $('#Educational_Set').datagrid("getPager");
                        pager.pagination("select");
                    }, error: function (result) {
                        $.messager.progress('close');
                        $.error('系统出现异常，校区名称修改失败！');
                    }
                });

            }
        },
        {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#wdialog').dialog('close');
            }
        }]
    });
	
    $('#wdialog').dialog('open');
}

// 查看校区内容
function SelectSchoolName(value, index) {

    $.messager.progress({text:'正在获取个人信息'});
    // 获取校区相关数据
    var rowData = ($('#Educational_Set').datagrid('getData').rows)[index];

    $("#SeltSchool").dialog({
        iconCls: 'icon-save',
        title: '查看个人信息',
        width: 520,
        height: 550,
        closed: true,
        cache: false,
        modal: true,
        onOpen: function () {
            $.messager.progress('close');
			//alert(rowData.name);
            $('#sel_userName').html(rowData.name);
        },
        buttons: [{
            text: '关闭',
            iconCls: 'icon-ok',
            handler: function () {
                $('#SeltSchool').dialog('close');
            }
        }]
    });

    $('#SeltSchool').dialog('open');

}




function AddTeacheName(value, index) {

    $.messager.progress({ text: '正在获取校区信息' });
    // 获取校区相关数据
    var rowData = ($('#Educational_Set').datagrid('getData').rows)[index];

    // 创建新校区
    $("#wdialog").dialog({
        iconCls: 'icon-save',
        title: '添加负责人账号',
        width: 370,
        height: 280,
        closed: true,
        cache: false,
        modal: true,
        onOpen: function () {
            $("#RealName").html("");
            $("#UserSex").html("");
            $("#Number").html("");
            $("#SchoolName").val("");
            $("#Principal").val("");

            $("#hiddenteacherid").attr('flag', 'e');
            $("#hiddenteacherid").val('');

            $('#SchoolName').val(rowData.name);
            $('#SchoolName').attr('disabled', true);
            $.messager.progress('close');
        },
        buttons: [{
            text: '添加负责人',
            iconCls: 'icon-add',
            handler: function () {
                
                if ($.trim($("#hiddenteacherid").val()).length == 0) {
                    $.remind('请输入负责人账号！');
                    return;
                }

                if ($("#hiddenteacherid").attr('flag') != 's') {
                    $.remind('请输入有效地负责人账号！');
                    return;
                }

                $.messager.progress({ text: '系统正在处理' });

                $.ajax({
                    url: Webversion + "/user/teacher/changelevel?_method=PUT" ,
                    type: "POST",
                    data: { 'level': 2, 'teacher_id': $("#hiddenteacherid").val(), 'school_id': value },
                    dataType: "json",
                    success: function (result) {
                        $.messager.progress("close");

                        $.messager.confirm('提示', '要继续添加校区负责人吗', function (r) {
                            if (!r) {
                                $('#wdialog').dialog('close');
                            } else {
                                $("#RealName").html("");
                                $("#UserSex").html("");
                                $("#Number").html("");
                                $("#Principal").val("");
                            }
                        });

                        var pager = $('#Educational_Set').datagrid("getPager");
                        // 重新刷新数据列表
                        pager.pagination("select");
                    },
                    error: function (result) {
                        $.messager.progress("close");
                        $.messager.alert('错误', '添加校区负责人失败!<br/><span style="color:red;">可能原因：此校区下可能已存在此负责人。</span>', 'error');
                    }
                });

            }
        }, {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#wdialog').dialog('close');
            }
        }]
    });

    $('#wdialog').dialog('open');

}

function DeleteTearch(value, index) {

    $.messager.progress({ text: '正在加载数据' });

    $('#DeleteTeacherInfo').dialog({
        iconCls: 'icon-remove',
        title: '请选择要删除的负责人（至少保留一个负责人账号）',
        width: 450,
        height: 300,
        closed: true,
        cache: false,
        modal: true,
        onOpen: function () {
            $.messager.progress('close');

            //$.messager.progress({ text: '正在加载教师列表' });

            $('#teacherdatalist').datagrid({
                border: false,
                fit: true,
                rownumbers: true,
                checkOnSelect: true,
                selectOnCheck: true,
                columns: [[
                    { field: 'uid', checkbox: true },
                    { field: 'username', title: '账号', width: 160 },
                    { field: 'realname', title: '真实姓名', width: 100 }
                ]]
            });

            LoadTeacherList();

        },
        buttons: [{
            text: '删除',
            iconCls: 'icon-ok',
            handler: function () {

                // 检测是否选中删除记录
                var rowsTemp = $('#teacherdatalist').datagrid('getChecked');
                if (rowsTemp == null || rowsTemp.length == 0) {
                    $.remind('没有可删除的记录！');
                    return;
                }

                // 检测是否有一项纪录被保留
                if (rowsTemp.length >= ($('#teacherdatalist').datagrid('getRows')).length) {
                    $.remind('至少保留一个负责人账号！');
                    return;
                }

                $.messager.confirm('提示', '确定要删除选中的负责人吗?', function (r) {
                    if (r) {

                        $.messager.progress({ text: '系统正在删除' });

                        delTeacher(rowsTemp, 0, delTeacher,
                            function () {
                                $.messager.progress('close');
                                $.error('系统出现异常！');
                            });

                    }
                });

            }
        }, {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#DeleteTeacherInfo').dialog('close');
            }
        }]
    });

    $('#DeleteTeacherInfo').dialog('open');


    function LoadTeacherList() {
        $.ajax({
            type: "GET",
            dataType: "json",
            data: { condition: 'school_id:' + value + ';level:2', 'r': $.getRom() },
            url: Webversion + '/user/teacher/list/0,100/username;realname;uid' ,
            success: function (result) {
                if (result != null && result.teacher != null) {
                    $('#teacherdatalist').datagrid('loadData', result.teacher);
                }
            }
        });
    }

    // 删除校区负责人
    function delTeacher(ids, index, fun, error) {

        if (index >= ids.length) {
            $.messager.progress('close');

            $.remind('已删除完选定的校区负责人！', function () {
                //$.messager.progress({ text: '正在重新加载' });
                LoadTeacherList();
                var pager = $('#Educational_Set').datagrid("getPager");
                // 重新刷新数据列表
                pager.pagination("select");
            });

            return;
        }

        $.ajax({
            url: Webversion + "/user/teacher/changelevel?_method=PUT" ,
            type: "POST",
            dataType: "json",
            data: { 'level': 4, 'teacher_id': ids[index].uid, 'school_id': value },
            success: function (result) {
                fun(ids, index + 1, fun, error);
            },
            error: function (result) {
                error();
            }
        });
    }

}

function DeleteSchool(value, index) {

    $.messager.confirm('删除校区信息', '确定要删除吗?', function (r) {
        if (r) {
            $.messager.progress({ 'text': '系统正在删除' });
            $.ajax({
                url: Webversion + "/school?id=" + value ,
                type: "DELETE",
                dataType: "json",
                success: function (result) {
                    $.messager.progress('close');
                    $.remind('校区名称删除成功！');
                    var pager = $('#Educational_Set').datagrid("getPager");
                    //pager.pagination("select", 1);
					pager.pagination("select");
                },
                error: function (result) {
                    $.messager.progress('close');
                    $.error('系统出现异常，校区名称删除失败！');
                }
            });
        }
    });

}

//验证表单

function validate_form(form,name,name_ms,realname,realname_ms,email,email_ms,tel,tel_ms,school,school_ms,sub,sub_ms,teacherid,type){
	$(teacherid).attr('flag', 'e');
    $(teacherid).val('');
    $(form)[0].reset();
	if(type==0){
		$(name_ms).html('&nbsp;请输入数字和字母组合!');
		$(realname_ms).html('&nbsp;请输入中文姓名,2-4位汉字！');
		$(tel_ms).html('&nbsp;联系方式为11位数字！');
		$(email_ms).html('&nbsp;用户邮箱必须为电子邮件格式！');
		/*$(sub_ms).html('&nbsp;学科不能为空!');
		$(school_ms).html('&nbsp;校区不能为空！');	*/
	}else if(type==1){
		$(name_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(realname_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(tel_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(email_ms).html('&nbsp;<img src="../images/ok.png"/>');
		/*$(school_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(sub_ms).html('&nbsp;<img src="../images/ok.png"/>');*/
	}
	
    // 定义负责人验证方式
    $.extend($.fn.validatebox.defaults.rules, {
		CheckUserName: {     //验证用户名存在与否  不存在的情况下才能注册
            validator: function (value, param) {
                $(name).html("");
             
                $(teacherid).attr('flag', 'e');
                $(teacherid).val('');
				var UserNameSum  =  6;  //判断用户名的长度
                 
				if (/^[A-Za-z0-9]{6,}$/i.test(value)) {
					var htmltemp = "<img alt='' src='../images/imgload.gif'/>正在获取...";
                	$(name_ms).html(htmltemp);
                    $.ajax({
                    url: Webversion + "/user/teacher/realname;gender;mobile;uid",
                    type: "GET",
                    data: { "condition": "username:" + value },
                    dataType: "json",
                    success: function (result) {
                        if (result.teacher != false){
                             $(name_ms).html('此用户名已经存在!');
                             $(teacherid).attr('flag', 's');
                             $(teacherid).val(result.teacher.uid);
							 return ;
                        }
                        else {
                            $(name_ms).html('&nbsp;<img src="../images/ok.png"/>');
							return ;
                        }
                    },
                    error: function (result) {
                        $(name_ms).html("连接数据库失败！");
						return ;
                    }
                	});
					return  true;
                }else{
					$(name_ms).html('&nbsp;用户名为字母和数字组合！');
					return false;	
				}
                 
            },
            message: '用户名为字母和数字组合！'
        },
        CheckUserRealName: {
            validator: function (value, param) {
                $(realname_ms).html("");
                $(teacherid).attr('flag', 'e');
                $(teacherid).val('');
                // 验证是否为电子邮件格式
                if (!/^[\u4e00-\u9fa5]{2,4}$/i.test(value)) {
					$(realname_ms).html('请输入中文姓名,2-4位汉字！');
                    return false;
                }else{
					 $(realname_ms).html('&nbsp;<img src="../images/ok.png"/>');
                	 return true;	
				}
               
            },
            message: '请使用中文姓名,2-4位汉字！'
        },
        CheckEmail: {
            validator: function (value, param) {
                $(email_ms).html("");
                $(teacherid).attr('flag', 'e');
                $(teacherid).val('');
                // 验证是否为电子邮件格式
                if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(com|cn|net)$/i.test(value)) {
					$(email_ms).html('用户邮箱必须为电子邮件格式！');
                    return false;
                }else{
					$(email_ms).html('&nbsp;<img src="../images/ok.png"/>');
                	return true;
				}
                
            },
            message: '用户邮箱必须为电子邮件格式！'
        },
        CheckUserTel: {
            validator: function (value, param) {
                $(tel_ms).html("");
                $(teacherid).attr('flag', 'e');
                $(teacherid).val('');
                // 验证是否为11位手机号码--数字
                if (!/^\d{11}$/i.test(value)) {
					$(tel_ms).html('联系方式为11位数字！');
                    return false;
                }else{
					$(tel_ms).html('&nbsp;<img src="../images/ok.png"/>');
                	return true;
				}
                
            },
            message: '联系方式为11位手机号码！'
        }
    });

    $(email).validatebox({   //email验证
        required: true,
        validType: "CheckEmail",
        missingMessage: '该项必须输入且为邮件格式！'
    });
	$(name).validatebox({  //用户名验证
        required: true,
        validType: "CheckUserName",
        missingMessage: '该项必须输入且为6位数字！'
    });
	$(realname).validatebox({  //真实姓名验证
        required: true,
        validType: "CheckUserRealName",
        missingMessage: '该项必须输入必须是中文姓名,2-4位汉字！'
    }); 
	$(tel).validatebox({  //联系方式验证
        required: true,
        validType: "CheckUserTel",
        missingMessage: '该项必须输入必须是11位手机号码！'
    });
	 
	/*$(sub).combobox({   //验证单选下来列表combobox
            
			editable:false,
            onChange: function (rec) {
               if(rec!=0){
				 $(sub_ms).html('&nbsp;<img src="../images/ok.png"/>');
			   }else{
			   	  $(sub_ms).html('&nbsp;学科不能为空！');	
			   }
            }
             
     });
	 
	 */
	$(school).combotree( {   //验证多选下拉列表
		
		//required:true,  
		//missingMessage:'请选择',
        url : '../data/tree_data.json'
        //选择树节点触发事件  
        /*onChange : function(node) {
			if(node==""||node==null||node=="请选择"){
				$(school_ms).html('&nbsp;内容不能为空！');
			}else{$(school_ms).html('&nbsp;<img src="../images/ok.png"/>');}
             
        }  */
       });  
	
}

//启用和禁止的切换方法
function updateUserType(id){
	
	alert("禁用操作："+id);
	
}