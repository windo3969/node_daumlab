// 서비스 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // AOS(Animate On Scroll) 초기화
    initAOS();
    
    // 서비스 카드 인터랙션
    initServiceCards();
    
    // 프로세스 스텝 애니메이션
    initProcessSteps();
    
    // 스무스 스크롤
    initSmoothScroll();
});

// AOS 초기화 함수
function initAOS() {
    // AOS 라이브러리가 있는 경우에만 초기화
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    } else {
        // AOS가 없는 경우 직접 구현
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('aos-animate');
                }
            });
        }, observerOptions);
        
        // 모든 data-aos 요소 관찰
        document.querySelectorAll('[data-aos]').forEach(element => {
            observer.observe(element);
        });
    }
}

// 서비스 카드 인터랙션
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        // 호버 효과 강화
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
            
            // 다른 카드들 약간 흐리게
            serviceCards.forEach(otherCard => {
                if (otherCard !== this) {
                    otherCard.style.opacity = '0.8';
                    otherCard.style.transform = 'scale(0.98)';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            
            // 모든 카드 원상복구
            serviceCards.forEach(otherCard => {
                otherCard.style.opacity = '1';
                otherCard.style.transform = 'scale(1)';
            });
        });
        
        // 클릭 시 페이지 이동
        const serviceButton = card.querySelector('.btn-service');
        if (serviceButton) {
            serviceButton.addEventListener('click', function(e) {
                e.preventDefault();
                const href = this.getAttribute('href');
                
                // 부드러운 페이지 전환 효과
                document.body.style.opacity = '0.8';
                setTimeout(() => {
                    window.location.href = href;
                }, 200);
            });
        }
    });
}

// 프로세스 스텝 애니메이션
function initProcessSteps() {
    const processSteps = document.querySelectorAll('.process-step');
    
    // 스텝별 지연 애니메이션
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const stepObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('step-animated');
                    
                    // 숫자 카운팅 애니메이션
                    const stepNumber = entry.target.querySelector('.step-number');
                    if (stepNumber) {
                        animateStepNumber(stepNumber);
                    }
                }, index * 150);
            }
        });
    }, observerOptions);
    
    processSteps.forEach(step => {
        stepObserver.observe(step);
    });
}

// 스텝 번호 애니메이션
function animateStepNumber(element) {
    const targetNumber = element.textContent;
    element.textContent = '00';
    
    setTimeout(() => {
        element.style.transform = 'scale(1.2)';
        element.textContent = targetNumber;
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
    }, 100);
}

// 스무스 스크롤
function initSmoothScroll() {
    // 내부 링크 스무스 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.offsetTop;
                const offsetPosition = elementPosition - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// 서비스 카드 필터링 (추가 기능)
function initServiceFilter() {
    const filterButtons = document.querySelectorAll('.service-filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // 버튼 활성화 상태 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // 카드 필터링
            serviceCards.forEach(card => {
                const cardType = card.getAttribute('data-service-type');
                
                if (filter === 'all' || cardType === filter) {
                    card.style.display = 'block';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

// 서비스 비교 기능
function initServiceComparison() {
    const compareButtons = document.querySelectorAll('.btn-compare');
    const comparePanel = document.querySelector('.compare-panel');
    let selectedServices = [];
    
    if (!comparePanel) return;
    
    compareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const serviceId = this.getAttribute('data-service-id');
            const serviceName = this.getAttribute('data-service-name');
            
            if (selectedServices.find(service => service.id === serviceId)) {
                // 이미 선택된 서비스 제거
                selectedServices = selectedServices.filter(service => service.id !== serviceId);
                this.classList.remove('active');
                this.textContent = '비교하기';
            } else {
                // 새 서비스 추가 (최대 3개)
                if (selectedServices.length < 3) {
                    selectedServices.push({ id: serviceId, name: serviceName });
                    this.classList.add('active');
                    this.textContent = '비교 제거';
                } else {
                    showNotification('최대 3개 서비스까지 비교할 수 있습니다.');
                    return;
                }
            }
            
            updateComparePanel();
        });
    });
}

// 비교 패널 업데이트
function updateComparePanel() {
    const comparePanel = document.querySelector('.compare-panel');
    const compareList = comparePanel.querySelector('.compare-list');
    const compareButton = comparePanel.querySelector('.btn-compare-now');
    
    if (selectedServices.length === 0) {
        comparePanel.classList.remove('visible');
        return;
    }
    
    comparePanel.classList.add('visible');
    
    // 선택된 서비스 목록 업데이트
    compareList.innerHTML = selectedServices.map(service => 
        `<span class="compare-item">${service.name}</span>`
    ).join('');
    
    // 비교 버튼 활성화
    compareButton.disabled = selectedServices.length < 2;
    compareButton.textContent = `${selectedServices.length}개 서비스 비교하기`;
}

// 알림 표시 함수
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // 스타일 적용
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: var(--primary);
        color: var(--white);
        padding: 1rem 1.5rem;
        border-radius: var(--border-radius-lg);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        transform: translateX(300px);
        transition: transform 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // 애니메이션
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 자동 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(300px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// 스크롤 진행률 표시
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, var(--secondary), #e6b885);
        z-index: 9998;
        transition: width 0.1s ease;
    `;
    
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

// 서비스 카드 로딩 애니메이션
function initCardLoadAnimation() {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(50px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 150 + 300);
    });
}

// 키보드 네비게이션 지원
function initKeyboardNavigation() {
    const focusableElements = document.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
    );
    
    let currentFocus = 0;
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            // Tab 키 네비게이션은 브라우저 기본 동작 사용
            return;
        }
        
        if (e.key === 'Enter' && document.activeElement.classList.contains('service-card')) {
            // 서비스 카드에서 Enter 키 시 해당 서비스 페이지로 이동
            const link = document.activeElement.querySelector('.btn-service');
            if (link) {
                link.click();
            }
        }
    });
}

// 성능 모니터링
function initPerformanceMonitoring() {
    // 페이지 로드 성능 측정
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Services page loaded in ${Math.round(loadTime)}ms`);
        
        // 3초 이상 걸리면 경고
        if (loadTime > 3000) {
            console.warn('Page load time is too slow. Consider optimization.');
        }
    });
    
    // 이미지 지연 로딩
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// 에러 핸들링
window.addEventListener('error', function(e) {
    console.error('Services page error:', e.error);
    
    // 사용자에게 친화적인 에러 메시지 표시
    showNotification('일시적인 오류가 발생했습니다. 페이지를 새로고침해 주세요.', 'error');
});

// 브라우저 호환성 체크
function checkBrowserCompatibility() {
    const isIE = /MSIE|Trident/.test(navigator.userAgent);
    
    if (isIE) {
        const notice = document.createElement('div');
        notice.innerHTML = `
            <div style="background: #ffebcd; padding: 1rem; text-align: center; border-bottom: 2px solid #ddd;">
                <p><strong>알림:</strong> 더 나은 사용 경험을 위해 Chrome, Firefox, Safari 등의 최신 브라우저 사용을 권장합니다.</p>
            </div>
        `;
        
        document.body.insertBefore(notice, document.body.firstChild);
    }
}