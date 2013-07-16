<?php

$i = imagecreatefrompng('./images/back-adv.png');

$hexVal =	array(
	'0' => true,
	'1' => true,
	'2' => true,
	'3' => true,
	'4' => true,
	'5' => true,
	'6' => true,
	'7' => true,
	'8' => true,
	'9' => true,
	'A' => true,
	'B' => true,
	'C' => true,
	'D' => true,
	'E' => true,
	'F' => true
);

$tiles = array(
	'01' => 'block-left.gif',
	'02' => 'block-center.gif',
	'03' => 'block-right.gif',
	'04' => 'platform-left.gif',
	'05' => 'platform-center.gif',
	'06' => 'platform-right.gif',
	'07' => 'hidden.gif'
);

$tilesImages = array();
$data = $_REQUEST['data'];
$length = strlen($data);
$hex = '';

$count = 0;

for($x = 12; $x < $length; $x++)
{
	if(isset($hexVal[$data[$x]]))
	{
		$hex.=$data[$x];
	}
	
	if(strlen($hex) == 2)
	{
		if(isset($tiles[$hex]))
		{
			$tile = $tiles[$hex];
			if(!isset($tilesImages[$tile]))
			{
				$tilesImages[$tile] = imagecreatefromgif('./images/'.$tile);
			}
			
			$rx = floor($count / 15) * 32;
			$ry = ($count % 15) * 32;
			
			imagecopy($i, $tilesImages[$tile], $rx, $ry, 0, 0, 32, 32);
		}
		
		$count++;
		$hex = '';
	}
}

/*
	$iT = imagecreatetruecolor(160, 120);
	imagecopyresampled($iT, $i, 0, 0, 0, 0, 160, 120, 640, 480);
	header('Content-type: image/jpeg');
	imagejpeg($iT, null, 95);
*/

header ('Content-type: image/png');
header('Content-Disposition: attachment; filename="map.png"');
imagepng($i, null, 9, PNG_ALL_FILTERS);
imagedestroy($i);

?>