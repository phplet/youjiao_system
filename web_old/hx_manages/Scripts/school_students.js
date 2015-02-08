var UserInfo = {};
var centerAll = {};
var page = "";
var zonenamesid = [];
 
$().ready(function() {
      UserInfo = $.evalJSON($.cookie("UserInfo"));
	  if(UserInfo.level==1){
		 centerAll['center_id'] = UserInfo.center_id; 
	  }else{
		centerAll = $.evalJSON($.cookie("centerAll"));  
	  }
	  if(UserInfo.level==1){
		 $('.zone_Name_1').hide();
		 $('.zone_Name_1_s').show();
	  }else if(UserInfo.level==2){
		 $('.zone_Name_1_s').hide();
		 $('.zone_Name_1').show();
		 $('.zone_Name_1').html($('#A_zones',window.parent.document).find("option:selected").text());
	  }
	  school_Class();
		 
});

function school_Class(){
	
	if(UserInfo.level==1){
		 var url_type_idN = '/center_zone';
		 var Qjson_idN = {'action':'list','center_id':UserInfo.center_id};
		 var zone_idN = Ajax_option(url_type_idN,Qjson_idN,"GET");
		 if(zone_idN.list!=null&&zone_idN.list!=""){
			 
			$.each(zone_idN.list,function(idN_i,idN_n){
				
				zonenamesid.push({'id':idN_n.id,'name':idN_n.zone_name});
				
			});
		 }
		 $('#zone_Name_1').combobox({
			  data:zonenamesid,
			  valueField:'id',
			  textField:'name',
			  onLoadSuccess:function(){
				 $(this).combobox('setValue',zonenamesid[0].id);  
			  },
			  onChange:function(newsvalues,oldvalues){
				   
				  if(newsvalues!='请选择'){
					  
					   day_counts(newsvalues);
				  }
			  }
		  });
	 }else if(UserInfo.level==2){
		 day_counts("");
	 }	
	
}

//按天统计
function day_counts(didN){
	
	var columnsjson =[[
					{ field: 'create_date', title: '日期', width: 100, align: 'center'},
					{ field: 'nowStus', title: '在校人数', width: 100, align: 'center'},
					{ field: 'newStus', title: '新增人数', width: 100, align: 'center'},
					{ field: 'loseStus', title: '减少人数', width: 100, align: 'center'}
    ]];
 
	var zone_id = "";	
	if(UserInfo.level==1){
		zone_id = didN;
		
	}else if(UserInfo.level==2){
		zone_id = $('#A_zones',window.parent.document).find("option:selected").val();
	}
	
	var url = 'Webversion + "/stat?pageno="+pageNumber+"&countperpage="+pageSize';
	var datacc ={'action':'student_number_stat','time':'day','center_id':centerAll.center_id,'zone_id':zone_id};
	if(UserInfo.level==1){
		datacc['center_id'] = UserInfo.center_id;
	}
	var functionres = 'Longding(result);';
	//加载列表  并且返回pager
	pager = datagridLoad('#school_students',true,'#topbars',columnsjson,url,"GET","json",datacc,functionres);
	 
}


//加载列表俺分页的形式显示
function Longding(result) {
 
    var datalistTemp = [];
			 
	if(result.list!=null){
		 
		$.each(result.list,function(i,s){
				var itemtemp = {};
			   
				itemtemp.create_date = s.day;
				itemtemp.nowStus = s.stu_total_num;
				itemtemp.newStus = s.stu_new_num;
				itemtemp.loseStus = s.stu_lost_num;
				datalistTemp.push(itemtemp);
		});
	}
	return datalistTemp;
}