<?php
	$url = explode('/',$_SERVER['REQUEST_URI']);
	$url = end($url);

	$date1 = str_replace('.php','',end(explode('_',$url)));
	if($url=='images.php')
	        $date = '2015-06-25';
	else
	        $date = $date1;
	if($date=='2015-06-25')
		$prev_date = '';
	else
		$prev_date = date('Y-m-d', strtotime($date .' -1 day'));
	if($date=='2015-08-21')
		$next_date = '';
	else
		$next_date = date('Y-m-d', strtotime($date .' +1 day'));
?>
<!DOCTYPE html>
<head>
<meta charset='UTF-8' />
<title>Exploring Controversy in Twitter</title>
<link rel='stylesheet' type='text/css' href='../css/style.css' />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<link rel="stylesheet" href="//code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
  <script src="//code.jquery.com/jquery-1.10.2.js"></script>
    <script src="//code.jquery.com/ui/1.11.4/jquery-ui.js"></script>
<script>
$(document).ready(function(){

  $("[id^=some_id]").click(function(e){
    e.preventDefault();
    $.get("https://users.ics.aalto.fi/kiran/controversy/get_example_tweets.php", {date1:$(this).attr("date1"),hashtag:$(this).attr("hashtag")}, function(data){
        $("#exampletweets").html(data);
    });
  });

});

$(document).ready(function(){

  $("[id^=some_other_id]").click(function(e){
    e.preventDefault();
    $.get("https://users.ics.aalto.fi/kiran/controversy/get_similar_hashtags.php", {date1:$(this).attr("date1"),hashtag:$(this).attr("hashtag")}, function(data){
    	console.log(data);
        $("#exampletweets").html(data);
    });

	$('html, body').animate({
		scrollTop: $("#exampletweets").offset().top
	}, 1000);

  });

});

</script>
  <script>
  $(function() {
    $( "#datepicker" ).datepicker({
        showOn: "button",
        buttonImage: "../calendar.gif",
        buttonImageOnly: true,
        buttonText: "Select date",
        defaultDate: new Date(2015,8,14),
        minDate: new Date(2015, 5, 25),
        maxDate: new Date(2015, 8, 19)
  });
    $( "#datepicker" ).datepicker( "option", "dateFormat", "yy-mm-dd" );
  });
  </script>
</head>
<body><br>
<h1>&nbsp;&nbsp; Exploring Controversy on Twitter</h1><hr/>
<h3>&nbsp;&nbsp;&nbsp;&nbsp; <a href='https://users.ics.aalto.fi/kiran/controversy/about.php'>About</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/index.php'>Examples</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-06-25.php'>Trending hashtags</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/table.php'>Tabular View</a></h3><hr>
<div id="container" style="width:100%;">

  <div id="left" style="float:left;width:180px;margin:0 0 0 20px">
  <?php
	if($prev_date!="")// and $date!="2015-06-25")
                echo "<a href=\"images_$prev_date.php\" style=\"font-size:30px;font-style:bold\">Previous Day</a>";
  ?>
  </div>
  <div id="left2" style="float:left;width:220px;margin: 10px 0px 0px 20px;">
  <p>Date: <input type="text" id="datepicker" value="Click to select a date" onchange="var date1 = document.getElementById('datepicker').value; console.log(date1); location.href = 'images_' + date1 + '.php';"/>
  </div>
    <div id="right" style="float:right;width:180px;">
  <?php
	if($next_date!="")// and $date!="2015-06-25")
                echo "<a href=\"images_$next_date.php\" style=\"font-size:30px;font-style:bold\">Next Day</a>";
  ?>
    </div>
<div id="page-wrap">
<h3> Trending hashtags from 2015-09-14</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-14/3daystomsg2.png" alt="#3daystomsg2" />
<figcaption><a href="https://twitter.com/search?q=%233daystomsg2%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#3daystomsg2</a><br><a></a>Score: 0.083</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-14/aldubworthfightingfor.png" alt="#aldubworthfightingfor" />
<figcaption><a href="https://twitter.com/search?q=%23aldubworthfightingfor%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#aldubworthfightingfor</a><br><a date1="2015-09-14" hashtag="aldubworthfightingfor" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-14/allforlove4days.png" alt="#allforlove4days" />
<figcaption><a href="https://twitter.com/search?q=%23allforlove4days%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#allforlove4days</a><br><a date1="2015-09-14" hashtag="allforlove4days" id="some_other_id5" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-14/eagles.png" alt="#eagles" />
<figcaption><a href="https://twitter.com/search?q=%23eagles%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#eagles</a><br><a></a>Score: 0.020</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-14/ikonismytype.png" alt="#ikonismytype" />
<figcaption><a href="https://twitter.com/search?q=%23ikonismytype%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#ikonismytype</a><br><a></a>Score: 0.288</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-14/knjfantakeovervid.png" alt="#knjfantakeovervid" />
<figcaption><a href="https://twitter.com/search?q=%23knjfantakeovervid%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#knjfantakeovervid</a><br><a></a>Score: -0.02</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-14/lavozkids2.png" alt="#lavozkids2" />
<figcaption><a href="https://twitter.com/search?q=%23lavozkids2%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#lavozkids2</a><br><a></a>Score: 0.137</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-14/leelinforpm.png" alt="#leelinforpm" />
<figcaption><a href="https://twitter.com/search?q=%23leelinforpm%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#leelinforpm</a><br><a></a>Score: -0.00</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-14/libspill.png" alt="#libspill" />
<figcaption><a href="https://twitter.com/search?q=%23libspill%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#libspill</a><br><a date1="2015-09-14" hashtag="libspill" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.088</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-14/luhanreloaded.png" alt="#luhanreloaded" />
<figcaption><a href="https://twitter.com/search?q=%23luhanreloaded%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#luhanreloaded</a><br><a></a>Score: 0.032</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-14/missamerica.png" alt="#missamerica" />
<figcaption><a href="https://twitter.com/search?q=%23missamerica%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#missamerica</a><br><a></a>Score: 0.211</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-14/msgrocksibn7.png" alt="#msgrocksibn7" />
<figcaption><a href="https://twitter.com/search?q=%23msgrocksibn7%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#msgrocksibn7</a><br><a></a>Score: -0.05</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-14/nokta.png" alt="#nokta" />
<figcaption><a href="https://twitter.com/search?q=%23nokta%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#nokta</a><br><a></a>Score: 0.220</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-14/pechinoexpress.png" alt="#pechinoexpress" />
<figcaption><a href="https://twitter.com/search?q=%23pechinoexpress%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#pechinoexpress</a><br><a></a>Score: 0.082</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-14/phivsatl.png" alt="#phivsatl" />
<figcaption><a href="https://twitter.com/search?q=%23phivsatl%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#phivsatl</a><br><a></a>Score: 0.158</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-14/qanda.png" alt="#qanda" />
<figcaption><a href="https://twitter.com/search?q=%23qanda%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#qanda</a><br><a></a>Score: 0.198</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-09-14/rowysocelebration.png" alt="#rowysocelebration" />
<figcaption><a href="https://twitter.com/search?q=%23rowysocelebration%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#rowysocelebration</a><br><a></a>Score: 0.061</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-09-14/sheskindahotlive.png" alt="#sheskindahotlive" />
<figcaption><a href="https://twitter.com/search?q=%23sheskindahotlive%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#sheskindahotlive</a><br><a></a>Score: 0.097</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-09-14/tiff15.png" alt="#tiff15" />
<figcaption><a href="https://twitter.com/search?q=%23tiff15%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#tiff15</a><br><a></a>Score: 0.106</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-09-14/tubill.png" alt="#tubill" />
<figcaption><a href="https://twitter.com/search?q=%23tubill%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#tubill</a><br><a></a>Score: 0.028</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-09-14/wewillmeetagain1d.png" alt="#wewillmeetagain1d" />
<figcaption><a href="https://twitter.com/search?q=%23wewillmeetagain1d%20since%3A2015-09-13%20until%3A2015-09-14" target="_blank">#wewillmeetagain1d</a><br><a date1="2015-09-14" hashtag="wewillmeetagain1d" id="some_other_id41" href="">Similar hashtags</a><br>Score: 0.058</figcaption>
</figure>
</section>
<h3>Browse trending hashtags using the Previous/Next Day links on the left/right or by using the Calendar.</h3></div>
<hr>
<p id='exampletweets'>
</p>
<!--hr-->
<!--p>Built using a template from https://css-tricks.com/expanding-images-html5/</p-->
</body>
</html>