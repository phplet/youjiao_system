//url地址接收数据内容


	
	

$().ready(function() {
	   
	   var  tabs_name = $('.tabs-title', window.parent.document);
	   UserInfo = $.evalJSON($.cookie("UserInfo"));
	   var tooltitle = "";
	   
	   var data = getUrlParam('data');
	   data = JSON.parse(data);
	   
	   
	   if(tabs_name.html()=="新闻管理"){
		   tooltitle = "&nbsp;新闻管理&nbsp;>>&nbsp;新闻详细";
	   }else if(tabs_name.html()=="通知公告"){
		   tooltitle = "&nbsp;公告管理&nbsp;>>&nbsp;公告详细";
	   }else if(tabs_name.html()=="首页"){
		   if(getUrlParam('types_id')==1){  //首页过来判断是否是新闻  ==1  新闻
			 tooltitle = "&nbsp;新闻管理&nbsp;>>&nbsp;新闻详细";  
		   }else{
			 tooltitle = "&nbsp;公告管理&nbsp;>>&nbsp;公告详细";  
		   }
		   
	   }
	   //显示添加新闻板块
	  $('#informations_demo').datagrid({
		title:tooltitle,
		collapsible:false,
	    toolbar: '#informations'
		 
	  });
	  
	 
	 /*{"news_title":"5ZWK5a6e5omT5a6e6Zi/6JCo5b63","creat_time":"2013-08-02",
	 "end_time":"2013-08-22","content":"5piv55qE6Zi/6JCo5b636Zi/6JCo5b63",
	 "ids":"{\"zoneids\":[\"32\"]}","create_by":"210","mobile":0,"id":"28"}*/
	 $('#newstitle').html(Base64.decode(data.news_title));		
	 $('#newstime').html("发布时间："+data.creat_time);
	 $('#content').html(Base64.decode(data.content));	
	 
	 $('#resetbtn').click(function(){
		if(tabs_name.html()=="新闻管理"){
		   window.location="News.html";
	   }else if(tabs_name.html()=="通知公告"){
		   window.location="Informations.html";
	   }else if(tabs_name.html()=="首页"){
			window.location="../HomePage.html";
	   }	 
		 
	 });
 
});

  



