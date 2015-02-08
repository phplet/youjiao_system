// JavaScript Document
function moves_jixi(){
	$(".hf").hover(
		function(){
			$(this).css({
				'cursor':'pointer'}
			);
		});
	$(".hf").click(function(){	
		var focus = $(this).parents(".tijixie").find("#focus");
		if(focus.css("display")=="none")
		{
		   focus.show();this.innerHTML = "解析收起";
		}else
		{
		  focus.hide(); this.innerHTML = '查看解析';
		}
    });
	 
}

/*function moves_tanchu(){
$(".main_box_3_cen_2_right_1").hover(
		function(){
			$(this).css({
				'cursor':'pointer'}
			);
		});
	$(".main_box_3_cen_2_right_1").click(function(){	
		var focus = $(this).parents(".main_box_3_cen").find("#focus");
		if(focus.css("display")=="none")
		{
		   focus.show();this.innerHTML = "收起";
		}else
		{
		  focus.hide(); this.innerHTML = '查看解析';
		}
    });
	$("form").submit(function(){
	   var textarea = $(this).find("#textarea");
	   if(textarea.val()==""||textarea.val()=="请输入内容")
	   {
	      textarea.blur();
	      return false;
	   }
	});
}*/