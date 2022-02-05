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
        defaultDate: new Date(2015,7,13),
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
<h3> Trending hashtags from 2015-08-13</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-13/5htoperformatthevmas.png" alt="#5htoperformatthevmas" />
<figcaption><a href="https://twitter.com/search?q=%235htoperformatthevmas%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#5htoperformatthevmas</a><br><a date1="2015-08-13" hashtag="5htoperformatthevmas" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.016</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-13/demisoononbrasil.png" alt="#demisoononbrasil" />
<figcaption><a href="https://twitter.com/search?q=%23demisoononbrasil%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#demisoononbrasil</a><br><a date1="2015-08-13" hashtag="demisoononbrasil" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.061</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-13/directionersfuneral.png" alt="#directionersfuneral" />
<figcaption><a href="https://twitter.com/search?q=%23directionersfuneral%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#directionersfuneral</a><br><a date1="2015-08-13" hashtag="directionersfuneral" id="some_id5" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-13/dolangirlsarebeautiful.png" alt="#dolangirlsarebeautiful" />
<figcaption><a href="https://twitter.com/search?q=%23dolangirlsarebeautiful%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#dolangirlsarebeautiful</a><br><a date1="2015-08-13" hashtag="dolangirlsarebeautiful" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.032</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-13/flyaway.png" alt="#flyaway" />
<figcaption><a href="https://twitter.com/search?q=%23flyaway%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#flyaway</a><br><a date1="2015-08-13" hashtag="flyaway" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.057</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-13/flyawaywithsmallzy.png" alt="#flyawaywithsmallzy" />
<figcaption><a href="https://twitter.com/search?q=%23flyawaywithsmallzy%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#flyawaywithsmallzy</a><br><a date1="2015-08-13" hashtag="flyawaywithsmallzy" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.170</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-13/lefthandersday.png" alt="#lefthandersday" />
<figcaption><a href="https://twitter.com/search?q=%23lefthandersday%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#lefthandersday</a><br><a date1="2015-08-13" hashtag="lefthandersday" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.279</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-13/nomeaguantolasganas.png" alt="#nomeaguantolasganas" />
<figcaption><a href="https://twitter.com/search?q=%23nomeaguantolasganas%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#nomeaguantolasganas</a><br><a date1="2015-08-13" hashtag="nomeaguantolasganas" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.089</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-13/pappusoduffer.png" alt="#pappusoduffer" />
<figcaption><a href="https://twitter.com/search?q=%23pappusoduffer%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#pappusoduffer</a><br><a date1="2015-08-13" hashtag="pappusoduffer" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.019</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-13/psytulay.png" alt="#psytulay" />
<figcaption><a href="https://twitter.com/search?q=%23psytulay%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#psytulay</a><br><a date1="2015-08-13" hashtag="psytulay" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.005</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-13/sialostorosentve.png" alt="#sialostorosentve" />
<figcaption><a href="https://twitter.com/search?q=%23sialostorosentve%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#sialostorosentve</a><br><a date1="2015-08-13" hashtag="sialostorosentve" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.098</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-13/soundsgoodfeelsgood.png" alt="#soundsgoodfeelsgood" />
<figcaption><a href="https://twitter.com/search?q=%23soundsgoodfeelsgood%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#soundsgoodfeelsgood</a><br><a date1="2015-08-13" hashtag="soundsgoodfeelsgood" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.095</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-08-13/thenextgalaxy.png" alt="#thenextgalaxy" />
<figcaption><a href="https://twitter.com/search?q=%23thenextgalaxy%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#thenextgalaxy</a><br><a date1="2015-08-13" hashtag="thenextgalaxy" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.190</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-08-13/uniadvice.png" alt="#uniadvice" />
<figcaption><a href="https://twitter.com/search?q=%23uniadvice%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#uniadvice</a><br><a date1="2015-08-13" hashtag="uniadvice" id="some_other_id27" href="">Similar hashtags</a><br>Score: 0.078</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-08-13/verybritishproblems.png" alt="#verybritishproblems" />
<figcaption><a href="https://twitter.com/search?q=%23verybritishproblems%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#verybritishproblems</a><br><a date1="2015-08-13" hashtag="verybritishproblems" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.038</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-08-13/watchshawnaccesslive.png" alt="#watchshawnaccesslive" />
<figcaption><a href="https://twitter.com/search?q=%23watchshawnaccesslive%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#watchshawnaccesslive</a><br><a date1="2015-08-13" hashtag="watchshawnaccesslive" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.155</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-08-13/welove1dandkpop.png" alt="#welove1dandkpop" />
<figcaption><a href="https://twitter.com/search?q=%23welove1dandkpop%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#welove1dandkpop</a><br><a date1="2015-08-13" hashtag="welove1dandkpop" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.225</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-08-13/yomodisoscared.png" alt="#yomodisoscared" />
<figcaption><a href="https://twitter.com/search?q=%23yomodisoscared%20since%3A2015-08-12%20until%3A2015-08-13" target="_blank">#yomodisoscared</a><br><a date1="2015-08-13" hashtag="yomodisoscared" id="some_other_id35" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
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