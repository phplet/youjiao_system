<?php
///////////////////////////////////////////////////////
// 设置教材信息接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				if($this -> verifyarr()){
					$this -> upuserinfo();
					$this -> arr["sc"] = 200;
				}
				else{
					$this -> arr["sc"] = 400;
				}				
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}
		//记录是否相等
		public verifyarr(){
			(count($_REQEST['book_id'])==count($_REQEST['subject_id']) ? true : false);
		}
		
		//是否有学科记录
		public function verifysubject($id,$subject){
			return $this -> db -> Queryif('usr_vision',"user_id=$id and subject_id=$subject");		
		}
		
		//更新数据
		public function upuserinfo(){			
			$id = $this -> db -> rs ["id"];
			for($i=0;$i<count($_REQEST['subject_id']);$i++){
				$subject = $_REQUEST['subject_id'][$i];
				$book_id = $_REQUEST['book_id'][$i];
				if($this -> verifysubject($id,$subject)){					
					$arr = new array('book_id'=>$book_id);
					$this -> db -> Update('usr_vision',"user_id=$id and subject_id=$subject",$arr);
				}
				else{
					$this -> db -> sql = "insert into usr_vision (user_id,subject_id,book_id) values($id,$subject,$book_id)";
					$this -> db -> ExecuteSql();
				}
			}
	
		}
		
	}
	
	
	$rs = new rss("PUT",array("username","token","func","time"));
	
?>