<?php
/////////////////////////////////////////////////////////
// php rest接口模块v2.0
// by 孙峻峰 2012.6.18
/////////////////////////////////////////////////////////

//包含数据库操作类
//					ini_set('display_errors', 'On');
//					error_reporting(E_ALL);
require_once(dirname(__FILE__)."/include/db.php");
include dirname(__FILE__)."/include/config.php";
require_once(dirname(__FILE__)."/include/lib/lib_utils.php");
require_once(dirname(__FILE__)."/include/lib/lib_db_factory.php");
require_once(dirname(__FILE__)."/include/weibo_config.php");
require_once(dirname(__FILE__)."/include/saetv2.ex.class.php");
require_once(dirname(__FILE__)."/include/logic/lgc_user.php");
require_once(dirname(__FILE__)."/include/logic/lgc_student.php");
require_once(dirname(__FILE__)."/include/logic/lgc_teacher.php");
require_once(dirname(__FILE__)."/include/logic/lgc_class.php");
require_once(dirname(__FILE__)."/include/logic/lgc_stat.php");
require_once(dirname(__FILE__)."/include/logic/lgc_center_zone.php");
require_once(dirname(__FILE__)."/include/logic/lgc_exercise.php");
require_once(dirname(__FILE__)."/include/logic/lgc_exam_paper.php");
require_once(dirname(__FILE__)."/include/logic/lgc_test_comment.php");
require_once(dirname(__FILE__)."/include/logic/lgc_cloud_question.php");
require_once (dirname(__FILE__)."/include/lib/Excel/reader.php" );
class REST{

	//获取的REST方法
	public $method;
	//数据库类
	public $db;
	//身份验证结果
	public $vr;
	//返回参数
	public $b;
	//url解析
	public $urlarr;
	
	public $mywebpath;
	public $userdbhost;
	public $userdbname;
	public $curriculumndbhost;
	public $curriculumndbname;
	public $DBCFG;
	public $webroot;
	

	//构造函数 $aimmethod为目标方法 param为目标参数数组
	public function __construct($url){
		global $DBCFG,$webroot,$webpath;
		//解析url
		$this -> urlarr = $url;
		//	包含配置文件
		//实例化数据库操作类
		$this -> mywebpath=$webpath;
		$this -> DBCFG = $DBCFG;
		$this->webroot = $webroot;
		
//		$this ->curriculumndbhost=$_curriculumndbhost;
//	    $this ->curriculumndbname=$_curriculumndbname;
		$this ->userdbhost=$host;
	    $this ->userdbname=$dbname;
		 
		$this -> db = new DB($DBCFG['default_local']['dbhost'], $DBCFG['default_local']['dbname'] , $DBCFG['default_local']['dbuser'] , $DBCFG['default_local']['dbpasswd']);
//		print_r($this->db);
		//根据方法执行操作
		$this -> getmethod();
		//验证身份
		//echo "niashoasfasodfsafsa";
		//echo $this->method;
		//exit;
//		echo '111';
		$this -> verify();
		//echo "11";
		//执行rest方法指示方法
		switch($this->method){
			case "GET":
				$this->doGET();
				break;
			case "POST":
				$this->doPOST();
				break;
			case "PUT":
				$this->doPUT();
				break;
			case "DELETE":
				$this->doDELETE();
				break;
			default:
				$this -> b["sc"] = 405;
				break;
		}
		//显示结果
		$this -> mr();
	}
 	//析构函数
    public function __destruct(){
        
    }
	
	//获取rest方法
	private function getmethod(){
		$method =  strtoupper($_REQUEST['_method']);
		switch($method){
			case "GET":
				$this->method="GET";
				break;
			case "POST":
				$this->method="POST";
				break;
			case "PUT":
				$this->method="PUT";
				break;
			case "DELETE":
				$this->method="DELETE";
				break;
			default:
				$this->method = $_SERVER['REQUEST_METHOD'];
		}
		//$this -> b['para'] = $_REQUEST;
	}
	
	//验证身份 返回$this -> vr['pass'] true 通过 false 未通过；$this -> vr['id'] 用户id；$this -> vr['level']教师级别
	public function verify(){
		//是否有验证值
		if(!isset($_SERVER['PHP_AUTH_DIGEST'])){
			$this -> vr['pass'] = FALSE;
			$this -> b["sc"] = 401;
			return;
		}
		 
		//解析身份认证信息
		$jr = json_decode(base64_decode($_SERVER['PHP_AUTH_DIGEST']),TRUE);
//		print_r($jr);
//		print_r($jr);
		$this -> vr['logintype'] = $jr['logintype'];
		$this -> vr['username'] = $jr['username'];
		$this -> vr['password'] = $jr['password'];
		
		//身份认证模式
		switch($jr['logintype']){
			case 1:
			//token模式
				$this -> db -> sql = "select id,usr_type,yanzheng,realname,nickname,passwd from tbluser where token='".$jr['token']."' and username='".$jr['username']."'";
				$this -> db -> Queryone();
				
				$this -> localpass();
				
				break;
			case 2:
			//密码模式
				$this -> db -> sql = "select id,usr_type,yanzheng,realname,nickname,passwd from tbluser where username='".$jr['username']."' and passwd='".$jr['password']."'";
				$this -> db -> Queryone();
				//print($this -> db -> sql );
				//return;
				$this -> localpass();
				break;
			case 3:
		//新浪微博模式
			$o = new SaeTOAuthV2( WB_AKEY , WB_SKEY );
			$keys = array();
			$keys['uid'] =$jr['uid'];
			$keys['access_token'] =$jr['accesstoken'];
			$url="https://api.weibo.com/2/users/show.json";
			$b=$o->get($url,$keys);
			$this -> vr['username'] = $jr['uid']."@sinaweibo.hx";
				if($b["id"] != null){
					$this -> vr['uid'] = $jr['uid'];
					$this -> vr['nick'] = $b["screen_name"];
					$this -> vr['accesstoken'] = $jr['accesstoken'];
					$this -> db -> sql = "select id,usr_type,yanzheng from tbluser where username='".$this -> vr['username']."'";
					$this -> db -> Queryone();
					$this -> localpass();
				}
				else{
					$this -> vr['pass'] = FALSE;
					$this -> b["sc"] = 407;
				}
				break;
			default:
				$this -> vr['pass'] = FALSE;
				$this -> b["sc"] = 201;
				break;	
//			default:
//				$this -> vr['pass'] = FALSE;
//				$this -> b["sc"] = 401;
//				break;	
		}
		
	}

	private function localpass(){
		//判断是否通过验证
		if(isset($this -> db -> rs['id'])){
			$this -> vr['pass'] = TRUE;
			//$this -> b['sc'] = 200;
			$this -> vr['id'] = $this -> db -> rs['id'];
			if($this -> vr['nick']==null){
				$this -> vr['nick'] = $this -> db -> rs['nickname'];
			}			
			$this -> vr['usr_type'] = $this -> db -> rs['usr_type'];
			$this -> vr['yanzheng'] = $this -> db -> rs['yanzheng'];
			$this -> vr['realname'] = $this -> db -> rs['realname'];
			$this -> vr['passwd'] = $this -> db -> rs['passwd'];
		
			//如果用户类型为教师，获取其级别
			if($this -> db -> rs['usr_type']==2){
				$this -> db -> sql = "select level,center_id,zone_id,subject_id from tblteacher where user_id=".$this -> vr['id'];
				
				$this -> db -> Queryone();
				$this -> vr['level'] = $this -> db -> rs['level'];
				$this -> vr['center_id'] = $this-> db -> rs['center_id'];
				$this -> vr['zone_id'] = $this-> db -> rs['zone_id'];
				$this -> vr['school_id'] = $this -> db -> rs['school_id'];
				$this -> vr['subject_id']=$this -> db -> rs['subject_id'];
				if($this->vr['level'] == 1){//校长
					$this->db->sql = 'SELECT center_id FROM tblcenteradmin WHERE user_id='.$this->vr['id'];
					$this -> db -> Queryone();
					$this->vr['center_id'] = $this->db->rs['center_id'];
				}
				if($this->vr['level'] == 8){//教材维护
					$this -> b['aa'] = "hhhhhh";
				}
				
//				if (!($subject_id==""))
//				{
//					$iii = json_decode($this -> db -> rs['subject_grade'],true);
//					$this -> vr['subject_id']=$iii["subject"][0];
//				}

				if($this -> vr['school_id']!=null){
					$this -> db -> sql = "select type from tblcenter where id=".$this -> vr['school_id'];
					$this -> db -> Queryone();
					$this -> vr['sch_type'] = $this -> db -> rs['type'];
				}
				
			}else if($this->vr['usr_type'] == 1){//如果是学生
				$this -> db -> sql = "select grade as grade_id , class_section_id as section_id,center_id from tblstudent left join edu_grade on tblstudent.grade=edu_grade.id where user_id=".$this -> vr['id'];
				$this -> db -> Queryone();
				
				$this -> vr['section_id'] = $this -> db -> rs['section_id'];
				$this -> vr['grade_id'] = $this -> db -> rs['grade_id'];
				$this -> vr['center_id'] = $this -> db -> rs['center_id'];
//				$this->b['grade_id'] = $this -> db -> rs['grade_id'];
//				$this->b['section_id'] = $this -> db -> rs['section_id'];
				if($this->urlarr['2']=='user'){
					$this->db->sql = 'select tblcenter.id,tblcenter.center_name from tblcenter
					left join tblclass on tblclass.center_id=tblcenter.id
					left join tblclass2student on tblclass.id=tblclass2student.class_id
					left join tblstudent on tblclass2student.student_id=tblstudent.id
					where tblstudent.user_id='.$this->vr['id'].' group by id;';
					$this->db->Query();
					$rs = $this->db->rs;
					$this->b['center_info'] = $rs;
				}
			}
		}
		else{
			$this -> vr['pass'] = FALSE;
			$this -> b["sc"] = 401;
		}
	}
		
	//GET逻辑
	public function doGET(){
		$this -> b["sc"] = 405;
	}
	
	//POST逻辑
	public function doPOST(){
		$this -> b["sc"] = 405;
	}
	
	//PUT逻辑
	public function doPUT(){
		$this -> b["sc"] = 405;
	}
	
	//DELETE逻辑
	public function doDELETE(){
		$this -> b["sc"] = 405;
	}
	

 	//产生返回结果
	public function mr(){
		switch($this -> b["sc"]){
			case 200:
				$ms = "OK";
				break;
			case 201:
				$ms = "Created";
				break;
			case 400:
				$ms = "Bad Request";
				break;
			case 401:
				$ms = "Unauthorized";
				break;
			case 403:
				$ms = "Forbidden";
				break;
			case 404:
				$ms = "Not Found";
				break;
			case 405:
				$ms = "Method Not Allowed";
				break;
			case 407:
				$ms = "Proxy Authentication Required";
				break;
			case 409:
				$ms = "负责人不是教师身份!";
				break;
			case 410:
				$ms = "系统中已存在此校区!";
				break;
			case 415:
				$ms = "负责人已有自己校区!";
				break;
			case 500:
				$ms = "Internal Server Error";
				break;
			case 510:
				$ms = "用户已在该班中";
				break;
			default:
				$ms = "";
				break;
		}
		
		header("HTTP/1.1 ".$this -> b["sc"]." ".$ms);
		if ($this->r('action')!="uploa_file_TT")
		{
		header('Content-Type: application/json');
		}
		header('X-Powered-By: HuHu&TJ&LH&XK');
		unset($this -> b["sc"]);
		if(count($this -> b)>0){
			$bbbb = json_encode($this->b);
			header('Content-Length: '.strlen($bbbb));
			echo $bbbb;
		}
		
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

	
	//获取REQUEST参数 并防止注入
	public function r($key){
		
		
		if ($_REQUEST[$key])
		{  
			if(!(is_array($_REQUEST[$key]))){
				 
				if($this->inject_check($_REQUEST[$key])){		
//				echo $key;			
					$_REQUEST[$key] = null;		
				}
			}else{
				return $_REQUEST[$key];
			}
		}
		else
		{
			$_REQUEST[$key] = null;
		}
		/*if(!get_magic_quotes_gpc())
		{
		   return addSlashes($_REQUEST[$key]);
		}else{
			return $_REQUEST[$key];
		}*/
		return $_REQUEST[$key];
	}
	
	public function rcontent($key){
		
		
		if ($_REQUEST[$key])
		{  
			if(!(is_array($_REQUEST[$key]))){
				 
				if($this->inject_check($_REQUEST[$key])){		
//				echo $key;			
					$_REQUEST[$key] = null;		
				}
			}else{
				return $_REQUEST[$key];
			}
		}
		else
		{
			$_REQUEST[$key] = null;
		}
		if(!get_magic_quotes_gpc())
		{
		   return addSlashes($_REQUEST[$key]);
		}else{
			return $_REQUEST[$key];
		}
	}
	
	
	//获取防注入值
	public function v($value){
		 
		if($this->inject_check($value)){					
			$value = null;				
		}
		return $value;
	}
	
	
	public function e($str){
		echo iconv("UTF-8","GBK//IGNORE",$str);
	}
	public function u($str){
		$str = iconv("GBK","UTF-8//IGNORE",$str);
		//$str = preg_replace("/[\\xC0-\\xDF](?=[\\x00-\\x7F\\xC0-\\xDF\\xE0-\\xEF\\xF0-\\xF7]|$)/", "", $str);
		//$str = preg_replace("/[\\xE0-\\xEF][\\x80-\\xBF]{0,1}(?=[\\x00-\\x7F\\xC0-\\xDF\\xE0-\\xEF\\xF0-\\xF7]|$)/", "", $str);
		//$str = preg_replace("/[\\xF0-\\xF7][\\x80-\\xBF]{0,2}(?=[\\x00-\\x7F\\xC0-\\xDF\\xE0-\\xEF\\xF0-\\xF7]|$)/", "", $str);
		return $str;
		//return iconv("GBK","UTF-8//IGNORE",$str);
	}
	public function g($str){
		return iconv("UTF-8","GBK//IGNORE",$str);
	}
	
	//函数作用：检测提交的值是不是含有SQL注射的字符，防止注射，保护服务器安全 
		//参        数：$sql_str: 提交的变量  返 回 值：返回检测结果，ture or false  函数作者：heiyeluren
		
	function inject_check($sql_str)  {      
		
//		return eregi('select|insert|update|delete|\'|\/\*|\*|\.\.\/|\.\/|union|into|load_file|outfile', $sql_str);
		return eregi('select|insert|update|delete|union|into|load_file|outfile', $sql_str);
	}
	
	function switchDB($dbhost , $dbname){
		$this->db->switchDB($this->DBCFG[$dbhost][$dbname]['dbhost'], $this->DBCFG[$dbhost][$dbname]['dbname'] , $this->DBCFG[$dbhost][$dbname]['dbuser'] , $this->DBCFG[$dbhost][$dbname]['dbpasswd']);
	}
	
			//获取科目名称
	public function get_subject_name($subjectId){
			$subjectName = null;
			switch ($subjectId){
				case '1':
				 $subjectName = 'yw';
				break;	
				case '2':
				 $subjectName = 'sx';
				break;
				case '3':
				 $subjectName = 'yy';
				break;
				case '4':
				 $subjectName = 'wl';
				break;
				case '5':
				 $subjectName = 'hx';
				break;
				case '6':
				 $subjectName = 'sw';
				break;
				case '7':
				 $subjectName = 'dl';
				break;
				case '8':
				 $subjectName = 'ls';
				break;
				case '9':
				 $subjectName = 'zz';
				break;
			}
			return $subjectName;
		}
		
		/**
		 * 根据subject_id 获取对应的 试题表
		 */
	 public function get_examination_tbl($subjectId){
			$tbl = null;
			switch ($subjectId){
				case '1':
				 $tbl = 'yw_exam_question';
				break;	
				case '2':
				 $tbl = 'sx_exam_question';
				break;
				case '3':
				 $tbl = 'yy_exam_question';
				break;
				case '4':
				 $tbl = 'wl_exam_question';
				break;
				case '5':
				 $tbl = 'hx_exam_question';
				break;
				case '6':
				 $tbl = 'sw_exam_question';
				break;
				case '7':
				 $tbl = 'dl_exam_question';
				break;
				case '8':
				 $tbl = 'ls_exam_question';
				break;
				case '9':
				 $tbl = 'zz_exam_question';
				break;
			}
			return $tbl;
		}
		
	 public function get_edu_info($subjectId){
			$subjectName = $this->get_subject_name($subjectId);
			$eduInfo = array();
			$eduInfo['edu_book'] = $subjectName.'_edu_book';
			$eduInfo['edu_chapter'] = $subjectName.'_edu_chapter';
			$eduInfo['edu_chapter2question'] = $subjectName.'_edu_chapter2question';
			$eduInfo['edu_unit'] = $subjectName.'_edu_unit';
			$eduInfo['exam_question'] = $subjectName.'_exam_question';
			$eduInfo['exam_question_index'] = $subjectName.'_exam_question_index';
			$eduInfo['exam_examination'] = $subjectName.'_exam_examination';
			$eduInfo['exam_examination2question'] = $subjectName.'_exam_examination2question';
			$eduInfo['edu_zhuanti'] = $subjectName.'_edu_zhuanti';
			return $eduInfo;
		}

	public function query_curriculumndb(){
//				$centerId =$this->r('center_id');
				$centerId =$this->vr['center_id'];
				$sql = 'select * from tblcenter where id='.$centerId;
				$this->switchDB($this->DBCFG['default_local']['dbhost'],$this->DBCFG['default_local']['dbname']);
				$this->db->sql = $sql;
				$this->db->Queryone();
				$rs = $this->db->rs;
				$result =array();
				
				$result['ip'] =$rs['db_ip'];
				$result['name'] = $rs['db_name']; 
				if($rs){
						$this->b['rs'] =json_encode($result);
						$this->b['sc']  = 200;
						return json_encode($result);
				}else{
						$this->b['rs'] = false;
						$this->b['sc']  = 200;
				}
				
			}
}
//$a = new REST();
//echo $a->method;



?>
