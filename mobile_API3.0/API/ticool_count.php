<?php
///////////////////////////////////////////////////////
// 题库统计接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	

	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			switch($this -> urlarr[4]){
				case "user_all":
					$this -> getAll();
				break;
				case "user_date":
					$this -> getOneDay();
				break;
				case "user_month":
					$this -> getOneMonth();
				break;
				default:
				break;
			}
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
		
		//获取激活和注册人数
		private function getALL(){
			$this -> db -> sql = 'select count(*) as total from usr_user';
			$this -> db -> Queryone();
			$this -> b['total'] = $this -> db -> rs['total'];
			$this -> db -> sql = 'select count(*) as ytotal from usr_user where yanzheng=1';
			$this -> db -> Queryone();
			$this -> b['ytotal'] = $this -> db -> rs['ytotal'];
			$this -> b["sc"] = 200;
		}
		//获取指定日期激活和注册人数
		private function getOneDay(){
			$this -> db -> sql = 'select count(*) as total from usr_user where TO_DAYS(reg_time) = TO_DAYS("'.$this -> r('date').'")';
			$this -> db -> Queryone();
			$this -> b['total'] = $this -> db -> rs['total'];
			$this -> db -> sql = 'select count(*) as ytotal from usr_user where yanzheng=1 and TO_DAYS(reg_time) = TO_DAYS("'.$this -> r('date').'")';
			$this -> db -> Queryone();
			$this -> b['ytotal'] = $this -> db -> rs['ytotal'];
			$this -> b['date'] = $this -> r('date');
			$this -> b["sc"] = 200;
		}
		//获取指定月份激活和注册人数
		private function getOneMonth(){
			$this -> db -> sql = 'select count(*) as total from usr_user where DATE_FORMAT(reg_time, "%Y-%m") = "'.$this -> r('date').'"';
			$this -> db -> Queryone();
			$this -> b['total'] = $this -> db -> rs['total'];
			$this -> db -> sql = 'select count(*) as ytotal from usr_user where yanzheng=1 and DATE_FORMAT(reg_time, "%Y-%m") = "'.$this -> r('date').'"';
			$this -> db -> Queryone();
			$this -> b['ytotal'] = $this -> db -> rs['ytotal'];
			$this -> b['date'] = $this -> r('date');
			$this -> b["sc"] = 200;
		}

		
	}
	


?>