/**
 * Created by tonyjiang on 15/2/8.
 */
define([
    'jquery',
    'modules/_WidgetBase',
    'text!./templates/header.html'
] , function($ , _WidgetBase , templates){


    var Header = function(){
        this.templates = templates;

        this.init = function(){
            this.inherited(arguments);
        };

    };
    Header = Header.extend(_WidgetBase);
    return Header;
});