var UserInfo = [];
var section_idT = '';
var test_info = {}; 
$(document).ready(function(){
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	if(UserInfo!=null&&UserInfo!=undefined){ 
		var nick =  UserInfo.nick;
				 
		if (UserInfo.realname != null&&UserInfo.realname!="") {
				$('#headusername').text(UserInfo.realname);
		}else if(nick!=null&&nick!=""){
				$('#headusername').text(nick);
		}
		test_info = $.parseJSON(Base64.decode(getUrlParam('test_info')));
		$('#my_BJ_back').click(function(){
			window.location.href = './step_sdudy.html';	
			
		});
		$('.biji_title').text(num_string_section(test_info['section_id'])+subject_sum(test_info['subject_id'])+'笔记本');
		
		note_lists ();
		 
		 
	 }else{
		window.location.href = "../index.html";
	} 
});


function note_lists (){
	 
	var ti_urlT = '/notes_exercise?r='+$.getRom();
	var ti_jsonT = {'action':'get_user_zhuanti_notes','user_id':UserInfo.id,'subject_id':test_info['subject_id'],'section_id':test_info['section_id']};
	var tires_flagT = Ajax_option(ti_urlT,ti_jsonT,"GET",false);
	var htmlnote = '';
	if(tires_flagT.list!=null){
		$.each(tires_flagT.list,function(i,n){
			htmlnote += '<li class="content_uli"><span class="title_bj">'+n.name+'</span><span class="sumfont_bj">共有 <span class="sums_bj">'+n.notes_count+'</span> 个笔记</span><span class="option_bj"><a  href="javascript:void(0)" onclick="make_notes('+n.id+',\''+n.name+'\');"><img src="images/edit.png" width="30" height="30" title="整理" /></a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<a href="javascript:void(0)" onclick="dele_notes('+n.id+');"><img src="images/delete.png" width="30" height="30" title="清空" /></a></span><div class="cleard"></div></li>';		
		});
		
	}else{
		htmlnote += '<li class="content_uli"><span class="title_bj">无专题</span><span class="sumfont_bj">共有 <span class="sums_bj">0</span> 个笔记</span><span class="option_bj"></span><div class="cleard"></div></li>';
			
	}
	
	$('#zhuanti_list_sums').html(htmlnote);
	
		
}


function make_notes(zid,name){
	var grade_ids = test_info['section_id'] == 3 ? 19 : 18 ;
	var note_do = {};
	note_do['grade_id'] = grade_ids;
	note_do['zhuanti_id'] = zid;
	note_do['user_id'] = UserInfo.id;
	note_do['subject_id'] = test_info['subject_id'];
	note_do['section_id'] = test_info['section_id'];
	note_do['name'] = name;
//跳转页面
   window.location.href = 'note_do.html?test_info='+Base64.encode(JSON.stringify(note_do));
}

function dele_notes(zid){
	var grade_ids = test_info['section_id'] == 3 ? 19 : 18 ;
	var ti_urlTD = '/notes_exercise?r='+$.getRom();
	var ti_jsonTD = {'action':'del_zhuanti_notes','exam_id':zid,'user_id':UserInfo.id,'subject_id':test_info['subject_id'],'grade_id':grade_ids};
	var tires_flagTD = Ajax_option(ti_urlTD,ti_jsonTD,"GET",false);
	if(tires_flagTD.flag){
		note_lists ();
		layer.alert('删除笔记成功!',9,'温馨提示');
		
	}
}



 