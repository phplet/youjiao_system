/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/Common.js"/>

$(document).ready(function () {

    $.extend($.fn.validatebox.defaults.rules, {
        valipw: {
            validator: function (value, param) {
                // 验证是否为电子邮件格式
                if (/^\w{6,32}$/i.test(value) && $(param[0]).val() != value) {
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

    $('#UserGender').combobox({
        panelHeight: 50,
        required: true,
        multiple: false,
        editable: false,
        valueField: 'id',
        textField: 'text',
        data: [{ id: '0', text: '女' }, { id: '1', text: '男' }]
    });

    $('#identity').combobox({
        panelHeight:50,
        required: true,
        multiple: false,
        editable: false,
        onSelect: function (item) {
            if (parseInt(item.value) == 2) {
                $("#coursespan").show("normal", function () {
                    $('#coursese').combobox({
                        required: true,
                        multiple: false,
                        editable: false,
                        valueField: 'id',
                        textField: 'text'
                    });

                    // 加载学科数据
                    var courseData = [];

                    $.ajax({
                        type: "GET",
                        dataType: "json",
                        async: false,
                        url: Webversion + "/subject/list",
                        success: function (result) {
                            if (result != null && result.subject != null) {
                                $.each(result.subject, function (i, n) {
                                    courseData.push({ id: n.id, text: n.Name });
                                });
                            }
                        }
                    });

                    $('#coursese').combobox("loadData", courseData);

                });
            }
            else {
                $("#coursese").combobox("disable");
                $("#coursespan").hide("normal");
            }
        }
    });

    $('#RegisterWin').dialog({
        buttons: [{
            text: '注册用户',
            iconCls: 'icon-ok',
            handler: function () {

                if (!$("#LoginForm").form('validate')) return;

                $.messager.progress({ text: "正在提交注册信息" });

                var parames = {};
                parames.username = $("#UserName").val();
                parames.password = $("#UserPassword").val();
                parames.realname = $("#RealName").val();
                parames.identity = $("#identity").combobox("getValue");
                parames.gender = $("#UserGender").combobox("getValue");
                if (parseInt(parames.identity) == 2) {
                    parames.subject = $("#coursese").combobox("getValue");
                }

                parames.yq = getParam('yq');
                parames.qd = getParam('qd');

                var re = $(document).register(parames);

                $.messager.progress("close");

                if (re) {
                    $.messager.alert('温馨提示', '用户注册成功!', 'info', function () { window.location.href = "../index.html"; });
                } else {
                    $.messager.alert('错误提示', '用户注册失败!<br/><span style="color:red;">可能原因：用户名已被占用。</span>', 'error');
                }

            }
			},
			 {
            text: '取消',
            iconCls: 'icon-cancel',
            handler: function () {

               document.location.href = "Index.html";

            }
        }]
    });
});

function getParam(paramName) {
    paramValue = "";
    isFound = false;
    if (this.location.search.indexOf("?") == 0 && this.location.search.indexOf("=") > 1) {
        arrSource = unescape(this.location.search).substring(1, this.location.search.length).split("&");
        i = 0;
        while (i < arrSource.length && !isFound) {
            if (arrSource[i].indexOf("=") > 0) {
                if (arrSource[i].split("=")[0].toLowerCase() == paramName.toLowerCase()) {
                    paramValue = arrSource[i].split("=")[1];
                    isFound = true;
                }
            }
            i++;
        }
    }
    return paramValue;
}
