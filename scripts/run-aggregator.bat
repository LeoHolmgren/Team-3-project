@echo off

:: Go to aggregator directory
set OLDDIR=%CD%
cd %~dp0..\aggregator

:: Run API
call .\.venv\Scripts\activate
set PYTHONPATH=%~dp0..\
python api.py
call deactivate
cd %OLDDIR%
