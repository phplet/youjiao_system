<?php
/*
$svr = array(
  'smtp' => '发件smtp',
  'user' => '发件账号',
  'pass' => '密码',
  'host' => '发件主机',
); // 其他参数见Fmail::$svr
$debug = true;
$mail = array(
  'name' => '发件人名字',
  'from' => '发件人',
  'to' => '收件人',
  'cc' => '抄送',
  'subject' => "Hello, 这是主题!",
  'cont' => "<span style=\"color:red;\">信件内容</span>",
  'cont_type' => Fmail::CONT_TYPE_HTML, // html格式
  'apart' => true, // 隐藏To、Cc和Bcc
); // 其他参数见Fmail::send($mail)
$fmail = new Fmail($svr, $debug);
if($fmail->send($mail)) echo "发送成功！\n";
else echo "发送失败！\n";
$fmail->close();
*/

class Fmail {
  const CRLF = "\r\n";
  const BUF_LEN = 512;
  const RCPT_NUM = 99; // NOTE: 收件人上限，使用者须注意
  const CONT_TYPE_PLAIN = 1;
  const CONT_TYPE_HTML = 2;

  // TODO: log_
  protected $fp; //socket句柄
  protected $debug = false;  // 是否显示调试信息
  protected $svr = array();
  /*'smtp'      // 发件服务器的地址
    'port'      // 发件服务器的端口一般默认为25
    'time_out'             
    'host'      // 用在HELO后面，host / ip
    'user'      // 发件人帐号名称（现在基本都要验证的）
    'pass       // 发件人帐号密码
    'x_mailer'  // (PHP/phpversion())
   */

  public function __construct($svr, $debug = false) {
    $this->opSvr($svr);
    $this->opDebug($debug);
    if(!$this->connect()) {
      $this->close();
      die('FAILED!');
    }
  }

  public function opSvr($svr = null) {
    $tmp = $this->svr;
    if($svr) {
      if(empty($svr['host'])) $svr['host'] = gethostbyaddr("localhost");
      if(empty($svr['host'])) $svr['host'] = gethostbyname("localhost");
      if(empty($svr['port'])) $svr['port'] = 25;
      if(empty($svr['time_out'])) $svr['time_out'] = 30;
      if(empty($svr['x_mailer'])) $svr['x_mailer'] = "PHP/".phpversion();
      $this->svr = $svr;
    }
    return $tmp;
  }
  public function opDebug($debug = null) {
    $tmp = $this->debug;
    if(!is_null($debug)) $this->debug = (bool)$debug;
    return $tmp;
  }

  public function connect() {
    $this->close();
    $svr = & $this->svr;
    $this->show_debug("Connect to SMTP server : ".$svr['smtp'], "out");
    $this->fp = fsockopen($svr['smtp'], $svr['port'], 
      $errno, $errstr, $svr['time_out']);
    $fp = & $this->fp;
    if(false === $fp) {
      $this->show_debug("Connect failed! ERRNO: $errno ERRSTR: $errstr", "in");
      return false;
    }
    stream_set_blocking($fp, true);
    $msg = fgets($fp, self::BUF_LEN);
    $this->show_debug($msg, "in");
    if(220 !== (int)$msg) return false;
    if(!$this->do_cmd("HELO " . $svr['host'], 250)) return false;
    if(!empty($svr['user'])) {
      $user = base64_encode($this->svr['user']);
      if(!$this->do_cmd("AUTH LOGIN $user", 334)) return false;
      /*if(!$this->do_cmd("AUTH LOGIN ", 334)) return false;
      if(!$this->do_cmd(base64_encode($svr['user']), 334)) return false;*/
      if(!$this->do_cmd(base64_encode($svr['pass']), 235)) return false;
    }
    return true;
  }
  public function close() {
    if($this->fp) {
      $this->do_cmd("QUIT", 250);
      fclose($this->fp);
    }
    unset($this->fp);
  }

  /* $mail = array();
    'name'(sender), 'from', 'to'(str|array), 'cc'(str|array), 'bcc'(str|array), 
    'subject', 'cont', 'charset'(utf-8), 'cont_type'(0), //'cont_encode'(''), 
    'no_reply'(mail), 'reply'(msg-id), 'xheaders', 'apart'(false), 
   */
  public function send($mail) {
    $fp = & $this->fp;
    $svr = & $this->svr;
    $cs = (empty($mail['charset']) ? 'utf-8' : $mail['charset']);
    $CRLF = self::CRLF;
    if(!$this->do_cmd("MAIL FROM: <{$mail['from']}>", 250)) return false;

    list($msec, $sec) = explode(" ", microtime());
    $header = "Message-ID: <" . date("YmdHis", $sec) . "." . 
      ($msec*1000000) . ".{$mail['from']}>$CRLF";
    // "Message-Id: <" . md5(uniqid(microtime())) . "@{$svr['smtp']}>$CRLF";
    $header .= "Date: " . date("r", $sec) . $CRLF;
    $header .= "Mime-Version: 1.0$CRLF";
    $header .= "X-Mailer: {$svr['x_mailer']} $CRLF";
    $header .= "From: =?$cs?B?" . base64_encode($mail['name']) . "?=<{$mail['from']}>$CRLF";
    // "From: $from<".$from.">\r\n";
    if(!empty($mail['no_reply'])) {
      $header .= "Return-Path: <{$mail['no_reply']}>$CRLF";
      $header .= "Return-To: <{$mail['no_reply']}>$CRLF";
    } elseif(!empty($mail['reply'])) {
      $header .= "In-Reply-To: <{$mail['reply']}>$CRLF";
      $header .= "References: <{$mail['reply']}>$CRLF";
    }
    $subject = str_replace("\n", ' ', $mail['subject']);
    $header .= "Subject: =?$cs?B?" . base64_encode($mail['subject']) . "?=$CRLF";

    // 注意前后位置，某些不可由其更改的header最好置于其后
    if(!empty($mail['xheaders'])) $header .= $mail['xheaders'];
    if(isset($mail['cont_type'])) {
      if(self::CONT_TYPE_PLAIN == $mail['cont_type'])
        $header .= "Content-Type: text/plain; charset=$cs$CRLF";
      else
        $header .= "Content-Type: text/html; charset=$cs$CRLF";
    }

    if(is_string($mail['to'])) $mail['to'] = array($mail['to']);
    if(!isset($mail['cc'])) $mail['cc'] = array();
    elseif(is_string($mail['cc'])) $mail['cc'] = array($mail['cc']);
    if(!isset($mail['bcc'])) $mail['bcc'] = array();
    elseif(is_string($mail['bcc'])) $mail['bcc'] = array($mail['bcc']);
    $tos = array_merge($mail['to'], $mail['cc'], $mail['bcc']);
    foreach($tos as $to) {
      $this->do_cmd("RCPT TO: <$to>", 250); // TODO: 记录失败的
    }
    if(!$this->do_cmd("DATA", 354)) return false;

    if(empty($mail['apart'])) {
      // $header .= "To: =?$cs?B?" . base64_encode($toname) . "?=<{$mail['to']}>$CRLF";
      $header .= "To: " . implode(',', $mail['to']) . "$CRLF";
      if($mail['cc'])
        $header .= "Cc: " . implode(',', $mail['cc']) . "$CRLF";
    }
    $header .= "Content-Transfer-Encoding: base64$CRLF"; // TODO: 7bit 8bit
    $msg = $header . $CRLF . base64_encode($mail['cont']) . "$CRLF.$CRLF";

    $this->show_debug($msg, "out");
    $ret = fwrite($fp, $msg);
    return $ret !== false;
  }

  protected function show_debug($msg, $inout) {
    if($this->debug) {
      $m = ($inout == "in" ? '<< ' : '>> '); // >>响应 <<请求
      $msg = nl2br($msg . self::CRLF);
      echo "${m}${msg}";
    }
  }

  protected function do_cmd($cmd, $code) {
    $this->show_debug($cmd . self::CRLF, "out");
    fwrite($this->fp, $cmd . self::CRLF);
    // 处理多行响应信息
    $msg = "";
    while($rt = fgets($this->fp, self::BUF_LEN)) {
      $msg .= $rt; 
      if($rt{3} !== "-") break;
    }
    // $msg = fgets($this->fp, self::BUF_LEN);
    $this->show_debug($msg, "in");
    return $code === (int)$msg;
  }
}
?>