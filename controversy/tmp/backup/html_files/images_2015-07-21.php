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
//    alert( $(this).attr("id") );
    $.get("https://users.ics.aalto.fi/kiran/controversy/tmp/get_example_tweets.php", {date1:$(this).attr("date1"),hashtag:$(this).attr("hashtag")}, function(data){
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
        defaultDate: new Date(2015, 5, 25),
        minDate: new Date(2015, 5, 25),
        maxDate: new Date(2015, 8, 19)
  });
    $( "#datepicker" ).datepicker( "option", "dateFormat", "yy-mm-dd" );
  });
  </script>
</head>
<body><br>
<h1>Exploring Controversy on Twitter</h1><hr/>
<h3>&nbsp;&nbsp;&nbsp;&nbsp; <a href='https://users.ics.aalto.fi/kiran/controversy/tmp/about.php'>About</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/tmp/examples.php'>Examples</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/tmp/html_files/images_2015-06-25.php'>Trending hashtags</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/tmp/table.php'>Table</a></h3><hr>
<div id="container" style="width:100%;">

  <div id="left" style="float:left;width:180px;">
  <?php
//        if($prev_date!="" and $=="2015-06-25")
//                echo "<a href=\"html_files/images_$prev_date.php\" style=\"font-size:30px;font-style:bold\">Previous Day</a>";
//	elseif($prev_date!="" and $date=="2015-06-26")
  //              echo "<a href=\"images.php\" style=\"font-size:30px;font-style:bold\">Previous Day</a>";
	if($prev_date!="")// and $date!="2015-06-25")
                echo "<a href=\"images_$prev_date.php\" style=\"font-size:30px;font-style:bold\">Previous Day</a>";
  ?>
  </div>
  <div id="left2" style="float:left;width:320px;margin: 20px 0px 0px 30px;">
  <p>Date: <input type="text" id="datepicker" value="Click to select a date" onchange="var date1 = document.getElementById('datepicker').value; console.log(date1); location.href = 'images_' + date1 + '.php';"/>
  </div>
    <div id="right" style="float:right;width:180px;">
  <?php
//        if($next_date!="" and $date=="2015-06-25")
//                echo "<a href=\"html_files/images_$next_date.php\" style=\"font-size:30px;font-style:bold\">Next Day</a>";
	if($next_date!="")// and $date!="2015-06-25")
                echo "<a href=\"images_$next_date.php\" style=\"font-size:30px;font-style:bold\">Next Day</a>";
  ?>
    </div>
<div id="page-wrap">
<h3> Trending hashtags from 2015-07-21</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../../plots/2015-07-21/explainearthtospacealiens.png" alt="#explainearthtospacealiens" />
<figcaption><a href="https://twitter.com/search?q=%23explainearthtospacealiens%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#explainearthtospacealiens</a><br><a date1="2015-07-21" hashtag="explainearthtospacealiens" id="some_id1" href="">Example Tweets</a><br>Score: 0.057</figcaption>
</figure>
<figure tabindex="2">
<img src="../../plots/2015-07-21/harryappreciationday.png" alt="#harryappreciationday" />
<figcaption><a href="https://twitter.com/search?q=%23harryappreciationday%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#harryappreciationday</a><br><a date1="2015-07-21" hashtag="harryappreciationday" id="some_id3" href="">Example Tweets</a><br>Score: 0.079</figcaption>
</figure>
<figure tabindex="4">
<img src="../../plots/2015-07-21/iheart5sos.png" alt="#iheart5sos" />
<figcaption><a href="https://twitter.com/search?q=%23iheart5sos%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#iheart5sos</a><br><a date1="2015-07-21" hashtag="iheart5sos" id="some_id5" href="">Example Tweets</a><br>Score: 0.037</figcaption>
</figure>
<figure tabindex="6">
<img src="../../plots/2015-07-21/myfavoritecashmoment.png" alt="#myfavoritecashmoment" />
<figcaption><a href="https://twitter.com/search?q=%23myfavoritecashmoment%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#myfavoritecashmoment</a><br><a date1="2015-07-21" hashtag="myfavoritecashmoment" id="some_id7" href="">Example Tweets</a><br>Score: 0.023</figcaption>
</figure>
<figure tabindex="8">
<img src="../../plots/2015-07-21/nationaljunkfoodday.png" alt="#nationaljunkfoodday" />
<figcaption><a href="https://twitter.com/search?q=%23nationaljunkfoodday%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#nationaljunkfoodday</a><br><a date1="2015-07-21" hashtag="nationaljunkfoodday" id="some_id9" href="">Example Tweets</a><br>Score: 0.268</figcaption>
</figure>
<figure tabindex="10">
<img src="../../plots/2015-07-21/otraedmonton.png" alt="#otraedmonton" />
<figcaption><a href="https://twitter.com/search?q=%23otraedmonton%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#otraedmonton</a><br><a date1="2015-07-21" hashtag="otraedmonton" id="some_id11" href="">Example Tweets</a><br>Score: 0.250</figcaption>
</figure>
<figure tabindex="12">
<img src="../../plots/2015-07-21/playersawardsbet.png" alt="#playersawardsbet" />
<figcaption><a href="https://twitter.com/search?q=%23playersawardsbet%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#playersawardsbet</a><br><a date1="2015-07-21" hashtag="playersawardsbet" id="some_id13" href="">Example Tweets</a><br>Score: 0.193</figcaption>
</figure>
<figure tabindex="14">
<img src="../../plots/2015-07-21/rowysoirvine.png" alt="#rowysoirvine" />
<figcaption><a href="https://twitter.com/search?q=%23rowysoirvine%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#rowysoirvine</a><br><a date1="2015-07-21" hashtag="rowysoirvine" id="some_id15" href="">Example Tweets</a><br>Score: 0.071</figcaption>
</figure>
<figure tabindex="16">
<img src="../../plots/2015-07-21/thelieswetellkids.png" alt="#thelieswetellkids" />
<figcaption><a href="https://twitter.com/search?q=%23thelieswetellkids%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#thelieswetellkids</a><br><a date1="2015-07-21" hashtag="thelieswetellkids" id="some_id17" href="">Example Tweets</a><br>Score: 0.070</figcaption>
</figure>
<figure tabindex="18">
<img src="../../plots/2015-07-21/vmas.png" alt="#vmas" />
<figcaption><a href="https://twitter.com/search?q=%23vmas%20since%3A2015-07-20%20until%3A2015-07-21" target="_blank">#vmas</a><br><a date1="2015-07-21" hashtag="vmas" id="some_id19" href="">Example Tweets</a><br>Score: 0.109</figcaption>
</figure>
</section>
<h3>Browse trending hashtags using the Previous/Next Day links on the left/right or by using the Calendar.</h3></div>
<hr>
<p id='exampletweets'>
</p>
<hr>
<p>Built using a template from https://css-tricks.com/expanding-images-html5/</p>
</body>
</html>