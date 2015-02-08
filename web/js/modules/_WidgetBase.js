/**
 * Created by tonyjiang on 15/2/8.
 */
define([
    'modules/_Extends',
    'modules/_Evented',
    'modules/util'
] , function(_Extends , _Evented , util){

    //组件基础类
    var _WidgetBase = function(){
        //模板html
        this.templates = '';
        //dom借点
        this.domNode = '';
        //初始化
        this.init = function(){};
        //销毁
        this.destroy = function(){};
    };

    _WidgetBase = _WidgetBase.extend(_Evented);

    return _WidgetBase;

});