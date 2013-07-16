<?php

$db = mysql_connect("***", "***", "***") or die("Could not connect.");
if(!$db)
	die("no db");
if(!mysql_select_db("db124350_merveilles",$db))
 	die("No database selected.");
if(!get_magic_quotes_gpc())
{
  $_GET = array_map('mysql_real_escape_string', $_GET);
  $_POST = array_map('mysql_real_escape_string', $_POST);
  $_COOKIE = array_map('mysql_real_escape_string', $_COOKIE);
}
else
{
   $_GET = array_map('stripslashes', $_GET);
   $_POST = array_map('stripslashes', $_POST);
   $_COOKIE = array_map('stripslashes', $_COOKIE);
   $_GET = array_map('mysql_real_escape_string', $_GET);
   $_POST = array_map('mysql_real_escape_string', $_POST);
   $_COOKIE = array_map('mysql_real_escape_string', $_COOKIE);
}

?>