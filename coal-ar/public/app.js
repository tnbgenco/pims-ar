import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

const $=s=>document.querySelector(s), container=$('#viewer');
const state={bunch:false,paused:false,time:0,ar:false,starting:false,stage:0};
const scene=new THREE.Scene(); scene.background=new THREE.Color('#071525');
const camera=new THREE.PerspectiveCamera(36,innerWidth/innerHeight,.1,200);
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace=THREE.SRGBColorSpace; container.appendChild(renderer.domElement);
const controls=new OrbitControls(camera,renderer.domElement); controls.enableDamping=true;controls.maxPolarAngle=Math.PI*.46;controls.minDistance=11;controls.maxDistance=36;
const plant=new THREE.Group();scene.add(plant);
function lighting(s){s.add(new THREE.HemisphereLight(0xa9d9ff,0x263851,2.4));const sun=new THREE.DirectionalLight(0xffe2b5,3);sun.position.set(-4,9,6);s.add(sun);const blue=new THREE.DirectionalLight(0x40a8ff,2.5);blue.position.set(5,5,-6);s.add(blue);}
lighting(scene);
const mats={};function mat(c,metal=.15){const k=c+':'+metal;return mats[k]??=new THREE.MeshStandardMaterial({color:c,roughness:.65,metalness:metal});}
function mesh(g,c,parent=plant){const m=new THREE.Mesh(g,typeof c==='object'?c:mat(c));parent.add(m);return m;}
function box(x,y,z,w,h,d,c,parent=plant){const m=mesh(new THREE.BoxGeometry(w,h,d),c,parent);m.position.set(x,y,z);return m;}
function cyl(x,y,z,r,h,c,parent=plant,rt=r){const m=mesh(new THREE.CylinderGeometry(rt,r,h,16),c,parent);m.position.set(x,y,z);return m;}
function line(a,b,r,c,parent=plant){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),v=bv.clone().sub(av);const m=mesh(new THREE.CylinderGeometry(r,r,v.length(),6),c,parent);m.position.copy(av.add(bv).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
function label(text,x,y,z,color='#99f5e8',parent=plant){const cv=document.createElement('canvas');cv.width=512;cv.height=96;const ctx=cv.getContext('2d');ctx.fillStyle='#102637e8';ctx.fillRect(0,0,512,96);ctx.strokeStyle=color;ctx.lineWidth=4;ctx.strokeRect(2,2,508,92);ctx.fillStyle=color;ctx.font='600 32px sans-serif';ctx.textAlign='center';ctx.fillText(text,256,59);const tex=new THREE.CanvasTexture(cv);const s=new THREE.Sprite(new THREE.SpriteMaterial({map:tex,depthTest:false}));s.position.set(x,y,z);s.scale.set(2.15,.4,1);parent.add(s);return s;}
const steel='#648497',silver='#b2c5ce',gold='#eab747',cyan='#6ae3da',coal='#202b39';
box(0,-.22,0,12,.42,8.8,'#173247');box(1,-.02,.6,9.8,.15,7.4,'#465866');
const sea=box(-4.4,.01,0,3.1,.08,8.6,'#0d5c84');
for(let i=0;i<23;i++)box(-4.6+(i%3)*.6,.062,-4+i*.35,.45,.01,.014,'#3f8fa7');
for(let i=0;i<15;i++){box(-2.7+i*.57,.07,3.6,.28,.013,.035,'#9eafba');}
// Berth, piles and unloading crane.
box(-2.85,.16,-1.8,.55,.24,4.4,'#718995');
for(let i=0;i<6;i++)cyl(-2.87,-.08,-3.6+i*.72,.065,.6,steel);
const crane=new THREE.Group();plant.add(crane);crane.position.set(-2.8,0,-2.2);
for(const x of [-.18,.18])for(const z of [-.28,.28])line([x,.25,z],[x,1.6,z],.045,gold,crane);
box(0,1.65,0,.64,.16,.7,gold,crane);line([0,1.7,0],[-1.2,1.9,0],.065,gold,crane);line([0,2.25,0],[-1.2,1.9,0],.024,silver,crane);line([0,1.7,0],[0,2.25,0],.035,gold,crane);
const grab=cyl(-1.05,1.05,0,.13,.2,gold,crane);line([-1.05,1.9,0],[-1.05,.9,0],.009,silver,crane);
function ship(x,z){const g=new THREE.Group();plant.add(g);g.position.set(x,.16,z);box(0,.15,0,.66,.3,1.9,'#29596e',g);const bow=mesh(new THREE.ConeGeometry(.4,.6,4),'#29596e',g);bow.rotation.x=Math.PI/2;bow.rotation.z=Math.PI/4;bow.position.z=-1.13;box(0,.34,.56,.57,.13,.43,'#e2d8be',g);box(0,.5,.66,.4,.22,.26,silver,g);box(0,.62,.63,.42,.035,.31,'#324452',g);for(let i=0;i<3;i++)box(0,.33,-.65+i*.38,.5,.08,.3,coal,g);cyl(.13,.71,.73,.035,.24,gold,g);return g;}
const ships=[ship(-4,-2),ship(-4.85,1.1),ship(-3.85,2.4)];
// Coal stockpiles and retaining walls.
for(const z of [.25,2.0]){
 box(.05,.18,z,4.5,.16,1.25,'#243341');
 for(let i=0;i<7;i++){const pile=mesh(new THREE.ConeGeometry(.68,.68+(i%3)*.08,7),coal);pile.position.set(-1.75+i*.57,.56,z);pile.scale.z=.79;pile.rotation.y=i*.8;}
 for(const side of [-.69,.69])box(.1,.23,z+side,4.8,.3,.07,'#8499a3');
}
// Reclaimer on rails, with rotating bucket wheel and slewing boom.
for(const z of [.94,1.28])box(.1,.2,z,5,.06,.045,steel);
const reclaimer=new THREE.Group();plant.add(reclaimer);reclaimer.position.set(.1,.28,1.11);
box(0,.16,0,.75,.22,.5,gold,reclaimer);for(const x of [-.27,.27])for(const z of [-.25,.25]){const w=cyl(x,.07,z,.1,.09,coal,reclaimer);w.rotation.x=Math.PI/2;}
cyl(0,.48,0,.16,.48,gold,reclaimer);const boom=new THREE.Group();reclaimer.add(boom);boom.position.y=.7;
line([-.4,0,0],[1.65,-.16,0],.065,gold,boom);line([-.4,.27,0],[1.65,.06,0],.04,gold,boom);
for(let i=0;i<8;i++){const x=-.4+i*.27;line([x,.23,0],[x+.27,-.13,0],.018,gold,boom);}
box(-.43,.07,0,.32,.3,.37,steel,boom);line([0,.65,0],[1.55,0,0],.012,silver,boom);line([0,0,0],[0,.65,0],.026,gold,boom);
const wheel=new THREE.Group();boom.add(wheel);wheel.position.set(1.67,-.13,0);
const rim=mesh(new THREE.TorusGeometry(.3,.035,6,20),gold,wheel);for(let i=0;i<8;i++){const a=i*Math.PI/4;line([0,0,0],[Math.cos(a)*.3,Math.sin(a)*.3,0],.016,gold,wheel);const b=box(Math.cos(a)*.32,Math.sin(a)*.32,0,.12,.12,.17,silver,wheel);b.rotation.z=a;}
// Conveyors with visibly moving coal loads.
const particles=[];
function conveyor(a,b,width=.3){const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b);line(a,b,width/2,'#2a4659');for(const offset of [-width*.6,width*.6]){line([a[0],a[1]+.1,a[2]+offset],[b[0],b[1]+.1,b[2]+offset],.015,gold);}for(let i=0;i<=5;i++){const v=start.clone().lerp(end,i/5);line([v.x,.1,v.z],[v.x,v.y,v.z],.035,steel);}for(let i=0;i<9;i++){const p=mesh(new THREE.BoxGeometry(.09,.06,.09),cyan);particles.push({p,start,end,offset:i/9});}}
conveyor([-2.7,1.05,-2.2],[-1.6,.72,.3]);conveyor([-1.65,.7,.3],[2.65,1.45,.3]);conveyor([2.65,1.45,.3],[3.1,2.3,-1.6]);
// Boiler steel frame and galleries.
const boiler=new THREE.Group();plant.add(boiler);boiler.position.set(3.55,0,-1.65);
box(0,2.88,0,2.7,.72,1.8,silver,boiler);box(0,3.3,0,2.86,.08,1.96,'#7895a9',boiler);
for(const x of [-1.2,0,1.2])for(const z of [-.8,.8]){line([x,.13,z],[x,3.25,z],.048,steel,boiler);}
for(let k=0;k<4;k++){const y=.55+k*.63;box(0,y,0,2.65,.07,1.75,steel,boiler);for(const z of [-.86,.86]){line([-1.3,y+.23,z],[1.3,y+.23,z],.018,gold,boiler);for(const x of [-1.3,-.65,0,.65,1.3])line([x,y,z],[x,y+.23,z],.015,gold,boiler);}for(const x of [-1.2,0])line([x,y,-.83],[x+1.2,y+.63,-.83],.025,silver,boiler);}
cyl(-.5,1.55,.12,.34,2.2,silver,boiler);cyl(.45,1.45,.12,.31,2,silver,boiler);
for(let i=0;i<5;i++)line([-.9+i*.42,2.65,.96],[-.9+i*.42,.4,.96],.055,'#c3ccbe',boiler);
const fire=box(0,.64,.95,.8,.4,.025,new THREE.MeshBasicMaterial({color:'#ff9b3f'}),boiler);
box(4.1,.68,1.4,2.5,1.25,1.4,'#91a7b5');box(4.1,1.32,1.4,2.6,.09,1.5,silver);
// Twin striped stacks and animated exhaust (illustrative).
const puffs=[];
for(const x of [2.25,4.85]){cyl(x,2.23,-3.1,.21,4.4,'#c1cbd1',plant,.15);for(let k=0;k<3;k++)cyl(x,3.75+k*.22,-3.1,.172,.105,k%2?'#d5dbe0':'#344f72');cyl(x,4.46,-3.1,.17,.08,gold);for(let j=0;j<8;j++){const m=new THREE.MeshBasicMaterial({color:'#c4e7f2',transparent:true,opacity:.1,depthWrite:false});const p=mesh(new THREE.IcosahedronGeometry(.13,1),m);puffs.push({p,x,offset:j/8});}}
// Service lights and cyan process nodes.
for(const [x,z] of [[-2.2,3.4],[2.1,3.4],[5.3,.2],[-2.3,-.3]]){line([x,.1,z],[x,1.1,z],.018,silver);box(x,1.12,z,.17,.05,.12,new THREE.MeshBasicMaterial({color:'#c4f6ff'}));}
const labels=[label('01  SHIPMENT',-4,1.25,-2),label('02  COAL YARD',-.9,1.1,2.5),label('03  RECLAIMER',.7,1.85,1.1),label('04  BOILER',3.5,3.75,-1.7)];
const queueLabel=label('2 SHIPS WAITING',-4.4,.95,2.1,'#ffc879');queueLabel.visible=false;
const details=[['01 / SHIPMENT','From ship to berth','Ships deliver coal supplies. The unloader transfers coal onto a conveyor to the coal yard.'],['02 / COAL YARD','Stock for continuity','Coal is stored in stockpiles before being reclaimed and transported by conveyor.'],['03 / STACKER RECLAIMER','Stack. Reclaim. Transfer.','The boom slews and the bucket wheel rotates to reclaim coal from the stockpile.'],['04 / BOILER','From heat to power','Coal is delivered for fuel preparation and combustion. Heat produces steam to drive a turbine; the turbine is not shown.']];
function updateInfo(){const d=state.bunch&&state.stage===0?['01 / SHIPMENT BUNCHING','Bunched arrivals, limited berths','Three ships arrive close together. One is unloading while two wait their turn. An illustrative scenario, not a waiting-time forecast.']:details[state.stage];$('#info .eyebrow').textContent=d[0];$('#info h2').textContent=d[1];$('#info p').textContent=d[2];labels.forEach((l,i)=>{l.material.opacity=i===state.stage?1:.45;});}
function fit(){if(state.ar)return;const w=container.clientWidth,h=container.clientHeight;camera.aspect=w/h;camera.updateProjectionMatrix();renderer.setSize(w,h);const mobile=innerWidth<700;camera.position.set(mobile?10:13,mobile?9.5:12,mobile?14:17);controls.target.set(mobile?0:-1.5,.8,0);controls.update();}
fit();updateInfo();addEventListener('resize',fit);
let last=performance.now();function animate(now){const dt=Math.min((now-last)/1000,.06);last=now;if(!state.paused)state.time+=dt;const t=state.time;wheel.rotation.z=-t*1.8;boom.rotation.y=Math.sin(t*.35)*.36;reclaimer.position.x=Math.sin(t*.16)*.65;grab.position.y=1.1+Math.sin(t*1.4)*.28;ships.forEach((s,i)=>{s.visible=i===0||state.bunch;s.position.y=.16+Math.sin(t*1.2+i)*.035;});queueLabel.visible=state.bunch;particles.forEach(({p,start,end,offset})=>{p.position.copy(start).lerp(end,(t*.17+offset)%1);p.position.y+=.12;});puffs.forEach(({p,x,offset})=>{const a=(t*.16+offset)%1;p.position.set(x+a*.65,4.5+a*1.5,-3.1);p.scale.setScalar(.5+a*2);p.material.opacity=(1-a)*.2;});fire.material.color.setRGB(1,.35+Math.sin(t*5)*.13,.06);if(!state.ar){controls.update();renderer.render(scene,camera);}else if(arEngine){arEngine.renderer.render(arEngine.scene,arEngine.camera);}requestAnimationFrame(animate);}
requestAnimationFrame(animate);
document.querySelectorAll('[data-stage]').forEach(b=>b.onclick=()=>{state.stage=Number(b.dataset.stage);document.querySelectorAll('[data-stage]').forEach(x=>x.classList.toggle('active',x===b));updateInfo();});
function mode(bunch){state.bunch=bunch;$('#normal').classList.toggle('active',!bunch);$('#bunch').classList.toggle('active',bunch);updateInfo();}$('#normal').onclick=()=>mode(false);$('#bunch').onclick=()=>mode(true);
$('#pause').onclick=()=>{state.paused=!state.paused;$('#pause').textContent=state.paused?'▶':'Ⅱ';$('#pause').setAttribute('aria-label',state.paused?'Resume animation':'Pause animation');};$('#reset').onclick=fit;
$('#target').onclick=()=>$('#poster').showModal();$('#close').onclick=()=>$('#poster').close();
let arEngine=null;
function releaseAR(){if(!arEngine)return;try{arEngine.controller?.stopProcessVideo();}catch{}arEngine.video?.srcObject?.getTracks().forEach(t=>t.stop());arEngine.video?.remove();arEngine.renderer?.dispose();arEngine.renderer?.domElement.remove();arEngine.cssRenderer?.domElement.remove();}
$('#start').onclick=async()=>{
 if(state.starting)return;if(!isSecureContext||!navigator.mediaDevices){$('#status').textContent='Camera access requires HTTPS. Open the GitHub Pages link in Safari or Chrome.';$('#start').hidden=false;return;}
 state.starting=true;$('#start').disabled=true;$('#start').hidden=true;$('#status').textContent='Loading AR… allow camera access when prompted.';
 try{
  if(!arEngine){const {MindARThree}=await import('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-three.prod.js');arEngine=new MindARThree({container,imageTargetSrc:'./target.mind',uiLoading:'no',uiScanning:'no',uiError:'no',filterMinCF:.001,filterBeta:.01});arEngine.renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));lighting(arEngine.scene);const anchor=arEngine.addAnchor(0);const holder=new THREE.Group();holder.rotation.x=Math.PI/2;holder.scale.setScalar(.078);holder.position.y=-.05;anchor.group.add(holder);arEngine.plantHolder=holder;anchor.onTargetFound=()=>$('#status').textContent='Image detected · AR animation active';anchor.onTargetLost=()=>$('#status').textContent='Point the camera back at the plant image';}
  renderer.domElement.hidden=true;state.ar=true;document.body.classList.add('ar');$('#exit').hidden=false;$('#caption').textContent='Point the camera at the entire plant image';$('#reset').hidden=true;arEngine.plantHolder.add(plant);
  arEngine.anchors.forEach(anchor=>{anchor.visible=false;anchor.group.visible=false;});
  await arEngine.start();$('#status').textContent=arEngine.anchors.some(anchor=>anchor.visible)?'Image detected · AR animation active':'Scan the plant image · Keep the whole image in view';
 }catch(e){console.error(e);releaseAR();arEngine=null;restore();$('#status').textContent=e?.name==='NotAllowedError'?'Camera access denied. Allow the camera in your browser settings, then tap Enable AR camera.':'Unable to start AR. Check camera permissions and your connection, then tap Enable AR camera to retry.';}
 finally{state.starting=false;$('#start').disabled=false;}
};
function restore(){state.ar=false;scene.add(plant);renderer.domElement.hidden=true;document.body.classList.remove('ar');$('#exit').hidden=true;$('#start').hidden=false;}
$('#exit').onclick=()=>{if(state.starting)return;try{arEngine?.stop();}catch{}restore();$('#status').textContent='Camera stopped. Tap Enable AR camera to resume.';};
addEventListener('pagehide',()=>{try{arEngine?.stop();}catch{}});
// Expose minimal diagnostic state for automated smoke checks.
window.pimsAR={state,scene,plant,ships,wheel,renderer};
$('#start').onclick();
