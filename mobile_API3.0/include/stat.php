<?php
/**

统计对象，分为以下统计：

	 学生统计：
	    每个学生有一个数量的统计表，一个学生一条记录，主要统计做过做过题目的个数，做对多少，做错多少，正确率 。。。；
	    每个学生有一个做题的文本文件，记录做过的题目，每一次练习独立一行，记录一下练习日期，题目ID用特殊符号分割；（一年一个文件）
	    建立一个用户昨天时间、题目行数的表，用于帮助在文件中找到指定日期的题目；
	    学生每次练习完，进行统计，将统计信息更新至 知识点统计表、学生数量统计表和做题文本文件中。
	    每个学生针对每一科有一个知识点统计信息表，记录都做过哪些知识点的题，正确率，错误率，题目数量等；
	    
	知识点统计：
	    每个知识点有一个数量的统计表，一个知识点一条记录，主要统计多少人做过，做过多少个题，正确率等等；
	    
	试卷统计：
	 
	题型统计：
	 
	校区统计：
	 
	分校区统计：
	 
	教师统计：


 * @author tony
 *
 */
//include "config.php";
// require_once(dirname(__FILE__)."/include/db.php");

class statManager {
	
	private $dataManager;
	private $cacheManager;
	
	private $config = array();
	
	public function __construct(){
		$this->config['student'] = array(
			'question'=>array('type'=>'file'),
			'knowledge'=>array('type'=>'file'),
			'total'=>array('type'=>'sql'),
			'action'=>array('type'=>'sql')
		);
		
		$this->config['teacher'] = array(
			'total'=>array('type'=>'sql')
		);
		
		$this->config['exercise'] = array(
			'total'=>array('type'=>'sql')
		);
		
		$this->config['exercise_ti'] = array(
			'total'=>array('type'=>'sql')
		);
		
		$this->config['exercise_ti_total'] = array(
			'total'=>array('type'=>'sql')
		);
		
		$this->config['center'] = array(
			'total'=>array('type'=>'sql')
		);
		
		$this->config['zone'] = array(
			'total'=>array('type'=>'sql')
		);
		
		$this->config['class'] = array(
			'action'=>array('type'=>'sql')
		);
		
		$this->config['knowledge'] = array(
			'total'=>array('type'=>'sql')
		);
		
		$this->config['knowledge_user'] = array(
			'total'=>array('type'=>'sql')
		);
		
		$this->config['student_subject_day'] = array(
			'total'=>array('type'=>'sql')
		);
		
		$this->config['zhuanti'] = array(
			'total'=>array('type'=>'sql')
		);
		
		$this->config['zhuanti_user'] = array(
			'total'=>array('type'=>'sql')
		);
		
		
		$this->config['question_user'] = array(
			'total'=>array('type'=>'sql')
		);
		
		$this->config['question'] = array(
			'total'=>array('type'=>'sql')
		);
		
		
		$this->config['cloud_entity'] = array(
			'total'=>array('type'=>'sql')
		);
		$this->dataManager = new dataManager();
	}
		
	
	public function query($statObj , $statColumn , $condition){
		$function = '_query_'.$statObj.'_'.$statColumn;
		return $this->$function($condition);
	}
	
	public function update($statObj , $statColumn , $data){
		$function = '_update_'.$statObj.'_'.$statColumn;
		return $this->$function($data);
	}
	
	
	/*** START   学生统计   START  ***/
	
	//更新学生的做题情况
	private function _update_student_question($data){
		if($this->config['student']['question']['type'] == 'file'){
			$result = $this->dataManager->update('student' , 'question' , $data);
		}
		
		return $result;
	}
	
	private function _update_student_action($data){
		if($this->config['student']['action']['type'] == 'sql'){
			$result = $this->dataManager->update('student' , 'action' , $data);
		}
		
		return $result;
	}
	
	
	//更新学生的知识点统计信息
	private function _update_student_knowledge($data){
		if($this->config['student']['knowledge']['type'] == 'file'){
			$result = $this->dataManager->update('student' , 'knowledge' , $data);
		}
		
		return $result;
		
	}
	
	//更新学生统计的信息
	private function _update_student_total($data){
		if($this->config['student']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('student' , 'total' , $data);
		}
		
		return $result;
	}
	
	
	
	/*** END   学生统计   END  ***/
	
	/* ---------------------------------------------------------  */
	
	/*** START   教师统计   START  ***/
	
	private function _query_teacher_total($condition){
		if($this->config['teacher']['total']['type'] == 'sql'){
			$result = $this->dataManager->query('teacher' , 'total' , $condition);
		}
		
		return $result;
	}
	
	private function _update_teacher_total($data){
		if($this->config['teacher']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('teacher' , 'total' , $data);
		}
		
		return $result;
	}
	
	
	
	/*** END   教师统计   END  ***/
	
	
	/*** START   作业统计   START  ***/
	
	private function _update_exercise_total($condition){
		if($this->config['exercise']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('exercise' , 'total' , $condition);
		}
		return $result;
	}
	
	/*** END    作业统计   END  ***/
	
	
	private function _update_knowledge_total($condition){
		if($this->config['knowledge']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('knowledge' , 'total' , $condition);
		}
		return $result;
	}
	
	
	private function _update_knowledge_user_total($condition){
		if($this->config['knowledge_user']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('knowledge_user' , 'total' , $condition);
		}
		return $result;
	}
	
	
	private function _update_student_subject_day_total($condition){
		if($this->config['student_subject_day']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('student_subject_day' , 'total' , $condition);
		}
		return $result;
	}
	
	
	private function _update_zhuanti_total($condition){
		if($this->config['zhuanti']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('zhuanti' , 'total' , $condition);
		}
		return $result;
	}
	
	private function _update_zhuanti_user_total($condition){
		if($this->config['zhuanti_user']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('zhuanti_user' , 'total' , $condition);
		}
		return $result;
	}
		/*** START   用户试题统计   START  ***/
	
	private function _update_exercise_ti_total($condition){
		if($this->config['exercise_ti']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('exercise_ti' , 'total' , $condition);
		}
		return $result;
	}
	
	
	private function _update_question_total($condition){
		if($this->config['question']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('question' , 'total' , $condition);
		}
		return $result;
	}
	
	
	private function _update_question_user_total($condition){
		if($this->config['question_user']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('question_user' , 'total' , $condition);
		}
		return $result;
	}
	
	private function _update_cloud_entity_total($condition){
		if($this->config['cloud_entity']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('cloud_entity' , 'total' , $condition);
		}
		return $result;
	}
	/*** END     用户试题统计   END  ***/
	
	
	/*** START   试题统计   START  ***/
	
	private function _update_exercise_ti_total_total($condition){
		if($this->config['exercise_ti_total']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('exercise_ti_total' , 'total' , $condition);
		}
		return $result;
	}
	
	/*** END     试题统计   END  ***/
	
	
	
	/*** START   班级统计   START  ***/
	
	private function _update_class_action($data){
		if($this->config['class']['action']['type'] == 'sql'){
			$result = $this->dataManager->update('class' , 'action' , $data);
		}
	}
	
	/*** END   班级统计   END  ***/
	
	
	/*** START   中心统计   START  ***/
//更新中心的总数统计信息
	private function _update_center_total($data){
		if($this->config['center']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('center' , 'total' , $data);
		}
		
		return $result;
	}
	
	//更新分中心的总数统计信息
	private function _update_zone_total($data){
		if($this->config['zone']['total']['type'] == 'sql'){
			$result = $this->dataManager->update('zone' , 'total' , $data);
		}
		
		return $result;
	}
	
	/*** END   中心统计   END  ***/
	
	public function dailyCall(){
		
	}
	
}




/** 即时数据操作对象 */
class dataManager{
	
	private $db;
	private $memcache;
	
	private $_memcache_config;
	
	public function __construct(){
		
		global $DBCFG;
		//实例化数据库操作类
		$this -> db = new DB($DBCFG['default_stat']['dbhost'] , $DBCFG['default_stat']['dbname'] , $DBCFG['default_stat']['dbuser'] , $DBCFG['default_stat']['dbpasswd']);
		
		$this->_memcache_config = array(	
			'update_count' => 100,								//凑够多少条以后统一更新
			'update_time'	=> 60								//间隔多长时间后自动更新
		
		);
		
//		$this->memcache = new Memcache();
//		$this->memcache->connect('192.168.1.66' , 11211);
		
		
		
//		echo $host , $dbname , $dbuser , $dbpass;
//		print_r($this->db);
	}
	
	private function _memcache_update($statObj , $statColumn , $data){
		
		//从memcache里读取已经缓存的数据
		$oldData = $this->memcache->get($statObj.'_'.$statColumn);
		//将数据整合
		$data = array_merge($oldData , $data);
		
		if(count($data) > $this->_memcache_config['update_count']){//如果达到更新数量，则进行更新
			$function = '_update_'.$statObj.'_'.$statColumn;
			$result = $this->$function($data);
			if($result){
				$this->memcache->set($statObj.'_'.$statColumn , array());
			}else{
				$this->memcache->set($statObj.'_'.$statColumn , $data);
			}
		}else{//如果没有达到更新数量，则缓存
			
			$result = $this->memcache->set($statObj.'_'.$statColumn , $data);
		}
			
		return $result;
	}
	
	private function _memcache_query($statObj , $statColumn , $condition){
		$data = $this->memcache->get($statObj.'_'.$statColumn);
		
	}
	
	public function query($statObj , $statColumn , $condition){
		global $DBCFG;
		$this->db->switchDB($DBCFG['default_stat']['dbhost'] , $DBCFG['default_stat']['dbname'] , $DBCFG['default_stat']['dbuser'] , $DBCFG['default_stat']['dbpasswd']);
		
		$function = '_query_'.$statObj.'_'.$statColumn;
		return $this->$function($condition);
	}
	
	public function update($statObj , $statColumn , $data){
		global $DBCFG;
		$this->db->switchDB($DBCFG['default_stat']['dbhost'] , $DBCFG['default_stat']['dbname'] , $DBCFG['default_stat']['dbuser'] , $DBCFG['default_stat']['dbpasswd']);
		$function = '_update_'.$statObj.'_'.$statColumn;
		
		return $this->$function($data);
	}
	
	private function _update_base($tableName , $data , $conditionKey){
		$column = '';
		$values = '';
		$updates = '';
		
		foreach($data as $k => $v){
			$column .= $k.',';
			$values .= '"'.$v.'",';
			if(!in_array($k , $conditionKey)){
				$updates .= $k.'='.$k.'+VALUES('.$k.'),';
			}
		}
		
		$column = substr($column , 0 , strlen($column)-1);
		$values = substr($values , 0 , strlen($values)-1);
		$updates = substr($updates , 0 , strlen($updates)-1);
		
		$sql = 'INSERT INTO '.$tableName.' (' . $column . ') VALUES (' . $values . ')'.
			' ON DUPLICATE KEY UPDATE '.$updates;

		$this->db->sql = $sql;
//		echo $sql;
		$result = $this->db->ExecuteSql();
		
		return $result;
	}
	
	/*** START   学生统计   START  ***/
	
	private function _query_student_question($condition){
		$student_id = $condition['student_id'];
		
		//根据student_id计算出对应存储路径
		$dir_path = '';
		$this->check_file_path($dir_path);
		$file_path = $dir_path . '/' . $student_id . '.question_data';
		
		$dailyData = file($file_path);
		
		$result = array();
		
		foreach($dailyData as $k => $v){
			$tmp = explode(' ' , $v);
			$result[$tmp[0]] = array_slice($tmp , 1 );
		}
		return $result;
	}
	
	private function _query_student_knowledge($condition){
		$student_id = $condition['student_id'];
		
		//根据student_id计算出对应存储路径
		$dir_path = '';
		$this->check_file_path($dir_path);
		$file_path = $dir_path . '/' . $student_id . '.knowledge_data';
		
		if(file_exists($file_path)){
			$knowledgeJSON = file_get_contents($file_path);
			$knowledgeObject = json_decode($knowledgeJSON , true);
			
		}else{
			$knowledgeObject = array();
		}
		return $knowledgeObject;
		
	}
	
	private function _update_student_question($data){
		$student_id = $data['student_id'];
		$question_ids = $data['question_ids'];
		
		//根据student_id计算出对应存储路径
		$dir_path = '';
		$this->check_file_path($dir_path);
		$file_path = $dir_path . '/' . $student_id . '.question_data';
		
		
		$link = fopen($file_path , 'a');
		
		//数据格式： 时间 题目ID号 
		$input_data = time().' '.implode(' ',explode('_' , $question_ids));
		
		fwrite($link , $input_data);
		
		fclose($link);
		
		return true;
		
	}
	
	private function _update_student_knowledge($data){
		$student_id = $data['student_id'];
		$knowledgeObj = $data['knowledge'];// array(knowledge=>(count=>1,right=>1,wrong=>0));
		
		//根据student_id计算出对应存储路径
		$dir_path = '';
		$this->check_file_path($dir_path);
		$file_path = $dir_path . '/' . $student_id . '.knowledge_data';
		
		if(file_exists($file_path)){
			$knowledgeJSON = file_get_contents($file_path);
			$knowledgeObject = json_decode($knowledgeJSON , true);
			
		}else{
			$knowledgeObject = array();
		}
		
		foreach($knowledgeObj as $knowledge => $stat){
			if($knowledgeObject[$knowledge]){
				$knowledgeObject[$knowledge]['count'] += $stat['count'];
				$knowledgeObject[$knowledge]['right'] += $stat['right'];
				$knowledgeObject[$knowledge]['wrong'] += $stat['wrong'];
			}else{
				$knowledgeObject[$knowledge] = $stat;
			}
		}
		
		
	}
	
	private function _update_student_total($data){
		$result = $this->_update_base('stat_student_day' ,  $data , array('student_id' , 'day','class_id','teacher_id'));
		
		return $result;
		
	}
	
	/*统计学生发生的行为*/
	private function _update_student_action($data){
		$result = $this->_update_base('stat_student_history' ,  $data , array());
		
		return $result;
		
	}
	
	/*** END   学生统计   END  ***/
	
	/* ---------------------------------------------------------  */
	
	/*** START   老师统计   START  ***/
	
	private function _query_teacher_total($condition){
		
		$where = '';
		
		foreach($condition as $k => $v){
			$where .= $k.'="'.$v.'" AND ';
		}
		
		$where = substr($where , 0 ,strlen($where) - 4);
		
		$sql = 'SELECT * FROM stat_teacher WHERE '.$where;
		
		$this->db->sql = $sql;
		
		$this->db->Query();
		
		$result = $this->db->rs;
		return $result;
		
	}
	
	private function _update_teacher_total($data){
		
		$data['month'] = date('m');
		$result = $this->_update_base('stat_teacher' ,  $data , array('teacher_id' , 'year','month','center_id','zone_id'));
		
		return $result;
	}
	
	/*** END   老师统计   END  ***/
	
	/* ---------------------------------------------------------  */
	
	/*** START   试卷统计   START  ***/
	
	private function _update_exercise_total($data){
		$result = $this->_update_base('stat_exercise' ,  $data , array('user_id' , 'exam_id','exam_type'));
		return $result;
		
	}
	
	
	/*** START   用户试题统计   START  ***/
	
	private function _update_exercise_ti_total($data){
		$result = $this->_update_base('stat_exercise_ti' ,  $data , array('user_id' , 'ti_id','flag','dbtype','subject_id'));
		return $result;
		
	}
	/*** END   用户试题统计   END  ***/
	
	
		/*** START   试题统计   START  ***/
	
	private function _update_exercise_ti_total_total($data){
		$result = $this->_update_base('stat_exercise_ti_total' ,  $data , array('ti_id','flag','dbtype','subject_id'));
		return $result;
		
	}
	/*** END   试题统计   END  ***/
	
	/* ---------------------------------------------------------  */
	
	/*** START   知识点统计   START  ***/
	
	private function _update_knowledge_total($data){
		$result = $this->_update_base('stat_knowledge' ,  $data , array('knowledge_id','subject_id','dbtype','section_id','difficulty','question_type'));
		return $result;
	}
	
	
	private function _update_knowledge_user_total($data){
		$result = $this->_update_base('stat_knowledge_user' ,  $data , array('knowledge_id','user_id','subject_id','dbtype','section_id','difficulty','question_type'));
		return $result;
	}
	
	
	
	private function _update_student_subject_day_total($data){
		$result = $this->_update_base('stat_student_subject_day' ,  $data , array('user_id','subject_id','day','section_id','dbtype'));
		return $result;
	}
	
	
	private function _update_zhuanti_total($data){
		$result = $this->_update_base('stat_zhuanti' ,  $data , array('zhuanti_id','difficulty','question_type','subject_id','dbtype','section_id'));
		return $result;
	}
	
	private function _update_zhuanti_user_total($data){
		$result = $this->_update_base('stat_zhuanti_user' ,  $data , array('user_id','zhuanti_id','difficulty','question_type','subject_id','dbtype','section_id'));
		return $result;
	}
	
	private function _update_question_total($data){
		$result = $this->_update_base('stat_question' ,  $data , array('question_id','subject_id','dbtype','section_id'));
		return $result;
	}
	
	private function _update_question_user_total($data){
		$result = $this->_update_base('stat_question_user' ,  $data , array('question_id','user_id','subject_id','dbtype','section_id'));
		return $result;
	}
	
	
	private function _update_cloud_entity_total($data){
		$result = $this->_update_base('stat_cloud_entity' ,  $data , array('element_id','action_id','type_id'));
		return $result;
	}
	/*** END   知识点统计   END  ***/
	
	/* ---------------------------------------------------------  */
	
	/*** START   校区、分校区统计   START  ***/
	
	private function _query_center_base($center_id_list , $month_list){
		$center_id = implode(',',$center_id_list);
		$month = implode(',' , $month_list);
		
		$sql = 'SELECT * FROM stat_center WHERE center_id IN (' . $center_id . ')';
		
		if($month){
			$sql .= ' AND month IN (' . $month . ')';
		}
		
		$this->db->sql = $sql;
		$this->db->Query();
		
		$result = $this->db->rs;
		
		return $result;
		
	}
	
	private function _query_muti_zone_base($zone_id_list , $month_list){
		
		$zone_id = implode(',',$zone_id_list);
		$month = implode(',' , $month_list);
		
		$sql = 'SELECT * FROM stat_zone WHERE zone_id in ('.$zone_id.') AND month IN ('.$month.')';
		
		$this->db->sql = $sql;
		$this->db->Query();
		
		$result = $this->db->rs;
		
		return $result;
		
	}
	
	
	private function _update_center_total($data){
		
		$result = $this->_update_base('stat_center_day' ,  $data , array('center_id' , 'day'));
		
		return $result;
	}
	
	private function _update_zone_total($data){
		
		$result = $this->_update_base('stat_zone_day' ,  $data , array('zone_id' , 'day'));
		
		return $result;
	}
	
	/*** END   校区、分校区统计   END  ***/
	
	/*** START   班级统计   START  ***/
	
	private function _update_class_action($data){
		
		$result = $this->_update_base('stat_class_history' ,  $data , array());
		
		return $result;
		
//		$column = '';
//		$values = '';
//		
//		foreach($data as $k => $v){
//			$column .= $k.',';
//			$values .= '"'.$v.'",';
//		}
//		
//		$column = substr($column , 0 , strlen($column)-1);
//		$values = substr($values , 0 , strlen($values)-1);
//		
//		$sql = 'INSERT INTO stat_class_history '.$column.' VALUES (' . $values . ')';
//		
//		$this->db->sql = $sql;
//		
//		$result = $this->db->ExecuteSql();
//		
//		return $result;
		
	}
	
	/*** END   班级统计   END  ***/
	
	
	private function check_file_path($path){
		$pathDir = explode('/' , $path);
		
		$checkDir = $pathDir[0];
		
		foreach($pathDir as $v){
			if(!is_dir($checkDir)){
				mkdir($checkDir , 0777);
				chmod($checkDir , 0777);
			}
			$checkDir .= '/' . $v;
		}
	}
	
}
?>