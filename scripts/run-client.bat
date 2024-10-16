@echo off

:: Go to app directory
set OLDDIR=%CD%
cd %~dp0..\app
echo Yes|copy /-Y %~dp0..\config.env %~dp0..\app\.env.local
npm run dev
cd %OLDDIR%
