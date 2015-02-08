<?php
/////////////////////////////////////////////////////////
// php mysqldb 模块v1.0
// by 孙峻峰 2010.7.8
/////////////////////////////////////////////////////////
		
        class DB
        {
                //属性
                public $mConnId;             //连接标识                
                public $sql;          //待执行的SQL语句
                public $rs;        //执行Select语句返回的结果数组                
              

				
				//构造函数
                function __construct($host,$dbname,$dbuser,$dbpass){   
				
				/* if(function_exists(mysql_fetch_array)){
					echo "ok";
				} */
				
					$this->mConnId=mysql_connect ($host,$dbuser,$dbpass); //建立连接 位置 用户名 密码
					mysql_query("SET NAMES utf8");
                    mysql_select_db($dbname, $this->mConnId);        //选择数据库 数据库名
                }
                
                //__destruct：析构函数，断开连接
                function __destruct(){
                    mysql_close($this->mConnId);
                }
				function Last_id(){
					return mysql_insert_id($this->mConnId);
				}
                
                //增删改数据
                function ExecuteSql(){
                    //$this->sql;
                    mysql_query($this->sql,$this->mConnId);
                }               
                //查询数据，返回值为对象数组，数组中的每一元素为一行记录构成的对象
                function Query(){
					$this->rs = null;
                       //echo $this->sql;
                    $i=0;
                    $query_result=mysql_query($this->sql,$this->mConnId);
                    while($row=@mysql_fetch_array($query_result,MYSQL_ASSOC)){
                        $this->rs[$i++]=$row;
                    }
                }
				//查询一条数据
                function Queryone(){
                    //echo $this->sql."<br>";
					$this->rs = null;
                    $query_result=mysql_query($this->sql,$this->mConnId);
                    $this->rs=mysql_fetch_array($query_result,MYSQL_ASSOC);
                }
				//查询一条数据是否存在
                function Queryif($table,$condition){
					$this->rs = null;
                    //echo $this->sql."<br>";
					//echo "select count(*) as nu,id from ".$table." where ".$condition;
                    $query_result=mysql_query("select count(*) as nu,id from ".$table." where ".$condition,$this->mConnId);
					$this->rs=@mysql_fetch_array($query_result);
					//echo $this->rs["nu"];
					return $this->rs['nu'];
                }	
				//更改一条数据
                function Update($table,$condition,$arr){
					$this -> sql = "update $table set ";
					$y = false;
					foreach($arr as $k=>$v){
						if(strlen($v)!=0){
							$y = true;
							$this -> sql .= "$k='$v'";
						}
					}
			
					if($y){
						$this -> sql = " where $condition";
						$this -> ExecuteSql();
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

