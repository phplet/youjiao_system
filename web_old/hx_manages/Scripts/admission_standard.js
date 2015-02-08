// JavaScript Document
var UserInfo=null;
var centerAll=null;

$().ready(function() {
    UserInfo = $.evalJSON($.cookie("UserInfo"));
	centerAll = $.evalJSON($.cookie("centerAll"));
	sel_demo_type(); 
});




//查询demo
function sel_demo(valueTemp){
	 
	var url_type ='/test_comment';
	var Qjson = {'action':'get_test_comment_detail','tcid':valueTemp};
	var flag_res = Ajax_option(url_type,Qjson,"GET");
	if(flag_res.list!=null){
		
		var fhtmlsT = ''; 
		$.each(flag_res.list,function(i,n){
			
			fhtmlsT += '<li><div class="demo_list_f"><span class="text_fontL" onclick="edit_content(this);">'+n.detail_content+'</span><span class="text_arr" style="display:none; "><textarea rows="10" cols="68"></textarea><a style="display:block; text-align:center;" onclick="savedemo(this);" cid="'+n.id+'">保存</a></span></div><div class="demo_list_r"><a href="javascript:void(0)" onclick="add_demo(0);">增加</a>&nbsp;&nbsp;<a href="javascript:void(0)" onclick="dele_demo(this);" cid="'+n.id+'">删除</a></div><div class="cleared"></div></li>';
			
		});
		$('#demo_list ul').html(fhtmlsT); 
		
	}else{
		$('#demo_list ul').html('<li>此类型没有评语模板，请<a href="javascript:void(0)" onclick="add_demo(0);">添加</a></li>');	
	}
	
}

//编辑demo
function edit_content(ef){
	var efhtml = $(ef).html();
	$(ef).hide();
	$(ef).next('span').show();
	$(ef).next('span').children('textarea').val(efhtml);	
	
}

//保存demo
function savedemo(et){
	var ethtml = $(et).prev('textarea').val();
	var demo_id = $(et).attr('cid');
	$(et).parent('span').hide();
	$(et).parent('span').prev('span').show();
	$(et).parent('span').prev('span').html(ethtml);
	var url_type ='/test_comment'; 
	var Qjson = {'action':'modify_test_comment_detail','detail_content':ethtml,'id':demo_id};
	var flag_res = Ajax_option(url_type,Qjson,"POST");
	if(flag_res.flag){
		$.messager.alert('温馨提示','修改评语模板成功!','info');	
	}
}


//增加demo
function add_demo(add_e){
	var tcid = $('#demo_type').combobox('getValue');
	var url_type ='/test_comment';
	var Qjson = {'action':'add_test_comment_detail','detail_content':'点击我,修改评语模板内容!','tcid':tcid};
	var flag_res = Ajax_option(url_type,Qjson,"POST");
	if(flag_res.flag){
		$.messager.alert('温馨提示','增加评语模板成功!','info');	
		sel_demo(tcid);
	}
	
}

//删除demo
function dele_demo(del_e){
	var tcid = $(del_e).attr('cid');
	var url_type = '/test_comment';
	var Qjson = {'action':'remove_test_comment_detail','id':tcid};
	var flag_res = Ajax_option(url_type,Qjson,"POST");
	if(flag_res.flag){
		$.messager.alert('温馨提示','删除评语模板成功!','info');	
		$(del_e).parent().parent().remove();
		if($('#demo_list ul').children().length==0){
			$('#demo_list ul').html('<li>此类型没有评语模板，请<a href="javascript:void(0)" onclick="add_demo(0);">添加</a></li>');		
		}
	}
	
	 
}

//查询demo类型
function sel_demo_type(demotype_id){
	 
	var url_type ='/test_comment';
	var Qjson = {'action':'get_test_comment','center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
	var flag_res = Ajax_option(url_type,Qjson,"GET");
	var demo_types = [];
	if(flag_res.list!=null){
		$.each(flag_res.list,function(i,n){
			demo_types.push({'id':n.id,'name':n.name});
		});
	}else{
		var demo_typesTs = [{'id':0,'name':'学力评测'},{'id':1,'name':'建议学习规划'}];
		$.each(demo_typesTs,function(i,n){
			var url_type ='/test_comment';
			var Qjson = {'action':'add_test_comment','name':n.name,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val(),'user_id':UserInfo.id};
			var flag_res = Ajax_option(url_type,Qjson,"POST");
			if(flag_res.flag){
				demo_types.push({'id':flag_res.id,'name':n.name});
			}
		});
		
	
	}
	$('#demo_type').combobox({
		data:demo_types,
		valueField:'id',
		textField:'name',
		onLoadSuccess:function(){
			if(demotype_id!=null&&demotype_id!=""&&demotype_id!=undefined){
				$('#demo_type').combobox('setValue',demotype_id);
			}else{
				$('#demo_type').combobox('setValue',demo_types[0].id);
			}
			
		},
		onChange:function(newvalue,oldvalue){
			sel_demo(newvalue);
		}
	});
	
}


//修改demo类型
function update_demo_type(){
	$.messager.prompt('温馨提示','确定要修改-<'+$("#demo_type").combobox("getText")+'>-吗？',function(b){
		if(b){
			if($('.messager-input').val()!=""&&$('.messager-input').val()!=null){
				var url_type ='/test_comment';
				var Qjson = {'action':'modify_test_comment','name':$('.messager-input').val(),'id':$("#demo_type").combobox("getValue")};
				var flag_res = Ajax_option(url_type,Qjson,"POST");
				$.messager.alert('温馨提示','修改评语类型成功!','info');
				sel_demo_type($("#demo_type").combobox("getValue"));
			}
		}		
	});
	$('.messager-input').val($("#demo_type").combobox("getText"));
	
	
}

//删除demo类型
function dele_demo_type(){
	$.messager.confirm('温馨提示','如果删除"'+$("#demo_type").combobox("getText")+'",此类型下的评语模板也自动删除。<br />确定要删除-<'+$("#demo_type").combobox("getText")+'>-吗?',function(b){
		if(b){
			var url_type ='/test_comment';
			var Qjson = {'action':'remove_test_comment','tcid':$("#demo_type").combobox("getValue")};
			var flag_res = Ajax_option(url_type,Qjson,"POST");
			if(flag_res.flag){
				$.messager.alert('温馨提示','删除评语类型成功!','info');
				sel_demo_type();	
			}
			
		}	
	});
}


//增加demo的类型
function add_demo_type(){
	
	$.messager.prompt('新增评语模板','请输入评语模板名称', function(b){
		
		if(b){
			var testname = $('.messager-input').val();    
			var url_type ='/test_comment';
			var Qjson = {'action':'add_test_comment','name':testname,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val(),'user_id':UserInfo.id};
			var flag_res = Ajax_option(url_type,Qjson,"POST");
			if(flag_res.flag){
				$.messager.alert('温馨提示','增加评语模板名称成功!','info');
				sel_demo_type();
			}else{
				
			}
		}
	});
	$('.messager-icon').hide();
}

