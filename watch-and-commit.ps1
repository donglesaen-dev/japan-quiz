# 파일 변경 감지 및 자동 커밋/푸시 스크립트
# 이 스크립트는 파일이 변경될 때마다 자동으로 커밋하고 푸시합니다.

Write-Host "👀 파일 변경 감지 시작..." -ForegroundColor Cyan
Write-Host "종료하려면 Ctrl+C를 누르세요." -ForegroundColor Yellow
Write-Host ""

# Git이 설치되어 있는지 확인
$gitPath = Get-Command git -ErrorAction SilentlyContinue
if (-not $gitPath) {
    Write-Host "❌ Git이 설치되어 있지 않습니다." -ForegroundColor Red
    exit 1
}

# 원격 저장소 확인
$remoteUrl = git remote get-url origin -ErrorAction SilentlyContinue
if (-not $remoteUrl) {
    Write-Host "⚠️  원격 저장소가 설정되지 않았습니다." -ForegroundColor Yellow
    git remote add origin https://github.com/donglesaen-dev/japan-quiz.git
    Write-Host "✅ 원격 저장소 연결 완료" -ForegroundColor Green
}

# 감시할 파일 패턴 (제외할 파일)
$excludePatterns = @(
    "*node_modules*",
    "*.db",
    "*\.git*",
    "*\.log",
    "*\.env*",
    "*새 폴더*"
)

# 마지막 커밋 시간 추적
$lastCommitTime = Get-Date
$commitDelay = 10 # 변경 후 10초 대기 (여러 파일이 동시에 변경될 수 있으므로)

# 변경 이벤트 핸들러
$action = {
    $file = $Event.SourceEventArgs.Name
    $changeType = $Event.SourceEventArgs.ChangeType
    $fullPath = $Event.SourceEventArgs.FullPath
    
    # 제외할 파일인지 확인
    $shouldExclude = $false
    foreach ($pattern in $excludePatterns) {
        if ($file -like $pattern -or $fullPath -like "*$pattern*") {
            $shouldExclude = $true
            break
        }
    }
    
    if ($shouldExclude) {
        return
    }
    
    # 감시할 파일 확장자 확인
    $watchExtensions = @(".html", ".css", ".js", ".json", ".md", ".ps1", ".json")
    $fileExt = [System.IO.Path]::GetExtension($file)
    
    if ($watchExtensions -notcontains $fileExt -and $fileExt -ne "") {
        return
    }
    
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 📝 $changeType`: $file" -ForegroundColor Yellow
    
    # 마지막 변경 시간 업데이트
    $script:lastCommitTime = Get-Date
}

# FileSystemWatcher 생성
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $PSScriptRoot
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

# 이벤트 등록
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Deleted" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Renamed" -Action $action | Out-Null

# 자동 커밋 함수
function AutoCommit {
    $now = Get-Date
    $timeSinceLastChange = ($now - $script:lastCommitTime).TotalSeconds
    
    # 마지막 변경 후 일정 시간이 지났는지 확인
    if ($timeSinceLastChange -lt $commitDelay) {
        return
    }
    
    Write-Host "`n[$(Get-Date -Format 'HH:mm:ss')] 💾 자동 커밋 시작..." -ForegroundColor Cyan
    
    # 변경사항 확인
    git add .
    $status = git status --porcelain
    
    if ([string]::IsNullOrWhiteSpace($status)) {
        Write-Host "ℹ️  커밋할 변경사항이 없습니다." -ForegroundColor Yellow
        return
    }
    
    # 변경된 파일 목록 추출
    $changedFiles = ($status -split "`n" | ForEach-Object { ($_ -split '\s+')[1] }) -join ", "
    
    # 커밋 메시지 생성
    $commitMessage = "자동 커밋: $changedFiles 변경됨"
    
    # 커밋
    git commit -m $commitMessage
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 커밋 완료: $commitMessage" -ForegroundColor Green
        
        # 푸시
        Write-Host "🚀 GitHub에 푸시 중..." -ForegroundColor Cyan
        git push -u origin main
        
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ 푸시 완료!" -ForegroundColor Green
        } else {
            Write-Host "⚠️  푸시 실패. 나중에 수동으로 푸시해주세요." -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ 커밋 실패" -ForegroundColor Red
    }
    
    Write-Host ""
}

# 주기적으로 자동 커밋 체크 (5초마다)
$timer = New-Object System.Timers.Timer
$timer.Interval = 5000 # 5초
$timer.AutoReset = $true
$timer.Add_Elapsed({
    AutoCommit
})
$timer.Start()

try {
    Write-Host "✅ 파일 감시 시작됨. 파일을 수정하면 자동으로 커밋됩니다." -ForegroundColor Green
    Write-Host ""
    
    # 무한 대기
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # 정리
    $timer.Stop()
    $timer.Dispose()
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "`n👋 파일 감지 종료" -ForegroundColor Cyan
}
