<?php
///////////////////////////////////////////////////////
// 新闻接口
// by tonyjiang v1.0
///////////////////////////////////////////////////////
	//rest接口
	require_once(dirname(__FILE__)."/../rest.php");
	class crest extends REST{
		//GET逻辑
		public function doGET(){
			if(!$this->vr['pass']){
				return $this->b['sc'] = 401;
			}
			//如果是个人新闻，则ID为个人ID，如果是学校新闻，则ID为学校ID
			$id = $this -> r('id');
			$listtype = $this->r('listtype');
			$pageNo = intval($this->r('pageno'))-1;
			$countPerPage = $this->r('countperpage');
			$this->get_news_list($id, $listtype,$pageNo*$countPerPage,$countPerPage);
			
		}
		
		public function doPOST(){
			$action = $this->r('action');
			if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
			if($action == 'add'){
				$title = $this->r('title');
				$content = $this->r('content');
				$active = $this->r('active');
				$expire_date = $this->r('expire_date');
				if(!$expire_date){
					$expire_date = '';
				}
				$this->post_add_news($title,$content,$active,$expire_date);
			}else if($action == 'edit'){
				$title = $this->r('title');
				$content = $this->r('content');
				$active = $this->r('active');
				$expire_date = $this->r('expire_date');
				$newsid = $this->r('newsid');
				if(!$expire_date){
					$expire_date = '';
				}
				$this->post_modify_news($newsid , $title,$content,$active,$expire_date);
			}else if($action == 'del'){
				$newsid = $this->r('newsid');
				$this->post_delete_news($newsid);
			}
		}
		
		
		//获取新闻列表
		private function get_news_list($id , $listType , $offset , $step){
				$userId = $this->r('user_id');
				$studentHandler = new student_handler();
				if($this->vr['usr_type']==1){
					$centerZoneInfo = $studentHandler->get_student_center_zone_info($userId);
					if(count($centerZoneInfo)>0){
							$rsTmp = array();
						foreach ($centerZoneInfo as $czKey=>$czValue){
							$centerId = $czValue['center_id'];
										$sql = <<<SQL
													SELECT 
													newsid ,tblcenter.center_name ,tblcenterzone.zone_name , title , content , active , expire_date , create_by , create_time 
													FROM tblnews 
													left join tblcenter on tblcenter.id=tblnews.center_id
													LEFT JOIN tblcenterzone ON tblnews.zone_id=tblcenterzone.id  where tblnews.center_id=$centerId 
SQL;
			if($this->r('is_expire')=='1'){
//				$where.='  and unix_timestamp(tblnews.expire_date)<unix_timestamp(current_timestamp()) order by create_time desc';
//				$numSql = $sql.''.$where ;
//				$sql .= ' '.$where .' LIMIT '.$offset.','.$step;
			}else if($this->r('is_expire')=="0"){
//				$where.='  and unix_timestamp(tblnews.expire_date)>=unix_timestamp(current_timestamp()) order by create_time desc';
//				$numSql = $sql.' '.$where ;
//				$sql .= ' '.$where .' LIMIT '.$offset.','.$step;
			}else{
				$where.=' order by create_time desc  ';
				$numSql = $sql.' '.$where ;
				$sql .= ' '.$where ;
			}
			
			$this -> db -> sql = $sql;
			$this -> db -> Query();
			$rs= $this -> db -> rs;
			$rsTmp = array_merge($rsTmp,$rs);
			}
						
		}
			$this->b['list']  =array_slice($rsTmp, $offset,$step);	
			$this->b['count'] = count($rsTmp);
			$this -> b["sc"] = 200;
					
					
				}else{
					
				$centerId = $this->r('center_id');
				$sql = <<<SQL
					SELECT 
					newsid ,tblcenter.center_name ,tblcenterzone.zone_name , title , content , active , expire_date , create_by , create_time 
					FROM tblnews 
					left join tblcenter on tblcenter.id=tblnews.center_id
					LEFT JOIN tblcenterzone ON tblnews.zone_id=tblcenterzone.id  where tblnews.center_id=$centerId 
SQL;
//			if($listType == 0){//学校新闻
//				$where = 'tblnews.zonde_id ='.$id;
//			}else{
//				$where = 'tblnews.create_by='.$id;
//			}
			
				
			if($this->r('is_expire')=='1'){
				$where.='  and unix_timestamp(tblnews.expire_date)<unix_timestamp(current_timestamp()) order by create_time desc';
				$numSql = $sql.''.$where ;
				$sql .= ' '.$where .' LIMIT '.$offset.','.$step;
			}else if($this->r('is_expire')=="0"){
				$where.='  and unix_timestamp(tblnews.expire_date)>=unix_timestamp(current_timestamp()) order by create_time desc';
				$numSql = $sql.' '.$where ;
				$sql .= ' '.$where .' LIMIT '.$offset.','.$step;
			}else{
				$where.=' order by create_time desc  ';
				$numSql = $sql.' '.$where ;
				$sql .= ' '.$where .' LIMIT '.$offset.','.$step;
			}
			
			$this -> db -> sql = $sql;
			$this -> db -> Query();
			$rs= $this -> db -> rs;
//			foreach($this->b as $rs){
//				$rs['content'] = urldecode($rs['content']);
//			}
			$this->b['list']  =$rs;
			$this->db->sql = $numSql;
			$this->db->Query();
			$result = $this->db->rs;
			$this->b['count'] = count($result);
			$this -> b["sc"] = 200;
			return true;
			}
		}
		
		private function post_add_news($title , $content , $active , $expire_date){
			$id = $this->vr['id'];
			$zone_id = intval($this->r('zone_id'));
			$center_id = intval($this->r('center_id'));
			$content = urlencode($content);
			
//			$create_time = date('Y-m-d H:i:s');
			$sql = <<<SQL
				INSERT INTO 
				tblnews 
				(title,content,active,expire_date,create_by,zone_id,create_time,center_id) 
				VALUES
				("$title","$content",$active,"$expire_date",$id,$zone_id,now(),$center_id);
				
SQL;
			$this->db->sql = $sql;
//			echo $this->db->sql;
			$this->b['flag'] = $this->db->ExecuteSql();
//			$this->b['sql'] = $sql;
			$this->b['sc'] = 200;
			return true;
		}
		
		//修改新闻信息
		private function post_modify_news($newsid , $title , $content , $active , $expire_date){
			
			$content = urlencode($content);
			
			$sql = <<<SQL
				UPDATE 
				tblnews 
				SET 
				title="$title" , content="$content" , active=$active , expire_date="$expire_date"
				WHERE newsid=$newsid;
SQL;

			$this->db->sql = $sql;
			$this->b['flag'] = $this->db->ExecuteSql();
//			$this->b['sql'] = $sql;
			$this->b['sc'] = 200;
			return true;
		}
		
		//根据ID号 删除新闻
		private function post_delete_news($newsid){
			//先查出有多少图片，将图片删除
			
			global $webroot;
			
			$querySQL = <<<QuerySQL
				SELECT content FROM tblnews WHERE newsid=$newsid;
QuerySQL;

			$this->db->sql = $querySQL;
			$this->db->Queryone();
			$content = urldecode($this->db->rs['content']);
			$content = base64_decode($content);
			
			//匹配到所有图片
			preg_match_all("/<img.*?src=[\\\'| \\\"](.*?)[\\\'|\\\"].*?[\/]?>/",$content,$matches);
			//删除第一项
//			echo 'webroot:'.$webroot;
			array_shift($matches);
//			print_r($matches);
			foreach($matches as $match){
				@unlink($webroot.$match[0]);
			}
			
			$sql = <<<DELETESQL
			DELETE FROM tblnews WHERE newsid=$newsid;
DELETESQL;

			$this->db->sql = $sql;
			$this->b['flag'] = $this->db->ExecuteSql();
//			$this->b['sql'] = $sql;
			$this->b['sc'] = 200;
			return true;
			
			

			
			
		}
		
		
	}
?>