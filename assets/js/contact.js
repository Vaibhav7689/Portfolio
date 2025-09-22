// Contact form functionality
class ContactController {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.submitButton = null;
        this.formData = {};
        this.validationRules = {
            name: { required: true, minLength: 2 },
            email: { required: true, email: true },
            subject: { required: true, minLength: 5 },
            message: { required: true, minLength: 10 }
        };
        this.init();
    }

    init() {
        if (!this.form) return;
        
        this.submitButton = this.form.querySelector('button[type="submit"], .submit-btn');
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupRealTimeValidation();
        this.setupFormEnhancements();
        this.initializeFormAnimations();
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            // Add validation on blur
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            // Add real-time validation on input
            input.addEventListener('input', () => {
                this.clearFieldError(input);
                this.updateSubmitButtonState();
            });
            
            // Enhanced focus effects
            input.addEventListener('focus', () => {
                this.enhanceFocusEffect(input);
            });
        });
    }

    validateField(field) {
        const fieldName = field.name;
        const value = field.value.trim();
        const rules = this.validationRules[fieldName];
        
        if (!rules) return true;
        
        // Clear previous errors
        this.clearFieldError(field);
        
        // Required field validation
        if (rules.required && !value) {
            this.showFieldError(field, `${this.capitalizeFirst(fieldName)} is required`);
            return false;
        }
        
        // Minimum length validation
        if (rules.minLength && value.length < rules.minLength) {
            this.showFieldError(field, `${this.capitalizeFirst(fieldName)} must be at least ${rules.minLength} characters`);
            return false;
        }
        
        // Email validation
        if (rules.email && value && !this.isValidEmail(value)) {
            this.showFieldError(field, 'Please enter a valid email address');
            return false;
        }
        
        // Show success state
        this.showFieldSuccess(field);
        return true;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        
        let errorElement = field.parentNode.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'error-message';
            errorElement.style.cssText = `
                color: #ef4444;
                font-size: 0.875rem;
                margin-top: 0.5rem;
                animation: fadeInUp 0.3s ease;
            `;
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        
        // Add shake animation
        field.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    showFieldSuccess(field) {
        field.classList.remove('error');
        field.classList.add('success');
        
        // Remove error message if exists
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        // Add success icon
        let successIcon = field.parentNode.querySelector('.success-icon');
        if (!successIcon) {
            successIcon = document.createElement('i');
            successIcon.className = 'fas fa-check success-icon';
            successIcon.style.cssText = `
                position: absolute;
                right: 15px;
                top: 50%;
                transform: translateY(-50%);
                color: #10b981;
                opacity: 0;
                animation: fadeIn 0.3s ease forwards;
            `;
            field.parentNode.style.position = 'relative';
            field.parentNode.appendChild(successIcon);
        }
    }

    clearFieldError(field) {
        field.classList.remove('error', 'success');
        
        const errorElement = field.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        const successIcon = field.parentNode.querySelector('.success-icon');
        if (successIcon) {
            successIcon.remove();
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!this.validateForm()) {
                this.showFormError('Please fix the errors above and try again.');
                return;
            }
            
            await this.submitForm();
        });
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    async submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Show loading state
        this.setSubmitButtonLoading(true);
        
        try {
            // Simulate API call - replace with your actual endpoint
            const response = await this.sendContactForm(data);
            
            if (response.success) {
                this.showSuccessMessage();
                this.form.reset();
                this.clearAllFieldStates();
            } else {
                throw new Error(response.message || 'Failed to send message');
            }
        } catch (error) {
            this.showFormError('Failed to send message. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            this.setSubmitButtonLoading(false);
        }
    }

    async sendContactForm(data) {
        // Simulate API call with delay
        return new Promise((resolve) => {
            setTimeout(() => {
                // Simulate success response
                resolve({ success: true, message: 'Message sent successfully!' });
            }, 2000);
        });
        
        // Uncomment and modify this for real API integration:
        /*
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        return await response.json();
        */
    }

    setSubmitButtonLoading(loading) {
        if (!this.submitButton) return;
        
        const originalText = this.submitButton.getAttribute('data-original-text') || this.submitButton.innerHTML;
        
        if (loading) {
            this.submitButton.setAttribute('data-original-text', originalText);
            this.submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            this.submitButton.disabled = true;
            this.submitButton.style.opacity = '0.7';
        } else {
            this.submitButton.innerHTML = originalText;
            this.submitButton.disabled = false;
            this.submitButton.style.opacity = '1';
        }
    }

    showSuccessMessage() {
        const successMessage = document.createElement('div');
        successMessage.className = 'form-success-message';
        successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Message Sent Successfully!</h3>
            <p>Thank you for reaching out. I'll get back to you soon.</p>
        `;
        successMessage.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 2rem;
            border-radius: 15px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            text-align: center;
            z-index: 10000;
            animation: bounceIn 0.5s ease;
            max-width: 400px;
            border: 2px solid #10b981;
        `;
        
        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
            animation: fadeIn 0.3s ease;
        `;
        
        document.body.appendChild(backdrop);
        document.body.appendChild(successMessage);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            backdrop.style.animation = 'fadeOut 0.3s ease';
            successMessage.style.animation = 'bounceOut 0.5s ease';
            
            setTimeout(() => {
                document.body.removeChild(backdrop);
                document.body.removeChild(successMessage);
            }, 500);
        }, 3000);
        
        // Close on click
        backdrop.addEventListener('click', () => {
            document.body.removeChild(backdrop);
            document.body.removeChild(successMessage);
        });
    }

    showFormError(message) {
        let errorContainer = this.form.querySelector('.form-error-message');
        
        if (!errorContainer) {
            errorContainer = document.createElement('div');
            errorContainer.className = 'form-error-message';
            errorContainer.style.cssText = `
                background: #fef2f2;
                color: #dc2626;
                padding: 1rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                border: 1px solid #fecaca;
                animation: shake 0.5s ease;
            `;
            this.form.insertBefore(errorContainer, this.form.firstChild);
        }
        
        errorContainer.innerHTML = `<i class="fas fa-exclamation-triangle"></i> ${message}`;
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (errorContainer.parentNode) {
                errorContainer.remove();
            }
        }, 5000);
    }

    setupRealTimeValidation() {
        // Character counter for textarea
        const messageField = this.form.querySelector('textarea[name="message"]');
        if (messageField) {
            this.addCharacterCounter(messageField);
        }
        
        // Email format validation
        const emailField = this.form.querySelector('input[name="email"]');
        if (emailField) {
            this.addEmailValidationHelpers(emailField);
        }
    }

    addCharacterCounter(textarea) {
        const minLength = this.validationRules.message.minLength;
        const maxLength = 500; // Set your desired max length
        
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.875rem;
            color: var(--text-light);
            margin-top: 0.5rem;
        `;
        
        textarea.parentNode.appendChild(counter);
        
        const updateCounter = () => {
            const length = textarea.value.length;
            counter.textContent = `${length}/${maxLength} characters`;
            
            if (length < minLength) {
                counter.style.color = '#ef4444';
            } else if (length > maxLength * 0.9) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#10b981';
            }
        };
        
        textarea.addEventListener('input', updateCounter);
        updateCounter(); // Initial update
    }

    addEmailValidationHelpers(emailField) {
        let suggestionContainer = null;
        
        emailField.addEventListener('input', () => {
            const email = emailField.value.trim();
            
            // Remove existing suggestions
            if (suggestionContainer) {
                suggestionContainer.remove();
                suggestionContainer = null;
            }
            
            // Check for common email typos and suggest corrections
            const suggestion = this.getEmailSuggestion(email);
            if (suggestion) {
                suggestionContainer = document.createElement('div');
                suggestionContainer.className = 'email-suggestion';
                suggestionContainer.innerHTML = `
                    Did you mean <strong>${suggestion}</strong>? 
                    <button type="button" class="suggestion-btn">Use this</button>
                `;
                suggestionContainer.style.cssText = `
                    background: #fef3c7;
                    color: #92400e;
                    padding: 0.5rem;
                    border-radius: 5px;
                    font-size: 0.875rem;
                    margin-top: 0.5rem;
                    animation: slideDown 0.3s ease;
                `;
                
                const useButton = suggestionContainer.querySelector('.suggestion-btn');
                useButton.style.cssText = `
                    background: none;
                    border: none;
                    color: #1d4ed8;
                    text-decoration: underline;
                    cursor: pointer;
                    font-weight: 600;
                    margin-left: 0.5rem;
                `;
                
                useButton.addEventListener('click', () => {
                    emailField.value = suggestion;
                    suggestionContainer.remove();
                    this.validateField(emailField);
                });
                
                emailField.parentNode.appendChild(suggestionContainer);
            }
        });
    }

    getEmailSuggestion(email) {
        const commonDomains = {
            'gmail.co': 'gmail.com',
            'gmail.con': 'gmail.com',
            'gmial.com': 'gmail.com',
            'yahoo.co': 'yahoo.com',
            'yahoo.con': 'yahoo.com',
            'hotmail.co': 'hotmail.com',
            'hotmail.con': 'hotmail.com'
        };
        
        const parts = email.split('@');
        if (parts.length !== 2) return null;
        
        const domain = parts[1];
        const suggestedDomain = commonDomains[domain];
        
        return suggestedDomain ? `${parts[0]}@${suggestedDomain}` : null;
    }

    setupFormEnhancements() {
        // Add floating labels effect
        const formGroups = this.form.querySelectorAll('.form-group');
        
        formGroups.forEach(group => {
            const input = group.querySelector('input, textarea');
            const label = group.querySelector('label');
            
            if (input && label) {
                this.addFloatingLabelEffect(input, label);
            }
        });
        
        // Add form progress indicator
        this.addFormProgressIndicator();
    }

    addFloatingLabelEffect(input, label) {
        const wrapper = document.createElement('div');
        wrapper.className = 'floating-label-wrapper';
        wrapper.style.position = 'relative';
        
        input.parentNode.insertBefore(wrapper, input);
        wrapper.appendChild(label);
        wrapper.appendChild(input);
        
        label.style.cssText = `
            position: absolute;
            left: 18px;
            top: 50%;
            transform: translateY(-50%);
            background: white;
            padding: 0 5px;
            transition: all 0.3s ease;
            pointer-events: none;
            color: var(--text-light);
        `;
        
        const updateLabelPosition = () => {
            if (input.value || input === document.activeElement) {
                label.style.top = '0';
                label.style.fontSize = '0.875rem';
                label.style.color = 'var(--primary-color)';
                label.style.fontWeight = '600';
            } else {
                label.style.top = '50%';
                label.style.fontSize = '1rem';
                label.style.color = 'var(--text-light)';
                label.style.fontWeight = '400';
            }
        };
        
        input.addEventListener('focus', updateLabelPosition);
        input.addEventListener('blur', updateLabelPosition);
        input.addEventListener('input', updateLabelPosition);
        
        updateLabelPosition(); // Initial position
    }

    addFormProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'form-progress';
        progressBar.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <div class="progress-text">Form completion: 0%</div>
        `;
        progressBar.style.cssText = `
            margin-bottom: 2rem;
            padding: 1rem;
            background: var(--bg-secondary);
            border-radius: 8px;
        `;
        
        this.form.insertBefore(progressBar, this.form.firstChild);
        
        const updateProgress = () => {
            const inputs = this.form.querySelectorAll('input[required], textarea[required]');
            const filledInputs = Array.from(inputs).filter(input => input.value.trim());
            const progress = (filledInputs.length / inputs.length) * 100;
            
            const progressFill = progressBar.querySelector('.progress-fill');
            const progressText = progressBar.querySelector('.progress-text');
            
            progressFill.style.width = progress + '%';
            progressText.textContent = `Form completion: ${Math.round(progress)}%`;
        };
        
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', updateProgress);
        });
    }

    initializeFormAnimations() {
        // Stagger animation for form groups
        const formGroups = this.form.querySelectorAll('.form-group');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = Array.from(formGroups).indexOf(entry.target);
                    setTimeout(() => {
                        entry.target.style.animation = 'slideInUp 0.5s ease forwards';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        formGroups.forEach(group => {
            group.style.opacity = '0';
            group.style.transform = 'translateY(20px)';
            observer.observe(group);
        });
    }

    enhanceFocusEffect(input) {
        input.parentNode.style.position = 'relative';
        
        // Add focus ring effect
        const focusRing = document.createElement('div');
        focusRing.className = 'focus-ring';
        focusRing.style.cssText = `
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border: 2px solid var(--primary-color);
            border-radius: 12px;
            opacity: 0;
            animation: focusRing 0.3s ease forwards;
            pointer-events: none;
        `;
        
        input.parentNode.appendChild(focusRing);
        
        input.addEventListener('blur', () => {
            setTimeout(() => {
                if (focusRing.parentNode) {
                    focusRing.remove();
                }
            }, 300);
        });
    }

    updateSubmitButtonState() {
        const inputs = this.form.querySelectorAll('input[required], textarea[required]');
        const allFilled = Array.from(inputs).every(input => input.value.trim());
        
        if (this.submitButton) {
            this.submitButton.disabled = !allFilled;
            this.submitButton.style.opacity = allFilled ? '1' : '0.6';
        }
    }

    clearAllFieldStates() {
        const inputs = this.form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            this.clearFieldError(input);
        });
    }

    // Utility methods
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    capitalizeFirst(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
}

// Initialize contact form when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('contact-form')) {
        const contactController = new ContactController();
        window.contactController = contactController;
    }
});

// Add additional CSS for form animations
const contactStyle = document.createElement('style');
contactStyle.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes bounceIn {
        0% { transform: translate(-50%, -50%) scale(0.3); }
        50% { transform: translate(-50%, -50%) scale(1.1); }
        100% { transform: translate(-50%, -50%) scale(1); }
    }
    
    @keyframes bounceOut {
        0% { transform: translate(-50%, -50%) scale(1); }
        100% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
    }
    
    @keyframes slideDown {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes slideInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes focusRing {
        from { opacity: 0; transform: scale(1.1); }
        to { opacity: 1; transform: scale(1); }
    }
    
    .form-group input:focus,
    .form-group textarea:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
    
    .form-group input.error,
    .form-group textarea.error {
        border-color: #ef4444;
        background: #fef2f2;
    }
    
    .form-group input.success,
    .form-group textarea.success {
        border-color: #10b981;
        background: #f0fdf4;
    }
    
    .progress-bar {
        width: 100%;
        height: 8px;
        background: #e2e8f0;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 0.5rem;
    }
    
    .progress-fill {
        height: 100%;
        background: var(--bg-gradient);
        transition: width 0.5s ease;
        border-radius: 4px;
    }
    
    .progress-text {
        font-size: 0.875rem;
        color: var(--text-secondary);
        text-align: center;
    }
`;
document.head.appendChild(contactStyle);

window.ContactController = ContactController;
