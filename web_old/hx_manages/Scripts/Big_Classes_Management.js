var UserInfo = {};
var centerAll = {};
var pager="";
var w_days = [];

$().ready(function () {
	 
    UserInfo = $.evalJSON($.cookie("UserInfo"));
    centerAll = $.evalJSON($.cookie("centerAll"));
	classList();
	
	 
        

});

 


function classList(){
	var url_type = '/teacher';
	var Qjson = {'action':'current_teacher_class','class_type':1,'center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val()};
	var result = Ajax_Question(url_type,Qjson);
	var htmls = "";
	if(result.list!=""&&result.list!=null){
		 
		$.each(result.list,function(i_1,n_1){
			var teachers = "";
			var teachers_TS = "";
			var teachers_TT = "";
			var iq=0;
			if(result.teacher!=""&&result.teacher!=null){
				$.each(result.teacher,function(i_2,n_2){
					if(n_1.id==n_2.class_id){
						if(iq<=2){
							teachers_TT += n_2.realname+"&nbsp;";	
						}
						teachers_TS += n_2.realname+"&nbsp;";	
						iq++;
					}
				});
			}
			
			var students = "";
			var j = 0;
			if(result.student!=""&&result.student!=null){
				$.each(result.student,function(i_3,n_3){
					if(n_1.id==n_3.class_id){
						j++;
						students += n_3.realname+"&nbsp;";	
					}
				});
			}
			if(iq>2){
				teachers = '<span title="'+teachers_TS+'">'+teachers_TT+'...</span>';
			}else{
				teachers = '<span title="'+teachers_TS+'">'+teachers_TS+'</span>';
			}
			if(j>0){
				htmls += '<li class="text_float class_width"><div class="calss_info"><div class="class_title">'+n_1.class_name+'</div><div class="text_line">'+centerAll.center_name+'&nbsp;'+$('#A_zones',window.parent.document).find("option:selected").text()+'<br />建班时间：'+n_1.begin_date.substring(0,10)+'<br />结课时间：'+n_1.end_date.substring(0,10)+'<br />班级人数：'+(j)+'/'+n_1.num_max+'人<br />任课教师：'+teachers+'</div></div><div class="class_link" style="text-align:center"><a onclick="teaching_note('+n_1.id+',\''+n_1.class_name+'\');" >教学备注</a>&nbsp;<a onclick="sendObjects('+n_1.id+');">派送测评</a>&nbsp;<a onclick="gradingPaper('+n_1.id+');">作业批改</a>&nbsp;<a onclick="class_tongji('+n_1.id+',\''+n_1.class_name+'\');">测评统计</a><br><a onclick="class_stus('+n_1.id+',\''+n_1.class_name+'\');">进入班级</a></div></li><li class="text_float class_margin">&nbsp;</li>';
			}else{
				htmls += '<li class="text_float class_width"><div class="calss_info"><div class="class_title">'+n_1.class_name+'</div><div class="text_line">'+centerAll.center_name+'&nbsp;'+$('#A_zones',window.parent.document).find("option:selected").text()+'<br />建班时间：'+n_1.begin_date.substring(0,10)+'<br />结课时间：'+n_1.end_date.substring(0,10)+'<br />班级人数：'+(j)+'/'+n_1.num_max+'人<br />任课教师：'+teachers+'</div></div><div class="class_link" style="height:50px;">现在班级中没有学生！</div></li><li class="text_float class_margin">&nbsp;</li>';
			}
		});	
		
		$('#classes_list').html(htmls);
		
	}
	
	
}
//跳转
function class_stus(cid,name){
	
	window.location = "Class_Student.html?cid="+cid+"&classname="+Base64.encode(name);
	
}

//跳转
function class_tongji(cid,name){
	
	window.location = "class_tongji.html?cid="+cid+"&classname="+Base64.encode(name);
	
}


function sendObjects(cid){
	
	window.location = "../SendCenter/SendObjects.html?cid="+cid;
	 
}
function gradingPaper(cid){
	
	window.location = "../Reviews/GradingPaper.html?cid="+cid;
	
}

//班级教学备注
function teaching_note(cid,cname) {
	   
	$('#teaching_Note').css('display','block');
    // 获取校区相关数据
	var teaching_NoteOpen = 'teaching_NoteOpen('+cid+',"'+cname+'");';
    alertSel("#teaching_Note",'查看修改教学备注',538,400,teaching_NoteOpen,'关闭');
    $('#teaching_Note').dialog('open');
 	
}

//教学备注页面加载成功  open
function teaching_NoteOpen(cid,cname){
   
   
   var url_typenote = '/remark'; 
   var Qjsonlist = {'action':'list_remark','center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val(),'teacher_user_id':UserInfo.id,'class_id':cid};
   var noteCZC = centerAll.center_name +'&nbsp;'+$('#A_zones',window.parent.document).find("option:selected").text()+'&nbsp;'+cname;
   $('#note_CZC').html(noteCZC); 
   $('#note_content_id').val('');//清空文本域
   var list_note = Ajax_option(url_typenote,Qjsonlist,"GET");
   changenote(list_note,cid);//教学备注列表更新
   $('#addnote').unbind("click");
   $('#addnote').bind('click',function(){
		var note_content = $('#note_content_id').val(); 
		if($.trim(note_content)!=""&&$.trim(note_content)!=null){
			
			var  Qjsonnote = '';
			var note_id = $('#note_id').val();
			if(note_id!=""){
				Qjsonnote = {'action':'modify_remark','content':note_content,'remark_id':note_id};
			}else{
				Qjsonnote = {'action':'add_remark','center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val(),'teacher_user_id':UserInfo.id,'class_id':cid,'content':note_content};
			}
			var res_note = Ajax_option(url_typenote,Qjsonnote,"POST");
			if(res_note.flag){
				$('#note_id').val("");
				$('#note_content_id').val('');
				$.messager.alert('温馨提示','备注添加成功!','info');
				list_note = Ajax_option(url_typenote,Qjsonlist,"GET");	
				changenote(list_note,cid);//教学备注列表更新
			}else{
				$.messager.alert('温馨提示','备注添加失败!','info');	
			}
		}else{
			$.messager.alert('温馨提示','备注内容不能为空!','info');	
		}  
   });
   
}


//教学备注列表更新
function changenote(rlist,cid){
	var listhtmls = '';
	if(rlist.list!=null&&rlist.list!=""){
		$.each(rlist.list,function(i,n){
			listhtmls += '<ul ><li class="table_text_001 table_text">'+n.create_date+'</li><li class="table_text_002 table_text">'+n.realname+'</li><li class="table_text_003 table_text"><a title="'+n.content+'">'+n.content+'</a></li><li class="table_text_004 table_text_title" >';
			if(n.teacher_id==UserInfo.id){
				listhtmls += '<a href="#"  onclick="selrows(this,'+n.id+')">修改</a>&nbsp;<a href="#" onclick="deletenote('+n.id+','+cid+');">删除</a>';	
			}else{
				listhtmls += '<font color="#ccc">修改&nbsp;删除</font>';
			}
			
			listhtmls += '</li></ul><div class="cleared"></div>';	
			
		});
		
	}else{
		listhtmls = '没有数据!';
	}
	$('#note_lists').html(listhtmls);
	
}


//获取一行内容

function selrows(obj,Nid){
	$('#note_id').val(Nid);
	var obj_li = $(obj).parents('ul').children('li');
	var li_contet = obj_li.eq(2).text();
	$('#note_content_id').val(li_contet);
	 
	
}

function deletenote(id,cid){
	$.messager.confirm('温馨提示', '确定要删除吗？', function (r) {
		if(r){
			var url_typenote = '/remark';
			var Qjsonnote = {'action':'remove_remark','remark_id':id};
			var res_note = Ajax_option(url_typenote,Qjsonnote,"GET");
			var Qjsonlist = {'action':'list_remark','center_id':centerAll.center_id,'zone_id':$('#A_zones',window.parent.document).find("option:selected").val(),'teacher_user_id':UserInfo.id,'class_id':cid};
			var list_note = Ajax_option(url_typenote,Qjsonlist,"GET");	
			changenote(list_note,cid);//教学备注列表更新
			}
	});
}





