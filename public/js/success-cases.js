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