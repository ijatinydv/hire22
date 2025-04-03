document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Hero section typing effect
    const typingElement = document.querySelector('.typing-effect');
    if (typingElement) {
        const phrases = [
            'AI-Powered',
            'Fast & Efficient',
            'Smart Matching',
            'Time-saving'
        ];
        let phraseIndex = 0;
        let letterIndex = 0;
        let typing = true;
        let typingDelay = 100;
        let erasingDelay = 50;
        let newPhraseDelay = 2000;

        function typePhrase() {
            if (typing && letterIndex < phrases[phraseIndex].length) {
                typingElement.textContent += phrases[phraseIndex].charAt(letterIndex);
                letterIndex++;
                setTimeout(typePhrase, typingDelay);
            } else if (typing && letterIndex === phrases[phraseIndex].length) {
                typing = false;
                setTimeout(typePhrase, newPhraseDelay);
            } else if (!typing && letterIndex > 0) {
                typingElement.textContent = phrases[phraseIndex].substring(0, letterIndex - 1);
                letterIndex--;
                setTimeout(typePhrase, erasingDelay);
            } else if (!typing && letterIndex === 0) {
                typing = true;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typePhrase, typingDelay);
            }
        }

        typePhrase();
    }

    // Animated counters for stats
    const stats = document.querySelectorAll('.stat h3');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        
        stats.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 2000; // ms
            const step = target / (duration / 16); // 60fps approx
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    stat.textContent = Math.ceil(current) + (stat.getAttribute('data-suffix') || '');
                    requestAnimationFrame(updateCounter);
                } else {
                    stat.textContent = target + (stat.getAttribute('data-suffix') || '');
                }
            };
            
            updateCounter();
        });
        
        statsAnimated = true;
    }

    // Multi-step form handling
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-steps .step');
    const nextButtons = document.querySelectorAll('.next-btn');
    const backButtons = document.querySelectorAll('.back-btn');
    const hiringForm = document.getElementById('hiring-form');

    if (nextButtons.length > 0) {
        nextButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentStep = button.closest('.form-step');
                const currentStepNumber = parseInt(currentStep.dataset.step);
                const nextStepNumber = currentStepNumber + 1;
                const nextStep = document.querySelector(`.form-step[data-step="${nextStepNumber}"]`);
                
                // Validate current step fields
                const fields = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
                let isValid = true;
                
                fields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                        
                        field.addEventListener('input', function() {
                            if (field.value.trim()) {
                                field.classList.remove('error');
                            }
                        });
                    }
                });
                
                if (isValid && nextStep) {
                    // Move to next step with slide animation
                    currentStep.classList.add('slide-out');
                    
                    setTimeout(() => {
                        currentStep.classList.remove('active', 'slide-out');
                        nextStep.classList.add('active', 'slide-in');
                        
                        setTimeout(() => {
                            nextStep.classList.remove('slide-in');
                        }, 300);
                        
                        // Update progress indicator
                        updateProgressSteps(nextStepNumber);
                        
                        // Scroll to top of form
                        scrollToTop(document.querySelector('.form-container'));
                    }, 300);
                }
            });
        });
    }

    if (backButtons.length > 0) {
        backButtons.forEach(button => {
            button.addEventListener('click', function() {
                const currentStep = button.closest('.form-step');
                const currentStepNumber = parseInt(currentStep.dataset.step);
                const prevStepNumber = currentStepNumber - 1;
                const prevStep = document.querySelector(`.form-step[data-step="${prevStepNumber}"]`);
                
                if (prevStep) {
                    // Move to previous step with reverse slide animation
                    currentStep.classList.add('slide-out-reverse');
                    
                    setTimeout(() => {
                        currentStep.classList.remove('active', 'slide-out-reverse');
                        prevStep.classList.add('active', 'slide-in-reverse');
                        
                        setTimeout(() => {
                            prevStep.classList.remove('slide-in-reverse');
                        }, 300);
                        
                        // Update progress indicator
                        updateProgressSteps(prevStepNumber);
                        
                        // Scroll to top of form
                        scrollToTop(document.querySelector('.form-container'));
                    }, 300);
                }
            });
        });
    }

    function updateProgressSteps(currentStep) {
        if (progressSteps.length > 0) {
            progressSteps.forEach((step, index) => {
                const stepNumber = index + 1;
                if (stepNumber < currentStep) {
                    step.classList.add('completed');
                    step.classList.add('active');
                } else if (stepNumber === currentStep) {
                    step.classList.add('active');
                    step.classList.remove('completed');
                } else {
                    step.classList.remove('active');
                    step.classList.remove('completed');
                }
            });
            
            // Animate progress lines
            const progressLines = document.querySelectorAll('.progress-line');
            progressLines.forEach((line, index) => {
                if (index < currentStep - 1) {
                    line.classList.add('filled');
                } else {
                    line.classList.remove('filled');
                }
            });
        }
    }

    // Form submission
    if (hiringForm) {
        hiringForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validate final step
            const currentStep = document.querySelector('.form-step.active');
            const fields = currentStep.querySelectorAll('input[required], select[required], textarea[required]');
            let isValid = true;
            
            fields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.classList.add('error');
                    
                    field.addEventListener('input', function() {
                        if (field.value.trim()) {
                            field.classList.remove('error');
                        }
                    });
                }
            });
            
            if (isValid) {
                // Show loading state first
                const submitButton = currentStep.querySelector('.submit-btn');
                const originalText = submitButton.textContent;
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                // Simulate API call
                setTimeout(() => {
                    // Show success message after "processing"
                    showSuccessMessage();
                }, 1500);
            }
        });
    }

    function showSuccessMessage() {
        const formContainer = document.querySelector('.form-container');
        
        if (formContainer) {
            formContainer.innerHTML = `
                <div class="success-message">
                    <div class="success-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <h3>JobCoNCT Created Successfully!</h3>
                    <p>We'll get back to you with the perfect candidates within <span class="highlight">22 Hours</span>.</p>
                    <div class="countdown">
                        <div class="countdown-timer">22:00:00</div>
                        <div class="countdown-progress"><div class="progress-bar"></div></div>
                    </div>
                    <p class="small">Check your email for confirmation details.</p>
                </div>
            `;
            
            // Start countdown animation
            const progressBar = document.querySelector('.progress-bar');
            if (progressBar) {
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.width = '100%';
                }, 100);
            }
            
            // Start countdown timer simulation
            startCountdown();
        }
    }
    
    function startCountdown() {
        const countdownTimer = document.querySelector('.countdown-timer');
        if (!countdownTimer) return;
        
        let hours = 22;
        let minutes = 0;
        let seconds = 0;
        
        const interval = setInterval(() => {
            seconds--;
            
            if (seconds < 0) {
                seconds = 59;
                minutes--;
            }
            
            if (minutes < 0) {
                minutes = 59;
                hours--;
            }
            
            if (hours < 0) {
                clearInterval(interval);
                return;
            }
            
            countdownTimer.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                
                if (target) {
                    scrollToTarget(target);
                }
            }
        });
    });

    function scrollToTarget(target) {
        window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
        });
    }
    
    function scrollToTop(element) {
        window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
        });
    }

    // Client logos carousel
    const clientsSlider = document.querySelector('.clients-slider');
    if (clientsSlider) {
        let scrollAmount = 0;
        const scrollSpeed = 1;
        const scrollPause = 2000;
        let isPaused = false;
        let scrollInterval;
        
        // Clone logos for infinite scroll effect
        const logoElements = document.querySelectorAll('.client-logo');
        logoElements.forEach(logo => {
            const clone = logo.cloneNode(true);
            clientsSlider.appendChild(clone);
        });
        
        // Calculate total scroll width
        const totalWidth = Array.from(clientsSlider.children).reduce((width, child) => {
            return width + child.offsetWidth + parseInt(window.getComputedStyle(child).marginRight);
        }, 0);
        
        // Set slider width to fit all elements
        clientsSlider.style.width = `${totalWidth}px`;
        
        function startScroll() {
            scrollInterval = setInterval(() => {
                if (!isPaused) {
                    scrollAmount += scrollSpeed;
                    
                    // Reset scroll position when reached halfway
                    if (scrollAmount >= totalWidth / 2) {
                        scrollAmount = 0;
                    }
                    
                    clientsSlider.style.transform = `translateX(-${scrollAmount}px)`;
                }
            }, 20);
        }
        
        // Pause on hover
        clientsSlider.addEventListener('mouseenter', () => {
            isPaused = true;
        });
        
        clientsSlider.addEventListener('mouseleave', () => {
            isPaused = false;
        });
        
        // Start scrolling after initial pause
        setTimeout(startScroll, scrollPause);
    }

    // Auto-suggestion for location field
    const locationInput = document.getElementById('location');
    if (locationInput) {
        const cities = [
            'Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai',
            'Pune', 'Kolkata', 'Ahmedabad', 'Gurgaon', 'Noida',
            'Remote'
        ];
        
        let suggestionsVisible = false;
        
        locationInput.addEventListener('input', function() {
            const inputValue = this.value.toLowerCase();
            const matchedCities = cities.filter(city => 
                city.toLowerCase().includes(inputValue)
            );
            
            showSuggestions(matchedCities, inputValue);
        });
        
        function showSuggestions(matches, input) {
            // Remove existing suggestions
            removeSuggestions();
            
            if (input === '' || matches.length === 0) {
                return;
            }
            
            const suggestionsDiv = document.createElement('div');
            suggestionsDiv.classList.add('suggestions');
            
            matches.forEach(match => {
                const suggestionItem = document.createElement('div');
                suggestionItem.classList.add('suggestion-item');
                suggestionItem.textContent = match;
                
                suggestionItem.addEventListener('click', function() {
                    locationInput.value = match;
                    removeSuggestions();
                });
                
                suggestionsDiv.appendChild(suggestionItem);
            });
            
            document.body.appendChild(suggestionsDiv);
            
            // Position the suggestions dropdown
            const inputRect = locationInput.getBoundingClientRect();
            suggestionsDiv.style.top = `${inputRect.bottom + window.scrollY}px`;
            suggestionsDiv.style.left = `${inputRect.left + window.scrollX}px`;
            suggestionsDiv.style.width = `${inputRect.width}px`;
            
            suggestionsVisible = true;
        }
        
        function removeSuggestions() {
            const suggestions = document.querySelector('.suggestions');
            if (suggestions) {
                suggestions.remove();
                suggestionsVisible = false;
            }
        }
        
        // Close suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (suggestionsVisible && e.target !== locationInput) {
                removeSuggestions();
            }
        });
    }

    // Interactive AI Brain Visualization
    const aiBrain = document.querySelector('.ai-brain');
    if (aiBrain) {
        const neurons = aiBrain.querySelectorAll('.neuron');
        const connections = aiBrain.querySelectorAll('.connection');
        
        // Randomly activate neurons
        function activateRandomNeuron() {
            // Reset all neurons and connections
            neurons.forEach(neuron => neuron.classList.remove('active'));
            connections.forEach(connection => connection.classList.remove('active'));
            
            // Activate random neuron and its connections
            const randomIndex = Math.floor(Math.random() * neurons.length);
            neurons[randomIndex].classList.add('active');
            
            // Find connections linked to this neuron and activate them
            connections.forEach(connection => {
                if (connection.dataset.source === neurons[randomIndex].dataset.id || 
                    connection.dataset.target === neurons[randomIndex].dataset.id) {
                    connection.classList.add('active');
                    
                    // Also activate the neuron at the other end of the connection
                    const otherEndId = connection.dataset.source === neurons[randomIndex].dataset.id ? 
                        connection.dataset.target : connection.dataset.source;
                    
                    const otherEndNeuron = document.querySelector(`.neuron[data-id="${otherEndId}"]`);
                    if (otherEndNeuron) {
                        setTimeout(() => {
                            otherEndNeuron.classList.add('active');
                        }, 200);
                    }
                }
            });
        }
        
        // Set interval for random activation
        setInterval(activateRandomNeuron, 2000);
    }

    // Animate process steps on hover
    const processSteps = document.querySelectorAll('.step');
    processSteps.forEach(step => {
        step.addEventListener('mouseenter', function() {
            this.classList.add('hovered');
        });
        
        step.addEventListener('mouseleave', function() {
            this.classList.remove('hovered');
        });
    });

    // Add animation class to elements when they come into view
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.step, .benefit-card, .stat, .hero-content, .hero-image');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight * 0.8;
            
            if (elementPosition < screenPosition) {
                element.classList.add('fade-in');
                
                // If it's a stat element, trigger counter animation
                if (element.classList.contains('stat')) {
                    animateStats();
                }
            }
        });
    };
    
    window.addEventListener('scroll', animateOnScroll);
    animateOnScroll(); // Initial check on page load
    
    // Parallax effect for hero section
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                heroSection.style.backgroundPositionY = `${scrollPosition * 0.4}px`;
            }
        });
    }
    
    // Floating elements effect
    const floatingElements = document.querySelectorAll('.floating');
    if (floatingElements.length > 0) {
        floatingElements.forEach((element, index) => {
            const delay = index * 0.5;
            element.style.animation = `float 3s ease-in-out ${delay}s infinite`;
        });
    }
    
    // Add glow effect to primary buttons
    const primaryButtons = document.querySelectorAll('.primary-btn');
    primaryButtons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.classList.add('glow');
        });
        
        button.addEventListener('mouseleave', function() {
            this.classList.remove('glow');
        });
    });
});

// Add custom CSS for dynamic elements
const style = document.createElement('style');
style.textContent = `
    .suggestions {
        position: absolute;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        max-height: 200px;
        overflow-y: auto;
        z-index: 1000;
    }
    
    .suggestion-item {
        padding: 10px 15px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .suggestion-item:hover {
        background-color: #f0f5ff;
    }
    
    .nav-links.active {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        background-color: white;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        padding: 20px;
    }
    
    .error {
        border-color: #ff5252 !important;
        animation: shake 0.4s linear;
    }
    
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
    
    .fade-in {
        animation: fadeIn 0.6s ease-out forwards;
    }
    
    @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
        100% { transform: translateY(0px); }
    }
    
    .success-message {
        text-align: center;
        padding: 40px 20px;
        animation: fadeIn 0.8s ease-out;
    }
    
    .success-icon {
        font-size: 4rem;
        color: #28a745;
        margin-bottom: 20px;
        animation: pulse 2s infinite;
    }
    
    .success-message h3 {
        color: #0040C1;
        margin-bottom: 15px;
    }
    
    .success-message .small {
        color: #666;
        margin-top: 15px;
        font-size: 0.9rem;
    }
    
    .success-message .highlight {
        color: #FF5722;
        font-weight: bold;
    }
    
    .countdown {
        margin: 20px auto;
        max-width: 300px;
    }
    
    .countdown-timer {
        font-size: 1.5rem;
        font-weight: bold;
        margin-bottom: 10px;
        color: #0A1A35;
    }
    
    .countdown-progress {
        height: 6px;
        background-color: #E4E7ED;
        border-radius: 3px;
        overflow: hidden;
    }
    
    .progress-bar {
        height: 100%;
        background-color: #FF5722;
        width: 0;
        transition: width 22h linear;
    }
    
    .neuron {
        transition: all 0.3s ease;
        opacity: 0.7;
    }
    
    .neuron.active {
        opacity: 1;
        transform: scale(1.2);
        filter: drop-shadow(0 0 4px rgba(255, 87, 34, 0.7));
    }
    
    .connection {
        transition: all 0.3s ease;
        opacity: 0.5;
    }
    
    .connection.active {
        opacity: 1;
        stroke-width: 3px;
        stroke: #FF5722;
    }
    
    .clients-slider {
        transition: transform 0.3s ease-out;
    }
    
    .step {
        transition: all 0.4s ease;
    }
    
    .step.hovered {
        transform: translateY(-20px) scale(1.05);
    }
    
    .slide-out {
        animation: slideOutLeft 0.3s forwards;
    }
    
    .slide-in {
        animation: slideInRight 0.3s forwards;
    }
    
    .slide-out-reverse {
        animation: slideOutRight 0.3s forwards;
    }
    
    .slide-in-reverse {
        animation: slideInLeft 0.3s forwards;
    }
    
    @keyframes slideOutLeft {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(-30px); opacity: 0; }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(30px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(30px); opacity: 0; }
    }
    
    @keyframes slideInLeft {
        from { transform: translateX(-30px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    .progress-line {
        position: relative;
        overflow: hidden;
    }
    
    .progress-line.filled::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: var(--primary-color);
        animation: progressFill 0.5s ease-out forwards;
    }
    
    @keyframes progressFill {
        from { width: 0; }
        to { width: 100%; }
    }
    
    .glow {
        box-shadow: 0 0 10px var(--primary-color);
    }
`;
document.head.appendChild(style); 