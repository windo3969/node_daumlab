// 개인 다움 컨설팅 페이지 전용 JavaScript

(function() {
    'use strict';

    // ==================== DOM 요소들 ==================== //
    const elements = {
        consultationForm: document.getElementById('personalConsultationForm'),
        packageCards: document.querySelectorAll('.package-card'),
        stepCards: document.querySelectorAll('.step-card'),
        testimonialCards: document.querySelectorAll('.testimonial-card')
    };

    // ==================== 초기화 ==================== //
    document.addEventListener('DOMContentLoaded', function() {
        initializeConsultationForm();
        initializePackageSelection();
        initializeScrollAnimations();
        initializeSmoothScroll();
        console.log('🎯 개인 다움 컨설팅 페이지가 로드되었습니다!');
    });

    // ==================== 상담 신청 폼 처리 ==================== //
    function initializeConsultationForm() {
        if (!elements.consultationForm) return;

        elements.consultationForm.addEventListener('submit', handleConsultationSubmit);
        
        // 실시간 유효성 검사
        const formFields = elements.consultationForm.querySelectorAll('input, select, textarea');
        formFields.forEach(field => {
            field.addEventListener('blur', validateField);
            field.addEventListener('input', clearFieldError);
        });

        // 패키지 선택에 따른 안내 메시지
        const packageSelect = elements.consultationForm.querySelector('select[name="package"]');
        if (packageSelect) {
            packageSelect.addEventListener('change', handlePackageChange);
        }
    }

    async function handleConsultationSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // 폼 유효성 검사
        if (!validateConsultationForm(form)) {
            return;
        }

        try {
            setButtonLoading(submitBtn, true);
            form.classList.add('form-loading');
            
            const response = await fetch('/contact/consulting', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();
            
            if (response.ok && result.success) {
                showFormMessage(form, '상담 신청이 완료되었습니다! 24시간 내에 연락드리겠습니다.', 'success');
                form.reset();
                
                // Google Analytics 이벤트 추적
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'consultation_request', {
                        'event_category': 'form',
                        'event_label': 'personal_consulting',
                        'package_type': formData.get('package')
                    });
                }
            } else {
                throw new Error(result.message || '신청 처리 중 오류가 발생했습니다.');
            }
        } catch (error) {
            console.error('Consultation form error:', error);
            showFormMessage(form, error.message, 'error');
        } finally {
            setButtonLoading(submitBtn, false, originalText);
            form.classList.remove('form-loading');
        }
    }

    function validateConsultationForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
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
        // 이름 길이 검사
        else if (field.name === 'name' && value.length < 2) {
            message = '이름은 2자 이상 입력해주세요.';
            isValid = false;
        }

        if (!isValid) {
            showFieldError(field, message);
        } else {
            clearFieldError({ target: field });
        }

        return isValid;
    }

    function handlePackageChange(e) {
        const selectedPackage = e.target.value;
        const packageInfo = {
            'light': '라이트 패키지 (30만원) - 2-3주 진행, 2회 세션',
            'standard': '스탠다드 패키지 (60만원) - 6-8주 진행, 5회 세션 + 3개월 이메일 코칭',
            'premium': '프리미엄 패키지 (120만원) - 3-4개월 진행, 10회 세션 + 6개월 지속 코칭',
            'consultation': '상담을 통해 가장 적합한 패키지를 추천해드립니다.'
        };

        // 기존 안내 메시지 제거
        const existingInfo = document.querySelector('.package-info');
        if (existingInfo) {
            existingInfo.remove();
        }

        if (selectedPackage && packageInfo[selectedPackage]) {
            const infoDiv = document.createElement('div');
            infoDiv.className = 'package-info alert alert-info mt-2';
            infoDiv.innerHTML = `<i class="bi bi-info-circle me-2"></i>${packageInfo[selectedPackage]}`;
            e.target.parentNode.appendChild(infoDiv);
        }
    }

    // ==================== 패키지 선택 기능 ==================== //
    function initializePackageSelection() {
        elements.packageCards.forEach(card => {
            card.addEventListener('click', handlePackageCardClick);
        });
    }

    function handlePackageCardClick(e) {
        e.preventDefault();
        
        const card = e.currentTarget;
        const packageType = getPackageTypeFromCard(card);
        
        // 모든 카드에서 선택 상태 제거
        elements.packageCards.forEach(c => c.classList.remove('selected'));
        
        // 클릭된 카드에 선택 상태 추가
        card.classList.add('selected');
        
        // 폼의 패키지 선택 필드 업데이트
        const packageSelect = elements.consultationForm?.querySelector('select[name="package"]');
        if (packageSelect) {
            packageSelect.value = packageType;
            packageSelect.dispatchEvent(new Event('change'));
        }
        
        // 상담 신청 섹션으로 스무스 스크롤
        const consultationSection = document.getElementById('consultation');
        if (consultationSection) {
            consultationSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }
    }

    function getPackageTypeFromCard(card) {
        const title = card.querySelector('.package-title')?.textContent?.toLowerCase();
        const packageMap = {
            '라이트': 'light',
            '스탠다드': 'standard',
            '프리미엄': 'premium'
        };
        
        return packageMap[title] || 'consultation';
    }

    // ==================== 스크롤 애니메이션 ==================== //
    function initializeScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver(handleScrollAnimation, observerOptions);
        
        // 애니메이션 대상 요소들 관찰
        const animateElements = [
            ...elements.stepCards,
            ...elements.packageCards,
            ...elements.testimonialCards,
            ...document.querySelectorAll('.pain-card')
        ];

        animateElements.forEach((el, index) => {
            el.classList.add('animate-on-scroll');
            el.style.animationDelay = `${index * 0.1}s`;
            observer.observe(el);
        });
    }

    function handleScrollAnimation(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }

    // ==================== 부드러운 스크롤 ==================== //
    function initializeSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                
                if (href === '#' || href === '#top') {
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    return;
                }

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
                    const targetPosition = target.offsetTop - headerHeight - 20;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
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

    function showFormMessage(form, message, type) {
        // 기존 메시지 제거
        const existingAlert = form.parentNode.querySelector('.form-success, .form-error');
        if (existingAlert) {
            existingAlert.remove();
        }

        // 새 메시지 생성
        const alertDiv = document.createElement('div');
        alertDiv.className = type === 'error' ? 'form-error' : 'form-success';
        alertDiv.innerHTML = `<i class="bi bi-${type === 'error' ? 'exclamation-triangle' : 'check-circle'} me-2"></i>${message}`;
        
        // 메시지를 폼 위에 추가
        form.parentNode.insertBefore(alertDiv, form);
        
        // 메시지로 스크롤
        alertDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // 성공 메시지는 5초 후 자동 제거
        if (type === 'success') {
            setTimeout(() => {
                alertDiv.remove();
            }, 5000);
        }
    }

    function setButtonLoading(button, isLoading, originalText = '') {
        if (isLoading) {
            button.disabled = true;
            button.classList.add('btn-loading');
            button.textContent = '처리중...';
        } else {
            button.disabled = false;
            button.classList.remove('btn-loading');
            button.textContent = originalText || '무료 상담 신청하기';
        }
    }

    // ==================== 패키지 비교 기능 ==================== //
    function initializePackageComparison() {
        const compareBtn = document.createElement('button');
        compareBtn.className = 'btn btn-outline-primary mt-3';
        compareBtn.textContent = '패키지 상세 비교';
        compareBtn.onclick = showPackageComparison;
        
        const packagesSection = document.querySelector('.consulting-packages .container');
        if (packagesSection) {
            packagesSection.appendChild(compareBtn);
        }
    }

    function showPackageComparison() {
        const comparisonData = [
            {
                feature: '개별 세션 횟수',
                light: '2회 (2시간씩)',
                standard: '5회 (2시간씩)',
                premium: '10회 (2시간씩)'
            },
            {
                feature: '진단 도구',
                light: '기본 성격 진단',
                standard: '심화 성격 & 강점 진단',
                premium: '종합 정체성 분석'
            },
            {
                feature: '개인 브랜드 전략',
                light: '기본 가이드',
                standard: '상세 전략 수립',
                premium: '완전한 브랜드 구축'
            },
            {
                feature: '후속 지원',
                light: '없음',
                standard: '3개월 이메일 코칭',
                premium: '6개월 지속 코칭'
            }
        ];

        // 모달이나 별도 섹션으로 비교표 표시
        console.log('패키지 비교 기능 - 구현 예정');
    }

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

    // 페이지 로드 완료 후 실행
    window.addEventListener('load', function() {
        initializeLazyLoading();
        
        // 성능 측정
        if (window.performance && window.performance.timing) {
            const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
            console.log(`페이지 로드 시간: ${loadTime}ms`);
            
            // Google Analytics 성능 추적
            if (typeof gtag !== 'undefined') {
                gtag('event', 'timing_complete', {
                    'name': 'load',
                    'value': loadTime
                });
            }
        }
    });

    // ==================== 공개 API ==================== //
    window.PersonalConsulting = {
        validateEmail: validateEmail,
        validatePhone: validatePhone,
        showFormMessage: showFormMessage,
        handlePackageSelection: handlePackageCardClick
    };

})();