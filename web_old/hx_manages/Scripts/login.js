/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/Scripts/jquery.json.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/Common.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.Plug.js"/>

$(document).ready(function () {

    if ($.cookie("UserName")) {
        $("#username").val($.cookie("UserName"));
    };

    $('#loginWin').dialog({
        buttons: [{
            text: '登录',
            iconCls: 'icon-ok',
            handler: function () {

                if (!$("#LoginForm").form('validate')) return;

                //  开始登录系统
                if (!$(document).login({ password: $("#password").val(), username: $("#username").val(), remember: $("#checkUserName").attr("checked"), auto: $("#checkboxPassword").attr("checked") })) {
                    return;
                }
				 
               var roannumber = parseInt(1000000 * Math.random());
			    
			   var UserInfos = $.parseJSON($.cookie("UserInfo"));
			   if(UserInfos.usr_type!=1){
				   if(UserInfos.level==8){
						window.location.href = "/manage_system/verify.php?action=login&AuthToken=" + $.cookie("AuthToken");
				   }else{
					   window.location.href = "/hx_manages/Index.html?r=" + roannumber;  
				   }
			   }else{
					window.location.href = "/student/Index.html?r=" + roannumber;
			   }
            }
        }/*, {
            text: '注册',
            iconCls: 'icon-add',
            handler: function () {
                var roannumber = parseInt(1000000 * Math.random());
                window.location.href = "Register.html?r=" + roannumber;
            }
        },
        {
            text: '忘记密码？',
            plain: true,
            handler: function () {
                window.location.href = "GetPwd.html?r=" + $.getRom();
            }
        }*/]
    });

    $("#password").keydown(function (event) {
        var code = event.keyCode || event.which || event.charCode;
        if (code == 13) {
            var obj = $('#loginWin').dialog('options');
            obj.buttons[0].handler();
        }
    });
	
	
	
	//账户设置
	$("#userSetInfo").click(function(){
		ChangeThisTab("账户设置", 'Password.html');
		 
	});
	
	
});


//查询账号的学校和校区id  name  保存在cookle中
function selCenter_Zone(cssid,Uid){
	$.ajax({
		url: Webversion + "/center_zone_admin",
		type: "GET",
		dataType: "json",
		async:false,
		data:{'action':'some_list','user_id':Uid,'status':'1'},
		beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
		},
		success: function (result) {
			var centerAll = {'center_id':result[0].center_id,'center_name':result[0].center_name,'zone_id':result[0].zone_id};
			 var cookieOptions_1 = { expires: 1, path: "/" };
			 $.cookie("centerAll",$.toJSON(centerAll),cookieOptions_1);
			 var htmls ='<option value="0">校区选择</option>';
			 if(result!=null){
			    
			 	$.each(result,function(i,item){
					if(item.zone_id!=null&&item.zone_name!=null){
						if(i==0){
							htmls+= '<option value="'+item.zone_id+'" selected="selected" >'+item.zone_name+'</option>';
						}else{
							htmls+= '<option value="'+item.zone_id+'" >'+item.zone_name+'</option>';
						}
					}
		     	});
			 }else{
				 
				$.messager.confirm('温馨提示', '此账号当前没有校区!请确认你的账号！', function (r) {
                        var cookieOptions = { path: "/", expires: -1 };
                        $.cookie("AuthToken", null, cookieOptions);
                        $.cookie("UserInfo", null, cookieOptions);
                        window.location.href = "../index.html";
                });
			 }
			 $(cssid).html(htmls);
			 
		},
		error: function (result) {
			
			$.messager.alert('温馨提示', '账号异常：<br/>1.账号在别的地方登录，重新登录；<br/>2.网络加载失败,测试网络是否畅通。','warning');
		}
	});
	
}


//分校区选择校区刷新右边相应的页面 
function selupdata(sel_id){
	if(sel_id!=0){
		var cookieOptions_1 = { expires: 1, path: "/" };
		var centerAll = $.evalJSON($.cookie("centerAll"));
		centerAll['zone_id'] = sel_id;
		$.cookie("centerAll",$.toJSON(centerAll),cookieOptions_1);
		var seljson = $('#feature').tree('getSelected');
		var src ={};
		var text = "";
		if(seljson!=null){
			text = seljson.text;
			src = seljson.attributes;
		}else{
			text = "首页";
			 
			src = {'url':'HomePage.html'};
		}
		ChangeThisTab(text, src.url);
	}
	//window.location=ss.attributes.url;
	
	//{"id":8,"text":"教师管理","attributes":{"url":"TeachingAffairs/Teacher_Ma.html"},"target":{"jQuery17209117765327934775":54},"checked":false}



}

//选中
function tree_select(typename){
	var tree_ch = $('#feature li .tree-node-selected').text();
	if(typename!=tree_ch){
		var tree_list = $('#feature li div').toggleClass("tree-node-selected",false);
		$('#feature li div').each(function(index, element) {
			if($(this).text()==typename){
				$(this).addClass("tree-node-selected");
			}
		});
		var parent_dom = $('#feature').tree('getParent',$('#feature').tree('getSelected').target);
		if(parent_dom!=""&&parent_dom!=null&&parent_dom!=undefined){
			$('#feature').tree('expand',parent_dom.target);
		}
		 
	}
}
