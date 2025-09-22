// Skills page specific functionality
class SkillsController {
    constructor() {
        this.skillBars = document.querySelectorAll('.skill-progress');
        this.categoryCards = document.querySelectorAll('.skill-category-card');
        this.isAnimated = false;
        this.init();
    }

    init() {
        this.setupSkillBarAnimations();
        this.setupCategoryHoverEffects();
        this.setupFilterSystem();
        this.initializeSkillSearch();
        this.setupProgressAnimations();
    }

    setupSkillBarAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.isAnimated) {
                    this.animateSkillBars();
                    this.isAnimated = true;
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });

        const proficiencySection = document.querySelector('.proficiency-section');
        if (proficiencySection) {
            observer.observe(proficiencySection);
        }
    }

    animateSkillBars() {
        this.skillBars.forEach((bar, index) => {
            const width = bar.getAttribute('data-width') || '0%';
            const duration = 2000 + (index * 200); // Stagger animation
            
            // Reset initial state
            bar.style.width = '0%';
            bar.style.opacity = '1';
            
            setTimeout(() => {
                bar.style.transition = `width ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
                bar.style.width = width;
                
                // Add number counting animation
                const parentItem = bar.closest('.proficiency-item');
                const percentageElement = parentItem?.querySelector('.skill-percentage');
                
                if (percentageElement) {
                    this.animatePercentage(percentageElement, parseInt(width), duration);
                }
            }, index * 200);
        });
    }

    animatePercentage(element, targetValue, duration) {
        let startValue = 0;
        const increment = targetValue / (duration / 16);
        
        const updateValue = () => {
            startValue += increment;
            if (startValue < targetValue) {
                element.textContent = Math.floor(startValue) + '%';
                requestAnimationFrame(updateValue);
            } else {
                element.textContent = targetValue + '%';
            }
        };
        
        updateValue();
    }

    setupCategoryHoverEffects() {
        this.categoryCards.forEach(card => {
            const skillItems = card.querySelectorAll('.skill-item');
            
            card.addEventListener('mouseenter', () => {
                this.staggerSkillItems(skillItems, 'enter');
            });
            
            card.addEventListener('mouseleave', () => {
                this.staggerSkillItems(skillItems, 'leave');
            });
        });
    }

    staggerSkillItems(items, action) {
        items.forEach((item, index) => {
            setTimeout(() => {
                if (action === 'enter') {
                    item.style.transform = 'translateX(10px)';
                    item.style.background = '#f1f5f9';
                } else {
                    item.style.transform = 'translateX(0)';
                    item.style.background = '#f8fafc';
                }
            }, index * 50);
        });
    }

    setupFilterSystem() {
        // Create filter buttons
        const filterContainer = this.createFilterButtons();
        const skillsSection = document.querySelector('.skills-categories');
        
        if (skillsSection && filterContainer) {
            skillsSection.insertBefore(filterContainer, skillsSection.firstChild);
        }
    }

    createFilterButtons() {
        const categories = ['All', 'Programming', 'Web', 'Database', 'Cloud'];
        const container = document.createElement('div');
        container.className = 'skills-filter';
        container.style.cssText = `
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-bottom: 3rem;
            flex-wrap: wrap;
        `;

        categories.forEach((category, index) => {
            const button = document.createElement('button');
            button.textContent = category;
            button.className = `filter-btn ${index === 0 ? 'active' : ''}`;
            button.style.cssText = `
                padding: 0.75rem 1.5rem;
                border: 2px solid var(--primary-color);
                background: ${index === 0 ? 'var(--bg-gradient)' : 'transparent'};
                color: ${index === 0 ? 'white' : 'var(--primary-color)'};
                border-radius: 25px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                font-family: inherit;
            `;
            
            button.addEventListener('click', () => {
                this.filterSkills(category.toLowerCase());
                this.setActiveFilter(button);
            });
            
            button.addEventListener('mouseenter', () => {
                if (!button.classList.contains('active')) {
                    button.style.background = 'var(--bg-gradient)';
                    button.style.color = 'white';
                }
            });
            
            button.addEventListener('mouseleave', () => {
                if (!button.classList.contains('active')) {
                    button.style.background = 'transparent';
                    button.style.color = 'var(--primary-color)';
                }
            });
            
            container.appendChild(button);
        });

        return container;
    }

    setActiveFilter(activeButton) {
        const allButtons = document.querySelectorAll('.filter-btn');
        allButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'transparent';
            btn.style.color = 'var(--primary-color)';
        });
        
        activeButton.classList.add('active');
        activeButton.style.background = 'var(--bg-gradient)';
        activeButton.style.color = 'white';
    }

    filterSkills(category) {
        const cards = document.querySelectorAll('.skill-category-card');
        
        cards.forEach((card, index) => {
            const cardCategory = card.querySelector('h3').textContent.toLowerCase();
            const shouldShow = category === 'all' || cardCategory.includes(category);
            
            setTimeout(() => {
                if (shouldShow) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    requestAnimationFrame(() => {
                        card.style.transition = 'all 0.5s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                } else {
                    card.style.transition = 'all 0.3s ease';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(-20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            }, index * 100);
        });
    }

    initializeSkillSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'skill-search-container';
        searchContainer.style.cssText = `
            max-width: 400px;
            margin: 0 auto 3rem;
            position: relative;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search skills...';
        searchInput.className = 'skill-search';
        searchInput.style.cssText = `
            width: 100%;
            padding: 1rem 1rem 1rem 3rem;
            border: 2px solid #e2e8f0;
            border-radius: 25px;
            font-size: 1rem;
            background: white;
            transition: all 0.3s ease;
            font-family: inherit;
        `;
        
        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search';
        searchIcon.style.cssText = `
            position: absolute;
            left: 1rem;
            top: 50%;
            transform: translateY(-50%);
            color: var(--text-light);
            font-size: 1rem;
        `;
        
        searchInput.addEventListener('focus', () => {
            searchInput.style.borderColor = 'var(--primary-color)';
            searchInput.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
        });
        
        searchInput.addEventListener('blur', () => {
            searchInput.style.borderColor = '#e2e8f0';
            searchInput.style.boxShadow = 'none';
        });
        
        searchInput.addEventListener('input', (e) => {
            this.searchSkills(e.target.value);
        });
        
        searchContainer.appendChild(searchIcon);
        searchContainer.appendChild(searchInput);
        
        const skillsSection = document.querySelector('.skills-categories');
        if (skillsSection) {
            skillsSection.insertBefore(searchContainer, skillsSection.firstChild);
        }
    }

    searchSkills(query) {
        const cards = document.querySelectorAll('.skill-category-card');
        const searchTerm = query.toLowerCase();
        
        cards.forEach(card => {
            const skills = card.querySelectorAll('.skill-item');
            let hasMatchingSkill = false;
            
            skills.forEach(skill => {
                const skillText = skill.textContent.toLowerCase();
                const isMatch = skillText.includes(searchTerm);
                
                if (isMatch) {
                    hasMatchingSkill = true;
                    skill.style.background = searchTerm ? '#fff3cd' : '#f8fafc';
                } else {
                    skill.style.background = '#f8fafc';
                }
            });
            
            // Show/hide entire category card based on matches
            if (searchTerm === '' || hasMatchingSkill) {
                card.style.display = 'block';
                card.style.opacity = '1';
            } else {
                card.style.opacity = '0.3';
            }
        });
    }

    setupProgressAnimations() {
        // Add enhanced progress bar animations
        const progressItems = document.querySelectorAll('.proficiency-item');
        
        progressItems.forEach((item, index) => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            entry.target.classList.add('animate-in');
                        }, index * 150);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });
            
            observer.observe(item);
        });
    }

    // Skill comparison feature
    createSkillComparison() {
        const comparisonContainer = document.createElement('div');
        comparisonContainer.className = 'skills-comparison';
        comparisonContainer.innerHTML = `
            <h3>Skills Comparison</h3>
            <div class="comparison-chart">
                <canvas id="skillsChart" width="400" height="200"></canvas>
            </div>
        `;
        
        const proficiencySection = document.querySelector('.proficiency-section');
        if (proficiencySection) {
            proficiencySection.appendChild(comparisonContainer);
            this.initializeChart();
        }
    }

    initializeChart() {
        const canvas = document.getElementById('skillsChart');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        const skills = [];
        const values = [];
        
        document.querySelectorAll('.proficiency-item').forEach(item => {
            const skillName = item.querySelector('.skill-name').textContent;
            const skillValue = parseInt(item.querySelector('.skill-percentage').textContent);
            skills.push(skillName);
            values.push(skillValue);
        });
        
        this.drawBarChart(ctx, skills, values);
    }

    drawBarChart(ctx, labels, data) {
        const canvas = ctx.canvas;
        const padding = 40;
        const barWidth = (canvas.width - padding * 2) / data.length;
        const maxValue = Math.max(...data);
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw bars
        data.forEach((value, index) => {
            const barHeight = (value / maxValue) * (canvas.height - padding * 2);
            const x = padding + index * barWidth;
            const y = canvas.height - padding - barHeight;
            
            // Create gradient
            const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            
            ctx.fillStyle = gradient;
            ctx.fillRect(x + 5, y, barWidth - 10, barHeight);
            
            // Draw labels
            ctx.fillStyle = '#4a5568';
            ctx.font = '12px Poppins';
            ctx.textAlign = 'center';
            ctx.fillText(labels[index].substring(0, 8), x + barWidth / 2, canvas.height - 10);
            
            // Draw values
            ctx.fillStyle = '#2d3748';
            ctx.font = 'bold 14px Poppins';
            ctx.fillText(value + '%', x + barWidth / 2, y - 5);
        });
    }

    // Add skill endorsement feature
    addSkillEndorsements() {
        const skillItems = document.querySelectorAll('.skill-item');
        
        skillItems.forEach(item => {
            const endorseButton = document.createElement('button');
            endorseButton.innerHTML = '<i class="fas fa-thumbs-up"></i>';
            endorseButton.className = 'skill-endorse';
            endorseButton.style.cssText = `
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                color: var(--primary-color);
                cursor: pointer;
                opacity: 0;
                transition: all 0.3s ease;
            `;
            
            item.style.position = 'relative';
            item.appendChild(endorseButton);
            
            item.addEventListener('mouseenter', () => {
                endorseButton.style.opacity = '1';
            });
            
            item.addEventListener('mouseleave', () => {
                endorseButton.style.opacity = '0';
            });
            
            endorseButton.addEventListener('click', (e) => {
                e.stopPropagation();
                this.endorseSkill(item, endorseButton);
            });
        });
    }

    endorseSkill(skillItem, button) {
        button.style.animation = 'pulse 0.3s ease';
        button.style.color = '#10b981';
        
        // Add +1 animation
        const plusOne = document.createElement('span');
        plusOne.textContent = '+1';
        plusOne.style.cssText = `
            position: absolute;
            right: -20px;
            top: -10px;
            color: #10b981;
            font-weight: bold;
            animation: fadeUpOut 1s ease forwards;
            pointer-events: none;
        `;
        
        skillItem.appendChild(plusOne);
        
        setTimeout(() => {
            plusOne.remove();
        }, 1000);
    }
}

// Initialize skills functionality
document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.skills-categories') || document.querySelector('.proficiency-section')) {
        const skillsController = new SkillsController();
        
        // Add additional features
        skillsController.addSkillEndorsements();
        skillsController.createSkillComparison();
    }
});

// Add additional CSS for skill animations
const skillsStyle = document.createElement('style');
skillsStyle.textContent = `
    .proficiency-item.animate-in {
        animation: slideInLeft 0.6s ease forwards;
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes fadeUpOut {
        0% {
            opacity: 1;
            transform: translateY(0);
        }
        100% {
            opacity: 0;
            transform: translateY(-30px);
        }
    }
    
    @keyframes pulse {
        0% { transform: translateY(-50%) scale(1); }
        50% { transform: translateY(-50%) scale(1.2); }
        100% { transform: translateY(-50%) scale(1); }
    }
`;
document.head.appendChild(skillsStyle);

window.SkillsController = SkillsController;
