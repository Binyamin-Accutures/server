import glob,os
import json
import numpy as np
import cv2 as cv
from skimage import io as sio
import matplotlib.pyplot as plt

def SimpleISP(Params: dict):
    InputImagesPaths = GetImagePaths(Params['inputs'])
    ISP_Params = Params['image_processing']
    OutputFolder = Params['outputs']['save_outputs']['dump_folder']
    OutputImages = []
    for ImPath in InputImagesPaths:
        file_name = os.path.basename(ImPath)
        # Read Images from PNG file
        Im = sio.imread(ImPath).astype('float')
        # Dynamic Range stretch
        Im = DynamicRangeStretch(Im,ISP_Params['dynamic_range'])
        # Demosaic
        Im = Demosaic(Im,ISP_Params['demosaic'])
        # Calculate Stokes Parameters
        (Stokes,DoLP,AoLP) = CalcStokesParamsForVideoSequence(Im)
        # Convert the output images to viewable formats
        DoLP_Colorized = Gray2Jet(DoLP)
        S0 = (Stokes[:,:,0]/2*255).astype('uint8')
        AoLP_Colorized = CreateAoLPColorImage(AoLP,DoLP,Stokes[:,:,0]/2,0,Params['outputs']['hsv_rep'])
        # Save Images
        if OutputFolder is not None:
            if not os.path.exists(OutputFolder):
                os.mkdir(OutputFolder)
            dest = os.path.join(OutputFolder,file_name[:-4] + '_S0.png')
            sio.imsave(dest,S0)
            dest = os.path.join(OutputFolder,file_name[:-4] + '_DoLP.png')
            sio.imsave(dest,DoLP_Colorized)
            dest = os.path.join(OutputFolder,file_name[:-4] + '_AoLP.png')
            sio.imsave(dest,AoLP_Colorized)

def DynamicRangeStretch(Im,Params=None):
    Min = Im.min()
    Max = Im.max()
    Out = (Im-Min)/(Max-Min)
    return Out

def Demosaic(Raw,Params=None):
    (H,W) = Raw.shape
    Temp = np.zeros((H,W,4))
    Image4Channel = np.zeros_like(Temp)
    kernel = []
    kernel.append(0.5 *np.array([[0,1,0],[0,0,0],[0,1,0]]))
    kernel.append(0.5 *np.array([[0,0,0],[1,0,1],[0,0,0]]))
    kernel.append(0.25*np.array([[1,0,1],[0,0,0],[1,0,1]]))
    Temp[:,:,0] = Raw
    Level = []
    for i in range(4):
        Level.append(np.zeros_like(Raw))    
    for i in range(3):
        Temp[:,:,i+1] = cv.filter2D(Raw,-1,kernel[i])
    LevelOrder = [[0,1,2,3],[2,3,0,1],[1,0,3,2],[3,2,1,0]]
    for i in range(4):
        Level[i][0::2,0::2] = Temp[0::2,0::2,LevelOrder[i][0]]
        Level[i][1::2,0::2] = Temp[1::2,0::2,LevelOrder[i][1]]
        Level[i][0::2,1::2] = Temp[0::2,1::2,LevelOrder[i][2]]
        Level[i][1::2,1::2] = Temp[1::2,1::2,LevelOrder[i][3]]
    Image4Channel = np.stack((Level[0],Level[1],Level[2],Level[3]),axis=-1)
    return Image4Channel

def CalcStokesParamsForVideoSequence(Im4Channel):
    NumFrames = Im4Channel.shape[0]
    Stokes = np.zeros((Im4Channel.shape[0],Im4Channel.shape[1],3))
    Stokes[:,:,0] = 0.5*Im4Channel.sum(axis=-1) #S0
    Stokes[:,:,1] = Im4Channel[:,:,0]-Im4Channel[:,:,2] #S1
    Stokes[:,:,2] = Im4Channel[:,:,1]-Im4Channel[:,:,3] #S2
    DoLP = np.sqrt(Stokes[:,:,1]*Stokes[:,:,1]+Stokes[:,:,2]*Stokes[:,:,2])/Stokes[:,:,0] #Degree of linear polarization
    DoLP[np.bitwise_or(np.isinf(DoLP),np.isnan(DoLP))] = 0 # correct division by 0
    # DoLP = DoLP[:,None,:,:] #making DoLP 4D vector
    AoLP = 0.5*np.arctan2(Stokes[:,:,2],Stokes[:,:,1])*180/np.pi #Angle of linear polarization
    # AoLP = AoLP[:,None,:,:] #making AoLP 4D vector
    # fig = plt.figure()
    # # imgplot = plt.imshow(DoLP[0,:,:,:].squeeze().cpu(),cmap='jet')
    # imgplot = plt.imshow(Polarized4ChannelVideoSeq[0,0,:,:].squeeze().cpu(),cmap='gray')
    # fig.show()         
    return (Stokes,DoLP,AoLP)

def GetImagePaths(Params: dict):
    InputFolder = Params['input_folder']
    ImList = sorted(glob.glob(InputFolder + r'\*png'))
    if Params['start_frame']<Params['end_frame'] and Params['end_frame'] is not None:
        ImList = ImList[Params['start_frame']:Params['end_frame']+1]
    return ImList

def Gray2Jet(In,DoLPSaturation=1):
    if DoLPSaturation!=1:
        In = In/DoLPSaturation
    In = In.clip(0,1)     
    (H,W) = In.shape
    Map = jet(256)
    In=(In*255).astype('uint8')
    Out = np.zeros((H,W,3))
    for i in range(0,3):
        M = Map[:,i]
        Out[:,:,i] = M[In+1]  
    Out = (Out*255).astype('uint8')
    return Out

def jet(m):
    n = np.int16(np.ceil(m/4))
    u = np.concatenate((np.arange(1,n+1)/n,np.ones((n-1)),np.arange(n,0,-1)/n))
    g = np.int16(np.ceil(n/2) - (np.mod(m,4)==1) + np.arange(1,u.shape[0]+1))
    r = g + n
    b = g - n
    g = np.delete(g,g>m)
    r = np.delete(r,r>m)
    b = np.delete(b,b<1)
    J = np.zeros((m,3))
    J[r-1,0] = u[0:r.shape[0]]
    J[g-1,1] = u[0:g.shape[0]]
    J[b-1,2] = u[-b.shape[0]::]
    return J

def CreateAoLPColorImage(AoLP,DoLP,S0,AoLPOnly,OptParams=None):
    if  AoLP.shape!=DoLP.shape or AoLP.shape!=S0.shape:
        raise(Exception(('AoLP,DoLP, and S0 must be the same size')))
    if OptParams==None:
        OptParams = {}
    [H,W] = AoLP.shape

    #HueScaleFactor is to cover larger part HSV Hue space, the angles are still [-90,90] values range in [1,2]        
    HueScaleFactor = OptParams["hue_scale_factor"] if ('hue_scale_factor' in OptParams.keys()) else 1.5 
    #Controls the general brightness in the AoLP only image
    AoLPBrightness = OptParams["aolp_brightness"] if ('aolp_brightness' in OptParams.keys()) else 0.7
    #Controls the saturation of the DoLP Values
    DoLPSaturation = OptParams["dolp_saturation"] if ('dolp_saturation' in OptParams.keys()) else 1 
    #Controls the minimum S0 to be taken as "0"
    MinS0 = OptParams["MinS0"] if ('MinS0' in OptParams.keys()) else 0
    #Controls the maximum S0 to be taken as "1"
    MaxS0 = OptParams["MaxS0"] if ('MaxS0' in OptParams.keys()) else 1

    AoLP = (AoLP+90)/360*HueScaleFactor*(2*np.pi)
    if DoLPSaturation!=1:
        DoLP = (DoLP/DoLPSaturation)
    if (MinS0!=0 or MaxS0!=1) and not(AoLPOnly):
        if MaxS0<MinS0:
            tmp = MinS0
            MinS0 = MaxS0
            MaxS0 = tmp
        S0 = ((S0-MinS0)/(MaxS0-MinS0)).clip(0,1)
    if AoLPOnly:
        HSV = np.stack((AoLP,DoLP,AoLPBrightness*np.ones_like(AoLP)),dim=2).clip(0,1)
    else:
        HSV = np.stack((AoLP,DoLP,S0),axis=2).clip(0,1)
    AoLP_Im = cv.cvtColor((HSV*255).astype('uint8'), cv.COLOR_HSV2RGB)      
    return AoLP_Im

if __name__ == "__main__":
    cfg = open('SimpleISP_input.json')
    Settings = json.load(cfg)
    SimpleISP(Settings)