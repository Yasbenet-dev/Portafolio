(function(){
var N=7,GAP=40,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var cv=document.getElementById('c');
var R=new THREE.WebGLRenderer({canvas:cv,antialias:true,alpha:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
var S=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,1,.1,400);
var sw=0,sh=0;function size(){sw=Math.max(1,innerWidth);sh=Math.max(1,innerHeight);R.setSize(sw,sh,false);cam.aspect=sw/sh;cam.updateProjectionMatrix()}
addEventListener('resize',size);size();
function isWide(){return cam.aspect>1&&innerWidth>=820}
function lay(){var W=innerWidth,H=innerHeight,gw=Math.min(W,1200),col=gw/2-W*.02,hw=Math.tan(.5236)*16*cam.aspect;return{X:(gw/4)/(W/2)*hw,K:Math.max(.5,Math.min(1.3,col*.85/(12*.62*H/18.5))),mobK:Math.max(.35,Math.min(.65,W/700)),mobY:Math.min(6, 4.5+Math.max(0,(800-W)*.003))}}
var acc=new THREE.Color(getComputedStyle(document.documentElement).getPropertyValue('--acc').trim()||'#818cf8');
function wm(o){return new THREE.MeshBasicMaterial({color:acc,wireframe:true,transparent:true,opacity:o||.55})}
function solid(o){return new THREE.MeshBasicMaterial({color:acc,transparent:true,opacity:o||.9})}
// estrellas: titilan en reposo y se alargan al viajar (salto a la velocidad de la luz)
var warp=0,SC_=3200,sp=new Float32Array(SC_*3),sph=new Float32Array(SC_),ssz=new Float32Array(SC_),lp2=new Float32Array(SC_*6),le=new Float32Array(SC_*2);
for(var i=0;i<SC_;i++){var sx,sy;do{sx=(Math.random()-.5)*110;sy=(Math.random()-.5)*70}while(sx*sx+sy*sy<16);
 var sz=20-Math.random()*(N*GAP+70);sp.set([sx,sy,sz],i*3);sph[i]=Math.random();ssz[i]=.5+Math.pow(Math.random(),3)*2.4;
 lp2.set([sx,sy,sz,sx,sy,sz],i*6);le[i*2]=0;le[i*2+1]=1}
var SU={uT:{value:0},uLen:{value:0},uA:{value:0},uCol:{value:acc}};
var pg0=new THREE.BufferGeometry();pg0.setAttribute('position',new THREE.BufferAttribute(sp,3));pg0.setAttribute('aPh',new THREE.BufferAttribute(sph,1));pg0.setAttribute('aSz',new THREE.BufferAttribute(ssz,1));
S.add(new THREE.Points(pg0,new THREE.ShaderMaterial({uniforms:SU,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
 vertexShader:'uniform float uT;attribute float aPh;attribute float aSz;varying float vTw;void main(){vec4 mv=modelViewMatrix*vec4(position,1.);vTw=.45+.55*sin(uT*(1.5+aPh*2.)+aPh*40.);gl_PointSize=clamp(aSz*(260./-mv.z),1.,9.)*(.7+.3*vTw);gl_Position=projectionMatrix*mv;}',
 fragmentShader:'uniform vec3 uCol;varying float vTw;void main(){float d=length(gl_PointCoord-.5);float a=smoothstep(.5,.0,d)*(.25+.75*vTw);gl_FragColor=vec4(mix(vec3(1.),uCol,.45),a);}'})));
var lg=new THREE.BufferGeometry();lg.setAttribute('position',new THREE.BufferAttribute(lp2,3));lg.setAttribute('aEnd',new THREE.BufferAttribute(le,1));
var streak=new THREE.LineSegments(lg,new THREE.ShaderMaterial({uniforms:SU,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,
 vertexShader:'uniform float uLen;attribute float aEnd;varying float vE;void main(){vE=aEnd;vec3 p=position;p.z+=aEnd*uLen;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}',
 fragmentShader:'uniform float uA;uniform vec3 uCol;varying float vE;void main(){gl_FragColor=vec4(mix(vec3(1.),uCol,.35),uA*(1.-vE)*.9);}'}));
streak.frustumCulled=false;S.add(streak);
// estaciones
var st=[],anim=[];
function station(i,x,y,z){var g=new THREE.Group();g.position.set(x,y||0,-i*GAP-(z||16));S.add(g);st.push(g);return g}
var s0=station(0,6),h=new THREE.Mesh(new THREE.IcosahedronGeometry(4,1),wm());s0.add(h);
var h2=new THREE.Mesh(new THREE.IcosahedronGeometry(2,0),solid(.35));s0.add(h2);anim.push(function(t){h.rotation.y=t*.2;h.rotation.x=t*.1;h2.rotation.y=-t*.4});
// ETL / pipeline
function lab(txt){var c=document.createElement('canvas');c.width=512;c.height=96;var x=c.getContext('2d');x.fillStyle='#'+acc.getHexString();x.font='700 44px monospace';x.textAlign='center';x.fillText(txt,256,62);return new THREE.Mesh(new THREE.PlaneGeometry(4,.75),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,side:THREE.DoubleSide}))}
var s1=station(1,-6),pg=new THREE.Group();s1.add(pg);
for(var q=0;q<3;q++){var dk=new THREE.Mesh(new THREE.CylinderGeometry(1.2,1.2,.5,24,1),wm(.65));dk.position.set(-5.5,(q-1)*.75,0);pg.add(dk)}
var tf=new THREE.Mesh(new THREE.BoxGeometry(2.4,2.4,2.4),wm(.7)),tc=new THREE.Mesh(new THREE.OctahedronGeometry(.8),solid(.6));pg.add(tf);pg.add(tc);
var lb=[];for(var q=0;q<4;q++){var bm=new THREE.Mesh(new THREE.BoxGeometry(.7,1,.7),solid(.75));bm.position.x=4.2+q*.85;pg.add(bm);lb.push(bm)}
var lp=[];[-.55,0,.55].forEach(function(y){lp.push(new THREE.Vector3(-4.2,y,0),new THREE.Vector3(-1.4,y,0),new THREE.Vector3(1.4,y,0),new THREE.Vector3(3.8,y,0))});
pg.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lp),new THREE.LineBasicMaterial({color:acc,transparent:true,opacity:.5})));
[['EXTRACT',-5.5],['TRANSFORM',0],['LOAD',5.5]].forEach(function(d){var l=lab(d[0]);l.position.set(d[1],-2.3,0);pg.add(l)});
var PK=[],mc=new THREE.Color('#e2a15f');
for(var q=0;q<18;q++){var pm=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshBasicMaterial({color:mc.clone()}));pg.add(pm);PK.push(pm)}
var ft=[];[['python','#4b8bbe','Python',-4.4],['SP','#2aa0e8','SharePoint',-1.5],['PA','#5b9dff','Automate',1.4],['pbi','#f2c811','Power BI',4.3]].forEach(function(d){var m=tile(d[0],d[1],d[2]);m.scale.setScalar(.9);m.position.set(d[3],3.7,0);m.userData={by:3.7};pg.add(m);ft.push(m)});
anim.push(function(t){
 var wide=isWide(),L=lay();s1.position.x=wide?-L.X:0;s1.position.y=0;pg.scale.setScalar(wide?L.K:L.mobK*0.65);s1.rotation.y=Math.sin(t*.3)*.15;
 PK.forEach(function(m,q){var u=(t*.18+q/PK.length)%1,x=-4.2+u*8,k=Math.min(1,Math.max(0,(x+1.4)/2.8)),ch=1-k,lane=((q%3)-1)*.55;
  m.position.set(x,lane+Math.sin(t*3+q*2.1)*.9*ch,Math.sin(t*2+q)*.8*ch);m.rotation.set((t*2+q)*ch,(t*1.7+q)*ch,0);
  m.scale.setScalar((.2+((q*7)%5)*.07)*ch+.3*k);m.material.color.copy(mc).lerp(acc,k)});
 tf.rotation.x=t*.5;tf.rotation.y=t*.7;tc.rotation.y=-t*1.2;tc.scale.setScalar(1+.2*Math.sin(t*4));
 lb.forEach(function(m,j){var hh=1+(j+1)*.7+.4*Math.sin(t*1.5+j);m.scale.y=hh;m.position.y=hh/2-1.2});
 ft.forEach(function(m,j){m.position.y=m.userData.by+Math.sin(t*1.2+j)*.25;m.rotation.y=Math.sin(t*.6+j)*.3})});
// Agente IA: Web -> n8n -> IA local -> Supabase -> respuesta
var s2=station(2,6),ag=new THREE.Group();s2.add(ag);
var NP={W:[-6,0],N:[-2,0],I:[2,2.2],D:[2,-2.2],R:[6,0]},NV={},nd2={};
Object.keys(NP).forEach(function(k){NV[k]=new THREE.Vector3(NP[k][0],NP[k][1],.2)});
[['W','web','#38bdf8','Web'],['N','n8n','#ea4b71','n8n'],['I','Ol','#e8eaf6','Ollama'],['D','Sb','#3ecf8e','Supabase'],['R','ok','#3ecf8e','Confirmación']].forEach(function(d){var m=tile(d[1],d[2],d[3]);m.position.copy(NV[d[0]]);m.scale.setScalar(.95);ag.add(m);nd2[d[0]]=m});
var ep=[];[['W','N'],['N','I'],['N','D'],['N','R']].forEach(function(e){ep.push(new THREE.Vector3(NP[e[0]][0],NP[e[0]][1],-.05),new THREE.Vector3(NP[e[1]][0],NP[e[1]][1],-.05))});
ag.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ep),new THREE.LineBasicMaterial({color:acc,transparent:true,opacity:.55})));
var hex=new THREE.Mesh(new THREE.TorusGeometry(1.75,.04,6,6),solid(.7));hex.position.set(-2,0,0);ag.add(hex);
var shell=new THREE.Mesh(new THREE.IcosahedronGeometry(1.9,1),wm(.45));shell.position.set(2,2.2,0);ag.add(shell);
var dbr=new THREE.Mesh(new THREE.TorusGeometry(1.75,.03,8,48),solid(.5));dbr.position.set(2,-2.2,0);dbr.rotation.x=1.2;ag.add(dbr);
[['CLIENTE',-6,-2.2],['ORQUESTA',-2,-2.2],['IA LOCAL',2,4.7],['AGENDA',2,-4.8],['RESPUESTA',6,-2.2]].forEach(function(d){var l=lab(d[0]);l.position.set(d[1],d[2],0);ag.add(l)});
var path=['W','N','I','N','D','N','R'].map(function(k){return NV[k]}),pls=[];
for(var q=0;q<3;q++){var pm=new THREE.Mesh(new THREE.SphereGeometry(.2,12,12),new THREE.MeshBasicMaterial({color:0xffffff}));ag.add(pm);pls.push(pm)}
anim.push(function(t){
 var wide=isWide(),L=lay();s2.position.x=wide?L.X:0;s2.position.y=0;ag.scale.setScalar(wide?L.K:L.mobK*0.65);s2.rotation.y=-Math.sin(t*.3)*.15;
 pls.forEach(function(pm,q){var u=((t*.12+q/3)%1)*6,a=Math.floor(u);pm.position.lerpVectors(path[a],path[a+1],u-a)});
 Object.keys(nd2).forEach(function(k){var m=nd2[k],tg=.95;pls.forEach(function(pm){var d=pm.position.distanceTo(NV[k]);if(d<1.6)tg=Math.max(tg,.95+.25*(1-d/1.6))});m.scale.setScalar(m.scale.x+(tg-m.scale.x)*.15)});
 hex.rotation.z=t*.6;shell.rotation.y=t*.5;shell.rotation.x=t*.3;dbr.rotation.z=t*.5});
// La Metalera: plataforma de gestion (analiticas + tiempo)
var s3=station(3,-6),dg=new THREE.Group();s3.add(dg);
dg.add(new THREE.Mesh(new THREE.BoxGeometry(8.4,4.6,.12),wm(.5)));
var fp=new THREE.Mesh(new THREE.PlaneGeometry(8.4,4.6),new THREE.MeshBasicMaterial({color:0x0e0f1c,transparent:true,opacity:.55}));fp.position.z=-.07;dg.add(fp);
var bars=[];for(var j=0;j<7;j++){var bm=new THREE.Mesh(new THREE.BoxGeometry(.6,1,.3),solid(.8));bm.position.x=-3+j;dg.add(bm);bars.push(bm)}
var ax=[new THREE.Vector3(-3.6,-1.95,0),new THREE.Vector3(3.6,-1.95,0),new THREE.Vector3(-1.2,.05,0),new THREE.Vector3(3.6,.05,0)];
dg.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(ax),new THREE.LineBasicMaterial({color:acc,transparent:true,opacity:.5})));
var clk=new THREE.Mesh(new THREE.TorusGeometry(.85,.04,8,48),solid(.8));clk.position.set(-2.9,1.1,0);dg.add(clk);
function hand(len,w){var g=new THREE.Group(),m=new THREE.Mesh(new THREE.BoxGeometry(w,len,.05),solid(1));m.position.y=len/2;g.add(m);g.position.copy(clk.position);dg.add(g);return g}
var gMin=hand(.7,.05),gHr=hand(.45,.07);
var NL=28,lpt=[];for(var j=0;j<NL;j++)lpt.push(new THREE.Vector3(-1.2+j*(4.8/(NL-1)),.65+.7*(.5+.5*Math.sin(j*.5))+.3*Math.sin(j*1.7),0));
var ln=new THREE.Line(new THREE.BufferGeometry().setFromPoints(lpt),new THREE.LineBasicMaterial({color:acc}));dg.add(ln);
var ldot=new THREE.Mesh(new THREE.SphereGeometry(.13,12,12),new THREE.MeshBasicMaterial({color:0xffffff}));dg.add(ldot);
[['HORAS TRABAJADAS',1.2,1.95],['ASISTENCIA POR DIA',0,-2.65]].forEach(function(d){var l=lab(d[0]);l.scale.setScalar(.55);l.position.set(d[1],d[2],.1);dg.add(l)});
var ft3=[];[['react','#61dafb','React',-3.9],['Vi','#38bdf8','Vite',-1.3],['vercel','#e8eaf6','Vercel',1.3],['Pg','#4f8ac9','PostgreSQL',3.9]].forEach(function(d){var m=tile(d[0],d[1],d[2]);m.scale.setScalar(.9);m.position.set(d[3],3.9,0);m.userData={by:3.9};dg.add(m);ft3.push(m)});
anim.push(function(t){
 var wide=isWide(),L=lay();s3.position.x=wide?-L.X:0;s3.position.y=0;dg.scale.setScalar(wide?Math.min(1.5,L.K*1.35):L.mobK*0.55);dg.rotation.y=Math.sin(t*.3)*.18;
 bars.forEach(function(m,j){var hh=.5+1*(.5+.5*Math.sin(t*.9+j*.8));m.scale.y=hh;m.position.y=hh/2-1.9});
 var c=Math.floor(((t*.25)%1)*NL)+2;ln.geometry.setDrawRange(0,Math.min(NL,c));ldot.position.copy(lpt[Math.min(NL,c)-1]);
 gMin.rotation.z=-t*1.5;gHr.rotation.z=-t*.125;
 ft3.forEach(function(m,j){m.position.y=m.userData.by+Math.sin(t*1.2+j)*.25;m.rotation.y=Math.sin(t*.6+j)*.3})});
// skills
var s4=station(4,0,0,18),rings=[];
for(var r=0;r<3;r++){var rg=new THREE.Mesh(new THREE.TorusGeometry(4+r*1.8,.04,8,100),solid(.7));rg.rotation.x=Math.PI/2+r*.5;s4.add(rg);var sp=new THREE.Mesh(new THREE.SphereGeometry(.3,12,12),solid(1));rg.add(sp);rings.push({rg:rg,sp:sp,r:4+r*1.8,sp_:1+r*.4})}
anim.push(function(t){rings.forEach(function(o,j){o.sp.position.set(Math.cos(t*o.sp_)*o.r,Math.sin(t*o.sp_)*o.r,0);o.rg.rotation.z=t*.1*(j+1)})});
// about
var s5=station(5,-6),oc=new THREE.Mesh(new THREE.OctahedronGeometry(3.5),wm());s5.add(oc);
anim.push(function(t){var w=isWide(),L=lay();s5.position.x=w?-L.X:0;s5.position.y=0;oc.scale.setScalar(w?1:L.mobK*0.75);oc.rotation.y=t*.3;oc.rotation.z=t*.15});
// contacto
var s6=station(6,0,0,22),ring=new THREE.Mesh(new THREE.TorusGeometry(7,.08,12,120),solid(.8));s6.add(ring);
var ring2=new THREE.Mesh(new THREE.TorusGeometry(5,.05,12,120),solid(.5));s6.add(ring2);
anim.push(function(t){ring.rotation.z=t*.3;ring2.rotation.z=-t*.4;ring2.rotation.x=Math.sin(t*.5)*.4});
// iconos 3D
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function tile(l,col,nm){var c=document.createElement('canvas');c.width=c.height=256;var x=c.getContext('2d');
 x.fillStyle='rgba(14,15,28,.92)';rr(x,8,8,240,240,44);x.fill();x.strokeStyle=col;x.lineWidth=4;x.stroke();x.fillStyle=col;x.textAlign='center';
 if(l==='react'){x.lineWidth=5;for(var i=0;i<3;i++){x.save();x.translate(128,100);x.rotate(i*Math.PI/3);x.beginPath();x.ellipse(0,0,58,22,0,0,6.3);x.stroke();x.restore()}x.beginPath();x.arc(128,100,8,0,6.3);x.fill()}
 else if(l==='vercel'){x.beginPath();x.moveTo(128,56);x.lineTo(182,146);x.lineTo(74,146);x.closePath();x.fill()}
 else if(l==='python'){x.fillStyle='#4b8bbe';rr(x,70,44,78,60,26);x.fill();rr(x,70,80,40,62,16);x.fill();x.fillStyle='#ffd43b';rr(x,108,112,78,60,26);x.fill();rr(x,146,74,40,62,16);x.fill();x.fillStyle='#e8eaf6';x.beginPath();x.arc(94,64,6,0,6.3);x.fill();x.beginPath();x.arc(162,152,6,0,6.3);x.fill()}
 else if(l==='pbi'){[[84,100,50,1],[116,76,74,.8],[148,52,98,.6]].forEach(function(q){x.globalAlpha=q[3];rr(x,q[0],q[1],24,q[2],8);x.fill()});x.globalAlpha=1}
 else if(l==='web'){x.lineWidth=7;rr(x,52,52,152,112,14);x.stroke();x.beginPath();x.moveTo(52,82);x.lineTo(204,82);x.stroke();[72,90,108].forEach(function(c){x.beginPath();x.arc(c,67,5,0,6.3);x.fill()});x.fillRect(74,102,60,8);x.fillRect(74,122,100,8)}
 else if(l==='ok'){x.lineWidth=9;x.beginPath();x.arc(128,104,50,0,6.3);x.stroke();x.beginPath();x.moveTo(104,106);x.lineTo(123,126);x.lineTo(154,84);x.stroke()}
 else if(l==='git'){x.save();x.translate(128,100);x.rotate(Math.PI/4);rr(x,-46,-46,92,92,12);x.fill();x.restore();x.strokeStyle='#0e0f1c';x.fillStyle='#0e0f1c';x.lineWidth=7;x.beginPath();x.moveTo(112,78);x.lineTo(112,126);x.moveTo(112,92);x.lineTo(146,106);x.stroke();[[112,78],[112,126],[146,106]].forEach(function(q){x.beginPath();x.arc(q[0],q[1],9,0,6.3);x.fill()})}
 else if(l==='github'){x.beginPath();x.arc(128,106,46,0,6.3);x.fill();x.beginPath();x.moveTo(88,84);x.lineTo(90,50);x.lineTo(118,66);x.fill();x.beginPath();x.moveTo(168,84);x.lineTo(166,50);x.lineTo(138,66);x.fill();x.fillStyle='#0e0f1c';x.beginPath();x.arc(112,104,6,0,6.3);x.arc(144,104,6,0,6.3);x.fill();x.beginPath();x.arc(128,122,10,0.2,2.9);x.lineWidth=4;x.strokeStyle='#0e0f1c';x.stroke()}
 else if(l==='docker'){[[60,108],[87,108],[114,108],[141,108],[87,81],[114,81],[141,81],[114,54]].forEach(function(q){x.fillRect(q[0],q[1],24,22)});x.beginPath();x.moveTo(44,134);x.lineTo(214,134);x.bezierCurveTo(212,168,172,192,122,192);x.bezierCurveTo(78,192,50,170,44,134);x.fill()}
 else if(l==='skills'){x.beginPath();x.moveTo(128,48);x.quadraticCurveTo(128,100,180,100);x.quadraticCurveTo(128,100,128,152);x.quadraticCurveTo(128,100,76,100);x.quadraticCurveTo(128,100,128,48);x.fill();x.beginPath();x.moveTo(182,52);x.quadraticCurveTo(182,68,198,68);x.quadraticCurveTo(182,68,182,84);x.quadraticCurveTo(182,68,166,68);x.quadraticCurveTo(182,68,182,52);x.fill()}
 else{x.font='700 '+(l.length>2?64:84)+'px monospace';x.fillText(l,128,136)}
 x.fillStyle=col;x.font='600 22px monospace';x.fillText(nm,128,214);
 return new THREE.Mesh(new THREE.PlaneGeometry(2.4,2.4),new THREE.MeshBasicMaterial({map:new THREE.CanvasTexture(c),transparent:true,side:THREE.DoubleSide}))}
var TL=[['python','#4b8bbe','Python'],['SQL','#f29111','SQL'],['n8n','#ea4b71','n8n'],['pbi','#f2c811','Power BI'],['Ol','#e8eaf6','Ollama'],['react','#61dafb','React'],['Sb','#3ecf8e','Supabase'],['vercel','#e8eaf6','Vercel'],['git','#f05032','Git'],['github','#e8eaf6','GitHub'],['PA','#5b9dff','Automate'],['SP','#2aa0e8','SharePoint'],['Vi','#38bdf8','Vite'],['AG','#8ab4f8','Antigravity'],['docker','#2496ed','Docker'],['>_','#e8eaf6','CMD'],['MCP','#e2a15f','MCP'],['skills','#c084fc','Agent Skills']];
var g4=new THREE.Group();s4.add(g4);var ot=[];
TL.forEach(function(d,i){var m=tile(d[0],d[1],d[2]),a=i/TL.length*6.283;m.position.set(Math.cos(a)*9,Math.sin(a*2)*1.5,Math.sin(a)*9);g4.add(m);ot.push(m)});
anim.push(function(t){g4.rotation.y=t*.25;ot.forEach(function(m){m.rotation.y=-g4.rotation.y})});
// hero: sistema orbital interactivo
var HN=['python','SQL','n8n','pbi','Ol','react','Sb','vercel','git','github','docker','MCP','skills','AG','PA','SP'],HL=HN.map(function(n){return TL.filter(function(d){return d[0]===n})[0]});
var orb=[],hX=0,hY=0,hg=new THREE.Group(),hw=new THREE.Vector3(),hq=new THREE.Quaternion(),ti=0;
s0.add(hg);
[[0,0,0,5.4,.35,5],[1.15,.4,0,6.8,-.28,5],[-.9,0,.9,8.2,.22,6]].forEach(function(c,ri){
 var g=new THREE.Group();g.rotation.set(c[0],c[1],c[2]);hg.add(g);
 g.add(new THREE.Mesh(new THREE.TorusGeometry(c[3],.035,8,160),solid(.4)));
 var cnt=c[5];for(var j=0;j<cnt;j++){var d=HL[ti++],m=tile(d[0],d[1],d[2]);m.scale.setScalar(.95);
  m.userData={g:g,a:j/cnt*6.283+ri,r:c[3],sp:c[4],o:0,s:.95};g.add(m);orb.push(m)}});
anim.push(function(t){
 var wide=isWide(),L=lay();s0.position.x=wide?L.X:0;s0.position.y=wide?0:-4.2;hg.scale.setScalar(wide?Math.min(1.1,L.K):L.mobK*1.2);
 hX+=((mx*1.6)-hX)*.06;hY+=((my*.9+.25)-hY)*.06;hg.rotation.y=hX+t*.12;hg.rotation.x=hY;
 var mxN=mx*2,myN=-my*2,mh=0;
 orb.forEach(function(m){var u=m.userData,ang=u.a+t*u.sp;
  m.getWorldPosition(hw);hw.project(cam);
  var dx=(hw.x-mxN)*cam.aspect,dy=hw.y-myN,hov=Math.max(0,1-Math.sqrt(dx*dx+dy*dy)/.28);if(!isFinite(hov))hov=0;mh=Math.max(mh,hov);
  u.o+=(hov*2.2-u.o)*.12;u.s+=(.95+hov*.7-u.s)*.12;
  m.position.set(Math.cos(ang)*(u.r+u.o),Math.sin(ang)*(u.r+u.o),0);m.scale.setScalar(u.s);
  u.g.getWorldQuaternion(hq).invert();m.quaternion.copy(hq.multiply(cam.quaternion))});
 h.scale.setScalar(h.scale.x+(.8+mh*.15-h.scale.x)*.1);h2.scale.setScalar(1+mh*.6)});
// UI
var panels=[].slice.call(document.querySelectorAll('.panel')),cards=panels.map(function(p){return p.querySelector('.card')});
var dots=document.getElementById('dots');
panels.forEach(function(p,i){var d=document.createElement('i');d.onclick=function(){p.scrollIntoView({behavior:'smooth'})};dots.appendChild(d)});
var dl=dots.children,hint=document.getElementById('hint');
var mx=0,my=0,p=0,pt=0,last=0;
var gl=document.getElementById('glow'),bar=document.getElementById('bar'),ro=document.getElementById('ro'),NM=['INICIO','AFTER SALES','AGENTE IA','LA METALERA','SKILLS','SOBRE MÍ','CONTACTO'];
addEventListener('pointermove',function(e){gl.style.left=e.clientX+'px';gl.style.top=e.clientY+'px';mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5});
var clock=new THREE.Clock();
function frame(){
 if(innerWidth!==sw||innerHeight!==sh)size();
 var t=clock.getElapsedTime(),max=document.documentElement.scrollHeight-innerHeight;
 pt=max>0?scrollY/max:0;var k=reduce?1:.07;p+=(pt-p)*k;var vel=(pt-p);
 var pos=p*(N-1)*GAP;
 var wt=reduce?0:Math.min(1,Math.abs(vel)*22);warp+=(wt-warp)*.2;SU.uT.value=t;SU.uA.value=warp;SU.uLen.value=-Math.sign(vel)*warp*45;cam.fov=60+warp*22;cam.updateProjectionMatrix();
 cam.position.z=-pos;
 cam.position.x+=(mx*3-cam.position.x)*.05;cam.position.y+=(-my*2-cam.position.y)*.05;
 cam.rotation.z+=(vel*14-cam.rotation.z)*.1;cam.rotation.y=-mx*.12;cam.rotation.x=my*.08;
 st.forEach(function(g){var d=Math.abs(g.position.z+pos),s=Math.max(.05,1-d/42);g.scale.setScalar(s)});
 anim.forEach(function(f){f(t)});
 var vh=innerHeight,best=0,bd=1e9;
 panels.forEach(function(pn,i){var r=pn.getBoundingClientRect(),c=r.top+r.height/2-vh/2,o=Math.max(0,1-Math.abs(c)/(vh*.62));
  cards[i].style.opacity=o;cards[i].style.transform='translateY('+(c*.12)+'px) scale('+(.94+.06*o)+')';
  if(Math.abs(c)<bd){bd=Math.abs(c);best=i}});
 for(var j=0;j<dl.length;j++)dl[j].className=j===best?'on':'';
 bar.style.width=(p*100)+'%';ro.textContent='0'+best+' / 06 — '+NM[best];hint.style.opacity=scrollY>80?0:1;
 R.render(S,cam);requestAnimationFrame(frame)}
frame();
})();