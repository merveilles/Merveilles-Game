<?php

session_start();
if(!$_SESSION['loggedin'] || !($_SESSION['name'] == 'fet' || $_SESSION['name'] == 'ika' || $_SESSION['name'] == 'y4m')) header('Location: ./login.php', true, 302);

?><html>
<head>
	<script type="text/javascript" src="scripts/jsme/mootools-1.2.4-core-yc.js"></script>
	<script type="text/javascript" src="scripts/jsme/mootools-1.2.4.2-more.js"></script>
	<script type="text/javascript" src="scripts/jsme/gui/MavDialog.js"></script>
	<link rel="stylesheet" type="text/css" href="scripts/jsme/gui/mavdialog.css" />
	<script charset="utf-8" type="text/javascript" src="scripts/jsme/gui/toolbar.js"></script>
	<script charset="utf-8" type="text/javascript" src="scripts/jsme/gui/window.js"></script>
	<script charset="utf-8" type="text/javascript" src="scripts/jsme/mapeditor.js"></script>
	<script charset="utf-8" type="text/javascript" src="scripts/jsme/mapeditortile.js"></script>
	<script charset="utf-8" type="text/javascript" src="scripts/jsme/mapeditor_gui.js"></script>
	<script charset="utf-8" type="text/javascript" src="scripts/jsme/mapeditor_map.js"></script>
	<script charset="utf-8" type="text/javascript" src="scripts/jsme/plugins/merveilles/plugin.js"></script>

	<title>Editeur de cartes pour Merveilles</title>
</head>
<body style="overflow:hidden;">
<?php

	$floor = isset($_GET['floor']) ? (int) $_GET['floor'] : 1;
	if($floor < 1) $floor = 1;
	
	if(file_exists('./levels/'.$floor.'-1.dat'))
	{
		$level = unserialize(file_get_contents('./levels/'.$floor.'-1.dat'));
	}
	else
	{
		die('la carte n\'existe pas !');
	}
	
	$background = 'img/backgrounds/'.$floor.'-1.gif';
	if(!file_exists('./'.$background)) $background = 'img/world.gif';

	$data = array(
		'floor' => $floor,
		'level' => $level,
		'background' => $background
	);
?>
	<div id="editor_container"></div>
	<script type="text/javascript">
		MerveillesME_Init('editor_container', <?php echo json_encode($data) ?>);
	</script>
</body>
</html>
