# Vercel 배포 가이드

## 1단계: Vercel에 프로젝트 연결

### 방법 A: Vercel 웹사이트에서

1. https://vercel.com 접속 및 로그인
2. **Add New Project** 클릭
3. GitHub 저장소 선택: `donglesaen-dev/japan-quiz`
4. **Import** 클릭

### 방법 B: Vercel CLI 사용

```powershell
# Vercel CLI 설치
npm i -g vercel

# 프로젝트 폴더에서 실행
vercel
```

## 2단계: 환경 변수 설정 (중요!)

### Vercel 대시보드에서 설정

1. Vercel 프로젝트 페이지로 이동
2. **Settings** 탭 클릭
3. **Environment Variables** 메뉴 선택
4. 다음 환경 변수 추가:

   **변수 이름**: `RESEND_API_KEY`
   
   **변수 값**: `여기에_당신의_Resend_API_키_입력`
   
   **Environment**: 
   - ✅ Production
   - ✅ Preview
   - ✅ Development

5. **Save** 클릭

### Vercel CLI로 설정

```powershell
vercel env add RESEND_API_KEY
# 프롬프트에 API 키 입력
```

## 3단계: 배포

### 자동 배포 (GitHub 연동 시)

- GitHub에 푸시하면 자동으로 배포됩니다
- `main` 브랜치에 푸시하면 Production 배포
- 다른 브랜치에 푸시하면 Preview 배포

### 수동 배포

```powershell
vercel --prod
```

## 4단계: 배포 확인

1. Vercel 대시보드에서 배포 상태 확인
2. 배포 완료 후 제공되는 URL로 접속
3. 웹사이트가 정상 작동하는지 확인

## 환경 변수 확인

배포 후 다음 URL로 접속하여 환경 변수가 제대로 설정되었는지 확인:

```
https://your-project.vercel.app/api/health
```

응답 예시:
```json
{
  "status": "ok",
  "hasApiKey": true,
  "port": 3000
}
```

## 문제 해결

### 환경 변수가 설정되지 않음

1. Vercel 대시보드 → Settings → Environment Variables 확인
2. 모든 환경(Production, Preview, Development)에 설정되어 있는지 확인
3. 배포를 다시 트리거 (Redeploy)

### API 호출 오류

1. 브라우저 개발자 도구(F12) → Network 탭 확인
2. API 요청이 올바른 URL로 가는지 확인
3. CORS 오류가 있는지 확인

### 이메일이 전송되지 않음

1. Vercel 함수 로그 확인 (Vercel 대시보드 → Functions 탭)
2. Resend API 키가 유효한지 확인
3. Resend 대시보드에서 이메일 전송 내역 확인

## 파일 구조

```
.
├── api/
│   ├── contact.js      # 연락 API
│   └── send-score.js   # 성적표 API
├── index.html
├── script.js
├── styles.css
├── quiz-data.js
├── vercel.json         # Vercel 설정
└── package.json
```

## 참고사항

- Vercel은 serverless functions를 사용하므로 Express 서버가 아닌 개별 API 함수로 변환했습니다
- 모든 API는 `/api/` 경로로 접근 가능합니다
- 환경 변수는 배포 시 자동으로 주입됩니다
