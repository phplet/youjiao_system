var iTSM = '';
var UserInfo = [];
var section_idT = '';
var tongbu_list = [];
$(document).ready(function(){
	UserInfo = $.evalJSON($.cookie("UserInfo"));
	if(UserInfo!=null&&UserInfo!=undefined){  
		var nick =  UserInfo.nick;
			 
		if (UserInfo.realname != null&&UserInfo.realname!="") {
				$('#headusername').text(UserInfo.realname);
		}else if(nick!=null&&nick!=""){
				$('#headusername').text(nick);
		}

		$('.book_type_title').click(function(){
			
			window.location = 'edit_login.html?book=4';	
		});
		var exerciseHandler = window.exerciseHandler;
		
		var selectZhuantiID = 0;
		var selectSubjectID = 0;
		
		var pageType = window.location.href.split('?')[0].split('/').pop().split('.')[0].split('_')[1];
		 
		//学段id
		section_idT = grade_ch_section(UserInfo.grade_id);
		
		var section_name = '高中';
		if(section_idT==2){
			section_name = '初中';
		}else if(section_idT==3){
			section_name = '高中';
		}else if(section_idT==1){
			section_name = '小学';
		}
		
		 
		//监听点击左侧导航
		$(document).delegate('.nav_element','click',function(){
			
			selectSubjectID = $(this).attr('subject_id');
			
			$(this).parent().children().each(function(ii, es) {
				$(es).attr('class','nav_element');
			});
			$(this).addClass('active_nav');
			var queryData = {
				subject : $(this).attr('subject_id'),
				'section_id':section_idT,
				'publisher_id':$(this).attr('publisher_id')
			};
			 
			//改变版本的内容
			$('.pro_book').html('<span class="pro_book_font">'+subject_sum(selectSubjectID)+'设定版本是</span><span class="pro_book_type">'+$(this).attr("publisher_name")+'</span>');
			//设置教材书本
			 
			setbooksimg(selectSubjectID,pageType,queryData);
			
			// [{"id":"7","book_name":"必修1","publisher_id":"2","pub_id":"02","subject_id":"01","grade_id":"10","section_id":"03","book_code":"01","flagid":"2|01|01|03|10","visible":"0"},{"id":"8","book_name":"必修2","publisher_id":"2","pub_id":"02","subject_id":"01","grade_id":"10","section_id":"03","book_code":"02","flagid":"2|02|01|03|10","visible":"0"},{"id":"9","book_name":"必修3","publisher_id":"2","pub_id":"02","subject_id":"01","grade_id":"10","section_id":"03","book_code":"03","flagid":"2|03|01|03|10","visible":"0"},{"id":"10","book_name":"必修4","publisher_id":"2","pub_id":"02","subject_id":"01","grade_id":"10","section_id":"03","book_code":"04","flagid":"2|04|01|03|10","visible":"0"},{"id":"11","book_name":"必修5","publisher_id":"2","pub_id":"02","subject_id":"01","grade_id":"10","section_id":"03","book_code":"05","flagid":"2|05|01|03|10","visible":"0"}]

			
			 
		});
		
		//监听点击进入专题按钮
		$(document).delegate('.zhuanti_enter','click',function(){
			$('.exercise_setting').show();
			iTSM = $.layer({
				type : 1,
				title : ['',false],
				offset:['' , ''],
				border : ['','','',false],
				area : ['420px','150px'],
				page : {dom : '.exercise_setting'}
			});
			 
			  
			if(pageType == 'zhenti'){
				window.location.href = 'exercise_'+pageType+'_do.html?'+pageType+'_id='+$(this).attr('exercise_id')+'&subject_id='+selectSubjectID;
			}else{
				
			}
			
			selectZhuantiID = $(this).attr('exercise_id');
			
		});
		
		$('.cancel_exercise').click(function(){
			layer.close(iTSM);
			$('.exercise_setting').hide();
			
		});
		
		$('.begin_exercise').click(function(){
			layer.close(iTSM);
			var question_type = $('.exercise_question_type').val();
			var question_difficulty = $('.exercise_difficulty').val();
			var question_count = 10;
			
			var href = 'exercise_'+pageType+'_do.html?'+pageType+'_id='+selectZhuantiID+'&subject_id='+selectSubjectID+
								'&q_type='+question_type+'&q_difficulty='+question_difficulty+'&q_count='+question_count;
			
			window.location.href = href;
			
			
			
			
		});
		
		//初始化成功后，建立专题列表
		var result_sub = getVerstionsVal();
		if(result_sub.book_setting!=false){
			var subject_Pubvalues = $.parseJSON(result_sub.book_setting);
			
			$.each(subject_Pubvalues,function(ii,nn){
					if(section_idT==1&&(parseInt(nn.subject_id)>3)){
						return false;			
					}
					if(nn.p_name!='请选择版本'){
							$('#nav_element_template').clone().html('<span class="disp_s"><span class="tongbu_span icon_33_33 web_icon_'+nn.subject_id+'_33"></span><span class="tongbu_span">&nbsp;'+section_name+''+subject_sum(nn.subject_id)+'同步</span><span class="cleard"></span></span>')
							.appendTo('.content_left').attr({'id':null,'subject_id':nn.subject_id,'publisher_id':nn.p_id,'publisher_name':nn.p_name}).show();
							$(".content_left div").eq((ii+1)).addClass();
					}
					
			});
			 
			
		 }else{
			var json_bookset = [{"subject_id":1,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP01.png"},{"subject_id":2,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP02.png"},{"subject_id":3,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP03.png"},{"subject_id":4,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP04.png"},{"subject_id":5,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP05.png"},{"subject_id":6,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP06.png"},{"subject_id":7,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP07.png"},{"subject_id":8,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP08.png"},{"subject_id":9,"p_name":"人民教育出版社_新课标","p_id":"2","p_src":"images/booksP09.png"}];
			var set_url = '/exercise_post?r='+$.getRom();
			var setQjson = {'action':'saveBookSetting','data':JSON.stringify(json_bookset)};
			var p_flags = Ajax_option(set_url,setQjson,"POST",false); 
			if(p_flags.flag){
				$.each(json_bookset,function(ii,nn){
					if(nn.p_name!='请选择版本'){
						$('#nav_element_template').clone().html('<span class="disp_s"><span class="tongbu_span icon_33_33 web_icon_'+nn.subject_id+'_33"></span><span class="tongbu_span">&nbsp;'+section_name+''+subject_sum(nn.subject_id)+'同步</span><span class="cleard"></span></span>')
						.appendTo('.content_left').attr({'id':null,'subject_id':nn.subject_id,'publisher_id':nn.p_id,'publisher_name':nn.p_name}).show();
						$(".content_left div").eq((ii+1)).addClass();
					}
				 }); 
			}
		 }
		$(".content_left div").eq(1).trigger("click"); 
		 
	}else{
		window.location.href = "../index.html";
	}
});

//设置教材书本
function setbooksimg(sel_subject_id,pageType,queryData){
	
	var book_url ='/exercise_query?r='+$.getRom();
	var book_Qjson = {'action':'publisher','subject_id':sel_subject_id,'section_id':queryData.section_id,'publisher_id':queryData.publisher_id};
	var book_result = Ajax_option(book_url,book_Qjson,"GET",false);
	if(book_result.publisher!=null){
		var books_lists = book_result.publisher[0].books;
		
		var book_htmls = '';
		if(books_lists!=null){
			$.each(books_lists,function(i,n){
				if(i==0){
					book_htmls += '<li style="background:url(images/books0'+sel_subject_id+'_ok.png) no-repeat center;" id="active_book" title="'+n.book_name+'" ac_book_id="'+n.id+'"><div class="font_padding">'+n.book_name+'</div></li>'
				}else{
					book_htmls += '<li style="background:url(images/books0'+sel_subject_id+'.png) no-repeat center; " title="'+n.book_name+'" ac_book_id="'+n.id+'"><div class="font_padding">'+n.book_name+'</div></li>';	
				}
			});
			$('#booktys_list').html(book_htmls);
		}
	}else{
		$('#booktys_list').html("");	
	}
	

	$('.book_types ul li').click(function(){
		var st_id = $('.active_nav').attr("subject_id");
		$('#active_book').html('<div class="font_padding">'+$('#active_book').text()+'</div>');
	    $('#active_book').css("background","url(images/books0"+st_id+".png) no-repeat center");
		$('#active_book').removeAttr("id");
		 
		$(this).html('<div class="font_padding">'+$(this).text()+'</div>');	
		$(this).attr("id","active_book");
		$('#active_book').css("background","url(images/books0"+st_id+"_ok.png) no-repeat center");
		//点击以后赋值章节列表
		
		setshapterlist(sel_subject_id,pageType,queryData);
	
	});
	
	//赋值章节列表
	setshapterlist(sel_subject_id,pageType,queryData);
		
}

//赋值章节列表
function setshapterlist(sel_subject_id,pageType,queryData){
	var exerciseHandler = window.exerciseHandler;
	 
	var tongbu_url = '/exercise_query?r='+$.getRom();
	var tongbu_QJSON = {'action':'chapter','book_id':$('#active_book').attr("ac_book_id"),'subject_id':sel_subject_id};
	
	tongbu_list = Ajax_option(tongbu_url,tongbu_QJSON,"GET",false);
	var shpter_htmls = '';
	if(tongbu_list!=null&&tongbu_list.list!=null&&tongbu_list.list!=""){
		$.each(tongbu_list.list,function(i,n){
				var str_d = '...';
				var numst = 10; 
				if(sel_subject_id==3){
					numst = 16;
				}else{
					numst = 10; 
				}
				 
				if(cutString(n.unit,numst).cutflag==0){
					str_d ="";
				}else{
					str_d ="...";
				}
				if((i!=0)&&(i % 2 == 0)){
					shpter_htmls += '<li style="clear:left;" class="content_center_ul_li" book_id="'+n.id+'"><div class="pro_list_div"><div class="div_space"></div><div class="pro_unit"><span title="'+n.unit+'">'+cutString(n.unit,numst).cutstring+str_d+'</span></div><div class="minutia_list"><ul>';
				}else{
					shpter_htmls += '<li class="content_center_ul_li" book_id="'+n.id+'"><div class="pro_list_div"><div class="div_space"></div><div class="pro_unit"><span title="'+n.unit+'">'+cutString(n.unit,numst).cutstring+str_d+'</span></div><div class="minutia_list"><ul>';
				}
				if(n.chapter!=null&&n.chapter!=""){
					$.each(n.chapter,function(ii,nn){
						var study_ex_id  = 0;
						if(nn.exercise_history[0]!=undefined&&nn.exercise_history[0]!=0&&nn.exercise_history[0]!=""){
							var study_ex_id = nn.exercise_history[0].study_exercise_id ;
							 if(study_ex_id!=""&&study_ex_id!=undefined){
								 
							 }else{
								study_ex_id = 0;
							}
						}
						var str_ds = '...';
						var numsts = 13; 
						if(sel_subject_id==3){
							numsts = 18;
						}else{
							numsts = 13; 
						}
						 
						if(cutString(nn.chapter,numsts).cutflag==0){
							str_ds ="";
						}else{
							str_ds ="...";
						}
						shpter_htmls +='<li ><a href="javascript:void(0);" title="'+nn.chapter+'" onClick="nextStep('+i+','+ii+','+study_ex_id+');">'+cutString(nn.chapter,numsts).cutstring+str_ds+'</a></li>';
						  
					});
				}else{
					shpter_htmls +='<li>1.无章节</li>';
				}
			
			shpter_htmls +='</ul></div></div></li>';
		});
		
	}else{
		shpter_htmls = '<li class="content_center_ul_li" book_id=""><div class="pro_list_div"><div class="div_space"></div><div class="pro_unit"><span>无单元</span></div><div class="minutia_list"><ul><li>1.无章节</li></ul></div></div></li>';	
	}
	
	
	$('#shapter_list').html(shpter_htmls);
 
	
}

//获取学科的版本信息的文件
function getVerstionsVal(){
	var set_urls = '/exercise_query?r='+$.getRom();
    var setQjsons = {'action':'book_setting'};
    var p_lists = Ajax_option(set_urls,setQjsons,"GET",false);
	return p_lists;
}

//跳转到题目页面
function nextStep(tongbu_number,chapter_number,study_ex_id){
	var number_Tlist = tongbu_list.list[parseInt(tongbu_number)];
	  
	var number_Chapter = number_Tlist.chapter[parseInt(chapter_number)];
	var test_info = {};
	 
	test_info['book_id'] = number_Tlist.book_id;
	test_info['subject_id'] = parseInt(number_Tlist.subject_id);
	test_info['grade_id'] = number_Tlist.grade_id;
	test_info['parent_id'] = number_Tlist.id;
	test_info['parent_name'] = number_Tlist.unit;
	test_info['chapter_id'] = number_Chapter.id;
	test_info['chapter_name'] = number_Chapter.chapter;
	test_info['study_exercise_id'] = study_ex_id;
	test_info['q_count'] = 10;
	
	window.location = './exercise_tongbu_do.html?test_info='+Base64.encode(JSON.stringify(test_info));
}