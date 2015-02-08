// JavaScript Document
 
 $(document).ready(function(){
     $("ul.tab_menu li:first-child").addClass("current");
     $("div.tab_content").find("div.layout:not(:first-child)").hide();
     $("div.tab_content div.layout").attr("id", function(){return idNumber("No")+ $("div.tab_content div.layout").index(this)});
     $("ul.tab_menu li").click(function(){
         var c = $("ul.tab_menu li");
         var index = c.index(this);
         var p = idNumber("No");
         show(c,index,p);
     });
     
     function show(controlMenu,num,prefix){
         var content= prefix + num;
         $('#'+content).siblings().hide();
         $('#'+content).show();
         controlMenu.eq(num).addClass("current").siblings().removeClass("current");
     };
 
     function idNumber(prefix){
         var idNum = prefix;
         return idNum;
     };
 });

