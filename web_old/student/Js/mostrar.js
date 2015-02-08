// JavaScript Document
function moves_jixi(){
	 
	 
	$(".hf").click(function(){	
		var focus = $(this).parents(".main_box_4_cen").find("#focus");
		 
		if(focus.css("display")=="none")
		{
		   
		   focus.show();this.innerHTML = "收起心得";
		}else
		{
		  focus.hide(); this.innerHTML = '学习心得';
		}
    });
		$(".hf_jiexi").click(function(){	
		var focus_jiexi = $(this).parents(".main_box_4_cen").find("#focus_jiexi");
		 
		if(focus_jiexi.css("display")=="none")
		{
		   
		   focus_jiexi.show();this.innerHTML = "收起解析";
		}else
		{
		  
		  focus_jiexi.hide(); this.innerHTML = '查看解析';
		}
    });
	
	 
}


function goods_jiexi(tid,subid,dbtype){
	
	$(function(){	
		var tid_focus = $("#hf_goods"+tid); 
		var focus = tid_focus.parents(".main_box_4_cen").find("#focus_jiexi");
		
		if(focus.css("display")=="none")
		{ 
			$.ajax({  
			url: Webversion + '/question/detail?r='+$.getRom(), //
			type: "GET",
			dataType: "json",
			data: {
				'id':tid,'subject_id':subid,'dbtype':dbtype
			},
			beforeSend: function (request) {
					request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
			},
			success: function (result)
			{
				var questions = $.evalJSON(Base64.decode(result.question));
				 
			   focus.empty();
			   focus.append('<div class="jiexi_bg">试题解析</div><div class="jiexi_ct">'+questions.answer+'</div>');
	
			}
    	});
	     
		   
		   focus.show();tid_focus.text("收起解析");
		    
		}else
		{
		  focus.hide(); tid_focus.text("查看解析");
		}
    });
	
	
	
	}