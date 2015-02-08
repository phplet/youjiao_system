/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/Scripts/jquery.json.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/Common.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.Plug.js"/>
/// <reference path="~/EasyUI/Scripts/ZeroClipboard.js"/>

$(document).ready(function () {

    var UserInfo = $.evalJSON($.cookie("UserInfo"));
    // 教师类别  1\2\3\4  
    var UserLevel = parseInt(UserInfo.level);
    // 用户类型  1学生 2教师 3家长
    var UserType = parseInt(UserInfo.usr_type);

    $('#UserPanel').panel({
        title: UserInfo.username + '_资料修改',
        border: false,
        iconCls: 'icon-edit',
        collapsible: false,
        fit: true
    });

    // 用户属性
    var UserArgument = [];
    var getFilers = 'pic;last_login_time;reg_time;last_loginlocation;subject_grade';

    UserArgument.push({
        id: 'realname',
        lab: '姓名',
        flag: true,
        options: { required: true, missingMessage: "请输入你的真实姓名！" }
    });
            
    UserArgument.push({
        id: 'gender',
        lab: '性别',
        flag: true,
        options: {
            panelHeight: 70,
            valueField: 'id',
            textField: 'text',
            editable: false,
            data: [
                { id: '-1', text: '请选择性别' },
                { id: '0', text: '女' },
                { id: '1', text: '男' }
            ]
        },
        fuc: function (e, p) {
            e.combobox(p);
            e.combobox('select', '0');
        },
        setVal: function (e, value) {
            value = parseInt(value);
            if (value < 0 || value > 1) {
                value = -1;
            }
            e.combobox('setValue', value);
        },
        getVal: function (e) {
            return e.combobox('getValue');
        }
    });
    
    UserArgument.push({
        id: 'nickname',
        lab: '昵称',
        flag: true,
        options: {}
    });

    UserArgument.push({
        id: 'mobile',
        lab: '手机号码',
        flag: true,
        options: {}
    });

    if (UserLevel == 4) {
        UserArgument.push({
            id: 'subject_id',
            lab: '学科',
            flag: false,
			disabled:false,
            options: {
                valueField: 'id',
                textField: 'Name',
                editable: false
            },
            fuc: function (e, p) {
                e.combobox(p);

                var itemList = [{ id: '0', Name: '请选择学科' }];
				
				
                // 加载学科数据
                $.ajax({
                    url: Webversion + "/subject/list?r=" + $.getRom() ,
                    type: "GET",
                    dataType: "json",
                    async: false,
                    success: function (result) {
                        if (result != null && result.subject != null) {
                            $.merge(itemList, result.subject);
                        }
                    },
                    error: function (result) {

                    }
                });

                e.combobox("loadData", itemList);
                e.combobox("select", '0');
				e.combobox('disable');
				
            },
			
            setVal: function (e, value) {
                e.combobox('setValue', value);
            },
            getVal: function (e) {
                return e.combobox('getValue');
            }
			
			
				
        });

       /*  UserArgument.push({
            id: 'grade_id',
            lab: '年级',
            flag: false,
            options: {
                valueField: 'id',
                textField: 'name',
                editable: false
            },
            fuc: function (e, p) {
                e.combobox(p);

                // 加载年级数据
                var itemList = [{ id: '0', name: '请选择年级' }];

                // 加载年级数据
                $.ajax({
                    url: Webversion + "/grade/list" ,
                    type: "GET",
                    dataType: "json",
                    async: false,
                    success: function (result) {
                        if (result != null && result.grade != null) {
                            $.merge(itemList, result.grade);
                        }
                    },
                    error: function (result) {

                    }
                });

                e.combobox("loadData", itemList);
                e.combobox("select", '0');

            },
            setVal: function (e, value) {
                e.combobox('setValue', value);
            },
            getVal: function (e) {
                return e.combobox('getValue');
            }
        });/////////////////// */
    } else if (UserLevel == 1){
		//alert(UserLevel);
		$("#BtnSave").hide();
	} 

    $.each(UserArgument, function (i, n) {
        if (n.flag) {
            getFilers += ";" + n.id;
        }
    });

    $.ajax({
        url: Webversion + "/user/teacher/" + getFilers ,
        type: "GET",
        data: { "condition": "username:" + UserInfo.username, 'r': $.getRom() },
        dataType: "json",
        async: false,
        success: function (result) {
            if (result && result.teacher) {

                var subject = 0;
                var grade = 0;

                $("#ImgUserPhoto").attr("src", "data:image/jpg;base64," + (result.teacher.pic == null ? '' : result.teacher.pic));
                $("#RecetlyDate").html(result.teacher.last_login_time == null ? '' : result.teacher.last_login_time);
                $("#RecetlyIP").html(result.teacher.last_loginlocation == null ? '' : result.teacher.last_loginlocation);
                $("#reg_time").html(result.teacher.reg_time == null ? '' : result.teacher.reg_time);

                var k = $.evalJSON(result.teacher.subject_grade == null ? '{ "subject": [0], "grade": [0] }' : result.teacher.subject_grade);

                if (k.subject != null || k.grade != null) {
                    $.each(UserArgument, function (index, n) {
                        if (!n.flag) {
                            if (n.id == "subject_id") {
                                n.val = k.subject[0];
                            } else if (n.id == "grade_id") {
                                n.val = k.grade[0];
                            }
                        }
                    });
                }

                for (var i in result.teacher) {
                    $.each(UserArgument, function (index, n) {
                        if (n.flag && i == n.id) {
                            n.val = result.teacher[i];
                            return false;
                        }
                    });
                }
            }
        },
        error: function (result) {

        }
    });

    $("#InfoBlack").empty();

    // 加载HTML元素
    $.each(UserArgument, function (i, o) {
        $("#InfoBlack").append($('<table style="float:left; margin-left:10px;height:35px;"></table>').html($('<tr><tr><td style="width:80px; text-align:right;">' + o.lab + '：</td><td style="width:220px; text-align:left;"><input id=' + o.id + ' type="text" style="width:200px;"/></td></tr>')));
    });

    $("#InfoBlack").append($('<div style="clear:both;"></div>'));

    // 解析UI对象
    $.each(UserArgument, function (i, o) {

        var currentObj = $("#" + o.id);

        if (o.fuc == null) {
            currentObj.validatebox(o.options);
        } else {
            o.fuc(currentObj, o.options);
        }

        // 设置初始值
        if (o.setVal == null) {
            currentObj.val(o.val);
        }
        else {
            if (o.val != null) {
                o.setVal(currentObj, o.val);
            }
        }

    });

    // 绑定保存按钮
    $("#BtnSave").click(function () {

        if (!$("#UserInfoSubmit").form('validate'))
            return;

        $.messager.progress({ text: '正在保存数据' });

        var paramlistObj = { '_method': 'PUT' };

        $.each(UserArgument, function (i, n) {

            var currentObj = $("#" + n.id);
            var tempval = '';

            if (n.getVal == null) {
                tempval = currentObj.val();
            } else {
                tempval = n.getVal(currentObj);
            }

            paramlistObj[n.id] = tempval;

        });

        $.ajax({
            url: Webversion + "/user/updateinfo?_method=PUT" ,
            type: "POST",
            data: paramlistObj,
            dataType: "text",
            success: function (result) {
                $.messager.progress('close');
                $.messager.alert('温馨提示', '个人资料数据保存完毕', 'info');
            },
            error: function (result) {
                $.messager.progress('close');
                $.messager.alert('错误提示', '系统出现异常，数据保存失败', 'error');
            }
        });

    });

    var re = new RegExp(".*/");
　　var linkUrl = document.URL.match(re)+"Register.html?yq=" + UserInfo.id;

    $('#linkinputtext').val(linkUrl);

    var clip = new ZeroClipboard.Client();
    clip.setHandCursor(true);
    clip.addEventListener('mouseup', function () {
        $.remind('已复制好邀请地址，可直接按Ctrl+V进行贴粘。');
    });
    clip.setText(linkUrl);
    clip.glue("copylink");

});