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
        defaultDate: new Date(2015,7,22),
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
<h3> Trending hashtags from 2015-08-22</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-08-22/1989tourla.png" alt="#1989tourla" />
<figcaption><a href="https://twitter.com/search?q=%231989tourla%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#1989tourla</a><br><a date1="2015-08-22" hashtag="1989tourla" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.061</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-22/absaprem.png" alt="#absaprem" />
<figcaption><a href="https://twitter.com/search?q=%23absaprem%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#absaprem</a><br><a date1="2015-08-22" hashtag="absaprem" id="some_other_id3" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-22/aldubagainstallodds.png" alt="#aldubagainstallodds" />
<figcaption><a href="https://twitter.com/search?q=%23aldubagainstallodds%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#aldubagainstallodds</a><br><a date1="2015-08-22" hashtag="aldubagainstallodds" id="some_id5" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-08-22/askheyviolet.png" alt="#askheyviolet" />
<figcaption><a href="https://twitter.com/search?q=%23askheyviolet%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#askheyviolet</a><br><a date1="2015-08-22" hashtag="askheyviolet" id="some_other_id7" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-08-22/beijing2015.png" alt="#beijing2015" />
<figcaption><a href="https://twitter.com/search?q=%23beijing2015%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#beijing2015</a><br><a date1="2015-08-22" hashtag="beijing2015" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.107</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-08-22/belgiangp.png" alt="#belgiangp" />
<figcaption><a href="https://twitter.com/search?q=%23belgiangp%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#belgiangp</a><br><a date1="2015-08-22" hashtag="belgiangp" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.028</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-08-22/deshdrohimedia.png" alt="#deshdrohimedia" />
<figcaption><a href="https://twitter.com/search?q=%23deshdrohimedia%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#deshdrohimedia</a><br><a date1="2015-08-22" hashtag="deshdrohimedia" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.038</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-08-22/dragmedownvevorecord.png" alt="#dragmedownvevorecord" />
<figcaption><a href="https://twitter.com/search?q=%23dragmedownvevorecord%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#dragmedownvevorecord</a><br><a date1="2015-08-22" hashtag="dragmedownvevorecord" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.075</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-08-22/focusonmeiscoming.png" alt="#focusonmeiscoming" />
<figcaption><a href="https://twitter.com/search?q=%23focusonmeiscoming%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#focusonmeiscoming</a><br><a date1="2015-08-22" hashtag="focusonmeiscoming" id="some_other_id17" href="">Similar hashtags</a><br>Score: 0.056</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-08-22/heidenau.png" alt="#heidenau" />
<figcaption><a href="https://twitter.com/search?q=%23heidenau%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#heidenau</a><br><a date1="2015-08-22" hashtag="heidenau" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.016</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-08-22/heidenau2208.png" alt="#heidenau2208" />
<figcaption><a href="https://twitter.com/search?q=%23heidenau2208%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#heidenau2208</a><br><a date1="2015-08-22" hashtag="heidenau2208" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.063</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-08-22/llsyoutube.png" alt="#llsyoutube" />
<figcaption><a href="https://twitter.com/search?q=%23llsyoutube%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#llsyoutube</a><br><a date1="2015-08-22" hashtag="llsyoutube" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.007</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-08-22/mmkgaycharming.png" alt="#mmkgaycharming" />
<figcaption><a href="https://twitter.com/search?q=%23mmkgaycharming%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#mmkgaycharming</a><br><a date1="2015-08-22" hashtag="mmkgaycharming" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.040</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-08-22/munnew.png" alt="#munnew" />
<figcaption><a href="https://twitter.com/search?q=%23munnew%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#munnew</a><br><a date1="2015-08-22" hashtag="munnew" id="some_other_id27" href="">Similar hashtags</a><br>Score: 0.104</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-08-22/na122.png" alt="#na122" />
<figcaption><a href="https://twitter.com/search?q=%23na122%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#na122</a><br><a date1="2015-08-22" hashtag="na122" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.028</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-08-22/nufc.png" alt="#nufc" />
<figcaption><a href="https://twitter.com/search?q=%23nufc%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#nufc</a><br><a date1="2015-08-22" hashtag="nufc" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.027</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-08-22/protestpp.png" alt="#protestpp" />
<figcaption><a href="https://twitter.com/search?q=%23protestpp%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#protestpp</a><br><a date1="2015-08-22" hashtag="protestpp" id="some_other_id33" href="">Similar hashtags</a><br>Score: 0.165</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-08-22/sabadodeganarseguidores.png" alt="#sabadodeganarseguidores" />
<figcaption><a href="https://twitter.com/search?q=%23sabadodeganarseguidores%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#sabadodeganarseguidores</a><br><a date1="2015-08-22" hashtag="sabadodeganarseguidores" id="some_other_id35" href="">Similar hashtags</a><br>Score: 0.101</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-08-22/saturdaynightonline.png" alt="#saturdaynightonline" />
<figcaption><a href="https://twitter.com/search?q=%23saturdaynightonline%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#saturdaynightonline</a><br><a date1="2015-08-22" hashtag="saturdaynightonline" id="some_other_id37" href="">Similar hashtags</a><br>Score: 0.074</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-08-22/thalys.png" alt="#thalys" />
<figcaption><a href="https://twitter.com/search?q=%23thalys%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#thalys</a><br><a date1="2015-08-22" hashtag="thalys" id="some_id39" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-08-22/tsgfcb.png" alt="#tsgfcb" />
<figcaption><a href="https://twitter.com/search?q=%23tsgfcb%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#tsgfcb</a><br><a date1="2015-08-22" hashtag="tsgfcb" id="some_other_id41" href="">Similar hashtags</a><br>Score: 0.118</figcaption>
</figure>
<figure tabindex="42">
<img src="../plots/2015-08-22/tvk2semis.png" alt="#tvk2semis" />
<figcaption><a href="https://twitter.com/search?q=%23tvk2semis%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#tvk2semis</a><br><a date1="2015-08-22" hashtag="tvk2semis" id="some_other_id43" href="">Similar hashtags</a><br>Score: 0.086</figcaption>
</figure>
<figure tabindex="44">
<img src="../plots/2015-08-22/welcometomanilaarianagrande.png" alt="#welcometomanilaarianagrande" />
<figcaption><a href="https://twitter.com/search?q=%23welcometomanilaarianagrande%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#welcometomanilaarianagrande</a><br><a date1="2015-08-22" hashtag="welcometomanilaarianagrande" id="some_other_id45" href="">Similar hashtags</a><br>Score: 0.094</figcaption>
</figure>
<figure tabindex="46">
<img src="../plots/2015-08-22/weloveyoumisha.png" alt="#weloveyoumisha" />
<figcaption><a href="https://twitter.com/search?q=%23weloveyoumisha%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#weloveyoumisha</a><br><a date1="2015-08-22" hashtag="weloveyoumisha" id="some_other_id47" href="">Similar hashtags</a><br>Score: 0.203</figcaption>
</figure>
<figure tabindex="48">
<img src="../plots/2015-08-22/whufc.png" alt="#whufc" />
<figcaption><a href="https://twitter.com/search?q=%23whufc%20since%3A2015-08-21%20until%3A2015-08-22" target="_blank">#whufc</a><br><a date1="2015-08-22" hashtag="whufc" id="some_id49" href="">Example Tweets</a><br>Score: 0.316</figcaption>
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