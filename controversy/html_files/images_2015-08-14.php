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
        defaultDate: new Date(2015,7,14),
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
<h3> Trending hashtags from 2015-08-14</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-14/5hmonster.png" alt="#5hmonster" />
<figcaption><a href="https://twitter.com/search?q=%235hmonster%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#5hmonster</a><br><a></a>Score: 0.079</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-14/5sos.png" alt="#5sos" />
<figcaption><a href="https://twitter.com/search?q=%235sos%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#5sos</a><br><a></a>Score: 0.100</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-14/aaronsnewvideo.png" alt="#aaronsnewvideo" />
<figcaption><a href="https://twitter.com/search?q=%23aaronsnewvideo%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#aaronsnewvideo</a><br><a date1="2015-08-14" hashtag="aaronsnewvideo" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.009</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-14/aldubforyouiwill.png" alt="#aldubforyouiwill" />
<figcaption><a href="https://twitter.com/search?q=%23aldubforyouiwill%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#aldubforyouiwill</a><br><a></a>Score: -0.00</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-14/avfc.png" alt="#avfc" />
<figcaption><a href="https://twitter.com/search?q=%23avfc%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#avfc</a><br><a></a>Score: 0.107</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-14/avlmun.png" alt="#avlmun" />
<figcaption><a href="https://twitter.com/search?q=%23avlmun%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#avlmun</a><br><a></a>Score: 0.079</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-14/cancelwendywilliamsshow.png" alt="#cancelwendywilliamsshow" />
<figcaption><a href="https://twitter.com/search?q=%23cancelwendywilliamsshow%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#cancelwendywilliamsshow</a><br><a date1="2015-08-14" hashtag="cancelwendywilliamsshow" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.088</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-14/cuba.png" alt="#cuba" />
<figcaption><a href="https://twitter.com/search?q=%23cuba%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#cuba</a><br><a></a>Score: 0.154</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-14/d23expo.png" alt="#d23expo" />
<figcaption><a href="https://twitter.com/search?q=%23d23expo%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#d23expo</a><br><a></a>Score: 0.149</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-14/desafiodorangel1.png" alt="#desafiodorangel1" />
<figcaption><a href="https://twitter.com/search?q=%23desafiodorangel1%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#desafiodorangel1</a><br><a></a>Score: -0.01</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-14/fcbhsv.png" alt="#fcbhsv" />
<figcaption><a href="https://twitter.com/search?q=%23fcbhsv%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#fcbhsv</a><br><a date1="2015-08-14" hashtag="fcbhsv" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.142</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-14/fernandezdiaz.png" alt="#fernandezdiaz" />
<figcaption><a href="https://twitter.com/search?q=%23fernandezdiaz%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#fernandezdiaz</a><br><a></a>Score: 0.100</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-08-14/gitme.png" alt="#gitme" />
<figcaption><a href="https://twitter.com/search?q=%23gitme%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#gitme</a><br><a></a>Score: -0.00</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-08-14/iminlovewithamonsteronitunes.png" alt="#iminlovewithamonsteronitunes" />
<figcaption><a href="https://twitter.com/search?q=%23iminlovewithamonsteronitunes%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#iminlovewithamonsteronitunes</a><br><a></a>Score: 0.088</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-08-14/orop.png" alt="#orop" />
<figcaption><a href="https://twitter.com/search?q=%23orop%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#orop</a><br><a></a>Score: 0.063</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-08-14/psypanliligaw.png" alt="#psypanliligaw" />
<figcaption><a href="https://twitter.com/search?q=%23psypanliligaw%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#psypanliligaw</a><br><a date1="2015-08-14" hashtag="psypanliligaw" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-08-14/soundsgoodfeelsgood.png" alt="#soundsgoodfeelsgood" />
<figcaption><a href="https://twitter.com/search?q=%23soundsgoodfeelsgood%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#soundsgoodfeelsgood</a><br><a></a>Score: 0.163</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-08-14/teenagedirtbagonthesetlist.png" alt="#teenagedirtbagonthesetlist" />
<figcaption><a href="https://twitter.com/search?q=%23teenagedirtbagonthesetlist%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#teenagedirtbagonthesetlist</a><br><a></a>Score: 0.088</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-08-14/teog.png" alt="#teog" />
<figcaption><a href="https://twitter.com/search?q=%23teog%20since%3A2015-08-13%20until%3A2015-08-14" target="_blank">#teog</a><br><a></a>Score: 0.058</figcaption>
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