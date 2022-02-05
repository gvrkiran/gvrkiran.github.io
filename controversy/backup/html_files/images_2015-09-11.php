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
        defaultDate: new Date(2015,8,11),
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
<h3> Trending hashtags from 2015-09-11</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-11/1dwestillthere.png" alt="#1dwestillthere" />
<figcaption><a href="https://twitter.com/search?q=%231dwestillthere%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#1dwestillthere</a><br><a date1="2015-09-11" hashtag="1dwestillthere" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.005</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-11/911anniversary.png" alt="#911anniversary" />
<figcaption><a href="https://twitter.com/search?q=%23911anniversary%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#911anniversary</a><br><a date1="2015-09-11" hashtag="911anniversary" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.279</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-11/aldubtheabduction.png" alt="#aldubtheabduction" />
<figcaption><a href="https://twitter.com/search?q=%23aldubtheabduction%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#aldubtheabduction</a><br><a date1="2015-09-11" hashtag="aldubtheabduction" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.022</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-11/allforloveoneweek.png" alt="#allforloveoneweek" />
<figcaption><a href="https://twitter.com/search?q=%23allforloveoneweek%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#allforloveoneweek</a><br><a date1="2015-09-11" hashtag="allforloveoneweek" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.016</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-11/congratslouis.png" alt="#congratslouis" />
<figcaption><a href="https://twitter.com/search?q=%23congratslouis%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#congratslouis</a><br><a date1="2015-09-11" hashtag="congratslouis" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.121</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-11/crybabymodi.png" alt="#crybabymodi" />
<figcaption><a href="https://twitter.com/search?q=%23crybabymodi%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#crybabymodi</a><br><a date1="2015-09-11" hashtag="crybabymodi" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.074</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-11/dallasdms.png" alt="#dallasdms" />
<figcaption><a href="https://twitter.com/search?q=%23dallasdms%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#dallasdms</a><br><a date1="2015-09-11" hashtag="dallasdms" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.093</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-11/davestays.png" alt="#davestays" />
<figcaption><a href="https://twitter.com/search?q=%23davestays%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#davestays</a><br><a date1="2015-09-11" hashtag="davestays" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.002</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-11/diada2015.png" alt="#diada2015" />
<figcaption><a href="https://twitter.com/search?q=%23diada2015%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#diada2015</a><br><a date1="2015-09-11" hashtag="diada2015" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.129</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-11/eastonfleek.png" alt="#eastonfleek" />
<figcaption><a href="https://twitter.com/search?q=%23eastonfleek%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#eastonfleek</a><br><a date1="2015-09-11" hashtag="eastonfleek" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.078</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-11/ge2015.png" alt="#ge2015" />
<figcaption><a href="https://twitter.com/search?q=%23ge2015%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#ge2015</a><br><a date1="2015-09-11" hashtag="ge2015" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.067</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-11/lovaticsforever.png" alt="#lovaticsforever" />
<figcaption><a href="https://twitter.com/search?q=%23lovaticsforever%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#lovaticsforever</a><br><a date1="2015-09-11" hashtag="lovaticsforever" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.038</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-11/makkah.png" alt="#makkah" />
<figcaption><a href="https://twitter.com/search?q=%23makkah%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#makkah</a><br><a date1="2015-09-11" hashtag="makkah" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.117</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-11/mecca.png" alt="#mecca" />
<figcaption><a href="https://twitter.com/search?q=%23mecca%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#mecca</a><br><a date1="2015-09-11" hashtag="mecca" id="some_other_id27" href="">Similar hashtags</a><br>Score: 0.137</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-11/modibestpm.png" alt="#modibestpm" />
<figcaption><a href="https://twitter.com/search?q=%23modibestpm%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#modibestpm</a><br><a date1="2015-09-11" hashtag="modibestpm" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.017</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-11/onedirectionimsorryfor.png" alt="#onedirectionimsorryfor" />
<figcaption><a href="https://twitter.com/search?q=%23onedirectionimsorryfor%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#onedirectionimsorryfor</a><br><a date1="2015-09-11" hashtag="onedirectionimsorryfor" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.174</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-09-11/psydiretsahan.png" alt="#psydiretsahan" />
<figcaption><a href="https://twitter.com/search?q=%23psydiretsahan%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#psydiretsahan</a><br><a date1="2015-09-11" hashtag="psydiretsahan" id="some_other_id33" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-09-11/remember911.png" alt="#remember911" />
<figcaption><a href="https://twitter.com/search?q=%23remember911%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#remember911</a><br><a date1="2015-09-11" hashtag="remember911" id="some_other_id35" href="">Similar hashtags</a><br>Score: 0.133</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-09-11/september11.png" alt="#september11" />
<figcaption><a href="https://twitter.com/search?q=%23september11%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#september11</a><br><a date1="2015-09-11" hashtag="september11" id="some_other_id37" href="">Similar hashtags</a><br>Score: 0.256</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-09-11/smallzysoundsgoodfeelsgood.png" alt="#smallzysoundsgoodfeelsgood" />
<figcaption><a href="https://twitter.com/search?q=%23smallzysoundsgoodfeelsgood%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#smallzysoundsgoodfeelsgood</a><br><a date1="2015-09-11" hashtag="smallzysoundsgoodfeelsgood" id="some_other_id39" href="">Similar hashtags</a><br>Score: 0.042</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-09-11/thinkitup.png" alt="#thinkitup" />
<figcaption><a href="https://twitter.com/search?q=%23thinkitup%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#thinkitup</a><br><a date1="2015-09-11" hashtag="thinkitup" id="some_other_id41" href="">Similar hashtags</a><br>Score: 0.064</figcaption>
</figure>
<figure tabindex="42">
<img src="../plots/2015-09-11/venezuelaconleopoldo.png" alt="#venezuelaconleopoldo" />
<figcaption><a href="https://twitter.com/search?q=%23venezuelaconleopoldo%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#venezuelaconleopoldo</a><br><a date1="2015-09-11" hashtag="venezuelaconleopoldo" id="some_other_id43" href="">Similar hashtags</a><br>Score: 0.084</figcaption>
</figure>
<figure tabindex="44">
<img src="../plots/2015-09-11/vtep.png" alt="#vtep" />
<figcaption><a href="https://twitter.com/search?q=%23vtep%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#vtep</a><br><a date1="2015-09-11" hashtag="vtep" id="some_other_id45" href="">Similar hashtags</a><br>Score: 0.074</figcaption>
</figure>
<figure tabindex="46">
<img src="../plots/2015-09-11/wherewereyou.png" alt="#wherewereyou" />
<figcaption><a href="https://twitter.com/search?q=%23wherewereyou%20since%3A2015-09-10%20until%3A2015-09-11" target="_blank">#wherewereyou</a><br><a date1="2015-09-11" hashtag="wherewereyou" id="some_other_id47" href="">Similar hashtags</a><br>Score: 0.240</figcaption>
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