/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.easyui.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.json.min.js"/>
/// <reference path="~/EasyUI/Scripts/Common.js"/>

(function ($)
{
    $(document).ready(function ()
    {

        $.ajax({
            url: Webversion + "/class",
            type: "GET",
            success: function (data)
            {
                //兼容IE，class属性使用["class"]
                $.each(
                    data["class"],
                    function (index, value)
                    {
                        var html = $('<li><input type="checkbox" value="' + value.id + '" name="class_id" id="class__' + value.id + '" /><label for="class__' + value.id + '">' + value.Name + '</label></li>');
                        $("#class").append(html);
                    });
            }
        });
        ThroughClass();
        $("input[name='ti_type']").click(function ()
        {
            if ($(this).val() == 1)
            {
                $("#Div_Type1").show();
                $("#Div_Type2").hide();
            }
            else
            {
                $("#Div_Type2").show();
                $("#Div_Type1").hide();
            }
        });

        var UserInfo = $.evalJSON($.cookie("UserInfo"));
        $.ajax({
            url: Webversion + "/user/teacher/usr_teacher.id,usr_teacher.subject_grade",
            type: "GET",
            data: { condition: "uid:" + UserInfo.id },
            success: function (data)
            {
                var info = $.evalJSON(data.teacher.subject_grade);
                var subjectId = 0;
                if (info == null || info.subject == null || info.subject.lenght == 0 || !info.hasOwnProperty("subject"))
                {
                    $.remind('当前教师没有指定学科！');
                }
                else
                {
                    subjectId = info.subject[0];
                    $("#subjectId").val(subjectId);
                    $.ajax({
                        url: Webversion + "/subject/list",
                        type: "GET",
                        data: { id: subjectId },
                        success: function (data)
                        {
                            $("#subjectId").val(subjectId);
                            $("#subjectName").text(data.subject[0].Name);
                        }
                    });
                    $.ajax({
                        url: Webversion + "/zhuanti/list/1,100/id;name;knowledge_list",
                        data: { condition: "subject_id:" + subjectId },
                        type: "GET",
                        success: function (data)
                        {
                            var zhuntiInfo = data.zhuanti;
                            $.each(zhuntiInfo, function (index, value)
                            {
                                $("#zhuanti").append($('<li><input type="checkbox" value="' + value.knowledge_list + '" name="knowledge" id="zhuanti__' + value.id + '" /><label for="zhuanti__' + value.id + '">' + value.name + '</label></li>'));
                            });
                        }
                    });
                    $.ajax({
                        url: Webversion + "/book/list/1,100/id;book_name",
                        type: "GET",
                        data: { condition: "subject_id:" + subjectId },
                        success: function (data)
                        {
                            $.each(data.book, function (index, value)
                            {
                                $("#book").append($('<li><input type="radio" value="' + value.id + '" name="book_id" id="book__' + value.id + '" /><label for="book__' + value.id + '">' + value.book_name + '</label></li>'));
                            });

                            $("#book").append($('<div class="clear"></div>'));

                            initBook();
                        }
                    });
                }
            }
        });
        $("#btnSave").click(function (event)//确定按钮
        {

            if ($.trim($('#name').val()).length == 0)
            {
                $.remind('组卷名称不能为空或全部为空字符！');
                return;
            }

            event.preventDefault();
            $("#name").val($("#name").val().trim());
            if (!$("#LoginForm").form('validate'))
                return;

            var ti_type = $("input[name='ti_type']:checked").val();
            var book_id = $("input[name='book_id']:checked").val();
            var chapter_id = "";
            $("input[name='chapter_id']:checked").each(function ()
            {
                if (chapter_id != "")
                    chapter_id += ",";
                chapter_id += $(this).val();
            });

            var class_id = "";
            /*
            *没有学生的验证了
            */
            //            $("input[name='class_id']:checked").each(function () {
            //                if (class_id != "")
            //                    class_id += ",";
            //                class_id += $(this).val();
            //            });

            //            if (!class_id) {
            //                $.remind('请选取学生');
            //                return;
            //            }

            var difficulty = $("input[name='difficulty']:checked").val();

            var objective_total = $("input[name='objective_total']").val();
            var subjective_total = $("input[name='subjective_total']").val();
            var objective_score = $("input[name='objective_score']").val();
            var subjective_score = $("input[name='subjective_score']").val();


            var knowledge = "";
            $("input[name='knowledge']:checked").each(function ()
            {
                if (knowledge != "")
                    knowledge += ";";
                knowledge += $(this).val();
            });

            if (ti_type == "1")
            {
                if (!(book_id && chapter_id))
                {
                    $.remind('请选取章节');
                    return;
                }
            }
            else
            {
                if (!knowledge)
                {
                    $.remind('请选知识点');
                    return;
                }
            }
            /*
            *
            *添加试卷类型和对象的判断
            */
            var PaperType = $('input:radio[name="paperobject"]:checked').val(); //取得试卷类型
            var SendObject = $('input:radio[name="paperdifficulty"]:checked').val(); //取得发送对象
            var paperclass_ids = ""; //班级id值格式:1,2,3 
            var paperstudent_ids = ""; //学生id值格式:1,2,3 

            if (SendObject == "class") //表示选中的发送对象是班级    （然后取出id存放在paperstudent_ids）
            {
                var sendObjectsClass = $('input:checkbox[name="paperclass_id"]:checked'); //取得班级的选择项
                if (sendObjectsClass.length == 0)
                {
                    $.remind('请至少选择一个班级！');
                    return;
                }

                sendObjectsClass.each(function ()
                {
                    if (paperclass_ids != "")
                    {
                        paperclass_ids += ",";
                    }
                    paperclass_ids += $(this).val();
                });
            }
            else if (SendObject == "student")  //表示选中的发送对象是学生（然后取出id存放在paperstudent_ids）
            {
                var sendObjectsStudent = $('input:checkbox[name="paperchkStudent"]:checked'); //取得学生的选择项
                if (sendObjectsStudent.length == 0)
                {
                    $.remind('请至少选择一个学生！');
                    return;
                }

                sendObjectsStudent.each(function ()
                {
                    if (paperstudent_ids != "")
                        paperstudent_ids += ",";
                    paperstudent_ids += $(this).val();
                });

            }

            var name = $("input[name='name']").val();

            //var subject_id = $("input[name='subject_id']").val();
            var subject_id = $('#subjectId').val();

            var exam_stat = 1;

            var mapping = $("#mapping").attr('checked') ? 1 : 2;

            //if (mapping == 1) {
            //    var scorceYinzi = 100 / (objective_score * objective_score + subjective_total * subjective_score);
            //    objective_score = scorceYinzi * objective_score;
            //    subjective_score = scorceYinzi * subjective_score;
            //}
			
			var opt;
			
			
 		 	if(SendObject=="class"){
				opt={
					'ti_type': ti_type,
					'book_id': book_id,
					'chapter_id': chapter_id,
					'difficulty': difficulty,
					'objective_total': objective_total,
					'subjective_total': subjective_total,
					'objective_score': objective_score,
					'subjective_score': subjective_score,
					'knowledge': encodeURI(knowledge),
					'name': name,
					'subject_id': subject_id,
					'exam_stat': exam_stat,
					'mapping': mapping,
					'class_id': paperclass_ids,
					'mapping': mapping,
					'exer_type':PaperType};
			
					
            }else{
				opt={'ti_type': ti_type,
                'book_id': book_id,
                'chapter_id': chapter_id,
                'difficulty': difficulty,
                'objective_total': objective_total,
                'subjective_total': subjective_total,
                'objective_score': objective_score,
                'subjective_score': subjective_score,
                'knowledge': encodeURI(knowledge),
                'name': name,
                'subject_id': subject_id,
                'exam_stat': exam_stat,
                'mapping': mapping,
                'student_id': paperstudent_ids,
                'mapping': mapping,
				'exer_type':PaperType};
			} 
			

              $.ajax({
                url: Webversion + "/examcondition/",
                type: "POST",
                data: opt,
                
                success: function (data, textStatus, XMLHttpRequest)
                {
					
					  $.ajax({
                            type: "POST",
                            dataType: "json",
                            url: Webversion + "/exam/hh" ,
                            data: { exercise_id: data.exercise_id,'r':$.getRom() },
							 // statusCode: {
							// 201: function ()
							// {

								
							// }
								//		}, 
                            success: function (result) {
								
								 $.messager.alert('温馨提示', '组卷创建成功！', 'info',
									function ()
									{
										 // document.location.href = "GroupRollCenter.html";
									});
							 
							} 
               
							});    
				}
        });
 });
        function initBook()
        {
            $("input[name='book_id']").click(function ()
            {
                var bookId = $(this).val();
                $.ajax({
                    url: Webversion + "/chapter/book_id/" + bookId,
                    type: "GET",
                    success: function (data)
                    {
                        var datachapter = "<root>" + Base64.decode(data.chapter_list) + "</root>";
                        $("#chapter__right").empty();
                        $($.parseXML(datachapter)).find("unit").each(function (index, ele)
                        {
                            $("#chapter__right").append('<h2><input id="bookchapter__' + index + '" type="checkbox" onclick="checkAll(this,\'checkok_' + index + '\')" /><label for="bookchapter__' + index + '">' + $(ele).attr("name") + '</label></h2>');
                            var ul = $("<ul class='chapter' style='padding-left:18px;'></ul>");
                            $(ele).find("chapter").each(function ()
                            {
                                ul.append('<li><input type="checkbox" id="chapter__' + $(this).attr("id") + '" value="' + $(this).attr("id") + '" name="chapter_id" allcheck="checkok_' + index + '"/><label for="chapter__' + $(this).attr("id") + '">' + $(this).attr("name") + '</label></li>');
                            });
                            $("#chapter__right").append(ul);
                        });
                        $("#chapter__right").append('<div class="clear"></div>');
                    }
                });
            });
        }
    });
})(jQuery);

function checkAll(t, c)
{
    $("input[allcheck='" + c + "']").attr("checked", $(t).attr("checked") ? true : false);
}

function ThroughClass()
{ //点击班级，获得班级数据
    $("#ulStudent").hide(); //隐藏学生
    $("#ulClass").show(); //显示班级数据
    $.ajax({
        url: Webversion + '/class', //url访问地址
        type: "GET",
        data: {
            is_open: 0//已班级获取数据
        },
        dataType: "json",
        success: function (result)
        {

            if (result == null)
            {
                result = {};
            }
            // 绑定班级数据
            $("#ulClass").html("");
            $.each(result.class, function (index, value)
            {
                var html = $('<li><input type="checkbox" value="' + value.id + '" name="paperclass_id" />' + value.Name + '</li>');
                $("#ulClass").append(html);
            });
        }
    });


}




function ThroughStudent()
{//点击学生，获得学生数据
    $("#ulClass").hide(); //隐藏班级
    $("#ulStudent").show(); //显示学生
    $.ajax({
        url: Webversion + '/class/student_list', //url访问地址
        type: "GET",
        data: {
            is_open: 0//已班级获取数据
        },
        dataType: "json",
        success: function (result)
        {

            if (result == null)
            {
                result = {};
            }
            $("#ulStudent").html("");
            // 绑定学生数据
            $.each(result.student, function (index, value)
            {
                var html = $('<li><input type="checkbox" value="' + value.id + '" name="paperchkStudent" />' + value.realname + '</li>');
                $("#ulStudent").append(html);
            });
        }
    });

}


