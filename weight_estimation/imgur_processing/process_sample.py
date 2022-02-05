from pathlib import Path
import numpy as np
import matplotlib.image as mpimg
import scipy.signal as scs
from shutil import copyfile

# scales for both thresholds [0,255]
# threshold for defining same-colored rows (RGB_rowmax - RGB_rowmin < threshold for each of the three RGB components) 
color_threshold = 100
# threshold for edge detection on 0: no edge (no gradient of color), 255: max.possible gradient
edge_threshold = 100

# remove all rows composed of pixels of the same color
def remove_equal_rows(im):
    
    [h,w,d] = im.shape
    rm = np.ones(h)
    
    for i in range(h):
        crowmin = np.ndarray.min(im[i,:,:], axis=0)
        crowmax = np.ndarray.max(im[i,:,:], axis=0)
        
        if (np.all((crowmax - crowmin) < color_threshold)):
            rm[i] = 0

    #imr = np.zeros((np.sum(rm.astype(int)), w, d), 'uint8')
    #imr = im[rm > 1e-2,:,:]
    
    return im[rm > 1e-2,:,:]
    

# on some pics the images of before/after are surrounded by frames -> remove those
def remove_image_contour(im):
    # check horizontal rows 
    im = remove_equal_rows(im)
    # and vertical columns
    im = np.transpose(im, (1,0,2))
    im = remove_equal_rows(im)
    return np.transpose(im, (1,0,2))
    
# perform a vertical    
def vertical_split(im):    
    [h,w,d] = im.shape

    # cutting along w dimension -> assume w/8 as a minimal possible width of a picture
    min_width = int(w/8)

    # compute the difference of neighboring pixels in two consecutive columns for the central region of the picture
    im = im.astype(float)
    im_sum = np.zeros(w)
    
    for j in range(min_width, w-min_width, 1):
        im_sum[j] += np.sum(np.absolute(im[:,j,:] - im[:,j-1,:]))
    
    #cut at the line with a huuuge difference between two consecutive columns
    for j in range(min_width, w-min_width, 1):
        if (5*im_sum[j] < im_sum[j+1]):
            im1 = im[:,0:j+1,:] 
            im2 = im[:,j+1:-1,:]
            return True, im1, im2 
    
    im1 = im[:, 0:min_width, :]
    im2 = im[:, min_width:-1, :]
    return False, im1, im2
    '''         
    # cut at the line with maximal difference of the consecutive columns
    idx = np.argmax(im_sum)
    val1_max = im_sum[idx]
    im1 = im[:,0:idx+1,:] 
    im2 = im[:,idx+1:-1,:]
    
    # no image exists in min_width range around the first cut (necessary to prevent thin white stripes that split the images sometimes)
    im_sum[idx-min_width:idx+min_width:1] = 0
    
    # check the second largest cut
    val2_max = np.max(im_sum)
    idx2 = np.argmax(im_sum)
    
    print(filename, val1_max, val2_max, idx, idx2, w)
    # if the first cut is dominant enough -> cut
    if (2*val2_max < val1_max):
        pass
        #mpimg.imsave("data_cut/" + "cut_" + filename, np.hstack((im1.astype('uint8'), np.zeros((h,4*min_width,d)).astype('uint8'), im2.astype('uint8'))))    
        #mpimg.imsave("data_cut/" + "cut_" + filename[:-4] + "__1.jpg", im1.astype('uint8'))
        #mpimg.imsave("data_cut/" + "cut_" + filename[:-4] + "__2.jpg", im2.astype('uint8'))
    else: 
        #mpimg.imsave("data_cut/" + "cut_" + filename, np.hstack((im1.astype('uint8'), im2.astype('uint8'))))
        idx = -1
    
    return (idx > 0), im1, im2
    '''
    
# perform a single valid horizaontal or vertical split (any will do )
def perform_split(im):
    cut, im1, im2 = vertical_split(im)
    # no vertical cut -> try horizontally
    if (cut == False):
        im = np.transpose(im, (1,0,2))
        cut, im1, im2 = vertical_split(im)
        im1 = np.transpose(im1, (1,0,2))
        im2 = np.transpose(im2, (1,0,2))
        im = np.transpose(im, (1,0,2))
    return cut, im1, im2
        
# check if there exists a single cut to split the picture into two parts
def split_picture(im):
    
    cut, im1, im2 = perform_split(im)
    # sanity check on the first cut -> it should split the image into two of roughly the same size
    cut = cut and (2*min(im1.shape[0],im2.shape[0]) > max(im1.shape[0],im2.shape[0]))
    cut = cut and (2*min(im1.shape[1],im2.shape[1]) > max(im1.shape[1],im2.shape[1]))
    
    if (cut):
        cut1, _, _ = perform_split(im1)
        cut2, _, _ = perform_split(im2)
        if (cut1 or cut2):
            print(filename, "mutiple cuts!")
    
    valid = cut and (not cut1) and (not cut2)
         
    return valid, im1, im2
    
def process_image_single(filename):
    # load, remove all countours and overwrite
    img = mpimg.imread("data/" + filename)
    img = remove_image_contour(img)
    return split_picture(img)

# check if there exists any cut to split the picture into two or more parts
def check_cut(im):
    cut, im1, im2 = vertical_split(im)
    if (cut == False):
        im = np.transpose(im, (1,0,2))
        cut, im1, im2 = vertical_split(im)
        im = np.transpose(im, (1,0,2))
    return cut

def process_two_images(filename1, filename2):
    im1 = mpimg.imread("data/" + filename1)
    im1 = remove_image_contour(im1)
    im2 = mpimg.imread("data/" + filename2)
    im2 = remove_image_contour(im2)
    
    return (not check_cut(im1)) and (not check_cut(im2))
    

if __name__ == "__main__":
    
    filename = "4JiKaMG"
    
    img = mpimg.imread(filename + ".jpg")
    img = remove_image_contour(img)
    mpimg.imsave(filename + "_nocontour.jpg", img.astype('uint8'))
    _, im1, im2 = split_picture(img)
    mpimg.imsave(filename + "_split_1.jpg", im1.astype('uint8'))
    mpimg.imsave(filename + "_split_2.jpg", im2.astype('uint8'))    
    _, im11, im12 = split_picture(im1)
    mpimg.imsave(filename + "_split_11.jpg", im11.astype('uint8'))
    mpimg.imsave(filename + "_split_12.jpg", im12.astype('uint8'))

    _, im21, im22 = split_picture(im2)
    mpimg.imsave(filename + "_split_21.jpg", im21.astype('uint8'))
    mpimg.imsave(filename + "_split_22.jpg", im22.astype('uint8'))
    