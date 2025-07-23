// ==================== ABOUT 페이지 전용 JavaScript ==================== 

/**
 * About 페이지 초기화 함수
 */
document.addEventListener('DOMContentLoaded', function() {
    initAboutPage();
});

/**
 * About 페이지 메인 초기화 함수
 */
function initAboutPage() {
    // 기본 기능 초기화
    initScrollAnimations();
    initCounterAnimations();
    initFloatingCard();
    initVisionCards();
    initTeamCardHovers();
    initContactForm();
    initMapInteraction();
    initValueCards();
    
    // 성능 최적화
    initLazyLoading();
    initIntersectionObserver();
    
    console.log('About 페이지가 성공적으로 초기화되었습니다.');
}

/**
 * 스크롤 애니메이션 초기화
 */
function initScrollAnimations() {
    const animationElements = document.querySelectorAll('.story-card, .team-card, .value-card-detailed, .vision-card, .cert-category');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    animationElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        animationObserver.observe(element);
    });
}

/**
 * 숫자 카운터 애니메이션
 */
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number, .page-stats .stat-number');
    
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

/**
 * 개별 카운터 애니메이션 함수
 */
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // 원본 텍스트의 형식 유지 (%, + 등)
        const originalText = element.textContent;
        const suffix = originalText.replace(/[\d,]/g, '');
        const formattedNumber = Math.floor(current).toLocaleString();
        
        element.textContent = formattedNumber + suffix;
    }, 16);
}

/**
 * 플로팅 카드 인터랙션
 */
function initFloatingCard() {
    const floatingCard = document.querySelector('.floating-card');
    if (!floatingCard) return;
    
    // 마우스 호버 시 애니메이션 일시정지
    floatingCard.addEventListener('mouseenter', () => {
        floatingCard.style.animationPlayState = 'paused';
    });
    
    floatingCard.addEventListener('mouseleave', () => {
        floatingCard.style.animationPlayState = 'running';
    });
    
    // 랜덤 메시지 표시
    const messages = [
        '개인의 정체성을 찾아가는 여정',
        '조직의 고유한 문화 형성',
        '진정한 다움의 발견',
        '잠재력을 현실로 만드는 힘'
    ];
    
    const cardText = floatingCard.querySelector('.card-text');
    if (cardText) {
        let messageIndex = 0;
        setInterval(() => {
            cardText.style.opacity = '0';
            setTimeout(() => {
                cardText.textContent = messages[messageIndex];
                cardText.style.opacity = '1';
                messageIndex = (messageIndex + 1) % messages.length;
            }, 300);
        }, 4000);
    }
}

/**
 * 비전 카드 인터랙션
 */
function initVisionCards() {
    const visionCards = document.querySelectorAll('.vision-card');
    
    visionCards.forEach((card, index) => {
        // 순차적 등장 애니메이션
        card.style.animationDelay = `${index * 0.2}s`;
        
        // 호버 시 다른 카드들 흐리게 처리
        card.addEventListener('mouseenter', () => {
            visionCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.opacity = '0.7';
                    otherCard.style.transform = 'scale(0.98)';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            visionCards.forEach(otherCard => {
                otherCard.style.opacity = '1';
                otherCard.style.transform = 'scale(1)';
            });
        });
    });
}

/**
 * 팀 카드 호버 효과
 */
function initTeamCardHovers() {
    const teamCards = document.querySelectorAll('.team-card');
    
    teamCards.forEach(card => {
        const overlay = card.querySelector('.team-overlay');
        const image = card.querySelector('.team-image img');
        
        if (overlay && image) {
            card.addEventListener('mouseenter', () => {
                overlay.style.opacity = '1';
                image.style.transform = 'scale(1.1)';
            });
            
            card.addEventListener('mouseleave', () => {
                overlay.style.opacity = '0';
                image.style.transform = 'scale(1)';
            });
        }
    });
}

/**
 * 연락처 폼 검증
 */
function initContactForm() {
    const contactButtons = document.querySelectorAll('.contact-buttons .btn-daum');
    
    contactButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            // 버튼 클릭 시 로딩 효과
            const originalText = button.textContent;
            button.textContent = '처리 중...';
            button.style.opacity = '0.7';
            button.disabled = true;
            
            // 실제 서비스에서는 실제 처리 로직 구현
            setTimeout(() => {
                button.textContent = originalText;
                button.style.opacity = '1';
                button.disabled = false;
            }, 1500);
        });
    });
}

/**
 * 지도 인터랙션
 */
function initMapInteraction() {
    const mapContainer = document.querySelector('.map-container');
    if (!mapContainer) return;
    
    // 지도 클릭 시 확대 모달 (선택사항)
    mapContainer.addEventListener('click', () => {
        showMapModal();
    });
    
    // 교통편 정보 토글
    const transportMethods = document.querySelectorAll('.transport-method');
    transportMethods.forEach(method => {
        const title = method.querySelector('h5');
        const content = method.querySelector('ul');
        
        if (title && content) {
            title.style.cursor = 'pointer';
            title.addEventListener('click', () => {
                const isVisible = content.style.display !== 'none';
                content.style.display = isVisible ? 'none' : 'block';
                
                // 아이콘 회전 효과
                const icon = title.querySelector('i');
                if (icon) {
                    icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(90deg)';
                }
            });
        }
    });
}

/**
 * 지도 모달 표시 (선택사항)
 */
function showMapModal() {
    const modal = document.createElement('div');
    modal.className = 'map-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="closeMapModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>다움연구소 위치</h3>
                <button onclick="closeMapModal()" class="modal-close">&times;</button>
            </div>
            <div class="modal-body">
                <div class="map-large">
                    <!-- 실제 서비스에서는 실제 지도 API 사용 -->
                    <img src="/images/about/location-map-large.jpg" alt="다움연구소 상세 위치 지도" class="img-fluid">
                </div>
                <div class="location-details">
                    <p><strong>주소:</strong> 서울특별시 강남구 테헤란로 123, 8층</p>
                    <p><strong>전화:</strong> 02-123-4567</p>
                    <p><strong>가장 가까운 지하철역:</strong> 2호선 역삼역 3번 출구</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden'; // 배경 스크롤 방지
    
    // 애니메이션
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
    
    // 전역 함수로 등록
    window.closeMapModal = function() {
        modal.style.opacity = '0';
        setTimeout(() => {
            if (modal.parentNode) {
                modal.parentNode.removeChild(modal);
            }
            document.body.style.overflow = 'auto';
        }, 300);
    };
}

/**
 * 가치 카드 인터랙션
 */
function initValueCards() {
    const valueCards = document.querySelectorAll('.value-card-detailed');
    
    valueCards.forEach((card, index) => {
        // 순차적 등장
        card.style.animationDelay = `${index * 0.15}s`;
        
        // 원칙 리스트 애니메이션
        const principlesList = card.querySelector('.principles-list');
        if (principlesList) {
            const listItems = principlesList.querySelectorAll('li');
            
            card.addEventListener('mouseenter', () => {
                listItems.forEach((item, itemIndex) => {
                    setTimeout(() => {
                        item.style.transform = 'translateX(5px)';
                        item.style.color = 'var(--primary)';
                    }, itemIndex * 100);
                });
            });
            
            card.addEventListener('mouseleave', () => {
                listItems.forEach(item => {
                    item.style.transform = 'translateX(0)';
                    item.style.color = 'var(--gray-600)';
                });
            });
        }
    });
}

/**
 * 레이지 로딩 초기화
 */
function initLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.classList.add('fade-in');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * Intersection Observer 초기화
 */
function initIntersectionObserver() {
    // 네비게이션 활성화
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                
                // 네비게이션 활성화 업데이트
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, {
        threshold: 0.3,
        rootMargin: '-20% 0px -20% 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
}

/**
 * 스크롤 진행률 표시
 */
function initScrollProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    progressBar.innerHTML = '<div class="progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.progress-fill');
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progressFill.style.width = `${Math.min(scrolled, 100)}%`;
    });
}

/**
 * 부드러운 스크롤 구현
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href === '#') return;
            
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                
                const headerHeight = document.querySelector('#header')?.offsetHeight || 80;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 인증서 카테고리 필터링
 */
function initCertificationFilter() {
    const filterButtons = document.querySelectorAll('.cert-filter-btn');
    const certCategories = document.querySelectorAll('.cert-category');
    
    if (filterButtons.length === 0) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            // 활성 버튼 변경
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // 카테고리 필터링
            certCategories.forEach(category => {
                if (filter === 'all' || category.dataset.category === filter) {
                    category.style.display = 'block';
                    setTimeout(() => {
                        category.style.opacity = '1';
                        category.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    category.style.opacity = '0';
                    category.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        category.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/**
 * 키보드 접근성 개선
 */
function initAccessibility() {
    // 포커스 가능한 요소들
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                if (element.tagName === 'BUTTON' || element.getAttribute('role') === 'button') {
                    e.preventDefault();
                    element.click();
                }
            }
        });
    });
    
    // 스킵 링크 추가
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = '본문으로 바로가기';
    skipLink.className = 'skip-link sr-only';
    skipLink.addEventListener('focus', () => {
        skipLink.classList.remove('sr-only');
    });
    skipLink.addEventListener('blur', () => {
        skipLink.classList.add('sr-only');
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

/**
 * 성능 최적화 - 디바운스 함수
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 윈도우 리사이즈 핸들러
 */
function initResponsiveHandlers() {
    const handleResize = debounce(() => {
        // 모바일/데스크톱 전환 시 애니메이션 재설정
        const isMobile = window.innerWidth < 768;
        const cards = document.querySelectorAll('.vision-card, .team-card, .value-card-detailed');
        
        cards.forEach(card => {
            if (isMobile) {
                card.style.transform = 'none';
                card.style.transition = 'opacity 0.3s ease';
            } else {
                card.style.transition = 'all 0.3s ease, transform 0.3s ease';
            }
        });
        
        // 지도 높이 조정
        const mapEmbed = document.querySelector('.map-embed');
        if (mapEmbed) {
            mapEmbed.style.height = isMobile ? '200px' : '300px';
        }
    }, 250);
    
    window.addEventListener('resize', handleResize);
}

/**
 * 오류 처리 및 로깅
 */
function initErrorHandling() {
    window.addEventListener('error', (e) => {
        console.error('About 페이지 오류:', {
            message: e.message,
            filename: e.filename,
            line: e.lineno,
            column: e.colno,
            error: e.error
        });
        
        // 사용자에게 친화적인 오류 메시지 표시 (선택사항)
        showNotification('일시적인 오류가 발생했습니다. 페이지를 새로고침해 주세요.', 'error');
    });
}

/**
 * 알림 표시 함수
 */
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // 자동 제거
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
    }, 5000);
}

/**
 * 페이지 성능 모니터링
 */
function initPerformanceMonitoring() {
    // 페이지 로드 시간 측정
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`About 페이지 로드 시간: ${Math.round(loadTime)}ms`);
        
        // 성능이 낮을 경우 애니메이션 비활성화
        if (loadTime > 3000) {
            document.body.classList.add('reduce-animations');
        }
    });
    
    // 메모리 사용량 모니터링 (지원되는 브라우저에서만)
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB 초과
                console.warn('메모리 사용량이 높습니다:', {
                    used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                    total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + 'MB'
                });
            }
        }, 30000); // 30초마다 체크
    }
}

// CSS for notifications and modal (동적으로 추가)
const additionalStyles = `
    .map-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 2000;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
    }
    
    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        border-radius: 12px;
        max-width: 90vw;
        max-height: 90vh;
        overflow: hidden;
        box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
    }
    
    .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
    }
    
    .modal-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: #6b7280;
    }
    
    .modal-body {
        padding: 1.5rem;
    }
    
    .map-large img {
        width: 100%;
        height: auto;
        border-radius: 8px;
    }
    
    .location-details {
        margin-top: 1rem;
        padding: 1rem;
        background: #f9fafb;
        border-radius: 8px;
    }
    
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1500;
        max-width: 400px;
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    .notification-content {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #3b82f6;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .notification-error .notification-content {
        border-left-color: #ef4444;
    }
    
    .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #6b7280;
        margin-left: 1rem;
    }
    
    .scroll-progress {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: rgba(0, 0, 0, 0.1);
        z-index: 1001;
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(135deg, #d4a574, #e6b885);
        width: 0%;
        transition: width 0.1s ease;
    }
    
    .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #1a365d;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1002;
        transition: top 0.3s ease;
    }
    
    .skip-link:focus {
        top: 6px;
    }
    
    .reduce-animations * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
`;

// 스타일 동적 추가
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// 모든 초기화 함수 실행
document.addEventListener('DOMContentLoaded', function() {
    initAboutPage();
    initSmoothScroll();
    initScrollProgress();
    initCertificationFilter();
    initAccessibility();
    initResponsiveHandlers();
    initErrorHandling();
    initPerformanceMonitoring();
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    // 타이머 정리
    const timers = window.aboutPageTimers || [];
    timers.forEach(timer => clearInterval(timer));
    
    // 이벤트 리스너 정리 (필요한 경우)
    console.log('About 페이지 정리 완료');
});