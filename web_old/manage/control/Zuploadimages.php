<?
	if(!empty($_FILES['img']['name'])){
		//echo 1;
		$path='../../an/pic/';//图片上传路径
		if(!file_exists($path)){
			mkdir($path,0700);
		}
		
		//定义允许上传的图片格式
		$tp = array('image/gif','image/jpeg','image/jpg','image/png' );
		
		//检查上传类型是否正确
		if(!in_array($_FILES['img']['type'], $tp)){
			echo "<script charset='UTF-8'>alert('亲，你上传的格式不正确');history.go(-1);</script>";
			exit;
		}
		
		//获取上传图片的类型
		$filetype = $_FILES['img']['type'];
		//echo $filetype;
		if($filetype == 'image/jpeg'){$style = '.jpg';}
		if($filetype == 'image/jpg'){$style = '.jpg';}
		if($filetype == 'image/gif'){$style = '.gif';}
		if($filetype == 'image/png'){$style = '.png';}
		if($_FILES['img']['name']){ //
			$today = date('YmdHis');
			$file2 = $path.$today.$style;//图片上传的完整路径
			$img = $today.$style;//图片名称
			$flag = 1;
		}
		//echo $_FILES['img']['name'];
		//echo 5;
		//exit;
		if($flag){
			$result = move_uploaded_file($_FILES['img']['tmp_name'], $file2);
			if($result ==1){
				//往配置文件里面写入
				$file = '../../an/pic-zk.config';


				//if(file_exists($file)){echo '1';}else{echo 2;}
				if(file_get_contents($file)==''){
					$str = 'http://dev.hxpad.com/an/pic/'.$img.',1,-1';
				}else{
					$str = "\r\n".'http://dev.hxpad.com/an/pic/'.$img.',1,-1';
				}
				$file_opener = fopen($file,"a");
				//$str = "\r\n".'http://dev.hxpad.com/an/pic/'.$img.',1,-1';
				//echo $str;exit;
				fwrite($file_opener,$str);
				fclose($file_opener);
				echo "<script>alert('恭喜你上传成功!');history.go(-1);</script>";
			}
		}/**/
		//echo 6;
	}
	//echo $_FILES['img']['type'];