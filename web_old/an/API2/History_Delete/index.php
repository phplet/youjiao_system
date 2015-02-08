<?php
///////////////////////////////////////////////////////
// 删除题本信息接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	require_once(dirname(__FILE__)."/../../core/sync.php");
	
	class rss extends rs{
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			//////////////////////////////////验证用户
			if($rs[0]){
			
				//用户在user表中的id
				$id = $rs[1];
				$this -> uid = $rs[1];
				
				////////////////////////////////////////////检查是否有历史表记录
				$has1 = $this -> ifhasrecord1($id);
				
				if($has1[0]){
				//历史表中有记录 则删除历史表记录 更新同步记录表
					
					$hisid = $hisid = $this ->db -> rs["id"];
					$this -> deletehis($hisid);
					
					
					
				//////////////////////////////////////////////////同步表中是否有记录
					$has2 = $this -> ifhasrecord2($hisid);
				
					if($has2[0]){
					//有同步记录则更新
				
						$syncid = $this ->db -> rs["id"];
						$this -> upinfo($syncid);
					
					}
					
					//无同步记录则插入
					else{
						//$this -> insert2($hisid);
					}
					
					
					
				
				}
				else{
				//历史表中没有记录 则无操作
					
				}
				
				
				
				$this -> arr["sc"] = 200;
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}
		//是否有历史表记录
		private function ifhasrecord1($id){
			return $this -> db -> Queryif('study_collection',"user_id=".$id." and question_id=".$_REQUEST['ti_id']);	
		}
		//是否有同步表记录
		private function ifhasrecord2($id){
			return $this -> db -> Queryif('common_sync',"uid=".$this -> uid." and table_name='study_collection' and pid=".$id);	
		}
		//删除历史表数据
		public function deletehis($hisid){
			$this -> db -> sql = "delete from study_collection where id=".$hisid;
			$this -> db -> ExecuteSql();
	
		}
		//更新同步表数据
		public function upinfo($syncid){
			
			$this -> db -> sql = 'update common_sync set sync_time='.strtotime("now").',delete_flag=1 where id='.$syncid;
			$this -> db -> ExecuteSql();
	
		}
		
	}
	
	
	$rs = new rss("POST",array("username","token","func","time"));
	
?>