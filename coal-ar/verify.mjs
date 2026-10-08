import {createRequire} from 'node:module';
import {writeFile,mkdir} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
await import('./server.mjs');
await mkdir('test-results',{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--enable-webgl','--ignore-gpu-blocklist','--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream',...(process.env.TEST_CAMERA?['--use-file-for-fake-video-capture='+process.env.TEST_CAMERA]:[])]});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://localhost:8080/compile.html');
 await page.waitForFunction(()=>document.querySelector('#status').textContent==='DONE'||document.querySelector('#status').textContent.startsWith('ERROR'),{},{timeout:240000});
 const result=await page.locator('#status').textContent();if(result!=='DONE')throw new Error(result);
 const bytes=await page.evaluate(()=>window.targetBytes);await writeFile('public/target.mind',new Uint8Array(bytes));console.log('Compiled target:',bytes.length,'bytes');
 await page.goto('http://localhost:8080/');await page.waitForFunction(()=>window.pimsAR);await page.waitForTimeout(1500);
 await page.screenshot({path:'test-results/desktop.png'});
 await page.click('#bunch');if(!await page.evaluate(()=>pimsAR.state.bunch))throw new Error('Bunching toggle failed');
 await page.click('#pause');const t=await page.evaluate(()=>pimsAR.state.time);await page.waitForTimeout(250);if(await page.evaluate(()=>pimsAR.state.time)!==t)throw new Error('Pause failed');
 await page.click('#pause');await page.click('[data-stage="3"]');if(!await page.locator('#info h2').textContent().then(s=>s.includes('haba')))throw new Error('Stage failed');
 await page.click('#target');if(!await page.locator('#poster').isVisible())throw new Error('Poster failed');await page.click('#close');
 await page.setViewportSize({width:390,height:844});await page.click('[data-stage="0"]');await page.screenshot({path:'test-results/mobile.png'});
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw new Error('Mobile overflow');
 if(process.env.TEST_CAMERA){await page.click('#start');await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Gambar dikesan'),{},{timeout:90000});console.log('Image tracking detected supplied photograph');await page.screenshot({path:'test-results/ar.png'});await page.click('#exit');if(await page.evaluate(()=>pimsAR.state.ar))throw new Error('AR exit failed');if(await page.evaluate(()=>[...document.querySelectorAll('video')].some(v=>v.srcObject?.getTracks().some(t=>t.readyState==='live'))))throw new Error('Camera not stopped');console.log('AR exit stops camera');}
 console.log('Smoke tests passed; page errors:',JSON.stringify(errors));if(errors.length)throw new Error('Browser errors');
}catch(e){console.error(e);process.exitCode=1;}finally{await browser.close();process.exit(process.exitCode||0);}
