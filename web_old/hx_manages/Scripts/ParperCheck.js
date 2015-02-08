var studentID = 0;
var paperStudentID = 0;
var jsoncontent=[];
var pigai_ti="";
var zhuguan_lenght=0;
var insanswer;

$(document).ready(function ()
{
	
   
    paperStudentID = $.cookie("paperStudentLookID");
	
    $.ajax({
        url: Webversion + '/test/list/list_detail', //url访问地址
        type: "GET",
        data: {
            study_exercise_id: paperStudentID //学生试卷ID
        },
        dataType: "json",
        success: function (result)
        {
            var question = $.evalJSON(Base64.decode(result.question));
			var study_exercise = result.study_exercise["type"]//分数
			var study_score = result.study_exercise["my_score"]
			var ping_yu = result.study_exercise["pi"]
			
			if(study_exercise == 00000000003){
				$("#studentscore").val(study_score);
			$("#studentscore").numberbox('disable');
				$("#bitian").hide();
			}/* else if(study_exercise == 00000000002){
				$("#studentscore").val(study_score);
				$("#studentscore").numberbox('disable');
				$("#bitian").hide();
			} */ 
			
            var content = "";
			
            var da = $.evalJSON(Base64.decode(result.study_exercise["content"]));
			jsoncontent = da;
            $.each(question, function (i, n)
            {
                 content += (i + 1) + ".";
                content += n.content;
				if (n.objective_flag==0)
				{
					content += "</b><br/><img src='images/book-open.png' style=\" position:relative; top:1px;\"/> 参考答案:</br>";
				    content += n.answer + "<br/>";	
				}
				else{
					content += "</b><br/><img src='images/book-open.png' style=\" position:relative; top:1px;\"/> 参考答案: &nbsp;";
					content += n.objective_answer + "<br/>";
				} 
			
                $.each(da, function (j, p)
                {
					if (n.objective_flag==0)//如果是主观题的话 objective_flag==0是主观题的意思
					{
						
						 if (p.id == n.id)//当答案id和题的id相等的时候 说明是一道题
						{
							
							content += "<b style=\" font-size:12px; line-height:25px; color:#2a5caa\">学生答案:</b>";//改动的
							content += p.answer + "<br/><br/>";
						
							zhuguan_lenght+=1;
							if(p.insanswer == 1||p.insanswer == 2||p.insanswer == 3){}else{
							content +="<div id=\"pi_gai"+p.id+"\" style=\" width:80%; height:50px;\"><div style=\"text-align:left;\"><input type=\"radio\" name=\"pigai"+p.id+"\"value=\"1\"/><img src=\"images/dui.png\" style=\"width:20px; height:20px;\"><label style=\"padding-left:20px\"></label><input type=\"radio\"  name=\"pigai"+p.id+"\" value=\"2\"/><img src=\"images/cha.png\" style=\"width:20px; height:20px;\"><label style=\"padding-left:20px;\"></label><input type=\"radio\" name=\"pigai"+p.id+"\" value=\"3\"/><img src=\"images/bandui.png\" style=\"width:20px; height:20px;\"><label style=\"padding-left:20px;\"></label></div></div><div style='width:100%; height:10px; border-bottom:1px dotted black;'></div></div><div style='width:100%; height:15px;'></div>";}
							
							if (p.insanswer == 1)  //当批改的答案值为1时
							{
								$("#pi_gai"+p.id).hide();
								
								content +="<div  style=\" width:80%; height:50px;\"><div style=\"text-align:left;\"><input type=\"radio\" checked=\"checked\" name=\"pigai"+p.id+"\"value=\"1\"/><img src=\"images/dui.png\" style=\"width:20px; height:20px;\"></div></div><div style='width:100%; height:10px; border-bottom:1px dotted black;'></div><div style='width:100%; height:15px;'></div>"
								
							}
							else if (p.insanswer == 2)  //当批改的答案值为1时
							{
							
								content +="<div  style=\" width:80%; height:50px;\"><div style=\"text-align:left;\"><input type=\"radio\" checked=\"checked\"  name=\"pigai"+p.id+"\" value=\"2\"/><img src=\"images/cha.png\" style=\"width:20px; height:20px;\"></div></div><div style='width:100%; height:10px; border-bottom:1px dotted black;'></div><div style='width:100%; height:15px;'></div>"
							}
							else if (p.insanswer == 3)  //当批改的答案值为1时
							{
								
								content +="<div  style=\" width:80%; height:50px;\"><div style=\"text-align:left;\"><input type=\"radio\" checked=\"checked\" name=\"pigai"+p.id+"\" value=\"3\"/><img src=\"images/bandui.png\" style=\"width:20px; height:20px;\"></div></div><div style='width:100%; height:10px; border-bottom:1px dotted black;'></div><div style='width:100%; height:15px;'></div>"
							}
							
							return false; 
						} 
						
					}else{//非主观题
						 if (p.id == n.id)
						{
							if (n.objective_answer.toString() != p.answer.toString())  //当两个答案不等的时候 toString() 方法是用相应的字符串输出数字值
							{
								content += "<img src='images/wrong.png'  style=\" position:relative; top:3px;\"/> <b style=\" font-size:12px; line-height:25px; color:#2a5caa\">学生答案:</b>";
							}
							else
						   {
								content += "<img src='images/ok.png'  style=\" position:relative; top:3px;\"/> <b style=\" font-size:12px; line-height:25px; color:#2a5caa\">学生答案:</b>";
							}
							content += p.answer + "<br/><br/><div style='width:100%; height:10px; border-bottom:1px dotted black;'></div>";
							content +="<br/><br/>";
							//content +="<div></div>";
							return false; 
						} 
					}
                });

            });
		
            $("ul").html(content);
            $("#lblName").html(result.student.realname);
            $("#lblParperName").html(result.exam_exercise.name);
            $("#lblsubmitTime").html(result.exam_exercise.creat_date);
            //alert(result.exam_exercise.creat_date);
            //$("#lblClass").html(result.student.grade_id); //年级
            //$("#lblSubjectName").html(result.exam_exercise.subject_id); //学科
            /*获取年级的名称数组*/
            var classNameList;

            $.ajax({  //ajax获取班级名称的数组
                url: Webversion + '/grade/list', //班级名url访问地址
                type: "GET",
                dataType: "json",
                async: false,
                cache: false,
                success: function (result)
                {
                    classNameList = result.grade;

                }
            });
            /*遍历学科数据找到对应的学科名字*/

            $.each(classNameList, function (index, value)
            {

                if (value.id == result.student.grade_id)
                {
                    $("#lblClass").html(value.name); //年级 
                }
            });

            //$("#lblSubjectName").html(result.exam_exercise.subject_id); //学科

            /*获取学科的名称数组*/
            var subject_nameList;

            $.ajax({  //ajax获取学科的名称数组
                url: Webversion + '/subject/list', //获取学科url访问地址
                type: "GET",
                dataType: "json",
                async: false,
                cache: false,
                success: function (result)
                {
                    subject_nameList = result.subject;

                }
            });
            /*遍历学科数据找到对应的学科名字*/

            $.each(subject_nameList, function (index, value)
            {

                if (value.id == result.exam_exercise.subject_id) //找到id想对应的学科
                {
                    $("#lblSubjectName").html(value.Name); //给界面学科赋值
                }
            });





            $("#lblsubmitTime").html(result.study_exercise.log_time);
            $("#lblNumber").html(question.length);

            $("#txtareaComment").val(result.study_exercise.pi);
            if ($("#txtareaComment").val() != "")
            {
                pingyu(paperStudentID);
            }

        }
    });

	
	
	
});                                     //reday的结束标签
///截取url中的参数
function parseQuery(url)
{
    var params = {};
    if (url.lastIndexOf('?') <= 0) { return params; }
    if (!url) { return params; }
    var query = url.substring(url.lastIndexOf('?') + 1);
    var pairs = query.split(/[;&]/);
    for (var i = 0; i < pairs.length; i++)
    {
        var pair = pairs[i].split('=');
        if (!pair || pair.length != 2) { continue; }
        var key = unescape(pair[0]);
        var val = unescape(pair[1]);
        val = val.replace(/\+/g, ' ');
        params[key] = val;
    }
    return params;
}


//绑定单头信息：学生，班级，学科等
function bindHead()
{
    $.ajax({
        url: Webversion + '/class/list', //url访问地址
        type: "GET",
        data: {
            StudentID: studentID, //学生ID
            SubjectID: subjectID//试卷ID
        },
        dataType: "json",
        success: function (result)
        {

            if (result == null || result == null)
            {
                result = {};
                result = [];
            }
            bindHeadDetail(result);
        }
    });
}
//绑定单头信息：学生，班级，学科等 详细的json绑定
function bindHeadDetail(result)
{ //json数据格式参数
    //    result = [{
    //        "name": "李四",
    //        "class": "高三(二)班",
    //        "parperName": "数学测评试卷",
    //        "subjectName": "数学",
    //        "submitTime": "2011-01-21",
    //        "number": "20"
    //    }];
    $("#lblName").html(result[0].name);
    $("#lblClass").html(result["class"]);
    $("#lblParperName").html(result[0].parperName);
    $("#lblSubjectName").html(result[0].subjectName);
    $("#lblsubmitTime").html(result[0].submitTime);
    $("#lblNumber").html(result[0].number);
}
//调用绑定试卷内容的ajax 得到json数据
function bindDatasource(paperStudentID)
{
 
    /*  $.ajax({
    url: Webversion + '/class/list' , //url访问地址
    type: "GET",
    data: {
    paperStudentID: paperStudentID //学生试卷ID
    },
    dataType: "json",
    success: function (result) {

    if (result == null || result== null) {
    result = {};
    result= [];
    }
    bindSubjects(result);
    }
    }); */
}
//绑定试卷内容 题目的明细
function bindSubjects(result)
{//绑定所有的题。
    result = result = [
            { "id": "班级01", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级02", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级03", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级04", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级05", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级06", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级07", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级08", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级09", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级10", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级11", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级12", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级13", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级14", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级15", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级16", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级17", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级18", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级19", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级20", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级21", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级22", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级23", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级24", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级25", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级26", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级27", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级28", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级29", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级30", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级31", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级32", "Content": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
            { "id": "班级33", "Content": "将小鼠B 细胞注入家兔体内，产生免疫反应后，家兔血清能使小鼠T 细胞凝集成细胞集团。而未经免疫的家兔血清不能使小鼠T 细胞凝集成团。细胞凝集现象的出现是因为 （）", "founder": "80", "date": "2010", "studentnum": "c", "teachernum": "d", "state": "关闭", "operation": "f", "remark": "2" }
        ];

    $.each(result, function (index, value)
    {
        var html = $('<li>'
                 + '<div class="Panswer">'
                 + ' <p style="background-color: #66CC66;">'
                 + (index + 1) + '.' + result[index].Content
                 + '<br>'//换行显示答案
                 + ' <span style="background-color:red">A．小鼠B 细胞诱导家兔产生细胞免疫</span>'
                 + '<br>'
                 + ' B．小鼠T 细胞诱导家兔产生体液免痊'
                 + ' <br>'
                 + 'C．小鼠B 细胞和小鼠T 细胞有相同抗原'
                 + '<br>'
                 + 'D．小鼠T 细胞和家兔T 细胞有相同抗原'
                 + '</p>'
                 + '</div>'
                 + '<div class="answer">回答正确</div>'
                 + '<div class="answer">正确答案："A"</div>'
                 + '<div class="answer">解析：<br/>将小鼠B 细胞注入家兔体内，产生免疫反应后，家兔血清能使小鼠T 细胞凝集成细胞集团。而未经免疫的家兔血清不能使小鼠T 细胞凝集成团。将小鼠B 细胞注入家兔体内，产生免疫反应后，家兔血清能使小鼠T 细胞凝集成细胞集团。而未经免疫的家兔血清不能使小鼠T 细胞凝集成团。将小鼠B 细胞注入家兔体内，产生免疫反应后，家兔血清能使小鼠T 细胞凝集成细胞集团。而未经免疫的家兔血清不能使小鼠T 细胞凝集成团。将小鼠B 细胞注入家兔体内，产生免疫反应后，家兔血清能使小鼠T 细胞凝集成细胞集团。而未经免疫的家兔血清不能使小鼠T 细胞凝集成团。</div>'
                 + '</li>');
        $("ul").append(html);
    });

}
//添加评语
function commentOk()/////////////////////////////////////////////////////////////////评语最后确定提交的时候
{
	
	if(zhuguan_lenght > $("input:radio:checked").length){
		$.remind('请批改主观试题！');
        return;
	}
	
	// pigai_ti = $(input:radio[name="pigai'+p.id+'"]);
	  var subjective_ids = ""; //批改主观题id值格式:1,2,3  
	 
        $("input:radio:checked").each(function ()
        {	
			var nihao=$(this).val();
			var myti_id = $(this).attr('name').substring(5);
			var flag=0;
		   $.each(jsoncontent, function (f, w)
			{
				if(w.id == myti_id){
					//alert(nihao);
					jsoncontent[f].insanswer = nihao;
					flag=1;
				}
			});
			
			if (flag==0)
			{				
				 var jsonti={
					id:myti_id,
					score:0,
					answer:"",
					obj:0,
					insanswer:nihao
				}
				jsoncontent.push(jsonti);
			}
				
        });
	
	///////////////	//////////////////////////////////////////////////////
		
	if($("#studentscore").val()==""){
		$.remind('请填写分值！');
        return;
	}
	
	if($("#studentscore").val() > 100){
		$.messager.alert('温馨提示', '最高分值为100分！');
		return;
	}
	if($('#txtareaComment').val()==""){
		
		$.remind('请批阅试卷！');
        return;
	}
	//alert(JSON.stringify(jsoncontent));
	//alert(Base64.encode(JSON.stringify(jsoncontent)));
    $.ajax({
        url: Webversion + '/test/pi', //url访问地址
        type: "POST",
        data: {
            test_id: paperStudentID, //学生试卷ID
			content:Base64.encode(JSON.stringify(jsoncontent)),//检查encode
            pi: $('#txtareaComment').val(),
			my_score: $("#studentscore").val(),
            _method: "PUT",
			type: 3
        },
        dataType: "json",
        success: function (result)
        {
			
			pingyu(paperStudentID);
			document.location.href = "PaperCheck.html";
		
        }
    });
}

function pingyu(paperStudentID){
	$("#divPage").hide();
	$("#divpi").show();
	$("#LabPi").html($('#txtareaComment').val());
}

//后来加上添加分值--------------------------------------------------、、、、、、、、、、、、、\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\、、、、、、、、、\\\\\\

  function InputFocus(elementInput, elementTD) {


            if (elementInput.value == "请输入分值") {
                elementInput.value = "";
            }
            
  } 
  
  
    function ExistsData(elementInput, elementTD) {
		  if (elementInput.value == "") {
                elementInput.value = "请输入分值";
            }  
		var scoreval=$("#studentscore").val();
			if(scoreval > 100){
				$.messager.alert('温馨提示', '最高分值为100分！');
			}
        }

		