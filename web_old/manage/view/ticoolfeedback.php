<link rel="stylesheet" href="css/style.css" />
<link rel="stylesheet" type="text/css" href="css/flexigrid.pack.css" />
<script type="text/javascript" src="js/flexigrid.pack.js"></script>
<table class="flexme3" style="display: none"></table>
<script type="text/javascript">
		$(".flexme3").flexigrid({
			url : 'control/getfeedback.php',
			dataType : 'json',
			async : false,
			colModel : [ {
				display : 'ID',
				name : 'id',
				width : 40,
				//sortable : true,
				align : 'center'
			},{
				display : '用户ID',
				name : 'userid',
				width : 50,
				//sortable : true,
				align : 'left'
			},  {
				display : '用户名',
				name : 'username',
				width : 180,
				//sortable : true,
				align : 'left'
			}, {
				display : '反馈内容',
				name : 'content',
				width : 600,
				
				//sortable : true,
				align : 'left'
			}, {
				display : '反馈时间',
				name : 'feedtime',
				width : 130,
				//sortable : true,
				align : 'center'
			} ],
/* 			buttons : [ {
				name : 'Add',
				bclass : 'add',
				onpress : test
			}, {
				name : 'Delete',
				bclass : 'delete',
				onpress : test
			}, {
				separator : true
			} ], */
			sortname : "id",
			sortorder : "asc",
			usepager : true,
			title : '题库客户端反馈列表',
			useRp : true,
			nowrap:false,
			rp : 50,
			showTableToggleBtn : true,
			width : ($(window).width() -232),
			height : ($(window).height() -140)
		});

		function test(com, grid) {
			if (com == 'Delete') {
				confirm('Delete ' + $('.trSelected', grid).length + ' items?')
			} else if (com == 'Add') {
				alert('Add New Item');
			}
		}
	</script>
