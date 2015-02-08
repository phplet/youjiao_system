 

var UserInfo = {};

$(document).ready(function () {

    UserInfo = $.evalJSON($.cookie("UserInfo"));
      
    $('document').KeyInput($("#SchoolText"), '请输入姓名');
     

});

 

var cssid = 1;
function addteasub(){
	cssid++;
	$('#addteasub').append('<dt style="height:20px;padding-top:5px; "id="cssid_'+cssid+'">'+cssid+'.学科&nbsp;<select id="teacherSubjects" name="teacherSubjects"  class="easyui-combobox" style="width:100px;"  name="12"  panelHeight="auto"><option value="1">数学001科目</option><option value="2">禁用</option></select>&nbsp;&nbsp;教师&nbsp;&nbsp;<select id="teacherSubjects" name="teacherSubjects"  class="easyui-combobox" style="width:100px;"  name="12"  panelHeight="auto"><option value="1">数学001科目</option><option value="2">禁用</option></select>&nbsp;&nbsp;&nbsp;&nbsp;<a href="#" onclick="delteasub(\'cssid_'+cssid+'\');">删除</a></dt>');	
	
	

};
function delteasub(id){
	
	$('#'+id).remove();

};