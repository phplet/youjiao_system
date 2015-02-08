var shjName = $.cookie("shijuanName");//试卷名称
var shjTime = $.cookie("shijuanTime");//试卷时间
var exercise_id = $.cookie("exercise_id");
var creator_id = $.cookie("creator_id");
var paperid = $.cookie("shijuanid");//试卷试题id集
var class_id_T = $.cookie("class_id");//班级id
var sch_nameS = $.cookie("sch_nameS");//学校name
var zone_nameS = $.cookie("zone_nameS");//校区name
var clss_nameS = $.cookie("clss_nameS");//班级name
var stu_exeid = $.cookie("stu_exeid");//学生做的试卷
var exam_type = $.cookie("exam_type");//作业 0 和测试 1  
var stu_exetype = $.cookie("type");//试卷试题id 
var teacher_Name = $.cookie("teacher_Name");//老师名字
var sub_Id = $.cookie("sub_Id");//科目id
var paperid = $.cookie("shijuanid");//试卷试题id集
var usersid = $.cookie("UsersId");
var UserInfo = $.evalJSON($.cookie("UserInfo"));
var counts =0;//试题集个数
var current_i = 0; //当前试题的下标
var current_j = 0;//当前题目
var current_time = '';//答题时的当前时间
var end_time = '';//答题时的结束时间
var objective_flag = '';
var q_answer = '';//题的答案
var objective_answer_Temp = '';
var question_type = '';//答案类型
var tqEditor;//编辑器对象
var stu_answer = '';
var demo_num = 0;
var centerAll = "";
var resultIsWrite = 0;//是否向答题卡中写值1为不写，2为写，0为初始化值
var testlist = "";
var quethree_data = "";
var czcids = {};
var section_idTs = 0;
$(document).ready(function (){
	creator_id = $.cookie("creator_id");
	paperid = $.cookie("shijuanid");//试卷试题id集
	stu_exeid = $.cookie("stu_exeid");//学生做的试卷
	exam_type = $.cookie("exam_type");//作业 2 和测试 1  
	stu_exetype = $.cookie("type");//试卷试题id 
	teacher_Name = $.cookie("teacher_Name");//老师名字
	sub_Id = $.cookie("sub_Id");//科目id
	paperid = $.cookie("shijuanid");//试卷试题id集
	usersid = $.cookie("UsersId");
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	czcids = $.evalJSON($.cookie("czcids"));
	class_id_T = $.cookie("class_id");//班级id
	sch_nameS = $.cookie("sch_nameS");//学校name
  	zone_nameS = $.cookie("zone_nameS");//校区name
	clss_nameS = $.cookie("clss_nameS");//班级name c 
	//alert(exercise_id);
	//--------------------------------------------------------------获取用户的昵称
 	 
	if(UserInfo!=null&&UserInfo!=undefined){
		 var nick =  $.cookie("nick");
		 if (UserInfo != null) {
				$('#headusername').text(UserInfo.realname);
		 }else if(nick!=null){
				$('#headusername').text(nick);
		 }
		quethree_data = $.parseJSON(Base64.decode($.parseJSON(Base64.decode(getUrlParam("data"))).queThree));
		 //alert(counts);
		if(stu_exetype==1){	
			ajaxtest();//获取题目
			getAnswerSheet(exercise_id);//根据exercise_id去获得答题卡中的暂存
		}else{
			var ii = layer.confirm('确认：重新开始,取消：继续做？' , function(){
				ajaxtest();//获取题目
				get_questions(0); 
		    },'温馨提示',function(){
				ajaxtest();//获取题目
				getAnswerSheet(exercise_id);//根据exercise_id去获得答题卡中的暂存
			});
			
			$.layer({
				shade : [0.2 , '#696969' , true], //不显示遮罩
				area : ['330px','160px'],
				closeBtn : [0 , false],
				title:'温馨提示',
				dialog : {
					msg:'是否继续做？',
					btns : 2, 
					type : 4,
					btn : ['是','否'],
					yes : function(){
						ajaxtest();//获取题目
						getAnswerSheet(exercise_id);//根据exercise_id去获得答题卡中的暂存
					},
					no : function(){
						ajaxtest();//获取题目
						get_questions(0); 
						
					}
				}
			});
			
		}
		  
	}else{
		window.location.href = "../index.html";
	}
	 

});//.ready的结束标签
//-------------------------------------获得试题函数-----------------------------------------------------


function ajaxtest(){
 	var load_i = 0; 
	$.ajax({  //newtest这是新试卷
        url: Webversion + '/examination_paper?r='+$.getRom(), //
        type: "GET",
        dataType: "json",
		async:false,
        data: {'action':'paper','paper_id':paperid,'subject_id':sub_Id,'center_id':UserInfo.center_info[0].id,'newtest':1,'study_exercise_id':stu_exeid},
		beforeSend: function (request) {
			load_i = layer.load('加载中...');  
            request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
		complete: function (XMLHttpRequest, textStatus){
			layer.close(load_i);
		},
        success: function (result)
        {
			 
			counts = result.list.length;
			section_idTs = parseInt(result.list[0].section_id);
			var temp_dataslist = {'list':[]};
			var zongfen = 0;
			$.each(quethree_data,function(iis,nns){  //排序
				zongfen += parseInt(nns.sorces);
				$.each(nns.ids,function(i_1,n_1){
					$.each(result.list,function(i_2,n_2){
							if(n_1.id==n_2.gid&&n_1.dbtype==n_2.dbtype){
								n_2['sorceP'] = nns.sorceP;
								n_2['sumS'] = nns.sum;
								temp_dataslist.list.push(n_2);
							}
					});
				});
			});
			
            testlist = temp_dataslist;
			$('#school_name').html(sch_nameS);
			$('#zone_name').html(zone_nameS);
			$('#class_name').html(clss_nameS);
			
			$('#subject_name').html(subject_sum(parseInt(sub_Id)));
			$('#work_name').html(shjName);
			$('#date_name').html(shjTime.substring(0,10));
			$('#work_flag').html(teacher_Name.substring(0,1)+"老师");
			$('.total_right').html(result.submit_num);
			 
			if(exam_type==1){
				$('.scrolf').show();
				$('#scrools').html(zongfen);
			}else{
				$('.scrolf').hide(); 
			}
        }
		,
		error: function (result)
		{
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

 

/*
*参数i为指定题b为判断左右移动
*/
function get_questions(i,b){
	
	var num =current_j;
	
	//alert(current_time);
	if(b=='up'){//为上一步
	    
	 current_j = i-1;
	 }else if(b=='to'){//下一步
	 current_j = i+1;
	 writeAnswer();
	//alert(current_j);
	 }
	 var date =  new Date();
	 current_time = date.toLocaleString();
	 //current_time='2013/4/11 16:24:24';
	 //time1 = date.format("yyyy-MM-dd HH:mm:ss"); 
	 current_time = current_time.replace('年','-');
	 current_time = current_time.replace('月','-');
	 current_time = current_time.replace('日','-');
	  
	 var questions = testlist.list[current_j];
			 
			objective_flag = questions.objective_flag;
			q_answer = questions.answer;//题的正确答案
			objective_answer_Temp = questions.objective_answer;
			question_type = questions.type_name;
			 
			 $("#oneQuestion").html((current_j+1)+'、'+questions.content);
			//alert(questions.question_type);
			//$("#question_type").text(questions.question_type);//题型
			//$("#tihao").text( current_j+1);//显示题号
			//$("input[type=radio]").attr('name',questions.id);
			$("#sjName").text(shjName);//试卷名称
			$("#sjtishu").attr("dbtype",questions.dbtype);//试卷题数
			
			$("#sjTime").text(shjTime);//试卷时间
			
			 
			
			$('.total_wrong').html((current_j+1)+'/'+counts);
			if(exam_type==1){
				$(".main_box_3_title_l").html('<span class="text_009_1">'+questions.type_name+'&nbsp;(每题'+questions.sorceP+'分，共'+questions.sumS+'题)</span>');
			}else{
				$(".main_box_3_title_l").html('<span class="text_009_1">'+questions.type_name+'&nbsp;(共'+questions.sumS+'题)</span>');
			}
			//alert("num:"+num+"----current_j:"+current_j+"----试卷id:"+questions.id);
			/* if(questions.question_type=="解答题" || questions.question_type=="阅读题" || questions.question_type=="填空题" || questions.question_type=="非选择题" || questions.question_type=="其它"){ */
			if(questions.objective_flag == 0 || questions.objective_answer=='组'){//------------------------------非选择题
				//alert($("#answerArea").text());
				//tqEditor = new TQEditor('answerArea');//必须在表单域后---------------------------？？？？？？？？未完成加html编辑器
				//alert(tqEditor.content());
			
				$("#answerArea").attr('name',questions.gid);
				
				//$("textarea").attr("id",questions.id);
				$(".main_box_3_cen_2").css("height","42px");
				if(current_j==0){
				 
					var areaimg_demo = $('#'+questions.gid+'_img').text();//从答题卡上获得上传图片的内容
					 
					$('#anwe1').text(areaimg_demo);
					var area_demo = $('#'+questions.gid).html();
					 
					if(($.trim(area_demo))!=""){
						editor.sync();//同步编辑器内容
						editor.html(area_demo);//赋值编辑器内容
						//$('#answerArea').val(area_demo);
						if(areaimg_demo!=""){
						$(".files").css("display","block");
						var areaimg_P = areaimg_demo.split(',');//上传图片从答题卡回调
						//alert(areaimg_P.length);
						for(t=0;t<areaimg_P.length-1;t++){
							
							var areaing_one = areaimg_P[t].split('.');
							
							var areaing_tex="";
							if(areaing_one[1]=="txt"){
								areaing_tex = "images/txt.png"; 
							}else if(areaing_one[1]=="doc"){areaing_tex = "images/doc.png";}else{areaing_tex="hx_20@13_paid_pic/hx_@images/"+areaimg_P[t]}
							$(".files").append('<div class="tv_main" id="'+areaing_one[0]+'"><ul><li class="tv_main_img">--</li><li class="tv_main_img"><img src="'+areaing_tex+'" width=30 height=30 ></li><li class="tv_main_pic"><a href="hx_20@13_paid_pic\/hx_@images\/'+areaimg_P[t]+'">'+areaimg_P[t]+'</a></li><li class="tv_main_size">(--k)</li><li class="tv_main_op" onClick="dele_pic_back(\''+areaing_one[0]+'\',\''+areaing_one[1]+'\',\''+questions.gid+'\')">删除</li></ul><div class="cleard"></div></div>');
							
						}
					}
				  }
				}
				else if(num>current_j){  //判断是回上一题的话 ，给出学生填写的答案 
					var area_demo = $('#'+questions.gid).html(); //获得答题卡html
					editor.sync();//同步编辑器内容
					editor.html(area_demo);//赋值编辑器内容
					//$('#answerArea').val(area_demo);
					var areaimg_demo = $('#'+questions.gid+'_img').text();//从答题卡上获得上传图片的内容
					$('#anwe1').text(areaimg_demo);
				 
					if(areaimg_demo!=""){
						$(".files").css("display","block");
						var areaimg_P = areaimg_demo.split(',');//上传图片从答题卡回调
						for(t=0;t<areaimg_P.length-1;t++){
							 
							var areaing_one = areaimg_P[t].split('.');
							
							var areaing_tex="";
							if(areaing_one[1]=="txt"){
								areaing_tex = "images/txt.png"; 
							}else if(areaing_one[1]=="doc"){areaing_tex = "images/doc.png";}else{areaing_tex="hx_20@13_paid_pic/hx_@images/"+areaimg_P[t]}
							$(".files").append('<div class="tv_main" id="'+areaing_one[0]+'"><ul><li class="tv_main_img">--</li><li class="tv_main_img"><img src="'+areaing_tex+'" width=30 height=30 ></li><li class="tv_main_pic"><a href="hx_20@13_paid_pic\/hx_@images\/'+areaimg_P[t]+'">'+areaimg_P[t]+'</a></li><li class="tv_main_size">(--k)</li><li class="tv_main_op" onClick="dele_pic_back(\''+areaing_one[0]+'\',\''+areaing_one[1]+'\',\''+questions.gid+'\')">删除</li></ul><div class="cleard"></div></div>');
						}
					}
					
				} else if(num<current_j){
					var areaimg_demo = $('#'+questions.gid+'_img').text();//从答题卡上获得上传图片的内容
					$('#anwe1').text(areaimg_demo);
					var area_demo = $('#'+questions.gid).html();
					if(($.trim(area_demo))!=""){
						editor.sync();//同步编辑器内容
						editor.html(area_demo);//赋值编辑器内容
						//$('#answerArea').val(area_demo);
						if(areaimg_demo!=""){
						$(".files").css("display","block");
						var areaimg_P = areaimg_demo.split(',');//上传图片从答题卡回调
						//alert(areaimg_P.length);
						for(t=0;t<areaimg_P.length-1;t++){
							
							var areaing_one = areaimg_P[t].split('.');
							
							var areaing_tex="";
							if(areaing_one[1]=="txt"){
								areaing_tex = "images/txt.png"; 
							}else if(areaing_one[1]=="doc"){areaing_tex = "images/doc.png";}else{areaing_tex="hx_20@13_paid_pic/hx_@images/"+areaimg_P[t]}
							$(".files").append('<div class="tv_main" id="'+areaing_one[0]+'"><ul><li class="tv_main_img">--</li><li class="tv_main_img"><img src="'+areaing_tex+'" width=30 height=30 ></li><li class="tv_main_pic"><a href="hx_20@13_paid_pic\/hx_@images\/'+areaimg_P[t]+'">'+areaimg_P[t]+'</a></li><li class="tv_main_size">(--k)</li><li class="tv_main_op" onClick="dele_pic_back(\''+areaing_one[0]+'\',\''+areaing_one[1]+'\',\''+questions.gid+'\')">删除</li></ul><div class="cleard"></div></div>');
						}
					   }
				}else{
						editor.sync();//同步编辑器内容
						editor.html("");//赋值编辑器内容
						//$('#answerArea').val("");
						if(areaimg_demo!=""){
						$(".files").css("display","block");
						var areaimg_P = areaimg_demo.split(',');//上传图片从答题卡回调
						//alert(areaimg_P.length);
						for(t=0;t<areaimg_P.length-1;t++){
							var areaing_one = areaimg_P[t].split('.');
							var areaing_tex="";
							if(areaing_one[1]=="txt"){
								areaing_tex = "images/txt.png"; 
							}else if(areaing_one[1]=="doc"){areaing_tex = "images/doc.png";}else{areaing_tex="hx_20@13_paid_pic/hx_@images/"+areaimg_P[t]}
							$(".files").append('<div class="tv_main" id="'+areaing_one[0]+'"><ul><li class="tv_main_img">--</li><li class="tv_main_img"><img src="'+areaing_tex+'" width=30 height=30 ></li><li class="tv_main_pic"><a href="hx_20@13_paid_pic\/hx_@images\/'+areaimg_P[t]+'">'+areaimg_P[t]+'</a></li><li class="tv_main_size">(--k)</li><li class="tv_main_op" onClick="dele_pic_back(\''+areaing_one[0]+'\',\''+areaing_one[1]+'\',\''+questions.gid+'\')">删除</li></ul><div class="cleard"></div></div>');
						}
						}
					} 
				}
				$("#zyAnswer").css("display","none");
				$("#radio_more").empty();
				$("#radio_more").css("display","none");
				$("#htmlbj").css("display","block");

				
			}else{//-------------------------------------选择题---------------------------------------------------
				var xuanze_type = questions.objective_answer; 
				//判断是多项选择还是单项选择
				$("#radio_more").empty();
				$("#zyAnswer").css("display","none");
				$("#htmlbj").css("display","none");
				$("#radio_more").css("display","block");
				if((xuanze_type).indexOf('组')>0){
					//alert('我是选择题');
					$("#zyAnswer").css("display","none");
					$("#htmlbj").css("display","none");
					 
					$("#radio_more").append('<span id="xuanze_exercid_id" style="display:none;">'+questions.gid+'</span>');
					xuanze_type = $.trim((xuanze_type.replace('组','')));//去掉组
					$(".main_box_3_cen_2").css("height",(parseInt(xuanze_type.length)*42));
					//alert(xuanze_type.length);
					for(i=0;i<xuanze_type.length;i++){
						j=i+1;
						$("#radio_more").append('('+j+')&nbsp;&nbsp;<span class="radio_answers"><input type="radio" value="A" name="daan_'+j+'" />A<input type="radio" value="B" name="daan_'+j+'" />B<input type="radio" value="C" name="daan_'+j+'" />C<input type="radio" value="D" name="daan_'+j+'" />D</span><br>');
					}
					
					if(num>current_j){//上一题
						
						//alert('上一题的题号:'+questions.id);
						var radio_demo = $('#'+questions.gid).text();
						xuanze_type = $.trim((radio_demo.replace('组','')));//去掉组
						var i = xuanze_type.length;
						$(".main_box_3_cen_2").css("height",(parseInt(xuanze_type.length)*42));
						for(var j=0;j<i;j++){
							f=j+1;
							$("input[name=daan_"+f+"][value="+xuanze_type[j]+"]").attr("checked",true); 
						}
					}
					else if(num<current_j){//为下一题
						//alert('下一题的题号:'+questions.id);
						var radio_demo = $('#'+questions.gid).text();
						//alert(radio_demo);
						if(($.trim(radio_demo))!=''){//如果有答案
							xuanze_type = $.trim((radio_demo.replace('组','')));//去掉组
							var i = xuanze_type.length;
							$(".main_box_3_cen_2").css("height",(parseInt(xuanze_type.length)*42));
							for(var j=0;j<i;j++){
								f=j+1;
								$("input[name=daan_"+f+"][value="+xuanze_type[j]+"]").attr("checked",true); 
							}
							
						}else{//没有答案
							
						}
						
					}
					else if(current_j==0){
						//alert('题号:'+questions.id);
						//alert();
						var radio_demo = $('#'+questions.gid).text();
						//alert(radio_demo);
						if(($.trim(radio_demo))!=''){//如果有答案
							xuanze_type = $.trim((radio_demo.replace('组','')));//去掉组
							$(".main_box_3_cen_2").css("height",(parseInt(xuanze_type.length)*42));
							var i = xuanze_type.length;
							for(var j=0;j<i;j++){
								f=j+1;
								$("input[name=daan_"+f+"][value="+xuanze_type[j]+"]").attr("checked",true); 
							}
							
						}
					}
					//单选多项选择处理
					
					
				}else{
					//单选单项选择处理
					$("#radio_more").empty();
					$("#radio_more").css("display","none");
					$(".main_box_3_cen_2").css("height","42px");
					$("input[type=radio]").attr('name',questions.gid);
					if(num>current_j){  //判断是还回上一题的话，给出学生选择的答案 
						var radio_demo = $('#'+questions.gid).text();
						$("input[type=radio][value="+radio_demo+"]").attr("checked",true);
						 
					}else if(num<current_j){
						var radio_demo = $('#'+questions.gid).text();
						if(($.trim(radio_demo))!=''){
							 
							$("input[type=radio][value="+radio_demo+"]").attr("checked",true);  
						}else{
							
							$("input[type=radio]:checked").attr("checked",false);
						}
						
					}else if(current_j==0){
						//alert(questions.id);
						//var radio_demo =  $('#'+questions.id).text();
						//alert(radio_demo);
						var radio_demo =  $('#'+questions.gid).text();
						 
						if(($.trim(radio_demo))!=''){
							$("input[type=radio][value="+radio_demo+"]").attr("checked",true);  
						}else{
							$("input[type=radio]:checked").attr("checked",false);
						}
					}
					$("#zyAnswer").css("display","block");
					$("#htmlbj").css("display","none");
				}
			}
	 
}

//---------------------------------下一题---------------------------------------------------------------
function ToNext(){
	end_time = current_time;
	 
	if(current_j==counts-1){//判断题目是否为最后一题 
		//alert("已经为最后一题");
		current_j++;
	 	var radio_de = $("input[type=radio]:checked").val();
		
		editor.sync();//同步编辑器内容
		var textarea = $('#answerArea').val();
		 
		if($(".radio_answers".length!=0)){//判断选择题，多题选择不为空
			if(resultIsWrite!=1){
				writeAnswer();
			}
			$("#zyAnswer").css("display","none");
			$("#zyt").css("display","none");
			$("#answers").css("display","block");
			return false;
		}
		else if(($("#zyAnswer").css("display")=="block")&&(radio_de!=undefined)){   //判断选择题不为空
			writeAnswer();
			 
			$("#zyAnswer").css("display","none");
			$("#zyt").css("display","none");
			$("#answers").css("display","block");
			
		}else if(($("#zyAnswer").css("display")=="block")&&(radio_de==undefined)){   //判断选择题为空
			current_j--;
			layer.alert('答案为空，请填写本题答案！', 8,'温馨提示');
			return false;
		}
		if(($("#htmlbj").css("display")=="block")&&(textarea!="")){   //判断问答题不为空
			writeAnswer();
			 
			$("#htmlbj").css("display","none");
			$("#zyt").css("display","none");
			$("#answers").css("display","block");
			
		}else if(($("#htmlbj").css("display")=="block")&&(textarea=="")){   //判断问答题为空
			current_j--;
			layer.alert('答案为空，请填写本题答案！', 8,'温馨提示');
			return false;
		}
		//writeAnswer();
		return false;
	}
	
	if(current_j == counts -2){
		//alert("到了最后一道题");
		 
		$("#dtk_001").css("display","none");
		$("#dtk").css("display","block");
		
	}
	
	
	 
	$("#oneQuestion").empty();
	
	$(".files").css("display","none");
	$(".files").html('<div class="tv_main"><ul><li class="tv_main_img">序号</li><li class="tv_main_img">图片</li><li class="tv_main_pic">名称</li><li class="tv_main_size">大小</li><li class="tv_main_op">操作</li></ul><div class="cleard"></div></div>');
	
	get_questions(current_j,'to');
	
	//-----------------------记录答案
	
	
	//$("#anwe1").empty(); 

}
//---------------------------------上一题---------------------------------------------------------------
function UpNext(){
	
	if(current_j==0){
		return false;
	}
	
	$("#dtk_001").css("display","block");
	$("#dtk").css("display","none");
	$("#oneQuestion").empty();
	$(".files").html('<div class="tv_main"><ul><li class="tv_main_img">序号</li><li class="tv_main_img">图片</li><li class="tv_main_pic">名称</li><li class="tv_main_size">大小</li><li class="tv_main_op">操作</li></ul><div class="cleard"></div></div>');
	//$("#anwe1").empty();
	get_questions(current_j,'up');
	
}

//---------------------------------显示答题卡---------------------------------------------------------------


//---------------------------------向答题卡中记录答案------------------------------------------------------
function writeAnswer(){	
	 var dbtype = $('#sjtishu').attr("dbtype");
	if($(".radio_answers").length!=0){//判断是否为多选题
		//alert("向答题卡中记录多选题的答案");
		//alert($(".radio_answers").length);
		 
		var i = $(".radio_answers").length;//单选题个数
		 
		var duoxuan='';
		for (var j=1;j<=i;j++){
			duoxuan += $("input[name=daan_"+j+"]:checked").val();
		}
		if(duoxuan.length == i && duoxuan.length !=0){
			
		
			duoxuan = duoxuan+'组';
			var correct = 1;
			if(objective_answer_Temp==duoxuan){
				correct = 1;
			}else{
				correct = 0;
			}
			var question_id = $('#xuanze_exercid_id').text();
			var duoxuananswer = $("#"+question_id).text();
			if(($.trim(duoxuananswer))==null||($.trim(duoxuananswer))==''){
				$("#anser1").append("<tr class='oneT'><td><a href='javascript:void(0)' onclick=cat_question("+(current_j)+")>"+(current_j)+"</a></td><td class='yc'>"+question_id+"</td><td class='yc'>"+current_time+"</td><td class='yc'>"+end_time+"</td><td id='"+question_id+"' >"+duoxuan+"</td><td class='yc'>"+correct+"</td><td class='yc'>"+score+"</td><td class='yc'>"+objective_flag+"</td><td class='yc'>"+question_type+"</td><td class='yc' id='"+question_id+"_img'></td><td class='yc' id='"+question_id+"_dbtype'>"+dbtype+"</td></tr>");
			}else{
				$('#'+question_id).text(duoxuan);
			}
				//$("input[type=radio]:checked").attr("checked",false);//清空单选按钮
		
		}else{
			jAlert('答案为空，请填写本题答案！','温馨提示');
			UpNext(); 
		}
	}
	 else if ($("#zyAnswer").css("display")=="block") {//选择题
		
		//current_time;//----------------------------------------试题开始的时间
		var question_id = $("input[type=radio]").attr('name');//试题id--------->接口中的tid
		
		var zyAnswer_demo = $('#'+question_id).text();   //获得id为question_id文本内容, 为下面判断答题卡中有没有这个题目  有的话直接做修改  没有就追加  
		var answerOne = $("input[type=radio]:checked").val();//学生选择的答案--->接口中的answer
		//alert(answerOne);
		if(answerOne != undefined){
			var correct = 1;
			var score = 0;
			 
			if(objective_answer_Temp==answerOne){
				correct = 1;
			}else{
				correct = 0;
			}
			//}else{var correct =0; var score =1;}
			//$("#anser").append("<li>"+current_j+"---题id----"+question_id+"----答案----"+answerOne+"-----当前时间----"+current_time+"</li>");    
			if(($.trim(zyAnswer_demo))==null||($.trim(zyAnswer_demo))==''){
			
			$("#anser1").append("<tr class='oneT'><td><a href='javascript:void(0)' onclick=cat_question("+current_j+")>"+current_j+"</a></td><td class='yc'>"+question_id+"</td><td class='yc'>"+current_time+"</td><td class='yc'>"+end_time+"</td><td id='"+question_id+"' >"+answerOne+"</td><td class='yc'>"+correct+"</td><td class='yc'>"+score+"</td><td class='yc'>"+objective_flag+"</td><td class='yc'>"+question_type+"</td><td class='yc' id='"+question_id+"_img'></td><td class='yc' id='"+question_id+"_dbtype'>"+dbtype+"</td></tr>");
			//alert("当前题"+current_j+"当前题号"+question_id+"当前答案"+answerOne);
			$("input[type=radio]:checked").attr("checked",false);//清空单选按钮
		    }else{
				$('#'+question_id).text(answerOne);
			}
		}else{
			layer.alert('答案为空，请填写本题答案！', 8,'温馨提示');
			UpNext(); 
		}
 
	}else if($("#htmlbj").css("display")=="block"){//主观题
		
		var question_id = $("#answerArea").attr('name');
		var htmlbj_demo = $('#'+question_id).text();//获得id为question_id文本内容  为下面判断答题卡中有没有这个题目  有的话直接做修改  没有就追加  
		editor.sync();
		var answerOne = $("#answerArea").val();
		var anser_img = $("#anwe1").text();
		
		//alert(anser_img);
		if(($.trim(answerOne))!= ""){
			//answerOne='未填答案';
			var correct = 0;
			var score = 0;
			//$(".oneAnswers").append("<td>"+current_j+1+"<td><td>"+question_id+"<td><td>"+answerOne+"</td>");
			//alert("当前题"+(current_j)+"当前题号"+question_id+"当前答案"+answerOne);
			//$("#anser").append("<li>"+current_j+"-------"+question_id+"--------"+answerOne+"</li>");
			//$("#anser").append("<li>"+current_j+"---题id----"+question_id+"----答案----"+answerOne+"-----当前时间----"+current_time+"</li>");
			//重新初始化文本框
			if(($.trim(htmlbj_demo))==null||($.trim(htmlbj_demo))==''){ //判断答题卡中有没有这个题目  有的话直接做修改  没有就追加  
			$("#anser1").append("<tr class='oneT'><td><a href='javascript:void(0)' onclick=cat_question("+current_j+")>"+current_j+"</a></td><td class='yc'>"+question_id+"</td><td class='yc'>"+current_time+"</td><td class='yc'>"+end_time+"</td><td id='"+question_id+"'>"+answerOne+"</td><td class='yc'>"+correct+"</td><td class='yc'>"+score+"</td><td class='yc'>"+objective_flag+"</td><td class='yc'>"+question_type+"</td><td class='yc' id='"+question_id+"_img'>"+anser_img+"</td><td class='yc' id='"+question_id+"_dbtype'>"+dbtype+"</td></tr>");
			//$("#htmlbj").empty();
			editor.sync();//同步编辑器内容
			editor.html('');//清空编辑器内容
			 
			}else{
				
				$('#'+question_id).html(answerOne);
				$('#'+question_id+'_img').text(anser_img);
			}
		
		}else{
			 
			layer.alert('答案为空，请填写本题答案！', 8,'温馨提示');
			UpNext();
			if(anser_img!=""){
						$(".files").css("display","block");
						var areaimg_P = anser_img.split(',');//上传图片从答题卡回调
						for(t=0;t<areaimg_P.length-1;t++){
							 
							var areaing_one = areaimg_P[t].split('.');
							
							var areaing_tex="";
							if(areaing_one[1]=="txt"){
								areaing_tex = "images/txt.png"; 
							}else if(areaing_one[1]=="doc"){areaing_tex = "images/doc.png";}else{areaing_tex="hx_20@13_paid_pic/hx_@images/"+areaimg_P[t]}
							$(".files").append('<div class="tv_main" id="'+areaing_one[0]+'"><ul><li class="tv_main_img">--</li><li class="tv_main_img"><img src="'+areaing_tex+'" width=30 height=30 ></li><li class="tv_main_pic"><a href="hx_20@13_paid_pic\/hx_@images\/'+areaimg_P[t]+'">'+areaimg_P[t]+'</a></li><li class="tv_main_size">(--k)</li><li class="tv_main_op" onClick="dele_pic_back(\''+areaing_one[0]+'\',\''+areaing_one[1]+'\',\''+questions.id+'\')">删除</li></ul><div class="cleard"></div></div>');
						}
						 
						$('#anwe1').text(anser_img);
				}	
		 	 
		}
		
	};
}

//查看试题--------------------------------------------------------
function cat_question(current_j){
	//alert("此功能正在制作中.....,.");
	//alert(current_j);
	//get_questions(current_j);
	
	//$("#zyt").css("display","block");
	//$("#zyAnswer").css("display","none");
	//$("#htmlbj").css("display","none");
	//$("#answers").css("display","none");
	//查看试题修改答案

}
//------------------------------------------------------重新做
function relode(){
	window.location.reload();
}

//------------------------------------------------------提交答案
function submitAnswer(){
	var upload_exercise_answers = [];//json格式的数据

	var jj = $(".oneT").length;
	//alert(jj);

	for(var i=0;i<jj;i++){
		//alert(i);
		var tone = $(".oneT:eq("+i+")").children() ;
		
		var tid1;//题id
		var time_start1;//题开始时间
		var time_end1;//结束时间
		var answer1;//答案
		var correct1;//正确与否
		var score1;//分数
		var objective_flag1;//题类型
		var question_type1;//题类型
		var anser_img1;//问答题上传图片
		var dbtype1;//数据库类型
		for(j=1;j<tone.length;j++){
			 
			//alert((tone.eq("+j+")).text());
			//alert(tone[j].text());
			if(j==1){
			tid1 =(tone.eq(j)).html();continue;}
			//alert(tid1);
			if(j==2){
			time_start1 = (tone.eq(j)).html();continue;}
			if(j==3){
			time_end1 = (tone.eq(j)).html();continue;}
			if(j==4){
			answer1 = (tone.eq(j)).html();continue;}
			if(j==5){
			correct1 = (tone.eq(j)).html();continue;}
			if(j==6){
			score1 = (tone.eq(j)).html();	continue;}
			if(j==7){
			objective_flag1 = (tone.eq(j)).html();continue;}
			if(j==8){
			question_type1 = (tone.eq(j)).html();continue;}
			if(j==9){
			anser_img1 = (tone.eq(j)).html();continue;}
			if(j==10){
			dbtype1 = (tone.eq(j)).html();}
			 
		}
		//var oneJson = {"tid":tid1,"time_start":time_start1,"time_end":time_end1,"answer":answer1,"correct":correct1,"score":score1,"objective_flag":objective_flag1,"qusetion_type":qusetion_type1};
		//var oneJson = '{"tid":'+tid1+',"time_start":'+time_start1+',"time_end":'+time_end1+',"answer":'+answer1+',"correct":'+correct1+',"score":'+score1+',"objective_flag":'+objective_flag1+',"qusetion_type":'+question_type1+'}';
		var oneJson={};
		 
		oneJson.tid=tid1;
		oneJson.time_start=time_start1;
		oneJson.time_end=time_end1;
		oneJson.answer=answer1;
		oneJson.correct=correct1;
		oneJson.score=score1;
		oneJson.objective_flag=objective_flag1;
		oneJson.question_type=question_type1;
		oneJson.attachment=anser_img1;
		oneJson.dbtype=dbtype1;
		upload_exercise_answers.push(oneJson);
	}
	 
	//-------------提交数据----------------------------------------
	//获取用户id
	//alert(JSON.stringify(upload_exercise_answers));
	//var UserInfo = $.evalJSON($.cookie("UserInfo"));
	//alert(JSON.stringify(UserInfo));
	// [{"tid":"fbj10000003","time_start":"2013-8-8- 11:01:19","time_end":"2013-8-8- 11:01:16","answer":"B","correct":"1","score":"0","objective_flag":"1","question_type":"单项填空","attachment":"","dbtype":"1"}]
	var wrongJson = [];
 
	$.each(testlist.list,function(i_1,n_1){   //1对 2半对 3 错
		if(n_1.objective_flag==1){
			var XExanswer = n_1.objective_answer;
			if(XExanswer.length>0){
				var filerchar = ['组', '不'];
				// 对答案进行过滤,组、
				var lastchartemp = XExanswer.substr(XExanswer.length - 1, 1);
				$.each(filerchar, function (it, nn){
					if (nn == lastchartemp){
						XExanswer = XExanswer.substr(0, XExanswer.length - 1);
						return false;
					}
				});
			}
			$.each(upload_exercise_answers,function(i_2,n_2){
				 if(n_1.dbtype==n_2.dbtype&&n_1.id==n_2.tid){
					 if(XExanswer!=n_2.answer){
						 wrongJson.push({'ti_id':n_2.tid,'dbtype':n_2.dbtype});
					 }
				 }
			});
		}
	});
	//alert(JSON.stringify(upload_exercise_answers));
	//alert(JSON.stringify(wrongJson));
	var load_ii = 0; 
	 
	$.ajax({  
        url: Webversion + "/ticool/user_history/bat?_method=PUT&r="+$.getRom(),
        type: "POST",
        dataType: "json",
        data: {
        	"upload_exercise_answers": $.toJSON(upload_exercise_answers),   //答案
    		"comefrom": "pc",  //类型  pc端  手机端
    		"exercise_type": "1", //exercise_type
    		"score": "0",         //分数为0
			"content":JSON.stringify(wrongJson), //错误json  [{'ti_id':n_2.tid,'dbtype':n_2.dbtype},{'ti_id':n_2.tid,'dbtype':n_2.dbtype}]
			"bookcode":1,                        //
			"exam_id":exercise_id,                //试卷id
			"subject_id":sub_Id,                //科目id
			"creator_id":creator_id,            //试卷创建者(老师)id
			"exam_type":exam_type,        //作业 0 和测试 1 
    		"uid": usersid,               //学生id
			"section_id":section_idTs,
    		"assign_id":$.cookie("assign_id"),  //assign_id从作业列表返回过来的派送 study_exercise_id
			"submit_type":1  ,  //1是最后提交  0暂存
			'class_id':class_id_T,     //班级id
			'center_id':czcids.center_id,   //学校id
			'zone_id':czcids.zone_id     //校区id
        },
		beforeSend: function (request) {
			load_ii = layer.load('加载中...');  
            request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
		complete: function (XMLHttpRequest, textStatus){
			layer.close(load_ii);
		},
        success: function (result){//alert(result);
        	window.location.href="work_indexs.html";
		},
		error: function (result)
		{
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

//--------------------------------获得答题卡中的内容------------------------------
function getAnswerSheet(exercise_id){
	//获得答题卡中的内容
	//alert(exercise_id);
	var load_iii = 0; 
	$.ajax({  
        url: Webversion + "/ticool/user_history/bat?_method=POST&r="+$.getRom(),
        type: "POST",
        dataType: "json",
        data: {
			"uid":usersid ,
        	"exercise_id":exercise_id
        },
		beforeSend: function (request) {
			load_iii = layer.load('加载中...');  
            request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
		complete: function (XMLHttpRequest, textStatus){
			layer.close(load_iii);
		},
        success: function (result)
        {//alert(result.str);
        	//window.location.href="Index.html";
        	//alert("你保存成功");
        	//xuanXiangKaDaAn = (result != 0) ? result : null;
        	//if (xuanXiangKaDaAn != null){
        	//	alert(xuanXiangKaDaAn);
        	//}
			if(result.str!=0){
				$("#anser1").html(result.str);
				var nn = parseInt($(".oneT").length);
				if(nn!=0){
					get_questions(nn,"up"); 
					if(counts==nn){
						$("#dtk_001").css("display","none");
						$("#dtk").css("display","block");
					}
				}else{
					
					get_questions(0); 
					$("#anser1").html('<tr><th>题号</th><th>你的答案</th></tr>');
				}
			}else{
				get_questions(0); 
				$("#anser1").html('<tr><th>题号</th><th>你的答案</th></tr>');
			}
        	//ToNext();
        	//把选项卡里面的值重新赋值给题
        },
		error: function (result)
		{
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
 
