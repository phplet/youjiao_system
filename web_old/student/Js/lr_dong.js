// JavaScript Document
var Speed_1 = 10; //速度(毫秒)
var Space_1 = 20; //每次移动(px)
var PageWidth_1 = 116 * 3; //翻页宽度
var interval_1 = 7000; //翻页间隔
var fill_1 = 0; //整体移位
var MoveLock_1 = false;
var MoveTimeObj_1;
var MoveWay_1="right";
var Comp_1 = 0;
var AutoPlayObj_1=null;
function GetObj(objName){if(document.getElementById){return eval('document.getElementById("'+objName+'")')}else{return eval('document.all.'+objName)}}
//function AutoPlay_1(){clearInterval(AutoPlayObj_1);AutoPlayObj_1=setInterval('ISL_GoDown_1();ISL_StopDown_1();',interval_1)}
function ISL_GoUp_1(){if(MoveLock_1)return;clearInterval(AutoPlayObj_1);MoveLock_1=true;MoveWay_1="left";MoveTimeObj_1=setInterval('ISL_ScrUp_1();',Speed_1);}
function ISL_StopUp_1(){if(MoveWay_1 == "right"){return};clearInterval(MoveTimeObj_1);if((GetObj('ISL_Cont_1').scrollLeft-fill_1)%PageWidth_1!=0){Comp_1=fill_1-(GetObj('ISL_Cont_1').scrollLeft%PageWidth_1);CompScr_1()}else{MoveLock_1=false}
//AutoPlay_1()
}
function ISL_ScrUp_1(){if(GetObj('ISL_Cont_1').scrollLeft<=0){GetObj('ISL_Cont_1').scrollLeft=GetObj('ISL_Cont_1').scrollLeft+GetObj('List1_1').offsetWidth}
GetObj('ISL_Cont_1').scrollLeft-=Space_1}
function ISL_GoDown_1(){clearInterval(MoveTimeObj_1);if(MoveLock_1)return;clearInterval(AutoPlayObj_1);MoveLock_1=true;MoveWay_1="right";ISL_ScrDown_1();MoveTimeObj_1=setInterval('ISL_ScrDown_1()',Speed_1)}
function ISL_StopDown_1(){if(MoveWay_1 == "left"){return};clearInterval(MoveTimeObj_1);if(GetObj('ISL_Cont_1').scrollLeft%PageWidth_1-(fill_1>=0?fill_1:fill_1+1)!=0){Comp_1=PageWidth_1-GetObj('ISL_Cont_1').scrollLeft%PageWidth_1+fill_1;CompScr_1()}else{MoveLock_1=false}
//AutoPlay_1()
}
function ISL_ScrDown_1(){if(GetObj('ISL_Cont_1').scrollLeft>=GetObj('List1_1').scrollWidth){GetObj('ISL_Cont_1').scrollLeft=GetObj('ISL_Cont_1').scrollLeft-GetObj('List1_1').scrollWidth}
GetObj('ISL_Cont_1').scrollLeft+=Space_1}
function CompScr_1(){if(Comp_1==0){MoveLock_1=false;return}
var num,TempSpeed=Speed_1,TempSpace=Space_1;if(Math.abs(Comp_1)<PageWidth_1/2){TempSpace=Math.round(Math.abs(Comp_1/Space_1));if(TempSpace<1){TempSpace=1}}
if(Comp_1<0){if(Comp_1<-TempSpace){Comp_1+=TempSpace;num=TempSpace}else{num=-Comp_1;Comp_1=0}
GetObj('ISL_Cont_1').scrollLeft-=num;setTimeout('CompScr_1()',TempSpeed)}else{if(Comp_1>TempSpace){Comp_1-=TempSpace;num=TempSpace}else{num=Comp_1;Comp_1=0}
GetObj('ISL_Cont_1').scrollLeft+=num;setTimeout('CompScr_1()',TempSpeed)}}

function picrun_ini(){
GetObj("List2_1").innerHTML=GetObj("List1_1").innerHTML;
GetObj('ISL_Cont_1').scrollLeft=fill_1>=0?fill_1:GetObj('List1_1').scrollWidth-Math.abs(fill_1);
GetObj("ISL_Cont_1").onmouseover=function(){clearInterval(AutoPlayObj_1)}
//GetObj("ISL_Cont_1").onmouseout=function(){AutoPlay_1()}
//AutoPlay_1();
}

var Speed_2 = 10; //速度(毫秒)
var Space_2 = 20; //每次移动(px)
var PageWidth_2 = 116 * 3; //翻页宽度
var interval_2 = 7000; //翻页间隔
var fill_2 = 0; //整体移位
var MoveLock_2 = false;
var MoveTimeObj_2;
var MoveWay_2="right";
var Comp_2 = 0;
var AutoPlayObj_2=null;
function GetObj(objName){if(document.getElementById){return eval('document.getElementById("'+objName+'")')}else{return eval('document.all.'+objName)}}
//function AutoPlay_2(){clearInterval(AutoPlayObj_2);AutoPlayObj_2=setInterval('ISL_GoDown_2();ISL_StopDown_2();',interval_2)}
function ISL_GoUp_2(){if(MoveLock_2)return;clearInterval(AutoPlayObj_2);MoveLock_2=true;MoveWay_2="left";MoveTimeObj_2=setInterval('ISL_ScrUp_2();',Speed_2);}
function ISL_StopUp_2(){if(MoveWay_2 == "right"){return};clearInterval(MoveTimeObj_2);if((GetObj('ISL_Cont_2').scrollLeft-fill_2)%PageWidth_2!=0){Comp_2=fill_2-(GetObj('ISL_Cont_2').scrollLeft%PageWidth_2);CompScr_2()}else{MoveLock_2=false}
//AutoPlay_2()
}
function ISL_ScrUp_2(){if(GetObj('ISL_Cont_2').scrollLeft<=0){GetObj('ISL_Cont_2').scrollLeft=GetObj('ISL_Cont_2').scrollLeft+GetObj('List1_2').offsetWidth}
GetObj('ISL_Cont_2').scrollLeft-=Space_2}
function ISL_GoDown_2(){clearInterval(MoveTimeObj_2);if(MoveLock_2)return;clearInterval(AutoPlayObj_2);MoveLock_2=true;MoveWay_2="right";ISL_ScrDown_2();MoveTimeObj_2=setInterval('ISL_ScrDown_2()',Speed_2)}
function ISL_StopDown_2(){if(MoveWay_2 == "left"){return};clearInterval(MoveTimeObj_2);if(GetObj('ISL_Cont_2').scrollLeft%PageWidth_2-(fill_2>=0?fill_2:fill_2+1)!=0){Comp_2=PageWidth_2-GetObj('ISL_Cont_2').scrollLeft%PageWidth_2+fill_2;CompScr_2()}else{MoveLock_2=false}
//AutoPlay_2()
}
function ISL_ScrDown_2(){if(GetObj('ISL_Cont_2').scrollLeft>=GetObj('List1_2').scrollWidth){GetObj('ISL_Cont_2').scrollLeft=GetObj('ISL_Cont_2').scrollLeft-GetObj('List1_2').scrollWidth}
GetObj('ISL_Cont_2').scrollLeft+=Space_2}
function CompScr_2(){if(Comp_2==0){MoveLock_2=false;return}
var num,TempSpeed=Speed_2,TempSpace=Space_2;if(Math.abs(Comp_2)<PageWidth_2/2){TempSpace=Math.round(Math.abs(Comp_2/Space_2));if(TempSpace<1){TempSpace=1}}
if(Comp_2<0){if(Comp_2<-TempSpace){Comp_2+=TempSpace;num=TempSpace}else{num=-Comp_2;Comp_2=0}
GetObj('ISL_Cont_2').scrollLeft-=num;setTimeout('CompScr_2()',TempSpeed)}else{if(Comp_2>TempSpace){Comp_2-=TempSpace;num=TempSpace}else{num=Comp_2;Comp_2=0}
GetObj('ISL_Cont_2').scrollLeft+=num;setTimeout('CompScr_2()',TempSpeed)}}
function picrun_ini_2(){
GetObj("List2_2").innerHTML=GetObj("List1_2").innerHTML;
GetObj('ISL_Cont_2').scrollLeft=fill_2>=0?fill_2:GetObj('List1_2').scrollWidth-Math.abs(fill_2);
GetObj("ISL_Cont_2").onmouseover=function(){clearInterval(AutoPlayObj_2)}
//GetObj("ISL_Cont_2").onmouseout=function(){AutoPlay_2()}
//AutoPlay_2();
}