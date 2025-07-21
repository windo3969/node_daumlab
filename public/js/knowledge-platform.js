// ==================== 지식 구독 플랫폼 페이지 전용 JavaScript ====================

document.addEventListener('DOMContentLoaded', function() {
    // 스크롤 애니메이션 초기화
    initScrollAnimations();
    
    // 스무스 스크롤 초기화
    initSmoothScroll();
    
    // 뉴스레터 목업 인터랙션
    initNewsletterMockup();
    
    // 타임라인 인터랙션
    initTimelineInteraction();
    
    // 주제 카테고리 인터랙션
    initTopicCategories();
    
    // 샘플 콘텐츠 인터랙션
    initSampleContent();
    
    // 가격 플랜 인터랙션
    initPricingInteraction();
    
    // FAQ 아코디언 강화
    initFAQEnhancements();
    
    // CTA 버튼 인터랙션
    initCTAInteractions();
    
    // 스크롤 진행도 표시
    initScrollProgress();
});

// 스크롤 애니메이션 초기화
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // 애니메이션할 요소들 선택
    const animateElements = document.querySelectorAll(`
        .intro-card,
        .timeline-item,
        .topic-category,
        .review-card,
        .pricing-card,
        .content-section
    `);

    animateElements.forEach((el, index) => {
        // 애니메이션 클래스 추가
        if (index % 3 === 0) {
            el.classList.add('fade-in-up');
        } else if (index % 3 === 1) {
            el.classList.add('fade-in-left');
        } else {
            el.classList.add('fade-in-right');
        }
        
        observer.observe(el);
    });
}

// 스무스 스크롤 초기화
function initSmoothScroll() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
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

// 뉴스레터 목업 인터랙션
function initNewsletterMockup() {
    const newsletterMockup = document.querySelector('.newsletter-mockup');
    
    if (newsletterMockup) {
        // 마우스 이동에 따른 3D 효과
        newsletterMockup.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        
        // 마우스가 벗어났을 때 원래 상태로
        newsletterMockup.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateY(-15deg) rotateX(5deg)';
        });
        
        // 클릭 시 확대 효과
        newsletterMockup.addEventListener('click', function() {
            this.style.transform = 'perspective(1000px) rotateY(0deg) rotateX(0deg) scale(1.05)';
            
            setTimeout(() => {
                this.style.transform = 'perspective(1000px) rotateY(-15deg) rotateX(5deg)';
            }, 500);
        });
    }
}

// 타임라인 인터랙션
function initTimelineInteraction() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        // 호버 시 다른 아이템들 흐리게
        item.addEventListener('mouseenter', function() {
            timelineItems.forEach((otherItem, otherIndex) => {
                if (otherIndex !== index) {
                    otherItem.style.opacity = '0.6';
                    otherItem.style.transform = 'scale(0.95)';
                }
            });
        });
        
        // 마우스 벗어날 때 원래대로
        item.addEventListener('mouseleave', function() {
            timelineItems.forEach(otherItem => {
                otherItem.style.opacity = '1';
                otherItem.style.transform = 'scale(1)';
            });
        });
        
        // 클릭 시 상세 정보 표시 (모달 또는 툴팁)
        item.addEventListener('click', function() {
            showTimelineDetail(index);
        });
    });
}

// 타임라인 상세 정보 표시
function showTimelineDetail(index) {
    const details = [
        {
            title: "이론 탐구",
            description: "각 주제와 관련된 심리학, 철학, 경영학 이론을 쉽게 풀어서 설명합니다. 복잡한 개념도 일상 언어로 이해할 수 있도록 도와드립니다.",
            examples: ["긍정심리학", "인지행동이론", "실존주의 철학"]
        },
        {
            title: "자기 진단",
            description: "객관적인 진단 도구와 체크리스트를 통해 현재 자신의 상태를 정확히 파악할 수 있습니다.",
            examples: ["강점 진단 테스트", "가치관 체크리스트", "성격 유형 분석"]
        },
        {
            title: "실습 과제",
            description: "배운 내용을 실제 생활에 적용해볼 수 있는 구체적이고 실현 가능한 활동들을 제공합니다.",
            examples: ["3일 챌린지", "주간 실험", "행동 변화 프로젝트"]
        },
        {
            title: "성찰 기록",
            description: "경험과 깨달음을 체계적으로 정리하고 기록할 수 있는 가이드를 제공하여 지속적인 성장을 돕습니다.",
            examples: ["성찰 일기 템플릿", "변화 추적 시트", "인사이트 노트"]
        }
    ];
    
    const detail = details[index];
    if (detail) {
        // 간단한 알림으로 표시 (실제로는 모달이나 사이드바 사용 권장)
        alert(`${detail.title}\n\n${detail.description}\n\n예시: ${detail.examples.join(', ')}`);
    }
}

// 주제 카테고리 인터랙션
function initTopicCategories() {
    const topicCategories = document.querySelectorAll('.topic-category');
    
    topicCategories.forEach(category => {
        const topicItems = category.querySelectorAll('.topic-item');
        
        // 카테고리 호버 시 아이템들 순차 애니메이션
        category.addEventListener('mouseenter', function() {
            topicItems.forEach((item, index) => {
                setTimeout(() => {
                    item.style.transform = 'translateX(10px)';
                    item.style.backgroundColor = 'rgba(212, 165, 116, 0.15)';
                }, index * 100);
            });
        });
        
        category.addEventListener('mouseleave', function() {
            topicItems.forEach(item => {
                item.style.transform = 'translateX(0)';
                item.style.backgroundColor = '';
            });
        });
        
        // 개별 주제 클릭 시 상세 정보
        topicItems.forEach(item => {
            item.addEventListener('click', function() {
                this.style.backgroundColor = 'rgba(212, 165, 116, 0.3)';
                setTimeout(() => {
                    this.style.backgroundColor = '';
                }, 1000);
            });
        });
    });
}

// 샘플 콘텐츠 인터랙션
function initSampleContent() {
    const newsletterContainer = document.querySelector('.newsletter-container');
    
    if (newsletterContainer) {
        // 스크롤 진행도 표시
        const contentSections = newsletterContainer.querySelectorAll('.content-section');
        const progressIndicator = createProgressIndicator();
        
        if (progressIndicator) {
            newsletterContainer.appendChild(progressIndicator);
            
            // 스크롤 시 진행도 업데이트
            newsletterContainer.addEventListener('scroll', function() {
                updateContentProgress(this, contentSections, progressIndicator);
            });
        }
        
        // 인터랙티브 요소들 추가
        addInteractiveElements();
    }
}

// 진행도 표시기 생성
function createProgressIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'content-progress';
    indicator.innerHTML = `
        <div class="progress-bar">
            <div class="progress-fill"></div>
        </div>
        <div class="progress-text">읽는 중...</div>
    `;
    
    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .content-progress {
            position: sticky;
            bottom: 0;
            background: var(--secondary);
            color: var(--white);
            padding: 0.5rem 1rem;
            font-size: 0.8rem;
            border-radius: var(--border-radius) var(--border-radius) 0 0;
        }
        .progress-bar {
            height: 4px;
            background: rgba(255,255,255,0.3);
            border-radius: 2px;
            margin-bottom: 0.5rem;
            overflow: hidden;
        }
        .progress-fill {
            height: 100%;
            background: var(--white);
            width: 0%;
            transition: width 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    return indicator;
}

// 콘텐츠 진행도 업데이트
function updateContentProgress(container, sections, indicator) {
    const scrollTop = container.scrollTop;
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const progress = (scrollTop / scrollHeight) * 100;
    
    const progressFill = indicator.querySelector('.progress-fill');
    const progressText = indicator.querySelector('.progress-text');
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    if (progressText) {
        if (progress < 25) {
            progressText.textContent = '읽는 중...';
        } else if (progress < 50) {
            progressText.textContent = '절반 완료!';
        } else if (progress < 75) {
            progressText.textContent = '거의 다 왔어요!';
        } else if (progress < 100) {
            progressText.textContent = '마지막 부분입니다!';
        } else {
            progressText.textContent = '완독 완료! 👏';
        }
    }
}

// 인터랙티브 요소 추가
function addInteractiveElements() {
    // 체크리스트 인터랙션
    const checkItems = document.querySelectorAll('.check-item');
    checkItems.forEach(item => {
        item.style.cursor = 'pointer';
        item.addEventListener('click', function() {
            this.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
            this.style.borderLeft = '3px solid var(--success)';
            this.style.paddingLeft = '1rem';
            
            // 체크 아이콘 추가
            if (!this.querySelector('.check-icon')) {
                const checkIcon = document.createElement('span');
                checkIcon.className = 'check-icon';
                checkIcon.innerHTML = ' ✓';
                checkIcon.style.color = 'var(--success)';
                checkIcon.style.fontWeight = 'bold';
                this.appendChild(checkIcon);
            }
        });
    });
    
    // 챌린지 과제 완료 기능
    const dayTasks = document.querySelectorAll('.day-task');
    dayTasks.forEach(task => {
        task.style.cursor = 'pointer';
        task.addEventListener('click', function() {
            if (!this.classList.contains('completed')) {
                this.classList.add('completed');
                this.style.backgroundColor = 'rgba(40, 167, 69, 0.1)';
                this.style.borderColor = 'var(--success)';
                
                // 완료 표시 추가
                const completeIcon = document.createElement('span');
                completeIcon.innerHTML = ' ✅ 완료!';
                completeIcon.style.color = 'var(--success)';
                completeIcon.style.fontWeight = 'bold';
                this.appendChild(completeIcon);
            }
        });
    });
}

// 가격 플랜 인터랙션
function initPricingInteraction() {
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        const button = card.querySelector('.btn-pricing');
        
        // 카드 호버 시 버튼 강조
        card.addEventListener('mouseenter', function() {
            if (button) {
                button.style.transform = 'translateY(-3px)';
                button.style.boxShadow = 'var(--shadow-lg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (button) {
                button.style.transform = '';
                button.style.boxShadow = '';
            }
        });
        
        // 버튼 클릭 시 애니메이션
        if (button) {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                // 로딩 애니메이션
                const originalText = this.textContent;
                this.innerHTML = '<span class="loading-spinner"></span> 처리 중...';
                this.disabled = true;
                
                // 실제로는 결제 프로세스 시작
                setTimeout(() => {
                    this.innerHTML = originalText;
                    this.disabled = false;
                    
                    // 성공 메시지 표시
function showSuccessMessage(message) {
    const successModal = document.createElement('div');
    successModal.className = 'success-modal';
    successModal.innerHTML = `
        <div class="success-modal-content">
            <div class="success-icon">✅</div>
            <h3>알림</h3>
            <p>${message}</p>
            <button class="btn-daum primary" onclick="closeSuccessModal()">확인</button>
        </div>
        <div class="success-modal-overlay" onclick="closeSuccessModal()"></div>
    `;
    
    // 모달 스타일
    const style = document.createElement('style');
    style.textContent = `
        .success-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        }
        .success-modal-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
        }
        .success-modal-content {
            background: var(--white);
            padding: 3rem;
            border-radius: var(--border-radius-xl);
            text-align: center;
            position: relative;
            z-index: 1;
            max-width: 400px;
            margin: 2rem;
            box-shadow: var(--shadow-xl);
        }
        .success-icon {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
        .success-modal-content h3 {
            color: var(--primary);
            margin-bottom: 1rem;
        }
        .success-modal-content p {
            margin-bottom: 2rem;
            color: var(--gray-600);
        }
    `;
    
    if (!document.querySelector('.success-modal-styles')) {
        style.className = 'success-modal-styles';
        document.head.appendChild(style);
    }
    
    document.body.appendChild(successModal);
    
    // 애니메이션 효과
    requestAnimationFrame(() => {
        successModal.style.opacity = '0';
        successModal.style.transform = 'scale(0.9)';
        successModal.style.transition = 'all 0.3s ease';
        
        requestAnimationFrame(() => {
            successModal.style.opacity = '1';
            successModal.style.transform = 'scale(1)';
        });
    });
}

// 성공 모달 닫기
function closeSuccessModal() {
    const modal = document.querySelector('.success-modal');
    if (modal) {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
}

// 구독 폼 검증
function validateSubscriptionForm(formData) {
    const errors = [];
    
    // 이메일 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        errors.push('올바른 이메일 주소를 입력해주세요.');
    }
    
    // 이름 검증
    if (!formData.name || formData.name.trim().length < 2) {
        errors.push('이름을 2자 이상 입력해주세요.');
    }
    
    // 전화번호 검증 (선택사항)
    if (formData.phone) {
        const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
        if (!phoneRegex.test(formData.phone)) {
            errors.push('전화번호는 000-0000-0000 형식으로 입력해주세요.');
        }
    }
    
    return errors;
}

// 이메일 구독 처리
function handleEmailSubscription(email, plan = 'trial') {
    return new Promise((resolve, reject) => {
        // 실제로는 서버 API 호출
        setTimeout(() => {
            if (Math.random() > 0.1) { // 90% 성공률
                resolve({
                    success: true,
                    message: '구독이 성공적으로 완료되었습니다!',
                    subscriberId: 'SUB' + Date.now()
                });
            } else {
                reject(new Error('구독 처리 중 오류가 발생했습니다. 다시 시도해주세요.'));
            }
        }, 1500);
    });
}

// 로컬 스토리지 관리 (사용자 선호도 저장)
const UserPreferences = {
    save: function(key, value) {
        try {
            localStorage.setItem(`daum_newsletter_${key}`, JSON.stringify(value));
        } catch (e) {
            console.warn('로컬 스토리지 저장 실패:', e);
        }
    },
    
    load: function(key, defaultValue = null) {
        try {
            const stored = localStorage.getItem(`daum_newsletter_${key}`);
            return stored ? JSON.parse(stored) : defaultValue;
        } catch (e) {
            console.warn('로컬 스토리지 로드 실패:', e);
            return defaultValue;
        }
    },
    
    remove: function(key) {
        try {
            localStorage.removeItem(`daum_newsletter_${key}`);
        } catch (e) {
            console.warn('로컬 스토리지 삭제 실패:', e);
        }
    }
};

// 사용자 행동 추적 (개인정보 보호 준수)
const UserTracking = {
    trackEvent: function(eventName, eventData = {}) {
        // 실제로는 Google Analytics나 기타 분석 도구 사용
        console.log('Event tracked:', eventName, eventData);
        
        // 사용자 동의가 있는 경우에만 추적
        if (UserPreferences.load('analytics_consent', false)) {
            // 분석 도구로 데이터 전송
            this.sendToAnalytics(eventName, eventData);
        }
    },
    
    sendToAnalytics: function(eventName, eventData) {
        // Google Analytics 또는 기타 분석 도구로 데이터 전송
        // gtag('event', eventName, eventData);
    },
    
    trackPageView: function() {
        this.trackEvent('page_view', {
            page: '/services/knowledge-platform',
            timestamp: new Date().toISOString()
        });
    },
    
    trackSubscription: function(plan) {
        this.trackEvent('subscription_attempt', {
            plan: plan,
            timestamp: new Date().toISOString()
        });
    }
};

// 접근성 개선 기능
const AccessibilityEnhancements = {
    init: function() {
        this.addKeyboardNavigation();
        this.addScreenReaderSupport();
        this.addFocusManagement();
    },
    
    addKeyboardNavigation: function() {
        // 키보드로 카드 탐색
        const cards = document.querySelectorAll('.intro-card, .pricing-card, .review-card');
        
        cards.forEach(card => {
            if (!card.hasAttribute('tabindex')) {
                card.setAttribute('tabindex', '0');
            }
            
            card.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.click();
                }
            });
        });
    },
    
    addScreenReaderSupport: function() {
        // 동적으로 생성되는 콘텐츠에 ARIA 레이블 추가
        const progressBars = document.querySelectorAll('.progress-fill');
        progressBars.forEach(bar => {
            bar.setAttribute('role', 'progressbar');
            bar.setAttribute('aria-valuemin', '0');
            bar.setAttribute('aria-valuemax', '100');
        });
        
        // 상태 변경 알림
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-announcements';
        document.body.appendChild(liveRegion);
    },
    
    addFocusManagement: function() {
        // 모달 열릴 때 포커스 관리
        document.addEventListener('DOMNodeInserted', function(e) {
            if (e.target.classList && e.target.classList.contains('success-modal')) {
                const firstButton = e.target.querySelector('button');
                if (firstButton) {
                    setTimeout(() => firstButton.focus(), 100);
                }
            }
        });
    },
    
    announce: function(message) {
        const liveRegion = document.getElementById('live-announcements');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }
};

// 성능 최적화
const PerformanceOptimizations = {
    init: function() {
        this.lazyLoadImages();
        this.debounceScrollEvents();
        this.preloadCriticalResources();
    },
    
    lazyLoadImages: function() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => imageObserver.observe(img));
        } else {
            // Fallback for older browsers
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    },
    
    debounceScrollEvents: function() {
        let ticking = false;
        
        function updateOnScroll() {
            // 스크롤 이벤트 처리
            ticking = false;
        }
        
        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateOnScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', requestTick);
    },
    
    preloadCriticalResources: function() {
        // 중요한 리소스 미리 로드
        const criticalImages = [
            '/images/services/newsletter-preview.jpg',
            '/images/icons/subscription-icon.svg'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
};

// 오류 처리
const ErrorHandler = {
    init: function() {
        window.addEventListener('error', this.handleError.bind(this));
        window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    },
    
    handleError: function(event) {
        console.error('JavaScript Error:', event.error);
        this.logError('javascript_error', {
            message: event.error.message,
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno
        });
    },
    
    handlePromiseRejection: function(event) {
        console.error('Unhandled Promise Rejection:', event.reason);
        this.logError('promise_rejection', {
            reason: event.reason
        });
    },
    
    logError: function(type, details) {
        // 실제 서비스에서는 오류 로깅 서비스로 전송
        // 예: Sentry, LogRocket 등
        UserTracking.trackEvent('error', {
            type: type,
            details: details,
            userAgent: navigator.userAgent,
            url: window.location.href,
            timestamp: new Date().toISOString()
        });
    }
};

// 초기화 완료 후 추가 기능들 실행
document.addEventListener('DOMContentLoaded', function() {
    // 접근성 개선
    AccessibilityEnhancements.init();
    
    // 성능 최적화
    PerformanceOptimizations.init();
    
    // 오류 처리
    ErrorHandler.init();
    
    // 사용자 행동 추적
    UserTracking.trackPageView();
    
    // 이전 방문 기록이 있다면 환영 메시지
    const lastVisit = UserPreferences.load('last_visit');
    if (lastVisit) {
        const daysSince = Math.floor((Date.now() - lastVisit) / (1000 * 60 * 60 * 24));
        if (daysSince > 7) {
            setTimeout(() => {
                AccessibilityEnhancements.announce('다시 방문해주셔서 감사합니다!');
            }, 2000);
        }
    }
    
    // 현재 방문 시간 저장
    UserPreferences.save('last_visit', Date.now());
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', function() {
    // 사용자 세션 데이터 저장
    UserPreferences.save('session_end', Date.now());
    
    // 진행 중인 애니메이션 정리
    const animations = document.querySelectorAll('[style*="animation"]');
    animations.forEach(el => {
        el.style.animation = 'none';
    });
});

// 전역 함수로 노출 (HTML에서 호출 가능)
window.togglePlanComparison = togglePlanComparison;
window.closeSuccessModal = closeSuccessModal;
window.UserPreferences = UserPreferences;
window.UserTracking = UserTracking; // 메시지 (실제로는 리다이렉트)
                    showSuccessMessage('구독 신청이 완료되었습니다!');
                }, 2000);
            });
        }
    });
    
    // 플랜 비교 기능
    addPlanComparison();
}

// 플랜 비교 기능 추가
function addPlanComparison() {
    const pricingGrid = document.querySelector('.pricing-grid');
    
    if (pricingGrid) {
        const compareButton = document.createElement('div');
        compareButton.className = 'text-center mt-4';
        compareButton.innerHTML = `
            <button class="btn btn-outline-primary" onclick="togglePlanComparison()">
                📊 플랜 상세 비교하기
            </button>
        `;
        pricingGrid.appendChild(compareButton);
    }
}

// 플랜 비교 토글
function togglePlanComparison() {
    const existingTable = document.querySelector('.plan-comparison-table');
    
    if (existingTable) {
        existingTable.remove();
        return;
    }
    
    const comparisonTable = document.createElement('div');
    comparisonTable.className = 'plan-comparison-table mt-4';
    comparisonTable.innerHTML = `
        <div class="table-responsive">
            <table class="table table-striped">
                <thead>
                    <tr>
                        <th>기능</th>
                        <th>체험판</th>
                        <th>정기 구독</th>
                        <th>연간 구독</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>콘텐츠 수량</td>
                        <td>4편</td>
                        <td>52편</td>
                        <td>52편</td>
                    </tr>
                    <tr>
                        <td>개인 맞춤 피드백</td>
                        <td>❌</td>
                        <td>✅</td>
                        <td>✅</td>
                    </tr>
                    <tr>
                        <td>추가 자료</td>
                        <td>❌</td>
                        <td>✅</td>
                        <td>✅</td>
                    </tr>
                    <tr>
                        <td>화상 세미나</td>
                        <td>❌</td>
                        <td>✅</td>
                        <td>✅</td>
                    </tr>
                    <tr>
                        <td>1:1 상담</td>
                        <td>❌</td>
                        <td>❌</td>
                        <td>1회 무료</td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
    
    const pricingSection = document.querySelector('.subscription-plans .container');
    pricingSection.appendChild(comparisonTable);
    
    // 테이블까지 스크롤
    comparisonTable.scrollIntoView({ behavior: 'smooth' });
}

// FAQ 아코디언 강화
function initFAQEnhancements() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
        const button = item.querySelector('.accordion-button');
        const body = item.querySelector('.accordion-body');
        
        if (button && body) {
            button.addEventListener('click', function() {
                // 다른 아이템들 닫기 (하나씩만 열리도록)
                accordionItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        const otherButton = otherItem.querySelector('.accordion-button');
                        const otherBody = otherItem.querySelector('.accordion-collapse');
                        
                        if (otherButton && !otherButton.classList.contains('collapsed')) {
                            otherButton.click();
                        }
                    }
                });
            });
        }
    });
    
    // FAQ 검색 기능 추가
    addFAQSearch();
}

// FAQ 검색 기능
function addFAQSearch() {
    const faqSection = document.querySelector('.faq-section .container');
    
    if (faqSection) {
        const searchBox = document.createElement('div');
        searchBox.className = 'faq-search mb-4';
        searchBox.innerHTML = `
            <div class="input-group">
                <input type="text" class="form-control" placeholder="FAQ 검색..." id="faqSearch">
                <button class="btn btn-outline-secondary" type="button">
                    <i class="bi bi-search"></i>
                </button>
            </div>
        `;
        
        const titleWrapper = faqSection.querySelector('.section-title-wrapper');
        titleWrapper.after(searchBox);
        
        // 검색 기능
        const searchInput = searchBox.querySelector('#faqSearch');
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const accordionItems = document.querySelectorAll('.accordion-item');
            
            accordionItems.forEach(item => {
                const button = item.querySelector('.accordion-button');
                const body = item.querySelector('.accordion-body');
                const text = (button.textContent + body.textContent).toLowerCase();
                
                if (text.includes(searchTerm) || searchTerm === '') {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
}

// CTA 버튼 인터랙션
function initCTAInteractions() {
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn-daum');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // 특별한 클릭 효과
            const ripple = document.createElement('span');
            ripple.className = 'btn-ripple';
            
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,255,255,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: ripple 0.6s ease-out;
                pointer-events: none;
            `;
            
            this.style.position = 'relative';
            this.style.overflow = 'hidden';
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // 리플 효과 CSS 추가
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple {
            to {
                transform: scale(2);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

// 스크롤 진행도 표시
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress-bar';
    progressBar.innerHTML = '<div class="scroll-progress-fill"></div>';
    
    // 스타일 추가
    const style = document.createElement('style');
    style.textContent = `
        .scroll-progress-bar {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(212, 165, 116, 0.2);
            z-index: 9999;
        }
        .scroll-progress-fill {
            height: 100%;
            background: linear-gradient(135deg, var(--secondary), #e6b885);
            width: 0%;
            transition: width 0.1s ease;
        }
    `;
    document.head.appendChild(style);
    
    document.body.insertBefore(progressBar, document.body.firstChild);
    
    const progressFill = progressBar.querySelector('.scroll-progress-fill');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressFill.style.width = scrollPercent + '%';
    });
}

// 성공