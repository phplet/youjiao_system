<?php
///////////////////////////////////////////////////////
// 获取用户信息接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				$id = $rs[1];
				$this -> selectandwrite('username,realname,gender,usr_type','usr_user',$id);
				$this -> getmore($id);
				$this -> arr["sc"] = 200;
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}
		//获取进一步用户信息
		public function getmore($id){
			switch($this -> arr["user_type"]){
				//学生
				case 1:
					$this -> selectandwrite('province_id,city_id,district_id,school_id,grade_id','usr_student',$id,'userid');
					break;
				//教师
				case 2:
					break;
				//家长
				case 3:
					break;
				default;
					break;
			}
		}

	}
	
	$rs = new rss("GET",array("username","token","func","time"));
	
	
?>