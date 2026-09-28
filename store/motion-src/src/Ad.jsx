import React from 'react';
import {AbsoluteFill, OffthreadVideo, Img, staticFile, useCurrentFrame, useVideoConfig, spring, interpolate, Easing, Sequence} from 'remotion';

const CREAM = '#FFF6EA', INK = '#2B1D14', ORANGE = '#C05415';
const font = {fontFamily: 'Rubik', direction: 'rtl'};
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'};

const Words = ({text, color, size, start, y, weight = 800}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: y, left: 40, right: 40, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', columnGap: size * 0.28, ...font}}>
      {text.split(' ').map((w, i) => {
        const s = spring({frame: frame - start - i * 3, fps, config: {damping: 13, stiffness: 170, mass: 0.6}});
        return (
          <span key={i} style={{fontSize: size, fontWeight: weight, color, display: 'inline-block', whiteSpace: 'nowrap', opacity: Math.min(1, s * 1.5),
            transform: `translateY(${(1 - s) * 40}px)`}}>{w}</span>
        );
      })}
    </div>
  );
};

const fitSize = (text, base, max = 1000) => {
  // rough width estimate for Rubik bold Hebrew: ~0.56em per char
  const w = text.length * base * 0.56;
  return w > max ? Math.floor(base * max / w) : base;
};

const Caption = ({l1, l2, start, end, big, y0}) => {
  const frame = useCurrentFrame();
  if (frame < start || frame >= end) return null;
  const out = interpolate(frame, [end - 7, end], [1, 0], clamp);
  const base = big ? 112 : 84;
  const s1 = fitSize(l1, base), s2 = l2 ? fitSize(l2, base) : 0;
  const sz = Math.min(s1, s2 || s1);
  const top = y0 ?? 70;
  return (
    <AbsoluteFill style={{opacity: out, transform: `translateY(${(1 - out) * -24}px)`}}>
      <Words text={l1} color={INK} size={sz} start={start} y={top} />
      {l2 && <Words text={l2} color={ORANGE} size={sz} start={start + 5} y={top + sz * 1.3} />}
    </AbsoluteFill>
  );
};

const camAt = (frame, cam) => {
  const xs = cam.map((k) => k[0]);
  const ease = {easing: Easing.bezier(0.65, 0, 0.35, 1), ...clamp};
  return [1, 2, 3].map((i) => interpolate(frame, xs, cam.map((k) => k[i]), ease));
};

const Phone = ({cfg}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {hookF, appF} = cfg;
  const enter = spring({frame: frame - (hookF - 12), fps, config: {damping: 16, stiffness: 90}});
  const [s, fx, fy] = camAt(frame, cfg.cam);
  const W = 900, H = 1600, X = 90, Y = 330;
  const px = X + fx * W, py = Y + fy * H, cx = X + W / 2, cy = Y + H / 2;
  const tx = (px - cx) * (1 - s) * 0.65, ty = (py - cy) * (1 - s) * 0.65;
  const endOut = interpolate(frame, [hookF + appF - 8, hookF + appF + 4], [1, 0], clamp);
  if (frame < hookF - 14) return null;
  return (
    <AbsoluteFill style={{perspective: 1800}}>
      <div style={{position: 'absolute', left: X, top: Y, width: W, height: H,
        transform: `translate(${tx}px, ${ty + (1 - enter) * 1500 + (1 - endOut) * 300}px) scale(${s * (0.9 + 0.1 * enter) * (0.85 + 0.15 * endOut)}) rotateX(${(1 - enter) * 38}deg) rotateY(${Math.sin(frame / 28) * 1.2}deg)`,
        opacity: endOut, borderRadius: 72, overflow: 'hidden', boxShadow: '0 40px 90px rgba(90,40,10,0.35), 0 0 0 10px #1d1410', background: CREAM}}>
        {frame < hookF && <Img src={staticFile(cfg.first)} style={{width: W, height: H}} />}
        <Sequence from={hookF}>
          <OffthreadVideo src={staticFile(cfg.app)} muted style={{width: W, height: H}} />
        </Sequence>
      </div>
    </AbsoluteFill>
  );
};

const Hook = ({cfg}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {hook, hookF} = cfg;
  if (frame > hookF + 6) return null;
  const out = interpolate(frame, [hookF - 8, hookF + 2], [1, 0], clamp);
  const k = spring({frame: frame - 4, fps, config: {damping: 10, stiffness: 120}});
  const kDrop = interpolate(frame, [hookF - 12, hookF + 2], [0, 900], {...clamp, easing: Easing.in(Easing.cubic)});
  const hasPose = !!hook.pose;
  return (
    <AbsoluteFill>
      <div style={{opacity: out, transform: `translateY(${(1 - out) * -60}px)`}}>
        <Caption l1={hook.l1} l2={hook.l2} start={0} end={hookF + 6} big y0={hasPose ? 470 : 720} />
      </div>
      {hasPose && (
        <Img src={staticFile(hook.pose + '.png')} style={{position: 'absolute', height: 880, left: '50%', top: 880,
          transform: `translateX(-50%) translateY(${(1 - k) * 700 + kDrop}px) scale(${0.7 + 0.3 * k})`, transformOrigin: '50% 100%'}} />
      )}
    </AbsoluteFill>
  );
};

const EndCard = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ic = spring({frame, fps, config: {damping: 9, stiffness: 140}});
  const k = spring({frame: frame - 14, fps, config: {damping: 12, stiffness: 120}});
  const pulse = frame > 40 ? 1 + 0.04 * Math.sin((frame - 40) / 4) : 1;
  const btn = spring({frame: frame - 26, fps, config: {damping: 11, stiffness: 150}});
  const shine = interpolate(frame, [44, 64], [-300, 900], clamp);
  return (
    <AbsoluteFill style={{background: CREAM}}>
      <div style={{position: 'absolute', left: 280, top: 440, width: 520, height: 520, borderRadius: 117, overflow: 'hidden',
        transform: `scale(${ic}) rotate(${(1 - ic) * -25}deg)`, boxShadow: '0 30px 70px rgba(120,60,20,0.35)'}}>
        <Img src={staticFile('icon.png')} style={{width: 520, height: 520}} />
      </div>
      <div style={{position: 'absolute', top: 1010, width: '100%', display: 'flex', justifyContent: 'center', ...font}}>
        {'פלפל'.split('').map((ch, i) => {
          const s = spring({frame: frame - 8 - i * 3, fps, config: {damping: 10, stiffness: 170}});
          return <span key={i} style={{fontSize: 200, fontWeight: 800, color: ORANGE, display: 'inline-block', transform: `translateY(${(1 - s) * 80}px)`, opacity: Math.min(1, s * 1.6)}}>{ch}</span>;
        })}
      </div>
      <Words text="כל המתכונים שלך, במקום אחד" color={INK} size={62} weight={600} start={18} y={1270} />
      <div style={{position: 'absolute', left: 240, top: 1420, width: 600, height: 124, borderRadius: 62, background: ORANGE, overflow: 'hidden',
        display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${btn * pulse})`, boxShadow: '0 16px 36px rgba(192,84,21,0.4)', ...font}}>
        <span style={{color: '#fff', fontSize: 68, fontWeight: 800}}>חינם בחנות</span>
        <div style={{position: 'absolute', top: 0, left: shine, width: 120, height: '100%', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.45), transparent)', transform: 'skewX(-20deg)'}} />
      </div>
      <Img src={staticFile('happy.png')} style={{position: 'absolute', height: 320, left: 413, top: 1585 + (1 - k) * 450, transform: `rotate(${12 - 12 * k}deg)`}} />
    </AbsoluteFill>
  );
};

export const Ad = ({cfg}) => {
  const frame = useCurrentFrame();
  const total = cfg.hookF + cfg.appF + cfg.endF;
  const bg = frame / total;
  return (
    <AbsoluteFill style={{background: `radial-gradient(circle at 50% ${40 + bg * 20}%, #FFFBF4 0%, ${CREAM} 55%, #F8E6CF 100%)`}}>
      <style>{`@font-face{font-family:'Rubik';src:url('${staticFile('rubik.ttf')}');font-weight:300 900;}`}</style>
      <Hook cfg={cfg} />
      <Phone cfg={cfg} />
      <AbsoluteFill style={{background: `linear-gradient(180deg, ${CREAM} 0px, ${CREAM} 250px, rgba(255,246,234,0) 330px)`, height: 340, opacity: frame >= cfg.hookF - 6 ? 1 : 0}} />
      {cfg.caps.map((c, i) => <Caption key={i} {...c} />)}
      <Sequence from={cfg.hookF + cfg.appF}><EndCard /></Sequence>
    </AbsoluteFill>
  );
};
