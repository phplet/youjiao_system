/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.easyui.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.json.min.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.Plug.js"/>


var dilogSpanId = "CorrectTestControl";

// 实体输入框id s学生 a答案 c是否客观题 f分数 m本题总分 l题目量
var QuestionInput = { s: "StudentAnswer", a: "CorrectAnswer", c: "QuestionCheck", f: "StudentFraction", m: "TCountSorce", l: "0" };


(function ($) {

    var UserInfo = $.evalJSON($.cookie("UserInfo"));
    // 用户类别
    var UserLevel = parseInt(UserInfo.level);
   
    $(document).ready(function () {
        $('#EvaluationHistoryManager').datagrid({
            fit: true,
            pagination: true,
            rownumbers: true,
            singleSelect: true,
            pagePosition: "both",
            pageList: [50, 60, 80, 90, 100],
            loadMsg: '正在加载数据...',
            columns: [[
                { field: 'name', title: '试卷', width: 240, sortable: true },
                {
                    field: 'class_name', title: '学生', width: 120, sortable: true, formatter: function (value, row, index) {
                        var className = '<img alt="正在加载..." src="images/imgload.gif"/>';

                        if (!row.class_name) {
                            $.ajax({
                                type: "GET",
                                dataType: "json",
                                url: Webversion + "/class/info" ,
                                data: { class_id: row.class_id ,'r':$.getRom()},
                                success: function (result) {
                                    className = "-";
                                    $('#EvaluationHistoryManager').datagrid('updateRow', {
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
                                url: Webversion+"/subject/list" ,
                                data: { id: row.subject_id ,'r':$.getRom()},
                                success: function (result) {
                                    subjectName = "-";
                                    if (result != null && result.subject != null && result.subject.length > 0) {
                                        subjectName = result.subject[0].Name;
                                    }

                                    $('#EvaluationHistoryManager').datagrid('updateRow', {
                                        "index": index,
                                        "row": {
                                            subject_name: subjectName
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
                    field: 'id', title: '操作', align: 'center', width: 75,
                    formatter: function (value, row, index) {
                        return '<a href="#" onclick="TestHistory(\'' + row["id"] + '\',\'' + row["test_id"] + '\',\'' + row["name"] + '\',' + index + ',' + row["subject_id"] + ',' + row["class_id"] + ')" style="color:blue;">查看评测卷</a>';
                    }
                }
            ]]
        });

        // 设置分页面板
        var pager = $('#EvaluationHistoryManager').datagrid('getPager');
        var pagerButtons = [];
        if (UserLevel == 4) {
            pagerButtons.push({
                iconCls: 'icon-add',
                handler: function () {
                    parent.ChangeThisTab("组卷", "TestPaper.html?r="+$.getRom());
                }
            });
        }
        //pagerButtons.push({
        //    iconCls: 'icon-search',
        //    handler: function () {
        //        $('#SearchBar').dialog('open');
        //    }
        //});
        pager.pagination({
            buttons: pagerButtons
        });

        loadData();

        $("<div id='" + dilogSpanId + "'></div>").appendTo("body");

    });


    

})(jQuery);

// 加载历史测评数据列表
function loadData() {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: Webversion + "/exam/list/ok?r=" + $.getRom() ,
        success: function (result) {
            if (result != null && result.exam != null) {
                $("#EvaluationHistoryManager").datagrid("loadData", result.exam);
            }
        },
        error: function (result) {
           $.messager.alert('温馨提示', '账号异常：<br/>1.账号在别的地方登录，重新登录；<br/>2.网络加载失败,测试网络是否畅通。','warning');
        }
    });

}


// 查看历史测评记录
function TestHistory(exercise_id, test_id, title, index, subject, class_id) {

    $.messager.progress({ text: '正在加载数据' });

    // 获取试卷信息
    $.ajax({
        type: "GET",
        dataType: "json",
        url: Webversion + "/exam" ,
        data: { exercise_id: exercise_id,'r':$.getRom() },
        success: function (result) {
            if (result == null || result.question == null) {
                $.messager.progress("close");
                $.messager.alert('温馨提示', '账号异常：<br/>1.账号在别的地方登录，重新登录；<br/>2.网络加载失败,测试网络是否畅通。','warning');
                return;
            }

            var question = $.evalJSON(Base64.decode(result.question));

            var htmlContent = '<div style="padding:0px 20px 30px 20px;"><div style="text-align:center;"><h1 style="padding-bottom:0px;">' + title + '</h1></div>';

            if (question && (QuestionInput.l = question.length) > 0) {
                $.each(question, function (i, n) {
                    htmlContent += '<div style="border-bottom:1px dashed #cccccc; padding:15px;">' + (i + 1) + '、' + n.content;
                    htmlContent += '<div style="padding:7px 16px 8px 16px;background-color:#eeeeee;">';
                    htmlContent += '学生答题：<span id="' + QuestionInput.s + n.id + '"></span><br/>';
                    var flagtemp = false;
                    if (flagtemp = (parseInt(n.objective_flag) == 1)) {
                        htmlContent += '正确答题：<span id="' + QuestionInput.a + n.id + '" style="color:#ff0000;font-weight:bolder;">' + n.objective_answer + '</span><br/>';
                    }
                    htmlContent += '本题得分：<span id="' + QuestionInput.f + n.id + '" ></span>&nbsp;';
                    if (flagtemp) {
                        htmlContent += '&nbsp;&nbsp;<label for="' + QuestionInput.c + n.id + '" style="visibility:hidden;"><input id="' + QuestionInput.c + n.id + '" type="checkbox" disabled="disabled" checked="checked"/>是客观题</label>';
                    }
                    htmlContent += "</div></div>";
                });
            }

            htmlContent += "</div>";

            $.messager.progress('close');
            // 获取测试信息
            $.messager.progress({ text: '正在获取测评信息' });
            $.ajax({
                type: "GET",
                dataType: "json",
                url: Webversion + "/test" ,
                data: { test_id: exercise_id },
                success: function (result) {

                    $.messager.progress('close');

                    $("#" + dilogSpanId).dialog({
                        title: "查看测评：" + title,
                        closed: false,
                        cache: false,
                        width: 800,
                        height: 480,
                        collapsible: true,
                        minimizable: true,
                        resizable: true,
                        maximizable: true,
                        modal: true,
                        onOpen: function () {
                            //for (var i = 0; i < QuestionInput.l; i++) {
                            //    $("#" + QuestionInput.s + question[i].id).validatebox({ required: true });
                            //    $("#" + QuestionInput.a + question[i].id).validatebox({ required: true });
                            //    $("#" + QuestionInput.f + question[i].id).validatebox({ required: true });
                            //}

                            var scoreCount = 0;

                            // 设置正确答案
                            if (result && result.content) {
                                $.each(result.content, function (i, n) {
                                    if (parseInt(n.obj) == 1) {
                                        $("#" + QuestionInput.c + n.id).attr("checked", true);
                                        $("#" + QuestionInput.s + n.id).validatebox({ validType: "calculate[" + $.toJSON(n) + "]" });
                                    } else {
                                        $("#" + QuestionInput.c + n.id).attr("checked", false);
                                    }
                                    $("#" + QuestionInput.a + n.id).text(n.answer);
                                    $("#" + QuestionInput.m + n.id).attr("sum", n.score);
                                    $("#" + QuestionInput.f + n.id).validatebox({ validType: "vscore[" + n.score + "]" });

                                    scoreCount += parseFloat(n.score);

                                });
                            }

                            tempParam.score = scoreCount;
                        },
                        content: htmlContent
                    });

                }
            });

        },
        error: function (result) {
            $.messager.progress("close");
            $.messager.alert('温馨提示', '测评试卷内容信息获取失败！');
        }

    });
}