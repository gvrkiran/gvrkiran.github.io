<?php

// Example tweets for the baseline examples, like beefban, russia_march, etc

$hashtag = $_GET['hashtag'];

if($hashtag=="")
	echo "<h3>Empty hashtag. Please check</h3>";

$myfile = fopen("example_tweets/" . $hashtag . ".txt", "r") or die("Unable to open file!");

$example_tweets = array();

while(!feof($myfile)) {
	$line = fgets($myfile);
	$line_split = explode("\t",$line);
	$community = $line_split[0];
	$tweet = $line_split[1];
	if($community=="")
		continue;
	if(array_key_exists($community,$example_tweets)) {
		$my_var = $example_tweets[$community];
		array_push($my_var,$tweet);
		$example_tweets[$community] = $my_var;
	}
	else {
		$my_var = array();
		array_push($my_var,$tweet);
		$example_tweets[$community] = $my_var;
	}
#	echo fgets($myfile) . "<br>";
}

$community1 = array_rand($example_tweets['c1'],3);
$community1_tweets = "<div class='container4'><div class='content4'><h3>Example tweets for #" . $hashtag . "</h3><hr><br><h4>Community1</h4><ul>";

foreach ($community1 as $key=>$value) {
	$community1_tweets .= "<li>" . $example_tweets['c1'][$value] . '</li>';
}

$community1_tweets .= "</ul></div><div class='sidebar4'><h4>Community2</h4><ul>";

$community2 = array_rand($example_tweets['c2'],3);

foreach ($community1 as $key=>$value) {
	$community1_tweets .= "<li>" . $example_tweets['c2'][$value] . '</li>';
}

$community1_tweets .= "</ul></div></div>";

echo $community1_tweets;

fclose($myfile);

?>
