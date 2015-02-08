 

var UserInfo = {};
var centerAll = {};
var teachername_Tnone_datas = "";
var pager = "";
var zone_type_num = 0;
$().ready(function () {
    UserInfo = $.evalJSON($.cookie("UserInfo"));
    centerAll = $.evalJSON($.cookie("centerAll"));
	pager = "";
	var  tabs_name = $('.tabs-title', window.parent.document);	  //获得iframe父页面的节点内容
	  
	if((tabs_name.html())!="教师管理"){
	  tabs_name.html('教师管理');   //赋值
	  // $('document').KeyInput($("#SchoolText"), '请输入姓名');
	}
	$('#centers_name').html(centerAll.center_name);
	$('#zones_name').html($('#A_zones',window.parent.document).find("option:selected").text());
    $('document').KeyInput($("#SchoolText"), '请输入姓名');
	 
     var tempcolumns = [[
		    { field: 'teacherUName', title: '用户名', width: 70, align: 'center', sortable: true },
			{field: 'TeacherRName', title: '姓名', width: 70, align: 'center'},
			{ field: 'TeacherSubject', title: '学科', width: 60, align: 'center', sortable: true },
			{ field: 'TeacherRole', title: '角色', width: 50, align: 'center', sortable: true ,
                formatter: function (value, row, index) {
                    var html = '';
                    if (value != null) {
                         html = value == 2 ? '教师' : '咨询师';
                    }
                    return html;
                }},
			{ field: 'TeacherEmail', title: '邮箱', width: 120, align: 'center', sortable: true },
            { field: 'creat_date', title: '注册时间', width: 80, align: 'center', sortable: true },
			{ field: 'gender', title: 'gender', width: 80, align: 'center', hidden: true },
			{ field: 'tel', title: 'tel', width: 80, align: 'center', hidden: true },
			{ field: 'note', title: 'note', width: 80, align: 'center', hidden: true },
			{ field: 'center_id', title: 'center_id', width: 80, align: 'center', hidden: true },
			{ field: 'zone_id', title: 'center_id', width: 80, align: 'center', hidden: true },
			{ field: 'teacher_id', title: 'teacher_id', width: 80, align: 'center', hidden: true },
			{ field: 'subject_id', title: 'center_id', width: 80, align: 'center', hidden: true }, 
			{ field: 'centerzoneadmin_id', title: 'centerzoneadmin_id', width: 80, align: 'center', hidden: true }, 
			
			{ field: 'TeacherBigStu', title: '所带'+public_Bigclass_name+'学生数<br>(当前/过往)', width: 90, align: 'center', sortable: true },
			
			{ field: 'TeacherOneStu', title: '所带1对1学生数<br>(当前/过往)', width: 90, align: 'center', sortable: true },
            
			{
                field: 'status', title: '状态', width: 80, align: 'center',
                formatter: function (value, row, index) {
					
                    var html = '';
                    if (value != null) {
                         html = value == 1 ? '已聘用/<a href="#" onclick="updateUserType('+row.id+',1,0);">解聘</a>' : '<font color="#ccc">已解聘</font>/<a href="#" onclick="updateUserType('+row.id+',2,\''+row.teacherUName+'\');">聘用</a>';
                    }
                    return html;
                }
            },
           	 
		    {
                field: 'id', title: '操作', align: 'center',
                formatter: function (value, row, index){
					var s = "<a href=\"#\" style='color:blue;' onclick=\"SelectTeacherOne('" + value + "'," + index + ")\">查看详情</a>&nbsp;<a href=\"#\" style='color:blue;' onclick=\"EditTeacherOne('" + value + "'," + index + ")\">修改信息</a><br /><a href='#' onclick=\"reSetPass("+value+",'/center_admin');\">重置密码</a>&nbsp;<a href=\"../Corrects/Teacher_Corrects.html\" style='color:blue;' >批改统计</a>";
                    if(row.TeacherRole==3||row.status==2){
						s = "<a href=\"#\" style='color:blue;' onclick=\"SelectTeacherOne('" + value + "'," + index + ")\">查看详情</a>&nbsp;<a href=\"#\" style='color:blue;' onclick=\"EditTeacherOne('" + value + "'," + index + ")\">修改信息</a><br /><a href='#' onclick=\"reSetPass("+value+",'/center_admin');\">重置密码</a>&nbsp;<font color=\"#ccc\">批改统计</font>";
					}
					return s;
                }
            }
        ]];
	 var version_level = $.cookie("version_level");
	if(version_level!=""&&version_level!=null){
	  version_level = Base64.decode(version_level);
	  if(version_level==1){
		  tempcolumns[0].splice(15,1,{ field: 'TeacherOneStu', title: '所带1对1学生数<br>(当前/过往)', width: 90, align: 'center', sortable: true , hidden: true});
	  }else{
		  tempcolumns[0].splice(15,1,{ field: 'TeacherOneStu', title: '所带1对1学生数<br>(当前/过往)', width: 90, align: 'center', sortable: true });
	  }
	}
	var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val();
	var url = 'Webversion + "/teacher?pageno="+pageNumber+"&countperpage="+pageSize';
	// 
	var datacc = {'action':'list','condition':"center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^4",'center_id':centerAll.center_id,'zone_id':select_zoneid};
	var functionres = 'Longding(result);';
		
	//加载列表  并且返回pager
    pager = datagridLoad('#Teacher_Ma',true,'#SerToolBar_teacher',tempcolumns,url,"GET","json",datacc,functionres) ;
	
	$("#BtnSelSearch").click(function (){
		$("#teacher_sub").combobox('setValue','请选择');
		if($(this).attr("title")=='咨询师查询'){
			datacc = {'action':'list','condition':"center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^5",'center_id':centerAll.center_id,'zone_id':select_zoneid};
			$(this).attr("title",'教师查询');
			$(this).find('.l-btn-text').text('教师查询');	
			if($('#startusid').combobox('getValue')==2){
				datacc['action'] = 'teacher_dismissed_list';
				datacc['level'] = 5;
			}
		}else{
			datacc = {'action':'list','condition':"center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^4",'center_id':centerAll.center_id,'zone_id':select_zoneid};	
			$(this).attr("title",'咨询师查询');
			$(this).find('.l-btn-text').text('咨询师查询');
			if($('#startusid').combobox('getValue')==2){
				datacc['action'] = 'teacher_dismissed_list';
				datacc['level'] = 4; 
			}
		}
	 
		pager = datagridLoad('#Teacher_Ma',true,'#SerToolBar_teacher',tempcolumns,url,"GET","json",datacc,functionres) ;
		
	});
	
	
	
    // 绑定搜索事件
	$("#BtnSearch").click(function () {
		$("#teacher_sub").combobox('setValue','请选择');
		if ($("#SchoolText").attr("innt") == "1") {
			$.messager.alert('温馨提示', '请输入真实姓名再搜索！', 'info');
			return;
		}else{
			var schoolNtext = 'realname@'+$("#SchoolText").val();
			var datasctext = {'action':'list','condition':"center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^4$"+schoolNtext,'center_id':centerAll.center_id,'zone_id':select_zoneid};
			if($('#BtnSelSearch').attr("title")=='咨询师查询'){
				datasctext['condition'] = "center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^4$"+schoolNtext;
				datasctext['level'] = 4;
			}else{
				datasctext['condition'] = "center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^5$"+schoolNtext;
				datasctext['level'] = 5;	
			}
			if($('#startusid').combobox('getValue')==2){
				datasctext['action'] = 'teacher_dismissed_list';
				datasctext['realname']  = schoolNtext;
			}
			datagridLoad('#Teacher_Ma',true,'#SerToolBar_teacher',tempcolumns,url,"GET","json",datasctext,functionres) ;
			$.messager.progress('close');
		}

	});
		
	 //绑定启用和停运状态
	 $("#startusid").combobox({
		 
			onSelect:function (record){
				$("#teacher_sub").combobox('setValue','请选择');
				var datastat = {'action':'list','condition':"center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^4",'center_id':centerAll.center_id,'zone_id':select_zoneid};
				if($('#BtnSelSearch').attr("title")=='咨询师查询'){
					datastat['condition'] = "center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^4";
					datastat['level'] = 4;
				}else{
					datastat['condition'] = "center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^5";
					datastat['level'] = 5;	
				}
				
				if(record.value==2){
					datastat['action'] = 'teacher_dismissed_list';
				}
				datagridLoad('#Teacher_Ma',true,'#SerToolBar_teacher',tempcolumns,url,"GET","json",datastat,functionres);
			}
	 });
	 
	  //绑定科目选择
	 $("#teacher_sub").combobox({
			onSelect:function (record){
				var startId = record.value;
				var datastat = {'action':'list','condition':"center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^4$subject_id^"+startId,'center_id':centerAll.center_id,'zone_id':select_zoneid};
				
				if($('#BtnSelSearch').attr("title")=='咨询师查询'){
					datastat['condition'] = "center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^4$subject_id^"+startId;
					datastat['level'] = 4;
				}else{
					datastat['condition'] = "center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^5$subject_id^"+startId;
					datastat['level'] = 5;	
				}
				
				if(startId=='请选择'){
					if($('#BtnSelSearch').attr("title")=='咨询师查询'){
						datastat = {'action':'list','condition':"center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^4",'center_id':centerAll.center_id,'zone_id':select_zoneid};
						 
					}else{
						datastat = {'action':'list','condition':"center_id^"+centerAll.center_id+"$"+"zone_id^"+select_zoneid+"$"+"level^5",'center_id':centerAll.center_id,'zone_id':select_zoneid};
						 
					}
					
				}else{
					datastat['subject_id'] = startId;	
				}
				 
				
				if($('#startusid').combobox('getValue')==2){
					datastat['action'] = 'teacher_dismissed_list';
					 
				} 
				 
				datagridLoad('#Teacher_Ma',true,'#SerToolBar_teacher',tempcolumns,url,"GET","json",datastat,functionres);
			}
	 });
 
    // 绑定单个创建新教师事件
    $("#BtnAddTeacher").click(function (){
		var centercounts_res = check_max_counts(UserInfo.center_id);
		var reality_counts = centercounts_res.center_count_info.center_teacher_count;
		var max_counts = centercounts_res.center_count_info.center_max_info.teacher_max_count;
		zone_type_num = centercounts_res.center_count_info.center_max_info.type;
		if(zone_type_num==1){
			if(max_counts!=null&&max_counts!=""&&max_counts!=0){
				if(parseInt(max_counts)>parseInt(reality_counts)){
					alertCreate("#wdialog",'新增教师资料',520,400,'openfunction()','handfunction()','确认','取消');
					$('#wdialog').dialog('open');
				}else{
					$.messager.alert('温馨提示','教职员工上限：'+max_counts+'<br />现有教职员工：'+reality_counts+'<br />如果添加校区，请与本校校长联系!','info');
				}
			}else{
				alertCreate("#wdialog",'新增教师资料',520,400,'openfunction()','handfunction()','确认','取消');
				$('#wdialog').dialog('open');
			}
		}else{
			var sAzone_id = $('#A_zones',window.parent.document).find("option:selected").val();
			var teachermax_countsTemp = centercounts_res.center_count_info.zone_info;
			var teacher_max_zonesum = 0;
			var teacher_curr_zonesum = 0;
			$.each(teachermax_countsTemp,function(i_a,n_a){
				if(sAzone_id==n_a.id){
					teacher_max_zonesum = parseInt(n_a.teacher_max_count);	
					teacher_curr_zonesum = parseInt(n_a.teacher_current_count);	
					return false;
				}
				
			});	
			if(teacher_max_zonesum>teacher_curr_zonesum){
				alertCreate("#wdialog",'新增教师资料',520,400,'openfunction()','handfunction()','确认','取消');
				$('#wdialog').dialog('open');
				 
			}else{
				
				$.messager.alert('温馨提示','教职员工上限：'+teacher_max_zonesum+'<br />现有教职员工：'+teacher_curr_zonesum+'<br />如果添加教师，请与本校校长联系!','info');
					
			}
			
		}
         

    });
	// 绑定批量创建新教师事件
    $("#BtnAddMoreTeacher").click(function () {
		$('#addMoreTeacher').show();
		$('#main').show();
		$('#main_list').hide();
        createMoreTeacher();
        $('#addMoreTeacher').dialog('open');
    });
	
	// 绑定创建已存在的教师
    $("#BtnAddSearch").click(function () {
		var createSearthTeacher = "createSearthTeacher();";
		alertSel("#addSearthTeacher",'加入其他校区教师',520,300,null,'关闭');
		$('#addSeaTeacher').val("");
		$('#search_otherT').html("");
        $('#addSearthTeacher').dialog('open');
    });
	
	//绑定已存在教师搜索BtnaddSearthTeacher
	$('document').KeyInput($("#addSeaTeacher"), '请输入真实姓名');
	$("#BtnaddSearthTeacher").click(function () {
		 
		 if($("#addSeaTeacher").attr("innt") == "1"){
			 $.messager.alert('温馨提示', '请输入真实姓名再搜索！', 'info');
	     }else{
			var text_addSeaTeacher = $('#addSeaTeacher').val(); 
			search_otherT(text_addSeaTeacher);//加载列表
		 }
    });

});

//加载列表页面 返回datalistTemp数组
function Longding(result){
	 
	if (result.list != null) {
		var datalistTemp = [];
		$.each(result.list, function (i, n) {
			var itemtemp = {};
			itemtemp.teacherUName = n.username;          //TeacherBigStu  TeacherOneStu
			if(n.level==4){
				itemtemp.TeacherRole = 2 ;	
			}else if(n.level==5){itemtemp.TeacherRole = 3;}
			//itemtemp.TeacherRole = n.usr_type;
			itemtemp.status = $('#startusid').combobox('getValue');
			itemtemp.TeacherRName = n.realname;
			itemtemp.TeacherSubject = subject_sum(parseInt(n.subject_id));
			itemtemp.TeacherEmail = n.email;
			itemtemp.creat_date = n.reg_time;
			itemtemp.id = n.user_id;
			itemtemp.teacher_id = n.id;
			itemtemp.gender = n.gender;
			itemtemp.centerzoneadmin_id = n.centerzoneadmin_id;
			itemtemp.tel = n.tel;
			itemtemp.note = n.note;
			itemtemp.center_id = n.center_id;
			itemtemp.zone_id = n.zone_id;
			itemtemp.subject_id = n.subject_id;
			var bigClass_now = 0;
			var bigClass_pass = 0;
			var smallClass_now = 0;
			var smallClass_pass = 0;
			/*if(n.bigClass!=null){
				$.each(n.bigClass.now,function(ii,nn){
					
					bigClass_now += parseInt(nn);
				});
				$.each(n.bigClass.pass,function(iii,nnn){
					bigClass_pass += parseInt(nnn);
				});
			}
			if(n.smallClass!=null){
				$.each(n.smallClass.now,function(ii,nnnn){
					smallClass_now += parseInt(nnnn);
				});
				$.each(n.smallClass.pass,function(iii,nnnnn){
					smallClass_pass += parseInt(nnnnn);
				});
			}*/
			if(n.big_class_current){
				itemtemp.TeacherBigStu = n.big_class_current.count+'/'+n.big_class_pass.count;	
			} else{
				itemtemp.TeacherBigStu = '--';	
			}
			
			if(n.small_class_current){
				itemtemp.TeacherOneStu = n.small_class_current.count+'/'+n.small_class_pass.count;
			} else{
				itemtemp.TeacherOneStu = '--';	
			}
			
			
			datalistTemp.push(itemtemp);
		});
		   
    }
	return datalistTemp;   
}


 

// 单个创建教师
function openfunction(){
    $('#teacherUName').attr('disabled',false);
	$('#checkname').show();
	change_subject_no_B(2);
	validate_form("#TeacherForm","#teacherUName","#teacherUName_Ms","#teacherRName","#teacherRName_Ms","#teacherEmail","#teacherEmail_Ms","#teacherTel","#teacherTel_Ms","#userSchool","#userSchool_Ms","#teacherSubjects","#teacherSubjects_Ms","#hiddenteacherid",0); 
	$('#teacherSubjects').combobox('setValue','请选择');
	 
}

//单个创建教师页面的点击确认以后的操作
function handfunction(){
	  /*---循环验证begin*/
	var addSCtemp = true;
	$.each($('.TeacherForm'),function(ii,obj){
		if(($(obj).html()).indexOf('ok.png')<0){
			addSCtemp = false;
			$.messager.alert('温馨提示', '信息不符合要求,请按要求填写！', 'info');	
			return false;   //退出each循环,  加false;
	}});
	if(!addSCtemp){return false;}
	/*---验证end*/
	 
	  var center_id = centerAll.center_id;
	  var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	  var userName = $("#teacherUName").val();
	  var userRealName = $("#teacherRName").val();
	  var userSex = $('input[name="teacherSex"]:checked').val();
	  var userTel = $("#teacherTel").val();
	  var userEmail = $("#teacherEmail").val();
	  var userSubjects = $('#teacherSubjects').combobox('getValue');
	  var usertype = $('input[name="usertype"]:checked').val();
	  var userMessage = $('#teacherMessage').val();
	  var user_id = UserInfo.id;
	  var level_num =4;
	   
	  if(usertype==3){
		 level_num = 5;  
		 userSubjects = 0;
	  }
	  var jsondata = {'action':'add','center_id':center_id,'zone_id':zone_id, 'usr_type':2,'level':level_num,'user_id':user_id,'user_name':userName,'real_name':userRealName,'user_sex':userSex,'user_tel':userTel,'user_email':userEmail,'subjects':userSubjects,'message':userMessage}; 
	   
	  $.messager.progress({ text: "正在创建新成员" });
	  $.ajax({
		  url: Webversion + "/teacher",
		  type: "POST",
		  dataType: "json",
		  data: jsondata,
		  success: function (result) {
			  $.messager.progress("close");
			  $('#wdialog').dialog('close');
			  // 重新刷新数据列表
			  pager.pagination("select",1);
		  },
		  error: function (result) {
			  $.messager.progress("close");
			  $.messager.alert('错误', '新增教师创建失败!', 'error');
		  }
	  });
}

 
//多选框取消和选中
function snonereg_check(){
	var allcheckflag = $('#nonereg_check').attr('checked');
	 
	if(allcheckflag){
		$('#nonereg input[name="nonereg_check"]').each(function(iT_1, nT_1) {
			if(!$(this).attr("checked")){
				$(this).attr("checked",true);
			}
			
		});
	 }else{
		$('#nonereg input[name="nonereg_check"]').each(function(iT_2, nT_2) {
			if($(this).attr("checked")){
				$(this).attr("checked",false);
			}
			
		}); 
	 }	
}

// 批量创建教师
function createMoreTeacher() {
   		
        $("#addMoreTeacher").dialog({
            iconCls: 'icon-add',
            title: '批量添加教师',
            width: 620,
            height: 300,
            closed: true,
            cache: false,
            modal: true,
            /*onOpen: function () {
				 
                validate_form("#TeacherForm","#teacherUName","#teacherUName_Ms","#teacherRName","#teacherRName_Ms","#teacherEmail","#teacherEmail_Ms","#teacherTel","#teacherTel_Ms","#teacherSchool","#teacherSchool_Ms","#teacherSubjects","#teacherSubjects_Ms","#hiddenteacherid",0); 
            },*/
            buttons: [{
                text: '放弃',
                iconCls: '',
                handler: function () {
					 
                  $('#nonereg input[name="nonereg_check"]').each(function(index, element) {
					  	var flag_check = $(this).attr("checked");
						var value_check = $(this).attr("value");
                    	if(index!=0){
							if(flag_check){
								$('#nonereg tr').each(function(is_1, ns_1) {
                                    var tr_ids = $(ns_1).attr("id");
									var trsde_id = [];
									if(tr_ids!=undefined&&tr_ids!=""){
										trsde_id = tr_ids.split('trsde_');
										if(parseInt(trsde_id[1])==parseInt(value_check)){
											$(this).remove();
											 
										}
									}
                                });
							}
							
						}
                  });    
                }
            },{
                text: '确认',
                iconCls: 'icon-ok',
                handler: function () {
					var addSCtemp = true;
					  $.each($('.Ms_check'),function(obj_i,obj){
						  if(($(obj).html()).indexOf('ok.png')<0){
							  addSCtemp = false;
							  $.messager.alert('温馨提示', '请查询教师用户名是否全部验证！', 'info');	
							  return false;   //退出each循环,  加false;
					  	  }
					  });
					 if(!addSCtemp){return false;}
					 
					 var tempstutnoes = [];
					 $('#nonereg input[type="text"]').each(function(ms_i, ms_n) {
                        var stuname_Tnone_i = $(this).attr("id").split('stuname_Tnone_');
						var tempstutnoe = teachername_Tnone_datas.list.registered[parseInt(stuname_Tnone_i[1])];
						tempstutnoe.username = $(this).val();
						tempstutnoes.push(tempstutnoe);
                     });
					 var url_typeTnone = '/batch_user';
					 var QjsonTnone = {'action':'batch_teachers','user_info':Base64.encode(JSON.stringify(tempstutnoes)),'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
					 
					 var ajax_flag = Ajax_option(url_typeTnone,QjsonTnone,"POST");

                    $('#addMoreTeacher').hide();
					$('#addMoreTeacher').dialog('close');
					pager.pagination("select",1);
                }
            }, {
                text: '取消',
                iconCls: 'icon-cancel',
                handler: function () {
                    $('#addMoreTeacher').dialog('close');
					$('#addMoreTeacher').hide();
                }
            }]
        });
}


// 加入已存在的教师--列出其他校区的教师
function search_otherT(text_addSeaTeacher) {
   var text_center_id = centerAll.center_id;
   var text_zoneid = $('#A_zones',window.parent.document).find("option:selected").val();
   $.ajax({
		url: Webversion + '/teacher',
		type: "GET",
		dataType: "json",
		data:{action:'other_teacher','realname':text_addSeaTeacher,'center_id':text_center_id,'zone_id':text_zoneid},
		beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
		success: function (result) {
			 var htmls = ""; 
			 if(result.list!=null){
				 $.each(result.list,function(ist,item){
					 htmls+='<ul style="border-left:#CCC dotted 1px; display:inline-table;"><li class="text_float text_side" style="width:120px; text-align:center;">'+item.username+'</li><li class="text_float text_side" style="width:50px; text-align:center;">'+item.realname+'</li><li class="text_float text_side" style="width:40px; text-align:center;">'+subject_sum(parseInt(item.subject_id))+'</li><li class="text_float text_side" style="width:150px; text-align:center;">'+centerAll.center_name+'-'+item.zone_name+'</li><li class="text_float text_side" style="width:70px; text-align:center;">'+item.tel+'</li><li class="text_float text_side" style="width:40px; text-align:center;"><a href="#" onclick="joinZone('+text_center_id+','+text_zoneid+','+item.id+',\''+item.username+'\');">加&nbsp;入</a></li></ul><div class="cleared"></div>';
			     });
			 }else{
				$.messager.alert('温馨提示', '没有此用户！核对后再查找！', 'info'); 
			 }
			 $('#search_otherT').html(htmls);
			 
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
      
}
// 加入已存在的教师--列出其他校区的教师  cid 学校id   zid 校区id  uid 用户id
function joinZone(cid,zid,uid,account){
	$.ajax({
		url: Webversion + '/teacher',
		type: "POST",
		dataType: "json",
		data:{'action':'join','center_id':cid ,'zone_id':zid,'user_id':uid,'account':account},
		beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
		success: function (result) {
			  if(result.find){
				  $.messager.alert('温馨提示','此教师已经添加过了,不能重复添加！','info');  
			  }else{
					window.location.href="./Teacher_Ma.html";
			  }
			  
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
}
 

// 修改教师信息
function EditTeacherOne(value, index) {
	
    $.messager.progress({text:'正在获取教师信息'});
    // 获取校区相关数据
    var rowData = JSON.stringify(($('#Teacher_Ma').datagrid('getData').rows)[index]);
	var updateOpen = "updateOpen("+rowData+");";
	var updateHand = "updateHand("+rowData+");";
	alertCreate("#wdialog",'修改教师信息',520,400,updateOpen,updateHand,'修改','取消');
	$('#wdialog').dialog('open');
	//change_subject_no_B(value_SF);
     
}
//修改教师信息页面加载成功  open  teacherUName  TeacherRName  TeacherSubject  TeacherRole  TeacherEmail  TeacherEmail gender tel note 
function updateOpen(rowData){
	  $.messager.progress('close');
	  validate_form("#TeacherForm","#teacherUName","#teacherUName_Ms","#teacherRName","#teacherRName_Ms","#teacherEmail","#teacherEmail_Ms","#teacherTel","#teacherTel_Ms","#userSchool","#userSchool_Ms","#teacherSubjects","#teacherSubjects_Ms","#hiddenteacherid",1); 
	  $('#checkname').hide();
	  $('#teacherUName').val(rowData.teacherUName);
	  
	  $('#teacherRName').val(rowData.TeacherRName);
	  $(":radio[name=teacherSex][value="+rowData.gender+"]").attr("checked","true");
	  $('#teacherTel').val(rowData.tel);
	  $('#teacherEmail').val(rowData.TeacherEmail);
	  change_subject_no_B(rowData.TeacherRole);
	  if(rowData.TeacherRole==3){
	  	  $('#teacherSubjects').combobox('setValue','请选择');
		  
	  }else{
		  $('#teacherSubjects').combobox('setValue',rowData.subject_id);   
	  }
	  $("input[name=usertype][value="+rowData.TeacherRole+"]").attr("checked",true); 
	  $('#teacherMessage').val(rowData.note);
	  $('#teacherUName').attr('disabled',true);
}

//修改教师信息页面逻辑操作
function updateHand(rowData){
	/*---循环验证begin*/
	var addSCtemp = true;
	$.each($('.TeacherForm'),function(ii,obj){
		if(($(obj).html()).indexOf('ok.png')<0){
			addSCtemp = false;
			$.messager.alert('温馨提示', '信息不符合要求,请按要求填写！', 'info');	
			return false;   //退出each循环,  加false;
	}});
	if(!addSCtemp){return false;}
	/*---验证end*/
	  var center_id = rowData.center_id;
	  var zone_id = rowData.zone_id;
	  var userName = $("#teacherUName").val();
	  var userRealName = $("#teacherRName").val();
	  var userSex = $('input[name="teacherSex"]:checked').val();
	  var userTel = $("#teacherTel").val();
	  var userEmail = $("#teacherEmail").val();
	  var userSubjects = $('#teacherSubjects').combobox('getValue');
	  var usertype = $('input[name="usertype"]:checked').val();
	  var userMessage = $('#teacherMessage').val();
	  var user_id = rowData.id;
	  var level_num = 4;
	  if(usertype==3){
		  level_num = 5;
		  userSubjects = 0;
	  }
	  
	   var jsondata = {'action':'edit','center_id':center_id,'zone_id':zone_id, 'user_type':2,'level':level_num,'user_id':user_id,'user_name':userName,'real_name':userRealName,'user_sex':userSex,'user_tel':userTel,'user_email':userEmail,'subjects':userSubjects,'message':userMessage}; 
	   
	$.messager.progress({ text: '系统正在处理' });
	 
	$.ajax({
		type: "POST",
		dataType: "json",
		url: Webversion + "/teacher" ,
		data: jsondata,
		success: function (result) {
			$.messager.progress('close');
			if(result.flag){
				$('#wdialog').dialog('close');
				$.remind('教师信息修改成功！');
				var pager = $('#Teacher_Ma').datagrid("getPager");
				pager.pagination("select");
			}
		},
		error: function (result) {
			$.messager.progress('close');
			$.error('系统出现异常，校区名称修改失败！');
		}
	});	
}


// 查看教师详细内容
function SelectTeacherOne(value, index) {
		
    $.messager.progress({text:'正在获取教师详细信息'});
    var rowData = JSON.stringify(($('#Teacher_Ma').datagrid('getData').rows)[index]);
	var selopen = "selOpens("+rowData+");";
    alertSel("#SeltTeacher",'查看教师详细信息',520,420,selopen,'关闭');
	$.messager.progress('close');
    $('#SeltTeacher').dialog('open');
	 
}
//查看教师详细内容的赋值
function selOpens(rowData){
	//sel_teacher_message  sel_teacher_tel  sel_teacher_sub  sel_teacher_sex  sel_teacher_rname  sel_teacher_email sel_teacher_uname
	//teacherUName TeacherRName TeacherSubject TeacherRole TeacherEmail gender tel note
	$('#sel_teacher_uname').html(rowData.teacherUName);
	$('#sel_teacher_rname').html(rowData.TeacherRName);
	$("#sel_teacher_sex").html(rowData.gender==1?'男':'女');
	$('#sel_teacher_tel').html(rowData.tel);
	$('#sel_teacher_email').html(rowData.TeacherEmail);
	$('#sel_teacher_sub').html(rowData.TeacherSubject);
	$('#sel_teacher_role').html(rowData.TeacherRole==2?'教师':'咨询师');
	$('#sel_teacher_message').html(rowData.note);
	//$('#selPass').html("<a href='#' onclick=\"reSetPass("+rowData.id+",'/center_zone_admin');\">重置密码</a>");
	
}
 
 
 
//验证表单

function validate_form(form,name,name_ms,realname,realname_ms,email,email_ms,tel,tel_ms,school,school_ms,sub,sub_ms,teacherid,type){
	$(teacherid).attr('flag', 'e');
    $(teacherid).val('');
    $(form)[0].reset();
	if(type==0){
		$(name_ms).html('&nbsp;请输入数字和字母组合!');
		$(realname_ms).html('&nbsp;请输入中文姓名,2-4位汉字！');
		$(tel_ms).html('&nbsp;联系方式为11位数字！');
		$(email_ms).html('&nbsp;用户邮箱必须为电子邮件格式！');
		$(sub_ms).html('&nbsp;学科不能为空!');
		/*
		$(school_ms).html('&nbsp;校区不能为空！');	*/
	}else if(type==1){
		$(name_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(realname_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(tel_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(email_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(sub_ms).html('&nbsp;<img src="../images/ok.png"/>');
		/*$(school_ms).html('&nbsp;<img src="../images/ok.png"/>');
		*/
	}
	
    // 定义负责人验证方式
    $.extend($.fn.validatebox.defaults.rules, {
		CheckUserName: {     //验证用户名存在与否  不存在的情况下才能注册
            validator: function (value, param) {
                $(name).html("");
             
                $(teacherid).attr('flag', 'e');
                $(teacherid).val('');
				var UserNameSum  =  6;  //判断用户名的长度
                
				if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(com|cn|net)$/i.test(value)) {
					var htmltemp = "<img alt='' src='../images/imgload.gif'/>正在获取...";
                	$(name_ms).html('&nbsp;请点击验证！'); 
					return  true;
                }else{
					$(name_ms).html('&nbsp;请输入邮箱格式！');
					return false;	
				}
                $(name_ms).html('&nbsp;请点击验证！'); 
				return true;
            },
            message: '用户名为邮箱格式！'
        },
        CheckUserRealName: {
            validator: function (value, param) {
                $(realname_ms).html("");
                $(teacherid).attr('flag', 'e');
                $(teacherid).val('');
                // 验证是否为电子邮件格式
                if (!/^[\u4e00-\u9fa5]{2,4}$/i.test(value)) {
					$(realname_ms).html('请输入中文姓名,2-4位汉字！');
                    return false;
                }else{
					 $(realname_ms).html('&nbsp;<img src="../images/ok.png"/>');
                	 return true;	
				}
               
            },
            message: '请使用中文姓名,2-4位汉字！'
        },
        CheckEmail: {
            validator: function (value, param) {
                $(email_ms).html("");
                $(teacherid).attr('flag', 'e');
                $(teacherid).val('');
                // 验证是否为电子邮件格式
                if (!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(com|cn|net)$/i.test(value)) {
					$(email_ms).html('用户邮箱必须为电子邮件格式！');
                    return false;
                }else{
					$(email_ms).html('&nbsp;<img src="../images/ok.png"/>');
                	return true;
				}
                
            },
            message: '用户邮箱必须为电子邮件格式！'
        },
        CheckUserTel: {
            validator: function (value, param) {
                $(tel_ms).html("");
                $(teacherid).attr('flag', 'e');
                $(teacherid).val('');
                // 验证是否为11位手机号码--数字
                if (!/^\d{11}$/i.test(value)) {
					$(tel_ms).html('联系方式为11位数字！');
                    return false;
                }else{
					$(tel_ms).html('&nbsp;<img src="../images/ok.png"/>');
                	return true;
				}
                
            },
            message: '联系方式为11位手机号码！'
        }
    });

    $(email).validatebox({   //email验证
        required: true,
        validType: "CheckEmail",
        missingMessage: '该项必须输入且为邮件格式！'
    });
	$(name).validatebox({  //用户名验证
        required: true,
        validType: "CheckUserName",
        missingMessage: '该项必须输入且为邮件格式！'
    });
	$(realname).validatebox({  //真实姓名验证
        required: true,
        validType: "CheckUserRealName",
        missingMessage: '该项必须输入必须是中文姓名,2-4位汉字！'
    });
	$(tel).validatebox({  //联系方式验证
        required: true,
        validType: "CheckUserTel",
        missingMessage: '该项必须输入必须是11位手机号码！'
    });
	$(sub).combobox({
		onChange:function(newvalue,oldvalue){
			if(newvalue!='请选择'){
				$(sub_ms).html('&nbsp;<img src="../images/ok.png"/>');
			}else{
				$(sub_ms).html('&nbsp;学科不能为空!');
			}
		}
	});
	
}


function updateUserType(Tid,typeid,username_T){
	//typeid =1  解聘  2 聘用
	var stus_url_type ='/teacher';
	var stus_Qjson = {'action':'employ_teacher_switch','teacher_user_id':Tid,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
	var stus_type = 'POST';
	var msgte = '确定解聘或者聘用吗？';
	if(typeid==1){
		msgte = '确定解聘这位教师吗？';
	}else if(typeid==2){
		msgte = '确定重新聘用这位教师吗？';
	}
	$.messager.confirm('温馨提示',msgte, function(r){
		if(r){
			if(typeid==1){
				var restatus = Ajax_option(stus_url_type,stus_Qjson,stus_type);
				if(restatus.flag){
					$.messager.alert('温馨提示','解聘成功!','info');
					pager.pagination("select",1);
				}else{
					$.messager.alert('温馨提示','目前该教师下有班级和学生,请退出班级再解聘!','info');
				}
			}else{
				joinZone(centerAll.center_id,$('#A_zones',window.parent.document).find("option:selected").val(),Tid,username_T);	
			}
		}
	});
	
	
}


function change_subject_no_B(value_SF){
	if(value_SF==2){
		$('#sss_subject_no').html('<span class="color_text">*</span><span id="teacherSubjects_Ms" class="color_text TeacherForm">&nbsp;学科不能为空！</span>');	
	}else if(value_SF==3){
		$('#sss_subject_no').html("");
	}
}
 