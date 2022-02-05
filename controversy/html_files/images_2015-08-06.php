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
        defaultDate: new Date(2015,7,06),
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
<h3> Trending hashtags from 2015-08-06</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-06/aaronsnewvideo.png" alt="#aaronsnewvideo" />
<figcaption><a href="https://twitter.com/search?q=%23aaronsnewvideo%20since%3A2015-08-05%20until%3A2015-08-06" target="_blank">#aaronsnewvideo</a><br><a></a>Score: -0.00</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-06/ashes2015.png" alt="#ashes2015" />
<figcaption><a href="https://twitter.com/search?q=%23ashes2015%20since%3A2015-08-05%20until%3A2015-08-06" target="_blank">#ashes2015</a><br><a></a>Score: 0.201</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-06/compton.png" alt="#compton" />
<figcaption><a href="https://twitter.com/search?q=%23compton%20since%3A2015-08-05%20until%3A2015-08-06" target="_blank">#compton</a><br><a date1="2015-08-06" hashtag="compton" id="some_other_id5" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-06/debatequestionswewanttohear.png" alt="#debatequestionswewanttohear" />
<figcaption><a href="https://twitter.com/search?q=%23debatequestionswewanttohear%20since%3A2015-08-05%20until%3A2015-08-06" target="_blank">#debatequestionswewanttohear</a><br><a date1="2015-08-06" hashtag="debatequestionswewanttohear" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.160</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-06/gls15.png" alt="#gls15" />
<figcaption><a href="https://twitter.com/search?q=%23gls15%20since%3A2015-08-05%20until%3A2015-08-06" target="_blank">#gls15</a><br><a date1="2015-08-06" hashtag="gls15" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.029</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-06/gopdebate.png" alt="#gopdebate" />
<figcaption><a href="https://twitter.com/search?q=%23gopdebate%20since%3A2015-08-05%20until%3A2015-08-06" target="_blank">#gopdebate</a><br><a date1="2015-08-06" hashtag="gopdebate" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.212</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-06/hiroshima.png" alt="#hiroshima" />
<figcaption><a href="https://twitter.com/search?q=%23hiroshima%20since%3A2015-08-05%20until%3A2015-08-06" target="_blank">#hiroshima</a><br><a date1="2015-08-06" hashtag="hiroshima" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.104</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-06/imnotreallyselfishbut.png" alt="#imnotreallyselfishbut" />
<figcaption><a href="https://twitter.com/search?q=%23imnotreallyselfishbut%20since%3A2015-08-05%20until%3A2015-08-06" target="_blank">#imnotreallyselfishbut</a><br><a date1="2015-08-06" hashtag="imnotreallyselfishbut" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.098</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-06/jonvoyage.png" alt="#jonvoyage" />
<figcaption><a href="https://twitter.com/search?q=%23jonvoyage%20since%3A2015-08-05%20until%3A2015-08-06" target="_blank">#jonvoyage</a><br><a date1="2015-08-06" hashtag="jonvoyage" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.124</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-06/vra50.png" alt="#vra50" />
<figcaption><a href="https://twitter.com/search?q=%23vra50%20since%3A2015-08-05%20until%3A2015-08-06" target="_blank">#vra50</a><br><a date1="2015-08-06" hashtag="vra50" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.193</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-06/welcomebacktotexas1d.png" alt="#welcomebacktotexas1d" />
<figcaption><a href="https://twitter.com/search?q=%23welcomebacktotexas1d%20since%3A2015-08-05%20until%3A2015-08-06" target="_blank">#welcomebacktotexas1d</a><br><a date1="2015-08-06" hashtag="welcomebacktotexas1d" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.028</figcaption>
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