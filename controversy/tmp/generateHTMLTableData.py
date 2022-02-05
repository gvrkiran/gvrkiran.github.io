# script to generate HTML for the hashtags, along with their scores automatically.

import sys,glob;

dict_randomwalk = {};
dict_edgebetweenness = {};
dict_forcedirected = {};
dict_icwsm = {};

for infile in glob.glob("polarization_score_random_walk/polarization_score_*.txt"):
	date = infile.split("/")[-1].replace("polarization_score_","").replace(".txt","");
	f = open(infile);
	lines = f.readlines();
	count = 0;
	for line in lines:
		line = line.strip();
		count += 1;
		if(line.find("*************")!=-1):
			hashtag = line.split(" ")[1].split("/")[-1];
			count = 0;
		if(count==3):
			dict_randomwalk[hashtag + "\t" + date] = line;
	
	f.close();


for infile in glob.glob("polarization_score_edgebetweenness/polarization_score_*.txt"):
	date = infile.split("/")[-1].replace("polarization_score_","").replace(".txt","");
	f = open(infile);
	lines = f.readlines();
	for line in lines:
		line = line.strip();
		line_split = line.split("\t");
		hashtag = line_split[0];
		dict_edgebetweenness[hashtag + "\t" + date] = line_split[1];
	f.close();

for infile in glob.glob("polarization_score_forcedirected/polarization_score_*.txt"):
	date = infile.split("/")[-1].replace("polarization_score_","").replace(".txt","");
	f = open(infile);
	lines = f.readlines();
	for line in lines:
		line = line.strip();
		line_split = line.split("\t");
		hashtag = line_split[0];
		dict_forcedirected[hashtag + "\t" + date] = line_split[1];
	f.close();

for infile in glob.glob("polarization_score_icwsm/polarization_score_*.txt"):
	date = infile.split("/")[-1].replace("polarization_score_","").replace(".txt","");
	f = open(infile);
	lines = f.readlines();
	for line in lines:
		line = line.strip();
		line_split = line.split("\t");
		hashtag = line_split[0];
		dict_icwsm[hashtag + "\t" + date] = line_split[1];
	f.close();

out = """<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
  "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en-us">
<head>
	<title>Exploring Controversy on Twitter</title>
	<link rel='stylesheet' type='text/css' href='css/style.css' />
	<link rel="stylesheet" href="docs/css/jq.css" type="text/css" media="print, projection, screen" />
	<link rel="stylesheet" href="themes/blue/style.css" type="text/css" media="print, projection, screen" />
	<script type="text/javascript" src="jquery-latest.js"></script>
	<script type="text/javascript" src="jquery.tablesorter.js"></script>
	<script type="text/javascript" src="docs/js/docs.js"></script>
	<script type="text/javascript">
	$(function() {		
		$("#tablesorter-demo").tablesorter({sortList:[[0,0],[2,1]], widgets: ['zebra']});
		$("#options").tablesorter({sortList: [[0,0]], headers: { 3:{sorter: false}, 4:{sorter: false}}});
	});	
	</script>
</head>
<body>
<div id="main">
	<a name="Demo"></a>

	<h1>Exploring Controversy on Twitter</h1>
	<hr/><h3>&nbsp;&nbsp;&nbsp;&nbsp; <a href='https://users.ics.aalto.fi/kiran/controversy/about.php'>About</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/index.php'>Examples</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/html_files/images_2015-06-25.php'>Trending hashtags</a> &nbsp;&nbsp;&nbsp;<a href='https://users.ics.aalto.fi/kiran/controversy/table.php'>Table</a></h3><hr>
	<table id="tablesorter-demo" class="tablesorter" border="0" cellpadding="0" cellspacing="1">""";

out +="<thead>\n";
out += "<tr>\n";
out += "<th>Date</th>\n";
out += "<th>Hashtag</th>\n";
out += "<th>Random walk</th>\n";
#out += "<th>Edge betweenness</th>\n";
#out += "<th>Force directed</th>\n";
#out += "<th>ICWSM</th>\n";
#out += "<th>Venezuela</th>\n";
out += "</tr>\n";
out += "</thead>\n";
out += "<tbody>\n";

for keys in dict_randomwalk.keys():
	hashtag = keys.split("\t")[0];
	date = keys.split("\t")[1];
#	try:
	for i in range(1,2):
		out += "<tr>\n";
		out += "<td>" + date + "</td>\n";
		out += "<td><a href='html_files/images_" + date + ".php' target='_blank'>" + hashtag + "</a></td>\n";
		out += "<td>" + dict_randomwalk[keys] + "</td>\n";
#		out += "<td>" + dict_edgebetweenness[keys] + "</td>\n";
#		out += "<td>" + dict_forcedirected[keys] + "</td>\n";
#		out += "<td>" + dict_icwsm[keys] + "</td>\n";
#		out += "<td>" + str(0.0) + "</td>\n";
		out += "</tr>\n";
#	except:
#		pass;

out += "</tbody>\n</table>\n";


out += """</div>
</body>
</html>""";

print out;
