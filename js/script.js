document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileMenuToggle.classList.toggle('active');
        });
    }
    
    // Theme toggle functionality
    const setupThemeToggle = () => {
        const themeToggle = document.querySelector('.theme-toggle');
        if (!themeToggle) return;
        
        const htmlElement = document.documentElement;
        const themeIcon = themeToggle.querySelector('i');
        
        // Check for saved theme preference or use device preference
        const savedTheme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Apply saved theme
        htmlElement.setAttribute('data-theme', savedTheme);
        updateThemeIcon(savedTheme);
        
        // Toggle theme on click
        themeToggle.addEventListener('click', function() {
            themeToggle.classList.add('switching');
            
            // Toggle theme
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            // Apply new theme with animation
            setTimeout(() => {
                htmlElement.setAttribute('data-theme', newTheme);
                localStorage.setItem('theme', newTheme);
                updateThemeIcon(newTheme);
                
                // Remove animation class after animation completes
                setTimeout(() => {
                    themeToggle.classList.remove('switching');
                }, 500);
            }, 100);
        });
        
        function updateThemeIcon(theme) {
            if (!themeIcon) return;
            themeIcon.className = theme === 'light' ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            const newTheme = e.matches ? 'dark' : 'light';
            
            // Only update if user hasn't manually set a preference
            if (!localStorage.getItem('theme')) {
                htmlElement.setAttribute('data-theme', newTheme);
                updateThemeIcon(newTheme);
            }
        });
    };
    
    // Enhanced SVG animations
    const setupSvgAnimations = () => {
        // Function to animate SVG elements
        const animateSvgElements = (svgElement, selector) => {
            if (!svgElement) return;
            
            let svgDoc;
            
            // If it's an img with SVG src, get its contentDocument
            if (svgElement.tagName === 'IMG') {
                try {
                    svgDoc = svgElement.contentDocument;
                    if (!svgDoc) return;
                } catch (e) {
                    console.error('Error accessing SVG contentDocument:', e);
                    return;
                }
            } else {
                // If it's an inline SVG, use the element itself
                svgDoc = svgElement;
            }
            
            // Animate neural connections if they exist
            const connections = svgDoc.querySelectorAll('.connections line');
            connections.forEach((connection, index) => {
                if (typeof connection.getTotalLength === 'function') {
                    connection.style.strokeDasharray = connection.getTotalLength();
                    connection.style.strokeDashoffset = connection.getTotalLength();
                    connection.style.animation = `drawLine 1.5s ease forwards ${index * 0.1}s`;
                }
            });
            
            // Animate neurons if they exist
            const neurons = svgDoc.querySelectorAll('.neurons circle');
            neurons.forEach((neuron, index) => {
                neuron.style.animation = `bounceIn 0.5s ease forwards ${index * 0.1 + 0.5}s`;
                
                // Add random pulse animation to some neurons
                if (index % 3 === 0) {
                    neuron.style.animation += `, pulse 3s infinite ${index * 0.2 + 1}s`;
                }
                
                // Add interactivity to neurons
                neuron.addEventListener('mouseover', function() {
                    this.style.fill = '#FF5722';
                    if (this.hasAttribute('r')) {
                        this.style.r = parseFloat(this.getAttribute('r')) * 1.5;
                    }
                    
                    // Find and highlight connected lines
                    if (this.hasAttribute('data-neuron')) {
                        const neuronId = this.getAttribute('data-neuron');
                        connections.forEach(connection => {
                            if (connection.hasAttribute('data-connection')) {
                                const connectionIds = connection.getAttribute('data-connection').split('-');
                                if (connectionIds.includes(neuronId)) {
                                    connection.style.stroke = '#FF5722';
                                    connection.style.strokeWidth = '3';
                                }
                            }
                        });
                    }
                });
                
                neuron.addEventListener('mouseout', function() {
                    this.style.fill = '';
                    if (this.hasAttribute('r')) {
                        this.style.r = this.getAttribute('r');
                    }
                    
                    // Reset connected lines
                    connections.forEach(connection => {
                        connection.style.stroke = '';
                        connection.style.strokeWidth = '';
                    });
                });
            });
            
            // Generic animation for other SVG elements
            const animatableElements = svgDoc.querySelectorAll('circle, rect, path, polygon, ellipse');
            animatableElements.forEach((el, index) => {
                if (!el.classList.contains('neurons') && !el.parentNode.classList.contains('neurons') && 
                    !el.classList.contains('connections') && !el.parentNode.classList.contains('connections')) {
                    el.style.animation = `fadeIn 0.5s ease forwards ${index * 0.05}s`;
                }
            });
        };
        
        // Setup event listeners for SVG images
        const setupSvgImageListeners = () => {
            const svgImages = document.querySelectorAll('img[src$=".svg"]');
            svgImages.forEach(img => {
                if (img.complete) {
                    setTimeout(() => animateSvgElements(img), 500);
                } else {
                    img.addEventListener('load', function() {
                        setTimeout(() => animateSvgElements(img), 500);
                    });
                }
            });
        };
        
        // Setup animations for inline SVGs
        const setupInlineSvgAnimations = () => {
            const inlineSvgs = document.querySelectorAll('svg');
            inlineSvgs.forEach(svg => {
                animateSvgElements(svg);
            });
        };
        
        // Run both setup functions
        setupSvgImageListeners();
        setupInlineSvgAnimations();
        
        // Re-run on page events that might load new SVGs
        document.addEventListener('DOMContentLoaded', () => {
            setupSvgImageListeners();
            setupInlineSvgAnimations();
        });
        
        window.addEventListener('load', () => {
            setupSvgImageListeners();
            setupInlineSvgAnimations();
        });
    };
    
    // Scroll animations using Intersection Observer
    const animateElements = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Feature cards
                if (entry.target.classList.contains('feature-card')) {
                    entry.target.style.animation = `slideInUp 0.6s ease forwards ${entry.target.dataset.delay || '0s'}`;
                }
                // Steps
                else if (entry.target.classList.contains('step')) {
                    entry.target.style.animation = `slideInLeft 0.6s ease forwards ${entry.target.dataset.delay || '0s'}`;
                }
                // Testimonial cards
                else if (entry.target.classList.contains('testimonial-card')) {
                    entry.target.style.animation = `slideInUp 0.6s ease forwards ${entry.target.dataset.delay || '0s'}`;
                }
                // Pricing cards
                else if (entry.target.classList.contains('pricing-card')) {
                    entry.target.style.animation = `slideInUp 0.6s ease forwards ${entry.target.dataset.delay || '0s'}`;
                }
                // Any element with animate-on-scroll class
                else if (entry.target.classList.contains('animate-on-scroll')) {
                    entry.target.classList.add('animate');
                }
                
                observer.unobserve(entry.target);
            }
        });
    };
    
    // Initialize all functionality
    setupThemeToggle();
    setupSvgAnimations();
    
    const observer = new IntersectionObserver(animateElements, {
        root: null,
        threshold: 0.1
    });
    
    // Observe all elements that should be animated
    document.querySelectorAll('.feature-card, .step, .testimonial-card, .pricing-card, .animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
    
    // Set animation delays based on index
    document.querySelectorAll('.feature-card').forEach((card, index) => {
        card.dataset.delay = `${0.1 + (index * 0.2)}s`;
    });
    
    document.querySelectorAll('.step').forEach((step, index) => {
        step.dataset.delay = `${0.1 + (index * 0.2)}s`;
    });
    
    document.querySelectorAll('.testimonial-card').forEach((card, index) => {
        card.dataset.delay = `${0.1 + (index * 0.2)}s`;
    });
    
    document.querySelectorAll('.pricing-card').forEach((card, index) => {
        card.dataset.delay = `${0.1 + (index * 0.2)}s`;
    });
    
    // Add animated class to all elements with animation classes
    document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right').forEach(el => {
        el.classList.add('animated');
    });
    
    // Multi-step form functionality
    const multiStepForm = document.getElementById('hiringForm');
    
    if (multiStepForm) {
        const formSteps = multiStepForm.querySelectorAll('.form-step');
        const nextButtons = multiStepForm.querySelectorAll('.next-step');
        const prevButtons = multiStepForm.querySelectorAll('.prev-step');
        const formSuccess = multiStepForm.querySelector('.form-success');
        
        // Next step buttons
        nextButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentStep = button.closest('.form-step');
                const currentStepNum = parseInt(currentStep.dataset.step);
                const nextStepNum = currentStepNum + 1;
                const nextStep = multiStepForm.querySelector(`.form-step[data-step="${nextStepNum}"]`);
                
                // Validate current step (basic validation)
                const requiredFields = currentStep.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                    } else {
                        field.classList.remove('error');
                    }
                });
                
                if (isValid && nextStep) {
                    currentStep.style.display = 'none';
                    nextStep.style.display = 'block';
                    
                    // Scroll to top of form
                    multiStepForm.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
        
        // Previous step buttons
        prevButtons.forEach(button => {
            button.addEventListener('click', () => {
                const currentStep = button.closest('.form-step');
                const currentStepNum = parseInt(currentStep.dataset.step);
                const prevStepNum = currentStepNum - 1;
                const prevStep = multiStepForm.querySelector(`.form-step[data-step="${prevStepNum}"]`);
                
                if (prevStep) {
                    currentStep.style.display = 'none';
                    prevStep.style.display = 'block';
                }
            });
        });
        
        // Form submission
        multiStepForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success message
            formSteps.forEach(step => {
                step.style.display = 'none';
            });
            
            formSuccess.style.display = 'block';
            
            // Reset form after submission (for demo purposes)
            // In real implementation, you would send data to the server
            setTimeout(() => {
                multiStepForm.reset();
            }, 1000);
        });
        
        // New request button in success message
        const newRequestButton = multiStepForm.querySelector('.new-request');
        if (newRequestButton) {
            newRequestButton.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Reset form and show first step
                multiStepForm.reset();
                formSuccess.style.display = 'none';
                formSteps[0].style.display = 'block';
            });
        }
    }
    
    // Demo modal
    const demoLinks = document.querySelectorAll('.demo-link, a[href="#demo"]');
    const demoModal = document.getElementById('demo');
    const closeModal = document.querySelector('.close-modal');
    
    if (demoModal) {
        demoLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                demoModal.style.display = 'block';
                document.body.style.overflow = 'hidden';
            });
        });
        
        closeModal.addEventListener('click', () => {
            demoModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
        
        window.addEventListener('click', (e) => {
            if (e.target === demoModal) {
                demoModal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
        
        // Demo form submission
        const demoForm = document.getElementById('demoForm');
        demoForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Show success message (you can customize this)
            const formContent = demoForm.innerHTML;
            demoForm.innerHTML = `
                <div class="success-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <h3>Demo Scheduled!</h3>
                <p>Thanks for scheduling a demo with us. A confirmation email has been sent to your inbox.</p>
                <button type="button" class="btn btn-primary close-demo-success">Close</button>
            `;
            
            // Close button for success message
            const closeSuccessButton = demoForm.querySelector('.close-demo-success');
            closeSuccessButton.addEventListener('click', () => {
                demoModal.style.display = 'none';
                document.body.style.overflow = 'auto';
                
                // Reset form after a delay
                setTimeout(() => {
                    demoForm.innerHTML = formContent;
                }, 500);
            });
        });
    }
    
    // Cookie consent
    const cookieConsent = document.querySelector('.cookie-consent');
    const acceptCookies = document.querySelector('.accept-cookies');
    
    if (cookieConsent && acceptCookies) {
        // Check if user has already accepted cookies
        if (!localStorage.getItem('cookiesAccepted')) {
            // Show after 2 seconds
            setTimeout(() => {
                cookieConsent.style.display = 'flex';
            }, 2000);
        } else {
            cookieConsent.style.display = 'none';
        }
        
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('cookiesAccepted', 'true');
            cookieConsent.style.animation = 'slideInUp 0.5s reverse forwards';
            
            setTimeout(() => {
                cookieConsent.style.display = 'none';
            }, 500);
        });
    }
    
    // Scroll progress bar
    const createScrollProgressBar = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);
        
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollProgress = (scrollTop / scrollHeight) * 100;
            
            progressBar.style.width = `${scrollProgress}%`;
        });
    };
    
    createScrollProgressBar();
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                mobileMenuToggle.classList.remove('active');
            }
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement && targetId !== '#demo') {
                const headerHeight = document.querySelector('.site-header').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.padding = '10px 0';
            header.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.padding = '15px 0';
            header.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
        }
    });
    
    // Location input autocomplete (simple example)
    const locationInput = document.getElementById('location');
    
    if (locationInput) {
        // Sample list of popular locations
        const popularLocations = [
            'New York, NY', 
            'San Francisco, CA',
            'Austin, TX',
            'Seattle, WA',
            'Boston, MA',
            'Chicago, IL',
            'Los Angeles, CA',
            'Remote',
            'Hybrid - New York, NY',
            'Hybrid - San Francisco, CA',
            'Toronto, Canada',
            'London, UK',
            'Berlin, Germany',
            'Amsterdam, Netherlands',
            'Sydney, Australia'
        ];
        
        // Create and append suggestions container
        const suggestionsContainer = document.createElement('div');
        suggestionsContainer.className = 'location-suggestions';
        suggestionsContainer.style.display = 'none';
        suggestionsContainer.style.position = 'absolute';
        suggestionsContainer.style.backgroundColor = 'white';
        suggestionsContainer.style.border = '1px solid #ddd';
        suggestionsContainer.style.borderRadius = '4px';
        suggestionsContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
        suggestionsContainer.style.zIndex = '100';
        suggestionsContainer.style.maxHeight = '200px';
        suggestionsContainer.style.overflowY = 'auto';
        suggestionsContainer.style.width = '100%';
        
        locationInput.parentNode.style.position = 'relative';
        locationInput.parentNode.appendChild(suggestionsContainer);
        
        locationInput.addEventListener('input', () => {
            const value = locationInput.value.toLowerCase();
            suggestionsContainer.innerHTML = '';
            
            if (value.length > 0) {
                const matches = popularLocations.filter(location => 
                    location.toLowerCase().includes(value)
                );
                
                if (matches.length > 0) {
                    matches.forEach(match => {
                        const suggestionItem = document.createElement('div');
                        suggestionItem.className = 'suggestion-item';
                        suggestionItem.textContent = match;
                        suggestionItem.style.padding = '10px';
                        suggestionItem.style.cursor = 'pointer';
                        suggestionItem.style.transition = 'background-color 0.3s';
                        
                        suggestionItem.addEventListener('mouseenter', () => {
                            suggestionItem.style.backgroundColor = '#f5f5f5';
                        });
                        
                        suggestionItem.addEventListener('mouseleave', () => {
                            suggestionItem.style.backgroundColor = 'transparent';
                        });
                        
                        suggestionItem.addEventListener('click', () => {
                            locationInput.value = match;
                            suggestionsContainer.style.display = 'none';
                        });
                        
                        suggestionsContainer.appendChild(suggestionItem);
                    });
                    
                    suggestionsContainer.style.display = 'block';
                } else {
                    suggestionsContainer.style.display = 'none';
                }
            } else {
                suggestionsContainer.style.display = 'none';
            }
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== locationInput && e.target !== suggestionsContainer) {
                suggestionsContainer.style.display = 'none';
            }
        });
    }
    
    // Enhanced client logos carousel
    const enhanceClientLogos = () => {
        const carouselContainer = document.querySelector('.clients-carousel-container');
        if (!carouselContainer) return;
        
        const trackOne = document.querySelector('.track-one');
        const trackTwo = document.querySelector('.track-two');
        const logoItems = document.querySelectorAll('.logo-item');
        
        // Pause animation on hover
        carouselContainer.addEventListener('mouseenter', () => {
            trackOne.style.animationPlayState = 'paused';
            trackTwo.style.animationPlayState = 'paused';
        });
        
        carouselContainer.addEventListener('mouseleave', () => {
            trackOne.style.animationPlayState = 'running';
            trackTwo.style.animationPlayState = 'running';
        });
        
        // Add random subtle animations to logos
        logoItems.forEach((logo, index) => {
            // Apply animations with random delays
            const randomDelay = (Math.random() * 5).toFixed(1);
            const randomDuration = (2 + Math.random() * 2).toFixed(1);
            
            // Alternate between different subtle animations
            if (index % 3 === 0) {
                logo.style.animation = `float ${randomDuration}s ease-in-out ${randomDelay}s infinite`;
            } else if (index % 3 === 1) {
                logo.style.animation = `pulse ${randomDuration}s ease-in-out ${randomDelay}s infinite`;
            }
            
            // Intersection Observer to activate animations when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        logo.classList.add('in-view');
                        observer.unobserve(logo);
                    }
                });
            }, { threshold: 0.1 });
            
            observer.observe(logo);
            
            // Show company name on hover
            const companyName = logo.getAttribute('data-company');
            if (companyName) {
                const tooltip = document.createElement('div');
                tooltip.className = 'company-tooltip';
                tooltip.innerHTML = companyName;
                tooltip.style.position = 'absolute';
                tooltip.style.top = '-30px';
                tooltip.style.left = '50%';
                tooltip.style.transform = 'translateX(-50%)';
                tooltip.style.backgroundColor = 'var(--primary-color)';
                tooltip.style.color = 'white';
                tooltip.style.padding = '5px 10px';
                tooltip.style.borderRadius = '4px';
                tooltip.style.fontSize = '0.8rem';
                tooltip.style.opacity = '0';
                tooltip.style.transition = 'opacity 0.3s ease';
                tooltip.style.pointerEvents = 'none';
                tooltip.style.zIndex = '3';
                
                logo.appendChild(tooltip);
                
                logo.addEventListener('mouseenter', () => {
                    tooltip.style.opacity = '1';
                });
                
                logo.addEventListener('mouseleave', () => {
                    tooltip.style.opacity = '0';
                });
            }
        });
        
        // Add interactive easter egg - click 3 logos to reveal a message
        let clickedLogos = 0;
        const easterEggMessage = document.createElement('div');
        easterEggMessage.className = 'easter-egg-message';
        easterEggMessage.innerHTML = '<strong>You found us!</strong> Use code "HIRE22SPECIAL" for 10% off your first month!';
        easterEggMessage.style.position = 'absolute';
        easterEggMessage.style.bottom = '-50px';
        easterEggMessage.style.left = '50%';
        easterEggMessage.style.transform = 'translateX(-50%)';
        easterEggMessage.style.backgroundColor = 'var(--secondary-color)';
        easterEggMessage.style.color = 'white';
        easterEggMessage.style.padding = '10px 20px';
        easterEggMessage.style.borderRadius = '4px';
        easterEggMessage.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        easterEggMessage.style.opacity = '0';
        easterEggMessage.style.transition = 'all 0.3s ease';
        easterEggMessage.style.zIndex = '10';
        easterEggMessage.style.pointerEvents = 'none';
        
        carouselContainer.appendChild(easterEggMessage);
        
        logoItems.forEach(logo => {
            logo.addEventListener('click', () => {
                clickedLogos++;
                
                // Add a subtle click effect
                logo.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    logo.style.transform = '';
                }, 200);
                
                if (clickedLogos === 3) {
                    easterEggMessage.style.opacity = '1';
                    easterEggMessage.style.bottom = '10px';
                    
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        easterEggMessage.style.opacity = '0';
                        easterEggMessage.style.bottom = '-50px';
                        
                        // Reset counter after hiding
                        setTimeout(() => {
                            clickedLogos = 0;
                        }, 300);
                    }, 5000);
                }
            });
        });
    };
    
    // Call the enhanced client logos function
    enhanceClientLogos();

    // Create particle background for hero section
    const createParticles = () => {
        const particleContainer = document.getElementById('particles');
        if (!particleContainer) return;
        
        // Create particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size between 10px and 80px
            const size = 10 + Math.random() * 70;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random delay
            const delay = Math.random() * 5;
            particle.style.animationDelay = `${delay}s`;
            
            // Random duration between 10 and 25 seconds
            const duration = 10 + Math.random() * 15;
            particle.style.animationDuration = `${duration}s`;
            
            particleContainer.appendChild(particle);
        }
    };
    
    // Add 3D tilt effect to feature cards
    const addTiltEffectToCards = () => {
        const cards = document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card');
        
        cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const cardRect = card.getBoundingClientRect();
                const x = e.clientX - cardRect.left;
                const y = e.clientY - cardRect.top;
                
                const centerX = cardRect.width / 2;
                const centerY = cardRect.height / 2;
                
                const rotateY = (x - centerX) / 15;
                const rotateX = (centerY - y) / 15;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                setTimeout(() => {
                    card.style.transition = 'transform 0.5s ease';
                }, 100);
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.transition = 'transform 0.1s ease';
            });
        });
    };
    
    // Add text gradient animation to headings
    const animateTextGradients = () => {
        const headings = document.querySelectorAll('.section-heading');
        
        headings.forEach(heading => {
            heading.style.backgroundSize = '200% auto';
            heading.style.animation = 'textGradientFlow 4s linear infinite';
        });
    };
    
    // Enhance scroll animations with different entrance effects
    const enhanceScrollAnimations = () => {
        const animateItems = document.querySelectorAll('.feature-card, .step, .testimonial-card, .pricing-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const delay = parseFloat(element.dataset.delay || 0);
                    
                    let entranceEffect = '';
                    
                    // Apply different animations based on element type
                    if (element.classList.contains('feature-card')) {
                        entranceEffect = 'fadeInUp';
                    } else if (element.classList.contains('step')) {
                        entranceEffect = 'fadeInLeft';
                    } else if (element.classList.contains('testimonial-card')) {
                        entranceEffect = 'fadeInRight';
                    } else if (element.classList.contains('pricing-card')) {
                        entranceEffect = 'fadeInUp';
                    }
                    
                    // Add animation class
                    setTimeout(() => {
                        element.style.opacity = '1';
                        element.style.transform = 'translateY(0) translateX(0)';
                        element.classList.add(entranceEffect);
                    }, delay * 1000);
                    
                    observer.unobserve(element);
                }
            });
        }, {
            threshold: 0.1
        });
        
        animateItems.forEach(item => {
            observer.observe(item);
        });
    };
    
    // Add shine effect to buttons
    const addButtonShineEffect = () => {
        const buttons = document.querySelectorAll('.btn-primary');
        
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.overflow = 'hidden';
                
                const shine = document.createElement('span');
                shine.className = 'btn-shine';
                shine.style.position = 'absolute';
                shine.style.top = '-30px';
                shine.style.left = '0';
                shine.style.width = '100%';
                shine.style.height = '100px';
                shine.style.background = 'linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 100%)';
                shine.style.transform = 'rotate(45deg) translateX(-100%)';
                shine.style.animation = 'shineEffect 1s forwards';
                
                button.appendChild(shine);
                
                setTimeout(() => {
                    button.removeChild(shine);
                }, 1000);
            });
        });
    };
    
    // Add custom cursor effect for hero section
    const addCustomCursor = () => {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        cursor.style.position = 'fixed';
        cursor.style.width = '30px';
        cursor.style.height = '30px';
        cursor.style.borderRadius = '50%';
        cursor.style.border = '2px solid var(--primary-color)';
        cursor.style.pointerEvents = 'none';
        cursor.style.zIndex = '9999';
        cursor.style.transform = 'translate(-50%, -50%)';
        cursor.style.opacity = '0';
        cursor.style.transition = 'width 0.3s, height 0.3s, transform 0.1s, opacity 0.3s';
        
        document.body.appendChild(cursor);
        
        hero.addEventListener('mousemove', (e) => {
            cursor.style.opacity = '1';
            cursor.style.left = `${e.clientX}px`;
            cursor.style.top = `${e.clientY}px`;
        });
        
        hero.addEventListener('mouseleave', () => {
            cursor.style.opacity = '0';
        });
        
        // Scale cursor when hovering over buttons
        const buttons = hero.querySelectorAll('.btn');
        buttons.forEach(button => {
            button.addEventListener('mouseenter', () => {
                cursor.style.width = '50px';
                cursor.style.height = '50px';
                cursor.style.mixBlendMode = 'difference';
                cursor.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            
            button.addEventListener('mouseleave', () => {
                cursor.style.width = '30px';
                cursor.style.height = '30px';
                cursor.style.mixBlendMode = 'normal';
                cursor.style.background = 'transparent';
            });
        });
    };
    
    // Add bounce effect to feature icons
    const addIconBounceEffect = () => {
        const icons = document.querySelectorAll('.feature-icon i');
        
        icons.forEach(icon => {
            setInterval(() => {
                icon.classList.add('bounce');
                
                setTimeout(() => {
                    icon.classList.remove('bounce');
                }, 1000);
            }, 3000 + Math.random() * 2000); // Random interval between 3-5 seconds
        });
    };
    
    // Call all visual enhancement functions
    createParticles();
    addTiltEffectToCards();
    animateTextGradients();
    enhanceScrollAnimations();
    addButtonShineEffect();
    addCustomCursor();
    addIconBounceEffect();
    
    // Define additional animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes textGradientFlow {
            0% { background-position: 0 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0 50%; }
        }
        
        @keyframes shineEffect {
            100% { transform: rotate(45deg) translateX(100%); }
        }
        
        .bounce {
            animation: bounce 1s ease;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
        }
    `;
    document.head.appendChild(style);
}); 