<script src="js/jquery_ui/ui/jquery.ui.datepicker.js"></script>
<script type="text/javascript" src="js/jquery_ui/ui/i18n/jquery.ui.datepicker-zh-CN.js"></script>
<script>
    $(function() {
        $( "#datepicker" ).datepicker({
			dateFormat: 'yy-mm-dd',
			onSelect: function(dateText, inst) {
				$("#A8").html('<img src="images/temp_08091512529506.gif">');
				$("#A8").load('control/getDaycount.php',{"date":$("#datepicker").attr("value")});	
			}
		});
    });
</script>
<p>选择统计日期 <input type="text" id="datepicker" /></p>
<div style="width:100%;height:400px;margin:0;background:#b7e5ff;border:1px solid #00a4ff;color:#0e71a8; text-align:center; line-height:200px;font-size:24px;">
   <span id="A8"></span>
</div>

