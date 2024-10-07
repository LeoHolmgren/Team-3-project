@echo off

:: Go to api directory
cd %~dp0..\aggregator

:: Run API
call .\.venv\Scripts\activate
python api.py
call deactivate
