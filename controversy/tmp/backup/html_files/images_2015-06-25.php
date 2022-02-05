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
<h3> Trending hashtags from 2015-06-25</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../../plots/2015-06-25/6yearswithoutmichaeljackson.png" alt="#6yearswithoutmichaeljackson" />
<figcaption><a href="https://twitter.com/search?q=%236yearswithoutmichaeljackson%20since%3A2015-06-24%20until%3A2015-06-25" target="_blank">#6yearswithoutmichaeljackson</a><br><a date1="2015-06-25" hashtag="6yearswithoutmichaeljackson" id="some_id1" href="">Example Tweets</a><br>Score: 0.160</figcaption>
</figure>
<figure tabindex="2">
<img src="../../plots/2015-06-25/askbeckyg.png" alt="#askbeckyg" />
<figcaption><a href="https://twitter.com/search?q=%23askbeckyg%20since%3A2015-06-24%20until%3A2015-06-25" target="_blank">#askbeckyg</a><br><a date1="2015-06-25" hashtag="askbeckyg" id="some_id3" href="">Example Tweets</a><br>Score: 0.022</figcaption>
</figure>
<figure tabindex="4">
<img src="../../plots/2015-06-25/coolforthesummer.png" alt="#coolforthesummer" />
<figcaption><a href="https://twitter.com/search?q=%23coolforthesummer%20since%3A2015-06-24%20until%3A2015-06-25" target="_blank">#coolforthesummer</a><br><a date1="2015-06-25" hashtag="coolforthesummer" id="some_id5" href="">Example Tweets</a><br>Score: 0.170</figcaption>
</figure>
<figure tabindex="6">
<img src="../../plots/2015-06-25/nbadraft.png" alt="#nbadraft" />
<figcaption><a href="https://twitter.com/search?q=%23nbadraft%20since%3A2015-06-24%20until%3A2015-06-25" target="_blank">#nbadraft</a><br><a date1="2015-06-25" hashtag="nbadraft" id="some_id7" href="">Example Tweets</a><br>Score: 0.288</figcaption>
</figure>
<figure tabindex="8">
<img src="../../plots/2015-06-25/scotus.png" alt="#scotus" />
<figcaption><a href="https://twitter.com/search?q=%23scotus%20since%3A2015-06-24%20until%3A2015-06-25" target="_blank">#scotus</a><br><a date1="2015-06-25" hashtag="scotus" id="some_id9" href="">Example Tweets</a><br>Score: 0.083</figcaption>
</figure>
<figure tabindex="10">
<img src="../../plots/2015-06-25/wearereadyforlarry.png" alt="#wearereadyforlarry" />
<figcaption><a href="https://twitter.com/search?q=%23wearereadyforlarry%20since%3A2015-06-24%20until%3A2015-06-25" target="_blank">#wearereadyforlarry</a><br><a date1="2015-06-25" hashtag="wearereadyforlarry" id="some_id11" href="">Example Tweets</a><br>Score: 0.108</figcaption>
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