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
        defaultDate: new Date(2015,8,10),
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
<h3> Trending hashtags from 2015-09-10</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-10/5sosannouncement.png" alt="#5sosannouncement" />
<figcaption><a href="https://twitter.com/search?q=%235sosannouncement%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#5sosannouncement</a><br><a date1="2015-09-10" hashtag="5sosannouncement" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.075</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-10/ahshotel.png" alt="#ahshotel" />
<figcaption><a href="https://twitter.com/search?q=%23ahshotel%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#ahshotel</a><br><a date1="2015-09-10" hashtag="ahshotel" id="some_id3" href="">Example Tweets</a><br>Score: 0.311</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-10/aldublostwithoutyou.png" alt="#aldublostwithoutyou" />
<figcaption><a href="https://twitter.com/search?q=%23aldublostwithoutyou%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#aldublostwithoutyou</a><br><a date1="2015-09-10" hashtag="aldublostwithoutyou" id="some_id5" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-10/allforlove8days.png" alt="#allforlove8days" />
<figcaption><a href="https://twitter.com/search?q=%23allforlove8days%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#allforlove8days</a><br><a date1="2015-09-10" hashtag="allforlove8days" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.002</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-10/biebertoday.png" alt="#biebertoday" />
<figcaption><a href="https://twitter.com/search?q=%23biebertoday%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#biebertoday</a><br><a date1="2015-09-10" hashtag="biebertoday" id="some_id9" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-10/cizredesivilhalkkatlediliyor.png" alt="#cizredesivilhalkkatlediliyor" />
<figcaption><a href="https://twitter.com/search?q=%23cizredesivilhalkkatlediliyor%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#cizredesivilhalkkatlediliyor</a><br><a date1="2015-09-10" hashtag="cizredesivilhalkkatlediliyor" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.089</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-10/cizreunderattack.png" alt="#cizreunderattack" />
<figcaption><a href="https://twitter.com/search?q=%23cizreunderattack%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#cizreunderattack</a><br><a date1="2015-09-10" hashtag="cizreunderattack" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.083</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-10/fallontonight.png" alt="#fallontonight" />
<figcaption><a href="https://twitter.com/search?q=%23fallontonight%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#fallontonight</a><br><a date1="2015-09-10" hashtag="fallontonight" id="some_other_id15" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-10/homonaledi.png" alt="#homonaledi" />
<figcaption><a href="https://twitter.com/search?q=%23homonaledi%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#homonaledi</a><br><a date1="2015-09-10" hashtag="homonaledi" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.041</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-10/maropeng.png" alt="#maropeng" />
<figcaption><a href="https://twitter.com/search?q=%23maropeng%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#maropeng</a><br><a date1="2015-09-10" hashtag="maropeng" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.078</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-10/natashamckenna.png" alt="#natashamckenna" />
<figcaption><a href="https://twitter.com/search?q=%23natashamckenna%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#natashamckenna</a><br><a date1="2015-09-10" hashtag="natashamckenna" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.010</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-10/otraottawa2.png" alt="#otraottawa2" />
<figcaption><a href="https://twitter.com/search?q=%23otraottawa2%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#otraottawa2</a><br><a date1="2015-09-10" hashtag="otraottawa2" id="some_id23" href="">Example Tweets</a><br>Score: 0.357</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-10/pitmad.png" alt="#pitmad" />
<figcaption><a href="https://twitter.com/search?q=%23pitmad%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#pitmad</a><br><a date1="2015-09-10" hashtag="pitmad" id="some_other_id25" href="">Similar hashtags</a><br>Score: -0.01</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-10/pitvsne.png" alt="#pitvsne" />
<figcaption><a href="https://twitter.com/search?q=%23pitvsne%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#pitvsne</a><br><a date1="2015-09-10" hashtag="pitvsne" id="some_other_id27" href="">Similar hashtags</a><br>Score: 0.233</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-10/pokemongo.png" alt="#pokemongo" />
<figcaption><a href="https://twitter.com/search?q=%23pokemongo%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#pokemongo</a><br><a date1="2015-09-10" hashtag="pokemongo" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.106</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-10/quintadevideonovo.png" alt="#quintadevideonovo" />
<figcaption><a href="https://twitter.com/search?q=%23quintadevideonovo%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#quintadevideonovo</a><br><a date1="2015-09-10" hashtag="quintadevideonovo" id="some_other_id31" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-09-10/revel.png" alt="#revel" />
<figcaption><a href="https://twitter.com/search?q=%23revel%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#revel</a><br><a date1="2015-09-10" hashtag="revel" id="some_other_id33" href="">Similar hashtags</a><br>Score: -0.03</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-09-10/rowysoraleigh.png" alt="#rowysoraleigh" />
<figcaption><a href="https://twitter.com/search?q=%23rowysoraleigh%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#rowysoraleigh</a><br><a date1="2015-09-10" hashtag="rowysoraleigh" id="some_other_id35" href="">Similar hashtags</a><br>Score: 0.058</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-09-10/sameoldlove.png" alt="#sameoldlove" />
<figcaption><a href="https://twitter.com/search?q=%23sameoldlove%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#sameoldlove</a><br><a date1="2015-09-10" hashtag="sameoldlove" id="some_other_id37" href="">Similar hashtags</a><br>Score: 0.187</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-09-10/semiisback.png" alt="#semiisback" />
<figcaption><a href="https://twitter.com/search?q=%23semiisback%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#semiisback</a><br><a date1="2015-09-10" hashtag="semiisback" id="some_other_id39" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-09-10/usernameevie.png" alt="#usernameevie" />
<figcaption><a href="https://twitter.com/search?q=%23usernameevie%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#usernameevie</a><br><a date1="2015-09-10" hashtag="usernameevie" id="some_other_id41" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="42">
<img src="../plots/2015-09-10/wesupportthelgbtcommunity.png" alt="#wesupportthelgbtcommunity" />
<figcaption><a href="https://twitter.com/search?q=%23wesupportthelgbtcommunity%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#wesupportthelgbtcommunity</a><br><a date1="2015-09-10" hashtag="wesupportthelgbtcommunity" id="some_other_id43" href="">Similar hashtags</a><br>Score: 0.043</figcaption>
</figure>
<figure tabindex="44">
<img src="../plots/2015-09-10/worldsuicidepreventionday.png" alt="#worldsuicidepreventionday" />
<figcaption><a href="https://twitter.com/search?q=%23worldsuicidepreventionday%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#worldsuicidepreventionday</a><br><a date1="2015-09-10" hashtag="worldsuicidepreventionday" id="some_other_id45" href="">Similar hashtags</a><br>Score: 0.286</figcaption>
</figure>
<figure tabindex="46">
<img src="../plots/2015-09-10/wspd15.png" alt="#wspd15" />
<figcaption><a href="https://twitter.com/search?q=%23wspd15%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#wspd15</a><br><a date1="2015-09-10" hashtag="wspd15" id="some_other_id47" href="">Similar hashtags</a><br>Score: 0.215</figcaption>
</figure>
<figure tabindex="48">
<img src="../plots/2015-09-10/zaynwearealwayshere.png" alt="#zaynwearealwayshere" />
<figcaption><a href="https://twitter.com/search?q=%23zaynwearealwayshere%20since%3A2015-09-09%20until%3A2015-09-10" target="_blank">#zaynwearealwayshere</a><br><a date1="2015-09-10" hashtag="zaynwearealwayshere" id="some_other_id49" href="">Similar hashtags</a><br>Score: 0.200</figcaption>
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