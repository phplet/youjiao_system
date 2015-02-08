/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/Scripts/jquery.json.min.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/Common.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.Plug.js"/>

var UserInfo = {};

$(document).ready(function () {

    UserInfo = $.evalJSON($.cookie("UserInfo"));
    
     
    });
 
 
 function abg_color(a){
	 $(a).css("background-color","#ebf3fd");
 }
 function dbg_color(a){
	 $(a).css("background-color","");
 }