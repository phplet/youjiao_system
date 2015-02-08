// JavaScript Document

var search_content_array=[];
var content_array=[];
var temp_sub = [];
var UserInfo = {};
$().ready(function () {
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	if(UserInfo!=null&&UserInfo!=undefined){
		var nick =  UserInfo.nick;
			 
		if (UserInfo.realname != null&&UserInfo.realname!="") {
				$('#headusername').text(UserInfo.realname);
		}else if(nick!=null&&nick!=""){
				$('#headusername').text(nick);
		}
		temp_sub = subject_links(1,10); //给页面中的科目赋值
		//goods_erroajax(科目id（科目为null的情况下是查询全部的内容）,好题错题（2,1）,当前页数,每页显示的条数)
		
		$('#subject_Gsum a').click(function(){
			$('.active_on').removeClass("active_on");
			$(this).addClass("active_on");
		});
		$('#subject_Esum a').click(function(){
			$('.active_on').removeClass("active_on");
			$(this).addClass("active_on");
		});
		$('#subject_Gsum a').eq(0).addClass("active_on");
	  	goods_erroajax(temp_sub[0],2,1,10);
	 	$('#goods_erroajax').click(function(){$('.active_on').removeClass("active_on"); goods_erroajax(temp_sub[0],2,1,10); $('#subject_Gsum a').eq(0).addClass("active_on");});
	  	$('#erro_erroajax').click(function(){$('.active_on').removeClass("active_on"); goods_erroajax(temp_sub[0],1,1,10); $('#subject_Esum a').eq(0).addClass("active_on");});
		// goods_erroajax(2);
	}else{
		window.location.href = "../index.html";
	} 
});//.ready的结束标签


//链接好题错题数据库带参数的
function goods_erroajax(subid,history_type,begin_page,total_item){
	var load_i = 0;  
	$.ajax({   //获取左边试卷列表
	 
        url: Webversion + '/history/list/0,100?r='+$.getRom(), //url访问地址
	 
        type: "GET",
        dataType: "json",
		data:{"subject_id":subid,"history_type":history_type,"begin_page":begin_page,"total_item":total_item},
		cache: false,
		beforeSend: function (request) {
			load_i = layer.load('加载中...'); 
            request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
		complete: function (XMLHttpRequest, textStatus){
			layer.close(load_i);
		},
        success: function (result) {
			 
		 	if(result.history!=null){
				 var total_pages = parseInt(result.total_pages);  //分页总页数
			 
				 var ge_temp = "" ;
				 if(history_type==1){
				 	ge_temp = "erros_list";
				 	
				 }else{
				 	ge_temp = "goods_list";
				 }
				 goods_erro(result,ge_temp,begin_page,total_item);
				  
				 //分页   total_pages  总页数 , begin_page  当前页数,  
				 var page_str_temp = '<li class="text_017"><a href="javascript:goods_erroajax('+subid+','+history_type+',1,'+total_item+');">首 页</a></li>';
				if((parseInt(begin_page))>1){
					page_str_temp += '<li class="text_017"><a href="javascript:goods_erroajax('+subid+','+history_type+','+(parseInt(begin_page)-1)+','+total_item+');">上一页</a></li>';	 
				 }
				 if(total_pages>1){
			        
				 	for(var k=1;k<=total_pages;k++){
						if(k<=8){
				 		page_str_temp+='<li class="text_018" id="page_'+history_type+'_'+k+'"><a href="javascript:goods_erroajax('+subid+','+history_type+','+k+','+total_item+');" >'+k+'</a></li>';
						} else{
							
							page_str_temp+='<li class="text_018" style="display:none;" id="page_'+history_type+'_'+k+'"><a href="javascript:goods_erroajax('+subid+','+history_type+','+k+','+total_item+');" >'+k+'</a></li>';
						}
				 	}
					
		 
				 }
				 
				  
				 if((parseInt(begin_page))<(parseInt(total_pages))){
					page_str_temp += '<li class="text_017" ><a href="javascript:goods_erroajax('+subid+','+history_type+','+(parseInt(begin_page)+1)+','+total_item+');">下一页</a></li><li class="text_017"><a href="javascript:goods_erroajax('+subid+','+history_type+','+total_pages+','+total_item+');">尾 页</a></li>';	 
				 }
				 
				  page_str_temp += '<li class="text_017" style="width:70px;">'+total_item+' 题/页</li><li class="text_017">共 '+total_pages+' 页</li>';
				 
				 $('#page_id_'+history_type).html(page_str_temp);
				 $('#page_'+history_type+'_'+begin_page).attr("class","text_019");
				 if(parseInt(begin_page)>8&&(parseInt(begin_page))<=(parseInt(total_pages))){
					 
					 var sum  = (parseInt(begin_page))-8;
					 
					 for(var m=1;m<=sum;m++){
						 $('#page_'+history_type+'_'+m).css("display","none");
						  
						 $('#page_'+history_type+'_'+(8+m)).css("display","block");
					 }
						
					}
				moves_jixi();
		 	}else{
				 
			   if(history_type==2){
				  $("#goods_list").html('<div style="padding-top:50px;"><img src="images/work_goods.png" /></div>'); 
				  $('#page_id_2').empty();
			   }else if(history_type==1){
				  $("#erros_list").html('<div style="padding-top:50px;"><img src="images/work_erro.png" /></div>');
				  $('#page_id_1').empty();
			   }
			    
			   var GorE_temp = "";
			 
		 	}
		}
    });
}




//判断好题错题本内容,直接追加到页面
function goods_erro(result,ge_temp,begin_page,total_item){
				var erros_str = "" ;
				var goods_str = "" ;
				$.each(result.history,function(idx,item){
				   var temp_insight = item.my_insight;
				   if(temp_insight==null||temp_insight==""){
					   temp_insight="";
				   }else {
				   		temp_insight = item.my_insight;
				   }
				   if(item.flag==1){
						erros_str +='<div class="main_box_4"><div class="main_box_4_title"><div class="main_box_4_title_l" id="main_box_4_title_l" style="width:600px;"><span class="text_004">'+(idx+1+(parseInt(begin_page)-1)*parseInt(total_item))+'、</span><span class="text_004">收藏时间：'+item.add_time+'</span><span class="text_004">试题ID：'+item.question_id+'</span></div><div class="main_box_4_title_r" >答错：'+item.ti_count+' 次</div></div><div class="main_box_4_cen"><div class="main_box_4_cen_1">'+item.content+'</div><div class="hf_tab"><a class="hf_goods" id="hf_goods'+item.question_id+'" onclick="goods_jiexi(\''+item.question_id+'\','+item.subject_id+','+item.dbtype+');">查看解析</a>&nbsp;&nbsp;<a class="hf_sc" onclick="update_goodserro_ajax(1,\''+item.question_id+'\','+item.subject_id+')">取消收藏</a>&nbsp;&nbsp;<a class="hf_sc" onclick="sel_goods(2,\''+item.question_id+'\','+item.subject_id+',2,'+item.dbtype+','+item.grade_id+')">收藏好题</a>&nbsp;&nbsp;<a class="hf">学习心得</a></div><div id="focus" class="focuses" style="display:none;"><div><textarea class="text_015_textarea" name="#" cols="85" rows="5" id="'+item.question_id+'_insight">'+temp_insight+'</textarea></div><div style="text-align:center;"><input type="button" class="sub_002" value="保 存" onclick="sub_insight(\''+item.question_id+'\')" /></div></div><div id="focus_jiexi" class="focuses_jiexi" style="display:none;">查看解析</div></div></div>';
				   }else{
					  erros_str +='<div class="main_box_4"><div class="main_box_4_title"><div class="main_box_4_title_l" id="main_box_4_title_l" style="width:90%;"><span class="text_004">'+(idx+1+(parseInt(begin_page)-1)*parseInt(total_item))+'、</span><span class="text_004">收藏时间：'+item.add_time+'</span><span class="text_004">试题ID：'+item.question_id+'</span></div><div class="main_box_4_title_r" ></div></div><div class="main_box_4_cen"><div class="main_box_4_cen_1">'+item.content+'</div><div class="hf_tab"><a class="hf_goods" id="hf_goods'+item.question_id+'" onclick="goods_jiexi(\''+item.question_id+'\','+item.subject_id+','+item.dbtype+');">查看解析</a>&nbsp;&nbsp;<a class="hf_sc" onclick="update_goodserro_ajax(2,\''+item.question_id+'\','+item.subject_id+')">取消收藏</a>&nbsp;&nbsp;<a class="hf">学习心得</a></div><div id="focus" class="focuses" style="display:none;"><div><textarea class="text_015_textarea" name="#" cols="85" rows="5" id="'+item.question_id+'_insight">'+temp_insight+'</textarea></div><div style="text-align:center;"><input type="button" class="sub_002" value="保 存" onclick="sub_insight(\''+item.question_id+'\')" /></div></div><div id="focus_jiexi" class="focuses_jiexi" style="display:none;">查看解析</div></div></div>'; 
				  }
				 
				});
				
				$("#"+ge_temp).html(erros_str);
				
}



//更新好题错题数据库内容
function update_goodserro_ajax(history_type,mode_id,subid){
	var ii = layer.confirm('是否取消收藏?' , function(){
		     var load_i = 0;
			 $.ajax({  
        		url: Webversion + "/history?_method=DELETE&r="+$.getRom(),
       		 	type: "POST",
        		dataType: "json",
        		data: {
    				"ti_id": mode_id,
					"flag":history_type
        		},
				beforeSend: function (request) {
					load_i = layer.load('加载中...'); 
						request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
				complete: function (XMLHttpRequest, textStatus){
					layer.close(load_i);
					layer.close(ii);
				},
        		success: function (result)
       			{   
				$("#erros_list").empty();
					goods_erroajax(subid,history_type,1,10);
					 
					layer.alert('取消成功', 9,'温馨提示');
					 
				},
				error: function (result)
				{
					
					layer.alert('系统插入信息失败', 8,'温馨提示');
		 			 
		  
		 			return;
				}
    		 });
         
		  },'温馨提示',function(){layer.close(ii);});
	  

}

//提交学生心得

function sub_insight(tid){
	 var user_Info = $.evalJSON($.cookie("UserInfo"));
	 var temp_insight = $('#'+tid+'_insight').val();
	 var iis = layer.confirm('是否提交学习心得?' , function(){
		 if($.trim(temp_insight)!=""&&$.trim(temp_insight)!=null){
			   var load_i = 0;
			 	$.ajax({  
        		url: Webversion + "/history/updateInsight?r="+$.getRom(),
       		 	type: "POST",
        		dataType: "json",
        		data: {
					"userId": user_Info.id,
    				"question_id": tid,
					"my_insight":temp_insight
        		},
				beforeSend: function (request) {
					load_i = layer.load('加载中...'); 
						request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
				complete: function (XMLHttpRequest, textStatus){
					layer.close(load_i);
					layer.close(iis);
				},
        		success: function (result)
       			{   
					 
					layer.alert('提交学习心得成功！', 9,'温馨提示');
					 
				},
				error: function (result)
				{
					 
					layer.alert('系统插入信息失败！', 8,'温馨提示');
		 			 
		  
		 			return;
				}
    		 	});
		 }else{
			 layer.close(iis);
			 layer.alert('你没有写心得,不能够提交！', 8,'温馨提示');
		 }
		 
	 }, '温馨提示' , function(){
		  layer.close(iis);
	 });
	 
		
}





/**分页--合成中间html**/
function make_content_list(obj){
	var html='<li style="background:url(images/tab_P_bg.gif) no-repeat"><div class="text_011">'+obj.name+'</div><div class="text_012">'+obj.creat_date.substring(0,10)+'阅</div><div class="text_013">吴老师</div><div class="text_014"><span class="text_010"><a href="#" onclick="yipiyue(\''+obj.content+'\',\''+obj.name+'\',\''+obj.creat_date+'\','+obj.id+','+obj.exercise_id+');">查看</a></span>&nbsp;&nbsp;<span class="text_010"><a href="#">评论</a></span></div></li>';
					
	return html;
}

/**分页--合成底部html**/
function make_content_footer(obj){
	var shouye='load_html_start(1)';
	var moye='load_html_start('+obj.total_page+')';

	var html='<li class="text_017">共'+obj.total_page+'页</li>';
	if(obj.total_page>1){
	html+='&nbsp;&nbsp;<li class="text_017"><a href="javascript:'+shouye+';">首 页</a></li>';
	var page_sum=9;
	var page=Math.floor(page_sum/2);
	
	
	var begin=obj.page-page;
	var end=obj.page+page;
	begin=begin<1?1:begin;
	
	var temp=end-begin;
	if(temp<(page_sum-1)){
		temp=page_sum-temp-1;
		end=end+temp;
	}

	if(end>obj.total_page){
		temp=end-obj.total_page;
		begin=begin-temp;
		end=obj.total_page;
		begin=begin<1?1:begin;
	}

	//var c=obj.page;
	if(obj.page>1){
			html+='<li class="text_017"><a href="javascript:load_html_start('+(obj.page-1)+');">上一页</a></li>';
	}else{
		//html+='<a>上一页&nbsp;&nbsp;</a>';
	}

	for(var c=begin;c<=end;c++){
		if(c==obj.page){
			html+='<li class="text_018"><a style="width:20px; height:20px; text-align:center; background-color:#030; display:block;">'+c+'</a></li>';
		}else{
			html+='<li class="text_018"><a href="javascript:load_html_start('+c+');">'+c+'</a></li>';
		}
	}

	if(obj.page<obj.total_page){
	html+='<li class="text_017"><a href="javascript:load_html_start('+(obj.page+1)+')">下一页</a></li>';
	}else{
	//html+='<a>下一页&nbsp;&nbsp;</a>';
	}
	}

	html+='<li class="text_017"><a href="javascript:'+moye+';">尾 页</a></li>';

	return html;

}
/**分页--翻页**/
function load_html_start(page){
	var total_item=5;
	var length=search_content_array.length;
	var total_page=Math.ceil(length/total_item);
	var begin=(page-1)*total_item;
	var end=page*total_item;

	var message_obj=new Object();
	message_obj.page=page;
	message_obj.total_page=total_page;

	var message_obj2=new Object();
	message_obj2.length=length;
	var buf=[];
	for(var i=0;i<search_content_array.length;i++){
		  if((i>=begin)&&(i<end)){
			  buf.push(make_content_list(search_content_array[i]));
		  }
	}

jQuery("#ul_list_id").html(buf.join(""));

jQuery("#page_id").html(make_content_footer(message_obj));
}


