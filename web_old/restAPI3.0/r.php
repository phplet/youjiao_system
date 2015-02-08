<?php
	route();
	//路由函数
	function route(){
		//rest接口
		$PATH = dirname(__FILE__)."/../../../mobile_API3.0/API/";
		//$PATH = dirname(__FILE__)."/API/";
		
		$arr = explode("/",$_REQUEST['path']); //nginx
		//$arr = explode("/",$_SERVER['PHP_SELF']);   //66
		 
		if(isset($arr[2])){
			switch($arr[2]){
				case "user":
					$api = routeUser($arr);						
					break;
				case "school":
					$api = routeSchool($arr);
					break;
				case "demo":
					$api = "demo";
					break;
				case "history":
					$api = "history";
					break;
				case "book":
					$api = "book_list";
					break;
				case "city":
					$api = "city";
					break;
				case "district":
					$api = "district_list";
					break;
				case "province":
					$api = "province";
					break;
				case "subject":
					$api = "subject_list";
					break;
				case "chapter":
					$api = "chapter";
					break;
				case "grade":
					$api = "grade_list";
					break;
				case "evaluation":
					$api = "evaluation";
					break;
				case "examcondition":
					$api = "examcondition";
					break;
				case "exam":
					$api = routeExam($arr);
					break;
				case "mark":
					$api = "mark";
					break;
				case "class":
					$api = "class";
					break;
				case "test":
					$api = "test";
					break;
				case "zhuanti":
					$api = routeZhuanti($arr);
					break;
				case "ticool":
					$api = routeTicool($arr);
					break;
				case "thirdpart":
					$api = "thirdpart";
					break;
				case "question":
					$api = "question";
					break;
				case "pub_exam":
					$api = routePub_exam($arr);
					break;
				case "push":
					$api = "push";
					break;
				case "active":
					$api = "active";
					break;
				case "knowledge":
					$api = "knowledge";
					break;
				case "encrypt":
					$api = "encrypt";
					break;
				case "createxam":
					$api = "createxam";
					break;
				case "zhenti":
					$api = routeZhenti($arr);
					break;
				case "news":
					$api = "news";
					break;
				case "dev_test":
					$api = "dev_test";
					break;
				case "center":
					$api = "center";
					break;
				case "center_admin";
					$api = "center_admin";
					break;
				case "center_zone":
					$api = "center_zone";
					break;
				case "center_zone_admin":
					$api = "center_zone_admin";
					break;
				case "teacher":
					$api = "teacher";
					break;
				case "verify":
					$api = 'verify';
					break;
				case "student":
					$api = 'student';
					break;
				case 'class':
					$api = 'class';
					break;
				case 'sync':
					$api = 'sync';
					break;
				case 'examination_paper':
					$api = 'examination_paper';
					break;
				case 'assign':
					$api = 'assign';
					break;
				case 'exercise_query':
					$api = 'exercise_query';
					break;
				case 'exercise_post':
					$api = 'exercise_post';
					break;
				case 'favorite':
					$api = 'favorite';
					break;
				case 'get_word':
					$api = 'get_word';
					break;
				case 'notice':
					$api = 'notice';
					break;
				case 'ability':
					$api = 'ability';
					break;
				case 'stat':
					$api = 'stat';
					break;
				case 'remark':
					$api = 'remark';
					break;
				case 'time_stat':
					$api = 'time_stat';
					break;
				case 'batch_user':
					$api = 'batch_user';
					break;
				case 'avatar':
					$api = 'avatar';
					break;
				case 'notes_exercise':
					$api = 'notes_exercise';
					break;
				case 'mobile_version':
					$api = 'mobile_version';
					break;
				case 'cd_interface':
					$api = 'cd_interface';
					break;
				case "offlinedown": //离线下载
					$api = routeOfflinedown($arr);
					break;
				case "pay": //在线支付
					$api = routePay($arr);
					break;
				case 'user_question':
					$api = 'user_question';
					break;
				case 'update_data':
					$api = 'update_data';
					break;
				case 'upload_word_api':
					$api = 'upload_word_api';
					break;
				case 'image_validation':
					$api = 'image_validation';
					break;
				case 'test_comment':
					$api = 'test_comment';
					break;
				default:
					break;
			}

			if(file_exists($PATH.$api.".php")){
				require_once($PATH.$api.".php");
				new crest($arr);
			}
			else{
				header("HTTP/1.1 404 Not Found");
			}
			
			
		}
		
	}
	//user路由
	function routeUser($arr){
		if(isset($arr[3])){
			if($arr[3]=="student" or $arr[3]=="teacher" or $arr[3]=="parent" or $arr[3]=="id"){
							
				if($arr[4]=="list"){
					$api = $arr[3]."_list";
				}
				else if($arr[4]=="count"){
					$api = $arr[3]."_".$arr[4];
				}
				else if($arr[4]=="evalution"){
					$api = $arr[3]."_".$arr[4];
				}
							
				else{
					$api = $arr[2];
				}
				return $api;
			}
			else if($arr[3]=="updateinfo"){
				return $api = $arr[2];
			}
			else if($arr[3]=="updatereginfo"){
				return $api = $arr[2];
			}
			else if($arr[3]=="updatestudentinfo"){
				return $api = $arr[2];
			}
				
			else if($arr[3]=="resetPwd"){
				return $api = $arr[2];
			}
			else if($arr[3]=="getPassword" or $arr[3]=="pic"){
				return $api = $arr[2];
			}
			else if($arr[3]=="activeuser" or $arr[3]=="activeemail"){
				return $api = $arr[2];
			}
			else if($arr[3]=="name2id"){
				return $api = $arr[2];
			}
			else if($arr[3]=="stulg"){
				return $api = $arr[2];
			}
			else if($arr[3]=="modifyPassword"){
				return $api = $arr[2];
			}
			else{
				return null;
			}
		}
		else{
			return $api = $arr[2];	
		}	
	}
	//school路由
	function routeSchool($arr){
		return $api = $arr[2];
	}
	//exam路由
	function routeExam($arr){
		if($arr[3]=="list"){
			$api = "exam_list";
		}
		else{
			$api = $arr[2];
		}
		return $api;
	}
	
	//ticool路由
	function routeTicool($arr){
		$api = "ticool_";
		switch($arr[3]){
			case "feedback":
				$api .= "feedback";
			break;
			case "version":
				$api .= "version";
			break;
			case "hardinfo":
				$api .= "hardinfo";
			break;
			case "user_history":
				if($arr[4]=="bat"){
					$api .= "user_history_bat";
				}
				else{
					$api .= "user_history";
				}
				
			break;
			default:
				$api .= $arr[3];
			break;
		}
		return $api;
	}
	//zhuanti路由
	function routeZhuanti($arr){
		switch($arr[3]){
			case "list":
				$api = "zhuanti_list";
			break;
			default:
				$api = "zhuanti";
			break;
		}
		return $api;
	}
	
    //zhenti路由
	function routeZhenti($arr){
		switch($arr[3]){
			default:
				$api = "zhenti";
			break;
		}
		return $api;
	}
	
	
	
	//pub_exam路由
	function routePub_exam($arr){
		switch($arr[3]){
			case "list":
				$api = "pub_exam_list";
			break;
			default:
				$api = "pub_exam";
			break;
		}
		return $api;
	}
	
	
	    //Offlinedown路由
	function routeOfflinedown($arr){
		$api = "offlinedown_";
		switch($arr[3]){
			case "list":
				$api .= "list";
			break;
			default:
				$api .= $arr[3];
			break;
		}
		return $api;
	}	

	//pay路由
	function routePay($arr){
       return $api = $arr[2];
	}

?>
