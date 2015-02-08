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
		 
	 	$('#infomation_ajax').click(function(){
			$('#infomation_list').html("");
			news_list('notice',UserInfo.id,"infomation_list",0);//更新公告 
		});
	  	$('#news_ajax').click(function(){
			$('#news_list').html("");
			news_list('news',UserInfo.id,"news_list",0);   //更新新闻	
			
		});
		
		news_list('notice',UserInfo.id,"infomation_list",0);//更新公告 
	}else{
		window.location.href = "../index.html";
	} 
});//.ready的结束标签

function news_list(news,uid,css_idT,type_n){
	 
	 var pagenum = 1;
	 var pn_temp = $('.next_pageT').attr('num');
	  
	 if(type_n!=0&&pn_temp!=undefined&&pn_temp!=""){
		$('.next_pageT').addClass('loading_G');
		$('.next_pageT').text('加载中...');
		pagenum =parseInt(pn_temp);
		
	 }
	 var Qjson = {'user_id':uid,'listtype':1};
	 var url_type = '/'+news+'?pageno='+pagenum+'&countperpage=10&r='+$.getRom();
	 
	 var result  = Ajax_option(url_type,Qjson,"GET",false);
	// result = {'list':[{'center_name':'一中','expire_date':'2014-02-05 11:10:30','creat_date':'2013-12-05','title':'5LuK5pmo5aSu6KeG5paw6Ze75oql6YGTLOS4reWbveiHquW3seefpeivhuS6p+adg+eahOaZuuiDveaTjeS9nOezu+e7n+mXruS4luOAgg==','content':'MeS7iuaZqOWkruinhuaWsOmXu+aKpemBkyzkuK3lm73oh6rlt7Hnn6Xor4bkuqfmnYPnmoTmmbrog73mk43kvZzns7vnu5/pl67kuJbku4rmmajlpK7op4bmlrDpl7vmiqXpgZMs5Lit5Zu96Ieq5bex55+l6K+G5Lqn5p2D55qE5pm66IO95pON5L2c57O757uf6Zeu5LiW5LuK5pmo5aSu6KeG5paw6Ze75oql6YGTLOS4reWbveiHquW3seefpeivhuS6p+adg+eahOaZuuiDveaTjeS9nOezu+e7n+mXruS4lg0KICAgICAgICAgICAgICAgICAgICAgICAgICAgIOS7iuaZqOWkruinhuaWsOmXu+aKpemBkyzkuK3lm73oh6rlt7Hnn6Xor4bkuqfmnYPnmoTmmbrog73mk43kvZzns7vnu5/pl67kuJbku4rmmajlpK7op4bmlrDpl7vmiqXpgZMs5Lit5Zu96Ieq5bex55+l6K+G5Lqn5p2D55qE5pm66IO95pON5L2c57O757uf6Zeu5LiW5LuK5pmo5aSu6KeG5paw6Ze75oql6YGTLOS4reWbveiHquW3seefpeivhuS6p+adg+eahOaZuuiDveaTjeS9nOezu+e7n+mXrg0KICAgICAgICAgICAgICAgICAgICAgICAx5LuK5pmo5aSu6KeG5paw6Ze75oql6YGTLOS4reWbveiHquW3seefpeivhuS6p+adg+eahOaZuuiDveaTjeS9nOezu+e7n+mXruS4luS7iuaZqOWkruinhuaWsOmXu+aKpemBkyzkuK3lm73oh6rlt7Hnn6Xor4bkuqfmnYPnmoTmmbrog73mk43kvZzns7vnu5/pl67kuJbku4rmmajlpK7op4bmlrDpl7vmiqXpgZMs5Lit5Zu96Ieq5bex55+l6K+G5Lqn5p2D55qE5pm66IO95pON5L2c57O757uf6Zeu5LiWMeS7iuaZqOWkruinhuaWsOmXu+aKpemBkyzkuK3lm73oh6rlt7Hnn6Xor4bkuqfmnYPnmoTmmbrog73mk43kvZzns7vnu5/pl67kuJbku4rmmajlpK7op4bmlrDpl7vmiqXpgZMs5Lit5Zu96Ieq5bex55+l6K+G5Lqn5p2D55qE5pm66IO95pON5L2c57O757uf6Zeu5LiW5LuK5pmo5aSu6KeG5paw6Ze75oql6YGTLOS4reWbveiHquW3seefpeivhuS6p+adg+eahOaZuuiDveaTjeS9nOezu+e7n+mXruS4lg=='}]};
	 var htmls_news = '';
	 var iits = 0;
	 
	 if(result.list!=null&&result.list!=""){
		 
		$.each(result.list,function(ii,nn){
			var nameT = "";
			$('#tempcontents').html(Base64.decode(decodeURIComponent(nn.content)));
			var tempcontet = $('#tempcontents').text();
			if(nn.center_name!=null&&nn.center_name!=""){
				nameT = nn.center_name;
			}else{
				nameT = nn.zone_name;
			}
			
			if(css_idT=='news_list'){
				
				htmls_news += '<div class="list_content"><div><span class="text_020">'+Base64.decode(nn.title)+'</span></div><div class="edit_admin"><span>来源：【'+nameT+'】 发布时间：'+nn.create_time+'</span></div><div class="conditon_font">'+cutString(tempcontet,120).cutstring+'...</div><div class="link_a"><span>&nbsp;<a href="javascript:void(0)" class="open_content">展开</a></span><span class="downs_img"></span><span class="cleard"></span></div><div class="content_minute" style="display:none;"><span class="content_min_Title">内容详细：</span><span class="conditon_font">'+Base64.decode(decodeURIComponent(nn.content))+'</span></div></div>';
			}else{
				if(date_Diff_day(getNowDate(),nn.expire_date)==1){
					htmls_news += '<div class="list_content"><div><span class="text_020">'+Base64.decode(nn.title)+'</span></div><div class="edit_admin"><span>来源：【'+nameT+'】 发布时间：'+nn.create_time+'</span></div><div class="conditon_font">'+cutString(tempcontet,120).cutstring+'...</div><div class="link_a"><span>&nbsp;<a href="javascript:void(0)" class="open_content">展开</a></span><span class="downs_img"></span><span class="cleard"></span></div><div class="content_minute" style="display:none;"><span class="content_min_Title">内容详细：</span><span class="conditon_font">'+Base64.decode(decodeURIComponent(nn.content))+'</span></div></div>';
				}
			}
			iits++;
		});
		if(type_n==0){
			htmls_news += '<a class="next_pageT" num="'+(pagenum+1)+'" onclick="news_list(\''+news+'\','+uid+',\''+css_idT+'\',1);">加载更多</a>';
		}
	}else{
		 
		if(type_n==0){
			htmls_news = '<img src="images/news_no.png" />';
		}
	}
	if(type_n==0){
		$('#'+css_idT).html(htmls_news);
	}else{
		
		$('.next_pageT').removeClass('loading_G');	
		$('.next_pageT').text('加载更多');
		$('.next_pageT').before(htmls_news);
		$('.next_pageT').attr('num',(pagenum+1));
		
		
	}
	
	if(iits!=10){
		$('.next_pageT').hide();
	}else{
		$('.next_pageT').show();
	}
	
	$('.open_content').unbind('click');
	$('.open_content').click(function(){
		
		if($(this).text()=='展开'){
			$(this).parent().parent().next().css('display','block');
			$(this).text('收起');
			$(this).parent().next().attr('class','ups_img');
		}else{
			$(this).parent().parent().next().css('display','none');
			$(this).text('展开');	
			$(this).parent().next().attr('class','downs_img');
		}
	});
}

 



 

 