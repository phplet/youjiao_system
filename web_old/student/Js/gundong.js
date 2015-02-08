//左右手动滚动

$(function(){  
        var page = 1;  
        var i = 3; //每版放3个图片
		alert(1); 
        //向后 按钮  
        $("span.next").click(function(){    //绑定click事件  
		
             var content = $("div#content");   
             var content_list = $("div#content_list");  
             var v_width = content.width();  
             var len = content.find("dl").length;  
             var page_count = Math.ceil(len / i) ;   //只要不是整数，就往大的方向取最小的整数  
             if( !content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画  
                  if( page == page_count ){  //已经到最后一个版面了,如果再向后，必须跳转到第一个版面。  
                    content_list.animate({ left : '0px'}, "slow"); //通过改变left值，跳转到第一个版面  
                    page = 1;  
                  }else{  
                    content_list.animate({ left : '-='+v_width }, "slow");  //通过改变left值，达到每次换一个版面  
                    page++;  
                 }  
             }  
       });  
        //往前 按钮  
        $("span.prev").click(function(){  
             var content = $("div#content");   
             var content_list = $("div#content_list");  
             var v_width = content.width();  
             var len = content.find("dl").length;  
             var page_count = Math.ceil(len / i) ;   //只要不是整数，就往大的方向取最小的整数  
             if(!content_list.is(":animated") ){    //判断“内容展示区域”是否正在处于动画  
                 if(page == 1 ){  //已经到第一个版面了,如果再向前，必须跳转到最后一个版面。  
                    content_list.animate({ left : '-='+v_width*(page_count-1) }, "slow");  
                    page = page_count;  
                }else{  
                    content_list.animate({ left : '+='+v_width }, "slow");  
                    page--;  
                }  
            }  
        });  
	 
		
    });  
	
	
	
	