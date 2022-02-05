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
        defaultDate: new Date(2015,7,31),
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
<h3> Trending hashtags from 2015-08-31</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-31/aldubtherevelation.png" alt="#aldubtherevelation" />
<figcaption><a href="https://twitter.com/search?q=%23aldubtherevelation%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#aldubtherevelation</a><br><a date1="2015-08-31" hashtag="aldubtherevelation" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-31/ashtonisworthit.png" alt="#ashtonisworthit" />
<figcaption><a href="https://twitter.com/search?q=%23ashtonisworthit%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#ashtonisworthit</a><br><a date1="2015-08-31" hashtag="ashtonisworthit" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.060</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-31/congrats5sos.png" alt="#congrats5sos" />
<figcaption><a href="https://twitter.com/search?q=%23congrats5sos%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#congrats5sos</a><br><a></a>Score: 0.054</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-31/deadlineday.png" alt="#deadlineday" />
<figcaption><a href="https://twitter.com/search?q=%23deadlineday%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#deadlineday</a><br><a date1="2015-08-31" hashtag="deadlineday" id="some_id7" href="">Example Tweets</a><br>Score: 0.312</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-31/degea.png" alt="#degea" />
<figcaption><a href="https://twitter.com/search?q=%23degea%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#degea</a><br><a></a>Score: -0.01</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-31/demiyouareenough.png" alt="#demiyouareenough" />
<figcaption><a href="https://twitter.com/search?q=%23demiyouareenough%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#demiyouareenough</a><br><a></a>Score: 0.042</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-31/freemyhomiecalum.png" alt="#freemyhomiecalum" />
<figcaption><a href="https://twitter.com/search?q=%23freemyhomiecalum%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#freemyhomiecalum</a><br><a></a>Score: 0.050</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-31/happyjungkookday.png" alt="#happyjungkookday" />
<figcaption><a href="https://twitter.com/search?q=%23happyjungkookday%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#happyjungkookday</a><br><a></a>Score: 0.140</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-31/jackuwhereareunow.png" alt="#jackuwhereareunow" />
<figcaption><a href="https://twitter.com/search?q=%23jackuwhereareunow%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#jackuwhereareunow</a><br><a></a>Score: 0.095</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-31/psypatibong.png" alt="#psypatibong" />
<figcaption><a href="https://twitter.com/search?q=%23psypatibong%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#psypatibong</a><br><a></a>Score: 0.065</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-31/turc.png" alt="#turc" />
<figcaption><a href="https://twitter.com/search?q=%23turc%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#turc</a><br><a></a>Score: 0.066</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-31/usopen.png" alt="#usopen" />
<figcaption><a href="https://twitter.com/search?q=%23usopen%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#usopen</a><br><a></a>Score: 0.173</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-08-31/videoveranomtv.png" alt="#videoveranomtv" />
<figcaption><a href="https://twitter.com/search?q=%23videoveranomtv%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#videoveranomtv</a><br><a date1="2015-08-31" hashtag="videoveranomtv" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-08-31/whatdoyoumeanonvevo.png" alt="#whatdoyoumeanonvevo" />
<figcaption><a href="https://twitter.com/search?q=%23whatdoyoumeanonvevo%20since%3A2015-08-30%20until%3A2015-08-31" target="_blank">#whatdoyoumeanonvevo</a><br><a date1="2015-08-31" hashtag="whatdoyoumeanonvevo" id="some_other_id27" href="">Similar hashtags</a><br>Score: 0.117</figcaption>
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