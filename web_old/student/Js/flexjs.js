// JavaScript Document
 
 

//商务通 CSS 开始

document.writeln("<style type=\"text/css\">");
document.writeln("/* 格式化 */");
document.writeln("img { border: none; }");
document.writeln("#LRdiv0,#LRdiv1,#LRdiv2,#LRfloater0,#divM,#LR_Flash,#BDBridgeWrap{ display: none;}");
document.writeln("#divR{position: fixed;z-index: 214748364;}");
document.writeln("#divR{top:150px;_position: absolute;_top:expression(offsetParent.scrollTop+200);}");
document.writeln("/* 格式化 */");
document.writeln("/*  swtBg   */");
document.writeln("#swtBg {width: 100%;height: 100%;background-color: #CCCCCC;_position: absolute;_top:expression(offsetParent.scrollTop+0);top: 0;left: 0;opacity: 0.7;filter: alpha(opacity=70) !important;z-index: 3000;}");
document.writeln("/*  swtBg  */");
document.writeln("/*  divR  */");
document.writeln("#divR { width: 50px; height: 274px;background: url(images/gtswt.png) 0 0 no-repeat;}");
document.writeln("#divR a{ display: block; width: 50px; height: 55px;background:#f0f0f0 url(images/gtswt.png) 0 0 no-repeat; margin-bottom: 1px; position:relative}");
document.writeln("#divR a:hover{background-color:#e0e0e0}");
document.writeln("#divR a.sendweix img{display:none;position:absolute;left:50px; top:-45px;}");
document.writeln("#divR a:hover.sendweix img{display:block;}");
document.writeln("");
document.writeln("#divR .backto_top{ height: 50px; bottom: 0; cursor: pointer; background: none; }");
document.writeln("#divR .backto_top:hover{ background:#e0e0e0; opacity:0.5}");
document.writeln("#divRsjs{display:block;width:20px; height:16px;border-radius:45%; background-color:#e0e0e0; position:absolute;right:4px; top:4px; font-family:arial;font-size:12px; color:#FFF; text-align:center;line-height:16px; font-style:normal}");
document.writeln("/*  divR  */");
 
document.writeln("</style>");
//商务通 CSS 结束


/************************右侧***********************/
/*返回顶部*/
function pageScroll(){
    //把内容滚动指定的像素数（第一个参数是向右滚动的像素数，第二个参数是向下滚动的像素数）
    window.scrollBy(0,-100);
    //延时递归调用，模拟滚动向上效果速度
    scrolldelay = setTimeout('pageScroll()',10);
//获取scrollTop值，声明了DTD的标准网页取document.documentElement.scrollTop，否则取document.body.scrollTop；因为二者只有一个会生效，另一个就恒为0，所以取和值可以得到网页的真正的scrollTop值
    var sTop=document.documentElement.scrollTop+document.body.scrollTop;
    //判断当页面到达顶部，取消延时代码（否则页面滚动到顶部会无法再向下正常浏览页面）
    if(sTop==0) clearTimeout(scrolldelay);
}


/*悬浮*/
document.writeln("<div id=\"divR\">");
document.writeln("<a href=\"Index.html\" target=\"_self\" title=\"返回首页\"></a>");
document.writeln("<a href=\"work_indexs.html\" title=\"我的作业\" style=\"background-position:0 -56px\" target=\"_blank\"></a>");
document.writeln("<a href=\"mywork_good_list.html\" target=\"_self\" style=\"background-position:0 -112px\" title=\"好题错题\"></a>");
document.writeln("<a href=\"diagnostic_analysis.html\" target=\"_blank\" style=\"background-position:0 -168px\" title=\"诊断分析\"></a>");
document.writeln("<a onclick=\"pageScroll()\" class=\"backto_top\" target=\"_self\" title=\"返回顶部\"></a>");
document.writeln("</div>");

 
 
/************************右侧结束***********************/

 