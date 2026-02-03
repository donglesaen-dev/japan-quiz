# 일본어 퀴즈 웹사이트

일본어 실력을 테스트할 수 있는 인터랙티브 퀴즈 웹사이트입니다.

## 기능

- 📝 다양한 유형의 일본어 퀴즈 (단어 번역, 한자 읽기, 문장 번역, 로마자 입력)
- 📊 실시간 점수 및 진행률 표시
- 📧 연락 기능 (이름/연락처/이메일 입력)
- 📨 성적표 이메일 전송 기능
- 🎨 인스타그램 스타일의 깔끔한 디자인

## 설치 및 실행

### 1. 의존성 설치

```bash
npm install
```

### 2. Resend API 키 설정

Resend 계정을 만들고 API 키를 발급받은 후, 환경 변수로 설정하세요:

**Windows (PowerShell):**
```powershell
$env:RESEND_API_KEY="your_resend_api_key_here"
```

**Windows (CMD):**
```cmd
set RESEND_API_KEY=your_resend_api_key_here
```

**Linux/Mac:**
```bash
export RESEND_API_KEY="your_resend_api_key_here"
```

또는 `.env` 파일을 생성하여 설정할 수 있습니다 (dotenv 패키지 사용 시).

### 3. 서버 실행

```bash
npm start
```

또는 개발 모드 (자동 재시작):

```bash
npm run dev
```

서버가 `http://localhost:3000`에서 실행됩니다.

### 4. 웹사이트 열기

브라우저에서 `index.html` 파일을 열거나, 로컬 서버를 사용하여 열 수 있습니다.

## Resend 설정

1. [Resend](https://resend.com)에 가입
2. API 키 발급
3. 도메인 인증 (또는 테스트용으로 `onboarding@resend.dev` 사용)
4. 환경 변수에 API 키 설정

## 파일 구조

```
.
├── index.html          # 메인 HTML 파일
├── styles.css          # 스타일시트
├── script.js           # 프론트엔드 JavaScript
├── quiz-data.js        # 퀴즈 데이터
├── server.js           # Express 서버 (이메일 전송)
├── package.json        # Node.js 의존성
└── README.md          # 이 파일
```

## API 엔드포인트

### POST /api/contact
연락 정보를 전송합니다.

**요청 본문:**
```json
{
  "name": "홍길동",
  "phone": "010-1234-5678",
  "email": "user@example.com",
  "message": "안녕하세요"
}
```

### POST /api/send-score
성적표를 이메일로 전송합니다.

**요청 본문:**
```json
{
  "email": "user@example.com",
  "score": 8,
  "total": 10,
  "percentage": 80,
  "message": "훌륭합니다!",
  "date": "2024-01-01 12:00:00"
}
```

## 주의사항

- Resend API 키는 절대 클라이언트 코드에 노출하지 마세요.
- 프로덕션 환경에서는 환경 변수나 안전한 설정 관리 도구를 사용하세요.
- CORS 설정이 필요할 수 있습니다 (현재 모든 도메인 허용).

## 라이선스

MIT
