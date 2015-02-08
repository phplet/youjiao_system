var version_level = $.cookie("version_level");
window.string_data = {};  //所有调转页面的大数据量的内容
if(version_level!=""&&version_level!=null){
	version_level = Base64.decode(version_level);
	if(version_level==1){
		document.write ("<script type='text\/javascript' src='Scripts\/Permission_xuexiao.js'><\/script><script type='text\/javascript' src='DataDefine\/feature_xuexiao.js'><\/script>");
		$(document).append("<script type='text/javascript' src='Scripts/Permission_xuexiao.js'</script>");
		$(document).append("<script type='text/javascript' src='DataDefine/feature_xuexiao.js'</script>"); 
		 
	}else{
		document.write ("<script type='text\/javascript' src='Scripts\/Permission.js'><\/script><script type='text\/javascript' src='DataDefine\/feature.js'><\/script>");
		$(document).append("<script type='text/javascript' src='Scripts/Permission.js'</script>");
		$(document).append("<script type='text/javascript' src='DataDefine/feature.js'</script>"); 
	}
}
 