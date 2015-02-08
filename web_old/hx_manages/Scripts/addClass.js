$(function ()
{

    // bindOp();
    // $('#CreateClass').change(function ()
    // {

    // bindOp();
    // });


    //使用权限调用的方法
    initClassType();

});


//根据选择的班级类型绑定操作
/* function bindOp()
{
var value = $("#CreateClass").val();
if (value == "3")
{

$('#btnSubmit').unbind('click');
$('#btnSubmit').bind('click', submitXuNi);
$("#CreateClass").find("option[value='xnb']").attr("selected", true); //设置虚拟班级框选选中
$("#entity").hide();
$("#guidance").hide();
$("#virtual").show();
}
else if (value == "2")
{

$('#btnSubmit').unbind('click');
$('#btnSubmit').bind('click', submitShiTi);
$("#CreateClass").find("option[value='stb']").attr("selected", true);  //设置实体班级框选选中
$("#guidance").hide();
$("#virtual").hide();
$("#entity").show();
}
else
{

$('#btnSubmit').unbind('click');
$('#btnSubmit').bind('click', submitXiaoWai);
$("#CreateClass").find("option[value='fdb']").attr("selected", true); //设置辅导班级框选选中
$("#virtual").hide();
$("#entity").hide();
$("#guidance").show();
}

} */



/*   */
function initClassType()
{ //权限控制班级类型。

    var UserInfo = null;
    UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
    var UserLevel = parseInt(UserInfo.level);  //登录人的权限
    var Sch_type = UserInfo.sch_type; //学校类型
    /*
    Sch_type:1表示实体
    Sch_type：2表示校外
    *校长：1；可以建立的班级：不可建班
    *教学主任：2；可以建立的班级：分两种：1、实体学校的教学主任可建实体班级 2、校外辅导机构的教学主任可建校外辅导班
    *班主任：3；可以建立的班级：不可建班
    *教师：4；可以建立的班级：虚拟班
    */
    if (Sch_type == 1)//实体的学校
    {
        if (UserLevel == 4)//实体学校下的教师 （实体班级）
        {
            $("#guidance").hide();
            $("#virtual").hide();
            $("#entity").show();
            $('#btnSubmit').unbind('click');
            $('#btnSubmit').bind('click', submitShiTi);
        }
    }
    else if (Sch_type == 2)//校外学校
    {

        if (UserLevel == 2)//校外学校教学主任（校外辅导班级）
        {
            $("#virtual").hide();
            $("#entity").hide();
            $("#guidance").show();
            $('#btnSubmit').unbind('click');
            $('#btnSubmit').bind('click', submitXiaoWai);
        }
    }
    else  //虚拟学校
    {
        if (UserLevel == 4)//虚拟学校下的教师 （虚拟班级）
        {
            $("#entity").hide();
            $("#guidance").hide();
            $("#virtual").show();

            $('#btnSubmit').unbind('click');
            $('#btnSubmit').bind('click', submitXuNi);
          
        }
    }


    //    if (UserLevel == 4 || UserInfo.sch_type == 1)  //校长：1和班主任：2不可以建立班级那么
    //    {
    //        //选中 实体班级权限
    //        $("#guidance").hide();
    //        $("#virtual").hide();
    //        $("#entity").show();
    //        $('#btnSubmit').unbind('click');
    //        $('#btnSubmit').bind('click', submitShiTi);
    //        $("#CreateClass").find("option[value='2']").attr("selected", true);  //设置实体班级框选选中
    //    }


    //    else if (UserInfo.sch_type == 2 || UserLevel == 2)  //校长：1和班主任：2不可以建立班级那么
    //    {
    //        //选中 实体班级权限
    //        $("#guidance").hide();
    //        $("#virtual").hide();
    //        $("#entity").show();
    //        $('#btnSubmit').unbind('click');
    //        $('#btnSubmit').bind('click', submitShiTi);
    //        $("#CreateClass").find("option[value='2']").attr("selected", true);  //设置实体班级框选选中
    //    }


    //    else  //能建立虚拟班级
    //    {
    //        $("#entity").hide();
    //        $("#guidance").hide();
    //        $("#virtual").show();

    //        $('#btnSubmit').unbind('click');
    //        $('#btnSubmit').bind('click', submitXuNi);
    //        //选中 能建立虚拟班级
    //        $("#CreateClass").find("option[value='3']").attr("selected", true); //设置虚拟班级框选选中

    //    }

    /* $('#CreateClass').attr('disabled', 'true'); //班级不可以下拉
    if (UserLevel == 1 || UserLevel == 3)  //校长：1和班主任：2不可以建立班级那么
    {
    $('#CreateClass').empty(); //清空下拉框
    $('#btnSubmit').linkbutton('disable'); //设置按钮不可用
    $('#divContent').attr('disabled', 'disabled'); //让整个div不可以用
    $('#txtClassName').attr('disabled', 'disabled');
    $('#selectYear').attr('disabled', 'disabled');
    $('#selectClassgrade').attr('disabled', 'disabled');
    $('#txtContent').attr('disabled', 'disabled');
    }
    else if (UserLevel ==2)//判断身份如果是教学主任
    {
      
    if (UserInfo.sch_type == 1)// 实体班级权限
    {
    //选中 实体班级权限
    $("#guidance").hide();
    $("#virtual").hide();
    $("#entity").show();
    $('#btnSubmit').unbind('click');
    $('#btnSubmit').bind('click', submitShiTi);
    $("#CreateClass").find("option[value='2']").attr("selected", true);  //设置实体班级框选选中
    }
    else if (UserInfo.sch_type == 2)  //校外辅导班级
    {
    //选中 校外辅导权限
    $("#virtual").hide();
    $("#entity").hide();
    $("#guidance").show();
    $('#btnSubmit').unbind('click');
    $('#btnSubmit').bind('click', submitXiaoWai);
    $("#CreateClass").find("option[value='1']").attr("selected", true); //设置辅导班级框选选中
    }
    }
    else if (UserLevel == 4)  //教师的权限 （能建立虚拟班级）
    {
    $("#entity").hide();
    $("#guidance").hide();
    $("#virtual").show();

    $('#btnSubmit').unbind('click');
    $('#btnSubmit').bind('click', submitXuNi);
    //选中 能建立虚拟班级
    $("#CreateClass").find("option[value='3']").attr("selected", true); //设置虚拟班级框选选中

    } */

}

//添加实体班级的时候
function submitShiTi()
{
    if ($('#txtClassName').val() == '')
    {
        $.messager.alert('警告', '班级名称不得为空！');
        return;
    }
    if ($('#txtContent').val() == '')
    {
        $.messager.alert('警告', '班级简介不得为空！');
        return;
    }
    $.ajax({
        url: Webversion + '/class', //url访问地址
        type: "POST",
        data: {
            class_type: "2", //班级类型(下拉框)
            name: $('#txtClassName').val(), //班级名称
            year: $('#selectYear').val(), //easyui 下拉框取值 年份
            grade_id: $('#selectClassgrade').val(), //年级
            tag: $('#txtContent').val()  //简介
        },
        dataType: "json",
        success: function (result)
        { //得到当前登录人的权限角色是什么
            //$.messager.alert('后台数据操作','添加实体班级成功！');
			 $.messager.alert('后台数据操作', '添加实体班级成功！','info', function(){
				document.location.href = "MyClass.html";
			} );
        }
    });
}

//添加虚拟班级
function submitXuNi()
{
    if ($('#txtXuClassName').val() == '')
    {
        $.messager.alert('警告', '班级名称不得为空！');
        return;
    }
    if ($('#txtContent').val() == '')
    {
        $.messager.alert('警告', '班级简介不得为空！');
        return;
    }

    //alert("Xuni");
    $.ajax({
        url: Webversion + '/class', //url访问地址
        type: "POST",
        data: {
            class_type: "3", //班级类型(下拉框)
            name: $('#txtXuClassName').val(), //班级名称
            grade_id: $('#selectXuClassgrade').val(), //年级
            tag: $('#txtContent').val()  //简介
        },
        dataType: "json",
        success: function (result)
        { //得到当前登录人的权限角色是什么

            $.messager.alert('后台数据操作', '添加虚拟班级成功！','info', function(){
				document.location.href = "MyClass.html";
			} );

        }
    });
}


//添加校外辅导
function submitXiaoWai()
{
    if ($('#txtXiaoClassName').val() == '')
    {
        $.messager.alert('警告', '班级名称不得为空！');
        return;
    }
    if ($('#txtContent').val() == '')
    {
        $.messager.alert('警告', '班级简介不得为空！');
        return;
    }
    $.ajax({
        url: Webversion + '/class', //url访问地址
        type: "POST",
        data: {
            class_type: "1",
            name: $('#txtXiaoClassName').val(), //班级名称
            grade_id: $('#selectXiaoClassgrade').val(), //年级
            tag: $('#txtContent').val()  //简介
        },
        dataType: "json",
        success: function (result)
        { //得到当前登录人的权限角色是什么
			
            $.messager.alert('后台数据操作', '添加校外班级成功！','info', function(){
				document.location.href = "MyClass.html";
			} );

        }
    });
}