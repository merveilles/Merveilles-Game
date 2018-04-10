<?php

session_start();
if(!$_SESSION['loggedin']) header('Location: ./login.php', true, 302);

define('TILE_ABSOLUTE_EMPTY', -1);
define('TILE_EMPTY', 0);
define('TILE_WALL', 1);
define('TILE_MONSTER', 2);
define('TILE_DEAD_MONSTER', 3);
define('TILE_STAIR_UP', 4);
define('TILE_STAIR_DOWN', 5);
define('TILE_INVISIBLE_WALL', 6);

define('TILE_INVISIBLE', 7);
define('TILE_WATER', 8);
define('TILE_RAISE', 9);
define('TILE_INVISIBLE_STAIR_UP', 10);
define('TILE_INVISIBLE_STAIR_DOWN', 11);

define('TILE_ADD_WALL_START', 20);
define('TILE_ADD_WALL_NUMBER', 2);

function getPlayerBuild($kill, $save)
{
	$build = round(($kill - $save + 26) / 4);
	
	if($build < 0) $build = 0;
	elseif($build > 13) $build = 13;
	
	return $build;
}

function generateMap(&$square, $playerf, $players, &$logs, $downstairX = null, $downstairY = null)
{
	$map = null;
	
	$square = 64;
	$file = 'levels/'.$playerf.'-'.$players.'.dat';
	
	if(file_exists($file))
	{
		$map = unserialize(file_get_contents($file));
	}
	
	if(!$map)
	{
		srand(($playerf * 4) + $players);
		$y = 0;
		$map = array();
		
		while($y < $square)
		{
			$m = array();
			$x = 0;
			while($x < $square)
			{
				if(($playerf == 1 || $playerf % 10 == 0) && $x >= 30 && $x <= 34 && $y >= 30 && $y <= 34)
				{
					$m[] = TILE_ABSOLUTE_EMPTY;
				}
				else
				{
					$v = TILE_EMPTY;
					
					if(rand(0,99) > 94)
					{
						$r_wall = floor(rand(0, TILE_ADD_WALL_NUMBER));
						
						if($r_wall < 1)
						{
							$v = TILE_WALL;
						}
						else
						{
							$v = TILE_ADD_WALL_START + ($r_wall - 1); //de 20 à ...
						}
					}
					elseif(rand(0,100) > 98)
					{
						 $v = TILE_MONSTER;
					}
					
					$m[] = $v;
				}
				
				$x++;
			}
			$map[] = $m;
			$y++;
		}
		
		/* génération escaliers */
		if($playerf > 1)
		{
			$map[$downstairY][$downstairX] = TILE_STAIR_DOWN;
			//$logs[] = 'UP('.$x.','.$y.') : DOWN('.$downstairX.','.$downstairY.')';
		}
		
		do
		{
			$x = rand(0,64);
			$y = rand(0,64);
		}
		while($map[$y][$x] != TILE_EMPTY);
		
		$map[$y][$x] = TILE_STAIR_UP;
		
		file_put_contents($file, serialize($map));
		
		$logs[] = $map;
	}
	
	return $map;
}

$logs = array();
$monsters = array();

REQUIRE_ONCE('connect.php');

$playern = $_SESSION['name'];

$request="SELECT * from xiv_merveilles where mv_name='".mysqli_real_escape_string($db, $playern)."'";
$request2=mysqli_query($db, $request) or die("Could not get user stats");
$u=mysqli_fetch_array($request2);

// GET VARIABLES
$playerx = $u['x'];
$playery = $u['y'];
$playerf = $u['floor'];
$playermf = $u['max_floor'];
$players = 1; //section
$playerxp = $u['xp'];
$playerhp = $u['hp'];
$playermp = $u['mp'];
$playerkp = $u['kill'];
$playersv = $u['save'];
$playerBuild = getPlayerBuild($playerkp, $playersv);
$playermsg = $u['message'];
$playermsgts = $u['message_timestamp'];
$playerHead = $u['avatar_head'];
$playerBody = $u['avatar_body'];
$warp1 = $u['warp1'];
$warp2 = $u['warp2'];
$warp3 = $u['warp3'];
$warp4 = $u['warp4'];

// $logs[] = $playerBuild;

//.PLAYER // LEVELS
$playerlv = floor(pow($playerxp,1/3));

//.PLAYER // LEVELS // EXPERIENCE BAR

$playernext = floor((pow($playerlv+1,3)));
$playerprev = floor((pow($playerlv,3)));
$playerleft = $playernext - $playerxp;
$playerrigh = $playernext - $playerprev;
$playerxx = floor(($playerleft / $playerrigh)*100);
$playerxx = 100-$playerxx;

if($playerlv < 1) $playerlv = 1;

$square = null;

$map = generateMap($square, $playerf, $players, $logs);

if(isset($_GET['action']))
{
	$reqAction = $_GET['action'];
	$reqX = $_GET['x'];
	$reqY = $_GET['y'];
	$playerx = $_GET['position_x'];
	$playery = $_GET['position_y'];
	
	if($map[$playery][$playerx] == TILE_RAISE)
	{
		$playerhp = 30;
		$playermp = 30;
	}
}

$request= "SELECT x, y, message, to_floor as toFloor, to_x as toX, to_y as toY, image from xiv_merveilles_special where floor = '".$playerf."'";
$result = mysqli_query($db, $request) or die(mysqli_error($db));
while($row = mysqli_fetch_assoc($result))
{
	$map[$row['y']][$row['x']] = $row;
}

if(isset($reqAction))
{
	if($reqAction == 'portal' && isset($map[$reqY]) && isset($map[$reqY][$reqX]))
	{
		$tile = $map[$reqY][$reqX];
		
		if(is_array($tile))
		{
			$newFloor = max(1, $tile['toFloor']);
			
			if($newFloor <= $playermf || $playerhp > 0)
			{
				$playerx = min(max(0, $tile['toX']), $square-1);
				$playery = min(max(0, $tile['toY']), $square-1);
				
				$playerf = $newFloor;
				
				if($playerf > $playermf) $playermf = $playerf;
				
				$map = generateMap($square, $playerf, $players, $logs, $playerx, $playery);
			}
		}
	}
	elseif($reqAction == 'stair' && isset($map[$reqY]) && isset($map[$reqY][$reqX]))
	{
		$tile = $map[$reqY][$reqX];
		
		$difF = null;
		$difS = null; //sections, later
		
		if($tile == TILE_STAIR_UP || $tile == TILE_INVISIBLE_STAIR_UP)
		{
			$difF = 1;
		}
		elseif($tile == TILE_STAIR_DOWN || $tile == TILE_INVISIBLE_STAIR_DOWN)
		{
			$difF = -1;
		}
		
		if($difF || $difS)
		{
			$newFloor = $playerf + $difF;
			$newSection = $players + $difS;
			
			if($newFloor > 0 && ($newFloor <= $playermf || $playerhp > 0))
			{
				$playerx = $reqX;
				$playery = $reqY;
				
				$playerf = $newFloor;
				$players = $newSection;
				if($playerf > $playermf) $playermf = $playerf;
				
				$map = generateMap($square, $playerf, $players, $logs, $playerx, $playery);
			}
		}
	}
	elseif($reqAction == 'chat')
	{
		$playermsg = $reqX;
		$playermsgts = time();
	}
}

if((time() - $playermsgts) > 5)
{
	$playermsg = '';
}

$request= "SELECT x, y, health from xiv_merveilles_monsters where floor = '".$playerf."' ORDER BY `time` DESC";
$result = mysqli_query($db,$request) or die(mysqli_error($db));

while($row = mysqli_fetch_assoc($result))
{
	if($row['health'] == 0)
	{
		$map[$row['y']][$row['x']] = TILE_DEAD_MONSTER;
	}
	else
	{
		if(!isset($monsters[$row['y']])) $monsters[$row['y']] = array();
		
		$monsters[$row['y']][$row['x']] = $row['health'];
	}
}




$result = mysqli_query($db, "SELECT mv_name, x, y, `save`, `kill`, hp, xp, message, avatar_head, avatar_body from xiv_merveilles WHERE floor = '".$playerf."' AND mv_time < 10");


$arrayPlayers = array();

while($row = mysqli_fetch_assoc($result))
{
	if(strtolower($row['mv_name']) == strtolower($playern)) continue;
	
	if(isset($reqAction) && $reqAction == 'heal' && $playermp > 0 && $row['mv_name'] == $reqX && $row['hp'] < 16 && ($row['hp'] > 0 || $playerlv > 29))
	{
		$lvl = floor(pow($row['xp'],1/3));
		
		$healPerMp = 1 + floor($playerlv / 15);
		
		$mp = ceil((30 - $row['hp']) / $healPerMp);
		if($mp > $playermp) $mp = $playermp;
		
		$heal = $healPerMp * $mp;
		if($heal > 30) $heal = 30;
		
		$xp = floor($heal * $lvl / 30);
		
		$information = array(
			'type' => 9,
			'playerLevel' => $lvl,
			'heal' => $heal
		);
		
		$row['hp']+= $heal;
		if($row['hp'] > 30) $row['hp'] = 30;
		
		mysqli_query($db, "UPDATE xiv_merveilles SET hp='".$row['hp']."' WHERE mv_name='".mysqli_real_escape_string($db, $row['mv_name'])."'");
		
		$playerxp+= $xp;
		$playermp-= $mp;
		$playersv++;
	}
	
	$arrayPlayers[] = array(
		'name' => $row['mv_name'],
		'x' => $row['x'] + 0,
		'y' => $row['y'] + 0,
		'hp' => $row['hp'] + 0,
		'message' => $row['message'],
		'build' => getPlayerBuild($row['kill'], $row['save']),
		'avatarHead' => $row['avatar_head'] + 0,
		'avatarBody' => $row['avatar_body'] + 0
	);
}

if(isset($reqAction) && $reqAction == 'attack')
{
	if((abs($playerx - $reqX) + abs($playery - $reqY)) == 1) //ne permet pas d'attaquer à plus d'une tile
	{
		if(isset($map[$reqY]) && isset($map[$reqY][$reqX]) && $map[$reqY][$reqX] == TILE_MONSTER)
		{
			//initializing
			$monster_max_health = floor($playerf+((($reqX+$reqY)/$square))*($playerf+1));
			$monster_attack = floor($playerf/2);
			$monster_level = floor(($monster_attack + $monster_max_health)/5);
			$percentHealth = (isset($monsters[$reqY]) && isset($monsters[$reqY][$reqX]) ? (int) $monsters[$reqY][$reqX] : 100);
			$monster_health = floor($monster_max_health * $percentHealth / 100);
			//$logs[] = array($monster_max_health, $percentHealth, $monster_health);
			
			//rationalizing
			$monster_bonus = $monster_level-$playerlv;
			if($monster_bonus<1) $monster_bonus=1;
			
			if($playerf < 5){$monsterLowBonus = 5-$playerf;}
			else{$monsterLowBonus = 0;}
			
			$monster_experi = floor($monsterLowBonus+($monster_attack*0.8)+1+$playerf-($playerlv/2));
			
			if($monster_experi<0){$monster_experi=1;}
			$monster_experi_bonus = $monster_experi * $monster_bonus;
			
			$monster_attack = ($monster_attack) - floor($playerlv/2);
			if($monster_attack < 1) $monster_attack=1;
			
			$player_attack = floor($playerlv*1.8)-floor($playerf/3);

			//processing
			$monster_damage = 0;
			$player_damage = 0;
			
			$battleresult=1;
			$percentTaken = 0;
			
			while($monster_health > 0 && $playerhp > 0 && $percentTaken < 33)
			{
				$monster_health-= $player_attack;
				$monster_damage+= $player_attack;
				
				$percentTaken = round($monster_damage / $monster_max_health * 100);
				
				$playerhp-= $monster_attack;
				$player_damage+= $monster_attack;
				
				if($playerhp < 1)
				{
					$playerhp = 0;
					$battleresult = 2;
				}
				
				if($monster_health < 1)
				{
					$monster_health = 0;
				}
			}
			
			$percentHealth = round($monster_health / $monster_max_health * 100);
			
			if($percentHealth == 0)
			{
				$playerxp+= $monster_experi;
				$playerkp++;
				
				$map[$reqY][$reqX] = TILE_DEAD_MONSTER; //maj directe de la carte
			}
			else
			{
				if(!isset($monsters[$reqY])) $monsters[$reqY] = array();
				$monsters[$reqY][$reqX] = (string) $percentHealth; //maj directe de la carte
			}
			mysqli_query($db, "DELETE FROM xiv_merveilles_monsters WHERE `floor` = '".$playerf."' AND x = '".$reqX."' AND y = '".$reqY."'");
			mysqli_query($db, "INSERT INTO xiv_merveilles_monsters (x, y, health, `time`, `floor`) VALUES (".$reqX.",".$reqY.",".$percentHealth.", 10,".$playerf.");");
			
			$information = array(
				'type' => $battleresult,
				'monster' => array(
					'level' => $monster_level,
					'damage' => $monster_damage,
					'relativeX' => $reqX - $playerx,
					'relativeY' => $reqY - $playery
				),
				'self' => array(
					'damage' => $player_damage
				)
			);
		}
	}
}

$background = 'backgrounds/'.$playerf.'-'.$players.'.gif';
if(!file_exists('./img/'.$background)) $background = 'world.gif';

mysqli_query($db,"UPDATE xiv_merveilles SET x = ".$playerx.", y = ".$playery.", xp = ".$playerxp.", hp = ".$playerhp.", mp = ".$playermp.", `kill` = ".$playerkp.", `save` = ".$playersv.", `floor` = ".$playerf.", max_floor = ".$playermf.", message = '".mysqli_real_escape_string($db,$playermsg)."', message_timestamp = ".$playermsgts.", mv_time = 0 WHERE mv_name= '".$playern."'");

$data = array(
	'status' => array(
		'x' => $playerx + 0,
		'y' => $playery + 0,
		'floor' => $playerf + 0,
		'maxFloor' => $playermf + 0,
		'section' => $players + 0,
		'hp' => $playerhp + 0,
		'mp' => $playermp + 0,
		'xp' => $playerxp + 0,
		'percentXp' => $playerxx,
		'level' => $playerlv,
		'build' => $playerBuild,
		'message' => $playermsg,
		'avatarBody' => $playerBody + 0,
		'avatarHead' => $playerHead + 0
	),
	'background' => $background,
	'map' => $map,
	'players' => $arrayPlayers,
	'monsters' => $monsters,
	'logs' => $logs
);

if(isset($information)) $data['information'] = $information;

if(isset($reqAction))
{
	echo json_encode($data); exit;
}

// Define Client Size

//if($clientSize =='clientDefault'){
	$classClient ='clientDefault';
//}
//else{
//	$classClient ='clientPortable';
//}
?>
