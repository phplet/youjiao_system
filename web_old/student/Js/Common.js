/// <reference path="~/Scripts/jquery-1.7.2.js"/>
/// <reference path="~/EasyUI/Scripts/Base64.js"/>
/// <reference path="~/EasyUI/Scripts/jquery.Plug.js"/>
var Webversion = "/restAPI3.0";
$(document).ready(function () {
    if ($.cookie('AuthToken') == null) {
        if (parent) {
           // parent.$('#loginWin').window('open');
        }
    }

    $.ajaxSetup({
        statusCode: {
            401: function () {
                parent.$('#loginWin').window('open');
            },
            404: function () {
            },
            403: function () {
                //parent.$('#loginWin').window('open');
            },
            302: function () {
            }
        },
		cache:false
		
    });

    $(document).ajaxSend(function (event, request, settings) {

		
		if ($.cookie("AuthToken") != null && $.trim($.cookie("AuthToken")).length > 0) {
            request.setRequestHeader("Authorization", "Digest " + $.cookie("AuthToken"));
        }

    });
	
	
});

document.write('<script type="text/javascript" src="Js/jquery.Plug.js"></script>');
