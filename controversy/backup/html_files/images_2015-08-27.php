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
        defaultDate: new Date(2015,7,27),
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
<h3> Trending hashtags from 2015-08-27</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-27/1989tourla.png" alt="#1989tourla" />
<figcaption><a href="https://twitter.com/search?q=%231989tourla%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#1989tourla</a><br><a date1="2015-08-27" hashtag="1989tourla" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.090</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-27/1daytilljanoskiansmovie.png" alt="#1daytilljanoskiansmovie" />
<figcaption><a href="https://twitter.com/search?q=%231daytilljanoskiansmovie%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#1daytilljanoskiansmovie</a><br><a date1="2015-08-27" hashtag="1daytilljanoskiansmovie" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.034</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-27/1dayuntilwhatdoyoumean.png" alt="#1dayuntilwhatdoyoumean" />
<figcaption><a href="https://twitter.com/search?q=%231dayuntilwhatdoyoumean%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#1dayuntilwhatdoyoumean</a><br><a date1="2015-08-27" hashtag="1dayuntilwhatdoyoumean" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.072</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-27/1dfansaregorgeous.png" alt="#1dfansaregorgeous" />
<figcaption><a href="https://twitter.com/search?q=%231dfansaregorgeous%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#1dfansaregorgeous</a><br><a date1="2015-08-27" hashtag="1dfansaregorgeous" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.134</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-27/5hmonstervideo.png" alt="#5hmonstervideo" />
<figcaption><a href="https://twitter.com/search?q=%235hmonstervideo%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#5hmonstervideo</a><br><a date1="2015-08-27" hashtag="5hmonstervideo" id="some_id9" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-27/aaronsnewvideo.png" alt="#aaronsnewvideo" />
<figcaption><a href="https://twitter.com/search?q=%23aaronsnewvideo%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#aaronsnewvideo</a><br><a date1="2015-08-27" hashtag="aaronsnewvideo" id="some_other_id11" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-27/bieberisback.png" alt="#bieberisback" />
<figcaption><a href="https://twitter.com/search?q=%23bieberisback%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#bieberisback</a><br><a date1="2015-08-27" hashtag="bieberisback" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.230</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-27/buywhatdoyoumeantomorrow.png" alt="#buywhatdoyoumeantomorrow" />
<figcaption><a href="https://twitter.com/search?q=%23buywhatdoyoumeantomorrow%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#buywhatdoyoumeantomorrow</a><br><a date1="2015-08-27" hashtag="buywhatdoyoumeantomorrow" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.150</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-27/bvbodd.png" alt="#bvbodd" />
<figcaption><a href="https://twitter.com/search?q=%23bvbodd%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#bvbodd</a><br><a date1="2015-08-27" hashtag="bvbodd" id="some_other_id17" href="">Similar hashtags</a><br>Score: -0.01</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-27/gobackkejriwal.png" alt="#gobackkejriwal" />
<figcaption><a href="https://twitter.com/search?q=%23gobackkejriwal%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#gobackkejriwal</a><br><a date1="2015-08-27" hashtag="gobackkejriwal" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.039</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-27/hayesdwts.png" alt="#hayesdwts" />
<figcaption><a href="https://twitter.com/search?q=%23hayesdwts%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#hayesdwts</a><br><a date1="2015-08-27" hashtag="hayesdwts" id="some_other_id21" href="">Similar hashtags</a><br>Score: -0.01</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-27/jetblackheart.png" alt="#jetblackheart" />
<figcaption><a href="https://twitter.com/search?q=%23jetblackheart%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#jetblackheart</a><br><a date1="2015-08-27" hashtag="jetblackheart" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.120</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-08-27/littlemixhair.png" alt="#littlemixhair" />
<figcaption><a href="https://twitter.com/search?q=%23littlemixhair%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#littlemixhair</a><br><a date1="2015-08-27" hashtag="littlemixhair" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.120</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-08-27/msg2trailerlaunch.png" alt="#msg2trailerlaunch" />
<figcaption><a href="https://twitter.com/search?q=%23msg2trailerlaunch%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#msg2trailerlaunch</a><br><a date1="2015-08-27" hashtag="msg2trailerlaunch" id="some_other_id27" href="">Similar hashtags</a><br>Score: 0.063</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-08-27/otracleveland.png" alt="#otracleveland" />
<figcaption><a href="https://twitter.com/search?q=%23otracleveland%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#otracleveland</a><br><a date1="2015-08-27" hashtag="otracleveland" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.089</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-08-27/sheskindahotep.png" alt="#sheskindahotep" />
<figcaption><a href="https://twitter.com/search?q=%23sheskindahotep%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#sheskindahotep</a><br><a date1="2015-08-27" hashtag="sheskindahotep" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.110</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-08-27/tipsforyear7s.png" alt="#tipsforyear7s" />
<figcaption><a href="https://twitter.com/search?q=%23tipsforyear7s%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#tipsforyear7s</a><br><a date1="2015-08-27" hashtag="tipsforyear7s" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.219</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-08-27/uefabestplayer.png" alt="#uefabestplayer" />
<figcaption><a href="https://twitter.com/search?q=%23uefabestplayer%20since%3A2015-08-26%20until%3A2015-08-27" target="_blank">#uefabestplayer</a><br><a date1="2015-08-27" hashtag="uefabestplayer" id="some_other_id35" href="">Similar hashtags</a><br>Score: 0.061</figcaption>
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