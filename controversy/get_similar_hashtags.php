<?php

$date = $_GET['date1'];
$hashtag = $_GET['hashtag'];

if($date=="" || $hashtag=="")
	echo "<h3>Empty date or hashtag. Please check</h3>";

$myfile = fopen("similar_hashtags/".$date . "/" . $hashtag, "r") or die("Unable to open fileq!");

$example_tweets = array();

$similar_hashtags = "<div class='container4'><div class='content4'><h3>Similar hashtags to #" . $hashtag . "</h3><hr><br><table><tr><th>Hashtag</th><th>Cosine Similarity</th></tr>";

while(!feof($myfile)) {
	$line = fgets($myfile);
	$line_split = explode("\t",$line);
	$hashtag = $line_split[0];
	$similarity = $line_split[1];
	if($similarity<0.05)
		continue;
	$similar_hashtags .= "<tr><td>" . $hashtag . '</td><td>' . $similarity . '</td></tr>';
#	echo fgets($myfile) . "<br>";
}

$similar_hashtags .= "</table></div></div>";

echo $similar_hashtags;

fclose($myfile);

?>
