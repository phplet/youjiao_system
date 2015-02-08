// JavaScript Document

var search_content_array=[];
var content_array=[];
var temp_sub = [];
var UserInfo = {};
$().ready(function () {
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	if(UserInfo!=null&&UserInfo!=undefined){
		var nick =  UserInfo.nick;
			 
		if (UserInfo.realname != null&&UserInfo.realname!="") {
				$('#headusername').text(UserInfo.realname);
		}else if(nick!=null&&nick!=""){
				$('#headusername').text(nick);
		}
		admission_list(); 
	 	 
	}else{
		window.location.href = "../index.html";
	} 
});//.ready的结束标签

function admission_list(){
	
	 var url_type = '/student?r='+$.getRom();
	 var Qjson = {'action':'get_student_exercise','user_id':UserInfo.id,'exam_type':6};
	 var result  = Ajax_option(url_type,Qjson,"GET",false);	
	 
	
                   /* <div class="admission_report_bg">
                    	<div class="paddingT_40"><div class="admi_font">入学报告<br />2014-05-06</div><div style="margin-top:25px;"><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看报告">查看报告</a></div></div>
                    </div>
                </div><div class="cleard"></div></li>*/
	if(result.list!=null){
		var htmls = '';
		$.each(result.list,function(i,n){
			var bgnum = parseInt(n.subject_id);
			if(i%2==1){
				if(n.type==2||n.type==3){
					if(n.trid!=null&&n.trid!=""){
						if(n.type==3){
							htmls += '<li><div class="admission_L"><div class="admission_test_bg"><div class="padding_20"><span class="adi_text_01">学校名：</span><span class="adi_text_02">'+n.teacher_center_name+'</span><br /><span class="adi_text_01">校区名：</span><span class="adi_text_02">'+n.teacher_zone_name+'</span><br /><span class="adi_text_01">时　间：</span><span class="adi_text_01">'+n.assign_create_date+'</span><br /><span class="adi_text_03">'+n.name+'</span><span><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看批阅" onclick="yipiyue(\''+n.name+'\',\''+Base64.encode(n.content)+'\','+n.study_exercise_id+','+n.exercise_id+',\''+n.pi+'\','+bgnum+',\''+n.teacher_center_name+'\',\''+n.teacher_zone_name+'\',0,'+n.center_id+',\''+n.teacher_name+'\');">查看批阅</a></span></div></div><div class="admission_right_bg"></div><div class="admission_report_bg"><div class="paddingT_40"><div class="admi_font">入学报告<br />2014-05-06</div><div style="margin-top:25px;"><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看报告" onclick="report_view('+n.trid+');">查看报告</a></div></div></div></div><div class="cleard"></div></li>'	;
					
						}else{
							htmls += '<li><div class="admission_L"><div class="admission_test_bg"><div class="padding_20"><span class="adi_text_01">学校名：</span><span class="adi_text_02">'+n.teacher_center_name+'</span><br /><span class="adi_text_01">校区名：</span><span class="adi_text_02">'+n.teacher_zone_name+'</span><br /><span class="adi_text_01">时　间：</span><span class="adi_text_01">'+n.assign_create_date+'</span><br /><span class="adi_text_03">'+n.name+'</span><span><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看试卷" onclick="yizuo(\''+n.name+'\',\''+Base64.encode(n.content)+'\','+n.study_exercise_id+','+n.exercise_id+','+bgnum+',\''+n.teacher_center_name+'\',\''+n.teacher_zone_name+'\',0,'+n.center_id+',\''+n.teacher_name+'\');">查看试卷</a></span></div></div><div class="admission_right_bg"></div><div class="admission_report_bg"><div class="paddingT_40"><div class="admi_font">入学报告<br />2014-05-06</div><div style="margin-top:25px;"><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看报告" onclick="report_view('+n.trid+');">查看报告</a></div></div></div></div><div class="cleard"></div></li>'	;
					
						}
						
					}else{
						if(n.type==3){
							htmls += '<li><div class="admission_L"><div class="admission_test_bg"><div class="padding_20"><span class="adi_text_01">学校名：</span><span class="adi_text_02">'+n.teacher_center_name+'</span><br /><span class="adi_text_01">校区名：</span><span class="adi_text_02">'+n.teacher_zone_name+'</span><br /><span class="adi_text_01">时　间：</span><span class="adi_text_01">'+n.assign_create_date+'</span><br /><span class="adi_text_03">'+n.name+'</span><span><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看批阅" onclick="yipiyue(\''+n.name+'\',\''+Base64.encode(n.content)+'\','+n.study_exercise_id+','+n.exercise_id+',\''+n.pi+'\','+bgnum+',\''+n.teacher_center_name+'\',\''+n.teacher_zone_name+'\',0,'+n.center_id+',\''+n.teacher_name+'\');">查看批阅</a></span></div></div><div class="admission_right_bg"></div><div class="admission_report_bg"><div class="paddingT_40"><div class="admi_font">入学报告</div></div></div></div><div class="cleard"></div></li>'	;
						}else{
							htmls += '<li><div class="admission_L"><div class="admission_test_bg"><div class="padding_20"><span class="adi_text_01">学校名：</span><span class="adi_text_02">'+n.teacher_center_name+'</span><br /><span class="adi_text_01">校区名：</span><span class="adi_text_02">'+n.teacher_zone_name+'</span><br /><span class="adi_text_01">时　间：</span><span class="adi_text_01">'+n.assign_create_date+'</span><br /><span class="adi_text_03">'+n.name+'</span><span><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看试卷" onclick="yizuo(\''+n.name+'\',\''+Base64.encode(n.content)+'\','+n.study_exercise_id+','+n.exercise_id+','+bgnum+',\''+n.teacher_center_name+'\',\''+n.teacher_zone_name+'\',0,'+n.center_id+',\''+n.teacher_name+'\');">查看试卷</a></span></div></div><div class="admission_right_bg"></div><div class="admission_report_bg"><div class="paddingT_40"><div class="admi_font">入学报告</div></div></div></div><div class="cleard"></div></li>'	;
						}
						
					}
				}else{
					htmls += '<li><div class="admission_L"><div class="admission_test_bg"><div class="padding_20"><span class="adi_text_01">学校名：</span><span class="adi_text_02">'+n.teacher_center_name+'</span><br /><span class="adi_text_01">校区名：</span><span class="adi_text_02">'+n.teacher_zone_name+'</span><br /><span class="adi_text_01">时　间：</span><span class="adi_text_01">'+n.assign_create_date+'</span><br /><span class="adi_text_03">'+n.name+'</span><span><a class="icon_125_35 web_icon_bottom_2" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="开始测试" onclick="ti_list(\''+Base64.encode(n.content)+'\','+n.subject_id+','+n.study_exercise_id+','+n.exercise_id+',\''+n.name+'\','+n.creator_id+','+n.center_id+','+n.zone_id+');">开始测试</a></span></div></div><div class="admission_right_bg"></div><div class="admission_report_bg"><div class="paddingT_40"><div class="admi_font">入学报告</div></div></div></div><div class="cleard"></div></li>';
				}
				
			
			}else{
				if(n.type==2||n.type==3){
					if(n.trid!=null&&n.trid!=""){
						if(n.type==3){
							htmls += '<li><div class="admission"><div class="admission_test_bg"><div class="padding_20"><span class="adi_text_01">学校名：</span><span class="adi_text_02">'+n.teacher_center_name+'</span><br /><span class="adi_text_01">校区名：</span><span class="adi_text_02">'+n.teacher_zone_name+'</span><br /><span class="adi_text_01">时　间：</span><span class="adi_text_01">'+n.assign_create_date+'</span><br /><span class="adi_text_03">'+n.name+'</span><span><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看批阅" onclick="yipiyue(\''+n.name+'\',\''+Base64.encode(n.content)+'\','+n.study_exercise_id+','+n.exercise_id+',\''+n.pi+'\','+bgnum+',\''+n.teacher_center_name+'\',\''+n.teacher_zone_name+'\',0,'+n.center_id+',\''+n.teacher_name+'\');">查看批阅</a></span></div></div><div class="admission_right_bg"></div><div class="admission_report_bg"><div class="paddingT_40"><div class="admi_font">入学报告<br />2014-05-06</div><div style="margin-top:25px;"><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看报告" onclick="report_view('+n.trid+');">查看报告</a></div></div></div></div><div class="cleard"></div></li>'	;
					
						}else{
							htmls += '<li><div class="admission"><div class="admission_test_bg"><div class="padding_20"><span class="adi_text_01">学校名：</span><span class="adi_text_02">'+n.teacher_center_name+'</span><br /><span class="adi_text_01">校区名：</span><span class="adi_text_02">'+n.teacher_zone_name+'</span><br /><span class="adi_text_01">时　间：</span><span class="adi_text_01">'+n.assign_create_date+'</span><br /><span class="adi_text_03">'+n.name+'</span><span><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看试卷" onclick="yizuo(\''+n.name+'\',\''+Base64.encode(n.content)+'\','+n.study_exercise_id+','+n.exercise_id+','+bgnum+',\''+n.teacher_center_name+'\',\''+n.teacher_zone_name+'\',0,'+n.center_id+',\''+n.teacher_name+'\');">查看试卷</a></span></div></div><div class="admission_right_bg"></div><div class="admission_report_bg"><div class="paddingT_40"><div class="admi_font">入学报告<br />2014-05-06</div><div style="margin-top:25px;"><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看报告" onclick="report_view('+n.trid+');">查看报告</a></div></div></div></div><div class="cleard"></div></li>'	;
					
						}
						
					}else{
						if(n.type==3){
							htmls += '<li><div class="admission"><div class="admission_test_bg"><div class="padding_20"><span class="adi_text_01">学校名：</span><span class="adi_text_02">'+n.teacher_center_name+'</span><br /><span class="adi_text_01">校区名：</span><span class="adi_text_02">'+n.teacher_zone_name+'</span><br /><span class="adi_text_01">时　间：</span><span class="adi_text_01">'+n.assign_create_date+'</span><br /><span class="adi_text_03">'+n.name+'</span><span><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看批阅" onclick="yipiyue(\''+n.name+'\',\''+Base64.encode(n.content)+'\','+n.study_exercise_id+','+n.exercise_id+',\''+n.pi+'\','+bgnum+',\''+n.teacher_center_name+'\',\''+n.teacher_zone_name+'\',0,'+n.center_id+',\''+n.teacher_name+'\');">查看批阅</a></span></div></div><div class="admission_right_bg"></div><div class="admission_report_bg"><div class="paddingT_40"><div class="admi_font">入学报告</div></div></div></div><div class="cleard"></div></li>'	;
						}else{
							htmls += '<li><div class="admission"><div class="admission_test_bg"><div class="padding_20"><span class="adi_text_01">学校名：</span><span class="adi_text_02">'+n.teacher_center_name+'</span><br /><span class="adi_text_01">校区名：</span><span class="adi_text_02">'+n.teacher_zone_name+'</span><br /><span class="adi_text_01">时　间：</span><span class="adi_text_01">'+n.assign_create_date+'</span><br /><span class="adi_text_03">'+n.name+'</span><span><a class="icon_125_35 web_icon_bottom_3" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="查看试卷" onclick="yizuo(\''+n.name+'\',\''+Base64.encode(n.content)+'\','+n.study_exercise_id+','+n.exercise_id+','+bgnum+',\''+n.teacher_center_name+'\',\''+n.teacher_zone_name+'\',0,'+n.center_id+',\''+n.teacher_name+'\');">查看试卷</a></span></div></div><div class="admission_right_bg"></div><div class="admission_report_bg"><div class="paddingT_40"><div class="admi_font">入学报告</div></div></div></div><div class="cleard"></div></li>'	;
						}
					}
				}else{
					htmls += '<li><div class="admission"><div class="admission_test_bg"><div class="padding_20"><span class="adi_text_01">学校名：</span><span class="adi_text_02">'+n.teacher_center_name+'</span><br /><span class="adi_text_01">校区名：</span><span class="adi_text_02">'+n.teacher_zone_name+'</span><br /><span class="adi_text_01">时　间：</span><span class="adi_text_01">'+n.assign_create_date+'</span><br /><span class="adi_text_03">'+n.name+'</span><span><a class="icon_125_35 web_icon_bottom_2" style="width:80px; color:#FFF; font-weight:500; text-decoration:none;" title="开始测试" onclick="ti_list(\''+Base64.encode(n.content)+'\','+n.subject_id+','+n.study_exercise_id+','+n.exercise_id+',\''+n.name+'\','+n.creator_id+','+n.center_id+','+n.zone_id+');">开始测试</a></span></div></div><div class="admission_right_bg"></div><div class="admission_report_bg"><div class="paddingT_40"><div class="admi_font">入学报告</div></div></div></div><div class="cleard"></div></li>';
				}
			}
		});
		$('#admission_list').html(htmls);	
	}
	 
	
}


function ti_list(paperid,sub_Id,study_exercise_id,exercise_id,test_name,teacher_id,center_id,zone_id){
	$.cookie("paperid",paperid,{path:"/"});
	$.cookie("sub_Id",sub_Id,{path:"/"});
	$.cookie("test_name",test_name,{path:"/"});
	$.cookie("exercise_id",exercise_id,{path:"/"});
	$.cookie("teacher_id",teacher_id,{path:"/"});
	$.cookie("center_id",center_id,{path:"/"});
	$.cookie("zone_id",zone_id,{path:"/"});
	$.cookie("study_exercise_id",study_exercise_id,{path:"/"});
	window.location.href="admission_do.html";
	
}
 


function yizuo(sjname,contentid,id,eid,sub_id,sch_nameST,zone_nameST,clss_nameST,center_id,teacher_name){
	//alert(sjid);
	$.cookie("shijuanid",Base64.decode(contentid) ,{path:"/"});
	$.cookie('shijuanName',sjname,{path:"/"});
	$.cookie("sjid",id ,{path:"/"});
	$.cookie("exercise_id",eid ,{path:"/"});
	$.cookie("teacher_name",teacher_name ,{path:"/"});
	$.cookie("sub_Id",sub_id,{path:"/"});
	$.cookie("sch_nameS",sch_nameST,{path:"/"});
	$.cookie("zone_nameS",zone_nameST,{path:"/"});
	$.cookie("clss_nameS","",{path:"/"});
	$.cookie("center_id",center_id,{path:"/"}); 
	window.location.href="catHmwk.html";
	
}

function yipiyue(sjname,contentid,id,eid,pi,sub_id,sch_nameST,zone_nameST,clss_nameST,center_id,teacher_name){
	//alert(sjid);
	
	$.cookie("shijuanid",Base64.decode(contentid),{path:"/"});
	$.cookie("sjid",id ,{path:"/"});
	$.cookie('shijuanName',sjname,{path:"/"});
	$.cookie("exercise_id",eid ,{path:"/"});
	$.cookie("shijuan_pi",pi ,{path:"/"});
	$.cookie("sub_Id",sub_id,{path:"/"});
	$.cookie("sch_nameS",sch_nameST,{path:"/"});
	$.cookie("zone_nameS",zone_nameST,{path:"/"});
	$.cookie("clss_nameS",clss_nameST,{path:"/"});
	$.cookie("center_id",center_id,{path:"/"});  
	$.cookie("teacher_name",teacher_name ,{path:"/"});
	
	window.location.href="OKHmwk.html";
	
}


function report_view(tr_id){
	window.location.href="report_view.html?tr_id="+tr_id;	
}

 

 



 

 