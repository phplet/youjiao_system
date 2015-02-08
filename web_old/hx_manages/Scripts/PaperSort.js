
$(function ()
{
    //var ids =$.cookie('subjectSelectedIDs');获取上个页面传入的值，放在cookie里。
    //getDatasoruce(ids); //ajax 请求取得数据
    bindDatasource(null);
    resetCanUse();
    $(".del").live('click', function (r)
    {// 删除

        if (confirm('确认删除！'))
        {
            $(this).parent().parent().remove();
            resetCanUse();
        }





    });
    $(".up").live('click', function ()
    {//上移动
        var begin = $(this).parent().parent().prev().find(".txt").html();
        var current = $(this).parent().parent().find('.txt').html();

        $(this).parent().parent().prev().find(".txt").html(current);
        $(this).parent().parent().find(".txt").html(begin);
        resetCanUse();
    });

    $(".down").live('click', function ()
    {//下移动
        var after = $(this).parent().parent().next().find(".txt").html();
        var current = $(this).parent().parent().find(".txt").html();

        $(this).parent().parent().next().find(".txt").html(current);
        $(this).parent().parent().find(".txt").html(after);
        resetCanUse();
        //从新绑定事件
    });
});/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///绑定数据
function getDatasoruce(ids)
{//绑定数据
    $.ajax({
        url: Webversion + '/class/list', //url访问地址
        type: "GET",
        data: {
            IDS: ids//
        },
        dataType: "json",
        success: function (result)
        {

            if (result == null || result == null)
            {
                result = {};
            }
            bindDatasource(result);
        }
    });
}


function bindDatasource(result)
{


    $.ajax({
        url: Webversion + '/question/list_byid', //url访问地址
        type: "GET",
        data: {
            ti_id: $.cookie('subjectSelectedIDs')
        },
        dataType: "json",
        success: function (result)
        {
            $.each(result.question, function (index, value)
            {
                var html = $('<li>'
						 + '<div class="opDiv">'
						 + '<input value="上移" class="up" type="button">'
						 + '    <input value="下移" class="down" type="button">'
						 + '      <input value="删除" class="del" type="button">'
						 + ' </div>'
						 + '  <div class="txt">'
						 + '<input type="hidden" value=' + value.id + ' class="hiddenID" />'
						 + '     <br>'
						 + '<span class="sortList">' + (index + 1) + '</span>'  //设置class方便我们取出来。
						 + value.content
						 + ' </div>'
						 + '</li>');
                $("ul").append(html);
            });
        }
    });






}

function getSortTiID()
{
    var ids = "";
    $.each($('.hiddenID'), function (index, value)
    {
        ids += "," + $(this).val(); //循环遍历取出ID
    });
    if (ids.length > 1)
    {
        ids = ids.substring(1, ids.length);
    }
    $.cookie('PaperSortBack', ids);
}

function resetCanUse()
{//按钮是否能使用
    $(".up").css("display", "");
    $(".down").css("display", "");
    if ($(".up").length > 0)
    {
        $(".up").eq(0).css("display", "none");
    }
    if ($(".down").length > 0) { $(".down").last().css("display", "none"); }
    //重新排序
    //修改：重新计算序号
    $.each($(".sortList"), function (index, value)
    {
        $(this).text(index + 1);
    });
}


function ContinueAdd()
{//继续
    document.location.href = "SelectSubjects.html";
    getSortTiID();
}




function FormationTest(event)
{//生成移动端
MobileWord(1);
}

function GenerationWord(event)
{//生成word
  
 MobileWord(2);
}

function ASentPc(event)
{//生成word
  
 MobileWord(3);
}

  
 function MobileWord (sType){//移动版和word版共同调用的
  //1--往手机分发作业
 //2--生成word
		 var ids = "";
		 $.messager.progress({
	            
	        msg: '正在发送...'
	    }); 
		

		/* $.messager.progress({
				title:'Please waiting',
				msg:'Loading data...'
		}); */

    $.each($('.hiddenID'), function (index, value)
    {
        ids += "," + $(this).val(); //循环遍历取出ID

    });

    ids = ids.substring(1, ids.length);
    $.cookie('classIDS');     //班级对象IDS  格式 1,2,3
    $.cookie('studentIDS');    //学生对象IDS 格式 1,2,3
    $.cookie('PaperName'); //试卷名称
    $.cookie("subjectId"); //学科
    $.cookie('subjectType');    //出题范围
    $.cookie('PaperType');  //作业类型
  
    var option;
    if ($.cookie('SendObject') == "class")
    {
        option = {
            "ti_id": ids,
            "class_id": $.cookie('classIDS'),
            "exam_name": $.cookie('PaperName'),
            "subject_id": $.cookie("subjectId"),
            "field": $.cookie('subjectType'),
            "exer_type": $.cookie('PaperType'),
			"assign_type":sType
        };
    }
    else
    {
        option = {
            "ti_id": ids,
            "student_id": $.cookie('studentIDS'),
            "exam_name": $.cookie('PaperName'),
            "subject_id": $.cookie("subjectId"),
            "field": $.cookie('subjectType'),
            "exer_type": $.cookie('PaperType'),
			"assign_type":sType
        };
    }
   
   
    //	//alert($.cookie('classIDS')+','+$.cookie('studentIDS')+','+$.cookie('PaperName')+','+$.cookie("subjectId")+','+$.cookie('subjectType')+','+$.cookie('PaperType')+','+$.cookie('SendObject'));
    //ajax 去后台插入数据到数据。
    $.ajax({
        url: Webversion + '/exam/maual', //url访问地址
        type: "POST",
        data: option,
        dataType: "json",
       /*  statusCode: {
            201: function ()
            {

                $.messager.alert('温馨提示', '组卷创建成功！', 'info',
                            function ()
                            {
                                document.location.href = "GroupRollCenter.html";
                            });
            }
        }, */
        success: function (result)
        {
			
							     if(sType==2){
										$.messager.progress("close");
											if (result && result.url && $.trim(result.url).length > 0) {
												$.messager.alert('温馨提示', '系统生成的WORD文档成功！', 'info',
												 function ()
												{   
													   document.location.href = result.url ;  //"http://test.hxpad.com/word/1358416076YTSktg.doc"
														$.messager.alert('温馨提示', '下载word成功！', 'info',
														 function ()
														 {
															  document.location.href = "GroupRollCenter.html";
														 });					
												 }); 
                                            }
                                             else {
                                                 $.messager.alert('温馨提示', '系统生成的WORD文档为空！');
                                            }
								 }
								 else{
									$.messager.progress("close");
								     $.messager.alert('温馨提示', '组卷创建成功！', 'info',
									 function ()
									 {
										  document.location.href = "GroupRollCenter.html";
									 });
								 }
								 
								
        }
    });

  }