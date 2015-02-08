var version_level = $.cookie("version_level");
var public_Bigclass_name = '大班';
if(version_level!=""&&version_level!=null){
	version_level = Base64.decode(version_level);
	if(version_level==1){
		 
		public_Bigclass_name = '班级';
	}else{
		public_Bigclass_name = '大班'; 
	}
}
 

//公共基本内容

//int型前面补0   num是数字  n是位数  比如 0001
function pad(num, n) {
  return Array(n>num?(n-(''+num).length+1):0).join(0)+num;
}

//json去掉不要的参数  {'id':1,'name':2} --> {'name':2}
function deletejson(json,delement){
	
	$.each(json,function(i,n){
		 
	});
}



/*datagridLoad加载数据表格  
	1.cssid :加载数据表格的样式id  如：'#Educational_Set'
	2.fitflag：设置fit的属性    true 满屏 false 设置大小
	3.toolbarid:设置头部包含      '#SerToolBar'
	4.columnsjson:  设置表格的列表 [{},{}] 
	5.url 链接数据地址
	6.type 链接方式 post  get ...
	7.datatype 传输数据类型  text  json ...  
	8.data 传递参数 [id:'',name:'']
	9.functionres = 'ajaxlogic(result)';

*/  
//当前时间
function getNowDate(){  
	var date = new Date();
	var dateStr = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+(date.getDate());
	 
	return dateStr;
}
//当前时间推后几天
function getthedate(dadd)
{
//可以加上错误处理
var a = new Date()
a = a.valueOf()
a = a + dadd * 24 * 60 * 60 * 1000
a = new Date(a);
var m = a.getMonth() + 1;
if(m.toString().length == 1){
    m='0'+m;
}
var d = a.getDate();
if(d.toString().length == 1){
    d='0'+d;
}
return a.getFullYear() + "-" + m + "-" + d;

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


function datagridLoad(cssid,fitflag,toolbarid,columnsjson,url,type,datatype,datacc,functionres,singleSelect){
	if(singleSelect==false){
		 
	}else{
		singleSelect = true;
	}
	$(cssid).datagrid({
        fit: fitflag,
        remoteSort: true,
		nowrap: false,
        toolbar: toolbarid,
        pagination: true,
        rownumbers: true,
		//sortOrder:"asc",
		singleSelect: singleSelect,
        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...', 
        /*onClickRow: function (rowIndex, rowData) {
            $('#Educational_Set').datagrid("unselectRow", rowIndex);
        },*/
		
        columns: columnsjson
    });
	
    var pager = $(cssid).datagrid("getPager");
	 
    pager.pagination({
        onSelectPage: function (pageNumber, pageSize) {
			 
            $(this).pagination('loading');
            var ltemp = (pageNumber - 1) * pageSize;
			var urlAjax ="";
			 
			if(url.substring(0,1)!='.'){
				urlAjax = eval(url);
			}else{
				var urltemp = url.split('?');
				urlAjax = urltemp[0]+'?'+eval('"'+urltemp[1]);
			}
			// 加载数据列表
			 
			$.ajax({
				url: urlAjax,
				type: type,
				async:false,
				dataType: datatype,
				data: datacc,
				 
				success: function (result){
					var dataGrid={};
					
					var datalistTemp = [];
					 
					datalistTemp = eval(functionres);//逻辑处理
					
					 
					if(datalistTemp!=undefined&&datalistTemp!=""){ 
						
						dataGrid["total"]=result.count;
						dataGrid["rows"]=datalistTemp;
						
					}else{
						 
						 dataGrid["total"]=0;
						 dataGrid["rows"]=[];
						// $.messager.alert('温馨提示','数据为空！');
					}
					
					$(cssid).datagrid("loadData", dataGrid);
					 
				},
				error: function (result) {
					$.messager.alert('温馨提示','账号异常：<br/>1.账号在别的地方登录，重新登录；<br/>2.网络加载失败,测试网络是否畅通。','warning');
				}
			});
            //Loading(ltemp, pageSize,url,type,datatype,data,cssid,functionres);
            $(this).pagination('loaded');
			
        }
    });
	 
	pager.pagination("select",1);
	 
	return pager;
	
}
/*Loading链接数据地址  返回数据  
	1.cssid :加载数据表格的样式id  如：'#Educational_Set'
	2.s：设置fit的属性    true 满屏 false 设置大小
	3.l:每页条数    pageSize
	4.url 链接数据地址
	5.type 链接方式 post  get ...
	6.datatype 传输数据类型  text  json ...  
	7.data 传递参数 [id:'',name:'']
	8.functionres = 'ajaxlogic(result)';

*/  

/*function Loading(s,l,url,type,datatype,data,cssid,functionres) {
 	var urlAjax = eval(url);
    // 加载数据列表
    $.ajax({
        url: urlAjax,
        type: type,
        dataType: datatype,
        data: data,
        success: function (result){
			
            var datalistTemp = [];
				datalistTemp = eval(functionres);//逻辑处理
            //alert($.toJSON(datalistTemp));
            $(cssid).datagrid("loadData", datalistTemp);
        },
        error: function (result) {
			$.messager.alert('温馨提示','加载数据失败！','error');
        }
    });
}*/



//ajax的调用 
/*
	1.url 链接数据地址
	2.type 链接方式 post  get ...
	3.datatype 传输数据类型  text  json ...  
	4.data 传递参数 [id:'',name:'']
	5.functionres = 'ajaxlogic(result)';	
*/
function HttpAjaxFuc(i, s, d) {
        var p = {
            url: i,
            type: "GET",
            dataType: "json",
            success: s,
            error: function (result) {
			$.messager.alert('温馨提示','账号异常：<br/>1.账号在别的地方登录，重新登录；<br/>2.网络加载失败,测试网络是否畅通。','warning');
        	}
        };

        if (d != null) {
            p["data"] = d;
        }
		
        $.ajax(p);
    }

 

//弹出创建
/*
	1.cssid :加载数据表格的样式id  如：'#Educational_Set'
	2.hx_title：弹出框标题
	3.hx_width:宽度
	4.hx_height 高度
	5.openfuc 打开之后的逻辑处理
	6.handfuc 提交之后的逻辑处理 
	7.ok 确认btn的名称
	8.cancel 取消btn的名称
*/
function alertCreate(cssid,hx_title,hx_width,hx_height,openfuc,handfuc,ok,cancel){
	   
        $(cssid).dialog({
            iconCls: 'icon-add',
            title: hx_title,
            width: hx_width,
            height: hx_height,
            closed: true,
            cache: false,
            modal: true,
            onOpen:function(){
				eval(openfuc);
			},
            buttons: [{
                text: ok,
                iconCls: 'icon-ok',
                handler:function(){
					eval(handfuc);	
					
				}
            }, {
                text: cancel,
                iconCls: 'icon-cancel',
                handler: function () {
                    $(cssid).dialog('close');
                }
            }]
        });
		 
}


//弹出创建
/*
	1.cssid :加载数据表格的样式id  如：'#Educational_Set'
	2.hx_title：弹出框标题
	3.hx_width:宽度
	4.hx_height 高度
	5.openfuc 打开之后的逻辑处理
	6.handfuc 提交之后的逻辑处理 
	7.ok 确认btn的名称
	8.cancel 取消btn的名称
*/
function alertSel(cssid,hx_title,hx_width,hx_height,openfuc,ok){
	 
        $(cssid).dialog({
            iconCls: 'icon-save',
            title: hx_title,
            width: hx_width,
            height: hx_height,
            closed: true,
            cache: false,
            modal: true,
            onOpen: function(){
				eval(openfuc);
			},
            buttons: [{
                text: ok,
                iconCls: 'icon-ok',
                handler: function () {
                    $(cssid).dialog('close');
                }
            }]
        });
		 
}

//子题库联动调用ajax
function Ajax_Question(url_type,Qjson){
	var dataajax = "";
	$.ajax({
		url: Webversion + url_type,
		type: "GET",
		async:false,
		dataType: "json",
		data:Qjson,
		success: function (result) {
			if(result!=null){
				dataajax = result;  
			}else{
				dataajax = [];
			}
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});	
	return dataajax;
}



//ajax  链接
function Ajax_option(url_type,Qjson,type){
	var dataajax = "";
	$.ajax({
		url: Webversion + url_type,
		type: type,
		async:false,
		dataType: "json",
		data:Qjson,
		success: function (result) {
			if(result!=null){
				dataajax = result;  
			}else{
				dataajax = [];
			}
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});	
	return dataajax;
}



//url中数据的提取
function getUrlParam(name){
		var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r!=null) return unescape(r[2]); return null;
		
}

//验证用户名是否重复
function selverify(cssid){
	var sName = $('#'+cssid).val();
	if(($.trim(sName))!=""&&getvarcharVal(sName)<=32){
		if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(com|cn|net)$/i.test(sName)) {
			  $.ajax({
				  url: Webversion + "/verify",
				  type: "GET",
				  dataType: "json",
				  //data:{action:'list','condition':'center_name^'+sName},
				  data:{action:'verify','account':sName},
				  beforeSend: function (request) {
							  request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
						  },
				  success: function (result) {
					  if(result.flag){
						  $('#'+cssid+'_Ms').html('&nbsp;<img src="../images/ok.png"/>');
					  }else{
						  $('#'+cssid+'_Ms').html('&nbsp;用户已存在！');
					  }
					   
				  },
				  error: function (result) {
					  
					  $.error('加载数据失败！');
				  }
			  });
		}else{
		  	  $('#'+cssid+'_Ms').html('&nbsp;用户名为邮箱格式！');	
		}
	}else{
		if(getvarcharVal(sName)>=32){
				$('#'+cssid+'_Ms').html('不能大于32个字符！');
			}else{
				$('#'+cssid+'_Ms').html('&nbsp;用户不能为空！');
			}
		
	}
}


//批量验证人员
function selverify_moreTeaStu(cssid){
	var sName = $('#'+cssid).val();
	var jj = 0;
    $('#nonereg input[type="text"]').each(function(index, element) {
		if($(this).attr("id")!=cssid&&$(this).val()==sName){
			jj++;
			 
		}
         
    });
	if(jj==0){
		if(($.trim(sName))!=""&&getvarcharVal(sName)<=32){
			if (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.(com|cn|net)$/i.test(sName)) {
			  $.ajax({
				  url: Webversion + "/verify",
				  type: "GET",
				  dataType: "json",
				  //data:{action:'list','condition':'center_name^'+sName},
				  data:{action:'verify','account':sName},
				  beforeSend: function (request) {
							  request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
						  },
				  success: function (result) {
					  if(result.flag){
						  $('#'+cssid+'_Ms').html('&nbsp;<img src="../images/ok.png"/>');
					  }else{
						  $('#'+cssid+'_Ms').html('用户已存在！');
					  }
					   
				  },
				  error: function (result) {
					  
					  $.error('加载数据失败！');
				  }
			  });
			}else{
		  	  $('#'+cssid+'_Ms').html('&nbsp;用户名为邮箱格式！');	
			}
		}else{
			if(getvarcharVal(sName)>=32){
				$('#'+cssid+'_Ms').html('不能大于32个字符！');
			}else{
				$('#'+cssid+'_Ms').html('用户名为空！');
			}
			
		}
	}else{
		$('#'+cssid+'_Ms').html('用户名重复！');
	}
}

//验证人员上限
function check_max_counts(center_id){
	var max_url = '/center';
	var max_Qjson = {'action':'center_count_info','center_id':center_id};
	var max_res = Ajax_option(max_url,max_Qjson,"GET");
	return max_res;
	
}


//查询人员一条数据 
function reSetPass(userid,url){
	 
	$.ajax({
		url: Webversion + url,
		type: "POST",
		dataType: "json",
		data:{action:'reset_passwd','user_id':userid},
		beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
				},
		success: function (result) {
			if(result.flag){
			 	$.messager.alert('温馨提示', '密码重置成功！密码是：123456', 'info'); 
			}else{
				$.error('重置密码失败！');	
			}
		},
		error: function (result) {
			
			$.error('加载数据失败！');
		}
	});
	
}
 
 
//省市联动查询   省
function provinceList(selects,select_city,cpid){
		
		$.ajax({
                url: Webversion + "/province",
                type: "GET",
                dataType: "json",
				data:{action:'list'},
                success: function (result) {
					
					$('#schoolAddrP').combobox({
						data:result,
						valueField:'id',
						textField:'name',
						onLoadSuccess:function(){
						 
							if(cpid!=null){
								cityList(cpid,select_city);
								cpid=null;
							}
						  
						},
						onSelect:function (record){
							cityList(record.id,null);
						}
					});
					if(selects!=null){
						eval(selects);
					}
                },
                error: function (result) {
                    
                    $.error('加载数据失败！');
                }
            });	

}
//省市联动查询   市
function cityList(Pid,city_id){
	 
	 if(Pid!=null){
		$.ajax({
                url: Webversion + "/city",
                type: "GET",
                dataType: "json",
				data:{action:'list',provinceid:Pid},
				beforeSend: function (request) {
                			request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        				},
                success: function (result) {
					  
					$('#schoolAddrC').combobox({
						enable:true,
						data:result,
						valueField:'id',
						textField:'name'
						 
					});
					 if(city_id!=null){
					 	eval(city_id);
					 }
                },
                error: function (result) {
                    
                    $.error('加载数据失败！');
                }
            });	
	 }
}
//遍历重复的数组
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
    				return '物理';  //初二
    				break;
					case 5:
    				return '化学';  //初三
    				break;
					case 6:
    				return '生物'; //初一初二
    				break;
					case 7:
    				return '地理'; //初一初二
    				break;
					case 8:
    				return '历史';//初中
    				break;
					case 9:
    				return '政治';//初中
    				break;
				}
			 
}


// 难易度
function difficuty_sum(temp_sum){
	 
	switch(parseInt(temp_sum))     
				{
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
					default:
    				return '无';
    				break; 
					 
				}
			 
}

//年级遍历



//试题学科的遍历
// 1 语文 2 数学 3 英语 4 物理 5 化学 6 生物 7 地理 8 历史 9 政治
function grade_sum(temp_sum){
	 
	switch(temp_sum)  //[{'id':1,'Name':'小学'},{'id':2,'Name':'初中'},{'id':3,'Name':'高中'}]
				{
					case 0:
    				return '学前';
    				break;
   					case 1:
    				return '小学';
    				break;
  			 		case 2:
    				return '初中';
    				break;
					case 3:
    				return '高中';
    				break;
				}
			 
}


//作业状态
// 0 已过期 1 未习作 2 未批改 3 已批改 
function status_sum(temp_sum){
	 
	switch(temp_sum)
				{
					case 0:
    				return '<font color="#ccc">已过期</font>';
    				break;
   					case 1:
    				return '<font color="#0080ff">新作业</font>';
    				break;
  			 		case 2:
    				return '<font color="#ff0000">未批改</font>';
    				break;
					case 3:
    				return '<font color="#050adb">已批改</font>';
    				break;
					case 4:
    				return '<font color="#0080ff">正在做</font>';
    				break;
				}
			 
}



function edu_grade(temp_sum){
	 
	switch(temp_sum)   //
				{
					case 0:
    				return '没有选择';
    				break;
					case 1:
    				return '小一';
    				break;
					case 2:
    				return '小二';
    				break;
					case 3:
    				return '小三';
    				break;
					case 4:
    				return '小四';
    				break;
   					case 5:
    				return '小五';
    				break;
  			 		case 6:
    				return '小六';
    				break;
					case 7:
    				return '初一';
    				break;
					case 8:
    				return '初二';
    				break;
					case 9:
    				return '初三';
    				break;
					case 10:
    				return '高中必修';
    				break;
					case 11:
    				return '高中选修';
    				break;
					case 18:
    				return '初中';
    				break;
					case 19:
    				return '高中';
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
					default:
    				return '高中三年级';
    				break;
				}
			 
}


//大写一11111
function weeks_name(day){
	 
	switch(day)   //
				{
					case 0:
    				return '星期一';
    				break;
					case 1:
    				return '星期二';
    				break;
					case 2:
    				return '星期三';
    				break;
					case 3:
    				return '星期四';
    				break;
					case 4:
    				return '星期五';
    				break;
   					case 5:
    				return '星期六';
    				break;
  			 		case 6:
    				return '星期日';
    				break;
				}
			 
}



//本周时间显示
function thisweek(){
	var now = new Date();
	var week=new Array();
	var currentWeek = now.getDay();
	if ( currentWeek == 0 ){
		currentWeek = 7;
	}
	
	var monday = now.getTime() - (currentWeek-1)*24*60*60*1000;   //星期一
	var tuesday = now.getTime() - (currentWeek-2)*24*60*60*1000;   //星期2
	var wednesday = now.getTime() - (currentWeek-3)*24*60*60*1000;   //星期3
	var thursday = now.getTime() - (currentWeek-4)*24*60*60*1000;   //星期4
	var friday = now.getTime() - (currentWeek-5)*24*60*60*1000;   //星期5
	var saturday = now.getTime() - (currentWeek-6)*24*60*60*1000;   //星期6
	var sunday = now.getTime() - (currentWeek-7)*24*60*60*1000;      //星期日	
	
	week = [monday,tuesday,wednesday,thursday,friday,saturday,sunday];
	return week;	
}

//上一个星期
function upWeek(now_1){
	
	var week_1=new Array();
	var currentWeek_1 = now_1.getDay();
	if ( currentWeek_1 == 0 ){
		currentWeek_1 = 7;
	}
	var monday_1 = now_1.getTime() - (currentWeek_1+6)*24*60*60*1000;   //星期一
	var tuesday_1 = now_1.getTime() - (currentWeek_1+5)*24*60*60*1000;   //星期2
	var wednesday_1 = now_1.getTime() - (currentWeek_1+4)*24*60*60*1000;   //星期3
	var thursday_1 = now_1.getTime() - (currentWeek_1+3)*24*60*60*1000;   //星期4
	var friday_1 = now_1.getTime() - (currentWeek_1+2)*24*60*60*1000;   //星期5
	var saturday_1 = now_1.getTime() - (currentWeek_1+1)*24*60*60*1000;   //星期6
	var sunday_1 = now_1.getTime() - (currentWeek_1)*24*60*60*1000;      //星期日	
	 
	week_1 = [monday_1,tuesday_1,wednesday_1,thursday_1,friday_1,saturday_1,sunday_1];
	return week_1;
}
//下一个星期
function nextWeek(now_2){
	
	var week_2=new Array();
	var currentWeek_2 = now_2.getDay();
	if ( currentWeek_2 == 0 ){
		currentWeek_2 = 7;
	}
	var monday_2 = now_2.getTime() - (currentWeek_2-8)*24*60*60*1000;  //星期一
	var tuesday_2 = now_2.getTime() - (currentWeek_2-9)*24*60*60*1000;   //星期2
	var wednesday_2 = now_2.getTime() - (currentWeek_2-10)*24*60*60*1000;   //星期3
	var thursday_2 = now_2.getTime() - (currentWeek_2-11)*24*60*60*1000;   //星期4
	var friday_2 = now_2.getTime() - (currentWeek_2-12)*24*60*60*1000;   //星期5
	var saturday_2 = now_2.getTime() - (currentWeek_2-13)*24*60*60*1000;   //星期6
	var sunday_2 = now_2.getTime() - (currentWeek_2-14)*24*60*60*1000; //星期日
	week_2 = [monday_2,tuesday_2,wednesday_2,thursday_2,friday_2,saturday_2,sunday_2];
	return week_2;
}
//时间转换
function changeTime(str){
  var curYear = str.substring(0,str.indexOf('年'));
  var curMonth =str.substring(str.indexOf('年')+1,str.indexOf('月'));
  var curDay =str.substring(str.indexOf('月')+1,str.indexOf('日'));
  
  if (curMonth<10){
  curMonth="0"+curMonth;
  }
  if(curDay<10){
  curDay="0"+curDay;
  }
  var returnDate = curYear+"-"+curMonth+"-"+curDay;
 return returnDate;
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



//年份  n_ts从哪一年开始  mcssid是select的id值
	function years(n_Ts,ycssid,mcssid){
		var n_bs = parseInt(n_Ts);
		var ns = new Date().getFullYear();
		var nhtmls = [{'id':'请选择','name':'请选择'}];
		for(var i=ns;i>=n_bs;i--){
			nhtmls.push({'id':i,'name':i+'年'});
			
		}
		$('#'+ycssid).combobox({
			data:nhtmls,
			valueField:'id',
			textField:'name',
			onLoadSuccess:function(){
				$(this).combobox('setValue','请选择');  
			},
			onChange:function(newsvalues,oldvalues){
			 	months(mcssid,newsvalues);
			}
		
		});
		
	}
	
	//月份  ycssid是年份的value值  mcssid是月份的id
	function months(mcssid,mvalue){
		 
		var yhtmls = [{'id':'请选择','name':'请选择'}];
		if(mvalue!='请选择'){
			var n_b = parseInt(mvalue);
			var n = new Date().getFullYear(); 
			 
			var y = new Date().getMonth()+1;
			if(n_b!=n){
				y = 12 ;
			}else{
				y = new Date().getMonth()+1;
			}
			 
			for(var j=1;j<=y;j++){
				yhtmls.push({'id':j,'name':j+'月'});
			}
		 
		}
		$('#'+mcssid).combobox({
			data:yhtmls,
			valueField:'id',
			textField:'name',
			onLoadSuccess:function(){
				$(this).combobox('setValue','请选择');  
			}
		});
	}
	
	
//去字符串的varchar长度
function getvarcharVal(sts) {
	var returnValue = '';
	var byteValLen = 0;
	for (var i = 0; i < sts.length; i++) {
		if (sts[i].match(/[\u4e00-\u9fa5]/ig) != null)
		byteValLen += 2;
		else
		byteValLen += 1;
	}
	return byteValLen;
} 


/* 
 处理过长的字符串，截取并添加省略号 
 注：半角长度为1，全角长度为2  
 pStr:字符串 
 pLen:截取长度  
 return: 截取后的字符串 
 */
function autoAddEllipsis(pStr,pLen) {  
  
    var _ret = cutString(pStr, pLen);  
    var _cutFlag = _ret.cutflag;  
    var _cutStringn = _ret.cutstring;  
  
    if ("1" == _cutFlag) {  
        return _cutStringn + "...";  
    } else {  
        return _cutStringn; 
    }  
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

//判断空值，  undefeated , null ,  "" , NAN  并返回 
function judgeNull(str){
	 
   
   switch(str){
		case 'undefeated':
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

