<html>
<title>Exploring Controversy on Twitter</title>
<body>

<link rel='stylesheet' type='text/css' href='css/style.css' />
<h1>&nbsp;&nbsp; Exploring Controversy on Twitter</h1>
<hr/><h3>&nbsp;&nbsp;&nbsp;&nbsp; <a href='https://users.ics.aalto.fi/kiran/controversy/about.php'>About</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/index.php'>Examples</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-06-25.php'>Trending hashtags</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/table.php'>Tabular View</a></h3><hr>

<div id="container" style="width:100%;">
<div id="left" style="float:left;width:1%;margin:0 0 0 5px">
<p style="visibility: hidden;">hi kiran!</p>
</div>
<div style="float:left;width:90%">
<br>
<h3>General</h3>
<p>

<b>*New*</b> Our demo has been accepted and will be presented at <b>CSCW 2016</b>. Please have a look at <a href="http://arxiv.org/abs/1512.05550" target="_blank">this paper</a> for more details.<br/>

We provide a system to explore controversy on Twitter. In previous work [1], we found that one can accurately quantify the controversy surrounding a topic of discussion using the structure of the interactions related to the topic.
In this demo, we employ this approach in the wild, aiming to explore various topics of discussion on Twitter and detect the ones that are controversial.
</p>
<p>
To be more specific, the system processes the daily <i>trending hashtags</i> discussed on the platform - and treats each such hashtag as defining a <i>single topic</i>. It then assigns a <b>controversy score</b> to each topic. The controversy score is computed in three steps:
<ul>
<li>First, we build the <b>retweet graph</b> for the topic. Each vertex in that graph corresponds to one user who posted a tweet with the hashtag of the topic in a given day. Moreover, an edge between two vertices signifies that there was a retweet with that hashtag between the corresponding users.</li>
<li>Subsequently, we apply (<a href="http://glaros.dtc.umn.edu/gkhome/metis/metis/overview" target="_blank">METIS</a>) on the retweet graph to partition its nodes into <b>two clusters</b>.</li>
<li>Finally, given the retweet graph and the two clusters computed in the previous two steps, we calculate the value of a measure that captures how separated the two partitions are - and this is the <b>controversy score</b>.
Intuitively, the more separated the two clusters, the higher the value of the score - and the more controversial the topic.</li>
</ul>
</p>
<p></p>
The image corresponding to each hashtag demonstrate the corresponding retweet graph and its two clusters. The clusters are (arbitrarily) colored <b>red</b> and <b>blue</b>. The graph is rendered using a force-directed (<a href="https://en.wikipedia.org/wiki/Force-directed_graph_drawing" target="_blank">layout algorithm</a>).
</p>
<p> For further details, we refer the interested reader to the research paper [1].</p>
<br/>
<hr/>
<br>

<h3>Functionality</h3>
<p>
The demo has three main tabs (i) <b>Examples</b>, (ii) <b>Trending hashtags</b>, and (iii) <b>Tabular View</b>, each providing a different functionality and ways for exploring controversy on Twitter.
</p>

<h4>Examples</h4>

<p>
This tab provides examples of hand-picked controversial and non-controversial hashtags, that were also used in our original research paper [1].
</p>

<p>
An important observation we can immediately make from this tab is the difference in the retweet graphs of controversial and non-controversial hashtags. 
There is a clear separation between the two clusters of nodes (blue and red) for controversial hashtags, where for non-controversial hashtags they appear to be mixed.
This clear separation is prevalent across a wide spectrum of controversial events [1] indicating the lack of 'conversation' between the two opposing sides, adding evidence to the existence of echo chambers.
</p>

<p>
One can click on the hashtag to be directed to twitter search for the specific date during which the hashtag was observed.

Moreover clicking on "Example Tweets" provides representative tweets from each of the two clusters (blue and red). The example tweets are generated randomly each time the "Example Tweets" link is clicked, so one can click on that link multiple times to see many example tweets which can help summarize the debate.
</p>

<p>
E.g. Clicking on the example tweets for "#netanyahuspeech" shows the two sides of the debate, with one side opposing Netanyahu (<a href="https://twitter.com/Bipartisanism/status/572844867145089024" target="_blank">example</a>) and the other side supporting him (<a href="https://twitter.com/TrucksHorsesDog/status/572766286259724288" target="_blank">example</a>).
</p>

<p>
Each hashtag is also associated with a controversy score, that indicates the degree to which the related topic is controversial. A controversy score > 0.3 is generally indicative of a controversial topic. A score <b>> 0.5</b> indicates a highly controversial hashtag.
</p>

<h4>Trending hashtags</h4>

<p>
This tab provides a way to explore controversy on Twitter 'in the wild'. To do this we first collected the trending hashtags in the US (from http://trends24.in/united-states/) for almost 3 months (25 June 2015 to 19 Sept 2015). We obtained all tweets mentioning these trending hashtags, and constructed the retweet graphs (there is an edge from @user1 to @user2 if @user1 retweeted @user2).
</p>
<p>
A user can either explore the hashtags day by day using the "Previous/Next day" links or browse specific days using the calendar.

Twitter trending hashtags are not a great way to explore controversy, as most trending hashtags are not news related. By manual inspection, we can clearly see that the hashtags scored high by our score are clearly controversial and hence our demo helps in filtering out the real controversial hashtags from a lot of noise.
</p>

<p>
A few examples:
<ol>
<li> <a href="https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-06-29.php" target="_blank">#whosiburningblackchurches</a> (Score: 0.332): A controversial hashtag about the burning of predominantly black churches. <a href="https://erlc.com/article/explainer-whoisburningblackchurches" target="_blank">(About the hashtag)</a></li>

<li> <a href="https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-08-02.php" target="_blank">#communityshield</a> (Score: 0.314): Discussion between the fans of two sides of a soccer game. <a href="https://en.wikipedia.org/wiki/2015_FA_Community_Shield" target="_blank">(About the hashtag)</a></li>

<li> <a href="https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-07-06.php" target="_blank">#nationalfriedchickenday</a> (Score: 0.393): A debate between meat lovers and vegetarians about the ethics of eating meat.</li>

</ol>
</p>

<p>
We show example tweets only for hashtags which have a controversy score of at least 0.3. For those hashtags with a controversy score less than 0.3 (mostly non-controversial), we show other hashtags similar to this hashtag (hashtags which co-occur more often, generated using the score from [2]), to give the user a better sense of the topic the hashtag is related to.
</p>

<h4>Tabular View</h4>
<p>
This view of the hashtags tab helps us get a global picture about which hashtags are controversial.
For each hashtag that we have processed, we apply the random walk controversy measure proposed in [1]. One can sort the hashtags by controversy score and explore the top controversial hashtags.
</p>

<h4>False positives</h4>
<p>
<a href="https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-07-04.php" target="_blank">#independenceday</a> (Score: 0.54): The topic of discussion related to this hashtag does not seem to be controversial, but was identified as controversial because of the two 'sides' (a group which posts patriotic messages, like 'respect to the troops', etc and a general group wishing others 'a happy #independenceday'), which don't oppose each other - at least not in the context of this topic.
</p>

<p>
This is a known drawback of our approach to measuring controversy, also addressed in [1]. Nevertheless, the benefit provided by this system is that we are able to filter a lot of non-controversial hashtags with confidence, only leaving a handful of hashtags for manual inspection.
</p>

<h4>Glitches</h4>
<p>
Data for some days is missing (e.g. 2015-07-08, 2015-07-12) because of troubles in our data collection pipeline.
For some hashtags, the `Similar hashtags' functionality doesn't work because of a bug in our data processing pipeline.
</p>
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

[1] Kiran Garimella, et al. Quantifying Controversy on Social Media, WSDM 2016, <a href="http://arxiv.org/abs/1507.05224">arXiv pre-print</a><br>
[2] Wei Feng, et al. STREAMCUBE: Hierarchical spatio-temporal hashtag clustering for event exploration over the Twitter stream, ICDE 2015
<br>
<br>
</div>
</div>
</body>

</html>
