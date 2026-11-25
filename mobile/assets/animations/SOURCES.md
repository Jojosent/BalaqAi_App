# ROSIE animations

User-supplied ProRes 4444 MOV files converted locally to transparent, infinitely looping animated WebP (320 px wide, 15 fps). Static PNG first-frame fallbacks are included for reduced motion, loading errors and native targets. The full temporal sequence is retained; transparent borders were cropped consistently across frames.

| Original file | Animation | Usage |
| --- | --- | --- |
| ROSIE_clean_alpha (1).mov | rosie-weeks-5-8.webp | Weeks 5–8 |
| ROSIE_baby_clean_transparent.mov | rosie-weeks-9-12.webp | Weeks 9–12 |
| ROSIE_star_clean_transparent.mov | rosie-weeks-13-19.webp | Weeks 13–19 |
| ROSIE_sleeping_baby_transparent.mov | rosie-weeks-20-plus.webp | Weeks 20–41 |
| ROSIE_swaddled_baby_transparent.mov | rosie-final-week.webp | Final numbered week (42) |
| ROSIE_smiling_boy_transparent.mov | rosie-welcome-boy.webp | Welcome children, stage and dating boy illustrations |

At week 20 the 20+ clip takes precedence over the preceding range. The separate heart milestone retains the mother-and-baby illustration. Source MOVs remain outside the repository.

## Additional user files

- ROSIE_week1_high_quality.mp4 → rosie-weeks-1-4.webp: weeks 1–4, complete sequence at 320px / 15fps. The source MP4 has an opaque white background, which is retained.
- 3dgifmaker-heartbeat.gif → water-drop.webp: transparent animated reminder badge on the tasks card. Transparent margins cropped; full animation retained.

The first-week asset is now replaced by user-supplied ROSIE_week1_transparent (2).gif for weeks 0–4, converted with source colors and transparency unchanged. Filenames retain their prior 1-4 naming for compatibility.

For consistent visual size, weeks 0–4 use a fixed 460×506 crop around the combined non-transparent bounds of all GIF frames (with padding), scaled to 320px width. Motion and transparency retained.
