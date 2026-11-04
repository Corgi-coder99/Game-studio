@echo off
cd /d "%~dp0"
py -3 -c "import sys; assert sys.version_info.major == 3" >nul 2>&1
if not errorlevel 1 goto use_py
python -c "import sys; assert sys.version_info.major == 3" >nul 2>&1
if not errorlevel 1 goto use_python
echo Khong tim thay Python 3.
echo Ban van co the nhan dup CHOI-NGAY.bat hoac Thien-Menh.html de choi.
pause
exit /b 1
:use_py
py -3 "%~dp0chay_game.py"
goto finished
:use_python
python "%~dp0chay_game.py"
:finished
if errorlevel 1 pause
