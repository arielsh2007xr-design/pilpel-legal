import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate, Easing} from 'remotion';

const CREAM = '#FFF6EA', INK = '#2B1D14', ORANGE = '#C05415', GREEN = '#5B7F2B';
const font = {fontFamily: 'Rubik', direction: 'rtl'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const EASE = Easing.bezier(0.22, 1, 0.36, 1);
const INOUT = Easing.bezier(0.65, 0, 0.35, 1);
const src = (p) => staticFile(p);
const P = {x: 216, y: 500, w: 648, h: 1152, r: 64};
const SC = P.w / 1080;
const lerp = (f, a, b, from, to, e = INOUT) => interpolate(f, [a, b], [from, to], {...clamp, easing: e});

// ---------------- text ----------------
const est = (t, b, max = 940) => { const w = t.length * b * 0.52; return w > max ? Math.floor(b * max / w) : b; };
const KLine = ({text, color, size, y, start, stagger = 2.5}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: y, left: 70, right: 70, display: 'flex', justifyContent: 'center', flexWrap: 'wrap', columnGap: size * 0.26, ...font}}>
      {text.split(' ').map((w, i) => {
        const s = spring({frame: f - start - i * stagger, fps, config: {damping: 20, stiffness: 150, mass: 0.9, overshootClamping: true}});
        return <span key={i} style={{display: 'inline-block', whiteSpace: 'nowrap', fontSize: size, fontWeight: 800, color, lineHeight: 1.12, opacity: s, transform: `translateX(${(1 - s) * -28}px) translateY(${(1 - s) * 10}px)`}}>{w}</span>;
      })}
    </div>
  );
};
// one caption block (1-2 lines) in the top band; exits by sliding up
const Caption = ({c}) => {
  const f = useCurrentFrame();
  if (f < c.from || f >= c.to) return null;
  const out = lerp(f, c.to - 10, c.to, 0, 1, EASE);
  const big = c.big ? 100 : 82;
  const sz = Math.min(est(c.l1, big), c.l2 ? est(c.l2, big) : 999);
  const y0 = c.l2 ? 250 : 300;
  return (
    <AbsoluteFill style={{opacity: 1 - out, transform: `translateY(${-out * 30}px)`}}>
      <KLine text={c.l1} color={c.dark ? '#fff' : INK} size={sz} y={y0} start={c.from} />
      {c.l2 && <KLine text={c.l2} color={c.dark ? '#FFD39B' : ORANGE} size={sz} y={y0 + sz * 1.18} start={c.from + 6} />}
    </AbsoluteFill>
  );
};

// ---------------- intro visuals (live inside the card rect) ----------------
const VideoCard = ({i}) => {
  const f = useCurrentFrame();
  const kb = 1.06 + f * 0.0012;
  let prog = 0.36 + f * 0.0006;
  let thumb = false;
  if (i.scrub) {
    for (const [a, b] of i.scrub) {
      if (f >= a && f < b) { thumb = true; prog = lerp(f, a, b, 0.62, 0.3); }
    }
  }
  return (
    <AbsoluteFill style={{background: '#111'}}>
      <Img src={src(i.img)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,.7) 100%)'}} />
      {i.comments && <CommentStream f={f} />}
      <div style={{position: 'absolute', left: 36, right: 36, bottom: 42, height: 8, borderRadius: 4, background: 'rgba(255,255,255,.35)'}}>
        <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${prog * 100}%`, borderRadius: 4, background: '#fff'}} />
        {thumb && <div style={{position: 'absolute', right: `calc(${prog * 100}% - 14px)`, top: -10, width: 28, height: 28, borderRadius: 14, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,.4)'}} />}
      </div>
      {i.smudge && [[180, 380, 120], [460, 700, 90], [300, 900, 100]].map(([x, y, r], k) => (
        <div key={k} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 1.5, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(255,255,255,.45), rgba(255,255,255,0) 70%)', filter: 'blur(4px)'}} />
      ))}
    </AbsoluteFill>
  );
};
const CommentStream = ({f}) => {
  const items = ['מתכון?', 'מתכון בבקשה', 'איפה המתכון?', 'מתכון!!', 'גם אני רוצה', 'מתכון', 'שלחת לי?', 'מתכון בבקשה'];
  const cols = ['#f4a261', '#2a9d8f', '#e76f51', '#8ab17d', '#b5838d', '#e9c46a'];
  const off = f * 4.2;
  return (
    <div style={{position: 'absolute', left: 0, right: 0, top: 520, bottom: 70, overflow: 'hidden', WebkitMaskImage: 'linear-gradient(180deg, transparent 0%, #000 22%, #000 100%)'}}>
      {Array.from({length: 16}).map((_, k) => {
        const y = 60 + k * 96 - off;
        if (y < -100 || y > 600) return null;
        return (
          <div key={k} style={{position: 'absolute', right: 34, top: y, display: 'flex', alignItems: 'center', gap: 16, direction: 'rtl', ...font}}>
            <div style={{width: 54, height: 54, borderRadius: 27, background: cols[k % cols.length]}} />
            <div style={{background: 'rgba(255,255,255,.93)', color: INK, fontSize: 32, fontWeight: 600, padding: '10px 22px', borderRadius: 22}}>{items[k % items.length]}</div>
          </div>
        );
      })}
    </div>
  );
};
const PaperCard = ({i}) => {
  const f = useCurrentFrame();
  const kb = 1.25 - f * 0.0014;
  const scan = i.scan ? lerp(f, i.scan[0], i.scan[1], 0, 1, INOUT) : -1;
  const br = i.scan ? lerp(f, i.scan[0] - 12, i.scan[0], 0, 1, EASE) : 0;
  return (
    <AbsoluteFill style={{background: '#2a1c12', overflow: 'hidden'}}>
      <Img src={src(i.img)} style={{position: 'absolute', height: '100%', left: '50%', transform: `translateX(-50%) scale(${kb})`, filter: 'sepia(.35) brightness(.95)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 40%, rgba(0,0,0,.5) 100%)'}} />
      {br > 0 && [[0, 0], [1, 0], [0, 1], [1, 1]].map(([cx, cy], k) => (
        <div key={k} style={{position: 'absolute', width: 70, height: 70, left: cx ? undefined : 40 + (1 - br) * 30, right: cx ? 40 + (1 - br) * 30 : undefined, top: cy ? undefined : 120 + (1 - br) * 30, bottom: cy ? 120 + (1 - br) * 30 : undefined, opacity: br,
          borderTop: cy ? 'none' : '7px solid #fff', borderBottom: cy ? '7px solid #fff' : 'none', borderLeft: cx ? 'none' : '7px solid #fff', borderRight: cx ? '7px solid #fff' : 'none', borderRadius: 10}} />
      ))}
      {scan >= 0 && scan < 1 && (
        <div style={{position: 'absolute', left: 40, right: 40, top: 120 + scan * (P.h - 240), height: 6, borderRadius: 3, background: ORANGE, boxShadow: `0 0 30px 8px rgba(255,140,60,.55)`}} />
      )}
    </AbsoluteFill>
  );
};
const GridCard = ({i}) => {
  const f = useCurrentFrame();
  const y = f * 7;
  const count = Math.round(lerp(f, 4, 44, 0, 3482, EASE));
  return (
    <AbsoluteFill style={{background: '#f1ebe3', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: -y, left: 10, right: 10, display: 'flex', flexWrap: 'wrap', gap: 10, direction: 'rtl'}}>
        {Array.from({length: 45}).map((_, k) => (
          <div key={k} style={{width: 199, height: 354, borderRadius: 18, overflow: 'hidden', background: '#fff', boxShadow: '0 2px 6px rgba(0,0,0,.08)', position: 'relative'}}>
            <Img src={src(i.imgs[k % i.imgs.length])} style={{width: '100%', height: '62%', objectFit: 'cover'}} />
            <div style={{margin: '14px 14px 6px', height: 14, borderRadius: 7, background: '#e2d8cc'}} />
            <div style={{margin: '6px 14px', height: 14, width: '60%', borderRadius: 7, background: '#ece4da'}} />
            <div style={{margin: '6px 14px', height: 14, width: '75%', borderRadius: 7, background: '#ece4da'}} />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: 30, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
        <div style={{background: 'rgba(43,29,20,.86)', color: '#fff', fontSize: 40, fontWeight: 800, padding: '14px 30px', borderRadius: 40, ...font, fontVariantNumeric: 'tabular-nums'}}>
          <span style={{unicodeBidi: 'isolate', direction: 'ltr', display: 'inline-block'}}>{count.toLocaleString('en-US')}</span> צילומי מסך
        </div>
      </div>
    </AbsoluteFill>
  );
};
const NoteCard = ({i}) => {
  const f = useCurrentFrame();
  const rows = [['12 ביצים', true], ['שוקולד מריר', true], ['סוכר', true], ['קקאו', true], ['חמאה', false]];
  const pulse = 1 + 0.08 * Math.max(0, Math.sin((f - 20) / 5)) * (f > 20 ? 1 : 0);
  return (
    <AbsoluteFill style={{background: '#EDE3D2', overflow: 'hidden'}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 140, bottom: 140, background: '#FFFDF7', borderRadius: 10, transform: `rotate(-2.5deg) scale(${1.02 - f * 0.0003})`, boxShadow: '0 20px 50px rgba(80,50,20,.25)',
        backgroundImage: 'repeating-linear-gradient(180deg, transparent 0, transparent 96px, #d9e4ef 96px, #d9e4ef 99px)', ...font}}>
        <div style={{padding: '46px 50px 0', fontSize: 54, fontWeight: 700, color: '#35506b'}}>לקנות:</div>
        {rows.map(([t, done], k) => (
          <div key={k} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '0 50px', height: 99, marginTop: k ? 0 : 36, fontSize: 50, color: '#35506b', fontWeight: 500}}>
            <div style={{width: 46, height: 46, borderRadius: 23, border: `4px solid ${done ? '#35506b' : ORANGE}`, transform: done ? 'none' : `scale(${pulse})`, background: done ? '#35506b' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 30}}>{done ? '✓' : ''}</div>
            <span style={{textDecoration: done ? 'line-through' : 'none', color: done ? '#7d8fa3' : ORANGE, fontWeight: done ? 500 : 800}}>{t}</span>
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
const Intro = ({i}) => {
  if (i.kind === 'video') return <VideoCard i={i} />;
  if (i.kind === 'paper') return <PaperCard i={i} />;
  if (i.kind === 'grid') return <GridCard i={i} />;
  if (i.kind === 'note') return <NoteCard i={i} />;
  return null;
};

// ---------------- app screens ----------------
const scrollY = (s, f) => s.keys ? interpolate(f, s.keys.map((k) => k[0]), s.keys.map((k) => k[1]), {...clamp, easing: INOUT}) : 0;
const ScreenImg = ({s, f}) => {
  const y = scrollY(s, f);
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: CREAM}}>
      <Img src={src(s.src)} style={{position: 'absolute', top: -y * SC, left: 0, width: P.w}} />
      {s.sticky && (s.sticky.btn ? (
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: (1920 - s.sticky.btn[0] + 40) * SC, background: `linear-gradient(180deg, rgba(255,246,234,0) 0%, ${CREAM} 22%)`}}>
          <div style={{position: 'absolute', left: 60 * SC, width: 960 * SC, top: 40 * SC, height: (s.sticky.btn[1] - s.sticky.btn[0]) * SC, overflow: 'hidden', borderRadius: 48 * SC, boxShadow: '0 10px 24px rgba(192,84,21,.25)'}}>
            <Img src={src(s.sticky.src)} style={{position: 'absolute', left: -60 * SC, top: -s.sticky.btn[0] * SC, width: P.w}} />
          </div>
          <div style={{position: 'absolute', left: '32%', right: '32%', bottom: 16 * SC, height: 12 * SC, borderRadius: 6, background: '#1d1410'}} />
        </div>
      ) : <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: s.sticky.h * SC, overflow: 'hidden'}}><Img src={src(s.sticky.src)} style={{position: 'absolute', bottom: 0, left: 0, width: P.w}} /></div>)}
    </div>
  );
};

// ---------------- animated "Pilpel is cooking" loader ----------------
const CookScene = ({s, f}) => {
  const {fps} = useVideoConfig();
  const t = f - s.from;
  const u = 1 / SC; // work in 1080-space, scaled down
  const bob = Math.sin(t / 5) * 10;
  const stir = Math.sin(t / 4) * 4;
  const prog = lerp(t, 6, s.len - 6, 0, 1, Easing.inOut(Easing.quad));
  const steps = ['קורא את הרילס', 'מוציא כמויות', 'מסדר שלבים'];
  return (
    <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${SC})`, transformOrigin: '0 0', background: CREAM, ...font}}>
      <div style={{position: 'absolute', top: 60, left: 60, right: 60, display: 'flex', justifyContent: 'space-between', fontSize: 42, fontWeight: 600, color: INK}}><span>9:41</span></div>
      <div style={{position: 'absolute', top: 170, right: 60, fontSize: 50, fontWeight: 800, color: INK}}>פלפל עובד על זה</div>
      <div style={{position: 'absolute', top: 270, left: 50, right: 50, height: 190, background: '#fff', borderRadius: 40, boxShadow: '0 6px 20px rgba(80,40,10,.07)', display: 'flex', alignItems: 'center', gap: 30, padding: '0 30px', direction: 'rtl'}}>
        <Img src={src(s.thumb)} style={{width: 130, height: 130, borderRadius: 26, objectFit: 'cover'}} />
        <div><div style={{fontSize: 30, color: ORANGE, fontWeight: 700}}>מאינסטגרם</div><div style={{fontSize: 42, fontWeight: 800, color: INK, marginTop: 6}}>{s.title}</div></div>
      </div>
      {/* steam */}
      {[0, 1, 2].map((k) => {
        const c = ((t + k * 12) % 36) / 36;
        return <div key={k} style={{position: 'absolute', left: 470 + (k - 1) * 70 + Math.sin((t + k * 9) / 6) * 16, top: 700 - c * 170, width: 70, height: 110, borderRadius: '50%', background: 'rgba(255,255,255,.9)', filter: 'blur(14px)', opacity: Math.sin(c * Math.PI) * 0.9}} />;
      })}
      <Img src={src('cooking.png')} style={{position: 'absolute', left: 540 - 205, top: 660 + bob, height: 500, transform: `rotate(${stir}deg)`, transformOrigin: '50% 90%'}} />
      {/* ingredient chips fly out of the pot */}
      {s.chips.map((c, k) => {
        const a = t - 14 - k * 11;
        if (a < 0) return null;
        const up = spring({frame: a, fps, config: {damping: 14, stiffness: 120}});
        const x = 540 + (k - 1) * 270 * up;
        const y = 880 - (k === 1 ? 360 : 290) * up;
        return <div key={k} style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${0.4 + 0.6 * up}) rotate(${(k - 1) * -5 * up}deg)`, opacity: Math.min(1, up * 2),
          background: '#fff', borderRadius: 40, padding: '18px 32px', fontSize: 42, fontWeight: 800, color: INK, boxShadow: '0 12px 30px rgba(120,60,20,.2)', whiteSpace: 'nowrap', direction: 'rtl'}}>{c}</div>;
      })}
      {/* progress */}
      <div style={{position: 'absolute', top: 1170, left: 170, right: 170, height: 16, borderRadius: 8, background: '#F1DDC7', overflow: 'hidden'}}>
        <div style={{position: 'absolute', right: 0, top: 0, bottom: 0, width: `${prog * 100}%`, background: ORANGE, borderRadius: 8}} />
      </div>
      <div style={{position: 'absolute', top: 1240, left: 90, right: 90, background: '#fff', borderRadius: 40, padding: '20px 40px', boxShadow: '0 6px 20px rgba(80,40,10,.07)', direction: 'rtl'}}>
        {steps.map((st, k) => {
          const done = prog > (k + 1) / 3.2;
          const active = !done && prog > k / 3.2;
          const ck = spring({frame: t - (s.len * (k + 1) / 3.4), fps, config: {damping: 14, stiffness: 200}});
          return (
            <div key={k} style={{display: 'flex', alignItems: 'center', gap: 24, height: 110, borderTop: k ? '2px solid #f3e9dd' : 'none'}}>
              <div style={{width: 58, height: 58, borderRadius: 29, background: done ? GREEN : '#f3e9dd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 34, fontWeight: 800, transform: `scale(${done ? 0.8 + 0.2 * ck : 1})`}}>
                {done ? '✓' : active ? <div style={{width: 30, height: 30, borderRadius: 15, border: `5px solid ${ORANGE}`, borderTopColor: 'transparent', transform: `rotate(${t * 18}deg)`}} /> : null}
              </div>
              <span style={{fontSize: 42, fontWeight: done || active ? 800 : 500, color: done || active ? INK : '#a89684'}}>{st}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Screens = ({cfg}) => {
  const f = useCurrentFrame();
  const list = cfg.screens;
  return (
    <>
      {list.map((s, k) => {
        const nxt = list[k + 1];
        if (f < s.from || (nxt && f >= nxt.from + (nxt.dur || 14) + 1)) return null;
        const d = s.dur || 14;
        const p = lerp(f, s.from, s.from + d, 0, 1, INOUT);
        let st = {};
        if (s.enter === 'fade') st = {opacity: p};
        if (s.enter === 'slide') st = {transform: `translateX(${(p - 1) * P.w}px)`, boxShadow: '0 0 40px rgba(0,0,0,.15)'};
        if (s.enter === 'mask') {
          const r = p * 1500;
          st = {clipPath: `circle(${r}px at ${s.mx * P.w}px ${s.my * P.h}px)`};
        }
        let lv = {};
        if (nxt && nxt.enter === 'slide' && f >= nxt.from) {
          const q = lerp(f, nxt.from, nxt.from + (nxt.dur || 14), 0, 1, INOUT);
          lv = {transform: `translateX(${q * P.w * 0.3}px)`, filter: `brightness(${1 - 0.2 * q})`};
        }
        return <div key={k} style={{position: 'absolute', inset: 0, ...st, ...lv}}>{s.type === 'cook' ? <CookScene s={s} f={f} /> : <ScreenImg s={s} f={f} />}</div>;
      })}
    </>
  );
};
// overlays drawn in screen coords
const Overlays = ({cfg}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scr = (at) => [...cfg.screens].reverse().find((s) => s.from <= at);
  return (
    <>
      {(cfg.breakouts || []).map((b, k) => {
        if (f < b.from || f > b.to) return null;
        const s = scr(f);
        const y = scrollY(s, f);
        const lift = Math.sin(lerp(f, b.from, b.to, 0, Math.PI, Easing.linear));
        return (
          <div key={k} style={{position: 'absolute', left: b.x0 * SC, width: (b.x1 - b.x0) * SC, top: (b.y0 - y) * SC, height: (b.y1 - b.y0) * SC, overflow: 'hidden', borderRadius: 18,
            transform: `scale(${1 + 0.1 * lift}) translateY(${-10 * lift}px)`, boxShadow: `0 ${30 * lift}px ${60 * lift}px rgba(80,40,10,${0.35 * lift})`, zIndex: 5}}>
            <Img src={src(s.src)} style={{position: 'absolute', left: -b.x0 * SC, top: -b.y0 * SC, width: P.w}} />
          </div>
        );
      })}
      {(cfg.highlights || []).map((h, k) => {
        if (f < h.from || f > h.to) return null;
        const a = lerp(f, h.from, h.from + 12, 0, 1, EASE) * lerp(f, h.to - 10, h.to, 1, 0, EASE);
        return <div key={k} style={{position: 'absolute', left: h.x * P.w - 14, top: h.y * P.h - 10, width: h.w * P.w + 28, height: h.h * P.h + 20, borderRadius: 22, border: `5px solid ${ORANGE}`, opacity: a, transform: `scale(${0.9 + 0.1 * a})`, boxShadow: '0 0 0 8px rgba(192,84,21,.15)'}} />;
      })}
      {(cfg.checks || []).map((c, k) => {
        if (f < c.at) return null;
        const s = spring({frame: f - c.at, fps, config: {damping: 16, stiffness: 180}});
        const sc = scr(f); const y = scrollY(sc, f);
        const top = (c.y - y) * SC;
        return (
          <React.Fragment key={k}>
            <div style={{position: 'absolute', left: c.x * SC - 26, top: top - 26, width: 52, height: 52, borderRadius: 14, background: GREEN, transform: `scale(${s})`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 34, fontWeight: 800}}>✓</div>
            <div style={{position: 'absolute', right: (1080 - c.x + 70) * SC, top: top - 2, width: c.len * SC * lerp(f, c.at + 4, c.at + 16, 0, 1, EASE), height: 4, background: '#6d5a4a'}} />
          </React.Fragment>
        );
      })}
      {(cfg.timers || []).map((t, k) => {
        if (f < t.at) return null;
        const a = lerp(f, t.at, t.at + 8, 0, 1, EASE);
        const secs = Math.max(0, t.total - Math.floor((f - t.at) / 30));
        const mm = String(Math.floor(secs / 60)).padStart(2, '0'), ss = String(secs % 60).padStart(2, '0');
        const [dx0, dy0, dx1, dy1] = t.digits, [sx0, sy0, sx1, sy1] = t.sub, [cx, cy, r] = t.play;
        return (
          <React.Fragment key={k}>
            <div style={{position: 'absolute', left: dx0 * SC, top: dy0 * SC, width: (dx1 - dx0) * SC, height: (dy1 - dy0) * SC, background: 'rgb(253,227,207)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontSize: 88 * SC, fontWeight: 800, color: '#3d2a1f', fontFamily: 'Rubik', fontVariantNumeric: 'tabular-nums'}}>{mm}:{ss}</div>
            <div style={{position: 'absolute', left: sx0 * SC, top: sy0 * SC, width: (sx1 - sx0) * SC, height: (sy1 - sy0) * SC, background: 'rgb(253,227,207)', display: 'flex', alignItems: 'center', justifyContent: 'flex-start', fontSize: 38 * SC, fontWeight: 700, color: '#b4561c', ...font, opacity: a}}>הטיימר רץ</div>
            <div style={{position: 'absolute', left: (cx - r) * SC, top: (cy - r) * SC, width: r * 2 * SC, height: r * 2 * SC, borderRadius: '50%', background: '#E8732C', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 * SC, transform: `scale(${0.9 + 0.1 * a})`}}>
              <div style={{width: 14 * SC, height: 46 * SC, background: '#fff', borderRadius: 4 * SC}} /><div style={{width: 14 * SC, height: 46 * SC, background: '#fff', borderRadius: 4 * SC}} />
            </div>
            <div style={{position: 'absolute', left: (cx - r) * SC, top: (cy - r) * SC, width: r * 2 * SC, height: r * 2 * SC, borderRadius: '50%', border: `${5 * SC}px solid rgba(232,115,44,.5)`, transform: `scale(${1 + 0.5 * lerp(f, t.at, t.at + 20, 0, 1, EASE)})`, opacity: 1 - lerp(f, t.at, t.at + 20, 0, 1)}} />
          </React.Fragment>
        );
      })}
      {(cfg.typing || []).map((t, k) => (f >= t.from && f < t.to + 12) && (
        <React.Fragment key={k}>
          <div style={{position: 'absolute', right: t.mask[0] * P.w, top: t.mask[1] * P.h, width: t.mask[2] * P.w, height: t.mask[3] * P.h, background: '#fff', opacity: lerp(f, t.to, t.to + 10, 1, 0)}} />
          {f < t.to && <div style={{position: 'absolute', right: t.x * P.w, top: t.y * P.h, fontSize: 30, color: INK, fontWeight: 500, ...font}}>
            {t.text.slice(0, Math.max(0, Math.floor((f - t.from) / t.per)))}<span style={{color: ORANGE, opacity: Math.floor(f / 8) % 2}}>|</span></div>}
        </React.Fragment>
      ))}
      {(cfg.toasts || []).map((t, k) => {
        if (f < t.from || f > t.to) return null;
        const a = lerp(f, t.from, t.from + 12, 0, 1, EASE) * lerp(f, t.to - 10, t.to, 1, 0, EASE);
        return (
          <div key={k} style={{position: 'absolute', left: 40, right: 40, top: 70 + (1 - a) * -60, opacity: a, background: GREEN, color: '#fff', borderRadius: 26, padding: '20px 26px', fontSize: 30, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 14, boxShadow: '0 14px 30px rgba(0,0,0,.2)', ...font}}>
            <span style={{fontSize: 34}}>✓</span>{t.text}
          </div>
        );
      })}
      {(cfg.taps || []).map((t, k) => {
        const a = f - t.at;
        if (a < -6 || a > 18) return null;
        const pre = lerp(a, -6, 0, 0, 1);
        const ring = lerp(a, 0, 16, 0, 1, EASE);
        return (
          <div key={k} style={{position: 'absolute', left: t.x * P.w - 40, top: t.y * P.h - 40, width: 80, height: 80}}>
            <div style={{position: 'absolute', inset: 0, borderRadius: 40, background: 'rgba(40,25,15,.25)', transform: `scale(${a < 0 ? 0.7 + 0.3 * pre : 0.96})`, opacity: a < 0 ? pre : 1 - ring}} />
            <div style={{position: 'absolute', inset: 0, borderRadius: 40, border: '4px solid rgba(255,255,255,.95)', transform: `scale(${1 + ring})`, opacity: a >= 0 ? 1 - ring : 0}} />
          </div>
        );
      })}
    </>
  );
};

// ---------------- stage ----------------
const Stage = ({cfg}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const T = cfg.t; // key times
  // bezel/phone appearance
  const bez = lerp(f, T.phone, T.phone + 18, 0, 1, INOUT);
  // camera
  const cam = cfg.cam;
  const xs = cam.map((c) => c[0]);
  const [s, fx, fy] = [1, 2, 3].map((i) => interpolate(f, xs, cam.map((c) => c[i]), {...clamp, easing: INOUT}));
  const px = P.x + fx * P.w, py = P.y + fy * P.h, cx = P.x + P.w / 2, cy = P.y + P.h / 2;
  const tx = (px - cx) * (1 - s) * 0.7, ty = (py - cy) * (1 - s) * 0.7;
  const tilt = Math.sin(f / 40) * 2.2 * bez;
  const endOut = lerp(f, T.end - 10, T.end + 8, 0, 1, INOUT);
  // intro card: pill morph (ad1) or stays as the screen (others)
  const introOp = cfg.pill ? 1 : lerp(f, T.appIn, T.appIn + 14, 1, 0, INOUT);
  // phone rise when pill mode
  const rise = cfg.pill ? (1 - lerp(f, T.phone, T.phone + 26, 0, 1, EASE)) * 1300 : 0;
  return (
    <AbsoluteFill style={{perspective: 2200}}>
      <div style={{position: 'absolute', left: P.x, top: P.y, width: P.w, height: P.h,
        transform: `translate(${tx}px, ${ty + rise + endOut * 140}px) scale(${s * (1 - 0.12 * endOut)}) rotateY(${tilt}deg)`, opacity: (1 - endOut) * (cfg.pill && f < T.phone ? 0 : 1)}}>
        {/* bezel */}
        <div style={{position: 'absolute', inset: -12 * bez, borderRadius: P.r + 12 * bez, background: '#1d1410', opacity: bez, boxShadow: `0 50px 100px rgba(90,45,10,${0.35 * bez})`}} />
        <div style={{position: 'absolute', inset: 0, borderRadius: P.r, overflow: 'hidden', background: CREAM, boxShadow: bez < 0.5 ? '0 40px 90px rgba(60,30,10,.35)' : 'none'}}>
          {f >= T.appIn - 2 && <Screens cfg={cfg} />}
          {!cfg.pill && introOp > 0 && <AbsoluteFill style={{opacity: introOp}}><Intro i={cfg.intro} /></AbsoluteFill>}
          {cfg.magnet && f < T.appIn + 16 && <Magnet cfg={cfg} />}
          <Overlays cfg={cfg} />
        </div>
      </div>
      {cfg.pill && <Pill cfg={cfg} />}
    </AbsoluteFill>
  );
};
// ad1: the video card becomes a link pill that lands in the paste field
const Pill = ({cfg}) => {
  const f = useCurrentFrame();
  const T = cfg.t;
  if (f > T.pillLand + 12) return null;
  const m = lerp(f, T.pill, T.pill + 22, 0, 1, INOUT); // card -> pill
  const fly = lerp(f, T.pill + 22, T.pillLand, 0, 1, INOUT); // pill -> field
  const rise = (1 - lerp(f, T.phone, T.phone + 26, 0, 1, EASE)) * 1300;
  const field = {x: P.x + 0.08 * P.w, y: P.y + 0.628 * P.h + rise, w: 0.84 * P.w, h: 0.058 * P.h};
  const pill0 = {x: 540 - 230, y: 900, w: 460, h: 96};
  const r = (a, b, t) => a + (b - a) * t;
  const cur = m < 1 ? {x: r(P.x, pill0.x, m), y: r(P.y, pill0.y, m), w: r(P.w, pill0.w, m), h: r(P.h, pill0.h, m)}
    : {x: r(pill0.x, field.x, fly), y: r(pill0.y, field.y, fly) - Math.sin(fly * Math.PI) * 160, w: r(pill0.w, field.w, fly), h: r(pill0.h, field.h, fly)};
  const rad = r(P.r, 48, m);
  const fade = lerp(f, T.pillLand, T.pillLand + 12, 1, 0);
  return (
    <div style={{position: 'absolute', left: cur.x, top: cur.y, width: cur.w, height: cur.h, borderRadius: rad, overflow: 'hidden', opacity: fade,
      boxShadow: '0 30px 70px rgba(60,30,10,.35)', background: '#fff'}}>
      <AbsoluteFill style={{opacity: 1 - lerp(f, T.pill + 6, T.pill + 18, 0, 1)}}><Intro i={cfg.intro} /></AbsoluteFill>
      <AbsoluteFill style={{opacity: lerp(f, T.pill + 10, T.pill + 22, 0, 1), display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, ...font}}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={ORANGE} strokeWidth="2.4" strokeLinecap="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" /></svg>
        <span style={{fontSize: 36, fontWeight: 700, color: INK}}>הקישור לסרטון</span>
      </AbsoluteFill>
    </div>
  );
};
// ad4: tiles collapse magnetically into the phone
const Magnet = ({cfg}) => {
  const f = useCurrentFrame();
  const T = cfg.t;
  const k = lerp(f, T.appIn - 20, T.appIn + 10, 0, 1, INOUT);
  if (k <= 0) return null;
  return (
    <AbsoluteFill>
      {Array.from({length: 9}).map((_, i) => {
        const col = i % 3, row = Math.floor(i / 3);
        const x0 = 20 + col * 210, y0 = 60 + row * 360;
        const x = x0 + (P.w / 2 - 100 - x0) * k, y = y0 + (P.h / 2 - 180 - y0) * k;
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 200, height: 350, borderRadius: 18, overflow: 'hidden', transform: `scale(${1 - 0.7 * k}) rotate(${(i - 4) * 6 * k}deg)`, opacity: Math.min(1, k * 5) * (1 - k * k)}}>
          <Img src={src(cfg.intro.imgs[i % cfg.intro.imgs.length])} style={{width: '100%', height: '100%', objectFit: 'cover'}} /></div>;
      })}
    </AbsoluteFill>
  );
};

// ---------------- end card ----------------
const End = ({cfg}) => {
  const f = useCurrentFrame() - cfg.t.end;
  if (f < 0) return null;
  const a = (d) => lerp(f, d, d + 18, 0, 1, EASE);
  const breathe = 1 + 0.012 * Math.sin(f / 9);
  const sz = est(cfg.endLine, 70);
  return (
    <AbsoluteFill style={{opacity: a(0)}}>
      <div style={{position: 'absolute', left: 340, top: 470, width: 400, height: 400, borderRadius: 90, overflow: 'hidden', opacity: a(2), transform: `translateY(${(1 - a(2)) * 40}px) scale(${breathe})`, boxShadow: '0 30px 70px rgba(120,60,20,.28)'}}>
        <Img src={src('icon.png')} style={{width: 400, height: 400}} />
      </div>
      <div style={{position: 'absolute', top: 910, left: 0, right: 0, textAlign: 'center', fontSize: 170, fontWeight: 800, color: ORANGE, ...font, opacity: a(8), transform: `translateY(${(1 - a(8)) * 24}px)`}}>פלפל</div>
      <div style={{position: 'absolute', top: 1130, left: 70, right: 70, textAlign: 'center', fontSize: sz, fontWeight: 700, color: INK, ...font, opacity: a(14), transform: `translateY(${(1 - a(14)) * 20}px)`}}>{cfg.endLine}</div>
      <div style={{position: 'absolute', left: 250, top: 1260, width: 580, height: 116, borderRadius: 58, background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: a(20), transform: `scale(${(0.94 + 0.06 * a(20)) * breathe})`, boxShadow: '0 16px 36px rgba(192,84,21,.35)', ...font}}>
        <span style={{color: '#fff', fontSize: 56, fontWeight: 800}}>הורידו את פלפל</span>
      </div>
    </AbsoluteFill>
  );
};

export const Flow = ({cfg}) => {
  const f = useCurrentFrame();
  const total = cfg.t.end + cfg.endF;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% ${35 + (f / total) * 25}%, #FFFBF4 0%, ${CREAM} 55%, #F6E2C8 100%)`}}>
      <style>{`@font-face{font-family:'Rubik';src:url('${staticFile('rubik.ttf')}');font-weight:300 900;}`}</style>
      {/* soft drifting food blobs for depth */}
      {[[120, 300, 260, 0.9], [930, 760, 220, 1.3], [160, 1500, 300, 0.7], [900, 1700, 240, 1.1]].map(([x, y, r, sp], k) => (
        <div key={k} style={{position: 'absolute', left: x - r + Math.sin(f / 60 * sp) * 30, top: y - r + Math.cos(f / 70 * sp) * 30, width: r * 2, height: r * 2, borderRadius: '50%', background: k % 2 ? 'rgba(232,140,70,.10)' : 'rgba(192,84,21,.07)', filter: 'blur(40px)'}} />
      ))}
      <Stage cfg={cfg} />
      {cfg.caps.map((c, k) => <Caption key={k} c={c} />)}
      <End cfg={cfg} />
    </AbsoluteFill>
  );
};
