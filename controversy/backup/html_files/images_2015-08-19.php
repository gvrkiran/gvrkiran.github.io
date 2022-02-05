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
        defaultDate: new Date(2015,7,19),
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
<h3> Trending hashtags from 2015-08-19</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-19/4yearsoflittlemix.png" alt="#4yearsoflittlemix" />
<figcaption><a href="https://twitter.com/search?q=%234yearsoflittlemix%20since%3A2015-08-18%20until%3A2015-08-19" target="_blank">#4yearsoflittlemix</a><br><a date1="2015-08-19" hashtag="4yearsoflittlemix" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.073</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-19/9daysuntilwhatdoyoumean.png" alt="#9daysuntilwhatdoyoumean" />
<figcaption><a href="https://twitter.com/search?q=%239daysuntilwhatdoyoumean%20since%3A2015-08-18%20until%3A2015-08-19" target="_blank">#9daysuntilwhatdoyoumean</a><br><a date1="2015-08-19" hashtag="9daysuntilwhatdoyoumean" id="some_id3" href="">Example Tweets</a><br>Score: 0.300</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-19/carterinbrazil.png" alt="#carterinbrazil" />
<figcaption><a href="https://twitter.com/search?q=%23carterinbrazil%20since%3A2015-08-18%20until%3A2015-08-19" target="_blank">#carterinbrazil</a><br><a date1="2015-08-19" hashtag="carterinbrazil" id="some_other_id5" href="">Similar hashtags</a><br>Score: -0.02</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-19/descriminalizastf.png" alt="#descriminalizastf" />
<figcaption><a href="https://twitter.com/search?q=%23descriminalizastf%20since%3A2015-08-18%20until%3A2015-08-19" target="_blank">#descriminalizastf</a><br><a date1="2015-08-19" hashtag="descriminalizastf" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.017</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-19/ftii.png" alt="#ftii" />
<figcaption><a href="https://twitter.com/search?q=%23ftii%20since%3A2015-08-18%20until%3A2015-08-19" target="_blank">#ftii</a><br><a date1="2015-08-19" hashtag="ftii" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.054</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-19/ftiimahabharat.png" alt="#ftiimahabharat" />
<figcaption><a href="https://twitter.com/search?q=%23ftiimahabharat%20since%3A2015-08-18%20until%3A2015-08-19" target="_blank">#ftiimahabharat</a><br><a date1="2015-08-19" hashtag="ftiimahabharat" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.070</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-19/gbbo.png" alt="#gbbo" />
<figcaption><a href="https://twitter.com/search?q=%23gbbo%20since%3A2015-08-18%20until%3A2015-08-19" target="_blank">#gbbo</a><br><a date1="2015-08-19" hashtag="gbbo" id="some_id13" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-19/masterchefbr.png" alt="#masterchefbr" />
<figcaption><a href="https://twitter.com/search?q=%23masterchefbr%20since%3A2015-08-18%20until%3A2015-08-19" target="_blank">#masterchefbr</a><br><a date1="2015-08-19" hashtag="masterchefbr" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.083</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-19/pulitrailercountdownbegins.png" alt="#pulitrailercountdownbegins" />
<figcaption><a href="https://twitter.com/search?q=%23pulitrailercountdownbegins%20since%3A2015-08-18%20until%3A2015-08-19" target="_blank">#pulitrailercountdownbegins</a><br><a date1="2015-08-19" hashtag="pulitrailercountdownbegins" id="some_other_id17" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-19/sharehumanity.png" alt="#sharehumanity" />
<figcaption><a href="https://twitter.com/search?q=%23sharehumanity%20since%3A2015-08-18%20until%3A2015-08-19" target="_blank">#sharehumanity</a><br><a date1="2015-08-19" hashtag="sharehumanity" id="some_id19" href="">Example Tweets</a><br>Score: 0.319</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-19/weloveyouliam.png" alt="#weloveyouliam" />
<figcaption><a href="https://twitter.com/search?q=%23weloveyouliam%20since%3A2015-08-18%20until%3A2015-08-19" target="_blank">#weloveyouliam</a><br><a date1="2015-08-19" hashtag="weloveyouliam" id="some_id21" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-19/worldphotographyday.png" alt="#worldphotographyday" />
<figcaption><a href="https://twitter.com/search?q=%23worldphotographyday%20since%3A2015-08-18%20until%3A2015-08-19" target="_blank">#worldphotographyday</a><br><a date1="2015-08-19" hashtag="worldphotographyday" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.182</figcaption>
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