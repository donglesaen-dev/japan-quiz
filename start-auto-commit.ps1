# 자동 커밋 스크립트 시작
# 이 스크립트는 백그라운드에서 실행되어 파일 변경을 감지하고 자동으로 커밋합니다.

$scriptPath = Join-Path $PSScriptRoot "watch-and-commit.ps1"

Write-Host "🚀 자동 커밋 스크립트 시작 중..." -ForegroundColor Cyan
Write-Host ""

# PowerShell 창을 새로 열어서 실행 (백그라운드 실행)
Start-Process powershell -ArgumentList "-NoExit", "-File", "`"$scriptPath`""

Write-Host "✅ 자동 커밋 스크립트가 새 창에서 실행되었습니다." -ForegroundColor Green
Write-Host "파일을 수정하면 자동으로 커밋되고 푸시됩니다." -ForegroundColor Yellow
Write-Host "종료하려면 새로 열린 PowerShell 창을 닫으세요." -ForegroundColor Yellow
