import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Ad} from './Ad';
import {Creative} from './Creative';
import {Flow} from './Flow';
const Root = () => (
  <>
    <Composition id="Ad" component={Ad} durationInFrames={100} fps={30} width={1080} height={1920}
      defaultProps={{cfg: {hookF: 36, appF: 30, endF: 34, cam: [[0,1,0.5,0.5]], caps: [], hook: {l1: 'x', l2: ''}, app: 'app.mp4', first: 'first.png'}}}
      calculateMetadata={({props}) => ({durationInFrames: props.cfg.hookF + props.cfg.appF + props.cfg.endF})} />
    <Composition id="Creative" component={Creative} durationInFrames={100} fps={30} width={1080} height={1920}
      defaultProps={{cfg: {morph: 10, endAt: 50, endF: 40, bleed: [], screens: [{src: 'as/home.png', from: 12}], cards: [], caps: [], cta: 'x'}}}
      calculateMetadata={({props}) => ({durationInFrames: props.cfg.endAt + props.cfg.endF})} />
    <Composition id="Flow" component={Flow} durationInFrames={100} fps={30} width={1080} height={1920}
      defaultProps={{cfg: {t: {phone: 10, appIn: 10, end: 50}, endF: 40, intro: {kind: 'note'}, screens: [{src: 'as/home.png', from: 10, enter: 'fade'}], caps: [], cam: [[0,1,.5,.5]], endLine: 'x'}}}
      calculateMetadata={({props}) => ({durationInFrames: props.cfg.t.end + props.cfg.endF})} />
  </>
);
registerRoot(Root);
