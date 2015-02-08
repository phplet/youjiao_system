var UserInfo = {};


$(document).ready(function () {
	 UserInfo = $.evalJSON($.cookie("UserInfo"));
	 $('.info_css input[type=text]').each(function(ft, fn) {
		  
        $(this).val("");
    });
	 $('#changesInfo').click(function(){
			jionStu();			 
		 
	});
});


function jionStu(){
	var flag_form = true;
	$('.fromstu').each(function(i, obj) {
         
		if($(obj).html().split('ok.gif').length==2){
			
		}else{
			flag_form = false;	
		}
    });
	
	
	if(!flag_form){
		layer.alert('数据格式不正确！',8,'温馨提示');
		return false;
	}else{
		var stuUName = $('#userName').val();
		var nick = $('#userNike').val();
		var stuRealName = $('#userRealname').val();
		var stusex = $('input[type=radio]:checked').val();
		var stuEmail = $('#userEmail').val();  
		var grade = $('#grade_select').val();
		var schoolName = $('#userSchool').val();
		var stuTel = $('#userphone').val();
		 
		var url_type ='/student?r='+$.getRom();
		var jsondata = {action:'add','center_id':0,'zone_id':0,'username':stuUName,'nickname':nick,'realname':stuRealName,'gender':stusex,'email':stuEmail,'grade':grade,'schoolName':schoolName,'tel':stuTel,'class_type':0,'note':''}; 
		var stujion_res = Ajax_option(url_type,jsondata,"POST",false);
		if(stujion_res.flag){
			$('.info_css input[type=text]').each(function(ft, fn) {
				$(this).val("");
			});
			var stu_stus = '<div style="font-size:12px; padding:20px; line-height:20px;">欢迎 '+stuUName+' 加入题酷在线,祝你学习快乐！<br />默认密码是123456,请及时登录修改密码！<br />如果10秒内没有自动登录,请点击 <a href="./index.html">登录</a></div>';
			$.layer({
				  shade : [0.5 , '#000' , true],
				  type : 1,
				  closeBtn : [0 , false],
				  area : ['380px','180px'],
				  title : '欢迎来到题酷',
				  border : [7 , 0.3 , '#696969', true],
				  time : 10,
				  page : {html : stu_stus},
				  end : function(){
					  var cookieOptions = { path: "/", expires: -1 };
					  $.cookie("AuthToken", null, cookieOptions);
					  $.cookie("UserInfo", null, cookieOptions);
			  
					  var authorization = { "logintype": 1, "password": "123", "username": "l@b.com", "remember": true, "auto": true };
					  var tempath = { password: '123456', username: stuUName, remember: true, auto: true };
					  jQuery.extend(authorization,tempath);
					  var token = { "logintype": 1, "password": "123456", "username": "l@b.com" };
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
								  $.messager.alert('温馨提示','您的账号已经被禁用!','info');
							  }  
							}else {
							  $.cookie("AuthToken", Base64.encode($.toJSON(token)), cookieOptions);
							  $.cookie("UsersId", results.id, cookieOptions);
							  //$.cookie("center_info", $.toJSON(result.center_info), cookieOptions);
							  $.cookie("version_level","",cookieOptions); 
							  $.cookie("UserInfo", $.toJSON(results), cookieOptions);
							  $.cookie("nick",results.nick, cookieOptions); 
							  window.location.href = "/student/Index.html?r=" + roannumber;  
						   }
						   
					   }
				  }
			  }); 
			
		}else{
			
		}
	}
}


function checknull(f){
	var valuetempF = $('#'+f).val();
	
	if(/^$/.test(valuetempF)){
		$('.'+f+'_Ms').html('数据不能为空！');	
		
	}else{
		if(f=='userName'){  //用户名
			if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(com|cn|net)$/i.test(valuetempF)){
				$('.'+f+'_Ms').html('用户名为邮箱格式！');
				return false;
			}else{
				selverify(f);
				//$('.'+f+'_Ms').html('<img src="student/images/ok.gif" style="padding-top:10px;"/>');	
			}
		}else if(f=='userNike'){//昵称  
			if(/^$/.test(valuetempF)){
				$('.'+f+'_Ms').html('昵称不能为空！');
				return false;
			}else{
				$('.'+f+'_Ms').html('<img src="student/images/ok.gif" style="padding-top:10px;"/>');	
			}
		}else if(f=='userRealname'){//真实姓名  
			if(!/^[\u4e00-\u9fa5]{2,4}$/i.test(valuetempF)){
				$('.'+f+'_Ms').html('真实姓名2-4个汉字！');
				return false;
			}else{
				$('.'+f+'_Ms').html('<img src="student/images/ok.gif" style="padding-top:10px;"/>');	
			}
		}else if(f=='userEmail'){//email 
			if(!/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(com|cn|net)$/i.test(valuetempF)){
				$('.'+f+'_Ms').html('email格式不对！');
				return false;
			}else{
				$('.'+f+'_Ms').html('<img src="student/images/ok.gif" style="padding-top:10px;"/>');	
			}
		}else if(f=='userSchool'){//学校地址 
			if(/^$/.test(valuetempF)){
				$('.'+f+'_Ms').html('学校地址不能为空！');
				return false;
			}else{
				$('.'+f+'_Ms').html('<img src="student/images/ok.gif" style="padding-top:10px;"/>');	
			}
		}else if(f=='userphone'){//手机号码验证
			if(!/^\d{11}$/i.test(valuetempF)){
				$('.'+f+'_Ms').html('联系方式为11位数字！');
				return false;
			}else{
				$('.'+f+'_Ms').html('<img src="student/images/ok.gif" style="padding-top:10px;"/>');	
			}
		}
	}
	 
}


//验证用户名是否重复
function selverify(cssid){
	var sName = $('#'+cssid).val();
	if(($.trim(sName))!=""&&getvarcharVal(sName)<=32){
		if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(com|cn|net)$/i.test(sName)) {
			  $.ajax({
				  url: Webversion + "/verify",
				  type: "GET",
				  dataType: "json",
				  //data:{action:'list','condition':'center_name^'+sName},
				  data:{action:'verify','account':sName},
				  success: function (result) {
					  if(result.flag){
						  $('.'+cssid+'_Ms').html('&nbsp;<img src="student/images/ok.gif" style="padding-top:10px;"/>');
					  }else{
						  $('.'+cssid+'_Ms').html('&nbsp;用户已存在！');
					  }
					   
				  },
				  error: function (result) {
					  
					  $.error('加载数据失败！');
				  }
			  });
		}else{
		  	  $('.'+cssid+'_Ms').html('&nbsp;用户名为邮箱格式！');	
		}
	}else{
		if(getvarcharVal(sName)>=32){
				$('.'+cssid+'_Ms').html('不能大于32个字符！');
			}else{
				$('.'+cssid+'_Ms').html('&nbsp;用户不能为空！');
			}
		
	}
}

//去字符串的varchar长度
function getvarcharVal(sts) {
	var returnValue = '';
	var byteValLen = 0;
	for (var i = 0; i < sts.length; i++) {
		if (sts[i].match(/[\u4e00-\u9fa5]/ig) != null)
		byteValLen += 2;
		else
		byteValLen += 1;
	}
	return byteValLen;
} 