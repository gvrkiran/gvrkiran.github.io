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
        defaultDate: new Date(2015,6,21),
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
<h3> Trending hashtags from 2015-07-21</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-07-21/explainearthtospacealiens.png" alt="#explainearthtospacealiens" />
<figcaption><a href="https://twitter.com/search?q=%23explainearthtospacealiens%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#explainearthtospacealiens</a><br><a date1="2015-07-21" hashtag="explainearthtospacealiens" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.057</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-07-21/growingupagirl.png" alt="#growingupagirl" />
<figcaption><a href="https://twitter.com/search?q=%23growingupagirl%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#growingupagirl</a><br><a date1="2015-07-21" hashtag="growingupagirl" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.065</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-07-21/harryappreciationday.png" alt="#harryappreciationday" />
<figcaption><a href="https://twitter.com/search?q=%23harryappreciationday%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#harryappreciationday</a><br><a date1="2015-07-21" hashtag="harryappreciationday" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.079</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-07-21/iheart5sos.png" alt="#iheart5sos" />
<figcaption><a href="https://twitter.com/search?q=%23iheart5sos%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#iheart5sos</a><br><a date1="2015-07-21" hashtag="iheart5sos" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.037</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-07-21/myfavoritecashmoment.png" alt="#myfavoritecashmoment" />
<figcaption><a href="https://twitter.com/search?q=%23myfavoritecashmoment%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#myfavoritecashmoment</a><br><a date1="2015-07-21" hashtag="myfavoritecashmoment" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.023</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-07-21/nationaljunkfoodday.png" alt="#nationaljunkfoodday" />
<figcaption><a href="https://twitter.com/search?q=%23nationaljunkfoodday%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#nationaljunkfoodday</a><br><a date1="2015-07-21" hashtag="nationaljunkfoodday" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.268</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-07-21/niallappreciationday.png" alt="#niallappreciationday" />
<figcaption><a href="https://twitter.com/search?q=%23niallappreciationday%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#niallappreciationday</a><br><a date1="2015-07-21" hashtag="niallappreciationday" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.220</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-07-21/otraedmonton.png" alt="#otraedmonton" />
<figcaption><a href="https://twitter.com/search?q=%23otraedmonton%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#otraedmonton</a><br><a date1="2015-07-21" hashtag="otraedmonton" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.250</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-07-21/playersawardsbet.png" alt="#playersawardsbet" />
<figcaption><a href="https://twitter.com/search?q=%23playersawardsbet%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#playersawardsbet</a><br><a date1="2015-07-21" hashtag="playersawardsbet" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.193</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-07-21/rowysoirvine.png" alt="#rowysoirvine" />
<figcaption><a href="https://twitter.com/search?q=%23rowysoirvine%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#rowysoirvine</a><br><a date1="2015-07-21" hashtag="rowysoirvine" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.071</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-07-21/thelieswetellkids.png" alt="#thelieswetellkids" />
<figcaption><a href="https://twitter.com/search?q=%23thelieswetellkids%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#thelieswetellkids</a><br><a date1="2015-07-21" hashtag="thelieswetellkids" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.070</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-07-21/vmas.png" alt="#vmas" />
<figcaption><a href="https://twitter.com/search?q=%23vmas%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#vmas</a><br><a date1="2015-07-21" hashtag="vmas" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.109</figcaption>
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