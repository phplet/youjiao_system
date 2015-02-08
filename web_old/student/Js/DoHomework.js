var paperid = $.cookie("shijuanid");//试卷试题id集
var questions = paperid.split(",");//试题集id数组
var counts =questions.length;//试题集个数
var current_i = 0; //当前试题的下标
var current_j = 0;//当前题目
$(document).ready(function (){
	
	get_questions(current_i);//-------------------------------------第一题
});//.ready的结束标签
//-------------------------------------获得试题函数-----------------------------------------------------
function get_questions(i,b){
	if(b=='to'){//下一步
	 current_j = i+1;
	//alert(current_j);
	 }
	if(b=='up'){//为上一步
		current_j = i-1;
	 }
	 $.ajax({  
        url: Webversion + '/question/detail?r='+$.getRom(), //url访问地址
        type: "GET",
        dataType: "json",
        data: {
            id: questions[current_j]
        },
		beforeSend: function (request) {
                request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        },
        success: function (result)
        {
			
            var questions = $.evalJSON(Base64.decode(result.question));
		//	alert(questions);
			var img = questions.image; 
			
			var obj = eval('(' + img + ')'); 
			
			if (obj == null){ //如果为空的话就是没有图片
					$("#qst").append(questions.content);
			}else{
					var img1 = obj.question;
					//alert("弹出图片名字");
					//alert(img1[0].file);
					//alert("弹出替换后的");
					var qst=(questions.content).replace(img1[0].file,"data:image/gif;base64,"+img1[0].pic);  
					//alert(qst);
					//alert(qst);
					//alert(questions.content);
					$("#qst").append(qst);
   
			}
			//var 
			//alert(questions.question_type);
			$("#question_type").text(questions.type_name);//题型
			$("#tihao").text( current_j+1);//显示题号
			$("input[type=radio]").attr('name',questions.id);

        }
    });
	
}

//---------------------------------下一题---------------------------------------------------------------
function ToNext(){
	if(current_j==counts-1){//判断题目是否为最后一题
		return false;
	}
	$("#qst").empty();
	get_questions(current_j,'to');
}
//---------------------------------上一题---------------------------------------------------------------
function UpNext(){
	if(current_j==0){
		return false;
	}
	$("#qst").empty();
	get_questions(current_j,'up');
}


