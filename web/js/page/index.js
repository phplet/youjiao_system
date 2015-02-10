/**
 * Created by tonyjiang on 15/2/8.
 * index页面
 */
define([
    'jquery',
    'modules/Util',
    'modules/_Extends',
    'modules/_WidgetBase',
    'text!./templates/index.html'
], function ($, Util, _extend, _WidgetBase, templates) {

    var Index = function () {

        this.templates = templates;


        this.wantshow = 'wo jiushi nei rong';

        this.init = function () {

            this.inherited(arguments);
            console.log(this.domNode);
            console.log('index is init');
            this._initEvent();
            this.emit('initComplete');

        };

        this._initEvent = function () {
            $(this.domNode).delegate('#btn1', 'click', Util.hitch(this, this._btnClickHandler))
        };

        this._btnClickHandler = function () {
            alert(this.wantshow);
        }


    };

    Index = Index.extend(_WidgetBase);

    return Index;


});