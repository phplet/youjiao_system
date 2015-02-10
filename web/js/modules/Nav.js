/**
 * Created by tonyjiang on 15/2/8.
 */
define([
    'jquery',
    'modules/_WidgetBase'
    //'text!./templates/nav.html'
] , function($ , _WidgetBase , templates){


    var navData = [
        '校长管理'
    ];

    var Nav = function(){
        this.templates = templates;

        this._beforeRender = function(){
            this._initHTML();
            this.inherited(arguments);
        };

        this.init = function(){
            this.inherited(arguments);
        };

        this._initHTML = function(){
            var html = '<ul>';
            for(var i = 0, len = navData.length ; i < len ; i++){
                html += '<li>'+navData[i]+'</li>';
            }

            html += '</ul>';
            this.templates = html;
        };


    };
    Nav = Nav.extend(_WidgetBase);
    return Nav;
});