var UserInfo = null;
var centerAll = null;
var pager = "";
var class_Cid=null;
$().ready(function () {
  	UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
	centerAll = $.evalJSON($.cookie("centerAll")); //取得登录人信息
	window.parent.tree_select('测评批阅');
	class_Cid = getUrlParam("cid"); 
	setclassName();
	
	 

});//.ready的结束标签

function select_Test(id){
	
	var tempcolumns = [[
            { field: 'name', title: '测评标题', width: 100, sortable: true, align: 'center'},
            { field: 'grade_id', title: '适用年级', width: 80, sortable: true, align: 'center',
                formatter: function (value, row, index)  {
                    return edu_grade(parseInt(value));
                }
            },
			{ field: 'subject_id', title: '学科', width: 40, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                    return subject_sum(parseInt(value));
                }
            },
            { field: 'tmod', title: '形式', width: 40, sortable: true, align: 'center',
                formatter: function (value, row, index) {
					return value==0?'作业':'测评';
                }
            },
			 { field: 'field', title: '组卷类型', width: 80, sortable: true, align: 'center' ,
                formatter: function (value, row, index) {
                     return value==1?'手动组卷':'智能组卷';
                }
			 },
			 { field: 'creat_time', title: '派送时间', width: 80, sortable: true, align: 'center' },
			 { field: 'assign_type', title: '派送方式', width: 80, sortable: true, align: 'center' ,hidden:true ,
                formatter: function (value, row, index) {
					if(value==1||value==3){
						return '在线';
					}else if(value==2){
						return 'word分发';	
					}
                }
			},	
			 
			
			{ field: 'submit_num', title: 'test_submit_count', width: 80, hidden: true},
			{ field: 'pi_num', title: 'test_pi_count', width: 80, hidden: true},
			{ field: 'unsubmit_num', title: 'test_total_count', width: 80, hidden: true},
			 
			{ field: 'asda', title: '提交统计', width: 80, sortable: true, align: 'center',
				formatter: function (value, row, index) {
					 
					return row.submit_num;
				} 
			},
			{ field: 'sjdfjsd', title: '已批改统计', width: 70, sortable: true, align: 'center',
				formatter: function (value, row, index) {
					 
					return row.pi_num;
				}
			},
			{ field: 'dwd', title: '未提交统计', width: 80, sortable: true, align: 'center', 
				formatter: function (value, row, index) {
					 
					return row.unsubmit_num;
				}
			},
			
			{ field: 'id', title: '操作', sortable: true, align: 'center', //是判断再次发送
			    formatter: function (value, row, index) {
			        if (row.assign_type == 1||row.assign_type == 3) {
						// &nbsp;  <a  href=\"#\"  onclick=\"GenerationAgain(' + row.id + ')\" style=\" position:relative\">提交提醒</a>
						var sst = "";
						var sss = "";
						var ssP = "";
						if((parseInt(row.submit_num)-parseInt(row.pi_num))!=0){
							sst = '<a style="color:blue;"  onclick="JiXuPi('+index+');">继续批阅</a>';
						}else{
							sst = '<font style="color:#ccc;">继续批阅</font>';	
						}
						
						if(row.unsubmit_num!=0){
							sss = '<a style="color:blue;" href="#">提交提醒</a>';	
						}else{
							sss = '<font style="color:#ccc;">提交提醒</font>';
						}
						if(row.pi_num!=0){
							ssP = '<a style="color:blue;"  onclick="overPi('+index+');">查看批阅</a>';	
						}else{
							ssP = '<font style="color:#ccc;">查看批阅</font>';
						}
						return sst+'&nbsp;'+sss+'&nbsp;'+ssP;
						/*if(row.unsubmit_num==0&&((parseInt(row.submit_num)-parseInt(row.pi_num))==0)){
							return '<font style="color:#ccc;">继续批阅</font>&nbsp;<font style="color:#ccc;">提交提醒</font>';
						}else if(row.unsubmit_num!=0&&((parseInt(row.submit_num)-parseInt(row.pi_num))==0)){
							return '<font style="color:#ccc;">继续批阅</font>&nbsp;<a style="color:blue;" href="#">提交提醒</a>';
						}else if(row.submit_num!=0&&(row.submit_num==row.pi_num)){
							return '<a style="color:blue;"  onclick="JiXuPi('+index+');">继续批阅</a>&nbsp;<font style="color:#ccc;">提交提醒</font>';	
						}else if(row.unsubmit_num==0&&((parseInt(row.submit_num)-parseInt(row.pi_num))!=0)){
							return '<a style="color:blue;"  onclick="JiXuPi('+index+');">继续批阅</a>&nbsp;<font style="color:#ccc;">提交提醒</font>';
						}else if(row.unsubmit_num!=0&&((parseInt(row.submit_num)-parseInt(row.pi_num))!=0)){
							return '<a style="color:blue;"  onclick="JiXuPi('+index+');">继续批阅</a>&nbsp;<a style="color:blue;" href="#">提交提醒</a>';	
						}*/
						
			            
			        } else {
			            return "word"
			            // return "<a  href=\"#\"  onclick=\"SendingMessages('" + row.id + "','" + index + "')\" style=\" position:relative\">发送消息</a>";
			        }
			    }
			},
			{ field: 'content', title: 'content', hidden:true },
			{ field: 'assign_id', title: 'assign_id', hidden:true },
			{ field: 'center_id', title: 'center_id', hidden:true },
			{ field: 'zone_id', title: 'zone_id', hidden:true },
			{ field: 'conditions', title: 'conditions',hidden:true }
        ]];
	 
	var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val();
	var url = 'Webversion + "/assign?pageno="+pageNumber+"&countperpage="+pageSize';
	 
	var datacc = {'action':'marking_list','center_id':centerAll.center_id,'zone_id':select_zoneid,'class_id':id };
	var functionres = 'Longding(result);';
		
	//加载列表  并且返回pager
    pager = datagridLoad('#tabPaperList',true,'#SerToolBar',tempcolumns,url,"GET","json",datacc,functionres) ;
	 
}


function Longding(result){
	
	 if (result.list != null) {
		var datalistTemp = [];
		$.each(result.list, function (i, n) {
			//name grade_id subject_id  tmod field creat_time asda sjdfjsd dwd
			//exam_id   assign_mode exam_type assign_type create_date  build_type  subject_id zone_id  center_id  grade  content  url
			var itemtemp = {};
			        
			itemtemp.name = n.name;          
			itemtemp.grade_id = n.grade;
			itemtemp.subject_id = n.subject_id; 
			itemtemp.tmod = n.exam_type;
			itemtemp.field = n.build_type;
			itemtemp.creat_time = n.create_date;
			itemtemp.assign_type = n.assign_type;
			 
			itemtemp.submit_num = n.submit_num;
			itemtemp.pi_num = n.pi_num;
			itemtemp.unsubmit_num = n.unsubmit_num;
			 
			itemtemp.asda = '参数';
			itemtemp.sjdfjsd = '参数';
			itemtemp.dwd = '参数';
			itemtemp.id = n.exam_id;
			itemtemp.assign_id = n.id;
			itemtemp.center_id = n.center_id;
			itemtemp.zone_id = n.zone_id;
			itemtemp.content = n.content;
			itemtemp.conditions = n.conditions;
			datalistTemp.push(itemtemp);
		});
		   
    }
	return datalistTemp;
	
}


function setclassName(){
	var select_zoneid =  $('#A_zones',window.parent.document).find("option:selected").val();
	 
	$.ajax({
		url: Webversion + '/assign',
		type: "GET",
		dataType: "json",
		async:false,
		data:{'action':'marking_list','center_id':centerAll.center_id,'zone_id':select_zoneid},
		success: function (result) {
			if(result.class_info!=""&&result.class_info!=null){
				
				 var  classnames = [];
				 $.each(result.class_info,function(i,n){
					 if(n.class_id!=""&&n.class_id!=null){
					 	classnames.push({'id':n.class_id,'name':decodeURIComponent(n.class_name)});
					 }
				 });
				 $('#classnames').combobox({
					data:classnames,
					valueField:'id',
					textField:'name',
					onLoadSuccess:function(){
						
						if(class_Cid!=null&&class_Cid!=""){
							 
							$('#classnames').combobox('setValue',class_Cid);
							
						}else{
							 
							$('#classnames').combobox('setValue',classnames[0].id);
						}
					},
					onChange:function(newsvalue,oldvalue){
						select_Test(newsvalue);
					}
				 });
			}
			
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});		
	 
}

function JiXuPi(index){
	 
	var rowData = ($('#tabPaperList').datagrid('getData').rows)[index];
	
	var temp_test = {'testname':rowData.name,'class_id':$('#classnames').combobox('getValue'),'classname':$('#classnames').combobox('getText'),'assign_id':rowData.assign_id,'exam_id':rowData.id,'center_id':rowData.center_id,'zone_id':rowData.zone_id,'exam_type':rowData.tmod,'subject_id':rowData.subject_id};
	  
	document.location.href = "ContinueRead.html?temp_test="+Base64.encode(JSON.stringify(temp_test));
}

function overPi(index){
	 
	var rowData = ($('#tabPaperList').datagrid('getData').rows)[index];
	
	var temp_test = {'testname':rowData.name,'class_id':$('#classnames').combobox('getValue'),'classname':$('#classnames').combobox('getText'),'assign_id':rowData.assign_id,'exam_id':rowData.id,'center_id':rowData.center_id,'zone_id':rowData.zone_id,'exam_type':rowData.tmod,'subject_id':rowData.subject_id};
	  
	document.location.href = "Assessment_Reader_one.html?SEa=2&temp_test="+Base64.encode(JSON.stringify(temp_test));
}








