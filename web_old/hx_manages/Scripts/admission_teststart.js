  var UserInfo=null;
  var centerAll=null;
  var checkedstus = [];
$().ready(function (){
	var  tabs_name = $('.tabs-title', window.parent.document);	  //获得iframe父页面的节点内容
	 
    UserInfo = $.evalJSON($.cookie("UserInfo"));
	centerAll = $.evalJSON($.cookie("centerAll"));
	$('.nextstaptest').hide();
	$('.save_link').hide();  
	$('.tab_list_3').show();
	$('.next_link').show();
	validate_form('#StudentForm','#stuUName','#stuUName_Ms','#stuRealName','#stuRealName_Ms','#stuEmail','#stuEmail_Ms','#stusex','#stusex_Ms','#classstudys','#classstudys_Ms','#schoolName','#schoolName_Ms','#stuTel','#stuTel_Ms',0);	
	$(".title_box_3 div").click(function() {
		if($(this).text()=='新注册会员'){
			validate_form('#StudentForm','#stuUName','#stuUName_Ms','#stuRealName','#stuRealName_Ms','#stuEmail','#stuEmail_Ms','#stusex','#stusex_Ms','#classstudys','#classstudys_Ms','#schoolName','#schoolName_Ms','#stuTel','#stuTel_Ms',0);	
		}
		$(this).addClass("now_focus_3");
		$(this).siblings().removeClass("now_focus_3");
		var $dangqian = $(".con_box > div").eq($(".title_box_3 div").index(this));
		$dangqian.addClass("now_focus_3");
		$dangqian.siblings().removeClass("now_focus_3");
	}); 
	
	
	
	   
	
});   //.ready的结束符号


//下一步
function nextstap(){
	var tab_id = $('.title_box_3 .now_focus_3').attr("id");
	checkedstus = [];
	if(tab_id=='tab_1'){
		
		var addSCtemp = true;
		$.each($('.stuForm'),function(ii,obj){
			if(($(obj).html()).indexOf('ok.png')<0){
				addSCtemp = false;
				$.messager.alert('温馨提示', '信息不符合要求,请按要求填写！', 'info');
				return false;   //退出each循环,加false;
				
		}});
		if(!addSCtemp){return false;}
		
		var center_id = centerAll.center_id;
		var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
		var stuUName= $('#stuUName').val();
		var stuRealName = $('#stuRealName').val();
		var stusex = $("input[@name=stusex]:checked").val();
		var stuEmail = $('#stuEmail').val();
		var grade = $('#classstudys').combobox('getValue');
		var schoolName = $('#schoolName').val();
		var stuTel = $('#stuTel').val();
		var jsondata = {action:'add','center_id':center_id,'zone_id':zone_id,'username':stuUName,'realname':stuRealName,'gender':stusex,'email':stuEmail,'grade':grade,'schoolName':schoolName,'tel':stuTel,'class_type':0,'teacher_list':[],'note':''}; 
		var stureg_res = Ajax_option('/student',jsondata,"POST");
		if(stureg_res.flag){
			checkedstus.push({'stu_id':stureg_res.user_id,'stu_name':stuRealName});
			$('.tab_list_3').hide();
			$('.next_link').hide();
			$('.nextstaptest').show();
			$('.save_link').show();
			getsubjectTestList(1);
			
		}
		 
		
		
	}else if(tab_id=='tab_2'){
		
		$('#search_stulist input[type="checkbox"]').each(function(i, e_n) {
            if($(e_n).attr("checked")){
				checkedstus.push({'stu_id':$(e_n).attr("uid"),'stu_name':$(e_n).attr("stuname")});
				 
			}
        });
		 
		if(checkedstus!=""){
			//checkedstus  数据
			$('.tab_list_3').hide();
			$('.next_link').hide();
			$('.nextstaptest').show();
			$('.save_link').show();
			getsubjectTestList(1);
				
		}else{
			$.messager.alert('温馨提示','请选择学生！','info');	
		}
		
	
	}
	
	
}

//获取科目下面的试卷列表
function getsubjectTestList(values){
	var center_id = centerAll.center_id;
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	var  url_type = '/examination_paper';
	var Qjson = {'action':'get_share_exam','center_id':center_id,'zone_id':zone_id,'subject_id':values,'exam_type':6};
	var result_test = Ajax_option(url_type,Qjson,'GET');
	var rehtml = '';
	if(result_test.list!=null){
		$.each(result_test.list,function(i_s,n_s){
			rehtml += '<li id="list_M_'+n_s.id+'" cname="'+n_s.name+'" teacher_name="'+n_s.teacher_realname+'" create_date="'+n_s.create_date.substring(0,10)+'" cid="'+n_s.id+'" subjects_id="'+n_s.subject_id+'" grade_id="'+n_s.grade+'">'+n_s.name+'&nbsp;(&nbsp;'+n_s.teacher_realname+'&nbsp;'+n_s.create_date.substring(0,10)+'&nbsp;)&nbsp;<a href="javascript:void(0)" onclick="add_Test(this)">加入</a></li>';
		});	
	}
	
	$('.test_lists').html(rehtml);
	$('.test_checked li').each(function(i_t,n_t) {
        $('#list_M_'+$(n_t).attr('cid')).html($(n_t).attr('cname')+'&nbsp;(&nbsp;'+$(n_t).attr('teacher_name')+'&nbsp;'+$(n_t).attr('create_date')+'&nbsp;)&nbsp;<font color="#847c2A">已加入</font>');
    });
	
}


//按用户名查询
function selusername(){
	 
	var username = $(' input[name="username_Sea"]').val();  
	var jsondatas = {'action':'getStudentDetailInfo','username':username};
	var stureg_res = Ajax_option('/student',jsondatas,"GET");	
	var list_TT = [];
	if(stureg_res.user_info!=false){
		list_TT.push(stureg_res.user_info); 
	}else{
		list_TT = null;
	}
	setstuvalues(list_TT);
}

//按真实姓名查询
function selrelname(){
	 
	var realname = $(' input[name="realname_Sea"]').val();   
	var jsondatas = {'action':'getStudentDetailInfo','realname':realname};
	var stureg_res = Ajax_option('/student',jsondatas,"GET");		
	var list_TT = [];
	if(stureg_res.user_info!=false){
		list_TT.push(stureg_res.user_info);
	}else{
		list_TT = null;
	}
	setstuvalues(list_TT);
}

//新生源 老生源查询
function setstudents(){
	var center_id = centerAll.center_id;
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	var startus = $('#zone_stu_source').val();  // 0 老生源  1 新生源
	var jsondatas = {'action':'other_stu','center_id':center_id,'zone_id':zone_id,'noclass_stu':1,'flag':true,'condition':'center_id^'+center_id+'$zone_id^'+zone_id+'$new_student_status^'+startus};
	var stureg_res = Ajax_option('/class',jsondatas,"GET");	
	setstuvalues(stureg_res.list);
}
//给查询到的内容 显示在页面中
function setstuvalues(res_list){
	
	var stu_list = '<tr bgcolor="#f5f5f5"><td>用户名</td><td>姓 名</td><td>联系电话</td><td>年 级</td><td>操 作</td></tr>';
	if(res_list!=null){
		$.each(res_list,function(i,n){
			stu_list +=	'<tr><td>'+n.username+'</td><td>'+n.realname+'</td><td>'+n.tel+'</td><td>'+edu_grade_stu(parseInt(n.grade))+'</td><td><input type="checkbox" name="stu_ck" uid="'+n.user_id+'" stuname="'+n.realname+'" stuid="'+n.student_id+'"  center_id="'+n.center_id+'" zone_id="'+n.zone_id+'"/></td></tr>';		
		});
	}else{
		stu_list +=	'<tr><td colspan="5">没有查询到数据！</td></tr>';	
	}
	$('#search_stulist').html(stu_list);	
}

//保存
function saveTemp(){
	 
	//assign_mode 0按班,1按人  
// assign_type  1 online  2 word
//end_date  结束时间  
//ti_id  试卷id
//assign_to  派送学生json
//exam_type 组卷类型
//center_id 
//zone_id
	var class_stus = [{'class_id':0,'class_name':'临时','stu_num':checkedstus.length,'stu_ids':checkedstus}];
	//{'ti_id':,'grade_id':}
	var ti_ids = [];
	var Send_time = getthedate(10);
	if($('.test_checked li').length!=0){
		$('.test_checked li').each(function(li_i, li_n) {
			ti_ids.push({'ti_id':$(li_n).attr("cid"),'grade_id':$(li_n).attr("grade_id"),'subject_id':$(li_n).attr("subjects_id")});
		});
	}else{
		return false;	
	}
	
	var datacc1 = {'action':'dispatch_entrance_tests','assign_mode':1,'assign_type':1,'end_date':Send_time,'exam_info':JSON.stringify(ti_ids),'assign_to':class_stus,'exam_type':6,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
    console.log(JSON.stringify(datacc1));
	$.ajax({
        url: Webversion + '/examination_paper', //url访问地址
        type: "POST",
        data: datacc1,
        dataType: "json",
        success: function (result){
			 
			window.location.href='./GroupRollCenter.html';
        }
    });	
	
}
 

function add_Test(e){
	var cnames = $(e).parent().attr('cname');
	var cid_css = $(e).parent().attr('cid');
	var teachername = $(e).parent().attr('teacher_name');
	var creat_date = $(e).parent().attr('create_date');
	var grade = $(e).parent().attr('grade_id');
	var subjects_id = $(e).parent().attr('subjects_id');
	$(e).parent().html(cnames+'&nbsp;(&nbsp;'+teachername+'&nbsp;'+creat_date+'&nbsp;)&nbsp;<font color="#847c2A">已加入</font>');
	$('.test_checked').append('<li cid="'+cid_css+'" teacher_name="'+teachername+'" create_date="'+creat_date+'" subjects_id="'+subjects_id+'" cname="'+cnames+'" grade_id="'+grade+'">'+cnames+'&nbsp;(&nbsp;'+teachername+'&nbsp;'+creat_date+'&nbsp;)&nbsp;<a href="javascript:void(0)" onclick="remove_Test(this)">取消</a></li>');	
}

function remove_Test(ef){
	var ccnames = $(ef).parent().attr('cname');
	var cid_css = $(ef).parent().attr('cid');
	var teachername = $(ef).parent().attr('teacher_name');
	var creat_date = $(ef).parent().attr('create_date');
 
	$(ef).parent().remove();
	$('#list_M_'+cid_css).html(ccnames+'&nbsp;(&nbsp;'+teachername+'&nbsp;'+creat_date+'&nbsp;)&nbsp;<a href="javascript:void(0)" onclick="add_Test(this)">加入</a>');	
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
