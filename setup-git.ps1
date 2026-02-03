# Git 저장소 초기 설정 스크립트

Write-Host "🔧 Git 저장소 초기 설정 중..." -ForegroundColor Cyan
Write-Host ""

# Git이 설치되어 있는지 확인
$gitPath = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitPath) {
    Write-Host "❌ Git이 설치되어 있지 않습니다." -ForegroundColor Red
    Write-Host ""
    Write-Host "Git 설치 방법:" -ForegroundColor Yellow
    Write-Host "1. https://git-scm.com/download/win 에서 Git 다운로드" -ForegroundColor White
    Write-Host "2. 설치 후 PowerShell을 재시작하세요" -ForegroundColor White
    Write-Host ""
    Write-Host "또는 Chocolatey를 사용하여 설치:" -ForegroundColor Yellow
    Write-Host "  choco install git" -ForegroundColor White
    exit 1
}

Write-Host "✅ Git 설치 확인됨: $($gitPath.Source)" -ForegroundColor Green
Write-Host ""

# Git 저장소 초기화
if (-not (Test-Path .git)) {
    Write-Host "📦 Git 저장소 초기화 중..." -ForegroundColor Cyan
    git init
    Write-Host "✅ Git 저장소 초기화 완료" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Git 저장소가 이미 초기화되어 있습니다." -ForegroundColor Yellow
}

# 기본 브랜치를 main으로 설정
Write-Host "🌿 브랜치 설정 중..." -ForegroundColor Cyan
git branch -M main 2>$null

# 원격 저장소 설정
$remoteUrl = git remote get-url origin -ErrorAction SilentlyContinue
if ($remoteUrl) {
    Write-Host "ℹ️  원격 저장소가 이미 설정되어 있습니다: $remoteUrl" -ForegroundColor Yellow
    $change = Read-Host "원격 저장소를 변경하시겠습니까? (y/n)"
    if ($change -eq "y") {
        git remote set-url origin https://github.com/donglesaen-dev/japan-quiz.git
        Write-Host "✅ 원격 저장소 업데이트 완료" -ForegroundColor Green
    }
} else {
    Write-Host "🔗 원격 저장소 연결 중..." -ForegroundColor Cyan
    git remote add origin https://github.com/donglesaen-dev/japan-quiz.git
    Write-Host "✅ 원격 저장소 연결 완료" -ForegroundColor Green
}

# .gitignore 확인
if (-not (Test-Path .gitignore)) {
    Write-Host "📝 .gitignore 파일 생성 중..." -ForegroundColor Cyan
    @"
node_modules/
.env
*.log
.DS_Store
dist/
build/
ai-code-tracking.db
새 폴더/
"@ | Out-File -FilePath .gitignore -Encoding UTF8
    Write-Host "✅ .gitignore 파일 생성 완료" -ForegroundColor Green
}

# 초기 커밋
$hasCommits = git log --oneline -1 -ErrorAction SilentlyContinue
if (-not $hasCommits) {
    Write-Host "💾 초기 커밋 생성 중..." -ForegroundColor Cyan
    git add .
    git commit -m "초기 커밋: 일본어 퀴즈 웹사이트"
    Write-Host "✅ 초기 커밋 완료" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Git 저장소 설정 완료!" -ForegroundColor Green
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Yellow
Write-Host "1. GitHub에 푸시: git push -u origin main" -ForegroundColor White
Write-Host "2. 자동 커밋: .\auto-commit.ps1 '커밋 메시지'" -ForegroundColor White
Write-Host "3. 파일 감시 모드: .\watch-and-commit.ps1" -ForegroundColor White
Write-Host ""
