<?php
/**
 * @copyright XK 数据库更新数据
 */
//ini_set("display_errors","On");
//error_reporting(E_ALL);

	require_once(dirname(__FILE__)."/../rest.php");

	class crest extends REST{
		public function doGET(){
			$action = $this->r('action');
			switch ($action){
				
				case 'test':
					$str = '12345678abc';
					ini_set('display_errors', 'On');
					error_reporting(E_ALL);
					
				$a = 1;
				++$a;
				$a*=--$a;
				echo $a;	
					exit;
//				$array = array();
//				$x = is_null($array);
//				$x = file_get_contents('http://www.baidu.com/');
//				var_dump($x) ;

					
					
$a=array('1','3','55','99'); 
$pos = array_search('99', $a);
echo current($a);
exit;
echo $a[$pos];
exit;
					
					
					$num=1123;
					
					function change(&$num){
						$num++;
					}
					change($num);
					echo $num;
					exit;
					
//					echo strrev($str);
					$tmp = '';
					for($i=strlen($str)-1;$i>=0;$i--){
						$tmp.=$str[$i];
					}
					
//					echo $tmp;
//
//					exit;
					
					$k=0;
					for($i=0,$j=strlen($str)-1;$j>(strlen($str)-1)/2;$i++,$j--){
							$k++;
							$tmp = $str[$i];
							$str[$i] = $str[$j];
							$str[$j] = $tmp;
					}
					
//					echo strlen($str);
//					echo $k;
					echo $str;
					exit;
					
					
					
					
	             function traverse($path = '.') {
                  $current_dir = opendir($path);    //opendir()返回一个目录句柄,失败返回false
                  while(($file = readdir($current_dir)) !== false) {    //readdir()返回打开目录句柄中的一个条目
                      $sub_dir = $path . DIRECTORY_SEPARATOR . $file;    //构建子目录路径
                      if($file == '.' || $file == '..') {
                          continue;
                     } else if(is_dir($sub_dir)) {    //如果是目录,进行递归
                         echo 'Directory ' . $file . ':<br>';
                         traverse($sub_dir);
                     } else {    //如果是文件,直接输出
                         echo 'File in Directory ' . $path . ': ' . $file . '<br>';
//                         break;
                     }
                 }
             }
//             traverse(dirname(__DIR__));
             traverse(__FILE__);
             exit;
					
					session_start(); 
// 保存一天 
$lifeTime = 24 * 3600; 
setcookie(session_name(), session_id(), time() + $lifeTime+time(), "/"); 

echo $lifeTime+time().PHP_EOL;
echo session_name().PHP_EOL;
echo session_id();
exit;
					ini_set('display_errors', 'On');
					error_reporting(E_ALL);
	$str=strstr("ababababababdsfgs","ab");
//	$str=strrchr("ababababababdsfgs","ab");
$str=str_pad("abcdefgh",2,"at",1);
					echo $str;
					exit;

function mHash($key){
	$md5 = substr(md5($key), 0,8);
	$seed = 31;
	$hash = 0;
	for($i=0;$i<8;$i++){
//		echo md5($i).'</br>';
//		echo ord(md5($i)).'</br>';
		$hash = $hash*$seed +ord($md5{$i});
		$i++;
//	echo $hash.'</br>';
	}
	return $hash&0x7FFFFFFF;
}
echo mHash('key');
							
					break;
				case 'php_info':
					
					
$br = (php_sapi_name() == "cli")? "":"<br>";

if(!extension_loaded('myfunctions')) {
        dl('myfunctions.' . PHP_SHLIB_SUFFIX);
}
$module = 'myfunctions';
$functions = get_extension_funcs($module);
echo "Functions available in the test extension:$br\n";
foreach($functions as $func) {
    echo $func."$br\n";
}
echo "$br\n";
$function = 'confirm_' . $module . '_compiled';
if (extension_loaded($module)) {
        $str = $function($module);
} else {
        $str = "Module $module is not compiled into PHP";
}
echo "$str\n";

exit;
					print confirm_myfunctions_compiled("");
					echo phpinfo();
					exit;
					break;
				case 'get_zhuanti_list':
					$subjectId = $this->r('subject_id');
					$sectionId = $this->r('section_id');
//					$subjectId = '2';
//					$sectionId = '1';
					$cloudQuestionHandler = new cloud_question_handler();
					$rs = $cloudQuestionHandler->get_query_zhuanti_list($subjectId, $sectionId);
					global $DBCFG;
					$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
					$this->db->Inserts('edu_zhuanti_info', $rs);
					
					print_r($this->db);
					exit;           
					break;
				case 'get_question_list':
					$cloudQuestionHandler = new cloud_question_handler();
										$subjectId = '2';
										$questionType = '27';
										$knowledges = '41,64';
										echo '<pre>';
					$rs  = $cloudQuestionHandler->get_query_question_list($subjectId, $questionType, $knowledges, $offset, $step);
					print_r($rs);
					break;
				case 'get_cloud_bill':
					$userId = '139856';
					$sectionId = '3';
					$knowledges='1423,1409';
					echo '<pre>';
					$cloudQuestionHandler = new cloud_question_handler();
					
					$rs = $cloudQuestionHandler->get_cloud_bill_list($userId, $sectionId, $knowledges, $offset, $step);
					print_r($rs);
					break;
				case 'stat_entity':
					$data['element_id'] = 'sx20130926_00016_000017';
					$data['action_id'] = '1';
					$data['type_id'] = '2';
					$data['count'] = '1';
					$statHandler = new stat_handler();
					$statHandler->stat_cloud_entity($data);
					exit;
				break;
				case 'add_cloud_bill':
					echo '<pre>';
					$userId = '139856';
					$cloudQuestionHandler = new cloud_question_handler();
					$subjectId = '9';
					$sectionId = '3';
					$knowledgeArray = array();
					$resultList = $cloudQuestionHandler->get_query_zhenti_list($subjectId, $sectionId, $type, $year, $province_id, $limit=1);
					if(count($resultList)>0){
						foreach ($resultList as $key=>$value){
							$subjectId = $value['subject_id'];
							$examId = $value['id'];
							$resultQuestion = $cloudQuestionHandler->get_query_zhenti_question($examId, $subjectId);
							$questonIdArray = array();
							foreach ($resultQuestion as $k=>$v){
								$questonIdArray[] = $v['question_id'];
								$knowledgeId = $v['knowledge_id'];
								$knowledgeArrayTmp = explode(',', $knowledgeId);
								foreach ($knowledgeArrayTmp  as $kv){
									 if(!utils_handler::array_value_exists($kv, $knowledgeArray)){
									 		$knowledgeArray[] = $kv;
									 }
								}
							}
							$resultList[$key]['knowledge_id'] = implode(',', $knowledgeArray);
							$resultList[$key]['q_b_name'] = $resultList[$key]['name'];
							$resultList[$key]['q_b_name'] = $resultList[$key]['name'];
							$resultList[$key]['subject_id'] = $subjectId;
							$resultList[$key]['section_id'] = $sectionId;
							$resultList[$key]['user_id'] = $userId;
							$qbId = $cloudQuestionHandler->post_add_cloud_bill($userId, $resultList[$key]);
							if($qbId){
								$questionIds = implode(',', $questonIdArray);
								$cloudQuestionHandler->post_add_question_2_bill_list($qbId, $questionIds, $subjectId);
							}
						}
					}
					
					print_r($knowledgeArray);
					print_r($resultList);
					exit;
				break;
				
				case 'modify_teach_exam_list':
					$this->modify_teach_exam_list();
				break;
				case 'get_section_id':
					$array = array(0,2,array());
					var_dump($array);
					var_export($array);
					$this->get_section_id(10);
					break;
				case 'modify_student_exercise_content':
					$this->	modify_student_exercise_content();
					break;
				case 'modify_assign_list_assign_to':
					$this->modify_assign_list_assign_to();
					break;
				case 'rand':
//					echo $URL=$_SERVER['HTTP_HOST'] ;
					echo $_SERVER['REQUEST_URI'];
					exit;
					    $passwords = array();
					    $str  = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
					    while(count($passwords) < 10000){
					        $np   = '';
					        for($i=0;$i<9;$i++){
					            $np.=$str[rand(0,strlen($str)-1)];
					        }
					        if(!in_array($np,$passwords)) $passwords[] = $np;
					    }
					file_put_contents('a.json', json_encode($passwords));
					echo 'success';
					break;
				case 'recursion':
					ini_set('display_errors', 'On');
					error_reporting(E_ALL);
					
					
					echo '<pre>';
					print_r($this->recursion('0'));
					exit;
					
					break;
				case 'user_level':
//					ini_set('display_errors', 'On');
//					error_reporting(E_ALL);
					$studentHandler = new student_handler();
					$userId = '102785';
					$data['study_exercise_id'] = '6741';
					$data['exercise_id'] = '19201';
					$data['correct_rate'] = '0.68';
					$data['section_id'] = '3';
					$data['subject_id'] = '1';
					$data['exam_type'] = '7';
					$data['level'] = '3';
					$studentHandler->post_change_student_level($userId, $data);
					break;
				case 'ability':
					$teacherHandler = new teacher_handler();
					$teacherHandler->add_center_zone_ability(12, 12, 12);
					break;
					
				case 'exercise_stat':
					//obj_Judge
					
					global $DBCFG;
					$this->db->sql = <<<SQL
											select  user_id,exercise_id,content,create_date,exam_type,subject_id,pi  from study_exercise where content !='' limit 0,1 ;
SQL;
					$this->db->Query();
					$resultExercise = $this->db->rs;
					if(count($resultExercise)){
						foreach ($resultExercise as $eK=>$eV){
							$subjectId = $eV['subject_id'];
							$eduInfo = utils_handler::get_edu_info($subjectId);
							$tableNameIndex = $eduInfo['exam_question_index'];
							$tableName = $eduInfo['exam_question'];
							$this->db->switchDB ( $DBCFG ['default'] ['dbhost'], $DBCFG ['default'] ['dbname'], $DBCFG ['default'] ['dbuser'], $DBCFG ['default'] ['dbpasswd'] );
							foreach ($resultExercise as $key=>$value){
								$content = $value['content'];
								if($content){
									$content = json_decode(base64_decode($content),true);
									foreach ($content as $k=>$v){
										if($v['obj']==1){//客观题
											$tiId = $v['id'];
											$this->db->sql = <<<SQL
														select * from $tableNameIndex 
														left join $tableName on $tableName.gid=$tableNameIndex.gid
														where $tableNameIndex.gid='$tiId';
SQL;
											$this->db->Queryone();
											
											$rs = $this->db->rs;
											
											$answer =$rs['objective_answer'];
											if(trim($answer)==trim($v['answer'])){
												echo 'true';
											}else{
												echo 'false';
											}
//											print_r($this->db);
											
										}else if($v['obj']==0){//主观题
												print_r($content[$k]);
										}
									}
								}
							}
							
						}
					}
//					print_r($resultExercise);
					break;	
				case 'stat':
					ini_set('display_errors', 'On');
					error_reporting(E_ALL);
					$data1['subject_id'] = '1';
					$data1['grade'] = '18';
					$data1['dbtype'] = '1';
					$data1['knowledge_id'] = '10000042';
					$data1['question_count'] = '1000';
					$data1['question_do_count'] = '1';
					$data1['user_id'] = '10087';
					$data1['zhuanti_id'] = '10087123';
					$data1['difficulty'] = '1';
					$data1['question_type'] = '22';
					$statHandler = new stat_handler();
//					$statHandler->stat_knowledge($data);
					print_r($data1);
//					$statHandler->stat_knowledge_user($data1);
//					$statHandler->stat_student_subject_day($data1);
					$statHandler->stat_zhuanti($data1);
					$statHandler->stat_zhuanti_user($data1);
					break;
					
				case 'ti_id':
					$exerciseHandler = new exercise_handler();
					$rs = $exerciseHandler->get_ti_info($tiId='bbs10000001', $subjectId='2', 1);
					echo '<pre>';
					print_r($rs);
					break;
				case 'test':
					ini_set('display_errors', 'On');
					error_reporting(E_ALL);
					$userHandler = new user_handler();
					$classHandler = new class_handler();
					$subjectId = $this->r('subject_id');
					$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
					$eduInfo = utils_handler::get_edu_info($subjectId);
					$zhuantiTab  =$eduInfo['edu_zhuanti'];
			$tableName1 = $eduInfo ['exam_question'];
			$tableName2 = $eduInfo ['exam_question_index'];
				$sql = <<<SQL
				SELECT $zhuantiTab.* FROM $zhuantiTab
				LEFT JOIN edu_grade ON $zhuantiTab.grade_id=edu_grade.id
				WHERE subject_id=$subjectId;
SQL;
				$this->db->sql = $sql;
				$this->db->Query();
				$rs = $this->db->rs;
				foreach ($rs as $key=>$value){
					$zhuanTiId  = $value['id'];
					$knowledgeList = $value['knowledge_list'];
					$knowledgeList = implode( '","',explode( ';',$knowledgeList));
					
					
					$sql = <<<SQL
                                                SELECT count(*) as num FROM $tableName2
                                                LEFT JOIN $tableName1 ON $tableName2 .gid=$tableName1 .gid
                                                WHERE $tableName2.zh_knowledge in ("$knowledgeList ")
                                                
SQL;
					$this->db->sql = $sql;
					$this->db->Queryone();
					$rsZhuanTi =$this->db->rs;
					$tiTotalNum  = $rsZhuanTi['num'];
			
					$sql = <<<SQL
								update $zhuantiTab set ti_total_count=$tiTotalNum where id=$zhuanTiId;
					
SQL;
				   
				   $this->db->sql = $sql;
					$this->db->ExecuteSql();
					
					}
					/**
					$teacherUserIds = array();
					$this->db->sql = <<<SQL
					select id,class_name,end_date from tblclass where class_type=1 and end_date<=now();
SQL;
					$this->db->Query();
					$rs = $this->db->rs;
					foreach ($rs as $key=>$value){
						$classId = $value['id'];
						$this->db->sql = <<<SQL
													select tblteacher.user_id as teacher_user_id from tblclass2teacher 
													left join tblteacher on tblteacher.id=tblclass2teacher.teacher_id where tblclass2teacher.class_id=$classId
SQL;
						$this->db->Query();
						$teacherRs =$this->db->rs;
						
						foreach ($teacherRs as $k=>$v){
							$teacherUserIds[] = $v['teacher_user_id'];
						}
						$classHandler->stat_end_class($classId);	
						$classHandler->add_class_teacher_student_history($teacherUserIds, $classId);
						$classHandler->remove_class_teacher_student($teacherUserIds, $classId);
					}
					
					**/
					echo 'success';
					exit;
					$data['exam_type'] = '3';
					$data['exercise_id'] = '6849';
					$ti_id = '2';
					$rs = $exerciseHandler->is_exist_collection('180909','naa10000042','1','1');
					var_dump($rs);
					exit;
					$exerciseHandler->post_remove_history('181042', $data, 1);
					echo '<pre>';
					exit;
					$statHandler = new stat_handler();
					$userId= '180823';
					
					$data[] = 180823;
					$data[]  ='dbsb10000448';
					$data[]  ='2';
					$data[]  ='20';
					$data[]  ='2';
					
					$data1 = array();
//					$data1[] = 1;
//					$data1[]  ='2';
//					$data1[]  ='3';
//					$data1[]  ='4';
//					$data1[]  ='5';
					
					
					$rs = array_merge($data,$data1);
					$rs = array_merge($rs,$data1);
					
					echo '------------';
					echo '<pre>';
					print_r($rs);
					echo '------------';
					exit();
					array_push($rs, $data);
					print_r($data);
					$statHandler->stat_exercise_ti($data);
					echo 'xxx';
					exit();
//					$statHandler->stat_teacher($teacherInfo, $statField='big_class_count');
					$exerciseHandler = new exercise_handler();
					$studentHandler = new student_handler();
					$classStuId = '2261';
					$studentHandler->stat_lost_student_num($classStuId);
					exit;
					$subject_id = 1;
					$chapter_id = 12674;
					$dbtype = 1;
					$rs = $exerciseHandler->get_query_sync_question($subject_id, $chapter_id, $dbtype);
					
					echo '<pre>';
					print_r($rs);
					exit;
//					$exerciseHandler->analytic_exercise2where($userId, $data);
//					echo $exerciseHandler->get_init_setting($userId);
//					exit;
					
					$data['duration']=27;
					$data['content']['0']['answer']='A';
					$data['content']['0']['id']='ykm10000762';
					$data['content']['0']['obj']='1';
					$data['content']['0']['score']='3';
					$data['content']['0']['dbtype']='1';
					$data['content']['1']['answer']='C';
					$data['content']['1']['id']='ykm10000763';
					$data['content']['1']['obj']='1';
					$data['content']['1']['score']='3';
					$data['content']['1']['dbtype']='1';
					$data['content']['2']['answer']='D';
					$data['content']['2']['id']='ykm10000764';
					$data['content']['2']['obj']='1';
					$data['content']['2']['score']='3';
					$data['content']['2']['dbtype']='1';
					$data['content']['3']['answer']='D';
					$data['content']['3']['id']='ykm10000765';
					$data['content']['3']['obj']='1';
					$data['content']['3']['score']='3';
					$data['content']['3']['dbtype']='1';
					$data['content']['4']['answer']='D';
					$data['content']['4']['id']='ykm10000766';
					$data['content']['4']['obj']='1';
					$data['content']['4']['score']='3';
					$data['content']['4']['dbtype']='1';
					$data['content']['5']['answer']='xxx';
					$data['content']['5']['id']='ykm10000767';
					$data['content']['5']['obj']='0';
					$data['content']['5']['score']='12';
					$data['content']['5']['dbtype']='1';
					$data['content']['6']['answer']='xxx';
					$data['content']['6']['id']='ykm10000768';
					$data['content']['6']['obj']='0';
					$data['content']['6']['score']='17';
					$data['content']['6']['dbtype']='1';
					$data['content']['7']['answer']='xx';
					$data['content']['7']['id']='ykm10000769';
					$data['content']['7']['obj']='0';
					$data['content']['7']['score']='5';
					$data['content']['7']['dbtype']='1';
					$data['content']['8']['answer']='xxx';
					$data['content']['8']['id']='ykm10000770';
					$data['content']['8']['obj']='0';
					$data['content']['8']['score']='8';
					$data['content']['8']['dbtype']='1';
					$data['content']['9']['answer']='xxx';
					$data['content']['9']['id']='ykm10000771';
					$data['content']['9']['obj']='0';
					$data['content']['9']['score']='8';
					$data['content']['9']['dbtype']='1';
					$data['content']['10']['answer']='xxx';
					$data['content']['10']['id']='ykm10000772';
					$data['content']['10']['obj']='0';
					$data['content']['10']['score']='25';
					$data['content']['10']['dbtype']='1';
					$data['content']['11']['answer']='xxx';
					$data['content']['11']['id']='ykm10000773';
					$data['content']['11']['obj']='0';
					$data['content']['11']['score']='60';
					$data['content']['11']['dbtype']='1';
					$data['my_score']='9';
					$data['type']='4';  //正在做
					$data['exam_type']='3';
					$data['subject_id']='2';
					$data['province_id']='13';
					$data['year']='2012';
					$data['exercise_id'] ='6238';
					$data['exam_id'] =$data['exercise_id'];
					$data['grade_id'] =$data['grade_id'];
					$subjectId = $data['subject_id'];
					$examId = $data['exam_id'];
					$dbtype =1;
					$exerciseHandler->post_add_exercise_result($userId,$data);
					$exerciseHandler->post_add_init_setting($userId, $data);
					$rs = $exerciseHandler->get_query_zhenti_question($userId, $examId, $subjectId, $dbtype);
					$exerciseInfo = $rs['exercise_info'];
					$data['exam_id'] =$exerciseInfo['id']; 
					$data['user_id'] =$userId; 
					$data['name'] =$exerciseInfo['name']; 
					$data['exam_type'] =3; 
					$data['content'] =$exerciseInfo['content']; 
					$data['exam_count'] = 0;
					/**
					 * 
					 */
					foreach (json_decode($data['content'],true) as $key=>$value){
						if(isset($value['dbtype'])&&isset($value['ids'])){
							$data['exam_count'] = count($value['ids']);
						}
					}
					
					$exerciseHandler->post_add_exercise_count($data);
					$exerciseHandler->post_add_teach_self($userId,$data);
					$exerciseHandler->post_add_history($userId, $data, $dbtype);
					
					
					exit;
				$rs = $exerciseHandler->get_query_zhuanti_question($subject_id, $zhuanti_id, $question_type, $question_difficulty, $question_count,$dbtype);
				$userId ='180823';
				$subject_id = '1';
				$section_id = '3';
				$type = '1';
				$year = '2011';
				$province_id = '';
				$limit =12;
				$rs1 = $exerciseHandler->get_query_zhenti($userId, $subject_id, $section_id, $type, $year, $province_id,$limit);
				
				$userId ='180823';
				$exam_id = '6881';
				$subject_id = '1';
				$dbtype = '1';
				
				$rs2 = $exerciseHandler->get_query_zhenti_question($userId, $exam_id, $subject_id, $dbtype);
				echo '<pre>';
//				print_r($rs2);
				exit;
				
				
//					$centerId = '132';
//					$zoneId = '150';
//					$studentId = '305';
//					$teacherList = array();
//					$teacherList[0]['id'] = 479;
//					$teacherList[0]['name'] = '张语文';
//					$classType = 2;
//					$studentUserId = '586';
//					$student = new student_handler();
//					$teacher= new teacher_handler();
//					$centerZoneHandler = new center_zone_handler();
//					$condition = 'center_id^139$zone_id^176';
//					$rs = $student->get_student_list(0, 100, $condition, 0);
//					$userInfo[0]['user_id']='123';
//					$userInfo[1]['user_id']='123';
//					$userInfo[2]['user_id']='123';
//					$userInfo[3]['user_id']='123';
//					$userInfo[4]['user_id']='123';
//					$centerId = 139;
//					$userType = 2;
//					$num = $centerZoneHandler->beyond_allow_batch_users_count($userInfo, $centerId, $userType);
					$teacherInfo = array();
					$teacherInfo['center_id'] = 132;
					$teacherInfo['zone_id'] = 150;
					$teacherInfo['username'] = 'helloworld123123@163.com';
					$teacherInfo['realname'] = '张大莎';
					$teacherInfo['level'] = '4';
 					$teacherInfo['usr_type'] = '2';
					$teacherInfo['gender'] = '1';
					$teacherInfo['passwd'] = '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92';
					$teacherInfo['tel'] = '13611283281';
					$teacherInfo['email'] = '303@qq.com';
					$teacherInfo['subject_id'] = '1';
					$teacherInfo['note'] = 'this is test';
					
		
					$rsTeacher = $teacher->add_teacher($creatorId='180433', $teacherInfo);
				
					
//					$user = new user_handler();
//					$whereArray['zone_id'] = '1789';
//					$whereArray['user_id'] = '180815';
//					$table = 'tblcenterzoneadmin';
//					$operateStatus = 0;
////					echo $user->add_table_history_info($table, $whereArray, $operateStatus);
//					echo $user->remove_table_info($table, $whereArray);
//					exit;
				$studentInfo['center_id'] = 132;
				$studentInfo['zone_id'] = 150;
				$studentInfo['username'] = 'this_test_new';
				$studentInfo['realname'] = '测试同学';
				$studentInfo['gender'] = '2';
				$studentInfo['tel'] = '1235666';
				$studentInfo['email'] = 'css@qq.com';
				$studentInfo['note'] = 'leeeKy';
				$studentInfo['school_name'] = '私立';
				$studentInfo['grade'] = '3';
				$studentInfo['class_type'] = '1';
				$studentInfo['teacher_list'][0]['id'] ='1256';
				$studentInfo['teacher_list'][0]['name'] ='李数学';
				$studentInfo['class_id'] = '1158';
					
					
//				 $student->add_student($creatorId='180433',$studentInfo);
					$class = new class_handler();
					$user = new user_handler();
					$stat = new stat_handler();
					$condition = 'center_id^132$zone_id^150$class_id^0$new_student_status^1';
					$conditionTeacher = 'center_id^32$zone_id^50$level^4$subject_id^1';
					$noClassStu = 1;
//					$rs = $student->get_no_class_student_list(0,10,$centerId,$zoneId,$condition,$noClassStu); 
					$teacherUserIds[0] = '180815';
					$classId = 1188;
					$class->remove_class_teacher_student($teacherUserIds, $classId);
					echo '<pre>';
					exit;
//					echo $student->get_stu_in_class_num(293, $classType=2,$status=0);

					$a[0]['id']=1;
					$a[0]['num']=5;
					$a[1]['id']=2;
					$a[1]['num']=10;
					$a[2]['id'] =3;
					$a[2]['num'] =25;
//					echo utils_handler::get_array_value_total($a,'num');
//					exit;
					
					$fresh =0;
//					$rs = $class->get_class_list(0, 20, $condition, $fresh, $userType=2, $level=4);
					$creatorId = '433';
					$classInfo = array();
					$classInfo['center_id'] = '32';
					$classInfo['zone_id'] = '50';
					$classInfo['class_name']='晓坤_class_handler';
					$classInfo['class_section']='2';
					$classInfo['begin_date'] = '2013-12-25';
					$classInfo['end_date'] = '2015-12-25';
					$classInfo['num_max'] = 20;
					$classInfo['teacher_list'] = '255';
//					$rs  = $class->add_class($creatorId, $classInfo);
					
					$teacher_ids = explode('_' , $classInfo['teacher_list']);
					
					$teacherClassInfo = array();
					
					foreach($teacher_ids as $teacher_id){
						$teacherBaseInfo = $teacher->get_teacher_info($teacher_id);
						$teacherInfo[] = array(
							'user_id'=>$teacherBaseInfo['id'],
							'center_id'=>$classInfo['center_id'],
							'zone_id'=>$classInfo['zone_id']
						);
					}
					$stat->stat_teacher($teacherInfo, $statField='big_class_count');
					
					$stat->stat_zone_center($classInfo, 'class_new_big_count');
//					$rs = $teacher->get_teacher_taught_student('256','','1','1',false);
//					$rs = array_merge($rsStu,$rs);
					echo '<pre>';
					print_r($rs);
//					$rs = $teacher->check_teacher_in_small_class(222);
					break;
				}
			}
		
		public function get_section_id($gradeId){
			$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
			$this->db->sql = <<<SQL
										select section_id from edu_grade where id=$gradeId;
SQL;
			$this->db->Queryone();
			$rs = $this->db->rs;
			return $rs['section_id'];
		}
		public function modify_teach_exam_list(){
			$offset = intval($this->r('offset'));
			$step = $this->r('step');
//			ini_set('display_errors', 'On');
//			$this->switchDB($this->DBCFG['default_local']['dbhost'],$this->DBCFG['default_local']['dbname']);
			$this->db->sql = <<<SQL
										select id,name,exam_type,subject_id,conditions,content from teach_exam_list order by id asc limit $offset , $step ;
SQL;
//			echo $this->db->sql;
			$this->db->Query();
			$rs = $this->db->rs;
			
			if(count($rs)>0){
				foreach ($rs as $key=>$value){
					$conditionTmp = array();
					$conditionTmp['queTwo'] =array();
					$conditionTmp['queThree'] =array();
					$tiTmp = array();
					$testname = $value['name'];
					$testtype = $value['exam_type'];
					$subjectId = $value['subject_id'];
					$conditions = json_decode($value['conditions'],true);
					$gradeId = $conditions['condition']['grade_id'];
					$sectionId = $this->get_section_id($gradeId);
//					exit;
					$tikuType =1;
					$content = explode(',', $value['content']);
					
					$dbContent = array(0=>array('dbtype'=>'1','ids'=>$content),1=>array('dbtype'=>'2'));
					
					$gids = '"' .implode('","' , $content).'"' ;
					$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
					$eduInfo = $this->get_edu_info($subjectId);
					$ExamQuestionIndex = $eduInfo['exam_question_index'];
					$this->db->sql =<<<SQL
												select  distinct question_type from $ExamQuestionIndex where gid in ($gids);
SQL;
					$this->db->Query();
					$questionTypeRs = $this->db->rs;
					if(count($content)>0){
						$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
		
						foreach ($content as $k=>$v){
							$this->switchDB($this->DBCFG['default']['dbhost'],$this->DBCFG['default']['dbname']);
							$this->db->sql = <<<SQL
													  select gid,score,objective_flag,question_type from $ExamQuestionIndex where gid='$v';
SQL;
							$this->db->Queryone();
							$tiTmp[] = $this->db->rs;
						}
					}
					$questionTwo = array();
					$questionThree = array();
					foreach ($questionTypeRs as $k=>$v){
						$questionTwo[$k]['ids'] =array();
						$questionThree[$k]['ids'] =array();
						$questionNum = 0;
						foreach ($tiTmp as $k1=>$v1){
							if($v['question_type']==$v1['question_type']){
								$questionNum ++;
								$ids = array();
								$questionTwo[$k]['typename'] = $v1['question_type'];
								$ids['id'] = $v1['gid'];
								$ids['dbtype'] = 1;
								array_push($questionTwo[$k]['ids'], $ids);
								$questionThree[$k]['typename'] = $v1['question_type'];
								$questionThree[$k]['sum'] = $questionNum;
								$questionThree [$k]['sorceP'] = $v1['score'];
								$questionThree [$k]['sorces'] = $v1['score']*$questionNum;
								array_push($questionThree[$k]['ids'], $ids);
							}
						}
					}
					$conditionTmp['data_test']['testname'] = $testname;
					$conditionTmp['data_test']['testtype'] = $testtype;
					$conditionTmp['data_test']['subject_id'] = $subjectId;
					$conditionTmp['data_test']['grade'] = $gradeId;
					$conditionTmp['data_test']['section_id'] = $sectionId;
					$conditionTmp['data_test']['tiky_type'] = $tikuType;
					$conditionTmp['data_test']['curriculumndb']['ip'] = $this->DBCFG['default']['dbhost'];
					$conditionTmp['data_test']['curriculumndb']['name'] = $this->DBCFG['default']['dbname'];
					$conditionTmp['data_test']['tab_Sids'] = '2';
					$conditionTmp['data_test']['special'] = array();
					$conditionTmp['queTwo'] =base64_encode(json_encode($questionTwo));
					$conditionTmp['queThree'] = base64_encode(json_encode($questionThree));
				 $json_db_content = json_encode($dbContent);
				 $json_db_conditions = json_encode($conditionTmp);
				
//				 print_r($questionThree);
				 $id = $value['id'];
				 echo $id.'</br>';
				 $this->db->switchDB('localhost','ticoolv2_copy','root','123456');
				 $this->db->sql = <<<SQL
				 	update teach_exam_list set  content='$json_db_content',conditions='$json_db_conditions' where id=$id; 
SQL;
//				echo $this->db->sql;
				$this->db->ExecuteSql();
				}
			}
//				exit;
//			$this->b['data'] = $this->db->rs;
		}
		
		public function modify_student_exercise_content(){
			$offset = intval($this->r('offset'));
			$step = $this->r('step');
			$this->db->sql = <<<SQL
										select id,content from study_exercise where type=2 or type=3 order by id asc limit $offset , $step ;
SQL;
			$this->db->Query();
			$this->b['sql'] = $this->db->sql;
			$rs = $this->db->rs;
			$this->b['rs'] = $rs;
			if(count($rs)>0){
				foreach ($rs as $key=>$value ){
					$id = $value['id'];
					$content = json_decode(base64_decode($value['content']),true);
					if(count($content)>0){
						foreach ($content as $k=>$v){
							$content[$k]['dbtype'] =1;
							$content[$k]['attachment'] ='';
							$content[$k]['pi'] ='';
							$content[$k]['obj_Judge'] =1;
						}
					}
					$content = base64_encode(json_encode($content));
					$this->db->sql = <<<SQL
												update study_exercise set content='$content' where id=$id;
SQL;
//echo $this->db->sql.'</br>';
					$this->db->ExecuteSql();
					$rs = $this->db->rs;
					echo $id.'</br>';
					if($rs){
						$this->b['flag'] = true;
					}else{
						$this->b['flag'] = true;
					}
				}	
			}
			
			exit;
		}
		
		public function modify_assign_list_assign_to(){
			$offset = intval($this->r('offset'));
			$step = $this->r('step');
			$this->db->sql = <<<SQL
									select id as assign_id,exam_id,assign_to,assign_student_count,creator from teach_assign_list  order by id asc limit $offset , $step ;
SQL;
			$this->db->Query();
			$rs = $this->db->rs;
			$this->b['db'] = $this->db;
			if(count($rs)>0){
				foreach ($rs as $key=>$value){
					$assignId = $value['assign_id'];
					$assignTo = json_decode($value['assign_to'],true);
					$assignTmp = array();
					$teacherUserId = $value['creator'];
					foreach ($assignTo as $k=>$v){
						if($v['student_id']){
							$student = explode(',', $v['student_id']);
							$assignStudentCount = count($student);
//							print_r($student);
							$studentTmp = array();
							foreach ($student as $k1=>$v1){
								$studentUserId=$v1;  //查到到老师带过班级、学生加入的班级的交集
								$this->db->sql = <<<SQL
																select  a.class_id,a.class_name from (select tblclass2student.class_id,tblclass.class_name from tblclass2student 
																left join tblstudent on tblclass2student.student_id=tblstudent.id
																left join tbluser on tbluser.id=tblstudent.user_id
																left join tblclass on tblclass.id=tblclass2student.class_id
																where tbluser.id=$studentUserId ) as a
																cross join 
																(select tblclass2teacher.class_id from tblclass2teacher 
																left join tblteacher on tblteacher.id=tblclass2teacher.teacher_id
																where tblteacher.user_id=$teacherUserId) as b
																on a.class_id=b.class_id
																								
SQL;
							$this->db->Queryone();
							$rsClass = $this->db->rs;
							
							$studentClassInfo = array();
							$classId = $rsClass['class_id'];
							$className = urlencode($rsClass['class_name']);
							$studentClassInfo['class_id'] = $classId;
							$studentClassInfo['class_name']  = $className;
							
							
							$this->db->sql = <<<SQL
															select realname from tbluser where id=$studentUserId;
SQL;
							$this->db->Queryone();
							$rsStudent = $this->db->rs;
							$studentRealname = $rsStudent['realname'];
							$studentClassInfo['stu_id'] = $studentUserId;
							$studentClassInfo['stu_name'] = urlencode($studentRealname);
//							print_r($studentClassInfo);
							array_push($assignTmp, $studentClassInfo);
							$rs[$key]['assign_student_count'] =  count($student);
							}
						}
					}
					
					if(count($assignTmp)>0){
						foreach ($assignTmp as $k=>$v){
							foreach ($assignTmp as $k1 => $v1) {
								if($value1['class_id']=$v1['class_id']){
									$stuIds = array('stu_id'=>$v1['stu_id'],'stu_name'=>$v1['stu_name']);
									$assignTmp[$k]['stu_ids'][]=$stuIds; 
								}
							}
							$assignTmp[$k]['stu_num'] = count($assignTmp[$k]['stu_ids']);
						}
					}
				
					foreach ($assignTmp as $k=>$v){
						$tmp[$v['class_id']] = $v;
					}
					$length = count($tmp);
					foreach ($tmp as $k=>$v){
						unset($v['stu_name']);
						unset($v['stu_id']);
						for($i=0;$i<$length;$i++){
							unset($tmp[$k]);
							$tmp[$i] = $v;
						}
					}
					
					$assignToDb = json_encode($tmp);
					echo $assignId.'</br>';
					$this->db->sql = <<<SQL
												update teach_assign_list set assign_student_count='$assignStudentCount'  where id=$assignId;
SQL;
					$this->db->ExecuteSql();
				}
			}


//			print_r($tmp);
			exit;
		}

			function recursion($parentId){
			      //构建SQL语句
			     $this->db->sql = <<<SQL
			     	select * from test where parent_id =$parentId;
			     
SQL;
			$this->db->Query();
			$data = $this->db->rs;
			$tmp = array();
			  foreach( $data  as $val){
//			  		$tmp[$val['name']] = $val['name'];
			        $tmp[$val['name']]['id'] = $val['id'];
			        if($this->recursion($val['id'])){
				       $tmp[$val['name']]['info']=$this->recursion( $val['id']);
			        }
			  }
			return $tmp;
					}
	}
	
?>