@echo off

:: Go to api directory
set OLDDIR=%CD%
cd %~dp0..\tests

:: Run API
call .\.venv\Scripts\activate
set PYTHONPATH=%~dp0..\
python test-api.py
call deactivate
cd %OLDDIR%
