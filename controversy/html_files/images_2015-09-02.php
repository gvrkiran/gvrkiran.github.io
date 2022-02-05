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
        defaultDate: new Date(2015,8,02),
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
<h3> Trending hashtags from 2015-09-02</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-02/10classpm.png" alt="#10classpm" />
<figcaption><a href="https://twitter.com/search?q=%2310classpm%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#10classpm</a><br><a></a>Score: 0.084</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-02/5heuropeanannouncement.png" alt="#5heuropeanannouncement" />
<figcaption><a href="https://twitter.com/search?q=%235heuropeanannouncement%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#5heuropeanannouncement</a><br><a date1="2015-09-02" hashtag="5heuropeanannouncement" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.033</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-02/beliebercospeguinaticaengole.png" alt="#beliebercospeguinaticaengole" />
<figcaption><a href="https://twitter.com/search?q=%23beliebercospeguinaticaengole%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#beliebercospeguinaticaengole</a><br><a date1="2015-09-02" hashtag="beliebercospeguinaticaengole" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.076</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-02/change5soslyricstofries.png" alt="#change5soslyricstofries" />
<figcaption><a href="https://twitter.com/search?q=%23change5soslyricstofries%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#change5soslyricstofries</a><br><a date1="2015-09-02" hashtag="change5soslyricstofries" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.132</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-02/doitright.png" alt="#doitright" />
<figcaption><a href="https://twitter.com/search?q=%23doitright%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#doitright</a><br><a date1="2015-09-02" hashtag="doitright" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.037</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-02/dwts.png" alt="#dwts" />
<figcaption><a href="https://twitter.com/search?q=%23dwts%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#dwts</a><br><a></a>Score: 0.025</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-02/freddiegray.png" alt="#freddiegray" />
<figcaption><a href="https://twitter.com/search?q=%23freddiegray%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#freddiegray</a><br><a></a>Score: 0.068</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-02/gbbo.png" alt="#gbbo" />
<figcaption><a href="https://twitter.com/search?q=%23gbbo%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#gbbo</a><br><a date1="2015-09-02" hashtag="gbbo" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.063</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-02/iwishicouldforget.png" alt="#iwishicouldforget" />
<figcaption><a href="https://twitter.com/search?q=%23iwishicouldforget%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#iwishicouldforget</a><br><a></a>Score: 0.121</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-02/masterchefbr.png" alt="#masterchefbr" />
<figcaption><a href="https://twitter.com/search?q=%23masterchefbr%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#masterchefbr</a><br><a></a>Score: 0.042</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-02/missionaryterror.png" alt="#missionaryterror" />
<figcaption><a href="https://twitter.com/search?q=%23missionaryterror%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#missionaryterror</a><br><a></a>Score: 0.070</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-02/otraphilly.png" alt="#otraphilly" />
<figcaption><a href="https://twitter.com/search?q=%23otraphilly%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#otraphilly</a><br><a date1="2015-09-02" hashtag="otraphilly" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-02/psyunahansakatotohanan.png" alt="#psyunahansakatotohanan" />
<figcaption><a href="https://twitter.com/search?q=%23psyunahansakatotohanan%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#psyunahansakatotohanan</a><br><a></a>Score: -0.01</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-02/rowysojonesbeach.png" alt="#rowysojonesbeach" />
<figcaption><a href="https://twitter.com/search?q=%23rowysojonesbeach%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#rowysojonesbeach</a><br><a></a>Score: 0.039</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-02/streamwhatdoyoumean.png" alt="#streamwhatdoyoumean" />
<figcaption><a href="https://twitter.com/search?q=%23streamwhatdoyoumean%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#streamwhatdoyoumean</a><br><a></a>Score: 0.135</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-02/tercerinforme.png" alt="#tercerinforme" />
<figcaption><a href="https://twitter.com/search?q=%23tercerinforme%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#tercerinforme</a><br><a></a>Score: 0.147</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-09-02/watchwithluke.png" alt="#watchwithluke" />
<figcaption><a href="https://twitter.com/search?q=%23watchwithluke%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#watchwithluke</a><br><a></a>Score: -0.01</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-09-02/weknowthetruth.png" alt="#weknowthetruth" />
<figcaption><a href="https://twitter.com/search?q=%23weknowthetruth%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#weknowthetruth</a><br><a date1="2015-09-02" hashtag="weknowthetruth" id="some_other_id35" href="">Similar hashtags</a><br>Score: 0.097</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-09-02/zaynfeatnickiminaj.png" alt="#zaynfeatnickiminaj" />
<figcaption><a href="https://twitter.com/search?q=%23zaynfeatnickiminaj%20since%3A2015-09-01%20until%3A2015-09-02" target="_blank">#zaynfeatnickiminaj</a><br><a date1="2015-09-02" hashtag="zaynfeatnickiminaj" id="some_other_id37" href="">Similar hashtags</a><br>Score: 0.092</figcaption>
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