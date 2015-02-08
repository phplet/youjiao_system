var selectedClassID = -1;
var selectedClassRowIndex = -1;
var student;
var teacher;
var creator_name;
var score;
var select_class;
var u_id;
var is_open;
var class_nameList; //12.17修改
var subject_nameList; //12.17修改
var UserInfo = null;
UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
var UserLevel = parseInt(UserInfo.level);  //登录人的权限
$(document).ready(function ()
{
    bindCheckBoxClick();
    updateCancel();
    setUpdateDisabled();
    $("#guidance").hide();
    $("#virtual").hide();
    $("#entity").hide();
    //    $(document).KeyInput($("#StudentText"), '请输入班级名称');
    /*
    控制权限（新增班级按钮是否可用）
    */
    //var UserInfo = null;
   // UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
    //var UserLevel = parseInt(UserInfo.level);  //登录人的权限
    var Sch_type = UserInfo.sch_type; //学校类型
    if (Sch_type == 1)//实体的学校
    {

        if (UserLevel == 4)//实体学校下的教师 （实体班级）
        {
            $('#BtnAdd').linkbutton('enable');
        }
        else
        {
            $('#BtnAdd').linkbutton('disable');
        }
    }
    else if (Sch_type == 2)//校外学校
    {

        if (UserLevel == 2)//校外学校教学主任（校外辅导班级）
        {
            $('#BtnAdd').linkbutton('enable');
        }
        else
        {
            $('#BtnAdd').linkbutton('disable');
			 $('#ModifiedClass').linkbutton('disable');
        }
    }
    else  //虚拟学校
    {
        if (UserLevel == 4)//虚拟学校下的教师 （虚拟班级）
        {
            $('#BtnAdd').linkbutton('enable');
        }
        else
        {
            $('#BtnAdd').linkbutton('disable');
        }
    }

   // if (UserLevel==2){
	//	$("#addStudent").linkbutton('enable');
	//	$("#addTeacher").linkbutton('enable');
	// }
	// else{
		$("#addStudent").linkbutton('disable');
		$("#addTeacher").linkbutton('disable'); 
	// }

    GetClassNameList();
    GetSubjectNameList();

    $('#ClassManager').datagrid({//绑定班级
        fit: true,
        remoteSort: false,
        toolbar: '#SerToolBar',
        pagination: true,
        rownumbers: true,
        idField: "id",
        fitColumns: true,
        singleSelect: true,
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...',
        columns: [[
          { field: 'Name', title: '班级名称', width: 110, sortable: true, align: 'center'},
          { field: 'class_type', title: '类型', width: 110, sortable: true, align: 'center',
              formatter: function (value, row, index){
                  switch (value){
                      case "1":return "校外辅导班";break;
                      case "2":return "实体班";break;
                      case "3":return "虚拟班";break;
					  case "4":return "一对一辅导班";break;
                      default:break;
                  }
              }
          },
          { field: 'creator', title: '创建人', width: 70, sortable: true, align: 'center',
                formatter: function (value, row, index){
                    for (var i in creator_name){
                        if (creator_name[i].id == row.creator){
                            return creator_name[i].realname; break;
                        }
                    }
                }
            },
            { field: 'creat_date', title: '创建日期', width: 150, sortable: true, align: 'center' },
            { field: 'studentnum', title: '学生数量', width: 65, sortable: true, align: 'center',
                formatter: function (value, row, index){
                    for (var i in student){
                        if (student[i].class_Id == row.id){
                            return student[i].total;break;
                        }
                    }
                }
            },
            { field: 'teachernum', title: '教师数量', width: 65, sortable: true, align: 'center',
                formatter: function (value, row, index){
                    for (var i in teacher){
                        if (teacher[i].class_Id == row.id){
                            return teacher[i].total; break;
                        }
                    }
                }
            },
            { field: 'is_open', title: '状态', width: 65, sortable: true, align: 'center',
                formatter: function (value, row, index){
                    if (value == 0){return "开启";}
                    else{return "关闭";}
				}
            },
            { field: 'remark', title: '简介', hidden: true, width: 65, sortable: true, align: 'center'}
        ]],

        onSelect: function (rowIndex, rowData)
        {//rowIndex是行索引，从0开始的。  rowDate是记录对应于该行。
            //           这里给其他几个地方绑定数据。 rowData.id，得到该班级ID 
            BindStudet(rowData.id); //根据班级id绑定学生
            BindTeachers(rowData.id); //根据班级id绑定教师
            BindClassBrief(rowData.id);
            selectedClassID = rowData.id;
            selectedClassRowIndex = rowIndex;
            $("#guidance").hide();
            $("#virtual").hide();
            $("#entity").hide();
            $("#divInfo").show();
            $("#ClassNewName").val(rowData.Name);
            if (rowData.is_open == '0')
            {
                $('#lblcheckbox').html('已开启');
                $("#checkbox").attr("checked", "checked");
            }
            else
            {
                $("#checkbox").attr("checked", false);
                $('#lblcheckbox').html('已关闭');
            }
            $("#TextArea1").val(rowData.remark);
			$("#lblClassName").html(rowData["Name"]);
			
			if (!(rowData.class_type==1 )){
				$("#addStudent").linkbutton('disable');
				$("#addTeacher").linkbutton('disable');
			}
			else{
				 if (UserLevel==2){
					$("#addStudent").linkbutton('enable');
					$("#addTeacher").linkbutton('enable');
				 }
				 else{
					$("#addStudent").linkbutton('disable');
				    $("#addTeacher").linkbutton('disable'); 
				 }
			}
			updateCancel();
        }
    });




    initClass(); //这个是要在加载的时候调用


    $('#ClassStudent').datagrid({//绑定学生
        fit: true,
        remoteSort: false,
        pagination: false,
        rownumbers: true,
        width: $(this).width() * 0.2,
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...',
        columns: [[
            { field: 'realname', title: '学生姓名', width: 100, sortable: true, align: 'center' },
			{ field: 'nickname', title: '昵称', width: 65, sortable: true, align: 'center' },
            { field: 'grade_id', title: '年级', width: 65, sortable: true, align: 'center',
                formatter: function (valueNew, row, index)
                {
                    var class_name = "";
                    $.each(class_nameList, function (ii, value){	
                        if (parseInt(value.id) == parseInt(valueNew)){
                            class_name = value.name;
							}
                    });
                    return class_name;
                }
            },
            { field: 'founder', title: '平均成绩', width: 90, sortable: true, align: 'center',
                formatter: function (valueNew, row, index)
                {
                    var avg = "";
                    if (valueNew != null){
                        $.each(score, function (iii, value){
                            if (parseInt(value.student_id) == parseInt(row.student_id)){
                                avg = value.avg_score;
                            }
                        });
                    }
                    return avg;
                }
            },
            { field: 'reg_time', title: '注册时间', width: 120, sortable: true, align: 'center' },
            { field: 'operation', title: '操作', width: 100, sortable: true, align: 'center',
                formatter: function (value, row, index){
					if (UserLevel==2){
                    	return "<a href=\"#\" onclick=\"DelStudent('" + row.student_id + "'," + index + ")\">删除学生</a>"
					}
					else{
						return ""
					}
                }
            }
        ]]
    });


    $('#details').tabs({
        width: $("#details").parent().width(),
        height: "auto"
    }); //方便右边块宽度自适应


    $('#ClassTeacher').datagrid({//绑定班级下面的教师
        fit: true,
        remoteSort: false,
        pagination: false,
        rownumbers: true,
        striped: false,
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...',
        columns: [[
            { field: 'realname', title: '教师姓名', width: 120, sortable: true, align: 'center' },
            { field: 'subject_grade', title: '学科', width: 65, sortable: true, align: 'center',
                formatter: function (valueNew, row, index)
                {
                    var k = eval('(' + valueNew + ')');                  //
                    //                    return k.subject[0];

                    //return k.subject[0];  
                    var subject_name = "";

                    $.each(subject_nameList, function (index, value)
                    {
                        if (value.id == k.subject[0])
                        {
                            subject_name = value.Name;
                        }
                    });
                    return subject_name;
                }
            },
            { field: 'reg_time', title: '注册时间', width: 100, sortable: true, align: 'center' },
            { field: 'operation', title: '操作', width: 120, sortable: true, align: 'center',
                formatter: function (value, row, index)
                {
					if (UserLevel==2)
                    {return "<a href=\"#\" onclick=\"DelTeachers('" + row.teacher_id + "'," + index + ")\">删除教师</a>"}
					else
					{return ""}
                }
            }
        ]]
    });

	
	
    var txtStudentNoVal = $("#txtStudentNo").val();
    $("#txtStudentNo").keyup(function ()//输入学号显示名字当键盘按下的时候触发
    {
        GetStudentName();  
    });



    /*当是教师的时候设置教师管理面板关闭*/
    if (UserLevel == 4)
    {
       // $('#details').tabs('close', '教师管理');
    }
});                              // .ready 的结束标签


function GetClassNameList()  //给class_nameList赋值
{
    /*获取班级名称的数组*///12.17修改
    $.ajax({  //获取班级名称的数组
        url: Webversion + '/grade/list', //班级名url访问地址
        type: "GET",
        dataType: "json",
        success: function (result)
        {
            class_nameList = result.grade;
        }
    });

}


function GetSubjectNameList()  //给subject_nameList赋值
{
    /*获取学科的名称数组*/
    $.ajax({  //获取学科的名称数组
        url: Webversion + '/subject/list', //获取学科url访问地址
        type: "GET",
        dataType: "json",
        success: function (result){
            subject_nameList = result.subject;
        }
    });
}


function GetStudentName()//添加学生写上学好后获取姓名以及把姓名显示在页面上的操作
{
    //$('#lblName').html(StudentNo);
	var utype=$("#divStudent").attr("usertype");
    $.ajax({  //ajax连接查询学生姓名
        url: Webversion + '/user/name2id', //url访问地址
        type: "GET",
        data: {uname: $("#txtStudentNo").val(),utype:utype},//学生学号
        dataType: "json",
        success: function (result){
            if (result.user_id != null){
                $('#lblName').html(result.realname);
				$('#lblNickname').html(result.nickname);//昵称
                u_id = result.user_id;
            }
            else{
                $('#lblName').html("");
				}
				
			initClass();
        }	
    });
}

function initClass()
{
    GetClassNameList();
    $.ajax({
        url: Webversion + '/class/list', //url访问地址
        type: "GET",
        //        data: {
        //            ClassType: $("#Ssubject").combobox('getValue'), //班级类型 
        //            ClassName: $("#txtClassName").val()//班级名称
        //        },
        dataType: "json",
        success: function (result)
        {

            if (result == null || result["class"] == null)
            {
                result = {};
                result["class"] = [];
            }
            student = result.student;
            teacher = result.teacher;
            creator_name = result.name;
           $('#ClassManager').datagrid("loadData", result["class"]);

        }
    });
}


function BindTeachers(classID)
{//绑定教师数据  classID从后台调数据的参数

    $.ajax({
        url: Webversion + '/class/teacher',
        type: "GET",
        data: {
            class_id: classID
        },
        dataType: "json",
        success: function (result)
        {

            if (result == null || result.teacher == null)
            {
                result = {};
                result.teacher = [];
            }

            $('#ClassTeacher').datagrid("loadData", result.teacher);
        }
    });
}

function BindClassBrief(class_id)
{
    $.ajax({
        url: Webversion + '/class/brief',
        type: "GET",
        data: {
            class_id: class_id
        },
        dataType: "json",
        success: function (result)
        {
            select_class = result.class_brief;
            $('#TextArea1').val(result.class_brief.tag);
        }
    });
}


function DelTeachers(teacherID, rowIndex)
{
    var rowDate = $('#ClassManager').datagrid('getSelected');
    var idx = $('#ClassManager').datagrid('getRowIndex', rowDate);
    if (rowDate.is_open == 0)
    {//只有在他的状态等于开始的时候才是可以进行删除的 
        //删除教师请修改如下：
        $.messager.confirm("警告！", "确定要删除该教师吗？", function (r)
        {
            if (r)
            {
                $.ajax({
                    url: Webversion + '/class/relationship',
                    type: "POST",
                    data: {
                        _method: "DELETE",
                        class_id: rowDate.id,
                        user_id: teacherID

                    },
                    dataType: "json",
                    success: function (result)
                    {//成功的话isSuccess=true，不成功就返回isSuccess=false
                        BindTeachers(rowDate.id);
						initClass();
                    }
                });
            }
        });
        initClass();
    }
    else
    {
        $.messager.alert("警告！", "班级的状态必须是开启！");
        return false;
    }

    //成功删除后界面移除教师信息

}

function BindStudet(classID)
{//绑定学生数据 classID从后台调数据的参数
    //    $('#ClassStudent').datagrid("loadData", { "page": 1, "total": 2,
    //        "rows":
    //        [
    //            { "id": "班级01", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    //            { "id": "班级02", "realname": "四", "founder": "80", "date": "2010", "studentnum": "c", "teachernum": "d", "state": "关闭", "operation": "f", "remark": "2" }
    //        ]
    //    });
    //请修改如下：
    GetSubjectNameList();
    $.ajax({
        url: Webversion + '/class/student',
        type: "GET",
        data: {
            class_id: classID
        },
        dataType: "json",
        success: function (result)
        {//studnet为学生数据
            if (result == null || result["student"] == null){
                result = {};
                result["student"] = [];
            }

            score = result["score"];
            $('#ClassStudent').datagrid("loadData", result["student"]);
        }
    });
}

function DelStudent(studentID, rowIndex)
{
    var rowDate = $('#ClassManager').datagrid('getSelected');
    var idx = $('#ClassManager').datagrid('getRowIndex', rowDate);

    if (rowDate.is_open == 0)
    {//只有在他的状态等于开始的时候才是可以进行删除的 
        $.messager.confirm("警告！", "确定要删除该学生吗？", function (r){
            if (r){
                $.ajax({
                    url: Webversion + '/class/relationship',
                    type: "POST",
                    data: {
                        _method: "DELETE",
                        class_id: rowDate.id,
                        user_id: studentID
                    },
                    dataType: "json",
                    success: function (result){//成功的话isSuccess=true，不成功就返回isSuccess=false
                        BindStudet(rowDate.id);
						initClass();
                    }
                });
            }
        });  
    }
    else{
        $.messager.alert("警告！", "班级的状态必须是开启！");
        return false;
    }
    //删除学生请修改如下：
    //成功删除后界面移除学生信息
}

function CloseDialog()
{
    $('#renamed').dialog('close');
}


function addStudent(usertype)
{
    var rowDate = $('#ClassManager').datagrid('getSelected'); //选中班级的信息
   if( rowDate !== null){
		 if (rowDate.is_open == 0){
			$("#ClassManagement").hide();
			$("#divStudent").attr("usertype",usertype);
			$("#txtStudentNo").val('');
			$("#lblStudentName").html('');
			$("#lblName").html('');
			$("#divStudent").dialog('open');
		}
		else{
			$.messager.alert("警告！", "班级的状态必须是开启！");
			return false;
		}	
   }
   else{
		$.messager.alert("警告！", "请先选择班级！");
		return false;	
   }
   
   var idx = $('#ClassManager').datagrid('getRowIndex', rowDate);
   var className = $('#ClassManager').datagrid('getSelected',rowDate.Name); //选中班级的信息  
}



function LookStudentInfo()
{
    $("#DivDeleteStudent").hide();
    $.messager.confirm('系统消息', '确定删除此学生吗', function (r)
    {
     
        if (!r)
        {
            //连接数据。

            alert(!r);


        }
    });
}


function LookTeacherInfo()
{
    //     alert("aaa");
    $("#DivDelTeacher").hide();
    $.messager.confirm('系统消息', '确定删除此教师吗', function (r)
    {
        if (!r)
        {
            //连接数据。

        }
    });

}

function SaveStudent()
{//添加学生 从后台调数据
    var rowDate = $('#ClassManager').datagrid('getSelected'); //选中班级的信息
    var classID = rowDate.id; //这个班级的id	
    var studentNo = $("#txtStudentNo").val(); //取到的学生帐号
    $.ajax({
        url: Webversion + '/class/relationship',
        type: "POST",
        data: {
            class_id: classID,
            user_id: u_id,
            _method: "PUT"
        },
        dataType: "json",
        success: function (result)
        {//成功的话isSuccess=true，不成功就返回isSuccess=false
            $("#renamed").dialog('close');
            initClass();
            BindStudet(classID); //根据班级id绑定学生
            BindTeachers(classID); //根据班级id绑定教师
        },
	    error: function (result) {
			$.messager.progress("close");
			$.messager.alert('错误', '添加学生/教师失败!<br/><span style="color:red;">可能原因：此班下已经有此学生/教师。</span>', 'error');
		}			
    });


    //1.链接ajax。
    $("#divStudent").dialog('close');
    $('#txtStudentNo').val("");
    $('#lblName').html(""); //成功之后关闭                                                                                                                                                                                                                                                                                                                                                                                                                                                            
    BindStudet(classID); //关闭之后的重新加载页面
    BindClassBrief(classID);
	
}


function CancelStudent()
{
    $("#divStudent").dialog('close');
}

/* function delStudent()
{
$("#ClassManagement").hide();
$("#divTeacher").dialog('open');
} */
function CancelTeacher()
{

    $("#divTeacher").dialog('close');
}


function Update()
{

    var rowDate1 = $('#ClassManager').datagrid('getSelected'); //选中班级的信息
    var idx = $('#ClassManager').datagrid('getRowIndex', rowDate1); //可以定位界面上的哪一行数据的  （索引）




    if (rowDate1 == undefined || rowDate1 == null)
    {
        $.remind('请先选择班级！');
        return;
    }
    var is_open = $('#checkbox').attr('checked') == undefined ? "1" : "0";
   
    $.ajax({

        url: Webversion + '/class/info',
        type: "POST",
        data: {
            class_id: rowDate1.id,
            name: $('#ClassNewName').val(),
            tag: $("#TextArea1").val(),
            is_open: is_open

        },
        dataType: "json",
        success: function (result)
        {//成功的话isSuccess=true，不成功就返回isSuccess=false
            /*   if (result.isSuccess == true) {
            $.messager.alert("提示", "操作成功！");
            $('#ClassManager').datagrid('updateRow', {
            index: idx,
            row: rowDate
            });
            } */

            initClass();
			updateCancel();
           
        }

    });


}

//新建实体班级
function submitShiTi()
{
    if ($('#txtClassName').val() == ''){
        $.messager.alert('警告', '班级名称不得为空！');
        return;
    }
    if ($('#txtContent').val() == '')
    {
        $.messager.alert('警告', '班级简介不得为空！');
        return;
    }
    var is_open = $('#entityCheckbox').attr('checked') == undefined ? "1" : "0";
    $.ajax({
        url: Webversion + '/class', //url访问地址
        type: "POST",
        data: {
            class_type: "2", //班级类型(下拉框)  2--实体班
            name: $('#txtClassName').val(), //班级名称
            year: $('#selectYear').val(), //easyui 下拉框取值 年份
            grade_id: $('#selectClassgrade').val(), //年级
			//send_id: $('#selectSendMode').val(),//接收形式的值
            tag: $('#entityTextArea').val(),  //简介
            is_open: is_open
        },
        dataType: "json",
        success: function (result){
            $.messager.alert('后台数据操作', '添加实体班级成功！', 'info', function (){
                document.location.href = "MyClass.html";
            });
        },
	    error: function (result) {
			$.messager.progress("close");
			$.messager.alert('错误', '添加实体班级失败!<br/><span style="color:red;">可能原因：此校区下可能已存在此负责人。</span>', 'error');
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
    var is_open = $('#virtualCheckbox').attr('checked') == undefined ? "1" : "0";
    $.ajax({
        url: Webversion + '/class', //url访问地址
        type: "POST",
        data: {
            class_type: "3", //班级类型(下拉框)
            name: $('#txtXuClassName').val(), //班级名称
            grade_id: $('#selectXuClassgrade').val(), //年级
			send_id: $('#selectSendMode').val(),//接收形式的值
            tag: $('#virtualTextArea').val(),
            is_open: is_open
        },
        dataType: "json",
        success: function (result){ //得到当前登录人的权限角色是什么
            $.messager.alert('后台数据操作', '添加虚拟班级成功！', 'info', function (){
                document.location.href = "MyClass.html";
            });
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
    var is_open = $('#guidanceCheckbox').attr('checked') == undefined ? "1" : "0";
    $.ajax({
        url: Webversion + '/class', //url访问地址
        type: "POST",
        data: {
            class_type: "1",
            name: $('#txtXiaoClassName').val(), //班级名称
            grade_id: $('#selectXiaoClassgrade').val(), //年级
			//send_id: $('#selectSendMode').val(),//接收形式的值
            tag: $('#guidanceTextArea').val(),
            is_open: is_open
        },
        dataType: "json",
        success: function (result)
        { //得到当前登录人的权限角色是什么
            //alert($('#selectXiaoClassgrade').val());
            $.messager.alert('后台数据操作', '添加校外班级成功！', 'info', function (){
                document.location.href = "MyClass.html";
            });
        }

    });
}

function updataTrue()
{
    $('#divUpdateTwo').show();
    $('#divUpdateOne').hide();
    setUpdateRemoveDisabled();
}

function updateCancel()
{
    $('#divUpdateTwo').hide();
    $('#divUpdateOne').show();
    setUpdateDisabled();
}
function setUpdateDisabled()
{
    $('#ClassNewName').attr("disabled", "disabled");
    $('#checkbox').attr("disabled", "disabled");
    $('#TextArea1').attr("disabled", "disabled");
}

function setUpdateRemoveDisabled()
{
    $('#ClassNewName').attr("disabled", false);
    $('#checkbox').attr("disabled", false);
    $('#TextArea1').attr("disabled", false);
}
function bindCheckBoxClick()
{
    $('#checkbox').click(function ()
    {
        if ($(this).attr('checked') == undefined)
        {
            $('#lblcheckbox').html('已关闭');
        }
        else
        {
            $('#lblcheckbox').html('已开启');
        }
    });
    $('#entityCheckbox').click(function ()
    {
        if ($(this).attr('checked') == undefined)
        {
            $('#lblentityCheckbox').html('已关闭');
        }
        else
        {
            $('#lblentityCheckbox').html('已开启');
        }
    });
    $('#virtualCheckbox').click(function ()
    {
        if ($(this).attr('checked') == undefined)
        {
            $('#lblvirtualCheckbox').html('已关闭');
        }
        else
        {
            $('#lblvirtualCheckbox').html('已开启');
        }
    });
    $('#guidanceCheckbox').click(function ()
    {
        if ($(this).attr('checked') == undefined)
        {
            $('#lblguidanceCheckbox').html('已关闭');
        }
        else
        {
            $('#lblguidanceCheckbox').html('已开启');
        }
    });
}

