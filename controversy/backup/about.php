<html>
<title>Exploring Controversy on Twitter</title>
<body>

<link rel='stylesheet' type='text/css' href='css/style.css' />
<h1>&nbsp;&nbsp; Exploring Controversy on Twitter</h1>
<hr/><h3>&nbsp;&nbsp;&nbsp;&nbsp; <a href='https://users.ics.aalto.fi/kiran/controversy/about.php'>About</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/index.php'>Examples</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-06-25.php'>Trending hashtags</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/table.php'>Tabular View</a></h3><hr>

<div id="container" style="width:100%;">
<div id="left" style="float:left;width:1%;margin:0 0 0 5px">
<p style="visibility: hidden;">kiran</p>
</div>
<div style="float:left;width:90%">
<br>
<h3>Purpose</h3>
</p>
We provide a system to explore and understand controversy on Twitter. We have shown that we can quantify controversy using the network structure of the retweet and follow graphs in our paper [1].
In this demo, we use <b>retweet networks</b> to show the effectiveness of our random walk score for detecting controversy.

We applied METIS (<a href="http://glaros.dtc.umn.edu/gkhome/metis/metis/overview" target="_blank">link</a>) to the retweet graph to obtain two clusters. The clusters are (arbitrarily) colored red and blue.

The images corresponding to each hashtag are generated using a force directed layout algorithm (<a href="https://en.wikipedia.org/wiki/Force-directed_graph_drawing" target="_blank">link</a>).
</p>
<br/>
<hr/>
<br>

<h3>Functionality</h3>
<p>
The demo has three main tabs (i) Examples, (ii) Trending hashtags, and (iii) Tabular View, each providing a different functionality and ways for exploring controversy on Twitter.
</p>

<br>
<h4>Examples</h4>

<p>
This tab provides examples of hand-picked controversial and non-controversial hashtags. The hashtags we chose were used by Garimella [1].
</p>


<p>
An important observation we can immediately make from this tab is the difference in the retweet networks of controversial and non-controversial hashtags. 
There is a clear clustering (separation) between two groups for controversial hashtags, where as non-controversial hashtags appear to be mixed.
This clear separation is prevalent across a wide spectrum of controversial events [1] indicating the lack of 'conversation' between the two opposing sides, adding proof to the existence of echo chambers.
</p>

<p>
One can click on the hashtag to be directed to twitter search for the specific date during which the hashtag was observed.

Clicking on "Example Tweets" provides example tweets, for example for one of the controversial hashtags provides examples of tweets from either side. The example tweets are generated randomly each time the "Example Tweets" link is clicked, so one can click on that link multiple times to see many example tweets which can help summarize the debate.
</p>

<p>
E.g. Clicking on the example tweets for "#netanyahuspeech" shows the two sides of the debate, with one side opposing Netanyahu (<a href="https://twitter.com/Bipartisanism/status/572844867145089024" target="_blank">example</a>) and the other side supporting him (<a href="https://twitter.com/TrucksHorsesDog/status/572766286259724288" target="_blank">example</a>).
</p>

<p>
Each hashtag is also associated with a score, generated using random walks on the retweet graph (details in [1]). The score indicates the degree to which the hashtag is controversial. A controversy score > 0.5 is generally indicative of a controversial topic. A score > 0.7 indicates a highly controversial hashtag.
</p>
<br>

<h4>Trending hashtags</h4>

<p>
This tab provides a way to explore controversy on Twitter 'in the wild'. To do this we first collected the trending hashtags in the US (from http://trends24.in/united-states/) for almost 3 months (25 June 2015 to 19 Sept 2015). We obtained all tweets mentioning these trending hashtags, and constructed the retweet networks (there is an edge from @user1 to @user2 if @user1 retweeted @user2).

A user can either explore the hashtags day by day using the "Previous/Next day" links or browse specific days using the calendar.

Twitter trending hashtags are not a great way to explore controversy, as most trending hashtags are not news related. By manual inspection, we can clearly see that the hashtags scored high by our score are clearly controversial and hence our demo helps in filtering out the real controversial hashtags from a lot of noise.

A few examples:
<ol>
<li> <a href="https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-06-29.php" target="_blank">#whosiburningblackchurches</a> (Score: 0.332): A controversial hashtag about the burning of predominantly black churches. <a href="https://erlc.com/article/explainer-whoisburningblackchurches" target="_blank">(About the hashtag)</a></li>

<li> <a href="https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-08-02.php" target="_blank">#communitysheild</a> (Score: 0.314): Discussion between the fans of two sides of a soccer game. <a href="https://en.wikipedia.org/wiki/2015_FA_Community_Shield" target="_blank">(About the hashtag)</a></li>

<li> <a href="https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-07-06.php" target="_blank">#nationalfriedchickenday</a> (Score: 0.393): A debate between meat lovers and vegetarians about the ethics of eating meat.</li>

</ol>
<br>

We show example tweets only for hashtags which have a controversy score of at least 0.3. For those hashtags with a controversy score less than 0.3 (mostly non-controversial), we show other hashtags similar to this hashtag (hashtags which co-occur more often, generated using the score from [2]), to give the user a sense of what this hashtag means.
</p>
<br>

<h4>Tabular View</h4>
<p>
Though the 'Trending hashtags' tab provides a way to explore hashtags on a daily basis, it doesn't help in understanding a global picture. This tab helps us in getting a global picture.

For each hashtag, we apply the random walk controversy measure proposed in [1]. One can sort the hashtags by controversy score and have a look at the top controversial hashtags.

</p>
<br>
<h4>False positives</h4>
<p>
<a href="https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-07-04.php" target="_blank">#independenceday</a> (Score: 0.54): Which seems to be not controversial, but picked up as controversial because of the two 'sides' (a group which posts patriotic messages, like 'respect to the troops', etc and a general group wishing others 'a happy #independenceday'), which dont oppose each other.
</p>

<p>
This is a known drawback using the Random walk controversy measure, also addressed in [1]. But the benefit provided by the demo is that we are able to filter a lot of non-controversial hashtags with confidence only leaving a handful of hashtags for manual inspection.
</p>
<br>
<h4>Glitches</h4>
<p>
Some days are missing data (e.g. 2015-07-08, 2015-07-12) because of troubles in our data collection pipeline.

</p>
<br/>
<hr/>
<br>
<h3>Credits</h3>
<p>
For any questions contact Kiran Garimella (kiran.garimella@aalto.fi). Based on research by Kiran Garimella, Gianmarco De Francisci Morales, Aristides Gionis and Michael Mathioudakis (Aalto University).
</p>
<br/>
<hr/>
<br>
<h3>References</h3>

[1] Kiran Garimella, et al. Quantifying Controversy on Social Media, WSDM 2016<br>
[2] Wei Feng, et al. STREAMCUBE: Hierarchical spatio-temporal hashtag clustering for event exploration over the Twitter stream, ICDE 2015
<br>
<br>
</div>
</div>
</body>

</html>
