# PIMS · Coal Power AR

An animated, blue-hour coal power plant inspired by the supplied reference photograph. Malay mobile interface, interactive 3D preview and image-tracked augmented reality using MindAR and Three.js.

## Use on a phone

1. Open the deployed HTTPS website in Safari on iPhone or Chrome on Android.
2. Display `coal-ar/public/target.png` on another screen, or print it without cropping. The original photograph also has the same composition.
3. Tap **Mula AR**, allow the camera, and point at the entire picture. Avoid glare and keep the picture well lit.
4. Choose **Operasi biasa** or **Shipment bunching**. Pause or explore the four component explanations.
5. **Keluar AR** stops the camera and returns to the orbitable 3D preview.

Animations include coal stockpiles, a slewing reclaimer with a rotating bucket wheel, conveyor loads, a ship unloader, twin stacks and an illustrative boiler glow. Shipment bunching shows one vessel at berth and two waiting. This is a conceptual teaching model, not engineering geometry, live telemetry or a shipping forecast. The turbine, pulverizer and emissions-treatment systems are not modelled.

## Local preview

With Node.js installed:

```sh
cd coal-ar
npm start
```

Open http://localhost:8080. A phone requires an HTTPS deployment for camera access; plain LAN HTTP is insufficient. Libraries and fonts load from CDNs, so an internet connection is needed. No camera frames are uploaded by this application; image tracking runs in the browser.

## Deployment

The GitHub Actions workflow publishes `coal-ar/public` on pushes to `main`. Enable **Settings → Pages → Source → GitHub Actions** in the repository. The expected default URL is `https://tnbgenco.github.io/pims-ar/`; verify the deployment before distributing it.

## Image target

`target.mind` is compiled from the full `target.png` photograph. To change the scan image, replace the PNG and recompile with the [MindAR compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile/). Save its output as `coal-ar/public/target.mind`. `compile.html` is the equivalent developer utility for this image.

## Limitations

Image tracking depends on lighting, print quality, camera and browser capabilities. Very small targets, glare or featureless areas can cause loss of tracking. The model is hidden when tracking is lost. Physical iPhone/Android testing is still required before exhibition use. No QR code by itself performs image tracking: it opens the website; the photograph anchors the AR scene.

## Validation

Desktop (1440 × 1000) and mobile (390 × 844) preview smoke checks passed in Chromium: mode switching, pause/resume, component navigation, target dialog and no horizontal page overflow. A synthetic camera feed of the supplied photograph was successfully detected by MindAR; exiting AR stopped the camera tracks. No browser page errors were observed. These checks do not substitute for a real phone test.

`coal-ar/verify.mjs` uses Playwright. Install Playwright locally or set `PLAYWRIGHT_PATH` to its installed package, optionally set `CHROME_PATH` to a browser executable, and run it from `coal-ar`. `TEST_CAMERA` may point to a Y4M camera fixture. The script recompiles `target.mind` and writes ignored screenshots under `test-results`.

Built with [Three.js](https://threejs.org/) and [MindAR](https://hiukim.github.io/mind-ar-js-doc/). Reference photograph supplied by the user.
