/**
 * 세미나 목록 페이지 JavaScript
 * 다움연구소 웹사이트
 */

document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

/**
 * 페이지 초기화
 */
function initializePage() {
    initializeHeroAnimations();
    initializeCounterAnimations();
    initializeFilterSystem();
    initializeSearchFunction();
    initializeTestimonialsSlider();
    initializeScrollAnimations();
    initializeSmoothScroll();
    initializeVideoModal();
    initializeLoadMore();
    initializeIntersectionObserver();
}

/**
 * 히어로 섹션 애니메이션
 */
function initializeHeroAnimations() {
    const heroContent = document.querySelector('.hero-content');
    const heroVideoPreview = document.querySelector('.hero-video-preview');
    
    if (heroContent) {
        // 히어로 콘텐츠 순차 애니메이션
        const elements = heroContent.querySelectorAll('.hero-badge, .hero-title, .hero-subtitle, .hero-description, .hero-stats, .hero-actions');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.8s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });
    }
    
    if (heroVideoPreview) {
        // 비디오 프리뷰 카드 애니메이션
        setTimeout(() => {
            heroVideoPreview.style.opacity = '0';
            heroVideoPreview.style.transform = 'translateX(50px)';
            heroVideoPreview.style.transition = 'all 1s ease';
            
            setTimeout(() => {
                heroVideoPreview.style.opacity = '1';
                heroVideoPreview.style.transform = 'translateX(0)';
            }, 100);
        }, 800);
    }
}

/**
 * 카운터 애니메이션
 */
function initializeCounterAnimations() {
    const counters = document.querySelectorAll('[data-count]');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2초
        const increment = target / (duration / 16); // 60fps 기준
        let current = 0;
        
        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };
        
        updateCounter();
    };
    
    // Intersection Observer로 뷰포트에 들어왔을 때 애니메이션 실행
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

/**
 * 필터 시스템
 */
function initializeFilterSystem() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const seminarCards = document.querySelectorAll('.seminar-card');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 활성 탭 변경
            filterTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const category = tab.getAttribute('data-category');
            
            // 카드 필터링 애니메이션
            seminarCards.forEach(card => {
                card.classList.add('filtering');
                
                setTimeout(() => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.classList.remove('filtering', 'filtered');
                        card.style.display = 'block';
                    } else {
                        card.classList.add('filtered');
                        card.style.display = 'none';
                    }
                }, 250);
            });
            
            // 필터링 완료 후 애니메이션 리셋
            setTimeout(() => {
                seminarCards.forEach(card => {
                    if (!card.classList.contains('filtered')) {
                        card.classList.remove('filtering');
                    }
                });
            }, 500);
        });
    });
}

/**
 * 검색 기능
 */
function initializeSearchFunction() {
    const searchInput = document.getElementById('seminar-search');
    const seminarCards = document.querySelectorAll('.seminar-card');
    const searchButton = document.querySelector('.search-box button');
    
    if (!searchInput) return;
    
    const performSearch = () => {
        const query = searchInput.value.toLowerCase().trim();
        
        seminarCards.forEach(card => {
            const title = card.querySelector('.card-title a').textContent.toLowerCase();
            const description = card.querySelector('.card-description').textContent.toLowerCase();
            const category = card.querySelector('.card-category').textContent.toLowerCase();
            
            const matches = title.includes(query) || 
                          description.includes(query) || 
                          category.includes(query);
            
            card.classList.add('filtering');
            
            setTimeout(() => {
                if (query === '' || matches) {
                    card.classList.remove('filtering', 'filtered');
                    card.style.display = 'block';
                } else {
                    card.classList.add('filtered');
                    card.style.display = 'none';
                }
            }, 250);
        });
        
        // 필터링 완료 후 애니메이션 리셋
        setTimeout(() => {
            seminarCards.forEach(card => {
                if (!card.classList.contains('filtered')) {
                    card.classList.remove('filtering');
                }
            });
        }, 500);
    };
    
    // 검색 입력 이벤트
    searchInput.addEventListener('input', debounce(performSearch, 300));
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            performSearch();
        }
    });
    
    // 검색 버튼 클릭
    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }
}

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

/**
 * 후기 슬라이더 초기화 (Swiper)
 */
function initializeTestimonialsSlider() {
    if (typeof Swiper === 'undefined') {
        console.warn('Swiper library not loaded');
        return;
    }
    
    const swiperContainer = document.querySelector('.testimonials-slider .swiper-container');
    if (!swiperContainer) return;
    
    new Swiper(swiperContainer, {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            768: {
                slidesPerView: 2,
                spaceBetween: 30,
            },
            1024: {
                slidesPerView: 3,
                spaceBetween: 40,
            }
        },
        on: {
            slideChange: function() {
                // 슬라이드 변경 시 애니메이션 효과
                const activeSlide = this.slides[this.activeIndex];
                if (activeSlide) {
                    activeSlide.querySelector('.testimonial-card').style.transform = 'scale(1.05)';
                    setTimeout(() => {
                        activeSlide.querySelector('.testimonial-card').style.transform = 'scale(1)';
                    }, 300);
                }
            }
        }
    });
}

/**
 * 스크롤 애니메이션
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * 부드러운 스크롤
 */
function initializeSmoothScroll() {
    const smoothScrollLinks = document.querySelectorAll('.smooth-scroll');
    
    smoothScrollLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerHeight = document.querySelector('header')?.offsetHeight || 80;
                const targetPosition = targetElement.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * 비디오 모달
 */
function initializeVideoModal() {
    const playButtons = document.querySelectorAll('.play-button');
    const videoModal = document.getElementById('videoModal');
    const modalVideo = document.getElementById('modalVideo');
    
    if (!videoModal || !modalVideo) return;
    
    playButtons.forEach(button => {
        button.addEventListener('click', () => {
            const videoSrc = button.getAttribute('data-video');
            if (videoSrc) {
                modalVideo.querySelector('source').src = videoSrc;
                modalVideo.load();
                
                // Bootstrap 모달 열기 (Bootstrap 5)
                if (typeof bootstrap !== 'undefined') {
                    const modal = new bootstrap.Modal(videoModal);
                    modal.show();
                } else {
                    // Bootstrap이 없을 경우 기본 표시
                    videoModal.style.display = 'block';
                    videoModal.classList.add('show');
                }
            }
        });
    });
    
    // 모달 닫기 시 비디오 정지
    videoModal.addEventListener('hidden.bs.modal', () => {
        modalVideo.pause();
        modalVideo.currentTime = 0;
    });
    
    // ESC 키로 모달 닫기
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('show')) {
            modalVideo.pause();
            modalVideo.currentTime = 0;
        }
    });
}

/**
 * 더보기 버튼 기능
 */
function initializeLoadMore() {
    const loadMoreBtn = document.getElementById('load-more-btn');
    const seminarsGrid = document.getElementById('seminars-grid');
    
    if (!loadMoreBtn || !seminarsGrid) return;
    
    // 추가 세미나 데이터 (실제로는 서버에서 가져와야 함)
    const additionalSeminars = [
        {
            id: 'time-management',
            title: '시간 관리 마스터',
            subtitle: 'Time Management Master',
            category: 'productivity',
            image: '/images/seminars/time-management.jpg',
            description: '효과적인 시간 관리 기법으로 생산성을 극대화하는 방법을 학습합니다.',
            duration: '4시간',
            participants: '15-25명',
            location: '강남센터',
            earlyPrice: '120,000원',
            regularPrice: '150,000원',
            nextDate: '9월 10일',
            badges: ['new', 'beginner'],
            highlights: ['시간 분석', '우선순위 설정', '효율성 향상']
        },
        {
            id: 'emotional-intelligence',
            title: '감정 지능 향상',
            subtitle: 'Emotional Intelligence',
            category: 'psychology',
            image: '/images/seminars/emotional-intelligence.jpg',
            description: '자신과 타인의 감정을 이해하고 관리하는 능력을 기르는 과정입니다.',
            duration: '6시간',
            participants: '10-15명',
            location: '홍대스튜디오',
            earlyPrice: '200,000원',
            regularPrice: '250,000원',
            nextDate: '9월 18일',
            badges: ['popular', 'intermediate'],
            highlights: ['자기 인식', '공감 능력', '관계 관리']
        }
    ];
    
    let currentIndex = 0;
    const itemsPerLoad = 2;
    
    loadMoreBtn.addEventListener('click', () => {
        loadMoreBtn.classList.add('loading');
        loadMoreBtn.disabled = true;
        
        // 로딩 시뮬레이션
        setTimeout(() => {
            const itemsToLoad = additionalSeminars.slice(currentIndex, currentIndex + itemsPerLoad);
            
            itemsToLoad.forEach((seminar, index) => {
                const seminarCard = createSeminarCard(seminar);
                seminarCard.style.opacity = '0';
                seminarCard.style.transform = 'translateY(30px)';
                seminarsGrid.appendChild(seminarCard);
                
                // 순차 애니메이션
                setTimeout(() => {
                    seminarCard.style.transition = 'all 0.6s ease';
                    seminarCard.style.opacity = '1';
                    seminarCard.style.transform = 'translateY(0)';
                }, index * 200);
            });
            
            currentIndex += itemsPerLoad;
            
            // 더 이상 로드할 아이템이 없으면 버튼 숨기기
            if (currentIndex >= additionalSeminars.length) {
                loadMoreBtn.style.display = 'none';
            }
            
            loadMoreBtn.classList.remove('loading');
            loadMoreBtn.disabled = false;
        }, 1500);
    });
}

/**
 * 세미나 카드 생성
 */
function createSeminarCard(seminar) {
    const cardElement = document.createElement('div');
    cardElement.className = 'seminar-card';
    cardElement.setAttribute('data-category', seminar.category);
    
    const badgesHtml = seminar.badges.map(badge => 
        `<span class="badge badge-${badge}">${getBadgeText(badge)}</span>`
    ).join('');
    
    const highlightsHtml = seminar.highlights.map(highlight => 
        `<div class="highlight-item">${highlight}</div>`
    ).join('');
    
    cardElement.innerHTML = `
        <div class="card-image">
            <img src="${seminar.image}" alt="${seminar.title}">
            <div class="card-overlay">
                <div class="overlay-content">
                    <a href="/seminars/${seminar.id}" class="btn btn-outline-light">
                        <i class="fas fa-arrow-right"></i>
                        자세히 보기
                    </a>
                </div>
            </div>
            <div class="card-badges">
                ${badgesHtml}
            </div>
        </div>
        
        <div class="card-content">
            <div class="card-category">
                <i class="fas fa-lightbulb"></i>
                ${getCategoryText(seminar.category)}
            </div>
            
            <h3 class="card-title">
                <a href="/seminars/${seminar.id}">${seminar.title}</a>
            </h3>
            
            <p class="card-subtitle">${seminar.subtitle}</p>
            
            <p class="card-description">${seminar.description}</p>
            
            <div class="card-features">
                <div class="feature">
                    <i class="fas fa-clock"></i>
                    <span>${seminar.duration}</span>
                </div>
                <div class="feature">
                    <i class="fas fa-users"></i>
                    <span>${seminar.participants}</span>
                </div>
                <div class="feature">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${seminar.location}</span>
                </div>
            </div>
            
            <div class="card-highlights">
                ${highlightsHtml}
            </div>
            
            <div class="card-footer">
                <div class="price-info">
                    <div class="early-price">
                        <span class="label">얼리버드</span>
                        <span class="price">${seminar.earlyPrice}</span>
                    </div>
                    <div class="regular-price">${seminar.regularPrice}</div>
                </div>
                
                <div class="next-schedule">
                    <i class="fas fa-calendar"></i>
                    <span>${seminar.nextDate}</span>
                </div>
            </div>
        </div>
    `;
    
    return cardElement;
}

/**
 * 배지 텍스트 반환
 */
function getBadgeText(badge) {
    const badgeTexts = {
        'popular': '인기',
        'premium': '프리미엄',
        'new': '신규',
        'bestseller': '베스트',
        'beginner': '초급',
        'intermediate': '중급',
        'advanced': '고급'
    };
    return badgeTexts[badge] || badge;
}

/**
 * 카테고리 텍스트 반환
 */
function getCategoryText(category) {
    const categoryTexts = {
        'identity': '개인 정체성',
        'branding': '개인 브랜딩',
        'leadership': '리더십',
        'communication': '커뮤니케이션',
        'productivity': '생산성',
        'psychology': '심리학'
    };
    return categoryTexts[category] || category;
}

/**
 * Intersection Observer 초기화
 */
function initializeIntersectionObserver() {
    // 카드 hover 효과 개선
    const seminarCards = document.querySelectorAll('.seminar-card');
    
    seminarCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // 다른 카드들 약간 축소
            seminarCards.forEach(otherCard => {
                if (otherCard !== card) {
                    otherCard.style.transform = 'scale(0.95)';
                    otherCard.style.opacity = '0.7';
                }
            });
        });
        
        card.addEventListener('mouseleave', () => {
            // 모든 카드 원상복구
            seminarCards.forEach(otherCard => {
                otherCard.style.transform = 'scale(1)';
                otherCard.style.opacity = '1';
            });
        });
    });
    
    // 스크롤 진행률 표시 (선택사항)
    initializeScrollProgress();
}

/**
 * 스크롤 진행률 표시
 */
function initializeScrollProgress() {
    // 스크롤 진행률 바 생성
    const progressBar = document.createElement('div');
    progressBar.style.position = 'fixed';
    progressBar.style.top = '0';
    progressBar.style.left = '0';
    progressBar.style.width = '0%';
    progressBar.style.height = '3px';
    progressBar.style.background = 'linear-gradient(135deg, var(--secondary), #e6b885)';
    progressBar.style.zIndex = '9999';
    progressBar.style.transition = 'width 0.1s ease';
    document.body.appendChild(progressBar);
    
    // 스크롤 이벤트
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset;
        const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / documentHeight) * 100;
        
        progressBar.style.width = scrollPercent + '%';
    });
}

/**
 * 페이지 성능 최적화
 */
function optimizePerformance() {
    // 이미지 레이지 로딩
    const images = document.querySelectorAll('img[data-src]');
    
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
    
    images.forEach(img => {
        imageObserver.observe(img);
    });
}

/**
 * 오류 처리
 */
function handleErrors() {
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
        // 에러 로깅 또는 사용자 알림 (선택사항)
    });
    
    // 이미지 로드 실패 처리
    document.addEventListener('error', (e) => {
        if (e.target.tagName === 'IMG') {
            e.target.src = '/images/placeholder.jpg'; // 기본 이미지
            e.target.alt = '이미지를 불러올 수 없습니다';
        }
    }, true);
}

/**
 * 접근성 개선
 */
function improveAccessibility() {
    // 키보드 네비게이션 개선
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    focusableElements.forEach(element => {
        element.addEventListener('focus', () => {
            element.style.outline = '2px solid var(--secondary)';
            element.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', () => {
            element.style.outline = 'none';
        });
    });
    
    // ARIA 라벨 동적 추가
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach((tab, index) => {
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', tab.classList.contains('active'));
        tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
    });
}

// 페이지 성능 및 접근성 초기화
document.addEventListener('DOMContentLoaded', () => {
    optimizePerformance();
    handleErrors();
    improveAccessibility();
});