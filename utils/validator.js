// 유효성 검사 유틸리티 함수들

// 이메일 유효성 검사
const validateEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// 한국 휴대폰 번호 유효성 검사
const validateKoreanPhone = (phone) => {
  const phoneRegex = /^01[0-9]-[0-9]{3,4}-[0-9]{4}$/;
  return phoneRegex.test(phone);
};

// 이름 유효성 검사 (한글, 영문만 허용)
const validateName = (name) => {
  const nameRegex = /^[가-힣a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

// 문자열 길이 검사
const validateLength = (str, min, max) => {
  const trimmed = str.trim();
  return trimmed.length >= min && trimmed.length <= max;
};

// 필수 필드 검사
const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

// 선택 옵션 유효성 검사
const validateOption = (value, validOptions) => {
  return validOptions.includes(value);
};

// 문의 폼 유효성 검사
const validateContactForm = (data) => {
  const errors = [];

  // 이름 검사
  if (!validateRequired(data.name)) {
    errors.push({ field: 'name', message: '이름을 입력해주세요.' });
  } else if (!validateName(data.name)) {
    errors.push({ field: 'name', message: '이름은 2-50자의 한글 또는 영문만 입력 가능합니다.' });
  }

  // 이메일 검사
  if (!validateRequired(data.email)) {
    errors.push({ field: 'email', message: '이메일을 입력해주세요.' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: '올바른 이메일 형식을 입력해주세요.' });
  }

  // 전화번호 검사
  if (!validateRequired(data.phone)) {
    errors.push({ field: 'phone', message: '전화번호를 입력해주세요.' });
  } else if (!validateKoreanPhone(data.phone)) {
    errors.push({ field: 'phone', message: '올바른 전화번호 형식을 입력해주세요. (예: 010-0000-0000)' });
  }

  // 제목 검사
  if (!validateRequired(data.subject)) {
    errors.push({ field: 'subject', message: '제목을 입력해주세요.' });
  } else if (!validateLength(data.subject, 5, 100)) {
    errors.push({ field: 'subject', message: '제목은 5-100자 사이로 입력해주세요.' });
  }

  // 문의 내용 검사
  if (!validateRequired(data.message)) {
    errors.push({ field: 'message', message: '문의 내용을 입력해주세요.' });
  } else if (!validateLength(data.message, 10, 1000)) {
    errors.push({ field: 'message', message: '문의 내용은 10-1000자 사이로 입력해주세요.' });
  }

  // 문의 유형 검사 (선택사항)
  if (data.inquiryType) {
    const validInquiryTypes = ['general', 'service', 'partnership', 'media', 'other'];
    if (!validateOption(data.inquiryType, validInquiryTypes)) {
      errors.push({ field: 'inquiryType', message: '올바른 문의 유형을 선택해주세요.' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// 컨설팅 신청 폼 유효성 검사
const validateConsultingForm = (data) => {
  const errors = [];

  // 이름 검사
  if (!validateRequired(data.name)) {
    errors.push({ field: 'name', message: '이름을 입력해주세요.' });
  } else if (!validateName(data.name)) {
    errors.push({ field: 'name', message: '이름은 2-50자의 한글 또는 영문만 입력 가능합니다.' });
  }

  // 이메일 검사
  if (!validateRequired(data.email)) {
    errors.push({ field: 'email', message: '이메일을 입력해주세요.' });
  } else if (!validateEmail(data.email)) {
    errors.push({ field: 'email', message: '올바른 이메일 형식을 입력해주세요.' });
  }

  // 전화번호 검사
  if (!validateRequired(data.phone)) {
    errors.push({ field: 'phone', message: '전화번호를 입력해주세요.' });
  } else if (!validateKoreanPhone(data.phone)) {
    errors.push({ field: 'phone', message: '올바른 전화번호 형식을 입력해주세요. (예: 010-0000-0000)' });
  }

  // 서비스 유형 검사
  const validServiceTypes = ['personal', 'organization', 'knowledge', 'content'];
  if (!validateRequired(data.serviceType)) {
    errors.push({ field: 'serviceType', message: '서비스 유형을 선택해주세요.' });
  } else if (!validateOption(data.serviceType, validServiceTypes)) {
    errors.push({ field: 'serviceType', message: '올바른 서비스 유형을 선택해주세요.' });
  }

  // 회사/소속 검사 (선택사항)
  if (data.company && !validateLength(data.company, 0, 100)) {
    errors.push({ field: 'company', message: '회사명은 100자 이하로 입력해주세요.' });
  }

  // 직책 검사 (선택사항)
  if (data.position && !validateLength(data.position, 0, 50)) {
    errors.push({ field: 'position', message: '직책은 50자 이하로 입력해주세요.' });
  }

  // 예산 범위 검사
  const validBudgets = ['under-50', '50-100', '100-300', '300-500', 'over-500', 'discuss'];
  if (!validateRequired(data.budget)) {
    errors.push({ field: 'budget', message: '예산 범위를 선택해주세요.' });
  } else if (!validateOption(data.budget, validBudgets)) {
    errors.push({ field: 'budget', message: '올바른 예산 범위를 선택해주세요.' });
  }

  // 희망 일정 검사
  const validTimelines = ['urgent', 'within-month', 'within-quarter', 'flexible'];
  if (!validateRequired(data.timeline)) {
    errors.push({ field: 'timeline', message: '희망 일정을 선택해주세요.' });
  } else if (!validateOption(data.timeline, validTimelines)) {
    errors.push({ field: 'timeline', message: '올바른 희망 일정을 선택해주세요.' });
  }

  // 목표 및 기대사항 검사
  if (!validateRequired(data.goals)) {
    errors.push({ field: 'goals', message: '목표 및 기대사항을 입력해주세요.' });
  } else if (!validateLength(data.goals, 20, 1000)) {
    errors.push({ field: 'goals', message: '목표 및 기대사항은 20-1000자 사이로 입력해주세요.' });
  }

  // 현재 고민사항 검사
  if (!validateRequired(data.challenges)) {
    errors.push({ field: 'challenges', message: '현재 고민사항을 입력해주세요.' });
  } else if (!validateLength(data.challenges, 10, 1000)) {
    errors.push({ field: 'challenges', message: '현재 고민사항은 10-1000자 사이로 입력해주세요.' });
  }

  // 추가 요청사항 검사 (선택사항)
  if (data.additional && !validateLength(data.additional, 0, 1000)) {
    errors.push({ field: 'additional', message: '추가 요청사항은 1000자 이하로 입력해주세요.' });
  }

  return {
    isValid: errors.length === 0,
    errors: errors
  };
};

// 텍스트 정제 함수
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // HTML 태그 제거
  const htmlRegex = /<[^>]*>/g;
  let sanitized = input.replace(htmlRegex, '');
  
  // 연속된 공백을 하나로 변환
  sanitized = sanitized.replace(/\s+/g, ' ');
  
  // 앞뒤 공백 제거
  sanitized = sanitized.trim();
  
  return sanitized;
};

// 데이터 정제 함수
const sanitizeFormData = (data) => {
  const sanitized = {};
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeInput(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized;
};

// SQL 인젝션 방지 (기본적인 체크)
const checkSQLInjection = (input) => {
  const sqlPatterns = [
    /('|(\\'))|(;|(\\;))|(--|(\\--))|(#|(\\#))/i,
    /(union|select|insert|update|delete|drop|create|alter|exec|execute)/i
  ];
  
  return !sqlPatterns.some(pattern => pattern.test(input));
};

// XSS 공격 방지
const checkXSS = (input) => {
  const xssPatterns = [
    /<script[^>]*>.*?<\/script>/gi,
    /<iframe[^>]*>.*?<\/iframe>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi
  ];
  
  return !xssPatterns.some(pattern => pattern.test(input));
};

// 보안 검사 함수
const securityCheck = (data) => {
  const issues = [];
  
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === 'string') {
      if (!checkSQLInjection(value)) {
        issues.push(`${key} 필드에서 SQL 인젝션 시도가 감지되었습니다.`);
      }
      
      if (!checkXSS(value)) {
        issues.push(`${key} 필드에서 XSS 공격 시도가 감지되었습니다.`);
      }
    }
  }
  
  return {
    isSafe: issues.length === 0,
    issues: issues
  };
};

// 폼 데이터 전체 검증
const validateAndSanitize = (data, formType) => {
  // 1. 데이터 정제
  const sanitizedData = sanitizeFormData(data);
  
  // 2. 보안 검사
  const securityResult = securityCheck(sanitizedData);
  if (!securityResult.isSafe) {
    return {
      isValid: false,
      errors: securityResult.issues.map(issue => ({ field: 'security', message: issue })),
      data: null
    };
  }
  
  // 3. 폼별 유효성 검사
  let validationResult;
  switch (formType) {
    case 'contact':
      validationResult = validateContactForm(sanitizedData);
      break;
    case 'consulting':
      validationResult = validateConsultingForm(sanitizedData);
      break;
    default:
      return {
        isValid: false,
        errors: [{ field: 'form', message: '알 수 없는 폼 유형입니다.' }],
        data: null
      };
  }
  
  return {
    isValid: validationResult.isValid,
    errors: validationResult.errors,
    data: validationResult.isValid ? sanitizedData : null
  };
};

module.exports = {
  validateEmail,
  validateKoreanPhone,
  validateName,
  validateLength,
  validateRequired,
  validateOption,
  validateContactForm,
  validateConsultingForm,
  sanitizeInput,
  sanitizeFormData,
  securityCheck,
  validateAndSanitize
};