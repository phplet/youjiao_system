var UserInfo = {};
var pager="";
$().ready(function () {
	$('document').KeyInput($("#SchoolText"), '请输入姓名');
    UserInfo = $.evalJSON($.cookie("UserInfo"));
      
    
	var columnsjson = [[
	
		    { field: 'username', title: '用户名', width: 120, align: 'center', sortable: true },
			{field: 'realname', title: '姓名', width: 80, align: 'center'},
			{field: 'gender', title: '性别', width: 80, align: 'center',hidden:true},
			{field: 'tel', title: '联系方式', width: 80, align: 'center',hidden:true},
			{field: 'note', title: '备注', width: 80, align: 'center',hidden:true},
			{field: 'center_id', title: '学校ID', width: 80, align: 'center',hidden:true},
			{field: 'subject_id', title: '学科ID', width: 80, align: 'center',hidden:true},
			{ field: 'subject', title: '学科', width: 60, align: 'center', hidden:true },
			{ field: 'email', title: '邮箱', width: 120, align: 'center', sortable: true },
            { field: 'creat_date', title: '注册时间', width: 80, align: 'center', sortable: true },
			{ field: 'name', title: '负责学校', width: 150, align: 'center', sortable: true },
            {
                field: 'status', title: '状态', width: 80, align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    if (value != null) {
                         html = value == 1 ? '已启用/<a href="#" onclick="updateUserType('+row.id+');">禁用</a>' : '<font color="#ccc">已禁用</font>/<a href="#" onclick="updateUserType('+row.id+');">启用</a>';
                    }
                    return html;
                }
            },
            {
                field: 'id', title: '操作', align: 'center',
                formatter: function (value, row, index) {
					 
                    var s = "<table><tr><td style=\"border:none;text-align:left;\"><a href=\"#\" style='color:blue;' onclick=\"SelectPerson('" + value + "'," + index + ")\">查看</a>&nbsp;<a href=\"#\" style='color:blue;' onclick=\"EditSchoolName('" + value + "'," + index + ")\">修改</a>&nbsp;<a href='#' onclick=\"reSetPass("+value+",'/center_admin');\">重置密码</a></td></tr></table>";
                    return s;
                }
            }
        ]];

		var url = 'Webversion + "/center_admin?pageno="+pageNumber+"&countperpage="+pageSize';
		var datacc = {'action':'list','condition':""};
		var functionres = 'Longding(result);';
		
		//加载列表  并且返回pager
    	pager = datagridLoad('#Educational_Set',true,'#SerToolBar',columnsjson,url,"GET","json",datacc,functionres) ;
	 

    	// 绑定搜索事件
   	 	$("#BtnSearch").click(function () {

        	if ($("#SchoolText").attr("innt") == "1") {
				$.messager.alert('温馨提示', '请输入真实姓名再搜索！', 'info');
				return;
			}else{
				var schoolNtext = 'realname@'+$("#SchoolText").val();
				var datasctext = {'action':'list','condition':schoolNtext};
				datagridLoad('#Educational_Set',true,'#SerToolBar',columnsjson,url,"GET","json",datasctext,functionres) ;
				$.messager.progress('close');
			}

    	});
		
		//绑定启用和停运状态
	   $("#startusid").combobox({
			  onSelect:function (record){
				  var startId = record.value==1?'status^1':'status^0';
				  var datastat = {'action':'list','condition':startId};
				  datagridLoad('#Educational_Set',true,'#SerToolBar',columnsjson,url,"GET","json",datastat,functionres) ;
				  
			  }
	   });

    // 绑定创建人员事件
    $("#BtnAdd").click(function () {
        
        alertCreate("#wdialog",'新增人员资料',520,420,'openfunction()','handfunction()','确认','取消');
        $('#wdialog').dialog('open');

    });

});

//加载列表页面 返回datalistTemp数组
function Longding(result){
	 
	if (result.list != null) {
		 
		var datalistTemp = [];
		$.each(result.list, function (i, n) {
			var itemtemp = {};
			itemtemp.username = n.username;
			itemtemp.gender = n.gender;
			itemtemp.tel = n.tel;
			itemtemp.note = n.note;
			itemtemp.center_id = n.center_id;
			itemtemp.subject_id = n.subject_id;
			itemtemp.realname = n.realname;
			itemtemp.subject = n.subject_name;
			itemtemp.email = n.email;
			itemtemp.creat_date = n.reg_time;
			itemtemp.name = n.center_name;
			itemtemp.status = n.status;
			itemtemp.id = n.id;
  
			datalistTemp.push(itemtemp);
  
		});
           
    }
	return datalistTemp;   
}

//创建人员页面加载成功的操作,
function openfunction(){
	$('#userName').attr('disabled',false);
	$('#checkname').show();
	validate_form("#SchoolForm","#userName","#userName_Ms","#userRealName","#userRealName_Ms","#userEmail","#userEmail_Ms","#userTel","#userTel_Ms","#userSchool","#userSchool_Ms","#userSubjects","#userSubjects_Ms","#hiddenteacherid",0); 
	var selects = "$('#userSubjects').combobox('setValue','请选择');";
	var olddata = [{'id':'请选择','center_name':'请选择'}];
	selSchoolNoPer(selects,olddata);
}

//创建人员页面的点击确认以后的操作
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
	  
	  var userName = $("#userName").val();
	  var userRealName = $("#userRealName").val();
	  var userSex = $('input[name="userSex"]:checked').val();
	  var userTel = $("#userTel").val();
	  var userEmail = $("#userEmail").val();
	  var userSubjects = $('#userSubjects').combobox('getValue');
	  var userSchool = $('#userSchool').combobox('getValue');
	  var userMessage = $('#userMessage').val();
	  var user_id = UserInfo.id;
	  if(userSubjects=="请选择"){
			userSubjects=null;  
	   }
	   if(userSchool=="请选择"){
			userSchool=null;  
	   }
	   
	   var jsondata = {'action':'add', 'user_id':user_id, 'center_id': userSchool,'user_name':userName,'real_name':userRealName,'user_sex':userSex,'user_tel':userTel,'user_email':userEmail,'subjects':userSubjects,'message':userMessage}; 
	    
	  $.messager.progress({ text: "正在创建新成员" });
	  $.ajax({
		  url: Webversion + "/center_admin",
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
			  $.messager.alert('错误', '新增人员创建失败!', 'error');
		  }
	  });
}


//启用和禁止的切换方法
function updateUserType(id){
	
	$.ajax({
		url: Webversion + "/center_admin",
		type: "POST",
		dataType: "json",
		data: {'action':'active_switch','id':id},
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

//查询未关联校长的学校
function selSchoolNoPer(selects,olddata){
	$.ajax({
		type: "GET",
		dataType: "json",
		url: Webversion + "/center" ,
		data: {'action':'free_list'},
		beforeSend: function (request) {
                			request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        				},
		success: function (result) {
			 
			if(result.list==null){
				result['list']=olddata; 
			}
			else{
				var rsdemp = result.list;
				result['list']=olddata;
				$.each(rsdemp,function(ii,texs){
					result.list.push(texs);
				});
			}
			//alert(JSON.stringify(olddata));
			$('#userSchool').combobox({
				data:result.list,
				valueField:'id',
				textField:'center_name'
			});
			 
			eval(selects);
		}, error: function (result) {
			$.messager.progress('close');
			$.error('系统出现异常，学校名称加载失败！');
		}
	});	

}


//查询人员一条数据 
function selPerson(){
	
	var sName = $('#userName').val();
	if(($.trim(sName))!=""){
		$.ajax({
			url: Webversion + "/center_admin",
			type: "GET",
			dataType: "json",
			//data:{action:'list','condition':'center_name^'+sName},
			data:{action:'list','condition':'username^'+sName},
			beforeSend: function (request) {
						request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
					},
			success: function (result) {
				
				 
				 
				if(result.list!=null&&result.count!=null){
					$('#userName_Ms').html('&nbsp;用户已存在！');
				}else{
					$('#userName_Ms').html('&nbsp;<img src="../images/ok.png"/>');	
				}
				 
			},
			error: function (result) {
				
				$.error('加载数据失败！');
			}
		});
	}else{
		$('#schoolName_Ms').html('&nbsp;用户不能为空！');
	}
}


// 修改校区名称
function EditSchoolName(value, index) {
	
    $.messager.progress({text:'正在获取个人信息'});
    // 获取校区相关数据
    var rowData = JSON.stringify(($('#Educational_Set').datagrid('getData').rows)[index]);
	
	var updateOpen = "updateOpen("+rowData+");";
	var updateHand = "updateHand("+rowData+");";
	alertCreate("#wdialog",'修改个人信息',520,420,updateOpen,updateHand,'修改','取消');
    $('#wdialog').dialog('open');
}


//修改人员页面加载成功  open
function updateOpen(rowData){
	  $.messager.progress('close');
	  validate_form("#SchoolForm","#userName","#userName_Ms","#userRealName","#userRealName_Ms","#userEmail","#userEmail_Ms","#userTel","#userTel_Ms","#userSchool","#userSchool_Ms","#userSubjects","#userSubjects_Ms","#hiddenteacherid",1);
	  $('#userName').val(rowData.username);
	  $('#userName').attr('disabled',true);
	  $('#checkname').hide();
	  $('#userRealName').val(rowData.realname);
	  $(":radio[name=userSex][value="+rowData.gender+"]").attr("checked","true");
	  $('#userTel').val(rowData.tel);
	  $('#userEmail').val(rowData.email);
	  $('#userSubjects').combobox('setValue',rowData.subject_id);  
	 
	  $('#userMessage').val(rowData.note);
	   var selects = "";   // 1----n   多选框   可以是数组
	  var old_data = [];
	  
	  if(rowData.center_id==null||rowData.name==null){
		  old_data=[{"id":'请选择',"center_name":'请选择'}];
		  selects = "$('#userSchool').combobox('setValue','请选择');";
	  }else{
	      old_data = [{"id":'请选择',"center_name":'请选择'},{"id":rowData.center_id,"center_name":rowData.name}]; 
		  selects = "$('#userSchool').combobox('setValue',"+rowData.center_id+");";
	  }
	  selSchoolNoPer(selects,old_data);
	  
}

//修改人员页面逻辑操作
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
	var userName = $("#userName").val();
	  var userRealName = $("#userRealName").val();
	  var userSex = $('input[name="userSex"]:checked').val();
	  var userTel = $("#userTel").val();
	  var userEmail = $("#userEmail").val();
	  var userSubjects = $('#userSubjects').combobox('getValue');
	  var userSchool = $('#userSchool').combobox('getValue');
	  var userMessage = $('#userMessage').val();
	  var user_id = rowData.id;
	 
	  if(userSubjects=="请选择"){
			userSubjects=null;  
	   }
	   if(userSchool=="请选择"){
			userSchool=null;  
	   }
	  var jsondata = {'action':'edit', 'user_id':user_id, 'center_id': userSchool,'user_name':userName,'real_name':userRealName,'user_sex':userSex,'user_tel':userTel,'user_email':userEmail,'subjects':userSubjects,'message':userMessage};
	$.messager.progress({ text: '系统正在处理' });
	 
	$.ajax({
		type: "POST",
		dataType: "json",
		url: Webversion + "/center_admin" ,
		data: jsondata,
		success: function (result) {
			$.messager.progress('close');
			$('#wdialog').dialog('close');
			$.remind('校区名称修改成功！');
			var pager = $('#Educational_Set').datagrid("getPager");
			pager.pagination("select");
		}, error: function (result) {
			$.messager.progress('close');
			$.error('系统出现异常，校区名称修改失败！');
		}
	});	

}


// 查看人员详细内容
function SelectPerson(value, index) {
	
    $.messager.progress({text:'正在获取个人信息'});
    var rowData = JSON.stringify(($('#Educational_Set').datagrid('getData').rows)[index]);
	var selopen = "selOpens("+rowData+");";
    alertSel("#SeltPerson",'查看个人信息',520,380,selopen,'关闭');
	$.messager.progress('close');
    $('#SeltPerson').dialog('open');
}
//查看人员详细的赋值
function selOpens(rowData){
	$('#sel_username').html(rowData.username);
	$('#sel_realname').html(rowData.realname);
	$("#sel_sex").html(rowData.gender==1?'男':'女');
	$('#sel_tel').html(rowData.tel);
	$('#sel_email').html(rowData.email);
	$('#sel_subject').html(rowData.subject);  
	 $('#sel_School').html(rowData.name); 
	$('#sel_note').html(rowData.note);
	//$('#selPass').html("<a href='#' onclick=\"reSetPass("+rowData.id+",'/center_admin');\">重置密码</a>");
	
}




 //验证表单为空的情况下
function valida_null(a){
	var sss = $(a).val();	
	if(sss.length<=0){  
		if(a.id=='userName'){
			$('#userName_Ms').html('&nbsp;用户名不能为空!');	
	
		}else if(a.id=='userRealName'){
			$('#userRealName_Ms').html('&nbsp;姓名不能为空!');	
	
		}else if(a.id=='userTel'){
			$('#userTel_Ms').html('&nbsp;联系方式不能为空!');	
	
		}else if(a.id=='userEmail'){
			$('#userEmail_Ms').html('&nbsp;邮箱不能为空!');
		
		}
		
		
	} 
}

 
//验证表单

function validate_form(form,name,name_ms,realname,realname_ms,email,email_ms,tel,tel_ms,school,school_ms,sub,sub_ms,teacherid,type){
	$(teacherid).attr('flag', 'e');
    $(teacherid).val('');
    $(form)[0].reset();
	if(type==0){
		$(name_ms).html('&nbsp;请输入邮箱格式!');
		$(realname_ms).html('&nbsp;请输入中文姓名,2-4位汉字！');
		$(tel_ms).html('&nbsp;联系方式为11位数字！');
		$(email_ms).html('&nbsp;用户邮箱必须为电子邮件格式！');
		/*$(sub_ms).html('&nbsp;学科不能为空!');
		$(school_ms).html('&nbsp;校区不能为空！');	*/
	}else if(type==1){
		$(name_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(realname_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(tel_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(email_ms).html('&nbsp;<img src="../images/ok.png"/>');
		/*$(school_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(sub_ms).html('&nbsp;<img src="../images/ok.png"/>');*/
	}
	
    // 定义负责人验证方式
    $.extend($.fn.validatebox.defaults.rules, {
		CheckUserName: {     //验证用户名存在与否  不存在的情况下才能注册
            validator: function (value, param) {
                $(name).html("");
             
                $(teacherid).attr('flag', 'e');
                $(teacherid).val('');
				var UserNameSum  =  6;  //判断用户名的长度
                
				///^[A-Za-z0-9]{1,}$/i.test(value)
				if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(com|cn|net)$/i.test(value)) {
					var htmltemp = "<img alt='' src='../images/imgload.gif'/>正在获取...";
                	$(name_ms).html('&nbsp;请点击验证！'); 
					return  true;
                }else{
					$(name_ms).html('&nbsp;请输入请输入邮箱格式！');
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
        missingMessage: '该项必须输入邮箱格式！'
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
	 
}

