# 파일 변경 감지 및 자동 커밋 스크립트
# 이 스크립트는 파일이 변경될 때마다 자동으로 커밋하고 푸시합니다.

Write-Host "👀 파일 변경 감지 시작..." -ForegroundColor Cyan
Write-Host "종료하려면 Ctrl+C를 누르세요." -ForegroundColor Yellow
Write-Host ""

$lastCommit = Get-Date

# 감시할 파일 패턴
$watchPatterns = @("*.html", "*.css", "*.js", "*.json", "*.md")

# FileSystemWatcher 생성
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $PSScriptRoot
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

# 변경 이벤트 핸들러
$action = {
    $file = $Event.SourceEventArgs.Name
    $changeType = $Event.SourceEventArgs.ChangeType
    
    # node_modules는 무시
    if ($file -like "*node_modules*" -or $file -like "*.db" -or $file -like "*\.git*") {
        return
    }
    
    # 감시할 파일인지 확인
    $shouldWatch = $false
    foreach ($pattern in $watchPatterns) {
        if ($file -like $pattern) {
            $shouldWatch = $true
            break
        }
    }
    
    if (-not $shouldWatch) {
        return
    }
    
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 📝 $changeType`: $file" -ForegroundColor Yellow
    
    # 5초 대기 (여러 파일이 동시에 변경될 수 있으므로)
    Start-Sleep -Seconds 5
    
    # 자동 커밋 스크립트 실행
    $commitMessage = "자동 커밋: $file 변경됨 ($changeType)"
    & "$PSScriptRoot\auto-commit.ps1" -Message $commitMessage
}

# 이벤트 등록
Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Created" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Deleted" -Action $action | Out-Null
Register-ObjectEvent -InputObject $watcher -EventName "Renamed" -Action $action | Out-Null

try {
    # 무한 대기
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    # 정리
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "`n👋 파일 감지 종료" -ForegroundColor Cyan
}
