/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/Scripts/jquery.json.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/Common.js"/>


$(document).ready(function () {

    var UserInfo = $.evalJSON($.cookie("UserInfo"));

    $.extend($.fn.validatebox.defaults.rules, {
        valipw: {
            validator: function (value, param) {
                // 验证是否为电子邮件格式
                if (/^\w{6,32}$/i.test(value) && UserInfo.username != value) {
                    return true;
                }
                return false;
            },
            message: '密码由6~32个字符组成，字符可以是字母或者数字，且不能和账号相同。'
        },
        equals: {
            validator: function (value, param) {
                return value == $(param[0]).val();
            },
            message: '两次输入的密码不一样.'
        }
    });

    $('#WinPassword').dialog({
        title: UserInfo.username + '_修改密码',
        width: 450,
        height: 310,
        closable: false,
        buttons: [{
            text: '保存',
            iconCls: 'icon-save',
            handler: function () {
                if (!$("#PasswordForm").form('validate')) return;

                if ($('#userpassword').val() == $('#NewPassword').val()) {
                    $.remind('新旧密码不能一样！');
                    return;
                }

                // 更改密码
                $.ajax({
                    type: "POST",
                    dataType: "text",
                    auto: false,
                    url: Webversion + "/user/modifyPassword?_method=PUT&r=" + $.getRom() ,
                    data: {'user_id':UserInfo.id,'old_passwd':sha256_digest($("#userpassword").val()),'new_passwd': sha256_digest($("#NewPassword").val()) },
                     
                    success: function (result) {
						 
					 	if($.parseJSON(result).flag=='oldPasswd_error'){
								$.messager.alert('温馨提示', '原始密码错误！', 'info');
						}
						else if($.parseJSON(result).flag){
							$.messager.alert('温馨提示', '密码修改成功！', 'info');
							window.location = 'HomePage.html';
						}else{
							$.messager.alert('温馨提示', '修改失败！', 'info');
						}	
					 
                        
                    },
                    error: function (result) {
                        $.messager.alert('温馨提示', '密码修改失败！', 'error');
                    }
                });
            }
        },
        {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {
                $('#WinPassword').dialog('close');
				window.location = 'HomePage.html';
            }
        }]
    });

    //$('#WinPassword').dialog("move", { top: 30 });

    $.ajaxSetup({
        statusCode: {
            401: function () {
                $.messager.alert('温馨提示', '原始密码不正确!', 'info');
            },
            404: function () {
            },
            403: function () {
                $.messager.alert('温馨提示', '原始密码不正确!', 'info');
            },
            302: function () {
            }
        }
    });

});