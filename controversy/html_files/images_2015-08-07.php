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
        defaultDate: new Date(2015,7,07),
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
<h3> Trending hashtags from 2015-08-07</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-07/camerondallasphotoshoot.png" alt="#camerondallasphotoshoot" />
<figcaption><a href="https://twitter.com/search?q=%23camerondallasphotoshoot%20since%3A2015-08-06%20until%3A2015-08-07" target="_blank">#camerondallasphotoshoot</a><br><a></a>Score: 0.113</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-07/ifhumansactedlikedogs.png" alt="#ifhumansactedlikedogs" />
<figcaption><a href="https://twitter.com/search?q=%23ifhumansactedlikedogs%20since%3A2015-08-06%20until%3A2015-08-07" target="_blank">#ifhumansactedlikedogs</a><br><a></a>Score: -0.00</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-07/internationalbeerday.png" alt="#internationalbeerday" />
<figcaption><a href="https://twitter.com/search?q=%23internationalbeerday%20since%3A2015-08-06%20until%3A2015-08-07" target="_blank">#internationalbeerday</a><br><a date1="2015-08-07" hashtag="internationalbeerday" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.204</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-07/jonvoyage.png" alt="#jonvoyage" />
<figcaption><a href="https://twitter.com/search?q=%23jonvoyage%20since%3A2015-08-06%20until%3A2015-08-07" target="_blank">#jonvoyage</a><br><a></a>Score: 0.166</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-07/straightoutta.png" alt="#straightoutta" />
<figcaption><a href="https://twitter.com/search?q=%23straightoutta%20since%3A2015-08-06%20until%3A2015-08-07" target="_blank">#straightoutta</a><br><a date1="2015-08-07" hashtag="straightoutta" id="some_id9" href="">Example Tweets</a><br>Score: 0.404</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-07/theworstpartofdepressionis.png" alt="#theworstpartofdepressionis" />
<figcaption><a href="https://twitter.com/search?q=%23theworstpartofdepressionis%20since%3A2015-08-06%20until%3A2015-08-07" target="_blank">#theworstpartofdepressionis</a><br><a date1="2015-08-07" hashtag="theworstpartofdepressionis" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.045</figcaption>
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