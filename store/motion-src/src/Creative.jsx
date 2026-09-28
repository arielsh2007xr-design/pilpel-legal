import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, Sequence} from 'remotion';

const CREAM = '#FFF6EA', INK = '#2B1D14', ORANGE = '#C05415';
const font = {fontFamily: 'Rubik', direction: 'rtl'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};
const smooth = Easing.bezier(0.65, 0, 0.35, 1);
const PH = {x: 90, y: 330, w: 900, h: 1600, r: 72};
const src = (p) => staticFile(p);

// ---------- text ----------
const Words = ({text, color, size, start, y, weight = 800, boxed}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  return (
    <div style={{position: 'absolute', top: y, left: 50, right: 50, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.26, rowGap: 8, ...font}}>
      {words.map((w, i) => {
        const s = spring({frame: frame - start - i * 2, fps, config: {damping: 14, stiffness: 190, mass: 0.55}});
        return (
          <span key={i} style={{fontSize: size, fontWeight: weight, color, display: 'inline-block', whiteSpace: 'nowrap', opacity: Math.min(1, s * 1.6),
            transform: `translateY(${(1 - s) * 34}px) scale(${0.92 + 0.08 * s})`,
            ...(boxed ? {background: 'rgba(20,12,8,0.78)', padding: `${size * 0.1}px ${size * 0.2}px`, borderRadius: size * 0.18} : {})}}>{w}</span>
        );
      })}
    </div>
  );
};
const est = (t, b) => { const w = t.length * b * 0.55; return w > 960 ? Math.floor(b * 960 / w) : b; };

// caption on the cream page, above the phone
const TopCaption = ({l1, l2, from, to}) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const out = interpolate(f, [to - 7, to], [1, 0], clamp);
  const sz = Math.min(est(l1, 86), l2 ? est(l2, 86) : 99);
  return (
    <AbsoluteFill style={{opacity: out, transform: `translateY(${(1 - out) * -20}px)`}}>
      <Words text={l1} color={INK} size={sz} start={from} y={l2 ? 64 : 110} />
      {l2 && <Words text={l2} color={ORANGE} size={sz} start={from + 5} y={64 + sz * 1.3} />}
    </AbsoluteFill>
  );
};

// native-style boxed card over full-bleed footage
const BleedCard = ({l1, l2, from, to, y = 640, red}) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const out = interpolate(f, [to - 6, to], [1, 0], clamp);
  const sz = Math.min(est(l1, 92), l2 ? est(l2, 92) : 99);
  return (
    <AbsoluteFill style={{opacity: out}}>
      <BoxLine text={l1} color="#fff" size={sz} start={from} y={y} />
      {l2 && <BoxLine text={l2} color={red ? '#FF5A4E' : '#FFD9A8'} size={sz * (red ? 1.2 : 1)} start={from + 8} y={y + sz * 1.6} />}
    </AbsoluteFill>
  );
};

const BoxLine = ({text, color, size, start, y}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const b = spring({frame: f - start, fps, config: {damping: 15, stiffness: 200, mass: 0.6}});
  return (
    <div style={{position: 'absolute', top: y, left: 0, right: 0, display: 'flex', justifyContent: 'center'}}>
      <div style={{background: 'rgba(18,10,6,0.82)', borderRadius: size * 0.22, padding: `${size * 0.12}px ${size * 0.3}px`, transform: `scale(${0.85 + 0.15 * b})`, opacity: Math.min(1, b * 2), display: 'flex', columnGap: size * 0.26, ...font}}>
        {text.split(' ').map((w, i) => {
          const s = spring({frame: f - start - 2 - i * 2, fps, config: {damping: 14, stiffness: 190, mass: 0.55}});
          return <span key={i} style={{fontSize: size, fontWeight: 800, color, display: 'inline-block', whiteSpace: 'nowrap', opacity: Math.min(1, s * 1.6), transform: `translateY(${(1 - s) * 22}px)`}}>{w}</span>;
        })}
      </div>
    </div>
  );
};


// ---------- minimal style ----------
const ease = Easing.bezier(0.22, 1, 0.36, 1);
const Line = ({text, color, size, y, start, end, shadow, weight = 800}) => {
  const f = useCurrentFrame();
  const a = interpolate(f, [start, start + 14], [0, 1], {...clamp, easing: ease});
  const b = end ? interpolate(f, [end - 10, end], [1, 0], {...clamp, easing: ease}) : 1;
  return (
    <div style={{position: 'absolute', top: y, left: 60, right: 60, textAlign: 'center', fontSize: size, fontWeight: weight, color, lineHeight: 1.15, ...font,
      opacity: a * b, transform: `translateY(${(1 - a) * 26 - (1 - b) * 12}px)`, textShadow: shadow ? '0 4px 24px rgba(0,0,0,.55), 0 2px 6px rgba(0,0,0,.45)' : 'none'}}>{text}</div>
  );
};
const HookText = ({l1, l2, from, to, y = 300}) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const sz = Math.min(est(l1, 104), l2 ? est(l2, 104) : 999);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.55) 0%, rgba(0,0,0,.25) 38%, rgba(0,0,0,0) 55%)', opacity: interpolate(f, [from, from + 10, to - 10, to], [0, 1, 1, 0], clamp)}} />
      <Line text={l1} color="#fff" size={sz} y={y} start={from} end={to} shadow />
      {l2 && <Line text={l2} color="#FFD9A8" size={sz} y={y + sz * 1.22} start={from + 6} end={to} shadow />}
    </AbsoluteFill>
  );
};
const CalmCaption = ({l1, l2, from, to}) => {
  const f = useCurrentFrame();
  if (f < from || f >= to) return null;
  const sz = Math.min(est(l1, 80), l2 ? est(l2, 80) : 999);
  return (
    <AbsoluteFill>
      <Line text={l1} color={INK} size={sz} y={l2 ? 70 : 118} start={from} end={to} />
      {l2 && <Line text={l2} color={ORANGE} size={sz} y={70 + sz * 1.2} start={from + 6} end={to} />}
    </AbsoluteFill>
  );
};
const EndCalm = ({cta}) => {
  const f = useCurrentFrame();
  const a = (d) => interpolate(f, [d, d + 16], [0, 1], {...clamp, easing: ease});
  const breathe = 1 + 0.012 * Math.sin(f / 9);
  const sz = est(cta, 74);
  return (
    <AbsoluteFill style={{background: CREAM}}>
      <div style={{position: 'absolute', top: 300, left: 60, right: 60, textAlign: 'center', fontSize: sz, fontWeight: 800, color: INK, ...font, opacity: a(0), transform: `translateY(${(1 - a(0)) * 20}px)`}}>{cta}</div>
      <div style={{position: 'absolute', left: 340, top: 600, width: 400, height: 400, borderRadius: 90, overflow: 'hidden', opacity: a(6), transform: `scale(${(0.9 + 0.1 * a(6)) * breathe})`, boxShadow: '0 30px 70px rgba(120,60,20,0.28)'}}>
        <Img src={src('icon.png')} style={{width: 400, height: 400}} />
      </div>
      <div style={{position: 'absolute', top: 1060, left: 0, right: 0, textAlign: 'center', fontSize: 170, fontWeight: 800, color: ORANGE, ...font, opacity: a(12), transform: `translateY(${(1 - a(12)) * 20}px)`}}>פלפל</div>
      <div style={{position: 'absolute', left: 260, top: 1330, width: 560, height: 116, borderRadius: 58, background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: a(18), transform: `scale(${(0.94 + 0.06 * a(18)) * breathe})`, ...font}}>
        <span style={{color: '#fff', fontSize: 60, fontWeight: 800}}>חינם בחנות</span>
      </div>
    </AbsoluteFill>
  );
};

// ---------- full-bleed "pain" scenes ----------
const Icon = ({d, label, y}) => (
  <div style={{position: 'absolute', right: 34, top: y, width: 90, textAlign: 'center', color: '#fff', ...font}}>
    <svg width="74" height="74" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{filter: 'drop-shadow(0 2px 4px rgba(0,0,0,.5))'}}><path d={d} /></svg>
    {label && <div style={{fontSize: 30, fontWeight: 600, marginTop: 2, textShadow: '0 2px 6px rgba(0,0,0,.6)'}}>{label}</div>}
  </div>
);
const HEART = 'M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z';
const BUBBLE = 'M21 11.5a8.4 8.4 0 0 1-12.2 7.5L3 21l2-5.3A8.5 8.5 0 1 1 21 11.5z';
const SEND = 'M22 2 11 13M22 2l-7 20-4-9-9-4 20-7z';
const BOOK = 'M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z';

const Reel = ({c}) => {
  const quiet = c.quiet;
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const kb = interpolate(f, [0, c.to], [1.06, 1.16]);
  // scrub jitter: progress bar thumb goes back and forth
  let prog = interpolate(f, [0, c.to], [0.34, 0.42]);
  let shift = 0;
  if (c.scrub && f >= c.scrub[0] && f < c.scrub[1]) {
    const t = (f - c.scrub[0]) / 30;
    const j = Math.sin(t * 9) * 0.5 + Math.sin(t * 23) * 0.2;
    prog = 0.38 + j * 0.12; shift = j * 26;
  }
  const paused = c.pause && c.pause.some((p) => f >= p && f < p + 9);
  const dim = c.dimAt ? interpolate(f, [c.dimAt, c.dimAt + 12, c.dimAt + 40, c.dimAt + 50], [0, 0.93, 0.93, 0], clamp) : 0;
  const stk = c.sticker ? spring({frame: f - (c.sticker.at || 0), fps, config: {damping: 11, stiffness: 160}}) : 0;
  const share = c.share ? spring({frame: f - c.share, fps, config: {damping: 14, stiffness: 170}}) : 0;
  return (
    <AbsoluteFill style={{background: '#000', overflow: 'hidden'}}>
      <Img src={src(c.img)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb}) translateX(${shift}px)`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,.35) 0%, rgba(0,0,0,0) 18%, rgba(0,0,0,0) 62%, rgba(0,0,0,.7) 100%)'}} />
      {!quiet && <div style={{position: 'absolute', top: 70, left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 40, fontWeight: 700, ...font, textShadow: '0 2px 6px rgba(0,0,0,.5)'}}>רילס</div>}
      <Icon d={HEART} label={c.likes || '12.4K'} y={1050} />
      <Icon d={BUBBLE} label={c.comments || '3,214'} y={1200} />
      <Icon d={SEND} label="" y={1350} />
      <Icon d={BOOK} label="" y={1470} />
      <div style={{position: 'absolute', right: 150, left: 60, top: 1560, color: '#fff', ...font, textShadow: '0 2px 6px rgba(0,0,0,.6)'}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 18, fontSize: 40, fontWeight: 700}}>
          <div style={{width: 70, height: 70, borderRadius: 35, background: 'linear-gradient(135deg,#f7b267,#c05415)', border: '3px solid #fff'}} />
          {c.user}
          <span style={{border: '2px solid #fff', borderRadius: 12, padding: '2px 16px', fontSize: 30}}>עקיבה</span>
        </div>
        <div style={{fontSize: 36, marginTop: 16, opacity: 0.95}}>{c.caption}</div>
      </div>
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 70, height: 6, background: 'rgba(255,255,255,.3)'}}>
        <div style={{position: 'absolute', right: 0, width: `${prog * 100}%`, height: '100%', background: '#fff'}} />
        {c.scrub && f >= c.scrub[0] && f < c.scrub[1] && <div style={{position: 'absolute', right: `${prog * 100}%`, top: -13, width: 32, height: 32, borderRadius: 16, background: '#fff', marginRight: -16}} />}
      </div>
      {paused && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
          <div style={{width: 190, height: 190, borderRadius: 95, background: 'rgba(0,0,0,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 26}}>
            <div style={{width: 30, height: 90, background: '#fff', borderRadius: 6}} /><div style={{width: 30, height: 90, background: '#fff', borderRadius: 6}} />
          </div>
        </AbsoluteFill>
      )}
      {c.sticker && (
        <div style={{position: 'absolute', top: c.sticker.y || 330, left: 0, right: 0, display: 'flex', justifyContent: 'center', transform: `scale(${stk}) rotate(-3deg)`}}>
          <div style={{background: '#fff', color: INK, fontSize: 58, fontWeight: 800, padding: '22px 40px', borderRadius: 26, boxShadow: '0 12px 30px rgba(0,0,0,.35)', ...font}}>{c.sticker.text}</div>
        </div>
      )}
      {c.share && f >= c.share && (
        <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 560 * share, background: '#fff', borderRadius: '44px 44px 0 0', overflow: 'hidden', ...font}}>
          <div style={{width: 120, height: 10, borderRadius: 5, background: '#ddd', margin: '24px auto'}} />
          <div style={{display: 'flex', justifyContent: 'space-around', padding: '30px 60px'}}>
            {['העתקת קישור', 'שיתוף', 'שמירה'].map((t, i) => (
              <div key={i} style={{textAlign: 'center', fontSize: 34, color: INK}}>
                <div style={{width: 130, height: 130, borderRadius: 65, background: i === 0 ? '#FCE3CF' : '#f1f1f1', margin: '0 auto 14px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: i === 0 && c.copyTap && f >= c.copyTap && f < c.copyTap + 10 ? '0 0 0 14px rgba(192,84,21,.25)' : 'none'}}>
                  <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke={i === 0 ? ORANGE : '#555'} strokeWidth="2"><path d={i === 0 ? 'M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1' : i === 1 ? SEND : BOOK} /></svg>
                </div>{t}
              </div>
            ))}
          </div>
          {c.copyTap && f >= c.copyTap + 4 && (
            <div style={{textAlign: 'center', fontSize: 36, fontWeight: 700, color: '#2e7d32', marginTop: 10}}>הקישור הועתק</div>
          )}
        </div>
      )}
      {c.smudge && <Smudges />}
      <AbsoluteFill style={{background: '#000', opacity: dim}} />
      {c.dimAt && f >= c.dimAt + 10 && f < c.dimAt + 44 && (
        <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', opacity: interpolate(f, [c.dimAt + 10, c.dimAt + 16], [0, 1], clamp)}}>
          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.6"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

const Smudges = () => (
  <AbsoluteFill style={{pointerEvents: 'none'}}>
    {[[250, 820, 170], [700, 1180, 130], [480, 560, 90], [820, 420, 110], [300, 1350, 120]].map(([x, y, r], i) => (
      <div key={i} style={{position: 'absolute', left: x - r, top: y - r, width: r * 2, height: r * 1.6, borderRadius: '50%',
        background: 'radial-gradient(ellipse, rgba(255,255,255,.55) 0%, rgba(255,255,255,.25) 45%, rgba(255,255,255,0) 72%)', filter: 'blur(6px)', transform: `rotate(${i * 37}deg)`}} />
    ))}
  </AbsoluteFill>
);

const Comments = ({c}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < c.from || f >= c.to) return null;
  const up = spring({frame: f - c.from, fps, config: {damping: 16, stiffness: 120}}) * interpolate(f, [c.to - 12, c.to], [1, 0], {...clamp, easing: smooth});
  const names = ['שירן', 'מורן', 'אורית', 'נועה', 'רותם', 'ליאת', 'הדס', 'יעל', 'סיגל', 'מיכל', 'דנה', 'טל', 'אביטל', 'קרן'];
  const texts = ['מתכון', 'מתכון!!', 'מתכון בבקשה', 'מתכון', 'גם אני רוצה מתכון', 'מתכון', 'מתכוןןן', 'מתכון תודה', 'מתכון', 'מתכון!', 'מתכון', 'מתכון בבקשה', 'מתכון', 'מתכון'];
  const cols = ['#f4a261', '#e76f51', '#2a9d8f', '#8ab17d', '#e9c46a', '#b5838d', '#6d6875', '#90be6d'];
  const n = Math.min(names.length, Math.floor((f - c.from) / 2.2));
  const rows = [];
  for (let i = 0; i < n; i++) rows.push(i);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: 'rgba(0,0,0,.35)', opacity: up}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 0, height: 1250, transform: `translateY(${(1 - up) * 1250}px)`, background: '#fff', borderRadius: '44px 44px 0 0', overflow: 'hidden', ...font}}>
        <div style={{width: 120, height: 10, borderRadius: 5, background: '#ddd', margin: '24px auto 10px'}} />
        <div style={{textAlign: 'center', fontSize: 40, fontWeight: 700, color: INK, paddingBottom: 20, borderBottom: '1px solid #eee'}}>3,214 תגובות</div>
        <div style={{position: 'absolute', top: 130, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column-reverse', justifyContent: 'flex-end'}}>
          {rows.map((i) => {
            const s = spring({frame: f - c.from - i * 2.2, fps, config: {damping: 15, stiffness: 200}});
            return (
              <div key={i} style={{display: 'flex', alignItems: 'center', gap: 26, padding: '22px 50px', opacity: s, transform: `translateY(${(1 - s) * 40}px)`}}>
                <div style={{width: 84, height: 84, borderRadius: 42, background: cols[i % cols.length], color: '#fff', fontSize: 38, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>{names[i][0]}</div>
                <div><div style={{fontSize: 30, color: '#888'}}>{names[i]}</div><div style={{fontSize: 44, color: INK, fontWeight: 600}}>{texts[i]}</div></div>
              </div>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SavedGrid = ({c}) => {
  const f = useCurrentFrame();
  if (f < c.from || f >= c.to + 30) return null;
  // fast scroll that decelerates
  const y = c.calm ? interpolate(f, [c.from, c.to + 30], [0, 900], clamp) : interpolate(f, [c.from, c.slowAt, c.to], [0, 5200, 5600], {...clamp, easing: Easing.out(Easing.cubic)});
  const blur = c.calm ? 0 : interpolate(f, [c.from, c.from + 10, c.slowAt - 10, c.slowAt], [0, 5, 5, 0], clamp);
  const tile = 356, gap = 6;
  const tiles = [];
  for (let i = 0; i < 60; i++) tiles.push(i);
  return (
    <AbsoluteFill style={{background: '#fff', overflow: 'hidden'}}>
      <div style={{position: 'absolute', top: -y, left: 0, right: 0, display: 'flex', flexWrap: 'wrap', gap, filter: `blur(${blur}px)`, direction: 'rtl'}}>
        {tiles.map((i) => {
          const dead = c.deadAt && f >= c.deadAt && i === c.deadIndex;
          return (
            <div key={i} style={{width: tile, height: tile * 1.4, position: 'relative', overflow: 'hidden', background: '#ddd'}}>
              <Img src={src(c.imgs[i % c.imgs.length])} style={{width: '100%', height: '100%', objectFit: 'cover', filter: dead ? 'grayscale(1) brightness(.35)' : 'none'}} />
              {dead && <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 34, fontWeight: 700, textAlign: 'center', padding: 30, ...font}}>הסרטון אינו זמין</div>}
            </div>
          );
        })}
      </div>
      <div style={{position: 'absolute', top: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(#fff 70%, rgba(255,255,255,0))', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, fontSize: 48, fontWeight: 800, color: INK, ...font}}>
        <svg width="46" height="46" viewBox="0 0 24 24" fill={INK}><path d={BOOK} /></svg>שמורים
      </div>
    </AbsoluteFill>
  );
};

const Paper = ({c}) => {
  const f = useCurrentFrame();
  const kb = interpolate(f, [0, c.to], [1.05, 1.22]);
  const st = c.stain ? interpolate(f, c.stain, [0, 1], {...clamp, easing: Easing.out(Easing.cubic)}) : 0;
  return (
    <AbsoluteFill style={{background: '#1a120c', overflow: 'hidden'}}>
      <Img src={src(c.img)} style={{position: 'absolute', width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${kb})`, filter: 'sepia(.35) contrast(.95) brightness(.95)'}} />
      <div style={{position: 'absolute', left: 560 - 260 * st, top: 1010 - 230 * st, width: 520 * st, height: 460 * st, borderRadius: '48% 52% 45% 55%',
        background: 'radial-gradient(ellipse at 45% 45%, rgba(110,62,20,.62) 0%, rgba(120,70,25,.5) 55%, rgba(90,50,15,.75) 68%, rgba(90,50,15,0) 74%)', mixBlendMode: 'multiply', filter: 'blur(3px)'}} />
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0) 45%, rgba(0,0,0,.55) 100%)'}} />
      {c.flash && <AbsoluteFill style={{background: '#fff', opacity: interpolate(f, [c.flash, c.flash + 4, c.flash + 16], [0, 0.55, 0], clamp)}} />}
    </AbsoluteFill>
  );
};

// ---------- phone screens ----------
const Screen = ({s, f, W, H}) => {
  const sc = W / 1080;
  if (s.type === 'scroll') {
    const xs = s.keys.map((k) => k[0]);
    const y = interpolate(f, xs, s.keys.map((k) => k[1]), {...clamp, easing: smooth});
    return (
      <div style={{position: 'absolute', inset: 0, overflow: 'hidden', background: CREAM}}>
        <Img src={src(s.src)} style={{position: 'absolute', top: -y * sc, left: 0, width: W}} />
        {s.sticky && <Img src={src(s.sticky.src)} style={{position: 'absolute', left: 0, width: W, bottom: 0, height: s.sticky.h * sc, objectFit: 'cover', objectPosition: 'bottom'}} />}
        {s.stickyTop && <div style={{position: 'absolute', top: 0, left: 0, width: W, height: s.stickyTop.h * sc, overflow: 'hidden'}}><Img src={src(s.stickyTop.src)} style={{width: W}} /></div>}
      </div>
    );
  }
  return <Img src={src(s.src)} style={{position: 'absolute', inset: 0, width: W, height: H}} />;
};

const Phone = ({cfg}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const m = cfg.morph; // frame where the full-bleed collapses into the phone
  const k = cfg.min ? interpolate(f, [m, m + 24], [0, 1], {...clamp, easing: Easing.bezier(0.65, 0, 0.35, 1)}) : spring({frame: f - m, fps, config: {damping: 18, stiffness: 95}});
  const endOut = interpolate(f, [cfg.endAt - 8, cfg.endAt + 4], [1, 0], clamp);
  if (f >= cfg.endAt + 4) return null;
  const x = interpolate(k, [0, 1], [0, PH.x]), y = interpolate(k, [0, 1], [0, PH.y]);
  const w = interpolate(k, [0, 1], [1080, PH.w]), h = interpolate(k, [0, 1], [1920, PH.h]);
  const r = interpolate(k, [0, 1], [0, PH.r]);
  // camera
  const cam = cfg.cam || [[0, 1, 0.5, 0.5]];
  const xs = cam.map((c) => c[0]);
  const [s, fx, fy] = [1, 2, 3].map((i) => interpolate(f, xs, cam.map((c) => c[i]), {...clamp, easing: smooth}));
  const px = PH.x + fx * PH.w, py = PH.y + fy * PH.h, cx = PH.x + PH.w / 2, cy = PH.y + PH.h / 2;
  const tx = f > m ? (px - cx) * (1 - s) * 0.65 : 0, ty = f > m ? (py - cy) * (1 - s) * 0.65 : 0;
  const ss = f > m ? s : 1;
  // which bleed layer is live
  const bleed = cfg.bleed.filter((b) => f >= (b.from || 0) && f < b.to + 30);
  const screens = cfg.screens;
  const active = [];
  for (let i = 0; i < screens.length; i++) {
    const sc = screens[i];
    const next = screens[i + 1];
    if (f >= sc.from && (!next || f < next.from + (next.dur || 12))) active.push(sc);
  }
  const W = PH.w, H = PH.h;
  return (
    <AbsoluteFill style={{perspective: 2000}}>
      <div style={{position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, overflow: 'hidden',
        transform: `translate(${tx}px, ${ty + (1 - endOut) * 260}px) scale(${ss * (0.86 + 0.14 * endOut)}) rotateY(${f > m + 20 ? Math.sin(f / 30) * 1.1 : 0}deg)`,
        opacity: endOut, boxShadow: k > 0.02 ? `0 40px 90px rgba(90,40,10,${0.35 * k}), 0 0 0 ${10 * k}px #1d1410` : 'none', background: '#000'}}>
        {/* full-bleed layers, scaled with the container */}
        <div style={{position: 'absolute', left: 0, top: 0, width: 1080, height: 1920, transform: `scale(${w / 1080}, ${h / 1920})`, transformOrigin: '0 0'}}>
          {bleed.map((b, i) => (
            <AbsoluteFill key={i} style={{opacity: b.fadeIn ? interpolate(f, [b.from, b.from + 8], [0, 1], clamp) : 1}}>
              {b.kind === 'reel' && <Reel c={b} />}
              {b.kind === 'grid' && <SavedGrid c={b} />}
              {b.kind === 'paper' && <Paper c={b} />}
            </AbsoluteFill>
          ))}
          {cfg.comments && <Comments c={cfg.comments} />}
        </div>
        {/* app screens */}
        {f >= screens[0].from && (
          <div style={{position: 'absolute', left: 0, top: 0, width: W, height: H, transform: `scale(${w / W}, ${h / H})`, transformOrigin: '0 0'}}>
            {active.map((sc, i) => {
              const d = sc.dur || 12;
              const p = interpolate(f, [sc.from, sc.from + d], [0, 1], {...clamp, easing: smooth});
              const nxt = screens[screens.indexOf(sc) + 1];
              const leaving = nxt && f >= nxt.from ? interpolate(f, [nxt.from, nxt.from + (nxt.dur || 12)], [0, 1], {...clamp, easing: smooth}) : 0;
              let st = {};
              const e = sc.enter || 'fade';
              if (e === 'fade') st = {opacity: p};
              if (e === 'push') st = {transform: `translateX(${(p - 1) * W}px)`};
              if (e === 'sheet') st = {transform: `translateY(${(1 - p) * H}px)`};
              if (e === 'zoom') st = {opacity: p, transform: `scale(${0.94 + 0.06 * p})`};
              const nE = nxt && nxt.enter;
              if (leaving && nE === 'push') st = {...st, transform: `translateX(${leaving * W * 0.3}px)`, filter: `brightness(${1 - 0.25 * leaving})`};
              return (
                <div key={sc.from} style={{position: 'absolute', inset: 0, ...st}}>
                  <Screen s={sc} f={f} W={W} H={H} />
                </div>
              );
            })}
            {(cfg.typing || []).map((t, i) => f >= t.from && f < t.to + 10 && t.mask && (
              <div key={'m' + i} style={{position: 'absolute', right: t.mask[0] * W, top: t.mask[1] * H, width: t.mask[2] * W, height: t.mask[3] * H, background: '#fff', opacity: interpolate(f, [t.to, t.to + 8], [1, 0], clamp)}} />
            ))}
            {(cfg.typing || []).map((t, i) => f >= t.from && f < t.to && (
              <div key={i} style={{position: 'absolute', top: t.y * H, right: t.x * W, fontSize: t.size || 40, color: INK, fontWeight: 500, ...font}}>
                {t.text.slice(0, Math.max(0, Math.floor((f - t.from) / (t.per || 4))))}
                <span style={{opacity: Math.floor(f / 8) % 2 ? 1 : 0, color: ORANGE}}>|</span>
              </div>
            ))}
            {(cfg.taps || []).map((t, i) => {
              const a = f - t.at;
              if (a < -6 || a > 16) return null;
              const pre = interpolate(a, [-6, 0], [0, 1], clamp);
              const ring = interpolate(a, [0, 14], [0, 1], clamp);
              return (
                <div key={i} style={{position: 'absolute', left: t.x * W - 60, top: t.y * H - 60, width: 120, height: 120}}>
                  <div style={{position: 'absolute', inset: 0, borderRadius: 60, background: 'rgba(40,25,15,.28)', transform: `scale(${a < 0 ? 0.6 + 0.4 * pre : 1 - 0.15 * ring})`, opacity: a < 0 ? pre : 1 - ring}} />
                  <div style={{position: 'absolute', inset: 0, borderRadius: 60, border: '5px solid rgba(255,255,255,.9)', transform: `scale(${1 + ring * 1.2})`, opacity: a >= 0 ? 1 - ring : 0}} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};

// ---------- chat (family share) ----------
const Chat = ({c}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < c.from || f >= c.to) return null;
  const inn = spring({frame: f - c.from, fps, config: {damping: 16, stiffness: 120}});
  const out = interpolate(f, [c.to - 8, c.to], [1, 0], clamp);
  const b1 = spring({frame: f - c.from - 12, fps, config: {damping: 13, stiffness: 150}});
  const r1 = spring({frame: f - c.from - 40, fps, config: {damping: 13, stiffness: 150}});
  const r2 = spring({frame: f - c.from - 56, fps, config: {damping: 13, stiffness: 150}});
  return (
    <div style={{position: 'absolute', left: PH.x, top: PH.y, width: PH.w, height: PH.h, borderRadius: PH.r, overflow: 'hidden', background: '#EFE7DC',
      transform: `translateX(${(1 - inn) * -1000}px)`, opacity: out, boxShadow: '0 40px 90px rgba(90,40,10,.35), 0 0 0 10px #1d1410', ...font}}>
      <div style={{height: 190, background: '#f7f3ee', display: 'flex', alignItems: 'flex-end', padding: '0 40px 26px', gap: 22, borderBottom: '1px solid #e2d9cc'}}>
        <div style={{width: 84, height: 84, borderRadius: 42, background: 'linear-gradient(135deg,#f4a261,#e76f51)'}} />
        <div><div style={{fontSize: 42, fontWeight: 700, color: INK}}>המשפחה</div><div style={{fontSize: 28, color: '#8a7b6c'}}>אמא, אבא, נועה, דודה רותי ועוד 9</div></div>
      </div>
      <div style={{position: 'absolute', top: 260, right: 34, width: 640, transform: `scale(${b1})`, transformOrigin: 'right top', background: '#DCF3C8', borderRadius: 30, padding: 14, boxShadow: '0 3px 8px rgba(0,0,0,.08)'}}>
        <Img src={src(c.og)} style={{width: '100%', borderRadius: 20}} />
        <div style={{fontSize: 34, fontWeight: 700, color: INK, padding: '14px 10px 0'}}>{c.title}</div>
        <div style={{fontSize: 28, color: '#557', padding: '6px 10px 8px'}}>מתכון מפלפל</div>
      </div>
      <div style={{position: 'absolute', top: 820, left: 34, transform: `scale(${r1})`, transformOrigin: 'left top', background: '#fff', borderRadius: 30, padding: '20px 30px', fontSize: 40, color: INK, boxShadow: '0 3px 8px rgba(0,0,0,.08)'}}>
        <div style={{fontSize: 28, color: '#e76f51', fontWeight: 700}}>דודה רותי</div>סוף סוף!! המתכון של סבתא
      </div>
      <div style={{position: 'absolute', top: 1020, left: 34, transform: `scale(${r2})`, transformOrigin: 'left top', background: '#fff', borderRadius: 30, padding: '20px 30px', fontSize: 40, color: INK, boxShadow: '0 3px 8px rgba(0,0,0,.08)'}}>
        <div style={{fontSize: 28, color: '#2a9d8f', fontWeight: 700}}>נועה</div>שומרת לשישי הזה
      </div>
    </div>
  );
};

// ---------- end card ----------
const EndCard = ({cta}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ic = spring({frame, fps, config: {damping: 11, stiffness: 140}});
  const k = spring({frame: frame - 16, fps, config: {damping: 13, stiffness: 120}});
  const pulse = frame > 44 ? 1 + 0.035 * Math.sin((frame - 44) / 4.5) : 1;
  const btn = spring({frame: frame - 24, fps, config: {damping: 12, stiffness: 150}});
  const shine = interpolate(frame, [46, 66], [-300, 900], clamp);
  return (
    <AbsoluteFill style={{background: CREAM}}>
      <Words text={cta} color={INK} size={est(cta, 76)} start={2} y={250} />
      <div style={{position: 'absolute', left: 330, top: 520, width: 420, height: 420, borderRadius: 95, overflow: 'hidden',
        transform: `scale(${ic}) rotate(${(1 - ic) * -20}deg)`, boxShadow: '0 30px 70px rgba(120,60,20,0.35)'}}>
        <Img src={src('icon.png')} style={{width: 420, height: 420}} />
      </div>
      <div style={{position: 'absolute', top: 990, width: '100%', display: 'flex', justifyContent: 'center', ...font}}>
        {'פלפל'.split('').map((ch, i) => {
          const s = spring({frame: frame - 8 - i * 3, fps, config: {damping: 11, stiffness: 170}});
          return <span key={i} style={{fontSize: 180, fontWeight: 800, color: ORANGE, display: 'inline-block', transform: `translateY(${(1 - s) * 70}px)`, opacity: Math.min(1, s * 1.6)}}>{ch}</span>;
        })}
      </div>
      <div style={{position: 'absolute', left: 240, top: 1250, width: 600, height: 124, borderRadius: 62, background: ORANGE, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${btn * pulse})`, boxShadow: '0 16px 36px rgba(192,84,21,0.4)', ...font}}>
        <span style={{color: '#fff', fontSize: 64, fontWeight: 800}}>חינם בחנות</span>
        <div style={{position: 'absolute', top: 0, left: shine, width: 120, height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)', transform: 'skewX(-20deg)'}} />
      </div>
      <Img src={src('happy.png')} style={{position: 'absolute', height: 340, left: 400, top: 1480 + (1 - k) * 450, transform: `rotate(${10 - 10 * k}deg)`}} />
    </AbsoluteFill>
  );
};

export const Creative = ({cfg}) => {
  const f = useCurrentFrame();
  const total = cfg.endAt + cfg.endF;
  const creamOn = interpolate(f, [cfg.morph, cfg.morph + 10], [0, 1], clamp);
  return (
    <AbsoluteFill style={{background: '#000'}}>
      <style>{`@font-face{font-family:'Rubik';src:url('${staticFile('rubik.ttf')}');font-weight:300 900;}`}</style>
      <AbsoluteFill style={{opacity: creamOn, background: `radial-gradient(circle at 50% ${40 + (f / total) * 20}%, #FFFBF4 0%, ${CREAM} 55%, #F8E6CF 100%)`}} />
      <Phone cfg={cfg} />
      {(cfg.chat) && <Chat c={cfg.chat} />}
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${CREAM} 0px, ${CREAM} 250px, rgba(255,246,234,0) 330px)`, height: 340, opacity: interpolate(f, [cfg.morph + 6, cfg.morph + 14], [0, 1], clamp)}} />
      {cfg.min ? cfg.cards.map((c, i) => <HookText key={i} {...c} />) : cfg.cards.map((c, i) => <BleedCard key={i} {...c} />)}
      {cfg.min ? cfg.caps.map((c, i) => <CalmCaption key={i} {...c} />) : cfg.caps.map((c, i) => <TopCaption key={i} {...c} />)}
      {f >= cfg.endAt && <AbsoluteFill style={{opacity: cfg.min ? interpolate(f, [cfg.endAt, cfg.endAt + 12], [0, 1], clamp) : 1}}><EndWrap cfg={cfg} /></AbsoluteFill>}
    </AbsoluteFill>
  );
};
const EndWrap = ({cfg}) => {
  const f = useCurrentFrame();
  return <div style={{position: 'absolute', inset: 0}}><Shift from={cfg.endAt}>{cfg.min ? <EndCalm cta={cfg.cta} /> : <EndCard cta={cfg.cta} />}</Shift></div>;
};
const Shift = ({from, children}) => <Sequence from={from}>{children}</Sequence>;
