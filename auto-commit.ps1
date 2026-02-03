# 자동 Git 커밋 및 푸시 스크립트
# 사용법: .\auto-commit.ps1 "커밋 메시지"

param(
    [string]$Message = "자동 커밋: 파일 업데이트"
)

# Git이 설치되어 있는지 확인
$gitPath = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitPath) {
    Write-Host "❌ Git이 설치되어 있지 않습니다." -ForegroundColor Red
    Write-Host "Git을 설치해주세요: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# 현재 디렉토리가 Git 저장소인지 확인
if (-not (Test-Path .git)) {
    Write-Host "📦 Git 저장소 초기화 중..." -ForegroundColor Cyan
    git init
    
    # .gitignore가 없으면 생성
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
    }
}

# 원격 저장소 확인 및 설정
$remoteUrl = git remote get-url origin -ErrorAction SilentlyContinue
if (-not $remoteUrl) {
    Write-Host "🔗 원격 저장소 연결 중..." -ForegroundColor Cyan
    git remote add origin https://github.com/donglesaen-dev/japan-quiz.git
    Write-Host "✅ 원격 저장소 연결 완료" -ForegroundColor Green
}

# 모든 변경사항 스테이징
Write-Host "📋 변경사항 스테이징 중..." -ForegroundColor Cyan
git add .

# 변경사항이 있는지 확인
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "ℹ️  커밋할 변경사항이 없습니다." -ForegroundColor Yellow
    exit 0
}

# 커밋
Write-Host "💾 커밋 중: $Message" -ForegroundColor Cyan
git commit -m $Message

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 커밋 완료!" -ForegroundColor Green
    
    # 푸시
    Write-Host "🚀 GitHub에 푸시 중..." -ForegroundColor Cyan
    git push -u origin main
    
    if ($LASTEXITCODE -ne 0) {
        # main 브랜치가 없으면 master로 시도
        git push -u origin master
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 푸시 완료!" -ForegroundColor Green
    } else {
        Write-Host "⚠️  푸시 실패. 수동으로 푸시해주세요." -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ 커밋 실패" -ForegroundColor Red
    exit 1
}
