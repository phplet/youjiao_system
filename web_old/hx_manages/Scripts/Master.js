/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/Scripts/jquery.json.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/Common.js"/>

$(document).ready(function () {

    $(document).KeyInput($("#StudentText"), '输入班主任姓名');

    $('#MasterManager').datagrid({
        fit: true,
        toolbar: '#SerToolBar',
        pagination: true,
        rownumbers: true,
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...',
        columns: [[
            { field: 'id', title: '编号', width: 65, align: 'center', sortable: true },
            { field: 'realname', title: '班主任', width: 120, align: 'center', sortable: true },
            {
                field: 'count', title: '学生数量', width: 100, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                    htmlStr = '<img alt="正在加载..." src="images/imgload.gif"/>';

                    if (value == null) {
                        $.asyncStudentCount(row.id, 'byMaster',
                            function (c) {
                                $('#MasterManager').datagrid('updateRow', {
                                    "index": index,
                                    "row": {
                                        count: c
                                    }
                                });
                            },
                            function (c) {
                                $('#MasterManager').datagrid('updateRow', {
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
                    return "<a href=\"#\" style='color:blue;' onclick=\"LookTeacherInfo('" + row.id + "')\">查看班主任详情</a>";
                }
            }
        ]]
    });

    var pager = $('#MasterManager').datagrid("getPager");
    pager.pagination({
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            var ltemp = (pageNumber - 1) * pageSize;
            LoadMastList(ltemp, pageSize);
            $(this).pagination('loaded');
        }
    });

    pager.pagination("select", 1);

   $.asyncSubjectList(
        function (obj) {
            var GradeArray = [{ label: "请选择学科", value: "0" }];
            $.each(obj, function (i, n) {
                if (n != null) {
                    GradeArray.push({ label: n.Name, value: n.id });
                }
            });
            $("#Ssubject").combobox("loadData", GradeArray);
            $("#Ssubject").combobox("setValue", "0");
        },function(){});



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

   $("#BtnSearch").click(function () {
       pager.pagination("select", 1);
   });
    

});

function LoadMastList(s, l) {

    var paramesObject = { 'type': 3 };

    var subjectValue = $('#Ssubject').combobox('getValue');
    var masterName = $('#StudentText').val();

    if (parseInt(subjectValue) > 0) {
        paramesObject.subject_id = subjectValue;
    }

    if ($('#StudentText').attr('innt') != 1 && $.trim(masterName).length > 0) {
        paramesObject.realname = masterName;
    }

    $.ajax({
        url: Webversion + '/user/teacher/list/' + s + ',' + l + '/withMaster?r=' + $.getRom() ,
        type: "GET",
        data: paramesObject,
        dataType: "json",
        success: function (result) {

            if (result == null || result.master == null) {
                result = {};
                result.master = [];
            }

            $('#MasterManager').datagrid("loadData", result.master);
        }
    });

}




//查阅教师信息
function LookTeacherInfo(value) {

    $.messager.progress({ text: '正在加载班主任信息' });

    $("#divInfo").dialog({
        title: '教师信息',
        width: 500,
        height: 350,
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

    $.asyncTeacher({ condition: { uid: value }, fields: ['username', 'realname', 'gender', 'school_id', 'reg_time', 'last_login_time','pic'] },
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

            $.asyncStudentCount(value, 'byMaster',
                function (result) {
                    $('#studentnumber').text(result);
                },
                function () {
                    $('#studentnumber').text('0');
                });

            $.asyncCountMasterTest(value,
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

    //$.ajax({
    //    url: Webversion + "/user/teacher/usr_teacher.mobile;usr_teacher.email;usr_teacher.id" ,
    //    type: "get",
    //    data: { uid: value },
    //    dataType: "json",
    //    success: function (result) {
    //        $("#lbRealName").html('张三');
    //        $("#lbSex").html('男')
    //        $("#lbSubject").html('语文');
    //        $("#lbSchoolArea").html('贵族校区');
    //        $("#lbStudentNum").html('12');
    //        $("#lbRegdate").html(new Date().toString());
    //        $("#lbCpNum").html('120');
    //        $("#lbLastDate").html(new Date().toString());
    //    },
    //    error: function (result) {
    //    }
    //});
    //当前教师下的学生列表
    //$.ajax({
    //    url: Webversion + "/user/teacher/usr_teacher.mobile;usr_teacher.email;usr_teacher.id" ,//接口未知
    //    type: "get",
    //    data: { uid: value },
    //    dataType: "json",
    //    success: function (result) {
    //        var data = [];
    //        data.push({ id: 1, name: '张三', grade: '初二', cpNum: 22 });
    //        data.push({ id: 2, name: '里斯', grade: '高一', cpNum: 1 });
    //        data.push({ id: 3, name: '旺旺', grade: '高手', cpNum: 3 });
    //        data.push({ id: 4, name: '吃的', grade: '高一', cpNum: 55 });
    //        data.push({ id: 5, name: '散掉', grade: '初二', cpNum: 6 });
    //        $('#StudentList').datagrid("loadData", data);
    //    },
    //    error: function (result) {
    //    }
    //});

}