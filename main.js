/* main.js — interactions: particles, wallet tilt, modal, form (no backend) */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let W = canvas.width = innerWidth;
let H = canvas.height = innerHeight;
window.addEventListener('resize', ()=>{ W=canvas.width=innerWidth; H=canvas.height=innerHeight; init(); });

let particles = [];
let NUM = Math.round(Math.min(180, Math.max(40, (W*H)/60000)));

function init(){
  particles = [];
  NUM = Math.round(Math.min(180, Math.max(40, (W*H)/60000)));
  for(let i=0;i<NUM;i++){
    particles.push({
      x: Math.random()*W,
      y: Math.random()*H,
      r: Math.random()*2.2+0.6,
      vx: (Math.random()-0.5)*0.6,
      vy: (Math.random()-0.5)*0.6,
      a: 0.2 + Math.random()*0.6
    });
  }
}
init();

let mouse = {x: W/2, y: H/2};
window.addEventListener('mousemove', (e)=>{ mouse.x=e.clientX; mouse.y=e.clientY; });
window.addEventListener('touchmove', (e)=>{ mouse.x=e.touches[0].clientX; mouse.y=e.touches[0].clientY; }, {passive:true});

function draw(){
  ctx.clearRect(0,0,W,H);
  // vignette
  const grad = ctx.createRadialGradient(W/2,H/2,Math.min(W,H)/6, W/2,H/2,Math.max(W,H));
  grad.addColorStop(0,'rgba(0,0,0,0)');
  grad.addColorStop(1,'rgba(0,0,0,0.35)');
  ctx.fillStyle = grad; ctx.fillRect(0,0,W,H);

  for(let p of particles){
    const dx = p.x - mouse.x, dy = p.y - mouse.y;
    const d = Math.sqrt(dx*dx+dy*dy) || 1;
    if(d < 140){
      const f = (140 - d)/140;
      p.vx += (dx/d)*0.01*f;
      p.vy += (dy/d)*0.01*f;
    }
    p.vx *= 0.995; p.vy *= 0.995;
    p.x += p.vx; p.y += p.vy;
    if(p.x < -10) p.x = W+10;
    if(p.x > W+10) p.x = -10;
    if(p.y < -10) p.y = H+10;
    if(p.y > H+10) p.y = -10;

    ctx.beginPath();
    ctx.fillStyle = 'rgba(0,170,255,'+p.a+')';
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
  }

  // sparse linking
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const a=particles[i], b=particles[j];
      const dx=a.x-b.x, dy=a.y-b.y, dist=dx*dx+dy*dy;
      if(dist < 9000){
        ctx.strokeStyle = 'rgba(0,160,255,'+(0.12 - dist/9000*0.11)+')';
        ctx.lineWidth = 0.6; ctx.beginPath(); ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}
draw();

/* Wallet tilt */
const wrap = document.getElementById('walletWrap');
const wallet = document.getElementById('wallet');
wrap.addEventListener('mousemove', (e)=>{
  const r = wrap.getBoundingClientRect();
  const cx = r.left + r.width/2, cy = r.top + r.height/2;
  const dx = e.clientX - cx, dy = e.clientY - cy;
  const ry = (dx / r.width) * 30;
  const rx = - (dy / r.height) * 20 + 6;
  wallet.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
});
wrap.addEventListener('mouseleave', ()=>{ wallet.style.transform = 'rotateX(5deg) rotateY(0deg) scale(1)'; });

/* Modal behavior */
const orderBtn = document.getElementById('orderBtn');
const modal = document.getElementById('modal');
const closeModal = document.getElementById('closeModal');
const sendOrder = document.getElementById('sendOrder');
const nameInput = document.getElementById('name');
const phoneInput = document.getElementById('phone');
const noteInput = document.getElementById('note');

orderBtn.addEventListener('click', ()=>{ modal.style.display='flex'; modal.setAttribute('aria-hidden','false'); });
closeModal.addEventListener('click', ()=>{ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); });
modal.addEventListener('click',(e)=>{ if(e.target===modal) { modal.style.display='none'; modal.setAttribute('aria-hidden','true'); }});
sendOrder.addEventListener('click', ()=>{
  sendOrder.textContent = 'Отправлено ✓';
  setTimeout(()=>{ sendOrder.textContent='Отправить заявку'; modal.style.display='none'; modal.setAttribute('aria-hidden','true'); nameInput.value=''; phoneInput.value=''; noteInput.value=''; }, 1200);
  console.log('Demo order:', {name:nameInput.value, phone:phoneInput.value, note:noteInput.value});
});

/* Accessibility: Esc closes modal */
window.addEventListener('keydown', e=>{ if(e.key==='Escape'){ modal.style.display='none'; modal.setAttribute('aria-hidden','true'); }});
