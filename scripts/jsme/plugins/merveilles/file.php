<?php

session_start();
if(!$_SESSION['loggedin'] || !($_SESSION['name'] == 'fet' || $_SESSION['name'] == 'ika')) header('Location: ./login.php', true, 302);

$data = $_REQUEST['data'];

$val =	array(
	'0' => true,
	'1' => true,
	'2' => true,
	'3' => true,
	'4' => true,
	'5' => true,
	'6' => true,
	'7' => true,
	'8' => true,
	'9' => true
);

$length = strlen($data);
$hex = '';

$floor = '';

$map = array();
$mx = 0;
$my = 0;
for($x = 0; $x < $length; $x++)
{
	if(isset($val[$data[$x]]))
	{
		$hex.=$data[$x];
	}
	elseif(strlen($hex) > 0)
	{
		if(!$floor)
		{
			$floor = (int) $hex;
		}
		else
		{
			if($mx > 63)
			{
				$mx = 0;
				$my++;
			}
			
			$map[$mx][$my] = (int) $hex;
			
			$mx++;
		}
		
		$hex = '';
	}
}

file_put_contents('./../../../../levels/'.$floor.'-1.dat', serialize($map));


REQUIRE_ONCE('./../../../../connect.php');
mysqli_query('DELETE from xiv_merveilles_monsters where floor = '.$floor);

header('Location: ./../../../../editor.php?floor='.$floor, true, 302);

?>
