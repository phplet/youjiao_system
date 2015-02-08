<?php
	header("Cache-Control: no-cache, must-revalidate");
?>
<script>
	$.ajaxSetup ({
		cache: false 
	});

	$("#ct").load('control/GgetPicManger.php');
	function deletePic(id){
		$.ajaxSetup ({
			cache: false 
		});
		$("#ct").load('control/GgetPicManger.php',{id:id});
	}
</script>
<!-- <p>输入待激活帐号 <input type="text" id="uanme" /><button id="activebtn" class="lbtn">激活</button></p> -->
<div id="ct" style="width:100%;height:600px;overflow-y:scroll;margin:0;background:#FFF;border:1px solid #00a4ff;color:#0e71a8; text-align:center; font-size:16px;">


</div>