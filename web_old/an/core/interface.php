<?php
///////////////////////////////////////////////
//restful php类
//v1.0 by孙峻峰
///////////////////////////////////////////////
	
	//包含restful类文件
	require_once(dirname(__FILE__)."/../include/rest.php");
	//包含数据库操作类
	require_once(dirname(__FILE__)."/../include/db.php");
	
	
	class rs{
		
		public $aimmethod;
		public $param;
		public $db;
		public $arr;
	
	
		//构造函数
		//$aimmethod 目标方法 字符串 GET POST PUT DELETE
		//$param 需要的参数 数组
        public function __construct($aimmethod,$param){   
			//防注入
			foreach ($_REQUEST as $k => $v) {
				if($k!="func" && $k!="token"){
					if($this->inject_check($_REQUEST[$k])){
					
						$_REQUEST[$k] = null;
					
					
					}
				}
			}
			$this->init($aimmethod,$param);
			
        }
		/* 函数作用：检测提交的值是不是含有SQL注射的字符，防止注射，保护服务器安全 
		参        数：$sql_str: 提交的变量  返 回 值：返回检测结果，ture or false  函数作者：heiyeluren  */ 
		function inject_check($sql_str)  {       
			return eregi('select|insert|update|delete|\'|\/\*|\*|\.\.\/|\.\/|union|into|load_file|outfile', $sql_str);
		}		
		
		public function init($aimmethod,$param){
			
			$this->aimmethod = $aimmethod;
			$this->param = $param;
			
			//包含设置文件
			require_once(dirname(__FILE__)."/../include/config.php");
			//实例化数据库操作类
			$this->db = new DB($host,$dbname,$dbuser,$dbpass);
			
			//实例化restful
			$r = new REST($aimmethod,$param);	
			if($r->verify==1){
				$this->onsucess();
			}
			else{
				$this->onfail();
			}
			
			$this->arr['func'] = $_REQUEST['func'];
			echo $r->mr($this->arr);
		}
		//验证通过处理
		public function onsucess(){
		
		}
		//验证失败处理
		public function onfail(){
			$this->arr["sc"] = 9999;
		}
		
		/* //从数据库选择一条数据写入返回数组 $selectstring 选择的字符
		public function selectandwrite($selectstring,$tablename,$id,$aim="id"){
			$this -> db -> sql = "select $selectstring from $tablename where $aim='$id'";			
			$this -> db -> Queryone();
			foreach ($this -> db -> rs as $k => $v) {
				if(!is_numeric($k)){
					$this->arr[$k] = $v;
				}
			}
		} */
		//从数据库选择N条数据写入返回数组 $selectstring 选择的字符
		public function selectandwrite($selectstring,$tablename,$id,$aim="id",$condition=null){
			if($condition == null){
				$this -> db -> sql = "select $selectstring from $tablename where $aim='$id'";
			}
			else{
				$this -> db -> sql = "select $selectstring from $tablename where ".$condition;
			}
						
			$this -> db -> Query();

			
			for($i=0;$i<$len=count($this -> db -> rs);$i++){
				foreach ($this -> db -> rs[$i] as $k => $v){
					if(!is_numeric($k)){
						$this->arr[$k][] = $v;
					}
				}
			}		

		}
		//从数据库选择N条数据写入返回数组 $selectstring 选择的字符
		public function selectandwrites($selectstring,$tablename,$id,$aim="id",$condition=null,$result="result"){
			if($condition == null){
				$this -> db -> sql = "select $selectstring from $tablename where $aim='$id'";
			}
			else{
				$this -> db -> sql = "select $selectstring from $tablename where ".$condition;
			}
			//$this->arr['sql'] = $this -> db -> sql;

			
			$this -> db -> Query();
			foreach ($this -> db -> rs as $k => $v) {
				$this->arr[$result][$k] = $v;
			}	
		}
		//从数据库选择N条数据写入返回数组 $selectstring 选择的字符
		public function selectandwritess($selectstring,$tablename,$id,$aim="id",$condition=null,$result="result"){
			if($condition == null){
				$this -> db -> sql = "select $selectstring from $tablename where $aim='$id'";
			}
			else{
				$this -> db -> sql = "select $selectstring from $tablename where ".$condition;
			}
			//$this->arr['sql'] = $this -> db -> sql;

			
			$this -> db -> Query();
			$this->arr[$result] = $this -> db -> rs;
		}
		//从数据库选择1条数据写入返回数组 $selectstring 选择的字符
		public function selectandwrites1($selectstring,$tablename,$id,$aim="id",$condition=null){
			if($condition == null){
				$this -> db -> sql = "select $selectstring from $tablename where $aim='$id'";
			}
			else{
				$this -> db -> sql = "select $selectstring from $tablename where ".$condition;
			}
						
			$this -> db -> Queryone();
			foreach ($this -> db -> rs as $k => $v) {
					$this->arr[$k] = $v;
			}	
		}
		//验证token
		public function verifytoken(){
			if($this->kong($_REQUEST["password"])){
				if($this -> db -> Queryif("usr_user","token='".$_REQUEST['token']."' and username='".$_REQUEST['username']."'")){
					$arr[0] = true;
					$arr[1] = $this -> db -> rs['id'];
				}
				else{
					$arr[0] = false;
				}
			}
			else{
				if($this -> db -> Queryif("usr_user","username='".$_REQUEST['username']."' and passwd='".$_REQUEST['password']."'")){
					$arr[0] = true;
					$arr[1] = $this -> db -> rs['id'];
				}
				else{
					$arr[0] = false;
				}
			}
			return $arr;
		}
		//验证权限
		public function Pass($id,$type,$level=null){
			if($level==null){
				return $this -> verigyusertype($id,$type);				
			}
			else{
				if($this -> verigyusertype($id,$type)){
					return verifyteacherlevel($id,$level);
				}
			}
			
		}
		//验证用户类型
		public function verifyusertype($id,$arr){
			$this -> db -> sql ="select usr_type from usr_user where id=".$id;
			$this -> db -> Queryone();
			$has = false;			
			$type = $this -> db -> rs['usr_type'];
			for($i=0;$i<count($arr);$i++){
				if($arr[$i]==$type){
					$has = true;
					break;
				}
			}
			return $has;
			
		}
		//验证教师级别
		public function verifyteacherlevel($id,$arr){
			$this -> db -> sql ="select level from usr_teacher where uid=".$id;
			$this -> db -> Queryone();
			$has = false;			
			$type = $this -> db -> rs['level'];
			for($i=0;$i<count($arr);$i++){
				if($arr[$i]==$type){
					$has = true;
					break;
				}
			}
			return $has;
		}
		
		//判断取来数据是否为空
		public function kong($str){
			return (strlen($str)==0?true:false);
		}
		
		//生成随机数
		public function randStr($len=6,$format='ALL') { 
			switch($format) { 
				case 'ALL':
					$chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
				break;
				case 'CHAR':
					$chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'; 
					break;
				case 'NUMBER':
					$chars='0123456789'; 
					break;
				default :
					$chars='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'; 
					break;
			}
			mt_srand((double)microtime()*1000000*getmypid()); 
			$password="";
			while(strlen($password)<$len)
				$password.=substr($chars,(mt_rand()%strlen($chars)),1);
			return $password;
		} 
		//获取ip
		public function get_real_ip(){
			$ip=false;
			if(!empty($_SERVER["HTTP_CLIENT_IP"])){
				$ip = $_SERVER["HTTP_CLIENT_IP"];
			}
			if (!empty($_SERVER["HTTP_X_FORWARDED_FOR"])){
				$ips = explode (", ", $_SERVER["HTTP_X_FORWARDED_FOR"]);
				if ($ip){
					array_unshift($ips, $ip); $ip = FALSE;
				}
				for ($i = 0; $i < count($ips); $i++){
					if (!eregi ("^(10|172\.16|192\.168)\.", $ips[$i])){
						$ip = $ips[$i];
						break;
					}
				}
			}
			return ($ip ? $ip : $_SERVER["REMOTE_ADDR"]);
		}

		
	}
//$a = new rs("ee","dd");

