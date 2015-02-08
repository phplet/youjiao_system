
var QuestionInput = { s: "StudentAnswer", a: "CorrectAnswer", c: "QuestionCheck", f: "StudentFraction", m: "TCountSorce", l: "0" };
var assign_type = 2;
 
var UserInfo = null;
var centerAll = null;
var pager = "";
var tempcolumns ="";
$().ready(function (){
	window.parent.tree_select('试卷列表');
	var  tabs_name = $('.tabs-title', window.parent.document);	  //获得iframe父页面的节点内容
	  if((tabs_name.html())!="试卷中心"){
	  	tabs_name.html('试卷中心');   //赋值
		// $('document').KeyInput($("#SchoolText"), '请输入姓名');
	  }
 	UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
	centerAll = $.evalJSON($.cookie("centerAll")); //取得登录人信息
	var UserLevel = parseInt(UserInfo.level);  //登录人的权限
	
	$('.fav_show').hide();
	$('.fav_hidden').show();
	tempcolumns = [[
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
					var typedbn = row.typedb==1?'平台题库':'自建题库';
                    if (value == 1)  {return "同步题库<br />("+typedbn+")";}  else if(value==2){return "专题题库<br />("+typedbn+")";}else {return "历年真题<br />("+typedbn+")";}
                }
            },
            { field: 'tmod', title: '组卷类型', width: 80, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                    if (value == 0) { return "智能组卷";} else {return "手动挑题";}
                }
            },
			{ field: 'creat_date', title: '组卷时间', width: 80, sortable: true, align: 'center'},
			{ field: 'content', title: 'content', width: 130, hidden: true, align: 'center'},
			{ field: 'type', title: 'type', width: 130, hidden: true, align: 'center'},
			{ field: 'typedb', title: 'typedb', width: 130, hidden: true, align: 'center'},
			{ field: 'difficulty', title: 'difficulty', width: 130, hidden: true, align: 'center'},
			{ field: 'fav_count', title: 'fav_count', width: 130, hidden: true, align: 'center'},
			{ field: 'favorited', title: 'favorited', width: 130, hidden: true, align: 'center'},
			{ field: 'fav_id', title: 'fav_id', width: 130, hidden: true, align: 'center'},
			{ field: 'conditions', title: 'conditions', width: 130, hidden: true, align: 'center'},
			{ field: 'test_analysis', title: '试题统计分析', width: 180, align: 'left'},
			
			{ field: 'id', title: '操作', width: 180, sortable: true, align: 'center', //是判断再次发送
			    formatter: function (value, row, index) {
						if(row.exer_type!=6){
							if(row.type==0){
								return '<a href="javascript:void(0)" onclick="preView(' + index + ')" style="color:blue;"> 预览</a>&nbsp;<a  href="javascript:void(0)"  onclick="CePingSend('+index+',0)">测评派送</a>&nbsp;<a  href="javascript:void(0)"  onclick=\"ChongZu('+value+','+index+');\" >重组</a>&nbsp;<a href="javascript:void(0)"  onclick="create_word(' + row.id + ','+index+')">下载</a>';  
							}else{
								return '<a href="javascript:void(0)" onclick="preView(' + index + ')" style="color:blue;"> 预览</a>&nbsp;<a  href="javascript:void(0)"  onclick="CePingSend('+index+',1)">测评派送</a>&nbsp;<a href="javascript:void(0)"   onclick="create_word(' + row.id + ','+index+')">下载</a>';  
							}
						}else{
							if(row.type==0){
								return '<a href="javascript:void(0)" onclick="preView(' + index + ')" style="color:blue;"> 预览</a>&nbsp;<font color="#ccc">测评派送</font>&nbsp;<a  href="javascript:void(0)"  onclick=\"ChongZu('+value+','+index+');\" >重组</a>&nbsp;<a href="javascript:void(0)"  onclick="create_word(' + row.id + ','+index+')">下载</a>';  
							}else{
								return '<a href="javascript:void(0)" onclick="preView(' + index + ')" style="color:blue;"> 预览</a>&nbsp;<font color="#ccc" >测评派送</font>&nbsp;<a href="javascript:void(0)"   onclick="create_word(' + row.id + ','+index+')">下载</a>';  
							}
							 
						}
			    }
			},
			{ field: 'status', title: '收藏', width: 80, sortable: true, align: 'center',
				 formatter: function (value, row, index) {
					 if(row.type==0){
						return '<a href="javascript:void(0)" onclick="add_Enshrine(' + index + ')" style="color:blue;">收藏</a>';  
					 }else{
						 return '<a href="javascript:void(0)" onclick="reset_Enshrine(' + index + ')">取消</a>';  
					 }
			    }}
        ]];
	 
	
	var url = 'Webversion + "/examination_paper?pageno="+pageNumber+"&countperpage="+pageSize';
	var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val(); 
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
	
	
	
	
	//绑定时间查询
	$('#SeTimeRange').combobox({
		onSelect:function(record){
			if(record.value!='请选择'&&record.value!=""){
				var dataccs = {'action':'list','time':record.value,'center_id':centerAll.center_id,'zone_id':select_zoneid};
				pager = datagridLoad('#PapersInformation',true,'#SerToolBar',tempcolumns,url,"GET","json",dataccs,functionres) ;
			} 
		}
		
	});
	
	
	//绑定收藏列表
	$('#histrory').click(function(){
		$('.fav_hidden').hide();
		$('.fav_show').show();
		enshrine_List();//加载收藏列表
		
	});
	
	//返回试卷列表
	$('#backlist').click(function(){
		window.location = "GroupRollCenter.html";
		
	});
  
 
});  /////////////////////////////////////////////////////////////////////////////////////.ready的结束标签

// 查看试卷列表
function Longding(result){
	if (result.list != null) {
		var datalistTemp = [];
		$.each(result.list, function (i, n) {
			var itemtemp = {};
			        
			itemtemp.name = n.name;          //TeacherBigStu  TeacherOneStu
			itemtemp.exer_type = n.exam_type;
			itemtemp.grade_id = n.grade;
			itemtemp.subject_id = n.subject_id; 
			//alert(n.conditions);
			itemtemp.field =  $.parseJSON(n.conditions).data_test.tab_Sid;
			itemtemp.typedb = $.parseJSON(n.conditions).data_test.tiku_type;
			itemtemp.tmod = n.build_type;
			itemtemp.creat_date = n.create_date;
			itemtemp.id = n.id;
			itemtemp.fav_count = n.fav_count;
			itemtemp.favorited = n.favorited;
			itemtemp.test_analysis = '<div>已交 '+(parseInt(n.stat_analyse.assign_student_count)-parseInt(n.stat_analyse.unsubmit_num))+' | 未交'+n.stat_analyse.unsubmit_num+'人<br />得分率100% '+n.stat_analyse.score_percent_100+'人<br />得分率85%以上 '+n.stat_analyse.score_percent_85_over+'人<br />得分率70%以上 '+n.stat_analyse.score_percent_70_over+'人<br />得分率60%以上 '+n.stat_analyse.score_percent_60_over+'人<br />得分率60%以下 '+n.stat_analyse.score_percent_60_below+'人</div>';
			itemtemp.status = n.status;
			itemtemp.content = n.content;
			itemtemp.type = 0;
			
			itemtemp.difficulty = n.difficulty;
			itemtemp.conditions = n.conditions;
			datalistTemp.push(itemtemp);
		});
		   
    }
	return datalistTemp;   
  }

 function ChongZu(value,index){
    var rowData = ($('#PapersInformation').datagrid('getData').rows)[index];
 	var temp_row = $.parseJSON(rowData.conditions).data_test;
	temp_row['testname']=rowData.name;
	 var temp_rowccc = $.parseJSON(rowData.conditions);
	 temp_rowccc['data_test'] = temp_row;
	  
	if( rowData.tmod == 0){
		window.top.string_data = {'data_test':Base64.encode(JSON.stringify(temp_row)),'stup_2_data':$.parseJSON(rowData.conditions).queTwo,'stup_3_data':$.parseJSON(rowData.conditions).queThree,'data_content':Base64.encode(rowData.content)};
		document.location.href = "ZhiNengPager.html?test_id="+rowData.id+"&data_test=zhineng";
	}
	else{
		window.top.string_data = {'data_content':Base64.encode(rowData.content),'data_conditions':Base64.encode(JSON.stringify(temp_rowccc))};
		document.location.href = "ShouDoPaperSort.html?test_id="+rowData.id+"&data_test=shoudong";
	}
	//document.location.href = "TestPaper.html";
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


function create_word(tId,index){
	
	$.messager.confirm('温馨提示','<div id="word_typecheck">请选择生成格式：<input type="radio" name="word_type" value="2" checked="checked" />学生版&nbsp;<input type="radio" name="word_type" value="1" />教师版</div>',function(b){
		if(b){
			var rowData = ($('#PapersInformation').datagrid('getData').rows)[index];
			var datajsondd = {'action':'create_word','content':rowData.content,'ti_id':tId};
			var checked_wordtype = $('#word_typecheck input[type="radio"]:checked').val();
			if(checked_wordtype==1){
				datajsondd['with_answer'] = checked_wordtype;
			}
			$.ajax({
				url: Webversion + '/examination_paper', //url访问地址
				type: "POST",
				data: datajsondd,
				dataType: "json",
				success: function (result){
					 $.messager.alert('温馨提示','<div style="padding-top:10px;">试卷已经生成,请点击下载：<a href="'+result.url+'">WORD下载</a></div>','info');
					 $('.messager-window .messager-button .l-btn-left').html('关闭');
				}
			});	
		}
	});
	
	
}

//收藏试卷
function add_Enshrine(indexs){
	var rowData = ($('#PapersInformation').datagrid('getData').rows)[indexs];	
	var url_type = '/favorite';
	var Enshrinejson = {'action':'add_fav','exam_id':rowData.id,'user_id':UserInfo.id};
	var res = Ajax_option(url_type,Enshrinejson,"POST");
	if(res.flag1){
		$.messager.alert('温馨提示','收藏成功！','info');
		pager.pagination("select",1);
	}else if(res.flag2){
		$.messager.alert('温馨提示','已经收藏！','info');
	}else {
		$.messager.alert('温馨提示','收藏失败！','info');	
	}
	
}

//取消收藏试卷
function reset_Enshrine(indexs){
	var rowData = ($('#PapersInformation').datagrid('getData').rows)[indexs];	
	var url_type = '/favorite';
	var Enshrinejson = {'action':'cancel_fav','exam_id':rowData.id,'user_id':UserInfo.id};
	var res = Ajax_option(url_type,Enshrinejson,"GET");
	if(res.flag){
		$.messager.alert('温馨提示','取消收藏成功！','info');
		pager.pagination("select",1);
	}else{
		$.messager.alert('温馨提示','收藏失败！','info');	
	}
	 
}

//查看收藏列表

function enshrine_List(){
	
	var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val();
	var url_enshrine = 'Webversion + "/favorite?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc_enshrine = {'action':'fav_list','center_id':centerAll.center_id,'zone_id':select_zoneid,'user_id':UserInfo.id};
	var functionres_enshrine = 'enshrine_Listing(result);';
		
	//加载列表  并且返回pager
    pager = datagridLoad('#PapersInformation',true,'#SerToolBar',tempcolumns,url_enshrine,"GET","json",datacc_enshrine,functionres_enshrine) ;
}

// 查看试卷列表
function enshrine_Listing(result){
	if (result.list != null) {
		var datalistTemp = [];
		$.each(result.list, function (i, n) {
			var itemtemp = {};
			itemtemp.name = n.name;          //TeacherBigStu  TeacherOneStu
			itemtemp.exer_type = n.exam_type;
			itemtemp.grade_id = n.grade;
			itemtemp.subject_id = n.subject_id; 
			itemtemp.field =  $.parseJSON(n.conditions).data_test.tab_Sid;
			itemtemp.typedb = $.parseJSON(n.conditions).data_test.testtype;
			 
			itemtemp.tmod = n.build_type;
			itemtemp.creat_date = n.fav_date;
			itemtemp.id = n.ref_id;
			itemtemp.test_analysis = '<div>已交 '+(parseInt(n.stat_analyse.assign_student_count)-parseInt(n.stat_analyse.unsubmit_num))+' | 未交'+n.stat_analyse.unsubmit_num+'人<br />得分率100% '+n.stat_analyse.score_percent_100+'人<br />得分率85%以上 '+n.stat_analyse.score_percent_85_over+'人<br />得分率70%以上 '+n.stat_analyse.score_percent_70_over+'人<br />得分率60%以上 '+n.stat_analyse.score_percent_60_over+'人<br />得分率60%以下 '+n.stat_analyse.score_percent_60_below+'人</div>';
			itemtemp.fav_id = n.id;
			itemtemp.status = n.status;
			itemtemp.type = 1;
			itemtemp.content = n.content;
			itemtemp.difficulty = n.difficulty;
			itemtemp.conditions = n.conditions;
			datalistTemp.push(itemtemp);
		});
		   
    }
	return datalistTemp;   
  }

//预览试卷
function preView(index){
	var rowData = ($('#PapersInformation').datagrid('getData').rows)[index];
	window.top.string_data = {'rowdata':Base64.encode(JSON.stringify(rowData))};
	window.location = "../TestCenter/Testpreview.html?rowdata=stringdata";
	
}
//测评派送
 function CePingSend(row_id,type_fav){
	var rowData = ($('#PapersInformation').datagrid('getData').rows)[row_id];
	rowData['type_fav'] = type_fav;
	window.top.string_data = {'rowdata':Base64.encode(JSON.stringify(rowData))};
	window.location = "../SendCenter/SendStuStart.html?rowdata=stringdata&type=GR";
 }

