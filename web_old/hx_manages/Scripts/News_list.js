var schoolId = 0 ;//学校Id
var campusId = "" ; //校区Id
var UserInfo = "";  //基本信息  
var centerAll = "";
var dataindex = 0;
var pager = "";
$().ready(function() {
	  dataindex = getUrlParam('index');
	  centerId=1;
	  
      UserInfo = $.evalJSON($.cookie("UserInfo"));
	  centerAll = $.evalJSON($.cookie("centerAll"));
	  if(UserInfo.level==2||UserInfo.level==4){
	  	centerAll = $.evalJSON($.cookie("centerAll"));
		UserInfo['center_id'] = centerAll.center_id;
	  }
	   
	   
	  var tempcolumns = [[ 
			{ field: 'send_School', title: '新闻来源', width: 220, align: 'left', sortable: true },
			{ field: 'news_title', title: '新闻标题', width: 300, align: 'left', sortable: true },
			{ field: 'creat_time', title: '发布时间', width: 80, align: 'center'},
			
			{ field: 'end_time', title: '截止时间', width: 80, align: 'center' ,hidden:true},
			{ field: 'content', title: '内容', width: 80, align: 'center', hidden:true },
			{ field: 'mobile', title: '状态', width: 70, align: 'center', hidden: true, 
				formatter: function (value, row, index) {
                    var html = '';
                    html = value == 0 ? '显示中' : '<font color="#a9a9a9">已过期</font>';
                    return html;
                }
			},
			{ field: 'create_by', title: 'create_by', width: 120,hidden:true},
			{ field: 'id', title: '操作',  align: 'center', 
				formatter: function (value, row, index) {
					var rowData = ($('#informations_list').datagrid('getData').rows)[index];
					 
					var s ="<a href=\"#\" style='color:blue;' onclick=\"selectNews('" + value + "'," + index + ","+centerId+")\">查看</a>&nbsp;";
					if(row.mobile!=1&&(row.create_by==UserInfo.id)){
                    	s += "<a href=\"#\" style='color:blue;' onclick=\"editNews('" + value + "'," + index + ")\">修改</a>";
					}else{
						s += "<font color='#a9a9a9'>修改</font>";
					}
					if(row.create_by==UserInfo.id){
						s+="&nbsp;<a href=\"#\" style='color:blue;' onclick=\"deleteNews('" + value + "'," + index + ")\">删除</a>";
					}else{
						s += "&nbsp;<font color='#a9a9a9'>删除</font>";
					}
					return s;
                }
			}
			
        ]];
	
	
	var url = 'Webversion + "/news?pageno="+pageNumber+"&countperpage="+pageSize';
	 
	var datacc = {'center_id':UserInfo.center_id,'id':UserInfo.id,listtype:1};
	if(UserInfo.level==2){
		var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val();
		datacc['zone_id'] = select_zoneid;
	} 
	
	var functionres = 'Longding(result);';
		
	//新闻列表加载  并且返回pager
    pager = datagridLoad('#informations_list',true,'#informations_bar',tempcolumns,url,"GET","json",datacc,functionres) ;
	
    
    // 绑定搜索事件
    $("#BtnSearch").click(function () {

        if ($("#SchoolText").attr("innt") == "1") {
            $.messager.alert('温馨提示', '请输入姓名再搜索！', 'info');
            return;
        }

        $.messager.progress({ text: '正在搜索校区信息' });

        $('#BtnSearch').datagrid("getPager").pagination("select", 1);

        $.messager.progress('close');

    });
	
	 
	$('#newsstatus').combobox({
		onChange:function(newvalue,oldvalue){
			if(newvalue!='请选择'){
				var dataccc = {'center_id':UserInfo.center_id,'id':UserInfo.id,'is_expire':newvalue};
				if(UserInfo.level==2){
					dataccc['zone_id'] = select_zoneid;
				} 
				 pager = datagridLoad('#informations_list',true,'#informations_bar',tempcolumns,url,"GET","json",dataccc,functionres) ;
			}
		}	
		
	});
	
	
});

//加载新闻列表分页的形式显示

function Longding(result){
	var datalistTemp = [];
			
			if(result.list!=null){
			   
            	$.each(result.list,function(i,nn){
					  
						var itemtemp = {};
						if(nn.zone_name!=null&&nn.zone_name!=""){
							itemtemp.send_School = nn.center_name+'--'+nn.zone_name;
						}else{
							itemtemp.send_School = nn.center_name;	
						}
						
						
                        itemtemp.news_title = Base64.decode(nn.title);
						itemtemp.content = nn.content;
						itemtemp.creat_time = nn.create_time;
						itemtemp.end_time = nn.expire_date;
						var mobile = "";
						itemtemp.create_by = nn.create_by;
						itemtemp.mobile = date_Diff_day(nn.expire_date.substring(0,10),getNowDate());
						 
						itemtemp.id = nn.newsid;
						datalistTemp.push(itemtemp);
					 
				
				});
			}
	return datalistTemp;
	
}
 

 






// 查看新闻
function selectNews(value, index){
 	var rowData = ($('#informations_list').datagrid('getData').rows)[index];
	rowData['news_title'] = Base64.encode(rowData.news_title);
	window.location="News_sel.html?data="+JSON.stringify(rowData);
}


 