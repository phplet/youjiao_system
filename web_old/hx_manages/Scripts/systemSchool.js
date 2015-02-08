var UserInfo = {};
var pager ="";


$().ready(function () {
	 $('document').KeyInput($("#SchoolText"),'请输入学校');
    UserInfo = $.evalJSON($.cookie("UserInfo"));
	
	zijianku_setvalues();
	
    var columns =[[
		    { field: 'name', title: '学校名称', width: 120, align: 'center', sortable: true },
			{ field: 'realname', title: '负责人', width: 80, align: 'center'},
			{ field: 'admin_id', title: 'admin_id', width: 120, hidden:true },
			{ field: 'city', title: '所在省市', width: 120, align: 'center' },
			{ field: 'cityid', title: 'cityid', width: 120, hidden:true },
			{ field: 'Pid', title: 'Pid', width: 120, hidden:true },
			{ field: 'db_ip', title: 'db_ip', width: 120, hidden:true },
			{ field: 'db_name', title: 'db_name', width: 120, hidden:true },
			{ field: 'center_type', title: 'center_type', width: 120, hidden:true },
			{ field: 'address', title: '学校地址', width: 135, align: 'center' },
			{ field: 'creat_date', title: '建立时间', width: 70, align: 'center', sortable: true },
			{ field: 'distroy_date', title: '注销时间', width: 70, align: 'center', sortable: true },
			{ field: 'zone_max', title: 'zone_max', width: 120, hidden:true },
			{ field: 'zone_type', title: 'zone_type', width: 120, hidden:true },
			{ field: 'teacher_max', title: 'teacher_max', width: 120, hidden:true },
			{ field: 'student_max', title: 'student_max', width: 120, hidden:true },
			 
            {
                field: 'status', title: '状态', width: 80, align: 'center',
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
                    var s = "<div style=\"border:none;text-align:center;\"><a href=\"#\" style='color:blue;' onclick=\"EditSchoolName('" + value + "'," + index + ")\">修改</a></div>";
                      
                    return s;
                }
            }
        ]];
    
    	readdialog('#schoolmanager',true,'#SerToolBar',columns,'icon-add','#wdialog',"");
		
		
    // 绑定搜索事件
    $("#BtnSearch").click(function () {
		 
        if ($("#SchoolText").attr("innt") == "1") {
            $.messager.alert('温馨提示', '请输入学校名称再搜索！', 'info');
            return;
        }else{
			var schoolNtext = 'center_name@'+$("#SchoolText").val();
			//'param1^value1$center_name@'+schoolNtext;
			readdialog('#schoolmanager',true,'#SerToolBar',columns,'icon-add','#wdialog',schoolNtext);
			$.messager.progress('close');
		}
    });
	
	//绑定启用和停运状态
	 $("#startusid").combobox({
			onSelect:function (record){
				var startId = record.value==1?'status^1':'status^0';
				readdialog('#schoolmanager',true,'#SerToolBar',columns,'icon-add','#wdialog',startId);
			}
	 });

    // 绑定创建新校区事件
    $("#BtnAdd").click(function () {
        
        createSchool();
        $('#addSchool').dialog('open');

    });
	
	

});


//自建库判断
function zijianku_setvalues(){
	$('#zijianku_type input[type="radio"]').unbind('click');
	$('#zijianku_type input[type="radio"]').click(function(){
		var zijianku_type = $('#zijianku_type input[type="radio"]:checked').val();
		 
		if(zijianku_type==1){
			$('#zijianku_something').show();
		}else{
			$('#zijianku_something').hide();	
		}
	});

	
}

//建立数据列表  并且分页
 function readdialog(cssId,fitflag,toolbarId,columns,iconClsName,iconId,SchoolName){
	$(cssId).datagrid({
        fit: fitflag,
        remoteSort: false,
        toolbar: toolbarId,
        pagination: true,
        rownumbers: true,
		singleSelect: true,
        pagePosition: "bottom",
        pageList: [10, 40, 60, 80, 100],
        loadMsg: '正在加载数据...', 
        
        columns: columns
    });

    pager = $(cssId).datagrid("getPager");
    pager.pagination({
        onSelectPage: function (pageNumber, pageSize) {
            $(this).pagination('loading');
            //var ltemp = (pageNumber - 1) * pageSize;
			LoadSchool(pageNumber, pageSize,SchoolName);
            $(this).pagination('loaded');
        },
        buttons: [{
            iconCls: iconClsName,
            handler: function () {
                createSchool();
                $(iconId).dialog("open");
            }
        }
		
		
		]
    });

    pager.pagination("select", 1);	 
}

//加载数据列表	 
function LoadSchool(s,l,SchoolName) {
    // 加载数据列表
    $.ajax({
        url: Webversion + "/center",
        type: "GET",
        dataType: "json",
        data: {action:'list',pageno:s,countperpage:l,condition:SchoolName},
		beforeSend: function (request) {
                			request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        				},
        success: function (result) {
			 var dataGrid={};
            var datalistTemp = [];
			if(result.list!=null){
            	$.each(result.list,function(i,n){
						var itemtemp = {};
                        itemtemp.name = n.center_name;
						itemtemp.realname = n.realname;
						itemtemp.admin_id = n.admin_id;
						itemtemp.city = n.province_name+","+n.city_name;
						itemtemp.address = n.address;
                        itemtemp.creat_date = n.create_date;
						itemtemp.distroy_date = n.inactive_date;
						itemtemp.status = n.status;
						itemtemp.db_ip = n.db_ip;
						itemtemp.db_name = n.db_name;
						itemtemp.center_type = n.center_type;
						itemtemp.id = n.id;
						itemtemp.zone_type = n.type;
                        itemtemp.Pid =  n.province_id;
						itemtemp.cityid = n.city_id;
						itemtemp.zone_max = n.zone_max_count;
						itemtemp.teacher_max = n.teacher_max_count;
						itemtemp.student_max = n.student_max_count;
                        datalistTemp.push(itemtemp);
				
				});
				dataGrid["total"]=result.count;
				dataGrid["rows"]=datalistTemp;
			}else {
				dataGrid["total"]=0;
				dataGrid["rows"]="";
				$.messager.alert('温馨提示', '数据中没有记录！', 'info');	
			
			}
            
			
			
            $('#schoolmanager').datagrid("loadData", dataGrid);
        },
        error: function (result) {
			$.error('系统出现异常，链接数据失败！');
        }
    });

}



//查询学校一条数据
function selSchool(){
	
	var sName = $('#schoolName').val();
	if(($.trim(sName))!=""&&getvarcharVal(sName)<=48){
		$.ajax({
			url: Webversion + "/center",
			type: "POST",
			dataType: "json",
			//data:{action:'list','condition':'center_name^'+sName},
			data:{action:'verify','key':'center_name','value':sName},
			beforeSend: function (request) {
						request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
					},
			success: function (result) {
				
				var sel_list = result.flag;
				 
				if(sel_list){
					$('#schoolName_Ms').html('&nbsp;学校名称已存在！');
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
			$('#schoolName_Ms').html('&nbsp;不能大于50字符！');
		}else{
			$('#schoolName_Ms').html('&nbsp;学校名称不能为空！');
		}
		 
	}
	
}

//查询人员
function selPersion(sp_temp,olddata){
	 
	$.ajax({
		url: Webversion + "/center_admin",
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

//创建新学校
function createSchool() {
        // 创建新校区
		$('#zijianku_something').hide();
		
        $("#addSchool").dialog({
            iconCls: 'icon-add',
            title: '创建新学校',
            width: 520,
            height: 370,
            closed: true,
            cache: false,
            modal: true,
            onOpen: function () {
				$('#schoolName').attr('disabled',false);
				$('#checkname').show();
                validate_form("#addSchoolForm","#schoolName","#schoolName_Ms","#schoolAddrP","#schoolAddrP_Ms","#schoolAddrC","#schoolAddrC_Ms","#schoolAddrDetail","#schoolAddrDetail_Ms","#hiddenteacherid",0);
				$('#schoolAddrC').combobox('disable');
				$('#zhiying_type').show();
				$('#daili_type').hide(); 
				provinceList(null,null,null);   //省市   //省市
				var olddata = old_data=[{"id":'请选择',"name":'请选择'}];
				selPersion(null,olddata);    //
				$('#versions_lev').combobox({
					data:[{'id':'请选择','name':'请选择'},{'id':2,'name':'优教版'},{'id':1,'name':'学校版'},{'id':3,'name':'定制版'}],
					valueField:'id',
					textField:'name'
				});
				$('#zhiyiing_type').show();
            },
            buttons: [{
                text: '确认',
                iconCls: 'icon-ok',
                handler: function () {
					 
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
					
 					var center_name = $("#schoolName").val();
					var province_id = $('#schoolAddrP').combobox('getValue');
					var city_id = $('#schoolAddrC').combobox('getValue');
					var address = $('#schoolAddrDetail').val();
					var admin_id = $('#schoolPrincipal').combobox('getValue');
					if(admin_id=="请选择"){
						admin_id = null ;
 					}
					var instruction ="";
					var zone_sums = 0;
					var teacher_sums = 0;
					var student_sums = 0;
					var zone_list = [];
					var zone_type_value = $('#addSchoolForm input[name="school_zone_tyle"]:checked').val();
					if(zone_type_value==1){
						zone_sums = $('#zone_sums').val();
						teacher_sums = $('#teacher_sums').val();
						student_sums = $('#student_sums').val();
						if(!/^[0-9]*$/.test(zone_sums)){
							$.messager.alert('温馨提示','直营模式校区个数只能为数字','info');
							return false;
						}
						if(!/^[0-9]*$/.test(teacher_sums)){
							$.messager.alert('温馨提示','直营模式老师总数只能为数字','info');
							return false;	
						}
						if(!/^[0-9]*$/.test(student_sums)){
							$.messager.alert('温馨提示','直营模式学生总数只能为数字','info');
							return false;	
						}
					}else{
						zone_sums = $('#zones_list_sums').children().length;
						  //[{'name':'校区名字','teacher_sums':1,'student_sums':2}{'name':'校区名字','teacher_sums':1,'student_sums':2}]
						var sq_temp_i = 0;
						$.each($('#zones_list_sums').children(),function(i_c,n_c){
							var zone_nameT = $(n_c).find('input').eq(0).attr('value');
							var tea_sumsT = $(n_c).find('input').eq(1).attr('value');
							var stu_sumsT = $(n_c).find('input').eq(2).attr('value');
							if($.trim(zone_nameT)==""||(!/^[0-9]*$/.test(tea_sumsT))||(!/^[0-9]*$/.test(stu_sumsT))){
								return false;	
							}else{
								zone_list.push({'zone_name':zone_nameT,'teacher_max_count':tea_sumsT,'student_max_count':stu_sumsT});
								sq_temp_i++;
							}
							
						});	
						if(zone_sums!=sq_temp_i){
							$.messager.alert('温馨提示','代理模式中信息不符合要求!','info');
							return false;	
						}
						
					}
					 
					var jsondata = {'action':'add','center_name':center_name,'type':zone_type_value, 'province_id': province_id,'city_id':city_id,'address':address,'admin_id':admin_id,'instruction':instruction,'zone_max_count':zone_sums,'teacher_max_count':teacher_sums,'student_max_count':student_sums,'zone_list':Base64.encode(JSON.stringify(zone_list))}; 
					var zijianku_radio = $('#zijianku_type input[type="radio"]:checked').val();
					if(zijianku_radio==1){
						var zijiankuip = $('#zijianku_ip').val();
						var zijiankuname = $('#zijianku_name').val();
						if($.trim(zijiankuip)!=""&&$.trim(zijiankuname)!=""){
							jsondata['db_ip']=zijiankuip;
							jsondata['db_name']=zijiankuname;
						}else{
							$.messager.alert('温馨提示', '选择有自建库没有填写自建库的IP和库名！', 'info');	
							return false;	
						}
					}
					var version_value = $('#versions_lev').combobox('getValue');
					if(version_value!='请选择'&&version_value!=""){
						 
					}else{
						version_value = 2;	
					}
					jsondata['center_type']=version_value;
					
					// alert(JSON.stringify(jsondata));
                    $.messager.progress({ text: "正在创建新学校" });
                    $.ajax({
                        url: Webversion + "/center",
                        type: "POST",
                        data: jsondata,
                        dataType: "json",
						beforeSend: function (request) {
                			request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        				},
                        success: function (result) {
                            $.messager.progress("close");
                            $('#addSchool').dialog('close');
                            // 重新刷新数据列表
                           pager.pagination("select",1);
                        },
                        error: function (result) {
                            $.messager.progress("close");
                            $.messager.alert('错误', '新校区创建失败!<br/><span style="color:red;">可能原因：被指定的校区负责人不是教师身份或系统中已存在此校区。</span>', 'error');
                        }
                    });

                }
            }, {
                text: '取消',
                iconCls: 'icon-cancel',
                handler: function () {
                    $('#addSchool').dialog('close');
                }
            }]
        });
}

//更改启用和停运状态值

function changestart(staId){
	$.ajax({
		url: Webversion + "/center",
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

// 修改学校名称
function EditSchoolName(value, index) {

    $.messager.progress({text:'正在获取学校信息'});
    // 获取校区相关数据
    var rowData = ($('#schoolmanager').datagrid('getData').rows)[index];
	 
    $("#addSchool").dialog({
        iconCls: 'icon-save',
        title: '修改校区名称',
        width: 520,
        height: 350,
        closed: true,
        cache: false,
        modal: true,
        onOpen: function () {
            $.messager.progress('close');
			validate_form("#addSchoolForm","#schoolName","#schoolName_Ms","#schoolAddrP","#schoolAddrP_Ms","#schoolAddrC","#schoolAddrC_Ms","#schoolAddrDetail","#schoolAddrDetail_Ms","#hiddenteacherid",1);
			$('#schoolName').val(rowData.name);
			$('#schoolName').attr('disabled',true);
			$('#checkname').hide();
			var selected = "$('#schoolAddrP').combobox('setValue',"+rowData.Pid+");"; 
	  		var select_city = "$('#schoolAddrC').combobox('setValue',"+rowData.cityid+");";
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
			
			$('#versions_lev').combobox({
					data:[{'id':'请选择','name':'请选择'},{'id':2,'name':'优教版'},{'id':1,'name':'学校版'},{'id':3,'name':'定制版'}],
					valueField:'id',
					textField:'name'
			});
			var zijianku_radio1 = 0;
			
			if(rowData.db_ip!=""&&rowData.db_ip!='null'&&rowData.db_ip!=null&&rowData.db_name!=""&&rowData.db_name!='null'&&rowData.db_name!=null){
				zijianku_radio1 = 1;
			}
			
			$('#zijianku_type input[value='+zijianku_radio1+']').attr('checked',true);
			if(zijianku_radio1==1){
				$('#zijianku_something').show();	
				var zijiankuip1 = rowData.db_ip;
				$('#zijianku_ip').val(zijiankuip1);
				var zijiankuname1 = rowData.db_name;
				$('#zijianku_name').val(zijiankuname1);
			}else{
				$('#zijianku_something').hide();	
			}
			var version_value1 = rowData.center_type;
			$('#versions_lev').combobox('setValue',version_value1);
			$('#addSchoolForm input[name="school_zone_tyle"]').removeAttr("center_id");
			if(rowData.zone_type==1){
				$('#addSchoolForm input[name="school_zone_tyle"][value="1"]').attr("checked",true);
				$('#addSchoolForm input[name="school_zone_tyle"][value="1"]').attr("center_id",rowData.id);
				$('#addSchoolForm input[name="school_zone_tyle"][value="1"]').attr("sums",rowData.zone_max+'$'+rowData.teacher_max+'$'+rowData.student_max);
				$('#zhiyiing_type').show();
				$('#daili_type').hide();
				
				$('#zone_sums').val(rowData.zone_max);
				$('#teacher_sums').val(rowData.teacher_max);
				$('#student_sums').val(rowData.student_max);
				
			}else{
				$('#addSchoolForm input[name="school_zone_tyle"][value="2"]').attr("checked",true);	
				$('#addSchoolForm input[name="school_zone_tyle"][value="2"]').attr("center_id",rowData.id);
				$('#daili_type').show();
				$('#zhiyiing_type').hide();
				var url_type_J = '/center';
				var Qjson_J = {'action':'zone_info','center_id':rowData.id};
				var res_J = Ajax_option(url_type_J,Qjson_J,'GET');
				var res_Jhtml = '<li zone_id="0">校区名称：<input type="text" class="zonecss_85" name="Zzone_name_01">&nbsp;&nbsp;&nbsp;老师总数：<input type="text" class="zonecss" value="0" name="Zteacher_sums_01">&nbsp;&nbsp;&nbsp;学生总数：<input type="text" class="zonecss" value="0" name="Zstu_sums_01">&nbsp;&nbsp;<a onclick="add_zoneTypeZ(this)" href="javascript:void(0)">增加</a></li>';
				if(res_J.zone_info!=null&&res_J.zone_info!=""){
					res_Jhtml = '';
					$.each(res_J.zone_info,function(i_J,n_J){
						if(i_J==0){
							res_Jhtml = '<li zone_id="'+n_J.id+'">校区名称：<input type="text" class="zonecss_85" name="Zzone_name_01" value="'+n_J.zone_name+'">&nbsp;&nbsp;&nbsp;老师总数：<input type="text" class="zonecss" value="'+n_J.teacher_max_count+'" name="Zteacher_sums_01">&nbsp;&nbsp;&nbsp;学生总数：<input type="text" class="zonecss" value="'+n_J.student_max_count+'" name="Zstu_sums_01">&nbsp;&nbsp;<a onclick="add_zoneTypeZ(this)" href="javascript:void(0)">增加</a></li>';
						}else{
							res_Jhtml += '<li zone_id="'+n_J.id+'">校区名称：<input type="text" class="zonecss_85" name="Zzone_name_0'+(n_J+1)+'"  value="'+n_J.zone_name+'">&nbsp;&nbsp;&nbsp;老师总数：<input type="text" class="zonecss" value="'+n_J.teacher_max_count+'" name="Zteacher_sums_0'+(n_J+1)+'">&nbsp;&nbsp;&nbsp;学生总数：<input type="text" class="zonecss" value="'+n_J.student_max_count+'" name="Zstu_sums_0'+(n_J+1)+'"></li>';
						}
					});	
				}
				
				$('#zones_list_sums').html(res_Jhtml);
				
			}
			
			
            //$('#wdialog').val(rowData.name);
        },
        buttons: [{
            text: '修改',
            iconCls: 'icon-edit',
            handler: function () {
				 
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
                var center_name = $("#schoolName").val();
				var province_id = $('#schoolAddrP').combobox('getValue');
				var city_id = $('#schoolAddrC').combobox('getValue');
				var address = $('#schoolAddrDetail').val();
				var admin_id = $('#schoolPrincipal').combobox('getValue');
				var instruction ="";
				
				var zone_sums_1 = 0;
				var teacher_sums_1 = 0;
				var student_sums_1 = 0;
				var zone_list = []; 
				if(admin_id=="请选择"){
		  			admin_id = null ;
	  			}
				
				 
				var zone_type_value = $('#addSchoolForm input[name="school_zone_tyle"]:checked').val();
				if(zone_type_value==1){
					zone_sums_1 = $('#zone_sums').val();
					teacher_sums_1 = $('#teacher_sums').val();
					student_sums_1 = $('#student_sums').val();
					if(!/^[0-9]*$/.test(zone_sums_1)){
						$.messager.alert('温馨提示','直营模式校区个数只能为数字','info');
						return false;
					}
					if(!/^[0-9]*$/.test(teacher_sums_1)){
						$.messager.alert('温馨提示','直营模式老师总数只能为数字','info');
						return false;	
					}
					if(!/^[0-9]*$/.test(student_sums_1)){
						$.messager.alert('温馨提示','直营模式学生总数只能为数字','info');
						return false;	
					}
				}else{
					zone_sums_1 = $('#zones_list_sums').children().length;
					 //[{'name':'校区名字','teacher_sums':1,'student_sums':2}{'name':'校区名字','teacher_sums':1,'student_sums':2}]
					var sq_temp_i = 0;
					$.each($('#zones_list_sums').children(),function(i_c,n_c){
						var zone_nameT = $(n_c).find('input').eq(0).attr('value');
						var tea_sumsT = $(n_c).find('input').eq(1).attr('value');
						var stu_sumsT = $(n_c).find('input').eq(2).attr('value');
						if($.trim(zone_nameT)==""||(!/^[0-9]*$/.test(tea_sumsT))||(!/^[0-9]*$/.test(stu_sumsT))){
							return false;	
						}else{
							if($(n_c).attr('zone_id')!=0){
								zone_list.push({'zone_id':$(n_c).attr('zone_id'),'zone_name':zone_nameT,'teacher_max_count':tea_sumsT,'student_max_count':stu_sumsT});
							}else{
								zone_list.push({'zone_name':zone_nameT,'teacher_max_count':tea_sumsT,'student_max_count':stu_sumsT});
							}
							sq_temp_i++;
						}
						
					});	
					if(zone_sums_1!=sq_temp_i){
						$.messager.alert('温馨提示','代理模式中信息不符合要求!','info');
						return false;	
					}
				}
				 
				var jsondata = {'action':'edit', 'id':value ,'center_name':center_name,'type':zone_type_value, 'province_id': province_id,'city_id':city_id,'address':address,'admin_id':admin_id,'instruction':instruction,'zone_max_count':zone_sums_1,'teacher_max_count':teacher_sums_1,'student_max_count':student_sums_1,'zone_list':Base64.encode(JSON.stringify(zone_list))};
				 
				var zijianku_radio = $('#zijianku_type input[type="radio"]:checked').val();
				if(zijianku_radio==1){
					var zijiankuip = $('#zijianku_ip').val();
					var zijiankuname = $('#zijianku_name').val();
					if($.trim(zijiankuip)!=""&&$.trim(zijiankuname)!=""){
						jsondata['db_ip']=zijiankuip;
						jsondata['db_name']=zijiankuname;
					}else{
						 
						$.messager.alert('温馨提示', '选择有自建库没有填写自建库的IP和库名！', 'info');	
						return false;	
					}
				}else{
					jsondata['db_ip']=null;
					jsondata['db_name']=null;
				}
				var version_value = $('#versions_lev').combobox('getValue');
				if(version_value!='请选择'&&version_value!=""){
					 
				}else{
					version_value = 2;	
				}
				jsondata['center_type']=version_value;
				
                $.ajax({
                    type: "POST",
                    dataType: "json",
                    url: Webversion + "/center",
                    data: jsondata,
					beforeSend: function (request) {
                		request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        			},
                    success: function (result) {
                        $.messager.progress('close');
                        $('#addSchool').dialog('close');
                        $.remind('学校名称修改成功！');
                        var pager = $('#schoolmanager').datagrid("getPager");
                        pager.pagination("select");
                    }, error: function (result) {
                        $.messager.progress('close');
                        $.error('系统出现异常，学校名称修改失败！');
                    }
                });

            }
        },
        {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#addSchool').dialog('close');
            }
        }]
    });

    $('#addSchool').dialog('open');

}

//省市联动查询   省
function provinceList(selects,select_city,cpid){
		
		$.ajax({
                url: Webversion + "/province",
                type: "GET",
                dataType: "json",
				data:{action:'list'},
				beforeSend: function (request) {
                			request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        				},
                success: function (result) {
					
					$('#schoolAddrP').combobox({
						data:result,
						valueField:'id',
						textField:'name',
						onLoadSuccess:function(){
						 
							if(cpid!=null){
								cityList(cpid,select_city);
								cpid=null;
							}
						  
						},
						onSelect:function (record){
							cityList(record.id,null);
						}
					});
					if(selects!=null){
						eval(selects);
					}
                },
                error: function (result) {
                    
                    $.error('加载数据失败！');
                }
            });	

}
//省市联动查询   市
function cityList(Pid,city_id){
	 
	 if(Pid!=null){
		$.ajax({
                url: Webversion + "/city",
                type: "GET",
                dataType: "json",
				data:{action:'list',provinceid:Pid},
				beforeSend: function (request) {
                			request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        				},
                success: function (result) {
					  
					$('#schoolAddrC').combobox({
						enable:true,
						data:result,
						valueField:'id',
						textField:'name'
						 
					});
					 if(city_id!=null){
					 	eval(city_id);
					 }
                },
                error: function (result) {
                    
                    $.error('加载数据失败！');
                }
            });	
	 }
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
					
                }else{
					 
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


function change_zone_ytpe(type_zone){
	
	if(type_zone==1){
		$('#zhiyiing_type').show();
		$('#daili_type').hide();
		var center_idstesQ = $('#addSchoolForm input[name="school_zone_tyle"][value="1"]').attr("center_id");
		if(center_idstesQ){
			var center_idstesQ_nums = $('#addSchoolForm input[name="school_zone_tyle"][value="1"]').attr("sums");
			$('#zone_sums').val(center_idstesQ_nums.split('$')[0]);
			$('#teacher_sums').val(center_idstesQ_nums.split('$')[1]);
			$('#student_sums').val(center_idstesQ_nums.split('$')[2]);	
		}else{
			$('#zhiyiing_type input').val(0);
		}
		
		
	}else{
		$('#zhiyiing_type').hide();
		$('#daili_type').show();
		var center_idstes = $('#addSchoolForm input[name="school_zone_tyle"][value="2"]').attr("center_id");
		console.log(center_idstes);
		if(center_idstes){
	 	
				var url_type_J = '/center';
				var Qjson_J = {'action':'zone_info','center_id':center_idstes};
				var res_J = Ajax_option(url_type_J,Qjson_J,'GET');
				var res_Jhtml = '<li zone_id="0">校区名称：<input type="text" class="zonecss_85" name="Zzone_name_01">&nbsp;&nbsp;&nbsp;老师总数：<input type="text" class="zonecss" value="0" name="Zteacher_sums_01">&nbsp;&nbsp;&nbsp;学生总数：<input type="text" class="zonecss" value="0" name="Zstu_sums_01">&nbsp;&nbsp;<a onclick="add_zoneTypeZ(this)" href="javascript:void(0)">增加</a></li>';
				if(res_J.zone_info!=null&&res_J.zone_info!=""){
					res_Jhtml = '';
					$.each(res_J.zone_info,function(i_J,n_J){
						if(i_J==0){
							res_Jhtml = '<li zone_id="'+n_J.id+'">校区名称：<input type="text" class="zonecss_85" name="Zzone_name_01" value="'+n_J.zone_name+'">&nbsp;&nbsp;&nbsp;老师总数：<input type="text" class="zonecss" value="'+n_J.teacher_max_count+'" name="Zteacher_sums_01">&nbsp;&nbsp;&nbsp;学生总数：<input type="text" class="zonecss" value="'+n_J.student_max_count+'" name="Zstu_sums_01">&nbsp;&nbsp;<a onclick="add_zoneTypeZ(this)" href="javascript:void(0)">增加</a></li>';
						}else{
							res_Jhtml += '<li zone_id="'+n_J.id+'">校区名称：<input type="text" class="zonecss_85" name="Zzone_name_0'+(n_J+1)+'"  value="'+n_J.zone_name+'">&nbsp;&nbsp;&nbsp;老师总数：<input type="text" class="zonecss" value="'+n_J.teacher_max_count+'" name="Zteacher_sums_0'+(n_J+1)+'">&nbsp;&nbsp;&nbsp;学生总数：<input type="text" class="zonecss" value="'+n_J.student_max_count+'" name="Zstu_sums_0'+(n_J+1)+'"></li>';
						}
					});	
				}
				
				$('#zones_list_sums').html(res_Jhtml);	
		}else{
			$('#daili_type ul').html('<li>校区名称：<input type="text" name="Zzone_name_01"  class="zonecss_85"/>&nbsp;&nbsp;&nbsp;老师总数：<input type="text"  name="Zteacher_sums_01" value="0" class="zonecss"/>&nbsp;&nbsp;&nbsp;学生总数：<input type="text" name="Zstu_sums_01" value="0" class="zonecss"/>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="add_zoneTypeZ(this)">增加</a></li>');		
		}
		 
	}
	
}

function add_zoneTypeZ(ef){
	var nums_tname = $('#zones_list_sums li:last').children('input:first').attr('name');
	var nums_t = (parseInt(nums_tname.split('_')[2])+1);
	var htmls = '<li zone_id="0">校区名称：<input type="text" name="Zzone_name_0'+nums_t+'"  class="zonecss_85"/>&nbsp;&nbsp;'+
                            '&nbsp;老师总数：<input type="text"  name="Zteacher_sums_0'+nums_t+'" value="0" class="zonecss"/>&nbsp;&nbsp;'+
                            '&nbsp;学生总数：<input type="text" name="Zstu_sums_0'+nums_t+'" value="0" class="zonecss"/>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="dele_zoneTypeZ(this)">删除</a></li>';
	$('#zones_list_sums').append(htmls);
	
}

function dele_zoneTypeZ(et){
	$(et).parent().remove();	
}