const app = require('./app');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';
const NODE_ENV = process.env.NODE_ENV || 'development';

// 서버 시작
const server = app.listen(PORT, HOST, () => {
  console.log('='.repeat(50));
  console.log(`🏢 다움연구소 웹사이트 서버가 시작되었습니다!`);
  console.log(`🌐 환경: ${NODE_ENV}`);
  console.log(`📍 주소: http://${HOST}:${PORT}`);
  console.log(`⏰ 시작 시간: ${new Date().toLocaleString('ko-KR')}`);
  console.log('='.repeat(50));
  
  if (NODE_ENV === 'development') {
    console.log('\n📋 개발 모드 안내:');
    console.log('  • 파일 변경 시 자동 재시작됩니다 (nodemon)');
    console.log('  • 상세한 로그가 출력됩니다');
    console.log('  • 에러 스택 트레이스가 표시됩니다');
    console.log('  • Ctrl+C로 서버를 종료할 수 있습니다\n');
  }
});

// 서버 에러 핸들링
server.on('error', (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof PORT === 'string' ? 'Pipe ' + PORT : 'Port ' + PORT;

  switch (error.code) {
    case 'EACCES':
      console.error(`❌ ${bind}에 접근 권한이 없습니다. 관리자 권한이 필요합니다.`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`❌ ${bind}가 이미 사용 중입니다. 다른 포트를 사용해주세요.`);
      console.log(`💡 다른 포트로 실행하려면: PORT=3001 npm run dev`);
      process.exit(1);
      break;
    default:
      throw error;
  }
});

// 프로세스 종료 신호 처리
process.on('SIGTERM', () => {
  console.log('\n🛑 SIGTERM 신호를 받았습니다.');
  console.log('⏳ 서버를 안전하게 종료하는 중...');
  
  server.close(() => {
    console.log('✅ 서버가 안전하게 종료되었습니다.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n\n🛑 사용자가 서버 종료를 요청했습니다.');
  console.log('⏳ 서버를 안전하게 종료하는 중...');
  
  server.close(() => {
    console.log('✅ 서버가 안전하게 종료되었습니다.');
    console.log('👋 다음에 또 만나요!');
    process.exit(0);
  });
});

// 예상치 못한 에러 처리
process.on('uncaughtException', (error) => {
  console.error('❌ 예상치 못한 에러가 발생했습니다:');
  console.error(error);
  console.log('🔄 서버를 재시작해주세요.');
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ 처리되지 않은 Promise 거부:');
  console.error('Promise:', promise);
  console.error('Reason:', reason);
  console.log('🔄 서버를 재시작해주세요.');
  process.exit(1);
});

module.exports = server;