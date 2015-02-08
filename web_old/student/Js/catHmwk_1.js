var shjName = $.cookie("shijuanName");//试卷名称
var paperid = $.cookie("shijuanid");//试卷试题id集
var exercise_id = $.cookie("exercise_id");//试卷试题id集
var questions = paperid.split(",");//试题集id数组
var counts =questions.length;//试题集个数
var current_i = 0; //当前试题的下标
var current_j = 0;//当前题目
var sjid = $.cookie("sjid");
var QuestionInput = { s: "StudentAnswer", a: "CorrectAnswer", c: "QuestionCheck", f: "StudentFraction", m: "TCountSorce", l: "0" };

$(document).ready(function (){
	
	 
	//FillStudentAnswer(sjid);
	
	LookWord();
	
	
	
});//.ready的结束标签
//-------------------------------------获得试题函数-----------------------------------------------------


function LookWord()
{
    //$.messager.progress({ text: '正在获取试卷信息' });//获取试卷信息读条
	
	 $.ajax({
        url: Webversion + '/test/list/list_detail', //url访问地址
        type: "GET",
        data: {
            study_exercise_id: sjid //学生试卷ID
        },
        dataType: "json",
        success: function (result)
        {
             StuExerciseAnsInfo = $.evalJSON(Base64.decode(result.study_exercise.content));
			 
			FillStudentAnswer();
		},
		error: function (result)
		{
		 jAlert('系统获取学生答案信息失败！', '温馨提示');
		 return;
		}
	 });
}




var question = null;
var conQuestion = false;


function  FillStudentAnswer(){
// 获取试卷信息
	
    var ifMapping = 0;
    $.ajax({
        type: "GET",
        dataType: "json",
        url: Webversion + "/exam",
        data: { "exercise_id": exercise_id, 'r': $.getRom() },
        success: function (result)
        {
            if (result == null || result.question == null)
            {
                //$.messager.progress('close');
              jAlert('系统获取试卷信息失败！', '温馨提示');
                return;
            }
           question =$.evalJSON(Base64.decode(result.question));
		   
		   var subject_id =$.evalJSON(result.teacher.subject_grade).subject;
		  // alert(subject_id);
		  // alert(JSON.stringify(question));
		   var teacherName = result.teacher.realname;
		   var teacher_id = parseInt(result.teacher.id);
		   var shjTime = result.creat_date;
		   var subjectname = subject_sum(parseInt(subject_id));
		  /* var stu_sour = $.evalJSON($.cookie("UserInfo"));
		   var stu_class = stu_sour.student_class.class_name;
		   var temp = [];
		   $.each(stu_sour.student_class,function(idx,stu_item){
					var subject_temp = parseInt($.evalJSON(stu_item.subject_grade).subject);
					 
					var subject_teacher = parseInt(stu_item.teacher_id);
					 
					 if(subject_temp==parseInt(subject_id)&&subject_teacher==teacher_id){
						temp[idx] = stu_item.class_name;
					}
					
			});
		    alert(temp);*/
		    $('#sjClass').text(subjectname+"  "+teacherName.substring(0,1)+"老师  试卷名称："+shjName+" 上传时间："+shjTime.substring(0,10));
            var param ={"condition":{"objective_score":0,"subjective_score":0}}; //$.evalJSON(result.param);
		
            var htmlContent = '';//外面不需要循环的html字符串
		
            var testUserInfo = { name: '-', grade: '-', subject: '-', teacher: '-', time: '-', level: '-', point: '0' };
			
            testUserInfo.point = 0;
            conQuestion = false; 
			
             conQuestion = (question && question.length > 0);
            if (conQuestion)
            {
                $.each(question, function (i, n)
                { 
					ti_attment(n.id);  //获得附件
                    var objective_anseasetemp = n.objective_answer;
                    var subjective_anseasetemp = n.answer;
					htmlContent +='<div class="tijixie">';
					var flagtemp = (parseInt(n.objective_flag) == 1);
                    if (flagtemp==1)  {param.condition.objective_score=n.score;} else  { param.condition.subjective_score =n.score;}
                    if (flagtemp && n.objective_answer.length > 1)
                    {
                        var filerchar = ['组', '不'];
                        // 对答案进行过滤,组、
                        var lastchartemp = objective_anseasetemp.substr(objective_anseasetemp.length - 1, 1);
                        $.each(filerchar, function (it, n)
                        {
                            if (n == lastchartemp)
                            {
                                objective_anseasetemp = objective_anseasetemp.substr(0, objective_anseasetemp.length - 1);
                                return false;
                            }
                        });
                    }
                    if (flagtemp)
                    {
						htmlContent +='<div class="main_box_3_title"><div class="main_box_3_title_l" id="main_box_3_title_l"><span class="text_005">' + (i + 1) + '</span><span class="text_002">/</span><span class="text_002" id="sjtishu">'+counts+'</span><span class="text_004"> 本题分值：' + param.condition.objective_score + '分</span></div>';
                        //htmlContent += '<div class="main_box_3_cen_2_left_1">本题分值：' + param.condition.objective_score + '分<br />';
                    }
                    else
                    {
						htmlContent +='<div class="main_box_3_title"><div class="main_box_3_title_l" id="main_box_3_title_l"><span class="text_005">' + (i + 1) + '</span><span class="text_002">/</span><span class="text_002" id="sjtishu">'+counts+'</span><span class="text_004"> 本题分值：' + param.condition.subjective_score + '分</span></div>';
                        //htmlContent += '<div class="main_box_3_cen_2_left_1">本题分值：' + param.condition.subjective_score + '分<br />';
                    }
					
                    htmlContent += '<div class="main_box_3_title_r" id="main_box_3_title_r"><a onclick="goods_ti(\''+n.id+'\','+subject_id+',2)">收藏好题</a>&nbsp;&nbsp;<a onclick="erro_ti(\''+n.id+'\','+subject_id+',1)">收藏错题</a>&nbsp;&nbsp;<a class="hf">查看解析</a></div></div><div class="main_box_3_cen"><div class="main_box_3_cen_1" id="main_box_3_cen_1">' + (i + 1) + '、' + n.content+'</div><div class="main_box_3_cen_2_1"><div class="main_box_3_cen_2_left_1">';
                    //htmlContent += '<div style="padding:7px 16px 8px 16px;background-color:#eeeeee;">';
     				
					if (StuExerciseAnsInfo[i].score=="0")//根据这题所得的分数是否为0来判断这个答案是否是正确的
					{
						
					htmlContent += '<span class="text_008"></span><span class="text_006">你的答案：' + StuExerciseAnsInfo[i].answer+' </span>';
						if(n.question_type=="选择题"){ 
					  htmlContent += '<br /><span class="text_008"><img  src="images/ok.png"/></span><span class="text_007">正确答案：<span id="' + QuestionInput.a + n.id + '" >' + objective_anseasetemp + '</span></span><br />';
						 }else{
							 htmlContent +="";
							}
					}
					else
					{
						
					htmlContent += '<span class="text_008"></span><span class="text_006">你的答案：' + StuExerciseAnsInfo[i].answer+' </span>';
						if(n.question_type=="选择题"){ 
					  htmlContent += '<br /><span class="text_008"><img  src="images/ok.png"/></span><span class="text_007">正确答案：<span id="' + QuestionInput.a + n.id + '" >' + objective_anseasetemp + '</span></span><br />';
						}else{
							 htmlContent +="";
							}
					}
                  
					 htmlContent += '</div><div class="main_box_3_cen_2_right_1"><div class="jiexi"></div></div><div stype="clear:both;"></div></div><div id="focus" style="display:none;">'+subjective_anseasetemp+'</div></div></div>';

                    if (flagtemp)
                    {
                        testUserInfo.point += parseInt(param.condition.objective_score);
                    } else
                    {
                        testUserInfo.point += parseInt(param.condition.subjective_score);
                    }
                });
            } 
             htmlContent += '</div>';
      
             $("#main_box_3").html(htmlContent);
			 
			 moves_jixi();
       
        },
        error: function (result)
        {
            $.messager.progress("close");
			jAlert('测评试卷内容信息获取失败！', '温馨提示');
           // $.messager.alert('温馨提示', '测评试卷内容信息获取失败！');
        }

    });
	
}

//查询ti_id的附件

function ti_attment(id){
	var UserInfo = $.evalJSON($.cookie("UserInfo"));
	$.ajax({  
        url: Webversion + "/ticool/user_history/bat?_method=GET&r="+$.getRom(),
        type: "POST",
        dataType: "text",
       data: {
    		"uid": UserInfo.id,
			"ti_id":id    
        },
		beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
        success: function (result)
        { 
			alert(result);
			 
			
		}
    });	

}



//好题添加
	function goods_ti(id,suboj,his_type){
		jConfirm('是否添加好题收藏?', '温馨提示', function(r) {
			if (r==true){
			  LookGoodorerro(10,his_type,id,suboj,1); 
        	}
		});
	}
	

	function erro_ti(id,suboj,his_type){
		jConfirm('是否添加错题收藏?', '温馨提示', function(r) {
			if (r==true){ 	
			   LookGoodorerro(10,his_type,id,suboj,1); 
        	}
		});
	 
	}
//插入好题错题本  收藏错题 
	function ti_ajax(mode_id,mode_subject_id,mode_force,history_type){
		//alert("mode_id:"+mode_id);
		$.ajax({  
        url: Webversion + "/history?_method=PUT&r="+$.getRom(),
        type: "POST",
        dataType: "json",
        data: {
    		"ti_id": mode_id,
			"bookcode":history_type,
    		"subjectid": mode_subject_id,
    		"force": mode_force
        },
		beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
		 
        success: function (result)
        {   
			 
		 	jAlert('收藏成功！', '温馨提示');
			//alert("成功添加：返回值是"+result.flag);
        	//window.location.href="Index.html";
		},
		error: function (result)
		{
		 jAlert('系统插入信息失败！', '温馨提示');
		 //$.messager.alert('温馨提示', '系统插入信息失败！');
		 
		 return;
		}
    });
		
	}
	  
//查询好题错题本数据   history_sum是调用的条数,history_type_id 好题错题的参数  2是好题 1是错题  id是题目的ti_id
function LookGoodorerro(history_sum,history_type_id,id,subid,forces){
    //$.messager.progress({ text: '正在获取试卷信息' });//获取试卷信息读条
	
	 $.ajax({   //获取左边试卷列表
        url: Webversion + '/history/list/0,'+history_sum, //url访问地址
        type: "GET",
        dataType: "json",
		data:{history_type:history_type_id,ti_id:id},
		cache: false,
		beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
        success: function (result) {
		//alert("nhao");
		  
		var str = JSON.stringify(result);
		alert(str);
		//alert("history返回值:----"+result.history);
		 
		 if(result == null ||result.history==null){
			 	    
				  ti_ajax(id,subid,forces,history_type_id);	
				  
			  }else{
				 jAlert('此题目已经添加过！', '温馨提示');
			  } 
		},
		error: function (result)
		{
		 //$.messager.alert('温馨提示', '系统获取好题错题信息失败！');
		 
		 jAlert('系统获取好题错题信息失败！', '温馨提示');
		  
		 return;
		}
		
	 });
}
