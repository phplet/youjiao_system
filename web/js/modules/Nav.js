/**
 * Created by tonyjiang on 15/2/8.
 */
define([
    'jquery',
    'modules/_WidgetBase'
    //'text!./templates/nav.html'
] , function($ , _WidgetBase , templates){


    var navData = [
        {title : '首页' , module : ''},
        {title : '教务设置' , module : ''},
        {title : '校区管理' , module : '/CenterZoneManager'},
        {title : '校长管理' , module : ''},
        {title : '校长管理' , module : ''}
    ];

    var Nav = function(){
        this.templates = templates;

        this._beforeRender = function(){
            this._initData();
            this._initHTML();
            this.inherited(arguments);
        };

        this.init = function(){
            this.inherited(arguments);

            this._initEvents();

        };

        this._initData = function(){
            for(var i = 0, len = navData.length ; i < len ; i++){
                if(window.location.pathname == navData[i].module){
                    navData[i].selected = true;
                    break;
                }
            }
        };

        this._initHTML = function(){
            var html = '<ul class="nav nav-pills nav-stacked">';
            for(var i = 0, len = navData.length ; i < len ; i++){
                html += [
                    '<li role="presentation" class="'+(navData[i].selected ? 'active' : '')+'" module="'+navData[i].module+'">' +
                        '<a href="'+navData[i].module+'">'+navData[i].title+'</a>' +
                    '</li>'
                ].join('') ;
            }

            html += '</ul>';
            this.templates = html;
        };

        this._initEvents = function(){
            var domNode = this.domNode;
            $(this.domNode).delegate('li' , 'click' , function(){
                $(domNode).find('.active').removeClass('active');
                $(this).addClass('active');

                console.log($(this).find('a').attr('module'));
            });
        }


    };
    Nav = Nav.extend(_WidgetBase);
    return Nav;
});