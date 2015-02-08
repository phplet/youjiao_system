<?php
///////////////////////////////////////////////////////
// 删除题本信息接口
// by 孙峻峰 v1.0
///////////////////////////////////////////////////////

	require_once(dirname(__FILE__)."/../../core/interface.php");
	require_once(dirname(__FILE__)."/../../core/sync.php");
	
	class rss extends rs{
		public $uid;
		//验证通过处理
		public function onsucess(){
			
			$rs = $this -> verifytoken();
			//////////////////////////////////验证用户
			if($rs[0]){
				
				$this -> arr["sc"] = 200;
				//用户在user表中的id
				$this -> uid = $rs[1];
				$id = $rs[1];
				
				////////////////////////////////////////////检查是否有历史表记录
				$this -> ifhasrecord1($id);
				$has1 = $this ->db -> rs["id"];
				
				if($has1){
				//历史表中有记录 则更新历史表 更新同步记录表
					
					if($_REQUEST['force']==2){
						$hisid = $this ->db -> rs["id"];
						$this -> upinfo1($hisid);
						
					}
					else{
						//非强制更新
						if($this -> db -> rs["flag"] == $_REQUEST['bookcode']){
							$this -> arr["sc"] = 205;
						}
						else{
							$this -> arr["sc"] = 206;
						}
						$this -> arr["flag"] = $this -> db -> rs["flag"];
						
					}
					
				
				}
				else{
				//历史表中没有记录 则插入历史表 再更新同步记录表
					$this -> insert1();
					$hisid = mysql_insert_id();
				}
				
				//////////////////////////////////////////////////同步表中是否有记录
				
				if($this -> arr["sc"] == 200){
				
					$has2 = $this -> ifhasrecord2($hisid);
				
					if($has2){
					//有同步记录则更新
				
						$syncid = $this ->db -> rs["id"];
						$this -> upinfo2($syncid);
					
					}
					
					//无同步记录则插入
					else{
						$this -> insert2($hisid);
					}
				
				}
				
				
				
				
				
			}
			else{
				$this -> arr["sc"] = 400;
			}
		}
		//是否有历史表记录
		private function ifhasrecord1($id){
			$this -> db -> sql = "select id,flag from study_collection where user_id=".$id." and question_id=".$_REQUEST['ti_id'];
			$this -> db -> Queryone();
			//return $this -> db -> Queryif('study_collection',"user_id=".$id." and question_id=".$_REQUEST['ti_id']);	
		}
		//是否有同步表记录
		private function ifhasrecord2($id){
			return $this -> db -> Queryif('common_sync',"uid=".$this -> uid." and table_name='study_collection' and pid=".$id);	
		}
		//插入历史表数据
		public function insert1(){
			$this -> db -> sql = "insert into study_collection (flag,user_id,add_time,question_id,subject_id) values(".$_REQUEST['bookcode'].",".$this -> uid.",current_timestamp(),".$_REQUEST['ti_id'].",'".$_REQUEST['subjectid']."')";
			$this -> db -> ExecuteSql();
	
		}
		//插入同步表数据
		public function insert2($hisid){
			$this -> db -> sql = "insert into common_sync (pid,table_name,sync_time,delete_flag,source_id,uid) values(".$hisid.",'study_collection',current_timestamp(),0,'".strtotime("now").$this->randStr(118)."',".$this -> uid.")";
			$this -> db -> ExecuteSql();
	
		}
		//更新历史表数据
		public function upinfo1($hisid){
			$this -> db -> sql = 'update study_collection set flag='.$_REQUEST['bookcode'].',add_time=current_timestamp() where id='.$hisid;
			$this -> db -> ExecuteSql();
	
		}
		//更新同步表数据
		public function upinfo2($syncid){
		
			$this -> db -> sql = 'update common_sync set sync_time='.strtotime("now").',delete_flag=0 where id='.$syncid;
			$this -> db -> ExecuteSql();
	
		}
		
	}
	
	
	$rs = new rss("POST",array("username","token","func","time","force"));
	
?>