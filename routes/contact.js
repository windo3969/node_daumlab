const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// 문의 페이지 표시
router.get('/', (req, res) => {
  res.render('pages/contact', {
    title: '문의하기 - 다움연구소',
    description: '다움연구소에 궁금한 점이나 컨설팅 문의사항을 남겨주세요. 빠른 시간 내에 답변드리겠습니다.',
    keywords: '문의하기, 컨설팅문의, 상담신청, 연락처, 다움연구소',
    canonical: res.locals.siteUrl + '/contact',
    formData: {},
    errors: [],
    success: false,
    showError: false,
    showSuccess: false,
    pageType: 'contact'
  });
});

// 컨설팅 신청 페이지 표시
router.get('/consulting-apply', (req, res) => {
  res.render('pages/consulting-apply', {
    title: '컨설팅 신청 - 다움연구소',
    description: '개인 또는 조직의 다움을 발견하는 전문 컨설팅 서비스를 신청하세요. 맞춤형 솔루션을 제공해드립니다.',
    keywords: '다움연구소, 컨설팅신청, 상담예약, 개인컨설팅, 조직워크숍',
    canonical: res.locals.siteUrl + '/contact/consulting-apply',
    formData: {},
    errors: [],
    success: false,
    showError: false,
    showSuccess: false,
    pageType: 'consulting'
  });
});

// 문의 폼 처리
router.post('/', contactController.validateContactForm, contactController.submitContactForm);

// AJAX 문의 폼 처리
router.post('/ajax', contactController.validateContactForm, contactController.submitContactFormAjax);

// 컨설팅 신청 폼 처리
router.post('/consulting-apply', contactController.validateConsultingForm, contactController.submitConsultingForm);

// 뉴스레터 구독 신청
router.post('/newsletter', contactController.validateNewsletterForm, contactController.subscribeNewsletter);

// API 엔드포인트들 (JSON 응답)
router.post('/api/contact', contactController.validateContactForm, contactController.apiContactSubmit);
router.post('/api/consulting', contactController.validateConsultingForm, contactController.apiConsultingSubmit);
router.post('/api/newsletter', contactController.validateNewsletterForm, contactController.apiNewsletterSubmit);

module.exports = router;