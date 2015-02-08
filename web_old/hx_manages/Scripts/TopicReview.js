


$(document).ready(function () {


    $("#tbItemType td").hover(function () {//鼠标放上放下
        $(this).addClass("tdRed"); //这个tdRed必须有这个类
    }, function () {
        $(this).removeClass("tdRed");
    });



    //    var answer = [{ "content": " A" }, { "content": " B" }, { "content": " C" }, { "content": " D"}];

    //    $("#Panswer p").click(
    //     function () {
    //         alert("aaaa");
    //         var index = $(this).index();
    //         $("#DivAnswer").show("fast", function () {
    //             var answerVal = contentList[index].content;
    //             $(this).html(answerVal);
    //             $(this).hide("fast");

    //         });
    //     });



    $(".Panswer a").toggle(
                 function () {
                     $(this).parent().parent().next("div").show();
                 },
                function () {

                    $(this).parent().parent().next("div").hide();
                });










});         //reday的结束标签



//    function answerShow(divAnswer) {//调用的时候，这个函数里面传的参数（divAnswer）是要显示的答案的div的ID
//        $('#' + divAnswer).show();
//};



function ajump() {

    document.location.href = "PaperSort.html"

};