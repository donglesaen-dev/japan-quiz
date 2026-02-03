# Resend API 키 설정 가이드

## 방법 1: PowerShell에서 직접 설정 (현재 세션만 유지)

PowerShell을 열고 다음 명령어를 실행하세요:

```powershell
$env:RESEND_API_KEY="여기에_당신의_API_키_입력"
```

예시:
```powershell
$env:RESEND_API_KEY="re_1234567890abcdef"
```

**주의**: 이 방법은 PowerShell 창을 닫으면 사라집니다.

## 방법 2: 시스템 환경 변수로 영구 설정 (권장)

### Windows 설정에서 설정하기

1. **시작 메뉴** → **"환경 변수"** 검색
2. **"시스템 환경 변수 편집"** 선택
3. **"환경 변수"** 버튼 클릭
4. **"사용자 변수"** 섹션에서 **"새로 만들기"** 클릭
5. 변수 이름: `RESEND_API_KEY`
6. 변수 값: `여기에_당신의_API_키_입력`
7. **확인** 클릭

### PowerShell에서 영구 설정하기

```powershell
[System.Environment]::SetEnvironmentVariable("RESEND_API_KEY", "여기에_당신의_API_키_입력", "User")
```

**주의**: 이 명령어 실행 후 PowerShell을 재시작해야 합니다.

## 방법 3: .env 파일 사용 (가장 안정적)

1. 프로젝트 폴더에 `.env` 파일 생성
2. 파일 내용:
```
RESEND_API_KEY=여기에_당신의_API_키_입력
```

3. `dotenv` 패키지 설치:
```powershell
npm install dotenv
```

4. `server.js` 파일 맨 위에 추가:
```javascript
require('dotenv').config();
```

## Resend API 키 발급 방법

1. https://resend.com 접속
2. 로그인 또는 회원가입
3. **Settings** → **API Keys** 메뉴로 이동
4. **Create API Key** 버튼 클릭
5. API 키 복사 (한 번만 보여줌!)

## 설정 확인 방법

서버를 실행한 후 콘솔에서 확인:
- ✅ 설정됨: `🔑 Resend API 키: ✅ 설정됨`
- ❌ 설정 안됨: `🔑 Resend API 키: ❌ 설정되지 않음`

또는 브라우저에서 `http://localhost:3000/api/health` 접속하여 확인 가능합니다.
