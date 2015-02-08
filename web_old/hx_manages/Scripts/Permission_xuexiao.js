/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.easyui.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.json.min.js"/>

(function ($) {
    var operateDefine = [
        { operate: "homePage", level: [1,2,3,4,9] },
		{ operate: "Persion", level: [9]},
		{ operate: "PersionSchool", level: [9]},
		{ operate: "KnowlgContent", level: [9] },
		{ operate: "Knowledge", level: [9] },
		{ operate: "Educational_Set", level: [1] }, 
		{ operate: "School", level: [1]},
		{ operate: "Teacher_Corrects", level: [1,2,4] },
		{ operate: "Students_Summary", level: [1,2] },
		{ operate: "Students_Work", level: [2, 3, 4] },
		{ operate: "school_students", level: [1,2] },
		
		{ operate: "Informations", level: [1,2,3,4] },
		{ operate: "News", level: [1,2] },
		/*{ operate: "Abilitys", level: [1] },*/
		{ operate: "Teacher",level: [2,3] },
		{ operate: "Teaching_My_class", level: [2] },
		{ operate: "Teaching_My_student", level: [2] },
		/*{ operate: "Teaching_My_studentes", level: [2] },*/
		{ operate: "Evaluation_Work", level: [0] },
		{ operate: "MyClass_Student_1", level: [4] },
		{ operate: "Big_Classes_Management", level: [4] },
		{ operate: "Test_Center", level: [4] },
		{ operate: "Test_List", level: [4] },
		{ operate: "Noopsyche_Test", level: [4] },
		{ operate: "Manually_Test", level: [4] },
		{ operate: "Evaluation_To", level: [4] },
		{ operate: "Send_List", level: [4] },
		{ operate: "Papers_To", level: [4] },
		{ operate: "Students_To", level: [4] },
		{ operate: "Assessment_Reviews", level: [4] },
		{ operate: "select_xiaoxue", level: [4] },
		{ operate: "Assessment_Reader", level: [2] },
		{ operate: "Messages", level: [4] }
    ];

    $.extend({
        permission: function (operate) {
            var userInfo = $.evalJSON($.cookie("UserInfo"));
            var op = $.extend({ level: "5" }, userInfo);
			
            var isDeny = false;
            $.each(operateDefine, function (index, value) {
                if (value.operate == operate) {
                    $.each(value.level, function (e, n) {
                        if (n == parseInt(op.level)) {
							 
                            isDeny = true;
                            return false;
                        }
                    });

                    return false;
                }
            });

            return isDeny;
        }
    });

})(jQuery);