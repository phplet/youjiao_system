<?php
///////////////////////////////////////////////////////
// 第三方接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if($this -> vr['pass']){
				$this -> getThirdpart();
				$this -> b['sc'] = 200;
			}
		}
	
		//POST逻辑
		public function doPOST(){
			if($this -> vr['pass'] and $this -> verifyInfo()){
				$this -> bindThirdpart();
			}
		}
	
		//PUT逻辑
		public function doPUT(){
			$this -> b["sc"] = 405;
		}
	
		//DELETE逻辑
		public function doDELETE(){
			$this -> b["sc"] = 405;
		}
		
		//绑定第三方信息
		private function bindThirdpart(){
			switch($this -> urlarr[3]){
				case "sinaweibo":
					$arr['sinaweibouid'] = $this -> r('uid');
					$arr['sinaweibotoken'] = $this -> r('accesstoken');
					$arr['sinaweibonick'] = $this -> b["nick"];
					$this->b['arr'] = $arr;
					$this -> db -> Update('tbluser',$arr,"id=".$this -> vr['id']);
					$this -> b['sql'] = $this -> db ->sql ;
					break;
				case "email":
					$arr['bindemail'] = $this -> r('bindemail');
					$arr['bindemailyanzheng'] = 0;
					$arr['code'] = $this -> code;
					$this -> db -> Update('tbluser',$arr,"id=".$this -> vr['id']);
					break;
				default:
					break;
			}
			$this -> b["sc"] = 200;
		}
		
		//验证凭据
		public function verifyInfo(){
			switch($this -> urlarr[3]){
				case "sinaweibo":
					return $this -> verifySinaweibo();
					break;
				case "email":
					$this -> verifyTEmail();
					return true;
					break;
				default:
					return false;
					break;
			}
		
		}
		
		//验证新浪微博凭据
		private function verifySinaweibo(){
			$o = new SaeTOAuthV2( WB_AKEY , WB_SKEY );
			$jr = json_decode(base64_decode($_SERVER['PHP_AUTH_DIGEST']),TRUE);
			$keys = array();
			$keys['uid'] =$jr['uid'];
			$keys['access_token'] =$jr['accesstoken'];
			$url="https://api.weibo.com/2/users/show.json";
			//$callback =$o->get($url,$keys);
			//$this -> b["xxx"] = $callback;
			//file_get_contents("https://api.weibo.com/2/users/show.json?uid=".$jr['uid']."&access_token=".$jr['accesstoken']);
			//$this -> vr['username'] = $jr['uid']."@sinaweibo.hx";
			//$b = get_object_vars(json_decode($callback));
			
			$b=$o->get($url,$keys);
//			$callback = file_get_contents("https://api.weibo.com/2/users/show.json?uid=".$this -> r('uid')."&access_token=".$this -> r('accesstoken'));
//			$b = get_object_vars(json_decode($callback));
			 
			if($b["id"] == $this ->r('uid')){
				$this -> b["nick"] = $b["screen_name"];			
				return true;
			}
			else{
				return false;
			}
		}
		
		//验证邮箱
		private function verifyTEmail(){ 
			$this -> code = $this -> randStr(64);
			$this -> pushmail2mailstack("mailstack1",'<div>欢迎注册华夏安业题库账号</div><div>您可复制以下地址到浏览器用来激活华夏安业题库账号，从而使用完整功能。</div><div>https://edu.hxpad.com/bindjihuo.php?username='.$this->vr['username'].'&code='.$this -> code.'</div><div>如果您未使用此邮箱注册账号，请勿激活。</div>',$this->r('email'),'华夏安业用户邮箱验证(重要)');
		}
		
		//将信件放入发送堆栈
		public function pushmail2mailstack($path,$data,$aim,$subject){
			//	获取毫秒的时间戳
			$time = explode ( " ", microtime () );
			$time = $time [1] . ($time [0] * 1000);
			$time2 = explode ( ".", $time );
			$time = $time2 [0];
			
			$filename = $time;
			$filepath = dirname(__FILE__)."/../../htdocs/ticool.hxnetwork.com/".$path."/".$filename;
			file_put_contents ($filepath, trim($aim)."\r\n".trim($subject)."\r\n".$data);

		}
		//获取第三方信息
		private function getThirdpart(){
			$this -> db -> sql = "select sinaweibouid,sinaweibotoken,sinaweibonick from tbluser where id=".$this -> vr['id'];
			$this -> db -> Queryone();
			$this -> b['thirdpart'] = $this -> db -> rs;	
		}
	}
	


?>