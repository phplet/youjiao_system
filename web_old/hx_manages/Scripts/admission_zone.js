// JavaScript Document
var UserInfo=null;
var centerAll=null;

$().ready(function() {
    UserInfo = $.evalJSON($.cookie("UserInfo"));
	centerAll = $.evalJSON($.cookie("centerAll"));
	sel_zone();
	KindEditor.ready(function(K) {
		var uploadbutton = K.uploadbutton({
			button : K('#uploadButton')[0],
			fieldName : 'imgFile',
			url : '../kindeditor-4.1.7/php/upload_json.php?dir=image',
			afterUpload : function(data) {
				 
				if (data.error === 0) {
					var url = K.formatUrl(data.url, 'absolute');
					K('#url').val(url);
					$('#img_show').attr("src",'../..'+url);
				} else {
					alert(data.message);
				}
			},
			afterError : function(str) {
				alert('自定义错误信息: ' + str);
			}
		});
		uploadbutton.fileBox.change(function(e) {
			uploadbutton.submit();
		});
	});
});

//查询zone
function sel_zone(){
	var imgurl = $('#img_show').attr('src');
	var zone_address = $('#zone_address').val();
	var zone_tel = $('#zone_tel').val();
	var zone_Persion = $('#zone_Persion').val();
	var url_type ='/test_comment';
	var Qjson = {'action':'get_school_info','center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
	var flag_res = Ajax_option(url_type,Qjson,"GET");
	if(flag_res.list!=false){
		var list_res = flag_res.list;
		$('.upload').attr("cid",list_res.id);
		$('#save_id').hide();
		$('#editer_id').show();
		$('#img_show').attr('src',list_res.url);
		$('#zone_address').val(list_res.address);
		$('#zone_tel').val(list_res.tel);
		$('#zone_Persion').val(list_res.contacts);
	}else{
		$('#save_id').show();
		$('#editer_id').hide();	
	}
}



//保存
function save_zone(){
	var imgurl = $('#img_show').attr('src');
	var zone_address = $('#zone_address').val();
	var zone_tel = $('#zone_tel').val();
	var zone_Persion = $('#zone_Persion').val();
	var url_type ='/test_comment';  
	var Qjson = {'action':'add_school_info','url':imgurl,'address':zone_address,'tel':zone_tel,'contacts':zone_Persion,'id':UserInfo.id,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
	if($('.upload').attr("cid")){
		Qjson = {'action':'modify_school_info','url':imgurl,'address':zone_address,'tel':zone_tel,'contacts':zone_Persion,'id':$('.upload').attr("cid")};
		 
	}	
	var flag_res = Ajax_option(url_type,Qjson,"POST");
	if(flag_res.flag){
		if($('.upload').attr("cid")){
			$.messager.alert('温馨提示','修改成功！','info');
		}else{
			$.messager.alert('温馨提示','添加成功！','info');	
		}	
		
		$('.upload').attr("cid",flag_res.id);
		$('#save_id').hide();
		$('#editer_id').show();
		
	 
	}
	
}