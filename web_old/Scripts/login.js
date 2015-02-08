$(document).ready(function () {
 changeCode();
});


function logins (){
	var username = $('.Login_ct input[name="username"]').val();	
	var userpassword = $('.Login_ct input[name="userpassword"]').val();
	var checked_name = $('.Login_ct input[name="checked_name"]').val();	
	var checkCode = $('.userinput_checked').val();
	if($.trim(username)==""){layer.alert('用户名不能为空!',8,'温馨提示'); changeCode();	return false;}
	if($.trim(userpassword)==""){layer.alert('密码不能为空!',8,'温馨提示'); changeCode();	return false;}
	if($.trim(checkCode)!=""){
		var flagsT = Ajax_option('/image_validation',{'action':'check_code','code':checkCode},"POST",false);
		if(flagsT){
			var cookieOptions = { path: "/", expires: -1 };
			$.cookie("AuthToken", null, cookieOptions);
			$.cookie("UserInfo", null, cookieOptions);
	
			var authorization = { "logintype": 2, "password": "123", "username": "l@b.com", "remember": true, "auto": true };
			var tempath = { password: userpassword, username: username, remember: true, auto: true };
			jQuery.extend(authorization,tempath);
			
			var token = { "logintype": 2, "password": "123", "username": "l@b.com" };
			jQuery.extend(token, authorization);
			//alert(JSON.stringify(token));
			token.password = sha256_digest(token.password);
			
			token = Base64.encode($.toJSON(token));
			
			if (authorization.remember) {
				$.cookie("UserName", authorization.username, { path: "/", expires: 60 * 24 * 365 });
			}
			else {
				$.cookie("UserName", null, { path: "/" });
			}
			var roannumber = parseInt(1000000 * Math.random());
			$.cookie("AuthToken", token, { path: "/" });//把加密登录信息保存在cookie为AuthToken中
			 var url_type = '/user?r='+roannumber;
			 var Qjson = {};
			 var results =  Ajax_option(url_type,Qjson,"GET",false);
			 
			 if(results.username){
				 token = { "logintype": 1, "token": results.token, "username": results.username };
				  cookieOptions = { path: "/" };
				  
				  if (authorization.auto) {
					  cookieOptions = { expires: 30, path: "/" };
				  }
				  if(results.usr_type!=1){
					 if(results.user_status==1){		 
						var version_level = '';
						if(results.center_type!=null&&results.center_type!=""&&results.center_type!=undefined){
							version_level = Base64.encode(results.center_type);
						}else{
							version_level = Base64.encode('2');
						}
						 
						$.cookie("AuthToken", Base64.encode($.toJSON(token)), cookieOptions); 
						$.cookie("UserInfo", $.toJSON(results), cookieOptions);
						$.cookie("version_level", version_level, cookieOptions); 
						$.cookie("nick", "",cookieOptions);
						$.cookie("UsersId" ,"", cookieOptions); 
						if(results.level==8){
							window.location.href = "manage_system/verify.php?action=login&AuthToken=" + $.cookie("AuthToken");
						}else{
						   window.location.href = "hx_manages/Index.html?r=" + roannumber;  
						}
					
					}else {
						layer.alert('您的账号已经被禁用!',8,'温馨提示');
						changeCode();
					}  
				  }else {
					$.cookie("AuthToken", Base64.encode($.toJSON(token)), cookieOptions);
					$.cookie("UsersId", results.id, cookieOptions);
					//$.cookie("center_info", $.toJSON(result.center_info), cookieOptions);
					$.cookie("version_level","",cookieOptions); 
					results.student_class = {};
					$.cookie("UserInfo", $.toJSON(results), cookieOptions);
					$.cookie("nick",results.nick, cookieOptions); 
					window.location.href = "/student/Index.html?r=" + roannumber;  
				 }
				 
			 }
			 
			 if(results.user_status==0){
				 layer.alert('您的账号已经被禁用!',8,'温馨提示');
				 changeCode();
			 }
			 
		}else{
			layer.alert('验证码错误',8,'温馨提示');	
		}
	}else{
		layer.alert('验证码不能为空!',8,'温馨提示');	
		
	}
}


//查询账号的学校和校区id  name  保存在cookle中
function selCenter_Zone(cssid,Uid){
	$.ajax({
		url: Webversion + "/center_zone_admin?r="+$.getRom(),
		type: "GET",
		dataType: "json",
		data:{'action':'some_list','user_id':Uid,'status':'1'},
		beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
		},
		success: function (result) {
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
                        window.location.href = "Login.html";
                });
			 }
			 $(cssid).html(htmls);
			 var centerAll = {'center_id':result[0].center_id,'center_name':result[0].center_name,'zone_id':result[0].zone_id};
			 var cookieOptions_1 = { expires: 1, path: "/" };
			 $.cookie("centerAll",$.toJSON(centerAll),cookieOptions_1);
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


function changeCode(){
	var url_type = '/image_validation?action=get_code&time='+$.getRom();
	/*$.ajax({
		url: Webversion + url_type,
		type: "GET",
		async:false
	});	*/
	$('#code_img').attr("src",'/restAPI3.0'+url_type);
}