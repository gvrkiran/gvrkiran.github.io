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
        defaultDate: new Date(2015,8,06),
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
<h3> Trending hashtags from 2015-09-06</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-06/1989tourinbrazil.png" alt="#1989tourinbrazil" />
<figcaption><a href="https://twitter.com/search?q=%231989tourinbrazil%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#1989tourinbrazil</a><br><a></a>Score: 0.030</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-06/aldubformcdotvc.png" alt="#aldubformcdotvc" />
<figcaption><a href="https://twitter.com/search?q=%23aldubformcdotvc%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#aldubformcdotvc</a><br><a></a>Score: 0.013</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-06/ayotzinapa.png" alt="#ayotzinapa" />
<figcaption><a href="https://twitter.com/search?q=%23ayotzinapa%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#ayotzinapa</a><br><a></a>Score: 0.038</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-06/beyoncemadeinamerica.png" alt="#beyoncemadeinamerica" />
<figcaption><a href="https://twitter.com/search?q=%23beyoncemadeinamerica%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#beyoncemadeinamerica</a><br><a date1="2015-09-06" hashtag="beyoncemadeinamerica" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.029</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-06/craze4msg2.png" alt="#craze4msg2" />
<figcaption><a href="https://twitter.com/search?q=%23craze4msg2%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#craze4msg2</a><br><a></a>Score: 0.020</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-06/diamundialdelsexo.png" alt="#diamundialdelsexo" />
<figcaption><a href="https://twitter.com/search?q=%23diamundialdelsexo%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#diamundialdelsexo</a><br><a></a>Score: 0.142</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-06/emabiggestfansarianagrande.png" alt="#emabiggestfansarianagrande" />
<figcaption><a href="https://twitter.com/search?q=%23emabiggestfansarianagrande%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#emabiggestfansarianagrande</a><br><a></a>Score: 0.040</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-06/euro2016.png" alt="#euro2016" />
<figcaption><a href="https://twitter.com/search?q=%23euro2016%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#euro2016</a><br><a></a>Score: 0.268</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-06/eurobasket2015.png" alt="#eurobasket2015" />
<figcaption><a href="https://twitter.com/search?q=%23eurobasket2015%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#eurobasket2015</a><br><a></a>Score: 0.215</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-06/happybirthdaydinahdime.png" alt="#happybirthdaydinahdime" />
<figcaption><a href="https://twitter.com/search?q=%23happybirthdaydinahdime%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#happybirthdaydinahdime</a><br><a date1="2015-09-06" hashtag="happybirthdaydinahdime" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.055</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-06/italiangp.png" alt="#italiangp" />
<figcaption><a href="https://twitter.com/search?q=%23italiangp%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#italiangp</a><br><a date1="2015-09-06" hashtag="italiangp" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.041</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-06/justindrakebieberloveyou.png" alt="#justindrakebieberloveyou" />
<figcaption><a href="https://twitter.com/search?q=%23justindrakebieberloveyou%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#justindrakebieberloveyou</a><br><a date1="2015-09-06" hashtag="justindrakebieberloveyou" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.221</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-06/modiinfaridabad.png" alt="#modiinfaridabad" />
<figcaption><a href="https://twitter.com/search?q=%23modiinfaridabad%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#modiinfaridabad</a><br><a></a>Score: 0.075</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-06/orop.png" alt="#orop" />
<figcaption><a href="https://twitter.com/search?q=%23orop%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#orop</a><br><a></a>Score: 0.107</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-06/otramontreal.png" alt="#otramontreal" />
<figcaption><a href="https://twitter.com/search?q=%23otramontreal%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#otramontreal</a><br><a date1="2015-09-06" hashtag="otramontreal" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.105</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-06/rowysobristow.png" alt="#rowysobristow" />
<figcaption><a href="https://twitter.com/search?q=%23rowysobristow%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#rowysobristow</a><br><a date1="2015-09-06" hashtag="rowysobristow" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.092</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-09-06/turned.png" alt="#turned" />
<figcaption><a href="https://twitter.com/search?q=%23turned%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#turned</a><br><a date1="2015-09-06" hashtag="turned" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.218</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-09-06/ufc191.png" alt="#ufc191" />
<figcaption><a href="https://twitter.com/search?q=%23ufc191%20since%3A2015-09-05%20until%3A2015-09-06" target="_blank">#ufc191</a><br><a></a>Score: 0.099</figcaption>
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