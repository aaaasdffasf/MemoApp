// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // '/api'로 시작하는 모든 요청을 백엔드 서버로 프록시 설정
    createProxyMiddleware({
      target: 'http://localhost:8080', // 백엔드 서버 주소
      changeOrigin: true, // 필요시 호스트 헤더 변경
    })
  );
};
