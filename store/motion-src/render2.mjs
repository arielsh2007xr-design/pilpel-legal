import {bundle} from '@remotion/bundler';
import {renderStill, renderMedia, selectComposition} from '@remotion/renderer';
import fs from 'fs';
const browserExecutable=process.env.CHROME_PATH||null; // null = let Remotion download its own headless shell
const serveUrl=await bundle({entryPoint:'src/index.jsx'});
const [mode, id, ...frames]=process.argv.slice(2);
const cfg=JSON.parse(fs.readFileSync(`cfg2/${id}.json`,'utf8'));
const inputProps={cfg};
const comp=await selectComposition({serveUrl,id:'Creative',inputProps,browserExecutable});
if(mode==='stills'){
  fs.mkdirSync(`stills/${id}`,{recursive:true});
  for(const f of frames.map(Number)) await renderStill({composition:comp,serveUrl,inputProps,output:`stills/${id}/${String(f).padStart(4,'0')}.png`,frame:f,browserExecutable});
}else{
  await renderMedia({composition:comp,serveUrl,inputProps,codec:'h264',crf:16,outputLocation:`out2/${id}.mp4`,browserExecutable,concurrency:2,muted:true});
}
console.log('done',id,comp.durationInFrames);
