/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/Scripts/jquery.json.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/Common.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.Plug.js"/>

var dilogSpanId = "CreateTestControl";

$(document).ready(function () {

    // 获取年级信息
    $.ajax({
        url: Webversion + "/grade/list?r=" + $.getRom() ,
        type: "GET",
        dataType: "json",
        success: function (result) {
            var GradeArray = [{ label: "不限年级", value: "0" }];

            if (result != null && result.grade != null) {
                $.each(result.grade, function (i, n) {
                    if (n != null && n.display_flag == 1) {
                        GradeArray.push({ label: n.name, value: n.id });
                    }
                });
                $("#SGrade").combobox("loadData", GradeArray);
                $("#SGrade").combobox("setValue", "0");
            }
        },
        error: function (result) {

        }
    });

    function SearchTextInitial() {
        $("#StudentText").val("请输入学生姓名");
        $("#StudentText").attr("innt", "1");
        $("#StudentText").css("color", "#808080");
        $("#StudentText").attr("title", "请输入学生姓名");
    }

    SearchTextInitial();

    $("#StudentText").focus(function () {
        if ($("#StudentText").attr("innt") == "1") {
            $("#StudentText").val("");
        }
        $("#StudentText").removeAttr("innt");
        $("#StudentText").css("color", "#000000");
    });

    $("#StudentText").blur(function () {
        if ($.trim($("#StudentText").val()).length == 0) {
            SearchTextInitial();
        }
    });

    $('#EvaluationManager').datagrid({
        fit: true,
        pagination: true,
        rownumbers: true,
        singleSelect: true,
        pagePosition: "both",
        pageList: [50, 60, 80, 90, 100],
        loadMsg: '正在加载数据...',
        columns: [[
            { field: 'name', title: '试卷', width: 180, sortable: true },
            {
                field: 'class_name', title: '班级', width: 120, sortable: true, formatter: function (value, row, index) {
                    var className = '<img alt="正在加载..." src="images/imgload.gif"/>';

                    if (!row.class_name) {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: Webversion + "/class/info" ,
                            data: { class_id: row.class_id, 'r': $.getRom() },
                            success: function (result) {
                                className = "-";
                                $('#EvaluationManager').datagrid('updateRow', {
                                    "index": index,
                                    "row": {
                                        class_name: className
                                    }
                                });
                            }
                        });
                    } else {
                        className = row.class_name;
                    }

                    return className;
                }
            },
            {
                field: 'subject_name', title: '学科', width: 120, sortable: true,
                formatter: function (value, row, index) {
                    var subjectName = '<img alt="正在加载..." src="images/imgload.gif"/>';

                    if (!row.subject_name) {
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            url: Webversion + "/subject/list" ,
                            data: { id: row.subject_id, 'r': $.getRom() },
                            success: function (result) {
                                subjectName = "-";
                                if (result != null && result.subject != null && result.subject.length > 0) {
                                    subjectName = result.subject[0].Name;
                                }

                                $('#EvaluationManager').datagrid('updateRow', {
                                    "index": index,
                                    "row": {
                                        subject_name: subjectName
                                    }
                                });
                            }, error: function () {
                                $('#EvaluationManager').datagrid('updateRow', {
                                    "index": index,
                                    "row": {
                                        subject_name: "-"
                                    }
                                });
                            }
                        });
                    } else {
                        subjectName = row.subject_name;
                    }

                    return subjectName;
                }
            },
            {
                field: 'id', title: '操作', align: 'center',width:75,
                formatter: function (value, row, index) {
                    return '<a href="#" onclick="createTest(\'' + value + '\',\'' + row["name"] + '\',' + index + ')" style="color:blue;">生成</a>';
                }
            }
        ]]
    });

    $('#SearchBar').dialog({
        title: '查询待生成测评',
        width: 450,
        height: 90,
        closed: true,
        cache: true,
        modal: true,
        collapsible: false,
        minimizable: false,
        maximizable: false,
        resizable: false
    });

    // 设置分页面板
    var pager = $('#EvaluationManager').datagrid('getPager');
    pager.pagination({
        buttons: [{
            iconCls: 'icon-search',
            handler: function () {
                $('#SearchBar').dialog('open');
            }
        }]
    });

    loadData();

    $("<div id='" + dilogSpanId + "'></div>").appendTo("body");
});

// 加载未生成试卷列表
function loadData() {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: Webversion + "/exam/list/wait?r=" + $.getRom() ,
        success: function (result) {
            if (result != null && result.exam != null) {
                $("#EvaluationManager").datagrid("loadData", result.exam);
            }
        },
        error: function (result) {
            //$.messager.alert('温馨提示', '未生成试卷列表数据加载失败！');
        }
    });

}

// 生成试卷
function createTest(value, title, index) {

    $.messager.progress({ text: '正在加载数据' });

    // 获取试卷
    $.ajax({
        type: "GET",
        dataType: "json",
        url: Webversion + "/exam" ,
        data: { exercise_id: value,'r':$.getRom() },
        success: function (result) {
            if (result == null || result.question == null) {
                $.messager.progress("close");
                $.messager.alert('温馨提示', '账号异常：<br/>1.账号在别的地方登录，重新登录；<br/>2.网络加载失败,测试网络是否畅通。','warning');
                return;
            }

            var question = $.evalJSON(Base64.decode(result.question));

            var htmlContent = "<div style='padding:10px 25px 30px 25px;'><div style='text-align:center;'><h1>" + title + "</h1></div><div>";

            if (question && question.length > 0) {
                $.each(question, function (i, n) {
                    htmlContent += "<p>" +i+'、'+ n.content + "</p>";
                });
            }

            htmlContent += "</div></div>";

            $("#" + dilogSpanId).dialog({
                title: "生成：" + title,
                closed: false,
                cache: false,
                width: 750,
                height: 420,
                collapsible: true,
                minimizable: true,
                resizable: true,
                maximizable: true,
                modal: true,
                onClose: function () {
                    loadData();
                },
                content: htmlContent,
                buttons: [{
                    text: '生成试卷并导出word文档',
                    iconCls: 'icon-save',
                    handler: function () {

                        $.messager.progress({ text: '正在生成试卷' });

                        $.ajax({
                            type: "POST",
                            dataType: "json",
                            url: Webversion + "/exam" ,
                            data: { exercise_id: value,'r':$.getRom() },
                            success: function (result) {

                                $.messager.progress("close");

                                $.messager.alert('温馨提示', '系统生成试卷成功,开始导出WORD文档！', 'info',
                                    function () {

                                        $("#" + dilogSpanId).dialog("close");

                                        $.messager.progress({ text: '正在生成WORD文档' });

                                        // 生成试卷WORD文档
                                        $.ajax({
                                            type: "GET",
                                            dataType: "json",
                                            url: Webversion + "/exam/word" ,
                                            data: { exercise_id: value, 'r': $.getRom() },
                                            success: function (result) {
                                                $.messager.progress("close");
                                                if (result && result.url && $.trim(result.url).length > 0) {
                                                    document.location = result.url;
                                                }
                                                else {
                                                    $.messager.alert('温馨提示', '系统生成的WORD文档为空！');
                                                }
                                            },
                                            error: function (result) {
                                                $.messager.progress("close");
                                               $.messager.alert('温馨提示', '账号异常：<br/>1.账号在别的地方登录，重新登录；<br/>2.网络加载失败,测试网络是否畅通。','warning');
                                            }
                                        });
                                    });
                            },
                            error: function (result) {
                                $.messager.progress("close");
                                $.messager.alert('温馨提示', '账号异常：<br/>1.账号在别的地方登录，重新登录；<br/>2.网络加载失败,测试网络是否畅通。','warning');
                            }
                        });

                    }
                },
                {
                    text: '取消',
                    iconCls: 'icon-cancel',
                    handler: function () {
                        $("#" + dilogSpanId).dialog("close");
                    }
                }]
            });

            $.messager.progress("close");

        },
        error: function (result) {
            $.messager.progress("close");
            $.messager.alert('温馨提示', '账号异常：<br/>1.账号在别的地方登录，重新登录；<br/>2.网络加载失败,测试网络是否畅通。','warning');
        }

    });
}