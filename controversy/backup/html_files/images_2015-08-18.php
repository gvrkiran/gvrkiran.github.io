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
        defaultDate: new Date(2015,7,18),
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
<h3> Trending hashtags from 2015-08-18</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-18/aldubyoulola.png" alt="#aldubyoulola" />
<figcaption><a href="https://twitter.com/search?q=%23aldubyoulola%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#aldubyoulola</a><br><a date1="2015-08-18" hashtag="aldubyoulola" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.005</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-18/applemusicfestival.png" alt="#applemusicfestival" />
<figcaption><a href="https://twitter.com/search?q=%23applemusicfestival%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#applemusicfestival</a><br><a date1="2015-08-18" hashtag="applemusicfestival" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.266</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-18/bo3beta.png" alt="#bo3beta" />
<figcaption><a href="https://twitter.com/search?q=%23bo3beta%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#bo3beta</a><br><a date1="2015-08-18" hashtag="bo3beta" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.010</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-18/coolforthesummervma.png" alt="#coolforthesummervma" />
<figcaption><a href="https://twitter.com/search?q=%23coolforthesummervma%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#coolforthesummervma</a><br><a date1="2015-08-18" hashtag="coolforthesummervma" id="some_id7" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-18/discomfacts.png" alt="#discomfacts" />
<figcaption><a href="https://twitter.com/search?q=%23discomfacts%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#discomfacts</a><br><a date1="2015-08-18" hashtag="discomfacts" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.000</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-18/favpichayes.png" alt="#favpichayes" />
<figcaption><a href="https://twitter.com/search?q=%23favpichayes%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#favpichayes</a><br><a date1="2015-08-18" hashtag="favpichayes" id="some_other_id11" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-18/goodforyouvma.png" alt="#goodforyouvma" />
<figcaption><a href="https://twitter.com/search?q=%23goodforyouvma%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#goodforyouvma</a><br><a date1="2015-08-18" hashtag="goodforyouvma" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.267</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-18/happybirthdaypercyjackson.png" alt="#happybirthdaypercyjackson" />
<figcaption><a href="https://twitter.com/search?q=%23happybirthdaypercyjackson%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#happybirthdaypercyjackson</a><br><a date1="2015-08-18" hashtag="happybirthdaypercyjackson" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.025</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-18/ilookgoodonyou.png" alt="#ilookgoodonyou" />
<figcaption><a href="https://twitter.com/search?q=%23ilookgoodonyou%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#ilookgoodonyou</a><br><a date1="2015-08-18" hashtag="ilookgoodonyou" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.024</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-18/makelifebetterin3words.png" alt="#makelifebetterin3words" />
<figcaption><a href="https://twitter.com/search?q=%23makelifebetterin3words%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#makelifebetterin3words</a><br><a date1="2015-08-18" hashtag="makelifebetterin3words" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.141</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-18/mufc.png" alt="#mufc" />
<figcaption><a href="https://twitter.com/search?q=%23mufc%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#mufc</a><br><a date1="2015-08-18" hashtag="mufc" id="some_id21" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-18/otracolumbus.png" alt="#otracolumbus" />
<figcaption><a href="https://twitter.com/search?q=%23otracolumbus%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#otracolumbus</a><br><a date1="2015-08-18" hashtag="otracolumbus" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.154</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-08-18/teenwolf.png" alt="#teenwolf" />
<figcaption><a href="https://twitter.com/search?q=%23teenwolf%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#teenwolf</a><br><a date1="2015-08-18" hashtag="teenwolf" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.036</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-08-18/thecrushsong.png" alt="#thecrushsong" />
<figcaption><a href="https://twitter.com/search?q=%23thecrushsong%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#thecrushsong</a><br><a date1="2015-08-18" hashtag="thecrushsong" id="some_other_id27" href="">Similar hashtags</a><br>Score: 0.009</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-08-18/thingsjesusneversaid.png" alt="#thingsjesusneversaid" />
<figcaption><a href="https://twitter.com/search?q=%23thingsjesusneversaid%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#thingsjesusneversaid</a><br><a date1="2015-08-18" hashtag="thingsjesusneversaid" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.229</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-08-18/xuxanarecord.png" alt="#xuxanarecord" />
<figcaption><a href="https://twitter.com/search?q=%23xuxanarecord%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#xuxanarecord</a><br><a date1="2015-08-18" hashtag="xuxanarecord" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.081</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-08-18/yourzquadisherezayn.png" alt="#yourzquadisherezayn" />
<figcaption><a href="https://twitter.com/search?q=%23yourzquadisherezayn%20since%3A2015-08-17%20until%3A2015-08-18" target="_blank">#yourzquadisherezayn</a><br><a date1="2015-08-18" hashtag="yourzquadisherezayn" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.055</figcaption>
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