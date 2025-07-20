# 다움연구소 웹사이트

개인과 조직의 고유한 정체성을 발견하고 발전시키는 다움연구소의 공식 웹사이트입니다.

## 🚀 빠른 시작

### 필수 요구사항
- Node.js 18.0.0 이상
- npm 9.0.0 이상

### 설치 및 실행

```bash
# 프로젝트 클론
git clone [repository-url]
cd daum-research-institute

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env
# .env 파일을 편집하여 필요한 환경 변수를 설정하세요

# 개발 서버 실행
npm run dev

# 프로덕션 서버 실행
npm start
```

### 환경 변수 설정

`.env` 파일에서 다음 환경 변수들을 설정해야 합니다:

```bash
# 서버 설정
NODE_ENV=development
PORT=3000
HOST=localhost

# 이메일 설정 (문의 폼용)
EMAIL_SERVICE=gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=admin@daum-institute.kr

# 보안 설정
SESSION_SECRET=your-super-secret-key
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## 📁 프로젝트 구조

```
daum-research-institute/
├── app.js                 # Express 앱 설정
├── server.js              # 서버 시작 파일
├── package.json
├── .env                   # 환경 변수
├── public/                # 정적 파일
│   ├── css/
│   ├── js/
│   └── images/
├── views/                 # EJS 템플릿
│   ├── layout.ejs
│   ├── pages/
│   └── partials/
├── routes/                # 라우팅
│   ├── index.js
│   ├── pages.js
│   └── contact.js
├── controllers/           # 컨트롤러
└── config/               # 설정 파일
```

## 🛠️ 사용 기술

### 백엔드
- **Node.js** - 런타임 환경
- **Express.js** - 웹 프레임워크
- **EJS** - 템플릿 엔진
- **Nodemailer** - 이메일 발송

### 보안
- **Helmet** - 보안 헤더 설정
- **CORS** - Cross-Origin Resource Sharing
- **Rate Limiting** - 요청 제한

### 프론트엔드
- **Bootstrap 5** - CSS 프레임워크
- **Vanilla JavaScript** - 클라이언트 사이드 스크립트

## 📄 주요 페이지

- **홈페이지** (`/`) - 메인 소개 페이지
- **연구소 소개** (`/about`) - 다움연구소 소개
- **핵심 가치** (`/values`) - 5가지 핵심 가치 소개
- **비전** (`/vision`) - 다움연구소의 비전
- **핵심 사업** (`/services`) - 제공 서비스 소개
- **성공 사례** (`/success-cases`) - 고객 성공 사례
- **요금제** (`/pricing`) - 서비스 요금제
- **문의하기** (`/contact`) - 문의 및 상담 신청

### 서비스 상세 페이지
- **개인 다움 컨설팅** (`/services/personal-consulting`)
- **지식 구독 플랫폼** (`/services/knowledge-platform`)
- **조직 다움 워크숍** (`/services/organization-workshop`)
- **콘텐츠 개발** (`/services/content-development`)

## 🔧 개발 명령어

```bash
# 개발 서버 실행 (nodemon 사용)
npm run dev

# 프로덕션 서버 실행
npm start

# CSS 빌드 (SASS 사용 시)
npm run build-css

# CSS 감시 모드
npm run watch-css

# 전체 빌드
npm run build
```

## 📧 문의 폼 기능

웹사이트는 다음과 같은 문의 기능을 제공합니다:

- **일반 문의** - 기본 문의 폼
- **컨설팅 신청** - 상세한 컨설팅 신청 폼
- **뉴스레터 구독** - 이메일 구독 기능
- **AJAX 지원** - 페이지 새로고침 없는 폼 제출

## 🔒 보안 기능

- **Rate Limiting** - API 요청 제한
- **CORS 정책** - 허용된 도메인만 접근
- **Helmet** - 보안 헤더 자동 설정
- **입력 검증** - 모든 폼 입력 검증
- **XSS 방지** - 템플릿 이스케이핑

## 🚀 배포

### 프로덕션 환경 변수

```bash
NODE_ENV=production
PORT=80
HOST=0.0.0.0
SITE_URL=https://daum-institute.kr
```

### PM2를 사용한 배포 (권장)

```bash
# PM2 설치
npm install -g pm2

# 애플리케이션 시작
pm2 start server.js --name "daum-institute"

# 자동 재시작 설정
pm2 startup
pm2 save
```

## 📝 개발 참고사항

### EJS 템플릿 사용법
- `views/layout.ejs` - 기본 레이아웃
- `views/partials/` - 재사용 가능한 컴포넌트
- `views/pages/` - 개별 페이지 템플릿

### 정적 파일 관리
- CSS 파일: `public/css/`
- JavaScript 파일: `public/js/`
- 이미지 파일: `public/images/`

### 라우팅 규칙
- 메인 페이지: `routes/index.js`
- 서브 페이지: `routes/pages.js`
- 문의 기능: `routes/contact.js`

## 🤝 기여하기

1. 이 저장소를 포크합니다
2. 기능 브랜치를 생성합니다 (`git checkout -b feature/AmazingFeature`)
3. 변경사항을 커밋합니다 (`git commit -m 'Add some AmazingFeature'`)
4. 브랜치에 푸시합니다 (`git push origin feature/AmazingFeature`)
5. Pull Request를 생성합니다

## 📞 지원 및 문의

- **이메일**: info@daum-institute.kr
- **전화**: 02-123-4567
- **주소**: 서울특별시 강남구 테헤란로 123, 8층

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 🔄 버전 히스토리

### v1.0.0
- 초기 웹사이트 구축
- 기본 페이지 및 문의 기능 구현
- 반응형 디자인 적용

---

© 2023 (주)다움연구소. All rights reserved.