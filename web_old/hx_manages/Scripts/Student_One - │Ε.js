var UserInfo = {};
var centerAll = {};
var pager="";
var studata ={};
var class_names = "";
$().ready(function () {
	 
    UserInfo = $.evalJSON($.cookie("UserInfo"));
    centerAll = $.evalJSON($.cookie("centerAll"));
	 
	//判断是不是一对一学生
	var tabs_name = $('#feature', window.parent.document).tree('getSelected');
	
	var class_Tname = "";
	var datatemp = getUrlParam("data");
	class_names = getUrlParam("classname");
	if(datatemp!=""&&datatemp!=null){
		studata = $.parseJSON(Base64.decode(datatemp));
	}
	 
	if(($(tabs_name.target).text())=='一对一学生管理'){
		$('#stu_title').html('&nbsp;&nbsp;班级与学生管理&nbsp;>>&nbsp;一对一学生管理&nbsp;>>&nbsp;学生管理&nbsp;>>&nbsp;学生详细');
	}else{
		$('#stu_title').html('&nbsp;&nbsp;班级与学生管理&nbsp;>>&nbsp;大班管理&nbsp;>>&nbsp;当前班级&nbsp;>>&nbsp;学生详细');
	}
	$('.student_title').html(centerAll.center_name+'&nbsp;'+$('#A_zones',window.parent.document).find("option:selected").text()+'&nbsp;');
	$('#student_info').html('<li class="text_float" style="width:24%"><table border="0" cellpadding="0" cellspacing="0" class="student_info" width="100%" ><tr><td width="70" >'+(studata.gender==1?'<img src="../images/man.gif" width="54" height="85" />':'<img src="../images/women.gif" width="54" height="85" />')+'</td><td width="60" align="right"> 等级：<br />用户名：<br />姓名：<br />昵称：</td><td width="90"> 一品大学士<br />'+studata.username+'<br />'+studata.realname+'<br />无</td></tr><tr><td>'+(studata.gender==1?'男':'女')+'&nbsp;--岁</td><td>入班时间：</td><td>'+studata.creator_date.substring(0,10)+'</td></tr></table></li><li class="text_float student_link" style="width:20%"><div><span>当前年级：'+edu_grade(parseInt(studata.grade))+'</span><br /><span>在读学校：'+studata.school_name+'</span><br /><span>学生最近登录时间：'+studata.last_login_time+'</span><br /><span>最近发送报告时间：2013-05-12</span></div><div><a href="javascript:void(0);" onclick="send_message();">发消息</a>&nbsp;<a href="javascript:void(0); "onclick="reSetPass('+studata.user_id+',\'/center_admin\');" >重置密码</a>&nbsp;</div></li><li class="text_float" style="width:54%"><div class="student_link" style=" background-color:#FFF;"><span>作业统计：交来8次/共有10次</span><br /><span>测评统计：交来8次/共有10次</span><br /><span>测评等级：</span><br /><span>发送学习报告 派送新测评</span><br /> <span>新交来  作业2222 测评批阅</span></div></li>');
	 
	var columnsjson = [[   
	
		    { field: 'sendTime', title: '派送时间', width: 120, align: 'center', sortable: true },
			{field: 'title', title: '测评/作业标题', width: 80, align: 'center'},
			{field: 'subject', title: '学科/课程', width: 80, align: 'center',formatter: function (value, row, index) {
                    var html = '';
                    if (value != null) {
                         html = subject_sum(parseInt(value));
                    }
                    return html;
                }
			},
			{field: 'classname', title: '班级名称', width: 80, align: 'center'},
			{field: 'teacher', title: '任课教师', width: 80, align: 'center'},
			{field: 'center_id', title: '学校ID', width: 80, align: 'center',hidden:true},
			{field: 'zone_id', title: '校区ID', width: 80, align: 'center',hidden:true}, 
			{field: 'class_id', title: 'class_id', width: 80, align: 'center',hidden:true},
			{field: 'teacher_id', title: 'teacher_id', width: 80, align: 'center',hidden:true},
			{field: 'exercise_id', title: 'exercise_id', width: 80, align: 'center',hidden:true},
			{field: 'assign_id', title: 'assign_id', width: 80, align: 'center',hidden:true},
			{field: 'end_date', title: 'end_date', width: 80, align: 'center',hidden:true},
			{ field: 'score', title: '得分率', width: 80, align: 'center', sortable: true },
            {
                field: 'type', title: '状态', width: 80, align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
					var dd = date_Diff_day(row.end_date.substring(0,10),getNowDate());
                    if(dd==1){
						 value = 0;
					}
					html = status_sum(parseInt(value));
                    return html;
                }
            },
            {
                field: 'id', title: '操作', align: 'center',
                formatter: function (value, row, index) {
					var dd = date_Diff_day(row.end_date.substring(0,10),getNowDate());
					var s = "";
					var temp_test = {'testname':row.title,'class_id':row.class_id,'classname':Base64.decode(class_names),'assign_id':row.assign_id,'exam_id':row.exercise_id,'center_id':row.center_id,'zone_id':row.zone_id,'score':row.score,'subject_id':row.subject,'study_exercise_id':row.id};
					  
					if(dd==1){
						s = '<a href="">重新派送</a>';
					}else{
						if(row.type==1){
							s = '<a href="">提醒提交</a>';	
						}else if(row.type==2){
							s = '<a onclick="pings(\''+Base64.encode(JSON.stringify(temp_test))+'\');">测评批阅</a>';	
						}else if(row.type==3){
							s = '<a onclick="showViews(\''+Base64.encode(JSON.stringify(temp_test))+'\')">查看测评</a>';	
						}else if(row.type==4){
							
						}
					}
                    /*var s = "<table><tr><td style=\"border:none;text-align:left;\"><a href=\"#\" style='color:blue;' onclick=\"SelectPerson('" + value + "'," + index + ")\">提醒提交</a>&nbsp;<a href=\"#\" style='color:blue;' onclick=\"EditSchoolName('" + value + "'," + index + ")\">测评批阅</a></td></tr></table>";*/
                    return s;
                }
            }
        ]];
	//加载测评详情数据列表
	 
	var url= 'Webversion + "/test/list/all?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc = {'assign_type':3,'creator':UserInfo.id,'user_id':studata.user_id};
	var functionres = 'Longding(result);';
	 
	//加载列表  并且返回pager
	pager = datagridLoad('#Assesslist',false,"",columnsjson,url,"GET","json",datacc,functionres) ;
	 
	changeWeek('this');//当前周时间
	seteditValues(studata);//设置学生的基本信息
	
	//绑定修改学生基本信息
	$('#editstuBtn').click(function (){
		var stuid = 1;
		editStuInfo(stuid);
	});

});



function Longding(result){
	var datalistTemp = [];
	if (result.test != null) {
		$.each(result.test,function(i,n){
			var itemtemp = {}; 
			itemtemp.sendTime = n.assign_date;
			itemtemp.title = n.name;
			itemtemp.subject = n.subject_id;
			itemtemp.classname = Base64.decode(class_names);  	
			itemtemp.teacher = n.teacher_name;
			itemtemp.center_id = studata.center_id;
			itemtemp.zone_id = studata.zone_id;
			itemtemp.class_id = n.class_id;
			itemtemp.teacher_id = "";
			itemtemp.score = n.my_score;
			itemtemp.type = n.type;
			itemtemp.end_date = n.end_date;
			itemtemp.id = n.study_exercise_id;
			itemtemp.exercise_id = n.exercise_id;
			itemtemp.assign_id = n.assign_id;
			datalistTemp.push(itemtemp);
		});
           
    }
	return datalistTemp;   

}

function seteditValues(sss){
	           
	$('#stuname_span').html(sss.realname);
	$('#stusex_span').html(sss.gender==1?'男':'女');
	$('#stuemail_span').html(sss.email);	
	$('#stugrade_span').html(edu_grade(parseInt(sss.grade)));	
	$('#stugrade_span').attr("class",sss.grade);
	$('#stuschool_span').html(sss.school_name);
	$('#stutel_span').html(sss.tel);	
	 
}



function editStuInfo(sid){
	var btn = $('#editstuBtn').val();	
	if(btn=='修改'){
		$('#editstuBtn').val('保存');
		var name = $('#stuname_span').text();
		var sex = $('#stusex_span').text();
		//var content = $('#stucontent_span').text();
		var email = $('#stuemail_span').text();
		var grade = $('#stugrade_span').text();
		var gradeid = $('#stugrade_span').attr('class');
		var school = $('#stuschool_span').text();
		var tel = $('#stutel_span').text();
		$('#stuname_span').css('display','none');
		$('#stusex_span').css('display','none');
		//$('#stucontent_span').css('display','none');
		$('#stugrade_span').css('display','none');
		$('#stuemail_span').css('display','none');	
		$('#stuschool_span').css('display','none');
		$('#stutel_span').css('display','none');
		
		$('#stuname').css('display','block');
		$('#stusexes').css('display','block');
		//$('#stucontent').css('display','block');
		$('#stugrade').css('display','block');
		$('#stuemail').css('display','block');	
		$('#stuschool').css('display','block');
		$('#stutel').css('display','block');
		
		
		
		$('#stuname').val(name);
		$('input[name=stusex]').attr('checked',(sex=='男'?1:2));
		//$('#stucontent').val(content);
		$('#stugrade').attr('value',gradeid);
		$('#stuemail').val(email);
		$('#stuschool').val(school);
		$('#stutel').val(tel);
		
	}else if(btn=='保存'){
		
		var sname = $('#stuname').val();
		var ssex = $('input[name=stusex]:checked').val();
		//var scon = $('#stucontent').val();
		var sgradeid = $('#stugrade').val();
		var sgrade = $('#stugrade option:selected').text();
		 
		var semail = $('#stuemail').val();
		var sschool = $('#stuschool').val();
		var stel = $('#stutel').val();
		
		
		if(sname!=""&&ssex!=""&&semail!=""&&sgradeid!=""&&sschool!=""&&stel!=""){
			var url_type = '/student';
			var jsondata = {action:'edit','user_id':studata.user_id,'center_id':studata.center_id,'zone_id':studata.zone_id,'username':studata.username,'realname':sname,'gender':ssex,'email':semail,'grade':sgradeid,'schoolName':sschool,'tel':stel,'note':''};
			var rs = Ajax_option(url_type,jsondata,"POST");
			if(rs.flag){
				$.messager.alert('温馨提示','修改成功','info');
				$('#stuname').css('display','none');
				$('#stusexes').css('display','none');
				//$('#stucontent').css('display','none');
				$('#stugrade').css('display','none');
				$('#stuemail').css('display','none');	
				$('#stuschool').css('display','none');   
				$('#stutel').css('display','none');
				
				$('#stuname_span').css('display','block');
				$('#stusex_span').css('display','block');
				//$('#stucontent_span').css('display','block');
				$('#stugrade_span').css('display','block');
				$('#stuemail_span').css('display','block');	
				$('#stuschool_span').css('display','block');
				$('#stutel_span').css('display','block');
				
				$('#stuname_span').html(sname);
				$('#stusex_span').html((ssex==1?'男':'女'));
				//$('#stucontent_span').html(scon);
				$('#stuemail_span').html(semail);
				$('#stugrade_span').html(sgrade);
				$('#stugrade_span').attr('class',sgradeid);
				$('#stuschool_span').html(sschool);
				$('#stutel_span').html(stel);
				$('#editstuBtn').val('修改');
				$('#student_info').html('<li class="text_float" style="width:24%"><table border="0" cellpadding="0" cellspacing="0" class="student_info" width="100%" ><tr><td width="70" >'+(ssex==1?'<img src="../images/man.gif" width="54" height="85" />':'<img src="../images/women.gif" width="54" height="85" />')+'</td><td width="60" align="right"> 等级：<br />用户名：<br />姓名：<br />昵称：</td><td width="90"> 一品大学士<br />'+studata.username+'<br />'+sname+'<br />无</td></tr><tr><td>'+(ssex==1?'男':'女')+'&nbsp;--岁</td><td>入班时间：</td><td>'+studata.creator_date.substring(0,10)+'</td></tr></table></li><li class="text_float student_link" style="width:20%"><div><span>当前年级：'+edu_grade(parseInt(sgradeid))+'</span><br /><span>在读学校：'+sschool+'</span><br /><span>学生最近登录时间：'+studata.last_login_time+'</span><br /><span>最近发送报告时间：2013-05-12</span></div><div><a href="javascript:void(0);" onclick="send_message();">发消息</a>&nbsp;<a href="javascript:void(0); "onclick="reSetPass('+studata.user_id+',\'/center_zone_admin\');" >重置密码</a>&nbsp;</div></li><li class="text_float" style="width:54%"><div class="student_link" style=" background-color:#FFF;"><span>作业统计：交来8次/共有10次</span><br /><span>测评统计：交来8次/共有10次</span><br /><span>测评等级：</span><br /><span>发送学习报告 派送新测评</span><br /> <span>新交来  作业2222 测评批阅</span></div></li>');
			}else{
				$.messager.alert('温馨提示','修改失败','info');
			}
		}else{
			$.messager.alert('温馨提示','你所填写的信息不能为空','info');	
		}
		
		
	}
	
		
}



//班级教学备注
function teaching_note(cid) {
	
	$.messager.progress({text:'正在获取教学备注'});
	
	$('#teaching_Note').css('display','block');
    // 获取校区相关数据
	var teaching_NoteOpen = "teaching_NoteOpen("+cid+");";
    alertSel("#teaching_Note",'查看修改教学备注',570,400,teaching_NoteOpen,'关闭');
    $('#teaching_Note').dialog('open');
 	
}

//教学备注页面加载成功  open
function teaching_NoteOpen(cid){
   $.messager.progress('close'); 
   $('#note_content_id').val('');//清空文本域
   //do something  
}



//获取一行内容

function selrows(obj){
	var obj_li = $(obj).parents('ul').children('li');
	var li_contet = obj_li.eq(2).text();
	$('#note_content_id').val(li_contet);
}

function deletenote(id){
	$.messager.confirm('温馨提示', '确定要删除吗？', function (r) {
		if(r){
			
			//do something
			
			}
	});
}



//显示备忘 
function showmemo(week_days){
	var url_type = '/teacher';
	var Qjson = {'action':'get_notes','start':week_days[0],'end':week_days[6]};
	 
	var w_result = Ajax_Question(url_type,Qjson);
	var htmls = "";
	if(w_result.list!=null&&w_result.list!=""){
		
		$.each(week_days,function(i_1,n_1){
			var n = 0;
			$.each(w_result.list,function(i_2,n_2){
				if(n_1==n_2.create_date.substring(0,10)){
					
					htmls += '<tr ><td  style=" width:20%;" class="text_b_r text_padding_more" Tday="'+n_1+'" n_id="'+n_2.Id+'">'+weeks_name(parseInt(i_1))+'('+n_1+')</td><td  style=" width:38%; " class="text_b_r text_padding_more">'+n_2.content+'</td><td  style=" width:38%;" class="text_b_r text_padding_more"><a href=" javascript:void(0);" onclick="resetmemo(this);">取消</a></td></tr>';
					n++;
				}
			});
			if(n==0){
				htmls += '<tr><td  style=" width:20%;" class="text_b_r text_padding_more" Tday="'+n_1+'">'+weeks_name(parseInt(i_1))+'('+n_1+')</td><td  style=" width:38%; " class="text_b_r text_padding_more"></td><td  style=" width:38%;" class="text_b_r text_padding_more"><a href=" javascript:void(0);" onclick="addmemo(this);">添加备忘</a></td></tr>';
			}
		});
		
	}else{
		$.each(week_days,function(i_3,n_3){
			htmls += '<tr><td  style=" width:20%;" class="text_b_r text_padding_more" Tday="'+n_3+'" >'+weeks_name(parseInt(i_3))+'('+n_3+')</td><td  style=" width:38%; " class="text_b_r text_padding_more"></td><td  style=" width:38%;" class="text_b_r text_padding_more"><a href=" javascript:void(0);" onclick="addmemo(this);">添加备忘</a></td></tr>';
		});
	}
	$('#week_day').html(htmls);
	w_days = week_days;
}




//增加备忘

function addmemo(obj){
	$.messager.confirm('增加备忘', '<textarea id="memoid" cols="20" rows="5"></textarea>', function (r) {
		if(r){
			 var val = $('#memoid').val();
			 if($.trim(val)!=""){
			 	var obj_td = $(obj).parents('tr').children('td');
				var url_type = '/teacher';
				var Qjson = {'action':'create_notes','content':val,'create_date':obj_td.eq(0).attr("Tday")};
				
				Ajax_option(url_type,Qjson,"POST");
			 	showmemo(w_days);
			 }else{
			 	$.messager.alert('温馨提示','你的内容为空，没有执行添加操作！','info');
			 }
			}
	});

}

//删除备忘
function resetmemo(obj){
	 
	$.messager.confirm('温馨提示', '确定要删除备忘吗？', function (r) {
		if(r){
			
				var obj_td = $(obj).parents('tr').children('td');
				var url_type = '/teacher';
				var Qjsons = {'action':'del_notes','notes_id':obj_td.eq(0).attr("n_id")};
				Ajax_option(url_type,Qjsons,"GET");
			 	showmemo(w_days);
			
			}
	});
	
}


//跳转到测评批阅页面
function pings(tjson){
	 
	document.location.href = "../Reviews/ContinueRead.html?temp_test="+tjson+"&user_id="+studata.user_id;	
}
//跳转到测评批阅页面
function showViews(tjson){
	document.location.href = "../Reviews/stuViews.html?temp_test="+tjson;	
}

//-----------------一下操作是每周时间转换

//操作一周转换和赋值
function changeWeek(weekstr){
	var now_1 = new Date($('#beginT').html());
	var now_2 = new Date($('#endT').html());
	var weeks_day = [];
	var weeks = [];
	if(weekstr=='up'){
		weeks = upWeek(now_1);	
	}else if(weekstr=='this'){
		weeks = thisweek();
	}else if(weekstr=='next'){
		weeks = nextWeek(now_2);
	}
	$('#beginT').html(changeTime(new Date(weeks[0]).toLocaleDateString()));
	$('#endT').html(changeTime(new Date(weeks[6]).toLocaleDateString()));
	$.each(weeks,function(i,n){
		weeks_day.push(changeTime(new Date(n).toLocaleDateString()));
	});
	showmemo(weeks_day);
}


