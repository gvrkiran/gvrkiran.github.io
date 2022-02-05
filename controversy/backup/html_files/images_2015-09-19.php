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
        defaultDate: new Date(2015,8,19),
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
<h3> Trending hashtags from 2015-09-19</h3>
<section class="image-gallery group">
<figure tabindex="0">
<img src="../plots/2015-09-19/2yearsofwhereveryouare.png" alt="#2yearsofwhereveryouare" />
<figcaption><a href="https://twitter.com/search?q=%232yearsofwhereveryouare%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#2yearsofwhereveryouare</a><br><a date1="2015-09-19" hashtag="2yearsofwhereveryouare" id="some_other_id1" href="">Similar hashtags</a><br>Score: 0.179</figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-09-19/biharwithrg.png" alt="#biharwithrg" />
<figcaption><a href="https://twitter.com/search?q=%23biharwithrg%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#biharwithrg</a><br><a date1="2015-09-19" hashtag="biharwithrg" id="some_other_id3" href="">Similar hashtags</a><br>Score: 0.028</figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-09-19/buyconfidentbydemilovato.png" alt="#buyconfidentbydemilovato" />
<figcaption><a href="https://twitter.com/search?q=%23buyconfidentbydemilovato%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#buyconfidentbydemilovato</a><br><a date1="2015-09-19" hashtag="buyconfidentbydemilovato" id="some_other_id5" href="">Similar hashtags</a><br>Score: 0.000</figcaption>
</figure>
<figure tabindex="6">
<img src="../plots/2015-09-19/cfcvafc.png" alt="#cfcvafc" />
<figcaption><a href="https://twitter.com/search?q=%23cfcvafc%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#cfcvafc</a><br><a date1="2015-09-19" hashtag="cfcvafc" id="some_other_id7" href="">Similar hashtags</a><br>Score: 0.052</figcaption>
</figure>
<figure tabindex="8">
<img src="../plots/2015-09-19/chears.png" alt="#chears" />
<figcaption><a href="https://twitter.com/search?q=%23chears%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#chears</a><br><a date1="2015-09-19" hashtag="chears" id="some_other_id9" href="">Similar hashtags</a><br>Score: 0.230</figcaption>
</figure>
<figure tabindex="10">
<img src="../plots/2015-09-19/d98fcb.png" alt="#d98fcb" />
<figcaption><a href="https://twitter.com/search?q=%23d98fcb%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#d98fcb</a><br><a date1="2015-09-19" hashtag="d98fcb" id="some_other_id11" href="">Similar hashtags</a><br>Score: 0.050</figcaption>
</figure>
<figure tabindex="12">
<img src="../plots/2015-09-19/eldebat6.png" alt="#eldebat6" />
<figcaption><a href="https://twitter.com/search?q=%23eldebat6%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#eldebat6</a><br><a date1="2015-09-19" hashtag="eldebat6" id="some_other_id13" href="">Similar hashtags</a><br>Score: 0.229</figcaption>
</figure>
<figure tabindex="14">
<img src="../plots/2015-09-19/fraita.png" alt="#fraita" />
<figcaption><a href="https://twitter.com/search?q=%23fraita%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#fraita</a><br><a date1="2015-09-19" hashtag="fraita" id="some_other_id15" href="">Similar hashtags</a><br>Score: 0.110</figcaption>
</figure>
<figure tabindex="16">
<img src="../plots/2015-09-19/iheartradio.png" alt="#iheartradio" />
<figcaption><a href="https://twitter.com/search?q=%23iheartradio%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#iheartradio</a><br><a date1="2015-09-19" hashtag="iheartradio" id="some_id17" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="18">
<img src="../plots/2015-09-19/iheartshawnmendes.png" alt="#iheartshawnmendes" />
<figcaption><a href="https://twitter.com/search?q=%23iheartshawnmendes%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#iheartshawnmendes</a><br><a date1="2015-09-19" hashtag="iheartshawnmendes" id="some_other_id19" href="">Similar hashtags</a><br>Score: 0.020</figcaption>
</figure>
<figure tabindex="20">
<img src="../plots/2015-09-19/irevcan.png" alt="#irevcan" />
<figcaption><a href="https://twitter.com/search?q=%23irevcan%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#irevcan</a><br><a date1="2015-09-19" hashtag="irevcan" id="some_other_id21" href="">Similar hashtags</a><br>Score: 0.216</figcaption>
</figure>
<figure tabindex="22">
<img src="../plots/2015-09-19/mciwhu.png" alt="#mciwhu" />
<figcaption><a href="https://twitter.com/search?q=%23mciwhu%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#mciwhu</a><br><a date1="2015-09-19" hashtag="mciwhu" id="some_other_id23" href="">Similar hashtags</a><br>Score: 0.070</figcaption>
</figure>
<figure tabindex="24">
<img src="../plots/2015-09-19/mtvfanwarsharmonizers.png" alt="#mtvfanwarsharmonizers" />
<figcaption><a href="https://twitter.com/search?q=%23mtvfanwarsharmonizers%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#mtvfanwarsharmonizers</a><br><a date1="2015-09-19" hashtag="mtvfanwarsharmonizers" id="some_other_id25" href="">Similar hashtags</a><br>Score: 0.052</figcaption>
</figure>
<figure tabindex="26">
<img src="../plots/2015-09-19/pulimostlikedindiantrailer.png" alt="#pulimostlikedindiantrailer" />
<figcaption><a href="https://twitter.com/search?q=%23pulimostlikedindiantrailer%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#pulimostlikedindiantrailer</a><br><a date1="2015-09-19" hashtag="pulimostlikedindiantrailer" id="some_other_id27" href="">Similar hashtags</a><br>Score: -0.00</figcaption>
</figure>
<figure tabindex="28">
<img src="../plots/2015-09-19/queennomultishow.png" alt="#queennomultishow" />
<figcaption><a href="https://twitter.com/search?q=%23queennomultishow%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#queennomultishow</a><br><a date1="2015-09-19" hashtag="queennomultishow" id="some_other_id29" href="">Similar hashtags</a><br>Score: 0.098</figcaption>
</figure>
<figure tabindex="30">
<img src="../plots/2015-09-19/rsavjpn.png" alt="#rsavjpn" />
<figcaption><a href="https://twitter.com/search?q=%23rsavjpn%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#rsavjpn</a><br><a date1="2015-09-19" hashtag="rsavjpn" id="some_other_id31" href="">Similar hashtags</a><br>Score: 0.133</figcaption>
</figure>
<figure tabindex="32">
<img src="../plots/2015-09-19/rwc2015.png" alt="#rwc2015" />
<figcaption><a href="https://twitter.com/search?q=%23rwc2015%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#rwc2015</a><br><a date1="2015-09-19" hashtag="rwc2015" id="some_id33" href="">Example Tweets</a><br>Score: 0.0</figcaption>
</figure>
<figure tabindex="34">
<img src="../plots/2015-09-19/sabadodeganarseguidores.png" alt="#sabadodeganarseguidores" />
<figcaption><a href="https://twitter.com/search?q=%23sabadodeganarseguidores%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#sabadodeganarseguidores</a><br><a date1="2015-09-19" hashtag="sabadodeganarseguidores" id="some_other_id35" href="">Similar hashtags</a><br>Score: 0.103</figcaption>
</figure>
<figure tabindex="36">
<img src="../plots/2015-09-19/saturdaynightonline.png" alt="#saturdaynightonline" />
<figcaption><a href="https://twitter.com/search?q=%23saturdaynightonline%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#saturdaynightonline</a><br><a date1="2015-09-19" hashtag="saturdaynightonline" id="some_other_id37" href="">Similar hashtags</a><br>Score: 0.150</figcaption>
</figure>
<figure tabindex="38">
<img src="../plots/2015-09-19/singaporegp.png" alt="#singaporegp" />
<figcaption><a href="https://twitter.com/search?q=%23singaporegp%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#singaporegp</a><br><a date1="2015-09-19" hashtag="singaporegp" id="some_other_id39" href="">Similar hashtags</a><br>Score: 0.021</figcaption>
</figure>
<figure tabindex="40">
<img src="../plots/2015-09-19/thankyouzaynforcomingback.png" alt="#thankyouzaynforcomingback" />
<figcaption><a href="https://twitter.com/search?q=%23thankyouzaynforcomingback%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#thankyouzaynforcomingback</a><br><a date1="2015-09-19" hashtag="thankyouzaynforcomingback" id="some_other_id41" href="">Similar hashtags</a><br>Score: 0.161</figcaption>
</figure>
<figure tabindex="42">
<img src="../plots/2015-09-19/whatdidzoeysay.png" alt="#whatdidzoeysay" />
<figcaption><a href="https://twitter.com/search?q=%23whatdidzoeysay%20since%3A2015-09-18%20until%3A2015-09-19" target="_blank">#whatdidzoeysay</a><br><a date1="2015-09-19" hashtag="whatdidzoeysay" id="some_id43" href="">Example Tweets</a><br>Score: 0.0</figcaption>
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