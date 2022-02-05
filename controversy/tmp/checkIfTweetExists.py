import glob,re;
import urllib2,sys;

def checkIfExists(url):
	try:
		urllib2.urlopen(url);
		return "yes";
	except urllib2.HTTPError, e:
#		print(e.code);
		return "no";
	except urllib2.URLError, e:
#		print(e.args);
		return "no";

for infile in glob.glob("../example_tweets/*"):
	f = open(infile);
	filename = infile.split("/")[-1];
	lines = f.readlines();
	tmp_str = "";
	out = open("example_tweets/" + filename, "w");
	for line in lines:
		line = line.strip();
		line_split = line.split("\t");
		tweet = line_split[1];
		match = re.search(r'href=[\'"]?([^\'" >]+)', tweet);
		if match:
			link = match.group(0).replace('href="','');
			exists = checkIfExists(link);
			print >> sys.stderr, link, exists;
			if(exists=="yes"):
				tmp_str += line + "\n";
	out.write(tmp_str);
	out.close();
#	break;
