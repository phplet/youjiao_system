
var data = "";
var UserInfo = null;
var centerAll = null;
var pager = "";
var typeGR = ""; 
 	
$().ready(function () {
	
   UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
   centerAll = $.evalJSON($.cookie("centerAll")); //取得学校信息	
   window.parent.tree_select('选试卷派送');
   var data_temp = getUrlParam("rowdata");
   typeGR = getUrlParam("type");
   if(data_temp=='stringdata'){
   		data = $.evalJSON(Base64.decode(window.top.string_data.rowdata));
		//alert(JSON.stringify(data));
   }
   
	$('#PapersInformation').datagrid({
				title: '测评派送',
				width: 780,
				height: 'auto',
				fitColumns: true,
				columns:[[
					{ field: 'name', title: '试卷标题', width: 130, sortable: true, align: 'center'},
			{ field: 'grade_id', title: '适用年级', width: 70, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    return edu_grade(parseInt(value));
				}
            },
			{ field: 'subject_id', title: '学科', width: 40, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    return subject_sum(parseInt(value));
				}
            },
            { field: 'exer_type', title: '形式', width: 40, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    if (value == 1) {return "测试";} else {return "作业";}
				}
            },
			{ field: 'field', title: '组卷范围', width: 80, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    if (value == 1)  {return "同步题库";}  else if(value==2){return "专题题库";}else {return "历年真题";}
                }
            },
            { field: 'tmod', title: '组卷类型', width: 80, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                    if (value == 0) { return "智能组卷";} else {return "手动挑题";}
                }
            },
			{ field: 'creat_date', title: '组卷时间', width: 80, sortable: true, align: 'center'},
			 
			{ field: 'test_analysis', title: '试题统计分析', width: 180, align: 'left'}
				]]
			});
	$('#PapersInformation').datagrid('loadData',{'rows':[data]});
    $('#center_name_1').html(centerAll.center_name+'&nbsp;：'+$('#A_zones',window.parent.document).find("option:selected").text());
	class_stu_name(UserInfo.id); 
 	stu_class_M(1);
});

 
		
//加载班级和学生
function class_stu_name(teacher_id){
	var data_class = "";
	var zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	var url = Webversion + '/class';
	var datacc = {'action':'current_stu_class','fresh':1,'condition':"center_id^"+centerAll.center_id+"$zone_id^"+zone_id+'$user_id^'+teacher_id}; 	
	$.ajax({
        url: url, //url访问地址
        type: "GET",
		async:false,
        data: datacc,
        dataType: "json",
        success: function (result){
			if(result.list!=null&&result.list!=undefined){
				 var tr_html = '<tr><th align="center">班级名称</th><th align="center">学生名称</th></tr>';
				 $.each(result.list,function(i,n){
					 // var dd = date_Diff_day(getNowDate(),n.end_date.substring(0,10));
					   
					//if(dd==1||n.end_date.substring(0,10)=='0000-00-00'){
						if(n.class_type==2){
							tr_html += '<tr><td align="left"><input  type="checkbox" name="checkbox_'+(i+1)+'" class="'+n.class_id+'" class_name="'+n.class_name+'" />(1对1)'+n.class_name+'</td><td class="checkbox_'+(i+1)+'">';	
						}else{
							tr_html += '<tr><td align="left"><input  type="checkbox" name="checkbox_'+(i+1)+'" class="'+n.class_id+'" class_name="'+n.class_name+'" />('+public_Bigclass_name+')'+n.class_name+'</td><td class="checkbox_'+(i+1)+'">';	
						}
						if(n.student!=null&&n.student!=undefined){
							$.each(n.student,function(ii,nn){
								tr_html += '<span><input  type="checkbox" zdyValue="'+nn.u_id+'" name="checkbox_'+(i+1)+'_'+(ii+1)+'" stu_name="'+nn.realname+'"/>'+nn.realname+'</span>&nbsp;';
							});
						}
					//}
					tr_html += '</td></tr>';
				 });
				 $('#sentobj_class').html(tr_html);
				 
			 }

        }
    });
	
	
}


//模式选择全选操作
function stu_class_M(value){
	//清空checkbox的值
	
	$('#sentobj_class input[type=checkbox]:checked').each(function(index, element) {
        $(this).attr("checked",false);
    });
	
	if(value==0){
		
		$('#sentobj_class tr').find('td:last input').hide();
		$('#sentobj_class tr').find('td:first input').unbind('click');
		$('#sentobj_class tr').find('td:first input').bind('click',function(){
			var checkbox_P = $(this).attr("name");
			if($(this).attr("checked")=='checked'){
				$(this).attr("checked",true);
				$('.'+checkbox_P+' input[type=checkbox]').each(function(i0, e0) {
					 
					$(e0).attr("checked",true);
				});
			}else{
				$(this).attr("checked",false);
				$('.'+checkbox_P+' input[type=checkbox]').each(function(i1, e1) {
					$(e1).attr("checked",false);
				});
			}
		});
		
	}else if(value==1){
		$('#sentobj_class tr').find('td:last input').show();
		$('#sentobj_class tr').find('td:first input').unbind('click');
		$('#sentobj_class tr').find('td:first input').bind('click',function(){
			var checkbox_P = $(this).attr("name");
			if($(this).attr("checked")=='checked'){
				$(this).attr("checked",'true');
				$('.'+checkbox_P+' input[type=checkbox]').each(function(i0, e0) {
					$(e0).attr("checked",true);
				});
			}else{
				$(this).attr("checked",false);
				$('.'+checkbox_P+' input[type=checkbox]').each(function(i1, e1) {
					$(e1).attr("checked",false);
				});
			}
		});
	}
	
}


 

//下一步
function NextSendwer(){
	var td_1box = $('#sentobj_class tr').find('td:first input');  
	var class_stus = [];
	 
	var class_name = "";
	var stu_names = "";
	var stu_ids_2 = [];
	var stu_ids_3 = [];
	var type_select = 1;
	var class_type_checkedsum = 0; 
	td_1box.each(function(i2, e2) {
		var class_stu = {};
		 
		if($(e2).attr('checked')){
			type_select=0;	
		};
		
		
		class_stu['class_id']=$(e2).attr("class");
		class_stu['class_name']=$(e2).attr("class_name");
		var checkbox_P_1 = $(e2).attr("name");
		var checkbox_C_1 = $('.'+checkbox_P_1+' input[type=checkbox]:checked');
		if(checkbox_C_1.length>0){
			class_name += $(e2).attr("class_name")+"&nbsp;,&nbsp;";
			class_stu['stu_num'] = checkbox_C_1.length;
			var stu_ids_1 = [];
			checkbox_C_1.each(function(i3, e3) {
					var stu_id_1 = $(e3).attr("zdyValue");  //需要叠加到一起
					var stu_name_1 = $(e3).attr("stu_name");
					stu_ids_1.push({'stu_id':stu_id_1,'stu_name':stu_name_1});
					
					stu_ids_2.push(stu_id_1);
					stu_ids_3.push({'stu_id':stu_id_1,'stu_name':stu_name_1});
					 
			});
			class_stu['stu_ids'] = stu_ids_1;
			class_stus.push(class_stu);
			
		}
		
	});
	 
	//alert(JSON.stringify(class_stus));
	// return ;
	 
	if(class_stus==""){
		$.messager.alert('温馨提示','必须选一个班级或者一个学生!','info');	
		 
	}else{
		
		$('#t_zonenameinfo').hide();
		$('#confirm').hide();
		$('#SentDrectly').show();
		if(type_select==0){
			$('#class_t').html('派送班级：');
			$('#class_name').html(class_name);
			
		}else{
			$('#class_t').html('派送学生：');	
			stu_ids_2 = unique(stu_ids_2);
			$.each(stu_ids_2,function(ii,nn){
				$.each(stu_ids_3,function(iii,nnn){
					if(nn==nnn.stu_id){
						stu_names += nnn.stu_name+"&nbsp;,&nbsp;";
						return true;
					}
				});
			});
			$('#class_name').html(stu_names);
		}
		$('#center_name_2').html(centerAll.center_name+'&nbsp;-->'+$('#A_zones',window.parent.document).find("option:selected").text());
		
		 
		$('#test_name').html(data.name);
		$('#time_now').html("当前时间："+getNowDate());//当前时间
		$('#send_Ok').unbind('click');
		$('#send_Ok').bind('click',function(){
			var Send_types = $('#SendWay input[type=radio]:checked').val();
			   
			var Send_time = $('#endtime').datebox('getValue');
			//var assign_mode = (type_select==1?1:0);
			/* data{"name":"测试1","exer_type":"1","grade_id":"11","subject_id":"3","field":"2","tmod":"1","creat_date":"2013-06-24","id":"8","status":"0","content":"fbj10000020,fbj10000003,fbj10000024,fbj10000026,fbj10000027","conditions":"{\"data_test\":{\"testname\":\"u6d4bu8bd51\",\"testtype\":\"1\",\"subject_id\":\"3\",\"section_id\":\"18\",\"grade_id\":\"11\",\"tiku_type\":\"1\",\"tab_Sid\":\"2\",\"special\":[\"18301\",\"18302\",\"18303\"]},\"paper_num\":[{\"1\":\"1\"},{\"2\":\"2\"}]}"}*/
			
			 if(Send_time!=""&&(date_Diff_day(getNowDate(),Send_time))==1&&Send_types!=""){
				 
				 send_ok(type_select,Send_types,class_stus,Send_time,data);	
				 
			 }else{$.messager.alert('温馨提示','选派终端没选择或者结束时间比当前时间小,请核实后再提交!','info');}
			
		});	
		
		
	}
	
	 
	
 
}

//assign_mode 0按班,1按人  
// assign_type  1 online  2 word
//end_date  结束时间  
//ti_id  试卷id
//assign_to  派送学生json
//exam_type 组卷类型
//center_id 
//zone_id


function send_ok(assign_mode,Send_types,class_stus,Send_time,datass){
   
	var datacc1 = {'action':'dispatch','assign_mode':assign_mode,'assign_type':Send_types,'end_date':Send_time,'ti_id':datass.id,'assign_to':class_stus,'content':datass.content,'grade_id':data.grade_id,'exam_type':datass.exer_type,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
	 
	if(data.type_fav==1){
		 datacc1['fav_exam_assign'] = data.type_fav;
		 datacc1['fav_id'] = data.fav_id;
	}
	 
	$.ajax({
        url: Webversion + '/examination_paper', //url访问地址
        type: "POST",
        data: datacc1,
        dataType: "json",
        success: function (result){
			 
			window.location = "SendList.html";
        }
    });

}
 
function PreviousStep(){
	if(typeGR=='PS'){
		document.location.href = "Pager_Send.html";
	}else if(typeGR=='GR'){
		document.location.href = "../TestCenter/GroupRollCenter.html";
	}else{
		document.location.href = "../TestCenter/GroupRollCenter.html";	
	}
}


//返回上一步
function setreturn(){
	$('#SentDrectly').hide();
	$('#confirm').show();
	$('#t_zonenameinfo').show();
}
