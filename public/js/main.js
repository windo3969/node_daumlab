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
window.UserTracking = UserTracking; //메시지 (실제로는 리다이렉트)
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