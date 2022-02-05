<?php

$url = explode('/',$_SERVER['REQUEST_URI']);
$url = end($url);

$date1 = str_replace('.php','',end(explode('_',$url)));
if($url=='images.php')
	$date = '2015-06-25';
else
	$date = $date1;
#$date = isset($_GET['date']) ? $_GET['date'] : '2015-06-25';
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
<title>Quantifying Controversy in Social Media</title>
<link rel='stylesheet' type='text/css' href='css/style.css' />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script>
$(document).ready(function(){

  $("[id^=some_id]").click(function(e){
    e.preventDefault();
//    alert( $(this).attr("id") );
    $.get("get_example_tweets.php", {date1:$(this).attr("date1"),hashtag:$(this).attr("hashtag")}, function(data){
        $("#exampletweets").html(data);
    });
  });

});
</script>

</head>
<body>
<br>
<h1>Quantifying Controversy in Social Media</h1>
<hr/><h3>&nbsp;&nbsp;&nbsp;&nbsp; <a href='about.html' target='_blank'>About</a> &nbsp;&nbsp;&nbsp;<a href='examples.html' target='_blank'>Examples</a></h3><hr>
<div id="container" style="width:100%;">

  <div id="left" style="float:left;width:180px;">
  <?php
        if($prev_date!="" and $date=="2015-06-25")
                echo "<a href=\"html_files/images_$prev_date.php\" style=\"font-size:30px;font-style:bold\">Previous Day</a>";
	if($prev_date!="" and $date!="2015-06-25")
                echo "<a href=\"images_$prev_date.php\" style=\"font-size:30px;font-style:bold\">Previous Day</a>";
  ?>
  </div>
    <div id="right" style="float:right;width:180px;">
  <?php
        if($next_date!="" and $date=="2015-06-25")
                echo "<a href=\"html_files/images_$next_date.php\" style=\"font-size:30px;font-style:bold\">Next Day</a>";
	if($next_date!="" and $date!="2015-06-25")
                echo "<a href=\"images_$next_date.php\" style=\"font-size:30px;font-style:bold\">Next Day</a>";
  ?>
    </div>
<div id="page-wrap">
<h3> Trending hashtags from 2015-06-25</h3>
<section class="image-gallery group">
<figure tabindex="251">
<img src="../plots/2015-06-25/6yearswithoutmichaeljackson.png" alt="#6yearswithoutmichaeljackson" />
<figcaption><a date1="2015-06-25" hashtag="6yearswithoutmichaeljackson" id="some_id1" href="">#6yearswithoutmichaeljackson</a><br>Score: 0.160</figcaption>
</figure>
<figure tabindex="252">
<img src="../plots/2015-06-25/askbeckyg.png" alt="#askbeckyg" />
<figcaption><a date1="2015-06-25" hashtag="askbeckyg" id="some_id2" href="">#askbeckyg</a><br>Score: 0.022</figcaption>
</figure>
<figure tabindex="253">
<img src="../plots/2015-06-25/coolforthesummer.png" alt="#coolforthesummer" />
<figcaption><a href="https://twitter.com/search?q=%23coolforthesummer%20since%3A2015-06-24%20until%3A2015-06-25" target="_blank">#coolforthesummer</a><br>Score: 0.170</figcaption>
</figure>
<figure tabindex="254">
<img src="../plots/2015-06-25/nbadraft.png" alt="#nbadraft" />
<figcaption><a href="https://twitter.com/search?q=%23nbadraft%20since%3A2015-06-24%20until%3A2015-06-25" target="_blank">#nbadraft</a><br>Score: 0.288</figcaption>
</figure>
<figure tabindex="255">
<img src="../plots/2015-06-25/scotus.png" alt="#scotus" />
<figcaption><a href="https://twitter.com/search?q=%23scotus%20since%3A2015-06-24%20until%3A2015-06-25" target="_blank">#scotus</a><br>Score: 0.083</figcaption>
</figure>
<figure tabindex="256">
<img src="../plots/2015-06-25/wearereadyforlarry.png" alt="#wearereadyforlarry" />
<figcaption><a href="https://twitter.com/search?q=%23wearereadyforlarry%20since%3A2015-06-24%20until%3A2015-06-25" target="_blank">#wearereadyforlarry</a><br>Score: 0.108</figcaption>
</figure>
</section>
</div>

<hr>
<p id='exampletweets'>
</p>
<hr>
<p>Built using a template from https://css-tricks.com/expanding-images-html5/</p>
</body>
</html>
