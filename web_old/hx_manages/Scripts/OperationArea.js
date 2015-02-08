

$(document).ready(function () {

    $('#TabOperationArea').datagrid({
        fit: true,
        remoteSort: false,
        toolbar: '#SerToolBar',
        pagination: true,
        rownumbers: true,
        fitColumns: true,

        pagePosition: "bottom",
        pageList: [20, 40, 60, 80, 100],
        loadMsg: '正在加载数据...',
        columns: [[
            { field: 'log_time', title: '提交日期', width: 80, sortable: true, align: 'center' },
            { field: 'realname', title: '学生姓名', width: 65, sortable: true, align: 'center' },

            { field: 'my_score', title: '状态', width: 65, sortable: true, align: 'center',
                formatter: function (value, row, index) {
					if(row.log_time==null){
						return "未提交";
					}
					else{
						if(row.pi == null){
							return "未批改";
						}
						else{
							return "已批改";
						}
						
					}
                }
            },
            { field: 'operation', title: '操作'
            , width: 65, sortable: true, align: 'center',
                formatter: function (value, row, index) {
                    if (row.log_time == null) {
                        return ' ';
                    }
                    else {
                        return "<a  href=\"#\" id=\"management\" onclick=\"LookPaperInfo('" + row.id + "','" + row.my_score + "')\" >查看</a>";
                    }

                }

            }

        ]]


    });


    bindDatasource();
    //bindDatasourceDeatil();




});      //.ready的结束标签

//点击查看的时候把参数入 cookie，然后到下个页面去取出
function LookPaperInfo(paperStudentID, state) {

	$.cookie("paperStudentLookID", paperStudentID);
    $.cookie("paperLookState", state);
    document.location.href = "PaperCheck.html";
   
}
//调用ajax 取得数据
function bindDatasource() {
    $.ajax({
        url: Webversion + '/test/list/all'+"?"+$.getRom() , //url访问地址
        type: "GET",
        dataType: "json",
        success: function (result) {

            /* if (result == null || result == null) {
                result = {};
                result = [];
            } */
            //bindDatasourceDeatil(result);
			$('#TabOperationArea').datagrid("loadData", result.test);
        }
    });

}
// 取得json数据绑定到列表
function bindDatasourceDeatil(result) {
    result = { "page": 0, "total": 1,
        "rows":
        [
            { "name": "语文综合测试", "date": "2013", "Subdate": "2012", "stdate": "张三", "Belclass": "高二（一）班", "state": "已批改", "operation": "查看" },
            { "name": "数序综合测试", "date": "2013", "Subdate": "2012", "stdate": "李四", "Belclass": "高三（二）班", "state": "未提交", "operation": "查看" },
            { "name": "政治综合测试", "date": "2013", "Subdate": "2012", "stdate": "王五", "Belclass": "高二（一）班", "state": "待批改", "operation": "批改" },
            { "name": "历史综合测试", "date": "2013", "Subdate": "2012", "stdate": "李四", "Belclass": "高三（二）班", "state": "未提交", "operation": "批改" }

        ]

    };
    $('#TabOperationArea').datagrid("loadData", result);
}
//点击搜索取得数据
function search() {
    $.ajax({
        url: Webversion + '/class/list' , //url访问地址
        type: "GET",
        data: {
            Type: $("#selectType").combobox('getValue'), //类型
            Content: $("#txtContent").val()//内容
        },
        dataType: "json",
        success: function (result) {

            if (result == null || result == null) {
                result = {};
                result = [];
            }
            bindDatasourceDeatil(result);
        }
    });
}