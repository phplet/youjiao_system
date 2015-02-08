var UserInfo = {};
var centerAll = {};
var page = "";
var zonenamesid = [];
var zonesTid = "";
$().ready(function() {
      UserInfo = $.evalJSON($.cookie("UserInfo"));
	   
	  if(UserInfo.level==1){
		 centerAll['center_id'] = UserInfo.center_id; 
		 
	  }else{
		centerAll = $.evalJSON($.cookie("centerAll"));  
	  }
	  window.parent.tree_select('报班人次统计');
	  var  tabs_name = $('.tabs-title', window.parent.document);	  //获得iframe父页面的节点内容
	  if((tabs_name.html())=="校区管理"){
	  	tabs_name.html('学务报表');   //赋值
		// $('document').KeyInput($("#SchoolText"), '请输入姓名');
	  }
	 zonesTid = getUrlParam("zone_id");   //校长从校区管理页面获取的zone_id
	 if(UserInfo.level==1){
		 $('.zone_Name_1_s').show();
		 $('.zone_Name_2_s').show();
		 $('.zone_Name_1').hide();
		 $('.zone_Name_2').hide();
		 var url_type_idN = '/center_zone';
		 var Qjson_idN = {'action':'list','center_id':UserInfo.center_id};
		 var zone_idN = Ajax_option(url_type_idN,Qjson_idN,"GET");
		 if(zone_idN.list!=null&&zone_idN.list!=""){
			 
			$.each(zone_idN.list,function(idN_i,idN_n){
				
				zonenamesid.push({'id':idN_n.id,'name':idN_n.zone_name});
				
			});
			
			
		 }
		 
	 }else if(UserInfo.level==2){
		
		 $('.zone_Name_1_s').hide();
		 $('.zone_Name_2_s').hide();
		 $('.zone_Name_1').show();
		 $('.zone_Name_2').show();
		 $('.zone_Name_1').html($('#A_zones',window.parent.document).find("option:selected").text());
		 $('.zone_Name_2').html($('#A_zones',window.parent.document).find("option:selected").text());
	 }
     $('#students_counts').panel({  
	    title:"&nbsp;学务报表&nbsp;>>&nbsp;报班人次统计",
		onOpen:function(){
			
			$('#details').tabs({
		
       			 width: $("#details").parent().width(),
        		 height: "auto",
				  
    	 		 onSelect:function(title){
					 if(title=="按天统计"){
						 $('#zone_Name_2').combobox("clear");
						 $('#zone_Name_1').combobox("clear");
						 $('.panel-title').html('&nbsp;学务报表&nbsp;>>&nbsp;报班人次统计&nbsp;>>&nbsp;按天统计');
						 if(UserInfo.level==1){
							 $('#zone_Name_1').combobox({
								  data:zonenamesid,
								  valueField:'id',
								  textField:'name',
							 
								  onLoadSuccess:function(){
									  
									  if(zonesTid!=""&&zonesTid!=null&&zonesTid!=undefined){
										 $(this).combobox('setValue',zonesTid); 
										 $(this).combobox('disable');
									  }else{
										 $(this).combobox('setValue',zonenamesid[0].id);  
									  }
									  
								  },
								  onChange:function(newsvalues,oldvalues){
									   
									  if(newsvalues!='请选择'){
										  
										   day_counts(newsvalues);
									  }
								  }
							  });
						 }else if(UserInfo.level==2){
							 day_counts("");
						 }
						 
						 
					  }else if(title=="按月统计"){
						$('.panel-title').html('&nbsp;学务报表&nbsp;>>&nbsp;报班人次统计&nbsp;>>&nbsp;按月统计');
						 
						if(UserInfo.level==1){
							 
							 $('#zone_Name_1').combobox("clear");
							 $('#zone_Name_2').combobox("clear");
							 $('#zone_Name_2').combobox({
								  data:zonenamesid,
								  valueField:'id',
								  textField:'name',
								  onLoadSuccess:function(){
									  
									  if(zonesTid!=""&&zonesTid!=null&&zonesTid!=undefined){
										 $('#zone_Name_2').combobox('setValue',zonesTid); 
										 $('#zone_Name_2').combobox('disable');
									  }else{
										 $('#zone_Name_2').combobox('setValue',zonenamesid[0].id);  
									  }
									   
								  },
								  onChange:function(newsvalues_2,oldvalues_2){
									  if(newsvalues_2!='请选择'){
										   month_counts(newsvalues_2);
									  }
								  }
							  });
						 }else if(UserInfo.level==2){
							 month_counts("");
						 }
						
						
						
						 
					  }else if(title=="按阶段统计"){
						$('.panel-title').html('&nbsp;学务报表&nbsp;>>&nbsp;报班人次统计&nbsp;>>&nbsp;按阶段统计');
					  	$('#zone_Name_1').combobox("clear");
						$('#zone_Name_2').combobox("clear");
						phases_times();
					  }
					//alert(title+' is selected');  //判断每个每个列表 更新列表
					$('.combo').css("width",'268px');
					$('.combo input').css("width",'250px');
					$('.hx_Schooltop_sc .combo').css("width",'106px');
					$('.hx_Schooltop_sc .combo input').css("width",'88px');
					
				 }
			}); //方便右边块宽度自适应	
		
		}
	 });
	 
});

function zonenames(){
		
}

//按天统计
function day_counts(didN){
	
	var columnsjson =[[
					  { field: 'creat_date', title: '日期', rowspan:2, width: 90, align: 'center', sortable: true },
					  {title:'在校人次数',colspan:2 },
					  {title:'新入班人次数',colspan:2},
					  {title:'结课人次数',colspan:2}
					   
				],[
					
					{ field: 'nowBigStus', title: public_Bigclass_name+'人次数', width: 100, align: 'center'},
					{ field: 'nowOneStus', title: '1对1人次数', width: 100, align: 'center'},
					{ field: 'joinBigStus', title: public_Bigclass_name+'人次数', width: 100, align: 'center'},
					{ field: 'joinOneStus', title: '1对1人次数', width: 100, align: 'center' },
					{ field: 'loseBigStus', title: public_Bigclass_name+'人次数', width: 100, align: 'center'},
					{ field: 'loseOneStus', title: '1对1人次数', width: 100, align: 'center' }
					
        ]];
		
		var version_level = $.cookie("version_level");
		if(version_level!=""&&version_level!=null){
				 
				version_level = Base64.decode(version_level);
				if(version_level==1){
					columnsjson =[[
								  { field: 'creat_date', title: '日期',  width: 90, align: 'center', sortable: true },
								  { field: 'nowBigStus', title: '在校人次数', width: 120, align: 'center'},
								  { field: 'joinBigStus', title: '新入班人次数', width: 120, align: 'center'},
								  { field: 'loseBigStus', title: '结课人次数', width: 120, align: 'center'}
								   
							]];
				}else{
					columnsjson =[[
								  { field: 'creat_date', title: '日期', rowspan:2, width: 90, align: 'center', sortable: true },
								  {title:'在校人次数',colspan:2},
								  {title:'新入班人次数',colspan:2},
								  {title:'结课人次数',colspan:2}
								   
							],[
								
								{ field: 'nowBigStus', title: '大班人次数', width: 100, align: 'center'},
								{ field: 'nowOneStus', title: '1对1人次数', width: 100, align: 'center' },
								{ field: 'joinBigStus', title: '大班人次数', width: 100, align: 'center'},
								{ field: 'joinOneStus', title: '1对1人次数', width: 100, align: 'center' },
								{ field: 'loseBigStus', title: '大班人次数', width: 100, align: 'center'},
								{ field: 'loseOneStus', title: '1对1人次数', width: 100, align: 'center' }
								
					]];
				}
		}
	var zone_id = "";	
	if(UserInfo.level==1){
		zone_id = didN;
		
	}else if(UserInfo.level==2){
		zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	}
	
	var url = 'Webversion + "/stat?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc ={'action':'student_number_stat','time':'day','center_id':centerAll.center_id,'zone_id':zone_id};
	if(UserInfo.level==1){
		datacc['center_id'] = UserInfo.center_id;
	}
	var functionres = 'Longding(result);';
	//加载列表  并且返回pager
	pager = datagridLoad('#day_counts',true,'#day_bar',columnsjson,url,"GET","json",datacc,functionres);
	 
}


//加载列表俺分页的形式显示
function Longding(result) {
 
    var datalistTemp = [];
			 
	if(result.list!=null){
		 
		$.each(result.list,function(i,s){
				var itemtemp = {};
			   
				itemtemp.creat_date = s.day;
				itemtemp.nowBigStus = s.stu_big_count;
				itemtemp.nowOneStus = s.stu_small_count;
				itemtemp.joinBigStus = s.stu_new_big_count;
				itemtemp.joinOneStus = s.stu_new_small_count;
				itemtemp.loseBigStus = s.stu_lost_big_count;
				itemtemp.loseOneStus = s.stu_lost_small_count;
//				itemtemp.nowStus = (parseInt(s.stu_big_count)+parseInt(s.stu_small_count));
				//itemtemp.nowStus =s.stu_total_count;
				//itemtemp.jionStus = parseInt(s.stu_new_big_count)+parseInt(s.stu_new_small_count);
				//itemtemp.loseStus = s.stu_lost_count;  
				datalistTemp.push(itemtemp);
				
				 
		
		});
	}
	return datalistTemp;
}



//按月统计
function month_counts(midN){
	
	var columnsjson =[[
					  { field: 'creat_date', title: '月份', rowspan:2, width: 90, align: 'center', sortable: true },
					  {title:'在校人次数',colspan:2 ,hidden:true},
					  {title:'新入班人次数',colspan:2},
					  {title:'结课人次数',colspan:2}
					   
				],[
					
					{ field: 'nowBigStus', title: public_Bigclass_name+'人次数', width: 120, align: 'center',hidden:true},
					{ field: 'nowOneStus', title: '1对1人次数', width: 120, align: 'center' ,hidden:true},
					{ field: 'joinBigStus', title: public_Bigclass_name+'人次数', width: 120, align: 'center'},
					{ field: 'joinOneStus', title: '1对1人次数', width: 120, align: 'center' },
					{ field: 'loseBigStus', title: public_Bigclass_name+'人次数', width: 120, align: 'center'},
					{ field: 'loseOneStus', title: '1对1人次数', width: 120, align: 'center' }
					
        ]];
	var version_level = $.cookie("version_level");
		if(version_level!=""&&version_level!=null){
				version_level = Base64.decode(version_level);
				if(version_level==1){
					columnsjson =[[
								  { field: 'creat_date', title: '月份',  width: 90, align: 'center', sortable: true },
								  { field: 'nowBigStus', title: '在校人次数', width: 120, align: 'center'},
								  { field: 'joinBigStus', title: '新入班人次数', width: 120, align: 'center'},
								  { field: 'loseBigStus', title: '结课人次数', width: 120, align: 'center'}
								   
							]];
				}else{
					columnsjson =[[
								  { field: 'creat_date', title: '月份', rowspan:2, width: 90, align: 'center', sortable: true },
								  {title:'在校人次数',colspan:2,hidden:true},
								  {title:'新入班人次数',colspan:2},
								  {title:'结课人次数',colspan:2}
								   
							],[
								
								{ field: 'nowBigStus', title: '大班人次数', width: 120, align: 'center',hidden:true},
								{ field: 'nowOneStus', title: '1对1人次数', width: 120, align: 'center' ,hidden:true},
								{ field: 'joinBigStus', title: '大班人次数', width: 120, align: 'center'},
								{ field: 'joinOneStus', title: '1对1人次数', width: 120, align: 'center' },
								{ field: 'loseBigStus', title: '大班人次数', width: 120, align: 'center'},
								{ field: 'loseOneStus', title: '1对1人次数', width: 120, align: 'center' }
								
					]];
				}
		}
	var zone_id = "";
	if(UserInfo.level==1){
		zone_id = midN;
	}else if(UserInfo.level==2){
		zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	}
	 
	var url = 'Webversion + "/stat?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc ={'action':'student_number_stat','time':'month','center_id':centerAll.center_id,'zone_id':zone_id};
	var functionres = 'month_countsajax(result);';
	if(UserInfo.level==1){
		datacc['center_id'] = UserInfo.center_id;
	}
	//加载列表  并且返回pager
	pager = datagridLoad('#month_counts',true,'#month_bar',columnsjson,url,"GET","json",datacc,functionres);
	 
}


//按月统计数据处理
function month_countsajax(result) {
 	var datalistTemp = [];
			 
	if(result.list!=null){
		 
		$.each(result.list,function(ii,ss){
				var itemtemp = {};
				
				itemtemp.creat_date = ss.year+'年'+ss.month+'月';
				itemtemp.nowBigStus = ss.stu_big_count;
				itemtemp.nowOneStus = ss.stu_small_count;
				itemtemp.joinBigStus = ss.stu_new_big_count;
				itemtemp.joinOneStus = ss.stu_new_small_count;
				itemtemp.loseBigStus = ss.stu_lost_big_count;
				itemtemp.loseOneStus = ss.stu_lost_small_count;
				datalistTemp.push(itemtemp);
		});
		return datalistTemp;
	}
	 
	

}

//按阶段统计
function phases_times(){
	$('#phases_counts').datagrid({   
         
        toolbar: '#phases_bar'
	});
    var  begintime_1 = $("#begintime").datebox("getValue");  //获得开始时间
	var  endtime_1 = $("#endtime").datebox("getValue");      //获得结束时间
	 
	if (begintime_1 != "" && endtime_1 != ""&&date_Diff_day(endtime_1,begintime_1)==0) {
            phases_counts(begintime_1,endtime_1);   //执行阶段统计列表内容
    }
	// 绑定搜索事件   按开始时间和结束时间搜索
	$("#BtnSearch").unbind('click');
    $("#BtnSearch").click(function () {
	 
        var  begintime = $("#begintime").datebox("getValue");  //获得开始时间
		var  endtime = $("#endtime").datebox("getValue");      //获得结束时间
		 
        if (begintime != "" && endtime != ""&&date_Diff_day(endtime,begintime)==0) {
            phases_counts(begintime,endtime);   //执行阶段统计列表内容
        }else{
			
			if(begintime== "" && endtime != ""){
				$.messager.alert('温馨提示', '请输入开始时间！', 'info');
			}else if(endtime== "" && begintime != ""){
				$.messager.alert('温馨提示', '请输入结束时间！', 'info');
			}
			else if(endtime != ""&&begintime != ""&&date_Diff_day(begintime,endtime)==0){
				$.messager.alert('温馨提示', '开始时间不能大于结束时间！', 'info');
			}else if(endtime == ""&&begintime == ""){
				$.messager.alert('温馨提示', '请输入开始结束时间！', 'info');
			}
			return;
		}

    });
}

//按阶段统计
function phases_counts(begtime,endtime){
	
	var columnsjson =[[
					  { field: 'schoolName', title: '校区名称', rowspan:2, width: 90, align: 'center', sortable: true },
					  {title:'在校人次数',colspan:2,hidden:true},
					  {title:'新入班人次数',colspan:2},
					  {title:'结课人次数',colspan:2}
					   
				],[
					
					{ field: 'nowBigStus', title: public_Bigclass_name+'人次数', width: 120, align: 'center',hidden:true},
					{ field: 'nowOneStus', title: '1对1人次数', width: 120, align: 'center' ,hidden:true},
					{ field: 'joinBigStus', title: public_Bigclass_name+'人次数', width: 120, align: 'center'},
					{ field: 'joinOneStus', title: '1对1人次数', width: 120, align: 'center' },
					{ field: 'loseBigStus', title: public_Bigclass_name+'人次数', width: 120, align: 'center'},
					{ field: 'loseOneStus', title: '1对1人次数', width: 120, align: 'center' }
					
        ]];
		var version_level = $.cookie("version_level");
		if(version_level!=""&&version_level!=null){
				version_level = Base64.decode(version_level);
				if(version_level==1){
					columnsjson =[[
								  { field: 'schoolName', title: '校区名称',  width: 150, align: 'center', sortable: true },
								  { field: 'nowBigStus', title: '在校人次数', width: 120, align: 'center',hidden:true},
								  { field: 'joinBigStus', title: '新入班人次数', width: 120, align: 'center'},
								  { field: 'loseBigStus', title: '结课人次数', width: 120, align: 'center'}
								   
							]];
				}else{
					columnsjson =[[
								  { field: 'schoolName', title: '校区名称', rowspan:2, width: 120, align: 'center', sortable: true },
								  {title:'在校人次数',colspan:2,hidden:true},
								  {title:'新入班人次数',colspan:2},
								  {title:'结课人次数',colspan:2}
								   
							],[
								
								{ field: 'nowBigStus', title: public_Bigclass_name+'人次数', width: 120, align: 'center',hidden:true},
								{ field: 'nowOneStus', title: '1对1人次数', width: 120, align: 'center' ,hidden:true},
								{ field: 'joinBigStus', title: public_Bigclass_name+'人次数', width: 120, align: 'center'},
								{ field: 'joinOneStus', title: '1对1人次数', width: 120, align: 'center' },
								{ field: 'loseBigStus', title: public_Bigclass_name+'人次数', width: 120, align: 'center'},
								{ field: 'loseOneStus', title: '1对1人次数', width: 120, align: 'center' }
								
					]];
				}
		}
	var urlT = 'Webversion + "/stat?pageno="+pageNumber+"&countperpage="+pageSize';
	var dataccT ={'action':'student_number_stat','time':'period'};
	var functionres = 'phases_countsajax(result);';
	var zone_id = "";
	if(UserInfo.level==1){
		dataccT['center_id'] = UserInfo.center_id; 
	}else if(UserInfo.level==2){
		dataccT['center_id'] = centerAll.center_id
		zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
		dataccT['zone_id'] = zone_id;
	}
	dataccT['begin_time'] = begtime;
	dataccT['end_time'] = endtime;
	//加载列表  并且返回pager
	pager = datagridLoad('#phases_counts',true,'#phases_bar',columnsjson,urlT,"GET","json",dataccT,functionres);
	 
}
//
function phases_countsajax(result) {

 var datalistTemp = [];
			 
	if(result.list!=null){
		 
		$.each(result.list,function(ii,ss){
				var itemtemp = {};
				
				itemtemp.schoolName = ss.zone_name;
				itemtemp.nowBigStus = ss.stat.stu_big_count==null?0:ss.stat.stu_big_count;
				itemtemp.nowOneStus = ss.stat.stu_small_count==null?0:ss.stat.stu_small_count;
				itemtemp.joinBigStus = ss.stat.stu_new_big_count==null?0:ss.stat.stu_new_big_count;
				itemtemp.joinOneStus = ss.stat.stu_new_small_count==null?0:ss.stat.stu_new_small_count;
				itemtemp.loseBigStus = ss.stat.stu_lost_big_count==null?0:ss.stat.stu_lost_big_count;
				itemtemp.loseOneStus = ss.stat.stu_lost_small_count==null?0:ss.stat.stu_lost_small_count;
				datalistTemp.push(itemtemp);
		});
		return datalistTemp;
	}
	 

}