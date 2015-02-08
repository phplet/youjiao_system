// JavaScript Document
//此文件夹下是公用的方法

var Webversion = "/restAPI3.0";

//url中数据的提取
function getUrlParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r!=null) return unescape(r[2]); return null;
		
}



 
//学生班级列表
function zonesclass(userid){
	 
	$.ajax({
		url: Webversion + '/student?r='+$.getRom(),
		type: "GET",
		async:false,
		dataType: "json",
		data:{'action':'get_stu_center_zone','user_id':userid},
		beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
		success: function (result) {
			if(result.list!=null){
				var htmlsName = "";
				var big_new_class = "";
				var big_old_class = "";
				var small_class = "";
				$.each(result.list,function(ii,nn){
					 
					if(nn.class_type==1){  //大班
						var times_s = date_Diff_day(getNowDate(),nn.end_date.substring(0,10));  //times_s = 0 是过往班级   ==1是当前班级
						if(times_s==1){
							
							if(ii==0){
								big_new_class += '<a href="javascript:void(0);" id="aa">'+nn.center_name+'->'+nn.zone_name+'->'+nn.class_name+'(大班)</a><p><a href="javascript:void(0)" class="current" value="'+nn.center_id+'_'+nn.zone_id+'_'+nn.class_id+'">'+nn.center_name+'->'+nn.zone_name+'->'+nn.class_name+'(大班)</a>'; 
								
							}else{
								big_new_class += '<a href="javascript:void(0)" value="'+nn.center_id+'_'+nn.zone_id+'_'+nn.class_id+'">'+nn.center_name+'->'+nn.zone_name+'->'+nn.class_name+'(大班)</a>';
							}
						}else{
							if(ii==0){
								big_new_class += '<a href="javascript:void(0);" id="aa">'+nn.center_name+'->'+nn.zone_name+'->'+nn.class_name+'(大班)</a><p><a href="javascript:void(0)" class="current" value="'+nn.center_id+'_'+nn.zone_id+'_'+nn.class_id+'">'+nn.center_name+'->'+nn.zone_name+'->'+nn.class_name+'(大班)</a>'; 
							}else{
								big_new_class += '<a href="javascript:void(0)" value="'+nn.center_id+'_'+nn.zone_id+'_'+nn.class_id+'">'+nn.center_name+'->'+nn.zone_name+'->'+nn.class_name+'(大班)</a>';
							}
						}
						
					}else{  //小班
					 
						if(ii==0){
							big_new_class += '<a href="javascript:void(0);" id="aa">'+nn.center_name+'->'+nn.zone_name+'->'+nn.class_name+'</a><p><a href="javascript:void(0)" class="current" value="'+nn.center_id+'_'+nn.zone_id+'_'+nn.class_id+'">'+nn.center_name+'->'+nn.zone_name+'->'+nn.class_name+'(小班)</a>';
						}else{
							big_new_class += '<a href="javascript:void(0)" value="'+nn.center_id+'_'+nn.zone_id+'_'+nn.class_id+'">'+nn.center_name+'->'+nn.zone_name+'->'+nn.class_name+'(小班)</a>';
						}
					}
						
				});
				 
				htmlsName += big_new_class ;
				 
			}else{
				htmlsName = '<a href="javascript:void(0);" id="aa">没有班级</a><p><a href="javascript:void(0)" class="current" value="">没有班级</a>'
			}
			htmlsName += '</p><input type="hidden" name="category" id="category" value="no" />';
			$('.selectBox').html(htmlsName);
		},
		error: function (result){
			if(result.status=='401'){
				layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
					clearcookie();
			});
			}else{
				layer.alert('加载数据失败！', 8,'温馨提示');	
			}
		}
	});	
	 

}


//清除缓存
function clearcookie_s(){
	 var cookieOptions = {path: "/", expires: -1 };
	 $.cookie("AuthToken", null, cookieOptions);
	 $.cookie("UserInfo", null, cookieOptions);
	 var url_str = document.location.href;
	 if(url_str.split('student').length!=1){
		window.location.href = "../index.html";	 
	 }else{
		changeCode(); 
	 }
	
	// window.location.href = "../index.html";
}



//清除缓存
function clearcookie(){
	 var cookieOptions = {path: "/", expires: -1 };
	 $.cookie("AuthToken", null, cookieOptions);
	 $.cookie("UserInfo", null, cookieOptions);
	 window.location.href = "../index.html";
}


function outlogin(){
	var ii = layer.confirm("是否确认退出",
				function(){
					 var cookieOptions = {path: "/", expires: -1 };
					 $.cookie("AuthToken", null, cookieOptions);
					 $.cookie("UserInfo", null, cookieOptions);
					  window.location.href = "../index.html";
				},'温馨提示',
				function(){
					layer.close(ii);
				});
}

function outlogin_index(){
	var iii = layer.confirm("是否确认退出",
				function(){
					 var cookieOptions = {path: "/", expires: -1 };
					 $.cookie("AuthToken", null, cookieOptions);
					 $.cookie("UserInfo", null, cookieOptions);
					  window.location.href = "../index.html";
				},'温馨提示',
				function(){
					layer.close(iii);
				});
	 
}


//当前时间
function getNowDate(){
	var date = new Date();
	var dateStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate());
	 
	return dateStr;
}

//当前时间
function getNowDateSec(){
	var date = new Date();
	var dateStrs = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate())+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
	 
	return dateStrs;
}


//两个时间段比较 
function date_Diff_day(date1,date2){
	var qssj = date1.split('-');  
    var jssj = date2.split('-');
	if(qssj[1].substring(0,1)==0){
		qssj[1] = qssj[1].substring(1,2);
	}
	if(jssj[1].substring(0,1)==0){
		jssj[1] = jssj[1].substring(1,2);
	}
	var d1 = new Date(qssj[0], qssj[1], qssj[2]);
    var d2 = new Date(jssj[0], jssj[1], jssj[2]);
	 
	if(d1>d2){
		return 0;
	} else{
		return 1;
	}
}

//取月份和日期
function date_month_day(str_date){
	var str_list = {};
	if(str_date!=null&&str_date!=""){
		var temp_strdate = str_date.substring(0,10).split('-');
		str_list = {'month':temp_strdate[1],'day':temp_strdate[2]};
	}else{
		str_list = {'month':'--','day':'--'};
	}
	return str_list ;
	
}

//获得所有科目和链接 flag_sub=1是在好题错题本中执行  flag-sub=2是在批阅过的试卷中使用
function subject_links(flag_sub,total_item){
				//var stu_sour = $.evalJSON($.cookie("UserInfo"));//获得学生信息 
				var temp=[];
				/*$.each(stu_sour.student_class,function(idx,stu_item){
					if(stu_item.class_id!=0&&stu_item.class_id!=""&&stu_item.subject_id!=""&&stu_item.subject_id!=null){
						var subject_temp = stu_item.subject_id;
						var subject_teacher = parseInt(stu_item.teacher_id);
						temp[idx] = parseInt(subject_temp);
					}
				});*/
				 
				//temp = unique(temp); //去掉重复的科目
				temp = [1,2,3,4,5,6,7,8,9];
				var str_subjects_g = ""; 
				var str_subjects_e = ""; 
				var str_subjects_ok = "";
				for(var j=0;j<=temp.length-1;j++){
					str_subjects_g+="<a onclick='goods_erroajax("+temp[j]+",2,1,"+total_item+")' class=subject_Gsum_a >"+subject_sum(parseInt(temp[j]))+"</a>&nbsp;&nbsp;";
					str_subjects_e+="<a onclick='goods_erroajax("+temp[j]+",1,1,"+total_item+")' class=subject_Gsum_a>"+subject_sum(parseInt(temp[j]))+"</a>&nbsp;&nbsp;";
					str_subjects_ok+="<a onclick='work_pi_ajax("+temp[j]+")' class=subject_Gsum_a >"+subject_sum(parseInt(temp[j]))+"</a>&nbsp;&nbsp;";
				}
				 
				 if(flag_sub==1){
					$('#subject_Gsum').html(str_subjects_g);
					$('#subject_Esum').html(str_subjects_e);
				 }else if(flag_sub==2){
					 $('#subject_OKsum').html(str_subjects_ok);
				}
				return temp;

}

 //遍历重复的数组   [1,2,3,4,5,2]
function unique(arr) {  
	var temp = {}, len = arr.length;
  
	for(var i=0; i < len; i++)  {  
		if(typeof temp[arr[i]] == "undefined") {
			temp[arr[i]] = 1;
		}
	}  
	arr.length = 0;
	len = 0;
	for(var i in temp) {
		arr[len++] = i;
	}  
	return arr;  
}



//试题学科的遍历
// 1 语文 2 数学 3 英语 4 物理 5 化学 6 生物 7 地理 8 历史 9 政治
function subject_sum(temp_sum){
	 
	switch(parseInt(temp_sum))
				{
   					case 1:
    				return '语文';
    				break;
  			 		case 2:
    				return '数学';
    				break;
					case 3:
    				return '英语';
    				break;
					case 4:
    				return '物理';
    				break;
					case 5:
    				return '化学';
    				break;
					case 6:
    				return '生物';
    				break;
					case 7:
    				return '地理';
    				break;
					case 8:
    				return '历史';
    				break;
					case 9:
    				return '政治';
    				break;
				}
			 
}


//大写数字
// 1 一 2 二 3 三 4 四 5 五 6 六 7 七 8 八 9 九 10 十  11 十一 12 十二  13 十三  十四  十五  十六 十七  十八  十九 二十
function number_ch(temp_sum){
	 
	switch(temp_sum)
				{
   					case 1:
    				return '一';
    				break;
  			 		case 2:
    				return '二';
    				break;
					case 3:
    				return '三';
    				break;
					case 4:
    				return '四';
    				break;
					case 5:
    				return '五';
    				break;
					case 6:
    				return '六';
    				break;
					case 7:
    				return '七';
    				break;
					case 8:
    				return '八';
    				break;
					case 9:
    				return '九';
    				break;
					case 10:
    				return '十';
    				break;
					case 11:
    				return '十一';
    				break;
					case 12:
    				return '十二';
    				break;
					case 13:
    				return '十三';
    				break;
					case 14:
    				return '十四';
    				break;
					case 15:
    				return '十五';
    				break;
					case 16:
    				return '十六';
    				break;
					case 17:
    				return '十七';
    				break;
					case 18:
    				return '十八';
    				break;
					case 19:
    				return '十九';
    				break;
					case 20:
    				return '二十';
    				break;
				}
			 
}

//ajax  链接
function Ajax_option(url_type,Qjson,type,async_type){
	var dataajax = "";
	var load_i = 0;
	$.ajax({
		url: Webversion + url_type,
		type: type,
		async:async_type,
		dataType: "json",
		data:Qjson,
		beforeSend: function (request) {
			load_i = layer.load('加载中...'); 
            request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
		complete: function (XMLHttpRequest, textStatus){
			layer.close(load_i);
		},
		success: function (result) {
			if(result!=null){
				dataajax = result;  
			}else{
				dataajax = [];
			}
		},
		error: function (result) {
			if(result.status=='401'){
				 
				if(result.responseText!=null&&result.responseText!=""){ 
					if($.parseJSON(result.responseText).login_status==0){
						var iis = layer.alert('用户账号或者密码错误，请确认账号和密码！', 8,'温馨提示',function(){
							clearcookie_s();	
							layer.close(iis);
						});
					}else{
						var iis_2 = layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
							clearcookie_s();	
							layer.close(iis_2);
						});	
					}
				
				}else{
					var iis_3 = layer.alert('账号在别的地方登录，点击确认从新登录！', 8,'温馨提示',function(){
						clearcookie_s();	
						layer.close(iis_3);
					});	
				}
			}else{
				layer.alert('加载数据失败！', 8,'温馨提示');	
			}
		}
	});	
	return dataajax;
}

function difficty_nums(temp_sums){
	
	switch(parseInt(temp_sums))  
				{
					case 0:
    				return '不限';
    				break;
					case 1:
    				return '容易';
    				break;
   					case 2:
    				return '较易';
    				break;
  			 		case 3:
    				return '中等';
    				break;
					case 4:
    				return '较难';
    				break;
					case 5:
    				return '困难';
    				break;
					 
				}
				
				
}

function edu_grade_stu(temp_sum){
	 
	switch(temp_sum)   //
				{
					case 0:
    				return '没有选择';
    				break;
					case 1:
    				return '小学一年级';
    				break;
   					case 2:
    				return '小学二年级';
    				break;
  			 		case 3:
    				return '小学三年级';
    				break;
					case 4:
    				return '小学四年级';
    				break;
					case 5:
    				return '小学五年级';
    				break;
					case 6:
    				return '小学六年级';
    				break;
					case 7:
    				return '初中一年级';
    				break;
					case 8:
    				return '初中二年级';
    				break;
					case 9:
    				return '初中三年级';
    				break;
					case 10:
    				return '高中一年级';
    				break;
					case 11:
    				return '高中二年级';
    				break;
					case 12:
    				return '高中三年级';
    				break;
					case 20:
    				return '高中必修';
    				break;
					case 21:
    				return '高中选修';
    				break;
				}
			 
}

//判断空值，  undefeated , null ,  "" , NAN  并返回 
function judgeNull(str){
	 
   
   switch(str){
		case 'undefined':
			return "";
			break;
		case "":
			return "";
			break;
		case null:
			return "";
			break;
		case 'NAN':
			return "";
			break;
		case undefined:
			return "";
			break; 
		default:
			return 	str;
			break;	   
   }
	
		
}


//处理grade_id 转换成section_id 

function grade_ch_section(grade_tid){
	var section_idT = 1;
	if(judgeNull(grade_tid)==null){
		grade_tid = 10;
	}
	var grade_idTemp = parseInt(grade_tid);
	if(grade_idTemp<7){
		section_idT = 1;
	}else if(grade_idTemp>9){
		section_idT = 3;
	}else{
		section_idT = 2;	
	}
	return section_idT;
}

//自主学习做过的内容的查询
//newest 1 作业 2 zhuanti 3 zhenti 4 mingxiao 5 tongbu  0是全部的查询
function getStuExamlist(type_num){
	//自主学习跳转具体页面
		var url_type = '/exercise_query?r='+$.getRom();
		var Qjson = {'action':'init_setting'};
		var getstu_result = Ajax_option(url_type,Qjson,"GET",false);	
		 
		var data_exam = "";
		if(getstu_result.init_setting!=false){
			 var stu_exam_info = $.parseJSON(getstu_result.init_setting);
			if(stu_exam_info!=null){
				if(stu_exam_info.newest==type_num&&type_num!=0){
					
					var str_temp = JSON.stringify(stu_exam_info.content[stu_exam_info.newest]); 
					
					data_exam = Base64.encode(str_temp);
				}else if(type_num==0){
					data_exam = Base64.encode(getstu_result.init_setting);
				}else{
					data_exam = "";
				}
			}else{
				data_exam = "";
			}
			
		}else{
			data_exam = "";
		}
		return data_exam;
}


/* 
 取得指定长度的字符串 
 注：半角长度为1，全角长度为2 
 pStr:字符串 
 pLen:截取长度 
   
 return: 截取后的字符串 
 */
function cutString(pStr, pLen) {  
    
    // 原字符串长度  
    var _strLen = pStr.length;  
   
    var _tmpCode;  
  
    var _cutString;  
  
    // 默认情况下，返回的字符串是原字符串的一部分  
    var _cutFlag = "1";  
  
    var _lenCount = 0;  
  
    var _ret = false;  
  
    if (_strLen <= pLen/2) {  
        _cutString = pStr;  
        _ret = true;  
    }  
  
    if (!_ret) {  
        for (var i = 0; i < _strLen ; i++ ) {  
            if (isFull(pStr.charAt(i))) {  
                _lenCount += 2;  
            } else {  
                _lenCount += 1;  
            }  
  
            if (_lenCount > pLen) {  
                _cutString = pStr.substring(0, i);  
                _ret = true;  
                break;  
            } else if (_lenCount == pLen) {  
                _cutString = pStr.substring(0, i + 1);  
                _ret = true;  
                break;  
            }  
        }  
    }  
      
    if (!_ret) {  
        _cutString = pStr;  
        _ret = true;  
    }  
  
    if (_cutString.length == _strLen) {  
        _cutFlag = "0";  
    }  
  
    return {"cutstring":_cutString, "cutflag":_cutFlag};  
}  


/* 
 判断是否为全角 
 pChar:长度为1的字符串 
 return: true:全角 
 false:半角 
 */

  
function isFull (pChar) { 
  for (var i = 0; i < pChar.strLen ; i++ ) {     
    if ((pChar.charCodeAt(i) > 128)) {  
        return true;  
    } else {  
        return false;  
    } 
	}
}

//浮动页面
function scrollright(){
	var topMain=262;//是头部的高度加头部与nav导航之间的距离。
	 
	var nav=$("#right_sct");
	 
	$(window).scroll(function(){
		if ($(window).scrollTop()>topMain){//如果滚动条顶部的距离大于topMain则就nav导航就添加类.nav_scroll，否则就移除。
			nav.addClass("right_scroll");
			$('.right_scroll').css('right',(document.body.clientWidth-1000)/2);
		}
		else
		{
			nav.removeClass("right_scroll");
		}
	});	
	
}



 
//查询好题错题本数据   history_sum是调用的条数,history_type_id 好题错题的参数  2是好题 1是错题  id是题目的ti_id   section_Teid(移动使用)  grade 18 高中  19初中 
function sel_goods(history_type_id,id,subid,forces,dbtype,section_Teid){
	if(history_type_id==2){
		var ti_url = '/history/list/0,1?r='+$.getRom();
		var ti_json = {history_type:history_type_id,ti_id:id,dbtype:dbtype};
		var tires_flag = Ajax_option(ti_url,ti_json,"GET",false);
		if(tires_flag == null ||tires_flag.history==null){
			add_goods(id,subid,forces,history_type_id,dbtype,section_Teid);	
		}else{
			layer.alert('此题目已经添加过！', 8,'温馨提示');
		}
	}else{
		add_goods(id,subid,forces,history_type_id,dbtype,section_Teid);	
	}
}
//好题错题添加
function add_goods(mode_id,mode_subject_id,mode_force,history_type,dbtypeT,section_Teid){
	var grade_id = 19;
	if(section_Teid==2){
		grade_id = 18;
	}else if(section_Teid==3){
		grade_id = 19;
	}else{
		grade_id = section_Teid;
	}
	var tiG_url = '/exercise_post?_'+$.getRom();
	var tiG_json = {'action':'saveCollection',"ti_id": mode_id,"bookcode":history_type,"subjectid": mode_subject_id,"grade": grade_id,"force": mode_force,"dbtype":dbtypeT,'section_id':section_Teid};
	var tires_Gflag = Ajax_option(tiG_url,tiG_json,"POST",false);
	if(history_type==2){
		layer.alert('收藏成功！', 9,'温馨提示');
	}
}

jQuery.extend({

    getRom: function () {
        return parseInt(1000000 * Math.random());
    }
});



//循环去知识点汉字逗号
function remove_comma(qm){
	var qmts = "";
	var qmt = '';
	while(qm.split(",,").length>1){
		qm = qm.replace(/,,/ig , ",");
	}
	
	if(qm.substring(qm.length-1,qm.length)==','){
		qm = qm.substring(0,qm.length-1);
	}
  
	return qm;
}


//步调学习等级
function step_D(numS){
	 
	switch(parseInt(numS)){
		case 1:
			return '<img src="images/dj_01.png" />';
			break;
		case 2:
			return '<img src="images/dj_02.png" />';
			break;
		case 3:
			return '<img src="images/dj_03.png" />';
			break;
		case 4:
			return '<img src="images/dj_04.png" />';
			break;
		case 5:
			return '<img src="images/dj_05.png" />';
			break; 
		default:
			return 	'<img src="images/dj_01.png" />';
			break;	   
   }
}
 

//学习测评等级
function  ping_D(numP){
	var numb = parseFloat(numP).toFixed(2);
	
	var tqnumb = "Ⅰ";
	if(0<=numb&&numb<=50){
		tqnumb = "Ⅰ";
	}else if(50<numb&&numb<=70){
		tqnumb = "Ⅱ";
	}else if(70<numb&&numb<=85){
		tqnumb = "Ⅲ";
	}else if(85<numb&&numb<100){
		tqnumb = "Ⅳ";
	}else if(numb==100){
		tqnumb = "Ⅴ";
	}
	return tqnumb;
}


//步调学习等级
function step_Q(numQ){
	 
	switch(numQ){
		case "Ⅰ":
			return 1;
			break;
		case "Ⅱ":
			return 2;
			break;
		case "Ⅲ":
			return 3;
			break;
		case "Ⅳ":
			return 4;
			break;
		case "Ⅴ":
			return 5;
			break; 
		default:
			return 	1;
			break;	   
   }
}


//步调学习等级
function step_QB(numQ){
	 
	switch(parseInt(numQ)){
		case 1:
			return "Ⅰ";
			break;
		case 2:
			return "Ⅱ";
			break;
		case 3:
			return "Ⅲ";
			break;
		case 4:
			return "Ⅳ";
			break;
		case 5:
			return "Ⅴ";
			break; 
		default:
			return 	"Ⅰ";
			break;	   
   }
}

 //步调学习等级
function step_QFD(numQ){
	 
	switch(parseInt(numQ)){
		case 1:
			return "E";
			break;
		case 2:
			return "D";
			break;
		case 3:
			return "C";
			break;
		case 4:
			return "B";
			break;
		case 5:
			return "A";
			break; 
		default:
			return 	"E";
			break;	   
   }
}

//
function num_string_section(numQZ){
	 
	switch(parseInt(numQZ)){
		case 1:
			return '小学';
			break;
		case 2:
			return '初中';
			break;
		case 3:
			return '高中';
			break;
		default:
			return '--';
			break;	   
   }
}



