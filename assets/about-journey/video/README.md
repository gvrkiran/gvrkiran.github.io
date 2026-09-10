# Journey films

The Barcelona native-quality film is complete. It was generated through the
private H3 Remote Studio using the Sagrada Familia keyframe and the identity,
vehicle, architecture, and camera locks recorded in `../storyboard.json`. The
untouched Studio output is kept at
`raw/02-barcelona-sagrada-native-master.mp4`; earlier rejected bicycle versions
remain in `raw/` for recovery. The stable web file is a silent native 1344×768,
24 fps H.264 CRF 18 encode with a half-second GOP and fast-start metadata.

Generate the remaining six 16:9 films in the same Studio and save the web-ready
outputs with these stable names:

- `01-hyderabad.mp4`
- `02-barcelona.mp4`
- `03-doha.mp4`
- `04-helsinki.mp4`
- `05-lausanne.mp4`
- `06-cambridge.mp4`
- `07-rutgers.mp4`

For each completed film, add `data-ready="true"` to its `<video>` in
`about-journey.html`. The runtime only loads explicitly ready films, replaces a
poster after a decoded frame is available, and maps scroll position to video
time.
