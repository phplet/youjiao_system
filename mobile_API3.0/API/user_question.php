<?php
/*
 *  用户问题接口
 * 
 *  Author By @TonyJiang
 *
 */

//rest接口


require_once (dirname ( __FILE__ ) . "/../rest.php");


class crest extends REST {
	//GET逻辑
	public function doGET() {
		if(!$this->vr['pass']){
				$this->b['flag'] = false;
				$this->b['sc'] = 401;
				return;
			}
		$action = $this->r ( 'action' );
//		if($this -> vr['pass'] ){
			switch ($action) {
				
				case 'newlist' :
					
					$offset = intval($this->r ( 'offset' ));
					
					$step = $this->r ( 'step' );
					
					$user_id = intval ( $this->r ( 'user_id' ) );
					
					$this->get_question_list_new ( $user_id, $offset, $step );
					
					break;
				
				case 'hotlist' :
					
					$offset = intval($this->r ( 'offset' ));
					
					$step = $this->r ( 'step' );
					
					$user_id = intval ( $this->r ( 'user_id' ) );
					
					$this->get_question_list_hot ( $user_id, $offset, $step );
					
					break;
				
				case 'myquestion' :
					
					$user_id = $this->r ( 'user' );
					
					$offset = intval($this->r ( 'offset' ));
					
					$step = $this->r ( 'step' );
					
					$this->get_my_question_list ( $user_id, $offset, $step );
					
					break;
				
				case 'commentlist' :
					
					$user_id = intval ( $this->r ( 'user_id' ) );
					
					$question_id = $this->r ( 'question' );
					
					$offset = intval($this->r ( 'offset' ));
					
					$step = $this->r ( 'step' );
					
					$this->get_question_comment ( $user_id, $question_id, $offset, $step );
					
					break;
				
				case 'collectlist' :
					
					$user_id = $this->r ( 'user' );
					
					$offset = intval($this->r ( 'offset' ));
					
					$step = $this->r ( 'step' );
					
					$this->get_question_collect ( $user_id, $offset, $step );
					
					break;
				
				case 'daliy_guess_list' :
	
					$offset = intval($this->r ( 'offset' ));
					
					$step = $this->r ( 'step' );
					
					$this->get_daily_guess_list ( $offset, $step );
					
					break;
				
				case 'daily_guess_comment' :
					
					$guess_id = $this->r ( 'id' );
					
					$this->get_daily_guess_comment ( $guess_id );
					
					break;
				
				case 'verify' :
					
					$this->verify_user_collect ();
					
					break;
			
			}
//		}
	
	}
	
	//POST逻辑
	

	public function doPOST() {
		
		$action = $this->r ( 'action' );
//		if($this -> vr['pass']){
			
			switch ($action) {
				case 'add_question' :
					
					$user_id = $this->r ( 'user' );
					//$content = str_replace("\\","\\\\",$this->r( 'p_content' ));
					$content = $this->rcontent ( 'p_content' );
					 
					$pic_content = $this->r ( 'pic_content' );
					
					$this->post_add_question ( $user_id, $content, $pic_content );
					
					break;
				
				case 'add_comment' :
					
					$user_id = $this->r ( 'user' );
					
					$question_id = $this->r ( 'question_id' );
					
					$content = $this->rcontent ( 'p_content' );
					 
					$pic_content = $this->r ( 'pic_content' );
					
					$this->post_add_question_comment ( $user_id, $question_id, $content, $pic_content );
					
					break;
				
				case 'collect_question' :
					
					$user_id = $this->r ( 'user' );
					
					$question_id = $this->r ( 'question_id' );
					
					$comment_id = $this->r ( 'comment_id' );
					
					$this->post_add_question_collect ( $user_id, $question_id, $comment_id );
					
					break;
				
				case 'add_daily_guess' :
					
					$user_id = $this->r ( 'user' );
					
					$content = $this->rcontent( 'c_content' );
					
					$pic_content = $this->r ( 'pic_content' );
					
					$this->post_add_daily_guess ( $user_id, $content, $pic_content );
					
					break;
				
				case 'add_daily_guess_comment' :
					
					$user_id = $this->r ( 'user' );
					
					$daily_guess_id = $this->r ( 'daily_guess_id' );
					
					$content = $this->rcontent ( 'c_content' );
					
					$pic_content = $this->r ( 'pic_content' );
					
					$this->post_add_daily_comment ( $user_id, $daily_guess_id, $content, $pic_content );
					
					break;
				
				case 'remove_question' : //删除我发布的问题
					
	
					$user_id = $this->r ( 'user_id' );
					
					$question_id = $this->r ( 'q_id' );
					
					$this->post_delete_question ( $user_id, $question_id );
					
					break;
				
				case 'remove_collect' : //删除我收藏的问题
					
	
					$user_id = $this->r ( 'user_id' );
					
					$question_id = $this->r ( 'q_id' );
					
					$this->post_delete_question_collect ( $user_id, $question_id );
					
					break;
				
				case 'pic_upload' :
					
					global $mobilePicPath;
					
					$fileName = $this->r ( 'filename' );
					$target_path = $mobilePicPath; //接收文件目录
					
	
					$target_path = $target_path . $fileName;
					
					$this->b ["action"] = $target_path;
					
					if (move_uploaded_file ( $_FILES ['uploadedfile'] ['tmp_name'], $target_path )) {
						
						$this->b ['flag'] = true;
					
					} else {
						
						$this->b ['flag'] = false;
					
					}
	
					break;
			
			}
//		}
	
	}
	
	//获取最新的问题列表
	

	private function get_question_list_new($user_id, $offset, $step) {
		$gradeId  = $this->r('grade_id');
		
		$sql = <<<SQL
                        SELECT a.* , ifnull(c.id,0) as collect_id ,  b.username , b.realname , b.nickname , b.pic FROM usr_question a

                        LEFT JOIN tbluser b  ON a.user_id=b.id

                        LEFT JOIN usr_question_collect c ON a.id=c.question_id AND c.user_id=$user_id
                        
                        WHERE a.grade_id = $gradeId

                        ORDER BY a.create_time DESC


                        LIMIT $offset , $step;
SQL;
		
		$this->db->sql = $sql;
		
		$this->b['sql'] = $this->db->sql;
		$this->db->Query ();
		
		$result = $this->db->rs;
		
		$this->b ['data'] = $this->db->rs;
		
		$question_id = '';
		
		foreach ( $result as $v ) {
			
			$question_id .= $v ['id'] . ',';
		
		}
		
		$question_id = substr ( $question_id, 0, strlen ( $question_id ) - 1 );
		
		$sql3 = <<<SQL

                        SELECT COUNT(*) as count FROM usr_question WHERE grade_id=$gradeId;

SQL;
		
		$this->db->sql = $sql3;
		
		$this->db->Queryone ();
		
		$this->b ['count'] = $this->db->rs ['count'];
		
		$this->b ['sc'] = 200;
	
	}
	
	private function get_question_list_hot($user_id, $offset, $step) {
		$gradeId  = $this->r('grade_id');
		$sql = <<<SQL


                        SELECT a.* , ifnull(c.id,0) as collect_id , b.username , b.realname , b.nickname , b.pic  FROM usr_question a


                        LEFT JOIN tbluser b  ON a.user_id=b.id


                        LEFT JOIN usr_question_collect c ON a.id=c.question_id AND c.user_id=$user_id
                        
                         WHERE a.grade_id = $gradeId


                        ORDER BY a.collect_count DESC


                        LIMIT $offset , $step;


SQL;
		
		$this->db->sql = $sql;
		
		$this->db->Query ();
		
		$this->b ['data'] = $this->db->rs;
		
		$sql2 = <<<SQL

                        SELECT COUNT(*) as count FROM usr_question WHERE grade_id=$gradeId;

SQL;
		
		$this->db->sql = $sql2;
		
		$this->db->Queryone ();
		
		$this->b ['count'] = $this->db->rs ['count'];
		
		$this->b ['sc'] = 200;
	
	}
	
	//获取我的问题
	

	private function get_my_question_list($user_id, $offset, $step) {
		$gradeId = $this->r('grade_id');
		$sql = <<<SQL


                        SELECT a.* , b.username , b.realname , b.nickname , b.pic  FROM usr_question a


                        LEFT JOIN tbluser b  ON a.user_id=b.id


                        WHERE a.user_id= $user_id AND self_visible=1 AND a.grade_id=$gradeId


                        ORDER BY a.create_time DESC


                        LIMIT $offset , $step;


SQL;
		
		$this->db->sql = $sql;
		
		$this->db->Query ();
		
		$this->b['sql1'] = $sql;
		$this->b ['data'] = $this->db->rs;
		
		$sql2 = <<<SQL

                        SELECT COUNT(*) as count FROM usr_question  WHERE user_id=$user_id AND self_visible=1 AND  grade_id=$gradeId;

SQL;
		
		$this->db->sql = $sql2;
		
		$this->b['sql2'] = $sql2;
		$this->db->Queryone ();
		
		$this->b ['count'] = $this->db->rs ['count'];
		
		$this->b ['sc'] = 200;
	
	}
	
	//获取问题的评论
	

	private function get_question_comment($user_id, $question_id, $offset, $step) {
		$gradeId = $this->r('grade_id');
		$sql = <<<SQL

                        SELECT a.* ,   ifnull(c.id,0) as collect_id , b.username , b.realname , b.nickname , b.pic FROM usr_question_comment a


                        LEFT JOIN tbluser b ON a.user_id=b.id


                        LEFT JOIN usr_question_collect c ON a.id=c.comment_id  and c.user_id=$user_id


                        WHERE a.question_id= $question_id AND a.grade_id = $gradeId


                        ORDER BY a.create_time DESC


                        LIMIT $offset , $step;

SQL;
		
		$this->db->sql = $sql;
		
		$this->db->Query ();
		
		$this->b ['data'] = $this->db->rs;
		
		$this->b ['sc'] = 200;
	
	}
	
	private function get_question_collect($user_id, $offset, $step) {
		
		//        $sql = <<<SQL
		

		//                                SELECT a.* , b.content as question_content , c.content as comment_content FROM usr_question_collect a
		

		//                                LEFT JOIN usr_question b ON a.question_id=b.id
		

		//                                LEFT JOIN usr_question_comment c ON a.comment_id=c.id
		

		//                                WHERE a.user_id=$user_id
		

		//                                ORDER BY b.create_time DESC
		

		//                                LIMIT $offset , $step
		

		//SQL;
		
		$gradeId = $this->r('grade_id');

		$sql = <<<SQL


                                    SELECT a.* , b.content as question_content , b.pic_content as pic_content1 , b.collect_count,b.comment_count,c.pic_content as pic_content2 , c.content as comment_content , a.create_time as collect_time , d.nickname FROM usr_question_collect a


                                    LEFT JOIN usr_question b ON a.question_id=b.id


                                    LEFT JOIN usr_question_comment c ON a.comment_id=c.id


                                    LEFT JOIN tbluser d ON a.user_id=d.id


                                    WHERE a.user_id= $user_id AND a.grade_id = $gradeId


                                    ORDER BY create_time DESC

SQL;
		
		$this->db->sql = $sql;
		
		$this->db->Query ();
		
		$rs = $this->db->rs;
		
		$rsTmp = array ();
		
		$tmp = array ();
		
		foreach ( $rs as $key => $value ) {
			
			if (! $rsTmp ['question'] [$value ['question_id']]) {
				
				$rsTmp ['question'] [$value ['question_id']] ['user_id'] = $value ['user_id'];
				
				$rsTmp ['question'] [$value ['question_id']] ['nickname'] = $value ['nickname'];
				
				$rsTmp ['question'] [$value ['question_id']] ['collect_time'] = $value ['collect_time'];
				
				$rsTmp ['question'] [$value ['question_id']] ['qustion_id'] = $value ['question_id'];
				
				$rsTmp ['question'] [$value ['question_id']] ['question_content'] = $value ['question_content'];
				
				$rsTmp ['question'] [$value ['question_id']] ['pic_content'] = $value ['pic_content1'];
				
				$rsTmp ['question'] [$value ['question_id']] ['commentlist'] = array ();
			
			}
			
			if ($value ['comment_id']) {
				
				$rsTmp ['question'] [$value ['question_id']] ['commentlist'] [] = array (

				'comment_id' => $value ['comment_id'], 

				'comment_content' => $value ['comment_content'], 

				'pic_content' => $value ['pic_content2'], 

				'create_time' => $value ['create_time'], 

				'collect_time' => $value ['collect_time'] );
			
			}
		
		}
		
		$num = count ( $rsTmp ['question'] );
		
		$_rs = array_slice ( $rsTmp ['question'], $offset, $step, true );
		
		$_rs = array_values ( $_rs );
		

		$this->b ['data'] = $_rs;
		
		$this->b ['count'] = $num;
		
		$this->b ['sc'] = 200;
	
	}
	
	//按日期查询每日一猜数据
	

	private function get_daily_guess_list($offset, $step) {
		
		//                    $sql = <<<SQL
		

		//                    
		

		//                    SELECT a.* , b.nickname  , b.realname ,  b.username FROM daily_guess a
		

		//                    LEFT JOIN tbluser b ON a.user_id=b.id
		

		//                    ORDER BY create_time DESC
		

		//                    LIMIT $offset , $step;
		

		//                    
		

		//SQL;
		
		$gradeId = $this->r('grade_id');

		$sql = <<<SQL

     						SELECT a.* , b.nickname  , b.realname ,  b.username,d.file_name as pic FROM daily_guess a
                    LEFT JOIN tbluser b ON a.user_id=b.id
                    left join common_image d on b.id=d.user_id
					
                    WHERE a.grade_id = $gradeId

                                    ORDER BY create_time DESC


                                    LIMIT $offset , $step;


SQL;
		
		$this->db->sql = $sql;
		
		$this->db->Query ();
		
		$rs = $this->db->rs;
		
		foreach ( $rs as $key => $value ) {
			
			$daily_guess_id = $value ['id'];
			
			$sql = <<<SQL


                                    select count(*) as num from daily_guess_comment where daily_guess_id=$daily_guess_id and grade_id=$gradeId;


SQL;
			
			$this->db->sql = $sql;
			
			$this->db->Queryone ();
			
			$rsNum = $this->db->rs;
			
			$rs [$key] ['daily_guess_comment_count'] = $rsNum ['num'];
		
		}
		
		$this->b ['data'] = $rs;
		
		$sql2 = <<<SQL

                        SELECT COUNT(*) as count FROM daily_guess WHERE grade_id=$gradeId;

SQL;
		
		$this->db->sql = $sql2;
		
		$this->db->Queryone ();
		
		$this->b ['count'] = $this->db->rs ['count'];
		
		$this->b ['sc'] = 200;
	
	}
	
	//查询每日一猜的评论
	

	private function get_daily_guess_comment($id) {
		
		$gradeId = $this->r('grade_id');
		
		$sql = <<<SQL

                        SELECT a.* ,  b.username , b.realname , b.nickname , b.pic FROM daily_guess_comment a


                        LEFT JOIN tbluser b ON a.user_id=b.id


                        WHERE a.daily_guess_id= $id AND a.grade_id = $gradeId


                        ORDER BY a.create_time DESC;

SQL;
		
		$this->db->sql = $sql;
		
		$this->db->Query ();
		
		$this->b ['data'] = $this->db->rs;
		
		$this->b ['sc'] = 200;
	
	}
	
	//添加新的问题
	

	private function post_add_question($user_id, $content, $pic_content) {
		
		$insertArray = array (

		'user_id' => $user_id, 

		'content' => $content, 

		'pic_content' => $pic_content, 
		
		'grade_id'=>$this->r('grade_id'),

		'create_time' => 'current_timestamp()' )

		;
		
		$result = $this->db->Insert ( 'usr_question', $insertArray );
		
		$this->b ['flag'] = $result;
		
		$this->b ['sc'] = 200;
	
	}
	
	//添加新评论
	

	private function post_add_question_comment($user_id, $question_id, $content, $pic_content) {
		
		$insertArray = array (

		'user_id' => $user_id, 

		'question_id' => $question_id, 

		'content' => $content, 

		'pic_content' => $pic_content, 
		
		'grade_id'=>$this->r('grade_id'),

		'create_time' => 'current_timestamp()' )

		;
		
		$result = $this->db->Insert ( 'usr_question_comment', $insertArray );
		$this->b['sql'] = $this->db->sql;
		
		if ($result) {
			
			$updateSQL = 'UPDATE usr_question SET comment_count=comment_count+1 WHERE id=' . $question_id;
			
			$this->db->sql = $updateSQL;
			
			$result = $this->db->ExecuteSql ();
			
			if (! $result) {
				
				$reason = 'update failed';
			
			}
		
		} else {
			
			$reason = 'insert failed';
		
		}
		
		$this->b ['flag'] = $result;
		
		$this->b ['sc'] = 200;
	
	}
	
	//收藏问题或者评论，如果commend_id不存在，则收藏问题
	

	private function post_add_question_collect($user_id, $question_id, $comment_id) {
		
		$insertArray = array (

		'user_id' => $user_id, 

		'question_id' => $question_id, 
		
		'grade_id'=>$this->r('grade_id'),

		'create_time' => 'current_timestamp()' )

		;
		
		if ($comment_id) {
			
			$insertArray ['comment_id'] = $comment_id;
		
		}
		
		$result = $this->db->Insert ( 'usr_question_collect', $insertArray );
		
		$reason = '';
		
		if ($result) {
			
			$updateSQL = 'UPDATE usr_question SET collect_count=collect_count+1 WHERE id=' . $question_id;
			
			$this->db->sql = $updateSQL;
			
			$result = $this->db->ExecuteSql ();
			
			if (! $result) {
				
				$reason = 'update failed';
			
			}
		
		} else {
			
			$reason = 'insert failed';
		
		}
		
		$this->b ['flag'] = $result;
		
		if ($result) {
			
			$this->b ['sc'] = 200;
		
		} else {
			
			$this->b ['reason'] = $reason;
			
			$this->b ['sc'] = 405;
		
		}
	
	}
	
	//新增每日一猜
	

	private function post_add_daily_guess($user_id, $content, $pic_content) {
		
		$insertArray = array (

		'user_id' => $user_id, 

		'content' => $content, 

		'pic_content' => $pic_content, 
		
		'grade_id'=>$this->r('grade_id'),

		'create_time' => 'current_timestamp()' );
		$result = $this->db->Insert ( 'daily_guess', $insertArray );
		$this->b['sql'] = $this->db->sql;
		$this->b['flag'] = $result;
		$this->b ['sc'] = 200;
	
	}
	
	//对每日一猜进行评论
	

	private function post_add_daily_comment($user_id, $daily_id, $content, $pic_content) {
		
		$insertArray = array (

		'user_id' => $user_id, 

		'daily_guess_id' => $daily_id, 

		'content' => $content, 

		'pic_content' => $pic_content, 
		
		'grade_id'=>$this->r('grade_id'),

		'create_time' => 'current_timestamp()' )

		;
		
		$result = $this->db->Insert ( 'daily_guess_comment', $insertArray );
	
		
		$this->b ['flag'] = $result;
		
		$this->b ['sc'] = 200;
	
	}
	
	private function post_delete_question($user_id, $question_id) {
		
		$sql = 'UPDATE usr_question SET self_visible=0 WHERE ';
		
		if ($question_id == 'all') {
			
			$sql .= 'user_id=' . $user_id;
		
		} else {
			
			$sql .= 'user_id=' . $user_id . ' AND id IN (' . implode ( ',', explode ( '_', $question_id ) ) . ')';
		
		}
		
		$this->db->sql = $sql;
		
		$result = $this->db->ExecuteSql ();
		
		$this->b ['flag'] = $result;
		
		$this->b ['sc'] = 200;
	
	}
	
	private function post_delete_question_collect($user_id, $question_id) {
		
		$sql = 'DELETE FROM usr_question_collect WHERE ';
		
		if ($question_id == 'all') {
			
			$sql .= 'user_id=' . $user_id;
		
		} else {
			
			$sql .= 'user_id=' . $user_id . ' AND question_id IN (' . implode ( ',', explode ( '_', $question_id ) ) . ')';
		
		}
		
		$this->db->sql = $sql;
		
		$result = $this->db->ExecuteSql ();
		
		$this->b ['sql'] = $sql;
		
		$this->b ['flag'] = $result;
		
		$this->b ['sc'] = 200;
	
	}
	
	private function post_upload_pic($file) {
		
		$filePath = '/data/nginx/htdocs/ticool.hxnetwork.com/pic/mobile_pic';
		
		$urlPath = 'http://192.168.1.61/pic/mobile_pic/';
		
		$file_name = time () . '.';
		
		if (file_put_contents ( $filePath . '/' . $file_name )) {
			
			$this->b ['flag'] = true;
			
			$this->b ['src'] = $urlPath . '/' . $file_name;
		
		} else {
			
			$this->b ['flag'] = false;
		
		}
		
		$this->b ['sc'] = 200;
	
	}
	
	private function verify_user_collect() {
		
		$type = $this->r ( 'type' );
		
		$userId = $this->r ( 'user_id' );
		
		$questionId = $this->r ( 'question_id' );
		
		$commentId = $this->r ( 'comment_id' );
		
		if ($type == '0') { //问题
			

			$sql = <<<SQL


                                    select count(*) as num  from usr_question_collect where user_id=$userId and question_id=$questionId


SQL;
			
			$this->db->sql = $sql;
			
			$this->db->Queryone ();
			
			$rs = $this->db->rs;
			
			$this->b ['num'] = $rs ['num'];
			
			if ($rs ['num'] > 0) {
				
				$this->b ['flag'] = true;
			
			} else {
				
				$this->b ['flag'] = false;
			
			}
			
			$this->b ['sc'] = 200;
		
		} else if ($type == '1') { //评论
			

			$sql = <<<SQL


                                    select count(*) as num  from usr_question_collect where user_id=$userId and question_id=$questionId and comment_id=$commentId


SQL;
			
			$this->db->sql = $sql;
			
			$this->db->Queryone ();
			
			$rs = $this->db->rs;
			
			$this->b ['num'] = $rs ['num'];
			
			if ($rs ['num'] > 0) {
				
				$this->b ['flag'] = true;
			
			} else {
				
				$this->b ['flag'] = false;
			
			}
			
			$this->b ['sc'] = 200;
		
		}
	
	}

}

