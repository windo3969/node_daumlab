const nodemailer = require('nodemailer');

// 이메일 설정
const emailConfig = {
  // Gmail 사용시
  gmail: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS // Gmail App Password 사용 권장
    }
  },

  // 네이버 메일 사용시
  naver: {
    service: 'naver',
    host: 'smtp.naver.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  },

  // 사용자 정의 SMTP 설정
  custom: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  }
};

// 트랜스포터 생성
const createTransporter = () => {
  const config = emailConfig.gmail; // 사용할 설정 선택
  
  return nodemailer.createTransporter({
    ...config,
    tls: {
      rejectUnauthorized: false
    }
  });
};

// 이메일 템플릿
const emailTemplates = {
  // 문의 접수 확인 이메일 (고객용)
  contactConfirmation: (data) => ({
    subject: '[다움연구소] 문의 접수 확인',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Noto Sans KR', sans-serif;">
        <div style="background: linear-gradient(135deg, #1a365d, #2d4a6b); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">다움연구소</h1>
          <p style="margin: 10px 0 0 0;">문의 접수 확인</p>
        </div>
        
        <div style="padding: 30px 20px; background: white;">
          <p style="color: #1a365d; font-size: 18px; font-weight: 600;">안녕하세요, ${data.name}님!</p>
          
          <p style="line-height: 1.6; color: #555;">
            다움연구소에 소중한 문의를 주셔서 감사합니다.<br>
            접수된 문의 내용을 확인하였으며, <strong>영업일 기준 1-2일 내</strong>에 담당자가 직접 연락드리겠습니다.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4a574;">
            <h3 style="color: #1a365d; margin-top: 0;">접수된 문의 내용</h3>
            <p><strong>제목:</strong> ${data.subject}</p>
            <p><strong>문의 유형:</strong> ${data.inquiryType || '일반 문의'}</p>
            <p><strong>문의 내용:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; margin-top: 10px;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1a365d; margin-top: 0;">긴급한 상담이 필요하시다면</h4>
            <p style="margin: 10px 0;">
              📞 <strong>전화:</strong> 02-123-4567 (평일 09:00-18:00)<br>
              📧 <strong>이메일:</strong> info@daum-institute.kr
            </p>
          </div>
          
          <p style="text-align: center; margin-top: 30px;">
            <a href="${process.env.SITE_URL}/services" style="display: inline-block; background: linear-gradient(135deg, #d4a574, #e6b885); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600;">
              서비스 더 알아보기
            </a>
          </p>
        </div>
        
        <div style="background: #1a365d; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">다움연구소 | 서울특별시 강남구 테헤란로 123, 8층</p>
          <p style="margin: 5px 0 0 0;">Tel: 02-123-4567 | Email: info@daum-institute.kr</p>
        </div>
      </div>
    `
  }),

  // 컨설팅 신청 확인 이메일 (고객용)
  consultingConfirmation: (data) => {
    const serviceTypeKo = {
      'personal': '개인 다움 컨설팅',
      'organization': '조직 다움 워크숍',
      'knowledge': '지식 구독 플랫폼',
      'content': '콘텐츠 개발 및 배포'
    };

    const budgetKo = {
      'under-50': '50만원 미만',
      '50-100': '50-100만원',
      '100-300': '100-300만원',
      '300-500': '300-500만원',
      'over-500': '500만원 이상',
      'discuss': '협의'
    };

    const timelineKo = {
      'urgent': '긴급 (1주일 내)',
      'within-month': '1개월 내',
      'within-quarter': '3개월 내',
      'flexible': '일정 협의'
    };

    return {
      subject: '[다움연구소] 컨설팅 신청 접수 확인',
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: 'Noto Sans KR', sans-serif;">
          <div style="background: linear-gradient(135deg, #1a365d, #2d4a6b); color: white; padding: 30px 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">다움연구소</h1>
            <p style="margin: 10px 0 0 0;">컨설팅 신청 접수 확인</p>
          </div>
          
          <div style="padding: 30px 20px; background: white;">
            <p style="color: #1a365d; font-size: 18px; font-weight: 600;">안녕하세요, ${data.name}님!</p>
            
            <p style="line-height: 1.6; color: #555;">
              다움연구소의 <strong>${serviceTypeKo[data.serviceType]}</strong> 서비스에 신청해주셔서 감사합니다.<br>
              신청 내용을 검토한 후, <strong>영업일 기준 2-3일 내</strong>에 전문 컨설턴트가 직접 연락드려 상세한 상담을 진행하겠습니다.
            </p>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4a574;">
              <h3 style="color: #1a365d; margin-top: 0;">신청하신 서비스</h3>
              <p><strong>서비스:</strong> ${serviceTypeKo[data.serviceType]}</p>
              <p><strong>예산:</strong> ${budgetKo[data.budget]}</p>
              <p><strong>희망 일정:</strong> ${timelineKo[data.timeline]}</p>
              ${data.company ? `<p><strong>회사/소속:</strong> ${data.company}</p>` : ''}
            </div>
            
            <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h4 style="color: #1a365d; margin-top: 0;">상담 진행 과정</h4>
              <ol style="margin: 10px 0; padding-left: 20px;">
                <li>신청 내용 검토 및 담당 컨설턴트 배정</li>
                <li>전화 상담을 통한 니즈 파악</li>
                <li>맞춤형 제안서 및 견적서 제공</li>
                <li>계약 체결 후 컨설팅 진행</li>
              </ol>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #ffeaa7;">
              <h4 style="color: #856404; margin-top: 0;">💡 미리 준비하시면 좋은 자료</h4>
              <ul style="margin: 10px 0; padding-left: 20px; color: #856404;">
                <li>현재 상황을 잘 보여주는 자료 (개인: 이력서, 조직: 조직도)</li>
                <li>기존에 시도해봤던 방법들과 결과</li>
                <li>구체적인 목표와 성과 지표</li>
              </ul>
            </div>
            
            <p style="text-align: center; margin-top: 30px;">
              <a href="${process.env.SITE_URL}/services" style="display: inline-block; background: linear-gradient(135deg, #d4a574, #e6b885); color: white; padding: 12px 30px; text-decoration: none; border-radius: 25px; font-weight: 600;">
                서비스 자세히 보기
              </a>
            </p>
          </div>
          
          <div style="background: #1a365d; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">다움연구소 | 서울특별시 강남구 테헤란로 123, 8층</p>
            <p style="margin: 5px 0 0 0;">Tel: 02-123-4567 | Email: consulting@daum-institute.kr</p>
          </div>
        </div>
      `
    };
  },

  // 뉴스레터 구독 확인 이메일 (고객용)
  newsletterConfirmation: (data) => ({
    subject: '[다움연구소] 뉴스레터 구독 완료',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Noto Sans KR', sans-serif;">
        <div style="background: linear-gradient(135deg, #1a365d, #2d4a6b); color: white; padding: 30px 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px;">다움연구소</h1>
          <p style="margin: 10px 0 0 0;">뉴스레터 구독 완료</p>
        </div>
        
        <div style="padding: 30px 20px; background: white;">
          <p style="color: #1a365d; font-size: 18px; font-weight: 600;">
            안녕하세요${data.name ? `, ${data.name}님` : ''}!
          </p>
          
          <p style="line-height: 1.6; color: #555;">
            다움연구소 뉴스레터 구독을 환영합니다! 🎉<br>
            <strong>${data.email}</strong>로 매주 금요일 오전 10시에 정체성 탐구와 성장에 관한 
            유용한 콘텐츠를 전달해드리겠습니다.
          </p>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #d4a574;">
            <h3 style="color: #1a365d; margin-top: 0;">🔥 뉴스레터에서 만나볼 내용</h3>
            <ul style="color: #555; line-height: 1.8;">
              <li><strong>정체성 탐구 가이드</strong> - 나다움을 발견하는 실용적 방법</li>
              <li><strong>성공 사례 공유</strong> - 실제 변화를 경험한 분들의 이야기</li>
              <li><strong>전문가 인사이트</strong> - 심리학, 철학 기반 깊이 있는 내용</li>
              <li><strong>월간 워크북</strong> - 직접 실천할 수 있는 활동지 제공</li>
              <li><strong>특별 혜택</strong> - 구독자 전용 할인 및 무료 세미나 초대</li>
            </ul>
          </div>
          
          <div style="background: #e8f4f8; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h4 style="color: #1a365d; margin-top: 0;">🎁 구독 환영 선물</h4>
            <p style="color: #555; margin-bottom: 15px;">
              첫 뉴스레터와 함께 <strong>「나다움 발견 워크북」</strong>을 무료로 받아보세요!
            </p>
            <p style="text-align: center;">
              <a href="${process.env.SITE_URL}/download/welcome-workbook" 
                 style="display: inline-block; background: #28a745; color: white; padding: 10px 20px; 
                        text-decoration: none; border-radius: 20px; font-weight: 600;">
                워크북 다운로드
              </a>
            </p>
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">
              더 이상 뉴스레터를 받고 싶지 않으시다면 
              <a href="${process.env.SITE_URL}/unsubscribe?email=${encodeURIComponent(data.email)}" 
                 style="color: #d4a574;">구독 취소</a>를 클릭해주세요.
            </p>
          </div>
        </div>
        
        <div style="background: #1a365d; color: white; padding: 20px; text-align: center; font-size: 14px;">
          <p style="margin: 0;">다움연구소 | 서울특별시 강남구 테헤란로 123, 8층</p>
          <p style="margin: 5px 0 0 0;">Email: newsletter@daum-institute.kr</p>
        </div>
      </div>
    `
  }),

  // 문의 접수 알림 이메일 (관리자용)
  contactNotification: (data) => ({
    subject: `[다움연구소] 새로운 문의: ${data.subject}`,
    html: `
      <div style="max-width: 800px; margin: 0 auto; font-family: 'Noto Sans KR', sans-serif;">
        <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 20px;">새로운 문의가 접수되었습니다</h1>
        </div>
        
        <div style="padding: 30px 20px; background: white; border: 1px solid #ddd;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #1a365d; margin-top: 0;">문의자 정보</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <p><strong>이름:</strong> ${data.name}</p>
              <p><strong>이메일:</strong> ${data.email}</p>
              <p><strong>전화번호:</strong> ${data.phone}</p>
              <p><strong>문의 유형:</strong> ${data.inquiryType || '일반 문의'}</p>
            </div>
          </div>
          
          <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #1a365d; margin-top: 0;">문의 제목</h3>
            <p style="font-size: 16px; font-weight: 600;">${data.subject}</p>
          </div>
          
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px;">
            <h3 style="color: #1a365d; margin-top: 0;">문의 내용</h3>
            <div style="line-height: 1.6;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          
          <div style="text-align: center;">
            <p style="color: #666; font-size: 14px; margin: 0;">
              접수 시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
            </p>
          </div>
        </div>
      </div>
    `
  }),

  // 컨설팅 신청 알림 이메일 (관리자용)
  consultingNotification: (data) => {
    const serviceTypeKo = {
      'personal': '개인 다움 컨설팅',
      'organization': '조직 다움 워크숍',
      'knowledge': '지식 구독 플랫폼',
      'content': '콘텐츠 개발 및 배포'
    };

    const budgetKo = {
      'under-50': '50만원 미만',
      '50-100': '50-100만원',
      '100-300': '100-300만원',
      '300-500': '300-500만원',
      'over-500': '500만원 이상',
      'discuss': '협의'
    };

    const timelineKo = {
      'urgent': '긴급 (1주일 내)',
      'within-month': '1개월 내',
      'within-quarter': '3개월 내',
      'flexible': '일정 협의'
    };

    return {
      subject: `[다움연구소] 새로운 컨설팅 신청: ${serviceTypeKo[data.serviceType]}`,
      html: `
        <div style="max-width: 800px; margin: 0 auto; font-family: 'Noto Sans KR', sans-serif;">
          <div style="background: #1a365d; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 20px;">새로운 컨설팅 신청이 접수되었습니다</h1>
          </div>
          
          <div style="padding: 30px 20px; background: white; border: 1px solid #ddd;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #1a365d; margin-top: 0;">신청자 정보</h2>
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                <p><strong>이름:</strong> ${data.name}</p>
                <p><strong>이메일:</strong> ${data.email}</p>
                <p><strong>전화번호:</strong> ${data.phone}</p>
                <p><strong>회사:</strong> ${data.company || '개인'}</p>
                <p><strong>직책:</strong> ${data.position || '없음'}</p>
                <p></p>
              </div>
            </div>
            
            <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1a365d; margin-top: 0;">신청 서비스</h3>
              <p><strong>서비스 유형:</strong> ${serviceTypeKo[data.serviceType]}</p>
              <p><strong>예산 범위:</strong> ${budgetKo[data.budget]}</p>
              <p><strong>희망 일정:</strong> ${timelineKo[data.timeline]}</p>
            </div>
            
            <div style="background: #f0fff0; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1a365d; margin-top: 0;">목표 및 기대사항</h3>
              <div style="line-height: 1.6;">
                ${data.goals.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            <div style="background: #fff5f5; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #1a365d; margin-top: 0;">현재 고민사항</h3>
              <div style="line-height: 1.6;">
                ${data.challenges.replace(/\n/g, '<br>')}
              </div>
            </div>
            
            ${data.additional ? `
              <div style="background: #fffacd; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1a365d; margin-top: 0;">추가 요청사항</h3>
                <div style="line-height: 1.6;">
                  ${data.additional.replace(/\n/g, '<br>')}
                </div>
              </div>
            ` : ''}
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            
            <div style="text-align: center;">
              <p style="color: #666; font-size: 14px; margin: 0;">
                접수 시간: ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}
              </p>
            </div>
          </div>
        </div>
      `
    };
  },

  // 뉴스레터 구독 알림 이메일 (관리자용)
  newsletterSubscription: (data) => ({
    subject: '[다움연구소] 새로운 뉴스레터 구독자',
    html: `
      <div style="max-width: 600px; margin: 0 auto; font-family: 'Noto Sans KR', sans-serif;">
        <div style="background: #28a745; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 18px;">새로운 뉴스레터 구독자가 등록되었습니다</h1>
        </div>
        
        <div style="padding: 30px 20px; background: white; border: 1px solid #ddd;">
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
            <h2 style="color: #1a365d; margin-top: 0;">구독자 정보</h2>
            <p><strong>이메일:</strong> ${data.email}</p>
            <p><strong>이름:</strong> ${data.name || '미입력'}</p>
            <p><strong>구독 일시:</strong> ${new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</p>
          </div>
        </div>
      </div>
    `
  })
};

// 이메일 발송 함수
const sendEmail = async (to, template, data) => {
  try {
    const transporter = createTransporter();
    const emailTemplate = emailTemplates[template](data);

    const mailOptions = {
      from: {
        name: '다움연구소',
        address: process.env.EMAIL_USER
      },
      to: to,
      subject: emailTemplate.subject,
      html: emailTemplate.html
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('이메일 발송 성공:', result.messageId);
    return { success: true, messageId: result.messageId };

  } catch (error) {
    console.error('이메일 발송 실패:', error);
    return { success: false, error: error.message };
  }
};

// 복수 수신자에게 이메일 발송
const sendMultipleEmails = async (recipients, template, data) => {
  const results = [];
  
  for (const recipient of recipients) {
    const result = await sendEmail(recipient, template, data);
    results.push({ recipient, ...result });
  }
  
  return results;
};

// 이메일 유효성 검사
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// 트랜스포터 연결 테스트
const testConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('이메일 서버 연결 성공');
    return true;
  } catch (error) {
    console.error('이메일 서버 연결 실패:', error);
    return false;
  }
};

module.exports = {
  createTransporter,
  emailTemplates,
  sendEmail,
  sendMultipleEmails,
  validateEmail,
  testConnection
};