<!DOCTYPE html>
<html>

  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="chrome=1">
    <meta name="description" content="Balancing Opposing Views : Project to connect people on Twitter with content which is opposite to what they believe.">

    <link rel="stylesheet" type="text/css" media="screen" href="stylesheets/stylesheet.css">

    <title>News on Twitter</title>
  </head>

  <body>

    <!-- HEADER -->
    <div id="header_wrap" class="outer">
        <header class="inner">

          <h1 id="project_title">News on Twitter</h1>
          <h2 id="project_tagline">Understanding news consumption on social media</h2>

        </header>
    </div>

    <!-- MAIN CONTENT -->
    <div id="main_content_wrap" class="outer">
      <section id="main_content" class="inner">
<!--h3>
<a id="creating-pages-manually" class="anchor" href="#creating-pages-manually" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Survey</h3-->

	     <h3> Thanks for being here!</h3>

		  <p>
			  This survey is part of a research project <!--a href="https://gvrkiran.github.io/balancingViews" target="_blank">research project</a-->
			  that aims to understand how Twitter users consume news on social media. 

	      Below we show two links to news articles. Please click on them and read the articles.</p>
		  <p>We then ask you to answer <b>two questions</b>.</p>
		  <p>One question asks you to tell us which
			  article you enjoyed reading the most -- based on whether you found the content of the article to be informative. </p>
			  <!--well-written, or useful.</p-->
		  <p>Another question asks you which article you disagreed with the most -- based on any opinions
			  reflected in the article.</p>
		  
<hr>
<div id="survey">

<?php
// define variables and set to empty values
$nameErr = $emailErr = $question1Err = $question2Err = $websiteErr = "";
$question1 = $question2 = $gender = $comment = $website = "";


if ($_SERVER["REQUEST_METHOD"] == "POST") {

  if (empty($_POST["comment"])) {
    $comment = "";
  } else {
    $comment = test_input($_POST["comment"]);
  }

  if (empty($_POST["question1"])) {
    $question1Err = "This choice is required";
  } else {
    $question1 = test_input($_POST["question1"]);
  }

  if (empty($_POST["question2"])) {
    $question2Err = "This choice is required";
  } else {
    $question2 = test_input($_POST["question2"]);
  }

	$servername = "localhost";
	$username = "newuser";
	$password = "password";
	$dbname = "balancingviews";

	// Create connection
	$conn = new mysqli($servername, $username, $password, $dbname);
	// Check connection
	if ($conn->connect_error) {
	    die("Connection failed: " . $conn->connect_error);
	} 

	$timestamp = time();
	$filename = __FILE__;

	$sql = "INSERT INTO surveydata (filename, question1, question2, comments, timestamp) VALUES ('$filename','$question1', '$question2', '$comment', '$timestamp')";

	// $conn->query($sql);

	if($question1 !== "" and $question2 !== "") {
		if ($conn->query($sql) === TRUE) {
	  		echo "<h3 style='color:red'>Thank you for your time! Your responses have been recorded.</h3>";
			$conn->close();
		} else {
		}
	}
}

function test_input($data) {
  $data = trim($data);
  $data = stripslashes($data);
  $data = htmlspecialchars($data);
  return $data;
}
?>

<section id="urls">
    <div id="one">
    	<h5>News Item 1</h5>
<p><a href='http://www.hannity.com/articles/election-493995/donald-trump-announces-his-first-drain-15311680' target='_blank'>Donald Trump Announces His First 'Drain The Swamp' Measure | The Sean Hannity Show</a></p>
   </div>
    <div id="two">
    	<h5 style="padding-top:10px">News Item 2</h5>

<p><a href='http://www.nationalreview.com/corner/442059/dont-blame-clinton-trump-2016-wouldve-beaten-obama-2012' target='_blank'>
UPDATED: Obama 2012 Would've Beaten Trump 2016
</a></p>
     </div>
</section>
<form method="post" action="<?php echo htmlspecialchars($_SERVER["PHP_SELF"]);?>">  
	Which one do you <b>enjoy reading</b> the most?:<br>
	<input type="radio" name="question1" <?php if (isset($question1) && $question1=="1") echo "checked";?> value="1">Item 1
	<input type="radio" name="question1" <?php if (isset($question1) && $question1=="2") echo "checked";?> value="2">Item 2
	<input type="radio" name="question1" <?php if (isset($question1) && $question1=="eq") echo "checked";?> value="eq">Both the same
	<input type="radio" name="question1" <?php if (isset($question1) && $question1=="na") echo "checked";?> value="na">Can't say
	<span class="error">* <?php echo $question1Err;?></span>

  <br><br>
	Which one do you <b>disagree with</b> the most?:<br>
	<input type="radio" name="question2" <?php if (isset($question2) && $question2=="1") echo "checked";?> value="1">Item 1
	<input type="radio" name="question2" <?php if (isset($question2) && $question2=="2") echo "checked";?> value="2">Item 2
	<input type="radio" name="question2" <?php if (isset($question2) && $question2=="eq") echo "checked";?> value="eq">Both the same
	<input type="radio" name="question2" <?php if (isset($question2) && $question2=="na") echo "checked";?> value="na">Can't say
	<span class="error">* <?php echo $question2Err;?></span>

  <br><br>
  Any comments or feedback?<br>
	<textarea name="comment" rows="5" cols="60"><?php echo $comment;?></textarea>
  <br>
 <input type="submit" name="submit" value="Submit">  
<p><span class="error">* required fields.</span></p>
</form>

</div>

<hr>

<h3>
<a id="data" class="anchor" href="#data" aria-hidden="true"><span aria-hidden="true" class="octicon octicon-link"></span></a>Data Collection Policy</h3>

<p>
			  You can find our data collection policy on the XXXX (anonymized for double blind review)
        <!--a href='https://gvrkiran.github.io/balancingViews/index.html#data'>project webpage</a>. If you have any
			  questions or comments, please reach out to Kiran Garimella
			  (<a href="mailto:kiran.garimella@aalto.fi">email</a>).-->
</p>

     </section>
    </div>

    <!-- FOOTER  -->
    <div id="footer_wrap" class="outer">
      <footer class="inner">
        <p class="copyright">Balancing Opposing Views maintained by <!--a href="https://github.com/gvrkiran">gvrkiran</a></p-->
      </footer>
    </div>

    

  </body>
</html>   
