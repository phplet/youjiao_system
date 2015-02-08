// JavaScript Document

var search_content_array=[];
var content_array=[];
var current_time='';
var end_time='';
var jjj=0;
$(document).ready(function () {
	  goods_erroajax(0,2,1);
	// goods_erroajax(2);
	
});//.ready的结束标签

function time(){
	var today=new Date();
	var h=today.getHours();
	var m=today.getMinutes();
	var s=today.getSeconds();
	current_time = h+':'+m+':'+s;
}
function endtime(){
	var today1=new Date();
	var h1=today1.getHours();
	var m1=today1.getMinutes();
	var s1=today1.getSeconds();
	end_time = h1+':'+m1+':'+s1;
}
//链接好题错题数据库带参数的
function goods_erroajax(subid,history_type,begin_page){
	
	time();
	//alert(current_time);
	for(var i=1;i<=10000;i++){
		$.ajax({   //获取左边试卷列表
		 
			url: Webversion + '/question/detail/0,100?r='+$.getRom(), //url访问地址
		 
			type: "GET",
			dataType: "json",
			data:{"id":'zgx10000325'},
			cache: false,
			beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
			},
			success: function (result) {
				
				jjj = jjj++;
				/* if(result!=null){
					 var total_pages = parseInt(result.total_pages);  //分页总页数
					 
					 subject_links(1);
					 var ge_temp = "" ;
					 if(history_type==1){
						ge_temp = "erros_list";
						
					 }else{
						ge_temp = "goods_list";
					 }
					 goods_erro(result,ge_temp);
					  
					 //页码的排列
					 var page_str_temp = '<li class="text_017"  href="javascript:load_html_start(0);" ><a>首 页</a></li>';
					 if(begin_page>1){
						page_str_temp += '<li class="text_017"  href="javascript:load_html_start(0);" ><a>上一页</a></li>';	 
					 }
					 if(total_pages>1){
					 
					 for(var k=1;k<=total_pages;k++){
						page_str_temp+='<li class="text_018" id="page_'+k+'"><a href="javascript:load_html_start('+k+');" >'+k+'</a></li>';
					 }
					 
					
					 }
					 if(begin_page<total_pages){
						page_str_temp += '<li class="text_017"  href="javascript:load_html_start(0);" ><a>上一页</a></li>';	 
					 }
					  page_str_temp += '<li class="text_017"  href="javascript:load_html_start(0);" ><a>尾 页</a></li><li class="text_017">共'+total_pages+'页</li>';
					 
					 $('#page_id').html(page_str_temp);
					 $('#page_'+begin_page).attr("class","text_019");
					moves_jixi();
				}else{
				   jAlert('收藏好题错题本为空！', '温馨提示');
				} */
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
	endtime();
	
	alert('开始时间==='+current_time+'结束时间==='+end_time+'循环次数==='+jjj);
}




//判断好题错题本内容,直接追加到页面
function goods_erro(result,ge_temp){
				var erros_str = "" ;
				var goods_str = "" ;
				$.each(result.history,function(idx,item){
				   var temp_insight = item.my_insight;
				   if(temp_insight==null||temp_insight==""){
					   temp_insight="";
				   }else {
				   		temp_insight = item.my_insight;
				   }
					
					erros_str +='<div class="main_box_4"><div class="main_box_4_title"><div class="main_box_4_title_l" id="main_box_4_title_l"><span class="text_004">'+(idx+1)+'、</span><span class="text_004">收藏时间：'+item.add_time+'</span><span class="text_004">试题ID：'+item.question_id+'</span><span class="text_004">科目类别：'+item.subject_id+'</span></div><div class="main_box_4_title_r" ></div></div><div class="main_box_4_cen"><div class="main_box_4_cen_1">'+item.content+'</div><div class="hf_tab"><a class="hf_goods" id="hf_goods'+item.question_id+'" onclick="goods_jiexi(\''+item.question_id+'\');">查看解析</a>&nbsp;&nbsp;<a class="hf_sc" onclick="update_goodserro_ajax(\''+item.question_id+'\','+item.subject_id+')">取消收藏</a>&nbsp;&nbsp;<a class="hf">学习心得</a></div><div id="focus" class="focuses" style="display:none;"><div><textarea class="text_015_textarea" name="#" cols="85" rows="5" id="'+item.question_id+'_insight">'+temp_insight+'</textarea></div><div style="text-align:center;"><input type="button" class="sub_002" value="保 存" onclick="sub_insight(\''+item.question_id+'\')" /></div></div><div id="focus_jiexi" class="focuses_jiexi" style="display:none;">查看解析</div></div></div>';
			
				 
				});
				
				$("#"+ge_temp).html(erros_str);
				
}



//更新好题错题数据库内容
function update_goodserro_ajax(mode_id,subid){
	jConfirm('是否取消收藏?', '温馨提示', function(r) {
		
		if (r==true){ 	
			 $.ajax({  
        		url: Webversion + "/history?_method=DELETE&r="+$.getRom(),
       		 	type: "POST",
        		dataType: "json",
        		data: {
    				"ti_id": mode_id
        		},
				beforeSend: function (request) {
                	request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        		},
        		success: function (result)
       			{   
				$("#erros_list").empty();
					goods_erroajax(subid);
					jAlert('取消成功！', '温馨提示');
				},
				error: function (result)
				{
		 			jAlert('系统插入信息失败！', '温馨提示');
		  
		 			return;
				}
    		 });
          }
	 });
	

}

//提交学生心得

function sub_insight(tid){
	jConfirm('是否提交学习心得?', '温馨提示', function(r) {
		var temp_insight = $('#'+tid+'_insight').val();
		
		if (r==true){ 	
		   if($.trim(temp_insight)!=""&&$.trim(temp_insight)!=null){
			 	$.ajax({  
        		url: Webversion + "/history/updateInsight?r="+$.getRom(),
       		 	type: "POST",
        		dataType: "json",
        		data: {
    				"question_id": tid,
					"my_insight":temp_insight
        		},
				beforeSend: function (request) {
                	request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        		},
        		success: function (result)
       			{   
					jAlert('提交学习心得成功！', '温馨提示');
				},
				error: function (result)
				{
		 			jAlert('系统插入信息失败！', '温馨提示');
		  
		 			return;
				}
    		 	});
			 }else{
				jAlert('你没有写心得,不能够提交！', '温馨提示'); 
			 }
          }
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


