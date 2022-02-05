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
        defaultDate: new Date(2015,7,20),
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
<h3> Trending hashtags from 2015-08-20</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-20/bjpsweepsrajasthan.png" alt="#bjpsweepsrajasthan" />
<figcaption><a href="https://twitter.com/search?q=%23bjpsweepsrajasthan%20since%3A2015-08-19%20until%3A2015-08-20" target="_blank">#bjpsweepsrajasthan</a><br><a date1="2015-08-20" hashtag="bjpsweepsrajasthan" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.037</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-20/brasildademocracia.png" alt="#brasildademocracia" />
<figcaption><a href="https://twitter.com/search?q=%23brasildademocracia%20since%3A2015-08-19%20until%3A2015-08-20" target="_blank">#brasildademocracia</a><br><a date1="2015-08-20" hashtag="brasildademocracia" id="some_other_id3" href="">Similar hashtags</a><br>Score: -0.02</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-20/cadenanacional.png" alt="#cadenanacional" />
<figcaption><a href="https://twitter.com/search?q=%23cadenanacional%20since%3A2015-08-19%20until%3A2015-08-20" target="_blank">#cadenanacional</a><br><a date1="2015-08-20" hashtag="cadenanacional" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.069</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-20/catfish.png" alt="#catfish" />
<figcaption><a href="https://twitter.com/search?q=%23catfish%20since%3A2015-08-19%20until%3A2015-08-20" target="_blank">#catfish</a><br><a date1="2015-08-20" hashtag="catfish" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.152</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-20/dismaland.png" alt="#dismaland" />
<figcaption><a href="https://twitter.com/search?q=%23dismaland%20since%3A2015-08-19%20until%3A2015-08-20" target="_blank">#dismaland</a><br><a date1="2015-08-20" hashtag="dismaland" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.080</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-20/getshawntoyourcountry.png" alt="#getshawntoyourcountry" />
<figcaption><a href="https://twitter.com/search?q=%23getshawntoyourcountry%20since%3A2015-08-19%20until%3A2015-08-20" target="_blank">#getshawntoyourcountry</a><br><a date1="2015-08-20" hashtag="getshawntoyourcountry" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.138</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-20/happybirthdaydemi.png" alt="#happybirthdaydemi" />
<figcaption><a href="https://twitter.com/search?q=%23happybirthdaydemi%20since%3A2015-08-19%20until%3A2015-08-20" target="_blank">#happybirthdaydemi</a><br><a date1="2015-08-20" hashtag="happybirthdaydemi" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.056</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-20/labourpurge.png" alt="#labourpurge" />
<figcaption><a href="https://twitter.com/search?q=%23labourpurge%20since%3A2015-08-19%20until%3A2015-08-20" target="_blank">#labourpurge</a><br><a date1="2015-08-20" hashtag="labourpurge" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.001</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-20/levels.png" alt="#levels" />
<figcaption><a href="https://twitter.com/search?q=%23levels%20since%3A2015-08-19%20until%3A2015-08-20" target="_blank">#levels</a><br><a date1="2015-08-20" hashtag="levels" id="some_other_id17" href="">Similar hashtags</a><br>Score: -0.02</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-20/msg2teaser.png" alt="#msg2teaser" />
<figcaption><a href="https://twitter.com/search?q=%23msg2teaser%20since%3A2015-08-19%20until%3A2015-08-20" target="_blank">#msg2teaser</a><br><a date1="2015-08-20" hashtag="msg2teaser" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.053</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-20/oddbvb.png" alt="#oddbvb" />
<figcaption><a href="https://twitter.com/search?q=%23oddbvb%20since%3A2015-08-19%20until%3A2015-08-20" target="_blank">#oddbvb</a><br><a date1="2015-08-20" hashtag="oddbvb" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.012</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-20/otratoronto.png" alt="#otratoronto" />
<figcaption><a href="https://twitter.com/search?q=%23otratoronto%20since%3A2015-08-19%20until%3A2015-08-20" target="_blank">#otratoronto</a><br><a date1="2015-08-20" hashtag="otratoronto" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.239</figcaption>
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