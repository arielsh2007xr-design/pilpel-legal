import React from 'react';
import {registerRoot, Composition} from 'remotion';
import {Ad} from './Ad';
const Root = () => (
  <Composition id="Ad" component={Ad} durationInFrames={100} fps={30} width={1080} height={1920}
    defaultProps={{cfg: {hookF: 36, appF: 30, endF: 34, cam: [[0,1,0.5,0.5]], caps: [], hook: {l1: 'x', l2: ''}, app: 'app.mp4', first: 'first.png'}}}
    calculateMetadata={({props}) => ({durationInFrames: props.cfg.hookF + props.cfg.appF + props.cfg.endF})} />
);
registerRoot(Root);
