<?php
///////////////////////////////////////////////////////
// 激活账号接口
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
			if(isset($_REQUEST['u'])){
				$u = json_decode(base64_decode($_REQUEST['u']),true);
			}
			else{
				$u['username'] = $_REQUEST['username'];
				$u['code'] = $_REQUEST['code'];
			}

			return $this -> db -> Queryif('usr_user',"username='".$u['username']."' and code='".$u['code']."'");
		}
		//更新记录数据
		public function upinfo($id){
			$this -> db -> sql = 'update usr_user set yanzheng=1 where id='.$id;
			$this -> db -> ExecuteSql();
	
		}
		
	}
	if(isset($_REQUEST['u'])){
		$rs = new rss("GET",array('u'));
	}
	else{
		$rs = new rss("GET",array('username','code'));
	}
	
	
	
?>