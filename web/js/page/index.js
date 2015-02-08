/**
 * Created by tonyjiang on 15/2/8.
 * index页面
 */
define([
   'jquery',
    'modules/util',
    'modules/_Extends',
    'modules/_WidgetBase'
] , function($ , util ,_extend , _WidgetBase){

    var Index = function(){

        this.templates = [
            '<div>' +
                '<input type="button" id="btn1" value="click me" />',
            '</div>'
        ].join('');


        this.wantshow = 'wo jiushi nei rong';

        this.init = function(){

            this.inherited(arguments);
console.log(this.domNode);
            console.log('index is init');
            this._initEvent();
            this.emit('initComplete');

        };

        this._initEvent = function(){
            $(this.domNode).delegate('#btn1' , 'click' , util.hitch(this , this._btnClickHandler))
        };

        this._btnClickHandler = function(){
            alert(this.wantshow);
        }


    };

    Index = Index.extend(_WidgetBase);

    return Index;



});