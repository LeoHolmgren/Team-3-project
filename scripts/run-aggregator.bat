@echo off

:: Go to aggregator directory
cd %~dp0..\aggregator

:: Run API
call .\.venv\Scripts\activate
python api.py
call deactivate
