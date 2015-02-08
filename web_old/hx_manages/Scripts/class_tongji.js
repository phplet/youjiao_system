var UserInfo = {};
var centerAll = {};
var pager="";
var w_days = [];

$().ready(function () {
	 
    UserInfo = $.evalJSON($.cookie("UserInfo"));
    centerAll = $.evalJSON($.cookie("centerAll"));
	var cid = getUrlParam("cid");
	var class_names = Base64.decode(getUrlParam("classname")); 
	
	$('#class_names').html(class_names+'&nbsp;测评成绩统计分析');
	var pie_title = '试卷名称：<br />派送时间：';
	var url_type = '/assign';
	var Qjson = {'action':'list','condition':'center_id^'+centerAll.center_id+'$zone_id^'+$('#A_zones',window.parent.document).find("option:selected").val(),'user_id':UserInfo.id,'class_id':cid};
	var tongji_res = Ajax_option(url_type,Qjson,"GET");
	$('#pie_list').html("");
	if(tongji_res.list!=null&&tongji_res.list!=undefined&&tongji_res.list!=""){
		$.each(tongji_res.list,function(i,n){
			$('#pie_list').append('<li class="text_float" style="padding-bottom:10px;"><div id="pie_0_'+i+'" style="width: 370px; height: 200px; margin: 0 auto; "></div></li><li class="text_float" style="width:10px;">&nbsp;</li>');
			
			var chart;
			var pie_title = '试卷名称：'+n.name+'<br />派送时间：'+n.create_date;
			var score_percent_100 = Number(n.stat_analyse.score_percent_100);
			var score_percent_85_over = Number(n.stat_analyse.score_percent_85_over);
			var score_percent_70_over = Number(n.stat_analyse.score_percent_70_over);
			var score_percent_60_over = Number(n.stat_analyse.score_percent_60_over);
			var score_percent_60_below = Number(n.stat_analyse.score_percent_60_below);
			var assign_student_count = Number(n.stat_analyse.assign_student_count);
			var pie100 = Number((score_percent_100/assign_student_count*100).toFixed(1));
			var pie85 = Number((score_percent_85_over/assign_student_count*100).toFixed(1));
			var pie70 = Number((score_percent_70_over/assign_student_count*100).toFixed(1));
			var pie60 = Number((score_percent_60_over/assign_student_count*100).toFixed(1));
			var pie60_b = Number((score_percent_60_below/assign_student_count*100).toFixed(1));
			
			var datapie = [
							{name: '100%'+score_percent_100+'人',y:pie100},
							{name: '85%以上'+score_percent_85_over+'人',y:pie85},
							{name: '70%以上'+score_percent_70_over+'人',y:pie70},
							{name: '60%以上'+score_percent_60_over+'人',y:pie60},
							{name: '60%以下'+score_percent_60_below+'人',y:pie60_b}
						];
			piefunction('pie_0_'+i,pie_title,datapie);
			
		});
	} else{
		$('#pie_list').html("没有试卷！");
	}
	
	
        

});

function piefunction(piecssid,pie_title,datapie){
	
	$('#'+piecssid).highcharts({
			
            chart: {
                backgroundColor:"#66ffff",
                plotBorderWidth: null,
                plotShadow: true
            },
            title: {
                text: pie_title,
				align:'left',
				style:{color:'#3E576F',fontSize:'12px'},
				 
            },
			exporting:{ 
                     enabled:false //用来设置是否显示‘打印’,'导出'等功能按钮，不设置时默认为显示 
               		 },
			credits: {  
                enabled: false     //去掉highcharts网站url  
            },  
            tooltip: {
        	    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
			 legend: {//方框所在的位置(不知道怎么表达)  

				layout: 'vertical',  
	
				align: 'right',  
	
				verticalAlign: 'top',  
	
				x: -30,  
	
				y: 55,  
	
				borderWidth: 0  

        	},  
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false
                    },
					
                    showInLegend: true
                }
            },
            series: [{
                type: 'pie',
                name: '百分比',
                data: datapie
            }]
        });

	
}


 