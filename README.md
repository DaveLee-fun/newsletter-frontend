# AI Pulse Newsletter - Frontend

데이터 기반 AI 인사이트 뉴스레터 "AI Pulse"의 프론트엔드 웹사이트입니다.

## 🧠 프로젝트 개요

AI Pulse는 Reddit, Hacker News, Twitter, Discord 등 글로벌 AI 커뮤니티를 실시간 분석하여 가장 핫한 AI 뉴스와 트렌드를 매주 전달하는 뉴스레터 서비스입니다.

## 🚀 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: 커스텀 애니메이션 및 반응형 디자인
- **Tailwind CSS**: 유틸리티 기반 CSS 프레임워크
- **Vanilla JavaScript**: ES6+ 문법 사용
- **FastAPI Backend**: RESTful API 통신
- **Font Awesome**: 아이콘
- **Google Fonts**: Inter 폰트

## 📁 파일 구조

```
frontend/
├── index.html          # 메인 HTML 파일
├── css/
│   └── styles.css      # 커스텀 CSS 스타일
├── js/
│   └── main.js         # 메인 JavaScript 로직
└── README.md           # 이 파일
```

## 🎨 주요 기능

### 1. 반응형 디자인
- 모바일, 태블릿, 데스크탑 모든 디바이스 지원
- Tailwind CSS를 활용한 현대적 UI/UX

### 2. 애니메이션 효과
- 스크롤 기반 애니메이션
- 로딩 상태 표시
- 부드러운 호버 효과
- 카운터 애니메이션

### 3. 뉴스레터 구독 시스템
- 실시간 이메일 유효성 검사
- 중복 구독 방지
- 성공/오류 메시지 표시
- FastAPI 백엔드와 RESTful API 통신
- 실시간 구독자 수 조회

### 4. 사용자 경험 최적화
- 빠른 로딩 시간
- 접근성 고려 (ARIA, 키보드 네비게이션)
- SEO 최적화
- 프로그레시브 웹앱 기능

## 🔧 설정 및 실행

### 1. 로컬 개발 환경

```bash
# 로컬 서버 실행 (Live Server 등 사용)
# 또는 간단한 HTTP 서버
python -m http.server 8000
# 또는
npx serve .
```

### 2. GitHub Pages 배포

1. GitHub 저장소에 파일 업로드
2. Settings > Pages에서 배포 설정
3. 자동으로 `https://username.github.io/repository-name`에서 접근 가능

### 3. API 백엔드 설정

`js/main.js` 파일에서 백엔드 API URL을 확인하세요:

```javascript
const API_BASE_URL = 'http://localhost:8000'; // 로컬 개발환경
// const API_BASE_URL = 'https://your-app.onrender.com'; // 프로덕션 환경
```

백엔드 서버가 실행 중이어야 구독 기능이 정상 작동합니다.

## 📡 API 엔드포인트

Frontend에서 사용하는 주요 API 엔드포인트:

### 1. 뉴스레터 구독
```
POST /subscribe
Content-Type: application/json

{
  "email": "user@example.com",
  "name": "홍길동",
  "source": "website"
}
```

### 2. 구독자 수 조회
```
GET /subscribers/count
```

자세한 API 문서는 `backend/README.md`를 참조하세요.

## 🎯 주요 컴포넌트

### 1. 히어로 섹션
- 메인 헤드라인과 구독 폼
- 데이터 소스 표시
- CTA (Call to Action) 버튼

### 2. 데이터 분석 섹션
- 실시간 통계 표시
- 플랫폼 모니터링 현황
- 애니메이션된 카운터

### 3. 기능 섹션
- AI 알고리즘 큐레이션 설명
- 6개 주요 기능 카드
- 그라디언트 배경 효과

### 4. 사회적 증명 섹션
- 구독자 통계
- 사용자 증언 (testimonials)
- 별점 시스템

### 5. CTA 섹션
- 두 번째 구독 기회
- 그라디언트 배경
- 강조된 메시지

## 🔍 SEO 최적화

- 메타 태그 최적화
- 구조화된 데이터 (JSON-LD)
- Open Graph 태그
- 시맨틱 HTML 구조
- 이미지 alt 텍스트
- 사이트맵 생성

## 📱 접근성 (Accessibility)

- ARIA 라벨 및 역할
- 키보드 네비게이션 지원
- 색상 대비 최적화
- 스크린 리더 지원
- 포커스 관리

## ⚡ 성능 최적화

- CSS/JS 최소화
- 이미지 최적화
- 지연 로딩 (Lazy Loading)
- 캐싱 전략
- CDN 활용

## 🔐 보안 고려사항

- XSS 방지
- CSRF 보호
- 입력 데이터 검증
- HTTPS 사용 권장
- Content Security Policy

## 📈 분석 및 추적

- Google Analytics 통합 준비
- 이벤트 추적 (구독, 클릭 등)
- 사용자 행동 분석
- A/B 테스트 지원

## 🤝 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 라이선스

이 프로젝트는 MIT 라이선스를 따릅니다.

## 📞 연락처

- 이메일: contact@aipulse.com
- 웹사이트: https://aipulse.com
- GitHub: https://github.com/aipulse/newsletter-frontend

---

**AI Pulse Newsletter** - 데이터로 읽어내는 AI 트렌드 🧠 