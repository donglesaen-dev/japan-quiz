# Git 자동 커밋 설정 가이드

GitHub 저장소와 자동으로 연동되도록 설정하는 방법입니다.

## 1단계: Git 설치 확인

Git이 설치되어 있지 않다면:
1. https://git-scm.com/download/win 에서 Git 다운로드
2. 설치 후 PowerShell 재시작

## 2단계: 초기 설정

PowerShell에서 다음 명령어 실행:

```powershell
.\setup-git.ps1
```

이 스크립트는:
- Git 저장소 초기화
- GitHub 원격 저장소 연결
- .gitignore 설정
- 초기 커밋 생성

## 3단계: GitHub에 푸시

```powershell
git push -u origin main
```

## 자동 커밋 사용 방법

### 방법 1: 수동 커밋 (권장)

파일을 수정한 후:

```powershell
.\auto-commit.ps1 "변경 사항 설명"
```

예시:
```powershell
.\auto-commit.ps1 "UI 개선 및 버그 수정"
```

### 방법 2: 자동 감시 모드

파일이 변경될 때마다 자동으로 커밋하고 푸시:

```powershell
.\watch-and-commit.ps1
```

⚠️ **주의**: 자동 감시 모드는 모든 변경사항을 자동으로 커밋하므로, 테스트 중인 파일도 커밋될 수 있습니다.

## GitHub 인증

처음 푸시할 때 GitHub 인증이 필요할 수 있습니다:

1. **Personal Access Token 사용 (권장)**
   - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - `repo` 권한으로 토큰 생성
   - 푸시 시 비밀번호 대신 토큰 사용

2. **GitHub CLI 사용**
   ```powershell
   winget install --id GitHub.cli
   gh auth login
   ```

## 문제 해결

### Git이 인식되지 않는 경우

PowerShell을 관리자 권한으로 실행하고:
```powershell
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\Git\cmd", "User")
```

### 원격 저장소 연결 오류

```powershell
git remote remove origin
git remote add origin https://github.com/donglesaen-dev/japan-quiz.git
```

### 브랜치 이름 오류

```powershell
git branch -M main
git push -u origin main
```

## 스크립트 설명

- `setup-git.ps1`: Git 저장소 초기 설정
- `auto-commit.ps1`: 수동 커밋 및 푸시
- `watch-and-commit.ps1`: 파일 변경 감지 및 자동 커밋
