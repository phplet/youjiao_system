 
$().ready(function() {
      UserInfo = $.evalJSON($.cookie("UserInfo"));
     $('#EditClass').css('display','none');
	 $('#students_counts').panel({  
	    title:"&nbsp;学务报表&nbsp;>>&nbsp;学生数量统计",
		 
		onOpen:function(){
			$('#details').tabs({
       			 width: $("#details").parent().width(),
        		 height: "auto",
				 tools:"#tab-tools",
    	 		 onSelect:function(title){
					 if(title=="大班管理"){
						 $('.panel-title').html('&nbsp;学务报表&nbsp;>>&nbsp;学生数量统计&nbsp;>>&nbsp;按天统计');
						 $('#addclass').linkbutton({disabled:false});
						 bigClass();
						 bigClassCounts();	
					  }else if(title=="1对1管理"){
						$('.panel-title').html('&nbsp;学务报表&nbsp;>>&nbsp;学生数量统计&nbsp;>>&nbsp;按月统计');
						$('#addclass').linkbutton({disabled:true});
						oneToCounts();
					  }
					//alert(title+' is selected');  //判断每个每个列表 更新列表
				 }
			}); //方便右边块宽度自适应	
		
		}
	 });
	 
	 
});


//班级展示
 
function bigClass(){
	$('#bigClass').datagrid({   
        
        remoteSort: false,
       // toolbar: '#day_bar',
        
        rownumbers:true,
		singleSelect:true,
		//title:"&nbsp;校区管理",
         
        loadMsg: '正在加载数据...', 
        /*onClickRow: function (rowIndex, rowData) {
            $('#Educational_Set').datagrid("unselectRow", rowIndex);
        },*/
		
        columns: [[  
		    { field: 'class_Id', title: '班级ID', width: 80, align: 'center', sortable: true },
			{ field: 'class_Status', title: '班级状态', width: 80, align: 'center'},
			{ field: 'class_Name', title: '班级名称', width: 100, align: 'center' },
			{ field: 'class_Teacher', title: '任课教师', width: 100, align: 'center' },
			{ field: 'creat_Time', title: '建班时间', width: 60, align: 'center', sortable: true },
			{ field: 'end_Time', title: '结课时间', width: 60, align: 'center', sortable: true },
			{ field: 'class_StuSum', title: '班级人数', width: 60, align: 'center', sortable: true },
			{
                field: 'c_id', title: '操作', align: 'center',width: 170, 
                formatter: function (value, row, index) {
                    var s = "<div style='line-height:25px;'><a href=\"#\" style='color:blue;' onclick=\"editClass('" + value + "'," + index + ")\">查看修改详情</a>&nbsp;<a href=\"#\" style='color:blue;' onclick=\"teaching_Note('" + value + "'," + index + ")\">查看教学备注</a><br /><a href=\"#\" onclick=\"teaching_Assign('" + value + "'," + index + ",1)\" style='color:blue;' >教师选派管理</a>&nbsp;<a href=\"#\" style='color:blue;' onclick=\"test_Statistics('" + value + "'," + index + ")\">班级测评统计</a><br /><a href=\"#\" style='color:blue;' onclick=\"changeClass('" + value + "'," + index + ")\">批量换班退班</a></div>";
                    return s;
                }
            }
        ]]
    });
	
	
	
 bigClass_School();
   
}


//加载列表俺分页的形式显示
function bigClass_School() {

    /*var url = Webversion + "/school/list/" + s + "," + l + "/uplevel_id/" + UserInfo.school_id ;
    var params = {};
    if ($("#SchoolText").attr("innt") != "1") {
        url = Webversion + "/school/list/" + s + "," + l + "/name" ;
        params.key = $.trim($("#SchoolText").val());
    }*/

   // params['r'] = $.getRom();

    // 加载数据列表
    $.ajax({
        url: '../data/class.json',
        type: "GET",
        dataType: "json",
        //data: params,
        success: function (result) {
			 
            var datalistTemp = [];
			 
			if(result!=null){
				 
            	$.each(result.schools,function(i,s){
						var itemtemp = {};
					   
                        itemtemp.class_Id = s.class_Id;
						itemtemp.class_Status = s.class_Status;
						itemtemp.class_Name = s.class_Name;
						itemtemp.class_Teacher = s.class_Teacher;
						itemtemp.creat_Time = s.creat_Time;
						itemtemp.end_Time = s.end_Time;
						itemtemp.class_StuSum = s.class_StuSum;
						itemtemp.c_id = s.c_id;
						  
                        datalistTemp.push(itemtemp);
				
				});
			}
           /* if (result != null && result.school != null) {

                // 设置分页总记录数
                var pager = $('#schoolmanager').datagrid("getPager");
                pager.pagination({
                    total: result.school.total
                });

                if (result.school.info != null) {
                    $.each(result.school.info, function (i, n) {
                        var itemtemp = {};
                        itemtemp.school_id = n.school_id;
                        itemtemp.name = n.name;
                        itemtemp.creat_date = n.creat_date;
                        itemtemp.teacher = [];
                        
                        if (result.teacher != null) {
                            $.each(result.teacher, function (k, j) {
                                if (n.school_id == j.school_id) {
                                    var teactemp = {};
                                    teactemp.teacher_id = j.teacher_id;
                                    teactemp.realname = j.realname;
                                    teactemp.mobile = j.mobile;
                                    itemtemp.teacher.push(teactemp);
                                }
                            })
                        }

                        datalistTemp.push(itemtemp);

                    });
                }

            }*/

            //alert($.toJSON(datalistTemp));

            $('#bigClass').datagrid("loadData", datalistTemp);
			
        },
        error: function (result) {
			
        }
    });

}


//按天统计
function bigClassCounts(){
	$('#bigClassCounts').datagrid({
        remoteSort: false,
        toolbar: '#bar_height',
        pagination:true,
        rownumbers:true,
		singleSelect:true,
		//title:"&nbsp;校区管理",
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...', 
        /*onClickRow: function (rowIndex, rowData) {
            $('#Educational_Set').datagrid("unselectRow", rowIndex);
        },*/
		
        columns: [[
		    { field: 'stu_Num', title: '编号', width: 40, align: 'center', sortable: true },
			{ field: 'stu_Name', title: '用户名', width: 60, align: 'center'},
			{ field: 'stu_Real', title: '学生姓名', width: 60, align: 'center' },
			{ field: 'stu_Sex', title: '性别', width: 40, align: 'center' },
			{ field: 'stu_Class', title: '当前年级', width: 60, align: 'center', sortable: true },
			{ field: 'stu_School', title: '在读学校', width: 60, align: 'center', sortable: true } ,
			{ field: 'work_Counts', title: '作业统计', width: 60, align: 'center', sortable: true } ,
			{ field: 'ping_Counts', title: '测评统计', width: 50, align: 'center', sortable: true } ,
			{ field: 'ping_Grade', title: '测评等级', width: 60, align: 'center', sortable: true } ,
			{ field: 'creat_Time', title: '入班时间', width: 60, align: 'center', sortable: true } ,
			{ field: 'log_Time', title: '登录时间', width: 60, align: 'center', sortable: true } ,
			{ field: 'send_Time', title: '近期发送<br>报告时间', width: 60, align: 'center', sortable: true } ,
			{
                field: 'stu_Id', title: '操作', align: 'center',width: 80, 
                formatter: function (value, row, index) {
                    var s = "<div style='line-height:25px;'><a href=\"#\" style='color:blue;' onclick=\"editStudent('" + value + "'," + index + ")\">查看修改信息</a><br /><a href=\"#\" style='color:blue;' onclick=\"selSrudentCorrects('" + value + "'," + index + ")\">查看测评详情</a><br /><a href=\"#\" style='color:blue;' onclick=\"selSubjectInfo('" + value + "'," + index + ")\" >查看学习报告</a><br /><a href=\"#\" style='color:blue;' onclick=\"histroyStudys('" + value + "'," + index + ")\">历史学习记录</a><br /><a href=\"#\" style='color:blue;' onclick=\"subClass('" + value + "'," + index + ")\">报班管理</a></div>";
                    return s;
                }
            }
        ]]
    });
	
	
	
    var pager = $('#bigClassCounts').datagrid("getPager");
    pager.pagination({
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            var ltemp = (pageNumber - 1) * pageSize;
            LoadStudent(ltemp, pageSize);
            $(this).pagination('loaded');
        }
    });

    pager.pagination("select", 1);
   
}


//加载列表俺分页的形式显示
function LoadStudent(s,l) {

    /*var url = Webversion + "/school/list/" + s + "," + l + "/uplevel_id/" + UserInfo.school_id ;
    var params = {};
    if ($("#SchoolText").attr("innt") != "1") {
        url = Webversion + "/school/list/" + s + "," + l + "/name" ;
        params.key = $.trim($("#SchoolText").val());
    }*/

   // params['r'] = $.getRom();

    // 加载数据列表
    $.ajax({
        url: '../data/class_students.json',
        type: "GET",
        dataType: "json",
        //data: params,
        success: function (result) {
			 
            var datalistTemp = [];
			 
			if(result!=null){
				// alert(JSON.stringify(result) );
            	$.each(result.schools,function(i,s){
						var itemtemp = {};
					   
                        itemtemp.creat_date = s.creat_date;
						itemtemp.nowBigStus = s.nowBigStus;
						itemtemp.nowOneStus = s.nowOneStus;
						itemtemp.nowStus = (parseInt(s.nowBigStus)+parseInt(s.nowOneStus));
						itemtemp.jionStus = s.jionStus;
						itemtemp.loseStus = s.loseStus;
						  
                        datalistTemp.push(itemtemp);
				
				});
			}
           /* if (result != null && result.school != null) {

                // 设置分页总记录数
                var pager = $('#schoolmanager').datagrid("getPager");
                pager.pagination({
                    total: result.school.total
                });

                if (result.school.info != null) {
                    $.each(result.school.info, function (i, n) {
                        var itemtemp = {};
                        itemtemp.school_id = n.school_id;
                        itemtemp.name = n.name;
                        itemtemp.creat_date = n.creat_date;
                        itemtemp.teacher = [];
                        
                        if (result.teacher != null) {
                            $.each(result.teacher, function (k, j) {
                                if (n.school_id == j.school_id) {
                                    var teactemp = {};
                                    teactemp.teacher_id = j.teacher_id;
                                    teactemp.realname = j.realname;
                                    teactemp.mobile = j.mobile;
                                    itemtemp.teacher.push(teactemp);
                                }
                            })
                        }

                        datalistTemp.push(itemtemp);

                    });
                }

            }*/

            //alert($.toJSON(datalistTemp));

            $('#bigClassCounts').datagrid("loadData", datalistTemp);
			
        },
        error: function (result) {
			
        }
    });

}



//按月统计
function oneToCounts(){
	$('#oneToCounts').datagrid({   
        fit: true,
        remoteSort: false,
        toolbar: '#month_bar',
        pagination:true,
        rownumbers:true,
		singleSelect:true,
		//title:"&nbsp;校区管理",
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...', 
        /*onClickRow: function (rowIndex, rowData) {
            $('#Educational_Set').datagrid("unselectRow", rowIndex);
        },*/
		
        columns: [[
		    { field: 'stu_Num', title: '编号', width: 40, align: 'center', sortable: true },
			{ field: 'stu_Name', title: '用户名', width: 60, align: 'center'},
			{ field: 'stu_Real', title: '学生姓名', width: 60, align: 'center' },
			{ field: 'stu_Sex', title: '性别', width: 40, align: 'center' },
			{ field: 'stu_Class', title: '当前年级', width: 60, align: 'center', sortable: true },
			{ field: 'stu_School', title: '在读学校', width: 60, align: 'center', sortable: true } ,
			{ field: 'work_Counts', title: '作业统计', width: 60, align: 'center', sortable: true } ,
			{ field: 'ping_Counts', title: '测评统计', width: 50, align: 'center', sortable: true } ,
			{ field: 'ping_Grade', title: '测评等级', width: 60, align: 'center', sortable: true } ,
			{ field: 'creat_Time', title: '入班时间', width: 60, align: 'center', sortable: true } ,
			{ field: 'log_Time', title: '登录时间', width: 60, align: 'center', sortable: true } ,
			{ field: 'send_Time', title: '近期发送<br>报告时间', width: 60, align: 'center', sortable: true } ,
			{
                field: 'stu_Id', title: '操作', align: 'center',width: 80, 
                formatter: function (value, row, index) {
                    var s = "<div style='line-height:25px;'><a href=\"#\" style='color:blue;' onclick=\"editStudent('" + value + "'," + index + ")\">查看修改信息</a><br /><a href=\"#\" style='color:blue;' onclick=\"selSrudentCorrects('" + value + "'," + index + ")\">查看测评详情</a><br /><a href=\"#\" style='color:blue;' onclick=\"selSubjectInfo('" + value + "'," + index + ")\" >查看学习报告</a><br /><a href=\"#\" style='color:blue;' onclick=\"histroyStudys('" + value + "'," + index + ")\">历史学习记录</a><br /><a href=\"#\" onclick=\"teaching_Assign('" + value + "'," + index + ",1)\" style='color:blue;' >教师选派管理</a><br /><a href=\"#\" style='color:blue;' onclick=\"EditSchoolName('" + value + "'," + index + ")\">结课</a></div>";
                    return s;
                }
            }                            
        ]]
    });
	
	
	
    var pager = $('#oneToCounts').datagrid("getPager");
    pager.pagination({
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            var ltemp = (pageNumber - 1) * pageSize;
            oneToCountsajax(ltemp, pageSize);
            $(this).pagination('loaded');
        }
    });

    pager.pagination("select", 1);
   
}


//
function oneToCountsajax(s,l) {

    /*var url = Webversion + "/school/list/" + s + "," + l + "/uplevel_id/" + UserInfo.school_id ;
    var params = {};
    if ($("#SchoolText").attr("innt") != "1") {
        url = Webversion + "/school/list/" + s + "," + l + "/name" ;
        params.key = $.trim($("#SchoolText").val());
    }*/

   // params['r'] = $.getRom();

    // 加载数据列表
    $.ajax({
        url: '../data/class_students.json',
        type: "GET",
        dataType: "json",
        //data: params,
        success: function (result) {
			 
            var datalistTemp = [];
			 
			if(result!=null){
				 
            	$.each(result.schools,function(i,s){
						var itemtemp = {};
					    
                        itemtemp.creat_date = s.creat_date;
						itemtemp.nowBigStus = s.nowBigStus;
						itemtemp.nowOneStus = s.nowOneStus;
						 
						itemtemp.joinBigStus = s.joinBigStus;
						itemtemp.joinOneStus = s.joinOneStus;
						itemtemp.loseBigStus = s.joinBigStus;
						itemtemp.loseOneStus = s.joinOneStus;
						  
                        datalistTemp.push(itemtemp);
				
				});
			}
           /* if (result != null && result.school != null) {

                // 设置分页总记录数
                var pager = $('#schoolmanager').datagrid("getPager");
                pager.pagination({
                    total: result.school.total
                });

                if (result.school.info != null) {
                    $.each(result.school.info, function (i, n) {
                        var itemtemp = {};
                        itemtemp.school_id = n.school_id;
                        itemtemp.name = n.name;
                        itemtemp.creat_date = n.creat_date;
                        itemtemp.teacher = [];
                        
                        if (result.teacher != null) {
                            $.each(result.teacher, function (k, j) {
                                if (n.school_id == j.school_id) {
                                    var teactemp = {};
                                    teactemp.teacher_id = j.teacher_id;
                                    teactemp.realname = j.realname;
                                    teactemp.mobile = j.mobile;
                                    itemtemp.teacher.push(teactemp);
                                }
                            })
                        }

                        datalistTemp.push(itemtemp);

                    });
                }

            }*/

            //alert($.toJSON(datalistTemp));

            $('#oneToCounts').datagrid("loadData", datalistTemp);
        },
        error: function (result) {
			
        }
    });

}



//查看教学备注
 
function teaching_Note(value, index) {

    $.messager.progress({text:'正在获取教学备注信息'});
    // 获取校区相关数据
    var rowData = ($('#bigClass').datagrid('getData').rows)[index];

    $("#teaching_Note").dialog({
        iconCls: 'icon-save',
        title: '查看教学备案',
        width: 580,
        height: 250,
        closed: true,
        cache: false,
        modal: true,
        onOpen: function () {
            $.messager.progress('close');
            $('#wdialog').val(rowData.name);
        },
        buttons: [
            /*{text: '关闭',
            iconCls: 'icon-ok',
            handler: function () {

                $.messager.progress({ text: '系统正在处理' });

                var paramesTempVis = { 'school_name': $('#AleInputSchoolName').val(), 'school_id': rowData.school_id };

               $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: Webversion + "/school?_method=PUT" ,
                    data: paramesTempVis,
                    success: function (result) {
                        $.messager.progress('close');
                        $('#SeltSchoolName').dialog('close');
                        $.remind('校区名称修改成功！');
                        var pager = $('#Educational_Set').datagrid("getPager");
                        pager.pagination("select");
                    }, error: function (result) {
                        $.messager.progress('close');
                        $.error('系统出现异常，校区名称修改失败！');
                    }
                });

            }
        },*/
        {
            text: '关闭',
            iconCls: 'icon-ok',
            handler: function () {
                $('#teaching_Note').dialog('close');
            }
        }]
    });

    $('#teaching_Note').dialog('open');

}


//班级测评统计
function test_Statistics(value, index) {

    $.messager.progress({text:'正在获取教学备注信息'});
    // 获取校区相关数据
    var rowData = ($('#bigClass').datagrid('getData').rows)[index];

    $("#test_Statistics").dialog({
        iconCls: 'icon-save',
        title: '查看班级测评统计',
        width: 520,
        height: 250,
        closed: true,
        cache: false,
        modal: true,
        onOpen: function () {
            $.messager.progress('close');
            $('#wdialog').val(rowData.name);
        },
        buttons: [
            /*{text: '关闭',
            iconCls: 'icon-ok',
            handler: function () {

                $.messager.progress({ text: '系统正在处理' });

                var paramesTempVis = { 'school_name': $('#AleInputSchoolName').val(), 'school_id': rowData.school_id };

               $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: Webversion + "/school?_method=PUT" ,
                    data: paramesTempVis,
                    success: function (result) {
                        $.messager.progress('close');
                        $('#SeltSchoolName').dialog('close');
                        $.remind('校区名称修改成功！');
                        var pager = $('#Educational_Set').datagrid("getPager");
                        pager.pagination("select");
                    }, error: function (result) {
                        $.messager.progress('close');
                        $.error('系统出现异常，校区名称修改失败！');
                    }
                });

            }
        },*/
        {
            text: '关闭',
            iconCls: 'icon-ok',
            handler: function () {
                $('#test_Statistics').dialog('close');
            }
        }]
    });

    $('#test_Statistics').dialog('open');

}

//修改班级信息
function editClass(value, index) {
	$('#EditClass').css('display','block');
    $.messager.progress({text:'正在获取教学备注信息'});
    // 获取校区相关数据
    var rowData = ($('#bigClass').datagrid('getData').rows)[index];

    $("#EditClass").dialog({
        iconCls: 'icon-save',
        title: '查看教学备注',
        width: 600,
        height: 350,
        closed: true,
        cache: false,
        modal: true,
        onOpen: function () {
            $.messager.progress('close');
			$('#schoolName').val('一中001校区');
			$('#schoolAddrP').combobox('setValue',1); 
			$('#schoolAddrC').combobox('setValue',2); 
			$('#schoolAddrDetail').val('详细地址');
			$('#schoolPrincipal').combobox('setValue',3);
			
            //$('#wdialog').val(rowData.name);
        },
        buttons: [{
            text: '修改',
            iconCls: 'icon-edit',
            handler: function () {

                $.messager.progress({ text: '系统正在处理' });

                var paramesTempVis = { 'school_name': $('#AleInputSchoolName').val(), 'school_id': rowData.school_id };

                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: Webversion + "/school?_method=PUT" ,
                    data: paramesTempVis,
                    success: function (result) {
                        $.messager.progress('close');
                        $('#AleSchoolName').dialog('close');
                        $.remind('校区名称修改成功！');
                        var pager = $('#schoolmanager').datagrid("getPager");
                        pager.pagination("select");
                    }, error: function (result) {
                        $.messager.progress('close');
                        $.error('系统出现异常，校区名称修改失败！');
                    }
                });

            }
        },
        {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#EditClass').dialog('close');
            }
        }]
    });

    $('#EditClass').dialog('open');

}


//修改班级信息
function changeClass(value, index) {
	$('#changeClass').css('display','block');
    $.messager.progress({text:'正在获取教学备注信息'});
    // 获取校区相关数据
    var rowData = ($('#bigClass').datagrid('getData').rows)[index];

    $("#changeClass").dialog({
        iconCls: 'icon-save',
        title: '查看教学备注',
        width: 500,
        height: 350,
        closed: true,
        cache: false,
        modal: true,
        onOpen: function () {
            $.messager.progress('close');
			$('#schoolName').val('一中001校区');
			$('#schoolAddrP').combobox('setValue',1); 
			$('#schoolAddrC').combobox('setValue',2); 
			$('#schoolAddrDetail').val('详细地址');
			$('#schoolPrincipal').combobox('setValue',3);
			
            //$('#wdialog').val(rowData.name);
        },
        buttons: [{
            text: '保存',
            iconCls: 'icon-edit',
            handler: function () {

                $.messager.progress({ text: '系统正在处理' });

                var paramesTempVis = { 'school_name': $('#AleInputSchoolName').val(), 'school_id': rowData.school_id };

                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: Webversion + "/school?_method=PUT" ,
                    data: paramesTempVis,
                    success: function (result) {
                        $.messager.progress('close');
                        $('#AleSchoolName').dialog('close');
                        $.remind('校区名称修改成功！');
                        var pager = $('#schoolmanager').datagrid("getPager");
                        pager.pagination("select");
                    }, error: function (result) {
                        $.messager.progress('close');
                        $.error('系统出现异常，校区名称修改失败！');
                    }
                });

            }
        },
        {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#changeClass').dialog('close');
            }
        }]
    });

    $('#changeClass').dialog('open');

}





//修改学生信息
function editStudent(value, index) {
    var rowData = ($('#bigClass').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "editStudent.html?data="+rowData;
}
//查看学生测评
function selSrudentCorrects(value, index) {
    var rowData = ($('#bigClass').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "selSrudentCorrects.html?data="+rowData;
}

//查看班级学科报告
function selSubjectInfo(value, index) {
    var rowData = ($('#bigClass').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "subjectinfo.html?data="+rowData;
}

//查看历史学习报告
function histroyStudys(value, index){
	var rowData = ($('#bigClass').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "histroystudys.html?data="+rowData;
}


function teaching_Assign(value, index,typeid){
	//var rowData = ($('#bigClass').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "teaching_Assign.html?typeid="+typeid;
}

//报班管理
function subClass (value, index,typeid){
	//var rowData = ($('#bigClass').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "subClassManage.html?typeid="+typeid;
}

