/**
 * Created by tonyjiang on 15/2/8.
 */
require.config({
    baseUrl: 'js',
    paths : {
        //text插件
        text : 'lib/require-text',
        //css插件
        css : 'lib/require-css.min',
        cssPath : '/css',
        //jQuery
        jquery : 'lib/jquery',
        //bootstrap
        bootstrap : 'lib/bootstrap.min',


        dataTable : 'lib/jquery.dataTables.min',
        'dataTable.bootstrap' : 'lib/dataTables.bootstrap'
    }
});

var pageName = window.location.pathname;
pageName = pageName == '/' ? 'page/index' :  'page' + pageName ;


require([
    'modules/Header',
    'modules/Nav',
    pageName,

    'css!cssPath/bootstrap.min.css',
    'css!cssPath/dataTables.bootstrap.css'
] , function(Header , Nav , Page){

    $(document).ready(function(){

        var header = new Header();
        header.parentNode = $('.header');
        header.init();

        var nav = new Nav();
        nav.parentNode = $('.nav');
        nav.init();

        var mod = new Page();
        mod.parentNode = $('.content')[0];

        //mod.on('initComplete' , function(){
        //    console.log('catch index init complete event');
        //});

        mod.init();

    });



    //$('.content').append(mod.domNode);



    //1.实例化header,进行身份验证
    //2.实例化nav

    //根据URL寻找对应的page组件,然后实例化
    //1.loading
    //2.监听page对象ready
    //3.render

});