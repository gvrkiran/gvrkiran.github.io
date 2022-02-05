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
        defaultDate: new Date(2015,8,17),
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
<h3> Trending hashtags from 2015-09-17</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-17/5sosmoney.png" alt="#5sosmoney" />
<figcaption><a href="https://twitter.com/search?q=%235sosmoney%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#5sosmoney</a><br><a date1="2015-09-17" hashtag="5sosmoney" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.189</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-17/adnanmenderes.png" alt="#adnanmenderes" />
<figcaption><a href="https://twitter.com/search?q=%23adnanmenderes%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#adnanmenderes</a><br><a date1="2015-09-17" hashtag="adnanmenderes" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.172</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-17/aldubonemoreday.png" alt="#aldubonemoreday" />
<figcaption><a href="https://twitter.com/search?q=%23aldubonemoreday%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#aldubonemoreday</a><br><a date1="2015-09-17" hashtag="aldubonemoreday" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.030</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-17/allforlove9hours.png" alt="#allforlove9hours" />
<figcaption><a href="https://twitter.com/search?q=%23allforlove9hours%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#allforlove9hours</a><br><a date1="2015-09-17" hashtag="allforlove9hours" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.030</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-17/bbcqt.png" alt="#bbcqt" />
<figcaption><a href="https://twitter.com/search?q=%23bbcqt%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#bbcqt</a><br><a date1="2015-09-17" hashtag="bbcqt" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.068</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-17/burkinafaso.png" alt="#burkinafaso" />
<figcaption><a href="https://twitter.com/search?q=%23burkinafaso%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#burkinafaso</a><br><a date1="2015-09-17" hashtag="burkinafaso" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.115</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-17/bvbfkk.png" alt="#bvbfkk" />
<figcaption><a href="https://twitter.com/search?q=%23bvbfkk%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#bvbfkk</a><br><a date1="2015-09-17" hashtag="bvbfkk" id="some_other_id13" href="">Similar hashtags</a><br>Score: -0.01</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-17/chile.png" alt="#chile" />
<figcaption><a href="https://twitter.com/search?q=%23chile%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#chile</a><br><a date1="2015-09-17" hashtag="chile" id="some_id15" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-17/confidentsingletomorrow.png" alt="#confidentsingletomorrow" />
<figcaption><a href="https://twitter.com/search?q=%23confidentsingletomorrow%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#confidentsingletomorrow</a><br><a date1="2015-09-17" hashtag="confidentsingletomorrow" id="some_other_id17" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-17/debat8aldia.png" alt="#debat8aldia" />
<figcaption><a href="https://twitter.com/search?q=%23debat8aldia%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#debat8aldia</a><br><a date1="2015-09-17" hashtag="debat8aldia" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.108</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-17/eurobasket2015.png" alt="#eurobasket2015" />
<figcaption><a href="https://twitter.com/search?q=%23eurobasket2015%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#eurobasket2015</a><br><a date1="2015-09-17" hashtag="eurobasket2015" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.207</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-17/gala2gh16.png" alt="#gala2gh16" />
<figcaption><a href="https://twitter.com/search?q=%23gala2gh16%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#gala2gh16</a><br><a date1="2015-09-17" hashtag="gala2gh16" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.061</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-17/happybdaypm.png" alt="#happybdaypm" />
<figcaption><a href="https://twitter.com/search?q=%23happybdaypm%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#happybdaypm</a><br><a date1="2015-09-17" hashtag="happybdaypm" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.016</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-17/ios9.png" alt="#ios9" />
<figcaption><a href="https://twitter.com/search?q=%23ios9%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#ios9</a><br><a date1="2015-09-17" hashtag="ios9" id="some_other_id27" href="">Similar hashtags</a><br>Score: 0.129</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-17/itspastillastime.png" alt="#itspastillastime" />
<figcaption><a href="https://twitter.com/search?q=%23itspastillastime%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#itspastillastime</a><br><a date1="2015-09-17" hashtag="itspastillastime" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.009</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-17/money5sos.png" alt="#money5sos" />
<figcaption><a href="https://twitter.com/search?q=%23money5sos%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#money5sos</a><br><a date1="2015-09-17" hashtag="money5sos" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.080</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-09-17/msg2comingtomorrow.png" alt="#msg2comingtomorrow" />
<figcaption><a href="https://twitter.com/search?q=%23msg2comingtomorrow%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#msg2comingtomorrow</a><br><a date1="2015-09-17" hashtag="msg2comingtomorrow" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.024</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-09-17/msg2todayincinemas.png" alt="#msg2todayincinemas" />
<figcaption><a href="https://twitter.com/search?q=%23msg2todayincinemas%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#msg2todayincinemas</a><br><a date1="2015-09-17" hashtag="msg2todayincinemas" id="some_other_id35" href="">Similar hashtags</a><br>Score: 0.078</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-09-17/provadefogo.png" alt="#provadefogo" />
<figcaption><a href="https://twitter.com/search?q=%23provadefogo%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#provadefogo</a><br><a date1="2015-09-17" hashtag="provadefogo" id="some_other_id37" href="">Similar hashtags</a><br>Score: 0.010</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-09-17/quierensacardelaireac5n.png" alt="#quierensacardelaireac5n" />
<figcaption><a href="https://twitter.com/search?q=%23quierensacardelaireac5n%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#quierensacardelaireac5n</a><br><a date1="2015-09-17" hashtag="quierensacardelaireac5n" id="some_other_id39" href="">Similar hashtags</a><br>Score: 0.066</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-09-17/shareacoke.png" alt="#shareacoke" />
<figcaption><a href="https://twitter.com/search?q=%23shareacoke%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#shareacoke</a><br><a date1="2015-09-17" hashtag="shareacoke" id="some_other_id41" href="">Similar hashtags</a><br>Score: 0.094</figcaption>
</figure>
<figure tabindex="42">
<img src="../plots/2015-09-17/thebachelorau.png" alt="#thebachelorau" />
<figcaption><a href="https://twitter.com/search?q=%23thebachelorau%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#thebachelorau</a><br><a date1="2015-09-17" hashtag="thebachelorau" id="some_other_id43" href="">Similar hashtags</a><br>Score: 0.010</figcaption>
</figure>
<figure tabindex="44">
<img src="../plots/2015-09-17/thenewbokenscene.png" alt="#thenewbokenscene" />
<figcaption><a href="https://twitter.com/search?q=%23thenewbokenscene%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#thenewbokenscene</a><br><a date1="2015-09-17" hashtag="thenewbokenscene" id="some_other_id45" href="">Similar hashtags</a><br>Score: 0.142</figcaption>
</figure>
<figure tabindex="46">
<img src="../plots/2015-09-17/thenewbrokenscene.png" alt="#thenewbrokenscene" />
<figcaption><a href="https://twitter.com/search?q=%23thenewbrokenscene%20since%3A2015-09-16%20until%3A2015-09-17" target="_blank">#thenewbrokenscene</a><br><a date1="2015-09-17" hashtag="thenewbrokenscene" id="some_id47" href="">Example Tweets</a><br>Score: 0.0</figcaption>
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