<?
$spell_unknown="
<div class='spell' id='cast2'>
	<p class='spellname_unknown'>unknown</p>
	<p>0mp</p>
</div>";


if($_GET['cast']){
	
	if($_GET['cast']=='3'&&$playermp>9){
		$UPDATESQL = mysqli_query($db, "UPDATE xiv_merveilles SET floor=4, x=29, y=29, mp=mp-10 WHERE mv_name='".$playern."'");
		echo "<meta http-equiv='refresh' content='0;url=/portable.php'>";
	}
	
	if($_GET['cast']=='1'&&$warp1>0){
		$UPDATESQL = mysqli_query($db, "UPDATE xiv_merveilles SET floor=10, x=21, y=12, mp=mp-5 WHERE mv_name='".$playern."' and x=21 and y=12 OR mv_name='".$playern."' and x=3 and y=45");
		echo "<meta http-equiv='refresh' content='0;url=/portable.php'>";
	}
		
}

?>

<div id='spellbook'>
	
	<? if($warp1>0){ ?>
	<div class='spell' id='cast1'>
		<a><div></div></a>
		<p class='spellname'>blue warp</p>
		<p>5mp</p>
	</div>
	<? } ?>
	<? if($offline){ ?>
	<div class='spell' id='cast2'>
		<p class='spellname'>unknown</p>
		<p>0mp</p>
	</div>
	<? } ?>
	<? if($offline){ ?>
	<div class='spell' id='cast3'>
		<p class='spellname'>unknown</p>
		<p>0mp</p>
	</div>
	<? } ?>
	<? if($offline){ ?>
	<div class='spell' id='cast4'>
		<p class='spellname'>unknown</p>
		<p>0mp</p>
	</div>
	<? } ?>
	
	<? if($offline){ ?>
	<div class='spell' id='cast5'>
		<p class='spellname'>unknown</p>
		<p>0mp</p>
	</div>
	<? if($offline){ ?>
	<? } ?>
	<div class='spell' id='cast6'>
		<p class='spellname'>unknown</p>
		<p>0mp</p>
	</div>
	<? if($offline){ ?>
	<? } ?>
	<div class='spell' id='cast7'>
		<p class='spellname'>unknown</p>
		<p>0mp</p>
	</div>
	<? if($offline){ ?>
	<? } ?>
	<div class='spell' id='cast8'>
		<p class='spellname'>unknown</p>
		<p>0mp</p>
	</div>
	<? } ?>
	
	<? if($playerlv>2){	?>
	<div class='spell' id='cast9'>
		<a><div></div></a>
		<p class='spellname'>Junction</p>
		<p>Lvl 3</p>
	</div>
	<? } ?>
	
	<? if($playerlv>12&&$offline){ ?>
	<div class='spell' id='cast10'>
		<p class='spellname'>Lumines</p>
		<p>Lvl 13</p>
	</div>
	<? } ?>
	
	<? if($playerlv>22&&$offline){ ?>
	<div class='spell' id='cast11'>
		<p class='spellname'>Karmilla</p>
		<p>Lvl 23</p>
	</div>
	<? } ?>
	
	<? if($playerlv>32&&$offline){ ?>
	<div class='spell' id='cast12'>
		<p class='spellname'>Harriot</p>
		<p>Lvl 33</p>
	</div>
	<? } ?>
	
</div>
