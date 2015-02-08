//url地址接收数据内容


	
	

$().ready(function() {
	  
	  
	  KindEditor.ready(function(K) {
	       window.editor = K.create('#answerArea');
		   var data = getUrlParam('data');
		   var condata = getUrlParam('content');
		    
	  	   data = JSON.parse(data);
		    
		   
	       $('#news_Title').attr("value",Base64.decode(data.news_title));		
		   
	       editor.html(Base64.decode(data.content));	
		   K('#editebtn').click(function(e) {
			   if(editor.isEmpty()){
					$.messager.alert('温馨提示', '新闻内容不能为空！', 'info');
					return;
			   }
			   editnews('edit',data.id);
			   
		   });
		   
	  });
	   
	   UserInfo = $.evalJSON($.cookie("UserInfo"));
	   //显示添加新闻板块
	  $('#informations_demo').datagrid({
		title:"&nbsp;新闻管理&nbsp;>>&nbsp;修改新闻",
		collapsible:true,
	    toolbar: '#informations'
		 
	  });
	  
	 

    $('#resetbtn').click(function(){
		 window.location="News.html";
	});
    // 绑定搜索事件
    $("#BtnSearch").click(function () {

        if ($("#SchoolText").attr("innt") == "1") {
            $.messager.alert('温馨提示', '请输入姓名再搜索！', 'info');
            return;
        }

        $.messager.progress({ text: '正在搜索校区信息' });

        $('#BtnSearch').datagrid("getPager").pagination("select", 1);

        $.messager.progress('close');

    });
     

	  
    
});

 function editnews(type,id){
	 var title = $("#news_Title").val();
	 var editorhtml = editor.html();
	 
	 var endtime = '2013-5-16';
	 var data = {};
	 data.action = type;
	 data.newsid = id;
	 data.title = Base64.encode(title);
	 data.content = Base64.encode(editorhtml);
	 data.school_id = UserInfo.school_id;
	 data.active = 1 ;
	 data.expire_date = endtime;
	  
	$.ajax({
        url: Webversion+'/news',
        type: "POST",
        dataType: "json",
        data: data,
        success: function (result) {
			window.location="News.html?index="+id; 
        },
        error: function (result) {

        }
    });
}



