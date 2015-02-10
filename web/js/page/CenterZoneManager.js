/**
 * Created by tonyjiang on 15/2/10.
 */
define([
    'jquery',
    'modules/Util',
    'modules/_Extends',
    'modules/_WidgetBase',
    'text!./templates/centerZoneManager.html',

    'modules/Table'
], function ($, Util, _extend, _WidgetBase, templates , Table) {

    var CenterZoneManager = function () {

        this.templates = templates;


        this.init = function () {
            this.inherited(arguments);
            this._initComps();
            this.emit('initComplete');

        };

        this._initComps = function(){
            this.tableComps = new Table();
            this.tableComps.init();
            $(this.domNode).find('.center-zone-table').append(this.tableComps.domNode);
        }


    };

    CenterZoneManager = CenterZoneManager.extend(_WidgetBase);

    return CenterZoneManager;


});