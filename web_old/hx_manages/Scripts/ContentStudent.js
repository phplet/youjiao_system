/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/Scripts/jquery.json.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/Common.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.Plug.js"/>

var UserInfo = null;
var UserLevel = 4;

$(document).ready(function () {

    UserInfo = $.evalJSON($.cookie("UserInfo"));

    UserLevel = parseInt(UserInfo.level);

    if (UserLevel != 2) {
        $('#scbars').empty();
    }

    // 定义负责人验证方式
    $.extend($.fn.validatebox.defaults.rules, {
        CheckUserInfo: {
            validator: function (value, param) {

                $("#RealName").html("");
                $("#UserSex").html("");
                $("#UserSchool").html("");
                $('#hiddenuserid').attr('flag', 'e');
                $('#hiddenuserid').val('');

                // 验证是否为电子邮件格式
                if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(com|cn|net)$/i.test(value)) {
                    return false;
                }

                var htmltemp = "<img alt='正在获取...' src='images/imgload.gif'/>正在获取...";

                $("#RealName").html(htmltemp);
                $("#UserSex").html(htmltemp);
                $("#UserSchool").html(htmltemp);

                $.ajax({
                    url: Webversion + "/user/student/realname;gender;school_name,school_id;uid" ,
                    type: "GET",
                    data: { "condition": "username:" + value, 'r': $.getRom() },
                    dataType: "json",
                    success: function (result) {
                        if (result != null && result.student != null) {
                            $("#RealName").html(result.student.realname);
                            $("#UserSex").html(result.student.gender == 1 ? '男' : '女');
                            $.asyncSchool(result.student.school_id, function (result) {
                                if (result != null && result.school != null) {
                                    $("#UserSchool").html(result.school.name);
                                    return;
                                }
                                $("#UserSchool").html('-');
                            }, function (result) {
                                $("#UserSchool").html('-');
                            });

                            $('#hiddenuserid').attr('flag', 's');
                            $('#hiddenuserid').val(result.student.uid);
                        }
                        else {
                            $("#RealName").html('<font color="red">-系统中不存在此用户-<font>');
                            $("#UserSex").html("-");
                            $("#UserSchool").html("-");
                        }
                    },
                    error: function (result) {
                        $("#RealName").html("");
                        $("#UserSex").html("");
                        $("#UserSchool").html("");
                    }
                });

                return true;
            },
            message: '学生账户必须为电子邮件格式'
        }
    });

    $("#UserName").validatebox({
        required: true,
        validType: "CheckUserInfo",
        missingMessage: '该项必须输入且为邮件格式'
    });

    // 获取年级信息
    $.ajax({
        url: Webversion + "/grade/list?r=" + $.getRom() ,
        type: "GET",
        dataType: "json",
        async: false,
        success: function (result) {
            var GradeArray = [{ name: '请选择年级', id: '0' }];
            if (result != null && result.grade != null) {
                $.merge(GradeArray, result.grade);
            }
            $("#SGrade").combobox("loadData", GradeArray);
            $("#SGrade").combobox("setValue", "0");
        },
        error: function (result) {
        }
    });

    $(document).KeyInput($('#StudentText'), '请输入学生姓名');

    $('#StudentManager').datagrid({
        fit: true,
        toolbar: '#SerToolBar',
        remoteSort: false,
        singleSelect: true,
        pagination: true,
        rownumbers: true,
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...',
        columns: [[
          { field: 'realname', title: '学生', width: 60, sortable: true, align: 'center' },
          {
              field: 'gender', title: '性别', width: 35, sortable: true, align: 'center',
              formatter: function (value, row, index) {

                  var htmlTemp = '<img alt="正在加载..." src="images/imgload.gif"/>';

                  if (row.gender == null) {
                      htmlTemp = '-';
                  } else if (parseInt(row.gender) == 0) {
                      htmlTemp = '女';
                  } else {
                      htmlTemp = '男'
                  }

                  //if (row.gender == null) {

                  //    // 异步设置学生信息
                  //    //$.asyncStudent({ condition: { uid: row.id }, fields: ['gender', 'grade_id', 'reg_time'] },
                  //    //    function (o) {

                  //    //        if (o.gender == null) {
                  //    //            o.gende = '-1';
                  //    //        } 

                  //    //        $('#StudentManager').datagrid('updateRow', {
                  //    //            "index": index,
                  //    //            "row": {
                  //    //                gender: o.gende,
                  //    //                grade_id: o.grade_id == null ? 0 : o.grade_id,
                  //    //                reg_time: o.reg_time == null ? '' : o.reg_time
                  //    //            }
                  //    //        });
                  //    //    });

                  //}
                  //else {

                      

                  //}

                  return htmlTemp;
              }
          },
          {
              field: 'grade_name', title: '年级', width: 80, sortable: true, align: 'center',
              formatter: function (value, row, index) {

                  var htmlTemp = '<img alt="正在加载..." src="images/imgload.gif"/>';
                  if (row.grade_name == null) {

                      $.ajax({
                          type: "GET",
                          dataType: "json",
                          url: Webversion + '/grade/list?r='+$.getRom() ,
                          success: function (result) {

                              var info = null;

                              if (result != null && result.grade != null) {
                                  $.each(result.grade, function (i, n) {
                                      if (n.id == row.grade_id) {
                                          info = n;
                                          return false;
                                      }
                                  });
                              }

                              $('#StudentManager').datagrid('updateRow', {
                                  "index": index,
                                  "row": {
                                      grade_name: (info == null || info.name == null) ? '-' : info.name
                                  }
                              });

                          },
                          error: function (result) {
                              $('#StudentManager').datagrid('updateRow', {
                                  "index": index,
                                  "row": {
                                      grade_name: '-'
                                  }
                              });
                          }
                      });

                  } else {
                      htmlTemp = row.grade_name;
                  }
                  return htmlTemp;
              }
          },
          {
              field: 'total', title: '已测评次数', width: 80, sortable: true, align: 'center',
              formatter: function (value, row, index) {
                  if (value == null) { value = 0; }
                  return value;
              }
          },
          {
              field: 'av', title: '平均成绩', width: 80, sortable: true, align: 'center',
              formatter: function (value, row, index) {
                  if (value == null) { value = 0; }
                  return value;
              }
          },
          {
              field: 'reg_time', title: '注册时间', width: 135, align: 'center'
          },
          {
              field: 'id', title: '操作', align: 'center', width: 100,
              formatter: function (value, row, index) {
                  return '<a href="#" style="color:blue;" onclick=\'LookStudent(' + value + ',' + $.toJSON(row) + ')\'>查看学生详情</a>';
              }
          }
        ]]
    });

    var pager = $('#StudentManager').datagrid("getPager");
    pager.pagination({
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            var ltemp = (pageNumber - 1) * pageSize;
            LoadStudentList(ltemp, pageSize);
            $(this).pagination('loaded');
        }
    });

    pager.pagination("select", 1);

    if (UserLevel == 2) {

        $('#BtnAdd').show();

        $("#BtnAdd").click(function () {

            $('#wdialog').dialog({
                title: '添加学生',
                buttons: [
                    {
                        text: '确定',
                        iconCls: 'icon-ok',
                        handler: function () {
                            addClass(function () {
                                $.messager.confirm('系统消息', '添加成功！<br/>需要继续添加该学生的课程吗？', function (r) {
                                    if (!r) {
                                        $('#wdialog').dialog('close');
                                    }
                                });
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

            LoadCourseInfoSelect(0, 'Ssubject');

        });

    }

    // 绑定搜索按钮
    $('#BtnSearch').click(function () {

        //if ($('#StudentText').attr('innt') == '1') {
        //    $.remind("请输入学生姓名再查询！");
        //    return;
        //}
        pager.pagination("select", 1);

    });

    // 绑定添加学生窗口
    $('#wdialog').dialog({
        width: 480,
        height: 330,
        onOpen: function () {
            $('#UserName').val('');
            $('#UserName').attr('disabled', false);
            $('#hiddenuserid').attr('flag', 'e');
            $('#hiddenuserid').val('');
            $('#RealName').html('');
            $('#UserSex').html('');
            $('#UserSchool').html('');
            $('#Ssubject').combobox('enable');
        }, buttons: [
                    {
                        text: '确定',
                        iconCls: 'icon-ok',
                        handler: function () {
                            addClass(function () {
                                $.messager.confirm('系统消息', '添加成功！<br/>需要继续添加该学生的课程吗？', function (r) {
                                    if (!r) {
                                        $('#wdialog').dialog('close');
                                    }
                                });
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

    $('#masterinput,#MasterLists').combobox({
        editable: false,
        valueField: 'id',
        textField: 'realname'
    });

    var MasterArray = [{ realname: "正在加载...", id: "0" }];
    $("#masterinput,#MasterLists").combobox("loadData", MasterArray);
    $("#masterinput,#MasterLists").combobox("setValue", "0");

    $.ajax({
        url: Webversion+'/user/teacher/list/0,200/withMaster' ,
        type: 'GET',
        data: { type: 3, 'r': $.getRom() },
        dataType: 'json',
        success: function (result) {

            MasterArray[0].realname = '请选择班主任';

            if (result != null && result.master != null) {

                $.each(result.master, function (i, n) {
                    MasterArray.push({ realname: n.realname, id: n.id });
                });

            }

            $("#masterinput,#MasterLists").combobox('enable');
            $("#masterinput,#MasterLists").combobox("loadData", MasterArray);
            $("#masterinput,#MasterLists").combobox("setValue", "0");
        }
    });

    function bindDataList(cid,tid) {
        $('#' + cid).combobox({
            onSelect: function (item) {

                var TeacherArray = [{ realname: "请选择教师", id: "0" }];

                if (item.id != null && parseInt(item.id) != 0) {

                    TeacherArray[0].realname = "正在加载...";
                    $("#" + tid).combobox("loadData", TeacherArray);
                    $("#" + tid).combobox("setValue", "0");

                    $.ajax({
                        url: Webversion + '/user/teacher/list/0,200/withMaster' ,
                        type: 'GET',
                        data: { type: 4, 'r': $.getRom() },
                        dataType: 'json',
                        success: function (result) {

                            TeacherArray[0].realname = '请选择教师';

                            if (result != null && $.isArray(result.teacher)) {

                                $.each(result.teacher, function (i, n) {
                                    var subjectTeacher = false;
                                    if (n.subject_grade != null) {
                                        var subject_grade = { subject: [0] };
                                        try {
                                            subject_grade = $.evalJSON(n.subject_grade);
                                        }
                                        catch (e)
                                        { }
                                        if ($.isArray(subject_grade.subject)) {
                                            $.each(subject_grade.subject, function (j, a) {
                                                if (parseInt(a) == parseInt(item.id)) {
                                                    subjectTeacher = true;
                                                    return false;
                                                }
                                            });
                                        }
                                    }

                                    if (subjectTeacher) {
                                        TeacherArray.push({ realname: n.realname, id: n.id });
                                    }
                                });

                            }

                            $("#" + tid).combobox('enable');
                            $("#" + tid).combobox("loadData", TeacherArray);
                            $("#" + tid).combobox("setValue", "0");
                        }
                    });

                } else {
                    $("#" + tid).combobox("loadData", TeacherArray);
                    $("#" + tid).combobox("setValue", "0");
                    $("#" + tid).combobox('disable');
                }
            }
        });
    }

    bindDataList('Ssubject', 'comteacher');
    bindDataList('ChangeCourse', 'TeacherLists');
    bindDataList('stucountsdddd', 'stuteassddent');

    // 查找学生信息
    function LoadStudentList(s, l) {

        var parameValue = {};
        var tempValue = $("#SGrade").combobox("getValue");
        if (parseInt(tempValue) > 0) {
            parameValue.grade_id = tempValue;
        }
        tempValue = $('#StudentText').val();
        if ($('#StudentText').attr('innt') != 1) {
            if ($.trim(parameValue).length > 0) {
                parameValue.realname = tempValue;
            }
        }

        parameValue.teacher_id = UserInfo.id;

        var ajaxParames = {
            url: Webversion + '/user/student/list/' + s + ',' + l + '/withEvaluation' ,
            type: "GET",
            dataType: "json",
            data: parameValue,
            success: function (result) {

                var reacodeList = [], total = 200;

                if (result != null && result.student != null) {
                    $.each(result.student, function (i, n) {
                        var tempItem = {};
                        tempItem.realname = n.realname;
                        tempItem.id = n.id;
                        tempItem.gender = n.gender;
                        tempItem.reg_time = n.reg_time;
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

                if (result.all) {
                    total = result.all;
                }

                $('#StudentManager').datagrid("loadData", reacodeList);

            },
            error: function (result) {

            }
        };

        //if ($.trim(parameValue).length > 0) {
        //    ajaxParames.data = { condition: parameValue };
        //}

        // 加载用户数据列表
        $.ajax(ajaxParames);
    }

    $("#divInfo").dialog({
        title: '查看学生信息',
        iconCls: 'icon-search',
        width: 600,
        height: 400,
        closed: true,
        cache: false,
        modal: true,
        collapsible: true,
        minimizable: false,
        maximizable: true
        //buttons: [{
        //    text: '关闭',
        //    iconCls: 'icon-cancel',
        //    handler: function () {
        //        javascript: $('#divInfo').dialog('close');
        //    }
        //}]
    });

    $("#dialogspan").dialog({
        title: '分数统计图表',
        iconCls: 'icon-chart',
        width: 600,
        height: 400,
        closed: true,
        cache: false,
        modal: true,
        collapsible: true,
        minimizable: false,
        maximizable: true
        //buttons: [{
        //    text: '关闭',
        //    iconCls: 'icon-cancel',
        //    handler: function () {
        //        javascript: $('#divInfo').dialog('close');
        //    }
        //}]
    });

    $('#studentinfo').tabs({
        border: false,
        plain: true,
        fit: true
    });

    var UserLevel = parseInt(UserInfo.level);

    if (UserLevel == 2 || UserLevel == 3) {
        $('#studentinfo').tabs('close', 1);
    } else if (UserLevel == 4) {
        $('#studentinfo').tabs('close', 2);
    }

});

// 添加班级
function addClass(f) {
    $.messager.progress({ text: '正在创建班级' });

    if ($('#hiddenuserid').attr('flag') != 's') {
        $.messager.progress('close');
        $.remind('请输入正确的学生账号或系统还未获取到学生信息！');
        return;
    }

    var tid = $('#comteacher').combobox('getValue'),
        tname = $('#comteacher').combobox('getText');
    if (parseInt(tid) < 1 || tname == null || tname.length == 0) {
        $.messager.progress('close');
        $.remind('请选择对应的教师！');
        return;
    }

    var mid = $('#masterinput').combobox('getValue'),
        mname = $('#masterinput').combobox('getText');
    if (parseInt(mid) < 1 || mname == null || mname.length == 0) {
        $.messager.progress('close');
        $.remind('请选择对应的班主任！');
        return;
    }

    var paramObj = {};
    paramObj.name = tname + '_' + $('#RealName').text();
    paramObj.student_id = $('#hiddenuserid').val();
    paramObj.teacher_id = tid;
    paramObj.master_id = mid;

    $.createClass(paramObj, function (result) {
        $.messager.progress('close');
        var pager = $('#StudentManager').datagrid("getPager");
        pager.pagination("select", 1);
        if (f != null) {
            f();
        }
    }, function (result) {
        $.messager.progress('close');
        $.error("添加失败！");
    });
}

function LoadCourseInfoSelect(subject_id, tid) {
    var GradeArray = [{ Name: "正在加载...", id: "0" }];

    $("#" + tid).combobox("loadData", GradeArray);
    $("#" + tid).combobox("select", "0");

    //获取学科
    $.ajax({
        url: Webversion + '/subject/list?r=' + $.getRom() ,
        type: "GET",
        dataType: "json",
        success: function (result) {

            GradeArray[0].Name = '请选择课程';

            if (result != null && result.subject != null) {
                $.merge(GradeArray, result.subject);
            }

            $("#" + tid).combobox("loadData", GradeArray);
            $("#" + tid).combobox("select", "0");

            if (subject_id != null) {
                $("#" + tid).combobox("select", subject_id);
                if (parseInt(subject_id) > 0) {
                    $('#' + tid).combobox('disable');
                }
            }
        },
        error: function (result) {
        }
    });
}

// 查看学生信息
function LookStudent(value, row) {

    var student_id = value;

    var runone = 0;

    $("#divInfo").dialog('open');

    var subject_id = 0;

    // 获取学生基本信息
    $.asyncStudent({
        condition: { uid: row.id },
        fields: ['username', 'realname', 'gender', 'grade_id', 'school_name', 'school_id', 'reg_time', 'last_login_time', 'pic', 'birth_date']
    },
        function (o) {
            if (o != null) {
                $('#username').html(o.username);
                $('#realname').html(o.realname == null ? '-' : o.realname);
                $('#gender').html(o.gender == null ? '-' : (parseInt(o.gender) == 0 ? '女' : '男'));
                $('#birth_date').html(o.birth_date == null ? '-' : o.birth_date);
                if (o.grade_id == null || o.grade_id < 1) {
                    $('#grade_id').html('-');
                } else {
                    $.asyncGradeInfo(o.grade_id, function (item) {
                        $('#grade_id').html(item.name == null ? '-' : item.name);
                    });
                }

                if (o.school_id != null) {
                    $.asyncSchool(o.school_id, function (result) {
                        if (result != null && result.school != null) {
                            $('#school_name').html(result.school.name);
                            return;
                        }
                        $('#school_name').html('-');
                    }, function (result) {
                        $('#school_name').html('-');
                    });
                } else {
                    $('#school_name').html('-');
                }

                $('#reg_time').html(o.reg_time == null ? '-' : o.reg_time);
                $('#last_login_time').html(o.last_login_time == null ? '-' : o.last_login_time);
                $('#pic').attr('src', o.pic);
            }

            // 构造对应学生测评数据
            $('#studenttestdata').datagrid({
                border: false,
                fit: true,
                rownumbers: true,
                onClose: function () {
                    $('#container').empty();
                },
                toolbar: [{
                    iconCls: 'icon-chart',
                    text: '生成成绩曲线',
                    handler: function () {

                        BornChart(value, subject_id);

                    }
                }, {
                    iconCls: 'icon-add',
                    text: '新建组卷',
                    handler: function () {
                        parent.ChangeThisTab("组卷", "TestPaper.html");
                    }
                }],
                columns: [[
                    { field: 'name', title: '测评卷名称', width: 160 },
                    { field: 'log_time', title: '测评时间', width: 120 },
                    { field: 'my_score', title: '成绩', width: 60, align: 'center' },
                    {
                        field: 'id', title: '操作', width: 90, align: 'center',
                        formatter: function (value, row, index) {
                            return "<a href=\"#\" style='color:blue;' onclick=\"\">查看测评卷</a>";
                        }
                    }
                ]]
            });

            var UserLevel = parseInt(UserInfo.level);
            if (UserLevel == 4) {

                // 获取教师对应的
                $.asyncTeacher({ condition: { uid: UserInfo.id }, fields: ['subject_grade'] }, function (result) {

                    if (result.subject_grade != null) {
                        var sg = $.evalJSON(result.subject_grade);
                        if (sg.subject != null && sg.subject.length > 0) {
                            subject_id = sg.subject[0];

                            $.ajax({
                                type: "GET",
                                dataType: "json",
                                url: Webversion + "/test/list/ok?r=" + $.getRom() ,
                                success: function (result) {
                                    if (result != null && result.test != null) {
                                        $('#studenttestdata').datagrid('loadData', result.test);
                                    }
                                }
                            });

                        }
                    }

                }, function (result) {

                });

            }
            else if (UserLevel == 2 || UserLevel == 3) {

                if (UserLevel == 3) { $("#addcourderbar").click(function () { $.remind('你没有添加学生课程的权限！<br/><span style="color:#ff0000;">提示：教学主任具有添加学生课程的权限。</span>'); }); };

                $("#addcourderbar").click(function () {

                    LoadCourseInfoSelect(row.subject_id, 'stucountsdddd');

                    $('#studentaddcourse').dialog({
                        title: '添加学生课程',
                        width: 480,
                        height: 140,
                        buttons: [{
                            text: '添加课程',
                            iconCls: 'icon-add',
                            handler: function () {

                                $.messager.progress({ text: '正在添加课程' });

                                var courseid = $('#stucountsdddd').combobox('getValue'),
                                    courname = $('#stucountsdddd').combobox('getText');
                                if (parseInt(courseid) < 1 || courname == null || courname.length == 0) {
                                    $.messager.progress('close');
                                    $.remind('请选择对应的课程！');
                                    return;
                                }

                                var tid = $('#stuteassddent').combobox('getValue'),
                                    tname = $('#stuteassddent').combobox('getText');
                                if (parseInt(tid) < 1 || tname == null || tname.length == 0) {
                                    $.messager.progress('close');
                                    $.remind('请选择对应的教师！');
                                    return;
                                }

                                var paramObj = {};
                                paramObj.name = tname + '_' + o.realname;
                                paramObj.student_id = row.id;
                                paramObj.teacher_id = tid;
                                paramObj.master_id = $('#spanmasterempty').attr('masterid');

                                $.createClass(paramObj, function (result) {
                                    $.messager.progress('close');
                                    $.messager.confirm('系统消息', '课程添加成功！<br/>需要继续添加该学生的课程吗？', function (r) {
                                        if (!r) {
                                            $('#studentaddcourse').dialog('close');
                                        }
                                        LoadClassList(student_id);
                                    });
                                }, function (result) {
                                    $.messager.progress('close');
                                    $.error("课程添加失败！");
                                });

                            }
                        }, {
                            text: '取消',
                            iconCls: 'icon-cancel',
                            handler: function () {
                                $('#studentaddcourse').dialog('close');
                            }
                        }]
                    });

                    $('#studentaddcourse').dialog('open');

                });

                // 构造学生学科信息
                $('#studentcoursein').datagrid({
                    border: false,
                    fit: true,
                    rownumbers: true,
                    toolbar: '#scbars',
                    columns: [[
                        {
                            field: 'subjectname', title: '课程', width: 100, align: 'center',
                            formatter: function (value, row, index) {

                                var htmlTemp = '<img alt="正在加载..." src="images/imgload.gif"/>';

                                if (value == null) {
                                    if (row.subject_id == 0) {
                                        htmlTemp = '-';
                                    } else {
                                        $.asyncSubject(row.subject_id, function (result) {

                                            $('#studentcoursein').datagrid('updateRow', {
                                                "index": index,
                                                "row": {
                                                    subjectname: result.Name == null ? '-' : result.Name
                                                }
                                            });

                                        }, function (result) {
                                            $('#studentcoursein').datagrid('updateRow', {
                                                "index": index,
                                                "row": {
                                                    subjectname: '-'
                                                }
                                            });
                                        });
                                    }
                                } else {
                                    htmlTemp = value;
                                }

                                return htmlTemp;

                            }
                        },
                        {
                            field: 'realname', title: '教师', width: 120, align: 'center',
                            formatter: function (value, row, index) {
                                if (UserLevel == 3) {
                                    value += '&nbsp;<a href="#" style="color:blue;" onclick="AltClassTeacher(' + row.subject_id + ',' + index + ',' + student_id + ',' + row.class_id + ',' + row.uid + ')">更换</a>';
                                }
                                return value;
                            }
                        },
                        {
                            field: 'total', title: '测评次数', width: 100, align: 'center',
                            formatter: function (value, row, index) {
                                if (value == null) {
                                    value = 0;
                                }
                                return value;
                            }
                        },
                        {
                            field: 'is_open', title: '操作', width: 90, align: 'center',
                            formatter: function (value, row, index) {
                                var s = '<a href="#" style="color:blue;" onclick="BornChart(' + student_id + ',' + row.subject_id + ')">查看</a>';
                                if (UserLevel == 2) {
                                    if (value == 0) {
                                        s += '&nbsp;&nbsp;<a href="#" style="color:blue;" onclick="openCloseClassStatue(' + index + ',' + row.class_id + ',' + student_id + ',1)">关闭课程</a>';
                                    } else {
                                        s += '&nbsp;&nbsp;<a href="#" style="color:blue;" onclick="openCloseClassStatue(' + index + ',' + row.class_id + ',' + student_id + ',0)">开启课程</a>';
                                    }
                                }

                                // 得到班主任信息
                                if (runone == 0 && row.class_id > 0) {

                                    $('#spanmasterempty').html('<img alt="正在获取班主任信息..." src="images/imgload.gif" style="border:none; border-width:0;"/>');
                                    $('#spanmasterempty').attr('masterid', 0);

                                    if (UserLevel == 2) {
                                        $("#changemasters").click(function () {

                                            $("#ChangeMasterInfo").dialog({
                                                title: '更换班主任',
                                                iconCls: 'icon-edit',
                                                width: 420,
                                                height: 200,
                                                closed: true,
                                                cache: false,
                                                modal: true,
                                                collapsible: true,
                                                minimizable: false,
                                                maximizable: true,
                                                buttons: [
                                                    {
                                                        text: '更改',
                                                        iconCls: 'icon-edit',
                                                        handler: function () {

                                                            if (parseInt($('#MasterLists').combobox('getValue')) == 0) {
                                                                $.remind('请选择班主任');
                                                                return;
                                                            }

                                                            var masterNameTemp = $('#MasterLists').combobox('getText');
                                                            var masterIdTemppp = $('#MasterLists').combobox('getValue');

                                                            $.messager.progress({ text: '系统正在更换班主任' });

                                                            // 更改当前用户班主任信息
                                                            $.ajax({
                                                                type: "POST",
                                                                dataType: "json",
                                                                url: Webversion + "/class/teacher?_method=PUT" ,
                                                                data: { 'student_id': student_id, 'teacher_id': masterIdTemppp, 'level': '3','r':$.getRom() },
                                                                success: function (result) {
                                                                    $.messager.progress('close');
                                                                    $.remind('班主任更换成功！', function () {
                                                                        // 更新当前班主任信息
                                                                        $('#spanmasterempty').html(masterNameTemp);
                                                                        $('#spanmasterempty').attr('masterid', masterIdTemppp);
                                                                        $('#ChangeMasterInfo').dialog('close');
                                                                    });

                                                                }, error: function (result) {
                                                                    $.messager.progress('close');
                                                                    $.remind('更换班主任失败！');
                                                                }
                                                            });

                                                        }
                                                    },
                                                    {
                                                        text: '关闭',
                                                        iconCls: 'icon-cancel',
                                                        handler: function () {
                                                            $('#ChangeMasterInfo').dialog('close');
                                                        }
                                                    }]
                                            });

                                            $("#ChangeMasterInfo").dialog('open');
                                        });

                                    } else {
                                        $("#changemasters").click(function () {
                                            $.remind('你没有更改班主任的权限！<br/><span style="color:#ff0000;">提示：教学主任具有更改班主任的权限。</span>');
                                        });
                                    }

                                    // 获取班级信息
                                    $.ajax({
                                        type: "GET",
                                        dataType: "json",
                                        url: Webversion + "/class/info" ,
                                        data: { 'class_id': row.class_id ,'r':$.getRom()},
                                        success: function (result) {
                                            if (result.class_info != null) {
                                                var hasMaster = false;
                                                $.each(result.class_info, function (index, o) {
                                                    if (o.relationship == 3) {
                                                        hasMaster = true;
                                                        var masterid = o.uid;

                                                        // 更换班主任
                                                        if (UserLevel == 2) {

                                                            $("#ChangeMasterInfo").dialog({
                                                                onOpen: function () {
                                                                    $('#MasterLists').combobox('setValue', masterid);
                                                                }
                                                            });

                                                        }

                                                        $('#spanmasterempty').attr('masterid', masterid);
                                                        $.asyncTeacher({ condition: { 'uid': masterid }, fields: ['realname'] },
                                                            function (to) {
                                                                $('#spanmasterempty').text(to.realname);
                                                            },
                                                            function (to) {
                                                                $('#spanmasterempty').html('<span>-获取班主任信息失败-</span>');
                                                                $('#spanmasterempty').attr('masterid', 0);
                                                            }
                                                        );
                                                        return false;
                                                    }
                                                });
                                                if (!hasMaster) {
                                                    $('#spanmasterempty').html('<span>-</span>');
                                                    $('#spanmasterempty').attr('masterid', 0);
                                                }
                                            }
                                        },
                                        error: function (result) {
                                            $('#spanmasterempty').html('<span>-获取班主任信息失败-</span>');
                                            $('#spanmasterempty').attr('masterid', 0);
                                        }
                                    });

                                    runone++;
                                }

                                return s;
                            }
                        }
                    ]]
                });

                LoadClassList(student_id);

            }
        });

}

// 开启关闭当前课程
function openCloseClassStatue(index, class_id, student_id, statue) {
    $.messager.confirm('系统提示', '确定要进行此操作吗？', function (r) {
        if (r) {
            var messagealt = "", returnMes = "操作成功！", errorMes = "操作失败！";
            if (statue == 0) {
                messagealt = "正在开启当前课程";
            }
            else if (statue == 1) {
                messagealt = "正在关闭当前课程";
            }
            $.messager.progress({ text: messagealt });
            $.ajax({
                type: "POST",
                dataType: "text",
                url: Webversion + "/class?_method=PUT" ,
                data: { 'class_id': class_id, 'is_open': statue,'r':$.getRom() },
                success: function (result) {
                    LoadClassList(student_id);
                    $.messager.progress('close');
                },
                error: function () {
                    $.messager.progress('close');
                    $.error(errorMes);
                }
            });
        }
    });
}

function LoadClassList(value) {
    $.ajax({
        type: "GET",
        dataType: "json",
        url: Webversion + "/user/teacher/list/0,200/withEvaluation" ,
        data: { student_id: value ,'r':$.getRom()},
        success: function (result) {
            var datalist = [];

            if (result != null && result.teacher != null) {
                $.each(result.teacher, function (i, n) {
                    var tempO = {};
                    tempO.uid = n.uid;
                    tempO.realname = n.realname;
                    tempO.subject_id = 0;
                    //tempO.grade_id = 0;
                    if (n.subject_grade != null) {
                        var sgtemp = $.evalJSON(n.subject_grade);
                        if (sgtemp.subject != null && sgtemp.subject.length > 0) {
                            tempO.subject_id = sgtemp.subject[0];
                        }
                    }
                    tempO.class_id = n.class_id;
                    if (result.evaluation != null) {
                        $.each(result.evaluation, function (k, o) {
                            if (o.class_id == n.class_id) {
                                tempO.total = o.total == null ? 0 : o.total;
                                return false;
                            }
                        });
                    }
                    if (result["class"] != null) {
                        $.each(result["class"], function (j, m) {
                            if (m.class_id == tempO.class_id) {
                                tempO.is_open = m.is_open;
                                return false;
                            }
                        });
                    }
                    datalist.push(tempO);
                });
            }

            $('#studentcoursein').datagrid('loadData', datalist);
        }
    });
}

function AltClassTeacher(subject_id, index, student_id, class_id, teacher_id) {

    $.messager.progress({ text: '正在加载数据' });

    LoadCourseInfoSelect(subject_id, 'ChangeCourse');

    $('#ChangeTeacher').dialog({
        title:'更改教师',
        width: 480,
        height: 150,
        onOpen: function () {
            $.messager.progress('close');
        },
        buttons: [{
            text: '更改教师',
            iconCls: 'icon-edit',
            handler: function () {

                var courseIdTemp = $('#ChangeCourse').combobox('getValue');
                if (courseIdTemp == null || courseIdTemp < 1) {
                    $.remind('请选择课程！');
                    return;
                }
                var tearcherTemp = $('#TeacherLists').combobox('getValue');
                if (tearcherTemp == null || tearcherTemp < 1) {
                    $.remind('请选择教师！');
                    return;
                }

                $.messager.progress({ text: '正在更改教师' });

                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: Webversion + "/class/teacher?_method=PUT&r="+$.getRom() ,
                    data: { 'class_id': class_id, 'teacher_id': tearcherTemp, 'level': '2' },
                    success: function (result) {
                        $.messager.progress('close');
                        $.remind('教师更改成功！');
                        $('#ChangeTeacher').dialog('close');
                        LoadClassList(student_id);
                    }, error: function (result) {
                        $.messager.progress('close');
                        $.remind('教师更改失败！');
                    }
                });
            }
        }, {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#ChangeTeacher').dialog('close');
            }
        }]
    });

    $('#ChangeTeacher').dialog('open');
}

function BornChart(value, subject_id) {
    $.messager.progress({ text: '正在生成图表' });

    var paramTemp = { 'student_id': value, 'subject_id': subject_id ,'r':$.getRom()};
    //var paramTemp = { 'student_id': 1, 'subject_id': 6 };

    $.ajax({
        type: "GET",
        dataType: "json",
        url: Webversion + "/mark/student" ,
        data: paramTemp,
        success: function (result) {
            var scort = [];
            var datet = [];

            if (result != null && result.mark != null) {
                $.each(result.mark, function (i, n) {
                    scort.push(parseInt(n.my_score));
                    datet.push(n.log_time);
                });
            }

            $("#dialogspan").dialog('open');

            var chart = new Highcharts.Chart({
                chart: {
                    renderTo: 'container',
                    type: 'line',
                    marginRight: 120,
                    marginBottom: 25
                },
                title: {
                    text: '学生测评分数曲线图',
                    x: 0 //center
                },
                subtitle: {
                    text: '',
                    x: 0
                },
                xAxis: {
                    categories: datet
                },
                yAxis: {
                    title: {
                        text: '分数 (100分)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                //tooltip: {
                //    formatter: function () {
                //        return '<b>' + this.series.name + '</b><br/>' +
                //        this.x + ': ' + this.y + '分';
                //    }
                //},
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'top',
                    x: -10,
                    y: 100,
                    borderWidth: 0
                },
                series: [{
                    name: '成绩',
                    data: scort
                }]
            });

            $.messager.progress('close');

        }, error: function (result) {
            $.messager.progress('close');
            $.error('图表生成失败！');
        }
    });
}
