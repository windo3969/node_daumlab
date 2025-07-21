// 조직 다움 워크숍 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // 페이지 로드 시 실행할 함수들
    initScrollAnimations();
    initCounterAnimations();
    initSmoothScrolling();
    initHoverEffects();
    initProgressIndicator();
});

// 스크롤 애니메이션 초기화
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.overview-card, .program-week, .feature-card, .target-card, .result-item');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
}

// 카운터 애니메이션 초기화
function initCounterAnimations() {
    const counters = document.querySelectorAll('.result-metric, .stat-number');
    
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

// 카운터 애니메이션 함수
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const increment = target / 50;
    let current = 0;
    const hasPercent = element.textContent.includes('%');
    const hasPlus = element.textContent.includes('+');

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        let displayValue = Math.floor(current);
        if (hasPercent) displayValue += '%';
        if (hasPlus) displayValue += '+';
        
        element.textContent = displayValue;
    }, 40);
}

// 부드러운 스크롤링 초기화
function initSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('#header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 호버 효과 초기화
function initHoverEffects() {
    // 프로그램 주차별 호버 효과
    const programWeeks = document.querySelectorAll('.program-week');
    
    programWeeks.forEach(week => {
        week.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)';
        });
        
        week.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 특징 카드 호버 효과
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        const icon = card.querySelector('.feature-icon');
        
        card.addEventListener('mouseenter', function() {
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(10deg)';
                icon.style.background = 'linear-gradient(135deg, var(--secondary), #e6b885)';
                icon.style.color = 'var(--white)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.background = 'rgba(212, 165, 116, 0.1)';
                icon.style.color = 'var(--secondary)';
            }
        });
    });

    // 대상 조직 카드 호버 효과
    const targetCards = document.querySelectorAll('.target-card');
    
    targetCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.target-icon');
            if (icon) {
                icon.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.target-icon');
            if (icon) {
                icon.style.transform = 'scale(1)';
            }
        });
    });
}

// 진행률 표시기 초기화
function initProgressIndicator() {
    const sections = document.querySelectorAll('section[id]');
    const progressDots = createProgressDots(sections);
    
    if (progressDots.length > 0) {
        updateProgressOnScroll(sections, progressDots);
    }
}

// 진행률 점 생성
function createProgressDots(sections) {
    if (sections.length === 0) return [];
    
    const progressContainer = document.createElement('div');
    progressContainer.className = 'page-progress';
    progressContainer.innerHTML = `
        <div class="progress-dots">
            ${Array.from(sections).map((section, index) => 
                `<div class="progress-dot" data-section="${section.id}" title="${getSectionTitle(section)}"></div>`
            ).join('')}
        </div>
    `;
    
    // 진행률 표시기 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .page-progress {
            position: fixed;
            right: 2rem;
            top: 50%;
            transform: translateY(-50%);
            z-index: 100;
            display: none;
        }
        
        .progress-dots {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .progress-dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            background: rgba(212, 165, 116, 0.3);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
        }
        
        .progress-dot:hover {
            background: var(--secondary);
            transform: scale(1.3);
        }
        
        .progress-dot.active {
            background: var(--secondary);
            box-shadow: 0 0 0 3px rgba(212, 165, 116, 0.3);
        }
        
        .progress-dot::after {
            content: attr(title);
            position: absolute;
            right: 120%;
            top: 50%;
            transform: translateY(-50%);
            background: var(--primary);
            color: var(--white);
            padding: 0.5rem 1rem;
            border-radius: 6px;
            font-size: 0.8rem;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        }
        
        .progress-dot:hover::after {
            opacity: 1;
            visibility: visible;
        }
        
        @media (max-width: 1024px) {
            .page-progress {
                display: none !important;
            }
        }
    `;
    document.head.appendChild(style);
    
    // 진행률 점 클릭 이벤트
    const dots = progressContainer.querySelectorAll('.progress-dot');
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const sectionId = this.dataset.section;
            const section = document.getElementById(sectionId);
            if (section) {
                const headerHeight = document.querySelector('#header')?.offsetHeight || 80;
                window.scrollTo({
                    top: section.offsetTop - headerHeight,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    document.body.appendChild(progressContainer);
    
    // 스크롤 시 진행률 표시기 표시/숨김
    let scrollTimer;
    window.addEventListener('scroll', function() {
        progressContainer.style.display = 'block';
        
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            if (window.scrollY < 300) {
                progressContainer.style.display = 'none';
            }
        }, 2000);
    });
    
    return Array.from(dots);
}

// 섹션 제목 가져오기
function getSectionTitle(section) {
    const titleElement = section.querySelector('.section-title, h2, h3');
    if (titleElement) {
        return titleElement.textContent.trim();
    }
    return section.id.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// 스크롤에 따른 진행률 업데이트
function updateProgressOnScroll(sections, progressDots) {
    window.addEventListener('scroll', throttle(() => {
        const scrollPosition = window.scrollY + window.innerHeight / 2;
        
        let activeSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                activeSection = section.id;
            }
        });
        
        // 진행률 점 활성화 상태 업데이트
        progressDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.dataset.section === activeSection) {
                dot.classList.add('active');
            }
        });
    }, 100));
}

// 쓰로틀링 함수
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// 폼 유효성 검사 (CTA 버튼 클릭 시)
function initFormValidation() {
    const ctaButtons = document.querySelectorAll('.btn-daum.primary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 실제 폼이 있는 경우에만 유효성 검사 실행
            const form = this.closest('form');
            if (form) {
                e.preventDefault();
                validateAndSubmitForm(form);
            }
        });
    });
}

// 폼 검증 및 제출
function validateAndSubmitForm(form) {
    const formData = new FormData(form);
    const errors = [];
    
    // 기본 유효성 검사
    const requiredFields = form.querySelectorAll('[required]');
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            errors.push(`${field.name}은(는) 필수 입력 항목입니다.`);
        }
    });
    
    // 이메일 유효성 검사
    const emailField = form.querySelector('input[type="email"]');
    if (emailField && emailField.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailField.value)) {
            errors.push('올바른 이메일 주소를 입력해주세요.');
        }
    }
    
    if (errors.length > 0) {
        alert(errors.join('\n'));
        return false;
    }
    
    // 폼 제출
    form.submit();
    return true;
}

// 페이지 성능 최적화
function optimizePagePerformance() {
    // 이미지 지연 로딩
    const images = document.querySelectorAll('img[loading="lazy"]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // 중요하지 않은 리소스 지연 로딩
    setTimeout(() => {
        loadNonCriticalResources();
    }, 1000);
}

// 중요하지 않은 리소스 로딩
function loadNonCriticalResources() {
    // 소셜 미디어 위젯이나 분석 도구 등을 여기서 로딩
    // 예: Google Analytics, Facebook Pixel 등
}

// 접근성 개선
function improveAccessibility() {
    // 키보드 네비게이션 지원
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid var(--secondary)';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });
    
    // ARIA 레이블 동적 추가
    const cards = document.querySelectorAll('.overview-card, .feature-card, .target-card');
    cards.forEach((card, index) => {
        if (!card.getAttribute('aria-label')) {
            const title = card.querySelector('h3, .overview-title, .feature-title, .target-title');
            if (title) {
                card.setAttribute('aria-label', title.textContent);
            }
        }
    });
}

// 다크 모드 지원
function initDarkModeSupport() {
    // 시스템 다크 모드 감지
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    function handleDarkModeChange(e) {
        if (e.matches) {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
    }
    
    mediaQuery.addListener(handleDarkModeChange);
    handleDarkModeChange(mediaQuery);
}

// 에러 처리
function initErrorHandling() {
    window.addEventListener('error', function(e) {
        console.error('JavaScript 오류:', e.error);
        // 사용자에게 오류를 표시하지 않고 로그만 기록
    });
    
    window.addEventListener('unhandledrejection', function(e) {
        console.error('처리되지 않은 Promise 거부:', e.reason);
        e.preventDefault();
    });
}

// 브라우저 호환성 확인
function checkBrowserCompatibility() {
    const features = {
        intersectionObserver: 'IntersectionObserver' in window,
        customProperties: CSS.supports('--custom-property', 'value'),
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid')
    };
    
    const unsupportedFeatures = Object.keys(features).filter(key => !features[key]);
    
    if (unsupportedFeatures.length > 0) {
        console.warn('지원되지 않는 기능들:', unsupportedFeatures);
        // 폴백 스타일이나 스크립트 로딩
        loadPolyfills(unsupportedFeatures);
    }
}

// 폴리필 로딩
function loadPolyfills(unsupportedFeatures) {
    if (unsupportedFeatures.includes('intersectionObserver')) {
        // IntersectionObserver 폴리필 로딩
        const script = document.createElement('script');
        script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
        document.head.appendChild(script);
    }
}

// 페이지 분석 (선택사항)
function initPageAnalytics() {
    // 스크롤 깊이 추적
    const scrollDepths = [25, 50, 75, 100];
    const trackedDepths = new Set();
    
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = Math.round(
            (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );
        
        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !trackedDepths.has(depth)) {
                trackedDepths.add(depth);
                // 분석 도구로 이벤트 전송
                console.log(`스크롤 깊이: ${depth}%`);
            }
        });
    }, 500));
    
    // 클릭 이벤트 추적
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a, button');
        if (target) {
            const trackingData = {
                element: target.tagName.toLowerCase(),
                text: target.textContent.trim().substring(0, 100),
                href: target.href || '',
                className: target.className
            };
            console.log('클릭 이벤트:', trackingData);
        }
    });
}

// 초기화 함수들 실행
document.addEventListener('DOMContentLoaded', function() {
    // 기본 기능들
    initScrollAnimations();
    initCounterAnimations();
    initSmoothScrolling();
    initHoverEffects();
    initProgressIndicator();
    initFormValidation();
    
    // 성능 및 접근성 개선
    optimizePagePerformance();
    improveAccessibility();
    initDarkModeSupport();
    initErrorHandling();
    checkBrowserCompatibility();
    
    // 분석 (선택사항)
    initPageAnalytics();
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', function() {
    // 이벤트 리스너 정리
    // 타이머 정리
    // 기타 리소스 정리
});