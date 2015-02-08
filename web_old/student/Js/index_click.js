// JavaScript Document
var UserInfo = {};
$().ready(function() {
    UserInfo = $.evalJSON($.cookie("UserInfo"));
	$('.product_img_02').parent().show();
	$('.product_img_05').parent().show();
	$('.product_img_06').parent().show();
	if ($.cookie('AuthToken') == null){
	  $('#logins_yes').hide();
	  $('#logins_no').show();
    }else{
	  $('#logins_no').hide();
	  $('#logins_yes').show();
	}
	if(UserInfo!=null&&UserInfo!=""){
		if(UserInfo.grade_id>0&&UserInfo.grade_id!=null&&UserInfo.grade_id<13){
			 var nick =  $.cookie("nick");
			 if (UserInfo != null){
				$('#headusername').text(UserInfo.realname);
			 }else if(nick!=null){
				$('#headusername').text(nick);
			 }
			/* 
			if(UserInfo.grade_id<=9){
				$('.product_img_02').parent().hide();
				$('.product_img_05').parent().hide();
				$('.product_img_06').parent().hide();
			}else{
				$('.product_img_02').parent().show();
				$('.product_img_05').parent().show();
				$('.product_img_06').parent().show();
			}*/
			
			//自主学习跳转判定操作
			 var stuexam_List = getStuExamlist(0);
			 if(stuexam_List!=""){
				 //Do something for over
			 }
		}else{
			var st_i = layer.alert('2秒后进入个人基本设置!',9,'温馨提示');
			setTimeout(function(){
					layer.close(st_i);
					window.location.href= 'edit_login.html';
			},2000);
		}
	}
});




function class_alink(num){
	var href_1 = './exercise_tongbu.html';
	var href_2 = './exercise_zhuanti.html';
	var href_3 = './work_indexs.html';
	var href_4 = './exercise_zhenti.html';
	var href_5 = './exercise_mingxiao.html';
	var href_6 = './mywork_good_list.html';
	var href_7 = './diagnostic_analysis.html';
	var href_8 = './news_list.html';
	var href_9 = './admission_standed.html';
	var href_10 = './step_sdudy.html';
	if ($.cookie('AuthToken') == null) {
		href_1 = '';
		href_2 = '';
		href_3 = '';
		href_4 = '';
		href_5 = '';
		href_6 = '';
		href_7 = '';
		href_8 = '';
		href_9 = '';
		href_10 = '';
		var ii = $.layer({
			shade : [0.2 , '#696969',true], 
			area : ['auto','auto'],
			title:'温馨提示',
			closeBtn : false,
			dialog :{
				msg:'您没有登录，请先登录账号!',
				btns : 2,
				type : 0,
				btn : ['登录','取消'],
				yes : function(){
					window.location = '../index.html';
				},
				no : function(){
					layer.close(ii);
				}
			}
		});
		 
	}else{
		href_1 = './exercise_tongbu.html';
		href_2 = './exercise_zhuanti.html';
		href_3 = './work_indexs.html';
		href_4 = './exercise_zhenti.html';
		href_5 = './exercise_mingxiao.html';
		href_6 = './mywork_good_list.html';
		href_7 = './diagnostic_analysis.html';
		href_8 = './news_list.html';
		href_9 = './admission_standed.html';
		href_10 = './step_sdudy.html';
	}
	if(num==1&&href_1!=""){
		window.location = href_1;
	}else if(num==2&&href_2!=""){
		window.location = href_2;
	}else if(num==3&&href_3!=""){
		window.location = href_3;
	}else if(num==4&&href_4!=""){
		window.location = href_4;
	}else if(num==5&&href_5!=""){
		window.location = href_5;
	}else if(num==6&&href_6!=""){
		window.location = href_6;
	}else if(num==7&&href_7!=""){
		window.location = href_7;
	}else if(num==8&&href_8!=""){
		window.location = href_8;
	}else if(num==9&&href_9!=""){
		window.location = href_9;
	}else if(num==10&&href_10!=""){
		window.location = href_10;
	}
}