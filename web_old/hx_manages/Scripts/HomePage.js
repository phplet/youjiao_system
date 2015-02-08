var UserInfo = $.evalJSON($.cookie("UserInfo"));
var centerAll = $.evalJSON($.cookie("centerAll"));
 
$().ready(function () {
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	centerAll = $.evalJSON($.cookie("centerAll"));
	 
	 
	window.parent.tree_select('首页');
	if(UserInfo.level==5){$('.home').hide();$('.max_counts_list').hide();}else{
		$('.home_intro').hide();
		if(UserInfo.level==4){
			$('#teachernoteT').show();
			$('#teachernote').show();
			changeWeek('this');//当前周时间	
		}else{
			$('#teachernoteT').hide();	
			$('#teachernote').hide();
		}
		news_list();
		infomation_list();
		
		if(UserInfo.level==1||UserInfo.level==2){  //学校下的校区数和人员数
			$('.max_counts_list').show();
			var centercounts_res = check_max_counts(UserInfo.center_id);
			var reality_zone = centercounts_res.center_count_info.center_zone_count;
			var max_zone = centercounts_res.center_count_info.center_max_info.zone_max_count;
			var reality_teacher = centercounts_res.center_count_info.center_teacher_count;
			var type_zone_num = centercounts_res.center_count_info.center_max_info.type;
			var max_teacher = centercounts_res.center_count_info.center_max_info.teacher_max_count;
			var reality_student = centercounts_res.center_count_info.center_student_count;
			var max_student = centercounts_res.center_count_info.center_max_info.student_max_count;
			var max_stusTemp_counts = centercounts_res.center_count_info.zone_info;
			if(UserInfo.level==1){	 
				if(max_zone==0||max_zone==""||max_zone==null){
					max_zone = '不限';	
				}
				
				if(type_zone_num==2){
					max_teacher = 0;
					max_student = 0;
					$.each(max_stusTemp_counts,function(i_c,n_c){
						max_teacher += parseInt(n_c.teacher_max_count);  
						max_student += parseInt(n_c.student_max_count);
					});
					
				}else{
					if(max_teacher==0||max_teacher==""||max_teacher==null){
						max_teacher = '不限';	
					}
					if(max_student==0||max_student==""||max_student==null){
						max_student = '不限';	
					}	
				}
				
				 
				var htmls_max_temp = '<div><div class="max_counts_list_Fl">校区上限：'+max_zone+'</div><div class="max_counts_list_Fl">教职员工上限：'+max_teacher+'</div><div class="max_counts_list_Fl">学生上限：'+max_student+'</div><br /><div class="max_counts_list_Fl">现有校区：'+reality_zone+'</div><div class="max_counts_list_Fl">现有教职员工：'+reality_teacher+'</div><div class="max_counts_list_Fl">现有学生：'+reality_student+'</div></div><div class="cleared"></div>';
					 
				
				$('.max_counts_list_div').html(htmls_max_temp);
			}else{
				var zonehtmls_max_temp = '';
				var zone_idT_stu = $('#A_zones',window.parent.document).find("option:selected").val();
				if(max_stusTemp_counts!=null&&max_stusTemp_counts!=""){
					$.each(max_stusTemp_counts,function(i,n){
						 if(zone_idT_stu==n.id){
							var student_max_countsTe = parseInt(n.student_max_count);
							var curstudent_max_countsTe = parseInt(n.student_current_count);
							if(student_max_countsTe==0){
								student_max_countsTe = '不限';	
							}
							 
							zonehtmls_max_temp = '<div><div class="max_counts_list_Fl">学生上限：'+student_max_countsTe+'&nbsp;&nbsp;</div><div class="max_counts_list_Fl">现有学生：'+curstudent_max_countsTe+'</div></div><div class="cleared"></div>';	
						 }
					 }); 
					
				}else{
					zonehtmls_max_temp = '<div><div class="max_counts_list_Fl">学生上限：不限&nbsp;&nbsp;</div><div class="max_counts_list_Fl">现有学生：--</div></div><div class="cleared"></div>';		
				}
				$('.max_counts_list_div').html(zonehtmls_max_temp);
			}
		}else{
			$('.max_counts_list').hide();		
		}
		 
	} 
	
	
	
	// tree_f.tree('update',{target:tree_list[0].target});
	 
	/*if(UserInfo.level==1){
		$('.home_intro').hide();
		KindEditor.ready(function(K) {
	     
		 window.editor = K.create('#infoArea');
		 
		 K('#editebtn').click(function(e) {
			  if(editor.isEmpty()){
				$.messager.alert('温馨提示', '简介内容不能为空！', 'info');
				return;
			  }
			  $("#editnewscenter").css("display","none");
			  $("#newscenter").show();
	          $(".ke-container").css("width","100%");
	          $("#newscenter").html(editor.html());
			  $("#addinfo").html('<img src="themes/icons/pencil.png">');
		});
		 
		K('#resetbtn').click(function(e) {
			editor.html('');
		});	
		});
		
		 
		
	}else{
		
	}*/
	
     

});

//学校介绍
function info (){
	

} 

//新闻
function news_list(){
	var news_url = '/news?pageno=1&countperpage=5';
	
	var news_Qjson = {};
	if(UserInfo.level==1){
		news_Qjson = {'center_id':UserInfo.center_id,'id':UserInfo.id,listtype:1};
	}else if(UserInfo.level!=1&&UserInfo.level!=9){
		news_Qjson = {'center_id':centerAll.center_id,'id':UserInfo.id,listtype:1};
		var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val();
		news_Qjson['zone_id'] = select_zoneid;
	}
	var newslist = Ajax_option(news_url,news_Qjson,"GET");
	var htmls_news = '';
	if(newslist.list!=null&&newslist.list!=""){
	$.each(newslist.list,function(ii,nn){
		var nameT = "";
		if(nn.center_name!=null&&nn.center_name!=""){
			nameT = nn.center_name;
		}else{
			nameT = nn.zone_name;
		}
		 
		var datatemps  = {"news_title":nn.title,"creat_time":nn.create_time,"content":nn.content};
		htmls_news += '<li class="newscenter_li cleared"><span class="title_span">'+(ii+1)+'.<a  onclick="selectNews(\''+Base64.encode(JSON.stringify(datatemps))+'\',1);">【'+nameT+'】'+Base64.decode(nn.title)+'</a></span><span class="time_span">'+nn.create_time+'</span></li>';
	                   
	});
	if(UserInfo.level==4){
		htmls_news += '<li class="newscenter_li cleared" style="text-align:right;"><a href="News/News.html">更多</a></li>';
	}else{
		htmls_news += '<li class="newscenter_li cleared" style="text-align:right;"><a href="News/News.html">更多</a></li>';
	}
	$('#news_list').html(htmls_news); 
	
	}
	tops_ajax();
	
	 
}

//公告
function infomation_list(){
	var infomation_url = '/notice?pageno=1&countperpage=5';
	
	var infomation_Qjson = {};
	if(UserInfo.level==1){
		infomation_Qjson = {'center_id':UserInfo.center_id,'user_id':UserInfo.id};
	}else if(UserInfo.level!=1&&UserInfo.level!=9){
		infomation_Qjson = {'center_id':centerAll.center_id,'user_id':UserInfo.id};
		var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val();
		infomation_Qjson['zone_id'] = select_zoneid;
	}
	var infomation_list = Ajax_option(infomation_url,infomation_Qjson,"GET");
	var html_infomations = '';
	if(infomation_list.list!=null&&infomation_list.list!=""){
		$.each(infomation_list.list,function(i,n){
			var nameT = "";
			if(UserInfo.level==1){
				nameT = UserInfo.center_name;
			}else if(UserInfo.level==2||UserInfo.level==4){
				nameT = centerAll.center_name;
			}
			var datatemps  = {"news_title":n.title,"creat_time":n.create_time,"content":n.content};
			html_infomations += '<li class="newscenter_li cleared"><span class="title_span">'+(i+1)+'.<a onclick="selectNews(\''+Base64.encode(JSON.stringify(datatemps))+'\',2);">【'+nameT+'】'+Base64.decode(n.title)+'</a></span><span class="time_span">'+n.create_time+'</span></li>';
			 
		});
		html_infomations += '<li class="newscenter_li cleared" style="text-align:right;"><a href="News/Informations.html">更多</a></li>';
		$('#infomation_list').html(html_infomations);
	}
}

function setDate(f) {
    if (f == 0) {  
        var NowData = new Date();
        var mintemp=NowData.getFullYear() + "-" + (NowData.getMonth()+1) + "-1";
        var maxtemp = NowData.getFullYear() + "-" + (NowData.getMonth() + 1) + "-" + NowData.getDate();
        $("#hiddenmin").val(mintemp);
        $("#hiddenmax").val(maxtemp);
        $("#minTime").datebox("setValue", mintemp);
        $("#maxTime").datebox("setValue", maxtemp);
        $('#minTime').datebox({ disabled: true });
        $("#maxTime").datebox({ disabled: true });
        
    } else {
        $('#minTime').datebox({ disabled: false });
        $("#maxTime").datebox({ disabled: false });
    }
}


function addinfo(){
	var infohtml = $("#newscenter").html();
	var addimg = $("#addinfo").html();
	var  addimgtemp = '<img src="themes/icons/pencil.png">';
	 
	if(addimg==addimgtemp){
		$("#editnewscenter").css("display","block");
		$("#addinfo").html('<img  src="themes/icons/undo.png"/>');
		$("#newscenter").hide();
		
		$(".ke-container").css("width","100%");
		editor.html(infohtml);
	}else{
		$("#editnewscenter").css("display","none");
		
		$("#newscenter").show();
		$("#addinfo").html(addimgtemp);
	    $(".ke-container").css("width","100%");
	    $("#newscenter").html(infohtml);		
	}
 
	
};

function selectNews(val,typesids){
	val = Base64.decode(val);
	window.location = 'News/News_sel.html?data='+val+'&types_id='+typesids;
	
}


function tops_ajax(){
	
	var top_tests_url = '/stat';
	var top_tests_json = {'action':'top','center_id':UserInfo.center_id}; 
	var tests_res = "";
	if(UserInfo.level==1){
		$('#top_lists_table').show();
	}else if(UserInfo.level==2){
		$('#top_lists_table').show();
		top_tests_json['zone_id'] = $('#A_zones',window.parent.document).find("option:selected").val();
	}else if(UserInfo.level==4){
		$('#top_lists_table').hide();
	}
	tests_res = Ajax_Question(top_tests_url,top_tests_json); 
	if(UserInfo.level==1){
		$("#zone_top_1").show();
		$("#zone_top_1_1").show();
		$("#zone_top_2").show();
		top_tests(tests_res.build_top_list);
		top_sends(tests_res.assign_top_list);
		top_student_nums(tests_res.stu_top_list);
		now_addzones(tests_res.new_zone_list) ;
		now_addteachers(tests_res.new_teacher_list);
		now_addstudents(tests_res.new_stu_list);
	}else if(UserInfo.level==2){
		top_tests(tests_res.build_top_list); 
		top_sends(tests_res.assign_top_list);
		$("#zone_top_1").hide();
		$("#zone_top_1_1").hide();
		$("#zone_top_2").hide();
	}
}

//教师组卷排行榜
function top_tests(build_top_list){
	var build_top_list_htmls = '<tr><td >序号</td><td >教师</td><td>校区</td><td align="center">组卷次数</td></tr>';
	if(build_top_list!=null&&build_top_list!=""){
		$.each(build_top_list,function(i,n){
			var realname = n.realname;
			var zone_nameT = n.zone_name;
			if(realname==null||realname==""){
				realname = "无";
			}
			if(zone_nameT==null){
				zone_nameT = "无";
			}
			build_top_list_htmls += '<tr><td><span class="top_css_1"><strong>'+(i+1)+'</strong></span></td><td>'+realname+'</td><td>'+zone_nameT+'</td><td align="center">'+n.build_count+'</td></tr>';
		});
	}else{
		build_top_list_htmls += '<tr><td><span class="top_css_1"><strong>0</strong></span></td><td>无</td><td>无</td><td align="center">无</td></tr>';
	}
	$('#build_top_list').html(build_top_list_htmls); 
	
}

//教师派送排行榜?
function top_sends(assign_top_list){
	 
	var assign_top_list_htmls = '<tr><td >序号</td><td >教师</td><td>校区</td><td align="center">派送次数</td></tr>';
	if(assign_top_list!=null&&assign_top_list!=""){
		$.each(assign_top_list,function(i,n){
			var realname = n.realname;
			if(realname==null||realname==""){
				realname = "无";
			}
			
			assign_top_list_htmls += '<tr><td><span class="top_css_1"><strong>'+(i+1)+'</strong></span></td><td>'+realname+'</td><td>'+n.zone_name+'</td><td align="center">'+n.assign_count+'</td></tr>';
		});
	}else{
		assign_top_list_htmls += '<tr><td><span class="top_css_1"><strong>0</strong></span></td><td>无</td><td>无</td><td align="center">无</td></tr>';
	}
	$('#aassign_top_list_T').html(assign_top_list_htmls); 
}


//校区招生排行榜?
function top_student_nums(stu_top_list){
	 
	 var top_student_nums_htmls = '<tr><td >序号</td><td >校区</td><td>负责人</td><td align="center">招生人数</td></tr>';
	if(stu_top_list!=null&&stu_top_list!=""){
		$.each(stu_top_list,function(i,n){
			var realname = n.realname;
			if(realname==null||realname==""){
				realname = "无";
			}
			top_student_nums_htmls += '<tr><td><span class="top_css_1"><strong>'+(i+1)+'</strong></span></td><td>'+n.zone_name+'</td><td>'+realname+'</td><td align="center">'+n.stu_new_count+'</td></tr>';
		});
	}else{
		top_student_nums_htmls += '<tr><td><span class="top_css_1"><strong>0</strong></span></td><td>无</td><td>无</td><td align="center">无</td></tr>';
	}
	$('#add_stu_top_list').html(top_student_nums_htmls);
	 
	 
}

//新加入校区
function now_addzones(new_zone_list){//加入时间排序
	 
	var addzones_htmls = '<tr><td >序号</td><td >校区</td><td>负责人</td><td align="center">建立时间</td></tr>';
	if(new_zone_list!=null&&new_zone_list!=""){
		$.each(new_zone_list,function(i,n){
			var realname = n.realname;
			if(realname==null||realname==""){
				realname = "无";
			}
			addzones_htmls += '<tr><td><span class="top_css_1"><strong>'+(i+1)+'</strong></span></td><td>'+n.zone_name+'</td><td>'+realname+'</td><td align="center">'+n.create_date+'</td></tr>';
		});
	}else{
		addzones_htmls += '<tr><td><span class="top_css_1"><strong>0</strong></span></td><td>无</td><td>无</td><td align="center">无</td></tr>';
	}
	$('#add_now_zone').html(addzones_htmls);
}
 
//新加入老师
function now_addteachers(new_teacher_list){ //加入时间排序
	 
	var now_addteachers_htmls = '<tr><td >序号</td><td>姓名</td><td >校区</td><td align="center">建立时间</td></tr>';                      
	if(new_teacher_list!=null&&new_teacher_list!=""){
		$.each(new_teacher_list,function(i,n){
			 
			now_addteachers_htmls += '<tr><td><span class="top_css_1"><strong>'+(i+1)+'</strong></span></td><td>'+n.realname+'</td><td>'+n.zone_name+'</td><td align="center">'+n.creator_date+'</td></tr>';
		});
	}else{
		now_addteachers_htmls += '<tr><td><span class="top_css_1"><strong>0</strong></span></td><td>无</td><td>无</td><td align="center">无</td></tr>';
	}
	$('#add_now_teacher').html(now_addteachers_htmls);
	
}

//新加入学生？

function now_addstudents(new_stu_list){  //加入时间排序 
	var now_addstudents_htmls = '<tr><td >序号</td><td>姓名</td><td >校区</td><td align="center">建立时间</td></tr>';                   
	if(new_stu_list!=null&&new_stu_list!=""){
		$.each(new_stu_list,function(i,n){
			 
			now_addstudents_htmls += '<tr><td><span class="top_css_1"><strong>'+(parseInt(i)+1)+'</strong></span></td><td>'+n.realname+'</td><td>'+n.zone_name+'</td><td align="center">'+n.creator_date+'</td></tr>';
		});
	}else{
		now_addstudents_htmls += '<tr><td><span class="top_css_1"><strong>0</strong></span></td><td>无</td><td>无</td><td align="center">无</td></tr>';
	}
	$('#add_now_student').html(now_addstudents_htmls);
	
                             
	
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
					
					htmls += '<tr ><td width="20%" class="text_b_r text_padding_more" Tday="'+n_1+'" n_id="'+n_2.Id+'">'+weeks_name(parseInt(i_1))+'('+n_1+')</td><td  width="48%" class="text_b_r text_padding_more">'+n_2.content+'</td><td width="30%" class="text_b_r text_padding_more"><a href=" javascript:void(0);" onclick="resetmemo(this);">取消</a></td></tr>';
					n++;
				}
			});
			if(n==0){
				htmls += '<tr><td  width="20%"  class="text_b_r text_padding_more" Tday="'+n_1+'">'+weeks_name(parseInt(i_1))+'('+n_1+')</td><td width="48%" class="text_b_r text_padding_more"></td><td  width="30%" class="text_b_r text_padding_more"><a href=" javascript:void(0);" onclick="addmemo(this);">添加备忘</a></td></tr>';
			}
		});
		
	}else{
		$.each(week_days,function(i_3,n_3){
			htmls += '<tr><td  width="20%" class="text_b_r text_padding_more" Tday="'+n_3+'" >'+weeks_name(parseInt(i_3))+'('+n_3+')</td><td  width="48%" class="text_b_r text_padding_more"></td><td  width="30%" class="text_b_r text_padding_more"><a href=" javascript:void(0);" onclick="addmemo(this);">添加备忘</a></td></tr>';
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
