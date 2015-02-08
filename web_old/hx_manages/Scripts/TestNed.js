 
var  centerAll ={};
var UserInfo = {};
var temp_test = "";
var data_test = {};
$().ready(function() {
  UserInfo = $.evalJSON($.cookie("UserInfo"));
    centerAll = $.evalJSON($.cookie("centerAll"));
	temp_test = getUrlParam("rowdata");
	data_test = $.parseJSON(Base64.decode(temp_test));
	if(data_test.exam_type==6){
		$('#exam_type_admission').hide();	
	}
	if(data_test.tmod==0){
		$('#test_type').html("&nbsp;&nbsp;试卷中心&nbsp;>>&nbsp;自动组卷&nbsp;>>&nbsp;组卷成功");
		$('#bluidtypes').html("自动");
	}else{
		$('#test_type').html("&nbsp;&nbsp;试卷中心&nbsp;>>&nbsp;手动组卷&nbsp;>>&nbsp;组卷成功");
		$('#bluidtypes').html("手动");
	}  
}); 

//试卷中心
function testCenter(){
	
	document.location.href = "GroupRollCenter.html";
}


function sendTest(){
	window.top.string_data = {'rowdata':temp_test};
	document.location.href = "../SendCenter/SendStuStart.html?rowdata=stringdata";
	
}

function setWord(){
	$.messager.confirm('温馨提示','<div id="word_typecheck">请选择生成格式：<input type="radio" name="word_type" value="2" checked="checked" />学生版&nbsp;<input type="radio" name="word_type" value="1" />老师版</div>',function(b){
		if(b){
			 
			var datajsondd = {'action':'create_word','content':JSON.stringify(data_test.content),'ti_id':data_test.id};
			var checked_wordtype = $('#word_typecheck input[type="radio"]:checked').val();
			if(checked_wordtype==1){
				datajsondd['with_answer'] = checked_wordtype;
			}
			$.ajax({
				url: Webversion + '/examination_paper', //url访问地址
				type: "POST",
				data: datajsondd,
				dataType: "json",
				success: function (result){
					 $.messager.alert('温馨提示','<div style="padding-top:10px;">试卷已经生成,请点击下载：<a href="'+result.url+'">WORD下载</a></div>','info');
				}
			});
		}
	});
	
	//document.location.href = "GroupRollCenter.html";
}

 