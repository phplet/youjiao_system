/**
 * Created by tonyjiang on 15/2/8.
 */
define([
    'modules/_Extends',
    'modules/_Evented',
    'modules/Util',
    'jquery'
] , function(_Extends , _Evented , Util , $){

    //组件基础类
    var _WidgetBase = function(){
        //模板html
        this.templates = '';
        //dom借点
        this.domNode = '';

        this._beforeRender = function(){
            this.domNode = document.createDocumentFragment();
            this.domNode.appendChild($(this.templates)[0]);
        };

        //初始化
        this.init = function(){
            this._beforeRender();
            //$(this.domNode).html(this.templates);
            console.log('widgetBase init');
        };

        //销毁
        this.destroy = function(){};
    };

    _WidgetBase = _WidgetBase.extend(_Extends , _Evented);

    return _WidgetBase;

});