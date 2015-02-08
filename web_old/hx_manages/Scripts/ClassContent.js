
//var UserInfo = null;
//var UserLevel = 4;



$(document).ready(function () {
    $('#ClassStudent').datagrid({
        fit: true,
        remoteSort: false,
        //        toolbar: '#details',
        pagination: true,
        rownumbers: true,
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...',
        columns: [[
            { field: 'id', title: '学生姓名', width: 120, sortable: true, align: 'center' },
            { field: 'realname', title: '年级', width: 65, sortable: true, align: 'center' },
            { field: 'founder', title: '平均成绩', width: 100, sortable: true, align: 'center' },
            { field: 'date', title: '注册时间', width: 120, sortable: true, align: 'center' },
            { field: 'operation', title: '操作', width: 120, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                    return "<a href=\"#\" onclick=\"LookStudentInfo('" + row.id + "')\">查看详情</a>"
                }
            }
        ]]
    });
    $('#ClassStudent').datagrid("loadData", { "page": 1, "total": 2,
        "rows":
        [
            { "id": "班级01", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "e", "operation": "f" },
            { "id": "班级02", "realname": "四", "founder": "80", "date": "2010", "studentnum": "c", "teachernum": "d", "state": "e", "operation": "f" }
        ]
    });



    $('#ClassTeacher').datagrid({
        fit: true,
        remoteSort: false,
        //        toolbar: '#details',
        pagination: true,
        rownumbers: true,
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...',
        columns: [[
            { field: 'teachername', title: '教师姓名', width: 120, sortable: true, align: 'center' },
            { field: 'subject', title: '学科', width: 65, sortable: true, align: 'center' },
            { field: 'date', title: '注册时间', width: 100, sortable: true, align: 'center' },
            { field: 'operation', title: '操作', width: 120, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                    return "<a href=\"#\" onclick=\"LookStudent('" + row.id + "'，" + row + ")\">查看详情</a>"
                }
            }
        ]]
        });

        $('#ClassTeacher').datagrid("loadData", { "page": 1, "total": 2,
            "rows":
        [
            { "teachername": "张三", "subject": "语文",  "date": "2011", "studentnum": "c", "teachernum": "d", "state": "e", "operation": "f" },
            { "teachername": "李四", "subject": "数学",  "date": "2010", "studentnum": "c", "teachernum": "d", "state": "e", "operation": "f" }
        ]
        });




});



// function LookStudentInfo(){
//    
// }















//$("#dialogspan").dialog({
//    title: '分数统计图表',
//    iconCls: 'icon-chart',
//    width: 600,
//    height: 400,
//    closed: true,
//    cache: false,
//    modal: true,
//    collapsible: true,
//    minimizable: false,
//    maximizable: true

//});

//$('#studentinfo').tabs({
//    border: false,
//    plain: true,
//    fit: true
//});


//$("#divInfo").dialog({
//    title: '查看学生信息',
//    iconCls: 'icon-search',
//    width: 600,
//    height: 400,
//    closed: true,
//    cache: false,
//    modal: true,
//    collapsible: true,
//    minimizable: false,
//    maximizable: true
//    buttons: [{
//        text: '关闭',
//        iconCls: 'icon-cancel',
//        handler: function () {
//            javascript: $('#divInfo').dialog('close');
//        }
//    }]
//});



//  $('#studentinfo').tabs({
//        border: false,
//        plain: true,
//        fit: true
//    });





//    function LookStudent(value, row) {

//        var student_id = value;

//        var runone = 0;

//        $("#divInfo").dialog('open');

//        var subject_id = 0;

//        // 获取学生基本信息
//        $.asyncStudent({
//            condition: { uid: row.id },
//            fields: ['username', 'realname', 'gender', 'grade_id', 'school_name', 'school_id', 'reg_time', 'last_login_time', 'pic', 'birth_date']
//        },
//        function (o) {
//            if (o != null) {
//                $('#username').html(o.username);
//                $('#realname').html(o.realname == null ? '-' : o.realname);
//                $('#gender').html(o.gender == null ? '-' : (parseInt(o.gender) == 0 ? '女' : '男'));
//                $('#birth_date').html(o.birth_date == null ? '-' : o.birth_date);
//                if (o.grade_id == null || o.grade_id < 1) {
//                    $('#grade_id').html('-');
//                } else {
//                    $.asyncGradeInfo(o.grade_id, function (item) {
//                        $('#grade_id').html(item.name == null ? '-' : item.name);
//                    });
//                }

//                if (o.school_id != null) {
//                    $.asyncSchool(o.school_id, function (result) {
//                        if (result != null && result.school != null) {
//                            $('#school_name').html(result.school.name);
//                            return;
//                        }
//                        $('#school_name').html('-');
//                    }, function (result) {
//                        $('#school_name').html('-');
//                    });
//                } else {
//                    $('#school_name').html('-');
//                }

//                $('#reg_time').html(o.reg_time == null ? '-' : o.reg_time);
//                $('#last_login_time').html(o.last_login_time == null ? '-' : o.last_login_time);
//                $('#pic').attr('src', o.pic);
//            }

//            // 构造对应学生测评数据
//            $('#studenttestdata').datagrid({
//                border: false,
//                fit: true,
//                rownumbers: true,
//                onClose: function () {
//                    $('#container').empty();
//                },
//                toolbar: [{
//                    iconCls: 'icon-chart',
//                    text: '生成成绩曲线',
//                    handler: function () {

//                        BornChart(value, subject_id);

//                    }
//                }, {
//                    iconCls: 'icon-add',
//                    text: '新建组卷',
//                    handler: function () {
//                        parent.ChangeThisTab("组卷", "TestPaper.html");
//                    }
//                }],
//                columns: [[
//                    { field: 'name', title: '测评卷名称', width: 160 },
//                    { field: 'log_time', title: '测评时间', width: 120 },
//                    { field: 'my_score', title: '成绩', width: 60, align: 'center' },
//                    {
//                        field: 'id', title: '操作', width: 90, align: 'center',
//                        formatter: function (value, row, index) {
//                            return "<a href=\"#\" style='color:blue;' onclick=\"\">查看测评卷</a>";
//                        }
//                    }
//                ]]
//            });

//            var UserLevel = parseInt(UserInfo.level);
//            if (UserLevel == 4) {

//                // 获取教师对应的
//                $.asyncTeacher({ condition: { uid: UserInfo.id }, fields: ['subject_grade'] }, function (result) {

//                    if (result.subject_grade != null) {
//                        var sg = $.evalJSON(result.subject_grade);
//                        if (sg.subject != null && sg.subject.length > 0) {
//                            subject_id = sg.subject[0];

//                            $.ajax({
//                                type: "GET",
//                                dataType: "json",
//                                url: Webversion + "/test/list/ok?r=" + $.getRom() ,
//                                success: function (result) {
//                                    if (result != null && result.test != null) {
//                                        $('#studenttestdata').datagrid('loadData', result.test);
//                                    }
//                                }
//                            });

//                        }
//                    }

//                }, function (result) {

//                });

//            }
//            else if (UserLevel == 2 || UserLevel == 3) {

//                if (UserLevel == 3) { $("#addcourderbar").click(function () { $.remind('你没有添加学生课程的权限！<br/><span style="color:#ff0000;">提示：教学主任具有添加学生课程的权限。</span>'); }); };

//                $("#addcourderbar").click(function () {

//                    LoadCourseInfoSelect(row.subject_id, 'stucountsdddd');

//                    $('#studentaddcourse').dialog({
//                        title: '添加学生课程',
//                        width: 480,
//                        height: 140,
//                        buttons: [{
//                            text: '添加课程',
//                            iconCls: 'icon-add',
//                            handler: function () {

//                                $.messager.progress({ text: '正在添加课程' });

//                                var courseid = $('#stucountsdddd').combobox('getValue'),
//                                    courname = $('#stucountsdddd').combobox('getText');
//                                if (parseInt(courseid) < 1 || courname == null || courname.length == 0) {
//                                    $.messager.progress('close');
//                                    $.remind('请选择对应的课程！');
//                                    return;
//                                }

//                                var tid = $('#stuteassddent').combobox('getValue'),
//                                    tname = $('#stuteassddent').combobox('getText');
//                                if (parseInt(tid) < 1 || tname == null || tname.length == 0) {
//                                    $.messager.progress('close');
//                                    $.remind('请选择对应的教师！');
//                                    return;
//                                }

//                                var paramObj = {};
//                                paramObj.name = tname + '_' + o.realname;
//                                paramObj.student_id = row.id;
//                                paramObj.teacher_id = tid;
//                                paramObj.master_id = $('#spanmasterempty').attr('masterid');

//                                $.createClass(paramObj, function (result) {
//                                    $.messager.progress('close');
//                                    $.messager.confirm('系统消息', '课程添加成功！<br/>需要继续添加该学生的课程吗？', function (r) {
//                                        if (!r) {
//                                            $('#studentaddcourse').dialog('close');
//                                        }
//                                        LoadClassList(student_id);
//                                    });
//                                }, function (result) {
//                                    $.messager.progress('close');
//                                    $.error("课程添加失败！");
//                                });

//                            }
//                        }, {
//                            text: '取消',
//                            iconCls: 'icon-cancel',
//                            handler: function () {
//                                $('#studentaddcourse').dialog('close');
//                            }
//                        }]
//                    });

//                    $('#studentaddcourse').dialog('open');

//                });

//                // 构造学生学科信息
//                $('#studentcoursein').datagrid({
//                    border: false,
//                    fit: true,
//                    rownumbers: true,
//                    toolbar: '#scbars',
//                    columns: [[
//                        {
//                            field: 'subjectname', title: '课程', width: 100, align: 'center',
//                            formatter: function (value, row, index) {

//                                var htmlTemp = '<img alt="正在加载..." src="images/imgload.gif"/>';

//                                if (value == null) {
//                                    if (row.subject_id == 0) {
//                                        htmlTemp = '-';
//                                    } else {
//                                        $.asyncSubject(row.subject_id, function (result) {

//                                            $('#studentcoursein').datagrid('updateRow', {
//                                                "index": index,
//                                                "row": {
//                                                    subjectname: result.Name == null ? '-' : result.Name
//                                                }
//                                            });

//                                        }, function (result) {
//                                            $('#studentcoursein').datagrid('updateRow', {
//                                                "index": index,
//                                                "row": {
//                                                    subjectname: '-'
//                                                }
//                                            });
//                                        });
//                                    }
//                                } else {
//                                    htmlTemp = value;
//                                }

//                                return htmlTemp;

//                            }
//                        },
//                        {
//                            field: 'realname', title: '教师', width: 120, align: 'center',
//                            formatter: function (value, row, index) {
//                                if (UserLevel == 3) {
//                                    value += '&nbsp;<a href="#" style="color:blue;" onclick="AltClassTeacher(' + row.subject_id + ',' + index + ',' + student_id + ',' + row.class_id + ',' + row.uid + ')">更换</a>';
//                                }
//                                return value;
//                            }
//                        },
//                        {
//                            field: 'total', title: '测评次数', width: 100, align: 'center',
//                            formatter: function (value, row, index) {
//                                if (value == null) {
//                                    value = 0;
//                                }
//                                return value;
//                            }
//                        },
//                        {
//                            field: 'is_open', title: '操作', width: 90, align: 'center',
//                            formatter: function (value, row, index) {
//                                var s = '<a href="#" style="color:blue;" onclick="BornChart(' + student_id + ',' + row.subject_id + ')">查看</a>';
//                                if (UserLevel == 2) {
//                                    if (value == 0) {
//                                        s += '&nbsp;&nbsp;<a href="#" style="color:blue;" onclick="openCloseClassStatue(' + index + ',' + row.class_id + ',' + student_id + ',1)">关闭课程</a>';
//                                    } else {
//                                        s += '&nbsp;&nbsp;<a href="#" style="color:blue;" onclick="openCloseClassStatue(' + index + ',' + row.class_id + ',' + student_id + ',0)">开启课程</a>';
//                                    }
//                                }

//                                // 得到班主任信息
//                                if (runone == 0 && row.class_id > 0) {

//                                    $('#spanmasterempty').html('<img alt="正在获取班主任信息..." src="images/imgload.gif" style="border:none; border-width:0;"/>');
//                                    $('#spanmasterempty').attr('masterid', 0);

//                                    if (UserLevel == 2) {
//                                        $("#changemasters").click(function () {

//                                            $("#ChangeMasterInfo").dialog({
//                                                title: '更换班主任',
//                                                iconCls: 'icon-edit',
//                                                width: 420,
//                                                height: 200,
//                                                closed: true,
//                                                cache: false,
//                                                modal: true,
//                                                collapsible: true,
//                                                minimizable: false,
//                                                maximizable: true,
//                                                buttons: [
//                                                    {
//                                                        text: '更改',
//                                                        iconCls: 'icon-edit',
//                                                        handler: function () {

//                                                            if (parseInt($('#MasterLists').combobox('getValue')) == 0) {
//                                                                $.remind('请选择班主任');
//                                                                return;
//                                                            }

//                                                            var masterNameTemp = $('#MasterLists').combobox('getText');
//                                                            var masterIdTemppp = $('#MasterLists').combobox('getValue');

//                                                            $.messager.progress({ text: '系统正在更换班主任' });

//                                                            // 更改当前用户班主任信息
//                                                            $.ajax({
//                                                                type: "POST",
//                                                                dataType: "json",
//                                                                url: Webversion + "/class/teacher?_method=PUT" ,
//                                                                data: { 'student_id': student_id, 'teacher_id': masterIdTemppp, 'level': '3', 'r': $.getRom() },
//                                                                success: function (result) {
//                                                                    $.messager.progress('close');
//                                                                    $.remind('班主任更换成功！', function () {
//                                                                        // 更新当前班主任信息
//                                                                        $('#spanmasterempty').html(masterNameTemp);
//                                                                        $('#spanmasterempty').attr('masterid', masterIdTemppp);
//                                                                        $('#ChangeMasterInfo').dialog('close');
//                                                                    });

//                                                                }, error: function (result) {
//                                                                    $.messager.progress('close');
//                                                                    $.remind('更换班主任失败！');
//                                                                }
//                                                            });

//                                                        }
//                                                    },
//                                                    {
//                                                        text: '关闭',
//                                                        iconCls: 'icon-cancel',
//                                                        handler: function () {
//                                                            $('#ChangeMasterInfo').dialog('close');
//                                                        }
//                                                    }]
//                                            });

//                                            $("#ChangeMasterInfo").dialog('open');
//                                        });

//                                    } else {
//                                        $("#changemasters").click(function () {
//                                            $.remind('你没有更改班主任的权限！<br/><span style="color:#ff0000;">提示：教学主任具有更改班主任的权限。</span>');
//                                        });
//                                    }

//                                    // 获取班级信息
//                                    $.ajax({
//                                        type: "GET",
//                                        dataType: "json",
//                                        url: Webversion + "/class/info" ,
//                                        data: { 'class_id': row.class_id, 'r': $.getRom() },
//                                        success: function (result) {
//                                            if (result.class_info != null) {
//                                                var hasMaster = false;
//                                                $.each(result.class_info, function (index, o) {
//                                                    if (o.relationship == 3) {
//                                                        hasMaster = true;
//                                                        var masterid = o.uid;

//                                                        // 更换班主任
//                                                        if (UserLevel == 2) {

//                                                            $("#ChangeMasterInfo").dialog({
//                                                                onOpen: function () {
//                                                                    $('#MasterLists').combobox('setValue', masterid);
//                                                                }
//                                                            });

//                                                        }

//                                                        $('#spanmasterempty').attr('masterid', masterid);
//                                                        $.asyncTeacher({ condition: { 'uid': masterid }, fields: ['realname'] },
//                                                            function (to) {
//                                                                $('#spanmasterempty').text(to.realname);
//                                                            },
//                                                            function (to) {
//                                                                $('#spanmasterempty').html('<span>-获取班主任信息失败-</span>');
//                                                                $('#spanmasterempty').attr('masterid', 0);
//                                                            }
//                                                        );
//                                                        return false;
//                                                    }
//                                                });
//                                                if (!hasMaster) {
//                                                    $('#spanmasterempty').html('<span>-</span>');
//                                                    $('#spanmasterempty').attr('masterid', 0);
//                                                }
//                                            }
//                                        },
//                                        error: function (result) {
//                                            $('#spanmasterempty').html('<span>-获取班主任信息失败-</span>');
//                                            $('#spanmasterempty').attr('masterid', 0);
//                                        }
//                                    });

//                                    runone++;
//                                }

//                                return s;
//                            }
//                        }
//                    ]]
//                });

//                LoadClassList(student_id);

//            }
//        });

//    }