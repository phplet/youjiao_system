<?php
///////////////////////////////////////////////////////
//在线支付接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////
//rest接口
require_once (dirname ( __FILE__ ) . "/../rest.php");

class crest extends REST {
	//GET逻辑
	

	public function doGET() {
		if ($this->vr ['pass']) {
			switch ($this->urlarr [3]) {
				case "servicelist" :
					$grade = $_REQUEST ["grade"];
					
					$this->db->sql = "select * from service_list where grade=" . $grade . " order by id";
					$this->db->Query ();
					$this->b ["sql"] = $this->db->sql;
					$this->b ["service_info"] = $this->db->rs;
					
					$this->b ["sc"] = 200;
					break;
				case "getorderid" :
					$grade = $_REQUEST ["grade"];
					$service_id = $_REQUEST ["service_id"];
					$arr ['grade'] = ( int ) $grade;
					$arr ['order_id'] = $this->get_OrderID ( $grade );
					$arr ['service_id'] = ( int ) $service_id;
					$arr ['user_id'] = ( int ) $this->vr ['id'];
					$arr ['order_detail'] = ""; //(string)$this -> r("order_detail");
					$arr ['order_status'] = 0;
					$arr ['order_date'] = 'current_timestamp()';
					
					$this->db->Insert ( 'service_order_list', $arr );
					$this->b ["sql"] = $this->db->sql;
					
					$this->db->sql = "select order_id from service_order_list where order_id='" . $arr ['order_id'] . "' ";
					$this->db->Queryone ();
					
					$this->b ["order_id"] = $this->db->rs ["order_id"];
					$this->b ["sc"] = 200;
					break;
				case "getorderlist" :
					$grade = $_REQUEST ["grade"];
					$this->db->sql = "select * from service_order_list where grade=" . $grade . "  and  user_id=" . $this->vr ['id'] . " order by order_date desc  limit 0,10";
					$this->db->Query ();
					
					$this->b ["order_list"] = $this->db->rs;
					$this->b ["sc"] = 200;
					break;
			}
		} else {
			$this->b ["sc"] = 401;
		}
	
	}
	
	//POST逻辑
	public function doPOST() {
		if ($this->vr ['pass']) {
			switch ($this->urlarr [3]) {
				case "shareapp" :
					$arr ['name'] = ( string ) $this->r ( 'name' );
					$arr ['share_type'] = ( int ) $this->r ( 'type' );
					$arr ['share_content'] = ( string ) $this->r ( 'content' );
					$arr ['share_date'] = 'current_timestamp()';
					$arr ['user_id'] = ( int ) $this->vr ['id'];
					
					//$this->sql="select id from  usr_shareapp  where  user_id=".$arr['user_id']." and  share_type=" . $arr['share_type'];
					// $rst=$this->Queryone();
					//if ($rst==null)
					//{
					$this->db->Insert ( 'usr_shareapp', $arr );
					//}
					

					$this->b ["sc"] = 201;
					break;
				case "notifyfromapp" :
					$arr ['order_id'] = ( string ) $this->r ( 'order_id' );
					$payment_success = ( int ) $this->r ( 'payment_success' );
					$arr ['user_id'] = ( int ) $this->vr ['id'];
					$arr ['grade'] = ( string ) $this->r ( 'grade' );
					$arr ['payment_date'] = 'current_timestamp()';
					if ($payment_success == 1) {
						$arr ['payment'] = 1;
					} else {
						$arr ['payment'] = - 1;
					}
					$this->db->update ( 'service_order_list', $arr, "order_id='" . $arr ['order_id'] . "'" );
					//$this->b["sql"]=$this -> db ->sql;
					

					$this->updateaccount ( $arr ); //更新账号
					

					$this->b ["sc"] = 201;
					break;
			}
		} else {
			$this->b ["sc"] = 401;
		}
	}
	
	//PUT逻辑
	public function doPUT() {
		$this->b ["sc"] = 405;
	}
	
	//DELETE逻辑
	public function doDELETE() {
		$this->b ["sc"] = 405;
	}
	
	//更新用户的财务信息
	public function updateaccount($arrData) {
		$service_id = 0;
		$totaldays = 0;
		$days = 0;
		$grade_id=$arrData['grade'];
		
		$this->db->sql = "select distinct t1.service_id,t2.value from service_order_list t1 inner join  service_list t2  on  t1.service_id=t2.id where t1.order_id='" . $arrData ["order_id"] . "'";
		
		$this->db->Queryone ();
		if ($this->db->rs != null) {
			$service_id = $this->db->rs ["service_id"];
			$days = ( int ) $this->db->rs ["value"];
		} else {
			return;
		}
		if ($arrData ['payment'] != 1) {
			return;
		}
		
		$totaldays += $days;
		
		$arrtemp ["update_time"] = 'current_timestamp()';
		
		$this->db->sql = "select * from usr_ticool_vip where uid=" . $arrData ["user_id"] ." and grade_id=". $grade_id;
		$this->db->Queryone ();
		if ($this->db->rs != null) { //更新计数
			$totaldays += ( int ) $this->db->rs ["days"];
			$arrtemp ["days"] = $totaldays;
			$arrtemp ["update_time"]='current_timestamp()';
			$arrtemp ["grade_id"] =$grade_id;
			$this->db->update ( 'usr_ticool_vip', $arrtemp, "uid='" . $arrData ["user_id"] . "'  and grade_id=". $grade_id );
		} else {
			$arrtemp ["uid"] = $arrData ["user_id"];
			$arrtemp ["days"] = $totaldays;
			$arrtemp ["update_time"]='current_timestamp()';
			$arrtemp ["grade_id"] =$grade_id;
			
			$this->db->Insert ( 'usr_ticool_vip', $arrtemp );
		}
	    $this->b ["sql"] = $this->db->sql;
		//id,uid,days,update_time
	}
	
	public function get_OrderID($grade) {
		$this->db->sql = "select order_id from service_order_list where grade=" . $grade . "  order by order_date desc,order_id desc limit 0,1";
		$this->db->Queryone ();
		if ($this->db->rs == null) {
			$lastid = "HX" . date ( "Ymd" ) . "000001";
		} else {
			$lastid = $this->db->rs ["order_id"];
		}
		
		$str2 = substr ( $lastid, 0, 10 );
		$n = ( int ) substr ( $lastid, 10 );
		$n += 1;
		$str = "0000" . $n;
		$lastid = $str2 . substr ( $str, strlen ( $str ) - 5 );
		return $lastid;
	
	}
}
?>