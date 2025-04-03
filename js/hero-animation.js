document.addEventListener('DOMContentLoaded', () => {
  // AI Brain Animation
  const neurons = document.querySelectorAll('.neuron');
  const connections = document.querySelectorAll('.connection');
  
  // Function to activate a random neuron and its connections
  function activateRandomNeuron() {
    // Reset all neurons and connections
    neurons.forEach(neuron => neuron.classList.remove('active'));
    connections.forEach(connection => connection.classList.remove('active'));
    
    // Select a random neuron
    const randomNeuron = neurons[Math.floor(Math.random() * neurons.length)];
    const neuronId = randomNeuron.getAttribute('data-id');
    
    // Activate the neuron
    randomNeuron.classList.add('active');
    
    // Activate connections related to this neuron
    connections.forEach(connection => {
      const source = connection.getAttribute('data-source');
      const target = connection.getAttribute('data-target');
      
      if (source === neuronId || target === neuronId) {
        connection.classList.add('active');
        
        // Find the connected neuron and activate it too
        if (source === neuronId) {
          document.querySelector(`.neuron[data-id="${target}"]`)?.classList.add('active');
        } else if (target === neuronId) {
          document.querySelector(`.neuron[data-id="${source}"]`)?.classList.add('active');
        }
      }
    });
    
    // Schedule the next activation
    setTimeout(activateRandomNeuron, Math.random() * 1000 + 500);
  }
  
  // Start the animation
  activateRandomNeuron();
  
  // Add interaction on hover/click
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    heroImage.addEventListener('mousemove', (e) => {
      // Calculate relative position within the image
      const rect = heroImage.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Find the closest neuron to the mouse position
      let closestNeuron = null;
      let closestDistance = Infinity;
      
      neurons.forEach(neuron => {
        // Get neuron position from SVG coordinates
        const neuronX = parseFloat(neuron.getAttribute('cx'));
        const neuronY = parseFloat(neuron.getAttribute('cy'));
        
        // Calculate distance
        const dx = neuronX - x;
        const dy = neuronY - y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < closestDistance) {
          closestDistance = distance;
          closestNeuron = neuron;
        }
      });
      
      // If mouse is close enough to a neuron, activate it and its connections
      if (closestDistance < 50 && closestNeuron) {
        // Reset all neurons and connections
        neurons.forEach(neuron => neuron.classList.remove('active'));
        connections.forEach(connection => connection.classList.remove('active'));
        
        // Activate the closest neuron
        const neuronId = closestNeuron.getAttribute('data-id');
        closestNeuron.classList.add('active');
        
        // Activate connections related to this neuron
        connections.forEach(connection => {
          const source = connection.getAttribute('data-source');
          const target = connection.getAttribute('data-target');
          
          if (source === neuronId || target === neuronId) {
            connection.classList.add('active');
            
            // Find the connected neuron and activate it too
            if (source === neuronId) {
              document.querySelector(`.neuron[data-id="${target}"]`)?.classList.add('active');
            } else if (target === neuronId) {
              document.querySelector(`.neuron[data-id="${source}"]`)?.classList.add('active');
            }
          }
        });
      }
    });
  }
  
  // Typing effect for hero heading
  const heroHeading = document.querySelector('.hero-heading');
  if (heroHeading) {
    const originalText = heroHeading.textContent;
    heroHeading.textContent = '';
    
    let charIndex = 0;
    function typeText() {
      if (charIndex < originalText.length) {
        heroHeading.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(typeText, Math.random() * 100 + 50);
      }
    }
    
    // Start typing effect with a small delay after page load
    setTimeout(typeText, 500);
  }
  
  // Animated counters for statistics
  const statCounters = document.querySelectorAll('.stat-counter');
  
  function animateCounter(counter) {
    const target = parseInt(counter.getAttribute('data-target'), 10);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;
    
    function updateCounter(currentTime) {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1);
      
      // Easing function for smoother animation
      const easeOutQuad = progress * (2 - progress);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOutQuad);
      
      counter.textContent = currentValue + (counter.getAttribute('data-suffix') || '');
      
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    }
    
    requestAnimationFrame(updateCounter);
  }
  
  // Intersection Observer to trigger counter animations when visible
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  statCounters.forEach(counter => {
    observer.observe(counter);
  });
}); 