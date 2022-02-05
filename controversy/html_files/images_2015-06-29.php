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
        defaultDate: new Date(2015,5,29),
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
<h3> Trending hashtags from 2015-06-29</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-06-29/askeljames.png" alt="#askeljames" />
<figcaption><a href="https://twitter.com/search?q=%23askeljames%20since%3A2015-06-28%20until%3A2015-06-29" target="_blank">#askeljames</a><br><a date1="2015-06-29" hashtag="askeljames" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.120</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-06-29/dirtyworkjuly10.png" alt="#dirtyworkjuly10" />
<figcaption><a href="https://twitter.com/search?q=%23dirtyworkjuly10%20since%3A2015-06-28%20until%3A2015-06-29" target="_blank">#dirtyworkjuly10</a><br><a date1="2015-06-29" hashtag="dirtyworkjuly10" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.102</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-06-29/mondaymotivation.png" alt="#mondaymotivation" />
<figcaption><a href="https://twitter.com/search?q=%23mondaymotivation%20since%3A2015-06-28%20until%3A2015-06-29" target="_blank">#mondaymotivation</a><br><a date1="2015-06-29" hashtag="mondaymotivation" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.263</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-06-29/nashsnewvideo.png" alt="#nashsnewvideo" />
<figcaption><a href="https://twitter.com/search?q=%23nashsnewvideo%20since%3A2015-06-28%20until%3A2015-06-29" target="_blank">#nashsnewvideo</a><br><a date1="2015-06-29" hashtag="nashsnewvideo" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.019</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-06-29/rowysoperth.png" alt="#rowysoperth" />
<figcaption><a href="https://twitter.com/search?q=%23rowysoperth%20since%3A2015-06-28%20until%3A2015-06-29" target="_blank">#rowysoperth</a><br><a date1="2015-06-29" hashtag="rowysoperth" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.034</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-06-29/signsyoureintheusa.png" alt="#signsyoureintheusa" />
<figcaption><a href="https://twitter.com/search?q=%23signsyoureintheusa%20since%3A2015-06-28%20until%3A2015-06-29" target="_blank">#signsyoureintheusa</a><br><a date1="2015-06-29" hashtag="signsyoureintheusa" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.082</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-06-29/teenwolfseason5.png" alt="#teenwolfseason5" />
<figcaption><a href="https://twitter.com/search?q=%23teenwolfseason5%20since%3A2015-06-28%20until%3A2015-06-29" target="_blank">#teenwolfseason5</a><br><a date1="2015-06-29" hashtag="teenwolfseason5" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.052</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-06-29/whereareunowmusicvideo.png" alt="#whereareunowmusicvideo" />
<figcaption><a href="https://twitter.com/search?q=%23whereareunowmusicvideo%20since%3A2015-06-28%20until%3A2015-06-29" target="_blank">#whereareunowmusicvideo</a><br><a date1="2015-06-29" hashtag="whereareunowmusicvideo" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.020</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-06-29/whereareunowmusicvideotoday.png" alt="#whereareunowmusicvideotoday" />
<figcaption><a href="https://twitter.com/search?q=%23whereareunowmusicvideotoday%20since%3A2015-06-28%20until%3A2015-06-29" target="_blank">#whereareunowmusicvideotoday</a><br><a date1="2015-06-29" hashtag="whereareunowmusicvideotoday" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.121</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-06-29/whoisburningblackchurches.png" alt="#whoisburningblackchurches" />
<figcaption><a href="https://twitter.com/search?q=%23whoisburningblackchurches%20since%3A2015-06-28%20until%3A2015-06-29" target="_blank">#whoisburningblackchurches</a><br><a date1="2015-06-29" hashtag="whoisburningblackchurches" id="some_id19" href="">Example Tweets</a><br>Score: 0.332</figcaption>
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