<?php
/////////////////////////////////////////////////////////
// php rest 模块v1.0
// by 孙峻峰 2012.1.2
/////////////////////////////////////////////////////////

class REST{

	//获取的REST方法
	public $method;
	//验证通过情况 1通过 2未通过 0 未验证
	public $verify = 0;

	//构造函数 $aimmethod为目标方法 param为目标参数数组
	public function __construct($aimmethod,$param){
		//获取rest方法
		$this->getmethod();
		//验证方法
		$this->verifymethod($aimmethod);
		if($this->verify==0){
			//验证参数
			$this->verifyparam($param);
					
			//设置验证结果
			if($this->verify==0){
				$this->verify = 1;
			}
		}
	}
	//析构函数
    public function __destruct(){
        
    }
	
	//获取rest方法
	private function getmethod(){
		$method =  strtoupper($_REQUEST['_method']);
		switch($method){
			/* case "GET":
				$this->method="GET";
				break; */
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
	}
	//验证参数
	private function verifyparam($param){
		for($i=0;$i<count($param);$i++){
			if($_REQUEST[$param[$i]] == null){
				$this->verify = 2;
				break;
			}
		}
	}
	
	//验证方法
	private function verifymethod($aimmethod){
		if($this->method != $aimmethod){
			$this->verify = 2;
		}
	}
	
	//产生返回结果
	public function mr($arr){
		$arr['time'] = strtotime("now");
		return json_encode($arr);
	}


}
//$a = new REST();
//echo $a->method;



?>