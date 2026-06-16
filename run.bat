@echo off
echo Starting GramSetu Backend Server...
start cmd /k "cd Backend && npm run dev"

echo Starting GramSetu Frontend Dev Server...
timeout /t 2
start cmd /k "cd Frontend && npm run dev"

echo Both servers launched! Keep the command prompt windows open while browsing.
