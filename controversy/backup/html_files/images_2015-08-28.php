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
        defaultDate: new Date(2015,7,28),
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
<h3> Trending hashtags from 2015-08-28</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-28/aldubmaidenheaven.png" alt="#aldubmaidenheaven" />
<figcaption><a href="https://twitter.com/search?q=%23aldubmaidenheaven%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#aldubmaidenheaven</a><br><a date1="2015-08-28" hashtag="aldubmaidenheaven" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.027</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-28/badlands.png" alt="#badlands" />
<figcaption><a href="https://twitter.com/search?q=%23badlands%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#badlands</a><br><a date1="2015-08-28" hashtag="badlands" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.081</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-28/beautybehindthemadness.png" alt="#beautybehindthemadness" />
<figcaption><a href="https://twitter.com/search?q=%23beautybehindthemadness%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#beautybehindthemadness</a><br><a date1="2015-08-28" hashtag="beautybehindthemadness" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.063</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-28/borderforce.png" alt="#borderforce" />
<figcaption><a href="https://twitter.com/search?q=%23borderforce%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#borderforce</a><br><a date1="2015-08-28" hashtag="borderforce" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.032</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-28/borraantena3.png" alt="#borraantena3" />
<figcaption><a href="https://twitter.com/search?q=%23borraantena3%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#borraantena3</a><br><a date1="2015-08-28" hashtag="borraantena3" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.158</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-28/buywhatdoyoumeantodayonitunes.png" alt="#buywhatdoyoumeantodayonitunes" />
<figcaption><a href="https://twitter.com/search?q=%23buywhatdoyoumeantodayonitunes%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#buywhatdoyoumeantodayonitunes</a><br><a date1="2015-08-28" hashtag="buywhatdoyoumeantodayonitunes" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.060</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-28/buywhatdoyoumeantomorrow.png" alt="#buywhatdoyoumeantomorrow" />
<figcaption><a href="https://twitter.com/search?q=%23buywhatdoyoumeantomorrow%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#buywhatdoyoumeantomorrow</a><br><a date1="2015-08-28" hashtag="buywhatdoyoumeantomorrow" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.063</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-28/cozinhadameninaburra6.png" alt="#cozinhadameninaburra6" />
<figcaption><a href="https://twitter.com/search?q=%23cozinhadameninaburra6%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#cozinhadameninaburra6</a><br><a date1="2015-08-28" hashtag="cozinhadameninaburra6" id="some_other_id15" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-28/dominion.png" alt="#dominion" />
<figcaption><a href="https://twitter.com/search?q=%23dominion%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#dominion</a><br><a date1="2015-08-28" hashtag="dominion" id="some_id17" href="">Example Tweets</a><br>Score: 0.390</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-28/happybirthdayliam.png" alt="#happybirthdayliam" />
<figcaption><a href="https://twitter.com/search?q=%23happybirthdayliam%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#happybirthdayliam</a><br><a date1="2015-08-28" hashtag="happybirthdayliam" id="some_id19" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-28/harrypotter.png" alt="#harrypotter" />
<figcaption><a href="https://twitter.com/search?q=%23harrypotter%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#harrypotter</a><br><a date1="2015-08-28" hashtag="harrypotter" id="some_other_id21" href="">Similar hashtags</a><br>Score: -0.01</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-28/herecomestheson.png" alt="#herecomestheson" />
<figcaption><a href="https://twitter.com/search?q=%23herecomestheson%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#herecomestheson</a><br><a date1="2015-08-28" hashtag="herecomestheson" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.008</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-08-28/janoskianstonumber1.png" alt="#janoskianstonumber1" />
<figcaption><a href="https://twitter.com/search?q=%23janoskianstonumber1%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#janoskianstonumber1</a><br><a date1="2015-08-28" hashtag="janoskianstonumber1" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.000</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-08-28/lulanuncamais.png" alt="#lulanuncamais" />
<figcaption><a href="https://twitter.com/search?q=%23lulanuncamais%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#lulanuncamais</a><br><a date1="2015-08-28" hashtag="lulanuncamais" id="some_other_id27" href="">Similar hashtags</a><br>Score: 0.043</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-08-28/savechloe.png" alt="#savechloe" />
<figcaption><a href="https://twitter.com/search?q=%23savechloe%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#savechloe</a><br><a date1="2015-08-28" hashtag="savechloe" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.021</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-08-28/sheskindahotep.png" alt="#sheskindahotep" />
<figcaption><a href="https://twitter.com/search?q=%23sheskindahotep%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#sheskindahotep</a><br><a date1="2015-08-28" hashtag="sheskindahotep" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.077</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-08-28/ueldraw.png" alt="#ueldraw" />
<figcaption><a href="https://twitter.com/search?q=%23ueldraw%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#ueldraw</a><br><a date1="2015-08-28" hashtag="ueldraw" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.009</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-08-28/watchrumbaonanahivevo.png" alt="#watchrumbaonanahivevo" />
<figcaption><a href="https://twitter.com/search?q=%23watchrumbaonanahivevo%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#watchrumbaonanahivevo</a><br><a date1="2015-08-28" hashtag="watchrumbaonanahivevo" id="some_other_id35" href="">Similar hashtags</a><br>Score: 0.087</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-08-28/whatdoyoumeanmusicvideo.png" alt="#whatdoyoumeanmusicvideo" />
<figcaption><a href="https://twitter.com/search?q=%23whatdoyoumeanmusicvideo%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#whatdoyoumeanmusicvideo</a><br><a date1="2015-08-28" hashtag="whatdoyoumeanmusicvideo" id="some_other_id37" href="">Similar hashtags</a><br>Score: 0.133</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-08-28/whatdoyoumeantoday.png" alt="#whatdoyoumeantoday" />
<figcaption><a href="https://twitter.com/search?q=%23whatdoyoumeantoday%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#whatdoyoumeantoday</a><br><a date1="2015-08-28" hashtag="whatdoyoumeantoday" id="some_id39" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-08-28/whyisphilrunning.png" alt="#whyisphilrunning" />
<figcaption><a href="https://twitter.com/search?q=%23whyisphilrunning%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#whyisphilrunning</a><br><a date1="2015-08-28" hashtag="whyisphilrunning" id="some_other_id41" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="42">
<img src="../plots/2015-08-28/whywelovehairlm.png" alt="#whywelovehairlm" />
<figcaption><a href="https://twitter.com/search?q=%23whywelovehairlm%20since%3A2015-08-27%20until%3A2015-08-28" target="_blank">#whywelovehairlm</a><br><a date1="2015-08-28" hashtag="whywelovehairlm" id="some_other_id43" href="">Similar hashtags</a><br>Score: -0.03</figcaption>
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