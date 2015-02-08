	$(function() {
		var icons = {
			header: "ui-icon-circle-arrow-e",
			headerSelected: "ui-icon-circle-arrow-s"
		};
		$( "#accordion" ).accordion({
			icons: icons,
			autoHeight: false
			
		});
		
 		$(window).resize(function() {
		  $( "#main" ).css("width",( $(window).width() -232)+"px");
		  $( "#content" ).css("width",( $(window).width() -232)+"px");
		  $( "#content" ).css("hieght",( $(window).height() -50)+"px");
		});
		
		$( "#main" ).css("width",( $(window).width() -232)+"px");
		 
		$( "#accordion button" ).button({
            icons: {
                primary: "ui-icon-gear"
            },
            text: true
        });

		$( "#accordion button" ).click(function(){
			$("#content").html('<div style="width:32px;height:32px;margin:auto;margin-top:'+( ($(window).height() - 82)/2 )+'px"><img src="images/temp_08091512529506.gif"></div>');
			$("#content").load('control/' + $(this).attr("id") + '.php');
		});
	});