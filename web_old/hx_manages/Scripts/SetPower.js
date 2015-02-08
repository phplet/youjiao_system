/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/Scripts/jquery.json.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/Common.js"/>

var UserInfo = {};

$(document).ready(function () {

    UserInfo = $.evalJSON($.cookie("UserInfo"));

    $(document).KeyInput($("#UserNameText"),'请输入姓名');

    $('#PowerManager').datagrid({
        fit: true,
        toolbar: '#SerToolBar',
        pagination: true,
        rownumbers: true,
        singleSelect: true,
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        columns: [[
            { field: 'realname', title: '姓名', width: 160, sortable: true },
            {
                field: 'powerName', title: '权限', width: 120, sortable: true,
                formatter: function (value, row, index) {
                    var htmlStr = value;
                    if (parseInt(row.type) == 2 && value == null) {
                        htmlStr = '<img alt="正在加载..." src="images/imgload.gif"/>';
                        $.asyncTeacher({ condition: { uid: row.id }, fields: ['subject_grade'] },
                            function (result) {

                                htmlStr = '普通教师';

                                if (result != null && result.subject_grade != null) {
                                    
                                    var sgtemp = $.evalJSON(result.subject_grade);

                                    if (sgtemp.subject != null && sgtemp.subject.length > 0) {

                                        $.asyncSubject(sgtemp.subject[0], function (o) {
                                            htmlStr = o.Name + '教师';
                                            $('#PowerManager').datagrid('updateRow', {
                                                "index": index,
                                                "row": {
                                                    powerName: htmlStr
                                                }
                                            });
                                        }, function (o) {
                                            htmlStr = '教师';
                                            $('#PowerManager').datagrid('updateRow', {
                                                "index": index,
                                                "row": {
                                                    powerName: htmlStr
                                                }
                                            });
                                        });

                                    } else {
                                        $('#PowerManager').datagrid('updateRow', {
                                            "index": index,
                                            "row": {
                                                powerName: htmlStr
                                            }
                                        });
                                    }

                                } else {
                                    $('#PowerManager').datagrid('updateRow', {
                                        "index": index,
                                        "row": {
                                            powerName: htmlStr
                                        }
                                    });
                                }

                            },
                            function (result) {

                                $('#PowerManager').datagrid('updateRow', {
                                    "index": index,
                                    "row": {
                                        powerName: htmlStr
                                    }
                                });

                        });
                    } 
                    return htmlStr;
                }
            },
            {
                field: 'id', title: '操作', align: 'center', width: 120,
                formatter: function (value, row, index) {
                    var s = "<a href=\"#\" style='color:blue;' onclick=\"EditPower('" + value + "'," + index + ")\">赋权</a>&nbsp;&nbsp;";
                    var c = "<a href=\"#\" style='color:blue;' onclick=\"DeletePower('" + value + "'," + index + ")\">删除权限</a>";
                    return s + c;
                }
            }
        ]]
    });

    var pager = $('#PowerManager').datagrid("getPager");
    pager.pagination({
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            var ltemp = (pageNumber - 1) * pageSize;
            LoadPowerList(ltemp, pageSize);
            $(this).pagination('loaded');
        }
    });

    pager.pagination("select", 1);

    // 定义负责人验证方式
    $.extend($.fn.validatebox.defaults.rules, {
        CheckUserInfo: {
            validator: function (value, param) {

                $("#RealName").html("");
                $("#UserSex").html("");
                $("#hiddenteacherid").attr('flag', 'e');
                $("#hiddenteacherid").val('');
                $('#CourseText').text('---无---');

                // 验证是否为电子邮件格式
                if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(com|cn|net)$/i.test(value)) {
                    return false;
                }

                var htmltemp = "<img alt='正在获取...' src='images/imgload.gif'/>正在获取...";
                $("#RealName").html(htmltemp);
                $("#UserSex").html(htmltemp);

                $.ajax({
                    url: Webversion + "/user/teacher/realname;gender;uid;subject_grade" ,
                    type: "GET",
                    data: { "condition": "username:" + value,'r':$.getRom() },
                    dataType: "json",
                    success: function (result) {
                        if (result != null && result.teacher != null) {
                            $("#RealName").html(result.teacher.realname);
                            $("#UserSex").html(result.teacher.gender == 1 ? '男' : '女');
                            $("#hiddenteacherid").attr('flag', 's');
                            $("#hiddenteacherid").val(result.teacher.uid);

                            // 设置学科
                            var subjectid = $.EvelSubjectGrade(result.teacher.subject_grade);
                            if (subjectid.subject != null && subjectid.subject.length > 0) {
                                $.asyncSubjectList(function (obj) {

                                    $.each(obj, function (index, o) {
                                        if (parseInt(o.id) == parseInt(subjectid.subject[0])) {
                                            $('#CourseText').text(o.Name);
                                            return false;
                                        }
                                    });

                                }, function () { });
                            }
                        }
                        else {
                            $("#RealName").html('<font color="red">-系统中不存在此用户-<font>');
                            $("#UserSex").html("");
                        }
                    }, error: function (result) {
                        $("#RealName").html('<font color="red">-系统获取用户信息失败-<font>');
                        $("#UserSex").html("");
                    }
                });
                return true;
            },
            message: '请输入正确的教师账号！'
        }
    });

    $("#SelectPower").combobox({
        panelHeight: 80,
        valueField: 'id',
        textField: 'text',
        editable: false,
        data: [
            { id: 0, text: "选择权限" },
            { id: 3, text: "班主任" },
            { id: 4, text: "教师" }
        ],
        onSelect: function (item) {
            if (item.id == 4) {
                $("#SpanCourse").show("fast");

            } else {
                $("#SpanCourse").hide("fast");
            }
        }
    });

    $("#SelectPower").combobox('select', 0);

    $("#PowerList").combobox({
        panelHeight: 75,
        valueField: 'id',
        textField: 'text',
        data: [
            { "id": 0, text: "请选择权限" },
            { "id": 3, text: "班主任" },
            { "id": 4, text: "教师" }
        ]
    });

    $("#PowerList").combobox('select', 0);

    var pager = $('#PowerManager').datagrid("getPager");
    pager.pagination({
        buttons: [{
            iconCls: 'icon-add',
            handler: function () {
                $('#WdialogAdd').dialog("open");
            }
        }]
    });

    $("#BtnAdd").click(function () {
        $('#WdialogAdd').dialog("open");
    });

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

                    if ($("#hiddenteacherid").attr('flag') != 's') {
                        //alert($("#hiddenteacherid").attr('flag'));
                        $.remind('请填写正确的账号信息！');
                        return;
                    }

                    // 开始创建权限
                    if (parseInt($('#SelectPower').combobox('getValue')) == 0) {
                        $.remind('请选择赋权对象！');
                        return;
                    }

                    var levelid = { teacher_id: $("#hiddenteacherid").val(), level: parseInt($('#SelectPower').combobox('getValue')) };

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

    AddPower();

    $("#BtnSearch").click(function () {
        pager.pagination("select", 1);
    });

});

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
            $.messager.alert('温馨提示', '权限设置成功！', 'info', function () {
                if (s != null) {
                    s();
                }
            });
        }, error: function (result) {
            $.messager.alert('错误提示', '权限设置失败！', 'error', function () {
                if (e != null) {
                    e();
                }
            });
        }
    });

}

// 加载权限列表
function LoadPowerList(s, l) {

    var paramesObject = {};
    var masterName = $('#UserNameText').val();

    if ($('#UserNameText').attr('innt') != 1 && $.trim(masterName).length > 0) {
        paramesObject.realname = masterName;
    }

    $.ajax({
        url: Webversion + '/user/teacher/list/' + s + ',' + l + '/withMaster?r=' + $.getRom() ,
        type: "GET",
        dataType: "json",
        data: paramesObject,
        success: function (result) {
            // 1班主任 2教师
            var data = [];
            if (result.master != null) {
                $.each(result.master, function (i, n) {
                    n.type = 1;
                    n.powerName = '班主任';
                    data.push(n);
                });
            }

            if (result.teacher != null) {
                $.each(result.teacher, function (i, n) {
                    n.type = 2;
                    data.push(n);
                });
            }

            $('#PowerManager').datagrid("loadData", data);
        },
        error: function (result) {

        }
    });
}

function EditPower(value, index) {

    $("#WdialogEdit").dialog({
        title: '权限设置',
        width: 370,
        height: 160,
        closed: false,
        cache: false,
        modal: true,
        buttons: [{
            text: '保存',
            iconCls: 'icon-save',
            handler: function () {

                if (parseInt($('#PowerList').combobox('getValue')) == 0) {
                    $.remind('请选择赋权对象！');
                    return;
                }

                var levelid = { teacher_id: value, level: parseInt($('#PowerList').combobox('getValue')) };

                changePower(levelid);

                pager.pagination("select", 1);

            }
        }, {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#WdialogEdit').dialog('close');
            }
        }]
    });

    $.messager.progress({text:'正在加载数据'});

    // 开始创建权限
    $.asyncTeacher({ condition: { uid: value }, fields: ['realname'] },
        function (obj) {
            $('#SpanUserName').text((obj.realname == null || obj.realname == '') ? '-' : obj.realname);
            $.messager.progress('close');
        },
        function (obj) {
            $('#WdialogEdit').dialog('close');
            $.remind('参数为无效数据！');
            $.messager.progress('close');
        });

}

function DeletePower(value, index) {

    $.messager.confirm('删除权限', '确定要删除吗?', function (r) {
        if (r) {

            var levelid = { teacher_id: value, level: 4 };

            changePower(levelid);

            var pager = $('#PowerManager').datagrid("getPager");
            pager.pagination("select", 1);

        }
    });

}