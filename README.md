# Luke Duct Website

Website for Luke Duct: commercial kitchen exhaust & fresh air systems, Victoria.

- `index.html`: English
- `vi/index.html`: Tiếng Việt
- `assets/`: styles, script, favicon (and `assets/photos/` for project photos)

## Editing
All text and business details live in `build.js`. After changing it, run:

```bash
node build.js
```

That regenerates both `index.html` and `vi/index.html`.

## Enquiry form
Until `web3formsKey` is set in `build.js`, the forms open the visitor's SMS app addressed to 0478 844 995.
To get enquiries by email instead, create a free key at https://web3forms.com, paste it into `web3formsKey`, and rebuild.
