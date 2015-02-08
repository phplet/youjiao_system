
var UserInfo = {};
var centerAll={};
var page ="";
var subject_s=[]; 
var zone_type_num = 1; 
var subcssid = 0;
$().ready(function() {
	  
	   $.ajaxSetup({    //全局设置 ajax  同步加载
    		async : false  
		});
      UserInfo = $.evalJSON($.cookie("UserInfo"));
	  centerAll = $.evalJSON($.cookie("centerAll"));
	  var  tabs_name = $('.tabs-title', window.parent.document);	  //获得iframe父页面的节点内容
	  if((tabs_name.html())!="班级管理"){
	  	tabs_name.html('班级管理');   //赋值
		// $('document').KeyInput($("#SchoolText"), '请输入姓名');
	  }
     $('#EditClass').css('display','none');
	 $('#students_counts').panel({  
	    title:"&nbsp;学务报表&nbsp;>>&nbsp;学生数量统计",
		 
		onOpen:function(){
			$('.public_classnames').attr('title',public_Bigclass_name+'管理');
			$('#details').tabs({
       			 width: $("#details").parent().width(),
        		 height: "auto",
				 tools:"#tab-tools",
    	 		 onSelect:function(title){
					 var version_level = $.cookie("version_level");
					  if(version_level!=""&&version_level!=null){
						version_level = Base64.decode(version_level);
						if(version_level==1){
							$('#details').tabs('close','1对1管理');
							$('#version_level_tab').hide();
						}
						$('#bigclass_Name').combobox('setValue',1);
					  }
					 if(title==(public_Bigclass_name+"管理")){
						 $('.panel-title').html('&nbsp;班级管理&nbsp;>>&nbsp;'+public_Bigclass_name+'管理');
						  // 绑定创建班级事件
						  $('#addclass').linkbutton({disabled:false});
						  $('#addclass').unbind('click');
						$("#addclass").click(function () {
							$('#EditClass').css('display','block');
							$('#myclass_name').html('当前学校：<span>'+centerAll.center_name+'</span>&nbsp;当前校区：<span>'+$('#A_zones',window.parent.document).find("option:selected").text()+'</span>');
							alertCreate("#EditClass",'创建班级',550,350,'openfunction()','handfunction()','确认','取消');
							$('#EditClass').dialog('open');
						});
						 
						 bigClass(1,1); //第一个参数0=过往班级  1=当前班级   第二个参数 是 2是小班 1是大班
						// bigClassCounts();	
					  }else if(title=="1对1管理"){
						$('.panel-title').html('&nbsp;班级管理&nbsp;>>&nbsp;1对1管理');
						$('#addclass').linkbutton({disabled:false});
						$('#addclass').unbind('click');
						$("#addclass").click(function () {
							$('#EditsmallClass').css('display','block');
							
							alertCreate("#EditsmallClass",'创建1对1班',550,350,'opensmallfunction()','handsmallfunction()','确认','取消');
							$('#EditsmallClass').dialog('open');
						});
						oneToCounts(1,2); //第一个参数,0=过往班级  1=当前班级  第二个参数 是 2是小班 1是大班
					  }
					//alert(title+' is selected');  //判断每个每个列表 更新列表
				 }
			}); //方便右边块宽度自适应	
		
		}
	 });
	 
	 subject_s = subject_Longding();   //加载本小区学科方法
	 
	 //绑定大班过往和当前班级状态
	 $('#bigclass_Name').combobox({
			onSelect:function(record){
				bigClass(parseInt(record.value),1);
			}
	 });
	 
	 
	 
	 //绑定小班过往和当前班级状态
	 $('#smallclass_Name').combobox({
			onSelect:function(record){
				oneToCounts(parseInt(record.value),2);
			}
	 });
	 
	
	
	 
	 
});


function opensmallfunction(){
	var small_url = '/teacher';
	var small_JSON = {'action':'teacher_not_in_small_class','condition':'center_id^'+centerAll.center_id+'$zone_id^'+$('#A_zones',window.parent.document).find("option:selected").val()+'$level^4'};
	
	var res_small =  Ajax_option(small_url,small_JSON,"GET");
	 
	var html_small = '<li id="myclass_name_1"></li><li style="height:20px;"><div><div class="addclasstitle text_float" style="text-align:center">学&nbsp;&nbsp;科</div><div class="text_float addclasstext addclassform_left_1" style="text-align:center">教师名称</div></div><div class="cleared"></div></li>';
	var html_sub_1 = '<li id="teacher_sub_1"><div><div class="addclasstitle text_float" style="text-align:center">'+subject_sum(parseInt(1))+'</div><div class="text_float addclasstext addclassform_left_1">';
	var html_sub_2 = '<li id="teacher_sub_2"><div><div class="addclasstitle text_float" style="text-align:center">'+subject_sum(parseInt(2))+'</div><div class="text_float addclasstext addclassform_left_1">';
	var html_sub_3 = '<li id="teacher_sub_3"><div><div class="addclasstitle text_float" style="text-align:center">'+subject_sum(parseInt(3))+'</div><div class="text_float addclasstext addclassform_left_1">';
	var html_sub_4 = '<li id="teacher_sub_4"><div><div class="addclasstitle text_float" style="text-align:center">'+subject_sum(parseInt(4))+'</div><div class="text_float addclasstext addclassform_left_1">';
	var html_sub_5 = '<li id="teacher_sub_5"><div><div class="addclasstitle text_float" style="text-align:center">'+subject_sum(parseInt(5))+'</div><div class="text_float addclasstext addclassform_left_1">';
	var html_sub_6 = '<li id="teacher_sub_6"><div><div class="addclasstitle text_float" style="text-align:center">'+subject_sum(parseInt(6))+'</div><div class="text_float addclasstext addclassform_left_1">';
	var html_sub_7 = '<li id="teacher_sub_7"><div><div class="addclasstitle text_float" style="text-align:center">'+subject_sum(parseInt(7))+'</div><div class="text_float addclasstext addclassform_left_1">';
	var html_sub_8 = '<li id="teacher_sub_8"><div><div class="addclasstitle text_float" style="text-align:center">'+subject_sum(parseInt(8))+'</div><div class="text_float addclasstext addclassform_left_1">';
	var html_sub_9 = '<li id="teacher_sub_9"><div><div class="addclasstitle text_float" style="text-align:center">'+subject_sum(parseInt(9))+'</div><div class="text_float addclasstext addclassform_left_1">';

	var html_sub_1s = "";
	var html_sub_2s = "";
	var html_sub_3s = "";
	var html_sub_4s = "";
	var html_sub_5s = "";
	var html_sub_6s = "";
	var html_sub_7s = "";
	var html_sub_8s = "";
	var html_sub_9s = "";
	var stend = '</div></div><div class="cleared"></div></li>';
	if(res_small.techers!=""&&res_small.techers!=null){
		$.each(res_small.techers,function(ii,nn){
			//var teacher_someid = {'subject_id':nn.subject_id,'teacher_id':nn.teacher_id,'user_id':nn.user_id,'username':nn.username,'realname':nn.realname};
			if(parseInt(nn.subject_id)==1){
				html_sub_1s += '<input type="checkbox" name="teacher_user_realids" value="'+nn.user_id+'" />'+nn.realname+'&nbsp;';      
			}else if(parseInt(nn.subject_id)==2){
				html_sub_2s += '<input type="checkbox" name="teacher_user_realids" value="'+nn.user_id+'" />'+nn.realname+'&nbsp;';           
			}else if(parseInt(nn.subject_id)==3){
				html_sub_3s += '<input type="checkbox" name="teacher_user_realids" value="'+nn.user_id+'" />'+nn.realname+'&nbsp;';           
			}else if(parseInt(nn.subject_id)==4){
				html_sub_4s += '<input type="checkbox" name="teacher_user_realids" value="'+nn.user_id+'" />'+nn.realname+'&nbsp;';           
			}else if(parseInt(nn.subject_id)==5){
				html_sub_5s += '<input type="checkbox" name="teacher_user_realids" value="'+nn.user_id+'" />'+nn.realname+'&nbsp;';
			}else if(parseInt(nn.subject_id)==6){
				html_sub_6s += '<input type="checkbox" name="teacher_user_realids" value="'+nn.user_id+'" />'+nn.realname+'&nbsp;';           
			}else if(parseInt(nn.subject_id)==7){
				html_sub_7s += '<input type="checkbox" name="teacher_user_realids" value="'+nn.user_id+'" />'+nn.realname+'&nbsp;';
			}else if(parseInt(nn.subject_id)==8){
				html_sub_8s += '<input type="checkbox" name="teacher_user_realids" value="'+nn.user_id+'" />'+nn.realname+'&nbsp;';
			}else if(parseInt(nn.subject_id)==9){
				html_sub_9s += '<input type="checkbox" name="teacher_user_realids" value="'+nn.user_id+'" />'+nn.realname+'&nbsp;';
			}
			
		});
		 
		if(html_sub_1s != ""){
			html_small += (html_sub_1+html_sub_1s+stend);	
		}
		if(html_sub_2s != ""){
			html_small += (html_sub_2+html_sub_2s+stend);		
		}
		if(html_sub_3s != ""){
			html_small += (html_sub_3+html_sub_3s+stend);	
		}
		if(html_sub_4s != ""){
			html_small += (html_sub_4+html_sub_4s+stend);		
		}
		if(html_sub_5s != ""){
			html_small += (html_sub_5+html_sub_5s+stend);		
		}
		if(html_sub_6s != ""){
			html_small += (html_sub_6+html_sub_6s+stend);	
		}
		if(html_sub_7s != ""){
			html_small += (html_sub_7+html_sub_7s+stend);		
		}
		if(html_sub_8s != ""){
			html_small += (html_sub_8+html_sub_8s+stend);		
		}
		if(html_sub_9s != ""){
			html_small += (html_sub_9+html_sub_9s+stend);
		}
    }else{
		html_small += '<li style="height:20px;"><div><div class="addclasstitle text_float" style="text-align:center">无学科</div><div class="text_float addclasstext addclassform_left_1" style="text-align:center">无教师</div></div><div class="cleared"></div></li>';
	}
	$('#small_class_add').html(html_small);
	$('#myclass_name_1').html('当前学校：<span>'+centerAll.center_name+'</span>&nbsp;当前校区：<span>'+$('#A_zones',window.parent.document).find("option:selected").text()+'</span>');
	
}

function handsmallfunction(){
	var tealist = [];
	$('#small_class_add input[name="teacher_user_realids"]:checked').each(function(te_index, tea_n) {
        tealist.push($(this).val());
    });
	if(tealist!=""){
		var small_url = '/class';
		var small_JSON = {'action':'add_small_class','center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val(),'teacher_user_ids':tealist};
		 
		var res_small =  Ajax_option(small_url,small_JSON,"POST");
		$('#EditsmallClass').dialog('close');
		if(res_small.flag){
			$.messager.alert('温馨提示','教师建立小班成功！','info');
			oneToCounts(1,2); 
		}else{
			$.messager.alert('温馨提示','教师建立小班失败！','info');
		}
	}else{
		$.messager.alert('温馨提示','你没有选择教师！','info');
	}
}

function subject_Longding(){
	//加载科目
	var subjects =[];
	var datajson = {action:'list','condition':"center_id^"+centerAll.center_id+"$"+"zone_id^"+$('#A_zones',window.parent.document).find("option:selected").val()+"$"+"level^4",'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
	$.ajax({
		url: Webversion + '/teacher',
		type: "GET",
		dataType: "json",
		async:false,
		data:datajson,
		success: function (result) {
			if(result!=null&&result.list!=null){
			  var demp_s = [];
			  $.each(result.list,function(i,n){
				  var id = n.subject_id;
				 if(id!=null&&id!=""){
					demp_s.push(id);
				 }
			  });
			   
			  demp_s = unique(demp_s);
			  var demp_ss = [{'id':'请选择','name':'请选择'}];
			  $.each(demp_s,function(idx,nn){
				  var demp_id_name ={'id':nn,'name':subject_sum(parseInt(nn))};
				  demp_ss.push(demp_id_name);
			  });
			 subjects = demp_ss ;
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
	var center_id = centerAll.center_id;
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	
	$.ajax({
		url: Webversion + '/teacher',
		type: "GET",
		dataType: "json",
		data:{action:'list','condition':"center_id^"+center_id+"$"+"zone_id^"+zone_id+"$"+"level^4$subject_id^"+subid,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()},
		beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
		success: function (result) {
			 var htmlss = '<option value="请选择">请选择</option>';
			 if(result!=null){
				if(result.list!=null){
					$.each(result.list,function(ii,nn){
						htmlss += '<option value="'+nn.id+'">'+nn.realname+'</option>';
					});
					$('#'+dd+'_s').html(htmlss);
				}
			 }
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
}

//过滤被选择的科目
function resub(n){
	 var cssid = $(n).attr('id');
	 addsubject(subject_s,cssid);
	 $("select[name='classSubjects']").each(function(){
	 var selid = $(this).val();
	 if($(this).attr('id')!=cssid){
			$("#"+cssid+" option[value='"+selid+"']").remove(); 	
		}
 	});
}

//classForm   classUName  classstudys  classbeginTime  classendTime classPersons  classSubjects  classTeacher_s

 
//追加科目和教师options

function addteasub(){
	  
	if((subject_s.length-2)>=$("select[name='classSubjects']").length){
		var dtid_last = $('#addteasub dt:last').attr('id');
		if(dtid_last != undefined&&dtid_last!=null&&dtid_last!=""){
			
		}else{
			dtid_last = 'cssid_0';
		}
		var dtid_last_array = dtid_last.split('cssid_');
		subcssid = parseInt(dtid_last_array[1]);
		subcssid++;
		$('#addteasub').append('<dt style="height:20px;padding-top:5px; "id="cssid_'+subcssid+'">学科&nbsp;<select id="classSubjects_'+subcssid+'" name="classSubjects"  onfocus="resub(this);" onchange="changesub(this.value,\'classTeacher'+subcssid+'\');" style="width:100px;"  name="12"  panelHeight="auto"><option value="请选择">请选择</option></select>&nbsp;&nbsp;教师&nbsp;&nbsp;<select id="classTeacher'+subcssid+'_s" name="classTeacher_s" style="width:100px;"  name="12"  panelHeight="120"><option value="请选择">请选择</option></select>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="delteasub(\'cssid_'+subcssid+'\');">删除</a></dt>');	
	}else{
		$.messager.alert('温馨提示','学科已经添加完成！','info');	
	}
};
//删除科目和教师行
function delteasub(id){
	
	$('#'+id).remove();

};

//班级展示
 
function bigClass(fresh,classtypenum){
	
	var columnsjson =[[   
			{ field: 'class_Name', title: '班级名称', width: 100, align: 'center'},
			{ field: 'class_StuSum', title: 'class_StuSum', width: 100, hidden:'true' },
			
			{ field: 'sumsT', title: '班级人数', width: 60, align: 'center', sortable: true , 
                formatter: function (value, row, index) {
                    //var s = grade_sum(parseInt(value));
					if(fresh==0){
						return value.sums;
					}else{
						return '<a onclick="salert('+row.class_type+','+row.id+')">'+value.sums+'</a>';	
					}
                    
                }
			},
			{ field: 'class_Teacher', title: '任课教师', width: 220, align: 'center'},
			{ field: 'class_study', title: '班级学段', width: 60, align: 'center', sortable: true , 
                formatter: function (value, row, index) {
                    var s = grade_sum(parseInt(value));
                    return s;
                }
			},
			{ field: 'class_Status', title: '状态', width: 40, align: 'center', 
                formatter: function (value, row, index) {
                    var s = fresh==0?'<font color="#ccc">过往</font>':'当前';
                    return s;
                }
			},
			
			{ field: 'creat_Time', title: '建班时间', width: 70, align: 'center', sortable: true },
			{ field: 'end_Time', title: '结课时间', width: 70, align: 'center', sortable: true },
			{ field: 'center_id', title: 'center_id', width: 200, hidden: true },
			{ field: 'zone_id', title: 'zone_id', width: 200, hidden: true },
			{ field: 'teacher_id', title: 'teacher_id', width: 200, hidden: true },
			{ field: 'teacher_user_id', title: 'teacher_user_id', width: 200, hidden: true },
			{ field: 'subject_id', title: 'subject_id', width: 200, hidden: true },
			{ field: 'class_type', title: 'class_type', width: 200, hidden: true },
			{ field: 'class_instruction', title: 'class_instruction', width: 200, hidden: true },
			
			{
                field: 'id', title: '操作', align: 'center',width: 130, 
                formatter: function (value, row, index) {
                    var s = "<div style='line-height:25px;'><a href=\"#\" style='color:blue;' onclick=\"editClass('" + value + "'," + index + ")\">修改详细</a>&nbsp;<a href=\"#\" style='color:blue;' onclick=\"teaching_Note('" + value + "'," + index + ")\">教学备注</a><br /><a href=\"#\" style='color:blue;' onclick=\"test_Statistics('" + value + "'," + row.class_type + ")\">班级测评</a>&nbsp;<a href=\"#\" style='color:blue;' onclick=\"addOtherStudent('" + value + "'," + index + ")\">加入学生</a><br /><a href=\"#\" style='color:blue;' onclick=\"deleteclass('" + value + "','"+row.teacher_user_id+"')\">确认结班</a></div>";
					if(fresh==0){
						s = "<div style='line-height:25px;'><a href=\"#\" style='color:blue;' onclick=\"teaching_Note('" + value + "'," + index + ")\">教学备注</a>&nbsp;<a href=\"#\" style='color:blue;' onclick=\"test_Statistics('" + value + "'," + row.class_type + ")\">班级测评</a></div>";	
					}
                    return s;
                }
            }
        ]];
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	var url = 'Webversion + "/class?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc = {'action':'list','fresh':fresh,'condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+'$class_type^'+classtypenum};
	var functionres = 'Longding(result);';
	pager = datagridLoad('#bigClass',true,'#day_bar',columnsjson,url,"GET","json",datacc,functionres) ;
 	//绑定大班学生名称查询
	 $('document').KeyInput($("#teacher_Name"), '请输入教师姓名');
	  $('#BtnSearch_teacher').unbind('click');
	 $('#BtnSearch_teacher').click(function(){
		if($("#teacher_Name").attr("innt") == "1"){
			 $.messager.alert('温馨提示', '请输入真实姓名再搜索！', 'info');
	     }else{
			var teacher_Name = $('#teacher_Name').val();
			datacc['condition']= "center_id^"+centerAll.center_id+"$zone_id^"+zone_id+"$class_type^"+classtypenum+"$realname@"+teacher_Name ;
			pager = datagridLoad('#bigClass',true,'#day_bar',columnsjson,url,"GET","json",datacc,functionres) ;
		 }
	 });
}


function salert(class_type,classNid){
 
	window.location.href='Teaching_MyStudent.html?class_type='+class_type+'&class_id='+classNid;
}

//加载列表分页的形式显示
//加载分校区列表页面 返回datalistTemp数组
function Longding(result){
	
	if (result.list != null) {
		var datalistTemp = [];
		$.each(result.list, function (i, n) {
			var itemtemp = {};
			var teacher_temp = "";
			var Tid_temp = "";
			var subject_temp = "";
			var Tid_temp_user = ""; 
			if(result.teacher!=null&&result.teacher!=""){
				
				$.each(result.teacher,function(ii,nn){
					
					if(nn!=null&&(nn.class_id==n.id)){
						if(nn.subject_id!=null){
							teacher_temp+= nn.realname+',';
							Tid_temp+= nn.teacher_id+',';
							Tid_temp_user+=nn.user_id+',';
							subject_temp+= nn.subject_id+',';
						}
					}
				});
				teacher_temp = teacher_temp.substring(0,(teacher_temp.length-1));
				Tid_temp = Tid_temp.substring(0,(Tid_temp.length-1));
				Tid_temp_user = Tid_temp_user.substring(0,(Tid_temp_user.length-1));
				
				subject_temp = subject_temp.substring(0,(subject_temp.length-1));
				
				
			}else{
				teacher_temp="";	
				Tid_temp="";
				subject_temp="";
			}
			var stu_SumT = 0;
			var stu_NamesT= '';
			if(result.student!=null&&result.student!=""){
				$.each(result.student,function(i_S,n_S){
					if(n_S.class_id==n.id){
						stu_SumT++;
						stu_NamesT += n_S.realname+',';
					}
				});
			}
			itemtemp.teacher_id = Tid_temp;
			itemtemp.teacher_user_id = Tid_temp_user;
			itemtemp.subject_id = subject_temp;
			itemtemp.class_Teacher = teacher_temp;
			itemtemp.class_Name = n.class_name;
			itemtemp.sumsT = {'sums':stu_SumT,'names':stu_NamesT};
			itemtemp.class_StuSum = n.num_max;
			itemtemp.class_study = n.class_section;
			itemtemp.class_Status = n.status;
			itemtemp.creat_Time = n.begin_date;
			itemtemp.end_Time = n.end_date;
			itemtemp.center_id = n.center_id;
			itemtemp.zone_id = n.zone_id;
			itemtemp.class_type = n.class_type;
			itemtemp.id =  n.id;
			itemtemp.class_instruction = n.class_instruction;
			
			datalistTemp.push(itemtemp);
   
		});
        return datalistTemp;      
    }
}

 

//1对1班级管理
function oneToCounts(fresh,classtypenum){
	var columnsjson = [[
		    
			{ field: 'teacher_Name', title: '教师姓名', width: 60, align: 'center'},
			{ field: 'subject_id', title: '学科', width: 200, formatter: function (value, row, index) {
                    
                    return subject_sum(value);
                }
			},
			{ field: 'small_nums', title: '班级人数', width: 60, align: 'center' },
			{ field: 'stu_name', title: '当前学生', width: 440, align: 'left' },
			 
			 
			{ field: 'center_id', title: 'center_id', width: 200, hidden: true },
			{ field: 'zone_id', title: 'zone_id', width: 200, hidden: true },
			{ field: 'teacher_id', title: 'teacher_id', width: 200, hidden: true },
			
			{ field: 'class_type', title: 'class_type', width: 200, hidden: true },
			 { field: 'teacher_user_id', title: 'teacher_user_id', width: 200, hidden: true },
			 
			{
                field: 'id', title: '操作', align: 'center',width: 180, 
                formatter: function (value, row, index) {
                    var s = "<div style='line-height:25px;'><a href=\"#\" style='color:blue;' onclick=\"addOtherStudent(" + value + "," + index + ")\">加入学生</a>&nbsp;<a href=\"#\" style='color:blue;' onclick=\"test_Statistics('" + value + "'," + row.class_type + ")\">班级测评</a>&nbsp;<a href=\"#\" style='color:blue;' onclick=\"deleteclass('" + value + "','"+row.teacher_user_id+"')\">确认结班</a></div>";
                    return s;
                }
            } 
        ]];
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	var url = 'Webversion + "/class?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc = {'action':'list','fresh':fresh,'condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+'$class_type^'+classtypenum};
	var functionres = 'oneToCountsLongding(result);';
	//加载列表  并且返回pager
	pager = datagridLoad('#oneToCounts',true,'#month_bar',columnsjson,url,"GET","json",datacc,functionres);
}




//1对1班级管理逻辑操作
function oneToCountsLongding(result){
 	
	var datalistTemp = [];
	if(result.list!=null){
		 
		$.each(result.list,function(i,s){
			var itemtemp = {};
			var stu_temp = "";
			var onestunum = 0;
			var pass_num = 0;
			if(result.student!=null&&result.student!=""){
				$.each(result.student,function(ii,stuinfo){
					if(stuinfo.class_id==s.id){
						if(stuinfo.status==1){
							stu_temp += "&nbsp;"+stuinfo.realname+"&nbsp;";
							 
						}else{
							pass_num++;
						}
						onestunum++;
					}
				});
			}
			
			
			 
			itemtemp.small_nums = onestunum;
			itemtemp.teacher_Name = s.class_name;
			itemtemp.center_id = s.center_id;
			itemtemp.zone_id = s.zone_id;
			itemtemp.class_type = s.class_type;
			itemtemp.id = s.id;
			if(result.teacher!=null&&result.teacher!=""){
				$.each(result.teacher,function(ic,nc){
					if(s.id==nc.class_id){
						itemtemp.teacher_id = nc.teacher_id;
						itemtemp.teacher_user_id = nc.user_id;
						itemtemp.subject_id = nc.subject_id;
					}
				});		
			}
			itemtemp.stu_name = stu_temp;
			datalistTemp.push(itemtemp);
		
		});
	}
	return datalistTemp;
}


//创建大班班级页面加载成功的操作
function openfunction(){
	   $('#classUName').attr('disabled',false);
	  // $('#checkname').show();
	   
	   $.messager.progress('close');
	   validate_form('#classForm','#classUName','#classUName_Ms','#classstudys','#classstudys_Ms','#classbeginTime','#classbeginTime_Ms','#classendTime','#classendTime_Ms','#classPersons','#classPersons_Ms',0);
	   addsubject(subject_s,'classSubjects');  //更新教师列表
	  
}

//创建大班班级页面的点击确认以后的操作
function handfunction(){
	  /*---循环验证begin*/
	  var addSCtemp = true;
	  $.each($('.classForm'),function(ii,obj){
		  if(($(obj).html()).indexOf('ok.png')<0){
			  addSCtemp = false;
			  $.messager.alert('温馨提示', '信息不符合要求,请按要求填写！', 'info');	
			  return false;   //退出each循环,  加false;
	  }});
	  if(!addSCtemp){return false;}
	  
	  /*---验证end*/
	  var center_id = centerAll.center_id;
	  var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	  var classUName= $('#classUName').val();
	  var classstudys = $('#classstudys').combobox('getValue');
	  var classbeginTime = $('#classbeginTime').datebox('getValue');
	  var classendTime = $('#classendTime').datebox('getValue');
	  var classPersons= $('#classPersons').val();
	  var teacher_list = "";
	   
	   
	   
	  $("select[name='classTeacher_s']").each(function(ii_T,nn_T){
		  
			 if($(this).val()!='请选择'&&$(this).val()!=""){
				teacher_list += $(this).val()+"_";
			 } 
		 
 	  });
	  
	  teacher_list = teacher_list.substring(0,teacher_list.length-1);
	  if(teacher_list==null||teacher_list==""){
		 $.messager.alert('温馨提示','班级中必须有一个老师！','warning');
		 return false;   
	  }
	  var jsondata = {action:'add','center_id':center_id,'zone_id':zone_id,
						  'class_name':classUName,'class_instruction':'','class_section':classstudys,
						  'begin_date':classbeginTime,'end_date':classendTime,'num_max':classPersons,
						  'teacher_list':teacher_list}; 
	  
	  $.ajax({
		url: Webversion + '/class',
		type: "POST",
		dataType: "json",
		data:jsondata,
		success: function (result) {
			if(result.flag){
				$('#EditClass').dialog('close');
				$.messager.alert('温馨提示','添加成功!','info');
				pager.pagination("select");
			}  
		},
		error: function (result) {
			$('#EditClass').dialog('close');
			$.error('加载数据失败，添加失败！');
		}
	});
}



//修改班级信息
function editClass(value, index) {
	
	$('#EditClass').css('display','block');
	$('#myclass_name').html('当前学校：<span>'+centerAll.center_name+'</span>&nbsp;当前校区：<span>'+$('#A_zones',window.parent.document).find("option:selected").text()+'</span>');
    $.messager.progress({text:'正在获取班级基本信息'});
	var rowData = JSON.stringify(($('#bigClass').datagrid('getData').rows)[index]);
    // 获取校区相关数据
	var updateOpen = "updateOpen("+rowData+");";
	var updateHand = "updateHand("+rowData+");";
    alertCreate("#EditClass",'修改班级基本信息',550,350,updateOpen,updateHand,'修改','取消');
    $('#EditClass').dialog('open');

}

//修改大班班级页面加载成功  open
function updateOpen(rowData){
	  $.messager.progress('close');
	   validate_form('#classForm','#classUName','#classUName_Ms','#classstudys','#classstudys_Ms','#classbeginTime','#classbeginTime_Ms','#classendTime','#classendTime_Ms','#classPersons','#classPersons_Ms',1);
	  addsubject(subject_s,'classSubjects');  //更新教师列表
	  
	  $('#classUName').val(rowData.class_Name);
	 // $('#classUName').attr('disabled',true);
	  //$('#checkname').hide();
	  $('#classstudys').combobox('setValue',rowData.class_study);
	  $('#classbeginTime').datebox('setValue',rowData.creat_Time);
	  $('#classbeginTime').datebox('disable');
	  $('#classbeginTime_ms').html('&nbsp;<img src="../images/ok.png"/>'); 
	  $('#classendTime').datebox('setValue',rowData.end_Time);
	  $('#classPersons').val(rowData.class_StuSum);
	  var Tea_id = rowData.teacher_id;
	  var Tea_name = rowData.class_Teacher;
	  var subjects_id = rowData.subject_id;
	  var tea_idtemp = Tea_id.split(',');
	  var tea_nametemp = Tea_name.split(',');
	  var subject_idtemp = subjects_id.split(',');
	  	if(tea_idtemp.length>0){
			$.each(tea_idtemp,function(i,t){
				if(i!=0){
					  $('#addteasub').append('<dt style="height:20px;padding-top:5px; "id="cssid_'+(subcssid+i)+'">学科&nbsp;<select id="classSubjects_'+(subcssid+i)+'" name="classSubjects"  onfocus="resub(this);" onchange="changesub(this.value,\'classTeacher'+(subcssid+i)+'\');" style="width:100px;"  name="12"  panelHeight="auto"><option value="'+subject_idtemp[i]+'">'+subject_sum(parseInt(subject_idtemp[i]))+'</option></select>&nbsp;&nbsp;教师&nbsp;&nbsp;<select id="classTeacher'+(subcssid+i)+'_s" name="classTeacher_s" style="width:100px;"  name="12"  panelHeight="120"><option value="请选择">请选择</option></select>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="delteasub(\'cssid_'+(subcssid+i)+'\');">删除</a></dt>');
					$('#classSubjects_'+(subcssid+i)).attr("value",subject_idtemp[i]);
					changesub(parseInt(subject_idtemp[i]),('classTeacher'+(subcssid+i)));
					$('#classTeacher'+(subcssid+i)+'_s').attr("value",tea_idtemp[i]);
				}else{
					
					$('#classSubjects').attr("value",subject_idtemp[i]);
					changesub(parseInt(subject_idtemp[i]),'classTeacher'); 
					$('#classTeacher_s').attr("value",tea_idtemp[i]);
				}
			});
		}
	  
	  
}

//修改大班班级页面逻辑操作
function updateHand(rowData){
	/*---循环验证begin*/
	  var addSCtemp = true;
	  $.each($('.classForm'),function(ii,obj){
		   
		  if(($(obj).html()).indexOf('ok.png')<0){
			  addSCtemp = false;
			  $.messager.alert('温馨提示', '信息不符合要求,请按要求填写！', 'info');	
			  return false;   //退出each循环,  加false;
	  }});
	  if(!addSCtemp){return false;}
	  /*---验证end*/
	  
	  var class_id = rowData.id;
	  var center_id = rowData.center_id;
	  var zone_id = rowData.zone_id;
	  var classUName= $('#classUName').val();
	  var classstudys = $('#classstudys').combobox('getValue');
	  var classbeginTime = $('#classbeginTime').datebox('getValue');
	  var classendTime = $('#classendTime').datebox('getValue');
	  var classPersons= $('#classPersons').val();
	  var teacher_list = "";
	  
	  
	  $("select[name='classTeacher_s']").each(function(){
	  	 if($(this).val()!='请选择'&&$(this).val()!=""){
		 	teacher_list += $(this).val()+"_";
		 }
 	  });
	  teacher_list = teacher_list.substring(0,teacher_list.length-1);
	  
	  if(teacher_list==null||teacher_list==""){
		 $.messager.alert('温馨提示','班级中必须有一个老师！','warning');
		 return false;   
	  }
	  
	  
	 var jsondata = {action:'edit','id':class_id,'center_id':center_id,'zone_id':zone_id,'class_name':classUName,'class_instruction':'','class_section':classstudys,'begin_date':classbeginTime,'end_date':classendTime,'num_max':classPersons,'teacher_list':teacher_list,'fresh':$('#bigclass_Name').combobox('getValue')};
	   
	  $.ajax({
		url: Webversion + '/class',
		type: "POST",
		dataType: "json",
		data:jsondata,
		success: function (result) {
			if(result.flag){
				$('#EditClass').dialog('close');
				$.messager.alert('温馨提示','添加成功!','info');
				pager.pagination("select");
			}  
		},
		error: function (result) {
			$('#EditClass').dialog('close');
			$.error('加载数据失败，添加失败！');
		}
	});
}


//换班管理
function changeClass(value, index) {
    $.messager.progress({text:'正在获取班级基本信息'});
	var rowData = JSON.stringify(($('#bigClass').datagrid('getData').rows)[index]);
    // 获取校区相关数据
	var changeOpen = "changeOpen("+rowData+");";
	var changeHand = "changeHand("+rowData+");";
    alertCreate("#changeClass",'修改班级基本信息',570,350,changeOpen,changeHand,'修改','取消');
    $('#changeClass').dialog('open');

}

//换班管理页面加载成功  open
function changeOpen(rowData){
   $.messager.progress('close');   
}

//换班管理页面逻辑操作
function changeHand(rowData){
	$.messager.progress({ text: '系统正在处理' });
	//var paramesTempVis = { 'school_name': $('#AleInputSchoolName').val(), 'school_id': rowData.school_id };
	$.ajax({
		type: "POST",
		dataType: "json",
		url: Webversion + "/school?_method=PUT" ,
		//data: paramesTempVis,
		success: function (result) {
			$.messager.progress('close');
			$('#changeClass').dialog('close');
			$.remind('换班成功！');
			var pager = $('#bigClass').datagrid("getPager");
			pager.pagination("select");
		}, error: function (result) {
			$.messager.progress('close');
			$.error('系统出现异常，换班失败！');
		}
	});
}



//查看教学备注
function teaching_Note(value, index) {
	 
	var rowData = JSON.stringify(($('#bigClass').datagrid('getData').rows)[index]);
    // 获取校区相关数据
	var teaching_NoteOpen = "teaching_NoteOpen("+rowData+");";
    alertSel("#teaching_Note",'查看教学备注',570,350,teaching_NoteOpen,'关闭');
    $('#teaching_Note').dialog('open');
 
}

//教学备注页面加载成功  open
function teaching_NoteOpen(rowData){
    var noteCZC = centerAll.center_name +'&nbsp;'+$('#A_zones',window.parent.document).find("option:selected").text()+'&nbsp;'+rowData.class_Name+'&nbsp;教学备注';
   $('#note_CZC').html(noteCZC); 
	var url_typenote = '/remark'; 
    var Qjsonlist = {'action':'list_remark','center_id':rowData.center_id,'zone_id':rowData.zone_id,'class_id':rowData.id};
	var list_note = Ajax_option(url_typenote,Qjsonlist,"GET");
	var listhtmls = '';
	if(list_note.list!=null&&list_note.list!=""){
		$.each(list_note.list,function(i,n){
			listhtmls += '<ul ><li class="table_text_001 table_text">'+n.create_date+'</li><li class="table_text_002 table_text">'+n.realname+'</li><li class="table_text_003_1 table_text"><a title="'+n.content+'">'+n.content+'</a></li></ul><div class="cleared"></div>'; 
			
		});
		
	}else{
		listhtmls = '没有数据!';
	}
	$('#note_lists').html(listhtmls);
	 
}

//班级测评统计
function test_Statistics(value, class_type) {
	 var rowData = {'class_id':value,'class_type':class_type,'fresh':$('#bigclass_Name').combobox("getValue")};
	 window.location = "../Corrects/Students_Work.html?data="+Base64.encode(JSON.stringify(rowData));
	 
}


//加入除本班级以外的学生  value 是目标班级class_id
function addOtherStudent(value,index){
	 $('#version_lev_B').html('本校区'+public_Bigclass_name);
	 $('#version_T').html('本校区'+public_Bigclass_name);
	 
	//选项卡开始
	$(".tab").unbind('click');
	$(".tab").bind('click',function() {
		
		$(this).addClass("now_focus_1");
		$(this).siblings().removeClass("now_focus_1");
		var $dangqian = $(".con_box > div").eq($(".tab").index(this));
		$dangqian.addClass("now_focus_1");
		$dangqian.siblings().removeClass("now_focus_1");
		if($(this).html()=='无班级学生'){
			$('#bigclassname').combobox('setValue','请选择');
			$('#smallclassname').combobox('setValue','请选择');
			 
			search_Zonestu('noneclass',value,0);//加载列表  0是代表没有班级的学生
		}
	});
	 
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
	
	$('document').KeyInput($("#addSeaStu"), '请输入真实姓名');
	$('document').KeyInput($("#addSeaUser"), '请输入用户名');
	
	//绑定已存在学生搜索BtnaddSearthTeacher
	$("#BtnaddSearthStu").unbind('click');
	$("#BtnaddSearthStu").bind('click',function () {
		
		 if(($("#addSeaUser").attr("innt") == "1")&&($("#addSeaStu").attr("innt") == "1")){
			 $.messager.alert('温馨提示', '请输入用户名或者真实姓名再搜索！', 'info');
	     }else{
			var text_center_id = centerAll.center_id;
   		    var text_zoneid = $('#A_zones',window.parent.document).find("option:selected").val();
			var text_addSeaUser = $('#addSeaUser').val(); 
			var text_addSeaStu = $('#addSeaStu').val(); 
			var jsondata = {};
			if(text_addSeaUser!=""&&text_addSeaUser!='请输入用户名'&&text_addSeaStu!=""&&text_addSeaStu!='请输入真实姓名'){
				jsondata = {'action':'other_Zonestu','condition':"username^"+text_addSeaUser+"$realname^"+text_addSeaStu};
			}
			else if(text_addSeaUser==""||text_addSeaUser=='请输入用户名'){
				jsondata = {'action':'other_Zonestu','condition':"realname^"+text_addSeaStu};
			}else if(text_addSeaStu==""||text_addSeaStu=='请输入真实姓名'){
				jsondata = {'action':'other_Zonestu','condition':"username^"+text_addSeaUser};
			}
			
			search_otherT(jsondata,value);//加载列表
		 }
    });
	
	
	/*// 绑定无班级学生搜索
	$("#noneclass").unbind('click');
    $("#noneclass").bind('click',function () {
		$('#bigclassname').combobox('setValue','请选择');
		$('#smallclassname').combobox('setValue','请选择');
		 
        search_Zonestu('noneclass',value,0);//加载列表  0是代表没有班级的学生
    });*/
	 
	var classopen = 'classopen('+value+');';
	
	alertSel("#addSearthStudent",'加入学生',520,300,classopen,'关闭');
	$('#addSearthStudent').dialog('open');
 
}


function classopen(value){
	 
	
	$('#search_Zonestu').html("");
	$('#search_Zonestu_1').html("");
	$('#search_Zonestu_2').html("");
	var center_id = centerAll.center_id;
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	$.ajax({
		url: Webversion + '/class',
		type: "GET", 
		dataType: "json",
		data:{action:'name_list','condition':"center_id^"+center_id+"$"+"zone_id^"+zone_id},
		success: function (result) { 
			 if(result.list!=null){
				 var big_temps = [{'id':'请选择','name':'请选择'}];
				 var small_temps = [{'id':'请选择','name':'请选择'}];
				 $.each(result.list,function(idx,item){
					   if(item.id!=parseInt(value)){
						  var big_temp = {};
						  var small_temp = {};
						 
						  if(item.class_type=='1'&&(date_Diff_day(getNowDate(),item.end_date.substring(0,10))==1)){
							  
							  big_temp = {'id':item.id,'name':item.class_name};
							  big_temps.push(big_temp);
						  }else if(item.class_type=='2'){
							  small_temp = {'id':item.id,'name':item.class_name};
							  small_temps.push(small_temp);
						  } 
					   }
				 });
				// alert(JSON.stringify(big_temps) );
				  $('#bigclassname').combobox({
					data:big_temps,
					editable:false,
					valueField:'id',
					textField:'name',
					onLoadSuccess:function(){
						$(this).combobox('setValue','请选择');
					},
					onSelect:function(record){
						$('#smallclassname').combobox('setValue','请选择');
						if(record.id!='请选择'){
							search_Zonestu(record.id,value,1);
						}
					}
				  });
				  $('#smallclassname').combobox({
					data:small_temps,
					editable:false,
					valueField:'id',
					textField:'name',
					onLoadSuccess:function(){
						$(this).combobox('setValue','请选择');
					},
					onSelect:function(record){
						$('#bigclassname').combobox('setValue','请选择');
						if(record.id!='请选择'){
							search_Zonestu(record.id,value,2);
						}
					}
				  });
				  
			 }
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
	
}
// 加入已存在的学生--列出除本班级以外的学生   classtype_big_small_none =0是无班级  1是大班 2是小班
function search_Zonestu(classid,value,classtype_big_small_none){
   var nonetype = '';
   if(classid=='noneclass'){
	    nonetype = 'noneclass';
		classid = 0;
   }
   var text_center_id = centerAll.center_id;
   var text_zoneid = $('#A_zones',window.parent.document).find("option:selected").val();
   var datajson_sear = {'action':'other_stu','flag':false,'condition':"center_id^"+text_center_id+"$zone_id^"+text_zoneid+'$class_id^'+classid};
   if(classid==0){
	   datajson_sear['noclass_stu'] = 1;
   }
   $.ajax({
		url: Webversion + '/class',
		type: "GET",
		dataType: "json",
		data:datajson_sear,
		success: function (result) {
			 var htmls = ""; 
			 if(result.list!=null){
				 $.each(result.list,function(ist,item){
					 htmls+='<ul style="border-left:#CCC dotted 1px; display:inline-table;margin-left:5px;"><li class="text_float text_side" style="width:220px; text-align:center;">'+item.username+'</li><li class="text_float text_side" style="width:80px; text-align:center;">'+item.realname+'</li><li class="text_float text_side" style="width:80px; text-align:center;">'+item.tel+'</li><li class="text_float text_side" style="width:60px; text-align:center;"><a href="#" onclick="joinClass('+text_center_id+','+text_zoneid+','+item.student_id+','+value+','+item.class_stu_id+',\''+nonetype+'\');">加&nbsp;入</a></li></ul><div class="cleared"></div>'; 
			     });
			 }else{
				 if(classid!=0){
					htmls = '<p  align="center" style="line-height:25px; color:#ccc;">本班级没有学生！</p>';
				 }else{
					htmls = '<p  align="center" style="line-height:25px; color:#ccc;">未分配班级的学生为空！</p>'; 
				 }
			 }
			  if(classtype_big_small_none==1){
			 	$('#search_Zonestu_1').html(htmls);
			  }else if(classtype_big_small_none==2){
				 $('#search_Zonestu_2').html(htmls);
			  }else if(classtype_big_small_none==0){
				 $('#search_Zonestu').html(htmls); 
			  }
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	}); 
}

// 加入已存在的学生--列出除本班级以外的学生   按用户名 或者 真实姓名 查询
function search_otherT(jsondata,value){
   var text_center_id = centerAll.center_id;
   var text_zoneid = $('#A_zones',window.parent.document).find("option:selected").val();
   $.ajax({
		url: Webversion + '/class',
		type: "GET",
		dataType: "json",
		data:jsondata,
		success: function (result) {
			 var nonetype = '';
			 var htmls = ""; 
			 if(result.list!=null){
				 $.each(result.list,function(ist,item){
					 if(item.class_id==0){
						 nonetype = 'noneclass';
					 }
					 htmls+='<ul style="border-left:#CCC dotted 1px; display:inline-table;"><li class="text_float text_side" style="width:120px; text-align:center;">'+item.username+'</li><li class="text_float text_side" style="width:50px; text-align:center;">'+item.realname+'</li><li class="text_float text_side" style="width:150px; text-align:center;">'+centerAll.center_name+'-'+item.zone_name+'</li><li class="text_float text_side" style="width:70px; text-align:center;">'+item.tel+'</li><li class="text_float text_side" style="width:40px; text-align:center;"><a href="#" onclick="joinClass('+text_center_id+','+text_zoneid+','+item.student_id+','+value+','+item.class_stu_id+',\''+nonetype+'\');">加&nbsp;入</a></li></ul><div class="cleared"></div>';
			     });
			 }else{
				htmls = '<p  align="center" style="line-height:25px; color:#ccc;">没有找到此学生,请核对后再查找！</p>';
			 }
			 $('#search_otherT').html(htmls);
			 
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});      
}

// 加入已存在的学生--列出其他除本班级以外的学生  cid 学校id   zid 校区id  uid 用户id
function joinClass(cid,zid,stuid,classid,class_stu_id,nonetype){
	//alert(nonetype+'---'+classid);
	var class_types = "";  //限制学生加入小班判断  1 是加入大班  2是加入小班
	var class_typetext = $('.tabs-selected').text();
	 var text_zoneidTermps = $('#A_zones',window.parent.document).find("option:selected").val();
	if(class_typetext==(public_Bigclass_name+'管理')){
		class_types = 1;
	}else if(class_typetext=='1对1管理'){
		class_types = 2;
	}
	
	if(zid!=text_zoneidTermps){
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
						return false;
					}else{
						if(values_stus.length>(parseInt(max_counts)-parseInt(reality_counts))){
							$.messager.alert('温馨提示','本校区学生上限：'+max_counts+'<br />现有学生：'+reality_counts+'<br />本次所选人数超出数量限制，如需改变上限值，请与本校校长联系!','info');
							return false;
						}
					 
					}
				}
			}else{
				
				if(values_stus.length>(parseInt(zone_stu_nums)-parseInt(currite_zone_stu_nums))){
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
	 
	$.ajax({
		url: Webversion + '/class',
		type: "POST",
		dataType: "json",
		data:{'action':'join','center_id':cid,'zone_id':zid,'student_id':stuid,'class_id':classid,'nonetype':nonetype,'class_stu_id':class_stu_id,'class_type':class_types},
		success: function (result) {
			  if(result.find){
				  $.messager.alert('温馨提示','此学生已经添加过了,不能重复添加！','info');  
			  }else{
				 $.messager.alert('温馨提示','加入成功！','info'); 
				 pager.pagination("select",1);
				 if(nonetype=='noneclass'){
					 search_Zonestu('noneclass',classid,0);
			     }
			  }
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
}

//确认结班
function deleteclass(class_id,teaids){
	
    $.messager.confirm('温馨提示','结班以后成为过往班级，且不能还原为当前班级，确定结班吗？', function(r){
		if(r){
			var teaJson =  "";
			var deleQjson = {'action':'end_class','class_id':class_id};
			if(teaids!=""){
				teaJson = teaids.split(",");
				deleQjson = {'action':'end_class','class_id':class_id,'teacher_user_ids':teaJson};
			}
			var deleurl_type = '/class';
			var deleres = Ajax_option(deleurl_type,deleQjson,"post");
			pager.pagination("select",1);
		}
	});

}


//验证表单
function valida_null(a){
	var sss = $(a).val();	
	if(sss.length<=0){
		if(a.id=='classUName'){
			$('#classUName_Ms').html('&nbsp;班级名称不能为空!');
		
		}else if(a.id=='classPersons'){
			$('#classPersons_Ms').html('&nbsp;班级上限不能为空!');	
	
		}
	} 
}

//验证表单

function validate_form(form,name,name_ms,studys,studys_ms,benginTime,benginTime_ms,endTime,endTime_ms,person,person_ms,type){
	 
    $(form)[0].reset();
	$("select[name='classTeacher_s']").each(function(){
	  	 var id = $(this).parent().attr('id');
		 if(id!=undefined&&id!=""){
			$('#'+id).remove();
		 }
 	  });
	if(type==0){
		$(name_ms).html('&nbsp;班级名称不能为空!');
		$(studys_ms).html('&nbsp;请选择学段！');
		$(benginTime_ms).html('&nbsp;开班时间不能为空！');
		$(endTime_ms).html('&nbsp;结束时间不能为空！');
		$(person_ms).html('&nbsp;班级上限只能为数字！');
		 
	}else if(type==1){
		$(name_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(studys_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(benginTime_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(endTime_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(person_ms).html('&nbsp;<img src="../images/ok.png"/>');
	}
	
    // 定义负责人验证方式
    $.extend($.fn.validatebox.defaults.rules, {
		CheckclassName: {     //验证用户名存在与否  不存在的情况下才能注册
            validator: function (value, param) {
                $(name).html("");
				var UserNameSum  =  1;  //判断用户名的长度
                if($.trim(value).length>=UserNameSum){
					 $(name_ms).html('&nbsp;<img src="../images/ok.png"/>'); 
					 return true;
				}else{
					$(name_ms).html('&nbsp;班级不能为空');
					return false;
				}
            },
            message: '班级名字不能为空！'
        },
		CheckPerson: {     //验证用户名存在与否  不存在的情况下才能注册
            validator: function (value, param) {
                $(person).html("");
				var UserNameSum  =  1;  //判断用户名的长度
				
				
                if(/^\d*$/i.test(value)){
					 $(person_ms).html('&nbsp;<img src="../images/ok.png"/>'); 
					 return true;
				}else{
					$(person_ms).html('&nbsp;班级上限为数字！');
					return false;
				}
				 
            },
            message: '班级上限为数字！'
        }
    });
 
	$(name).validatebox({  //联系方式验证
        required: true,
        validType: "CheckclassName",
        missingMessage: '班级名字不能为空！'
    });
	$(person).validatebox({  //联系方式验证
        required: true,
        validType: "CheckPerson",
        missingMessage: '班级上限为数字！'
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
	 if(type==0){
		 $(benginTime).datebox({   //验证单选下来列表combobox
				
				editable:false,
				width:120,
				onChange: function (newValue, oldValue) {
				   if(newValue!=0&&newValue!=""&&(date_Diff_day(getNowDate(),newValue)==1)){
					  if($(endTime).datebox('getValue')!=0&&$(endTime).datebox('getValue')!=""){
						 if(date_Diff_day($(endTime).datebox('getValue'),newValue)==0){
							$(benginTime_ms).html('&nbsp;<img src="../images/ok.png"/>'); 
							$(endTime_ms).html('&nbsp;<img src="../images/ok.png"/>'); 
						 }else{
							$(endTime_ms).html('&nbsp;开始时间大于(等于)截止时间！');	 
						 }
					  }else{
						 $(benginTime_ms).html('&nbsp;<img src="../images/ok.png"/>'); 
					  }
					  
				   }else if(date_Diff_day(getNowDate(),newValue)==0){
					  $(benginTime_ms).html('&nbsp;开始时间小于当前时间！');	
				   }else{
					  $(benginTime_ms).html('&nbsp;开始时间不能为空！');	
				   }
				}
				 
		 });
	 }else{
		 $(benginTime_ms).html('&nbsp;<img src="../images/ok.png"/>'); 
	 }
	 $(endTime).datebox({   //验证单选下来列表combobox
			editable:false,
			width:120,
            onChange: function (newValue, oldValue) {
			    
			   if(newValue!=""&&(date_Diff_day(newValue.substring(0,10),getNowDate())==0)&&(date_Diff_day(newValue.substring(0,10),$(benginTime).datebox('getValue').substring(0,10))==0)){
				 $(endTime_ms).html('&nbsp;<img src="../images/ok.png"/>');
				 
			   }else if((date_Diff_day(newValue.substring(0,10),getNowDate())==1)||(date_Diff_day(newValue.substring(0,10),$(benginTime).datebox('getValue').substring(0,10))==1)){
				   $(endTime_ms).html('&nbsp;截止时间小于(等于)当前(开始)时间！');	
			   }else{
			   	  $(endTime_ms).html('&nbsp;截止时间不能为空！');	
			   }
            }
             
     });
	 
}


//修改学生信息
function editStudent(value, index) {
    var rowData = ($('#bigClass').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "editStudent.html?data="+rowData;
}
//查看学生测评
function selSrudentCorrects(value, index) {
    var rowData = ($('#bigClass').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "selSrudentCorrects.html?data="+rowData;
}

//查看班级学科报告
function selSubjectInfo(value, index) {
    var rowData = ($('#bigClass').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "subjectinfo.html?data="+rowData;
}

//查看历史学习报告
function histroyStudys(value, index){
	var rowData = ($('#bigClass').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "histroystudys.html?data="+rowData;
}


function teaching_Assign(value, index,typeid){
	//var rowData = ($('#bigClass').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "teaching_Assign.html?typeid="+typeid;
}

//报班管理
function subClass (value, index,typeid){
	//var rowData = ($('#bigClass').datagrid('getData').rows)[index];
 	//alert(JSON.stringify(rowData) );
	window.location.href = "subClassManage.html?typeid="+typeid;
}

