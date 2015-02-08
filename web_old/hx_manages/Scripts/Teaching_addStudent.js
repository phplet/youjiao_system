var UserInfo = {};
var centerAll = {};
var subject =[];  //科目
 
$(document).ready(function () {

    UserInfo = $.evalJSON($.cookie("UserInfo"));
    centerAll = $.evalJSON($.cookie("centerAll"));  //center id  name
   
	//选项卡开始
	$(".tab").click(function() {
		$(this).addClass("now_focus");
		$(this).siblings().removeClass("now_focus");
		var $dangqian = $(".con_box > div").eq($(".tab").index(this));
		$dangqian.addClass("now_focus");
		$dangqian.siblings().removeClass("now_focus");
		$('#addteasub select[@name="classSubjects"]').text('请选择');
		$('#addteasub select[@name="classTeacher_s"]').text('请选择');
		
	});
 
 

	//加载科目
	$.ajax({
		url: Webversion + '/teacher',
		type: "GET",
		dataType: "json",
		async:false,
		data:{action:'list','condition':"center_id^"+centerAll.center_id+"$"+"zone_id^"+$('#A_zones',window.parent.document).find("option:selected").val()+"$"+"level^4",'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()},
		beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
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
			 subject = demp_ss ;
			}
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
    
     
	
	//增加班级click
	$('#classsub').click(function(){
		var center_id = centerAll.center_id;
		var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
		createclass(center_id,zone_id);
	});
	
	
	addsubject(subject,'classSubjects');

});

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

 

//创建班级
function createclass(cid,zid){
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
	  $("select[name='classTeacher_s']").each(function(){
	  	 if($(this).val()!='请选择'&&$(this).val()!=""){
		 	teacher_list += $(this).val()+"_";
		 }
 	  });
	  teacher_list = teacher_list.substring(0,teacher_list.length-1);
	 var jsondata = {action:'add','center_id':center_id,'zone_id':zone_id,'class_name':classUName,'class_instruction':'','class_section':classstudys,'begin_date':classbeginTime,'end_date':classendTime,'num_max':classPersons,'teacher_list':teacher_list};
	  
	  
	  $.ajax({
		url: Webversion + '/class',
		type: "POST",
		dataType: "json",
		data:jsondata,
		success: function (result) {
			if(result.flag){
				$.messager.alert('温馨提示','添加成功!','info');
				window.location='MyClass_Student.html';
			}  
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
	
}


function resub(n){
	 var cssid = $(n).attr('id');
	 addsubject(subject,cssid);
	 $("select[name='classSubjects']").each(function(){
	 var selid = $(this).val();
	 if($(this).attr('id')!=cssid){
			$("#"+cssid+" option[value='"+selid+"']").remove(); 	
		}
 	});
}

//classForm   classUName  classstudys  classbeginTime  classendTime classPersons  classSubjects  classTeacher_s

 

var cssid = 1;
function addteasub(){
	cssid++;
	if((subject.length-2)>=$("select[name='classSubjects']").length){
		$('#addteasub').append('<dt style="height:20px;padding-top:5px; "id="cssid_'+cssid+'">'+cssid+'.学科&nbsp;<select id="classSubjects_'+cssid+'" name="classSubjects"  onfocus="resub(this);" onchange="changesub(this.value,\'classTeacher'+cssid+'\');" style="width:100px;"  name="12"  panelHeight="auto"><option value="请选择">请选择</option></select>&nbsp;&nbsp;教师&nbsp;&nbsp;<select id="classTeacher'+cssid+'_s" name="classTeacher_s" style="width:100px;"  name="12"  panelHeight="120"><option value="请选择">请选择</option></select>&nbsp;&nbsp;&nbsp;&nbsp;<a onclick="delteasub(\'cssid_'+cssid+'\');">删除</a></dt>');	
	}else{
		$.messager.alert('温馨提示','学科已经添加完成！','info');	
	}
	

};


function delteasub(id){
	
	$('#'+id).remove();

};

//遍历重复的数组
function unique(arr) {  
	var temp = {}, len = arr.length;

	for(var i=0; i < len; i++)  {  
		if(typeof temp[arr[i]] == "undefined") {
			temp[arr[i]] = 1;
		}  
	}  
	arr.length = 0;
	len = 0;
	for(var i in temp) {  
		arr[len++] = i;
	}  
	return arr;  
}

// 1 语文 2 数学 3 英语 4 物理 5 化学 6 生物 7 地理 8 历史 9 政治
function subject_sum(temp_sum){
	 
	switch(temp_sum)
				{
   					case 1:
    				return '语文';
    				break;
  			 		case 2:
    				return '数学';
    				break;
					case 3:
    				return '英语';
    				break;
					case 4:
    				return '物理';
    				break;
					case 5:
    				return '化学';
    				break;
					case 6:
    				return '生物';
    				break;
					case 7:
    				return '地理';
    				break;
					case 8:
    				return '历史';
    				break;
					case 9:
    				return '政治';
    				break;
				}
			 
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
	if(type==0){
		$(name_ms).html('&nbsp;班级名称不能为空!');
		/*$(realname_ms).html('&nbsp;请输入中文姓名,2-4位汉字！');
		$(tel_ms).html('&nbsp;联系方式为11位数字！');
		$(email_ms).html('&nbsp;用户邮箱必须为电子邮件格式！');*/
		/*$(sub_ms).html('&nbsp;学科不能为空!');
		$(school_ms).html('&nbsp;校区不能为空！');	*/
	}else if(type==1){
		$(name_ms).html('&nbsp;<img src="../images/ok.png"/>');
		/*$(realname_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(tel_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(email_ms).html('&nbsp;<img src="../images/ok.png"/>');*/
		/*$(school_ms).html('&nbsp;<img src="../images/ok.png"/>');
		$(sub_ms).html('&nbsp;<img src="../images/ok.png"/>');*/
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
                if($.trim(value).length>=UserNameSum){
					 $(person_ms).html('&nbsp;<img src="../images/ok.png"/>'); 
					 return true;
				}
            },
            message: '班级上限不能为空！'
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
        missingMessage: '班级上限不能为空！'
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
	 $(benginTime).datebox({   //验证单选下来列表combobox
            
			editable:false,
            onChange: function (rec) {
               if(rec!=0){
				 $(benginTime_ms).html('&nbsp;<img src="../images/ok.png"/>');
			   }else{
			   	  $(benginTime_ms).html('&nbsp;开始时间不能为空！');	
			   }
            }
             
     });
	 
	 $(endTime).datebox({   //验证单选下来列表combobox
            
			editable:false,
            onChange: function (rec) {
               if(rec!=0){
				 $(endTime_ms).html('&nbsp;<img src="../images/ok.png"/>');
			   }else{
			   	  $(endTime_ms).html('&nbsp;开始时间不能为空！');	
			   }
            }
             
     });
	 
}