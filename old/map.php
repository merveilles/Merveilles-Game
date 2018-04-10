<?

//session_start();
//if(!$_SESSION['loggedin'] || !($_SESSION['name'] == 'fet' || $_SESSION['name'] == 'oka')) header('Location: ./login.php', true, 302);

?>

<!DOCTYPE html>

<html>
<head>	
<meta charset="UTF-8">
<meta name="description"         content="Neon Hermetism" />
<meta name="viewport"            content="width=320,initial-scale=1" />
<meta property='og:title'        content='Merveilles Portable Guide'/>
<meta property='og:type'         content='website'/>
<meta property='og:url'          content='http://m0oo.com/mvl/help.php'/>
<meta property='og:image'        content='img/ui/facebook.png'/>
<meta property='og:email'        content='me@m0oo.com'/>
<meta property='og:site_name'    content='Merveilles Portable'/>
<meta property='fb:admins'       content='deoxys'/>
<meta name="description"         content="Merveilles is a mini MMORPG for handhelds(iPod, iPad, Android, webOS) and computer. It was coded by my friend at Deeo and designed by me. There isn't much to it but walking around, and helping other players to walk around." />
<meta name="keywords"            content="merveilles aliceffekt xxiivv free mmo iphone ipod css3" />
<meta property="fb:admins"       content="deoxys"/>
<link rel="apple-touch-icon-precomposed"                         href="http://wiki.xxiivv.com/img/iphone-icon.png" />
<link rel="shortcut icon"                                        href="http://wiki.xxiivv.com/img/favicon.ico" />
<link 		rel='icon' type='image/png' 						 href='img/favicon.ico' />

<style>
body  { font:10pt/20px Arial, sans-serif;}
table { border:1px solid #000; width:100%;}
td    { border-bottom:1px dashed #999; padding:5px;}
hr    { border:0; border-bottom:5px solid #72dec2;}
</style>

<script 	type='text/javascript' 						src='http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js'></script>
<title>Merveilles Portable | Help</title>
</head>

<? 

include('connect.php');


$resetUser = $_GET['User'];
$resetUser = preg_replace("[^A-Za-z0-9]", "", $resetUser );
$resetUser = substr($resetUser,0,3);


print "<h1>Reset Player Location</h1><hr/>";

if($resetUser!=''){
	$UPDATESQL = mysqli_query($db, "UPDATE xiv_merveilles SET floor = 2, x=27, y=41 WHERE mv_name='".$resetUser."'");
	
	print $resetUser;
	print ' was warped to Fauns Nest';
	
}

print "

	<form name='User' action='map.php' method='get'>
	Username: <input type='text' name='User' />
	<input type='submit' value='Warp to F3' />
	</form>

";


























print "<h1>Portals Walkthrough</h1><hr/>";

function townName($floor){
	if($floor=='1')  { 
		$floorColor = 'd1c97f'; 
		return "<b style='color:#$floorColor'>Hayfields</b> <span style='color:#ccc'> F$floor</span>";}
	elseif($floor=='2')  { 
		$floorColor = 'cd9144'; 
		return "<b style='color:#$floorColor'>Fauns Nest</b> <span style='color:#ccc'> F$floor</span>";}
	elseif($floor=='3')  { 
		$floorColor = '5b6445'; 
		return "<b style='color:#$floorColor'>Emergent Lands</b> <span style='color:#ccc'> F$floor</span>";}
	elseif($floor=='4')  { 
		$floorColor = '5f6571'; 
		return "<b style='color:#$floorColor'>Junction</b> <span style='color:#ccc'> F$floor</span>";}
	elseif($floor=='9')  { 
		$floorColor = '320060'; 
		return "<b style='color:#$floorColor'>Sanabaradas</b> <span style='color:#ccc'> F$floor</span>";}
	elseif($floor=='14') { 
		$floorColor = '877374'; 
		return "<b style='color:#$floorColor'>Lumines</b> <span style='color:#ccc'> F$floor</span>";}
	elseif($floor=='24') { 
		$floorColor = '654747'; 
		return "<b style='color:#$floorColor'>Karmilla</b> <span style='color:#ccc'> F$floor</span>";}
	elseif($floor=='64') { 
		$floorColor = 'ba5151'; 
		return "<b style='color:#$floorColor'>Harriot</b> <span style='color:#ccc'> F$floor</span>";}
	elseif($floor=='100'){ 
		$floorColor = 'd1c97f'; 
		return "<b>Portals Room</b> <span style='color:#ccc'> F$floor</span>";}
	else{ 
		return "F".$floor; }
}


$query = "SELECT * FROM xiv_merveilles_special where to_floor != '0' order by floor ASC";
$result = mysql_query($query); 
if (!$result) {echo 'Pcell.dialog: '.mysql_error(); exit;} 
$previousFloor = 0;
while($row = mysql_fetch_array($result))
{
	$fromFloor = $row['floor'];
	$toFloor   = $row['to_floor'];
	
	$portal[$fromFloor][$toFloor] = "Warp";
}

print "<table>";
print "<tr><td width='160'>From</td><td>To</td></tr>";
foreach($portal as $key => $value) {
	$floorName = townName($key);
	echo "<tr><td valign='top'>$floorName</td><td>";
		ksort($portal[$key]);
		foreach($portal[$key] as $key => $value) {
			$portalName = townName($key);
			echo "- $portalName<br /> ";
		}
	print "</td></tr>";
}

print "</table>";

print "<!--";
print_r($portal);
print "-->";






























print "<h1>Leaderboards</h1><hr/>";

print "<table>";
print "<tr style='font-weight:bold'><td width='20'></td><td width='20'>F</td><td width='100'>Username</td><td>Stats</td><td>Mobs Killed</td><td>Efficiency</td></tr>";

$query = "SELECT * FROM xiv_merveilles where mv_name != 'ika' order by xp DESC LIMIT 10";
$result = mysql_query($query); 
if (!$result) {echo 'Pcell.dialog: '.mysql_error(); exit;} 
while($row = mysql_fetch_array($result))
	{
		$skill = floor($row['xp']/$row['kill']);
		$head = $row['avatar_head'];
		$head = $head * 8;
		$body = $row['avatar_body'];
		$body = $body * 8;
		print "
		<tr>
		<td>
		<div style='height:8px; width:16px; background-image: url(\"img/avatars.gif\"); background-position:0px ".$head."px'></div>
		<div style='height:8px; width:16px; background-image: url(\"img/avatars.gif\"); background-position:16px ".$body."px'></div>
		</td>
		<td>
		".$row['floor']."
		</td>
		<td><b>".$row['mv_name']."</b></td>
		<td>".$row['xp']." XP</td>
		<td>".$row['kill']."</td>
		<td>Level $skill</td>
		</tr>";
	}


print "</table>";











?>

