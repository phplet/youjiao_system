var UserInfo=null;
var centerAll=null;
 var tempGrade=18;
  var GradeID = "";
  var zhenti_year ="";
  var titype=2;
  var GradeBook=10;
  var grade_type = [];
  var subject_id = 0;
  var edu_grade = [];
  var back_test = {};
  var curriculumndb = {};
 
   
$().ready(function (){
	var  tabs_name = $('.tabs-title', window.parent.document);	  //获得iframe父页面的节点内容
	  if((tabs_name.html())!="试卷中心"){
	  	tabs_name.html('试卷中心');   //赋值
		// $('document').KeyInput($("#SchoolText"), '请输入姓名');
	  } 
    UserInfo = $.evalJSON($.cookie("UserInfo"));
	centerAll = $.evalJSON($.cookie("centerAll"));
	subject_id = parseInt(UserInfo.subject_id);
    dbtype();
	//学段
	edu_grade = []; 
	var res_sgrade = Ajax_option('/examination_paper',{'action':'get_edu_grade'},"GET");
	$.each(res_sgrade.list,function(iG,nG){
		edu_grade.push({'id':nG.grade_index,'Name':nG.name,'section_id':nG.section_id});
		
	});
	//edu_grade = [{'id':4,'Name':'小学一年级','section_id':1},{'id':5,'Name':'小学二年级','section_id':1},{'id':6,'Name':'小学三年级','section_id':1},{'id':7,'Name':'小学四年级','section_id':1},{'id':8,'Name':'小学五年级','section_id':1},{'id':9,'Name':'小学六年级','section_id':1},{'id':10,'Name':'初中一年级','section_id':2},{'id':11,'Name':'初中二年级','section_id':2},{'id':12,'Name':'初中三年级','section_id':2},{'id':20,'Name':'高中必修','section_id':3},{'id':21,'Name':'高中选修','section_id':3}];
	//{'id':13,'Name':'高中一年级','section_id':3},{'id':14,'Name':'高中二年级','section_id':3},{'id':16,'Name':'高中三年级','section_id':3},
	 
	if(subject_id!=1&&subject_id!=2&subject_id!=3){
		grade_type = [{'id':2,'Name':'初中'},{'id':3,'Name':'高中'}];
		if(subject_id==4){
			edu_grade.splice(6,1);
		}else if(subject_id==5){edu_grade.splice(6,2);}else if(subject_id==6||subject_id==7){edu_grade.splice(8,1);}
	}else{
		grade_type = [{'id':1,'Name':'小学'},{'id':2,'Name':'初中'},{'id':3,'Name':'高中'}];
	}
	  
	$("#subjectId").val(subject_id);//给学科赋值id
	$("#subjectName").html(subject_sum(parseInt(subject_id)));//给学科赋值name
     
	
	$('select').each(function(ind,e){
		var select_id = $(e).addClass("id");    
		if(select_id=="chapter"||select_id=="special"||select_id=="yeares"){
			$(e).combotree('disable');
		}else{
			$(e).combobox('disable');	
		}
		
	});	
	
	
	
	grade_linkage(subject_id);//加载学段	
	
	
	//back  判断是新打开的页面  还是返回的页面
	var test_temp = getUrlParam("data_test");
	
	if(test_temp!=null&&test_temp!=""&&test_temp!='undefined'){
		back_test = $.parseJSON(Base64.decode(test_temp));
		 
		updateSetValue(back_test);
	} 
	
	
	
	   
	
});   //.ready的结束符号

//查看有没有自建库
function dbtype(){
	var dbtype_1 = Ajax_Question("/examination_paper",{'action':'query_curriculumndb','center_id':centerAll.center_id}); 
	
	if(dbtype_1.rs==false){
		$('#dbtype_2').hide();
		curriculumndb="";
	}else{
		var db_temps = $.parseJSON(dbtype_1.rs);
		  
		if(db_temps.ip==null||db_temps.name==null||db_temps.ip==""||db_temps.name==""||db_temps.ip=='null'||db_temps.name=='null'){
			$('#dbtype_2').hide();
			curriculumndb="";
		}else{
			$('#dbtype_2').show();
			curriculumndb = $.parseJSON(dbtype_1.rs);
		}
		
	}
 
}

//back  从下一步返回到这一步  给这一步赋值
function updateSetValue(data){
	var test_info = {'testname':$('#testname').val(),'testtype':$('input:radio[name=object]:checked').val(),'subject_id':$('#subjectId').val(),'section_id':selectClassgrade,'grade_id':$('#selectgrade').combobox('getValue'),'tiku_type':$('input:radio[name="tiku_type"]:checked').val()};
	 
	var sec_id = 1 ;
	if(data.section_id==2){
		sec_id =2 ;
	}else if(data.section_id==3){
		sec_id =3 ;
	}
	
	$('#testname').val(data.testname);
	$('input:radio[name=object][value='+data.testtype+']').attr("checked",true);
	if(data.share_value){
		$('#share_admission').show();
		$('#share_xn').combobox('setValue',data.share_value);	
		$('#share_xn').combobox('enable');
	}
	$('#selectClassgrade').combobox('setValue',sec_id);
	$('input:radio[name="tiku_type"][value='+data.tiku_type+']').attr("checked",true);
	$('#selectgrade').combobox('setValue',data.grade_id);
	infotab(parseInt(data.tab_Sid)-1);
	if(data.tab_Sid==1){
		if(data.grade_id==20||data.grade_id==21){
			subQuestion(subject_id,19);  //同步题库
		}else{
			subQuestion(subject_id,data.grade_id);  //同步题库
		}
		$('#booktype').combobox('setValue',data.booktype);
		$('#publisher').combobox('setValue',data.publisher);
		setSelectMore('chapter',data.chapter);						
	}else if(data.tab_Sid==2){
		 zhuantiQuestion(subject_id,data.section_id);  //专题题库
		  
		/*if(data.section_id==2||data.section_id==3){
			zhuantiQuestion(subject_id,data.section_id);  //专题题库
		}else{
			zhuantiQuestion(subject_id,data.grade_id);  //专题题库	
		}*/
		$('#special').combotree('setValues',data.special);
		 						
	}else if(data.tab_Sid==3){
		examQuestion(subject_id,data.section_id);  // 历年真题
		//$('#province').combobox('setValue',data.province_id);
		setSelectMore('province',data.province_id);
		setSelectMore('yeares',data.yeares);
	}
	 
}

function selectSet(){
	$('.tab_list_1 select').each(function(ind,e){
		var select_id = $(e).addClass("id");
		if(select_id=="chapter"||select_id=="special"||select_id=="yeares"){
			$(e).combotree('disable');
			$(e).combotree('clear');
		}else{
			$(e).combobox('clear');
			$(e).combobox('disable');	
			 
		}
		
	});		
}
 

//点击题库更新子题库的列表
function infotab(i){
 	 
	//选项卡开始  更新选项卡
	$('.tab_list_1 .title_box >div').each(function(index, element) {
		var tabclass = $(this).attr("class");
		if(index==i&&tabclass=='tab'){
			$(this).attr("class","tab now_focus_1");
		}else if(index!=i){
			$(this).attr("class","tab");
		}
	});
	//同上关联更新选项卡内容
	$('.tab_list_1 .con_box >div').each(function(idx, e) {
		var conclass = $(this).attr("class");
		if(idx==i&&conclass=='clearfix'){
			$(this).attr("class","now_focus_1 clearfix");
		}else if(idx==i&&conclass!='clearfix'){
			$(this).attr("class","now_focus_1");
		}else if(idx!=i){
			$(this).attr("class","");
		}
	});
 
	selectSet();
	//subQuestion(subject_id,$('#selectgrade').combobox('getValue'));  //同步题库
}

//点击题库更新子题库的列表
function inforadio(i){
 	 
	//选项卡开始  更新选项卡
	$('.tab_list_1 .title_box >div').each(function(index, element) {
		var tabclass = $(this).attr("class");
		if(index==i&&tabclass=='tab'){
			$(this).attr("class","tab now_focus_1");
		}else if(index!=i){
			$(this).attr("class","tab");
		}
	});
	//同上关联更新选项卡内容
	$('.tab_list_1 .con_box >div').each(function(idx, e) {
		var conclass = $(this).attr("class");
		if(idx==i&&conclass=='clearfix'){
			$(this).attr("class","now_focus_1 clearfix");
		}else if(idx==i&&conclass!='clearfix'){
			$(this).attr("class","now_focus_1");
		}else if(idx!=i){
			$(this).attr("class","");
		}
	});
 
	selectSet();
	
	var grade_temp_TTf = $('#selectgrade').combobox('getValue');
	 
	 
	subQuestion(subject_id,grade_temp_TTf);  //同步题库
	
}


//年级联动
function grade_linkage(subid){
	$('#selectClassgrade').combobox({
		data:$.merge([{'id':'请选择','Name':'请选择'}],grade_type),
		valueField:'id',
		textField:'Name',
		onChange:function(newValue,oldValue){
			if(newValue!='请选择'){
				//if(newValue!='请选择'&&newValue!=1){
				if(newValue!='请选择'){
					//选项卡开始
					$(".tab").unbind('click');
					$(".tab").bind('click',function() {
						$(this).addClass("now_focus_1");
						$(this).siblings().removeClass("now_focus_1");
						var $dangqian = $(".con_box > div").eq($(".tab").index(this));
						$dangqian.addClass("now_focus_1");
						$dangqian.siblings().removeClass("now_focus_1");
					});
				}else{
					$(".tab").unbind('click');
				}
				var grade_temp = [];
				$.each(edu_grade,function(ii,g){
					var g_temp = {};
					if((parseInt(newValue))==(parseInt(g.section_id))){
						g_temp = {'id':g.id,'Name':g.Name};
						grade_temp.push(g_temp);
					}
					
					
				});
				
				$('#selectgrade').combobox({
					data:$.merge([{'id':'请选择','Name':'请选择'}],grade_temp),
					valueField:'id',
					textField:'Name',
					onChange:function(newValues,oldValues){
						if(newValue!='请选择'){
							infotab(0);
							selectSet();
							subQuestion(subject_id,newValues);  //同步题库
							$('#tab_1').click(function(){
								selectSet(); 
								subQuestion(subject_id,newValues);  //同步题库
							});
							$('#tab_2').click(function(){
								selectSet();
								zhuantiQuestion(subject_id,newValue);  //专题题库
							});
							$('#tab_3').click(function(){
								selectSet();
								examQuestion(subject_id,newValue);   // 历年真题
								
							});
						}
					}
					
				});
			}
		}
	});

}


 


//加载子题库联动同步题库
function subQuestion(subject_id,grade_id){
	var urls = "/sync"; 
	
	var Qjsons = {'action':'publisher','subject_id':subject_id,'grade_id':grade_id};
	var rod_id = $('input:radio[name=tiku_type]:checked').val();
	 
	if(rod_id!=1){
		Qjsons['curriculumndb']=curriculumndb;
	}
	//alert(JSON.stringify(Qjsons));
	 
	var booktype = Ajax_Question(urls,Qjsons);
	var b_list = [{'id':'请选择','Name':'请选择'}];
	if(booktype.publisher!=null){
		$.each(booktype.publisher,function(i,n){
			var b_temp = {'id':n.id,'Name':n.notes};
			b_list.push(b_temp);
		});
	 }
	$('#booktype').combobox({
		data:b_list,
		valueField:'id',
		textField:'Name',
		onChange:function(newValue,oldValue){
			$('#publisher').combobox('clear');
			$('#publisher').combobox('disable');
			$('#chapter').combotree('clear');
			$('#chapter').combotree('disable');
			if(newValue!='请选择'){
				 var boo_temps = [{'id':'请选择','Name':'请选择'}];
				  
				 $.each(booktype.publisher,function(ii,nn){
					 
					 if((parseInt(nn.id))==(parseInt(newValue))){
						if(nn.books!=null){
							 
							$.each(nn.books,function(iii,nnn){
								var boo = {};
								boo = {'id':nnn.id,'Name':nnn.book_name};
								boo_temps.push(boo);
							});
							
							
						}
					 }
				 });
				 
				 $('#publisher').combobox({
					  data:boo_temps,
					  valueField:'id',
					  textField:'Name',
					  onChange:function(newValue,oldValue){
						  
						  if(newValue!='请选择'){
							   var publisher_temps = [{'id':'请选择','Name':'请选择'}];
							   var publish_json = {'action':'chapter','book_id':newValue,'subject_id':subject_id};
							   var rod_id = $('input:radio[name=tiku_type]:checked').val();
								if(rod_id!=1){
									publish_json['curriculumndb']=curriculumndb;
								}
							   var publisher_list = Ajax_Question(urls,publish_json);
							   var  pub_temps = [{'id':'请选择','text':'请选择',"checked":true}]; 
					 
							   if(publisher_list.list!=null){
								  $.each(publisher_list.list,function(p_i,p_n){
									   var pub_temp = {};
									   var child_temps = [];
									   if(p_n.chapter!=null){
										   $.each(p_n.chapter,function(ch_i,ch_n){
											  	var child_temp = {};
												child_temp = {'id':ch_n.id,'text':ch_n.chapter};
												child_temps.push(child_temp);
										   });
										    pub_temp = {'id':p_n.id,'text':p_n.unit,'state':"open",'children':child_temps};
									   }else{
											pub_temp = {'id':p_n.id,'text':p_n.unit};   
									   }
									   pub_temps.push(pub_temp);
									   
								  }); 
							   }
							  
							   //alert(JSON.stringify(pub_temps));
							   $('#chapter').combotree({
										data:pub_temps,
										onShowPanel:function(){ 
											var  ssT = $(this).combotree("getValues");
											if(ssT=='请选择'){
												$(this).combotree("setValue","");
											}
										}
							   });
						  }
					  }
				 });
			}
		}
	});
}

//专题题库
function zhuantiQuestion(subject_id,grade_id){
	var urls = "/sync"; 
	var SQjsons = {'action':'zhuanti','subject_id':subject_id,'section_id':grade_id};
	var rod_id = $('input:radio[name=tiku_type]:checked').val();
	if(rod_id!=1){
		SQjsons['curriculumndb']=curriculumndb;
	}
	
	var special_list = Ajax_Question(urls,SQjsons);
	var  special_temps = [{'id':'请选择','text':'请选择',"checked":true}]; 
	if(rod_id==1){
		if(special_list.list!=null){
			$.each(special_list.list,function(spe_i,spe_n){
				var special_temp = {};
				special_temp = {'id':spe_n.id,'text':spe_n.name}
				special_temps.push(special_temp);
			});
		}
	}else{
		var level_max = 0 ;
		var temp_leveljson = {};
		if(special_list.list!=null){
			level_max = special_list.max_level;
			for(i=1;i<=level_max;i++){
				
				temp_leveljson[i] = [];	
				
			}
			 
			$.each(special_list.list,function(ii,ttt_n){
				if(ttt_n.level==level_max){
					temp_leveljson[ttt_n.level].push({'id':ttt_n.id,'text':ttt_n.name,'parent_id':ttt_n.parent_id});
				}else{
					temp_leveljson[ttt_n.level].push({'id':ttt_n.id,'text':ttt_n.name,'parent_id':ttt_n.parent_id,'children':[]});
				}
				
					 
			});
			 
	 		for(ik=level_max;ik>=2;ik--){
				var childrens = [];
				$.each(temp_leveljson[ik],function(ic,tc_n){
						$.each(temp_leveljson[ik-1],function(ef,nq){
							 if(tc_n.parent_id==nq.id){
								temp_leveljson[ik-1][ef]['children'].push(tc_n);
							 }
						 }); 
				});
			}
 			special_temps = $.merge(special_temps,temp_leveljson[1]);
		}
	 
	}
	//console.log(JSON.stringify(special_temps));
	 $('#special').combotree({
		data:special_temps,
		onShowPanel:function(){ 
			var  ssT = $(this).combotree("getValues");
			if(ssT=='请选择'){
				$(this).combotree("setValue","");
			}
		}	 
	 });
		
}


//历年真题
function examQuestion(subject_id,grade_id){
	var selectClassgrade = $('#selectClassgrade').combobox('getValue');
	if(selectClassgrade!='请选择'){
		var urls = "/province";
		var SQjsons = {'action':'list','subject_id':subject_id,'section_id':selectClassgrade};
		
		var rod_id = $('input:radio[name=tiku_type]:checked').val();
		if(rod_id!=1){
			SQjsons['curriculumndb']=curriculumndb;
		}
		var provice_list = Ajax_Question(urls,SQjsons);
		var provice_temps = [{'id':'请选择','text':'请选择',"checked":true}];
		if(provice_list!=null){
			$.each(provice_list,function(pr_i,pr_n){
				var provice_temp ={};
				if(pr_n.year!=""&&pr_n.year!=null){
					provice_temp = {'id':pr_n.id,'text':pr_n.name};
					provice_temps.push(provice_temp);	
				}
				
			});
		}
		
		$('#province').combotree({
			data:provice_temps,
			onShowPanel:function(){ 
				var  PrsT = $(this).combotree("getValues");
				if(PrsT=='请选择'){
					$(this).combotree("setValue","");
				}
			},
			onChange:function(newValue,oldValue){
				  
					var year_prname = [];
					var pr_namesid = newValue;
					if(newValue!='请选择'&&newValue!=''){
						if(provice_list!=null){
							if(oldValue!=""&&oldValue!='请选择'){
								pr_namesid = $.merge(newValue,oldValue);
								pr_namesid = unique(pr_namesid);
							}
							$.each(pr_namesid,function(i,n){
								$.each(provice_list,function(pr_i,pr_n){
									if(n==pr_n.id){
										year_prname = $.merge(pr_n.year,year_prname);
									}
								
								});
							});
						}
						
					}else{
						pr_namesid = [];
					}
					var year_temps = [{'id':'请选择','text':'请选择',"checked":true}];
							 
					var year_temps_Tyea = [];
					 
					if(year_prname!=""){
						$.each(year_prname,function(ii,nn){
							year_temps_Tyea.push(nn.year);
						});
						year_temps_Tyea = unique(year_temps_Tyea);
						year_temps_Tyea = year_temps_Tyea.sort(function(a,b){return a<b?1:-1});
						$.each(year_temps_Tyea,function(y_i,y_n){
							var year_temp = {};
							year_temp = {'id':y_n.substring(0,((y_n).length-1)),'text':y_n};
							year_temps.push(year_temp);
						});
				 
					}
					$('#yeares').combotree({
						data:year_temps,
						onShowPanel:function(){ 
							var  ssT = $(this).combotree("getValues");
							if(ssT=='请选择'){
								$(this).combotree("setValue","");
							}
						}
					});
				}
			 
		});
	}
	
}



function setSelectMore(css_Id,seids){
	 
	 var targe = $('#'+css_Id).combotree('tree').tree('find','请选择');
	 $('#'+css_Id).combotree('tree').tree('uncheck',targe.target);
	  
	 $.each(seids,function(s_i,s_n){
		var  s_n_temp = $('#'+css_Id).combotree('tree').tree('find',parseInt(s_n)); 
		 
		$('#'+css_Id).combotree('tree').tree('check',s_n_temp.target); 
		
	});
 
}
 
function selectMore(css_Id){
	 
	 var p_Checks = $('#'+css_Id).combotree('tree').tree('getChecked');
	 
	 var chapter_1= [];
	 if(p_Checks!=""){
		 $.each(p_Checks,function(PC_i,PC_n){
			if(PC_n.id!='请选择'){
				var p_or = $('#'+css_Id).combotree('tree').tree('isLeaf',PC_n.target);
				if(p_or){
					chapter_1.push(PC_n.id);
				}
			}
		 });
	 }	
	return chapter_1;
}


//点击下一步
function DivTopicReview(event)
{
	
	 var selectClassgrade = $('#selectClassgrade').combobox('getValue');	 
	 /*if(selectClassgrade==2){
		selectClassgrade=18;
	 }else if(selectClassgrade==3){
		selectClassgrade=19;
	 }*/
	 
	 
	 if($.trim($('#testname').val())==""){  //试卷名称为空
		 $.messager.alert('温馨提示','试卷名称不能为空!','info');
		 return;
	 }else if(selectClassgrade=='请选择'||selectClassgrade==""){
		 $.messager.alert('温馨提示','请选择学段!','info');
		 return;
	}else if($('#selectgrade').combobox('getValue')=='请选择'||$('#selectgrade').combobox('getValue')==""){
		 $.messager.alert('温馨提示','请选择年级!','info');
		 return;
	}
	 
	var test_info = {'testname':$('#testname').val(),'testtype':$('input:radio[name=object]:checked').val(),'subject_id':$('#subjectId').val(),'section_id':selectClassgrade,'grade_id':$('#selectgrade').combobox('getValue'),'tiku_type':$('input:radio[name="tiku_type"]:checked').val(),'curriculumndb':curriculumndb};
	 
	if($('input:radio[name=object]:checked').val()==6){
		test_info['share_value'] = $('#share_xn').combobox('getValue');
	}
	var tab_Sid = $('.title_box .now_focus_1').attr("id");
	test_info['tab_Sid'] = tab_Sid.substring(tab_Sid.length-1,tab_Sid.length);
	var url_type = '/examination_paper?pageno=1&countperpage=10';
	var TestQjson = {};
	if(tab_Sid=='tab_2'){
		var chapter_2 = [];
		chapter_2 = selectMore("special");
		if(chapter_2==""||chapter_2==null){
		 	$.messager.alert('温馨提示','请选择专题!','info');
		 	return;
		}
		test_info['special'] = chapter_2 ;
		TestQjson = {'action':'zhuanti','subject_id':subject_id,'special_id':chapter_2,'section_id':selectClassgrade};
	}else if(tab_Sid=='tab_3'){
		var chapter_3 = [];
		var province_3 = [];
		
		chapter_3 = selectMore("yeares");
		province_3 = selectMore("province");
		if(chapter_3==""||province_3==""){
		 	$.messager.alert('温馨提示','请选择历年真题的省份和年份!','info');
		 	return;
		}
		test_info['yeares'] = chapter_3 ;
		//test_info['province_id'] = $('#province').combobox('getValue') ;
		test_info['province_id'] = province_3;
		TestQjson = {'action':'zhenti','subject_id':subject_id,'section_id':selectClassgrade,'province_id':province_3,'yeares':chapter_3};
	}else{
		var chapter_1 = [];
		chapter_1 = selectMore("chapter");
		if(chapter_1==""||$('#booktype').combobox('getValue')=='请选择'||$('#booktype').combobox('getValue')==""||$('#publisher').combobox('getValue')=='请选择'||$('#publisher').combobox('getValue')==""){
		 	$.messager.alert('温馨提示','请选择版本、教材、章/单元!','info');
		 	return;
		}
		test_info['booktype'] = $('#booktype').combobox('getValue') ;
		test_info['publisher'] = $('#publisher').combobox('getValue') ;
		test_info['chapter'] = chapter_1 ;
		TestQjson = {'action':'sync','subject_id':subject_id,'chapter_id':chapter_1};
	}
	//Ajax_Question(url_type,TestQjson);
	
	
 	//alert(JSON.stringify(test_info));

  	window.location = "SelectSubjects.html?data_test="+Base64.encode(JSON.stringify(test_info));
}


function share_block(){
	$('#share_admission').show();
	$('#share_xn').combobox('enable');
}
function share_none(){
	$('#share_admission').hide();
}

