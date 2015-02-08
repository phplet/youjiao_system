// JavaScript Document
function news_list(news,center_id,cid,zoneid,css_idT){
	var Qjson = {'center_id':center_id,'user_id':cid,listtype:1};
	if(css_idT=='news_list'){
		Qjson = {'center_id':center_id,'id':cid,listtype:1};
	}
	if(zoneid!=""){
		Qjson['zone_id'] = zoneid;
	}
	 $.ajax({
		url: Webversion + '/'+news+'?pageno=1&countperpage=5',
		type: "GET",
		async:false,
		dataType: "json",
		data:Qjson,
		beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
		success: function (result) {
			if(result.list!=null&&result.list!=[]){
				var htmls_news = '';
				$.each(result.list,function(ii,nn){
					var nameT = "";
					if(nn.center_name!=null&&nn.center_name!=""){
						nameT = nn.center_name;
					}else{
						nameT = nn.zone_name;
					}
					if(css_idT=='news_list'){
						htmls_news += '<li><span>'+(ii+1)+'.<a href="#">【'+nameT+'】'+Base64.decode(nn.title).substring(0,12)+'</a></span></li>';
					}else{
						if(date_Diff_day(getNowDate(),nn.expire_date)==1){
						 	htmls_news += '<li><span>'+(ii+1)+'.<a href="#">【'+nameT+'】'+Base64.decode(nn.title).substring(0,12)+'</a></span></li>';
						}
					}
				});	 
				$('#'+css_idT).html(htmls_news);
			}
		},
		error: function (result) {
			if(css_idT=='news_list'){
				layer.alert('新闻加载失败！', 8,'温馨提示');
				 
			}else{
				layer.alert('公告加载失败！', 8,'温馨提示');
				 
			}
		}
	});		


}

