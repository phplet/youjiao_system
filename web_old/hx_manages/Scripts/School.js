var UserInfo = {};
var pager="";
var type_zoneTemp = 1;

$().ready(function () {
	 var  tabs_name = $('.tabs-title', window.parent.document);	  //获得iframe父页面的节点内容
	  if((tabs_name.html())=="学务报表"){
	  tabs_name.html('校区管理');   //赋值
		// $('document').KeyInput($("#SchoolText"), '请输入姓名');
	  }
	 $('document').KeyInput($("#SchoolText"), '请输入校区');
    UserInfo = $.evalJSON($.cookie("UserInfo"));
	$('#centers_name').html(UserInfo.center_name);
    var columnsjson =[[
		{ field: 'name', title: '校区名称', width: 120, align: 'center', sortable: true },
		{ field: 'realname', title: '负责人', width: 80, align: 'center'},
		{ field: 'center_id', title: 'center_id', width: 120, hidden:true },
		{ field: 'zone_id', title: 'zone_id', width: 120, hidden:true },
		{ field: 'admin_id', title: 'admin_id', width: 120, hidden:true },
		{ field: 'city', title: '所在省市', width: 120, align: 'center' },
		{ field: 'cityid', title: 'cityid', width: 120, hidden:true },
		{ field: 'Pid', title: 'Pid', width: 120, hidden:true },
		{ field: 'address', title: '校区地址', width: 135, align: 'center' },
		{ field: 'creat_date', title: '建立时间', width: 70, align: 'center', sortable: true },
		{ field: 'distroy_date', title: '注销时间', width: 70, align: 'center', sortable: true }, 
		 
		{ field: 'stu_max', title: 'stu_max', width: 70, align: 'center', hidden:true}, 
		{ field: 'type_zone_num', title: 'type_zone_num', width: 20, hidden:true},
		{ field: 'nowstu', title: '现有学生数', width: 70, hidden:true},
		{ field: 'maxstu', title: '学生数(现有/上限)', width: 70, align: 'center',
			formatter: function (value, row, index){
				if(row.type_zone_num==2){
					return row.nowstu+'/'+value;
				}else{
					return row.nowstu+'/'+(value==0?'不限':value);	
				}
			}
		}, 
		 
		{ field: 'nowteacher', title: '现有教师数', width: 70, hidden:true},
		{ field: 'maxteacher', title: '教师数(现有/上限)', width: 70, align: 'center',
			formatter: function (value, row, index){
				if(row.type_zone_num==2){
					return row.nowteacher+'/'+value;
				}else{
					return row.nowteacher+'/不限';	
				}
			}
		}, 
		{ field: 'status', title: '状态', width: 80, align: 'center',
			formatter: function (value, row, index) {
				var html = '';
				if (value!= null) {
			      
				   html = value == 1 ? '已启用/<a href="#" onclick="changestart('+row.id+');">停运</a>' : '<font color="#ccc">已停运</font>/<a href="#" onclick="changestart('+row.id+');">启用</a>';
				}
				return html;
			}
		},
		{
			field: 'id', title: '操作', align: 'center', width: 80,
			formatter: function (value, row, index) {
				var s = "<div style=\"border:none;text-align:center;line-height:20px;\"><a href=\"#\" style='color:blue;' onclick=\"SelectZoneName('" + value + "'," + index + ")\">查看</a>&nbsp;&nbsp;<a href=\"#\" style='color:blue;' onclick=\"EditZoneName('" + value + "'," + index + ")\">修改</a><br /><a href=\"#\" style='color:blue;' onclick=\"SelTeachers('" + value + "'," + index + ","+row.center_id+")\">查看校区人员</a><br /><a href=\"#\" style='color:blue;' onclick=\"SelStuCorrects('" + value + "'," + index + ","+row.center_id+")\">查看学生统计</a></div>";
				  
				return s;
			}
		}
	]];
	 
	var url = 'Webversion + "/center_zone?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc = {'action':'list','condition':""};
	var functionres = 'Longding(result);';
	
	//加载列表  并且返回pager
	pager = datagridLoad('#schoolmanager',true,'#SerToolBar',columnsjson,url,"GET","json",datacc,functionres) ;
    
	 
    // 绑定搜索事件
    $("#BtnSearch").click(function () {
		 
        if ($("#SchoolText").attr("innt") == "1") {
            $.messager.alert('温馨提示', '请输入校区名称再搜索！', 'info');
            return;
        }else{
			var schoolNtext = 'zone_name@'+$("#SchoolText").val();
			var datasctext = {'action':'list','condition':schoolNtext};
			datagridLoad('#schoolmanager',true,'#SerToolBar',columnsjson,url,"GET","json",datasctext,functionres) ;
			 
		}
    });
	
	//绑定启用和停运状态
	 $("#startusid").combobox({
			onSelect:function (record){
				var startId = record.value==1?'status^1':'status^0';
				var datasctext = {'action':'list','condition':startId};
				datagridLoad('#schoolmanager',true,'#SerToolBar',columnsjson,url,"GET","json",datasctext,functionres) ;
			}
	 });

    // 绑定创建新校区事件
    $("#BtnAdd").click(function () {
		 
		var centercounts_res = check_max_counts(UserInfo.center_id);
		var reality_counts = centercounts_res.center_count_info.center_zone_count;
		var max_counts = centercounts_res.center_count_info.center_max_info.zone_max_count;
        if(max_counts!=null&&max_counts!=""&&max_counts!=0){
			if(parseInt(max_counts)>parseInt(reality_counts)){
				alertCreate("#addSchool",'创建新校区',520,270,'openfunction()','handfunction()','确认','取消');
        		$('#addSchool').dialog('open');
			}else{
				$.messager.alert('温馨提示','校区上限：'+max_counts+'<br />现有校区：'+reality_counts+'<br />如果添加校区，请于供应商联系!','info');
			}
		}else{
			alertCreate("#addSchool",'创建新校区',520,270,'openfunction()','handfunction()','确认','取消');
        	$('#addSchool').dialog('open');
		}
		
    });
});

//加载分校区列表页面 返回datalistTemp数组
function Longding(result){
	if (result.list != null) {
		var datalistTemp = [];
		var centercounts_res = check_max_counts(UserInfo.center_id);
		var reality_zone = centercounts_res.center_count_info.center_zone_count;
		var max_zone = centercounts_res.center_count_info.center_max_info.zone_max_count;
		type_zoneTemp = centercounts_res.center_count_info.center_max_info.type;
		var reality_teacher = centercounts_res.center_count_info.center_teacher_count;
		var max_teacher = centercounts_res.center_count_info.center_max_info.teacher_max_count;
		var reality_student = centercounts_res.center_count_info.center_student_count;
		var max_student = centercounts_res.center_count_info.center_max_info.student_max_count;
		var max_stusTemp_counts = centercounts_res.center_count_info.zone_info;
		$.each(result.list, function (i, n) {
			var itemtemp = {};
			itemtemp.name = n.zone_name;
			itemtemp.zone_id = n.id;
			itemtemp.realname = n.realname;
			itemtemp.center_id = n.center_id;
			itemtemp.type_zone_num = type_zoneTemp;
			itemtemp.stu_max = n.student_max_count;
			if(max_stusTemp_counts!=null&&max_stusTemp_counts!=""){
				$.each(max_stusTemp_counts,function(ic,nc){
					 if(n.center_id==nc.center_id&&n.id==nc.id){
					  	itemtemp.nowstu = parseInt(nc.student_current_count);
						itemtemp.maxstu = parseInt(nc.student_max_count);
						itemtemp.nowteacher = parseInt(nc.teacher_max_count);
						itemtemp.maxteacher = parseInt(nc.teacher_max_count);	
					 }
				});
			}else{
				itemtemp.nowstu = 0;
				itemtemp.maxstu = 0;	
			}
			 
			
			itemtemp.admin_id = n.user_id;
			itemtemp.city = n.province_name+","+n.city_name;
			itemtemp.address = n.address;
			itemtemp.creat_date = n.create_date;
			itemtemp.distroy_date = n.inactive_date;
			itemtemp.status = n.status;
			itemtemp.id = n.id;
			itemtemp.Pid =  n.province_id;
			itemtemp.cityid = n.city_id;
			datalistTemp.push(itemtemp);
   
		});
        return datalistTemp;      
    }
}

//创建校区页面加载成功的操作
function openfunction(){
	$('#schoolName').attr('disabled',false);
	$('#checkname').show();
	validate_form("#addSchoolForm","#schoolName","#schoolName_Ms","#schoolAddrP","#schoolAddrP_Ms","#schoolAddrC","#schoolAddrC_Ms","#schoolAddrDetail","#schoolAddrDetail_Ms","#hiddenteacherid",0);
	$('#schoolAddrC').combobox('disable');
	provinceList(null,null,null);   //省市
	var olddata = old_data=[{"id":'请选择',"name":'请选择'}];
	selPersion(null,olddata);    //
}

//创建校区页面的点击确认以后的操作
function handfunction(){
	 /*---循环验证begin*/
	  var addSCtemp = true;
	  $.each($('.addSchoolForm'),function(ii,obj){  
		  if(($(obj).html()).indexOf('ok.png')<0){
			  addSCtemp = false;
			  $.messager.alert('温馨提示', '信息不符合要求,请按要求填写！', 'info');	
			  return false;   //退出each循环,  加false;
	  }});
	  if(!addSCtemp){return false;}
	  /*---验证end*/
	  var center_id = UserInfo.center_id;
	  var zone_name = $("#schoolName").val();
	  var province_id = $('#schoolAddrP').combobox('getValue');
	  var city_id = $('#schoolAddrC').combobox('getValue');
	  var address = $('#schoolAddrDetail').val();
	  var admin_id = $('#schoolPrincipal').combobox('getValue');
	  if(admin_id=="请选择"){
		  admin_id = null ;
	  }
	  var instruction =""
	  var stuNum_max = $('#stuNum_max').val();
	  if(isNaN(parseInt(stuNum_max))){
		 $.messager.alert('温馨提示', '学生上限只能输入数字！', 'info');
		 return false;
	  }else{
		 var centercounts_res = check_max_counts(UserInfo.center_id);
		 var center_stu_max_counts = centercounts_res.center_count_info.center_max_info.student_max_count;
		 var max_counts = centercounts_res.center_count_info.zone_info;
		 if(center_stu_max_counts!=0){
			 var center_stu_nums = center_stu_max_counts;  
			 var zones_stu_nums = 0;
			 if(max_counts!=null&&max_counts!=""){
				 $.each(max_counts,function(i,n){ 
					zones_stu_nums += parseInt(n.student_max_count);
				 }); 
			}else{
				zones_stu_nums = 0;
			} 
		   if((center_stu_nums-zones_stu_nums-parseInt(stuNum_max))<0){
				$.messager.alert('温馨提示', '剩余学生数不够，本校区只能添加'+(center_stu_nums-zones_stu_nums)+'个学生！', 'info');	 
				return false;	   
		   }
		 }
	  }
	  
	  var jsondata = {'action':'add','center_id':center_id,'zone_name':zone_name, 'province_id': province_id,'city_id':city_id,'address':address,'admin_id':admin_id,'instruction':instruction,'stu_max':stuNum_max}; 
	  // alert(JSON.stringify(jsondata));
	   
	  $.ajax({
		  url: Webversion + "/center_zone",
		  type: "POST",
		  data: jsondata,
		  dataType: "json",
		  success: function (result) {
			  
			  $('#addSchool').dialog('close');
			  // 重新刷新数据列表
			 pager.pagination("select",1);
		  },
		  error: function (result) {
			   
			  $.messager.alert('错误', '新校区创建失败!', 'error');
		  }
	  });
}

 
//查询校区一条数据
function selZone(){
	
	var sName = $('#schoolName').val();
	
	if(($.trim(sName))!=""&&getvarcharVal(sName)<=48){
		 
		$.ajax({
			url: Webversion + "/center_zone",
			type: "POST",
			dataType: "json",
			//data:{action:'list','condition':'center_name^'+sName},
			data:{action:'verify','key':'zone_name','value':sName},
			beforeSend: function (request) {
						request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
					},
			success: function (result) {
				
				var sel_list = result.flag;
				 
				if(sel_list){
					$('#schoolName_Ms').html('&nbsp;校区名称已存在！');
				}else{
					$('#schoolName_Ms').html('&nbsp;<img src="../images/ok.png"/>');	
				}
				 
			},
			error: function (result) {
				
				$.error('加载数据失败！');
			}
		});
	}else{
		if(getvarcharVal(sName)>=48){
			$('#schoolName_Ms').html('&nbsp;校区名称不能大于50字符！');
		}else{
			$('#schoolName_Ms').html('&nbsp;校区名称不能为空！');
		}
		
	}
}

  
//查询人员
function selPersion(sp_temp,olddata){
	 
	$.ajax({
		url: Webversion + "/center_zone_admin",
		type: "GET",
		dataType: "json",
		data:{action:'free_list'},
		beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
		},
		success: function (result) {
			var demp = olddata;
			 
			if(result.list!=null){
				  $.each(result.list,function(i,list){
					  var temp = {};
					  temp.id = list.id;
					  temp.name = list.realname;
					  demp.push(temp);
					  
				  });
	  
			}
			//alert(JSON.stringify(demp));
			$('#schoolPrincipal').combobox({
						data:demp,
						valueField:'id',
						textField:'name'
			});
		    eval(sp_temp);
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
	
}

 
// 查看校区内容
function SelectZoneName(value, index) {

     
    // 获取校区相关数据
    var rowData = ($('#schoolmanager').datagrid('getData').rows)[index];

    $("#See_wdialog").dialog({
        iconCls: 'icon-save',
        title: '查看校区信息',
        width: 520,
        height: 250,
        closed: true,
        cache: false,
        modal: true,
        onOpen: function () {
             
			$('#zone_nameT').html(rowData.name);
			$('#zone_cityT').html(rowData.city);
			$('#zone_addrT').html(rowData.address);
			$('#zone_adminT').html(rowData.realname);
            
        },
        buttons: [{
            text: '关闭',
            iconCls: 'icon-ok',
            handler: function () {
                $('#See_wdialog').dialog('close');
            }
        }]
    });

    $('#See_wdialog').dialog('open');

}


// 修改校区名称111
function EditZoneName(value, index) {

     
    // 获取校区相关数据
    var rowData = JSON.stringify(($('#schoolmanager').datagrid('getData').rows)[index]);
    var updateOpen = "updateOpen("+rowData+");";
	var updateHand = "updateHand("+rowData+");";
	alertCreate("#addSchool",'修改校区信息',520,250,updateOpen,updateHand,'修改','取消');
    $('#addSchool').dialog('open');

}


//修改校区页面加载成功  open
function updateOpen(rowData){
	  
	  validate_form("#addSchoolForm","#schoolName","#schoolName_Ms","#schoolAddrP","#schoolAddrP_Ms","#schoolAddrC","#schoolAddrC_Ms","#schoolAddrDetail","#schoolAddrDetail_Ms","#hiddenteacherid",1);
	  
	  $('#schoolName').val(rowData.name);
	  //$('#schoolName').attr('disabled',true);
	  //$('#checkname').hide();
	  var selected = "$('#schoolAddrP').combobox('setValue',"+rowData.Pid+");"; 
	  var select_city = "$('#schoolAddrC').combobox('setValue',"+rowData.cityid+");";
	  
	  var stu_max = $('#stuNum_max').val(rowData.stu_max);
	  if(type_zoneTemp==2){
		  $('#stuNum_max').css("background","#ccc");
		  $('#stuNum_max').attr('readOnly',true);
	  }else{
		  $('#stuNum_max').css("background","");
		  $('#stuNum_max').removeAttr('readOnly');
	  }
	  provinceList(selected,select_city,rowData.Pid);
	  $('#schoolAddrDetail').val(rowData.address);
	  
	   var old_data = [{"id":'请选择',"name":'请选择'},{"id":rowData.admin_id,"name":rowData.realname}];
	   
			var sp_temp ="";
	  		if(rowData.admin_id==""||rowData.realname==""){
		  		old_data=[{"id":'请选择',"name":'请选择'}];
	  		}
			if(rowData.admin_id!=null){
				sp_temp = "$('#schoolPrincipal').combobox('select',"+rowData.admin_id+");";
				 
			}else{
				sp_temp=null;
			}
			selPersion(sp_temp,old_data);
	  
}

//修改校区页面逻辑操作
function updateHand(rowData){
	 
	/*---循环验证begin*/
	var addSCtemp = true;
	$.each($('.addSchoolForm'),function(ii,obj){  
		if(($(obj).html()).indexOf('ok.png')<0){
			addSCtemp = false;
			$.messager.alert('温馨提示', '信息不符合要求,请按要求填写！', 'info');	
			 
			return false;   //退出each循环,  加false;
			
	}});
	if(!addSCtemp){return false;}
	/*---验证end*/
	var zone_name = $("#schoolName").val();
	var province_id = $('#schoolAddrP').combobox('getValue');
	var city_id = $('#schoolAddrC').combobox('getValue');
	var address = $('#schoolAddrDetail').val();
	var admin_id = $('#schoolPrincipal').combobox('getValue');
	var instruction ="";
	if(admin_id=="请选择"){
		  admin_id = null ;
	}
	var stuNum_max = $('#stuNum_max').val();
	if(isNaN(parseInt(stuNum_max))){
	   $.messager.alert('温馨提示', '学生上限只能输入数字！', 'info');
	   return false;
	}else{
		 var centercounts_res = check_max_counts(UserInfo.center_id);
		 var reality_counts = centercounts_res.center_count_info.center_zone_count;
		 var center_stu_max_counts = centercounts_res.center_count_info.center_max_info.student_max_count;
		 var max_counts = centercounts_res.center_count_info.zone_info;
		 if(center_stu_max_counts!=0){
			 var center_stu_nums = center_stu_max_counts;  
			 var zones_stu_nums = 0;
			 if(max_counts!=null&&max_counts!=""){
				 $.each(max_counts,function(i,n){
					 if(rowData.zone_id!=n.id){
						zones_stu_nums += parseInt(n.student_max_count);
					 }
				 }); 
			}else{
				zones_stu_nums = 0;
			} 
		   if((center_stu_nums-zones_stu_nums-parseInt(stuNum_max))<0){
				$.messager.alert('温馨提示', '剩余学生数不够，本校区只能添加'+(center_stu_nums-zones_stu_nums)+'个学生！', 'info');	 
				return false;	   
		   }
		 }
	  }
	  
	var jsondata = {'action':'edit','id':rowData.id ,'type':type_zoneTemp,'zone_id':rowData.zone_id, 'zone_name':zone_name, 'province_id': province_id,'city_id':city_id,'address':address,'admin_id':admin_id,'instruction':instruction,'stu_max':stuNum_max};
	$.ajax({
		type: "POST",
		dataType: "json",
		url: Webversion + "/center_zone",
		data: jsondata,
		beforeSend: function (request) {
				request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
			},
		success: function (result) {
			
			 
			$('#addSchool').dialog('close');
			$.remind('校区名称修改成功！');
			var pager = $('#schoolmanager').datagrid("getPager");
			pager.pagination("select");
		}, error: function (result) {
			 
			$.error('系统出现异常，校区名称修改失败！');
		}
	});

}



//更改启用和停运状态值

function changestart(staId){
	
	$.ajax({
		url: Webversion + "/center_zone",
		type: "POST",
		dataType: "json",
		data: {'action':'active_switch','id':staId},
		beforeSend: function (request) {
				request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
			},
		success: function (result) {
			if(result.flag){
				$.messager.alert('温馨提示', '状态修改成功！', 'info');
				pager.pagination("select", 1);
			}else{
				$.messager.alert('温馨提示', '状态修改失败！', 'info');
			}
			
		  
		}, error: function (result) {
			 
			$.error('系统出现异常，链接数据失败！');
		}
	});
}


//验证表单
function valida_null(a){
	var sss = $(a).val();	
	if(sss.length<=0){
		if(a.id=='schoolName'){
			$('#schoolName_Ms').html('&nbsp;校区名称不能为空!');
		
		}else if(a.id=='schoolAddrDetail'){
			$('#schoolAddrDetail_Ms').html('&nbsp;详细地址不能为空!');	
	
		}
	} 
}

function validate_form(form,name,name_ms,sheng,sheng_ms,shi,shi_ms,address,address_ms,teacherid,type){
	$(teacherid).attr('flag', 'e');
    $(teacherid).val('');
    $(form)[0].reset();
	if(type==0){
		$(name_ms).html('&nbsp;校区名称不能为空!');
		$(address_ms).html('&nbsp;详细地址不能为空!');
		$(shi_ms).html(',市不能为空！');	
		$(sheng_ms).html('&nbsp;省');
	}else if(type==1){
		$(name_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(address_ms).html('&nbsp;<img src="../images/ok.png"/>');
	    $(sheng_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(shi_ms).html('&nbsp;<img src="../images/ok.png"/>');
	}
	 
    // 定义负责人验证方式
    $.extend($.fn.validatebox.defaults.rules, {
		CheckUserName: {     //验证用户名存在与否  不存在的情况下才能注册
            validator: function (value, param) {
                $(name_ms).html("");
				$(teacherid).attr('flag', 'e');
                $(teacherid).val('');
			 
				/*(/^\s+$/i.test(value))||*/ 
				
				if ((/^\s+$/i.test(value))||value.length<=0) {
					 
					$(name_ms).html('&nbsp;校区名称不能为空！');
					return ; 
					
                }else if(getvarcharVal(value)>=48){
					$(name_ms).html('&nbsp;校区名称不能大于50个字符！');
					 return ; 
				}else if(getvarcharVal(value)>=0&&getvarcharVal(value)<=48){
					 
					 $(name_ms).html('&nbsp;&nbsp;请点击验证！');
					 return true;
				}
                 
            },
            message: '&nbsp;校区名称不能为空！'
        },
        CheckSAddress: {
            validator: function (value, param) {
                $(address_ms).html("");
                $(teacherid).attr('flag', 'e');
                $(teacherid).val('');
                
                if (/^\s+$/i.test(value)||value<=0) {
					$(address_ms).html('&nbsp;校区地址不能为空！');
                    return false;
                }else{
					 $(address_ms).html('&nbsp;<img src="../images/ok.png"/>');
                	 return true;	
				}
               
            },
            message: '&nbsp;校区地址不能为空！'
        }
    });
 
	$(name).validatebox({  //学校名称验证
        required: true,
        validType: "CheckUserName",
        missingMessage: '&nbsp;该项不能为空！'
    });
	$(address).validatebox({  //学校详细地址验证
        required: true,
        validType: "CheckSAddress",
        missingMessage: '&nbsp;详细地址不能为空！'
    });
	 
	$(sheng).combobox({   //验证单选下来列表combobox
            
			editable:false,
            onChange: function (rec) {
               if(rec!=0){
				 $(sheng_ms).html('&nbsp;<img src="../images/ok.png"/>');
			   }else{
			   	  $(sheng_ms).html('&nbsp;省(地区)不能为空！');	
			   }
            }
             
     });
	 $(shi).combobox({   //验证单选下来列表combobox
            
			editable:false,
            onChange: function (rec) {
               if(rec!=0){
				 $(shi_ms).html('&nbsp;<img src="../images/ok.png"/>');
			   }else{
				    
			   	  $(shi_ms).html('&nbsp;城市不能为空！');	
				 
			   }
            }
             
     });
	 
}




//跳转链接


//跳转到教师列表
function SelTeachers(value,index,centerid){
	 
	window.location="../Corrects/Teacher_Corrects.html?zone_id="+value+"&center_id="+centerid;
}
 
//跳转到学生列表
function SelStuCorrects(value,index,centerid){
	
	var rowData = ($('#schoolmanager').datagrid('getData').rows)[index];
	window.location="../Corrects/Students_Summary.html?zone_id="+value+"&center_id="+centerid;
}