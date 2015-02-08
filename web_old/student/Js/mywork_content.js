// JavaScript Document
function mywork_Content(){
		var box_3_title = $("#main_box_3_title_l").text();
		var box_3_content = $("#main_box_3_cen_1").html();
		var box_3_num = parseInt($("#main_box_3_title_r_NUM").text());
		var box_3_sum = parseInt($("#main_box_3_title_r_SUM").text());
		var box_3_sub = $("#main_box_3_cen_2_right").html();
		var box_3_sub_new = '<input type="button" value="确 认" class="sub_001"  onclick="mywork_Content();"/>';
		 
			//alert(box_3_title);
			//alert(box_3_content);
			var arr = [];
			//$.data(box_3_num,box_3_title);
			arr[box_3_num]=box_3_title;
			//alert($.data);
			box_3_title = "2.第二大题！";
			
			box_3_content = "《题目详细内容》";
			box_3_num+=1;
			if(box_3_num>=(box_3_sum)){
			 
			 alert("下面是最后一道题!转换成提交按钮");
			$("#main_box_3_cen_2_right").html(box_3_sub_new);	
			
			}
			
			$("#main_box_3_title_l").text(box_3_title);
			$("#main_box_3_cen_1").html(box_3_content);
			$("#main_box_3_title_r_NUM").text(box_3_num);
		
			
	}
	
	
	/* 收藏好题*/
	function mywork_Favorite(){
		
		 
		 var favorite_id = $("#main_box_3_title_l").text();
		 
		 alert("收藏的题目标题为："+favorite_id);
		
	}