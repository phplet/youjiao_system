/**
*
*学生保存作业状态js
*/
$(document).ready(function (){
	$("#linshi").click(function(){
		answer_sheet();
	});

});


//记录学生答题卡
function answer_sheet(){
	var UserInfo = $.evalJSON($.cookie("UserInfo"));
	var usersid = $.cookie("UsersId");
	var upload_answer_sheet = [];//json格式的数据
	var msg = '亲，你未做任何题';
	var exercise_id = $.cookie("exercise_id");//试卷id
	var studentAccount = $.cookie("UserName");//学生帐号
	var length = $(".oneT").length; // 统计答题个数
	var anserSheetHtml = (length==0)? msg : $("#anser1").html();//获取答题卡html代码
	var xuanXiangKaDaAn = '';
	//alert(anserShetHtml);
	if(anserSheetHtml==msg){alert("亲，你未做任何题"); return false;}

	var zancunData={};
	zancunData.studentAccount = studentAccount;//学生帐号
	zancunData.exercise_id = exercise_id;//试卷id
	zancunData.anserSheetHtml = anserSheetHtml;//所做选项卡答案

	upload_answer_sheet.push(zancunData);
	var load_i = 0;
	//alert(JSON.stringify(upload_answer_sheet));
	$.ajax({  
        url: Webversion + "/ticool/user_history/bat?_method=POST&r="+$.getRom(),
        type: "POST",
        dataType: "json",
        data: {
			"uid":usersid ,
        	"uploadData":upload_answer_sheet
        },
		beforeSend: function (request) {
			load_i = layer.load('加载中...'); 
                request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
		complete: function (XMLHttpRequest, textStatus){
			layer.close(load_i);
		},
        success: function (result)
        {//alert(result);
        	//window.location.href="Index.html";
			layer.alert('你保存成功', 9,'温馨提示');
        	 
        	
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


}