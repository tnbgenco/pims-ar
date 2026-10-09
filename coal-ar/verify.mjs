import {createRequire} from 'node:module';
import {resolve} from 'node:path';
const require=createRequire(import.meta.url);
const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
await import('./server.mjs');
const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{}),args:['--use-fake-ui-for-media-stream','--use-fake-device-for-media-stream','--use-file-for-fake-video-capture='+resolve(process.env.TEST_CAMERA||'test-results/camera.y4m')]});
try{
const page=await browser.newPage({viewport:{width:390,height:844}});
await page.goto('http://localhost:8080/');
await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Image detected'),{},{timeout:90000});
if(await page.locator('.intro').count())throw Error('Landing remains');
await page.screenshot({path:'test-results/direct-ar.png'});
await page.click('#exit');if(await page.locator('#start').isHidden())throw Error('Restart unavailable');
if(await page.evaluate(()=>[...document.querySelectorAll('video')].some(v=>v.srcObject?.getTracks().some(t=>t.readyState==='live'))))throw Error('Camera remains active');
await page.click('#start');await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Image detected'),{},{timeout:90000});
console.log('PASS: automatic AR, photograph detected, no landing, stop and restart');
const denied=await browser.newContext({permissions:[]});const p=await denied.newPage();await p.addInitScript(()=>{navigator.mediaDevices.getUserMedia=async()=>{throw new DOMException('Denied','NotAllowedError');};});await p.goto('http://localhost:8080/');await p.waitForFunction(()=>window.pimsAR && !pimsAR.state.starting && !document.querySelector('#start').hidden);if(!await p.locator('#start').isVisible())throw Error('Retry missing');console.log('PASS: denied camera offers retry');
}catch(e){console.error(e);process.exitCode=1;}finally{await browser.close();process.exit(process.exitCode||0);}
