 
$().ready(function() {
      UserInfo = $.evalJSON($.cookie("UserInfo"));
     
	  window.parent.tree_select('学生测评统计');
	  $('#teacher_Corrects').datagrid({   
        fit: true,
        remoteSort: false,
        toolbar: '#SerToolBar',
        pagination: true,
        rownumbers: true,
		singleSelect: true,
		title:"&nbsp;学务报表&nbsp;>>&nbsp;学生测试(作业)统计&nbsp;>>&nbsp;学生统计明细",
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...', 
        /*onClickRow: function (rowIndex, rowData) {
            $('#Educational_Set').datagrid("unselectRow", rowIndex);
        },*/
		
        columns: [[
		    { field: 'subject', title: '派送时间', width: 80, align: 'center', sortable: true },
			{ field: 'teacherName', title: '测试/作业标题', width: 100, align: 'center'},
			{ field: 'mouth', title: '学科/课程', width: 80, align: 'center' },
			{ field: 'bigSum', title: '习作时间', width: 80, align: 'center', sortable: true },
			{ field: 'oneSum', title: '得分率(%)', width: 80, align: 'center', sortable: true  ,
                formatter: function (value, row, index) {
                    var html = '';
					 
                    if(parseInt(value)==0){
						 html = '--';
					}else{
						html = value;
					}
					
                    return html;
                }
			},
			{ field: 'testSum', title: '状态', width: 70, align: 'center' },
			 
			{ field: 'id', title: '操作', width: 65, align: 'center',
				formatter: function (value, row, index) {
                    var s = "<a href=\"#\" style='color:blue;' >查看</a>";
                    return s;
                }
			
			}  
        ]]
    });
	
	
	
    var pager = $('#teacher_Corrects').datagrid("getPager");
    pager.pagination({
        onSelectPage: function (pageNumber, pageSize){
            $(this).pagination('loading');
            var ltemp = (pageNumber - 1) * pageSize;
            LoadSchool(ltemp, pageSize);
            $(this).pagination('loaded');
        }
    });

    pager.pagination("select", 1);
    

    // 绑定搜索事件
    $("#BtnSearch").click(function () {

        if ($("#SchoolText").attr("innt") == "1") {
            $.messager.alert('温馨提示', '请输入姓名再搜索！', 'info');
            return;
        }

        $.messager.progress({ text: '正在搜索校区信息' });

        $('#BtnSearch').datagrid("getPager").pagination("select", 1);

        $.messager.progress('close');

    });
     
    
});


//加载列表俺分页的形式显示
function LoadSchool(s,l) {

    /*var url = Webversion + "/school/list/" + s + "," + l + "/uplevel_id/" + UserInfo.school_id ;
    var params = {};
    if ($("#SchoolText").attr("innt") != "1") {
        url = Webversion + "/school/list/" + s + "," + l + "/name" ;
        params.key = $.trim($("#SchoolText").val());
    }*/

   // params['r'] = $.getRom();

    // 加载数据列表
    $.ajax({
        url: '../data/teacher_Corrects.json',
        type: "GET",
        dataType: "json",
        //data: params,
        success: function (result) {
			 
            var datalistTemp = [];
			if(result!=null){
				 
            	$.each(result.schools,function(i,n){
						var itemtemp = {};
                        
                        itemtemp.subject = n.subject;
						itemtemp.teacherName = n.teacherName;
						itemtemp.mouth = n.mouth;
						itemtemp.bigSum = n.bigSum;
						itemtemp.oneSum = n.oneSum;
						itemtemp.testSum = n.testSum;
						itemtemp.sendSum = n.sendSum;
						itemtemp.updateSum = n.updateSum;
						itemtemp.subSum = n.subSum;
                         
                         
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

            $('#teacher_Corrects').datagrid("loadData", datalistTemp);
        },
        error: function (result) {

        }
    });

}