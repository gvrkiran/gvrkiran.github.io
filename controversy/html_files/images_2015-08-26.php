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
        defaultDate: new Date(2015,7,26),
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
<h3> Trending hashtags from 2015-08-26</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-26/1989tourla.png" alt="#1989tourla" />
<figcaption><a href="https://twitter.com/search?q=%231989tourla%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#1989tourla</a><br><a></a>Score: 0.128</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-26/1mioformelina.png" alt="#1mioformelina" />
<figcaption><a href="https://twitter.com/search?q=%231mioformelina%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#1mioformelina</a><br><a></a>Score: 0.002</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-26/aldubanglihimnilola.png" alt="#aldubanglihimnilola" />
<figcaption><a href="https://twitter.com/search?q=%23aldubanglihimnilola%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#aldubanglihimnilola</a><br><a date1="2015-08-26" hashtag="aldubanglihimnilola" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-26/ask5sos.png" alt="#ask5sos" />
<figcaption><a href="https://twitter.com/search?q=%23ask5sos%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#ask5sos</a><br><a></a>Score: -0.03</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-26/askbelieber.png" alt="#askbelieber" />
<figcaption><a href="https://twitter.com/search?q=%23askbelieber%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#askbelieber</a><br><a></a>Score: 0.031</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-26/d5comingsoon.png" alt="#d5comingsoon" />
<figcaption><a href="https://twitter.com/search?q=%23d5comingsoon%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#d5comingsoon</a><br><a date1="2015-08-26" hashtag="d5comingsoon" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.262</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-26/gbbo.png" alt="#gbbo" />
<figcaption><a href="https://twitter.com/search?q=%23gbbo%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#gbbo</a><br><a></a>Score: 0.045</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-26/gujarat4peace.png" alt="#gujarat4peace" />
<figcaption><a href="https://twitter.com/search?q=%23gujarat4peace%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#gujarat4peace</a><br><a></a>Score: 0.080</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-26/guncontrol.png" alt="#guncontrol" />
<figcaption><a href="https://twitter.com/search?q=%23guncontrol%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#guncontrol</a><br><a></a>Score: 0.208</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-26/happybdaydylanfrombrazil.png" alt="#happybdaydylanfrombrazil" />
<figcaption><a href="https://twitter.com/search?q=%23happybdaydylanfrombrazil%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#happybdaydylanfrombrazil</a><br><a></a>Score: 0.074</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-26/happybirthdaydylanobrien.png" alt="#happybirthdaydylanobrien" />
<figcaption><a href="https://twitter.com/search?q=%23happybirthdaydylanobrien%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#happybirthdaydylanobrien</a><br><a date1="2015-08-26" hashtag="happybirthdaydylanobrien" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.167</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-26/janoskiansuntolduntrue.png" alt="#janoskiansuntolduntrue" />
<figcaption><a href="https://twitter.com/search?q=%23janoskiansuntolduntrue%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#janoskiansuntolduntrue</a><br><a></a>Score: 0.186</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-08-26/masterchefbr.png" alt="#masterchefbr" />
<figcaption><a href="https://twitter.com/search?q=%23masterchefbr%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#masterchefbr</a><br><a></a>Score: 0.072</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-08-26/na154.png" alt="#na154" />
<figcaption><a href="https://twitter.com/search?q=%23na154%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#na154</a><br><a></a>Score: 0.132</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-08-26/nationaldogday.png" alt="#nationaldogday" />
<figcaption><a href="https://twitter.com/search?q=%23nationaldogday%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#nationaldogday</a><br><a date1="2015-08-26" hashtag="nationaldogday" id="some_id29" href="">Example Tweets</a><br>Score: 0.309</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-08-26/onedirection.png" alt="#onedirection" />
<figcaption><a href="https://twitter.com/search?q=%23onedirection%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#onedirection</a><br><a date1="2015-08-26" hashtag="onedirection" id="some_id31" href="">Example Tweets</a><br>Score: 0.424</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-08-26/otramilwaukee.png" alt="#otramilwaukee" />
<figcaption><a href="https://twitter.com/search?q=%23otramilwaukee%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#otramilwaukee</a><br><a date1="2015-08-26" hashtag="otramilwaukee" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-08-26/psypagpapakilala.png" alt="#psypagpapakilala" />
<figcaption><a href="https://twitter.com/search?q=%23psypagpapakilala%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#psypagpapakilala</a><br><a></a>Score: -0.02</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-08-26/venezuelaexigerespeto.png" alt="#venezuelaexigerespeto" />
<figcaption><a href="https://twitter.com/search?q=%23venezuelaexigerespeto%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#venezuelaexigerespeto</a><br><a></a>Score: 0.073</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-08-26/wdbj.png" alt="#wdbj" />
<figcaption><a href="https://twitter.com/search?q=%23wdbj%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#wdbj</a><br><a></a>Score: 0.156</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-08-26/womensequalityday.png" alt="#womensequalityday" />
<figcaption><a href="https://twitter.com/search?q=%23womensequalityday%20since%3A2015-08-25%20until%3A2015-08-26" target="_blank">#womensequalityday</a><br><a></a>Score: 0.150</figcaption>
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