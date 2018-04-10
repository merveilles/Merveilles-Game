<script type="text/javascript">
	var playing = true;
	function play_music() {
		
		if(playing==false){
			document.getElementById('music').play();
			playing = true;
		}
		else{
			document.getElementById('music').pause();
			playing = false;
		}
		
	}
</script>



<?

function musicPlayer($location){
	
	
	global $playerf;
	
	
	
	
	
	
	
	if($location=='login'){
		print "
		<audio id='music' src='audio/merveilles_06.mp3' autoplay='autoplay' loop='loop' preload='auto'>
		</audio>
		
		<div class='audioControls'>
			<a href='javascript:play_music();' id='audio_toggle'></a>
		</div>
		";
	}
	
	elseif($location=='game'){
		
		
		if($playerf < 3)		{$track = '01';}
		elseif($playerf < 4)	{$track = '02';}
		elseif($playerf < 9)	{$track = '03';}
		elseif($playerf < 14)	{$track = '04';}
		elseif($playerf < 24)	{$track = '05';}
		else					{$track = '06';}
		
		
		
		
		
		print "
		<audio id='music' src='audio/merveilles_".$track.".mp3' autoplay='autoplay' loop='loop' preload='auto'>
		</audio>
		
		<div class='audioControls'>
			<a href='javascript:play_music();' id='audio_toggle'></a>
		</div>
		";
	}
	
}

?>


