<?php
///////////////////////////////////////////////////////
// 绑定第三方接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	require_once(dirname(__FILE__)."/../../include/Fmail.class.php");
	
 	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			
			if($rs[0]){
				$id = $rs[1];
				if($this -> iftokenright()){					
					$this -> dothirdpartinfo();
					$this -> arr["sc"] = 200;
				}
				else{
					$this -> arr["sc"] = 401;
				}
				
				
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}
		//更新数据库第三方信息
		public function dothirdpartinfo(){
			switch($_REQUEST["tname"]){
				case "sinaweibo":
					$this -> db -> sql = "update usr_user set sinaweibouid='".$_REQUEST['uid']."',sinaweibotoken='".$_REQUEST['accesstoken']."',sinaweibonick='".$this -> arr["nick"]."' where username='".$_REQUEST["username"]."'";
					$this -> db -> ExecuteSql();
					break;
				case "email":
					$this -> db -> sql = "update usr_user set bindemail='".$_REQUEST['bindemail']."',bindemailyanzheng=0,code='".$this->code."' where username='".$_REQUEST["username"]."'";
					$this -> db -> ExecuteSql();
					break;
				default:
					break;
			}
			
		}
		//验证用户
		public function iftokenright(){
			$this -> arr['tname'] = $_REQUEST["tname"];
			switch($_REQUEST["tname"]){
				case "sinaweibo":
					$callback = file_get_contents("https://api.weibo.com/2/users/show.json?uid=".$_REQUEST['uid']."&access_token=".$_REQUEST['accesstoken']);
					$b = get_object_vars(json_decode($callback));
					if($b["id"] == $_REQUEST['uid']){
						$this -> arr["nick"] = $b["screen_name"];
						
						return true;
					}
					else{
						return false;
					}
					break;
				case "email":
				$code = $this -> randStr(64) ;
				$this->code = $code;
				
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
					'to' => $_REQUEST['bindemail'],
					'cc' => $_REQUEST['bindemail'],
					'subject' => '华夏安业题库绑定邮箱激活(重要)',
					'cont' => '<div>欢迎注册华夏安业题库账号</div><div>您可复制以下地址到浏览器用来激活华夏安业题库账号，从而使用完整功能。</div><div>https://edu.hxpad.com/bindjihuo.php?username='.$_REQUEST['username'].'&code='.$this -> code.'</div><div>如果您未使用此邮箱注册账号，请勿激活。</div>',
					'cont_type' => Fmail::CONT_TYPE_HTML, // html格式
					'apart' => true // 隐藏To、Cc和Bcc
				);
				
				if($fmail->send($mail)) {
					//$this -> arr["sc"] = 200;
				}
				else {
					//$this -> arr["sc"] = 400;
				}
				$fmail->close();
				return true;
					break;
				default:
					return false;
					break;
			}
		
		}
		
	} 
	

	$rs = new rss("POST",array("username","token","uid","tname","func","time","accesstoken"));
	
?>