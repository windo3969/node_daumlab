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
    initSlideGallery();
    initGalleryModal()
    
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
// ==================== 슬라이드 갤러리 JavaScript ==================== 

/**
 * 갤러리 관련 전역 변수
 */
let currentSlideIndex = 0;
let totalSlides = 0;
let isTransitioning = false;
let autoSlideInterval = null;
let isAutoSlideActive = true;

/**
 * 슬라이드 갤러리 초기화 함수
 */
function initSlideGallery() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    totalSlides = galleryCards.length;
    
    if (totalSlides === 0) return;
    
    // 초기 슬라이드 위치 설정
    updateSlidePositions();
    
    // 이벤트 리스너 설정
    initSlideEvents();
    
    // 터치 제스처 초기화
    initSlideTouch();
    
    // 키보드 네비게이션
    initSlideKeyboard();
    
    // 자동 슬라이드 시작
    startAutoSlide();
    
    console.log('슬라이드 갤러리가 성공적으로 초기화되었습니다.');
}

/**
 * 슬라이드 위치 업데이트
 */
function updateSlidePositions() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    const indicators = document.querySelectorAll('.gallery-indicator');
    
    galleryCards.forEach((card, index) => {
        // 모든 클래스 제거
        card.classList.remove('active', 'prev-1', 'prev-2', 'prev-3', 'next-1', 'next-2', 'next-3', 'hidden');
        
        const diff = index - currentSlideIndex;
        
        if (diff === 0) {
            card.classList.add('active');
        } else if (diff === -1) {
            card.classList.add('prev-1');
        } else if (diff === -2) {
            card.classList.add('prev-2');
        } else if (diff <= -3) {
            card.classList.add('prev-3');
        } else if (diff === 1) {
            card.classList.add('next-1');
        } else if (diff === 2) {
            card.classList.add('next-2');
        } else if (diff >= 3) {
            card.classList.add('next-3');
        }
        
        // 순환 처리
        if (diff < -3) {
            const circularDiff = totalSlides + diff;
            if (circularDiff === 1) {
                card.classList.remove('prev-3');
                card.classList.add('next-1');
            } else if (circularDiff === 2) {
                card.classList.remove('prev-3');
                card.classList.add('next-2');
            } else if (circularDiff >= 3) {
                card.classList.remove('prev-3');
                card.classList.add('next-3');
            }
        } else if (diff > 3) {
            const circularDiff = diff - totalSlides;
            if (circularDiff === -1) {
                card.classList.remove('next-3');
                card.classList.add('prev-1');
            } else if (circularDiff === -2) {
                card.classList.remove('next-3');
                card.classList.add('prev-2');
            } else if (circularDiff <= -3) {
                card.classList.remove('next-3');
                card.classList.add('prev-3');
            }
        }
    });
    
    // 인디케이터 업데이트
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlideIndex);
    });
}

/**
 * 다음 슬라이드로 이동
 */
function nextSlide() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    currentSlideIndex = (currentSlideIndex + 1) % totalSlides;
    updateSlidePositions();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 600);
    
    resetAutoSlide();
}

/**
 * 이전 슬라이드로 이동
 */
function prevSlide() {
    if (isTransitioning) return;
    
    isTransitioning = true;
    currentSlideIndex = currentSlideIndex === 0 ? totalSlides - 1 : currentSlideIndex - 1;
    updateSlidePositions();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 600);
    
    resetAutoSlide();
}

/**
 * 특정 슬라이드로 이동
 */
function goToSlide(index) {
    if (isTransitioning || index === currentSlideIndex) return;
    
    isTransitioning = true;
    currentSlideIndex = index;
    updateSlidePositions();
    
    setTimeout(() => {
        isTransitioning = false;
    }, 600);
    
    resetAutoSlide();
}

/**
 * 이벤트 리스너 초기화
 */
function initSlideEvents() {
    // 네비게이션 버튼 이벤트
    const prevBtn = document.getElementById('galleryPrevBtn');
    const nextBtn = document.getElementById('galleryNextBtn');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
        prevBtn.addEventListener('mouseenter', pauseAutoSlide);
        prevBtn.addEventListener('mouseleave', resumeAutoSlide);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
        nextBtn.addEventListener('mouseenter', pauseAutoSlide);
        nextBtn.addEventListener('mouseleave', resumeAutoSlide);
    }
    
    // 인디케이터 이벤트
    const indicators = document.querySelectorAll('.gallery-indicator');
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
        indicator.addEventListener('mouseenter', pauseAutoSlide);
        indicator.addEventListener('mouseleave', resumeAutoSlide);
    });
    
    // 카드 클릭 이벤트
    const galleryCards = document.querySelectorAll('.gallery-card');
    galleryCards.forEach((card, index) => {
        card.addEventListener('click', () => {
            if (!card.classList.contains('active')) {
                goToSlide(index);
            }
        });
        
        // 호버 시 자동 슬라이드 일시정지
        card.addEventListener('mouseenter', pauseAutoSlide);
        card.addEventListener('mouseleave', resumeAutoSlide);
    });
}

/**
 * 터치 제스처 초기화
 */
function initSlideTouch() {
    const slider = document.querySelector('.gallery-slider');
    if (!slider) return;
    
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isDragging = false;
    
    slider.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isDragging = true;
        pauseAutoSlide();
    }, { passive: true });
    
    slider.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        
        endX = e.touches[0].clientX;
        endY = e.touches[0].clientY;
        
        // 세로 스크롤 방지
        const deltaX = Math.abs(endX - startX);
        const deltaY = Math.abs(endY - startY);
        
        if (deltaX > deltaY) {
            e.preventDefault();
        }
    }, { passive: false });
    
    slider.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        
        isDragging = false;
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        // 수평 스와이프가 수직 스와이프보다 클 때만 처리
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                prevSlide(); // 오른쪽 스와이프 - 이전 슬라이드
            } else {
                nextSlide(); // 왼쪽 스와이프 - 다음 슬라이드
            }
        }
        
        resumeAutoSlide();
    }, { passive: true });
}

/**
 * 키보드 네비게이션 초기화
 */
function initSlideKeyboard() {
    document.addEventListener('keydown', (e) => {
        // 갤러리가 뷰포트에 있을 때만 작동
        const gallerySection = document.querySelector('.gallery');
        if (!gallerySection || !isElementInViewport(gallerySection)) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                prevSlide();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextSlide();
                break;
            case ' ': // 스페이스바로 자동슬라이드 토글
                e.preventDefault();
                toggleAutoSlide();
                break;
        }
    });
}

/**
 * 요소가 뷰포트에 있는지 확인
 */
function isElementInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * 자동 슬라이드 시작
 */
function startAutoSlide() {
    if (autoSlideInterval) clearInterval(autoSlideInterval);
    
    autoSlideInterval = setInterval(() => {
        if (isAutoSlideActive && !isTransitioning) {
            nextSlide();
        }
    }, 5000); // 5초마다 자동 슬라이드
}

/**
 * 자동 슬라이드 일시정지
 */
function pauseAutoSlide() {
    isAutoSlideActive = false;
}

/**
 * 자동 슬라이드 재개
 */
function resumeAutoSlide() {
    isAutoSlideActive = true;
}

/**
 * 자동 슬라이드 토글
 */
function toggleAutoSlide() {
    if (isAutoSlideActive) {
        pauseAutoSlide();
        showNotification('자동 슬라이드가 일시정지되었습니다', 'info');
    } else {
        resumeAutoSlide();
        showNotification('자동 슬라이드가 재개되었습니다', 'info');
    }
}

/**
 * 자동 슬라이드 리셋
 */
function resetAutoSlide() {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        startAutoSlide();
    }
}

/**
 * 진행바 업데이트 (선택사항)
 */
function updateProgressBar() {
    const progressBar = document.querySelector('.gallery-progress-fill');
    if (!progressBar) return;
    
    const progress = ((currentSlideIndex + 1) / totalSlides) * 100;
    progressBar.style.transform = `translateX(-${100 - progress}%)`;
}

/**
 * 갤러리 리사이즈 핸들러
 */
function handleGalleryResize() {
    // 모바일에서 카드 위치 재조정
    const isMobile = window.innerWidth < 768;
    const cards = document.querySelectorAll('.gallery-card');
    
    cards.forEach(card => {
        if (isMobile) {
            // 모바일에서는 3D 효과 최소화
            card.style.perspective = 'none';
        } else {
            card.style.perspective = '';
        }
    });
    
    updateSlidePositions();
}

/**
 * 인터섹션 옵저버로 자동 슬라이드 제어
 */
function initAutoSlideObserver() {
    const gallerySection = document.querySelector('.gallery');
    if (!gallerySection) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // 갤러리가 보이면 자동 슬라이드 시작
                resumeAutoSlide();
                if (!autoSlideInterval) {
                    startAutoSlide();
                }
            } else {
                // 갤러리가 보이지 않으면 자동 슬라이드 정지
                pauseAutoSlide();
            }
        });
    }, {
        threshold: 0.3
    });
    
    observer.observe(gallerySection);
}

/**
 * 갤러리 성능 최적화
 */
function optimizeSlideGallery() {
    // 이미지 레이지 로딩
    const images = document.querySelectorAll('.gallery-card img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    img.style.transition = 'filter 0.3s ease';
                    
                    img.onload = () => {
                        img.style.filter = 'none';
                    };
                    
                    img.onerror = () => {
                        img.style.filter = 'none';
                        img.style.backgroundColor = '#f0f0f0';
                        img.alt = '이미지를 불러올 수 없습니다';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        images.forEach(img => {
            imageObserver.observe(img);
        });
    }
    
    // 메모리 사용량 체크
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > 50 * 1024 * 1024) { // 50MB 초과
                console.warn('갤러리 메모리 사용량이 높습니다:', {
                    used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB'
                });
            }
        }, 30000);
    }
}

/**
 * 갤러리 접근성 개선
 */
function enhanceSlideAccessibility() {
    const galleryCards = document.querySelectorAll('.gallery-card');
    const indicators = document.querySelectorAll('.gallery-indicator');
    
    // 카드 접근성
    galleryCards.forEach((card, index) => {
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `갤러리 슬라이드 ${index + 1}`);
        card.setAttribute('tabindex', '0');
        
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                goToSlide(index);
            }
        });
    });
    
    // 인디케이터 접근성
    indicators.forEach((indicator, index) => {
        indicator.setAttribute('aria-label', `${index + 1}번 슬라이드로 이동`);
        indicator.setAttribute('role', 'button');
    });
    
    // 네비게이션 버튼 접근성
    const prevBtn = document.querySelector('.gallery-prev-btn');
    const nextBtn = document.querySelector('.gallery-next-btn');
    
    if (prevBtn) prevBtn.setAttribute('aria-label', '이전 슬라이드');
    if (nextBtn) nextBtn.setAttribute('aria-label', '다음 슬라이드');
}

/**
 * 알림 표시 함수
 */
function showNotification(message, type = 'info') {
    // 기존 알림 제거
    const existingNotification = document.querySelector('.slide-notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = `slide-notification slide-notification-${type}`;
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
    }, 3000);
}

// 전역 함수로 등록 (HTML에서 호출용)
window.nextSlide = nextSlide;
window.prevSlide = prevSlide;
window.goToSlide = goToSlide;

// 페이지 로드 시 갤러리 초기화
document.addEventListener('DOMContentLoaded', () => {
    // 갤러리 섹션이 있을 때만 초기화
    if (document.querySelector('.gallery-slider')) {
        initSlideGallery();
        initAutoSlideObserver();
        optimizeSlideGallery();
        enhanceSlideAccessibility();
        
        // 리사이즈 이벤트
        window.addEventListener('resize', debounce(handleGalleryResize, 250));
    }
});

// 페이지 언로드 시 정리
window.addEventListener('beforeunload', () => {
    if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
    }
});

/**
 * 디바운스 함수
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

// 알림 스타일 동적 추가
const notificationStyles = `
    .slide-notification {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 2000;
        max-width: 350px;
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    .slide-notification .notification-content {
        background: white;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        border-left: 4px solid #3b82f6;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .slide-notification-info .notification-content {
        border-left-color: #3b82f6;
    }
    
    .slide-notification .notification-close {
        background: none;
        border: none;
        font-size: 1.2rem;
        cursor: pointer;
        color: #6b7280;
        margin-left: 1rem;
    }
`;

/**
 * 필터된 갤러리 데이터 업데이트
 */
function updateFilteredGalleryData(filter) {
    const filteredImages = galleryImages.filter(img => 
        filter === 'all' || img.category === filter
    );
    
    // 현재 이미지 인덱스 리셋
    currentImageIndex = 0;
    
    // 카운터 업데이트
    updateGalleryCounter(filteredImages.length);
}

/**
 * 갤러리 모달 초기화
 */
function initGalleryModal() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    console.log("모달 초기화 완료")
    
    if (!modal) {
        console.log("혹시너니?");
        return;}
    
    // 갤러리 아이템 클릭 이벤트
    galleryItems.forEach((item, index) => {
        const viewBtn = item.querySelector('.gallery-view-btn');
        const image = item.querySelector('img');
        
        // 버튼 클릭 또는 이미지 클릭 시 모달 열기
        [viewBtn, image].forEach(element => {
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openGalleryModal(index);
                });
            }
        });
    });
    
    // 모달 외부 클릭 시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal || e.target.classList.contains('modal-backdrop')) {
            closeGalleryModal();
        }
    });
    
    // 터치 스와이프 지원
    initTouchGestures(modal);
}

/**
 * 갤러리 모달 열기
 */
function openGalleryModal(index) {
    console.log("openGalleryModal(index)")
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('galleryModalImg');
    const modalTitle = document.getElementById('galleryModalTitle');
    const modalDesc = document.getElementById('galleryModalDesc');
    
    if (!modal || !modalImg) return;
    
    // 필터된 이미지 데이터 가져오기
    const filteredImages = getFilteredImages();
    
    if (filteredImages.length === 0) return;
    
    // 인덱스 조정
    currentImageIndex = Math.min(index, filteredImages.length - 1);
    const imageData = filteredImages[currentImageIndex];
    
    // 모달 내용 설정
    modalImg.src = imageData.src;
    modalImg.alt = imageData.alt;
    modalTitle.textContent = imageData.title;
    modalDesc.textContent = imageData.description;
    
    // 카운터 업데이트
    updateGalleryCounter(filteredImages.length);
    
    // 모달 표시
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    isGalleryModalOpen = true;
    
    // 이미지 로딩 표시
    showImageLoading(modalImg);
    
    // 네비게이션 버튼 상태 업데이트
    updateNavigationButtons(filteredImages.length);
}

/**
 * 갤러리 모달 닫기
 */
function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    if (!modal) return;
    
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    isGalleryModalOpen = false;
    
    // 애니메이션 후 이미지 리셋
    setTimeout(() => {
        const modalImg = document.getElementById('galleryModalImg');
        if (modalImg) {
            modalImg.src = '';
        }
    }, 300);
}

/**
 * 이전 이미지로 이동
 */
function prevImage() {
    const filteredImages = getFilteredImages();
    if (filteredImages.length === 0) return;
    
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredImages.length - 1;
    updateModalImage(filteredImages[currentImageIndex]);
    updateGalleryCounter(filteredImages.length);
    updateNavigationButtons(filteredImages.length);
}

/**
 * 다음 이미지로 이동
 */
function nextImage() {
    const filteredImages = getFilteredImages();
    if (filteredImages.length === 0) return;
    
    currentImageIndex = currentImageIndex < filteredImages.length - 1 ? currentImageIndex + 1 : 0;
    updateModalImage(filteredImages[currentImageIndex]);
    updateGalleryCounter(filteredImages.length);
    updateNavigationButtons(filteredImages.length);
}

/**
 * 모달 이미지 업데이트
 */
function updateModalImage(imageData) {
    const modalImg = document.getElementById('galleryModalImg');
    const modalTitle = document.getElementById('galleryModalTitle');
    const modalDesc = document.getElementById('galleryModalDesc');
    
    if (!modalImg || !imageData) return;
    
    // 페이드 아웃
    modalImg.style.opacity = '0';
    
    setTimeout(() => {
        modalImg.src = imageData.src;
        modalImg.alt = imageData.alt;
        modalTitle.textContent = imageData.title;
        modalDesc.textContent = imageData.description;
        
        // 이미지 로딩 표시
        showImageLoading(modalImg);
        
        // 페이드 인
        modalImg.style.opacity = '1';
    }, 150);
}

/**
 * 이미지 로딩 상태 표시
 */
function showImageLoading(imgElement) {
    imgElement.style.filter = 'blur(5px)';
    
    imgElement.onload = () => {
        imgElement.style.filter = 'none';
    };
    
    imgElement.onerror = () => {
        imgElement.style.filter = 'none';
        imgElement.alt = '이미지를 불러올 수 없습니다';
    };
}

/**
 * 갤러리 카운터 업데이트
 */
function updateGalleryCounter(totalImages) {
    const counter = document.getElementById('galleryCounter');
    if (counter) {
        counter.textContent = `${currentImageIndex + 1} / ${totalImages}`;
    }
}

/**
 * 네비게이션 버튼 상태 업데이트
 */
function updateNavigationButtons(totalImages) {
    const prevBtn = document.querySelector('.gallery-prev');
    const nextBtn = document.querySelector('.gallery-next');
    
    if (!prevBtn || !nextBtn) return;
    
    // 이미지가 1개뿐이면 네비게이션 숨기기
    if (totalImages <= 1) {
        prevBtn.style.display = 'none';
        nextBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'flex';
        nextBtn.style.display = 'flex';
    }
}

/**
 * 현재 필터에 맞는 이미지 데이터 반환
 */
function getFilteredImages() {
    console.log("function getFilteredImages()");
    return galleryImages.filter(img => 
        currentFilter === 'all' || img.category === currentFilter
    );
}

/**
 * 키보드 네비게이션 초기화
 */
function initGalleryKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (!isGalleryModalOpen) return;
        
        switch(e.key) {
            case 'Escape':
                closeGalleryModal();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                prevImage();
                break;
            case 'ArrowRight':
                e.preventDefault();
                nextImage();
                break;
        }
    });
}

/**
 * 터치 제스처 초기화
 */
function initTouchGestures(modal) {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    
    const modalContent = modal.querySelector('.gallery-modal-content');
    if (!modalContent) return;
    
    modalContent.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
    }, { passive: true });
    
    modalContent.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        endY = e.changedTouches[0].clientY;
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const minSwipeDistance = 50;
        
        // 수평 스와이프가 수직 스와이프보다 클 때만 처리
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                prevImage(); // 오른쪽 스와이프 - 이전 이미지
            } else {
                nextImage(); // 왼쪽 스와이프 - 다음 이미지
            }
        }
    }, { passive: true });
}

/**
 * 레이지 로딩 초기화
 */
function initGalleryLazyLoading() {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // 이미지 로딩 애니메이션
                    img.style.filter = 'blur(5px)';
                    img.style.transition = 'filter 0.3s ease';
                    
                    img.onload = () => {
                        img.style.filter = 'none';
                        img.classList.add('loaded');
                    };
                    
                    // 에러 처리
                    img.onerror = () => {
                        img.style.filter = 'none';
                        img.style.backgroundColor = '#f0f0f0';
                        img.alt = '이미지를 불러올 수 없습니다';
                    };
                    
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        galleryImages.forEach(img => {
            imageObserver.observe(img);
        });
    }
}

/**
 * 더 보기 버튼 초기화
 */
function initLoadMoreButton() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', () => {
        loadMoreGalleryItems();
    });
}

/**
 * 추가 갤러리 아이템 로드
 */
function loadMoreGalleryItems() {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const galleryGrid = document.getElementById('galleryGrid');
    
    if (!loadMoreBtn || !galleryGrid) return;
    
    // 로딩 상태 표시
    const originalText = loadMoreBtn.textContent;
    loadMoreBtn.textContent = '로딩 중...';
    loadMoreBtn.disabled = true;
    
    // 추가 이미지 데이터 (실제 서비스에서는 API 호출)
    const additionalImages = [
        {
            src: '/images/gallery/workshop-02.jpg',
            title: '팀 빌딩 워크숍',
            description: '조직 구성원들의 유대감 강화',
            category: 'events'
        },
        {
            src: '/images/gallery/presentation.jpg',
            title: '연구 발표',
            description: '최신 연구 결과 공유',
            category: 'team'
        },
        {
            src: '/images/gallery/networking.jpg',
            title: '네트워킹 이벤트',
            description: '업계 전문가들과의 만남',
            category: 'events'
        }
    ];
    
    // 시뮬레이션된 로딩 시간
    setTimeout(() => {
        additionalImages.forEach((imageData, index) => {
            const newItem = createGalleryItem(imageData, galleryImages.length + index);
            galleryGrid.appendChild(newItem);
            
            // 새 아이템을 galleryImages 배열에 추가
            galleryImages.push({
                index: galleryImages.length,
                src: imageData.src,
                alt: imageData.title,
                title: imageData.title,
                description: imageData.description,
                category: imageData.category,
                element: newItem
            });
            
            // 애니메이션으로 등장
            setTimeout(() => {
                newItem.style.opacity = '1';
                newItem.style.transform = 'translateY(0)';
            }, index * 100);
        });
        
        // 버튼 상태 복원
        loadMoreBtn.textContent = originalText;
        loadMoreBtn.disabled = false;
        
        // 새로운 아이템들에 이벤트 리스너 추가
        initNewGalleryItems();
        
        // 더 이상 로드할 이미지가 없으면 버튼 숨기기
        if (galleryImages.length >= 15) { // 예시 최대 개수
            loadMoreBtn.style.display = 'none';
        }
        
    }, 1000); // 1초 로딩 시뮬레이션
}

/**
 * 갤러리 아이템 생성
 */
function createGalleryItem(imageData, index) {
    const article = document.createElement('article');
    article.className = 'gallery-item';
    article.dataset.category = imageData.category;
    article.style.opacity = '0';
    article.style.transform = 'translateY(30px)';
    article.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    
    article.innerHTML = `
        <div class="gallery-image">
            <img src="${imageData.src}" alt="${imageData.title}" loading="lazy">
            <div class="gallery-overlay">
                <div class="gallery-info">
                    <h3 class="gallery-title">${imageData.title}</h3>
                    <p class="gallery-description">${imageData.description}</p>
                </div>
                <button class="gallery-view-btn" data-src="${imageData.src}">
                    <i class="bi bi-eye" aria-hidden="true"></i>
                </button>
            </div>
        </div>
    `;
    
    return article;
}

/**
 * 새로 추가된 갤러리 아이템에 이벤트 리스너 추가
 */
function initNewGalleryItems() {
    const newItems = document.querySelectorAll('.gallery-item:not([data-initialized])');
    
    newItems.forEach((item, index) => {
        const viewBtn = item.querySelector('.gallery-view-btn');
        const image = item.querySelector('img');
        const galleryIndex = galleryImages.length - newItems.length + index;
        
        [viewBtn, image].forEach(element => {
            if (element) {
                element.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openGalleryModal(galleryIndex);
                });
            }
        });
        
        // 초기화 완료 표시
        item.dataset.initialized = 'true';
    });
}

/**
 * 갤러리 성능 최적화
 */
function optimizeGalleryPerformance() {
    // 이미지 압축 및 최적화 체크
    const images = document.querySelectorAll('.gallery-item img');
    
    images.forEach(img => {
        // 이미지 크기 체크 및 경고
        img.onload = () => {
            if (img.naturalWidth > 1920 || img.naturalHeight > 1080) {
                console.warn(`큰 이미지 감지: ${img.src} (${img.naturalWidth}x${img.naturalHeight})`);
            }
        };
    });
    
    // 메모리 사용량 모니터링
    if ('memory' in performance) {
        const checkMemory = () => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > 100 * 1024 * 1024) { // 100MB 초과
                console.warn('갤러리 메모리 사용량이 높습니다:', {
                    used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + 'MB'
                });
            }
        };
        
        setInterval(checkMemory, 30000); // 30초마다 체크
    }
}

/**
 * 갤러리 접근성 개선
 */
function enhanceGalleryAccessibility() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach((item, index) => {
        // ARIA 라벨 추가
        item.setAttribute('role', 'button');
        item.setAttribute('aria-label', `갤러리 이미지 ${index + 1} 보기`);
        item.setAttribute('tabindex', '0');
        
        // 키보드 접근성
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openGalleryModal(index);
            }
        });
    });
    
    // 모달 접근성
    const modal = document.getElementById('galleryModal');
    if (modal) {
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'galleryModalTitle');
        modal.setAttribute('aria-describedby', 'galleryModalDesc');
    }
}

// 전역 함수로 등록 (HTML에서 호출용)
window.closeGalleryModal = closeGalleryModal;
window.prevImage = prevImage;
window.nextImage = nextImage;