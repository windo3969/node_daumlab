// 콘텐츠 개발 서비스 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    
    // ===== 스무스 스크롤 기능 =====
    function initSmoothScroll() {
        const links = document.querySelectorAll('a[href^="#"]');
        
        links.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    const headerOffset = 80;
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ===== 포트폴리오 필터링 =====
    function initPortfolioFilter() {
        const filterButtons = document.querySelectorAll('.portfolio-filter button');
        const portfolioItems = document.querySelectorAll('.portfolio-item');
        
        if (filterButtons.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const filterValue = this.getAttribute('data-filter');
                    
                    // 활성 버튼 스타일 변경
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    this.classList.add('active');
                    
                    // 포트폴리오 아이템 필터링
                    portfolioItems.forEach(item => {
                        if (filterValue === 'all' || item.classList.contains(filterValue)) {
                            item.style.display = 'block';
                            setTimeout(() => {
                                item.style.opacity = '1';
                                item.style.transform = 'translateY(0)';
                            }, 100);
                        } else {
                            item.style.opacity = '0';
                            item.style.transform = 'translateY(20px)';
                            setTimeout(() => {
                                item.style.display = 'none';
                            }, 300);
                        }
                    });
                });
            });
        }
    }

    // ===== 카운터 애니메이션 =====
    function initCounterAnimation() {
        const counters = document.querySelectorAll('.stat-number');
        const animationDuration = 2000; // 2초

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
                    const increment = target / (animationDuration / 16); // 60fps 기준
                    let current = 0;

                    const updateCounter = () => {
                        if (current < target) {
                            current += increment;
                            counter.textContent = Math.floor(current) + (counter.textContent.includes('+') ? '+' : '');
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target + (counter.textContent.includes('+') ? '+' : '');
                        }
                    };

                    updateCounter();
                    observer.unobserve(counter);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // ===== 가격 카드 호버 효과 =====
    function initPricingCardEffects() {
        const pricingCards = document.querySelectorAll('.pricing-card');
        
        pricingCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                // 다른 카드들 opacity 감소
                pricingCards.forEach(otherCard => {
                    if (otherCard !== this) {
                        otherCard.style.opacity = '0.7';
                    }
                });
            });
            
            card.addEventListener('mouseleave', function() {
                // 모든 카드 opacity 복원
                pricingCards.forEach(otherCard => {
                    otherCard.style.opacity = '1';
                });
            });
        });
    }

    // ===== 스크롤 기반 애니메이션 =====
    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.feature-card, .process-step, .portfolio-item, .testimonial-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { 
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach((element, index) => {
            // 초기 상태 설정
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
            
            observer.observe(element);
        });
    }

    // ===== 문의 폼 검증 =====
    function initFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const requiredFields = form.querySelectorAll('[required]');
                let isValid = true;
                
                requiredFields.forEach(field => {
                    const errorElement = field.parentNode.querySelector('.error-message');
                    
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');
                        
                        if (!errorElement) {
                            const error = document.createElement('div');
                            error.className = 'error-message';
                            error.textContent = '이 필드는 필수입니다.';
                            field.parentNode.appendChild(error);
                        }
                    } else {
                        field.classList.remove('error');
                        if (errorElement) {
                            errorElement.remove();
                        }
                    }
                });
                
                // 이메일 검증
                const emailFields = form.querySelectorAll('input[type="email"]');
                emailFields.forEach(field => {
                    if (field.value && !isValidEmail(field.value)) {
                        isValid = false;
                        field.classList.add('error');
                        
                        const errorElement = field.parentNode.querySelector('.error-message');
                        if (!errorElement) {
                            const error = document.createElement('div');
                            error.className = 'error-message';
                            error.textContent = '올바른 이메일 주소를 입력해주세요.';
                            field.parentNode.appendChild(error);
                        }
                    }
                });
                
                if (!isValid) {
                    e.preventDefault();
                    
                    // 첫 번째 에러 필드로 스크롤
                    const firstError = form.querySelector('.error');
                    if (firstError) {
                        firstError.scrollIntoView({ 
                            behavior: 'smooth', 
                            block: 'center' 
                        });
                        firstError.focus();
                    }
                }
            });
        });
    }

    // ===== 이메일 검증 헬퍼 함수 =====
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // ===== 툴팁 기능 =====
    function initTooltips() {
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            element.addEventListener('mouseenter', function() {
                const tooltipText = this.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = tooltipText;
                
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
                tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
                
                setTimeout(() => tooltip.classList.add('show'), 10);
                
                this.tooltipElement = tooltip;
            });
            
            element.addEventListener('mouseleave', function() {
                if (this.tooltipElement) {
                    this.tooltipElement.classList.remove('show');
                    setTimeout(() => {
                        if (this.tooltipElement && this.tooltipElement.parentNode) {
                            this.tooltipElement.parentNode.removeChild(this.tooltipElement);
                        }
                    }, 200);
                }
            });
        });
    }

    // ===== 로딩 상태 관리 =====
    function initLoadingStates() {
        const buttons = document.querySelectorAll('.btn-daum');
        
        buttons.forEach(button => {
            button.addEventListener('click', function(e) {
                if (this.getAttribute('href') && this.getAttribute('href').startsWith('/')) {
                    this.classList.add('loading');
                    this.innerHTML = '<i class="bi bi-arrow-clockwise spin"></i> 로딩중...';
                }
            });
        });
    }

    // ===== 이미지 지연 로딩 =====
    function initLazyLoading() {
        const images = document.querySelectorAll('img[loading="lazy"]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.src; // 이미지 로딩 트리거
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                img.classList.add('lazy');
                imageObserver.observe(img);
            });
        }
    }

    // ===== 네비게이션 하이라이트 =====
    function initNavigationHighlight() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.navbar-nav a[href^="#"]');
        
        window.addEventListener('scroll', () => {
            let current = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });
    }

    // ===== 모바일 최적화 =====
    function initMobileOptimizations() {
        // 터치 이벤트 최적화
        if ('ontouchstart' in window) {
            document.body.classList.add('touch-device');
            
            // 호버 효과를 터치 이벤트로 변경
            const hoverElements = document.querySelectorAll('.feature-card, .portfolio-item, .testimonial-card');
            
            hoverElements.forEach(element => {
                element.addEventListener('touchstart', function() {
                    this.classList.add('touch-hover');
                });
                
                element.addEventListener('touchend', function() {
                    setTimeout(() => {
                        this.classList.remove('touch-hover');
                    }, 300);
                });
            });
        }
    }

    // ===== 모든 기능 초기화 =====
    try {
        initSmoothScroll();
        initPortfolioFilter();
        initCounterAnimation();
        initPricingCardEffects();
        initScrollAnimations();
        initFormValidation();
        initTooltips();
        initLoadingStates();
        initLazyLoading();
        initNavigationHighlight();
        initMobileOptimizations();
        
        console.log('콘텐츠 개발 서비스 페이지가 성공적으로 로드되었습니다.');
    } catch (error) {
        console.error('페이지 초기화 중 오류가 발생했습니다:', error);
    }
});

// ===== CSS 스타일 추가 (동적) =====
const additionalStyles = `
    .error {
        border-color: #dc3545 !important;
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    
    .error-message {
        color: #dc3545;
        font-size: 0.875rem;
        margin-top: 0.25rem;
    }
    
    .tooltip {
        position: absolute;
        z-index: 1000;
        background: #333;
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.2s ease;
        pointer-events: none;
    }
    
    .tooltip.show {
        opacity: 1;
        transform: translateY(0);
    }
    
    .tooltip::after {
        content: '';
        position: absolute;
        top: 100%;
        left: 50%;
        margin-left: -5px;
        border-width: 5px;
        border-style: solid;
        border-color: #333 transparent transparent transparent;
    }
    
    .loading {
        opacity: 0.7;
        pointer-events: none;
    }
    
    .spin {
        animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s;
    }
    
    .touch-device .feature-card:hover,
    .touch-device .portfolio-item:hover,
    .touch-device .testimonial-card:hover {
        transform: none;
    }
    
    .touch-hover {
        transform: translateY(-5px) !important;
        box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15) !important;
    }
`;

// 스타일 시트에 동적 스타일 추가
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);