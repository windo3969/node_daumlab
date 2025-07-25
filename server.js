const app = require('./app');
require('dotenv').config();

// Vercel 환경에서는 앱만 내보냄
if (process.env.VERCEL || process.env.NOW_REGION) {
  module.exports = app;
} else {
  // 로컬 환경에서만 서버 시작
  const PORT = process.env.PORT || 3000;
  const HOST = process.env.HOST || 'localhost';
  const NODE_ENV = process.env.NODE_ENV || 'development';

  const server = app.listen(PORT, HOST, () => {
    console.log('='.repeat(50));
    console.log(`🏢 다움연구소 웹사이트 서버가 시작되었습니다!`);
    console.log(`🌐 환경: ${NODE_ENV}`);
    console.log(`📍 주소: http://${HOST}:${PORT}`);
    console.log(`⏰ 시작 시간: ${new Date().toLocaleString('ko-KR')}`);
    console.log('='.repeat(50));
  });

  // 기본 에러 핸들링만 유지
  server.on('error', (error) => {
    console.error('서버 에러:', error);
    process.exit(1);
  });

  module.exports = server;
}