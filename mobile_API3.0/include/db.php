<?php
/////////////////////////////////////////////////////////
// php mysqldb 模块v1.0
// by 孙峻峰 2010.7.8
/////////////////////////////////////////////////////////
		
        class DB
        {
                //属性
                public $mConnId;             //连接标识                
                public $connIdArray;
                public $sql;          //待执行的SQL语句
                public $rs;        //执行Select语句返回的结果数组        
//                 public $dbuser;
//                 public $dbpass; 

				
				
				//构造函数
                function __construct($host,$dbname,$dbuser,$dbpass){   
				
				/* if(function_exists(mysql_fetch_array)){
					echo "ok";
				} */

//                 	$this->dbuser = $dbuser;
//                 	$this->dbpass = $dbpass;
				
					$this->mConnId=mysql_connect ($host,$dbuser,$dbpass,true); //建立连接 位置 用户名 密码
					
                    mysql_select_db($dbname, $this->mConnId);        //选择数据库 数据库名

					mysql_query("SET NAMES utf8");
					mysql_query("set character set 'utf8'");//读库
					mysql_query("SET CHARACTER_SET_RESULTS=UTF8'");
                    
                    $this->connIdArray = array();
                    $this->connIdArray[$host] = array($dbname => $this->mConnId);
                    
                }
                
         		function switchDB($host , $dbname , $user = null , $passwd = null){

         			$_user = $user ? $user : $this->dbuser;
         			$_passwd = $passwd ? $passwd : $this->dbpass;
         			
                	if($this->connIdArray[$host] && $this->connIdArray[$host][$dbname]){
	                	if($this->mConnId != $this->connIdArray[$host][$dbname]){
	                		$this->mConnId = $this->connIdArray[$host][$dbname];
	                	}
                	}else{
                		if(!$this->connIdArray[$host]){
                			$this->connIdArray[$host] = array();
                		}
                		$ConnId = mysql_connect ($host,$_user,$_passwd,TRUE); //建立连接 位置 用户名 密码
                		
	                    mysql_select_db($dbname , $ConnId);        //选择数据库 数据库名
	                    
						mysql_query("SET NAMES utf8");
						mysql_query("set character set 'utf8'");//读库
                    	mysql_query("SET CHARACTER_SET_RESULTS=UTF8'");
                    	
                    	$this->connIdArray[$host][$dbname] = $ConnId;
	                	$this->mConnId = $ConnId;
                	}
                }
                
                //__destruct：析构函数，断开连接
                function __destruct(){
                    mysql_close($this->mConnId);
                }
				function Last_id(){
					return mysql_insert_id($this->mConnId);
				}
				function Last_rs(){
					if(mysql_affected_rows()==-1){
						return false;
					}
					else{
						return true;
					}
				}
				
				function UpdateEvalution($table,$evalutionitem,$addorsub,$condition){
					   $arr4=null;
					   $evalution=null;
					   $this->sql = "select evalution from ".$table ." where 1=1 and  ".$condition;
					   $this->Queryone();
					   $evalution = json_decode($this->rs["evalution"],true);	
					   if ($addorsub=="add")
					   {		
					   		if ($evalution[$evalutionitem]!= null) { $evalution[$evalutionitem]+=1; }  else { $evalution[$evalutionitem]=1;}  
					   } else {
						    if ($evalution[$evalutionitem]!= null) {$evalution[$evalutionitem]-=1;} else {$evalution[$evalutionitem]=0;}
							if ($evalution[$evalutionitem]<0) {$evalution[$evalutionitem]=0;}
					   }
					   $arr4['evalution']=json_encode($evalution);
					   $this->Update($table,$arr4,$condition);   	
				}
                
                //增删改数据
                function ExecuteSql(){
                  //$this->sql;
                    return mysql_query($this->sql,$this->mConnId);
                }               
                //查询数据，返回值为对象数组，数组中的每一元素为一行记录构成的对象
                function Query(){
					$this->rs = null;
//                       echo $this->sql;
                    $i=0;
                    $query_result=mysql_query($this->sql,$this->mConnId);
					if($query_result == null){
						return null;
					}
                    while($row=@mysql_fetch_array($query_result,MYSQL_ASSOC)){
                        $this->rs[$i++]=$row;
                    }
                }
				//查询一条数据
                function Queryone(){
					$this->rs = null;
                    $query_result=mysql_query($this->sql,$this->mConnId);
					if($query_result == null){
						return null;
					} 
                    $this->rs=mysql_fetch_array($query_result,MYSQL_ASSOC);
					if($this->rs==null){
						return null;
					}
					
					foreach ($this->rs as $k => $v) {
						$arr[$k] = $v;
					}
					$this->rs = $arr;
                }
				
				//查询一条数据是否存在
                function Queryif($table,$condition){
					$this->rs = null;
                    $query_result=mysql_query("select id from ".$table." where ".$condition,$this->mConnId);
					$this->rs=@mysql_fetch_array($query_result);
					return $this->rs['id'];
                }	
				//更改一条数据
                function Update($table,$arr,$condition=null){
					$this -> sql = "update $table set ";
					$y = false;
					foreach($arr as $k=>$v){
						if(strlen($v)!=0){
							$y = true;
							if(is_string($v) and $v!='current_timestamp()'){
								$this -> sql .= "$k='".$v."',";							
							}
							else{
								$this -> sql .= "$k=$v,";								
							}
							
						}
					}
					
			
					if($y){
						$this -> sql = substr($this -> sql,0,-1);
						if($condition!=null){
							$this -> sql .= " where $condition";
						}
//						echo $this->sql;
						return $this -> ExecuteSql();
					}
                }
				//插入一条数据
                function Insert($table,$arr,$re=true){
					if($re){
						$this -> sql = "insert into $table ";
					}
					else{
						$this -> sql = "replace into $table ";
					}
					$key="(";
					$value=") values(";
					foreach($arr as $k=>$v){
						if(strlen($v)!=0){
							$key .= "$k,";
							if(is_string($v) and $v!='current_timestamp()' and $v!='now()'){
								$value .= "'".$v."',"; 
							}
							else{
								$value .= "$v,";
							}
							
						}
					}
			
					if($key!="("){						
						$key = substr($key,0,-1);
						$value = substr($value,0,-1);
						$this -> sql .= $key.$value.")";
//						echo $this->sql;
						return $this -> ExecuteSql();
					}
                }
				
				//插入N条数据
                function Inserts($table,$arra,$re=true){
					if($re){
						$this -> sql = "insert into $table ";
					}
					else{
						$this -> sql = "replace into $table ";
					}
					$key="(";
					$value=") values";
					$aa = true;
					foreach($arra as $arr){
						$value .= "(";
						foreach($arr as $k=>$v){
							if(strlen($v)!=0){
								if($aa){
									$key .= "$k,";
								}
								
								if(is_string($v) and $v!='current_timestamp()'){
									$value .= "'".$v."',"; 
								}
								else{
									$value .= "$v,";
								}
								$value = substr($value,0,-1).",";
								
							}
						}
						$value = substr($value,0,-1)."),";
						$aa = false;
					}
					
					if($key!="("){						
						$key = substr($key,0,-1);
						$value = substr($value,0,-1);
						$this -> sql .= $key.$value;
						return $this -> ExecuteSql();
					}
                }
                
                function delete($table , $condition){
                	$sql = <<<SQL
                		DELETE FROM $table WHERE $condition;
SQL;
					$this->sql = $sql;
//					echo $sql;
					return $this -> ExecuteSql();
                }
                
		        public function withQueryMakerLeft() {
					$numOfTables = func_num_args () - 1;
					$tables = func_get_args ();
					$conditions = $tables [$numOfTables];
					$sql = "SELECT ";
					
					for($i = 0; $i < $numOfTables; $i ++) {
						$tableArgs = $tables [$i];
						for($j = 1; $j < count ( $tableArgs ); $j ++) {
							$sql .= $tableArgs [0] . "." . $tableArgs [$j] . ",";
						}
					}
					$sql = substr ( $sql, 0, - 1 );
					$sql .= " FROM ";
					$temp = 0;
					$sql .= $tables [$temp] [0];
					foreach ( $conditions as $key => $value ) {
						if (in_array($key,array('where','order','limit') ,true)) {
							continue;
						}
						$sql .= " LEFT JOIN " . $tables [$temp + 1] [0] . " ON " . $conditions [$key];
						$temp ++;
					}
					! is_null ( $conditions ['where'] ) && ! empty ( $conditions ['where'] ) && $sql .= " WHERE " . $conditions ['where'];
					! is_null ( $conditions ['order'] ) && ! empty ( $conditions ['order'] ) && $sql .= " ORDER BY " . $conditions ['order'];
					! is_null ( $conditions ['limit'] ) && ! empty ( $conditions ['limit'] ) && $sql .= " LIMIT " . $conditions ['limit'];
					$this->sql = $sql;
// 					echo $sql;
					$query = $this->Query (  );
					return $this->rs;
				}
				
				public function withQueryMaker() {
					$numOfTables = func_num_args () - 1;
					$tables = func_get_args ();
					$conditions = $tables [$numOfTables];
					$sql = "SELECT ";
					
					for($i = 0; $i < $numOfTables; $i ++) {
						$tableArgs = $tables [$i];
						for($j = 1; $j < count ( $tableArgs ); $j ++) {
							$sql .= $tableArgs [0] . "." . $tableArgs [$j] . ",";
						}
					}
					$sql = substr ( $sql, 0, - 1 );
					$sql .= " FROM ";
					$temp = 0;
					$sql .= $tables [$temp] [0];
					foreach ( $conditions as $key => $value ) {
						if (in_array($key,array('where','order','limit') ,true)) {
							continue;
						}
						$sql .= " JOIN " . $tables [$temp + 1] [0] . " ON " . $conditions [$key];
						$temp ++;
					}
					! is_null ( $conditions ['where'] ) && ! empty ( $conditions ['where'] ) && $sql .= " WHERE " . $conditions ['where'];
					! is_null ( $conditions ['order'] ) && ! empty ( $conditions ['order'] ) && $sql .= " ORDER BY " . $conditions ['order'];
					! is_null ( $conditions ['limit'] ) && ! empty ( $conditions ['limit'] ) && $sql .= " LIMIT " . $conditions ['limit'];
					
//					echo $sql;
					$this->sql = $sql;
					$query = $this->Query();
					return $this->rs;
				}
				
				public function withQueryMakerOfNum() {
					$numOfTables = func_num_args () - 1;
					$tables = func_get_args ();
					$conditions = $tables [$numOfTables];
					$sql = "SELECT COUNT(*) as count FROM ";
					$temp = 0;
					$sql .= $tables [$temp] [0];
					foreach ( $conditions as $key => $value ) {
						if (in_array($key,array('where','order','limit') ,true)) {
							continue;
						}
						$sql .= " JOIN " . $tables [$temp + 1] [0] . " ON " . $conditions [$key];
						$temp ++;
					}
					! is_null ( $conditions ['where'] ) && ! empty ( $conditions ['where'] ) && $sql .= " WHERE " . $conditions ['where'];
//					echo $sql;
					$this->sql = $sql;
					$query = $this->Queryone (  );
					return $this->rs['count'];
				}
				
				public function withQueryMakerOfNumLeft() {
					$numOfTables = func_num_args () - 1;
					$tables = func_get_args ();
					$conditions = $tables [$numOfTables];
					$sql = "SELECT COUNT(*) as count FROM ";
					$temp = 0;
					$sql .= $tables [$temp] [0];
					foreach ( $conditions as $key => $value ) {
						if (in_array($key,array('where','order','limit') ,true)) {
							continue;
						}
						$sql .= " LEFT JOIN " . $tables [$temp + 1] [0] . " ON " . $conditions [$key];
						$temp ++;
					}
					! is_null ( $conditions ['where'] ) && ! empty ( $conditions ['where'] ) && $sql .= " WHERE " . $conditions ['where'];
//					echo $sql;
					$this->sql = $sql;
					$query = $this->Queryone (  );
					return $this->rs['count'];
				}
                
				
        }//class DB
?>