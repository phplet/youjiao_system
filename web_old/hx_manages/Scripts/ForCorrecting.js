/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/Scripts/jquery.json.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/Common.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.Plug.js"/>

var dilogSpanId = "CorrectTestControl";

// 实体输入框id s学生 a答案 c是否客观题 f分数 
var QuestionInput = { s: "StudentAnswer", a: "CorrectAnswer", c: "QuestionCheck", f: "StudentFraction" };

$(document).ready(function () {

    // 设定验证规则
    $.extend($.fn.validatebox.defaults.rules, {
        calculate: {
            validator: function (value, p) {

                // 验证分数是否为数字
                if (!(/^\d+$/.test(value))) {
                    return false;
                }

                // 是否为客观题
                var isObjective = parseInt(p[0]);
                if (isObjective == 1) {
                    // 客观题的正确答案
                    var answer = p[1];
                    var answid = p[2];
                    if ($.trim($("#" + answid).val()).toUpperCase() != answer.toUpperCase() && parseFloat(value) > 0) {
                        return false;
                    }
                }

                return true;
            },
            message: '分数格式为数字或做错的客观题分数值不为0。'
        }
    });

    // 获取年级列表信息
    $.ajax({
        url: Webversion + "/grade/list?r="+$.getRom() ,
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

    // 构造待批该数据列表
    $('#ForCorrectingManager').datagrid({
        fit: true,
        pagination: true,
        rownumbers: true,
        singleSelect: true,
        pagePosition: "both",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据',
        columns: [[
            { field: 'name', title: '试卷', width: 240, sortable: true },
            {
                field: 'student_name', title: '学生', width: 120, sortable: true,
                formatter: function (value, row, index) {
                    var studentName = '<img alt="正在加载..." src="images/imgload.gif"/>';

                    if (!row.student_name) {
                        //student_id
                        $.asyncStudent({ condition: { uid: row.student_id }, fields: ['realname'], 'r': $.getRom() }, function (studentinfo) {
                            studentName = studentinfo.realname == null ? '-' : studentinfo.realname;
                            $('#ForCorrectingManager').datagrid('updateRow', {
                                "index": index,
                                "row": {
                                    student_name: studentName
                                }
                            });
                        }, function () {
                            $('#ForCorrectingManager').datagrid('updateRow', {
                                "index": index,
                                "row": {
                                    student_name: '-'
                                }
                            });
                        });

                    } else {
                        studentName = row.student_name;
                    }

                    return studentName;
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

                                $('#ForCorrectingManager').datagrid('updateRow', {
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
                field: 'exercise_id', title: '操作', align: 'center', width: 75,
                formatter: function (value, row, index) {
                    return '<a href="#" onclick="CorrectTest(\'' + row["exercise_id"] + '\',\'' + row["test_id"] + '\',\'' + row["name"] + '\',' + index + ',' + row["subject_id"] + ',' + row["class_id"] + ',' + row["student_id"] + ')" style="color:blue;">批改</a>';
                }
            }
        ]]
    });

    // 待批改搜索框面板
    $('#SearchBar').dialog({
        title: '查询待批改测评',
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
    var pager = $('#ForCorrectingManager').datagrid('getPager');
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

// 加载未批改试卷列表
function loadData() {

    $.ajax({
        type: "GET",
        dataType: "json",
        url: Webversion + "/test/list/wait?r=" + $.getRom() ,
        success: function (result) {
            if (result != null && result.test != null) {
                $("#ForCorrectingManager").datagrid("loadData", result.test);
            }
        },
        error: function (result) {
            // $.messager.alert('温馨提示', '待批改试卷列表数据加载失败！');
        }
    });

}

var question = null;
var conQuestion = false;

// 批改试卷方法
function CorrectTest(exercise_id, test_id, title, index, subject, class_id, student_id) {

    $.messager.progress({ text: '正在获取试卷信息' });

    var tempParam = { test_id: test_id, do_time: "2012-03-30", duration: 90, score: 100 };
	//alert(tempParam);
    var ifMapping = 0;

    // 获取试卷信息
    $.ajax({
        type: "GET",
        dataType: "json",
        url: Webversion + "/exam" ,
        data: { "exercise_id": exercise_id, "student_id": student_id,'r':$.getRom() },
        success: function (result) {
            if (result == null || result.question == null) {
                $.messager.progress('close');
                $.messager.alert('温馨提示', '系统获取试卷信息失败！');
                return;
            }

            //$.messager.progress('close');

            // 获取测试信息
            //$.messager.progress({ text: '正在构造试卷内容' });

            //alert(Base64.decode(result.question));

            question = $.evalJSON(Base64.decode(result.question));
            var param = $.evalJSON(result.param);
            var htmlContent = '<div style="padding:0px 20px 30px 20px;"><div style="text-align:center;"><h1 style="padding-bottom:0px;">' + title + '</h1></div><form id="CorrectForm">';
            var testUserInfo = { name: '-', grade: '-', subject: '-', teacher: '-', time: '-', level: '-', point: '0' };

            testUserInfo.point = 0;

            conQuestion = false;

            if (conQuestion = (question && question.length > 0)) {
                $.each(question, function (i, n) {

                    var objective_anseasetemp = n.objective_answer;
                    var subjective_anseasetemp = n.answer;
                    param.condition.objective_score = Math.round(param.condition.objective_score);
                    param.condition.subjective_score = Math.round(param.condition.subjective_score);

                    htmlContent += '<div style="border-bottom:1px dashed #cccccc; padding:15px;">' + (i + 1) + '、' + n.content;
                    htmlContent += '<div style="padding:7px 16px 8px 16px;background-color:#eeeeee;">';
                    var flagtemp = parseInt(n.objective_flag) == 1;

                    if (flagtemp && n.objective_answer.length > 1) {
                        var filerchar = ['组', '不'];
                        // 对答案进行过滤,组、
                        var lastchartemp = objective_anseasetemp.substr(objective_anseasetemp.length - 1, 1);
                        $.each(filerchar, function (it, n) {
                            if (n == lastchartemp) {
                                objective_anseasetemp = objective_anseasetemp.substr(0, objective_anseasetemp.length - 1);
                                return false;
                            }
                        });
                    }

                    if (flagtemp) {
                        htmlContent += '本题分值：' + param.condition.objective_score + '分<br/>';
                    }
                    else {
                        htmlContent += '本题分值：' + param.condition.subjective_score + '分<br/>';
                    }

                    if (flagtemp && n.objective_answer.length == 1) {
                        var option_count = parseInt(n.option_count);
                        var radioHtml = "";
                        var anssss = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"];
                        for (var i = 0; i < option_count; i++) {
                            radioHtml += '<input type="radio" class="objective_radio" value="' + anssss[i] + '" rel="' + n.id + '" id="objective____' + n.id + '__option_' + i + '" name="objective____' + n.id + '" answer="' + n.objective_answer + '" score="' + param.condition.objective_score + '"/><label for="objective____' + n.id + '__option_' + i + '">' + anssss[i] + '</label>';
                        }

                        htmlContent += '请录入学生答案：' + radioHtml + '<input id="' + QuestionInput.s + n.id + '" type="text" style="visibility:hidden;"/><br/>';
                    } else {
                        htmlContent += '请录入学生答案：<input id="' + QuestionInput.s + n.id + '" type="text" style="width:360px;border:0; border-bottom:1px solid #000000;background-color:#eeeeee;"/><br/>';
                    }

                    if (flagtemp && n.objective_answer.length == 1) {
                        htmlContent += '<span id="showspan_' + n.id + '" style="display:none;">' +
                            '<span id="objectiveisyes____show_' + n.id + '"></span><br/>' +
                            '正确答案：<span id="' + QuestionInput.a + n.id + '" style="color:#ff0000;font-weight:bolder;">' + objective_anseasetemp + '</span><br/>'
                            + '本题得分：<span id="objective____show_' + n.id + '"></span><input id="' + QuestionInput.f + n.id + '" type="hidden" style="visibility:hidden;"/><span><br/>';
                    }
                    else {
                        var tempscoreselectlist = 0;
                        var tempseddsoansew = '';
                        if (flagtemp) {
                            tempscoreselectlist = param.condition.objective_score;
                            tempseddsoansew = objective_anseasetemp;
                        } else {
                            tempscoreselectlist = param.condition.subjective_score;
                            tempseddsoansew = subjective_anseasetemp;
                        }
                        htmlContent += '正确答案：<span id="' + QuestionInput.a + n.id + '" style="color:#ff0000;font-weight:bolder;">' + tempseddsoansew + '</span><br/>' +
                            '请录入学生得分：<input class="subjective_getscore" gvflag="combobox" score="' + tempscoreselectlist + '" id="' + QuestionInput.f + n.id + '" type="text" style="width:100px;"/><br/>';
                    }

                    if (flagtemp) {
                        htmlContent += '<label style="display:none;" for="' + QuestionInput.c + n.id + '"><input id="' + QuestionInput.c + n.id + '" type="checkbox" disabled="disabled" checked="checked"/>是客观题</label>';
                    }
                    htmlContent += "</div></div>";

                    if (flagtemp) {
                        testUserInfo.point += param.condition.objective_score;
                    } else {
                        testUserInfo.point += param.condition.subjective_score;
                    }
                });
            }

            htmlContent += "<form></div>";

            ifMapping = param.condition.mapping;

            if (result.student != null) {
                testUserInfo.name = result.student.realname;
                if (result.student.grade_id > 0) {
                    $.GradeInfo(result.student.grade_id, function (o) {
                        testUserInfo.grade = o.name;
                    });
                }
            }

            if (result.teacher != null) {
                var subject_grade = $.EvelSubjectGrade(result.teacher.subject_grade);
                if (subject_grade.subject != null && subject_grade.subject.length > 0) {

                    $.Subject(subject_grade.subject[0], function (to) {
                        testUserInfo.subject = to.Name;
                    }, function () { });
                }

                testUserInfo.teacher = result.teacher.realname;
            }

            switch (parseInt(param.condition.difficulty)) {
                case 1:
                    testUserInfo.level = '基础';
                    break;
                case 2:
                    testUserInfo.level = '中等';
                    break;
                case 3:
                    testUserInfo.level = '拨高';
                    break;
            }
            testUserInfo.time = (result.creat_date == null) ? '-' : result.creat_date;

            // 开始获取试卷人员相关信息
            var topBarHtml = '<div id="topBarHtmlPanel">';
            topBarHtml += '<table style="width:99%">';
            topBarHtml += '<tr><td align="right">姓名：</td><td>' + testUserInfo.name + '</td>';
            topBarHtml += '<td align="right">年级：</td><td>' + testUserInfo.grade + '</td>';
            topBarHtml += '<td align="right">学科：</td><td>' + testUserInfo.subject + '</td>';
            topBarHtml += '<td align="right">学科教师：</td><td>' + testUserInfo.teacher + '</td></tr>';
            topBarHtml += '<tr><td align="right">测评时间：</td><td>' + testUserInfo.time + '</td>';
            topBarHtml += '<td align="right">试卷难度：</td><td>' + testUserInfo.level + '</td>';
            topBarHtml += '<td align="right">试卷总分：</td><td>' + testUserInfo.point + '</td><td></td><td></td></tr>';
            topBarHtml += "</table></div>";
            $("body").append(topBarHtml);

            // 获取学生做的答案,并填充显示
            $.ajax({
                type: "GET",
                dataType: "json",
                url: Webversion + "/test" ,
                data: { test_id: test_id },
                success: function (result) {

                    $.messager.progress('close');//加载数据成功之后结束读条

                    $("#" + dilogSpanId).dialog({
                        title: "批改：" + title,
                        closed: false,
                        cache: false,
                        width: 760,
                        height: 480,
                        collapsible: true,
                        minimizable: true,
                        resizable: true,
                        maximizable: true,
                        modal: true,
                        toolbar: "#topBarHtmlPanel",
                        onClose: function () {
                            loadData();
                        },
                        onOpen: function () {
                            if (conQuestion) {
                                $(".objective_radio").click(function () {
                                    var id = $(this).attr("rel");
                                    var answer = $(this).attr("answer");
                                    var score = $(this).attr("score");
                                    if ($(this).attr("checked")) {
                                        if ($(this).val() == answer) {
                                            $("#objectiveisyes____show_" + id).text("回答正确！");
                                            $("#objectiveisyes____show_" + id).css("color", "green");
                                            $("#objective____show_" + id).text(score + '分');
                                            $("#objective____show_" + id).css("color", "green");
                                            $("#" + QuestionInput.f + id).val(score);
                                            $("#" + QuestionInput.s + id).val($(this).val());
                                            $("#showspan_" + id).show();
                                        }
                                        else {
                                            $("#objectiveisyes____show_" + id).text("回答错误！");
                                            $("#objectiveisyes____show_" + id).css("color", "red");
                                            $("#objective____show_" + id).text('0分');
                                            $("#objective____show_" + id).css("color", "red");
                                            $("#" + QuestionInput.f + id).val("0");
                                            $("#" + QuestionInput.s + id).val($(this).val());
                                            $("#showspan_" + id).show();
                                        }
                                    }
                                });

                                $('.subjective_getscore').each(function (index, Element) {
                                    var score = parseInt($(Element).attr("score"));
                                    var data = [];
                                    for (var i = 0; i <= score; i++) {
                                        data[i] = { "score": i, text: i };
                                    }

                                    var heighttempp = 135;

                                    if (score < 6) {
                                        heighttempp = (score+1) * 24;
                                    }

                                    $(Element).combobox({
                                        editable: false,
                                        panelHeight: heighttempp,
                                        valueField: 'score',
                                        textField: 'text',
                                        data: data
                                    });
                                });

                                $('.subjective_getscore').combobox('setValues', '0');


                                // 设置学生答案和分数
                                if (result && result.test) {
                                    $.each(result.test, function (i, n) {
                                        // $("#" + QuestionInput.s + n.id).val(n.answer);
                                        // $("#" + QuestionInput.f + n.id).val(n.score);
                                    });
                                }
                            }
                        },
                        content: htmlContent,
                        buttons: [{
                            text: '完成',
                            iconCls: 'icon-ok',
                            handler: function () {

                                if (!$("#CorrectForm").form('validate')) return;

                                var submitAnswer = { "test_id": test_id, "content": [] };

                                tempParam.score = 0;

                                var currentScourCount = 0;

                                // 提交学生答案
                                if (conQuestion) {
                                    $.each(question, function (it, nt) {
                                        var currentEmeletObject = $("#" + QuestionInput.f + nt.id);
                                        var tempobj = {};
                                        tempobj.answer = $("#" + QuestionInput.s + nt.id).val();
                                        tempobj.id = nt.id;
                                        tempobj.obj = parseInt(nt.objective_flag) == 1 ? 1 : 2;
                                        var tempScore = 0;
                                        if (currentEmeletObject.attr('gvflag') == 'combobox') {
                                            tempScore = currentEmeletObject.combobox('getValue');
                                        } else {
                                            tempScore = $.trim(currentEmeletObject.val()).length == 0 ? 0 : currentEmeletObject.val();
                                        }
                                        tempobj.score = parseFloat(tempScore);
                                        submitAnswer.content.push(tempobj);
                                        tempParam.score += parseFloat(tempobj.score);
                                    });
                                }

                                currentScourCount = tempParam.score;
                                var baifenshuScore = 0;

                                testUserInfo.point = parseFloat(testUserInfo.point);

                                if ( testUserInfo.point > 0) {
                                    if (testUserInfo.point == tempParam.score) {
                                        baifenshuScore = 100;
                                    } else {
                                        baifenshuScore = (tempParam.score / testUserInfo.point) * 100;
                                    }
                                }

                                if (ifMapping == 1) {
                                    tempParam.score = baifenshuScore;
                                }

                                // 这里加个是否确定批改
                                $.messager.confirm('系统提醒', '确定要继续批改操作吗？<br/>试卷实际得分：<b>' + currentScourCount + "</b><br/>百分制得分为：<b>" + Math.round(baifenshuScore)+"</b>", function (r) {
                                    if (r) {
                                        // 将总分等信息录入
                                        $.messager.progress({ text: '正在进行批改操作' });

                                        submitAnswer.content = $.toJSON(submitAnswer.content);

                                        $.ajax({
                                            type: "POST",
                                            dataType: "text",
                                            url: Webversion + "/test?_method=PUT&r="+$.getRom() ,
                                            data: submitAnswer,
                                            success: function (result) {

                                                var dateNow = new Date();
                                                tempParam.do_time = dateNow.getFullYear() + "-" + (dateNow.getMonth() + 1) + "-" + dateNow.getDate() + " " + dateNow.getHours() + ":" + dateNow.getMinutes() + ":" + dateNow.getSeconds();

                                                $.ajax({
                                                    type: "POST",
                                                    dataType: "text",
                                                    url: Webversion + "/mark?_method=PUT&r="+$.getRom() ,
                                                    async: false,
                                                    data: tempParam,
                                                    success: function (result) {

                                                        if (conQuestion) {

                                                            $.each(question, function (i, n) {

                                                                if (parseInt(n.objective_flag) == 1) {
                                                                    var errorTrl = {};
                                                                    errorTrl.ti_id = n.id;
                                                                    errorTrl.bookcode = 1;
                                                                    errorTrl.subjectid = subject;
                                                                    errorTrl.force = 2;

                                                                    $.ajax({
                                                                        type: "POST",
                                                                        dataType: "text",
                                                                        async: false,
                                                                        data: errorTrl,
                                                                        url: Webversion + "/history?_method=PUT&r=" + $.getRom() ,
                                                                        success: function (result) {

                                                                        },                                                                        error: function (result) {

                                                                        }
                                                                    });
                                                                }

                                                            });

                                                        }
                                                    }, error: function (result) { }
                                                });

                                                $.messager.progress("close");

                                                var midddstsss = 0;
                                                if (currentScourCount == tempParam.score) { midddstsss = 100; } else {
                                                    midddstsss = Math.round((currentScourCount / testUserInfo.point) * 100);
                                                }
                                                $.remind("判卷已完成！<br/>总分：" + currentScourCount + "，折合成百分制，总分为：" + midddstsss, function () {
                                                    // 关闭当前窗口
                                                    $("#" + dilogSpanId).dialog("close");
                                                });

                                            },
                                            error: function (result) {
                                                $.messager.progress("close");
                                                $.remind('数据提交失败！');
                                            }
                                        });
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

                },
                error: function (result) {
                    $.messager.progress("close");
                    $.messager.alert('温馨提示', '试卷内容构造失败！');
                }
            });
        },
        error: function (result) {
            $.messager.progress("close");
            $.messager.alert('温馨提示', '测评试卷内容信息获取失败！');
        }

    });
}