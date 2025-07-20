const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// 문의 페이지 표시
router.get('/', (req, res) => {
  res.render('pages/contact', {
    title: '문의하기 - 다움연구소',
    description: '다움연구소에 궁금한 점이나 컨설팅 문의사항을 남겨주세요. 빠른 시간 내에 답변드리겠습니다.',
    keywords: '문의하기, 컨설팅문의, 상담신청, 연락처',
    canonical: res.locals.siteUrl + '/contact',
    formData: {},
    errors: {},
    success: false
  });
});

// 문의 폼 처리
router.post('/', contactController.validateContactForm, contactController.submitContactForm);

// AJAX 문의 폼 처리
router.post('/ajax', contactController.validateContactForm, contactController.submitContactFormAjax);

// 컨설팅 신청 폼 처리
router.post('/consulting', contactController.validateConsultingForm, contactController.submitConsultingForm);

// 뉴스레터 구독 신청
router.post('/newsletter', contactController.validateNewsletterForm, contactController.subscribeNewsletter);

module.exports = router;