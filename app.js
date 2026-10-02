const topicData={
  planetas:{label:'PLANETAS',copy:'Mundos que orbitan una estrella. Compara sus tamaños, atmósferas y paisajes.'},
  estrellas:{label:'ESTRELLAS',copy:'Grandes esferas de gas que emiten luz y energía. El Sol es la estrella más cercana a la Tierra.'},
  galaxias:{label:'GALAXIAS',copy:'Enormes conjuntos de estrellas, gas y polvo unidos por la gravedad.'},
  agujeros:{label:'AGUJEROS NEGROS',copy:'Regiones del espacio donde la gravedad es tan intensa que ni la luz puede escapar.'},
  exoplanetas:{label:'EXOPLANETAS',copy:'Planetas que orbitan estrellas distintas del Sol. Cada nuevo hallazgo amplía lo que conocemos.'}
};
const planets=['Mercurio','Venus','Tierra','Marte','Júpiter','Saturno','Urano','Neptuno'];
const planetCopy={Mercurio:'El planeta más cercano al Sol. Un mundo rocoso de contrastes extremos.',Venus:'Un planeta rocoso con una atmósfera densa y temperaturas muy altas.',Tierra:'Nuestro hogar: un planeta rocoso con agua líquida en su superficie.',Marte:'Un planeta rocoso conocido por su tono rojizo y su paisaje polvoriento.',Júpiter:'El planeta más grande del Sistema Solar, formado principalmente por gases.',Saturno:'Un gigante gaseoso rodeado por un sistema amplio de anillos.',Urano:'Un gigante helado con una atmósfera fría y un tono azul verdoso.',Neptuno:'Un gigante helado que recorre la región más distante del Sistema Solar.'};
const menuToggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('.main-nav');
menuToggle.addEventListener('click',()=>{const open=menuToggle.getAttribute('aria-expanded')!=='true';menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú');nav.classList.toggle('is-open',open)});
nav.querySelectorAll('a').forEach(link=>link.addEventListener('click',()=>{menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Abrir menú');nav.classList.remove('is-open')}));
document.querySelectorAll('.explore-item').forEach((button,index)=>button.addEventListener('click',()=>{
  document.querySelectorAll('.explore-item').forEach(item=>{item.classList.remove('is-selected');item.setAttribute('aria-selected','false')});button.classList.add('is-selected');button.setAttribute('aria-selected','true');
  const data=topicData[button.dataset.topic];document.querySelector('#topic-copy').textContent=data.copy;document.querySelector('#topic-count').textContent=`0${index+1} / 05`;document.querySelector('#visual-label').textContent=data.label;
  const core=document.querySelector('#explore-core');core.dataset.topic=button.dataset.topic;core.animate([{transform:'translate(-50%,-50%) scale(.92)',opacity:.65},{transform:'translate(-50%,-50%) scale(1)',opacity:1}],{duration:430,easing:'cubic-bezier(.2,.7,.2,1)'});
}));
document.querySelectorAll('.planet').forEach(button=>button.addEventListener('click',()=>{
  const name=button.dataset.planet;document.querySelector('#planet-name').textContent=name;document.querySelector('#planet-copy').textContent=planetCopy[name];document.querySelector('#planet-count').textContent=`0${planets.indexOf(name)+1} — 08`;document.querySelectorAll('.planet').forEach(p=>p.classList.remove('is-active'));button.classList.add('is-active');
}));
const eventCopy={eclipse:'Un eclipse ocurre cuando un cuerpo celeste se interpone y proyecta su sombra sobre otro.',lluvia:'Las lluvias de meteoros se aprecian mejor desde un lugar oscuro y con horizonte despejado.',luna:'Observar la Luna en distintas noches ayuda a reconocer cómo cambia su parte iluminada.',conjuncion:'En una conjunción, dos o más astros parecen acercarse en el cielo desde nuestra perspectiva.',cometas:'Un cometa puede desarrollar una coma y una cola al acercarse al Sol.'};
document.querySelectorAll('.event-row').forEach(row=>row.addEventListener('click',()=>{document.querySelectorAll('.event-row').forEach(item=>item.classList.remove('active'));row.classList.add('active');row.querySelector('.event-desc').textContent=eventCopy[row.dataset.event]}));
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(item=>observer.observe(item));

const phaseLabels={new:'LUNA NUEVA',quarter:'CUARTO CRECIENTE',full:'LUNA LLENA'};
const moonDisc=document.querySelector('.moon-disc');
document.querySelectorAll('.phase-choice').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.phase-choice').forEach(item=>item.classList.remove('is-active'));
  button.classList.add('is-active');moonDisc.dataset.phase=button.dataset.phase;document.querySelector('#phase-name').textContent=phaseLabels[button.dataset.phase];
}));
const galaxyDescriptions={spiral:'Brazos curvos alrededor de un centro brillante.',elliptical:'Formas redondeadas u ovaladas, con poca estructura visible.',irregular:'Contornos diversos, sin una forma definida.'};
document.querySelectorAll('.galaxy-type').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.galaxy-type').forEach(item=>item.classList.remove('is-active'));
  button.classList.add('is-active');document.querySelector('#galaxy-description').textContent=galaxyDescriptions[button.dataset.galaxy];
  document.querySelector('.spiral-galaxy').dataset.shape=button.dataset.galaxy;
}));

const journeySections=[['.hero','#inicio'],['#luna','#luna'],['#sistema-solar','#sistema-solar'],['#estrellas','#estrellas'],['#galaxias','#galaxias'],['#agujeros-negros','#agujeros-negros'],['#eventos','#eventos'],['#bolivia','#bolivia']];
const progressLinks=[...document.querySelectorAll('.journey-progress a')];
function updateJourneyProgress(){
  const marker=window.innerHeight*.48;let nearest=0,distance=Infinity;
  journeySections.forEach(([selector],index)=>{const section=document.querySelector(selector);if(!section)return;const rect=section.getBoundingClientRect();const gap=marker<rect.top?rect.top-marker:marker>rect.bottom?marker-rect.bottom:0;if(gap<distance){distance=gap;nearest=index}});
  progressLinks.forEach((link,index)=>{const active=index===nearest;link.classList.toggle('is-current',active);if(active)link.setAttribute('aria-current','step');else link.removeAttribute('aria-current')});
}

const hero=document.querySelector('.hero');
const cosmos=document.querySelector('#cosmos-canvas');
const context=cosmos.getContext('2d',{alpha:true});
const heroImage=document.querySelector('.hero-image');
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
let canvasWidth=0,canvasHeight=0,dpr=1,stars=[],dust=[],asteroids=[],lastFrame=0,sceneClock=0,scrollDepth=0,pointer={x:.5,y:.5},canvasFrame=0;
const random=(min,max)=>Math.random()*(max-min)+min;
function resizeCosmos(){
  const box=cosmos.getBoundingClientRect();dpr=Math.min(window.devicePixelRatio||1,1.5);canvasWidth=box.width;canvasHeight=box.height;
  cosmos.width=Math.round(canvasWidth*dpr);cosmos.height=Math.round(canvasHeight*dpr);context.setTransform(dpr,0,0,dpr,0,0);
  const mobile=window.matchMedia('(max-width: 760px)').matches;
  stars=Array.from({length:mobile?34:Math.min(100,Math.round(canvasWidth/12))},()=>({x:random(0,canvasWidth),y:random(0,canvasHeight),r:random(.45,1.5),alpha:random(.2,.72),speed:random(.025,.12),phase:random(0,Math.PI*2)}));
  dust=Array.from({length:mobile?8:24},()=>({x:random(0,canvasWidth),y:random(0,canvasHeight),r:random(.35,.95),speed:random(.018,.055),alpha:random(.05,.16)}));
  asteroids=Array.from({length:mobile?2:5},()=>({x:random(0,canvasWidth),y:random(0,canvasHeight),r:random(.7,1.7),speed:random(.035,.13),rotation:random(0,6)}));
}
function outsideEarth(){
  context.beginPath();context.rect(0,0,canvasWidth,canvasHeight);
  context.ellipse(canvasWidth*.5,canvasHeight*.51,canvasWidth*.32,canvasHeight*.56,0,0,Math.PI*2);
  context.clip('evenodd');
}
function drawComet(progress,reverse=false){
  const t=progress*progress*(3-2*progress),length=Math.max(52,canvasWidth*.095);
  const x=reverse?canvasWidth+length-t*(canvasWidth+length*2):-length+t*(canvasWidth+length*2);
  const y=canvasHeight*(reverse?.22:.12)+t*canvasHeight*(reverse?.34:.28);
  const dx=reverse?length:-length,dy=-length*.42;
  const trail=context.createLinearGradient(x,y,x+dx,y+dy);trail.addColorStop(0,'rgba(117,206,255,0)');trail.addColorStop(1,'rgba(208,238,255,.9)');
  context.save();context.globalAlpha=Math.min(1,progress*8,(1-progress)*8);context.strokeStyle=trail;context.lineWidth=2;context.shadowColor='#70d7ff';context.shadowBlur=9;context.beginPath();context.moveTo(x+dx,y+dy);context.lineTo(x,y);context.stroke();context.fillStyle='#fff';context.beginPath();context.arc(x,y,2.1,0,Math.PI*2);context.fill();context.restore();
}
function drawMeteor(progress,index){
  const mobile=canvasWidth<760,fromX=canvasWidth*(.1+((index*37)%79)/100),fromY=canvasHeight*(.06+((index*29)%36)/100);
  const length=canvasWidth*(mobile?.09:.075)*(1+(index%3)*.38),travel=progress*1.35;
  const x=fromX-travel*length*1.65,y=fromY+travel*length;
  context.save();context.globalAlpha=Math.sin(progress*Math.PI)*.78;context.strokeStyle='#cdeaff';context.shadowColor='#74cfff';context.shadowBlur=7;context.lineWidth=index%3===0?1.35:.8;
  const tail=context.createLinearGradient(x,y,x+length*.48,y-length*.48);tail.addColorStop(0,'rgba(180,224,255,0)');tail.addColorStop(1,'rgba(208,235,255,.9)');context.strokeStyle=tail;context.beginPath();context.moveTo(x+length*.48,y-length*.48);context.lineTo(x,y);context.stroke();context.restore();
}
function drawSun(progress){
  const alpha=Math.sin(progress*Math.PI),radius=Math.max(22,Math.min(canvasWidth,canvasHeight)*.085),x=canvasWidth*(1.04-progress*.17),y=canvasHeight*.5;
  context.save();context.globalAlpha=alpha*.78;
  const glow=context.createRadialGradient(x,y,radius*.2,x,y,radius*3.3);glow.addColorStop(0,'rgba(255,225,163,.42)');glow.addColorStop(.28,'rgba(255,178,99,.19)');glow.addColorStop(1,'rgba(255,150,84,0)');context.fillStyle=glow;context.beginPath();context.arc(x,y,radius*3.3,0,Math.PI*2);context.fill();
  const sun=context.createRadialGradient(x-radius*.28,y-radius*.28,1,x,y,radius);sun.addColorStop(0,'#fff3ce');sun.addColorStop(.7,'#ffcf8a');sun.addColorStop(1,'rgba(255,167,101,.9)');context.fillStyle=sun;context.shadowColor='#ffbc78';context.shadowBlur=18;context.beginPath();context.arc(x,y,radius,0,Math.PI*2);context.fill();
  context.globalAlpha=alpha*.12;context.strokeStyle='#ffe0ad';context.lineWidth=1;for(let i=0;i<12;i++){const angle=i*Math.PI/6;context.beginPath();context.moveTo(x+Math.cos(angle)*radius*1.4,y+Math.sin(angle)*radius*1.4);context.lineTo(x+Math.cos(angle)*radius*2.1,y+Math.sin(angle)*radius*2.1);context.stroke()}context.restore();
}
function drawMoon(progress){
  const angle=-.65+progress*1.3,rx=canvasWidth*.42,ry=canvasHeight*.67,x=canvasWidth*.5+Math.cos(angle)*rx,y=canvasHeight*.51+Math.sin(angle)*ry;
  const alpha=Math.sin(progress*Math.PI),radius=Math.max(8,Math.min(canvasWidth,canvasHeight)*.028);
  context.save();context.globalAlpha=alpha*.84;const halo=context.createRadialGradient(x,y,radius*.15,x,y,radius*2.7);halo.addColorStop(0,'rgba(224,237,255,.13)');halo.addColorStop(1,'rgba(190,216,255,0)');context.fillStyle=halo;context.beginPath();context.arc(x,y,radius*2.7,0,Math.PI*2);context.fill();
  const moon=context.createRadialGradient(x-radius*.32,y-radius*.28,1,x,y,radius);moon.addColorStop(0,'#f4f3ed');moon.addColorStop(.63,'#c9cbd0');moon.addColorStop(.88,'#a1a8b5');moon.addColorStop(1,'#657184');context.fillStyle=moon;context.shadowColor='#c6dcff';context.shadowBlur=3;context.beginPath();context.arc(x,y,radius,0,Math.PI*2);context.fill();
  context.shadowBlur=0;context.beginPath();context.arc(x,y,radius*.92,0,Math.PI*2);context.clip();context.globalAlpha=alpha*.17;context.fillStyle='#596579';[[ -.34,-.2,.13],[.29,-.31,.1],[.13,.27,.16],[-.29,.39,.08]].forEach(([cx,cy,size])=>{context.beginPath();context.arc(x+cx*radius,y+cy*radius,size*radius,0,Math.PI*2);context.fill()});context.restore();
}
function drawCosmos(time){
  if(reducedMotion.matches||document.hidden||scrollDepth>=1){canvasFrame=0;return}
  if(time-lastFrame<32){canvasFrame=requestAnimationFrame(drawCosmos);return}
  const delta=lastFrame?Math.min(time-lastFrame,65):32;lastFrame=time;sceneClock+=delta;context.clearRect(0,0,canvasWidth,canvasHeight);
  const travel=scrollDepth,parallax=(pointer.x-.5)*7;
  context.save();outsideEarth();
  for(const star of stars){star.y+=star.speed*(1+travel*4);if(star.y>canvasHeight+2){star.y=-2;star.x=random(0,canvasWidth)}const x=star.x+Math.sin(time*.00012+star.phase)*.08+parallax*(star.r/2);context.globalAlpha=star.alpha*(.72+.28*Math.sin(time*.0007+star.phase));context.fillStyle='#e8f4ff';context.beginPath();context.arc(x,star.y,star.r,0,Math.PI*2);context.fill()}
  for(const mote of dust){mote.y+=mote.speed*(1+travel*2);if(mote.y>canvasHeight){mote.y=-3;mote.x=random(0,canvasWidth)}context.globalAlpha=mote.alpha;context.fillStyle='#73cfff';context.beginPath();context.arc(mote.x+parallax*.5,mote.y,mote.r,0,Math.PI*2);context.fill()}
  for(const rock of asteroids){rock.x-=rock.speed*(1+travel);rock.y+=Math.sin(time*.0003+rock.rotation)*.08;if(rock.x<-8){rock.x=canvasWidth+8;rock.y=random(0,canvasHeight)}context.globalAlpha=.35;context.fillStyle='#b9c4d4';context.save();context.translate(rock.x+parallax,rock.y);context.rotate(rock.rotation+time*.00008);context.fillRect(-rock.r,-rock.r,rock.r*1.8,rock.r*1.4);context.restore()}
  const cycle=sceneClock%32000;
  if(cycle>=4000&&cycle<9000){const second=cycle>=6500,start=second?6500:4000,end=second?9000:6250;drawComet((cycle-start)/(end-start),second)}
  if(cycle>=9000&&cycle<15000){const elapsed=cycle-9000;for(let i=0;i<8;i++){const start=i*680,duration=640+(i%3)*160;if(elapsed>=start&&elapsed<start+duration)drawMeteor((elapsed-start)/duration,i)}}
  if(cycle>=15000&&cycle<21000)drawSun((cycle-15000)/6000);
  if(cycle>=21000&&cycle<28000)drawMoon((cycle-21000)/7000);
  context.restore();context.globalAlpha=1;
  const amount=Math.min(sceneClock/1000,1),offsetX=(pointer.x-.5)*-13,offsetY=(pointer.y-.5)*-9-travel*32+Math.sin(sceneClock*.00055)*1.8;
  heroImage.style.transform=`translate3d(${offsetX}px,${offsetY}px,0) scale(${1.035-travel*.15}) rotate(${Math.sin(sceneClock*.00013)*.12}deg)`;
  heroImage.style.opacity=String(Math.max(.18,1-travel*.94));heroImage.style.filter=`blur(${travel*2.4}px) saturate(${1+travel*.4})`;
  canvasFrame=scrollDepth<1?requestAnimationFrame(drawCosmos):0;
}
function updateJourneyMotion(){
  scrollDepth=Math.min(window.scrollY/Math.max(hero.offsetHeight,1),1);
  document.documentElement.style.setProperty('--space-travel',scrollDepth.toFixed(3));
}
resizeCosmos();updateJourneyMotion();updateJourneyProgress();window.addEventListener('resize',()=>{resizeCosmos();updateJourneyProgress()},{passive:true});window.addEventListener('scroll',()=>{updateJourneyMotion();updateJourneyProgress();if(scrollDepth<1&&!reducedMotion.matches&&!document.hidden&&!canvasFrame){lastFrame=0;canvasFrame=requestAnimationFrame(drawCosmos)}},{passive:true});
if(matchMedia('(pointer:fine)').matches&&!reducedMotion.matches){hero.addEventListener('pointermove',event=>{const rect=hero.getBoundingClientRect();pointer={x:(event.clientX-rect.left)/rect.width,y:(event.clientY-rect.top)/rect.height}});hero.addEventListener('pointerleave',()=>{pointer={x:.5,y:.5}})}
if(!reducedMotion.matches)canvasFrame=requestAnimationFrame(drawCosmos);
reducedMotion.addEventListener?.('change',()=>{cancelAnimationFrame(canvasFrame);lastFrame=0;if(reducedMotion.matches)context.clearRect(0,0,canvasWidth,canvasHeight);else canvasFrame=requestAnimationFrame(drawCosmos)});
document.addEventListener('visibilitychange',()=>{cancelAnimationFrame(canvasFrame);lastFrame=0;if(!document.hidden&&!reducedMotion.matches)canvasFrame=requestAnimationFrame(drawCosmos)});
