var UserInfo = [];
var note_info = {}; 
var editor = [];
/*function getHrefParams(){
	var param = {};
	var _p=window.location.href.split('?')[1].split('&');
	for(var i in _p){
		var tmp = _p[i].split('=');
		param[tmp[0]] = tmp[1];
	}
	return param;
}*/



$(document).ready(function(){
	
	var newcreate_date = getNowDateSec();
	 
		UserInfo = $.evalJSON($.cookie("UserInfo"));
		if(UserInfo!=null&&UserInfo!=undefined){
			
			var nick =  UserInfo.nick;
				 
			if (UserInfo.realname != null&&UserInfo.realname!="") {
					$('#headusername').text(UserInfo.realname);
			}else if(nick!=null&&nick!=""){
					$('#headusername').text(nick);
			}
			
			note_info = $.parseJSON(Base64.decode(getUrlParam('test_info')));
			var section_name = note_info['section_id'] ==2 ? '初中' : '高中';
			 
			$('.test_subject').html(section_name+subject_sum(note_info.subject_id)+'学习笔记');
			$('.chapter_name').html(note_info.name);
			note_list(1);
			 
		}else{
			window.location.href = "../index.html";
		} 	
	 
});


//笔记列表
function note_list (num){
	var pages = 10;
	$('#next_div').show();
	if(num==0){
		num = $('.next_pageTsq').attr("num");	
	}
	var topL0 = $(document).scrollTop();
	 
	var ti_urlTz = '/notes_exercise?countperpage='+pages+'&r='+$.getRom()+'&pageno='+num;
	var ti_jsonTz = {'action':'get_user_notes','exam_id':note_info['zhuanti_id'],'user_id':note_info['user_id'],'subject_id':note_info['subject_id'],'grade_id':note_info['grade_id']};
	var tires_flagTz = Ajax_option(ti_urlTz,ti_jsonTz,"GET",false);	
	if(tires_flagTz.my_level!=null&&tires_flagTz.my_level!=""){
		$('.dj_num_sub').html('<img src="images/dj_0'+tires_flagTz.my_level.level+'.png" />');
	}else{
		$('.dj_num_sub').html('<img src="images/dj_00.png" />');	
	}
	if(tires_flagTz.list!=null&&tires_flagTz.list!=""){
		
		var numtttt = parseInt(parseInt(tires_flagTz.count)/pages) ;
		
		var numstemp = parseInt(tires_flagTz.count)%pages==0 ? numtttt : (numtttt+1);
		
		var note_html = '';
		$.each(tires_flagTz.list,function(i,n){
			var create_date = date_month_day(n.create_date);
			
			note_html+= '<li><div class="data_times"><span class="time_month">'+create_date.month+'月</span><span class="time_day">'+create_date.day+'</span></div><div style="padding:0px 30px 30px 30px;  margin-top:-20px;"><div id="note_'+n.id+'">'+n.content+'</div><div class="bottom_biji"><span><a href="javascript:void(0)" class="icon_125_35 web_icon_bottom_2" onclick="dele_note_id('+n.id+',this)">删 除</a></span><span><a href="javascript:void(0)" class="icon_125_35 web_icon_bottom_1" onclick="update_note_id('+n.id+',this)">编 辑</a></span></div><div class="cleard"></div></div></li>';
		});
		$('#note_lists').append (note_html);
		if(num < numstemp){
			$('.next_pageTsq').attr("num",(parseInt(num)+1));
		}else{
			$('#next_div').hide();
		}
		 
	}else{
		$('#note_lists').html ('<li><img src="images/biji_no.png" /></li>');
		
		$('#next_div').hide();	
	}
	$(document).scrollTop(topL0);
	
}

//修改笔记

function update_note_id(note_id,fe){
	if($(fe).text()=='编 辑'){
		 
		var note_html_temp = $('#note_'+note_id).html();
		$('#note_'+note_id).html('<textarea id="note_area_'+note_id+'" style="width:630px; height:220px;"></textarea>');
		editor[note_id] = KindEditor.create('#note_area_'+note_id,{ themeType : 'simple',Width:'630px',height:'220px',resizeType:'0'});
		editor[note_id].html(note_html_temp);
		$(fe).text('保 存');
	}else if($(fe).text()=='保 存'){
		 
		var ti_urlT = '/notes_exercise?r='+$.getRom();
		var ti_jsonT = {'action':'modify_notes','note_id':note_id,'content':editor[note_id].html()};
		var tires_flagT = Ajax_option(ti_urlT,ti_jsonT,"POST",false);	
		if(tires_flagT.flag){
			var editor_html = editor[note_id].html();
			editor[note_id].remove('#note_area'+note_id);
			$('#note_'+note_id).html(editor_html);
			$(fe).text('编 辑');
			
			
		}
	}
	
	
	
}


//删除一个笔记
function dele_note_id(note_id,ef){
	 
	var ti_urlT = '/notes_exercise?r='+$.getRom();
	var ti_jsonT = {'action':'del_note','note_id':note_id};
	var tires_flagT = Ajax_option(ti_urlT,ti_jsonT,"GET",false);
	if(tires_flagT.flag){
		layer.alert('删除笔记成功!',9,'温馨提示');
		$(ef).parents('li').remove();
	}
		
}


//返回 笔记首页

function bcak_biji(){
	var temp_info = {};
	temp_info['subject_id'] = note_info['subject_id'];
	temp_info['section_id'] = note_info['section_id'];
	window.location.href ='stu_note.html?test_info='+Base64.encode(JSON.stringify(temp_info));
}


 