import csv
import numpy as np

def create_hit(output, filenames):
    urls = []
    for f in filenames:
        urls.append("https://i.imgur.com/" + f)
    
    s = ','.join(urls)
    s = "https://i.imgur.com/ANGWJ2i.jpg," + s + "\n"
    output.write(s)

def generate_hits(output, samples, batchsize, numhits):
    samples = samples[0:numhits*batchsize]
    samples = np.random.permutation(samples)
    for i in range(numhits):    
       create_hit(output, samples[range(batchsize*i,(i+1)*batchsize)])

def collect_samples(output, data):
    # skip header
    data.readline()
    # read only samples that consist of two separate files
    samples = []
    for line in data:
        props = line.split()
        if (props[7].count("_")):
            continue
        samples.append(props[7])
        samples.append(props[8])
    return samples
    
def print_header(output, batchsize):
    basename = "image_url"
    s = "image_url_sample,"
    for i in range(batchsize-1):
        s += (basename + str(i) + ",")
    s += (basename + str(batchsize-1)) + "\n"
    output.write(s)

if __name__ == "__main__":
    
    batchsize = 10
    numhits = 1
    
    output = open('input_pilot_1line.csv', 'w')
    data = open("../../data/weight_estimation/data.txt", "r")
    
    print_header(output, batchsize)
    samples = collect_samples(output, data)
    generate_hits(output, samples, batchsize, numhits)

    output.close()
    data.close()