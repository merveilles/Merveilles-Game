<?

session_start(); 
include 'connect.php';


$actions = "<meta http-equiv='refresh' content='0; URL=login.php'>";

// Refresh and login if session loggedin

if(isset($_SESSION['loggedin'])){die("$actions");}

// Login in

if(isset($_POST['submit']))
{
   $name = strtolower(preg_replace("/[^A-Za-z0-9 ]/", '', $_POST['username']));
   $pass = strtolower(preg_replace("/[^A-Za-z0-9 ]/", '', $_POST['password']));

   $mysql = mysql_query("SELECT * FROM xiv_merveilles WHERE mv_name = '$name' AND mv_password = '$pass'");
   if(mysql_num_rows($mysql) > 0)
   {
   		$_SESSION['loggedin'] = "YES"; 
			$_SESSION['name'] = $name;
			die("$actions");
   } 
}

// check if input exist

if(strlen($name) < 1 || strlen($pass) < 1){
	die("Something went wrong, try again with another alphanumeric username and password.");
}

// look for username

$mysql = mysql_query("SELECT * FROM xiv_merveilles WHERE mv_name = '$name'");
if(mysql_num_rows($mysql) > 0)
{
		die("Sorry, \"$name\" is already associated with a different password.");
} 

// otherwise, register

$head = rand(2,13);
$body = rand(2,13);

$sql='insert into xiv_merveilles (mv_name,mv_password,x,y,avatar_head,avatar_body)values(\''.$name.'\',\''.$pass.'\', 30, 43, '.$head.', '.$body.')';
$result=mysql_query($sql) or die(mysql_error());
$_SESSION['loggedin'] = "YES"; 
$_SESSION['name'] = $name;
die("$actions");

?>