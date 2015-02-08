<?php
	//读取配置文件
	//echo "你好我是图片";
	if($_POST['id'])
	{
		//echo $_POST['id'];
		$j = $_POST['id']-1;//要删除的行数
		//echo $j;
		$newfile = ""; 
		$file = '../../an/pic-gk.config';//文件路径
		$fc=file('../../an/pic-gk.config');//把整个文件放入到数组中
		$count = count($fc);
		//echo $count;exit;
		$f=fopen($file,"r");//打开文件
		flock($f,LOCK_SH);
		for ($i=0;$i<count($fc);$i++) 
		{
			if ($i != $j) 
			{
				$newfile = $newfile.$fc[$i]."";
			}
		}
		fclose($f);
		$f=fopen($file,"w");
		flock($f,LOCK_EX);
		fputs($f,$newfile);
		fclose($f);




		$file = file('../../an/pic-gk.config');
		echo '<table width="100%" border="0" cellspacing="0" cellpadding="0" id="nihao">
				<caption><h3>图片列表</h3></caption>
				<tr>
				<th>图片编号</th><th>图片名称</th><th>图片</th><th>操作</th>
			</tr>';
			foreach($file as $line => $content){
				
				$first = strripos($content,'/');//斜杆最后一次出现的位置
				$end = strpos($content,',');//逗号第一次出现的位置
				$pic_name = substr($content, $first+1,$end-$first-1);
				echo '<tr><td height=100>'.($line+1).'</td><td>'.$pic_name.'</td> <td><img src="../an/pic/'.$pic_name.'" height=80 width=250"></td><td><a href="javascript:void(0)" onclick="deletePic('.($line+1).')">删除</td></tr>';
				//echo $pic_name;

			}
		echo "</table>";


	}else{
		$file = file('../../an/pic-gk.config');
		echo '<table width="100%" border="0" cellspacing="0" cellpadding="0" id="nihao">
				<caption><h3>图片列表</h3></caption>
				<tr>
				<th>图片编号</th><th>图片名称</th><th>图片</th><th>操作</th>
			</tr>';
			foreach($file as $line => $content){
				
				$first = strripos($content,'/');//斜杆最后一次出现的位置
				$end = strpos($content,',');//逗号第一次出现的位置
				$pic_name = substr($content, $first+1,$end-$first-1);
				echo '<tr><td height=100>'.($line+1).'</td><td>'.$pic_name.'</td> <td><img src="../an/pic/'.$pic_name.'" height=80 width=250"></td><td><a href="javascript:void(0)" onclick="deletePic('.($line+1).')">删除</td></tr>';
				//echo $pic_name;

			}
		echo "</table>";
	}