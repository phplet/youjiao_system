/**
 * Theme Plugins
 * @author ZhangHuihua@msn.com
 */
(function($){
	$.fn.extend({
		theme: function(options){
		    var op = $.extend({ themeBase: "themes", headerThemeBase: "Content" }, options);
			/*var _themeHref = op.themeBase + "/#theme#/easyui.css";
		    var _headerThemeHref = op.headerThemeBase + "/#theme#/header.css";*/
		    var _themeHref = "/hx_manages/"+op.themeBase + "/#theme#/easyui.css";
		    var _headerThemeHref = "/hx_manages/"+op.headerThemeBase + "/#theme#/header.css";
			return this.each(function(){
				var jThemeLi = $(this).find(">li[theme]");
				
				var setTheme = function(themeName){
					/*var sss = $("head").find("link[href$='easyui.css']").attr("href");
					alert(sss);*/
				    $("head").find("link[href$='easyui.css']").attr("href", _themeHref.replace("#theme#", themeName));
				    $("head").find("link[href$='header.css']").attr("href", _headerThemeHref.replace("#theme#", themeName));
					jThemeLi.find(">div").removeClass("selected");
					jThemeLi.filter("[theme="+themeName+"]").find(">div").addClass("selected");
					
				    //¥¶¿Ìiframe
					$("iframe").each(function () {
					    var iframeDOM = $(this).get(0).document || $(this).get(0).contentDocument;
					    $(iframeDOM).find("head").find("link[href$='easyui.css']").attr("href", _themeHref.replace("#theme#", themeName));
					});

					if ($.isFunction($.cookie)) $.cookie("easyui_theme", themeName);
				}
				
				jThemeLi.each(function(index){
					var $this = $(this);
					var themeName = $this.attr("theme");
					$this.addClass(themeName).click(function(){
						setTheme(themeName);
					});
				});
					
				if ($.isFunction($.cookie)){
				    var themeName = $.cookie("easyui_theme");
					if (themeName) {
						 
						setTheme(themeName);
						 
					}
				}
				
			});
		}
	});

	$(document).ready(function () {
	    /*var _themeHref = "themes/#theme#/easyui.css";
	    var _headerThemeHref = "Content/#theme#/header.css";*/
		var _themeHref = "/hx_manages/themes/#theme#/easyui.css";
	    var _headerThemeHref = "/hx_manages/Content/#theme#/header.css";
	    var setTheme = function (themeName) {
	        $("head").find("link[href$='easyui.css']").attr("href", _themeHref.replace("#theme#", themeName));
	        $("head").find("link[href$='header.css']").attr("href", _headerThemeHref.replace("#theme#", themeName));
			
		};
	    if ($.isFunction($.cookie)) {
	        var themeName = $.cookie("easyui_theme");
	        if (themeName) {
	            setTheme(themeName);
	        }
	    }
	});

})(jQuery);
