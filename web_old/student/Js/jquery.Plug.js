
// jQuery插件扩展
jQuery.fn.extend({
    login: function (o) {
		
        var loginSucceed = false;

        var cookieOptions = { path: "/", expires: -1 };
        $.cookie("AuthToken", null, cookieOptions);
        $.cookie("UserInfo", null, cookieOptions);

        var authorization = { "logintype": 2, "password": "123", "username": "l@b.com", "remember": true, "auto": true };
        jQuery.extend(authorization, o);

        var token = { "logintype": 2, "password": "123", "username": "l@b.com" };
        jQuery.extend(token, authorization);
		
        token.password = sha256_digest(token.password);
        token = Base64.encode($.toJSON(token));

        if (authorization.remember) {
            $.cookie("UserName", authorization.username, { path: "/", expires: 60 * 24 * 365 });
        }
        else {
            $.cookie("UserName", null, { path: "/" });
        }

        $.cookie("AuthToken", token, { path: "/" });

        $.ajax({
            type: "GET",
            dataType: "json",
            async: false,
            url: Webversion + "/user?r=" + $.getRom() ,
            success: function (result) {
                token = { "logintype": 1, "token": result.token, "username": result.username};
				
                cookieOptions = { path: "/" };
				
                if (authorization.auto) {
                    cookieOptions = { expires: 30, path: "/" };
                }

                $.cookie("AuthToken", Base64.encode($.toJSON(token)), cookieOptions);
				//alert(result.id);
				//alert(result);
				//alert($.toJSON(result));
				$.cookie("UsersId", result.id, cookieOptions);
				  
                $.cookie("UserInfo", $.toJSON(result), cookieOptions);
				$.cookie("nick",result.nick, cookieOptions);
                loginSucceed = true;
            },
			error: function (result)
			{
				if(result.status=='401'){
					layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
						clearcookie();
				});
				}else{
					layer.alert('加载数据失败！', 8,'温馨提示');	
				}
			  
			  
			 return;
			}
        });

        return loginSucceed;
    },
    register: function (o) {

        var authToken = { "logintype": 2, "password": "", "username": "" };
        jQuery.extend(authToken, o);
        authToken.password = sha256_digest(authToken.password);
        authToken = Base64.encode($.toJSON(authToken));

        var userInfo = { "realname": '', "identity": '', "subject": '', "gender": '', 'yq':'','qd':''};
        jQuery.extend(userInfo, o);

        var url = '', params = {};

        switch (parseInt(userInfo.identity)) {
            case 1:
                url = Webversion + "/user/student" ;
                params.realname = userInfo.realname;
                params.gender = userInfo.gender;
                break;
            case 2:
                url = Webversion + "/user/teacher" ;
                params.realname = userInfo.realname;
                params.subject_id = userInfo.subject;
                params.gender = userInfo.gender;
                break;
            default:
                return false;
                break;
        }

        if (userInfo.yq.length > 0) {
            params.yq = userInfo.yq;
        }

        if (userInfo.qd.length > 0) {
            params.qd = userInfo.qd;
        }

        var flag = false;

        $.cookie("AuthToken", null, { path: "/", expires: -1 });

        $.ajax({
            type: "POST",
            dataType: "json",
            data: params,
            async: false,
            url: url,
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Digest " + authToken);
            },
            success: function (result) {
                flag = true;
            },
			error: function (result)
			{
				if(result.status=='401'){
					layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
						clearcookie();
				});
				}else{
					layer.alert('加载数据失败！', 8,'温馨提示');	
				}
			  
			  
			 return;
			}
        });

        return flag;
    },
    KeyInput: function (c, t) {

        function SearchTextInitial() {
            c.val(t);
            c.attr("innt", "1");
            c.css("color", "#808080");
            c.attr("title", t);
        }

        c.focus(function () {
            if (c.attr("innt") == "1") {
                c.val("");
            }
            c.removeAttr("innt");
            c.css("color", "#000000");
        });

        c.blur(function () {
            if (c.val().length == 0) {
                SearchTextInitial();
            }
        });

        SearchTextInitial();
    }
});

jQuery.extend({

    getRom: function () {
        return parseInt(1000000 * Math.random());
    },

    remind: function (t, fun) {
        if (fun == null) {
            fun = function () { }
        }
        $.messager.alert('温馨提示', t, 'info', fun);
    },

    error: function (t) {
        $.messager.alert('错误提示', t, 'error');
    },

    student: function (o) {

        var parame = { condition: {}, fields: [] };
        $.extend(parame, o);

        var getFields = '';
        $.each(parame.fields, function (i, n) {
            if (i != 0) {
                getFields += ';';
            }
            getFields += n;
        });

        var condition = '';

        for (var i in parame.condition) {
            if (condition.length != 0) {
                condition += ';';
            }
            condition += i + ':' + parame.condition[i];
        }

        var resultObj = {};

        var ajaxRequest = {
            type: "GET",
            dataType: "json",
            async: false,
            url: Webversion + '/user/student/' + getFields ,
            success: function (result) {
                resultObj = result;
            }
        };

        if (condition.length != 0) {
            ajaxRequest.data = { "condition": condition };
        }

        $.ajax(ajaxRequest);

        return resultObj;

    },

    asyncStudent: function (o, s, e) {

        // 异步获取数据
        var parame = { condition: {}, fields: [] };
        $.extend(parame, o);

        var getFields = '';
        $.each(parame.fields, function (i, n) {
            if (i != 0) {
                getFields += ';';
            }
            getFields += n;
        });

        var condition = '';

        for (var i in parame.condition) {
            if (condition.length != 0) {
                condition += ';';
            }
            condition += i + ':' + parame.condition[i];
        }

        var resultObj = {};

        var ajaxRequest = {
            type: "GET",
            dataType: "json",
            url: Webversion + '/user/student/' + getFields ,
            success: function (result) {

                if (result != null && result.student != null) {
                    resultObj = result.student;
                }

                s(resultObj);
            },
            error: function (result) {
                e(resultObj);
            }
        };

        if (condition.length != 0) {
            ajaxRequest.data = { "condition": condition };
        }

        $.ajax(ajaxRequest);
    },

    asyncTeacher: function (o, s, e) {

        // 异步获取数据
        var parame = { condition: {}, fields: [] };
        $.extend(parame, o);

        var getFields = '';
        $.each(parame.fields, function (i, n) {
            if (i != 0) {
                getFields += ';';
            }
            getFields += n;
        });

        var condition = '';

        for (var i in parame.condition) {
            if (condition.length != 0) {
                condition += ';';
            }
            condition += i + ':' + parame.condition[i];
        }

        var resultObj = {};

        var ajaxRequest = {
            type: "GET",
            dataType: "json",
            url: Webversion + '/user/teacher/' + getFields ,
            success: function (result) {

                if (result != null && result.teacher != null) {
                    resultObj = result.teacher;
                }

                s(resultObj);
            },
            error: function (result) {
                e(resultObj);
            }
        };

        if (condition.length != 0) {
            ajaxRequest.data = { "condition": condition };
        }

        $.ajax(ajaxRequest);
    },

    asyncSubjectList: function (s, e) {

        var o = [];

        $.ajax({
            type: "GET",
            dataType: "json",
            url: Webversion + "/subject/list?r=" + $.getRom() ,
            success: function (result) {

                if (result != null && result.subject != null) {
                    o = result.subject;
                }

                s(o);

            }, error: function (result) {
                e(o);
            }
        });

    },

    asyncSubject: function (id, s, e) {

        var o = {};

        $.ajax({
            type: "GET",
            dataType: "json",
            url: Webversion + "/subject/list" ,
            data: { 'id': id, 'r': $.getRom() },
            success: function (result) {

                if (result != null && result.subject != null && result.subject.length > 0) {
                    o = result.subject[0];
                }

                s(o);

            }, error: function (result) {
                e(o);
            }
        });

    },

    Subject: function (id, s, e) {

        var o = {};

        $.ajax({
            type: "GET",
            dataType: "json",
            async: false,
            url: Webversion + "/subject/list" ,
            data: { 'id': id, 'r': $.getRom() },
            success: function (result) {

                if (result != null && result.subject != null && result.subject.length > 0) {
                    o = result.subject[0];
                }

                s(o);

            }, error: function (result) {
                e(o);
            }
        });

    },

    asyncSchool: function (id, s, e) {
        //异步获取学校信息
        $.ajax({
            type: "GET",
            dataType: "json",
            url: Webversion + '/school/school_id/' + id + '?r=' + $.getRom() ,
            success: function (result) {
                s(result);
            },
            error: function (result) {
                e(result);
            }
        });
    },

    gradeList: function () {

        var resultObj = [];

        // 得到年级列表
        $.ajax({
            type: "GET",
            dataType: "json",
            async: false,
            url: Webversion + '/grade/list?r=' + $.getRom() ,
            success: function (result) {

                if (result != null && result.grade != null) {
                    resultObj = result.grade;
                }

            }
        });

        return resultObj;

    },

    gradeInfo: function (id) {

        // 根据id获取对应年级信息
        var info = {};
        var arraytemp = $.gradeList();
        $.each(arraytemp, function (i, n) {
            if (n.id == id) {
                info = n;
                return false;
            }
        });
        return info;

    },

    asyncGradeInfo: function (id, f) {

        // 异步得到年级列表
        $.ajax({
            type: "GET",
            dataType: "json",
            url: Webversion + '/grade/list?r=' + $.getRom() ,
            success: function (result) {

                if (result != null && result.grade != null) {
                    $.each(result.grade, function (i, n) {
                        if (n.id == id) {
                            f(n);
                            return false;
                        }
                    });
                }

            }
        });

    },

    GradeInfo: function (id, f) {

        // 异步得到年级列表
        $.ajax({
            type: "GET",
            dataType: "json",
            async: false,
            url: Webversion + '/grade/list?r=' + $.getRom() ,
            success: function (result) {

                if (result != null && result.grade != null) {
                    $.each(result.grade, function (i, n) {
                        if (n.id == id) {
                            f(n);
                            return false;
                        }
                    });
                }

            }
        });

    },

    asyncCountMasterTest: function (id, s, e) {

        $.ajax({
            type: "GET",
            dataType: "json",
            url: Webversion + '/evaluation/master' ,
            data: { 'teacher_id': id, 'r': $.getRom() },
            success: function (result) {
                var total = 0;
                if (result != null && result.evaluation != null && result.evaluation.total != null) {
                    total = result.evaluation.total;
                }
                s(total);
            }, error: function (result) {
                e(result);
            }
        });

    },

    asyncStudentCount: function (id, type, s, e) {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: Webversion + '/user/student/count/' + type + "/" + id + "?r=" + $.getRom() ,
            success: function (result) {
                var total = 0;
                if (result != null && result.count != null) {
                    total = result.count;
                }
                s(total);
            }, error: function (result) {
                e(result);
            }
        });
    },

    asyncCountTeacherTest: function (id, s, e) {

        $.ajax({
            type: "GET",
            dataType: "json",
            url: Webversion + '/evaluation/teacher' ,
            data: { 'teacher_id': id, 'r': $.getRom() },
            success: function (result) {
                var total = 0;
                if (result != null && result.evaluation != null && result.evaluation.total != null) {
                    total = result.evaluation.total;
                }
                s(total);
            }, error: function (result) {
                e(result);
            }
        });

    },

    createClass: function (o, success, error) {

        // 创建一个新班级  1--校外辅导班   2--实体班   3--虚拟班   4--1对多班级
        var oTemp = { name: '', class_type: 1, student_id: 0, teacher_id: 0, master_id: 0 };
        $.extend(oTemp, o);
        $.ajax({
            type: "POST",
            dataType: "json",
            url: Webversion + "/class" ,
            data: oTemp,
            success: function (result) {
                success(result);
            },
            error: function (result) {
                error(result);
            }
        });

    },

    EvelSubjectGrade: function (input) {
        if (input == null) return {};
        //格式：{ subject: [0], grade: [0] };
        try {
            return $.evalJSON(input);
        }
        catch (e) { return {}; }
    }

});

