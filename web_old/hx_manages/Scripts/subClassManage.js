 

var UserInfo = {};

$(document).ready(function () {

    UserInfo = $.evalJSON($.cookie("UserInfo"));
      
    $('document').KeyInput($("#SchoolText"), '请输入姓名');
    //选项卡开始
	$(".tab").click(function() {
		$(this).addClass("now_focus");
		$(this).siblings().removeClass("now_focus");
		var $dangqian = $(".con_box > div").eq($(".tab").index(this));
		$dangqian.addClass("now_focus");
		$dangqian.siblings().removeClass("now_focus");
	});

});
 