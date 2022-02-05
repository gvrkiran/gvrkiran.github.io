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
        defaultDate: new Date(2015,6,30),
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
<h3> Trending hashtags from 2015-07-30</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-07-30/aaronsnewvideo.png" alt="#aaronsnewvideo" />
<figcaption><a href="https://twitter.com/search?q=%23aaronsnewvideo%20since%3A2015-07-29%20until%3A2015-07-30" target="_blank">#aaronsnewvideo</a><br><a date1="2015-07-30" hashtag="aaronsnewvideo" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.014</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-07-30/abdc.png" alt="#abdc" />
<figcaption><a href="https://twitter.com/search?q=%23abdc%20since%3A2015-07-29%20until%3A2015-07-30" target="_blank">#abdc</a><br><a date1="2015-07-30" hashtag="abdc" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.138</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-07-30/anotherboy.png" alt="#anotherboy" />
<figcaption><a href="https://twitter.com/search?q=%23anotherboy%20since%3A2015-07-29%20until%3A2015-07-30" target="_blank">#anotherboy</a><br><a date1="2015-07-30" hashtag="anotherboy" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.044</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-07-30/askmadison.png" alt="#askmadison" />
<figcaption><a href="https://twitter.com/search?q=%23askmadison%20since%3A2015-07-29%20until%3A2015-07-30" target="_blank">#askmadison</a><br><a date1="2015-07-30" hashtag="askmadison" id="some_other_id7" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-07-30/choiceyoutuber.png" alt="#choiceyoutuber" />
<figcaption><a href="https://twitter.com/search?q=%23choiceyoutuber%20since%3A2015-07-29%20until%3A2015-07-30" target="_blank">#choiceyoutuber</a><br><a date1="2015-07-30" hashtag="choiceyoutuber" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.055</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-07-30/congratsmamawhitesides.png" alt="#congratsmamawhitesides" />
<figcaption><a href="https://twitter.com/search?q=%23congratsmamawhitesides%20since%3A2015-07-29%20until%3A2015-07-30" target="_blank">#congratsmamawhitesides</a><br><a date1="2015-07-30" hashtag="congratsmamawhitesides" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.033</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-07-30/friendshipday.png" alt="#friendshipday" />
<figcaption><a href="https://twitter.com/search?q=%23friendshipday%20since%3A2015-07-29%20until%3A2015-07-30" target="_blank">#friendshipday</a><br><a date1="2015-07-30" hashtag="friendshipday" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.223</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-07-30/nashsnewvideo.png" alt="#nashsnewvideo" />
<figcaption><a href="https://twitter.com/search?q=%23nashsnewvideo%20since%3A2015-07-29%20until%3A2015-07-30" target="_blank">#nashsnewvideo</a><br><a date1="2015-07-30" hashtag="nashsnewvideo" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.014</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-07-30/nationalcheesecakeday.png" alt="#nationalcheesecakeday" />
<figcaption><a href="https://twitter.com/search?q=%23nationalcheesecakeday%20since%3A2015-07-29%20until%3A2015-07-30" target="_blank">#nationalcheesecakeday</a><br><a date1="2015-07-30" hashtag="nationalcheesecakeday" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.200</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-07-30/newharrypotterbooks.png" alt="#newharrypotterbooks" />
<figcaption><a href="https://twitter.com/search?q=%23newharrypotterbooks%20since%3A2015-07-29%20until%3A2015-07-30" target="_blank">#newharrypotterbooks</a><br><a date1="2015-07-30" hashtag="newharrypotterbooks" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.206</figcaption>
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