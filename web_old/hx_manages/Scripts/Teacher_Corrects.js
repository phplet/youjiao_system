var pager = "";
var UserInfo = {};
var centerAll = {};
var zonenamesid = [];
var zonesTid = "";
$().ready(function() {
      UserInfo = $.evalJSON($.cookie("UserInfo"));
      centerAll = $.evalJSON($.cookie("centerAll"));
	  window.parent.tree_select('教师批改统计');
	  var  tabs_name = $('.tabs-title', window.parent.document);	  //获得iframe父页面的节点内容
	  if((tabs_name.html())!="学务报表"){
	  	tabs_name.html('学务报表');   //赋值
		// $('document').KeyInput($("#SchoolText"), '请输入姓名');
	  }
	zonesTid = getUrlParam("zone_id");   //校长从校区管理页面获取的zone_id
	
    var columnsjson =[[
			{ field: 'teacherName', title: '教师',rowspan:2, width: 70, align: 'center'},
		    { field: 'subject', title: '学科',rowspan:2, width: 60, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					return subject_sum(parseInt(value));
				}
			},
			{ field: 'mouth', title: '月份', width: 70, rowspan:2,align: 'center'},
			{ field: 'bigClass_now', title: 'bigClass_now',rowspan:2, width: 90, hidden:true }  ,
			{ field: 'bigClass_pass', title: 'bigClass_pass',rowspan:2, width: 90, hidden:true }  ,
			{ field: 'smallClass_now', title: 'smallClass_now',rowspan:2, width: 90, hidden:true }  ,
			{ field: 'smallClass_pass', title: 'smallClass_pass',rowspan:2, width: 90, hidden:true }  ,
			{ field: 'bigSum', title: public_Bigclass_name+'人次数<br />(当前/过往)',rowspan:2, width: 70, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					return row.bigClass_now+'/'+row.bigClass_pass;
				}
			},
			{ field: 'oneSum', title: '1对1人次数<br />(当前/过往)', rowspan:2,width: 80, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					return row.smallClass_now+'/'+row.smallClass_pass;
				}
			},
			
			{ field: 'testSum', title: '组卷数', width: 50,rowspan:2, align: 'center' },
			{ field: 'work_assign_count', title: 'work_assign_count', rowspan:2,width: 90, hidden:true }  ,
			{ field: 'work_pi_count', title: 'work_pi_count', width: 90,rowspan:2, hidden:true }  ,
			{ field: 'work_submit_count', title: 'work_submit_count',rowspan:2, width: 90, hidden:true  }  ,
			{ field: 'test_assign_count', title: 'test_assign_count', rowspan:2,width: 90, hidden:true  }  ,
			{ field: 'test_pi_count', title: 'test_pi_count', width: 90,rowspan:2, hidden:true  }  ,
			{ field: 'test_submit_count', title: 'test_submit_count', rowspan:2,width: 90,hidden:true }  ,
			{title:'测试人次数',colspan:3},
			{title:'作业人次数',colspan:3}
        ],[{ field: 'sendSum', title: '派送', width: 60, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					return row.test_assign_count;
				}
			},
			{ field: 'updateSum', title: '批改', width: 60, align: 'center', sortable: true  ,
				formatter: function (value, row, index) {
					return row.test_pi_count;
				}
			},
			{ field: 'subSum', title: '提交', width: 60, align: 'center', sortable: true  ,
				formatter: function (value, row, index) {
					return row.test_submit_count;
				}
			},
			{ field: 'sendSum_2', title: '派送', width: 60, align: 'center', sortable: true ,
				formatter: function (value, row, index) {
					return row.work_assign_count;
				}
			},
			{ field: 'updateSum_2', title: '批改', width: 60, align: 'center', sortable: true  ,
				formatter: function (value, row, index) {
					return row.work_pi_count;
				}
			},
			{ field: 'subSum_2', title: '提交', width: 60, align: 'center', sortable: true  ,
				formatter: function (value, row, index) {
					return row.work_submit_count;
				}
			} ]];
		var version_level = $.cookie("version_level");
		if(version_level!=""&&version_level!=null){
			version_level = Base64.decode(version_level);
			if(version_level==1){
				columnsjson[0].splice(8,1,{ field: 'oneSum', title: '1对1人次数<br />(当前/过往)', rowspan:2,width: 80, align: 'center',hidden:true, sortable: true ,formatter: function (value, row, index) {return row.smallClass_now+'/'+row.smallClass_pass;}});
			}else{
				columnsjson[0].splice(8,1,{ field: 'oneSum', title: '1对1人次数<br />(当前/过往)', rowspan:2,width: 80, align: 'center', sortable: true ,formatter: function (value, row, index) {return row.smallClass_now+'/'+row.smallClass_pass;}});	
			}
		}
		var url = 'Webversion + "/stat?pageno="+pageNumber+"&countperpage="+pageSize';
		var datacc = {'action':'teacher_stat_list','condition':''};
		var functionres = 'Longding(result);';
		if(UserInfo.level==1){
			$('#zonename_1').show();
			$('#zonename_1_s').hide();
			$('#subject_Z').show();
			$('#subject_T').hide();
			var url_type_idN = '/center_zone';
			 var Qjson_idN = {'action':'list','center_id':UserInfo.center_id};
			 var zone_idN = Ajax_option(url_type_idN,Qjson_idN,"GET");
			 if(zone_idN.list!=null&&zone_idN.list!=""){
				 
				$.each(zone_idN.list,function(idN_i,idN_n){
					
					zonenamesid.push({'id':idN_n.id,'name':idN_n.zone_name});
					
				});
				 
			 }
			 $('#zonenames').combobox({
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
						
						 datacc.condition = 'center_id^'+UserInfo.center_id+'$zone_id^'+newsvalues+'$level^4$month^'+(new Date().getMonth()+1)+'$year^'+new Date().getFullYear();
						 datacc['center_id'] = UserInfo.center_id;
						 datacc['zone_id'] = newsvalues;
						 //加载列表  并且返回pager
						 pager = datagridLoad('#teacher_Corrects',true,'#SerToolBar',columnsjson,url,"GET","json",datacc,functionres) ;
					}
				}
					 
			 });
			
		}else if(UserInfo.level==2){
			 
			$('#zonename_1').hide();
			$('#zonename_1_s').show();
			$('#subject_Z').show();
			$('#subject_T').hide();
			$('#teachersear').show();
			$('#zonename_1_s').html($('#A_zones',window.parent.document).find("option:selected").text());
			datacc.condition = 'center_id^'+centerAll.center_id+'$zone_id^'+$('#A_zones',window.parent.document).find("option:selected").val()+'$level^4$month^'+(new Date().getMonth()+1)+'$year^'+new Date().getFullYear();
			//加载列表  并且返回pager
			datacc['center_id'] = centerAll.center_id;
			datacc['zone_id'] = $('#A_zones',window.parent.document).find("option:selected").val();
			pager = datagridLoad('#teacher_Corrects',true,'#SerToolBar',columnsjson,url,"GET","json",datacc,functionres) ; 
		
		}else if(UserInfo.level==4){
			$('#zonename_1').hide();
			$('#zonename_1_s').show();
			$('#subject_Z').hide();
			$('#subject_T').show();
			$('#teachersear').hide();
			$('#zonename_1_s').html($('#A_zones',window.parent.document).find("option:selected").text());
			$('#subject_T').html(subject_sum(parseInt(UserInfo.subject_id)));
			datacc.condition = 'center_id^'+centerAll.center_id+'$zone_id^'+$('#A_zones',window.parent.document).find("option:selected").val()+'$level^4$month^'+(new Date().getMonth()+1)+'$year^'+new Date().getFullYear();
			datacc['user_id'] = UserInfo.id;
			datacc['center_id'] = centerAll.center_id;
			datacc['zone_id'] = $('#A_zones',window.parent.document).find("option:selected").val();
			//加载列表  并且返回pager
			pager = datagridLoad('#teacher_Corrects',true,'#SerToolBar',columnsjson,url,"GET","json",datacc,functionres) ;
			
		}
	 
	
	
	 $('#subjects').combobox({
		 onChange:function(news_valusez,old_valusez){
			var zoneTids = "";
			var centerT_ids = "";
			if(UserInfo.level==1){
				zoneTids = $('#zonenames').combobox('getValue');
				centerT_ids = UserInfo.center_id;
			}else if(UserInfo.level==2||UserInfo.level==4){
				zoneTids = $('#A_zones',window.parent.document).find("option:selected").val();
				centerT_ids = centerAll.center_id;
			}
			if(news_valusez!='请选择'){
				
				datacc.condition = 'center_id^'+centerT_ids+'$zone_id^'+zoneTids+'$level^4$subject_id^'+news_valusez;
				datacc['center_id'] = centerT_ids;
				datacc['zone_id'] = zoneTids;
			}else{
				datacc.condition = 'center_id^'+centerT_ids+'$zone_id^'+zoneTids+'$level^4';
				datacc['center_id'] = centerT_ids;
				datacc['zone_id'] = zoneTids;
			}
			pager = datagridLoad('#teacher_Corrects',true,'#SerToolBar',columnsjson,url,"GET","json",datacc,functionres) ;	
		}
		
			 
	 });
	

    // 绑定搜索事件
    $("#BtnSearch").click(function () {
		 
		var monthtime = $('#monthtime').combobox('getValue');
		var yeartime = $('#yeartime').combobox('getValue');
		var zoneTid = "";
		var centerT_id = "";
		if(UserInfo.level==1){
			zoneTid = $('#zonenames').combobox('getValue');
			centerT_id = UserInfo.center_id;
		}else if(UserInfo.level==2||UserInfo.level==4){
			zoneTid = $('#A_zones',window.parent.document).find("option:selected").val();
			centerT_id = centerAll.center_id;
		}
		datacc['center_id'] = centerT_id;
		datacc['zone_id'] = zoneTid;
		if(UserInfo.level==2||UserInfo.level==1){
			var subject_ids = $('#subjects').combobox("getValue");
        	var teacher_names = $('#teacher_names').val();
			var datacc_con = '';
			if($.trim(teacher_names)!=""&&monthtime!="请选择"){
				datacc_con = 'center_id^'+centerT_id+'$zone_id^'+zoneTid+'$level^4$month^'+monthtime+'$year^'+yeartime+'$realname@'+teacher_names;
				if(subject_ids!='请选择'){
				 
				}
				 
			}else if($.trim(teacher_names)!=""&&monthtime=="请选择"){
				datacc_con = 'center_id^'+centerT_id+'$zone_id^'+zoneTid+'$level^4$realname@'+teacher_names;
				 
			}else if($.trim(teacher_names)==""&&monthtime!="请选择"){
				datacc_con = 'center_id^'+centerT_id+'$zone_id^'+zoneTid+'$level^4$month^'+monthtime+'$year^'+yeartime;
				
			}
			if(subject_ids!='请选择'){
				 datacc.condition = 'subject_id^'+subject_ids+'$'+datacc_con;
			}else{
				datacc.condition = datacc_con;
			}
			
			pager = datagridLoad('#teacher_Corrects',true,'#SerToolBar',columnsjson,url,"GET","json",datacc,functionres) ;
		}
		else if(UserInfo.level==4){
			if(monthtime!="请选择"){
				datacc.condition = 'center_id^'+centerT_id+'$zone_id^'+zoneTid+'$level^4$month^'+monthtime+'$year^'+yeartime;
				pager = datagridLoad('#teacher_Corrects',true,'#SerToolBar',columnsjson,url,"GET","json",datacc,functionres) ;
			}	
		}
		 

    });
	
	//更新年份
    years(2012,'yeartime','monthtime'); 
    
});

 

function Longding(result){
	if (result.list != null) {
		var datalistTemp = [];
		$.each(result.list, function (i, n) {
			var itemtemp = {};
			itemtemp.subject = n.subject_id;
			itemtemp.teacherName = n.realname;
			itemtemp.mouth = n.year+'年'+n.month+'月';
			 
			itemtemp.bigClass_now = n.big_class_current.count;
			itemtemp.bigClass_pass = n.big_class_pass.count;
			itemtemp.smallClass_now = n.small_class_current.count;
			itemtemp.smallClass_pass = n.small_class_pass.count;
			
			itemtemp.bigSum = n.big_class_count;
			itemtemp.oneSum = n.small_class_count;
			itemtemp.testSum = n.build_count;
			itemtemp.work_assign_count = n.work_assign_count;
			itemtemp.work_pi_count = n.work_pi_count;
			itemtemp.work_submit_count = n.work_submit_count;
			itemtemp.test_assign_count = n.test_assign_count;
			itemtemp.test_pi_count = n.test_pi_count;
			itemtemp.test_submit_count = n.test_submit_count;
			 
			datalistTemp.push(itemtemp);
   
		});
        return datalistTemp;      
	}

}
 