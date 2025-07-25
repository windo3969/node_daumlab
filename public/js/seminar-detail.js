// 세미나 상세 페이지 JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // 초기화
    initializeAOS();
    initializeVideoPlayer();
    initializeGallery();
    initializeTestimonialSlider();
    initializeScrollEffects();
    initializeRegistration();
    initializeInteractiveElements();
    finalizeInitialization();
});

// AOS (Animate On Scroll) 초기화
function initializeAOS() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: true,
            offset: 100
        });
    }
}

// 비디오 플레이어 초기화
function initializeVideoPlayer() {
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        // 비디오 로드 확인
        heroVideo.addEventListener('loadeddata', function () {
            console.log('Hero video loaded successfully');
        });

        // 비디오 에러 처리
        heroVideo.addEventListener('error', function () {
            console.error('Hero video failed to load');
            // 비디오 실패 시 대체 이미지 표시
            const container = heroVideo.parentElement;
            const fallbackImg = document.createElement('img');
            fallbackImg.src = heroVideo.dataset.fallback || '/images/seminars/hero-fallback.jpg';
            fallbackImg.className = 'hero-video';
            fallbackImg.style.objectFit = 'cover';
            container.replaceChild(fallbackImg, heroVideo);
        });

        // 모바일에서 자동재생 최적화
        if (window.innerWidth <= 768) {
            heroVideo.muted = true;
            heroVideo.playsInline = true;
        }
    }
}

// 갤러리 초기화 (Lightbox 효과)
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');

    galleryItems.forEach((item, index) => {
        item.addEventListener('click', function () {
            openLightbox(index);
        });
    });
}

// 라이트박스 열기
function openLightbox(startIndex) {
    const galleryImages = document.querySelectorAll('.gallery-item img');
    const lightbox = createLightbox(galleryImages, startIndex);
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    // 애니메이션으로 나타내기
    setTimeout(() => {
        lightbox.classList.add('active');
    }, 10);
}

// 라이트박스 생성
function createLightbox(images, startIndex) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `
        <div class="lightbox-overlay"></div>
        <div class="lightbox-container">
            <button class="lightbox-close">
                <i class="fas fa-times"></i>
            </button>
            <button class="lightbox-prev">
                <i class="fas fa-chevron-left"></i>
            </button>
            <button class="lightbox-next">
                <i class="fas fa-chevron-right"></i>
            </button>
            <div class="lightbox-content">
                <img src="${images[startIndex].src}" alt="Gallery Image" class="lightbox-image">
            </div>
            <div class="lightbox-counter">
                <span class="current">${startIndex + 1}</span> / <span class="total">${images.length}</span>
            </div>
        </div>
    `;

    // 라이트박스 CSS 추가
    if (!document.querySelector('#lightbox-styles')) {
        const styles = document.createElement('style');
        styles.id = 'lightbox-styles';
        styles.textContent = `
            .lightbox {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            .lightbox.active {
                opacity: 1;
                visibility: visible;
            }
            .lightbox-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
            }
            .lightbox-container {
                position: relative;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .lightbox-content {
                max-width: 90%;
                max-height: 90%;
                position: relative;
            }
            .lightbox-image {
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: 8px;
            }
            .lightbox-close {
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.2rem;
                transition: all 0.3s ease;
            }
            .lightbox-close:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: scale(1.1);
            }
            .lightbox-prev,
            .lightbox-next {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                background: rgba(255, 255, 255, 0.1);
                border: none;
                color: white;
                width: 60px;
                height: 60px;
                border-radius: 50%;
                cursor: pointer;
                font-size: 1.5rem;
                transition: all 0.3s ease;
            }
            .lightbox-prev {
                left: 20px;
            }
            .lightbox-next {
                right: 20px;
            }
            .lightbox-prev:hover,
            .lightbox-next:hover {
                background: rgba(255, 255, 255, 0.2);
                transform: translateY(-50%) scale(1.1);
            }
            .lightbox-counter {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.7);
                color: white;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 0.9rem;
            }
            @media (max-width: 768px) {
                .lightbox-prev, .lightbox-next {
                    width: 50px;
                    height: 50px;
                    font-size: 1.2rem;
                }
                .lightbox-prev {
                    left: 10px;
                }
                .lightbox-next {
                    right: 10px;
                }
                .lightbox-close {
                    top: 10px;
                    right: 10px;
                    width: 40px;
                    height: 40px;
                    font-size: 1rem;
                }
            }
        `;
        document.head.appendChild(styles);
    }

    let currentIndex = startIndex;

    // 이벤트 리스너
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => closeLightbox(lightbox));
    lightbox.querySelector('.lightbox-overlay').addEventListener('click', () => closeLightbox(lightbox));

    lightbox.querySelector('.lightbox-prev').addEventListener('click', () => {
        currentIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
        updateLightboxImage(lightbox, images[currentIndex].src, currentIndex, images.length);
    });

    lightbox.querySelector('.lightbox-next').addEventListener('click', () => {
        currentIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
        updateLightboxImage(lightbox, images[currentIndex].src, currentIndex, images.length);
    });

    // 키보드 이벤트
    const handleKeyPress = (e) => {
        if (e.key === 'Escape') {
            closeLightbox(lightbox);
        } else if (e.key === 'ArrowLeft') {
            lightbox.querySelector('.lightbox-prev').click();
        } else if (e.key === 'ArrowRight') {
            lightbox.querySelector('.lightbox-next').click();
        }
    };

    document.addEventListener('keydown', handleKeyPress);
    lightbox.handleKeyPress = handleKeyPress;

    return lightbox;
}

// 라이트박스 이미지 업데이트
function updateLightboxImage(lightbox, src, index, total) {
    const img = lightbox.querySelector('.lightbox-image');
    const counter = lightbox.querySelector('.lightbox-counter');

    img.style.opacity = '0';
    setTimeout(() => {
        img.src = src;
        img.style.opacity = '1';
        counter.querySelector('.current').textContent = index + 1;
    }, 150);
}

// 라이트박스 닫기
function closeLightbox(lightbox) {
    lightbox.classList.remove('active');
    document.removeEventListener('keydown', lightbox.handleKeyPress);
    setTimeout(() => {
        if (document.body.contains(lightbox)) {
            document.body.removeChild(lightbox);
        }
        document.body.style.overflow = '';
    }, 300);
}

// 후기 슬라이더 초기화 (Swiper)
function initializeTestimonialSlider() {
    // Swiper가 로드되었는지 확인
    if (typeof Swiper !== 'undefined') {
        new Swiper('.testimonials-slider .swiper-container', {
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
                },
                1024: {
                    slidesPerView: 3,
                }
            }
        });
    } else {
        // Swiper가 없을 경우 대체 슬라이더 구현
        initializeFallbackSlider();
    }
}

// 대체 슬라이더 구현
function initializeFallbackSlider() {
    const slider = document.querySelector('.testimonials-slider');
    if (!slider) return;

    const slides = slider.querySelectorAll('.swiper-slide');
    if (slides.length === 0) return;

    let currentSlide = 0;

    // 슬라이드 표시/숨김
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
    }

    // 자동 슬라이드
    function autoSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    showSlide(0);
    setInterval(autoSlide, 5000);
}

// 스크롤 효과 초기화
function initializeScrollEffects() {
    // 스크롤 인디케이터 애니메이션
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            const target = document.querySelector('.instructor-section');
            if (target) {
                smoothScrollTo(target);
            }
        });
    }

    // 네비게이션 하이라이트
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                smoothScrollTo(target);
            }
        });
    });

    // 스크롤 시 헤더 효과
    let lastScrollY = window.scrollY;
    window.addEventListener('scroll', throttle(() => {
        const currentScrollY = window.scrollY;
        const header = document.querySelector('#header');

        if (header) {
            if (currentScrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }

        updateScrollProgress();
        lastScrollY = currentScrollY;
    }, 16));
}

// 등록 기능 초기화
function initializeRegistration() {
    const registerButtons = document.querySelectorAll('.btn-register:not(.disabled)');

    registerButtons.forEach(button => {
        button.addEventListener('click', function () {
            const schedule = this.dataset.schedule;
            openRegistrationModal(schedule);
        });
    });
}

// 등록 모달 열기
function openRegistrationModal(schedule) {
    // 모달이 이미 있는지 확인
    let modal = document.querySelector('#registrationModal');

    if (!modal) {
        modal = createRegistrationModal();
        document.body.appendChild(modal);
    }

    // 선택된 일정 정보 업데이트
    updateModalSchedule(modal, schedule);

    // 모달 표시
    if (typeof bootstrap !== 'undefined') {
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    } else {
        // Bootstrap 없을 경우 커스텀 모달
        modal.style.display = 'block';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

// 등록 모달 생성
function createRegistrationModal() {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.id = 'registrationModal';
    modal.setAttribute('tabindex', '-1');
    modal.innerHTML = `
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">세미나 신청</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <form id="seminarRegistrationForm">
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="name" class="form-label">이름 *</label>
                                <input type="text" class="form-control" id="name" name="name" required>
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="phone" class="form-label">연락처 *</label>
                                <input type="tel" class="form-control" id="phone" name="phone" required>
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">이메일 *</label>
                            <input type="email" class="form-control" id="email" name="email" required>
                        </div>
                        <div class="row">
                            <div class="col-md-6 mb-3">
                                <label for="company" class="form-label">소속</label>
                                <input type="text" class="form-control" id="company" name="company">
                            </div>
                            <div class="col-md-6 mb-3">
                                <label for="position" class="form-label">직책</label>
                                <input type="text" class="form-control" id="position" name="position">
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="schedule" class="form-label">선택 일정</label>
                            <input type="text" class="form-control" id="schedule" name="schedule" readonly>
                        </div>
                        <div class="mb-3">
                            <label for="motivation" class="form-label">참가 동기</label>
                            <textarea class="form-control" id="motivation" name="motivation" rows="3" placeholder="세미나에 참가하고자 하는 이유를 간략히 적어주세요."></textarea>
                        </div>
                        <div class="mb-3">
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="privacy" name="privacy" required>
                                <label class="form-check-label" for="privacy">
                                    개인정보 수집 및 이용에 동의합니다. *
                                </label>
                            </div>
                            <div class="form-check">
                                <input class="form-check-input" type="checkbox" id="marketing" name="marketing">
                                <label class="form-check-label" for="marketing">
                                    마케팅 정보 수신에 동의합니다. (선택)
                                </label>
                            </div>
                        </div>
                        <div class="d-grid">
                            <button type="submit" class="btn-submit">
                                <span class="submit-text">신청하기</span>
                                <span class="submit-loading" style="display: none;">
                                    <span class="loading-spinner"></span>
                                    처리 중...
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    `;

    // 폼 제출 이벤트
    const form = modal.querySelector('#seminarRegistrationForm');
    form.addEventListener('submit', handleRegistrationSubmit);

    // 닫기 버튼 이벤트 (Bootstrap 없을 경우)
    const closeBtn = modal.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
        if (typeof bootstrap === 'undefined') {
            modal.style.display = 'none';
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }
    });

    return modal;
}

// 모달 일정 정보 업데이트
function updateModalSchedule(modal, schedule) {
    const scheduleInput = modal.querySelector('#schedule');
    const formattedDate = new Date(schedule).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    scheduleInput.value = formattedDate;
}

// 등록 폼 제출 처리
async function handleRegistrationSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitBtn = form.querySelector('.btn-submit');
    const submitText = submitBtn.querySelector('.submit-text');
    const submitLoading = submitBtn.querySelector('.submit-loading');

    // 로딩 상태 시작
    submitBtn.disabled = true;
    submitText.style.display = 'none';
    submitLoading.style.display = 'flex';

    try {
        // 폼 데이터 수집
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        // 서버에 데이터 전송 (실제 구현에서는 실제 API 엔드포인트 사용)
        const response = await fetch('/api/seminar-registration', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // 성공 처리
            showSuccessMessage();
            form.reset();

            // 모달 닫기
            setTimeout(() => {
                const modal = document.querySelector('#registrationModal');
                if (typeof bootstrap !== 'undefined') {
                    bootstrap.Modal.getInstance(modal).hide();
                } else {
                    modal.style.display = 'none';
                    modal.classList.remove('show');
                    document.body.style.overflow = '';
                }
            }, 2000);
        } else {
            throw new Error('Registration failed');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showErrorMessage();
    } finally {
        // 로딩 상태 종료
        submitBtn.disabled = false;
        submitText.style.display = 'block';
        submitLoading.style.display = 'none';
    }
}

// 성공 메시지 표시
function showSuccessMessage() {
    const message = document.createElement('div');
    message.className = 'alert alert-success';
    message.innerHTML = `
        <i class="fas fa-check-circle"></i>
        신청이 완료되었습니다! 확인 이메일을 발송해드렸습니다.
    `;

    const modal = document.querySelector('#registrationModal .modal-body');
    modal.insertBefore(message, modal.firstChild);

    setTimeout(() => {
        message.remove();
    }, 3000);
}

// 에러 메시지 표시
function showErrorMessage() {
    const message = document.createElement('div');
    message.className = 'alert alert-danger';
    message.innerHTML = `
        <i class="fas fa-exclamation-triangle"></i>
        신청 처리 중 오류가 발생했습니다. 다시 시도해주세요.
    `;

    const modal = document.querySelector('#registrationModal .modal-body');
    modal.insertBefore(message, modal.firstChild);

    setTimeout(() => {
        message.remove();
    }, 3000);
}

// 인터랙티브 요소 초기화
function initializeInteractiveElements() {
    // 커리큘럼 카드 호버 효과
    const curriculumCards = document.querySelectorAll('.curriculum-card');
    curriculumCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // 통계 카운터 애니메이션
    const statNumbers = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    });

    statNumbers.forEach(stat => {
        observer.observe(stat);
    });

    // 가용성 바 애니메이션
    const availabilityBars = document.querySelectorAll('.availability-fill');
    const barObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const originalWidth = entry.target.style.width;
                entry.target.style.width = '0%';
                entry.target.style.transition = 'width 1.5s ease-in-out';
                setTimeout(() => {
                    entry.target.style.width = originalWidth;
                }, 100);
                barObserver.unobserve(entry.target);
            }
        });
    });

    availabilityBars.forEach(bar => {
        barObserver.observe(bar);
    });
}

// 카운터 애니메이션
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^0-9]/g, ''));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }

        if (element.textContent.includes('+')) {
            element.textContent = Math.floor(current) + '+';
        } else if (element.textContent.includes('%')) {
            element.textContent = Math.floor(current) + '%';
        } else {
            element.textContent = Math.floor(current).toLocaleString();
        }
    }, 16);
}

// 부드러운 스크롤 효과
function smoothScrollTo(element, duration = 1000) {
    const targetPosition = element.offsetTop - 100;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// 반응형 처리
function handleResponsiveFeatures() {
    const handleResize = () => {
        // 모바일에서 비디오 최적화
        const heroVideo = document.querySelector('.hero-video');
        if (heroVideo && window.innerWidth <= 768) {
            heroVideo.muted = true;
            heroVideo.playsInline = true;
        }

        // 갤러리 그리드 조정
        const galleryGrid = document.querySelector('.gallery-grid');
        if (galleryGrid) {
            if (window.innerWidth <= 576) {
                galleryGrid.style.gridTemplateColumns = '1fr';
            } else if (window.innerWidth <= 768) {
                galleryGrid.style.gridTemplateColumns = 'repeat(2, 1fr)';
            } else {
                galleryGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
            }
        }

        // 모달 크기 조정
        const modal = document.querySelector('#registrationModal .modal-dialog');
        if (modal) {
            if (window.innerWidth <= 768) {
                modal.classList.remove('modal-lg');
                modal.classList.add('modal-fullscreen-sm-down');
            } else {
                modal.classList.add('modal-lg');
                modal.classList.remove('modal-fullscreen-sm-down');
            }
        }
    };

    window.addEventListener('resize', throttle(handleResize, 250));
    handleResize(); // 초기 실행
}

// 성능 최적화
function optimizePerformance() {
    // 이미지 지연 로딩
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
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

// 스크롤 진행률 업데이트
function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    // 스크롤 진행률 바 업데이트 (있다면)
    const progressBar = document.querySelector('.scroll-progress');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }

    // 섹션 하이라이트
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const navLink = document.querySelector(`a[href="#${section.id}"]`);

        if (rect.top <= 100 && rect.bottom >= 100 && navLink) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            navLink.classList.add('active');
        }
    });
}

// 접근성 개선
function enhanceAccessibility() {
    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
        // ESC 키로 모달 닫기
        if (e.key === 'Escape') {
            const openModal = document.querySelector('.modal.show');
            if (openModal) {
                trapFocus(openModal, e);
            }

            if (openModal) {
                const closeBtn = openModal.querySelector('.btn-close');
                if (closeBtn) closeBtn.click();
            }
        }

        // Tab 키 트랩 (모달 내부)
        if (e.key === 'Tab') {
            const openModal = document.querySelector('.modal.show');
        }
    });


    // 포커스 관리
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function trapFocus(element, event) {
        const focusableContent = element.querySelectorAll(focusableElements);
        const firstFocusableElement = focusableContent[0];
        const lastFocusableElement = focusableContent[focusableContent.length - 1];

        if (event.shiftKey) {
            if (document.activeElement === firstFocusableElement) {
                lastFocusableElement.focus();
                event.preventDefault();
            }
        } else {
            if (document.activeElement === lastFocusableElement) {
                firstFocusableElement.focus();
                event.preventDefault();
            }
        }
    }

    // ARIA 라벨 동적 업데이트
    const scheduleCards = document.querySelectorAll('.schedule-card');
    scheduleCards.forEach((card, index) => {
        const button = card.querySelector('.btn-register');
        const date = card.querySelector('.schedule-date');
        const available = card.querySelector('.available');

        if (button && date && available) {
            const dateText = date.textContent.trim();
            const availableText = available.textContent.trim();
            button.setAttribute('aria-label', `${dateText} 일정 신청하기, ${availableText}`);
        }
    });
}

// 에러 처리 및 폴백
function setupErrorHandling() {
    // 이미지 로드 실패 처리
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            if (this.dataset.fallbackHandled) return;
            this.dataset.fallbackHandled = 'true';

            this.style.display = 'none';

            // 대체 텍스트 표시
            const placeholder = document.createElement('div');
            placeholder.className = 'image-placeholder';
            placeholder.innerHTML = `
                <i class="fas fa-image"></i>
                <span>이미지를 불러올 수 없습니다</span>
            `;
            placeholder.style.cssText = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: #f8f9fa;
                color: #6c757d;
                padding: 2rem;
                border-radius: 8px;
                min-height: 200px;
                width: 100%;
            `;

            this.parentNode.insertBefore(placeholder, this.nextSibling);
        });
    });

    // 전역 에러 처리
    window.addEventListener('error', (e) => {
        console.error('JavaScript Error:', e.error);
        // 사용자에게 친화적인 에러 메시지 표시 (선택적)
    });

    // 네트워크 연결 상태 감지
    window.addEventListener('online', () => {
        const offlineMessage = document.querySelector('.offline-message');
        if (offlineMessage) {
            offlineMessage.remove();
        }
    });

    window.addEventListener('offline', () => {
        showOfflineMessage();
    });
}

// 오프라인 메시지 표시
function showOfflineMessage() {
    if (document.querySelector('.offline-message')) return;

    const message = document.createElement('div');
    message.className = 'offline-message';
    message.innerHTML = `
        <div class="alert alert-warning" style="position: fixed; top: 20px; right: 20px; z-index: 10001; max-width: 300px;">
            <i class="fas fa-wifi"></i>
            인터넷 연결을 확인해주세요.
        </div>
    `;
    document.body.appendChild(message);
}

// 초기화 완료 후 추가 설정
function finalizeInitialization() {
    handleResponsiveFeatures();
    optimizePerformance();
    enhanceAccessibility();
    setupErrorHandling();

    // 페이지 로드 완료 이벤트
    document.body.classList.add('page-loaded');

    // 사용자 인터랙션 추적 (선택적)
    trackUserInteractions();

    console.log('Seminar detail page initialized successfully');
}

// 사용자 인터랙션 추적
function trackUserInteractions() {
    // 스크롤 깊이 추적
    let maxScroll = 0;
    window.addEventListener('scroll', throttle(() => {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
        }
    }, 1000));

    // 페이지 이탈 시 최대 스크롤 기록
    window.addEventListener('beforeunload', () => {
        console.log('Max scroll depth:', maxScroll + '%');
    });

    // 버튼 클릭 추적
    document.querySelectorAll('.btn-register, .btn-seminar').forEach(btn => {
        btn.addEventListener('click', function () {
            console.log('Button clicked:', this.textContent.trim());
        });
    });

    // 갤러리 이미지 조회 추적
    document.querySelectorAll('.gallery-item').forEach((item, index) => {
        item.addEventListener('click', function () {
            console.log('Gallery image viewed:', index + 1);
        });
    });
}

// 유틸리티 함수들

// 쓰로틀 함수
function throttle(func, limit) {
    let inThrottle;
    return function () {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// 디바운스 함수
function debounce(func, wait, immediate) {
    let timeout;
    return function () {
        const context = this, args = arguments;
        const later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// 요소가 뷰포트에 있는지 확인
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

// 애니메이션 지원 확인
function supportsAnimation() {
    const el = document.createElement('div');
    return typeof el.style.animationName !== 'undefined';
}

// 터치 디바이스 확인
function isTouchDevice() {
    return (('ontouchstart' in window) ||
        (navigator.maxTouchPoints > 0) ||
        (navigator.msMaxTouchPoints > 0));
}

// 브라우저 지원 확인
function checkBrowserSupport() {
    const supportedFeatures = {
        intersectionObserver: 'IntersectionObserver' in window,
        requestAnimationFrame: 'requestAnimationFrame' in window,
        localStorage: 'localStorage' in window,
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid')
    };

    console.log('Browser support:', supportedFeatures);

    // 필수 기능이 지원되지 않는 경우 폴백 처리
    if (!supportedFeatures.intersectionObserver) {
        // IntersectionObserver 폴백
        console.warn('IntersectionObserver not supported, using fallback');
        // 모든 애니메이션을 즉시 실행
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.classList.add('aos-animate');
        });
    }

    return supportedFeatures;
}

// 폼 유효성 검사 강화
function enhanceFormValidation() {
    const form = document.querySelector('#seminarRegistrationForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach(input => {
        // 실시간 유효성 검사
        input.addEventListener('blur', function () {
            validateField(this);
        });

        input.addEventListener('input', function () {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });

    // 전화번호 포맷팅
    const phoneInput = form.querySelector('#phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function () {
            this.value = formatPhoneNumber(this.value);
        });
    }
}

// 필드 유효성 검사
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // 필수 필드 검사
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = '필수 항목입니다.';
    }

    // 이메일 형식 검사
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = '올바른 이메일 형식이 아닙니다.';
        }
    }

    // 전화번호 형식 검사
    if (field.type === 'tel' && value) {
        const phoneRegex = /^[0-9-]{10,13}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            errorMessage = '올바른 전화번호 형식이 아닙니다.';
        }
    }

    // UI 업데이트
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
        const feedback = field.parentElement.querySelector('.invalid-feedback');
        if (feedback) feedback.remove();
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');

        let feedback = field.parentElement.querySelector('.invalid-feedback');
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback';
            field.parentElement.appendChild(feedback);
        }
        feedback.textContent = errorMessage;
    }

    return isValid;
}

// 전화번호 포맷팅
function formatPhoneNumber(value) {
    const cleaned = value.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
    if (match) {
        return match[1] + '-' + match[2] + '-' + match[3];
    }
    return value;
}

// 개발자 도구 감지 (선택적)
function detectDevTools() {
    let devtools = { open: false, orientation: null };
    setInterval(() => {
        if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
            if (!devtools.open) {
                devtools.open = true;
                console.log('Developer tools opened');
            }
        } else {
            if (devtools.open) {
                devtools.open = false;
                console.log('Developer tools closed');
            }
        }
    }, 500);
}

// 성능 모니터링
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const navigation = performance.getEntriesByType('navigation')[0];
                const paint = performance.getEntriesByType('paint');

                console.log('Performance metrics:', {
                    loadTime: navigation.loadEventEnd - navigation.fetchStart,
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.fetchStart,
                    firstPaint: paint.find(p => p.name === 'first-paint')?.startTime,
                    firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime
                });
            }, 0);
        });
    }
}

// 메모리 사용량 모니터링
function monitorMemory() {
    if ('memory' in performance) {
        setInterval(() => {
            const memory = performance.memory;
            if (memory.usedJSHeapSize > memory.jsHeapSizeLimit * 0.9) {
                console.warn('High memory usage detected');
            }
        }, 30000); // 30초마다 체크
    }
}

// 초기화 체인 완료
document.addEventListener('DOMContentLoaded', () => {
    checkBrowserSupport();
    enhanceFormValidation();

    // 개발 모드에서만 실행
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        detectDevTools();
        monitorPerformance();
        monitorMemory();
    }
});