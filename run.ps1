# Start GramSetu Backend Server in a new window
Write-Host "Starting GramSetu Backend Server..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Backend; npm run dev"

# Start GramSetu Frontend Server in a new window
Write-Host "Starting GramSetu Frontend Server..." -ForegroundColor Green
Start-Sleep -s 1
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Frontend; npm run dev"

Write-Host "Both servers launched! Check the new terminal windows." -ForegroundColor Yellow
