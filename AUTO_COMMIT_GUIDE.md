# 자동 커밋 가이드

파일이 변경될 때마다 자동으로 Git 커밋하고 GitHub에 푸시하는 방법입니다.

## 빠른 시작

### 방법 1: PowerShell 스크립트 실행

```powershell
.\start-auto-commit.ps1
```

또는 직접 실행:

```powershell
.\watch-and-commit.ps1
```

### 방법 2: npm 스크립트 사용

```powershell
npm run auto-commit
```

## 작동 방식

1. **파일 감시**: 프로젝트 폴더의 파일 변경을 감지합니다
2. **자동 스테이징**: 변경된 파일을 자동으로 `git add` 합니다
3. **자동 커밋**: 변경사항을 자동으로 커밋합니다
4. **자동 푸시**: GitHub에 자동으로 푸시합니다

## 감시되는 파일

- `.html`, `.css`, `.js`, `.json`, `.md`, `.ps1` 파일
- `api/` 폴더의 파일들

## 제외되는 파일

- `node_modules/`
- `*.db` 파일
- `.git/` 폴더
- `.log` 파일
- `.env` 파일
- `새 폴더/`

## 커밋 메시지

자동으로 생성되는 커밋 메시지 형식:
```
자동 커밋: index.html, script.js 변경됨
```

## 설정

### 커밋 지연 시간 변경

`watch-and-commit.ps1` 파일에서 다음 줄을 수정:

```powershell
$commitDelay = 10 # 초 단위 (기본값: 10초)
```

파일 변경 후 이 시간만큼 대기한 후 커밋합니다. 여러 파일이 동시에 변경될 때를 대비한 설정입니다.

### 감시 간격 변경

```powershell
$timer.Interval = 5000 # 밀리초 단위 (기본값: 5초)
```

## 중지 방법

1. 실행 중인 PowerShell 창에서 `Ctrl+C` 누르기
2. PowerShell 창 닫기

## 문제 해결

### Git이 인식되지 않음

PowerShell을 재시작하거나 Git 경로를 확인하세요.

### 푸시 실패

인증 문제일 수 있습니다. GitHub 인증을 확인하세요:

```powershell
git config --global user.email "donglesaen@gmail.com"
git config --global user.name "donglesaen-dev"
```

### 파일이 감지되지 않음

파일 확장자가 감시 목록에 있는지 확인하세요. 필요하면 `watch-and-commit.ps1`의 `$watchExtensions` 배열에 추가하세요.

## 주의사항

⚠️ **자동 커밋은 편리하지만 주의가 필요합니다:**

- 테스트 중인 코드도 커밋될 수 있습니다
- 민감한 정보가 포함된 파일은 `.gitignore`에 추가하세요
- 중요한 변경사항은 수동으로 커밋하는 것을 권장합니다

## 수동 커밋 (권장)

자동 커밋 대신 수동으로 커밋하려면:

```powershell
.\auto-commit.ps1 "변경 사항 설명"
```

이 방법은 더 안전하고 커밋 메시지를 직접 작성할 수 있습니다.
