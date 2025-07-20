const express = require('express');
const router = express.Router();

// 서비스 상세 페이지들

// 개인 다움 컨설팅
router.get('/services/personal-consulting', (req, res) => {
  res.render('pages/services/personal-consulting', {
    title: '개인 다움 컨설팅 - 다움연구소',
    description: '퍼스널 브랜딩과 경쟁력 강화를 통해 당신만의 고유한 정체성을 발견하고 발전시키는 1:1 맞춤 컨설팅 서비스입니다.',
    keywords: '개인컨설팅, 퍼스널브랜딩, 경쟁력강화, 진로코칭, 커리어코칭',
    canonical: res.locals.siteUrl + '/services/personal-consulting'
  });
});

// 지식 구독 플랫폼
router.get('/services/knowledge-platform', (req, res) => {
  res.render('pages/services/knowledge-platform', {
    title: '지식 구독 플랫폼 - 다움연구소',
    description: '개인 맞춤형 솔루션을 뉴스레터로 정기 제공하는 지식 구독 서비스입니다. 월 구독제로 지속적인 성장을 지원합니다.',
    keywords: '뉴스레터, 지식구독, 월구독제, 개인맞춤, 솔루션',
    canonical: res.locals.siteUrl + '/services/knowledge-platform'
  });
});

// 조직 다움 워크숍
router.get('/services/organization-workshop', (req, res) => {
  res.render('pages/services/organization-workshop', {
    title: '조직 다움 워크숍 - 다움연구소',
    description: '조직의 정체성을 진단하고 문화 혁신을 통해 팀의 고유한 색깔과 경쟁력을 발견하는 워크숍 및 컨설팅 서비스입니다.',
    keywords: '조직컨설팅, 워크숍, 조직문화, 팀빌딩, 문화혁신',
    canonical: res.locals.siteUrl + '/services/organization-workshop'
  });
});

// 콘텐츠 개발 및 배포
router.get('/services/content-development', (req, res) => {
  res.render('pages/services/content-development', {
    title: '콘텐츠 개발 및 배포 - 다움연구소',
    description: '정체성 진단 키트, 워크북, 온라인 클래스 등 다양한 디지털 상품을 개발하고 배포하는 서비스입니다.',
    keywords: '콘텐츠개발, 진단키트, 워크북, 온라인클래스, 디지털상품',
    canonical: res.locals.siteUrl + '/services/content-development'
  });
});

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
      content: '김지원님의 상세한 성공 스토리...',
      beforeAfter: {
        before: ['방향성 없는 업무', '불안감', '스트레스'],
        after: ['명확한 목표', '자신감', '만족감']
      },
      testimonial: '이제는 매일 아침이 기다려집니다.',
      image: '/images/cases/kim-jiwon.jpg'
    }
    // 다른 케이스들...
  };

  const caseData = cases[caseId];
  
  if (!caseData) {
    return res.status(404).render('pages/error', {
      title: '사례를 찾을 수 없습니다',
      error: '요청하신 성공 사례를 찾을 수 없습니다.',
      status: 404
    });
  }

  res.render('pages/success-case-detail', {
    title: `${caseData.title} - ${caseData.name}님의 성공 사례`,
    description: caseData.summary,
    keywords: `성공사례, ${caseData.service}, ${caseData.occupation}, 변화, 성장`,
    canonical: res.locals.siteUrl + `/success-cases/${caseId}`,
    case: caseData
  });
});

// 블로그/아티클 페이지 (추후 확장용)
router.get('/blog', (req, res) => {
  res.render('pages/blog', {
    title: '블로그 - 다움연구소',
    description: '다움에 관한 인사이트와 실용적인 팁을 공유하는 다움연구소의 블로그입니다.',
    keywords: '블로그, 인사이트, 팁, 정체성, 성장',
    canonical: res.locals.siteUrl + '/blog'
  });
});

router.get('/blog/:slug', (req, res) => {
  const slug = req.params.slug;
  
  // 실제로는 데이터베이스나 CMS에서 가져올 데이터
  res.render('pages/blog-post', {
    title: `블로그 포스트 - 다움연구소`,
    description: '다움에 관한 깊이 있는 인사이트와 실용적인 조언을 담은 블로그 포스트입니다.',
    keywords: '블로그, 인사이트, 조언, 성장, 정체성',
    canonical: res.locals.siteUrl + `/blog/${slug}`,
    slug: slug
  });
});

// FAQ 페이지
router.get('/faq', (req, res) => {
  const faqs = [
    {
      category: '서비스 일반',
      questions: [
        {
          question: '다움연구소는 어떤 곳인가요?',
          answer: '다움연구소는 개인과 조직이 고유한 정체성을 발견하고 발전시킬 수 있도록 돕는 전문 연구기관입니다.'
        },
        {
          question: '어떤 서비스를 제공하나요?',
          answer: '개인 다움 컨설팅, 조직 다움 워크숍, 지식 구독 플랫폼, 콘텐츠 개발 등의 서비스를 제공합니다.'
        }
      ]
    },
    {
      category: '컨설팅',
      questions: [
        {
          question: '컨설팅은 어떻게 진행되나요?',
          answer: '초기 상담을 통해 현재 상황을 파악하고, 맞춤형 프로그램을 설계하여 단계별로 진행됩니다.'
        },
        {
          question: '컨설팅 기간은 얼마나 걸리나요?',
          answer: '개인의 상황과 목표에 따라 다르지만, 일반적으로 3-6개월 정도의 기간이 소요됩니다.'
        }
      ]
    }
  ];

  res.render('pages/faq', {
    title: '자주 묻는 질문 - 다움연구소',
    description: '다움연구소 서비스에 대해 자주 묻는 질문과 답변을 확인하세요.',
    keywords: 'FAQ, 자주묻는질문, 서비스안내, 컨설팅',
    canonical: res.locals.siteUrl + '/faq',
    faqs: faqs
  });
});

// 개인정보처리방침
router.get('/privacy-policy', (req, res) => {
  res.render('pages/privacy-policy', {
    title: '개인정보처리방침 - 다움연구소',
    description: '다움연구소의 개인정보 수집, 이용, 보관에 관한 정책을 안내합니다.',
    keywords: '개인정보처리방침, 프라이버시, 정보보호',
    canonical: res.locals.siteUrl + '/privacy-policy'
  });
});

// 이용약관
router.get('/terms-of-service', (req, res) => {
  res.render('pages/terms-of-service', {
    title: '이용약관 - 다움연구소',
    description: '다움연구소 서비스 이용에 관한 약관을 안내합니다.',
    keywords: '이용약관, 서비스약관, 이용조건',
    canonical: res.locals.siteUrl + '/terms-of-service'
  });
});

module.exports = router;