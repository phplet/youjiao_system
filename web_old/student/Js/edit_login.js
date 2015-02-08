var UserInfo = $.evalJSON($.cookie("UserInfo"));
 
var grade_ids = 1;
$(document).ready(function (){
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	//var UserInfo = $.evalJSON($.cookie("UserInfo"));
	//alert(JSON.stringify(UserInfo));				 
	 
	 if(UserInfo!=null&&UserInfo!=undefined){
		
		 var nick =  $.cookie("nick");
		 if (UserInfo != null) {
				$('#headusername').text(UserInfo.realname);
		 }else if(nick!=null){
				$('#headusername').text(nick);
		 }
		 
		 $('#login_name').text(UserInfo.username);
	 
	 	 grade_ids = UserInfo.grade_id;
		 //选项卡初始化  动态添加背景图片
		$(".class_name_list").children().each(function(itab, ntab) {
			$(ntab).addClass('class_name_list_li_00'+(itab+1));
			 
		}); 
		//选项卡点击事件
		$(".class_name_list li").click(function() {
			$(".class_name_list").children().each(function(itab, ntab) {
				$(ntab).addClass('class_name_list_li_00'+(itab+1));
				$(ntab).attr('style',"");
			});
			$(this).addClass("now_focus");
			 
			$(this).siblings().removeClass("now_focus");
			var $dangqian = $(".con_list li").eq($(".class_name_list li").index(this));
			$dangqian.addClass("now_focus");
			$dangqian.siblings().removeClass("now_focus");
			if($(this).index()==0){
				stu_infos(); //个人信息
			}else if($(this).index()==1){
				
				stu_headImg(); //个人头像
				
			}else if($(this).index()==3){
				 
				stu_subjectbooks();//设置课本	
			
			}
		});
		
		 var ss = getUrlParam("book");
		 if(judgeNull(ss)!=""){
			
			$(".class_name_list li").eq(3).trigger("click");
		 
		 }
		
		stu_infos(); //个人信息
		
		$('#edit_login').click(function (){
			edit_login();
			
		});
		
		//修改个人信息
		$('#changesInfo').click(function(){
			changesInfos();
			
		});
		$('#forms').attr('action',Webversion + '/avatar?action=upload&user_id='+UserInfo.id);
	}else{
		window.location.href = "../index.html";
	}
	 
	
});//.ready的结束标签

//学生信息
function  stu_infos(){
	var url_type_info = '/student?r='+$.getRom();
	var Qjson_info = {'action':'getStudentInfo','user_id':$.cookie("UsersId")};
	var res_info = Ajax_option(url_type_info,Qjson_info,'GET',false);
	var userSex = 2;
	
	 
	if(res_info.user_info!=null){
		var cookieOptions = { expires: 30, path: "/" }; 
		var list_info = res_info.user_info;
		UserInfo.grade_id = list_info.grade;
		$.cookie("UserInfo",$.toJSON(UserInfo),cookieOptions);
		$('#userName').val(list_info.username);
		$('#userNike').val(list_info.nickname);
		$('#userRealname').val(list_info.realname);
		$('.info_css input[type=radio][value='+list_info.gender+']').attr('checked',true);
		$('#userEmail').val(list_info.email);
		$('#userSchool').val(list_info.school_name);
		$('.fromstu').each(function(i,obj_T){
			$(obj_T).html('<img src="images/ok.gif" />');	
		});
		
		if(list_info.nickname==""||list_info.nickname==null){
			$('.userNike_Ms').html('数据不能为空！');	
		}
		if(list_info.email==null){
			$('.userEmail_Ms').html('邮箱格式不对！如：123@163.com');	
		}
		if(list_info.school_name==null){
			$('.userSchool_Ms').html('数据不能为空！');		
		}
		grade_ids = list_info.grade ; 
		$('#grade_select').attr("value",grade_ids);
		 
	}
	 
}

function changesection_ids(){
	   
	if((parseInt(section_idT))<3){
		var il = layer.alert('您确定要升级选段吗？<br />升级点确认，否则点右上角的关闭！',9,'温馨提示',function(){
			$('.grade_'+(parseInt(section_idT)+1)).show();
			section_idT = section_idT+1;
			layer.close(il); 
		});	
		 
	}else{
		layer.alert('您当前已经是高中,不能够提升学段！',9,'温馨提示');	
	}
	 
}

//学生信息改变
function changesInfos(){
	var userName = $('#userName').val();
	var userNike = $('#userNike').val();
	var userRealname = $('#userRealname').val();
	var userSex = $('.info_css input[type=radio]:checked').val();
	var userEmail = $('#userEmail').val();
	var userSchool = $('#userSchool').val();
	 
	var flag_form = true;
	 
	grade_ids = $('#grade_select').val();
	 
	$('.fromstu').each(function(i, obj) {
         
		if($(obj).html().split('ok.gif').length==2){
			
		}else{
			flag_form = false;
		}
    });
	
	if(!flag_form){
		layer.alert('数据格式不正确',8,'温馨提示');
		return false;	
	}else{
		 
		var url_type = '/student?r='+$.getRom();
		var jsondata = {action:'edit','user_id':UserInfo.id,'username':userName,'realname':userRealname,'gender':userSex,'email':userEmail,'grade':grade_ids,'schoolName':userSchool,'note':'','nickname':userNike}; 	
		 
		var res_send_info = Ajax_option(url_type,jsondata,"POST",false);
		if(res_send_info.flag){
			
             
			stu_infos();
			layer.alert('修改用户基本信息成功!',9,'温馨提示');
			
		}else{
			layer.alert('修改用户基本信息失败!',8,'温馨提示');
		}
	}
}


//设置头像
function stu_headImg(){
	var url_type_img = '/avatar?r='+$.getRom();
	var Qjson_img = {'action':'download','user_id':UserInfo.id};
	var res_img = Ajax_option(url_type_img,Qjson_img,'GET',false);
	var imgname = '';
	if(res_img.list!=null&&res_img.list!=""){
		imgname = '../pic/avatar/'+res_img.list;
	}else{
		imgname = 'images/nopic.png';
	}
	$('#img_src').html('<img  src="'+imgname+'" width="120" height="120" />');
	
}
//上传头像
function uploadFiles(){
	$("#forms").ajaxSubmit({
		data:'JSON',
		success: function(data) {
			if(data.flag){
				stu_headImg();
				layer.alert('上传头像成功!',9,'温馨提示');	
			}else{
				layer.alert('上传头像失败!',8,'温馨提示');	
			}
		}
	}); 
	 
}


//设置课本信息
function stu_subjectbooks(){
	 var subject_nums = [1,2,3,4,5,6,7,8,9];
	/* if(section_idT==1){
		 subject_nums = [1,2,3];
	 }else if(section_idT==2){
	 	 subject_nums = [1,2,3,4,5,6,7,8,9];
	 }else{
		 subject_nums = [1,2,3,4,5,6,7,8,9]; 
	 }*/
	 var htmlsubjects = '';
	 var subje_values = getVerstionsVal();
	 if(subje_values.book_setting!=false){
		 var subject_Pubvalues = $.parseJSON(subje_values.book_setting);
		 $.each(subject_Pubvalues,function(i,n){
			if(grade_ids<=6&&(parseInt(n.subject_id)>3)){
				return false;			
			}
			htmlsubjects += '<dd><div class="book_img"><a href="javascript:void(0)" onclick="chanagebooks_index(\''+n.subject_id+'\');"><img src="'+n.p_src+'"  width="120" height="162" id="booktype_img_'+n.subject_id+'" book_id="'+n.p_id+'" /></a></div><div class="books_types" id="booktype_name_'+n.subject_id+'">'+n.p_name+'</div></dd>'; 
		 });
	 }else{
		var json_bookset = [{"subject_id":1,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP01.png"},{"subject_id":2,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP02.png"},{"subject_id":3,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP03.png"},{"subject_id":4,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP04.png"},{"subject_id":5,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP05.png"},{"subject_id":6,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP06.png"},{"subject_id":7,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP07.png"},{"subject_id":8,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP08.png"},{"subject_id":9,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP09.png"}];
		var set_url = '/exercise_post?r='+$.getRom();
    	var setQjson = {'action':'saveBookSetting','data':JSON.stringify(json_bookset)};
    	var p_flags = Ajax_option(set_url,setQjson,"POST",false); 
		if(p_flags.flag){
			$.each(json_bookset,function(i,n){
				if(grade_ids<=6&&(parseInt(n.subject_id)>3)){
					return false;			
				}
				htmlsubjects += '<dd><div class="book_img"><a href="javascript:void(0)" onclick="chanagebooks_index(\''+n.subject_id+'\');"><img src="'+n.p_src+'"  width="120" height="162" id="booktype_img_'+n.subject_id+'" book_id="'+n.p_id+'" /></a></div><div class="books_types" id="booktype_name_'+n.subject_id+'">'+n.p_name+'</div></dd>'; 
			 }); 
		}
		 
	 }
	 
	 $('.section_books').html(htmlsubjects);
}


//改变版本
function chanagebooks_index(sub_id){
	var res_books_url = '/exercise_query?r='+$.getRom();
	var section_idstemp = 10;
	if(judgeNull(UserInfo.grade_id)!=""){
		section_idstemp = grade_ch_section(UserInfo.grade_id);
		 
	}else{
		layer.alert('没有设置年级，请到个人信息中设置!',8,'温馨提示');	
		return;
	}
	//var res_books_Qjson = {'action':'publisher','subject_id':sub_id,'section_id':section_idstemp,'publisher_id':2};
	var res_books_Qjson = {'action':'publisher','subject_id':sub_id,'section_id':section_idstemp};
	var res_books_list = Ajax_option(res_books_url,res_books_Qjson,"GET",false);
	
	var bookhtml = '<div class="juan"><p><div id="product"><span class="prev"><a class="prev"></a></span><div id="content"><div id="content_list">';
	if(res_books_list.publisher!=""&&res_books_list.publisher!=null){
		$.each(res_books_list.publisher,function(i,n){
			bookhtml += '<dl>  <dt style="background:url(images/bookst0'+sub_id+'.png) no-repeat" class="product_dt"><span>'+n.Name+'</span></dt><dt class="product_dt_radio"><input type="radio" name="product_radio" value="'+n.id+'" />'+n.Name+'</dt></dl>';
		});
	}
	 
	bookhtml += '</div></div><span class="next"></span></div></p>'+
				'<p style="padding-top:10px;font-size:0; text-align:center;">'+
				'<a href="javascript:;" class="juanGo">确认</a>'+
				'<a href="javascript:;" class="juanLu">取消</a></p></div>';

	var i = $.layer({
		type: 1,
		title: [subject_sum(sub_id)+'--版本选择',true],
		closeBtn: ['',false],
		border : [5, 0.5, '#666', true],
		offset: ['',''],
		area: ['620px','auto'],
		page: {
			html: bookhtml
		}
	});
 		var juanLu = $('.juanLu'), juanGo = $('.juanGo');
		juanLu.on('click', function(){
			layer.close(i);
		});
		juanGo.on('click', function(){
			 //something
			var pro_value = $('.product_dt_radio input[name="product_radio"]:checked').val();
			 
			if(judgeNull(pro_value)!=""){
				 var pro_name = $('.product_dt_radio input[name="product_radio"]:checked').parent().text();
				 layer.close(i);
				// $('#booktype_img_'+sub_id).attr("src",'images/book_02.png');
				 $('#booktype_img_'+sub_id).attr("book_id",pro_value);
				 $('#booktype_name_'+sub_id).text(pro_name);
				  
				 saveVerstionVal();
				 //ajax something
				  
				  
			}else{
				 layer.alert('没有选择版本，想退出-点击取消按钮!',8,'温馨提示');		 
			}
		});
	pre_nextfun(); //给左右滚动添加点击事件

}


//获取各学科的版本信息并存成文件
function saveVerstionVal(){
	var p_List = [];
	for(var i =1;i<10;i++){
		var p_name = $('#booktype_name_'+i).text();
		var p_id = $('#booktype_img_'+i).attr("book_id");
		var p_src = $('#booktype_img_'+i).attr("src");
		p_List.push({'subject_id':i,'p_name':p_name,'p_id':p_id,'p_src':p_src});
	}
	 
	var set_url = '/exercise_post?r='+$.getRom();
    var setQjson = {'action':'saveBookSetting','data':JSON.stringify(p_List)};
    var p_flag = Ajax_option(set_url,setQjson,"POST",false); 
	if(p_flag.flag){
		layer.alert('版本设置成功!',9,'温馨提示');		 
	}else{
		layer.alert('版本设置失败!',8,'温馨提示');		 
	}
	
}


//获取学科的版本信息的文件
function getVerstionsVal(){
	var set_urls = '/exercise_query?r='+$.getRom();
    var setQjsons = {'action':'book_setting'};
    var p_lists = Ajax_option(set_urls,setQjsons,"GET",false);
	return p_lists;
}



//给左右滚动添加点击事件
function pre_nextfun(){
	var page = 1;  
	var its = 4; //每版放4个图片
	 
	//向后 按钮  
	$("span.next").click(function(){    //绑定click事件  
	
		 var content = $("div#content");   
		 var content_list = $("div#content_list");
		 var v_width = content.width();  
		 var len = content.find("dl").length;  
		 var page_count = Math.ceil(len / its) ;  
		 if( !content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画  
			  if( page == page_count ){  //已经到最后一个版面了,如果再向后，必须跳转到第一个版面。  
				content_list.animate({ left : '0px'}, "slow"); //通过改变left值，跳转到第一个版面  
				page = 1;  
			  }else{  
				content_list.animate({ left : '-='+v_width }, "slow");  //通过改变left值，达到每次换一个版面  
				page++;  
			 }  
		 }  
   });  
	//往前 按钮  
	$("span.prev").click(function(){  
		 var content = $("div#content");   
		 var content_list = $("div#content_list");  
		 var v_width = content.width();  
		 var len = content.find("dl").length;  
		 var page_count = Math.ceil(len /its) ;    
		 if(!content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画  
			 if(page == 1 ){  //已经到第一个版面了,如果再向前，必须跳转到最后一个版面。  
				content_list.animate({ left : '-='+v_width*(page_count-1) }, "slow");  
				page = page_count;  
			}else{  
				content_list.animate({ left : '+='+v_width }, "slow");  
				page--;  
			}  
		}  
	});  	
}

function edit_login(){
 			
	 		var old_passwords = $("#old_password").val();
			var new_passwords = $("#new_password").val();
			var new_re_passwords = $("#new_re_password").val();
			 
			if(old_passwords!=""&&new_passwords!=""&&new_passwords!=old_passwords&&new_passwords==new_re_passwords){
				var load_i = 0;
				$.ajax({
						type: "POST",
						dataType: "JSON",
						auto: false,
						url: Webversion + "/user/modifyPassword?_method=PUT&r=" + $.getRom() ,
						data: {'old_passwd':sha256_digest($("#old_password").val()),'new_passwd':sha256_digest($("#new_password").val()),'user_id':UserInfo.id},
						beforeSend: function (request) {
							load_i = layer.load('加载中...');  
							var authToken = { "logintype": 1};
							authToken.password = sha256_digest($("#old_password").val());
							authToken.username = UserInfo.username;
							authToken = Base64.encode($.toJSON(authToken));
							//request.setRequestHeader("Authorization", "Digest " + authToken);
							request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
						},
						complete: function (XMLHttpRequest, textStatus){
							layer.close(load_i);
						},
						success: function (result) {
							 
							if(result.flag==true){
								layer.alert('密码修改成功！新密码：'+new_passwords,9,'温馨提示',function(bool){ if(bool){
									var cookieOptions = { path: "/", expires: -1 };
									$.cookie("AuthToken", null, cookieOptions);
									$.cookie("UserInfo", null, cookieOptions);	
									window.location.href = "../index.html";
									$("#new_password").val("");
									$("#old_password").val("");
									$("#new_re_password").val("");
								}
								
								});
								 
								//event.preventDefault();
								
							}else{
								layer.alert('密码修改失败！', 8,'温馨提示');
								//jAlert('密码修改失败！', '温馨提示');
							}
						},
						error: function (result) {
							layer.alert('密码修改失败！', 8,'温馨提示');
							//jAlert('密码修改失败！', '温馨提示');
							
						}
				});
			}else if(old_passwords==""){
				//jAlert('原来密码不能为空！', '温馨提示');
				layer.alert('原来密码不能为空！', 8,'温馨提示');	
			}else if(new_passwords==""){
				//jAlert('新密码不能为空！', '温馨提示');	
				layer.alert('新密码不能为空！', 8,'温馨提示');	
			}else if(old_passwords==new_passwords){
				layer.alert('旧密码和新密码不能相同！', 8,'温馨提示');	
				//jAlert('旧密码和新密码不能相同！', '温馨提示');	
			}else if(new_passwords!=new_re_passwords){
				layer.alert('两次密码不一致！', 8,'温馨提示');	
				//jAlert('两次密码不一致！', '温馨提示');	
			}


}



//以下是表单验证

function checkEmail(e){
	var valuetempE = $('#'+e).val();
	if(/^.+\@(\[?)[a-zA-Z0-9\-\.]+\.([a-zA-Z]{2,3}|[0-9]{1,3})(\]?)$/.test(valuetempE)){
		$('.'+e+'_Ms').html('<img src="images/ok.gif" />');	
	}else{
		$('.'+e+'_Ms').html('邮箱格式不对！如：123@163.com');	
			
	}
}

function checknull(f){
	var valuetempF = $('#'+f).val();
	 
	if(/^$/.test(valuetempF)){
		$('.'+f+'_Ms').html('数据不能为空！');	
		
	}else{
		$('.'+f+'_Ms').html('<img src="images/ok.gif" />');	
	}
	 
}
 