var UserInfo = {};
var centerAll = {}; 
var pager ="";
var subss_Data_temp =[];
$().ready(function () {
	 
    UserInfo = $.evalJSON($.cookie("UserInfo"));
	centerAll = $.evalJSON($.cookie("centerAll"));
	$('#center_name').html(UserInfo.center_name);
    $("#addAbility").hide();
    var columnsjson = [[   
		    { field: 'abilityName', title: '能力维度', width: 120, align: 'center', sortable: true },
			{ field: 'abilityInfo', title: '能力维度简述', width: 170, align: 'center'},
			{ field: 'abilitySubject',  title: '适用学科', width: 100, align: 'center',
				formatter: function (value, row, index) {
                    var htmls = '';
                    if (value != null) {
                        $.each(value.split(","), function (i, t) {
                            
                            htmls += subject_sum(parseInt(t))+",";
                        });
						htmls = htmls.substring(0,htmls.length-1);
                    }
					
                    return htmls;
                } },
			 
			{ field: 'abilityExp', title: '等级说明', width: 250, align: 'center', sortable: true },
			{ field: 'alllevel', title: 'alllevel', width: 250, align: 'center', hidden:true},
			 
            {
                field: 'mobile', title: '状态', width: 80, align: 'center',
                formatter: function (value, row, index) {
                    var html = '';
                    if (value != null) {
                         html = value == 1 ? '已启用/<a onclick="changeabli_status(' + row.abilityId + ',0)">禁用</a>' : '<font color="#ccc">已禁用</font>/<a onclick="changeabli_status(' + row.abilityId + ',1)">启用</a>';
                    }
                    return html;
                }
            },
            {
                field: 'abilityId', title: '操作', align: 'center',width: 50,
                formatter: function (value, row, index) {
                    var s = "<a href=\"#\" style='color:blue;' onclick=\"editAbility(" + index + ")\">修改</a>";
     
                    return s;
                }
            }
        ]];

		var url = 'Webversion + "/ability?pageno="+pageNumber+"&countperpage="+pageSize';
		var datacc = {'action':'list','center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
		var functionres = 'Longding(result);';
		
		//加载列表  并且返回pager
    	pager = datagridLoad('#ability_list',true,'#SerToolBar',columnsjson,url,"GET","json",datacc,functionres) ;
 
		// 绑定创建新校区事件
		$("#BtnAdd").click(function () {
			 
			$("#addAbility").show();
			alertCreate("#addAbility",'添加新的能力维度',520,330,'openfunction()','handfunction()','保存','取消');
			$('#addAbility').dialog('open');
	
		});
	
		$('#subject_id').combobox({
			data:subss_Data_temp,
			valueField:'id',
			textField:'name',
			onChange:function(newvalue,oldvalue){
				if(newvalue!='请选择'){
					var dataccc = {'action':'list','center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val(),'subject_id':newvalue};
					pager = datagridLoad('#ability_list',true,'#SerToolBar',columnsjson,url,"GET","json",dataccc,functionres) ;
				}
			}	
		});	
	

});

 

//加载列表

function Longding(result){
	 var datalistTemp = [];

	if (result.list != null) {
		var subject_Data = [{'id':'请选择','name':'请选择'}]
		var subject_IDS = new Array();
		$.each(result.list,function(i,n){
				var itemtemp = {};
				 
				//var gradehtml = '<div class="ability_E"><ul><li class="ability_exp">A</li><li class="ability_exp">B</li><li>C</li></ul></div>';
				var exphtml = '<div class="ability_G"><ul><li class="ability_grade">A:'+n.a_level+'</li><li class="ability_grade">B:'+n.b_level+'</li><li >C:'+n.c_level+'</li></ul></div>';
				 
				itemtemp.abilityName = n.ability_name;
				itemtemp.abilityInfo = n.instruction;
				itemtemp.abilitySubject = n.subject_id;
				var subjectids_temp = (n.subject_id).split(",");
				$.each(subjectids_temp,function(iii,nnn){
					subject_IDS.push(nnn);
				});
				 
				//itemtemp.abilityGrade = gradehtml;
				itemtemp.abilityExp = exphtml;
				itemtemp.alllevel = n.a_level+"$utf-8$"+n.b_level+"$utf-8$"+n.c_level;
				itemtemp.mobile = n.status;
				itemtemp.abilityId = n.id;
				datalistTemp.push(itemtemp);
		
		});
		var subject_IDS_TT = unique(subject_IDS);
		 
		$.each(subject_IDS_TT,function(ii,nn){
			subject_Data.push({'id':nn,'name':subject_sum(parseInt(nn))});
		});
		subss_Data_temp = subject_Data;
		 
		  
	}
	return datalistTemp;
}

//新增加能力维度初始化
function openfunction(){
	$('#abName').val("");
	$('#abinfo').val("");
	$('#addAbilityForm input[type=checkbox]').attr("checked",false);
	$('#a_level').val("");
	$('#b_level').val("");
	$('#c_level').val("");
	
	 
}

//新增加能力维度提交
function handfunction(){
	
	var abname = $('#abName').val();
	var abinfo = $('#abinfo').val();
	var subids = "";
	$('#addAbilityForm input[type=checkbox]:checked').each(function(index, element) {
		var sub_id = $(this).val();
		if(sub_id!=null&&sub_id!=""){
        	subids += sub_id+",";
		}
	});
	
	var a_level = $('#a_level').val();
	var b_level = $('#b_level').val();
	var c_level = $('#c_level').val();
	 
	if(abname!=""&&abinfo!=""&&subids!=""&&a_level!=""&&b_level!=""&&c_level!=""&&$.trim(abname)!="限定10字内"&&$.trim(abinfo)!="限定100字内"&&$.trim(a_level)!="限定100字内"&&$.trim(b_level)!="限定100字内"&&$.trim(c_level!="限定100字内")){
		if(subids!=""&&subids!=null){
			subids = subids.substring(0,subids.length-1);
		}
		var url_type = '/ability';
		var Qjson = {'action':'add','ability_name':abname,'instruction':abinfo,'subject_id':subids,'a_level':a_level,'b_level':b_level,'c_level':c_level,'user_id':UserInfo.id,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
		 
		var res = Ajax_option(url_type,Qjson,"POST");
		if(res.flag){
			$.messager.alert('温馨提示','新的能力维度添加成功!','info');	
			$('#addAbility').dialog('close');
			$("#addAbility").hide();	
			window.location="Ability.html"; 
		}else{
			$.messager.alert('温馨提示','新的能力维度添加失败!','info');	
		}
		 
	}else{
		$.messager.alert('温馨提示','必须填写,不能为空!','info');	
	}
	
}

//修改能力维度
function editAbility(indx){
	var rowData = JSON.stringify(($('#ability_list').datagrid('getData').rows)[indx]);
	 
	$("#addAbility").show();
	var openupdates = "openupdate("+rowData+")";
	var handupdates = "handupdate("+rowData+")";
	alertCreate("#addAbility",'修改能力维度',520,330,openupdates,handupdates,'修改','取消');
	$('#addAbility').dialog('open');
}


//修改能力维度初始化
function openupdate(data){
	 
	$('#abName').val(data.abilityName);
	$('#abinfo').val(data.abilityInfo);
	var subids = (data.abilitySubject).split(",");
	$.each(subids,function(i,n){
		$('#addAbilityForm input[type=checkbox][value='+n+']').attr("checked",true);
	});
	//$('#addAbilityForm input[type=checkbox]').attr("checked",false);
	var alllevel = data.alllevel;
	alllevel = alllevel.split("$utf-8$");
	$('#a_level').val(alllevel[0]);
	$('#b_level').val(alllevel[1]);
	$('#c_level').val(alllevel[2]);
	
	 
}

//修改能力维度提交
function handupdate(datas){
	 
	var abname = $('#abName').val();
	var abinfo = $('#abinfo').val();
	var subids = "";
	$('#addAbilityForm input[type=checkbox]:checked').each(function(index, element) {
		var sub_id = $(this).val();
		if(sub_id!=null&&sub_id!=""){
        	subids += sub_id+",";
		}
	});
	
	var a_level = $('#a_level').val();
	var b_level = $('#b_level').val();
	var c_level = $('#c_level').val();
	 
	if(abname!=""&&abinfo!=""&&subids!=""&&a_level!=""&&b_level!=""&&c_level!=""&&$.trim(abname)!="限定10字内"&&$.trim(abinfo)!="限定100字内"&&$.trim(a_level)!="限定100字内"&&$.trim(b_level)!="限定100字内"&&$.trim(c_level!="限定100字内")){
		if(subids!=""&&subids!=null){
			subids = subids.substring(0,subids.length-1);
		}
		var url_type = '/ability';
		var Qjson = {'action':'modify','ability_name':abname,'instruction':abinfo,'subject_id':subids,'a_level':a_level,'b_level':b_level,'c_level':c_level,'user_id':UserInfo.id,'id':datas.abilityId};
		 
		var res = Ajax_option(url_type,Qjson,"POST");
		if(res.flag){
			$.messager.alert('温馨提示','修改能力维度成功!','info');	
			$('#addAbility').dialog('close');
			$("#addAbility").hide();	
			window.location="Ability.html"; 
		}else{
			$.messager.alert('温馨提示','修改能力维度失败!','info');	
		}
		 
	}else{
		$.messager.alert('温馨提示','必须填写,不能为空!','info');	
	}
	
}

//修改状态
function changeabli_status(id,status){
	var url_types = '/ability';
	var Qjsons = {'action':'change_status','status':status,'id':id};
	var res = Ajax_option(url_types,Qjsons,"GET");
	if(res.flag){
		$.messager.alert('温馨提示','能力维度状态修改成功!','info');	
		pager.pagination("select",1); 
	}else{
		$.messager.alert('温馨提示','能力维度状态修改失败!','info');		
	}
	
}


 