// JavaScript Document

var search_content_array=[];
var content_array=[];
var UserInfo = {};
$(document).ready(function () {
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	if(UserInfo!=null&&UserInfo!=undefined){  
		var nick =  UserInfo.nick;
			 
		if (UserInfo.realname != null&&UserInfo.realname!="") {
				$('#headusername').text(UserInfo.realname);
		}else if(nick!=null&&nick!=""){
				$('#headusername').text(nick);
		}
	 	work_pi_ajax();
	}else{
		window.location.href = "../index.html";
	} 

});//.ready的结束标签


//批改过的作业的数据调用ajax
function work_pi_ajax(sub_cID){
	var load_i = 0;
	$.ajax({   //获取左边试卷列表
        url: Webversion + '/test/list/all', //url访问地址
        type: "GET",
        dataType: "json",
		data:{assign_type:3},
		cache: false,
		beforeSend: function (request) {
			load_i = layer.load('加载中...'); 
                request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
		complete: function (XMLHttpRequest, textStatus){
			layer.close(load_i);
		},
        success: function (result) {
		//alert("nhao");
		 
		//var str = JSON.stringify(result.test);
		//alert(str);
		   search_content_array=[];
		    subject_links(2,null);  //获得学生的科目  有没有内容都获得了
  			if(sub_cID!=null&&sub_cID!=""){
		   	 	var j = 0;
				$.each(result.test,function(idx,item){
			 
					//1.是未做的  2 是做了没有被批改 3  已经批改的
				    
					if(item.type == 3&&item.subject_id==sub_cID){
						search_content_array[j]=result.test[idx]; 
						j++;
					}else{
						return j;
					}
				});
				
			}else{
				
					var k = 0; 
					$.each(result.test,function(idx,item){
			 
					//1.是未做的  2 是做了没有被批改 3  已经批改的
				    
					if(item.type == 3){
						search_content_array[k]=result.test[idx]; 
						k++;
					}
				});
				
			}
			 
			load_html_start(1); 
			
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



/**合成中间html**/
function make_content_list(obj){
	 
	var html='<li style="background:url(images/tab_P_bg_'+obj.subject_id+'.gif) no-repeat"><div class="text_011">'+obj.name+'</div><div class="text_012">'+obj.creat_date.substring(0,10)+'阅</div><div class="text_013" style="text-align:right; width:110px; padding-right:10px;">'+obj.teacher_name.substring(0,1)+'老师</div><div class="text_014"><span class="text_010"><a href="#" onclick="yipiyue(\''+Base64.encode(obj.content)+'\',\''+obj.name+'\',\''+obj.creat_date+'\','+obj.study_exercise_id+','+obj.exercise_id+',\''+obj.pi+'\','+obj.subject_id+');">查看</a></span>&nbsp;&nbsp;<span class="text_010"><a  onclick="onpi(\''+obj.pi+'\')">评论</a></span></div></li>';
					
	return html;
}

/**合成底部html**/
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
/**翻页**/
function load_html_start(page){
	var total_item=15;
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


function onpi(stupi){
	layer.alert('<div style="padding:10px; text-align:left;">'+stupi+'</div>', 9,'老师评语');
	 
}


function yipiyue(contentid,sjname,time,id,eid,pi,sub_id){
	//alert(sjid);
	$.cookie("shijuanid",Base64.decode(contentid) ,{path:"/"});
	$.cookie("sjid",id ,{path:"/"});
	$.cookie("shijuan_pi",pi ,{path:"/"});
	$.cookie('shijuanName',sjname,{path:"/"});
	$.cookie("exercise_id",eid ,{path:"/"});
	$.cookie("sub_Id",sub_id,{path:"/"});
	$.cookie("shijuanTime",time,{path:"/"});
	window.location.href="OKHmwk.html";
	
}