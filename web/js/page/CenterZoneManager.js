/**
 * Created by tonyjiang on 15/2/10.
 */
define([
    'jquery',
    'modules/Util',
    'modules/_Extends',
    'modules/_WidgetBase',
    'text!./templates/centerZoneManager.html',

    'modules/Table',
    'modules/Select',

    'css!cssPath/CenterZoneManager.css'
], function ($, Util, _extend, _WidgetBase, templates , Table , Select) {

    var tableData = [
        ['测试校区' , '测试主任' , '北京市' , '北京测试小区1' , '2015-01-13' , '' , '1' , '0' , '已启用<sup>1</sup>']
    ];

    var CenterZoneManager = function () {

        this.templates = templates;


        this.init = function () {
            this.inherited(arguments);
            this._initComps();
            this._initEvents();
            this.emit('initComplete');

        };

        this._initComps = function(){


            this.selectComps = new Select({
                label : '状态',
                options : [
                    {label : '启用' , value :'1'},
                    {label : '禁用' , value : '0'}
                ]
            });
            this.selectComps.parentNode = $('.search-bar');
            this.selectComps.init();

            var tableParams = {
                "columns" : [
                    {'title' : '校区名称'},
                    {'title' : '负责人'},
                    {'title' : '所在省市'},
                    {'title' : '校区地址'},
                    {'title' : '建立时间'},
                    {'title' : '注销时间'},
                    {'title' : '学生数'},
                    {'title' : '教室数'},
                    {'title' : '状态'}
                ],
                "data" : tableData
            };

            this.tableComps = new Table(tableParams);
            //console.log(this.tableComps);
            this.tableComps.parentNode = $('.center-zone-table');
            this.tableComps.init();


        };

        this._initEvents = function(){
            this.tableComps.on('rowSelect' , function(arg){
                console.log('row selected : ' , arg);
            });

            $('#test1').click(Util.hitch(this , function(){

                this.tableComps.add(tableData).redraw();
            }));
        }


    };

    CenterZoneManager = CenterZoneManager.extend(_WidgetBase);

    return CenterZoneManager;


});