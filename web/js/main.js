/**
 * Created by tonyjiang on 15/2/8.
 */
require.config({
    baseUrl: 'js',
    paths : {
        //text插件
        text : 'lib/require-text',
        //jQuery
        jquery : 'lib/jquery'
    }
});

require([
    'page/index'
] , function(index){

    var mod = new index();

    mod.on('initComplete' , function(){
        console.log('catch index init complete event');
    });

    mod.init();

    $('body').append(mod.domNode);



    //1.实例化header,进行身份验证
    //2.实例化nav

    //根据URL寻找对应的page组件,然后实例化
    //1.loading
    //2.监听page对象ready
    //3.render

});