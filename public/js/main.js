// 다움연구소 메인 JavaScript

(function() {
    'use strict';

    // ==================== 전역 변수 ==================== //
    let currentSlideIndex = 0;
    let slideInterval;
    let isScrolling = false;

    // ==================== DOM 요소들 ==================== //
    const elements = {
        header: document.getElementById('header'),
        scrollToTopBtn: document.getElementById('scrollToTop'),
        slides: document.querySelectorAll('.slide'),
        dots: document.querySelectorAll('.dot'),
        prevBtn: document.querySelector('.prev-btn'),
        nextBtn: document.querySelector('.next-btn'),
        footerNewsletterForm: document.getElementById('footerNewsletterForm'),
        contactForms: document.querySelectorAll('form[id*="contact"], form[id*="consulting"]'),
        animateElements: document.querySelectorAll('.animate-on-scroll')
    };

    // ==================== 초기화 ==================== //
    document.addEventListener('DOMContentLoaded', function() {
        initializeAll();
    });

    function initializeAll() {
        initializeNavigation();
        initializeSlideshow();
        initializeScrollEffects();
        initializeForms();
        initializeAnimations();
        initializeSmoothScroll();
        console.log('🎉 다움연구소 웹사이트가 로드되었습니다!');
    }

    // ==================== 네비게이션 ==================== //
    function initializeNavigation() {
        // 스크롤에 따른 헤더 스타일 변경
        window.addEventListener('scroll', throttle(updateHeaderOnScroll, 10));
        
        // 모바일 메뉴 자동 닫기
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
        const navbarCollapse = document.querySelector('.navbar-collapse');
        
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    bootstrap.Collapse.getInstance(navbarCollapse)?.hide();
                }
            });
        });

        // 현재 페이지 활성화
        updateActiveNavigation();
    }

    function updateHeaderOnScroll() {
        const scrolled = window.pageYOffset > 50;
        
        if (elements.header) {
            elements.header.style.backdropFilter = scrolled ? 'blur(10px)' : 'none';
            elements.header.style.backgroundColor = scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 1)';
        }

        // 맨 위로 버튼 표시/숨김
        if (elements.scrollToTopBtn) {
            elements.scrollToTopBtn.classList.toggle('visible', scrolled);
        }
    }

    function updateActiveNavigation() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.navbar-nav .nav-link, .dropdown-item');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPath || (currentPath === '/' && href === '/')) {
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
            }
        });
    }

    // ==================== 슬라이드쇼 ==================== //
    function initializeSlideshow() {
        if (!elements.slides.length) return;

        // 초기 슬라이드 설정
        showSlide(0);
        
        // 자동 슬라이드 시작
        startAutoSlide();
        
        // 이벤트 리스너 등록
        if (elements.prevBtn) elements.prevBtn.addEventListener('click', () => changeSlide(-1));
        if (elements.nextBtn) elements.nextBtn.addEventListener('click', () => changeSlide(1));
        
        elements.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => goToSlide(index));
        });

        // 마우스 오버시 자동 슬라이드 정지
        const slideshowContainer = document.querySelector('.slideshow-container');
        if (slideshowContainer) {
            slideshowContainer.addEventListener('mouseenter', stopAutoSlide);
            slideshowContainer.addEventListener('mouseleave', startAutoSlide);
        }

        // 키보드 내비게이션
        document.addEventListener('keydown', handleSlideKeyboard);
    }

    function showSlide(index) {
        if (!elements.slides.length) return;

        // 모든 슬라이드 숨기기
        elements.slides.forEach(slide => {
            slide.classList.remove('active');
            slide.setAttribute('aria-hidden', 'true');
        });
        
        // 모든 닷 비활성화
        elements.dots.forEach(dot => {
            dot.classList.remove('active');
            dot.setAttribute('aria-selected', 'false');
        });

        // 현재 슬라이드 활성화
        if (elements.slides[index]) {
            elements.slides[index].classList.add('active');
            elements.slides[index].setAttribute('aria-hidden', 'false');
        }
        
        if (elements.dots[index]) {
            elements.dots[index].classList.add('active');
            elements.dots[index].setAttribute('aria-selected', 'true');
        }

        currentSlideIndex = index;
    }

    function changeSlide(direction) {
        const newIndex = (currentSlideIndex + direction + elements.slides.length) % elements.slides.length;
        goToSlide(newIndex);
    }

    function goToSlide(index) {
        stopAutoSlide();
        showSlide(index);
        startAutoSlide();
    }

    function startAutoSlide() {
        stopAutoSlide();
        slideInterval = setInterval(() => {
            changeSlide(1);
        }, 5000);
    }

    function stopAutoSlide() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }

    function handleSlideKeyboard(e) {
        if (!document.querySelector('.slideshow-container:hover')) return;
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                changeSlide(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                changeSlide(1);
                break;
        }
    }

    // ==================== 스크롤 효과 ==================== //
    function initializeScrollEffects() {
        // 맨 위로 버튼 기능
        if (elements.scrollToTopBtn) {
            elements.scrollToTopBtn.addEventListener('click', scrollToTop);
        }

        // 스크롤 애니메이션
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(handleScrollAnimation, observerOptions);
        
        // 애니메이션 요소들 관찰
        document.querySelectorAll('.case-card, .value-card, .business-card, .pricing-card').forEach(el => {
            el.classList.add('animate-on-scroll');
            observer.observe(el);
        });
    }

    function scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    function handleScrollAnimation(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                entry.target.style.animationDelay = Math.random() * 0.3 + 's';
            }
        });
    }

    // ==================== 폼 처리 ==================== //
    function initializeForms() {
        // 뉴스레터 구독 폼
        if (elements.footerNewsletterForm) {
            elements.footerNewsletterForm.addEventListener('submit', handleNewsletterSubmit);
        }

        // 문의/컨설팅 폼들
        elements.contactForms.forEach(form => {
            form.addEventListener('submit', handleFormSubmit);
            addFormValidation(form);
        });

        // 실시간 유효성 검사
        document.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', clearFieldError);
        });
    }

    async function handleNewsletterSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const email = formData.get('email');
        
        if (!validateEmail(email)) {
            showFormMessage(form, '올바른 이메일 주소를 입력해주세요.', 'error');
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        try {
            setButtonLoading(submitBtn, true);
            
            const response = await fetch('/contact/newsletter', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                showFormMessage(form, '뉴스레터 구독이 완료되었습니다! 감사합니다.', 'success');
                form.reset();
            } else {
                throw new Error(result.message || '구독 처리 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Newsletter subscription error:', error);
            showFormMessage(form, error.message, 'error');
        } finally {
            setButtonLoading(submitBtn, false, originalText);
        }
    }

    async function handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // 폼 유효성 검사
        if (!validateForm(form)) {
            return;
        }

        const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
        const originalText = submitBtn.textContent || submitBtn.value;
        
        try {
            setButtonLoading(submitBtn, true);
            
            const response = await fetch(form.action || '/contact', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                showFormMessage(form, '문의가 성공적으로 전송되었습니다. 빠른 시간 내에 답변드리겠습니다.', 'success');
                form.reset();
                
                // 성공시 페이지 리다이렉트 (선택사항)
                setTimeout(() => {
                    if (response.redirected) {
                        window.location.href = response.url;
                    }
                }, 2000);
            } else {
                throw new Error('서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
            }
        } finally {
            setButtonLoading(submitBtn, false, originalText);
        }
    }

    function addFormValidation(form) {
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            field.addEventListener('invalid', (e) => {
                e.preventDefault();
                showFieldError(field, getValidationMessage(field));
            });
        });
    }

    function validateForm(form) {
        let isValid = true;
        const fields = form.querySelectorAll('input, textarea, select');
        
        fields.forEach(field => {
            if (!validateField({ target: field })) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    function validateField(e) {
        const field = e.target;
        const value = field.value.trim();
        let isValid = true;
        let message = '';

        // 필수 필드 검사
        if (field.required && !value) {
            message = '필수 입력 항목입니다.';
            isValid = false;
        }
        // 이메일 형식 검사
        else if (field.type === 'email' && value && !validateEmail(value)) {
            message = '올바른 이메일 형식이 아닙니다.';
            isValid = false;
        }
        // 전화번호 형식 검사
        else if (field.type === 'tel' && value && !validatePhone(value)) {
            message = '올바른 전화번호 형식이 아닙니다.';
            isValid = false;
        }
        // 최소/최대 길이 검사
        else if (field.minLength && value.length < field.minLength) {
            message = `최소 ${field.minLength}자 이상 입력해주세요.`;
            isValid = false;
        }
        else if (field.maxLength && value.length > field.maxLength) {
            message = `최대 ${field.maxLength}자까지 입력 가능합니다.`;
            isValid = false;
        }

        if (!isValid) {
            showFieldError(field, message);
        } else {
            clearFieldError({ target: field });
        }

        return isValid;
    }

    function showFieldError(field, message) {
        field.classList.add('is-invalid');
        
        let errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            field.parentNode.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        
        // 접근성을 위한 ARIA 속성
        field.setAttribute('aria-invalid', 'true');
        field.setAttribute('aria-describedby', errorElement.id || 'error-' + field.name);
    }

    function clearFieldError(e) {
        const field = e.target;
        field.classList.remove('is-invalid');
        
        const errorElement = field.parentNode.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        field.removeAttribute('aria-invalid');
        field.removeAttribute('aria-describedby');
    }

    function getValidationMessage(field) {
        if (field.validity.valueMissing) {
            return '필수 입력 항목입니다.';
        }
        if (field.validity.typeMismatch) {
            return field.type === 'email' ? '올바른 이메일 형식이 아닙니다.' : '올바른 형식이 아닙니다.';
        }
        if (field.validity.tooShort) {
            return `최소 ${field.minLength}자 이상 입력해주세요.`;
        }
        if (field.validity.tooLong) {
            return `최대 ${field.maxLength}자까지 입력 가능합니다.`;
        }
        return '올바른 값을 입력해주세요.';
    }

    function showFormMessage(form, message, type) {
        // 기존 메시지 제거
        const existingAlert = form.querySelector('.alert');
        if (existingAlert) {
            existingAlert.remove();
        }

        // 새 메시지 생성
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type === 'error' ? 'danger' : 'success'}`;
        alertDiv.textContent = message;
        
        // 메시지를 폼 상단에 추가
        form.insertBefore(alertDiv, form.firstChild);
        
        // 메시지로 스크롤
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 3초 후 자동 제거 (성공 메시지만)
        if (type === 'success') {
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        }
    }

    function setButtonLoading(button, isLoading, originalText = '') {
        if (isLoading) {
            button.disabled = true;
            button.innerHTML = '<span class="loading-spinner"></span> 처리중...';
        } else {
            button.disabled = false;
            button.textContent = originalText || '전송하기';
        }
    }

    // ==================== 유틸리티 함수들 ==================== //
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePhone(phone) {
        const phoneRegex = /^[0-9\-\s\+\(\)]{8,}$/;
        return phoneRegex.test(phone);
    }

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
        }
    }

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

    // ==================== 부드러운 스크롤 ==================== //
    function initializeSmoothScroll() {
        // 앵커 링크 부드러운 스크롤
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                
                // 빈 앵커나 페이지 최상단 링크 처리
                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    scrollToTop();
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = elements.header ? elements.header.offsetHeight : 0;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // ==================== 애니메이션 초기화 ==================== //
    function initializeAnimations() {
        // CSS 애니메이션 지연 시간 랜덤 설정
        document.querySelectorAll('.case-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        document.querySelectorAll('.value-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.15}s`;
        });

        document.querySelectorAll('.business-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
        });

        // 카드 호버 효과 개선
        addCardHoverEffects();
    }

    function addCardHoverEffects() {
        const cards = document.querySelectorAll('.case-card, .value-card, .business-card, .pricing-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
                this.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // ==================== 키보드 네비게이션 ==================== //
    document.addEventListener('keydown', function(e) {
        // ESC 키로 모달이나 드롭다운 닫기
        if (e.key === 'Escape') {
            // 열린 드롭다운 메뉴 닫기
            const openDropdowns = document.querySelectorAll('.dropdown-menu.show');
            openDropdowns.forEach(dropdown => {
                const bsDropdown = bootstrap.Dropdown.getInstance(dropdown.previousElementSibling);
                if (bsDropdown) bsDropdown.hide();
            });
            
            // 열린 모바일 메뉴 닫기
            const openNavbar = document.querySelector('.navbar-collapse.show');
            if (openNavbar) {
                const bsCollapse = bootstrap.Collapse.getInstance(openNavbar);
                if (bsCollapse) bsCollapse.hide();
            }
        }
        
        // Ctrl/Cmd + K로 검색 (추후 검색 기능 추가시)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            // 검색 모달 열기 로직 (추후 구현)
            console.log('검색 기능은 추후 구현 예정입니다.');
        }
    });

    // ==================== 성능 최적화 ==================== //
    
    // 이미지 지연 로딩
    function initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
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

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // 페이지 가시성 API로 성능 최적화
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 페이지가 숨겨졌을 때 애니메이션 중지
            stopAutoSlide();
        } else {
            // 페이지가 다시 보일 때 애니메이션 재시작
            if (elements.slides.length > 0) {
                startAutoSlide();
            }
        }
    });

    // ==================== 에러 처리 ==================== //
    window.addEventListener('error', function(e) {
        console.error('JavaScript 오류:', e.error);
        // 프로덕션에서는 에러 로깅 서비스로 전송
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': e.error.toString(),
                'fatal': false
            });
        }
    });

    // ==================== 브라우저 호환성 체크 ==================== //
    function checkBrowserSupport() {
        const isIE = navigator.userAgent.indexOf('MSIE') !== -1 || navigator.appVersion.indexOf('Trident/') > -1;
        
        if (isIE) {
            const message = document.createElement('div');
            message.innerHTML = `
                <div style="background: #f8d7da; color: #721c24; padding: 1rem; text-align: center; position: fixed; top: 0; left: 0; right: 0; z-index: 9999;">
                    이 웹사이트는 Internet Explorer에서 제대로 작동하지 않을 수 있습니다. 
                    <a href="https://www.google.com/chrome/" style="color: #721c24; text-decoration: underline;">Chrome</a>, 
                    <a href="https://www.mozilla.org/firefox/" style="color: #721c24; text-decoration: underline;">Firefox</a>, 
                    <a href="https://www.microsoft.com/edge" style="color: #721c24; text-decoration: underline;">Edge</a> 등 
                    최신 브라우저 사용을 권장합니다.
                </div>
            `;
            document.body.insertBefore(message, document.body.firstChild);
        }
    }

    // ==================== 초기화 완료 후 실행 ==================== //
    window.addEventListener('load', function() {
        initializeLazyLoading();
        checkBrowserSupport();
        
        // 페이지 로딩 완료 이벤트 발송 (Google Analytics 등)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href
            });
        }
    });

    // ==================== 공개 API ==================== //
    // 전역 객체로 필요한 함수들 노출
    window.DaumInstitute = {
        scrollToTop: scrollToTop,
        goToSlide: goToSlide,
        validateEmail: validateEmail,
        validatePhone: validatePhone,
        showFormMessage: showFormMessage
    };

})();

// 성공 사례 페이지 JavaScript

(function() {
    'use strict';

    // DOM 요소들
    const elements = {
        filterTabs: document.querySelectorAll('.filter-tab'),
        caseItems: document.querySelectorAll('.case-item'),
        casesGrid: document.getElementById('casesGrid'),
        loadMoreBtn: document.getElementById('loadMoreBtn')
    };

    // 현재 활성화된 필터
    let currentFilter = 'all';
    let visibleCases = 6; // 처음에 보여줄 사례 수

    // 초기화
    document.addEventListener('DOMContentLoaded', function() {
        initializeFilters();
        initializeLoadMore();
        initializeAnimations();
        console.log('✅ 성공 사례 페이지 초기화 완료');
    });

    // 필터 기능 초기화
    function initializeFilters() {
        if (!elements.filterTabs.length) return;

        elements.filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const filter = this.dataset.filter;
                setActiveFilter(this);
                filterCases(filter);
            });
        });

        // 초기 필터 적용
        filterCases(currentFilter);
    }

    // 활성 필터 탭 설정
    function setActiveFilter(activeTab) {
        elements.filterTabs.forEach(tab => {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
        currentFilter = activeTab.dataset.filter;
    }

    // 사례 필터링
    function filterCases(filter) {
        const filteredCases = Array.from(elements.caseItems).filter(item => {
            if (filter === 'all') return true;
            return item.dataset.category === filter;
        });

        // 모든 사례 숨기기
        elements.caseItems.forEach(item => {
            item.classList.add('hidden');
            setTimeout(() => {
                item.style.display = 'none';
            }, 300);
        });

        // 필터된 사례 보여주기
        setTimeout(() => {
            filteredCases.slice(0, visibleCases).forEach((item, index) => {
                item.style.display = 'block';
                setTimeout(() => {
                    item.classList.remove('hidden');
                }, index * 50);
            });

            // 더보기 버튼 표시/숨김
            updateLoadMoreButton(filteredCases.length);
        }, 300);
    }

    // 더보기 버튼 초기화
    function initializeLoadMore() {
        if (!elements.loadMoreBtn) return;

        elements.loadMoreBtn.addEventListener('click', function() {
            loadMoreCases();
        });
    }

    // 더 많은 사례 로드
    function loadMoreCases() {
        const filteredCases = Array.from(elements.caseItems).filter(item => {
            if (currentFilter === 'all') return true;
            return item.dataset.category === currentFilter;
        });

        const hiddenCases = filteredCases.filter(item => 
            item.style.display === 'none' || item.classList.contains('hidden')
        );

        const casesToShow = hiddenCases.slice(0, 3); // 한 번에 3개씩 더 보여주기

        casesToShow.forEach((item, index) => {
            item.style.display = 'block';
            setTimeout(() => {
                item.classList.remove('hidden');
            }, index * 100);
        });

        // 더보기 버튼 업데이트
        updateLoadMoreButton(filteredCases.length);
    }

    // 더보기 버튼 상태 업데이트
    function updateLoadMoreButton(totalCases) {
        if (!elements.loadMoreBtn) return;

        const visibleCasesCount = Array.from(elements.caseItems).filter(item => 
            !item.classList.contains('hidden') && item.style.display !== 'none'
        ).length;

        if (visibleCasesCount >= totalCases) {
            elements.loadMoreBtn.style.display = 'none';
        } else {
            elements.loadMoreBtn.style.display = 'inline-block';
        }
    }

    // 스크롤 애니메이션 초기화
    function initializeAnimations() {
        // Intersection Observer로 사례 카드 애니메이션
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animationDelay = Math.random() * 0.3 + 's';
                    entry.target.classList.add('animate-fadeInUp');
                }
            });
        }, observerOptions);

        // 모든 사례 카드 관찰
        elements.caseItems.forEach(item => {
            observer.observe(item);
        });
    }

    // 필터 기능을 위한 유틸리티 함수들
    const filterUtils = {
        // 카테고리별 사례 수 계산
        getCategoryCount: function(category) {
            if (category === 'all') {
                return elements.caseItems.length;
            }
            return Array.from(elements.caseItems).filter(item => 
                item.dataset.category === category
            ).length;
        },

        // 검색 기능 (추후 확장용)
        searchCases: function(query) {
            const searchResults = Array.from(elements.caseItems).filter(item => {
                const title = item.querySelector('.case-title').textContent.toLowerCase();
                const summary = item.querySelector('.case-summary').textContent.toLowerCase();
                return title.includes(query.toLowerCase()) || summary.includes(query.toLowerCase());
            });
            return searchResults;
        }
    };

    // 페이지별 특수 기능
    if (window.location.pathname.includes('success-cases')) {
        // 성공 사례 목록 페이지 전용 기능
        initializeCaseListFeatures();
    }

    if (window.location.pathname.includes('success-cases/')) {
        // 개별 사례 상세 페이지 전용 기능
        initializeCaseDetailFeatures();
    }

    // 사례 목록 페이지 전용 기능
    function initializeCaseListFeatures() {
        // URL 해시를 통한 필터 설정
        const urlHash = window.location.hash.substr(1);
        if (urlHash && ['all', 'personal', 'knowledge', 'organization', 'content'].includes(urlHash)) {
            const targetTab = document.querySelector(`[data-filter="${urlHash}"]`);
            if (targetTab) {
                setActiveFilter(targetTab);
                filterCases(urlHash);
            }
        }

        // 필터 변경 시 URL 업데이트
        elements.filterTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                const filter = this.dataset.filter;
                window.history.replaceState(null, null, `#${filter}`);
            });
        });
    }

    // 사례 상세 페이지 전용 기능
    function initializeCaseDetailFeatures() {
        // 읽기 진행률 표시
        initializeReadingProgress();
        
        // 관련 사례 슬라이더 (미니 케이스들)
        initializeMiniCaseSlider();
        
        // 소셜 공유 기능
        initializeSocialShare();
    }

    // 읽기 진행률 표시
    function initializeReadingProgress() {
        // 스크롤 진행률 바 생성
        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress';
        progressBar.innerHTML = '<div class="progress-fill"></div>';
        document.body.appendChild(progressBar);

        const progressFill = progressBar.querySelector('.progress-fill');

        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrolled / maxScroll) * 100;
            
            progressFill.style.width = Math.min(progress, 100) + '%';
        });
    }

    // 미니 케이스 슬라이더 초기화
    function initializeMiniCaseSlider() {
        const miniCases = document.querySelectorAll('.mini-case-card');
        if (miniCases.length <= 3) return; // 3개 이하면 슬라이더 불필요

        // 슬라이더 컨테이너 생성
        const container = document.querySelector('.other-cases .row');
        if (container) {
            container.classList.add('mini-case-slider');
            
            // 터치/드래그 이벤트 추가
            let isDown = false;
            let startX;
            let scrollLeft;

            container.addEventListener('mousedown', (e) => {
                isDown = true;
                startX = e.pageX - container.offsetLeft;
                scrollLeft = container.scrollLeft;
            });

            container.addEventListener('mouseleave', () => {
                isDown = false;
            });

            container.addEventListener('mouseup', () => {
                isDown = false;
            });

            container.addEventListener('mousemove', (e) => {
                if (!isDown) return;
                e.preventDefault();
                const x = e.pageX - container.offsetLeft;
                const walk = (x - startX) * 2;
                container.scrollLeft = scrollLeft - walk;
            });
        }
    }

    // 소셜 공유 기능
    function initializeSocialShare() {
        // 공유 버튼 추가
        const shareButtons = document.querySelector('.case-detail-cta .cta-buttons');
        if (shareButtons) {
            const shareBtn = document.createElement('button');
            shareBtn.className = 'btn-daum share-btn';
            shareBtn.innerHTML = '<i class="bi bi-share"></i> 공유하기';
            shareBtn.addEventListener('click', showShareModal);
            shareButtons.appendChild(shareBtn);
        }
    }

    // 공유 모달 표시
    function showShareModal() {
        const currentUrl = window.location.href;
        const title = document.title;

        // 간단한 공유 옵션
        const shareOptions = [
            {
                name: '링크 복사',
                action: () => copyToClipboard(currentUrl)
            },
            {
                name: '카카오톡',
                action: () => shareToKakao(currentUrl, title)
            },
            {
                name: '페이스북',
                action: () => shareToFacebook(currentUrl)
            },
            {
                name: '트위터',
                action: () => shareToTwitter(currentUrl, title)
            }
        ];

        // 모달 생성 (간단한 alert로 대체 - 실제로는 모달 컴포넌트 사용)
        const shareText = shareOptions.map(option => option.name).join(', ');
        if (confirm(`공유 옵션: ${shareText}\n\n링크를 복사하시겠습니까?`)) {
            copyToClipboard(currentUrl);
        }
    }

    // 클립보드 복사
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                showToast('링크가 복사되었습니다!');
            });
        } else {
            // 폴백 방법
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showToast('링크가 복사되었습니다!');
        }
    }

    // 토스트 메시지 표시
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'toast-message';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--success);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 9999;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 3000);
    }

    // 외부 공유 함수들
    function shareToKakao(url, title) {
        if (typeof Kakao !== 'undefined') {
            Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: title,
                    description: '다움연구소 성공 사례',
                    imageUrl: window.location.origin + '/images/og-image.jpg',
                    link: {
                        mobileWebUrl: url,
                        webUrl: url
                    }
                }
            });
        } else {
            copyToClipboard(url);
        }
    }

    function shareToFacebook(url) {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }

    function shareToTwitter(url, title) {
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
    }

    // 키보드 네비게이션 지원
    document.addEventListener('keydown', function(e) {
        // 성공 사례 목록에서 화살표 키로 필터 변경
        if (elements.filterTabs.length > 0) {
            const activeTab = document.querySelector('.filter-tab.active');
            const tabs = Array.from(elements.filterTabs);
            const currentIndex = tabs.indexOf(activeTab);

            if (e.key === 'ArrowLeft' && currentIndex > 0) {
                e.preventDefault();
                tabs[currentIndex - 1].click();
                tabs[currentIndex - 1].focus();
            } else if (e.key === 'ArrowRight' && currentIndex < tabs.length - 1) {
                e.preventDefault();
                tabs[currentIndex + 1].click();
                tabs[currentIndex + 1].focus();
            }
        }

        // ESC 키로 모달 닫기 등
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.modal, .toast-message');
            modals.forEach(modal => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            });
        }
    });

    // 성능 최적화: 이미지 지연 로딩
    function initializeLazyLoading() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.remove('lazy');
                            imageObserver.unobserve(img);
                        }
                    }
                });
            });

            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        }
    }

    // 페이지 가시성 API 활용
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // 페이지가 숨겨졌을 때 불필요한 애니메이션 중지
            document.querySelectorAll('.case-card').forEach(card => {
                card.style.animationPlayState = 'paused';
            });
        } else {
            // 페이지가 다시 보일 때 애니메이션 재개
            document.querySelectorAll('.case-card').forEach(card => {
                card.style.animationPlayState = 'running';
            });
        }
    });

    // 스크롤 위치 기억 기능
    function rememberScrollPosition() {
        const scrollKey = 'successCases_scrollPosition';
        
        // 페이지 로드시 스크롤 위치 복원
        const savedPosition = sessionStorage.getItem(scrollKey);
        if (savedPosition) {
            setTimeout(() => {
                window.scrollTo(0, parseInt(savedPosition));
                sessionStorage.removeItem(scrollKey);
            }, 100);
        }

        // 페이지 이탈시 스크롤 위치 저장
        window.addEventListener('beforeunload', () => {
            sessionStorage.setItem(scrollKey, window.pageYOffset.toString());
        });
    }

    // 에러 처리 및 로깅
    window.addEventListener('error', function(e) {
        console.error('성공 사례 페이지 에러:', e.error);
        
        // 프로덕션에서는 에러 추적 서비스로 전송
        if (typeof gtag !== 'undefined') {
            gtag('event', 'exception', {
                'description': e.error.toString(),
                'fatal': false,
                'page': 'success-cases'
            });
        }
    });

    // 초기화 완료 후 추가 기능들 실행
    window.addEventListener('load', function() {
        initializeLazyLoading();
        rememberScrollPosition();
        
        // Google Analytics 이벤트 (페이지뷰)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_type: 'success_cases'
            });
        }
    });

    // 공개 API - 다른 스크립트에서 사용할 수 있는 함수들
    window.SuccessCases = {
        filterCases: filterCases,
        loadMoreCases: loadMoreCases,
        showToast: showToast,
        copyToClipboard: copyToClipboard,
        utils: filterUtils
    };

    // CSS 애니메이션 추가 (동적으로)
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes animate-fadeInUp {
            from { 
                opacity: 0; 
                transform: translateY(30px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }
        
        .animate-fadeInUp {
            animation: animate-fadeInUp 0.6s ease forwards;
        }
        
        .reading-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: rgba(26, 54, 93, 0.1);
            z-index: 9999;
        }
        
        .reading-progress .progress-fill {
            height: 100%;
            background: linear-gradient(135deg, var(--secondary), #e6b885);
            width: 0%;
            transition: width 0.1s ease;
        }
        
        .mini-case-slider {
            overflow-x: auto;
            scroll-behavior: smooth;
            -webkit-overflow-scrolling: touch;
        }
        
        .mini-case-slider::-webkit-scrollbar {
            height: 8px;
        }
        
        .mini-case-slider::-webkit-scrollbar-track {
            background: var(--gray-200);
            border-radius: 4px;
        }
        
        .mini-case-slider::-webkit-scrollbar-thumb {
            background: var(--secondary);
            border-radius: 4px;
        }
        
        .share-btn {
            margin-left: 1rem;
        }
        
        .toast-message {
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-weight: 500;
        }
    `;
    document.head.appendChild(style);

})();