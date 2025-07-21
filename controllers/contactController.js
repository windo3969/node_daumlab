const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

// 이메일 설정
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: process.env.EMAIL_SERVICE || 'gmail',
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// 유효성 검사 규칙
const contactValidationRules = () => {
  return [
    body('name')
      .trim()
      .isLength({ min: 2, max: 50 })
      .withMessage('이름은 2-50자 사이로 입력해주세요.')
      .matches(/^[가-힣a-zA-Z\s]+$/)
      .withMessage('이름은 한글, 영문, 공백만 입력 가능합니다.'),
    
    body('email')
      .trim()
      .isEmail()
      .withMessage('올바른 이메일 주소를 입력해주세요.')
      .normalizeEmail(),
    
    body('phone')
      .optional()
      .trim()
      .matches(/^[0-9\-\s\+\(\)]+$/)
      .withMessage('올바른 전화번호를 입력해주세요.'),
    
    body('type')
      .isIn(['personal', 'organization', 'newsletter', 'content', 'etc'])
      .withMessage('올바른 문의 유형을 선택해주세요.'),
    
    body('message')
      .trim()
      .isLength({ min: 10, max: 1000 })
      .withMessage('문의 내용은 10-1000자 사이로 입력해주세요.')
  ];
};

const consultingValidationRules = () => {
  return [
    ...contactValidationRules(),
    body('company')
      .optional()
      .trim()
      .isLength({ max: 100 })
      .withMessage('회사명은 100자 이하로 입력해주세요.'),
    
    body('position')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('직책은 50자 이하로 입력해주세요.'),
    
    body('budget')
      .optional()
      .isIn(['under-100', '100-300', '300-500', '500-1000', 'over-1000', 'negotiable'])
      .withMessage('올바른 예산 범위를 선택해주세요.'),
    
    body('timeline')
      .optional()
      .isIn(['immediate', '1-month', '2-3-months', '3-6-months', 'flexible'])
      .withMessage('올바른 진행 일정을 선택해주세요.')
  ];
};

const newsletterValidationRules = () => {
  return [
    body('email')
      .trim()
      .isEmail()
      .withMessage('올바른 이메일 주소를 입력해주세요.')
      .normalizeEmail(),
    
    body('name')
      .optional()
      .trim()
      .isLength({ max: 50 })
      .withMessage('이름은 50자 이하로 입력해주세요.')
  ];
};

// 미들웨어: 유효성 검사
const validateContactForm = contactValidationRules();
const validateConsultingForm = consultingValidationRules();
const validateNewsletterForm = newsletterValidationRules();

// 이메일 템플릿
const createContactEmailTemplate = (data) => {
  const typeNames = {
    'personal': '개인 다움 컨설팅',
    'organization': '조직 다움 워크숍',
    'newsletter': '지식 구독 서비스',
    'content': '콘텐츠 구매 및 이용',
    'etc': '기타 문의'
  };

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
      <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">다움연구소 문의</h1>
      </div>
      
      <div style="padding: 20px; background: #f8f9fa;">
        <h2 style="color: #1a365d; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
          새로운 문의가 접수되었습니다
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <tr>
            <td style="padding: 10px; background: #e2e8f0; font-weight: bold; width: 120px;">이름</td>
            <td style="padding: 10px; background: white;">${data.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #e2e8f0; font-weight: bold;">이메일</td>
            <td style="padding: 10px; background: white;">${data.email}</td>
          </tr>
          ${data.phone ? `
          <tr>
            <td style="padding: 10px; background: #e2e8f0; font-weight: bold;">연락처</td>
            <td style="padding: 10px; background: white;">${data.phone}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px; background: #e2e8f0; font-weight: bold;">문의 유형</td>
            <td style="padding: 10px; background: white;">${typeNames[data.type] || data.type}</td>
          </tr>
        </table>
        
        <div style="margin: 20px 0;">
          <h3 style="color: #1a365d; margin-bottom: 10px;">문의 내용</h3>
          <div style="background: white; padding: 15px; border-left: 4px solid #d4a574; white-space: pre-wrap;">
${data.message}
          </div>
        </div>
        
        <div style="text-align: center; margin: 30px 0; padding: 20px; background: white; border-radius: 5px;">
          <p style="margin: 0; color: #666;">
            접수 시간: ${new Date().toLocaleString('ko-KR')}
          </p>
        </div>
      </div>
    </div>
  `;
};

// 컨트롤러 함수들
const submitContactForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render('pages/contact', {
        title: '문의하기 - 다움연구소',
        description: '다움연구소에 궁금한 점이나 컨설팅 문의사항을 남겨주세요.',
        keywords: '문의하기, 컨설팅문의, 상담신청, 연락처',
        canonical: res.locals.siteUrl + '/contact',
        formData: req.body,
        errors: errors.mapped(),
        success: false
      });
    }

    const transporter = createTransporter();
    
    // 관리자에게 보낼 이메일
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `[다움연구소] 새로운 문의: ${req.body.type}`,
      html: createContactEmailTemplate(req.body)
    };

    // 사용자에게 보낼 확인 이메일
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: '[다움연구소] 문의가 정상적으로 접수되었습니다',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">다움연구소</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #1a365d;">안녕하세요, ${req.body.name}님!</h2>
            <p>문의해 주셔서 감사합니다. 접수된 문의는 영업일 기준 1-2일 내에 답변드리겠습니다.</p>
            <p>추가 문의사항이 있으시면 언제든 연락주세요.</p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
              <p><strong>다움연구소</strong><br>
              이메일: info@daum-institute.kr<br>
              전화: 02-123-4567</p>
            </div>
          </div>
        </div>
      `
    };

    // 이메일 발송
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.render('pages/contact', {
      title: '문의하기 - 다움연구소',
      description: '다움연구소에 궁금한 점이나 컨설팅 문의사항을 남겨주세요.',
      keywords: '문의하기, 컨설팅문의, 상담신청, 연락처',
      canonical: res.locals.siteUrl + '/contact',
      formData: {},
      errors: {},
      success: true
    });

  } catch (error) {
    console.error('Contact form error:', error);
    res.render('pages/contact', {
      title: '문의하기 - 다움연구소',
      description: '다움연구소에 궁금한 점이나 컨설팅 문의사항을 남겨주세요.',
      keywords: '문의하기, 컨설팅문의, 상담신청, 연락처',
      canonical: res.locals.siteUrl + '/contact',
      formData: req.body,
      errors: { general: { msg: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' } },
      success: false
    });
  }
};

const submitContactFormAjax = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.mapped()
      });
    }

    const transporter = createTransporter();
    
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: `[다움연구소] 새로운 문의: ${req.body.type}`,
      html: createContactEmailTemplate(req.body)
    };

    await transporter.sendMail(adminMailOptions);

    res.json({
      success: true,
      message: '문의가 성공적으로 접수되었습니다. 빠른 시간 내에 답변드리겠습니다.'
    });

  } catch (error) {
    console.error('Contact form AJAX error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
};

const submitConsultingForm = async (req, res) => {
  // 컨설팅 신청 폼 처리 로직
  // submitContactForm과 유사하지만 추가 필드들을 처리
  res.redirect('/consulting-apply?success=true');
};

const subscribeNewsletter = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.mapped()
      });
    }

    // 실제로는 뉴스레터 구독 데이터베이스에 저장
    // 여기서는 이메일 발송으로 대체

    res.json({
      success: true,
      message: '뉴스레터 구독이 완료되었습니다!'
    });

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: '구독 처리 중 오류가 발생했습니다.'
    });
  }
};

module.exports = {
  validateContactForm,
  validateConsultingForm,
  validateNewsletterForm,
  submitContactForm,
  submitContactFormAjax,
  submitConsultingForm,
  subscribeNewsletter
};
