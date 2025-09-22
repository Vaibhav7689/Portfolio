// Animation utilities and effects
class AnimationController {
    constructor() {
        this.observers = new Map();
        this.animationQueue = [];
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        this.initializeAOS();
        this.setupScrollAnimations();
        this.initializeCounters();
        this.setupParallaxEffects();
        this.initializeTypewriter();
        this.setupHoverEffects();
        this.initializeProgressBars();
        this.setupMorphingShapes();
        
        this.isInitialized = true;
    }

    // Initialize AOS (Animate On Scroll) library alternative
    initializeAOS() {
        const defaultOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.getAttribute('data-aos');
                    const delay = parseInt(element.getAttribute('data-aos-delay')) || 0;
                    const duration = parseInt(element.getAttribute('data-aos-duration')) || 800;
                    
                    setTimeout(() => {
                        this.triggerAnimation(element, animationType, duration);
                    }, delay);
                    
                    observer.unobserve(element);
                }
            });
        }, defaultOptions);

        // Observe all elements with data-aos attribute
        document.querySelectorAll('[data-aos]').forEach(el => {
            // Set initial state
            el.style.opacity = '0';
            observer.observe(el);
        });

        this.observers.set('aos', observer);
    }

    triggerAnimation(element, animationType, duration = 800) {
        element.classList.add('aos-animate');
        
        const animations = {
            'fade-up': () => {
                element.style.transform = 'translateY(30px)';
                element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });
            },
            'fade-down': () => {
                element.style.transform = 'translateY(-30px)';
                element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });
            },
            'fade-left': () => {
                element.style.transform = 'translateX(-30px)';
                element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                });
            },
            'fade-right': () => {
                element.style.transform = 'translateX(30px)';
                element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                });
            },
            'zoom-in': () => {
                element.style.transform = 'scale(0.8)';
                element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                });
            },
            'zoom-out': () => {
                element.style.transform = 'scale(1.2)';
                element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                });
            },
            'rotate-in': () => {
                element.style.transform = 'rotate(-45deg) scale(0.8)';
                element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'rotate(0deg) scale(1)';
                });
            },
            'slide-up': () => {
                element.style.transform = 'translateY(50px)';
                element.style.transition = `all ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                requestAnimationFrame(() => {
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                });
            }
        };

        const animation = animations[animationType] || animations['fade-up'];
        animation();

        // Add stagger effect for child elements
        const staggerItems = element.querySelectorAll('.stagger-item');
        staggerItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }

    // Setup scroll-based animations
    setupScrollAnimations() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScrollAnimations();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    handleScrollAnimations() {
        const scrollY = window.pageYOffset;
        const windowHeight = window.innerHeight;
        
        // Parallax effects
        document.querySelectorAll('[data-parallax]').forEach(element => {
            const speed = parseFloat(element.getAttribute('data-parallax')) || 0.5;
            const yPos = -(scrollY * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });

        // Scale elements based on scroll
        document.querySelectorAll('[data-scroll-scale]').forEach(element => {
            const rect = element.getBoundingClientRect();
            const elementTop = rect.top;
            const elementHeight = rect.height;
            
            if (elementTop < windowHeight && elementTop + elementHeight > 0) {
                const progress = 1 - (elementTop / windowHeight);
                const scale = Math.max(0.8, Math.min(1, 0.8 + (progress * 0.2)));
                element.style.transform = `scale(${scale})`;
            }
        });

        // Rotate elements based on scroll
        document.querySelectorAll('[data-scroll-rotate]').forEach(element => {
            const speed = parseFloat(element.getAttribute('data-scroll-rotate')) || 1;
            const rotation = scrollY * speed * 0.1;
            element.style.transform = `rotate(${rotation}deg)`;
        });
    }

    // Initialize counter animations
    initializeCounters() {
        const counters = document.querySelectorAll('[data-counter]');
        
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    this.animateCounter(counter);
                    counterObserver.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.getAttribute('data-counter'));
        const duration = parseInt(element.getAttribute('data-duration')) || 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                element.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
            }
        };

        updateCounter();
    }

    // Setup parallax effects
    setupParallaxEffects() {
        const parallaxElements = document.querySelectorAll('.parallax');
        
        if (parallaxElements.length === 0) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            
            parallaxElements.forEach(element => {
                const speed = parseFloat(element.dataset.speed) || 0.5;
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // Initialize typewriter effect
    initializeTypewriter() {
        const typewriters = document.querySelectorAll('[data-typewriter]');
        
        typewriters.forEach(element => {
            const text = element.getAttribute('data-typewriter');
            const speed = parseInt(element.getAttribute('data-speed')) || 100;
            const delay = parseInt(element.getAttribute('data-delay')) || 0;
            
            setTimeout(() => {
                this.typeWriter(element, text, speed);
            }, delay);
        });
    }

    typeWriter(element, text, speed) {
        let i = 0;
        element.textContent = '';
        
        const type = () => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                // Add blinking cursor
                this.addBlinkingCursor(element);
            }
        };

        type();
    }

    addBlinkingCursor(element) {
        const cursor = document.createElement('span');
        cursor.textContent = '|';
        cursor.className = 'blinking-cursor';
        cursor.style.cssText = `
            animation: blink 1s infinite;
            color: var(--primary-color);
            font-weight: bold;
        `;
        
        element.appendChild(cursor);

        // Add CSS animation if not exists
        if (!document.getElementById('blink-style')) {
            const style = document.createElement('style');
            style.id = 'blink-style';
            style.textContent = `
                @keyframes blink {
                    0%, 50% { opacity: 1; }
                    51%, 100% { opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Setup hover effects
    setupHoverEffects() {
        // Magnetic effect for buttons
        document.querySelectorAll('.magnetic-btn').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });

        // Tilt effect for cards
        document.querySelectorAll('.tilt-card').forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / centerY * -10;
                const rotateY = (x - centerX) / centerX * 10;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }

    // Initialize progress bars
    initializeProgressBars() {
        const progressBars = document.querySelectorAll('[data-progress]');
        
        const progressObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    this.animateProgressBar(bar);
                    progressObserver.unobserve(bar);
                }
            });
        }, { threshold: 0.5 });

        progressBars.forEach(bar => {
            progressObserver.observe(bar);
        });
    }

    animateProgressBar(element) {
        const progress = element.getAttribute('data-progress');
        const duration = parseInt(element.getAttribute('data-duration')) || 2000;
        
        element.style.width = '0%';
        element.style.transition = `width ${duration}ms ease-out`;
        
        requestAnimationFrame(() => {
            element.style.width = progress + '%';
        });
    }

    // Setup morphing shapes
    setupMorphingShapes() {
        const morphShapes = document.querySelectorAll('.morph-shape');
        
        morphShapes.forEach(shape => {
            let morphInterval;
            
            const startMorphing = () => {
                morphInterval = setInterval(() => {
                    const randomScale = 0.8 + Math.random() * 0.4;
                    const randomRotate = Math.random() * 360;
                    const randomSkew = -10 + Math.random() * 20;
                    
                    shape.style.transform = `scale(${randomScale}) rotate(${randomRotate}deg) skewX(${randomSkew}deg)`;
                }, 3000);
            };
            
            const stopMorphing = () => {
                clearInterval(morphInterval);
                shape.style.transform = 'scale(1) rotate(0deg) skewX(0deg)';
            };
            
            shape.addEventListener('mouseenter', startMorphing);
            shape.addEventListener('mouseleave', stopMorphing);
        });
    }

    // Text reveal animation
    revealText(element, options = {}) {
        const {
            delay = 0,
            duration = 50,
            animation = 'fade'
        } = options;
        
        const text = element.textContent;
        const chars = text.split('');
        
        element.textContent = '';
        element.style.opacity = '1';
        
        chars.forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.opacity = '0';
            
            if (animation === 'fade') {
                span.style.transition = 'opacity 0.3s ease';
            } else if (animation === 'slide') {
                span.style.transform = 'translateY(20px)';
                span.style.transition = 'all 0.3s ease';
            }
            
            element.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
                if (animation === 'slide') {
                    span.style.transform = 'translateY(0)';
                }
            }, delay + (index * duration));
        });
    }

    // Scroll-triggered text reveal
    initializeTextReveal() {
        const revealElements = document.querySelectorAll('.reveal-text');
        
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const options = {
                        delay: parseInt(entry.target.getAttribute('data-reveal-delay')) || 0,
                        duration: parseInt(entry.target.getAttribute('data-reveal-duration')) || 50,
                        animation: entry.target.getAttribute('data-reveal-animation') || 'fade'
                    };
                    
                    this.revealText(entry.target, options);
                    textObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealElements.forEach(el => textObserver.observe(el));
    }

    // Stagger animations for lists
    staggerAnimation(elements, delay = 100) {
        elements.forEach((element, index) => {
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * delay);
        });
    }

    // Page transition animation
    pageTransition(callback) {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: var(--bg-gradient);
            z-index: 9999;
            transform: translateY(-100%);
            transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        `;
        
        document.body.appendChild(overlay);
        
        requestAnimationFrame(() => {
            overlay.style.transform = 'translateY(0)';
        });
        
        setTimeout(() => {
            if (callback) callback();
            
            setTimeout(() => {
                overlay.style.transform = 'translateY(100%)';
                setTimeout(() => {
                    document.body.removeChild(overlay);
                }, 500);
            }, 300);
        }, 500);
    }

    // Cleanup method
    destroy() {
        this.observers.forEach(observer => {
            observer.disconnect();
        });
        this.observers.clear();
        this.animationQueue = [];
        this.isInitialized = false;
    }

    // Utility methods
    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    lerp(start, end, factor) {
        return start + (end - start) * factor;
    }
}

// Initialize animations when DOM is ready
let animationController;

document.addEventListener('DOMContentLoaded', () => {
    animationController = new AnimationController();
    
    // Initialize text reveal
    animationController.initializeTextReveal();
    
    // Add loading animation
    const body = document.body;
    body.classList.add('loading');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            body.classList.remove('loading');
            body.classList.add('loaded');
        }, 500);
    });
});

// Export for use in other modules
window.AnimationController = AnimationController;
window.animationController = animationController;

// Additional animation utilities
const AnimUtils = {
    // Smooth scroll with custom easing
    smoothScrollTo(target, duration = 1000, offset = 0) {
        const element = typeof target === 'string' ? document.querySelector(target) : target;
        if (!element) return;

        const targetPosition = element.getBoundingClientRect().top + window.pageYOffset - offset;
        const startPosition = window.pageYOffset;
        const distance = targetPosition - startPosition;
        let startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const ease = animationController.easeInOutCubic(progress);
            
            window.scrollTo(0, startPosition + (distance * ease));
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }

        requestAnimationFrame(animation);
    },

    // Create floating particles
    createParticles(container, count = 20) {
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 6 + 2}px;
                height: ${Math.random() * 6 + 2}px;
                background: var(--primary-color);
                border-radius: 50%;
                opacity: ${Math.random() * 0.5 + 0.1};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 10 + 10}s linear infinite;
                animation-delay: ${Math.random() * 5}s;
            `;
            container.appendChild(particle);
        }
    },

    // Ripple effect
    createRipple(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
};

// Add ripple effect CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .ripple-container {
        position: relative;
        overflow: hidden;
    }
`;
document.head.appendChild(rippleStyle);

window.AnimUtils = AnimUtils;
