// JavaScript Document
function select_meihua(cssid){
	var newSelect = $("#"+cssid);
	 test_namesList();
	newSelect.click(function(e){
		if(this.className == "open"){
			closeSelect(this);
		}else{
			this.className = "open";
			$(this.nextSibling).slideDown("fast");
		}
		e.stopPropagation();
	});
	
	function closeSelect(obj){
		$(obj.nextSibling).slideUp("fast",function(){
			obj.className = "";
		});
	}
	
	$(document).bind("click", function() {
	  	closeSelect(newSelect[0]);
	});

	newSelect.next().click(function(e){
		var src = e.target;
		 
		if(src.tagName == "A"){
			
			var PObj = src.parentNode;
			 
			PObj.previousSibling.innerHTML = src.innerHTML;
			/*var aList = PObj.getElementsByTagName("a");
			for(var i=0;i<aList.length;i++){
				aList[i].className = "";
			}*/
			$(src).siblings().removeClass();
			src.className = "current";
			PObj.nextSibling.value = src.getAttribute("value");
			//执行换内容的事件
			test_namesList();
		}
	});
	
}