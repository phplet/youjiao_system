<?php
///////////////////////////////////////////////////////
// ��ȡ�û���Ϣ�ӿ�
// by ����� v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//��֤ͨ������
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
		//��ȡ��һ���û���Ϣ
		public function getmore($id){
			switch($this -> arr["user_type"]){
				//ѧ��
				case 1:
					$this -> selectandwrite('province_id,city_id,district_id,school_id,grade_id','usr_student',$id,'userid');
					break;
				//��ʦ
				case 2:
					break;
				//�ҳ�
				case 3:
					break;
				default;
					break;
			}
		}

	}
	
	$rs = new rss("GET",array("username","token","func","time"));
	
	
?>