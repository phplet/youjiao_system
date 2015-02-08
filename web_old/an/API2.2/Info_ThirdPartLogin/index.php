<?php
///////////////////////////////////////////////////////
// 第三方登录接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
 	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			//验证用户
			if(!$this -> iftokenright()){
				$this -> arr["sc"] = 401;
				return;
			}
			
			//验证用户唯一性
			$rs = $this -> verifyemail();
			
			if($rs!=0){
				$id = $this -> db -> rs["id"];
				$this -> doinsertlogininfo();
				$this -> selectandwrite('username,dbstring,yanzheng','usr_user',$id);
				$this -> arr["sc"] = 200;
			}
			else{
				//插入新用户
				$this -> autoinsertuser();
				$this -> arr["sc"] = 200;
			}
			switch($_REQUEST["tname"]){
				case "sinaweibo":
					$this -> db -> sql = "update usr_user set sinaweibotoken='".$_REQUEST['accesstoken']."',sinaweibouid='".$_REQUEST['uid']."',sinaweibonick='".$this -> arr["nick"]."' where username='".$_REQUEST["username"]."'";
					$this -> db -> ExecuteSql();
					break;
				default:
					break;
			}
		}
		//用户是否存在
		public function verifyemail(){
			/* if(!preg_match("/^[0-9a-zA-Z_-]+(\.[0-9a-zA-Z_-]+)*@[a-zA-Z0-9_-]+(\.{1}[a-zA-Z0-9_-]+)*\.{1}[a-zA-Z]{2,4}$/i",$_REQUEST['email'])){
				return true;
			} */
			return $this -> db -> Queryif('usr_user',"username='".$_REQUEST['username']."'");	
		}
		
		
		//更新数据库登录信息
		public function doinsertlogininfo(){
			$token = $this -> randStr(64) ;
			$ip = $this -> get_real_ip();
			$this -> db -> sql = "update usr_user set token='$token',last_login_time=current_timestamp(),last_loginlocation='$ip' where username='".$_REQUEST["username"]."'";
			$this -> db -> ExecuteSql();
			$this -> arr["token"] = $token;
		}
		//插入新用户
		public function autoinsertuser(){
		
			$dbstring = $this -> randStr(16) ;
			$token = $this -> randStr(64) ;
			$ip = $this -> get_real_ip();			

			$nick = $this -> arr["nick"];
			$code = $this -> randStr(64) ;
			$this->code = $code;
			
			$password = $this -> randStr(64) ;
			
			$this -> db -> sql = "insert into usr_user (token,last_login_time,reg_time,last_loginlocation,dbstring,username,passwd,nickname,code,usr_type,yanzheng ) values('$token',current_timestamp(),current_timestamp(),'$ip','$dbstring','".$_REQUEST['username']."','$password','".$nick."','".$code."',1,1)";
			$this -> db -> ExecuteSql();
			$this -> arr["username"] = $_REQUEST['username'];
			$this -> arr["token"] = $token;
		
		}
		//验证用户
		public function iftokenright(){
			switch($_REQUEST["tname"]){
				case "sinaweibo":
					//$this -> arr["url"] = "https://api.weibo.com/2/users/show.json?uid=".$_REQUEST['uid']."&access_token=".$_REQUEST['accesstoken'];
					
					$callback = file_get_contents("https://api.weibo.com/2/users/show.json?uid=".$_REQUEST['uid']."&access_token=".$_REQUEST['accesstoken']);
					//$this -> arr["sina"] = $callback;
					$b = get_object_vars(json_decode($callback));
					if($b["id"] == $_REQUEST['uid']){
						$this -> arr["nick"] = $b["screen_name"];
						$this -> arr['tname'] = $_REQUEST["tname"];
						return true;
					}
					else{
						return false;
					}
					break;
				default:
					return false;
					break;
			}
		
		}
		
		
	} 
	

	$rs = new rss("POST",array("username","tname","accesstoken","uid","func","time"));
	
?>