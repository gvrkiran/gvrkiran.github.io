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
        defaultDate: new Date(2015,8,04),
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
<h3> Trending hashtags from 2015-09-04</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-04/aldubbattleforacause.png" alt="#aldubbattleforacause" />
<figcaption><a href="https://twitter.com/search?q=%23aldubbattleforacause%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#aldubbattleforacause</a><br><a date1="2015-09-04" hashtag="aldubbattleforacause" id="some_id1" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-04/beyday.png" alt="#beyday" />
<figcaption><a href="https://twitter.com/search?q=%23beyday%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#beyday</a><br><a date1="2015-09-04" hashtag="beyday" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.053</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-04/biebercomebacktobrazil.png" alt="#biebercomebacktobrazil" />
<figcaption><a href="https://twitter.com/search?q=%23biebercomebacktobrazil%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#biebercomebacktobrazil</a><br><a date1="2015-09-04" hashtag="biebercomebacktobrazil" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.060</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-04/dragmedownpromo.png" alt="#dragmedownpromo" />
<figcaption><a href="https://twitter.com/search?q=%23dragmedownpromo%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#dragmedownpromo</a><br><a date1="2015-09-04" hashtag="dragmedownpromo" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.026</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-04/eminim.png" alt="#eminim" />
<figcaption><a href="https://twitter.com/search?q=%23eminim%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#eminim</a><br><a date1="2015-09-04" hashtag="eminim" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.089</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-04/flashbackfriday.png" alt="#flashbackfriday" />
<figcaption><a href="https://twitter.com/search?q=%23flashbackfriday%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#flashbackfriday</a><br><a date1="2015-09-04" hashtag="flashbackfriday" id="some_other_id11" href="">Similar hashtags</a><br>Score: -0.02</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-04/forcefriday.png" alt="#forcefriday" />
<figcaption><a href="https://twitter.com/search?q=%23forcefriday%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#forcefriday</a><br><a date1="2015-09-04" hashtag="forcefriday" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.146</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-04/gerpol.png" alt="#gerpol" />
<figcaption><a href="https://twitter.com/search?q=%23gerpol%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#gerpol</a><br><a date1="2015-09-04" hashtag="gerpol" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.025</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-04/getwellsoondinah.png" alt="#getwellsoondinah" />
<figcaption><a href="https://twitter.com/search?q=%23getwellsoondinah%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#getwellsoondinah</a><br><a date1="2015-09-04" hashtag="getwellsoondinah" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.009</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-04/happybirthdaybeyonce.png" alt="#happybirthdaybeyonce" />
<figcaption><a href="https://twitter.com/search?q=%23happybirthdaybeyonce%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#happybirthdaybeyonce</a><br><a date1="2015-09-04" hashtag="happybirthdaybeyonce" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.177</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-04/hojetemvideodorangel.png" alt="#hojetemvideodorangel" />
<figcaption><a href="https://twitter.com/search?q=%23hojetemvideodorangel%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#hojetemvideodorangel</a><br><a date1="2015-09-04" hashtag="hojetemvideodorangel" id="some_other_id21" href="">Similar hashtags</a><br>Score: -0.04</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-04/migrantmarch.png" alt="#migrantmarch" />
<figcaption><a href="https://twitter.com/search?q=%23migrantmarch%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#migrantmarch</a><br><a date1="2015-09-04" hashtag="migrantmarch" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.045</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-04/niallbrazilloveyou.png" alt="#niallbrazilloveyou" />
<figcaption><a href="https://twitter.com/search?q=%23niallbrazilloveyou%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#niallbrazilloveyou</a><br><a date1="2015-09-04" hashtag="niallbrazilloveyou" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.064</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-04/otrabuffalo.png" alt="#otrabuffalo" />
<figcaption><a href="https://twitter.com/search?q=%23otrabuffalo%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#otrabuffalo</a><br><a date1="2015-09-04" hashtag="otrabuffalo" id="some_id27" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-04/porfra.png" alt="#porfra" />
<figcaption><a href="https://twitter.com/search?q=%23porfra%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#porfra</a><br><a date1="2015-09-04" hashtag="porfra" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.129</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-04/rocaopaynonelenewsingleby1d.png" alt="#rocaopaynonelenewsingleby1d" />
<figcaption><a href="https://twitter.com/search?q=%23rocaopaynonelenewsingleby1d%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#rocaopaynonelenewsingleby1d</a><br><a date1="2015-09-04" hashtag="rocaopaynonelenewsingleby1d" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.035</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-09-04/rowysocamden.png" alt="#rowysocamden" />
<figcaption><a href="https://twitter.com/search?q=%23rowysocamden%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#rowysocamden</a><br><a date1="2015-09-04" hashtag="rowysocamden" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.051</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-09-04/watchwithjai.png" alt="#watchwithjai" />
<figcaption><a href="https://twitter.com/search?q=%23watchwithjai%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#watchwithjai</a><br><a date1="2015-09-04" hashtag="watchwithjai" id="some_other_id35" href="">Similar hashtags</a><br>Score: 0.000</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-09-04/wild.png" alt="#wild" />
<figcaption><a href="https://twitter.com/search?q=%23wild%20since%3A2015-09-03%20until%3A2015-09-04" target="_blank">#wild</a><br><a date1="2015-09-04" hashtag="wild" id="some_other_id37" href="">Similar hashtags</a><br>Score: 0.068</figcaption>
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