<?php
///////////////////////////////////////////////////////
// 获取书籍列表
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			$subject = $this -> make('subject','subject_id');
			$grade = $this -> make('grade','grade_id');
			$publisher = $this -> make('publisher','publisher_id');
		
			$this -> selectandwrites('id,bookname','edu_books',null,null,' '.$subject.' and '.$grade.' and '.$publisher,$result="book_list");
		}
		
 		private function make($key,$myname){
		//$key 提交的数据键名 $myname 数据库存放的字段名
			if($_REQUEST[$key]=="99"){
				$value = ' '.$myname.'!=0';
			}
			else{
				$value = ' '.$myname.'='.$_REQUEST[$key];
			}
			return $value;
		} 

	}

	$rs = new rss("GET",array("subject","grade","publisher","func"));
	
