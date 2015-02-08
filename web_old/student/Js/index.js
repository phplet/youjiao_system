var UserId = "";
var CZC_id = '';
//var CZC_ids = {};
var UserInfo = {};
//var c_zone_idTs_class = "";
$(document).ready(function () {
	
 	UserId = $.evalJSON($.cookie("UsersId"));
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	
	
	
	if(UserInfo!=null&&UserInfo!=undefined){
		 var nick =  $.cookie("nick");
		 if (UserInfo != null) {
				$('#headusername').text(UserInfo.realname);
		 }else if(nick!=null){
				$('#headusername').text(nick);
		 }
		  
		 $('#tab_ul li').click(function(){
		 	
			$('#tab_ul .active_1').attr('class','sider_ul_li');
			$(this).attr('class','active_1');
			$('#test_list_0').hide();
			$('#test_list_1').hide();
			$('#test_list_2').hide();
			$('#test_list_'+$(this).index()).show(); 
			if($('.active_1').text().split('新作业').length>1){
				test_namesList("new");	
			}else if($('.active_1').text().split('已阅作业').length>1){
				test_namesList("pi");	
			};	
		});
		
		$('#active').attr('class','active_1');
		test_namesList("new"); 
		 
	}else{
		window.location.href = "../index.html";
	}
});//.ready的结束标签


function test_namesList(newT){
	 	$("#test_list_0").html("");
	 	$("#test_list_1").html("");
	 	$("#test_list_2").html("");
		var tiG_url = '/student?_'+$.getRom();
		var tiG_json = {'action':'get_student_exercise','user_id':UserId,'type':newT};
		var result = Ajax_option(tiG_url,tiG_json,"GET",false);
		var htmlstest_new = "";
		var htmlstest_over = "";
		var htmlstest_over_P = "";
		if(result.list!=null){
			$.each(result.list,function(idx,item){
				// 1 语文 2 数学 3 英语 4 物理 5 化学 6 生物 7 地理 8 历史 9 政治
				 //type
				var bgnum = parseInt(item.subject_id);
				var classname = '';
				var teacher_names = '';
				if(item.class_name!=null){
					classname = item.class_name;
				} else{
					classname = item.pass_class_name+'(过往)';
				}
				if(item.teacher_name!=null){
					teacher_names = item.teacher_name.substring(0,1);	
				}else{
					teacher_names = '-';
				}
				var weitime = "";
				if(item.creat_date!=null){
					weitime = 	item.creat_date.substring(0,10);
				}
				if(item.type == 1 ||item.type == 4){
					var center_zones = {'center_id':item.center_id,'zone_id':item.zone_id};
					if(item.type == 1){
						htmlstest_new += '<li><div class="pading_20"><div><div class="icon_59 web_icon_'+bgnum+'_59"></div><div class="test_SubImg">'+subject_sum(bgnum)+'</div></div><div class="clear"></div><div class="test_img"><span class="test_namest"><span>学校：'+item.center_name+'</span><br /><span>校区：'+item.zone_name+'</span><br /><span>班级：'+classname+'</span><br /><span>作业：'+item.name+'</span><br /><span>时间：'+weitime+'布置</span><br /><span>派送：'+teacher_names+'老师</span></span></div><div class="test_sub"><a class="icon_125_35 web_icon_bottom_1" href="javascript:void(0);" onclick="WeiZuo(\''+Base64.encode(JSON.stringify(center_zones))+'\',\''+Base64.encode(item.content)+'\',\''+item.name+'\',\''+item.creat_date+'\','+item.study_exercise_id+','+item.exercise_id+',\''+item.teacher_name+'\','+bgnum+','+item.type+','+item.study_exercise_id+','+item.creator_id+','+item.exam_type+',\''+Base64.encode(item.conditions)+'\','+item.class_id+',\''+item.center_name+'\',\''+item.zone_name+'\',\''+classname+'\');"><span class="a_link_Name"><span class="icon_16_16 web_icon_Write"></span><span class="a_link_Name_span">写作业</span><span class="clear"></span></span></a></div></div></li>';
					}else{
						htmlstest_new += '<li><div class="pading_20"><div><div class="icon_59 web_icon_'+bgnum+'_59"></div><div class="test_SubImg">'+subject_sum(bgnum)+'</div></div><div class="clear"></div><div class="test_img"><span class="test_namest"><span>学校：'+item.center_name+'</span><br /><span>校区：'+item.zone_name+'</span><br /><span>班级：'+classname+'</span><br /><span>作业：'+item.name+'</span><br /><span>时间：'+weitime+'布置</span><br /><span>派送：'+teacher_names+'老师</span></span></div><div class="test_sub"><a class="icon_125_35 web_icon_bottom_2" href="javascript:void(0);" onclick="WeiZuo(\''+Base64.encode(JSON.stringify(center_zones))+'\',\''+Base64.encode(item.content)+'\',\''+item.name+'\',\''+item.creat_date+'\','+item.study_exercise_id+','+item.exercise_id+',\''+item.teacher_name+'\','+bgnum+','+item.type+','+item.study_exercise_id+','+item.creator_id+','+item.exam_type+',\''+Base64.encode(item.conditions)+'\','+item.class_id+',\''+item.center_name+'\',\''+item.zone_name+'\',\''+classname+'\');"><span class="a_link_Name"><span class="icon_16_16 web_icon_On"></span><span class="a_link_Name_span">继续做</span><span class="clear"></span></span></a></div></div></li>';	
					}
				}else if(item.type == 3||item.type == 2){
					var sour_img = score_img(item.my_score);//获取分数值
					var zuotime = "";
					if(item.log_time!=null){
						zuotime = 	item.log_time.substring(0,10);
					}
					if(item.type == 2){
						htmlstest_over_P += '<li><div class="pading_20"><div><div class="icon_59 web_icon_'+bgnum+'_59"></div><div class="test_SubImg">'+subject_sum(bgnum)+'</div></div><div class="clear"></div><div class="test_img"><span class="test_namest"><span>学校：'+item.center_name+'</span><br /><span>校区：'+item.zone_name+'</span><br /><span>班级：'+classname+'</span><br /><span>作业：'+item.name+'</span><br /><span>时间：'+zuotime+'提交</span><br /><span>派送：'+teacher_names+'老师</span></span></div><div class="test_sub"><a class="icon_125_35 web_icon_bottom_3" href="javascript:void(0);" onclick="yizuo(\''+item.name+'\',\''+Base64.encode(item.content)+'\','+item.study_exercise_id+','+item.exercise_id+','+bgnum+',\''+item.center_name+'\',\''+item.zone_name+'\',\''+classname+'\');"><span class="a_link_Name"><span class="icon_16_16 web_icon_View"></span><span class="a_link_Name_span">查 看</span><span class="clear"></span></span></a></div></div></li>';
					}else if(item.type == 3){
						 
						htmlstest_over_P += '<li><div class="pading_20"><div><div class="icon_59 web_icon_'+bgnum+'_59"></div><div class="test_SubImg">'+subject_sum(bgnum)+'</div></div><div class="clear"></div><div class="test_img"><span class="test_namest"><span>学校：'+item.center_name+'</span><br /><span>校区：'+item.zone_name+'</span><br /><span>班级：'+classname+'</span><br /><span>作业：'+item.name+'</span><br /><span>时间：'+zuotime+'批阅</span><br /><span onclick="onpi(\''+item.pi+'\')">派送：'+teacher_names+'老师</span><br /><span class="score_img"><img src="'+score_img(parseInt(item.my_score))+'"/></span></span></div><div class="test_sub"><a class="icon_125_35 web_icon_bottom_5" href="javascript:void(0);" onclick="yipiyue(\''+item.name+'\',\''+Base64.encode(item.content)+'\','+item.study_exercise_id+','+item.exercise_id+',\''+item.pi+'\','+bgnum+',\''+item.center_name+'\',\''+item.zone_name+'\',\''+classname+'\');"><span class="a_link_Name"><span class="icon_16_16 web_icon_Check"></span><span class="a_link_Name_span">查看批阅</span><span class="clear"></span></span></a></div></div></li>';	
					}
					//htmlstest_over_P += '<li><div class="test_img"><span class="test_namest"><span>'+item.name+'</span><br /><span>'+item.creat_date.substring(0,10)+'批阅</span><br /><span onclick="onpi(\''+item.pi+'\')">'+item.teacher_name.substring(0,1)+'老师</span><br /><span><img  src="'+sour_img+'" width="26" height="26"/></span></span></div><div class="test_sub"><a href="javascript:void(0);" onclick="yipiyue(\''+item.name+'\',\''+Base64.encode(item.content)+'\','+item.study_exercise_id+','+item.exercise_id+',\''+item.pi+'\','+bgnum+');">查看批阅</a></div></li>';
					
		//<a onclick="onpi(\''+item.pi+'\')">评语</a>
					 
				}
			});
		 }
		 if((htmlstest_new==""||htmlstest_new==null)&&(htmlstest_over==""||htmlstest_over==null)){
			 htmlstest_new = '<li style="background:none;"><div><img src="images/work_none.png" /></div></li>';
		 }
		 
		 if(htmlstest_over_P==""||htmlstest_over_P==null){
			 htmlstest_over_P = '<li style="background:none;"><div><img src="images/work_overnone.png" /></div></li>';
		 }
		$("#test_list_0").html(htmlstest_new+htmlstest_over);
		$("#test_list_1").html(htmlstest_over_P);
		$("#test_list_2").html('敬请期待'); 
}

//分数等级的遍历my_score
function score_img(temp_score){
	
	 if(temp_score<100&&temp_score>=95){
	 	return "images/A_001.gif";
	 }else if(temp_score<95&&temp_score>=85){
	 	return "images/A_002.gif";
	 }else if(temp_score<85&&temp_score>=70){
	 	return "images/A_003.gif";
	 }else if(temp_score<70&&temp_score>=60){
	 	return "images/A_004.gif";
	 }else if(temp_score<60){
	 	return "images/A_005.gif";
	 }
}

 
/*function onpi(name,stupi,datatime,teacher){
	
	jAlert('<div>学校:-班级名称:  语文  '+teacher+'  作业名称:'+name+' '+datatime+'</div><div stype="">评语：'+stupi+'</div>', '老师评语');
}*/


function onpi(stupi){
	layer.alert('<div style="padding:10px; text-align:left;">'+stupi+'</div>', 9,'老师评语');
	 
}

function WeiZuo(CZC_ids,contentid,sjname,time,assign_id,eid,teachername,sub_id,type,stu_exeid,creator_id,exam_type,conditions,class_id,sch_nameST,zone_nameST,clss_nameST){
	$.cookie("assign_id",assign_id,{path:"/"});
	$.cookie("shijuanid",Base64.decode(contentid) ,{path:"/"});
	$.cookie('shijuanName',sjname,{path:"/"});
	$.cookie("exercise_id",eid ,{path:"/"});
	$.cookie("czcids",Base64.decode(CZC_ids),{path:"/"});
	$.cookie("type",type ,{path:"/"});
	$.cookie("stu_exeid",stu_exeid ,{path:"/"});
	$.cookie("shijuanTime",time,{path:"/"});
	$.cookie("teacher_Name",teachername ,{path:"/"});
	$.cookie("sub_Id",sub_id,{path:"/"});
	$.cookie("creator_id",creator_id,{path:"/"});
	$.cookie("class_id",class_id,{path:"/"});
	$.cookie("exam_type",exam_type,{path:"/"});
	$.cookie("sch_nameS",sch_nameST,{path:"/"});
	$.cookie("zone_nameS",zone_nameST,{path:"/"});
	$.cookie("clss_nameS",clss_nameST,{path:"/"});
	 
	/*if(type==1){
		alert(type);
	}else{
		
		window.location.href="Dhmwk.html";
	}*/
	window.location.href="Dhmwk.html?data="+conditions;
	
}

function yizuo(sjname,contentid,id,eid,sub_id,sch_nameST,zone_nameST,clss_nameST){
	//alert(sjid);
	$.cookie("shijuanid",Base64.decode(contentid) ,{path:"/"});
	$.cookie('shijuanName',sjname,{path:"/"});
	$.cookie("sjid",id ,{path:"/"});
	$.cookie("exercise_id",eid ,{path:"/"});
	$.cookie("sub_Id",sub_id,{path:"/"});
	$.cookie("sch_nameS",sch_nameST,{path:"/"});
	$.cookie("zone_nameS",zone_nameST,{path:"/"});
	$.cookie("clss_nameS",clss_nameST,{path:"/"});
	 
	window.location.href="catHmwk.html";
	
}

function yipiyue(sjname,contentid,id,eid,pi,sub_id,sch_nameST,zone_nameST,clss_nameST){
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
	 
	
	window.location.href="OKHmwk.html";
	
}
 
 

//分数的判断