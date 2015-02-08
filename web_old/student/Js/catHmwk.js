var UserInfo=null;
var shjName = $.cookie("shijuanName");//试卷名称
var paperid = $.cookie("shijuanid");//试卷试题id集
var exercise_id = $.cookie("exercise_id");//试卷试题id集
var questions = paperid.split(",");//试题集id数组
var counts =questions.length;//试题集个数
var sub_Id = $.cookie("sub_Id");
var sch_nameS = $.cookie("sch_nameS");//学校name
var zone_nameS = $.cookie("zone_nameS");//校区name
var clss_nameS = $.cookie("clss_nameS");//班级name
var current_i = 0; //当前试题的下标
var current_j = 0;//当前题目
var sjid = $.cookie("sjid");
var czcids = $.cookie("czcids");
var teacher_nameT = $.cookie("teacher_name");
var center_idsT = $.cookie("center_id");
var QuestionInput = { s: "StudentAnswer", a: "CorrectAnswer", c: "QuestionCheck", f: "StudentFraction", m: "TCountSorce", l: "0" };

$(document).ready(function (){
	shjName = $.cookie("shijuanName");//试卷名称
	paperid = $.cookie("shijuanid");//试卷试题id集
	exercise_id = $.cookie("exercise_id");//试卷试题id集
	questions = paperid.split(",");//试题集id数组
	counts =questions.length;//试题集个数
	sub_Id = $.cookie("sub_Id");
	sch_nameS = $.cookie("sch_nameS");//学校name
	zone_nameS = $.cookie("zone_nameS");//校区name
	clss_nameS = $.cookie("clss_nameS");//班级name
	center_idsT = $.cookie("center_id");
	 teacher_nameT = $.cookie("teacher_name");
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	czcids = $.evalJSON($.cookie("czcids"));
	//FillStudentAnswer(sjid);
	if(UserInfo!=null&&UserInfo!=undefined){
		 var nick =  $.cookie("nick");
		 if (UserInfo != null) {
				$('#headusername').text(UserInfo.realname);
		 }else if(nick!=null){
				$('#headusername').text(nick);
		 }
		 if(center_idsT!=null&&center_idsT!=""){
			$('#link_urladmission').attr("href",'./admission_standed.html');
		 	$('#link_urladmission').html(" << 返回入学测试首页");
		 }
		
		 LookWord();
	}else{
		window.location.href = "../index.html";
	}
	
	
});//.ready的结束标签
//-------------------------------------获得试题函数-----------------------------------------------------


function LookWord()
{
    //$.messager.progress({ text: '正在获取试卷信息' });//获取试卷信息读条
	 var load_i = 0;
	  
	 var center_idt = 0;
	 if(center_idsT!=null&&center_idsT!=""){
		 center_idt = center_idsT;
	 }else{
		 center_idt = UserInfo.center_info[0].id;
	 }
	 $.ajax({
        url: Webversion + '/test/list/list_detail?r='+$.getRom(), //url访问地址
        type: "GET",
		async:false,
        data: {
            'study_exercise_id': sjid ,//学生试卷ID
			'center_id':center_idt
        },
        dataType: "json",
        beforeSend: function (request) {
			load_i = layer.load('加载中...');  
			request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
		complete: function (XMLHttpRequest, textStatus){
			layer.close(load_i);
		},
		success: function (result)
        {
            
			FillStudentAnswer(result);
		},
		error: function (result){
		 
			if(result.status=='401'){
				layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
					clearcookie();
			});
			}else{
				layer.alert('加载数据失败！', 8,'温馨提示');	
			}
			 return;
		}
	 });
}




var question = null;
var conQuestion = false;


function  FillStudentAnswer(result){
// 获取试卷信息
	
    var ifMapping = 0;
       
            if (result == null || result.list == null){
                //$.messager.progress('close');
			  layer.alert('系统获取试卷信息失败！', 8,'温馨提示');	
              
                return;
            }
           question = result.list;//试卷试题
		   StuExerciseAnsInfo = $.evalJSON(Base64.decode(result.study_exercise.content)); //学生做的答案
		    
		   var orderQues = $.evalJSON((Base64.decode($.evalJSON((result.exam_exercise.activities)).queThree))); //题目排序
		   var data_tests_Q = ($.evalJSON((result.exam_exercise.activities)).data_test); //题目类型
		    
		   var subject_id =result.exam_exercise.subject_id;
		  // alert(JSON.stringify(orderQue));
		   var teacherName = result.exam_exercise.realname;
		   var teacher_id = parseInt(result.exam_exercise.teacher_id);
		   var shjTime = result.study_exercise.log_time;
		   var subjectname = subject_sum(parseInt(subject_id));
		   $('#school_name').html(sch_nameS);
			$('#zone_name').html(zone_nameS);
			
			$('#class_name').html(clss_nameS);
			
			$('#subject_name').html(subjectname);
			$('#work_name').html(shjName);
			$('#date_name').html(shjTime.substring(0,10));
			if(center_idsT!=null&&center_idsT!=""){
				 $('#work_flag').html(teacher_nameT);
			}else{
				$('#work_flag').html(teacherName.substring(0,1)+"老师");	 
			}
			
		   if(data_tests_Q.testtype==1){ 
				var zongfen = 0;
				$.each(orderQues,function(iis,nns){  //排序
					zongfen += parseInt(nns.sorces);
				});
				$('.test_que').show();
				$('.scrolf').show();
				$('.total_right').html(zongfen);
				$('.total_wrong').html('--');
				$('#scrools').html(zongfen); 
		   }else{
			   $('.scrolf').hide();
			   $('.test_que').hide();
			    
		   }
		    
			//$('.total_right').html(result.submit_num);
			var param ={"condition":{"objective_score":0,"subjective_score":0}}; //$.evalJSON(result.param);
		
            var htmlContent = '';//外面不需要循环的html字符串
		    
            var testUserInfo = { name: '-', grade: '-', subject: '-', teacher: '-', time: '-', level: '-', point: '0' };
			
            testUserInfo.point = 0;
            conQuestion = false; 
			
            conQuestion = (question!="" && question.length > 0);
			$.each(orderQues,function(i_1,n_1){
				htmlContent += '<div class="que_types_css">'+number_ch(parseInt(i_1)+1)+'、'+n_1.typename+'</div>'
				if(n_1.ids!=""&&n_1.ids!=null){
					$.each(n_1.ids,function(i_2,n_2){
						var Exanswer = ""; 
						var XExanswer = ""; 
						var stuAnser = "";
						var ExContent = "";
						var stuAttachment = "";
						var obj_flag = "";
						var sorce = n_1.sorceP;
						var sections_tem = 0;
						if(n_2!=""&&n_2!=null){
							$.each(question,function(i_3,n_3){
								if(n_2.id==n_3.gid&&n_2.dbtype==n_3.dbtype){
									sections_tem = n_3.section_id;
									ExContent = n_3.content;
									obj_flag = n_3.objective_flag;
									Exanswer = n_3.answer;
									if(n_3.objective_flag==0){
										
									}else{ 
										XExanswer = n_3.objective_answer;
										if(XExanswer.length>0){
											var filerchar = ['组', '不'];
											// 对答案进行过滤,组、
											var lastchartemp = XExanswer.substr(XExanswer.length - 1, 1);
											$.each(filerchar, function (it, nn)
											{
												if (nn == lastchartemp)
												{
													XExanswer = XExanswer.substr(0, XExanswer.length - 1);
													return false;
												}
											});
										}
									}
								}
							});
							$.each(StuExerciseAnsInfo,function(i_4,n_4){
								if(n_2.id==n_4.id&&n_2.dbtype==n_4.dbtype){
									stuAnser = n_4.answer;
									stuAttachment = n_4.attachment;
								}
							});
							
							htmlContent +='<div class="tijixie"><div class="main_box_3_title"><div class="main_box_3_title_l" id="main_box_3_title_l"><span class="text_003">' + (i_2 + 1) + '</span><span class="text_003">/</span><span class="text_003" id="sjtishu">'+n_1.sum+'</span>'
							if(data_tests_Q.testtype==1){ 
								htmlContent += '<span class="text_003"> 本题分值：' + sorce + '分</span>';
							}
							htmlContent += '</div><div class="main_box_3_title_r" id="main_box_3_title_r"><a onclick="goods_ti(\''+n_2.id+'\','+subject_id+',2,'+n_2.dbtype+','+sections_tem+')">收藏好题</a>&nbsp;&nbsp;<a class="hf">查看解析</a></div></div><div class="main_box_3_cen"><div class="main_box_3_cen_1" id="main_box_3_cen_1">' + (i_2 + 1) + '、' + ExContent+'</div><div class="main_box_3_cen_2_1"><div class="main_box_3_cen_2_left_1">';
							//附件判定<a onclick="erro_ti(\''+n_2.id+'\','+subject_id+',1)">收藏错题</a>
							if(stuAttachment!=""&&stuAttachment!=undefined){
								//alert(attement_temp);
							htmlContent += '<span class="text_008"></span><span class="text_006">你的附件：';
							 
								var attement_temp_P = stuAttachment.split(',');//上传图片从答题卡回调
								 
								for(m=0;m<attement_temp_P.length;m++){
									 
									htmlContent += '('+(m+1)+')、<a href="hx_20@13_paid_pic/hx_@images/'+attement_temp_P[m]+'" target="_blank">'+attement_temp_P[m]+'</a>&nbsp;&nbsp;';
								}
								htmlContent += '</span><br>';	
							
							}else{htmlContent += '';}
							
						    htmlContent += '<span class="text_008"></span><span class="text_006">你的答案：' + stuAnser+' </span>';
							if(n_1.typename=="选择题"){
						  		htmlContent += '<br /><span class="text_008"></span><span class="text_007">正确答案：<span id="' + QuestionInput.a + n_2.id + '" >' + XExanswer + '</span></span><br />';
							}else{htmlContent +="";}
						  	
							 htmlContent += '</div><div class="main_box_3_cen_2_right_1"><div class="jiexi"></div></div><div stype="clear:both;"></div></div><div id="focus" style="display:none;"><div class="jiexi_bg">试题解析</div><div class="focus_TEMP">'+Exanswer+'</div></div></div></div></div></div>';
						 	
						}
						 
					});
				}
				
			});
            $("#main_box_3").html(htmlContent);
			 
			 moves_jixi();
        
}

 



//好题添加  2  好题  
	function goods_ti(id,suboj,his_type,dbtype,section_Teid){
		sel_goods(his_type,id,suboj,2,dbtype,section_Teid);
	}
	