<script type="text/javascript">
function showtime () {
var now = new Date();
var hours = now.getHours();
var minutes = now.getMinutes();
var seconds = now.getSeconds();
var timeValue = "" +((hours >= 12) ? "下午 " : "上午 " );
timeValue += ((hours >12) ? hours -12 :hours);
timeValue += ((minutes < 10) ? ":0" : ":") + minutes;
timeValue += ((seconds < 10) ? ":0" : ":") + seconds;
return timeValue}
</script>
<div style="width:100%;height:400px;margin:0;background:#b7e5ff;border:1px solid #00a4ff;color:#0e71a8; text-align:center; line-height:200px;font-size:24px;">
   <span id="A8">当前题库注册总人数<?=$mb->rs['total']?>人,激活人数<?=$mb->rs['ytotal']?>人</span>
</div>