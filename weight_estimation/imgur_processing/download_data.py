import urllib.request

if __name__ == "__main__":
    
    # open the file containing initial dataset and read its header
    input = open('VisualBMI_cvs_dump.txt', 'r')
    
    # iterate throgh all samples and check if each one is valid
    cnt = 0
    for line in input:
        props = line.split()
        # one picture -> will need to be postprocessed  
        if props[6].count(',') == 0:
            cnt += 1
            urllib.request.urlretrieve("http://imgur.com/" + props[6] + ".jpg", "data_imgur/" + props[6] + ".jpg")
        # two pictures
        elif props[6].count(',') == 1:
            ims = props[6].split(',')
            ims[0] = ims[0][1:]
            ims[1] = ims[1][:-1]
            urllib.request.urlretrieve("http://imgur.com/" + ims[0] + ".jpg", "data_imgur/" + ims[0] + ".jpg")
            urllib.request.urlretrieve("http://imgur.com/" + ims[1] + ".jpg", "data_imgur/" + ims[1] + ".jpg")
            cnt += 1
            
    print("Images for " + str(cnt) + " were downloaded.")
    input.close()
    