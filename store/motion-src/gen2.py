import json, os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
PUB = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'public') + '/'
def A(name):
    """real asset if Claude Code delivered it, else placeholder"""
    for d in ('as/', 'ph/'):
        if os.path.exists(PUB + d + name): return d + name
    raise FileNotFoundError(name)
def has(name): return os.path.exists(PUB + 'as/' + name)
def foods():
    if os.path.isdir(PUB + 'as/food'):
        return ['as/food/' + f for f in sorted(os.listdir(PUB + 'as/food'))]
    return [f'ph/food{i}.png' for i in range(4)]

STICKY = lambda: {'src': A('recipe-cake.png'), 'h': 230}

def import_flow(t0, recipe_full='recipe-cake-full.png', recipe_top='recipe-cake.png', scroll_to=2150):
    """paste sheet -> loading -> ready -> recipe scroll, starting at frame t0. returns screens, taps, marks"""
    sc = [{'src': A('paste-filled.png'), 'from': t0, 'enter': 'zoom', 'dur': 12}]
    taps = [{'x': .5, 'y': .77, 'at': t0 + 26}]
    t = t0 + 36
    for i in range(1, 5):
        sc.append({'src': A(f'loading-{i}.png'), 'from': t, 'enter': 'fade', 'dur': 8}); t += 13
    sc.append({'src': A('ready.png'), 'from': t, 'enter': 'fade', 'dur': 10}); ready = t
    taps.append({'x': .5, 'y': .925, 'at': t + 16})
    t += 24
    sc.append({'type': 'scroll', 'src': A(recipe_full), 'from': t, 'enter': 'push', 'dur': 14,
               'keys': [[t + 14, 0], [t + 44, 0], [t + 90, scroll_to]], 'sticky': {'src': A(recipe_top), 'h': 270}})
    return sc, taps, {'ready': ready, 'recipe': t}

ADS = {}
# 1 ---- how many spoons
sc, taps, mk = import_flow(132)
ADS['c1-spoons'] = dict(
    bleed=[{'kind': 'reel', 'img': A('pour.png'), 'to': 150, 'user': 'המטבח של דנה', 'caption': 'עוגת שוקולד בלי קמח. שמרו!',
            'pause': [4, 22, 40], 'scrub': [52, 96], 'share': 100, 'copyTap': 112}],
    cards=[{'l1': 'כמה כפות היא שמה?!', 'from': 3, 'to': 50}, {'l1': 'עוצרת. מחזירה. עוצרת.', 'from': 52, 'to': 97},
           {'l1': 'יש דרך קלה יותר', 'from': 99, 'to': 128, 'y': 520}],
    morph=128, screens=sc, taps=taps,
    caps=[{'l1': 'מדביקים את הקישור בפלפל', 'l2': '', 'from': 132, 'to': mk['ready']},
          {'l1': 'המתכון מוכן', 'l2': 'תוך שניות', 'from': mk['ready'], 'to': mk['recipe'] + 44},
          {'l1': '200 גרם שוקולד. 4 ביצים.', 'l2': 'בלי לעצור אף שנייה', 'from': mk['recipe'] + 44, 'to': mk['recipe'] + 130}],
    cam=[[0, 1, .5, .5], [138, 1, .5, .5], [150, 1.14, .5, .74], [166, 1.14, .5, .74], [178, 1, .5, .5], [mk['recipe'] + 88, 1, .5, .5], [mk['recipe'] + 104, 1.12, .5, .5], [mk['recipe'] + 130, 1.12, .5, .5]],
    endAt=mk['recipe'] + 130, cta='תדביקי את הרילס האחרון ששמרת', ready=mk['ready'])

# 2 ---- comments
sc, taps, mk = import_flow(128)
ADS['c2-comments'] = dict(
    bleed=[{'kind': 'reel', 'img': A('cake-slice.png'), 'to': 150, 'user': 'המטבח של דנה', 'caption': 'העוגה הכי קלה שיש',
            'sticker': {'text': 'כתבו ״מתכון״ בתגובות', 'at': 2, 'y': 280}, 'comments': '3,214'}],
    comments={'from': 34, 'to': 120},
    cards=[{'l1': 'כתבת ״מתכון״ בתגובות?', 'from': 3, 'to': 58, 'y': 620}, {'l1': 'ועדיין מחכה', 'l2': 'שישלחו לך בפרטי…', 'from': 60, 'to': 120, 'y': 170}],
    morph=124, screens=sc, taps=taps,
    caps=[{'l1': 'פשוט מדביקים את הקישור', 'l2': '', 'from': 128, 'to': mk['ready']},
          {'l1': 'הנה.', 'l2': 'כל המתכון.', 'from': mk['ready'], 'to': mk['recipe'] + 60},
          {'l1': 'בלי תגובות.', 'l2': 'בלי לחכות.', 'from': mk['recipe'] + 60, 'to': mk['recipe'] + 124}],
    cam=[[0, 1, .5, .5], [134, 1, .5, .5], [146, 1.14, .5, .74], [162, 1.14, .5, .74], [174, 1, .5, .5]],
    endAt=mk['recipe'] + 124, cta='המתכון המלא, תוך שניות', ready=mk['ready'])

# 3 ---- 300 saved / 0 cooked
t = 126
sc3 = [{'src': A('home.png'), 'from': t, 'enter': 'fade', 'dur': 10}]
taps3 = []
if has('home-full.png'):
    sc3 = [{'type': 'scroll', 'src': A('home-full.png'), 'from': t, 'enter': 'fade', 'dur': 10, 'keys': [[t + 20, 0], [t + 72, 2400]], 'sticky': {'src': A('home.png'), 'h': 175}}]
typing = []
if has('search-empty.png'):
    taps3.append({'x': .7, 'y': .965, 'at': 196})
    taps3.append({'x': .5, 'y': .217, 'at': 214})
    sc3 += [{'src': A('search-empty.png'), 'from': 204, 'enter': 'fade', 'dur': 8},
            {'type': 'scroll', 'src': A('search-oof-full.png'), 'from': 252, 'enter': 'fade', 'dur': 8, 'keys': [[270, 0], [320, 900]], 'sticky': {'src': A('search-oof.png'), 'h': 175}}]
    typing.append({'text': 'עוף', 'from': 222, 'to': 256, 'x': .2, 'y': .196, 'per': 7, 'size': 40, 'mask': [.19, .185, .66, .05]})
r0 = 336
ADS['c3-saved'] = dict(
    bleed=[{'kind': 'grid', 'imgs': foods(), 'from': 0, 'to': 126, 'slowAt': 70, 'deadAt': 72, 'deadIndex': 40}],
    cards=[{'l1': '300 מתכונים שמורים.', 'l2': '0 בישלת.', 'red': True, 'from': 3, 'to': 68}, {'l1': 'איפה המתכון ההוא', 'l2': 'עם העוף?', 'from': 72, 'to': 120}],
    morph=122, screens=sc3, taps=taps3, typing=typing,
    caps=[{'l1': 'בפלפל כל המתכונים', 'l2': 'מסודרים במקום אחד', 'from': 126, 'to': 204},
          {'l1': 'מחפשת ״עוף״.', 'l2': 'מוצאת.', 'from': 204, 'to': 290},
          {'l1': 'והפעם', 'l2': 'את מבשלת.', 'from': 290, 'to': r0}],
    cam=[[0, 1, .5, .5], [208, 1, .5, .5], [218, 1.15, .5, .3], [250, 1.15, .5, .3], [262, 1, .5, .5]], endAt=r0, cta='תעבירי את השמורים לפלפל')

# 4 ---- grandma
g = 196
ADS['c4-grandma'] = dict(
    bleed=[{'kind': 'paper', 'img': A('grandma-page.jpg' if has('grandma-page.jpg') else 'grandma-page.png'), 'from': 0, 'to': 150, 'stain': [58, 104], 'flash': 116}],
    cards=[{'l1': 'הדף של סבתא', 'l2': 'כבר דהוי', 'from': 3, 'to': 56}, {'l1': 'עוד כתם אחד…', 'l2': 'והוא נעלם', 'from': 58, 'to': 110},
           {'l1': 'צלמי אותו. זה הכל.', 'from': 110, 'to': 128, 'y': 520}],
    morph=122,
    screens=[{'src': A('scan-sheet.png'), 'from': 128, 'enter': 'zoom', 'dur': 12},
             {'src': A('scan-loading.png'), 'from': 162, 'enter': 'fade', 'dur': 10},
             {'type': 'scroll', 'src': A('recipe-grandma-full.png'), 'from': g, 'enter': 'push', 'dur': 14,
              'keys': [[g + 14, 0], [g + 40, 0], [g + 95, 2000]], 'sticky': {'src': A('recipe-grandma.png'), 'h': 270}}],
    taps=[{'x': .5, 'y': .81, 'at': 154}],
    caps=[{'l1': 'תמונה אחת', 'l2': 'והמתכון מפוענח', 'from': 128, 'to': g},
          {'l1': 'המתכון של סבתא רחל', 'l2': 'נשמר לתמיד', 'from': g, 'to': 318},
          {'l1': 'שולחים לכל המשפחה', 'l2': 'בקישור אחד', 'from': 318, 'to': 420}],
    chat={'from': 318, 'to': 420, 'og': A('og-card.png') if has('og-card.png') else A('recipe-grandma.png'), 'title': 'עוגת שמרים של סבתא רחל'},
    cam=[[0, 1, .5, .5]], endAt=420, cta='המתכונים של המשפחה, במקום אחד', shutter=116)

# 5 ---- greasy hands / cooking mode
ADS['c5-cook'] = dict(
    bleed=[{'kind': 'reel', 'img': A('dough.png'), 'to': 150, 'user': 'אופים עם נועה', 'caption': 'חלה רכה כמו ענן',
            'smudge': True, 'dimAt': 34, 'scrub': [88, 122], 'pause': [90, 108]}],
    cards=[{'l1': 'ידיים בבצק.', 'l2': 'והמסך נכבה.', 'from': 3, 'to': 84}, {'l1': 'ושוב מריצה אחורה…', 'from': 86, 'to': 124}],
    morph=126,
    screens=[{'src': A('cook-1.png'), 'from': 130, 'enter': 'fade', 'dur': 10},
             {'src': A('cook-2.png'), 'from': 196, 'enter': 'push', 'dur': 14},
             {'src': A('cook-timer.png'), 'from': 248, 'enter': 'push', 'dur': 14},
             {'src': A('cook-timer-running.png'), 'from': 284, 'enter': 'fade', 'dur': 14}],
    taps=[{'x': .3, 'y': .915, 'at': 188}, {'x': .3, 'y': .915, 'at': 240}, {'x': .17, 'y': .585, 'at': 280}],
    caps=[{'l1': 'מצב בישול:', 'l2': 'שלב אחד בכל פעם', 'from': 130, 'to': 248}, {'l1': 'טיימר?', 'l2': 'כבר מוכן.', 'from': 248, 'to': 340}],
    cam=[[0, 1, .5, .5], [140, 1, .5, .5], [156, 1.12, .5, .32], [184, 1.12, .5, .32], [194, 1, .5, .5], [262, 1, .5, .5], [274, 1.15, .5, .55], [320, 1.15, .5, .55]],
    endAt=340, cta='תבשלי. לא תגללי.')

def audio_events(c):
    ev = []
    F = 30
    for k in c['cards']:
        n = len((k['l1'] + ' ' + k.get('l2', '')).split())
        ev.append(['pop', k['from'] / F])
    for b in c['bleed']:
        for p in b.get('pause', []): ev.append(['click', p / F])
        if b.get('copyTap'): ev.append(['click', b['copyTap'] / F])
        if b.get('share'): ev.append(['whoosh', b['share'] / F])
        if b.get('dimAt'): ev.append(['click', (b['dimAt'] + 10) / F])
    ev.append(['whoosh', c['morph'] / F - 0.05])
    for s in c['screens'][1:]:
        if s.get('enter') in ('push', 'sheet'): ev.append(['whoosh', s['from'] / F])
    for t in c['taps']: ev.append(['click', t['at'] / F])
    for t in c.get('typing', []):
        for i in range(len(t['text'])): ev.append(['click', (t['from'] + i * t['per']) / F])
    if c.get('ready'): ev.append(['ding', c['ready'] / F])
    for k in c['caps'][1:]: ev.append(['pop', k['from'] / F])
    if c.get('comments'):
        for i in range(0, 14, 3): ev.append(['pop', (c['comments']['from'] + i * 2.2) / F])
    if c.get('chat'): ev += [['whoosh', c['chat']['from'] / F], ['pop', (c['chat']['from'] + 12) / F], ['pop', (c['chat']['from'] + 40) / F], ['pop', (c['chat']['from'] + 56) / F]]
    if c.get('shutter'): ev += [['click', c['shutter'] / F], ['whoosh', c['shutter'] / F]]
    e = c['endAt'] / F
    ev += [['whoosh', e - 0.12], ['e1', e + 0.03], ['e2', e + 8 / F], ['e3', e + 16 / F], ['e4', e + 26 / F]]
    return ev

if __name__ == '__main__':
    import audio
    os.makedirs('cfg2', exist_ok=True); os.makedirs('out2', exist_ok=True)
    for k, c in ADS.items():
        c['endF'] = 76; c['id'] = k
        json.dump(c, open(f'cfg2/{k}.json', 'w'), ensure_ascii=False, indent=1)
        dur = (c['endAt'] + c['endF']) / 30
        ev = audio_events(c)
        audio.render(ev, dur, f'out2/a_{k}.wav', True); audio.render(ev, dur, f'out2/a_{k}_sfx.wav', False)
        print(k, round(dur, 2))
