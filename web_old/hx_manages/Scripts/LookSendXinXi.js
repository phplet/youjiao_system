
var QuestionInput = { s: "StudentAnswer", a: "CorrectAnswer", c: "QuestionCheck", f: "StudentFraction", m: "TCountSorce", l: "0" };
var assign_type = 2;
$(document).ready(function ()
{
    $('#PapersInformation').datagrid({//绑定试卷
        fit: true,
        remoteSort: false,
        toolbar: '#SerToolBar',
		
        rownumbers: true,
        singleSelect: true,
		
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...',
        columns: [[
            { field: 'name', title: '试卷标题', width: 130, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                    return '<a href="#" onclick="TestHistory(\'' + row["id"] + '\',\'' + row.name + '\')" style="color:blue;">' + row.name + '</a>';
                }
            },
           
            { field: 'exer_type', title: '适用年级', width: 70, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    if (value == 1) {
                        return "测试";
                    }  else  {
                        return "作业";
                    }
                }
            },
			{ field: 'field', title: '学科', width: 80, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    if (value == 1)  {
                        return "同步";
                    }  else {
                        return "专题";
                    }

                }
            },
            { field: 'tmod', title: '组卷类型', width: 100, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                    if (value == 0) {
                        return "智能组卷";
                    } else {
                        return "手动挑题";
                    }
                }
            },
			 { field: 'creat_date', title: '组卷时间', width: 130, sortable: true, align: 'center' }
		
			
        ]],
       
    }); 
	
	

    $.ajax({   //获取左边试卷列表
        url: Webversion + '/exam/list', //url访问地址
        type: "GET",
        dataType: "json",
        success: function (result) {
			if (!(result.exam==null)){
			 $('#PapersInformation').datagrid("loadData", result.exam);
			}
        }
    });

  
   

   
   
   $('#DeliveryRecord').datagrid({//绑定试卷
        fit: true,
        remoteSort: false,
        toolbar: '#SerToolBar',
		pagination: true,
        rownumbers: true,
        singleSelect: true,
		pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...',
        columns: [[
            { field: 'creat_date', title: '组卷时间', width: 130, sortable: true, align: 'center' },
           
            { field: 'exer_type', title: '派送班级/学生', width: 200, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    if (value == 1) {
                        return "测试";
                    }  else  {
                        return "作业";
                    }
                }
            }
        ]],
    }); 
	
	

    $.ajax({   //获取左边试卷列表
        url: Webversion + '/exam/list', //url访问地址
        type: "GET",
        dataType: "json",
        success: function (result) {
			if (!(result.exam==null)){
			 $('#DeliveryRecord').datagrid("loadData", result.exam);
			}
        }
    });

   
   
  
 
});  /////////////////////////////////////////////////////////////////////////////////////.ready的结束标签







 function AReturnPaper(){
	document.location.href = "CePingSend.html";
 }

 
