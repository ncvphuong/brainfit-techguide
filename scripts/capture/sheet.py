import sys,glob
from PIL import Image
d,out=sys.argv[1],sys.argv[2]; pat=sys.argv[3] if len(sys.argv)>3 else '*.png'
fs=sorted(glob.glob(d+'/'+pat)); ims=[Image.open(f) for f in fs]
W=480; cols=4; rows=(len(ims)+cols-1)//cols
th=[im.resize((W,int(im.height*W/im.width))) for im in ims]
H=[min(700,max(t.height for t in th[r*cols:(r+1)*cols])) for r in range(rows)]
sheet=Image.new('RGB',(W*cols,sum(H)+20*rows),'white'); y=0
for r in range(rows):
    for c in range(cols):
        i=r*cols+c
        if i<len(th): sheet.paste(th[i].crop((0,0,W,min(th[i].height,H[r]))),(c*W,y))
    y+=H[r]+20
sheet.save(out); print([f.split('/')[-1] for f in fs])
