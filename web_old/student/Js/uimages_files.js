// JavaScript Document
var picnum=1;
var bar = $('.bar');
var percent = $('.percent');
var showimg = $('#showimg');
var progress = $(".progress");
var files = $(".files");
var btn = $(".btn span");
var anwe = $("#anwe1"); 
	
$(function () {
	 bar = $('.bar');
	 percent = $('.percent');
	 showimg = $('#showimg');
	 progress = $(".progress");
	 files = $(".files");
	 btn = $(".btn span");
	 anwe = $("#anwe1"); 
	$("#fileupload").wrap("<form id='myupload' action='hx_20@13_paid_pic/action.php' method='post' enctype='multipart/form-data'></form>");
    
});

function changesupload(){
		 
		$("#myupload").ajaxSubmit({
			dataType:  'json',
			beforeSend: function() {
				progress.show();
        		var percentVal = '0%';
        		bar.width(percentVal);
        		percent.html(percentVal);
				btn.html("上传中...");
    		},
    		uploadProgress: function(event, position, total, percentComplete) {
        		var percentVal = percentComplete + '%';
        		bar.width(percentVal);
        		percent.html(percentVal);
    		},
			success: function(data) {
				bar.html("");
				files.css("display","block");
				var srt = (data.pic).split('.');
				
				var img = "hx_20@13_paid_pic/hx_@images/"+data.pic;
				//files.append("<span id=\'"+srt[0]+"\'><b>"+data.pic+"("+data.size+"k)</b> <span class='delimg' onClick=\"box(\'"+srt[0]+"\',\'"+srt[1]+"\')\">删除</span></span>");
				if(srt[1]=="txt"){
					img="images/txt.png";
				}else if(srt[1]=="doc"){
					img="images/doc.png";
				}
				 
				files.append('<div class="tv_main" id="'+srt[0]+'"><ul><li class="tv_main_img">'+picnum+'</li><li class="tv_main_img"><img src="'+img+'" class="theImage" width=30 height=30></li><li class="tv_main_pic"><a href="hx_20@13_paid_pic/hx_@images/'+data.pic+'" target="_blank">'+data.pic+'</a></li><li class="tv_main_size">('+data.size+'k)</li><li class="tv_main_op" onClick="dele_pic(\''+srt[0]+'\',\''+srt[1]+'\')">删除</li></ul><div class="cleard"></div></div>');
				 
				$('#fileupload').remove();
				$('#myupload').append('<input id="fileupload" type="file" name="mypic" onchange="changesupload()"/>');
				//showimg.append("<span id=\""+srt[0]+"_img\"><img src='"+img+"' width=30 height=30></span>");
				btn.html("添加附件");
				//var ss = anwe.text();
				//alert(ss);
				anwe.append(data.pic+","); 
				//var sss = anwe.text();
				//alert(sss);
				picnum++;
			},
			error:function(xhr){
				btn.html("上传失败");
				 
				bar.html(xhr.responseText);
			}
		});	
		
    
	}



function dele_pic(pic,imgtype){
		   
		$.post("hx_20@13_paid_pic/action.php?act=delimg",{imagename:pic+"."+imgtype},function(msg){
			if(msg==1){
				var test = $('#anwe1').text();
				var strs = test.split(pic+'.'+imgtype+',');
				var newstrs = strs[0]+strs[1];
				$('#anwe1').text(newstrs);
				$('#'+pic).remove();
				if(newstrs==""){
					$(".files").css("display","none");
				}
				layer.alert('删除成功！', 9,'温馨提示');
				 
				
				//showimg.empty();
				//progress.hide();
			}else{
				layer.alert(msg, 8,'温馨提示');
				 
			}
		});
		
		}
		
		function dele_pic_back(pic,imgtype,tid){
		   
		$.post("hx_20@13_paid_pic/action.php?act=delimg",{imagename:pic+"."+imgtype},function(msg){
			if(msg==1){
				var test = $('#anwe1').text();
				var strs = test.split(pic+'.'+imgtype+',');
				var newstrs = strs[0]+strs[1];
				var test_back = $('#'+tid+'_img').text();
				var strs_back = test_back.split(pic+'.'+imgtype+',');
				$('#'+tid+'_img').text(strs_back[0]+strs_back[1]);
				$('#anwe1').text(newstrs);
				$('#'+pic).remove();
				if(newstrs==""){
					$(".files").css("display","none");
				}
				layer.alert('删除成功！', 9,'温馨提示');
				
				//showimg.empty();
				//progress.hide();
			}else{
				layer.alert(msg,8,'温馨提示');
				 
			}
		});
		
		}
		
		