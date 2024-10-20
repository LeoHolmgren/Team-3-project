@echo off

:: Go to api directory
set OLDDIR=%CD%
cd %~dp0..\api

:: Run API
call .\.venv\Scripts\activate
call %~dp0\set-env
set PYTHONPATH=%~dp0..\
python services.py
call deactivate
cd %OLDDIR%