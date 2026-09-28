import numpy as np, json, sys
from scipy.io import wavfile
from scipy.signal import butter, lfilter
SR=44100
rng=np.random.default_rng(7)
def env(n,a=0.002,d=0.1):
    t=np.arange(n)/SR; e=np.minimum(1,t/max(a,1e-4))*np.exp(-t/d); return e
def click():
    n=int(0.05*SR); t=np.arange(n)/SR
    s=np.sin(2*np.pi*2400*t)*np.exp(-t/0.008)*0.6+rng.normal(0,1,n)*np.exp(-t/0.003)*0.4
    return s*0.55
def pop():
    n=int(0.14*SR); t=np.arange(n)/SR; f=700*np.exp(-t*18)+180
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t/0.05)*0.8
def whoosh(dur=0.32):
    n=int(dur*SR); x=rng.normal(0,1,n); b,a=butter(2,[600/(SR/2),5000/(SR/2)],'band'); x=lfilter(b,a,x)
    t=np.arange(n)/SR; e=np.sin(np.pi*t/dur)**2; return x*e/np.max(np.abs(x))*0.35
def ding(f=1318.5,dur=0.9,v=0.35):
    n=int(dur*SR); t=np.arange(n)/SR
    s=(np.sin(2*np.pi*f*t)+0.4*np.sin(2*np.pi*f*2*t)+0.2*np.sin(2*np.pi*f*3.01*t))*np.exp(-t/0.25)
    return s*v*np.minimum(1,t/0.003)
def chime(): 
    a=ding(1046.5,0.9,0.28); b=ding(1568,1.0,0.3); out=np.zeros(len(b)+int(0.12*SR)); out[:len(a)]+=a; out[int(0.12*SR):]+=b; return out
def ticks(dur):
    out=np.zeros(int(dur*SR)); c=click()*0.35; step=int(0.14*SR)
    for i in range(0,len(out)-len(c),step): out[i:i+len(c)]+=c*(0.6+0.4*((i//step)%2))
    return out
def bloop():
    n=int(0.22*SR); t=np.arange(n)/SR; f=220+260*(1-np.exp(-t*30))
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.minimum(1,t/0.004)*np.exp(-t/0.08)*0.75
def pluck(f):
    n=int(0.5*SR); t=np.arange(n)/SR
    return (np.sin(2*np.pi*f*t)+0.25*np.sin(2*np.pi*2*f*t))*np.minimum(1,t/0.003)*np.exp(-t/0.12)*0.45
def chime2():
    n=int(1.2*SR); t=np.arange(n)/SR; out=np.zeros(n)
    for f,d in ((783.99,0),(1046.5,0.07)):
        i=int(d*SR); tt=t[:n-i]; out[i:]+=(np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2*f*tt))*np.minimum(1,tt/0.003)*np.exp(-tt/0.35)*0.32
    return out
# ---- music: 104 bpm pop loop
def music(dur):
    bpm=104; beat=60/bpm; n=int(dur*SR); out=np.zeros(n+SR)
    chords=[[261.63,329.63,392.0],[196.0,246.94,293.66],[220.0,261.63,329.63],[174.61,220.0,261.63]] # C G Am F
    bass=[65.41,49.0,55.0,43.65]
    def add(sig,t0):
        i=int(t0*SR); j=min(len(out),i+len(sig)); out[i:j]+=sig[:j-i]
    t=0; k=0
    while t<dur:
        bar=int(t/(beat*4))%4
        # kick on 1,3 ; clap on 2,4 ; hats on 8ths
        b=k%4
        if b in (0,2):
            m=int(0.18*SR); tt=np.arange(m)/SR; f=120*np.exp(-tt*25)+45
            add(np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt/0.12)*0.55,t)
        else:
            m=int(0.15*SR); tt=np.arange(m)/SR; x=rng.normal(0,1,m); bb,aa=butter(2,[900/(SR/2),6000/(SR/2)],'band')
            add(lfilter(bb,aa,x)*np.exp(-tt/0.05)*0.22,t)
        for h in (0,0.5):
            m=int(0.04*SR); tt=np.arange(m)/SR; x=rng.normal(0,1,m); bb,aa=butter(2,7000/(SR/2),'high')
            add(lfilter(bb,aa,x)*np.exp(-tt/0.012)*0.07,t+h*beat)
        # bass on each beat
        m=int(beat*0.9*SR); tt=np.arange(m)/SR; f=bass[bar]
        add((np.sin(2*np.pi*f*tt)+0.3*np.sin(2*np.pi*2*f*tt))*np.exp(-tt/0.35)*0.28,t)
        # pluck chord on offbeats
        for off in (0.5,):
            m=int(0.35*SR); tt=np.arange(m)/SR; s=sum(np.sin(2*np.pi*f2*2*tt)*np.exp(-tt/0.12) for f2 in chords[bar])
            add(s*0.06,t+off*beat)
        t+=beat; k+=1
    out=out[:n]
    fade=int(0.8*SR); out[-fade:]*=np.linspace(1,0,fade); out[:int(0.3*SR)]*=np.linspace(0,1,int(0.3*SR))
    return out
def render(events,dur,path,with_music=True):
    n=int(dur*SR)+SR; mix=np.zeros(n)
    def add(sig,t,v=1.0):
        i=int(t*SR); j=min(n,i+len(sig)); mix[i:j]+=sig[:j-i]*v
    for e in events:
        typ,t=e[0],e[1]
        if typ=='click': add(click(),t)
        elif typ=='pop': add(pop(),t)
        elif typ=='whoosh': add(whoosh(),t)
        elif typ=='ding': add(ding(),t)
        elif typ=='chime': add(chime(),t)
        elif typ=='ticks': pass
        elif typ=='e1': add(bloop(),t)
        elif typ=='e2': add(pluck(523.25),t)
        elif typ=='e3': add(pluck(659.25),t)
        elif typ=='e4': add(chime2(),t)
    if with_music: mix[:int(dur*SR)]+=music(dur)*0.55
    mix=mix[:int(dur*SR)]; mix/=max(1,np.max(np.abs(mix))/0.9)
    wavfile.write(path,SR,(mix*32767).astype(np.int16))
if __name__=='__main__':
    ev=json.load(open(sys.argv[1])); render(ev['events'],ev['dur'],sys.argv[2])
