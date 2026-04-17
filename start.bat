@echo off
echo Starting AI Counselling Chatbot with Qwen 3.5:1b...
echo.

echo Checking Ollama and Qwen model...
ollama list | findstr "qwen3.5:1b"
if errorlevel 1 (
    echo WARNING: qwen3.5:1b model not found
    echo Please run: ollama pull qwen3.5:1b
    echo.
)

ollama list
if errorlevel 1 (
    echo ERROR: Ollama is not installed or not running
    echo Please install Ollama from https://ollama.com/download/windows
    pause
    exit /b 1
)

echo.
echo Starting backend server...
start cmd /k "cd server && npm start"

timeout /t 3 /nobreak > nul

echo.
echo Starting frontend...
start cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:4000
echo Frontend: http://localhost:5173
echo.
pause
