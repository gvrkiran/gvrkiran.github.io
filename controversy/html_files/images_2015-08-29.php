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
        defaultDate: new Date(2015,7,29),
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
<h3> Trending hashtags from 2015-08-29</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-29/arsenal.png" alt="#arsenal" />
<figcaption><a href="https://twitter.com/search?q=%23arsenal%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#arsenal</a><br><a></a>Score: 0.037</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-29/baleiasnoprogramadojo.png" alt="#baleiasnoprogramadojo" />
<figcaption><a href="https://twitter.com/search?q=%23baleiasnoprogramadojo%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#baleiasnoprogramadojo</a><br><a></a>Score: 0.030</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-29/checry.png" alt="#checry" />
<figcaption><a href="https://twitter.com/search?q=%23checry%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#checry</a><br><a></a>Score: 0.278</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-29/cpfc.png" alt="#cpfc" />
<figcaption><a href="https://twitter.com/search?q=%23cpfc%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#cpfc</a><br><a></a>Score: 0.152</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-29/ema2015.png" alt="#ema2015" />
<figcaption><a href="https://twitter.com/search?q=%23ema2015%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#ema2015</a><br><a></a>Score: 0.002</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-29/fcbb04.png" alt="#fcbb04" />
<figcaption><a href="https://twitter.com/search?q=%23fcbb04%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#fcbb04</a><br><a></a>Score: 0.179</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-29/fcblive.png" alt="#fcblive" />
<figcaption><a href="https://twitter.com/search?q=%23fcblive%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#fcblive</a><br><a></a>Score: 0.051</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-29/halamadrid.png" alt="#halamadrid" />
<figcaption><a href="https://twitter.com/search?q=%23halamadrid%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#halamadrid</a><br><a date1="2015-08-29" hashtag="halamadrid" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.049</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-29/happybirthdayliamfrombrazil.png" alt="#happybirthdayliamfrombrazil" />
<figcaption><a href="https://twitter.com/search?q=%23happybirthdayliamfrombrazil%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#happybirthdayliamfrombrazil</a><br><a date1="2015-08-29" hashtag="happybirthdayliamfrombrazil" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.146</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-29/idsmustgo.png" alt="#idsmustgo" />
<figcaption><a href="https://twitter.com/search?q=%23idsmustgo%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#idsmustgo</a><br><a></a>Score: 0.014</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-29/lilweezyanafest.png" alt="#lilweezyanafest" />
<figcaption><a href="https://twitter.com/search?q=%23lilweezyanafest%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#lilweezyanafest</a><br><a></a>Score: 0.027</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-29/livwhu.png" alt="#livwhu" />
<figcaption><a href="https://twitter.com/search?q=%23livwhu%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#livwhu</a><br><a></a>Score: 0.055</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-08-29/michaeljackson.png" alt="#michaeljackson" />
<figcaption><a href="https://twitter.com/search?q=%23michaeljackson%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#michaeljackson</a><br><a></a>Score: 0.127</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-08-29/milanempoli.png" alt="#milanempoli" />
<figcaption><a href="https://twitter.com/search?q=%23milanempoli%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#milanempoli</a><br><a></a>Score: 0.024</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-08-29/newars.png" alt="#newars" />
<figcaption><a href="https://twitter.com/search?q=%23newars%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#newars</a><br><a></a>Score: 0.012</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-08-29/nufcvafc.png" alt="#nufcvafc" />
<figcaption><a href="https://twitter.com/search?q=%23nufcvafc%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#nufcvafc</a><br><a></a>Score: 0.140</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-08-29/otradetroit.png" alt="#otradetroit" />
<figcaption><a href="https://twitter.com/search?q=%23otradetroit%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#otradetroit</a><br><a date1="2015-08-29" hashtag="otradetroit" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.079</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-08-29/rowysohershey.png" alt="#rowysohershey" />
<figcaption><a href="https://twitter.com/search?q=%23rowysohershey%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#rowysohershey</a><br><a></a>Score: 0.110</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-08-29/soycoder.png" alt="#soycoder" />
<figcaption><a href="https://twitter.com/search?q=%23soycoder%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#soycoder</a><br><a></a>Score: 0.012</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-08-29/tvk2finale.png" alt="#tvk2finale" />
<figcaption><a href="https://twitter.com/search?q=%23tvk2finale%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#tvk2finale</a><br><a></a>Score: 0.023</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-08-29/twcvmaconcert.png" alt="#twcvmaconcert" />
<figcaption><a href="https://twitter.com/search?q=%23twcvmaconcert%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#twcvmaconcert</a><br><a></a>Score: 0.022</figcaption>
</figure>
<figure tabindex="42">
<img src="../plots/2015-08-29/whufc.png" alt="#whufc" />
<figcaption><a href="https://twitter.com/search?q=%23whufc%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#whufc</a><br><a></a>Score: 0.166</figcaption>
</figure>
<figure tabindex="44">
<img src="../plots/2015-08-29/xfactor.png" alt="#xfactor" />
<figcaption><a href="https://twitter.com/search?q=%23xfactor%20since%3A2015-08-28%20until%3A2015-08-29" target="_blank">#xfactor</a><br><a date1="2015-08-29" hashtag="xfactor" id="some_other_id45" href="">Similar hashtags</a><br>Score: 0.195</figcaption>
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