import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

/* ---------- Données ---------- */
const DATA=[
{id:'Soleil',r:8,d:0,T:0,h:609,tilt:7,c:'#ffb347',ty:'Étoile · naine jaune',rel:109,dk:0,gr:27.9,diam:'1 392 700 km',dist:'—',temp:'5 500 °C (surface)',lunes:'—',jour:'≈ 25 jours',an:'—',
 t:"Le Soleil concentre 99,8 % de la masse du système solaire. Sa fusion nucléaire convertit chaque seconde environ 4 millions de tonnes de matière en lumière."},
{id:'Mercure',r:1,d:14,T:.24,h:1407,tilt:0,c:'#a89f95',ty:'Planète tellurique',rel:.38,dk:57.9,gr:.38,diam:'4 879 km',dist:'57,9 M km',temp:'−180 à 430 °C',lunes:'0',jour:'58,6 jours',an:'88 jours',
 t:"La plus petite planète et la plus proche du Soleil. Sans atmosphère, elle subit des écarts de température extrêmes entre le jour et la nuit."},
{id:'Vénus',r:1.8,d:20,T:.62,h:-5832,tilt:3,c:'#e6c27a',ty:'Planète tellurique',rel:.95,dk:108,gr:.91,diam:'12 104 km',dist:'108 M km',temp:'464 °C',lunes:'0',jour:'243 jours (rétrograde)',an:'225 jours',
 t:"Une atmosphère de CO₂ très dense provoque un effet de serre extrême : Vénus est la planète la plus chaude, plus que Mercure. Elle tourne à l'envers."},
{id:'Terre',r:2,d:27,T:1,h:24,tilt:23.4,c:'#3b82d6',ty:'Planète tellurique',rel:1,dk:149.6,gr:1,diam:'12 742 km',dist:'149,6 M km',temp:'15 °C (moyenne)',lunes:'1',jour:'24 h',an:'365,25 jours',
 t:"Notre planète : la seule connue à abriter la vie, avec de l'eau liquide en surface. Les nuages que vous voyez tournent indépendamment du sol."},
{id:'Mars',r:1.4,d:34,T:1.88,h:24.6,tilt:25,c:'#d2693c',ty:'Planète tellurique',rel:.53,dk:227.9,gr:.38,diam:'6 779 km',dist:'227,9 M km',temp:'−63 °C (moyenne)',lunes:'2',jour:'24 h 37',an:'687 jours',
 t:"La planète rouge doit sa couleur à l'oxyde de fer. Elle abrite Olympus Mons, le plus grand volcan connu du système solaire (environ 22 km de haut)."},
{id:'Jupiter',r:5.5,d:62,T:11.86,h:9.9,tilt:3,c:'#d9b08c',ty:'Géante gazeuse',rel:11.2,dk:778.5,gr:2.53,diam:'139 820 km',dist:'778,5 M km',temp:'−110 °C (nuages)',lunes:'95+',jour:'9 h 56',an:'11,9 ans',
 t:"Plus massive que toutes les autres planètes réunies. La Grande Tache rouge est une tempête plus large que la Terre, active depuis plus de 150 ans."},
{id:'Saturne',r:4.6,d:82,T:29.5,h:10.6,tilt:26.7,c:'#e3cd9a',ty:'Géante gazeuse',rel:9.45,dk:1434,gr:1.07,diam:'116 460 km',dist:'1 434 M km',temp:'−140 °C (nuages)',lunes:'270+',jour:'10 h 33',an:'29,5 ans',
 t:"Ses anneaux, faits de glace d'eau et de roches, s'étendent sur des centaines de milliers de kilomètres mais ne mesurent souvent que quelques dizaines de mètres d'épaisseur."},
{id:'Uranus',r:3,d:100,T:84,h:-17.2,tilt:97.8,c:'#9fdfe6',ty:'Géante de glaces',rel:4,dk:2871,gr:.89,diam:'50 724 km',dist:'2 871 M km',temp:'−195 °C',lunes:'28+',jour:'17 h 14 (rétrograde)',an:'84 ans',
 t:"Uranus tourne couchée sur le côté, inclinée de près de 98°. Ses saisons durent chacune plus de 20 ans."},
{id:'Neptune',r:2.9,d:116,T:165,h:16.1,tilt:28.3,c:'#3f66e0',ty:'Géante de glaces',rel:3.86,dk:4495,gr:1.14,diam:'49 244 km',dist:'4 495 M km',temp:'−200 °C',lunes:'16+',jour:'16 h 6',an:'165 ans',
 t:"La planète la plus éloignée, balayée par les vents les plus rapides du système solaire, dépassant 2 000 km/h."}
];

/* ---------- Bruit & textures procédurales ---------- */
const hs=(x,y,z)=>{const n=Math.sin(x*127.1+y*311.7+z*74.7)*43758.5453;return n-Math.floor(n)};
const lp=(a,b,t)=>a+(b-a)*t, sm=t=>t*t*(3-2*t);
const vn=(x,y,z)=>{const X=Math.floor(x),Y=Math.floor(y),Z=Math.floor(z),u=sm(x-X),v=sm(y-Y),w=sm(z-Z),g=(a,b,c)=>hs(X+a,Y+b,Z+c);
 return lp(lp(lp(g(0,0,0),g(1,0,0),u),lp(g(0,1,0),g(1,1,0),u),v),lp(lp(g(0,0,1),g(1,0,1),u),lp(g(0,1,1),g(1,1,1),u),v),w)};
const fbm=(x,y,z,o=5)=>{let s=0,a=.5;for(let i=0;i<o;i++){s+=a*vn(x,y,z);x*=2;y*=2;z*=2;a/=2}return s};
const cl=t=>Math.min(1,Math.max(0,t));
const mix=(a,b,t)=>{t=cl(t);return a.map((c,i)=>c+(b[i]-c)*t)};
function tex(fn){const W=512,H=256,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d'),im=g.createImageData(W,H);
 for(let j=0;j<H;j++){const lat=(.5-(j+.5)/H)*Math.PI,y=Math.sin(lat),k=Math.cos(lat);
  for(let i=0;i<W;i++){const lon=i/W*Math.PI*2,o=(j*W+i)*4,p=fn(k*Math.cos(lon),y,k*Math.sin(lon));
   im.data[o]=p[0];im.data[o+1]=p[1];im.data[o+2]=p[2];im.data[o+3]=p[3]??255}}
 g.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t}
const band=(y,x,z,f,w)=>Math.sin(y*f+fbm(x*3,y*7,z*3)*w)*.5+.5;
const spot=(x,y,z,la,lo,s)=>{const k=Math.cos(la);return 1-cl(Math.hypot(x-k*Math.cos(lo),(y-Math.sin(la))*1.6,z-k*Math.sin(lo))/s)};
const P={
Soleil:(x,y,z)=>{const n=fbm(x*4,y*4,z*4,6),s=vn(x*5+9,y*5,z*5);return mix(mix([255,110,10],[255,235,130],n*1.7-.25),[160,40,0],(s-.62)*6)},
Mercure:(x,y,z)=>{const n=fbm(x*5,y*5,z*5,6),c=vn(x*16,y*16,z*16);return mix([80,76,72],[175,167,158],n*1.3).map(v=>v*(.78+.4*c))},
Vénus:(x,y,z)=>{const w=fbm(x*2,y*4,z*2,3),n=fbm(x*3+w*2,y*7+w*2,z*3+w,5);return mix([196,150,70],[250,228,170],n*1.5-.15)},
Terre:(x,y,z)=>{const h=fbm(x*2.2+3,y*2.2,z*2.2,6),a=Math.abs(y)+(vn(x*9,y*9,z*9)-.5)*.1;
 if(a>.89)return [240,246,255];
 if(h<.5)return mix([4,22,78],[26,100,170],(h-.3)*5);
 const d=cl(1-a*1.6+(fbm(x*5,y*5,z*5,3)-.5));let c=mix([36,108,46],[170,145,85],(h-.5)*3+(d>.55?.3:0)-.1);
 return h>.72?mix(c,[245,245,245],(h-.72)*8):c},
Mars:(x,y,z)=>{const n=fbm(x*3,y*3,z*3,6),d=vn(x*2+4,y*2,z*2);if(Math.abs(y)>.93)return [240,240,245];
 return mix(mix([158,64,32],[218,128,76],n*1.5-.2),[85,42,34],(d-.55)*5)},
Jupiter:(x,y,z)=>{const t=band(y,x,z,19,4),s=spot(x,y,z,-.3,2,.17);return mix(mix([232,214,182],[150,96,62],t),[190,60,38],s*1.5)},
Saturne:(x,y,z)=>mix([232,208,152],[184,150,100],band(y,x,z,26,1.6)),
Uranus:(x,y,z)=>mix([158,222,230],[120,200,214],band(y,x,z,10,.5)),
Neptune:(x,y,z)=>mix(mix([46,86,214],[26,52,160],band(y,x,z,16,2.5)),[10,20,90],spot(x,y,z,-.35,1,.12))
};
const clouds=()=>tex((x,y,z)=>[255,255,255,cl((fbm(x*3,y*3.5,z*3,6)-.46)*5)*235]);

/* ---------- Scène ---------- */
const cv=document.getElementById('c'),R=new THREE.WebGLRenderer({canvas:cv,antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));R.toneMapping=THREE.ACESFilmicToneMapping;
const S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(50,1,.1,3000),OV=new THREE.Vector3(0,95,175);
cam.position.copy(OV);
const ctl=new OrbitControls(cam,cv);ctl.enableDamping=true;ctl.minDistance=2;ctl.maxDistance=700;
S.add(new THREE.AmbientLight(0x1a2040,.7));
const sunL=new THREE.PointLight(0xfff0dd,3.2,0,0);S.add(sunL);

// Étoiles
{const n=7000,p=new Float32Array(n*3),c=new Float32Array(n*3),col=new THREE.Color();
 for(let i=0;i<n;i++){const u=Math.random()*2-1,a=Math.random()*6.283,s=Math.sqrt(1-u*u),r=1200+Math.random()*600;
  p.set([r*s*Math.cos(a),r*u,r*s*Math.sin(a)],i*3);col.setHSL(Math.random()<.5?.6:.08,.5,.6+Math.random()*.4);c.set([col.r,col.g,col.b],i*3)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));g.setAttribute('color',new THREE.BufferAttribute(c,3));
 S.add(new THREE.Points(g,new THREE.PointsMaterial({size:2.2,vertexColors:true,sizeAttenuation:false,depthWrite:false})))}

const glowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),r=g.createRadialGradient(64,64,0,64,64,64);
 r.addColorStop(0,'rgba(255,220,150,1)');r.addColorStop(.25,'rgba(255,150,50,.5)');r.addColorStop(1,'rgba(255,100,0,0)');g.fillStyle=r;g.fillRect(0,0,128,128);return new THREE.CanvasTexture(c)})();
const atmo=(col,s,k=1)=>new THREE.Mesh(new THREE.SphereGeometry(s,48,48),new THREE.ShaderMaterial({uniforms:{c:{value:new THREE.Color(col)},k:{value:k}},
 vertexShader:'varying vec3 n;void main(){n=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
 fragmentShader:'uniform vec3 c;uniform float k;varying vec3 n;void main(){float i=pow(max(dot(-n,vec3(0,0,1)),0.),2.5)*2.5*k;gl_FragColor=vec4(c*i,i);}',
 side:THREE.BackSide,blending:THREE.AdditiveBlending,transparent:true,depthWrite:false}));

const bodies=[],pick=[],moonTex=tex(P.Mercure);
const orbMat=new THREE.LineBasicMaterial({color:0xffffff,transparent:true,opacity:.18});
const orbits=new THREE.Group();S.add(orbits);
DATA.forEach((d,i)=>{
 const b={...d,g:new THREE.Object3D(),tl:new THREE.Object3D(),a:Math.random()*6.28,moons:[],spin:Math.sign(d.h)*6.283/(Math.abs(d.h)/24*8)};
 b.tl.rotation.z=d.tilt*Math.PI/180;
 const t=tex(P[d.id]),geo=new THREE.SphereGeometry(d.r,96,64);
 b.m=new THREE.Mesh(geo,i?new THREE.MeshStandardMaterial({map:t,roughness:.9,metalness:0,...(['Mercure','Mars','Terre'].includes(d.id)?{bumpMap:t,bumpScale:d.id=='Terre'?.4:1.4}:{})}):new THREE.MeshBasicMaterial({map:t}));
 b.tl.add(b.m);b.g.add(b.tl);S.add(b.g);pick.push(b.m);b.m.userData.b=b;
 if(!i){[[44,1],[78,.55]].forEach(([s,o],k)=>{const sp=new THREE.Sprite(new THREE.SpriteMaterial({map:glowTex,blending:THREE.AdditiveBlending,transparent:true,opacity:o,depthWrite:false}));sp.scale.setScalar(s);sp.userData.k=k;b.g.add(sp);b.glow=(b.glow||[]).concat(sp)})}
 else{
  const col={Vénus:'#ffcf80',Terre:'#4aa3ff',Mars:'#e08a5a',Jupiter:'#d9b890',Saturne:'#e8d49c',Uranus:'#8fe8ff',Neptune:'#4d7dff'}[d.id];
  if(col)b.tl.add(atmo(col,d.r*(d.id=='Vénus'?1.2:1.14),d.id=='Terre'?1.6:.8));
  orbits.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(Array.from({length:257},(_,j)=>new THREE.Vector3(Math.cos(j/256*6.2832)*d.d,0,Math.sin(j/256*6.2832)*d.d))),orbMat));
 }
 if(d.id=='Terre'){b.cl=new THREE.Mesh(new THREE.SphereGeometry(d.r*1.012,64,48),new THREE.MeshStandardMaterial({map:clouds(),transparent:true,depthWrite:false,roughness:1}));b.tl.add(b.cl)}
 if(d.id=='Saturne'){const a=5.8,z=11,rg=new THREE.RingGeometry(a,z,160),p=rg.attributes.position,u=rg.attributes.uv,v=new THREE.Vector3();
  for(let k=0;k<p.count;k++){v.fromBufferAttribute(p,k);u.setXY(k,(v.length()-a)/(z-a),1)}
  const c=document.createElement('canvas');c.width=1024;c.height=1;const g=c.getContext('2d');
  for(let k=0;k<1024;k++){const r=k/1024,al=(.35+.65*vn(r*70,1,1))*(r<.08?r/.08:1)*(r>.9?(1-r)/.1:1)*((r>.58&&r<.64)?.06:1)*(r>.65?1:.55);g.fillStyle=`rgba(${215-r*40|0},${190-r*40|0},${150-r*30|0},${cl(al)})`;g.fillRect(k,0,1,1)}
  const rt=new THREE.CanvasTexture(c);rt.colorSpace=THREE.SRGBColorSpace;
  const ring=new THREE.Mesh(rg,new THREE.MeshStandardMaterial({map:rt,side:THREE.DoubleSide,transparent:true,depthWrite:false,roughness:1}));ring.rotation.x=Math.PI/2;b.tl.add(ring)}
 const mk=(n,r,dist,days,color)=>{const pv=new THREE.Object3D(),m=new THREE.Mesh(new THREE.SphereGeometry(r,32,24),new THREE.MeshStandardMaterial({color,roughness:1,bumpMap:moonTex,bumpScale:1}));
  m.position.x=dist;pv.add(m);pv.rotation.y=Math.random()*6.28;b.g.add(pv);b.moons.push({pv,w:6.283/(Math.pow(days,.7)*3)});};
 if(d.id=='Terre')mk('Lune',.55,4.6,27.3,'#bbb');
 if(d.id=='Jupiter'){mk('Io',.45,8.5,1.77,'#e8d36a');mk('Europe',.4,10.5,3.55,'#e6dcc8');mk('Ganymède',.65,13,7.15,'#9a8d80');mk('Callisto',.55,15.5,16.7,'#5d564f')}
 bodies.push(b);
});
// Ceinture d'astéroïdes
const belt=(()=>{const n=6000,p=new Float32Array(n*3);for(let i=0;i<n;i++){const a=Math.random()*6.283,r=40+Math.random()*8+(Math.random()-.5)*2;p.set([Math.cos(a)*r,(Math.random()-.5)*2.2,Math.sin(a)*r],i*3)}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(p,3));const o=new THREE.Points(g,new THREE.PointsMaterial({color:0xb9ad9c,size:.35}));S.add(o);return o})();

/* ---------- Interface ---------- */
const $=s=>document.querySelector(s),info=$('#info'),nav=$('#nav'),lab=$('#labels');
let speed=1,paused=false,focus=null,flying=false,ovFly=false,dirv=new THREE.Vector3(),last=new THREE.Vector3(),hover=null;
bodies.forEach(b=>{b.lb=Object.assign(document.createElement('div'),{className:'lb',textContent:b.id});lab.append(b.lb);
 b.bt=Object.assign(document.createElement('button'),{innerHTML:`<i style="background:${b.c}"></i>${b.id}`});b.bt.onclick=()=>select(b);nav.append(b.bt)});
const bar=(l,v,c)=>`<div class="bar">${l}<span style="--c:${c};width:0" data-w="${v}"></span></div>`;
function select(b){
 focus=b;flying=true;ovFly=false;last.copy(b.g.position);
 dirv.copy(cam.position).sub(b.g.position).normalize();dirv.y=Math.max(dirv.y,.25);dirv.setLength(b.r*(b.id=='Saturne'?4.2:b.id=='Soleil'?3:4)+(b.id=='Jupiter'?14:5));
 bodies.forEach(x=>x.bt.classList.toggle('on',x==b));
 const sz=Math.sqrt(b.rel/109)*100,ds=Math.sqrt(b.dk/4495)*100;
 info.hidden=false;info.style.animation='none';void info.offsetWidth;info.style.animation='';
 info.innerHTML=`<button class="x" aria-label="Fermer">✕</button><h2>${b.id}</h2><p class="ty">${b.ty}</p><p>${b.t}</p>
 <div class="g">${[['Diamètre',b.diam],['Distance au Soleil',b.dist],['Température',b.temp],['Lunes',b.lunes],['Durée du jour',b.jour],['Durée de l’année',b.an]].map(([k,v])=>`<div><small>${k}</small><b>${v}</b></div>`).join('')}</div>
 ${bar(`Taille : ${b.rel==1?'référence':'×'+String(b.rel).replace('.',',')+' la Terre'}`,sz,b.c)}${bar('Éloignement du Soleil',ds,b.c)}
 <div class="w"><label>Votre masse (kg) <input id="kg" type="number" value="70" min="1" max="500"></label><output id="wo"></output></div>`;
 info.querySelector('.x').onclick=overview;
 const calc=()=>{$('#wo').textContent=`Vous pèseriez ${(($('#kg').value||0)*b.gr).toFixed(1).replace('.',',')} kg ici`};
 $('#kg').oninput=calc;calc();
 requestAnimationFrame(()=>info.querySelectorAll('.bar span').forEach(s=>s.style.width=s.dataset.w+'%'));
}
function overview(){focus=null;ovFly=true;info.hidden=true;bodies.forEach(x=>x.bt.classList.remove('on'))}
$('#ov').onclick=overview;
$('#pause').onclick=e=>{paused=!paused;e.target.textContent=paused?'Lecture':'Pause'};
$('#speed').oninput=e=>{speed=Math.pow(1.09,e.target.value-10)*(e.target.value==0?0:1);$('#spv').textContent='×'+(+speed.toFixed(1))};
$('#tOrb').onchange=e=>orbits.visible=e.target.checked;
$('#tBelt').onchange=e=>belt.visible=e.target.checked;
let showL=true;$('#tLab').onchange=e=>{showL=e.target.checked;lab.style.display=showL?'':'none'};
addEventListener('keydown',e=>{const i=bodies.indexOf(focus);
 if(e.key=='ArrowRight')select(bodies[(i+1)%bodies.length]);
 else if(e.key=='ArrowLeft')select(bodies[(i<=0?bodies.length:i)-1]);
 else if(e.key=='Escape')overview();else if(e.key==' '&&e.target.tagName!='BUTTON'){e.preventDefault();$('#pause').click()}});

const ray=new THREE.Raycaster(),mp=new THREE.Vector2();let down=null;
const hit=e=>{mp.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(mp,cam);return ray.intersectObjects(pick)[0]?.object.userData.b};
cv.addEventListener('pointerdown',e=>down=[e.clientX,e.clientY]);
cv.addEventListener('pointerup',e=>{if(down&&Math.hypot(e.clientX-down[0],e.clientY-down[1])<5){const b=hit(e);if(b)select(b)}});
cv.addEventListener('pointermove',e=>{hover=hit(e);cv.style.cursor=hover?'pointer':'grab'});

function resize(){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();

/* ---------- Boucle ---------- */
const clk=new THREE.Clock(),v3=new THREE.Vector3();
(function loop(){requestAnimationFrame(loop);
 const real=Math.min(clk.getDelta(),.05),dt=paused?0:real*speed,T=clk.elapsedTime;
 bodies.forEach(b=>{
  if(b.T){b.a+=dt*6.2832/(b.T*30);b.g.position.set(Math.cos(b.a)*b.d,0,Math.sin(b.a)*b.d)}
  b.m.rotation.y+=dt*b.spin;if(b.cl)b.cl.rotation.y+=dt*b.spin*1.25;
  b.moons.forEach(m=>m.pv.rotation.y+=dt*m.w);
  if(b.glow)b.glow.forEach(s=>s.scale.setScalar((s.userData.k?78:44)*(1+.035*Math.sin(T*1.5+s.userData.k*2))));
 });
 belt.rotation.y+=dt*.01;
 if(focus){const p=focus.g.position;
  if(flying){const g=v3.copy(p).add(dirv);cam.position.lerp(g,.06);ctl.target.lerp(p,.1);if(cam.position.distanceTo(g)<.4)flying=false}
  else{cam.position.add(p).sub(last);ctl.target.copy(p)}
  last.copy(p)}
 else if(ovFly){cam.position.lerp(OV,.04);ctl.target.lerp(v3.set(0,0,0),.06);if(cam.position.distanceTo(OV)<.5)ovFly=false}
 ctl.update();
 bodies.forEach(b=>{v3.copy(b.g.position);v3.y+=b.r*1.35+.6;v3.project(cam);
  const on=showL&&v3.z<1;b.lb.style.display=on?'':'none';
  if(on){b.lb.style.left=(v3.x*.5+.5)*innerWidth+'px';b.lb.style.top=(-v3.y*.5+.5)*innerHeight+'px';b.lb.classList.toggle('h',b==hover||b==focus)}});
 R.render(S,cam)})();
setTimeout(()=>$('#loader').classList.add('off'),400);
