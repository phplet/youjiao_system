
$(document).ready(function () {
	if ($.cookie("UserName")) {
			$("#username").val($.cookie("UserName"));
	}
});
function ck_lg(){
	var username = $("#username").val();
	var password = $("#password").val();
	
	var parten = /^\s*$/ ;
	if(parten.test(username)){
		$("#account_ts").css('color','red');
		$("#account_ts").text("* 用户名不能为空");
		var checkreg1 = false
	}
	if(parten.test(password)){
		$("#pwd_ts").css('color','red');
		$("#pwd_ts").text("* 密码不能为空");
		
		var checkreg2 = false
	}
	
	if (checkreg1 == false || checkreg2 == false ){
		return false;
	}else{
		//alert("开始登录");
		//return false;
		 if (!$(document).login({ password: $("#password").val(), username: $("#username").val(), remember: $("#checkUserName").attr("checked"), auto: $("#checkboxPassword").attr("checked")}))
				 {
                   
				   $.messager.alert('温馨提示', '系统登录失败，可能用户账号或密码错误！');
                    return;
                }
				else
				{
				//alert("hfshjk");	
				}

                var roannumber = parseInt(1000000 * Math.random());
                window.location.href = "index.html?r=" + roannumber;
	}	
}