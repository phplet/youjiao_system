 

var UserInfo = {};
var centerAll = {};
var temp_data_S = "";
$(document).ready(function () {

    UserInfo = $.evalJSON($.cookie("UserInfo"));
	centerAll = $.evalJSON($.cookie("centerAll"));
	
	var temp_data = getUrlParam("data");    
	if(temp_data!=null&&temp_data!=undefined&&temp_data!=""){
		temp_data_S = $.parseJSON(Base64.decode(temp_data));
		//alert(JSON.stringify(temp_data_S));
	}
	if(UserInfo.level==2||UserInfo.level==4){   
		var htmlsT = '<li class="hx_Schooltop_nbsp">&nbsp;</li><li class="hx_Schooltop_Scname" style="width:auto">学校名称：<span class="hx_text001">'+centerAll.center_name+'</span>&nbsp;</li><li class="hx_Schooltop_Scname" style="width:auto;">校区名称：<span class="hx_text001">'+$('#A_zones',window.parent.document).find("option:selected").text()+'</span>&nbsp;</li><li class="hx_Schooltop_Scname" style="width:auto">用户名：<span class="hx_text001">'+temp_data_S.stu_Name+'</span>&nbsp;</li><li class="hx_Schooltop_Scname" style="width:auto">姓名：<span class="hx_text001">'+temp_data_S.stu_Real+'</span>&nbsp;</li><li class="hx_Schooltop_Scname" style="width:60px;">性别：<span class="hx_text001">'+(temp_data_S.stu_Sex==1?"男":"女")+'</span></li>';
		if(temp_data_S.type==1){
			htmlsT+='<li class="hx_Schooltop_Scname" style="width:100px; text-align:center;">&nbsp;<a href="../Corrects/Students_Work.html">返回上一级</a></li>';
		}else{
			htmlsT+='<li class="hx_Schooltop_Scname" style="width:100px; text-align:center;">&nbsp;<a href="../TeachingAffairs/Teaching_MyStudent.html">返回上一级</a></li>';
		}
		$('#test_ping').html(htmlsT);
	}
     
	 var columnsjson = [[
		    { field: 'sendTime', title: '派送时间', width: 120, align: 'center', sortable: true },
			{field: 'title', title: '测评/作业标题', width:120, align: 'center'},
			{field: 'subject', title: '学科/课程', width: 80, align: 'center',formatter: function (value, row, index) {
                    var html = '';
                    if (value != null) {
                         html = subject_sum(parseInt(value));
                    }
                    return html;
                }
			},
			{field: 'classname', title: '班级名称', width: 80, align: 'center'},
			{field: 'teacher', title: '任课教师', width: 80, align: 'center'},
			{field: 'center_id', title: '学校ID', width: 80, align: 'center',hidden:true},
			{field: 'zone_id', title: '校区ID', width: 80, align: 'center',hidden:true}, 
			{field: 'class_id', title: 'class_id', width: 80, align: 'center',hidden:true},
			{field: 'teacher_id', title: 'teacher_id', width: 80, align: 'center',hidden:true},
			{field: 'exercise_id', title: 'exercise_id', width: 80, align: 'center',hidden:true},
			{field: 'assign_id', title: 'assign_id', width: 80, align: 'center',hidden:true},
			{field: 'end_date', title: 'end_date', width: 80, align: 'center',hidden:true},
			{ field: 'score', title: '得分率(%)', width: 80, align: 'center', sortable: true  ,
                formatter: function (value, row, index) {
                    var html = '';
					 
                    if(row.type!=3){
						 html = '--';
					}else{
						html = value;
					}
					
                    return html;
                }
			},
            {
                field: 'type', title: '状态', width: 80, align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
					var dd = date_Diff_day(row.end_date.substring(0,10),getNowDate());
					 
                    if(dd==1){
						 value = 0;
					}
					 
					html = status_sum(parseInt(value));
                    return html;
                }
            }
			
        ]];
	//加载测评详情数据列表
	 
	var url= 'Webversion + "/test/list/all?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc = {'assign_type':3,'creator':temp_data_S.teacher_creator,'user_id':temp_data_S.stu_user_id,'class_id':temp_data_S.class_id};
	var functionres = 'Longding(result);';
	 
	//加载列表  并且返回pager
	pager = datagridLoad('#Teacher_Ma',true,"#SerToolBar",columnsjson,url,"GET","json",datacc,functionres) ;
	 

    // 绑定搜索事件
    $("#BtnSearch").click(function () {

        if ($("#SchoolText").attr("innt") == "1") {
            $.messager.alert('温馨提示', '请输入校区或教学主任名称再搜索！', 'info');
            return;
        }

        $.messager.progress({ text: '正在搜索校区信息' });

        $('#Educational_Set').datagrid("getPager").pagination("select", 1);

        $.messager.progress('close');

    });

     

});

 

function Longding(result) {
 	var datalistTemp = [];
	if (result.test != null) {
		$.each(result.test,function(i,n){
			var itemtemp = {}; 
			itemtemp.sendTime = n.assign_date;
			itemtemp.title = n.name;
			itemtemp.subject = n.subject_id;
			itemtemp.classname = temp_data_S.class_name;  	
			itemtemp.teacher = n.teacher_name;
			itemtemp.center_id = temp_data_S.center_id;
			itemtemp.zone_id = temp_data_S.zone_id;
			itemtemp.class_id = n.class_id;
			itemtemp.teacher_id = "";
			if(n.exam_type==1){
				itemtemp.score = parseFloat((parseInt(n.my_score))*100/parseInt($.parseJSON(n.conditions).score)).toFixed(2);
			}else{
				itemtemp.score = parseFloat(n.my_score).toFixed(2);
			}
			 
			itemtemp.type = n.type;
			itemtemp.end_date = n.end_date;
			itemtemp.id = n.study_exercise_id;
			itemtemp.exercise_id = n.exercise_id;
			itemtemp.assign_id = n.assign_id;
			datalistTemp.push(itemtemp);
		});
           
    }
	return datalistTemp;
}
 