import subprocess, numpy as np, sys
def diffs(path):
    p = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', 'scale=108:192,format=gray', '-f', 'rawvideo', '-'], capture_output=True)
    a = np.frombuffer(p.stdout, np.uint8).reshape(-1, 192, 108).astype(np.float32)
    return np.abs(np.diff(a, axis=0)).mean((1, 2))
for path in sys.argv[1:]:
    d = diffs(path)
    flags = []
    for i in range(len(d)):
        loc = np.concatenate([d[max(0, i - 4):i], d[i + 1:i + 5]])
        if d[i] > 6 and d[i] > 3 * (np.median(loc) + 0.5):
            flags.append((i + 1, round(float(d[i]), 1)))
    print(path.split('/')[-1], 'frames', len(d) + 1, 'max', round(float(d.max()), 1), 'spikes', flags)
