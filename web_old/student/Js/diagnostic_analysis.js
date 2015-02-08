var UserInfo = {};
var section_idT = 3;
var selectSubjectID = 1;  
var editors = [];
var question_lists = [];
var question_listsTemp = [];
$(document).ready(function(){
 
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	if(UserInfo!=null&&UserInfo!=undefined){
		var nick =  UserInfo.nick;
			 
		if (UserInfo.realname != null&&UserInfo.realname!="") {
				$('#headusername').text(UserInfo.realname);
		}else if(nick!=null&&nick!=""){
				$('#headusername').text(nick);
		}
		section_idT = grade_ch_section(UserInfo.grade_id);
	 	
	    if(section_idT==2||section_idT==3){
			 
			//监听点击左侧导航
			$(document).delegate('.nav_element','click',function(){
				
				selectSubjectID = $(this).attr('subject_id');
				 
				$(this).parent().children().each(function(ii, es){
					$(es).attr('class','nav_element');
				});
				$(this).addClass('active_nav');
				$('.content_center_test_kn').hide();
				$('.content_center_test_xxzb').hide();
				$('.content_center').show();
				
				//省份赋值  
				knowLedge_json(selectSubjectID); 
				
			});
			
			//初始化成功后，建立专题列表
			var pageType = 'zhuanti';
			exerciseHandler.query('nav' , {type:pageType,'section_id':section_idT} , function(flag , data){
				var label = {'zhenti':'真题','zhuanti':''};
				if(flag){
					for(var i in data.subject){
		//							console.log(data.subject[i]);
						$('#nav_element_template').clone().html('<span class="disp_s"><span class="tongbu_span icon_33_33 web_icon_'+data.subject[i].subject_id+'_33"></span><span class="tongbu_span">&nbsp;'+data.subject[i].grade_name+''+data.subject[i].subject_name+label[pageType]+'</span><span class="cleard"></span></span>')
							.appendTo('.content_left').attr({'id':null,'subject_id':data.subject[i].subject_id}).show();
							$(".content_left div").eq((i+1)).addClass();
					}
					
					$(".content_left div").eq(1).click();
					
				}else{
					layer.alert('初始化失败！', 8,'温馨提示');
					 
				}
			});
			
		}else{
			layer.alert('初中,高中才有诊断分析!',9,'温馨提示',function(){
			  window.location.href = 'Index.html';	
		   });	
		}
		 
	}else{
		window.location.href = "../index.html";
	} 	  
	
	
	
});



function  knowLedge_json(sub_id){
	$('#subject_name_s').html(subject_sum(sub_id));
	var url_type = '/exercise_query?r='+$.getRom(); 
    var Qjson = {'action':'exercise_stat_zhuanti','subject_id':sub_id,'section_id':section_idT,'user_id':UserInfo.id};
    var result  = Ajax_option(url_type,Qjson,"GET",false);
	if(result.list!=null&&result.list!=""&&result.list!=false){
		$('.no_img').hide();
		$('.master_coordinates').css("display","block");
		$('.generate_figure').css("display","block");
		$('.caption').css("display","block");
		var x_data = [];
		var series = [];	
		$.each(result.list,function(i,n){
			x_data.push(n.zhuanti_name);
			var float_y = parseFloat(100-parseFloat(n.question_wrong_count)*100/parseFloat(n.question_do_count));
			var color_num = '#848383';
			if(float_y>=85){
				color_num = '#19c34e';
			}else if(float_y<85&&float_y>=70){
				color_num = '#229dcb';
			}else if(float_y<70&&float_y>=0){
				color_num = '#d92d7a';
			}else{
				color_num = '#848383';
			}
			 
			if(float_y==0){
				 float_y = float_y+1;	
			}
			series.push({name:n.zhuanti_name,color:color_num,y:float_y,list:n.knowledge_list,zid:n.zhuanti_id});
		});
		var counts = result.list.length;
		var page_num = 2;
		var pages = counts/page_num;
		var residue_nums = counts%page_num;
		if(residue_nums!=0){
			pages = pages+1;
		}
		
		$('#pre_on').click(function(){
			var pre_num_1 = $('#pre_on').attr("num");
			var next_num_1 = $('#next_on').attr("num");
			if(pre_num_1!=0){
				$('#pre_on').attr("num",(parseInt(pre_num_1)-1));
				$('#next_on').attr("num",(parseInt(next_num_1)-1));
				$('.page_Content').html('第'+pre_num_1+'页');
				
			}
			
		});
		
		$('#next_on').click(function(){
			var pre_num_2 = $('#pre_on').attr("num");
			var next_num_2 = $('#next_on').attr("num");
			if(parseInt(pages)>(parseInt(next_num_2)-1)){
				$('#pre_on').attr("num",(parseInt(pre_num_2)+1));
				$('#next_on').attr("num",(parseInt(next_num_2)+1));
				$('.page_Content').html('第'+next_num_2+'页');
				 
			}
		});
		
		knowledge_Charts(x_data,series);
		knowledge_list(series[0].list,series[0].zid);
		//knowledge_Charts(x_data,series);
		
		
	}else{
		$('#knowledge_Charts').html("");
		$('.set_list_ul ul').html("");
		$('.master_coordinates').css("display","none");
		$('.generate_figure').css("display","none");
		$('.caption').css("display","none");
		$('.no_img').show();
		
	}
	
}

//知识点统计
function knowledge_Charts(x_data,series){
	 
	 //#19c34e   #229dcb  #d92d7a  #848383
	$('#knowledge_Charts').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '“题酷”练习掌握度统计表'
            },
			
            legend: {
				enabled: false
        	},
            xAxis: {
                categories: x_data
			   //categories: ['0','10','30','50','80','100']
            },
            yAxis: {
                tickPositions: [0,10,20,30,40,50,60,70,80,90,100], 
                title: {
                    text: '掌握度(%)'
                },
				
                labels: {
                    formatter: function() {
                        return this.value+'%';
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
					 
                },
				
				series: {
					cursor: 'pointer',
					events: {
							click: function(e) {
								//location.href = e.point.url;
								knowledge_list(e.point.list,e.point.zid);
							}
					}
			 	}
            },
			credits: {
                enabled: false
            },
            series: [{
                name: '掌握度',
                data: series
    
            }]
        }); 
             
}

function knowledge_list(kno_list,zid){
	if(kno_list!=false&&kno_list!=null&&kno_list!=""){
		var html_kno = '';
		$.each(kno_list,function(i,n){
			var question_wrong_count = n.question_wrong_count;
			var question_do_count = n.question_do_count;
			var float_y = 0;
			 
			if(question_wrong_count==null){
				question_wrong_count = 0;	
			}
			if(question_do_count==null){
				question_do_count =0;	
			}
			 
			if(question_do_count==null||question_do_count==0){
				float_y = 0;
			}else{
				float_y = parseInt(100-parseFloat(question_wrong_count)*100/parseFloat(question_do_count));
				 
			}
			 
			var color_num = '';
			
			if(float_y>=85){
				html_kno += '<li><img src="images/03_green.png"  /> <a href="javascript:void(0)" onClick="select_konwLs('+n.konwledge_id+',\''+n.knowlege_name+'\','+zid+');" title="'+n.knowlege_name+'">'+n.knowlege_name+'</a></li>';
			}else if(float_y<85&&float_y>=70){
				html_kno += '<li><img src="images/03_blue.png"  /> <a href="javascript:void(0)" onClick="select_konwLs('+n.konwledge_id+',\''+n.knowlege_name+'\','+zid+');"  title="'+n.knowlege_name+'">'+n.knowlege_name+'</a></li>';
			}else if(float_y<70&&float_y>0){
				html_kno += '<li><img src="images/03_red.png" /> <a href="javascript:void(0)" onClick="select_konwLs('+n.konwledge_id+',\''+n.knowlege_name+'\','+zid+');"  title="'+n.knowlege_name+'">'+n.knowlege_name+'</a></li>';
			}else{
				html_kno += '<li><img src="images/03_gray.png" /> <a href="javascript:void(0)" onClick=""  title="'+n.knowlege_name+'">'+n.knowlege_name+'</a></li>';
			}
			 
		});
		 		
		$('.set_list_ul ul').html(html_kno);
	}else{
		$('.set_list_ul ul').html("");
	}
	
}


function select_konwLs(konws_id,konws_name,zidT){
	$('.content_center_test_kn').show();
	$('.content_center').hide();
	$('.content_center_test_xxzb').hide();
	
	$(".title_box h3").click(function() {
		$(this).addClass("now_focus");
		$(this).siblings().removeClass("now_focus");
		var $dangqian = $(".con_box > span").eq($(".title_box h3").index(this));
		$dangqian.addClass("now_focus");
		
		$dangqian.siblings().removeClass("now_focus");
		 
		if($(this).text()=='我的分析'){
			my_Fenxi(konws_id,konws_name); 
			
		}else if($(this).text()=='真题扫描'){
			zhenti_lists(konws_id,konws_name);	
		}else if($(this).text()=='再来五题'){
			
			zhuanti_lists(konws_id,konws_name,zidT);		
		}
	});
	
	 my_Fenxi(konws_id,konws_name);
	
}

function zhenti_lists(konws_idsT,konws_nameT){
	
	var url_type = '/exercise_query?r='+$.getRom();
	var Qjson = {'action':'exercise_rand_zhenti','dbtype':1,'knowledge_id':konws_idsT,'subject_id':selectSubjectID,'section_id':section_idT,'user_id':UserInfo.id,'question_count':5};
	var result  = Ajax_option(url_type,Qjson,"GET",false);	
	$('.kno_title').html('考点：'+konws_nameT);
	if(result.list!=null&&result.list!=""){
		var zhen_listsTemp = '';
		for(var ii = 0; ii<result.list.length; ii++){
			var data_T = result.list[ii];
			var data_zt_name = cutString(data_T.name, 50);
			var data_zt_nameT = '';
			if(data_zt_name.cutflag==1){
				data_zt_nameT = data_zt_name.cutstring+'...';
			}else{
				data_zt_nameT = data_zt_name.cutstring;
			}
			zhen_listsTemp += '<li><div class="ti_line">'+(ii+1)+'.'+data_T.gid+' <font color="#CCCCCC"> (来源：'+data_zt_nameT+')</font></div><div class="ti_content">'+data_T.content+'</div><div class="jiexi_bg"><a onClick="jiexi_show(this);">查看解析</a>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="sel_goods(2,\''+data_T.gid+'\','+parseInt(data_T.subject_id)+',2,'+data_T.dbtype+','+parseInt(data_T.section_id)+');">收藏好题</a></div><div class="jiexi_show" style="display:none;"><div class="jiexi_bg_title">试题解析：</div><div class="jiexi_content">'+data_T.answer+'</div></div></li>';
		}
		$('#zhenti_lists').html(zhen_listsTemp);
	}
}

function zhuanti_lists(konws_idsT,konws_nameT,zidTemp){
	editors = [];
	question_lists = [];
	$('.my_zhuanti ul').html("");
	$('.my_zhuanti').attr('zid',zidTemp); 
	$('#save_juan').show(); 
	$('#save_juan').text('交卷'); 
	var url_type = '/exercise_query?r='+$.getRom();
	var Qjson = {'action':'exercise_rand_ti','dbtype':1,'knowledge_id':konws_idsT,'subject_id':selectSubjectID,'section_id':section_idT,'user_id':UserInfo.id,'question_count':5};
	var result  = Ajax_option(url_type,Qjson,"GET",false);	
	$('.knoZ_title').html('知识点：'+konws_nameT);
	if(result.list!=null&&result.list!=""){
		question_lists = result.list;
		for(var ii = 0; ii<result.list.length; ii++){
			var datasT = result.list[ii];
			var zhen_listsTemp = '';
			 
			//zhen_listsTemp += '<li><div class="ti_line">'+(ii+1)+'.'+data_T.gid+' <font color="#CCCCCC"> (来源：'+data_zt_nameT+')</font></div><div class="ti_content">'+data_T.content+'</div><div class="jiexi_bg"><a onClick="jiexi_show(this);">查看解析</a></div><div class="jiexi_show" style="display:none;"><div class="jiexi_bg_title">试题解析：</div><div class="jiexi_content">'+data_T.answer+'</div></div></li>';
			if(datasT.type_name!='选择题'){
				zhen_listsTemp = '<li><div class="ti_line">'+(ii+1)+'.'+datasT.gid+' (题型：'+datasT.type_name+')</div><div class="ti_content">'+datasT.content+'</div><div class="my_answers"><textarea id="queid_'+datasT.gid+'" name="content" style="width:730px;height:300px;"></textarea></div><div style="display:none;" id="my_main_answers_'+ii+'" class="my_main_answersCss"><div id="obj_answer_X_'+ii+'">本题结果: <input type="radio" value="1" name="subjective_check'+ii+'" /> √&nbsp; <input type="radio" value="0" name="subjective_check'+ii+'" /> ×&nbsp;</span></div><div>参考答案：<span id="obj_answer_Y_'+ii+'"></span></div><div>你的答案：<span id="obj_answer_Z_'+ii+'"></span></div></div></li>';
				$('.my_zhuanti ul').append(zhen_listsTemp);	
				
				editors[ii] = KindEditor.create('#queid_'+datasT.gid);
				
			}else{
				zhen_listsTemp = '<li><div class="ti_line">'+(ii+1)+'.'+datasT.gid+' (题型：'+datasT.type_name+')</div><div class="ti_content">'+datasT.content+'</div><div class="my_answers">选择答案：<input type="radio" name="queid_'+datasT.gid+'" value="A" /> A&nbsp;<input type="radio" name="queid_'+datasT.gid+'" value="B" /> B&nbsp;<input type="radio" name="queid_'+datasT.gid+'" value="C" /> C&nbsp;<input type="radio" name="queid_'+datasT.gid+'" value="D" /> D</div><div style="display:none;" id="my_main_answers_'+ii+'" class="my_main_answersCss"><div>本题结果: <span id="obj_answer_X_'+ii+'">√</span></div><div>参考答案：<span id="obj_answer_Y_'+ii+'"></span></div><div>你的答案：<span id="obj_answer_Z_'+ii+'"></span></div></div></li>';
				$('.my_zhuanti ul').append(zhen_listsTemp);	
			}
			
			
		}
		 
		
	}else{
		$('#save_juan').hide();	
	}
}


function save_zhuanti(){
	question_listsTemp = [];
	var text_save = $('#save_juan').text();
	if(text_save=='交卷'){
		
		for(var ij in question_lists){
			var datasTs = question_lists[ij];
			$('#my_main_answers_'+ij).prev('div').hide();
			$('#my_main_answers_'+ij).show();
			if(datasTs.type_name!='选择题'){
				$('#obj_answer_Y_'+ij).html(datasTs.answer);
				$('#obj_answer_Z_'+ij).html(editors[ij].html());
			}else{
				 
				var radio_value = $('.my_answers input[name="queid_'+datasTs.gid+'"]:checked').val();
				if(datasTs.objective_answer==radio_value){
					$('#obj_answer_X_'+ij).text('√');
				}else{
					$('#obj_answer_X_'+ij).text('×');	
				}
				$('#obj_answer_Y_'+ij).html(datasTs.answer);
				$('#obj_answer_Z_'+ij).html(radio_value);	
			}
		}
		$('#save_juan').text('提交');	
		
	}else if(text_save=='提交'){
		
		var ringt_lv = 0;
		var wrong_lv = 0;
		var wrong_ids = '';
		var question_idsT = [];
		var content = [];
		var scores = 0;
		var score = 0;
		
		for(var iq in question_lists){
			var datasTs = question_lists[iq];
			var flag_value = 1;   // 0  1  是主观题的错和对   true  false 是客观题的对和错
			var user_answers = '';
			question_idsT.push(datasTs.gid);
			if(datasTs.type_name!='选择题'){
				var radio_obj = $('#obj_answer_X_'+iq+' input[name="subjective_check'+iq+'"]:checked').val();
				if(radio_obj){
					flag_value = radio_obj;	
				}else{
					flag_value = 1;
					layer.alert('主观题还有未判定的!',8,'温馨提示');
					return;
				} 
			}else{
				if($('#obj_answer_X_'+iq).text()=='√'){
					flag_value = true; 
				 }else{
					flag_value = false; 
				 } 
			}
			content.push({
				answer : user_answers,
				id : datasTs.gid,
				obj : datasTs.objective_flag,
				score : datasTs.score,
				dbtype : datasTs.dbtype,
				flag:flag_value
				
			});
			scores += parseInt(datasTs.score);
			if(flag_value){
				score += parseInt(datasTs.score);
				ringt_lv ++;
			}else{
				wrong_ids += datasTs.gid+',';
				wrong_lv ++;
			}
			
		}
		
		if(wrong_ids!=""){
			sel_goods(1,wrong_ids.substring(0,wrong_ids.length-1),selectSubjectID,2,question_lists[0].dbtype,grade_ch_section(UserInfo.grade_id));
		}
		var examResult = {}; 
		examResult.dbtype = question_lists[0].dbtype? question_lists[0].dbtype:1;
		examResult.content = content;
		examResult.my_score = parseFloat((score/scores)*100).toFixed(2);
		examResult.section_id = section_idT;
		examResult.type = 2;        //2已提交   试卷状态   1.正在做 
		examResult.exam_type = 8;  //  1.作业/测试 2. 专题  3. 真题 4.名校 5 同步 6 入学测试    7步调学习  8诊断分析
		examResult.exercise_id = $('.my_zhuanti').attr('zid');
		examResult.subject_id = selectSubjectID;  // 
		examResult.exam_content = question_idsT;  //ids  题目
		
		var url_type = '/exercise_post?r='+$.getRom();
		var Qjson = {'action':'saveExamResult','data':JSON.stringify(examResult)};
		var result  = Ajax_option(url_type,Qjson,"POST",false);	
		if(result.flag){
			$('.title_box h3').eq(0).click();
		}
			
	}	
}


function jiexi_show(cssid){
	var text_name = $(cssid).text();
	if(text_name=='查看解析'){
		$(cssid).parent().next().show();
		$(cssid).text('收起解析');	
	}else{
		$(cssid).text('查看解析');	
		$(cssid).parent().next().hide();	
	}
	
}


function my_Fenxi(konws_ids,konws_names){
	
	var url_type = '/exercise_query?r='+$.getRom();
	var Qjson = {'action':'exercise_stat_knowledge','knowledge_id':konws_ids,'subject_id':selectSubjectID,'section_id':section_idT,'user_id':UserInfo.id};
	var result  = Ajax_option(url_type,Qjson,"GET",false);
	$('#kno_type_name').text(konws_names);
	if(result!=null&&result.list!=null){
		
		var jsons = result.list;
		var diff_jsons = [];
		var type_jsons = [];
		
		for(var i =0 ; i<jsons.length;i++){
			var q_i = 0;
			var qm_i = 0;
			for(var j =0 ; j<diff_jsons.length;j++){
				if(jsons[i].difficulty==diff_jsons[j].difficulty){
					//diff_jsons[j].count_Bfb = parseFloat(100-parseInt((parseInt(diff_jsons[j].wrong_count)+parseInt(jsons[i].question_wrong_count))*100/(parseInt(diff_jsons[j].count)+parseInt(jsons[i].question_do_count)))).toFixed(2);
					diff_jsons[j].count = parseInt(diff_jsons[j].count)+parseInt(jsons[i].question_do_count);
					diff_jsons[j].wrong_count = parseInt(diff_jsons[j].wrong_count)+parseInt(jsons[i].question_wrong_count);
					diff_jsons[j].count_Bfb = 100.00-parseFloat(parseInt(diff_jsons[j].wrong_count)*100/parseInt(diff_jsons[j].count)).toFixed(2);
					q_i++;
				}	
			}
			for(var k =0 ; k<type_jsons.length; k++){
				if(jsons[i].type_name==type_jsons[k].type_name){
					
					
					type_jsons[k].count = parseInt(type_jsons[k].count)+parseInt(jsons[i].question_do_count);
					type_jsons[k].wrong_count = parseInt(type_jsons[k].wrong_count)+parseInt(jsons[i].question_wrong_count);
					type_jsons[k].count_Bfb = 100.00-parseFloat(parseInt(type_jsons[k].wrong_count)*100/parseInt(type_jsons[k].count)).toFixed(2);
					qm_i++;
				}		
			}
			var count_Bfb = parseFloat(100-(parseInt(jsons[i].question_wrong_count)*100/parseInt((jsons[i].question_do_count)))).toFixed(2);
			if(q_i==0){
				
				diff_jsons.push({'difficulty':jsons[i].difficulty,'count':jsons[i].question_do_count,'wrong_count':jsons[i].question_wrong_count,'count_Bfb':count_Bfb});	
			}
			if(qm_i==0){
				 
				type_jsons.push({'type_name':jsons[i].type_name,'count':jsons[i].question_do_count,'wrong_count':jsons[i].question_wrong_count,'count_Bfb':count_Bfb});	
			}
			
			
		}
		
		//console.log(JSON.stringify(diff_jsons)+'---'+JSON.stringify(type_jsons));
		var x_data_D = [];
		var series_D = [];
		var x_data_Q = [];
		var series_Q = [];
		
		if(diff_jsons!=""){
			for(var ii=0; ii<diff_jsons.length;ii++){
				x_data_D.push(difficty_nums(parseInt(diff_jsons[ii].difficulty)));	
				var color_nums = '#848383';
				var float_y = parseFloat(diff_jsons[ii].count_Bfb);
				if(float_y>=85.00){
					color_nums = '#19c34e';
				}else if(float_y<85.00&&float_y>=70.00){
					color_nums = '#229dcb';
				}else if(float_y<70.00&&float_y>0){
					color_nums = '#d92d7a';
				}else{
					color_num = '#848383';
				}
				series_D.push({name:difficty_nums(parseInt(diff_jsons[ii].difficulty)),y:float_y,color:color_nums});
			}	
		}
		if(type_jsons!=""){
			for(var jj=0; jj<type_jsons.length;jj++){
				x_data_Q.push(type_jsons[jj].type_name);
				var color_numsT = '#848383';
				var float_yT = parseFloat(type_jsons[jj].count_Bfb);
				if(float_yT>=85.00){
					color_numsT = '#19c34e';
				}else if(float_yT<85.00&&float_yT>=70.00){
					color_numsT = '#229dcb';
				}else if(float_yT<70.00&&float_yT>0){
					color_numsT = '#d92d7a';
				}else{
					color_numsT = '#848383';
				}
				series_Q.push({name:type_jsons[jj].type_name,y:float_yT,color:color_numsT});	
			}		
		}
		 
		charts_dff_type('diff_charts',x_data_D,series_D);
		 
		charts_dff_type('questions_charts',x_data_Q,series_Q);	
		
	}
	if(result!=null&&result[konws_ids]!=null){
		var daoti_nums = result[konws_ids];
		$('#wzques_charts').text(parseInt(daoti_nums.my_question_do_count)+'道');
		$('#qwquesmax_charts').text(parseInt(daoti_nums.max_question_do_count)+'道');
		$('#qwquesavg_charts').text(parseInt(daoti_nums.avg_question_do_count)+'道');
		if(daoti_nums.online_total_count!=null&&daoti_nums.online_total_count!=0){
			$('#quemy_bfb').css("width",parseInt(daoti_nums.my_question_do_count)*100/parseInt(daoti_nums.online_total_count)+'%');
			$('#quemax_bfb').css("width",parseInt(daoti_nums.max_question_do_count)*100/parseInt(daoti_nums.online_total_count)+'%');
			$('#queavg_bfb').css("width",parseInt(daoti_nums.avg_question_do_count)*100/parseInt(daoti_nums.online_total_count)+'%');	
		}else{
			$('#quemy_bfb').css("width","0%");
			$('#quemax_bfb').css("width","0%");
			$('#queavg_bfb').css("width","0%");
		}
		
	 
		myChartload('myChart_nums',parseFloat(daoti_nums.my_level).toFixed(0),parseInt(100-parseFloat(daoti_nums.my_level).toFixed(0)));
		$('#myChart_nums_status').text(parseFloat(daoti_nums.my_level).toFixed(0)+'%');
		myChartload('myChart_max',parseFloat(daoti_nums.online_max_level).toFixed(0),parseInt(100-parseFloat(daoti_nums.online_max_level).toFixed(0)));
		$('#myChart_max_status').text(parseFloat(daoti_nums.online_max_level).toFixed(0)+'%');
		myChartload('myChart_avg',parseFloat(daoti_nums.online_avg_level).toFixed(0),parseInt(100-parseFloat(daoti_nums.online_avg_level).toFixed(0)));
		$('#myChart_avg_status').text(parseFloat(daoti_nums.online_avg_level).toFixed(0)+'%');
		
		
	}
	
	//#19c34e   #229dcb  #d92d7a  #848383
	 
}

//难易度  题型统计表
function charts_dff_type(cssids,x_data,Qseries){
	
	$('#'+cssids).highcharts({
			chart: {
                type: 'column'
            },
			legend: {
				enabled: false
        	},
            title: {
                text: ''
            },
             
            xAxis: {
                categories:x_data
            },
            yAxis: {
				tickPositions: [0,20,40,60,80,100], 
                min: 0,
                title: {
                    text: '正确率(%)'
                }
            },
            tooltip: {
                headerFormat: '<div style="font-size:10px">{point.key}</div><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>'
				 
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                }
            },
			credits: {
                enabled: false
            },
            series: [{
                name: '正确率',
                data: Qseries
            }]
		 
        }); 
	
}



//环状统计图
function myChartload(cssid,kn_zwd,wrong_kn){
	 
	var doughnutData = [ 
			{
				value : parseInt(wrong_kn),
				color : "#e7e7e7"
			},
			{
				value : parseInt(kn_zwd),
				color : "#43b6de"
			}
		
		];
		
	var optionst = {segmentStrokeWidth:1,animationSteps :50,percentageInnerCutout :80,segmentStrokeColor : "#eeebe5"};

	//var myDoughnut = new Chart(document.getElementById("canvas").getContext("2d")).Doughnut(doughnutData);
	var myDoughnut = new Chart($("#"+cssid).get(0).getContext("2d")).Doughnut(doughnutData,optionst);
}

function back_index(){
	var subjes = $(".active_nav").attr('subject_id');
	$(".content_left div").eq(parseInt(subjes)).click();		
}


function coordinate_a(){
	
	$('.content_center_test_kn').hide();
	$('.content_center').hide();
	$('.content_center_test_xxzb').show();
	coordinate(30);
}

//我的学习坐标  分为最近一月 最近三月 最近半年 最近一年 day_num  30,90,180,360
function coordinate(day_num){
	 var url_type = '/exercise_query?r='+$.getRom();
	 var Qjson = {'action':'exercise_stat_subject','subject_id':selectSubjectID,'section_id':section_idT,'user_id':UserInfo.id,'day_num':day_num};
	 var result  = Ajax_option(url_type,Qjson,"GET",false);
	 if(result.list!=null){
		var x_datas = [];
		var zwd_datas = [];
		var zts_datas = [];
		 
		question_ls = result.list;
	 	for(var ij in result.list){
			var resdoque_list = result.list[ij];		
			x_datas.push(resdoque_list.day);
			var right_Bfb = 0;
			var right_nums = parseInt(resdoque_list.question_do_count)-parseInt(resdoque_list.question_wrong_count);
			if(resdoque_list.question_do_count!=0){
				right_Bfb = parseFloat(100*(parseInt(resdoque_list.question_do_count)-parseInt(resdoque_list.question_wrong_count))/parseInt(resdoque_list.question_do_count)).toFixed(1);	
			}
			
			zwd_datas.push({y:right_nums,type:'%',y_B:right_Bfb});
			zts_datas.push({y:parseInt(resdoque_list.question_do_count),type:'道',y_B:parseInt(resdoque_list.question_do_count)});
		}
		charts_coordinate(x_datas,zwd_datas,zts_datas);
	 }
	
	 
	 
}


function charts_coordinate(x_datas,yzwd_datas,yzts_datas){
	
	$('#coordinate_charts').highcharts({
            title: {
                text: '',
                x: -20 //center
            },
            subtitle: {
                text: '',
                x: -20
            },
            xAxis: {
                categories: x_datas
            },
            yAxis: {
                title: {
                    text: '做题数(道)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y_B:.1f} {point.type}</b></td></tr>',
                footerFormat: '</table>'
            },
			credits: {
                enabled: false
            },
            legend: {
                
                align: 'center',
                verticalAlign: 'top',
                borderWidth: 0
            },
            series: [{
					name: '正确率(%)',
					color:'#0589a9',
					data: yzwd_datas
				}, {
					name: '做题数(道)',
					color:'#33cc99',
					data: yzts_datas
				}]
        });	
	
}

 



