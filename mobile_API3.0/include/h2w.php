<?php
	 
	/**
	 * Convert HTML to MS Word file
	 * @name HTML_TO_DOC
	 */
	class HTML_TO_DOC
	{
		var $docFile="";
		var $title="";
		var $htmlHead="";
		var $htmlBody="";
		
		
		/**
		 * Constructor
		 *
		 * @return void
		 */
		function HTML_TO_DOC()
		{
			$this->title="Untitled Document";
			$this->htmlHead="";
			$this->htmlBody="";
		}
		
		/**
		 * Set the document file name
		 *
		 * @param String $docfile 
		 */
		
		function setDocFileName($docfile)
		{
			//echo 'setDocFileName Entered.<br>';
			$this->docFile=$docfile;
			if(!preg_match("/\.doc$/i",$this->docFile))
				$this->docFile.=".doc";
			return;		
		}
		
		function setTitle($title)
		{
			//echo 'setTitle Entered.<br>';
			$this->title=$title;
		}
		
		/**
		 * Return header of MS Doc
		 *
		 * @return String
		 */
		function getHeader()
		{
			//echo 'getHeader Entered.<br>';
			$return  = <<<EOH
MIME-Version: 1.0
Content-Type: multipart/related; boundary="----=_NextPart_01CD6FE5.963BD570"

此文档为“单个文件网页”，也称为“Web 档案”文件。如果您看到此消息，但是您的浏览器或编辑器不支持“Web 档案”文件。请下载支持“Web 档案”的浏览器。

------=_NextPart_01CD6FE5.963BD570
Content-Location: file:///C:/1E889205/filename.htm
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html; charset="utf-8"

<html xmlns:v=3D"urn:schemas-microsoft-com:vml"
xmlns:o=3D"urn:schemas-microsoft-com:office:office"
xmlns:w=3D"urn:schemas-microsoft-com:office:word"
xmlns:m=3D"http://schemas.microsoft.com/office/2004/12/omml"
xmlns=3D"http://www.w3.org/TR/REC-html40">
		=09
		=09

<head>
<meta http-equiv=3DContent-Type content=3D"text/html; charset=3Dutf-8">
<meta name=3DProgId content=3DWord.Document>
<meta name=3DGenerator content=3D"Microsoft Word 14">
<meta name=3DOriginator content=3D"Microsoft Word 14">
$this->htmlHead
			<!--[if !mso]>
			<style>
			v\:* {behavior:url(#default#VML);}
			o\:* {behavior:url(#default#VML);}
			w\:* {behavior:url(#default#VML);}
			.shape {behavior:url(#default#VML);}
			</style>
			<![endif]-->
			<title>$this->title</title>
			<!--[if gte mso 9]><xml>
			 <w:WordDocument>
			  <w:View>Print</w:View>
			  <w:DoNotHyphenateCaps/>
			  <w:PunctuationKerning/>
			  <w:DrawingGridHorizontalSpacing>9.35 pt</w:DrawingGridHorizontalSpacing>
			  <w:DrawingGridVerticalSpacing>9.35 pt</w:DrawingGridVerticalSpacing>
			 </w:WordDocument>
			</xml><![endif]-->
	<style>
<!--
 /* Font Definitions */
 @font-face
	{font-family:SimSun;
	panose-1:2 1 6 0 3 1 1 1 1 1;
	mso-font-alt:SimSun;
	mso-font-charset:134;
	mso-generic-font-family:auto;
	mso-font-pitch:variable;
	mso-font-signature:3 680460288 22 0 262145 0;}
@font-face
	{font-family:"Cambria Math";
	panose-1:2 4 5 3 5 4 6 3 2 4;
	mso-font-charset:1;
	mso-generic-font-family:roman;
	mso-font-format:other;
	mso-font-pitch:variable;
	mso-font-signature:0 0 0 0 0 0;}
@font-face
	{font-family:Verdana;
	panose-1:2 11 6 4 3 5 4 4 2 4;
	mso-font-charset:0;
	mso-generic-font-family:swiss;
	mso-font-pitch:variable;
	mso-font-signature:-1593833729 1073750107 16 0 415 0;}
@font-face
	{font-family:SimSun;
	panose-1:2 1 6 0 3 1 1 1 1 1;
	mso-font-charset:134;
	mso-generic-font-family:auto;
	mso-font-pitch:variable;
	mso-font-signature:3 680460288 22 0 262145 0;}
 /* Style Definitions */
 p.MsoNormal, li.MsoNormal, div.MsoNormal
	{mso-style-unhide:no;
	mso-style-qformat:yes;
	mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:7.5pt;
	mso-bidi-font-size:8.0pt;
	font-family:"Verdana","sans-serif";
	mso-fareast-font-family:Verdana;
	mso-bidi-font-family:SimSun;}
p.MsoHeader, li.MsoHeader, div.MsoHeader
	{mso-style-priority:99;
	mso-style-link:"\9875\7709 Char";
	margin:0cm;
	margin-bottom:.0001pt;
	text-align:right;
	mso-pagination:widow-orphan;
	tab-stops:center 207.65pt right 415.3pt;
	layout-grid-mode:char;
	border:none;
	mso-border-bottom-alt:solid windowtext .75pt;
	padding:0cm;
	mso-padding-alt:0cm 0cm 1.0pt 0cm;
	font-size:9.0pt;
	font-family:"Verdana","sans-serif";
	mso-fareast-font-family:Verdana;
	mso-bidi-font-family:SimSun;}
p.MsoFooter, li.MsoFooter, div.MsoFooter
	{mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-link:"\9875\811A Char";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	tab-stops:center 207.65pt right 415.3pt;
	layout-grid-mode:char;
	font-size:9.0pt;
	font-family:"Verdana","sans-serif";
	mso-fareast-font-family:Verdana;
	mso-bidi-font-family:SimSun;}
span.Char
	{mso-style-name:"\9875\7709 Char";
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-locked:yes;
	mso-style-link:\9875\7709;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	font-family:"Verdana","sans-serif";
	mso-ascii-font-family:Verdana;
	mso-fareast-font-family:Verdana;
	mso-hansi-font-family:Verdana;
	mso-bidi-font-family:SimSun;}
span.Char0
	{mso-style-name:"\9875\811A Char";
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-unhide:no;
	mso-style-locked:yes;
	mso-style-link:\9875\811A;
	mso-ansi-font-size:9.0pt;
	mso-bidi-font-size:9.0pt;
	font-family:"Verdana","sans-serif";
	mso-ascii-font-family:Verdana;
	mso-fareast-font-family:Verdana;
	mso-hansi-font-family:Verdana;
	mso-bidi-font-family:SimSun;}
p.small, li.small, div.small
	{mso-style-name:small;
	mso-style-unhide:no;
	mso-style-parent:"";
	margin:0cm;
	margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:1.0pt;
	font-family:"Verdana","sans-serif";
	mso-fareast-font-family:Verdana;
	mso-bidi-font-family:SimSun;}
.MsoChpDefault
	{mso-style-type:export-only;
	mso-default-props:yes;
	font-size:10.0pt;
	mso-ansi-font-size:10.0pt;
	mso-bidi-font-size:10.0pt;
	mso-ascii-font-family:"Times New Roman";
	mso-hansi-font-family:"Times New Roman";
	mso-font-kerning:0pt;}
 /* Page Definitions */
 @page
	{mso-footnote-separator:url("filename.files/header.htm") fs;
	mso-footnote-continuation-separator:url("filename.files/header.htm") fcs;
	mso-endnote-separator:url("filename.files/header.htm") es;
	mso-endnote-continuation-separator:url("filename.files/header.htm") ecs;}
@page WordSection1
	{size:595.3pt 841.9pt;
	margin:72.0pt 90.0pt 72.0pt 90.0pt;
	mso-header-margin:42.55pt;
	mso-footer-margin:49.6pt;
	mso-header:url("filename.files/header.htm") h1;
	mso-footer:url("filename.files/header.htm") f1;
	mso-paper-source:0;}
div.WordSection1
	{page:WordSection1;}
-->
</style>
<!--[if gte mso 10]>
<style>
 /* Style Definitions */
 table.MsoNormalTable
	{mso-style-name:\666E\901A\8868\683C;
	mso-tstyle-rowband-size:0;
	mso-tstyle-colband-size:0;
	mso-style-noshow:yes;
	mso-style-priority:99;
	mso-style-parent:"";
	mso-padding-alt:0cm 5.4pt 0cm 5.4pt;
	mso-para-margin:0cm;
	mso-para-margin-bottom:.0001pt;
	mso-pagination:widow-orphan;
	font-size:10.0pt;
	font-family:"Times New Roman","serif";}
</style>
<![endif]--><!--[if gte mso 9]><xml>
 <o:shapedefaults v:ext=3D"edit" spidmax=3D"1026"/>
</xml><![endif]--><!--[if gte mso 9]><xml>
 <o:shapelayout v:ext=3D"edit">
  <o:idmap v:ext=3D"edit" data=3D"1"/>
 </o:shapelayout></xml><![endif]-->
</head>
					=09

<body lang=3DZH-CN style=3D'tab-interval:21.0pt'>

<div class=3DWordSection1>
EOH;
		return $return;
		}
		
		/**
		 * Return Document footer
		 *
		 * @return String
		 */
		function getFotter()
		{
			//echo 'getFotter Entered.<br>';
			$return  = <<<EOH
			 </div>

</body></html>

------=_NextPart_01CD6FE5.963BD570
Content-Location: file:///C:/1E889205/filename.files/header.htm
Content-Transfer-Encoding: quoted-printable
Content-Type: text/html; charset="utf-8"

<html xmlns:v=3D"urn:schemas-microsoft-com:vml"
xmlns:o=3D"urn:schemas-microsoft-com:office:office"
xmlns:w=3D"urn:schemas-microsoft-com:office:word"
xmlns:m=3D"http://schemas.microsoft.com/office/2004/12/omml"
xmlns=3D"http://www.w3.org/TR/REC-html40">

<head>
<meta http-equiv=3DContent-Type content=3D"text/html; charset=3Dutf-8">
<meta name=3DProgId content=3DWord.Document>
<meta name=3DGenerator content=3D"Microsoft Word 14">
<meta name=3DOriginator content=3D"Microsoft Word 14">
<link id=3DMain-File rel=3DMain-File href=3D"../filename.htm">
<![if IE]>
<base href=3D"file:///C:\1E889205\filename.files\header.htm"
id=3D"webarch_temp_base_tag">
<![endif]><!--[if gte mso 9]><xml>
 <o:shapedefaults v:ext=3D"edit" spidmax=3D"2049"/>
</xml><![endif]-->
</head>

<body lang=3DZH-CN>

<div style=3D'mso-element:footnote-separator' id=3Dfs>

<p class=3DMsoNormal><span lang=3DEN-US><span style=3D'mso-special-characte=
r:footnote-separator'><![if !supportFootnotes]>

<hr align=3Dleft size=3D1 width=3D"33%">

<![endif]></span></span></p>

</div>

<div style=3D'mso-element:footnote-continuation-separator' id=3Dfcs>

<p class=3DMsoNormal><span lang=3DEN-US><span style=3D'mso-special-characte=
r:footnote-continuation-separator'><![if !supportFootnotes]>

<hr align=3Dleft size=3D1>

<![endif]></span></span></p>

</div>

<div style=3D'mso-element:endnote-separator' id=3Des>

<p class=3DMsoNormal><span lang=3DEN-US><span style=3D'mso-special-characte=
r:footnote-separator'><![if !supportFootnotes]>

<hr align=3Dleft size=3D1 width=3D"33%">

<![endif]></span></span></p>

</div>

<div style=3D'mso-element:endnote-continuation-separator' id=3Decs>

<p class=3DMsoNormal><span lang=3DEN-US><span style=3D'mso-special-characte=
r:footnote-continuation-separator'><![if !supportFootnotes]>

<hr align=3Dleft size=3D1>

<![endif]></span></span></p>

</div>

<div style=3D'mso-element:header' id=3Dh1>

<div style=3D'mso-element:para-border-div;border:none;border-bottom:solid w=
indowtext 1.0pt;
mso-border-bottom-alt:solid windowtext .75pt;padding:0cm 0cm 1.0pt 0cm'>

<p class=3DMsoHeader><span lang=3DEN-US style=3D'mso-fareast-font-family:Si=
mSun;
mso-fareast-theme-font:minor-fareast'>$this->title<o:p></o:p></span></p>

</div>

</div>

<div style=3D'mso-element:footer' id=3Df1><w:Sdt SdtDocPart=3D"t"
 DocPartType=3D"Page Numbers (Bottom of Page)" DocPartUnique=3D"t" ID=3D"-4=
04219531"><span
 lang=3DEN-US style=3D'font-size:9.0pt;font-family:"Verdana","sans-serif";
 mso-fareast-font-family:Verdana;mso-bidi-font-family:SimSun;mso-ansi-langu=
age:
 EN-US;mso-fareast-language:ZH-CN;mso-bidi-language:AR-SA'><w:sdtPr></w:sdt=
Pr><w:Sdt
  SdtDocPart=3D"t" DocPartType=3D"Page Numbers (Top of Page)" DocPartUnique=
=3D"t"
  ID=3D"-1669238322"></span>
  <p class=3DMsoFooter align=3Dcenter style=3D'text-align:center'><span lan=
g=3DEN-US
  style=3D'mso-ansi-language:ZH-CN'><span style=3D'mso-spacerun:yes'>&nbsp;=
</span></span><!--[if supportFields]><b><span
  lang=3DEN-US style=3D'font-size:12.0pt'><span style=3D'mso-element:field-=
begin'></span></span><span
  lang=3DEN-US>PAGE</span></b><b><span lang=3DEN-US style=3D'font-size:12.0=
pt'><span
  style=3D'mso-element:field-separator'></span></span></b><![endif]--><b><s=
pan
  lang=3DEN-US style=3D'mso-no-proof:yes'>1</span></b><!--[if supportFields=
]><b><span
  lang=3DEN-US style=3D'font-size:12.0pt'><span style=3D'mso-element:field-=
end'></span></span></b><![endif]--><span
  style=3D'mso-ansi-language:ZH-CN'> / </span><!--[if supportFields]><b><sp=
an
  lang=3DEN-US style=3D'font-size:12.0pt'><span style=3D'mso-element:field-=
begin'></span></span><span
  lang=3DEN-US>NUMPAGES</span></b><b><span lang=3DEN-US style=3D'font-size:=
12.0pt'><span
  style=3D'mso-element:field-separator'></span></span></b><![endif]--><b><s=
pan
  lang=3DEN-US style=3D'mso-no-proof:yes'>1</span></b><!--[if supportFields=
]><b><span
  lang=3DEN-US style=3D'font-size:12.0pt'><span style=3D'mso-element:field-=
end'></span></span></b><![endif]--><span
  lang=3DEN-US><w:sdtPr></w:sdtPr></span></p>
 </w:Sdt></w:Sdt>

<p class=3DMsoFooter><span lang=3DEN-US><o:p>&nbsp;</o:p></span></p>

</div>

</body>

</html>
EOH;
$return .= $this -> aa;
$return .= <<<EOH

------=_NextPart_01CD6FE5.963BD570--
EOH;
			return $return;
		}
		
		/**
		 * Create The MS Word Document from given HTML
		 *
		 * @param String $html :: URL Name like http://www.example.com
		 * @param String $file :: Document File Name
		 * @param Boolean $download :: Wheather to download the file or save the file
		 * @return boolean 
		 */
		
		function createDocFromURL($url,$file,$download=false)
		{
			//echo 'createDocFromURL Entered.<br>';
			if(!preg_match("/^http:/",$url))
				$url="http://".$url;
			$f = fopen($url,'rb');
			while(!feof($f)){
				$html= fread($f,8192);
			}
			return $this->createDoc($html,$file,$download);	
		}

		/**
		 * Create The MS Word Document from given HTML
		 *
		 * @param String $html :: HTML Content or HTML File Name like path/to/html/file.html
		 * @param String $file :: Document File Name
		 * @param Boolean $download :: Wheather to download the file or save the file
		 * @return boolean 
		 */
		
		function createDoc($html,$file,$download=false)
		{
			//echo 'createDoc Entered.<br>';
			if(@is_file($html))
				$html=@file_get_contents($html);
			
			$this->_parseHtml($html);
			$this->setDocFileName($file);
			$doc=$this->getHeader();
			$doc.=$this->htmlBody;
			$doc.=$this->getFotter();
							
			if($download)
			{
				//$this->write_file($this->docFile,$doc);
				@header("Cache-Control: ");// leave blank to avoid IE errors
				@header("Pragma: ");// leave blank to avoid IE errors
				@header("Content-type: application/octet-stream");
				@header("Content-Disposition: attachment; filename=\"$this->docFile\"");
				echo $doc;
				return true;
			}
			else 
			{
				return $this->write_file($this->docFile,$doc);
			}
		}
		
		/**
		 * Parse the html and remove <head></head> part if present into html
		 *
		 * @param String $html
		 * @return void
		 * @access Private
		 */
		
		function _parseHtml($html)
		{
			//echo '_parseHtml Entered.<br>';
			$html=preg_replace("/<!DOCTYPE((.|\n)*?)>/ims","",$html);
			$html=preg_replace("/<script((.|\n)*?)>((.|\n)*?)<\/script>/ims","",$html);
			preg_match("/<head>((.|\n)*?)<\/head>/ims",$html,$matches);
			$head=$matches[1];
			preg_match("/<title>((.|\n)*?)<\/title>/ims",$head,$matches);
			$this->title = $matches[1];
			$html=preg_replace("/<head>((.|\n)*?)<\/head>/ims","",$html);
			$head=preg_replace("/<title>((.|\n)*?)<\/title>/ims","",$head);
			$head=preg_replace("/<\/?head>/ims","",$head);
			$html=preg_replace("/<\/?body((.|\n)*?)>/ims","",$html);
			$this->htmlHead=$head;
			
			preg_match_all("/\<img.*?src\=\"(.*?)\"[^>]*>/i", $html, $match);
			$this -> aa="";
			foreach($match[0] as $k=>$v){
				$base = explode(",",$match[1][$k]);
				$html = str_replace($match[0][$k],"<img src=3D'filename.files/image".$k.".png'>",$html);
				$this -> aa  .= <<<EOH

------=_NextPart_01CD6FE5.963BD570
Content-Location: file:///C:/1E889205/filename.files/image$k.png
Content-Transfer-Encoding: base64
Content-Type: image/png

$base[1]
EOH;
			}
			$this->htmlBody=$html;
			
			
			
			
			return;
		}
		
		/**
		 * Write the content int file
		 *
		 * @param String $file :: File name to be save
		 * @param String $content :: Content to be write
		 * @param [Optional] String $mode :: Write Mode
		 * @return void
		 * @access boolean True on success else false
		 */
		
		function write_file($file,$content,$mode="w")
		{
			//echo 'write_file entered!<br>';
			$fp=@fopen($file,$mode);
			if(!is_resource($fp)){
				return false;
			}
			fwrite($fp,$content);
			fclose($fp); 
			//file_put_contents ($file, $content);
			return true;
		}

	}

?>