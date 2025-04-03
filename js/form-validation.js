document.addEventListener('DOMContentLoaded', () => {
    // Get the hiring form
    const hiringForm = document.getElementById('hiringForm');
    
    if (!hiringForm) return;
    
    // Error styling
    const showError = (input, message) => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.add('error');
        
        // Create error message element if it doesn't exist
        let errorMessage = formGroup.querySelector('.error-message');
        if (!errorMessage) {
            errorMessage = document.createElement('span');
            errorMessage.className = 'error-message';
            errorMessage.style.color = '#ff3b30';
            errorMessage.style.fontSize = '0.8rem';
            errorMessage.style.marginTop = '5px';
            errorMessage.style.display = 'block';
            formGroup.appendChild(errorMessage);
        }
        
        errorMessage.textContent = message;
        input.setAttribute('aria-invalid', 'true');
    };
    
    const clearError = (input) => {
        const formGroup = input.closest('.form-group');
        formGroup.classList.remove('error');
        
        const errorMessage = formGroup.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.textContent = '';
        }
        
        input.setAttribute('aria-invalid', 'false');
    };
    
    // Validate individual inputs
    const validateRequired = (input) => {
        if (input.value.trim() === '') {
            showError(input, 'This field is required');
            return false;
        }
        clearError(input);
        return true;
    };
    
    const validateEmail = (input) => {
        if (input.value.trim() === '') {
            showError(input, 'Email is required');
            return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(input.value.trim())) {
            showError(input, 'Please enter a valid email address');
            return false;
        }
        
        clearError(input);
        return true;
    };
    
    const validatePhone = (input) => {
        if (input.value.trim() === '') {
            showError(input, 'Phone number is required');
            return false;
        }
        
        // Basic phone validation - allows various formats
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        if (!phoneRegex.test(input.value.trim())) {
            showError(input, 'Please enter a valid phone number');
            return false;
        }
        
        clearError(input);
        return true;
    };
    
    // Live validation on input/blur
    hiringForm.querySelectorAll('input, select, textarea').forEach(input => {
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required')) {
                validateRequired(input);
            }
            
            if (input.type === 'email') {
                validateEmail(input);
            }
            
            if (input.type === 'tel') {
                validatePhone(input);
            }
        });
        
        input.addEventListener('input', () => {
            if (input.classList.contains('error') || input.closest('.form-group').classList.contains('error')) {
                if (input.hasAttribute('required')) {
                    validateRequired(input);
                }
                
                if (input.type === 'email') {
                    validateEmail(input);
                }
                
                if (input.type === 'tel') {
                    validatePhone(input);
                }
            }
        });
    });
    
    // Validate a specific step
    const validateStep = (stepNumber) => {
        const step = hiringForm.querySelector(`.form-step[data-step="${stepNumber}"]`);
        let isValid = true;
        
        // Validate required fields
        step.querySelectorAll('[required]').forEach(input => {
            if (input.type === 'email') {
                if (!validateEmail(input)) {
                    isValid = false;
                }
            } else if (input.type === 'tel') {
                if (!validatePhone(input)) {
                    isValid = false;
                }
            } else if (!validateRequired(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    };
    
    // Next step buttons with validation
    hiringForm.querySelectorAll('.next-step').forEach(button => {
        button.addEventListener('click', (e) => {
            const currentStep = button.closest('.form-step');
            const currentStepNum = parseInt(currentStep.dataset.step);
            
            if (validateStep(currentStepNum)) {
                const nextStepNum = currentStepNum + 1;
                const nextStep = hiringForm.querySelector(`.form-step[data-step="${nextStepNum}"]`);
                
                if (nextStep) {
                    currentStep.style.display = 'none';
                    nextStep.style.display = 'block';
                    
                    // Scroll to top of form
                    hiringForm.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Focus the first invalid input
                const firstInvalid = currentStep.querySelector('[aria-invalid="true"]');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            }
        });
    });
    
    // Form submission with full validation
    hiringForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const finalStep = hiringForm.querySelector('.form-step:last-of-type');
        const finalStepNum = parseInt(finalStep.dataset.step);
        
        if (validateStep(finalStepNum)) {
            // Show success message
            hiringForm.querySelectorAll('.form-step').forEach(step => {
                step.style.display = 'none';
            });
            
            const formSuccess = hiringForm.querySelector('.form-success');
            formSuccess.style.display = 'block';
            
            // Here you would typically submit the form data to your backend
            console.log('Form submitted successfully');
            
            // Reset form after submission (for demo purposes)
            setTimeout(() => {
                hiringForm.reset();
            }, 1000);
        }
    });
    
    // Custom validation for specific fields
    
    // Skills field - ensure comma-separated list
    const skillsField = document.getElementById('skills');
    if (skillsField) {
        skillsField.addEventListener('blur', () => {
            if (skillsField.value.trim() !== '') {
                // Check if there are at least two skills (one comma)
                if (!skillsField.value.includes(',')) {
                    showError(skillsField, 'Please enter multiple skills separated by commas');
                } else {
                    clearError(skillsField);
                }
            }
        });
    }
    
    // Terms checkbox validation
    const termsCheckbox = document.getElementById('terms');
    if (termsCheckbox) {
        termsCheckbox.addEventListener('change', () => {
            if (!termsCheckbox.checked) {
                showError(termsCheckbox, 'You must agree to the terms and privacy policy');
            } else {
                clearError(termsCheckbox);
            }
        });
    }
    
    // Enhanced select validation with custom messages
    const departmentSelect = document.getElementById('department');
    if (departmentSelect) {
        departmentSelect.addEventListener('blur', () => {
            if (departmentSelect.value === '') {
                showError(departmentSelect, 'Please select a department');
            } else {
                clearError(departmentSelect);
            }
        });
    }
    
    const workTypeSelect = document.getElementById('workType');
    if (workTypeSelect) {
        workTypeSelect.addEventListener('blur', () => {
            if (workTypeSelect.value === '') {
                showError(workTypeSelect, 'Please select a work type');
            } else {
                clearError(workTypeSelect);
            }
        });
    }
    
    const experienceSelect = document.getElementById('experience');
    if (experienceSelect) {
        experienceSelect.addEventListener('blur', () => {
            if (experienceSelect.value === '') {
                showError(experienceSelect, 'Please select an experience range');
            } else {
                clearError(experienceSelect);
            }
        });
    }
    
    // Job description character counter
    const jobDescription = document.getElementById('jobDescription');
    if (jobDescription) {
        // Create character counter
        const counterElement = document.createElement('span');
        counterElement.className = 'char-counter';
        counterElement.style.fontSize = '0.8rem';
        counterElement.style.color = '#666';
        counterElement.style.float = 'right';
        counterElement.style.marginTop = '5px';
        
        jobDescription.parentNode.appendChild(counterElement);
        
        const updateCounter = () => {
            const currentLength = jobDescription.value.length;
            const minLength = 50;
            
            if (currentLength < minLength) {
                counterElement.style.color = '#ff3b30';
                counterElement.textContent = `${currentLength}/${minLength} characters (min ${minLength})`;
                if (jobDescription.hasAttribute('required')) {
                    showError(jobDescription, `Please enter at least ${minLength} characters`);
                }
            } else {
                counterElement.style.color = '#666';
                counterElement.textContent = `${currentLength} characters`;
                clearError(jobDescription);
            }
        };
        
        jobDescription.addEventListener('input', updateCounter);
        updateCounter(); // Initialize
    }
}); 