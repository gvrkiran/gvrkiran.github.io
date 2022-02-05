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
        defaultDate: new Date(2015,8,18),
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
<h3> Trending hashtags from 2015-09-18</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-18/aldubmostawaiteddate.png" alt="#aldubmostawaiteddate" />
<figcaption><a href="https://twitter.com/search?q=%23aldubmostawaiteddate%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#aldubmostawaiteddate</a><br><a date1="2015-09-18" hashtag="aldubmostawaiteddate" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-18/aldubonemoreday.png" alt="#aldubonemoreday" />
<figcaption><a href="https://twitter.com/search?q=%23aldubonemoreday%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#aldubonemoreday</a><br><a date1="2015-09-18" hashtag="aldubonemoreday" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-18/allforlove.png" alt="#allforlove" />
<figcaption><a href="https://twitter.com/search?q=%23allforlove%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#allforlove</a><br><a></a>Score: 0.115</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-18/allforloveonitunes.png" alt="#allforloveonitunes" />
<figcaption><a href="https://twitter.com/search?q=%23allforloveonitunes%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#allforloveonitunes</a><br><a></a>Score: 0.025</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-18/badaber.png" alt="#badaber" />
<figcaption><a href="https://twitter.com/search?q=%23badaber%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#badaber</a><br><a></a>Score: 0.030</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-18/buyconfidentonitunes.png" alt="#buyconfidentonitunes" />
<figcaption><a href="https://twitter.com/search?q=%23buyconfidentonitunes%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#buyconfidentonitunes</a><br><a></a>Score: 0.048</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-18/buyconfidentonitunesnow.png" alt="#buyconfidentonitunesnow" />
<figcaption><a href="https://twitter.com/search?q=%23buyconfidentonitunesnow%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#buyconfidentonitunesnow</a><br><a></a>Score: 0.006</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-18/buytilithappenstoyouonitunes.png" alt="#buytilithappenstoyouonitunes" />
<figcaption><a href="https://twitter.com/search?q=%23buytilithappenstoyouonitunes%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#buytilithappenstoyouonitunes</a><br><a></a>Score: 0.097</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-18/denvskc.png" alt="#denvskc" />
<figcaption><a href="https://twitter.com/search?q=%23denvskc%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#denvskc</a><br><a></a>Score: 0.008</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-18/engvfij.png" alt="#engvfij" />
<figcaption><a href="https://twitter.com/search?q=%23engvfij%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#engvfij</a><br><a></a>Score: 0.116</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-18/germannuevovideo.png" alt="#germannuevovideo" />
<figcaption><a href="https://twitter.com/search?q=%23germannuevovideo%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#germannuevovideo</a><br><a></a>Score: -0.00</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-18/haydibismillah.png" alt="#haydibismillah" />
<figcaption><a href="https://twitter.com/search?q=%23haydibismillah%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#haydibismillah</a><br><a></a>Score: 0.148</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-18/iheartdemi.png" alt="#iheartdemi" />
<figcaption><a href="https://twitter.com/search?q=%23iheartdemi%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#iheartdemi</a><br><a></a>Score: 0.011</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-18/iheartradio.png" alt="#iheartradio" />
<figcaption><a href="https://twitter.com/search?q=%23iheartradio%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#iheartradio</a><br><a date1="2015-09-18" hashtag="iheartradio" id="some_other_id27" href="">Similar hashtags</a><br>Score: 0.016</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-18/istandwithpp.png" alt="#istandwithpp" />
<figcaption><a href="https://twitter.com/search?q=%23istandwithpp%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#istandwithpp</a><br><a></a>Score: 0.097</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-18/lovemelikeyou.png" alt="#lovemelikeyou" />
<figcaption><a href="https://twitter.com/search?q=%23lovemelikeyou%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#lovemelikeyou</a><br><a></a>Score: -0.02</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-09-18/nashsnewvideo.png" alt="#nashsnewvideo" />
<figcaption><a href="https://twitter.com/search?q=%23nashsnewvideo%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#nashsnewvideo</a><br><a date1="2015-09-18" hashtag="nashsnewvideo" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.026</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-09-18/rockinrio.png" alt="#rockinrio" />
<figcaption><a href="https://twitter.com/search?q=%23rockinrio%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#rockinrio</a><br><a></a>Score: 0.089</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-09-18/rockinrionomultishow.png" alt="#rockinrionomultishow" />
<figcaption><a href="https://twitter.com/search?q=%23rockinrionomultishow%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#rockinrionomultishow</a><br><a></a>Score: 0.103</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-09-18/rwc2015.png" alt="#rwc2015" />
<figcaption><a href="https://twitter.com/search?q=%23rwc2015%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#rwc2015</a><br><a date1="2015-09-18" hashtag="rwc2015" id="some_other_id39" href="">Similar hashtags</a><br>Score: 0.222</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-09-18/singaporegp.png" alt="#singaporegp" />
<figcaption><a href="https://twitter.com/search?q=%23singaporegp%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#singaporegp</a><br><a></a>Score: 0.050</figcaption>
</figure>
<figure tabindex="42">
<img src="../plots/2015-09-18/tcms.png" alt="#tcms" />
<figcaption><a href="https://twitter.com/search?q=%23tcms%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#tcms</a><br><a></a>Score: 0.053</figcaption>
</figure>
<figure tabindex="44">
<img src="../plots/2015-09-18/thenewbrokenscene.png" alt="#thenewbrokenscene" />
<figcaption><a href="https://twitter.com/search?q=%23thenewbrokenscene%20since%3A2015-09-17%20until%3A2015-09-18" target="_blank">#thenewbrokenscene</a><br><a></a>Score: 0.067</figcaption>
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