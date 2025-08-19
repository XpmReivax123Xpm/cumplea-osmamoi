// ===============================
// Modal con video
// ===============================
const btnSorpresa = document.getElementById('btnSorpresa');
const overlay = document.getElementById('overlay');
const cerrarModal = document.getElementById('cerrarModal');
const videoEl = document.getElementById('videoSorpresa');

if (btnSorpresa && overlay) {
  btnSorpresa.addEventListener('click', () => {
    // Pausa la música de fondo si está sonando (ver sección música más abajo)
    if (window.bg && !window.bg.paused) {
      window.bg.pause();
      window.bg.currentTime = 0; // opcional: reiniciar
    }

    overlay.classList.add('abierto');
    if (videoEl) videoEl.play?.();
  });
}

if (cerrarModal && overlay) {
  cerrarModal.addEventListener('click', () => {
    overlay.classList.remove('abierto');
    if (videoEl) { videoEl.pause?.(); videoEl.currentTime = 0; }
  });
}

// cerrar con click afuera
if (overlay) {
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('abierto');
      if (videoEl) { videoEl.pause?.(); videoEl.currentTime = 0; }
    }
  });
}

// cerrar con ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay?.classList.contains('abierto')) {
    overlay.classList.remove('abierto');
    if (videoEl) { videoEl.pause?.(); videoEl.currentTime = 0; }
  }
});


// ===============================
// Pétalos de cerezo (sakura)
// ===============================
function crearPetalo() {
  const petalo = document.createElement("div");
  petalo.textContent = "🌸";
  petalo.style.position = "fixed";
  petalo.style.left = Math.random() * 100 + "vw";
  petalo.style.bottom = "-20px";
  petalo.style.fontSize = (Math.random() * 16 + 18) + "px";
  petalo.style.opacity = 0.9;
  petalo.style.filter = "drop-shadow(0 4px 8px rgba(0,0,0,.25))";
  petalo.style.animation = `sakura ${7 + Math.random()*3}s linear forwards`;
  petalo.style.pointerEvents = "none";
  document.body.appendChild(petalo);

  setTimeout(() => petalo.remove(), 11000);
}
setInterval(crearPetalo, 600);


// ===============================
// Estrellas de fondo
// ===============================
const starCanvas = document.getElementById('stars');
const stx = starCanvas?.getContext('2d');

function resizeStars(){
  if (!starCanvas) return;
  starCanvas.width = innerWidth;
  starCanvas.height = innerHeight;
}
addEventListener('resize', resizeStars, { passive: true });
resizeStars();

const STAR_COUNT = 160;
const stars = starCanvas ? Array.from({length: STAR_COUNT}).map(() => ({
  x: Math.random() * starCanvas.width,
  y: Math.random() * starCanvas.height,
  r: Math.random() * 1.6 + 0.4,
  a: Math.random() * 0.6 + 0.2,
  da: (Math.random() * 0.02 + 0.005) * (Math.random() < 0.5 ? -1 : 1)
})) : [];

function drawStars(){
  if (!stx || !starCanvas) return;
  stx.clearRect(0,0,starCanvas.width, starCanvas.height);
  for(const s of stars){
    s.a += s.da;
    if(s.a < 0.15 || s.a > 0.9) s.da *= -1;
    stx.globalAlpha = s.a;
    stx.beginPath();
    stx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    stx.fillStyle = '#ffffff';
    stx.fill();
  }
  requestAnimationFrame(drawStars);
}
drawStars();


// ===============================
// Carta: efecto máquina de escribir
// ===============================
(function typewriter(){
  const el = document.getElementById('cartaTexto');
  if(!el) return;

  const full = el.textContent.trim();
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor';
  let i = 0;

  function step(){
    const chunk = Math.random() < 0.3 ? 2 : 1;
    el.textContent += full.slice(i, i + chunk);
    i += chunk;

    if(i < full.length){
      el.appendChild(cursor);
      setTimeout(step, 30 + Math.random()*70);
    }else{
      cursor.remove();
    }
  }
  step();
})();


// ===============================
// Música de fondo (autoplay con fallback)
// Usa <audio id="bgMusic" ...> en el HTML
// ===============================
window.bg = document.getElementById('bgMusic');          // <-- UNA sola referencia global
const gate = document.getElementById('audioGate');
const btnEnable = document.getElementById('enableSound');

function fadeIn(audio, target = 0.6, ms = 1200){
  if (!audio) return;
  audio.volume = 0;
  const steps = 12;
  let i = 0;
  const tick = setInterval(() => {
    i++;
    audio.volume = Math.min(target, (i/steps)*target);
    if(i >= steps) clearInterval(tick);
  }, ms/steps);
}

async function tryAutoplay(){
  if(!window.bg) return;
  window.bg.volume = 0.6;
  try{
    await window.bg.play();
    gate?.classList.add('hidden');
  }catch(e){
    // Autoplay bloqueado -> mostrar “puerta”
    gate?.classList.remove('hidden');
  }
}

async function enableAudio(){
  gate?.classList.add('hidden');
  try{
    await window.bg.play();
    fadeIn(window.bg, 0.6, 1200);
    window.removeEventListener('click', enableAudioOnce);
    window.removeEventListener('touchstart', enableAudioOnce);
    window.removeEventListener('keydown', enableAudioOnce);
  }catch(e){
    gate?.classList.remove('hidden');
  }
}
function enableAudioOnce(){ enableAudio(); }

document.addEventListener('DOMContentLoaded', tryAutoplay);
btnEnable?.addEventListener('click', enableAudio);
window.addEventListener('click', enableAudioOnce, { once: true });
window.addEventListener('touchstart', enableAudioOnce, { once: true, passive: true });
window.addEventListener('keydown', enableAudioOnce, { once: true });
