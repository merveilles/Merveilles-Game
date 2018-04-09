<?php
session_start(); 
include 'connect.php';

if(isset($_SESSION['loggedin'])){die("<meta http-equiv='refresh' content='0; URL=portable.php'>");}

$online = 0;
//$result = mysqli_query("SELECT * from xiv_merveilles WHERE mv_time<10  ");
//while($row = mysqli_fetch_array($result))
{$online = $online+1;}


?>
<!DOCTYPE html>

<html>
<head>	
<meta charset="UTF-8">
<meta name="viewport"            content="initial-scale=1" />
<meta property='og:title'        content='Merveilles Portable'/>
<meta property='og:type'         content='website'/>
<meta property='og:url'          content='http://m0oo.com/mvl'/>
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
<link 		rel='stylesheet' type='text/css' 			href='style.css' media='screen' />
<script 	type='text/javascript' 						src='https://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js'></script>
<title>Merveilles Portable | <?=$online?> Players Online </title>

</head>

<body class='loginBody'>

	<? include('audio/player.php'); musicPlayer("login"); ?>
	
	<div class='clientPortable' style='z-index:9000'>

		<a href='' 				class='ui_rightbtn' id='ui_right_chat' style='z-index:9002'></a>
		<a href='map.php' class='ui_rightbtn' id='ui_right_map' style='z-index:9002' target='_blank'></a>
		<a href='logout.php' 	class='ui_rightbtn' id='ui_right_logout' style='z-index:9002'></a>

		<div id='scrolling'></div>

		<span class='logo'>merveilles</span>
		
		<form action='register.php' type='text' method='POST' autocomplete='off' class='login'>
				<input type='text' name='username' MAXLENGTH='3' size='3' value='' class='usr' placeholder='usr'></input> 
				<input type='password' name='password' MAXLENGTH='3' size='3' class='pwd' placeholder='pwd'></input>
				<input type='submit' name='submit' value='' class='sub'>	
				<span><a href='http://deeo.fr' target='_blank' style='color:#6c5c67'>DEEO</a> + <a href='http://xxiivv.com' target='_blank' style='color:#6c5c67'>XXIIVV</a><br /><?=$online?> Players Online</span> 		
		</form>
		
	</div>

</body>
</html>
