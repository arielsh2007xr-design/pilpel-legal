import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from gen2 import A, foods
END_F = 78
STK = lambda top: {'src': A(top), 'btn': [1644, 1836]}
ADS = {}

# 1 ---- reel link from the comments
ADS['f1-link'] = dict(
    pill=True, intro={'kind': 'video', 'img': A('cake-slice.png'), 'comments': True},
    t={'pill': 50, 'pillLand': 100, 'phone': 60, 'appIn': 60, 'end': 352},
    screens=[{'src': A('paste-empty.png'), 'from': 58, 'enter': 'fade', 'dur': 1},
             {'src': A('paste-filled.png'), 'from': 100, 'enter': 'fade', 'dur': 10},
             {'type': 'cook', 'from': 124, 'enter': 'fade', 'dur': 12, 'len': 62, 'thumb': A('cake-slice.png'), 'title': 'עוגת שוקולד פאדג׳ית', 'chips': ['שוקולד מריר', 'חמאה', 'סוכר']},
             {'src': A('recipe-cake-full.png'), 'from': 186, 'enter': 'mask', 'dur': 22, 'mx': .5, 'my': .768,
              'keys': [[208, 0], [222, 0], [272, 2330]], 'sticky': STK('recipe-cake.png')}],
    taps=[{'x': .5, 'y': .768, 'at': 118}],
    breakouts=[{'from': 280, 'to': 332, 'x0': 60, 'x1': 1020, 'y0': 2548, 'y1': 2716}],
    caps=[{'l1': '״המתכון בתגובות״', 'l2': 'חיפשתי. אין.', 'from': -8, 'to': 56, 'big': True},
          {'l1': 'מדביקים את הקישור.', 'from': 58, 'to': 122},
          {'l1': 'פלפל עובד על זה.', 'from': 122, 'to': 186},
          {'l1': 'כל הכמויות.', 'l2': 'כל השלבים.', 'from': 186, 'to': 296},
          {'l1': 'בלי לחפש בתגובות.', 'from': 296, 'to': 352}],
    cam=[[0, 1, .5, .5], [96, 1, .5, .5], [106, 1.12, .5, .66], [118, 1.12, .5, .66], [128, 1, .5, .5], [186, 1, .5, .5], [276, 1, .5, .5], [290, 1.1, .5, .18], [330, 1.1, .5, .18], [346, 1, .5, .5]],
    endLine='מסרטון למתכון. בשניות.', ding=186)

# 2 ---- grandma's handwritten page
ADS['f2-grandma'] = dict(
    intro={'kind': 'paper', 'img': A('grandma-page.jpg'), 'scan': [38, 66]},
    t={'phone': 64, 'appIn': 72, 'end': 352},
    screens=[{'src': A('scan-sheet.png'), 'from': 72, 'enter': 'fade', 'dur': 14},
             {'type': 'cook', 'from': 124, 'enter': 'fade', 'dur': 12, 'len': 60, 'thumb': A('grandma-page.jpg'), 'title': 'עוגת שמרים של סבתא', 'source': 'מצילום',
              'steps': ['קורא את כתב היד', 'מוציא כמויות', 'מסדר שלבים'], 'chips': ['½ ק״ג קמח', '200 גרם חמאה', '2 ביצים']},
             {'src': A('recipe-grandma-full.png'), 'from': 184, 'enter': 'mask', 'dur': 22, 'mx': .5, 'my': .42,
              'keys': [[206, 0], [218, 0], [268, 2750]], 'sticky': STK('recipe-grandma.png')}],
    taps=[{'x': .5, 'y': .81, 'at': 118}],
    breakouts=[{'from': 276, 'to': 328, 'x0': 60, 'x1': 1020, 'y0': 2966, 'y1': 3128}],
    caps=[{'l1': 'המתכון של סבתא.', 'l2': 'דף אחד. אין גיבוי.', 'from': -8, 'to': 62, 'big': True},
          {'l1': 'מצלמים את הדף.', 'from': 62, 'to': 124},
          {'l1': 'פלפל קורא', 'l2': 'את הכתב של סבתא.', 'from': 124, 'to': 184},
          {'l1': 'והופך אותו', 'l2': 'למתכון מסודר.', 'from': 184, 'to': 300},
          {'l1': 'נשמר לתמיד.', 'from': 300, 'to': 352}],
    cam=[[0, 1, .5, .5], [100, 1, .5, .5], [112, 1.1, .5, .72], [124, 1.1, .5, .72], [138, 1, .5, .5], [272, 1, .5, .5], [284, 1.1, .5, .2], [324, 1.1, .5, .2], [340, 1, .5, .5]],
    endLine='המתכונים של הבית. במקום אחד.', ding=184, shutter=40)

# 3 ---- cooking mode
ADS['f3-cook'] = dict(
    intro={'kind': 'video', 'img': A('pour.png'), 'scrub': [[16, 32], [40, 56]], 'smudge': True},
    t={'phone': 58, 'appIn': 66, 'end': 352},
    screens=[{'src': A('cook-1.png'), 'from': 66, 'enter': 'fade', 'dur': 14},
             {'src': A('cook-2.png'), 'from': 132, 'enter': 'slide', 'dur': 16},
             {'src': A('cook-timer.png'), 'from': 220, 'enter': 'slide', 'dur': 16}],
    timers=[{'at': 252, 'total': 1500, 'digits': [690, 1035, 965, 1125], 'sub': [470, 1146, 965, 1220], 'play': [192, 1116, 72]}],
    taps=[{'x': .32, 'y': .908, 'at': 126}, {'x': .32, 'y': .908, 'at': 214}, {'x': .18, 'y': .58, 'at': 250}],
    highlights=[{'from': 158, 'to': 208, 'x': .525, 'y': .345, 'w': .4, 'h': .065}],
    caps=[{'l1': 'רגע, כמה זמן זה?', 'l2': 'שוב מחזירים אחורה.', 'from': -8, 'to': 58, 'big': True},
          {'l1': 'מצב בישול.', 'l2': 'שלב אחד בכל פעם.', 'from': 60, 'to': 150},
          {'l1': 'הכול כתוב,', 'l2': 'שלב אחרי שלב.', 'from': 150, 'to': 222},
          {'l1': 'טיימר בלחיצה.', 'from': 222, 'to': 300},
          {'l1': 'בלי לגלול. בלי לחפש.', 'from': 300, 'to': 352}],
    cam=[[0, 1, .5, .5], [150, 1, .5, .5], [162, 1.1, .5, .38], [206, 1.1, .5, .38], [218, 1, .5, .5], [256, 1, .5, .5], [270, 1.12, .5, .56], [328, 1.12, .5, .56], [344, 1, .5, .5]],
    endLine='מבשלים. לא גוללים.')

# 4 ---- search across everything
ADS['f4-search'] = dict(
    magnet=True, intro={'kind': 'grid', 'imgs': foods()},
    t={'phone': 56, 'appIn': 62, 'end': 352},
    screens=[{'src': A('home-full.png'), 'from': 62, 'enter': 'fade', 'dur': 14, 'keys': [[82, 0], [140, 1500]], 'sticky': {'src': A('home.png'), 'h': 175}},
             {'src': A('search-empty.png'), 'from': 152, 'enter': 'fade', 'dur': 10},
             {'src': A('search-oof-full.png'), 'from': 198, 'enter': 'fade', 'dur': 12}],
    taps=[{'x': .7, 'y': .965, 'at': 146}, {'x': .5, 'y': .218, 'at': 166}],
    typing=[{'text': 'עוף', 'from': 172, 'to': 198, 'x': .2, 'y': .197, 'per': 7, 'mask': [.19, .19, .6, .055]}],
    breakouts=[{'from': 218, 'to': 270, 'x0': 60, 'x1': 1020, 'y0': 915, 'y1': 1215}],
    caps=[{'l1': '3,482 צילומי מסך.', 'l2': 'איפה המתכון עם העוף?', 'from': -8, 'to': 58, 'big': True},
          {'l1': 'הכול מסודר בפלפל.', 'from': 60, 'to': 156},
          {'l1': 'מחפשים.', 'l2': 'ומוצאים בשנייה.', 'from': 156, 'to': 280},
          {'l1': 'בלי לחפור בגלריה.', 'from': 280, 'to': 352}],
    cam=[[0, 1, .5, .5], [158, 1, .5, .5], [170, 1.14, .5, .22], [200, 1.14, .5, .22], [214, 1, .5, .5]],
    endLine='כל המתכונים. במקום אחד.', counter=True)

# 5 ---- shopping list
ADS['f5-shopping'] = dict(
    intro={'kind': 'note'},
    t={'phone': 56, 'appIn': 62, 'end': 352},
    screens=[{'src': A('recipe-add-list.png'), 'from': 62, 'enter': 'fade', 'dur': 14},
             {'src': A('list-full.png'), 'from': 172, 'enter': 'slide', 'dur': 16, 'keys': [[196, 0], [250, 2150]]}],
    taps=[{'x': .5, 'y': .565, 'at': 118}, {'x': .863, 'y': .18, 'at': 262}],
    toasts=[{'from': 124, 'to': 168, 'text': '7 מצרכים נוספו לרשימה'}],
    checks=[{'at': 264, 'x': 932, 'y': 2500, 'len': 310}],
    caps=[{'l1': 'עמדתי בסופר', 'l2': 'ושכחתי את החמאה.', 'from': -8, 'to': 58, 'big': True},
          {'l1': 'פותחים את המתכון.', 'from': 60, 'to': 150},
          {'l1': 'לחיצה אחת,', 'l2': 'והרשימה מוכנה.', 'from': 150, 'to': 240},
          {'l1': 'מסמנים תוך כדי.', 'from': 240, 'to': 300},
          {'l1': 'הפעם לא שוכחים.', 'from': 300, 'to': 352}],
    cam=[[0, 1, .5, .5], [104, 1, .5, .5], [114, 1.1, .5, .58], [126, 1.1, .5, .58], [140, 1, .5, .5], [252, 1, .5, .5], [262, 1.12, .5, .2], [330, 1.12, .5, .2], [344, 1, .5, .5]],
    endLine='מהמתכון ישר לסופר.')

def events(c):
    F = 30; ev = []
    t = c['t']
    for k in c['caps'][1:]: ev.append(['pop', k['from'] / F])
    ev.append(['whoosh', t['phone'] / F - 0.05])
    if c.get('pill'): ev += [['whoosh', t['pill'] / F], ['click', t['pillLand'] / F]]
    for s in c['screens'][1:]:
        if s['enter'] in ('slide', 'mask'): ev.append(['whoosh', s['from'] / F])
    for tp in c.get('taps', []): ev.append(['click', tp['at'] / F])
    for ty in c.get('typing', []):
        for i in range(len(ty['text'])): ev.append(['click', (ty['from'] + i * ty['per']) / F])
    for b in c.get('breakouts', []): ev.append(['pop', (b['from'] + 6) / F])
    for ch in c.get('checks', []): ev.append(['pop', ch['at'] / F])
    for to in c.get('toasts', []): ev.append(['pop', to['from'] / F])
    if c.get('ding'): ev.append(['ding', c['ding'] / F])
    if c.get('shutter'): ev += [['click', c['shutter'] / F]]
    if c.get('counter'):
        for i in range(12): ev.append(['click', (4 + i * 3.3) / F])
    e = t['end'] / F
    ev += [['whoosh', e - 0.15], ['e1', e + 0.1], ['e2', e + 12 / F], ['e3', e + 20 / F], ['e4', e + 30 / F]]
    return ev

if __name__ == '__main__':
    import audio
    os.makedirs(os.path.join(HERE, 'cfg2'), exist_ok=True); os.makedirs(os.path.join(HERE, 'out2'), exist_ok=True)
    for k, c in ADS.items():
        c['endF'] = END_F; c['id'] = k
        json.dump(c, open(os.path.join(HERE, f'cfg2/{k}.json'), 'w'), ensure_ascii=False, indent=1)
        dur = (c['t']['end'] + END_F) / 30
        ev = events(c)
        for sc in c['screens']:
            if sc.get('type') == 'cook':
                for i in range(3): ev.append(['pop', (sc['from'] + 14 + i * 11) / 30])
        audio.render(ev, dur, os.path.join(HERE, f'out2/a_{k}.wav'), True); audio.render(ev, dur, os.path.join(HERE, f'out2/a_{k}_sfx.wav'), False)
        print(k, round(dur, 2))
