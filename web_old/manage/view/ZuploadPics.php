<script>
	function test(){
		if($("input[name=img]").val()==''){
			alert("亲，不要上传空的好不");
			return false;
		}else{return true;}
	}
</script>
<div style="width:100%;height:400px;margin:0;background:#FFF;border:1px solid #00a4ff;color:#0e71a8; text-align:center; line-height:200px;font-size:24px;">
   <span id="">图片上传视图</span>
   <form method="post" action="control/Zuploadimages.php" enctype="multipart/form-data" onsubmit=" return test();">
   		选择上传图片<input type="file" name="img"> <input type="submit" value="上传">
   </form>
</div>