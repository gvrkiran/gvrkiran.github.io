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
        defaultDate: new Date(2015,8,12),
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
<h3> Trending hashtags from 2015-09-12</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-12/500rtiz.png" alt="#500rtiz" />
<figcaption><a href="https://twitter.com/search?q=%23500rtiz%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#500rtiz</a><br><a></a>Score: 0.022</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-12/absaprem.png" alt="#absaprem" />
<figcaption><a href="https://twitter.com/search?q=%23absaprem%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#absaprem</a><br><a></a>Score: -0.02</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-12/abvprocks.png" alt="#abvprocks" />
<figcaption><a href="https://twitter.com/search?q=%23abvprocks%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#abvprocks</a><br><a></a>Score: 0.036</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-12/aldenrichardsonmpk.png" alt="#aldenrichardsonmpk" />
<figcaption><a href="https://twitter.com/search?q=%23aldenrichardsonmpk%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#aldenrichardsonmpk</a><br><a></a>Score: 0.009</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-12/arsenal.png" alt="#arsenal" />
<figcaption><a href="https://twitter.com/search?q=%23arsenal%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#arsenal</a><br><a></a>Score: 0.234</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-12/askjacob.png" alt="#askjacob" />
<figcaption><a href="https://twitter.com/search?q=%23askjacob%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#askjacob</a><br><a date1="2015-09-12" hashtag="askjacob" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.035</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-12/atletifcb.png" alt="#atletifcb" />
<figcaption><a href="https://twitter.com/search?q=%23atletifcb%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#atletifcb</a><br><a></a>Score: 0.017</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-12/corbyn.png" alt="#corbyn" />
<figcaption><a href="https://twitter.com/search?q=%23corbyn%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#corbyn</a><br><a></a>Score: 0.118</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-12/eveche.png" alt="#eveche" />
<figcaption><a href="https://twitter.com/search?q=%23eveche%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#eveche</a><br><a></a>Score: 0.217</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-12/fandomawards.png" alt="#fandomawards" />
<figcaption><a href="https://twitter.com/search?q=%23fandomawards%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#fandomawards</a><br><a></a>Score: 0.172</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-12/fcbfca.png" alt="#fcbfca" />
<figcaption><a href="https://twitter.com/search?q=%23fcbfca%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#fcbfca</a><br><a></a>Score: 0.052</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-12/goblue.png" alt="#goblue" />
<figcaption><a href="https://twitter.com/search?q=%23goblue%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#goblue</a><br><a></a>Score: -0.00</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-12/h96bvb.png" alt="#h96bvb" />
<figcaption><a href="https://twitter.com/search?q=%23h96bvb%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#h96bvb</a><br><a></a>Score: 0.025</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-12/halamadrid.png" alt="#halamadrid" />
<figcaption><a href="https://twitter.com/search?q=%23halamadrid%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#halamadrid</a><br><a></a>Score: 0.032</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-12/happybirthdayniall.png" alt="#happybirthdayniall" />
<figcaption><a href="https://twitter.com/search?q=%23happybirthdayniall%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#happybirthdayniall</a><br><a date1="2015-09-12" hashtag="happybirthdayniall" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.136</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-12/happybirthdaypaulwalker.png" alt="#happybirthdaypaulwalker" />
<figcaption><a href="https://twitter.com/search?q=%23happybirthdaypaulwalker%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#happybirthdaypaulwalker</a><br><a date1="2015-09-12" hashtag="happybirthdaypaulwalker" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.057</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-09-12/herestorowysomemories.png" alt="#herestorowysomemories" />
<figcaption><a href="https://twitter.com/search?q=%23herestorowysomemories%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#herestorowysomemories</a><br><a date1="2015-09-12" hashtag="herestorowysomemories" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.080</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-09-12/kathnielat9thstarmagicball.png" alt="#kathnielat9thstarmagicball" />
<figcaption><a href="https://twitter.com/search?q=%23kathnielat9thstarmagicball%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#kathnielat9thstarmagicball</a><br><a></a>Score: 0.012</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-09-12/labourleadership.png" alt="#labourleadership" />
<figcaption><a href="https://twitter.com/search?q=%23labourleadership%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#labourleadership</a><br><a date1="2015-09-12" hashtag="labourleadership" id="some_other_id37" href="">Similar hashtags</a><br>Score: 0.099</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-09-12/mayweatherberto.png" alt="#mayweatherberto" />
<figcaption><a href="https://twitter.com/search?q=%23mayweatherberto%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#mayweatherberto</a><br><a date1="2015-09-12" hashtag="mayweatherberto" id="some_other_id39" href="">Similar hashtags</a><br>Score: 0.070</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-09-12/msgpraytogod.png" alt="#msgpraytogod" />
<figcaption><a href="https://twitter.com/search?q=%23msgpraytogod%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#msgpraytogod</a><br><a></a>Score: 0.105</figcaption>
</figure>
<figure tabindex="42">
<img src="../plots/2015-09-12/munliv.png" alt="#munliv" />
<figcaption><a href="https://twitter.com/search?q=%23munliv%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#munliv</a><br><a></a>Score: 0.148</figcaption>
</figure>
<figure tabindex="44">
<img src="../plots/2015-09-12/otraboston.png" alt="#otraboston" />
<figcaption><a href="https://twitter.com/search?q=%23otraboston%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#otraboston</a><br><a date1="2015-09-12" hashtag="otraboston" id="some_other_id45" href="">Similar hashtags</a><br>Score: 0.157</figcaption>
</figure>
<figure tabindex="46">
<img src="../plots/2015-09-12/otragillette.png" alt="#otragillette" />
<figcaption><a href="https://twitter.com/search?q=%23otragillette%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#otragillette</a><br><a></a>Score: 0.110</figcaption>
</figure>
<figure tabindex="48">
<img src="../plots/2015-09-12/rowysotampa.png" alt="#rowysotampa" />
<figcaption><a href="https://twitter.com/search?q=%23rowysotampa%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#rowysotampa</a><br><a date1="2015-09-12" hashtag="rowysotampa" id="some_other_id49" href="">Similar hashtags</a><br>Score: 0.103</figcaption>
</figure>
<figure tabindex="50">
<img src="../plots/2015-09-12/vivavenezuela.png" alt="#vivavenezuela" />
<figcaption><a href="https://twitter.com/search?q=%23vivavenezuela%20since%3A2015-09-11%20until%3A2015-09-12" target="_blank">#vivavenezuela</a><br><a></a>Score: 0.051</figcaption>
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