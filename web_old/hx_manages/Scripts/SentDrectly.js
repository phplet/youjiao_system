


$(document).ready(function () {
   
function TdBasicInformation(){
	 document.location.href = "TestPaper.html";
}
function TdTopicInformation(){
	 document.location.href = "SelectSubjects.html";
	//$("#labHuanSe").css('color','blue');
}



function TdBrowse(){
	document.location.href = "ShouDoPaperSort.html";
	//$("#labYuLan").css('color','blue');
}






});



 function NextSendwer(){
	
	 $('#confirm').hide();
	 $('#SentDrectly').show();
	$("#labHuanSe").css('color','blue');
}
 

 
function StudentsChoose(){
	$('#SentDrectly').hide();
	$('#confirm').show();
}


function SendTerminal(){
	$('#confirm').hide();
	$('#SentDrectly').show();
	$("#labHuanSe").css('color','blue');
} 


 function Sendok(){
	
	document.location.href = "GroupRollCenter.html";
}
