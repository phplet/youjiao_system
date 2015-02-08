<script>
	$( "#activebtn" ).click(function(){
		$("#A8").html('<img src="images/temp_08091512529506.gif">');
		$("#A8").load('control/getActive.php',{"uname":$("#uanme").attr("value")});
	});

</script>
<p>输入待激活帐号 <input type="text" id="uanme" /><button id="activebtn" class="lbtn">激活</button></p>
<div style="width:100%;height:400px;margin:0;background:#b7e5ff;border:1px solid #00a4ff;color:#0e71a8; text-align:center; line-height:200px;font-size:24px;">
   <span id="A8"></span>
</div>

