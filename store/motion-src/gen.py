import json, subprocess, sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import numpy as np
FPS = 30; XF = 0.35
CL = {'reel': 'clips_01-paste-reel-fast.mp4', 'home': 'clips_02-home-scroll.mp4', 'scan': 'clips_03-scan-paper-fast.mp4',
      'cook': 'clips_04-cooking-mode.mp4', 'share': 'clips_05-share.mp4', 'shop': 'clips_06-shopping-list.mp4'}
# camera keyframes per clip: (clipTime, scale, fx, fy)
CAM = {
 'reel': [(2.6,1.0,.5,.5),(3.2,1.28,.5,.68),(5.3,1.28,.5,.68),(5.9,1.0,.5,.5),(16.8,1.0,.5,.5),(17.2,1.22,.5,.78),(17.8,1.22,.5,.78),(18.2,1.0,.5,.5),(20.6,1.06,.5,.35),(21.3,1.2,.5,.6),(24.7,1.2,.5,.6)],
 'scan': [(3.0,1.0,.5,.5),(3.6,1.28,.5,.62),(5.8,1.28,.5,.62),(6.3,1.0,.5,.5),(15.3,1.0,.5,.5),(15.7,1.2,.5,.75),(16.8,1.2,.5,.75),(17.2,1.0,.5,.5),(19.6,1.08,.5,.3),(20.4,1.2,.5,.6),(23.05,1.2,.5,.6)],
 'cook': [(0,1.0,.5,.5),(0.9,1.0,.5,.5),(1.4,1.25,.5,.28),(4.6,1.25,.5,.28),(5.3,1.28,.5,.4),(8.03,1.3,.5,.42)],
 'share': [(0,1.0,.5,.5),(1.3,1.0,.5,.5),(1.8,1.25,.5,.72),(4.0,1.25,.5,.72),(4.5,1.0,.5,.5),(7.0,1.05,.5,.4),(7.6,1.15,.5,.55),(10.3,1.15,.5,.55)],
 'shop': [(0,1.0,.5,.5),(2.4,1.0,.5,.5),(2.9,1.25,.5,.55),(4.6,1.25,.5,.55),(5.1,1.0,.5,.5),(5.8,1.25,.5,.55),(8.88,1.25,.5,.55)],
 'home': [(0,1.0,.5,.5),(6.3,1.06,.5,.5)],
}
TAPS = {'reel': [3.98, 5.45, 17.7], 'scan': [4.9, 5.9, 16.9], 'cook': [0.9, 2.5, 4.0, 5.5], 'share': [1.2, 4.3], 'shop': [3.3, 6.3, 7.5], 'home': []}
READY = {'reel': 16.95, 'scan': 15.45}

ADS = {
 '01-reel': dict(hook=('ראיתם מתכון ברילס?', '', None), hookF=36,
   segs=[('reel',2.6,5.5,1.25),('reel',5.5,16.9,4),('reel',16.9,17.7,0.62),('reel',17.7,24.7,1.15)],
   caps=[('ראיתם מתכון ברילס?','מדביקים את הקישור בפלפל',0,2.6),('פלפל קורא את הרילס','ומוציא ממנו מתכון',0,5.8),('תוך שניות:','מתכון מסודר עם כמויות',3,17.9)]),
 '02-grandma': dict(hook=('המתכון של סבתא','על דף שמתפורר?','hugging-book'), hookF=54,
   segs=[('scan',3.0,6.1,1.2),('scan',6.1,15.4,4),('scan',15.4,16.9,1.0),('scan',16.9,23.05,1.15)],
   caps=[('מצלמים את הדף','',0,3.0),('פלפל מפענח','את כתב היד',0,6.3),('והמתכון של סבתא','נשמר לתמיד',3,17.1)]),
 '03-amounts': dict(hook=('עוצרים את הסרטון','כדי לכתוב כמויות?','thinking'), hookF=54,
   segs=[('reel',2.6,5.5,1.25),('reel',5.5,16.9,4),('reel',16.9,17.7,0.62),('reel',17.7,24.7,1.15)],
   caps=[('מדביקים את הקישור','',0,2.6),('פלפל כותב הכל','בשבילך',0,5.8),('כל הכמויות, כל השלבים','בלי לעצור אף סרטון',3,17.9)]),
 '04-comments': dict(hook=('"המתכון בתגובות"','ואתם גוללים שעה?','surprised'), hookF=54,
   segs=[('reel',2.6,5.5,1.25),('reel',5.5,16.9,4),('reel',16.9,17.7,0.62),('reel',17.7,24.7,1.15)],
   caps=[('מדביקים את הקישור בפלפל','',0,2.6),('פלפל מוצא את המתכון','בשבילכם',0,5.8),('המתכון המלא','בלי לחפש בתגובות',3,17.9)]),
 '05-saved300': dict(hook=('300 מתכונים שמורים','ובישלת רק 2?','surprised'), hookF=54,
   segs=[('reel',2.6,5.5,1.25),('reel',5.5,16.9,4),('reel',16.9,17.7,0.62),('reel',17.7,20.4,1.1),('home',0.3,6.3,1.3)],
   caps=[('מדביקים כל מתכון שמור','',0,2.6),('ופלפל הופך אותו','למתכון מסודר',0,5.8),('ועכשיו הם באמת','מחכים לך במקום אחד',4,0.4)]),
 '06-cook': dict(hook=('הידיים בבצק','והמתכון במסך קטן?','cooking'), hookF=54,
   segs=[('cook',0,8.03,1.0)],
   caps=[('מצב בישול:','שלב אחד בכל פעם',0,0),('עם טיימר מובנה','שלא תשכחו כלום',0,5.0)]),
 '07-share': dict(hook=('מתכון בוואטסאפ','בעשר הודעות נפרדות?','surprised'), hookF=54,
   segs=[('share',0,10.3,1.0)],
   caps=[('שולחים קישור אחד','',0,0),('שנפתח יפה','גם בלי האפליקציה',0,4.4)]),
 '08-shopping': dict(hook=('עומדים בסופר','ולא זוכרים מה חסר?','shopping-basket'), hookF=54,
   segs=[('shop',0,8.88,1.0)],
   caps=[('לחיצה אחת במתכון','',0,0),('וכל המצרכים','ברשימת הקניות',0,4.9)]),
 '09-findit': dict(hook=('איפה שמרתי','את המתכון הזה?','thinking'), hookF=54,
   segs=[('home',0,6.3,1.15),('reel',18.0,24.7,1.1)],
   caps=[('כל המתכונים שלך','מסודרים במקום אחד',0,0),('פותחים ומבשלים','בלי לחפש',1,18.2)]),
 '10-gallery': dict(hook=('צילומי מסך של מתכונים','קבורים בגלריה?','taking-photo'), hookF=54,
   segs=[('scan',3.0,6.1,1.2),('scan',6.1,15.4,4),('scan',15.4,16.9,1.0),('scan',16.9,23.05,1.15)],
   caps=[('מעלים את התמונה לפלפל','',0,3.0),('ומקבלים מתכון מסודר','עם כל הכמויות',2,15.5)]),
}
END_F = 80

def build(aid):
    A = ADS[aid]; segs = A['segs']; hookF = A['hookF']
    # timeline
    starts = []; t = 0.0; prev = None
    for i, (c, a, b, sp) in enumerate(segs):
        if prev is not None and not (prev[0] == c and abs(prev[2] - a) < 1e-6):
            t -= XF  # crossfade
        starts.append(t); t += (b - a) / sp; prev = (c, a, b)
    appdur = t
    def c2f(i, c):
        cc, a, b, sp = segs[i]
        return hookF + (starts[i] + (c - a) / sp) * FPS
    # ffmpeg build
    inputs = []; fc = []; labels = []
    for i, (c, a, b, sp) in enumerate(segs):
        inputs += ['-i', CL[c]]
        fc.append(f'[{i}:v]trim={a}:{b},setpts=(PTS-STARTPTS)/{sp},fps=30,scale=1080:1920,format=yuv420p,setsar=1,settb=AVTB[s{i}]')
    cur = 's0'; curdur = (segs[0][2] - segs[0][1]) / segs[0][3]
    for i in range(1, len(segs)):
        d = (segs[i][2] - segs[i][1]) / segs[i][3]
        same = segs[i-1][0] == segs[i][0] and abs(segs[i-1][2] - segs[i][1]) < 1e-6
        if same:
            fc.append(f'[{cur}][s{i}]concat=n=2:v=1,fps=30,settb=AVTB[j{i}]'); curdur += d
        else:
            fc.append(f'[{cur}][s{i}]xfade=transition=fade:duration={XF}:offset={curdur - XF:.3f}[j{i}]'); curdur += d - XF
        cur = f'j{i}'
    app = f'public/app_{aid}.mp4'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', *inputs, '-filter_complex', ';'.join(fc), '-map', f'[{cur}]', '-c:v', 'libx264', '-crf', '14', '-g', '1', '-pix_fmt', 'yuv420p', app], check=True)
    real = float(subprocess.check_output(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', app]))
    appF = int(round(real * FPS))
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', app, '-frames:v', '1', f'public/first_{aid}.png'], check=True)
    # camera
    cam = []
    for i, (c, a, b, sp) in enumerate(segs):
        ks = CAM[c]
        def at(x):
            xs = [k[0] for k in ks]
            return [float(np.interp(x, xs, [k[j] for k in ks])) for j in (1, 2, 3)]
        pts = [(a, *at(a))] + [k for k in ks if a < k[0] < b] + [(b, *at(b))]
        for k in pts:
            f = c2f(i, k[0])
            if cam and f <= cam[-1][0] + 1: continue
            cam.append([f, k[1], k[2], k[3]])
    cam.insert(0, [0, 1.0, .5, .5])
    # captions
    caps = []
    for j, (l1, l2, si, ct) in enumerate(A['caps']):
        s = hookF - 4 if j == 0 else int(c2f(si, ct))
        caps.append({'l1': l1, 'l2': l2, 'start': s})
    for j in range(len(caps)):
        caps[j]['end'] = caps[j+1]['start'] if j + 1 < len(caps) else hookF + appF
    cfg = {'id': aid, 'hook': {'l1': A['hook'][0], 'l2': A['hook'][1], 'pose': A['hook'][2]}, 'hookF': hookF, 'appF': appF, 'endF': END_F,
           'cam': cam, 'caps': caps, 'app': f'app_{aid}.mp4', 'first': f'first_{aid}.png'}
    os.makedirs('cfg', exist_ok=True); json.dump(cfg, open(f'cfg/{aid}.json', 'w'), ensure_ascii=False, indent=1)
    # audio events
    ev = []
    nw = len(A['hook'][0].split()) + len(A['hook'][1].split())
    for k in range(nw): ev.append(['pop', 0.02 + k * 0.1 + (0.1 if k >= len(A['hook'][0].split()) else 0)])
    ev.append(['whoosh', (hookF - 14) / FPS])
    for c in caps[1:]: ev += [['whoosh', c['start'] / FPS - 0.1], ['pop', c['start'] / FPS]]
    for i, (c, a, b, sp) in enumerate(segs):
        for tp in TAPS[c]:
            if a <= tp < b: ev.append(['click', c2f(i, tp) / FPS - 0.03])
        if c in READY and a <= READY[c] < b: ev.append(['ding', c2f(i, READY[c]) / FPS])
    end = (hookF + appF) / FPS
    ev += [['whoosh', end - 0.15], ['e1', end + 0.03], ['e2', end + 8 / 30], ['e3', end + 16 / 30], ['e4', end + 26 / 30]]
    import audio
    dur = (hookF + appF + END_F) / FPS
    audio.render(ev, dur, f'out/a_{aid}.wav', True); audio.render(ev, dur, f'out/a_{aid}_sfx.wav', False)
    print(aid, 'app', real, 'total', dur)

if __name__ == '__main__':
    for a in (sys.argv[1:] or ADS): build(a)
