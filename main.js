// js/main.js

// Инициализация сцены THREE.js
const container = document.getElementById('wallet-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 5);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setClearColor(0x000000, 0);
container.appendChild(renderer.domElement);

// Освещение
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 7);
scene.add(directionalLight);

// Загрузка модели кошелька (для примера используется BoxGeometry — замените на вашу 3D модель)
const geometry = new THREE.BoxGeometry(2, 1, 0.5);
const material = new THREE.MeshStandardMaterial({
  color: 0x007bff,
  metalness: 0.6,
  roughness: 0.2,
  emissive: 0x003366,
});
const wallet = new THREE.Mesh(geometry, material);
scene.add(wallet);

// Анимация вращения
function animate() {
  requestAnimationFrame(animate);
  wallet.rotation.y += 0.005;
  renderer.render(scene, camera);
}
animate();

// Обработка ресайза
window.addEventListener('resize', () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

// Частицы на фоне с Canvas
const particlesCanvas = document.getElementById('particles');
particlesCanvas.width = window.innerWidth;
particlesCanvas.height = window.innerHeight;
const ctx = particlesCanvas.getContext('2d');

const particles = [];
const maxParticles = 100;

function random(min, max) {
  return Math.random() * (max - min) + min;
}

class Particle {
  constructor() {
    this.x = random(0, window.innerWidth);
    this.y = random(0, window.innerHeight);
    this.radius = random(1, 3);
    this.speedX = random(-0.3, 0.3);
    this.speedY = random(-0.3, 0.3);
    this.color = `rgba(0, 200, 255, ${random(0.3, 0.8)})`;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if(this.x < 0 || this.x > window.innerWidth) this.speedX = -this.speedX;
    if(this.y < 0 || this.y > window.innerHeight) this.speedY = -this.speedY;
  }
  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles.length = 0;
  for(let i = 0; i < maxParticles; i++) {
    particles.push(new Particle());
  }
}
initParticles();

function animateParticles() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

window.addEventListener('resize', () => {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
  initParticles();
});

// Модальное окно заказа
const orderBtn = document.getElementById('orderBtn');
const modal = document.getElementById('orderModal');
const closeBtn = document.getElementById('closeBtn');
const closeBtn2 = document.getElementById('closeBtn2');
const sendBtn = document.getElementById('sendBtn');

orderBtn.addEventListener('click', () => {
  modal.classList.add('active');
});

[closeBtn, closeBtn2].forEach(btn => {
  btn.addEventListener('click', () => {
    modal.classList.remove('active');
  });
});

// Простейшая валидация и отправка (здесь можно добавить реальный API вызов)
sendBtn.addEventListener('click', () => {
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  if(name === '' || phone === '') {
    alert('Пожалуйста, заполните все поля!');
    return;
  }
  alert(`Спасибо, ${name}! Мы свяжемся с вами по номеру ${phone}.`);
  modal.classList.remove('active');
  document.getElementById('name').value = '';
  document.getElementById('phone').value = '';
});

// Тёмная/светлая тема
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

function updateThemeButton() {
  if(body.classList.contains('dark-theme')) {
    themeToggle.textContent = 'Светлая тема';
  } else {
    themeToggle.textContent = 'Тёмная тема';
  }
}

themeToggle.addEventListener('click', () => {
  body.classList.toggle('dark-theme');
  updateThemeButton();
});

// Инициализация
updateThemeButton();
