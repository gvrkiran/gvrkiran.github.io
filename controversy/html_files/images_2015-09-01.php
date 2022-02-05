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
        defaultDate: new Date(2015,8,01),
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
<h3> Trending hashtags from 2015-09-01</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-01/aregradojogo.png" alt="#aregradojogo" />
<figcaption><a href="https://twitter.com/search?q=%23aregradojogo%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#aregradojogo</a><br><a></a>Score: 0.053</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-01/backtohogwarts.png" alt="#backtohogwarts" />
<figcaption><a href="https://twitter.com/search?q=%23backtohogwarts%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#backtohogwarts</a><br><a date1="2015-09-01" hashtag="backtohogwarts" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.235</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-01/corinthians105anos.png" alt="#corinthians105anos" />
<figcaption><a href="https://twitter.com/search?q=%23corinthians105anos%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#corinthians105anos</a><br><a></a>Score: 0.019</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-01/deadlineday.png" alt="#deadlineday" />
<figcaption><a href="https://twitter.com/search?q=%23deadlineday%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#deadlineday</a><br><a date1="2015-09-01" hashtag="deadlineday" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.112</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-01/dodgers.png" alt="#dodgers" />
<figcaption><a href="https://twitter.com/search?q=%23dodgers%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#dodgers</a><br><a></a>Score: 0.008</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-01/hittheroad.png" alt="#hittheroad" />
<figcaption><a href="https://twitter.com/search?q=%23hittheroad%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#hittheroad</a><br><a></a>Score: 0.010</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-01/iknowwhatyoudidonitunes.png" alt="#iknowwhatyoudidonitunes" />
<figcaption><a href="https://twitter.com/search?q=%23iknowwhatyoudidonitunes%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#iknowwhatyoudidonitunes</a><br><a></a>Score: 0.007</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-01/imcoming.png" alt="#imcoming" />
<figcaption><a href="https://twitter.com/search?q=%23imcoming%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#imcoming</a><br><a></a>Score: 0.116</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-01/jackuwhereareunow.png" alt="#jackuwhereareunow" />
<figcaption><a href="https://twitter.com/search?q=%23jackuwhereareunow%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#jackuwhereareunow</a><br><a></a>Score: 0.049</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-01/mtvscream.png" alt="#mtvscream" />
<figcaption><a href="https://twitter.com/search?q=%23mtvscream%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#mtvscream</a><br><a></a>Score: 0.030</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-01/otrabrazil.png" alt="#otrabrazil" />
<figcaption><a href="https://twitter.com/search?q=%23otrabrazil%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#otrabrazil</a><br><a></a>Score: 0.000</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-01/otraphilly.png" alt="#otraphilly" />
<figcaption><a href="https://twitter.com/search?q=%23otraphilly%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#otraphilly</a><br><a date1="2015-09-01" hashtag="otraphilly" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.180</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-01/parivartanrally.png" alt="#parivartanrally" />
<figcaption><a href="https://twitter.com/search?q=%23parivartanrally%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#parivartanrally</a><br><a></a>Score: 0.141</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-01/premium1.png" alt="#premium1" />
<figcaption><a href="https://twitter.com/search?q=%23premium1%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#premium1</a><br><a></a>Score: 0.064</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-01/projectjaspar.png" alt="#projectjaspar" />
<figcaption><a href="https://twitter.com/search?q=%23projectjaspar%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#projectjaspar</a><br><a></a>Score: -0.01</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-01/rowysojonesbeach.png" alt="#rowysojonesbeach" />
<figcaption><a href="https://twitter.com/search?q=%23rowysojonesbeach%20since%3A2015-08-31%20until%3A2015-09-01" target="_blank">#rowysojonesbeach</a><br><a></a>Score: 0.114</figcaption>
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