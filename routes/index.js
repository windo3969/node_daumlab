const express = require('express');
const router = express.Router();

// 더 간단한 방법으로 홈페이지 렌더링
router.get('/', (req, res) => {
  // EJS 파일을 직접 렌더링 (layout.ejs에서 <%- body %> 부분에 home.ejs가 들어감)
  res.render('pages/home', { 
    title: '다움연구소 - 개인과 조직의 다움을 발견하고 세우는 곳',
    description: '다움연구소는 개인과 조직이 나다움, 우리다움, 회사다움이라는 고유한 정체성을 발견하고 정립할 수 있도록 돕습니다.',
    keywords: '다움연구소, 정체성, 컨설팅, 퍼스널브랜딩, 조직문화',
    canonical: res.locals.siteUrl + '/'
  });
});

// 연구소 소개
router.get('/about', (req, res) => {
  res.render('pages/about', {
    title: '연구소 소개 - 다움연구소',
    description: '다움연구소의 핵심 가치와 철학, 그리고 우리가 추구하는 비전에 대해 소개합니다.',
    keywords: '다움연구소, 소개, 핵심가치, 철학, 비전',
    canonical: res.locals.siteUrl + '/about',
    additionalCSS: ['/css/about.css'],
    additionalJS: ['/js/about.js?v=' + new Date().getFullYear()]
  });
});

// 세미나 목록 페이지
router.get('/seminars', (req, res) => {
  res.render('pages/seminars', {
    title: '세미나 - 다움연구소',
    description: '정체성 발견과 성장을 위한 다양한 세미나 프로그램을 만나보세요.',
    keywords: '세미나, 워크숍, 교육, 정체성, 다움연구소',
    canonical: res.locals.siteUrl + '/seminars',
    additionalCSS: ['/css/seminars.css'],
    additionalJS: ['/js/seminars.js']
  });
});

// 세미나 상세 페이지
router.get('/seminars/:seminarId', (req, res) => {
  const seminarId = req.params.seminarId;
  
  // 실제로는 데이터베이스에서 가져올 데이터
  const seminars = {
    'identity-discovery': {
      id: 'identity-discovery',
      title: '나다움 발견 워크숍',
      subtitle: 'Identity Discovery Workshop',
      category: '개인 정체성',
      duration: '6시간',
      participants: '8-12명',
      level: '초급-중급',
      price: {
        early: 180000,
        regular: 220000
      },
      description: '진정한 자신을 발견하고 나만의 정체성을 구축하는 6시간의 집중 워크숍입니다.',
      heroVideo: '/videos/identity-discovery-hero.mp4',
      heroImage: '/images/seminars/identity-discovery-hero.jpg',
      highlights: [
        '개인 가치관 명확화',
        '강점 및 재능 발견',
        '비전 및 목표 설정',
        '실행 로드맵 수립'
      ],
      curriculum: [
        {
          title: '1부: 나를 아는 시간',
          duration: '90분',
          topics: ['자기 인식 진단', '가치관 탐구', '과거 경험 분석'],
          image: '/images/seminars/part1.jpg'
        },
        {
          title: '2부: 강점 발견하기',
          duration: '90분',
          topics: ['강점 분석 테스트', '재능 발굴 워크숍', '피드백 세션'],
          image: '/images/seminars/part2.jpg'
        },
        {
          title: '3부: 비전 설계하기',
          duration: '120분',
          topics: ['비전 설정 워크숍', '목표 수립 방법', '실행 계획 작성'],
          image: '/images/seminars/part3.jpg'
        },
        {
          title: '4부: 실행 로드맵',
          duration: '120분',
          topics: ['개인별 로드맵 설계', '실행 전략 수립', '후속 계획 논의'],
          image: '/images/seminars/part4.jpg'
        }
      ],
      instructor: {
        name: '김다움',
        title: '다움연구소 대표',
        credential: '정체성 전문 컨설턴트 | 조직심리학 박사',
        image: '/images/team/kim-daum.jpg',
        experience: '10년+ 개인 컨설팅 경험',
        description: '1000명 이상의 개인과 100개 이상의 조직이 자신만의 정체성을 발견할 수 있도록 도왔습니다.'
      },
      benefits: [
        {
          icon: 'fas fa-compass',
          title: '명확한 방향성',
          description: '자신만의 가치관과 비전을 발견하여 인생의 나침반을 얻습니다.'
        },
        {
          icon: 'fas fa-star',
          title: '강점 활용',
          description: '숨겨진 재능과 강점을 발견하여 개인 브랜드를 구축합니다.'
        },
        {
          icon: 'fas fa-rocket',
          title: '실행력 향상',
          description: '구체적인 실행 계획으로 꿈을 현실로 만드는 방법을 학습합니다.'
        },
        {
          icon: 'fas fa-users',
          title: '네트워킹',
          description: '비슷한 목표를 가진 동료들과의 네트워킹 기회를 제공합니다.'
        }
      ],
      testimonials: [
        {
          name: '이수진',
          age: 28,
          occupation: '마케터',
          rating: 5,
          comment: '6시간이 어떻게 지나갔는지 모를 정도로 몰입했어요. 제가 정말 원하는 게 무엇인지 명확해졌습니다.',
          image: '/images/testimonials/lee-sujin.jpg',
          result: '새로운 커리어 전환 성공'
        },
        {
          name: '박현우',
          age: 32,
          occupation: '프리랜서',
          rating: 5,
          comment: '3년간 방황했던 제가 하루 만에 인생의 방향을 찾았어요. 정말 감사합니다.',
          image: '/images/testimonials/park-hyunwoo.jpg',
          result: '개인 브랜드 구축 및 수입 30% 증가'
        },
        {
          name: '김영희',
          age: 25,
          occupation: '대학원생',
          rating: 5,
          comment: '학업과 꿈 사이에서 고민이 많았는데, 두 가지를 조화롭게 병행할 수 있는 방법을 찾았어요.',
          image: '/images/testimonials/kim-younghee.jpg',
          result: '명확한 진로 설정 및 시간 관리 개선'
        }
      ],
      schedule: [
        {
          date: '2025-08-15',
          time: '10:00-17:00',
          location: '강남 다움센터',
          available: 5,
          total: 12
        },
        {
          date: '2025-08-29',
          time: '10:00-17:00',
          location: '강남 다움센터',
          available: 3,
          total: 12
        },
        {
          date: '2025-09-12',
          time: '10:00-17:00',
          location: '홍대 다움스튜디오',
          available: 8,
          total: 12
        }
      ],
      includes: [
        '워크북 및 진단 도구',
        '점심 식사 제공',
        '개인별 피드백 리포트',
        '3개월 후속 코칭 세션 1회',
        '온라인 커뮤니티 액세스'
      ],
      gallery: [
        '/images/seminars/gallery1.jpg',
        '/images/seminars/gallery2.jpg',
        '/images/seminars/gallery3.jpg',
        '/images/seminars/gallery4.jpg',
        '/images/seminars/gallery5.jpg',
        '/images/seminars/gallery6.jpg'
      ]
    },
    'personal-branding': {
      id: 'personal-branding',
      title: '퍼스널 브랜딩 마스터클래스',
      subtitle: 'Personal Branding Masterclass',
      category: '개인 브랜딩',
      duration: '8시간',
      participants: '6-10명',
      level: '중급-고급',
      price: {
        early: 350000,
        regular: 420000
      },
      description: '자신만의 고유한 브랜드를 구축하고 시장에서 차별화된 위치를 확보하는 전문 과정입니다.',
      heroVideo: '/videos/personal-branding-hero.mp4',
      heroImage: '/images/seminars/personal-branding-hero.jpg',
      highlights: [
        '개인 브랜드 전략 수립',
        '온라인 플랫폼 활용법',
        '스토리텔링 기법',
        '네트워킹 전략'
      ],
      // ... 추가 데이터 구조는 동일
    }
  };

  const seminarData = seminars[seminarId];
  
  if (!seminarData) {
    return res.status(404).render('pages/error', {
      title: '세미나를 찾을 수 없습니다',
      error: '요청하신 세미나 정보를 찾을 수 없습니다.',
      status: 404
    });
  }

  res.render('pages/seminar-detail', {
    title: `${seminarData.title} - 세미나 | 다움연구소`,
    description: seminarData.description,
    keywords: `${seminarData.title}, 세미나, 워크숍, ${seminarData.category}, 다움연구소`,
    canonical: res.locals.siteUrl + `/seminars/${seminarId}`,
    seminar: seminarData,
    additionalCSS: ['/css/seminar-detail.css'],
    additionalJS: ['/js/seminar-detail.js'],
    // 구조화된 데이터 (SEO)
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Event",
      "name": seminarData.title,
      "description": seminarData.description,
      "organizer": {
        "@type": "Organization",
        "name": "다움연구소"
      },
      "offers": {
        "@type": "Offer",
        "price": seminarData.price.regular,
        "priceCurrency": "KRW"
      }
    }
  });
});

// 핵심 사업
router.get('/services', (req, res) => {
  res.render('pages/services', {
    title: '핵심 사업 - 다움연구소',
    description: '개인 다움 컨설팅, 조직 다움 워크숍, 지식 구독 플랫폼, 콘텐츠 개발 등 다움연구소의 핵심 사업을 소개합니다.',
    keywords: '다움연구소, 서비스, 컨설팅, 워크숍, 뉴스레터',
    canonical: res.locals.siteUrl + '/services',
    additionalCSS: ['/css/services.css'],
    additionalJS: ['/js/services.js']
  });
});

// 성공 사례
router.get('/success-cases', (req, res) => {
  res.render('pages/success-cases', {
    title: '성공 사례 - 다움연구소',
    description: '다움연구소의 프로그램을 통해 자신만의 정체성을 발견하고 성장한 사람들의 실제 사례를 소개합니다.',
    keywords: '다움연구소, 성공사례, 후기, 변화, 성장',
    canonical: res.locals.siteUrl + '/success-cases'
  });
});

// 사이트맵
router.get('/sitemap', (req, res) => {
  const sitemap = {
    mainPages: [
      { url: '/', title: '홈', description: '다움연구소 메인 페이지' },
      { url: '/about', title: '연구소 소개', description: '다움연구소 소개 및 핵심 가치' },
      { url: '/services', title: '핵심 사업', description: '제공하는 서비스 안내' },
      { url: '/success-cases', title: '성공 사례', description: '고객 성공 사례' },
      { url: '/pricing', title: '요금제', description: '서비스 요금제 안내' }
    ],
    servicePages: [
      { url: '/services/personal-consulting', title: '개인 다움 컨설팅' },
      { url: '/services/knowledge-platform', title: '지식 구독 플랫폼' },
      { url: '/services/organization-workshop', title: '조직 다움 워크숍' },
      { url: '/services/content-development', title: '콘텐츠 개발' }
    ],
    utilityPages: [
      { url: '/contact', title: '문의하기' },
      { url: '/consulting-apply', title: '컨설팅 신청' }
    ]
  };

  res.render('pages/sitemap', {
    title: '사이트맵 - 다움연구소',
    description: '다움연구소 웹사이트의 전체 페이지 구조를 확인하세요.',
    sitemap: sitemap,
    canonical: res.locals.siteUrl + '/sitemap'
  });
});

// routes/pages.js에 추가할 성공 사례 관련 라우트들

// 성공 사례 상세 페이지들
router.get('/success-cases/:caseId', (req, res) => {
  const caseId = req.params.caseId;
  
  // 실제로는 데이터베이스에서 가져올 데이터
  const cases = {
    'kim-jiwon': {
      id: 'kim-jiwon',
      name: '김지원',
      age: 27,
      occupation: '마케터',
      service: '개인 다움 컨설팅',
      title: '남들과 같은 길을 가는 것이 불안했습니다',
      summary: '적성에 맞지 않는 일을 하며 불안감에 시달렸는데, 다움연구소를 통해 제 강점을 발견하고 새로운 커리어를 시작했습니다.',
      content: `대학을 졸업하고 바로 마케팅 회사에 취업했지만, 매일이 고통스러웠습니다. 
               다른 사람들은 모두 열정적으로 일하는 것 같은데, 저만 뒤처지는 느낌이었어요. 
               다움연구소의 6주간 컨설팅을 통해 제가 추구하는 가치와 강점을 발견할 수 있었습니다.`,
      beforeAfter: {
        before: ['방향성 없는 업무', '불안감과 스트레스', '낮은 자존감', '업무 만족도 부족'],
        after: ['명확한 목표 설정', '자신감 회복', '높은 업무 만족도', '새로운 커리어 시작']
      },
      testimonial: '이제는 매일 아침이 기다려집니다. 제가 정말 하고 싶었던 일을 찾았어요.',
      image: '/images/cases/kim-jiwon.jpg'
    },
    'park-hyunwoo': {
      id: 'park-hyunwoo',
      name: '박현우',
      age: 32,
      occupation: '프리랜서',
      service: '지식 구독 플랫폼',
      title: '3년간 방황 끝에 찾은 나만의 브랜드',
      summary: '여러 직업을 전전하며 정체성에 혼란을 겪고 있었습니다. 다움연구소의 뉴스레터를 6개월간 구독하며 제 강점을 체계적으로 발견했습니다.',
      content: `20대 후반부터 30대 초반까지 정말 많은 일들을 해봤어요. 
               카페 창업, 온라인 쇼핑몰, 교육 컨설팅... 하지만 어느 것 하나 제대로 되는 게 없었습니다.
               다움연구소의 뉴스레터를 통해 제가 '연결자' 유형이라는 걸 발견했어요.`,
      beforeAfter: {
        before: ['정체성 혼란', '여러 분야 방황', '낮은 자신감', '경제적 불안정'],
        after: ['명확한 정체성', '전문 분야 확립', '개인 브랜드 구축', '안정적 수입']
      },
      testimonial: '과거의 실패 경험들이 모두 자산이 되었습니다. 지금은 제 이름을 건 사업을 하고 있어요.',
      image: '/images/cases/park-hyunwoo.jpg'
    },
    'lee-sujin': {
      id: 'lee-sujin',
      name: '이수진',
      age: 25,
      occupation: '대학원생',
      service: '정체성 진단 키트',
      title: '학업과 꿈 사이에서 길을 찾았습니다',
      summary: '대학원 공부와 제가 정말 하고 싶은 일 사이에서 갈등했어요. 정체성 진단 키트를 통해 저의 핵심 가치를 발견했습니다.',
      content: `대학원 과정이 힘들어서 자주 포기하고 싶었어요. 
               정말 하고 싶은 일이 따로 있는데 학업을 계속해야 하나 고민이 많았습니다.
               정체성 진단 키트를 통해 두 가지를 조화롭게 병행할 수 있는 방법을 찾았어요.`,
      beforeAfter: {
        before: ['학업과 꿈의 갈등', '진로 불확실성', '시간 관리 어려움', '스트레스'],
        after: ['명확한 가치관', '효율적 시간 관리', '학업과 꿈의 조화', '만족스러운 일상']
      },
      testimonial: '이제는 학업도 제 꿈을 향한 하나의 과정이라는 걸 알게 되었어요.',
      image: '/images/cases/lee-sujin.jpg'
    },
    'jung-minho': {
      id: 'jung-minho',
      name: '정민호',
      age: 29,
      occupation: '직장인',
      service: '커리어 코칭',
      title: '매일 반복되는 일상에서 의미를 찾았습니다',
      summary: '똑같은 업무의 반복으로 번아웃을 겪고 있었습니다. 다움연구소의 코칭을 통해 제 일의 의미를 재발견했습니다.',
      content: `5년차 직장인이지만 매일이 똑같아서 지쳤어요. 
               승진도 했지만 성취감보다는 피로감만 쌓여갔습니다.
               코칭을 통해 제 일의 의미를 재발견하고, 업무 방식을 제 방식으로 재구성했어요.`,
      beforeAfter: {
        before: ['업무 번아웃', '의미 없는 반복', '낮은 동기', '성과 부진'],
        after: ['업무 열정 회복', '의미 있는 일상', '높은 동기', '성과 30% 향상']
      },
      testimonial: '같은 일이라도 제 방식으로 접근하니까 훨씬 효과적이고 재미있어졌어요.',
      image: '/images/cases/jung-minho.jpg'
    },
    'startup-a': {
      id: 'startup-a',
      name: 'A 스타트업',
      age: null,
      occupation: 'IT 회사',
      service: '조직 다움 워크숍',
      title: '급성장하는 스타트업의 문화 정착기',
      summary: '빠른 성장으로 인해 조직 문화가 부재했던 스타트업이 6주간의 워크숍을 통해 고유한 조직 정체성을 구축한 이야기입니다.',
      content: `직원이 10명에서 50명으로 급성장하면서 조직 문화의 부재를 느꼈습니다.
               세대 간, 부서 간 소통 문제가 생기고 회사의 정체성이 모호해졌어요.
               6주간의 워크숍을 통해 우리만의 고유한 조직 문화를 만들어갔습니다.`,
      beforeAfter: {
        before: ['조직 문화 부재', '소통 문제', '높은 이직률', '낮은 참여도'],
        after: ['명확한 조직 문화', '원활한 소통', '이직률 60% 감소', '직원 만족도 85% 향상']
      },
      testimonial: '이제 우리 회사만의 색깔이 생겼어요. 직원들도 회사에 대한 자부심을 가지게 되었습니다.',
      image: '/images/cases/startup-a.jpg'
    },
    'kim-younghee': {
      id: 'kim-younghee',
      name: '김영희',
      age: 30,
      occupation: '직장맘',
      service: '지식 구독 플랫폼',
      title: '육아와 커리어, 두 마리 토끼를 잡다',
      summary: '육아로 인해 커리어가 중단된 상황에서 지식 구독을 통해 점진적으로 자신만의 길을 찾아나간 과정을 소개합니다.',
      content: `첫 아이를 낳고 3년간 육아에만 전념했어요. 
               복직을 고민하던 중 다움연구소의 지식 구독 서비스를 알게 되었습니다.
               매주 받는 콘텐츠를 통해 제 안에 숨어있던 창업 의지를 발견했어요.`,
      beforeAfter: {
        before: ['커리어 중단', '육아 스트레스', '자아 정체성 혼란', '경제적 부담'],
        after: ['새로운 커리어 개척', '육아와 일의 균형', '명확한 정체성', '경제적 독립']
      },
      testimonial: '육아와 일, 두 가지 모두 제 삶의 소중한 부분이라는 걸 깨달았어요.',
      image: '/images/cases/kim-younghee.jpg'
    }
  };

  const caseData = cases[caseId];
  
  if (!caseData) {
    return res.status(404).render('pages/error', {
      title: '사례를 찾을 수 없습니다',
      error: '요청하신 성공 사례를 찾을 수 없습니다.',
      status: 404
    });
  }

  res.render('pages/success-cases-detail', {
    title: `${caseData.title} - ${caseData.name}님의 성공 사례 | 다움연구소`,
    description: caseData.summary,
    keywords: `성공사례, ${caseData.service}, ${caseData.occupation}, 변화, 성장, 다움연구소`,
    canonical: res.locals.siteUrl + `/success-cases/${caseId}`,
    cases: caseData,
    additionalCSS: ['/css/success-cases.css'],
    additionalJS: ['/js/success-cases.js']
  });
});

// 성공 사례 목록 페이지 (기존 routes/index.js에서 이동)
router.get('/success-cases', (req, res) => {
  res.render('pages/success-cases', {
    title: '성공 사례 - 다움연구소',
    description: '다움연구소의 프로그램을 통해 자신만의 정체성을 발견하고 성장한 사람들의 실제 사례를 확인하세요.',
    keywords: '성공사례, 후기, 변화, 성장, 정체성 발견, 다움연구소',
    canonical: res.locals.siteUrl + '/success-cases',
    additionalCSS: ['/css/success-cases.css'],
    additionalJS: ['/js/success-cases.js']
  });
});

// routes/index.js에 추가할 지식 구독 플랫폼 라우트

//======================= 서비스 ============================ //
// 지식 구독 플랫폼 서비스 상세 페이지
router.get('/services/knowledge-platform', (req, res) => {
  res.render('pages/services/knowledge-platform', {
    title: '지식 구독 플랫폼 - 매주 도착하는 다움 발견 여정 | 다움연구소',
    description: '바쁜 일상 속에서도 꾸준히 자신을 탐구할 수 있도록, 매주 정체성 발견을 위한 실용적이고 깊이 있는 콘텐츠를 메일함으로 직접 전달해드립니다.',
    keywords: '지식구독, 뉴스레터, 정체성탐구, 자기계발, 이메일구독, 다움연구소',
    canonical: res.locals.siteUrl + '/services/knowledge-platform',
    additionalCSS: ['/css/knowledge-platform.css'],
    additionalJS: ['/js/knowledge-platform.js'],
    // 구조화된 데이터 (SEO)
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "지식 구독 플랫폼",
      "provider": {
        "@type": "Organization",
        "name": "다움연구소"
      },
      "description": "매주 정체성 발견을 위한 체계적인 콘텐츠를 이메일로 제공하는 구독 서비스",
      "offers": [
        {
          "@type": "Offer",
          "name": "체험판",
          "price": "0",
          "priceCurrency": "KRW",
          "description": "4주간 무료 체험"
        },
        {
          "@type": "Offer",
          "name": "정기 구독",
          "price": "19900",
          "priceCurrency": "KRW",
          "description": "월간 구독 서비스"
        },
        {
          "@type": "Offer",
          "name": "연간 구독",
          "price": "199000",
          "priceCurrency": "KRW",
          "description": "연간 구독 서비스 (16% 할인)"
        }
      ]
    }
  });
});

// 조직 다움 워크숍 서비스 상세 페이지
router.get('/services/organization-workshop', (req, res) => {
  res.render('pages/services/organization-workshop', {
    title: '조직 다움 워크숍 - 조직의 고유한 색깔을 함께 만들어가는 워크숍 | 다움연구소',
    description: '구성원들이 함께 참여하여 조직만의 정체성과 문화를 발견하고 구축하는 6주간의 체계적인 워크숍 프로그램입니다. 팀워크 향상과 조직 문화 혁신을 동시에 달성하세요.',
    keywords: '조직 워크숍, 팀빌딩, 조직 문화, 정체성, 다움연구소, 기업 교육, 팀워크',
    canonical: res.locals.siteUrl + '/services/organization-workshop',
    additionalCSS: ['/css/organization-workshop.css'],
    additionalJS: ['/js/organization-workshop.js'],
    readcrumb: [
      { title: '홈', url: '/' },
      { title: '핵심 사업', url: '/services' },
      { title: '조직 다움 워크숍', url: '/services/organization-workshop' }
    ]
  });
});

// personal-consulting 개인 다움 컨설팅
router.get('/services/personal-consulting', (req, res) => {
  res.render('pages/services/personal-consulting', {
    title: '개인 다움 컨설팅 - 다움연구소',
    description: '1:1 맞춤형 컨설팅을 통해 당신의 고유한 강점과 정체성을 발견하고, 진정한 성장과 성공을 위한 개인 브랜드를 구축하세요.',
    keywords: '개인컨설팅, 정체성발견, 퍼스널브랜딩, 1대1컨설팅, 강점분석, 커리어코칭, 자기계발',
    canonical: res.locals.siteUrl + '/services/personal-consulting',
    additionalCSS: ['/css/personal-consulting.css'],
    additionalJS: ['/js/personal-consulting.js']
  });
});

// 핵심 사업 (서비스 전체 소개)
router.get('/services', (req, res) => {
  res.render('pages/services', {
    title: '핵심 사업 - 다움연구소',
    description: '개인 다움 컨설팅, 조직 다움 워크숍, 지식 구독 플랫폼, 콘텐츠 개발 등 다움연구소의 4가지 핵심 서비스를 소개합니다.',
    keywords: '다움연구소, 서비스, 컨설팅, 워크숍, 구독, 콘텐츠 개발',
    canonical: res.locals.siteUrl + '/services',
    additionalCSS: ['/css/services.css'],
    additionalJS: ['/js/services.js'], 
    // 페이지별 메타데이터
    pageType: 'services',
    breadcrumb: [
      { title: '홈', url: '/' },
      { title: '핵심 사업', url: '/services' }
    ],
    // 구조화된 데이터 (JSON-LD)
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "다움연구소",
      "description": "개인과 조직의 정체성 발견을 돕는 전문 연구기관",
      "url": res.locals.siteUrl + "/services",
      "service": [
        {
          "@type": "Service",
          "name": "개인 다움 컨설팅",
          "description": "1:1 맞춤형 컨설팅을 통한 개인 정체성 발견 및 브랜딩",
          "provider": {
            "@type": "Organization",
            "name": "다움연구소"
          }
        },
        {
          "@type": "Service", 
          "name": "지식 구독 플랫폼",
          "description": "매주 전달되는 정체성 탐구 콘텐츠 구독 서비스",
          "provider": {
            "@type": "Organization",
            "name": "다움연구소"
          }
        },
        {
          "@type": "Service",
          "name": "조직 다움 워크숍", 
          "description": "조직 정체성과 문화 구축을 위한 체계적 워크숍",
          "provider": {
            "@type": "Organization",
            "name": "다움연구소"
          }
        },
        {
          "@type": "Service",
          "name": "콘텐츠 개발 및 배포",
          "description": "정체성과 브랜딩 관련 맞춤형 교육자료 개발",
          "provider": {
            "@type": "Organization", 
            "name": "다움연구소"
          }
        }
      ]
    }
  });
});

// 콘텐츠 개발 및 배포 서비스 상세 페이지
router.get('/services/content-development', (req, res) => {
  res.render('pages/services/content-development', {
    title: '콘텐츠 개발 및 배포 - 정체성 기반 맞춤형 콘텐츠 제작 | 다움연구소',
    description: '개인과 조직의 고유한 정체성을 바탕으로 한 전문 콘텐츠를 개발하고 배포합니다. 교육자료, 브랜딩 콘텐츠, 커뮤니케이션 자료까지 체계적이고 일관성 있는 메시지를 전달하세요.',
    keywords: '콘텐츠개발, 브랜딩콘텐츠, 교육자료, 커뮤니케이션자료, 맞춤형콘텐츠, 정체성기반콘텐츠, 다움연구소',
    canonical: res.locals.siteUrl + '/services/content-development',
    additionalCSS: ['/css/content-development.css'],
    additionalJS: ['/js/content-development.js'],
    breadcrumb: [
      { title: '홈', url: '/' },
      { title: '핵심 사업', url: '/services' },
      { title: '콘텐츠 개발 및 배포', url: '/services/content-development' }
    ],
    // 구조화된 데이터 (SEO)
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "콘텐츠 개발 및 배포",
      "provider": {
        "@type": "Organization",
        "name": "다움연구소",
        "url": res.locals.siteUrl,
        "logo": res.locals.siteUrl + "/images/logo/daum-logo.png"
      },
      "description": "정체성 기반 맞춤형 콘텐츠 개발 및 배포 서비스",
      "serviceType": "콘텐츠 개발",
      "areaServed": {
        "@type": "Country",
        "name": "대한민국"
      },
      "offers": [
        {
          "@type": "Offer",
          "name": "기본 패키지",
          "price": "3000000",
          "priceCurrency": "KRW",
          "description": "핵심 콘텐츠 10개 제작, 기본 디자인 적용"
        },
        {
          "@type": "Offer",
          "name": "프리미엄 패키지",
          "price": "8000000",
          "priceCurrency": "KRW",
          "description": "맞춤형 콘텐츠 30개 제작, 전문 디자인 및 브랜딩"
        },
        {
          "@type": "Offer",
          "name": "맞춤 견적",
          "price": "0",
          "priceCurrency": "KRW",
          "description": "프로젝트별 맞춤 기획 및 견적"
        }
      ],
      "additionalType": [
        "브랜드 콘텐츠 개발",
        "교육 콘텐츠 제작",
        "커뮤니케이션 자료 개발"
      ]
    }
  });
});

// 컨설팅 신청
router.get('/consulting-apply', (req, res) => {
  res.render('pages/consulting-apply', {
    title: '컨설팅 신청 - 다움연구소',
    description: '개인 또는 조직의 다움을 발견하는 컨설팅 서비스를 신청하세요.',
    keywords: '다움연구소, 컨설팅신청, 상담, 서비스신청',
    canonical: res.locals.siteUrl + '/consulting-apply',
    additionalCSS: ['/css/consulting-apply.css'],
    additionalJS: ['/js/consulting-apply.js'],
    formData: {},
    errors: []
  });
});


module.exports = router;