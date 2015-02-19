/**
 * Created by tonyjiang on 15/2/19.
 */
define([
    'jquery',
    'bootstrap',
    'modules/_WidgetBase',
    'modules/Util',

    'text!./templates/Select.html',
    'css!cssPath/bootstrap-select.min.css',

    'lib/bootstrap-select'

],function($ , bootstrap , _WidgetBase , Util , templates){

    var Select = function(params){

        this.label = '';

        this.options = [];

        Util.mixin(this , params);

        this.templates = templates;

        this.init = function(){
            this.inherited(arguments);

            this._initData();

            console.log(this.domNode);

            $(this.domNode).selectpicker();

        };

        this._initData = function(){
            var dropHTML = '';
            for(var i = 0, len = this.options.length ; i < len ; i++){
                dropHTML += [
                    '<option value="'+this.options[i].value+'">'+this.options[i].label+'</option>'
                ].join('');
            }
            $(this.domNode).html(dropHTML);
        };

        //this._initDropDown = function(){
        //    console.log(this.options);
        //    var dropHTML = '';
        //    for(var i = 0, len = this.options.length ; i < len ; i++){
        //        dropHTML += [
        //            '<li role="presentation">' +
        //                '<a role="menuitem" tabindex="'+i+'" href="javascript:void(0);">'+this.options[i].label+'</a>' +
        //            '</li>'
        //        ].join('');
        //    }
        //    console.log(dropHTML);
        //
        //    $(this.domNode).find('.dropdown-menu').html(dropHTML);
        //
        //};




    };

    Select = Select.extend(_WidgetBase);
    return Select;

});