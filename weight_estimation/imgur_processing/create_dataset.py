# iterate through all preprocessed samples and 

from pathlib import Path
from shutil import copyfile

if __name__ == "__main__":
    
    input = open('VisualBMI_cvs_dump_final.txt', 'r')
    
    output = open('../../data/weight_estimation/data.txt', 'w')
    output.write(input.readline())

    # iterate through all samples and check if both images are in the folder "valid"
    cnt_iter = 0
    maxweight = 0
    maxid = ""
    for line in input:
        props = line.split() 
        if (int(props[1]) > maxweight):
            maxweight = int(props[1]
            maxid = props[0]
        im1 = Path("../../data/imgur/data_clean/Valid/" + props[7])
        im2 = Path("../../data/imgur/data_clean/Valid/" + props[8])
        #im2 = Path("data_clean/valid/" + props[8])
        if im1.is_file() and im2.is_file():
            output.write(line)
            copyfile("../../data/imgur/data_clean/Valid/" + props[7], "../../data/weight_estimation/data/" + props[7])
            copyfile("../../data/imgur/data_clean/Valid/" + props[8], "../../data/weight_estimation/data/" + props[8])
            
    print(maxweight)
    print(maxid)
    input.close()        
    output.close()