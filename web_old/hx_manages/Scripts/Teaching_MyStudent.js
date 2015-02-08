 var UserInfo = {};
var centerAll={};
var page ="";
var subject=[];
var subjecttempQT=[];
var subcssid = 0;
var teaching_classtype = "";
var teaching_classid = "";
var stuname_Tnone_datas = "";
var zone_type_num = 1;
var smallteacher_list = [{'id':'请选择','name':'请选择'}];
$().ready(function() {
      UserInfo = $.evalJSON($.cookie("UserInfo"));
	  centerAll = $.evalJSON($.cookie("centerAll"));
	 teaching_classtype = getUrlParam('class_type');
	 teaching_classid = getUrlParam('class_id');
	  window.parent.tree_select('报班管理');
     $('#EditClass').css('display','none');
	 $('#students_counts').panel({  
	    title:"&nbsp;报班管理&nbsp;>>&nbsp;"+public_Bigclass_name+"管理",
		 
		onOpen:function(){
			$('.public_classnames').attr('title',public_Bigclass_name+'学生管理');
			$('#details').tabs({
       			 width: $("#details").parent().width(),
        		 height: "auto",
				 tools:"#tab-tools",
    	 		 onSelect:function(title){
					 var version_level = $.cookie("version_level");
					  if(version_level!=""&&version_level!=null){
						version_level = Base64.decode(version_level);
						if(version_level==1){
							$('#details').tabs('close','1对1学生管理');
							$('#classtype2').hide();
							$('#sersion_level_2').hide();
							$('#version_level_tab').hide();
						}
					  }
					 if(title==(public_Bigclass_name+"学生管理")){
						 $('.panel-title').html('&nbsp;报班管理&nbsp;>>&nbsp;'+public_Bigclass_name+'学生管理');
						 //$('#addclass').linkbutton({disabled:false});
						 //bigClass();
						 bigselect_setclassesV();
						 //bigClassstatus(1,1);
						 $('#class_type_one').combobox("clear"); 
						 $('#class_type_one').combobox("disable"); 
					  }else if(title=="1对1学生管理"){
						 
						 $('.panel-title').html('&nbsp;报班管理&nbsp;>>&nbsp;1对1学生管理');
						 
						 //$('#addclass').linkbutton({disabled:true});
						// oneToCounts("record",""); 
						 if(smallteacher_list!=null&&smallteacher_list!=""){
							 
							 
							 var reteacher_T = Ajax_option('/class',{'action':'list','fresh':1,'condition':"center_id^"+centerAll.center_id+"$zone_id^"+$('#A_zones',window.parent.document).find("option:selected").val()+"$class_type^2"},"GET");
							 smallteacher_list = [{'id':'请选择','name':'请选择'}];
							 
							 $.each(reteacher_T.list,function(list_i,list_n){
									smallteacher_list.push({'id':list_n.id,'name':list_n.class_name});
							 });
							 
							 $('#class_type_one').combobox({
								data:smallteacher_list,
								valueField:'id',
								textField:'name',
								onLoadSuccess:function(){
									
									$(this).combobox("setValue",smallteacher_list[0].id);
								},
								onChange:function(newvalues,oldvalues){
									if(newvalues!='请选择'){
										oneToCounts(parseInt(newvalues),"");
									}else{
										oneToCounts("record",""); 	
									}
								}
							 });
						 }else{
							 
							 $('#class_type_one').combobox("clear"); 
						 	 $('#class_type_one').combobox("disable"); 
						 }
						 //$('#bigclass_Name').combobox("clear"); 
						 //$('#bigclass_Name').combobox("disable"); 
						 
					  }else if(title=="未报班学生管理"){
						  //$('#bigclass_Name').combobox("clear"); 
						  //$('#bigclass_Name').combobox("disable"); 
						  $('#class_type_one').combobox("clear"); 
						  $('#class_type_one').combobox("disable"); 
						  $('.panel-title').html('&nbsp;报班管理&nbsp;>>&nbsp;未报班学生管理');
						  past_bigclass_status();
						  
					 }
					//alert(title+' is selected');  //判断每个每个列表 更新列表
				 }
			}); //方便右边块宽度自适应	
		
		}
	 });
	 
	subject = subject_Longding();   //加载本小区学科方法
	 
	 
	
	//绑定已存在学生搜索BtnaddSearthTeacher
	 
	$("#BtnaddSearthTeacher").click(function () {
		 
		 if($("#addSeaTeacher").attr("innt") == "1"){
			 $.messager.alert('温馨提示', '请输入真实姓名再搜索！', 'info');
	     }else{
			var text_addSeaTeacher = $('#addSeaTeacher').val(); 
			search_otherT(text_addSeaTeacher);//加载列表
		 }
    });
	
	//绑定大班学生名称查询
	 $('document').KeyInput($("#stu_realname"), '请输入姓名');
	 $('#BtnSearch_stu').click(function(){
		if($("#stu_realname").attr("innt") == "1"){
			 $.messager.alert('温馨提示', '请输入真实姓名再搜索！', 'info');
	     }else{
			var stu_realname = $('#stu_realname').val();
			bigClassCounts("seaname",stu_realname);
		 }
	 });
	 
	 //绑定小班学生名称查询
	 $('document').KeyInput($("#Tstu_realname"), '请输入姓名');
	 $('#BtnSearch_Tstu').click(function(){
		if($("#Tstu_realname").attr("innt") == "1"){
			 $.messager.alert('温馨提示', '请输入真实姓名再搜索！', 'info');
	     }else{
			var Tstu_realname = $('#Tstu_realname').val();
			oneToCounts("seaname",Tstu_realname);
		 }
	 });
	 
	// 绑定批量创建新学生事件
    $("#addMoreStus").click(function () {
		 $('#showaddMoreStus').show();
		 $('#main').show();
		 $('#main_list').hide();
         createMoreStus();
        $('#showaddMoreStus').dialog('open');

    });
	
	
	// 绑定学生创建事件
    $("#addStudents").click(function () {
		$('#EditClass').css('display','block');
		alertCreate("#EditClass",'创建学生窗口',600,450,'openfunction()','handfunction()','确认','取消');
		$('#EditClass').dialog('open');
		
		
    });
	
	 
 
});

//大班学生管理 --给班级类型赋值
function bigselect_setclassesV(){
	//绑定班级状态
	//绑定大班过往和当前班级状态
	 $('#bigclass_status').combobox({
		 	data:[{'id':'1','name':'当前'}],					 
			valueField:'id',
			textField:'name',
		 	onLoadSuccess:function(){
				if(teaching_classid!="undefeated"&&teaching_classid!=""&&teaching_classtype!="undefeated"&&teaching_classtype!=""){
					$(this).combobox('setValue','1');
				}else{
					$(this).combobox('setValue','1');
				}
				
			},
			onChange:function(newvas,oldvas){
				 
				if(newvas!='请选择'){
				 
					bigClassstatus(parseInt(newvas),1);
					//bigClassCounts("record","",parseInt(newva));
				}
				
			}
	 });	
}


function past_bigclass_status(){
	$('#past_bigclass_status').combobox({
		data:[{'id':'0','name':'老生源'},{'id':'1','name':'新生源'}],					 
			valueField:'id',
			textField:'name',
		 	onLoadSuccess:function(){
				$(this).combobox('setValue','1');
			},
			onChange:function(newvas,oldvas){
				 
				if(newvas!='请选择'){
					  
				 	noneclass_stu(newvas);
					//bigClassstatus(parseInt(newvas),1);
					//bigClassCounts("record","",parseInt(newva));
				}
				
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
function createMoreStus() {
		
   		
        $("#showaddMoreStus").dialog({
            iconCls: 'icon-add',
            title: '批量添加学生',
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
							  $.messager.alert('温馨提示', '请查询学生用户名是否全部验证！', 'info');	
							  return false;   //退出each循环,  加false;
					  	  }
					  });
					 if(!addSCtemp){return false;}
					 
					 var tempstutnoes = [];
					 $('#nonereg input[type="text"]').each(function(ms_i, ms_n) {
                        var stuname_Tnone_i = $(this).attr("id").split('stuname_Tnone_');
						var tempstutnoe = stuname_Tnone_datas.list.registered[parseInt(stuname_Tnone_i[1])];
						tempstutnoe.username = $(this).val();
						tempstutnoes.push(tempstutnoe);
                     });
					 var url_typeTnone = '/batch_user';
					 var QjsonTnone = {'action':'batch_students','user_info':Base64.encode(JSON.stringify(tempstutnoes)),'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
					 
					 var ajax_flag = Ajax_option(url_typeTnone,QjsonTnone,"POST");
					 if(ajax_flag.flag){
						 $.messager.alert('温馨提示','批量追加学生成功！','info',function(){
							 $('#showaddMoreStus').hide();
							 $('#showaddMoreStus').dialog('close');
							 $('#details').tabs('select','未报班学生管理'); 
							// pager.pagination("select",1);
						 });
					 }
                     //$('#showaddMoreStus').hide();
					 //$('#showaddMoreStus').dialog('close');
                }
            }, {
                text: '取消',
                iconCls: 'icon-cancel',
                handler: function () {
					
                    $('#showaddMoreStus').dialog('close');
					$('#showaddMoreStus').hide();
                }
            }]
        });
} 


function  SomeSub(cssid){
	$('#'+cssid+'_Ms').html('请点击验证');
}

function subject_Longding(){
	//加载科目
	var subjects =[];
	$.ajax({
		url: Webversion + '/teacher',
		type: "GET",
		dataType: "json",
		async:false,
		data:{action:'get_small_class_teachers','center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()},
		beforeSend: function (request){
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
		success: function (result){
			if(result!=null&&result.small_class_teacher_list!=null){
			  var demp_s = [];
			  $.each(result.small_class_teacher_list,function(i,n){
				  var id = n.subject_id;
				 if(id!=null&&id!=""){
					demp_s.push(id);
				 }
			  });
			   
			  demp_s = unique(demp_s);
			  var demp_ss = [{'id':'请选择','name':'请选择'}];
			   var demp_sub_QT = [];
			  $.each(demp_s,function(idx,nn){
				  
				  var demp_id_name ={'id':nn,'name':subject_sum(parseInt(nn))}; 
				  var teachernamelist = [];
				  var iq = 0;
				  $.each(result.small_class_teacher_list,function(is,ns){
					  if(ns.subject_id==nn){
				  		  teachernamelist.push({'teacher_user_id':ns.teacher_user_id,'teacher_realname':ns.teacher_realname,'teacher_id':ns.teacher_id});
					  	  iq++;
					  }
				  });
				   demp_sub_QT.push({'id':nn,'teacher_list':teachernamelist}); 
				  demp_ss.push(demp_id_name);
				  
			  });
			 
			   
			 subjecttempQT = demp_sub_QT;
			 subjects = demp_ss;
			}
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
	return subjects;
}


//动态追加科目
function addsubject(sub,cssid){
	var htmls = '';
	 
	$.each(sub,function(i,n){
		htmls += '<option value="'+n.id+'">'+n.name+'</option>';	
    });
	$('#'+cssid).html(htmls);
}

//根据sub 动态加载教师
function changesub(subid,dd){
	 
	
	var htmlss = '<option value="请选择">请选择</option>';
    if(subjecttempQT!=null){
		   
		$.each(subjecttempQT,function(ii,nn){
			if(subid==nn.id&&nn.teacher_list!=""){
				$.each(nn.teacher_list,function(iiq,nnq){
					htmlss += '<option value="'+nnq.teacher_id+'">'+nnq.teacher_realname+'</option>';
				});
			}
		});
		$('#'+dd+'_s').html(htmlss);
		  
    }
}

//过滤被选择的科目
function resub(n,pbulic_var){
	 var cssid = $(n).attr('id');
	 
	 addsubject(subject,cssid);
	 $("select[name='classSubjects"+pbulic_var+"']").each(function(){
	 	var selid = $(this).val();
	 	if($(this).attr('id')!=cssid){
			$("#"+cssid+" option[value='"+selid+"']").remove(); 	
		}
 	});
}

//classForm   classUName  classstudys  classbeginTime  classendTime classPersons  classSubjects  classTeacher_s

 
//追加科目和教师options

function addteasub(pbulic_var){
	subcssid++;
	if((subject.length-2)>=$("select[name='classSubjects"+pbulic_var+"']").length){
		$('#addteasub'+pbulic_var).append('<dt style="height:20px;padding-top:5px; "id="cssid_'+subcssid+'">'+subcssid+'.学科&nbsp;<select id="classSubjects'+pbulic_var+'_'+subcssid+'" name="classSubjects'+pbulic_var+'"  onfocus="resub(this,\''+pbulic_var+'\');" onchange="changesub(this.value,\'classTeacher'+pbulic_var+subcssid+'\');" style="width:100px;"  name="12"  panelHeight="auto"><option value="请选择">请选择</option></select>&nbsp;&nbsp;教师&nbsp;&nbsp;<select id="classTeacher'+pbulic_var+subcssid+'_s" name="classTeacher'+pbulic_var+'_s" style="width:100px;"  name="12"  panelHeight="120"><option value="请选择">请选择</option></select>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="delteasub(\'cssid_'+subcssid+'\');">删除</a></dt>');	
	}else{
		$.messager.alert('温馨提示','学科已经添加完成！','info');	
	}
};
//删除科目和教师行
function delteasub(id){
	
	$('#'+id).remove();

};

//大班状态联动班级  
function bigClassstatus(fresh,classtypenum){
	var  freshs = fresh;
	 
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	 
	var datacc = {'action':'list','fresh':freshs,'condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+'$class_type^'+classtypenum};
	$.ajax({
		url: Webversion + '/class',
		type: "GET" ,
		async:false ,
		dataType: "json",
		data:datacc,
		success: function (result) {
			var classes = [{'id':'请选择','name':'请选择'}];
			if(result.list!=null){
				$.each(result.list,function(i,n){
					var classtemp = {};
					classtemp = {'id':n.id,'name':n.class_name};
					classes.push(classtemp);
			 	});
				  
				$('#bigclass_Name').combobox({ //学生没有在的班级
					data:classes,
					 
					valueField:'id',
					textField:'name',
					onLoadSuccess:function(){
						
						if(judgeNull(teaching_classid)!=""&&judgeNull(teaching_classtype)!=""){
							$(this).combobox('setValue',teaching_classid);
						}else{
							$(this).combobox('setValue',classes[0].id);
						}
						
					},
					onChange:function(newva,oldva){
						if(newva!='请选择'){
							bigClassCounts(parseInt(newva),"",freshs);
						}else{
							bigClassCounts("","",freshs);
						}
					}
				});
				
			}else{
				 
				$('#bigclass_Name').combobox("clear");
				$('#bigclass_Name').combobox("disable");
				bigClassCounts();
	 			$.messager.alert('温馨提示','没有相应的班级','info');
			}
			
			
		},
		error: function (result) {
			$.error('加载数据失败！');
		}
	});
}

//大班学生列表
function bigClassCounts(record,stu_realname,fraesh){
	var columnsjson =[[
			{ field: 'stu_Name', title: '用户名', width: 60, align: 'center'},
			{ field: 'stu_Real', title: '学生姓名', width: 60, align: 'center' },
			 
			{ field: 'stu_Sex', title: '性别', width: 40, align: 'center',
				formatter: function (value, row, index) {
					return value==1?'男':'女';	
				}
			},
			{ field: 'stu_Class', title: '当前年级', width: 80, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					var htmls = "";
					if(value!=""){
						htmls = edu_grade_stu(parseInt(value));
					}
					return htmls;
				}
			},
			{ field: 'stu_School', title: '在读学校', width: 60, align: 'center', sortable: true } ,
			{ field: 'class_name', title: '班级名称', width: 90, align: 'center', sortable: true },
			{ field: 'subject_id', title: '学科', width: 60, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					var htmls = '<table class="tree_li">';
					$.each(value,function(i,n){
						if(i!=value.length-1){
							htmls += '<tr><td width="57">'+subject_sum(parseInt(n))+'</td></tr>';
						}else{
							htmls += '<tr><td width="57" style="border-bottom:none;">'+subject_sum(parseInt(n))+'</td></tr>';
						}
					});	
					htmls += '</table>';
					return htmls;
				}
			} ,
			
			{ field: 'ping_Counts', title: '测评统计', width: 50, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					var htmls = '<table class="tree_li">';
					$.each(value,function(i,n){
						if(i!=value.length-1){
							htmls += '<tr><td width="57">'+n+'</td></tr>';
						}else{
							htmls += '<tr><td width="57" style="border-bottom:none;">'+n+'</td></tr>';
						}
					});	
					htmls += '</table>';
					return htmls;
				}
			} ,{ field: 'work_Counts', title: '作业统计', width: 60, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					var htmls = '<table class="tree_li">';
					$.each(value,function(i,n){
						if(i!=value.length-1){
							htmls += '<tr><td width="57">'+n+'</td></tr>';
						}else{
							htmls += '<tr><td width="57" style="border-bottom:none;">'+n+'</td></tr>';
						}
					});	
					htmls += '</table>';
					return htmls;
				}
				
			} ,
			{ field: 'ping_Grade', title: '测评等级', width: 60, align: 'center', sortable: true, hidden: true } ,
			{ field: 'creat_Time', title: '入班时间', width: 70, align: 'center', sortable: true } ,
			{ field: 'log_Time', title: '登录时间', width: 70, align: 'center', sortable: true } ,
			{ field: 'send_Time', title: '近期发送<br>报告时间', width: 70, align: 'center', hidden: true } ,
			{ field: 'center_id', title: 'center_id', width: 40,hidden:true},
			{ field: 'zone_id', title: 'zone_id', width: 60,hidden:true},
			{ field: 'class_id', title: 'class_id', width: 60, hidden:true },
			{ field: 'class_stu_id', title: 'class_stu_id', width: 60, hidden:true },
			{ field: 'stu_Email', title: 'stu_Email', width: 60, hidden:true },
			{ field: 'student_id', title: 'school_id', width: 40, hidden:true },
			{ field: 'stu_user_id', title: 'stu_user_id', width: 40, hidden:true },
			{ field: 'teacher_creator', title: 'teacher_creator', width: 40, hidden:true },
		    
			{ field: 'stu_Tel', title: 'stu_Tel', width: 60, hidden:true },
			{
                field: 'id', title: '操作', align: 'center',width: 120, 
                formatter: function (value, row, index) {
					
					//<a href=\"#\" style='color:blue;' onclick=\"histroyStudys('" + value + "'," + index + ")\">学习记录</a>&nbsp;&nbsp;<a href=\"#\" style='color:blue;' onclick=\"selSubjectInfo('" + value + "'," + index + ")\" >学习报告</a>
                    var s = "<div style='line-height:25px;'><a href=\"#\" style='color:blue;' onclick=\"editStudent('" + value + "'," + index + ",'bigClassCounts')\">修改信息</a>&nbsp;&nbsp;<a href=\"#\" style='color:blue;' onclick=\"selSrudentCorrects(1,'" + value + "'," + index + ")\">测评详情</a><br /><a href=\"#\" style='color:blue;' onclick=\"updateClassStudent(" + value + "," + index + ",1,'#bigClassCounts')\">报班管理</a></div>";
                    return s;
                }
            }
        ]];
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	var url = 'Webversion + "/student?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc ={'action':'list','condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+'$class_type^1','fresh':fraesh};
	 
	if(record!="record"&&record!="seaname"&&record!=''){
		datacc = {'action':'list','condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+'$class_type^1$class_id^'+record,'fresh':fraesh};
	}else if(record=="seaname"){
		var ss = $('#bigclass_Name').combobox('getValue');
		var sss = $('#bigclass_status').combobox('getValue');
		datacc = {'action':'list','condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+"$class_id^"+ss+"$class_type^1$realname@"+stu_realname,'fresh':sss};
		
		
		if(sss=="请选择"){
			datacc = {'action':'list','condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+"$class_id^"+ss+"$class_type^1$realname@"+stu_realname};
		}
		if(ss=="请选择"){
			datacc.condition = "center_id^"+centerAll.center_id+"$zone_id^"+zone_id+"$class_type^1$realname@"+stu_realname
		}
	}else if(record==""){
		 
		datacc ={'action':'list','condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+'$class_type^1','fresh':fraesh};
	}
	
	var functionres = 'Longding(result);';
	//加载列表  并且返回pager
	pager = datagridLoad('#bigClassCounts',true,'#day_bar',columnsjson,url,"GET","json",datacc,functionres);
}


//加载大班学生列表逻辑处理
function Longding(result){
    var datalistTemp = [];
		 
	if(result.list!=null){
		//alert(JSON.stringify(result));
		$.each(result.list,function(i,s){
				var itemtemp = {}; 
				itemtemp.student_id = s.student_id;
				itemtemp.center_id = s.center_id;
				itemtemp.zone_id = s.zone_id;
				itemtemp.id = s.student_user_id;
				itemtemp.class_name = s.class_name;
				itemtemp.class_id = s.class_id;
				itemtemp.class_stu_id = s.class_stu_id;
				itemtemp.stu_Class = s.grade;
				itemtemp.stu_School = s.school_name;
				var subject_idsT = [];
				var test_tempcounts = [];
				var work_tempcounts = []; 
				var ping_Grade = '优';
				$.each(s.class_info,function(ii,nn){
					$.each(nn,function(iii,nnn){
						subject_idsT.push(nnn.subject_id);
					});
					
				});
				
				$.each(s.stat_info,function(i_stat,n_stat){
					 
					 $.each(n_stat,function(i_c,n_c){
						 if(n_c!=null&&n_c!=""){
							 test_tempcounts.push(n_c[0].test_submit_count+' / '+n_c[0].test_total_count);
							 work_tempcounts.push(n_c[0].work_submit_count+' / '+n_c[0].work_total_count);
						 }else{
							 test_tempcounts.push('0 / 0');
							 work_tempcounts.push('0 / 0');
						 }
					 });
					 
				});
				itemtemp.subject_id = subject_idsT;
				itemtemp.work_Counts = work_tempcounts;
				itemtemp.ping_Counts = test_tempcounts;
				itemtemp.ping_Grade = ping_Grade;
				itemtemp.send_Time = '---';
				itemtemp.stu_user_id = s.student_user_id;
				itemtemp.teacher_creator = s.user_id;
				itemtemp.stu_Name = s.username;
				itemtemp.stu_Real = s.realname;
				itemtemp.stu_Sex = s.gender;
				itemtemp.stu_Email = s.email;
				itemtemp.stu_Tel = s.tel;
				if(s.create_date!=null){
					itemtemp.creat_Time = s.create_date.substring(0,10);
				}
				if(s.last_login_time!=null){
					itemtemp.log_Time = s.last_login_time.substring(0,10);
				}

				datalistTemp.push(itemtemp);
		});
		return datalistTemp;
	}
}



//1对1学生加载列表
function oneToCounts(record,Tstu_name){
	var columnsjson =[[
			{ field: 'stu_Name', title: '用户名', width: 60, align: 'center'},
			{ field: 'stu_Real', title: '学生姓名', width: 60, align: 'center' },
			{ field: 'stu_Sex', title: '性别', width: 40, align: 'center',
				formatter: function (value, row, index) {
					return value==1?'男':'女';	
				}
			},
			{ field: 'stu_Class', title: '当前年级', width: 80, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					var htmls = "";
					if(value!=""){
						htmls = edu_grade_stu(parseInt(value));
					}
					return htmls;
				}
			},
			{ field: 'stu_School', title: '在读学校', width: 60, align: 'center', sortable: true } ,
			{ field: 'subject_id', title: '学科', width: 60, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					var htmls = '<table class="tree_li">';
					$.each(value,function(i,n){
						if(i!=value.length-1){
							htmls += '<tr><td width="57">'+subject_sum(parseInt(n))+'</td></tr>';
						}else{
							htmls += '<tr><td width="57" style="border-bottom:none;">'+subject_sum(parseInt(n))+'</td></tr>';
						}
					});	
					htmls += '</table>';
					return htmls;
				}
			} ,
			{ field: 'teacher_T', title: '教师姓名', width: 60, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					var htmls = '<table class="tree_li">';
					$.each(value,function(i,n){
						if(i!=value.length-1){
							htmls += '<tr><td width="57">'+n+'</td></tr>';
						}else{
							htmls += '<tr><td width="57" style="border-bottom:none;">'+n+'</td></tr>';
						}
					});	
					htmls += '</table>';
					return htmls;
				}
				
			},
			{ field: 'ping_Counts', title: '测评统计', width: 50, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					var htmls = '<table class="tree_li">';
					$.each(value,function(i,n){
						if(i!=value.length-1){
							htmls += '<tr><td width="57">'+n+'</td></tr>';
						}else{
							htmls += '<tr><td width="57" style="border-bottom:none;">'+n+'</td></tr>';
						}
					});	
					htmls += '</table>';
					return htmls;
				}
			}  ,
			{ field: 'work_Counts', title: '作业统计', width: 60, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					var htmls = '<table class="tree_li">';
					$.each(value,function(i,n){
						if(i!=value.length-1){
							htmls += '<tr><td width="57">'+n+'</td></tr>';
						}else{
							htmls += '<tr><td width="57" style="border-bottom:none;">'+n+'</td></tr>';
						}
					});	
					htmls += '</table>';
					return htmls;
				}
				
			} ,
			
			 
			{ field: 'ping_Grade', title: '测评等级', width: 60, align: 'center', sortable: true,hidden: true  } ,
			{ field: 'creat_Time', title: '入班时间', width: 70, align: 'center', sortable: true } ,
			{ field: 'log_Time', title: '登录时间', width: 70, align: 'center', sortable: true } ,
			{ field: 'send_Time', title: '近期发送<br>报告时间', width: 70, align: 'center', hidden: true } ,
			{ field: 'center_id', title: 'center_id', width: 40,hidden:true},
			{ field: 'zone_id', title: 'zone_id', width: 60,hidden:true},
			{ field: 'class_id', title: 'class_id', width: 60, hidden:true },
			{ field: 'stu_Email', title: 'stu_Email', width: 60, hidden:true },
			{ field: 'stu_Tel', title: 'stu_Tel', width: 60, hidden:true },
			{ field: 'student_id', title: 'student_id', width: 40, hidden:true },
			{ field: 'class_stu_id', title: 'class_stu_id', width: 40, hidden:true },
			{ field: 'stu_user_id', title: 'stu_user_id', width: 40, hidden:true },
			{ field: 'teacher_creator', title: 'teacher_creator', width: 40, hidden:true },
			{ field: 'class_name', title: 'class_name', width: 40, hidden:true },
			{ field: 'status', title: 'status', width: 40, hidden:true },
			 
			{
                field: 'id', title: '操作', align: 'center',width: 120, 
                formatter: function (value, row, index) {
					var sss = "<a href=\"#\" style='color:blue;' onclick=\"editstartus(" + row.student_id + "," + row.class_stu_id + ","+row.center_id+","+row.zone_id+")\">学生结课</a>";
					/*if(row.status==0){
						sss = "<font color='#ccc'>学生结课</ront>";
					}
					<a href=\"#\" style='color:blue;' onclick=\"selSubjectInfo('" + value + "'," + index + ")\" >学习报告</a>&nbsp;&nbsp;
					<a href=\"#\" style='color:blue;' onclick=\"histroyStudys('" + value + "'," + index + ")\">学习记录</a>&nbsp;&nbsp;
					
					*/
                    var s = "<div style='line-height:25px;'><a href=\"#\" style='color:blue;' onclick=\"editStudent('" + value + "'," + index + ",'oneToCounts')\">修改信息</a>&nbsp;&nbsp;<a href=\"#\" style='color:blue;' onclick=\"selSrudentCorrects(2,'" + value + "'," + index + ")\">查看测评</a><br /><a href=\"#\" style='color:blue;' onclick=\"updateClassStudent(" + value + "," + index + ",2,'#oneToCounts')\">报班管理</a>&nbsp;&nbsp;"+sss+"</div>";
                    return s;
                }
            }                            
        ]];
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	var url = 'Webversion + "/student?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc = {'action':'list','condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+'$class_type^2'};
	if(record!="record"&&record!="seaname"){
		datacc = {'action':'list','condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+'$class_type^2$class_id^'+record};
	}else if(record=="seaname"){
		datacc = {'action':'list','condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+'$class_type^2$realname@'+Tstu_name};
	}
	var functionres = 'oneToLongding(result);';
	//加载列表  并且返回pager
	pager = datagridLoad('#oneToCounts',true,'#month_bar',columnsjson,url,"GET","json",datacc,functionres) ;  
}


//1对1学生管理逻辑处理
function oneToLongding(result) {
	 
    var datalistTemp = [];
	var teachers_lists_temp = [];	
	var teachers_id_names = []; 
	if(result.list!=null){
		// alert(JSON.stringify(result) );
		$.each(result.list,function(i,s){
		   
				var itemtemp = {};
				
				itemtemp.student_id = s.student_id;
				itemtemp.center_id = s.center_id;
				itemtemp.zone_id = s.zone_id;
				itemtemp.id = s.student_user_id;
				itemtemp.class_name = s.class_name;
				itemtemp.class_id = s.class_id;
				
				itemtemp.status = s.status;
				itemtemp.stu_Class = s.grade;
				itemtemp.stu_School = s.school_name;
				
				var subject_idsT = [];
				var teacher_Ttemp = [];
				var test_tempcounts = [];
				var work_tempcounts = []; 
				var ping_Grade = '优';
				$.each(s.class_info,function(ii,nn){
					$.each(nn,function(iii,nnn){
						var teacher_lists = {};
						subject_idsT.push(nnn.subject_id); 
						teacher_Ttemp.push(nnn.class_name);
						teacher_lists['id'] = nnn.class_id;
						teacher_lists['name'] = nnn.class_name;
						teachers_id_names.push(nnn.class_id);
						teachers_lists_temp.push(teacher_lists);
					});
					
				});
				 
				$.each(s.stat_info,function(i_stat,n_stat){
					 
					 $.each(n_stat,function(i_c,n_c){
						 if(n_c!=null&&n_c!=""){
							 test_tempcounts.push(n_c[0].test_submit_count+' / '+n_c[0].test_total_count);
							 work_tempcounts.push(n_c[0].work_submit_count+' / '+n_c[0].work_total_count);
						 }else{
							 test_tempcounts.push('0 / 0');
							 work_tempcounts.push('0 / 0');
						 }
					 });
					 
				});
				itemtemp.subject_id = subject_idsT;
				itemtemp.teacher_T = teacher_Ttemp;
				itemtemp.work_Counts = work_tempcounts;
				itemtemp.ping_Counts = test_tempcounts;
				itemtemp.ping_Grade = ping_Grade;
				itemtemp.send_Time = '---';
				 
				itemtemp.stu_Name = s.username;
				itemtemp.stu_Email = s.email;
				itemtemp.stu_user_id = s.student_user_id;
				itemtemp.teacher_creator = s.user_id;
				itemtemp.stu_Tel = s.tel;
				itemtemp.stu_Real = s.realname;
				itemtemp.class_stu_id = s.class_stu_id;
				itemtemp.stu_Sex = s.gender;
				if(s.create_date!=null){
					
					itemtemp.creat_Time = s.create_date.substring(0,10);	
				}
				if(s.last_login_time!=null){
					itemtemp.log_Time = s.last_login_time.substring(0,10);
				}
				
				datalistTemp.push(itemtemp);
				
				
		});
		 
		return datalistTemp;
	}

}

//没有班级学生的管理
function noneclass_stu(past_id){
	
	
	
	var columnsjson =[[ 
		    { field: 'stu_Name', title: '用户名', width: 60, align: 'center',checkbox:true },
			{ field: 'stu_Name2', title: '用户名', width: 120, align: 'center'},
			{ field: 'stu_Real', title: '学生姓名', width: 60, align: 'center' },
			{ field: 'stu_Sex', title: '性别', width: 40, align: 'center',
				formatter: function (value, row, index) {
					return value==1?'男':'女';	
				}
			},
			{ field: 'stu_Class', title: '当前年级', width: 80, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					var htmls = "";
					if(value!=""){
						htmls = edu_grade_stu(parseInt(value));
					}
					return htmls;
				}
			},
			{ field: 'stu_School', title: '在读学校', width: 60, align: 'center', sortable: true } ,
			 
			{ field: 'creat_Time', title: '注册时间', width: 70, align: 'center', sortable: true ,sorter:function(){
				
			}} ,
			{ field: 'log_Time', title: '登录时间', width: 70, align: 'center', sortable: true } ,
			//{ field: 'send_Time', title: '近期发送<br>报告时间', width: 70, align: 'center', sortable: true } ,
			{ field: 'center_id', title: 'center_id', width: 40,hidden:true},
			{ field: 'zone_id', title: 'zone_id', width: 60,hidden:true},
			{ field: 'class_id', title: 'class_id', width: 60, hidden:true },
			{ field: 'class_stu_id', title: 'class_stu_id', width: 60, hidden:true },
			{ field: 'stu_Email', title: 'stu_Email', width: 60, hidden:true },
			{ field: 'student_id', title: 'school_id', width: 40, hidden:true },
			{ field: 'stu_user_id', title: 'stu_user_id', width: 40, hidden:true },
			{ field: 'class_name', title: 'class_name', width: 40, hidden:true },
			{ field: 'teacher_creator', title: 'teacher_creator', width: 40, hidden:true },
			
			
			{ field: 'stu_Tel', title: 'stu_Tel', width: 60, hidden:true },
			{
                field: 'id', title: '操作', align: 'center',width: 120,
                formatter: function (value, row, index) {
                    var s = "<div style='line-height:25px;'><a href=\"#\" style='color:blue;' onclick=\"editStudent('" + value + "'," + index + ",'noneclass_stu')\">修改信息</a></div>";
					
					/*"<div style='line-height:25px;'><a href=\"#\" style='color:blue;' onclick=\"editStudent('" + value + "'," + index + ",'bigClassCounts')\">查看修改</a>&nbsp;&nbsp;<a href=\"#\" style='color:blue;' onclick=\"selSrudentCorrects('" + value + "'," + index + ")\">测评详情</a><br /><a href=\"#\" style='color:blue;' onclick=\"selSubjectInfo('" + value + "'," + index + ")\" >学习报告</a>&nbsp;&nbsp;<a href=\"#\" style='color:blue;' onclick=\"histroyStudys('" + value + "'," + index + ")\">学习记录</a><br /><a href=\"#\" style='color:blue;' onclick=\"updateClassStudent(" + value + "," + index + ",1,'#noneclass_stu')\">报班管理</a></div>"*/
                    return s;
                }
            }
        ]];
		
	 
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	var url = 'Webversion + "/class?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc = {'action':'other_stu','flag':true,'condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+"$new_student_status^"+past_id,'noclass_stu':1,'center_id':centerAll.center_id,'zone_id':zone_id};
	var functionres = 'noclassStu(result);';
	//加载列表  并且返回pager
	pager = datagridLoad('#noneclass_stu',true,'#noneclass_bar',columnsjson,url,"GET","json",datacc,functionres,false);
	$('#past_BtnSearch_stu').unbind('click');
	 $('document').KeyInput($("#past_stu_realname"), '请输入姓名');
	$('#past_BtnSearch_stu').bind('click',function(){
		
		var past_stustatus = $('#past_bigclass_status').combobox('getValue');
		var past_name = $('#past_stu_realname').val();
		if(past_name!=null&&past_name!=""&&past_name!='请输入姓名'){
			var dataccs = {'action':'other_stu','flag':true,'condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+"$new_student_status^"+past_id+'$realname@'+past_name,'noclass_stu':1,'center_id':centerAll.center_id,'zone_id':zone_id};	
			pager = datagridLoad('#noneclass_stu',true,'#noneclass_bar',columnsjson,url,"GET","json",dataccs,functionres,false);
		}else{
			$.messager.alert('温馨提示','请输入姓名！','info');
		}
		 
	});
	 
}

function getstus_more(){
	var values_stus = $('#noneclass_stu').datagrid('getSelections');
	 				 
	//updateClassStudent(value,index,type,listcss_id);
	if(values_stus!=[]&&values_stus!=null&&values_stus!=""){
		var values_stus_json = [];
		var centercounts_res = check_max_counts(UserInfo.center_id);
		var reality_counts = centercounts_res.center_count_info.center_student_count;
		var max_counts = centercounts_res.center_count_info.center_max_info.student_max_count;
		var max_stusTemp_counts = centercounts_res.center_count_info.zone_info;
		zone_type_num = centercounts_res.center_count_info.center_max_info.type;
		var zone_idT_stu = $('#A_zones',window.parent.document).find("option:selected").val();
		var zone_stu_nums = 0;
		var currite_zone_stu_nums = 0;
		 
		if(max_stusTemp_counts!=null&&max_stusTemp_counts!=""){
			$.each(max_stusTemp_counts,function(i,n){
				 if(zone_idT_stu==n.id){
					zone_stu_nums = parseInt(n.student_max_count);
					currite_zone_stu_nums = parseInt(n.student_current_count);
				 }
			 }); 
		}else{
			zone_stu_nums = 0;	
		}
		if(zone_type_num==1){
			if(zone_stu_nums==0){
				if(max_counts!=null&&max_counts!=""&&max_counts!=0){
					if(parseInt(max_counts)<=parseInt(reality_counts)){
						$.messager.alert('温馨提示','本校区学生上限：'+max_counts+'<br />现有学生：'+reality_counts+'<br />本次所选人数超出数量限制，如需改变上限值，请与本校校长联系!','info');
						
					}else{
						if(values_stus.length>(parseInt(max_counts)-parseInt(reality_counts))){
							$.messager.alert('温馨提示','本校区学生上限：'+max_counts+'<br />现有学生：'+reality_counts+'<br />本次所选人数超出数量限制，如需改变上限值，请与本校校长联系!','info');
						}else{
							$.each(values_stus,function(i,n){
								values_stus_json.push({'class_stu_id':n.class_stu_id,'student_id':n.student_id,'center_id':n.center_id,'zone_id':n.zone_id,'class_id':n.class_id,'stu_user_id':n.stu_user_id,'student_username':n.stu_Real,'student_user_id':n.stu_user_id});
							});
							updateClassStudent(values_stus_json,null,1,'#noneclass_stu');
						}
						
					}
				}else{
					$.each(values_stus,function(i,n){
						values_stus_json.push({'class_stu_id':n.class_stu_id,'student_id':n.student_id,'center_id':n.center_id,'zone_id':n.zone_id,'class_id':n.class_id,'stu_user_id':n.stu_user_id,'student_username':n.stu_Real,'student_user_id':n.stu_user_id});
					});
					updateClassStudent(values_stus_json,null,1,'#noneclass_stu');
				}
			}else{
				
				if(values_stus.length>(parseInt(zone_stu_nums)-parseInt(currite_zone_stu_nums))){
					$.messager.alert('温馨提示','本校区学生上限：'+zone_stu_nums+'<br />现有学生：'+currite_zone_stu_nums+'<br />本次所选人数超出数量限制，如需改变上限值，请与本校校长联系!','info');
				}else{
					$.each(values_stus,function(i,n){
						values_stus_json.push({'class_stu_id':n.class_stu_id,'student_id':n.student_id,'center_id':n.center_id,'zone_id':n.zone_id,'class_id':n.class_id,'stu_user_id':n.stu_user_id,'student_username':n.stu_Real,'student_user_id':n.stu_user_id});
					});
					updateClassStudent(values_stus_json,null,1,'#noneclass_stu');
				}
					
			}
		}else{
			
			if(zone_stu_nums<=currite_zone_stu_nums){
				$.messager.alert('温馨提示','本校区学生上限：'+zone_stu_nums+'<br />现有学生：'+currite_zone_stu_nums+'<br />本次所选人数超出数量限制，如需改变上限值，请与本校校长联系!','info');
				return false;	 
			}else{
				$.each(values_stus,function(i,n){
					values_stus_json.push({'class_stu_id':n.class_stu_id,'student_id':n.student_id,'center_id':n.center_id,'zone_id':n.zone_id,'class_id':n.class_id,'stu_user_id':n.stu_user_id,'student_username':n.stu_Real,'student_user_id':n.stu_user_id});
				});
				updateClassStudent(values_stus_json,null,1,'#noneclass_stu');	
			}
				
		}
	}else{
		$.messager.alert('温馨提示','请选择学生！','info');	
	}
	
}


//1对1学生管理逻辑处理
function noclassStu(result) {
	 
    var datalistTemp = [];
 
	if(result.list!=null){
		// alert(JSON.stringify(result) );
		$.each(result.list,function(i,s){
		   
				var itemtemp = {};
				var teacher_lists = {};
				itemtemp.student_id = s.student_id;
				itemtemp.center_id = s.center_id;
				itemtemp.zone_id = s.zone_id;
				itemtemp.id = s.user_id;
				itemtemp.class_name = s.class_name;
				itemtemp.class_id = s.class_id;
				
				itemtemp.status = s.status;
				itemtemp.stu_Class = s.grade;
				itemtemp.stu_School = s.school_name;
				 
				itemtemp.stu_Name2 = s.username;
				itemtemp.stu_Name = s.username;
				itemtemp.stu_Email = s.email;
				itemtemp.stu_user_id = s.user_id;
				itemtemp.teacher_creator = s.user_id;
				itemtemp.stu_Tel = s.tel;
				itemtemp.stu_Real = s.realname;
				itemtemp.class_stu_id = s.class_stu_id;
				itemtemp.stu_Sex = s.gender;
				if(s.create_date!=null){
					
					itemtemp.creat_Time = s.create_date.substring(0,10);	
				}
				if(s.last_login_time!=null){
					itemtemp.log_Time = s.last_login_time.substring(0,10);
				}
				
				datalistTemp.push(itemtemp);
				
				 
		});
		
		 
		return datalistTemp;
	}

}


//创建学生页面加载成功的操作
function openfunction(){
	subcssid=0;
	//选项卡开始
	$('#version_lev_B').html('加入'+public_Bigclass_name);
	$(".tab").unbind('click');
	$(".tab").bind('click',function() {
		$(this).addClass("now_focus");
		$(this).siblings().removeClass("now_focus");
		var $dangqian = $(".con_box > div").eq($(".tab").index(this));
		$dangqian.addClass("now_focus");
		$dangqian.siblings().removeClass("now_focus");
		//$('#addteasub select[@name="classSubjects"]').text('请选择');
		//$('#addteasub select[@name="classTeacher_s"]').text('请选择');
		
	}); 
	$('#stuUName').attr('disabled',false);
	$('#hidden_edit').show();
	$('#checkname').show();
	$.messager.progress('close');
	//StudentForm stuUName  stuRealName  stusex  stuEmail  classstudys schoolName  stuTel
	validate_form('#StudentForm','#stuUName','#stuUName_Ms','#stuRealName','#stuRealName_Ms','#stuEmail','#stuEmail_Ms','#stusex','#stusex_Ms','#classstudys','#classstudys_Ms','#schoolName','#schoolName_Ms','#stuTel','#stuTel_Ms',0);
	var  cid = centerAll.center_id;
	var zid = $('#A_zones',window.parent.document).find("option:selected").val();
	classname(cid,zid,1);   //当前校区当前班级列表
	addsubject(subject,'classSubjects');  //更新教师列表
	  
}

//创建学生页面的点击确认以后的操作
function handfunction(){
	 /*---循环验证begin*/
	  var addSCtemp = true;
	  $.each($('.stuForm'),function(ii,obj){
		  if(($(obj).html()).indexOf('ok.png')<0){
			  addSCtemp = false;
			  $.messager.alert('温馨提示', '信息不符合要求,请按要求填写！', 'info');
			  return false;   //退出each循环,加false;
	  }});
	  if(!addSCtemp){return false;}
	  /*---验证end*/
	  //StudentForm stuUName  stuRealName  stusex  stuEmail  classstudys schoolName  stuTel
	  var center_id = centerAll.center_id;
	  var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	  var stuUName= $('#stuUName').val();
	  var stuRealName = $('#stuRealName').val();
	  var stusex = $("input[@name=stusex]:checked").val();
	  var stuEmail = $('#stuEmail').val();
	  var grade = $('#classstudys').combobox('getValue');
	  var schoolName = $('#schoolName').val();
	  var stuTel = $('#stuTel').val();
	  var stuClass = $('#stuClass').combobox('getValue');
	  var class_type =0;  //1 大班  2 小班
	  var bigclassname = $('#stuClass').combobox('getValue');
	  
	  var teacher_list = [];
	 
	  $("select[name='classTeacher_s']").each(function(){
		 if($(this).val()!='请选择'&&$(this).val()!=""){
			var idd  = $(this).attr("id");
			var teacher_temp = {'id':$(this).val(),'name':$("#"+idd+" option[value='"+$(this).val()+"']").text()};
			teacher_list.push(teacher_temp);
		 }
	  });
	  
	  if(bigclassname!='请选择'||teacher_list!=""){
		  
		  var centercounts_res = check_max_counts(UserInfo.center_id);
		  var reality_counts = centercounts_res.center_count_info.center_student_count;
		  var max_counts = centercounts_res.center_count_info.center_max_info.student_max_count;
		  var max_stusTemp_counts = centercounts_res.center_count_info.zone_info;
		  zone_type_num = centercounts_res.center_count_info.center_max_info.type;
		  var zone_idT_stu = $('#A_zones',window.parent.document).find("option:selected").val();
		  var zone_stu_nums = 0;
		  var currite_zone_stu_nums = 0;
		  if(max_stusTemp_counts!=null&&max_stusTemp_counts!=""){
			  $.each(max_stusTemp_counts,function(i,n){
				   if(zone_idT_stu==n.id){
					  zone_stu_nums = parseInt(n.student_max_count);
					  currite_zone_stu_nums = parseInt(n.student_current_count);
				   }
			   }); 
		  }else{
			  zone_stu_nums = 0;	
		  }
		  if(zone_type_num==1){
			  if(zone_stu_nums==0){
				  if(max_counts!=null&&max_counts!=""&&max_counts!=0){
					  if(parseInt(max_counts)<=parseInt(reality_counts)){
						  $.messager.alert('温馨提示','本校区学生上限：'+max_counts+'<br />现有学生：'+reality_counts+'<br />现只能添加学生,不能入班操作;<br />本次所选人数超出数量限制，如需改变上限值，请与本校校长联系!','info');
						  return false;  
					  }
				  }
			  }else{ //不等于0
				  if(parseInt(zone_stu_nums)<=parseInt(currite_zone_stu_nums)){
					  $.messager.alert('温馨提示','本校区学生上限：'+zone_stu_nums+'<br />现有学生：'+currite_zone_stu_nums+'<br />本次所选人数超出数量限制，如需改变上限值，请与本校校长联系!','info');
					   return false;
				  } 
			  }
		  }else{
				if(zone_stu_nums<=currite_zone_stu_nums){
					$.messager.alert('温馨提示','本校区学生上限：'+zone_stu_nums+'<br />现有学生：'+currite_zone_stu_nums+'<br />本次所选人数超出数量限制，如需改变上限值，请与本校校长联系!','info');
					return false;	 
				}  
		  }
	  }
	  
	  if(bigclassname!="请选择"&&teacher_list!=""){
		  class_type = '1_2';
	  }else{
		  if(bigclassname!="请选择"){
			  class_type = 1;
		  }else if(teacher_list[0]!=undefined){
		  	  class_type = 2;
		  }
	 }
	   
	 var jsondata = {action:'add','center_id':center_id,'zone_id':zone_id,'username':stuUName,'realname':stuRealName,'gender':stusex,'email':stuEmail,'grade':grade,'schoolName':schoolName,'tel':stuTel,'class_type':class_type,'bigclassname':bigclassname,'teacher_list':teacher_list,'note':''}; 
	 //alert(JSON.stringify(jsondata));
	   
 	  $.ajax({
		url: Webversion + '/student',
		type: "POST",
		dataType: "json",
		data:jsondata,
		success: function (result) {
			if(result.flag){
				$('#EditClass').dialog('close');
				$.messager.alert('温馨提示','添加成功!','info');
				if(class_type=='1_2'){
					$('#details').tabs('select',public_Bigclass_name+'学生管理');
				}else if(class_type==1){
					$('#details').tabs('select',public_Bigclass_name+'学生管理');
				}else if(class_type==2){
					$('#details').tabs('select','1对1学生管理');
				}else if(class_type==0){
					$('#details').tabs('select','未报班学生管理');
				}
				//pager.pagination("select",1);
			}  
		},
		error: function (result) {
			$('#EditClass').dialog('close');
			$.error('加载数据失败，添加失败！');
		}
	});
}

//修改学生信息
function editStudent(value,index,cssidmode){
	$('#hidden_edit').hide();
	$('#EditClass').css('display','block'); 
	var rowData = JSON.stringify(($('#'+cssidmode).datagrid('getData').rows)[index]);
	 
	var updateopen = 'updateopen('+rowData+')';
	var updatehand = 'updatehand('+rowData+')';
	alertCreate("#EditClass",'修改学生信息窗口',600,350,updateopen,updatehand,'确认','取消');
	$('#EditClass').dialog('open');

}

function updateopen(rowdate){
	$.messager.progress('close');
	//StudentForm stuUName  stuRealName  stusex  stuEmail  classstudys schoolName  stuTel
	validate_form('#StudentForm','','#stuUName_Ms','#stuRealName','#stuRealName_Ms','#stuEmail','#stuEmail_Ms','#stusex','#stusex_Ms','#classstudys','#classstudys_Ms','#schoolName','#schoolName_Ms','#stuTel','#stuTel_Ms',1);
	$('#checkname').hide();
	
	var  cid = centerAll.center_id;
	var zid = $('#A_zones',window.parent.document).find("option:selected").val();
	//classname(cid,zid,1);   //当前校区当前班级列表
	//addsubject(subject,'classSubjects');  //更新教师列表
	$('#stuUName').val(rowdate.stu_Name);
	 $('#stuRealName').val(rowdate.stu_Real);
	  $("input[@name=stusex][value="+rowdate.stu_Sex+"]").attr('checked','true');
	  $('#stuEmail').val(rowdate.stu_Email);
	  $('#classstudys').combobox('setValue',rowdate.stu_Class);
	  $('#schoolName').val(rowdate.stu_School);
	  $('#stuTel').val(rowdate.stu_Tel);
	  $('#stuUName').attr('disabled',true);
	
}

//修改学生页面的点击确认以后的操作
function updatehand(rowdate){
	 /*---循环验证begin*/
	  var addSCtemp = true;
	  $.each($('.stuForm'),function(ii,obj){
		  if(($(obj).html()).indexOf('ok.png')<0){
			  addSCtemp = false;
			  $.messager.alert('温馨提示', '信息不符合要求,请按要求填写！', 'info');	
			  return false;   //退出each循环,  加false;
	  }});
	  if(!addSCtemp){return false;}
	  /*---验证end*/
	  //StudentForm stuUName  stuRealName  stusex  stuEmail  classstudys schoolName  stuTel
	  var center_id = rowdate.center_id;
	  var zone_id = rowdate.zone_id;
	  var user_id = rowdate.id;
	  var stuUName= $('#stuUName').val();
	  var stuRealName = $('#stuRealName').val();
	  var stusex = $("input[@name=stusex]:checked").val();
	  var stuEmail = $('#stuEmail').val();
	  var grade = $('#classstudys').combobox('getValue');
	  var schoolName = $('#schoolName').val();
	  var stuTel = $('#stuTel').val();
	  //var class_type =2;  //1 大班  2 小班
	   
	 var jsondata = {action:'edit','user_id':user_id,'center_id':center_id,'zone_id':zone_id,'username':stuUName,'realname':stuRealName,'gender':stusex,'email':stuEmail,'grade':grade,'schoolName':schoolName,'tel':stuTel,'note':''}; 
	  //alert(JSON.stringify(jsondata));
	  
	  $.ajax({
		url: Webversion + '/student',
		type: "POST",
		dataType: "json",
		data:jsondata,
		success: function (result) {
			if(result.flag){
				$('#EditClass').dialog('close');
				$.messager.alert('温馨提示','学生信息修改成功!','info');
				pager.pagination("select");
			} 
			
		},
		error: function (result) {
			$('#EditClass').dialog('close');
			$.error('加载数据失败，添加失败！');
		}
	});
	
}



//查看教学备注
function teaching_Note(value, index) {
	$.messager.progress({text:'正在获取教学备注'});
	var rowData = JSON.stringify(($('#bigClass').datagrid('getData').rows)[index]);
    // 获取校区相关数据
	var teaching_NoteOpen = "teaching_NoteOpen("+rowData+");";
    alertCreate("#teaching_Note",'查看教学备注',570,350,teaching_NoteOpen,'关闭');
    $('#teaching_Note').dialog('open');
 
}

//教学备注页面加载成功  open
function teaching_NoteOpen(rowData){
   $.messager.progress('close'); 
   //do something  
}


//班级测评统计
function test_Statistics(value, index) {
	$.messager.progress({text:'正在获取班级测评统计'});
	var rowData = JSON.stringify(($('#bigClass').datagrid('getData').rows)[index]);
    // 获取校区相关数据
	var test_StatisticsOpen = "test_StatisticsOpen("+rowData+");";
    alertCreate("#test_Statistics",'班级测评统计',570,350,test_StatisticsOpen,'关闭');
    $('#test_Statistics').dialog('open');
}

//班级测评统计页面加载成功  open
function test_StatisticsOpen(rowData){
   $.messager.progress('close'); 
   //do something  
}

 
 //修改状态
function editstartus(stuid,class_stuid,c_Tid,z_Tid){
	$.messager.confirm('温馨提示','确定要结课吗？结课退出班级！',function(value){
		if(value){
			$.ajax({
				url: Webversion + '/student',
				type: "GET" ,
				async:false ,
				dataType: "json",
				data:{'action':'over','student_id':stuid,'class_stu_id':class_stuid,'center_id':c_Tid,'zone_id':z_Tid,'class_type':2},
				
				success: function (result) {
					 
					pager.pagination("select",1);	  
				},
				error: function (result) {
					$.error('加载数据失败！');
				}
			});
		}
	});
	
	
}


//加载班级列表
function classname(cid,zid,fresh){
	$.ajax({
		url: Webversion + '/class',
		type: "GET" ,
		async:false ,
		dataType: "json",
		data:{'action':'list','fresh':fresh,'condition':"center_id^"+cid+"$zone_id^"+zid+"$class_type^1"},
		success: function (result) {
			 var dempclass = [{'id':'请选择','name':'请选择'}];
			 if(result.list!=null){
				 
				$.each(result.list,function(i,classname){
					var onetemp = {'id':classname.id,'name':classname.class_name};
					dempclass.push(onetemp);
				});
				
			 }
			 $('#stuClass').combobox({
					  data:dempclass,
					  valueField:'id',
					  textField:'name'
			  });
		},
		error: function (result) {
			$.error('加载数据失败！');
		}
	});
	
}

//报班管理  type 是  大班  小班  或者没有班级的学生
function updateClassStudent(value,index,type,listcss_id){
	var rowData = "";
	if(listcss_id!='#noneclass_stu'){
		rowData = JSON.stringify(($(listcss_id).datagrid('getData').rows)[index]);
	}else{
		rowData = JSON.stringify(value) ;
	}
	var classopen = 'updateclassopen('+rowData+','+type+',"'+listcss_id+'");';
    var classhandfuc = 'updateclasshand('+rowData+',"'+listcss_id+'")';
	 
 	alertCreate("#updateClassStudent",'报班管理窗口',520,300,classopen,classhandfuc,'保存','关闭');
	$('#updateClassStudent').dialog('open');
 
}



//弹出报班管理加载处理   type 是  大班  小班  或者没有班级的学生
function updateclassopen(rowData,type,listcss_id){
	var cid = 0;
	$('#sersion_level_3').html(public_Bigclass_name); 
	if(listcss_id!='#noneclass_stu'){
		cid = rowData.class_id;	
		$('#text_realname').html(rowData.stu_Real);
		
		voluation(cid,rowData.student_id,type,rowData.stu_user_id);  //给班级下拉赋值
	}else{
		cid = 0;
		$('#text_realname').html('');
		voluation(cid,null,type,null);  //给班级下拉赋值
	}
	 
	$("input[@name=classtype][value="+type+"]").attr("checked",'checked');
	 
	//选项卡开始  更新选项卡
	$('.tab_list_1 .title_box >div').each(function(index, element) {
		var tabclass = $(this).attr("class");
        if(index==0&&tabclass=='tab'){
			$(this).attr("class","tab now_focus_1");
		}else if(index!=0){
			$(this).attr("class","tab");
		}
    });
	//同上关联更新选项卡内容
	$('.tab_list_1 .con_box >div').each(function(idx, e) {
		var conclass = $(this).attr("class");
		if(idx==0&&conclass=='clearfix'){
			$(this).attr("class","now_focus_1 clearfix");
		}else if(idx!=0){
			$(this).attr("class","");
		}
	});
	$("#classtype1").unbind('click');
	$("#classtype2").unbind('click');
	$("#classtype1").bind('click',function(){
		type = $(this).val();
		if(listcss_id!='#noneclass_stu'){
			voluation(cid,rowData.student_id,type,rowData.stu_user_id);  //给班级下拉赋值  
		}else{
			 
			voluation(cid,null,type,null);  //给班级下拉赋值
		}
		
	});
	$("#classtype2").bind('click',function(){
		type = $(this).val();	
		if(listcss_id!='#noneclass_stu'){
			voluation(cid,rowData.student_id,type,rowData.stu_user_id);  //给班级下拉赋值  
		}else{
			 
			voluation(cid,null,type,null);  //给班级下拉赋值
		}
		 
	});
	$(".tab").unbind('click');
	if(cid!=0){
		$(".tab").bind('click',function() {
			$(this).addClass("now_focus_1");
			$(this).siblings().removeClass("now_focus_1");
			var $dangqian = $(".con_box > div").eq($(".tab").index(this));
			$dangqian.addClass("now_focus_1");
			$dangqian.siblings().removeClass("now_focus_1");
			voluation(cid,rowData.student_id,type,rowData.stu_user_id);  //给班级下拉赋值
		});
	}
	
	$("#BtnaddSearthStu").click(function () {
		 
		 if(($("#addSeaUser").attr("innt") == "1")&&($("#addSeaStu").attr("innt") == "1")){
			 $.messager.alert('温馨提示', '请输入用户名或者真实姓名再搜索！', 'info');
	     }else{
			var text_addSeaUser = $('#addSeaUser').val(); 
			var text_addSeaStu = $('#addSeaStu').val(); 
			search_otherT(text_addSeaUser,text_addSeaStu,value);//加载列表
		 }
    });
	
}


//报班管理弹出窗口确认处理
function updateclasshand(rowData,listcss_id){
	
	var type_class_radio = $('#updateClassStudent input[name="classtype"]:checked').val();
	 
	if(type_class_radio==1){ 
		var addstuclass = $('#addstuclass').combobox('getValue');
		var updatestuoldclass = $('#updatestuoldclass').combobox('getValue');
		var updatestunewclass = $('#updatestunewclass').combobox('getValue');
		var deleteclass = $('#deleteclass').combobox('getValue');
		 
		var nonetype = '';  //有班级的时候 为空  没有班级的时候 等于noneclass
		
		if($('.tabs-selected').text()=='未报班学生管理'){
			nonetype='noneclass';
		}
		if(addstuclass!='请选择'){
			var adddata = {};
			if(listcss_id!='#noneclass_stu'){
				adddata = {'action':'join','center_id':rowData.center_id,'zone_id':rowData.zone_id,'student_id':rowData.student_id,'class_id':addstuclass,'nonetype':nonetype,'class_stu_id':rowData.class_stu_id,'class_type':$('#updateClassStudent input[name="classtype"]:checked').val()};
			}else{
				$.each(rowData,function(i,n){
					n.class_id = addstuclass ;
					n['nonetype'] = nonetype ;
				});
				adddata = {'action':'join','center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val(),'stus_info':rowData,'class_type':$('#updateClassStudent input[name="classtype"]:checked').val()};	
			}
			//alert(JSON.stringify(adddata));
			 
			joinClass(adddata);
			
		}else if(updatestuoldclass!='请选择'&&updatestunewclass!='请选择'){
			var updatadata = {'action':'change','class_stu_id':rowData.class_stu_id,'out_class_id':updatestuoldclass,'in_class_id':updatestunewclass,'center_id':rowData.center_id,'zone_id':rowData.zone_id,'class_type':$('#updateClassStudent input[name="classtype"]:checked').val()};
			joinClass(updatadata);
			 
		}else if(deleteclass!='请选择'){
			var updatadata = {'action':'exit','class_stu_id':rowData.class_stu_id,'class_id':deleteclass,'center_id':rowData.center_id,'zone_id':rowData.zone_id,'class_type':$('#updateClassStudent input[name="classtype"]:checked').val()};
			joinClass(updatadata);
		}else{
			$.messager.alert('温馨提示','请选择!');
		}
	}else if(type_class_radio==2){
		// 加入1对1 addsubject_smail   addteacherName_smail    
		//更换1对1  updatesubject_smail   updateteacherName_smail   updatenewsubject_smail  updatenewteacherName_smail  
		//退出1对1  delesubject_smail  deleteacherName_smail
		var addteacherName_smail = $('#addteacherName_smail').combobox('getValue');
		var updateteacherName_smail = $('#updateteacherName_smail').combobox('getValue');
		var updatenewteacherName_smail = $('#updatenewteacherName_smail').combobox('getValue');
		var deleteacherName_smail = $('#deleteacherName_smail').combobox('getValue');
		if(addteacherName_smail!='请选择'){
			var adddata = {};
			if(listcss_id!='#noneclass_stu'){
				adddata = {'action':'add_small_class','center_id':rowData.center_id,'zone_id':rowData.zone_id,'student_id':rowData.student_id,'student_username':rowData.stu_Real,'teacher_list':[{'id':addteacherName_smail,'name':$('#addteacherName_smail').combobox('getText')}],'student_user_id':rowData.stu_user_id,'class_type':$('#updateClassStudent input[name="classtype"]:checked').val()};
			}else{
				$.each(rowData,function(i,n){
					n.class_id = addteacherName_smail ;
					n['nonetype'] = nonetype ;
					n.teacher_list = [{'id':addteacherName_smail,'name':$('#addteacherName_smail').combobox('getText')}];
				});
				adddata = {'action':'batch_add_small_class','center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val(),'stus_info':rowData,'class_type':$('#updateClassStudent input[name="classtype"]:checked').val()};	
			}
			
			 
			joinsmallClass(adddata,"POST");
			
		}else if(updateteacherName_smail!='请选择'&&updatenewteacherName_smail!='请选择'){
			var updatadata = {'action':'change_small_class','class_stu_id':rowData.class_stu_id,'out_teacher_id':updateteacherName_smail,'in_teacher_id':updatenewteacherName_smail,'center_id':rowData.center_id,'zone_id':rowData.zone_id,'class_id':rowData.class_id,'student_id':rowData.student_id,'student_user_id':rowData.stu_user_id,'student_username':rowData.stu_Real,'teacher_list':[{'id':updatenewteacherName_smail,'name':$('#updatenewteacherName_smail').combobox('getText')}],'class_type':$('#updateClassStudent input[name="classtype"]:checked').val()};
			 
			joinsmallClass(updatadata,"POST");
			 
		}else if(deleteacherName_smail!='请选择'){
			var updatadata = {'action':'over','class_stu_id':rowData.class_stu_id,'teacher_id':deleteacherName_smail,'center_id':rowData.center_id,'zone_id':rowData.zone_id,'class_type':$('#updateClassStudent input[name="classtype"]:checked').val(),'student_id':rowData.student_id,'student_user_id':rowData.stu_user_id};
			 
			joinsmallClass(updatadata,"GET");
			 
		}else{
			$.messager.alert('温馨提示','请选择!');
		}
		
		
	}
	
}

//报班管理中学生不在的班级列表
function stuotherclass(student_id,type){
	var center_id = centerAll.center_id;
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	var ss =""; 
	 
	$.ajax({
		url: Webversion + '/class',
		type: "GET" ,
		async:false ,
		dataType: "json",
		data:{action:'query_stu_class','condition':"center_id^"+center_id+"$"+"zone_id^"+zone_id+"$student_id^"+student_id},
		success: function (result) { 
			var classtemp =[];
			 
			 if(result.list!=null){
				$.each(result.list,function(ii,nn){
					if(nn.class_type==type){
						var temp = {};
						if(nn.class_type==1){
							if(date_Diff_day(getNowDate(),nn.end_date.substring(0,10))==1){
								temp = {'id':nn.class_id,'name':nn.class_name};
								classtemp.push(temp);
							}
						}else{
							temp = {'id':nn.class_id,'name':nn.class_name};
							classtemp.push(temp);
						}
					}
				});
			 }
			 ss = classtemp;
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
	return ss;
		
}


//报班管理弹出框班级赋值
function voluation(cid,student_id,type,stu_user_id){
	 
	var center_id = centerAll.center_id;
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	if(type==1){
		var exist_class = null;
		if(student_id==null||stu_user_id==null){
			exist_class = null;
		}else{
		 	exist_class = stuotherclass(student_id,type); 
		}
		 
		$('#smail_addclass_nowfocus').hide();
		$('#smail_class_new_f').hide();
		$('#smail_class_pass_f').hide();
		$('#smail_class_pass_T').hide();
		$('#big_addclass_nowfocus').show();
		$('#big_class_new_f').show();
		$('#big_class_pass_f').show();
		$('#big_class_pass_T').show();
		 
		$.ajax({
			url: Webversion + '/class',
			type: "GET",
			dataType: "json",
			data:{action:'name_list','condition':"center_id^"+center_id+"$"+"zone_id^"+zone_id},
			success: function (result) { 
				
				 if(result.list!=null){
					  
					 var big_Ntemps = [{'id':'请选择','name':'请选择'}];   //学生没有在的班级
					 var big_Ytemps = [{'id':'请选择','name':'请选择'}];   //学生所在的班级  一个学生可以在多个班级
					 var lists = result.list;
					 if(exist_class!=null){
					 	big_Ytemps = $.merge(big_Ytemps,exist_class);  //合并数组
					 }else{
						 
					 }
					   
					 $.each(lists,function(idx,item){
						 var lists_1 = item.id;
						   var count = 0;
						   var temps = {};
						  if(item.class_type==1){
							  if(date_Diff_day(getNowDate(),item.end_date.substring(0,10))==1){
								  if(exist_class!=null){
										$.each(exist_class,function(ss,exist_classid){
										   var lists_2 = exist_classid.id;
											   
											   if((lists_1==lists_2)){
												  count++;
											   }
											 
											 
									   });  
								  }
								   
							   }else{
									count++;   
							   }
						  }else{
							  if(exist_class!=null){
								  $.each(exist_class,function(ss,exist_classid){
									   var lists_2 = exist_classid.id;
										 
										   if((lists_1==lists_2)){
											  count++;
										   }
										 
										 
								   });	
							  }
						  }
						   if(count==0&&item.class_type==type){//表示数组type的这个值没有重复的，放到返回列表中
								temps = {'id':item.id,'name':item.class_name};
								big_Ntemps.push(temps);
							}
						  
						  
					 });
					  
					  
					  $('#addstuclass').combobox({ //学生没有在的班级
						data:big_Ntemps,
						editable:false,
						valueField:'id',
						textField:'name',
						onLoadSuccess:function(){
							$(this).combobox('setValue','请选择');
						}
					  });
					  if(student_id!=null||stu_user_id!=null){
						  $('#updatestunewclass').combobox({ //生没有在的班级
							data:big_Ntemps,
							editable:false,
							valueField:'id',
							textField:'name',
							onLoadSuccess:function(){
								$(this).combobox('setValue','请选择');
							}
						  });
						  $('#updatestuoldclass').combobox({ //学生所在的班级  一个学生可以在多个班级
							data:big_Ytemps,
							editable:false,
							valueField:'id',
							textField:'name',
							onLoadSuccess:function(){
								if(type==1){
									var TclassnameValue = $('#bigclass_Name').combobox("getValue");
									if($('.tabs-selected').text()==(public_Bigclass_name+'学生管理')&&$('#updateClassStudent input[name="classtype"]:checked').val()==1){									if(TclassnameValue!=null&&TclassnameValue!=undefined&&TclassnameValue!=""){
											$(this).combobox('setValue',TclassnameValue);
										}else{
											$(this).combobox('setValue','请选择');	
										}
										
									}else{
										$(this).combobox('setValue','请选择');
									}
									
								
								}else{
									$(this).combobox('setValue','请选择');
								}
							}
						  });
						  $('#deleteclass').combobox({ //学生所在的班级  一个学生可以在多个班级
							data:big_Ytemps,
							editable:false,
							valueField:'id',
							textField:'name',
							onLoadSuccess:function(){
								if(type==1){
									if($('.tabs-selected').text()==(public_Bigclass_name+'学生管理')&&$('#updateClassStudent input[name="classtype"]:checked').val()==1){
										var TclassnameValue = $('#bigclass_Name').combobox("getValue");
										if(TclassnameValue!=null&&TclassnameValue!=undefined&&TclassnameValue!=""){
											$(this).combobox('setValue',TclassnameValue);
										}else{
											$(this).combobox('setValue','请选择');	
										}
										
									}else{$(this).combobox('setValue','请选择');}
									
								}else{
									$(this).combobox('setValue','请选择');
								}
							}
						  });
					  }
					  
				 }
			},
			error: function (result) {
				
				$.error('加载数据失败！');
			}
		});
	
	}else if(type==2){
		//smail_addclass_nowfocus smail_class_new_f  smail_class_pass_f smail_class_pass_T	
		var Qjson = {};
		if(stu_user_id==null){
			Qjson = {'action':'get_small_class_teachers','center_id':center_id,'zone_id':zone_id,'student_user_id':0};
		}else{
			Qjson = {'action':'get_small_class_teachers','center_id':center_id,'zone_id':zone_id,'student_user_id':stu_user_id};	
		}
		 
		var resteachernoyes_list = Ajax_option('/teacher',Qjson,"GET"); 
		
		$('#smail_addclass_nowfocus').show();
		$('#smail_class_new_f').show();
		$('#smail_class_pass_f').show();
		$('#smail_class_pass_T').show();
		$('#big_addclass_nowfocus').hide();
		$('#big_class_new_f').hide();
		$('#big_class_pass_f').hide();
		$('#big_class_pass_T').hide();
		 
		// 加入1对1 addsubject_smail   addteacherName_smail    
		//更换1对1  updatesubject_smail   updateteacherName_smail   updatenewsubject_smail  updatenewteacherName_smail  
		//退出1对1  delesubject_smail  deleteacherName_smail
		var yusclass_subjects =  [{'id':'请选择','name':'请选择'}];
		var tempstyusclass = [];
		if(resteachernoyes_list.in_small_class_teacher_list!=null&&resteachernoyes_list.in_small_class_teacher_list!=""){
			$.each(resteachernoyes_list.in_small_class_teacher_list,function(iTs,nTs){
				tempstyusclass.push(nTs.subject_id);
				
			});
			$.each(unique(tempstyusclass),function(i,n){
				yusclass_subjects.push({'id':n,'name':subject_sum(parseInt(n))});
			});
		}
		var noclass_subjects =  [{'id':'请选择','name':'请选择'}];
		var notempstclass = [];
		if(resteachernoyes_list.out_small_class_teacher_list!=null&&resteachernoyes_list.out_small_class_teacher_list!=""){
			$.each(resteachernoyes_list.out_small_class_teacher_list,function(iTs,nTs){
				notempstclass.push(nTs.subject_id);
			});
			$.each(unique(notempstclass),function(ii,nn){
				noclass_subjects.push({'id':nn,'name':subject_sum(parseInt(nn))});
			});
		}
		
		
		 
		$('#addsubject_smail').combobox({
			data:noclass_subjects,
			valueField:'id',
			textField:'name',
			onLoadSuccess:function(){
				$(this).combobox('setValue','请选择');
				 
			},
			onChange:function(newvalues,oldvalues){
				 
					var yue_teacher_names = [{'id':'请选择','name':'请选择'}];
					if(newvalues!='请选择'){  
					$.each(resteachernoyes_list.out_small_class_teacher_list,function(iTs_2,nTs_2){
						if(nTs_2.subject_id==newvalues){
							yue_teacher_names.push({'id':nTs_2.teacher_user_id,'name':nTs_2.teacher_realname});
						}
					});
					}	 
					 
					$('#addteacherName_smail').combobox({
						data:yue_teacher_names,
						valueField:'id',
						textField:'name',
						onLoadSuccess:function(){
							$(this).combobox('setValue','请选择');
							 
						}					
					});
				}
			 
		});
		
		$('#updatesubject_smail').combobox({
			data:yusclass_subjects,
			valueField:'id',
			textField:'name',
			onLoadSuccess:function(){
				$(this).combobox('setValue','请选择');
				 
			},
			onChange:function(newvalues,oldvalues){
				 
					var yue_teacher_names = [{'id':'请选择','name':'请选择'}];
					if(newvalues!='请选择'){  
					$.each(resteachernoyes_list.in_small_class_teacher_list,function(iTs_2,nTs_2){
						if(nTs_2.subject_id==newvalues){
							yue_teacher_names.push({'id':nTs_2.teacher_user_id,'name':nTs_2.teacher_realname});
						}
					});
					}	 
					 
					$('#updateteacherName_smail').combobox({
						data:yue_teacher_names,
						valueField:'id',
						textField:'name',
						onLoadSuccess:function(){
							$(this).combobox('setValue','请选择');
						}					
					});
				}
			 
			
		});
		$('#updatenewsubject_smail').combobox({
			data:noclass_subjects,
			valueField:'id',
			textField:'name',
			onLoadSuccess:function(){
				$(this).combobox('setValue','请选择');
				 
			},
			onChange:function(newvalues,oldvalues){
				    
					var no_teacher_names = [{'id':'请选择','name':'请选择'}];
					if(newvalues!='请选择'){  
					$.each(resteachernoyes_list.out_small_class_teacher_list,function(iTs_2,nTs_2){
						if(nTs_2.subject_id==newvalues){
							no_teacher_names.push({'id':nTs_2.teacher_user_id,'name':nTs_2.teacher_realname});
						}
					});
					}	 
					 
					$('#updatenewteacherName_smail').combobox({
						data:no_teacher_names,
						valueField:'id',
						textField:'name',
						onLoadSuccess:function(){
							$(this).combobox('setValue','请选择');
							 
						}					
					});
				}
			 
		});
		
		$('#delesubject_smail').combobox({
			data:yusclass_subjects,
			valueField:'id',
			textField:'name',
			onLoadSuccess:function(){
				$(this).combobox('setValue','请选择');
				 
			},
			onChange:function(newvalues,oldvalues){
				 
					var no_teacher_names = [{'id':'请选择','name':'请选择'}];
					if(newvalues!='请选择'){ 
					$.each(resteachernoyes_list.in_small_class_teacher_list,function(iTs_2,nTs_2){
						if(nTs_2.subject_id==newvalues){
							no_teacher_names.push({'id':nTs_2.teacher_user_id,'name':nTs_2.teacher_realname});
						}
					});
						 
					}
					$('#deleteacherName_smail').combobox({
						data:no_teacher_names,
						valueField:'id',
						textField:'name',
						onLoadSuccess:function(){
							$(this).combobox('setValue','请选择');
							 
						}					
					});
				}
			 
			
		});
		
		
	}
}


// 加入已存在的学生--列出其他除本班级以外的学生  cid 学校id   zid 校区id  uid 用户id
function joinsmallClass(jsondatas,posttype){
	/*alert(JSON.stringify(jsondatas.stus_info));
	return; */
	$.ajax({
		url: Webversion + '/student',
		type: posttype,
		dataType: "json",
		data:jsondatas,
		success: function (result) {
			  if(result.find){
				  $.messager.alert('温馨提示','已经添加过了,不能重复添加！','info');  
			  }else{
				 $.messager.alert('温馨提示','更新操作成功！','info');
				  
				 $('#updateClassStudent').dialog('close');
				 $('#details').tabs('select','1对1学生管理');
			  }
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
}


// 加入已存在的学生--列出其他除本班级以外的学生  cid 学校id   zid 校区id  uid 用户id
function joinClass(jsondatas){
	/*alert(JSON.stringify(jsondatas.stus_info));
	return;  */
	$.ajax({
		url: Webversion + '/class',
		type: "POST",
		dataType: "json",
		data:jsondatas,
		success: function (result) {
			  if(result.find){
				  $.messager.alert('温馨提示','已经添加过了,不能重复添加！','info');  
			  }else{
				 $.messager.alert('温馨提示','更新操作成功！','info');
				 //pager.pagination("select",1);
				 $('#updateClassStudent').dialog('close');
				 $('#details').tabs('select',public_Bigclass_name+'学生管理');
			  }
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
}

//教师选派
function teaching_Assign(value, index,typeid){
	 
	var rowData = JSON.stringify(($('#bigClassCounts').datagrid('getData').rows)[index]);
	var classopen = 'updateteacheropen('+rowData+');';
    var classhandfuc = 'updatetechaerhand('+rowData+')';
 	alertCreate("#stujointeacher",'报班管理窗口',520,300,classopen,classhandfuc,'保存','关闭');
	$('#stujointeacher').dialog('open');

}
//教师选派加载处理
function updateteacheropen(rowData){
	subcssid=0;
	addsubject(subject,'classSubjects_up');  //更新教师列表
	
	
}
//教师选派弹出窗口确认处理
function updatetechaerhand(rowData){

	

}

//查看学生测评
function selSrudentCorrects(typeclass,value, index) {
	var typecss = '';
	if(typeclass==1){
		typecss = 'bigClassCounts';
	}else if(typeclass==2){
		typecss = 'oneToCounts';	
	}  
    var rowData = JSON.stringify(($('#'+typecss).datagrid('getData').rows)[index]);
 	//alert(JSON.stringify(rowData) );
	
	window.location.href = "selSrudentCorrects.html?data="+Base64.encode(rowData);
}

//查看班级学科报告
function selSubjectInfo(value, index) {
    var rowData = ($('#bigClassCounts').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "subjectinfo.html?data="+JSON.stringify(rowData);

}

//查看历史学习
function histroyStudys(value, index){
	var rowData = ($('#bigClassCounts').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "histroystudys.html?data="+Base64.encode(JSON.stringify(rowData));
}







//验证表单
function valida_null(a){
	var sss = $(a).val();
	if(sss.length<=0){
		if(a.id=='stuTel'){
			$('#stuTel_Ms').html('&nbsp;请输入11位手机号码!');
		
		}else if(a.id=='stuEmail'){
			$('#stuEmail_Ms').html('&nbsp;邮箱不能为空!');	
	
		}
		else if(a.id=='schoolName'){
			$('#schoolName_Ms').html('&nbsp;学校名称不能为空!');	
	
		}else if(a.id=='stuRealName'){
			$('#stuRealName_Ms').html('&nbsp;真实姓名不能为空!');	
	
		}
	} 
}

//验证表单
//StudentForm stuUName  stuRealName  stusex  stuEmail  classstudys schoolName  stuTel
function validate_form(form,name,name_ms,realname,realname_ms,email,email_ms,stusex,stusex_ms,studys,studys_ms,schoolName,schoolName_ms,tel,tel_ms,type){
	 
    $(form)[0].reset();
	$("select[name='classTeacher_s']").each(function(){
	  	 var id = $(this).parent().attr('id');
		 if(id!=undefined&&id!=""){
			$('#'+id).remove();
		 }
 	  });
	if(type==0){
		$(name_ms).html('&nbsp;请输入6位以上数字、字符!');
		$(studys_ms).html('&nbsp;当前年级不能为空！');
		$(realname_ms).html('&nbsp;请输入2-4位中文汉字！');
		$(email_ms).html('&nbsp;请输入正确的邮箱！');
		 
		$(schoolName_ms).html('&nbsp;请输入学校名称!');
		$(tel_ms).html('&nbsp;请输入11位手机号码!');
		 
	}else if(type==1){
		$(name_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(studys_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(realname_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(email_ms).html('&nbsp;<img src="../images/ok.png"/>');
		 
		$(schoolName_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(tel_ms).html('&nbsp;<img src="../images/ok.png"/>');
		 
	}
	
    // 定义负责人验证方式
    $.extend($.fn.validatebox.defaults.rules, {
		CheckUserName: {     //验证用户名存在与否  不存在的情况下才能注册
            validator: function (value, param) {
                $(name).html("");
             
                
				var UserNameSum  =  6;  //判断用户名的长度
                
				if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(com|cn|net)$/i.test(value)) {
					var htmltemp = "<img alt='' src='../images/imgload.gif'/>正在获取...";
                	$(name_ms).html(htmltemp);
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
        },
		CheckSchoolName: {     //验证用户名存在与否  不存在的情况下才能注册
            validator: function (value, param) {
                $(schoolName).html("");
				var UserNameSum  =  6;  //判断用户名的长度
				if(($.trim(value)).length>0){
                $(schoolName_ms).html('&nbsp;<img src="../images/ok.png"/>'); 
				return true;
				}
            },
            message: '学校名称不能为空！'
        }
    });
 
	$(email).validatebox({   //email验证
        required: true,
        validType: "CheckEmail",
        missingMessage: '该项必须输入且为邮件格式！'
    });
	$(schoolName).validatebox({   //email验证
        required: true,
        validType: "CheckSchoolName",
        missingMessage: '学校名称不能为空！'
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
	
	$(studys).combobox({   //验证单选下来列表combobox
            
			editable:false,
            onChange: function (rec) {
               if(rec!=0){
				 $(studys_ms).html('&nbsp;<img src="../images/ok.png"/>');
			   }else{
			   	  $(studys_ms).html('&nbsp;学段不能为空！');	
			   }
            }
             
     });
	  
	 
}