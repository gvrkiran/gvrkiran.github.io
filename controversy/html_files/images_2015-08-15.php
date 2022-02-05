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
        defaultDate: new Date(2015,7,15),
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
<h3> Trending hashtags from 2015-08-15</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-15/1989toursantaclara.png" alt="#1989toursantaclara" />
<figcaption><a href="https://twitter.com/search?q=%231989toursantaclara%20since%3A2015-08-14%20until%3A2015-08-15" target="_blank">#1989toursantaclara</a><br><a date1="2015-08-15" hashtag="1989toursantaclara" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.082</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-15/aldubforyouiwill.png" alt="#aldubforyouiwill" />
<figcaption><a href="https://twitter.com/search?q=%23aldubforyouiwill%20since%3A2015-08-14%20until%3A2015-08-15" target="_blank">#aldubforyouiwill</a><br><a></a>Score: 0.004</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-15/bvbbmg.png" alt="#bvbbmg" />
<figcaption><a href="https://twitter.com/search?q=%23bvbbmg%20since%3A2015-08-14%20until%3A2015-08-15" target="_blank">#bvbbmg</a><br><a date1="2015-08-15" hashtag="bvbbmg" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.031</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-15/christiancover.png" alt="#christiancover" />
<figcaption><a href="https://twitter.com/search?q=%23christiancover%20since%3A2015-08-14%20until%3A2015-08-15" target="_blank">#christiancover</a><br><a></a>Score: 0.028</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-15/civilwar.png" alt="#civilwar" />
<figcaption><a href="https://twitter.com/search?q=%23civilwar%20since%3A2015-08-14%20until%3A2015-08-15" target="_blank">#civilwar</a><br><a date1="2015-08-15" hashtag="civilwar" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.076</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-15/d23expo.png" alt="#d23expo" />
<figcaption><a href="https://twitter.com/search?q=%23d23expo%20since%3A2015-08-14%20until%3A2015-08-15" target="_blank">#d23expo</a><br><a></a>Score: 0.047</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-15/dragmedownday.png" alt="#dragmedownday" />
<figcaption><a href="https://twitter.com/search?q=%23dragmedownday%20since%3A2015-08-14%20until%3A2015-08-15" target="_blank">#dragmedownday</a><br><a date1="2015-08-15" hashtag="dragmedownday" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.031</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-15/perrieappreciationday.png" alt="#perrieappreciationday" />
<figcaption><a href="https://twitter.com/search?q=%23perrieappreciationday%20since%3A2015-08-14%20until%3A2015-08-15" target="_blank">#perrieappreciationday</a><br><a></a>Score: 0.095</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-15/sabadodeganarseguidores.png" alt="#sabadodeganarseguidores" />
<figcaption><a href="https://twitter.com/search?q=%23sabadodeganarseguidores%20since%3A2015-08-14%20until%3A2015-08-15" target="_blank">#sabadodeganarseguidores</a><br><a></a>Score: 0.134</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-15/saturdaynightonline.png" alt="#saturdaynightonline" />
<figcaption><a href="https://twitter.com/search?q=%23saturdaynightonline%20since%3A2015-08-14%20until%3A2015-08-15" target="_blank">#saturdaynightonline</a><br><a></a>Score: 0.132</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-15/spjairplay.png" alt="#spjairplay" />
<figcaption><a href="https://twitter.com/search?q=%23spjairplay%20since%3A2015-08-14%20until%3A2015-08-15" target="_blank">#spjairplay</a><br><a date1="2015-08-15" hashtag="spjairplay" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.023</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-15/throughthefireep.png" alt="#throughthefireep" />
<figcaption><a href="https://twitter.com/search?q=%23throughthefireep%20since%3A2015-08-14%20until%3A2015-08-15" target="_blank">#throughthefireep</a><br><a date1="2015-08-15" hashtag="throughthefireep" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.004</figcaption>
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