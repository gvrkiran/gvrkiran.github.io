from pathlib import Path
import numpy as np
import matplotlib.image as mpimg
import scipy.signal as scs

# scales for both thresholds [0,255]
# threshold for defining same-colored rows (RGB_rowmax - RGB_rowmin < threshold for each of the three RGB components) 
color_threshold = 50
# threshold for edge detection on 0: no edge (no gradient of color), 255: max.possible gradient
edge_threshold = 100

# length of filter for vertical edge detection
filter_length = 2 # -1 -1 1 1

# remove all rows composed of pixels of the same color
def remove_equal_rows(im):
    
    [h,w,d] = im.shape
    rm = np.ones(h)
    
    for i in range(h):
        crowmin = np.ndarray.min(im[i,:,:], axis=0)
        crowmax = np.ndarray.max(im[i,:,:], axis=0)
        
        if (np.all((crowmax - crowmin) < 50)):
            rm[i] = 0

    #print(np.sum(rm.astype(int)))
    imr = np.zeros((np.sum(rm.astype(int)), w, d), 'uint8')
    cnt = 0
    imr = im[rm > 1e-2,:,:]
    
    return imr
    

# on some pics the images of before/after are surrounded by frames -> remove those
def remove_image_contour(im):
    # check horizontal rows 
    im = remove_equal_rows(im)
    # and vertical columns
    im = np.transpose(im, (1,0,2))
    im = remove_equal_rows(im)
    return np.transpose(im, (1,0,2))
    
# assumption 1 x n symmetric filter
def apply_filter_rowwise(im, filter):
    [h,w,d] = im.shape
    im_edge = np.zeros((h,w))
    # move a filter over the image
    for i in range(h):
        for k in range(d):
            im_edge[i,:] += np.power(np.convolve(im[i,:,k], filter, 'same'), 2)
    
    im_edge = np.power(im_edge, 0.5)
    # rescale the results for each column to [0,255]
    for j in range(w):
        im_edge[:,j] = 255 * (im_edge[:,j] / np.max(im_edge)) # / np.max(im_edge[:,j]))
    return im_edge
    
def func(x):
    t = 20
     
    rv = np.logical_and(x[:,0] > 20, x[:,1] > 20)
    rv = np.logical_and(rv, x[:,2] > 20)
    return rv
    
    
def vertical_split(im):    
    [h,w,d] = im.shape

    #filter = np.zeros(filter_length)
    #filter[0] = -1
    #filter[1] = 1
    #filter[2] = -1
    #filter[3] = 1
    #filter[4] = 1
    #filter[5] = 1
    #im_edge = apply_filter_rowwise(im, filter)
    
    #filter = np.hstack( (-np.ones((50,1)), np.zeros((50,1)), np.ones((50,1))) )
    
    filter = np.zeros((3,3))
    filter[0,0] = -1; filter[0,2] = 1
    filter[1,0] = -2; filter[1,2] = 2
    filter[2,0] = -1; filter[2,2] = 1
    
    im = im.astype(float)
    im_temp = np.zeros_like(im)
    for c in range(d):
        im_temp[:,:,c] = np.absolute(scs.convolve2d(im[:,:,c], filter, mode='same'))
    
    im_temp /= np.max(im_temp) 
    '''
    print(np.shape( np.linalg.norm(im_temp, axis=2) ))
    mpimg.imsave("data_prepared/" + "___check__sum__" + filename, im_temp[:,:,0])#np.linalg.norm(im_temp,axis=2))
    
    im_sum = np.zeros((1,w))
    for j in range(10,w-10,1):
        im_sum[0,j] = np.sum( func( np.absolute(im[:,j,:]-im[:,j-1,:]) ) ) / h
            
    #print(im_sum[0,0:10])
    '''
    im_temp_norm = np.linalg.norm(im_temp,axis=2)
    mpimg.imsave("data_prepared/" + "___check__sum__" + filename, im_temp_norm>0.05) #np.vstack( im_temp_norm/np.max(im_temp_norm) > 120, im_sum )) )
    
    im_sum = np.zeros(w)
    for j in range(10,w-10,1):
        for c in range(d):
            im_sum[j] += np.sum(np.absolute(im[:,j,c] - im[:,j-1,c]))
             
        #im_sum[j] = np.sum((im_temp_norm[:,j] > 0.05))/h
    
    idx = np.argmax(im_sum)
    val = im_sum[idx]
    
    im1 = im[:,0:idx,:] 
    im2 = im[:,idx+1:-1,:]
    
    im_sum[idx-10:idx+10:1] = -val
    val2 = np.max(im_sum)
    
    if (2*val2 > val):
        mpimg.imsave("data_cut/" + "cut_" + filename, np.hstack((im1.astype('uint8'), im2.astype('uint8'))))
    else:
        mpimg.imsave("data_cut/" + "cut_" + filename, np.hstack((im1.astype('uint8'), np.zeros((h,40,d)).astype('uint8'), im2.astype('uint8'))))
    im_sum = np.sort(im_sum)
    print(im_temp_norm.shape)
    print(im_sum.shape)
    print(im_sum[range(w-10,w,1)])
    ims = []
    '''
    prj = 0
    for j in range(filter_length, w-filter_length, 1):
        if np.all(im_edge[:,j] > edge_threshold):
            ims.append(im[:,prj:j,:])
            j += 2*filter_length # to avoid very narrow "artefact" images, in case the border is not perfect 
    '''
    return ims

# split the picture in any number of parts by ONLY vertical or horizaontal cuts, and return all of them
def split_picture(im):
    ims = vertical_split(im)
    # no vertical split found -> try horizontal
    if (len(ims) == 1):
        im = np.transpose(im, (1,0,2))
        ims = vertical_split(im)
        for i in range(len(ims)):
            ims[i] = np.transpose(ims[i], (1,0,2))
    
    if (len(ims) == 2):
        print("Successful split!")
    return ims
    
    
if __name__ == "__main__":
    
    # open the file containing initial dataset and read its header
    input = open('VisualBMI_cvs_dump_small.txt', 'r')
    input.readline()

    # iterate throgh all samples and check if each one is valid
    cnt_iter = 0
    for line in input:
        # check if we donwloaded the file
        props = line.split()
        filename = props[6] + ".jpg" 
        img_file = Path("data/" + filename)
        if img_file.is_file():
            # load, remove all countours and overwrite
            print(filename)
            img = mpimg.imread("data/" + filename)
            img = remove_image_contour(img)
            split_picture(img)
            mpimg.imsave("data_prepared/" + filename, img)
        cnt_iter += 1
        #print(cnt_iter, " samples processed.")
    input.close()        
'''        
    props = line.split()
    d = {}
    d["id"] = 1
    d["weight"] = int(props[1])
    d["height"] = int(props[3])
    
    dd = {}
    dd["id"] = 2
    dd["weight"] = int(props[2])
    dd["height"] = int(props[3])
    
    dall = [d,dd]
    
    json.dump(dall,output)
    output.close()
    
    output = open('VisualBMI_extracted.txt', 'r')
    data = json.load(output)
'''    