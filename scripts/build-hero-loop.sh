#!/usr/bin/env bash
# Build the seamless hero loop.
#  Phase 1 — process each clip individually (edit its filter line below).
#  Phase 2 — crossfade them into a seamless loop (last clip fades back into the first).
set -euo pipefail
cd "$(dirname "$0")/.."

DIR="../versatiles-style/animations"
OUT="static/hero-loop.mp4"
POSTER="static/poster-hero.jpg"
FPS=30            # output frame rate
SIZE="1920:810"   # output resolution (21:9)
XFADE=1           # crossfade duration between clips (s)
CRF=28            # final quality (lower = sharper/larger)
PREP_CRF=0        # intermediate quality — near-lossless (0 = fully lossless)
POSTER_TIME=0     # poster frame (s)

TMP=".tmp"
mkdir -p "$TMP"
#trap 'rm -rf "$TMP"' EXIT

# process one source clip -> normalised intermediate
#   $1 = source file   $2 = intermediate name   $3 = per-clip filters
prep() {
	# colour work in float RGB (colorlevels is correct there, not in 10/12-bit int);
	# store intermediates as 10-bit so the crossfades blend without 8-bit banding.
	ffmpeg -hide_banner -y -i "$DIR/$1" -vf "format=gbrpf32le,$3,fps=$FPS,scale=$SIZE,setsar=1" \
		-an -c:v libx264 -profile:v high10 -pix_fmt yuv420p10le -preset slow -crf "$PREP_CRF" "$TMP/$2"
}

# ─────────────── PER-CLIP PROCESSING — tweak each line ───────────────
#   speed:  setpts=1.0*PTS      (1.3 = 30% slower, 0.8 = faster)
#   colour: eq=contrast=1.0:brightness=0.0:saturation=1.0   (also gamma=, or add hue=s=…, unsharp, …)
prep globe.mov  0-globe.mp4  "setpts=1.0*PTS,eq=gamma=0.7"
prep alps.mov   1-alps.mp4   "setpts=1.0*PTS"
prep berlin.mov 2-berlin.mp4 "setpts=1.0*PTS,colorlevels=rimin=0.2:gimin=0.2:bimin=0.2"
prep paris.mov  3-paris.mp4  "setpts=1.0*PTS"
prep japan.mov  4-japan.mp4  "setpts=1.0*PTS,colorlevels=rimin=0.5:gimin=0.5:bimin=0.5"

# loop order (by intermediate names); the first also fades in at the very end
ORDER=(0-globe.mp4 1-alps.mp4 2-berlin.mp4 3-paris.mp4 4-japan.mp4)
# ─────────────────────────────────────────────────────────────────────

dur() { ffprobe -v error -show_entries format=duration -of default=nk=1:nw=1 "$TMP/$1"; }
n=${#ORDER[@]}
sum=0
for c in "${ORDER[@]}"; do sum=$(awk "BEGIN{print $sum+$(dur "$c")}"); done
LOOP=$(awk "BEGIN{print $sum-$n*$XFADE}")

# inputs = all clips in order, then the first again (for the wrap crossfade)
inputs=()
for c in "${ORDER[@]}" "${ORDER[0]}"; do inputs+=(-i "$TMP/$c"); done

# crossfade chain with offsets from the actual (post-processing) durations
fc=""
prev="[0:v]"
run=$(dur "${ORDER[0]}")
for ((k = 1; k <= n; k++)); do
	if ((k < n)); then c="${ORDER[$k]}"; else c="${ORDER[0]}"; fi
	off=$(awk "BEGIN{print $run-$XFADE}")
	fc+="${prev}[$k:v]xfade=transition=fade:duration=$XFADE:offset=$off[x$k];"
	prev="[x$k]"
	run=$(awk "BEGIN{print $run+$(dur "$c")-$XFADE}")
done
fc+="${prev}trim=start=$XFADE:duration=$LOOP,setpts=PTS-STARTPTS[out]"

echo "Loop length: ${LOOP}s"
ffmpeg -hide_banner -y "${inputs[@]}" -filter_complex "$fc" \
	-map "[out]" -an -c:v libx264 -preset slow -crf "$CRF" -pix_fmt yuv420p -movflags +faststart "$OUT"
ffmpeg -hide_banner -y -ss "$POSTER_TIME" -i "$OUT" -frames:v 1 "$POSTER"
ls -la "$OUT" "$POSTER"
echo "✓ done"
