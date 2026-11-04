@echo off
if not exist "%~dp0Thien-Menh.html" goto missing
start "" "%~dp0Thien-Menh.html"
exit /b 0
:missing
echo Khong tim thay Thien-Menh.html. Hay giai nen toan bo ZIP truoc.
pause
exit /b 1
