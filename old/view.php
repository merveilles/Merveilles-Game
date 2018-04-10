<? include('scripts/merveilles.php'); ?>
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
<link rel='icon' type='image/png' 						 		 href='img/favicon.ico' />
<link rel="stylesheet" type="text/css" 							 href="style.css" media="screen" />

<script src="scripts/mootools-1.2.4-core.js"></script>
<script src="scripts/merveilles.js"></script>

<title>Merveilles Portable</title>
</head>
<body id="body">
	
	<? /* MENU */ ?>
	
	
	<? /* SPELLBOOK */ ?>
	
	
	
	<? /* GAME */ ?>
	
	<div class='<?=$classClient?>'>
		<a href='#' class='ui_rightbtn' id='ui_right_chat' onclick="toggle_visibility('guide');"></a>
		<a href='#' class='ui_rightbtn' id='ui_right_map' onclick="toggle_visibility('spellbook');"></a>
		<? /* include('audio/player.php'); musicPlayer("game"); */ ?>
		<a href='logout.php' 	class='ui_rightbtn' id='ui_right_logout'></a>

		<? include('scripts/guide.php'); ?>
		<? include('scripts/spellbook.php'); ?>

		<script type="text/javascript">
			Merveilles.setViewport(<?php echo WIDTH ?>, <?php echo HEIGHT ?>);
			Merveilles.init(<?php echo json_encode($data); ?>);
		</script>
	</div>
	<menu></menu>
</body>
</html>