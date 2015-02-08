var UserInfo = null;
var class_Cid = null;
$().ready(function () {
   
 	UserInfo = $.evalJSON($.cookie("UserInfo")); //取得登录人信息
	var UserLevel = parseInt(UserInfo.level);  //登录人的权限
    centerAll = $.evalJSON($.cookie("centerAll")); //取得学校信息	

	$('#center_name_1').html(centerAll.center_name+'&nbsp;：'+$('#A_zones',window.parent.document).find("option:selected").text()); 
	 class_Cid = getUrlParam("cid");
	  
	class_stu_name(UserInfo.id); 
 	stu_class_M(1);
	 
	//判断classid是否为空  不为空  直接赋值给多选框
 	if(class_Cid!=null&&class_Cid!=""){
		$('input[type=checkbox][class='+class_Cid+']').attr("checked",true);	
		var ss = $('.'+class_Cid).attr("name");
		$('.'+ss+' input[type=checkbox]').attr("checked",true);
	}
	

});//.ready的结束标签




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
		
	}
	
	
	//判断classid是否为空  不为空  直接赋值给多选框
	if(class_Cid!=null&&class_Cid!=""){
		$('input[type=checkbox][class='+class_Cid+']').attr("checked",true);	
		var ss = $('.'+class_Cid).attr("name");
		$('.'+ss+' input[type=checkbox]').attr("checked",true);
	}
	
}

//选试卷
 function NextSendwer(){
	 
	var td_1box = $('#sentobj_class tr').find('td:first input');  
	var class_stus = [];
	var class_name = "";
	var stu_names = "";
	var stu_ids_2 = [];
	var stu_ids_3 = [];
	var type_select = 1;
	 
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
			class_name += $(e2).attr("class_name")+"&nbsp;";
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
	
	if(type_select==1){
		stu_ids_2 = unique(stu_ids_2);
		$.each(stu_ids_2,function(ii,nn){
			$.each(stu_ids_3,function(iii,nnn){
				if(nn==nnn.stu_id){
					stu_names += nnn.stu_name+"&nbsp;";
					return true;
				}
			});
		});
		class_name = stu_names;
	}
	var stu_temp = {'type_select':type_select,'class_name':class_name,'class_stus':class_stus};
	  
	if(class_stus!=""){
		document.location.href = "SendStuList.html?data="+Base64.encode(JSON.stringify(stu_temp));
	}else {
		$.messager.alert('温馨提示','必须选一个班级或者一个学生!','info');	
	}
	
	//$("#labHuanSe").css('color','blue');
}
 