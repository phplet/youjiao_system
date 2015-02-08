
$(document).ready(function () {
	//添加教师开始
	/*  $("#BtnAdd").click(function () {
        $('#WdialogAdd').dialog("open");
    });
	 */
    $("#UserName").keyup(function ()//输入学号显示名字当键盘按下的时候触发
    {
        GetTeacherName();  
    });
	
	function GetTeacherName()//添加教师时获取姓名以及把姓名显示在页面上的操作
	{
		$.asyncTeacher({ condition: { username: $("#UserName").val(),school_id:0 }, fields: ['uid','username', 'realname', 'gender', 'subject_grade'] },
           function (result) {
				if(result==false){
					$('#username').text('');
					$('#RealName').text('');
					$('#hiddenteacherid').val('');
					$('#UserSex').text('');
					$('#CourseText').text('');						
				}
				else{
					$('#username').text(result.username);
					$('#RealName').text(result.realname);
					$('#hiddenteacherid').val(result.uid);
					$('#UserSex').text(result.gender == 0 ? '女' : '男');
					if (result.subject_grade != null) {
						var subjectids = ($.evalJSON(result.subject_grade)).subject;
						if (subjectids != null && subjectids[0] > 0) {
							$.asyncSubject(subjectids[0],
								function (o) {
									$('#CourseText').text(o.Name);
								}, function () { });
						}
				    }
				}
		   }
	    );
		
		
		
	}
	
    function AddPower() {
        $("#WdialogAdd").dialog({
            iconCls: 'icon-add',
            title: '新建权限',
            width: 370,
            height: 240,
            closed: true,
            cache: false,
            modal: true,
            onOpen: function () {
                $('#UserName').val('');
                $("#hiddenteacherid").attr('flag', 'e');
                $("#hiddenteacherid").val('');
                $("#RealName").html("");
                $("#UserSex").html("");
                $('#CourseText').text('---无---');
            },
            buttons: [{
                text: '确定',
                iconCls: 'icon-ok',
                handler: function () {

                    if ($("#hiddenteacherid").val= '') {
                        $.remind('请填写正确的账号信息！');
                        return;
                    }

                    var levelid = { teacher_id: $("#hiddenteacherid").val(), level: 4 };

                    changePower(levelid, function () { $('#WdialogAdd').dialog('close'); pager.pagination("select", 1); });

                }
            }, {
                text: '取消',
                iconCls: 'icon-cancel',
                handler: function () {
                    $('#WdialogAdd').dialog('close');
                }
            }]
        });
    }

// 改变教师权限
function changePower(o, s, e) {
    var parameTemp = { level: 4, teacher_id: 0 };
    jQuery.extend(parameTemp, o);

    $.ajax({
        type: "POST",
        dataType: "json",
        url: Webversion + "/user/teacher/changelevel?_method=PUT&r=" + $.getRom() ,
        data: parameTemp,
        success: function (result) {
            $.messager.alert('温馨提示', '添加教师成功！', 'info', function () {
                if (s != null) {
                    s();
                }
            });
        }, error: function (result) {
            $.messager.alert('错误提示', '添加教师失败！', 'error', function () {
                if (e != null) {
                    e();
                }
            });
        }
    });

}

    AddPower();//添加教师的方法结束

    $(document).KeyInput($("#StudentText"), '输入教师名称');

    $('#TeacherManager').datagrid({
        fit: true,
        remoteSort:false,
        toolbar: '#SerToolBar',
        pagination: true,
        rownumbers: true,
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...',
        columns: [[
            { field: 'id', title: '编号', width: 65, sortable: true, align: 'center' },
            { field: 'realname', title: '教师', width: 120, sortable: true, align: 'center' },
            {
                field: 'subject', title: '学科', width: 100, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                    var htmlStr = '<img alt="正在加载..." src="images/imgload.gif"/>';
                    if (value == null) {

                        $.asyncTeacher({ condition: { uid: row.id }, fields: ['subject_grade'] },
                            function (result) {
                                htmlStr = '-';
                                if (result != null && result.subject_grade != null) {
                                    var sgtemp = $.evalJSON(result.subject_grade);

                                    if (sgtemp.subject != null && sgtemp.subject.length > 0) {

                                        $.asyncSubject(sgtemp.subject[0], function (o) {
                                            htmlStr = o.Name;
                                            $('#TeacherManager').datagrid('updateRow', {
                                                "index": index,
                                                "row": {
                                                    subject: htmlStr
                                                }
                                            });
                                        }, function (o) {
                                            $('#TeacherManager').datagrid('updateRow', {
                                                "index": index,
                                                "row": {
                                                    subject: htmlStr
                                                }
                                            });
                                        });

                                    } else {
                                        $('#TeacherManager').datagrid('updateRow', {
                                            "index": index,
                                            "row": {
                                                subject: htmlStr
                                            }
                                        });
                                    }

                                } else {
                                    $('#TeacherManager').datagrid('updateRow', {
                                        "index": index,
                                        "row": {
                                            subject: htmlStr
                                        }
                                    });
                                }

                            },
                            function (result) {

                                $('#TeacherManager').datagrid('updateRow', {
                                    "index": index,
                                    "row": {
                                        subject: htmlStr
                                    }
                                });

                            });
                    } else {
                        htmlStr = value;
                    }
                    return htmlStr;
                }
            },
            {
                field: 'count', title: '学生数量', width: 100, align: 'center', sortable: true,
                formatter: function (value, row, index) {
                    htmlStr = '<img alt="正在加载..." src="images/imgload.gif"/>';

                    if (value == null) {
                        $.asyncStudentCount(row.id, 'byTeacher',
                            function (c) {
                                $('#TeacherManager').datagrid('updateRow', {
                                    "index": index,
                                    "row": {
                                        count: c
                                    }
                                });
                            },
                            function (c) {
                                $('#TeacherManager').datagrid('updateRow', {
                                    "index": index,
                                    "row": {
                                        count: 0
                                    }
                                });
                            });
                    } else {
                        htmlStr = value;
                    }

                    return htmlStr;
                }
            },
            {
                field: 'uid', title: '操作', align: 'center', width: '120',
                formatter: function (value, row, index) {
                    return "<a href=\"#\" onclick=\"LookTeacherInfo('" + row.id + "')\">查看教师详情</a>";
                }
            }
        ]]
    });

    var pager = $('#TeacherManager').datagrid("getPager");
    pager.pagination({
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            var ltemp = (pageNumber - 1) * pageSize;
            LoadTeacherList(ltemp, pageSize);
            $(this).pagination('loaded');
        }
    });

    pager.pagination("select", 1);

  /*   $.asyncSubjectList(
        function (obj) {
            var GradeArray = [{ label: "请选择学科", value: "0" }];
            $.each(obj, function (i, n) {
                if (n != null) {
                    GradeArray.push({ label: n.Name, value: n.id });
                }
            });
            $("#Ssubject").combobox("loadData", GradeArray);
            $("#Ssubject").combobox("setValue", "0");
        }, function () { });
 */

    $("#BtnSearch").click(function () {
        pager.pagination("select", 1);
    });



    ////
    //$('#StudentList').datagrid({
    //    pagination: false,
    //    rownumbers: true,
    //    pagePosition: "bottom",    
    //    loadMsg: '正在加载教师信息...',
    //    columns: [[           
    //        { field: 'name', title: '学生名字', width: 120, sortable: true },     
    //        { field: 'grade', title: '年级', width: 130, sortable: true },
    //         { field: 'cpNum', title: '测评次数', width: 130, sortable: true },
    //        {
    //            field: 'id', title: '操作', align: 'center',
    //            formatter: function (value, row, index) {
    //                return "<a href=\"#\" onclick=\"\">查看</a>";
    //            }
    //        }
    //    ]]
    //});

});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////.ready的结束标签
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////.ready的结束标签

function LoadTeacherList(s, l) {

    var paramesObject = { 'type': 4 };

    // var subjectValue = $('#Ssubject').combobox('getValue');
    var masterName = $('#StudentText').val();

    // if (parseInt(subjectValue) > 0) {
        // paramesObject.subject_id = subjectValue;
    // }

    if ($('#StudentText').attr('innt') != 1 && $.trim(masterName).length > 0) {
        paramesObject.realname = masterName;
    }
	
	 var ajaxParames = {
			url: Webversion + '/user/teacher/list/' + s + ',' + l + '/withMaster' ,
			type: "GET",
			data: paramesObject,
			dataType: "json",
            success: function (result) {
                  
                var reacodeList = [], total = 200;

                if (result != null && result.teacher != null) {
                    $.each(result.teacher, function (i, n) {
                        var tempItem = {};
                        tempItem= n;
                        if (result.evaluation != null) {
                            $.each(result.evaluation, function (i, f) {
                                if (f.user_id == n.id) {
                                    tempItem.total = f.total;
                                    tempItem.av = f.av;
                                    return false;
                                }
                            });
                        }
                        reacodeList.push(tempItem);
                    });
                }
				
			total = reacodeList.length;

			if (result["pages"]) {
				total = result["pages"];
			}
			
			var dataGrid={};
			dataGrid["total"]=total;
			dataGrid["rows"]=reacodeList;

            $('#TeacherManager').datagrid("loadData", dataGrid);
			
            },
            error: function (result) {

            }
        };
	

	     $.ajax(ajaxParames);

}


//查阅教室信息
function LookTeacherInfo(value) {   

    $.messager.progress({ text: '正在加载教师信息' });

    $("#divInfo").dialog({
        title: '教师信息',
        width: 520,
        height: 400,
        closed: true,
        cache: false,
        modal: true,
        collapsible: true,
        minimizable: false,
        maximizable: true,
        onOpen: function () {
            $.messager.progress('close');
        }
    });

    $.asyncTeacher({ condition: { uid: value }, fields: ['username', 'realname', 'gender', 'school_id', 'reg_time', 'last_login_time', 'pic', 'subject_grade'] },
        function (result) {

            // 填充数据
            $('#username').text(result.username);
            $('#realname').text(result.realname);
            $('#gender').text(result.gender == 0 ? '女' : '男');

            if (result.school_id != null) {
                $.asyncSchool(result.school_id, function (o) {
                    if (o != null && o.school != null) {
                        $('#schoolname').text(o.school.name);
                        return;
                    }
                }, function () {

                });
            }

            if (result.subject_grade != null) {
                var subjectids = ($.evalJSON(result.subject_grade)).subject;
                if (subjectids != null && subjectids[0] > 0) {
                    $.asyncSubject(subjectids[0],
                        function (o) {
                            $('#subjectname').text(o.Name);
                        }, function () { });

                }
            }

            $.asyncStudentCount(value, 'byTeacher',
                function (result) {
                    $('#studentnumber').text(result);
                },
                function () {
                    $('#studentnumber').text('0');
                });

            $.asyncCountTeacherTest(value,
                function (result) {
                    $('#testnumber').text(result);
                },
                function (result) {
                    $('#testnumber').text(0);
                });

            $('#pic').attr('src', result.pic);

            $('#reg_time').text(result.reg_time);
            $('#last_login_time').text(result.last_login_time);

            $("#divInfo").dialog('open');
        },
        function (result) {
            $.messager.progress('close');
            $.remind('系统获取教师信息失败！');
        });

}