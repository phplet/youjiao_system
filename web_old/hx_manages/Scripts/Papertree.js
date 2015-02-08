$(document).ready(function () {
    var result = [{ "id": 1, "text": "VisionOnline", "state": "closed", "children": [{ "id": 1, "text": "资讯部", "state": "open"}] }, { "id": 2147483679, "text": "上海宝岛", "state": "closed", "children": [{ "id": 2147483656, "text": "资讯部", "state": "closed", "children": [{ "id": 2147483657, "text": "北京资讯", "state": "open"}]}]}];
    $('#paperUl').tree({
        animate: true,
        onClick: function (node) {//点击事件
            var state = node.state;

            if (!state) {//判断当前选中的节点是否为根节点 里面获取ajax去获得数据 
                //ajax 请求
                //    $.ajax({
                //        url: Webversion + '/class/list' , //url访问地址
                //        type: "GET",
                //        data: {
                //            ID: node.id
                //        },
                //        dataType: "json",
                //        success: function (result) {
                            //数据写入div里。
                //        }
                //    });
            } else {

            }
        }
    });
    $('#paperUl').tree('loadData', result);
});


  