<?php
///////////////////////////////////////////////////////
// 找回密码接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			if($this -> verifyemail()){
			
				$this -> pushmail2mailstack("mailstack1",'<div>华夏安业题库重置密码(重要)</div><div>您可复制以下地址到浏览器用来重置华夏安业题库账号密码。</div><div>https://edu.hxpad.com/resetpassword.php?username='.$_REQUEST['email'].'&code='.$this->setinfo().'</div><div>如果您未重置密码，请勿操作。</div>',$_REQUEST['email'],'华夏安业题库重置密码(重要)');

				$this -> arr["sc"] = 200;
			}
			else{
				$this -> arr["sc"] = 401;
			}

		}
		//设置新code
		public function setinfo(){
			$id = $this -> db -> rs['id'];
			$code = $this -> randStr(64,"ALL");
			$this -> db -> sql = "update usr_user set code='".$code."' where id=".$id;
			$this -> db -> ExecuteSql();
			return $code;
		}
		
		//查找是否有email
		public function verifyemail(){
			return $this -> db -> Queryif('usr_user',"username='".$_REQUEST['email']."'");		
		}
		public function pushmail2mailstack($path,$data,$aim,$subject){
			//	获取毫秒的时间戳
			$time = explode ( " ", microtime () );
			$time = $time [1] . ($time [0] * 1000);
			$time2 = explode ( ".", $time );
			$time = $time2 [0];
			
			$filename = $time;
			$filepath = dirname(__FILE__)."/../../../".$path."/".$filename;
			file_put_contents ($filepath, trim($aim)."\r\n".trim($subject)."\r\n".$data);

		}

	}
	
	$rs = new rss("GET",array("email","func"));
	
	
