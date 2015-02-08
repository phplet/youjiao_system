var UserInfo = $.evalJSON($.cookie("UserInfo"));
var tr_id = "";
$(document).ready(function (){
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	//var UserInfo = $.evalJSON($.cookie("UserInfo"));
	//alert(JSON.stringify(UserInfo));				 
	 
	if(UserInfo!=null&&UserInfo!=undefined){
		tr_id = getUrlParam('tr_id');
		show_report(tr_id);
	}
	 
	
});//.ready的结束标签

//知识点统计
function knowledge_Charts(subject_idT,section_idT,user_idT,knowledge_ids,knowledge_idsT_Names_Temp){
	
	var url_type ='/exercise_query';
	var Qjson = {'action':'exercise_stat_knowledge','subject_id':subject_idT,'section_id':section_idT,'user_id':user_idT,'knowledge_id':knowledge_ids};
	var flag_res = Ajax_option(url_type,Qjson,"GET",false);
	var x_dataTemps = [];
	var seriesTemps_all = [];
	var seriesTemps_my = [];
	 
	$.each(knowledge_idsT_Names_Temp,function(i,n){
		var temp_knowledge_stf = flag_res[n.id];
		if(temp_knowledge_stf!=null&&temp_knowledge_stf!=undefined&&undefined!=""){
			x_dataTemps.push(n.name);
			if(temp_knowledge_stf.my_level!=""&&temp_knowledge_stf.my_level!=null){
				seriesTemps_my.push(parseInt(temp_knowledge_stf.my_level));	
				 
			}else{
				seriesTemps_my.push(0);
			}
			if(temp_knowledge_stf.online_avg_level!=""&&temp_knowledge_stf.online_avg_level!=null){
				seriesTemps_all.push(parseInt(temp_knowledge_stf.online_avg_level));	
				 
			}else{
				seriesTemps_all.push(0);
		}
		}
		
		
	});
	
	$('#knowledge_Charts').highcharts({
            chart: {
                type: 'area',
                spacingBottom: 30
            },
			
            title: {
                text: '知识点在全网掌握度' 
            },
            colors:['#3fbff0','#fccc00'],
           
            xAxis: {
                categories: x_dataTemps
				
            	
			},
            yAxis: {
                title: {
                    text: '掌握度'
                },
				
                labels: {
                    formatter: function() {
                        return this.value+'%';
                    }
                }
            },
			
            tooltip: {
                pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y:,.0f}%</b><br/>',
                shared: true
            },
            plotOptions: {
                area: {
                    fillOpacity: 0.7
					
                }
            },
            credits: {
                enabled: false
            },
            series: [{
                name: '全网掌握度',
                data: seriesTemps_all
            }, {
                name: '你的掌握度',
                data: seriesTemps_my
            }]
        });
}


//题目在全网的正确率
function que_Charts(x_data,series){
	 
	 $('#que_Charts').highcharts({
            chart: {
                type: 'column'
            },
            title: {
                text: '题目在全网正确率'
            },
            legend: {
				enabled: false
        	},
            xAxis: {
                categories: x_data
            },
            yAxis: {
                 
                title: {
                    text: '正确率'
                },
				
                labels: {
                    formatter: function() {
                        return this.value+'%';
                    }
                }
            },
            tooltip: {
                headerFormat: '<span style="font-size:10px">第{point.key}题</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y:.1f} %</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0,
					color: '#3fbff0'
                }
            },
			credits: {
                enabled: false
            },
            series: [{
                name: '正确率',
                data: series
    
            }]
        });
}

//学习能力维度
function ability_Charts(x_data,series){
	
	$('#ability_Charts').highcharts({
	            
	    chart: {
	        polar: true,
	        type: 'line'
			
	    },
	    
	    title: {
	        text: '能力等级' 
	    },
	    colors:['#fd0003'],
	    pane: {
	    	size: '80%'
	    },
	    
	    xAxis: {
	        categories: x_data,
	        tickmarkPlacement: 'on',
	        lineWidth: 0
	    },
	    
	    yAxis: {
			
			gridLineInterpolation: 'polygon',
	        lineWidth: 0,
	        min: 0
	        
	    },
	    
	    tooltip: {
	    	shared: true,
	        pointFormat: '<span style="color:{series.color}">{series.name}: <b>{point.y:,.0f}</b><br/>'
	    },
	     
	    legend: {
	        enabled: false
	    },
	    credits: {
                enabled: false
            },
	    series: [{
			type:'area',
	        name: '能力等级',
	        data: series,
	        pointPlacement: 'on'
	    }]
	
	});

}


//学生信息
function  show_report(tr_idsT){
	var url_type ='/exercise_query';
	var Qjson = {'action':'test_report_detail','trid':tr_idsT};
	var flag_res = Ajax_option(url_type,Qjson,"GET",false);
	 
	if(flag_res.list!=false){
		
		var testjson_Temp = $.parseJSON(Base64.decode(($.parseJSON(flag_res.list)).test_data));
		var test_info_temp = testjson_Temp.test_info;
		var question_listsTemp = testjson_Temp.question_list;
		var ability_listsTemp = testjson_Temp.ablity_list;
		var ping_listsTemp = testjson_Temp.ping_list;
		var person_listsTemp = testjson_Temp.person_list;
		 
		$('#stu_name').html(test_info_temp.stuReal_name);
		$('#subject_name').html(test_info_temp.stusubject_name);
		if(testjson_Temp.person_list.url!=""&&testjson_Temp.person_list.url!=null){
			$('#logo_url').attr("src",testjson_Temp.person_list.url);
		}
		$('#test_name').html(test_info_temp.test_name);
		$('#stuReal_name').html(test_info_temp.stuReal_name);
		$('#stusubject_name').html(test_info_temp.stusubject_name);
		$('#stucreate_date').html(test_info_temp.stucreate_date);
		$('#diffcuty_id').html(test_info_temp.diffcuty_id);
		$('#scores').html(test_info_temp.scores);
		if(test_info_temp.tests_times==0||test_info_temp.tests_times==""){
			$('#tests_times').html('--');
		}else{
			$('#tests_times').html(test_info_temp.tests_times);	
		}
		
		$('#right_sum').html(test_info_temp.right_sum);
		$('#wrong_sum').html(test_info_temp.wrong_sum);
	 	 
		
		var htmls_que = '<tr align="center"><td>题号</td><td>题目</td><td>考查知识点</td><td>难易度</td><td>主客观题</td><td>正确答案</td><td>学生答案</td><td>对错</td><td>全网正确率</td></tr>';
		var que_x_data = [];
		var que_series = [];
		var knowledge_ids = [];
		var knowledge_ids_name = [];
		$.each(question_listsTemp,function(is,ns){
			
			que_x_data.push(parseInt(ns.num));
			if(ns.zh_knowledge!=null&&ns.zh_knowledge!=""&&ns.knowledge_id!=null&&ns.knowledge_id!=""){
				var knowledge_namesTS = remove_comma(ns.zh_knowledge).split(',');
				var knowledge_idsTS = remove_comma(ns.knowledge_id).split(',');
				var temps_nums = 0;
				if(knowledge_idsTS.length>1){
					for(var qit = 0; qit<knowledge_idsTS.length; qit++){
						knowledge_ids.push(knowledge_idsTS[qit]);
						knowledge_ids_name.push({'id':knowledge_idsTS[qit],'name':knowledge_namesTS[qit]});
					}	
				}else{
					knowledge_ids.push(knowledge_idsTS);
					knowledge_ids_name.push({'id':knowledge_idsTS,'name':knowledge_namesTS});
				}
			}else{
				knowledge_ids.push(0);
				knowledge_ids_name.push({'id':0,'name':0});
			}
			if(ns.accuracy_num!='--'){
				que_series.push(parseInt(ns.accuracy_num.split('%')[0]));	
			}else{
				que_series.push(0);
			}
			$('#question_text_contentcut').html(ns.content);
			var nn_content_cut = $('#question_text_contentcut').text();
			if(nn_content_cut.length>20){
				nn_content_cut = $.trim($('#question_text_contentcut').text()).substring(0,20);
			}else{
				nn_content_cut = $.trim($('#question_text_contentcut').text());
			}
			htmls_que += '<tr><td align="center">'+ns.num+'</td><td>'+nn_content_cut+'</td><td>'+ns.zh_knowledge+'</td><td align="center">'+ns.difficulty+'</td><td align="center">'+ns.obj_name+'</td><td>'+ns.que_answer.substring(0,20)+'</td><td>'+ns.stu_answer+'</td><td align="center">'+ns.answer_flag+'</td><td align="center"><span  id="edit_Q_'+ns.id+'">'+ns.accuracy_num+'</span></td></tr>';
			 
		});
		$('#que_list').html(htmls_que);
		 
		que_Charts(que_x_data,que_series);
		
		var knowledge_idsT = unique(knowledge_ids);
		var knowledge_idsT_Names_Temp = [];
		$.each(knowledge_idsT,function(its,nts){
			var temp_nams = '';
			$.each(knowledge_ids_name,function(ic,nc){
				if(nc.id==nts){
					temp_nams = nc.name;
				}	
			});
			knowledge_idsT_Names_Temp.push({'id':nts,'name':temp_nams});
		});
		
		knowledge_Charts(test_info_temp.subject_id,question_listsTemp[0].section_id,test_info_temp.user_id,knowledge_idsT.join(','),knowledge_idsT_Names_Temp);
		 
		if(ability_listsTemp!=null&&ability_listsTemp!=""){
			$('.report_ability').show();
			//能力维度
			var ability_htmls = '<tr><td>能力维度</td><td>选择相应等级</td><td>等级说明</td></tr>';
			var ability_x_data = [];
			var ability_series = [];
			$.each(ability_listsTemp,function(i,n){
				ability_x_data.push(n.ability_name);
				var answer_content = '';
				if(n.answer=='A'){
					ability_series.push(3);
					answer_content = 'A:'+n.a_level;
				}else if(n.answer=='B'){
					ability_series.push(2);
					answer_content = 'B:'+n.b_level;
				}else{
					ability_series.push(1);
					answer_content = 'C:'+n.c_level;
				}
				 
				ability_htmls += '<tr><td>'+n.ability_name+'</td><td>'+n.answer+'</td><td>'+answer_content+'</td></tr>';
			});
			
			$('#ablity_list').html(ability_htmls);
			 
			ability_Charts(ability_x_data,ability_series); //能力度雷达图
		}else{
			$('.report_ability').hide();	
		}
		
		
		var slogan_htmls = '';
		if(ping_listsTemp!=null){
			
			$.each(ping_listsTemp,function(ii,nn){
				if(nn.flag==1){
					slogan_htmls += '<div class="slogan_list_one"><div class="report_type">'+nn.typename+'</div><div class="slogan_content"><div style="padding:20px;">'+nn.content+'</div></div></div>';
				}
				 
			});
		}
		$('#slogan_list').html(slogan_htmls); 
		
		var person_infos = '<div style="padding:20px;"><span class="person_info_L">咨询老师：</span><span class="person_info_R">'+testjson_Temp.person_list.contacts+'</span><br /><span class="person_info_L">联系电话：</span><span class="person_info_R">'+testjson_Temp.person_list.tel+'</span><br /><span class="person_info_L">校区地址：</span><span class="person_info_R">'+testjson_Temp.person_list.address+'</span><br /></div>';
		$('.person_info').html(person_infos);
		
	};
	
	
	 
	 
}



function edit_reports(){
	document.location.href = "./admission_report.html?tr_id="+tr_id;
	
}


//打印预览

function print_reports(oper){
	bdhtml=window.document.body.innerHTML;//获取当前页的html代码
	 
	sprnstr="<!--startprint"+oper+"-->";//设置打印开始区域
	eprnstr="<!--endprint"+oper+"-->";//设置打印结束区域
	prnhtml=bdhtml.substring(bdhtml.indexOf(sprnstr)+18); //从开始代码向后取html
	
	prnhtml=prnhtml.substring(0,prnhtml.indexOf(eprnstr));//从结束代码向前取html
	window.document.body.innerHTML=prnhtml;
	
	var hkey_root,hkey_path,hkey_key;
    hkey_root="2";
    hkey_path="1"; 
	
	pagesetup_default(hkey_root,hkey_path,hkey_key);
	pagesetup_null(hkey_root,hkey_path,hkey_key);
	window.print();
	window.document.body.innerHTML=bdhtml;	
	
}

//网页打印时清空页眉页脚
    function pagesetup_null(hkey_root,hkey_path) {
        try {
            var RegWsh = new ActiveXObject("WScript.Shell")
            hkey_key = "header"
            RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "")
            hkey_key = "footer"
            RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "")
        } catch (e) {}
    }

function pagesetup_default(hkey_root,hkey_path) {
        try {
            var RegWsh = new ActiveXObject("WScript.Shell")
            hkey_key = "header"
            RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "&w&b页码，&p/&P")
            hkey_key = "footer"
            RegWsh.RegWrite(hkey_root + hkey_path + hkey_key, "&u&b&d")
        } catch (e) {
        }
    }