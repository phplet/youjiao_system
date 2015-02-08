var QuestionInput = { s: "StudentAnswer", a: "CorrectAnswer", c: "QuestionCheck", f: "StudentFraction", m: "TCountSorce", l: "0" };
var pager =null;
var Test =null;
var assign_type = 2;
var fillExamID="";
var UserInfo = null;
UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
var UserLevel = parseInt(UserInfo.level);  //登录人的权限

$(document).ready(function ()
{
	$('#PapersInformation').datagrid({//绑定试卷
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
			{ field: 'field', title: '形式', width: 80, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    if (value == 1)  {
                        return "测评";
                    }  else {
                        return "作业";
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
			{ field: 'dwqejo', title: '派送班级/学生', width: 120, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                   
                        return "<label style=\" line-height:30px;\">A班 B班</label></br><a href=\"#\" style=\" line-height:30px;\"   onclick=\"ALookSend()\" >查看派送情况</a>";
                }
            },
			{ field: 'werwer', title: '测评/作业的试题统计分析', width: 260, sortable: true, align: 'center', 
			    formatter: function (value, row, index) {	
						return '<label style=\" line-height:20px;\">参与人数25人</label></br><label style=\" line-height:25px;\">得分率100%  3人</label>   <label style=\" line-height:25px;\">得分率85%以上 8人</label></br><label style=\" line-height:25px;\">得分率70%以上  3人</label>   <label style=\" line-height:25px;\">得分率60%以上 20人</label></br><label style=\" line-height:25px;\">得分率60%以下  10人</label>';        
			    }
			},{ field: 'adw', title: '操作', width: 250, sortable: true, align: 'center', //是判断再次发送
			    formatter: function (value, row, index) {
						return '<a href="#" onclick="TestHistory(\'' + row["id"] + '\',\'' + row.name + '\')" style="color:blue;">查看统计分析</a> &nbsp;  <a  href=\"#\"  onclick=\"CePingSend();\" >查看派送情况</a>&nbsp;  <a  href=\"#\"  onclick=\"CePingPaiSong();\" >派送</a>';
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
			 $('#PapersInformation').datagrid("loadData", result.exam);
			}
        }
    });

  
   

  
 
});  /////////////////////////////////////////////////////////////////////////////////////.ready的结束标签





function TestHistory(paperID, name)
{
	alert(paperID);
    //alert(paperID+"----"+name);
    //alert(row["id"]);
    //$("#subjectsUL li").remove();
    //bindDatasource(null);//给弹出框绑定数据
    $('#divHistory').dialog('open');
	
    $.ajax({  //ajax连接查询学生姓名
        url: Webversion + '/exam', //url访问地址
        type: "GET",
        dataType: "json",
        data: {
            exercise_id: paperID
        },
        success: function (result)
        {
			alert(paperID);
            $("#lblPaperName").html("<b>" + name + "</b>");
            $("#subjectsUL").html("");
			alert(11);
			alert(result.question);
            var question = $.evalJSON(Base64.decode(result.question));
			alert(question);
            var content = "";
            $.each(question, function (i, n)
            {
                content += (i + 1) + ".";
                content += n.content;
                content += "</b><br>";
            });
            //alert(content);
            // $('#subjectsUL').datagrid('loadData', { total: 0, rows: [] });

            $("#subjectsUL").append(content);
        }
    });

}


//点击搜索取得数据
function search()
{
    $.ajax({
        url: Webversion + '/class/list', //url访问地址
        type: "GET",
        data: {
            Type: $("#selectType").combobox('getValue'), //类型
            Content: $("#txtContent").val()//内容
        },
        dataType: "json",
        success: function (result)
        {

            if (result == null || result == null)
            {
                result = {};
                result = [];
            }
            bindDatasourceDeatil(result);
        }
    });
}



 
 
 
 function ANext(){
	document.location.href = "SendStuStart.html";
 }
 
 
 function CePingSend(){
	document.location.href = "LookSendXinXi.html";
 }
 
