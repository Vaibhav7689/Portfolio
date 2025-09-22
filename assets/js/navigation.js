// Navigation specific functionality
class Navigation {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileMenu = document.getElementById('mobile-menu');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.isMenuOpen = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.handleActiveStates();
        this.createMobileMenuBackdrop();
    }

    bindEvents() {
        // Mobile menu toggle
        if (this.mobileMenu) {
            this.mobileMenu.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMobileMenu();
            });
        }

        // Close menu when clicking nav links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (this.isMenuOpen) {
                    this.closeMobileMenu();
                }
                this.setActiveLink(link);
            });
        });

        // Handle scroll for navbar effects
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });

        // Handle resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMenuOpen) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        if (this.isMenuOpen) {
            this.closeMobileMenu();
        } else {
            this.openMobileMenu();
        }
    }

    openMobileMenu() {
        this.mobileMenu.classList.add('active');
        this.navMenu.classList.add('active');
        document.body.classList.add('menu-open');
        this.isMenuOpen = true;
        
        // Show backdrop
        const backdrop = document.querySelector('.nav-backdrop');
        if (backdrop) {
            backdrop.classList.add('active');
        }

        // Animate menu items
        this.animateMenuItems('in');
    }

    closeMobileMenu() {
        this.mobileMenu.classList.remove('active');
        this.navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
        this.isMenuOpen = false;
        
        // Hide backdrop
        const backdrop = document.querySelector('.nav-backdrop');
        if (backdrop) {
            backdrop.classList.remove('active');
        }

        // Animate menu items
        this.animateMenuItems('out');
    }

    createMobileMenuBackdrop() {
        const backdrop = document.createElement('div');
        backdrop.className = 'nav-backdrop';
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 999;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            backdrop-filter: blur(5px);
        `;

        backdrop.addEventListener('click', () => {
            this.closeMobileMenu();
        });

        document.body.appendChild(backdrop);

        // Add styles for active state
        const style = document.createElement('style');
        style.textContent = `
            .nav-backdrop.active {
                opacity: 1;
                visibility: visible;
            }
            
            body.menu-open {
                overflow: hidden;
            }
            
            @media (max-width: 768px) {
                .nav-menu {
                    max-height: calc(100vh - 80px);
                    overflow-y: auto;
                }
            }
        `;
        document.head.appendChild(style);
    }

    animateMenuItems(direction) {
        const menuItems = this.navMenu.querySelectorAll('.nav-item');
        menuItems.forEach((item, index) => {
            if (direction === 'in') {
                setTimeout(() => {
                    item.style.animation = 'slideInUp 0.3s ease forwards';
                }, index * 50);
            } else {
                item.style.animation = 'fadeOut 0.2s ease forwards';
            }
        });
    }

    handleScroll() {
        const scrollY = window.pageYOffset;
        
        // Navbar background change
        if (scrollY > 50) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }

        // Auto-hide navbar on scroll (optional)
        if (scrollY > 100) {
            this.navbar.classList.add('nav-hidden');
        } else {
            this.navbar.classList.remove('nav-hidden');
        }

        // Update active link based on section
        this.updateActiveSection();
    }

    updateActiveSection() {
        const sections = document.querySelectorAll('section[id]');
        let currentSection = '';
        
        sections.forEach(section => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                currentSection = section.id;
            }
        });

        // Update active nav link
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}` || 
                (currentSection === 'home' && href === '#home')) {
                link.classList.add('active');
            }
        });
    }

    setActiveLink(clickedLink) {
        this.navLinks.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    handleActiveStates() {
        // Set active link based on current page
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href.includes(currentPage) || 
                (currentPage === 'index.html' && href === '#home')) {
                link.classList.add('active');
            }
        });
    }

    // Smooth scrolling enhancement
    smoothScrollTo(target, offset = 80) {
        const element = document.querySelector(target);
        if (element) {
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Add navigation indicators
    createProgressIndicator() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: var(--bg-gradient);
            z-index: 1001;
            transition: width 0.1s ease;
        `;
        
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // Breadcrumb navigation
    createBreadcrumb() {
        const breadcrumb = document.createElement('nav');
        breadcrumb.className = 'breadcrumb';
        breadcrumb.setAttribute('aria-label', 'Breadcrumb');
        
        const currentPage = this.getCurrentPageInfo();
        breadcrumb.innerHTML = `
            <ol class="breadcrumb-list">
                <li class="breadcrumb-item">
                    <a href="../index.html">Home</a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                    ${currentPage.title}
                </li>
            </ol>
        `;

        // Insert breadcrumb after navbar
        this.navbar.insertAdjacentElement('afterend', breadcrumb);
    }

    getCurrentPageInfo() {
        const pathname = window.location.pathname;
        const pageMap = {
            '/about.html': { title: 'About', icon: 'fas fa-user' },
            '/skills.html': { title: 'Skills', icon: 'fas fa-cogs' },
            '/projects.html': { title: 'Projects', icon: 'fas fa-folder-open' },
            '/experience.html': { title: 'Experience', icon: 'fas fa-briefcase' },
            '/education.html': { title: 'Education', icon: 'fas fa-graduation-cap' },
            '/certificates.html': { title: 'Certifications', icon: 'fas fa-certificate' },
            '/contact.html': { title: 'Contact', icon: 'fas fa-envelope' }
        };

        return pageMap[pathname] || { title: 'Home', icon: 'fas fa-home' };
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const navigation = new Navigation();
    
    // Add progress indicator for long pages
    if (document.body.scrollHeight > window.innerHeight * 2) {
        navigation.createProgressIndicator();
    }

    // Add breadcrumb for inner pages
    if (!window.location.pathname.includes('index.html')) {
        navigation.createBreadcrumb();
    }
});

// Export for use in other modules
window.Navigation = Navigation;
