/**
 * Created by tonyjiang on 15/2/8.
 */
require.config({
    baseUrl: 'js',
    paths : {
        //text插件
        text : 'lib/require-text',
        //jQuery
        jquery : 'lib/jquery',

        dataTable : 'lib/jquery.dataTables.min'
    }
});

require([
    'modules/Header',
    'modules/nav',
    'page/CenterZoneManager'
] , function(Header , Nav , CenterZoneManager){

    var header = new Header();
    header.init();

    $('.header').append(header.domNode);

    var nav = new nav();
    nav.init();

    $('.nav').append(nav.domNode);

    var mod = new CenterZoneManager();

    mod.on('initComplete' , function(){
        console.log('catch index init complete event');
    });

    mod.init();

    $('.content').append(mod.domNode);



    //1.实例化header,进行身份验证
    //2.实例化nav

    //根据URL寻找对应的page组件,然后实例化
    //1.loading
    //2.监听page对象ready
    //3.render

});