<?php
//============================================================+
// File name   : example_009.php
// Begin       : 2008-03-04
// Last Update : 2013-05-14
//
// Description : Example 009 for TCPDF class
//               Test Image
//
// Author: Nicola Asuni
//
// (c) Copyright:
//               Nicola Asuni
//               Tecnick.com LTD
//               www.tecnick.com
//               info@tecnick.com
//============================================================+

/**
 * Creates an example PDF TEST document using TCPDF
 * @package com.tecnick.tcpdf
 * @abstract TCPDF - Example: Test Image
 * @author Nicola Asuni
 * @since 2008-03-04
 */

// Include the main TCPDF library (search for installation path).
require_once('tcpdf_include.php');

// create new PDF document
$pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

// set document information
$pdf->SetCreator(PDF_CREATOR);
$pdf->SetAuthor('Nicola Asuni');
$pdf->SetTitle('TCPDF Example 009');
$pdf->SetSubject('TCPDF Tutorial');
$pdf->SetKeywords('TCPDF, PDF, example, test, guide');

// set default header data
$pdf->SetHeaderData(PDF_HEADER_LOGO, PDF_HEADER_LOGO_WIDTH, PDF_HEADER_TITLE.' 009', PDF_HEADER_STRING);

// set header and footer fonts
$pdf->setHeaderFont(Array(PDF_FONT_NAME_MAIN, '', PDF_FONT_SIZE_MAIN));
$pdf->setFooterFont(Array(PDF_FONT_NAME_DATA, '', PDF_FONT_SIZE_DATA));

// set default monospaced font
$pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
$pdf->SetMargins(PDF_MARGIN_LEFT, PDF_MARGIN_TOP, PDF_MARGIN_RIGHT);
$pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
$pdf->SetFooterMargin(PDF_MARGIN_FOOTER);

// set auto page breaks
$pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
$pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);

// set some language-dependent strings (optional)
if (@file_exists(dirname(__FILE__).'/lang/eng.php')) {
	require_once(dirname(__FILE__).'/lang/eng.php');
	$pdf->setLanguageArray($l);
}

// -------------------------------------------------------------------

// add a page
$pdf->AddPage();

// set JPEG quality
$pdf->setJPEGQuality(75);

// Image method signature:
// Image($file, $x='', $y='', $w=0, $h=0, $type='', $link='', $align='', $resize=false, $dpi=300, $palign='', $ismask=false, $imgmask=false, $border=0, $fitbox=false, $hidden=false, $fitonpage=false)

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Example of Image from data stream ('PHP rules')
$imgdata = base64_decode('/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAoHBwgHBgoICAgLCgoLDhgQDg0NDh0VFhEYIx8lJCIfIiEmKzcvJik0KSEiMEExNDk7Pj4+JS5ESUM8SDc9Pjv/wAALCAA3ACMBAREA/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/9oACAEBAAA/APZe1cJ418fQ6JqcWj299bWk4AkubiZS4hUjgKg+8x6+gGPWvPtc8aeLNMeHXNN8Wx6rZu+10SFVWNuoVk7ZAPNew+EPECeKfDNpq6R+UZ1IkjzkI4OGA9sityobq5hsrSa6uHEcMKGSRj2UDJNeY6R4UstZv9Y1Pxdoa+Xcr9sW9kkYDY4yqA5G0oowfXPtXnfj2DwpY29hF4UPy3Ad7ki583IBG0EZ4IwT+NeufBmMp8ObQn+KaU/+PEf0rvK4z4sSXY8A3dvZRvJNdSxQBYwSzbnHAA9en41d1bxNp/h7wjHqGs4WN7dQLdh88jleUCnvng+nevmfV72TVdQn1M2iW0U8h2JDHtjTH8IwMcDFew/AvxPbvps/hu4kCXEUhmtwxx5iH7wHuCM/j7V67VTVb2DTNLudQuFDR2sTTEd/lBPHvXyx4p8T6n4r1Z7/AFKUk9I4h9yFf7qj+vevaLTwzofiH4PWUUdqD5do80DKcMJwpyTjqcjmvEvD88tnr+nXdtJ5c8N3Hjtj5h+nY19b1yfxH1eHRfCU7zxeclwTEU/vZB/wr5otrSW+uDFCAGA6McegH6kfnX0f8MtPksvB0dpKgMYmdow3dD3/AB5P4187azbvp+uX1quR9muXjBxgjaxAr6t0Waa80OwurpAs81vHJIB/eKgn9TVXxVYrqegX1oYY5HMDGPzT8obHBP0OK8CbTLiPXLm1u4As0ccceYWBG5QFXLY6EjJ9Ttr3PwsZLWGG1nCCQwKH2fd3KBkD9a8o1jwnZ33xT1i0vXkzPcRzQwxcmRWZWk/EIWIHf8K96ACgAAADgAdqjaMMHB3MH4Iz2rMPhXQ3uPtMmnRvMcZdsknHTPOOK0obW3t+IYUTA/hWsZvCttJ4x/4SCX94RENiE/ckA27vf5ePbn8N+v/Z');
//
$imgdata1 = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAH0AAAAxCAYAAAD3GqYyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAA3VJREFUeF7tW9FSJDEI9P7/o891y9FcjqS7CSSOy1b54IbQ0A0JM6V//j4+b/V5LQY+RK/PazHw9lrpVrbPk71oOMfA405JB7cw8lHT07ovQIl+X+3ckZfoburuu7FEv6927shLdDd1991Yot9XO3fkvegfv18/ny/Nvn4f2Vp2rW1N7255cjaOOr0V/kJWvmujdYk+qr4cGr69sklmxNHmbMURhTkT3cKAHWw897tEn1VaVPIjPyPhM3GtYzQLL1J0xRf9cmbH0OGp7ixBrrtyt/+LZ7NDPztZKczlTs8kYNbt7WmzK4YdRT4TbyQ6EhytP4uZIXFWfcz+FZsT2DsE70+S/ipjrjZm9nB1OhoeVgRl9mYOUug6yT7ileJSbJemd6b6GOFWbLzJejCZzvH4Za6uWQGucODq9MgkVV8ryapYJ+xRfhGn3DHRUXLWcaTsmQkW5UcpChaTtVOwe9vbiB5JRqQvlnwWk7VjcZkZhZ7eV0CzhyEU2w5ime5iBUH5qOu36HQ1KWT/k0VHsWetU8/pKrg1BfffqT5Z+xPYJzBZPswTph+imATURxvUbV5MZrrNwl4ZHlfz9ez/R+eVimH3IuJZPx67E9gnMBVuUo5372CjBM7anhDgBCbLhzm9qwEz9lE2nmKKxo72p4gVZftfpzNJ9XNARDAq7rNig/5ZQPGj2EbwkuGjRBeLp0QXCVuZeM1Hj+p010FQnS4WbnW6SFh1uqsxwzfBTm9fBFzDU1vtUZXf+7FevPTfZWP3uUcOj6Prqs2xfwnTD9BX/tbLmmmDsY9BlgiRJFgCjoS/Ys4Q3Sq+jKcVdOp5moDVA3Y6IjiD+BHJSBDvOTjKYVSIXhx2HxPPSmwl+mAuYYhnRVTtGOyVBqBEb+8O9jqITnSlslEsCoFRJ9soJoZrJV5zdkAioqEtioRZdTOVj4RFd+joGlslWImL4RrFw+gx7fR+kEKDlZIgKjY0S7BDCxNT211XjlaukZhW/r3ojMAoXlenI9KYykI+RmQi32idwVWFjMJkY2OKX/bFdhy6g1TgEe7sTluNNSKHnaIrXCj8U4Mcex8qwDPRWWJZOxSX4kexRbhofXTFoH1o/ceJjgJu16MEUPwotkouO21L9AfbipCK7U4hFawSvURX6qVs78rAlj+MvCs5vzXuEv23KjvJ6x35oJ4qomf7ewAAAABJRU5ErkJggg==');
//
//$imgdata2 = base64_decode('iVBORw0KGgoAAAANSUhEUgAAAH0AAAAxCAYAAAD3GqYyAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAgY0hSTQAAeiYAAICEAAD6AAAAgOgAAHUwAADqYAAAOpgAABdwnLpRPAAAA3VJREFUeF7tW9FSJDEI9P7/o891y9FcjqS7CSSOy1b54IbQ0A0JM6V//j4+b/V5LQY+RK/PazHw9lrpVrbPk71oOMfA405JB7cw8lHT07ovQIl+X+3ckZfoburuu7FEv6927shLdDd1991Yot9XO3fkvegfv18/ny/Nvn4f2Vp2rW1N7255cjaOOr0V/kJWvmujdYk+qr4cGr69sklmxNHmbMURhTkT3cKAHWw897tEn1VaVPIjPyPhM3GtYzQLL1J0xRf9cmbH0OGp7ixBrrtyt/+LZ7NDPztZKczlTs8kYNbt7WmzK4YdRT4TbyQ6EhytP4uZIXFWfcz+FZsT2DsE70+S/ipjrjZm9nB1OhoeVgRl9mYOUug6yT7ileJSbJemd6b6GOFWbLzJejCZzvH4Za6uWQGucODq9MgkVV8ryapYJ+xRfhGn3DHRUXLWcaTsmQkW5UcpChaTtVOwe9vbiB5JRqQvlnwWk7VjcZkZhZ7eV0CzhyEU2w5ime5iBUH5qOu36HQ1KWT/k0VHsWetU8/pKrg1BfffqT5Z+xPYJzBZPswTph+imATURxvUbV5MZrrNwl4ZHlfz9ez/R+eVimH3IuJZPx67E9gnMBVuUo5372CjBM7anhDgBCbLhzm9qwEz9lE2nmKKxo72p4gVZftfpzNJ9XNARDAq7rNig/5ZQPGj2EbwkuGjRBeLp0QXCVuZeM1Hj+p010FQnS4WbnW6SFh1uqsxwzfBTm9fBFzDU1vtUZXf+7FevPTfZWP3uUcOj6Prqs2xfwnTD9BX/tbLmmmDsY9BlgiRJFgCjoS/Ys4Q3Sq+jKcVdOp5moDVA3Y6IjiD+BHJSBDvOTjKYVSIXhx2HxPPSmwl+mAuYYhnRVTtGOyVBqBEb+8O9jqITnSlslEsCoFRJ9soJoZrJV5zdkAioqEtioRZdTOVj4RFd+joGlslWImL4RrFw+gx7fR+kEKDlZIgKjY0S7BDCxNT211XjlaukZhW/r3ojMAoXlenI9KYykI+RmQi32idwVWFjMJkY2OKX/bFdhy6g1TgEe7sTluNNSKHnaIrXCj8U4Mcex8qwDPRWWJZOxSX4kexRbhofXTFoH1o/ceJjgJu16MEUPwotkouO21L9AfbipCK7U4hFawSvURX6qVs78rAlj+MvCs5vzXuEv23KjvJ6x35oJ4qomf7ewAAAABJRU5ErkJggg==');

// The '@' character is used to indicate that follows an image data stream and not an image file name
//$pdf->Image('@'.$imgdata2);
$pdf->Image('@'.$imgdata, 15, 50);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Image example with resizing
//$pdf->Image('images/image_demo.jpg', 15, 140, 75, 113, 'JPG', 'http://www.tcpdf.org', '', true, 150, '', false, false, 1, false, false, false);

$pdf->Image('@'.$imgdata1);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// test fitbox with all alignment combinations

$horizontal_alignments = array('L', 'C', 'R');
$vertical_alignments = array('T', 'M', 'B');

//$x = 15;
//$y = 35;
//$w = 30;
//$h = 30;
//// test all combinations of alignments
//for ($i = 0; $i < 3; ++$i) {
//	$fitbox = $horizontal_alignments[$i].' ';
//	$x = 15;
//	for ($j = 0; $j < 3; ++$j) {
//		$fitbox{1} = $vertical_alignments[$j];
//		$pdf->Rect($x, $y, $w, $h, 'F', array(), array(128,255,128));
//		$pdf->Image('images/image_demo.jpg', $x, $y, $w, $h, 'JPG', '', '', false, 300, '', false, false, 0, $fitbox, false, false);
//		$x += 32; // new column
//	}
//	$y += 32; // new row
//}

//$x = 115;
//$y = 35;
//$w = 25;
//$h = 50;
//for ($i = 0; $i < 3; ++$i) {
//	$fitbox = $horizontal_alignments[$i].' ';
//	$x = 115;
//	for ($j = 0; $j < 3; ++$j) {
//		$fitbox{1} = $vertical_alignments[$j];
//		$pdf->Rect($x, $y, $w, $h, 'F', array(), array(128,255,255));
//		$pdf->Image('images/image_demo.jpg', $x, $y, $w, $h, 'JPG', '', '', false, 300, '', false, false, 0, $fitbox, false, false);
//		$x += 27; // new column
//	}
//	$y += 52; // new row
//}

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// Stretching, position and alignment example
//
//$pdf->SetXY(110, 200);
//$pdf->Image('images/image_demo.jpg', '', '', 40, 40, '', '', 'T', false, 300, '', false, false, 1, false, false, false);
//$pdf->Image('images/image_demo.jpg', '', '', 40, 40, '', '', '', false, 300, '', false, false, 1, false, false, false);

// -------------------------------------------------------------------

//Close and output PDF document
$pdf->Output('example_009.pdf', 'I');

//============================================================+
// END OF FILE
//============================================================+
