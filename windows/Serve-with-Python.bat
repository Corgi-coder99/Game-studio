@echo off
cd /d "%~dp0"
py -3 -c "import sys; assert sys.version_info.major == 3" >nul 2>&1
if not errorlevel 1 goto use_py
python -c "import sys; assert sys.version_info.major == 3" >nul 2>&1
if not errorlevel 1 goto use_python
echo Python 3 was not found.
echo You can still double-click Play.bat or Thien-Menh.html to play.
pause
exit /b 1
:use_py
py -3 "%~dp0serve_game.py"
goto finished
:use_python
python "%~dp0serve_game.py"
:finished
if errorlevel 1 pause
