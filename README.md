# PIMS · Coal Power AR

An animated, blue-hour coal power plant inspired by the supplied reference photograph. English mobile interface that opens directly into image-tracked augmented reality using MindAR and Three.js.

## Use on a phone

1. Open the deployed HTTPS website in Safari on iPhone or Chrome on Android.
2. Display `coal-ar/public/flyer-target.png` on another screen, or print it without cropping. Use the full, uncropped Design F A4 flyer. The original plant photograph is no longer the tracking target.
3. AR starts automatically. Allow the camera and point at the entire picture. If permission is denied or the browser needs a tap, use **Enable AR camera** to retry. Avoid glare and keep the picture well lit.
4. Choose **Normal operation** or **Shipment bunching**. Pause or explore the four component explanations.
5. **Exit AR** stops the camera. Tap **Enable AR camera** to resume.

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

`flyer-target.mind` is compiled from the full `flyer-target.png` A4 flyer. To change the scan image, replace the PNG and recompile with the [MindAR compiler](https://hiukim.github.io/mind-ar-js-doc/tools/compile/). Save its output as `coal-ar/public/flyer-target.mind`. `compile.html` is the equivalent developer utility for this image.

## Limitations

Image tracking depends on lighting, print quality, camera and browser capabilities. Very small targets, glare or featureless areas can cause loss of tracking. The model is hidden when tracking is lost. Physical iPhone/Android testing is still required before exhibition use. No QR code by itself performs image tracking: it opens the website; the photograph anchors the AR scene.

## Validation

The initial preview was checked at desktop and mobile sizes. The current mobile (390 × 844) direct-AR flow was checked in Chromium for automatic startup without a click, no landing page, camera stop/restart and retry after permission denial. A synthetic camera feed of the supplied A4 flyer was successfully detected by MindAR; exiting AR stopped the camera tracks. No browser page errors were observed. These checks do not substitute for a real phone test.

`coal-ar/verify.mjs` uses Playwright. Install Playwright locally or set `PLAYWRIGHT_PATH` to its installed package, optionally set `CHROME_PATH` to a browser executable, and run it from `coal-ar`. `TEST_CAMERA` may point to a Y4M camera fixture. The script requires a Y4M camera fixture at `TEST_CAMERA` (default: `test-results/camera.y4m`). It verifies automatic startup, target detection, stop/restart and the permission-denied retry screen, and writes an ignored screenshot. Use `public/compile.html` separately to compile a new image target.

Built with [Three.js](https://threejs.org/) and [MindAR](https://hiukim.github.io/mind-ar-js-doc/). Reference photograph supplied by the user.
