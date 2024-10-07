@echo off

:: Go to api directory
cd %~dp0..\api

:: Run API
call .\.venv\Scripts\activate
fastapi dev main.py
call deactivate
