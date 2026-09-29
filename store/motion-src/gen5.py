import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from gen2 import A, has
from gen4 import events, END_F

def pick(name, fallback):
    return A(name) if has(name) else A(fallback)

# first-ingredient-row coordinates in recipe-<key>-full.png (x0, x1, y0, y1); filled in from Claude Code's reply
ROWS = json.load(open(os.path.join(HERE, 'rows.json'))) if os.path.exists(os.path.join(HERE, 'rows.json')) else {}
PASTE_BTN = {}

def viral(key, title, chips, hook, closing, endLine):
    img = pick(f'{key}.png', 'cake-slice.png')
    full = pick(f'recipe-{key}-full.png', 'recipe-cake-full.png')
    top = pick(f'recipe-{key}.png', 'recipe-cake.png')
    paste = pick(f'paste-filled-{key}.png', 'paste-filled.png')
    x0, x1, y0, y1 = ROWS.get(key, [60, 1020, 2548, 2716])
    by = PASTE_BTN.get(key, .768)
    Y = max(0, y0 - 220)
    return dict(
        pill=True, intro={'kind': 'video', 'img': img},
        t={'pill': 50, 'pillLand': 100, 'phone': 60, 'appIn': 60, 'end': 352},
        screens=[{'src': A('paste-empty.png'), 'from': 58, 'enter': 'fade', 'dur': 1},
                 {'src': paste, 'from': 100, 'enter': 'fade', 'dur': 10},
                 {'type': 'cook', 'from': 122, 'enter': 'fade', 'dur': 12, 'len': 76, 'thumb': img, 'title': title, 'chips': chips},
                 {'src': full, 'from': 198, 'enter': 'mask', 'dur': 22, 'mx': .5, 'my': .42,
                  'keys': [[220, 0], [236, 0], [286, Y]], 'sticky': {'src': top, 'btn': [1644, 1836]}}],
        taps=[{'x': .5, 'y': by, 'at': 116}],
        breakouts=[{'from': 292, 'to': 344, 'x0': x0, 'x1': x1, 'y0': y0, 'y1': y1}],
        caps=[{'l1': hook[0], 'l2': hook[1], 'from': -8, 'to': 56, 'big': True},
              {'l1': 'מדביקים את הקישור', 'l2': 'בפלפל.', 'from': 58, 'to': 122},
              {'l1': 'פלפל הופך את הסרטון', 'l2': 'למתכון.', 'from': 122, 'to': 198},
              {'l1': 'כל הכמויות.', 'l2': 'כל השלבים.', 'from': 198, 'to': 300},
              {'l1': closing, 'from': 300, 'to': 352}],
        cam=[[0, 1, .5, .5], [96, 1, .5, .5], [106, 1.12, .5, .66], [118, 1.12, .5, .66], [128, 1, .5, .5],
             [290, 1, .5, .5], [302, 1.1, .5, .2], [338, 1.1, .5, .2], [348, 1, .5, .5]],
        endLine=endLine, ding=198)

ADS = {
 'v1-steak': viral('steak', 'סטייק אנטריקוט בחמאה ושום', ['2 סטייקים', '50 גרם חמאה', '4 שיני שום'],
                   ('סטייק מושלם ברילס,', 'ואין מתכון בתיאור?'), 'גם כשהמתכון רק בסרטון.', 'מכל רילס, מתכון מסודר.'),
 'v2-pancakes': viral('pancakes', 'פנקייקים אווריריים', ['2 כוסות קמח', 'כוס וחצי חלב', '2 ביצים'],
                      ('פנקייקים כאלה ברילס?', 'בלי לעצור את הסרטון.'), 'כמה קמח? כמה חלב? הכול כתוב.', 'מהרילס, ישר למחבת.'),
 'v3-cinnabon': viral('cinnabon', 'סינבון רך', ['3 וחצי כוסות קמח', '2 כפות קינמון', '100 גרם חמאה'],
                      ('שמרתם עוד רילס של סינבון', 'ואף פעם לא אפיתם?'), 'הפעם זה מתכון אמיתי.', 'מהשמורים, ישר לתנור.'),
 'v4-pasta': viral('pasta', 'פסטה רוזה בוודקה', ['400 גרם ריגטוני', 'כוס שמנת', 'חצי כוס פרמזן'],
                   ('הפסטה מהרילס,', 'אבל כמה שמנת?'), 'כל כמות, בדיוק כמו בסרטון.', 'מכל רילס, מתכון מסודר.'),
}

if __name__ == '__main__':
    import audio
    for k, c in ADS.items():
        c['endF'] = END_F; c['id'] = k
        json.dump(c, open(os.path.join(HERE, f'cfg2/{k}.json'), 'w'), ensure_ascii=False, indent=1)
        dur = (c['t']['end'] + END_F) / 30
        ev = events(c)
        for i in range(3): ev.append(['pop', (122 + 14 + i * 11) / 30])
        audio.render(ev, dur, os.path.join(HERE, f'out2/a_{k}.wav'), True); audio.render(ev, dur, os.path.join(HERE, f'out2/a_{k}_sfx.wav'), False)
        print(k, round(dur, 2))
