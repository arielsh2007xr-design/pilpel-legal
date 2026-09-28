# Pilpel motion ads (Remotion)

Source for the 10 motion ads in `store/ads-motion/`. `public/` has the icon, the koala poses
(cropped to their bbox) and the Rubik font; the phone clips come from `store/video/`.

```
npm i
pip install numpy scipy pillow        # plus ffmpeg + ffprobe
for c in 01-paste-reel-fast 02-home-scroll 03-scan-paper-fast 04-cooking-mode 05-share 06-shopping-list; do cp ../video/$c.mp4 clips_$c.mp4; done
mkdir -p out && python3 gen.py        # public/app_*.mp4, public/first_*.png, cfg/*.json, out/a_*.wav
for id in 01-reel 02-grandma 03-amounts 04-comments 05-saved300 06-cook 07-share 08-shopping 09-findit 10-gallery; do
  node render_ad.mjs render $id       # CHROME_PATH=<local chromium> if Remotion can't download one
  ffmpeg -v error -y -i out/$id.mp4 -i out/a_$id.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af loudnorm=I=-14:TP=-1.5 -shortest -movflags +faststart out/final_$id.mp4
  ffmpeg -v error -y -i out/$id.mp4 -i out/a_${id}_sfx.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 192k -af loudnorm=I=-14:TP=-1.5 -shortest -movflags +faststart out/final_$id-sfx.mp4
done
```

New ad: add an entry to `ADS` in `gen.py` (hook, segments of the phone clips, captions).
`node render_ad.mjs stills <id> 30 150 440` renders single frames for a quick look.
