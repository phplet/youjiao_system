var pager = "";
var UserInfo = {};
var centerAll = {};
var temp_data_S = {};
$().ready(function() {
      UserInfo = $.evalJSON($.cookie("UserInfo"));
      centerAll = $.evalJSON($.cookie("centerAll"));
	  window.parent.tree_select('学生测评统计');
	  var  tabs_name = $('.tabs-title', window.parent.document);	  //获得iframe父页面的节点内容
	  if((tabs_name.html())!="学务报表"){
	  	tabs_name.html('学务报表');   //赋值
		// $('document').KeyInput($("#SchoolText"), '请输入姓名');
	  }
      
	  var temp_data = getUrlParam("data");
	  if(temp_data!=null&&temp_data!=undefined&&temp_data!=""){
		  temp_data_S = $.parseJSON(Base64.decode(temp_data));
	  }
	  
      var columnsjson =[[
	  		{ field: 'stuname', title: '学生姓名', width: 70, rowspan:2, align: 'center' },
		    { field: 'jointime', title: '入班时间', width: 80,rowspan:2, align: 'center', sortable: true },
			{ field: 'mouth', title: '月份', hidden:true, width: 70,rowspan:2, align: 'center' ,
				formatter: function (value, row, index) {
					if(value!=null){
						return value ;
					}else{
						return '暂无';	
					}
				}
			},
			{ field: 'classname', title: '当前班级', rowspan:2, width: 70, align: 'center', sortable: true },
			{ field: 'subject_id', title: '学科',rowspan:2, width: 80, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					return subject_sum(parseInt(value));
				}
			},
			{ field: 'teacherName', title: '任课教师',rowspan:2, width: 70, align: 'center' },
			{ field: 'student_username', title: 'student_username',rowspan:2, width: 90, hidden:true }  ,
			{ field: 'student_realname', title: 'student_realname',rowspan:2, width: 90, hidden:true }  ,
			{ field: 'gender', title: 'gender', width: 90,rowspan:2, hidden:true }  ,
			{ field: 'student_user_id', title: 'student_user_id', rowspan:2,width: 90, hidden:true }  ,
			{ field: 'class_id', title: 'class_id',  hidden:true }  ,
			{ field: 'teacher_user_id', title: 'teacher_user_id',rowspan:2, width: 90, hidden:true }  , 
			{ field: 'work_total_count', title: 'work_total_count',rowspan:2, width: 90, hidden:true }  ,
			{ field: 'work_submit_count', title: 'work_submit_count',rowspan:2, width: 90, hidden:true  }  ,
			{ field: 'test_total_count', title: 'test_total_count',rowspan:2, width: 90, hidden:true }  ,
			{ field: 'test_submit_count', title: 'test_submit_count',rowspan:2, width: 90,hidden:true }  ,
			{title:'测试次数',colspan:2},
			{title:'作业次数',colspan:2},
			{ field: 'id', title: '操作', width: 65, rowspan:2, align: 'center',
				formatter: function (value, row, index) {
                    var s = "<a  onclick=\"select_Stu("+index+");\" style='color:blue;' >查看</a>";
                    return s;
                }
			
			}  
        ],[
			{ field: 'sendSum', title: '应交', width: 90, rowspan:2, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					return row.test_total_count;
				}
			},
			{ field: 'subSum', title: '实交', width: 90, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					return row.test_submit_count;
				}
			},{ field: 'sendSum_1', title: '应交', width: 90, rowspan:2, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					return row.work_total_count;
				}
			},
			{ field: 'subSum_1', title: '实交', width: 90, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					return row.work_submit_count;
				}
			}
		
		]];
		
		var url = 'Webversion + "/stat?pageno="+pageNumber+"&countperpage="+pageSize';
		var datacc = {'action':'student_tests_works_stat'};
		var dataccc = {'action':'student_tests_works_stat'};
		
		/*if(UserInfo.level==1){
			datacc['center_id'] = UserInfo.center_id;
		}else if(UserInfo.level==2){
			datacc['center_id'] = centerAll.center_id;
			datacc['zone_id'] = $('#A_zones',window.parent.document).find("option:selected").val();
		}else if(UserInfo.level==4){
			datacc['center_id'] = centerAll.center_id;
			datacc['zone_id'] = $('#A_zones',window.parent.document).find("option:selected").val();
		}*/
	var functionres = 'Longding(result);';
	
	if(UserInfo.level==2){
		$('#subject_1_s').hide();
		$('#subject_1').show();
		 
	}else if(UserInfo.level==4){
		
		$('#subject_1').hide();
		$('#subject_1_s').show();
		$('#subject_1_s').html(subject_sum(parseInt(UserInfo.subject_id)));
		
		
	}
	
	var class_version_lev = [{'id':'1','name':public_Bigclass_name},{'id':'2','name':'1对1'}];
	
	var version_level = $.cookie("version_level");
	if(version_level!=""&&version_level!=null){
		version_level = Base64.decode(version_level);
		if(version_level==1){
			class_version_lev = [{'id':'1','name':public_Bigclass_name}];
		}else{
			class_version_lev = [{'id':'1','name':public_Bigclass_name},{'id':'2','name':'1对1'}];
		}
	}
	
	$('#class_types').combobox({
		data:class_version_lev,
		valueField:'id',
		textField:'name',
		onLoadSuccess:function(){
			if(temp_data!=null&&temp_data!=undefined&&temp_data!=""){
				$(this).combobox('setValue',temp_data_S.class_type);
				$(this).combobox("disable");
			}else{
				$(this).combobox('setValue',1);
			}
		},
		onChange:function(newsvalues_1,oldvalues_1){
			 
			if(newsvalues_1!='请选择'){
					//[{'id':'1','name':'当前'},{'id':'0','name':'过往'}],
				 var claatemps = [{'id':'1','name':'当前'},{'id':'0','name':'过往'}];
				 if(UserInfo.level==4){
					claatemps = [{'id':'1','name':'当前'}];
				 }
				 $('#class_modes').combobox({
					data:claatemps,
					valueField:'id',
					textField:'name',
					onLoadSuccess:function(){
						if(temp_data!=null&&temp_data!=undefined&&temp_data!=""){
							$(this).combobox('setValue',temp_data_S.fresh);
							 $(this).combobox("disable");
						}else{
							$(this).combobox('setValue',1);
							if(newsvalues_1==2){
								$(this).combobox("disable");
							}	
						
						}
					},
					onChange:function(newsvalues_2,oldvalues_2){
						 
						if(newsvalues_2!='请选择'){
							 var zoneclassnamesid = [];
							 var class_url_type = '/class';
							 var class_Qjson = {'action':'list','fresh':newsvalues_2,'condition':'center_id^'+centerAll.center_id+'$zone_id^'+$('#A_zones',window.parent.document).find("option:selected").val()+'$class_type^'+newsvalues_1};
							 
							 if(UserInfo.level==4){
							 	class_Qjson = {'action':'list','fresh':newsvalues_2,'condition':'center_id^'+centerAll.center_id+'$zone_id^'+$('#A_zones',window.parent.document).find("option:selected").val()+'$class_type^'+newsvalues_1+'$user_id^'+UserInfo.id};
							 }
							 var res_classname = Ajax_option(class_url_type,class_Qjson,"GET");
							 
							  datacc['fresh'] = newsvalues_2;
							 
							 if(res_classname.list!=null&&res_classname.list!=""){
								$.each(res_classname.list,function(ii_c,nn_c){
								 	zoneclassnamesid.push({'id':nn_c.id,'name':nn_c.class_name});
								}); 
							 }
							 
							 if(zoneclassnamesid!=null&&zoneclassnamesid!=""){
								 $('#class_names').combobox({
									data:zoneclassnamesid,
									valueField:'id',
									textField:'name',
									onLoadSuccess:function(){
										if(temp_data!=null&&temp_data!=undefined&&temp_data!=""){
											$(this).combobox('setValue',temp_data_S.class_id);
											$(this).combobox("disable"); 
										}else{
											$(this).combobox('setValue',zoneclassnamesid[0].id);
										}
									},
									onChange:function(newsvalues_3,oldvalues_3){
										
										 
										
										if(newsvalues_3!='请选择'&&newsvalues_3!=""){
											 var teacher_sub = [];
											 $.each(res_classname.teacher,function(ii_t,nn_t){
												 	 if(nn_t.class_id==newsvalues_3){
														 teacher_sub.push({'id':nn_t.subject_id,'name':subject_sum(parseInt(nn_t.subject_id))});
													 }
											 });
											 if(teacher_sub!=null&&teacher_sub!=""){
												 $('#subjects').combobox({
													  data:teacher_sub,
													  valueField:'id',
													  textField:'name',
													  onLoadSuccess:function(){
														  $(this).combobox('setValue',teacher_sub[0].id);
													  },
													  onChange:function(newsvalues_s,oldvalues_s){
														  if(newsvalues_s!='请选择'){
															  //加载列表  并且返回pager
															  datacc['center_id'] = centerAll.center_id;
															  
															  datacc['zone_id'] = $('#A_zones',window.parent.document).find("option:selected").val();														  datacc['class_id'] = newsvalues_3;
															  if(UserInfo.level==4){
															  	datacc['subject_id'] = UserInfo.subject_id;
															  }else{
																datacc['subject_id'] = newsvalues_s;  
															  }
															  pager = datagridLoad('#teacher_Corrects',true,'#SerToolBar',columnsjson,url,"GET","json",datacc,functionres) ;
														  }
													  }	
													  
												  });
											 }else{
												datacc = {'action':'student_tests_works_stat'};
												datacc['center_id'] = centerAll.center_id;
												datacc['zone_id'] = $('#A_zones',window.parent.document).find("option:selected").val();														  												datacc['class_id'] = newsvalues_3;
												
												pager = datagridLoad('#teacher_Corrects',true,'#SerToolBar',columnsjson,url,"GET","json",datacc,functionres) ;
											 }
											
											 
										}
									}
								});		
							}else{
								
								$('#class_names').combobox("clear"); 
								$('#class_names').combobox("disable");
								$('#subjects').combobox("clear"); 
								$('#subjects').combobox("disable");
								dataccc['center_id'] = centerAll.center_id;
								dataccc['zone_id'] = $('#A_zones',window.parent.document).find("option:selected").val();
								dataccc['fresh'] = newsvalues_2;
								dataccc['class_type'] = newsvalues_1;
								pager = datagridLoad('#teacher_Corrects',true,'#SerToolBar',columnsjson,url,"GET","json",dataccc,functionres) ;
							}
						}
					}
				});
			}
		}	
	
	});

	
	
    

    // 绑定搜索事件
    $("#BtnSearch").click(function () {
		var datacctime =  {'action':'student_tests_works_stat'};
		var dataccname =  {'action':'student_tests_works_stat'};
		var begintime = $('#begintime').combobox("getValue");
		var endtime = $('#endtime').combobox("getValue");
		var stuname = $('#stuname').val();
		 
		var class_type_T = $('#class_types').combobox("getValue");
		var class_mode_T = $('#class_modes').combobox("getValue");
		var class_name_T = $('#class_names').combobox("getValue");
		var subject_T = $('#subjects').combobox("getValue");
		if(UserInfo.level==4){
			subject_T = UserInfo.subject_id;
		  }else{
			subject_T = $('#subjects').combobox("getValue");
		  }
		if(begintime!=null&&begintime!=""&&endtime!=null&&endtime!=""&&(date_Diff_day(endtime,begintime)==0)){
			datacctime['center_id'] = centerAll.center_id;
			datacctime['zone_id'] = $('#A_zones',window.parent.document).find("option:selected").val();
			datacctime['end_time'] = endtime;
			datacctime['begin_time'] = begintime;
			 
			if($('#SerToolBar input[type=radio]:checked').val()==0){
				datacctime['class_type'] = class_type_T;
				datacctime['class_mode'] = class_mode_T;
				datacctime['class_id'] = class_name_T;
				datacctime['subject_id'] = subject_T; 
			}
			if(stuname!=null&&stuname!=""){
				datacctime['stu_realname'] = stuname;
			}
			pager = datagridLoad('#teacher_Corrects',true,'#SerToolBar',columnsjson,url,"GET","json",datacctime,functionres) ;
		}else if(stuname!=null&&stuname!=""){
			 
			dataccname['center_id'] = centerAll.center_id;
			dataccname['zone_id'] = $('#A_zones',window.parent.document).find("option:selected").val();
			dataccname['student_realname'] = stuname; 
			dataccname['class_type'] = class_type_T;
			dataccname['class_mode'] = class_mode_T;
			dataccname['class_id'] = class_name_T;
			
			dataccname['subject_id'] = subject_T; 
			//dataccname['student_user_id'] = 278;
			pager = datagridLoad('#teacher_Corrects',true,'#SerToolBar',columnsjson,url,"GET","json",dataccname,functionres) ;
		}else{
			$.messager.alert('温馨提示','您没有选择时间或者没有填写姓名!','info');	
		}
    
	});
     
    
});


//加载列表俺分页的形式显示
function Longding(result){
	if (result.list != null) {
		var datalistTemp = [];
		$.each(result.list, function (i, n) {
			var itemtemp = {};
			 
			itemtemp.jointime = n.create_date;
			 
			itemtemp.stuname = n.student_realname;
			itemtemp.classname = n.class_name;
			
		    itemtemp.student_username = n.student_username;
			itemtemp.student_realname = n.student_realname;
			itemtemp.gender = n.gender;
			itemtemp.student_user_id = n.student_user_id;
			itemtemp.teacher_user_id = n.teacher_user_id;
			
			itemtemp.subject_id = n.subject_id;
			itemtemp.class_id = n.class_id;
			itemtemp.teacherName = n.teacher_realname;
			
			itemtemp.mouth = n.year+'年'+n.month+'月';
			itemtemp.id = n.id;
			 
			 
			 if(n.work_total_count==null){
				itemtemp.work_total_count=0; 
			 }else{
				 itemtemp.work_total_count=n.work_total_count; 
			 }
			 if(n.work_submit_count==null){
				itemtemp.work_submit_count=0; 
			 }else{
				 itemtemp.work_submit_count=n.work_submit_count; 
			 }
			 
			 if(n.test_total_count==null){
				itemtemp.test_total_count=0; 
			 }else{
				 itemtemp.test_total_count=n.test_total_count; 
			 }
			 if(n.test_submit_count==null){
				itemtemp.test_submit_count=0; 
			 }else{
				 itemtemp.test_submit_count=n.test_submit_count; 
			 }
			 
			 
			datalistTemp.push(itemtemp);
   
		});
        return datalistTemp;      
	}

}
//跳转
function select_Stu(index){
	var rowData = ($('#teacher_Corrects').datagrid('getData').rows)[index];
 	 
	var rowdatas = {'stu_Name':rowData.student_username,'stu_Real':rowData.student_realname,'stu_Sex':rowData.gender,'teacher_creator':rowData.teacher_user_id,'stu_user_id':rowData.student_user_id,'class_name':rowData.classname,'center_id':centerAll.center_id,'zone_id':centerAll.zone_id,'type':1,'class_id':rowData.class_id};
	 
	window.location.href = "../TeachingAffairs/selSrudentCorrects.html?data="+Base64.encode(JSON.stringify(rowdatas));
}


//"{\"jointime\":\"2013-08-10 15:26:18\",\"stuname\":\"学生五\",\"classname\":\"语文数学班\",\"subject_id\":\"2\",\"teacherName\":\"数学一\",\"mouth\":null,\"work_total_count\":0,\"work_submit_count\":0,\"test_total_count\":0,\"test_submit_count\":0}"

//{"student_id":"124","center_id":"26","zone_id":"34","class_id":"62","class_stu_id":"166","stu_Class":"11","stu_School":"私立","subject_id":["1","2"],"work_Counts":["5 / 3","0 / 0"],"ping_Counts":["7 / 4","0 / 0"],"ping_Grade":"优","send_Time":"---","stu_user_id":"278","stu_Name":"stu01@163.com","stu_Real":"学生一","creat_Time":"2013-08-09","log_Time":"2013-08-11"}