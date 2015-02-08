<?php
///////////////////////////////////////////////////////
// 激活绑定邮箱接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		public $uid;
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> ifhasrecord();
			//////////////////////////////////验证用户
			if($rs[0]){
				$id = $this ->db -> rs["id"];
				$this -> upinfo($id);
				
				$this -> arr["sc"] = 200;
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}
		//是否有其记录
		private function ifhasrecord(){
			return $this -> db -> Queryif('usr_user',"username='".$_REQUEST['username']."' and code='".$_REQUEST['code']."'");	
		}
		//更新记录数据
		public function upinfo($id){
			$this -> db -> sql = 'update usr_user set bindemailyanzheng=1 where id='.$id;
			$this -> db -> ExecuteSql();
	
		}
		
	}
	
	
	$rs = new rss("GET",array("username","code"));
	
?>