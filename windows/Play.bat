@echo off
set "GAME_FILE=%~dp0Thien-Menh.html"
if not exist "%GAME_FILE%" goto missing
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" goto edge32
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" goto edge64
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" goto chrome64
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" goto chromeuser
echo Drag Thien-Menh.html into an Edge or Google Chrome window.
echo Or run Serve-with-Python.bat if Python 3 is installed.
pause
exit /b 1
:edge32
start "" "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" "%GAME_FILE%"
exit /b 0
:edge64
start "" "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" "%GAME_FILE%"
exit /b 0
:chrome64
start "" "%ProgramFiles%\Google\Chrome\Application\chrome.exe" "%GAME_FILE%"
exit /b 0
:chromeuser
start "" "%LocalAppData%\Google\Chrome\Application\chrome.exe" "%GAME_FILE%"
exit /b 0
:missing
echo Cannot find Thien-Menh.html. Extract the entire ZIP first.
pause
exit /b 1
