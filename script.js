import * as THREE from 'three';
import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
document.getElementById("three-container").appendChild(renderer.domElement);

// controls (drag to rotate)
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableZoom = false;
controls.enablePan = false;

camera.position.z = 5;

// star field
const starsGeometry = new THREE.BufferGeometry();
const starsCount = 5000;

const positions = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 2000;
}

starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const starsMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 0.7
});

const stars = new THREE.Points(starsGeometry, starsMaterial);
scene.add(stars);

// shooting stars
let shootingStars = [];

function createShootingStar() {
  const geometry = new THREE.BufferGeometry();
  const material = new THREE.LineBasicMaterial({ color: 0xffffff });

  const points = [];
  let x = (Math.random() - 0.5) * 1000;
  let y = (Math.random() - 0.5) * 1000;

  points.push(new THREE.Vector3(x, y, -500));
  points.push(new THREE.Vector3(x + 50, y - 50, -500));

  geometry.setFromPoints(points);

  const line = new THREE.Line(geometry, material);
  scene.add(line);

  shootingStars.push({ line, life: 0 });
}

setInterval(createShootingStar, 2000);

function animate() {
  requestAnimationFrame(animate);

  stars.rotation.y += 0.0005;

  // update shooting stars
  shootingStars.forEach((s, i) => {
    s.life++;
    s.line.position.x += 2;
    s.line.position.y -= 2;

    if (s.life > 60) {
      scene.remove(s.line);
      shootingStars.splice(i, 1);
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Smooth scroll to section
function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}

// Menu button click handling
document.querySelectorAll('.menu-button').forEach(button => {
  button.addEventListener('click', () => {
    const section = button.dataset.section;
    
    // Auto-switch tab for projects, skills, articles
    if (['projects', 'skills', 'articles'].includes(section)) {
      document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
      
      const tabButton = document.querySelector(`.tab-button[data-tab="${section}"]`);
      if (tabButton) {
        tabButton.classList.add('active');
        document.getElementById(section).classList.add('active');
      }
    }
    
    // Close mobile menu after navigation
    if (window.innerWidth <= 768) {
      hamburgerMenu.classList.remove('open');
      sidebar.classList.remove('open');
    }
    
    scrollToSection(section);
  });
});

// Tab switching
document.querySelectorAll('.tab-button').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
    button.classList.add('active');
    document.getElementById(button.dataset.tab).classList.add('active');
  });
});

// Navigate function
function navigateTo(url) {
  window.location.href = url;
}

// Hamburger menu toggle
const hamburgerMenu = document.getElementById('hamburger-menu');
const sidebar = document.querySelector('.sidebar');

hamburgerMenu.addEventListener('click', () => {
  hamburgerMenu.classList.toggle('open');
  sidebar.classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 && 
      !sidebar.contains(e.target) && 
      !hamburgerMenu.contains(e.target) && 
      sidebar.classList.contains('open')) {
    hamburgerMenu.classList.remove('open');
    sidebar.classList.remove('open');
  }
});