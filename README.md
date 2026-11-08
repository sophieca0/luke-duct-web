# Luke Commercial Kitchen Website

Website for Luke Commercial Kitchen: commercial kitchen exhaust & fresh air systems, Victoria.

- `index.html` / `vi/index.html`: home page (English / Tiếng Việt)
- `gallery/index.html` / `vi/gallery/index.html`: full project photo gallery
- `assets/`: styles, script, favicon, `photos/`

## Editing
All text, business details and the photo list live in `build.js`. After changing it, run:

```bash
node build.js
```

That regenerates all four pages.

## Adding photos
1. Put the photo in `assets/photos/` (JPEG, around 1600px on the long side).
2. Add a line to `photos` in `build.js` with `src`, `cat` (canopies, ductwork, roof or fitout),
   a short English and Vietnamese description, and `home: true` if it should also appear on the
   home page (up to 8).
3. Run `node build.js`.

## Enquiry form
Until `web3formsKey` is set in `build.js`, the forms open the visitor's SMS app addressed to 0466 404 868.
To get enquiries by email instead, create a free key at https://web3forms.com, paste it into `web3formsKey`, and rebuild.
