<?php
/**
 * @author by XK
 * 数据库工厂类
 *
 */
class db_handler {
	
	private static $_instance;
	public  function __construct(){
	}
	
	//覆盖__clone()方法，禁止克隆  
	private function __clone(){
		
	}
	
	public static function getInstance(){
		global $DBCFG;
		if(!(self::$_instance instanceof DB)){
			self::$_instance = new DB($DBCFG['default_local']['dbhost'] , $DBCFG['default_local']['dbname'] , $DBCFG['default_local']['dbuser'] , $DBCFG['default_local']['dbpasswd']);
		}
		return self::$_instance;
	} 
}