var subjectsSelectdBegin = [{'dbtype':1,'ids':[]},{'dbtype':2,'ids':[]}]; //选择后的ID值

var errorSubjectID = 0;
var selectNanDu = 0;
var Topic_type = 2;
//这个页面含有上个页面传的参数过来，都在cookie里面 上个页面的cookie说明
/*$.cookie('PaperName'); //试卷名称
$.cookie('PaperType');  //试卷类型
$.cookie('SendObject');  //发送对象
$.cookie('classIDS');     //班级对象IDS  格式 1,2,3
$.cookie('studentIDS');    //学生对象IDS 格式 1,2,3
$.cookie('subjectType');    //题库类型
$.cookie('synchronousID'); //同步题库 ID
$.cookie('ProjectID'); //专题复习题库ID
$.cookie('YearID'); //获取年份 ID	
$.cookie('ProvincesID'); //获取省份 ID
$.cookie('GradeID');  //年级*/

var Que_type_ids =[];  //[{'typename':1,'ids':[{'id':'0001','dbtype':1 or 2}]}]
var subjectId = 0;
var Year_ID = 0;
var Provinces_ID = 0;
var chapterID = 0;
var kn = "";
var zhentiexam_id = "";
var Grade_ID= 0;  //年级
var data_test = {};
var temp_test = "";

$().ready(function (){
 	 $("#paperContent").html("");
 	
	 Topic_type = 2;
	 selectNanDu = 0;
	 temp_test = getUrlParam("data_test");
	 data_test = $.parseJSON(Base64.decode(temp_test));
	 var temp_subj = getUrlParam("paper_ids");
	 if(temp_subj!=""&&temp_subj!=null){
		 subjectsSelectdBegin = $.parseJSON(temp_subj);
		 Que_type_ids = $.parseJSON(Base64.decode(getUrlParam("Que_type_ids")));
	 }else{
		 subjectsSelectdBegin=[{'dbtype':1,'ids':[]},{'dbtype':2,'ids':[]}];
		 Que_type_ids=[];
	 }
	 if(Que_type_ids!=[]){
		$.each(Que_type_ids,function(i_T,n_T){
			$('#Que_type_sum').append('<center id="obj_'+n_T.typename+'"><div style="height: 25px;"><p><label class="qtype">'+n_T.typename+'</label>（<span id="subjectCount_'+n_T.typename+'" style="font-size: 14px; color: Red;">0</span><label>）道</label><a href="#" style=" padding-left:20px;" onclick="deltQsum(\''+n_T.typename+'\')">删</a></p></div></center>');
			$("#subjectCount_"+n_T.typename).html(parseInt($("#subjectCount_"+n_T.typename).html())+n_T.ids.length); //#subjectCount共有多少题的哪个数字	
			 
		});
	 }
  
	 InputTopic(); 
	 
   	  var _move = false; //移动标记
	  var _x, _y; //鼠标离控件左上角的相对位置
	  $("#divFloatPoint").click(function () {//试题蓝
	  }).mousedown(function (e) {
		  _move = true;
		  _x = e.pageX - parseInt($("#divFloatPoint").css("left"));
		  _y = e.pageY - parseInt($("#divFloatPoint").css("top"));
		  $("#divFloatPoint").fadeTo(20, 0.25); //点击后开始拖动并透明显示
	  });
	
	  $(document).mousemove(function (e) {
		  if (_move) {
			  var x = e.pageX - _x; //移动时根据鼠标位置计算控件左上角的绝对位置
			  var y = e.pageY - _y;
			  $("#divFloatPoint").css({ top: y, left: x }); //控件新位置
		  }
	  }).mouseup(function () {
		  _move = false;
		  $("#divFloatPoint").fadeTo("fast", 1); //松开鼠标后停止移动并恢复成不透明
	  });
	
	//绑定右边树结构
	bindTree(data_test);
	getData(1);
    bindDifficulty(); //难易程度函数的调用  
    bindAnswerShowHide();
	
});                        //reday的结束标签


 
//答案显示
function bindAnswerShowHide(){
    $(".showAnswer").toggle(    
		 function (){
			 var valueid = $(this).attr('value');    //取得答案设置的时候的id值
			 $('#divAnswer' + valueid).show();  
		 },
		function (){
			var valueid = $(this).attr('value');
			$('#divAnswer' + valueid).hide();
		}
	);
}

//试题难易程度的背景颜色的js效果
function bindDifficulty(){
    $("#tbContions td").click(function (){
        $(this).addClass("tdRed");
    }, function (){
        $(this).removeClass("tdRed");
    });

    $("#tbContions td").click(function (){//点击事件(调用ajax函数)
        $("#tbContions td").removeClass("tdRed"); //移除样式tdRed
        $(this).addClass("tdRed"); //当前选项的选中颜色。
        selectNanDu = $(this).attr('value');   //保存难度值
        
		if ($('#paperUl').tree('getSelected') != null){
            getData(1);
        }else{
            $.remind('请选择目录！');
        }
    });
}


function InputTopic(){//获取选中的题型
  $("input[name='TopicType']").click(function(){
		  Topic_type = $(this).val();//获取题的类型（主/客观题） 
		  getData(1);	 
  });
} 


function bindTree(data_tests){//绑定树同步
	
	var subject_idT = data_tests.subject_id;  //学科
	var section_id = data_tests.section_id;  //学段
	var grade_idT = data_tests.grade_id;     //年级
	var tiku_typeT = data_tests.tiku_type;  //题库名称
    var tab_idT = data_tests.tab_Sid;       //题库类型
	 
	var type_idsT = [{'id':'请选择','Name':'请选择'},{'id':1,'Name':'华夏题库'},{'id':2,'Name':'自建库'}];
	if(data_tests.curriculumndb==""){
		type_idsT = [{'id':'请选择','Name':'请选择'},{'id':1,'Name':'华夏题库'}];
	} 
	var temp_idsT = [{'id':'请选择','Name':'请选择'},{'id':1,'Name':'同步题库'},{'id':2,'Name':'专题题库'},{'id':3,'Name':'历年真题'}]; 
	if(section_id==1){
		temp_idsT = [{'id':'请选择','Name':'请选择'},{'id':1,'Name':'同步题库'},{'id':2,'Name':'专题题库'}]; 
	}
	$('#tiku_type').combobox({
		data:type_idsT,
		valueField:'id',
		textField:'Name',
		onLoadSuccess:function(){
			$('#tiku_type').combobox('setValue',tiku_typeT);
		},
		onChange:function(newValue,oldValue){
			$('#bo_li').hide();
			$('#pub_li').hide();
			$('#pr_li').hide();
			$('#yeares_li').hide();
			
			if(newValue!='请选择'){
				$('#tiku_bank').combobox({
					data:temp_idsT,
					valueField:'id',
					textField:'Name',
					onLoadSuccess:function(){
						$('#tiku_bank').combobox('setValue',tab_idT);
					},
					onChange:function(newValues,oldValues){
						$('#word_down_d').hide();
						if(newValues!='请选择'){
							 
							$('#paperUl').tree('loadData',[]);
							data_test['tab_Sid']=newValues;
							 
							if(newValues==1){       	                      //同步
								var booktype_idT = data_tests.booktype;       //题库版本
								var publisher_idT = data_tests.publisher;     //题库教材
								$('#bo_li').show();
								$('#pub_li').show();
								$('#pr_li').hide();
								$('#yeares_li').hide();
								$('#booktype').combobox('clear');
								$('#publisher').combobox('clear');
								$('#publisher').combobox('disable');
								 $('#word_down_d').hide();
								subQuestion(subject_idT,grade_idT,newValues,tab_idT,booktype_idT,publisher_idT);
								 
							}else if(newValues==2){
								$('#bo_li').hide();
								$('#pub_li').hide();
								$('#pr_li').hide();  
								$('#yeares_li').hide();      
								$('#word_down_d').hide();                    							//专题
								zhuantiQuestion(subject_idT,section_id);
								 
							}else if(newValues==3){                             //历年真题
								var province_idT = data_tests.province_id;       //省份
								$('#bo_li').hide();
								$('#pub_li').hide();
								$('#pr_li').show();
								$('#yeares_li').show();
								$('#word_down_d').hide();
								examQuestion(subject_idT,section_id,newValues,tab_idT,province_idT);
							}
							
						}
					}
				});
			}
		}
	});
	
}

//加载子题库联动同步题库
function subQuestion(subject_id,grade_id,newValues,tab_idT,booktype_idT,publisher_idT){
	var urls = "/sync"; 
	var Qjsons = {'action':'publisher','subject_id':subject_id,'grade_id':grade_id};
	var rc_id = $('#tiku_type').combobox('getValue');
	if(rc_id!=1){
		Qjsons['curriculumndb']=data_test.curriculumndb;
	}
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
		onLoadSuccess:function(){
			if(newValues==tab_idT){
				$('#booktype').combobox('setValue',booktype_idT);
			}
		},
		onChange:function(newValue,oldValue){
			$('#publisher').combobox('clear');
			$('#publisher').combobox('disable');
			//$('#chapter').combotree('clear');
			//$('#chapter').combotree('disable');
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
					  onLoadSuccess:function(){
						  if(newValue==booktype_idT){
							$('#publisher').combobox('setValue',publisher_idT);
						  }
					  },
					  onChange:function(newValue1,oldValue1){
						 
						  if(newValue!='请选择'){
							   var publisher_temps = [];
							   var publish_json = {'action':'chapter','book_id':newValue1,'subject_id':subject_id};
							   var rc_id = $('#tiku_type').combobox('getValue');
								if(rc_id!=1){
									publish_json['curriculumndb']=data_test.curriculumndb;
								}
							   var publisher_list = Ajax_Question(urls,publish_json);
							   var  pub_temps = []; 
					 
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
							  
							   $('#paperUl').tree({
								  data:pub_temps,
								  onLoadSuccess:function(){
									  if(newValue==booktype_idT){
										$.each(data_test.chapter,function(ii,nn){ 
											$('#paperUl div[node-id='+nn+']').addClass("tree-node-selected");  
										});
									  }else{
										  $('#tbContions td').attr("class","");
										  $('#tbContions td:first').addClass("tdRed");
										  $("input[name='TopicType'][value=2]").attr("checked",true);
										  $("#paperContent").html("");
										  $("#divPage_up").html("");
										  $("#divPage").html("");
										  
									  }
								  },
								  onSelect: function (node){
									  
									  if($(this).tree('isLeaf',node.target)){
										  data_test['chapter']=[node.id];
										  Topic_type = 2;
										  selectNanDu = 0;
										  $('#tbContions td').attr("class","");
										  $('#tbContions td:first').addClass("tdRed");
										  $("input[name='TopicType'][value=2]").attr("checked",true);
										  getData(1);
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
	var rc_id = $('#tiku_type').combobox('getValue');
	if(rc_id!=1){
		SQjsons['curriculumndb']=data_test.curriculumndb;
	}
	var special_list = Ajax_Question(urls,SQjsons);
	var  special_temps = [];
	 
	if(rc_id==1){
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
 			special_temps = temp_leveljson[1];
		}
	 
	} 
	 				 
  	$('#paperUl').tree({
	  data:special_temps,
	  onLoadSuccess:function(){
		$('#tbContions td').attr("class","");
		$('#tbContions td:first').addClass("tdRed");
		$("input[name='TopicType'][value=2]").attr("checked",true);
		$("#paperContent").html("");
		$("#divPage_up").html("");
		$("#divPage").html("");  
		
		$.each(data_test.special,function(ii,nn){ 
			
			$('#paperUl div[node-id='+nn+']').addClass("tree-node-selected");  
			
		});
		
	  },
	  onSelect: function (node){
		  if($(this).tree('isLeaf',node.target)){
			  data_test['special']=[node.id];
			  Topic_type = 2;
			  selectNanDu = 0;
			  
			  $('#tbContions td').attr("class","");
			  $('#tbContions td:first').addClass("tdRed");
			  $("input[name='TopicType'][value=2]").attr("checked",true);
			  getData(1);
		  }
	  }
   });
		
}
 
 

//历年真题
function examQuestion(subject_id,section_id,newValues,tab_idT,province_idT){
	var urls = "/province";
	var SQjsons = {'action':'list','subject_id':subject_id,'section_id':section_id};
	var rc_id = $('#tiku_type').combobox('getValue');
	if(rc_id!=1){
		SQjsons['curriculumndb']=data_test.curriculumndb;
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
		onLoadSuccess:function(){
			
			if(newValues==tab_idT){
				$('#province').combotree('setValues',province_idT);
			}else{
				$('#province').combotree('setValues',['请选择']);
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
					 
					var year_temps = [{'id':'请选择','text':'请选择'}];
							 
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
						onLoadSuccess:function(){
							 
							if(data_test.yeares!=undefined){
								$('#yeares').combotree('setValues',data_test.yeares);
							}else{
								$('#yeares').combotree('setValues',['请选择']);	
							}
								var pr_year_testnamesT = [];
								var pr_y_names_urlT = '/examination_paper';
								var pr_yjsonsT = {'action':'get_exam_examination_info','subject_id':subject_id,'section_id':section_id,'province':newValue,'year':data_test.yeares};
								if(rc_id!=1){
									pr_yjsonsT['curriculumndb']=data_test.curriculumndb;
								}
								var pr_y_names_listT = Ajax_Question(pr_y_names_urlT,pr_yjsonsT);
								if(pr_y_names_listT.list!=""&&pr_y_names_listT.list!=null){
									$.each(pr_y_names_listT.list,function(pni,pnn){
										pr_year_testnamesT.push({'id':pnn.id,'text':pnn.name});
									});
								}else{
									pr_year_testnamesT.push({'id':'请选择','text':'没有数据'});	
								}
								 
								$('#paperUl').tree({
									data:pr_year_testnamesT,
									onLoadSuccess:function(){
									  $('#paperUl .tree-title').each(function(index, element) {
										  $(element).attr("title",$(element).html());
										  $(element).html($(element).html().substring(0,10)+'...');
									  });
									},
									onSelect: function (node){
										if($(this).tree('isLeaf',node.target)){
											Topic_type = 2;
											selectNanDu = 0;
											$('#tbContions td').attr("class","");
											$('#tbContions td:first').addClass("tdRed");
											$("input[name='TopicType'][value=2]").attr("checked",true);
											 
											getData_zhenti(node.id,subject_id);
											$('#word_down_d').show();
											
										}
									}
							   });
							    
						},
						onShowPanel:function(){ 
							var  ssT = $(this).combotree("getValues");
							if(ssT=='请选择'){
								$(this).combotree("setValue","");
							}
						},
						onChange:function(news_va,old_val){
							  
								var pr_year_testnamesT = [];
								var pr_y_names_urlT = '/examination_paper';
								var pr_yjsonsT = {'action':'get_exam_examination_info','subject_id':subject_id,'section_id':section_id,'province':newValue,'year':news_va};
								if(rc_id!=1){
									pr_yjsonsT['curriculumndb']=data_test.curriculumndb;
								}
								var pr_y_names_listT = Ajax_Question(pr_y_names_urlT,pr_yjsonsT);
								if(pr_y_names_listT.list!=""&&pr_y_names_listT.list!=null){
									$.each(pr_y_names_listT.list,function(pni,pnn){
										pr_year_testnamesT.push({'id':pnn.id,'text':pnn.name});
									});
								}else{
									pr_year_testnamesT.push({'id':'请选择','text':'没有数据'});	
								}
								
								$('#paperUl').tree({
									data:pr_year_testnamesT,
									onLoadSuccess:function(){
									  $('#paperUl .tree-title').each(function(index, element) {
										  $(element).attr("title",$(element).html());
										  $(element).html($(element).html().substring(0,10)+'...');
									  });
									},
									onSelect: function (node){
										if($(this).tree('isLeaf',node.target)){
											Topic_type = 2;
											selectNanDu = 0;
											$('#tbContions td').attr("class","");
											$('#tbContions td:first').addClass("tdRed");
											$("input[name='TopicType'][value=2]").attr("checked",true);
											
											getData_zhenti(node.id,subject_id);
										}
									}
							   });
							   
						}
					});
					
				 
		}
	});
	
	$('#yeares_li input[type="text"]').live('blur',function(){  
		  var pr_year_testnames = [];
		  var pr_y_names_url = '/examination_paper';
		  var pr_yjsons = {'action':'get_exam_examination_info','subject_id':subject_id,'section_id':section_id,'province':$('#province').combotree("getValues"),'year':$('#yeares').combotree("getValues")};
		  if(rc_id!=1){
			  pr_yjsons['curriculumndb']=data_test.curriculumndb;
		  }
		  var pr_y_names_list = Ajax_Question(pr_y_names_url,pr_yjsons);
		  if(pr_y_names_list.list!=""&&pr_y_names_list.list!=null){
			  $.each(pr_y_names_list.list,function(pni,pnn){
				  pr_year_testnames.push({'id':pnn.id,'text':pnn.name});
			  });
		  }else{
			  pr_year_testnames.push({'id':'请选择','text':'没有数据'});	
		  }
		  $('#paperUl').tree({
			  data:pr_year_testnames,
			  onLoadSuccess:function(){
				$('#paperUl .tree-title').each(function(index, element) {
                    $(element).attr("title",$(element).html());
					$(element).html($(element).html().substring(0,10)+'...');
                });
			  },
			  onSelect: function (node){
				  if($(this).tree('isLeaf',node.target)){
					  Topic_type = 2;
					  selectNanDu = 0;
					  $('#tbContions td').attr("class","");
					  $('#tbContions td:first').addClass("tdRed");
					  $("input[name='TopicType'][value=2]").attr("checked",true);
					  getData_zhenti(node.id,subject_id);
				  }
			  }
		 });
	});
}


function getData_zhenti(zt_test_id,subject_id){
	var rc_id = $('#tiku_type').combobox('getValue');
	if(rc_id!=1){
		SQjsons['curriculumndb']=data_test.curriculumndb;
	}
	 
	var zt_test_url = '/examination_paper';
	var zt_test_yjsons = {'action':'get_exam_examination_paper','exam_id':zt_test_id,'subject_id':subject_id};
	if(rc_id!=1){
		zt_test_yjsons['curriculumndb']=data_test.curriculumndb;
	}
	var zt_test_list = Ajax_Question(zt_test_url,zt_test_yjsons);
	
	$('#divPage').html("");
	$('#divPage_up').html("");
	bindSubjects(zt_test_list.list);
	getPageNums(zt_test_list.list.length,1,zt_test_list.list.length,1);//分页操作
	
}
 

function getData(pageNumber){
 
  //$.messager.progress("open");
	$.messager.progress({
	            
	            msg: '正在加载...'
	        });
	var pageSize = 20;
	var para ={'pageno':pageNumber,'countperpage':pageSize,'subject_id':data_test.subject_id}; 
	var rc_id = $('#tiku_type').combobox('getValue');
	if(rc_id!=1){
		para['curriculumndb']=data_test.curriculumndb;
	}
    if (data_test.tab_Sid == 1) { //同步
    	para['action'] = 'sync';
		para['chapter_id'] = data_test.chapter;
		para['grade_id'] = data_test.grade_id
    }else if(data_test.tab_Sid == 2) { //专题
   		para['action'] = 'zhuanti'; 
		para['special_id'] = data_test.special;
		para['section_id'] = data_test.section_id;
    }else if(data_test.tab_Sid == 3){  //真题
        para['action'] = 'zhenti';
		para['province_id'] = data_test.province_id;
		para['section_id'] = data_test.section_id;
		para['yeares'] = data_test.yeares;
	 
    }
	if(Topic_type!=2){  //主客观题
		para['objective_flag'] = Topic_type;
	}
	if(selectNanDu!=0){  //难易度
		para['difficulty'] = selectNanDu;
	}
	
    $.ajax({
        url: Webversion + '/examination_paper' , //url访问地址
        type: "GET",
        data: para,
        dataType: "json",
		//async: false,
        success: function (data)
        {
			if(data.list!=null||data.list!=undefined)
			{
				//alert(JSON.stringify(data));
				bindSubjects(data.list); //列表业务处理
				var pages_num = 10;  //显示多少页
				
				getPageNums(data.count,pageNumber,pageSize,pages_num);//分页操作
				
				$.messager.progress("close");
				
			}else{
				$('#divPage').html("");
				$('#divPage_up').html("");
				$('#paperContent').html("没有数据");
				$.messager.progress("close");	
				 
			}
			
        },
		error:function (data)
        {
            $.messager.progress("close");
        }
    });

}




function bindSubjects(result){//绑定所有的题。
 /*    result = [
    { "id": "班级01", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级02", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级03", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级04", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级05", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级06", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级07", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级08", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级09", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" },
    { "id": "班级10", "realname": "三", "founder": "80", "date": "2011", "studentnum": "c", "teachernum": "d", "state": "开启", "operation": "f", "remark": "1" }
    ];  */
    $("#paperContent").html("");
	var dbtype = parseInt($('#tiku_type').combobox('getValue'));
    $.each(result, function (index, value){
        var dd = "";
        switch (parseInt(value.difficulty))
        {
            case 1:
                dd = "简单 ★☆☆☆☆";
                break;
            case 2:
                dd = "较易 ★★☆☆☆";
                break;
            case 3:
                dd = "中等 ★★★☆☆";
                break;
            case 4:
                dd = "较难 ★★★★☆";
                break;
            case 5:
                dd = "困难 ★★★★★";
                break;
            default:
                break;

        }
		var k= 0;
		var join_lose = "入选";
		 
        if (subjectsSelectdBegin[dbtype-1].ids.length>0){
			 $.each(subjectsSelectdBegin[dbtype-1].ids,function(i_4,n_4){
				 if(value.gid==n_4&&n_4!=""){
					k++;
				 }
			 });
        }
         
		if(k>0){
			join_lose = '剔除';
		}
		//alert(value.content);
        //alert(value.objective_answer);
        var html = $('<li>'
                 + '<div class="subject">'
                 + '<table id="tbSubject" style="background-color: #FFFF99; float: left; width: 100%">'
                 + '<tbody><tr>'
                 + '<th>'
                 + ' 题目ID'
                 + '</th>'
                 + '<td>'
                 + value.gid
                 + '</td>'
                 + '<th>'
                 + '   题型'
                 + '</th>'
                 + '<td>'
                 + value.type_name
                 + '</td>'
                 + '<th>'
                 + '    难度'
                 + '</th>'
                 + '<td>'
                 + '   ' + dd
                 + '</td>'
                 + '<td>'
                 + '    更新时间:'
                 + '</td>'
                 + '<td>'
                 + '  ' + value.mod_date
                 + '</td>'
                 + '<td rowspan="2">'
                 + ' <a class="easyui-linkbutton l-btn"   onclick="selectedSubject(this,\'' + value.gid + '\',\''+value.type_name+'\')" ><span class="l-btn-left"><span class="l-btn-text" id="join_losepass_'+value.gid+'">'+join_lose+'</span></span></a>'
                 + '</td>'
                 + '<td rowspan="2">'
                 + '  <a id="" class="easyui-linkbutton l-btn" onclick="Error(\'' + value.gid + '\');"><span class="l-btn-left"><span class="l-btn-text">报错</span></span></a>'
                 + '</td>'
                 + '<td rowspan="2">'
                 + '   <a id="" class="easyui-linkbutton l-btn showAnswer" value=' + value.gid + ' ><span class="l-btn-left"><span class="l-btn-text">答案</span></span></a>'				//给答案的按钮设置了一个id值用于在点击的时候取的
                 + '</td>'
                 + '</tr>'
                 + '</tbody></table>'
                 + '</div>'
                 + '<div class="Panswer">'
                 + ' <div style="background-color: #DDDDDD; line-height:25px; padding:10px;">'
                 + value.content//添加试题内容
                 + '</div>'
                 + '</div>'
                 + '<div class="answer"  style="display:none; line-height:25px; padding:10px;" id="divAnswer' + value.gid + '">' + value.answer + '</div>'//给答案div设置id 格式是     divAnswer+ 对应id
                 + '</li>');
        $("#paperContent").append(html);
    });
    bindAnswerShowHide(); //调用绑定点击显示或隐藏事件
}

//列表分页
function getPageNums(count,pageNumber,pageSize,pages_num){
	var totalNum = parseInt(count);   //总条数
	var pagesNum = (totalNum%pageSize)==0?(Math.floor(totalNum/pageSize)):(Math.floor(totalNum/pageSize)+1);  //余数等0 总页数不加1 ，反之 加 1
	var m = (pageNumber%pages_num)==0?(pageNumber/pages_num):(Math.floor(pageNumber/pages_num)+1);//取当前箭头点击次数+1
	var n = pageNumber<=pages_num?1:((m-1)*pages_num+1);  //获得当前分页第一个页码数  比如  1，6，11
	var pagehtml = '<ul class="pagesnum">';
			    
	if(n<=1){  //判断  页码是1到5的情况下  上一步箭头事件取消  否则加上一步onclick事件
		pagehtml += '<li style="background:none"></li>';
    }else{
	   pagehtml += '<li> <a onclick="getData('+(n-pages_num)+')"> << </a> </li>';
    }
   
   	for(i=n;i<n+pages_num;i++){//页面追加页码
	   if(i<=pagesNum){
		   if(i==pageNumber){
			  pagehtml+='<li class="on">'+i+' </li>';
		   }else{
			  pagehtml+='<li> <a onclick="getData('+i+');">'+i+'</a> </li>'; 
		   }
	   }else{
		   
	   }
   	}
  
  	if((n+pages_num)>pagesNum){//判断  页码是最后一页的页码 比如：(...总页数-4 ,总页数-3 ,总页数-2 ,总页数-1 ,总页数) 下一步箭头事件取消  否则下一步加上onclick事件
	   pagehtml+='<li style="background:none"></li>';
   	}else{
	   pagehtml+='<li> <a  onclick="getData('+(n+pages_num)+')"> >> </a> </li>';
	   }
  	pagehtml+='<li style="width:154px;"><font color="blue">总页数：'+pagesNum+' 页</font></li><li style="width:154px;"><font color="blue">总条数：'+totalNum+' 条</font></li></ul>';
	$('#divPage').html(pagehtml);
	$('#divPage_up').html(pagehtml);
}
 

function Error(errorID)
{//报错的点击形式
    $("#divError").dialog('open');
    errorSubjectID = errorID;
}

function ErrorOK(){
    //ajax 请求后台插入报错原因
	    var jsons = {'action':'feedback','ti_id':errorSubjectID,'content':$('#ErrorReason').val(),'dbtype':parseInt($('#tiku_type').combobox('getValue'))};
		var rc_id = $('#tiku_type').combobox('getValue');
		if(rc_id!=1){
			jsons['db_name']=data_test.curriculumndb.name;
		}
		 
       $.ajax({
           url: Webversion + '/examination_paper' , //url访问地址
           type: "POST",
           data: jsons,
           dataType: "json",
           success: function (result) {
				$.messager.alert('温馨提示','题目报错,提交成功！','info');

               // if (result == null || result.class == null) {
                   // result = {};
                   // result.class = [];
               // }
               //bindSubjects(result);
           }
       });
    $("#divError").dialog('close');
}

function ErrorCancel(){
    $("#divError").dialog('close');
}

 //向选题框里写入值
function selectedSubject(obj,subjectID,Qtype){
    var flage = $(obj).find('.l-btn-text').html();
	var dbtype = parseInt($('#tiku_type').combobox('getValue'));
    if (flage=="入选"){
		 var j= 0;
		 var q_num = 0;
        if (subjectsSelectdBegin[(dbtype-1)].ids.length > 0){ 
			$.each(subjectsSelectdBegin[(dbtype-1)].ids,function(i_3,n_3){
				if(subjectID==n_3&&n_3!=""){
					j++;
					$.messager.alert('温馨提示','这道题已经选择!','info');	
				}
			});
        }
        
		if(j==0){
			subjectsSelectdBegin[(dbtype-1)].ids.push(subjectID);
			$('#Que_type_sum label').each(function(index, element) {
				if($(this).attr("class")=='qtype'&&$(this).html()==Qtype){
					q_num++;
					$("#subjectCount_"+Qtype).html(parseInt($("#subjectCount_"+Qtype).html())+1); //#subjectCount共有多少题的哪个数字
					$.each(Que_type_ids,function(ii,nn){
						if(Qtype==nn.typename){
							Que_type_ids[ii].ids.push({'id':subjectID,'dbtype':dbtype});
						}
					});
				}
			});
		}
		
		if(q_num==0){
			$('#Que_type_sum').append('<center id="obj_'+Qtype+'"><div style="height: 25px;"><p><label class="qtype">'+Qtype+'</label>（<span id="subjectCount_'+Qtype+'" style="font-size: 14px; color: Red;">0</span><label>）道</label><a href="#" style=" padding-left:20px;" onclick="deltQsum(\''+Qtype+'\')">删</a></p></div></center>');
			$("#subjectCount_"+Qtype).html(parseInt($("#subjectCount_"+Qtype).html())+1); //#subjectCount共有多少题的哪个数字
			Que_type_ids.push({'typename':Qtype,'ids':[{'id':subjectID,'dbtype':dbtype}]});
		}
		
		$(obj).find('.l-btn-text').html('剔除');
		
    }else if ((flage == "剔除")) {	//剔除
    	
            var newAyyay = [];//新数组
			
            $.each(subjectsSelectdBegin[(dbtype-1)].ids, function (index, value){ //循环数组剔除当前的题目id，放入新数组 newAyyay
                if (value == subjectID){
                    subjectsSelectdBegin[(dbtype-1)].ids.splice(index,1);
                }
            });
       
			if($("#subjectCount_"+Qtype).html()==1){
				$('#obj_'+Qtype).remove();
			}else{
				$("#subjectCount_"+Qtype).html(parseInt($("#subjectCount_"+Qtype).html())-1);
			}
		   
			$.each(Que_type_ids,function(i_1,n_1){
				if(n_1!=""&&n_1!=undefined){
					if(Qtype==n_1.typename){
						$.each(n_1.ids,function(i_2,n_2){
							if(n_2==subjectID){
								n_1.ids.splice(i_2,1);
							}
						});
						 
						if((n_1.ids).length<=0){
							Que_type_ids.splice(i_1,1);
						}
					}
				}
			});
		$(obj).find('.l-btn-text').html('入选');
    }
}


//清空选择的题目数 e题目类型 ：选择题,填空题
function deltQsum(e){
	var dbtype = parseInt($('#tiku_type').combobox('getValue'));
	var ids_temp = [];
	 
	 
	$.each(Que_type_ids,function(i,n){
		 
		if(n.typename==e){
			ids_temp = n.ids;
			Que_type_ids.splice(i,1);
			return false;
		}
	});
	 
	$.each(ids_temp,function(i_1,n_1){
		$.each(subjectsSelectdBegin[(parseInt(n_1.dbtype)-1)].ids,function(i_2,n_2){
			if(n_1.id==n_2){
				subjectsSelectdBegin[(parseInt(n_1.dbtype)-1)].ids.splice(i_2,1);
			}
		});
		$('#join_losepass_'+n_1.id).html('入选');
	});
	$('#obj_'+e).remove();
	
}

//清空试题蓝
function deleaLL(){
	
	$.each(Que_type_ids,function(i,n){
		$.each(n.ids,function(i_2,n_2){
			 $('#join_losepass_'+n_2.id).html('入选');
		});
	});
	Que_type_ids =[];
	subjectsSelectdBegin = [{'dbtype':1,'ids':[]},{'dbtype':2,'ids':[]}];
	$('#Que_type_sum').html("");
}

function Ajump()
{//点击下一步的操作函数
	 
	 if(Que_type_ids!=""&&(subjectsSelectdBegin[0].ids!=""||subjectsSelectdBegin[1].ids!="")){
		document.location.href = "ShouDoPaperSort.html?paper_ids=" + JSON.stringify(subjectsSelectdBegin)+"&data_test="+temp_test+"&Que_type_ids="+Base64.encode(JSON.stringify(Que_type_ids));
	 }else{
		$.messager.alert('温馨提示','请选题目后再进行下一步!','info');	 
	}
}


function PreviousStep(){
	 $.messager.confirm('温馨提示','返回上一步,不保存此页面的内容！<br />确认返回上一步吗？',function(f){
		 if(f){
			document.location.href = "TestName.html?data_test=" + temp_test;
		 }
	 });
	 
}

function setWord(){
	var selecttreeId = $('#paperUl').tree('getSelected');
	  
	$.messager.confirm('温馨提示','<div id="word_typecheck">请选择生成格式：<input type="radio" name="word_type" value="2" checked="checked" />学生版&nbsp;<input type="radio" name="word_type" value="1" />老师版</div>',function(b){
		if(b){
			var datajsondd = {'action':'get_exam_examination_paper','exam_name':selecttreeId.text,'exam_id':selecttreeId.id,'subject_id':data_test.subject_id,'create_exam_examination_word':1};
			var checked_wordtype = $('#word_typecheck input[type="radio"]:checked').val();
			if(checked_wordtype==1){
				datajsondd['with_answer'] = checked_wordtype;
			}
			$.ajax({
				url: Webversion + '/examination_paper', //url访问地址
				type: "GET",
				data: datajsondd,
				dataType: "json",
				success: function (result){
					 $.messager.alert('温馨提示','<div style="padding-top:10px;">试卷已经生成,请点击下载：<a href="'+result.url+'">WORD下载</a></div>','info');
				}
			});
		}
	});
	
	//document.location.href = "GroupRollCenter.html";
}