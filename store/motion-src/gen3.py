import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gen2 import A, foods
M = 62; S = 88; E = 300
def imp(first, tapy, mid, full, top, to):
    return ([{'src': A(first), 'from': S, 'enter': 'fade', 'dur': 16},
             {'src': A(mid), 'from': 124, 'enter': 'fade', 'dur': 14},
             {'type': 'scroll', 'src': A(full), 'from': 156, 'enter': 'fade', 'dur': 16, 'keys': [[176, 0], [198, 0], [266, to]], 'sticky': {'src': A(top), 'h': 270}}],
            [{'x': .5, 'y': tapy, 'at': 114}])
CAM = [[0, 1, .5, .5], [S, 1, .5, .5], [E, 1.07, .5, .5]]
reel = lambda img, **k: dict({'kind': 'reel', 'img': A(img), 'to': M + 30, 'user': 'המטבח של דנה', 'caption': '', 'quiet': True}, **k)
ADS = {}
sc, tp = imp('paste-filled.png', .77, 'loading-3.png', 'recipe-cake-full.png', 'recipe-cake.png', 2150)
ADS['m1-amounts'] = dict(bleed=[reel('pour.png')], cards=[{'l1': 'עוצרת את הרילס', 'l2': 'כדי לרשום כמויות?', 'from': 0, 'to': M + 14}],
    screens=sc, taps=tp, caps=[{'l1': 'פלפל רושם בשבילך', 'l2': 'את כל הכמויות', 'from': M + 12, 'to': E}], cta='תדביקי את הרילס הבא ששמרת')
sc, tp = imp('paste-filled.png', .77, 'loading-3.png', 'recipe-cake-full.png', 'recipe-cake.png', 2150)
ADS['m2-comments'] = dict(bleed=[reel('cake-slice.png', sticker={'text': 'כתבו ״מתכון״ בתגובות', 'at': -30, 'y': 1180})],
    cards=[{'l1': 'כתבת ״מתכון״ בתגובות', 'l2': 'ועדיין מחכה?', 'from': 0, 'to': M + 14}],
    screens=sc, taps=tp, caps=[{'l1': 'מדביקים את הקישור', 'l2': 'ומקבלים את המתכון', 'from': M + 12, 'to': E}], cta='המתכון המלא, תוך שניות')
ADS['m3-saved'] = dict(bleed=[{'kind': 'grid', 'imgs': foods(), 'from': 0, 'to': M + 30, 'calm': True}],
    cards=[{'l1': 'מאות מתכונים שמורים', 'l2': 'ואף פעם לא מוצאת?', 'from': 0, 'to': M + 14}],
    screens=[{'type': 'scroll', 'src': A('home-full.png'), 'from': S, 'enter': 'fade', 'dur': 14, 'keys': [[108, 0], [182, 2400]], 'sticky': {'src': A('home.png'), 'h': 175}},
             {'type': 'scroll', 'src': A('search-oof-full.png'), 'from': 192, 'enter': 'fade', 'dur': 16, 'keys': [[214, 0], [284, 800]], 'sticky': {'src': A('search-oof.png'), 'h': 175}}],
    taps=[], caps=[{'l1': 'כל המתכונים שלך', 'l2': 'מסודרים במקום אחד', 'from': M + 12, 'to': E}], cta='תעבירי את השמורים לפלפל')
sc, tp = imp('scan-sheet.png', .81, 'scan-loading.png', 'recipe-grandma-full.png', 'recipe-grandma.png', 2000)
ADS['m4-grandma'] = dict(bleed=[{'kind': 'paper', 'img': A('grandma-page.jpg'), 'from': 0, 'to': M + 30}],
    cards=[{'l1': 'הדף של סבתא', 'l2': 'מתחיל לדהות?', 'from': 0, 'to': M + 14}],
    screens=sc, taps=tp, caps=[{'l1': 'מצלמים את הדף', 'l2': 'ופלפל שומר אותו לתמיד', 'from': M + 12, 'to': E}], cta='המתכונים של המשפחה, במקום אחד')
ADS['m5-cook'] = dict(bleed=[reel('dough.png', user='אופים עם נועה')], cards=[{'l1': 'ידיים בבצק', 'l2': 'והמתכון בטלפון?', 'from': 0, 'to': M + 14}],
    screens=[{'src': A('cook-1.png'), 'from': S, 'enter': 'fade', 'dur': 14}, {'src': A('cook-timer-running.png'), 'from': 186, 'enter': 'fade', 'dur': 16}],
    taps=[{'x': .3, 'y': .915, 'at': 176}], caps=[{'l1': 'מצב בישול', 'l2': 'שלב אחד בכל פעם', 'from': M + 12, 'to': E}], cta='תבשלי. לא תגללי.')
if __name__ == '__main__':
    import audio
    os.makedirs('cfg2', exist_ok=True); os.makedirs('out2', exist_ok=True)
    for k, c in ADS.items():
        c.update(min=True, morph=M, endAt=E, endF=72, cam=CAM, id=k)
        json.dump(c, open(f'cfg2/{k}.json', 'w'), ensure_ascii=False, indent=1)
        ev = [['whoosh', M / 30 - 0.05]] + [['click', t['at'] / 30] for t in c['taps']]
        e = E / 30
        ev += [['e1', e + 0.1], ['e2', e + 12 / 30], ['e3', e + 20 / 30], ['e4', e + 30 / 30]]
        dur = (E + 72) / 30
        audio.render(ev, dur, f'out2/a_{k}.wav', True); audio.render(ev, dur, f'out2/a_{k}_sfx.wav', False)
        print(k, round(dur, 2))
