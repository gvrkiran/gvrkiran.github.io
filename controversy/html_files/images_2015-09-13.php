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
        defaultDate: new Date(2015,8,13),
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
<h3> Trending hashtags from 2015-09-13</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-13/aaronsnewvideo.png" alt="#aaronsnewvideo" />
<figcaption><a href="https://twitter.com/search?q=%23aaronsnewvideo%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#aaronsnewvideo</a><br><a></a>Score: -0.02</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-13/balvsden.png" alt="#balvsden" />
<figcaption><a href="https://twitter.com/search?q=%23balvsden%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#balvsden</a><br><a></a>Score: 0.112</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-13/bears.png" alt="#bears" />
<figcaption><a href="https://twitter.com/search?q=%23bears%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#bears</a><br><a></a>Score: 0.008</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-13/coys.png" alt="#coys" />
<figcaption><a href="https://twitter.com/search?q=%23coys%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#coys</a><br><a></a>Score: 0.046</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-13/dejenlavidaporlaazulyoro.png" alt="#dejenlavidaporlaazulyoro" />
<figcaption><a href="https://twitter.com/search?q=%23dejenlavidaporlaazulyoro%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#dejenlavidaporlaazulyoro</a><br><a></a>Score: 0.084</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-13/europeisthebest.png" alt="#europeisthebest" />
<figcaption><a href="https://twitter.com/search?q=%23europeisthebest%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#europeisthebest</a><br><a></a>Score: 0.006</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-13/fedvnole.png" alt="#fedvnole" />
<figcaption><a href="https://twitter.com/search?q=%23fedvnole%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#fedvnole</a><br><a></a>Score: 0.002</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-13/gala1gh16.png" alt="#gala1gh16" />
<figcaption><a href="https://twitter.com/search?q=%23gala1gh16%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#gala1gh16</a><br><a></a>Score: 0.058</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-13/happy22ndbirthdayniall.png" alt="#happy22ndbirthdayniall" />
<figcaption><a href="https://twitter.com/search?q=%23happy22ndbirthdayniall%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#happy22ndbirthdayniall</a><br><a date1="2015-09-13" hashtag="happy22ndbirthdayniall" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.138</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-13/improudof5sosfor.png" alt="#improudof5sosfor" />
<figcaption><a href="https://twitter.com/search?q=%23improudof5sosfor%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#improudof5sosfor</a><br><a></a>Score: -0.00</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-13/intermilan.png" alt="#intermilan" />
<figcaption><a href="https://twitter.com/search?q=%23intermilan%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#intermilan</a><br><a></a>Score: 0.208</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-13/liamyoudeservetheworld.png" alt="#liamyoudeservetheworld" />
<figcaption><a href="https://twitter.com/search?q=%23liamyoudeservetheworld%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#liamyoudeservetheworld</a><br><a date1="2015-09-13" hashtag="liamyoudeservetheworld" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.170</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-13/mainemendozaonkmjs.png" alt="#mainemendozaonkmjs" />
<figcaption><a href="https://twitter.com/search?q=%23mainemendozaonkmjs%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#mainemendozaonkmjs</a><br><a date1="2015-09-13" hashtag="mainemendozaonkmjs" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-13/mayweatherberto.png" alt="#mayweatherberto" />
<figcaption><a href="https://twitter.com/search?q=%23mayweatherberto%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#mayweatherberto</a><br><a date1="2015-09-13" hashtag="mayweatherberto" id="some_id27" href="">Example Tweets</a><br>Score: 0.308</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-13/missamerica.png" alt="#missamerica" />
<figcaption><a href="https://twitter.com/search?q=%23missamerica%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#missamerica</a><br><a></a>Score: 0.138</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-13/motogp.png" alt="#motogp" />
<figcaption><a href="https://twitter.com/search?q=%23motogp%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#motogp</a><br><a></a>Score: 0.095</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-09-13/nygvsdal.png" alt="#nygvsdal" />
<figcaption><a href="https://twitter.com/search?q=%23nygvsdal%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#nygvsdal</a><br><a></a>Score: -0.00</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-09-13/objetivoarturmas.png" alt="#objetivoarturmas" />
<figcaption><a href="https://twitter.com/search?q=%23objetivoarturmas%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#objetivoarturmas</a><br><a date1="2015-09-13" hashtag="objetivoarturmas" id="some_id35" href="">Example Tweets</a><br>Score: 0.322</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-09-13/rowysowestpalm.png" alt="#rowysowestpalm" />
<figcaption><a href="https://twitter.com/search?q=%23rowysowestpalm%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#rowysowestpalm</a><br><a></a>Score: 0.117</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-09-13/seahawks.png" alt="#seahawks" />
<figcaption><a href="https://twitter.com/search?q=%23seahawks%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#seahawks</a><br><a></a>Score: -0.00</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-09-13/spn10.png" alt="#spn10" />
<figcaption><a href="https://twitter.com/search?q=%23spn10%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#spn10</a><br><a></a>Score: 0.009</figcaption>
</figure>
<figure tabindex="42">
<img src="../plots/2015-09-13/tiff15.png" alt="#tiff15" />
<figcaption><a href="https://twitter.com/search?q=%23tiff15%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#tiff15</a><br><a></a>Score: 0.119</figcaption>
</figure>
<figure tabindex="44">
<img src="../plots/2015-09-13/upfight.png" alt="#upfight" />
<figcaption><a href="https://twitter.com/search?q=%23upfight%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#upfight</a><br><a></a>Score: 0.056</figcaption>
</figure>
<figure tabindex="46">
<img src="../plots/2015-09-13/valleyfire.png" alt="#valleyfire" />
<figcaption><a href="https://twitter.com/search?q=%23valleyfire%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#valleyfire</a><br><a></a>Score: 0.042</figcaption>
</figure>
<figure tabindex="48">
<img src="../plots/2015-09-13/voteforteamslayes.png" alt="#voteforteamslayes" />
<figcaption><a href="https://twitter.com/search?q=%23voteforteamslayes%20since%3A2015-09-12%20until%3A2015-09-13" target="_blank">#voteforteamslayes</a><br><a date1="2015-09-13" hashtag="voteforteamslayes" id="some_other_id49" href="">Similar hashtags</a><br>Score: 0.039</figcaption>
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