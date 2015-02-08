var UserInfo = null;  //账号基本信息
var centerAll = null; //学校、校区 id
var pager = "";
var grade_s = [];
var subject_s = [];
 	
$().ready(function () {
	
   UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
   centerAll = $.evalJSON($.cookie("centerAll")); //取得校区、 学校信息	
   var  tabs_name = $('.tabs-title', window.parent.document);	  //获得iframe父页面的节点内容
	  if((tabs_name.html())!="测评派送"){
	  	tabs_name.html('测评派送');   //赋值
		// $('document').KeyInput($("#SchoolText"), '请输入姓名');
   }
   var tempcolumns = [[
   			{ field: 'test_name', title: '试卷名称', width: 100, sortable: true, align: 'center'},
             
			{ field: 'stu_names', title: '班级/学生', width: 80, sortable: true, align: 'center',formatter: function (value, row, index) {
                   return '<a onclick="getStunames(\''+Base64.encode(value)+'\','+row.assign_id+');">查看</a>';
                }
			},
			
			{ field: 'subject_id', title: '学科', width: 40, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    return subject_sum(parseInt(value));  
				}
            },
			{ field: 'grade', title: '年级', width: 80, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    return edu_grade(parseInt(value));
				}
            },
            { field: 'test_mode', title: '形式', width: 40, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    if (value == 1) {return "测试";} else {return "作业";}
				}
            },
            { field: 'test_type', title: '组卷类型', width: 80, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                    if (value == 0) { return "智能组卷";} else {return "手动挑题";}
                }
            },
			{ field: 'test_analysis', title: '试题统计分析', width: 180, align: 'left'},
			{ field: 'creat_date', title: '派送时间', width: 80, sortable: true, align: 'center'},
			{ field: 'content', title: 'content', width: 130, hidden: true, align: 'center'},
			{ field: 'conditions', title: 'conditions', width: 130, hidden: true, align: 'center'},
			{ field: 'assign_id', title: 'assign_id', width: 130, hidden: true, align: 'center'}
			
			/*,
			{ field: 'id', title: '操作', width: 180,  align: 'center', //是判断再次发送
			    formatter: function (value, row, index) {
						return '<a href="#" onclick="LookSend(' + index + ')" style="color:blue;">查看详情</a>';  
			    }
			} */
        ]];
	 
	var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val();
	var url = 'Webversion + "/assign?pageno="+pageNumber+"&countperpage="+pageSize';
	 
	var datacc = {'action':'list','condition':'center_id^'+centerAll.center_id+'$zone_id^'+select_zoneid};
	if(UserInfo.level==4){
		datacc['user_id'] = UserInfo.id;
	}
	var functionres = 'Longding(result);';
		
	//加载列表  并且返回pager
    pager = datagridLoad('#sendlists',true,'#SerToolBar',tempcolumns,url,"GET","json",datacc,functionres) ;
	 
	setselects(grade_s,subject_s);  //更新下拉列表内容
	
	$('#grade').combobox({
		onChange:function(news_values,old_values){
			if(news_values!='请选择'){
				var datacc1 = {'action':'list','condition':'center_id^'+centerAll.center_id+'$zone_id^'+select_zoneid+'$grade^'+news_values,'user_id':UserInfo.id};
				pager = datagridLoad('#sendlists',true,'#SerToolBar',tempcolumns,url,"GET","json",datacc1,functionres) ;
			}
		}	
	});
	
	 
	
	$('#test_type').combobox({
		onChange:function(news_values,old_values){
			if(news_values!='请选择'){
				var datacc3 = {'action':'list','condition':'center_id^'+centerAll.center_id+'$zone_id^'+select_zoneid+'$build_type^'+news_values,'user_id':UserInfo.id};
				pager = datagridLoad('#sendlists',true,'#SerToolBar',tempcolumns,url,"GET","json",datacc3,functionres) ;
			}
		}	
	});
	
	$('#mouth').combobox({
		onChange:function(news_values,old_values){
			if(news_values!='请选择'){
				var datacc4 = {'action':'list','date':'time','condition':'center_id^'+centerAll.center_id+'$zone_id^'+select_zoneid,'interval':news_values,'user_id':UserInfo.id};
				pager = datagridLoad('#sendlists',true,'#SerToolBar',tempcolumns,url,"GET","json",datacc4,functionres) ;
			}
		}	
	});
  
});

//查看学生姓名
function getStunames(stuvalues,assid){
	
	$('#win').window({
		title:"学生列表",
		width:400,
		height:300,
		modal:true,
		onOpen:function(){
			$('#win').html('<div style="padding:10px;">'+Base64.decode(stuvalues)+'</div>');
			var url_typeas = '/assign';
			var Qjsonas = {'action':'get_students_paper_info','assign_id':assid};
			var reasd = Ajax_option(url_typeas,Qjsonas,"GET");
			
			$.each(reasd.list,function(i,n){
				
				if(parseInt(n.type)==3){
					$('#class_'+n.class_id+' .stu_'+n.user_id).html(n.my_score+'分');
				}else if(parseInt(n.type)==2){
					$('#class_'+n.class_id+' .stu_'+n.user_id).html('未批');
				}else if(parseInt(n.type)==1){
					$('#class_'+n.class_id+' .stu_'+n.user_id).html('未做');
				}else if(parseInt(n.type)==4){
					$('#class_'+n.class_id+' .stu_'+n.user_id).html('正做');
				}
			
			});
		}
	});
}

// 查看派送列表
function Longding(result){
	if (result.list != null) {
		var datalistTemp = [];
		
		grade_s = [];
		subject_s = [];
		$.each(result.grade_list,function(ii,nn){
			if(nn.grade!=null&&nn.grade!=""&&nn.grade!=21){
				grade_s.push(parseInt(nn.grade));
			}
		});
		
		$.each(result.list, function (i, n) {
			var itemtemp = {};
			  // class_name   stu_names  test_name  subject_id  test_mode  test_type  test_analysis
			var stuhtml = "";
			if(n.assign_to!=null){
				$.each($.parseJSON(decodeURIComponent(n.assign_to)),function(ii,nn){
					stuhtml += '<div style="line-height:20px;color:#333;">'+nn.class_name+'</div><div style="line-height:20px;" id="class_'+nn.class_id+'">';
					$.each(nn.stu_ids,function (iii,nnn){
						stuhtml += '<span style="width:120px; float:left; color:#333;">'+(iii+1)+'、'+ decodeURIComponent(nnn.stu_name)+'&nbsp;(<span class="stu_'+nnn.stu_id+'"></span>)&nbsp;</span>'
					});
					stuhtml += '</div><div class="cleared" style=" border-bottom:#ddd dashed 1px; padding:5px 0px 5px 0px;"></div>';
				});  
			}
			 
			itemtemp.stu_names = stuhtml;
			itemtemp.test_name = n.name;
			itemtemp.subject_id = n.subject_id; 
			itemtemp.test_mode = n.exam_type;
			itemtemp.grade = n.grade;
			itemtemp.test_type = n.build_type;
		 
			itemtemp.test_analysis = '<div>已交 '+(parseInt(n.stat_analyse.assign_student_count)-parseInt(n.stat_analyse.unsubmit_num))+' | 未交'+n.stat_analyse.unsubmit_num+'人<br />得分率100% '+n.stat_analyse.score_percent_100+'人<br />得分率85%以上 '+n.stat_analyse.score_percent_85_over+'人<br />得分率70%以上 '+n.stat_analyse.score_percent_70_over+'人<br />得分率60%以上 '+n.stat_analyse.score_percent_60_over+'人<br />得分率60%以下 '+n.stat_analyse.score_percent_60_below+'人</div>';
			itemtemp.creat_date = n.create_date;
			itemtemp.id = n.exam_id;
			itemtemp.assign_id = n.id;
			/*itemtemp.content = n.content;
			itemtemp.conditions = n.conditions;*/
			datalistTemp.push(itemtemp);  
			
		 
			
		});
	 	   
    }
	return datalistTemp;   
}

function setselects(grade_1,subject_1){
		 
		var grade_box = [{'id':'请选择','name':'请选择'}];
		var subject_box = [{'id':'请选择','name':'请选择'}];
		$.each($.unique(grade_1),function(i_g,n_g){
			grade_box.push({'id':n_g,'name':edu_grade(parseInt(n_g))});
		});
		 
		 
		$('#grade').combobox({
			 data:grade_box,
			 valueField:'id',
			 textField:'name'
		 });
		 
	
}