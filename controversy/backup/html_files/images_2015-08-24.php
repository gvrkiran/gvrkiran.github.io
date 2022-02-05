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
        defaultDate: new Date(2015,7,24),
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
<h3> Trending hashtags from 2015-08-24</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-24/afcvlfc.png" alt="#afcvlfc" />
<figcaption><a href="https://twitter.com/search?q=%23afcvlfc%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#afcvlfc</a><br><a date1="2015-08-24" hashtag="afcvlfc" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.025</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-24/arsenal.png" alt="#arsenal" />
<figcaption><a href="https://twitter.com/search?q=%23arsenal%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#arsenal</a><br><a date1="2015-08-24" hashtag="arsenal" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.226</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-24/arsliv.png" alt="#arsliv" />
<figcaption><a href="https://twitter.com/search?q=%23arsliv%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#arsliv</a><br><a date1="2015-08-24" hashtag="arsliv" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.162</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-24/badlands.png" alt="#badlands" />
<figcaption><a href="https://twitter.com/search?q=%23badlands%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#badlands</a><br><a date1="2015-08-24" hashtag="badlands" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.012</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-24/bieberonelvis.png" alt="#bieberonelvis" />
<figcaption><a href="https://twitter.com/search?q=%23bieberonelvis%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#bieberonelvis</a><br><a date1="2015-08-24" hashtag="bieberonelvis" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.207</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-24/blackmonday.png" alt="#blackmonday" />
<figcaption><a href="https://twitter.com/search?q=%23blackmonday%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#blackmonday</a><br><a date1="2015-08-24" hashtag="blackmonday" id="some_id11" href="">Example Tweets</a><br>Score: 0.396</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-24/certifiedlive.png" alt="#certifiedlive" />
<figcaption><a href="https://twitter.com/search?q=%23certifiedlive%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#certifiedlive</a><br><a date1="2015-08-24" hashtag="certifiedlive" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.055</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-24/fearthewalkingdead.png" alt="#fearthewalkingdead" />
<figcaption><a href="https://twitter.com/search?q=%23fearthewalkingdead%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#fearthewalkingdead</a><br><a date1="2015-08-24" hashtag="fearthewalkingdead" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.069</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-24/gururumuzsuntsk.png" alt="#gururumuzsuntsk" />
<figcaption><a href="https://twitter.com/search?q=%23gururumuzsuntsk%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#gururumuzsuntsk</a><br><a date1="2015-08-24" hashtag="gururumuzsuntsk" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.251</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-24/happybirthdayrupertgrint.png" alt="#happybirthdayrupertgrint" />
<figcaption><a href="https://twitter.com/search?q=%23happybirthdayrupertgrint%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#happybirthdayrupertgrint</a><br><a date1="2015-08-24" hashtag="happybirthdayrupertgrint" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.262</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-24/heidenau.png" alt="#heidenau" />
<figcaption><a href="https://twitter.com/search?q=%23heidenau%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#heidenau</a><br><a date1="2015-08-24" hashtag="heidenau" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.085</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-24/hopa.png" alt="#hopa" />
<figcaption><a href="https://twitter.com/search?q=%23hopa%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#hopa</a><br><a date1="2015-08-24" hashtag="hopa" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.104</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-08-24/merkelschweigt.png" alt="#merkelschweigt" />
<figcaption><a href="https://twitter.com/search?q=%23merkelschweigt%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#merkelschweigt</a><br><a date1="2015-08-24" hashtag="merkelschweigt" id="some_id25" href="">Example Tweets</a><br>Score: 0.310</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-08-24/ohnothesun.png" alt="#ohnothesun" />
<figcaption><a href="https://twitter.com/search?q=%23ohnothesun%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#ohnothesun</a><br><a date1="2015-08-24" hashtag="ohnothesun" id="some_other_id27" href="">Similar hashtags</a><br>Score: 0.178</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-08-24/otrachicago.png" alt="#otrachicago" />
<figcaption><a href="https://twitter.com/search?q=%23otrachicago%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#otrachicago</a><br><a date1="2015-08-24" hashtag="otrachicago" id="some_id29" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-08-24/psyunanghalik.png" alt="#psyunanghalik" />
<figcaption><a href="https://twitter.com/search?q=%23psyunanghalik%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#psyunanghalik</a><br><a date1="2015-08-24" hashtag="psyunanghalik" id="some_id31" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-08-24/summerslam.png" alt="#summerslam" />
<figcaption><a href="https://twitter.com/search?q=%23summerslam%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#summerslam</a><br><a date1="2015-08-24" hashtag="summerslam" id="some_id33" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-08-24/teenwolf.png" alt="#teenwolf" />
<figcaption><a href="https://twitter.com/search?q=%23teenwolf%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#teenwolf</a><br><a date1="2015-08-24" hashtag="teenwolf" id="some_other_id35" href="">Similar hashtags</a><br>Score: 0.013</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-08-24/thankyouniall.png" alt="#thankyouniall" />
<figcaption><a href="https://twitter.com/search?q=%23thankyouniall%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#thankyouniall</a><br><a date1="2015-08-24" hashtag="thankyouniall" id="some_other_id37" href="">Similar hashtags</a><br>Score: 0.035</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-08-24/ufcsaskatoon.png" alt="#ufcsaskatoon" />
<figcaption><a href="https://twitter.com/search?q=%23ufcsaskatoon%20since%3A2015-08-23%20until%3A2015-08-24" target="_blank">#ufcsaskatoon</a><br><a date1="2015-08-24" hashtag="ufcsaskatoon" id="some_other_id39" href="">Similar hashtags</a><br>Score: 0.168</figcaption>
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