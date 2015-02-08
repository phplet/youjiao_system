var subjectsSelectdBegin = ''; //选择后的ID值
var errorSubjectID = 0;
var selectNanDu = 0;

//这个页面含有上个页面传的参数过来，都在cookie里面 上个页面的cookie说明
$.cookie('PaperName'); //试卷名称
$.cookie('PaperType');  //试卷类型
$.cookie('SendObject');  //发送对象
$.cookie('classIDS');     //班级对象IDS  格式 1,2,3
$.cookie('studentIDS');    //学生对象IDS 格式 1,2,3
$.cookie('subjectType');    //题库类型
$.cookie('synchronousID'); //同步题库 ID
$.cookie('ProjectID'); //专题复习题库ID

var subjectId = $.cookie("subjectId");
var chapterID = 0;
var kn = "";



$(document).ready(function ()
{

	if($.cookie('subjectType')==1){
		bindTree(); //绑定树
	}
	else{
		bindTree2();
	}
	
	
	
   
	
		
      

    //    alert(document.location.href);
    //    alert(parseQuery(document.location.href).paperName);
    var cookiePaperSortBack = $.cookie('PaperSortBack'); //取得cookie：PaperSortBack
    if (cookiePaperSortBack)
    {
        $("#subjectCount").text(cookiePaperSortBack.split(',').length); //个数
        subjectsSelectdBegin =  cookiePaperSortBack; //题目ID
        $.cookie('PaperSortBack', null); //注销cookie
    }
    bindDifficulty(); //难易程度函数的调用  
	 GetDataByLevel(0); //根据难度等级得到数据 

    //如下两个方法 当ajax调用时候要删除掉。
    bindSubjects(null);
    setPageHtml(20);
    /* 
    var answer = [{ "content": " A" }, { "content": " B" }, { "content": " C" }, { "content": " D"}];

    $("#Panswer p").click(
    function () {
    alert("aaaa");
    var index = $(this).index();
    $("#DivAnswer").show("fast", function () {
    var answerVal = contentList[index].content;
    $(this).html(answerVal);
    $(this).hide("fast");

    });
    });
    */


    bindAnswerShowHide();

});                        //reday的结束标签

 

function bindAnswerShowHide()//答案显示
{
    $(".showAnswer").toggle(    

                 function ()
                 {

                     var valueid = $(this).attr('value');    //取得答案设置的时候的id值
                     $('#divAnswer' + valueid).show();  
                 },
                function ()
                {
                    var valueid = $(this).attr('value');
                    $('#divAnswer' + valueid).hide();
                }
				);
}
function bindDifficulty()//试题难易程度的背景颜色的js效果
{
    $("#tbContions td").click(function ()
    {
        $(this).addClass("tdRed");
    }, function ()
    {
        $(this).removeClass("tdRed");
    });

    $("#tbContions td").click(function ()
    {//点击事件(调用ajax函数)
        $("#tbContions td").removeClass("tdRed"); //移除样式tdRed
        $(this).addClass("tdRed"); //当前选项的选中颜色。
        selectNanDu = $(this).attr('value');   //保存难度值
        GetDataByLevel(selectNanDu); //根据难度等级得到数据
		 if ($('#paperUl').tree('getSelected') != null)
        {
            getData();
        }
        else
        {
            $.remind('请选择目录！');
        }

    });

}
function bindTree()
{//绑定树
    $('#paperUl').tree({
        animate: false,
        onSelect: function (node)
        {
            if (node.id != undefined)
            {
                //数据请求 
                chapterID = node.id;
                getData();
            }
        }
    });
    var resultTree = new Array();
    $.ajax({
        url: Webversion + '/chapter/book_id/' + $.cookie("synchronousID") , //url访问地址
        type: "GET",
        dataType: "json",
        success: function (data)
        {
            var datachapter = "<root>" + Base64.decode(data.chapter_list) + "</root>";
            var j = 1;
            $($.parseXML(datachapter)).find("unit").each(function (index, ele)
            {
                resultTree[index] = new Object();
                //resultTree[index].id = j;
                resultTree[index].text = $(ele).attr("name");
                resultTree[index].state = "open";

                j++;
                var i = 0;
                $(ele).find("chapter").each(function ()
                {


                    if (i == 0)
                    {
                        resultTree[index].children = new Array();
                    }
                    resultTree[index].children[i] = new Object();
                    if (j == 1 && i == 0)
                    {
                        chapterID = $(this).attr("id");
                    }
                    resultTree[index].children[i].id = parseInt($(this).attr("id"));
                    resultTree[index].children[i].text = $(this).attr("name");
                    resultTree[index].children[i].state = "open";
                    i++;
                });
            });
            //$('#txtContent').val($.toJSON(resultTree));
            $('#paperUl').tree('loadData', resultTree);
        }
    });



}
function bindTree2()
{//绑定树
	$('#paperUl').tree({
        animate: false,
        onSelect: function (node)
        {
            if (node.id != undefined)
            {
                //数据请求 
                kn = node.attributes.knowledge;
                getData();
            }
        }
    });
    var resultTree = new Array();
    $.ajax({
        url: Webversion + '/zhuanti/list/0,100/id;name;knowledge_list' , //url访问地址
        type: "GET",
		data:{
			condition:"subject_id:"+subjectId
		},
        dataType: "json",
        success: function (data)
        {
			$.each(data.zhuanti,function (index, ele)
            {
				resultTree[index] = new Object();
				resultTree[index].id = ele.id;
				resultTree[index].text = ele.name;
				resultTree[index].attributes = new Object();
				resultTree[index].attributes.knowledge = ele.knowledge_list;
			});
            //$('#txtContent').val($.toJSON(resultTree));
           $('#paperUl').tree('loadData', resultTree);
        }
    });



}


function getData()
{
  //$.messager.progress("open");
	$.messager.progress({
	            
	            msg: '正在加载...'
	        });

	var para;
    if ($.cookie("subjectType") == 1)
    {
        para = {
            total: 2,
            start: 0,
            subject_id: subjectId,
			ti_type:1,
            difficulty: selectNanDu,
            s_type: $.cookie("subjectType"),
            book_id: $.cookie("synchronousID"),
            chapter_id: chapterID
        }
    }
    else
    {
        para = {
            total: 100,
            start: 0,
			ti_type:1,
            subject_id: subjectId,
            difficulty: selectNanDu,
            s_type: $.cookie("subjectType"),
			knowledge:kn
        }
    }

    $.ajax({
        url: Webversion + '/question/hhlist' , //url访问地址
        type: "GET",
        data: para,
        dataType: "json",
		//async: false,
        success: function (data)
        {
			if(data.question==null||data.question==undefined)
			{
			$.messager.progress("close");
			}
            bindSubjects(data.question);
			$.messager.progress("close");
        },
		error:function (data)
        {
            $.messager.progress("close");
        }
    });

	

}




function bindSubjects(result)
{//绑定所有的题。
 /*    result = [
    { "id": "班级01", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级02", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级03", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级04", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级05", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级06", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级07", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级08", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级09", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级10", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" }
    ];  */
    $("#paperContent").html("");
    $.each(result, function (index, value)
    {
        var dd = "";
        switch (parseInt(value.difficulty))
        {
            case 1:
                dd = "简单 ★☆☆☆☆";
                break;
            case 2:
                dd = "较易 ★★☆☆☆";
                break;
            case 3:
                dd = "中等 ★★★☆☆";
                break;
            case 4:
                dd = "较难 ★★★★☆";
                break;
            case 5:
                dd = "困难 ★★★★★";
                break;
            default:
                break;

        }
		//var hh= $.evalJSON(value.image);
		//alert(hh.question[0].file+"---"+hh.question[0].pic);
		//var regHH=/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/ig;
		//var matchHH=regHH.exec(value.content);
		//alert(matchHH);
		
		var ss=value.content;
		var regHH=/\<img.*?src\=[\'\"](.*?)[\'\"][^>]*>/ig;
		var matchHH=ss.match(regHH);
		
		
        //alert(value.content);
       // alert(value.objective_answer);
        var html = $('<li>'
                 + '<div class="subject">'
                 + '<table id="tbSubject" style="background-color: #FFFF99; float: left; width: 100%">'
                 + '<tbody><tr>'
                 + '<th>'
                 + ' 题目ID'
                 + '</th>'
                 + '<td>'
                 + value.id
                 + '</td>'
                 + '<th>'
                 + '   题型'
                 + '</th>'
                 + '<td>'
                 + value.type_name
                 + '</td>'
                 + '<th>'
                 + '    难度'
                 + '</th>'
                 + '<td>'
                 + '   ' + dd
                 + '</td>'
                 + '<td>'
                 + '    更新时间:'
                 + '</td>'
                 + '<td>'
                 + '  ' + value.mod_date
                 + '</td>'
                 + '<td rowspan="2">'
                 + ' <a class="easyui-linkbutton l-btn"   onclick="selectedSubject(this,\'' + value.id + '\')" ><span class="l-btn-left"><span class="l-btn-text">入选</span></span></a>'
                 + '</td>'
                 + '<td rowspan="2">'
                 + '  <a id="" class="easyui-linkbutton l-btn" onclick="Error(\'' + value.id + '\');"><span class="l-btn-left"><span class="l-btn-text">报错</span></span></a>'
                 + '</td>'
                 + '<td rowspan="2">'
                 + '   <a id="" class="easyui-linkbutton l-btn showAnswer" value=' + value.id + ' ><span class="l-btn-left"><span class="l-btn-text">答案</span></span></a>'//给答案的按钮设置了一个id值用于在点击的时候取的
                 + '</td>'
                 + '</tr>'
                 + '</tbody></table>'
                 + '</div>'
                 + '<div class="Panswer">'
                 + '  <div style="background-color: #DDDDDD;">'
                 + value.content
                 + '</div>'
                 + '</div>'
                 + '<div class="answer"  style="display:none;" id="divAnswer' + value.id + '">' + value.answer + '</div>'     //给答案div设置id 格式是     divAnswer+ 对应id
                 + '</li>');
        $("#paperContent").append(html);
    });
    bindAnswerShowHide(); //调用绑定点击显示或隐藏事件
}
//分页显示

function Error(errorID)
{//报错的点击形式
    $("#divError").dialog('open');
    errorSubjectID = errorID;
}
function ErrorOK()
{
    //ajax 请求后台插入报错原因
    //    $.ajax({
    //        url: Webversion + '/class/list' , //url访问地址
    //        type: "GET",
    //        data: {
    //            ID: errorSubjectID, //难度的值
    //            Content: $('#ErrorReason').val()
    //        },
    //        dataType: "json",
    //        success: function (result) {

    //            if (result == null || result.class == null) {
    //                result = {};
    //                result.class = [];
    //            }
    //            bindSubjects(result);
    //        }
    //    });
    $("#divError").dialog('close');
}
function ErrorCancel()
{
    $("#divError").dialog('close');
}

function getPageData(pageNumber)
{//ajax分页根据条件取得数据
    $.ajax({
        url: Webversion + '/class/list' , //url访问地址
        type: "GET",
        data: {
            content: $('#txtContent').val(), //难度的值
            page: pageNumber,     //第几页
            size: 10//每页显示数量
            /* 
            *查询条件参数
            */
        },
        dataType: "json",
        success: function (result)
        {

            if (result == null)
            {
                result = {};

            }
            bindSubjects(result);
        }
    });
}

function GetDataByLevel(level)
{//每次点击难度发出ajax操作
    $.ajax({
        url: Webversion + '/class/list' , //url访问地址
        type: "GET",
        data: {
            Level: level, //难度的值
            page: 1,     //第几页
            size: 10//每页显示数量
            /* 
            *查询条件参数
            */
        },
        dataType: "json",
        success: function (result)
        {

            if (result == null)
            {
                result = {};

            }
            bindSubjects(result.rows); //result.rows：第一页的数据
            setPageHtml(result.total); //result.total 返回该条件下的总条数
        }
    });


}


function Seacrch(pageNumber)  //点击查询获得第一页数据
{ //点击搜索ajax操作。      pageNumber ，第几页的数据
    $.ajax({
        url: Webversion + '/class/list' , //url访问地址
        type: "GET",
        data: {
            content: $('#txtContent').val(), //难度的值
            page: pageNumber,     //第几页
            size: 10//每页显示数量
            /* 
            *查询条件参数
            */
        },
        dataType: "json",
        success: function (result)
        {

            if (result == null)
            {
                result = {};

            }
            bindSubjects(result.rows); //result.rows：第一页的数据
            setPageHtml(result.total); //result.total 返回该条件下的总条数
        }
    });


}
function setPageHtml(total)//设置分页 第几页，有多少页的 数据     total：总共多少条
{
    $('#divPage').html(''); //清空分页
    var page = Math.ceil(total / 10);
    for (var i = 1; i <= page; i++)
    {

        var htmlInner = '';
        if (i == 1)
        {
            htmlInner = $('<a style="width:40px; height:20px; border:1px solid red; display:block;float:left; margin-left:10px;" line-height:20px;onclick="getPageData(' + i + ');">第一页</a>');
        }
        else if (i == page)
        {
            htmlInner = $('<a style="width:50px; height:20px; border:1px solid red; display:block;float:left; margin-left:10px; text-align:center;line-height:20px;" onclick="getPageData(' + i + ');">最后一页</a>');
        }
        else
        {
            htmlInner = $('<a style="width:30px; height:20px; border:1px solid red; display:block;float:left; margin-left:10px;  text-align:center;line-height:20px;" onclick="getPageData(' + i + ');">' + i + '</a>');
        }
        $('#divPage').append(htmlInner);
    }
}


//function answerShow(divAnswer) {//调用的时候，这个函数里面传的参数（divAnswer）是要显示的答案的div的ID
//    $('#' + divAnswer).show();
//};



function Ajump()
{//点击下一步的操作函数
    $.cookie('chapterID', chapterID); //存入试题范围
    $.cookie('subjectSelectedIDs', subjectsSelectdBegin); //选中的题目IDs存入cookie里
    document.location.href = "PaperSort.html?id=" + subjectsSelectdBegin;
    
}

function selectedSubject(obj, subjectID) //向选题框里写入值
{
    var flage = $(obj).find('.l-btn-text').html();
    if (flage=="入选")
    {
        if (subjectsSelectdBegin.length > 0)
        {
            subjectsSelectdBegin += ",";
        }
        subjectsSelectdBegin += subjectID;
        $("#subjectCount").text(parseInt($("#subjectCount").text()) + 1); //#subjectCount共有多少题的哪个数字
        $(obj).find('.l-btn-text').html('剔除');
    }
    else if ((flage == "剔除")) //剔除
    {
            var newAyyay = [];//新数组
            $.each(subjectsSelectdBegin.split(','), function (index, value) //循环数组剔除当前的题目id，放入新数组 newAyyay
            {
                if (value != subjectID)
                {
                    newAyyay.push(value);
                }
            });
            subjectsSelectdBegin = newAyyay.join(',');//将数组的值用逗号连接起来:1,2,3,4
        $("#subjectCount").text(parseInt($("#subjectCount").text()) - 1); //#subjectCount共有多少题的哪个数字
        $(obj).find('.l-btn-text').html('入选');
    }


}

