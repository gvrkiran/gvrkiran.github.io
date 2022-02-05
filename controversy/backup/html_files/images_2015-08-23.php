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
    //	console.log(data);
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
        defaultDate: new Date(2015,7,23),
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
<h3> Trending hashtags from 2015-08-23</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-23/antinationalcongress.png" alt="#antinationalcongress" />
<figcaption><a href="https://twitter.com/search?q=%23antinationalcongress%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#antinationalcongress</a><br><a date1="2015-08-23" hashtag="antinationalcongress" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.112</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-23/beijing2015.png" alt="#beijing2015" />
<figcaption><a href="https://twitter.com/search?q=%23beijing2015%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#beijing2015</a><br><a date1="2015-08-23" hashtag="beijing2015" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.230</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-23/belgiangp.png" alt="#belgiangp" />
<figcaption><a href="https://twitter.com/search?q=%23belgiangp%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#belgiangp</a><br><a date1="2015-08-23" hashtag="belgiangp" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.042</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-23/chelsea.png" alt="#chelsea" />
<figcaption><a href="https://twitter.com/search?q=%23chelsea%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#chelsea</a><br><a date1="2015-08-23" hashtag="chelsea" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.101</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-23/escapedminion.png" alt="#escapedminion" />
<figcaption><a href="https://twitter.com/search?q=%23escapedminion%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#escapedminion</a><br><a date1="2015-08-23" hashtag="escapedminion" id="some_other_id9" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-23/evemci.png" alt="#evemci" />
<figcaption><a href="https://twitter.com/search?q=%23evemci%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#evemci</a><br><a date1="2015-08-23" hashtag="evemci" id="some_other_id11" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-23/fcibvb.png" alt="#fcibvb" />
<figcaption><a href="https://twitter.com/search?q=%23fcibvb%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#fcibvb</a><br><a date1="2015-08-23" hashtag="fcibvb" id="some_other_id13" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-23/feartwd.png" alt="#feartwd" />
<figcaption><a href="https://twitter.com/search?q=%23feartwd%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#feartwd</a><br><a date1="2015-08-23" hashtag="feartwd" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.289</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-23/halamadrid.png" alt="#halamadrid" />
<figcaption><a href="https://twitter.com/search?q=%23halamadrid%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#halamadrid</a><br><a date1="2015-08-23" hashtag="halamadrid" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.122</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-23/hannibal.png" alt="#hannibal" />
<figcaption><a href="https://twitter.com/search?q=%23hannibal%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#hannibal</a><br><a date1="2015-08-23" hashtag="hannibal" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.010</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-23/hdn2308.png" alt="#hdn2308" />
<figcaption><a href="https://twitter.com/search?q=%23hdn2308%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#hdn2308</a><br><a date1="2015-08-23" hashtag="hdn2308" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.032</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-23/heidenau.png" alt="#heidenau" />
<figcaption><a href="https://twitter.com/search?q=%23heidenau%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#heidenau</a><br><a date1="2015-08-23" hashtag="heidenau" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.034</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-08-23/honeymoontourmanila.png" alt="#honeymoontourmanila" />
<figcaption><a href="https://twitter.com/search?q=%23honeymoontourmanila%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#honeymoontourmanila</a><br><a date1="2015-08-23" hashtag="honeymoontourmanila" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.032</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-08-23/hot100fest.png" alt="#hot100fest" />
<figcaption><a href="https://twitter.com/search?q=%23hot100fest%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#hot100fest</a><br><a date1="2015-08-23" hashtag="hot100fest" id="some_id27" href="">Example Tweets</a><br>Score: 0.557</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-08-23/hugoawards.png" alt="#hugoawards" />
<figcaption><a href="https://twitter.com/search?q=%23hugoawards%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#hugoawards</a><br><a date1="2015-08-23" hashtag="hugoawards" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.201</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-08-23/lavnyc.png" alt="#lavnyc" />
<figcaption><a href="https://twitter.com/search?q=%23lavnyc%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#lavnyc</a><br><a date1="2015-08-23" hashtag="lavnyc" id="some_other_id31" href="">Similar hashtags</a><br>Score: -0.07</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-08-23/mcfc.png" alt="#mcfc" />
<figcaption><a href="https://twitter.com/search?q=%23mcfc%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#mcfc</a><br><a date1="2015-08-23" hashtag="mcfc" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.094</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-08-23/nxttakeover.png" alt="#nxttakeover" />
<figcaption><a href="https://twitter.com/search?q=%23nxttakeover%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#nxttakeover</a><br><a date1="2015-08-23" hashtag="nxttakeover" id="some_other_id35" href="">Similar hashtags</a><br>Score: 0.023</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-08-23/onedirection.png" alt="#onedirection" />
<figcaption><a href="https://twitter.com/search?q=%23onedirection%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#onedirection</a><br><a date1="2015-08-23" hashtag="onedirection" id="some_other_id37" href="">Similar hashtags</a><br>Score: 0.125</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-08-23/otrachicago.png" alt="#otrachicago" />
<figcaption><a href="https://twitter.com/search?q=%23otrachicago%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#otrachicago</a><br><a date1="2015-08-23" hashtag="otrachicago" id="some_other_id39" href="">Similar hashtags</a><br>Score: 0.017</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-08-23/pequenosgigantes.png" alt="#pequenosgigantes" />
<figcaption><a href="https://twitter.com/search?q=%23pequenosgigantes%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#pequenosgigantes</a><br><a date1="2015-08-23" hashtag="pequenosgigantes" id="some_other_id41" href="">Similar hashtags</a><br>Score: 0.055</figcaption>
</figure>
<figure tabindex="42">
<img src="../plots/2015-08-23/psyunanghalik.png" alt="#psyunanghalik" />
<figcaption><a href="https://twitter.com/search?q=%23psyunanghalik%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#psyunanghalik</a><br><a date1="2015-08-23" hashtag="psyunanghalik" id="some_other_id43" href="">Similar hashtags</a><br>Score: 0.009</figcaption>
</figure>
<figure tabindex="44">
<img src="../plots/2015-08-23/sextapelarry.png" alt="#sextapelarry" />
<figcaption><a href="https://twitter.com/search?q=%23sextapelarry%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#sextapelarry</a><br><a date1="2015-08-23" hashtag="sextapelarry" id="some_id45" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="46">
<img src="../plots/2015-08-23/summerslam.png" alt="#summerslam" />
<figcaption><a href="https://twitter.com/search?q=%23summerslam%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#summerslam</a><br><a date1="2015-08-23" hashtag="summerslam" id="some_other_id47" href="">Similar hashtags</a><br>Score: 0.213</figcaption>
</figure>
<figure tabindex="48">
<img src="../plots/2015-08-23/wbache.png" alt="#wbache" />
<figcaption><a href="https://twitter.com/search?q=%23wbache%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#wbache</a><br><a date1="2015-08-23" hashtag="wbache" id="some_other_id49" href="">Similar hashtags</a><br>Score: 0.037</figcaption>
</figure>
<figure tabindex="50">
<img src="../plots/2015-08-23/wemissyourvoicezayn.png" alt="#wemissyourvoicezayn" />
<figcaption><a href="https://twitter.com/search?q=%23wemissyourvoicezayn%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#wemissyourvoicezayn</a><br><a date1="2015-08-23" hashtag="wemissyourvoicezayn" id="some_id51" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="52">
<img src="../plots/2015-08-23/whyiloveliam.png" alt="#whyiloveliam" />
<figcaption><a href="https://twitter.com/search?q=%23whyiloveliam%20since%3A2015-08-22%20until%3A2015-08-23" target="_blank">#whyiloveliam</a><br><a date1="2015-08-23" hashtag="whyiloveliam" id="some_id53" href="">Example Tweets</a><br>Score: 0.0</figcaption>
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
