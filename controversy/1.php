<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "[http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd](http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd)">
<html xmlns="[http://www.w3.org/1999/xhtml](http://www.w3.org/1999/xhtml)">
<head>
<title>Exploring Controversy on Twitter</title>
<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
<link rel='stylesheet' type='text/css' href='css/style.css' />
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script>
$(document).ready(function(){

  $("[id^=some_id]").click(function(e){
    e.preventDefault();
//    alert( $(this).attr("id") );
    $.get("get_example_tweets_baseline.php", {hashtag:$(this).attr("hashtag")}, function(data){
	    console.log(data);
        $("#exampletweets").html(data);
    });
  });

});
</script>

<style type="text/css">



</style>
</head>

<body>
<br>

<h1>Exploring Controversy on Twitter</h1>
<hr/><h3>&nbsp;&nbsp;&nbsp;&nbsp; <a href='https://users.ics.aalto.fi/kiran/controversy/about.php'>About</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/index.php'>Examples</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-06-25.php'>Trending hashtags</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/table.php'>Table</a></h3><hr>

<div class="container3">

    <div class="content3">
	
<div id="page-wrap">
    	<h2>&nbsp;&nbsp;Controversial Hashtags</h2>
<section class="image-gallery group">
<figure tabindex="251">
<img src="plots/beefban.png" alt="#beefban" />
<figcaption><a href="https://twitter.com/search?q=%23beefban%20since%3A2015-03-02%20until%3A2015-03-06" target="_blank">#beefban</a><br><a hashtag="beefban" id="some_id1" href="">Example Tweets</a><br>Score: 0.78</figcaption>
</figure>
<figure tabindex="252">
<img src="plots/russia_march.png" alt="#russia_march" />
<figcaption><a href="https://twitter.com/search?q=%23march%20since%3A2015-03-01%20until%3A2015-03-03" target="_blank">#russia_march</a><br><a hashtag="russia_march" id="some_id2" href="">Example Tweets</a><br>Score: 0.84</figcaption>
</figure>
<figure tabindex="253">
<img src="plots/netanyahu.png" alt="#netanyahuspeech" />
<figcaption><a href="https://twitter.com/search?q=%23netanyahuspeech%20since%3A2015-06-24%20until%3A2015-06-25" target="_blank">#netanyahuspeech</a><br><a hashtag="netanyahuspeech" id="some_id3" href="">Example Tweets</a><br>Score: 0.62</figcaption>
</figure>
</section>
<section class="image-gallery group">
<figure tabindex="254">
<img src="plots/nemtsov.png" alt="#nemtsov" />
<figcaption><a href="https://twitter.com/search?q=%23nemtsov%20since%3A2015-02-28%20until%3A2015-03-03" target="_blank">#nemtsov</a><br><a hashtag="nemtsov" id="some_id4" href="">Example Tweets</a><br>Score: 0.73</figcaption>
</figure>
<figure tabindex="255">
<img src="plots/indiana.png" alt="#indiana" />
<figcaption><a href="https://twitter.com/search?q=%23indiana%20since%3A2015-04-02%20until%3A2015-04-06" target="_blank">#indiana</a><br><a hashtag="indiana" id="some_id5" href="">Example Tweets</a><br>Score: 0.76</figcaption>
</figure>

</section>
    </div>
    </div>
    <div class="sidebar3">
<div id="page-wrap">
    	<h2>Non-Controversial Hashtags</h2>
<section class="image-gallery group">
<figure tabindex="256">
<img src="plots/onedirection.png" alt="#1dfamheretostay" />
<figcaption><a href="https://twitter.com/search?q=%231dfamheretostay%20since%3A2015-03-27%20until%3A2015-03-30" target="_blank">#1dfamheretostay</a><br><a hashtag="onedirection" id="some_id6" href="">Example Tweets</a><br>Score: 0.33</figcaption>
</figure>
<figure tabindex="257">
<img src="plots/sxsw.png" alt="#sxsw" />
<figcaption><a href="https://twitter.com/search?q=%23sxsw%20since%3A2015-03-13%20until%3A2015-03-23" target="_blank">#sxsw</a><br><a hashtag="sxsw" id="some_id7" href="">Example Tweets</a><br>Score: 0.38</figcaption>
</figure>
<figure tabindex="258">
<img src="plots/ultralive.png" alt="#utlralive" />
<figcaption><a href="https://twitter.com/search?q=%23ultralive%20since%3A2015-03-18%20until%3A2015-03-21" target="_blank">#ultralive</a><br><a hashtag="onedirection" id="some_id8" href="">Example Tweets</a><br>Score: 0.24</figcaption>
</figure>
<figure tabindex="259">
<img src="plots/nepal.png" alt="#nepal" />
<figcaption><a href="https://twitter.com/search?q=%23nepal%20since%3A2015-04-26%20until%3A2015-04-30" target="_blank">#nepal</a><br><a hashtag="nepal" id="some_id9" href="">Example Tweets</a><br>Score: 0.23</figcaption>
</figure>
<figure tabindex="260">
<img src="plots/germanwings.png" alt="#germanwings" />
<figcaption><a href="https://twitter.com/search?q=%23germanwings%20since%3A2015-03-24%20until%3A2015-03-27" target="_blank">#germanwings</a><br><a hashtag="germanwings" id="some_id10" href="">Example Tweets</a><br>Score: 0.36</figcaption>
</figure>

</section>
    </div>
</div>

    </div>
</div>

<hr>
<p id='exampletweets'>
</p>
<hr>
<p>Built using a template from https://css-tricks.com/expanding-images-html5/</p>

</body>
</html>
