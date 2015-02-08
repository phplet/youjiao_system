
var QuestionInput = { s: "StudentAnswer", a: "CorrectAnswer", c: "QuestionCheck", f: "StudentFraction", m: "TCountSorce", l: "0" };
var assign_type = 2;
 
var UserInfo = null;
var centerAll = null;
var pager = "";
var datas = {};
var grade_s = [];
$().ready(function (){
 	UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
	centerAll = $.evalJSON($.cookie("centerAll")); //取得登录人信息
	var UserLevel = parseInt(UserInfo.level);  //登录人的权限
	datas = $.parseJSON(Base64.decode(getUrlParam("data")));
	
	var tempcolumns = [[
            { field: 'name', title: '试卷标题', width: 130, sortable: true, align: 'center'//,
               /*  formatter: function (value, row, index) {
                    return '<a href="#" onclick="TestHistory(\'' + row["id"] + '\',\'' + row.name + '\')" style="color:blue;">' + row.name + '</a>';
                } */
            },
			{ field: 'grade_id', title: '适用年级', width: 70, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    return edu_grade(parseInt(value));
				}
            },
			{ field: 'subject_id', title: '学科', width: 40, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    return subject_sum(parseInt(value));
				}
            },
            { field: 'exer_type', title: '形式', width: 40, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    if (value == 1) {return "测试";} else if (value == 6){return "入学测试";}else {return "作业";}
				}
            },
			{ field: 'field', title: '组卷范围', width: 80, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    if (value == 1)  {return "同步题库";}  else if(value==2){return "专题题库";}else {return "历年真题";}
                }
            },
            { field: 'tmod', title: '组卷类型', width: 80, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                    if (value == 0) { return "智能组卷";} else {return "手动挑题";}
                }
            },
			{ field: 'creat_date', title: '组卷时间', width: 80, sortable: true, align: 'center'},
			{ field: 'test_analysis', title: '试题统计分析', width: 180, align: 'left'},
			{ field: 'content', title: 'content', width: 130, hidden: true, align: 'center'},
			{ field: 'conditions', title: 'conditions', width: 130, hidden: true, align: 'center'},
			{ field: 'id', title: '操作', width: 180,  align: 'center', //是判断再次发送
			    formatter: function (value, row, index) {
					//<a  href=\"#\"  onclick=\"analysis('+value+','+index+');\" >统计分析</a><a href="#" onclick="LookSend(' + index + ')" style="color:blue;">派送情况</a>&nbsp;&nbsp;
						if(row.exer_type!=6){
							return '<a  href=\"#\"  onclick="CePingSend('+index+')">选定派送</a>';  
						}else{
							return '<font color="#ccc">选定派送</font>';  
						}
				}
			} 
        ]];
	 
	var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val();
	var url = 'Webversion + "/examination_paper?pageno="+pageNumber+"&countperpage="+pageSize';
	 
	var datacc = {'action':'list','center_id':centerAll.center_id,'zone_id':select_zoneid};
	var functionres = 'Longding(result);';
		
	//加载列表  并且返回pager
    pager = datagridLoad('#PapersInformation',true,'#SerToolBar',tempcolumns,url,"GET","json",datacc,functionres) ;


	    // 绑定搜索按钮
    $('#BtnSearch').click(function () {
		var textsear = $('#txtClassName').val();
		if(textsear!='输入试卷名称'&&textsear!=null&&textsear!=""){
			var dataccs = {'action':'list','search':textsear,'center_id':centerAll.center_id,'zone_id':select_zoneid};
			pager = datagridLoad('#PapersInformation',true,'#SerToolBar',tempcolumns,url,"GET","json",dataccs,functionres) ;
		}
    });
	
	var grade_box = [];
		$.each($.unique(grade_s),function(i_g,n_g){
			grade_box.push({'id':n_g,'Name':edu_grade(parseInt(n_g))});
		});
		 
	
	//绑定年级查询
	$('#grades_id').combobox({
		data:$.merge([{'id':'请选择','Name':'请选择'}],grade_box),
		valueField:'id',
		textField:'Name',
		onSelect:function(record){
			if(record.id!='请选择'&&record.id!=""){
				var dataccs = {'action':'list','grade_id':record.id,'center_id':centerAll.center_id,'zone_id':select_zoneid};
				pager = datagridLoad('#PapersInformation',true,'#SerToolBar',tempcolumns,url,"GET","json",dataccs,functionres) ;
			} 
		}
		
	});
	
	//绑定时间查询
	$('#SeTimeRange').combobox({
		onSelect:function(record){
			if(record.value!='请选择'&&record.value!=""){
				var dataccs = {'action':'list','time':record.value,'center_id':centerAll.center_id,'zone_id':select_zoneid};
				pager = datagridLoad('#PapersInformation',true,'#SerToolBar',tempcolumns,url,"GET","json",dataccs,functionres) ;
			} 
		}
		
	});
	
  
 
});  /////////////////////////////////////////////////////////////////////////////////////.ready的结束标签

// 查看试卷列表
function Longding(result){
	if (result.list != null) {
		var datalistTemp = [];
		$.each(result.list, function (i, n) {
			var itemtemp = {};
			 grade_s = [];
		 
			$.each(result.grade_list,function(ii,nn){
				grade_s.push(nn.grade);
			});       
			itemtemp.name = n.name;          //TeacherBigStu  TeacherOneStu
			itemtemp.exer_type = n.exam_type;
			itemtemp.grade_id = n.grade;
			itemtemp.subject_id = n.subject_id; 
			itemtemp.field = $.parseJSON(n.conditions).data_test.tab_Sid;
			itemtemp.tmod = n.build_type;
			itemtemp.creat_date = n.create_date;
			itemtemp.test_analysis = '<div>已交 '+(parseInt(n.stat_analyse.assign_student_count)-parseInt(n.stat_analyse.unsubmit_num))+' | 未交'+n.stat_analyse.unsubmit_num+'人<br />得分率100% '+n.stat_analyse.score_percent_100+'人<br />得分率85%以上 '+n.stat_analyse.score_percent_85_over+'人<br />得分率70%以上 '+n.stat_analyse.score_percent_70_over+'人<br />得分率60%以上 '+n.stat_analyse.score_percent_60_over+'人<br />得分率60%以下 '+n.stat_analyse.score_percent_60_below+'人</div>';
			itemtemp.id = n.id;
			itemtemp.status = n.status;
			itemtemp.content = n.content;
			itemtemp.conditions = n.conditions;
			datalistTemp.push(itemtemp);
		});
		   
    }
	return datalistTemp;   
  }



//统计分析
function analysis(value,index){
  
}
 


function TestHistory(paperID, name)
{
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

            $("#lblPaperName").html("<b>" + name + "</b>");
            $("#subjectsUL").html("");
            var question = $.evalJSON(Base64.decode(result.question));

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

 

function create_word(tId,conTent){
	$.ajax({
        url: Webversion + '/examination_paper', //url访问地址
        type: "POST",
        data: {'action':'create_word','content':conTent,'ti_id':tId},
        dataType: "json",
        success: function (result)
        {
			
            
        }
    });
	
}

//查看试卷的派送详情
function LookSend(index){
	 
	var openfunctions = "openfunction("+index+");";
	$('#SendInfo').show(); 
	alertSel("#SendInfo",'派送情况',550,350,openfunctions,'关闭');
    $('#SendInfo').dialog('open');
	//window.location = "../TestCenter/Testpreview.html?rowdata="+Base64.encode(JSON.stringify(rowData));
	
}
//{"name":"自动组卷04-作业","exer_type":"1","grade_id":"21","subject_id":"1","field":"2","tmod":"1","creat_date":"2013-08-15","id":"466","status":"1","content":"[{"dbtype":"1","ids":["dbj10000013","dbj10000017","dbj10000023"]},{"dbtype":"2"}]","conditions":"{"data_test":{"testname":"u81eau52a8u7ec4u537704-u4f5cu4e1a","testtype":"1","subject_id":"1","section_id":"19","grade_id":"21","tiku_type":"1","curriculumndb":{"ip":"null","name":"null"},"tab_Sid":"2","special":["18102","18103","18104"]},"queTwo":"","queThree":"W3sidHlwZW5hbWUiOiLlhbblroMiLCJzb3JjZVAiOiIzNSIsInN1bSI6IjMiLCJzb3JjZXMiOjEwNSwiaWRzIjpbeyJpZCI6ImRiajEwMDAwMDEzIiwiZGJ0eXBlIjoiMSJ9LHsiaWQiOiJkYmoxMDAwMDAxNyIsImRidHlwZSI6IjEifSx7ImlkIjoiZGJqMTAwMDAwMjMiLCJkYnR5cGUiOiIxIn1dfV0=","objective_score":"0","subjective_score":"105","score":"105"}"}
function openfunction(index){
	//datas = $.parseJSON(datas);
	var datas = ($('#PapersInformation').datagrid('getData').rows)[index];
	var tmods = "";
	if(datas.tmod==1){tmods = "手动组卷";}else{tmods = "自动组卷";}
	$('#text_info').html('<td >'+datas.name+'</td><td>'+edu_grade(parseInt(datas.grade_id))+'</td><td>'+subject_sum(parseInt(datas.subject_id))+'</td><td>'+tmods+'</td><td>'+datas.creat_date+'</td>');
	var sendInfos = '<tr bgcolor="#fafafa"><td align="center" width="100">派送时间</td><td align="center">派送班级/学生</td></tr><tr><td align="center">2012-01-12</td><td colspan="4" align="left">语文数学班</td></tr>';
	$('#test_sendNames').html(sendInfos);
	
} 

 function CePingSend(row_id){
	var rowData = ($('#PapersInformation').datagrid('getData').rows)[row_id];
	  
	window.location = "../SendCenter/SendLastStep.html?data_T="+Base64.encode(JSON.stringify(datas))+"&rowdata="+Base64.encode(JSON.stringify(rowData));
 }

