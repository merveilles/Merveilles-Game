<?php

$db = mysqli_connect("localhost", "root","","db123450_merveilles") or die("Could not connect.");
if(!$db)
	die("no db");
if(!mysqli_select_db($db,"db123450_merveilles"))
 	die("No database selected.");
if(!get_magic_quotes_gpc())
{
  $_GET    = array_map(array($db, 'real_escape_string'), $_GET);
  $_POST   = array_map(array($db, 'real_escape_string'), $_POST);
  $_COOKIE = array_map(array($db, 'real_escape_string'), $_COOKIE);
}
else
{
   $_GET    = array_map('stripslashes', $_GET);
   $_POST   = array_map('stripslashes', $_POST);
   $_COOKIE = array_map('stripslashes', $_COOKIE);
   $_GET    = array_map(array($db, 'real_escape_string'), $_GET);
   $_POST   = array_map(array($db, 'real_escape_string'), $_POST);
   $_COOKIE = array_map(array($db, 'real_escape_string'), $_COOKIE);
}

?>
