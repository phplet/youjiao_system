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
  var Que_type_ids=[];
 var subjectsSelectdBegin = [{'dbtype':1,'ids':[]},{'dbtype':2,'ids':[]}]; //选择后的ID值
   
$().ready(function (){
	 
	 subjectsSelectdBegin = [{'dbtype':1,'ids':[]},{'dbtype':2,'ids':[]}]; //选择后的ID值
	 Que_type_ids=[];  
    UserInfo = $.evalJSON($.cookie("UserInfo"));
	centerAll = $.evalJSON($.cookie("centerAll"));
	//subject_id = parseInt(UserInfo.subject_id);
	
	
     
	 
	
	
	//grade_linkage(subject_id);//加载学段	
	$('#select_subject_id').combobox({
		onChange:function(newValues,oldValues){
			$('#select_grade_id').combobox('setValue','请选择'); 
			$('#select_booktype').combobox('clear');
			$('#select_booktype').combobox('disable'); 
			$('#select_publisher').combobox('clear');
			$('#select_publisher').combobox('disable'); 
			$('#chapter').combotree('clear');
			$('#chapter').combotree({data:[{'id':'请选择','text':'请选择'}]});
			subjectsSelectdBegin = [{'dbtype':1,'ids':[]},{'dbtype':2,'ids':[]}]; //选择后的ID值
			$('#Que_type_sum').html('');      
			$('#divPage_up').html(''); 
			$('#paperContent').html(''); 
			$('#divPage').html(''); 
			Que_type_ids=[];
		}
		
	}); 
	$('#select_grade_id').combobox({
		onChange:function(newValues,oldValues){
			subjectsSelectdBegin = [{'dbtype':1,'ids':[]},{'dbtype':2,'ids':[]}]; //选择后的ID值
			$('#Que_type_sum').html('');      
			$('#divPage_up').html(''); 
			$('#paperContent').html(''); 
			$('#divPage').html(''); 
			Que_type_ids=[];
			var subject_id_sel = $('#select_subject_id').combobox("getValue");
			$('#select_booktype').combobox('clear');
			$('#select_booktype').combobox('disable'); 
			$('#select_publisher').combobox('clear');
			$('#select_publisher').combobox('disable'); 
			$('#chapter').combotree('clear');
			$('#chapter').combotree({data:[{'id':'请选择','text':'请选择'}]});
			if(subject_id_sel!='请选择'){
				if(newValues!='请选择'){
					subQuestion(subject_id_sel,newValues); 
				}
			}else{
				alert('学科没有选择');	
			}
			
		}
		
	});
	 
	
	
	
	   
	
});   //.ready的结束符号

 
 


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
	$('#select_booktype').combobox({
		data:b_list,
		valueField:'id',
		textField:'Name',
		onChange:function(newValue,oldValue){
			subjectsSelectdBegin = [{'dbtype':1,'ids':[]},{'dbtype':2,'ids':[]}]; //选择后的ID值
			$('#Que_type_sum').html('');      
			$('#divPage_up').html(''); 
			$('#paperContent').html(''); 
			$('#divPage').html(''); 
			Que_type_ids=[];
			$('#select_publisher').combobox('clear');
			$('#select_publisher').combobox('disable'); 
			$('#chapter').combotree('clear');
			$('#chapter').combotree({data:[{'id':'请选择','text':'请选择'}]});
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
				 
				 $('#select_publisher').combobox({
					  data:boo_temps,
					  valueField:'id',
					  textField:'Name',
					  onChange:function(newValue,oldValue){
						  subjectsSelectdBegin = [{'dbtype':1,'ids':[]},{'dbtype':2,'ids':[]}]; //选择后的ID值
						  $('#Que_type_sum').html('');      
						  $('#divPage_up').html(''); 
						  $('#paperContent').html(''); 
					      $('#divPage').html(''); 
						  Que_type_ids=[];
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
										    pub_temp = {'id':p_n.id,'text':p_n.unit,'state':"open",'children':child_temps,checked:true};
									   }else{
											pub_temp = {'id':p_n.id,'text':p_n.unit,checked:true };   
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


function getData(pageNumber){
 	 
  //$.messager.progress("open");
	$.messager.progress({
	            
	            msg: '正在加载...'
	        });
	var pageSize = 20;
	var para ={'pageno':pageNumber,'countperpage':pageSize,'subject_id':$('#select_subject_id').combobox("getValue")}; 
	 
    para['action'] = 'sync';
	para['chapter_id'] = selectMore("chapter");
	para['grade_id'] = $('#select_grade_id').combobox("getValue");
	
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
	var dbtype = 1;
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
                  
                 + '</tr>'
                 + '</tbody></table>'
                 + '</div>'
                 + '<div class="Panswer">'
                 + ' <div style="background-color: #DDDDDD; line-height:25px; padding:10px;">'
                 + value.content//添加试题内容
                 + '</div>'
                 + '</div>'
                  
                 + '</li>');
        $("#paperContent").append(html);
    });
   // bindAnswerShowHide(); //调用绑定点击显示或隐藏事件
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

 //向选题框里写入值
function selectedSubject(obj,subjectID,Qtype){
    var flage = $(obj).find('.l-btn-text').html();
	var dbtype = 1;
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
	var dbtype = 1;
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



function save_question (){
	var center_idTe = centerAll.center_id;
	var zone_idTe = $('#A_zones',window.parent.document).find("option:selected").val();
	var testnameTe = $('#testname').val();
	var subject_idTe = $('#select_subject_id').combobox('getValue');
	var grade_idTe = $('#select_grade_id').combobox('getValue');
	var booktypeTe = $('#select_booktype').combobox('getValue');
	var publisherTe = $('#select_publisher').combobox('getValue');
	
	var chapterTe = selectMore("chapter");
	
	var idsTe = subjectsSelectdBegin;
	
	
	if(subject_idTe!='请选择'&&grade_idTe!='请选择'&&subject_idTe!=''&&grade_idTe!=''&&booktypeTe!='请选择'&&publisherTe!='请选择'&&booktypeTe!=''&&publisherTe!=''){
		var TestQjson = {"action":"maual","exam_name":testnameTe,"exam_type":"1","build_type":1,"subject_id":subject_idTe,"grade_id":grade_idTe,"condition":{"data_test":{"testname":testnameTe,"testtype":"1","subject_id":subject_idTe,"section_id":"1","grade_id":grade_idTe,"tiku_type":"1","curriculumndb":"","tab_Sid":"1","booktype":booktypeTe,"publisher":publisherTe,"chapter":chapterTe},"queTwo":"","queThree":"","objective_score":0,"subjective_score":0,"score":0},"content":idsTe,"difficulty":"5.00","score":0,"center_id":center_idTe,"zone_id":zone_idTe};
		var url_type = "/examination_paper";
		 
		$.ajax({
			url: Webversion + url_type,
			type: "POST",
			dataType: "json",
			data:TestQjson,
			success: function (result){
				alert('保存成功！');
				$('#select_grade_id').combobox('setValue','请选择'); 
				$('#select_booktype').combobox('clear');
				$('#select_booktype').combobox('disable'); 
				$('#select_publisher').combobox('clear');
				$('#select_publisher').combobox('disable'); 
				$('#chapter').combotree('clear');
				$('#chapter').combotree({data:[{'id':'请选择','text':'请选择'}]});
				subjectsSelectdBegin = [{'dbtype':1,'ids':[]},{'dbtype':2,'ids':[]}]; //选择后的ID值
				$('#Que_type_sum').html('');      
				$('#divPage_up').html(''); 
				$('#paperContent').html(''); 
				$('#divPage').html(''); 
				Que_type_ids=[];  
			},
			error: function (result) {
				
				$.error('加载数据失败！');
			}
		});		
	}else{
		alert('你的选择条件没有选择完全！');	
	}
	
	
}


