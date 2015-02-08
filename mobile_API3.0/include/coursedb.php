<?php
/////////////////////////////////////////////////////////
// php mysqldb 模块v1.0
// by 孙峻峰 2010.7.8
/////////////////////////////////////////////////////////
		
        class CourseDB
        {
                //属性
                public $mCourceConnId;             //连接标识                
                public $sql;          //待执行的SQL语句
                public $rs;        //执行Select语句返回的结果数组                
              
				public $coursedbname;
				
				//构造函数
                function __construct($host,$dbname,$dbuser,$dbpass){   
				
				/* if(function_exists(mysql_fetch_array)){
					echo "ok";
				} */
				    $this->coursedbname=$dbname;
					$this->mCourseConnId=mysql_pconnect ($host,$dbuser,$dbpass); //建立连接 位置 用户名 密码
					mysql_query("SET NAMES utf8",$this->mCourseConnId);
					mysql_query("set character set 'utf8'",$this->mCourseConnId);//读库


                    mysql_select_db($this->coursedbname, $this->mCourseConnId);        //选择数据库 数据库名
                }
                
                //__destruct：析构函数，断开连接
                function __destruct(){
                    mysql_close($this->mCourseConnId);
                }
				function Last_id(){
					return mysql_insert_id($this->mCourseConnId);
				}
				function Last_rs(){
					if(mysql_affected_rows($this->mCourseConnId)==-1){
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
					mysql_select_db($this->coursedbname, $this->mCourseConnId);        //选择数据库 数据库名
                    return mysql_query($this->sql,$this->mCourseConnId);
                }               
                //查询数据，返回值为对象数组，数组中的每一元素为一行记录构成的对象
                function Query(){
					$this->rs = null;
                       //echo $this->sql;
                    $i=0;
					mysql_select_db($this->coursedbname, $this->mCourseConnId);        //选择数据库 数据库名
                    $query_result=mysql_query($this->sql,$this->mCourseConnId);
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
					mysql_select_db($this->coursedbname, $this->mCourseConnId);        //选择数据库 数据库名
                    $query_result=mysql_query($this->sql,$this->mCourseConnId);
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
					mysql_select_db($this->coursedbname, $this->mCourseConnId);        //选择数据库 数据库名
                    $query_result=mysql_query("select id from ".$table." where ".$condition,$this->mCourseConnId);
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
							if(is_string($v) and $v!='current_timestamp()'){
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
				
        }//class DB
        
/*
        $db=new DB($host,$dbname,$dbuser,$dbpass);
        
        $db->sql="insert into test(t1,t2) values('1','2')";
        $db->ExecuteSql();
        
        $db->sql="select * from test";
        $db->Query();        
        print_r($db->rs);
        
        $db->__destruct();
        $db=NULL;
//*/
?>