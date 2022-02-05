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
        defaultDate: new Date(2015,8,07),
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
<h3> Trending hashtags from 2015-09-07</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-07/bigliesyoutellyourself.png" alt="#bigliesyoutellyourself" />
<figcaption><a href="https://twitter.com/search?q=%23bigliesyoutellyourself%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#bigliesyoutellyourself</a><br><a date1="2015-09-07" hashtag="bigliesyoutellyourself" id="some_id1" href="">Example Tweets</a><br>Score: 0.340</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-07/camilacabelloisourfairy.png" alt="#camilacabelloisourfairy" />
<figcaption><a href="https://twitter.com/search?q=%23camilacabelloisourfairy%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#camilacabelloisourfairy</a><br><a date1="2015-09-07" hashtag="camilacabelloisourfairy" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.039</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-07/confpr.png" alt="#confpr" />
<figcaption><a href="https://twitter.com/search?q=%23confpr%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#confpr</a><br><a date1="2015-09-07" hashtag="confpr" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.133</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-07/dragmedownpower.png" alt="#dragmedownpower" />
<figcaption><a href="https://twitter.com/search?q=%23dragmedownpower%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#dragmedownpower</a><br><a date1="2015-09-07" hashtag="dragmedownpower" id="some_id7" href="">Example Tweets</a><br>Score: 0.402</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-07/fm16.png" alt="#fm16" />
<figcaption><a href="https://twitter.com/search?q=%23fm16%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#fm16</a><br><a date1="2015-09-07" hashtag="fm16" id="some_other_id9" href="">Similar hashtags</a><br>Score: -0.02</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-07/fraser.png" alt="#fraser" />
<figcaption><a href="https://twitter.com/search?q=%23fraser%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#fraser</a><br><a date1="2015-09-07" hashtag="fraser" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.199</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-07/getweirdalbumtracklist.png" alt="#getweirdalbumtracklist" />
<figcaption><a href="https://twitter.com/search?q=%23getweirdalbumtracklist%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#getweirdalbumtracklist</a><br><a date1="2015-09-07" hashtag="getweirdalbumtracklist" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.093</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-07/laborday.png" alt="#laborday" />
<figcaption><a href="https://twitter.com/search?q=%23laborday%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#laborday</a><br><a date1="2015-09-07" hashtag="laborday" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.204</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-07/larriesatack.png" alt="#larriesatack" />
<figcaption><a href="https://twitter.com/search?q=%23larriesatack%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#larriesatack</a><br><a date1="2015-09-07" hashtag="larriesatack" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.036</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-07/lavozkids1.png" alt="#lavozkids1" />
<figcaption><a href="https://twitter.com/search?q=%23lavozkids1%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#lavozkids1</a><br><a date1="2015-09-07" hashtag="lavozkids1" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.134</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-07/motavatormonday.png" alt="#motavatormonday" />
<figcaption><a href="https://twitter.com/search?q=%23motavatormonday%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#motavatormonday</a><br><a date1="2015-09-07" hashtag="motavatormonday" id="some_other_id21" href="">Similar hashtags</a><br>Score: -0.01</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-07/msg2songs.png" alt="#msg2songs" />
<figcaption><a href="https://twitter.com/search?q=%23msg2songs%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#msg2songs</a><br><a date1="2015-09-07" hashtag="msg2songs" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.000</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-07/msg2trailerintelugu.png" alt="#msg2trailerintelugu" />
<figcaption><a href="https://twitter.com/search?q=%23msg2trailerintelugu%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#msg2trailerintelugu</a><br><a date1="2015-09-07" hashtag="msg2trailerintelugu" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.100</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-07/otramontreal.png" alt="#otramontreal" />
<figcaption><a href="https://twitter.com/search?q=%23otramontreal%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#otramontreal</a><br><a date1="2015-09-07" hashtag="otramontreal" id="some_other_id27" href="">Similar hashtags</a><br>Score: 0.115</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-07/pechinoexpress.png" alt="#pechinoexpress" />
<figcaption><a href="https://twitter.com/search?q=%23pechinoexpress%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#pechinoexpress</a><br><a date1="2015-09-07" hashtag="pechinoexpress" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.048</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-07/peegate.png" alt="#peegate" />
<figcaption><a href="https://twitter.com/search?q=%23peegate%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#peegate</a><br><a date1="2015-09-07" hashtag="peegate" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.027</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-09-07/rowysovabeach.png" alt="#rowysovabeach" />
<figcaption><a href="https://twitter.com/search?q=%23rowysovabeach%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#rowysovabeach</a><br><a date1="2015-09-07" hashtag="rowysovabeach" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.064</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-09-07/whymediahidesupport4bapuji.png" alt="#whymediahidesupport4bapuji" />
<figcaption><a href="https://twitter.com/search?q=%23whymediahidesupport4bapuji%20since%3A2015-09-06%20until%3A2015-09-07" target="_blank">#whymediahidesupport4bapuji</a><br><a date1="2015-09-07" hashtag="whymediahidesupport4bapuji" id="some_other_id35" href="">Similar hashtags</a><br>Score: 0.001</figcaption>
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