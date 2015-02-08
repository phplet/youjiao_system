<?php
///////////////////////////////////////////////////////
// 找回密码接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	require_once(dirname(__FILE__)."/../../include/Fmail.class.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			if($this -> verifyemail()){
				//发信设置
				$svr = array(
					'smtp' => 'smtp.exmail.qq.com',
					'user' => 'support@hxnetwork.com',
					'pass' => 'hx123456',
					'host' => 'smtp.exmail.qq.com'
				); 
				$fmail = new Fmail($svr, false);			
				
				$mail = array(
					'name' => '华夏安业题库',
					'from' => 'support@hxnetwork.com',
					'to' => $_REQUEST['username'],
					'cc' => $_REQUEST['username'],
					'subject' => '华夏安业题库密码(重要)',
					'cont' => '<div>华夏安业题库密码(重要)</div><div>您的密码已重置为 '.$this->getinfo().'</div><div>请及时登录修改</div>',
					'cont_type' => Fmail::CONT_TYPE_HTML, // html格式
					'apart' => true // 隐藏To、Cc和Bcc
				);
				
				if($fmail->send($mail)) {
					$this -> arr["sc"] = 200;
				}
				else {
					$this -> arr["sc"] = 400;
				}
				$fmail->close();
			}
			else{
				$this -> arr["sc"] = 401;
			}

		}
		//设置新密码
		public function getinfo(){
			$id = $this -> db -> rs['id'];
			$password = $this -> randStr(8,"NUMBER");
			$sha256pass = hash("sha256",$password);
			$this -> db -> sql = "update usr_user set passwd='".$sha256pass."' where id=".$id;
			$this -> db -> ExecuteSql();
			return $password;
		}
		
		//查找是否有email
		public function verifyemail(){
			return $this -> db -> Queryif('usr_user',"username='".$_REQUEST['username']."' and code='".$_REQUEST['code']."'");		
		}

	}
	
	$rs = new rss("GET",array("username","code"));
	
	
