import csv
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
import matplotlib.gridspec as gridspec

# read the file with answers into an array with dictionaries
def read_csv(filename):    
    with open(filename) as file:
        reader = csv.reader(file, skipinitialspace=True)
        header = next(reader)
        ans = [dict(zip(header, map(str, row))) for row in reader]
    return ans
    
# get the name of the image file from the url
# assumption: image name is the last part of the url .../im_name.jpg
def get_image_filename(url):
    filename = url[::-1]
    filename = filename[:filename.find('/')]
    return filename[::-1]
    
# assumption: input names are "image_urlX" with any integer X
# answers are hXcm, hXfi, wXkg, wXlbs 
# collect the results in cm and lbs to keep round-off errors small
# return results in cm and kg
def collect_results_SI(ans):
    # names of all images that were labelled
    filenames = []
    # dictionaries from image name to all collected guesses
    hcm = {}
    wkg = {}
    t = {}
    # loop over all answers
    for a in ans:
        # loop over all images in HIT
        cnt = 0
        heights = a.get("Answer.f2").split(",")
        weights = a.get("Answer.f1").split(",")
        times = a.get("Answer.timeseq").split(",")
        
        while (a.get("Input.image_url"+str(cnt))):
            filename = get_image_filename(a["Input.image_url"+str(cnt)])
            filenames.append(filename)
            if (not hcm.get(filename)):
                hcm[filename] = []
                wkg[filename] = []
                t[filename] = []
                
            hcm[filename].append(float(heights[cnt]))
            wkg[filename].append(float(weights[cnt])*0.453592) #convert to kg
            t[filename].append(float(times[cnt+1]) - float(times[cnt]))
            cnt += 1
    
    return filenames, hcm, wkg, t
    
def get_labels_SI(datafile, filenames):
    data = open(datafile, 'r')
    idtof = {}
    hcm = {}
    wkg = {}
    
    for line in data:
        props = line.split()
        if (props[7] in filenames):
            id = props[0]
            idtof[id] = [props[7], props[8]]
            hcm[id] = float(props[3]) * 2.54
            wkg[id] = [float(props[1]) * 0.453592, float(props[2]) * 0.453592]

    data.close()
    return idtof, hcm, wkg
    
def check_assignment(w0_mean, w1_mean, w_gt):
    rv1 = (w0_mean > w1_mean) and (w_gt[0] > w_gt[1])
    rv2 = (w0_mean < w1_mean) and (w_gt[0] < w_gt[1])
    return (rv1 or rv2)
    
def assign_weight_image(idtof, hcm_gt, wcm_gt, hcm, wkg):
    for id in idtof:
        f0, f1 = idtof[id]
        
        h0 = np.asarray(hcm[f0])
        h1 = np.asarray(hcm[f1])
        
        w0 = np.asarray(wkg[f0])
        w1 = np.asarray(wkg[f1])
        
        # assign correspondances by minimizing the error, swap filenames if required
        if check_assignment(np.mean(w0), np.mean(w1), wkg_gt[id]) == False:
            idtof[id] = [f1, f0]
    
    return idtof    
    
def process_results(idtof, hcm_gt, wkg_gt, hcm, wkg, t):
    idtof = assign_weight_image(idtof, hcm_gt, wkg_gt, hcm, wkg)
    
    output = open('pilot_res/summary.csv', 'w')
    output.write("filename,w_err,h_err,time\n")
    
    hall = 0;
    wall = 0;
    tall = 0;
    
    for id in idtof:
        f0, f1 = idtof[id]
        
        h0 = np.asarray(hcm[f0])
        h1 = np.asarray(hcm[f1])
        
        hmin = np.ndarray.min(np.minimum(h0,h1)); hmax = np.ndarray.max(np.maximum(h0,h1));
        hmin = np.minimum(hmin, hcm_gt[id]); hmax = np.maximum(hmax, hcm_gt[id]);
        
        w0 = np.asarray(wkg[f0])
        w1 = np.asarray(wkg[f1])
        
        wmin = np.ndarray.min(np.minimum(w0,w1)); wmax = np.ndarray.max(np.maximum(w0,w1));
        wmin = np.minimum(wmin, wkg_gt[id][0]); wmax = np.maximum(wmax, wkg_gt[id][0]);
        wmin = np.minimum(wmin, wkg_gt[id][1]); wmax = np.maximum(wmax, wkg_gt[id][1]);
        
        im0 = mpimg.imread("../../data/weight_estimation/data/" + f0)
        im1 = mpimg.imread("../../data/weight_estimation/data/" + f1)    
         
        ts0 = np.asarray(t[f0]) / 1e3 # convert ms to s
        ts1 = np.asarray(t[f1]) / 1e3 
        
        hall += abs(np.mean(h0)-hcm_gt[id])
        wall += abs(np.mean(w0)-wkg_gt[id][0])
        tall += np.mean(ts0)
        s = "%s,%.1lf,%.1lf,%.1lf\n" % (f0, np.mean(h0)-hcm_gt[id], np.mean(w0)-wkg_gt[id][0], np.mean(ts0))
        output.write(s)   
        
        hall += abs(np.mean(h1)-hcm_gt[id])
        wall += abs(np.mean(w1)-wkg_gt[id][1])
        tall += np.mean(ts1)
        s = "%s,%.1lf,%.1lf,%.1lf\n" % (f1, np.mean(h1)-hcm_gt[id], np.mean(w1)-wkg_gt[id][1], np.mean(ts1))
        output.write(s)   
        
        f = plt.figure();
        gs = gridspec.GridSpec(3, 2, height_ratios=[2,4,1])
        
        plt.subplot(gs[0])
        plt.scatter(h0, w0, c="r", marker=".")
        plt.scatter(np.mean(h0), np.mean(w0), c="r", marker="D", label = "mean")
        plt.scatter(hcm_gt[id], wkg_gt[id][0], c="r", marker="*", label = "ground truth")
        s = "Error: %.1lf cm, %.1lf kg" % (np.mean(h0)-hcm_gt[id], np.mean(w0)-wkg_gt[id][0])
        plt.title(s)
        
        axes = plt.gca()
        axes.set_xlim([hmin-10,hmax+10])
        axes.set_ylim([wmin-10,wmax+10])
        
        plt.subplot(gs[1])
        plt.scatter(h1, w1, c="b", marker=".")
        plt.scatter(np.mean(h1), np.mean(w1), c="b", marker="D", label = "mean")
        plt.scatter(hcm_gt[id], wkg_gt[id][1], c="b", marker="*", label = "ground truth")
        s = "Error: %.1lf cm, %.1lf kg" % (np.mean(h1)-hcm_gt[id], np.mean(w1)-wkg_gt[id][1])
        plt.title(s)
        
        axes = plt.gca()
        axes.set_xlim([hmin-10,hmax+10])
        axes.set_ylim([wmin-10,wmax+10])
    
        #plt.subplot(2, 2, 2)
        # TODO: add time distribution
        
        plt.subplot(gs[2])
        plt.imshow(im0)
        axes = plt.gca();
        axes.get_xaxis().set_visible(False)
        axes.get_yaxis().set_visible(False)
        
        plt.subplot(gs[3])
        plt.imshow(im1)
        axes = plt.gca();
        axes.get_xaxis().set_visible(False)
        axes.get_yaxis().set_visible(False)
        
        plt.subplot(gs[4])
        plt.hist(ts0)
        s = "Mean time: %.1lf" % np.mean(ts0)
        plt.title(s)
        
        plt.subplot(gs[5])
        plt.hist(ts1)
        s = "Mean time: %.1lf" % np.mean(ts1)
        plt.title(s)
        
        plt.savefig("pilot_res/" + id + ".pdf")
        plt.clf();
        
    print("Mean height and weight errors: %.1lf cm %.1lf kg" % (hall/(2*len(idtof)), wall/(2*len(idtof)) ))
    print("Average time: %.1lf" % (tall/(2*len(idtof))))
    
if __name__ == "__main__":
    
    ans = read_csv("pilot_res.csv")
    # collect results
    filenames, hcm, wkg, t = collect_results_SI(ans)
    # get the ground truth and filename to id mapping
    idtof, hcm_gt, wkg_gt = get_labels_SI("../../data/weight_estimation/data.txt", filenames)
    # plot all samples one after another
    process_results(idtof, hcm_gt, wkg_gt, hcm, wkg, t)
 