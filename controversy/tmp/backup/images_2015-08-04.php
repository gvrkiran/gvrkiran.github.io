<?php
$date = isset($_GET['date']) ? $_GET['date'] : '2015-06-25';
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
<title>Quantifying Controversy in Social Media</title>
<link rel='stylesheet' type='text/css' href='css/style.css' />
</head>
<body>
<br>
<h1>Quantifying Controversy in Social Media</h1>
<hr/><h3>&nbsp;&nbsp;&nbsp;&nbsp; <a href='about.html' target='_blank'>About</a> &nbsp;&nbsp;&nbsp;<a href='examples.html' target='_blank'>Examples</a></h3><hr>
<div id="container" style="width:100%;">

  <div id="left" style="float:left;width:180px;">
  <?php
        if($prev_date!="")
                echo "<a href=\"../plots/images_$prev_date.php?date=$prev_date\" style=\"font-size:30px;font-style:bold\">Previous Day</a>";
  ?>
  </div>
    <div id="right" style="float:right;width:180px;">
  <?php
        if($next_date!="")
                echo "<a href=\"../plots/images_$next_date.php?date=$next_date\" style=\"font-size:30px;font-style:bold\">Next Day</a>";
  ?>
    </div>
<div id="page-wrap">
<h3>2015-08-04</h3>
<section class="image-gallery group">
<figure tabindex="1">
<img src="../plots/2015-08-04/camsnapchatart.png" alt="#camsnapchatart" />
<figcaption><a href="https://twitter.com/search?q=%23camsnapchatart%20since%3A2015-08-03%20until%3A2015-08-04" target="_blank">#camsnapchatart</a></figcaption>
</figure>
<figure tabindex="2">
<img src="../plots/2015-08-04/congratslouis.png" alt="#congratslouis" />
<figcaption><a href="https://twitter.com/search?q=%23congratslouis%20since%3A2015-08-03%20until%3A2015-08-04" target="_blank">#congratslouis</a></figcaption>
</figure>
<figure tabindex="3">
<img src="../plots/2015-08-04/prettylittleliars.png" alt="#prettylittleliars" />
<figcaption><a href="https://twitter.com/search?q=%23prettylittleliars%20since%3A2015-08-03%20until%3A2015-08-04" target="_blank">#prettylittleliars</a></figcaption>
</figure>
<figure tabindex="4">
<img src="../plots/2015-08-04/respectliam.png" alt="#respectliam" />
<figcaption><a href="https://twitter.com/search?q=%23respectliam%20since%3A2015-08-03%20until%3A2015-08-04" target="_blank">#respectliam</a></figcaption>
</figure>
<figure tabindex="5">
<img src="../plots/2015-08-04/xboxgamescom.png" alt="#xboxgamescom" />
<figcaption><a href="https://twitter.com/search?q=%23xboxgamescom%20since%3A2015-08-03%20until%3A2015-08-04" target="_blank">#xboxgamescom</a></figcaption>
</figure>
</section>
</div>
<hr>
<p>Built using a template from https://css-tricks.com/expanding-images-html5/</p>
</body>
</html>