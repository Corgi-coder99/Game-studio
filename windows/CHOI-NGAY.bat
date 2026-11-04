@echo off
set "GAME_FILE=%~dp0Thien-Menh.html"
if not exist "%GAME_FILE%" goto missing
if exist "%ProgramFiles(x86)%\Microsoft\Edge\Application\msedge.exe" goto edge32
if exist "%ProgramFiles%\Microsoft\Edge\Application\msedge.exe" goto edge64
if exist "%ProgramFiles%\Google\Chrome\Application\chrome.exe" goto chrome64
if exist "%LocalAppData%\Google\Chrome\Application\chrome.exe" goto chromeuser
echo Hay keo tep Thien-Menh.html vao cua so Edge hoac Google Chrome.
echo Hoac chay CHAY-BANG-PYTHON.bat neu may co Python 3.
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
echo Khong tim thay Thien-Menh.html. Hay giai nen toan bo ZIP truoc.
pause
exit /b 1
