
var QuestionInput = { s: "StudentAnswer", a: "CorrectAnswer", c: "QuestionCheck", f: "StudentFraction", m: "TCountSorce", l: "0" };
var assign_type = 2;
 
var UserInfo = null;
var centerAll = null;
var pager = "";
var tempcolumns ="";
$().ready(function (){
	
 	UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
	centerAll = $.evalJSON($.cookie("centerAll")); //取得登录人信息
	if(UserInfo.level==5){
		$('#lever_5_1').show();
		$('#lever_5_2').show();
	}else if(UserInfo.level==2){
		$('#lever_5_1').hide();
		$('#lever_5_2').hide();
	}
	
	var tempcolumns = [[   
   			{ field: 'test_time', title: '测试时间', width: 100, sortable: true, align: 'center'}, 
			{ field: 'stu_name', title: '学生姓名', width: 80, sortable: true, align: 'left'},
			{ field: 'stu_username', title: '用户名', width: 120, sortable: true, align: 'left'},
			{ field: 'stu_sex', title: '性别', width: 40, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    return value==1?'男':'女';
				} },
			{ field: 'grade', title: '年级', width: 60, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    return edu_grade(parseInt(value));
				} 
            },
            { field: 'test_name', title: '测试试卷', width: 120, sortable: true, align: 'left'},
            { field: 'test_subject', title: '学科', width: 40, sortable: true, align: 'center'},
			{ field: 'test_stu_option', title: '学生试卷', width: 80, align: 'center'},
			{ field: 'admission_test_G', title: '入学报告', width: 80, sortable: true, align: 'center'},
			
			{ field: 'admission_time_admin', title: '发布时间和执行人', width: 120, sortable: true, align: 'center'},
			{ field: 'option_id', title: '操作', width: 80, sortable: true, align: 'center',hidden: true,
                formatter: function (value, row, index) {
                    return '--';
                }
			},
			 
			{ field: 'content', title: 'content', width: 130, hidden: true, align: 'center'},
			{ field: 'conditions', title: 'conditions', width: 130, hidden: true, align: 'center'},
			{ field: 'assign_id', title: 'assign_id', width: 130, hidden: true, align: 'center'}
			 
			/*,
			{ field: 'id', title: '操作', width: 180,  align: 'center', //是判断再次发送
			    formatter: function (value, row, index) {
						return '<a href="#" onclick="LookSend(' + index + ')" style="color:blue;">查看详情</a>';  
			    }
			} */
        ]];
	 
	var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val();
	var url = 'Webversion + "/exercise_query?pageno="+pageNumber+"&countperpage="+pageSize';
	 
	var datacc = {'action':'exercise_entrance_tests','center_id':centerAll.center_id,'zone_id':select_zoneid,'exam_type':6};
	 
	var functionres = 'Longding(result);';
		
	//加载列表  并且返回pager
    pager = datagridLoad('#sendlists',true,'#SerToolBar',tempcolumns,url,"GET","json",datacc,functionres) ;
    $('#sel_stus_realname').click(function(){
		 var stu_realnameTemp = $('#stu_names').val();
		 if($.trim(stu_realnameTemp)!=""&&$.trim(stu_realnameTemp)!=null){
			datacc = {'action':'exercise_entrance_tests','center_id':centerAll.center_id,'zone_id':select_zoneid,'exam_type':6,'stu_realname':stu_realnameTemp};
		 	pager = datagridLoad('#sendlists',true,'#SerToolBar',tempcolumns,url,"GET","json",datacc,functionres);	 
		 }
		 
	});
 
});  /////////////////////////////////////////////////////////////////////////////////////.ready的结束标签

// 查看试卷列表
function Longding(result){
	 
	if (result.list != null) {
		var datalistTemp = [];
		$.each(result.list, function (i, n) {
			var itemtemp = {};
			  //test_time  stu_name  stu_username  stu_sex  grade  test_name   test_subject  test_stu_option  admission_test_G    option_id      
			itemtemp.test_time = n.create_date.substring(0,10);
			itemtemp.stu_name = n.student_realname;
			itemtemp.stu_username = n.student_username;
			itemtemp.stu_sex = n.gender;
			
			itemtemp.grade = n.grade;
			 
			var test_stu_option_Span = '';
			var admission_test_G_Span = '';
			var jsonT = {'type_url':1,'testname':n.name,'class_id':0,'classname':'无班级','assign_id':n.assign_id,'exam_id':n.exam_id,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val(),'exam_type':6,'subject_id':n.subject_id};
					if(n.type==2){
						
						test_stu_option_Span = '<a href="javascript:void(0)" onclick="checked_test(\''+Base64.encode(JSON.stringify(jsonT))+'\');" id="'+n.study_exercise_id+'">批阅试卷</a>'; 
						admission_test_G_Span = '<font color="#ccc">生成报告</font>'; 
					}else if(n.type==3){
						var json_report = {'testname':n.name,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val(),'exam_type':6,'subject_id':n.subject_id,'realname':n.student_realname,'user_id':n.user_id,'create_date':n.create_date,'study_exercise_id':n.study_exercise_id};
						test_stu_option_Span = '<a href="javascript:void(0)" onclick="sel_test(\''+Base64.encode(JSON.stringify(jsonT))+'\');" id="'+n.study_exercise_id+'">查看批阅</a>'; 
						if(n.trid!=null&&n.trid!=""){
							admission_test_G_Span = '<a href="javascript:void(0)" onclick="sel_Report(\''+n.trid+'\')" id="'+n.study_exercise_id+'">查看报告</a>';
						}else{
							admission_test_G_Span = '<a href="javascript:void(0)" onclick="create_Report(\''+Base64.encode(JSON.stringify(json_report))+'\')" id="'+n.study_exercise_id+'">生成报告</a>';	
						} 
					}else{
						test_stu_option_Span = '<font color="#ccc">未交<font>'; 	
						admission_test_G_Span = '<font color="#ccc">生成报告</font>'; 
					} 
			 
			itemtemp.test_name = n.name;          //TeacherBigStu  TeacherOneStu
			itemtemp.test_subject = subject_sum(parseInt(n.subject_id));    //subject_sum(parseInt(value))
			itemtemp.test_stu_option = test_stu_option_Span; 
			itemtemp.admission_test_G = admission_test_G_Span; 
			if(n.tr_create_date==null||n.tr_create_date==""){
				itemtemp.admission_time_admin = '--&nbsp;--'; 
			}else{
				itemtemp.admission_time_admin = n.tr_create_date.substring(0,10)+'&nbsp;'+n.teacher_realname; 	
			}
			
			 
			itemtemp.option_id = n.id;
			itemtemp.content = n.content;
			itemtemp.conditions = ""; 
			datalistTemp.push(itemtemp);
		});
		   
    }
	return datalistTemp;   
  }

  
//批阅试卷
function checked_test(test_jsonbase64){
	 
	document.location.href = "../Reviews/ContinueRead.html?temp_test="+test_jsonbase64;
	
	
}

 //生成报告 study_test_id 学生作业id
function create_Report(report_jsonbase64){
	
	document.location.href = "./admission_report.html?temp_test="+report_jsonbase64;
}

 //查看报告
function sel_Report(tr_id){
	
	document.location.href = "./report_view.html?tr_id="+tr_id;
	//document.location.href = "./admission_report.html?tr_id="+tr_id;
	
}

//预览试卷
function sel_test(test_jsonbase64){
	document.location.href = "../Reviews/Assessment_Reader_one.html?SEa=2&temp_test="+test_jsonbase64;
	
}

 
