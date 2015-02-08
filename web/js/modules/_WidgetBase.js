/**
 * Created by tonyjiang on 15/2/8.
 */
define([
    'modules/_Extends',
    'modules/_Evented',
    'Util'
] , function(_Extends , _Evented , util){

    //组件基础类
    var _WidgetBase = function(){
        //模板html
        this.templates = '';
        //dom借点
        this.domNode = '';

        //初始化
        this.init = function(){
            this.domNode = document.createElement('documentFragment');
            this.domNode.innerHTML = this.templates;
            console.log('widgetBase init');
        };

        //销毁
        this.destroy = function(){};
    };

    _WidgetBase = _WidgetBase.extend(_Extends , _Evented);

    return _WidgetBase;

});