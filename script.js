// Circuit line animation
function createCircuitLines() {
  const circuitContainer = document.getElementById('circuit-lines');
  const lineCount = 10;
  
  for (let i = 0; i < lineCount; i++) {
    const line = document.createElement('div');
    line.className = 'circuit-line';
    line.style.top = `${Math.random() * 100}%`;
    line.style.height = `${Math.random() * 2 + 1}px`;
    line.style.animationDelay = `${Math.random() * 15}s`;
    line.style.opacity = `${Math.random() * 0.5 + 0.2}`;
    circuitContainer.appendChild(line);
  }
}

// Particles background
function createParticles() {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const particlesContainer = document.getElementById('particles');
  
  particlesContainer.appendChild(canvas);
  
  // Set canvas size
  function resizeCanvas() {
    canvas.width = particlesContainer.offsetWidth;
    canvas.height = particlesContainer.offsetHeight;
  }
  
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Particle class
  class Particle {
    constructor() {
      this.reset();
    }
    
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.2;
      this.color = this.getRandomColor();
    }
    
    getRandomColor() {
      const colors = [
        'rgba(89, 216, 255, OPACITY)',
        'rgba(184, 76, 255, OPACITY)',
        'rgba(255, 72, 169, OPACITY)'
      ];
      return colors[Math.floor(Math.random() * colors.length)].replace('OPACITY', this.opacity);
    }
    
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      
      // Boundary check
      if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }
  }
  
  // Create particles
  const particles = [];
  const particleCount = 50;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle());
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    requestAnimationFrame(animate);
  }
  
  animate();
}

// 3D tilt effect
function addTiltEffect() {
  const card = document.getElementById('profile-card');
  let bounds;
  
  function rotateToMouse(e) {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    
    const leftX = mouseX - bounds.x;
    const topY = mouseY - bounds.y;
    
    const center = {
      x: leftX - bounds.width / 2,
      y: topY - bounds.height / 2
    };
    
    card.style.transform = `
      perspective(1000px)
      rotateX(${-center.y / 20}deg)
      rotateY(${center.x / 20}deg)
      translateZ(10px)
    `;
  }
  
  function resetTilt() {
    card.style.transform = `
      perspective(1000px)
      rotateX(0deg)
      rotateY(0deg)
      translateZ(0)
    `;
  }
  
  function updateBounds() {
    bounds = card.getBoundingClientRect();
  }
  
  document.addEventListener('mousemove', rotateToMouse);
  card.addEventListener('mouseleave', resetTilt);
  window.addEventListener('resize', updateBounds);
  window.addEventListener('scroll', updateBounds);
  
  updateBounds();
}

// Tab switching
function setupTabs() {
  const tabs = document.querySelectorAll('.tab-button');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Deactivate all tabs
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      // Hide all content sections
      document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
      });
      
      // Show selected content section
      const targetId = `${tab.dataset.tab}-section`;
      document.getElementById(targetId).classList.add('active');
      
      // Animate stat bars if stats tab is selected
      if (tab.dataset.tab === 'stats') {
        animateStatBars();
      }
    });
  });
}

// Animate stat bars
function animateStatBars() {
  const statBars = document.querySelectorAll('.stat-bar');
  
  statBars.forEach(bar => {
    const percentage = bar.dataset.percentage;
    bar.style.width = '0%';
    
    // Force reflow
    void bar.offsetWidth;
    
    // Animate the width
    bar.style.width = `${percentage}%`;
  });
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  createCircuitLines();
  createParticles();
  addTiltEffect();
  setupTabs();
  
  // Initially animate stat bars if stats tab is already active
  if (document.querySelector('.tab-button[data-tab="stats"]').classList.contains('active')) {
    animateStatBars();
  }
  
  // Custom tooltip positioning
  const tooltipElements = document.querySelectorAll('.has-tooltip');
  
  tooltipElements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      const tooltip = element.nextElementSibling;
      if (tooltip && tooltip.classList.contains('custom-tooltip')) {
        const rect = element.getBoundingClientRect();
        const parentRect = element.closest('.profile-card').getBoundingClientRect();
        
        tooltip.style.left = `${rect.left - parentRect.left}px`;
        tooltip.style.top = `${rect.bottom - parentRect.top + 5}px`;
      }
    });
  });
  
  // Allow user to update profile data
  function setupEditable(elementId, defaultText) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    element.addEventListener('dblclick', () => {
      const newValue = prompt(`Enter new ${elementId.replace('profile-', '')}:`, element.textContent);
      if (newValue !== null && newValue.trim() !== '') {
        element.textContent = newValue;
      }
    });
  }
  
  setupEditable('profile-name', 'Aria Nightshade');
  setupEditable('profile-title', 'Arcane Techno-Mage');
});

// Add some randomized floating particles that follow the cursor
function addFloatingParticles() {
  const card = document.getElementById('profile-card');
  const floatingParticlesContainer = document.createElement('div');
  floatingParticlesContainer.className = 'floating-particles';
  floatingParticlesContainer.style.position = 'absolute';
  floatingParticlesContainer.style.top = '0';
  floatingParticlesContainer.style.left = '0';
  floatingParticlesContainer.style.width = '100%';
  floatingParticlesContainer.style.height = '100%';
  floatingParticlesContainer.style.pointerEvents = 'none';
  floatingParticlesContainer.style.overflow = 'hidden';
  card.appendChild(floatingParticlesContainer);
  
  const particles = [];
  const maxParticles = 15;
  let mouseX = 0;
  let mouseY = 0;
  
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    // Add new particle on mouse move
    if (particles.length < maxParticles && Math.random() > 0.8) {
      createParticle(mouseX, mouseY);
    }
  });
  
  function createParticle(x, y) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 4 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.borderRadius = '50%';
    
    // Randomly select a color
    const colors = [
      'rgba(89, 216, 255, 0.7)',
      'rgba(184, 76, 255, 0.7)',
      'rgba(255, 72, 169, 0.7)'
    ];
    
    particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    particle.style.boxShadow = `0 0 6px ${particle.style.backgroundColor}`;
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;
    
    floatingParticlesContainer.appendChild(particle);
    
    // Animation data
    const data = {
      element: particle,
      x: x,
      y: y,
      speedX: (Math.random() - 0.5) * 2,
      speedY: (Math.random() - 0.5) * 2,
      life: 100,
      maxLife: 100
    };
    
    particles.push(data);
  }
  
  function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      
      // Decrease life
      p.life -= 1;
      
      // Calculate opacity based on life
      const opacity = p.life / p.maxLife;
      p.element.style.opacity = opacity;
      
      // Add some attraction to cursor
      const dx = mouseX - p.x;
      const dy = mouseY - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        p.speedX += dx * 0.01;
        p.speedY += dy * 0.01;
      }
      
      // Add some damping
      p.speedX *= 0.95;
      p.speedY *= 0.95;
      
      // Update position
      p.x += p.speedX;
      p.y += p.speedY;
      
      p.element.style.left = `${p.x}px`;
      p.element.style.top = `${p.y}px`;
      
      // Remove if life is depleted
      if (p.life <= 0) {
        floatingParticlesContainer.removeChild(p.element);
        particles.splice(i, 1);
      }
    }
    
    requestAnimationFrame(updateParticles);
  }
  
  updateParticles();
}

// Initialize all the effects
createCircuitLines();
createParticles();
addTiltEffect();
setupTabs();
addFloatingParticles();

// Initially animate stat bars
setTimeout(() => {
  animateStatBars();
}, 500);
