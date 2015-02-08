var UserInfo = {};
var centerAll = {};
var pager="";


$().ready(function () {
	 
    UserInfo = $.evalJSON($.cookie("UserInfo"));
    centerAll = $.evalJSON($.cookie("centerAll"));

});