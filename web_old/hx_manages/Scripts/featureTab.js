
function ChangeThisTab(tabName, url) {
	
	
	
    var tabobject = $('#maintabs');
    var roannumber = parseInt(1000000 * Math.random());
    if (url.indexOf("?") < 0) {
        url = url + "?r=" + roannumber;
    }
    else {
        url = url + "&r=" + roannumber;
    }
	//window.location='Teacher_Ma01.html';
	 
	
   if (tabobject.tabs("exists", tabName)) {
	    
        tabobject.tabs('select', tabName);
        var currTab = $('#maintabs').tabs('getSelected');    //获取选中的标签项
		 
        var iframeTab = currTab.find('iframe')[0];
        iframeTab.contentWindow.location.href = url;
    }
    else { 
		 
	    $(".tabs li").each(function (i, n) {
            	var title = $(n).text(); 
				if($(n).attr("class")=='tabs-selected'){
					$(".tabs").children().eq(i).remove();	
				}
                $('#maintabs').tabs('close', title);
				$('#maintabs').tabs('close', "学务报表");
				$('#maintabs').tabs('close', "校区管理");
				 
            
        }); 
		
		tabobject.tabs('add', {
            title: tabName,
            content: '<iframe frameborder="0" width="100%" height="100%" src="' + url + '"></iframe>',
            closable: false,
            cache: true
        });
		 
		 
    }
	$('.tabs-title').parent().parent().attr("class","tabs-selected");
	/*var test_str= $(".tree-node-selected").find(".tree-title").html();	 
	if(test_str!=null){
	$(".tabs-selected").find(".tabs-title").html(test_str);
	}*/
	
};


 

function CloseTab(tabName) {
    var tabobject = $('#maintabs');
    if (tabobject.tabs("exists", tabName)) {
        tabobject.tabs("close", tabName);
		 
    }
};

$(document).ready(function () {
    /*为选项卡绑定右键*/
    $(".tabs li").live('contextmenu', function (e) {
        /* 选中当前触发事件的选项卡 */
        var subtitle = $(this).text();
        $('#maintabs').tabs('select', subtitle);

        //显示快捷菜单
        $('#menu').menu('show', {
            left: e.pageX,
            top: e.pageY
        });

        return false;
    });
});

$(document).ready(function () {
    //刷新
    $("#m-refresh").click(function () {
        var currTab = $('#maintabs').tabs('getSelected');    //获取选中的标签项
        var iframeTab = currTab.find('iframe')[0];
        iframeTab.contentWindow.location.href = iframeTab.src;
    });

    //关闭所有
    $("#m-closeall").click(function () {
        $(".tabs li").each(function (i, n) {
            var title = $(n).text();
            $('#maintabs').tabs('close', title);
        });
    });

    //除当前之外关闭所有
    $("#m-closeother").click(function () {
        var currTab = $('#maintabs').tabs('getSelected');
        currTitle = currTab.panel('options').title;

        $(".tabs li").each(function (i, n) {
            var title = $(n).text();

            if (currTitle != title) {
                $('#maintabs').tabs('close', title);
            }
        });
    });

    //关闭当前
    $("#m-close").click(function () {
        var currTab = $('#maintabs').tabs('getSelected');
        currTitle = currTab.panel('options').title;
        $('#maintabs').tabs('close', currTitle);
    });
});