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

// 1. 📧 컨설팅 신청 이메일 템플릿 추가 (createContactEmailTemplate 함수 뒤에 추가)

const createConsultingEmailTemplate = (data) => {
  const serviceTypeNames = {
    'personal': '개인 다움 컨설팅',
    'organization': '조직 다움 워크숍',
    'knowledge': '지식 구독 플랫폼',
    'content': '콘텐츠 개발 및 배포'
  };

  const budgetNames = {
    'under-100': '100만원 미만',
    '100-300': '100-300만원',
    '300-500': '300-500만원',
    '500-1000': '500-1000만원',
    'over-1000': '1000만원 이상',
    'negotiable': '협의'
  };

  const timelineNames = {
    'immediate': '즉시 시작',
    '1-month': '1개월 내',
    '2-3-months': '2-3개월 내',
    '3-6-months': '3-6개월 내',
    'flexible': '유연하게 조정'
  };

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; line-height: 1.6;">
      <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">다움연구소 컨설팅 신청</h1>
      </div>
      
      <div style="padding: 20px; background: #f8f9fa;">
        <h2 style="color: #1a365d; border-bottom: 2px solid #d4a574; padding-bottom: 10px;">
          새로운 컨설팅 신청이 접수되었습니다
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
          ${data.company ? `
          <tr>
            <td style="padding: 10px; background: #e2e8f0; font-weight: bold;">회사/소속</td>
            <td style="padding: 10px; background: white;">${data.company}</td>
          </tr>
          ` : ''}
          ${data.position ? `
          <tr>
            <td style="padding: 10px; background: #e2e8f0; font-weight: bold;">직책</td>
            <td style="padding: 10px; background: white;">${data.position}</td>
          </tr>
          ` : ''}
          <tr>
            <td style="padding: 10px; background: #e2e8f0; font-weight: bold;">서비스 유형</td>
            <td style="padding: 10px; background: white;">${serviceTypeNames[data.type] || data.type}</td>
          </tr>
          ${data.budget ? `
          <tr>
            <td style="padding: 10px; background: #e2e8f0; font-weight: bold;">예산 범위</td>
            <td style="padding: 10px; background: white;">${budgetNames[data.budget] || data.budget}</td>
          </tr>
          ` : ''}
          ${data.timeline ? `
          <tr>
            <td style="padding: 10px; background: #e2e8f0; font-weight: bold;">진행 일정</td>
            <td style="padding: 10px; background: white;">${timelineNames[data.timeline] || data.timeline}</td>
          </tr>
          ` : ''}
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

// 2. 📧 사용자용 컨설팅 확인 이메일 템플릿 추가

const createConsultingConfirmationTemplate = (data) => {
  const serviceTypeNames = {
    'personal': '개인 다움 컨설팅',
    'organization': '조직 다움 워크숍',
    'knowledge': '지식 구독 플랫폼',
    'content': '콘텐츠 개발 및 배포'
  };

  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">다움연구소</h1>
        <p style="margin: 5px 0 0 0;">컨설팅 신청 접수 완료</p>
      </div>
      
      <div style="padding: 20px;">
        <h2 style="color: #1a365d;">안녕하세요, ${data.name}님!</h2>
        
        <p><strong>${serviceTypeNames[data.type]}</strong> 서비스 신청을 해주셔서 감사합니다.</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #d4a574;">
          <h3 style="color: #1a365d; margin-top: 0;">📋 다음 단계</h3>
          <ol>
            <li>신청 내용 검토 (1-2일 소요)</li>
            <li>담당 컨설턴트 배정</li>
            <li>전화 상담 일정 조율</li>
            <li>맞춤형 제안서 제공</li>
            <li>계약 후 컨설팅 시작</li>
          </ol>
        </div>
        
        <p><strong>영업일 기준 2-3일 내</strong>에 담당자가 연락드려 상세한 상담을 진행하겠습니다.</p>
        
        <div style="background: #e8f4f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h4 style="color: #1a365d; margin-top: 0;">💡 미리 준비하시면 좋은 자료</h4>
          <ul>
            <li>현재 상황을 보여주는 자료 (이력서, 조직도 등)</li>
            <li>기존에 시도했던 방법들과 결과</li>
            <li>구체적인 목표와 성과 지표</li>
          </ul>
        </div>
        
        <p>궁금한 사항이 있으시면 언제든 연락주세요.</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666;">
          <p><strong>다움연구소</strong><br>
          이메일: consulting@daum-institute.kr<br>
          전화: 02-123-4567</p>
        </div>
      </div>
    </div>
  `;
};

// 3. 🔧 submitConsultingForm 함수 완성 (기존 함수 교체)

const submitConsultingForm = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.render('pages/consulting-apply', {
        title: '컨설팅 신청 - 다움연구소',
        description: '개인 또는 조직의 다움을 발견하는 전문 컨설팅 서비스를 신청하세요.',
        keywords: '다움연구소, 컨설팅신청, 상담예약',
        canonical: res.locals.siteUrl + '/contact/consulting-apply',
        formData: req.body,
        errors: errors.mapped(),
        success: false,
        showError: true,
        showSuccess: false
      });
    }

    const transporter = createTransporter();
    
    // 관리자에게 보낼 이메일
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.CONSULTING_EMAIL || process.env.ADMIN_EMAIL,
      subject: `[다움연구소] 새로운 컨설팅 신청: ${req.body.type}`,
      html: createConsultingEmailTemplate(req.body)
    };

    // 사용자에게 보낼 확인 이메일
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: '[다움연구소] 컨설팅 신청이 정상적으로 접수되었습니다',
      html: createConsultingConfirmationTemplate(req.body)
    };

    // 이메일 발송
    await transporter.sendMail(adminMailOptions);
    await transporter.sendMail(userMailOptions);

    res.render('pages/consulting-apply', {
      title: '컨설팅 신청 - 다움연구소',
      description: '개인 또는 조직의 다움을 발견하는 전문 컨설팅 서비스를 신청하세요.',
      keywords: '다움연구소, 컨설팅신청, 상담예약',
      canonical: res.locals.siteUrl + '/contact/consulting-apply',
      formData: {},
      errors: {},
      success: true,
      showSuccess: true,
      showError: false,
      successMessage: '컨설팅 신청이 성공적으로 접수되었습니다. 확인 이메일을 발송해드렸으며, 영업일 기준 2-3일 내에 전문 컨설턴트가 연락드리겠습니다.'
    });

  } catch (error) {
    console.error('Consulting form error:', error);
    res.render('pages/consulting-apply', {
      title: '컨설팅 신청 - 다움연구소',
      description: '개인 또는 조직의 다움을 발견하는 전문 컨설팅 서비스를 신청하세요.',
      keywords: '다음연구소, 컨설팅신청, 상담예약',
      canonical: res.locals.siteUrl + '/contact/consulting-apply',
      formData: req.body,
      errors: { general: { msg: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' } },
      success: false,
      showError: true,
      showSuccess: false
    });
  }
};

// 4. 📧 뉴스레터 이메일 템플릿 추가

const createNewsletterConfirmationTemplate = (data) => {
  return `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">다움연구소</h1>
        <p style="margin: 5px 0 0 0;">뉴스레터 구독 완료</p>
      </div>
      
      <div style="padding: 20px;">
        <h2 style="color: #1a365d;">
          안녕하세요${data.name ? `, ${data.name}님` : ''}! 🎉
        </h2>
        
        <p>다움연구소 뉴스레터 구독을 환영합니다!</p>
        
        <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #d4a574;">
          <h3 style="color: #1a365d; margin-top: 0;">📬 뉴스레터에서 만나볼 내용</h3>
          <ul>
            <li><strong>정체성 탐구 가이드</strong> - 나다움을 발견하는 실용적 방법</li>
            <li><strong>성공 사례 공유</strong> - 실제 변화를 경험한 분들의 이야기</li>
            <li><strong>전문가 인사이트</strong> - 심리학, 철학 기반 깊이 있는 내용</li>
            <li><strong>월간 워크북</strong> - 직접 실천할 수 있는 활동지</li>
            <li><strong>구독자 특별 혜택</strong> - 할인 혜택 및 무료 세미나 초대</li>
          </ul>
        </div>
        
        <p><strong>매주 금요일 오전 10시</strong>에 <strong>${data.email}</strong>로 발송됩니다.</p>
        
        <div style="text-align: center; margin: 30px 0;">
          <p style="background: #e8f4f8; padding: 15px; border-radius: 5px; color: #1a365d;">
            🎁 <strong>첫 뉴스레터와 함께 「나다움 발견 워크북」을 무료로 받아보세요!</strong>
          </p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 14px;">
          <p><strong>다움연구소</strong><br>
          이메일: newsletter@daum-institute.kr<br>
          <a href="${process.env.SITE_URL}/unsubscribe?email=${encodeURIComponent(data.email)}" style="color: #d4a574;">구독 취소</a></p>
        </div>
      </div>
    </div>
  `;
};

// 5. 🔧 subscribeNewsletter 함수 완성 (기존 함수 교체)

const subscribeNewsletter = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.mapped()
      });
    }

    const transporter = createTransporter();
    
    // 사용자에게 확인 이메일
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: '[다움연구소] 뉴스레터 구독이 완료되었습니다!',
      html: createNewsletterConfirmationTemplate(req.body)
    };

    // 관리자에게 알림 이메일
    const adminMailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: '[다움연구소] 새로운 뉴스레터 구독자',
      html: `
        <div style="max-width: 500px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: #28a745; color: white; padding: 15px; text-align: center;">
            <h2 style="margin: 0;">새로운 뉴스레터 구독자</h2>
          </div>
          <div style="padding: 20px; background: #f8f9fa;">
            <p><strong>이메일:</strong> ${req.body.email}</p>
            <p><strong>이름:</strong> ${req.body.name || '미입력'}</p>
            <p><strong>구독 일시:</strong> ${new Date().toLocaleString('ko-KR')}</p>
          </div>
        </div>
      `
    };

    // 이메일 발송
    await transporter.sendMail(userMailOptions);
    await transporter.sendMail(adminMailOptions);

    // 실제 환경에서는 데이터베이스에 구독자 정보 저장
    // await saveSubscriberToDatabase(req.body);

    res.json({
      success: true,
      message: '뉴스레터 구독이 완료되었습니다! 확인 이메일을 확인해주세요. 🎉'
    });

    console.log(`뉴스레터 구독 - 이메일: ${req.body.email}, 이름: ${req.body.name || '미입력'}`);

  } catch (error) {
    console.error('Newsletter subscription error:', error);
    res.status(500).json({
      success: false,
      message: '구독 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
    });
  }
};

// 6. 🆕 API 엔드포인트 함수들 추가

const apiContactSubmit = async (req, res) => {
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
      subject: `[다움연구소] API 문의: ${req.body.type}`,
      html: createContactEmailTemplate(req.body)
    };

    await transporter.sendMail(adminMailOptions);

    res.json({
      success: true,
      message: '문의가 성공적으로 접수되었습니다.',
      data: {
        name: req.body.name,
        email: req.body.email,
        type: req.body.type
      }
    });

  } catch (error) {
    console.error('API contact submit error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

const apiConsultingSubmit = async (req, res) => {
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
      to: process.env.CONSULTING_EMAIL || process.env.ADMIN_EMAIL,
      subject: `[다움연구소] API 컨설팅 신청: ${req.body.type}`,
      html: createConsultingEmailTemplate(req.body)
    };

    await transporter.sendMail(adminMailOptions);

    res.json({
      success: true,
      message: '컨설팅 신청이 성공적으로 접수되었습니다.',
      data: {
        name: req.body.name,
        email: req.body.email,
        type: req.body.type
      }
    });

  } catch (error) {
    console.error('API consulting submit error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};

const apiNewsletterSubmit = async (req, res) => {
  try {
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.mapped()
      });
    }

    const transporter = createTransporter();
    
    const userMailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: '[다움연구소] 뉴스레터 구독 완료',
      html: createNewsletterConfirmationTemplate(req.body)
    };

    await transporter.sendMail(userMailOptions);

    res.json({
      success: true,
      message: '뉴스레터 구독이 완료되었습니다.',
      data: {
        email: req.body.email,
        name: req.body.name
      }
    });

  } catch (error) {
    console.error('API newsletter submit error:', error);
    res.status(500).json({
      success: false,
      message: '서버 오류가 발생했습니다.'
    });
  }
};
// 7. 📤 module.exports에 새 함수들 추가

module.exports = {
  validateContactForm,
  validateConsultingForm,
  validateNewsletterForm,
  submitContactForm,
  submitContactFormAjax,
  submitConsultingForm, // 완성된 버전으로 교체
  subscribeNewsletter,   // 완성된 버전으로 교체
  // 🆕 새로 추가된 API 함수들
  apiContactSubmit,
  apiConsultingSubmit,
  apiNewsletterSubmit
};