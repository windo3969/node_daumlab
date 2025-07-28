const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();

// 보안 미들웨어
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "https://cdn.jsdelivr.net",
        "https://fonts.googleapis.com",
        "https://unpkg.com",
        "https://cdnjs.cloudflare.com"
      ],
      // 'data:' 추가
      fontSrc: [
        "'self'",
        "https://fonts.gstatic.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "data:" // 새로 추가
      ],
      scriptSrc: [
        "'self'",
        "https://cdn.jsdelivr.net",
        "https://unpkg.com"
      ],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"]
    }
  }
}));

// CORS 설정
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? ['https://daum-institute.kr', 'https://www.daum-institute.kr']
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15분
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 최대 100회 요청
  message: {
    error: '너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.',
    retryAfter: '15분 후에 다시 시도해주세요.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// 문의 폼에 더 엄격한 제한 적용
const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1시간
  max: 5, // 최대 5회 문의
  message: {
    error: '문의 폼은 시간당 5회로 제한됩니다. 잠시 후 다시 시도해주세요.'
  }
});

app.use(limiter);

// 로깅
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 정적 파일 제공
app.use(express.static(path.join(__dirname, 'public'), {
  maxAge: process.env.NODE_ENV === 'production' ? '1d' : '0'
}));

// Body Parser 설정
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// 뷰 엔진 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// EJS 레이아웃 엔진 설정 (express-ejs-layouts 사용하지 않고 직접 구현)
app.use((req, res, next) => {
  const originalRender = res.render;

  res.render = function (view, options = {}, callback) {
    // 레이아웃을 사용하지 않는 경우 (예: AJAX 요청)
    if (options.layout === false) {
      return originalRender.call(this, view, options, callback);
    }

    // 레이아웃 사용
    const layoutTemplate = options.layout || 'layout';

    // 페이지 콘텐츠를 먼저 렌더링
    originalRender.call(this, view, options, (err, html) => {
      if (err) {
        if (callback) return callback(err);
        throw err;
      }

      // 레이아웃에 body 변수 추가
      options.body = html;

      // 레이아웃 렌더링
      originalRender.call(res, layoutTemplate, options, callback);
    });
  };

  next();
});

// 글로벌 템플릿 변수 설정
app.use((req, res, next) => {
  res.locals.siteName = process.env.SITE_NAME || '다움연구소';
  res.locals.siteUrl = process.env.SITE_URL || 'http://localhost:3000';
  res.locals.siteDescription = process.env.SITE_DESCRIPTION || '개인과 조직의 다움을 발견하고 세우는 곳';
  res.locals.currentYear = new Date().getFullYear();
  res.locals.currentPath = req.path;
  next();
});

// 라우터 설정
const indexRouter = require('./routes/index');
const pagesRouter = require('./routes/pages');
const contactRouter = require('./routes/contact');

app.use('/', indexRouter);
app.use('/pages', pagesRouter);
app.use('/contact', contactLimiter, contactRouter);

// 404 에러 핸들링
app.use((req, res, next) => {
  const err = new Error(`페이지를 찾을 수 없습니다: ${req.originalUrl}`);
  err.status = 404;
  next(err);
});

// 에러 핸들링 미들웨어
app.use((err, req, res, next) => {
  // 로그 기록
  if (process.env.NODE_ENV === 'development') {
    console.error('Error:', err.message);
    console.error('Stack:', err.stack);
  }

  // 클라이언트에게 에러 응답
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'development'
    ? err.message
    : status === 404
      ? '페이지를 찾을 수 없습니다.'
      : '서버 내부 오류가 발생했습니다.';

  res.status(status);

  // AJAX 요청인 경우 JSON 응답
  if (req.xhr || req.headers.accept.indexOf('json') > -1) {
    res.json({
      error: message,
      status: status
    });
  } else {
    // 일반 요청인 경우 에러 페이지 렌더링
    res.render('pages/error', {
      title: `오류 ${status}`,
      error: message,
      status: status
    });
  }
});

// Vercel 환경에서는 graceful shutdown 처리를 하지 않음
if (!process.env.VERCEL && !process.env.NOW_REGION) {
  // Graceful shutdown 처리 (로컬 환경에서만)
  process.on('SIGTERM', () => {
    console.log('SIGTERM 신호를 받았습니다. 서버를 안전하게 종료합니다.');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    console.log('SIGINT 신호를 받았습니다. 서버를 안전하게 종료합니다.');
    process.exit(0);
  });
}

module.exports = app;