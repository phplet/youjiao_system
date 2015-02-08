var UserInfo=null;
var centerAll=null;
var tr_id = ""; 
 
   
$().ready(function (){
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	centerAll = $.evalJSON($.cookie("centerAll")); 
	tr_id = getUrlParam('tr_id');
	 
});   //.ready的结束符号

function report_view(){
	
	document.location.href = 'report_view.html?tr_id='+tr_id;		
	
};
 